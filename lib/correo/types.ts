/**
 * Tipos de la API MiCorreo (Correo Argentino) — derivados del manual
 * oficial v2025-01-14. Sólo modelamos los endpoints que usamos en V1:
 * /token (auth) y /rates (cotización). /agencies e /shipping/import se
 * agregan en fases posteriores.
 */

export type CorreoTokenResponse = {
  token: string;
  /** Formato "2022-04-26 21:16:20" (hora AR, sin timezone explícito). */
  expires: string;
};

/** "D" = entrega a domicilio, "S" = entrega en sucursal. */
export type CorreoDeliveredType = 'D' | 'S';

export type CorreoDimensions = {
  /** Gramos (1–25000). */
  weight: number;
  /** Centímetros (≤150). */
  height: number;
  /** Centímetros (≤150). */
  width: number;
  /** Centímetros (≤150). */
  length: number;
};

export type CorreoRateRequest = {
  customerId: string;
  postalCodeOrigin: string;
  postalCodeDestination: string;
  /** Omitir para recibir cotización de domicilio Y sucursal en una sola request. */
  deliveredType?: CorreoDeliveredType;
  dimensions: CorreoDimensions;
};

export type CorreoRate = {
  deliveredType: CorreoDeliveredType;
  productType: string;
  productName: string;
  /** Precio en pesos con decimales (ej: 498.06). */
  price: number;
  deliveryTimeMin: string;
  deliveryTimeMax: string;
};

export type CorreoRatesResponse = {
  customerId: string;
  validTo: string;
  rates: CorreoRate[];
};

/**
 * Sucursal simplificada para la UI del checkout (derivada de /agencies).
 * Vive acá (sin `server-only`) para que los componentes cliente puedan
 * importar el tipo.
 */
export type CorreoBranch = {
  /** Código de sucursal (va en shipping.agency al importar el envío). */
  code: string;
  name: string;
  /** Dirección legible para mostrar. */
  address: string;
  postalCode: string | null;
};
