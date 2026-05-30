'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import type { ProductImage } from '@/lib/catalog/queries';

type Props = {
  open: boolean;
  images: ProductImage[];
  activeIdx: number;
  onClose: () => void;
  onChangeIdx: (idx: number) => void;
};

export function ImageLightbox({
  open,
  images,
  activeIdx,
  onClose,
  onChangeIdx,
}: Props) {
  // Portal target: necesitamos createPortal hacia document.body para escapar
  // cualquier stacking context del PDP (ancestors con transform/filter/etc
  // que crean stacking context propio y rompen z-50 contra elementos
  // posicionados fuera del PDP). useState + useEffect para evitar SSR mismatch.
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  const goPrev = useCallback(() => {
    if (images.length <= 1) return;
    onChangeIdx((activeIdx - 1 + images.length) % images.length);
  }, [activeIdx, images.length, onChangeIdx]);

  const goNext = useCallback(() => {
    if (images.length <= 1) return;
    onChangeIdx((activeIdx + 1) % images.length);
  }, [activeIdx, images.length, onChangeIdx]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    }
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, goPrev, goNext]);

  if (!open) return null;
  if (!portalTarget) return null;
  const active = images[activeIdx];
  if (!active) return null;
  const url = getProductImageUrl(active.storage_path);

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Vista ampliada: ${active.alt_text}`}
      onClick={onClose}
      className="animate-in fade-in fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black p-4 duration-200 md:p-12"
    >
      {/* Counter "X / Y" — solo si hay >1 imagen */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 md:top-6">
          <p className="bg-background/10 text-background rounded-full px-3 py-1 text-xs font-medium tabular-nums backdrop-blur-md">
            {activeIdx + 1} / {images.length}
          </p>
        </div>
      )}

      {/* Cerrar */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar vista ampliada"
        className="bg-background/10 text-background hover:bg-background/20 absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full backdrop-blur-md transition-colors md:right-6 md:top-6"
      >
        <X className="size-5" />
      </button>

      {/* Prev/Next — solo desktop, con >1 imagen */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Imagen anterior"
            className="bg-background/10 text-background hover:bg-background/20 absolute left-4 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-md transition-colors md:flex md:left-8"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Imagen siguiente"
            className="bg-background/10 text-background hover:bg-background/20 absolute right-4 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-md transition-colors md:flex md:right-8"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}

      {/* Imagen — stopPropagation para que click en la imagen NO cierre */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-full max-h-[85vh] w-full max-w-5xl"
      >
        <Image
          src={url}
          alt={active.alt_text}
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          priority
          className="object-contain"
        />
      </div>

      {/* Mobile dots — debajo de la imagen */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:hidden">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChangeIdx(idx);
              }}
              aria-label={`Ir a imagen ${idx + 1}`}
              className={
                idx === activeIdx
                  ? 'bg-background size-1.5 rounded-full'
                  : 'bg-background/40 size-1.5 rounded-full'
              }
            />
          ))}
        </div>
      )}
    </div>
  );

  return createPortal(overlay, portalTarget);
}
