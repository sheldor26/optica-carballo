import { createStaticClient } from '@/lib/supabase/static';

export type SearchProductResult = {
  type: 'product';
  slug: string;
  name: string;
  brandName: string;
  brandSlug: string;
  categorySlug: string;
  primaryImagePath: string | null;
  minPriceCents: number | null;
  href: string;
};

export type SearchBrandResult = {
  type: 'brand';
  slug: string;
  name: string;
  /** URL preferente de la marca — `/anteojos-de-sol/[slug]`. */
  href: string;
};

export type SearchResults = {
  products: SearchProductResult[];
  brands: SearchBrandResult[];
};

const PRODUCT_LIMIT = 8;
const BRAND_LIMIT = 5;

type ProductRow = {
  slug: string;
  name: string;
  brand: { slug: string; name: string; is_active: boolean };
  category: { slug: string; is_active: boolean };
  variants: Array<{ price_cents: number; stock_qty: number; is_active: boolean }>;
  images: Array<{ storage_path: string; is_primary: boolean; sort_order: number }>;
};

type BrandRow = {
  slug: string;
  name: string;
};

/**
 * Search global: matchea productos y marcas por nombre (case-insensitive,
 * substring). Acepta texto vacío → devuelve vacío.
 *
 * Solo trae productos/marcas ACTIVAS. Sin fuzzy matching (iter 1) —
 * usa `ilike` con `%query%` que es suficiente para catálogo chico.
 *
 * Se llama desde `app/api/search/route.ts`, no directo desde el cliente:
 * como Server Action se llamaba en cada tecleo y cada invocación dispara
 * un refresh de ruta completo de Next.js (recarga el header entero de
 * fondo), lo que hacía que el dialog de búsqueda se cerrara solo mientras
 * el usuario escribía.
 *
 * Si en el futuro el catálogo crece a 100+ items y la búsqueda se siente
 * lenta, considerar trigram (`pg_trgm` extension) + index, o full-text
 * search con `tsvector`.
 */
export async function searchCatalog(query: string): Promise<SearchResults> {
  const q = query.trim();
  if (q.length === 0) return { products: [], brands: [] };
  if (q.length > 100) return { products: [], brands: [] };

  const supabase = createStaticClient();
  const pattern = `%${q.replace(/[%_]/g, '\\$&')}%`;

  const [productsRes, brandsRes] = await Promise.all([
    supabase
      .from('products')
      .select(
        `
          slug,
          name,
          brand:brands!inner(slug, name, is_active),
          category:categories!inner(slug, is_active),
          variants:product_variants(price_cents, stock_qty, is_active),
          images:product_images(storage_path, is_primary, sort_order)
        `,
      )
      .eq('is_active', true)
      .ilike('name', pattern)
      .limit(PRODUCT_LIMIT)
      .returns<ProductRow[]>(),
    supabase
      .from('brands')
      .select('slug, name')
      .eq('is_active', true)
      .ilike('name', pattern)
      .limit(BRAND_LIMIT)
      .returns<BrandRow[]>(),
  ]);

  const products: SearchProductResult[] = (productsRes.data ?? [])
    .filter((p) => p.brand.is_active && p.category.is_active)
    .map((p) => {
      const inStock = p.variants.filter((v) => v.is_active && v.stock_qty > 0);
      const sortedImages = [...p.images].sort((a, b) => {
        if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
        return a.sort_order - b.sort_order;
      });
      return {
        type: 'product' as const,
        slug: p.slug,
        name: p.name,
        brandName: p.brand.name,
        brandSlug: p.brand.slug,
        categorySlug: p.category.slug,
        primaryImagePath: sortedImages[0]?.storage_path ?? null,
        minPriceCents:
          inStock.length > 0
            ? Math.min(...inStock.map((v) => v.price_cents))
            : null,
        href: `/${p.category.slug}/${p.brand.slug}/${p.slug}`,
      };
    });

  const brands: SearchBrandResult[] = (brandsRes.data ?? []).map((b) => ({
    type: 'brand' as const,
    slug: b.slug,
    name: b.name,
    href: `/anteojos-de-sol/${b.slug}`,
  }));

  return { products, brands };
}
