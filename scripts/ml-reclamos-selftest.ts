/**
 * Script: ml-reclamos-selftest
 *
 * Prueba la postventa (recorridos, avisos, webhook, refresco, resumen,
 * reputación y envíos viejos) con respuestas de ejemplo, SIN red, SIN base y sin
 * credenciales: ML, Supabase y Resend se reemplazan por objetos en memoria. Las
 * formas de las respuestas imitan lo leído de la API real (ver
 * claims-mapping.ts); que pase prueba la lógica, no que ML conteste así.
 *
 * El disparador "no pisar con vacío" y las funciones de avisos viven en la base
 * y acá se imitan (la migración se prueba aparte contra un Postgres local).
 *
 * Uso:  pnpm exec tsx --conditions=react-server scripts/ml-reclamos-selftest.ts
 * Sale con código 1 si algo falla.
 */
import assert from 'node:assert/strict';
import {
  procesarAvisoDeReclamo,
  traerReclamos,
  type Dependencias,
  type FilaReputacion,
  type Modo,
  type ReclamoGuardado,
  type VentaGuardada,
} from '../lib/integrations/mercadolibre/claims';
import {
  correoDeReclamo,
  diaArgentino,
  fechaArgentina,
  type EstadoSync,
} from '../lib/integrations/mercadolibre/claims-avisos';
import {
  articulosDeLaOrden,
  elegirDevolucion,
  fechaDeEstado,
  hayQueVolverAMirar,
  leerDevolucion,
  tramoPrincipal,
  tramosDe,
  type FilaReclamo,
  type Hecho,
} from '../lib/integrations/mercadolibre/claims-mapping';
import {
  reclamoDelRecurso,
  recibirAvisoDeReclamo,
  esTemaDeReclamos,
  type DependenciasAviso,
  type EventoDeAviso,
} from '../lib/integrations/mercadolibre/claims-webhook';
import {
  cargarTandaDeHistorial,
  enviarResumenDiario,
  refrescarPostventa,
} from '../lib/integrations/mercadolibre/postventa';
import { actualizarReputacion } from '../lib/integrations/mercadolibre/reputation';
import {
  refrescarEnviosViejos,
  type CambiosDeEnvio,
} from '../lib/integrations/mercadolibre/orders';
import { tokenRenovadoPorOtro } from '../lib/integrations/mercadolibre/oauth';
import { mlWebhookPayloadSchema } from '../lib/integrations/mercadolibre/schemas';
import { POST as postRefrescar } from '../app/api/optisys/ml/postventa/refrescar/route';
import { GET as getResumen } from '../app/api/cron/ml-reclamos-resumen/route';
import type {
  MarketplaceIntegration,
  SyncErrorReason,
  SyncResult,
} from '../lib/integrations/mercadolibre/types';

const AHORA = Date.parse('2026-11-26T12:00:00.000Z');
const YO = '111';

let pasaron = 0;
async function caso(nombre: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    pasaron += 1;
    console.log(`  ok   ${nombre}`);
  } catch (err) {
    console.error(`  FALLA ${nombre}\n       ${(err as Error).message}`);
    process.exitCode = 1;
  }
}

// ── Respuestas de ejemplo ───────────────────────────────────────────────────
const reclamo = (id: number, extra: Record<string, unknown> = {}) => ({
  id,
  resource: 'order',
  resource_id: 2000000000000000 + id,
  type: 'mediations',
  stage: 'claim',
  status: 'opened',
  reason_id: 'PDD9943',
  date_created: '2026-11-20T10:00:00.000-04:00',
  last_updated: '2026-11-25T10:00:00.000-04:00',
  players: [
    { role: 'complainant', type: 'buyer', user_id: 999 },
    { role: 'respondent', type: 'seller', user_id: Number(YO) },
  ],
  ...extra,
});

const DEVOLUCION = {
  id: 555,
  claim_id: 1,
  type: 'claim',
  subtype: 'return_total',
  status: 'shipped',
  status_money: 'retained',
  refund_at: 'delivered',
  date_created: '2026-11-21T10:00:00.000-04:00',
  date_closed: null,
  resource_type: 'order',
  resource_id: 2000000000000001,
  shipments: [
    {
      shipment_id: 7001,
      type: 'return',
      status: 'shipped',
      tracking_number: 'TRK-1',
      destination: {
        name: 'seller_address',
        shipping_address: { street_name: 'NO GUARDAR' },
      },
    },
  ],
};

const MOTIVO = {
  id: 'PDD9943',
  name: 'defective_item',
  detail: 'El producto es defectuoso.',
};

// ── ML y base de mentira ────────────────────────────────────────────────────
type Rutas = Record<string, unknown>;
const falla = (error: SyncErrorReason) => ({ __falla: error });

function rutasBase(abiertos: unknown[], recientes: unknown[] = []): Rutas {
  return {
    'search:opened': { data: abiertos, paging: { total: abiertos.length } },
    'search:closed': { data: recientes, paging: { total: recientes.length } },
    '/post-purchase/v1/claims/reasons/PDD9943': MOTIVO,
    '/post-purchase/v2/claims/1/returns': DEVOLUCION,
    '/shipments/7001': {
      status: 'shipped',
      substatus: null,
      tracking_number: 'TRK-1',
      tracking_method: 'Correo',
      status_history: { date_shipped: '2026-11-23T09:00:00.000-04:00' },
    },
    '/shipments/6001': {
      status: 'delivered',
      status_history: { date_delivered: '2026-11-12T10:00:00.000-04:00' },
    },
  };
}

/** Las columnas que el disparador conserva cuando llegan en null. */
const SE_VACIAN = new Set([
  'needs_refresh',
  'synced_at',
  'action_responsible',
  'seller_actions',
  'due_date',
  'reputation_due_date',
  'return_id',
  'return_type',
  'return_subtype',
  'return_status',
  'return_money_status',
  'return_refund_trigger',
  'return_opened_at',
  'return_closed_at',
  'return_shipment_id',
  'return_shipments',
  'return_items',
]);
const DEL_ENVIO_DE_VUELTA = new Set([
  'return_shipment_status',
  'return_shipment_substatus',
  'return_tracking_number',
  'return_tracking_method',
  'return_shipped_at',
  'return_delivered_at',
]);

const copia = <T>(v: T): T => structuredClone(v);
/** Cede el turno, como una consulta de verdad: así se intercalan dos corridas. */
const rato = () => new Promise<void>((listo) => setImmediate(listo));

type Enviado = { subject: string; text: string; html: string; clave: string };

