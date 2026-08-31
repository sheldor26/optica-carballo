import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { mlFetch } from '@/lib/integrations/mercadolibre/api-client';
import { getValidAccessToken } from '@/lib/integrations/mercadolibre/oauth';
import type { SyncResult } from '@/lib/integrations/mercadolibre/types';

/**
 * Traer las ventas de Mercado Libre y guardarlas.
 *
 * POR QUÉ ESTO EXISTE, SI YA HAY UN WEBHOOK
 *
 * El webhook de `orders_v2` está ignorado a propósito desde el sprint 2b: el
 * argumento escrito en app/api/ml/webhook/route.ts es que "el sync via items
 * cubre el efecto". Y es cierto para el stock — ML baja la cantidad de la
 * publicación, eso dispara un webhook `items` y sync-stock lo trae— pero el
 * efecto no es la venta. Quién compró, qué compró y a cuánto no se deducen de
 * un cambio de stock, y son justo los tres datos que la óptica necesita para
 * dar de alta al cliente, cobrar y descontar del mostrador.
 *
 * No se toca ese webhook. Anda, mantiene el stock al día y es lo que hoy
 * sostiene la tienda. Esto es una tarea programada aparte, que le pregunta a ML
 * por las ventas del último rato. Además de no romper nada, resuelve solo el
 * problema del historial: los webhooks viejos ya no se pueden recuperar —ML
 * reintenta un tiempo y deja— pero una consulta por rango de fechas sí trae lo
 * que pasó antes.
 *
 * DOS LLAMADAS POR VENTA, Y NO ES UN DESCUIDO
 *
 * `/orders/search` NO trae el nombre del comprador. Su `buyer` tiene dos campos
 * y nada más: `id` y `nickname`. Verificado contra la API el 29/08/2026 sobre
 * las 18 ventas de los últimos diez días — en las 18, `first_name` y
 * `last_name` vienen `undefined`.
 *
 * El nombre está en el detalle, `GET /orders/{id}`, cuyo `buyer` sí trae
 * `first_name`, `last_name` y `billing_info`. Y el nombre no es un adorno: la
 * regla de Juan es "no completes con el nombre de usuario, sino con los datos
 * del comprador para la facturación". Sin esa segunda llamada, la ficha de cada
 * venta salía a nombre de nadie y la pantalla de la óptica mostraba
 * "(sin nombre)" para siempre. Así que se paga: una llamada más por venta.
 *
 * Y una TERCERA por venta cuando hay envío: `/shipments/{id}`, por la dirección
 * Y por el estado — Mercado Libre no entrega la etiqueta de un envío ya
 * despachado, así que sin el estado la óptica ofrece imprimir algo imposible.
 * Tampoco viene en la orden —`receiver_address` es `undefined` en las 18
 * verificadas— y Juan la pidió para dejarla anotada en el cliente. Es a lo
 * sumo el mismo trabajo que ya se hace: con dos ventas por día, son unas pocas
 * llamadas por corrida.
 *
 * Lo que NO se pide es `/orders/{id}/billing_info`: contesta 403 con los
 * permisos de esta aplicación.
 *
 * IDEMPOTENTE POR CONSTRUCCIÓN
 *
 * Cada corrida vuelve a ver las mismas ventas: se pisan con `upsert` contra la
 * clave (marketplace, external_id) y, en los renglones, contra
 * (order_id, ml_item_id, ml_variation_id), que en la migración es
 * `NULLS NOT DISTINCT` justamente porque `ml_variation_id` es null en casi
 * todas. Eso también cubre el caso real de que una venta cambie —se cancela, se
 * despacha, cambia el estado del envío— porque la fila se actualiza con lo
 * último que dice ML.
 */

/** Cuánto para atrás mira cada corrida. Ver `traerVentas`. */
const DIAS_POR_OMISION = 7;

