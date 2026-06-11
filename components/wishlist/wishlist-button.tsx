'use client';

import { useEffect, useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toggleWishlistAction } from '@/lib/wishlist/actions';
import { readWishlistClientSide } from '@/lib/wishlist/client';
import type { WishlistEntry } from '@/lib/wishlist/cookie';
import { track, Events } from '@/lib/analytics/track';

type Props = {
  entry: WishlistEntry;
  /** Variante 'card' = botón flotante absoluto sobre la card. 'inline' = inline con texto. 'title' = icono grande sin borde a la altura del título. */
  variant?: 'card' | 'inline' | 'title';
  className?: string;
};

/**
 * Botón corazón para agregar/sacar del wishlist. Estado optimista —
 * al click cambia el estado visual inmediato y dispara server action
 * en transition. Si la action falla, revierte.
 */
export function WishlistButton({
  entry,
  variant = 'card',
  className,
}: Props) {
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
    const list = readWishlistClientSide();
    setIsSaved(list.some((item) => item.slug === entry.slug));
  }, [entry.slug]);

  const onClick = (e: React.MouseEvent) => {
    // Cuando el botón está adentro de un Link (en card), evitar
    // navegar al producto al hacer click en el heart.
    e.preventDefault();
    e.stopPropagation();

    const prev = isSaved;
    setIsSaved(!prev); // optimistic

    startTransition(async () => {
      try {
        const result = await toggleWishlistAction(entry);
        setIsSaved(result.added);
        track(Events.WISHLIST_TOGGLE, {
          slug: entry.slug,
          brand: entry.brand,
          action: result.added ? 'add' : 'remove',
        });
      } catch {
        // Revertir si falla
        setIsSaved(prev);
      }
    });
  };

  // Evitar hydration mismatch — render nada en SSR, fade in al montar
  if (!mounted) {
    if (variant === 'card') {
      return (
        <div
          aria-hidden="true"
          className={cn(
            'absolute right-2 top-2 z-10 size-9 rounded-full',
            className,
          )}
        />
      );
    }
    if (variant === 'title') {
      return (
        <div
          aria-hidden="true"
          className={cn('size-11 shrink-0 rounded-full', className)}
        />
      );
    }
    return null;
  }

  if (variant === 'title') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={isSaved ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        aria-pressed={isSaved}
        className={cn(
          'group/wish hover:bg-muted/60 flex size-11 shrink-0 items-center justify-center rounded-full transition-all duration-200 hover:scale-110',
          className,
        )}
      >
        <span className={cn('inline-flex', isSaved && 'animate-pop')}>
          <Heart
            className={cn(
              'size-6 transition-colors',
              isSaved
                ? 'fill-red-500 text-red-500'
                : 'text-foreground/70 fill-none',
            )}
            strokeWidth={1.75}
          />
        </span>
      </button>
    );
  }

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={isSaved ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        aria-pressed={isSaved}
        className={cn(
          'group/wish inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
          isSaved
            ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400'
            : 'border-border/60 bg-background text-foreground hover:bg-muted/40',
          className,
        )}
      >
        <span className={cn('inline-flex', isSaved && 'animate-pop')}>
          <Heart
            className={cn(
              'size-4 transition-colors',
              isSaved ? 'fill-red-500 text-red-500' : 'fill-none',
            )}
          />
        </span>
        {isSaved ? 'Guardado' : 'Guardar'}
      </button>
    );
  }

  // variant === 'card'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isSaved ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      aria-pressed={isSaved}
      className={cn(
        'group/wish bg-background/85 hover:bg-background absolute right-2 top-2 z-10 flex size-9 items-center justify-center rounded-full backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-110',
        className,
      )}
    >
      <span className={cn('inline-flex', isSaved && 'animate-pop')}>
        <Heart
          className={cn(
            'size-4 transition-colors',
            isSaved ? 'fill-red-500 text-red-500' : 'text-foreground/60 fill-none',
          )}
        />
      </span>
    </button>
  );
}
