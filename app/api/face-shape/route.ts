import { NextResponse } from 'next/server';
import {
  FACE_SHAPE_SYSTEM_PROMPT,
  FACE_SHAPE_USER_PROMPT,
} from '@/lib/face-shape/prompt';
import { FaceShapeAnalysisSchema } from '@/lib/face-shape/types';
import {
  RECOMMEND_FRAMES_TOOL,
  type AnthropicContentBlock,
  type AnthropicMessageResponse,
} from '@/lib/face-shape/tool-schema';
import { FEW_SHOT_MESSAGES } from '@/lib/face-shape/few-shot';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MODEL_ID = 'claude-sonnet-4-6';
const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';

/**
 * Tier 2 upgrade recomendador IA (2026-05-30):
 * - A. Tool use (`recommend_frames`) — elimina parsing JSON regex frágil.
 * - B. Few-shot examples descriptivos (4 ejemplos: oval / redondo medio /
 *   con anteojos / sin cara).
 * - C. Extended thinking habilitado (`budget_tokens: 1500`).
 * - D. Modelo Haiku 4.5 → Sonnet 4.6 (mejor accuracy en clasificación
 *   geométrica facial).
 *
 * Restricción API: `tool_choice: { type: "tool", ... }` (forzado) NO es
 * compatible con extended thinking. Usamos `tool_choice: "auto"` + system
 * prompt fuerte. Fallback 502 si modelo no llama la tool.
 *
 * Latencia esperada: pre ~3-5s con Haiku, post ~6-9s con Sonnet+thinking.
 * Aceptable porque el resultado es de mejor calidad (más decisiones de
 * compra dependen de esto).
 */
const THINKING_BUDGET_TOKENS = 1500;
const MAX_TOKENS = 3000;

/**
 * Verifica magic bytes — confiar en el MIME type del header es
 * inseguro (se puede mentir). Detectamos los primeros bytes del
 * archivo y aceptamos solo JPEG, PNG, WebP reales.
 */
function detectImageMime(buffer: Buffer): string | null {
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'image/png';
  }
  // WebP: RIFF .... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return 'image/webp';
  }
  return null;
}

/**
 * Extrae el `input` del tool_use block. Ignora thinking/redacted_thinking
 * blocks. Lanza error si el modelo no llamó la tool (caso edge con
 * `tool_choice: "auto"`).
 */
function extractToolInput(response: AnthropicMessageResponse): unknown {
  const toolUseBlock = response.content.find(
    (b): b is Extract<AnthropicContentBlock, { type: 'tool_use' }> =>
      b.type === 'tool_use' && b.name === RECOMMEND_FRAMES_TOOL.name,
  );

  if (toolUseBlock) {
    return toolUseBlock.input;
  }

  const textBlock = response.content.find(
    (b): b is Extract<AnthropicContentBlock, { type: 'text' }> =>
      b.type === 'text',
  );
  const textLen = textBlock?.text?.length ?? 0;
  throw new Error(
    `Model did not call recommend_frames tool. Text block length: ${textLen}. stop_reason: ${response.stop_reason}`,
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Servicio no configurado.' },
      { status: 503 },
    );
  }

  let file: File | null = null;
  try {
    const formData = await request.formData();
    const candidate = formData.get('image');
    if (candidate instanceof File) {
      file = candidate;
    }
  } catch {
    return NextResponse.json(
      { error: 'Petición inválida.' },
      { status: 400 },
    );
  }

  if (!file) {
    return NextResponse.json(
      { error: 'Falta el archivo de imagen.' },
      { status: 400 },
    );
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: 'La imagen pesa más de 5MB.' },
      { status: 413 },
    );
  }
  if (!ALLOWED_MIMES.has(file.type)) {
    return NextResponse.json(
      { error: 'Formato no soportado. Usá JPG, PNG o WebP.' },
      { status: 415 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detectedMime = detectImageMime(buffer);
  if (!detectedMime) {
    return NextResponse.json(
      { error: 'El archivo no parece una imagen válida.' },
      { status: 415 },
    );
  }

  const base64 = buffer.toString('base64');

  // Few-shot examples (4 user/assistant/user-tool_result × 4) seguido del
  // mensaje real con la imagen del usuario. Total: 12 mensajes few-shot + 1.
  const messages = [
    ...FEW_SHOT_MESSAGES,
    {
      role: 'user' as const,
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: detectedMime,
            data: base64,
          },
        },
        { type: 'text', text: FACE_SHAPE_USER_PROMPT },
      ],
    },
  ];

  let anthropicData: AnthropicMessageResponse;
  const startedAt = Date.now();
  try {
    const response = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_ID,
        max_tokens: MAX_TOKENS,
        thinking: {
          type: 'enabled',
          budget_tokens: THINKING_BUDGET_TOKENS,
        },
        tools: [RECOMMEND_FRAMES_TOOL],
        // ⚠️ tool_choice: "auto" obligatorio con extended thinking habilitado.
        // Forzado ({ type: "tool", ... }) NO es compatible con thinking.
        tool_choice: { type: 'auto' },
        system: FACE_SHAPE_SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      // No logueamos el body para no exponer la imagen en logs.
      console.error(
        `[face-shape] Anthropic API error: ${response.status} ${response.statusText}`,
      );
      return NextResponse.json(
        { error: 'No pudimos analizar la imagen ahora. Probá de nuevo.' },
        {
          status: 502,
          headers: { 'Cache-Control': 'no-store, private' },
        },
      );
    }

    anthropicData = (await response.json()) as AnthropicMessageResponse;
  } catch (err) {
    console.error('[face-shape] Anthropic fetch failed:', String(err));
    return NextResponse.json(
      { error: 'No pudimos conectar con el servicio de análisis.' },
      {
        status: 502,
        headers: { 'Cache-Control': 'no-store, private' },
      },
    );
  }

  // Extraer input del tool_use block. Si el modelo no llamó la tool → 502.
  // No logueamos contenido (puede incluir descripción de imagen sensible).
  let toolInput: unknown;
  try {
    toolInput = extractToolInput(anthropicData);
  } catch (err) {
    console.error('[face-shape] Tool extraction failed:', String(err));
    return NextResponse.json(
      { error: 'El análisis devolvió un formato inesperado. Probá de nuevo.' },
      {
        status: 502,
        headers: { 'Cache-Control': 'no-store, private' },
      },
    );
  }

  // Validación final con Zod — defense-in-depth (rangos, signos, enums).
  const validated = FaceShapeAnalysisSchema.safeParse(toolInput);
  if (!validated.success) {
    console.error(
      '[face-shape] Zod validation failed:',
      validated.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; '),
    );
    return NextResponse.json(
      { error: 'El análisis devolvió un resultado inesperado. Probá otra foto.' },
      {
        status: 502,
        headers: { 'Cache-Control': 'no-store, private' },
      },
    );
  }

  const durationMs = Date.now() - startedAt;
  console.log(
    `[face-shape] OK ${durationMs}ms shape=${validated.data.faceShape} conf=${validated.data.confidence}`,
  );

  return NextResponse.json(validated.data, {
    headers: { 'Cache-Control': 'no-store, private' },
  });
}
