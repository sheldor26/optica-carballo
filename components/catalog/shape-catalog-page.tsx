import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { ProductCard } from '@/components/product/product-card';
import { RelatedCategoriesBlock } from '@/components/catalog/related-categories-block';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { Button } from '@/components/ui/button';
import type { CategoryConfig } from '@/lib/catalog/categories';
import type { BrandFilter } from '@/lib/catalog/brand-filters';
import type { FilteredCatalogCard } from '@/lib/catalog/queries';
import { buildRelatedLinks } from '@/lib/site/related-categories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/**
 * Sub-categoría global por filtro SIN marca, ej `/anteojos-de-sol/aviador`.
 * Captura queries SEO genéricas — los productos vienen de TODAS las marcas
 * que matchean el filtro. Para mantener UX limpia (founder feedback previo:
 * "catálogo es catálogo"), NO se renderiza texto SEO largo acá — solo grid
 * de productos + H1 + breadcrumb + intro corta.
 */
export function ShapeCatalogPage({
  category,
  filter,
  products,
}: {
  category: CategoryConfig;
  filter: BrandFilter;
  products: FilteredCatalogCard[];
}) {
  const pageUrl = `${SITE_URL}/${category.slug}/${filter.urlSlug}`;
  const categoryUrl = `${SITE_URL}/${category.slug}`;
  const relatedLinks = buildRelatedLinks({
    type: 'shape',
    categorySlug: category.slug,
    filterUrlSlug: filter.urlSlug,
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: pageUrl,
    name: `${category.name} ${filter.label}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${SITE_URL}/${p.categorySlug}/${p.brandSlug}/${p.slug}`,
        name: p.name,
      })),
    },
  };

  return (
    <main className="container py-8 md:py-12">
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: SITE_URL },
          { name: category.name, url: categoryUrl },
          { name: filter.label, url: pageUrl },
        ]}
      />
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

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
            {filter.label}
          </li>
        </ol>
      </nav>

      <RevealOnScroll as="section" className="mb-10 max-w-3xl">
        <h1 className="text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
          {category.name}{' '}
          <span className="italic font-normal">{filter.label}</span>
        </h1>
        <p className="text-muted-foreground mt-3 text-balance text-base md:text-lg">
          {products.length === 0
            ? `Todavía no hay productos cargados con ${filter.metaPhrase}.`
            : `${products.length} ${products.length === 1 ? 'modelo' : 'modelos'} de todas las marcas con ${filter.metaPhrase}.`}
        </p>
      </RevealOnScroll>

      {products.length === 0 ? (
        <div className="border-border/60 bg-muted/20 mx-auto mt-12 max-w-md rounded-lg border p-8 text-center">
          <p className="text-foreground text-sm">
            No hay productos en esta categoría todavía.
          </p>
          <Button asChild className="mt-4" variant="outline">
            <Link href={`/${category.slug}`}>Ver todas las marcas</Link>
          </Button>
        </div>
      ) : (
        <section
          aria-label={`Productos ${category.name.toLowerCase()} ${filter.label.toLowerCase()}`}
          className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 md:gap-x-10 md:gap-y-20"
        >
          {products.map((p, idx) => (
            <RevealOnScroll key={p.slug} delay={60 * idx} className="h-full">
              <ProductCard
                product={{
                  slug: p.slug,
                  name: p.name,
                  shortDescription: p.shortDescription,
                  minPriceCents: p.minPriceCents,
                  inStockCount: p.inStockCount,
                  primaryImagePath: p.primaryImagePath,
                  secondaryImagePath: p.secondaryImagePath,
                  primaryImageScale: p.primaryImageScale,
                  secondaryImageScale: p.secondaryImageScale,
                  variants: p.variants,
                  href: `/${p.categorySlug}/${p.brandSlug}/${p.slug}`,
                  categorySlug: p.categorySlug,
                  brandSlug: p.brandSlug,
                }}
              />
            </RevealOnScroll>
          ))}
        </section>
      )}

      <RelatedCategoriesBlock links={relatedLinks} />
    </main>
  );
}
