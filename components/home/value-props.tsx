import { GraduationCap, MessageCircle, Truck, Award } from 'lucide-react';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { getBusinessInfo } from '@/lib/site/business';

type Prop = {
  icon: typeof GraduationCap;
  title: string;
  body: string;
};

/**
 * Trust signals editoriales post-hero. 4 cards en layout grid con
 * tipografía display + íconos sutiles. Fondo light para contrastar con el
 * hero dark (alternancia visual de la home).
 *
 * Estética alineada con HomeHero: serif heading + uppercase eyebrow + body
 * balanced + reveal-on-scroll stagger.
 */
export function ValueProps() {
  const business = getBusinessInfo();

  const props: Prop[] = [
    {
      icon: GraduationCap,
      title: 'Atención personalizada',
      body: 'Asesoramiento real en cada compra, con experiencia en óptica.',
    },
    {
      icon: Award,
      title: '30+ años en Argentina',
      body: 'Óptica familiar con tres décadas atendiendo la región del NEA.',
    },
    {
      icon: Truck,
      title: 'Envíos a todo el país',
      body: 'Envíos con Correo Argentino a todo el país. Retiro gratis en local de Virasoro.',
    },
    {
      icon: MessageCircle,
      title: business.whatsappLink ? 'Asesoramiento por WhatsApp' : 'Atención personalizada',
      body: business.whatsappLink
        ? 'Resolvemos dudas antes y después de comprar. Respuesta real, no bot.'
        : 'Te ayudamos a elegir el modelo correcto para tu uso.',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-zinc-50 py-20 md:py-28">
      {/* Gradient sutil para no sentirse plano. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-zinc-50 via-white to-zinc-50"
      />

      <div className="container relative">
        <RevealOnScroll>
          <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
            <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
            Por qué Óptica Carballo
          </p>
          <h2 className="mt-6 max-w-2xl text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
            Una óptica familiar{' '}
            <span className="font-normal italic text-foreground/70">
              con asesoramiento real.
            </span>
          </h2>
        </RevealOnScroll>

        <ul className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 md:mt-20 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          {props.map((p, idx) => {
            const Icon = p.icon;
            return (
              <RevealOnScroll
                as="li"
                key={p.title}
                delay={120 * idx}
                className="border-foreground/10 group relative flex flex-col gap-4 border-t pt-6 transition-colors duration-300 hover:border-foreground/30"
              >
                <Icon
                  className="text-foreground/80 size-7 transition-transform duration-500 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
                <p className="text-foreground font-serif text-xl font-medium leading-tight tracking-[-0.015em] md:text-2xl">
                  {p.title}
                </p>
                <p className="text-foreground/65 text-sm leading-relaxed md:text-base">
                  {p.body}
                </p>
              </RevealOnScroll>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
