import { createClient } from '@/lib/supabase/server';
import { createStaticClient } from '@/lib/supabase/static';
import type { CategoryConfig } from '@/lib/catalog/categories';

// ============================================================================
// Tipos (manual porque supabase-js infiere mal embeds FK 1:1 como arrays — ver
// LEARNINGS 2026-05-28 "Supabase JS tipa embeds FK 1:1 como arrays")
// ============================================================================

export type BrandPageData = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  is_argentine: boolean;
};

export type ProductCardSource = {
  slug: string;
  name: string;
  short_description: string | null;
  is_featured: boolean;
  variants: Array<{
    price_cents: number;
    stock_qty: number;
    is_active: boolean;
  }>;
};

type CategoryRow = { id: string };

export type ProductImage = {
  storage_path: string;
  alt_text: string;
  width: number | null;
  height: number | null;
  sort_order: number;
  is_primary: boolean;
};

export type ProductDetailData = {
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  attributes: Record<string, unknown>;
  meta_description: string | null;
  is_active: boolean;
  brand: {
    slug: string;
    name: string;
    description: string | null;
    is_argentine: boolean;
    is_active: boolean;
  };
  category: { slug: string; is_active: boolean };
  variants: Array<{
    id: string;
    sku: string;
    price_cents: number;
    stock_qty: number;
    attributes: Record<string, unknown>;
    is_active: boolean;
    sort_order: number;
  }>;
  images: ProductImage[];
};

type StaticBrandRow = { slug: string };
type StaticProductRow = {
  slug: string;
  brand: { slug: string };
  category: { slug: string };
};

export type BrandWithProductCount = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  is_argentine: boolean;
  productCount: number;
};

type CategoryIndexProductRow = {
  brand_id: string;
};

// ============================================================================
// Helpers para páginas
// ============================================================================

/**
 * Página de marca: trae brand + lista de productos en una categoría,
 * con datos suficientes para renderizar el grid.
 * Devuelve `null` si la marca no existe o no está activa o la categoría es
 * inválida.
 */
export async function fetchBrandPage(
  brandSlug: string,
  category: CategoryConfig,
): Promise<{ brand: BrandPageData; products: ProductCardSource[] } | null> {
  const supabase = await createClient();

  const { data: brand } = await supabase
    .from('brands')
    .select('id, slug, name, description, is_argentine')
    .eq('slug', brandSlug)
    .eq('is_active', true)
    .maybeSingle()
    .returns<BrandPageData>();

  if (!brand) return null;

  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', category.slug)
    .is('parent_id', null)
    .eq('is_active', true)
    .maybeSingle()
    .returns<CategoryRow>();

  if (!cat) return null;

  const { data: products } = await supabase
    .from('products')
    .select(
      'slug, name, short_description, is_featured, variants:product_variants(price_cents, stock_qty, is_active)',
    )
    .eq('brand_id', brand.id)
    .eq('category_id', cat.id)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('name', { ascending: true })
    .returns<ProductCardSource[]>();

  return { brand, products: products ?? [] };
}

/**
 * Página de producto: trae el producto con 3 validaciones de seguridad —
 * producto activo, brand matchea, category matchea. Cualquier mismatch
 * devuelve `null` (la page llama `notFound()`).
 */
export async function fetchProductPage(
  brandSlug: string,
  productSlug: string,
  category: CategoryConfig,
): Promise<ProductDetailData | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('products')
    .select(
      `
        slug,
        name,
        short_description,
        description,
        attributes,
        meta_description,
        is_active,
        brand:brands!inner(slug, name, description, is_argentine, is_active),
        category:categories!inner(slug, is_active),
        variants:product_variants(id, sku, price_cents, stock_qty, attributes, is_active, sort_order),
        images:product_images(storage_path, alt_text, width, height, sort_order, is_primary)
      `,
    )
    .eq('slug', productSlug)
    .eq('is_active', true)
    .maybeSingle()
    .returns<ProductDetailData>();

  if (!data) return null;
  if (!data.brand.is_active) return null;
  if (data.brand.slug !== brandSlug) return null;
  if (data.category.slug !== category.slug) return null;
  if (!data.category.is_active) return null;

  return data;
}

