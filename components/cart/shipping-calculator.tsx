'use client';

import { useState } from 'react';
import { Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPriceCents } from '@/lib/format/currency';
import { AR_PROVINCES } from '@/lib/addresses/constants';
import { calculateShipping } from '@/lib/shipping';

type Props = {
  subtotalCents: number;
};

/**
 * Mini-widget en el carrito: el cliente elige provincia y ve el costo de
 * envío estimado ANTES de ir al checkout. Reduce sorpresa en el último paso
 * y ayuda a decidir si suma items para llegar al free shipping.
 *
 * `calculateShipping` es 100% pura, no toca DB ni APIs — la cotización es
 * instantánea client-side. Cuando se integre API real (Andreani), este
 * componente puede pasar a fetch + loading state.
 */
export function ShippingCalculator({ subtotalCents }: Props) {
  const [province, setProvince] = useState<string>('');

  const quote = province
    ? calculateShipping({ subtotalCents, provinceName: province })
    : null;

  return (
    <div className="border-border/60 bg-background mt-4 rounded-xl border p-4">
      <p className="text-foreground inline-flex items-center gap-2 text-sm font-semibold">
        <Truck className="text-brand size-4" />
        Calculá tu envío
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        Elegí tu provincia para ver el costo estimado.
      </p>
      <select
        value={province}
        onChange={(e) => setProvince(e.target.value)}
        className={cn(
          'border-border bg-background text-foreground mt-3 w-full rounded-md border px-3 py-2 text-sm',
          'focus-visible:border-foreground/40 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
        )}
        aria-label="Provincia"
      >
        <option value="">Seleccioná tu provincia…</option>
        {AR_PROVINCES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {quote && (
        <div className="mt-3 space-y-1 text-sm">
          <div className="flex items-baseline justify-between">
            <span className="text-muted-foreground">
              {quote.zoneLabel}
            </span>
            <span className="text-foreground font-medium tabular-nums">
              {quote.isFree ? (
                <span className="text-emerald-700 dark:text-emerald-400">
                  Gratis
                </span>
              ) : (
                formatPriceCents(quote.cents)
              )}
            </span>
          </div>
          {quote.isFree && quote.originalCents !== null && (
            <p className="text-muted-foreground text-xs">
              Era{' '}
              <span className="line-through">
                {formatPriceCents(quote.originalCents)}
              </span>
              , gratis por haber superado el mínimo.
            </p>
          )}
          {!quote.isFree && quote.centsToFreeShipping > 0 && (
            <p className="text-muted-foreground text-xs">
              Sumá {formatPriceCents(quote.centsToFreeShipping)} para envío
              gratis.
            </p>
          )}
        </div>
      )}

      <p className="text-muted-foreground/70 mt-3 text-[11px]">
        Estimación orientativa. El costo final se confirma con la dirección
        exacta en el checkout.
      </p>
    </div>
  );
}
