import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { getClusterLabel } from '@/lib/content/article-clusters';
import { getAuthor } from '@/lib/content/article-authors';
import type { ArticleSummary } from '@/lib/content/article-types';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321';

/** Construye URL pública para imagen de artículo en bucket `article-images`. */
function articleImageUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/article-images/${path}`;
}

/**
 * Card editorial de artículo para listados. Estética consistente con
 * homepage (ValueProps light + HowWeWork): serif title + eyebrow cluster
 * + meta lectura. Imagen de portada opcional arriba.
 */
export function ArticleCard({ article }: { article: ArticleSummary }) {
  const author = getAuthor(article.author);
  const clusterLabel = getClusterLabel(article.cluster);

  return (
    <article className="group/article flex h-full flex-col">
      <Link
        href={`/guias/${article.slug}`}
        className="flex h-full flex-col"
        aria-label={article.title}
      >
        {article.heroImage ? (
          <div className="bg-zinc-50 relative aspect-[3/2] w-full overflow-hidden rounded-lg transition-shadow duration-500 ease-out group-hover/article:shadow-lg group-hover/article:shadow-zinc-900/[0.08]">
            <Image
              src={articleImageUrl(article.heroImage)}
              alt={article.heroImageAlt ?? ''}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover/article:scale-[1.04]"
            />
          </div>
        ) : (
          <div className="bg-zinc-100 relative flex aspect-[3/2] w-full items-center justify-center overflow-hidden rounded-lg">
            <span className="text-muted-foreground/40 font-serif text-5xl italic">
              {clusterLabel.charAt(0)}
            </span>
          </div>
        )}

        <div className="mt-5 flex flex-1 flex-col gap-3">
          <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em]">
            <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
            {clusterLabel}
          </p>
          <h3 className="text-foreground font-serif text-2xl font-medium leading-tight tracking-[-0.015em] transition-colors duration-300 group-hover/article:text-foreground/90 md:text-[26px]">
            {article.title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-sm md:text-base">
            {article.description}
          </p>
          <div className="text-muted-foreground/80 mt-auto flex items-center gap-3 pt-3 text-xs">
            <span>{author.displayName}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" />
              {article.readingMinutes} min
            </span>
          </div>
        </div>

        <div className="text-foreground/80 group-hover/article:text-foreground mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors">
          Leer artículo
          <ArrowRight className="size-4 transition-transform duration-300 group-hover/article:translate-x-1" />
        </div>
      </Link>
    </article>
  );
}
