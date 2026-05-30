import { NextResponse } from 'next/server';
import { syncStockFromMLItem } from '@/lib/integrations/mercadolibre/sync-stock';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

/**
 * Endpoint TEMPORAL admin para forzar sync ML → DB de un MLA específico.
 * Útil para diagnosticar: ¿el sync funciona técnicamente independiente
 * del webhook? Si forceSync resuelve el drift, problema es de webhook
 * (no configurado en panel ML o no llega). Si forceSync también falla,
 * problema en el código de sync.
 *
 * Devuelve estado pre/post + resultado de syncStockFromMLItem + últimos
 * webhooks recibidos para ese MLA.
 *
 * TODO: eliminar cuando sync esté operativo + estable.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ mlItemId: string }> },
) {
  const { mlItemId } = await params;

  if (!mlItemId || !/^MLA\d+$/.test(mlItemId)) {
    return NextResponse.json(
      { ok: false, error: 'invalid_item_id', expected: 'MLAxxx' },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();

  // Estado pre-sync
  const { data: pre } = await supabase
    .from('product_variants')
    .select('id, sku, stock_qty, price_cents, mercadolibre_item_id, mercadolibre_variation_code')
    .eq('mercadolibre_item_id', mlItemId);

  // Últimos 5 webhooks recibidos para este MLA (si algún webhook llegó)
  const { data: recentWebhooks } = await supabase
    .from('marketplace_webhook_events')
    .select('id, topic, resource, status, error_message, processed_at')
    .like('resource', `%${mlItemId}%`)
    .order('processed_at', { ascending: false })
    .limit(5);

  const syncResult = await syncStockFromMLItem(mlItemId);

  // Estado post-sync
  const { data: post } = await supabase
    .from('product_variants')
    .select('id, sku, stock_qty, price_cents, mercadolibre_item_id, mercadolibre_variation_code')
    .eq('mercadolibre_item_id', mlItemId);

  return NextResponse.json({
    ok: true,
    ml_item_id: mlItemId,
    sync_result: syncResult,
    pre,
    post,
    recent_webhooks_for_this_mla: recentWebhooks ?? [],
    diagnosis_hints: {
      sync_changed_stock: JSON.stringify(pre) !== JSON.stringify(post)
        ? 'Sí, el sync actualizó stock. Si pre != post, el código funciona — problema es de webhook (no llega).'
        : 'No hubo cambios. Mirá sync_result.skipped — si > 0 es porque ML reporta el mismo stock que DB. Verificá que realmente bajaste el stock en panel ML.',
      webhook_received: (recentWebhooks?.length ?? 0) > 0
        ? `Sí, llegaron ${recentWebhooks?.length} webhooks. Mirá status — si están "ignored" o "failed", problema de procesamiento.`
        : 'NO llegó ningún webhook para este MLA. Causa #1 probable: webhook no configurado en panel ML.',
    },
  });
}
