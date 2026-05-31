import { createClient } from '@/lib/supabase/server';
import { getImageScale } from '@/lib/catalog/image-scale-overrides';
import type { SwipeProduct } from '@/lib/swipe/types';

/** Shape minimal que necesita el SwipeDeck — no usamos `ProductCardSource`
 * porque el swipe muestra UNA foto sin variants thumbnails. */
type SwipeProductRow = {
  slug: string;
  name: string;
  short_description: string | null;
  category: { slug: string };
  brand: { slug: string; name: string };
  variants: Array<{ price_cents: number; stock_qty: number; is_active: boolean }>;
  images: Array<{
    storage_path: string;
    is_primary: boolean;
    sort_order: number;
    variant_id: string | null;
  }>;
};

/**
 * Lista todos los productos activos con AL MENOS 1 variante con stock real,
 * shuffled. Devuelve shape SwipeProduct (mínimo).
 *
 * Shuffle server-side (PostgreSQL `random()`) para que cada visita al swipe
 * tenga un orden distinto — sino siempre verían los mismos productos primero.
 *
 * Mezcla categorías (sol + receta): la idea del swipe es descubrimiento
 * libre, no filtro por categoría.
 */
export async function fetchSwipeProducts(): Promise<SwipeProduct[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      slug,
      name,
      short_description,
      category:categories!inner(slug),
      brand:brands!inner(slug, name, is_active),
      variants:product_variants(price_cents, stock_qty, is_active),
      images:product_images(storage_path, is_primary, sort_order, variant_id)
    `,
    )
    .eq('is_active', true)
    .eq('brand.is_active', true)
    .returns<SwipeProductRow[]>();

  if (error || !data) {
    console.error('[swipe] fetchSwipeProducts failed:', error?.message);
    return [];
  }

  // Filter: solo productos con variant activo + stock real.
  const withStock = data.filter((p) =>
    p.variants.some((v) => v.is_active && v.stock_qty > 0),
  );

  // Map a SwipeProduct.
  const products = withStock.map((p): SwipeProduct => {
    const inStockVariants = p.variants.filter(
      (v) => v.is_active && v.stock_qty > 0,
    );
    const prices = inStockVariants.map((v) => v.price_cents);
    const minPrice = prices.length > 0 ? Math.min(...prices) : null;

    // Primary image: la primera con is_primary=true, o la primera por sort_order.
    const sortedImages = [...p.images].sort(
      (a, b) => a.sort_order - b.sort_order,
    );
    const primary =
      sortedImages.find((img) => img.is_primary) ?? sortedImages[0] ?? null;

    return {
      slug: p.slug,
      brandSlug: p.brand.slug,
      brandName: p.brand.name,
      categorySlug: p.category.slug,
      name: p.name,
      shortDescription: p.short_description,
      minPriceCents: minPrice,
      primaryImagePath: primary?.storage_path ?? null,
      primaryImageScale: primary
        ? getImageScale(primary.storage_path)
        : 1,
      href: `/${p.category.slug}/${p.brand.slug}/${p.slug}`,
    };
  });

  // Fisher-Yates shuffle (client-side aleatoriedad determinística desde Node).
  // No usamos `random()` en PostgreSQL para no complicar el query — el set
  // es chico (<50 productos esperados), shuffle JS es trivial.
  for (let i = products.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [products[i], products[j]] = [products[j]!, products[i]!];
  }

  return products;
}

/**
 * Productos que matchean los slugs pasados, con shape `SwipeProduct`.
 * Usado en `/mi-cuenta/matches` para renderizar el grid de matches del
 * usuario logueado (los slugs vienen de `listMyMatches()` action).
 *
 * Mantiene el orden de `slugs` en el output (los más recientes primero
 * según `swipe_matches.created_at DESC`).
 */
export async function fetchProductsBySlug(
  slugs: string[],
): Promise<SwipeProduct[]> {
  if (slugs.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      slug,
      name,
      short_description,
      category:categories!inner(slug),
      brand:brands!inner(slug, name, is_active),
      variants:product_variants(price_cents, stock_qty, is_active),
      images:product_images(storage_path, is_primary, sort_order, variant_id)
    `,
    )
    .in('slug', slugs)
    .eq('is_active', true)
    .eq('brand.is_active', true)
    .returns<SwipeProductRow[]>();

  if (error || !data) {
    console.error('[swipe] fetchProductsBySlug failed:', error?.message);
    return [];
  }

  const products = data.map((p): SwipeProduct => {
    const inStockVariants = p.variants.filter(
      (v) => v.is_active && v.stock_qty > 0,
    );
    const prices = inStockVariants.map((v) => v.price_cents);
    const minPrice = prices.length > 0 ? Math.min(...prices) : null;
    const sortedImages = [...p.images].sort(
      (a, b) => a.sort_order - b.sort_order,
    );
    const primary =
      sortedImages.find((img) => img.is_primary) ?? sortedImages[0] ?? null;

    return {
      slug: p.slug,
      brandSlug: p.brand.slug,
      brandName: p.brand.name,
      categorySlug: p.category.slug,
      name: p.name,
      shortDescription: p.short_description,
      minPriceCents: minPrice,
      primaryImagePath: primary?.storage_path ?? null,
      primaryImageScale: primary ? getImageScale(primary.storage_path) : 1,
      href: `/${p.category.slug}/${p.brand.slug}/${p.slug}`,
    };
  });

  // Mantener orden según `slugs` original (que viene de DB ordenado por
  // created_at DESC, más recientes primero).
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  return slugs
    .map((s) => bySlug.get(s))
    .filter((p): p is SwipeProduct => p !== undefined);
}
