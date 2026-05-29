'use client';

import { useEffect, useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toggleCompareAction } from '@/lib/compare/actions';
import { readCompareClientSide } from '@/lib/compare/client';
import type { CompareEntry } from '@/lib/compare/cookie';

type Props = {
  entry: CompareEntry;
  /** 'title' = icon-only grande al lado del título. 'inline' = botón con texto. */
  variant?: 'title' | 'inline';
  className?: string;
};

/**
 * Botón para agregar/sacar producto del comparador. Estado optimista.
 * Si el comparador está full (4 items) y el usuario intenta agregar uno nuevo,
 * el estado no cambia y un toast simple (window.alert) avisa.
 */
export function CompareButton({ entry, variant = 'title', className }: Props) {
  const [isInList, setIsInList] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
    const list = readCompareClientSide();
    setIsInList(list.some((item) => item.slug === entry.slug));
  }, [entry.slug]);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const prev = isInList;
    setIsInList(!prev); // optimistic

    startTransition(async () => {
      try {
        const result = await toggleCompareAction(entry);
        setIsInList(result.added);
        if (!result.added && result.full) {
          // No se pudo agregar porque hay 4 productos en el comparador.
          // Mensaje simple, sin librería de toast (KISS).
          if (typeof window !== 'undefined') {
            window.alert('Ya tenés 4 productos para comparar. Sacá uno antes de agregar otro.');
          }
        }
      } catch {
        setIsInList(prev);
      }
    });
  };

  if (!mounted) {
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
        aria-label={isInList ? 'Quitar del comparador' : 'Agregar al comparador'}
        aria-pressed={isInList}
        className={cn(
          'group/cmp hover:bg-muted/60 flex size-11 shrink-0 items-center justify-center rounded-full transition-all duration-200 hover:scale-110',
          className,
        )}
      >
        <motion.span
          animate={isInList ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Scale
            className={cn(
              'size-5 transition-colors',
              isInList ? 'text-amber-600 dark:text-amber-400' : 'text-foreground/70',
            )}
            strokeWidth={1.75}
          />
        </motion.span>
      </button>
    );
  }

  // variant === 'inline'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isInList ? 'Quitar del comparador' : 'Agregar al comparador'}
      aria-pressed={isInList}
      className={cn(
        'group/cmp inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
        isInList
          ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300'
          : 'border-border/60 bg-background text-foreground hover:bg-muted/40',
        className,
      )}
    >
      <motion.span
        animate={isInList ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        className="inline-flex"
      >
        <Scale className="size-4" strokeWidth={1.75} />
      </motion.span>
      {isInList ? 'En comparador' : 'Comparar'}
    </button>
  );
}
