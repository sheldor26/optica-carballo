import { NextResponse } from 'next/server';
import {
  PRESCRIPTION_SYSTEM_PROMPT,
  PRESCRIPTION_USER_PROMPT,
} from '@/lib/prescription/prompt';
import {
  VERIFY_SYSTEM_PROMPT,
  VERIFY_USER_PROMPT,
} from '@/lib/prescription/verify-prompt';
import { PrescriptionAnalysisSchema } from '@/lib/prescription/types';
import {
  VerifyVerdictSchema,
  VERIFY_ISSUE_COPY,
} from '@/lib/prescription/verify-types';
import {
  EXTRACT_PRESCRIPTION_TOOL,
  type AnthropicContentBlock,
  type AnthropicMessageResponse,
} from '@/lib/prescription/tool-schema';
import { FEW_SHOT_MESSAGES } from '@/lib/prescription/few-shot';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB (recetas PDF pueden ser pesadas)
const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);
const MODEL_ID = 'claude-sonnet-4-6';
const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';

/**
 * Tier 1 upgrade lector inteligente (2026-05-30):
 * - A. Tool use (`extract_prescription`) — elimina parsing regex frágil.
 * - B. Few-shot examples descriptivos (sin imágenes todavía) en `few-shot.ts`.
 * - C. Extended thinking habilitado (`budget_tokens: 2000`) — el modelo razona
 *   antes de extraer.
 *
 * Restricción crítica de la API: `tool_choice: { type: "tool", name: ... }`
 * (forzado) NO es compatible con extended thinking. Usamos `tool_choice: "auto"`
 * + system prompt fuerte que fuerza el uso de la tool. Fallback si modelo
 * devuelve texto en vez de llamar la tool.
 *
 * `max_tokens` debe ser > thinking budget + output esperado del tool. 4096
 * deja margen para receta compleja con tablas largas.
 */
const THINKING_BUDGET_TOKENS = 2000;
const MAX_TOKENS = 4096;

/**
 * Rate limiting in-memory simple (sin Upstash).
 * - Decisión iter 1: aceptar el límite de in-memory (NO se comparte entre
 *   instancias de Vercel). Si vemos abuse real, escalamos a Upstash en iter 2.
 * - Límite: 10 uploads por IP por hora.
 *
 * Map se limpia automáticamente cada hora — los buckets expiran solos.
 */
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hora
const RATE_LIMIT_MAX_PER_IP = 10;
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
  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }
  // PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'image/png';
  }
  // WebP
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
  // PDF
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return 'application/pdf';
  }
  return null;
}

/**
 * Extrae el `input` del tool_use block. Ignora thinking/redacted_thinking
 * blocks. Lanza error con detalle si el modelo respondió texto en vez de
 * llamar la tool (caso edge con `tool_choice: "auto"`).
 */
