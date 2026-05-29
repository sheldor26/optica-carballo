/**
 * Constantes compartidas entre los endpoints OAuth de ML
 * (`/api/ml/oauth/initiate` y `/api/ml/oauth/callback`).
 *
 * Separadas en su propio módulo porque Next.js route files NO permiten
 * exportar arbitrary consts — solo handlers (GET, POST, etc) y configs
 * específicas (dynamic, revalidate).
 */

export const ML_OAUTH_STATE_COOKIE = 'oc_ml_oauth_state';
export const ML_OAUTH_STATE_TTL_SECONDS = 10 * 60; // 10 min para completar el flow
