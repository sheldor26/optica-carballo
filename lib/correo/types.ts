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

// ===========================================================================
// /shipping/import [POST] — alta de envío (Fase 3). Tipos del manual v2025-01-14.
// ===========================================================================

/** Dirección genérica del manual (sender.originAddress y shipping.address). */
export type CorreoApiAddress = {
  streetName: string | null;
  streetNumber: string | null;
  floor?: string | null;
  apartment?: string | null;
  city: string | null;
  provinceCode: string | null;
  postalCode: string | null;
};

/** Remitente. No es ✔ en el manual (MiCorreo usa los datos de la cuenta si va null),
 * pero hay errores tipo "El codigo Postal del emisor debe tener valor" → conviene mandarlo. */
export type CorreoSender = {
  name: string | null;
  phone: string | null;
  cellPhone: string | null;
  email: string | null;
  originAddress: CorreoApiAddress;
};

/** Destinatario (recipient.name y recipient.email son obligatorios). */
export type CorreoRecipient = {
  name: string;
  phone?: string | null;
  cellPhone?: string | null;
  email: string;
};

/** Bloque `shipping` del import. address.* obligatorio solo para D; agency solo para S. */
export type CorreoShipmentDetails = {
  /** "D" domicilio, "S" sucursal. */
  deliveryType: CorreoDeliveredType;
  /** Código de sucursal de destino — obligatorio si deliveryType="S". */
  agency: string | null;
  /** Dirección de entrega — obligatoria si deliveryType="D". Para "S"
   * (sucursal) MiCorreo exige `null` explícito: un objeto con todos los
   * campos en null tira 500 sin mensaje (confirmado empíricamente 2026-08-04). */
  address: CorreoApiAddress | null;
  /** Tipo de producto, default "CP" (Clásico). */
  productType: string;
  /** Enteros: gramos / cm. */
  weight: number;
  declaredValue: number;
  height: number;
  length: number;
  width: number;
};

export type CorreoImportRequest = {
  customerId: string;
  /** Identificador externo de la orden (idempotencia: re-importar el mismo da error). */
  extOrderId: string;
  /** Identificador externo legible para ver en el panel MiCorreo (ej. "OC-2026-00007"). */
  orderNumber?: string;
  sender: CorreoSender;
  recipient: CorreoRecipient;
  shipping: CorreoShipmentDetails;
};

/**
 * Respuesta del import. ⚠️ Según el manual SOLO devuelve `createdAt` — NO el
 * número de tracking. La captura del nº de seguimiento se valida en el ambiente
 * de TEST (ver `fetchCorreoTracking` + comentario en import.ts).
 */
export type CorreoImportResponse = {
  createdAt: string;
};

// ===========================================================================
// /shipping/tracking [GET] — seguimiento de un envío importado.
// ===========================================================================

export type CorreoTrackingEvent = {
  event: string;
  date: string;
  branch: string;
  status: string;
  sign: string;
};

export type CorreoTrackingResult = {
  id: string | null;
  productId: string | null;
  trackingNumber: string | null;
  events: CorreoTrackingEvent[];
};
