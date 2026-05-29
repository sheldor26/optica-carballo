import { NextResponse } from 'next/server';
import { mlFetch } from '@/lib/integrations/mercadolibre/api-client';

export const dynamic = 'force-dynamic';

/**
 * Endpoint TEMPORAL admin para verificar qué cuenta ML autorizó OAuth.
 * Usa el access_token guardado en `marketplace_integrations` para llamar
 * `/users/me` de ML. Devuelve nickname + user_id + datos públicos.
 *
 * Caso de uso: diagnóstico cuando el founder no sabe si la cuenta
 * autorizada es la correcta (ej: cookie sticky de ML autorizó cuenta
 * equivocada en multi-cuenta).
 *
 * **Sin auth iter 1** — endpoint temporal de admin.
 *
 * TODO: eliminar cuando admin UI esté operativo en `/mi-cuenta/marketplace`.
 */
export async function GET() {
  const result = await mlFetch<Record<string, unknown>>('/users/me', {
    operation: 'fetch_me_admin',
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result.error,
        retryable: result.retryable,
        note: 'Si error es token_expired o token_invalid, re-autorizar en /api/ml/oauth/initiate.',
      },
      { status: 500 },
    );
  }

  // Devolvemos solo campos relevantes (no exponer datos sensibles del seller).
  const data = result.data as Record<string, unknown>;
  return NextResponse.json({
    ok: true,
    note: 'Cuenta ML autorizada actualmente vía OAuth.',
    nickname: data.nickname,
    user_id: data.id,
    email: data.email,
    site_id: data.site_id,
    registration_date: data.registration_date,
    seller_reputation: data.seller_reputation,
  });
}
