import 'server-only';
import { dependenciasReales } from '@/lib/integrations/mercadolibre/claims-deps';
import {
  claveDeEnvio,
  correoDeReclamo,
  evaluarAvisos,
  sigueVigente,
  type Correo,
  type EstadoSync,
} from '@/lib/integrations/mercadolibre/claims-avisos';
import type {
  SyncErrorReason,
  SyncResult,
} from '@/lib/integrations/mercadolibre/types';
import {
  accionesDelVendedor,
  articulosDeLaDevolucion,
  articulosDeLaOrden,
  compradorDe,
  datosDelReclamo,
  DESTINO_DEPOSITO,
  DEVOLUCION_TERMINADA,
  diceTenerDevolucion,
  esObjeto,
  fecha,
  fechaDeEstado,
  fechaDeReembolso,
  hayQueVolverAMirar,
  huboReembolso,
  leerDevolucion,
  menorFecha,
  ordenDeLaDevolucion,
  rolDe,
  siNo,
  texto,
  tramoPrincipal,
  tramosDe,
  type ArticuloVenta,
  type FilaReclamo,
  type Notificado,
  type Hecho,
  type MLBusquedaReclamos,
  type MLClaim,
  type MLDetalleReclamo,
  type MLDevolucion,
  type MLEnvioDetalle,
  type MLImpacto,
  type MLMotivo,
  type MLOrdenReclamo,
  type ReclamoGuardado,
} from '@/lib/integrations/mercadolibre/claims-mapping';
import type { ResultadoDeEnvio } from '@/lib/emails/send-ml-claims-email';

export type { ReclamoGuardado };

/**
 * Traer los reclamos y devoluciones de Mercado Libre, guardarlos y avisar.
 *
 * SÓLO LEE. Todos los pedidos a ML de este archivo son GET: no se responde un
 * reclamo, no se sube evidencia, no se aprueba una devolución ni se mueve plata.
 * No se piden los mensajes del reclamo.
 *
 * LOS TRES RECORRIDOS
 *
 * - 'reconciliar' (cron, cada hora): los abiertos, los cerrados actualizados en
 *   los últimos días (con superposición a propósito; si hace más que eso que no
 *   se completa un recorrido, el rango se estira solo) y los que quedaron con
 *   `needs_refresh` (devolución en camino, o un dato que falló).
 * - 'rapido' (botón del sistema de la óptica): lo mismo sin buscar cerrados.
 * - 'historico' (a mano, `?historico=1`): todos los cerrados que todavía no están
 *   guardados, en tandas. Cada corrida saltea lo guardado y sigue; se repite
 *   hasta `historico.terminado: true`. No manda correos ni toca el estado de la
 *   sincronización.
 *
 * Un reclamo cerrado, sin nada pendiente y con el mismo `last_updated` que ya
 * está guardado no genera ningún pedido más.
 *
 * Recursos (formas confirmadas en claims-mapping.ts):
 *   GET /post-purchase/v1/claims/search
 *   GET /post-purchase/v1/claims/{id}
 *   GET /post-purchase/v1/claims/{id}/detail            (no en cerrados viejos)
 *   GET /post-purchase/v1/claims/{id}/affects-reputation (no en cerrados viejos)
 *   GET /post-purchase/v1/claims/reasons/{reason_id}
 *   GET /post-purchase/v2/claims/{id}/returns
 *   GET /shipments/{id}  y  /shipments/{id}/history
 *   GET /orders/{id}
 */

export const DIAS_POR_OMISION = 3;
/** Tope del rango cuando se estira solo por un conector caído. */
const DIAS_DE_RECUPERACION_MAX = 90;
/** Un cerrado hace más que esto es "viejo": no se le pide turno ni impacto. */
const DIAS_CERRADO_VIEJO = 30;
const POR_PAGINA = 30;
const PAGINAS_MAX = 20;
const PAGINAS_HISTORICO_MAX = 200;
const PENDIENTES_MAX = 200;
const ERRORES_MAX = 30;
const DETALLE_MAX = 400;
/** Las rutas tienen maxDuration = 60: queda margen para terminar el reclamo en curso. */
const PRESUPUESTO_MS = {
  reconciliar: 38_000,
  rapido: 20_000,
  historico: 42_000,
} as const;
const ESPERAS_429_MS = [1_000, 3_000];
/**
 * Un error que no es de red (400, 403) probablemente se repita igual. Se
 * reintenta este tiempo desde que se vio el reclamo, por si era algo
 * corregible, y después se deja: si no, cada cerrado se volvería a pedir cada
 * hora durante meses.
 */
const HORAS_DE_INSISTENCIA = 48;
const ORDENES_EXTRA_MAX = 4;
const AVISOS_PENDIENTES_MAX = 10;
/** Pasado este tiempo de corrida, los reintentos quedan para la próxima. */
const REINTENTOS_HASTA_MS = 45_000;
/** Si fallan estas lecturas de un reclamo en curso, el recorrido no está completo. */
const LECTURAS_CRITICAS = new Set([
  'traer_reclamo',
  'reclamo_detalle',
  'reclamo_devolucion',
  'reclamo_envio_devolucion',
]);

export type Modo = keyof typeof PRESUPUESTO_MS;

export type VentaGuardada = {
  external_id: string;
  pack_id: string | null;
  shipment_id: string | null;
};

export type PistasDeVenta = {
  ordenOPack: string | null;
  envio: string | null;
  pago: string | null;
};

export type FilaReputacion = {
  fetched_at: string;
  level_id: string | null;
  power_seller_status: string | null;
  metrics: Record<string, unknown> | null;
};

