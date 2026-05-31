import type { Metadata } from 'next';
import Link from 'next/link';
import { SwipeDeck } from '@/components/swipe/swipe-deck';
import { fetchSwipeProducts } from '@/lib/swipe/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return {
    title: 'Descubrir anteojos — Óptica Carballo',
    description:
      'Encontrá tu anteojo ideal con un swipe. Probá nuestro descubridor interactivo: deslizá a la derecha los modelos que te gustan, a la izquierda los que no.',
    alternates: { canonical: `${SITE_URL}/descubrir` },
    openGraph: {
      title: 'Descubrir anteojos con un swipe — Óptica Carballo',
      description:
        'Encontrá tu anteojo ideal jugando. Swipe derecha = me gusta, izquierda = no.',
      url: `${SITE_URL}/descubrir`,
      type: 'website',
    },
  };
}

export default async function DescubrirPage() {
  const products = await fetchSwipeProducts();

  if (products.length === 0) {
    return (
      <main className="container py-16 md:py-24">
        <section className="mx-auto max-w-2xl text-center">
          <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
            <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
            Descubrir
          </p>
          <h1 className="text-foreground mt-6 text-balance font-serif text-5xl font-medium leading-[1.0] tracking-[-0.025em] md:text-6xl">
            Pronto, más modelos.
          </h1>
          <p className="text-muted-foreground mx-auto mt-7 max-w-xl text-balance text-base md:text-lg">
            Estamos sumando productos al catálogo. Volvé en unos días o explorá
            las{' '}
            <Link href="/marcas" className="text-foreground font-medium underline underline-offset-2">
              marcas que tenemos disponibles
            </Link>
            .
          </p>
        </section>
      </main>
    );
  }

  return <SwipeDeck initialProducts={products} />;
}