// ============================================================================
// Productos relacionados (algoritmo cascada)
// ============================================================================

export type RelatedProductCard = {
  slug: string;
  name: string;
  brandSlug: string;
  brandName: string;
  categorySlug: string;
  shortDescription: string | null;
  minPriceCents: number | null;
  inStockCount: number;
  primaryImagePath: string | null;
};

type RelatedRow = {
  slug: string;
  name: string;
  short_description: string | null;
  brand: { slug: string; name: string; is_active: boolean };
  category: { slug: string };
  variants: Array<{ price_cents: number; stock_qty: number; is_active: boolean }>;
  images: Array<{ storage_path: string; is_primary: boolean; sort_order: number }>;
};

function toRelatedCard(row: RelatedRow): RelatedProductCard {
  const inStock = row.variants.filter((v) => v.is_active && v.stock_qty > 0);
  const minPriceCents =
    inStock.length > 0 ? Math.min(...inStock.map((v) => v.price_cents)) : null;
  const sortedImages = [...row.images].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.sort_order - b.sort_order;
  });
  return {
    slug: row.slug,
    name: row.name,
    brandSlug: row.brand.slug,
    brandName: row.brand.name,
    categorySlug: row.category.slug,
    shortDescription: row.short_description,
    minPriceCents,
    inStockCount: inStock.length,
    primaryImagePath: sortedImages[0]?.storage_path ?? null,
  };
}

const RELATED_LIMIT = 6;

/**
 * Productos similares para la página de detalle. Algoritmo en cascada
 * (seo-strategist): (1) misma categoría + misma marca, (2) misma
 * categoría + similar precio ±30%, (3) misma categoría + misma forma de
 * armazón, (4) misma categoría cualquier marca. Filtra el producto
 * actual y los que no tienen stock.
 */
export async function fetchRelatedProducts(args: {
  excludeSlug: string;
  categorySlug: string;
  brandSlug: string;
  priceCents: number | null;
  frameShape: string | null;
}): Promise<RelatedProductCard[]> {
  const supabase = await createClient();

  const baseSelect = `
    slug,
    name,
    short_description,
    brand:brands!inner(slug, name, is_active),
    category:categories!inner(slug),
    variants:product_variants(price_cents, stock_qty, is_active),
    images:product_images(storage_path, is_primary, sort_order)
  ` as const;

  const collected = new Map<string, RelatedProductCard>();

  const addRows = (rows: RelatedRow[] | null | undefined) => {
    if (!rows) return;
    for (const row of rows) {
      if (collected.size >= RELATED_LIMIT) return;
      if (row.slug === args.excludeSlug) continue;
      if (!row.brand.is_active) continue;
      const card = toRelatedCard(row);
      if (card.inStockCount === 0) continue;
      if (collected.has(card.slug)) continue;
      collected.set(card.slug, card);
    }
  };

  // Paso 1: misma categoría + misma marca
  const step1 = await supabase
    .from('products')
    .select(baseSelect)
    .eq('is_active', true)
    .eq('category.slug', args.categorySlug)
    .eq('brand.slug', args.brandSlug)
    .neq('slug', args.excludeSlug)
    .limit(RELATED_LIMIT)
    .returns<RelatedRow[]>();
  addRows(step1.data);
  if (collected.size >= RELATED_LIMIT) return Array.from(collected.values());

  // Paso 2: misma categoría + similar precio (±30%) — cualquier marca
  if (args.priceCents !== null) {
    const min = Math.floor(args.priceCents * 0.7);
    const max = Math.ceil(args.priceCents * 1.3);
    const step2 = await supabase
      .from('products')
      .select(baseSelect)
      .eq('is_active', true)
      .eq('category.slug', args.categorySlug)
      .neq('slug', args.excludeSlug)
      .gte('variants.price_cents', min)
      .lte('variants.price_cents', max)
      .limit(RELATED_LIMIT * 2)
      .returns<RelatedRow[]>();
    addRows(step2.data);
    if (collected.size >= RELATED_LIMIT) return Array.from(collected.values());
  }

  // Paso 3: misma categoría + misma forma de armazón
  if (args.frameShape) {
    const step3 = await supabase
      .from('products')
      .select(baseSelect)
      .eq('is_active', true)
      .eq('category.slug', args.categorySlug)
      .neq('slug', args.excludeSlug)
      .eq('attributes->>frame_shape', args.frameShape)
      .limit(RELATED_LIMIT * 2)
      .returns<RelatedRow[]>();
    addRows(step3.data);
    if (collected.size >= RELATED_LIMIT) return Array.from(collected.values());
  }

  // Paso 4: fallback — cualquier producto de la misma categoría
  const step4 = await supabase
    .from('products')
    .select(baseSelect)
    .eq('is_active', true)
    .eq('category.slug', args.categorySlug)
    .neq('slug', args.excludeSlug)
    .limit(RELATED_LIMIT * 2)
    .returns<RelatedRow[]>();
  addRows(step4.data);

  return Array.from(collected.values());
}

