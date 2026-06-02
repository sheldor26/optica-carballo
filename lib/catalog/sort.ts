import type { FilteredCatalogCard } from '@/lib/catalog/queries';

/** Opciones de orden del grid. Persisten en `?orden=` (SEO + share).
 * Server-safe (sin 'use client') para que las pages las puedan importar. */
export const SORT_OPTIONS = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];

export function normalizeSort(value: string | undefined): SortValue {
  return SORT_OPTIONS.some((o) => o.value === value)
    ? (value as SortValue)
    : 'relevancia';
}

/**
 * Ordena el catálogo filtrado según la opción elegida (`?orden=`).
 *
 * - `relevancia` (default): respeta el orden de la query (sin stock al final).
 * - `precio-asc` / `precio-desc`: por `minPriceCents`. Los productos sin precio
 *   (sin stock) van SIEMPRE al final, independientemente de la dirección —
 *   un "sin precio" no debería encabezar "menor a mayor".
 *
 * Pura + no muta el array de entrada.
 */
export function sortCatalog<T extends FilteredCatalogCard>(
  products: T[],
  sort: SortValue,
): T[] {
  if (sort === 'relevancia') return products;

  const dir = sort === 'precio-asc' ? 1 : -1;
  return [...products].sort((a, b) => {
    const pa = a.minPriceCents;
    const pb = b.minPriceCents;
    if (pa === null && pb === null) return 0;
    if (pa === null) return 1; // sin precio al final
    if (pb === null) return -1;
    return (pa - pb) * dir;
  });
}
