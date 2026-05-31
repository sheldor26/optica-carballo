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
    <main className="container py-16 md:py-24">
      <FaqJsonLd items={FAQS} />

      <header className="mx-auto max-w-3xl text-center">
        <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
          <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
          Te ayudamos
        </p>
        <h1 className="text-foreground mt-6 text-balance font-serif text-5xl font-medium leading-[1.0] tracking-[-0.025em] md:text-6xl lg:text-7xl">
          Preguntas{' '}
          <span className="font-normal italic text-foreground/70">
            frecuentes
          </span>
          .
        </h1>
        <p className="text-muted-foreground mx-auto mt-7 max-w-xl text-balance text-base md:text-lg">
          {DESCRIPTION}
        </p>
      </header>

      <div className="mt-14 md:mt-20">
        <FaqSearch allItems={FAQS} />
      </div>

      <ContactCta />
    </main>
  );
}

function ContactCta() {
  return (
    <section className="mx-auto mt-24 max-w-3xl md:mt-32">
      <div className="bg-zinc-50 relative overflow-hidden rounded-2xl p-8 text-center md:p-12">
        <div
          aria-hidden="true"
          className="bg-brand/15 pointer-events-none absolute -right-20 -top-20 size-48 rounded-full blur-3xl"
        />
        <div className="relative">
          <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em]">
            <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
            ¿Otra duda?
          </p>
          <h2 className="text-foreground mt-5 font-serif text-3xl font-medium tracking-tight md:text-4xl">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="text-muted-foreground mx-auto mt-5 max-w-md text-balance text-base">
            Escribinos por WhatsApp y te respondemos lo antes posible.
          </p>
          <p className="text-muted-foreground/80 mt-3 text-xs">
            También podés visitarnos en Virasoro, Corrientes.
          </p>
        </div>
      </div>
    </section>
  );
}
