'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CatalogFilterBar } from '@/components/catalog/catalog-filter-bar';
import { CatalogSort } from '@/components/catalog/catalog-sort';
import { normalizeSort, sortCatalog, type SortValue } from '@/lib/catalog/sort';
import {
  filterByPriceBucket,
  normalizePriceBucket,
  parseCsvParam,
  type PriceBucketValue,
} from '@/lib/catalog/filters';
import { ProductCard } from '@/components/product/product-card';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import type { FilteredCatalogCard } from '@/lib/catalog/queries';
import type { CategoryConfig } from '@/lib/catalog/categories';

type BaseProps = {
  category: CategoryConfig;
  /** Catálogo COMPLETO de la categoría (sin filtrar). El filtrado por
   * forma/marca/precio/orden se hace client-side leyendo la URL. */
  products: FilteredCatalogCard[];
  availableShapes: string[];
  availableBrands: { slug: string; name: string }[];
};

/**
 * Vista del catálogo de una categoría con filtros client-side.
 *
 * Antes el filtrado era server-side (la page leía `searchParams`), lo que
 * volvía la ruta DINÁMICA: cada visita renderizaba en el server (TTFB 1-2s)
 * y el ISR de `revalidate = 300` no aplicaba. Ahora la page es ISR (sirve
 * HTML cacheado del catálogo completo) y los filtros se aplican acá, leyendo
 * la URL con `useSearchParams` — además los chips responden al instante, sin
 * round-trip al server (audit perf 2026-06-11).
 *
 * SEO: el HTML estático contiene el catálogo completo sin filtrar (el
 * fallback de Suspense en la page renderiza `CategoryCatalogView` sin hooks
 * de URL). Las URLs filtradas (`?forma=`) canonicalizan a la base; las
 * formas con página SEO propia siguen en rutas dedicadas (ej `/cat-eye`).
 *
 * Usado por:
 * - Filtros manuales del usuario en `/anteojos-de-sol` y `/anteojos-de-receta`.
 * - Iter 2 del recomendador de monturas: el CTA al final del análisis linkea acá.
 */
export function CategoryFilteredPage(props: BaseProps) {
  const searchParams = useSearchParams();

  const formaParam = searchParams.get('forma') ?? undefined;
  const marcaParam = searchParams.get('marca') ?? undefined;
  const precioParam = searchParams.get('precio') ?? undefined;
  const ordenParam = searchParams.get('orden') ?? undefined;

  const selectedShapes = parseCsvParam(formaParam);
  const selectedBrands = parseCsvParam(marcaParam);
  const selectedPrice = normalizePriceBucket(precioParam);
  const sort = normalizeSort(ordenParam);

  const filtered = useMemo(() => {
    const shapes = parseCsvParam(formaParam);
    const brands = parseCsvParam(marcaParam);
    let list = props.products;
    if (shapes.length > 0) {
      list = list.filter(
        (p) => p.frameShape != null && shapes.includes(p.frameShape),
      );
    }
    if (brands.length > 0) {
      list = list.filter((p) => brands.includes(p.brandSlug));
    }
    return sortCatalog(
      filterByPriceBucket(list, normalizePriceBucket(precioParam)),
      normalizeSort(ordenParam),
    );
  }, [props.products, formaParam, marcaParam, precioParam, ordenParam]);

  return (
    <CategoryCatalogView
      category={props.category}
      products={filtered}
      availableShapes={props.availableShapes}
      availableBrands={props.availableBrands}
      selectedShapes={selectedShapes}
      selectedBrands={selectedBrands}
      selectedPrice={selectedPrice}
      sort={sort}
    />
  );
}

type ViewProps = BaseProps & {
  selectedShapes: string[];
  selectedBrands: string[];
  selectedPrice: PriceBucketValue | null;
  sort: SortValue;
};

/**
 * Vista pura (sin `useSearchParams`): recibe la selección ya resuelta.
 * Sirve también como fallback de Suspense en la page — ahí se renderiza en
 * el HTML estático con el catálogo completo y sin filtros, para que el grid
 * entero quede indexable.
 */
export function CategoryCatalogView({
  category,
  products,
  availableShapes,
  availableBrands,
  selectedShapes,
  selectedBrands,
  selectedPrice,
  sort,
}: ViewProps) {
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
        currentSort={sort}
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
            {products.length > 1 && (
              <CatalogSort
                selected={sort}
                selectedShapes={selectedShapes}
                selectedBrands={selectedBrands}
                selectedPrice={selectedPrice}
              />
            )}
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
            className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 md:gap-x-10 md:gap-y-20 lg:grid-cols-4"
          >
            {products.map((p, idx) => (
              <RevealOnScroll key={p.slug} delay={(idx % 3) * 70} className="h-full">
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
