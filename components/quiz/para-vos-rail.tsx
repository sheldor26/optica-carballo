'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { readQuizAnswers } from '@/lib/quiz/client';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import { formatPriceCents } from '@/lib/format/currency';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import type { QuizRecommendation } from '@/lib/quiz/types';

/**
 * Riel "Pensado para vos": recomendaciones personalizadas según el quiz que el
 * usuario ya hizo. Lee la cookie `oc_quiz` client-side (no rompe el ISR del
 * home) y reusa la lógica del quiz vía /api/para-vos. Si el usuario no hizo el
 * quiz, no renderiza nada.
 */
export function ParaVosRail() {
  const [recs, setRecs] = useState<QuizRecommendation[] | null>(null);

  useEffect(() => {
    const answers = readQuizAnswers();
    if (!answers) return;
    const params = new URLSearchParams(
      answers as unknown as Record<string, string>,
    );
    fetch(`/api/para-vos?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { recommendations?: QuizRecommendation[] } | null) => {
        if (data?.recommendations && data.recommendations.length > 0) {
          setRecs(data.recommendations);
        }
      })
      .catch(() => {
        // silencioso — el riel es un extra
      });
  }, []);

  if (!recs || recs.length === 0) return null;

  return (
    <RevealOnScroll as="section" className="container py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em]">
            <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
            Pensado para vos
          </p>
          <h2 className="text-foreground mt-3 font-serif text-3xl font-medium tracking-[-0.015em] md:text-4xl">
            Según tu <span className="italic font-normal text-foreground/70">quiz</span>
          </h2>
        </div>
        <Link
          href="/encontra-tu-anteojo"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm underline-offset-2 hover:underline"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Rehacer el quiz
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {recs.map((rec) => {
          const imageUrl = rec.primaryImagePath
            ? getProductImageUrl(rec.primaryImagePath)
            : null;
          const href = `/${rec.categorySlug}/${rec.brandSlug}/${rec.slug}`;
          return (
            <Link
              key={rec.slug}
              href={href}
              className="group border-border/60 bg-background hover:border-foreground/40 flex flex-col overflow-hidden rounded-2xl border transition-colors"
            >
              <div className="bg-background relative aspect-[4/3] w-full overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={`${rec.brandName} ${rec.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ transform: `scale(${rec.primaryImageScale})` }}
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="text-muted-foreground flex h-full items-center justify-center text-4xl">
                    👓
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-wider">
                  {rec.brandName}
                </p>
                <h3 className="text-foreground mt-1 font-medium leading-snug">
                  {rec.name}
                </h3>
                <p className="text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed">
                  {rec.justification}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  {rec.minPriceCents != null ? (
                    <p className="text-foreground font-semibold tabular-nums">
                      {formatPriceCents(rec.minPriceCents)}
                    </p>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      A consultar
                    </span>
                  )}
                  <span className="text-foreground inline-flex items-center gap-1 text-sm font-medium">
                    Ver
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </RevealOnScroll>
  );
}
