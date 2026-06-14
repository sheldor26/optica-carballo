import Link from 'next/link';
import {
  Truck,
  RotateCcw,
  Stethoscope,
  FileText,
  Store,
  Undo2,
} from 'lucide-react';

type Signal = {
  icon: typeof Store;
  title: string;
  description: string;
  /** Si está presente, el signal es clickeable (link a la política). */
  href?: string;
};

const SIGNALS: Signal[] = [
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
  {
    icon: FileText,
    title: 'Factura A o B',
    description: 'Electrónica y oficial',
  },
  {
    icon: RotateCcw,
    title: 'Cambios y devoluciones',
    description: 'Hasta 30 días sin uso',
    href: '/politica-de-devolucion',
  },
  {
    icon: Undo2,
    title: 'Botón de arrepentimiento',
    description: 'Cancelás hasta 10 días',
    href: '/boton-de-arrepentimiento',
  },
];

/**
 * Strip compacta de 4 trust signals para PDP. Grid 2x2 en mobile,
 * 4 columnas en desktop. Diseño minimal: icono outline + título + sub.
 *
 * Las claims son universales del negocio (BUSINESS_POLICIES.md):
 * - 30 años: founder confirmó "empresa familiar 30+ años".
 * - Asesoramiento personal: atención real (sin claim de matrícula).
 * - Envío: Correo Argentino (sin prometer plazos específicos).
 * - Cambios: 30 días para talle/color sin uso (Defensa del Consumidor + política propia).
 */
export function ProductTrustSignals() {
  return (
    <div className="border-border/60 bg-muted/20 rounded-xl border p-4">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {SIGNALS.map((signal) => {
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
    </div>
  );
}
