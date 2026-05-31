import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';

type Step = {
  number: string;
  title: string;
  body: string;
};

/**
 * Sección "Cómo trabajamos" — 4 pasos del flow de compra. Estética
 * editorial dark, contrastando con ValueProps (light arriba) y
 * CategoriesSection (light abajo). Aporta ritmo visual + educa al cliente
 * sobre qué esperar al comprar.
 */
const STEPS: Step[] = [
  {
    number: '01',
    title: 'Elegí tu modelo',
    body: 'Navegá el catálogo con stock real verificado. Comparador, recomendador IA y galería para decidir tranquilo.',
  },
  {
    number: '02',
    title: 'Te asesoramos',
    body: 'Si tenés dudas técnicas, te contestamos por WhatsApp o teléfono. Atención por técnico óptico matriculado, no bot.',
  },
  {
    number: '03',
    title: 'Armamos tu anteojo',
    body: 'La regente matriculada controla cada pedido antes de armar. Receta validada, lentes específicos para tu uso.',
  },
  {
    number: '04',
    title: 'Te llega',
    body: 'Envío Andreani a todo el país con seguimiento. Garantía completa y devolución por arrepentimiento.',
  },
];

export function HowWeWork() {
  return (
    <section className="relative isolate overflow-hidden bg-zinc-950 py-20 text-white md:py-28">
      {/* Mesh glow sutil — consistente con HomeHero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-zinc-950 via-black to-zinc-900"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="animate-mesh-a absolute -top-32 left-[12%] size-[480px] rounded-full bg-white/[0.025] blur-3xl" />
        <div className="animate-mesh-c absolute -bottom-32 right-[10%] size-[520px] rounded-full bg-white/[0.03] blur-3xl" />
      </div>

      <div className="container relative">
        <RevealOnScroll>
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-white/60">
            <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
            Cómo trabajamos
          </p>
          <h2 className="mt-6 max-w-2xl text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
            De tu pantalla{' '}
            <span className="font-normal italic text-white/70">a tu cara</span>
            , en 4 pasos.
          </h2>
          <p className="mt-6 max-w-xl text-balance text-base text-white/65 md:text-lg">
            Comprar anteojos online no es complicado cuando hay un profesional
            real del otro lado revisando cada pedido.
          </p>
        </RevealOnScroll>

        <ol className="mt-14 grid grid-cols-1 gap-8 md:mt-20 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {STEPS.map((step, idx) => (
            <RevealOnScroll
              as="li"
              key={step.number}
              delay={120 * idx}
              className="group relative flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-brand font-serif text-3xl font-medium tracking-tight md:text-4xl">
                  {step.number}
                </span>
                <span
                  aria-hidden="true"
                  className="bg-white/15 h-px flex-1 transition-colors duration-500 group-hover:bg-white/40"
                />
              </div>
              <p className="font-serif text-xl font-medium leading-tight tracking-[-0.015em] md:text-2xl">
                {step.title}
              </p>
              <p className="text-sm leading-relaxed text-white/65 md:text-base">
                {step.body}
              </p>
            </RevealOnScroll>
          ))}
        </ol>

        <RevealOnScroll delay={500} className="mt-14 flex justify-start md:mt-20">
          <Link
            href="/preguntas-frecuentes"
            className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-white/80 transition-colors hover:text-white"
          >
            <span className="border-white/30 group-hover:border-white border-b pb-1 transition-colors">
              Más preguntas frecuentes
            </span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
