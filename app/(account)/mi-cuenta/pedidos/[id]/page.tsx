import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { OrderDetailView } from '@/components/account/order-detail';
import { requireAuth } from '@/lib/auth/server';
import { fetchOrderById, fetchOrderStatusEvents } from '@/lib/orders/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Detalle del pedido | Óptica Carballo' },
  robots: { index: false, follow: false },
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAuth(`/mi-cuenta/pedidos/${id}`);

  const order = await fetchOrderById(id);
  if (!order) notFound();

  const events = await fetchOrderStatusEvents(id);

  return (
    <main className="container max-w-3xl py-8 md:py-12">
      <OrderDetailView order={order} events={events} />
    </main>
  );
}
