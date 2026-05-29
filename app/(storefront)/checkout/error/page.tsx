import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertCircle, MessageCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWhatsappLinkWithContext } from '@/lib/site/business';
import { isCheckoutEnabled } from '@/lib/features';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Pago no completado | Óptica Carballo' },
  robots: { index: false, follow: false },
};

/**
 * Página post-redirect de MP cuando el pago falló o fue rechazado.
 *
 * Casos típicos: tarjeta rechazada, fondos insuficientes, datos inválidos,
 * timeout del banco. La order ya está creada en DB con `status='pending'`
 * — el user puede reintentar el pago contactando por WhatsApp (V1, sin
 * "reintentar pago" automático en UI).
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    external_reference?: string;
    status?: string;
  }>;
}) {
  if (!isCheckoutEnabled()) notFound();

  const params = await searchParams;
  const orderNumber = params.external_reference?.trim();

  const whatsappLink = orderNumber
    ? getWhatsappLinkWithContext(
        `Hola, mi pago para el pedido ${orderNumber} no se completó. ¿Podemos coordinar?`,
      )
    : getWhatsappLinkWithContext(
        'Hola, tuve un problema al pagar online. ¿Podemos coordinar?',
      );

  return (
    <main className="container max-w-2xl py-12 md:py-16">
      <header className="text-center">
        <div className="bg-red-100 dark:bg-red-950/40 mx-auto flex size-16 items-center justify-center rounded-full">
          <AlertCircle
            className="size-9 text-red-600 dark:text-red-400"
            aria-hidden="true"
            strokeWidth={1.75}
          />
        </div>
        <h1 className="text-foreground mt-6 text-balance font-serif text-4xl font-medium leading-tight tracking-tight md:text-5xl">
          El pago <span className="italic">no se completó</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance text-sm md:text-base">
          Mercado Pago rechazó o canceló la operación. No te preocupes — no se
          te cobró nada y podés intentar de nuevo.
        </p>
      </header>

      {orderNumber && (
        <section className="border-border/60 bg-muted/30 mt-8 rounded-xl border p-5 text-center">
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
          Qué podés hacer
        </h2>
        <ul className="text-muted-foreground mt-5 space-y-3 text-sm leading-relaxed md:text-base">
          <li>
            <strong className="text-foreground">Verificá los datos</strong> de tu
            tarjeta (número, vencimiento, código de seguridad) y reintentá
            desde el carrito.
          </li>
          <li>
            <strong className="text-foreground">Probá con otro medio</strong>:
            otra tarjeta, transferencia o Pago Fácil / Rapipago.
          </li>
          <li>
            <strong className="text-foreground">Si persiste</strong>: escribinos
            por WhatsApp y coordinamos el pago de otra forma.
          </li>
        </ul>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg">
          <Link href="/carrito">
            <RefreshCw className="mr-2 size-4" strokeWidth={2} />
            Volver al carrito
          </Link>
        </Button>
        {whatsappLink && (
          <Button asChild size="lg" variant="outline">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 size-4" strokeWidth={2} />
              Consultar por WhatsApp
            </a>
          </Button>
        )}
      </div>
    </main>
  );
}
