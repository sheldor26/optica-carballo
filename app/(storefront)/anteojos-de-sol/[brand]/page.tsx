import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ProductCard, type ProductCardData } from '@/components/product/product-card';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { CatalogJsonLd } from '@/components/seo/catalog-jsonld';
import { createClient } from '@/lib/supabase/server';
import { createStaticClient } from '@/lib/supabase/static';

const CATEGORY_SLUG = 'anteojos-de-sol';
const CATEGORY_NAME = 'Anteojos de sol';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

// ISR: revalida la página cada 5 min para reflejar cambios de stock/precios.
export const revalidate = 300;

type Params = { brand: string };

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('brands')
    .select('slug')
    .eq('is_active', true);
  return data?.map((b) => ({ brand: b.slug })) ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { brand: brandSlug } = await params;
  const supabase = await createClient();
  const { data: brand } = await supabase
    .from('brands')
    .select('name')
    .eq('slug', brandSlug)
    .eq('is_active', true)
    .maybeSingle();

  if (!brand) {
    return { title: 'Marca no encontrada' };
  }

  // Title específico para sol (no mezclar con receta — son URLs distintas).
  // Sobreescribe el template del root layout vía `title.absolute`.
  const title = `Anteojos de sol ${brand.name} Originales | Envío a Todo el País - Óptica Carballo`;
  const description = `Anteojos de sol ${brand.name} originales. Envíos a todo Argentina, cuotas sin interés y asesoramiento de técnico óptico matriculado. 30+ años de experiencia.`;
  const url = `${SITE_URL}/${CATEGORY_SLUG}/${brandSlug}`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { 'es-AR': url, 'x-default': url },
    },
    openGraph: { title, description, url, type: 'website' },
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { brand: brandSlug } = await params;
  const supabase = await createClient();

  const { data: brand } = await supabase
    .from('brands')
    .select('id, slug, name, description, is_argentine')
    .eq('slug', brandSlug)
    .eq('is_active', true)
    .maybeSingle();

  if (!brand) notFound();

  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', CATEGORY_SLUG)
    .is('parent_id', null)
    .maybeSingle();

  if (!category) notFound();

  const { data: products } = await supabase
    .from('products')
    .select(
      `
        slug,
        name,
        short_description,
        is_featured,
        variants:product_variants(price_cents, stock_qty, is_active)
      `,
    )
    .eq('brand_id', brand.id)
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('name', { ascending: true });

  const items: ProductCardData[] = (products ?? []).map((p) => {
    const inStockVariants = p.variants.filter(
      (v) => v.is_active && v.stock_qty > 0,
    );
    return {
      slug: p.slug,
      name: p.name,
      shortDescription: p.short_description,
      minPriceCents:
        inStockVariants.length > 0
          ? Math.min(...inStockVariants.map((v) => v.price_cents))
          : null,
      inStockCount: inStockVariants.length,
    };
  });

  const pageUrl = `${SITE_URL}/${CATEGORY_SLUG}/${brand.slug}`;

  return (
    <main className="container py-8 md:py-12">
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: SITE_URL },
          { name: CATEGORY_NAME, url: `${SITE_URL}/${CATEGORY_SLUG}` },
          { name: brand.name, url: pageUrl },
        ]}
      />
      <CatalogJsonLd
        brandName={brand.name}
        brandDescription={brand.description}
        categoryName={CATEGORY_NAME}
        pageUrl={pageUrl}
        products={items.map((p) => ({
          name: p.name,
          slug: p.slug,
          minPriceCents: p.minPriceCents,
          inStockCount: p.inStockCount,
        }))}
      />

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
          <li className="text-foreground" aria-current="page">
            {brand.name}
          </li>
        </ol>
      </nav>

      <header className="mb-8 max-w-3xl">
        <div className="mb-3 flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Anteojos de sol {brand.name}
          </h1>
          {brand.is_argentine && (
            <Badge variant="secondary" className="self-center">
              Marca local
            </Badge>
          )}
        </div>
        {brand.description && (
          <p className="text-muted-foreground text-base md:text-lg">
            {brand.description}
          </p>
        )}
      </header>

      {items.length === 0 ? (
        <p className="text-muted-foreground">
          Todavía no hay productos cargados de {brand.name} en esta categoría.
        </p>
      ) : (
        <section
          aria-label={`Productos de ${brand.name} en anteojos de sol`}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {items.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </section>
      )}
    </main>
  );
}
