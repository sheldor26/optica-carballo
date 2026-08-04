import 'server-only';
import { getCorreoToken, invalidateCorreoToken } from './auth';
import { getCorreoConfig, normalizePostalCode, PRODUCT_TYPE } from './constants';
import { provinceCodeFor } from './provinces';
import type {
  CorreoApiAddress,
  CorreoImportRequest,
  CorreoImportResponse,
  CorreoSender,
  CorreoTrackingResult,
} from './types';

/**
 * FASE 3 — Alta de envío en MiCorreo (`POST /shipping/import`).
 *
 * ⚠️ ESTADO: construido contra el manual v2025-01-14, **pendiente de validar
 * en el ambiente de TEST** (`apitest.correoargentino.com.ar`). NO usar contra
 * producción hasta validar — el import en prod genera un envío real
 * (preimposición). Las credenciales de test son DISTINTAS a las de prod.
 *
 * ⚠️ TRACKING: el manual muestra que el import responde SOLO `{createdAt}` — NO
 * el número de seguimiento. El nº se ve en el panel MiCorreo (por `orderNumber`)
 * o en la etiqueta. El endpoint `/shipping/tracking` pide `shippingId` (que en
 * los ejemplos == trackingNumber, o sea hay que tenerlo ya). HIPÓTESIS A VALIDAR
 * EN TEST: que `/shipping/tracking` acepte NUESTRO `extOrderId`/`orderNumber` y
 * así devuelva el trackingNumber → permitiría capturarlo automático. Si no,
 * el nº se carga manual desde el panel. `fetchCorreoTracking` está acá justo
 * para probar esa hipótesis en test.
 */

/** Datos del remitente (la óptica) leídos de env. MiCorreo puede usar los de la
 * cuenta si van null, pero hay errores tipo "El codigo Postal del emisor debe
 * tener valor" → los mandamos explícitos. */
// Fallbacks hardcodeados de la dirección real del local — mismo patrón y mismos
// valores que getBusinessInfo() en lib/site/business.ts. Confirmado en producción
// (2026-08-04, primera venta real) que las env vars NEXT_PUBLIC_BUSINESS_ADDRESS_*
// no están seteadas en Vercel; sin fallback, MiCorreo recibía un remitente con
// streetName/city/provinceCode en null y tiraba 500 sin mensaje.
function buildSender(): CorreoSender {
  const e = process.env;
  const street = e.NEXT_PUBLIC_BUSINESS_ADDRESS_STREET || 'Av. Lavalle 2686';
  const city = e.NEXT_PUBLIC_BUSINESS_ADDRESS_LOCALITY || 'Gob. Virasoro';
  const provinceName = e.NEXT_PUBLIC_BUSINESS_ADDRESS_REGION || 'Corrientes';
  return {
    name: e.NEXT_PUBLIC_SITE_NAME ?? 'Óptica Carballo',
    phone: e.NEXT_PUBLIC_BUSINESS_PHONE ?? null,
    cellPhone: e.NEXT_PUBLIC_BUSINESS_PHONE ?? null,
    email: process.env.RESEND_FROM_EMAIL?.match(/<(.+)>/)?.[1] ?? null,
    originAddress: {
      streetName: street,
      streetNumber: null, // la calle de env ya incluye altura; ajustar tras test si separa
      floor: null,
      apartment: null,
      city,
      provinceCode: provinceCodeFor(provinceName),
      postalCode: normalizePostalCode(
        e.NEXT_PUBLIC_BUSINESS_ADDRESS_POSTAL || e.BUSINESS_POSTAL_CODE || '3342',
      ),
    },
  };
}

/** Dirección de destino para envío a DOMICILIO (D). */
export type ImportDestinationAddress = {
  streetName: string;
  streetNumber: string;
  floor?: string | null;
  apartment?: string | null;
  city: string;
  /** Nombre de provincia como en `lib/addresses` (lo convertimos a código). */
  provinceName: string;
  postalCode: string;
};

export type ImportShipmentInput = {
  /** Id interno de la orden (idempotencia: re-importar el mismo extOrderId da error). */
  extOrderId: string;
  /** Nº visible en el panel MiCorreo (ej. "OC-2026-00007"). */
  orderNumber: string;
  recipient: { name: string; email: string; phone?: string | null };
  /** "D" domicilio (requiere `address`) | "S" sucursal (requiere `agencyCode`). */
  deliveryType: 'D' | 'S';
  /** Solo D. */
  address?: ImportDestinationAddress;
  /** Solo S — código de sucursal de destino (de /agencies). */
  agencyCode?: string;
  /** Peso total del paquete en gramos. */
  weightGrams: number;
  /** Valor declarado en pesos (típicamente el total de la orden). */
  declaredValueArs: number;
  /** Dimensiones en cm (default del paquete si se omite). */
  dims?: { height: number; width: number; length: number };
};

export type ImportShipmentResult =
  | { ok: true; createdAt: string; alreadyImported?: boolean }
  | { ok: false; error: string };

/**
 * Da de alta un envío en MiCorreo. Devuelve `{ok:true, createdAt}` o un error
 * legible. Trata "La orden ya fue importada con anterioridad" como
 * `alreadyImported` (idempotencia — no es un fallo a reintentar).
 */
