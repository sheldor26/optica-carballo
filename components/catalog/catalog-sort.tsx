'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

/** Opciones de orden del grid. Persisten en `?orden=` (SEO + share). */
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
 * Selector de orden del catálogo filtrado. Actualiza `?orden=` preservando
 * el resto de los params (ej `forma`). El sort efectivo se aplica server-side
 * en la page (ver `app/(storefront)/anteojos-de-sol/page.tsx`).
 */
export function CatalogSort({ selected }: { selected: SortValue }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'relevancia') {
      params.delete('orden');
    } else {
      params.set('orden', value);
    }
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
