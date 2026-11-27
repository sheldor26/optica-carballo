/**
 * Script: ml-catalogo-selftest
 *
 * Prueba, sin red y sin credenciales, la lista de publicaciones que usa el
 * sistema de la óptica para enlazarlas con su stock (`fetch` simulado: ningún
 * pedido sale de la computadora).
 *
 * Uso:  pnpm exec tsx --conditions=react-server scripts/ml-catalogo-selftest.ts
 * Sale con código 1 si algo falla.
 */
import assert from 'node:assert/strict';
import { createCipheriv, createHash, randomBytes } from 'node:crypto';
import {
  leerDeCatalogo,
  leerPagina,
  leerPedido,
  type PublicacionDeCatalogo,
} from '../lib/integrations/mercadolibre/catalogo-optisys';

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

const foto = (id: string) => ({ id, secure_url: `https://http2.mlstatic.com/${id}.jpg` });

/** Datos inventados. */
const item = (id: string, extra: object = {}) => ({
  id,
  title: 'Anteojos De Sol Ejemplo',
  status: 'active',
  price: 100,
  currency_id: 'ARS',
  available_quantity: 2,
  attributes: [
    { id: 'COLOR', name: 'Color', value_name: 'Negro' },
    { id: 'SELLER_SKU', name: 'SKU', value_name: 'SKU-ATRIBUTO' },
    { id: 'GENDER', name: 'Género', value_name: 'Unisex' },
  ],
  pictures: ['a', 'b', 'c', 'd', 'e'].map(foto),
  user_product_id: 'MLAU1',
  seller_address: { city: { name: 'dato que no tiene que salir' } },
  ...extra,
});

const ID = 'MLA1000000001';
const q = (s: string) => new URLSearchParams(s);

