import { formatPriceCents } from '@/lib/format/currency';
import type { ResolvedCart } from '@/lib/cart/types';
import type { ShippingQuote } from '@/lib/shipping';

/**
 * Resumen del carrito + envío + total. Pure server component — recibe
 * data ya resuelta. El subtotal/envío/total están listos para mostrar.
 */
export function CheckoutSummary({
  cart,
  shipping,
}: {
  cart: ResolvedCart;
  shipping: ShippingQuote;
}) {
  const totalCents = cart.subtotalCents + shipping.cents;

  return (
    <div className="border-border/60 bg-background rounded-xl border p-5 shadow-sm">
      <h2 className="text-foreground font-serif text-xl font-medium tracking-tight">
        Tu pedido
      </h2>

      <ul className="mt-4 space-y-3">
        {cart.items.map((item) => (
          <li key={item.variantId} className="flex items-start gap-3 text-sm">
            <span className="bg-muted text-muted-foreground inline-flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums">
              {item.quantity}
            </span>
            <span className="flex-1">
              <span className="text-foreground block font-medium">
                {item.product.name}
              </span>
              <span className="text-muted-foreground block text-xs">
                {item.brand.name} · SKU {item.variant.sku}
              </span>
            </span>
            <span className="text-foreground shrink-0 font-medium tabular-nums">
              {formatPriceCents(item.variant.priceCents * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="border-border mt-5 space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="text-foreground font-medium tabular-nums">
            {formatPriceCents(cart.subtotalCents)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">
            Envío
            <span className="text-muted-foreground/70 block text-[11px]">
              {shipping.zoneLabel}
            </span>
          </dt>
          <dd className="text-foreground text-right font-medium tabular-nums">
            {shipping.isFree ? (
              <>
                <span className="text-emerald-700 dark:text-emerald-400">Gratis</span>
                {shipping.originalCents !== null && (
                  <span className="text-muted-foreground/70 ml-2 block text-[11px] line-through">
                    {formatPriceCents(shipping.originalCents)}
                  </span>
                )}
              </>
            ) : (
              formatPriceCents(shipping.cents)
            )}
          </dd>
        </div>
        {!shipping.isFree && shipping.centsToFreeShipping > 0 && (
          <p className="text-muted-foreground text-[11px]">
            Te faltan {formatPriceCents(shipping.centsToFreeShipping)} para
            envío gratis.
          </p>
        )}
      </dl>

      <div className="border-border mt-4 flex items-baseline justify-between border-t pt-4">
        <span className="text-foreground text-base font-semibold">Total</span>
        <span className="text-foreground font-serif text-2xl font-medium tabular-nums">
          {formatPriceCents(totalCents)}
        </span>
      </div>
    </div>
  );
}
