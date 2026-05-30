'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LetterReveal } from '@/components/ui/letter-reveal';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { formatPriceCents } from '@/lib/format/currency';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import { getImageScale } from '@/lib/catalog/image-scale-overrides';
import type { HomeShowcaseProduct } from '@/lib/catalog/queries';

type Props = {
  showcases: HomeShowcaseProduct[];
  siteName: string;
  whatsappLink: string | null;
};

const AUTO_PLAY_MS = 4500;

export function HomeHero({ showcases, siteName, whatsappLink }: Props) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const photoY = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : 60]);
  const textY = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : -20]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play: avanza cada AUTO_PLAY_MS. Pausa on hover/focus para no
  // interrumpir al usuario que está mirando un producto. Respeta
  // prefers-reduced-motion (no auto-play si user lo prefiere).
  useEffect(() => {
    if (reduceMotion || isPaused || showcases.length <= 1) return;
    const interval = window.setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % showcases.length);
    }, AUTO_PLAY_MS);
    return () => window.clearInterval(interval);
  }, [reduceMotion, isPaused, showcases.length]);

  const active = showcases[activeIdx];

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
          <h1 className="mt-5 text-balance font-serif text-5xl font-medium leading-[1.1] tracking-[-0.02em] md:text-6xl lg:text-7xl">
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

        {showcases.length > 0 && active ? (
          <motion.div
            style={{ y: photoY }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            className="relative order-1 mx-auto flex w-full max-w-md flex-col items-center justify-center md:order-2 md:max-w-none"
            role="region"
            aria-label="Productos destacados"
            aria-roledescription="carrusel"
          >
            {/* Glow background detrás del producto */}
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
              className="bg-brand/15 absolute inset-x-8 top-[35%] -z-10 h-[60%] -translate-y-1/2 rounded-full blur-3xl"
            />

            {/* Slide activo del carrusel */}
            <div
              className="relative aspect-square w-full"
              aria-live={reduceMotion ? 'off' : 'polite'}
              aria-atomic="true"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.slug}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <Link
                    href={`/${active.categorySlug}/${active.brandSlug}/${active.slug}`}
                    aria-label={`Ver ${active.brandName} ${active.name}`}
                    className="group relative block size-full"
                  >
                    <Image
                      src={getProductImageUrl(active.primaryImagePath)}
                      alt={`${active.brandName} ${active.name}`}
                      fill
                      sizes="(max-width: 768px) 90vw, 45vw"
                      priority
                      style={{
                        transform: `scale(${getImageScale(active.primaryImagePath)})`,
                      }}
                      className="object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Info producto activo: título + precio centrados (sin floating card) */}
            <div className="mt-4 flex flex-col items-center text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.slug}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.18em]">
                    {active.brandName}
                  </p>
                  <Link
                    href={`/${active.categorySlug}/${active.brandSlug}/${active.slug}`}
                    className="hover:text-brand text-foreground mt-1 inline-flex items-baseline gap-2 font-serif text-lg font-medium transition-colors md:text-xl"
                  >
                    <span className="italic font-normal">{active.name}</span>
                  </Link>
                  <p className="text-brand mt-1 inline-flex items-baseline gap-1.5 text-sm font-semibold">
                    desde {formatPriceCents(active.minPriceCents)}
                    <ArrowRight className="size-3.5 translate-y-px" />
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Indicadores dots (1 por producto). Click cambia slide.
                Aria-current marca el activo. Solo render si >1 producto. */}
            {showcases.length > 1 && (
              <div
                className="mt-4 flex items-center justify-center gap-2"
                role="tablist"
                aria-label="Seleccionar producto destacado"
              >
                {showcases.map((p, idx) => {
                  const isActive = idx === activeIdx;
                  return (
                    <button
                      key={p.slug}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Ver ${p.brandName} ${p.name} (${idx + 1} de ${showcases.length})`}
                      aria-current={isActive ? 'true' : undefined}
                      className={
                        isActive
                          ? 'bg-foreground h-1.5 w-6 rounded-full transition-all'
                          : 'bg-foreground/30 hover:bg-foreground/60 h-1.5 w-1.5 rounded-full transition-all'
                      }
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          // Fallback si no hay productos showcase: hero text-only
          <div className="hidden md:block" />
        )}
      </div>
    </section>
  );
}
