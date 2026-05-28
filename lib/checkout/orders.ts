import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ResolvedCart } from '@/lib/cart/types';
import type { Address } from '@/lib/addresses/types';
import type { ShippingQuote } from '@/lib/shipping';

/**
 * Crea la orden en DB con snapshots inmutables (ADR-007).
 *
 * Pre-requisitos del caller (server action):
 *   1. `cart` ya fue resuelto contra DB y `hasIssues === false`.
 *   2. `address` pertenece al `userId` (validado por RLS al fetcharla).
 *   3. `shipping` fue calculado con `lib/shipping.ts`.
 *   4. **NO** se llamó `reserve_stock` todavía — esta función lo hace.
 *
 * Flow:
 *   1. RPC `reserve_stock(items)` — atómico, falla todo o decrementa todo.
 *   2. INSERT en `orders` con snapshots de address + totales.
 *   3. INSERT en `order_items` por cada item del cart con snapshots.
 *   4. Si cualquier INSERT falla, revertimos stock manualmente sumando
 *      las quantities de vuelta (compensación). NO es transaccional con
 *      el INSERT — V1 acepta este riesgo (volumen 5-20/mes; logs alertan).
 *
 * Devuelve `{ ok: true, orderId, orderNumber }` o `{ ok: false, error }`.
 * El `orderNumber` viene del trigger `set_order_number` (migración 00003).
 */
export type CreateOrderResult =
  | { ok: true; orderId: string; orderNumber: string }
  | { ok: false; error: string };

export async function createOrderFromCart(args: {
  userId: string;
  userEmail: string;
  customerName: string;
  cart: ResolvedCart;
  address: Address;
  shipping: ShippingQuote;
}): Promise<CreateOrderResult> {
  const { userId, userEmail, customerName, cart, address, shipping } = args;

  if (cart.items.length === 0) {
    return { ok: false, error: 'El carrito está vacío.' };
  }
  if (cart.hasIssues) {
    return {
      ok: false,
      error: 'Hay items con problemas. Resolvélos antes de continuar.',
    };
  }

  const supabase = createAdminClient();

  // ===== 1. Reservar stock atómicamente =====
  const reserveItems = cart.items.map((it) => ({
    variant_id: it.variantId,
    quantity: it.quantity,
  }));
  const { error: reserveError } = await supabase.rpc('reserve_stock', {
    p_items: reserveItems,
  });
  if (reserveError) {
    return {
      ok: false,
      error: `No pudimos reservar el stock. ${reserveError.message}`,
    };
  }

  // ===== 2. INSERT orders =====
  const totalCents = cart.subtotalCents + shipping.cents;

  const { data: orderRow, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      status: 'pending',
      customer_name: customerName,
      customer_email: userEmail,
      customer_phone: address.phone,
      shipping_recipient_name: address.recipient_name,
      shipping_street: address.street,
      shipping_number: address.number,
      shipping_apartment: address.apartment,
      shipping_city: address.city,
      shipping_province: address.province,
      shipping_postal_code: address.postal_code,
      shipping_country: address.country,
      shipping_phone: address.phone,
      shipping_address_id: address.id,
      subtotal_cents: cart.subtotalCents,
      shipping_cents: shipping.cents,
      discount_cents: 0,
      total_cents: totalCents,
      shipping_method: shipping.zone,
      notes: `Zona: ${shipping.zoneLabel}${shipping.isFree ? ' · Envío gratis' : ''}`,
    })
    .select('id, order_number')
    .single();

  if (orderError || !orderRow) {
    await revertStock(reserveItems);
    return {
      ok: false,
      error: `No pudimos crear la orden. ${orderError?.message ?? ''}`.trim(),
    };
  }

  // ===== 3. INSERT order_items =====
  const itemsToInsert = cart.items.map((it) => ({
    order_id: orderRow.id,
    product_id: it.product.id || null,
    variant_id: it.variantId,
    product_name: it.product.name,
    product_slug: it.product.slug,
    variant_sku: it.variant.sku,
    variant_attributes: it.variant.attributes,
    quantity: it.quantity,
    unit_price_cents: it.variant.priceCents,
    line_total_cents: it.variant.priceCents * it.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsToInsert);

  if (itemsError) {
    await supabase.from('orders').delete().eq('id', orderRow.id);
    await revertStock(reserveItems);
    return {
      ok: false,
      error: `No pudimos guardar los items. ${itemsError.message}`,
    };
  }

  return {
    ok: true,
    orderId: orderRow.id,
    orderNumber: orderRow.order_number,
  };
}

/**
 * Actualiza la order con el `mp_preference_id` post-creación de preference.
 * Best-effort — si falla, la order sigue válida y el founder puede
 * crear la preference manualmente desde el panel MP.
 */
export async function updateOrderMpPreference(args: {
  orderId: string;
  preferenceId: string;
}): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from('orders')
    .update({ mp_preference_id: args.preferenceId, payment_method: 'mercadopago' })
    .eq('id', args.orderId);
}

/**
 * Compensación: re-incrementa stock cuando una operación posterior a
 * `reserve_stock` falla. Best-effort — si esta compensación también
 * falla, queda inconsistencia que requiere intervención manual.
 * Aceptable en V1 (volumen bajo + alertas en logs).
 */
async function revertStock(
  items: Array<{ variant_id: string; quantity: number }>,
): Promise<void> {
  const supabase = createAdminClient();
  for (const it of items) {
    await supabase.rpc('increment_variant_stock', {
      p_variant_id: it.variant_id,
      p_amount: it.quantity,
    });
  }
}
