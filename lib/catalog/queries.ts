// SOLO cliente estático (sin cookies): el catálogo es data pública (RLS de
// lectura anon). Usar el cliente con cookies acá volvía DINÁMICAS las páginas
// de marca/producto y anulaba el ISR (audit perf 2026-06-11).
import { createStaticClient } from '@/lib/supabase/static';
import type { CategoryConfig } from '@/lib/catalog/categories';
import { hasAvailableStock } from '@/lib/catalog/availability';
import { getImageScale } from '@/lib/catalog/image-scale-overrides';
import { deriveSizeFit } from '@/lib/catalog/size-fit';
import { buildCardVariants } from '@/lib/catalog/to-product-card-data';
import type { ProductCardVariant } from '@/components/product/product-card';

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
  logo_url: string | null;
  seo_intro: string | null;
  seo_outro: string | null;
};

const BRAND_PAGE_SELECT =
  'id, slug, name, description, is_argentine, logo_url, seo_intro, seo_outro';

export type ProductCardSource = {
  slug: string;
  name: string;
  short_description: string | null;
  is_featured: boolean;
  /** JSONB del producto. Para derivar el badge de talle (`size_fit`). */
  attributes?: Record<string, unknown>;
  variants: Array<{
    id: string;
    sku: string;
    price_cents: number;
    stock_qty: number;
    is_active: boolean;
    sort_order: number;
    attributes: Record<string, unknown>;
  }>;
  images?: Array<{
    storage_path: string;
    is_primary: boolean;
    sort_order: number;
    variant_id: string | null;
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
  variant_id: string | null;
};

export type ProductDetailData = {
  id: string;
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
    /** Path al logo de la marca en bucket `brand-assets` (storage path).
     * Se usa para reemplazar el texto del nombre en el PDP. Fallback a
     * `name` si NULL. */
    logo_url: string | null;
    /** Imagen brand-wide del kit incluido (estuche+franela+stickers).
     * Se renderiza al final de la galería de PDP de TODOS los productos
     * de esta marca. Excepción: producto con
     * `attributes.hide_brand_includes_image: true` la oculta. */
    includes_image_path: string | null;
    includes_image_alt: string | null;
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
  variants: { is_active: boolean; stock_qty: number }[];
};

export type BrandWithProductCount = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  is_argentine: boolean;
  logo_url: string | null;
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
  const supabase = createStaticClient();

  const { data: brand } = await supabase
    .from('brands')
    .select(BRAND_PAGE_SELECT)
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
      'slug, name, short_description, is_featured, attributes, variants:product_variants(id, sku, price_cents, stock_qty, is_active, sort_order, attributes), images:product_images(storage_path, is_primary, sort_order, variant_id)',
    )
    .eq('brand_id', brand.id)
    .eq('category_id', cat.id)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('name', { ascending: true })
    .returns<ProductCardSource[]>();

  return { brand, products: products ?? [] };
}

export type BrandGenderTarget = 'hombre' | 'mujer';

/**
 * Página hija SEO de marca por género — `/anteojos-de-sol/[brand]/hombre`.
 *
 * Filtra productos por `attributes->>gender`:
 * - `target='hombre'` → `gender IN ('male', 'unisex')`
 * - `target='mujer'` → `gender IN ('female', 'unisex')`
 *
 * Productos sin `gender` definido NO aparecen en ninguna página hija
 * (PRODUCT_SCHEMA lo lista como 🔴 OBLIGATORIO — todo producto debe tener
 * `attributes.gender` seteado para aparecer en estas páginas SEO).
 *
 * Devuelve `null` si la marca no existe o no está activa. Si la marca
 * existe pero no tiene productos del género filtrado, devuelve
 * `{ brand, products: [] }` — la página renderiza empty state.
 */
export async function fetchBrandPageByGender(args: {
  brandSlug: string;
  category: CategoryConfig;
  target: BrandGenderTarget;
}): Promise<{ brand: BrandPageData; products: ProductCardSource[] } | null> {
  const supabase = createStaticClient();

  const { data: brand } = await supabase
    .from('brands')
    .select(BRAND_PAGE_SELECT)
    .eq('slug', args.brandSlug)
    .eq('is_active', true)
    .maybeSingle()
    .returns<BrandPageData>();

  if (!brand) return null;

  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', args.category.slug)
    .is('parent_id', null)
    .eq('is_active', true)
    .maybeSingle()
    .returns<CategoryRow>();

  if (!cat) return null;

  const genderValues =
    args.target === 'hombre' ? ['male', 'unisex'] : ['female', 'unisex'];

  const { data: products } = await supabase
    .from('products')
    .select(
      'slug, name, short_description, is_featured, attributes, variants:product_variants(id, sku, price_cents, stock_qty, is_active, sort_order, attributes), images:product_images(storage_path, is_primary, sort_order, variant_id)',
    )
    .eq('brand_id', brand.id)
    .eq('category_id', cat.id)
    .eq('is_active', true)
    .in('attributes->>gender', genderValues)
    .order('is_featured', { ascending: false })
    .order('name', { ascending: true })
    .returns<ProductCardSource[]>();

  return { brand, products: products ?? [] };
}

