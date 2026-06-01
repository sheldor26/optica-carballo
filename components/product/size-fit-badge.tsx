import { Ruler } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SIZE_FIT_LABELS, type SizeFit } from '@/lib/catalog/size-fit';

/**
 * Badge de talle del armazón ("Talle Junior", etc.). Identifica modelos de
 * calce particular sobre la foto del producto. Data-driven desde
 * `attributes.size_fit` (ver `lib/catalog/size-fit.ts`).
 *
 * Acepta el valor crudo (string) para que los consumers de card no tengan que
 * castear; valida contra los labels conocidos y no renderiza nada si no matchea.
 */
export function SizeFitBadge({
  sizeFit,
  className,
  size = 'md',
}: {
  sizeFit: string | null | undefined;
  className?: string;
  size?: 'sm' | 'md';
}) {
  if (!sizeFit || !(sizeFit in SIZE_FIT_LABELS)) return null;
  const label = SIZE_FIT_LABELS[sizeFit as SizeFit];

  const sizeClasses =
    size === 'sm'
      ? 'gap-1 px-2 py-0.5 text-[10px]'
      : 'gap-1.5 px-2.5 py-1 text-xs';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold tracking-wide',
        'border-emerald-500/40 bg-emerald-500/90 text-white shadow-sm',
        'dark:bg-emerald-500/90',
        sizeClasses,
        className,
      )}
    >
      <Ruler className={size === 'sm' ? 'size-2.5' : 'size-3'} />
      {label}
    </span>
  );
}