export type RepoReclamos = {
  /** Los marcados con `needs_refresh`, lo menos mirado primero. */
  pendientes(limite: number): Promise<ReclamoGuardado[]>;
  leer(claimIds: string[]): Promise<ReclamoGuardado[]>;
  buscarVenta(pistas: PistasDeVenta): Promise<VentaGuardada | null>;
  /** Upsert de las columnas presentes. Devuelve el renglón como quedó. */
  guardar(fila: FilaReclamo): Promise<ReclamoGuardado>;
  /** Sólo toca las columnas de control. */
  marcar(
    claimId: string,
    cambios: { needs_refresh?: boolean; synced_at?: string },
  ): Promise<void>;
  /** Abiertos y devoluciones sin terminar, para el resumen. */
  abiertosYEnCamino(): Promise<ReclamoGuardado[]>;
  /** Guarda el estado y agrega los hechos que NO estaban (atómico en la base). */
  anotarAvisos(
    claimId: string,
    estado: NonNullable<Notificado['estado']>,
    nuevos: Record<string, Hecho>,
  ): Promise<void>;
  /** Pasa los pendientes a 'enviando' y los devuelve: cada uno, a uno solo. */
  tomarAvisos(claimId: string, ahora: string): Promise<string[]>;
  cerrarAvisos(
    claimId: string,
    claves: string[],
    resultado: 'enviado' | 'pendiente' | 'omitido',
    ahora: string,
  ): Promise<void>;
  conAvisosPendientes(limite: number, ahora: string): Promise<string[]>;
  leerEstado(clave: EstadoSync['clave']): Promise<EstadoSync | null>;
  /** Upsert de los campos presentes: lo que no se manda queda como estaba. */
  guardarEstado(
    clave: EstadoSync['clave'],
    cambios: Partial<Omit<EstadoSync, 'clave'>>,
  ): Promise<void>;
  /**
   * Candado: anota `intento_at` sólo si el anterior es más viejo que el margen.
   * false = otro recorrido arrancó hace un momento.
   */
  tomarTurno(
    clave: EstadoSync['clave'],
    ahora: number,
    margenMs: number,
  ): Promise<boolean>;
  /** `fetched_at` de la última lectura de reputación. */
  ultimaReputacion(): Promise<string | null>;
  guardarReputacion(fila: FilaReputacion): Promise<void>;
};

export type PedirML = <T>(
  path: string,
  opciones: { operation: string; headers?: Record<string, string> },
) => Promise<SyncResult<T>>;

export type Cartero = {
  /** null = no hay a quién avisar y no se manda nada. */
  destino(): string[] | null;
  enviar(
    correo: Correo,
    to: string[],
    claveDeIdempotencia: string,
  ): Promise<ResultadoDeEnvio>;
};

export type Dependencias = {
  vendedor(): Promise<SyncResult<{ externalUserId: string }>>;
  pedir: PedirML;
  repo: RepoReclamos;
  cartero: Cartero;
  ahora(): number;
  esperar(ms: number): Promise<void>;
};

export type ResumenReclamos = {
  encontrados: number;
  guardados: number;
  sin_cambios: number;
  /** Contados sobre los guardados en esta corrida. */
  sin_venta: number;
  sin_motivo: number;
  sin_entrega: number;
  /** Nuevos o cambiados que quedaron sin guardar. */
  nuevos_pendientes: number;
  avisos_enviados: number;
  incompleto: boolean;
  corte: 'tiempo' | 'limite_de_ml' | 'token' | 'paginas' | null;
  /** Sólo en la carga del historial. */
  historico?: { total: number | null; recorridos: number; terminado: boolean };
  errores: string[];
};

/** Errores que no tiene sentido seguir intentando en esta corrida. */
class CorteDeCorrida extends Error {
  constructor(readonly motivo: SyncErrorReason) {
    super(motivo);
  }
}

export function conReintentos(deps: Dependencias): PedirML {
  return async <T>(path: string, opciones: Parameters<PedirML>[1]) => {
    let r = await deps.pedir<T>(path, opciones);
    for (const ms of ESPERAS_429_MS) {
      if (r.ok || r.error !== 'rate_limited') break;
      await deps.esperar(ms);
      r = await deps.pedir<T>(path, opciones);
    }
    if (
      !r.ok &&
      ['rate_limited', 'token_expired', 'token_invalid'].includes(r.error)
    ) {
      throw new CorteDeCorrida(r.error);
    }
    return r;
  };
}

/** La fecha como la pide el filtro `range`: con milisegundos y huso explícito. */
function fechaML(ms: number): string {
  return new Date(ms).toISOString().replace('Z', '+00:00');
}

/** `status` es obligatorio: ML rechaza la búsqueda que sólo filtra por fecha. */
export type FiltrosDeBusqueda = Record<string, string> & {
  status: 'opened' | 'closed';
};

export function rutaDeBusqueda(filtros: FiltrosDeBusqueda, offset = 0): string {
  const q = new URLSearchParams({
    ...filtros,
    limit: String(POR_PAGINA),
    offset: String(offset),
  });
  return `/post-purchase/v1/claims/search?${q.toString()}`;
}

type Pagina =
  | { ok: true; lote: MLClaim[]; total: number | null }
  | { ok: false; error: SyncErrorReason };

async function pedirPagina(
  pedir: PedirML,
  filtros: FiltrosDeBusqueda,
  offset: number,
): Promise<Pagina> {
  const r = await pedir<MLBusquedaReclamos>(rutaDeBusqueda(filtros, offset), {
    operation: 'buscar_reclamos',
  });
  if (!r.ok) return { ok: false, error: r.error };
  const lote = Array.isArray(r.data?.data) ? r.data.data : null;
  // Una respuesta sin `data` es un cambio de formato, no "no hay reclamos".
  if (!lote) return { ok: false, error: 'validation_error' };
  const total = r.data.paging?.total;
  return { ok: true, lote, total: typeof total === 'number' ? total : null };
}

