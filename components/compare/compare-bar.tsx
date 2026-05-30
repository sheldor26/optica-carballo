'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Scale, X } from 'lucide-react';
import {
  clearCompareAction,
  removeFromCompareAction,
} from '@/lib/compare/actions';
import { readCompareClientSide } from '@/lib/compare/client';
import type { CompareEntry } from '@/lib/compare/cookie';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import { CompareBarSearch } from '@/components/compare/compare-bar-search';

type ThumbData = {
  slug: string;
  name: string;
  primaryImagePath: string | null;
};

type Props = {
  /** Resolver de imagen + nombre por slug, pasado por el server layout. */
  thumbsBySlug: Record<string, { name: string; primaryImagePath: string | null }>;
};

/**
 * Barra sticky inferior que aparece cuando hay 1+ productos en el comparador.
 * - 1 producto: muestra thumb + "Agregá otro para comparar".
 * - 2-4 productos: muestra thumbs + CTA "Comparar (N) →".
 * - Botón X cierra y limpia el comparador.
 *
 * Polling cada 1.5s + focus listener para captar cambios en otros tabs
 * (mismo patrón que WishlistBadge).
 */
export function CompareBar({ thumbsBySlug }: Props) {
  const [items, setItems] = useState<CompareEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
    const tick = () => setItems(readCompareClientSide());
    tick();
    const interval = window.setInterval(tick, 1500);
    window.addEventListener('focus', tick);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', tick);
    };
  }, []);

  if (!mounted || items.length === 0) return null;

  const thumbs: ThumbData[] = items.map((entry) => ({
    slug: entry.slug,
    name: thumbsBySlug[entry.slug]?.name ?? entry.slug,
    primaryImagePath: thumbsBySlug[entry.slug]?.primaryImagePath ?? null,
  }));

  const canCompare = items.length >= 2;

  const onRemove = (slug: string) => {
    setItems((curr) => curr.filter((i) => i.slug !== slug));
    startTransition(async () => {
      try {
        await removeFromCompareAction(slug);
      } catch {
        // Si falla, el siguiente tick va a revertir.
      }
    });
  };

  const onClear = () => {
    setItems([]);
    startTransition(async () => {
      try {
        await clearCompareAction();
      } catch {
        // siguiente tick revierte
      }
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        key="compare-bar"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-4 sm:pb-4"
        role="region"
        aria-label="Productos en comparador"
      >
        <div className="border-border/60 bg-background/95 mx-auto flex max-w-5xl items-center gap-3 rounded-2xl border px-3 py-2.5 shadow-lg backdrop-blur-md sm:gap-4 sm:px-4 sm:py-3">
          <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
            <Scale className="size-4" strokeWidth={1.75} aria-hidden />
            <span className="hidden sm:inline">Comparar</span>
            <span className="text-foreground">({items.length}/4)</span>
          </div>

          {/* py-2 + px-1.5 dentro del ul: padding interno para que los
              botones X con posición negativa (-top-1.5 -right-1.5) caigan
              dentro del área visible. Sin esto, overflow-x-auto los recorta
              porque también recorta vertical (limitación CSS conocida). */}
          <ul className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto px-1.5 py-2">
            {thumbs.map((t) => (
              <li key={t.slug} className="group relative shrink-0">
                <div className="border-border/60 bg-muted/40 flex size-12 items-center justify-center overflow-hidden rounded-lg border sm:size-14">
                  {t.primaryImagePath ? (
                    <Image
                      src={getProductImageUrl(t.primaryImagePath)}
                      alt={t.name}
                      width={56}
                      height={56}
                      className="size-full object-contain p-1.5"
                    />
                  ) : (
                    <span className="text-muted-foreground text-[10px]">
                      sin foto
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(t.slug)}
                  aria-label={`Quitar ${t.name} del comparador`}
                  className="bg-foreground text-background hover:bg-foreground/80 absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full text-xs leading-none shadow-sm transition-colors"
                >
                  <X className="size-3" strokeWidth={2.5} />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Buscador inline — solo cuando hay espacio para más productos.
                Founder feedback iter previo: querer agregar productos al
                comparador sin volver al catálogo. */}
            {items.length < 4 && (
              <CompareBarSearch
                existingSlugs={items.map((i) => i.slug)}
                onAdded={() => {
                  // Optimistic: el polling de 1.5s va a refrescar `items`.
                  // No tocamos state acá para evitar duplicar el cookie/state.
                }}
              />
            )}
            {canCompare && (
              <Link
                href="/comparar"
                className="bg-foreground text-background hover:bg-foreground/85 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:px-4 sm:py-2 sm:text-sm"
              >
                Comparar →
              </Link>
            )}
            <button
              type="button"
              onClick={onClear}
              aria-label="Cerrar y limpiar comparador"
              className="hover:bg-muted/60 text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-full transition-colors"
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
