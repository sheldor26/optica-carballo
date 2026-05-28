import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type AttributesJson = Record<string, unknown>;

/**
 * Renderiza un badge "Nuevo ingreso" si el producto tiene
 * `attributes.new_until` con una fecha futura.
 *
 * Schema: `attributes.new_until` = string ISO 8601 (ej "2026-06-28").
 * Se evalúa server-side al renderizar. La página de producto es
 * dinámica/revalidable, así que el badge desaparece automáticamente
 * al pasar la fecha sin necesidad de redeploy.
 *
 * Convención: cuando se carga un producto nuevo, setear `new_until`
 * a 1 mes desde la fecha de carga. Si el founder quiere extender o
 * acortar, edita el JSONB.
 */
export function NewArrivalBadge({
  attributes,
  className,
  size = 'md',
}: {
  attributes: AttributesJson;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const newUntil = attributes.new_until;
  if (typeof newUntil !== 'string') return null;
  const date = new Date(newUntil);
  if (Number.isNaN(date.getTime())) return null;
  if (date.getTime() <= Date.now()) return null;

  const sizeClasses =
    size === 'sm'
      ? 'gap-1 px-2 py-0.5 text-[10px]'
      : 'gap-1.5 px-2.5 py-1 text-xs';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold tracking-wide',
        'border-emerald-500/40 bg-emerald-500/10 text-emerald-700',
        'dark:bg-emerald-400/15 dark:text-emerald-300',
        sizeClasses,
        className,
      )}
    >
      <Sparkles className={size === 'sm' ? 'size-2.5' : 'size-3'} />
      Nuevo ingreso
    </span>
  );
}
