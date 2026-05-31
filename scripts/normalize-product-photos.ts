/**
 * Script: normalize-product-photos
 *
 * Normaliza fotos de productos para que el anteojo aparezca centrado al
 * ~92% del frame en canvas 2000×1333 (aspect 3:2). Elimina la necesidad
 * de `image-scale-overrides.ts` per-producto.
 *
 * Pipeline:
 * 1. Input: foto raw del fabricante (cualquier resolución, cualquier
 *    proporción anteojo/frame).
 * 2. Claude Vision detecta bbox del anteojo en pixels (tool use).
 * 3. Sharp recorta + redimensiona + centra en canvas blanco 2000×1333
 *    con padding tal que el anteojo ocupe ~92% del ancho disponible.
 *
 * Uso:
 *   pnpm tsx scripts/normalize-product-photos.ts --input <file-or-dir> [--output <dir>]
 *
 * Ejemplos:
 *   pnpm tsx scripts/normalize-product-photos.ts --input ~/Desktop/raw-rusty-feeled.jpg
 *   pnpm tsx scripts/normalize-product-photos.ts --input ~/Desktop/raw --output ~/Desktop/normalized
 *
 * Default output dir: `<input-dir>/normalized/` (si input es dir) o
 *   `<input-file-parent>/normalized/` (si input es file).
 *
 * Requisitos env:
 *   - ANTHROPIC_API_KEY (para Vision bbox detection)
 *
 * Costo: ~$0.001 USD por foto (Haiku 4.5 Vision con tool use).
 *
 * NOTAS DE DISEÑO:
 *
 * - Modelo: Claude Haiku 4.5 (más barato, suficiente para bbox de anteojo
 *   sobre fondo blanco/contextual). Sonnet sería overkill.
 * - Output canvas 2000×1333 (aspect 3:2) para matchear el `aspect-[3/2]`
 *   del ProductCard container.
 * - Anteojo a 92% del ancho disponible (no 100% — deja respiro visual
 *   uniforme entre productos).
 * - Fondo blanco puro (#ffffff) → matchea con `bg-background` del
 *   container (commit 276ae5a iter 3 grid Rusty).
 * - Si la foto original tiene fondo NO blanco (ej dark editorial), el
 *   script igual lo va a poner sobre fondo blanco — founder debe usar
 *   fotos con fondo blanco isolated para que funcione bien.
 *
 * Idempotente: correr 2 veces sobre la misma foto produce el mismo
 * resultado (depende solo del bbox que Claude detecte, que es estable).
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const MODEL_ID = 'claude-haiku-4-5-20251001';

// Canvas final: 2000×1333 = aspect 3:2 (mismo que ProductCard).
const OUTPUT_WIDTH = 2000;
const OUTPUT_HEIGHT = 1333;
// Anteojo ocupa 92% del ancho disponible — deja 4% padding cada lado.
const FRAME_FILL_RATIO = 0.92;

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('Falta ANTHROPIC_API_KEY en env.');
  process.exit(1);
}

type Bbox = { x: number; y: number; width: number; height: number };

const DETECT_BBOX_TOOL = {
  name: 'report_eyewear_bbox',
  description:
    'Devuelve el bounding box (x, y, width, height en pixels) del anteojo principal visible en la imagen. El bbox debe incluir TODO el anteojo: armazón completo + ambos lentes + ambas patillas si están visibles. NO incluir sombras ni reflejos exteriores al anteojo.',
  input_schema: {
    type: 'object' as const,
    properties: {
      x: {
        type: 'integer',
        description:
          'Coordenada X (pixels desde el borde izquierdo) del top-left corner del bbox.',
        minimum: 0,
      },
      y: {
        type: 'integer',
        description:
          'Coordenada Y (pixels desde el borde superior) del top-left corner del bbox.',
        minimum: 0,
      },
      width: {
        type: 'integer',
        description: 'Ancho del bbox en pixels.',
        minimum: 1,
      },
      height: {
        type: 'integer',
        description: 'Alto del bbox en pixels.',
        minimum: 1,
      },
    },
    required: ['x', 'y', 'width', 'height'],
    additionalProperties: false,
  },
} as const;

type AnthropicBlock =
  | { type: 'text'; text: string }
  | { type: 'tool_use'; id: string; name: string; input: Bbox };

/**
 * Detecta bbox del anteojo en una imagen vía Claude Vision + tool use.
 *
 * Pasamos el width/height de la imagen como hint al modelo en el text
 * para que las coords devueltas sean coherentes (modelo a veces normaliza
 * a 0-1 si no le pasamos el frame size).
 */
