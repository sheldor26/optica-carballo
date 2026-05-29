import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';
import { RecentlyViewed } from '@/components/recently-viewed/recently-viewed';
import { fetchProductsBySlugs } from '@/lib/catalog/queries';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';
import { readWishlistCookie } from '@/lib/wishlist/cookie';

const SLUG = 'favoritos';
const TITLE = 'Mis favoritos';
const DESCRIPTION =
  'Los anteojos que guardaste para volver a verlos más tarde. Tus favoritos se guardan en tu navegador, sin necesidad de cuenta.';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return {
    ...buildInfoPageMetadata({
      title: TITLE,
      description: DESCRIPTION,
      slug: SLUG,
    }),
    robots: { index: false, follow: false }, // página personal del usuario
  };
}

export default async function Page() {
  const entries = await readWishlistCookie();
  const slugs = entries.map((e) => e.slug);
  const products = await fetchProductsBySlugs(slugs);

  // Ordenar según el orden del wishlist (más reciente primero).
  const ordered = entries
    .map((e) => products.find((p) => p.slug === e.slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <main className="container py-10 md:py-16">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-brand inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
          <Heart className="size-3.5 fill-current" />
          Tu lista
        </p>
        <h1 className="text-foreground mt-4 text-balance font-serif text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl">
          Mis <span className="italic">favoritos</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-balance text-sm md:text-base">
          {ordered.length === 0
            ? 'Todavía no guardaste ningún anteojo.'
            : `${ordered.length} ${ordered.length === 1 ? 'modelo guardado' : 'modelos guardados'}.`}
        </p>
      </header>

      {ordered.length === 0 ? (
        <>
          <EmptyState />
          <RecentlyViewed
            heading="Mientras tanto, mirá lo que viste antes"
            limit={6}
            minToRender={2}
          />
        </>
      ) : (
        <section className="mx-auto mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16 md:mt-16 md:grid-cols-3 md:gap-x-10 md:gap-y-20">
          {ordered.map((p) => (
            <ProductCard
              key={p.slug}
              product={{
                slug: p.slug,
                name: p.name,
                shortDescription: p.shortDescription,
                minPriceCents: p.minPriceCents,
                inStockCount: p.inStockCount,
                primaryImagePath: p.primaryImagePath,
                secondaryImagePath: p.secondaryImagePath,
                href: `/${p.categorySlug}/${p.brandSlug}/${p.slug}`,
                categorySlug: p.categorySlug,
                brandSlug: p.brandSlug,
              }}
            />
          ))}
        </section>
      )}

      <PrivacyNote />
    </main>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto mt-12 max-w-md text-center md:mt-16">
      <div className="from-muted/30 to-background relative isolate overflow-hidden rounded-2xl bg-gradient-to-b p-10 md:p-16">
        <div
          aria-hidden="true"
          className="bg-brand/15 pointer-events-none absolute -right-20 -top-20 size-64 rounded-full blur-3xl"
        />
        <div className="relative">
          <div className="bg-background border-border/60 mx-auto flex size-16 items-center justify-center rounded-full border shadow-sm">
            <Heart className="text-foreground/70 size-7" />
          </div>
          <p className="text-foreground mt-6 font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Tu lista está <span className="italic">vacía</span>
          </p>
          <p className="text-muted-foreground mx-auto mt-3 max-w-sm text-balance text-sm">
            Tocá el corazón en los anteojos que te gusten y van a aparecer acá
            para que los encuentres rápido cuando vuelvas.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/anteojos-de-sol">Ver anteojos de sol</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/anteojos-de-receta">Ver anteojos de receta</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacyNote() {
  return (
    <p className="text-muted-foreground mx-auto mt-12 max-w-md text-center text-xs">
      Tus favoritos se guardan en tu navegador. Si cambiás de dispositivo o
      borrás cookies, la lista no se sincroniza.
    </p>
  );
}
