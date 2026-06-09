import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
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
import { getAuthor } from '@/lib/content/article-authors';
import { fetchAllActiveBrands } from '@/lib/catalog/queries';
import {
  getBrandAssetUrl,
  shouldInvertLogo,
} from '@/lib/storage/brand-asset-url';
import { listArticles } from '@/lib/content/articles';
import { cn } from '@/lib/utils';

const SLUG = 'sobre-nosotros';
const TITLE = 'Sobre nosotros';
const DESCRIPTION =
  'Óptica Carballo: óptica familiar con +30 años de experiencia y atención personalizada. Envíos a todo Argentina.';

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return buildInfoPageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    slug: SLUG,
  });
}

export default async function Page() {
  const business = getBusinessInfo();
  const location = [business.locality, business.region]
    .filter((v): v is string => Boolean(v))
    .join(', ');

  const [brands, articles] = await Promise.all([
    fetchAllActiveBrands(),
    Promise.resolve(listArticles()),
  ]);

  return (
    <>
      <OrganizationJsonLd />
      <main>
        <Hero />
        <StatsStrip />
        <StorySection location={location} />
        <TimelineSection />
        <TeamSection />
        <HowWeWorkSection />
        <BrandsSection brands={brands} />
        {articles.length > 0 && <EditorialSection articleCount={articles.length} />}
        <ContactCta whatsappLink={business.whatsappLink} location={location} />
      </main>
    </>
  );
}

function Hero() {
  return (
    <section className="container py-16 md:py-24">
      <RevealOnScroll className="mx-auto max-w-3xl text-center">
        <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
          <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
          Sobre nosotros
        </p>
        <h1 className="text-foreground mt-6 text-balance font-serif text-5xl font-medium leading-[1.0] tracking-[-0.025em] md:text-6xl lg:text-7xl">
          Una óptica <span className="font-normal italic text-foreground/70">familiar</span>{' '}
          con treinta años cuidando la vista.
        </h1>
        <p className="text-muted-foreground mx-auto mt-7 max-w-xl text-balance text-base md:text-lg">
          Empezamos en 1994. Tres generaciones de la familia Carballo en el
          mismo lugar, atendiendo gente real, con stock real y atención
          personalizada.
        </p>
      </RevealOnScroll>
    </section>
  );
}

const STATS = [
  { icon: CalendarDays, label: '+30 años', sub: 'En el rubro desde 1994' },
  { icon: Award, label: 'Atención personal', sub: 'Asesoramiento real' },
  { icon: Truck, label: 'Todo el país', sub: 'Envíos con Correo Argentino' },
  { icon: Heart, label: 'Familiar', sub: 'Atención cercana, no call center' },
];

