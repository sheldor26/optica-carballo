import Link from 'next/link';
import { ExternalLink, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from '@/components/account/order-status-badge';
import { formatPriceCents } from '@/lib/format/currency';
import { formatOrderDate } from '@/lib/orders/labels';
import { getWhatsappLinkWithContext } from '@/lib/site/business';
import type { OrderDetail } from '@/lib/orders/types';

export function OrderDetailView({ order }: { order: OrderDetail }) {
  const whatsappLink = getWhatsappLinkWithContext(
    `Hola! Te consulto por mi pedido ${order.orderNumber}.`,
  );

  const apartmentLine = order.shippingApartment
    ? ` · ${order.shippingApartment}`
    : '';

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">
            <Link
              href="/mi-cuenta/pedidos"
              className="hover:text-foreground underline-offset-2 hover:underline"
            >
              ← Mis pedidos
            </Link>
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            Pedido{' '}
            <span className="font-mono text-xl">{order.orderNumber}</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-xs">
            Realizado el {formatOrderDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </header>

      {/* Tracking destacado si está enviado */}
      {order.trackingNumber && (
        <section className="border-border bg-muted/30 flex items-start gap-3 rounded-lg border p-4">
          <Truck className="text-foreground mt-0.5 size-5" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-foreground text-sm font-medium">
              Tu pedido está en camino
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Número de seguimiento:{' '}
              <span className="text-foreground font-mono">
                {order.trackingNumber}
              </span>
            </p>
          </div>
        </section>
      )}

      {/* Items */}
      <section>
        <h2 className="text-foreground text-base font-semibold">Productos</h2>
        <ul className="border-border mt-3 divide-y rounded-lg border">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-4 px-4 py-3 text-sm"
            >
              <span className="bg-muted text-muted-foreground inline-flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums">
                {item.quantity}
              </span>
              <div className="flex-1">
                <p className="text-foreground font-medium">
                  {item.productName}
                </p>
                <p className="text-muted-foreground text-xs">
                  {item.brandName ? `${item.brandName} · ` : ''}SKU{' '}
                  {item.variantSku}
                </p>
              </div>
              <div className="text-right">
                <p className="text-foreground font-semibold tabular-nums">
                  {formatPriceCents(item.lineTotalCents)}
                </p>
                {item.quantity > 1 && (
                  <p className="text-muted-foreground text-xs">
                    {formatPriceCents(item.unitPriceCents)} c/u
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Totals + Address */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="border-border rounded-lg border p-5">
          <h2 className="text-foreground text-base font-semibold">Totales</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="text-foreground tabular-nums">
                {formatPriceCents(order.subtotalCents)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Envío</dt>
              <dd className="text-foreground tabular-nums">
                {order.shippingCents === 0
                  ? 'Gratis'
                  : formatPriceCents(order.shippingCents)}
              </dd>
            </div>
            {order.discountCents > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Descuento</dt>
                <dd className="text-foreground tabular-nums">
                  -{formatPriceCents(order.discountCents)}
                </dd>
              </div>
            )}
            <div className="border-border flex justify-between border-t pt-2">
              <dt className="text-foreground font-semibold">Total</dt>
              <dd className="text-foreground text-lg font-bold tabular-nums">
                {formatPriceCents(order.totalCents)}
              </dd>
            </div>
          </dl>
          {order.mpPaymentId && (
            <p className="text-muted-foreground mt-3 text-[11px]">
              ID de pago Mercado Pago:{' '}
              <span className="font-mono">{order.mpPaymentId}</span>
            </p>
          )}
        </section>

        <section className="border-border rounded-lg border p-5">
          <h2 className="text-foreground text-base font-semibold">
            Dirección de envío
          </h2>
          {order.shippingStreet ? (
            <address className="text-muted-foreground mt-3 text-sm leading-relaxed not-italic">
              {order.shippingRecipientName && (
                <>
                  <span className="text-foreground font-medium">
                    {order.shippingRecipientName}
                  </span>
                  <br />
                </>
              )}
              {order.shippingStreet} {order.shippingNumber}
              {apartmentLine}
              <br />
              {order.shippingCity}, {order.shippingProvince} (
              {order.shippingPostalCode})
              {order.shippingPhone && (
                <>
                  <br />
                  Tel: {order.shippingPhone}
                </>
              )}
            </address>
          ) : (
            <p className="text-muted-foreground mt-3 text-sm">
              Sin dirección registrada.
            </p>
          )}
        </section>
      </div>

      {/* Invoice link if exists */}
      {order.invoiceUrl && (
        <section className="border-border rounded-lg border p-4">
          <Button asChild variant="outline" size="sm">
            <a
              href={order.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="size-4" />
              Ver factura
            </a>
          </Button>
        </section>
      )}

      {/* Consultas WhatsApp */}
      {whatsappLink && (
        <section className="border-border bg-muted/20 rounded-lg border border-dashed p-5 text-center">
          <p className="text-muted-foreground text-sm">
            ¿Tenés alguna duda sobre este pedido?
          </p>
          <Button asChild variant="outline" className="mt-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar por WhatsApp
            </a>
          </Button>
        </section>
      )}
    </div>
  );
}
