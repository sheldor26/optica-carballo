import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchQuizRecommendations } from '@/lib/quiz/recommendations';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import { formatPriceCents } from '@/lib/format/currency';
import type { QuizAnswers } from '@/lib/quiz/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tus recomendaciones — Óptica Carballo',
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{
  uso?: string;
  cara?: string;
  precio?: string;
  genero?: string;
  correccion?: string;
}>;

export default async function ResultadosPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const answers: QuizAnswers = {
    uso: (params.uso as QuizAnswers['uso']) ?? 'ambos',
    cara: (params.cara as QuizAnswers['cara']) ?? 'no_se',
    precio: (params.precio as QuizAnswers['precio']) ?? 'medio',
    genero: (params.genero as QuizAnswers['genero']) ?? 'unisex',
    correccion: (params.correccion as QuizAnswers['correccion']) ?? 'no',
  };

  const recommendations = await fetchQuizRecommendations(answers);

  return (
    <main>
      <section className="border-b border-border bg-muted/30 px-4 py-10 text-center md:py-14">
        <p className="text-muted-foreground inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
          <span className="bg-foreground size-1.5 rounded-full" aria-hidden="true" />
          Tus resultados
        </p>
        <h1 className="text-foreground mt-4 font-serif text-4xl font-medium tracking-[-0.02em] md:text-5xl">
          {recommendations.length > 0
            ? 'Encontramos tus anteojos'
            : 'Sin resultados por ahora'}
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance text-sm">
          {recommendations.length > 0
            ? 'Estos modelos se adaptan mejor a lo que nos contaste.'
            : 'El catálogo está creciendo. Mientras tanto, explorá todas las opciones.'}
        </p>
      </section>

      {recommendations.length > 0 ? (
        <section className="container py-10 md:py-14">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((rec, i) => {
              const imageUrl = rec.primaryImagePath
                ? getProductImageUrl(rec.primaryImagePath)
                : null;
              const productHref = `/${rec.categorySlug}/${rec.brandSlug}/${rec.slug}`;

              return (
                <article
                  key={rec.slug}
                  className="group border-border bg-background flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Rank badge */}
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    <span className="absolute left-3 top-3 z-10 bg-foreground text-background text-xs font-bold rounded-full size-7 flex items-center justify-center">
                      {i + 1}
                    </span>
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={`${rec.brandName} ${rec.name}`}
                        fill
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        style={{ objectFit: 'contain', transform: `scale(${rec.primaryImageScale})` }}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-muted-foreground text-4xl">👓</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                      {rec.brandName}
                    </p>
                    <h2 className="text-foreground mt-1 font-semibold leading-snug">
                      {rec.name}
                    </h2>
                    <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                      {rec.justification}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      {rec.minPriceCents != null ? (
                        <p className="text-foreground font-bold tabular-nums">
                          {formatPriceCents(rec.minPriceCents)}
                        </p>
                      ) : (
                        <p className="text-muted-foreground text-sm">Precio a consultar</p>
                      )}
                    </div>

                    <Button asChild className="mt-4 w-full" variant="outline">
                      <Link href={productHref}>
                        Ver modelo
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-sm">
              ¿No te convencieron del todo?
            </p>
            <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild variant="outline">
                <Link href="/encontra-tu-anteojo">
                  <RotateCcw className="size-4" />
                  Repetir el quiz
                </Link>
              </Button>
              <Button asChild>
                <Link href="/anteojos-de-sol">
                  Ver todo el catálogo
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <section className="container py-16 text-center">
          <div className="flex flex-col items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/encontra-tu-anteojo">
                <RotateCcw className="size-4" />
                Volver al quiz
              </Link>
            </Button>
            <Button asChild>
              <Link href="/anteojos-de-sol">
                Ver anteojos de sol
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}
    </main>
  );
}
