import Link from 'next/link';
import { Truck, Stethoscope, Store } from 'lucide-react';

type Signal = {
  icon: typeof Store;
  title: string;
  description: string;
  /** Si está presente, el signal es clickeable (link a la política). */
  href?: string;
};

/** Pilares de valor — diferenciadores comerciales, tratamiento con tarjeta+ícono. */
const PILLAR_SIGNALS: Signal[] = [
  {
    icon: Store,
    title: 'Retiro gratis en local',
    description: 'Lo retirás y probás en persona, en Virasoro',
    href: '/sobre-nosotros',
  },
  {
    icon: Stethoscope,
    title: 'Asesoramiento personal',
    description: 'Atención real, no bot',
  },
  {
    icon: Truck,
    title: 'Envío a todo el país',
    description: 'Con Correo Argentino con seguimiento',
  },
];

/**
 * Garantías/legales — con base en Defensa del Consumidor (igual que
 * "cambios y devoluciones", que va acá y no en los pilares: es una política
 * con el mismo fundamento legal que garantía/arrepentimiento, no un
 * diferenciador comercial). Lista compacta de texto, sin ícono — bajar
 * densidad visual es el objetivo, un ícono chico la reintroduce
 * (conversion-optimizer 2026-08-01).
 */
const LEGAL_SIGNALS: { title: string; href: string }[] = [
  { title: 'Factura A o B', href: '/preguntas-frecuentes' },
  { title: 'Garantía legal 1 año', href: '/politica-de-devolucion' },
  { title: 'Cambios y devoluciones', href: '/politica-de-devolucion' },
  { title: 'Botón de arrepentimiento', href: '/boton-de-arrepentimiento' },
];

/**
 * Strip de trust signals para PDP, 2 niveles de jerarquía (rediseño
 * conversion-optimizer + Antigravity 2026-08-01 — los 7 signals con el mismo
 * tratamiento visual se veían monótonos/saturados):
 *
 * 1. **Pilares** (3): grid con tarjeta+ícono, sin cambios de layout respecto
 *    a antes. 2 col mobile, 3 en tablet+.
 * 2. **Legales** (4): lista compacta de texto plano debajo, separada por un
 *    borde superior, sin ícono, subrayado solo on-hover/focus.
 *
 * Las claims son universales del negocio (BUSINESS_POLICIES.md):
 * - 30 años: founder confirmó "empresa familiar 30+ años".
 * - Asesoramiento personal: atención real (sin claim de matrícula).
 * - Envío: Correo Argentino (sin prometer plazos específicos).
 * - Cambios: 30 días para talle/color sin uso (Defensa del Consumidor + política propia).
 * - Garantía legal: 1 año por ley (art. 11 Ley 24.240, texto Ley 27.701), envío de
 *   garantía a cargo nuestro — distinta de la garantía del fabricante (ProductIncludes,
 *   más abajo en la PDP: misma duración pero régimen contractual, no legal).
 */
export function ProductTrustSignals() {
  return (
    <div className="border-border/60 bg-muted/20 rounded-xl border p-4">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {PILLAR_SIGNALS.map((signal) => {
          const Icon = signal.icon;
          const body = (
            <>
              <span
                aria-hidden="true"
                className="border-border/60 bg-background flex size-9 items-center justify-center rounded-full border"
              >
                <Icon
                  className="text-foreground/80 size-4"
                  strokeWidth={1.75}
                />
              </span>
              <div className="min-w-0">
                <p className="text-foreground text-xs font-semibold leading-tight sm:text-sm">
                  {signal.title}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[11px] leading-snug sm:text-xs">
                  {signal.description}
                </p>
              </div>
            </>
          );
          return (
            <li key={signal.title} className="flex flex-col items-start gap-2">
              {signal.href ? (
                <Link
                  href={signal.href}
                  className="group/sig flex flex-col items-start gap-2 rounded-md outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {body}
                </Link>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>

      <ul className="border-border/60 text-muted-foreground mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-3 text-xs">
        {LEGAL_SIGNALS.map((signal, idx) => (
          <li key={signal.title} className="flex items-center gap-3">
            <Link
              href={signal.href}
              className="outline-none hover:underline focus-visible:underline underline-offset-2"
            >
              {signal.title}
            </Link>
            {idx < LEGAL_SIGNALS.length - 1 && (
              <span aria-hidden="true">·</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
