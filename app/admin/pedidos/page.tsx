import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/admin';
import { fetchAllOrders } from '@/lib/orders/admin-queries';
import { OrdersAdminList } from '@/components/admin/orders-admin-list';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pedidos — Admin',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

/**
 * Panel admin de pedidos (Iter 2 del tracker). Gateado por `requireAdmin()`
 * — muestra PII de clientes. Layout propio (sin storefront header/footer).
 */
export default async function Page() {
  await requireAdmin();
  const orders = await fetchAllOrders();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 md:px-6">
      <header className="mb-8">
        <p className="text-brand text-xs font-medium uppercase tracking-[0.2em]">
          Panel interno
        </p>
        <h1 className="text-foreground mt-2 font-serif text-3xl font-medium tracking-tight md:text-4xl">
          Pedidos
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {orders.length === 0
            ? 'Todavía no hay pedidos.'
            : `${orders.length} pedido${orders.length === 1 ? '' : 's'}. Seleccioná varios para generar sus envíos en lote, o entrá a uno para ver el detalle.`}
        </p>
      </header>

      <OrdersAdminList orders={orders} />
    </main>
  );
}
