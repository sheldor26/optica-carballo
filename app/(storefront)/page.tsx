import type { Metadata } from 'next';
import { BrandsSection } from '@/components/home/brands-section';
import { CategoriesSection } from '@/components/home/categories-section';
import { HomeFaqs } from '@/components/home/home-faqs';
import { HomeHero } from '@/components/home/home-hero';
import { HomeTools } from '@/components/home/home-tools';
import { HowWeWork } from '@/components/home/how-we-work';
import { TrustMarquee } from '@/components/home/trust-marquee';
import { ValueProps } from '@/components/home/value-props';
import { NewsletterSection } from '@/components/newsletter/newsletter-section';
import { RecentlyViewed } from '@/components/recently-viewed/recently-viewed';
import { OrganizationJsonLd } from '@/components/seo/organization-jsonld';
import { WebsiteJsonLd } from '@/components/seo/website-jsonld';
import { CATEGORIES } from '@/lib/catalog/categories';
import { buildHomeMetadata } from '@/lib/catalog/metadata';
import {
  fetchAllActiveBrands,
  fetchCategoryIndex,
} from '@/lib/catalog/queries';
import { getBusinessInfo, getWhatsappLinkWithContext } from '@/lib/site/business';

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

  const { siteName } = getBusinessInfo();
  const whatsappLink = getWhatsappLinkWithContext('Hola, te consulto por anteojos.');

  return (
    <>
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <HomeHero siteName={siteName} whatsappLink={whatsappLink} />
      <TrustMarquee />
      {/* Orden CRO (2026-06-02): lo más vendedor —elegir sol/receta— arriba,
          apenas pasado el trust. El storytelling (ValueProps/HowWeWork) y el
          diferenciador IA (HomeTools) refuerzan DESPUÉS de mostrar el camino
          a producto. Antes Categorías caía tras ~2 pantallas de contenido
          editorial (audit CRO). */}
      <CategoriesSection solBrands={solBrands} rxBrands={rxBrands} />
      <ValueProps />
      <HowWeWork />
      <HomeTools />
      <BrandsSection brands={allBrands} />
      <RecentlyViewed heading="Estuviste mirando" limit={6} minToRender={3} />
      <HomeFaqs />
      <NewsletterSection />
    </>
  );
}
