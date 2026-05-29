import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { ProductCard } from '@/components/product/product-card';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { Button } from '@/components/ui/button';
import type { CategoryConfig } from '@/lib/catalog/categories';
import type { FilteredCatalogCard } from '@/lib/catalog/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

const GENDER_LABEL: Record<'hombre' | 'mujer', string> = {
  hombre: 'Hombre',
  mujer: 'Mujer',
};

/**
 * Sub-categoría global por género SIN marca, ej `/anteojos-de-sol/hombre`.
 * Trae productos `gender IN ('male' | 'female', 'unisex')` de TODAS las marcas.
 * Catálogo limpio (sin texto SEO largo) consistente con el patrón Shape.
 */
export function GenderCatalogPage({
  category,
  target,
  products,
}: {
  category: CategoryConfig;
  target: 'hombre' | 'mujer';
  products: FilteredCatalogCard[];
}) {
  const label = GENDER_LABEL[target];
  const pageUrl = `${SITE_URL}/${category.slug}/${target}`;
  const categoryUrl = `${SITE_URL}/${category.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: pageUrl,
    name: `${category.name} ${label}`,
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
          { name: label, url: pageUrl },
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
            {label}
          </li>
        </ol>
      </nav>

      <RevealOnScroll as="section" className="mb-10 max-w-3xl">
        <h1 className="text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
          {category.name}{' '}
          <span className="italic font-normal">{label}</span>
        </h1>
        <p className="text-muted-foreground mt-3 text-balance text-base md:text-lg">
          {products.length === 0
            ? `Todavía no hay productos cargados para ${target}.`
            : `${products.length} ${products.length === 1 ? 'modelo' : 'modelos'} de todas las marcas para ${target} y unisex.`}
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
          aria-label={`Productos ${category.name.toLowerCase()} para ${target}`}
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
                  href: `/${p.categorySlug}/${p.brandSlug}/${p.slug}`,
                  categorySlug: p.categorySlug,
                  brandSlug: p.brandSlug,
                }}
              />
            </RevealOnScroll>
          ))}
        </section>
      )}
    </main>
  );
}
