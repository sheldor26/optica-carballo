'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ORDER_STATUS_LABELS } from '@/lib/orders/labels';
import { CUSTOMER_NOTIFY_STATUSES } from '@/lib/orders/email-policy';
import { updateOrderStatusAction } from '@/app/admin/pedidos/actions';
import type { OrderStatus } from '@/lib/orders/types';

const SELECTABLE_STATUSES: OrderStatus[] = [
  'pending',
  'paid',
  'preparing',
  'reviewed',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
];

const NOTIFY_SET = new Set<OrderStatus>(CUSTOMER_NOTIFY_STATUSES);

/**
 * Control admin para cambiar el estado de un pedido. Selector + nota opcional.
 * Avisa si el estado elegido dispara un email al cliente. Client component:
 * la mutación corre en la server action (que re-valida `requireAdmin`).
 */
export function OrderStatusControl({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [note, setNote] = useState('');
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const willNotify = NOTIFY_SET.has(status) && status !== currentStatus;
  const dirty = status !== currentStatus || note.trim().length > 0;

  function onSubmit() {
    setFeedback(null);
    startTransition(async () => {
      const res = await updateOrderStatusAction({
        orderId,
        newStatus: status,
        note: note.trim() || undefined,
      });
      if (res.ok) {
        const emailNote = res.emailed
          ? ' Se le envió email al cliente.'
          : res.emailError
            ? ` El estado se guardó, pero el email falló: ${res.emailError}`
            : '';
        setFeedback({
          type: res.emailError ? 'error' : 'success',
          text: res.noop
            ? 'Sin cambios (el pedido ya estaba en ese estado).'
            : `Estado actualizado a "${ORDER_STATUS_LABELS[status]}".${emailNote}`,
        });
        setNote('');
        router.refresh();
      } else {
        setFeedback({ type: 'error', text: res.error });
      }
    });
  }

  return (
    <section className="border-border rounded-lg border p-5">
      <h2 className="text-foreground text-base font-semibold">
        Cambiar estado
      </h2>
      <p className="text-muted-foreground mt-1 text-xs">
        El cliente ve el cambio en el tracker de su pedido. Los estados marcados
        con ✉️ le mandan un email automático.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="order-status"
            className="text-foreground mb-1.5 block text-sm font-medium"
          >
            Estado
          </label>
          <select
            id="order-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            disabled={pending}
            className="border-input bg-background text-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50"
          >
            {SELECTABLE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {ORDER_STATUS_LABELS[s]}
                {NOTIFY_SET.has(s) ? ' ✉️' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="order-note"
            className="text-foreground mb-1.5 block text-sm font-medium"
          >
            Nota <span className="text-muted-foreground">(opcional)</span>
          </label>
          <textarea
            id="order-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={pending}
            rows={2}
            maxLength={500}
            placeholder="Ej: enviado por Andreani, llega en 3-5 días hábiles."
            className="border-input bg-background text-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50"
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Si la cargás, aparece en el tracker del cliente
            {willNotify ? ' y en el email' : ''}.
          </p>
        </div>

        {willNotify && (
          <p className="rounded-md bg-sky-50 px-3 py-2 text-xs text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            ✉️ Este cambio le manda un email al cliente.
          </p>
        )}

        <Button onClick={onSubmit} disabled={pending || !dirty}>
          {pending ? 'Guardando…' : 'Guardar cambio'}
        </Button>

        {feedback && (
          <p
            className={[
              'text-sm',
              feedback.type === 'success'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400',
            ].join(' ')}
            role="status"
          >
            {feedback.text}
          </p>
        )}
      </div>
    </section>
  );
}