/**
 * Cuántas páginas como mucho. ML pagina de a 50.
 *
 * El tope existe para que una corrida no se coma el tiempo de la función. Con
 * 50 por página son 1.000 ventas, muy por encima de lo que la óptica vende en
 * una semana —18 en los últimos diez días— y el historial completo entra en
 * pocas corridas ampliando los días.
 */
const PAGINAS_MAX = 20;
const POR_PAGINA = 50;

type MLOrderItem = {
  item?: {
    id?: string;
    title?: string;
    variation_id?: number | string | null;
    seller_custom_field?: string | null;
    seller_sku?: string | null;
  };
  quantity?: number;
  unit_price?: number;
};

type MLOrder = {
  id?: number | string;
  pack_id?: number | string | null;
  status?: string;
  date_created?: string;
  total_amount?: number;
  order_items?: MLOrderItem[];
  buyer?: {
    nickname?: string;
    /** Sólo llega en el detalle, /orders/{id}. En la búsqueda viene undefined. */
    first_name?: string;
    last_name?: string;
  };
  shipping?: { id?: number | string | null } | null;
};

type MLBusqueda = { results?: MLOrder[]; paging?: { total?: number } };

/** Lo poco que hace falta del envío: en qué anda y a dónde va el paquete. */
type MLEnvio = {
  status?: string | null;
  substatus?: string | null;
  destination?: {
    shipping_address?: {
      address_line?: string | null;
      street_name?: string | null;
      street_number?: string | null;
      zip_code?: string | null;
      city?: { name?: string | null } | null;
      state?: { name?: string | null; id?: string | null } | null;
    } | null;
  } | null;
};

type Envio = {
  estado: string | null;
  subestado: string | null;
  calle: string | null;
  localidad: string | null;
  provincia: string | null;
  cp: string | null;
};

const SIN_ENVIO: Envio = {
  estado: null, subestado: null,
  calle: null, localidad: null, provincia: null, cp: null,
};

/**
 * En qué anda el envío y a dónde va el paquete.
 *
 * Dos datos de una sola llamada. El estado importa tanto como la dirección: la
 * etiqueta sólo se puede pedir mientras el envío esté `ready_to_ship`, y sin
 * saberlo la óptica ofrece imprimir algo que Mercado Libre va a rechazar.
 *
 * Best effort a propósito: si el envío no contesta se sigue con la venta sin
 * estos datos. Son para saber, no algo sin lo cual la venta no se pueda cargar.
 *
 * `x-format-new` porque sin esa cabecera el recurso viene en el formato viejo,
 * donde la dirección está en otro lugar.
 */
async function traerEnvio(shipmentId: string | null): Promise<Envio> {
  if (!shipmentId) return SIN_ENVIO;

  const r = await mlFetch<MLEnvio>(`/shipments/${encodeURIComponent(shipmentId)}`, {
    operation: 'traer_envio',
    headers: { 'x-format-new': 'true' },
  });
  if (!r.ok) return SIN_ENVIO;

  const estado = comoTexto(r.data.status);
  const subestado = comoTexto(r.data.substatus);

  const d = r.data.destination?.shipping_address ?? null;
  if (!d) return { ...SIN_ENVIO, estado, subestado };

  // `address_line` ya viene armada ("Pellegrini 1234"); si falta, se arma con
  // la calle y el número, que es lo mismo escrito en dos campos.
  const calle =
    comoTexto(d.address_line) ??
    [comoTexto(d.street_name), comoTexto(d.street_number)].filter(Boolean).join(' ') ??
    null;

  return {
    estado,
    subestado,
    calle: calle && calle.length > 0 ? calle : null,
    localidad: comoTexto(d.city?.name),
    provincia: comoTexto(d.state?.name) ?? comoTexto(d.state?.id),
    cp: comoTexto(d.zip_code),
  };
}

/** Los pesos con decimales que manda ML, a centavos enteros. */
function aCentavos(valor: number | undefined | null): number {
  if (typeof valor !== 'number' || !isFinite(valor)) return 0;
  return Math.round(valor * 100);
}

