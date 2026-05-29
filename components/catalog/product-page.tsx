import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { ProductJsonLd } from '@/components/seo/product-jsonld';
import { RelatedItemListJsonLd } from '@/components/seo/related-itemlist-jsonld';
import { NewArrivalBadge } from '@/components/product/new-arrival-badge';
import { ProductAttributes } from '@/components/product/product-attributes';
import { ProductCalloutAt } from '@/components/product/product-callouts';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductHighlights } from '@/components/product/product-highlights';
import { ProductIncludes } from '@/components/product/product-includes';
import { ProductMeasurements } from '@/components/product/product-measurements';
import { RelatedProducts } from '@/components/product/related-products';
import { WhatsappAdvisorCard } from '@/components/product/whatsapp-advisor-card';
import { VariantList } from '@/components/product/variant-list';
import { WhatsappCta } from '@/components/product/whatsapp-cta';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { formatPriceCents } from '@/lib/format/currency';
import { isPlaceholder } from '@/lib/catalog/placeholder';
import { isCheckoutEnabled } from '@/lib/features';
import { fetchRelatedProducts } from '@/lib/catalog/queries';
import { VariantSelectionProvider } from '@/lib/product/variant-selection';
import type { CategoryConfig } from '@/lib/catalog/categories';
import type { ProductDetailData } from '@/lib/catalog/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

function extractFrameShape(attrs: Record<string, unknown>): string | null {
  const v = attrs.frame_shape;
  return typeof v === 'string' ? v : null;
}

function findPrimaryImagePathForVariant(
  images: ProductDetailData['images'],
  variantId: string,
): string | null {
  const variantImages = images.filter((img) => img.variant_id === variantId);
  if (variantImages.length === 0) return null;
  const primary = variantImages.find((img) => img.is_primary);
  if (primary) return primary.storage_path;
  const sorted = [...variantImages].sort((a, b) => a.sort_order - b.sort_order);
  return sorted[0]?.storage_path ?? null;
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

function DescriptionWithCallouts({
  description,
  attributes,
}: {
  description: string;
  attributes: Record<string, unknown>;
}) {
  const paragraphs = description.split('\n\n').filter((p) => p.trim().length > 0);
  const total = paragraphs.length;
  // Insertar middle callout aproximadamente a la mitad de los párrafos.
  const midIdx = total >= 4 ? Math.ceil(total / 2) : Math.max(1, Math.floor(total / 2));

  return (
    <div className="text-muted-foreground mt-6 text-base leading-relaxed">
      <div className="mb-5">
        <ProductCalloutAt attributes={attributes} position="top" />
      </div>
      <div className="space-y-4 [&_p]:text-balance">
        {paragraphs.slice(0, midIdx).map((para, i) => (
          <p key={`pre-${i}`} className="whitespace-pre-wrap">
            {para}
          </p>
        ))}
      </div>
      {midIdx < total && (
        <div className="my-5">
          <ProductCalloutAt attributes={attributes} position="middle" />
        </div>
      )}
      <div className="space-y-4 [&_p]:text-balance">
        {paragraphs.slice(midIdx).map((para, i) => (
          <p key={`post-${i}`} className="whitespace-pre-wrap">
            {para}
          </p>
        ))}
      </div>
      <div className="mt-5">
        <ProductCalloutAt attributes={attributes} position="bottom" />
      </div>
    </div>
  );
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

  // Default seleccionado: primera variante en stock activa, sino la
  // primera activa, sino null.
  const defaultVariantId =
    inStockVariants[0]?.id ?? activeVariants[0]?.id ?? null;

  return (
    <VariantSelectionProvider defaultVariantId={defaultVariantId}>
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

      <div className="grid gap-8 md:grid-cols-2 md:grid-rows-[auto_1fr] md:gap-x-12 md:gap-y-6">
        <ProductGallery productName={product.name} images={product.images ?? []} />

        <div className="flex flex-col gap-6 md:col-start-2 md:row-span-2 md:row-start-1">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Link
                href={`/${category.slug}/${product.brand.slug}`}
                className="text-muted-foreground hover:text-foreground text-sm font-medium uppercase tracking-wide"
              >
                {product.brand.name}
              </Link>
              <NewArrivalBadge attributes={product.attributes} />
            </div>
            <h1 className="text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl">
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
              primaryImagePath: findPrimaryImagePathForVariant(
                product.images ?? [],
                v.id,
              ),
            }))}
          />

          <ProductAttributes attributes={product.attributes} />

          <ProductMeasurements attributes={product.attributes} />

          <WhatsappCta productName={product.name} inStock={isInStock} />
        </div>

        <div className="md:col-start-1 md:row-start-2">
          <ProductIncludes attributes={product.attributes} />
        </div>
      </div>

      {product.description && (
        <RevealOnScroll as="section" className="mt-20 max-w-3xl">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-[0.2em]">
            Sobre el producto
          </p>
          <h2 className="text-foreground mt-2 text-balance font-serif text-3xl font-medium tracking-[-0.015em] md:text-4xl">
            Por qué elegir el <span className="italic font-normal">{product.name}</span>
          </h2>
          <DescriptionWithCallouts
            description={product.description}
            attributes={product.attributes}
          />
        </RevealOnScroll>
      )}

      <RevealOnScroll>
        <WhatsappAdvisorCard
          productName={product.name}
          brandName={product.brand.name}
        />
      </RevealOnScroll>

      <RelatedProducts products={relatedProducts} />
    </main>
    </VariantSelectionProvider>
  );
}
