'use client';

import { useRouter, usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PRICE_BUCKETS, type PriceBucketValue } from '@/lib/catalog/filters';
import type { SortValue } from '@/lib/catalog/sort';

type BrandOption = { slug: string; name: string };

type Props = {
  availableShapes: string[];
  selectedShapes: string[];
  availableBrands: BrandOption[];
  selectedBrands: string[];
  selectedPrice: PriceBucketValue | null;
  /** Orden actual — para preservar `?orden=` al cambiar filtros. Llega por
   * props (no `useSearchParams`): este componente se renderiza también en el
   * fallback estático de la page ISR, y `useSearchParams` ahí forzaría
   * client-side rendering de todo el árbol (audit perf 2026-06-11). */
  currentSort: SortValue;
};

const SHAPE_LABELS: Record<string, string> = {
  rectangular: 'Rectangular',
  cuadrado: 'Cuadrado',
  square: 'Cuadrado',
  redondo: 'Redondo',
  round: 'Redondo',
  ovalado: 'Ovalado',
  oval: 'Ovalado',
  aviador: 'Aviador',
  aviator: 'Aviador',
  cat_eye: 'Cat-eye',
  mariposa: 'Mariposa',
  geometrico: 'Geométrico',
  wayfarer: 'Wayfarer',
  clubmaster: 'Clubmaster',
  sin_marco: 'Sin marco',
  envolvente: 'Envolvente',
  wraparound: 'Envolvente',
  hexagonal: 'Hexagonal',
};

function shapeLabel(shape: string): string {
  return (
    SHAPE_LABELS[shape] ??
    shape.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

/**
 * Barra de filtros del catálogo filtrado: forma (multi) + marca (multi) +
 * precio (single). Persiste en URL (`?forma=&marca=&precio=`) preservando
 * `orden`. El filtrado efectivo se aplica client-side en CategoryFilteredPage
 * (la URL es la fuente de verdad).
 *
 * Reemplaza a <FrameShapeFilters /> SOLO en la vista filtrada (CategoryFilteredPage).
 * Las páginas de forma dedicadas (`/anteojos-de-sol/cat-eye`) siguen con el
 * componente simple.
 */
export function CatalogFilterBar({
  availableShapes,
  selectedShapes,
  availableBrands,
  selectedBrands,
  selectedPrice,
  currentSort,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  // Reconstruye el query actual desde props (estado completo de filtros).
  const push = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams();
    if (selectedShapes.length > 0) params.set('forma', selectedShapes.join(','));
    if (selectedBrands.length > 0) params.set('marca', selectedBrands.join(','));
    if (selectedPrice !== null) params.set('precio', selectedPrice);
    if (currentSort !== 'relevancia') params.set('orden', currentSort);
    mutate(params);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const toggleCsv = (key: string, value: string, current: string[]) => {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    push((params) => {
      if (next.length === 0) params.delete(key);
      else params.set(key, next.join(','));
    });
  };

  const setPrice = (value: PriceBucketValue) => {
    push((params) => {
      if (selectedPrice === value) params.delete('precio');
      else params.set('precio', value);
    });
  };

  const clearAll = () =>
    push((params) => {
      params.delete('forma');
      params.delete('marca');
      params.delete('precio');
    });

  const hasAny =
    selectedShapes.length > 0 ||
    selectedBrands.length > 0 ||
    selectedPrice !== null;

  return (
    <div className="border-border/40 border-y bg-background py-5 md:py-6">
      <div className="container space-y-3">
        {availableShapes.length > 0 && (
          <FilterRow label="Forma">
            {availableShapes.map((shape) => (
              <Chip
                key={shape}
                active={selectedShapes.includes(shape)}
                onClick={() => toggleCsv('forma', shape, selectedShapes)}
              >
                {shapeLabel(shape)}
              </Chip>
            ))}
          </FilterRow>
        )}

        {availableBrands.length > 1 && (
          <FilterRow label="Marca">
            {availableBrands.map((brand) => (
              <Chip
                key={brand.slug}
                active={selectedBrands.includes(brand.slug)}
                onClick={() => toggleCsv('marca', brand.slug, selectedBrands)}
              >
                {brand.name}
              </Chip>
            ))}
          </FilterRow>
        )}

        <FilterRow label="Precio">
          {PRICE_BUCKETS.map((bucket) => (
            <Chip
              key={bucket.value}
              active={selectedPrice === bucket.value}
              onClick={() => setPrice(bucket.value)}
            >
              {bucket.label}
            </Chip>
          ))}
          {hasAny && (
            <button
              type="button"
              onClick={clearAll}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/40 ml-1 inline-flex shrink-0 items-center gap-1 rounded-full border border-transparent px-3 py-1.5 text-sm transition-colors"
            >
              <X className="size-3.5" />
              Limpiar filtros
            </button>
          )}
        </FilterRow>
      </div>
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-x-3 gap-y-2.5 overflow-x-auto md:flex-wrap md:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <p className="text-foreground/60 mr-1 inline-flex w-14 shrink-0 items-center gap-2 text-xs font-medium uppercase tracking-[0.18em]">
        {label}
      </p>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300',
        active
          ? 'border-foreground bg-foreground text-background shadow-sm'
          : 'border-border/60 bg-background text-foreground hover:border-foreground/40 hover:bg-zinc-50',
      )}
    >
      {children}
    </button>
  );
}
