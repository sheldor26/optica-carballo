import { NextResponse, type NextRequest } from 'next/server';
import { mlWebhookPayloadSchema } from '@/lib/integrations/mercadolibre/schemas';
import { createAdminClient } from '@/lib/supabase/admin';
import { syncStockFromMLItem } from '@/lib/integrations/mercadolibre/sync-stock';
import { logMLSyncError } from '@/lib/integrations/mercadolibre/integrations-repo';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Webhook receiver para notificaciones de Mercado Libre — Sprint 2b.
 *
 * Flow:
 * 1. Parsear + validar shape con Zod.
 * 2. Idempotencia: si el webhook `_id` ya está en `marketplace_webhook_events`,
 *    responder 200 OK sin re-procesar.
 * 3. Procesar según `topic`:
 *    - `items`: sync stock con `syncStockFromMLItem(resource_id)` — covers
 *      cambios manuales del seller en panel ML + cambios por ventas.
 *    - `orders_v2`: ignorar por ahora — el sync via items cubre el efecto
 *      en stock. Futuro: tracking de órdenes.
 *    - otros topics: ignorar con status='ignored'.
 * 4. INSERT en `marketplace_webhook_events` con status (processed/failed/ignored).
 * 5. Responder 200 OK siempre (incluso si processing falla, para no triggerear
 *    retries de ML — los errores ya quedaron loggeados).
 *
 * Validation HMAC: ML NO firma webhooks por default. Si en algún momento
 * configurás un secret, agregar header check acá. Por ahora confiamos en que
 * el endpoint está atrás de HTTPS y la URL es semi-secreta.
 */
export async function POST(request: NextRequest) {
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
