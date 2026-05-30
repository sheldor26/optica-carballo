'use client';

import { useState } from 'react';
import { ChevronDown, Truck, X } from 'lucide-react';
import { AR_PROVINCES } from '@/lib/addresses/constants';
import { calculateShipping } from '@/lib/shipping';
import { formatPriceCents } from '@/lib/format/currency';
import { useVariantSelection } from '@/lib/product/variant-selection';
import { cn } from '@/lib/utils';

type PriceVariant = {
  id: string;
  priceCents: number;
};

/**
 * Estimador de envío en PDP. Reactivo a la variante seleccionada (precio
 * cambia) y a la provincia que el user elige.
 *
 * Behavior:
 * - Inicial: link "Calculá el envío a tu provincia" colapsado.
 * - Click → muestra dropdown de provincias.
 * - Selecciona → muestra costo o "gratis" + ahorro vs base si aplica.
 * - Botón X para volver al estado colapsado.
 */
export function ShippingEstimator({ variants }: { variants: PriceVariant[] }) {
  const { selectedVariantId } = useVariantSelection();
  const selected = variants.find((v) => v.id === selectedVariantId);
  const [province, setProvince] = useState<string>('');
  const [open, setOpen] = useState(false);

  if (!selected) return null;

  if (!province) {
    return (
      <div className="text-xs">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 underline-offset-2 hover:underline"
        >
          <Truck className="size-3.5" aria-hidden="true" />
          Calculá el envío a tu provincia
          <ChevronDown
            className={cn(
              'size-3 transition-transform',
              open && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </button>
        {open && (
          <select
            value=""
            onChange={(e) => {
              setProvince(e.target.value);
              setOpen(false);
            }}
            className="border-input bg-background mt-2 block w-full max-w-xs rounded-md border px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Elegí tu provincia</option>
            {AR_PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }

  const quote = calculateShipping({
    subtotalCents: selected.priceCents,
    provinceName: province,
  });

  return (
    <div className="border-border/40 bg-muted/30 flex items-start gap-2 rounded-md border px-3 py-2 text-xs">
      <Truck className="text-muted-foreground mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-[10px] uppercase tracking-wide">
          Envío a {province}
        </p>
        {quote.isFree ? (
          <p className="text-foreground mt-0.5 text-sm font-semibold">
            ¡GRATIS!
            {quote.originalCents && (
              <span className="text-muted-foreground ml-2 text-xs font-normal line-through">
                {formatPriceCents(quote.originalCents)}
              </span>
            )}
          </p>
        ) : (
          <>
            <p className="text-foreground mt-0.5 text-sm font-semibold">
              {formatPriceCents(quote.cents)}
            </p>
            {quote.centsToFreeShipping > 0 && (
              <p className="text-muted-foreground mt-0.5 text-[11px]">
                Sumá {formatPriceCents(quote.centsToFreeShipping)} para envío gratis
              </p>
            )}
          </>
        )}
      </div>
      <button
        type="button"
        onClick={() => setProvince('')}
        aria-label="Cambiar provincia"
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
