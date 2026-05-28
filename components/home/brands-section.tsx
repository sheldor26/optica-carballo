import Image from 'next/image';
import Link from 'next/link';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { TiltSpotlightCard } from '@/components/ui/tilt-spotlight-card';
import { cn } from '@/lib/utils';
import {
  getBrandAssetUrl,
  shouldInvertLogo,
} from '@/lib/storage/brand-asset-url';

type BrandSummary = {
  slug: string;
  name: string;
  logo_url?: string | null;
};

export function BrandsSection({ brands }: { brands: BrandSummary[] }) {
  if (brands.length === 0) return null;

  return (
    <section className="bg-foreground text-background relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
      >
        <div className="bg-brand absolute -top-32 left-[10%] size-[420px] rounded-full blur-3xl" />
        <div className="bg-background absolute -bottom-40 right-[8%] size-[520px] rounded-full blur-3xl" />
      </div>
      <div className="container py-16 md:py-24">
        <RevealOnScroll>
          <p className="text-brand inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
            <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
            Marcas oficiales
          </p>
          <h2 className="text-background mt-4 font-serif text-3xl font-medium tracking-[-0.015em] md:text-5xl">
            Marcas que <span className="italic font-normal text-brand">trabajamos</span>
          </h2>
          <p className="text-background/70 mt-3 max-w-xl text-balance text-base">
            Stock real verificado de cada marca, tanto en anteojos de sol como
            de receta. Respaldo oficial del fabricante en todos los productos.
          </p>
        </RevealOnScroll>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {brands.map((b, idx) => (
            <RevealOnScroll as="li" key={b.slug} delay={60 * idx}>
              <TiltSpotlightCard tiltDeg={5}>
                <Link
                  href={`/anteojos-de-sol/${b.slug}`}
                  className="border-background/15 bg-background/5 hover:border-brand hover:bg-background/10 group flex h-20 items-center justify-center rounded-md border p-4 text-center backdrop-blur-sm transition-colors duration-300 ease-out"
                  aria-label={`Ver anteojos ${b.name}`}
                >
                  {b.logo_url ? (
                    // Sección con fondo dark. shouldInvertLogo() detecta el
                    // sufijo del filename: si es `-dark.*`, invertimos para
                    // que se vea claro acá; si es `-light.*`, lo dejamos.
                    <Image
                      src={getBrandAssetUrl(b.logo_url)}
                      alt={b.name}
                      width={120}
                      height={48}
                      className={cn(
                        'h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04] md:h-10',
                        shouldInvertLogo(b.logo_url, 'dark-bg') &&
                          'brightness-0 invert',
                      )}
                    />
                  ) : (
                    <span className="text-background font-medium transition-transform duration-300 group-hover:scale-[1.02]">
                      {b.name}
                    </span>
                  )}
                </Link>
              </TiltSpotlightCard>
            </RevealOnScroll>
          ))}
        </ul>
      </div>
    </section>
  );
}
