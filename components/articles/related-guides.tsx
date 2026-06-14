import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import type { ArticleSummary } from '@/lib/content/article-types';

/**
 * Bloque "Para entender tu compra" en la PDP: linkea a las guías editoriales
 * relevantes (ej en receta: presbicia, astigmatismo, cómo leer la receta).
 *
 * Cierra el linking interno catálogo↔guías: antes las guías linkeaban al
 * catálogo pero los productos no a las guías. Pasa autoridad temática (E-E-A-T
 * YMYL) hacia/desde las páginas transaccionales y baja la incertidumbre del
 * comprador (que es el pain del proyecto).
 */
export function RelatedGuides({
  articles,
  heading = 'Para entender tu compra',
}: {
  articles: ArticleSummary[];
  heading?: string;
}) {
  if (articles.length === 0) return null;

  return (
    <RevealOnScroll as="section" className="mt-20 max-w-3xl">
      <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em]">
        <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
        Guías
      </p>
      <h2 className="text-foreground mt-3 font-serif text-2xl font-medium tracking-tight md:text-3xl">
        {heading}
      </h2>
      <ul className="border-border/60 mt-6 divide-y rounded-xl border">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/guias/${article.slug}`}
              className="group hover:bg-muted/30 flex items-start gap-4 p-4 transition-colors md:p-5"
            >
              <span
                aria-hidden="true"
                className="border-border/60 bg-background flex size-9 shrink-0 items-center justify-center rounded-full border"
              >
                <BookOpen className="text-foreground/80 size-4" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-foreground block font-medium leading-snug">
                  {article.title}
                </span>
                <span className="text-muted-foreground mt-0.5 line-clamp-2 block text-sm">
                  {article.description}
                </span>
              </span>
              <ArrowRight
                className="text-muted-foreground mt-1 size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </RevealOnScroll>
  );
}
