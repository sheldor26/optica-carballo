import { readCompareCookie } from '@/lib/compare/cookie';
import { fetchProductsForCompareBySlugs } from '@/lib/catalog/queries';
import { CompareBar } from '@/components/compare/compare-bar';

/**
 * Server wrapper de la `CompareBar`. Lee la cookie en SSR + fetchea name +
 * primary image de cada slug para que la barra renderice thumbs con
 * imagen real desde el primer paint. Si el usuario agrega productos desde
 * client (polling), el client muestra thumb genérico hasta navegar.
 *
 * Si no hay items en cookie, no renderiza nada (la barra cliente igual
 * polea cookie cada 1.5s, así que aparece al toggle desde la página).
 */
export async function CompareBarWrapper() {
  const items = await readCompareCookie();
  const slugs = items.map((i) => i.slug);
  const products = slugs.length > 0
    ? await fetchProductsForCompareBySlugs(slugs)
    : [];

  const thumbsBySlug: Record<
    string,
    { name: string; primaryImagePath: string | null }
  > = {};
  for (const p of products) {
    thumbsBySlug[p.slug] = {
      name: p.name,
      primaryImagePath: p.primaryImagePath,
    };
  }

  return <CompareBar thumbsBySlug={thumbsBySlug} />;
}
