import 'server-only';
import {
  getMLConfig,
  TOKEN_REFRESH_BUFFER_MS,
} from '@/lib/integrations/mercadolibre/config';
import { oauthTokenResponseSchema } from '@/lib/integrations/mercadolibre/schemas';
import {
  getActiveMLIntegration,
  logMLSyncError,
  markMLIntegrationError,
  upsertMLIntegration,
} from '@/lib/integrations/mercadolibre/integrations-repo';
import type {
  MarketplaceIntegration,
  OAuthTokenResponse,
  SyncResult,
} from '@/lib/integrations/mercadolibre/types';

/**
 * Sanitiza un JSON crudo recibido de ML antes de persistirlo en logs.
 * Devuelve `keys` (lista de keys que venían) + `redacted` (objeto con
 * los mismos keys pero valores reemplazados por [REDACTED] para
 * los sensibles, o el valor original para los no sensibles).
 *
 * Esto evita que tokens reales queden persistidos en
 * `marketplace_sync_errors` — esa tabla es para debugging de shape,
 * NO para backup de credenciales.
 */
function sanitizeReceivedJson(json: unknown): {
  keys: string[];
  redacted: Record<string, unknown>;
} {
  if (typeof json !== 'object' || json === null || Array.isArray(json)) {
    return { keys: [], redacted: {} };
  }

  const SENSITIVE_KEYS = new Set([
    'access_token',
    'refresh_token',
    'id_token',
    'client_secret',
    'code',
  ]);

  const obj = json as Record<string, unknown>;
  const keys = Object.keys(obj);
  const redacted: Record<string, unknown> = {};
  for (const key of keys) {
    if (SENSITIVE_KEYS.has(key)) {
      redacted[key] = '[REDACTED]';
    } else {
      redacted[key] = obj[key];
    }
  }
  return { keys, redacted };
}

/**
 * OAuth 2.0 flow para Mercado Libre.
 *
 * Flow estándar Authorization Code:
 * 1. Founder → click "conectar ML" → redirect a ML auth URL.
 * 2. Founder autoriza la app en ML.
 * 3. ML redirige a nuestro callback con `?code=X&state=Y`.
 * 4. Server intercambia `code` por `access_token` + `refresh_token`.
 * 5. Persistimos cifrado en `marketplace_integrations`.
 *
 * Tokens duran 6 horas. Refresh token dura 6 meses. Refresh automático
 * antes de expirar (`getValidAccessToken`).
 *
 * Docs ML: https://developers.mercadolibre.com.ar/es_ar/autenticacion-y-autorizacion
 */

/**
 * Intercambia el `code` recibido en el callback OAuth por access + refresh
 * tokens. Persiste la integración en DB.
 */
