import { NextResponse } from 'next/server';
import {
  PD_MEASURE_SYSTEM_PROMPT,
  PD_MEASURE_USER_PROMPT,
} from '@/lib/pd-measure/prompt';
import { calculatePD } from '@/lib/pd-measure/calculate';
import {
  pdRequestFlagsSchema,
  pdVisionOutputSchema,
} from '@/lib/pd-measure/types';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MODEL_ID = 'claude-sonnet-4-6';
const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';

/**
 * Rate limit por IP. 5 mediciones por hora — DNP es operación cara
 * (~$0.01/medición Sonnet 4.6 Vision) y no necesita alta frecuencia
 * por user (1 user mide su DNP 1 vez). Más estricto que face-shape (10/h).
 */
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_PER_IP = 5;
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const bucket = rateLimitMap.get(ip);
  if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: RATE_LIMIT_MAX_PER_IP - 1 };
  }
  if (bucket.count >= RATE_LIMIT_MAX_PER_IP) {
    return { allowed: false, remaining: 0 };
  }
  bucket.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX_PER_IP - bucket.count };
}

function detectImageMime(buffer: Buffer): string | null {
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'image/png';
  }
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
      { ok: false, error: 'Servicio no configurado.' },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Demasiados intentos. Probá en una hora o escribinos por WhatsApp.',
      },
      {
        status: 429,
        headers: { 'Cache-Control': 'no-store, private' },
      },
    );
  }

  // Parse form data: imagen + flags.
  let file: File | null = null;
  let flagsJsonStr: string | null = null;
  try {
    const formData = await request.formData();
    const candidate = formData.get('image');
    if (candidate instanceof File) file = candidate;
    const flagsCandidate = formData.get('flags');
    if (typeof flagsCandidate === 'string') flagsJsonStr = flagsCandidate;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Petición inválida.' },
      { status: 400 },
    );
  }

  if (!file) {
    return NextResponse.json(
      { ok: false, error: 'Falta la foto.' },
      { status: 400 },
    );
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { ok: false, error: 'La imagen pesa más de 8MB.' },
      { status: 413 },
    );
  }
  if (!ALLOWED_MIMES.has(file.type)) {
    return NextResponse.json(
      { ok: false, error: 'Formato no soportado. Usá JPG, PNG o WebP.' },
      { status: 415 },
    );
  }

  // Validar flags obligatorios (consentimiento + exclusiones).
  let flagsParsed: unknown;
  try {
    flagsParsed = flagsJsonStr ? JSON.parse(flagsJsonStr) : {};
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Confirmaciones inválidas.' },
      { status: 400 },
    );
  }
  const flagsResult = pdRequestFlagsSchema.safeParse(flagsParsed);
  if (!flagsResult.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Necesitamos que confirmes las 4 casillas antes de procesar.',
      },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detectedMime = detectImageMime(buffer);
  if (!detectedMime) {
    return NextResponse.json(
      { ok: false, error: 'El archivo no parece una imagen válida.' },
      { status: 415 },
    );
  }

  const base64 = buffer.toString('base64');

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
        max_tokens: 1000,
        system: PD_MEASURE_SYSTEM_PROMPT,
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
              { type: 'text', text: PD_MEASURE_USER_PROMPT },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error(
        `[measure-pd] Anthropic API error: ${response.status} ${response.statusText}`,
      );
      return NextResponse.json(
        { ok: false, error: 'No pudimos analizar la foto ahora. Probá de nuevo.' },
        {
          status: 502,
          headers: { 'Cache-Control': 'no-store, private' },
        },
      );
    }
    anthropicData = (await response.json()) as AnthropicMessageResponse;
  } catch (err) {
    console.error('[measure-pd] Anthropic fetch failed:', String(err));
    return NextResponse.json(
      { ok: false, error: 'No pudimos conectar con el servicio.' },
      {
        status: 502,
        headers: { 'Cache-Control': 'no-store, private' },
      },
    );
  }

  const textBlock = anthropicData.content.find((b) => b.type === 'text');
  const rawText = textBlock?.text?.trim() ?? '';
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
    console.error('[measure-pd] Failed to parse model output as JSON');
    return NextResponse.json(
      { ok: false, error: 'El análisis devolvió un formato inesperado. Probá de nuevo.' },
      {
        status: 502,
        headers: { 'Cache-Control': 'no-store, private' },
      },
    );
  }

  const validated = pdVisionOutputSchema.safeParse(parsedJson);
  if (!validated.success) {
    console.error(
      '[measure-pd] Vision schema validation failed:',
      validated.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; '),
    );
    return NextResponse.json(
      { ok: false, error: 'El análisis devolvió un resultado inesperado. Probá otra foto.' },
      {
        status: 502,
        headers: { 'Cache-Control': 'no-store, private' },
      },
    );
  }

  const result = calculatePD(validated.data);
  const durationMs = Date.now() - startedAt;
  // Solo metadata mínima. NUNCA loguear medidas reales (biométrico LPDP).
  console.log(
    `[measure-pd] ${durationMs}ms ok=${result.ok} ${result.ok ? `confidence=${result.confidence}` : `warnings=${result.warnings.join(',')}`}`,
  );

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'no-store, private',
      'X-RateLimit-Remaining': String(rl.remaining),
    },
  });
}
