/**
 * Configuración de filtros SEO para páginas hijas de marca.
 *
 * Cada filtro genera rutas `/anteojos-de-sol/[brand]/[urlSlug]` y/o
 * `/anteojos-de-receta/[brand]/[urlSlug]` según `categories`.
 *
 * Ejemplos URL generadas:
 * - `/anteojos-de-sol/vulk/polarizados`
 * - `/anteojos-de-sol/rusty/aviador`
 * - `/anteojos-de-receta/mormaii/wayfarer`
 *
 * Restricción: ningún producto puede tener un slug igual a un urlSlug
 * de este config (sería sobrescrito por el static segment).
 */

export type BrandFilter = {
  /** URL slug en español (path real). */
  urlSlug: string;
  /** Label humano para H1 y meta tags. */
  label: string;
  /** Categorías donde aplica este filtro. */
  categories: Array<'sol' | 'receta'>;
  /** Cómo filtrar en la query de productos. */
  filter:
    | { type: 'frame_shape'; value: string }
    | { type: 'frame_material'; value: string }
    | { type: 'lens_treatment_includes'; value: string };
  /** Descripción del filtro para meta description / intro. */
  metaPhrase: string;
};

export const BRAND_FILTERS: BrandFilter[] = [
  {
    urlSlug: 'polarizados',
    label: 'Polarizados',
    categories: ['sol'],
    filter: { type: 'lens_treatment_includes', value: 'polarized' },
    metaPhrase: 'con lente polarizado',
  },
  {
    urlSlug: 'wayfarer',
    label: 'Wayfarer',
    categories: ['sol', 'receta'],
    filter: { type: 'frame_shape', value: 'wayfarer' },
    metaPhrase: 'forma wayfarer',
  },
  {
    urlSlug: 'aviador',
    label: 'Aviador',
    categories: ['sol', 'receta'],
    filter: { type: 'frame_shape', value: 'aviador' },
    metaPhrase: 'forma aviador',
  },
  {
    urlSlug: 'cat-eye',
    label: 'Cat eye',
    categories: ['sol', 'receta'],
    filter: { type: 'frame_shape', value: 'cat_eye' },
    metaPhrase: 'forma cat eye',
  },
  {
    urlSlug: 'rectangular',
    label: 'Rectangulares',
    categories: ['sol', 'receta'],
    filter: { type: 'frame_shape', value: 'rectangular' },
    metaPhrase: 'forma rectangular',
  },
  {
    // "Deportivos" = forma envolvente (wraparound). Label elegido por founder
    // 2026-06-04 ("deportivos" por volumen de búsqueda; la forma DB es
    // 'envolvente'). Solo sol: no hay envolventes de receta.
    urlSlug: 'deportivos',
    label: 'Deportivos',
    categories: ['sol'],
    filter: { type: 'frame_shape', value: 'envolvente' },
    metaPhrase: 'envolventes deportivos',
  },
  {
    urlSlug: 'acetato',
    label: 'Acetato',
    categories: ['sol', 'receta'],
    filter: { type: 'frame_material', value: 'acetate' },
    metaPhrase: 'con marco de acetato',
  },
  {
    urlSlug: 'metal',
    label: 'Metal',
    categories: ['sol', 'receta'],
    filter: { type: 'frame_material', value: 'metal' },
    metaPhrase: 'con marco de metal',
  },
];

export function getBrandFilter(urlSlug: string): BrandFilter | null {
  return BRAND_FILTERS.find((f) => f.urlSlug === urlSlug) ?? null;
}
