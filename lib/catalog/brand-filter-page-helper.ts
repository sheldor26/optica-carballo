import type { Metadata } from 'next';
import {
  fetchBrandPageByFilter,
  type BrandPageData,
  type ProductCardSource,
} from '@/lib/catalog/queries';
import { buildBrandFilterMetadata } from '@/lib/catalog/metadata';
import { getBrandFilter, type BrandFilter } from '@/lib/catalog/brand-filters';
import type { CategoryConfig } from '@/lib/catalog/categories';

/**
 * Resolver compartido para páginas hijas SEO de marca por filtro.
 * Usado por los 9 archivos `[brand]/[filterUrlSlug]/page.tsx`.
 *
 * Devuelve `null` si la marca o filtro no existen → la page llama `notFound()`.
 */
export async function resolveBrandFilterPage(args: {
  brandSlug: string;
  filterUrlSlug: string;
  category: CategoryConfig;
}): Promise<{
  data: { brand: BrandPageData; products: ProductCardSource[] };
  filter: BrandFilter;
} | null> {
  const filter = getBrandFilter(args.filterUrlSlug);
  if (!filter) return null;

  // El filter debe estar habilitado para esta categoría.
  const categoryKey = args.category.slug === 'anteojos-de-sol' ? 'sol' : 'receta';
  if (!filter.categories.includes(categoryKey)) return null;

  const data = await fetchBrandPageByFilter({
    brandSlug: args.brandSlug,
    category: args.category,
    filter: filter.filter,
  });

  if (!data) return null;

  return { data, filter };
}

export async function resolveBrandFilterMetadata(args: {
  brandSlug: string;
  filterUrlSlug: string;
  category: CategoryConfig;
}): Promise<Metadata> {
  const filter = getBrandFilter(args.filterUrlSlug);
  if (!filter) return { title: 'No encontrado' };

  return buildBrandFilterMetadata({
    category: args.category,
    brandSlug: args.brandSlug,
    filterLabel: filter.label,
    filterUrlSlug: filter.urlSlug,
    filterMetaPhrase: filter.metaPhrase,
  });
}
