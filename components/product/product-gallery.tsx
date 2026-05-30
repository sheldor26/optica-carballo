'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import { useVariantSelection } from '@/lib/product/variant-selection';
import { ImageLightbox } from '@/components/product/image-lightbox';
import type { ProductImage } from '@/lib/catalog/queries';

/**
 * Cantidad de thumbs visibles en el grid. Las imágenes adicionales (4+)
 * quedan "ocultas" y se navegan con la flecha a la derecha del grid.
 * Founder feedback 2026-05-30: prefiere thumbs de tamaño fijo (no
 * achicarlos cuando hay 4+) — 3 cols fijo + overflow con flecha.
 */
const VISIBLE_THUMBS = 3;

type Props = {
  productName: string;
  images: ProductImage[];
};

function sortImages(
  images: ProductImage[],
  selectedVariantId: string | null,
): ProductImage[] {
  return [...images].sort((a, b) => {
    // 1. Primary primero.
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    // 2. Imágenes específicas de la variante seleccionada antes que las
    //    compartidas (variant_id null). Sin esto, una imagen compartida
    //    con sort_order bajo se cuela entre las específicas y queda
    //    visualmente fuera de orden.
    if (selectedVariantId) {
      const aSpecific = a.variant_id === selectedVariantId;
      const bSpecific = b.variant_id === selectedVariantId;
      if (aSpecific !== bSpecific) return aSpecific ? -1 : 1;
    }
    // 3. Sort_order como tiebreaker final.
    return a.sort_order - b.sort_order;
  });
}

export function ProductGallery({ productName, images }: Props) {
  const { selectedVariantId } = useVariantSelection();

  const sorted = useMemo(() => {
    if (!selectedVariantId) return sortImages(images, null);
    // Filtrar imágenes de la variante seleccionada + las que aplican a
    // todo el modelo (variant_id null).
    const filtered = images.filter(
      (img) => img.variant_id === selectedVariantId || img.variant_id === null,
    );
    // Si la variante no tiene fotos propias, mostrar todas (fallback).
    if (filtered.length === 0) return sortImages(images, null);
    return sortImages(filtered, selectedVariantId);
  }, [images, selectedVariantId]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Cuando cambia la variante (y por lo tanto el set de imágenes), reset
  // al index 0 — sino podríamos quedar apuntando a una imagen que ya no
  // está en el subset filtrado.
  useEffect(() => {
    setActiveIdx(0);
  }, [selectedVariantId]);

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col gap-3 md:sticky md:top-20">
        <div
          className="bg-muted text-muted-foreground flex aspect-[3/2] w-full items-center justify-center rounded-lg text-sm"
          aria-label={`Imagen pendiente de ${productName}`}
        >
          Foto pendiente
        </div>
        <div className="grid grid-cols-4 gap-2" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted/60 aspect-square rounded-md"
            />
          ))}
        </div>
      </div>
    );
  }

  const active = sorted[activeIdx] ?? sorted[0]!;
  const activeUrl = getProductImageUrl(active.storage_path);

  return (
    // Sticky en desktop: la gallery sigue al scroll mientras user lee la info
    // de la derecha — elimina sensación de "bloque blanco" debajo de la col
    // izquierda cuando la derecha es más larga (caso típico con producto
    // detallado: variantes + ficha + medidas + incluye).
    // top-20 ≈ alto del header sticky (16) + margin.
    <div className="flex flex-col gap-3 md:sticky md:top-20">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        aria-label={`Ampliar imagen: ${active.alt_text}`}
        className="bg-background border-border/40 group relative aspect-[3/2] w-full cursor-zoom-in overflow-hidden rounded-lg border p-2 ring-offset-background transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-3 md:p-4"
      >
        {/* Padding mínimo (p-4 = 16px en desktop) — las fotos del founder
            vienen con buen margen propio. Iter previo (p-8) seguía dando
            sensación de foto chica vs contenedor. Ahora la foto ocupa
            ~90% del cuadrado disponible. */}
        <div className="relative h-full w-full">
          <Image
            src={activeUrl}
            alt={active.alt_text}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            priority={activeIdx === 0}
          />
        </div>
      </button>
      {sorted.length > 1 && (
        <div className="flex items-stretch gap-2">
          <div
            className="grid flex-1 gap-2"
            style={{
              gridTemplateColumns: `repeat(${Math.min(sorted.length, VISIBLE_THUMBS)}, minmax(0, 1fr))`,
            }}
          >
            {sorted.slice(0, VISIBLE_THUMBS).map((img, idx) => {
              const url = getProductImageUrl(img.storage_path);
              const isActive = idx === activeIdx;
              return (
                <button
                  key={img.storage_path}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Ver imagen ${idx + 1} de ${sorted.length}: ${img.alt_text}`}
                  aria-current={isActive}
                  className={cn(
                    'bg-background relative aspect-square overflow-hidden rounded-md p-1 transition-all duration-200',
                    'ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                    isActive
                      ? 'ring-foreground ring-2'
                      : 'ring-border/40 hover:ring-foreground/40 ring-1',
                  )}
                >
                  <Image
                    src={url}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-contain"
                  />
                </button>
              );
            })}
          </div>
          {sorted.length > VISIBLE_THUMBS && (
            <button
              type="button"
              onClick={() =>
                setActiveIdx((activeIdx + 1) % sorted.length)
              }
              aria-label={`Ver siguiente imagen (${sorted.length - VISIBLE_THUMBS} ${sorted.length - VISIBLE_THUMBS === 1 ? 'oculta' : 'ocultas'})`}
              className={cn(
                'bg-background flex aspect-square w-1/4 shrink-0 items-center justify-center rounded-md transition-colors',
                'ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                activeIdx >= VISIBLE_THUMBS
                  ? 'ring-foreground ring-2'
                  : 'ring-border/40 hover:ring-foreground/40 ring-1',
              )}
              title={`Ver más fotos (${sorted.length - VISIBLE_THUMBS} oculta${sorted.length - VISIBLE_THUMBS === 1 ? '' : 's'})`}
            >
              <ChevronRight
                className="text-foreground/70 group-hover:text-foreground size-5"
                aria-hidden="true"
              />
              <span className="sr-only">Siguiente</span>
            </button>
          )}
        </div>
      )}
      <ImageLightbox
        open={lightboxOpen}
        images={sorted}
        activeIdx={activeIdx}
        onClose={() => setLightboxOpen(false)}
        onChangeIdx={setActiveIdx}
      />
    </div>
  );
}
