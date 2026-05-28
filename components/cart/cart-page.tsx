import Link from 'next/link';
import { CreditCard, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItemRow } from '@/components/cart/cart-item-row';
import { ShippingCalculator } from '@/components/cart/shipping-calculator';
import { formatPriceCents } from '@/lib/format/currency';
import { FREE_SHIPPING_THRESHOLD_CENTS } from '@/lib/shipping';
import type { ResolvedCart } from '@/lib/cart/types';

export function CartPage({
  cart,
  checkoutEnabled,
}: {
  cart: ResolvedCart;
  checkoutEnabled: boolean;
}) {
  if (cart.items.length === 0) {
    return <EmptyCart />;
  }

  const remainingForFree = Math.max(
    FREE_SHIPPING_THRESHOLD_CENTS - cart.subtotalCents,
    0,
  );

  return (
    <main className="container py-8 md:py-12">
      <h1 className="text-foreground font-serif text-4xl font-medium tracking-[-0.02em] md:text-5xl">
        Tu <span className="italic">carrito</span>
      </h1>
      <p className="text-muted-foreground mt-2 text-sm md:text-base">
        Revisá los items, ajustá cantidades y pasá al checkout cuando estés
        listo/a.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-12">
        <ul className="md:col-span-2">
          {cart.items.map((item) => (
            <CartItemRow key={item.variantId} item={item} />
          ))}
        </ul>

        <aside className="md:col-span-1">
          <div className="border-border/60 bg-background rounded-xl border p-5 shadow-sm">
            <h2 className="text-foreground font-serif text-xl font-medium tracking-tight">
              Resumen
            </h2>

            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="text-foreground font-medium tabular-nums">
                  {formatPriceCents(cart.subtotalCents)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Envío</dt>
                <dd className="text-muted-foreground text-xs">
                  Se calcula al elegir dirección
                </dd>
              </div>
            </dl>

            {remainingForFree > 0 && (
              <div className="bg-brand/10 border-brand/30 mt-4 rounded-lg border p-3">
                <p className="text-foreground text-xs">
                  Te faltan{' '}
                  <span className="text-brand font-semibold">
                    {formatPriceCents(remainingForFree)}
                  </span>{' '}
                  para envío gratis.
                </p>
                <div className="bg-muted mt-2 h-1.5 overflow-hidden rounded-full">
                  <div
                    className="bg-brand h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        (cart.subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {cart.hasIssues && (
              <p className="text-destructive mt-4 text-xs">
                Hay items con problemas. Resolvelos antes de seguir.
              </p>
            )}

            {checkoutEnabled ? (
              <Button asChild className="mt-5 w-full" size="lg">
                <Link href="/checkout">Iniciar compra</Link>
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  className="mt-5 w-full"
                  size="lg"
                  disabled
                  title="Próximamente"
                >
                  Iniciar compra
                </Button>
                <p className="text-muted-foreground mt-2 text-center text-xs">
                  Checkout próximamente. Mientras tanto, consultanos por
                  WhatsApp.
                </p>
              </>
            )}
          </div>

          <ShippingCalculator subtotalCents={cart.subtotalCents} />

          <TrustSignals />

          <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
            Los precios incluyen IVA. El total final se confirma en el siguiente
            paso con el costo de envío.
          </p>
        </aside>
      </div>
    </main>
  );
}

function EmptyCart() {
  return (
    <main className="container py-12 md:py-20">
      <div className="from-muted/30 to-background relative isolate mx-auto max-w-xl overflow-hidden rounded-2xl bg-gradient-to-b p-10 text-center md:p-16">
        <div
          aria-hidden="true"
          className="bg-brand/15 pointer-events-none absolute -right-20 -top-20 size-64 rounded-full blur-3xl"
        />
        <div className="relative">
          <div className="bg-background border-border/60 mx-auto flex size-16 items-center justify-center rounded-full border shadow-sm">
            <ShoppingBag className="text-foreground/70 size-7" aria-hidden="true" />
          </div>
          <h1 className="text-foreground mt-6 font-serif text-3xl font-medium tracking-tight md:text-4xl">
            Tu carrito está <span className="italic">vacío</span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance text-sm md:text-base">
            Explorá nuestras marcas y agregá los anteojos que te van a
            acompañar en los próximos años.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/anteojos-de-sol">Ver anteojos de sol</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/anteojos-de-receta">Ver armazones de receta</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

function TrustSignals() {
  return (
    <ul className="mt-5 space-y-2.5 text-xs">
      <li className="text-muted-foreground flex items-start gap-2">
        <ShieldCheck className="text-brand mt-0.5 size-3.5 shrink-0" />
        <span>Compra protegida. Devolución hasta 10 días.</span>
      </li>
      <li className="text-muted-foreground flex items-start gap-2">
        <Truck className="text-brand mt-0.5 size-3.5 shrink-0" />
        <span>Envíos a todo el país. Retiro gratis en local.</span>
      </li>
      <li className="text-muted-foreground flex items-start gap-2">
        <CreditCard className="text-brand mt-0.5 size-3.5 shrink-0" />
        <span>Mercado Pago, tarjetas y transferencia.</span>
      </li>
    </ul>
  );
}
