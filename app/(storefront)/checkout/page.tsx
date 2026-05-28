import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { CheckoutPage } from '@/components/checkout/checkout-page';
import { requireAuth } from '@/lib/auth/server';
import { readCartCookie } from '@/lib/cart/cookie';
import { resolveCart } from '@/lib/cart/queries';
import { fetchUserAddresses } from '@/lib/addresses/queries';
import { calculateShipping } from '@/lib/shipping';
import { isCheckoutEnabled } from '@/lib/features';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Finalizar compra | Óptica Carballo' },
  robots: { index: false, follow: false },
};

export default async function Page() {
  // Feature flag — si está OFF, /checkout no existe.
  if (!isCheckoutEnabled()) notFound();

  await requireAuth('/checkout');

  const cart = await readCartCookie();
  const resolved = await resolveCart(cart);

  // Cart vacío o con issues → volver al carrito.
  if (resolved.items.length === 0 || resolved.hasIssues) {
    redirect('/carrito');
  }

  const addresses = await fetchUserAddresses();

  // Provincia tentativa para la cotización: la default del user, o la
  // primera. Si no hay addresses, usamos una zona conservadora (peor caso)
  // para mostrar algo en el resumen mientras el user crea la primera.
  const defaultAddress =
    addresses.find((a) => a.is_default) ?? addresses[0] ?? null;
  const shipping = calculateShipping({
    subtotalCents: resolved.subtotalCents,
    provinceName: defaultAddress?.province ?? 'Buenos Aires',
  });

  return (
    <CheckoutPage cart={resolved} addresses={addresses} shipping={shipping} />
  );
}