export async function importShipment(
  input: ImportShipmentInput,
): Promise<ImportShipmentResult> {
  const { baseUrl, customerId } = getCorreoConfig();
  if (!baseUrl || !customerId) {
    return { ok: false, error: 'MiCorreo no configurado (baseUrl/customerId).' };
  }

  const isBranch = input.deliveryType === 'S';

  if (isBranch && !input.agencyCode) {
    return { ok: false, error: 'Envío a sucursal sin código de sucursal (agency).' };
  }
  if (!isBranch && !input.address) {
    return { ok: false, error: 'Envío a domicilio sin dirección de destino.' };
  }

  // Para sucursal (S), MiCorreo espera `address` en null — mandar un objeto
  // con todos los campos en null (lo que hacíamos antes) tira 500 sin mensaje.
  // Confirmado empíricamente contra prod con extOrderId de diagnóstico
  // (2026-08-04): null literal / key omitida → 200; objeto all-null → 500.
  let shippingAddress: CorreoApiAddress | null = null;
  if (!isBranch && input.address) {
    const provinceCode = provinceCodeFor(input.address.provinceName);
    if (!provinceCode) {
      return {
        ok: false,
        error: `Provincia no reconocida por MiCorreo: "${input.address.provinceName}".`,
      };
    }
    shippingAddress = {
      streetName: input.address.streetName,
      streetNumber: input.address.streetNumber,
      floor: input.address.floor ?? '',
      apartment: input.address.apartment ?? '',
      city: input.address.city,
      provinceCode,
      postalCode: normalizePostalCode(input.address.postalCode),
    };
  }

  const body: CorreoImportRequest = {
    customerId,
    extOrderId: input.extOrderId,
    orderNumber: input.orderNumber,
    sender: buildSender(),
    recipient: {
      name: input.recipient.name,
      phone: input.recipient.phone ?? '',
      cellPhone: input.recipient.phone ?? '',
      email: input.recipient.email,
    },
    shipping: {
      deliveryType: input.deliveryType,
      agency: isBranch ? (input.agencyCode ?? null) : null,
      address: shippingAddress,
      productType: PRODUCT_TYPE,
      weight: Math.round(input.weightGrams),
      declaredValue: input.declaredValueArs,
      height: Math.round(input.dims?.height ?? 10),
      length: Math.round(input.dims?.length ?? 15),
      width: Math.round(input.dims?.width ?? 20),
    },
  };

  const doFetch = async () => {
    const token = await getCorreoToken();
    return fetch(`${baseUrl}/shipping/import`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
  };

  let res: Response;
  try {
    res = await doFetch();
    if (res.status === 401) {
      invalidateCorreoToken();
      res = await doFetch();
    }
  } catch (err) {
    return {
      ok: false,
      error: `MiCorreo /shipping/import network: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  const raw = await res.text().catch(() => '');

  if (!res.ok) {
    console.error('[MiCorreo import FAILED]', JSON.stringify({ status: res.status, raw }));
    // 402 con "ya importada" = idempotencia, no es fallo real.
    if (/ya fue importada/i.test(raw)) {
      return { ok: true, createdAt: '', alreadyImported: true };
    }
    return { ok: false, error: `MiCorreo /shipping/import ${res.status}: ${raw}`.trim() };
  }

  try {
    const data = JSON.parse(raw) as CorreoImportResponse;
    return { ok: true, createdAt: data.createdAt ?? '' };
  } catch {
    // Respuesta OK pero no-JSON: lo tratamos como éxito (el alta entró).
    return { ok: true, createdAt: '' };
  }
}

/**
 * Consulta `/shipping/tracking`. EXPERIMENTAL — sirve para validar EN TEST si
 * el endpoint acepta nuestro `extOrderId`/`orderNumber` (y devuelve el
 * `trackingNumber`), o si exige el nº de seguimiento real. Según ese resultado
 * decidimos si el tracking se captura automático o se carga manual.
 */
export async function fetchCorreoTracking(
  shippingId: string,
): Promise<{ ok: true; data: CorreoTrackingResult } | { ok: false; error: string }> {
  const { baseUrl } = getCorreoConfig();
  if (!baseUrl) return { ok: false, error: 'MiCorreo no configurado.' };

  // ⚠️ El manual muestra `GET /shipping/tracking` con BODY (`curl -X GET -d`),
  // pero `fetch`/undici PROHÍBE body en GET ("Request with GET/HEAD method
  // cannot have body" — verificado en test). Mandamos `shippingId` como query
  // param. Si el server exigiera body, habría que usar el http nativo de Node;
  // se valida cuando tengamos un customerId de test (ver CURRENT_STATE).
  const doFetch = async () => {
    const token = await getCorreoToken();
    const url = new URL(`${baseUrl}/shipping/tracking`);
    url.searchParams.set('shippingId', shippingId);
    return fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
  };

  let res: Response;
  try {
    res = await doFetch();
    if (res.status === 401) {
      invalidateCorreoToken();
      res = await doFetch();
    }
  } catch (err) {
    return {
      ok: false,
      error: `MiCorreo /shipping/tracking network: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  const raw = await res.text().catch(() => '');
  if (!res.ok) {
    return { ok: false, error: `MiCorreo /shipping/tracking ${res.status}: ${raw}`.trim() };
  }

  try {
    const json = JSON.parse(raw);
    // El manual devuelve a veces un array, a veces un objeto. Normalizamos.
    const data = (Array.isArray(json) ? json[0] : json) as CorreoTrackingResult;
    return { ok: true, data };
  } catch {
    return { ok: false, error: `MiCorreo /shipping/tracking: respuesta no-JSON: ${raw}`.trim() };
  }
}
