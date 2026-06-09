import type { Metadata } from 'next';
import { PDMeasureTool } from '@/components/tools/pd-measure-tool';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';

const SLUG = 'medidor-de-dnp';
const TITLE = 'Medidor de DNP con IA';
const DESCRIPTION =
  'Medí tu Distancia Naso-Pupilar desde tu celular con una foto y una tarjeta de crédito como referencia. Verificamos la medida al armar tus anteojos. Gratis y sin guardar tu foto.';

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
          Medidor de <span className="italic">DNP</span> con IA
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-balance text-base md:text-lg">
          {DESCRIPTION}
        </p>
      </header>

      <section className="mt-12 md:mt-16">
        <PDMeasureTool />
      </section>

      <FaqBlock />
    </main>
  );
}

function FaqBlock() {
  const items = [
    {
      q: '¿Qué es la DNP y por qué importa?',
      a: 'La DNP (Distancia Naso-Pupilar) es la distancia entre tus pupilas en milímetros. Es un dato crítico para fabricar tus lentes: define dónde se ubica el centro óptico de cada cristal. Sin DNP correcta, los lentes no se centran bien y podés sentir cansancio visual.',
    },
    {
      q: '¿Por qué necesito una tarjeta de crédito?',
      a: 'La tarjeta es nuestra referencia de escala: mide 85.6mm de ancho según el estándar internacional ISO/IEC 7810. La IA detecta el ancho de la tarjeta en pixels y lo usa para calcular cuántos milímetros mide la distancia entre tus pupilas. Sin esa referencia conocida, no podemos sacar mm de una foto.',
    },
    {
      q: '¿Dónde apoyo la tarjeta exactamente?',
      a: 'Apoyala contra tus pómulos, debajo de los ojos, alineada con la base de la nariz. NO en la frente — está demasiado adelante y genera un error de paralaje que arruina la medición. La idea es que la tarjeta esté en el mismo plano vertical que tus pupilas.',
    },
    {
      q: '¿Para qué tipos de lentes sirve esta DNP?',
      a: 'Para monofocales (lejos o cerca). Para lentes multifocales o progresivos necesitamos también la altura pupilar, que solo se mide con el armazón puesto. En la óptica igual validamos y ajustamos cada DNP al armar tus lentes.',
    },
    {
      q: '¿Por qué piden confirmar que no tengo estrabismo, prismas o progresivos?',
      a: 'Estrabismo: el centro pupilar del ojo desviado no coincide con la línea visual real, el cálculo daría inservible. Prismas: requieren descentrado calculado manualmente. Progresivos: necesitan altura pupilar adicional. En cualquiera de estos casos, lo mejor es coordinar por WhatsApp para medir en persona.',
    },
    {
      q: '¿Guardan mi foto?',
      a: 'No. La foto se procesa en el momento y se descarta inmediatamente. No queda almacenada en nuestros servidores ni en bases de datos. El proveedor de IA (Anthropic) tampoco la retiene.',
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
