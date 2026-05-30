import 'server-only';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { mlFetch } from '@/lib/integrations/mercadolibre/api-client';
import { logMLSyncError } from '@/lib/integrations/mercadolibre/integrations-repo';

type VariantRow = {
  id: string;
  sku: string;
  stock_qty: number;
  price_cents: number;
  mercadolibre_item_id: string | null;
  mercadolibre_variation_code: string | null;
};

type MLAttributeCombination = {
  id: string;
  value_name: string | null;
};

type MLVariation = {
  id: number;
  seller_custom_field: string | null;
  available_quantity: number;
  /** ML devuelve price en pesos con decimales (ej. 79832.39).
   * Conversión a centavos: Math.round(price * 100). */
  price?: number;
  attribute_combinations?: MLAttributeCombination[];
};

/**
 * Devuelve TODOS los códigos posibles de una variation ML.
 * Usado para matching robusto: probamos cada formato hasta encontrar uno
 * que matchee con el `mercadolibre_variation_code` cargado en DB.
 *
 * Formatos soportados (orden no importa — todos se prueban):
 * 1. `variation.id` (ej. '182035179595'): siempre presente. Confiable.
 * 2. `seller_custom_field` (ej. 'SDEMI/DRWG15C3'): si seller lo seteó.
 * 3. `attribute_combinations[DESIGN/COLOR].value_name` parseado antes
 *    de ` - ` (ej. 'SDEMI'): si seller usa convención de naming.
 *
 * Bug detectado 2026-05-30 iter posterior: getVariationCode previa
 * devolvía 1 SOLO formato priorizado (seller_custom_field → DESIGN →
 * variation.id). Pero Yamain tiene DESIGN='Ovalado' para TODAS las
 * variations (no discrimina). La función devolvía 'Ovalado' para todas
 * y nunca llegaba al fallback variation.id. Fix: probar TODOS los
 * formatos en paralelo via variationMatches().
 */
function getAllVariationCodes(v: MLVariation): string[] {
  const codes: string[] = [String(v.id)];
  if (v.seller_custom_field && v.seller_custom_field.length > 0) {
    codes.push(v.seller_custom_field);
  }
  const designCombo = v.attribute_combinations?.find(
    (c) => c.id === 'DESIGN' || c.id === 'COLOR',
  );
  if (designCombo?.value_name) {
    const parsed = designCombo.value_name.split(' - ')[0]?.trim();
    if (parsed && parsed.length > 0) {
      codes.push(parsed);
    }
  }
  return codes;
}

/** Match variation contra código DB. Prueba todos los formatos posibles. */
function variationMatches(v: MLVariation, dbCode: string): boolean {
  return getAllVariationCodes(v).includes(dbCode);
}

type MLItem = {
  id: string;
  available_quantity: number;
  /** Precio del item en pesos con decimales. Para items multi-variation
   * el precio puede estar a nivel item (común para todas) o a nivel
   * variation. */
  price?: number;
  variations?: MLVariation[];
};

