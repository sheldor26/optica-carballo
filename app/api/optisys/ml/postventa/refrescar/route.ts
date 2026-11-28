import { NextResponse } from 'next/server';
import { autorizadoOptiSys } from '@/lib/auth/optisys';
import { refrescarPostventa } from '@/lib/integrations/mercadolibre/postventa';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Traer los reclamos de Mercado Libre AHORA, a pedido de la óptica.
 *
 * Es el recorrido rápido: abiertos, marcados para refrescar y devoluciones en
 * camino (sin historial ni cerrados recientes), más la reputación si tiene más
 * de una hora, y los avisos que correspondan sin repetir. No reemplaza a la
 * tarea de cada hora.
 *
 * Si hubo un recorrido completo hace menos de 4 minutos, o hay uno en curso,
 * contesta sin llamar a Mercado Libre (`omitido: true`).
 *
 * Respuesta: `{ ok, actualizado_en, omitido }`. `ok: false` = no se pudo
 * completar; `actualizado_en` es siempre el último recorrido completo.
 *
 * Misma llave y mismo motivo para ser POST que /api/optisys/ml/refrescar.
 */
export async function POST(request: Request) {
  const rechazo = autorizadoOptiSys(request);
  if (rechazo) return rechazo;

  try {
    const r = await refrescarPostventa();
    return responder(r, r.error ? 502 : 200);
  } catch (err) {
    console.error('[ml-postventa] no se pudo refrescar', err);
    return responder(
      { ok: false, actualizado_en: null, omitido: false, error: 'unknown' },
      502,
    );
  }
}

function responder(cuerpo: object, status: number) {
  return NextResponse.json(cuerpo, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}
