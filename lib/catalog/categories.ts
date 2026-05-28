/**
 * Categorías top-level del catálogo. Source of truth para slugs, nombres
 * visibles, y copy SEO específico de cada categoría. Reusada por las páginas
 * dinámicas `/anteojos-de-sol/...` y `/anteojos-de-receta/...`.
 */
export type CategoryConfig = {
  slug: 'anteojos-de-sol' | 'anteojos-de-receta';
  name: string;
  /** Genitivo singular para títulos: "Anteojos de sol de Rusty" */
  shortLabel: string;
  /** Frase para meta descriptions */
  metaPhrase: string;
};

export const CATEGORIES = {
  sol: {
    slug: 'anteojos-de-sol',
    name: 'Anteojos de sol',
    shortLabel: 'sol',
    metaPhrase: 'anteojos de sol',
  } satisfies CategoryConfig,
  rx: {
    slug: 'anteojos-de-receta',
    name: 'Anteojos de receta',
    shortLabel: 'receta',
    metaPhrase: 'armazones de receta',
  } satisfies CategoryConfig,
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
