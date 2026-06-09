import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ResolvedCart } from '@/lib/cart/types';
import type { Address } from '@/lib/addresses/types';
import type { ShippingMethod, ShippingQuote } from '@/lib/shipping';

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
  customerPhone?: string | null;
  cart: ResolvedCart;
  /** null cuando shippingMethod === 'pickup' (retiro en local sin envío). */
  address: Address | null;
  shipping: ShippingQuote;
  /** Método de negocio: 'delivery' | 'branch' | 'pickup'. */
  shippingMethod: ShippingMethod;
  /** Tipo MiCorreo: 'D' domicilio, 'S' sucursal, null pickup/sin API. */
  deliveryType?: 'D' | 'S' | null;
  /** Código de sucursal del Correo elegida (cuando branch). */
  agencyCode?: string | null;
  /** Snapshot del nombre de la sucursal (ADR-007). */
  agencyName?: string | null;
}): Promise<CreateOrderResult> {
  const {
    userId,
    userEmail,
    customerName,
    customerPhone,
    cart,
    address,
    shipping,
    shippingMethod,
    deliveryType = null,
    agencyCode = null,
    agencyName = null,
  } = args;
  const isPickup = shippingMethod === 'pickup';
  const isBranch = shippingMethod === 'branch';

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

  // ===== 1.5. Sync stock outbound a ML (best-effort, no bloquea checkout) =====
  // Reserva exitosa → bajar stock en ML para no oversell allá.
  // Errors quedan en marketplace_sync_errors; el cron de reconcile corrige drift.
  void syncStockOutboundForVariants(reserveItems.map((it) => it.variant_id));

  // ===== 2. INSERT orders =====
  const discountCents = cart.coupon?.discountCents ?? 0;
  const effectiveShippingCents = cart.coupon?.removeShipping ? 0 : shipping.cents;
  const totalCents = Math.max(
    0,
    cart.subtotalCents - discountCents + effectiveShippingCents,
  );

  const { data: orderRow, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      status: 'pending',
      customer_name: customerName,
      customer_email: userEmail,
      customer_phone: address?.phone ?? customerPhone ?? null,
      shipping_recipient_name: address?.recipient_name ?? null,
      shipping_street: address?.street ?? null,
      shipping_number: address?.number ?? null,
      shipping_apartment: address?.apartment ?? null,
      shipping_city: address?.city ?? null,
      shipping_province: address?.province ?? null,
      shipping_postal_code: address?.postal_code ?? null,
      shipping_country: address?.country ?? null,
      shipping_phone: address?.phone ?? null,
      shipping_address_id: address?.id ?? null,
      subtotal_cents: cart.subtotalCents,
      shipping_cents: effectiveShippingCents,
      discount_cents: discountCents,
      total_cents: totalCents,
      shipping_method: shippingMethod,
      shipping_delivery_type: deliveryType,
      shipping_agency_code: agencyCode,
      shipping_agency_name: agencyName,
      coupon_id: cart.coupon?.id ?? null,
      coupon_code: cart.coupon?.code ?? null,
      notes: isPickup
        ? 'Retiro en local · Coordinar entrega por WhatsApp'
        : isBranch
          ? `Sucursal Correo: ${agencyName ?? agencyCode ?? '—'}${shipping.isFree ? ' · Envío gratis' : ''}`
          : `Zona: ${shipping.zoneLabel}${shipping.isFree ? ' · Envío gratis' : ''}`,
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
    brand_name: it.brand.name,
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

  // ===== 4. Registrar redemption del cupón =====
  // Best-effort: si falla, la order ya está creada y el descuento aplicado.
  // El cron diario podría reconciliar usage_count si fuera necesario.
  if (cart.coupon) {
    await supabase.from('coupon_redemptions').insert({
      coupon_id: cart.coupon.id,
      user_id: userId,
      order_id: orderRow.id,
      discount_cents: cart.coupon.discountCents,
    });
    await supabase.rpc('increment_coupon_usage', { p_coupon_id: cart.coupon.id });
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
  // Sync outbound del revert también (devolver stock a ML).
  void syncStockOutboundForVariants(items.map((it) => it.variant_id));
}

/**
 * Helper para sync outbound de N variantes después de un cambio de stock.
 * Best-effort — errors quedan en marketplace_sync_errors via syncVariantStockToML.
 * Lazy import para no bloquear módulo en tests / type-check sin env vars ML.
 */
async function syncStockOutboundForVariants(variantIds: string[]): Promise<void> {
  try {
    const { syncVariantStockToML } = await import(
      '@/lib/integrations/mercadolibre/sync-stock'
    );
    await Promise.all(variantIds.map((id) => syncVariantStockToML(id)));
  } catch (err) {
    console.error('[checkout] sync outbound ML falló', err);
  }
}

/**
 * Reintegra el stock de un pedido (en la base Y empujándolo a ML) cuando se
 * cancela. Reusa `increment_variant_stock` (el mismo camino que la compensación
 * de `createOrderFromCart`).
 *
 * **Idempotente**: hace un claim atómico sobre `orders.stock_released_at` —
 * setea la marca solo si estaba en NULL, y solo reintegra si ganó el claim. Así
 * cancelar/tocar el mismo pedido dos veces no infla el stock (clave porque
 * `increment_variant_stock` suma cada vez que se la llama).
 *
 * El caller debe llamar esto SOLO en la transición a 'cancelled' (no en
 * cualquier cambio de estado). Devuelve `{ released: false }` si ya estaba
 * liberado (o si el claim falló) — no es un error.
 */
export async function releaseOrderStock(
  orderId: string,
): Promise<{ released: boolean }> {
  const supabase = createAdminClient();

  // Claim atómico: solo libera si nunca se liberó.
  const { data: claimed, error: claimErr } = await supabase
    .from('orders')
    .update({ stock_released_at: new Date().toISOString() })
    .eq('id', orderId)
    .is('stock_released_at', null)
    .select('id')
    .maybeSingle();

  if (claimErr || !claimed) {
    return { released: false };
  }

  const { data: items, error: itemsErr } = await supabase
    .from('order_items')
    .select('variant_id, quantity')
    .eq('order_id', orderId);

  if (itemsErr) {
    console.error('[checkout] releaseOrderStock: no se pudieron leer items', itemsErr);
    return { released: false };
  }

  const valid = (items ?? []).filter(
    (it): it is { variant_id: string; quantity: number } =>
      Boolean(it.variant_id) && it.quantity > 0,
  );

  for (const it of valid) {
    const { error } = await supabase.rpc('increment_variant_stock', {
      p_variant_id: it.variant_id,
      p_amount: it.quantity,
    });
    if (error) {
      console.error(
        `[checkout] releaseOrderStock: increment falló (variant ${it.variant_id})`,
        error,
      );
    }
  }

  // Devolver el stock a ML también (best-effort; el reconcile corrige drift).
  void syncStockOutboundForVariants(valid.map((it) => it.variant_id));

  return { released: true };
}
