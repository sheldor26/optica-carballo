import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { TiltSpotlightCard } from '@/components/ui/tilt-spotlight-card';
import { CATEGORIES } from '@/lib/catalog/categories';
import type { BrandWithProductCount } from '@/lib/catalog/queries';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321';

/** Construye URL pública para imagen de categoría en bucket `brands-shared`
 * (mismo bucket que el kit Vulk — no tiene sentido crear bucket separado
 * para 2-3 assets de categorías). */
function categoryImageUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/brands-shared/${path}`;
}

type CategoryStats = { brands: number; products: number };

function statsLine(stats: CategoryStats): string {
  if (stats.brands === 0) return 'Próximamente';
  const brandsLabel = stats.brands === 1 ? '1 marca' : `${stats.brands} marcas`;
  const productsLabel =
    stats.products === 1 ? '1 modelo' : `${stats.products} modelos`;
  return `${brandsLabel} · ${productsLabel}`;
}

function CategoryCard({
  slug,
  name,
  description,
  imagePath,
  stats,
}: {
  slug: string;
  name: string;
  description: string;
  imagePath: string | null;
  stats: CategoryStats;
}) {
  return (
    <Link href={`/${slug}`} className="group block h-full">
      <TiltSpotlightCard className="h-full" tiltDeg={4}>
        <Card className="flex h-full flex-col overflow-hidden transition-colors group-hover:border-foreground">
          <CardHeader>
            {imagePath ? (
              <div className="bg-muted relative aspect-[16/9] w-full overflow-hidden rounded-md">
                <Image
                  src={categoryImageUrl(imagePath)}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            ) : (
              <div
                className="bg-muted text-muted-foreground flex aspect-[16/9] w-full items-center justify-center rounded-md text-xs"
                aria-hidden="true"
              >
                Foto pendiente
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            <CardTitle className="text-xl">{name}</CardTitle>
            <p className="text-muted-foreground mt-2 text-sm">{description}</p>
          </CardContent>
          <CardFooter className="flex items-center justify-between pt-3">
            <span className="text-muted-foreground text-sm">{statsLine(stats)}</span>
            <span
              className="text-foreground inline-flex items-center gap-1 text-sm font-medium"
              aria-hidden="true"
            >
              Ver catálogo
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </CardFooter>
        </Card>
      </TiltSpotlightCard>
    </Link>
  );
}

function summarize(brands: BrandWithProductCount[]): CategoryStats {
  const totalProducts = brands.reduce((sum, b) => sum + b.productCount, 0);
  return { brands: brands.length, products: totalProducts };
}

export function CategoriesSection({
  solBrands,
  rxBrands,
}: {
  solBrands: BrandWithProductCount[];
  rxBrands: BrandWithProductCount[];
}) {
  return (
    <section className="container py-12 md:py-16">
      <RevealOnScroll>
        <h2 className="text-foreground font-serif text-3xl font-medium tracking-[-0.015em] md:text-4xl">
          Categorías
        </h2>
        <p className="text-muted-foreground mt-2 text-base">
          Elegí qué estás buscando.
        </p>
      </RevealOnScroll>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <RevealOnScroll delay={120}>
          <CategoryCard
            slug={CATEGORIES.sol.slug}
            name={CATEGORIES.sol.name}
            description="Anteojos de sol originales con protección UV. Marcas argentinas e internacionales."
            imagePath={CATEGORIES.sol.imagePath}
            stats={summarize(solBrands)}
          />
        </RevealOnScroll>
        <RevealOnScroll delay={220}>
          <CategoryCard
            slug={CATEGORIES.rx.slug}
            name={CATEGORIES.rx.name}
            description="Armazones para anteojos con cristales graduados según tu receta oftalmológica."
            imagePath={CATEGORIES.rx.imagePath}
            stats={summarize(rxBrands)}
          />
        </RevealOnScroll>
      </div>
    </section>
  );
}
