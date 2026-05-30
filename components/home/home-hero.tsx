'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LetterReveal } from '@/components/ui/letter-reveal';
import { MagneticButton } from '@/components/ui/magnetic-button';

type Props = {
  siteName: string;
  whatsappLink: string | null;
};

/** Path canónico de la foto editorial del hero en bucket `brands-shared`.
 * Founder sube acá (mismo bucket que kit Vulk + category-sol). Cambiar
 * si founder usa otro nombre o querés rotarla por temporada. */
const HERO_EDITORIAL_PATH = 'hero-editorial.jpg';
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321';
const HERO_EDITORIAL_URL = `${SUPABASE_URL}/storage/v1/object/public/brands-shared/${HERO_EDITORIAL_PATH}`;

/**
 * Hero Concepto 2 (decisión founder 2026-05-30): tipográfico minimal dark.
 *
 * - Fondo full-bleed negro con gradient sutil para profundidad.
 * - Tipografía display dominante (h1 6xl→9xl). Copy = anclor visual del hero.
 * - Watermark gigante "ÓC" decorativo (opacity muy baja) que pulsa con scroll.
 * - Sin imagen central de producto (decisión founder: las fotos del catálogo
 *   con fondo blanco no funcionan sobre fondo dark + estética editorial).
 * - Cuando founder consiga fotos editoriales (Vulk Ember/DANV style), upgrade
 *   a Concepto 1 (foto editorial al lado del texto).
 */
export function HomeHero({ siteName, whatsappLink }: Props) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : -20]);
  const watermarkY = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : 60]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-zinc-950 text-white"
    >
      {/* Gradient base sutil — diagonal para dar profundidad sin distraer. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-zinc-950 via-black to-zinc-900"
      />

      {/* Mesh glow sutil — mismas formas que el hero claro previo pero con
          opacity muy baja sobre el dark. Da textura ambiente sin distraer. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="animate-mesh-a absolute -top-24 left-[18%] size-[520px] rounded-full bg-white/[0.03] blur-3xl" />
        <div className="animate-mesh-b absolute top-1/2 right-[12%] size-[620px] rounded-full bg-white/[0.04] blur-3xl" />
        <div className="animate-mesh-c absolute -bottom-32 left-1/2 size-[480px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-3xl" />
      </div>

      {/* Watermark "ÓC" gigante decorativo. Opacity baja, posición esquina
          inferior derecha, oculto en mobile (text demasiado grande chocaría
          con la tipografía principal). Parallax sutil con scroll. */}
      <motion.div
        aria-hidden="true"
        style={{ y: watermarkY }}
        className="pointer-events-none absolute -bottom-20 -right-12 -z-0 hidden select-none font-serif text-[28rem] font-medium leading-none text-white/[0.035] md:block lg:text-[40rem]"
      >
        ÓC
      </motion.div>

      <div className="container relative grid grid-cols-1 items-center gap-12 py-20 md:grid-cols-[1.1fr_1fr] md:gap-10 md:py-28 lg:gap-16 lg:py-36">
        {/* Columna izquierda: texto editorial */}
        <motion.div style={{ y: textY }} className="relative order-2 md:order-1">
          <p className="hero-reveal hero-reveal-1 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-white/70">
            <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
            <span>{siteName}</span>
          </p>

          <h1 className="mt-8 text-balance font-serif text-5xl font-medium leading-[0.95] tracking-[-0.025em] md:text-6xl lg:text-7xl">
            <LetterReveal text="Anteojos originales " delay={0.2} />
            <LetterReveal
              text="con asesoramiento óptico real."
              italic
              delay={0.8}
              className="font-normal text-white/80"
            />
          </h1>

          <p className="hero-reveal hero-reveal-3 mt-8 max-w-xl text-balance text-base text-white/70 md:text-lg">
            Atención personalizada por técnico óptico matriculado.
            30+ años en Argentina. Envíos a todo el país y cuotas sin interés.
          </p>

          <div className="hero-reveal hero-reveal-4 mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <MagneticButton className="w-full sm:w-auto">
              <Button
                asChild
                size="lg"
                className="shine-on-hover group w-full bg-white text-black hover:bg-white/90 sm:w-auto"
              >
                <Link href="/anteojos-de-sol">
                  Ver anteojos de sol
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </MagneticButton>
            <MagneticButton className="w-full sm:w-auto">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"
              >
                <Link href="/anteojos-de-receta">Ver anteojos de receta</Link>
              </Button>
            </MagneticButton>
            {whatsappLink && (
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="w-full text-white/80 hover:bg-white/10 hover:text-white sm:w-auto"
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4" />
                  WhatsApp
                </a>
              </Button>
            )}
          </div>
        </motion.div>

        {/* Columna derecha: foto editorial. Si la foto no existe en el bucket
            (404), Next.js Image va a mostrar un placeholder oscuro — el
            layout no se rompe. */}
        <motion.div
          style={{ y: textY }}
          className="relative order-1 mx-auto w-full max-w-md md:order-2 md:max-w-none"
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.6)] md:aspect-[4/5]">
            <Image
              src={HERO_EDITORIAL_URL}
              alt="Editorial Óptica Carballo"
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              priority
              className="object-cover"
            />
            {/* Gradient overlay sutil: oscurece levemente el borde inferior
                para que se funda con el resto del hero dark sin recortes
                bruscos. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
