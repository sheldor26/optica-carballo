import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/admin';
import {
  fetchOrderByIdAdmin,
  fetchOrderStatusEventsAdmin,
} from '@/lib/orders/admin-queries';
import { OrderStatusBadge } from '@/components/account/order-status-badge';
import { OrderTimeline } from '@/components/account/order-timeline';
import { OrderStatusControl } from '@/components/admin/order-status-control';
import { ShipmentControl } from '@/components/admin/shipment-control';
import { formatPriceCents } from '@/lib/format/currency';
import { formatOrderDate } from '@/lib/orders/labels';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pedido — Admin',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [order, events] = await Promise.all([
    fetchOrderByIdAdmin(id),
    fetchOrderStatusEventsAdmin(id),
  ]);

  if (!order) notFound();

  const apartmentLine = order.shippingApartment
    ? ` · ${order.shippingApartment}`
    : '';

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10 md:px-6">
      <header className="mb-6">
        <p className="text-muted-foreground text-sm">
          <Link
            href="/admin/pedidos"
            className="hover:text-foreground underline-offset-2 hover:underline"
          >
            ← Todos los pedidos
          </Link>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Pedido <span className="font-mono text-xl">{order.orderNumber}</span>
          </h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-muted-foreground mt-1 text-xs">
          Realizado el {formatOrderDate(order.createdAt)}
        </p>
      </header>

      <div className="space-y-6">
        {/* Control de estado (lo primero — es la acción principal del admin) */}
        <OrderStatusControl
          orderId={order.id}
          currentStatus={order.status}
          currentTracking={order.trackingNumber}
        />

        {/* Timeline */}
        <OrderTimeline status={order.status} events={events} />

        {/* Datos del cliente (PII) */}
        <section className="border-border rounded-lg border p-5">
          <h2 className="text-foreground text-base font-semibold">Cliente</h2>
          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Nombre</dt>
              <dd className="text-foreground text-right">{order.customerName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="text-foreground text-right break-all">
                {order.customerEmail}
              </dd>
            </div>
            {order.customerPhone && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Teléfono</dt>
                <dd className="text-foreground text-right">
                  {order.customerPhone}
                </dd>
              </div>
            )}
          </dl>
        </section>

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
                <p className="text-foreground font-semibold tabular-nums">
                  {formatPriceCents(item.lineTotalCents)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Totales + Envío */}
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
                ID pago MP: <span className="font-mono">{order.mpPaymentId}</span>
              </p>
            )}
          </section>

          <section className="border-border rounded-lg border p-5">
            <h2 className="text-foreground text-base font-semibold">
              {order.shippingMethod === 'pickup'
                ? 'Retiro en local'
                : order.shippingMethod === 'branch'
                  ? 'Envío a sucursal del Correo'
                  : 'Dirección de envío'}
            </h2>
            {order.shippingMethod === 'pickup' ? (
              <p className="text-muted-foreground mt-3 text-sm">
                El cliente retira en el local.
              </p>
            ) : order.shippingMethod === 'branch' ? (
              <div className="text-muted-foreground mt-3 text-sm leading-relaxed">
                <p className="text-foreground font-medium">
                  {order.shippingAgencyName ?? 'Sucursal del Correo'}
                </p>
                {order.shippingAgencyCode && (
                  <p className="mt-1">
                    Código sucursal:{' '}
                    <span className="text-foreground font-mono">
                      {order.shippingAgencyCode}
                    </span>
                  </p>
                )}
                {order.shippingRecipientName && (
                  <p className="mt-1">
                    Destinatario:{' '}
                    <span className="text-foreground">
                      {order.shippingRecipientName}
                    </span>
                    {order.shippingPhone ? ` · Tel: ${order.shippingPhone}` : ''}
                  </p>
                )}
                {(order.shippingCity || order.shippingProvince) && (
                  <p className="mt-1">
                    Zona del cliente: {order.shippingCity}
                    {order.shippingProvince ? `, ${order.shippingProvince}` : ''}
                    {order.shippingPostalCode
                      ? ` (${order.shippingPostalCode})`
                      : ''}
                  </p>
                )}
              </div>
            ) : order.shippingStreet ? (
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
            {order.trackingNumber && (
              <p className="text-muted-foreground mt-3 text-xs">
                Seguimiento:{' '}
                <span className="text-foreground font-mono">
                  {order.trackingNumber}
                </span>
              </p>
            )}
            {order.shippingMethod !== 'pickup' && (
              <ShipmentControl orderId={order.id} />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