function mundo(rutas: Rutas, ventas: VentaGuardada[] = []) {
  const tabla = new Map<string, ReclamoGuardado>();
  const estados = new Map<string, EstadoSync>();
  const reputaciones: FilaReputacion[] = [];
  const pedidos: string[] = [];
  const enviados: Enviado[] = [];
  const fallaAlGuardar = new Set<string>();
  const correo = {
    destino: ['avisos@example.test'] as string[] | null,
    resultado: 'enviado' as 'enviado' | 'fallo' | 'incierto',
  };
  let reloj = AHORA;

  const hechos = (id: string) => tabla.get(id)?.notified?.hechos ?? {};

  const deps: Dependencias = {
    vendedor: async () => ({ ok: true, data: { externalUserId: YO } }),
    pedir: async <T>(path: string): Promise<SyncResult<T>> => {
      await rato();
      pedidos.push(path);
      const [ruta = '', query] = path.split('?');
      const q = new URLSearchParams(query);
      const esBusqueda = ruta.endsWith('/claims/search');
      // Como la API real: sin status, 400.
      if (esBusqueda && !q.has('status'))
        return { ok: false, error: 'unknown', retryable: false };
      const clave = esBusqueda ? `search:${q.get('status')}` : ruta;
      let r = rutas[clave] as { __falla?: SyncErrorReason } | undefined;
      // El detalle de un reclamo, si no se indica otro, es el de la búsqueda.
      const id = /^\/post-purchase\/v1\/claims\/(\d+)$/.exec(ruta)?.[1];
      if (r === undefined && id) {
        r = ['search:opened', 'search:closed']
          .flatMap((k) => (rutas[k] as { data?: { id?: unknown }[] })?.data ?? [])
          .find((c) => String(c.id) === id) as typeof r;
      }
      if (r === undefined)
        return { ok: false, error: 'not_found', retryable: false };
      if (r.__falla) return { ok: false, error: r.__falla, retryable: false };
      return { ok: true, data: copia(r) as T };
    },
    repo: {
      pendientes: async (limite) =>
        copia(
          [...tabla.values()].filter((f) => f.needs_refresh).slice(0, limite),
        ),
      leer: async (ids) =>
        copia(
          ids
            .map((id) => tabla.get(id))
            .filter((f): f is ReclamoGuardado => !!f),
        ),
      buscarVenta: async ({ ordenOPack, envio }) =>
        ventas.find(
          (v) =>
            v.external_id === ordenOPack ||
            v.pack_id === ordenOPack ||
            v.shipment_id === envio,
        ) ?? null,
      guardar: async (fila: FilaReclamo) => {
        await rato();
        if (fallaAlGuardar.has(fila.claim_id))
          throw new Error('guardar: base caída');
        const previa = tabla.get(fila.claim_id) as
          | Record<string, unknown>
          | undefined;
        // Como PostgREST: sólo cambian las columnas que viajan en el JSON.
        const llega = JSON.parse(JSON.stringify(fila)) as Record<
          string,
          unknown
        >;
        const nueva: Record<string, unknown> = { ...previa, ...llega };
        if (previa) {
          const mismoEnvio =
            nueva.return_shipment_id != null &&
            nueva.return_shipment_id === previa.return_shipment_id;
          for (const k of Object.keys(llega)) {
            if (llega[k] !== null || SE_VACIAN.has(k)) continue;
            if (DEL_ENVIO_DE_VUELTA.has(k) && !mismoEnvio) continue;
            nueva[k] = previa[k] ?? null;
          }
        }
        // La base pone fetched_at al insertar y no lo vuelve a tocar.
        nueva.fetched_at ??= new Date(reloj).toISOString();
        nueva.notified ??= null;
        tabla.set(fila.claim_id, nueva as ReclamoGuardado);
        return copia(nueva as ReclamoGuardado);
      },
      marcar: async (id, cambios) => {
        const f = tabla.get(id);
        if (f) tabla.set(id, { ...f, ...cambios });
      },
      abiertosYEnCamino: async () =>
        copia(
          [...tabla.values()].filter(
            (f) =>
              f.status === 'opened' || (f.needs_refresh && !!f.return_status),
          ),
        ),
      anotarAvisos: async (id, estado, nuevos) => {
        await rato();
        const f = tabla.get(id);
        if (!f) return;
        f.notified = copia({
          estado,
          hechos: { ...nuevos, ...f.notified?.hechos },
        });
      },
      tomarAvisos: async (id, ahora) => {
        await rato();
        const tomados: string[] = [];
        const t = Date.parse(ahora);
        for (const [clave, h] of Object.entries(hechos(id))) {
          const colgado =
            h.e === 'enviando' && Date.parse(h.en) < t - 10 * 60_000;
          if (h.e !== 'pendiente' && !colgado) continue;
          const con = h as Hecho & { intento?: string };
          if (
            Date.parse(h.visto) < t - 72 * 3_600_000 ||
            (con.intento && Date.parse(con.intento) < t - 23 * 3_600_000)
          ) {
            Object.assign(h, { e: 'omitido', en: ahora });
            continue;
          }
          Object.assign(h, {
            e: 'enviando',
            en: ahora,
            intento: con.intento ?? ahora,
          });
          tomados.push(clave);
        }
        return tomados;
      },
      cerrarAvisos: async (id, claves, resultado, ahora) => {
        for (const clave of claves) {
          const h = hechos(id)[clave] as
            | (Hecho & { intento?: string })
            | undefined;
          if (h?.e !== 'enviando') continue;
          Object.assign(h, { e: resultado, en: ahora });
          delete h.intento;
        }
      },
      conAvisosPendientes: async (limite, ahora) =>
        [...tabla.keys()]
          .filter((id) =>
            Object.values(hechos(id)).some(
              (h) =>
                h.e === 'pendiente' ||
                (h.e === 'enviando' &&
                  Date.parse(h.en) < Date.parse(ahora) - 10 * 60_000),
            ),
          )
          .slice(0, limite),
      leerEstado: async (clave) => copia(estados.get(clave) ?? null),
      guardarEstado: async (clave, cambios) => {
        estados.set(clave, {
          ok_at: null,
          intento_at: null,
          incompleto: false,
          detalle: null,
          ...estados.get(clave),
          ...cambios,
          clave,
        });
      },
      tomarTurno: async (clave, ahora, margen) => {
        // Sin `await` en el medio: es un solo UPDATE.
        const e = estados.get(clave);
        if (e?.intento_at && Date.parse(e.intento_at) >= ahora - margen)
          return false;
        estados.set(clave, {
          ok_at: null,
          incompleto: false,
          detalle: null,
          ...e,
          intento_at: new Date(ahora).toISOString(),
          clave,
        });
        return true;
      },
      ultimaReputacion: async () => reputaciones.at(-1)?.fetched_at ?? null,
      guardarReputacion: async (fila) => void reputaciones.push(fila),
    },
    cartero: {
      destino: () => correo.destino,
      enviar: async (c, _to, clave) => {
        await rato();
        if (correo.resultado === 'enviado') {
          // Como Resend: la misma clave no sale dos veces.
          if (!enviados.some((e) => e.clave === clave))
            enviados.push({ ...c, clave });
        }
        return correo.resultado;
      },
    },
    ahora: () => reloj,
    esperar: async () => {},
  };
  /** Ya hubo un recorrido completo: no es la primera carga. */
  const conHistoria = () =>
    estados.set('claims', {
      clave: 'claims',
      ok_at: new Date(reloj - 3_600_000).toISOString(),
      intento_at: new Date(reloj - 3_600_000).toISOString(),
      incompleto: false,
      detalle: null,
    });
  return {
    deps,
    tabla,
    estados,
    reputaciones,
    pedidos,
    enviados,
    correo,
    fallaAlGuardar,
    conHistoria,
    avanzar: (ms: number) => (reloj += ms),
  };
}

const VENTA: VentaGuardada = {
  external_id: '2000000000000001',
  pack_id: '2000009999999999',
  shipment_id: '6001',
};

async function correr(
  m: ReturnType<typeof mundo>,
  dias?: number,
  modo?: Modo,
) {
  const r = await traerReclamos({ dias, modo }, m.deps);
  assert.ok(r.ok, r.ok ? '' : r.error);
  return r.data;
}

const MINUTO = 60_000;
const HORA = 3_600_000;

// Respuestas con la forma leída de la API real.
const jugadores = (acciones: unknown[]) => [
  { role: 'complainant', type: 'buyer', user_id: 999, available_actions: [] },
  {
    role: 'respondent',
    type: 'seller',
    user_id: Number(YO),
    available_actions: acciones,
  },
  { role: 'mediator', type: 'internal', user_id: 5 },
];
const accion = (
  action: string,
  mandatory = false,
  due_date: string | null = null,
) => ({ action, mandatory, due_date });

const abierto = (extra: Record<string, unknown> = {}) =>
  reclamo(1, {
    date_created: '2026-11-26T02:00:00.000-04:00',
    players: jugadores([accion('send_message_to_complainant')]),
    claimed_quantity: 1,
    quantity_type: 'total',
    related_entities: ['return'],
    ...extra,
  });

const DETALLE = {
  due_date: '2026-11-29T20:00:00.000-04:00',
  action_responsible: 'complainant',
  title: 'Devolución en camino',
  problem: 'El comprador dice que llegó dañado',
  description: 'TEXTO NO GUARDAR',
};
const IMPACTO = {
  affects_reputation: 'not_affected',
  has_incentive: false,
  due_date: '2026-12-01T00:00:00.000-04:00',
};
const ORDEN = {
  id: 2000000000000001,
  status: 'paid',
  pack_id: 2000009999999999,
  buyer: {
    id: 999,
    nickname: 'APODO123',
    first_name: 'NOMBRE NO GUARDAR',
    last_name: 'NO GUARDAR',
  },
  shipping: { id: 6001 },
  order_items: [
    {
      item: {
        id: 'MLA111',
        title: 'Anteojo de sol Modelo X',
        variation_id: 222,
        seller_sku: 'SKU-1',
        variation_attributes: [
          { id: 'COLOR', name: 'Color', value_name: 'Negro' },
        ],
      },
      quantity: 2,
    },
  ],
  payments: [],
};
const DEVOLUCION_REAL = {
  ...DEVOLUCION,
  type: undefined,
  orders: [
    {
      order_id: 2000000000000001,
      item_id: 'MLA111',
      variation_id: null,
      context_type: 'total',
      total_quantity: '2.0',
      return_quantity: '1.0',
    },
  ],
};

function mundoCompleto(reclamoAbierto = abierto()) {
  const rutas = rutasBase([reclamoAbierto]);
  rutas['/post-purchase/v1/claims/1/detail'] = DETALLE;
  rutas['/post-purchase/v1/claims/1/affects-reputation'] = IMPACTO;
  rutas['/post-purchase/v2/claims/1/returns'] = DEVOLUCION_REAL;
  rutas['/orders/2000000000000001'] = ORDEN;
  rutas[`/users/${YO}`] = {
    nickname: 'NO GUARDAR',
    seller_reputation: {
      level_id: '5_green',
      power_seller_status: 'gold',
      metrics: { sales: { period: '60 days', completed: 100 } },
    },
  };
  return { rutas, m: mundo(rutas, [VENTA]) };
}

/** Cambia el reclamo abierto (con un `last_updated` nuevo) y corre otra vez. */
async function cambiar(
  w: ReturnType<typeof mundoCompleto>,
  extra: Record<string, unknown>,
) {
  w.m.avanzar(HORA);
  const c = abierto({
    last_updated: new Date(w.m.deps.ahora()).toISOString(),
    ...extra,
  });
  const abiertos = c.status === 'opened' ? [c] : [];
  w.rutas['search:opened'] = {
    data: abiertos,
    paging: { total: abiertos.length },
  };
  w.rutas['search:closed'] = {
    data: abiertos.length ? [] : [c],
    paging: { total: abiertos.length ? 0 : 1 },
  };
  w.rutas['/post-purchase/v1/claims/1'] = c;
  return correr(w.m);
}

