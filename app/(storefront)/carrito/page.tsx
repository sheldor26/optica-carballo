import type { Metadata } from 'next';
import { CartPage } from '@/components/cart/cart-page';
import { readCartCookie } from '@/lib/cart/cookie';
import { resolveCart } from '@/lib/cart/queries';
import { getCurrentUser } from '@/lib/auth/server';
import { fetchUserAddresses } from '@/lib/addresses/queries';
import { isCheckoutEnabled } from '@/lib/features';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tu carrito | Óptica Carballo',
  robots: { index: false, follow: false },
};

export default async function CarritoPage() {
  const cart = await readCartCookie();
  const user = await getCurrentUser();
  const resolved = await resolveCart(cart, { userId: user?.id ?? null });

  // Pre-cargar la dirección registrada del usuario en el estimador de envío.
  let defaultProvince: string | null = null;
  let defaultPostalCode: string | null = null;
  if (user) {
    const addresses = await fetchUserAddresses();
    const def = addresses.find((a) => a.is_default) ?? addresses[0] ?? null;
    defaultProvince = def?.province ?? null;
    defaultPostalCode = def?.postal_code ?? null;
  }

  return (
    <CartPage
      cart={resolved}
      checkoutEnabled={isCheckoutEnabled()}
      defaultProvince={defaultProvince}
      defaultPostalCode={defaultPostalCode}
    />
  );
}
