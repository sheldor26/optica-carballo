import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Award,
  CalendarDays,
  Heart,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { OrganizationJsonLd } from '@/components/seo/organization-jsonld';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';
import { getBusinessInfo } from '@/lib/site/business';

const SLUG = 'sobre-nosotros';
const TITLE = 'Sobre nosotros';
const DESCRIPTION =
  'Óptica Carballo: óptica familiar con +30 años de experiencia, regente óptica matriculada y atención profesional. Envíos a todo Argentina.';

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return buildInfoPageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    slug: SLUG,
  });
}

export default function Page() {
  const business = getBusinessInfo();
  const location = [business.locality, business.region]
    .filter((v): v is string => Boolean(v))
    .join(', ');

  return (
    <>
      <OrganizationJsonLd />
      <main>
        <Hero />
        <StatsStrip />
        <StorySection location={location} />
        <TeamSection
          regenteName={business.regenteName}
          regenteMatricula={business.regenteMatricula}
          tecnicoName={business.tecnicoName}
        />
        <HowWeWorkSection />
        <BrandsSection />
        <ContactCta whatsappLink={business.whatsappLink} />
      </main>
    </>
  );
}

function Hero() {
  return (
    <section className="container py-16 md:py-24">
      <RevealOnScroll className="mx-auto max-w-3xl text-center">
        <p className="text-brand text-xs font-medium uppercase tracking-[0.2em]">
          Sobre nosotros
        </p>
        <h1 className="text-foreground mt-4 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-6xl">
          Una óptica <span className="italic font-normal">familiar</span> con
          treinta años cuidando la vista
        </h1>
        <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-balance text-base md:text-lg">
          Empezamos en 1994. Tres generaciones de la familia Carballo en el
          mismo lugar, atendiendo gente real, con stock real, y la regencia
          de una óptica matriculada.
        </p>
      </RevealOnScroll>
    </section>
  );
}

const STATS = [
  { icon: CalendarDays, label: '+30 años', sub: 'En el rubro desde 1994' },
  { icon: Award, label: 'Óptica matriculada', sub: 'Regencia profesional' },
  { icon: Truck, label: 'Todo el país', sub: 'Envíos con Andreani' },
  { icon: Heart, label: 'Familiar', sub: 'Atención cercana, no call center' },
];

function StatsStrip() {
  return (
    <section className="border-border/60 bg-muted/30 border-y">
      <div className="container py-10">
        <RevealOnScroll>
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <li key={stat.label} className="flex flex-col items-start gap-2">
                  <span
                    aria-hidden="true"
                    className="border-border/60 bg-background flex size-10 items-center justify-center rounded-full border"
                  >
                    <Icon
                      className="text-foreground/80 size-5"
                      strokeWidth={1.75}
                    />
                  </span>
                  <div>
                    <p className="text-foreground text-sm font-semibold sm:text-base">
                      {stat.label}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs leading-snug sm:text-sm">
                      {stat.sub}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </RevealOnScroll>
      </div>
    </section>
  );
}

function StorySection({ location }: { location: string }) {
  return (
    <section className="container py-16 md:py-24">
      <RevealOnScroll className="mx-auto max-w-3xl">
        <p className="text-brand text-xs font-medium uppercase tracking-[0.2em]">
          Nuestra historia
        </p>
        <h2 className="text-foreground mt-3 text-balance font-serif text-3xl font-medium leading-tight tracking-[-0.015em] md:text-4xl">
          Una historia de <span className="italic font-normal">tres generaciones</span>
        </h2>
        <div className="text-muted-foreground mt-8 space-y-5 text-base leading-relaxed md:text-lg">
          <p>
            Óptica Carballo abrió sus puertas en 1994
            {location ? ` en ${location}` : ''}, como un emprendimiento familiar
            dedicado a algo que para nosotros tiene peso real: cuidar la vista
            de la gente del barrio.
          </p>
          <p>
            Pasaron más de treinta años. Lo que arrancó como una óptica
            tradicional hoy es una óptica con presencia digital, pero el ADN no
            cambió: atención personalizada, productos que están físicamente en
            nuestro local, y la responsabilidad profesional de tener una óptica
            matriculada como regente.
          </p>
          <p>
            Esa combinación —oficio óptico tradicional + presencia online
            seria— es lo que queremos transmitir en cada compra. No vendemos lo
            que no tenemos. No prometemos lo que no podemos cumplir. No
            inventamos reseñas ni urgencias artificiales. Es así de simple.
          </p>
        </div>
      </RevealOnScroll>
    </section>
  );
}

