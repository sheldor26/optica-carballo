import { MapPin } from 'lucide-react';
import {
  SHIPPING_ESTIMATE_DAYS,
  SHIPPING_ORIGIN_LABEL,
} from '@/lib/site/shipping-notice';
import { cn } from '@/lib/utils';

/**
 * Cartel de origen y plazo de envío. Se muestra en ficha (compacto), carrito y
 * checkout (completo). Texto revisado con `argentine-ecom` (2026-11-12): es una
 * estimación, depende de Correo Argentino y no se usa urgencia ni contadores.
 * Mismo texto en todas las superficies para que no haya dos versiones.
 */
export function ShippingTimeNotice({
  variant = 'full',
  prescription = false,
  className,
}: {
  variant?: 'full' | 'compact';
  /** true si el carrito incluye anteojos con receta (el plazo corre desde el armado). */
  prescription?: boolean;
  className?: string;
}) {
  const { min, max } = SHIPPING_ESTIMATE_DAYS;

  if (variant === 'compact') {
    return (
      <p
        className={cn(
          'bg-brand/10 border-brand/30 text-foreground flex items-start gap-2 rounded-lg border p-3 text-xs leading-snug',
          className,
        )}
      >
        <MapPin className="text-brand mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <span>
          <strong>Enviamos desde Corrientes.</strong> Llega en un estimado de{' '}
          {min} a {max} días, según Correo Argentino y tu zona.
        </span>
      </p>
    );
  }

  return (
    <div
      className={cn(
        'bg-brand/10 border-brand/30 text-foreground flex items-start gap-3 rounded-lg border p-4 text-sm',
        className,
      )}
    >
      <MapPin className="text-brand mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="space-y-1.5">
        <p className="font-semibold">Enviamos desde Corrientes</p>
        <p className="text-xs leading-snug">
          Somos una óptica de {SHIPPING_ORIGIN_LABEL}. Los envíos llegan en un
          estimado de <strong>{min} a {max} días</strong> desde que se acredita
          el pago. Depende de Correo Argentino y de tu zona.
        </p>
        {prescription && (
          <p className="text-xs leading-snug">
            En anteojos con receta, el plazo corre desde que armamos tus lentes
            y despachamos. Te avisamos cuando salen.
          </p>
        )}
      </div>
    </div>
  );
}
