'use client';

import { useVariantSelection } from '@/lib/product/variant-selection';
import { formatPriceCents } from '@/lib/format/currency';
import { ShippingEstimator } from '@/components/product/shipping-estimator';
import {
  INSTALLMENTS_ENABLED,
  INTEREST_FREE_INSTALLMENTS,
  installmentAmountCents,
} from '@/lib/site/installments';

type PriceVariant = {
  id: string;
  priceCents: number;
  stockQty: number;
};

/**
 * Bloque de precio reactivo a la variante seleccionada.
 *
 * El precio y el estado de stock siguen a la variante que el usuario
 * elige en `VariantList` (vía `VariantSelectionProvider`). Sin esto, el
 * precio quedaba estático con el "Desde $X" calculado server-side y no
 * cambiaba al seleccionar otra variante (bug reportado 2026-05-30 con la
 * variante Rusty Yau Revo Blue, $103.902 vs $98.350 de la base).
 *
 * `fallbackLabel` cubre el caso degenerado de que no haya variante
 * seleccionada (no debería pasar: el provider arranca con una por default).
 */
export function ProductPriceBlock({
  variants,
  fallbackLabel,
}: {
  variants: PriceVariant[];
  fallbackLabel: string | null;
}) {
  const { selectedVariantId } = useVariantSelection();
  const selected = variants.find((v) => v.id === selectedVariantId) ?? null;

  const priceText = selected ? formatPriceCents(selected.priceCents) : fallbackLabel;
  const inStock = selected
    ? selected.stockQty > 0
    : variants.some((v) => v.stockQty > 0);

  if (!priceText) {
    return (
      <p className="text-muted-foreground text-base">Sin stock disponible</p>
    );
  }

  return (
    <div className="border-border/60 from-muted/30 to-background rounded-xl border bg-gradient-to-br p-5">
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
        Precio
      </p>
      <p className="text-foreground mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
        {priceText}
      </p>
      {INSTALLMENTS_ENABLED && selected && (
        <>
          <p className="text-foreground mt-2 text-xs font-medium sm:text-sm">
            {INTEREST_FREE_INSTALLMENTS} cuotas sin interés de{' '}
            <span className="font-semibold">
              {formatPriceCents(installmentAmountCents(selected.priceCents))}
            </span>
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Pagás con tarjeta de crédito vía{' '}
            <span className="text-foreground font-medium">Mercado Pago</span>.
            Hasta 12 cuotas según el banco.
          </p>
        </>
      )}
      {inStock ? (
        <>
          <div className="border-border/40 mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t pt-3 text-xs">
            <p className="text-muted-foreground inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-green-600" />
              En stock
            </p>
            <p className="text-muted-foreground inline-flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-foreground/30" />
              Retiro gratis en local
            </p>
          </div>
          <div className="mt-3">
            <ShippingEstimator variants={variants} />
          </div>
        </>
      ) : (
        <div className="border-border/40 mt-3 border-t pt-3 text-xs">
          <p className="text-destructive inline-flex items-center gap-1.5">
            <span className="bg-destructive size-1.5 rounded-full" />
            Sin stock
          </p>
        </div>
      )}
    </div>
  );
}
