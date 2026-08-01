import type { Metadata } from 'next';
import Link from 'next/link';
import { VisionSimulator } from '@/components/tools/vision-simulator';
import { FaqJsonLd } from '@/components/seo/faq-jsonld';
import { safeJsonLd } from '@/lib/seo/json-ld';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';
import type { FaqEntry } from '@/lib/content/faqs';

const SLUG = 'simulador-de-vision';
const TITLE = 'Simulador de visión según tu receta';
const DESCRIPTION =
  'Ingresá tu receta (esfera, cilindro, eje, ADD) y mirá en fotos cómo ve una persona con miopía, astigmatismo o presbicia, y cómo mejora con anteojos. Gratis.';

// 100% client-side: la página es estática (NO copiar el force-dynamic del
// lector — acá no hay IA ni datos por request). Verificar cache HIT post-deploy.

export function generateMetadata(): Metadata {
  return {
    ...buildInfoPageMetadata({
      title: TITLE,
      description: DESCRIPTION,
      slug: SLUG,
    }),
    // TODO(founder): sacar el noindex cuando la calibración visual esté
    // aprobada — la herramienta queda usable pero fuera de Google hasta entonces.
    robots: { index: false, follow: true },
  };
}

const FAQ_ITEMS: FaqEntry[] = [
  {
    id: 'vsim-exactitud',
    question: '¿El simulador muestra exactamente cómo veo yo?',
    answer:
      'No exactamente: es una aproximación basada en óptica geométrica. La percepción real depende del tamaño de tu pupila, la iluminación, la adaptación de tu cerebro y otros factores individuales. Sirve para entender el tipo de dificultad visual que produce cada receta, no para medirla.',
  },
  {
    id: 'vsim-privacidad',
    question: '¿Guardan los datos de mi receta?',
    answer:
      'No. El simulador funciona completamente en tu navegador: los valores que ingresás no se envían a ningún servidor ni se almacenan en ninguna base de datos.',
  },
  {
    id: 'vsim-diagnostico',
    question: '¿Puedo usar el simulador para saber qué graduación necesito?',
    answer:
      'No. El simulador no diagnostica ni sugiere graduaciones: solo ilustra cómo se ve con un error refractivo ya conocido. La graduación la determina un médico oftalmólogo con un examen visual completo.',
  },
  {
    id: 'vsim-valores',
    question: '¿Qué significan esfera, cilindro, eje y ADD?',
    answer:
      'La esfera indica miopía (negativa) o hipermetropía (positiva). El cilindro y el eje describen el astigmatismo: cuánto y en qué orientación. La ADD es el agregado para ver de cerca cuando aparece la presbicia. Tenemos una guía completa para leer tu receta paso a paso.',
  },
  {
    id: 'vsim-condiciones',
    question: '¿Sirve para cataratas, queratocono u otras condiciones?',
    answer:
      'No. El simulador solo modela errores refractivos regulares (miopía, hipermetropía, astigmatismo regular y presbicia). No simula cataratas, queratocono, ambliopía, enfermedades de retina ni astigmatismos irregulares — en esos casos la visión real puede ser muy distinta.',
  },
];

export default function Page() {
  return (
    <main className="container py-10 md:py-16">
      <FaqJsonLd items={FAQ_ITEMS} />
      <WebApplicationJsonLd />

      <header className="mx-auto max-w-2xl text-center">
        <p className="text-brand inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
          <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
          Herramienta gratuita
        </p>
        <h1 className="text-foreground mt-4 text-balance font-serif text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl">
          Simulador de <span className="italic">visión</span> según tu receta
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-balance text-base md:text-lg">
          {DESCRIPTION.replace(' Gratis.', '')} Todo corre en tu navegador: tu
          receta no se guarda ni se envía a ningún lado.
        </p>
      </header>

      <section className="mt-12 md:mt-16" aria-label="Probá cómo ves">
        <VisionSimulator />
      </section>

      <DisclaimerBlock />
      <ConditionsBlock />
      <HowItWorksBlock />
      <FaqBlock />

      <section className="mx-auto mt-16 max-w-2xl text-center">
        <h2 className="text-foreground font-serif text-2xl font-medium tracking-tight md:text-3xl">
          ¿Listo para ver bien?
        </h2>
        <p className="text-muted-foreground mt-3 text-base">
          Elegí tu armazón y lo hacemos con tu graduación.
        </p>
        <Link
          href="/anteojos-de-receta"
          className="bg-foreground text-background hover:bg-foreground/90 mt-5 inline-flex items-center rounded-lg px-6 py-3 text-sm font-medium transition-colors"
        >
          Ver anteojos de receta
        </Link>
      </section>
    </main>
  );
}