function TeamSection({
  regenteName,
  regenteMatricula,
  tecnicoName,
}: {
  regenteName: string | null;
  regenteMatricula: string | null;
  tecnicoName: string | null;
}) {
  return (
    <section className="bg-muted/30 border-border/60 border-y">
      <div className="container py-16 md:py-20">
        <RevealOnScroll className="mx-auto max-w-3xl">
          <p className="text-brand text-xs font-medium uppercase tracking-[0.2em]">
            Quiénes somos
          </p>
          <h2 className="text-foreground mt-3 text-balance font-serif text-3xl font-medium leading-tight tracking-[-0.015em] md:text-4xl">
            El equipo detrás de la óptica
          </h2>
        </RevealOnScroll>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:mt-14 md:grid-cols-2 md:gap-8">
          <RevealOnScroll>
            <article className="border-border/60 bg-background rounded-2xl border p-6 md:p-8">
              <div className="border-border/60 bg-muted/40 flex size-12 items-center justify-center rounded-full border">
                <ShieldCheck
                  className="text-foreground/80 size-6"
                  strokeWidth={1.75}
                />
              </div>
              <p className="text-muted-foreground mt-5 text-xs font-medium uppercase tracking-wider">
                Regente matriculada
              </p>
              <p className="text-foreground mt-1 font-serif text-2xl font-medium tracking-tight md:text-3xl">
                {regenteName ?? 'Óptica matriculada (a confirmar)'}
              </p>
              {regenteMatricula && (
                <p className="text-muted-foreground mt-1 text-sm">
                  Matrícula {regenteMatricula}
                </p>
              )}
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed md:text-base">
                Toda venta de anteojos de receta en Argentina requiere
                supervisión profesional matriculada. Acá lo respetamos: las
                recetas se revisan, los cristales se gradúan según prescripción
                real, y el armado final lo hace personal capacitado.
              </p>
            </article>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <article className="border-border/60 bg-background rounded-2xl border p-6 md:p-8">
              <div className="border-border/60 bg-muted/40 flex size-12 items-center justify-center rounded-full border">
                <Sparkles
                  className="text-foreground/80 size-6"
                  strokeWidth={1.75}
                />
              </div>
              <p className="text-muted-foreground mt-5 text-xs font-medium uppercase tracking-wider">
                Dirección digital
              </p>
              <p className="text-foreground mt-1 font-serif text-2xl font-medium tracking-tight md:text-3xl">
                {tecnicoName ?? 'Equipo técnico'}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Técnico Superior en Óptica y Contactología
              </p>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed md:text-base">
                La parte digital del proyecto la lleva la segunda generación,
                con formación técnica actualizada y entendiendo cómo funciona
                la web hoy. Esa combinación —óptica tradicional + tecnología
                actualizada— es lo que diferencia esta óptica.
              </p>
            </article>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

const HOW_WE_WORK = [
  {
    icon: ShieldCheck,
    title: 'Stock real, siempre',
    description:
      'Cada producto publicado existe físicamente en nuestro local. Si no lo tenemos, no aparece. Cero "consultar disponibilidad".',
  },
  {
    icon: Heart,
    title: 'Asesoramiento profesional',
    description:
      'Si tenés dudas sobre qué modelo te queda mejor o sobre tu receta, escribinos por WhatsApp y te ayudamos sin compromiso.',
  },
  {
    icon: Truck,
    title: 'Envíos a todo el país',
    description:
      'Trabajamos con Andreani como principal y Correo Argentino como respaldo. Retiro gratis en nuestro local si vivís cerca.',
  },
  {
    icon: Award,
    title: 'Cumplimiento legal completo',
    description:
      'Facturación electrónica AFIP, botón de arrepentimiento, política de devolución clara. Defensa del Consumidor + más.',
  },
];

function HowWeWorkSection() {
  return (
    <section className="container py-16 md:py-24">
      <RevealOnScroll className="mx-auto max-w-3xl text-center">
        <p className="text-brand text-xs font-medium uppercase tracking-[0.2em]">
          Cómo trabajamos
        </p>
        <h2 className="text-foreground mt-3 text-balance font-serif text-3xl font-medium leading-tight tracking-[-0.015em] md:text-4xl">
          Reglas <span className="italic font-normal">duras</span> que no negociamos
        </h2>
      </RevealOnScroll>

      <ul className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 md:mt-14 md:gap-8">
        {HOW_WE_WORK.map((item, idx) => {
          const Icon = item.icon;
          return (
            <RevealOnScroll key={item.title} delay={60 * idx}>
              <li className="border-border/60 bg-muted/20 flex gap-4 rounded-xl border p-5 md:p-6">
                <span
                  aria-hidden="true"
                  className="border-border/60 bg-background flex size-10 shrink-0 items-center justify-center rounded-full border"
                >
                  <Icon
                    className="text-foreground/80 size-5"
                    strokeWidth={1.75}
                  />
                </span>
                <div>
                  <p className="text-foreground text-base font-semibold sm:text-lg">
                    {item.title}
                  </p>
                  <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </li>
            </RevealOnScroll>
          );
        })}
      </ul>
    </section>
  );
}

function BrandsSection() {
  return (
    <section className="container pb-16 md:pb-24">
      <RevealOnScroll className="mx-auto max-w-3xl text-center">
        <p className="text-brand text-xs font-medium uppercase tracking-[0.2em]">
          Marcas con stock real
        </p>
        <h2 className="text-foreground mt-3 text-balance font-serif text-3xl font-medium leading-tight tracking-[-0.015em] md:text-4xl">
          Las que sí tenemos
        </h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-balance text-sm md:text-base">
          Hoy trabajamos físicamente con cinco marcas, en sus líneas de sol y
          receta. Si te interesa otra, consultanos antes por WhatsApp.
        </p>
      </RevealOnScroll>

      <RevealOnScroll className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-3">
        {['Rusty', 'Vulk', 'Reef', 'Mormaii', "Paula Cahen D'Anvers"].map((b) => (
          <span
            key={b}
            className="border-border/60 bg-background text-foreground rounded-full border px-4 py-2 text-sm font-medium"
          >
            {b}
          </span>
        ))}
      </RevealOnScroll>
    </section>
  );
}

function ContactCta({ whatsappLink }: { whatsappLink: string | null }) {
  return (
    <section className="border-border/60 bg-foreground text-background border-y">
      <div className="container py-16 md:py-20">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <MapPin className="mx-auto size-8 opacity-80" strokeWidth={1.5} />
          <h2 className="mt-5 text-balance font-serif text-3xl font-medium leading-tight tracking-tight md:text-4xl">
            Cualquier duda — <span className="italic font-normal">escribinos</span>
          </h2>
          <p className="mt-4 text-balance text-sm opacity-80 md:text-base">
            Respondemos en horario comercial. Sin formulario raro, sin chatbot.
            Hablás con nosotros.
          </p>

          {whatsappLink ? (
            <Button
              asChild
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 mt-7"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 size-5" strokeWidth={2} />
                Escribinos por WhatsApp
              </a>
            </Button>
          ) : (
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 mt-7">
              <Link href="/preguntas-frecuentes">Ver preguntas frecuentes</Link>
            </Button>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}
