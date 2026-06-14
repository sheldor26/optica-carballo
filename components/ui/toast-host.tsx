'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TOAST_EVENT, type ToastInput } from '@/lib/ui/toast';

interface Toast extends ToastInput {
  id: number;
}

const DURATION_MS = 3800;
let counter = 0;

/**
 * Contenedor global de toasts. Se monta una vez en el layout del storefront
 * y escucha el evento `oc:toast`. Apila los toasts abajo-centro, cada uno se
 * autodescarta tras ~3.8s. No renderiza nada si no hay toasts (cero costo
 * cuando no se usa).
 */
export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastInput>).detail;
      if (!detail?.message) return;
      const id = ++counter;
      setToasts((prev) => [...prev, { id, ...detail }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, DURATION_MS);
    };
    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((t) => {
        const isError = t.variant === 'error';
        return (
          <div
            key={t.id}
            className={cn(
              'animate-in fade-in slide-in-from-bottom-2 pointer-events-auto flex max-w-[92vw] items-center gap-3 rounded-full border px-4 py-2.5 text-sm shadow-lg duration-300',
              isError
                ? 'border-destructive/30 bg-destructive text-destructive-foreground'
                : 'border-foreground/10 bg-foreground text-background',
            )}
          >
            <span className="flex size-5 shrink-0 items-center justify-center">
              {isError ? (
                <TriangleAlert className="size-4" aria-hidden="true" />
              ) : (
                <Check className="size-4" aria-hidden="true" />
              )}
            </span>
            <span className="truncate font-medium">{t.message}</span>
            {t.actionLabel && t.actionHref && (
              <Link
                href={t.actionHref}
                className="shrink-0 font-semibold underline underline-offset-2 hover:opacity-80"
              >
                {t.actionLabel}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
