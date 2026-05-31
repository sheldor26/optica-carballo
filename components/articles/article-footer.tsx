import Link from 'next/link';
import { ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { getAuthor } from '@/lib/content/article-authors';
import { ShareButtons } from '@/components/share/share-buttons';
import type { ArticleFrontmatter } from '@/lib/content/article-types';

/**
 * Footer del artículo individual: share buttons + bio del autor + revisor
 * (si hay) + CTA WhatsApp para consultas + nota de actualización.
 *
 * Importante para E-E-A-T: la bio + matrícula explícita al pie de cada
 * artículo es clave para que Google reconozca autoridad del autor en
 * categorías YMYL (Your Money Your Life — salud entra acá).
 */
export function ArticleFooter({
  frontmatter,
  whatsappLink,
  pageUrl,
}: {
  frontmatter: ArticleFrontmatter;
  whatsappLink: string | null;
  /** URL absoluta del artículo para los share buttons. */
  pageUrl: string;
}) {
  const author = getAuthor(frontmatter.author);
  const reviewer = frontmatter.reviewer ? getAuthor(frontmatter.reviewer) : null;
  const wasUpdated = frontmatter.updatedAt !== frontmatter.publishedAt;

  return (
    <footer className="border-foreground/10 mt-16 border-t pt-12 md:mt-24 md:pt-16">
      <div className="mb-10 flex flex-wrap items-center gap-3">
        <ShareButtons
          title={frontmatter.title}
          url={pageUrl}
          contentType="article"
          itemSlug={frontmatter.slug}
          variant="labeled"
        />
      </div>

      {wasUpdated && (
        <p className="text-muted-foreground mb-8 text-xs">
          Última actualización:{' '}
          <time dateTime={frontmatter.updatedAt}>
            {new Date(frontmatter.updatedAt).toLocaleDateString('es-AR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </p>
      )}

      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        <div className="flex-1">
          <p className="text-foreground/60 text-xs font-medium uppercase tracking-[0.18em]">
            Sobre el autor
          </p>
          <h3 className="text-foreground mt-3 font-serif text-xl font-medium tracking-tight md:text-2xl">
            {author.displayName}
          </h3>
          <p className="text-foreground/70 mt-1 text-sm font-medium">
            {author.role}
            {author.matricula && (
              <span className="text-foreground/60"> · Mat. {author.matricula}</span>
            )}
          </p>
          <p className="text-muted-foreground mt-3 max-w-prose text-sm leading-relaxed">
            {author.bio}
          </p>
        </div>

        {reviewer && (
          <div className="flex-1">
            <p className="text-foreground/60 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em]">
              <ShieldCheck className="text-brand size-3.5" aria-hidden="true" />
              Revisión técnica
            </p>
            <h3 className="text-foreground mt-3 font-serif text-xl font-medium tracking-tight md:text-2xl">
              {reviewer.displayName}
            </h3>
            <p className="text-foreground/70 mt-1 text-sm font-medium">
              {reviewer.role}
              {reviewer.matricula && (
                <span className="text-foreground/60"> · Mat. {reviewer.matricula}</span>
              )}
            </p>
            <p className="text-muted-foreground mt-3 max-w-prose text-sm leading-relaxed">
              {reviewer.bio}
            </p>
          </div>
        )}
      </div>

      {whatsappLink && (
        <div className="bg-zinc-50 mt-12 flex flex-col gap-4 rounded-xl p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="text-foreground font-serif text-xl font-medium tracking-tight md:text-2xl">
              ¿Te quedó alguna duda?
            </p>
            <p className="text-muted-foreground mt-1 max-w-xl text-sm md:text-base">
              Escribinos por WhatsApp y te respondemos por técnico óptico
              matriculado. Sin bots, sin esperas largas.
            </p>
          </div>
          <Link
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-foreground text-background hover:bg-foreground/90 inline-flex shrink-0 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition-colors"
          >
            <MessageCircle className="size-4" />
            Consultar por WhatsApp
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </footer>
  );
}
