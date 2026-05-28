import type { Metadata } from 'next';
import { FaceShapeAnalyzer } from '@/components/tools/face-shape-analyzer';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';

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
    <main className="container py-10 md:py-16">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-brand inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
          <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
          Herramienta gratuita
        </p>
        <h1 className="text-foreground mt-4 text-balance font-serif text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl">
          ¿Qué <span className="italic">forma de marco</span> te queda mejor?
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-balance text-base md:text-lg">
          Subí una selfie frontal y te sugerimos qué tipo de armazón resalta
          mejor los rasgos de tu rostro. Es orientativo — la prueba final es
          ponértelo.
        </p>
      </header>

      <section className="mt-12 md:mt-16">
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
    <section className="mx-auto mt-20 max-w-2xl">
      <h2 className="text-foreground font-serif text-2xl font-medium tracking-tight md:text-3xl">
        Preguntas frecuentes
      </h2>
      <dl className="mt-6 space-y-5">
        {items.map((item) => (
          <div
            key={item.q}
            className="border-border/60 bg-background rounded-lg border p-4"
          >
            <dt className="text-foreground text-sm font-semibold">{item.q}</dt>
            <dd className="text-muted-foreground mt-2 text-sm">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
