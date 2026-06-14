'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import { getImageScale } from '@/lib/catalog/image-scale-overrides';
import { useVariantSelection } from '@/lib/product/variant-selection';
import { CrossfadeImage } from '@/components/ui/crossfade-image';
import { ImageLightbox } from '@/components/product/image-lightbox';
import { SizeFitBadge } from '@/components/product/size-fit-badge';
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
  /** Talle del armazón (`attributes.size_fit`) para el badge sobre la foto. */
  sizeFit?: string | null;
};

function sortImages(images: ProductImage[]): ProductImage[] {
  // Algoritmo simplificado (2026-05-30): solo primary + sort_order.
  // Antes priorizábamos variant_id matching sobre shared (NULL), pero eso
  // hacía que imágenes compartidas con sort_order intercalado quedaran al
  // final aunque deberían mezclarse con las específicas según el sort.
  // Caso concreto: para MBLK la imagen del modelo (sort=3, variant matching)
  // aparecía ANTES de medidas (sort=2, shared), invirtiendo el orden DB.
  //
  // Decisión: el sort_order en DB es la fuente de verdad. Si querés un orden
  // específico, setealo en sort_order. Esto requiere que sort_orders estén
  // bien normalizados para cada producto.
  return [...images].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.sort_order - b.sort_order;
  });
}

export function ProductGallery({ productName, images, sizeFit }: Props) {
  const { selectedVariantId } = useVariantSelection();

  const sorted = useMemo(() => {
    if (!selectedVariantId) return sortImages(images);
    // Filtrar imágenes de la variante seleccionada + las que aplican a
    // todo el modelo (variant_id null).
    const filtered = images.filter(
      (img) => img.variant_id === selectedVariantId || img.variant_id === null,
    );
    // Si la variante no tiene fotos propias, mostrar todas (fallback).
    if (filtered.length === 0) return sortImages(images);
    return sortImages(filtered);
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
  // Mismo scale override que el grid (regla 15): la PDP debe verse igual que la
  // card. Se aplica en un wrapper para coexistir con el hover scale de la imagen.
  const activeScale = getImageScale(active.storage_path);

  return (
    // Sticky en desktop: la gallery sigue al scroll mientras user lee la info
    // de la derecha — elimina sensación de "bloque blanco" debajo de la col
    // izquierda cuando la derecha es más larga (caso típico con producto
    // detallado: variantes + ficha + medidas + incluye).
    // top-20 ≈ alto del header sticky (16) + margin.
    <div
      id="oc-fly-origin"
      className="flex flex-col gap-3 md:sticky md:top-20"
    >
      {/* MOBILE: carrusel con swipe (scroll-snap nativo). 70% del tráfico es
          mobile y el gesto esperado sobre una foto de producto es deslizar. */}
      <MobileGalleryCarousel
        images={sorted}
        activeIdx={activeIdx}
        onActiveChange={setActiveIdx}
        onOpenLightbox={(idx) => {
          setActiveIdx(idx);
          setLightboxOpen(true);
        }}
        resetKey={selectedVariantId ?? 'default'}
        sizeFit={sizeFit}
        productName={productName}
      />

      {/* DESKTOP: visor único (con crossfade al cambiar variante) + thumbnails. */}
      <div className="hidden md:flex md:flex-col md:gap-3">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={`Ampliar imagen: ${active.alt_text}`}
          className="bg-background border-border/40 group relative aspect-[3/2] w-full cursor-zoom-in overflow-hidden rounded-lg border ring-offset-background transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:p-4"
        >
          <CrossfadeImage
            src={activeUrl}
            scale={activeScale}
            alt={productName}
            sizes="(min-width: 1024px) 560px, 50vw"
            priority
            durationMs={350}
            className="relative h-full w-full"
            imageClassName="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
          {sizeFit && (
            <span className="pointer-events-none absolute left-3 top-3 z-10">
              <SizeFitBadge sizeFit={sizeFit} />
            </span>
          )}
        </button>
        {sorted.length > 1 && (
          <div className="relative">
            <div
              className="grid gap-2"
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
                      sizes="240px"
                      className="object-contain"
                      style={{ transform: `scale(${getImageScale(img.storage_path)})` }}
                    />
                  </button>
                );
              })}
            </div>
            {sorted.length > VISIBLE_THUMBS && (
              <button
                type="button"
                onClick={() => setActiveIdx((activeIdx + 1) % sorted.length)}
                aria-label={`Ver siguiente imagen (${sorted.length - VISIBLE_THUMBS} ${sorted.length - VISIBLE_THUMBS === 1 ? 'oculta' : 'ocultas'})`}
                className={cn(
                  'bg-foreground/90 hover:bg-foreground text-background absolute -right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-colors',
                  'ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  activeIdx >= VISIBLE_THUMBS && 'ring-foreground ring-2 ring-offset-1',
                )}
                title={`Ver foto oculta (${sorted.length - VISIBLE_THUMBS} más)`}
              >
                <ChevronRight className="size-4" aria-hidden="true" />
                <span className="sr-only">Siguiente</span>
              </button>
            )}
          </div>
        )}
      </div>
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

/**
 * Carrusel de galería para MOBILE: una tira horizontal con scroll-snap nativo
 * (sin JS de gestos — el navegador da inercia + paginación). Cada foto ocupa el
 * ancho completo y snapea al centro; al tocar, abre el lightbox. Puntos abajo
 * marcan la posición. Respeta `prefers-reduced-motion` solo (scroll nativo).
 *
 * El índice activo se deriva del scroll (para los puntos + abrir el lightbox en
 * la foto correcta), sin forzar scroll programático que pelee con el swipe del
 * usuario. Solo se resetea a 0 cuando cambia la variante (`resetKey`).
 */
function MobileGalleryCarousel({
  images,
  activeIdx,
  onActiveChange,
  onOpenLightbox,
  resetKey,
  sizeFit,
  productName,
}: {
  images: ProductImage[];
  activeIdx: number;
  onActiveChange: (idx: number) => void;
  onOpenLightbox: (idx: number) => void;
  resetKey: string;
  sizeFit?: string | null;
  productName: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Al cambiar de variante (resetKey), volver a la primera foto.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ left: 0, behavior: 'auto' });
  }, [resetKey]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      if (idx !== activeIdx) onActiveChange(idx);
    });
  }

  return (
    <div className="md:hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((img, idx) => (
          <button
            key={img.storage_path}
            type="button"
            onClick={() => onOpenLightbox(idx)}
            aria-label={`Ampliar imagen ${idx + 1} de ${images.length}: ${img.alt_text}`}
            className="bg-background border-border/40 relative aspect-[3/2] w-full shrink-0 basis-full snap-center cursor-zoom-in overflow-hidden rounded-lg border p-2"
          >
            <div
              className="relative h-full w-full"
              style={{ transform: `scale(${getImageScale(img.storage_path)})` }}
            >
              <Image
                src={getProductImageUrl(img.storage_path)}
                alt={idx === 0 ? productName : ''}
                fill
                sizes="100vw"
                priority={idx === 0}
                className="object-contain"
              />
            </div>
            {sizeFit && (
              <span className="pointer-events-none absolute left-3 top-3 z-10">
                <SizeFitBadge sizeFit={sizeFit} />
              </span>
            )}
          </button>
        ))}
      </div>

      {images.length > 1 && (
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {images.map((img, idx) => (
            <span
              key={img.storage_path}
              aria-hidden="true"
              className={cn(
                'h-1.5 rounded-full transition-all duration-200',
                idx === activeIdx ? 'bg-foreground w-4' : 'bg-foreground/25 w-1.5',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
