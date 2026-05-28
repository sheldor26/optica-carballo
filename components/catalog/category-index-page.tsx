import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { BrandGridCard } from '@/components/catalog/brand-grid-card';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import type { CategoryConfig } from '@/lib/catalog/categories';
import type { BrandWithProductCount } from '@/lib/catalog/queries';

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
) {
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
  };
}

export function CategoryIndexPage({
  category,
  brands,
}: {
  category: CategoryConfig;
  brands: BrandWithProductCount[];
}) {
  const pageUrl = `${SITE_URL}/${category.slug}`;
  const jsonLd = buildCollectionJsonLd(category, brands, pageUrl);

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
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          {category.name}
        </h1>
        <p className="text-muted-foreground mt-4 text-balance text-base md:text-lg">
          {INTRO_COPY[category.slug]}
        </p>
      </RevealOnScroll>

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
            <RevealOnScroll key={brand.id} delay={80 * idx}>
              <BrandGridCard brand={brand} category={category} />
            </RevealOnScroll>
          ))}
        </section>
      )}
    </main>
  );
}
