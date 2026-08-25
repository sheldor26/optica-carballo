/**
 * Qué hay publicado en Mercado Libre que todavía no está en el catálogo del sitio.
 *
 * Cruza las publicaciones del vendedor contra `product_variants.mercadolibre_item_id`
 * (+ `mercadolibre_variation_code` cuando el item tiene variaciones) y lista lo que
 * no aparece de ningún lado.
 *
 * El matcheo es por variación, no por item: una publicación multi-variación puede
 * estar "cargada" a medias — con dos colores en el sitio y un tercero no. Contar
 * por item escondería justo eso.
 *
 * Uso:
 *   pnpm ml:faltantes
 *   pnpm ml:faltantes --marca rusty
 *   pnpm ml:faltantes --incluir-pausadas
 *   pnpm ml:faltantes --json <archivo>
 */

import fs from 'node:fs';
import { obtenerIntegracionML } from './lib/ml-auth';
import { crearClienteAdmin } from './lib/supabase-script';

const API = 'https://api.mercadolibre.com';
/** Sol y armazones sin graduar: las dos categorías donde vive el catálogo. */
const CATEGORIAS = new Set(['MLA417128', 'MLA417127']);
const MARCAS = ['vulk', 'rusty'];

function flag(nombre: string): string | undefined {
  const i = process.argv.indexOf(`--${nombre}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

type Variacion = {
  id: number;
  available_quantity: number;
  price?: number;
  attribute_combinations?: Array<{ id: string; value_name: string | null }>;
};

type Item = {
  id: string;
  title: string;
  status: string;
  category_id: string;
  price: number;
  available_quantity: number;
  sold_quantity: number;
  permalink: string;
  /** Mismo User Product = mismo pozo de stock, aunque sean items distintos. */
  user_product_id?: string | null;
  attributes?: Array<{ id: string; value_name: string | null }>;
  variations?: Variacion[];
};

async function get<T>(path: string, token: string): Promise<T> {
  const res = await fetch(API + path, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`GET ${path} → HTTP ${res.status}. ${(await res.text()).slice(0, 200)}`);
  return (await res.json()) as T;
}

/** Los ids del vendedor, paginando de a 100 (el máximo que acepta el endpoint). */
async function todosLosIds(userId: string, token: string, estados: string[]): Promise<string[]> {
  const ids: string[] = [];
  for (const estado of estados) {
    let offset = 0;
    for (;;) {
      const r = await get<{ results: string[]; paging: { total: number } }>(
        `/users/${userId}/items/search?status=${estado}&limit=100&offset=${offset}`,
        token,
      );
      ids.push(...r.results);
      offset += 100;
      // El endpoint corta en 1000 por combinación de filtros; con ~650 activas no llegamos.
      if (offset >= r.paging.total || offset >= 1000 || r.results.length === 0) break;
    }
  }
  return ids;
}

/**
 * Normaliza un nombre de modelo para poder compararlo.
 *
 * Los MODEL de las publicaciones vienen sucios: algunos traen el color pegado
 * ("SOTION MBLK S10 POLARZED"), otros signos ("And Now?"), otros el espacio de
 * más o de menos ("PRO30" vs "PRO 30", "YA U" vs "Yau"). Sin normalizar, el
 * mismo anteojo aparece tres veces y encima como "no cargado" cuando sí está.
 */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // el color suele venir después de una barra
    .split('/')[0]!
    // códigos de color y atributos que se cuelan en el nombre del modelo
    .replace(/\b(mblk|sblk|cry|mdemi|sdemi|demi|lgrey|l\.?grey|steelblue|steel blue|rose|pink|brown|blue|black|s10|s15|g15|g91|sg91|revo|pol|polarized|polarizado|polarzed|polarize|drt\d*|gb\d+|gg\d+|c\d+|\d{3,})\b/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** "pro 30" y "pro30" son el mismo anteojo. */
function clave(texto: string): string {
  return normalizar(texto).replace(/\s/g, '');
}

function modeloDe(item: Item): string {
  const m = item.attributes?.find((a) => a.id === 'MODEL')?.value_name;
  if (m && m.trim()) return m.trim();
  const d = item.attributes?.find((a) => a.id === 'DETAILED_MODEL')?.value_name;
  return d?.trim() || '(sin modelo declarado)';
}

function marcaDe(item: Item): string | null {
  const b = item.attributes?.find((a) => a.id === 'BRAND')?.value_name;
  return b ? b.toLowerCase() : null;
}

function etiquetaVariacion(v: Variacion): string {
  const partes = (v.attribute_combinations ?? [])
    .filter((c) => /COLOR/i.test(c.id))
    .map((c) => c.value_name)
    .filter(Boolean);
  return partes.length > 0 ? partes.join(' / ') : `variación ${v.id}`;
}

async function main(): Promise<void> {
  const soloMarca = flag('marca')?.toLowerCase();
  const incluirPausadas = process.argv.includes('--incluir-pausadas');
  const salidaJson = flag('json');

  const { token, externalUserId } = await obtenerIntegracionML();
  const estados = incluirPausadas ? ['active', 'paused'] : ['active'];

  console.log(`\nLeyendo publicaciones (${estados.join(' + ')})...`);
  const ids = await todosLosIds(externalUserId, token, estados);
  console.log(`  ${ids.length} publicaciones`);

  // multiget de a 20, que es el tope del endpoint
  const items: Item[] = [];
  for (let i = 0; i < ids.length; i += 20) {
    const lote = ids.slice(i, i + 20).join(',');
    const r = await get<Array<{ code: number; body: Item }>>(`/items?ids=${lote}`, token);
    for (const x of r) if (x.code === 200) items.push(x.body);
    process.stdout.write(`\r  detalle: ${items.length}/${ids.length}`);
  }
  console.log('');

  const deInteres = items.filter((it) => {
    if (!CATEGORIAS.has(it.category_id)) return false;
    const m = marcaDe(it);
    if (!m || !MARCAS.includes(m)) return false;
    return !soloMarca || m === soloMarca;
  });
  console.log(`  ${deInteres.length} son de Vulk o Rusty en las categorías del catálogo\n`);

  const supabase = crearClienteAdmin();
  const { data: variantes } = await supabase
    .from('product_variants')
    .select('mercadolibre_item_id, mercadolibre_variation_code')
    .not('mercadolibre_item_id', 'is', null);

  const mapeadas = new Set<string>();
  for (const v of (variantes ?? []) as Array<{
    mercadolibre_item_id: string;
    mercadolibre_variation_code: string | null;
  }>) {
    mapeadas.add(`${v.mercadolibre_item_id}::${v.mercadolibre_variation_code ?? 'SIMPLE'}`);
    mapeadas.add(v.mercadolibre_item_id);
  }

  type Falta = {
    item: string;
    titulo: string;
    marca: string;
    estado: string;
    categoria: string;
    precio: number;
    stock: number;
    vendidos: number;
    link: string;
    variacion?: string;
    etiqueta?: string;
    parcial?: boolean;
    modelo: string;
    pozo: string;
  };

  const faltan: Falta[] = [];

  for (const it of deInteres) {
    const base = {
      item: it.id,
      titulo: it.title,
      modelo: modeloDe(it),
      // El pozo de stock: dos publicaciones del mismo User Product comparten
      // unidades. Sin esto, el mismo inventario se cuenta una vez por publicación.
      pozo: it.user_product_id ?? it.id,
      marca: marcaDe(it) ?? '?',
      estado: it.status,
      categoria: it.category_id === 'MLA417128' ? 'sol' : 'armazón',
      vendidos: it.sold_quantity,
      link: it.permalink,
    };

    if (!it.variations || it.variations.length === 0) {
      if (!mapeadas.has(`${it.id}::SIMPLE`) && !mapeadas.has(it.id)) {
        faltan.push({ ...base, precio: it.price, stock: it.available_quantity });
      }
      continue;
    }

    // Con variaciones, se evalúa una por una: puede estar cargado a medias.
    const sinCargar = it.variations.filter((v) => !mapeadas.has(`${it.id}::${v.id}`));
    const parcial = sinCargar.length < it.variations.length;
    for (const v of sinCargar) {
      faltan.push({
        ...base,
        precio: v.price ?? it.price,
        stock: v.available_quantity,
        variacion: String(v.id),
        etiqueta: etiquetaVariacion(v),
        parcial,
      });
    }
  }

  const porItem = new Map<string, Falta[]>();
  for (const f of faltan) {
    if (!porItem.has(f.item)) porItem.set(f.item, []);
    porItem.get(f.item)!.push(f);
  }

  // El founder pregunta por MODELOS, no por publicaciones: tiene varias
  // publicaciones del mismo anteojo con títulos distintos. Agrupar por item
  // daría 350 filas de ruido; agrupar por modelo da la lista accionable.
  const { data: productos } = await supabase.from('products').select('name, slug');
  const enElSitio = new Set(
    ((productos ?? []) as Array<{ name: string; slug: string }>).flatMap((p) => [
      clave(p.name.replace(/^(rusty|vulk)\s+/i, '').replace(/\s+optics$/i, '')),
      clave(p.slug.replace(/^(rusty|vulk)-/, '').replace(/-receta$/, '').replace(/-/g, ' ')),
    ]),
  );

  type Grupo = {
    marca: string; modelo: string; categorias: Set<string>;
    items: Set<string>; variantes: number; stock: number;
    precios: number[]; vendidos: number; parcial: boolean; link: string;
    pozos: Map<string, number>;
  };
  const porModelo = new Map<string, Grupo>();
  for (const f of faltan) {
    const k = `${f.marca}|${clave(f.modelo)}|${f.categoria}`;
    let g = porModelo.get(k);
    if (!g) {
      g = { marca: f.marca, modelo: f.modelo, categorias: new Set(), items: new Set(),
            variantes: 0, stock: 0, precios: [], vendidos: 0, parcial: false, link: f.link,
            pozos: new Map() };
      porModelo.set(k, g);
    }
    g.categorias.add(f.categoria);
    g.items.add(f.item);
    // Un pozo cuenta una sola vez, con el stock que declara.
    const clavePozo = f.variacion ? `${f.pozo}::${f.variacion}` : f.pozo;
    if (!g.pozos.has(clavePozo)) g.pozos.set(clavePozo, f.stock);
    g.precios.push(f.precio);
    g.vendidos = Math.max(g.vendidos, f.vendidos);
    if (f.parcial) g.parcial = true;
  }
  for (const g of porModelo.values()) {
    g.variantes = g.pozos.size;
    g.stock = [...g.pozos.values()].reduce((a, b) => a + b, 0);
  }

  const grupos = [...porModelo.values()].sort((a, b) => {
    if (a.marca !== b.marca) return a.marca.localeCompare(b.marca);
    return b.stock - a.stock;
  });

  const plata = (c: number) => '$' + Math.round(c).toLocaleString('es-AR');
  const nuevos = grupos.filter((g) => !enElSitio.has(clave(g.modelo)));
  const incompletos = grupos.filter((g) => enElSitio.has(clave(g.modelo)));

  const tabla = (titulo: string, lista: Grupo[]) => {
    if (lista.length === 0) return;
    console.log('\n' + '='.repeat(88));
    console.log(titulo);
    console.log('='.repeat(88));
    console.log('marca  modelo                     tipo      pubs colores stock  precio        vendidos');
    console.log('-'.repeat(88));
    for (const g of lista) {
      const min = Math.min(...g.precios), max = Math.max(...g.precios);
      const precio = min === max ? plata(min) : plata(min) + '-' + plata(max);
      console.log(
        g.marca.padEnd(6),
        g.modelo.slice(0, 26).padEnd(26),
        [...g.categorias].join('+').padEnd(9),
        String(g.items.size).padStart(4),
        String(g.variantes).padStart(4),
        String(g.stock).padStart(6),
        '  ' + precio.padEnd(13),
        String(g.vendidos).padStart(5),
      );
    }
    console.log(`  ${lista.length} modelos · ${lista.reduce((s, g) => s + g.stock, 0)} unidades en stock`);
  };

  // Priorizado: lo que más conviene cargar primero es lo que tiene stock parado
  // Y ya demostró que vende en ML. Un modelo con 100 unidades y 0 ventas es peor
  // candidato que uno con 30 y 60 ventas.
  const top = [...nuevos]
    .filter((g) => g.stock > 0)
    .sort((a, b) => b.stock * Math.log1p(b.vendidos) - a.stock * Math.log1p(a.vendidos))
    .slice(0, 15);
  tabla('▶ POR DÓNDE EMPEZAR — stock parado que además ya demostró que vende', top);

  tabla('TODOS LOS MODELOS QUE NO ESTÁN EN EL SITIO', nuevos);

  console.log('\n' + '='.repeat(88));
  console.log('MODELOS YA CARGADOS CON PUBLICACIONES SIN VINCULAR');
  console.log('='.repeat(88));
  console.log('⚠️  Acá NO faltan colores: son publicaciones DUPLICADAS del mismo anteojo, con otro');
  console.log('    título, que compiten entre sí en ML. Verificado sobre Beason, Terdey y The Sil:');
  console.log('    coinciden hasta en el número de stock con las que ya están vinculadas.');
  console.log('    Su stock NO se suma al inventario: es el mismo, contado dos veces.');
  console.log(`    ${incompletos.length} modelos afectados. Oportunidad de limpieza en ML, no de carga.`);

  console.log('\n' + '='.repeat(88));
  console.log(`${porItem.size} publicaciones con algo sin cargar · ${faltan.length} variantes`);
  const pozosUnicos = new Map<string, number>();
  for (const f of faltan) {
    const k = f.variacion ? `${f.pozo}::${f.variacion}` : f.pozo;
    if (!pozosUnicos.has(k)) pozosUnicos.set(k, f.stock);
  }
  const unidades = [...pozosUnicos.values()].reduce((a, b) => a + b, 0);
  console.log(`${pozosUnicos.size} colores distintos · ${unidades} unidades reales`);
  console.log('(deduplicado por user_product_id: dos publicaciones del mismo User Product');
  console.log(' comparten el pozo de stock, así que el inventario se cuenta una sola vez)');

  if (salidaJson) {
    fs.writeFileSync(salidaJson, JSON.stringify(faltan, null, 2));
    console.log(`\nDetalle en ${salidaJson}`);
  }
}

main().catch((error: unknown) => {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