/** Convierte precio ML (pesos con decimales) a centavos para DB. */
function priceToCents(price: number | undefined | null): number | null {
  if (price === undefined || price === null) return null;
  if (typeof price !== 'number' || !isFinite(price)) return null;
  return Math.round(price * 100);
}

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

  const matchedVariation = variations.find((v) =>
    variationMatches(v, variant.mercadolibre_variation_code!),
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
        available_variation_codes: variations.map((v) => getAllVariationCodes(v)),
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
 * Sync inbound: dado un MLA, fetcha ML y actualiza stock_qty + price_cents
 * de las variantes DB mapeadas. Usado por webhook (items topic) y cron de
 * reconciliación.
 *
 * Sincroniza 2 campos:
 * - `stock_qty`: desde `available_quantity` (item o variation)
 * - `price_cents`: desde `price` × 100 (item o variation). Solo si ML
 *   devuelve price y difiere del DB. Para multi-variation, el precio
 *   puede estar a nivel item (común a todas) — en ese caso usamos
 *   `item.price` como fallback para todas las variations sin price propio.
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
  const itemPriceCents = priceToCents(item.price);

  const { data: variants } = await supabase
    .from('product_variants')
    .select('id, sku, stock_qty, price_cents, mercadolibre_item_id, mercadolibre_variation_code')
    .eq('mercadolibre_item_id', mlItemId)
    .returns<VariantRow[]>();

  if (!variants || variants.length === 0) {
    return { ok: true, updated: 0, skipped: 0, reason: 'no_mapped_variants' };
  }

  let updated = 0;
  let skipped = 0;

  const updatedVariantIds: string[] = [];

  if (variations.length === 0) {
    const single = variants.find((v) => v.mercadolibre_variation_code === null);
    if (!single) {
      skipped = variants.length;
    } else {
      const patch: { stock_qty?: number; price_cents?: number } = {};
      if (single.stock_qty !== item.available_quantity) {
        patch.stock_qty = item.available_quantity;
      }
      if (itemPriceCents !== null && single.price_cents !== itemPriceCents) {
        patch.price_cents = itemPriceCents;
      }
      if (Object.keys(patch).length > 0) {
        await supabase
          .from('product_variants')
          .update(patch)
          .eq('id', single.id);
        updated++;
        updatedVariantIds.push(single.id);
      } else {
        skipped++;
      }
    }
  } else {
    for (const variant of variants) {
      if (!variant.mercadolibre_variation_code) {
        skipped++;
        continue;
      }
      const matched = variations.find((v) =>
        variationMatches(v, variant.mercadolibre_variation_code!),
      );
      if (!matched) {
        skipped++;
        continue;
      }
      // Precio: prefiere el de la variation, fallback al del item base.
      const variationPriceCents = priceToCents(matched.price) ?? itemPriceCents;
      const patch: { stock_qty?: number; price_cents?: number } = {};
      if (variant.stock_qty !== matched.available_quantity) {
        patch.stock_qty = matched.available_quantity;
      }
      if (variationPriceCents !== null && variant.price_cents !== variationPriceCents) {
        patch.price_cents = variationPriceCents;
      }
      if (Object.keys(patch).length === 0) {
        skipped++;
        continue;
      }
      await supabase
        .from('product_variants')
        .update(patch)
        .eq('id', variant.id);
      updated++;
      updatedVariantIds.push(variant.id);
    }
  }

  if (updatedVariantIds.length > 0) {
    await revalidatePathsForVariants(updatedVariantIds);
  }

  return { ok: true, updated, skipped };
}

/**
 * Invalida el cache ISR de Next.js para las páginas afectadas por cambio
 * de stock. Sin esto, aunque la DB esté actualizada en 1s, la página
 * estática puede mostrar stock viejo hasta 5 min (`revalidate=300`).
 *
 * Páginas invalidadas:
 * - Página del producto: /{categorySlug}/{brandSlug}/{productSlug}
 * - Página de marca: /{categorySlug}/{brandSlug} (muestra in_stock_count)
 * - Página de categoría: /{categorySlug} (AggregateOffer + sub-categorías)
 */
async function revalidatePathsForVariants(variantIds: string[]): Promise<void> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('product_variants')
    .select(
      'product:products!inner(slug, brand:brands!inner(slug), category:categories!inner(slug))',
    )
    .in('id', variantIds)
    .returns<
      Array<{
        product: {
          slug: string;
          brand: { slug: string };
          category: { slug: string };
        };
      }>
    >();

  const pathsSet = new Set<string>();
  for (const row of data ?? []) {
    const cat = row.product.category.slug;
    const brand = row.product.brand.slug;
    const slug = row.product.slug;
    pathsSet.add(`/${cat}/${brand}/${slug}`);
    pathsSet.add(`/${cat}/${brand}`);
    pathsSet.add(`/${cat}`);
  }

  for (const path of pathsSet) {
    try {
      revalidatePath(path);
    } catch (err) {
      console.error('[ml-sync] revalidatePath failed', { path, err });
    }
  }
}
