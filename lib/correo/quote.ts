import 'server-only';
import { getCorreoToken, invalidateCorreoToken } from './auth';
import {
  DEFAULT_PACKAGE,
  EXTRA_ITEM_WEIGHT,
  getCorreoConfig,
  normalizePostalCode,
} from './constants';
import type {
  CorreoDeliveredType,
  CorreoRateRequest,
  CorreoRatesResponse,
} from './types';

export type CorreoQuoteInput = {
  /** CP destino del cliente (acepta CPA o 4 dígitos; lo normalizamos). */
  postalCodeDestination: string;
  /** "D" domicilio, "S" sucursal. Omitir = ambas en una sola request. */
  deliveredType?: CorreoDeliveredType;
  /** Cantidad de anteojos en el envío (para estimar peso). Default 1. */
  itemCount?: number;
};

/** Peso del paquete según la cantidad de anteojos. */
function estimateWeightGrams(itemCount: number): number {
  const extras = Math.max(0, itemCount - 1);
  return DEFAULT_PACKAGE.weight + extras * EXTRA_ITEM_WEIGHT;
}

/**
 * Llama POST /rates y devuelve la cotización cruda de MiCorreo. Reintenta
 * una vez si el token expiró (401). Lanza en cualquier otro error — el
 * caller (`resolveDeliveryQuote`) hace el fallback a tabla por zonas.
 */
export async function fetchCorreoRates(
  input: CorreoQuoteInput,
): Promise<CorreoRatesResponse> {
  const { baseUrl, customerId, postalCodeOrigin } = getCorreoConfig();

  const dest = normalizePostalCode(input.postalCodeDestination);
  if (!dest) {
    throw new Error(
      `MiCorreo: CP destino inválido ("${input.postalCodeDestination}").`,
    );
  }

  const body: CorreoRateRequest = {
    customerId,
    postalCodeOrigin: normalizePostalCode(postalCodeOrigin),
    postalCodeDestination: dest,
    ...(input.deliveredType ? { deliveredType: input.deliveredType } : {}),
    dimensions: {
      weight: estimateWeightGrams(input.itemCount ?? 1),
      height: DEFAULT_PACKAGE.height,
      width: DEFAULT_PACKAGE.width,
      length: DEFAULT_PACKAGE.length,
    },
  };

  const doFetch = async () => {
    const token = await getCorreoToken();
    return fetch(`${baseUrl}/rates`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
  };

  let res = await doFetch();
  if (res.status === 401) {
    invalidateCorreoToken();
    res = await doFetch();
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`MiCorreo /rates ${res.status}: ${detail}`.trim());
  }

  return (await res.json()) as CorreoRatesResponse;
}
