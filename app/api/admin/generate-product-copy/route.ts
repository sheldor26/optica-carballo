import { NextResponse } from 'next/server';
import {
  PRODUCT_COPY_SYSTEM_PROMPT,
  buildProductCopyUserPrompt,
} from '@/lib/product-copy/prompt';
import {
  productCopyInputSchema,
  productCopyOutputSchema,
} from '@/lib/product-copy/types';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const MODEL_ID = 'claude-sonnet-4-6';
const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';

/**
 * Rate limiting in-memory por IP (siguiendo el mismo patrón que face-shape
 * y prescription). Endpoint admin sin auth iter 1 — el rate limit es la
 * única defensa contra abuso de token Anthropic.
 *
 * Límite: 30 generaciones por IP por hora. Más permisivo que face-shape
 * (10/h) porque el founder lo usa intensivamente al cargar varios productos
 * en serie.
 *
 * TODO Sprint admin: agregar middleware de auth + reemplazar rate limit
 * por límite global, no por IP (admin tiene 1 IP estable).
 */
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_PER_IP = 30;
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

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Probá en una hora.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Petición inválida (JSON).' },
      { status: 400 },
    );
  }

  const input = productCopyInputSchema.safeParse(body);
  if (!input.success) {
    return NextResponse.json(
      {
        error: 'Datos del producto inválidos.',
        details: input.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('; '),
      },
      { status: 400 },
    );
  }

  const userPrompt = buildProductCopyUserPrompt(input.data);

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
        max_tokens: 2500,
        system: PRODUCT_COPY_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      console.error(
        `[product-copy] Anthropic API error: ${response.status} ${response.statusText}`,
      );
      return NextResponse.json(
        { error: 'No pudimos generar el copy ahora. Probá de nuevo.' },
        { status: 502 },
      );
    }

    anthropicData = (await response.json()) as AnthropicMessageResponse;
  } catch (err) {
    console.error('[product-copy] Anthropic fetch failed:', String(err));
    return NextResponse.json(
      { error: 'No pudimos conectar con el servicio.' },
      { status: 502 },
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
    console.error('[product-copy] Failed to parse model output as JSON');
    return NextResponse.json(
      { error: 'El modelo devolvió un formato inesperado. Probá de nuevo.' },
      { status: 502 },
    );
  }

  const validated = productCopyOutputSchema.safeParse(parsedJson);
  if (!validated.success) {
    console.error(
      '[product-copy] Schema validation failed:',
      validated.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; '),
    );
    return NextResponse.json(
      {
        error: 'El modelo devolvió un resultado inesperado. Probá de nuevo.',
      },
      { status: 502 },
    );
  }

  const durationMs = Date.now() - startedAt;
  console.log(
    `[product-copy] OK ${durationMs}ms name="${input.data.name}" brand="${input.data.brandName}"`,
  );

  return NextResponse.json(validated.data, {
    headers: {
      'Cache-Control': 'no-store, private',
      'X-RateLimit-Remaining': String(rl.remaining),
    },
  });
}
