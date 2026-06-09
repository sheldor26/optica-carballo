'use client';

import { useEffect, useRef, useState } from 'react';
import { Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPriceCents } from '@/lib/format/currency';
import { type ShippingQuote } from '@/lib/shipping';

type Props = {
  subtotalCents: number;
  itemCount?: number;
  /** Pre-cargados de la dirección registrada del usuario (si está logueado). */
  initialProvince?: string | null;
  initialPostalCode?: string | null;
};

type ApiQuotes = { delivery: ShippingQuote; branch: ShippingQuote | null };

/** 4 dígitos de un CP/CPA (B1900ABC → 1900). '' si no hay. */
function cp4(raw: string): string {
  return raw.match(/\d{4}/)?.[0] ?? '';
}

/**
 * Mini-widget del carrito: el cliente elige provincia y, si quiere el costo
 * exacto, ingresa su CP (4 dígitos) → cotización REAL de Correo (domicilio +
 * sucursal) vía /api/shipping/quote. Sin CP, muestra la estimación por zona
 * (tabla, instantánea). Si el usuario está logueado, pre-cargamos provincia + CP
 * de su dirección registrada.
 */
export function ShippingCalculator({
  subtotalCents,
  itemCount,
  initialProvince,
  initialPostalCode,
}: Props) {
  // La provincia (si el user logueado la tiene en su dirección guardada) solo
  // afina el fallback por zonas; NO es requerida — Correo cotiza con el CP solo.
  const province = initialProvince ?? '';
  const [cp, setCp] = useState<string>(cp4(initialPostalCode ?? ''));
  const [apiQuotes, setApiQuotes] = useState<ApiQuotes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function calculateExact() {
    if (cp4(cp).length !== 4) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/shipping/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provinceName: province || undefined,
          postalCode: cp4(cp),
          subtotalCents,
          itemCount: itemCount ?? 1,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data?.hint ?? 'No pudimos cotizar ese CP. Probá de nuevo.');
        setApiQuotes(null);
      } else {
        setApiQuotes({ delivery: data.delivery, branch: data.branch });
      }
    } catch {
      setError('No pudimos cotizar ahora. Probá de nuevo en un momento.');
      setApiQuotes(null);
    } finally {
      setLoading(false);
    }
  }

  // Auto-cotizar al montar si vienen provincia + CP de la dirección del user.
  const autoDone = useRef(false);
  useEffect(() => {
    if (autoDone.current) return;
    if (cp4(cp).length === 4) {
      autoDone.current = true;
      void calculateExact();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="border-border/60 bg-background mt-4 rounded-xl border p-4">
      <p className="text-foreground inline-flex items-center gap-2 text-sm font-semibold">
        <Truck className="text-brand size-4" />
        Calculá tu envío
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        Ingresá tu código postal (4 dígitos) y te damos el costo exacto de Correo.
      </p>

      <div className="mt-3 flex gap-2">
        <input
          inputMode="numeric"
          value={cp}
          onChange={(e) => {
            setCp(e.target.value);
            setApiQuotes(null);
            setError(null);
          }}
          placeholder="Código postal (4 díg.)"
          aria-label="Código postal"
          className={cn(
            'border-border bg-background text-foreground w-full rounded-md border px-3 py-2 text-sm',
            'focus-visible:border-foreground/40 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
          )}
        />
        <button
          type="button"
          onClick={calculateExact}
          disabled={cp4(cp).length !== 4 || loading}
          className={cn(
            'bg-foreground text-background shrink-0 rounded-md px-3 py-2 text-sm font-medium',
            'disabled:opacity-40',
          )}
        >
          {loading ? '…' : 'Calcular'}
        </button>
      </div>

      {error && <p className="text-destructive mt-2 text-xs">{error}</p>}

      {/* Resultado EXACTO (API Correo) */}
      {apiQuotes && (
        <div className="border-border/60 mt-3 space-y-2 rounded-lg border p-3 text-sm">
          <QuoteRow label="A domicilio" quote={apiQuotes.delivery} />
          {apiQuotes.branch && (
            <QuoteRow label="A sucursal del Correo" quote={apiQuotes.branch} />
          )}
          {!apiQuotes.delivery.isFree &&
            apiQuotes.delivery.centsToFreeShipping > 0 && (
              <p className="text-muted-foreground text-xs">
                Sumá {formatPriceCents(apiQuotes.delivery.centsToFreeShipping)}{' '}
                para envío gratis.
              </p>
            )}
          <p className="text-muted-foreground/70 text-[11px]">
            Costo real de Correo Argentino para tu CP.
          </p>
        </div>
      )}

    </div>
  );
}

function QuoteRow({ label, quote }: { label: string; quote: ShippingQuote }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium tabular-nums">
        {quote.isFree ? (
          <span className="text-emerald-700 dark:text-emerald-400">Gratis</span>
        ) : (
          formatPriceCents(quote.cents)
        )}
      </span>
    </div>
  );
}
