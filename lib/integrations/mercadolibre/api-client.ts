import 'server-only';
import { getMLConfig } from '@/lib/integrations/mercadolibre/config';
import { getValidAccessToken } from '@/lib/integrations/mercadolibre/oauth';
import { logMLSyncError } from '@/lib/integrations/mercadolibre/integrations-repo';
import type { SyncResult } from '@/lib/integrations/mercadolibre/types';

/**
 * Cliente HTTP autenticado para la API de Mercado Libre.
 *
 * Comportamiento:
 * 1. Obtiene access token válido (refresh automático si está por expirar).
 * 2. Llama al endpoint con `Authorization: Bearer ${token}`.
 * 3. Si recibe 401, intenta UN refresh + retry (por si el token se invalidó mid-request).
 * 4. Errores se loggean a `marketplace_sync_errors`.
 *
 * Devuelve `SyncResult<T>`:
 * - ok=true → parsed body como T.
 * - ok=false → reason + retryable flag.
 */

const RETRY_ON_401 = true;

export async function mlFetch<T = unknown>(
  path: string,
  init?: RequestInit & { operation?: string },
): Promise<SyncResult<T>> {
  const config = getMLConfig();
  const operation = init?.operation ?? 'api_call';

  const tokenResult = await getValidAccessToken();
  if (!tokenResult.ok) {
    return tokenResult as SyncResult<T>;
  }

  const url = path.startsWith('http')
    ? path
    : `${config.apiBase}${path.startsWith('/') ? '' : '/'}${path}`;

  const doFetch = async (token: string): Promise<Response> => {
    return fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  };

  let response: Response;
  try {
    response = await doFetch(tokenResult.data.accessToken);
  } catch (err) {
    await logMLSyncError({
      operation,
      errorPayload: {
        path,
        method: init?.method ?? 'GET',
        error: err instanceof Error ? err.message : String(err),
      },
    });
    return { ok: false, error: 'network_error', retryable: true };
  }

  // Retry on 401 con refresh forzado (por si el token se revocó mid-request).
  if (response.status === 401 && RETRY_ON_401) {
    const refreshed = await getValidAccessToken();
    if (refreshed.ok) {
      try {
        response = await doFetch(refreshed.data.accessToken);
      } catch (err) {
        await logMLSyncError({
          operation,
          errorPayload: {
            path,
            method: init?.method ?? 'GET',
            stage: 'retry_after_401',
            error: err instanceof Error ? err.message : String(err),
          },
        });
        return { ok: false, error: 'network_error', retryable: true };
      }
    } else {
      return refreshed as SyncResult<T>;
    }
  }

  if (response.status === 401) {
    return { ok: false, error: 'token_invalid', retryable: false };
  }

  if (response.status === 429) {
    return { ok: false, error: 'rate_limited', retryable: true };
  }

  if (response.status === 404) {
    return { ok: false, error: 'not_found', retryable: false };
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '<unreadable>');
    await logMLSyncError({
      operation,
      errorPayload: {
        path,
        method: init?.method ?? 'GET',
        status: response.status,
        body: body.slice(0, 500),
      },
    });
    return {
      ok: false,
      error: response.status >= 500 ? 'network_error' : 'unknown',
      retryable: response.status >= 500,
    };
  }

  if (response.status === 204) {
    return { ok: true, data: undefined as T };
  }

  try {
    const json = (await response.json()) as T;
    return { ok: true, data: json };
  } catch (err) {
    await logMLSyncError({
      operation,
      errorPayload: {
        path,
        stage: 'parse_response',
        error: err instanceof Error ? err.message : String(err),
      },
    });
    return { ok: false, error: 'unknown', retryable: false };
  }
}
