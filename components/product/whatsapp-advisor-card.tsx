import { MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWhatsappLinkWithContext } from '@/lib/site/business';

type Props = {
  productName: string;
  brandName: string;
};

/**
 * Card de asesoramiento por WhatsApp en página de producto.
 * Se ubica entre descripción/callouts y productos relacionados —
 * momento exacto en que el cliente terminó de leer y duda.
 * Captura conversión potencial perdida sin presionar al cliente.
 */
export function WhatsappAdvisorCard({ productName, brandName }: Props) {
  const message = `Hola! Tengo una consulta sobre ${brandName} ${productName}, ¿pueden asesorarme?`;
  const href = getWhatsappLinkWithContext(message);
  if (!href) return null;

  return (
    <section className="mt-20 max-w-3xl">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-600/20 bg-gradient-to-br from-emerald-500/[0.06] via-background to-background p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-emerald-500/10 blur-3xl"
        />
        <div className="relative grid gap-6 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-600/10 sm:size-16">
            <MessageCircle className="size-7 text-emerald-700 dark:text-emerald-400 sm:size-8" />
          </div>
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
              <Sparkles className="size-3.5" />
              Asesoramiento personalizado
            </p>
            <h3 className="text-foreground mt-2 font-serif text-2xl font-medium tracking-tight md:text-3xl">
              ¿Tenés dudas sobre este modelo?
            </h3>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              ¿No te termina de cerrar o querés saber si te queda bien? Escribinos
              por WhatsApp y te asesoramos. Sin compromiso.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <a href={href} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" />
              Consultar
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
