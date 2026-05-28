import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
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
        `Hola! Mi pago para el pedido ${orderNumber} no se completó. ¿Podemos coordinar?`,
      )
    : getWhatsappLinkWithContext(
        'Hola! Tuve un problema al pagar online. ¿Podemos coordinar?',
      );

  return (
    <main className="container max-w-2xl py-12 md:py-16">
      <div className="text-center">
        <AlertCircle
          className="text-destructive mx-auto size-12"
          aria-hidden="true"
        />
        <h1 className="text-foreground mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          El pago no se completó
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Mercado Pago rechazó o canceló la operación.
        </p>
        {orderNumber && (
          <p className="text-muted-foreground mt-2 text-xs">
            Orden:{' '}
            <span className="text-foreground font-mono">{orderNumber}</span>
          </p>
        )}
      </div>

      <section className="border-border mt-8 rounded-lg border p-6">
        <h2 className="text-foreground text-base font-semibold">
          ¿Qué podés hacer?
        </h2>
        <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
          <li>Verificá los datos de tu tarjeta y reintentá desde el carrito.</li>
          <li>Probá con otro medio de pago habilitado en Mercado Pago.</li>
          <li>
            Si el problema persiste, contactanos por WhatsApp y coordinamos
            el pago.
          </li>
        </ul>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href="/carrito">Volver al carrito</Link>
        </Button>
        {whatsappLink && (
          <Button asChild variant="outline">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar por WhatsApp
            </a>
          </Button>
        )}
      </div>
    </main>
  );
}
