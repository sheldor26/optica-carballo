'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentProfile } from '@/lib/auth/server';
import { readCartCookie, deleteCartCookie } from '@/lib/cart/cookie';
import { resolveCart } from '@/lib/cart/queries';
import { fetchAddressById } from '@/lib/addresses/queries';
import { calculateShipping, pickupQuote } from '@/lib/shipping';
import { isCheckoutEnabled } from '@/lib/features';
import { createOrderFromCart, updateOrderMpPreference } from './orders';
import { createCheckoutPreference } from '@/lib/mp/preferences';
import { isMpTestMode } from '@/lib/mp/client';

export type CheckoutFormState = {
  ok: boolean;
  error?: string;
};

// Schema discriminated por shipping_method.
// - delivery: address_id obligatorio (UUID válido de address del user).
// - pickup: address_id opcional (no se valida); usa pickupQuote() en su lugar.
const inputSchema = z.discriminatedUnion('shipping_method', [
  z.object({
    shipping_method: z.literal('delivery'),
    address_id: z.uuid({ error: 'Elegí una dirección de envío.' }),
  }),
  z.object({
    shipping_method: z.literal('pickup'),
    address_id: z.string().optional(),
  }),
]);

export async function submitCheckout(
  _prev: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  if (!isCheckoutEnabled()) {
    return { ok: false, error: 'El checkout no está habilitado.' };
  }

  const rawMethod = formData.get('shipping_method');
  const parsed = inputSchema.safeParse({
    shipping_method: rawMethod === 'pickup' ? 'pickup' : 'delivery',
    address_id: formData.get('address_id') || undefined,
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Datos inválidos.',
    };
  }

  // Auth — el form solo se muestra en /checkout que ya requiere auth, pero
  // defendemos en server action por si llegan acá vía otra ruta.
  const profileData = await getCurrentProfile();
  if (!profileData) {
    return { ok: false, error: 'Iniciá sesión para continuar.' };
  }
  const { user, profile } = profileData;
  if (!user.email) {
    return { ok: false, error: 'Tu cuenta no tiene email asociado.' };
  }

  // Address: requerido para delivery, opcional para pickup.
  let address: Awaited<ReturnType<typeof fetchAddressById>> = null;
  if (parsed.data.shipping_method === 'delivery') {
    address = await fetchAddressById(parsed.data.address_id);
    if (!address) {
      return { ok: false, error: 'La dirección elegida no existe.' };
    }
  }

  // Cart — leer + resolver contra DB.
  const cart = await readCartCookie();
  const resolved = await resolveCart(cart);
  if (resolved.items.length === 0) {
    return { ok: false, error: 'Tu carrito está vacío.' };
  }
  if (resolved.hasIssues) {
    return {
      ok: false,
      error: 'Hay items con problemas en el carrito.',
    };
  }

  // Shipping: pickup siempre gratis, delivery según provincia.
  const shipping =
    parsed.data.shipping_method === 'pickup'
      ? pickupQuote()
      : calculateShipping({
          subtotalCents: resolved.subtotalCents,
          provinceName: address!.province,
        });

  const customerName =
    profile?.display_name?.trim() ||
    address?.recipient_name ||
    (user.email?.split('@')[0] ?? 'Cliente');

  const result = await createOrderFromCart({
    userId: user.id,
    userEmail: user.email,
    customerName,
    customerPhone: profile?.phone ?? null,
    cart: resolved,
    address,
    shipping,
  });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  // Crear preferencia MP. Si falla, la order queda en DB con estado
  // `pending` y el founder puede coordinarlo manual por WhatsApp.
  const preferenceResult = await createCheckoutPreference({
    orderNumber: result.orderNumber,
    payerEmail: user.email,
    cart: resolved,
    shipping,
  });

  if (!preferenceResult.ok) {
    // Limpiar cart (la order ya está creada) y avisar al user.
    await deleteCartCookie();
    revalidatePath('/carrito');
    revalidatePath('/mi-cuenta', 'layout');
    redirect(
      `/checkout/pendiente?order=${encodeURIComponent(result.orderNumber)}&mp_error=1`,
    );
  }

  // Guardar el preference_id en la order (best-effort; sin bloquear redirect).
  await updateOrderMpPreference({
    orderId: result.orderId,
    preferenceId: preferenceResult.preferenceId,
  });

  await deleteCartCookie();
  revalidatePath('/carrito');
  revalidatePath('/mi-cuenta', 'layout');

  // Redirect a MP. En modo test usamos sandbox_init_point; en prod, init_point.
  const checkoutUrl = isMpTestMode()
    ? preferenceResult.sandboxInitPoint
    : preferenceResult.initPoint;
  redirect(checkoutUrl);
}
