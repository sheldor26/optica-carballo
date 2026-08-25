/**
 * Helpers compartidos por el generador de placas (`scripts/ml-placas.ts`).
 *
 * Responsabilidad única: dado un archivo de foto de un anteojo, devolver
 * el recorte ajustado del anteojo (sin aire sobrante) para poder
 * centrarlo con precisión en cualquier canvas.
 *
 * Dos estrategias de detección:
 * 1. `trim` de sharp (default) — gratis e instantáneo. Funciona con las
 *    fotos de catálogo de las marcas, que vienen sobre fondo blanco puro.
 * 2. Claude Vision bbox (`--vision`) — para fotos con fondo no uniforme,
 *    watermark o sombra. Mismo prompt que `normalize-product-photos.ts`.
 */

import sharp from 'sharp';

export type Bbox = { x: number; y: number; width: number; height: number };

export type Recorte = {
  /** PNG del anteojo recortado al ras (sin aire alrededor). */
  buffer: Buffer;
  width: number;
  height: number;
};

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const MODEL_ID = 'claude-haiku-4-5-20251001';

const DETECT_BBOX_TOOL = {
  name: 'report_eyewear_bbox',
  description:
    'Devuelve el bounding box (x, y, width, height en pixels) del anteojo principal visible en la imagen. El bbox debe incluir TODO el anteojo: armazón completo + ambos lentes + ambas patillas si están visibles. NO incluir sombras ni reflejos exteriores al anteojo.',
  input_schema: {
    type: 'object' as const,
    properties: {
      x: { type: 'integer', minimum: 0 },
      y: { type: 'integer', minimum: 0 },
      width: { type: 'integer', minimum: 1 },
      height: { type: 'integer', minimum: 1 },
    },
    required: ['x', 'y', 'width', 'height'],
    additionalProperties: false,
  },
} as const;

type AnthropicBlock =
  | { type: 'text'; text: string }
  | { type: 'tool_use'; id: string; name: string; input: Bbox };

async function detectBboxConVision(
  buffer: Buffer,
  mime: 'image/jpeg' | 'image/png' | 'image/webp',
  width: number,
  height: number,
): Promise<Bbox> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Falta ANTHROPIC_API_KEY para usar --vision.');
  }

  const response = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL_ID,
      max_tokens: 500,
      tools: [DETECT_BBOX_TOOL],
      tool_choice: { type: 'tool', name: 'report_eyewear_bbox' },
      system:
        'Sos un detector de objetos. Recibís una foto de un anteojo (gafas / armazón óptico). Tu única tarea es devolver el bounding box exacto del anteojo en pixels llamando a la tool `report_eyewear_bbox`. NO incluyas sombras ni reflejos exteriores. Sí incluí TODO el armazón visible: frente + ambos lentes + patillas si se ven.',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mime, data: buffer.toString('base64') },
            },
            {
              type: 'text',
              text: `Esta imagen tiene dimensiones ${width}×${height} pixels. Devolveme el bbox del anteojo en pixels absolutos (no normalizados 0-1) llamando a la tool.`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Anthropic ${response.status}: ${text.slice(0, 200)}`);
  }

  const data = (await response.json()) as { content: AnthropicBlock[] };
  const toolBlock = data.content.find(
    (b): b is Extract<AnthropicBlock, { type: 'tool_use' }> =>
      b.type === 'tool_use' && b.name === 'report_eyewear_bbox',
  );
  if (!toolBlock) throw new Error('El modelo no llamó a la tool de bbox.');
  return toolBlock.input;
}

/**
 * Recorta el anteojo al ras. `usarVision` fuerza la detección con Claude;
 * por default intenta `trim` y sólo cae a Vision si el trim no encontró
 * borde uniforme (foto con fondo no blanco).
 */
export async function recortarAnteojo(
  rutaFoto: string,
  opciones: { usarVision?: boolean; umbralTrim?: number } = {},
): Promise<Recorte> {
  const original = sharp(rutaFoto).rotate();
  const meta = await original.metadata();
  const width = meta.width;
  const height = meta.height;
  if (!width || !height) throw new Error(`No pude leer las dimensiones de ${rutaFoto}`);

  if (!opciones.usarVision) {
    // `trim` recorta los bordes del color dominante del perímetro.
    const { data, info } = await sharp(rutaFoto)
      .rotate()
      .trim({ threshold: opciones.umbralTrim ?? 12 })
      .png()
      .toBuffer({ resolveWithObject: true });

    const recorteUtil = (info.width * info.height) / (width * height);
    // Si el trim se comió casi toda la foto (<3%) algo salió mal; si no
    // recortó nada (>99.5%) el fondo no era uniforme → Vision.
    if (recorteUtil > 0.03 && recorteUtil < 0.995) {
      return { buffer: data, width: info.width, height: info.height };
    }
    console.warn(
      `  ⚠️ trim no encontró fondo uniforme en ${rutaFoto} (quedó ${(recorteUtil * 100).toFixed(1)}%) → uso Claude Vision.`,
    );
  }

  let mime: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg';
  if (meta.format === 'png') mime = 'image/png';
  else if (meta.format === 'webp') mime = 'image/webp';

  const buffer =
    mime === 'image/jpeg' && meta.format !== 'jpeg'
      ? await sharp(rutaFoto).rotate().jpeg({ quality: 95 }).toBuffer()
      : await sharp(rutaFoto).rotate().toBuffer();

  const bbox = await detectBboxConVision(buffer, mime, width, height);
  const left = Math.max(0, Math.min(bbox.x, width - 1));
  const top = Math.max(0, Math.min(bbox.y, height - 1));
  const w = Math.min(bbox.width, width - left);
  const h = Math.min(bbox.height, height - top);

  const { data, info } = await sharp(buffer)
    .extract({ left, top, width: w, height: h })
    .png()
    .toBuffer({ resolveWithObject: true });

  return { buffer: data, width: info.width, height: info.height };
}

/**
 * Escala el recorte para que ocupe `fill` del lado más restrictivo de una
 * caja y devuelve el buffer + el rectángulo que ocupa dentro del canvas.
 * Es la base del "producto siempre centrado".
 */
export async function encajar(
  recorte: Recorte,
  caja: { width: number; height: number },
  fill: number,
): Promise<{ buffer: Buffer; left: number; top: number; width: number; height: number }> {
  const maxW = caja.width * fill;
  const maxH = caja.height * fill;
  const aspect = recorte.width / recorte.height;

  let targetW = maxW;
  let targetH = maxW / aspect;
  if (targetH > maxH) {
    targetH = maxH;
    targetW = maxH * aspect;
  }

  const width = Math.round(targetW);
  const height = Math.round(targetH);
  const buffer = await sharp(recorte.buffer).resize({ width, height, fit: 'fill' }).png().toBuffer();

  return {
    buffer,
    width,
    height,
    left: Math.round((caja.width - width) / 2),
    top: Math.round((caja.height - height) / 2),
  };
}
