'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { Plus, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AddressSelector } from '@/components/checkout/address-selector';
import { CheckoutSummary } from '@/components/checkout/checkout-summary';
import { ShippingMethodSelector } from '@/components/checkout/shipping-method-selector';
import { submitCheckout, type CheckoutFormState } from '@/lib/checkout/actions';
import { pickupQuote, type ShippingMethod } from '@/lib/shipping';
import type { Address } from '@/lib/addresses/types';
import type { ResolvedCart } from '@/lib/cart/types';
import type { ShippingQuote } from '@/lib/shipping';

const initialState: CheckoutFormState = { ok: false };

export function CheckoutPage({
  cart,
  addresses,
  shipping,
  pickupAddress,
}: {
  cart: ResolvedCart;
  addresses: Address[];
  shipping: ShippingQuote;
  pickupAddress: string | null;
}) {
  const [state, formAction] = useActionState(submitCheckout, initialState);
  const [method, setMethod] = useState<ShippingMethod>('delivery');
  const defaultAddress = addresses.find((a) => a.is_default) ?? addresses[0];

  // Calculamos el quote efectivo según el método seleccionado.
  const pickup = pickupQuote();
  const activeQuote: ShippingQuote = method === 'pickup' ? pickup : shipping;

  const needsAddressForDelivery =
    method === 'delivery' && addresses.length === 0;

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
        <h1 className="text-foreground mt-3 font-serif text-4xl font-medium tracking-[-0.02em] md:text-5xl">
          Finalizar <span className="italic">compra</span>
        </h1>
      </header>

      <form action={formAction} className="grid gap-8 md:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <ShippingMethodSelector
            selected={method}
            onChange={setMethod}
            deliveryQuote={shipping}
            pickupAddress={pickupAddress}
          />

          {method === 'delivery' && (
            <div>
              <h2 className="text-foreground font-serif text-xl font-medium tracking-tight">
                Dirección de envío
              </h2>
              {needsAddressForDelivery ? (
                <div className="border-border mt-4 rounded-xl border border-dashed p-6 text-center">
                  <h3 className="text-foreground text-sm font-medium">
                    Necesitás una dirección de envío
                  </h3>
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
                <div className="mt-4 space-y-3">
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
                </div>
              )}
            </div>
          )}

          {state.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </div>

        <aside className="space-y-4">
          <CheckoutSummary cart={cart} shipping={activeQuote} />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={needsAddressForDelivery || cart.hasIssues}
          >
            Confirmar pedido
          </Button>

          <p className="text-muted-foreground flex items-start gap-2 text-xs">
            <ShieldCheck className="text-brand size-3.5 shrink-0" aria-hidden="true" />
            <span>
              Pago seguro vía Mercado Pago. Tus datos viajan encriptados.
            </span>
          </p>
        </aside>
      </form>
    </main>
  );
}
