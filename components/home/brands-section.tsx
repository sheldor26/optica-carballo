import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

type BrandSummary = {
  slug: string;
  name: string;
  is_argentine: boolean;
};

export function BrandsSection({ brands }: { brands: BrandSummary[] }) {
  if (brands.length === 0) return null;

  return (
    <section className="bg-muted/40 border-y">
      <div className="container py-12 md:py-16">
        <h2 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
          Marcas que trabajamos
        </h2>
        <p className="text-muted-foreground mt-2 text-base">
          Tenemos stock real de las siguientes marcas, tanto en sol como en
          receta.
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {brands.map((b) => (
            <li key={b.slug}>
              <Link
                href={`/anteojos-de-sol/${b.slug}`}
                className="border-border bg-background hover:border-foreground flex flex-col items-center justify-center gap-1 rounded-md border p-4 text-center transition-colors"
              >
                <span className="text-foreground font-medium">{b.name}</span>
                {b.is_argentine && (
                  <Badge variant="secondary" className="text-[10px]">
                    Marca local
                  </Badge>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
