import { NewsletterForm } from '@/components/newsletter/newsletter-form';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';

/**
 * Sección destacada del newsletter para la home. Va hacia el final de
 * la home (antes del footer) — el visitante ya vio marcas / productos
 * / tools y este es el último prompt para no perder al lead.
 */
export function NewsletterSection() {
  return (
    <section
      className="container my-16 md:my-24"
      aria-label="Suscribite a las novedades"
    >
      <RevealOnScroll>
        <div className="border-border/60 from-muted/40 to-background relative isolate mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-gradient-to-br p-8 md:p-12">
          <div
            aria-hidden="true"
            className="bg-brand/10 pointer-events-none absolute -right-24 -top-24 size-72 rounded-full blur-3xl"
          />
          <div className="relative">
            <p className="text-brand text-xs font-medium uppercase tracking-[0.2em]">
              Sumate
            </p>
            <h2 className="text-foreground mt-3 text-balance font-serif text-3xl font-medium leading-[1.05] tracking-[-0.015em] md:text-4xl">
              Enterate primero de lo{' '}
              <span className="italic font-normal">nuevo</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg text-balance text-sm md:text-base">
              Te avisamos cuando llegan modelos nuevos, colecciones o algo
              que valga la pena. Sin spam — solo cuando hay algo real.
            </p>
            <div className="mt-6 max-w-lg">
              <NewsletterForm source="home_hero" variant="hero" />
            </div>
            <p className="text-muted-foreground/80 mt-3 text-xs">
              Podés darte de baja cuando quieras respondiendo cualquiera
              de nuestros emails.
            </p>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
