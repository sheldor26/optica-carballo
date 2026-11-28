/**
 * Cómo se leen las respuestas de post-venta de Mercado Libre. Lógica pura: sin
 * red, sin base, sin secretos. La usa claims.ts y la prueba
 * scripts/ml-reclamos-selftest.ts.
 *
 * QUÉ ESTÁ CONFIRMADO
 *
 * CONFIRMADO contra la API real (consultas de prueba del founder, sólo GET,
 * scripts/ml-reclamos-prueba.ts y scripts/ml-reclamos-lectura.ts, 26 al 28/11/2026):
 *   - la búsqueda exige `status`: `players.*` y `range` no cuentan como filtro
 *     (400 atLeastOneFilterProvided), y `players.role` no filtra nada: las
 *     compras propias se descartan mirando `players`;
 *   - `range` por last_updated o date_created con `sort` funciona con status;
 *   - tipos cancel_purchase, mediations, returns, cancel_sale; etapas none,
 *     claim, dispute, recontact; `resource` order y shipment;
 *   - las formas del detalle del reclamo (`players[].available_actions`,
 *     `resolution`, `related_entities`), de `/detail` (responde 206), de
 *     `/affects-reputation`, de la devolución v2 (`shipments`, `orders` con
 *     cantidades como texto), del motivo, de la orden y de `seller_reputation`.
 *
 * SIN CONFIRMAR: el historial de envíos y los campos de `GET /shipments/{id}`
 * (status_history, tracking). Por eso los campos son opcionales y `unknown`, y
 * donde la documentación muestra dos formas se aceptan las dos.
 */

export type MLClaim = {
  id?: unknown;
  resource?: unknown;
  resource_id?: unknown;
  type?: unknown;
  stage?: unknown;
  status?: unknown;
  reason_id?: unknown;
  date_created?: unknown;
  last_updated?: unknown;
  /** `[{ role, type, user_id, available_actions: [{ action, mandatory, due_date }] }]` */
  players?: unknown;
  claimed_quantity?: unknown;
  quantity_type?: unknown;
  /** `["return"]` si hay devolución. La búsqueda no lo trae. */
  related_entities?: unknown;
  resolution?: {
    reason?: unknown;
    date_created?: unknown;
    /** Texto en los ejemplos; se acepta también lista. */
    benefited?: unknown;
    closed_by?: unknown;
    applied_coverage?: unknown;
  } | null;
};

/** `GET /post-purchase/v1/claims/{id}/detail`. `description` no se lee. */
export type MLDetalleReclamo = {
  due_date?: unknown;
  action_responsible?: unknown;
  title?: unknown;
  problem?: unknown;
};

/** `GET /post-purchase/v1/claims/{id}/affects-reputation`. */
export type MLImpacto = {
  affects_reputation?: unknown;
  has_incentive?: unknown;
  due_date?: unknown;
};

export type MLBusquedaReclamos = {
  data?: MLClaim[];
  paging?: { total?: number; offset?: number; limit?: number };
};

export type MLMotivo = { id?: unknown; name?: unknown; detail?: unknown };

export type MLEnvioDevolucion = {
  shipment_id?: unknown;
  id?: unknown;
  type?: unknown;
  status?: unknown;
  tracking_number?: unknown;
  destination?: { name?: unknown } | null;
  status_history?: unknown;
};

export type MLDevolucion = {
  id?: unknown;
  type?: unknown;
  subtype?: unknown;
  status?: unknown;
  status_money?: unknown;
  /** Regla de cuándo se reembolsa ('shipped' | 'delivered' | ...), no una fecha. */
  refund_at?: unknown;
  date_created?: unknown;
  date_closed?: unknown;
  resource_type?: unknown;
  resource_id?: unknown;
  orders?: Array<{
    order_id?: unknown;
    item_id?: unknown;
    variation_id?: unknown;
    /** Llegan como texto: "1.0". */
    total_quantity?: unknown;
    return_quantity?: unknown;
  }> | null;
  shipments?: MLEnvioDevolucion[] | null;
  /** Forma anterior: un solo envío. */
  shipping?: MLEnvioDevolucion | null;
};

/** `GET /shipments/{id}` sin la cabecera x-format-new. */
export type MLEnvioDetalle = {
  order_id?: unknown;
  status?: unknown;
  substatus?: unknown;
  tracking_number?: unknown;
  tracking_method?: unknown;
  status_history?: unknown;
};

