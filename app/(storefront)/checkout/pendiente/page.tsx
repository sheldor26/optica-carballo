import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBusinessInfo, getWhatsappLinkWithContext } from '@/lib/site/business';
import { isCheckoutEnabled } from '@/lib/features';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Pago pendiente | Óptica Carballo' },
  robots: { index: false, follow: false },
};

/**
 * Página de pago pendiente: ej cuando el usuario eligió Pago Fácil /
 * Rapipago en MP. La compra está iniciada pero falta confirmación.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    order?: string;
    external_reference?: string;
  }>;
}) {
  if (!isCheckoutEnabled()) notFound();

  const { order, external_reference } = await searchParams;
  const orderNumber = (order ?? external_reference)?.trim();

  const business = getBusinessInfo();
  const whatsappLink = getWhatsappLinkWithContext(
    orderNumber
      ? `Hola, te consulto por el pago pendiente de mi pedido ${orderNumber}.`
      : 'Hola, te consulto por un pago pendiente.',
  );

  return (
    <main className="container max-w-2xl py-12 md:py-16">
      <header className="text-center">
        <div className="bg-amber-100 dark:bg-amber-950/40 mx-auto flex size-16 items-center justify-center rounded-full">
          <Clock
            className="size-9 text-amber-600 dark:text-amber-400"
            aria-hidden="true"
            strokeWidth={1.75}
          />
        </div>
        <h1 className="text-foreground mt-6 text-balance font-serif text-4xl font-medium leading-tight tracking-tight md:text-5xl">
          Pago <span className="italic">pendiente</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance text-sm md:text-base">
          Recibimos tu pedido pero todavía estamos esperando la confirmación del
          pago. En cuanto se acredite, lo preparamos.
        </p>
      </header>

      {orderNumber && (
        <section className="border-border/60 bg-muted/30 mt-8 rounded-xl border p-5">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            Número de orden
          </p>
          <p className="text-foreground mt-1 font-mono text-base font-semibold">
            {orderNumber}
          </p>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-foreground font-serif text-2xl font-medium tracking-tight md:text-3xl">
          Qué pasa ahora
        </h2>
        <ul className="text-muted-foreground mt-5 space-y-3 text-sm leading-relaxed md:text-base">
          <li>
            <strong className="text-foreground">Si elegiste pago en efectivo</strong>{' '}
            (Pago Fácil / Rapipago): tenés el cupón en tu correo. Una vez que
            pagues, Mercado Pago nos avisa y empezamos a preparar tu pedido.
          </li>
          <li>
            <strong className="text-foreground">Si elegiste transferencia</strong>:
            seguí los pasos que te indicó Mercado Pago. La acreditación puede
            tardar unas horas.
          </li>
          <li>
            <strong className="text-foreground">¿Algún problema?</strong>{' '}
            Escribinos y lo resolvemos rápido.
          </li>
        </ul>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {whatsappLink && (
          <Button asChild size="lg">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 size-4" strokeWidth={2} />
              Consultar por WhatsApp
            </a>
          </Button>
        )}
        <Button asChild variant="outline" size="lg">
          <Link href="/mi-cuenta/pedidos">Ver mis pedidos</Link>
        </Button>
      </div>

      <p className="text-muted-foreground mt-8 text-center text-xs">
        {business.siteName} — atención en horario comercial.
      </p>
    </main>
  );
}
