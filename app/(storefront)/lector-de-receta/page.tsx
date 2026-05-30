import type { Metadata } from 'next';
import Link from 'next/link';
import { Edit } from 'lucide-react';
import { PrescriptionReader } from '@/components/tools/prescription-reader';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';

const SLUG = 'lector-de-receta';
const TITLE = 'Lector de receta con IA';
const DESCRIPTION =
  'Subí la foto o PDF de tu receta oftalmológica y nuestro asistente automático lee los valores (OD, OI, esfera, cilindro, eje, DNP) para que no tengas que cargarlos a mano. La receta no se guarda.';

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
          Lector de <span className="italic">receta</span> con IA
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-balance text-base md:text-lg">
          {DESCRIPTION}
        </p>

        <Link
          href="/cargar-receta"
          className="text-muted-foreground hover:text-foreground mt-6 inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline"
        >
          <Edit className="size-4" />
          ¿Preferís cargarla a mano?
        </Link>
      </header>

      <section className="mt-12 md:mt-16">
        <PrescriptionReader />
      </section>

      <FaqBlock />
    </main>
  );
}

function FaqBlock() {
  const items = [
    {
      q: '¿Guardan mi receta?',
      a: 'No. La receta se procesa y se descarta inmediatamente después de extraer los datos. No queda almacenada en nuestros servidores ni en bases de datos. El proveedor de IA (Anthropic) tampoco la retiene.',
    },
    {
      q: '¿Qué precisión tiene la lectura?',
      a: 'Es una transcripción automática que puede tener errores, sobre todo en recetas manuscritas o fotos de mala calidad. Por eso te pedimos que verifiques cada valor antes de continuar. La óptica regente matriculada revisa cada pedido antes de armar las lentes.',
    },
    {
      q: '¿Qué pasa si mi receta es para multifocales, bifocales o tengo graduación elevada?',
      a: 'Si detectamos cualquiera de estos casos, te redirigimos a WhatsApp para coordinar atención presencial. Estos lentes requieren mediciones que solo podemos tomar en la óptica.',
    },
    {
      q: '¿Qué formatos de archivo aceptan?',
      a: 'JPG, PNG, WebP o PDF, hasta 10MB. Si tu foto está en formato HEIC (iPhone), convertila a JPG primero (configurable en Ajustes → Cámara → "Más compatible").',
    },
    {
      q: '¿Mi receta vencida sirve?',
      a: 'Las recetas oftalmológicas son válidas por 1 año. Si tu receta es más vieja, te recomendamos un control con tu oftalmólogo para asegurar la salud de tu visión.',
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
