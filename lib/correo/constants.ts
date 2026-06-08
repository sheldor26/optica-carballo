import 'server-only';

/**
 * Configuración de la integración con la API MiCorreo (Correo Argentino).
 *
 * Las credenciales se solicitan a Correo y son DISTINTAS por ambiente
 * (test vs producción). Se cargan como env vars — nunca se commitean ni se
 * pegan en chat. El ambiente lo define la base URL:
 *   - Test:  https://apitest.correoargentino.com.ar/micorreo/v1
 *   - Prod:  https://api.correoargentino.com.ar/micorreo/v1
 *
 * El endpoint /rates (cotización) es de solo lectura: NO genera envíos ni
 * costos, así que es seguro probarlo contra producción.
 */

/** Lee las env vars frescas en cada llamada (evita valores stale en dev). */
export function getCorreoConfig() {
  return {
    baseUrl: process.env.MICORREO_API_BASE_URL ?? '',
    user: process.env.MICORREO_API_USER ?? '',
    password: process.env.MICORREO_API_PASSWORD ?? '',
    customerId: process.env.MICORREO_CUSTOMER_ID ?? '',
    /** CP de origen — el local desde donde se despacha (Virasoro, Corrientes). */
    postalCodeOrigin: process.env.BUSINESS_POSTAL_CODE ?? '',
  };
}

/**
 * true sólo si TODAS las variables necesarias para cotizar están presentes.
 * Cuando es false, el checkout cae a la tabla por zonas hardcoded
 * (`lib/shipping.ts`) sin romperse. Es el switch de activación de la API.
 */
export function isCorreoConfigured(): boolean {
  const c = getCorreoConfig();
  return Boolean(
    c.baseUrl && c.user && c.password && c.customerId && c.postalCodeOrigin,
  );
}

/**
 * Dimensiones default del paquete de un anteojo (estuche rígido + caja de
 * envío + protección). Valores conservadores para no sub-cotizar. Enteros:
 * weight en gramos, resto en centímetros (límites API: peso ≤25000g,
 * lados ≤150cm).
 *
 * Ajustá estos números cuando pesen una caja real con la balanza.
 */
export const DEFAULT_PACKAGE = {
  weight: 500, // g — 1 anteojo + estuche rígido + caja + burbuja
  height: 10, // cm
  width: 20, // cm
  length: 15, // cm
} as const;

/** Peso extra por cada anteojo adicional en el mismo paquete (gramos). */
export const EXTRA_ITEM_WEIGHT = 250;

/** Tipo de producto Correo: "CP" = Correo Argentino Clásico. */
export const PRODUCT_TYPE = 'CP';

/**
 * Normaliza un código postal argentino a los 4 dígitos que espera la API.
 * Acepta CPA (`B1900ABC`) o clásico (`1900`) → devuelve `1900`.
 * Devuelve '' si no encuentra 4 dígitos (el caller decide el fallback).
 */
export function normalizePostalCode(raw: string): string {
  const match = raw.match(/\d{4}/);
  return match ? match[0] : '';
}
