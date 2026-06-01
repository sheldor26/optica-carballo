import { getAuthor } from '@/lib/content/article-authors';
import type { ArticleFrontmatter } from '@/lib/content/article-types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321';

function articleImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/article-images/${path}`;
}

/**
 * JSON-LD schema.org/Article — crítico para SEO YMYL.
 *
 * Incluye:
 * - headline + description + datePublished + dateModified
 * - author con role (Person/MedicalBusiness)
 * - publisher (Óptica Carballo)
 * - mainEntityOfPage + image
 *
 * Si hay reviewer matriculado, lo agregamos como `reviewedBy` (extension
 * schema.org/MedicalScholarlyArticle) — refuerza E-E-A-T para Google.
 */
export function ArticleJsonLd({
  frontmatter,
}: {
  frontmatter: ArticleFrontmatter;
}) {
  const author = getAuthor(frontmatter.author);
  const reviewer = frontmatter.reviewer
    ? getAuthor(frontmatter.reviewer)
    : null;
  const pageUrl = `${SITE_URL}/guias/${frontmatter.slug}`;
  const imageUrl = articleImageUrl(frontmatter.heroImage);

  // Guías de salud (con `medicalCondition`) suben a MedicalWebPage + about +
  // lastReviewed → señal YMYL fuerte para Google. El resto queda como Article.
  const isMedical = Boolean(frontmatter.medicalCondition);

  const data = {
    '@context': 'https://schema.org',
    '@type': isMedical ? 'MedicalWebPage' : 'Article',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.publishedAt,
    dateModified: frontmatter.updatedAt,
    inLanguage: 'es-AR',
    keywords: frontmatter.keywords.join(', '),
    ...(isMedical
      ? {
          about: {
            '@type': 'MedicalCondition',
            name: frontmatter.medicalCondition,
          },
          // Revisado por la regente matriculada — E-E-A-T YMYL.
          lastReviewed: frontmatter.updatedAt,
        }
      : {}),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    author: {
      '@type': 'Person',
      name: author.displayName,
      jobTitle: author.role,
      ...(author.matricula
        ? { identifier: `Matrícula ${author.matricula}` }
        : {}),
    },
    ...(reviewer
      ? {
          reviewedBy: {
            '@type': 'Person',
            name: reviewer.displayName,
            jobTitle: reviewer.role,
            ...(reviewer.matricula
              ? { identifier: `Matrícula ${reviewer.matricula}` }
              : {}),
          },
        }
      : {}),
    publisher: {
      '@type': 'Organization',
      name: 'Óptica Carballo',
      url: SITE_URL,
    },
    ...(imageUrl ? { image: imageUrl } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
