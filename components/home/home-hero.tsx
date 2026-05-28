import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { getBusinessInfo, getWhatsappLinkWithContext } from '@/lib/site/business';

export function HomeHero() {
  const { siteName } = getBusinessInfo();
  const whatsappLink = getWhatsappLinkWithContext(
    `Hola, te consulto por anteojos.`,
  );

  return (
    <section className="from-muted/30 to-background relative isolate overflow-hidden bg-gradient-to-b">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="bg-foreground/[0.06] animate-mesh-a absolute -top-24 left-[18%] size-[520px] rounded-full blur-3xl" />
        <div className="bg-foreground/[0.05] animate-mesh-b absolute top-1/2 right-[12%] size-[620px] rounded-full blur-3xl" />
        <div className="bg-foreground/[0.04] animate-mesh-c absolute -bottom-32 left-1/2 size-[480px] -translate-x-1/2 rounded-full blur-3xl" />
      </div>

      <div className="container py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="hero-reveal hero-reveal-1 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
            <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
            <span className="text-brand">{siteName}</span>
            <span className="text-muted-foreground/70">·</span>
            <span className="text-muted-foreground">óptica matriculada · 30+ años</span>
          </p>
          <h1 className="hero-reveal hero-reveal-2 mt-5 text-balance font-serif text-5xl font-medium leading-[1.02] tracking-[-0.02em] md:text-7xl lg:text-[5.5rem]">
            Anteojos originales con{' '}
            <span className="font-serif italic font-normal text-foreground/80">
              asesoramiento óptico real
            </span>
          </h1>
          <p className="hero-reveal hero-reveal-3 text-muted-foreground mx-auto mt-6 max-w-2xl text-balance text-base md:text-lg">
            Anteojos de sol y receta de las marcas que trabajamos. Atención
            personalizada por técnico óptico matriculado, envíos a todo el
            país y cuotas sin interés.
          </p>
          <div className="hero-reveal hero-reveal-4 mt-10 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton>
              <Button asChild size="lg" className="shine-on-hover group">
                <Link href="/anteojos-de-sol">
                  Ver anteojos de sol
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button asChild size="lg" variant="outline">
                <Link href="/anteojos-de-receta">Ver anteojos de receta</Link>
              </Button>
            </MagneticButton>
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
