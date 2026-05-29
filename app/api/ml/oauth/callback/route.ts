import { NextResponse, type NextRequest } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/integrations/mercadolibre/oauth';
import { ML_OAUTH_STATE_COOKIE } from '@/lib/integrations/mercadolibre/oauth-state';

export const dynamic = 'force-dynamic';

/**
 * Callback OAuth de Mercado Libre.
 *
 * ML redirige acá tras la autorización del founder con query params:
 *   ?code=...&state=...
 *
 * Flow:
 * 1. Validar state contra cookie (CSRF protection).
 * 2. Validar que vino un code.
 * 3. Intercambiar code por tokens (lib/.../oauth.ts).
 * 4. Tokens se guardan cifrados en `marketplace_integrations`.
 * 5. Redirect a `/mi-cuenta/marketplace?status=success` (page exists en Sprint 3).
 *    Por ahora redirect a `/` con query param para feedback.
 *
 * Error cases:
 * - ML manda `?error=access_denied` si el user canceló → redirect con error.
 * - State mismatch → CSRF detected, abort.
 * - Code exchange falla → log + redirect con error.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  // Cleanup state cookie al final del flow (sea exitoso o no).
  const cleanupCookie = (response: NextResponse) => {
    response.cookies.set({
      name: ML_OAUTH_STATE_COOKIE,
      value: '',
      maxAge: 0,
      path: '/',
    });
    return response;
  };

  // 1. User canceló o ML retornó error
  if (error) {
    console.warn('[ml-oauth-callback] ML retornó error', { error });
    return cleanupCookie(
      NextResponse.redirect(
        new URL(`/?ml_oauth=denied&reason=${error}`, request.url),
      ),
    );
  }

  // 2. Sin code → flow inválido
  if (!code) {
    return cleanupCookie(
      NextResponse.redirect(
        new URL('/?ml_oauth=invalid&reason=missing_code', request.url),
      ),
    );
  }

  // 3. CSRF check: state debe matchear cookie
  const cookieState = request.cookies.get(ML_OAUTH_STATE_COOKIE)?.value;
  if (!cookieState || !state || cookieState !== state) {
    console.warn('[ml-oauth-callback] state mismatch (CSRF?)', {
      hasCookieState: Boolean(cookieState),
      hasQueryState: Boolean(state),
    });
    return cleanupCookie(
      NextResponse.redirect(
        new URL('/?ml_oauth=invalid&reason=state_mismatch', request.url),
      ),
    );
  }

  // 4. Exchange code por tokens
  const result = await exchangeCodeForTokens(code);

  if (!result.ok) {
    console.error('[ml-oauth-callback] exchange failed', result);
    return cleanupCookie(
      NextResponse.redirect(
        new URL(
          `/?ml_oauth=error&reason=${result.error}`,
          request.url,
        ),
      ),
    );
  }

  // 5. Éxito → redirect con flag para que admin UI muestre confirmación
  return cleanupCookie(
    NextResponse.redirect(
      new URL(
        `/?ml_oauth=success&user_id=${result.data.externalUserId}`,
        request.url,
      ),
    ),
  );
}
