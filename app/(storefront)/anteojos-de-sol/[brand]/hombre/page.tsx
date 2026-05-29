import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BrandGenderCatalogPage } from '@/components/catalog/brand-gender-page';
import { CATEGORIES } from '@/lib/catalog/categories';
import { buildBrandGenderMetadata } from '@/lib/catalog/metadata';
import {
  fetchBrandPageByGender,
  getStaticBrandParams,
} from '@/lib/catalog/queries';

const CATEGORY = CATEGORIES.sol;
const TARGET = 'hombre' as const;

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
  return buildBrandGenderMetadata({
    category: CATEGORY,
    brandSlug: brand,
    target: TARGET,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { brand } = await params;
  const data = await fetchBrandPageByGender({
    brandSlug: brand,
    category: CATEGORY,
    target: TARGET,
  });
  if (!data) notFound();

  return (
    <BrandGenderCatalogPage
      category={CATEGORY}
      brand={data.brand}
      products={data.products}
      target={TARGET}
    />
  );
}
