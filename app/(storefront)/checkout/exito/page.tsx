import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isCheckoutEnabled } from '@/lib/features';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: '¡Gracias por tu compra! | Óptica Carballo' },
  robots: { index: false, follow: false },
};

/**
 * Página post-redirect de Mercado Pago tras pago APROBADO.
 *
 * MP redirige acá con query params:
 *   ?collection_id=X&collection_status=approved&payment_id=Y
 *    &status=approved&external_reference=OC-2026-NNNNN
 *    &payment_type=Z&merchant_order_id=W&preference_id=P
 *
 * Esta página es **informativa**. La actualización real del estado de la
 * order (orders.status='paid', orders.mp_payment_id, etc) se hace desde
 * el webhook MP (sub-feature 3), porque los back_urls del browser no son
 * confiables (user puede cerrar la ventana, perder conexión, etc).
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    external_reference?: string;
    payment_id?: string;
    status?: string;
  }>;
}) {
  if (!isCheckoutEnabled()) notFound();

  const params = await searchParams;
  const orderNumber = params.external_reference?.trim();
  const paymentId = params.payment_id?.trim();

  return (
    <main className="container max-w-2xl py-12 md:py-16">
      <div className="text-center">
        <CheckCircle2
          className="mx-auto size-12 text-emerald-600 dark:text-emerald-400"
          aria-hidden="true"
        />
        <h1 className="text-foreground mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          ¡Gracias por tu compra!
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Tu pago se procesó correctamente.
        </p>
      </div>

      <section className="border-border mt-8 rounded-lg border p-6">
        <dl className="space-y-3 text-sm">
          {orderNumber && (
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">Número de orden</dt>
              <dd className="text-foreground font-mono font-semibold">
                {orderNumber}
              </dd>
            </div>
          )}
          {paymentId && (
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">ID de pago</dt>
              <dd className="text-foreground font-mono text-xs">{paymentId}</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="mt-6 rounded-lg bg-muted/40 p-5">
        <h2 className="text-foreground flex items-center gap-2 text-base font-semibold">
          <Mail className="size-4" aria-hidden="true" />
          ¿Qué sigue?
        </h2>
        <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
          <li>
            Te vamos a enviar un email con la confirmación y los próximos pasos.
          </li>
          <li>Preparamos tu pedido y coordinamos el envío en las próximas horas hábiles.</li>
          <li>
            Vas a recibir el número de seguimiento cuando despachamos.
          </li>
        </ul>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href="/mi-cuenta">Ver mi cuenta</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Seguir navegando</Link>
        </Button>
      </div>
    </main>
  );
}
