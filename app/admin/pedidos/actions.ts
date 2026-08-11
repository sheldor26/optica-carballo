'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/admin';
import { applyOrderInvoice, type SetInvoiceResult } from '@/lib/orders/set-invoice';
import {
  cambiarEstadoDePedido,
  generarEnvioDePedido,
  type GenerateShipmentResult,
  type UpdateStatusResult,
} from '@/lib/orders/operaciones';
import type { OrderStatus } from '@/lib/orders/types';

export type { UpdateStatusResult, GenerateShipmentResult };

/**
 * Cambia el estado de un pedido desde el panel admin.
 *
 * Flujo: requireAdmin → UPDATE orders.status (el trigger DB registra el evento
 * en el timeline + setea paid_at/shipped_at/delivered_at) → (opcional) adjunta
 * la nota al evento recién creado → manda email al cliente si el estado es
 * notificable. El email es best-effort: si falla, el cambio de estado YA quedó
 * persistido y no se revierte.
 */
/**
 * Cambia el estado de un pedido desde el panel admin.
 *
 * La lógica vive en `lib/orders/operaciones.ts`, que comparte con las
 * direcciones que usa OptiSys. Acá quedan las dos cosas propias del panel: la
 * verificación de admin y refrescar las pantallas.
 */
export async function updateOrderStatusAction(input: {
  orderId: string;
  newStatus: OrderStatus;
  note?: string;
  trackingNumber?: string;
}): Promise<UpdateStatusResult> {
  await requireAdmin();

  const result = await cambiarEstadoDePedido(input);

  revalidatePath('/admin/pedidos');
  revalidatePath(`/admin/pedidos/${input.orderId}`);
  revalidatePath(`/mi-cuenta/pedidos/${input.orderId}`);

  return result;
}

/** Alta de envío de UN pedido (botón individual del detalle). */
export async function generateShipmentAction(
  orderId: string,
): Promise<GenerateShipmentResult> {
  await requireAdmin();
  const result = await generarEnvioDePedido(orderId);
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
    const r = await generarEnvioDePedido(orderId);
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

export type { SetInvoiceResult };

/**
 * Carga (o quita) el link de la factura de un pedido y, opcionalmente, le avisa
 * al cliente por mail. El link queda en `orders.invoice_url` → el cliente lo ve
 * como "Ver factura" en su cuenta. V1 por LINK (no subimos el PDF). El link debe
 * ser accesible por el cliente (ej. URL de Tusfacturas/AFIP, Drive, o el bucket
 * público que sube el Facturador Óptica).
 *
 * Gate de humano (`requireAdmin`) + delega la lógica en `applyOrderInvoice`,
 * compartida con el endpoint interno que llama el Facturador Óptica — mismo
 * mail para el cliente sin importar quién cargó el link.
 */
export async function setOrderInvoiceAction(input: {
  orderId: string;
  invoiceUrl: string;
  notify: boolean;
}): Promise<SetInvoiceResult> {
  await requireAdmin();

  const result = await applyOrderInvoice(input);

  revalidatePath('/admin/pedidos');
  revalidatePath(`/admin/pedidos/${input.orderId}`);
  revalidatePath(`/mi-cuenta/pedidos/${input.orderId}`);

  return result;
}
