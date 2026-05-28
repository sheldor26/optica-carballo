import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONE,
} from '@/lib/orders/labels';
import type { OrderStatus } from '@/lib/orders/types';

const TONE_CLASSES: Record<
  ReturnType<() => (typeof ORDER_STATUS_TONE)[OrderStatus]>,
  string
> = {
  neutral: 'bg-muted text-muted-foreground',
  success:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  info: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
  warning:
    'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300',
  destructive: 'bg-destructive/15 text-destructive',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const label = ORDER_STATUS_LABELS[status];
  const tone = ORDER_STATUS_TONE[status];
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        TONE_CLASSES[tone],
      ].join(' ')}
    >
      {label}
    </span>
  );
}