function esLaUltima(
  lote: MLClaim[],
  vistos: number,
  total: number | null,
): boolean {
  return (
    lote.length === 0 ||
    (total !== null ? vistos >= total : lote.length < POR_PAGINA)
  );
}

type Busqueda =
  | { ok: true; reclamos: MLClaim[]; truncada: boolean }
  | { ok: false; error: SyncErrorReason; reclamos: MLClaim[] };

async function buscar(
  pedir: PedirML,
  filtros: FiltrosDeBusqueda,
): Promise<Busqueda> {
  const reclamos: MLClaim[] = [];
  for (let pagina = 0; pagina < PAGINAS_MAX; pagina++) {
    const p = await pedirPagina(pedir, filtros, pagina * POR_PAGINA);
    if (!p.ok) return { ok: false, error: p.error, reclamos };
    reclamos.push(...p.lote);
    if (esLaUltima(p.lote, reclamos.length, p.total)) {
      return { ok: true, reclamos, truncada: false };
    }
  }
  return { ok: true, reclamos, truncada: true };
}

type Contexto = {
  deps: Dependencias;
  pedir: PedirML;
  userId: string;
  ahora: number;
  primeraCarga: boolean;
  motivos: Map<string, MLMotivo>;
  resumen: ResumenReclamos;
  /** Reclamos que no se pudieron guardar. */
  fallidos: number;
  /** Reclamos en curso con una lectura importante caída. */
  criticos: number;
  /** Reclamos cuyos avisos ya se intentaron mandar en esta corrida. */
  avisados: Set<string>;
};

function nuevoResumen(): ResumenReclamos {
  return {
    encontrados: 0,
    guardados: 0,
    sin_cambios: 0,
    sin_venta: 0,
    sin_motivo: 0,
    sin_entrega: 0,
    nuevos_pendientes: 0,
    avisos_enviados: 0,
    incompleto: false,
    corte: null,
    errores: [],
  };
}

function nuevoContexto(
  deps: Dependencias,
  datos: { userId: string; ahora: number; primeraCarga: boolean },
): Contexto {
  return {
    deps,
    pedir: conReintentos(deps),
    ...datos,
    motivos: new Map(),
    resumen: nuevoResumen(),
    fallidos: 0,
    criticos: 0,
    avisados: new Set(),
  };
}

function anotar(ctx: Contexto, mensaje: string) {
  if (ctx.resumen.errores.length < ERRORES_MAX)
    ctx.resumen.errores.push(mensaje);
}

