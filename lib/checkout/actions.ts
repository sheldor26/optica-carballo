'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentProfile } from '@/lib/auth/server';
import { readCartCookie, deleteCartCookie } from '@/lib/cart/cookie';
import { resolveCart } from '@/lib/cart/queries';
import { fetchAddressById } from '@/lib/addresses/queries';
import { calculateShipping } from '@/lib/shipping';
import { isCheckoutEnabled } from '@/lib/features';
import { createOrderFromCart } from './orders';

export type CheckoutFormState = {
  ok: boolean;
  error?: string;
};

const inputSchema = z.object({
  address_id: z.uuid({ error: 'Elegí una dirección de envío.' }),
});

export async function submitCheckout(
  _prev: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  if (!isCheckoutEnabled()) {
    return { ok: false, error: 'El checkout no está habilitado.' };
  }

  const parsed = inputSchema.safeParse({
    address_id: formData.get('address_id'),
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

  // Address — RLS limita a addresses del user actual; null si no es del user.
  const address = await fetchAddressById(parsed.data.address_id);
  if (!address) {
    return { ok: false, error: 'La dirección elegida no existe.' };
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

  // Shipping
  const shipping = calculateShipping({
    subtotalCents: resolved.subtotalCents,
    provinceName: address.province,
  });

  const customerName =
    profile?.display_name?.trim() ||
    address.recipient_name ||
    (user.email?.split('@')[0] ?? 'Cliente');

  const result = await createOrderFromCart({
    userId: user.id,
    userEmail: user.email,
    customerName,
    cart: resolved,
    address,
    shipping,
  });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  // Limpiar carrito post-orden creada.
  await deleteCartCookie();
  revalidatePath('/carrito');
  revalidatePath('/mi-cuenta', 'layout');

  // V1 — sin MP todavía. Redirigimos a una página de "orden creada,
  // pendiente de pago" que se reemplaza en sub-feature 2b parte 2
  // por el redirect a MP init_point.
  redirect(`/checkout/pendiente?order=${encodeURIComponent(result.orderNumber)}`);
}
