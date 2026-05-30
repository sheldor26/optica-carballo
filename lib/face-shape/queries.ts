'use server';

import { fetchProductsByFrameShapes } from '@/lib/catalog/queries';

/**
 * Shape devuelto por `fetchRecommendedProducts`. Coincide con
 * `ProductCardData` de `components/product/product-card.tsx` para que el
 * grid pueda renderizar con el ProductCard existente sin transformaciones
 * adicionales en cliente.
 *
 * Mantenido como type propio (no importado) porque ProductCardData vive
 * en un archivo client component y aunque importar `type` técnicamente
 * funciona, mantener el shape declarado del lado server reduce
 * acoplamiento cross-boundary.
 */
export type RecommendedProduct = {
  slug: string;
  name: string;
  shortDescription: string | null;
  minPriceCents: number | null;
  inStockCount: number;
  primaryImagePath: string | null;
  secondaryImagePath: string | null;
  href: string;
  categorySlug: string;
  brandSlug: string;
};

const DEFAULT_LIMIT = 5;

/**
 * Para el recomendador de monturas: trae productos cruzando sol + receta
 * que matchean con las shapes recomendadas por la IA. Limita a 5 para
 * que el grid no sature la UI.
 *
 * Si no hay matches en ninguna categoría devuelve array vacío — el
 * cliente muestra un fallback explicando que estamos sumando modelos.
 */
export async function fetchRecommendedProducts(
  shapes: string[],
): Promise<RecommendedProduct[]> {
  if (shapes.length === 0) return [];

  const cards = await fetchProductsByFrameShapes({
    frameShapes: shapes,
    limit: DEFAULT_LIMIT,
  });

  return cards.map((card) => ({
    slug: card.slug,
    name: card.name,
    shortDescription: card.shortDescription,
    minPriceCents: card.minPriceCents,
    inStockCount: card.inStockCount,
    primaryImagePath: card.primaryImagePath,
    secondaryImagePath: card.secondaryImagePath,
    href: `/${card.categorySlug}/${card.brandSlug}/${card.slug}`,
    categorySlug: card.categorySlug,
    brandSlug: card.brandSlug,
  }));
}
