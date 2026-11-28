import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { mlFetch } from '@/lib/integrations/mercadolibre/api-client';
import { getValidAccessToken } from '@/lib/integrations/mercadolibre/oauth';
import type {
  SyncErrorReason,
  SyncResult,
} from '@/lib/integrations/mercadolibre/types';
import {
  datosDelReclamo,
  elegirDevolucion,
  fecha,
  fechaDeEstado,
  fechaDeReembolso,
  hayQueVolverAMirar,
  huboReembolso,
  ordenDeLaDevolucion,
  rolDe,
  texto,
  tramoPrincipal,
  tramosDe,
  type FilaReclamo,
  type MLBusquedaReclamos,
  type MLClaim,
  type MLEnvioDetalle,
  type MLMotivo,
  type MLOrdenReclamo,
} from '@/lib/integrations/mercadolibre/claims-mapping';

/**
 * Traer los reclamos y devoluciones de Mercado Libre y guardarlos.
 *
 * SÓLO LEE. Todos los pedidos a ML de este archivo son GET: no se responde un
 * reclamo, no se sube evidencia, no se aprueba una devolución ni se mueve plata.
 * No se piden los mensajes del reclamo.
 *
 * QUÉ MIRA CADA CORRIDA (y por qué es barata)
 *
 * 1. Los reclamos abiertos (`status=opened`).
 * 2. Los cerrados actualizados en los últimos días (`status=closed` + `range`).
 *    La búsqueda SIEMPRE lleva `status`: sin él ML contesta 400.
 * 3. Los que en la base quedaron con `needs_refresh` (devolución en camino, o
 *    un dato que falló la vez anterior).
 * Un reclamo cerrado, sin nada pendiente y con el mismo `last_updated` que ya
 * está guardado no genera ningún pedido más. La búsqueda no dice si hay
 * devolución, así que se pregunta una vez por cada reclamo nuevo o cambiado.
 *
 * Si se acaba el tiempo de la función o ML limita (429), corta, informa
 * `incompleto: true` y la corrida siguiente sigue desde ahí: lo ya guardado se
 * saltea. En la primera carga (?dias=90) hay que repetir hasta que dé false
 * (con `nuevos_pendientes: 0` ya entraron todos).
 *
 * Recursos (sólo la búsqueda está probada contra la API, ver claims-mapping.ts):
 *   GET /post-purchase/v1/claims/search
 *   GET /post-purchase/v1/claims/{id}
 *   GET /post-purchase/v1/claims/reasons/{reason_id}
 *   GET /post-purchase/v2/claims/{id}/returns
 *   GET /shipments/{id}  y  /shipments/{id}/history
 *   GET /orders/{id}
 */

export const DIAS_POR_OMISION = 3;
const POR_PAGINA = 30;
const PAGINAS_MAX = 20;
const PENDIENTES_MAX = 100;
const ERRORES_MAX = 30;
/** La ruta tiene maxDuration = 60: se deja margen para terminar el reclamo en curso. */
const PRESUPUESTO_MS = 45_000;
const ESPERAS_429_MS = [1_000, 3_000];
/**
 * Un error que no es de red (400, 403) probablemente se repita igual. Se
 * reintenta este tiempo desde que se vio el reclamo, por si era algo
 * corregible, y después se deja: si no, cada cerrado se volvería a pedir cada
 * hora durante meses.
 */
const HORAS_DE_INSISTENCIA = 48;

export type ReclamoGuardado = Pick<
  FilaReclamo,
  | 'claim_id'
  | 'claim_updated_at'
  | 'needs_refresh'
  | 'synced_at'
  | 'reason_id'
  | 'reason_detail'
  | 'order_external_id'
  | 'original_delivered_at'
  | 'refunded_at'
  | 'return_id'
  | 'return_status'
  | 'return_money_status'
  | 'return_shipment_id'
  | 'return_delivered_at'
  | 'return_tracking_number'
> & {
  /** Cuándo se lo vio por primera vez (lo pone la base). */
  fetched_at: string;
};

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

