import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { secretsMatch } from '@/lib/security/timing-safe-equal';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * CRON — retención de los mensajes del bot de WhatsApp (ADR-028).
 *
 * La política de privacidad promete borrar los mensajes a los 90 días (12 meses
 * si la conversación se derivó a una persona). Este cron cumple esa promesa
 * llamando a `whatsapp_purgar_mensajes()`, que borra los mensajes vencidos y las
 * conversaciones que quedaron vacías.
 *
 * Corre una vez por día (ver vercel.json) y SIEMPRE, aunque el bot esté
 * apagado: los datos que ya se guardaron se borran igual.
 * Autorizado vía CRON_SECRET (mismo patrón que los otros crons).
 */
export async function GET(request: Request) {
  const auth = request.headers.get('authorization') ?? '';
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || !secretsMatch(auth, expected)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc('whatsapp_purgar_mensajes');

  if (error) {
    console.error('[whatsapp-retencion] falló el borrado:', error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const fila = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({
    ok: true,
    mensajes_borrados: fila?.mensajes_borrados ?? 0,
    conversaciones_borradas: fila?.conversaciones_borradas ?? 0,
  });
}
