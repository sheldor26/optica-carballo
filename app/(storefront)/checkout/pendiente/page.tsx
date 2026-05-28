import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBusinessInfo, getWhatsappLinkWithContext } from '@/lib/site/business';
import { isCheckoutEnabled } from '@/lib/features';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Pedido recibido | Óptica Carballo' },
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  if (!isCheckoutEnabled()) notFound();

  const { order } = await searchParams;
  const orderNumber = order?.trim();

  const business = getBusinessInfo();
  const whatsappLink = orderNumber
    ? getWhatsappLinkWithContext(
        `Hola! Te paso mi número de pedido: ${orderNumber}. Quería consultar por el pago.`,
      )
    : business.whatsappLink;

  return (
    <main className="container max-w-2xl py-12 md:py-16">
      <div className="text-center">
        <CheckCircle2
          className="mx-auto size-12 text-emerald-600 dark:text-emerald-400"
          aria-hidden="true"
        />
        <h1 className="text-foreground mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          Recibimos tu pedido
        </h1>
        {orderNumber && (
          <p className="text-muted-foreground mt-3 text-sm">
            Número de orden:{' '}
            <span className="text-foreground font-mono font-semibold">
              {orderNumber}
            </span>
          </p>
        )}
      </div>

      <section className="border-border mt-8 rounded-lg border p-6">
        <h2 className="text-foreground flex items-center gap-2 text-base font-semibold">
          <Clock className="size-4" aria-hidden="true" />
          Próximo paso: pago
        </h2>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          Estamos integrando Mercado Pago para que puedas pagar online de
          forma inmediata. Mientras tanto, te contactamos por WhatsApp para
          coordinar el pago y los detalles del envío.
        </p>
        {whatsappLink && (
          <Button asChild className="mt-5 w-full sm:w-auto">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar por WhatsApp
            </a>
          </Button>
        )}
      </section>

      <section className="mt-8 text-center">
        <p className="text-muted-foreground text-sm">
          Podés ver tus pedidos cuando quieras desde{' '}
          <Link
            href="/mi-cuenta"
            className="text-foreground underline-offset-2 hover:underline"
          >
            tu cuenta
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
