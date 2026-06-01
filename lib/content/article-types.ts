/**
 * Types para artículos/guías editoriales del sitio.
 *
 * Convenciones:
 * - Slug = nombre del archivo .mdx sin extensión.
 * - Frontmatter es YAML al inicio de cada .mdx (parseado con gray-matter).
 * - Cluster matchea CONTENT_PLAN.md (Cluster 1-N, ver doc).
 * - Author es referenciado por key (juan / maria-carlota) — bios completas
 *   en `lib/content/article-authors.ts`.
 *
 * Schema YAML esperado en cada .mdx:
 *
 *   ---
 *   title: "Cómo leer la receta de anteojos"
 *   slug: "como-leer-receta-anteojos"
 *   description: "Aprendé a interpretar tu receta oftalmológica..."
 *   keywords: ["como leer receta de anteojos", "esfera cilindro eje"]
 *   cluster: "como-leer-receta"
 *   type: "pillar"          # pillar | satellite
 *   author: "juan"
 *   reviewer: "maria-carlota"   # opcional, validación técnica
 *   publishedAt: "2026-05-30"
 *   updatedAt: "2026-05-30"
 *   readingMinutes: 12
 *   heroImage: "guias/como-leer-receta-hero.jpg"   # opcional, en bucket article-images
 *   heroImageAlt: "Receta oftalmológica argentina"
 *   relatedSlugs: ["que-es-esfera", "que-es-cilindro-y-eje"]
 *   ---
 */

export type ArticleType = 'pillar' | 'satellite';

/** Cluster slug — debe matchear CONTENT_PLAN.md. Si agregás un cluster nuevo,
 * actualizá esta unión + el display label en `lib/content/article-clusters.ts`. */
export type ArticleCluster =
  | 'como-leer-receta'
  | 'anteojos-computadora'
  | 'lentes-de-contacto'
  | 'forma-de-cara'
  | 'patologias-visuales'
  | 'mantenimiento'
  | 'glosario'
  | 'comparativas';

export type AuthorKey = 'juan' | 'maria-carlota';

export interface Author {
  key: AuthorKey;
  displayName: string;
  role: string;
  matricula: string | null;
  bio: string;
  avatarPath: string | null;
}

/** Frontmatter parseado del .mdx — fuente de verdad para metadata + SEO + UI. */
export interface ArticleFrontmatter {
  title: string;
  slug: string;
  description: string;
  keywords: string[];
  cluster: ArticleCluster;
  type: ArticleType;
  author: AuthorKey;
  reviewer?: AuthorKey;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  heroImage: string | null;
  heroImageAlt: string | null;
  relatedSlugs: string[];
  /**
   * Borrador "unlisted": si es `true`, el artículo se DESPLIEGA y es accesible
   * por su URL (para que el founder lo revise en la nube), pero NO aparece en
   * el índice /guias, ni en relacionados, ni en listas por cluster, y se marca
   * `noindex` (Google no lo indexa). Pasar a `false`/omitir para publicarlo.
   * Distinto del prefijo `_` en el filename, que oculta el archivo del todo
   * (404 hasta para el founder).
   */
  draft?: boolean;
  /**
   * Preguntas frecuentes de la guía. Si está presente, la page renderiza:
   * (a) un acordeón VISIBLE al final + (b) `FAQPage` JSON-LD con el MISMO
   * contenido (Google exige que coincidan). 3-6 preguntas sacadas de
   * People-Also-Ask / keyword research. Ver ARTICLE_SEO_STANDARD.md §2.2.
   */
  faqs?: { id: string; question: string; answer: string }[];
  /**
   * Si está presente, el JSON-LD sube de `Article` a `MedicalWebPage` con
   * `about: MedicalCondition` + `lastReviewed` (E-E-A-T YMYL). Usar el nombre
   * clínico de la condición, ej. "Astigmatismo", "Presbicia". Omitir en guías
   * NO médicas (forma de cara, tendencias) → quedan como `Article`.
   */
  medicalCondition?: string;
}

/** Artículo completo — frontmatter + contenido MDX raw. El contenido se
 * compila con MDX en el componente que renderiza (RSC). */
export interface Article {
  frontmatter: ArticleFrontmatter;
  /** Markdown/MDX raw — se compila al renderizar con next-mdx-remote o
   * importación dinámica. */
  content: string;
}

/** Summary para listados — solo frontmatter, sin content (más ligero). */
export type ArticleSummary = ArticleFrontmatter;
