import type { ProductCardData } from '@/components/product/product-card';
import type { ProductCardSource } from '@/lib/catalog/queries';
import { getImageScale } from '@/lib/catalog/image-scale-overrides';

/**
 * Transforma un `ProductCardSource` (raw query result) en `ProductCardData`
 * (shape consumido por `<ProductCard />`).
 *
 * Responsabilidades:
 * 1. Agrupar imágenes por variante (cada `product_images.variant_id` define
 *    de qué variante son las fotos).
 * 2. Identificar la "variante por default" — la primera con stock > 0
 *    ordenada por sort_order. Si todas sin stock, primera activa por sort.
 *    Si no hay activas, primera por sort.
 * 3. Para cada variante: extraer primary + secondary image (frontal+lateral),
 *    de modo que el hover en la card swap entre dos fotos DE LA MISMA variante
 *    (founder feedback: el hover anterior cambiaba a otra variante, confuso).
 * 4. Mini-thumbnails: una entrada por variante con su imagen primary +
 *    label visible (color_frame del JSONB attributes).
 */
export function toProductCardData(
  source: ProductCardSource,
  hrefPrefix: string,
  categorySlug: string,
  brandSlug: string,
): ProductCardData {
  const inStockVariants = source.variants.filter(
    (v) => v.is_active && v.stock_qty > 0,
  );
  const activeVariants = source.variants.filter((v) => v.is_active);

  const minPriceCents =
    inStockVariants.length > 0
      ? Math.min(...inStockVariants.map((v) => v.price_cents))
      : null;

  // Imágenes "globales" (variant_id=null) sirven como fallback si una
  // variante no tiene imágenes propias.
  const globalImages = (source.images ?? [])
    .filter((img) => img.variant_id === null)
    .sort(sortImage);

  /**
   * Para cada variante: primary (frontal) + secondary (lateral). Si la
   * variante no tiene imágenes propias, fallback a globalImages.
   */
  const buildVariantImages = (
    variantId: string,
  ): { primary: string | null; secondary: string | null } => {
    const own = (source.images ?? [])
      .filter((img) => img.variant_id === variantId)
      .sort(sortImage);
    const pool = own.length > 0 ? own : globalImages;
    return {
      primary: pool[0]?.storage_path ?? null,
      secondary: pool[1]?.storage_path ?? null,
    };
  };

  /**
   * Variante default = primera con stock > 0, ordenada por sort_order.
   * Fallback en cascada: con-stock → activa → cualquiera.
   */
  const sortedActive = [...activeVariants].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const sortedInStock = [...inStockVariants].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const defaultVariant =
    sortedInStock[0] ?? sortedActive[0] ?? source.variants[0];

  // Si no hay variantes (caso edge), fallback a primera imagen global.
  if (!defaultVariant) {
    const primary = globalImages[0]?.storage_path ?? null;
    const secondary = globalImages[1]?.storage_path ?? null;
    return {
      slug: source.slug,
      name: source.name,
      shortDescription: source.short_description,
      minPriceCents,
      inStockCount: inStockVariants.length,
      primaryImagePath: primary,
      secondaryImagePath: secondary,
      primaryImageScale: getImageScale(primary),
      secondaryImageScale: getImageScale(secondary),
      href: `${hrefPrefix}/${source.slug}`,
      categorySlug,
      brandSlug,
      variants: [],
    };
  }

  const defaultImages = buildVariantImages(defaultVariant.id);

  /**
   * Variantes para thumbnails: TODAS las activas (no solo con stock).
   * Mostrar las sin stock con tinte gris en UI. Si solo hay 1 activa, no
   * mostramos thumbnails (sin punto).
   */
  const variantThumbs = sortedActive.map((v) => {
    const images = buildVariantImages(v.id);
    return {
      id: v.id,
      label: extractColorLabel(v.attributes),
      primaryImagePath: images.primary,
      secondaryImagePath: images.secondary,
      primaryImageScale: getImageScale(images.primary),
      secondaryImageScale: getImageScale(images.secondary),
      inStock: v.stock_qty > 0,
    };
  });

  return {
    slug: source.slug,
    name: source.name,
    shortDescription: source.short_description,
    minPriceCents,
    inStockCount: inStockVariants.length,
    primaryImagePath: defaultImages.primary,
    secondaryImagePath: defaultImages.secondary,
    primaryImageScale: getImageScale(defaultImages.primary),
    secondaryImageScale: getImageScale(defaultImages.secondary),
    href: `${hrefPrefix}/${source.slug}`,
    categorySlug,
    brandSlug,
    variants: variantThumbs,
  };
}

function sortImage(
  a: { is_primary: boolean; sort_order: number },
  b: { is_primary: boolean; sort_order: number },
): number {
  if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
  return a.sort_order - b.sort_order;
}

/**
 * Extrae label legible para el thumbnail. Prioriza `color_frame` del JSONB,
 * cae a `color_lens` si no hay, fallback a "Variante N" si nada existe.
 */
function extractColorLabel(attributes: Record<string, unknown>): string {
  const colorFrame = attributes?.color_frame;
  if (typeof colorFrame === 'string' && colorFrame.length > 0) {
    return capitalizeFirst(colorFrame);
  }
  const colorLens = attributes?.color_lens;
  if (typeof colorLens === 'string' && colorLens.length > 0) {
    return capitalizeFirst(colorLens);
  }
  return 'Variante';
}

function capitalizeFirst(s: string): string {
  if (s.length === 0) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