/**
 * Lo único que se lee de `GET /orders/{id}`. Del comprador, sólo el número de
 * usuario y el apodo: ni nombre, ni documento, ni dirección.
 */
export type MLOrdenReclamo = {
  id?: unknown;
  pack_id?: unknown;
  status?: unknown;
  buyer?: { id?: unknown; nickname?: unknown } | null;
  order_items?: Array<{
    item?: {
      id?: unknown;
      title?: unknown;
      variation_id?: unknown;
      seller_sku?: unknown;
      seller_custom_field?: unknown;
      variation_attributes?: unknown;
    } | null;
    quantity?: unknown;
  }> | null;
  shipping?: { id?: unknown } | null;
  payments?: Array<{
    status?: unknown;
    transaction_amount_refunded?: unknown;
    date_last_modified?: unknown;
  }> | null;
};

/** Una acción que Mercado Libre le ofrece (o le exige) al vendedor. */
export type AccionVendedor = {
  action: string;
  mandatory: boolean;
  due_date: string | null;
};

/** Un artículo de la venta referida, como queda en `order_items`. */
export type ArticuloVenta = {
  order_id: string;
  item_id: string | null;
  variation_id: string | null;
  seller_sku: string | null;
  title: string | null;
  color: string | null;
  quantity: number | null;
};

/** Un artículo de la devolución, como queda en `return_items`. */
export type ArticuloDevuelto = {
  order_id: string | null;
  item_id: string | null;
  variation_id: string | null;
  return_quantity: number | null;
  total_quantity: number | null;
};

/**
 * Las columnas que dependen de una lectura que puede fallar y cuyo vacío SÍ es
 * un dato (ML dejó de informar un plazo, un turno o la devolución). Si la
 * lectura falló, la columna NO se manda en el upsert y queda como estaba; si se
 * leyó bien, se manda aunque sea null. Por eso son opcionales y el disparador
 * de la base no las conserva (ver la migración).
 */
export type ColumnasBorrables = {
  action_responsible: string | null;
  seller_actions: AccionVendedor[] | null;
  due_date: string | null;
  reputation_due_date: string | null;
  return_id: string | null;
  return_type: string | null;
  return_subtype: string | null;
  return_status: string | null;
  return_money_status: string | null;
  return_refund_trigger: string | null;
  return_opened_at: string | null;
  return_closed_at: string | null;
  return_shipment_id: string | null;
  return_shipment_status: string | null;
  return_shipment_substatus: string | null;
  return_tracking_number: string | null;
  return_tracking_method: string | null;
  return_shipped_at: string | null;
  return_delivered_at: string | null;
  return_shipments: TramoDevolucion[] | null;
  return_items: ArticuloDevuelto[] | null;
};

/** Un renglón de marketplace_claims, tal como se manda en el upsert. */
export type FilaReclamo = {
  marketplace: 'mercadolibre';
  claim_id: string;
  resource: string | null;
  resource_id: string | null;
  order_external_id: string | null;
  pack_id: string | null;
  claim_type: string | null;
  stage: string | null;
  status: string | null;
  reason_id: string | null;
  reason_name: string | null;
  reason_detail: string | null;
  resolution_reason: string | null;
  resolution_benefited: string | null;
  resolution_closed_by: string | null;
  resolution_coverage: boolean | null;
  claimed_quantity: number | null;
  quantity_type: string | null;
  opened_at: string | null;
  claim_updated_at: string | null;
  closed_at: string | null;
  refunded_at: string | null;
  refunded_at_source: 'order_payment' | 'claim_resolution' | null;
  original_delivered_at: string | null;
  buyer_id: string | null;
  buyer_nickname: string | null;
  detail_title: string | null;
  detail_problem: string | null;
  affects_reputation: string | null;
  has_incentive: boolean | null;
  order_status: string | null;
  order_items: ArticuloVenta[] | null;
  needs_refresh: boolean;
  synced_at: string;
} & Partial<ColumnasBorrables>;

/** Un hecho sobre el que se avisa (o se decidió no avisar). */
export type Hecho = {
  e: 'pendiente' | 'enviando' | 'enviado' | 'omitido';
  /** Cuándo cambió por última vez. */
  en: string;
  /** Cuándo se lo detectó. */
  visto: string;
};

