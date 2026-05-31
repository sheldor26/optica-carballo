import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ShieldCheck } from 'lucide-react';
import { getClusterLabel } from '@/lib/content/article-clusters';
import { getAuthor } from '@/lib/content/article-authors';
import type { ArticleFrontmatter } from '@/lib/content/article-types';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321';

function articleImageUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/article-images/${path}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Header editorial del artículo individual. Layout vertical centrado con:
 * - Eyebrow cluster + tipo (Pillar/Satellite)
 * - H1 display serif grande
 * - Description balanced
 * - Meta: autor + revisor (si hay) + fecha + tiempo lectura
 * - Hero image opcional (full width abajo)
 */
export function ArticleHeader({
  frontmatter,
}: {
  frontmatter: ArticleFrontmatter;
}) {
  const author = getAuthor(frontmatter.author);
  const reviewer = frontmatter.reviewer ? getAuthor(frontmatter.reviewer) : null;
  const clusterLabel = getClusterLabel(frontmatter.cluster);

  return (
    <header className="mb-12 md:mb-16">
      <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em]">
        <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
        <Link href="/guias" className="hover:text-foreground transition-colors">
          {clusterLabel}
        </Link>
      </p>

      <h1 className="text-foreground mt-6 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
        {frontmatter.title}
      </h1>

      <p className="text-muted-foreground mt-6 max-w-2xl text-balance text-lg leading-relaxed md:text-xl">
        {frontmatter.description}
      </p>

      <div className="text-foreground/70 mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <div className="inline-flex items-center gap-2">
          <span className="text-foreground font-medium">
            {author.displayName}
          </span>
          <span className="text-foreground/60 text-xs">· {author.role}</span>
        </div>
        {reviewer && (
          <div className="text-foreground/70 inline-flex items-center gap-1.5 text-xs">
            <ShieldCheck className="text-brand size-3.5" aria-hidden="true" />
            <span>
              Revisado por <strong className="font-medium">{reviewer.displayName}</strong>
            </span>
          </div>
        )}
        <span aria-hidden="true" className="text-foreground/40">·</span>
        <span className="inline-flex items-center gap-1.5 text-xs">
          <Calendar className="size-3.5" />
          <time dateTime={frontmatter.publishedAt}>
            {formatDate(frontmatter.publishedAt)}
          </time>
        </span>
        <span aria-hidden="true" className="text-foreground/40">·</span>
        <span className="inline-flex items-center gap-1.5 text-xs">
          <Clock className="size-3.5" />
          {frontmatter.readingMinutes} min de lectura
        </span>
      </div>

      {frontmatter.heroImage && (
        <div className="bg-zinc-50 relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-lg md:mt-16 md:aspect-[2/1]">
          <Image
            src={articleImageUrl(frontmatter.heroImage)}
            alt={frontmatter.heroImageAlt ?? ''}
            fill
            sizes="(max-width: 1024px) 100vw, 80vw"
            priority
            className="object-cover"
          />
        </div>
      )}
    </header>
  );
}
