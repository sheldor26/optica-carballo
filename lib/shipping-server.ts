import 'server-only';
import {
  calculateShipping,
  FREE_SHIPPING_THRESHOLD_CENTS,
  type ShippingQuote,
} from './shipping';
import { isCorreoConfigured } from './correo/constants';
import { fetchCorreoRates } from './correo/quote';
import type { CorreoDeliveredType, CorreoRate } from './correo/types';

/** El más barato de un tipo de entrega ("D" domicilio, "S" sucursal). */
function cheapestRate(
  rates: CorreoRate[],
  type: CorreoDeliveredType,
): CorreoRate | undefined {
  return rates
    .filter((r) => r.deliveredType === type && Number.isFinite(r.price))
    .sort((a, b) => a.price - b.price)[0];
}

/** Convierte una tarifa cruda de MiCorreo en ShippingQuote (con free shipping). */
function rateToQuote(
  rate: CorreoRate,
  subtotalCents: number,
  fallback: ShippingQuote,
): ShippingQuote {
  const baseRate = Math.round(rate.price * 100); // pesos → centavos
  const isFree = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
  return {
    method: 'delivery',
    // Zona/label derivados de la provincia para registro; el costo es de la API.
    zone: fallback.zone,
    zoneLabel: fallback.zoneLabel,
    cents: isFree ? 0 : baseRate,
    isFree,
    originalCents: isFree ? baseRate : null,
    centsToFreeShipping: isFree
      ? 0
      : Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents),
  };
}

/**
 * Cotiza envío a DOMICILIO y a SUCURSAL del Correo en una sola request a
 * /rates (sin deliveredType devuelve ambos). Si la API no está configurada,
 * no hay CP o falla → domicilio cae a la tabla por zonas y sucursal queda
 * en null (no ofrecemos sucursal sin API). El checkout nunca se rompe.
 */
export async function resolveShippingQuotes(args: {
  subtotalCents: number;
  /** Opcional: la cotización real de Correo (/rates) usa SOLO el CP. La
   * provincia solo afina el fallback por zonas si la API falla. Sin provincia
   * → zona conservadora (no underprice). */
  provinceName?: string | null;
  postalCode?: string | null;
  itemCount?: number;
}): Promise<{ delivery: ShippingQuote; branch: ShippingQuote | null }> {
  const fallback = calculateShipping({
    subtotalCents: args.subtotalCents,
    provinceName: args.provinceName ?? '',
  });

  if (!isCorreoConfigured() || !args.postalCode) {
    return { delivery: fallback, branch: null };
  }

  try {
    const data = await fetchCorreoRates({
      postalCodeDestination: args.postalCode,
      itemCount: args.itemCount,
    });
    const dRate = cheapestRate(data.rates, 'D');
    const sRate = cheapestRate(data.rates, 'S');
    return {
      delivery: dRate
        ? rateToQuote(dRate, args.subtotalCents, fallback)
        : fallback,
      branch: sRate ? rateToQuote(sRate, args.subtotalCents, fallback) : null,
    };
  } catch (err) {
    console.error(
      '[shipping] cotización MiCorreo falló, uso tabla por zonas:',
      err instanceof Error ? err.message : err,
    );
    return { delivery: fallback, branch: null };
  }
}

/**
 * Cotización de envío a DOMICILIO (atajo de `resolveShippingQuotes`).
 * Mantiene la firma usada por el checkout en Fase 1.
 */
export async function resolveDeliveryQuote(args: {
  subtotalCents: number;
  provinceName?: string | null;
  postalCode?: string | null;
  itemCount?: number;
}): Promise<ShippingQuote> {
  return (await resolveShippingQuotes(args)).delivery;
}
