'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Plus, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AddressSelector } from '@/components/checkout/address-selector';
import { CheckoutSummary } from '@/components/checkout/checkout-summary';
import { submitCheckout, type CheckoutFormState } from '@/lib/checkout/actions';
import type { Address } from '@/lib/addresses/types';
import type { ResolvedCart } from '@/lib/cart/types';
import type { ShippingQuote } from '@/lib/shipping';

const initialState: CheckoutFormState = { ok: false };

export function CheckoutPage({
  cart,
  addresses,
  shipping,
}: {
  cart: ResolvedCart;
  addresses: Address[];
  shipping: ShippingQuote;
}) {
  const [state, formAction] = useActionState(submitCheckout, initialState);
  const defaultAddress = addresses.find((a) => a.is_default) ?? addresses[0];

  return (
    <main className="container max-w-5xl py-8 md:py-12">
      <header className="mb-8">
        <p className="text-muted-foreground text-sm">
          <Link
            href="/carrito"
            className="hover:text-foreground underline-offset-2 hover:underline"
          >
            ← Volver al carrito
          </Link>
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          Finalizar compra
        </h1>
      </header>

      <form action={formAction} className="grid gap-8 md:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {addresses.length === 0 ? (
            <div className="border-border rounded-lg border border-dashed p-6 text-center">
              <h2 className="text-foreground font-medium">
                Necesitás una dirección de envío
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Agregá la dirección donde recibirás tu compra.
              </p>
              <Button asChild className="mt-4">
                <Link href="/mi-cuenta/direcciones/nueva?next=/checkout">
                  <Plus className="size-4" />
                  Agregar mi primera dirección
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <AddressSelector
                addresses={addresses}
                defaultAddressId={defaultAddress?.id}
              />
              <p className="text-muted-foreground text-xs">
                <Link
                  href="/mi-cuenta/direcciones/nueva?next=/checkout"
                  className="underline-offset-2 hover:underline"
                >
                  + Agregar otra dirección
                </Link>
              </p>
            </>
          )}

          {state.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </div>

        <aside className="space-y-4">
          <CheckoutSummary cart={cart} shipping={shipping} />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={addresses.length === 0 || cart.hasIssues}
          >
            Confirmar pedido
          </Button>

          <p className="text-muted-foreground flex items-start gap-2 text-xs">
            <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />
            <span>
              Pago seguro vía Mercado Pago. Tus datos viajan encriptados.
            </span>
          </p>
        </aside>
      </form>
    </main>
  );
}
