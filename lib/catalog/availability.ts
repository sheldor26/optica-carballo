/**
 * `true` si al menos una variante activa tiene stock real. Mismo criterio
 * que ya usa el resto del catálogo (`fetchProductsByCategory*`,
 * `product-jsonld`) para decidir qué mostrar como disponible — se reutiliza
 * acá para decidir qué se indexa (sitemap, metadata, `generateStaticParams`).
 * Productos sin ninguna variante con stock no deben indexarse: `SEO_STRATEGY.md`
 * dice que sin stock se saca del índice.
 */
export function hasAvailableStock(
  variants: { is_active: boolean; stock_qty: number }[],
): boolean {
  return variants.some((v) => v.is_active && v.stock_qty > 0);
}
