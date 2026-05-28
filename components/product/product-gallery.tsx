'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import { useVariantSelection } from '@/lib/product/variant-selection';
import type { ProductImage } from '@/lib/catalog/queries';

type Props = {
  productName: string;
  images: ProductImage[];
};

function sortImages(images: ProductImage[]): ProductImage[] {
  return [...images].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.sort_order - b.sort_order;
  });
}

export function ProductGallery({ productName, images }: Props) {
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
      <div className="bg-muted/40 group relative aspect-square w-full overflow-hidden rounded-lg p-6 md:p-10">
        <Image
          src={activeUrl}
          alt={active.alt_text}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          priority={activeIdx === 0}
        />
      </div>
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
                  'bg-muted/40 relative aspect-square overflow-hidden rounded-md transition-all duration-200',
                  'ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  isActive
                    ? 'ring-foreground ring-2'
                    : 'ring-border/0 hover:ring-foreground/40 ring-1',
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
    </div>
  );
}
