import type { Metadata } from 'next';
import { CategoryIndexPage } from '@/components/catalog/category-index-page';
import { CATEGORIES } from '@/lib/catalog/categories';
import { buildCategoryIndexMetadata } from '@/lib/catalog/metadata';
import { fetchCategoryIndex } from '@/lib/catalog/queries';

const CATEGORY = CATEGORIES.sol;

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const brands = await fetchCategoryIndex(CATEGORY);
  return buildCategoryIndexMetadata(
    CATEGORY,
    brands.map((b) => b.name),
  );
}

export default async function Page() {
  const brands = await fetchCategoryIndex(CATEGORY);
  return <CategoryIndexPage category={CATEGORY} brands={brands} />;
}
