import Link from 'next/link';
import { ArrowRight, FileText, Ruler, ScanFace, Sparkles } from 'lucide-react';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';

type Tool = {
  href: string;
  label: string;
  description: string;
  icon: typeof FileText;
  cta: string;
};

const TOOLS: Tool[] = [
  {
    href: '/recomendador-de-monturas',
    label: 'Recomendador de monturas',
    description:
      'Subí una selfie y nuestra IA te recomienda qué forma de armazón le queda mejor a tu rostro.',
    icon: ScanFace,
    cta: 'Probar el recomendador',
  },
  {
    href: '/lector-de-receta',
    label: 'Lector de receta con IA',
    description:
      'Subí la foto o PDF de tu receta oftalmológica y nuestro asistente lee los valores automáticamente.',
    icon: FileText,
    cta: 'Leer mi receta',
  },
  {
    href: '/medidor-de-dnp',
    label: 'Medidor de DNP con IA',
    description:
      'Medí tu distancia interpupilar desde casa con una foto y una tarjeta de crédito como referencia.',
    icon: Ruler,
    cta: 'Medir mi DNP',
  },
];

/**
 * Sección destacada de herramientas con IA en el home. Se ubica entre
 * BrandsSection y HomeFaqs — el cliente ya conoció las marcas, ahora
 * descubre las herramientas que diferencian al sitio de la competencia.
 */
export function HomeTools() {
  return (
    <section
      aria-labelledby="home-tools-heading"
      className="container py-12 md:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <RevealOnScroll>
          <p className="text-brand inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
            <Sparkles className="size-3.5" />
            Herramientas gratis con IA
          </p>
          <h2
            id="home-tools-heading"
            className="text-foreground mt-3 text-balance font-serif text-3xl font-medium tracking-[-0.015em] md:text-4xl"
          >
            Probá nuestras{' '}
            <span className="italic">herramientas inteligentes</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl text-balance text-base">
            Dos herramientas únicas en óptica online argentina. Sin registro, sin
            costo. Tus datos no se guardan.
          </p>
        </RevealOnScroll>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:gap-6">
          {TOOLS.map((tool, idx) => (
            <RevealOnScroll key={tool.href} delay={120 * idx}>
              <Link
                href={tool.href}
                className="group border-border/60 bg-background hover:border-foreground/40 relative block h-full overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:p-8"
              >
                <div
                  aria-hidden="true"
                  className="bg-brand/10 pointer-events-none absolute -right-12 -top-12 size-32 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-150"
                />
                <div className="relative">
                  <div className="bg-brand/10 inline-flex size-12 items-center justify-center rounded-full">
                    <tool.icon className="text-brand size-5" />
                  </div>
                  <h3 className="text-foreground mt-4 font-serif text-xl font-medium tracking-tight md:text-2xl">
                    {tool.label}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm md:text-base">
                    {tool.description}
                  </p>
                  <p className="text-foreground mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
                    {tool.cta}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </p>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
