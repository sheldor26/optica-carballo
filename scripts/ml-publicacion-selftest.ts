/**
 * Script: ml-publicacion-selftest
 *
 * Prueba, sin red y sin credenciales, la consulta de publicaciones que usa el
 * sistema de la óptica: qué se devuelve y qué se descarta, y la ruta entera con
 * `fetch` simulado (ningún pedido sale de la computadora).
 *
 * Uso:  pnpm exec tsx --conditions=react-server scripts/ml-publicacion-selftest.ts
 * Sale con código 1 si algo falla.
 */
import assert from 'node:assert/strict';
import { createCipheriv, createHash, randomBytes } from 'node:crypto';
import {
  leerFotos,
  leerIds,
  leerPublicacion,
  ML_ITEM_ID,
} from '../lib/integrations/mercadolibre/publicacion';

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

const foto = (id: string) => ({
  id,
  url: `http://http2.mlstatic.com/${id}.jpg`,
  secure_url: `https://http2.mlstatic.com/${id}.jpg`,
});

/** Datos inventados con la forma de `/items/{id}?include_attributes=all`. */
const EJEMPLO = {
  id: 'MLA1000000001',
  title: 'Anteojos De Sol Ejemplo Modelo Uno',
  status: 'active',
  sub_status: [],
  price: 79832.39,
  currency_id: 'ARS',
  available_quantity: 5,
  permalink: 'https://articulo.mercadolibre.com.ar/MLA-1000000001-anteojos-ejemplo-_JM',
  seller_id: 123,
  seller_address: { city: { name: 'dato que no tiene que salir' } },
  attributes: [
    { id: 'BRAND', name: 'Marca', value_name: 'Ejemplo' },
    { id: 'SELLER_PACKAGE_WEIGHT', name: 'Peso del paquete', value_name: '200 g' },
    { id: 'PACKAGE_LENGTH', name: 'Largo del paquete', value_name: '20 cm' },
    { id: 'GTIN', name: 'Código universal', value_name: null },
  ],
  pictures: [foto('A-negro'), foto('B-azul'), { id: 'C-otro', secure_url: 'https://otro.example.com/x.jpg' }],
  variations: [
    {
      id: 111111111111,
      price: 80000,
      available_quantity: 2,
      attribute_combinations: [{ id: 'COLOR', name: 'Color', value_name: 'Negro mate' }],
      attributes: [{ id: 'SELLER_SKU', name: 'SKU', value_name: 'SKU-NEGRO' }],
      picture_ids: ['A-negro', 'C-otro', 'no-existe'],
    },
    {
      id: 222222222222,
      available_quantity: 3,
      attribute_combinations: [{ id: 'COLOR', name: 'Color', value_name: 'Azul' }],
      seller_custom_field: 'SKU-AZUL',
      picture_ids: ['B-azul'],
    },
  ],
};

const SIMPLE = {
  ...EJEMPLO,
  variations: [],
  status: 'paused',
  sub_status: ['out_of_stock'],
  attributes: [
    { id: 'COLOR', name: 'Color', value_name: 'Carey' },
    { id: 'SELLER_SKU', name: 'SKU', value_name: 'SKU-CAREY' },
  ],
};

