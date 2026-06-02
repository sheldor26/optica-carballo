import type { Metadata } from 'next';
import { CategoryFilteredPage } from '@/components/catalog/category-filtered-page';
import { CategoryIndexPage } from '@/components/catalog/category-index-page';
import { normalizeSort, sortCatalog } from '@/lib/catalog/sort';
import {
  filterByPriceBucket,
  normalizePriceBucket,
  parseCsvParam,
} from '@/lib/catalog/filters';
import { CATEGORIES } from '@/lib/catalog/categories';
import { buildCategoryIndexMetadata } from '@/lib/catalog/metadata';
import {
  fetchAvailableFrameShapes,
  fetchCategoryIndex,
  fetchCategoryPriceRange,
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

type SearchParams = Promise<{
  forma?: string;
  marca?: string;
  precio?: string;
  orden?: string;
}>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const selectedShapes = parseCsvParam(params.forma);
  const selectedBrands = parseCsvParam(params.marca);
  const selectedPrice = normalizePriceBucket(params.precio);
  const sort = normalizeSort(params.orden);
  const hasFilters =
    selectedShapes.length > 0 || selectedBrands.length > 0 || selectedPrice !== null;

  // Si hay CUALQUIER filtro activo (forma/marca/precio), mostrar vista filtrada.
  if (hasFilters) {
    const [rawProducts, availableShapes, brands] = await Promise.all([
      fetchProductsByCategoryAndShapes({
        categorySlug: CATEGORY.slug,
        frameShapes: selectedShapes,
        brandSlugs: selectedBrands,
      }),
      fetchAvailableFrameShapes(CATEGORY.slug),
      fetchCategoryIndex(CATEGORY),
    ]);
    const products = sortCatalog(
      filterByPriceBucket(rawProducts, selectedPrice),
      sort,
    );
    return (
      <CategoryFilteredPage
        category={CATEGORY}
        products={products}
        availableShapes={availableShapes}
        selectedShapes={selectedShapes}
        availableBrands={brands.map((b) => ({ slug: b.slug, name: b.name }))}
        selectedBrands={selectedBrands}
        selectedPrice={selectedPrice}
        sort={sort}
      />
    );
  }

  // Sin filtros: vista clásica de marcas + chips de descubribilidad arriba.
  const [brands, priceRange, availableShapes] = await Promise.all([
    fetchCategoryIndex(CATEGORY),
    fetchCategoryPriceRange(CATEGORY.slug),
    fetchAvailableFrameShapes(CATEGORY.slug),
  ]);
  return (
    <CategoryIndexPage
      category={CATEGORY}
      brands={brands}
      priceRange={priceRange}
      availableShapes={availableShapes}
    />
  );
}
