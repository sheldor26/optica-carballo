import 'server-only';

/**
 * Configuración de la integración Mercado Libre. Lee env vars en runtime
 * y valida que estén presentes cuando se usan (lazy — para que el módulo
 * se pueda importar en tests sin requerir setup completo).
 *
 * Env vars necesarias (Sprint 2 en adelante):
 * - ML_CLIENT_ID: App ID generado en developers.mercadolibre.com.ar
 * - ML_CLIENT_SECRET: Secret Key del mismo app (NUNCA committear)
 * - ML_REDIRECT_URI: URL de callback del OAuth (debe matchear lo registrado en ML)
 * - ML_WEBHOOK_SECRET: HMAC secret para validar webhooks (opcional iter 1 — ML
 *   no firma webhooks por default, ver `verifyWebhookSignature` para alternativas)
 * - APP_ENCRYPTION_KEY: 32 chars random para cifrar tokens en DB (AES-256)
 */

const ML_API_BASE = 'https://api.mercadolibre.com';
const ML_AUTH_BASE = 'https://auth.mercadolibre.com.ar';

export function getMLConfig() {
  const clientId = process.env.ML_CLIENT_ID;
  const clientSecret = process.env.ML_CLIENT_SECRET;
  const redirectUri = process.env.ML_REDIRECT_URI;
  const encryptionKey = process.env.APP_ENCRYPTION_KEY;

  if (!clientId || !clientSecret) {
    throw new Error(
      'ML_CLIENT_ID y ML_CLIENT_SECRET son requeridas. Configurar en Vercel tras Sprint 2.',
    );
  }
  if (!redirectUri) {
    throw new Error(
      'ML_REDIRECT_URI requerida. Formato: https://[dominio]/api/ml/oauth/callback',
    );
  }
  if (!encryptionKey || encryptionKey.length < 32) {
    throw new Error(
      'APP_ENCRYPTION_KEY debe tener mínimo 32 chars para AES-256.',
    );
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
    encryptionKey,
    apiBase: ML_API_BASE,
    authBase: ML_AUTH_BASE,
  };
}

/**
 * Construye el URL de autorización OAuth al que mandamos al founder
 * para que autorice la app.
 *
 * Después del click, ML redirige a `redirectUri` con `?code=xxx&state=yyy`.
 */
export function buildAuthUrl(state: string): string {
  const config = getMLConfig();
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    state,
  });
  return `${config.authBase}/authorization?${params.toString()}`;
}

/**
 * Tiempo de gracia antes de que un token expire — refrescamos
 * proactivamente. ML access_tokens duran 6 horas; refresh con 15 min de
 * margen.
 */
export const TOKEN_REFRESH_BUFFER_MS = 15 * 60 * 1000;

/**
 * Rate limit de ML: 1000 calls/hora por user_id. No nos acercamos al
 * cap con uso normal, pero exportamos por si necesitamos rate-limit
 * propio en el futuro.
 */
export const ML_RATE_LIMIT_PER_HOUR = 1000;