async function main() {
  console.log('Pedidos');
  await caso('página y reintento', () => {
    assert.deepEqual(leerPedido(q('estado=active')), { modo: 'pagina', estado: 'active', cursor: null });
    assert.deepEqual(leerPedido(q('estado=paused&cursor=eyJhIjoxfQ==')), {
      modo: 'pagina',
      estado: 'paused',
      cursor: 'eyJhIjoxfQ==',
    });
    assert.deepEqual(leerPedido(q(`ids=${ID},${ID}`)), { modo: 'ids', ids: [ID] });
  });
  await caso('lo mal armado no pasa', () => {
    const muchos = Array.from({ length: 41 }, (_, i) => `MLA${2000000000 + i}`).join(',');
    for (const malo of ['', 'estado=closed', 'estado=active&cursor=a%26b', 'ids=', 'ids=abc', `ids=${ID}&estado=active`, `ids=${muchos}`]) {
      assert.equal(leerPedido(q(malo)), null, malo.slice(0, 50));
    }
  });
  await caso('página: ids válidos, sigue mientras haya resultados', () => {
    assert.deepEqual(leerPagina({ results: [ID, 'x', 3], scroll_id: 's', paging: { total: 9 } }), {
      ids: [ID],
      siguiente: 's',
      total: 9,
    });
    assert.deepEqual(leerPagina({ results: [], scroll_id: 's' }), { ids: [], siguiente: null, total: null });
    assert.equal(leerPagina({ message: 'x' }), null);
  });

  console.log('Cada publicación');
  await caso('las de catálogo se marcan aparte', () => {
    assert.equal(leerDeCatalogo(item(ID, { catalog_listing: true }), ID), 'catalogo');
  });
  await caso('recortada, con el producto y el código de la venta', () => {
    const p = leerDeCatalogo(item(ID), ID) as PublicacionDeCatalogo;
    assert.equal(p.producto, 'MLAU1');
    assert.equal(p.codigoPropio, 'SKU-ATRIBUTO');
    assert.equal(p.fotos.length, 3);
    assert.deepEqual(p.caracteristicas.map((c) => c.nombre), ['Color']);
    assert.ok(!JSON.stringify(p).includes('dato que no tiene que salir'));
  });
  await caso('el código propio le gana al SKU, como en las ventas', () => {
    const p = leerDeCatalogo(item(ID, { seller_custom_field: 'PROPIO' }), ID) as PublicacionDeCatalogo;
    assert.equal(p.codigoPropio, 'PROPIO');
  });
  await caso('cada variación con su producto', () => {
    const p = leerDeCatalogo(
      item(ID, {
        user_product_id: null,
        variations: [
          { id: 11, user_product_id: 'MLAU11', picture_ids: ['a', 'b', 'c', 'd'] },
          { id: 22 },
        ],
      }),
      ID,
    ) as PublicacionDeCatalogo;
    assert.deepEqual(p.variantes.map((v) => [v.id, v.producto, v.fotos.length]), [
      ['11', 'MLAU11', 3],
      ['22', null, 0],
    ]);
  });

  console.log('La ruta, con fetch simulado');
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
  let respuestaML: (url: string) => Response = () => Response.json({});
  globalThis.fetch = (async (entrada: RequestInfo | URL, init?: RequestInit) => {
    const url = entrada instanceof Request ? entrada.url : String(entrada);
    pedidos.push({ metodo: init?.method ?? 'GET', url });
    if (url.startsWith('https://api.mercadolibre.com/')) return respuestaML(url);
    if (url.includes('/rest/v1/marketplace_integrations')) {
      const fila = {
        id: 'prueba',
        marketplace: 'mercadolibre',
        external_user_id: '77',
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

  const { GET } = await import('../app/api/optisys/ml/catalogo/route');
  const llamar = async (consulta: string, autorizacion = `Bearer ${clave}`) => {
    pedidos = [];
    const r = await GET(
      new Request(`https://prueba.invalid/x?${consulta}`, { headers: { authorization: autorizacion } }),
    );
    const cuerpo = (await r.json()) as {
      error?: string;
      publicaciones: PublicacionDeCatalogo[];
      deCatalogo: number;
      fallidas: string[];
      siguiente: string | null;
      total: number | null;
    };
    return { status: r.status, cuerpo };
  };
  const aML = () => pedidos.filter((x) => x.url.startsWith('https://api.mercadolibre.com/'));

  await caso('sin la clave: 401 y no sale ningún pedido', async () => {
    assert.equal((await llamar('estado=active', 'Bearer otra')).status, 401);
    assert.equal(pedidos.length, 0);
  });
  await caso('mal armado: 400 sin tocar base ni Mercado Libre', async () => {
    const r = await llamar('estado=sonda');
    assert.deepEqual([r.status, r.cuerpo.error], [400, 'pedido_invalido']);
    assert.equal(pedidos.length, 0);
  });

  const ids = [1, 2, 3, 4].map((n) => `MLA100000000${n}`);
  await caso('una página: lista, publicaciones, catálogo aparte y fallidas', async () => {
    respuestaML = (url) => {
      if (url.includes('/items/search')) {
        return Response.json({ results: ids, scroll_id: 'abc', paging: { total: 4 } });
      }
      if (url.includes(ids[1]!)) return Response.json(item(ids[1]!, { catalog_listing: true }));
      if (url.includes(ids[2]!)) return new Response('x', { status: 500 });
      if (url.includes(ids[3]!)) return new Response('x', { status: 404 });
      return Response.json(item(ids[0]!));
    };
    const r = await llamar('estado=active');
    assert.equal(r.status, 200);
    assert.deepEqual(r.cuerpo.publicaciones.map((p) => p.id), [ids[0]]);
    assert.deepEqual([r.cuerpo.deCatalogo, r.cuerpo.fallidas, r.cuerpo.siguiente, r.cuerpo.total], [1, [ids[2]], 'abc', 4]);
    assert.equal(
      aML()[0]!.url,
      'https://api.mercadolibre.com/users/77/items/search?search_type=scan&status=active&limit=40',
    );
    assert.ok(pedidos.every((x) => x.metodo === 'GET' || x.url.includes('marketplace_sync_errors')));
    assert.ok(!JSON.stringify(r.cuerpo).includes('token-falso'));
  });
  await caso('la página siguiente lleva el cursor y la última no ofrece otra', async () => {
    respuestaML = () => Response.json({ results: [], scroll_id: 'abc' });
    const r = await llamar('estado=paused&cursor=abc');
    assert.equal(r.cuerpo.siguiente, null);
    assert.ok(aML()[0]!.url.endsWith('status=paused&limit=40&scroll_id=abc'));
  });
  await caso('reintento por id, sin pedir la lista', async () => {
    respuestaML = () => Response.json(item(ID));
    const r = await llamar(`ids=${ID}`);
    assert.equal(r.cuerpo.publicaciones.length, 1);
    assert.equal(aML().length, 1);
  });
  await caso('límite de Mercado Libre: lo que falta queda como fallido', async () => {
    respuestaML = () => new Response('x', { status: 429 });
    const r = await llamar(`ids=${ids.join(',')}`);
    assert.deepEqual([r.status, r.cuerpo.fallidas], [200, ids]);
    assert.equal(aML().length, 1);
  });
  await caso('la lista no llega: error y no inventa nada', async () => {
    respuestaML = () => new Response('x', { status: 429 });
    const r = await llamar('estado=active');
    assert.deepEqual([r.status, r.cuerpo.error], [429, 'rate_limited']);
  });

  console.log(`\n${pasaron} casos pasaron`);
}

void main();
