/**
 * Cómo se leen las respuestas de post-venta de Mercado Libre. Lógica pura: sin
 * red, sin base, sin secretos. La usa claims.ts y la prueba
 * scripts/ml-reclamos-selftest.ts.
 *
 * QUÉ ESTÁ CONFIRMADO
 *
 * CONFIRMADO contra la API real (consulta de prueba del founder, 2026-11-26/27,
 * scripts/ml-reclamos-prueba.ts, sólo la BÚSQUEDA):
 *   - la app tiene permiso para buscar reclamos;
 *   - la búsqueda exige `status`: `players.*` y `range` no cuentan como filtro
 *     (400 atLeastOneFilterProvided);
 *   - `range` por last_updated o date_created con `sort` funciona con status;
 *   - tipos cancel_purchase, mediations, returns, cancel_sale; etapas none,
 *     claim, dispute, recontact; `resource` order y shipment;
 *   - los resultados NO traen `related_entities`.
 *
 * SIN CONFIRMAR: todo lo demás (detalle, motivos, devoluciones, envíos, orden).
 * developers.mercadolibre.com.ar contestó 403 al intentar abrirlo: esas formas
 * salen de resúmenes de buscador y de la referencia de Mercado Pago. Por eso los
 * campos son opcionales y `unknown`, y donde la documentación muestra dos formas
 * se aceptan las dos.
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
  /** SIN CONFIRMAR que la búsqueda lo traiga. */
  players?: unknown;
  resolution?: {
    reason?: unknown;
    date_created?: unknown;
    /** Texto en los ejemplos; se acepta también lista. */
    benefited?: unknown;
    closed_by?: unknown;
  } | null;
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
  orders?: Array<{ order_id?: unknown }> | null;
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

/** Lo único que se lee de `GET /orders/{id}`. Nada del comprador. */
export type MLOrdenReclamo = {
  id?: unknown;
  pack_id?: unknown;
  shipping?: { id?: unknown } | null;
  payments?: Array<{
    status?: unknown;
    transaction_amount_refunded?: unknown;
    date_last_modified?: unknown;
  }> | null;
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
  opened_at: string | null;
  claim_updated_at: string | null;
  closed_at: string | null;
  refunded_at: string | null;
  refunded_at_source: 'order_payment' | 'claim_resolution' | null;
  original_delivered_at: string | null;
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
  needs_refresh: boolean;
  synced_at: string;
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

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

/** El rol del vendedor en el reclamo, según `players`. Los players NO se guardan. */
export function rolDe(claim: MLClaim, userId: string): string | null {
  if (!Array.isArray(claim.players)) return null;
  for (const p of claim.players) {
    if (esObjeto(p) && texto(p.user_id) === userId) return texto(p.role);
  }
  return null;
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

/** El tramo principal: el que sale del comprador (`return`), o el primero. */
export function tramoPrincipal(
  tramos: TramoDevolucion[],
): TramoDevolucion | null {
  return tramos.find((t) => t.type === 'return') ?? tramos[0] ?? null;
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
const DEVOLUCION_TERMINADA = new Set([
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
