'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LetterReveal } from '@/components/ui/letter-reveal';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { formatPriceCents } from '@/lib/format/currency';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import type { HomeShowcaseProduct } from '@/lib/catalog/queries';

type Props = {
  showcase: HomeShowcaseProduct | null;
  siteName: string;
  whatsappLink: string | null;
};

export function HomeHero({ showcase, siteName, whatsappLink }: Props) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const photoY = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : 60]);
  const textY = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : -20]);

  const showcaseHref = showcase
    ? `/${showcase.categorySlug}/${showcase.brandSlug}/${showcase.slug}`
    : null;
  const showcaseImageUrl = showcase
    ? getProductImageUrl(showcase.primaryImagePath)
    : null;

  return (
    <section
      ref={ref}
      className="from-muted/30 to-background relative isolate overflow-hidden bg-gradient-to-b"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="bg-foreground/[0.06] animate-mesh-a absolute -top-24 left-[18%] size-[520px] rounded-full blur-3xl" />
        <div className="bg-brand/[0.08] animate-mesh-b absolute top-1/2 right-[12%] size-[620px] rounded-full blur-3xl" />
        <div className="bg-foreground/[0.04] animate-mesh-c absolute -bottom-32 left-1/2 size-[480px] -translate-x-1/2 rounded-full blur-3xl" />
      </div>

      <div className="container relative grid grid-cols-1 items-center gap-8 py-12 md:grid-cols-[1.05fr_1fr] md:gap-12 md:py-28 lg:py-32">
        <motion.div
          style={{ y: textY }}
          className="relative order-2 md:order-1"
        >
          <p className="hero-reveal hero-reveal-1 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
            <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
            <span className="text-brand">{siteName}</span>
          </p>
          <h1 className="mt-5 text-balance font-serif text-5xl font-medium leading-[1.02] tracking-[-0.02em] md:text-6xl lg:text-7xl">
            <LetterReveal text="Anteojos originales con " delay={0.2} />
            <LetterReveal
              text="asesoramiento óptico real"
              italic
              delay={1}
              className="font-normal text-foreground/80"
            />
          </h1>
          <p className="hero-reveal hero-reveal-3 text-muted-foreground mt-6 max-w-xl text-balance text-base md:text-lg">
            Anteojos de sol y receta de las marcas que trabajamos. Atención
            personalizada por técnico óptico matriculado, envíos a todo el
            país y cuotas sin interés.
          </p>
          <div className="hero-reveal hero-reveal-4 mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <MagneticButton className="w-full sm:w-auto">
              <Button asChild size="lg" className="shine-on-hover group w-full sm:w-auto">
                <Link href="/anteojos-de-sol">
                  Ver anteojos de sol
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </MagneticButton>
            <MagneticButton className="w-full sm:w-auto">
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="/anteojos-de-receta">Ver anteojos de receta</Link>
              </Button>
            </MagneticButton>
            {whatsappLink && (
              <Button asChild size="lg" variant="ghost" className="w-full sm:w-auto">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4" />
                  WhatsApp
                </a>
              </Button>
            )}
          </div>
        </motion.div>

        {showcase && showcaseHref && showcaseImageUrl ? (
          <motion.div
            style={{ y: photoY }}
            className="relative order-1 mx-auto flex w-full max-w-md items-center justify-center md:order-2 md:max-w-none"
          >
            {/* Chip flotante "30+ años" — único chip, arriba-izquierda
                para no chocar con la floating price card abajo-derecha. */}
            <div
              aria-hidden="true"
              className="border-border/60 bg-background/80 absolute left-1 top-2 z-20 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium shadow-sm backdrop-blur-sm sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs md:-left-2 md:top-6"
              style={{ transform: 'rotate(-2.5deg)' }}
            >
              <Sparkles className="text-brand size-3 sm:size-3.5" />
              30+ años en Argentina
            </div>

            {/* Glow background detrás del producto — pulsa lento para
                acompañar el bob de la foto sin distraer. */}
            <motion.div
              aria-hidden="true"
              animate={
                reduceMotion
                  ? undefined
                  : { opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }
              }
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
              }
              className="bg-brand/15 absolute inset-x-8 top-1/2 -z-10 h-[70%] -translate-y-1/2 rounded-full blur-3xl"
            />

            <Link
              href={showcaseHref}
              aria-label={`Ver ${showcase.brandName} ${showcase.name}`}
              className="group relative block w-full"
            >
              <motion.div
                animate={
                  reduceMotion
                    ? undefined
                    : { y: [0, -14, 0], rotate: [0, 1.5, 0] }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                }
                className="relative aspect-square w-full"
              >
                <Image
                  src={showcaseImageUrl}
                  alt={`${showcase.brandName} ${showcase.name}`}
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  priority
                  className="object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </motion.div>

              {/* Floating price card */}
              <div className="border-border/60 bg-background/95 absolute -bottom-2 right-2 z-10 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm md:bottom-4 md:right-0">
                <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.18em]">
                  Destacado
                </p>
                <p className="text-foreground mt-0.5 font-serif text-base font-medium">
                  {showcase.brandName}{' '}
                  <span className="italic font-normal">{showcase.name}</span>
                </p>
                <p className="text-brand mt-1 inline-flex items-baseline gap-1.5 text-sm font-semibold">
                  desde {formatPriceCents(showcase.minPriceCents)}
                  <ArrowRight className="size-3.5 translate-y-px transition-transform duration-300 group-hover:translate-x-0.5" />
                </p>
              </div>
            </Link>
          </motion.div>
        ) : (
          // Fallback si no hay showcase: hero text-only centrado
          <div className="hidden md:block" />
        )}
      </div>
    </section>
  );
}
