import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { renderInlineBold, stripInlineBold } from '@/lib/format/inline-bold';
import {
  getBrandAssetUrl,
  shouldInvertLogo,
} from '@/lib/storage/brand-asset-url';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { ProductJsonLd } from '@/components/seo/product-jsonld';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import { RelatedItemListJsonLd } from '@/components/seo/related-itemlist-jsonld';
import { NewArrivalBadge } from '@/components/product/new-arrival-badge';
import { deriveSizeFit } from '@/lib/catalog/size-fit';
import { ProductAttributes } from '@/components/product/product-attributes';
import { ProductCalloutAt } from '@/components/product/product-callouts';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductHighlights } from '@/components/product/product-highlights';
import { ProductIncludes } from '@/components/product/product-includes';
import { ProductMeasurements } from '@/components/product/product-measurements';
import { FitChecker } from '@/components/product/fit-checker';
import { ProductPriceBlock } from '@/components/product/product-price-block';
import { ProductTrustSignals } from '@/components/product/product-trust-signals';
import { ProductFaqs } from '@/components/product/product-faqs';
import { RelatedProducts } from '@/components/product/related-products';
import { WhatsappAdvisorCard } from '@/components/product/whatsapp-advisor-card';
import { RecentlyViewed } from '@/components/recently-viewed/recently-viewed';
import { RecentlyViewedTracker } from '@/components/recently-viewed/recently-viewed-tracker';
import { VariantList } from '@/components/product/variant-list';
import { ShareButtons } from '@/components/share/share-buttons';
import { WishlistButton } from '@/components/wishlist/wishlist-button';
import { CreateAlertButton } from '@/components/alerts/create-alert-button';
import { CompareButton } from '@/components/compare/compare-button';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { formatPriceCents } from '@/lib/format/currency';
import { isPlaceholder } from '@/lib/catalog/placeholder';
import { isCheckoutEnabled } from '@/lib/features';
import { fetchRelatedProducts } from '@/lib/catalog/queries';
import {
  VariantSelectionProvider,
  VariantUrlSync,
} from '@/lib/product/variant-selection';
import { StickyBuyBar } from '@/components/product/sticky-buy-bar';
import { RelatedGuides } from '@/components/articles/related-guides';
import { listArticles } from '@/lib/content/articles';
import type { CategoryConfig } from '@/lib/catalog/categories';
import type { ProductDetailData } from '@/lib/catalog/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

function extractFrameShape(attrs: Record<string, unknown>): string | null {
  const v = attrs.frame_shape;
  return typeof v === 'string' ? v : null;
}

/**
 * Construye el array de imágenes para la galería incluyendo (opcional) la
 * imagen brand-wide del kit incluido (estuche+franela+stickers) al final.
 *
 * Convención: brand.includes_image_path = path al asset compartido por TODA
 * la marca (ej. 'brands-shared/vulk-estuche-franela.jpg'). Se renderiza en
 * último lugar (sort_order alto). Se omite si:
 *   - brand.includes_image_path es null (marca sin imagen brand-wide)
 *   - product.attributes.hide_brand_includes_image === true (opt-out per-producto)
 */
