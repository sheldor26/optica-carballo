import { NextResponse } from 'next/server';
import { traerReclamos } from '@/lib/integrations/mercadolibre/claims';
import { actualizarReputacion } from '@/lib/integrations/mercadolibre/reputation';
import { secretsMatch } from '@/lib/security/timing-safe-equal';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * CRON: traer los reclamos y devoluciones de Mercado Libre.
 *
 * Hermana de ml-ventas: aquélla trae lo que se vendió, ésta lo que volvió y por
 * qué. Sólo lee de ML (ver lib/integrations/mercadolibre/claims.ts), escribe en
 * marketplace_claims, marketplace_reputation y marketplace_sync_state, y avisa
 * por correo lo urgente.
 *
 * Corre en el minuto 20 y no en punto, a propósito: ml-ventas y
 * ml-reconcile-stock arrancan en :00 y todas comparten el token (que ML rota al
 * renovar) y el límite de pedidos.
 *
 * `?dias=N` amplía el rango de cerrados. Por omisión mira los que cambiaron en
 * los últimos 3 días (o desde el último recorrido completo, si hace más), además
 * de los abiertos y los pendientes.
 *
 * `?historico=1` carga el historial de cerrados en tandas: repetir hasta que la
 * respuesta diga `historico.terminado: true`. No manda correos.
 */
export async function GET(request: Request) {
  const auth = request.headers.get('authorization') ?? '';
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || !secretsMatch(auth, expected)) {
    return NextResponse.json(
      { ok: false, error: 'unauthorized' },
      { status: 401 },
    );
  }

  const params = new URL(request.url).searchParams;
  const historico = params.get('historico') === '1';
  const pedido = Number(params.get('dias'));
  const dias =
    Number.isFinite(pedido) && pedido > 0 ? Math.min(pedido, 365) : undefined;

  const r = await traerReclamos({
    modo: historico ? 'historico' : 'reconciliar',
    dias,
  });
  if (!r.ok) {
    return NextResponse.json(
      { ok: false, error: r.error, retryable: r.retryable },
      { status: 502 },
    );
  }
  // La reputación va después: si falla, lo anota ella y los reclamos ya están.
  const reputacion =
    historico ||
    r.data.corte === 'limite_de_ml' ||
    r.data.corte === 'token'
      ? null
      : await actualizarReputacion();
  return NextResponse.json({ ok: true, ...r.data, reputacion });
}
