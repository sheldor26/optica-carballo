import Link from 'next/link';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';

type BrandSummary = {
  slug: string;
  name: string;
};

export function BrandsSection({ brands }: { brands: BrandSummary[] }) {
  if (brands.length === 0) return null;

  return (
    <section className="bg-muted/40 border-y">
      <div className="container py-12 md:py-16">
        <RevealOnScroll>
          <h2 className="text-foreground font-serif text-3xl font-medium tracking-[-0.015em] md:text-4xl">
            Marcas que trabajamos
          </h2>
          <p className="text-muted-foreground mt-2 text-base">
            Tenemos stock real de las siguientes marcas, tanto en sol como en
            receta.
          </p>
        </RevealOnScroll>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {brands.map((b, idx) => (
            <RevealOnScroll as="li" key={b.slug} delay={60 * idx}>
              <Link
                href={`/anteojos-de-sol/${b.slug}`}
                className="border-border bg-background hover:border-foreground group flex flex-col items-center justify-center gap-1 rounded-md border p-4 text-center transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="text-foreground font-medium transition-transform duration-300 group-hover:scale-[1.02]">
                  {b.name}
                </span>
              </Link>
            </RevealOnScroll>
          ))}
        </ul>
      </div>
    </section>
  );
}
