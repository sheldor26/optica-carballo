import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, Sparkles } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { cn } from '@/lib/utils';
import { fetchBrandsIndex } from '@/lib/catalog/queries';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';
import { getBrandCopy } from '@/lib/brands/copy';
import {
  getBrandAssetUrl,
  shouldInvertLogo,
} from '@/lib/storage/brand-asset-url';
import type { BrandIndexEntry } from '@/lib/catalog/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const SLUG = 'marcas';
const TITLE = 'Marcas';
const DESCRIPTION =
  'Las marcas que trabajamos en Óptica Carballo, con stock real confirmado: Rusty, Vulk, Reef, Mormaii y Paula Cahen D\'Anvers en sus líneas de anteojos de sol y receta.';

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return buildInfoPageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    slug: SLUG,
  });
}

export default async function Page() {
  const brands = await fetchBrandsIndex();
  const totalProducts = brands.reduce((sum, b) => sum + b.productCount, 0);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: SITE_URL },
          { name: 'Marcas', url: `${SITE_URL}/marcas` },
        ]}
      />
      <BrandsIndexJsonLd brands={brands} />

      <main className="container py-10 md:py-16">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-brand inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
            <Award className="size-3.5" strokeWidth={2} />
            Catálogo
          </p>
          <h1 className="text-foreground mt-4 text-balance font-serif text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl">
            Las <span className="italic">marcas</span> que trabajamos
          </h1>
          <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-balance text-base md:text-lg">
            {brands.length === 0
              ? 'Todavía no hay marcas con productos cargados.'
              : `${brands.length} marcas con stock real confirmado. ${totalProducts} ${totalProducts === 1 ? 'modelo' : 'modelos'} en total.`}
          </p>
        </header>

        {brands.length > 0 && (
          <section
            aria-label="Lista de marcas"
            className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 md:mt-16 md:gap-8 lg:grid-cols-3"
          >
            {brands.map((brand, idx) => (
              <RevealOnScroll key={brand.slug} delay={60 * idx} className="h-full">
                <BrandIndexCard brand={brand} />
              </RevealOnScroll>
            ))}
          </section>
        )}

        <ContactCta />
      </main>
    </>
  );
}

function BrandIndexCard({ brand }: { brand: BrandIndexEntry }) {
  const copy = getBrandCopy(brand.slug);
  const href = `/anteojos-de-sol/${brand.slug}`;

  return (
    <Link
      href={href}
      className="group border-border/60 bg-background hover:border-foreground/40 hover:shadow-md flex h-full flex-col rounded-2xl border p-6 transition-all duration-200 md:p-8"
    >
      <div className="border-border/40 bg-muted/30 flex h-20 items-center justify-center overflow-hidden rounded-lg border md:h-24">
        {brand.logo_url ? (
          <Image
            src={getBrandAssetUrl(brand.logo_url)}
            alt={brand.name}
            width={200}
            height={80}
            className={cn(
              'h-14 w-auto object-contain md:h-16',
              shouldInvertLogo(brand.logo_url, 'light-bg') && 'brightness-0',
            )}
          />
        ) : (
          <span className="text-muted-foreground font-serif text-2xl font-medium tracking-tight">
            {brand.name}
          </span>
        )}
      </div>

      <div className="mt-5 flex-1">
        <h2 className="text-foreground font-serif text-xl font-medium tracking-tight md:text-2xl">
          {brand.name}
        </h2>
        {copy?.tagline ? (
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {copy.tagline}
          </p>
        ) : brand.description ? (
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {brand.description}
          </p>
        ) : null}
      </div>

      <div className="border-border/40 mt-5 flex items-center justify-between border-t pt-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-xs">
            {brand.productCount} {brand.productCount === 1 ? 'modelo' : 'modelos'}
          </span>
          {copy?.country && (
            <span className="text-muted-foreground/70 text-[11px]">
              {copy.country}
            </span>
          )}
        </div>
        <span className="text-foreground inline-flex items-center gap-1 text-sm font-medium">
          Ver catálogo
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </span>
      </div>
    </Link>
  );
}

function BrandsIndexJsonLd({ brands }: { brands: BrandIndexEntry[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Marcas de Óptica Carballo',
    description: DESCRIPTION,
    numberOfItems: brands.length,
    itemListElement: brands.map((b, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: b.name,
      url: `${SITE_URL}/anteojos-de-sol/${b.slug}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function ContactCta() {
  return (
    <section className="mx-auto mt-20 max-w-3xl">
      <div className="border-border/60 from-muted/30 to-background relative overflow-hidden rounded-2xl border bg-gradient-to-br p-8 text-center md:p-12">
        <div
          aria-hidden="true"
          className="bg-brand/15 pointer-events-none absolute -right-20 -top-20 size-48 rounded-full blur-3xl"
        />
        <div className="relative">
          <Sparkles
            className="text-foreground/70 mx-auto size-7"
            strokeWidth={1.5}
            aria-hidden
          />
          <h2 className="text-foreground mt-4 font-serif text-2xl font-medium tracking-tight md:text-3xl">
            ¿Buscás otra <span className="italic">marca</span>?
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-md text-balance text-sm md:text-base">
            Trabajamos con estas 5 marcas en stock real, pero podemos
            conseguirte otras puntualmente. Escribinos por WhatsApp y vemos.
          </p>
        </div>
      </div>
    </section>
  );
}
