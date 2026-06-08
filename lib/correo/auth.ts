import 'server-only';
import { getCorreoConfig } from './constants';
import type { CorreoTokenResponse } from './types';

/**
 * Autenticación contra MiCorreo: POST /token con HTTP Basic Auth devuelve
 * un JWT bearer que dura ~2.5h. Lo cacheamos en memoria del proceso para
 * no re-loguear en cada cotización.
 *
 * El cache vive a nivel módulo: en serverless (Vercel) cada instancia tiene
 * el suyo y se re-loguea cuando arranca fría. Aceptable — /token es barato.
 */

let cached: { token: string; expiresAtMs: number } | null = null;

/** Margen de seguridad: renovamos 2 min antes del vencimiento real. */
const EXPIRY_MARGIN_MS = 2 * 60_000;

/** TTL conservador si no podemos leer `exp` del JWT (fallback). */
const FALLBACK_TTL_MS = 2 * 60 * 60_000; // 2h (< las ~2.5h reales)

/** Lee el claim `exp` (epoch UTC) del JWT, en ms. null si no se puede parsear. */
function readJwtExpiryMs(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const json = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    return typeof json.exp === 'number' ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}

/**
 * Devuelve un bearer token válido (del cache o pidiendo uno nuevo).
 * Lanza si faltan credenciales o si /token responde error.
 */
export async function getCorreoToken(nowMs: number = Date.now()): Promise<string> {
  if (cached && cached.expiresAtMs - EXPIRY_MARGIN_MS > nowMs) {
    return cached.token;
  }

  const { baseUrl, user, password } = getCorreoConfig();
  if (!baseUrl || !user || !password) {
    throw new Error(
      'MiCorreo: faltan credenciales (MICORREO_API_BASE_URL / MICORREO_API_USER / MICORREO_API_PASSWORD).',
    );
  }

  const basic = Buffer.from(`${user}:${password}`).toString('base64');
  const res = await fetch(`${baseUrl}/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`MiCorreo /token ${res.status} ${res.statusText} ${detail}`.trim());
  }

  const data = (await res.json()) as CorreoTokenResponse;
  if (!data.token) {
    throw new Error('MiCorreo /token: respuesta sin token.');
  }

  const expiresAtMs = readJwtExpiryMs(data.token) ?? nowMs + FALLBACK_TTL_MS;
  cached = { token: data.token, expiresAtMs };
  return data.token;
}

/** Invalida el token cacheado. Se llama tras un 401 para forzar re-login. */
export function invalidateCorreoToken(): void {
  cached = null;
}
