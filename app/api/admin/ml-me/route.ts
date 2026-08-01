import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/integrations/mercadolibre/oauth';
import { getActiveMLIntegration } from '@/lib/integrations/mercadolibre/integrations-repo';
import { requireAdminApi } from '@/lib/auth/admin';

export const dynamic = 'force-dynamic';

/**
 * Endpoint TEMPORAL admin con diagnóstico crudo del estado de OAuth ML.
 * Hace fetch RAW a `/users/me` (bypass mlFetch) para devolver status+body
 * sin mapping. Permite diagnosticar 404 / 401 / etc.
 *
 * Requiere admin + PIN (`requireAdminApi`).
 */
export async function GET() {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  // 1. Estado de la integración guardada
  const integration = await getActiveMLIntegration();
  if (!integration) {
    return NextResponse.json(
      {
        ok: false,
        stage: 'no_integration',
        note: 'No hay integración ML activa en DB. Re-autorizar en /api/ml/oauth/initiate.',
      },
      { status: 500 },
    );
  }

  // 2. Obtener access token (refresh automático si expira)
  const tokenResult = await getValidAccessToken();
  if (!tokenResult.ok) {
    return NextResponse.json(
      {
        ok: false,
        stage: 'token_error',
        error: tokenResult.error,
        retryable: tokenResult.retryable,
        integration_summary: {
          external_user_id: integration.externalUserId,
          status: integration.status,
          token_expires_at: integration.tokenExpiresAt,
          last_sync_at: integration.lastSyncAt,
          last_error_at: integration.lastErrorAt,
          last_error_message: integration.lastErrorMessage,
        },
      },
      { status: 500 },
    );
  }

  // 3. Fetch RAW a /users/me — capturar status + body sin mapping
  const url = 'https://api.mercadolibre.com/users/me';
  let response: Response;
  let bodyText: string;
  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${tokenResult.data.accessToken}`,
        Accept: 'application/json',
      },
    });
    bodyText = await response.text();
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        stage: 'network_error',
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }

  // 4. Devolver TODO el detalle para diagnóstico
  let bodyParsed: unknown;
  try {
    bodyParsed = JSON.parse(bodyText);
  } catch {
    bodyParsed = bodyText;
  }

  return NextResponse.json({
    ok: response.ok,
    stage: 'fetch_complete',
    request: {
      url,
      method: 'GET',
    },
    response: {
      status: response.status,
      statusText: response.statusText,
      body: bodyParsed,
    },
    integration_summary: {
      external_user_id: integration.externalUserId,
      status: integration.status,
      token_expires_at: integration.tokenExpiresAt,
      last_sync_at: integration.lastSyncAt,
      last_error_at: integration.lastErrorAt,
      last_error_message: integration.lastErrorMessage,
      token_preview: tokenResult.data.accessToken.slice(0, 8) + '...',
    },
  });
}
