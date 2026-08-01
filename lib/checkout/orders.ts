import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ResolvedCart } from '@/lib/cart/types';
import type { Address } from '@/lib/addresses/types';
import type { ShippingMethod, ShippingQuote } from '@/lib/shipping';
import type { PrescriptionCookie } from '@/lib/prescription-cookie/types';
import {
  cartRequiresPrescription,
  prescriptionInsertFromCookie,
} from './prescription';

/**
 * Crea la orden en DB con snapshots inmutables (ADR-007) — TODO en una sola
 * transacción atómica vía la RPC `create_order_from_cart` (migración
 * `20260801143222`, hallazgo #8 del audit 2026-08-01).
 *
 * Antes esto era 4-5 round-trips JS separados (reserve_stock → INSERT
 * prescriptions → INSERT orders → INSERT order_items → INSERT
 * coupon_redemptions) con compensación manual (`revertStock`) si algo
 * fallaba a mitad de camino. Un crash de Node entre pasos podía dejar stock
 * decrementado sin orden asociada, sin forma de auto-corregirse. Ahora es
 * UN solo `rpc()`: si cualquier paso falla server-side, Postgres revierte
 * TODO (no puede quedar un estado a mitad de camino), y `idempotencyKey`
 * evita duplicar la orden si el cliente reintenta el mismo submit.
 *
 * Pre-requisitos del caller (server action):
 *   1. `cart` ya fue resuelto contra DB y `hasIssues === false`.
 *   2. `address` pertenece al `userId` (validado por RLS al fetcharla).
 *   3. `shipping` fue calculado con `lib/shipping.ts`.
 *   4. Si `cartRequiresPrescription(cart)` es `true`, el caller YA validó
 *      que `prescription` no es null (hallazgo #6, audit 2026-08-01).
 *   5. `idempotencyKey` es estable entre reintentos del MISMO submit
 *      (generado una vez al montar `/checkout`, no en cada request).
 *
 * Devuelve `{ ok: true, orderId, orderNumber }` o `{ ok: false, error }`.
 */
export type CreateOrderResult =
  | { ok: true; orderId: string; orderNumber: string }
  | { ok: false; error: string };

type CreateOrderFromCartRpcResult = {
  id: string;
  order_number: string;
  replay: boolean;
};

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
  /** Receta de la cookie firmada. Requerida (no-null) si
   * `cartRequiresPrescription(cart)` — el caller valida eso antes de llamar. */
  prescription?: PrescriptionCookie | null;
  /** UUID estable por intento de checkout — ver doc de la función. */
  idempotencyKey: string;
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
    prescription = null,
    idempotencyKey,
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
  if (cartRequiresPrescription(cart) && !prescription) {
    return {
      ok: false,
      error: 'Necesitás cargar tu receta antes de confirmar el pedido.',
    };
  }

  const supabase = createAdminClient();

  const reserveItems = cart.items.map((it) => ({
    variant_id: it.variantId,
    quantity: it.quantity,
  }));

  const discountCents = cart.coupon?.discountCents ?? 0;
  const effectiveShippingCents = cart.coupon?.removeShipping ? 0 : shipping.cents;
  const totalCents = Math.max(
    0,
    cart.subtotalCents - discountCents + effectiveShippingCents,
  );

  const orderPayload = {
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
  };

  const itemsPayload = cart.items.map((it) => ({
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

  const { data, error } = await supabase.rpc('create_order_from_cart', {
    p_user_id: userId,
    p_idempotency_key: idempotencyKey,
    p_reserve_items: reserveItems,
    p_order: orderPayload,
    p_items: itemsPayload,
    p_prescription: prescription ? prescriptionInsertFromCookie(prescription) : null,
  });

  if (error || !data) {
    // No filtrar el mensaje crudo de Postgres al cliente. El caso típico es que
    // un producto se quedó sin stock entre que se armó el carrito y se confirmó
    // (carrera con otra compra / ML). Mensaje claro y accionable.
    const insufficient = /insuficiente|stock|existe|inactiv/i.test(
      error?.message ?? '',
    );
    return {
      ok: false,
      error: insufficient
        ? 'Uno de los productos se quedó sin stock mientras comprabas. Revisá tu carrito e intentá de nuevo.'
        : `No pudimos crear la orden. ${error?.message ?? ''}`.trim(),
    };
  }

  const result = data as CreateOrderFromCartRpcResult;

  // Sync stock outbound a ML (best-effort, no bloquea checkout) — solo si
  // NO es un replay (un replay no tocó stock, ya se hizo en el intento
  // original). Errors quedan en marketplace_sync_errors; el cron de
  // reconcile corrige drift.
  if (!result.replay) {
    void syncStockOutboundForVariants(reserveItems.map((it) => it.variant_id));
  }

  return {
    ok: true,
    orderId: result.id,
    orderNumber: result.order_number,
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
 * ante una cancelación — camino independiente de la RPC de creación).
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