/** Un número de ML (largo, a veces numérico) como texto, o null si no vino. */
function comoTexto(valor: unknown): string | null {
  if (valor === undefined || valor === null) return null;
  const t = String(valor).trim();
  return t.length > 0 ? t : null;
}

/**
 * El código de variación, como texto y en el formato que guarda la tienda.
 *
 * `product_variants.mercadolibre_variation_code` tiene tres formas distintas
 * según cómo se publicó: 157 filas en null (publicación sin variaciones), 93
 * con el id numérico de la variación, y 4 con el seller_custom_field. Un
 * renglón de una venta trae `variation_id` y `seller_custom_field`, así que se
 * prueban los dos contra la base — igual que hace `variationMatches` en
 * sync-stock.ts para el camino inverso.
 */
function codigosDeVariacion(r: MLOrderItem): string[] {
  const codigos: string[] = [];
  const v = comoTexto(r.item?.variation_id);
  if (v) codigos.push(v);
  const propio = comoTexto(r.item?.seller_custom_field) ?? comoTexto(r.item?.seller_sku);
  if (propio) codigos.push(propio);
  return codigos;
}

/**
 * Qué variante de la tienda es este renglón.
 *
 * Devuelve null cuando la publicación no está linkeada, que HOY ES EL CASO
 * NORMAL y no un error: ML avisó sobre 847 publicaciones distintas y la tienda
 * tiene 188 linkeadas. Las otras se resuelven del lado de la óptica, donde una
 * persona elige el artículo una vez y queda aprendido.
 */
async function buscarVariante(
  supabase: ReturnType<typeof createAdminClient>,
  itemId: string,
  codigos: string[],
): Promise<{ id: string; sku: string } | null> {
  const { data } = await supabase
    .from('product_variants')
    .select('id, sku, mercadolibre_variation_code')
    .eq('mercadolibre_item_id', itemId);

  const filas = data ?? [];
  const unica = filas.length === 1 ? filas[0] : undefined;

  // Publicación sin variaciones: una sola fila y sin código. Es el caso de 157
  // de las 254. Se saca a una variable porque el proyecto compila con
  // `noUncheckedIndexedAccess`: acá `filas[0]` es "puede ser undefined" aunque
  // el largo diga que hay uno, y el compilador tiene razón en no creerme.
  if (unica && !unica.mercadolibre_variation_code) {
    return { id: unica.id, sku: unica.sku };
  }

  const encontrada = filas.find(
    (f) => f.mercadolibre_variation_code && codigos.includes(f.mercadolibre_variation_code),
  );
  return encontrada ? { id: encontrada.id, sku: encontrada.sku } : null;
}

export type ResumenVentas = {
  paginas: number;
  vistas: number;
  guardadas: number;
  renglones: number;
  sin_variante: number;
  sin_nombre: number;
  sin_direccion: number;
  errores: string[];
};

/**
 * @param dias cuántos días para atrás mirar. Ampliarlo trae el historial.
 */