/** La columna `notified`: control de los correos ya enviados. */
export type Notificado = {
  /** Cómo estaba el reclamo la última vez que se lo evaluó. */
  estado?: { status: string | null; turno: boolean; ref: string | null };
  hechos?: Record<string, Hecho>;
};

/** Un renglón tal como está en la base. */
export type ReclamoGuardado = Partial<FilaReclamo> & {
  claim_id: string;
  /** Cuándo se lo vio por primera vez (lo pone la base). */
  fetched_at: string;
  notified: Notificado | null;
};

export type TramoDevolucion = {
  shipment_id: string | null;
  type: string | null;
  status: string | null;
  tracking_number: string | null;
  destination: string | null;
};

export function texto(valor: unknown): string | null {
  if (typeof valor !== 'string' && typeof valor !== 'number') return null;
  const t = String(valor).trim();
  return t.length > 0 ? t : null;
}

/** Una fecha que Postgres pueda guardar, o null. */
export function fecha(valor: unknown): string | null {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(valor))
    return null;
  return Number.isNaN(Date.parse(valor)) ? null : valor;
}

/** Un número, aunque venga como texto ("1.0"). */
export function numero(valor: unknown): number | null {
  const t = texto(valor);
  if (t === null) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function siNo(valor: unknown): boolean | null {
  return typeof valor === 'boolean' ? valor : null;
}

export function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function jugadores(claim: MLClaim): Record<string, unknown>[] | null {
  return Array.isArray(claim.players) ? claim.players.filter(esObjeto) : null;
}

/** El rol de la cuenta en el reclamo, según `players`. */
export function rolDe(claim: MLClaim, userId: string): string | null {
  if (!Array.isArray(claim.players)) return null;
  for (const p of claim.players) {
    if (esObjeto(p) && texto(p.user_id) === userId) return texto(p.role);
  }
  return null;
}

/** El número de usuario de quien reclama (el comprador), si no somos nosotros. */
export function compradorDe(claim: MLClaim, userId: string): string | null {
  const p = jugadores(claim)?.find((j) => j.role === 'complainant');
  const id = texto(p?.user_id);
  return id === userId ? null : id;
}

/**
 * Lo que ML le ofrece o le exige al vendedor. `null` = la respuesta no permite
 * saberlo (sin `players` o sin nuestro jugador); lista vacía = no hay nada.
 */
export function accionesDelVendedor(
  claim: MLClaim,
  userId: string,
): AccionVendedor[] | null {
  const todos = jugadores(claim);
  if (!todos) return null;
  const yo =
    todos.find((j) => texto(j.user_id) === userId) ??
    todos.find((j) => j.role === 'respondent');
  if (!yo || yo.role === 'complainant') return null;
  const acciones = Array.isArray(yo.available_actions)
    ? yo.available_actions.filter(esObjeto)
    : [];
  return acciones.flatMap((a) => {
    const action = texto(a.action);
    return action
      ? [{ action, mandatory: a.mandatory === true, due_date: fecha(a.due_date) }]
      : [];
  });
}

/** Si el reclamo dice tener una devolución. `null` = no lo informa. */
export function diceTenerDevolucion(claim: MLClaim): boolean | null {
  if (!Array.isArray(claim.related_entities)) return null;
  return claim.related_entities.some((e) => texto(e)?.startsWith('return'));
}

/** La fecha más cercana entre las que no son nulas. */
export function menorFecha(
  ...fechas: Array<string | null | undefined>
): string | null {
  let menor: string | null = null;
  for (const f of fechas) {
    if (!f || Number.isNaN(Date.parse(f))) continue;
    if (menor === null || Date.parse(f) < Date.parse(menor)) menor = f;
  }
  return menor;
}

function colorDe(atributos: unknown): string | null {
  if (!Array.isArray(atributos)) return null;
  const color = atributos
    .filter(esObjeto)
    .find(
      (a) =>
        texto(a.id)?.toUpperCase() === 'COLOR' ||
        texto(a.name)?.toLowerCase() === 'color',
    );
  return texto(color?.value_name);
}

/** La foto de los artículos de una orden. `null` si la respuesta no los trae. */
export function articulosDeLaOrden(
  orden: MLOrdenReclamo | null,
  ordenId: string,
): ArticuloVenta[] | null {
  if (!orden || !Array.isArray(orden.order_items)) return null;
  const articulos = orden.order_items.filter(esObjeto).map((renglon) => {
    const r = renglon as NonNullable<MLOrdenReclamo['order_items']>[number];
    return {
      order_id: texto(orden.id) ?? ordenId,
      item_id: texto(r.item?.id),
      variation_id: texto(r.item?.variation_id),
      seller_sku:
        texto(r.item?.seller_sku) ?? texto(r.item?.seller_custom_field),
      title: texto(r.item?.title),
      color: colorDe(r.item?.variation_attributes),
      quantity: numero(r.quantity),
    };
  });
  return articulos.length > 0 ? articulos : null;
}

/** Qué artículos vuelven. `null` si la devolución no los detalla. */
export function articulosDeLaDevolucion(
  dev: MLDevolucion,
): ArticuloDevuelto[] | null {
  if (!Array.isArray(dev.orders)) return null;
  return dev.orders.filter(esObjeto).map((o) => ({
    order_id: texto(o.order_id),
    item_id: texto(o.item_id),
    variation_id: texto(o.variation_id),
    return_quantity: numero(o.return_quantity),
    total_quantity: numero(o.total_quantity),
  }));
}

/** Las columnas que salen directo del reclamo. */
export function datosDelReclamo(claim: MLClaim) {
  const status = texto(claim.status);
  const res = claim.resolution ?? null;
  const beneficiado = Array.isArray(res?.benefited)
    ? res.benefited.map(texto).filter(Boolean).join(',') || null
    : texto(res?.benefited);

  return {
    resource: texto(claim.resource),
    resource_id: texto(claim.resource_id),
    claim_type: texto(claim.type),
    stage: texto(claim.stage),
    status,
    reason_id: texto(claim.reason_id),
    resolution_reason: texto(res?.reason),
    resolution_benefited: beneficiado,
    resolution_closed_by: texto(res?.closed_by),
    resolution_coverage: siNo(res?.applied_coverage),
    claimed_quantity: numero(claim.claimed_quantity),
    quantity_type: texto(claim.quantity_type),
    opened_at: fecha(claim.date_created),
    claim_updated_at: fecha(claim.last_updated),
    // El reclamo no trae "fecha de cierre": es la de la resolución.
    closed_at: status === 'closed' ? fecha(res?.date_created) : null,
  };
}

/**
 * La devolución de la respuesta. La documentación muestra un objeto; se aceptan
 * también una lista o `{ data: [...] }` (SIN CONFIRMAR) y se toma la más nueva.
 */
export function elegirDevolucion(respuesta: unknown): MLDevolucion | null {
  const lista: unknown[] = Array.isArray(respuesta)
    ? respuesta
    : esObjeto(respuesta) && Array.isArray(respuesta.data)
      ? respuesta.data
      : [respuesta];

  const validas = lista.filter(
    (d): d is MLDevolucion =>
      esObjeto(d) &&
      ['id', 'status', 'status_money', 'shipments', 'shipping'].some(
        (k) => d[k] != null,
      ),
  );
  validas.sort(
    (a, b) =>
      Date.parse(fecha(b.date_created) ?? '') -
        Date.parse(fecha(a.date_created) ?? '') || 0,
  );
  return validas[0] ?? null;
}

export type LecturaDevolucion =
  | { que: 'hay'; devolucion: MLDevolucion }
  | { que: 'no_hay' }
  /** Contestó algo que no se entiende: no es lo mismo que "no hay". */
  | { que: 'ilegible' };

export function leerDevolucion(respuesta: unknown): LecturaDevolucion {
  const devolucion = elegirDevolucion(respuesta);
  if (devolucion) return { que: 'hay', devolucion };
  const lista = Array.isArray(respuesta)
    ? respuesta
    : esObjeto(respuesta) && Array.isArray(respuesta.data)
      ? respuesta.data
      : null;
  return lista && lista.length === 0 ? { que: 'no_hay' } : { que: 'ilegible' };
}

/** Los tramos de envío, filtrados: nada de direcciones ni nombres. */
export function tramosDe(dev: MLDevolucion): TramoDevolucion[] {
  const crudos = Array.isArray(dev.shipments)
    ? dev.shipments
    : dev.shipping
      ? [dev.shipping]
      : [];
  return crudos.filter(esObjeto).map((e: MLEnvioDevolucion) => {
    const destino = texto(e.destination?.name);
    return {
      shipment_id: texto(e.shipment_id) ?? texto(e.id),
      type: texto(e.type),
      status: texto(e.status),
      tracking_number: texto(e.tracking_number),
      // Sólo códigos como 'seller_address' o 'warehouse'; si viniera un nombre, no entra.
      destination: destino && /^[a-z_]{1,40}$/.test(destino) ? destino : null,
    };
  });
}

/** Depósito de Mercado Libre: lo que llega ahí todavía no llegó a la óptica. */
export const DESTINO_DEPOSITO = 'warehouse';

/**
 * El tramo principal: el que viene al vendedor; si no se sabe, el que sale del
 * comprador (`return`), o el primero.
 */
export function tramoPrincipal(
  tramos: TramoDevolucion[],
): TramoDevolucion | null {
  return (
    tramos.find((t) => t.destination === 'seller_address') ??
    tramos.find((t) => t.type === 'return') ??
    tramos[0] ??
    null
  );
}

/** La orden a la que apunta la devolución, si lo dice. */
export function ordenDeLaDevolucion(dev: MLDevolucion): string | null {
  if (texto(dev.resource_type) === 'order') {
    const id = texto(dev.resource_id);
    if (id) return id;
  }
  return texto(dev.orders?.[0]?.order_id);
}

/**
 * Cuándo un envío pasó por un estado.
 *
 * La documentación muestra tres formas, y se aceptan las tres: `status_history`
 * como objeto (`{ date_delivered }`), como lista (`[{ status, date }]`), o la
 * lista suelta que devuelve /shipments/{id}/history.
 */
export function fechaDeEstado(
  envio: unknown,
  estado: 'shipped' | 'delivered',
): string | null {
  if (!envio) return null;
  if (Array.isArray(envio)) {
    const fechas = envio
      .filter((h) => esObjeto(h) && h.status === estado)
      .map((h) => fecha((h as Record<string, unknown>).date))
      .filter((f): f is string => f !== null)
      .sort((a, b) => Date.parse(a) - Date.parse(b));
    return fechas[0] ?? null;
  }
  if (!esObjeto(envio)) return null;
  return (
    fecha(envio[`date_${estado}`]) ??
    fechaDeEstado(envio.status_history, estado) ??
    fechaDeEstado(envio.history, estado) ??
    fechaDeEstado(envio.results, estado)
  );
}

/** Si hay motivos para creer que se devolvió plata (y vale pedir la orden). */
export function huboReembolso(
  dineroDevolucion: string | null,
  claim: MLClaim,
): boolean {
  const motivo = texto(claim.resolution?.reason);
  const beneficiado = String(claim.resolution?.benefited ?? '');
  return (
    dineroDevolucion === 'refunded' ||
    motivo === 'payment_refunded' ||
    motivo === 'item_returned' ||
    beneficiado.includes('complainant')
  );
}

/** La modificación más nueva entre los pagos devueltos (total o parcialmente). */
export function fechaDeReembolso(orden: MLOrdenReclamo | null): string | null {
  const fechas = (orden?.payments ?? [])
    .filter(
      (p) =>
        p.status === 'refunded' ||
        (typeof p.transaction_amount_refunded === 'number' &&
          p.transaction_amount_refunded > 0),
    )
    .map((p) => fecha(p.date_last_modified))
    .filter((f): f is string => f !== null)
    .sort((a, b) => Date.parse(b) - Date.parse(a));
  return fechas[0] ?? null;
}

/** Estados de devolución que ya no cambian. 'delivered' depende además de la plata. */
export const DEVOLUCION_TERMINADA = new Set([
  'cancelled',
  'expired',
  'closed',
  'failed',
]);

/** Pasado este plazo desde el cierre, no se insiste más. */
export const DIAS_MAX_SEGUIMIENTO = 90;

export function hayQueVolverAMirar(args: {
  status: string | null;
  devolucion: { status: string | null; dinero: string | null } | null;
  fallo: boolean;
  referencia: string | null;
  ahora: number;
}): boolean {
  const { status, devolucion, fallo, referencia, ahora } = args;
  if (status === 'opened') return true;
  const edad = referencia ? ahora - Date.parse(referencia) : 0;
  if (edad > DIAS_MAX_SEGUIMIENTO * 86_400_000) return false;
  if (fallo || status !== 'closed') return true;
  if (!devolucion) return false;
  if (devolucion.status && DEVOLUCION_TERMINADA.has(devolucion.status))
    return false;
  return !(
    devolucion.status === 'delivered' &&
    devolucion.dinero !== null &&
    devolucion.dinero !== 'retained'
  );
}
