import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShapeCatalogPage } from '@/components/catalog/shape-catalog-page';
import { CATEGORIES } from '@/lib/catalog/categories';
import { getBrandFilter } from '@/lib/catalog/brand-filters';
import { buildCategoryShapeMetadata } from '@/lib/catalog/metadata';
import { fetchCategoryByFilter } from '@/lib/catalog/queries';

const CATEGORY = CATEGORIES.sol;
const FILTER = getBrandFilter('aviador');

export const revalidate = 300;

export function generateMetadata(): Metadata {
  if (!FILTER) return { title: 'No encontrado' };
  return buildCategoryShapeMetadata({
    category: CATEGORY,
    filterLabel: FILTER.label,
    filterUrlSlug: FILTER.urlSlug,
    filterMetaPhrase: FILTER.metaPhrase,
  });
}

export default async function Page() {
  if (!FILTER) notFound();
  const products = await fetchCategoryByFilter({
    categorySlug: CATEGORY.slug,
    filter: FILTER.filter,
  });
  return <ShapeCatalogPage category={CATEGORY} filter={FILTER} products={products} />;
}
