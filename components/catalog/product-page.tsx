import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { ProductJsonLd } from '@/components/seo/product-jsonld';
import { RelatedItemListJsonLd } from '@/components/seo/related-itemlist-jsonld';
import { ProductAttributes } from '@/components/product/product-attributes';
import { ProductGallery } from '@/components/product/product-gallery';
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
          </div>

          {priceLabel ? (
            <p className="text-2xl font-semibold">{priceLabel}</p>
          ) : (
            <p className="text-muted-foreground text-base">Sin stock disponible</p>
          )}

          <ProductAttributes attributes={product.attributes} />

          <ProductMeasurements attributes={product.attributes} />

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

          <WhatsappCta productName={product.name} inStock={isInStock} />
        </div>
      </div>

      {product.description && (
        <RevealOnScroll as="section" className="mt-16 max-w-3xl">
          <h2 className="text-foreground text-xl font-semibold tracking-tight md:text-2xl">
            Descripción
          </h2>
          <p className="text-muted-foreground mt-4 whitespace-pre-wrap text-base leading-relaxed">
            {product.description}
          </p>
        </RevealOnScroll>
      )}

      <RelatedProducts products={relatedProducts} />
    </main>
  );
}
