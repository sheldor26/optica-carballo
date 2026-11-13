/**
 * Cálculo de costo de envío — tabla por zonas (FALLBACK).
 *
 * El operador de envíos es **Correo Argentino** (MiCorreo). La cotización
 * real corre server-side en `lib/correo/` + `lib/shipping-server.ts`
 * (API /rates de MiCorreo, a domicilio o sucursal). Esta tabla por zonas
 * queda como **fallback** cuando la API no está configurada o falla, y
 * para los estimadores client-side (carrito + PDP), donde no se puede
 * llamar a la API secreta. Editar los valores acá + redeploy = nuevos
 * precios al instante.
 *
 * La interfaz `ShippingQuote` se mantiene igual entre tabla y API, así el
 * resto del flow no cambia.
 */

import { AR_PROVINCES, type ArProvince } from '@/lib/addresses/constants';

// ============================================================================
// Constantes editables (mover a env vars o admin UI si crece la complejidad)
// ============================================================================

/**
 * Envío a domicilio / sucursal GRATIS a todo el país sin monto mínimo
 * (decisión del founder, 2026-11-12), SALVO las provincias de abajo, donde el
 * envío gratis sigue siendo solo para compras desde `FREE_SHIPPING_THRESHOLD_CENTS`.
 */
export const FREE_SHIPPING_EXCLUDED_PROVINCES: readonly string[] = [
  'Tierra del Fuego',
];

/** Subtotal del cart (en centavos) a partir del cual el envío es gratis en las provincias excluidas. */
export const FREE_SHIPPING_THRESHOLD_CENTS = 80_000_00; // $80.000

/** CP de 4 dígitos de Tierra del Fuego (Ushuaia 9410, Río Grande 9420…); Santa Cruz llega hasta 9407. */
function isTierraDelFuegoPostalCode(postalCode?: string | null): boolean {
  const cp = Number(postalCode?.match(/\d{4}/)?.[0]);
  return Number.isFinite(cp) && cp >= 9410 && cp <= 9499;
}

/**
 * ¿El destino entra en el envío gratis SIN mínimo? Si no se sabe la provincia
 * ni el CP, se asume que sí (el checkout siempre cobra con la provincia real).
 */
export function isFreeShippingRegion(args: {
  provinceName?: string | null;
  postalCode?: string | null;
}): boolean {
  if (
    args.provinceName &&
    FREE_SHIPPING_EXCLUDED_PROVINCES.includes(args.provinceName)
  ) {
    return false;
  }
  return !isTierraDelFuegoPostalCode(args.postalCode);
}

/** Regla única de envío gratis (la usan la tabla por zonas y la cotización de Correo). */
export function resolveFreeShipping(args: {
  subtotalCents: number;
  provinceName?: string | null;
  postalCode?: string | null;
}): { isFree: boolean; freeNationwide: boolean; centsToFreeShipping: number } {
  if (isFreeShippingRegion(args)) {
    return { isFree: true, freeNationwide: true, centsToFreeShipping: 0 };
  }
  const isFree = args.subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
  return {
    isFree,
    freeNationwide: false,
    centsToFreeShipping: isFree
      ? 0
      : FREE_SHIPPING_THRESHOLD_CENTS - args.subtotalCents,
  };
}

/**
 * Método de envío elegido en el checkout:
 * - `delivery`: envío a domicilio (API MiCorreo tipo "D" / tabla por zonas).
 * - `branch`: retiro en sucursal del Correo (API MiCorreo tipo "S").
 * - `pickup`: retiro en el local de Virasoro (gratis).
 */
export type ShippingMethod = 'delivery' | 'branch' | 'pickup';

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
  /** true cuando es gratis por la política "todo el país" (no por llegar al mínimo). */
  freeNationwide?: boolean;
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
  postalCode?: string | null;
}): ShippingQuote {
  const zone = resolveZone(args.provinceName);
  const baseRate = SHIPPING_RATES_BY_ZONE[zone];
  const { isFree, freeNationwide, centsToFreeShipping } =
    resolveFreeShipping(args);

  return {
    method: 'delivery',
    zone,
    zoneLabel: ZONE_LABELS[zone],
    cents: isFree ? 0 : baseRate,
    isFree,
    originalCents: isFree ? baseRate : null,
    centsToFreeShipping,
    freeNationwide,
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
