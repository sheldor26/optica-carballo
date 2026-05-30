import type { Metadata } from 'next';
import { CartPage } from '@/components/cart/cart-page';
import { readCartCookie } from '@/lib/cart/cookie';
import { resolveCart } from '@/lib/cart/queries';
import { getCurrentUser } from '@/lib/auth/server';
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
  return <CartPage cart={resolved} checkoutEnabled={isCheckoutEnabled()} />;
}
