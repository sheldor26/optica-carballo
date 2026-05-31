import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type {
  Article,
  ArticleFrontmatter,
  ArticleSummary,
} from '@/lib/content/article-types';

/**
 * File-based article store. Lee archivos .mdx de `content/guias/` al
 * build time (Server Components only — usa node:fs).
 *
 * Convención: el filename del .mdx (sin extensión) debe matchear el slug
 * declarado en frontmatter. Si no matchea, tiramos error en `getArticle`
 * para evitar drift silencioso.
 *
 * Drafts: archivos que empiezan con `_` (ej `_template.mdx`) son ignorados
 * por `listArticles`. Útil para placeholders/borradores sin publicar.
 */

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'guias');

/** Lee y parsea un .mdx. Valida que el slug del frontmatter matchea el filename. */
function readArticleFile(filename: string): Article {
  const filePath = path.join(ARTICLES_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = matter(raw);
  const expectedSlug = filename.replace(/\.mdx?$/, '');
  const frontmatter = parsed.data as ArticleFrontmatter;

  if (frontmatter.slug !== expectedSlug) {
    throw new Error(
      `Article slug mismatch in ${filename}: frontmatter.slug="${frontmatter.slug}" != filename="${expectedSlug}".`,
    );
  }

  return {
    frontmatter,
    content: parsed.content,
  };
}

/** Lista todos los artículos publicados (frontmatter solo, sin content).
 * Excluye archivos que empiezan con `_` (drafts/templates).
 * Ordenado por `publishedAt` descendente (más reciente primero). */
export function listArticles(): ArticleSummary[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const filenames = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .filter((f) => !f.startsWith('_'));

  const articles = filenames.map((f) => readArticleFile(f).frontmatter);

  return articles.sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

/** Obtiene un artículo por slug. Devuelve null si no existe.
 * NO incluye drafts (archivos `_*.mdx`). */
export function getArticle(slug: string): Article | null {
  if (slug.startsWith('_')) return null;
  if (!fs.existsSync(ARTICLES_DIR)) return null;

  const candidates = [`${slug}.mdx`, `${slug}.md`];
  for (const filename of candidates) {
    const filePath = path.join(ARTICLES_DIR, filename);
    if (fs.existsSync(filePath)) {
      return readArticleFile(filename);
    }
  }
  return null;
}

/** Devuelve los slugs de artículos para `generateStaticParams`. */
export function getAllArticleSlugs(): string[] {
  return listArticles().map((a) => a.slug);
}

/** Resuelve `relatedSlugs` del frontmatter a summaries.
 * Filtra slugs inexistentes (no rompe si un related se eliminó). */
export function getRelatedArticles(
  frontmatter: ArticleFrontmatter,
): ArticleSummary[] {
  const all = listArticles();
  const slugMap = new Map(all.map((a) => [a.slug, a]));
  return frontmatter.relatedSlugs
    .map((s) => slugMap.get(s))
    .filter((a): a is ArticleSummary => a !== undefined);
}

/** Lista artículos de un cluster específico (excluyendo el actual). */
export function getArticlesByCluster(
  cluster: ArticleFrontmatter['cluster'],
  excludeSlug?: string,
): ArticleSummary[] {
  return listArticles().filter(
    (a) => a.cluster === cluster && a.slug !== excludeSlug,
  );
}
