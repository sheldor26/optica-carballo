import Image from 'next/image';
import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { CatalogJsonLd } from '@/components/seo/catalog-jsonld';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { cn } from '@/lib/utils';
import {
  getBrandAssetUrl,
  shouldInvertLogo,
} from '@/lib/storage/brand-asset-url';
import { toProductCardData } from '@/lib/catalog/to-product-card-data';
import type { CategoryConfig } from '@/lib/catalog/categories';
import type {
  BrandPageData,
  ProductCardSource,
} from '@/lib/catalog/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

type Props = {
  category: CategoryConfig;
  brand: BrandPageData;
  products: ProductCardSource[];
  filterLabel: string;
  filterUrlSlug: string;
  filterMetaPhrase: string;
};

/**
 * Página hija SEO de marca filtrada por atributo —
 * `/anteojos-de-sol/[brand]/polarizados`, `/wayfarer`, etc.
 *
 * Patrón idéntico a `BrandGenderCatalogPage` pero por atributo arbitrario.
 * Reusa toCardData inline para no acoplar a ese componente.
 */
export function BrandFilterCatalogPage({
  category,
  brand,
  products,
  filterLabel,
  filterUrlSlug,
  filterMetaPhrase,
}: Props) {
  const pageUrl = `${SITE_URL}/${category.slug}/${brand.slug}/${filterUrlSlug}`;
  const parentUrl = `/${category.slug}/${brand.slug}`;
  const hrefPrefix = parentUrl;

  const items = products.map((p) =>
    toProductCardData(p, hrefPrefix, category.slug, brand.slug),
  );

  return (
    <main className="container py-8 md:py-12">
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: SITE_URL },
          { name: category.name, url: `${SITE_URL}/${category.slug}` },
          { name: brand.name, url: `${SITE_URL}${parentUrl}` },
          { name: filterLabel, url: pageUrl },
        ]}
      />
      <CatalogJsonLd
        brandName={`${brand.name} ${filterLabel}`}
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
          <li>
            <Link href={parentUrl} className="hover:text-foreground">
              {brand.name}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground" aria-current="page">
            {filterLabel}
          </li>
        </ol>
      </nav>

      <RevealOnScroll as="article" className="mb-10 max-w-3xl">
        {brand.logo_url && (
          <div className="mb-6 flex h-12 items-center md:h-14">
            <Image
              src={getBrandAssetUrl(brand.logo_url)}
              alt={brand.name}
              width={200}
              height={64}
              className={cn(
                'h-10 w-auto object-contain md:h-12',
                shouldInvertLogo(brand.logo_url, 'light-bg') && 'brightness-0',
              )}
              priority
            />
          </div>
        )}
        <h1 className="text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
          {category.name} {brand.name}{' '}
          <span className="italic font-normal">{filterLabel}</span>
        </h1>
        <p className="text-muted-foreground mt-4 text-balance text-base md:text-lg">
          {items.length > 0
            ? `${items.length} ${items.length === 1 ? 'modelo' : 'modelos'} de ${brand.name} ${filterMetaPhrase}.`
            : `Por ahora no tenemos modelos de ${brand.name} ${filterMetaPhrase}.`}
        </p>
      </RevealOnScroll>

      {items.length === 0 ? (
        <EmptyState brandName={brand.name} parentUrl={parentUrl} />
      ) : (
        <section
          aria-label={`Productos ${brand.name} ${filterLabel} en ${category.name.toLowerCase()}`}
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

function EmptyState({
  brandName,
  parentUrl,
}: {
  brandName: string;
  parentUrl: string;
}) {
  return (
    <div className="mx-auto mt-12 max-w-md text-center md:mt-16">
      <div className="from-muted/30 to-background relative isolate overflow-hidden rounded-2xl bg-gradient-to-b p-10 md:p-14">
        <p className="text-foreground font-serif text-2xl font-medium tracking-tight md:text-3xl">
          Mirá todos los <span className="italic">{brandName}</span>
        </p>
        <p className="text-muted-foreground mx-auto mt-3 max-w-sm text-balance text-sm">
          Aunque no tenemos modelos con ese filtro específico, el resto del
          catálogo de {brandName} puede tener opciones que te interesen.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href={parentUrl}>Ver todo el catálogo de {brandName}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
