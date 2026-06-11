import { NextResponse, type NextRequest } from 'next/server';
import { fetchProductsForCompareBySlugs } from '@/lib/catalog/queries';

const MAX_SLUGS = 4; // mismo cap que el cookie del comparador

/**
 * Thumbs (nombre + imagen primaria) para la CompareBar, por slug.
 *
 * Existe porque la barra dejó de tener wrapper de servidor: leer el cookie
 * del comparador en el layout volvía DINÁMICAS todas las páginas del
 * storefront y anulaba el ISR (audit perf 2026-06-11). Ahora la barra lee el
 * cookie client-side y pide los thumbs acá. Data pública (catálogo) — sin
 * sesión, cacheable en el CDN.
 */
export async function GET(request: NextRequest) {
  const slugsParam = request.nextUrl.searchParams.get('slugs') ?? '';
  const slugs = slugsParam
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, MAX_SLUGS);

  if (slugs.length === 0) {
    return NextResponse.json({ thumbs: [] });
  }

  const products = await fetchProductsForCompareBySlugs(slugs);
  const thumbs = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    primaryImagePath: p.primaryImagePath,
  }));

  return NextResponse.json(
    { thumbs },
    {
      headers: {
        // CDN cachea 5 min (mismo orden que el ISR del catálogo) y sirve
        // stale mientras revalida — la barra no necesita data al segundo.
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      },
    },
  );
}
