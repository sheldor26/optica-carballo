import { NextResponse } from 'next/server';
import { autorizadoOptiSys } from '@/lib/auth/optisys';
import { mlFetch } from '@/lib/integrations/mercadolibre/api-client';
import { leerPublicacion, ML_ITEM_ID } from '@/lib/integrations/mercadolibre/publicacion';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Los datos de UNA publicación de Mercado Libre, para el sistema de la óptica.
 *
 * SÓLO LECTURA: un GET a `/items/{id}` y nada más. No toca publicaciones ni
 * tablas del catálogo. Lo único que puede escribir es lo que ya hace `mlFetch`
 * (renovar el token si está por vencer y anotar errores).
 *
 * `include_attributes=all` es lo que trae los atributos de cada variación, y
 * ahí viene el SKU del vendedor (SELLER_SKU).
 *
 * VIVE ACÁ por lo mismo que la etiqueta: el token de Mercado Libre está en este
 * proyecto. La óptica pide con `OPTISYS_TOKEN`.
 *
 * CONTRATO CON LA ÓPTICA: un id que no es de publicación se contesta 400
 * `publicacion_invalida` SIN salir a Mercado Libre ni tocar la base. El sistema
 * lo usa para saber si esta consulta ya está publicada (sin publicar, contesta
 * 404) y recién ahí muestra el botón. No cambiar ese código sin avisar allá.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const rechazo = autorizadoOptiSys(request);
  if (rechazo) return rechazo;

  const { itemId } = await params;
  if (!ML_ITEM_ID.test(itemId)) return falla('publicacion_invalida', 400);

  let resultado;
  try {
    resultado = await mlFetch<unknown>(`/items/${itemId}?include_attributes=all`, {
      operation: 'optisys_publicacion',
      cache: 'no-store',
      // La óptica espera 15 segundos: acá se corta antes.
      signal: AbortSignal.timeout(10_000),
    });
  } catch (e) {
    console.error('publicación ML: falló la consulta', itemId, e instanceof Error ? e.message : e);
    return falla('ml_no_disponible', 502);
  }

  if (!resultado.ok) {
    if (resultado.error === 'not_found') return falla('publicacion_no_encontrada', 404);
    return falla(resultado.error, resultado.error === 'rate_limited' ? 429 : 502);
  }

  const publicacion = leerPublicacion(resultado.data, itemId);
  if (!publicacion) {
    // Sin volcar la respuesta: alcanza con saber cuál fue.
    console.error('publicación ML: respuesta con forma inesperada', itemId);
    return falla('respuesta_inesperada', 502);
  }

  return responder({ ok: true, publicacion }, 200);
}

function responder(cuerpo: object, status: number) {
  return NextResponse.json(cuerpo, { status, headers: { 'Cache-Control': 'no-store' } });
}

function falla(error: string, status: number) {
  return responder({ ok: false, error }, status);
}
