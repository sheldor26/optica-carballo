import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleFooter } from '@/components/articles/article-footer';
import { ArticleHeader } from '@/components/articles/article-header';
import { RelatedArticles } from '@/components/articles/related-articles';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { ArticleJsonLd } from '@/components/seo/article-jsonld';
import { FaqJsonLd } from '@/components/seo/faq-jsonld';
import { FaqAccordion } from '@/components/faqs/faq-accordion';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import {
  getAllArticleSlugs,
  getArticle,
  getRelatedArticles,
} from '@/lib/content/articles';
import { getWhatsappLinkWithContext } from '@/lib/site/business';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const revalidate = 600;

type Params = { slug: string };

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) {
    return { title: 'Guía no encontrada — Óptica Carballo' };
  }

  const { frontmatter } = article;
  const pageUrl = `${SITE_URL}/guias/${frontmatter.slug}`;

  return {
    title: `${frontmatter.title} — Óptica Carballo`,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    alternates: { canonical: pageUrl },
    // Borrador: accesible por URL (revisión del founder en la nube) pero
    // Google NO lo indexa hasta que se publique (draft: false).
    ...(frontmatter.draft ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: pageUrl,
      type: 'article',
      publishedTime: frontmatter.publishedAt,
      modifiedTime: frontmatter.updatedAt,
      authors: [frontmatter.author],
      ...(frontmatter.heroImage
        ? {
            images: [
              {
                url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/article-images/${frontmatter.heroImage}`,
                width: 1200,
                height: 630,
                alt: frontmatter.heroImageAlt ?? frontmatter.title,
              },
            ],
          }
        : {}),
    },
  };
}

/**
 * Página individual de artículo. Server Component que:
 * 1. Lee frontmatter + content del .mdx con `getArticle()` (filesystem).
 * 2. Dinámicamente importa el componente MDX compilado por @next/mdx.
 * 3. Renderiza header + content + footer + related.
 *
 * Importante: el path del dynamic import es relativo a este archivo, no
 * absoluto. `@next/mdx` compila los .mdx en `content/guias/` cuando se
 * importan. Cada artículo se vuelve un componente React static.
 */
export default async function GuiaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const { frontmatter } = article;
  const related = getRelatedArticles(frontmatter);
  const whatsappLink = getWhatsappLinkWithContext(
    `Hola, leí "${frontmatter.title}" y me quedó una duda.`,
  );

  // Dynamic import del MDX compilado. @next/mdx con pageExtensions=['mdx']
  // genera un componente React para cada .mdx. Importamos solo el componente
  // (default export), el frontmatter ya lo leímos via gray-matter.
  const MDXContent = await import(`@/content/guias/${slug}.mdx`).then(
    (mod) => mod.default,
  );

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: SITE_URL },
          { name: 'Guías', url: `${SITE_URL}/guias` },
          { name: frontmatter.title, url: `${SITE_URL}/guias/${slug}` },
        ]}
      />
      <ArticleJsonLd frontmatter={frontmatter} />
      {frontmatter.faqs && frontmatter.faqs.length > 0 && (
        <FaqJsonLd items={frontmatter.faqs} />
      )}

      {frontmatter.draft && (
        <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          <strong>Borrador — no visible al público.</strong> Esta guía está
          desplegada solo para revisión. No aparece en el listado de guías ni
          se indexa en Google. Para publicarla, sacá <code>draft: true</code> del
          frontmatter.
        </div>
      )}

      <nav aria-label="Breadcrumb" className="text-muted-foreground mb-8 text-sm">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-foreground">
              Inicio
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/guias" className="hover:text-foreground">
              Guías
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground line-clamp-1" aria-current="page">
            {frontmatter.title}
          </li>
        </ol>
      </nav>

      <ArticleHeader frontmatter={frontmatter} />

      <div className="prose prose-zinc max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-h2:text-3xl prose-h2:font-medium prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-medium prose-h3:mt-8 prose-h3:mb-3 prose-p:text-base prose-p:leading-relaxed prose-li:text-base prose-li:leading-relaxed prose-strong:text-foreground prose-strong:font-semibold prose-a:text-foreground prose-a:underline prose-a:underline-offset-2 prose-a:decoration-foreground/30 hover:prose-a:decoration-foreground prose-blockquote:border-l-2 prose-blockquote:border-brand prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-foreground/80 md:prose-lg">
        <MDXContent />
      </div>

      {frontmatter.faqs && frontmatter.faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-foreground font-serif text-3xl font-medium tracking-tight">
            Preguntas frecuentes
          </h2>
          <div className="mt-5">
            <FaqAccordion items={frontmatter.faqs} />
          </div>
        </section>
      )}

      <RevealOnScroll>
        <ArticleFooter
          frontmatter={frontmatter}
          whatsappLink={whatsappLink}
          pageUrl={`${SITE_URL}/guias/${slug}`}
        />
      </RevealOnScroll>

      <RelatedArticles articles={related} />
    </article>
  );
}
