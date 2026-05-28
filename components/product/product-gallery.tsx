'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import { useVariantSelection } from '@/lib/product/variant-selection';
import { ImageLightbox } from '@/components/product/image-lightbox';
import type { ProductImage } from '@/lib/catalog/queries';

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
      <div className="flex flex-col gap-3">
        <div
          className="bg-muted text-muted-foreground flex aspect-square w-full items-center justify-center rounded-lg text-sm"
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
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        aria-label={`Ampliar imagen: ${active.alt_text}`}
        className="bg-background border-border/40 group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-lg border p-10 ring-offset-background transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-14 md:p-20"
      >
        {/* Inner wrapper para que `fill` respete el padding del outer.
            `Image fill` se posiciona absolute inset-0 del contenedor
            relative más cercano — el outer tiene padding pero fill lo
            ignora. Este inner wrapper define el área "post-padding"
            donde la imagen y su zoom hover deben caber.

            Padding generoso (p-20 = 80px en desktop) porque las fotos
            originales del fabricante vienen muchas veces sin aire
            propio — el anteojo toca los bordes del JPG. El padding
            del wrapper compensa eso. */}
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
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${Math.min(sorted.length, 6)}, minmax(0, 1fr))`,
          }}
        >
          {sorted.map((img, idx) => {
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
