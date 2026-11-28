import { NextResponse } from 'next/server';
import { traerReclamos } from '@/lib/integrations/mercadolibre/claims';
import { secretsMatch } from '@/lib/security/timing-safe-equal';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * CRON: traer los reclamos y devoluciones de Mercado Libre.
 *
 * Hermana de ml-ventas: aquélla trae lo que se vendió, ésta lo que volvió y por
 * qué. Sólo lee de ML (ver lib/integrations/mercadolibre/claims.ts) y escribe
 * únicamente en marketplace_claims.
 *
 * Corre en el minuto 20 y no en punto, a propósito: ml-ventas y
 * ml-reconcile-stock arrancan en :00 y todas comparten el token (que ML rota al
 * renovar) y el límite de pedidos.
 *
 * `?dias=N` amplía el rango. Primera carga: `?dias=90`, repetida hasta que la
 * respuesta diga `incompleto: false`. Por omisión mira los cerrados que
 * cambiaron en los últimos 3 días, además de los abiertos y los pendientes.
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

  const pedido = Number(new URL(request.url).searchParams.get('dias'));
  const dias =
    Number.isFinite(pedido) && pedido > 0 ? Math.min(pedido, 365) : undefined;

  const r = await traerReclamos(dias);
  if (!r.ok) {
    return NextResponse.json(
      { ok: false, error: r.error, retryable: r.retryable },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true, ...r.data });
}
