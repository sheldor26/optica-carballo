import Image from 'next/image';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { fetchProductsBySlugs } from '@/lib/catalog/queries';
import { formatPriceCents } from '@/lib/format/currency';
import { readRecentCookie } from '@/lib/recently-viewed/cookie';
import { getProductImageUrl } from '@/lib/storage/product-image-url';

type Props = {
  /** Slugs a excluir (ej: el producto que está viendo ahora). */
  excludeSlugs?: string[];
  /** Cantidad máxima a mostrar. */
  limit?: number;
  /** Heading custom. */
  heading?: string;
  /** Mínimo para renderizar la sección. Default 2 — si hay menos, no aparece. */
  minToRender?: number;
};

/**
 * Server component que renderiza la sección "Vistos recientemente".
 * Lee el cookie + fetch de productos + grid horizontal scroll mobile.
 *
 * NO renderiza nada si:
 * - No hay items en el cookie.
 * - Items < minToRender (después de excludeSlugs).
 */
export async function RecentlyViewed({
  excludeSlugs = [],
  limit = 6,
  heading = 'Estuviste mirando',
  minToRender = 2,
}: Props) {
  const entries = await readRecentCookie();
  const filteredEntries = entries.filter((e) => !excludeSlugs.includes(e.slug));

  if (filteredEntries.length < minToRender) return null;

  const slugs = filteredEntries.slice(0, limit).map((e) => e.slug);
  const products = await fetchProductsBySlugs(slugs);

  // Mantener orden del cookie (más reciente primero).
  const ordered = filteredEntries
    .slice(0, limit)
    .map((e) => products.find((p) => p.slug === e.slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (ordered.length < minToRender) return null;

  return (
    <section
      aria-labelledby="recently-viewed-heading"
      className="container py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl">
        <RevealOnScroll>
          <p className="text-brand inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
            <Eye className="size-3.5" />
            Tu historial
          </p>
          <h2
            id="recently-viewed-heading"
            className="text-foreground mt-3 font-serif text-2xl font-medium tracking-tight md:text-3xl"
          >
            {heading}
          </h2>
        </RevealOnScroll>

        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-6">
          {ordered.map((p, idx) => (
            <RevealOnScroll
              as="li"
              key={p.slug}
              delay={50 * idx}
              className="h-full"
            >
              <RecentCard
                slug={p.slug}
                name={p.name}
                brandName={p.brandName}
                brandSlug={p.brandSlug}
                categorySlug={p.categorySlug}
                primaryImagePath={p.primaryImagePath}
                minPriceCents={p.minPriceCents}
              />
            </RevealOnScroll>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RecentCard({
  slug,
  name,
  brandName,
  brandSlug,
  categorySlug,
  primaryImagePath,
  minPriceCents,
}: {
  slug: string;
  name: string;
  brandName: string;
  brandSlug: string;
  categorySlug: string;
  primaryImagePath: string | null;
  minPriceCents: number | null;
}) {
  const href = `/${categorySlug}/${brandSlug}/${slug}`;
  const imageUrl = primaryImagePath ? getProductImageUrl(primaryImagePath) : null;

  return (
    <Link
      href={href}
      className="group block h-full"
      aria-label={`${brandName} ${name}`}
    >
      <article className="flex h-full flex-col">
        <div className="bg-background relative aspect-[4/3] w-full overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center text-[10px]">
              Foto pendiente
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-1 flex-col items-center gap-0.5 text-center">
          <p className="text-muted-foreground/80 text-[10px] font-medium uppercase tracking-[0.18em]">
            {brandName}
          </p>
          <h3 className="text-foreground line-clamp-2 text-xs font-normal uppercase leading-tight tracking-[0.12em]">
            {name}
          </h3>
          {minPriceCents !== null && (
            <p className="text-muted-foreground mt-1 text-xs tabular-nums">
              {formatPriceCents(minPriceCents)}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
