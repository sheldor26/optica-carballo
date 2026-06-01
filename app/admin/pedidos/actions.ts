'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendOrderStatusUpdateToCustomer } from '@/lib/emails/send-order-emails';
import { shouldNotifyCustomer } from '@/lib/orders/email-policy';
import type { OrderStatus } from '@/lib/orders/types';

const VALID_STATUSES: readonly OrderStatus[] = [
  'pending',
  'paid',
  'preparing',
  'reviewed',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
];

export type UpdateStatusResult =
  | { ok: true; noop?: boolean; emailed: boolean; emailError?: string }
  | { ok: false; error: string };

/**
 * Cambia el estado de un pedido desde el panel admin.
 *
 * Flujo: requireAdmin → UPDATE orders.status (el trigger DB registra el evento
 * en el timeline + setea paid_at/shipped_at/delivered_at) → (opcional) adjunta
 * la nota al evento recién creado → manda email al cliente si el estado es
 * notificable. El email es best-effort: si falla, el cambio de estado YA quedó
 * persistido y no se revierte.
 */
export async function updateOrderStatusAction(input: {
  orderId: string;
  newStatus: OrderStatus;
  note?: string;
}): Promise<UpdateStatusResult> {
  await requireAdmin();

  const { orderId, newStatus } = input;
  const note = input.note?.trim() || null;

  if (!VALID_STATUSES.includes(newStatus)) {
    return { ok: false, error: `Estado inválido: ${newStatus}` };
  }

  const supabase = createAdminClient();

  // Estado actual + datos para el email (en una sola lectura).
  const { data: current, error: readErr } = await supabase
    .from('orders')
    .select(
      'status, order_number, customer_name, customer_email, tracking_number',
    )
    .eq('id', orderId)
    .maybeSingle();

  if (readErr || !current) {
    return { ok: false, error: 'No se encontró el pedido.' };
  }

  // No-op: el trigger no registra evento si el status no cambia.
  if (current.status === newStatus && !note) {
    return { ok: true, noop: true, emailed: false };
  }

  const { error: updateErr } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (updateErr) {
    return { ok: false, error: `No se pudo actualizar: ${updateErr.message}` };
  }

  // Adjuntar la nota al evento recién creado por el trigger (si la hay). El
  // trigger inserta el evento con note NULL; parcheamos el más reciente de
  // ese status para este pedido.
  if (note) {
    const { data: lastEvent } = await supabase
      .from('order_status_events')
      .select('id')
      .eq('order_id', orderId)
      .eq('status', newStatus)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastEvent) {
      await supabase
        .from('order_status_events')
        .update({ note })
        .eq('id', lastEvent.id);
    }
  }

  // Email al cliente (best-effort) para estados notificables.
  let emailed = false;
  let emailError: string | undefined;
  if (
    shouldNotifyCustomer(newStatus) &&
    current.status !== newStatus &&
    current.customer_email
  ) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? '';
    const result = await sendOrderStatusUpdateToCustomer({
      to: current.customer_email,
      data: {
        orderNumber: current.order_number,
        customerName: current.customer_name,
        status: newStatus as
          | 'preparing'
          | 'reviewed'
          | 'shipped'
          | 'delivered',
        trackingNumber: current.tracking_number,
        note,
        orderUrl: siteUrl ? `${siteUrl}/mi-cuenta/pedidos/${orderId}` : null,
      },
    });
    emailed = result.ok;
    if (!result.ok) emailError = result.error;
  }

  revalidatePath('/admin/pedidos');
  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath(`/mi-cuenta/pedidos/${orderId}`);

  return { ok: true, emailed, emailError };
}
