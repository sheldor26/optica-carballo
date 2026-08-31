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
 * VARIAS DE UNA, SEPARADAS POR COMA
 *
 * "2000018203163044,2000018192883664,2000018189156770" devuelve UNA hoja con las
 * tres etiquetas. No lo componemos nosotros: `/shipment_labels` acepta varios
 * `shipment_ids` y arma la hoja él. Verificado contra la API el 31/08/2026 —tres
 * envíos reales dieron una sola página A4 apaisada (297 x 210 mm) con las tres
 * etiquetas lado a lado, que es exactamente como Juan las viene pegando.
 *
 * Es también el motivo de que se pidan TODAS en una llamada y no una por una:
 * pidiéndolas de a una salen tres hojas con una etiqueta cada una.
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

  // Un tope, para que un link armado a mano no le pida cien etiquetas a ML.
  const ordenes = ventaId.split(',').map((x) => x.trim()).filter((x) => /^\d{1,20}$/.test(x));
  if (ordenes.length === 0 || ordenes.length > 20) {
    return NextResponse.json({ ok: false, error: 'ventas_invalidas' }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: ventas, error } = await supabase
    .from('marketplace_orders')
    .select('shipment_id, external_id')
    .eq('marketplace', 'mercadolibre')
    .in('external_id', ordenes);

  // El error de Supabase se mira antes que el dato. Sin esto, una base caída o
  // una clave vencida se contestaban con 404 'venta_no_encontrada', y del otro
  // lado alguien iba a buscar en el panel de ML una venta que sí existe.
  if (error) {
    console.error('etiqueta ML: no se pudo leer la venta', ventaId, error.message);
    return NextResponse.json({ ok: false, error: 'base_no_disponible' }, { status: 503 });
  }
  if (!ventas || ventas.length === 0) {
    return NextResponse.json({ ok: false, error: 'venta_no_encontrada' }, { status: 404 });
  }

  /*
   * Las que no tienen envío se dejan afuera en vez de tirar todo abajo.
   *
   * Pidiendo diez etiquetas, que una sea de una venta sin Mercado Envíos no es
   * motivo para no imprimir las otras nueve. Sólo se corta si NINGUNA tiene.
   */
  const envios = ventas.map((v) => v.shipment_id).filter((x): x is string => !!x);
  if (envios.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'sin_envio', detalle: 'Ninguna de esas ventas tiene envío de Mercado Envíos.' },
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
    `?shipment_ids=${encodeURIComponent(envios.join(','))}&response_type=pdf`;

  let respuesta: Response;
  try {
    respuesta = await fetch(url, {
      headers: { Authorization: `Bearer ${token.data.accessToken}` },
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'network_error' }, { status: 502 });
  }

  if (!respuesta.ok) {
    /*
     * EL MOTIVO DE ML SE PASA, NO SE TAPA.
     *
     * Devolvía sólo 'ml_rechazo' y del otro lado eso se mostraba como "probá de
     * nuevo en un rato", que en el caso más común es mentira: Mercado Libre no
     * entrega la etiqueta de un envío ya despachado y no la va a entregar nunca
     * más. Contesta 400 con un `failed_shipments` que dice exactamente eso:
     *
     *   { "cause": "NOT_PRINTABLE_STATUS",
     *     "message": "Shipment 47895472625 status is shipped" }
     *
     * Con la causa a mano, la óptica puede decir "ya está despachada" en vez de
     * mandar a alguien a reintentar algo que no depende de él.
     */
    const cuerpo = await respuesta.text().catch(() => '');
    let causas: string[] = [];
    try {
      const j = JSON.parse(cuerpo) as {
        failed_shipments?: { cause?: string; message?: string }[];
      };
      causas = [
        ...new Set((j.failed_shipments ?? []).map((f) => f.cause ?? '').filter(Boolean)),
      ];
    } catch {
      // ML no siempre contesta json. El status alcanza para el que mira el log.
    }
    console.error('etiqueta ML: rechazo', respuesta.status, cuerpo.slice(0, 300));
    return NextResponse.json(
      { ok: false, error: 'ml_rechazo', status: respuesta.status, causas },
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
      'Content-Disposition': `inline; filename="etiquetas-${envios.length}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}
