import type { FilteredCatalogCard } from '@/lib/catalog/queries';

/**
 * Buckets de precio para el filtro `?precio=` del catálogo. Single-select.
 * Umbrales en centavos, redondos en pesos, pensados para el rango actual de
 * anteojos (~$60k–$110k). Server-safe (sin 'use client') para que la page y
 * el componente client los compartan.
 */
export const PRICE_BUCKETS = [
  { value: 'hasta-80', label: 'Hasta $80.000', minCents: 0, maxCents: 8_000_000 },
  {
    value: '80-100',
    label: '$80.000 a $100.000',
    minCents: 8_000_000,
    maxCents: 10_000_000,
  },
  {
    value: 'mas-100',
    label: 'Más de $100.000',
    minCents: 10_000_000,
    maxCents: Number.POSITIVE_INFINITY,
  },
] as const;

export type PriceBucketValue = (typeof PRICE_BUCKETS)[number]['value'];

export function normalizePriceBucket(
  value: string | undefined,
): PriceBucketValue | null {
  return PRICE_BUCKETS.some((b) => b.value === value)
    ? (value as PriceBucketValue)
    : null;
}

/**
 * Filtra el catálogo por bucket de precio usando `minPriceCents` (el precio
 * "desde" del producto). Los productos sin precio (sin stock) NO matchean
 * ningún bucket. Pura, no muta. `null` = sin filtro → devuelve todo.
 */
export function filterByPriceBucket<T extends FilteredCatalogCard>(
  products: T[],
  bucket: PriceBucketValue | null,
): T[] {
  if (!bucket) return products;
  const def = PRICE_BUCKETS.find((b) => b.value === bucket);
  if (!def) return products;
  return products.filter((p) => {
    if (p.minPriceCents === null) return false;
    return p.minPriceCents >= def.minCents && p.minPriceCents < def.maxCents;
  });
}

/** Parsea un param multi-valor CSV (`?marca=a,b`) a array limpio. */
export function parseCsvParam(value: string | undefined): string[] {
  return value ? value.split(',').filter((s) => s.length > 0) : [];
}
