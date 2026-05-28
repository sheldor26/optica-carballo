import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItemRow } from '@/components/cart/cart-item-row';
import { formatPriceCents } from '@/lib/format/currency';
import type { ResolvedCart } from '@/lib/cart/types';

export function CartPage({
  cart,
  checkoutEnabled,
}: {
  cart: ResolvedCart;
  checkoutEnabled: boolean;
}) {
  if (cart.items.length === 0) {
    return (
      <main className="container py-12 md:py-16">
        <div className="mx-auto max-w-md text-center">
          <ShoppingBag
            className="text-muted-foreground mx-auto size-12"
            aria-hidden="true"
          />
          <h1 className="text-foreground mt-4 text-2xl font-bold tracking-tight">
            Tu carrito está vacío
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Explorá nuestras marcas y agregá tus anteojos.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/anteojos-de-sol">Ver anteojos de sol</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/anteojos-de-receta">Ver armazones de receta</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-8 md:py-12">
      <h1 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
        Tu carrito
      </h1>

      <div className="mt-6 grid gap-8 md:grid-cols-3 md:gap-12">
        <ul className="md:col-span-2">
          {cart.items.map((item) => (
            <CartItemRow key={item.variantId} item={item} />
          ))}
        </ul>

        <aside className="md:col-span-1">
          <div className="border-border rounded-lg border p-5">
            <h2 className="text-foreground text-base font-semibold">
              Resumen
            </h2>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="text-foreground font-medium tabular-nums">
                  {formatPriceCents(cart.subtotalCents)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Envío</dt>
                <dd className="text-muted-foreground text-xs">
                  Se calcula en el checkout
                </dd>
              </div>
            </dl>

            {cart.hasIssues && (
              <p className="text-destructive mt-4 text-xs">
                Hay items con problemas. Resolvélos antes de seguir.
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
                  Checkout próximamente. Mientras tanto, podés consultar por
                  WhatsApp.
                </p>
              </>
            )}
          </div>

          <p className="text-muted-foreground mt-4 text-xs">
            Los precios incluyen IVA. El total final se confirma en el siguiente
            paso con el costo de envío.
          </p>
        </aside>
      </div>
    </main>
  );
}
