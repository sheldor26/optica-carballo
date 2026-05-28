import type { Metadata } from 'next';
import Link from 'next/link';
import { OrderList } from '@/components/account/order-list';
import { requireAuth } from '@/lib/auth/server';
import { fetchUserOrders } from '@/lib/orders/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Mis pedidos | Óptica Carballo' },
  robots: { index: false, follow: false },
};

export default async function Page() {
  await requireAuth('/mi-cuenta/pedidos');
  const orders = await fetchUserOrders();

  return (
    <main className="container max-w-3xl py-8 md:py-12">
      <header className="mb-6">
        <p className="text-muted-foreground text-sm">
          <Link
            href="/mi-cuenta"
            className="hover:text-foreground underline-offset-2 hover:underline"
          >
            ← Volver a mi cuenta
          </Link>
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          Mis pedidos
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Historial de tus compras en Óptica Carballo.
        </p>
      </header>

      <OrderList orders={orders} />
    </main>
  );
}
