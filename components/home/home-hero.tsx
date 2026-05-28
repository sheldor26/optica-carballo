import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBusinessInfo, getWhatsappLinkWithContext } from '@/lib/site/business';

export function HomeHero() {
  const { siteName } = getBusinessInfo();
  const whatsappLink = getWhatsappLinkWithContext(
    `Hola, te consulto por anteojos.`,
  );

  return (
    <section className="from-muted/40 to-background bg-gradient-to-b">
      <div className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
            {siteName}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">
            Anteojos originales con asesoramiento óptico real
          </h1>
          <p className="text-muted-foreground mt-5 text-base md:text-lg">
            Anteojos de sol y receta de las marcas que trabajamos. Atención
            personalizada por técnico óptico matriculado, envíos a todo el
            país y cuotas sin interés.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/anteojos-de-sol">
                Ver anteojos de sol
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/anteojos-de-receta">Ver anteojos de receta</Link>
            </Button>
            {whatsappLink && (
              <Button asChild size="lg" variant="ghost">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4" />
                  WhatsApp
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
