/**
 * Script: ml-reclamos-selftest
 *
 * Prueba la tarea de reclamos con respuestas de ejemplo, SIN red, SIN base y
 * sin credenciales: ML y Supabase se reemplazan por objetos en memoria. La
 * búsqueda imita lo observado en la API real (exige status, no trae
 * related_entities); el resto está armado a partir de la documentación (ver
 * claims-mapping.ts): que pase prueba la lógica, no que ML conteste así.
 *
 * El disparador "no pisar con vacío" vive en la base y acá se imita.
 *
 * Uso:  pnpm exec tsx --conditions=react-server scripts/ml-reclamos-selftest.ts
 * Sale con código 1 si algo falla.
 */
import assert from 'node:assert/strict';
import {
  traerReclamos,
  type Dependencias,
  type ReclamoGuardado,
  type VentaGuardada,
} from '../lib/integrations/mercadolibre/claims';
import {
  elegirDevolucion,
  fechaDeEstado,
  hayQueVolverAMirar,
  tramosDe,
  type FilaReclamo,
} from '../lib/integrations/mercadolibre/claims-mapping';
import type {
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

const COLUMNAS_CONTROL = ['needs_refresh', 'synced_at'];

function mundo(rutas: Rutas, ventas: VentaGuardada[] = []) {
  const tabla = new Map<string, FilaReclamo>();
  const pedidos: string[] = [];
  const fallaAlGuardar = new Set<string>();
  let reloj = AHORA;

  const deps: Dependencias = {
    vendedor: async () => ({ ok: true, data: { externalUserId: YO } }),
    pedir: async <T>(path: string): Promise<SyncResult<T>> => {
      pedidos.push(path);
      const [ruta = '', query] = path.split('?');
      const q = new URLSearchParams(query);
      const esBusqueda = ruta.endsWith('/claims/search');
      // Como la API real: sin status, 400.
      if (esBusqueda && !q.has('status'))
        return { ok: false, error: 'unknown', retryable: false };
      const clave = esBusqueda ? `search:${q.get('status')}` : ruta;
      const r = rutas[clave] as { __falla?: SyncErrorReason } | undefined;
      if (r === undefined)
        return { ok: false, error: 'not_found', retryable: false };
      if (r.__falla) return { ok: false, error: r.__falla, retryable: false };
      return { ok: true, data: r as T };
    },
    repo: {
      pendientes: async () =>
        [...tabla.values()].filter(
          (f) => f.needs_refresh,
        ) as unknown as ReclamoGuardado[],
      leer: async (ids) =>
        ids
          .map((id) => tabla.get(id))
          .filter(Boolean) as unknown as ReclamoGuardado[],
      buscarVenta: async ({ ordenOPack, envio }) =>
        ventas.find(
          (v) =>
            v.external_id === ordenOPack ||
            v.pack_id === ordenOPack ||
            v.shipment_id === envio,
        ) ?? null,
      guardar: async (fila) => {
        if (fallaAlGuardar.has(fila.claim_id))
          throw new Error('guardar: base caída');
        const previa = tabla.get(fila.claim_id);
        const nueva: Record<string, unknown> = { ...fila };
        if (previa) {
          for (const [k, v] of Object.entries(previa)) {
            if (!COLUMNAS_CONTROL.includes(k) && nueva[k] === null)
              nueva[k] = v;
          }
        }
        // La base pone fetched_at al insertar y no lo vuelve a tocar.
        nueva.fetched_at ??= new Date(reloj).toISOString();
        tabla.set(fila.claim_id, nueva as FilaReclamo);
      },
      marcar: async (id, cambios) => {
        const f = tabla.get(id);
        if (f) tabla.set(id, { ...f, ...cambios });
      },
    },
    ahora: () => reloj,
    esperar: async () => {},
  };
  return {
    deps,
    tabla,
    pedidos,
    fallaAlGuardar,
    avanzar: (ms: number) => (reloj += ms),
  };
}

const VENTA: VentaGuardada = {
  external_id: '2000000000000001',
  pack_id: '2000009999999999',
  shipment_id: '6001',
};

async function correr(m: ReturnType<typeof mundo>, dias = 3) {
  const r = await traerReclamos(dias, m.deps);
  assert.ok(r.ok, r.ok ? '' : r.error);
  return r.data;
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
    assert.ok(!JSON.stringify(f).includes('999,'), 'no se guarda el comprador');
    assert.ok(!('players' in f) && !('payload' in f));
    // Venta conocida y sin reembolso: no se pide la orden.
    assert.ok(!m.pedidos.some((p) => p.startsWith('/orders/')));
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
    assert.ok(!m.pedidos.some((p) => p.startsWith('/orders/')));
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
      assert.ok(!m.pedidos.some((p) => p.startsWith('/orders/')));
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
    'primera carga de 90 días (57 reclamos): costo y segunda corrida',
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
      const m = mundo(rutas, ventas);
      const original = m.deps.pedir;
      m.deps.pedir = async <T>(path: string, o: { operation: string }) => {
        const q = new URLSearchParams(path.split('?')[1]);
        if (q.get('status') !== 'closed') return original<T>(path, o);
        m.pedidos.push(path);
        const offset = Number(q.get('offset'));
        const data = cerrados.slice(offset, offset + 30);
        return { ok: true, data: { data, paging: { total: 55 } } as T };
      };
      const primera = await correr(m, 90);
      assert.equal(primera.guardados, 57);
      assert.equal(primera.nuevos_pendientes, 0);
      // 3 búsquedas + 1 motivo + devolución y entrega por reclamo.
      assert.equal(m.pedidos.length, 3 + 1 + 57 * 2);
      m.pedidos.length = 0;
      const segunda = await correr(m);
      assert.equal(segunda.sin_cambios, 55);
      assert.equal(segunda.guardados, 2, 'sólo los abiertos');
      assert.equal(m.pedidos.length, 3 + 2);
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
      const r = await traerReclamos(3, m.deps);
      assert.equal(r.ok, false);
    },
  );

  await caso(
    '429 desde el arranque: reintenta dos veces y corta con error',
    async () => {
      const m = mundo({ 'search:opened': falla('rate_limited') });
      const r = await traerReclamos(3, m.deps);
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
      await guardar(f);
      m.avanzar(50_000);
    };
    const primera = await correr(m);
    assert.equal(primera.corte, 'tiempo');
    assert.equal(primera.nuevos_pendientes, 1);
    assert.equal(m.tabla.size, 1);
    await correr(m);
    assert.equal(m.tabla.size, 2);
  });

  console.log(
    `\n${pasaron} casos pasaron${process.exitCode ? ', hay fallas' : ''}.`,
  );
}

main();
