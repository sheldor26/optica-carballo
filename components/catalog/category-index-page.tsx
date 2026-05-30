import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { BrandGridCard } from '@/components/catalog/brand-grid-card';
import { FrameShapeFilters } from '@/components/catalog/frame-shape-filters';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import type { CategoryConfig } from '@/lib/catalog/categories';
import type {
  BrandWithProductCount,
  CategoryPriceRange,
} from '@/lib/catalog/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

const INTRO_COPY: Record<CategoryConfig['slug'], string> = {
  'anteojos-de-sol':
    'Marcas con presencia argentina y stock real. Anteojos de sol originales, envíos a todo el país y asesoramiento de técnico óptico matriculado.',
  'anteojos-de-receta':
    'Armazones de receta de las marcas que trabajamos en óptica. Cristales graduados según tu prescripción, asesoramiento de técnico óptico matriculado.',
};

function buildCollectionJsonLd(
  category: CategoryConfig,
  brands: BrandWithProductCount[],
  pageUrl: string,
  priceRange: CategoryPriceRange | null,
) {
  // AggregateOffer: rich result que muestra rango de precios en Google.
  // Requiere lowPrice, highPrice, priceCurrency, offerCount. Solo se incluye
  // si hay variantes con stock real (Google no acepta ofertas vacías).
  const aggregateOffer =
    priceRange !== null
      ? {
          '@type': 'AggregateOffer',
          lowPrice: (priceRange.minPriceCents / 100).toFixed(2),
          highPrice: (priceRange.maxPriceCents / 100).toFixed(2),
          priceCurrency: 'ARS',
          offerCount: priceRange.offerCount,
          availability: 'https://schema.org/InStock',
        }
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: pageUrl,
    name: category.name,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: brands.length,
      itemListElement: brands.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${SITE_URL}/${category.slug}/${b.slug}`,
        name: b.name,
      })),
    },
    ...(aggregateOffer ? { offers: aggregateOffer } : {}),
  };
}

export function CategoryIndexPage({
  category,
  brands,
  priceRange,
  availableShapes,
}: {
  category: CategoryConfig;
  brands: BrandWithProductCount[];
  priceRange: CategoryPriceRange | null;
  /** Shapes disponibles para filtrar. Si tiene 1+, mostramos chips arriba
   * del grid de marcas como descubribilidad. Click → navega a vista filtrada. */
  availableShapes?: string[];
}) {
  const pageUrl = `${SITE_URL}/${category.slug}`;
  const jsonLd = buildCollectionJsonLd(category, brands, pageUrl, priceRange);

  return (
    <main className="container py-8 md:py-12">
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: SITE_URL },
          { name: category.name, url: pageUrl },
        ]}
      />
      {brands.length > 0 && (
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
          <li className="text-foreground" aria-current="page">
            {category.name}
          </li>
        </ol>
      </nav>

      <RevealOnScroll as="article" className="mb-10 max-w-3xl">
        <h1 className="text-balance font-serif text-5xl font-medium leading-[1.05] tracking-[-0.02em] md:text-6xl lg:text-7xl">
          {category.name}
        </h1>
        <p className="text-muted-foreground mt-4 text-balance text-base md:text-lg">
          {INTRO_COPY[category.slug]}
        </p>
      </RevealOnScroll>

      {availableShapes && availableShapes.length > 0 && (
        <div className="-mx-4 mb-8 sm:-mx-6">
          <FrameShapeFilters
            availableShapes={availableShapes}
            selectedShapes={[]}
          />
        </div>
      )}

      {brands.length === 0 ? (
        <p className="text-muted-foreground">
          Próximamente sumamos marcas en esta categoría.
        </p>
      ) : (
        <section
          aria-label={`Marcas en ${category.name.toLowerCase()}`}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {brands.map((brand, idx) => (
            <RevealOnScroll key={brand.id} delay={80 * idx} className="h-full">
              <BrandGridCard brand={brand} category={category} />
            </RevealOnScroll>
          ))}
        </section>
      )}
    </main>
  );
}
