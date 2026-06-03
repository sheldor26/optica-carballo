import type { Metadata } from 'next';
import { CategoryFilteredPage } from '@/components/catalog/category-filtered-page';
import { normalizeSort, sortCatalog } from '@/lib/catalog/sort';
import {
  filterByPriceBucket,
  normalizePriceBucket,
  parseCsvParam,
} from '@/lib/catalog/filters';
import { CATEGORIES } from '@/lib/catalog/categories';
import { buildCategoryIndexMetadata } from '@/lib/catalog/metadata';
import {
  fetchAvailableFrameShapes,
  fetchCategoryIndex,
  fetchProductsByCategoryAndShapes,
} from '@/lib/catalog/queries';

const CATEGORY = CATEGORIES.sol;

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const brands = await fetchCategoryIndex(CATEGORY);
  return buildCategoryIndexMetadata(
    CATEGORY,
    brands.map((b) => b.name),
  );
}

type SearchParams = Promise<{
  forma?: string;
  marca?: string;
  precio?: string;
  orden?: string;
}>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const selectedShapes = parseCsvParam(params.forma);
  const selectedBrands = parseCsvParam(params.marca);
  const selectedPrice = normalizePriceBucket(params.precio);
  const sort = normalizeSort(params.orden);

  // Vista única de catálogo: SIEMPRE muestra los productos de la categoría
  // (founder 2026-06-02: "Ver todos" debe mostrar todos los modelos sin importar
  // marca ni forma). Sin filtros → catálogo completo; con filtros → refinado.
  // Las marcas se navegan vía los chips de filtro + el mega-nav + /marcas (ya
  // no una grilla de marcas que obligue a elegir una antes de ver producto).
  const [rawProducts, availableShapes, brands] = await Promise.all([
    fetchProductsByCategoryAndShapes({
      categorySlug: CATEGORY.slug,
      frameShapes: selectedShapes,
      brandSlugs: selectedBrands,
    }),
    fetchAvailableFrameShapes(CATEGORY.slug),
    fetchCategoryIndex(CATEGORY),
  ]);
  const products = sortCatalog(
    filterByPriceBucket(rawProducts, selectedPrice),
    sort,
  );

  return (
    <CategoryFilteredPage
      category={CATEGORY}
      products={products}
      availableShapes={availableShapes}
      selectedShapes={selectedShapes}
      availableBrands={brands.map((b) => ({ slug: b.slug, name: b.name }))}
      selectedBrands={selectedBrands}
      selectedPrice={selectedPrice}
      sort={sort}
    />
  );
}
