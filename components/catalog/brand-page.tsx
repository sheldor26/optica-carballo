import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FaqAccordion } from '@/components/faqs/faq-accordion';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { CatalogJsonLd } from '@/components/seo/catalog-jsonld';
import { FaqJsonLd } from '@/components/seo/faq-jsonld';
import { ProductCard } from '@/components/product/product-card';
import { RelatedCategoriesBlock } from '@/components/catalog/related-categories-block';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { cn } from '@/lib/utils';
import {
  getBrandAssetUrl,
  shouldInvertLogo,
} from '@/lib/storage/brand-asset-url';
import { getBrandFaqs } from '@/lib/content/brand-faqs';
import { buildRelatedLinks } from '@/lib/site/related-categories';
import { toProductCardData } from '@/lib/catalog/to-product-card-data';
import type { CategoryConfig } from '@/lib/catalog/categories';
import type {
  BrandPageData,
  ProductCardSource,
} from '@/lib/catalog/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

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
    toProductCardData(p, hrefPrefix, category.slug, brand.slug),
  );
  const brandFaqs = getBrandFaqs(brand.slug);
  const relatedLinks = buildRelatedLinks({
    type: 'brand',
    categorySlug: category.slug,
    brandSlug: brand.slug,
  });

  // Links a las facetas marca+género. Solo se generan si hay al menos un
  // producto explícitamente male o female — una marca todo-unisex no produce
  // links porque ambas facetas mostrarían el mismo catálogo (duplicate content).
  const genders = new Set(
    products
      .map((p) =>
        typeof p.attributes?.gender === 'string' ? p.attributes.gender : null,
      )
      .filter((g): g is string => g !== null),
  );
  const genderFacetLinks = [
    genders.has('male')
      ? { label: `${brand.name} hombre`, href: `${hrefPrefix}/hombre` }
      : null,
    genders.has('female')
      ? { label: `${brand.name} mujer`, href: `${hrefPrefix}/mujer` }
      : null,
  ].filter((l): l is { label: string; href: string } => l !== null);

  return (
    <main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
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
      <FaqJsonLd items={brandFaqs} />

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

      {brand.logo_url && (
        <RevealOnScroll as="div" className="mb-10 flex items-center md:mb-12">
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
        </RevealOnScroll>
      )}

      {/* H1 oculto pero accesible: necesario para SEO + a11y aunque visualmente
          no lo mostremos (founder pidió quitar el título visible para que el
          foco visual sea 100% el grid de productos). */}
      <h1 className="sr-only">
        {category.name} {brand.name}
      </h1>

      {items.length === 0 ? (
        <p className="text-muted-foreground">
          Todavía no hay productos cargados de {brand.name} en esta categoría.
        </p>
      ) : (
        <section
          aria-label={`Productos de ${brand.name} en ${category.name.toLowerCase()}`}
          className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 md:gap-x-10 md:gap-y-20 lg:grid-cols-4"
        >
          {items.map((item, idx) => (
            <RevealOnScroll key={item.slug} delay={(idx % 3) * 70} className="h-full">
              <ProductCard product={item} />
            </RevealOnScroll>
          ))}
        </section>
      )}

      {genderFacetLinks.length > 0 && (
        <RevealOnScroll
          as="section"
          aria-labelledby="brand-gender-heading"
          className="mt-16 md:mt-20"
        >
          <h2
            id="brand-gender-heading"
            className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.18em]"
          >
            Explorá {brand.name} por género
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {genderFacetLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="border-border/60 bg-background hover:bg-accent hover:border-foreground/30 inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                >
                  {link.label}
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </RevealOnScroll>
      )}

      {brandFaqs.length > 0 && (
        <RevealOnScroll
          as="section"
          aria-labelledby="brand-faqs-heading"
          className="border-border/60 mt-20 border-t pt-12 md:mt-24"
        >
          <h2
            id="brand-faqs-heading"
            className="font-serif text-3xl font-medium leading-tight tracking-tight md:text-4xl"
          >
            Preguntas frecuentes sobre {brand.name}
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm md:text-base">
            Lo que más nos consultan sobre {brand.name}. Si no encontrás tu
            respuesta, escribinos por WhatsApp.
          </p>
          <div className="mt-6 max-w-3xl">
            <FaqAccordion items={brandFaqs} />
          </div>
        </RevealOnScroll>
      )}

      <RelatedCategoriesBlock links={relatedLinks} />
    </main>
  );
}
