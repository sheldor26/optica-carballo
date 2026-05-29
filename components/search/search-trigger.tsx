'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { SearchDialog } from '@/components/search/search-dialog';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  /** Variante visual: icon-only (default header) o text+icon (mobile menu). */
  variant?: 'icon' | 'inline';
};

/**
 * Trigger del search dialog. Por default es icon-only para el header.
 *
 * Atajos de teclado:
 * - ⌘K / Ctrl+K → abre.
 * - / → abre (cuando no estás escribiendo en otro input).
 * - ESC dentro del dialog → cierra (manejado por Radix Dialog).
 */
export function SearchTrigger({ className, variant = 'icon' }: Props) {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform));

    const onKey = (e: KeyboardEvent) => {
      // ⌘K / Ctrl+K
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      // "/" cuando no estás escribiendo en un input/textarea/contenteditable
      if (
        e.key === '/' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName.toLowerCase();
        const isEditable =
          tag === 'input' ||
          tag === 'textarea' ||
          target?.isContentEditable === true;
        if (!isEditable) {
          e.preventDefault();
          setOpen(true);
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (variant === 'inline') {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buscar"
          className={cn(
            'border-border/60 bg-muted/40 hover:bg-muted/70 text-muted-foreground flex w-full items-center gap-3 rounded-full border px-4 py-2.5 text-sm transition-colors',
            className,
          )}
        >
          <Search className="size-4" strokeWidth={1.75} aria-hidden />
          <span className="flex-1 text-left">Buscar productos…</span>
          <kbd className="border-border/60 bg-background hidden rounded border px-1.5 py-0.5 text-[10px] font-medium sm:inline-flex">
            {isMac ? '⌘' : 'Ctrl'}K
          </kbd>
        </button>
        <SearchDialog open={open} onOpenChange={setOpen} />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar"
        className={cn(
          'hover:bg-muted/60 text-foreground/80 hover:text-foreground flex size-9 items-center justify-center rounded-full transition-colors',
          className,
        )}
      >
        <Search className="size-5" strokeWidth={1.75} aria-hidden />
      </button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
