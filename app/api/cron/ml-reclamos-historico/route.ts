import { NextResponse } from 'next/server';
import { cargarTandaDeHistorial } from '@/lib/integrations/mercadolibre/postventa';
import { secretsMatch } from '@/lib/security/timing-safe-equal';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * CRON: cargar de a tandas los reclamos cerrados viejos de Mercado Libre.
 *
 * Sólo lee de ML y no manda correos. Cuando termina queda anotado en
 * marketplace_sync_state ('historico') y las corridas siguientes contestan sin
 * hacer nada: ahí se puede sacar de vercel.json.
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

  try {
    const r = await cargarTandaDeHistorial();
    return NextResponse.json(r, { status: r.ok ? 200 : 502 });
  } catch (err) {
    console.error('[ml-historico] la tanda falló', err);
    return NextResponse.json({ ok: false, error: 'unknown' }, { status: 502 });
  }
}
