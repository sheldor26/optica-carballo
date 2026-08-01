import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'node:crypto';
import { buildAuthUrl } from '@/lib/integrations/mercadolibre/config';
import { requireAdminEmail } from '@/lib/auth/admin';
import {
  ML_OAUTH_STATE_COOKIE,
  ML_OAUTH_STATE_TTL_SECONDS,
} from '@/lib/integrations/mercadolibre/oauth-state';

export const dynamic = 'force-dynamic';

/**
 * Inicia el flow OAuth de Mercado Libre.
 *
 * 1. Exige admin logueado (email allowlist) — quien complete este flow queda
 *    con la integración de ML asociada a su cuenta y puede reemplazar la
 *    integración activa existente, así que no puede quedar abierto.
 * 2. Genera state CSRF token (random hex).
 * 3. Lo guarda en cookie httpOnly secure (samesite=lax para que sobreviva
 *    el redirect cross-origin de ML).
 * 4. Redirige al founder al URL de autorización de ML con el state.
 *
 * En el callback, validamos que el state recibido matchea el de la cookie.
 *
 * `requireAdminEmail()` devuelve 404 (no redirect a login) si no hay sesión
 * admin válida — mismo criterio anti-enumeración que el resto de `/admin`.
 */
export async function GET(_request: NextRequest) {
  await requireAdminEmail();

  try {
    const state = crypto.randomBytes(32).toString('hex');
    const authUrl = buildAuthUrl(state);

    const response = NextResponse.redirect(authUrl);
    response.cookies.set({
      name: ML_OAUTH_STATE_COOKIE,
      value: state,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ML_OAUTH_STATE_TTL_SECONDS,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[ml-oauth-initiate] error', err);
    return NextResponse.json(
      {
        error: 'oauth_config_incomplete',
        message:
          'Faltan env vars de Mercado Libre. Configurar ML_CLIENT_ID, ML_CLIENT_SECRET, ML_REDIRECT_URI, APP_ENCRYPTION_KEY en Vercel.',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
