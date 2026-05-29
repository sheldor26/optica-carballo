'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { removeFromCompareAction } from '@/lib/compare/actions';

/**
 * Botón "Quitar" en la tabla de comparación. Server action + router.refresh()
 * para que la columna desaparezca de la tabla sin recarga manual.
 */
export function CompareRemoveButton({ slug }: { slug: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onClick = () => {
    startTransition(async () => {
      await removeFromCompareAction(slug);
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 self-start text-xs underline-offset-2 hover:underline disabled:opacity-50"
      aria-label="Quitar del comparador"
    >
      <X className="size-3" strokeWidth={2} />
      Quitar
    </button>
  );
}
