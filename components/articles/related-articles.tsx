import { ArticleCard } from '@/components/articles/article-card';
import type { ArticleSummary } from '@/lib/content/article-types';

/**
 * Sección "Artículos relacionados" al pie del artículo individual.
 * Muestra hasta 3 artículos del mismo cluster o explícitamente listados
 * en `relatedSlugs`. Si no hay relacionados, no renderiza nada.
 */
export function RelatedArticles({
  articles,
}: {
  articles: ArticleSummary[];
}) {
  if (articles.length === 0) return null;
  const visible = articles.slice(0, 3);

  return (
    <section
      aria-labelledby="related-articles-heading"
      className="border-foreground/10 mt-16 border-t pt-16 md:mt-24"
    >
      <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em]">
        <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
        Seguir leyendo
      </p>
      <h2
        id="related-articles-heading"
        className="text-foreground mt-6 max-w-2xl text-balance font-serif text-3xl font-medium leading-[1.05] tracking-[-0.015em] md:text-4xl lg:text-5xl"
      >
        Artículos relacionados
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
