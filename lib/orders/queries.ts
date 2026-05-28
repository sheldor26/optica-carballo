import 'server-only';
import { createClient } from '@/lib/supabase/server';
import type {
  OrderDetail,
  OrderItem,
  OrderListItem,
  OrderStatus,
} from './types';

/**
 * Lista de pedidos del user actual (RLS auto-filtra por `user_id = auth.uid()`).
 * Devuelve solo info necesaria para la cardlist — sin items, sin address
 * detallada. Para detalle: `fetchOrderById`.
 */
export async function fetchUserOrders(): Promise<OrderListItem[]> {
  const supabase = await createClient();

  // 1 query a orders + 1 a order_items para contar (evitamos N+1 con un
  // agregado en JS — para volumen bajo es OK).
  const { data: ordersRows } = await supabase
    .from('orders')
    .select(
      'id, order_number, status, total_cents, created_at, paid_at',
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
    countByOrder.set(it.order_id, (countByOrder.get(it.order_id) ?? 0) + it.quantity);
  }

  return ordersRows.map((row) => ({
    id: row.id,
    orderNumber: row.order_number,
    status: row.status as OrderStatus,
    totalCents: row.total_cents,
    itemCount: countByOrder.get(row.id) ?? 0,
    createdAt: row.created_at,
    paidAt: row.paid_at,
  }));
}

/**
 * Detalle completo de una order (con items). RLS bloquea acceso a orders
 * de otros users — devuelve null si no es del user actual o no existe.
 */
export async function fetchOrderById(
  id: string,
): Promise<OrderDetail | null> {
  const supabase = await createClient();

  const { data: orderRow } = await supabase
    .from('orders')
    .select(
      `id, order_number, status, payment_status,
       subtotal_cents, shipping_cents, discount_cents, total_cents,
       customer_name, customer_email, customer_phone,
       shipping_recipient_name, shipping_street, shipping_number,
       shipping_apartment, shipping_city, shipping_province,
       shipping_postal_code, shipping_phone, shipping_method,
       tracking_number, mp_payment_id, invoice_url, notes,
       created_at, paid_at, shipped_at, delivered_at`,
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
    shippingRecipientName: orderRow.shipping_recipient_name,
    shippingStreet: orderRow.shipping_street,
    shippingNumber: orderRow.shipping_number,
    shippingApartment: orderRow.shipping_apartment,
    shippingCity: orderRow.shipping_city,
    shippingProvince: orderRow.shipping_province,
    shippingPostalCode: orderRow.shipping_postal_code,
    shippingPhone: orderRow.shipping_phone,
    shippingMethod: orderRow.shipping_method,
    trackingNumber: orderRow.tracking_number,
    mpPaymentId: orderRow.mp_payment_id,
    invoiceUrl: orderRow.invoice_url,
    notes: orderRow.notes,
    createdAt: orderRow.created_at,
    paidAt: orderRow.paid_at,
    shippedAt: orderRow.shipped_at,
    deliveredAt: orderRow.delivered_at,
    items,
  };
}