function StatsStrip() {
  return (
    <section className="border-foreground/10 bg-zinc-50 border-y">
      <div className="container py-10 md:py-12">
        <RevealOnScroll>
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <li key={stat.label} className="flex flex-col items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="border-foreground/15 bg-background flex size-11 items-center justify-center rounded-full border"
                  >
                    <Icon
                      className="text-foreground/80 size-5"
                      strokeWidth={1.5}
                    />
                  </span>
                  <div>
                    <p className="text-foreground font-serif text-lg font-medium tracking-tight sm:text-xl">
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
    <section className="container py-20 md:py-28">
      <RevealOnScroll className="mx-auto max-w-3xl">
        <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
          <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
          Nuestra historia
        </p>
        <h2 className="text-foreground mt-6 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
          Una historia de{' '}
          <span className="font-normal italic text-foreground/70">tres generaciones</span>
        </h2>
        <div className="text-muted-foreground mt-10 space-y-6 text-base leading-relaxed md:text-lg">
          <p>
            Óptica Carballo abrió sus puertas en 1994
            {location ? ` en ${location}` : ''}, como un emprendimiento familiar
            dedicado a algo que para nosotros tiene peso real: cuidar la vista
            de la gente del barrio.
          </p>
          <p>
            Pasaron más de treinta años. Lo que arrancó como una óptica
            tradicional hoy es una óptica con presencia digital, pero el ADN no
            cambió: atención personalizada y productos que están físicamente en
            nuestro local.
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

/** Timeline visual con hitos del recorrido. Estética editorial dark consistente
 * con el resto del site — contraste con StorySection light arriba. */
const TIMELINE_ITEMS = [
  {
    year: '1994',
    title: 'Fundación',
    body: 'Abre Óptica Carballo en el NEA argentino como emprendimiento familiar. Primera generación.',
  },
  {
    year: '2000s',
    title: 'Consolidación local',
    body: 'La óptica se vuelve referente de la región. Atención personalizada y stock real desde el día uno.',
  },
  {
    year: '2010s',
    title: 'Segunda generación',
    body: 'La familia consolida el oficio óptico y suma experiencia en armado de recetados y atención al cliente.',
  },
  {
    year: '2025',
    title: 'Paso digital',
    body: 'Empezamos a construir presencia online seria: catálogo con stock real, asesoramiento por WhatsApp.',
  },
  {
    year: '2026',
    title: 'E-commerce + IA',
    body: 'Lanzamos la tienda online completa con herramientas de IA: lector de receta, medidor de DNP, recomendador.',
  },
];

function TimelineSection() {
  return (
    <section className="relative isolate overflow-hidden bg-zinc-950 py-20 text-white md:py-28">
      {/* Mesh glow sutil, consistente con HomeHero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-zinc-950 via-black to-zinc-900"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="animate-mesh-b absolute -top-32 right-[15%] size-[480px] rounded-full bg-white/[0.025] blur-3xl" />
        <div className="animate-mesh-c absolute -bottom-32 left-[15%] size-[520px] rounded-full bg-white/[0.03] blur-3xl" />
      </div>

      <div className="container relative">
        <RevealOnScroll className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-white/60">
            <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
            Timeline
          </p>
          <h2 className="mt-6 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
            Treinta años,{' '}
            <span className="font-normal italic text-white/70">cinco hitos</span>.
          </h2>
        </RevealOnScroll>

        <ol className="mt-14 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-5 md:gap-6">
          {TIMELINE_ITEMS.map((item, idx) => (
            <RevealOnScroll
              as="li"
              key={item.year}
              delay={100 * idx}
              className="group relative flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-brand font-serif text-3xl font-medium tracking-tight md:text-4xl">
                  {item.year}
                </span>
                <span
                  aria-hidden="true"
                  className="bg-white/15 h-px flex-1 transition-colors duration-500 group-hover:bg-white/40"
                />
              </div>
              <p className="font-serif text-lg font-medium leading-tight tracking-[-0.01em] md:text-xl">
                {item.title}
              </p>
              <p className="text-sm leading-relaxed text-white/65">
                {item.body}
              </p>
            </RevealOnScroll>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Sección Equipo con bios completas. Usa `lib/content/article-authors` como
 * single source of truth (mismas bios que firman los artículos). E-E-A-T:
 * Google ve coherencia entre autor del artículo + bio en sobre-nosotros. */
function TeamSection() {
  const juan = getAuthor('juan');

  return (
    <section className="container py-20 md:py-28">
      <RevealOnScroll className="max-w-3xl">
        <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
          <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
          El equipo
        </p>
        <h2 className="text-foreground mt-6 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
          La gente{' '}
          <span className="font-normal italic text-foreground/70">detrás</span>{' '}
          de la óptica.
        </h2>
      </RevealOnScroll>

      <div className="mt-14 grid gap-10 md:mt-20 md:gap-12 lg:gap-16">
        <RevealOnScroll delay={120}>
          <article className="border-foreground/10 group flex flex-col gap-5 border-t pt-6">
            <Sparkles
              className="text-foreground/80 size-7"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <p className="text-foreground/60 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em]">
              <span className="bg-brand size-1 rounded-full" aria-hidden="true" />
              Dirección digital
            </p>
            <h3 className="text-foreground font-serif text-3xl font-medium leading-tight tracking-[-0.015em] md:text-4xl">
              {juan.displayName}
            </h3>
            <p className="text-foreground/70 text-sm font-medium">
              {juan.role}
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              {juan.bio}
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              La parte digital del proyecto la lleva la segunda generación,
              con formación técnica actualizada. Esa combinación —óptica
              tradicional + tecnología actualizada— es lo que diferencia esta
              óptica de la competencia online.
            </p>
          </article>
        </RevealOnScroll>
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
      'Enviamos con Correo Argentino a todo el país, a domicilio o a sucursal. Retiro gratis en nuestro local si vivís cerca.',
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
    <section className="border-foreground/10 bg-zinc-50 border-y">
      <div className="container py-20 md:py-28">
        <RevealOnScroll className="max-w-3xl">
          <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
            <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
            Cómo trabajamos
          </p>
          <h2 className="text-foreground mt-6 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
            Reglas <span className="font-normal italic text-foreground/70">duras</span>{' '}
            que no negociamos.
          </h2>
        </RevealOnScroll>

        <ul className="mt-14 grid gap-x-8 gap-y-10 md:mt-20 md:grid-cols-2 lg:gap-x-12">
          {HOW_WE_WORK.map((item, idx) => {
            const Icon = item.icon;
            return (
              <RevealOnScroll
                as="li"
                key={item.title}
                delay={80 * idx}
                className="border-foreground/10 group flex flex-col gap-4 border-t pt-6"
              >
                <Icon
                  className="text-foreground/80 size-7"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="text-foreground font-serif text-xl font-medium leading-tight tracking-[-0.01em] md:text-2xl">
                  {item.title}
                </p>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {item.description}
                </p>
              </RevealOnScroll>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Grid de logos reales de marcas con stock. Reusa convención dark del bucket
 * (mismo approach que `components/home/brands-section.tsx`). */
function BrandsSection({
  brands,
}: {
  brands: Array<{ slug: string; name: string; logo_url?: string | null }>;
}) {
  if (brands.length === 0) return null;

  return (
    <section className="relative isolate overflow-hidden bg-zinc-950 py-20 text-white md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-zinc-950 via-black to-zinc-900"
      />

      <div className="container">
        <RevealOnScroll className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-white/60">
            <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
            Marcas con stock real
          </p>
          <h2 className="mt-6 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
            Las que{' '}
            <span className="font-normal italic text-white/70">sí tenemos</span>.
          </h2>
          <p className="text-white/65 mt-6 max-w-xl text-balance text-base md:text-lg">
            Trabajamos físicamente con estas marcas, en sus líneas de sol y de
            receta. Si te interesa otra, consultanos por WhatsApp antes de
            comprar.
          </p>
        </RevealOnScroll>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-16 md:grid-cols-5">
          {brands.map((brand, idx) => (
            <RevealOnScroll as="li" key={brand.slug} delay={60 * idx}>
              <Link
                href={`/anteojos-de-sol/${brand.slug}`}
                className="border-white/15 bg-white/[0.04] hover:border-brand hover:bg-white/[0.08] group flex h-28 items-center justify-center rounded-md border p-3 text-center backdrop-blur-sm transition-colors duration-300 ease-out md:h-32"
                aria-label={`Ver anteojos ${brand.name}`}
              >
                {brand.logo_url ? (
                  <Image
                    src={getBrandAssetUrl(brand.logo_url)}
                    alt={brand.name}
                    width={200}
                    height={96}
                    className={cn(
                      'h-16 w-auto max-w-[170px] object-contain transition-transform duration-300 group-hover:scale-[1.04] md:h-20 md:max-w-[200px]',
                      shouldInvertLogo(brand.logo_url, 'dark-bg') &&
                        'brightness-0 invert',
                    )}
                  />
                ) : (
                  <span className="text-white font-medium transition-transform duration-300 group-hover:scale-[1.02]">
                    {brand.name}
                  </span>
                )}
              </Link>
            </RevealOnScroll>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Sección "Lo que escribimos" — cross-link a /guias. Solo se renderiza si hay
 * al menos 1 artículo publicado (founder no quiere mostrar contenido vacío).
 * Crítico para E-E-A-T: Google ve coherencia entre quién firma /guias y bio
 * en /sobre-nosotros. */
function EditorialSection({ articleCount }: { articleCount: number }) {
  return (
    <section className="container py-20 md:py-28">
      <RevealOnScroll className="mx-auto max-w-3xl text-center">
        <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
          <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
          Lo que escribimos
        </p>
        <h2 className="text-foreground mt-6 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl">
          Compartimos lo que{' '}
          <span className="font-normal italic text-foreground/70">sabemos</span>.
        </h2>
        <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-balance text-base md:text-lg">
          {articleCount === 1
            ? 'Publicamos una guía con todo lo que aprendimos en 30+ años de óptica. Editorial, sin marketing inflado.'
            : `Publicamos ${articleCount} guías con todo lo que aprendimos en 30+ años de óptica. Editorial, sin marketing inflado.`}
        </p>
        <div className="mt-10">
          <Link
            href="/guias"
            className="text-foreground/90 hover:text-foreground group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] transition-colors"
          >
            <span className="border-foreground/30 group-hover:border-foreground border-b pb-1 transition-colors">
              Leer nuestras guías
            </span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </RevealOnScroll>
    </section>
  );
}

function ContactCta({
  whatsappLink,
  location,
}: {
  whatsappLink: string | null;
  location: string;
}) {
  return (
    <section className="border-foreground/10 bg-foreground text-background border-t">
      <div className="container py-20 md:py-28">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <MapPin className="mx-auto size-8 opacity-80" strokeWidth={1.5} />
          <h2 className="mt-6 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
            Cualquier duda —{' '}
            <span className="font-normal italic opacity-70">escribinos</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-balance text-base opacity-80 md:text-lg">
            Respondemos en horario comercial. Sin formulario raro, sin chatbot.
            Hablás con nosotros directamente.
            {location ? ` Atendemos desde ${location}.` : ''}
          </p>

          {whatsappLink ? (
            <Button
              asChild
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 mt-10"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 size-5" strokeWidth={2} />
                Escribinos por WhatsApp
              </a>
            </Button>
          ) : (
            <Button
              asChild
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 mt-10"
            >
              <Link href="/preguntas-frecuentes">Ver preguntas frecuentes</Link>
            </Button>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}
