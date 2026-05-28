import type { Metadata } from 'next';
import { BrandsSection } from '@/components/home/brands-section';
import { CategoriesSection } from '@/components/home/categories-section';
import { HomeHero } from '@/components/home/home-hero';
import { TrustMarquee } from '@/components/home/trust-marquee';
import { ValueProps } from '@/components/home/value-props';
import { OrganizationJsonLd } from '@/components/seo/organization-jsonld';
import { WebsiteJsonLd } from '@/components/seo/website-jsonld';
import { CATEGORIES } from '@/lib/catalog/categories';
import { buildHomeMetadata } from '@/lib/catalog/metadata';
import {
  fetchAllActiveBrands,
  fetchCategoryIndex,
  fetchHomeShowcaseProduct,
} from '@/lib/catalog/queries';
import { getBusinessInfo, getWhatsappLinkWithContext } from '@/lib/site/business';

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return buildHomeMetadata();
}

export default async function HomePage() {
  const [solBrands, rxBrands, allBrands, showcase] = await Promise.all([
    fetchCategoryIndex(CATEGORIES.sol),
    fetchCategoryIndex(CATEGORIES.rx),
    fetchAllActiveBrands(),
    fetchHomeShowcaseProduct(),
  ]);

  const { siteName } = getBusinessInfo();
  const whatsappLink = getWhatsappLinkWithContext('Hola, te consulto por anteojos.');

  return (
    <>
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <HomeHero
        showcase={showcase}
        siteName={siteName}
        whatsappLink={whatsappLink}
      />
      <TrustMarquee />
      <CategoriesSection solBrands={solBrands} rxBrands={rxBrands} />
      <BrandsSection brands={allBrands} />
      <ValueProps />
    </>
  );
}
