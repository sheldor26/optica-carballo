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
import { cartRequiresPrescription } from '@/lib/checkout/prescription';
import {
  pickupQuote,
  type ShippingMethod,
  type ShippingQuote,
} from '@/lib/shipping';
import type { Address } from '@/lib/addresses/types';
import type { ResolvedCart } from '@/lib/cart/types';
import type { CorreoBranch } from '@/lib/correo/types';
import type { PrescriptionCookie } from '@/lib/prescription-cookie/types';

/** `esf`/`cil` con signo explícito (`+1.25`, `-2.00`) — convención óptica. */
function formatSigned(n: number): string {
  return n === 0 ? '0.00' : `${n > 0 ? '+' : ''}${n.toFixed(2)}`;
}

function formatEye(eye: PrescriptionCookie['od']): string {
  const parts = [`ESF ${formatSigned(eye.esf ?? 0)}`];
  if (eye.cil) parts.push(`CIL ${formatSigned(eye.cil)}`);
  if (eye.eje) parts.push(`EJE ${eye.eje}°`);
  if (eye.add) parts.push(`ADD +${eye.add.toFixed(2)}`);
  return parts.join(' · ');
}

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
  prescription,
  initialDni,
}: {
  cart: ResolvedCart;
  addresses: Address[];
  shippingByAddress: Record<string, ShippingOptions>;
  defaultAddressId: string | null;
  fallbackShipping: ShippingQuote;
  pickupAddress: string | null;
  /** null si el carrito no tiene productos de receta, o si sí tiene pero
   * todavía no se cargó ninguna (bloquea "Confirmar pedido" en ese caso). */
  prescription: PrescriptionCookie | null;
  /** DNI/CUIT guardado de una compra anterior, si lo hay — prellenar. */
  initialDni: string | null;
}) {
  const [state, formAction] = useActionState(submitCheckout, initialState);
  const [method, setMethod] = useState<ShippingMethod>('delivery');
  const [dni, setDni] = useState(initialDni ?? '');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    defaultAddressId ?? addresses[0]?.id ?? '',
  );
  const [selectedBranchCode, setSelectedBranchCode] = useState<string>('');
  // Estable mientras el componente esté montado — el mismo submit (incluso
  // reintentado por un doble-click) manda la misma key, así la RPC
  // `create_order_from_cart` no duplica la orden (hallazgo #8, audit
  // 2026-08-01). Se re-genera solo si el usuario recarga la página.
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const needsPrescription = cartRequiresPrescription(cart) && !prescription;

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
  const dniInvalid = !/^\d{7,11}$/.test(dni.replace(/[.\-\s]/g, ''));

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
        <input type="hidden" name="idempotency_key" value={idempotencyKey} />
        <div className="space-y-8">
          <div>
            <h2 className="text-foreground font-serif text-xl font-medium tracking-tight">
              Datos de facturación
            </h2>
            <div className="mt-4">
              <label
                htmlFor="customer_dni"
                className="text-foreground mb-1.5 block text-sm font-medium"
              >
                DNI o CUIT
              </label>
              <input
                id="customer_dni"
                name="customer_dni"
                type="text"
                inputMode="numeric"
                required
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="Ej: 30123456 o 20301234568"
                className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring w-full max-w-xs rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
              />
              <p className="text-muted-foreground mt-1.5 text-xs">
                Lo necesitamos para tu factura.
              </p>
            </div>
          </div>

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

          {cartRequiresPrescription(cart) && (
            <div>
              <h2 className="text-foreground font-serif text-xl font-medium tracking-tight">
                Receta
              </h2>
              {prescription ? (
                <div className="border-border/60 bg-muted/30 mt-4 rounded-xl border p-4 text-sm">
                  <p className="text-foreground font-medium">
                    Receta cargada
                  </p>
                  <p className="text-muted-foreground mt-1">
                    OD: {formatEye(prescription.od)}
                  </p>
                  <p className="text-muted-foreground">
                    OI: {formatEye(prescription.oi)}
                  </p>
                  {prescription.dnp && (
                    <p className="text-muted-foreground">
                      DNP: {prescription.dnp}mm
                    </p>
                  )}
                  <Link
                    href="/cargar-receta"
                    className="text-muted-foreground mt-2 inline-block text-xs underline-offset-2 hover:underline"
                  >
                    Cambiar receta
                  </Link>
                </div>
              ) : (
                <div className="border-border mt-4 rounded-xl border border-dashed p-6 text-center">
                  <h3 className="text-foreground text-sm font-medium">
                    Necesitás cargar tu receta
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Tu carrito tiene un producto de anteojos de receta — no
                    podemos armar tus lentes sin ella. Cargala y volvé a esta
                    página para confirmar tu pedido.
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
                    <Button asChild>
                      <Link href="/cargar-receta">Cargar a mano</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/lector-de-receta">Escanear con IA</Link>
                    </Button>
                  </div>
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
              needsAddressForDelivery ||
              branchNotChosen ||
              cart.hasIssues ||
              needsPrescription ||
              dniInvalid
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
