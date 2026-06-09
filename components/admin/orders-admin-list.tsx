'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from '@/components/account/order-status-badge';
import { formatPriceCents } from '@/lib/format/currency';
import { formatOrderDate } from '@/lib/orders/labels';
import { cn } from '@/lib/utils';
import { generateShipmentsBulkAction } from '@/app/admin/pedidos/actions';
import type { AdminOrderListItem } from '@/lib/orders/admin-queries';

/**
 * Listado admin de pedidos con selección múltiple para generar envíos de Correo
 * EN LOTE. Solo los pedidos con envío (no retiro en local) son seleccionables.
 * Cada pedido muestra si su envío YA fue generado (`shipmentImportedAt`).
 */
export function OrdersAdminList({ orders }: { orders: AdminOrderListItem[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Elegibles para envío: todo lo que no sea retiro en local.
  const shippable = useMemo(
    () => orders.filter((o) => o.shippingMethod !== 'pickup'),
    [orders],
  );
  // Los que todavía no tienen envío generado (target típico del "seleccionar todos").
  const pendingShipment = useMemo(
    () => shippable.filter((o) => !o.shipmentImportedAt),
    [shippable],
  );

  function toggle(id: string) {
    setFeedback(null);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allPendingSelected =
    pendingShipment.length > 0 &&
    pendingShipment.every((o) => selected.has(o.id));

  function toggleAllPending() {
    setFeedback(null);
    setSelected((prev) => {
      if (allPendingSelected) {
        const next = new Set(prev);
        for (const o of pendingShipment) next.delete(o.id);
        return next;
      }
      const next = new Set(prev);
      for (const o of pendingShipment) next.add(o.id);
      return next;
    });
  }

  function onGenerate() {
    if (selected.size === 0) return;
    setFeedback(null);
    const ids = [...selected];
    startTransition(async () => {
      const res = await generateShipmentsBulkAction(ids);
      const parts = [`${res.generated} generado(s)`];
      if (res.already > 0) parts.push(`${res.already} ya estaban`);
      if (res.failed > 0) parts.push(`${res.failed} con error`);
      setFeedback({
        type: res.failed > 0 ? 'error' : 'success',
        text:
          `Envíos: ${parts.join(' · ')}.` +
          (res.failed > 0
            ? ' Revisá los pedidos con error (datos de envío incompletos).'
            : ' Copiá los nº de seguimiento del panel de MiCorreo.'),
      });
      setSelected(new Set());
      router.refresh();
    });
  }

  if (orders.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Barra de acción de lote */}
      <div className="border-border bg-muted/30 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3">
        <label className="text-foreground flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4"
            checked={allPendingSelected}
            onChange={toggleAllPending}
            disabled={pendingShipment.length === 0}
          />
          Seleccionar los {pendingShipment.length} sin envío
        </label>
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <span className="text-muted-foreground text-sm">
              {selected.size} seleccionado(s)
            </span>
          )}
          <Button
            onClick={onGenerate}
            disabled={pending || selected.size === 0}
            size="sm"
          >
            {pending ? 'Generando…' : `Generar envíos${selected.size ? ` (${selected.size})` : ''}`}
          </Button>
        </div>
      </div>

      {feedback && (
        <p
          className={cn(
            'rounded-md border px-4 py-2 text-sm',
            feedback.type === 'success'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
              : 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
          )}
          role="status"
        >
          {feedback.text}
        </p>
      )}

      <ul className="border-border divide-border divide-y overflow-hidden rounded-lg border">
        {orders.map((o) => {
          const eligible = o.shippingMethod !== 'pickup';
          const generated = Boolean(o.shipmentImportedAt);
          return (
            <li key={o.id} className="flex items-center gap-3 px-4 py-4">
              {eligible ? (
                <input
                  type="checkbox"
                  className="size-4 shrink-0"
                  checked={selected.has(o.id)}
                  onChange={() => toggle(o.id)}
                  aria-label={`Seleccionar ${o.orderNumber}`}
                />
              ) : (
                <span className="size-4 shrink-0" aria-hidden="true" />
              )}
              <Link
                href={`/admin/pedidos/${o.id}`}
                className="flex min-w-0 flex-1 flex-col gap-2 transition-colors hover:opacity-80 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-foreground font-mono text-sm font-semibold">
                      {o.orderNumber}
                    </span>
                    <OrderStatusBadge status={o.status} />
                    {generated && (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                        Envío generado
                      </span>
                    )}
                    {!eligible && (
                      <span className="text-muted-foreground text-[11px]">
                        Retiro en local
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1 truncate text-xs">
                    {o.customerName} · {o.customerEmail}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {formatOrderDate(o.createdAt)} · {o.itemCount}{' '}
                    {o.itemCount === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-foreground font-semibold tabular-nums">
                    {formatPriceCents(o.totalCents)}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