/**
 * Devuelve todas las marcas activas ordenadas por sort_order. Reusada
 * por la home (sección "marcas que trabajamos") y otras vistas que listan
 * marcas independientemente de si tienen productos cargados.
 */
export async function fetchAllActiveBrands(): Promise<
  Array<{
    id: string;
    slug: string;
    name: string;
    description: string | null;
    is_argentine: boolean;
  }>
> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('brands')
    .select('id, slug, name, description, is_argentine')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

/**
 * Página índice de categoría (`/anteojos-de-sol`, `/anteojos-de-receta`):
 * devuelve las marcas que tienen al menos 1 producto activo en la
 * categoría, con count por marca. Marcas sin productos no aparecen.
 */
export async function fetchCategoryIndex(
  category: CategoryConfig,
): Promise<BrandWithProductCount[]> {
  // Usa el cliente estático (sin cookies) para que la página pueda ser SSG.
  // La query lee data pública; no requiere session de usuario.
  const supabase = createStaticClient();

  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', category.slug)
    .is('parent_id', null)
    .eq('is_active', true)
    .maybeSingle()
    .returns<CategoryRow>();

  if (!cat) return [];

  // Traemos brand_id de cada producto activo en la categoría y agregamos
  // count por brand en TS (más simple que GROUP BY via PostgREST).
  const { data: productRows } = await supabase
    .from('products')
    .select('brand_id')
    .eq('category_id', cat.id)
    .eq('is_active', true)
    .returns<CategoryIndexProductRow[]>();

  const countByBrand = new Map<string, number>();
  for (const row of productRows ?? []) {
    countByBrand.set(row.brand_id, (countByBrand.get(row.brand_id) ?? 0) + 1);
  }

  if (countByBrand.size === 0) return [];

  const brandIds = Array.from(countByBrand.keys());

  const { data: brands } = await supabase
    .from('brands')
    .select('id, slug, name, description, is_argentine')
    .in('id', brandIds)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .returns<Omit<BrandWithProductCount, 'productCount'>[]>();

  return (brands ?? []).map((b) => ({
    ...b,
    productCount: countByBrand.get(b.id) ?? 0,
  }));
}

/**
 * Para `generateStaticParams` de páginas de marca: devuelve los slugs de
 * todas las marcas activas. Las mismas marcas existen en sol y receta —
 * Next pre-genera ambas variantes.
 */
export async function getStaticBrandParams(): Promise<{ brand: string }[]> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('brands')
    .select('slug')
    .eq('is_active', true)
    .returns<StaticBrandRow[]>();
  return (data ?? []).map((b) => ({ brand: b.slug }));
}

/**
 * Para `generateStaticParams` de páginas de producto: devuelve las
 * combinaciones {brand, product} para una categoría específica.
 */
export async function getStaticProductParamsForCategory(
  category: CategoryConfig,
): Promise<{ brand: string; product: string }[]> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('products')
    .select('slug, brand:brands!inner(slug), category:categories!inner(slug)')
    .eq('is_active', true)
    .eq('category.slug', category.slug)
    .returns<StaticProductRow[]>();
  return (data ?? []).map((p) => ({
    brand: p.brand.slug,
    product: p.slug,
  }));
}
