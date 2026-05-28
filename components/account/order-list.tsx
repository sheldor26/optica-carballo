import Link from 'next/link';
import { ChevronRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from '@/components/account/order-status-badge';
import { formatPriceCents } from '@/lib/format/currency';
import { formatOrderDateShort } from '@/lib/orders/labels';
import type { OrderListItem } from '@/lib/orders/types';

export function OrderList({ orders }: { orders: OrderListItem[] }) {
  if (orders.length === 0) {
    return (
      <div className="border-border rounded-lg border border-dashed p-8 text-center">
        <Package
          className="text-muted-foreground mx-auto size-10"
          aria-hidden="true"
        />
        <h2 className="text-foreground mt-3 text-base font-medium">
          Todavía no hiciste compras
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Cuando hagas tu primera compra, va a aparecer acá.
        </p>
        <Button asChild className="mt-5">
          <Link href="/anteojos-de-sol">Ver anteojos de sol</Link>
        </Button>
      </div>
    );
  }

  return (
    <ul className="border-border divide-y rounded-lg border">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={`/mi-cuenta/pedidos/${order.id}`}
            className="hover:bg-muted/40 flex items-center gap-4 px-4 py-4 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="text-foreground font-mono text-sm font-semibold">
                  {order.orderNumber}
                </p>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {formatOrderDateShort(order.createdAt)} ·{' '}
                {order.itemCount === 1
                  ? '1 producto'
                  : `${order.itemCount} productos`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-foreground font-semibold tabular-nums">
                {formatPriceCents(order.totalCents)}
              </p>
            </div>
            <ChevronRight
              className="text-muted-foreground size-4 shrink-0"
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