export type RepoReclamos = {
  pendientes(limite: number): Promise<ReclamoGuardado[]>;
  leer(claimIds: string[]): Promise<ReclamoGuardado[]>;
  buscarVenta(pistas: PistasDeVenta): Promise<VentaGuardada | null>;
  guardar(fila: FilaReclamo): Promise<void>;
  /** Sólo toca las columnas de control. */
  marcar(
    claimId: string,
    cambios: { needs_refresh?: boolean; synced_at: string },
  ): Promise<void>;
};

export type PedirML = <T>(
  path: string,
  opciones: { operation: string; headers?: Record<string, string> },
) => Promise<SyncResult<T>>;

export type Dependencias = {
  vendedor(): Promise<SyncResult<{ externalUserId: string }>>;
  pedir: PedirML;
  repo: RepoReclamos;
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
  incompleto: boolean;
  corte: 'tiempo' | 'limite_de_ml' | 'token' | 'paginas' | null;
  errores: string[];
};

/** Errores que no tiene sentido seguir intentando en esta corrida. */
class CorteDeCorrida extends Error {
  constructor(readonly motivo: SyncErrorReason) {
    super(motivo);
  }
}

function conReintentos(deps: Dependencias): PedirML {
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

type Busqueda =
  | { ok: true; reclamos: MLClaim[]; truncada: boolean }
  | { ok: false; error: SyncErrorReason; reclamos: MLClaim[] };

async function buscar(
  pedir: PedirML,
  filtros: FiltrosDeBusqueda,
): Promise<Busqueda> {
  const reclamos: MLClaim[] = [];
  for (let pagina = 0; pagina < PAGINAS_MAX; pagina++) {
    const r = await pedir<MLBusquedaReclamos>(
      rutaDeBusqueda(filtros, pagina * POR_PAGINA),
      { operation: 'buscar_reclamos' },
    );
    if (!r.ok) return { ok: false, error: r.error, reclamos };
    const lote = Array.isArray(r.data?.data) ? r.data.data : null;
    // Una respuesta sin `data` es un cambio de formato, no "no hay reclamos".
    if (!lote) return { ok: false, error: 'validation_error', reclamos };
    reclamos.push(...lote);
    const total = r.data.paging?.total;
    if (
      lote.length === 0 ||
      (typeof total === 'number'
        ? reclamos.length >= total
        : lote.length < POR_PAGINA)
    ) {
      return { ok: true, reclamos, truncada: false };
    }
  }
  return { ok: true, reclamos, truncada: true };
}

type Contexto = {
  pedir: PedirML;
  repo: RepoReclamos;
  ahora: number;
  motivos: Map<string, MLMotivo>;
};

/**
 * Arma la fila de un reclamo. Cada dato secundario es independiente: si uno
 * falla, queda en null (el disparador conserva lo guardado), se anota en
 * `fallos` y el reclamo se vuelve a mirar.
 */
async function armarFila(
  ctx: Contexto,
  claimId: string,
  claim: MLClaim,
  guardado: ReclamoGuardado | undefined,
): Promise<{ fila: FilaReclamo; fallos: string[] }> {
  const fallos: Array<{ operacion: string; error: SyncErrorReason }> = [];
  const base = datosDelReclamo(claim);

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

  // --- Devolución y su envío ---
  // La búsqueda no dice si hay una: se pregunta siempre (404 = no hay).
  const yaHabiaDevolucion = !!(guardado?.return_id || guardado?.return_status);
  const dev = elegirDevolucion(
    await pedirSi<unknown>(
      `/post-purchase/v2/claims/${encodeURIComponent(claimId)}/returns`,
      'reclamo_devolucion',
    ),
  );

  const tramos = dev ? tramosDe(dev) : [];
  const tramo = tramoPrincipal(tramos);
  const envioVueltaId = tramo?.shipment_id ?? null;
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

  // --- A qué venta corresponde ---
  const enRecurso = (r: string) =>
    base.resource === r ? base.resource_id : null;
  let ordenId =
    enRecurso('order') ??
    (dev ? ordenDeLaDevolucion(dev) : null) ??
    guardado?.order_external_id ??
    null;
  const envioDelReclamo = enRecurso('shipment');

  let venta = await ctx.repo.buscarVenta({
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
      venta = await ctx.repo.buscarVenta({
        ordenOPack: ordenId,
        envio: null,
        pago: null,
      });
    }
  }

  // --- La orden: sólo si falta la venta o hay un reembolso sin fecha ---
  const dinero = texto(dev?.status_money);
  const buscarReembolso =
    !guardado?.refunded_at && huboReembolso(dinero, claim);
  const idParaPedir = venta?.external_id ?? ordenId;
  const orden =
    idParaPedir && (!venta || buscarReembolso)
      ? await pedirSi<MLOrdenReclamo>(
          `/orders/${encodeURIComponent(idParaPedir)}`,
          'reclamo_orden',
        )
      : null;

  const packId = venta?.pack_id ?? texto(orden?.pack_id);
  const ordenExterna = venta?.external_id ?? texto(orden?.id) ?? ordenId;

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

  const estadoDev = texto(dev?.status) ?? guardado?.return_status ?? null;
  const devolucion =
    dev || yaHabiaDevolucion
      ? {
          status: estadoDev,
          dinero: dinero ?? guardado?.return_money_status ?? null,
        }
      : null;

  const vistoHace =
    ctx.ahora - (Date.parse(guardado?.fetched_at ?? '') || ctx.ahora);
  const insistir =
    fallos.some((f) => f.error === 'network_error') ||
    (fallos.length > 0 && vistoHace < HORAS_DE_INSISTENCIA * 3_600_000);

  const fila: FilaReclamo = {
    marketplace: 'mercadolibre',
    claim_id: claimId,
    ...base,
    order_external_id: ordenExterna,
    pack_id: packId,
    reason_name: texto(motivo?.name),
    reason_detail: texto(motivo?.detail),
    refunded_at: reembolsado,
    refunded_at_source: origenReembolso,
    original_delivered_at: entregado,
    return_id: texto(dev?.id),
    return_type: texto(dev?.type),
    return_subtype: texto(dev?.subtype),
    return_status: texto(dev?.status),
    return_money_status: dinero,
    return_refund_trigger: texto(dev?.refund_at),
    return_opened_at: fecha(dev?.date_created),
    return_closed_at: fecha(dev?.date_closed),
    return_shipment_id: envioVueltaId,
    return_shipment_status: texto(envioVuelta?.status) ?? tramo?.status ?? null,
    return_shipment_substatus: texto(envioVuelta?.substatus),
    return_tracking_number:
      texto(envioVuelta?.tracking_number) ?? tramo?.tracking_number ?? null,
    return_tracking_method: texto(envioVuelta?.tracking_method),
    return_shipped_at: vueltaSalio,
    return_delivered_at: vueltaLlego,
    return_shipments: tramos.length > 0 ? tramos : null,
    needs_refresh: hayQueVolverAMirar({
      status: base.status,
      devolucion,
      fallo: insistir,
      referencia: base.closed_at ?? base.claim_updated_at ?? base.opened_at,
      ahora: ctx.ahora,
    }),
    synced_at: new Date(ctx.ahora).toISOString(),
  };

  return { fila, fallos: fallos.map((f) => `${f.operacion}: ${f.error}`) };
}

function mismoMomento(a: string | null | undefined, b: unknown): boolean {
  const f = fecha(b);
  return !!a && !!f && Date.parse(a) === Date.parse(f);
}

/**
 * @param dias cuántos días para atrás mirar los actualizados. 90 en la primera carga.
 */
export async function traerReclamos(
  dias = DIAS_POR_OMISION,
  deps: Dependencias = dependenciasReales(),
): Promise<SyncResult<ResumenReclamos>> {
  const inicio = deps.ahora();
  const resumen: ResumenReclamos = {
    encontrados: 0,
    guardados: 0,
    sin_cambios: 0,
    sin_venta: 0,
    sin_motivo: 0,
    sin_entrega: 0,
    nuevos_pendientes: 0,
    incompleto: false,
    corte: null,
    errores: [],
  };
  const anotar = (mensaje: string) => {
    if (resumen.errores.length < ERRORES_MAX) resumen.errores.push(mensaje);
  };
  const cortar = (corte: NonNullable<ResumenReclamos['corte']>) => {
    resumen.incompleto = true;
    resumen.corte = corte;
  };

  const vendedor = await deps.vendedor();
  if (!vendedor.ok) return vendedor;
  const userId = vendedor.data.externalUserId;
  const pedir = conReintentos(deps);
  const sinGuardar = new Set<string>();

  try {
    // La base primero: si la tabla no existe, falla acá sin gastar pedidos a ML.
    const pendientes = await deps.repo.pendientes(PENDIENTES_MAX);

    const abiertos = await buscar(pedir, {
      'players.role': 'respondent',
      'players.user_id': userId,
      status: 'opened',
    });

    // Sin `players.*`: esta combinación es la que se probó contra la API. Las
    // compras propias se descartan abajo mirando `players`.
    const desde = inicio - dias * 86_400_000;
    const recientes = await buscar(pedir, {
      status: 'closed',
      range: `last_updated:after:${fechaML(desde)},before:${fechaML(inicio)}`,
      sort: 'last_updated:desc',
    });

    if (!abiertos.ok && !recientes.ok) {
      return {
        ok: false,
        error: recientes.error,
        retryable: recientes.error === 'network_error',
      };
    }
    for (const [nombre, b] of [
      ['abiertos', abiertos],
      ['recientes', recientes],
    ] as const) {
      if (!b.ok) {
        anotar(`búsqueda de ${nombre}: ${b.error}`);
        resumen.incompleto = true;
      } else if (b.truncada) {
        anotar(
          `búsqueda de ${nombre}: más de ${PAGINAS_MAX * POR_PAGINA} resultados`,
        );
        cortar('paginas');
      }
    }

    const hallados = new Map<string, MLClaim>();
    for (const c of [...abiertos.reclamos, ...recientes.reclamos]) {
      const id = texto(c.id);
      // Si la cuenta es la que reclama (una compra propia), no es de una venta.
      if (id && rolDe(c, userId) !== 'complainant') hallados.set(id, c);
    }
    resumen.encontrados = hallados.size;

    const guardados = new Map(
      [...pendientes, ...(await deps.repo.leer([...hallados.keys()]))].map(
        (g) => [g.claim_id, g],
      ),
    );

    // Primero lo nuevo o cambiado; después lo pendiente, lo menos mirado antes.
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
    const antiguedad = (id: string) =>
      Date.parse(guardados.get(id)?.synced_at ?? '') || 0;
    const cola = [
      ...nuevos,
      ...[...aRevisar].sort((a, b) => antiguedad(a) - antiguedad(b)),
    ];

    const ctx: Contexto = {
      pedir,
      repo: deps.repo,
      ahora: inicio,
      motivos: new Map(),
    };

    for (const claimId of cola) {
      if (deps.ahora() - inicio > PRESUPUESTO_MS) {
        cortar('tiempo');
        break;
      }
      const ahora = new Date(inicio).toISOString();
      try {
        let claim = hallados.get(claimId);
        if (!claim) {
          const r = await pedir<MLClaim>(
            `/post-purchase/v1/claims/${encodeURIComponent(claimId)}`,
            { operation: 'traer_reclamo' },
          );
          if (!r.ok) {
            anotar(`reclamo ${claimId}: ${r.error}`);
            await deps.repo.marcar(claimId, {
              synced_at: ahora,
              ...(r.error === 'not_found' ? { needs_refresh: false } : {}),
            });
            continue;
          }
          claim = r.data;
        }

        const { fila, fallos } = await armarFila(
          ctx,
          claimId,
          claim,
          guardados.get(claimId),
        );
        await deps.repo.guardar(fila);
        sinGuardar.delete(claimId);

        const previo = guardados.get(claimId);
        resumen.guardados++;
        if (!fila.order_external_id) resumen.sin_venta++;
        if (!fila.reason_detail && !previo?.reason_detail) resumen.sin_motivo++;
        if (!fila.original_delivered_at && !previo?.original_delivered_at)
          resumen.sin_entrega++;
        for (const f of fallos) anotar(`reclamo ${claimId}, ${f}`);
      } catch (err) {
        if (err instanceof CorteDeCorrida) throw err;
        // Un reclamo roto no frena a los demás.
        anotar(
          `reclamo ${claimId}: ${err instanceof Error ? err.message : String(err)}`,
        );
        await deps.repo.marcar(claimId, { synced_at: ahora }).catch(() => {});
      }
    }
  } catch (err) {
    if (err instanceof CorteDeCorrida) {
      // Antes de guardar nada es un fallo; con algo guardado, una corrida parcial.
      if (resumen.guardados === 0) {
        return {
          ok: false,
          error: err.motivo,
          retryable: err.motivo === 'rate_limited',
        };
      }
      cortar(err.motivo === 'rate_limited' ? 'limite_de_ml' : 'token');
    } else {
      console.error('[ml-reclamos] la corrida falló', err);
      return { ok: false, error: 'unknown', retryable: true };
    }
  }

  resumen.nuevos_pendientes = sinGuardar.size;
  return { ok: true, data: resumen };
}

const COLUMNAS_GUARDADO =
  'claim_id, claim_updated_at, needs_refresh, synced_at, reason_id, reason_detail, ' +
  'order_external_id, original_delivered_at, refunded_at, return_id, return_status, ' +
  'return_money_status, return_shipment_id, return_delivered_at, return_tracking_number, ' +
  'fetched_at';

function repoSupabase(): RepoReclamos {
  const supabase = createAdminClient();
  const claims = () => supabase.from('marketplace_claims');

  function exigir(error: { message: string } | null, que: string) {
    if (error) throw new Error(`${que}: ${error.message}`);
  }

  return {
    async pendientes(limite) {
      const { data, error } = await claims()
        .select(COLUMNAS_GUARDADO)
        .eq('marketplace', 'mercadolibre')
        .eq('needs_refresh', true)
        .order('synced_at', { ascending: true })
        .limit(limite);
      exigir(error, 'leer pendientes');
      return (data ?? []) as unknown as ReclamoGuardado[];
    },

    async leer(ids) {
      const filas: ReclamoGuardado[] = [];
      // De a 100, para no armar una URL interminable.
      for (let i = 0; i < ids.length; i += 100) {
        const { data, error } = await claims()
          .select(COLUMNAS_GUARDADO)
          .eq('marketplace', 'mercadolibre')
          .in('claim_id', ids.slice(i, i + 100));
        exigir(error, 'leer reclamos');
        filas.push(...((data ?? []) as unknown as ReclamoGuardado[]));
      }
      return filas;
    },

    async buscarVenta({ ordenOPack, envio, pago }) {
      const ventas = () =>
        supabase
          .from('marketplace_orders')
          .select('external_id, pack_id, shipment_id')
          .eq('marketplace', 'mercadolibre');

      // Sólo dígitos: lo que no sea un id de ML no se busca.
      const esId = (v: string | null): v is string => !!v && /^\d+$/.test(v);
      const intentos = [
        esId(ordenOPack) && (() => ventas().eq('external_id', ordenOPack)),
        esId(ordenOPack) && (() => ventas().eq('pack_id', ordenOPack)),
        esId(envio) && (() => ventas().eq('shipment_id', envio)),
        esId(pago) &&
          (() =>
            ventas().contains('payload', { payments: [{ id: Number(pago) }] })),
      ];
      for (const intento of intentos) {
        if (!intento) continue;
        const { data, error } = await intento().order('external_id').limit(1);
        exigir(error, 'buscar la venta');
        if (data?.[0]) return data[0] as VentaGuardada;
      }
      return null;
    },

    async guardar(fila) {
      const { error } = await claims().upsert(fila, {
        onConflict: 'marketplace,claim_id',
      });
      exigir(error, 'guardar');
    },

    async marcar(claimId, cambios) {
      const { error } = await claims()
        .update(cambios)
        .eq('marketplace', 'mercadolibre')
        .eq('claim_id', claimId);
      exigir(error, 'marcar');
    },
  };
}

function dependenciasReales(): Dependencias {
  return {
    vendedor: getValidAccessToken,
    // `method` fijo a propósito: este módulo no puede escribir en ML.
    pedir: <T>(path: string, opciones: Parameters<PedirML>[1]) =>
      mlFetch<T>(path, { ...opciones, method: 'GET', cache: 'no-store' }),
    repo: repoSupabase(),
    ahora: () => Date.now(),
    esperar: (ms) => new Promise((listo) => setTimeout(listo, ms)),
  };
}
