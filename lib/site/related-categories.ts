/**
 * Builder de links relacionados para el bloque "También podría interesarte"
 * que se renderiza al pie de sub-categorías y páginas de marca.
 *
 * Objetivo SEO + UX:
 * - Cross-link entre páginas hermanas para distribuir PageRank.
 * - Ayuda al usuario a descubrir refinamientos del catálogo sin volver al header.
 *
 * Reglas de selección:
 * - Excluir la página actual (no auto-link).
 * - 4-6 links como máximo (más es ruido visual + dilución de PageRank).
 * - Mezclar dimensiones (forma + género + marca) para máxima diversidad de descubrimiento.
 * - Priorizar URLs canónicas (sub-categorías globales) sobre brand+filter combinations.
 */

import { BRAND_FILTERS } from '@/lib/catalog/brand-filters';
import { BRAND_LABELS, BRAND_SLUGS } from '@/lib/site/mega-nav';

export type RelatedLink = {
  label: string;
  href: string;
};

type Context =
  | { type: 'shape'; categorySlug: string; filterUrlSlug: string }
  | { type: 'gender'; categorySlug: string; target: 'hombre' | 'mujer' }
  | { type: 'brand'; categorySlug: string; brandSlug: string };

const CATEGORY_LABEL: Record<string, string> = {
  'anteojos-de-sol': 'Anteojos de sol',
  'anteojos-de-receta': 'Anteojos de receta',
};

function genderLinks(categorySlug: string): RelatedLink[] {
  const catLabel = CATEGORY_LABEL[categorySlug] ?? '';
  return [
    { label: `${catLabel} hombre`, href: `/${categorySlug}/hombre` },
    { label: `${catLabel} mujer`, href: `/${categorySlug}/mujer` },
  ];
}

function shapeLinks(categorySlug: string, exclude?: string): RelatedLink[] {
  const cat = categorySlug === 'anteojos-de-sol' ? 'sol' : 'receta';
  return BRAND_FILTERS.filter(
    (f) => f.categories.includes(cat) && f.urlSlug !== exclude,
  ).map((f) => ({
    label: `${CATEGORY_LABEL[categorySlug] ?? ''} ${f.label.toLowerCase()}`,
    href: `/${categorySlug}/${f.urlSlug}`,
  }));
}

function brandLinks(categorySlug: string, exclude?: string): RelatedLink[] {
  return BRAND_SLUGS.filter((slug) => slug !== exclude).map((slug) => ({
    label: BRAND_LABELS[slug],
    href: `/${categorySlug}/${slug}`,
  }));
}

/**
 * Devuelve hasta 6 links contextuales según el tipo de página actual.
 * - Página `shape` (ej `/anteojos-de-sol/aviador`): 2 género + 3 shape + 1 brand.
 * - Página `gender` (ej `/anteojos-de-sol/hombre`): 4 shape + 2 brand.
 * - Página `brand` (ej `/anteojos-de-sol/rusty`): 2 género + 3 shape + 1 brand.
 */
export function buildRelatedLinks(ctx: Context): RelatedLink[] {
  if (ctx.type === 'shape') {
    return [
      ...genderLinks(ctx.categorySlug),
      ...shapeLinks(ctx.categorySlug, ctx.filterUrlSlug).slice(0, 3),
      ...brandLinks(ctx.categorySlug).slice(0, 1),
    ];
  }
  if (ctx.type === 'gender') {
    return [
      ...shapeLinks(ctx.categorySlug).slice(0, 4),
      ...brandLinks(ctx.categorySlug).slice(0, 2),
    ];
  }
  // brand
  return [
    ...genderLinks(ctx.categorySlug),
    ...shapeLinks(ctx.categorySlug).slice(0, 3),
    ...brandLinks(ctx.categorySlug, ctx.brandSlug).slice(0, 1),
  ];
}
