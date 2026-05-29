import { Award, Truck, RotateCcw, Stethoscope } from 'lucide-react';

type Signal = {
  icon: typeof Award;
  title: string;
  description: string;
};

const SIGNALS: Signal[] = [
  {
    icon: Award,
    title: '+30 años',
    description: 'Empresa familiar con trayectoria',
  },
  {
    icon: Stethoscope,
    title: 'Óptica matriculada',
    description: 'Profesional regente habilitada',
  },
  {
    icon: Truck,
    title: 'Envío a todo el país',
    description: 'Con Andreani con seguimiento',
  },
  {
    icon: RotateCcw,
    title: 'Cambios y devoluciones',
    description: 'Hasta 30 días sin uso',
  },
];

/**
 * Strip compacta de 4 trust signals para PDP. Grid 2x2 en mobile,
 * 4 columnas en desktop. Diseño minimal: icono outline + título + sub.
 *
 * Las claims son universales del negocio (BUSINESS_POLICIES.md):
 * - 30 años: founder confirmó "empresa familiar 30+ años".
 * - Óptica matriculada: María Carlota es la regente matriculada.
 * - Envío: Andreani principal (sin prometer plazos específicos).
 * - Cambios: 30 días para talle/color sin uso (Defensa del Consumidor + política propia).
 */
export function ProductTrustSignals() {
  return (
    <div className="border-border/60 bg-muted/20 rounded-xl border p-4">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {SIGNALS.map((signal) => {
          const Icon = signal.icon;
          return (
            <li
              key={signal.title}
              className="flex flex-col items-start gap-2"
            >
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}
