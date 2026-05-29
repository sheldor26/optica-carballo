import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BrandFilterCatalogPage } from '@/components/catalog/brand-filter-page';
import { CATEGORIES } from '@/lib/catalog/categories';
import { getStaticBrandParams } from '@/lib/catalog/queries';
import {
  resolveBrandFilterMetadata,
  resolveBrandFilterPage,
} from '@/lib/catalog/brand-filter-page-helper';

const CATEGORY = CATEGORIES.rx;
const FILTER_URL_SLUG = 'rectangular';

export const revalidate = 300;

type Params = { brand: string };

export function generateStaticParams() {
  return getStaticBrandParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { brand } = await params;
  return resolveBrandFilterMetadata({
    brandSlug: brand,
    filterUrlSlug: FILTER_URL_SLUG,
    category: CATEGORY,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { brand } = await params;
  const resolved = await resolveBrandFilterPage({
    brandSlug: brand,
    filterUrlSlug: FILTER_URL_SLUG,
    category: CATEGORY,
  });
  if (!resolved) notFound();

  return (
    <BrandFilterCatalogPage
      category={CATEGORY}
      brand={resolved.data.brand}
      products={resolved.data.products}
      filterLabel={resolved.filter.label}
      filterUrlSlug={resolved.filter.urlSlug}
      filterMetaPhrase={resolved.filter.metaPhrase}
    />
  );
}
