/**
 * Types para la integración con Mercado Libre.
 *
 * Estructura modular: cada concepto (item, order, webhook, oauth) tiene
 * su propio tipo. Schemas Zod en `schemas.ts` validan los payloads
 * runtime.
 *
 * Referencia oficial:
 * - https://developers.mercadolibre.com.ar/
 * - https://api.mercadolibre.com/
 */

export type MarketplaceName = 'mercadolibre';

export type IntegrationStatus = 'active' | 'expired' | 'revoked' | 'error';

/**
 * Una integración con un marketplace. Una entry por usuario externo
 * (founder.id_ML en Mercado Libre).
 */
export type MarketplaceIntegration = {
  id: string;
  marketplace: MarketplaceName;
  externalUserId: string;
  /** Tokens cifrados con AES en la app antes de persistir. */
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: Date;
  status: IntegrationStatus;
  lastSyncAt: Date | null;
  lastErrorAt: Date | null;
  lastErrorMessage: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

// ============================================================================
// OAuth
// ============================================================================

/**
 * Response del endpoint `POST /oauth/token` de ML al intercambiar
 * el authorization code por tokens.
 */
export type OAuthTokenResponse = {
  access_token: string;
  /** Case-insensitive 'bearer' / 'Bearer'. ML devuelve 'Bearer' (estándar
   *  HTTP Authorization header), OAuth 2.0 ABNF dice 'bearer'. Schema
   *  valida con regex /^bearer$/i. */
  token_type: string;
  expires_in: number; // segundos
  scope: string;
  user_id: number;
  refresh_token: string;
};

/**
 * Params iniciales para construir el URL de autorización OAuth.
 */
export type OAuthInitParams = {
  clientId: string;
  redirectUri: string;
  /** State CSRF — generamos y verificamos en el callback. */
  state: string;
};

// ============================================================================
// Items (productos en ML)
// ============================================================================

/**
 * Estado de un item en ML. `active` = visible y vendible.
 */
export type MLItemStatus =
  | 'active'
  | 'paused'
  | 'closed'
  | 'under_review'
  | 'inactive';

/**
 * Subset relevante del response del endpoint `GET /items/{id}`.
 */
export type MLItem = {
  id: string; // ej "MLA1234567890"
  title: string;
  available_quantity: number;
  status: MLItemStatus;
  /** En ML, `variations` permite múltiples colores/talles dentro de 1 item.
   * Iter 1 mapeamos 1 variante de Supabase = 1 item completo de ML.
   * Si en el futuro queremos sync de variations, expandimos acá. */
  variations: Array<{
    id: number;
    available_quantity: number;
    attribute_combinations?: Array<{ id: string; value_name: string }>;
  }>;
};

/**
 * Payload para `PUT /items/{id}` cuando bajamos stock.
 */
export type MLItemStockUpdate = {
  available_quantity: number;
};

// ============================================================================
// Webhooks (notifications)
// ============================================================================

/**
 * Topic del webhook que vamos a procesar.
 * Lista completa: https://developers.mercadolibre.com.ar/es_ar/productos-notificaciones
 */
export type MLWebhookTopic = 'items' | 'orders_v2' | 'stock-locations' | 'shipments';

/**
 * Payload típico de un webhook de ML. ML manda esto a nuestro endpoint
 * cuando hay un cambio en algún recurso del seller.
 *
 * Importante: el `resource` es una URL parcial; hay que GET-earla para
 * obtener el detalle real.
 */
export type MLWebhookPayload = {
  /** ID único del webhook (idempotency). */
  _id?: string;
  /** Topic del cambio. */
  topic: MLWebhookTopic;
  /** Path del recurso afectado, ej "/items/MLA1234567890". */
  resource: string;
  user_id: number;
  application_id: number;
  /** Cuándo ocurrió el evento. */
  sent: string;
  /** Cuándo se recibió en ML (vs cuando ocurrió). */
  received: string;
  /** Intentos previos de delivery (ML reintenta si nuestro endpoint falla). */
  attempts: number;
};

// ============================================================================
// Sync errors
// ============================================================================

export type SyncOperation =
  | 'oauth'
  | 'webhook'
  | 'push_stock'
  | 'fetch_item'
  | 'reconcile';

export type SyncError = {
  id: string;
  marketplace: MarketplaceName;
  operation: SyncOperation;
  variantId: string | null;
  externalItemId: string | null;
  errorPayload: Record<string, unknown>;
  retryCount: number;
  resolvedAt: Date | null;
  createdAt: Date;
};

// ============================================================================
// Resultados de operaciones
// ============================================================================

export type SyncResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: SyncErrorReason; retryable: boolean };

export type SyncErrorReason =
  | 'token_expired'
  | 'token_invalid'
  | 'rate_limited'
  | 'not_found'
  | 'validation_error'
  | 'network_error'
  | 'unknown';