async function detectEyewearBbox(
  imageBuffer: Buffer,
  imageMime: 'image/jpeg' | 'image/png' | 'image/webp',
  imageWidth: number,
  imageHeight: number,
): Promise<Bbox> {
  const response = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL_ID,
      max_tokens: 500,
      tools: [DETECT_BBOX_TOOL],
      tool_choice: { type: 'tool', name: 'report_eyewear_bbox' },
      system:
        'Sos un detector de objetos. Recibís una foto de un anteojo (gafas / armazón óptico) sobre un fondo (típicamente blanco). Tu única tarea es devolver el bounding box exacto del anteojo en pixels llamando a la tool `report_eyewear_bbox`. NO incluyas sombras ni reflejos exteriores. Sí incluí TODO el armazón visible: frente + ambos lentes + patillas si se ven.',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: imageMime,
                data: imageBuffer.toString('base64'),
              },
            },
            {
              type: 'text',
              text: `Esta imagen tiene dimensiones ${imageWidth}×${imageHeight} pixels. Devolveme el bbox del anteojo en pixels absolutos (no normalizados 0-1) llamando a la tool.`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(
      `Anthropic ${response.status}: ${text.slice(0, 200)}`,
    );
  }

  const data = (await response.json()) as { content: AnthropicBlock[] };
  const toolBlock = data.content.find(
    (b): b is Extract<AnthropicBlock, { type: 'tool_use' }> =>
      b.type === 'tool_use' && b.name === 'report_eyewear_bbox',
  );
  if (!toolBlock) {
    throw new Error('Modelo no llamó tool — revisar prompt.');
  }
  return toolBlock.input;
}

/**
 * Procesa una sola foto: detecta bbox → recorta → redimensiona → centra
 * en canvas 2000×1333 blanco.
 */
