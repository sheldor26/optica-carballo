import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleCard } from '@/components/articles/article-card';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { listArticles } from '@/lib/content/articles';
import { CLUSTER_LABELS } from '@/lib/content/article-clusters';
import type { ArticleCluster } from '@/lib/content/article-types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return {
    // El template del layout raíz agrega " | Óptica Carballo"; no duplicar acá.
    title: 'Guías y artículos',
    description:
      'Guías y artículos sobre salud visual, anteojos, lentes de contacto, recetas oftalmológicas. Con más de 30 años de experiencia en óptica.',
    alternates: {
      canonical: `${SITE_URL}/guias`,
      languages: { 'es-AR': `${SITE_URL}/guias`, 'x-default': `${SITE_URL}/guias` },
    },
    openGraph: {
      title: 'Guías y artículos — Óptica Carballo',
      description:
        'Guías sobre salud visual y anteojos, con experiencia real en óptica.',
      url: `${SITE_URL}/guias`,
      type: 'website',
    },
  };
}

/**
 * Página índice de la sección Guías. Muestra todos los artículos
 * publicados agrupados por cluster (si hay 2+ clusters representados),
 * o como grid simple si solo hay 1.
 *
 * Si no hay artículos publicados (estado inicial), mostramos mensaje
 * informativo con el plan editorial (anticipación SEO).
 */
export default function GuiasIndexPage() {
  const articles = listArticles();

  // Agrupar por cluster para layout editorial. Mantiene orden de aparición
  // según el primer artículo de cada cluster (más reciente primero).
  const byCluster = new Map<ArticleCluster, typeof articles>();
  for (const article of articles) {
    const list = byCluster.get(article.cluster) ?? [];
    list.push(article);
    byCluster.set(article.cluster, list);
  }

  return (
    <main className="container py-12 md:py-20">
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: SITE_URL },
          { name: 'Guías', url: `${SITE_URL}/guias` },
        ]}
      />

      <nav aria-label="Breadcrumb" className="text-muted-foreground mb-8 text-sm">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-foreground">
              Inicio
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground" aria-current="page">
            Guías
          </li>
        </ol>
      </nav>

      <RevealOnScroll as="section" className="mb-16 max-w-3xl md:mb-20">
        <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
          <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
          Guías
        </p>
        <h1 className="text-foreground mt-6 text-balance font-serif text-5xl font-medium leading-[1.05] tracking-[-0.02em] md:text-6xl lg:text-7xl">
          Salud visual{' '}
          <span className="font-normal italic text-foreground/70">
            sin vueltas.
          </span>
        </h1>
        <p className="text-muted-foreground mt-6 max-w-2xl text-balance text-base md:text-lg">
          Artículos escritos con más de 30 años de experiencia en óptica. Cómo
          leer tu receta, cómo elegir armazón, cómo cuidar tus lentes. Sin
          marketing inflado, sin promesas falsas.
        </p>
      </RevealOnScroll>

      {articles.length === 0 ? (
        <ComingSoonBlock />
      ) : byCluster.size === 1 ? (
        <section
          aria-label="Todas las guías"
          className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3"
        >
          {articles.map((article, idx) => (
            <RevealOnScroll
              key={article.slug}
              delay={60 * idx}
              className="h-full"
            >
              <ArticleCard article={article} />
            </RevealOnScroll>
          ))}
        </section>
      ) : (
        <div className="space-y-20 md:space-y-28">
          {[...byCluster.entries()].map(([cluster, items]) => (
            <section
              key={cluster}
              aria-labelledby={`cluster-${cluster}-heading`}
            >
              <RevealOnScroll>
                <h2
                  id={`cluster-${cluster}-heading`}
                  className="text-foreground font-serif text-2xl font-medium tracking-[-0.01em] md:text-3xl"
                >
                  {CLUSTER_LABELS[cluster]}
                </h2>
              </RevealOnScroll>
              <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
                {items.map((article, idx) => (
                  <RevealOnScroll
                    key={article.slug}
                    delay={60 * idx}
                    className="h-full"
                  >
                    <ArticleCard article={article} />
                  </RevealOnScroll>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

/** Mensaje cuando no hay artículos publicados todavía. */
function ComingSoonBlock() {
  return (
    <div className="bg-zinc-50 rounded-xl px-6 py-16 text-center md:px-12 md:py-24">
      <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em]">
        <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
        Próximamente
      </p>
      <h2 className="text-foreground mt-6 mx-auto max-w-xl text-balance font-serif text-3xl font-medium tracking-[-0.015em] md:text-4xl">
        Estamos preparando guías de calidad.
      </h2>
      <p className="text-muted-foreground mt-4 mx-auto max-w-xl text-balance text-base">
        Próximos artículos:{' '}
        {Object.values(CLUSTER_LABELS).slice(0, 4).join(' · ')} y más. Volvé en
        unos días.
      </p>
    </div>
  );
}
