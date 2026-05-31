import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { requireAuth } from '@/lib/auth/server';
import { listMyMatches } from '@/lib/swipe/actions';
import { fetchProductsBySlug } from '@/lib/swipe/queries';
import { formatPriceCents } from '@/lib/format/currency';
import { getProductImageUrl } from '@/lib/storage/product-image-url';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Mis matches | Óptica Carballo' },
  robots: { index: false, follow: false },
};

export default async function Page() {
  await requireAuth('/mi-cuenta/matches');
  const slugs = await listMyMatches();
  const products = await fetchProductsBySlug(slugs);

  return (
    <main className="container max-w-5xl py-8 md:py-12">
      <header className="mb-10">
        <p className="text-muted-foreground text-sm">
          <Link
            href="/mi-cuenta"
            className="hover:text-foreground underline-offset-2 hover:underline"
          >
            ← Volver a mi cuenta
          </Link>
        </p>
        <h1 className="mt-2 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl">
          Mis matches
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl text-balance text-sm md:text-base">
          Los anteojos que te gustaron en el descubridor con swipe. Guardados
          en tu cuenta — los ves desde cualquier dispositivo.
        </p>
      </header>

      {products.length === 0 ? (
        <div className="border-border rounded-xl border border-dashed p-10 text-center">
          <Heart className="text-muted-foreground mx-auto size-8" />
          <h2 className="text-foreground mt-3 text-base font-medium">
            Todavía no tenés matches
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Probá el descubridor de anteojos: deslizá a la derecha los modelos
            que te gusten y van a aparecer acá.
          </p>
          <Button asChild className="mt-5">
            <Link href="/descubrir">
              <Sparkles className="mr-2 size-4" />
              Empezar a deslizar
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <section
            aria-label="Tus matches"
            className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3"
          >
            {products.map((product) => (
              <Link
                key={product.slug}
                href={product.href}
                className="group/match flex flex-col"
              >
                <div className="bg-background relative aspect-[3/2] w-full overflow-hidden rounded-lg transition-shadow duration-500 group-hover/match:shadow-lg">
                  {product.primaryImagePath && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={getProductImageUrl(product.primaryImagePath)}
                      alt={product.name}
                      className="absolute inset-0 size-full object-contain transition-transform duration-700 group-hover/match:scale-[1.04]"
                      style={{ transform: `scale(${product.primaryImageScale})` }}
                    />
                  )}
                  <div className="bg-brand absolute right-3 top-3 flex size-9 items-center justify-center rounded-full text-zinc-950 shadow-sm">
                    <Heart className="size-4 fill-current" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-1.5">
                  <p className="text-foreground/60 text-[10px] font-medium uppercase tracking-[0.18em]">
                    {product.brandName}
                  </p>
                  <h3 className="text-foreground font-serif text-lg font-medium leading-tight tracking-tight md:text-xl">
                    {product.name}
                  </h3>
                  {product.minPriceCents !== null && (
                    <p className="text-muted-foreground text-sm tabular-nums">
                      {formatPriceCents(product.minPriceCents)}
                    </p>
                  )}
                  <span className="text-foreground/80 group-hover/match:text-foreground mt-2 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.18em] transition-colors">
                    Ver detalles
                    <ArrowRight className="size-3 transition-transform duration-300 group-hover/match:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </section>

          <div className="mt-12 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/descubrir">
                <Sparkles className="mr-2 size-4" />
                Seguir descubriendo
              </Link>
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
