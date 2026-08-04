import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import type {
  OrderDetail,
  OrderItem,
  OrderStatus,
  OrderStatusEvent,
} from './types';

/**
 * Queries del panel admin de pedidos. Usan el cliente service-role
 * (`createAdminClient`) que BYPASSA RLS — por eso DEBEN llamarse únicamente
 * detrás de `requireAdmin()`. El service-role key vive solo en el server.
 *
 * Espejan las queries del cliente (`lib/orders/queries.ts`) pero sin el filtro
 * implícito de RLS `user_id = auth.uid()`: el admin ve TODOS los pedidos.
 */

export type AdminOrderListItem = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalCents: number;
  itemCount: number;
  customerName: string;
  customerEmail: string;
  createdAt: string; // ISO
  paidAt: string | null;
  /** 'delivery' | 'branch' | 'pickup' | null — pickup no genera envío. */
  shippingMethod: string | null;
  /** Alta del envío en MiCorreo. null = todavía no se generó. */
  shipmentImportedAt: string | null;
};

/** Lista de TODOS los pedidos (más recientes primero). */
export async function fetchAllOrders(): Promise<AdminOrderListItem[]> {
  const supabase = createAdminClient();

  const { data: ordersRows } = await supabase
    .from('orders')
    .select(
      'id, order_number, status, total_cents, customer_name, customer_email, created_at, paid_at, shipping_method, shipment_imported_at',
    )
    .order('created_at', { ascending: false });

  if (!ordersRows || ordersRows.length === 0) return [];

  const orderIds = ordersRows.map((o) => o.id);
  const { data: itemRows } = await supabase
    .from('order_items')
    .select('order_id, quantity')
    .in('order_id', orderIds);

  const countByOrder = new Map<string, number>();
  for (const it of itemRows ?? []) {
    countByOrder.set(
      it.order_id,
      (countByOrder.get(it.order_id) ?? 0) + it.quantity,
    );
  }

  return ordersRows.map((row) => ({
    id: row.id,
    orderNumber: row.order_number,
    status: row.status as OrderStatus,
    totalCents: row.total_cents,
    itemCount: countByOrder.get(row.id) ?? 0,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    createdAt: row.created_at,
    paidAt: row.paid_at,
    shippingMethod: row.shipping_method,
    shipmentImportedAt: row.shipment_imported_at,
  }));
}

/** Detalle completo de un pedido (cualquier cliente). null si no existe. */
export async function fetchOrderByIdAdmin(
  id: string,
): Promise<OrderDetail | null> {
  const supabase = createAdminClient();

  const { data: orderRow } = await supabase
    .from('orders')
    .select(
      `id, order_number, status, payment_status,
       subtotal_cents, shipping_cents, discount_cents, total_cents,
       customer_name, customer_email, customer_phone, customer_dni,
       shipping_recipient_name, shipping_street, shipping_number,
       shipping_apartment, shipping_city, shipping_province,
       shipping_postal_code, shipping_phone, shipping_method,
       shipping_delivery_type, shipping_agency_code, shipping_agency_name,
       tracking_number, mp_payment_id, invoice_url, notes,
       created_at, paid_at, shipped_at, delivered_at, shipment_imported_at`,
    )
    .eq('id', id)
    .maybeSingle();

  if (!orderRow) return null;

  const { data: itemRows } = await supabase
    .from('order_items')
    .select(
      'id, product_name, brand_name, product_slug, variant_sku, variant_attributes, quantity, unit_price_cents, line_total_cents',
    )
    .eq('order_id', id)
    .order('created_at', { ascending: true });

  const items: OrderItem[] = (itemRows ?? []).map((it) => ({
    id: it.id,
    productName: it.product_name,
    brandName: it.brand_name,
    productSlug: it.product_slug,
    variantSku: it.variant_sku,
    variantAttributes: (it.variant_attributes ?? {}) as Record<string, unknown>,
    quantity: it.quantity,
    unitPriceCents: it.unit_price_cents,
    lineTotalCents: it.line_total_cents,
  }));

  return {
    id: orderRow.id,
    orderNumber: orderRow.order_number,
    status: orderRow.status as OrderStatus,
    paymentStatus: orderRow.payment_status,
    subtotalCents: orderRow.subtotal_cents,
    shippingCents: orderRow.shipping_cents,
    discountCents: orderRow.discount_cents,
    totalCents: orderRow.total_cents,
    customerName: orderRow.customer_name,
    customerEmail: orderRow.customer_email,
    customerPhone: orderRow.customer_phone,
    customerDni: orderRow.customer_dni,
    shippingRecipientName: orderRow.shipping_recipient_name,
    shippingStreet: orderRow.shipping_street,
    shippingNumber: orderRow.shipping_number,
    shippingApartment: orderRow.shipping_apartment,
    shippingCity: orderRow.shipping_city,
    shippingProvince: orderRow.shipping_province,
    shippingPostalCode: orderRow.shipping_postal_code,
    shippingPhone: orderRow.shipping_phone,
    shippingMethod: orderRow.shipping_method,
    shippingDeliveryType: orderRow.shipping_delivery_type,
    shippingAgencyCode: orderRow.shipping_agency_code,
    shippingAgencyName: orderRow.shipping_agency_name,
    trackingNumber: orderRow.tracking_number,
    mpPaymentId: orderRow.mp_payment_id,
    invoiceUrl: orderRow.invoice_url,
    notes: orderRow.notes,
    createdAt: orderRow.created_at,
    paidAt: orderRow.paid_at,
    shippedAt: orderRow.shipped_at,
    deliveredAt: orderRow.delivered_at,
    shipmentImportedAt: orderRow.shipment_imported_at,
    items,
  };
}

/** Timeline de eventos de un pedido (ASC por fecha). */
export async function fetchOrderStatusEventsAdmin(
  orderId: string,
): Promise<OrderStatusEvent[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('order_status_events')
    .select('status, note, created_at')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });

  return (data ?? []).map((ev) => ({
    status: ev.status as OrderStatus,
    note: ev.note,
    createdAt: ev.created_at,
  }));
}