async function processOne(inputPath: string, outputPath: string): Promise<void> {
  const buffer = await fs.readFile(inputPath);
  const meta = await sharp(buffer).metadata();
  const imageWidth = meta.width;
  const imageHeight = meta.height;
  if (!imageWidth || !imageHeight) {
    throw new Error(`No pude leer dimensiones de ${inputPath}`);
  }

  // Detectar MIME para Anthropic API.
  let mime: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg';
  if (meta.format === 'png') mime = 'image/png';
  else if (meta.format === 'webp') mime = 'image/webp';
  else if (meta.format !== 'jpeg' && meta.format !== 'jpg') {
    // Convert a JPEG antes de mandar (Anthropic acepta solo jpeg/png/webp).
    const converted = await sharp(buffer).jpeg({ quality: 95 }).toBuffer();
    return processBufferWithMeta(converted, 'image/jpeg', outputPath);
  }

  console.log(`Analizando ${path.basename(inputPath)} (${imageWidth}×${imageHeight})...`);
  const bbox = await detectEyewearBbox(buffer, mime, imageWidth, imageHeight);
  console.log(
    `  bbox: x=${bbox.x} y=${bbox.y} w=${bbox.width} h=${bbox.height}`,
  );

  // Sanity check: bbox dentro de la imagen.
  if (
    bbox.x < 0 ||
    bbox.y < 0 ||
    bbox.x + bbox.width > imageWidth ||
    bbox.y + bbox.height > imageHeight
  ) {
    console.warn(
      `  ⚠️ bbox fuera de los bounds de la imagen — clampeando.`,
    );
  }
  const clampedX = Math.max(0, Math.min(bbox.x, imageWidth - 1));
  const clampedY = Math.max(0, Math.min(bbox.y, imageHeight - 1));
  const clampedW = Math.min(bbox.width, imageWidth - clampedX);
  const clampedH = Math.min(bbox.height, imageHeight - clampedY);

  // Recortar al bbox detectado.
  const cropped = await sharp(buffer)
    .extract({
      left: clampedX,
      top: clampedY,
      width: clampedW,
      height: clampedH,
    })
    .toBuffer();

  // Calcular target del anteojo en el canvas:
  // - Anteojo ocupa 92% del ancho útil del canvas O 92% del alto, lo que
  //   sea menor (mantener aspect ratio del anteojo).
  const targetMaxWidth = OUTPUT_WIDTH * FRAME_FILL_RATIO;
  const targetMaxHeight = OUTPUT_HEIGHT * FRAME_FILL_RATIO;
  const bboxAspect = clampedW / clampedH;
  let targetWidth = targetMaxWidth;
  let targetHeight = targetMaxWidth / bboxAspect;
  if (targetHeight > targetMaxHeight) {
    targetHeight = targetMaxHeight;
    targetWidth = targetMaxHeight * bboxAspect;
  }

  // Redimensionar el crop al target.
  const resized = await sharp(cropped)
    .resize({
      width: Math.round(targetWidth),
      height: Math.round(targetHeight),
      fit: 'fill',
    })
    .toBuffer();

  // Componer sobre canvas blanco 2000×1333, centrado.
  const offsetX = Math.round((OUTPUT_WIDTH - targetWidth) / 2);
  const offsetY = Math.round((OUTPUT_HEIGHT - targetHeight) / 2);

  await sharp({
    create: {
      width: OUTPUT_WIDTH,
      height: OUTPUT_HEIGHT,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([{ input: resized, left: offsetX, top: offsetY }])
    .jpeg({ quality: 92 })
    .toFile(outputPath);

  console.log(`  ✓ guardado en ${outputPath}\n`);
}

async function processBufferWithMeta(
  buffer: Buffer,
  mime: 'image/jpeg' | 'image/png' | 'image/webp',
  outputPath: string,
): Promise<void> {
  // Re-entry point cuando convertimos formato no soportado a JPEG.
  const meta = await sharp(buffer).metadata();
  const imageWidth = meta.width!;
  const imageHeight = meta.height!;
  const bbox = await detectEyewearBbox(buffer, mime, imageWidth, imageHeight);
  const cropped = await sharp(buffer)
    .extract({ left: bbox.x, top: bbox.y, width: bbox.width, height: bbox.height })
    .toBuffer();
  const bboxAspect = bbox.width / bbox.height;
  const targetMaxWidth = OUTPUT_WIDTH * FRAME_FILL_RATIO;
  const targetMaxHeight = OUTPUT_HEIGHT * FRAME_FILL_RATIO;
  let targetWidth = targetMaxWidth;
  let targetHeight = targetMaxWidth / bboxAspect;
  if (targetHeight > targetMaxHeight) {
    targetHeight = targetMaxHeight;
    targetWidth = targetMaxHeight * bboxAspect;
  }
  const resized = await sharp(cropped)
    .resize({
      width: Math.round(targetWidth),
      height: Math.round(targetHeight),
      fit: 'fill',
    })
    .toBuffer();
  const offsetX = Math.round((OUTPUT_WIDTH - targetWidth) / 2);
  const offsetY = Math.round((OUTPUT_HEIGHT - targetHeight) / 2);
  await sharp({
    create: {
      width: OUTPUT_WIDTH,
      height: OUTPUT_HEIGHT,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([{ input: resized, left: offsetX, top: offsetY }])
    .jpeg({ quality: 92 })
    .toFile(outputPath);
}

/** Parse CLI args muy simple. */
function parseArgs(): { input: string; output: string | null } {
  const args = process.argv.slice(2);
  let input: string | null = null;
  let output: string | null = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input') input = args[++i] ?? null;
    else if (args[i] === '--output') output = args[++i] ?? null;
  }
  if (!input) {
    console.error('Uso: pnpm tsx scripts/normalize-product-photos.ts --input <file-or-dir> [--output <dir>]');
    process.exit(1);
  }
  return { input, output };
}

async function main() {
  const { input, output } = parseArgs();
  const stat = await fs.stat(input);

  if (stat.isFile()) {
    const parentDir = output ?? path.join(path.dirname(input), 'normalized');
    await fs.mkdir(parentDir, { recursive: true });
    const outputPath = path.join(
      parentDir,
      `${path.basename(input, path.extname(input))}.jpg`,
    );
    await processOne(input, outputPath);
    console.log('Listo. 1 foto procesada.');
    return;
  }

  if (stat.isDirectory()) {
    const outputDir = output ?? path.join(input, 'normalized');
    await fs.mkdir(outputDir, { recursive: true });
    const entries = await fs.readdir(input);
    const images = entries.filter((e) =>
      /\.(jpe?g|png|webp|heic|tiff?)$/i.test(e),
    );
    if (images.length === 0) {
      console.log(`No hay imágenes en ${input}`);
      return;
    }
    console.log(`Procesando ${images.length} imágenes de ${input}...\n`);
    let ok = 0;
    let fail = 0;
    for (const img of images) {
      const inputPath = path.join(input, img);
      const outputPath = path.join(
        outputDir,
        `${path.basename(img, path.extname(img))}.jpg`,
      );
      try {
        await processOne(inputPath, outputPath);
        ok++;
      } catch (err) {
        console.error(`  ✗ ${img}: ${String(err)}\n`);
        fail++;
      }
    }
    console.log(`\nListo. ${ok} OK, ${fail} fallidos.`);
    if (fail > 0) process.exit(1);
    return;
  }

  console.error(`${input} no es archivo ni directorio.`);
  process.exit(1);
}

main().catch((err) => {
  console.error('Script falló:', err);
  process.exit(1);
});