async function main() {
  console.log('Lectura de la publicación');
  const p = leerPublicacion(EJEMPLO, EJEMPLO.id)!;

  await caso('campos principales', () => {
    assert.equal(p.titulo, EJEMPLO.title);
    assert.equal(p.estado, 'active');
    assert.equal(p.precio, 79832.39);
    assert.equal(p.stock, 5);
    assert.equal(p.enlace, EJEMPLO.permalink);
  });
  await caso('sólo salen los campos de la lista', () => {
    assert.deepEqual(Object.keys(p).sort(), [
      'caracteristicas', 'color', 'enlace', 'estado', 'fotos', 'id', 'moneda', 'precio', 'sku',
      'stock', 'subEstados', 'titulo', 'variantes',
    ]);
    assert.ok(!JSON.stringify(p).includes('dato que no tiene que salir'));
  });
  await caso('sin atributos de paquete ni vacíos', () => {
    assert.deepEqual(p.caracteristicas, [{ nombre: 'Marca', valor: 'Ejemplo' }]);
  });
  await caso('cada variación con su color, SKU, precio y stock', () => {
    assert.deepEqual(
      p.variantes.map((v) => [v.id, v.color, v.sku, v.precio, v.stock]),
      [
        ['111111111111', 'Negro mate', 'SKU-NEGRO', 80000, 2],
        ['222222222222', 'Azul', 'SKU-AZUL', null, 3],
      ],
    );
  });
  await caso('cada variación sólo con sus fotos, y sólo de Mercado Libre', () => {
    assert.deepEqual(p.variantes[0]!.fotos, ['https://http2.mlstatic.com/A-negro.jpg']);
    assert.deepEqual(p.variantes[1]!.fotos, ['https://http2.mlstatic.com/B-azul.jpg']);
    assert.equal(p.fotos.length, 2);
  });
  await caso('publicación sin variaciones y pausada', () => {
    const s = leerPublicacion(SIMPLE, SIMPLE.id)!;
    assert.equal(s.estado, 'paused');
    assert.deepEqual(s.subEstados, ['out_of_stock']);
    assert.equal(s.color, 'Carey');
    assert.equal(s.sku, 'SKU-CAREY');
    assert.deepEqual(s.variantes, []);
  });
  await caso('un estado desconocido no rompe', () => {
    assert.equal(leerPublicacion({ ...SIMPLE, status: 'algo_nuevo' }, SIMPLE.id)!.estado, 'algo_nuevo');
  });
  await caso('un enlace de otro dominio se descarta', () => {
    for (const permalink of ['https://mercadolibre.com.ar.evil.example/x', 'javascript:alert(1)', '']) {
      assert.equal(leerPublicacion({ ...SIMPLE, permalink }, SIMPLE.id)!.enlace, null);
    }
  });
  await caso('forma inesperada o de otra publicación: null', () => {
    assert.equal(leerPublicacion({ message: 'error' }, EJEMPLO.id), null);
    assert.equal(leerPublicacion(null, EJEMPLO.id), null);
    assert.equal(leerPublicacion(EJEMPLO, 'MLA9999999999'), null);
  });
  await caso('id estricto', () => {
    assert.ok(ML_ITEM_ID.test('MLA1000000001'));
    for (const malo of ['MLA', 'MLA-1000000001', 'mla1000000001', 'MLA123/../users', 'MLA12345?x=1', ' MLA12345', 'disponible']) {
      assert.ok(!ML_ITEM_ID.test(malo), malo);
    }
  });

  console.log('Fotos, de a varias');
  const ids = (n: number) => Array.from({ length: n }, (_, i) => `MLA${2000000000 + i}`);

  await caso('ids: sin repetidos, estrictos y con tope de 100', () => {
    assert.deepEqual(leerIds('MLA1000000001,MLA1000000001'), ['MLA1000000001']);
    assert.equal(leerIds(ids(100).join(','))?.length, 100);
    for (const malo of [null, '', 'MLA1000000001,', 'MLA1000000001,abc', ids(101).join(',')]) {
      assert.equal(leerIds(malo), null, String(malo).slice(0, 40));
    }
  });
  await caso('con variaciones no viajan las fotos de la publicación entera', () => {
    const [f] = leerFotos([{ code: 200, body: EJEMPLO }], [EJEMPLO.id])!;
    assert.deepEqual(f!.fotos, []);
    assert.deepEqual(f!.variantes, [
      { id: '111111111111', fotos: ['https://http2.mlstatic.com/A-negro.jpg'] },
      { id: '222222222222', fotos: ['https://http2.mlstatic.com/B-azul.jpg'] },
    ]);
  });
  await caso('sin variaciones: las de la publicación, la primera primero', () => {
    const [f] = leerFotos([{ code: 200, body: SIMPLE }], [SIMPLE.id])!;
    assert.equal(f!.fotos[0], 'https://http2.mlstatic.com/A-negro.jpg');
  });
  await caso('las que fallan o no se pidieron quedan afuera', () => {
    const r = leerFotos(
      [{ code: 404, body: { error: 'not_found' } }, { code: 200, body: EJEMPLO }, { code: 200, body: null }],
      ['MLA9999999999'],
    );
    assert.deepEqual(r, []);
    assert.equal(leerFotos({ error: 'x' }, []), null);
  });

  console.log('Las rutas, con fetch simulado');

  // Credenciales falsas, generadas acá. No se lee ningún .env.
  const clave = randomBytes(32).toString('hex');
  const llave = randomBytes(32).toString('hex');
  Object.assign(process.env, {
    OPTISYS_TOKEN: clave,
    APP_ENCRYPTION_KEY: llave,
    ML_CLIENT_ID: 'prueba',
    ML_CLIENT_SECRET: 'prueba',
    ML_REDIRECT_URI: 'https://example.invalid/cb',
    NEXT_PUBLIC_SUPABASE_URL: 'https://base.example.invalid',
    SUPABASE_SERVICE_ROLE_KEY: 'prueba',
  });
  const cifrar = (t: string) => {
    const k = /^[0-9a-f]{64}$/i.test(llave) ? Buffer.from(llave, 'hex') : createHash('sha256').update(llave).digest();
    const iv = randomBytes(12);
    const c = createCipheriv('aes-256-gcm', k, iv);
    const e = Buffer.concat([c.update(t, 'utf8'), c.final()]);
    return `${iv.toString('hex')}:${c.getAuthTag().toString('hex')}:${e.toString('hex')}`;
  };

  let pedidos: { metodo: string; url: string }[] = [];
  let respuestaML: (url: string) => Response = () => Response.json(EJEMPLO);
  globalThis.fetch = (async (entrada: RequestInfo | URL, init?: RequestInit) => {
    const url = entrada instanceof Request ? entrada.url : String(entrada);
    pedidos.push({ metodo: init?.method ?? 'GET', url });
    if (url.startsWith('https://api.mercadolibre.com/')) return respuestaML(url);
    if (url.includes('/rest/v1/marketplace_integrations')) {
      const fila = {
        id: 'prueba',
        marketplace: 'mercadolibre',
        external_user_id: '1',
        access_token: cifrar('token-falso'),
        refresh_token: cifrar('refresh-falso'),
        token_expires_at: new Date(Date.now() + 3_600_000).toISOString(),
        status: 'active',
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const unaSola = new Headers(init?.headers).get('accept')?.includes('pgrst.object');
      return Response.json(unaSola ? fila : [fila]);
    }
    if (url.includes('/rest/v1/marketplace_sync_errors')) return new Response(null, { status: 201 });
    throw new Error(`pedido no previsto: ${url}`);
  }) as typeof fetch;

  const { GET } = await import('../app/api/optisys/ml/publicacion/[itemId]/route');
  const llamar = async (itemId: string, autorizacion = `Bearer ${clave}`) => {
    pedidos = [];
    const r = await GET(new Request('https://prueba.invalid/x', { headers: { authorization: autorizacion } }), {
      params: Promise.resolve({ itemId }),
    });
    const cuerpo = (await r.json()) as { error?: string; publicacion?: { variantes: unknown[] } };
    return { status: r.status, cuerpo };
  };

  await caso('sin la clave: 401 y no sale ningún pedido', async () => {
    const r = await llamar(EJEMPLO.id, 'Bearer otra');
    assert.equal(r.status, 401);
    assert.equal(pedidos.length, 0);
  });
  await caso('id inválido: 400 publicacion_invalida sin tocar base ni Mercado Libre', async () => {
    const r = await llamar('disponible');
    assert.deepEqual([r.status, r.cuerpo.error], [400, 'publicacion_invalida']);
    assert.equal(pedidos.length, 0);
  });
  await caso('publicación: 200, un solo GET a Mercado Libre y ninguna escritura', async () => {
    const r = await llamar(EJEMPLO.id);
    assert.equal(r.status, 200);
    assert.equal(r.cuerpo.publicacion?.variantes.length, 2);
    assert.deepEqual(
      pedidos.filter((x) => x.url.startsWith('https://api.mercadolibre.com/')).map((x) => x.url),
      [`https://api.mercadolibre.com/items/${EJEMPLO.id}?include_attributes=all`],
    );
    assert.ok(pedidos.every((x) => x.metodo === 'GET'), JSON.stringify(pedidos.map((x) => x.metodo)));
    assert.ok(!JSON.stringify(r.cuerpo).includes('token-falso'));
  });
  await caso('Mercado Libre no la conoce: 404', async () => {
    respuestaML = () => new Response('{}', { status: 404 });
    const r = await llamar(EJEMPLO.id);
    assert.deepEqual([r.status, r.cuerpo.error], [404, 'publicacion_no_encontrada']);
  });
  await caso('demasiados pedidos: 429', async () => {
    respuestaML = () => new Response('{}', { status: 429 });
    assert.equal((await llamar(EJEMPLO.id)).status, 429);
  });
  await caso('respuesta con otra forma: 502', async () => {
    respuestaML = () => Response.json({ cualquier: 'cosa' });
    const consola = console.error;
    console.error = () => {};
    const r = await llamar(EJEMPLO.id);
    console.error = consola;
    assert.deepEqual([r.status, r.cuerpo.error], [502, 'respuesta_inesperada']);
  });

  const varias = await import('../app/api/optisys/ml/publicaciones/route');
  const llamarVarias = async (consulta: string, autorizacion = `Bearer ${clave}`) => {
    pedidos = [];
    const r = await varias.GET(
      new Request(`https://prueba.invalid/x${consulta}`, { headers: { authorization: autorizacion } }),
    );
    const cuerpo = (await r.json()) as { error?: string; publicaciones?: { id: string }[]; incompleta?: boolean };
    return { status: r.status, cuerpo };
  };
  const aML = () => pedidos.filter((x) => x.url.startsWith('https://api.mercadolibre.com/'));
  const multiget = (url: string) =>
    Response.json(
      new URL(url).searchParams.get('ids')!.split(',').map((id) => ({ code: 200, body: { ...SIMPLE, id } })),
    );

  await caso('varias: sin la clave 401, con ids mal 400, sin salir', async () => {
    assert.equal((await llamarVarias(`?ids=${EJEMPLO.id}`, 'Bearer otra')).status, 401);
    assert.equal(pedidos.length, 0);
    const r = await llamarVarias('?ids=sonda');
    assert.deepEqual([r.status, r.cuerpo.error], [400, 'publicaciones_invalidas']);
    assert.equal(pedidos.length, 0);
  });
  await caso('45 publicaciones: tres GET de a 20, de a uno', async () => {
    respuestaML = (url) => multiget(url);
    const r = await llamarVarias(`?ids=${ids(45).join(',')}`);
    assert.equal(r.status, 200);
    assert.equal(r.cuerpo.publicaciones?.length, 45);
    assert.equal(r.cuerpo.incompleta, false);
    assert.deepEqual(aML().map((x) => new URL(x.url).searchParams.get('ids')!.split(',').length), [20, 20, 5]);
    assert.ok(pedidos.every((x) => x.metodo === 'GET'));
  });
  await caso('si una tanda falla, vuelven las otras', async () => {
    let n = 0;
    respuestaML = (url) => (n++ === 1 ? new Response('x', { status: 500 }) : multiget(url));
    const r = await llamarVarias(`?ids=${ids(45).join(',')}`);
    assert.deepEqual([r.status, r.cuerpo.publicaciones?.length, r.cuerpo.incompleta], [200, 25, true]);
  });
  await caso('si no llega ninguna: 502, y con límite 429', async () => {
    respuestaML = () => Response.json({ raro: true });
    assert.equal((await llamarVarias(`?ids=${EJEMPLO.id}`)).status, 502);
    respuestaML = () => new Response('{}', { status: 429 });
    assert.equal((await llamarVarias(`?ids=${ids(45).join(',')}`)).status, 429);
    assert.equal(aML().length, 1);
  });

  console.log(`\n${pasaron} casos pasaron${process.exitCode ? ', con fallas' : ''}.`);
}

void main();
