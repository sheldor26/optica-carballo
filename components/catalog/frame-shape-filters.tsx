'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  /** Frame shapes que existen REALMENTE en productos cargados. */
  availableShapes: string[];
  /** Shapes activos según URL. */
  selectedShapes: string[];
};

/**
 * Convención de display: snake_case (DB) → "Title Case" (UI).
 * Hardcodeamos las que conocemos. Si aparece una nueva forma en DB, se
 * muestra capitalizada genéricamente.
 */
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
};

function labelFor(shape: string): string {
  if (SHAPE_LABELS[shape]) return SHAPE_LABELS[shape]!;
  // Fallback: capitalizar y reemplazar _ por espacio
  return shape
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Chips clickeables de filtros por forma de armazón.
 * Toggle: click sobre chip activo lo desactiva. Botón "Limpiar" al final.
 * Persiste estado en URL (`?forma=rectangular,cat_eye`) para SEO + share.
 */
export function FrameShapeFilters({ availableShapes, selectedShapes }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (availableShapes.length === 0) return null;

  const updateUrl = (newShapes: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newShapes.length === 0) {
      params.delete('forma');
    } else {
      params.set('forma', newShapes.join(','));
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const toggle = (shape: string) => {
    const isActive = selectedShapes.includes(shape);
    const next = isActive
      ? selectedShapes.filter((s) => s !== shape)
      : [...selectedShapes, shape];
    updateUrl(next);
  };

  const clear = () => updateUrl([]);

  return (
    <div className="border-border/40 border-y bg-background py-4">
      <div className="container">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-muted-foreground mr-2 text-xs font-medium uppercase tracking-wider">
            Filtrar por forma:
          </p>
          {availableShapes.map((shape) => {
            const active = selectedShapes.includes(shape);
            return (
              <button
                key={shape}
                type="button"
                onClick={() => toggle(shape)}
                aria-pressed={active}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  active
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border/60 bg-background text-foreground hover:bg-muted/40',
                )}
              >
                {labelFor(shape)}
              </button>
            );
          })}
          {selectedShapes.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-1 text-xs transition-colors hover:bg-muted/40"
            >
              <X className="size-3" />
              Limpiar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
