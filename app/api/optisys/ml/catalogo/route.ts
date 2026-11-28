import { NextResponse } from 'next/server';
import { autorizadoOptiSys } from '@/lib/auth/optisys';
import { mlFetch } from '@/lib/integrations/mercadolibre/api-client';
import {
  leerDeCatalogo,
  leerPagina,
  leerPedido,
  POR_TANDA,
  type PublicacionDeCatalogo,
} from '@/lib/integrations/mercadolibre/catalogo-optisys';
import { getActiveMLIntegration } from '@/lib/integrations/mercadolibre/integrations-repo';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

/** Cuántas publicaciones se piden a Mercado Libre a la vez. */
const A_LA_VEZ = 5;

/**
 * Las publicaciones del vendedor, de a tandas, para el sistema de la óptica.
 *
 * `?estado=active|paused[&cursor=…]` trae la tanda que sigue; `?ids=…` vuelve a
 * pedir las que fallaron.
 *
 * SÓLO LECTURA: `items/search` y `/items/{id}`. No toca publicaciones, stock ni
 * tablas del catálogo. Lo único que puede escribir es lo que ya hace `mlFetch`
 * (renovar el token y anotar errores).
 *
 * De a una publicación porque Mercado Libre dio de baja `/items?ids=`.
 *
 * CONTRATO CON LA ÓPTICA: un pedido mal armado se contesta 400
 * `pedido_invalido` sin salir a Mercado Libre. Sin publicar, contesta 404.
 */
export async function GET(request: Request) {
  const rechazo = autorizadoOptiSys(request);
  if (rechazo) return rechazo;

  const pedido = leerPedido(new URL(request.url).searchParams);
  if (!pedido) return falla('pedido_invalido', 400);

  // Un solo plazo para todo: la óptica espera 40 segundos.
  const corte = AbortSignal.timeout(30_000);
  const pedir = (ruta: string) =>
    mlFetch<unknown>(ruta, {
      operation: 'optisys_catalogo',
      cache: 'no-store',
      signal: AbortSignal.any([corte, AbortSignal.timeout(10_000)]),
    });

  const publicaciones: PublicacionDeCatalogo[] = [];
  const fallidas: string[] = [];
  let deCatalogo = 0;
  let limitado = false;

  const una = async (id: string) => {
    if (limitado || corte.aborted) return void fallidas.push(id);
    try {
      const r = await pedir(`/items/${id}?include_attributes=all`);
      if (!r.ok) {
        if (r.error === 'rate_limited') limitado = true;
        if (r.error !== 'not_found') fallidas.push(id);
        return;
      }
      const leida = leerDeCatalogo(r.data, id);
      if (leida === 'catalogo') deCatalogo++;
      else if (leida) publicaciones.push(leida);
      else fallidas.push(id);
    } catch (e) {
      console.error('catálogo ML: falló', id, e instanceof Error ? e.message : e);
      fallidas.push(id);
    }
  };

  let ids: string[];
  let siguiente: string | null = null;
  let total: number | null = null;
  // Cuántas van solas antes de pedir en paralelo (ver más abajo).
  let solas = 0;

  if (pedido.modo === 'pagina') {
    const vendedor = (await getActiveMLIntegration())?.externalUserId;
    if (!vendedor || !/^\d+$/.test(vendedor)) return falla('sin_conexion_ml', 502);
    const cursor = pedido.cursor ? `&scroll_id=${encodeURIComponent(pedido.cursor)}` : '';
    let r;
    try {
      r = await pedir(
        `/users/${vendedor}/items/search?search_type=scan&status=${pedido.estado}&limit=${POR_TANDA}${cursor}`,
      );
    } catch (e) {
      console.error('catálogo ML: falló la lista', e instanceof Error ? e.message : e);
      return falla('ml_no_disponible', 502);
    }
    if (!r.ok) return falla(r.error, r.error === 'rate_limited' ? 429 : 502);
    const pagina = leerPagina(r.data);
    if (!pagina) return falla('respuesta_inesperada', 502);
    ({ ids, siguiente, total } = pagina);
  } else {
    ids = pedido.ids;
    // `mlFetch` renueva el token sin candado: el primer pedido va solo. En una
    // página ese lugar ya lo ocupó la lista.
    solas = 1;
  }

  for (const id of ids.slice(0, solas)) await una(id);
  for (let i = solas; i < ids.length; i += A_LA_VEZ) {
    await Promise.all(ids.slice(i, i + A_LA_VEZ).map(una));
  }

  return responder(
    { ok: true, publicaciones, deCatalogo, fallidas, siguiente, total },
    200,
  );
}

function responder(cuerpo: object, status: number) {
  return NextResponse.json(cuerpo, { status, headers: { 'Cache-Control': 'no-store' } });
}

function falla(error: string, status: number) {
  return responder({ ok: false, error }, status);
}
