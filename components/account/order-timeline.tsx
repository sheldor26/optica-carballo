import { Check, ShieldCheck, XCircle } from 'lucide-react';
import { buildTracker } from '@/lib/orders/order-status';
import { formatOrderDate } from '@/lib/orders/labels';
import type { OrderStatus, OrderStatusEvent } from '@/lib/orders/types';

/**
 * Stepper vertical del estado del pedido (Tracker de pedido en vivo).
 * Mobile-first. Server component puro — sin estado, sin JS en cliente.
 */
export function OrderTimeline({
  status,
  events,
}: {
  status: OrderStatus;
  events: OrderStatusEvent[];
}) {
  const tracker = buildTracker(status, events);

  // Estados terminales fuera de camino: no mostramos el stepper happy-path.
  if (tracker.offPath) {
    const isCancelled = tracker.offPathStatus === 'cancelled';
    return (
      <section className="border-border rounded-lg border p-5">
        <div className="flex items-start gap-3">
          <XCircle
            className="text-muted-foreground mt-0.5 size-5 shrink-0"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-foreground text-base font-semibold">
              {isCancelled ? 'Pedido cancelado' : 'Pedido reembolsado'}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {isCancelled
                ? 'Este pedido fue cancelado. Si tenés dudas, escribinos por WhatsApp.'
                : 'Este pedido fue reembolsado. El dinero vuelve por el mismo medio de pago.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-border rounded-lg border p-5">
      <h2 className="text-foreground text-base font-semibold">
        Estado del pedido
      </h2>

      {tracker.awaitingPayment && (
        <p className="text-muted-foreground mt-1 text-sm">
          Estamos esperando la confirmación del pago. Apenas se acredite,
          empezamos a preparar tu pedido.
        </p>
      )}

      <ol className="mt-4">
        {tracker.nodes.map((node, i) => {
          const isLast = i === tracker.nodes.length - 1;
          const done = node.state === 'completed';
          const current = node.state === 'current';
          const active = done || current;

          return (
            <li key={node.step} className="flex gap-3">
              {/* Columna del marker + conector */}
              <div className="flex flex-col items-center">
                <span
                  className={[
                    'flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors',
                    done
                      ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500'
                      : current
                        ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400'
                        : 'border-border bg-background text-muted-foreground',
                  ].join(' ')}
                  aria-hidden="true"
                >
                  {done ? (
                    <Check className="size-4" strokeWidth={3} />
                  ) : node.step === 'reviewed' ? (
                    <ShieldCheck className="size-4" />
                  ) : (
                    <span
                      className={[
                        'size-2 rounded-full',
                        current ? 'bg-sky-500' : 'bg-muted-foreground/40',
                      ].join(' ')}
                    />
                  )}
                </span>
                {!isLast && (
                  <span
                    className={[
                      'my-1 w-px flex-1',
                      done ? 'bg-emerald-500/50' : 'bg-border',
                    ].join(' ')}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Contenido del paso */}
              <div className={isLast ? 'pb-0' : 'pb-5'}>
                <p
                  className={[
                    'text-sm font-medium',
                    active ? 'text-foreground' : 'text-muted-foreground',
                  ].join(' ')}
                >
                  {node.label}
                  {current && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                      En curso
                    </span>
                  )}
                </p>
                {active && (
                  <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                    {node.description}
                  </p>
                )}
                {node.note && (
                  <p className="text-foreground bg-muted/50 mt-1.5 rounded-md px-2.5 py-1.5 text-xs leading-relaxed">
                    {node.note}
                  </p>
                )}
                {node.at && (
                  <p className="text-muted-foreground mt-1 text-[11px] tabular-nums">
                    {formatOrderDate(node.at)}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