export async function exchangeCodeForTokens(
  code: string,
): Promise<SyncResult<MarketplaceIntegration>> {
  const config = getMLConfig();

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: config.redirectUri,
  });

  let response: Response;
  try {
    response = await fetch(`${config.apiBase}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: params.toString(),
    });
  } catch (err) {
    console.error('[ml-oauth] network error exchanging code', err);
    return { ok: false, error: 'network_error', retryable: true };
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '<unreadable>');
    console.error('[ml-oauth] code exchange failed', {
      status: response.status,
      body,
      redirectUriSent: config.redirectUri,
    });
    // Persistir el error en DB para que el founder/yo podamos consultarlo
    // después si los logs de Vercel no muestran detalle.
    await logMLSyncError({
      operation: 'oauth',
      errorPayload: {
        stage: 'exchange_code',
        status: response.status,
        body: body.slice(0, 1000),
        redirect_uri_sent: config.redirectUri,
      },
    });
    return {
      ok: false,
      error: response.status === 400 ? 'validation_error' : 'unknown',
      retryable: false,
    };
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch (err) {
    console.error('[ml-oauth] error parsing token response', err);
    await logMLSyncError({
      operation: 'oauth',
      errorPayload: {
        stage: 'parse_response',
        status: response.status,
        error: err instanceof Error ? err.message : String(err),
      },
    });
    return { ok: false, error: 'unknown', retryable: false };
  }

  const parsed = oauthTokenResponseSchema.safeParse(json);
  if (!parsed.success) {
    console.error(
      '[ml-oauth] token response con formato inesperado',
      parsed.error.flatten(),
    );
    // Loguear a DB SIN tokens crudos. Sanitizamos los campos sensibles
    // antes de persistir — DB log es para diagnóstico de SHAPE, no
    // backup de credenciales. Solo guardamos qué keys vinieron + zod errors.
    const sanitized = sanitizeReceivedJson(json);
    await logMLSyncError({
      operation: 'oauth',
      errorPayload: {
        stage: 'zod_validation',
        status: response.status,
        zod_errors: parsed.error.flatten(),
        received_keys: sanitized.keys,
        received_redacted: sanitized.redacted,
      },
    });
    return { ok: false, error: 'validation_error', retryable: false };
  }

  const tokens: OAuthTokenResponse = parsed.data;

  const integration = await upsertMLIntegration({
    externalUserId: String(tokens.user_id),
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresInSeconds: tokens.expires_in,
    metadata: { scope: tokens.scope },
  });

  if (!integration) {
    await logMLSyncError({
      operation: 'oauth',
      errorPayload: {
        stage: 'upsert_integration',
        external_user_id: String(tokens.user_id),
      },
    });
    return { ok: false, error: 'unknown', retryable: true };
  }

  return { ok: true, data: integration };
}

/**
 * Refresca el access token usando el refresh_token guardado. ML rota el
 * refresh_token también — guardamos el nuevo.
 */
export async function refreshAccessToken(
  integration: MarketplaceIntegration,
): Promise<SyncResult<MarketplaceIntegration>> {
  const config = getMLConfig();

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: integration.refreshToken,
  });

  let response: Response;
  try {
    response = await fetch(`${config.apiBase}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: params.toString(),
    });
  } catch (err) {
    console.error('[ml-oauth] network error refreshing token', err);
    return { ok: false, error: 'network_error', retryable: true };
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '<unreadable>');
    console.error('[ml-oauth] refresh failed', {
      status: response.status,
      body,
    });

    // 400/401 en refresh = refresh_token expirado/revocado.
    // Marcamos como expired para que admin UI muestre "re-autorizar".
    if (response.status === 400 || response.status === 401) {
      await markMLIntegrationError({
        externalUserId: integration.externalUserId,
        message: `Refresh falló con ${response.status}. Re-autorizar.`,
        status: 'expired',
      });
      return { ok: false, error: 'token_expired', retryable: false };
    }

    return { ok: false, error: 'unknown', retryable: true };
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    return { ok: false, error: 'unknown', retryable: false };
  }

  const parsed = oauthTokenResponseSchema.safeParse(json);
  if (!parsed.success) {
    return { ok: false, error: 'validation_error', retryable: false };
  }

  const tokens = parsed.data;
  const updated = await upsertMLIntegration({
    externalUserId: String(tokens.user_id),
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresInSeconds: tokens.expires_in,
    metadata: { scope: tokens.scope },
  });

  if (!updated) {
    return { ok: false, error: 'unknown', retryable: true };
  }

  return { ok: true, data: updated };
}

/**
 * Devuelve un access token válido. Si está por expirar (dentro de
 * `TOKEN_REFRESH_BUFFER_MS`), refresca proactivamente.
 *
 * Use case: cualquier server action que necesita llamar a la API de ML.
 */
export async function getValidAccessToken(): Promise<SyncResult<{
  accessToken: string;
  externalUserId: string;
}>> {
  const integration = await getActiveMLIntegration();
  if (!integration) {
    return { ok: false, error: 'not_found', retryable: false };
  }

  const now = Date.now();
  const expiresAt = integration.tokenExpiresAt.getTime();

  // Si el token todavía es válido con suficiente margen, usar el actual.
  if (expiresAt - now > TOKEN_REFRESH_BUFFER_MS) {
    return {
      ok: true,
      data: {
        accessToken: integration.accessToken,
        externalUserId: integration.externalUserId,
      },
    };
  }

  // Refresh proactivo.
  const refreshed = await refreshAccessToken(integration);
  if (!refreshed.ok) return refreshed;

  return {
    ok: true,
    data: {
      accessToken: refreshed.data.accessToken,
      externalUserId: refreshed.data.externalUserId,
    },
  };
}
