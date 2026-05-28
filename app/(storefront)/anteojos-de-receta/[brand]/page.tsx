import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BrandCatalogPage } from '@/components/catalog/brand-page';
import { CATEGORIES } from '@/lib/catalog/categories';
import { buildBrandMetadata } from '@/lib/catalog/metadata';
import {
  fetchBrandPage,
  getStaticBrandParams,
} from '@/lib/catalog/queries';

const CATEGORY = CATEGORIES.rx;

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
  return buildBrandMetadata(CATEGORY, brand);
}

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { brand } = await params;
  const data = await fetchBrandPage(brand, CATEGORY);
  if (!data) notFound();

  return (
    <BrandCatalogPage
      category={CATEGORY}
      brand={data.brand}
      products={data.products}
    />
  );
}
