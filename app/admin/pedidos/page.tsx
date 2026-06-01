import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/admin';
import { fetchAllOrders } from '@/lib/orders/admin-queries';
import { OrderStatusBadge } from '@/components/account/order-status-badge';
import { formatPriceCents } from '@/lib/format/currency';
import { formatOrderDate } from '@/lib/orders/labels';

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
            : `${orders.length} pedido${orders.length === 1 ? '' : 's'}. Entrá a uno para cambiar su estado.`}
        </p>
      </header>

      {orders.length > 0 && (
        <ul className="border-border divide-border divide-y overflow-hidden rounded-lg border">
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/admin/pedidos/${o.id}`}
                className="flex flex-col gap-2 px-4 py-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-mono text-sm font-semibold">
                      {o.orderNumber}
                    </span>
                    <OrderStatusBadge status={o.status} />
                  </div>
                  <p className="text-muted-foreground mt-1 truncate text-xs">
                    {o.customerName} · {o.customerEmail}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {formatOrderDate(o.createdAt)} ·{' '}
                    {o.itemCount} {o.itemCount === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-foreground font-semibold tabular-nums">
                    {formatPriceCents(o.totalCents)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
