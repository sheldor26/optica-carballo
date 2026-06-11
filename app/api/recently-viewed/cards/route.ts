import { NextResponse, type NextRequest } from 'next/server';
import { fetchProductsBySlugs } from '@/lib/catalog/queries';

const MAX_SLUGS = 10; // mismo cap que el cookie oc_recent

/**
 * Cards livianas para la sección "Estuviste mirando", por slug.
 *
 * Existe porque <RecentlyViewed /> dejó de leer el cookie server-side:
 * `cookies()` en su render volvía DINÁMICAS la home y las PDP — anulaba el
 * ISR (audit perf 2026-06-11). Ahora el componente lee el cookie client-side
 * y pide las cards acá. Data pública (catálogo) — sin sesión, cacheable en
 * el CDN.
 */
export async function GET(request: NextRequest) {
  const slugsParam = request.nextUrl.searchParams.get('slugs') ?? '';
  const slugs = slugsParam
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, MAX_SLUGS);

  if (slugs.length === 0) {
    return NextResponse.json({ cards: [] });
  }

  const products = await fetchProductsBySlugs(slugs);
  const cards = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    brandName: p.brandName,
    brandSlug: p.brandSlug,
    categorySlug: p.categorySlug,
    primaryImagePath: p.primaryImagePath,
    primaryImageScale: p.primaryImageScale,
    minPriceCents: p.minPriceCents,
  }));

  return NextResponse.json(
    { cards },
    {
      headers: {
        // CDN cachea 5 min (mismo orden que el ISR del catálogo) y sirve
        // stale mientras revalida — precios/stock al segundo no son críticos
        // para esta sección.
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      },
    },
  );
}
