import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { mlFetch } from '@/lib/integrations/mercadolibre/api-client';
import { logMLSyncError } from '@/lib/integrations/mercadolibre/integrations-repo';

type VariantRow = {
  id: string;
  sku: string;
  stock_qty: number;
  mercadolibre_item_id: string | null;
  mercadolibre_variation_code: string | null;
};

type MLVariation = {
  id: number;
  seller_custom_field: string | null;
  available_quantity: number;
};

type MLItem = {
  id: string;
  available_quantity: number;
  variations?: MLVariation[];
};

/**
 * Sync stock de una variante DB hacia ML (outbound).
 *
 * Flow:
 * 1. Lee variante DB con mapping ML.
 * 2. Si no tiene mapping → no-op (variante no se vende en ML).
 * 3. GET /items/{MLA} para obtener context (variations array, IDs).
 * 4. Si single-variation: PUT /items/{MLA} con available_quantity.
 * 5. Si multi-variation: matchear variation_code con seller_custom_field
 *    de las variations[] del item, PUT /items/{MLA}/variations/{variation.id}.
 *
 * Best-effort: si falla, loggea a marketplace_sync_errors pero NO throw
 * (el checkout no debe fallar porque ML no responde).
 */
export async function syncVariantStockToML(variantId: string): Promise<{
  ok: boolean;
  reason?: string;
}> {
  const supabase = createAdminClient();

  const { data: variant, error: variantError } = await supabase
    .from('product_variants')
    .select('id, sku, stock_qty, mercadolibre_item_id, mercadolibre_variation_code')
    .eq('id', variantId)
    .maybeSingle<VariantRow>();

  if (variantError || !variant) {
    return { ok: false, reason: 'variant_not_found' };
  }

  if (!variant.mercadolibre_item_id) {
    return { ok: true, reason: 'no_ml_mapping' };
  }

  const itemResult = await mlFetch<MLItem>(`/items/${variant.mercadolibre_item_id}`, {
    operation: 'sync_stock_outbound_fetch_item',
  });

  if (!itemResult.ok) {
    await logMLSyncError({
      operation: 'sync_stock_outbound',
      errorPayload: {
        stage: 'fetch_item',
        variant_id: variant.id,
        sku: variant.sku,
        ml_item_id: variant.mercadolibre_item_id,
        error: itemResult.error,
      },
    });
    return { ok: false, reason: itemResult.error };
  }

  const item = itemResult.data;
  const variations = item.variations ?? [];

  if (variations.length === 0) {
    if (variant.mercadolibre_variation_code) {
      return { ok: false, reason: 'variation_code_set_but_item_has_no_variations' };
    }
    const result = await mlFetch(`/items/${variant.mercadolibre_item_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available_quantity: variant.stock_qty }),
      operation: 'sync_stock_outbound_put_item',
    });
    if (!result.ok) {
      await logMLSyncError({
        operation: 'sync_stock_outbound',
        errorPayload: {
          stage: 'put_item',
          variant_id: variant.id,
          sku: variant.sku,
          ml_item_id: variant.mercadolibre_item_id,
          stock_qty: variant.stock_qty,
          error: result.error,
        },
      });
      return { ok: false, reason: result.error };
    }
    return { ok: true };
  }

  if (!variant.mercadolibre_variation_code) {
    return { ok: false, reason: 'item_has_variations_but_variation_code_missing' };
  }

  const matchedVariation = variations.find(
    (v) => v.seller_custom_field === variant.mercadolibre_variation_code,
  );

  if (!matchedVariation) {
    await logMLSyncError({
      operation: 'sync_stock_outbound',
      errorPayload: {
        stage: 'match_variation',
        variant_id: variant.id,
        sku: variant.sku,
        ml_item_id: variant.mercadolibre_item_id,
        ml_variation_code: variant.mercadolibre_variation_code,
        available_variation_codes: variations.map((v) => v.seller_custom_field),
      },
    });
    return { ok: false, reason: 'variation_not_found_in_item' };
  }

  const putResult = await mlFetch(
    `/items/${variant.mercadolibre_item_id}/variations/${matchedVariation.id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available_quantity: variant.stock_qty }),
      operation: 'sync_stock_outbound_put_variation',
    },
  );

  if (!putResult.ok) {
    await logMLSyncError({
      operation: 'sync_stock_outbound',
      errorPayload: {
        stage: 'put_variation',
        variant_id: variant.id,
        sku: variant.sku,
        ml_item_id: variant.mercadolibre_item_id,
        ml_variation_id: matchedVariation.id,
        stock_qty: variant.stock_qty,
        error: putResult.error,
      },
    });
    return { ok: false, reason: putResult.error };
  }

  return { ok: true };
}

/**
 * Sync inbound: dado un MLA, fetcha ML y actualiza stock_qty de las
 * variantes DB mapeadas. Usado por webhook (items topic) y cron de
 * reconciliación.
 *
 * Devuelve resumen de qué se sincronizó para logging.
 */
export async function syncStockFromMLItem(mlItemId: string): Promise<{
  ok: boolean;
  updated: number;
  skipped: number;
  reason?: string;
}> {
  const supabase = createAdminClient();

  const itemResult = await mlFetch<MLItem>(`/items/${mlItemId}`, {
    operation: 'sync_stock_inbound_fetch_item',
  });

  if (!itemResult.ok) {
    return { ok: false, updated: 0, skipped: 0, reason: itemResult.error };
  }

  const item = itemResult.data;
  const variations = item.variations ?? [];

  const { data: variants } = await supabase
    .from('product_variants')
    .select('id, sku, stock_qty, mercadolibre_item_id, mercadolibre_variation_code')
    .eq('mercadolibre_item_id', mlItemId)
    .returns<VariantRow[]>();

  if (!variants || variants.length === 0) {
    return { ok: true, updated: 0, skipped: 0, reason: 'no_mapped_variants' };
  }

  let updated = 0;
  let skipped = 0;

  if (variations.length === 0) {
    const single = variants.find((v) => v.mercadolibre_variation_code === null);
    if (!single) {
      skipped = variants.length;
    } else if (single.stock_qty !== item.available_quantity) {
      await supabase
        .from('product_variants')
        .update({ stock_qty: item.available_quantity })
        .eq('id', single.id);
      updated++;
    } else {
      skipped++;
    }
    return { ok: true, updated, skipped };
  }

  for (const variant of variants) {
    if (!variant.mercadolibre_variation_code) {
      skipped++;
      continue;
    }
    const matched = variations.find(
      (v) => v.seller_custom_field === variant.mercadolibre_variation_code,
    );
    if (!matched) {
      skipped++;
      continue;
    }
    if (variant.stock_qty === matched.available_quantity) {
      skipped++;
      continue;
    }
    await supabase
      .from('product_variants')
      .update({ stock_qty: matched.available_quantity })
      .eq('id', variant.id);
    updated++;
  }

  return { ok: true, updated, skipped };
}
