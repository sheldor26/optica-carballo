import type { Metadata } from 'next';
import Link from 'next/link';
import { ScanLine } from 'lucide-react';
import { ManualPrescriptionForm } from '@/components/tools/manual-prescription-form';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';

const SLUG = 'cargar-receta';
const TITLE = 'Cargá tu receta a mano';
const DESCRIPTION =
  'Ingresá los valores de tu receta oftalmológica a mano. Para casos simples (monofocal) podés guardar y buscar anteojos online. Si tu receta es compleja, te derivamos al lector IA o WhatsApp.';

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
          Carga manual
        </p>
        <h1 className="text-foreground mt-4 text-balance font-serif text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl">
          Cargá tu <span className="italic">receta</span> a mano
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-balance text-base md:text-lg">
          Ingresá los valores tal como aparecen en tu receta. Al lado del campo
          DNP tenés el medidor con IA por si no la sabés.
        </p>

        <Link
          href="/lector-de-receta"
          className="text-muted-foreground hover:text-foreground mt-6 inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline"
        >
          <ScanLine className="size-4" />
          ¿Preferís escanear tu receta con IA?
        </Link>
      </header>

      <section className="mx-auto mt-12 max-w-2xl md:mt-16">
        <ManualPrescriptionForm />
      </section>
    </main>
  );
}
