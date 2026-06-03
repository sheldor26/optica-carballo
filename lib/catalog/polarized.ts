import type { FilteredCatalogCard } from '@/lib/catalog/queries';

type AttributesJson = Record<string, unknown>;

/**
 * Detecta si UNA variante es polarizada. 4 fuentes (algunos seeds usan flags
 * distintos): `polarized`, `is_polarized` (Vulk Yamain), array `lens_treatment`
 * con 'polarized', o `model_code` que contiene "POL" (Rusty Yau histórico).
 * Server-safe (sin 'use client'): lo usan queries/helpers Y componentes client.
 *
 * Fuente única de verdad — antes estaba duplicado en variant-list.tsx.
 */
export function isPolarizedVariant(attrs: AttributesJson | null | undefined): boolean {
  if (!attrs) return false;
  if (attrs.polarized === true || attrs.polarized === 'true') return true;
  if (attrs.is_polarized === true || attrs.is_polarized === 'true') return true;
  if (
    Array.isArray(attrs.lens_treatment) &&
    attrs.lens_treatment.some((t) => typeof t === 'string' && t === 'polarized')
  ) {
    return true;
  }
  const modelCode = attrs.model_code;
  if (typeof modelCode === 'string' && /\bPOL\b/i.test(modelCode)) return true;
  return false;
}

/**
 * Reduce un listado de catálogo a la vista de POLARIZADOS (founder 2026-06-02:
 * "que solo la variante que tiene lentes polarizadas entre al catálogo de
 * /polarizados"). Por cada producto:
 *  - se queda solo con las variantes polarizadas,
 *  - si no tiene ninguna, se descarta el producto,
 *  - recalcula precio/stock/imagen primaria sobre el subconjunto polarizado,
 *    para que la card represente la variante polarizada (no la del producto).
 *
 * Pura, no muta. Depende de `ProductCardVariant.polarized` (lo setea
 * `buildCardVariants` vía `isPolarizedVariant`).
 */
export function toPolarizedCatalog(
  cards: FilteredCatalogCard[],
): FilteredCatalogCard[] {
  const out: FilteredCatalogCard[] = [];
  for (const c of cards) {
    const pol = c.variants.filter((v) => v.polarized === true);
    if (pol.length === 0) continue;
    const inStock = pol.filter((v) => v.inStock);
    out.push({
      ...c,
      variants: pol,
      inStockCount: inStock.length,
      minPriceCents:
        inStock.length > 0
          ? Math.min(...inStock.map((v) => v.priceCents))
          : null,
      primaryImagePath: pol[0]?.primaryImagePath ?? c.primaryImagePath,
      secondaryImagePath: pol[0]?.secondaryImagePath ?? c.secondaryImagePath,
      primaryImageScale: pol[0]?.primaryImageScale ?? c.primaryImageScale,
      secondaryImageScale: pol[0]?.secondaryImageScale ?? c.secondaryImageScale,
    });
  }
  return out;
}