async function main() {
  console.log('Lectura de respuestas');
  await caso('status_history como objeto, lista o historial suelto', () => {
    const d = '2026-11-01T00:00:00.000-04:00';
    assert.equal(
      fechaDeEstado({ status_history: { date_delivered: d } }, 'delivered'),
      d,
    );
    assert.equal(
      fechaDeEstado(
        { status_history: [{ status: 'delivered', date: d }] },
        'delivered',
      ),
      d,
    );
    assert.equal(fechaDeEstado([{ status: 'shipped', date: d }], 'shipped'), d);
    assert.equal(fechaDeEstado({}, 'delivered'), null);
    assert.equal(fechaDeEstado(null, 'delivered'), null);
  });
  await caso('devolución como objeto, lista, forma vieja o vacía', () => {
    assert.equal(elegirDevolucion(DEVOLUCION)?.id, 555);
    assert.equal(
      elegirDevolucion([
        { id: 1, date_created: '2026-01-01' },
        { id: 2, date_created: '2026-02-01' },
      ])?.id,
      2,
    );
    assert.equal(
      tramosDe({ shipping: { id: 9, status: 'pending' } })[0]?.shipment_id,
      '9',
    );
    assert.equal(elegirDevolucion({}), null);
    assert.equal(elegirDevolucion([]), null);
  });
  await caso('los tramos no arrastran direcciones ni nombres', () => {
    assert.ok(!JSON.stringify(tramosDe(DEVOLUCION)).includes('NO GUARDAR'));
    const t = tramosDe({
      shipments: [{ destination: { name: 'Juana Pérez' } }],
    });
    assert.equal(t[0]?.destination, null);
  });
  await caso('qué se vuelve a mirar', () => {
    const base = {
      fallo: false,
      referencia: '2026-11-20T00:00:00Z',
      ahora: AHORA,
    };
    const con = (status: string, dinero: string) => ({
      ...base,
      status: 'closed',
      devolucion: { status, dinero },
    });
    assert.equal(
      hayQueVolverAMirar({ ...base, status: 'opened', devolucion: null }),
      true,
    );
    assert.equal(
      hayQueVolverAMirar({ ...base, status: 'closed', devolucion: null }),
      false,
    );
    assert.equal(hayQueVolverAMirar(con('shipped', 'retained')), true);
    assert.equal(hayQueVolverAMirar(con('delivered', 'retained')), true);
    assert.equal(hayQueVolverAMirar(con('delivered', 'refunded')), false);
    assert.equal(hayQueVolverAMirar(con('cancelled', 'available')), false);
    assert.equal(
      hayQueVolverAMirar({
        ...con('shipped', 'retained'),
        referencia: '2026-01-01',
      }),
      false,
    );
  });

  console.log('La corrida');
  await caso('reclamo con devolución: todas las columnas', async () => {
    const m = mundo(rutasBase([reclamo(1)]), [VENTA]);
    const r = await correr(m);
    assert.equal(r.encontrados, 1);
    assert.equal(r.guardados, 1);
    assert.deepEqual(r.errores, []);
    const f = m.tabla.get('1')!;
    assert.equal(f.order_external_id, VENTA.external_id);
    assert.equal(f.pack_id, VENTA.pack_id);
    assert.equal(f.reason_detail, MOTIVO.detail);
    assert.equal(f.original_delivered_at, '2026-11-12T10:00:00.000-04:00');
    assert.equal(f.return_status, 'shipped');
    assert.equal(f.return_tracking_number, 'TRK-1');
    assert.equal(f.return_shipped_at, '2026-11-23T09:00:00.000-04:00');
    assert.equal(f.return_refund_trigger, 'delivered');
    assert.equal(f.refunded_at, null);
    assert.equal(f.closed_at, null);
    assert.equal(f.needs_refresh, true);
    assert.equal(f.buyer_id, '999');
    assert.ok(!('players' in f) && !('payload' in f));
  });

  await caso(
    'toda búsqueda manda status, con los filtros probados',
    async () => {
      const m = mundo(rutasBase([]));
      await correr(m, 90);
      const [abiertos, cerrados] = m.pedidos.map(
        (p) => new URLSearchParams(p.split('?')[1]),
      );
      assert.equal(m.pedidos.length, 2);
      assert.equal(abiertos!.get('status'), 'opened');
      assert.equal(abiertos!.get('players.role'), 'respondent');
      assert.equal(abiertos!.get('players.user_id'), YO);
      assert.equal(abiertos!.get('range'), null);
      assert.equal(cerrados!.get('status'), 'closed');
      assert.equal(cerrados!.get('players.role'), null);
      assert.equal(cerrados!.get('sort'), 'last_updated:desc');
      assert.equal(
        cerrados!.get('range'),
        'last_updated:after:2026-08-28T12:00:00.000+00:00,before:2026-11-26T12:00:00.000+00:00',
      );
    },
  );

  const sobreEnvio = reclamo(6, {
    resource: 'shipment',
    resource_id: 6001,
    stage: 'none',
    type: 'cancel_purchase',
  });

  await caso('reclamo sobre el envío: cruza por shipment_id', async () => {
    const m = mundo(rutasBase([sobreEnvio]), [VENTA]);
    await correr(m);
    const f = m.tabla.get('6')!;
    assert.equal(f.resource, 'shipment');
    assert.equal(f.resource_id, '6001');
    assert.equal(f.order_external_id, VENTA.external_id);
    assert.equal(f.pack_id, VENTA.pack_id);
    assert.equal(f.stage, 'none');
    assert.ok(f.original_delivered_at);
    assert.equal(m.pedidos.filter((p) => p === '/shipments/6001').length, 1);
  });

  await caso(
    'reclamo sobre un envío sin cruce directo: el envío dice la orden',
    async () => {
      const rutas = rutasBase([sobreEnvio]);
      rutas['/shipments/6001'] = {
        order_id: 2000000000000001,
        status: 'delivered',
        status_history: { date_delivered: '2026-11-12T10:00:00.000-04:00' },
      };
      const m = mundo(rutas, [{ ...VENTA, shipment_id: null }]);
      await correr(m);
      const f = m.tabla.get('6')!;
      assert.equal(f.order_external_id, VENTA.external_id);
      assert.equal(f.pack_id, VENTA.pack_id);
      assert.ok(f.original_delivered_at);
      assert.equal(m.pedidos.filter((p) => p === '/shipments/6001').length, 1);
    },
  );

  await caso(
    'reclamo sobre un envío de una venta que no está en la base',
    async () => {
      const rutas = rutasBase([sobreEnvio]);
      rutas['/shipments/6001'] = {
        order_id: 2000000000000006,
        status: 'shipped',
      };
      rutas['/orders/2000000000000006'] = {
        id: 2000000000000006,
        pack_id: 2000007777777777,
      };
      const m = mundo(rutas);
      await correr(m);
      const f = m.tabla.get('6')!;
      assert.equal(f.order_external_id, '2000000000000006');
      assert.equal(f.pack_id, '2000007777777777');
      assert.equal(f.original_delivered_at, null);
    },
  );

  await caso(
    'reclamo sobre una orden que no está en la base: guarda orden y pack',
    async () => {
      const rutas = rutasBase([reclamo(4, { stage: 'recontact' })]);
      rutas['/orders/2000000000000004'] = {
        id: 2000000000000004,
        pack_id: 2000006666666666,
      };
      const m = mundo(rutas);
      await correr(m);
      const f = m.tabla.get('4')!;
      assert.equal(f.order_external_id, '2000000000000004');
      assert.equal(f.pack_id, '2000006666666666');
      assert.equal(f.stage, 'recontact');
    },
  );

  await caso(
    'la devolución se pide siempre, y un 404 no es un error',
    async () => {
      const m = mundo(rutasBase([reclamo(4)]), [
        { external_id: '2000000000000004', pack_id: null, shipment_id: null },
      ]);
      const r = await correr(m);
      assert.ok(m.pedidos.includes('/post-purchase/v2/claims/4/returns'));
      assert.deepEqual(r.errores, []);
      assert.equal(m.tabla.get('4')!.return_status, null);
    },
  );

  await caso(
    'cerrado con error permanente: insiste 48 h y deja; con error de red, sigue',
    async () => {
      for (const [error, sigue] of [
        ['unknown', false],
        ['network_error', true],
      ] as const) {
        const cerrado = reclamo(2, {
          status: 'closed',
          resolution: { date_created: '2026-11-25T09:00:00.000-04:00' },
        });
        const rutas = rutasBase([], [cerrado]);
        rutas['/post-purchase/v2/claims/2/returns'] = falla(error);
        rutas['/post-purchase/v1/claims/2'] = cerrado;
        const m = mundo(rutas, [
          { external_id: '2000000000000002', pack_id: null, shipment_id: null },
        ]);
        await correr(m);
        assert.equal(m.tabla.get('2')!.needs_refresh, true);
        m.avanzar(49 * 3_600_000);
        await correr(m);
        assert.equal(m.tabla.get('2')!.needs_refresh, sigue);
      }
    },
  );

  await caso(
    'recorrido con 57 reclamos: costo y segunda corrida',
    async () => {
      const abiertos = [reclamo(900), reclamo(901)];
      const cerrados = Array.from({ length: 55 }, (_, i) =>
        reclamo(100 + i, {
          status: 'closed',
          resolution: { date_created: '2026-11-25T09:00:00.000-04:00' },
        }),
      );
      const rutas = rutasBase(abiertos);
      const ventas = [...abiertos, ...cerrados].map((c) => ({
        external_id: String(c.resource_id),
        pack_id: null,
        shipment_id: '6001',
      }));
      for (const v of ventas) {
        rutas[`/orders/${v.external_id}`] = {
          ...ORDEN,
          id: Number(v.external_id),
          pack_id: null,
        };
      }
      const m = mundo(rutas, ventas);
      const original = m.deps.pedir;
      m.deps.pedir = async <T>(path: string, o: { operation: string }) => {
        const q = new URLSearchParams(path.split('?')[1]);
        if (q.get('status') === 'closed') {
          m.pedidos.push(path);
          const offset = Number(q.get('offset'));
          const data = cerrados.slice(offset, offset + 30);
          return { ok: true, data: { data, paging: { total: 55 } } as T };
        }
        const id = /claims\/(1\d\d)$/.exec(path)?.[1];
        if (id) {
          m.pedidos.push(path);
          return { ok: true, data: cerrados[Number(id) - 100] as T };
        }
        return original<T>(path, o);
      };
      const primera = await correr(m, 90);
      assert.equal(primera.guardados, 57);
      assert.equal(primera.nuevos_pendientes, 0);
      // 3 búsquedas + 1 motivo + por reclamo: detalle, turno, impacto,
      // devolución, orden y entrega.
      assert.equal(m.pedidos.length, 3 + 1 + 57 * 6);
      m.pedidos.length = 0;
      const segunda = await correr(m);
      assert.equal(segunda.sin_cambios, 55);
      assert.equal(segunda.guardados, 2, 'sólo los abiertos');
      // Por abierto: detalle, turno, impacto, devolución y orden.
      assert.equal(m.pedidos.length, 3 + 2 * 5);
    },
  );

  await caso(
    'cerrado y sin cambios: la segunda corrida no pide nada más',
    async () => {
      const cerrado = reclamo(2, {
        status: 'closed',
        resolution: {
          reason: 'respondent_win',
          date_created: '2026-11-25T09:00:00.000-04:00',
          benefited: ['respondent'],
        },
      });
      const m = mundo(rutasBase([], [cerrado]), [
        { external_id: '2000000000000002', pack_id: null, shipment_id: '6001' },
      ]);
      await correr(m);
      assert.equal(m.tabla.get('2')!.needs_refresh, false);
      assert.equal(
        m.tabla.get('2')!.closed_at,
        '2026-11-25T09:00:00.000-04:00',
      );
      m.pedidos.length = 0;
      const r = await correr(m);
      assert.equal(r.sin_cambios, 1);
      assert.equal(r.guardados, 0);
      assert.equal(m.pedidos.length, 2, 'sólo las dos búsquedas');
    },
  );

  await caso(
    'reembolso: fecha del pago de una orden que no estaba en la base',
    async () => {
      const cerrado = reclamo(3, {
        status: 'closed',
        resolution: {
          reason: 'payment_refunded',
          date_created: '2026-11-25T09:00:00.000-04:00',
          benefited: ['complainant'],
        },
      });
      const rutas = rutasBase([], [cerrado]);
      rutas['/orders/2000000000000003'] = {
        id: 2000000000000003,
        pack_id: 2000008888888888,
        shipping: { id: 6001 },
        payments: [
          {
            status: 'refunded',
            date_last_modified: '2026-11-24T08:00:00.000-04:00',
          },
        ],
        buyer: { first_name: 'NO GUARDAR' },
      };
      const m = mundo(rutas);
      await correr(m);
      const f = m.tabla.get('3')!;
      assert.equal(f.pack_id, '2000008888888888');
      assert.equal(f.refunded_at, '2026-11-24T08:00:00.000-04:00');
      assert.equal(f.refunded_at_source, 'order_payment');
      assert.equal(f.resolution_benefited, 'complainant');
      assert.ok(f.original_delivered_at);
      assert.ok(!JSON.stringify(f).includes('NO GUARDAR'));
    },
  );

  await caso(
    'pendiente que ya no aparece en las búsquedas: se pide por id',
    async () => {
      const rutas = rutasBase([reclamo(1)]);
      const m = mundo(rutas, [VENTA]);
      await correr(m);
      rutas['search:opened'] = { data: [], paging: { total: 0 } };
      rutas['/post-purchase/v1/claims/1'] = reclamo(1, {
        status: 'closed',
        resolution: {
          reason: 'item_returned',
          date_created: '2026-11-26T08:00:00.000-04:00',
        },
      });
      rutas['/post-purchase/v2/claims/1/returns'] = {
        ...DEVOLUCION,
        status: 'delivered',
        status_money: 'refunded',
      };
      rutas['/orders/2000000000000001'] = {
        id: 2000000000000001,
        payments: [],
      };
      m.avanzar(3_600_000);
      await correr(m);
      const f = m.tabla.get('1')!;
      assert.equal(f.status, 'closed');
      assert.equal(f.return_money_status, 'refunded');
      assert.equal(
        f.refunded_at,
        null,
        'sin pago devuelto ni resolución de reembolso, no se inventa',
      );
      assert.equal(f.needs_refresh, false);
    },
  );

  await caso(
    'una respuesta vacía no pisa lo guardado y queda para reintentar',
    async () => {
      const rutas = rutasBase([reclamo(1)]);
      const m = mundo(rutas, [VENTA]);
      await correr(m);
      rutas['search:opened'] = {
        data: [reclamo(1, { last_updated: '2026-11-26T01:00:00.000-04:00' })],
        paging: { total: 1 },
      };
      rutas['/post-purchase/v2/claims/1/returns'] = falla('network_error');
      delete rutas['/shipments/6001'];
      const r = await correr(m);
      const f = m.tabla.get('1')!;
      assert.equal(f.return_status, 'shipped');
      assert.equal(f.return_tracking_number, 'TRK-1');
      assert.ok(f.original_delivered_at && f.reason_detail);
      assert.equal(f.needs_refresh, true);
      assert.equal(r.errores.length, 1);
    },
  );

  await caso('un reclamo que explota no frena a los demás', async () => {
    const m = mundo(rutasBase([reclamo(1), reclamo(4)]), [VENTA]);
    m.fallaAlGuardar.add('1');
    const r = await correr(m);
    assert.equal(r.guardados, 1);
    assert.equal(r.nuevos_pendientes, 1);
    assert.ok(m.tabla.has('4'));
    assert.ok(r.errores.some((e) => e.startsWith('reclamo 1:')));
  });

  await caso(
    'campos ausentes: un reclamo con sólo el id se guarda',
    async () => {
      const m = mundo(rutasBase([{ id: 8 }]));
      const r = await correr(m);
      assert.equal(r.guardados, 1);
      assert.equal(r.sin_venta, 1);
      assert.equal(m.tabla.get('8')!.status, null);
    },
  );

  await caso(
    'compras propias (somos quien reclama) quedan afuera',
    async () => {
      const propia = reclamo(9, {
        players: [{ role: 'complainant', user_id: Number(YO) }],
      });
      const r = await correr(mundo(rutasBase([propia])));
      assert.equal(r.encontrados, 0);
    },
  );

  await caso('paginado de la búsqueda', async () => {
    const m = mundo(rutasBase([]));
    const original = m.deps.pedir;
    const offsets: string[] = [];
    m.deps.pedir = async <T>(path: string, o: { operation: string }) => {
      const q = new URLSearchParams(path.split('?')[1]);
      if (q.get('status') !== 'opened') return original<T>(path, o);
      const offset = Number(q.get('offset'));
      offsets.push(String(offset));
      const data = Array.from({ length: offset === 0 ? 30 : 5 }, (_, i) => ({
        id: offset + i + 100,
      }));
      return { ok: true, data: { data, paging: { total: 35 } } as T };
    };
    const r = await correr(m);
    assert.deepEqual(offsets, ['0', '30']);
    assert.equal(r.encontrados, 35);
  });

  await caso(
    'si falla la búsqueda de cerrados, procesa los abiertos y avisa',
    async () => {
      const rutas = rutasBase([reclamo(1)]);
      rutas['search:closed'] = falla('unknown');
      const r = await correr(mundo(rutas, [VENTA]));
      assert.equal(r.guardados, 1);
      assert.equal(r.incompleto, true);
    },
  );

  await caso(
    'sin permiso (las dos búsquedas fallan) devuelve error',
    async () => {
      const m = mundo({
        'search:opened': falla('unknown'),
        'search:closed': falla('unknown'),
      });
      const r = await traerReclamos({ dias: 3 }, m.deps);
      assert.equal(r.ok, false);
    },
  );

  await caso(
    '429 desde el arranque: reintenta dos veces y corta con error',
    async () => {
      const m = mundo({ 'search:opened': falla('rate_limited') });
      const r = await traerReclamos({ dias: 3 }, m.deps);
      assert.deepEqual(r, {
        ok: false,
        error: 'rate_limited',
        retryable: true,
      });
      assert.equal(m.pedidos.length, 3);
    },
  );

  await caso(
    '429 a mitad: conserva lo guardado y marca incompleto',
    async () => {
      const rutas = rutasBase([reclamo(4), reclamo(1)]);
      rutas['/post-purchase/v2/claims/1/returns'] = falla('rate_limited');
      const m = mundo(rutas);
      const r = await correr(m);
      assert.equal(r.guardados, 1);
      assert.equal(r.nuevos_pendientes, 1);
      assert.equal(r.incompleto, true);
      assert.equal(r.corte, 'limite_de_ml');
    },
  );

  await caso('sin tiempo: corta, y la corrida siguiente completa', async () => {
    const m = mundo(rutasBase([reclamo(4), reclamo(5)]));
    const guardar = m.deps.repo.guardar;
    m.deps.repo.guardar = async (f) => {
      const fila = await guardar(f);
      m.avanzar(50_000);
      return fila;
    };
    const primera = await correr(m);
    assert.equal(primera.corte, 'tiempo');
    assert.equal(primera.nuevos_pendientes, 1);
    assert.equal(m.tabla.size, 1);
    await correr(m);
    assert.equal(m.tabla.size, 2);
  });

  console.log('Columnas nuevas y regla de no pisar');
  await caso('turno, plazos, impacto, comprador, venta y devolución', async () => {
    const w = mundoCompleto(
      abierto({
        players: jugadores([
          accion('send_message_to_complainant', false, null),
          accion('refund', false, '2026-11-28T10:00:00.000-04:00'),
          accion('open_dispute', false, '2026-11-30T10:00:00.000-04:00'),
        ]),
      }),
    );
    const r = await correr(w.m);
    assert.deepEqual(r.errores, []);
    const f = w.m.tabla.get('1')!;
    assert.equal(f.buyer_id, '999');
    assert.equal(f.buyer_nickname, 'APODO123');
    assert.equal(f.action_responsible, 'complainant');
    assert.equal(f.seller_actions?.length, 3);
    assert.equal(f.due_date, '2026-11-28T10:00:00.000-04:00', 'el menor');
    assert.equal(f.detail_title, DETALLE.title);
    assert.equal(f.detail_problem, DETALLE.problem);
    assert.equal(f.affects_reputation, 'not_affected');
    assert.equal(f.reputation_due_date, IMPACTO.due_date);
    assert.equal(f.has_incentive, false);
    assert.equal(f.claimed_quantity, 1);
    assert.equal(f.quantity_type, 'total');
    assert.equal(f.order_status, 'paid');
    assert.deepEqual(f.order_items, [
      {
        order_id: '2000000000000001',
        item_id: 'MLA111',
        variation_id: '222',
        seller_sku: 'SKU-1',
        title: 'Anteojo de sol Modelo X',
        color: 'Negro',
        quantity: 2,
      },
    ]);
    assert.deepEqual(f.return_items, [
      {
        order_id: '2000000000000001',
        item_id: 'MLA111',
        variation_id: null,
        return_quantity: 1,
        total_quantity: 2,
      },
    ]);
    assert.ok(!/NO GUARDAR/.test(JSON.stringify(f)));
  });

  await caso('el plazo sale del detalle cuando las acciones no lo traen', async () => {
    const w = mundoCompleto();
    await correr(w.m);
    assert.equal(w.m.tabla.get('1')!.due_date, DETALLE.due_date);
  });

  await caso('lecturas que fallan no borran turno, plazo ni devolución', async () => {
    const w = mundoCompleto();
    await correr(w.m);
    const antes = copia(w.m.tabla.get('1')!);
    for (const ruta of [
      '/post-purchase/v1/claims/1/detail',
      '/post-purchase/v1/claims/1/affects-reputation',
      '/post-purchase/v2/claims/1/returns',
      '/orders/2000000000000001',
      '/shipments/7001',
    ]) {
      w.rutas[ruta] = falla('network_error');
    }
    // El detalle del reclamo llega sin `players`: tampoco borra las acciones.
    const r = await cambiar(w, { players: undefined });
    const f = w.m.tabla.get('1')!;
    for (const k of [
      'action_responsible',
      'seller_actions',
      'due_date',
      'detail_problem',
      'affects_reputation',
      'reputation_due_date',
      'order_status',
      'order_items',
      'buyer_nickname',
      'return_id',
      'return_status',
      'return_shipment_id',
      'return_tracking_number',
      'return_shipped_at',
      'return_items',
    ] as const) {
      assert.deepEqual(f[k], antes[k], k);
    }
    assert.equal(r.incompleto, true);
    assert.equal(f.needs_refresh, true);
  });

  await caso('una respuesta válida sin plazo, turno ni acciones SÍ actualiza', async () => {
    const w = mundoCompleto();
    await correr(w.m);
    w.rutas['/post-purchase/v1/claims/1/detail'] = {
      due_date: null,
      action_responsible: null,
    };
    w.rutas['/post-purchase/v1/claims/1/affects-reputation'] = {
      affects_reputation: 'affected',
    };
    await cambiar(w, { players: jugadores([]) });
    const f = w.m.tabla.get('1')!;
    assert.equal(f.due_date, null);
    assert.equal(f.action_responsible, null);
    assert.deepEqual(f.seller_actions, []);
    assert.equal(f.reputation_due_date, null);
    assert.equal(f.affects_reputation, 'affected');
    assert.equal(f.detail_problem, DETALLE.problem, 'los textos se conservan');
  });

  await caso('devolución: se borra sólo si ML contesta bien que no está', async () => {
    const w = mundoCompleto();
    await correr(w.m);
    // 404 o una respuesta rara con el reclamo diciendo que la hay: no se borra.
    for (const respuesta of [falla('not_found'), { otra: 'forma' }]) {
      w.rutas['/post-purchase/v2/claims/1/returns'] = respuesta;
      await cambiar(w, {});
      assert.equal(w.m.tabla.get('1')!.return_id, '555');
    }
    w.rutas['/post-purchase/v2/claims/1/returns'] = falla('not_found');
    await cambiar(w, { related_entities: [] });
    const f = w.m.tabla.get('1')!;
    assert.equal(f.return_id, null);
    assert.equal(f.return_status, null);
    assert.equal(f.return_shipment_id, null);
    assert.equal(f.return_tracking_number, null);
    assert.equal(f.return_items, null);
    assert.equal(leerDevolucion([]).que, 'no_hay');
    assert.equal(leerDevolucion({ data: [] }).que, 'no_hay');
    assert.equal(leerDevolucion({}).que, 'ilegible');
  });

  await caso('paquete en el depósito de ML: no cuenta como llegado ni avisa', async () => {
    const w = mundoCompleto();
    w.m.conHistoria();
    w.rutas['/post-purchase/v2/claims/1/returns'] = {
      ...DEVOLUCION_REAL,
      status: 'delivered',
      shipments: [
        {
          shipment_id: 7001,
          type: 'return',
          status: 'delivered',
          destination: { name: 'warehouse' },
        },
      ],
    };
    w.rutas['/shipments/7001'] = {
      status: 'delivered',
      status_history: { date_delivered: '2026-11-25T09:00:00.000-04:00' },
    };
    await correr(w.m);
    assert.equal(w.m.tabla.get('1')!.return_delivered_at, null);
    assert.ok(!w.m.enviados.some((e) => /devoluci/i.test(e.subject)));
    // Si después aparece el tramo que viene al vendedor, ése es el principal.
    assert.equal(
      tramoPrincipal(
        tramosDe({
          shipments: [
            { shipment_id: 1, type: 'return', destination: { name: 'warehouse' } },
            { shipment_id: 2, destination: { name: 'seller_address' } },
          ],
        }),
      )?.shipment_id,
      '2',
    );
    assert.equal(articulosDeLaOrden({}, '1'), null);
  });

  await caso('cerrado viejo: sin detalle ni impacto, pero con comprador y venta', async () => {
    const viejo = abierto({
      status: 'closed',
      date_created: '2026-08-01T10:00:00.000-04:00',
      last_updated: '2026-08-20T10:00:00.000-04:00',
      related_entities: [],
      resolution: {
        reason: 'respondent_win',
        date_created: '2026-08-20T10:00:00.000-04:00',
        benefited: ['respondent'],
        applied_coverage: true,
      },
    });
    const w = mundoCompleto(viejo);
    w.rutas['search:opened'] = { data: [], paging: { total: 0 } };
    w.rutas['search:closed'] = { data: [viejo], paging: { total: 1 } };
    await correr(w.m, 120);
    assert.ok(
      !w.m.pedidos.some((p) =>
        /\/detail|affects-reputation|\/returns/.test(p),
      ),
    );
    const f = w.m.tabla.get('1')!;
    assert.equal(f.buyer_nickname, 'APODO123');
    assert.equal(f.order_items?.length, 1);
    assert.equal(f.resolution_coverage, true);
    assert.equal(f.needs_refresh, false);
  });

  await caso('compra propia que sólo se ve en el detalle: no se guarda', async () => {
    const m = mundo(rutasBase([{ id: 9 }]));
    const w = {
      id: 9,
      players: [{ role: 'complainant', user_id: Number(YO) }],
    };
    m.deps.pedir = ((original) =>
      async <T>(path: string, o: { operation: string }) =>
        path === '/post-purchase/v1/claims/9'
          ? { ok: true as const, data: w as T }
          : original<T>(path, o))(m.deps.pedir);
    const r = await correr(m);
    assert.equal(r.guardados, 0);
    assert.equal(r.nuevos_pendientes, 0);
    assert.equal(r.incompleto, false);
    assert.equal(m.tabla.size, 0);
  });

  console.log('Estado de la sincronización');
  await caso('ok_at sólo avanza con un recorrido completo', async () => {
    const w = mundoCompleto();
    await correr(w.m);
    const primero = w.m.estados.get('claims')!;
    assert.equal(primero.ok_at, new Date(AHORA).toISOString());
    assert.equal(primero.incompleto, false);
    w.rutas['search:closed'] = falla('network_error');
    w.m.avanzar(HORA);
    await correr(w.m);
    const segundo = w.m.estados.get('claims')!;
    assert.equal(segundo.ok_at, primero.ok_at);
    assert.equal(segundo.incompleto, true);
    assert.match(segundo.detalle!, /recientes/);
  });

  await caso('token caído: queda anotado y no se pierde ok_at', async () => {
    const m = mundo(rutasBase([]));
    m.conHistoria();
    const antes = m.estados.get('claims')!.ok_at;
    m.deps.vendedor = async () => ({
      ok: false,
      error: 'token_expired',
      retryable: false,
    });
    const r = await traerReclamos({}, m.deps);
    assert.equal(r.ok, false);
    const e = m.estados.get('claims')!;
    assert.equal(e.ok_at, antes);
    assert.equal(e.incompleto, true);
    assert.match(e.detalle!, /token_expired/);
    assert.equal(m.pedidos.length, 0);
  });

  await caso('si estuvo caído varios días, el rango se estira solo', async () => {
    const m = mundo(rutasBase([]));
    m.conHistoria();
    m.avanzar(6 * 24 * HORA);
    await correr(m);
    const rango = new URLSearchParams(
      m.pedidos.find((p) => p.includes('status=closed'))!.split('?')[1],
    ).get('range')!;
    // Seis días y una hora sin completar: 8 días para atrás.
    assert.match(rango, /^last_updated:after:2026-11-24T/);
  });

  await caso('recorrido rápido: no busca cerrados, sigue lo pendiente', async () => {
    const w = mundoCompleto();
    await correr(w.m);
    w.rutas['search:opened'] = { data: [], paging: { total: 0 } };
    w.rutas['/post-purchase/v1/claims/1'] = abierto({
      status: 'closed',
      resolution: { date_created: '2026-11-26T08:00:00.000-04:00' },
    });
    w.m.pedidos.length = 0;
    await correr(w.m, undefined, 'rapido');
    assert.ok(!w.m.pedidos.some((p) => p.includes('status=closed')));
    assert.equal(w.m.tabla.get('1')!.status, 'closed');
  });

  await caso('quedarse sin tiempo sólo con la rotación normal no es incompleto', async () => {
    const rutas = rutasBase([reclamo(4)]);
    const m = mundo(rutas);
    await correr(m);
    for (const id of ['30', '31']) {
      m.tabla.set(id, {
        claim_id: id,
        status: 'closed',
        needs_refresh: true,
        fetched_at: new Date(AHORA).toISOString(),
        notified: null,
      });
      rutas[`/post-purchase/v1/claims/${id}`] = {
        id,
        status: 'closed',
        players: jugadores([]),
      };
    }
    const guardar = m.deps.repo.guardar;
    m.deps.repo.guardar = async (f) => {
      const fila = await guardar(f);
      m.avanzar(50_000);
      return fila;
    };
    const r = await correr(m);
    assert.equal(r.corte, 'tiempo');
    assert.equal(r.incompleto, false);
  });

  console.log('Carga del historial');
  await caso('en tandas reanudables, sin correos y sin tocar el estado', async () => {
    const cerrados = Array.from({ length: 70 }, (_, i) =>
      reclamo(100 + i, {
        status: 'closed',
        date_created: '2026-08-01T10:00:00.000-04:00',
        last_updated: '2026-08-02T10:00:00.000-04:00',
        related_entities: i === 0 ? ['return'] : [],
        players: jugadores([]),
      }),
    );
    const rutas: Rutas = {};
    rutas['/post-purchase/v2/claims/100/returns'] = {
      ...DEVOLUCION_REAL,
      status: 'delivered',
    };
    for (const c of cerrados) rutas[`/post-purchase/v1/claims/${c.id}`] = c;
    const m = mundo(rutas);
    const original = m.deps.pedir;
    m.deps.pedir = async <T>(path: string, o: { operation: string }) => {
      const q = new URLSearchParams(path.split('?')[1]);
      if (!q.has('status')) {
        // Cada pedido tarda medio segundo.
        m.avanzar(500);
        return original<T>(path, o);
      }
      m.pedidos.push(path);
      assert.equal(q.get('status'), 'closed');
      assert.equal(q.get('range'), null);
      const offset = Number(q.get('offset'));
      const data = cerrados.slice(offset, offset + 30);
      return { ok: true, data: { data, paging: { total: 70 } } as T };
    };
    let tandas = 0;
    let r = await correr(m, undefined, 'historico');
    assert.equal(r.historico?.terminado, false);
    assert.equal(r.corte, 'tiempo');
    assert.ok(m.tabla.size > 0 && m.tabla.size < 70);
    while (!r.historico?.terminado) {
      assert.ok(++tandas < 20, 'no termina');
      const antes = m.tabla.size;
      r = await correr(m, undefined, 'historico');
      assert.ok(m.tabla.size > antes || r.historico?.terminado);
    }
    assert.equal(m.tabla.size, 70);
    const pedidosDeDetalle = m.pedidos.filter((p) =>
      /\/claims\/1\d\d$/.test(p),
    );
    assert.equal(pedidosDeDetalle.length, 70, 'cada reclamo, una sola vez');
    assert.equal(m.enviados.length, 0);
    assert.equal(m.estados.size, 0);

    // La tarea programada: termina, lo anota y no vuelve a llamar a ML.
    const ultima = await cargarTandaDeHistorial(m.deps);
    assert.equal(ultima.terminado, true);
    assert.ok(m.estados.get('historico')?.ok_at);
    m.avanzar(HORA);
    m.pedidos.length = 0;
    const despues = await cargarTandaDeHistorial(m.deps);
    assert.deepEqual(despues, { ok: true, terminado: true, omitido: true });
    assert.equal(m.pedidos.length, 0);
    assert.equal(m.enviados.length, 0);
  });

  console.log('Avisos');
  await caso('primera carga: sólo avisa de los abiertos de menos de 48 h', async () => {
    const viejo = reclamo(4, {
      date_created: '2026-11-10T10:00:00.000-04:00',
    });
    const nuevo = reclamo(5, {
      date_created: '2026-11-25T20:00:00.000-04:00',
    });
    const m = mundo(rutasBase([viejo, nuevo]));
    const r = await correr(m);
    assert.equal(r.avisos_enviados, 1);
    assert.match(m.enviados[0]!.clave, /^ml-aviso\/5\//);
    assert.equal(m.tabla.get('4')!.notified!.hechos!.nuevo!.e, 'omitido');
    await correr(m);
    assert.equal(m.enviados.length, 1);
  });

  await caso('reclamo nuevo: un solo correo, sin nombres ni direcciones', async () => {
    const w = mundoCompleto();
    w.m.conHistoria();
    await correr(w.m);
    await correr(w.m);
    w.m.avanzar(HORA);
    await correr(w.m);
    assert.equal(w.m.enviados.length, 1);
    const c = w.m.enviados[0]!;
    assert.match(c.subject, /Reclamo nuevo \(APODO123\)/);
    assert.match(c.text, /Anteojo de sol Modelo X - Negro/);
    assert.match(c.text, /El producto es defectuoso/);
    // 29/11 20:00 -04:00 son las 21:00 en Argentina.
    assert.match(c.text, /29\/11 a las 21:00/);
    assert.match(c.text, /ventas\/2000009999999999\/detalle/);
    assert.ok(!/NO GUARDAR|street|NOMBRE/i.test(c.text + c.html + c.subject));
  });

  await caso('turno, mediación, devolución entregada y reapertura: una vez cada uno', async () => {
    const w = mundoCompleto();
    w.m.conHistoria();
    await correr(w.m);
    w.m.enviados.length = 0;
    const asuntos = () => w.m.enviados.map((e) => e.subject);

    w.rutas['/post-purchase/v1/claims/1/detail'] = {
      ...DETALLE,
      action_responsible: 'respondent',
    };
    await cambiar(w, {});
    await cambiar(w, {});
    assert.equal(w.m.enviados.length, 1);
    assert.match(asuntos()[0]!, /Te toca contestar/);

    await cambiar(w, { stage: 'dispute' });
    await cambiar(w, { stage: 'dispute' });
    assert.equal(w.m.enviados.length, 2);
    assert.match(asuntos()[1]!, /mediación/);

    w.rutas['/post-purchase/v2/claims/1/returns'] = {
      ...DEVOLUCION_REAL,
      status: 'delivered',
    };
    w.rutas['/shipments/7001'] = {
      status: 'delivered',
      tracking_number: 'TRK-1',
      status_history: { date_delivered: '2026-11-26T09:00:00.000-04:00' },
    };
    await cambiar(w, { stage: 'dispute' });
    await cambiar(w, { stage: 'dispute' });
    assert.equal(w.m.enviados.length, 3);
    assert.match(asuntos()[2]!, /Llegó una devolución/);
    assert.match(w.m.enviados[2]!.text, /revisá cómo llegó/);

    const cierre = { date_created: '2026-11-26T12:00:00.000-04:00' };
    await cambiar(w, { status: 'closed', resolution: cierre });
    assert.equal(w.m.enviados.length, 3, 'el cierre no avisa');
    await cambiar(w, { status: 'opened' });
    await cambiar(w, { status: 'opened' });
    assert.equal(w.m.enviados.length, 4);
    assert.match(asuntos()[3]!, /Se reabrió/);
    // Se cierra y se reabre otra vez: es otro hecho.
    await cambiar(w, { status: 'closed', resolution: cierre });
    await cambiar(w, { status: 'opened' });
    assert.equal(w.m.enviados.length, 5);
    assert.match(asuntos()[4]!, /Se reabrió/);
  });

  await caso('una devolución entregada hace semanas no es novedad', async () => {
    const w = mundoCompleto();
    w.m.conHistoria();
    w.rutas['/post-purchase/v2/claims/1/returns'] = {
      ...DEVOLUCION_REAL,
      status: 'delivered',
    };
    w.rutas['/shipments/7001'] = {
      status: 'delivered',
      status_history: { date_delivered: '2026-10-01T09:00:00.000-04:00' },
    };
    await correr(w.m);
    assert.equal(
      w.m.tabla.get('1')!.notified!.hechos!['devolucion:555']!.e,
      'omitido',
    );
  });

  await caso('si el correo falla se reintenta, una sola vez cuando sale', async () => {
    const w = mundoCompleto();
    w.m.conHistoria();
    w.m.correo.resultado = 'fallo';
    const r = await correr(w.m);
    assert.equal(r.avisos_enviados, 0);
    assert.equal(w.m.tabla.get('1')!.notified!.hechos!.nuevo!.e, 'pendiente');
    w.m.correo.resultado = 'enviado';
    await correr(w.m);
    await correr(w.m);
    assert.equal(w.m.enviados.length, 1);
  });

  await caso('un cerrado con aviso sin salir se reintenta aunque no se lo relea', async () => {
    const w = mundoCompleto();
    w.m.conHistoria();
    w.m.correo.resultado = 'fallo';
    await correr(w.m);
    w.rutas['search:opened'] = { data: [], paging: { total: 0 } };
    w.m.tabla.get('1')!.needs_refresh = false;
    w.m.correo.resultado = 'enviado';
    await correr(w.m);
    assert.equal(w.m.enviados.length, 1);
  });

  await caso('envío incierto: no se repite enseguida; después, con la misma clave', async () => {
    const w = mundoCompleto();
    w.m.conHistoria();
    w.m.correo.resultado = 'incierto';
    const claves: string[] = [];
    const enviar = w.m.deps.cartero.enviar;
    w.m.deps.cartero.enviar = async (c, to, clave) => {
      claves.push(clave);
      return enviar(c, to, clave);
    };
    await correr(w.m);
    await correr(w.m);
    assert.equal(claves.length, 1);
    w.m.avanzar(15 * MINUTO);
    w.m.correo.resultado = 'enviado';
    await correr(w.m);
    assert.equal(claves.length, 2);
    assert.equal(claves[0], claves[1]);
  });

  await caso('un turno que ya pasó no se avisa tarde', async () => {
    const w = mundoCompleto();
    w.m.conHistoria();
    await correr(w.m);
    w.m.enviados.length = 0;
    w.m.correo.resultado = 'fallo';
    w.rutas['/post-purchase/v1/claims/1/detail'] = {
      ...DETALLE,
      action_responsible: 'respondent',
    };
    await cambiar(w, {});
    w.m.correo.resultado = 'enviado';
    w.rutas['/post-purchase/v1/claims/1/detail'] = DETALLE;
    await cambiar(w, {});
    assert.equal(w.m.enviados.length, 0);
  });

  await caso('sin ML_AVISOS_EMAIL no manda, y al configurarlo no salen los viejos', async () => {
    const w = mundoCompleto();
    w.m.conHistoria();
    w.m.correo.destino = null;
    await correr(w.m);
    assert.equal(w.m.enviados.length, 0);
    w.m.correo.destino = ['avisos@example.test'];
    await cambiar(w, {});
    assert.equal(w.m.enviados.length, 0);
  });

  await caso('dos corridas a la vez (y un aviso de ML): un solo correo', async () => {
    const w = mundoCompleto();
    w.m.conHistoria();
    await Promise.all([
      correr(w.m),
      correr(w.m, undefined, 'rapido'),
      procesarAvisoDeReclamo('1', w.m.deps),
    ]);
    assert.equal(w.m.enviados.length, 1);
  });

  await caso('una falla al anotar avisos no frena la corrida', async () => {
    const w = mundoCompleto();
    w.m.deps.repo.anotarAvisos = async () => {
      throw new Error('rpc caída');
    };
    const r = await correr(w.m);
    assert.equal(r.guardados, 1);
    assert.ok(r.errores.some((e) => e.includes('rpc caída')));
  });

  await caso('asunto y fechas en hora de Argentina', () => {
    assert.equal(fechaArgentina('2026-11-30T02:30:00Z'), '29/11 a las 23:30');
    assert.equal(diaArgentino(Date.parse('2026-11-30T02:30:00Z')), '2026-11-29');
    const c = correoDeReclamo(
      {
        claim_id: '1',
        fetched_at: '',
        notified: null,
        status: 'opened',
        buyer_nickname: '<b>',
      },
      ['nuevo'],
    );
    assert.ok(!c.html.includes('<b>'));
    assert.match(c.text, /sin fecha límite informada/);
  });

  console.log('Webhook');
  function receptor(m: ReturnType<typeof mundo>) {
    const eventos = new Map<string, EventoDeAviso>();
    const pendientes: Array<() => Promise<void>> = [];
    const deps: DependenciasAviso = {
      eventos: {
        existe: async (id) => eventos.has(id),
        guardar: async (e) => {
          if (eventos.has(e.id)) return 'repetido';
          eventos.set(e.id, e);
          return 'guardado';
        },
        resultado: async (id, status, error) => {
          Object.assign(eventos.get(id)!, { status, error_message: error });
        },
      },
      despues: (t) => void pendientes.push(t),
      procesar: (id) => procesarAvisoDeReclamo(id, m.deps),
    };
    const despues = async () => {
      for (const t of pendientes.splice(0)) await t();
    };
    return { deps, eventos, despues, pendientes };
  }
  const AVISO = {
    _id: 'abc',
    topic: 'post_purchase',
    resource: '/post-purchase/v1/claims/1',
    user_id: Number(YO),
    application_id: 1,
    sent: '2026-11-26T12:00:00.000Z',
    actions: ['claims'],
  };

  await caso('contesta antes de llamar a ML y procesa después', async () => {
    const w = mundoCompleto();
    w.m.conHistoria();
    const h = receptor(w.m);
    const r = await recibirAvisoDeReclamo(AVISO, h.deps);
    assert.deepEqual(r, { ok: true, status: 'received' });
    assert.equal(w.m.pedidos.length, 0);
    assert.equal(h.eventos.get('abc')!.error_message, 'por_procesar');
    await h.despues();
    assert.equal(h.eventos.get('abc')!.status, 'processed');
    assert.equal(w.m.tabla.get('1')!.status, 'opened');
    assert.equal(w.m.enviados.length, 1);
    // El mismo aviso otra vez, y otro aviso del mismo hecho.
    assert.deepEqual(await recibirAvisoDeReclamo(AVISO, h.deps), {
      ok: true,
      deduped: true,
    });
    await recibirAvisoDeReclamo({ ...AVISO, _id: 'def' }, h.deps);
    await h.despues();
    assert.equal(w.m.enviados.length, 1);
    assert.equal(w.m.estados.get('claims')!.ok_at !== null, true);
  });

  await caso('si no se puede traer, queda marcado y el evento como fallido', async () => {
    const w = mundoCompleto();
    await correr(w.m);
    w.m.tabla.get('1')!.needs_refresh = false;
    w.rutas['/post-purchase/v1/claims/1'] = falla('network_error');
    const h = receptor(w.m);
    await recibirAvisoDeReclamo(AVISO, h.deps);
    await h.despues();
    assert.equal(h.eventos.get('abc')!.status, 'failed');
    assert.equal(w.m.tabla.get('1')!.needs_refresh, true);
    assert.equal(w.m.tabla.get('1')!.status, 'opened');
  });

  await caso('temas y recursos: variantes, desconocidos y sin _id', async () => {
    assert.equal(esTemaDeReclamos({ topic: 'claims' }), true);
    assert.equal(esTemaDeReclamos({ topic: 'items' }), false);
    assert.equal(esTemaDeReclamos(null), false);
    assert.equal(reclamoDelRecurso('/post-purchase/v1/claims/123'), '123');
    assert.equal(reclamoDelRecurso('/post-purchase/v1/claims/123/actions'), '123');
    assert.equal(reclamoDelRecurso('/items/MLA1'), null);
    assert.equal(reclamoDelRecurso('/post-purchase/v1/claims/12abc'), null);
    // Un tema desconocido sigue por el camino de siempre (200, ignorado).
    assert.equal(
      mlWebhookPayloadSchema.safeParse({ ...AVISO, topic: 'raro' }).success,
      false,
    );
    const m = mundo(rutasBase([]));
    const h = receptor(m);
    const r = await recibirAvisoDeReclamo(
      { topic: 'post_purchase', resource: '/otra/cosa' },
      h.deps,
    );
    assert.deepEqual(r, { ok: true, status: 'ignored' });
    assert.equal(h.pendientes.length, 0);
    assert.equal(h.eventos.size, 1);
  });

  console.log('Botón de refrescar');
  await caso('con un recorrido completo de hace menos de 4 minutos no llama a ML', async () => {
    const w = mundoCompleto();
    const primera = await refrescarPostventa(w.m.deps);
    assert.deepEqual(primera, {
      ok: true,
      actualizado_en: new Date(AHORA).toISOString(),
      omitido: false,
    });
    assert.equal(w.m.reputaciones.length, 1);
    assert.equal(w.m.enviados.length, 1);
    w.m.pedidos.length = 0;
    w.m.avanzar(3 * MINUTO);
    const segunda = await refrescarPostventa(w.m.deps);
    assert.equal(segunda.omitido, true);
    assert.equal(segunda.actualizado_en, primera.actualizado_en);
    assert.equal(w.m.pedidos.length, 0);
    w.m.avanzar(2 * MINUTO);
    const tercera = await refrescarPostventa(w.m.deps);
    assert.equal(tercera.omitido, false);
    assert.ok(!w.m.pedidos.some((p) => p.startsWith('/users/')), 'reputación fresca');
    assert.equal(w.m.enviados.length, 1);
  });

  await caso('dos botones a la vez: uno recorre y el otro no', async () => {
    const w = mundoCompleto();
    const [a, b] = await Promise.all([
      refrescarPostventa(w.m.deps),
      refrescarPostventa(w.m.deps),
    ]);
    assert.deepEqual([a.omitido, b.omitido].sort(), [false, true]);
    assert.equal(
      w.m.pedidos.filter((p) => p.includes('status=opened')).length,
      1,
    );
  });

  await caso('no arranca mientras corre la tarea de cada hora', async () => {
    const w = mundoCompleto();
    const cron = correr(w.m);
    await rato();
    const boton = await refrescarPostventa(w.m.deps);
    assert.equal(boton.omitido, true);
    await cron;
  });

  await caso('si falla, contesta ok false y deja el candado vencer', async () => {
    const m = mundo({ 'search:opened': falla('network_error') });
    const r = await refrescarPostventa(m.deps);
    assert.deepEqual(r, {
      ok: false,
      actualizado_en: null,
      omitido: false,
      error: 'network_error',
    });
    assert.equal((await refrescarPostventa(m.deps)).omitido, true);
    m.avanzar(71_000);
    assert.equal((await refrescarPostventa(m.deps)).omitido, false);
  });

  await caso('las rutas nuevas rechazan sin clave', async () => {
    delete process.env.OPTISYS_TOKEN;
    delete process.env.CRON_SECRET;
    const url = 'http://localhost/x';
    assert.equal(
      (await postRefrescar(new Request(url, { method: 'POST' }))).status,
      503,
    );
    process.env.OPTISYS_TOKEN = 'clave-de-prueba-de-mas-de-24-caracteres';
    assert.equal(
      (await postRefrescar(new Request(url, { method: 'POST' }))).status,
      401,
    );
    assert.equal((await getResumen(new Request(url))).status, 401);
    delete process.env.OPTISYS_TOKEN;
  });

  console.log('Resumen y reputación');
  await caso('resumen: manda si hay algo abierto, una vez por día', async () => {
    const w = mundoCompleto();
    await correr(w.m);
    w.m.enviados.length = 0;
    assert.deepEqual(await enviarResumenDiario(w.m.deps), {
      ok: true,
      enviado: true,
    });
    await enviarResumenDiario(w.m.deps);
    assert.equal(w.m.enviados.length, 1);
    const c = w.m.enviados[0]!;
    assert.equal(c.clave, 'ml-resumen/2026-11-26');
    assert.match(c.subject, /1 reclamo abierto/);
    assert.match(c.text, /APODO123/);
    assert.ok(!/no se pudo actualizar|NO GUARDAR/i.test(c.text));
  });

  await caso('resumen: nada abierto y al día, no manda', async () => {
    const m = mundo(rutasBase([]));
    await correr(m);
    assert.equal((await enviarResumenDiario(m.deps)).motivo, 'nada_que_contar');
    assert.equal(m.enviados.length, 0);
  });

  await caso('resumen: avisa si la sincronización viene fallando', async () => {
    const m = mundo(rutasBase([]));
    await correr(m);
    m.avanzar(5 * HORA);
    assert.equal((await enviarResumenDiario(m.deps)).enviado, true);
    assert.match(m.enviados[0]!.subject, /no se pudo actualizar/);
    const sinBase = mundo({});
    sinBase.deps.repo.abiertosYEnCamino = async () => {
      throw new Error('sin base');
    };
    assert.equal((await enviarResumenDiario(sinBase.deps)).enviado, true);
  });

  await caso('resumen: devoluciones en camino, y sin destino nada', async () => {
    const m = mundo(rutasBase([]));
    await correr(m);
    m.tabla.set('2', {
      claim_id: '2',
      status: 'closed',
      needs_refresh: true,
      return_id: '5',
      return_status: 'shipped',
      fetched_at: '',
      notified: null,
    });
    await enviarResumenDiario(m.deps);
    assert.match(m.enviados[0]!.subject, /1 devolución en camino/);
    m.correo.destino = null;
    assert.equal((await enviarResumenDiario(m.deps)).motivo, 'sin_destino');
  });

  await caso('reputación: una fila por hora como mucho; la falla queda anotada', async () => {
    const w = mundoCompleto();
    await actualizarReputacion(w.m.deps);
    w.m.avanzar(10 * MINUTO);
    assert.deepEqual(await actualizarReputacion(w.m.deps), {
      ok: true,
      omitido: true,
    });
    assert.equal(w.m.reputaciones.length, 1);
    assert.equal(w.m.reputaciones[0]!.level_id, '5_green');
    assert.ok(!JSON.stringify(w.m.reputaciones).includes('NO GUARDAR'));
    const ok = w.m.estados.get('reputation')!.ok_at;
    w.m.avanzar(HORA);
    w.rutas[`/users/${YO}`] = falla('network_error');
    assert.equal((await actualizarReputacion(w.m.deps)).ok, false);
    assert.equal(w.m.reputaciones.length, 1);
    assert.equal(w.m.estados.get('reputation')!.ok_at, ok);
    assert.equal(w.m.estados.get('reputation')!.incompleto, true);
    w.rutas[`/users/${YO}`] = falla('rate_limited');
    assert.deepEqual(await actualizarReputacion(w.m.deps), {
      ok: false,
      error: 'rate_limited',
    });
  });

  console.log('Envíos viejos y token');
  function envios(rutas: Rutas, cantidad = 2) {
    const cambios = new Map<string, CambiosDeEnvio>();
    const pedidos: string[] = [];
    let argumentos: { limite: number; antesDe: string } | undefined;
    return {
      cambios,
      pedidos,
      argumentos: () => argumentos,
      deps: {
        pedir: async <T>(path: string): Promise<SyncResult<T>> => {
          pedidos.push(path);
          const r = rutas[path] as { __falla?: SyncErrorReason } | undefined;
          if (!r) return { ok: false, error: 'not_found', retryable: false };
          if (r.__falla)
            return { ok: false, error: r.__falla, retryable: false };
          return { ok: true, data: r as T };
        },
        ventasSinCerrar: async (a: { limite: number; antesDe: string }) => {
          argumentos = a;
          return Array.from({ length: cantidad }, (_, i) => ({
            external_id: String(i + 1),
            shipment_id: String(i + 101),
          }));
        },
        actualizar: async (id: string, c: CambiosDeEnvio) =>
          void cambios.set(id, c),
        ahora: () => AHORA,
      },
    };
  }

  await caso('envíos viejos: sólo estado, acotado y sin pisar con vacío', async () => {
    const e = envios({
      '/shipments/101': { status: 'delivered', substatus: null },
      '/orders/1': { status: 'paid', buyer: { first_name: 'NO' } },
      '/shipments/102': falla('network_error'),
      '/orders/2': {},
    });
    const r = await refrescarEnviosViejos(e.deps);
    assert.equal(r.revisadas, 2);
    assert.equal(r.actualizadas, 1);
    assert.deepEqual(Object.keys(e.cambios.get('1')!).sort(), [
      'shipping_estado',
      'status',
      'updated_at',
    ]);
    assert.deepEqual(Object.keys(e.cambios.get('2')!), ['updated_at']);
    assert.equal(e.argumentos()!.limite, 20);
    assert.equal(e.argumentos()!.antesDe, '2026-11-19T12:00:00.000Z');
  });

  await caso('envíos viejos: con límite de ML se corta sin escribir', async () => {
    const e = envios({
      '/shipments/101': falla('rate_limited'),
      '/orders/1': { status: 'paid' },
    });
    const r = await refrescarEnviosViejos(e.deps);
    assert.equal(r.revisadas, 0);
    assert.equal(e.cambios.size, 0);
    assert.equal(e.pedidos.length, 2);
  });

  await caso('renovación simultánea del token: usa la que guardó el otro', async () => {
    const con = (refreshToken: string) =>
      ({ refreshToken }) as MarketplaceIntegration;
    let lecturas = 0;
    const deOtro = await tokenRenovadoPorOtro(
      'viejo',
      async () => con(++lecturas < 2 ? 'viejo' : 'nuevo'),
      async () => {},
    );
    assert.equal(deOtro?.refreshToken, 'nuevo');
    assert.equal(
      await tokenRenovadoPorOtro(
        'viejo',
        async () => con('viejo'),
        async () => {},
      ),
      null,
    );
  });

  console.log(
    `\n${pasaron} casos pasaron${process.exitCode ? ', hay fallas' : ''}.`,
  );
}

main();
