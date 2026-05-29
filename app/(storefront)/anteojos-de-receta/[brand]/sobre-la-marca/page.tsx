import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BrandAboutPage } from '@/components/catalog/brand-about-page';
import { CATEGORIES } from '@/lib/catalog/categories';
import { buildBrandAboutMetadata } from '@/lib/catalog/metadata';
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
  return buildBrandAboutMetadata(CATEGORY, brand);
}

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { brand } = await params;
  const data = await fetchBrandPage(brand, CATEGORY);
  if (!data) notFound();
  if (!data.brand.seo_intro && !data.brand.seo_outro) notFound();
  return <BrandAboutPage category={CATEGORY} brand={data.brand} />;
}
