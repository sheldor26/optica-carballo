import Link from 'next/link';
import { Award, Truck, RotateCcw, Stethoscope, FileText, Undo2 } from 'lucide-react';

type Signal = {
  icon: typeof Award;
  title: string;
  description: string;
  /** Si está presente, el signal es clickeable (link a la política). */
  href?: string;
};

const SIGNALS: Signal[] = [
  {
    icon: Award,
    title: '+30 años',
    description: 'Empresa familiar con trayectoria',
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
    description: 'Electrónica, cumple AFIP',
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
 * Strip compacta de 6 trust signals para PDP. Grid 2 columnas en mobile,
 * 3 en desktop. Layout horizontal de 1 línea por ítem (icono + título, sin
 * descripción) para minimizar el alto manteniendo las 6 garantías VISIBLES
 * — decisión CRO 2026-06-14: los trust signals funcionan por presencia
 * simultánea; no se ocultan/rotan (devolución y arrepentimiento son links
 * legales de Defensa del Consumidor). Las descripciones se conservan en las
 * páginas linkeadas.
 *
 * Las claims son universales del negocio (BUSINESS_POLICIES.md):
 * - 30 años: founder confirmó "empresa familiar 30+ años".
 * - Asesoramiento personal: atención real (sin claim de matrícula).
 * - Envío: Correo Argentino (sin prometer plazos específicos).
 * - Cambios: 30 días para talle/color sin uso (Defensa del Consumidor + política propia).
 */
export function ProductTrustSignals() {
  return (
    <div className="border-border/60 bg-muted/20 rounded-xl border px-4 py-3">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3">
        {SIGNALS.map((signal) => {
          const Icon = signal.icon;
          const body = (
            <>
              <span
                aria-hidden="true"
                className="border-border/60 bg-background flex size-8 shrink-0 items-center justify-center rounded-full border"
              >
                <Icon
                  className="text-foreground/80 size-4"
                  strokeWidth={1.75}
                />
              </span>
              <span className="text-foreground min-w-0 text-xs font-medium leading-tight sm:text-sm">
                {signal.title}
              </span>
            </>
          );
          return (
            <li key={signal.title} className="flex items-center gap-2.5">
              {signal.href ? (
                <Link
                  href={signal.href}
                  className="group/sig flex min-w-0 items-center gap-2.5 rounded-md outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
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
