import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FrameShapeFilters } from '@/components/catalog/frame-shape-filters';
import { ProductCard } from '@/components/product/product-card';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import type { FilteredCatalogCard } from '@/lib/catalog/queries';
import type { CategoryConfig } from '@/lib/catalog/categories';

type Props = {
  category: CategoryConfig;
  products: FilteredCatalogCard[];
  availableShapes: string[];
  selectedShapes: string[];
};

/**
 * Vista filtrada del catálogo de una categoría (ej `/anteojos-de-sol?forma=X`).
 * Sustituye al CategoryIndexPage (vista de marcas) cuando hay filtros activos.
 * Muestra productos de TODAS las marcas que matchean la forma seleccionada.
 *
 * Usado por:
 * - Filtros manuales del usuario en `/anteojos-de-sol`.
 * - Iter 2 del recomendador de monturas: el CTA al final del análisis linkea acá.
 */
export function CategoryFilteredPage({
  category,
  products,
  availableShapes,
  selectedShapes,
}: Props) {
  return (
    <>
      <FrameShapeFilters
        availableShapes={availableShapes}
        selectedShapes={selectedShapes}
      />
      <main className="container py-8 md:py-12">
        <RevealOnScroll className="mb-8 max-w-3xl">
          <p className="text-muted-foreground text-sm">
            <Link
              href={`/${category.slug}`}
              className="hover:text-foreground underline-offset-2 hover:underline"
            >
              ← Ver todas las marcas
            </Link>
          </p>
          <h1 className="text-foreground mt-3 font-serif text-3xl font-medium tracking-tight md:text-4xl">
            {category.name}{' '}
            <span className="italic font-normal text-foreground/70">filtrados</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {products.length === 0
              ? 'No encontramos productos con esa forma. Probá con otra o limpiá los filtros.'
              : `${products.length} ${products.length === 1 ? 'modelo' : 'modelos'} en stock.`}
          </p>
        </RevealOnScroll>

        {products.length === 0 ? (
          <div className="border-border/60 bg-muted/20 mx-auto mt-12 max-w-md rounded-lg border p-8 text-center">
            <p className="text-foreground text-sm">
              No hay productos con esta combinación de filtros todavía.
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              Probá con otra forma o explorá las marcas.
            </p>
            <Button asChild className="mt-4" variant="outline">
              <Link href={`/${category.slug}`}>Ver todas las marcas</Link>
            </Button>
          </div>
        ) : (
          <section
            aria-label={`Productos filtrados de ${category.name.toLowerCase()}`}
            className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 md:gap-x-10 md:gap-y-20"
          >
            {products.map((p, idx) => (
              <RevealOnScroll key={p.slug} delay={60 * idx} className="h-full">
                <ProductCard
                  product={{
                    slug: p.slug,
                    name: p.name,
                    shortDescription: p.shortDescription,
                    minPriceCents: p.minPriceCents,
                    inStockCount: p.inStockCount,
                    primaryImagePath: p.primaryImagePath,
                    secondaryImagePath: p.secondaryImagePath,
                    primaryImageScale: p.primaryImageScale,
                    secondaryImageScale: p.secondaryImageScale,
                    sizeFit: p.sizeFit,
                    variants: p.variants,
                    href: `/${p.categorySlug}/${p.brandSlug}/${p.slug}`,
                    categorySlug: p.categorySlug,
                    brandSlug: p.brandSlug,
                  }}
                />
              </RevealOnScroll>
            ))}
          </section>
        )}
      </main>
    </>
  );
}