function extractToolInput(response: AnthropicMessageResponse): unknown {
  const toolUseBlock = response.content.find(
    (b): b is Extract<AnthropicContentBlock, { type: 'tool_use' }> =>
      b.type === 'tool_use' && b.name === EXTRACT_PRESCRIPTION_TOOL.name,
  );

  if (toolUseBlock) {
    return toolUseBlock.input;
  }

  // Fallback: modelo respondió texto en vez de llamar tool. Log + throw
  // para que el caller devuelva 502 al cliente. No exponemos contenido del
  // texto (puede incluir datos médicos).
  const textBlock = response.content.find(
    (b): b is Extract<AnthropicContentBlock, { type: 'text' }> =>
      b.type === 'text',
  );
  const textLen = textBlock?.text?.length ?? 0;
  throw new Error(
    `Model did not call extract_prescription tool. Text block length: ${textLen}. stop_reason: ${response.stop_reason}`,
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

  // Rate limit por IP (Vercel pasa la real en x-forwarded-for).
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error:
          'Demasiados intentos. Probá de nuevo en una hora o escribinos por WhatsApp.',
      },
      {
        status: 429,
        headers: { 'Cache-Control': 'no-store, private' },
      },
    );
  }

  let file: File | null = null;
  try {
    const formData = await request.formData();
    const candidate = formData.get('prescription');
    if (candidate instanceof File) file = candidate;
  } catch {
    return NextResponse.json(
      { error: 'Petición inválida.' },
      { status: 400 },
    );
  }

  if (!file) {
    return NextResponse.json(
      { error: 'Falta el archivo de la receta.' },
      { status: 400 },
    );
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: 'El archivo pesa más de 10MB.' },
      { status: 413 },
    );
  }
  if (!ALLOWED_MIMES.has(file.type)) {
    return NextResponse.json(
      {
        error:
          'Formato no soportado. Subí JPG, PNG, WebP o PDF. Si tu foto está en formato HEIC (iPhone), convertila a JPG antes.',
      },
      { status: 415 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detectedMime = detectImageMime(buffer);
  if (!detectedMime) {
    return NextResponse.json(
      { error: 'El archivo no parece una imagen o PDF válido.' },
      { status: 415 },
    );
  }

  const base64 = buffer.toString('base64');

  // Construir contenido user: PDF usa type=document, imagen usa type=image.
  const userContent =
    detectedMime === 'application/pdf'
      ? [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: base64,
            },
          },
          { type: 'text', text: PRESCRIPTION_USER_PROMPT },
        ]
      : [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: detectedMime,
              data: base64,
            },
          },
          { type: 'text', text: PRESCRIPTION_USER_PROMPT },
        ];

  // Few-shot examples (4 mensajes user/assistant/user-tool_result × 4) seguido
  // del mensaje real con la imagen del cliente. Total: 12 mensajes few-shot + 1.
  const messages = [
    ...FEW_SHOT_MESSAGES,
    { role: 'user' as const, content: userContent },
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
        tools: [EXTRACT_PRESCRIPTION_TOOL],
        // ⚠️ tool_choice: "auto" obligatorio con extended thinking habilitado.
        // Forzado ({ type: "tool", name: ... }) NO es compatible con thinking.
        // El system prompt fuerza el uso de la tool via texto.
        tool_choice: { type: 'auto' },
        system: PRESCRIPTION_SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      // NO loguear el body (contiene datos médicos sensibles, ley 25.326).
      console.error(
        `[prescription] Anthropic API error: ${response.status} ${response.statusText}`,
      );
      return NextResponse.json(
        { error: 'No pudimos analizar la receta ahora. Probá de nuevo.' },
        {
          status: 502,
          headers: { 'Cache-Control': 'no-store, private' },
        },
      );
    }

    anthropicData = (await response.json()) as AnthropicMessageResponse;
  } catch (err) {
    console.error('[prescription] Anthropic fetch failed:', String(err));
    return NextResponse.json(
      { error: 'No pudimos conectar con el servicio de análisis.' },
      {
        status: 502,
        headers: { 'Cache-Control': 'no-store, private' },
      },
    );
  }

  // Extraer input del tool_use block. Si el modelo no llamó la tool, fallback
  // → 502. No logueamos el contenido del input (datos médicos).
  let toolInput: unknown;
  try {
    toolInput = extractToolInput(anthropicData);
  } catch (err) {
    console.error('[prescription] Tool extraction failed:', String(err));
    return NextResponse.json(
      { error: 'El análisis devolvió un formato inesperado. Probá de nuevo.' },
      {
        status: 502,
        headers: { 'Cache-Control': 'no-store, private' },
      },
    );
  }

  // Validación final con Zod — defense-in-depth (rangos, signos, enums).
  // El tool schema fuerza shape, Zod fuerza reglas semánticas finas
  // (cilindro siempre ≤ 0, eje 1-180, etc).
  const validated = PrescriptionAnalysisSchema.safeParse(toolInput);
  if (!validated.success) {
    console.error(
      '[prescription] Zod validation failed:',
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

  // Tier 2: Verificación adversarial con segundo agent skeptic.
  // Recibe la imagen ORIGINAL + el JSON extraído por el primer agent y
  // duda de la extracción según heurísticas clínicas. Si el verdict es
  // unreliable, ajustamos confidence o aplicamos corrección sugerida.
  //
  // Es OPCIONAL: si falla la verificación, devolvemos la extracción
  // original (no romper el flow del usuario por algo experimental).
  const verifiedData = await runAdversarialVerification(
    apiKey,
    detectedMime,
    base64,
    validated.data,
  );

  const durationMs = Date.now() - startedAt;
  // Solo metadata mínima. NUNCA loguear el contenido del JSON (datos médicos).
  console.log(
    `[prescription] OK ${durationMs}ms isRx=${verifiedData.isPrescription} type=${verifiedData.prescriptionType}`,
  );

  return NextResponse.json(verifiedData, {
    headers: {
      'Cache-Control': 'no-store, private',
      'X-RateLimit-Remaining': String(rl.remaining),
    },
  });
}

/**
 * Tier 2 — Verificación adversarial. Llama a un segundo agent (Sonnet
 * sin thinking, sin tool use, más liviano) con la imagen + JSON del
 * primer agent y le pide que dude.
 *
 * Aplica `confidenceAdjustment`:
 * - "lower" → baja `od.confidence` y `oi.confidence` un nivel.
 * - "raise" → sube `od.confidence` y `oi.confidence` un nivel.
 * - "keep" → no cambia nada.
 *
 * Si el modelo devuelve issues no vacío, los appendea como warning flags
 * adicionales (mapeados via VERIFY_ISSUE_COPY).
 *
 * Si el verificador falla por cualquier razón (timeout, API error, JSON
 * inválido), devuelve la data original sin tocar — verificación es opcional.
 */
async function runAdversarialVerification(
  apiKey: string,
  mediaType: string,
  imageBase64: string,
  extractedData: ReturnType<typeof PrescriptionAnalysisSchema.parse>,
): Promise<ReturnType<typeof PrescriptionAnalysisSchema.parse>> {
  try {
    const userContent =
      mediaType === 'application/pdf'
        ? [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `${VERIFY_USER_PROMPT}\n\nJSON extraído por el primer agente:\n${JSON.stringify(
                extractedData,
                null,
                2,
              )}`,
            },
          ]
        : [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `${VERIFY_USER_PROMPT}\n\nJSON extraído por el primer agente:\n${JSON.stringify(
                extractedData,
                null,
                2,
              )}`,
            },
          ];

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
        system: VERIFY_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userContent }],
      }),
    });

    if (!response.ok) {
      console.warn(
        `[prescription-verify] API error: ${response.status} ${response.statusText} — skipping verification`,
      );
      return extractedData;
    }

    const data = (await response.json()) as AnthropicMessageResponse;
    const textBlock = data.content.find((b) => b.type === 'text');
    const rawText = textBlock?.text?.trim() ?? '';

    // El verificador no usa tool use (mismo modelo que el primer agent no
    // funciona bien con tools encadenadas + thinking). Parseamos JSON
    // directo, con fallback a fence ```json``` por las dudas.
    const jsonText = (() => {
      const fence = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (fence) return fence[1]!.trim();
      const start = rawText.indexOf('{');
      const end = rawText.lastIndexOf('}');
      if (start >= 0 && end > start) return rawText.slice(start, end + 1);
      return rawText;
    })();

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      console.warn(
        '[prescription-verify] Failed to parse verifier output — skipping',
      );
      return extractedData;
    }

    const verdict = VerifyVerdictSchema.safeParse(parsed);
    if (!verdict.success) {
      console.warn(
        '[prescription-verify] Verifier output failed schema — skipping',
      );
      return extractedData;
    }

    // Log de verdict (sin contenido sensible).
    const issuesShort = verdict.data.issues.slice(0, 3).join(',');
    console.log(
      `[prescription-verify] reliable=${verdict.data.isReliable} confAdj=${verdict.data.confidenceAdjustment} issues=${issuesShort}`,
    );

    // Aplicar adjustments al data extraído.
    return applyVerdict(extractedData, verdict.data);
  } catch (err) {
    console.warn('[prescription-verify] Exception, skipping:', String(err));
    return extractedData;
  }
}

