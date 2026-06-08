'use client';

import { Home, Store, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPriceCents } from '@/lib/format/currency';
import type { ShippingMethod, ShippingQuote } from '@/lib/shipping';
import type { CorreoBranch } from '@/lib/correo/types';

type Props = {
  selected: ShippingMethod;
  onChange: (method: ShippingMethod) => void;
  deliveryQuote: ShippingQuote;
  /** Cotización de sucursal del Correo. null = no ofrecer la opción. */
  branchQuote: ShippingQuote | null;
  branches: CorreoBranch[];
  selectedBranchCode: string;
  onBranchChange: (code: string) => void;
  pickupAddress: string | null;
  /** true mientras se re-cotiza al cambiar de dirección. */
  loading?: boolean;
};

function priceLabel(quote: ShippingQuote): string {
  return quote.isFree ? 'Gratis' : formatPriceCents(quote.cents);
}

export function ShippingMethodSelector({
  selected,
  onChange,
  deliveryQuote,
  branchQuote,
  branches,
  selectedBranchCode,
  onBranchChange,
  pickupAddress,
  loading = false,
}: Props) {
  const showBranch = branchQuote !== null;

  return (
    <div>
      <h2 className="text-foreground font-serif text-xl font-medium tracking-tight">
        Cómo lo querés recibir
      </h2>
      <div
        className={cn(
          'mt-4 grid gap-3',
          showBranch ? 'sm:grid-cols-3' : 'sm:grid-cols-2',
        )}
        role="radiogroup"
        aria-label="Método de envío"
      >
        <MethodOption
          icon={Home}
          title="Envío a domicilio"
          subtitle={deliveryQuote.zoneLabel}
          price={loading ? '...' : priceLabel(deliveryQuote)}
          selected={selected === 'delivery'}
          onClick={() => onChange('delivery')}
        />
        {showBranch && (
          <MethodOption
            icon={Building2}
            title="Sucursal del Correo"
            subtitle="Retirás más barato"
            price={loading ? '...' : priceLabel(branchQuote)}
            selected={selected === 'branch'}
            onClick={() => onChange('branch')}
          />
        )}
        <MethodOption
          icon={Store}
          title="Retiro en local"
          subtitle={pickupAddress ?? 'Coordinamos por WhatsApp'}
          price="Gratis"
          selected={selected === 'pickup'}
          onClick={() => onChange('pickup')}
        />
      </div>

      {/* Selector de sucursal del Correo */}
      {selected === 'branch' && showBranch && (
        <div className="border-border/60 bg-muted/20 mt-4 rounded-lg border p-4">
          <label
            htmlFor="agency_code"
            className="text-foreground block text-sm font-medium"
          >
            Elegí dónde retirar
          </label>
          {branches.length > 0 ? (
            <select
              id="agency_code"
              name="agency_code"
              value={selectedBranchCode}
              onChange={(e) => onBranchChange(e.target.value)}
              className="border-border bg-background text-foreground focus:border-foreground mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none"
              required
            >
              <option value="" disabled>
                Seleccioná una sucursal…
              </option>
              {branches.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name} — {b.address}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-muted-foreground mt-2 text-xs">
              No encontramos sucursales en esa provincia. Probá envío a
              domicilio o coordinamos por WhatsApp.
            </p>
          )}
          {/* Snapshot del nombre de la sucursal para guardar en la orden. */}
          <input
            type="hidden"
            name="agency_name"
            value={
              branches.find((b) => b.code === selectedBranchCode)
                ? `${branches.find((b) => b.code === selectedBranchCode)!.name} — ${branches.find((b) => b.code === selectedBranchCode)!.address}`
                : ''
            }
          />
          <p className="text-muted-foreground mt-2 text-xs">
            Te avisamos por WhatsApp cuando tu pedido esté en la sucursal.
          </p>
        </div>
      )}

      <input type="hidden" name="shipping_method" value={selected} />

      {selected === 'pickup' && pickupAddress && (
        <div className="border-brand/30 bg-brand/5 mt-4 rounded-lg border p-4 text-sm">
          <p className="text-foreground">
            <strong>Te esperamos en:</strong> {pickupAddress}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Te avisamos por WhatsApp cuando tu pedido esté listo para retirar.
          </p>
        </div>
      )}
      {selected === 'pickup' && !pickupAddress && (
        <p className="text-muted-foreground mt-3 text-xs">
          Una vez confirmada la compra, te contactamos por WhatsApp para
          coordinar el retiro.
        </p>
      )}
    </div>
  );
}

function MethodOption({
  icon: Icon,
  title,
  subtitle,
  price,
  selected,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  price: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        'group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
        selected
          ? 'border-foreground bg-foreground/[0.02] shadow-sm'
          : 'border-border/60 hover:border-foreground/40 hover:bg-muted/30',
      )}
    >
      <div
        className={cn(
          'mt-0.5 flex size-9 items-center justify-center rounded-full transition-colors',
          selected ? 'bg-foreground text-background' : 'bg-muted text-foreground/70',
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="flex-1">
        <p className="text-foreground text-sm font-semibold">{title}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">{subtitle}</p>
        <p className="text-foreground mt-2 text-sm font-medium tabular-nums">
          {price}
        </p>
      </div>
      <div
        aria-hidden="true"
        className={cn(
          'mt-1 size-4 shrink-0 rounded-full border-2 transition-colors',
          selected ? 'border-foreground bg-foreground' : 'border-border',
        )}
      >
        {selected && (
          <div className="bg-background m-[3px] size-1.5 rounded-full" />
        )}
      </div>
    </button>
  );
}