/** Disclaimer YMYL — texto validado por optical-expert (2026-06-11). */
function DisclaimerBlock() {
  return (
    <aside className="border-border/60 bg-muted/40 mx-auto mt-12 max-w-2xl rounded-xl border p-5 text-sm">
      <p className="text-foreground font-semibold">
        Esto es una simulación aproximada, no un estudio de tu visión.
      </p>
      <p className="text-muted-foreground mt-2">
        Mostramos cómo se vería el mundo con un error refractivo como el de tu
        receta, usando un modelo óptico simplificado. La percepción real varía
        según cada persona (tamaño de pupila, adaptación, iluminación). No simula
        condiciones como cataratas, queratocono, ambliopía (&ldquo;ojo
        vago&rdquo;), enfermedades de retina ni astigmatismos irregulares — en
        esos casos la visión real puede ser muy distinta a lo que ves acá. Esta
        herramienta es informativa y no reemplaza la consulta con un médico
        oftalmólogo. Para anteojos recetados necesitás una receta vigente.
      </p>
    </aside>
  );
}

function ConditionsBlock() {
  const conditions = [
    {
      title: '¿Cómo ve una persona con miopía?',
      body: 'Borroso de lejos, nítido de cerca. Cuanto más alta la esfera negativa, más cerca queda el punto donde todavía se ve bien. De noche empeora: la pupila se dilata y el desenfoque crece — probalo cambiando a la escena nocturna.',
      href: '/guias/miopia',
      linkLabel: 'Guía completa de miopía',
    },
    {
      title: '¿Cómo ve una persona con astigmatismo?',
      body: 'Las letras se ven dobles o con "fantasma" en una dirección, y las luces de noche se estiran en rayas. Es el efecto del cilindro y el eje: probá cargar un cilindro y mover el eje en la escena nocturna para ver cómo cambian las luces.',
      href: '/guias/astigmatismo',
      linkLabel: 'Guía completa de astigmatismo',
    },
    {
      title: '¿Cómo ve alguien con hipermetropía o presbicia?',
      body: 'El hipermétrope joven suele ver nítido compensando con esfuerzo (y termina el día con fatiga o dolor de cabeza). Con la presbicia, el brazo "se queda corto": el menú de cerca se vuelve ilegible. Cargá una ADD y mirá la escena de cerca.',
      href: '/guias/presbicia',
      linkLabel: 'Guía completa de presbicia',
    },
  ];
  return (
    <section className="mx-auto mt-16 max-w-2xl">
      <div className="space-y-8">
        {conditions.map((c) => (
          <div key={c.href}>
            <h2 className="text-foreground font-serif text-2xl font-medium tracking-tight">
              {c.title}
            </h2>
            <p className="text-muted-foreground mt-2 text-base">{c.body}</p>
            <Link
              href={c.href}
              className="text-brand mt-2 inline-block text-sm font-medium underline-offset-4 hover:underline"
            >
              {c.linkLabel} →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorksBlock() {
  return (
    <section className="mx-auto mt-16 max-w-2xl">
      <h2 className="text-foreground font-serif text-2xl font-medium tracking-tight md:text-3xl">
        Cómo funciona el simulador
      </h2>
      <p className="text-muted-foreground mt-3 text-base">
        Usamos óptica geométrica: cada valor de tu receta define cuánto desenfoque
        produce tu ojo en cada dirección, y a qué distancia. La esfera desenfoca
        parejo; el cilindro y el eje desenfocan en una orientación (por eso el
        astigmatismo &ldquo;estira&rdquo; las luces); la ADD describe lo que falta
        para enfocar de cerca. El simulador también modela la acomodación — el
        enfoque natural del ojo — que explica por qué un miope ve bien de cerca
        sin anteojos. Si no sabés qué significa cada valor,{' '}
        <Link
          href="/guias/como-leer-receta-anteojos"
          className="text-brand underline-offset-4 hover:underline"
        >
          acá te enseñamos a leer tu receta
        </Link>
        .
      </p>
    </section>
  );
}

function FaqBlock() {
  return (
    <section className="mx-auto mt-16 max-w-2xl">
      <h2 className="text-foreground font-serif text-2xl font-medium tracking-tight md:text-3xl">
        Preguntas frecuentes
      </h2>
      <dl className="mt-6 space-y-5">
        {FAQ_ITEMS.map((item) => (
          <div
            key={item.id}
            className="border-border/60 bg-background rounded-lg border p-4"
          >
            <dt className="text-foreground text-sm font-semibold">{item.question}</dt>
            <dd className="text-muted-foreground mt-2 text-sm">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Schema WebApplication (HealthApplication, gratis). Sin matrícula (decisión 2026-06-09). */
function WebApplicationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: TITLE,
    description: DESCRIPTION,
    url: `https://opticacarballo.com.ar/${SLUG}`,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'ARS' },
    provider: {
      '@type': 'Organization',
      name: 'Óptica Carballo',
      url: 'https://opticacarballo.com.ar',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
