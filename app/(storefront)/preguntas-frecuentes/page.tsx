import type { Metadata } from 'next';
import { FaqSearch } from '@/components/faqs/faq-search';
import { FaqJsonLd } from '@/components/seo/faq-jsonld';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';
import { FAQS } from '@/lib/content/faqs';

const SLUG = 'preguntas-frecuentes';
const TITLE = 'Preguntas frecuentes';
const DESCRIPTION =
  'Respuestas a las consultas más comunes sobre envíos, pagos, garantía, recetas y nuestros productos. Si no encontrás lo que buscás, escribinos por WhatsApp.';

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return buildInfoPageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    slug: SLUG,
  });
}

export default function Page() {
  return (
    <main className="container py-10 md:py-16">
      <FaqJsonLd items={FAQS} />

      <header className="mx-auto max-w-3xl text-center">
        <p className="text-brand inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
          <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
          Te ayudamos
        </p>
        <h1 className="text-foreground mt-4 text-balance font-serif text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl">
          Preguntas <span className="italic">frecuentes</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-balance text-base md:text-lg">
          {DESCRIPTION}
        </p>
      </header>

      <div className="mt-12 md:mt-14">
        <FaqSearch allItems={FAQS} />
      </div>

      <ContactCta />
    </main>
  );
}

function ContactCta() {
  return (
    <section className="mx-auto mt-20 max-w-3xl">
      <div className="border-border/60 from-muted/30 to-background relative overflow-hidden rounded-2xl border bg-gradient-to-br p-8 text-center md:p-12">
        <div
          aria-hidden="true"
          className="bg-brand/15 pointer-events-none absolute -right-20 -top-20 size-48 rounded-full blur-3xl"
        />
        <div className="relative">
          <h2 className="text-foreground font-serif text-2xl font-medium tracking-tight md:text-3xl">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-md text-balance text-sm md:text-base">
            Escribinos por WhatsApp y te respondemos lo antes posible.
          </p>
          <p className="text-muted-foreground/80 mt-4 text-xs">
            También podés visitarnos en Virasoro, Corrientes.
          </p>
        </div>
      </div>
    </section>
  );
}
