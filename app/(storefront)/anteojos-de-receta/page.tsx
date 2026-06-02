import type { Metadata } from 'next';
import { CategoryFilteredPage } from '@/components/catalog/category-filtered-page';
import { CategoryIndexPage } from '@/components/catalog/category-index-page';
import { normalizeSort, sortCatalog } from '@/lib/catalog/sort';
import { CATEGORIES } from '@/lib/catalog/categories';
import { buildCategoryIndexMetadata } from '@/lib/catalog/metadata';
import {
  fetchAvailableFrameShapes,
  fetchCategoryIndex,
  fetchCategoryPriceRange,
  fetchProductsByCategoryAndShapes,
} from '@/lib/catalog/queries';

const CATEGORY = CATEGORIES.rx;

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const brands = await fetchCategoryIndex(CATEGORY);
  return buildCategoryIndexMetadata(
    CATEGORY,
    brands.map((b) => b.name),
  );
}

type SearchParams = Promise<{ forma?: string; orden?: string }>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const selectedShapes = params.forma
    ? params.forma.split(',').filter((s) => s.length > 0)
    : [];
  const sort = normalizeSort(params.orden);

  if (selectedShapes.length > 0) {
    const [products, availableShapes] = await Promise.all([
      fetchProductsByCategoryAndShapes({
        categorySlug: CATEGORY.slug,
        frameShapes: selectedShapes,
      }),
      fetchAvailableFrameShapes(CATEGORY.slug),
    ]);
    return (
      <CategoryFilteredPage
        category={CATEGORY}
        products={sortCatalog(products, sort)}
        availableShapes={availableShapes}
        selectedShapes={selectedShapes}
        sort={sort}
      />
    );
  }

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
