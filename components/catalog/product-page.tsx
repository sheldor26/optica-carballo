import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { ProductJsonLd } from '@/components/seo/product-jsonld';
import { ProductAttributes } from '@/components/product/product-attributes';
import { ProductGallery } from '@/components/product/product-gallery';
import { VariantList } from '@/components/product/variant-list';
import { WhatsappCta } from '@/components/product/whatsapp-cta';
import { formatPriceCents } from '@/lib/format/currency';
import { isPlaceholder } from '@/lib/catalog/placeholder';
import { isCheckoutEnabled } from '@/lib/features';
import type { CategoryConfig } from '@/lib/catalog/categories';
import type { ProductDetailData } from '@/lib/catalog/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export function ProductDetailPage({
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
          pageUrl={pageUrl}
          imageUrl={null}
          offers={activeVariants.map((v) => ({
            priceCents: v.price_cents,
            stockQty: v.stock_qty,
            sku: v.sku,
          }))}
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
        <ProductGallery productName={product.name} />

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
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {product.name}
            </h1>
            {product.short_description && (
              <p className="text-muted-foreground mt-2 text-base">
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
        <section className="mt-12 max-w-3xl">
          <h2 className="text-foreground text-lg font-semibold tracking-tight">
            Descripción
          </h2>
          <p className="text-muted-foreground mt-3 whitespace-pre-wrap text-sm leading-relaxed md:text-base">
            {product.description}
          </p>
        </section>
      )}
    </main>
  );
}
