import type { Metadata } from 'next';
import { BrandsSection } from '@/components/home/brands-section';
import { CategoriesSection } from '@/components/home/categories-section';
import { HomeHero } from '@/components/home/home-hero';
import { ValueProps } from '@/components/home/value-props';
import { OrganizationJsonLd } from '@/components/seo/organization-jsonld';
import { WebsiteJsonLd } from '@/components/seo/website-jsonld';
import { CATEGORIES } from '@/lib/catalog/categories';
import { buildHomeMetadata } from '@/lib/catalog/metadata';
import {
  fetchAllActiveBrands,
  fetchCategoryIndex,
} from '@/lib/catalog/queries';

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return buildHomeMetadata();
}

export default async function HomePage() {
  const [solBrands, rxBrands, allBrands] = await Promise.all([
    fetchCategoryIndex(CATEGORIES.sol),
    fetchCategoryIndex(CATEGORIES.rx),
    fetchAllActiveBrands(),
  ]);

  return (
    <>
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <HomeHero />
      <CategoriesSection solBrands={solBrands} rxBrands={rxBrands} />
      <BrandsSection brands={allBrands} />
      <ValueProps />
    </>
  );
}
