import Image from 'next/image';
import Link from 'next/link';
import { BrandStorySection } from '@/components/brand/brand-story-section';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { CatalogJsonLd } from '@/components/seo/catalog-jsonld';
import {
  ProductCard,
  type ProductCardData,
} from '@/components/product/product-card';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { cn } from '@/lib/utils';
import {
  getBrandAssetUrl,
  shouldInvertLogo,
} from '@/lib/storage/brand-asset-url';
import type { CategoryConfig } from '@/lib/catalog/categories';
import type {
  BrandPageData,
  ProductCardSource,
} from '@/lib/catalog/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

function toCardData(
  p: ProductCardSource,
  hrefPrefix: string,
  categorySlug: string,
  brandSlug: string,
): ProductCardData {
  const inStock = p.variants.filter((v) => v.is_active && v.stock_qty > 0);
  const sortedImages = [...(p.images ?? [])].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.sort_order - b.sort_order;
  });
  return {
    slug: p.slug,
    name: p.name,
    shortDescription: p.short_description,
    minPriceCents:
      inStock.length > 0 ? Math.min(...inStock.map((v) => v.price_cents)) : null,
    inStockCount: inStock.length,
    primaryImagePath: sortedImages[0]?.storage_path ?? null,
    secondaryImagePath: sortedImages[1]?.storage_path ?? null,
    href: `${hrefPrefix}/${p.slug}`,
    categorySlug,
    brandSlug,
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
  const hrefPrefix = `/${category.slug}/${brand.slug}`;
  const items = products.map((p) =>
    toCardData(p, hrefPrefix, category.slug, brand.slug),
  );

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

      <RevealOnScroll as="article" className="mb-10 max-w-3xl">
        {brand.logo_url && (
          <div className="mb-6 flex h-14 items-center md:h-16">
            <Image
              src={getBrandAssetUrl(brand.logo_url)}
              alt={brand.name}
              width={240}
              height={80}
              className={cn(
                'h-12 w-auto object-contain md:h-14',
                shouldInvertLogo(brand.logo_url, 'light-bg') && 'brightness-0',
              )}
              priority
            />
          </div>
        )}
        <h1 className="text-balance font-serif text-5xl font-medium leading-[1.05] tracking-[-0.02em] md:text-6xl lg:text-7xl">
          {category.name} <span className="italic font-normal">{brand.name}</span>
        </h1>
        {brand.description && (
          <p className="text-muted-foreground text-balance text-base md:text-lg">
            {brand.description}
          </p>
        )}
      </RevealOnScroll>

      <BrandStorySection brandSlug={brand.slug} brandName={brand.name} />

      {items.length === 0 ? (
        <p className="text-muted-foreground">
          Todavía no hay productos cargados de {brand.name} en esta categoría.
        </p>
      ) : (
        <section
          aria-label={`Productos de ${brand.name} en ${category.name.toLowerCase()}`}
          className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 md:gap-x-10 md:gap-y-20"
        >
          {items.map((item, idx) => (
            <RevealOnScroll key={item.slug} delay={60 * idx} className="h-full">
              <ProductCard product={item} />
            </RevealOnScroll>
          ))}
        </section>
      )}
    </main>
  );
}