/** Aplica las correcciones del verificador al output del primer agent. */
function applyVerdict(
  data: ReturnType<typeof PrescriptionAnalysisSchema.parse>,
  verdict: ReturnType<typeof VerifyVerdictSchema.parse>,
): ReturnType<typeof PrescriptionAnalysisSchema.parse> {
  const adjustConfidence = (
    current: 'high' | 'medium' | 'low',
  ): 'high' | 'medium' | 'low' => {
    if (verdict.confidenceAdjustment === 'keep') return current;
    if (verdict.confidenceAdjustment === 'lower') {
      if (current === 'high') return 'medium';
      if (current === 'medium') return 'low';
      return 'low';
    }
    // raise
    if (current === 'low') return 'medium';
    if (current === 'medium') return 'high';
    return 'high';
  };

  // Mapear issues a warning flags humanos legibles. Si el issue es uno
  // conocido, lo agregamos como warning flag (si no es repetido).
  const extraFlags: string[] = [];
  for (const issue of verdict.issues) {
    if (VERIFY_ISSUE_COPY[issue]) {
      // Solo agregamos como flag genérico "suspicious_content" — el detalle
      // específico queda en logs server-side, no exponemos al cliente.
      if (!extraFlags.includes('suspicious_content')) {
        extraFlags.push('suspicious_content');
      }
    }
  }

  return {
    ...data,
    od: { ...data.od, confidence: adjustConfidence(data.od.confidence) },
    oi: { ...data.oi, confidence: adjustConfidence(data.oi.confidence) },
    warningFlags: [
      ...data.warningFlags,
      ...extraFlags.filter((f) => !data.warningFlags.includes(f as never)),
    ] as typeof data.warningFlags,
  };
}
