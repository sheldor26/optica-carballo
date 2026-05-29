import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, Mail, MessageCircle, Package, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isCheckoutEnabled } from '@/lib/features';
import { getBusinessInfo, getWhatsappLinkWithContext } from '@/lib/site/business';

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
 * La página es **informativa**. La actualización de orders.status='paid'
 * se hace desde el webhook MP, no acá (back_urls del browser no son
 * confiables — usuario puede cerrar la ventana).
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
  const business = getBusinessInfo();
  const whatsappLink = getWhatsappLinkWithContext(
    orderNumber
      ? `Hola, te consulto por mi pedido ${orderNumber}.`
      : 'Hola, te consulto por mi compra reciente.',
  );

  return (
    <main className="container max-w-2xl py-12 md:py-16">
      <header className="text-center">
        <div className="bg-emerald-100 dark:bg-emerald-950/40 mx-auto flex size-16 items-center justify-center rounded-full">
          <CheckCircle2
            className="size-9 text-emerald-600 dark:text-emerald-400"
            aria-hidden="true"
            strokeWidth={1.75}
          />
        </div>
        <h1 className="text-foreground mt-6 text-balance font-serif text-4xl font-medium leading-tight tracking-tight md:text-5xl">
          ¡Gracias por tu <span className="italic">compra</span>!
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance text-sm md:text-base">
          Tu pago se procesó correctamente. Te vamos a tener al tanto en cada
          paso.
        </p>
      </header>

      {(orderNumber || paymentId) && (
        <section className="border-border/60 bg-muted/30 mt-8 rounded-xl border p-5">
          <dl className="space-y-3 text-sm">
            {orderNumber && (
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                  Número de orden
                </dt>
                <dd className="text-foreground font-mono font-semibold">
                  {orderNumber}
                </dd>
              </div>
            )}
            {paymentId && (
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                  ID de pago
                </dt>
                <dd className="text-foreground font-mono text-xs">
                  {paymentId}
                </dd>
              </div>
            )}
          </dl>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-foreground font-serif text-2xl font-medium tracking-tight md:text-3xl">
          Qué sigue
        </h2>
        <ol className="mt-5 space-y-4">
          <NextStep
            icon={Mail}
            title="Te llega un email con el comprobante"
            description="En los próximos minutos vas a recibir un email con la confirmación oficial y los detalles de tu pedido."
          />
          <NextStep
            icon={Package}
            title="Preparamos tu pedido"
            description="En las próximas horas hábiles armamos el pedido y validamos todo (incluyendo receta si corresponde)."
          />
          <NextStep
            icon={Truck}
            title="Despachamos y te avisamos"
            description="Cuando salga el envío vas a recibir el número de seguimiento. Si elegiste retiro, te avisamos cuando esté listo."
          />
        </ol>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg">
          <Link href="/mi-cuenta/pedidos">Ver mis pedidos</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Seguir navegando</Link>
        </Button>
      </div>

      {whatsappLink && (
        <div className="border-border/60 mt-10 rounded-xl border p-5 text-center">
          <p className="text-foreground text-sm font-semibold">
            ¿Tenés alguna duda con tu pedido?
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Escribinos por WhatsApp — atendemos en horario comercial.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 size-4" strokeWidth={2} />
              Hablar con {business.siteName}
            </a>
          </Button>
        </div>
      )}
    </main>
  );
}

function NextStep({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Mail;
  title: string;
  description: string;
}) {
  return (
    <li className="flex gap-4">
      <span
        aria-hidden="true"
        className="border-border/60 bg-background flex size-10 shrink-0 items-center justify-center rounded-full border"
      >
        <Icon className="text-foreground/80 size-5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1 pt-1">
        <p className="text-foreground text-sm font-semibold sm:text-base">
          {title}
        </p>
        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </li>
  );
}
