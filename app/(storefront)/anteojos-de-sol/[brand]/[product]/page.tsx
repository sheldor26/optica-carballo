import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { ProductJsonLd } from '@/components/seo/product-jsonld';
import { ProductAttributes } from '@/components/product/product-attributes';
import { ProductGallery } from '@/components/product/product-gallery';
import { VariantList } from '@/components/product/variant-list';
import { WhatsappCta } from '@/components/product/whatsapp-cta';
import { isPlaceholder } from '@/lib/catalog/placeholder';
import { formatPriceCents } from '@/lib/format/currency';
import { createClient } from '@/lib/supabase/server';
import { createStaticClient } from '@/lib/supabase/static';

const CATEGORY_SLUG = 'anteojos-de-sol';
const CATEGORY_NAME = 'Anteojos de sol';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const revalidate = 300;

type Params = { brand: string; product: string };

type StaticParamRow = {
  slug: string;
  brand: { slug: string };
  category: { slug: string };
};

type ProductRow = {
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  attributes: Record<string, unknown>;
  meta_description: string | null;
  is_active: boolean;
  brand: {
    slug: string;
    name: string;
    description: string | null;
    is_argentine: boolean;
    is_active: boolean;
  };
  category: { slug: string; is_active: boolean };
  variants: Array<{
    sku: string;
    price_cents: number;
    stock_qty: number;
    attributes: Record<string, unknown>;
    is_active: boolean;
    sort_order: number;
  }>;
};

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('products')
    .select('slug, brand:brands!inner(slug), category:categories!inner(slug)')
    .eq('is_active', true)
    .eq('category.slug', CATEGORY_SLUG)
    .returns<StaticParamRow[]>();

  return (data ?? []).map((p) => ({
    brand: p.brand.slug,
    product: p.slug,
  }));
}

async function fetchProduct(brandSlug: string, productSlug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(
      `
        slug,
        name,
        short_description,
        description,
        attributes,
        meta_description,
        is_active,
        brand:brands!inner(slug, name, description, is_argentine, is_active),
        category:categories!inner(slug, is_active),
        variants:product_variants(sku, price_cents, stock_qty, attributes, is_active, sort_order)
      `,
    )
    .eq('slug', productSlug)
    .eq('is_active', true)
    .maybeSingle()
    .returns<ProductRow>();

  if (!data) return null;
  if (!data.brand.is_active) return null;
  if (data.brand.slug !== brandSlug) return null;
  if (data.category.slug !== CATEGORY_SLUG) return null;
  if (!data.category.is_active) return null;

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { brand: brandSlug, product: productSlug } = await params;
  const product = await fetchProduct(brandSlug, productSlug);

  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  const isPh = isPlaceholder(product.name);
  // Title más corto (~60 chars): sin repetir la marca (ya está en breadcrumb + Brand schema).
  const title = `${product.name} | Anteojos de Sol - Óptica Carballo`;
  const description =
    product.meta_description ??
    product.short_description ??
    `${product.name} en Óptica Carballo. Envíos a todo Argentina, cuotas sin interés y asesoramiento de técnico óptico matriculado.`;
  const url = `${SITE_URL}/${CATEGORY_SLUG}/${brandSlug}/${productSlug}`;

  return {
    title: { absolute: title },
    description,
    // Productos placeholder no se indexan hasta que el founder confirme datos reales.
    robots: isPh ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: url,
      languages: { 'es-AR': url, 'x-default': url },
    },
    openGraph: { title, description, url, type: 'website' },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { brand: brandSlug, product: productSlug } = await params;
  const product = await fetchProduct(brandSlug, productSlug);
  if (!product) notFound();

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

  const pageUrl = `${SITE_URL}/${CATEGORY_SLUG}/${brandSlug}/${productSlug}`;
  const brandUrl = `${SITE_URL}/${CATEGORY_SLUG}/${brandSlug}`;
  const categoryUrl = `${SITE_URL}/${CATEGORY_SLUG}`;

  return (
    <main className="container py-8 md:py-12">
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: SITE_URL },
          { name: CATEGORY_NAME, url: categoryUrl },
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
            <Link href={`/${CATEGORY_SLUG}`} className="hover:text-foreground">
              {CATEGORY_NAME}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href={`/${CATEGORY_SLUG}/${brandSlug}`}
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
                href={`/${CATEGORY_SLUG}/${brandSlug}`}
                className="text-muted-foreground text-sm font-medium uppercase tracking-wide hover:text-foreground"
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
            variants={activeVariants.map((v) => ({
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
