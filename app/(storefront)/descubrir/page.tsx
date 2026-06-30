import type { Metadata } from 'next';
import Link from 'next/link';
import { SwipeDeck } from '@/components/swipe/swipe-deck';
import { ToolAuthGate } from '@/components/auth/tool-auth-gate';
import { fetchSwipeProducts } from '@/lib/swipe/queries';
import { listMyMatches } from '@/lib/swipe/actions';
import { getCurrentUser } from '@/lib/auth/server';

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
  const user = await getCurrentUser();

  // Gate DURO (founder 2026-06-29): hay que estar logueado para swipear, así los
  // modelos con los que matcheás quedan guardados en la cuenta.
  if (!user) {
    return (
      <ToolAuthGate
        eyebrow="Descubrir"
        title="Creá tu cuenta para descubrir tus anteojos"
        description="Deslizá entre los modelos y guardá los que te gusten: con tu cuenta, los anteojos con los que hacés match quedan guardados y los volvés a ver desde el celular o la compu."
        next="/descubrir"
        ctaLabel="Crear cuenta y empezar"
      />
    );
  }

  const [products, initialMatches] = await Promise.all([
    fetchSwipeProducts(),
    listMyMatches(),
  ]);

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

  return (
    <SwipeDeck
      initialProducts={products}
      isAuthenticated
      initialMatches={initialMatches}
    />
  );
}
