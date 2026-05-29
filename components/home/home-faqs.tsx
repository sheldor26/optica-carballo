import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FaqAccordion } from '@/components/faqs/faq-accordion';
import { FaqJsonLd } from '@/components/seo/faq-jsonld';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { getFeaturedFaqs } from '@/lib/content/faqs';

export function HomeFaqs() {
  const featured = getFeaturedFaqs();
  if (featured.length === 0) return null;

  return (
    <section
      aria-labelledby="home-faqs-heading"
      className="container py-12 md:py-20"
    >
      <FaqJsonLd items={featured} />
      <div className="mx-auto max-w-3xl">
        <RevealOnScroll>
          <p className="text-brand inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
            <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
            Te ayudamos
          </p>
          <h2
            id="home-faqs-heading"
            className="text-foreground mt-3 font-serif text-3xl font-medium tracking-[-0.015em] md:text-4xl"
          >
            Preguntas <span className="italic">frecuentes</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl text-balance text-base">
            Las consultas más comunes sobre envíos, pagos, garantía y nuestros
            productos. Si no encontrás lo que buscás, escribinos por WhatsApp.
          </p>
        </RevealOnScroll>

        <div className="mt-8">
          <FaqAccordion items={featured} />
        </div>

        <RevealOnScroll>
          <p className="mt-6 text-center">
            <Link
              href="/preguntas-frecuentes"
              className="text-foreground group inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
            >
              Ver todas las preguntas frecuentes
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
