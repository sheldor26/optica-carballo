import { GraduationCap, MessageCircle, Truck, Award } from 'lucide-react';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { getBusinessInfo } from '@/lib/site/business';

type Prop = {
  icon: typeof GraduationCap;
  title: string;
  body: string;
};

export function ValueProps() {
  const business = getBusinessInfo();

  const props: Prop[] = [
    {
      icon: GraduationCap,
      title: business.regenteMatricula
        ? 'Regente óptica matriculada'
        : 'Atención profesional',
      body: business.regenteName
        ? `Asesoramiento personal de ${business.regenteName}.`
        : 'Asesoramiento de técnico óptico matriculado en cada compra.',
    },
    {
      icon: Award,
      title: '30+ años de experiencia',
      body: 'Óptica familiar con tres décadas atendiendo en la región.',
    },
    {
      icon: Truck,
      title: 'Envíos a todo el país',
      body: 'Andreani como operador principal, retiro gratis en local.',
    },
    {
      icon: MessageCircle,
      title: business.whatsappLink ? 'Consulta por WhatsApp' : 'Atención personalizada',
      body: business.whatsappLink
        ? 'Resolvemos dudas antes y después de la compra.'
        : 'Te ayudamos a elegir el modelo correcto para tu uso.',
    },
  ];

  return (
    <section className="container py-12 md:py-16">
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {props.map((p, idx) => {
          const Icon = p.icon;
          return (
            <RevealOnScroll
              as="li"
              key={p.title}
              delay={100 * idx}
              className="flex flex-col gap-2"
            >
              <Icon className="text-foreground size-6" aria-hidden="true" />
              <p className="text-foreground text-base font-semibold">{p.title}</p>
              <p className="text-muted-foreground text-sm">{p.body}</p>
            </RevealOnScroll>
          );
        })}
      </ul>
    </section>
  );
}
