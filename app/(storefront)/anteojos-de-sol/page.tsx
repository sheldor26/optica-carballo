import type { Metadata } from 'next';
import { Suspense } from 'react';
import {
  CategoryCatalogView,
  CategoryFilteredPage,
} from '@/components/catalog/category-filtered-page';
import { CATEGORIES } from '@/lib/catalog/categories';
import { buildCategoryIndexMetadata } from '@/lib/catalog/metadata';
import {
  fetchAvailableFrameShapes,
  fetchCategoryIndex,
  fetchProductsByCategoryAndShapes,
} from '@/lib/catalog/queries';

const CATEGORY = CATEGORIES.sol;

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const brands = await fetchCategoryIndex(CATEGORY);
  return buildCategoryIndexMetadata(
    CATEGORY,
    brands.map((b) => b.name),
  );
}

/**
 * Page ISR: NO lee `searchParams` (eso la volvía dinámica → render server en
 * cada visita, TTFB 1-2s). Sirve el catálogo COMPLETO cacheado y los filtros
 * (`?forma=&marca=&precio=&orden=`) se aplican client-side en
 * CategoryFilteredPage. El fallback de Suspense renderiza el grid completo en
 * el HTML estático (SEO) hasta que hidrata el árbol con `useSearchParams`.
 * Audit perf 2026-06-11.
 */
export default async function Page() {
  // Vista única de catálogo: SIEMPRE muestra los productos de la categoría
  // (founder 2026-06-02: "Ver todos" debe mostrar todos los modelos sin importar
  // marca ni forma). Sin filtros → catálogo completo; con filtros → refinado.
  const [products, availableShapes, brands] = await Promise.all([
    fetchProductsByCategoryAndShapes({
      categorySlug: CATEGORY.slug,
      frameShapes: [],
    }),
    fetchAvailableFrameShapes(CATEGORY.slug),
    fetchCategoryIndex(CATEGORY),
  ]);
  const availableBrands = brands.map((b) => ({ slug: b.slug, name: b.name }));

  return (
    <Suspense
      fallback={
        <CategoryCatalogView
          category={CATEGORY}
          products={products}
          availableShapes={availableShapes}
          availableBrands={availableBrands}
          selectedShapes={[]}
          selectedBrands={[]}
          selectedPrice={null}
          sort="relevancia"
        />
      }
    >
      <CategoryFilteredPage
        category={CATEGORY}
        products={products}
        availableShapes={availableShapes}
        availableBrands={availableBrands}
      />
    </Suspense>
  );
}
