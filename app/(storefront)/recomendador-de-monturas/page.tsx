import type { Metadata } from 'next';
import { FaceShapeAnalyzer } from '@/components/tools/face-shape-analyzer';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';

const SLUG = 'recomendador-de-monturas';
const TITLE = 'Recomendador de monturas según tu rostro';
const DESCRIPTION =
  'Subí una foto y nuestra herramienta de IA te recomienda qué forma de armazón le queda mejor a tu rostro. Análisis automatizado, orientativo, sin guardar tu foto.';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return buildInfoPageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    slug: SLUG,
  });
}

export default function Page() {
  return (
    <main className="container py-12 md:py-20">
      <RevealOnScroll
        as="section"
        className="mx-auto max-w-3xl text-center"
      >
        <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
          <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
          Herramienta gratuita
        </p>
        <h1 className="text-foreground mt-6 text-balance font-serif text-5xl font-medium leading-[1.0] tracking-[-0.025em] md:text-6xl lg:text-7xl">
          ¿Qué{' '}
          <span className="font-normal italic text-foreground/70">
            forma de marco
          </span>{' '}
          te queda mejor?
        </h1>
        <p className="text-muted-foreground mx-auto mt-7 max-w-xl text-balance text-base md:text-lg">
          Subí una selfie frontal y te sugerimos qué tipo de armazón resalta
          mejor los rasgos de tu rostro. Orientativo — la prueba final es
          ponértelo.
        </p>
      </RevealOnScroll>

      <section className="mt-14 md:mt-20">
        <FaceShapeAnalyzer />
      </section>

      <FaqBlock />
    </main>
  );
}

function FaqBlock() {
  const items = [
    {
      q: '¿Guardan mi foto?',
      a: 'No. La foto se procesa y se descarta inmediatamente. No queda almacenada en nuestros servidores ni en bases de datos.',
    },
    {
      q: '¿Qué precisión tiene esta herramienta?',
      a: 'Es una sugerencia estética orientativa basada en análisis automatizado. La prueba física del armazón sigue siendo lo más confiable. Para una recomendación profesional definitiva, contactá a una óptica matriculada.',
    },
    {
      q: '¿Puedo usar la sugerencia para elegir mi receta?',
      a: 'No. Esta herramienta solo recomienda forma de armazón. La elección de cristales graduados requiere receta oftalmológica vigente y se confirma con tu óptico.',
    },
    {
      q: '¿Por qué no analiza fotos con anteojos puestos?',
      a: 'El armazón cubre parte de los pómulos y la línea de los ojos, lo que reduce la precisión del análisis facial. Probá con una foto sin anteojos.',
    },
  ];

  return (
    <RevealOnScroll
      as="section"
      aria-labelledby="recomendador-faqs-heading"
      className="border-foreground/10 mx-auto mt-24 max-w-3xl border-t pt-16 md:mt-32"
    >
      <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
        <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
        Preguntas frecuentes
      </p>
      <h2
        id="recomendador-faqs-heading"
        className="text-foreground mt-6 font-serif text-3xl font-medium leading-tight tracking-[-0.015em] md:text-4xl"
      >
        Lo que más nos consultan.
      </h2>

      <dl className="mt-10 space-y-6 md:mt-12">
        {items.map((item) => (
          <div
            key={item.q}
            className="border-foreground/10 border-t pt-6"
          >
            <dt className="text-foreground font-serif text-lg font-medium tracking-tight md:text-xl">
              {item.q}
            </dt>
            <dd className="text-muted-foreground mt-3 text-sm leading-relaxed md:text-base">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </RevealOnScroll>
  );
}
