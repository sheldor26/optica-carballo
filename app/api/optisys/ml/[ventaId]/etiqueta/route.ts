import { NextResponse } from 'next/server';
import { autorizadoOptiSys } from '@/lib/auth/optisys';
import { createAdminClient } from '@/lib/supabase/admin';
import { getMLConfig } from '@/lib/integrations/mercadolibre/config';
import { getValidAccessToken } from '@/lib/integrations/mercadolibre/oauth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * La etiqueta de Mercado Envíos, en PDF, para que la imprima la óptica.
 *
 * `ventaId` es el `external_id` —el id de la orden— y NO el número que se ve en
 * el panel de Mercado Libre, que es el `pack_id`. La óptica muestra el segundo
 * y pide por el primero, a propósito: el id de orden es la clave estable, el
 * pack puede venir vacío.
 *
 * POR QUÉ NO USA `mlFetch`
 *
 * Porque mlFetch no puede traerla. Escribe `Accept: application/json` DESPUÉS
 * de esparcir los headers del que llama —o sea que no se puede pisar— y termina
 * con `await response.json()`. Una etiqueta es un PDF: el parseo tira y vuelve
 * un error genérico. Así que acá se pide el token con la misma función de
 * siempre y se hace el fetch a mano, que es la única parte que no se puede
 * reusar.
 *
 * POR QUÉ VIVE ACÁ Y NO EN LA ÓPTICA
 *
 * Porque el token de Mercado Libre vive en esta base y se descifra con una
 * clave que sólo tiene este proyecto. La óptica no tiene —ni tiene por qué
 * tener— credenciales de ML: pide la etiqueta por este endpoint con el mismo
 * token de OptiSys que ya usa para los pedidos web.
 *
 * Sin Mercado Envíos no hay `shipment_id` y no hay etiqueta: se contesta 409 y
 * la pantalla lo explica, en vez de mostrar un PDF vacío.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ ventaId: string }> },
) {
  const rechazo = autorizadoOptiSys(request);
  if (rechazo) return rechazo;

  const { ventaId } = await params;
  const supabase = createAdminClient();

  const { data: venta, error } = await supabase
    .from('marketplace_orders')
    .select('shipment_id, external_id')
    .eq('marketplace', 'mercadolibre')
    .eq('external_id', ventaId)
    .maybeSingle();

  // El error de Supabase se mira antes que el dato. Sin esto, una base caída o
  // una clave vencida se contestaban con 404 'venta_no_encontrada', y del otro
  // lado alguien iba a buscar en el panel de ML una venta que sí existe.
  if (error) {
    console.error('etiqueta ML: no se pudo leer la venta', ventaId, error.message);
    return NextResponse.json({ ok: false, error: 'base_no_disponible' }, { status: 503 });
  }
  if (!venta) {
    return NextResponse.json({ ok: false, error: 'venta_no_encontrada' }, { status: 404 });
  }
  if (!venta.shipment_id) {
    return NextResponse.json(
      { ok: false, error: 'sin_envio', detalle: 'La venta no tiene envío de Mercado Envíos.' },
      { status: 409 },
    );
  }

  const token = await getValidAccessToken();
  if (!token.ok) {
    return NextResponse.json({ ok: false, error: token.error }, { status: 502 });
  }

  const config = getMLConfig();
  const url =
    `${config.apiBase}/shipment_labels` +
    `?shipment_ids=${encodeURIComponent(venta.shipment_id)}&response_type=pdf`;

  let respuesta: Response;
  try {
    respuesta = await fetch(url, {
      headers: { Authorization: `Bearer ${token.data.accessToken}` },
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'network_error' }, { status: 502 });
  }

  if (!respuesta.ok) {
    return NextResponse.json(
      { ok: false, error: 'ml_rechazo', status: respuesta.status },
      { status: 502 },
    );
  }

  const pdf = await respuesta.arrayBuffer();
  return new NextResponse(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      // `inline` y no `attachment`: se abre en una pestaña y se imprime desde
      // ahí, que es lo que se hace con una etiqueta. Bajarla a la carpeta de
      // Descargas para después buscarla es un paso de más en el mostrador.
      'Content-Disposition': `inline; filename="etiqueta-${venta.external_id}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}
