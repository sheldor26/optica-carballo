import { createStaticClient } from '@/lib/supabase/static';
import { BRAND_FILTERS } from '@/lib/catalog/brand-filters';

/**
 * Chequeo de existencia real de marca/producto para el middleware — cierra
 * el soft-404 de Next.js (ISR cachea el HTML de `notFound()` pero no el
 * status code, ver AUDIT_2026-08-01.md addendum). Corre ANTES de que la
 * request llegue a la página, así el status code lo decide una respuesta
 * de verdad, no un render cacheado.
 *
 * El middleware de Vercel corre ANTES del cache lookup en TODAS las
 * requests (hits de ISR incluidos), así que una consulta a Supabase acá
 * por request pegaría en las rutas de más tráfico del sitio (marca + PDP).
 * Por eso el set de slugs válidos se cachea en memoria del proceso con el
 * mismo TTL que el `revalidate` del catálogo (300s) — la consulta a la
 * base sólo corre cuando el caché vence, no en cada visita.
 *
 * Diseño defensivo a propósito: ante CUALQUIER duda (regex no matchea, slug
 * reservado, error de red/DB, timeout, shape inesperado) devuelve `true`
 * (dejar pasar) — un falso negativo acá vuelve a mostrar el soft-404 viejo
 * (sin regresión). Un falso POSITIVO (bloquear algo que sí existe) sería
 * mucho peor — un producto real mostrando 404 — así que nunca se arriesga
 * eso por dudar.
 */

const CATALOG_PATH_RE =
  /^\/anteojos-de-(sol|receta)\/([^/]+)(?:\/([^/]+))?\/?$/;

type CategoryKey = 'sol' | 'receta';

const RESERVED_SLUGS: Record<CategoryKey, Set<string>> = {
  sol: new Set([
    'hombre',
    'mujer',
    'sobre-la-marca',
    ...BRAND_FILTERS.filter((f) => f.categories.includes('sol')).map(
      (f) => f.urlSlug,
    ),
  ]),
  receta: new Set([
    'hombre',
    'mujer',
    'sobre-la-marca',
    ...BRAND_FILTERS.filter((f) => f.categories.includes('receta')).map(
      (f) => f.urlSlug,
    ),
  ]),
};

const CACHE_TTL_MS = 300_000; // igual al revalidate=300 del resto del catálogo

type ExistenceCache = {
  brandSlugs: Set<string>;
  // clave compuesta `${categorySlug}|${brandSlug}|${productSlug}`
  productKeys: Set<string>;
  fetchedAt: number;
};

let cache: ExistenceCache | null = null;
let inflightRefresh: Promise<ExistenceCache> | null = null;

async function refreshCache(): Promise<ExistenceCache> {
  const supabase = createStaticClient();

  const [brandsRes, productsRes] = await Promise.all([
    supabase.from('brands').select('slug').eq('is_active', true),
    supabase
      .from('products')
      .select(
        'slug, is_active, brand:brands!inner(slug, is_active), category:categories!inner(slug, is_active)',
      )
      .eq('is_active', true)
      .returns<
        {
          slug: string;
          is_active: boolean;
          brand: { slug: string; is_active: boolean };
          category: { slug: string; is_active: boolean };
        }[]
      >(),
  ]);

  if (brandsRes.error || productsRes.error) {
    throw brandsRes.error ?? productsRes.error;
  }

  const brandSlugs = new Set((brandsRes.data ?? []).map((b) => b.slug));
  const productKeys = new Set(
    (productsRes.data ?? [])
      .filter((p) => p.brand.is_active && p.category.is_active)
      .map((p) => `${p.category.slug}|${p.brand.slug}|${p.slug}`),
  );

  return { brandSlugs, productKeys, fetchedAt: Date.now() };
}

async function getCache(): Promise<ExistenceCache> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return cache;
  // Evita "thundering herd": si ya hay un refresh en vuelo (cold start o
  // caché recién vencido con requests concurrentes), todas esperan el mismo.
  if (!inflightRefresh) {
    inflightRefresh = refreshCache().finally(() => {
      inflightRefresh = null;
    });
  }
  cache = await inflightRefresh;
  return cache;
}

/**
 * `true` = dejar pasar la request tal cual (existe, o no se pudo verificar,
 * o no es una URL de catálogo). `false` = marca/producto genuinamente
 * inexistente, el caller debe forzar un 404 real.
 */
export async function catalogUrlIsValid(pathname: string): Promise<boolean> {
  const match = CATALOG_PATH_RE.exec(pathname);
  if (!match) return true; // no es una URL de catálogo, nada que chequear

  const [, categoryKeyRaw, brandSlug, productSlug] = match;
  // Los grupos 1 y 2 del regex son obligatorios ([^/]+, no opcionales) — si
  // TS igual los tipa como posiblemente undefined, fail-open por las dudas.
  if (!categoryKeyRaw || !brandSlug) return true;
  const categoryKey = categoryKeyRaw as CategoryKey;
  const reserved = RESERVED_SLUGS[categoryKey];

  // Segmento 1 reservado (ej. /anteojos-de-sol/aviador, shape sin marca) →
  // matchea una página estática real, no es un slug de marca.
  if (reserved.has(brandSlug)) return true;

  try {
    const { brandSlugs, productKeys } = await getCache();

    if (!brandSlugs.has(brandSlug)) return false;
    if (!productSlug) return true; // página de marca, la marca existe

    // Segmento 2 reservado (ej. .../rusty/hombre, .../rusty/sobre-la-marca)
    // → página estática real de marca+filtro, no es un slug de producto.
    if (reserved.has(productSlug)) return true;

    const categorySlug =
      categoryKey === 'sol' ? 'anteojos-de-sol' : 'anteojos-de-receta';
    return productKeys.has(`${categorySlug}|${brandSlug}|${productSlug}`);
  } catch {
    return true; // fail-open: cualquier excepción, dejar pasar
  }
}
