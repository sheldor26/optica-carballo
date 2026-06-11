'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { formatPriceCents } from '@/lib/format/currency';
import { readRecentClientSide } from '@/lib/recently-viewed/client';
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

type RecentCardData = {
  slug: string;
  name: string;
  brandName: string;
  brandSlug: string;
  categorySlug: string;
  primaryImagePath: string | null;
  primaryImageScale: number;
  minPriceCents: number | null;
};

/**
 * Sección "Vistos recientemente". Lee el cookie en el browser y pide las
 * cards a `/api/recently-viewed/cards`.
 *
 * Era un server component que leía el cookie con `cookies()` — eso volvía
 * DINÁMICAS la home y las PDP (toda página que la renderiza) y anulaba el
 * ISR (audit perf 2026-06-11). Al ser contenido 100% personalizado, no
 * aporta SEO: no perdemos nada sacándola del HTML estático.
 *
 * NO renderiza nada si:
 * - No hay items en el cookie.
 * - Items < minToRender (después de excludeSlugs).
 */
export function RecentlyViewed({
  excludeSlugs = [],
  limit = 6,
  heading = 'Estuviste mirando',
  minToRender = 2,
}: Props) {
  const [cards, setCards] = useState<RecentCardData[] | null>(null);

  // String estable para no re-disparar el effect por identidad del array.
  const excludeKey = excludeSlugs.join(',');

  useEffect(() => {
    const exclude = excludeKey.split(',').filter((s) => s.length > 0);
    const entries = readRecentClientSide().filter(
      (e) => !exclude.includes(e.slug),
    );
    if (entries.length < minToRender) {
      setCards(null);
      return;
    }
    const slugs = entries.slice(0, limit).map((e) => e.slug);

    let cancelled = false;
    fetch(`/api/recently-viewed/cards?slugs=${encodeURIComponent(slugs.join(','))}`)
      .then((res) => (res.ok ? res.json() : { cards: [] }))
      .then((data: { cards: RecentCardData[] }) => {
        if (cancelled || !Array.isArray(data.cards)) return;
        // Mantener orden del cookie (más reciente primero).
        const ordered = slugs
          .map((slug) => data.cards.find((c) => c.slug === slug))
          .filter((c): c is RecentCardData => Boolean(c));
        setCards(ordered.length >= minToRender ? ordered : null);
      })
      .catch(() => {
        if (!cancelled) setCards(null);
      });
    return () => {
      cancelled = true;
    };
  }, [excludeKey, limit, minToRender]);

  if (!cards) return null;

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
          {cards.map((p, idx) => (
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
                primaryImageScale={p.primaryImageScale}
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
  primaryImageScale,
  minPriceCents,
}: {
  slug: string;
  name: string;
  brandName: string;
  brandSlug: string;
  categorySlug: string;
  primaryImagePath: string | null;
  primaryImageScale: number;
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
              style={{ transform: `scale(${primaryImageScale})` }}
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
