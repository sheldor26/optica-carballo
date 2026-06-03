import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CatalogFilterBar } from '@/components/catalog/catalog-filter-bar';
import { CatalogSort } from '@/components/catalog/catalog-sort';
import type { SortValue } from '@/lib/catalog/sort';
import type { PriceBucketValue } from '@/lib/catalog/filters';
import { ProductCard } from '@/components/product/product-card';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import type { FilteredCatalogCard } from '@/lib/catalog/queries';
import type { CategoryConfig } from '@/lib/catalog/categories';

type Props = {
  category: CategoryConfig;
  products: FilteredCatalogCard[];
  availableShapes: string[];
  selectedShapes: string[];
  availableBrands: { slug: string; name: string }[];
  selectedBrands: string[];
  selectedPrice: PriceBucketValue | null;
  sort: SortValue;
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
  availableBrands,
  selectedBrands,
  selectedPrice,
  sort,
}: Props) {
  // ¿Hay algún filtro activo? Sin filtros, esta vista es el catálogo COMPLETO
  // de la categoría (founder 2026-06-02: "Ver todos" debe mostrar todos los
  // modelos sin importar marca ni forma, no una grilla de marcas).
  const anyFilterActive =
    selectedShapes.length > 0 ||
    selectedBrands.length > 0 ||
    selectedPrice !== null;

  return (
    <>
      <CatalogFilterBar
        availableShapes={availableShapes}
        selectedShapes={selectedShapes}
        availableBrands={availableBrands}
        selectedBrands={selectedBrands}
        selectedPrice={selectedPrice}
      />
      <main className="container py-8 md:py-12">
        <RevealOnScroll className="mb-8 max-w-3xl">
          {anyFilterActive && (
            <p className="text-muted-foreground text-sm">
              <Link
                href={`/${category.slug}`}
                className="hover:text-foreground underline-offset-2 hover:underline"
              >
                ← Ver todos los modelos
              </Link>
            </p>
          )}
          <h1 className="text-foreground mt-3 font-serif text-3xl font-medium tracking-tight md:text-4xl">
            {category.name}
            {anyFilterActive && (
              <>
                {' '}
                <span className="italic font-normal text-foreground/70">
                  filtrados
                </span>
              </>
            )}
          </h1>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted-foreground text-sm">
              {products.length === 0
                ? 'No encontramos productos con estos filtros. Probá con otra combinación o limpialos.'
                : `${products.length} ${products.length === 1 ? 'modelo' : 'modelos'}.`}
            </p>
            {products.length > 1 && <CatalogSort selected={sort} />}
          </div>
        </RevealOnScroll>

        {products.length === 0 ? (
          <div className="border-border/60 bg-muted/20 mx-auto mt-12 max-w-md rounded-lg border p-8 text-center">
            <p className="text-foreground text-sm">
              No hay productos con esta combinación de filtros todavía.
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              Probá con otra combinación de filtros.
            </p>
            <Button asChild className="mt-4" variant="outline">
              <Link href={`/${category.slug}`}>Ver todos los modelos</Link>
            </Button>
          </div>
        ) : (
          <section
            aria-label={`${category.name} — ${products.length} modelos`}
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
                    brandName: p.brandName,
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