function buildGalleryImages(
  product: ProductDetailData,
): ProductDetailData['images'] {
  const base = product.images ?? [];
  const brandPath = product.brand.includes_image_path;
  if (!brandPath) return base;
  if (product.attributes?.hide_brand_includes_image === true) return base;
  const alt =
    product.brand.includes_image_alt ??
    `${product.brand.name} kit incluido: estuche, franela y stickers`;

  // Construir URL absoluta apuntando al bucket `brands-shared` (separado
  // del bucket `products`). `getProductImageUrl()` detecta URLs absolutas
  // y las devuelve tal cual, así que esto funciona transparentemente.
  // Si brandPath ya es URL completa (http/https), se usa tal cual sin
  // reconstruir.
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321';
  const fullUrl = brandPath.startsWith('http')
    ? brandPath
    : `${supabaseUrl}/storage/v1/object/public/brands-shared/${brandPath}`;

  return [
    ...base,
    {
      storage_path: fullUrl,
      alt_text: alt,
      width: null,
      height: null,
      sort_order: 9999,
      is_primary: false,
      variant_id: null,
    },
  ];
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

/** Convierte el enum `attributes.gender` (en inglés) al término argentino
 * legible para mostrar en UI. */
function genderToSpanish(gender: string | null): string | null {
  if (!gender) return null;
  switch (gender) {
    case 'female':
      return 'para mujer';
    case 'male':
      return 'para hombre';
    case 'unisex':
      return 'unisex';
    default:
      return null;
  }
}

/** Convierte el enum `attributes.frame_shape` al término legible para subtitle. */
function frameShapeToSpanish(shape: string | null): string | null {
  if (!shape) return null;
  const map: Record<string, string> = {
    oval: 'ovalados',
    aviator: 'aviador',
    aviador: 'aviador',
    round: 'redondos',
    redondo: 'redondos',
    square: 'cuadrados',
    cuadrado: 'cuadrados',
    rectangular: 'rectangulares',
    cat_eye: 'cat eye',
    wayfarer: 'wayfarer',
    envolvente: 'envolventes',
    wraparound: 'envolventes',
  };
  return map[shape] ?? null;
}

function categorySubtitle(category: CategoryConfig, attrs: Record<string, unknown>): string {
  const gender = typeof attrs.gender === 'string' ? attrs.gender : null;
  const frameShape = typeof attrs.frame_shape === 'string' ? attrs.frame_shape : null;
  const treatments = Array.isArray(attrs.lens_treatment)
    ? attrs.lens_treatment.filter((t): t is string => typeof t === 'string')
    : [];
  const isPolarized = treatments.includes('polarized');

  const prefix = category.slug === 'anteojos-de-sol' ? 'Anteojos de sol' : 'Anteojos de receta';
  const shape = frameShapeToSpanish(frameShape);
  const genderEs = genderToSpanish(gender);

  // Composición: "Anteojos de sol ovalados para mujer" (más descriptivo que
  // "Anteojos de sol female"). Si hay polarized a nivel producto, agregar al final.
  const parts: string[] = [prefix];
  if (shape) parts.push(shape);
  if (genderEs) parts.push(genderEs);
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
      <div className="space-y-4 [&_p]:text-pretty">
        {paragraphs.slice(0, midIdx).map((para, i) => (
          <p key={`pre-${i}`} className="whitespace-pre-wrap">
            {renderInlineBold(para)}
          </p>
        ))}
      </div>
      {midIdx < total && (
        <div className="my-5">
          <ProductCalloutAt attributes={attributes} position="middle" />
        </div>
      )}
      <div className="space-y-4 [&_p]:text-pretty">
        {paragraphs.slice(midIdx).map((para, i) => (
          <p key={`post-${i}`} className="whitespace-pre-wrap">
            {renderInlineBold(para)}
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

  // Alertas: el estado de sesión + alerta existente lo resuelve
  // <CreateAlertButton /> client-side. Hacerlo acá con getCurrentUser()
  // (cookies) volvía DINÁMICA cada PDP y anulaba el ISR (audit 2026-06-11).

  // Default seleccionado: primera variante en stock activa, sino la
  // primera activa, sino null.
  const defaultVariantId =
    inStockVariants[0]?.id ?? activeVariants[0]?.id ?? null;

  // Mapa SKU → id para resolver el deep-link `?v=<sku>` del grid (client-side
  // vía VariantUrlSync, preserva el ISR de la PDP).
  const skuToId = Object.fromEntries(
    activeVariants.map((v) => [v.sku, v.id]),
  );

  return (
    <VariantSelectionProvider defaultVariantId={defaultVariantId}>
    <Suspense fallback={null}>
      <VariantUrlSync skuToId={skuToId} />
    </Suspense>
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
          description={
            product.description
              ? stripInlineBold(product.description)
              : product.short_description
          }
          brandName={product.brand.name}
          brandUrl={brandUrl}
          pageUrl={pageUrl}
          imageUrl={(() => {
            const imgs = product.images ?? [];
            const path =
              imgs.find((img) => img.is_primary)?.storage_path ??
              [...imgs].sort((a, b) => a.sort_order - b.sort_order)[0]
                ?.storage_path ??
              null;
            return path ? getProductImageUrl(path) : null;
          })()}
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

      <div className="grid gap-10 md:grid-cols-2 md:gap-x-16 md:items-start lg:gap-x-20">
        <ProductGallery
          productName={product.name}
          images={buildGalleryImages(product)}
          sizeFit={deriveSizeFit(product.attributes)}
        />

        {/* Columna info: sticky en desktop para que quede visible al
            scrollear la galería. `top-24` deja espacio para el header
            sticky (h-16 + margen). En mobile no sticky para no romper
            scroll natural. */}
        <div className="flex flex-col gap-8 md:sticky md:top-24">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/${category.slug}/${product.brand.slug}`}
                    className="hover:opacity-70 transition-opacity"
                    aria-label={`Ver todos los productos ${product.brand.name}`}
                  >
                    {product.brand.logo_url ? (
                      <Image
                        src={getBrandAssetUrl(product.brand.logo_url)}
                        alt={product.brand.name}
                        width={120}
                        height={32}
                        className={cn(
                          'h-7 w-auto object-contain md:h-8',
                          shouldInvertLogo(product.brand.logo_url, 'light-bg') &&
                            'brightness-0',
                        )}
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
                        {product.brand.name}
                      </span>
                    )}
                  </Link>
                  <NewArrivalBadge attributes={product.attributes} />
                </div>
                <h1 className="text-balance font-serif text-3xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl md:leading-[1.0] lg:text-6xl">
                  {product.name}
                </h1>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <CompareButton
                  entry={{
                    slug: product.slug,
                    category: category.slug,
                    brand: product.brand.slug,
                  }}
                  variant="title"
                />
                <WishlistButton
                  entry={{
                    slug: product.slug,
                    category: category.slug,
                    brand: product.brand.slug,
                  }}
                  variant="title"
                />
                <ShareButtons
                  title={`${product.brand.name} ${product.name}`}
                  url={pageUrl}
                  contentType="product"
                  itemSlug={product.slug}
                  triggerLabel={false}
                />
              </div>
            </div>
            <p className="text-muted-foreground mt-3 text-sm font-medium uppercase tracking-[0.15em] md:text-base">
              {subtitle}
            </p>
            {product.short_description && (
              <p className="text-muted-foreground mt-2 text-sm md:text-base">
                {product.short_description}
              </p>
            )}
            <ProductHighlights attributes={product.attributes} />
          </div>

          <ProductPriceBlock
            variants={activeVariants.map((v) => ({
              id: v.id,
              priceCents: v.price_cents,
              stockQty: v.stock_qty,
            }))}
            fallbackLabel={priceLabel}
          />

          {/* Alerta de precio/stock: movida debajo del precio (antes empujaba
              el precio fuera del above-the-fold mobile — audit CRO). */}
          <div className="-mt-4">
            <CreateAlertButton
              productId={product.id}
              variantId={null}
              productName={product.name}
              inStock={isInStock}
            />
          </div>

          <ProductTrustSignals />

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

          {/* Centinela: cuando scrolleás pasado el área de compra, aparece la
              barra sticky mobile con precio + Agregar (la PDP es larga). */}
          <div id="oc-pdp-cta-sentinel" aria-hidden="true" />
          {!isPlaceholder(product.name) && (
            <StickyBuyBar
              sentinelId="oc-pdp-cta-sentinel"
              productName={product.name}
              brandName={product.brand.name}
              checkoutEnabled={isCheckoutEnabled()}
              variants={activeVariants.map((v) => ({
                id: v.id,
                sku: v.sku,
                priceCents: v.price_cents,
                stockQty: v.stock_qty,
              }))}
            />
          )}

          <ProductAttributes attributes={product.attributes} />

          <ProductMeasurements attributes={product.attributes} />

          <FitChecker attributes={product.attributes} />

          <ProductIncludes attributes={product.attributes} />
        </div>

      </div>

      {product.description && (
        <RevealOnScroll
          as="section"
          className="relative -mx-4 mt-24 overflow-hidden bg-zinc-50 px-4 py-16 md:-mx-8 md:mt-32 md:px-12 md:py-24 lg:-mx-16 lg:px-20"
        >
          {/* Gradient muy sutil para que el bloque "Por qué elegir" se
              sienta editorial sin ser plano. Misma estrategia que ValueProps. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-zinc-50 via-white to-zinc-50"
          />
          <div className="mx-auto max-w-3xl">
            <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
              <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
              Sobre el producto
            </p>
            <h2 className="text-foreground mt-6 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
              Por qué elegir el{' '}
              <span className="italic font-normal text-foreground/70">
                {product.name}
              </span>
            </h2>
            <DescriptionWithCallouts
              description={product.description}
              attributes={product.attributes}
            />
          </div>
        </RevealOnScroll>
      )}

      <RevealOnScroll>
        <ProductFaqs categorySlug={category.slug} />
      </RevealOnScroll>

      <RevealOnScroll>
        <WhatsappAdvisorCard
          productName={product.name}
          brandName={product.brand.name}
        />
      </RevealOnScroll>

      {/* Linking interno producto -> guías. En receta: patologías + cómo leer
          la receta (educan y bajan la incertidumbre de comprar online). En sol
          todavía no hay guías relevantes, así que no se muestra. */}
      {category.slug === 'anteojos-de-receta' && (
        <RelatedGuides
          articles={listArticles()
            .filter(
              (a) =>
                a.cluster === 'patologias-visuales' ||
                a.cluster === 'como-leer-receta',
            )
            .slice(0, 3)}
        />
      )}

      <RelatedProducts products={relatedProducts} />

      <RecentlyViewed
        excludeSlugs={[product.slug]}
        heading="También estuviste mirando"
        limit={6}
      />

      <RecentlyViewedTracker
        entry={{
          slug: product.slug,
          category: category.slug,
          brand: product.brand.slug,
        }}
      />
    </main>
    </VariantSelectionProvider>
  );
}
