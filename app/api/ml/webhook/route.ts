import { NextResponse, type NextRequest } from 'next/server';
import { mlWebhookPayloadSchema } from '@/lib/integrations/mercadolibre/schemas';
import { createAdminClient } from '@/lib/supabase/admin';
import { syncStockFromMLItem } from '@/lib/integrations/mercadolibre/sync-stock';
import { logMLSyncError } from '@/lib/integrations/mercadolibre/integrations-repo';
import { secretsMatch } from '@/lib/security/timing-safe-equal';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Rate limiting in-memory simple, mismo patrón que /api/prescription y
 * /api/face-shape — límite generoso porque ML puede mandar varios eventos
 * seguidos para productos distintos (hallazgo #11, audit 2026-08-01).
 */
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_PER_IP = 120;
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = rateLimitMap.get(ip);
  if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX_PER_IP) return false;
  bucket.count += 1;
  return true;
}

/**
 * Webhook receiver para notificaciones de Mercado Libre — Sprint 2b.
 *
 * Flow:
 * 1. Token de origen (`?token=`) + rate limit por IP.
 * 2. Parsear + validar shape con Zod.
 * 3. Idempotencia: si el webhook `_id` ya está en `marketplace_webhook_events`,
 *    responder 200 OK sin re-procesar.
 * 4. Procesar según `topic`:
 *    - `items`: sync stock con `syncStockFromMLItem(resource_id)` — covers
 *      cambios manuales del seller en panel ML + cambios por ventas.
 *    - `orders_v2`: ignorar por ahora — el sync via items cubre el efecto
 *      en stock. Futuro: tracking de órdenes.
 *    - otros topics: ignorar con status='ignored'.
 * 5. INSERT en `marketplace_webhook_events` con status (processed/failed/ignored).
 * 6. Responder 200 OK siempre que pasó la validación de origen (incluso si
 *    processing falla, para no triggerear retries de ML — los errores ya
 *    quedaron loggeados).
 *
 * Validation de origen: ML NO firma webhooks (no hay HMAC nativo). En vez
 * de eso, la URL registrada en el panel de ML incluye `?token=<ML_WEBHOOK_TOKEN>`
 * — un secreto propio que solo conoce quien configuró el webhook. Si
 * `ML_WEBHOOK_TOKEN` todavía no está seteado en el entorno, el chequeo se
 * OMITE (comportamiento actual sin cambios) para no romper el webhook real
 * mientras el founder no actualizó la URL en el panel de ML — activa solo
 * cuando la env var exista.
 */
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  const expectedToken = process.env.ML_WEBHOOK_TOKEN;
  if (expectedToken) {
    const receivedToken = request.nextUrl.searchParams.get('token') ?? '';
    if (!secretsMatch(receivedToken, expectedToken)) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: true, ignored: 'invalid_json' });
  }

  const parsed = mlWebhookPayloadSchema.safeParse(body);
  if (!parsed.success) {
    console.warn('[ml-webhook] payload con formato inesperado', {
      errors: parsed.error.flatten(),
    });
    return NextResponse.json({ ok: true, ignored: 'invalid_shape' });
  }

  const payload = parsed.data;
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from('marketplace_webhook_events')
    .select('id')
    .eq('id', payload._id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ ok: true, deduped: true });
  }

  let status: 'processed' | 'failed' | 'ignored' = 'ignored';
  let errorMessage: string | null = null;

  if (payload.topic === 'items') {
    const itemId = payload.resource.replace(/^\/items\//, '');

    if (itemId && /^MLA\d+$/.test(itemId)) {
      try {
        const result = await syncStockFromMLItem(itemId);
        if (result.ok) {
          status = 'processed';
        } else {
          status = 'failed';
          errorMessage = result.reason ?? 'sync_failed';
        }
      } catch (err) {
        status = 'failed';
        errorMessage = err instanceof Error ? err.message : String(err);
        await logMLSyncError({
          operation: 'webhook_items',
          errorPayload: {
            webhook_id: payload._id,
            item_id: itemId,
            error: errorMessage,
          },
        });
      }
    } else {
      errorMessage = 'invalid_resource_path';
    }
  }
  // Otros topics (orders_v2, etc) caen a status='ignored'.

  await supabase.from('marketplace_webhook_events').insert({
    id: payload._id,
    marketplace: 'mercadolibre',
    topic: payload.topic,
    resource: payload.resource,
    external_user_id: String(payload.user_id),
    status,
    payload: payload as unknown as Record<string, unknown>,
    error_message: errorMessage,
  });

  return NextResponse.json({ ok: true, status });
}
