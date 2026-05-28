import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { CatalogJsonLd } from '@/components/seo/catalog-jsonld';
import {
  ProductCard,
  type ProductCardData,
} from '@/components/product/product-card';
import type { CategoryConfig } from '@/lib/catalog/categories';
import type {
  BrandPageData,
  ProductCardSource,
} from '@/lib/catalog/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

function toCardData(p: ProductCardSource): ProductCardData {
  const inStock = p.variants.filter((v) => v.is_active && v.stock_qty > 0);
  return {
    slug: p.slug,
    name: p.name,
    shortDescription: p.short_description,
    minPriceCents:
      inStock.length > 0 ? Math.min(...inStock.map((v) => v.price_cents)) : null,
    inStockCount: inStock.length,
  };
}

export function BrandCatalogPage({
  category,
  brand,
  products,
}: {
  category: CategoryConfig;
  brand: BrandPageData;
  products: ProductCardSource[];
}) {
  const pageUrl = `${SITE_URL}/${category.slug}/${brand.slug}`;
  const items = products.map(toCardData);

  return (
    <main className="container py-8 md:py-12">
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: SITE_URL },
          { name: category.name, url: `${SITE_URL}/${category.slug}` },
          { name: brand.name, url: pageUrl },
        ]}
      />
      <CatalogJsonLd
        brandName={brand.name}
        brandDescription={brand.description}
        categoryName={category.name}
        pageUrl={pageUrl}
        products={items.map((p) => ({
          name: p.name,
          slug: p.slug,
          minPriceCents: p.minPriceCents,
          inStockCount: p.inStockCount,
        }))}
      />

      <nav aria-label="Breadcrumb" className="text-muted-foreground mb-6 text-sm">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-foreground">
              Inicio
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={`/${category.slug}`} className="hover:text-foreground">
              {category.name}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground" aria-current="page">
            {brand.name}
          </li>
        </ol>
      </nav>

      <header className="mb-8 max-w-3xl">
        <div className="mb-3 flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {category.name} {brand.name}
          </h1>
          {brand.is_argentine && (
            <Badge variant="secondary" className="self-center">
              Marca local
            </Badge>
          )}
        </div>
        {brand.description && (
          <p className="text-muted-foreground text-base md:text-lg">
            {brand.description}
          </p>
        )}
      </header>

      {items.length === 0 ? (
        <p className="text-muted-foreground">
          Todavía no hay productos cargados de {brand.name} en esta categoría.
        </p>
      ) : (
        <section
          aria-label={`Productos de ${brand.name} en ${category.name.toLowerCase()}`}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {items.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </section>
      )}
    </main>
  );
}
