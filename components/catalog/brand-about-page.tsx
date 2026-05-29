import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { cn } from '@/lib/utils';
import {
  getBrandAssetUrl,
  shouldInvertLogo,
} from '@/lib/storage/brand-asset-url';
import type { CategoryConfig } from '@/lib/catalog/categories';
import type { BrandPageData } from '@/lib/catalog/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/**
 * Página dedicada con el texto SEO largo de una marca, separada del catálogo
 * para mantener el catálogo limpio (foco en productos). Indexable y linkeada
 * desde la página de catálogo con un CTA discreto.
 *
 * URL: /anteojos-de-{sol,receta}/[brand]/sobre-la-marca
 */
export function BrandAboutPage({
  category,
  brand,
}: {
  category: CategoryConfig;
  brand: BrandPageData;
}) {
  const catalogUrl = `/${category.slug}/${brand.slug}`;
  const pageUrl = `${SITE_URL}${catalogUrl}/sobre-la-marca`;

  return (
    <main className="container py-8 md:py-12">
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: SITE_URL },
          { name: category.name, url: `${SITE_URL}/${category.slug}` },
          { name: brand.name, url: `${SITE_URL}${catalogUrl}` },
          { name: 'Sobre la marca', url: pageUrl },
        ]}
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
            <Link href={`/${category.slug}`} className="hover:text-foreground">
              {category.name}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={catalogUrl} className="hover:text-foreground">
              {brand.name}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground" aria-current="page">
            Sobre la marca
          </li>
        </ol>
      </nav>

      <RevealOnScroll as="section" className="mb-10 max-w-3xl">
        {brand.logo_url && (
          <div className="mb-6 flex h-14 items-center md:h-16">
            <Image
              src={getBrandAssetUrl(brand.logo_url)}
              alt={brand.name}
              width={240}
              height={80}
              className={cn(
                'h-12 w-auto object-contain md:h-14',
                shouldInvertLogo(brand.logo_url, 'light-bg') && 'brightness-0',
              )}
              priority
            />
          </div>
        )}
        <h1 className="text-balance font-serif text-4xl font-medium leading-[1.1] tracking-[-0.02em] md:text-5xl lg:text-6xl">
          Sobre <span className="italic font-normal">{brand.name}</span>
        </h1>
        <p className="text-muted-foreground mt-3 text-balance text-base md:text-lg">
          Historia, líneas y propuesta de {brand.name} aplicada a la óptica.
        </p>
      </RevealOnScroll>

      {brand.seo_intro && (
        <RevealOnScroll
          as="article"
          className="text-foreground/90 max-w-3xl space-y-5 text-base leading-relaxed md:text-lg"
        >
          {brand.seo_intro.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </RevealOnScroll>
      )}

      {brand.seo_outro && (
        <RevealOnScroll
          as="section"
          className="text-muted-foreground border-border/60 mt-10 max-w-3xl border-t pt-6 text-sm leading-relaxed md:text-base"
        >
          <p className="whitespace-pre-line">{brand.seo_outro}</p>
        </RevealOnScroll>
      )}

      <div className="mt-12 max-w-3xl">
        <Link
          href={catalogUrl}
          className="text-foreground inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Ver catálogo de {brand.name}
        </Link>
      </div>
    </main>
  );
}
