import { NextResponse } from 'next/server';
import { autorizadoOptiSys } from '@/lib/auth/optisys';
import { mlFetch } from '@/lib/integrations/mercadolibre/api-client';
import {
  leerFotos,
  leerIds,
  PUBLICACIONES_POR_LLAMADA,
  type FotosDePublicacion,
} from '@/lib/integrations/mercadolibre/publicacion';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Las fotos de VARIAS publicaciones de Mercado Libre, para la pantalla de ventas
 * de la óptica: `?ids=MLA1,MLA2`.
 *
 * SÓLO LECTURA, como la consulta de una (`publicacion/[itemId]`). Usa el
 * multiget `/items?ids=`, que acepta hasta 20 por llamada, así una pantalla de
 * ventas no hace un pedido por artículo.
 *
 * LAS TANDAS VAN DE A UNA, no en paralelo: `mlFetch` renueva el token si está
 * por vencer y esa renovación no tiene candado.
 */
export async function GET(request: Request) {
  const rechazo = autorizadoOptiSys(request);
  if (rechazo) return rechazo;

  const ids = leerIds(new URL(request.url).searchParams.get('ids'));
  if (!ids) return falla('publicaciones_invalidas', 400);

  // Un solo plazo para todo: la óptica espera 15 segundos.
  const corte = AbortSignal.timeout(12_000);
  const publicaciones: FotosDePublicacion[] = [];
  let llegaron = 0;
  let error: string | null = null;

  for (let i = 0; i < ids.length; i += PUBLICACIONES_POR_LLAMADA) {
    const tanda = ids.slice(i, i + PUBLICACIONES_POR_LLAMADA);
    try {
      const r = await mlFetch<unknown>(`/items?ids=${tanda.join(',')}`, {
        operation: 'optisys_publicaciones',
        cache: 'no-store',
        signal: corte,
      });
      const leidas = r.ok ? leerFotos(r.data, tanda) : null;
      if (leidas) {
        publicaciones.push(...leidas);
        llegaron++;
        continue;
      }
      error = r.ok ? 'respuesta_inesperada' : r.error;
    } catch (e) {
      console.error('publicaciones ML: falló la consulta', e instanceof Error ? e.message : e);
      error = 'ml_no_disponible';
    }
    // Con el límite alcanzado o sin tiempo, insistir no sirve.
    if (error === 'rate_limited' || corte.aborted) break;
  }

  if (llegaron === 0) {
    return falla(error ?? 'ml_no_disponible', error === 'rate_limited' ? 429 : 502);
  }
  return responder({ ok: true, publicaciones, incompleta: error !== null }, 200);
}

function responder(cuerpo: object, status: number) {
  return NextResponse.json(cuerpo, { status, headers: { 'Cache-Control': 'no-store' } });
}

function falla(error: string, status: number) {
  return responder({ ok: false, error }, status);
}
