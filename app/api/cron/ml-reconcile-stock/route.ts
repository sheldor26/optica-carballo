import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { syncStockFromMLItem } from '@/lib/integrations/mercadolibre/sync-stock';
import { secretsMatch } from '@/lib/security/timing-safe-equal';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * CRON de reconciliación stock ML → sitio.
 *
 * Backup del webhook: si ML falla manda webhook o el endpoint rechaza,
 * este cron pesca el drift de stock comparando ML vs DB.
 *
 * Schedule: cada 6 horas (4 runs/día). Trade-off entre fresh data y costo
 * de ML API calls (1 GET por MLA distinto).
 *
 * Algoritmo:
 * 1. SELECT DISTINCT mercadolibre_item_id FROM product_variants WHERE NOT NULL.
 * 2. Por cada MLA: syncStockFromMLItem (que ya maneja multi-variation).
 * 3. Devolver resumen de updates + skipped.
 *
 * Autorizado vía CRON_SECRET header (mismo que /api/cron/check-alerts).
 */
export async function GET(request: Request) {
  const auth = request.headers.get('authorization') ?? '';
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || !secretsMatch(auth, expected)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: rows, error } = await supabase
    .from('product_variants')
    .select('mercadolibre_item_id')
    .not('mercadolibre_item_id', 'is', null);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  const uniqueItemIds = Array.from(
    new Set((rows ?? []).map((r) => r.mercadolibre_item_id).filter(Boolean) as string[]),
  );

  let totalUpdated = 0;
  let totalSkipped = 0;
  let failed = 0;
  const errors: Array<{ ml_item_id: string; reason: string }> = [];

  for (const mlItemId of uniqueItemIds) {
    try {
      const result = await syncStockFromMLItem(mlItemId);
      if (result.ok) {
        totalUpdated += result.updated;
        totalSkipped += result.skipped;
      } else {
        failed++;
        errors.push({ ml_item_id: mlItemId, reason: result.reason ?? 'unknown' });
      }
    } catch (err) {
      failed++;
      errors.push({
        ml_item_id: mlItemId,
        reason: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return NextResponse.json({
    ok: true,
    items_processed: uniqueItemIds.length,
    variants_updated: totalUpdated,
    variants_skipped: totalSkipped,
    failed,
    errors: errors.slice(0, 10),
  });
}