function mensajeDe(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

type Fallo = { operacion: string; error: SyncErrorReason };

/**
 * Arma la fila de un reclamo. Cada dato secundario es independiente: si uno
 * falla, su columna queda en null (el disparador conserva lo guardado) o, si es
 * de las que se pueden vaciar, no se manda; se anota en `fallos` y el reclamo se
 * vuelve a mirar.
 */
async function armarFila(
  ctx: Contexto,
  claimId: string,
  claim: MLClaim,
  guardado: ReclamoGuardado | undefined,
  fallos: Fallo[],
): Promise<FilaReclamo> {
  const base = datosDelReclamo(claim);
  const id = encodeURIComponent(claimId);

  /** GET opcional: un 404 es "no hay"; cualquier otro error se anota. */
  async function pedirSi<T>(
    path: string,
    operation: string,
    headers?: Record<string, string>,
  ): Promise<T | null> {
    const r = await ctx.pedir<T>(path, { operation, headers });
    if (r.ok) return r.data ?? null;
    if (r.error !== 'not_found') {
      fallos.push({ operacion: operation, error: r.error });
    }
    return null;
  }

  /** Como pedirSi, pero una respuesta que no es un objeto cuenta como falla. */
  async function pedirObjeto<T>(
    path: string,
    operation: string,
  ): Promise<T | null> {
    const r = await ctx.pedir<unknown>(path, { operation });
    if (r.ok && esObjeto(r.data)) return r.data as T;
    if (r.ok) {
      fallos.push({ operacion: operation, error: 'validation_error' });
    } else if (r.error !== 'not_found') {
      fallos.push({ operacion: operation, error: r.error });
    }
    return null;
  }

  // Un envío se lee una sola vez, aunque sirva para la venta y para la entrega.
  const envios = new Map<string, MLEnvioDetalle | null>();
  async function leerEnvio(envioId: string, operation: string) {
    const ya = envios.get(envioId);
    if (ya !== undefined) return ya;
    const e = await pedirSi<MLEnvioDetalle>(
      `/shipments/${encodeURIComponent(envioId)}`,
      operation,
    );
    envios.set(envioId, e);
    return e;
  }

  // El historial se pide sólo si el envío no trae la fecha.
  async function historial(envioId: string): Promise<unknown> {
    return pedirSi<unknown>(
      `/shipments/${encodeURIComponent(envioId)}/history`,
      'reclamo_historial_envio',
      { 'x-format-new': 'true' },
    );
  }

  // --- Turno, plazos e impacto: no en los cerrados viejos ---
  const cierre = Date.parse(
    base.closed_at ?? base.claim_updated_at ?? base.opened_at ?? '',
  );
  const viejo =
    base.status === 'closed' &&
    ctx.ahora - cierre > DIAS_CERRADO_VIEJO * 86_400_000;
  const detalle = viejo
    ? null
    : await pedirObjeto<MLDetalleReclamo>(
        `/post-purchase/v1/claims/${id}/detail`,
        'reclamo_detalle',
      );
  const impacto = viejo
    ? null
    : await pedirObjeto<MLImpacto>(
        `/post-purchase/v1/claims/${id}/affects-reputation`,
        'reclamo_reputacion',
      );

  const acciones = accionesDelVendedor(claim, ctx.userId);
  const venceAcciones = menorFecha(
    ...(acciones ?? guardado?.seller_actions ?? []).map((a) => a.due_date),
  );
  const borrables: Partial<FilaReclamo> = {};
  if (acciones) borrables.seller_actions = acciones;
  if (detalle) {
    borrables.action_responsible = texto(detalle.action_responsible);
    borrables.due_date = menorFecha(fecha(detalle.due_date), venceAcciones);
  } else if (
    venceAcciones &&
    menorFecha(guardado?.due_date, venceAcciones) === venceAcciones
  ) {
    // Sin /detail sólo se puede adelantar el plazo, nunca borrarlo.
    borrables.due_date = venceAcciones;
  }
  if (impacto) borrables.reputation_due_date = fecha(impacto.due_date);

  // --- Motivo ---
  let motivo: MLMotivo | null = null;
  const yaTieneMotivo =
    guardado?.reason_id === base.reason_id && !!guardado?.reason_detail;
  if (base.reason_id && !yaTieneMotivo) {
    motivo = ctx.motivos.get(base.reason_id) ?? null;
    if (!motivo) {
      motivo = await pedirSi<MLMotivo>(
        `/post-purchase/v1/claims/reasons/${encodeURIComponent(base.reason_id)}`,
        'reclamo_motivo',
      );
      if (motivo) ctx.motivos.set(base.reason_id, motivo);
    }
  }

  // --- Devolución ---
  // 'no_se_sabe' = la lectura falló: no se toca nada de lo guardado.
  const hayGuardada = !!(guardado?.return_id || guardado?.return_status);
  const relacion = diceTenerDevolucion(claim);
  let dev: MLDevolucion | null = null;
  let devolucionLeida: 'hay' | 'no_hay' | 'no_se_sabe' = 'no_hay';
  if (!(relacion === false && !hayGuardada && base.status === 'closed')) {
    const r = await ctx.pedir<unknown>(
      `/post-purchase/v2/claims/${id}/returns`,
      { operation: 'reclamo_devolucion' },
    );
    if (r.ok) {
      const lectura = leerDevolucion(r.data);
      if (lectura.que === 'hay') {
        devolucionLeida = 'hay';
        dev = lectura.devolucion;
      } else if (lectura.que === 'ilegible') {
        devolucionLeida = 'no_se_sabe';
        fallos.push({
          operacion: 'reclamo_devolucion',
          error: 'validation_error',
        });
      }
    } else {
      // Un error es "no hay" sólo si nada indica que la haya.
      const sinRastro =
        (relacion === false && (!hayGuardada || r.error === 'not_found')) ||
        (relacion === null && !hayGuardada && r.error === 'not_found');
      if (!sinRastro) {
        devolucionLeida = 'no_se_sabe';
        fallos.push({ operacion: 'reclamo_devolucion', error: r.error });
      }
    }
  }

  const tramos = dev ? tramosDe(dev) : [];
  const tramo = tramoPrincipal(tramos);
  const envioVueltaId = tramo?.shipment_id ?? null;
  const alDeposito = tramo?.destination === DESTINO_DEPOSITO;
  let envioVuelta: MLEnvioDetalle | null = null;
  let vueltaSalio: string | null = null;
  let vueltaLlego: string | null = null;

  const vueltaCompleta =
    guardado?.return_shipment_id === envioVueltaId &&
    !!guardado?.return_delivered_at &&
    !!guardado?.return_tracking_number;

  if (envioVueltaId && !vueltaCompleta) {
    envioVuelta = await leerEnvio(envioVueltaId, 'reclamo_envio_devolucion');
    vueltaSalio = fechaDeEstado(envioVuelta, 'shipped');
    vueltaLlego = fechaDeEstado(envioVuelta, 'delivered');
    const estado = texto(envioVuelta?.status) ?? tramo?.status;
    if (
      (estado === 'shipped' && !vueltaSalio) ||
      (estado === 'delivered' && !vueltaLlego)
    ) {
      const h = await historial(envioVueltaId);
      vueltaSalio ??= fechaDeEstado(h, 'shipped');
      vueltaLlego ??= fechaDeEstado(h, 'delivered');
    }
  }

  if (devolucionLeida !== 'no_se_sabe') {
    Object.assign(borrables, {
      return_id: texto(dev?.id),
      return_type: texto(dev?.type),
      return_subtype: texto(dev?.subtype),
      return_status: texto(dev?.status),
      return_money_status: texto(dev?.status_money),
      return_refund_trigger: texto(dev?.refund_at),
      return_opened_at: fecha(dev?.date_created),
      return_closed_at: fecha(dev?.date_closed),
      return_shipment_id: envioVueltaId,
      return_shipment_status:
        texto(envioVuelta?.status) ?? tramo?.status ?? null,
      return_shipment_substatus: texto(envioVuelta?.substatus),
      return_tracking_number:
        texto(envioVuelta?.tracking_number) ?? tramo?.tracking_number ?? null,
      return_tracking_method: texto(envioVuelta?.tracking_method),
      return_shipped_at: vueltaSalio,
      // Llegar al depósito de Mercado Libre no es llegar a la óptica.
      return_delivered_at: alDeposito ? null : vueltaLlego,
      return_shipments: tramos.length > 0 ? tramos : null,
      return_items: dev ? articulosDeLaDevolucion(dev) : null,
    } satisfies Partial<FilaReclamo>);
  }

  // --- A qué venta corresponde ---
  const enRecurso = (r: string) =>
    base.resource === r ? base.resource_id : null;
  let ordenId =
    enRecurso('order') ??
    (dev ? ordenDeLaDevolucion(dev) : null) ??
    guardado?.order_external_id ??
    null;
  const envioDelReclamo = enRecurso('shipment');

  let venta = await ctx.deps.repo.buscarVenta({
    ordenOPack: ordenId ?? enRecurso('pack'),
    envio: envioDelReclamo,
    pago: enRecurso('payment'),
  });

  // Reclamo sobre un envío que no está en las ventas: el envío dice la orden, y
  // con ella se vuelve a buscar.
  if (!venta && !ordenId && envioDelReclamo) {
    const e = await leerEnvio(envioDelReclamo, 'reclamo_envio');
    ordenId = texto(e?.order_id);
    if (ordenId) {
      venta = await ctx.deps.repo.buscarVenta({
        ordenOPack: ordenId,
        envio: null,
        pago: null,
      });
    }
  }

  // --- La orden: comprador, estado y artículos (aunque sea vieja) ---
  const dinero =
    texto(dev?.status_money) ??
    (devolucionLeida === 'no_se_sabe'
      ? (guardado?.return_money_status ?? null)
      : null);
  const buscarReembolso =
    !guardado?.refunded_at && huboReembolso(texto(dev?.status_money), claim);
  const idParaPedir = venta?.external_id ?? ordenId;
  const faltaDeLaOrden =
    !venta ||
    !guardado?.order_items ||
    !guardado.order_status ||
    !guardado.buyer_nickname;
  const pedirOrden =
    base.status !== 'closed' ||
    !mismoMomento(guardado?.claim_updated_at, claim.last_updated) ||
    faltaDeLaOrden ||
    buscarReembolso;
  const orden =
    idParaPedir && pedirOrden
      ? await pedirObjeto<MLOrdenReclamo>(
          `/orders/${encodeURIComponent(idParaPedir)}`,
          'reclamo_orden',
        )
      : null;

  const packId = venta?.pack_id ?? texto(orden?.pack_id);
  const ordenExterna = venta?.external_id ?? texto(orden?.id) ?? ordenId;

  let articulos: ArticuloVenta[] | null = idParaPedir
    ? articulosDeLaOrden(orden, idParaPedir)
    : null;
  if (articulos) {
    // Una devolución puede juntar varias órdenes del mismo paquete.
    const otras = [
      ...new Set(
        (dev ? (articulosDeLaDevolucion(dev) ?? []) : [])
          .map((a) => a.order_id)
          .filter((o): o is string => !!o && o !== idParaPedir),
      ),
    ].slice(0, ORDENES_EXTRA_MAX);
    for (const otra of otras) {
      const o = await pedirObjeto<MLOrdenReclamo>(
        `/orders/${encodeURIComponent(otra)}`,
        'reclamo_orden',
      );
      const suyos = articulosDeLaOrden(o, otra);
      if (suyos) articulos.push(...suyos);
      // Con una lista a medias no se pisa la que ya estaba completa.
      else if (guardado?.order_items) {
        articulos = null;
        break;
      }
    }
  }

  // --- Entrega original ("a cuántos días de recibirlo devolvió") ---
  let entregado: string | null = null;
  const envioOriginal =
    venta?.shipment_id ?? texto(orden?.shipping?.id) ?? envioDelReclamo;
  if (
    !guardado?.original_delivered_at &&
    envioOriginal &&
    envioOriginal !== envioVueltaId
  ) {
    const e = await leerEnvio(envioOriginal, 'reclamo_entrega');
    entregado = fechaDeEstado(e, 'delivered');
    if (!entregado && texto(e?.status) === 'delivered') {
      entregado = fechaDeEstado(await historial(envioOriginal), 'delivered');
    }
  }

  // --- Reembolso ---
  let reembolsado: string | null = null;
  let origenReembolso: FilaReclamo['refunded_at_source'] = null;
  if (buscarReembolso) {
    reembolsado = fechaDeReembolso(orden);
    if (reembolsado) {
      origenReembolso = 'order_payment';
    } else if (
      base.resolution_reason === 'payment_refunded' &&
      !fallos.some((f) => f.operacion === 'reclamo_orden')
    ) {
      reembolsado = fecha(claim.resolution?.date_created);
      origenReembolso = reembolsado ? 'claim_resolution' : null;
    }
  }

  const estadoDev =
    texto(dev?.status) ??
    (devolucionLeida === 'no_se_sabe'
      ? (guardado?.return_status ?? null)
      : null);
  const devolucion =
    dev || (devolucionLeida === 'no_se_sabe' && hayGuardada)
      ? { status: estadoDev, dinero }
      : null;

  const vistoHace =
    ctx.ahora - (Date.parse(guardado?.fetched_at ?? '') || ctx.ahora);
  const insistir =
    fallos.some((f) => f.error === 'network_error') ||
    (fallos.length > 0 && vistoHace < HORAS_DE_INSISTENCIA * 3_600_000);

  return {
    marketplace: 'mercadolibre',
    claim_id: claimId,
    ...base,
    ...borrables,
    order_external_id: ordenExterna,
    pack_id: packId,
    reason_name: texto(motivo?.name),
    reason_detail: texto(motivo?.detail),
    refunded_at: reembolsado,
    refunded_at_source: origenReembolso,
    original_delivered_at: entregado,
    buyer_id: compradorDe(claim, ctx.userId) ?? texto(orden?.buyer?.id),
    buyer_nickname: texto(orden?.buyer?.nickname),
    detail_title: texto(detalle?.title),
    detail_problem: texto(detalle?.problem),
    affects_reputation: texto(impacto?.affects_reputation),
    has_incentive: siNo(impacto?.has_incentive),
    order_status: texto(orden?.status),
    order_items: articulos,
    needs_refresh: hayQueVolverAMirar({
      status: base.status,
      devolucion,
      fallo: insistir,
      referencia: base.closed_at ?? base.claim_updated_at ?? base.opened_at,
      ahora: ctx.ahora,
    }),
    synced_at: new Date(ctx.ahora).toISOString(),
  };
}

function mismoMomento(a: string | null | undefined, b: unknown): boolean {
  const f = fecha(b);
  return !!a && !!f && Date.parse(a) === Date.parse(f);
}

function vueltaEnCurso(f: ReclamoGuardado | undefined): boolean {
  return (
    !!f?.return_status &&
    f.return_status !== 'delivered' &&
    !DEVOLUCION_TERMINADA.has(f.return_status) &&
    !f.return_delivered_at
  );
}

/** Manda lo pendiente de un reclamo. La base entrega cada hecho a uno solo. */
async function despachar(
  ctx: Contexto,
  fila: ReclamoGuardado,
  to: string[],
): Promise<void> {
  const { repo, cartero } = ctx.deps;
  const marca = () => new Date(ctx.deps.ahora()).toISOString();
  ctx.avisados.add(fila.claim_id);

  const claves = await repo.tomarAvisos(fila.claim_id, marca());
  const vigentes = claves.filter((c) => sigueVigente(fila, c));
  const caducas = claves.filter((c) => !vigentes.includes(c));
  if (caducas.length > 0) {
    await repo.cerrarAvisos(fila.claim_id, caducas, 'omitido', marca());
  }
  if (vigentes.length === 0) return;

  const resultado = await cartero.enviar(
    correoDeReclamo(fila, vigentes),
    to,
    claveDeEnvio(fila.claim_id, vigentes),
  );
  if (resultado === 'enviado') {
    ctx.resumen.avisos_enviados++;
    await repo.cerrarAvisos(fila.claim_id, vigentes, 'enviado', marca());
  } else {
    anotar(ctx, `aviso del reclamo ${fila.claim_id}: ${resultado}`);
    // 'incierto' queda en 'enviando' y se retoma más tarde con la misma clave.
    if (resultado === 'fallo') {
      await repo.cerrarAvisos(fila.claim_id, vigentes, 'pendiente', marca());
    }
  }
}

/** Detecta qué pasó con un reclamo recién guardado y avisa. Nunca corta la corrida. */
async function avisar(ctx: Contexto, fila: ReclamoGuardado): Promise<void> {
  try {
    const to = ctx.deps.cartero.destino();
    const { estado, nuevos, cambio } = evaluarAvisos(fila, {
      primeraCarga: ctx.primeraCarga,
      avisosActivos: !!to,
      ahora: ctx.ahora,
    });
    if (cambio) {
      await ctx.deps.repo.anotarAvisos(fila.claim_id, estado, nuevos);
    }
    const hayPendientes = Object.values({
      ...fila.notified?.hechos,
      ...nuevos,
    }).some((h) => h.e === 'pendiente' || h.e === 'enviando');
    if (to && hayPendientes) await despachar(ctx, fila, to);
  } catch (err) {
    anotar(ctx, `aviso del reclamo ${fila.claim_id}: ${mensajeDe(err)}`);
  }
}

/** Los avisos que quedaron sin salir en corridas anteriores. */
async function reintentarAvisos(ctx: Contexto): Promise<void> {
  const to = ctx.deps.cartero.destino();
  if (!to) return;
  try {
    const ids = await ctx.deps.repo.conAvisosPendientes(
      AVISOS_PENDIENTES_MAX,
      new Date(ctx.deps.ahora()).toISOString(),
    );
    const faltan = ids.filter((id) => !ctx.avisados.has(id));
    if (faltan.length === 0) return;
    for (const fila of await ctx.deps.repo.leer(faltan)) {
      if (ctx.deps.ahora() - ctx.ahora > REINTENTOS_HASTA_MS) break;
      await despachar(ctx, fila, to);
    }
  } catch (err) {
    anotar(ctx, `avisos pendientes: ${mensajeDe(err)}`);
  }
}

/** Lee un reclamo, lo guarda y avisa. `hallado` es lo que dijo la búsqueda. */
async function procesarReclamo(
  ctx: Contexto,
  claimId: string,
  hallado: MLClaim | undefined,
  guardado: ReclamoGuardado | undefined,
): Promise<'guardado' | 'ajeno' | 'error'> {
  const { repo } = ctx.deps;
  const ahora = new Date(ctx.ahora).toISOString();
  try {
    const fallos: Fallo[] = [];
    // El detalle trae lo que la búsqueda no: acciones, entidades relacionadas.
    const r = await ctx.pedir<MLClaim>(
      `/post-purchase/v1/claims/${encodeURIComponent(claimId)}`,
      { operation: 'traer_reclamo' },
    );
    let claim: MLClaim;
    if (r.ok && esObjeto(r.data) && texto(r.data.id)) {
      claim = { ...hallado, ...r.data };
    } else {
      const error: SyncErrorReason = r.ok ? 'validation_error' : r.error;
      if (!hallado) {
        anotar(ctx, `reclamo ${claimId}: ${error}`);
        if (error !== 'not_found') ctx.fallidos++;
        await repo.marcar(claimId, {
          synced_at: ahora,
          ...(error === 'not_found' ? { needs_refresh: false } : {}),
        });
        return 'error';
      }
      claim = hallado;
      fallos.push({ operacion: 'traer_reclamo', error });
    }

    // Si la cuenta es la que reclama (una compra propia), no es de una venta.
    if (rolDe(claim, ctx.userId) === 'complainant') {
      if (guardado) {
        await repo.marcar(claimId, { synced_at: ahora, needs_refresh: false });
      }
      return 'ajeno';
    }

    const fila = await armarFila(ctx, claimId, claim, guardado, fallos);
    const quedo = await repo.guardar(fila);

    ctx.resumen.guardados++;
    if (!quedo.order_external_id) ctx.resumen.sin_venta++;
    if (!quedo.reason_detail) ctx.resumen.sin_motivo++;
    if (!quedo.original_delivered_at) ctx.resumen.sin_entrega++;
    for (const f of fallos) {
      anotar(ctx, `reclamo ${claimId}, ${f.operacion}: ${f.error}`);
    }
    if (
      (quedo.status === 'opened' || vueltaEnCurso(quedo)) &&
      fallos.some((f) => LECTURAS_CRITICAS.has(f.operacion))
    ) {
      ctx.criticos++;
    }

    await avisar(ctx, quedo);
    return 'guardado';
  } catch (err) {
    if (err instanceof CorteDeCorrida) throw err;
    // Un reclamo roto no frena a los demás.
    ctx.fallidos++;
    anotar(ctx, `reclamo ${claimId}: ${mensajeDe(err)}`);
    await repo.marcar(claimId, { synced_at: ahora }).catch(() => {});
    return 'error';
  }
}

/** Carga del historial: página por página, salteando lo que ya está. */
async function recorrerHistorial(ctx: Contexto, inicio: number) {
  const historico = {
    total: null as number | null,
    recorridos: 0,
    terminado: false,
  };
  ctx.resumen.historico = historico;
  const filtros: FiltrosDeBusqueda = {
    status: 'closed',
    sort: 'date_created:desc',
  };

  for (let pagina = 0; pagina < PAGINAS_HISTORICO_MAX; pagina++) {
    const p = await pedirPagina(ctx.pedir, filtros, pagina * POR_PAGINA);
    if (!p.ok) {
      anotar(ctx, `búsqueda del historial: ${p.error}`);
      ctx.resumen.incompleto = true;
      return;
    }
    historico.total = p.total;
    const hallados = new Map<string, MLClaim>();
    for (const c of p.lote) {
      const id = texto(c.id);
      if (id && rolDe(c, ctx.userId) !== 'complainant') hallados.set(id, c);
    }
    const ya = new Set(
      (await ctx.deps.repo.leer([...hallados.keys()])).map((g) => g.claim_id),
    );
    const faltan = [...hallados.keys()].filter((id) => !ya.has(id));
    ctx.resumen.encontrados += hallados.size;
    ctx.resumen.sin_cambios += ya.size;

    for (const [i, id] of faltan.entries()) {
      if (ctx.deps.ahora() - inicio > PRESUPUESTO_MS.historico) {
        ctx.resumen.corte = 'tiempo';
        ctx.resumen.incompleto = true;
        ctx.resumen.nuevos_pendientes = faltan.length - i;
        return;
      }
      await procesarReclamo(ctx, id, hallados.get(id), undefined);
    }

    historico.recorridos += p.lote.length;
    if (esLaUltima(p.lote, historico.recorridos, p.total)) {
      historico.terminado = ctx.fallidos === 0;
      ctx.resumen.incompleto = ctx.fallidos > 0;
      ctx.resumen.nuevos_pendientes = ctx.fallidos;
      return;
    }
  }
  ctx.resumen.corte = 'paginas';
  ctx.resumen.incompleto = true;
}

/** Los abiertos, los cerrados recientes (salvo en 'rapido') y lo pendiente. */
async function recorrer(
  ctx: Contexto,
  modo: 'reconciliar' | 'rapido',
  dias: number,
  inicio: number,
): Promise<SyncErrorReason | null> {
  const { repo } = ctx.deps;
  const { resumen } = ctx;
  const sinGuardar = new Set<string>();

  // La base primero: si la tabla no existe, falla acá sin gastar pedidos a ML.
  const pendientes = await repo.pendientes(PENDIENTES_MAX);

  const busquedas: Array<[string, Busqueda]> = [
    [
      'abiertos',
      await buscar(ctx.pedir, {
        'players.role': 'respondent',
        'players.user_id': ctx.userId,
        status: 'opened',
      }),
    ],
  ];
  if (modo === 'reconciliar') {
    // Sin `players.*`: esta combinación es la que se probó contra la API.
    const desde = inicio - dias * 86_400_000;
    busquedas.push([
      'recientes',
      await buscar(ctx.pedir, {
        status: 'closed',
        range: `last_updated:after:${fechaML(desde)},before:${fechaML(inicio)}`,
        sort: 'last_updated:desc',
      }),
    ]);
  }

  // Sin ninguna búsqueda que conteste no hay recorrido.
  const ultima = busquedas[busquedas.length - 1]![1];
  if (!ultima.ok && busquedas.every(([, b]) => !b.ok)) return ultima.error;
  for (const [nombre, b] of busquedas) {
    if (!b.ok) {
      anotar(ctx, `búsqueda de ${nombre}: ${b.error}`);
      resumen.incompleto = true;
    } else if (b.truncada) {
      anotar(
        ctx,
        `búsqueda de ${nombre}: más de ${PAGINAS_MAX * POR_PAGINA} resultados`,
      );
      resumen.incompleto = true;
      resumen.corte = 'paginas';
    }
  }

  const hallados = new Map<string, MLClaim>();
  for (const c of busquedas.flatMap(([, b]) => b.reclamos)) {
    const id = texto(c.id);
    if (id && rolDe(c, ctx.userId) !== 'complainant') hallados.set(id, c);
  }
  resumen.encontrados = hallados.size;

  const guardados = new Map(
    [...pendientes, ...(await repo.leer([...hallados.keys()]))].map((g) => [
      g.claim_id,
      g,
    ]),
  );

  // En orden: lo nuevo o cambiado, lo abierto, las devoluciones en camino y
  // el resto de lo pendiente; dentro de cada grupo, lo menos mirado antes.
  const nuevos: string[] = [];
  const aRevisar = new Set(pendientes.map((p) => p.claim_id));
  for (const [id, c] of hallados) {
    const g = guardados.get(id);
    if (g && mismoMomento(g.claim_updated_at, c.last_updated)) {
      if (g.needs_refresh) aRevisar.add(id);
      else resumen.sin_cambios++;
    } else {
      nuevos.push(id);
      sinGuardar.add(id);
      aRevisar.delete(id);
    }
  }
  const grupo = (id: string) => {
    const g = guardados.get(id);
    if (hallados.get(id)?.status === 'opened' || g?.status === 'opened')
      return 1;
    return vueltaEnCurso(g) ? 2 : 3;
  };
  const antiguedad = (id: string) =>
    Date.parse(guardados.get(id)?.synced_at ?? '') || 0;
  const cola = [
    ...nuevos,
    ...[...aRevisar].sort(
      (a, b) => grupo(a) - grupo(b) || antiguedad(a) - antiguedad(b),
    ),
  ];

  try {
    for (const [i, claimId] of cola.entries()) {
      if (ctx.deps.ahora() - inicio > PRESUPUESTO_MS[modo]) {
        resumen.corte = 'tiempo';
        // Que quede para la próxima algo del último grupo es la rotación normal.
        if (
          cola.slice(i).some((id) => sinGuardar.has(id) || grupo(id) < 3)
        ) {
          resumen.incompleto = true;
        }
        break;
      }
      const r = await procesarReclamo(
        ctx,
        claimId,
        hallados.get(claimId),
        guardados.get(claimId),
      );
      if (r !== 'error') sinGuardar.delete(claimId);
    }
  } finally {
    resumen.nuevos_pendientes = sinGuardar.size;
  }
  return null;
}

function detalleDelEstado(resumen: ResumenReclamos): string | null {
  const partes = [
    resumen.corte ? `corte: ${resumen.corte}` : null,
    ...resumen.errores.slice(0, 5),
  ].filter(Boolean);
  return partes.join('; ').slice(0, DETALLE_MAX) || null;
}

/**
 * @param pedido.modo 'reconciliar' si no se indica.
 * @param pedido.dias cuántos días para atrás mirar los cerrados actualizados. Sin
 * indicarlo, 3, o lo que haga falta desde el último recorrido completo.
 */
export async function traerReclamos(
  pedido: { modo?: Modo; dias?: number } = {},
  deps: Dependencias = dependenciasReales(),
): Promise<SyncResult<ResumenReclamos>> {
  const modo = pedido.modo ?? 'reconciliar';
  const inicio = deps.ahora();
  const marca = new Date(inicio).toISOString();
  // La carga del historial no es "el recorrido": no toca el estado.
  const registrar = async (
    cambios: Parameters<RepoReclamos['guardarEstado']>[1],
  ) => {
    if (modo !== 'historico') {
      await deps.repo.guardarEstado('claims', cambios);
    }
  };
  const fallo = async (error: SyncErrorReason) => {
    await registrar({
      intento_at: marca,
      incompleto: true,
      detalle: `no se pudo recorrer: ${error}`,
    }).catch(() => {});
    return {
      ok: false as const,
      error,
      retryable: error === 'rate_limited' || error === 'network_error',
    };
  };

  let ctx: Contexto | null = null;
  try {
    const estado = await deps.repo.leerEstado('claims');
    await registrar({ intento_at: marca });

    const vendedor = await deps.vendedor();
    if (!vendedor.ok) return await fallo(vendedor.error);

    ctx = nuevoContexto(deps, {
      userId: vendedor.data.externalUserId,
      ahora: inicio,
      primeraCarga: modo === 'historico' || !estado?.ok_at,
    });

    try {
      if (modo === 'historico') {
        await recorrerHistorial(ctx, inicio);
      } else {
        const sinCompletar = estado?.ok_at
          ? Math.ceil((inicio - Date.parse(estado.ok_at)) / 86_400_000) + 1
          : 0;
        const dias =
          pedido.dias ??
          Math.min(
            Math.max(DIAS_POR_OMISION, sinCompletar),
            DIAS_DE_RECUPERACION_MAX,
          );
        const error = await recorrer(ctx, modo, dias, inicio);
        if (error) return await fallo(error);
      }
    } catch (err) {
      if (!(err instanceof CorteDeCorrida)) throw err;
      // Antes de guardar nada es un fallo; con algo guardado, una corrida parcial.
      if (ctx.resumen.guardados === 0) return await fallo(err.motivo);
      ctx.resumen.incompleto = true;
      ctx.resumen.corte =
        err.motivo === 'rate_limited' ? 'limite_de_ml' : 'token';
    }

    if (modo !== 'historico') {
      await reintentarAvisos(ctx);
      ctx.resumen.incompleto ||= ctx.fallidos > 0 || ctx.criticos > 0;
    }
    const completo = !ctx.resumen.incompleto;
    await registrar({
      intento_at: marca,
      incompleto: !completo,
      detalle: detalleDelEstado(ctx.resumen),
      // Sin recorrido completo, `ok_at` queda como estaba.
      ...(completo ? { ok_at: marca } : {}),
    });
    return { ok: true, data: ctx.resumen };
  } catch (err) {
    console.error('[ml-reclamos] la corrida falló', err);
    return fallo('unknown');
  }
}

/**
 * Un aviso de Mercado Libre sobre un reclamo: se lo marca para refrescar y se lo
 * trae ya. Si algo falla queda marcado (o lo encuentra el recorrido de la hora).
 */
export async function procesarAvisoDeReclamo(
  claimId: string,
  deps: Dependencias = dependenciasReales(),
): Promise<{ ok: boolean; error: string | null }> {
  try {
    await deps.repo.marcar(claimId, { needs_refresh: true });
    const vendedor = await deps.vendedor();
    if (!vendedor.ok) return { ok: false, error: vendedor.error };
    const estado = await deps.repo.leerEstado('claims');
    const ctx = nuevoContexto(deps, {
      userId: vendedor.data.externalUserId,
      ahora: deps.ahora(),
      primeraCarga: !estado?.ok_at,
    });
    const [guardado] = await deps.repo.leer([claimId]);
    const r = await procesarReclamo(ctx, claimId, undefined, guardado);
    return {
      ok: r !== 'error',
      error: ctx.resumen.errores.join('; ').slice(0, DETALLE_MAX) || null,
    };
  } catch (err) {
    return { ok: false, error: mensajeDe(err) };
  }
}
