/**
 * Cálculo de costo de envío para el checkout V1.
 *
 * V1 — Tabla por zonas hardcoded. Defaults conservadores hasta que el
 * founder pase tarifas reales del operador logístico contratado
 * (Andreani o Correo Argentino vía PAQ.AR). Editar los valores acá +
 * redeploy = nuevos precios al instante.
 *
 * Futuro — Cuando el founder tenga `agreement` + `API-Key` de Correo
 * Argentino (o equivalente), se crea `lib/correo/quote.ts` con un
 * `calculateShippingViaApi()` que reemplace esta función en `checkout/
 * actions.ts`. La interfaz `ShippingQuote` se mantiene igual, así el
 * resto del flow no cambia.
 *
 * Importante: PAQ.AR API NO tiene endpoint de cotización (verificado
 * con el manual oficial v2.0). El precio sale del contrato comercial
 * directo. Para mostrar precios dinámicos sin contrato, hace falta
 * scraping o un proveedor con quote API (Andreani sí lo tiene).
 */

import { AR_PROVINCES, type ArProvince } from '@/lib/addresses/constants';

// ============================================================================
// Constantes editables (mover a env vars o admin UI si crece la complejidad)
// ============================================================================

/** Subtotal del cart (en centavos) a partir del cual el envío es gratis. */
export const FREE_SHIPPING_THRESHOLD_CENTS = 80_000_00; // $80.000

export type ShippingMethod = 'delivery' | 'pickup';

export type ShippingZone =
  | 'caba_gba'
  | 'interior_cercano'
  | 'interior_lejano'
  | 'patagonia'
  | 'pickup';

/** Tarifa flat por zona (en centavos). `pickup` siempre = 0 (gratis). */
export const SHIPPING_RATES_BY_ZONE: Record<ShippingZone, number> = {
  caba_gba: 2_500_00, // $2.500 — CABA + GBA
  interior_cercano: 4_500_00, // $4.500 — Litoral + Córdoba + Mendoza + Entre Ríos + La Pampa
  interior_lejano: 6_500_00, // $6.500 — NEA + NOA + Cuyo
  patagonia: 9_500_00, // $9.500 — Patagonia (incluye Tierra del Fuego)
  pickup: 0,
};

// ============================================================================
// Mapeo provincia → zona
// ============================================================================

const PROVINCE_TO_ZONE: Record<ArProvince, ShippingZone> = {
  'Ciudad Autónoma de Buenos Aires': 'caba_gba',
  'Buenos Aires': 'caba_gba',
  'Córdoba': 'interior_cercano',
  'Santa Fe': 'interior_cercano',
  'Mendoza': 'interior_cercano',
  'Entre Ríos': 'interior_cercano',
  'La Pampa': 'interior_cercano',
  'Tucumán': 'interior_lejano',
  'Salta': 'interior_lejano',
  'Jujuy': 'interior_lejano',
  'Misiones': 'interior_lejano',
  'Corrientes': 'interior_lejano',
  'Chaco': 'interior_lejano',
  'Formosa': 'interior_lejano',
  'La Rioja': 'interior_lejano',
  'Catamarca': 'interior_lejano',
  'Santiago del Estero': 'interior_lejano',
  'San Luis': 'interior_lejano',
  'San Juan': 'interior_lejano',
  'Neuquén': 'patagonia',
  'Río Negro': 'patagonia',
  'Chubut': 'patagonia',
  'Santa Cruz': 'patagonia',
  'Tierra del Fuego': 'patagonia',
};

const ZONE_LABELS: Record<ShippingZone, string> = {
  caba_gba: 'CABA y Gran Buenos Aires',
  interior_cercano: 'Centro / Litoral',
  interior_lejano: 'NEA / NOA / Cuyo',
  patagonia: 'Patagonia',
  pickup: 'Retiro en local',
};

// ============================================================================
// API pública
// ============================================================================

export type ShippingQuote = {
  method: ShippingMethod;
  zone: ShippingZone;
  zoneLabel: string;
  /** Costo en centavos. 0 si el subtotal supera el threshold de free shipping, o si method=pickup. */
  cents: number;
  /** true cuando el subtotal disparó el envío gratis, o cuando es pickup. */
  isFree: boolean;
  /** Costo "tachado" cuando isFree=true (para mostrar el ahorro). null si no aplica. */
  originalCents: number | null;
  /** Cuánto le falta al user para llegar al free shipping. 0 si ya llegó o es pickup. */
  centsToFreeShipping: number;
};

/**
 * Cuando el `provinceName` no matchea ninguna provincia AR conocida,
 * usamos `interior_lejano` como fallback conservador (no underprice). El
 * caller debería validar antes de llegar acá — esto es defensa-en-
 * profundidad para no romper el checkout.
 */
function resolveZone(provinceName: string): ShippingZone {
  if ((AR_PROVINCES as readonly string[]).includes(provinceName)) {
    return PROVINCE_TO_ZONE[provinceName as ArProvince];
  }
  return 'interior_lejano';
}

/**
 * Cotiza el envío para un subtotal + dirección. Pura — no toca DB, no
 * hace fetch a APIs. Cuando se integre API real, este helper se mueve a
 * `lib/correo/quote.ts` y mantiene la misma firma.
 */
export function calculateShipping(args: {
  subtotalCents: number;
  provinceName: string;
}): ShippingQuote {
  const zone = resolveZone(args.provinceName);
  const baseRate = SHIPPING_RATES_BY_ZONE[zone];
  const isFree = args.subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
  const centsToFreeShipping = isFree
    ? 0
    : FREE_SHIPPING_THRESHOLD_CENTS - args.subtotalCents;

  return {
    method: 'delivery',
    zone,
    zoneLabel: ZONE_LABELS[zone],
    cents: isFree ? 0 : baseRate,
    isFree,
    originalCents: isFree ? baseRate : null,
    centsToFreeShipping,
  };
}

/**
 * Quote para retiro en local. Siempre gratis. No depende de provincia ni
 * subtotal. El caller maneja la UI para mostrar la dirección del local.
 */
export function pickupQuote(): ShippingQuote {
  return {
    method: 'pickup',
    zone: 'pickup',
    zoneLabel: ZONE_LABELS.pickup,
    cents: 0,
    isFree: true,
    originalCents: null,
    centsToFreeShipping: 0,
  };
}
