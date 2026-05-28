import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetailPage } from '@/components/catalog/product-page';
import { CATEGORIES } from '@/lib/catalog/categories';
import { buildProductMetadata } from '@/lib/catalog/metadata';
import {
  fetchProductPage,
  getStaticProductParamsForCategory,
} from '@/lib/catalog/queries';

const CATEGORY = CATEGORIES.rx;

export const revalidate = 300;

type Params = { brand: string; product: string };

export function generateStaticParams() {
  return getStaticProductParamsForCategory(CATEGORY);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { brand, product } = await params;
  return buildProductMetadata(CATEGORY, brand, product);
}

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { brand, product: productSlug } = await params;
  const product = await fetchProductPage(brand, productSlug, CATEGORY);
  if (!product) notFound();

  return <ProductDetailPage category={CATEGORY} product={product} />;
}