export async function traerVentas(dias = DIAS_POR_OMISION): Promise<SyncResult<ResumenVentas>> {
  const token = await getValidAccessToken();
  if (!token.ok) return token as SyncResult<ResumenVentas>;

  const supabase = createAdminClient();
  const desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString();
  const resumen: ResumenVentas = {
    paginas: 0,
    vistas: 0,
    guardadas: 0,
    renglones: 0,
    sin_variante: 0,
    sin_nombre: 0,
    sin_direccion: 0,
    errores: [],
  };

  for (let pagina = 0; pagina < PAGINAS_MAX; pagina++) {
    const offset = pagina * POR_PAGINA;
    const url =
      `/orders/search?seller=${encodeURIComponent(token.data.externalUserId)}` +
      `&order.date_created.from=${encodeURIComponent(desde)}` +
      `&sort=date_desc&limit=${POR_PAGINA}&offset=${offset}`;

    const r = await mlFetch<MLBusqueda>(url, { operation: 'traer_ventas' });
    if (!r.ok) {
      // Se corta y se informa: la próxima corrida vuelve a empezar y el rango
      // de días cubre lo que quedó sin traer. Cortar es mejor que seguir
      // pidiendo páginas cuando el token se venció o ML está limitando.
      resumen.errores.push(`página ${pagina}: ${r.error}`);
      break;
    }

    const ventas = r.data.results ?? [];
    resumen.paginas++;
    resumen.vistas += ventas.length;
    if (ventas.length === 0) break;

    for (const resumida of ventas) {
      const externalId = comoTexto(resumida.id);
      if (!externalId) continue;

      /*
       * EL DETALLE, POR EL NOMBRE.
       *
       * Si el detalle falla se sigue con lo que trajo la búsqueda en vez de
       * saltear la venta: es mejor una venta cargada sin nombre —que la óptica
       * muestra como "(sin nombre)" y se puede completar a mano— que una venta
       * que no aparece en ninguna parte. Queda contada en `sin_nombre`.
       */
      const detalle = await mlFetch<MLOrder>(`/orders/${encodeURIComponent(externalId)}`, {
        operation: 'traer_venta_detalle',
      });
      const venta: MLOrder = detalle.ok ? { ...resumida, ...detalle.data } : resumida;
      if (!detalle.ok) {
        resumen.errores.push(`detalle de ${externalId}: ${detalle.error}`);
      }

      const nombre = comoTexto(venta.buyer?.first_name);
      const apellido = comoTexto(venta.buyer?.last_name);
      if (!nombre && !apellido) resumen.sin_nombre++;

      const envioId = comoTexto(venta.shipping?.id);
      const envio = await traerEnvio(envioId);
      if (envioId && !envio.localidad) resumen.sin_direccion++;

      const { data: fila, error } = await supabase
        .from('marketplace_orders')
        .upsert(
          {
            marketplace: 'mercadolibre',
            external_id: externalId,
            pack_id: comoTexto(venta.pack_id),
            status: venta.status ?? 'desconocido',
            sold_at: venta.date_created ?? new Date().toISOString(),
            total_cents: aCentavos(venta.total_amount),
            buyer_nickname: comoTexto(venta.buyer?.nickname),
            buyer_nombre: nombre,
            buyer_apellido: apellido,
            shipment_id: envioId,
            buyer_direccion: envio.calle,
            buyer_localidad: envio.localidad,
            buyer_provincia: envio.provincia,
            buyer_cp: envio.cp,
            shipping_estado: envio.estado,
            shipping_subestado: envio.subestado,
            payload: venta as unknown as Record<string, unknown>,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'marketplace,external_id' },
        )
        .select('id')
        .single();

      if (error || !fila) {
        resumen.errores.push(`venta ${externalId}: ${error?.message ?? 'sin fila'}`);
        continue;
      }
      resumen.guardadas++;

      for (const renglon of venta.order_items ?? []) {
        const itemId = renglon.item?.id;
        if (!itemId) continue;

        const codigos = codigosDeVariacion(renglon);
        const variante = await buscarVariante(supabase, itemId, codigos);
        if (!variante) resumen.sin_variante++;

        const { error: errRenglon } = await supabase
          .from('marketplace_order_items')
          .upsert(
            {
              order_id: fila.id,
              ml_item_id: itemId,
              ml_variation_id: codigos[0] ?? null,
              seller_sku: comoTexto(renglon.item?.seller_sku ?? renglon.item?.seller_custom_field),
              title: renglon.item?.title ?? '(sin título)',
              quantity: renglon.quantity ?? 1,
              unit_price_cents: aCentavos(renglon.unit_price),
              variant_id: variante?.id ?? null,
              variant_sku: variante?.sku ?? null,
            },
            { onConflict: 'order_id,ml_item_id,ml_variation_id' },
          );

        if (errRenglon) resumen.errores.push(`renglón de ${externalId}: ${errRenglon.message}`);
        else resumen.renglones++;
      }
    }

    if (ventas.length < POR_PAGINA) break;
  }

  return { ok: true, data: resumen };
}
