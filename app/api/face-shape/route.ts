import { NextResponse } from 'next/server';
import {
  FACE_SHAPE_SYSTEM_PROMPT,
  FACE_SHAPE_USER_PROMPT,
} from '@/lib/face-shape/prompt';
import { FaceShapeAnalysisSchema } from '@/lib/face-shape/types';

export const runtime = 'nodejs';
export const maxDuration = 30;
export const dynamic = 'force-dynamic';

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MODEL_ID = 'claude-haiku-4-5-20251001';
const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';

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

type AnthropicMessageResponse = {
  content: Array<{ type: string; text?: string }>;
};

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

  // Anthropic Vision API call — fetch directo, sin SDK.
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
        max_tokens: 400,
        system: FACE_SHAPE_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
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
        ],
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

  // Extraer text del response. Anthropic devuelve content como array.
  const textBlock = anthropicData.content.find((b) => b.type === 'text');
  const rawText = textBlock?.text?.trim() ?? '';

  // El modelo a veces devuelve el JSON dentro de un fence ```json — lo
  // limpiamos. También por las dudas, si hay texto antes/después,
  // extraemos el primer bloque que parsee.
  const jsonText = (() => {
    const fence = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fence) return fence[1]!.trim();
    const start = rawText.indexOf('{');
    const end = rawText.lastIndexOf('}');
    if (start >= 0 && end > start) return rawText.slice(start, end + 1);
    return rawText;
  })();

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(jsonText);
  } catch {
    console.error('[face-shape] Failed to parse model output as JSON');
    return NextResponse.json(
      { error: 'El análisis devolvió un formato inesperado. Probá de nuevo.' },
      {
        status: 502,
        headers: { 'Cache-Control': 'no-store, private' },
      },
    );
  }

  const validated = FaceShapeAnalysisSchema.safeParse(parsedJson);
  if (!validated.success) {
    console.error(
      '[face-shape] Model output failed schema validation:',
      validated.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
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
