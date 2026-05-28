import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { ProductJsonLd } from '@/components/seo/product-jsonld';
import { RelatedItemListJsonLd } from '@/components/seo/related-itemlist-jsonld';
import { ProductAttributes } from '@/components/product/product-attributes';
import { ProductCallouts } from '@/components/product/product-callouts';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductHighlights } from '@/components/product/product-highlights';
import { ProductIncludes } from '@/components/product/product-includes';
import { ProductMeasurements } from '@/components/product/product-measurements';
import { RelatedProducts } from '@/components/product/related-products';
import { VariantList } from '@/components/product/variant-list';
import { WhatsappCta } from '@/components/product/whatsapp-cta';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { formatPriceCents } from '@/lib/format/currency';
import { isPlaceholder } from '@/lib/catalog/placeholder';
import { isCheckoutEnabled } from '@/lib/features';
import { fetchRelatedProducts } from '@/lib/catalog/queries';
import type { CategoryConfig } from '@/lib/catalog/categories';
import type { ProductDetailData } from '@/lib/catalog/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

function extractFrameShape(attrs: Record<string, unknown>): string | null {
  const v = attrs.frame_shape;
  return typeof v === 'string' ? v : null;
}

function categorySubtitle(category: CategoryConfig, attrs: Record<string, unknown>): string {
  const gender = typeof attrs.gender === 'string' ? attrs.gender : null;
  const treatments = Array.isArray(attrs.lens_treatment)
    ? attrs.lens_treatment.filter((t): t is string => typeof t === 'string')
    : [];
  const isPolarized = treatments.includes('polarized');
  const prefix = category.slug === 'anteojos-de-sol' ? 'Anteojos de sol' : 'Anteojos de receta';
  const parts = [prefix];
  if (gender) parts.push(gender);
  if (category.slug === 'anteojos-de-sol' && isPolarized) parts.push('polarizados');
  return parts.join(' ');
}

export async function ProductDetailPage({
  category,
  product,
}: {
  category: CategoryConfig;
  product: ProductDetailData;
}) {
  const activeVariants = product.variants
    .filter((v) => v.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  const inStockVariants = activeVariants.filter((v) => v.stock_qty > 0);
  const isInStock = inStockVariants.length > 0;

  const prices = inStockVariants.map((v) => v.price_cents);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;
  const priceLabel =
    minPrice !== null && maxPrice !== null
      ? minPrice === maxPrice
        ? formatPriceCents(minPrice)
        : `Desde ${formatPriceCents(minPrice)}`
      : null;

  const pageUrl = `${SITE_URL}/${category.slug}/${product.brand.slug}/${product.slug}`;
  const brandUrl = `${SITE_URL}/${category.slug}/${product.brand.slug}`;
  const categoryUrl = `${SITE_URL}/${category.slug}`;
  const subtitle = categorySubtitle(category, product.attributes);

  const relatedProducts = await fetchRelatedProducts({
    excludeSlug: product.slug,
    categorySlug: category.slug,
    brandSlug: product.brand.slug,
    priceCents: minPrice !== null ? minPrice : null,
    frameShape: extractFrameShape(product.attributes),
  });

  return (
    <main className="container py-8 md:py-12">
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: SITE_URL },
          { name: category.name, url: categoryUrl },
          { name: product.brand.name, url: brandUrl },
          { name: product.name, url: pageUrl },
        ]}
      />
      {!isPlaceholder(product.name) && (
        <ProductJsonLd
          name={product.name}
          description={product.description ?? product.short_description}
          brandName={product.brand.name}
          brandUrl={brandUrl}
          pageUrl={pageUrl}
          imageUrl={null}
          offers={activeVariants.map((v) => ({
            priceCents: v.price_cents,
            stockQty: v.stock_qty,
            sku: v.sku,
          }))}
        />
      )}
      <RelatedItemListJsonLd products={relatedProducts} />

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
            <Link
              href={`/${category.slug}/${product.brand.slug}`}
              className="hover:text-foreground"
            >
              {product.brand.name}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <ProductGallery productName={product.name} images={product.images ?? []} />

        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Link
                href={`/${category.slug}/${product.brand.slug}`}
                className="text-muted-foreground hover:text-foreground text-sm font-medium uppercase tracking-wide"
              >
                {product.brand.name}
              </Link>
              {product.brand.is_argentine && (
                <Badge variant="secondary">Marca local</Badge>
              )}
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
              {product.name}
            </h1>
            <p className="text-muted-foreground mt-2 text-base font-medium md:text-lg">
              {subtitle}
            </p>
            {product.short_description && (
              <p className="text-muted-foreground mt-2 text-sm md:text-base">
                {product.short_description}
              </p>
            )}
            <ProductHighlights attributes={product.attributes} />
          </div>

          {priceLabel ? (
            <div className="border-border/60 from-muted/30 to-background rounded-xl border bg-gradient-to-br p-5">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Precio
              </p>
              <p className="text-foreground mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
                {priceLabel}
              </p>
              {isInStock && (
                <p className="text-muted-foreground mt-2 inline-flex items-center gap-1.5 text-xs">
                  <span className="size-1.5 rounded-full bg-green-600" />
                  En stock · envío a todo el país
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-base">Sin stock disponible</p>
          )}

          <VariantList
            showVariantCta={!isPlaceholder(product.name)}
            checkoutEnabled={isCheckoutEnabled()}
            productName={product.name}
            brandName={product.brand.name}
            variants={activeVariants.map((v) => ({
              id: v.id,
              sku: v.sku,
              priceCents: v.price_cents,
              stockQty: v.stock_qty,
              attributes: v.attributes,
            }))}
          />

          <ProductAttributes attributes={product.attributes} />

          <ProductMeasurements attributes={product.attributes} />

          <ProductIncludes attributes={product.attributes} />

          <WhatsappCta productName={product.name} inStock={isInStock} />
        </div>
      </div>

      {product.description && (
        <RevealOnScroll as="section" className="mt-20 max-w-3xl">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-[0.2em]">
            Sobre el producto
          </p>
          <h2 className="text-foreground mt-2 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Por qué elegir el {product.name}
          </h2>
          <div className="prose-base text-muted-foreground mt-6 space-y-4 text-base leading-relaxed [&_p]:text-balance">
            {product.description.split('\n\n').map((para, i) => (
              <p key={i} className="whitespace-pre-wrap">
                {para}
              </p>
            ))}
          </div>
          <ProductCallouts attributes={product.attributes} />
        </RevealOnScroll>
      )}

      <RelatedProducts products={relatedProducts} />
    </main>
  );
}
