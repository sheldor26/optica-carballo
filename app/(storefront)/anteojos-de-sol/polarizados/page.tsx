import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShapeCatalogPage } from '@/components/catalog/shape-catalog-page';
import { CATEGORIES } from '@/lib/catalog/categories';
import { getBrandFilter } from '@/lib/catalog/brand-filters';
import { buildCategoryShapeMetadata } from '@/lib/catalog/metadata';
import { fetchProductsByCategoryAndShapes } from '@/lib/catalog/queries';
import { toPolarizedCatalog } from '@/lib/catalog/polarized';

const CATEGORY = CATEGORIES.sol;
const FILTER = getBrandFilter('polarizados');

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  if (!FILTER) return { title: 'No encontrado' };
  return buildCategoryShapeMetadata({
    category: CATEGORY,
    filterLabel: FILTER.label,
    filterUrlSlug: FILTER.urlSlug,
    filterMetaPhrase: FILTER.metaPhrase,
    filter: FILTER.filter,
  });
}

export default async function Page() {
  if (!FILTER) notFound();
  // Founder 2026-06-02: a /polarizados entra cualquier producto con AL MENOS una
  // variante polarizada, y la card representa SOLO esa(s) variante(s). Traemos
  // todo el catálogo y lo reducimos a las variantes polarizadas.
  const all = await fetchProductsByCategoryAndShapes({
    categorySlug: CATEGORY.slug,
    frameShapes: [],
  });
  const products = toPolarizedCatalog(all);
  return <ShapeCatalogPage category={CATEGORY} filter={FILTER} products={products} />;
}
