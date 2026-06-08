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
import {
  pickupQuote,
  type ShippingMethod,
  type ShippingQuote,
} from '@/lib/shipping';
import type { Address } from '@/lib/addresses/types';
import type { ResolvedCart } from '@/lib/cart/types';
import type { CorreoBranch } from '@/lib/correo/types';

/** Cotizaciones + sucursales pre-calculadas en el server por dirección. */
export type ShippingOptions = {
  delivery: ShippingQuote;
  branch: ShippingQuote | null;
  branches: CorreoBranch[];
};

const initialState: CheckoutFormState = { ok: false };

export function CheckoutPage({
  cart,
  addresses,
  shippingByAddress,
  defaultAddressId,
  fallbackShipping,
  pickupAddress,
}: {
  cart: ResolvedCart;
  addresses: Address[];
  shippingByAddress: Record<string, ShippingOptions>;
  defaultAddressId: string | null;
  fallbackShipping: ShippingQuote;
  pickupAddress: string | null;
}) {
  const [state, formAction] = useActionState(submitCheckout, initialState);
  const [method, setMethod] = useState<ShippingMethod>('delivery');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    defaultAddressId ?? addresses[0]?.id ?? '',
  );
  const [selectedBranchCode, setSelectedBranchCode] = useState<string>('');

  // Opciones de envío de la dirección elegida (pre-cotizadas en el server).
  const options = shippingByAddress[selectedAddressId] ?? null;
  const deliveryQuote = options?.delivery ?? fallbackShipping;
  const branchQuote = options?.branch ?? null;
  const branches = options?.branches ?? [];

  const pickup = pickupQuote();
  const activeQuote: ShippingQuote =
    method === 'pickup'
      ? pickup
      : method === 'branch'
        ? (branchQuote ?? deliveryQuote)
        : deliveryQuote;

  const needsAddressForDelivery = method !== 'pickup' && addresses.length === 0;
  const branchNotChosen = method === 'branch' && !selectedBranchCode;

  function handleAddressSelect(id: string) {
    setSelectedAddressId(id);
    // Las sucursales son por provincia → al cambiar de dirección, reset.
    setSelectedBranchCode('');
  }

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
            deliveryQuote={deliveryQuote}
            branchQuote={branchQuote}
            branches={branches}
            selectedBranchCode={selectedBranchCode}
            onBranchChange={setSelectedBranchCode}
            pickupAddress={pickupAddress}
          />

          {method !== 'pickup' && (
            <div>
              <h2 className="text-foreground font-serif text-xl font-medium tracking-tight">
                {method === 'branch' ? 'Tus datos de envío' : 'Dirección de envío'}
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
                    defaultAddressId={defaultAddressId}
                    onSelect={handleAddressSelect}
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
            disabled={
              needsAddressForDelivery || branchNotChosen || cart.hasIssues
            }
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