/**
 * Página hija SEO de marca filtrada por atributo (forma o tratamiento) —
 * `/anteojos-de-sol/[brand]/polarizados`, `/wayfarer`, etc.
 *
 * Filtra según `BrandFilter.filter.type`:
 * - `frame_shape`: igualdad exacta sobre `attributes->>frame_shape`.
 * - `lens_treatment_includes`: contains sobre `attributes->lens_treatment`
 *   (jsonb array) usando `cs` (contains).
 *
 * Devuelve `null` si la marca no existe o no está activa. Empty array si
 * existe pero no tiene productos del filtro.
 */
export async function fetchBrandPageByFilter(args: {
  brandSlug: string;
  category: CategoryConfig;
  filter:
    | { type: 'frame_shape'; value: string }
    | { type: 'frame_material'; value: string }
    | { type: 'lens_treatment_includes'; value: string };
}): Promise<{ brand: BrandPageData; products: ProductCardSource[] } | null> {
  const supabase = createStaticClient();

  const { data: brand } = await supabase
    .from('brands')
    .select(BRAND_PAGE_SELECT)
    .eq('slug', args.brandSlug)
    .eq('is_active', true)
    .maybeSingle()
    .returns<BrandPageData>();

  if (!brand) return null;

  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', args.category.slug)
    .is('parent_id', null)
    .eq('is_active', true)
    .maybeSingle()
    .returns<CategoryRow>();

  if (!cat) return null;

  let query = supabase
    .from('products')
    .select(
      'slug, name, short_description, is_featured, attributes, variants:product_variants(id, sku, price_cents, stock_qty, is_active, sort_order, attributes), images:product_images(storage_path, is_primary, sort_order, variant_id)',
    )
    .eq('brand_id', brand.id)
    .eq('category_id', cat.id)
    .eq('is_active', true);

  if (args.filter.type === 'frame_shape') {
    query = query.eq('attributes->>frame_shape', args.filter.value);
  } else if (args.filter.type === 'frame_material') {
    query = query.eq('attributes->>frame_material', args.filter.value);
  } else {
    // jsonb containment: el valor debe ir como JSON (`["polarized"]`), NO como
    // array JS — `.contains(col, ['polarized'])` lo serializa como literal de
    // array PG `{polarized}` → error 22P02 "invalid input syntax for type json"
    // → la query falla y devuelve [] (página de polarizados vacía, bug 2026-06-02).
    query = query.contains(
      'attributes->lens_treatment',
      JSON.stringify([args.filter.value]),
    );
  }

  const { data: products } = await query
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
  const supabase = createStaticClient();

  const { data } = await supabase
    .from('products')
    .select(
      `
        id,
        slug,
        name,
        short_description,
        description,
        attributes,
        meta_description,
        is_active,
        brand:brands!inner(slug, name, description, is_argentine, is_active, logo_url, includes_image_path, includes_image_alt),
        category:categories!inner(slug, is_active),
        variants:product_variants(id, sku, price_cents, stock_qty, attributes, is_active, sort_order),
        images:product_images(storage_path, alt_text, width, height, sort_order, is_primary, variant_id)
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
  secondaryImagePath: string | null;
  primaryImageScale: number;
  secondaryImageScale: number;
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
  const primaryImagePath = sortedImages[0]?.storage_path ?? null;
  const secondaryImagePath = sortedImages[1]?.storage_path ?? null;
  return {
    slug: row.slug,
    name: row.name,
    brandSlug: row.brand.slug,
    brandName: row.brand.name,
    categorySlug: row.category.slug,
    shortDescription: row.short_description,
    minPriceCents,
    inStockCount: inStock.length,
    primaryImagePath,
    secondaryImagePath,
    primaryImageScale: getImageScale(primaryImagePath),
    secondaryImageScale: getImageScale(secondaryImagePath),
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
  const supabase = createStaticClient();

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
 * Datos del producto "hermano" en la otra modalidad (sol ↔ receta), para el
 * cross-link de la PDP. Dos niveles de match:
 *
 * 1. `exact` — el MISMO modelo, derivado por convención de naming del slug
 *    (el armazón de receta lleva sufijo `-receta`, el de sol no). Validado en
 *    DB 2026-06-14: los 6 pares sol↔receta cumplen exactamente slug ± "-receta"
 *    — rusty-misty/patien/spell/xold, vulk-katleen, vulk-the-trial.
 * 2. `similar` — fallback cuando no hay match exacto: misma marca + misma
 *    `frame_shape` + precio ±25%, en la otra categoría. Umbral estricto a
 *    propósito (conversion-optimizer 2026-08-01): un match dudoso en la zona
 *    de decisión de compra rompe más confianza que no mostrar nada, así que
 *    ante la duda devuelve null en vez de forzar cobertura.
 *
 * El caller (PDP) usa `matchType` para elegir copy honesto — "similar" NUNCA
 * debe decir que es el mismo anteojo.
 *
 * Devuelve null si no hay ningún match en ninguno de los dos niveles.
 */
export type CompanionModality = {
  href: string;
  /** category slug del producto DESTINO ('anteojos-de-sol' | 'anteojos-de-receta') */
  targetCategorySlug: string;
  name: string;
  imagePath: string | null;
  imageScale: number;
  matchType: 'exact' | 'similar';
};

type CompanionRow = {
  slug: string;
  name: string;
  brand: { slug: string; is_active: boolean };
  category: { slug: string };
  images: { storage_path: string; is_primary: boolean; sort_order: number }[] | null;
};

type SimilarCompanionRow = CompanionRow & {
  variants: { price_cents: number; stock_qty: number; is_active: boolean }[];
};

function toCompanionModality(
  data: CompanionRow,
  matchType: CompanionModality['matchType'],
): CompanionModality {
  const imgs = data.images ?? [];
  const primaryPath =
    imgs.find((i) => i.is_primary)?.storage_path ??
    [...imgs].sort((a, b) => a.sort_order - b.sort_order)[0]?.storage_path ??
    null;

  return {
    href: `/${data.category.slug}/${data.brand.slug}/${data.slug}`,
    targetCategorySlug: data.category.slug,
    name: data.name,
    imagePath: primaryPath,
    imageScale: getImageScale(primaryPath),
    matchType,
  };
}

export async function fetchCompanionModality(args: {
  slug: string;
  categorySlug: string;
  /** Necesarios solo para el fallback por similitud — omitir si no se tienen
   * a mano hace que la función se limite al match exacto. */
  brandSlug?: string;
  frameShape?: string | null;
  priceCents?: number | null;
}): Promise<CompanionModality | null> {
  const isReceta = args.categorySlug === 'anteojos-de-receta';
  const targetCategorySlug = isReceta ? 'anteojos-de-sol' : 'anteojos-de-receta';
  const companionSlug = isReceta
    ? args.slug.replace(/-receta$/, '')
    : `${args.slug}-receta`;

  const supabase = createStaticClient();

  if (companionSlug !== args.slug) {
    const { data } = await supabase
      .from('products')
      .select(
        `slug, name,
         brand:brands!inner(slug, is_active),
         category:categories!inner(slug),
         images:product_images(storage_path, is_primary, sort_order)`,
      )
      .eq('is_active', true)
      .eq('slug', companionSlug)
      .maybeSingle()
      .returns<CompanionRow>();

    if (data && data.brand.is_active) {
      return toCompanionModality(data, 'exact');
    }
  }

  if (!args.brandSlug || !args.frameShape || args.priceCents == null) {
    return null;
  }

  const minPrice = Math.floor(args.priceCents * 0.75);
  const maxPrice = Math.ceil(args.priceCents * 1.25);

  const { data: similarRows } = await supabase
    .from('products')
    .select(
      `slug, name,
       brand:brands!inner(slug, is_active),
       category:categories!inner(slug),
       variants:product_variants(price_cents, stock_qty, is_active),
       images:product_images(storage_path, is_primary, sort_order)`,
    )
    .eq('is_active', true)
    .eq('category.slug', targetCategorySlug)
    .eq('brand.slug', args.brandSlug)
    .eq('attributes->>frame_shape', args.frameShape)
    .neq('slug', args.slug)
    .returns<SimilarCompanionRow[]>();

  const candidates = (similarRows ?? [])
    .filter((row) => row.brand.is_active)
    .map((row) => {
      const inStock = row.variants.filter((v) => v.is_active && v.stock_qty > 0);
      const minVariantPrice =
        inStock.length > 0 ? Math.min(...inStock.map((v) => v.price_cents)) : null;
      return { row, minVariantPrice };
    })
    .filter(
      (c): c is { row: SimilarCompanionRow; minVariantPrice: number } =>
        c.minVariantPrice !== null &&
        c.minVariantPrice >= minPrice &&
        c.minVariantPrice <= maxPrice,
    )
    .sort(
      (a, b) =>
        Math.abs(a.minVariantPrice - args.priceCents!) -
        Math.abs(b.minVariantPrice - args.priceCents!),
    );

  if (candidates.length === 0) return null;

  return toCompanionModality(candidates[0]!.row, 'similar');
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
    logo_url: string | null;
  }>
> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('brands')
    .select('id, slug, name, description, is_argentine, logo_url')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export type BrandIndexEntry = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  is_argentine: boolean;
  logo_url: string | null;
  productCount: number;
};

type BrandWithProductsRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  is_argentine: boolean;
  logo_url: string | null;
  sort_order: number;
  products: Array<{ id: string; is_active: boolean }>;
};

/**
 * Devuelve TODAS las marcas activas con count total de productos activos
 * (sumando sol + receta). Para la página índice `/marcas`.
 *
 * Marcas sin productos activos NO aparecen (inner join + filter).
 */
export async function fetchBrandsIndex(): Promise<BrandIndexEntry[]> {
  const supabase = createStaticClient();

  // Trae todas las marcas activas + productos activos como array embebido.
  // `inner` filtra brands con >= 1 product. El filter `products.is_active`
  // se aplica dentro de cada brand.
  const { data } = await supabase
    .from('brands')
    .select(
      `
        id,
        slug,
        name,
        description,
        is_argentine,
        logo_url,
        sort_order,
        products(id, is_active)
      `,
    )
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .returns<BrandWithProductsRow[]>();

  if (!data) return [];

  return data
    .map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      is_argentine: row.is_argentine,
      logo_url: row.logo_url,
      productCount: row.products.filter((p) => p.is_active).length,
    }))
    .filter((b) => b.productCount > 0);
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
    .select('id, slug, name, description, is_argentine, logo_url')
    .in('id', brandIds)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .returns<Omit<BrandWithProductCount, 'productCount'>[]>();

  return (brands ?? []).map((b) => ({
    ...b,
    productCount: countByBrand.get(b.id) ?? 0,
  }));
}

export type CategoryPriceRange = {
  minPriceCents: number;
  maxPriceCents: number;
  offerCount: number;
};

/**
 * Para schema.org `AggregateOffer` en la página de categoría: devuelve
 * priceRange (min/max) considerando solo variantes activas con stock > 0.
 * Si no hay variantes con stock, retorna null (no podemos publicar oferta
 * que no se puede comprar — es lo que pide Google).
 */
export async function fetchCategoryPriceRange(
  categorySlug: string,
): Promise<CategoryPriceRange | null> {
  const supabase = createStaticClient();

  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .is('parent_id', null)
    .eq('is_active', true)
    .maybeSingle()
    .returns<CategoryRow>();

  if (!cat) return null;

  const { data: productIds } = await supabase
    .from('products')
    .select('id')
    .eq('category_id', cat.id)
    .eq('is_active', true)
    .returns<{ id: string }[]>();

  if (!productIds || productIds.length === 0) return null;

  const { data: variants } = await supabase
    .from('product_variants')
    .select('price_cents')
    .in(
      'product_id',
      productIds.map((p) => p.id),
    )
    .eq('is_active', true)
    .gt('stock_qty', 0)
    .returns<{ price_cents: number }[]>();

  if (!variants || variants.length === 0) return null;

  const prices = variants.map((v) => v.price_cents);
  return {
    minPriceCents: Math.min(...prices),
    maxPriceCents: Math.max(...prices),
    offerCount: prices.length,
  };
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

export type HomeShowcaseProduct = {
  slug: string;
  name: string;
  brandSlug: string;
  brandName: string;
  categorySlug: string;
  minPriceCents: number;
  primaryImagePath: string;
};

type HomeShowcaseRow = {
  slug: string;
  name: string;
  is_featured: boolean;
  brand: { slug: string; name: string; is_active: boolean };
  category: { slug: string };
  variants: Array<{ price_cents: number; stock_qty: number; is_active: boolean }>;
  images: Array<{ storage_path: string; is_primary: boolean; sort_order: number; variant_id: string | null }>;
};

/**
 * Trae top N productos para destacar en el carrusel del hero de home.
 * Prioriza `is_featured = true`; después por `updated_at` desc. Solo
 * productos activos con stock real. Default limit = 4.
 *
 * Refactor 2026-05-30 desde `fetchHomeShowcaseProduct()` (singular) para
 * soportar carrusel auto-play en lugar de producto único.
 */
export async function fetchHomeShowcaseProducts(
  limit = 4,
): Promise<HomeShowcaseProduct[]> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('products')
    .select(
      `
        slug,
        name,
        is_featured,
        brand:brands!inner(slug, name, is_active),
        category:categories!inner(slug),
        variants:product_variants(price_cents, stock_qty, is_active),
        images:product_images(storage_path, is_primary, sort_order, variant_id)
      `,
    )
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('updated_at', { ascending: false })
    .limit(16)
    .returns<HomeShowcaseRow[]>();

  if (!data || data.length === 0) return [];

  const showcases: HomeShowcaseProduct[] = [];
  for (const row of data) {
    if (showcases.length >= limit) break;
    if (!row.brand.is_active) continue;
    const inStock = row.variants.filter((v) => v.is_active && v.stock_qty > 0);
    if (inStock.length === 0) continue;
    const minPriceCents = Math.min(...inStock.map((v) => v.price_cents));
    const sortedImages = [...row.images].sort((a, b) => {
      if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
      return a.sort_order - b.sort_order;
    });
    const primary = sortedImages[0];
    if (!primary) continue;
    showcases.push({
      slug: row.slug,
      name: row.name,
      brandSlug: row.brand.slug,
      brandName: row.brand.name,
      categorySlug: row.category.slug,
      minPriceCents,
      primaryImagePath: primary.storage_path,
    });
  }
  return showcases;
}

export type FilteredCatalogCard = {
  slug: string;
  name: string;
  brandSlug: string;
  brandName: string;
  categorySlug: string;
  shortDescription: string | null;
  minPriceCents: number | null;
  inStockCount: number;
  primaryImagePath: string | null;
  secondaryImagePath: string | null;
  /** Scale CSS para normalizar tamaño visual de la foto en cards. Aplicado
   * en `<ProductCard />` vía `style={{ transform: scale(...) }}`. Sin esto,
   * el MISMO producto se ve más chico/grande en este catálogo que en
   * `/marcas/<slug>` (que sí pasa por `toProductCardData`). Founder
   * reportó 2026-05-31 que tamaños eran inconsistentes entre catálogos. */
  primaryImageScale: number;
  secondaryImageScale: number;
  /** Talle del armazón (`attributes.size_fit`) para el badge sobre la foto. */
  sizeFit: string | null;
  /** Forma del armazón (`attributes.frame_shape`). Opcional: solo lo popula
   * `fetchProductsByCategoryAndShapes`, que alimenta el filtrado client-side
   * de `/anteojos-de-sol` y `/anteojos-de-receta` (las pages dejaron de leer
   * searchParams para poder ser ISR — audit perf 2026-06-11). */
  frameShape?: string | null;
  /** Variantes para los thumbnails clickeables del card. Sin esto, en este
   * catálogo el producto NO muestra mini-thumbs de variantes (mientras
   * que /marcas/<slug> sí los muestra). Founder reportó 2026-05-31 que
   * faltaban thumbnails en gender/shape/favoritos. */
  variants: ProductCardVariant[];
};

type FilteredCatalogRow = {
  slug: string;
  name: string;
  short_description: string | null;
  attributes: Record<string, unknown>;
  brand: { slug: string; name: string; is_active: boolean };
  category: { slug: string; is_active: boolean };
  variants: Array<{
    id: string;
    sku: string;
    price_cents: number;
    stock_qty: number;
    is_active: boolean;
    sort_order: number;
    attributes: Record<string, unknown>;
  }>;
  images: Array<{
    storage_path: string;
    is_primary: boolean;
    sort_order: number;
    variant_id: string | null;
  }>;
};

/**
 * Lista de productos de una categoría, opcionalmente filtrados por
 * `attributes.frame_shape` (uno o varios). Pensada para el catálogo
 * filtrable de `/anteojos-de-sol?forma=X,Y` (usado por el iter 2 del
 * recomendador y por filtros manuales del usuario).
 *
 * Si `frameShapes` está vacío, devuelve TODOS los productos activos de
 * la categoría. Si tiene 1+, filtra por `attributes->>frame_shape IN (...)`.
 */
export async function fetchProductsByCategoryAndShapes(args: {
  categorySlug: string;
  frameShapes: string[];
  /** Filtro opcional por marca (slugs). Vacío/undefined = todas las marcas. */
  brandSlugs?: string[];
}): Promise<FilteredCatalogCard[]> {
  const supabase = createStaticClient();

  let query = supabase
    .from('products')
    .select(
      `
        slug,
        name,
        short_description,
        attributes,
        brand:brands!inner(slug, name, is_active),
        category:categories!inner(slug, is_active),
        variants:product_variants(id, sku, price_cents, stock_qty, is_active, sort_order, attributes),
        images:product_images(storage_path, is_primary, sort_order, variant_id)
      `,
    )
    .eq('is_active', true)
    .eq('category.slug', args.categorySlug);

  if (args.frameShapes.length === 1) {
    query = query.eq('attributes->>frame_shape', args.frameShapes[0]!);
  } else if (args.frameShapes.length > 1) {
    query = query.in('attributes->>frame_shape', args.frameShapes);
  }

  const brandSlugs = args.brandSlugs ?? [];
  if (brandSlugs.length === 1) {
    query = query.eq('brand.slug', brandSlugs[0]!);
  } else if (brandSlugs.length > 1) {
    query = query.in('brand.slug', brandSlugs);
  }

  const { data } = await query.returns<FilteredCatalogRow[]>();
  if (!data) return [];

  return data
    .filter((row) => row.brand.is_active && row.category.is_active)
    .map((row) => {
      const inStock = row.variants.filter((v) => v.is_active && v.stock_qty > 0);
      const sortedImages = [...row.images].sort((a, b) => {
        if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
        return a.sort_order - b.sort_order;
      });
      const primaryImagePath = sortedImages[0]?.storage_path ?? null;
      const secondaryImagePath = sortedImages[1]?.storage_path ?? null;
      return {
        slug: row.slug,
        name: row.name,
        brandSlug: row.brand.slug,
        brandName: row.brand.name,
        categorySlug: row.category.slug,
        shortDescription: row.short_description,
        minPriceCents:
          inStock.length > 0 ? Math.min(...inStock.map((v) => v.price_cents)) : null,
        inStockCount: inStock.length,
        primaryImagePath,
        secondaryImagePath,
        primaryImageScale: getImageScale(primaryImagePath),
        secondaryImageScale: getImageScale(secondaryImagePath),
        sizeFit: deriveSizeFit(row.attributes),
        frameShape:
          typeof row.attributes?.frame_shape === 'string'
            ? row.attributes.frame_shape
            : null,
        variants: buildCardVariants(row.variants, row.images),
      };
    });
}

/**
 * Productos de CUALQUIER categoría que matchean uno o más frame_shape.
 * Pensada para el recomendador de monturas: recibe las shapes recomendadas
 * por la IA y devuelve productos cruzando sol + receta. Ordenados por stock
 * desc (con stock primero) para mostrar productos comprables. Limita a N.
 */
export async function fetchProductsByFrameShapes(args: {
  frameShapes: string[];
  limit?: number;
}): Promise<FilteredCatalogCard[]> {
  if (args.frameShapes.length === 0) return [];

  const supabase = createStaticClient();

  let query = supabase
    .from('products')
    .select(
      `
        slug,
        name,
        short_description,
        attributes,
        brand:brands!inner(slug, name, is_active),
        category:categories!inner(slug, is_active),
        variants:product_variants(id, sku, price_cents, stock_qty, is_active, sort_order, attributes),
        images:product_images(storage_path, is_primary, sort_order, variant_id)
      `,
    )
    .eq('is_active', true);

  if (args.frameShapes.length === 1) {
    query = query.eq('attributes->>frame_shape', args.frameShapes[0]!);
  } else {
    query = query.in('attributes->>frame_shape', args.frameShapes);
  }

  const { data } = await query.returns<FilteredCatalogRow[]>();
  if (!data) return [];

  const cards = data
    .filter((row) => row.brand.is_active && row.category.is_active)
    .map((row) => {
      const inStock = row.variants.filter((v) => v.is_active && v.stock_qty > 0);
      const sortedImages = [...row.images].sort((a, b) => {
        if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
        return a.sort_order - b.sort_order;
      });
      const primaryImagePath = sortedImages[0]?.storage_path ?? null;
      const secondaryImagePath = sortedImages[1]?.storage_path ?? null;
      return {
        slug: row.slug,
        name: row.name,
        brandSlug: row.brand.slug,
        brandName: row.brand.name,
        categorySlug: row.category.slug,
        shortDescription: row.short_description,
        minPriceCents:
          inStock.length > 0 ? Math.min(...inStock.map((v) => v.price_cents)) : null,
        inStockCount: inStock.length,
        primaryImagePath,
        secondaryImagePath,
        primaryImageScale: getImageScale(primaryImagePath),
        secondaryImageScale: getImageScale(secondaryImagePath),
        sizeFit: deriveSizeFit(row.attributes),
        variants: buildCardVariants(row.variants, row.images),
      };
    });

  // Productos con stock primero (más útiles para conversión).
  cards.sort((a, b) => {
    if ((a.inStockCount > 0) !== (b.inStockCount > 0)) {
      return a.inStockCount > 0 ? -1 : 1;
    }
    return 0;
  });

  return typeof args.limit === 'number' ? cards.slice(0, args.limit) : cards;
}

/**
 * Sub-categoría global por género SIN marca, ej:
 * `/anteojos-de-sol/hombre` (todos los anteojos de sol para hombre de
 * cualquier marca, incluyendo unisex). Captura queries genéricas tipo
 * "anteojos sol hombre", "lentes mujer", etc.
 */
export async function fetchCategoryByGender(args: {
  categorySlug: string;
  target: BrandGenderTarget;
}): Promise<FilteredCatalogCard[]> {
  const supabase = createStaticClient();
  const genderValues =
    args.target === 'hombre' ? ['male', 'unisex'] : ['female', 'unisex'];

  const { data } = await supabase
    .from('products')
    .select(
      `
        slug,
        name,
        short_description,
        attributes,
        brand:brands!inner(slug, name, is_active),
        category:categories!inner(slug, is_active),
        variants:product_variants(id, sku, price_cents, stock_qty, is_active, sort_order, attributes),
        images:product_images(storage_path, is_primary, sort_order, variant_id)
      `,
    )
    .eq('is_active', true)
    .eq('category.slug', args.categorySlug)
    .in('attributes->>gender', genderValues)
    .returns<FilteredCatalogRow[]>();

  if (!data) return [];

  return data
    .filter((row) => row.brand.is_active && row.category.is_active)
    .map((row) => {
      const inStock = row.variants.filter((v) => v.is_active && v.stock_qty > 0);
      const sortedImages = [...row.images].sort((a, b) => {
        if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
        return a.sort_order - b.sort_order;
      });
      const primaryImagePath = sortedImages[0]?.storage_path ?? null;
      const secondaryImagePath = sortedImages[1]?.storage_path ?? null;
      return {
        slug: row.slug,
        name: row.name,
        brandSlug: row.brand.slug,
        brandName: row.brand.name,
        categorySlug: row.category.slug,
        shortDescription: row.short_description,
        minPriceCents:
          inStock.length > 0 ? Math.min(...inStock.map((v) => v.price_cents)) : null,
        inStockCount: inStock.length,
        primaryImagePath,
        secondaryImagePath,
        primaryImageScale: getImageScale(primaryImagePath),
        secondaryImageScale: getImageScale(secondaryImagePath),
        sizeFit: deriveSizeFit(row.attributes),
        variants: buildCardVariants(row.variants, row.images),
      };
    });
}

/**
 * Sub-categoría global por forma/material/treatment SIN marca, ej:
 * `/anteojos-de-sol/aviador` (todos los aviadores de cualquier marca).
 * Mismo BrandFilter shape que `fetchBrandPageByFilter` pero sin filtrar
 * por brand_id. Pensada para capturar queries SEO genéricas como
 * "anteojos aviador", "lentes wayfarer", etc.
 */
export async function fetchCategoryByFilter(args: {
  categorySlug: string;
  filter:
    | { type: 'frame_shape'; value: string }
    | { type: 'frame_material'; value: string }
    | { type: 'lens_treatment_includes'; value: string };
}): Promise<FilteredCatalogCard[]> {
  const supabase = createStaticClient();

  let query = supabase
    .from('products')
    .select(
      `
        slug,
        name,
        short_description,
        attributes,
        brand:brands!inner(slug, name, is_active),
        category:categories!inner(slug, is_active),
        variants:product_variants(id, sku, price_cents, stock_qty, is_active, sort_order, attributes),
        images:product_images(storage_path, is_primary, sort_order, variant_id)
      `,
    )
    .eq('is_active', true)
    .eq('category.slug', args.categorySlug);

  if (args.filter.type === 'frame_shape') {
    query = query.eq('attributes->>frame_shape', args.filter.value);
  } else if (args.filter.type === 'frame_material') {
    query = query.eq('attributes->>frame_material', args.filter.value);
  } else {
    // jsonb containment: el valor debe ir como JSON (`["polarized"]`), NO como
    // array JS — `.contains(col, ['polarized'])` lo serializa como literal de
    // array PG `{polarized}` → error 22P02 "invalid input syntax for type json"
    // → la query falla y devuelve [] (página de polarizados vacía, bug 2026-06-02).
    query = query.contains(
      'attributes->lens_treatment',
      JSON.stringify([args.filter.value]),
    );
  }

  const { data } = await query.returns<FilteredCatalogRow[]>();
  if (!data) return [];

  return data
    .filter((row) => row.brand.is_active && row.category.is_active)
    .map((row) => {
      const inStock = row.variants.filter((v) => v.is_active && v.stock_qty > 0);
      const sortedImages = [...row.images].sort((a, b) => {
        if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
        return a.sort_order - b.sort_order;
      });
      const primaryImagePath = sortedImages[0]?.storage_path ?? null;
      const secondaryImagePath = sortedImages[1]?.storage_path ?? null;
      return {
        slug: row.slug,
        name: row.name,
        brandSlug: row.brand.slug,
        brandName: row.brand.name,
        categorySlug: row.category.slug,
        shortDescription: row.short_description,
        minPriceCents:
          inStock.length > 0 ? Math.min(...inStock.map((v) => v.price_cents)) : null,
        inStockCount: inStock.length,
        primaryImagePath,
        secondaryImagePath,
        primaryImageScale: getImageScale(primaryImagePath),
        secondaryImageScale: getImageScale(secondaryImagePath),
        sizeFit: deriveSizeFit(row.attributes),
        variants: buildCardVariants(row.variants, row.images),
      };
    });
}

/**
 * Para mostrar chips de filtros en el catálogo: cuáles frame_shapes
 * existen REALMENTE en productos activos de la categoría. Evita mostrar
 * chips de "wayfarer" si no hay ningún wayfarer cargado.
 */
export async function fetchAvailableFrameShapes(
  categorySlug: string,
): Promise<string[]> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('products')
    .select('attributes, category:categories!inner(slug)')
    .eq('is_active', true)
    .eq('category.slug', categorySlug)
    .returns<Array<{ attributes: Record<string, unknown> }>>();

  if (!data) return [];

  const shapes = new Set<string>();
  for (const row of data) {
    const shape = row.attributes?.frame_shape;
    if (typeof shape === 'string' && shape.length > 0) {
      shapes.add(shape);
    }
  }
  return Array.from(shapes).sort();
}

type WishlistProductRow = {
  slug: string;
  name: string;
  short_description: string | null;
  attributes: Record<string, unknown>;
  brand: { slug: string; name: string; is_active: boolean };
  category: { slug: string; is_active: boolean };
  variants: Array<{
    id: string;
    sku: string;
    price_cents: number;
    stock_qty: number;
    is_active: boolean;
    sort_order: number;
    attributes: Record<string, unknown>;
  }>;
  images: Array<{
    storage_path: string;
    is_primary: boolean;
    sort_order: number;
    variant_id: string | null;
  }>;
};

export type WishlistProductCard = {
  slug: string;
  name: string;
  brandSlug: string;
  brandName: string;
  categorySlug: string;
  shortDescription: string | null;
  minPriceCents: number | null;
  inStockCount: number;
  primaryImagePath: string | null;
  secondaryImagePath: string | null;
  primaryImageScale: number;
  secondaryImageScale: number;
  sizeFit: string | null;
  variants: ProductCardVariant[];
};

/**
 * Fetch productos por slugs (para página /favoritos). Devuelve solo los
 * que están activos + brand activa + categoría activa. Si un producto del
 * wishlist fue desactivado, no aparece (el usuario verá menos items que
 * los guardados — comportamiento esperado).
 */
export async function fetchProductsBySlugs(
  slugs: string[],
): Promise<WishlistProductCard[]> {
  if (slugs.length === 0) return [];

  const supabase = createStaticClient();
  const { data } = await supabase
    .from('products')
    .select(
      `
        slug,
        name,
        short_description,
        attributes,
        brand:brands!inner(slug, name, is_active),
        category:categories!inner(slug, is_active),
        variants:product_variants(id, sku, price_cents, stock_qty, is_active, sort_order, attributes),
        images:product_images(storage_path, is_primary, sort_order, variant_id)
      `,
    )
    .in('slug', slugs)
    .eq('is_active', true)
    .returns<WishlistProductRow[]>();

  if (!data) return [];

  return data
    .filter((row) => row.brand.is_active && row.category.is_active)
    .map((row) => {
      const inStock = row.variants.filter(
        (v) => v.is_active && v.stock_qty > 0,
      );
      const sortedImages = [...row.images].sort((a, b) => {
        if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
        return a.sort_order - b.sort_order;
      });
      const primaryImagePath = sortedImages[0]?.storage_path ?? null;
      const secondaryImagePath = sortedImages[1]?.storage_path ?? null;
      return {
        slug: row.slug,
        name: row.name,
        brandSlug: row.brand.slug,
        brandName: row.brand.name,
        categorySlug: row.category.slug,
        shortDescription: row.short_description,
        minPriceCents:
          inStock.length > 0
            ? Math.min(...inStock.map((v) => v.price_cents))
            : null,
        inStockCount: inStock.length,
        primaryImagePath,
        secondaryImagePath,
        primaryImageScale: getImageScale(primaryImagePath),
        secondaryImageScale: getImageScale(secondaryImagePath),
        sizeFit: deriveSizeFit(row.attributes),
        variants: buildCardVariants(row.variants, row.images),
      };
    });
}

export type CompareProductCard = {
  slug: string;
  name: string;
  brandSlug: string;
  brandName: string;
  categorySlug: string;
  categoryName: string;
  shortDescription: string | null;
  minPriceCents: number | null;
  inStockCount: number;
  primaryImagePath: string | null;
  /** JSON attributes — el caller decide qué claves leer. */
  attributes: Record<string, unknown>;
};

type CompareProductRow = {
  slug: string;
  name: string;
  short_description: string | null;
  attributes: Record<string, unknown>;
  brand: { slug: string; name: string; is_active: boolean };
  category: { slug: string; name: string; is_active: boolean };
  variants: Array<{ price_cents: number; stock_qty: number; is_active: boolean }>;
  images: Array<{ storage_path: string; is_primary: boolean; sort_order: number }>;
};

/**
 * Fetch productos para el comparador. Idéntico a `fetchProductsBySlugs`
 * pero incluye `attributes` completos (para mostrar specs en la tabla
 * de comparación) y `categoryName` (para mostrar en cabecera). Solo
 * primary image — el comparador no necesita gallery.
 */
export async function fetchProductsForCompareBySlugs(
  slugs: string[],
): Promise<CompareProductCard[]> {
  if (slugs.length === 0) return [];

  const supabase = createStaticClient();
  const { data } = await supabase
    .from('products')
    .select(
      `
        slug,
        name,
        short_description,
        attributes,
        brand:brands!inner(slug, name, is_active),
        category:categories!inner(slug, name, is_active),
        variants:product_variants(price_cents, stock_qty, is_active),
        images:product_images(storage_path, is_primary, sort_order)
      `,
    )
    .in('slug', slugs)
    .eq('is_active', true)
    .returns<CompareProductRow[]>();

  if (!data) return [];

  return data
    .filter((row) => row.brand.is_active && row.category.is_active)
    .map((row) => {
      const inStock = row.variants.filter(
        (v) => v.is_active && v.stock_qty > 0,
      );
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
        categoryName: row.category.name,
        shortDescription: row.short_description,
        attributes: row.attributes ?? {},
        minPriceCents:
          inStock.length > 0
            ? Math.min(...inStock.map((v) => v.price_cents))
            : null,
        inStockCount: inStock.length,
        primaryImagePath: sortedImages[0]?.storage_path ?? null,
      };
    });
}

/**
 * Para `generateStaticParams` de páginas de producto: devuelve las
 * combinaciones {brand, product} para una categoría específica.
 *
 * Solo prerenderea productos con stock real (hallazgo #4 del audit
 * 2026-08-01) — un producto sin stock igual queda accesible por URL directa
 * (Next renderiza on-demand porque `dynamicParams` no está en `false` en
 * ninguna page de producto), simplemente no se gasta build/crawl budget en
 * prerenderearlo ni indexarlo mientras no tenga con qué venderse.
 */
export async function getStaticProductParamsForCategory(
  category: CategoryConfig,
): Promise<{ brand: string; product: string }[]> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('products')
    .select(
      'slug, brand:brands!inner(slug), category:categories!inner(slug), variants:product_variants(is_active, stock_qty)',
    )
    .eq('is_active', true)
    .eq('category.slug', category.slug)
    .returns<StaticProductRow[]>();
  return (data ?? [])
    .filter((p) => hasAvailableStock(p.variants))
    .map((p) => ({
      brand: p.brand.slug,
      product: p.slug,
    }));
}
