import { NextResponse } from 'next/server';
import { enviarResumenDiario } from '@/lib/integrations/mercadolibre/postventa';
import { secretsMatch } from '@/lib/security/timing-safe-equal';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * CRON: el resumen diario de reclamos y devoluciones, 8:30 de Argentina (11:30
 * UTC, ver vercel.json). Sólo lee la base y manda un correo a ML_AVISOS_EMAIL
 * si hay algo abierto o si la sincronización viene fallando. Sin esa variable no
 * manda nada.
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

  const r = await enviarResumenDiario();
  return NextResponse.json(r, { status: r.ok ? 200 : 502 });
}
