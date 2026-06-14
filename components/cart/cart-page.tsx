import Link from 'next/link';
import { CreditCard, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { WhatsappIcon } from '@/components/ui/whatsapp-icon';
import { Button } from '@/components/ui/button';
import { CartItemRow } from '@/components/cart/cart-item-row';
import { CouponInput } from '@/components/cart/coupon-input';
import { ShippingCalculator } from '@/components/cart/shipping-calculator';
import { RecentlyViewed } from '@/components/recently-viewed/recently-viewed';
import { formatPriceCents } from '@/lib/format/currency';
import { FREE_SHIPPING_THRESHOLD_CENTS } from '@/lib/shipping';
import { getWhatsappLinkWithContext } from '@/lib/site/business';
import type { ResolvedCart } from '@/lib/cart/types';

export function CartPage({
  cart,
  checkoutEnabled,
  defaultProvince,
  defaultPostalCode,
}: {
  cart: ResolvedCart;
  checkoutEnabled: boolean;
  /** Dirección registrada del usuario (si está logueado) para pre-cargar el estimador. */
  defaultProvince?: string | null;
  defaultPostalCode?: string | null;
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
              {cart.coupon && cart.coupon.discountCents > 0 && (
                <div className="flex justify-between">
                  <dt className="text-brand inline-flex items-center gap-1 font-medium">
                    Descuento ({cart.coupon.code})
                  </dt>
                  <dd className="text-brand font-medium tabular-nums">
                    -{formatPriceCents(cart.coupon.discountCents)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Envío</dt>
                <dd className="text-muted-foreground text-xs">
                  {cart.coupon?.removeShipping
                    ? 'Gratis (cupón)'
                    : 'Se calcula al elegir dirección'}
                </dd>
              </div>
              {cart.coupon && cart.coupon.discountCents > 0 && (
                <div className="border-border/40 flex justify-between border-t pt-2.5">
                  <dt className="text-foreground font-semibold">Total</dt>
                  <dd className="text-foreground font-semibold tabular-nums">
                    {formatPriceCents(
                      Math.max(0, cart.subtotalCents - cart.coupon.discountCents),
                    )}
                  </dd>
                </div>
              )}
            </dl>

            <CouponInput appliedCoupon={cart.coupon} couponError={cart.couponError} />

            <InstallmentsHint
              subtotalCents={Math.max(
                0,
                cart.subtotalCents - (cart.coupon?.discountCents ?? 0),
              )}
            />

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
              <CartWhatsappCta items={cart.items} />
            )}
          </div>

          <ShippingCalculator
            subtotalCents={cart.subtotalCents}
            itemCount={cart.items.reduce((n, it) => n + it.quantity, 0)}
            initialProvince={defaultProvince}
            initialPostalCode={defaultPostalCode}
          />

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
          <p className="text-muted-foreground/90 mx-auto mt-3 max-w-md text-balance text-xs md:text-sm">
            Envío a todo el país · Garantía 1 año · Pago seguro con Mercado Pago
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

      <RecentlyViewed
        heading="Mientras tanto, mirá lo que viste antes"
        limit={6}
        minToRender={2}
      />
    </main>
  );
}

function CartWhatsappCta({ items }: { items: ResolvedCart['items'] }) {
  const productList = items
    .map((it) => `${it.brand.name} ${it.product.name} (x${it.quantity})`)
    .join(', ');
  const message = `Hola! Quiero hacer este pedido: ${productList}. ¿Pueden ayudarme?`;
  const href = getWhatsappLinkWithContext(message);

  return (
    <div className="mt-5 space-y-2">
      {href ? (
        <Button asChild size="lg" className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
          <a href={href} target="_blank" rel="noopener noreferrer">
            <WhatsappIcon className="size-4" />
            Consultar por WhatsApp
          </a>
        </Button>
      ) : (
        <Button className="w-full" size="lg" disabled>
          Iniciar compra
        </Button>
      )}
      <p className="text-muted-foreground text-center text-xs">
        Hablá con un experto y te ayudamos a completar tu pedido.
      </p>
    </div>
  );
}

/**
 * Hint informativa de cuotas con tarjeta de crédito.
 * Muestra ejemplos de 3 y 6 cuotas calculadas a partir del subtotal.
 * NO promete "sin interés" porque depende del banco — copy honesto.
 */
function InstallmentsHint({ subtotalCents }: { subtotalCents: number }) {
  if (subtotalCents <= 0) return null;
  const three = Math.round(subtotalCents / 3);
  const six = Math.round(subtotalCents / 6);

  return (
    <div className="border-border/40 mt-3 border-t pt-3">
      <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-wider">
        Ejemplos en cuotas
      </p>
      <ul className="mt-1.5 space-y-1 text-xs">
        <li className="text-foreground flex items-baseline justify-between">
          <span className="text-muted-foreground">3 cuotas</span>
          <span className="font-medium tabular-nums">
            {formatPriceCents(three)}
            <span className="text-muted-foreground ml-1 text-[10px]">/ mes</span>
          </span>
        </li>
        <li className="text-foreground flex items-baseline justify-between">
          <span className="text-muted-foreground">6 cuotas</span>
          <span className="font-medium tabular-nums">
            {formatPriceCents(six)}
            <span className="text-muted-foreground ml-1 text-[10px]">/ mes</span>
          </span>
        </li>
      </ul>
      <p className="text-muted-foreground/80 mt-1.5 text-[10px] leading-snug">
        Cuotas reales según banco y tarjeta vía Mercado Pago.
      </p>
    </div>
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
