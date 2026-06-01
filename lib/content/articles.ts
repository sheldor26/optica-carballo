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

/** Lee el frontmatter de todos los .mdx (excluye `_*` templates), SIN filtrar
 * drafts. Uso interno + `generateStaticParams` (los drafts se pre-renderizan
 * para que el founder los vea rápido por URL en la nube). */
function readAllFrontmatter(): ArticleSummary[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const filenames = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .filter((f) => !f.startsWith('_'));

  return filenames
    .map((f) => readArticleFile(f).frontmatter)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** Lista los artículos PUBLICADOS (frontmatter solo). Excluye `_*` templates
 * Y los `draft: true` (que existen/deployan pero no se listan ni indexan).
 * Ordenado por `publishedAt` descendente. Esta es la lista pública: índice
 * /guias, relacionados, listas por cluster. */
export function listArticles(): ArticleSummary[] {
  return readAllFrontmatter().filter((a) => a.draft !== true);
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

/** Devuelve los slugs de TODOS los artículos (incluidos `draft: true`) para
 * `generateStaticParams`. Los drafts se pre-renderizan para que sean accesibles
 * por URL en la nube (el público igual no los encuentra: no están listados y
 * van `noindex`). */
export function getAllArticleSlugs(): string[] {
  return readAllFrontmatter().map((a) => a.slug);
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
