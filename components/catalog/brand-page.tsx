import Image from 'next/image';
import Link from 'next/link';
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
          className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 md:gap-x-10 md:gap-y-20"
        >
          {items.map((item, idx) => (
            <RevealOnScroll key={item.slug} delay={(idx % 3) * 70} className="h-full">
              <ProductCard product={item} />
            </RevealOnScroll>
          ))}
        </section>
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
