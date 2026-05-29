import type { Metadata } from 'next';
import { GenderCatalogPage } from '@/components/catalog/gender-catalog-page';
import { CATEGORIES } from '@/lib/catalog/categories';
import { buildCategoryGenderMetadata } from '@/lib/catalog/metadata';
import { fetchCategoryByGender } from '@/lib/catalog/queries';

const CATEGORY = CATEGORIES.rx;
const TARGET = 'hombre' as const;

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return buildCategoryGenderMetadata({ category: CATEGORY, target: TARGET });
}

export default async function Page() {
  const products = await fetchCategoryByGender({
    categorySlug: CATEGORY.slug,
    target: TARGET,
  });
  return <GenderCatalogPage category={CATEGORY} target={TARGET} products={products} />;
}
