import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import type { RelatedLink } from '@/lib/site/related-categories';

/**
 * Bloque "También podría interesarte" — links contextuales a otras
 * sub-categorías del catálogo. Refuerza internal linking + UX descubrimiento
 * sin saturar la página de catálogo.
 *
 * Si `links` está vacío, el bloque NO se renderiza (mejor que mostrar vacío).
 */
export function RelatedCategoriesBlock({ links }: { links: RelatedLink[] }) {
  if (links.length === 0) return null;

  return (
    <RevealOnScroll
      as="section"
      aria-labelledby="related-categories-heading"
      className="border-border/60 mt-20 border-t pt-10 md:mt-24"
    >
      <h2
        id="related-categories-heading"
        className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.18em]"
      >
        También podría interesarte
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="border-border/60 bg-background hover:bg-accent hover:border-foreground/30 inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
            >
              {link.label}
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </RevealOnScroll>
  );
}
