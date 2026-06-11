'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
import { SORT_OPTIONS, type SortValue } from '@/lib/catalog/sort';
import type { PriceBucketValue } from '@/lib/catalog/filters';

type Props = {
  selected: SortValue;
  /** Filtros actuales — para preservarlos en la URL al cambiar el orden.
   * Llegan por props (no `useSearchParams`): este componente se renderiza
   * también en el fallback estático de la page ISR, y `useSearchParams` ahí
   * forzaría client-side rendering de todo el árbol (audit perf 2026-06-11). */
  selectedShapes: string[];
  selectedBrands: string[];
  selectedPrice: PriceBucketValue | null;
};

/**
 * Selector de orden del catálogo filtrado. Actualiza `?orden=` preservando
 * el resto de los params (ej `forma`). El sort efectivo se aplica client-side
 * en CategoryFilteredPage (la URL es la fuente de verdad).
 */
export function CatalogSort({
  selected,
  selectedShapes,
  selectedBrands,
  selectedPrice,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const onChange = (value: string) => {
    const params = new URLSearchParams();
    if (selectedShapes.length > 0) params.set('forma', selectedShapes.join(','));
    if (selectedBrands.length > 0) params.set('marca', selectedBrands.join(','));
    if (selectedPrice !== null) params.set('precio', selectedPrice);
    if (value !== 'relevancia') params.set('orden', value);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <label className="text-muted-foreground inline-flex items-center gap-2 text-sm">
      <ArrowUpDown className="size-4 shrink-0" aria-hidden="true" />
      <span className="sr-only sm:not-sr-only">Ordenar por</span>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="border-border/60 bg-background text-foreground focus-visible:ring-ring rounded-md border px-2.5 py-1.5 text-sm outline-none focus-visible:ring-2"
        aria-label="Ordenar productos"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
