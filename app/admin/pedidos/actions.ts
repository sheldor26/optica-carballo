'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  sendOrderStatusUpdateToCustomer,
  sendInvoiceToCustomer,
} from '@/lib/emails/send-order-emails';
import { shouldNotifyCustomer } from '@/lib/orders/email-policy';
import { fetchOrderByIdAdmin } from '@/lib/orders/admin-queries';
import { canGenerateShipment } from '@/lib/orders/order-status';
import { releaseOrderStock } from '@/lib/checkout/orders';
import { importShipment, type ImportShipmentInput } from '@/lib/correo/import';
import { DEFAULT_PACKAGE, EXTRA_ITEM_WEIGHT } from '@/lib/correo/constants';
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
  trackingNumber?: string;
}): Promise<UpdateStatusResult> {
  await requireAdmin();

  const { orderId, newStatus } = input;
  const note = input.note?.trim() || null;
  const newTracking = input.trackingNumber?.trim() || null;

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

  // No-op: nada que cambiar (mismo status, sin nota, sin tracking nuevo).
  if (current.status === newStatus && !note && !newTracking) {
    return { ok: true, noop: true, emailed: false };
  }

  const { error: updateErr } = await supabase
    .from('orders')
    .update({
      status: newStatus,
      ...(newTracking ? { tracking_number: newTracking } : {}),
    })
    .eq('id', orderId);

  if (updateErr) {
    return { ok: false, error: `No se pudo actualizar: ${updateErr.message}` };
  }

  // Reintegro de stock al CANCELAR (solo en la transición a 'cancelled', no si
  // ya estaba cancelado). Idempotente vía stock_released_at — devuelve la base
  // y empuja a ML. Best-effort: si fallara, no revertimos el cambio de estado.
  if (newStatus === 'cancelled' && current.status !== 'cancelled') {
    await releaseOrderStock(orderId);
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
        trackingNumber: newTracking ?? current.tracking_number,
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

export type GenerateShipmentResult =
  | { ok: true; createdAt: string; alreadyImported?: boolean }
  | { ok: false; error: string };

/**
 * Da de alta el envío del pedido en MiCorreo (`/shipping/import`).
 * Idempotente: `extOrderId` = order.id → si ya se importó, Correo lo rechaza y
 * lo tratamos como éxito (`alreadyImported`).
 *
 * ⚠️ Genera un envío REAL en Correo (preimposición). El nº de tracking NO lo
 * devuelve la API: se copia del panel MiCorreo y se carga al marcar "enviado".
 */
/**
 * Core de alta de envío para UNA orden (sin requireAdmin ni revalidate — eso lo
 * maneja el caller). Setea `shipment_imported_at` cuando el alta entra. Lo usan
 * la acción individual y la de lote.
 */
async function generateShipmentForOrder(
  orderId: string,
): Promise<GenerateShipmentResult> {
  const order = await fetchOrderByIdAdmin(orderId);
  if (!order) return { ok: false, error: 'No se encontró el pedido.' };

  if (order.shippingMethod === 'pickup') {
    return {
      ok: false,
      error: 'Retiro en local — no requiere envío por Correo.',
    };
  }

  if (!canGenerateShipment(order.status)) {
    return {
      ok: false,
      error:
        order.status === 'refunded'
          ? 'Pedido reembolsado — no se genera envío.'
          : 'Pedido cancelado — no se genera envío.',
    };
  }

  const deliveryType: 'D' | 'S' =
    order.shippingDeliveryType === 'S' || order.shippingMethod === 'branch'
      ? 'S'
      : 'D';

  const totalQty = order.items.reduce((sum, it) => sum + it.quantity, 0);
  const weightGrams =
    DEFAULT_PACKAGE.weight + Math.max(0, totalQty - 1) * EXTRA_ITEM_WEIGHT;

  const base = {
    extOrderId: order.id,
    orderNumber: order.orderNumber,
    recipient: {
      name: order.shippingRecipientName ?? order.customerName,
      email: order.customerEmail,
      phone: order.shippingPhone ?? order.customerPhone ?? undefined,
    },
    weightGrams,
    declaredValueArs: Math.round(order.totalCents / 100),
    dims: {
      height: DEFAULT_PACKAGE.height,
      width: DEFAULT_PACKAGE.width,
      length: DEFAULT_PACKAGE.length,
    },
  };

  let input: ImportShipmentInput;
  if (deliveryType === 'S') {
    if (!order.shippingAgencyCode) {
      return { ok: false, error: 'Falta el código de sucursal del pedido.' };
    }
    input = { ...base, deliveryType: 'S', agencyCode: order.shippingAgencyCode };
  } else {
    if (
      !order.shippingStreet ||
      !order.shippingCity ||
      !order.shippingProvince ||
      !order.shippingPostalCode
    ) {
      return {
        ok: false,
        error: 'Faltan datos de la dirección de envío del pedido.',
      };
    }
    input = {
      ...base,
      deliveryType: 'D',
      address: {
        streetName: order.shippingStreet,
        streetNumber: order.shippingNumber ?? 's/n',
        apartment: order.shippingApartment,
        city: order.shippingCity,
        provinceName: order.shippingProvince,
        postalCode: order.shippingPostalCode,
      },
    };
  }

  const result = await importShipment(input);
  if (!result.ok) return { ok: false, error: result.error };

  // Marca persistente "envío generado" (claim sobre shipment_imported_at: solo
  // setea si estaba en null → conserva la fecha del primer alta, idempotente).
  const supabase = createAdminClient();
  await supabase
    .from('orders')
    .update({ shipment_imported_at: new Date().toISOString() })
    .eq('id', orderId)
    .is('shipment_imported_at', null);

  return {
    ok: true,
    createdAt: result.createdAt,
    alreadyImported: result.alreadyImported,
  };
}

/** Alta de envío de UN pedido (botón individual del detalle). */
export async function generateShipmentAction(
  orderId: string,
): Promise<GenerateShipmentResult> {
  await requireAdmin();
  const result = await generateShipmentForOrder(orderId);
  revalidatePath('/admin/pedidos');
  revalidatePath(`/admin/pedidos/${orderId}`);
  return result;
}

export type BulkShipmentItemResult = {
  orderId: string;
  ok: boolean;
  alreadyImported?: boolean;
  error?: string;
};

export type BulkShipmentResult = {
  ok: true;
  results: BulkShipmentItemResult[];
  generated: number;
  already: number;
  failed: number;
};

/**
 * Alta de envío EN LOTE para varios pedidos (selección múltiple del panel).
 * Procesa SECUENCIAL (no saturar la API de Correo) y devuelve el resultado por
 * pedido. Cada alta es idempotente por `extOrderId` → re-correr no duplica.
 */
export async function generateShipmentsBulkAction(
  orderIds: string[],
): Promise<BulkShipmentResult> {
  await requireAdmin();

  const unique = Array.from(new Set(orderIds)).slice(0, 100);
  const results: BulkShipmentItemResult[] = [];

  for (const orderId of unique) {
    const r = await generateShipmentForOrder(orderId);
    results.push(
      r.ok
        ? { orderId, ok: true, alreadyImported: r.alreadyImported }
        : { orderId, ok: false, error: r.error },
    );
  }

  revalidatePath('/admin/pedidos');

  const generated = results.filter((r) => r.ok && !r.alreadyImported).length;
  const already = results.filter((r) => r.ok && r.alreadyImported).length;
  const failed = results.filter((r) => !r.ok).length;

  return { ok: true, results, generated, already, failed };
}

export type SetInvoiceResult =
  | { ok: true; emailed: boolean; emailError?: string; cleared?: boolean }
  | { ok: false; error: string };

/**
 * Carga (o quita) el link de la factura de un pedido y, opcionalmente, le avisa
 * al cliente por mail. El link queda en `orders.invoice_url` → el cliente lo ve
 * como "Ver factura" en su cuenta. V1 por LINK (no subimos el PDF). El link debe
 * ser accesible por el cliente (ej. URL de Tusfacturas/AFIP o Drive).
 */
export async function setOrderInvoiceAction(input: {
  orderId: string;
  invoiceUrl: string;
  notify: boolean;
}): Promise<SetInvoiceResult> {
  await requireAdmin();

  const url = input.invoiceUrl.trim();
  if (url && !/^https?:\/\/.+/i.test(url)) {
    return {
      ok: false,
      error: 'La URL debe empezar con http:// o https://',
    };
  }

  const supabase = createAdminClient();

  const { data: current, error: readErr } = await supabase
    .from('orders')
    .select('order_number, customer_name, customer_email')
    .eq('id', input.orderId)
    .maybeSingle();

  if (readErr || !current) {
    return { ok: false, error: 'No se encontró el pedido.' };
  }

  const { error: updErr } = await supabase
    .from('orders')
    .update({ invoice_url: url || null })
    .eq('id', input.orderId);

  if (updErr) {
    return { ok: false, error: `No se pudo guardar: ${updErr.message}` };
  }

  let emailed = false;
  let emailError: string | undefined;
  if (input.notify && url && current.customer_email) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? '';
    const res = await sendInvoiceToCustomer({
      to: current.customer_email,
      customerName: current.customer_name,
      orderNumber: current.order_number,
      invoiceUrl: url,
      orderUrl: siteUrl ? `${siteUrl}/mi-cuenta/pedidos/${input.orderId}` : null,
    });
    emailed = res.ok;
    if (!res.ok) emailError = res.error;
  }

  revalidatePath('/admin/pedidos');
  revalidatePath(`/admin/pedidos/${input.orderId}`);
  revalidatePath(`/mi-cuenta/pedidos/${input.orderId}`);

  return { ok: true, emailed, emailError, cleared: !url };
}
