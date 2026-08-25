/**
 * Script: vulk-fotos
 *
 * Baja de vulkeyewear.com las fotos de producto de TODAS las variantes de un
 * modelo, listas para pasarle a `pnpm placas`.
 *
 * Cómo está hecho el sitio de Vulk (verificado 2026-08-24):
 * - La ficha de cada modelo vive en `/eyewear/sunglasses/<linea>/<modelo>/` y
 *   su selector de colores trae un `data-url` por variante. Ese es el índice.
 * - La línea NO es siempre la misma (`g-flex`, `grilamid`…) y el código de
 *   variante en la URL usa guion doble donde el código tiene barra:
 *   "SBLK/S10 POL" → `sblk--s10-pol`. Por eso conviene partir de la página
 *   madre en vez de adivinar URLs.
 * - Las fotos están en el HTML crudo, no hace falta ejecutar JavaScript.
 * - Cada ficha trae tres imágenes: frente, perfil y una foto del packaging
 *   (mucho más grande). La del frente es la del `<img>` cuyo `alt` es el
 *   código de la variante; el packaging se descarta por tamaño.
 *
 * Uso:
 *   pnpm vulk:fotos --url https://vulkeyewear.com/eyewear/sunglasses/g-flex/katleen/
 *   pnpm vulk:fotos --url <url de cualquier variante> --out ~/Desktop/katleen
 *
 * Flags:
 *   --url <url>   Página del modelo o de una de sus variantes.
 *   --out <dir>   Dónde dejar las fotos (default ~/Desktop/vulk/<modelo>).
 */

import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import sharp from 'sharp';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const BASE = 'https://vulkeyewear.com';

function flag(nombre: string): string | undefined {
  const i = process.argv.indexOf(`--${nombre}`);
  if (i === -1) return undefined;
  const valor = process.argv[i + 1];
  return valor && !valor.startsWith('--') ? valor : undefined;
}

function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function traer(url: string): Promise<string> {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`${url} → HTTP ${r.status}`);
  return r.text();
}

type Variante = {
  url: string;
  codigo: string;
  sku: string;
  frente?: string;
  perfil?: string;
};

/** Las variantes salen de los `data-url` del selector de colores. */
function descubrirVariantes(html: string): string[] {
  const urls = [...html.matchAll(/data-url=["']([^"']+)["']/g)].map((m) => m[1]!);
  return [...new Set(urls)].filter((u) => u.includes('/eyewear/'));
}

/**
 * De una ficha saca el código de variante, el SKU y sus dos fotos.
 *
 * El frente se identifica por el `alt` del preview; el perfil es la otra foto
 * de producto. La del packaging se cae sola: mide varios miles de píxeles.
 */
async function leerFicha(url: string): Promise<Variante> {
  const html = await traer(url);

  const codigo =
    html.match(/product-var[^>]*>\s*([^<]{2,40}?)\s*</)?.[1]?.trim() ??
    url.split('/').filter(Boolean).pop()!;
  const sku = html.match(/sku[^>]*>\s*([0-9]{5,8})\s*</)?.[1] ?? '';

  const preview = html.match(
    /<img[^>]+id=["']open-product-color-preview["'][^>]*>/i,
  )?.[0];
  const frenteDesdeAlt = preview?.match(/src=["']([^"']*\/img\/productos\/[^"']+)["']/)?.[1];

  const todas = [...new Set([...html.matchAll(/\/img\/productos\/([a-f0-9]{20,}\.(?:jpg|jpeg|png))/g)].map((m) => m[1]!))];

  const candidatas: Array<{ archivo: string; ancho: number }> = [];
  for (const archivo of todas) {
    try {
      const r = await fetch(`${BASE}/img/productos/${archivo}`, {
        headers: { 'User-Agent': UA, Referer: url },
      });
      if (!r.ok) continue;
      const buf = Buffer.from(await r.arrayBuffer());
      const meta = await sharp(buf).metadata();
      // El packaging es una foto enorme; las de producto rondan los 900 px.
      if ((meta.width ?? 0) <= 1400) candidatas.push({ archivo, ancho: meta.width ?? 0 });
    } catch {
      /* una imagen que no se puede leer no sirve de nada acá */
    }
  }

  const nombreFrente = frenteDesdeAlt?.split('/').pop();
  const frente = candidatas.find((c) => c.archivo === nombreFrente)?.archivo ?? candidatas[0]?.archivo;
  const perfil = candidatas.find((c) => c.archivo !== frente)?.archivo;

  return { url, codigo, sku, frente, perfil };
}

async function bajar(archivo: string, destino: string, referer: string): Promise<void> {
  const r = await fetch(`${BASE}/img/productos/${archivo}`, {
    headers: { 'User-Agent': UA, Referer: referer },
  });
  if (!r.ok) throw new Error(`no pude bajar ${archivo}: HTTP ${r.status}`);
  await fs.writeFile(destino, Buffer.from(await r.arrayBuffer()));
}

async function main(): Promise<void> {
  const url = flag('url');
  if (!url) {
    console.error('Falta --url <página del modelo o de una variante en vulkeyewear.com>');
    process.exit(1);
  }

  console.log(`Leyendo ${url}...`);
  const html = await traer(url);
  const variantes = descubrirVariantes(html);

  if (variantes.length === 0) {
    console.error('No encontré el selector de variantes en esa página. ¿Es una ficha de Vulk?');
    process.exit(1);
  }

  const modelo = slugify(
    html.match(/<h1[^>]*>\s*([^<]+?)\s*<\/h1>/i)?.[1] ?? url.split('/').filter(Boolean).slice(-1)[0]!,
  );
  const outDir = flag('out') || path.join(os.homedir(), 'Desktop/vulk', modelo);
  await fs.mkdir(outDir, { recursive: true });

  console.log(`Modelo: ${modelo} · ${variantes.length} variantes\n`);

  const resumen: Variante[] = [];
  for (const relativa of variantes) {
    const fichaUrl = relativa.startsWith('http') ? relativa : `${BASE}${relativa}`;
    try {
      const v = await leerFicha(fichaUrl);
      const nombre = slugify(v.codigo || relativa);

      if (v.frente) await bajar(v.frente, path.join(outDir, `${nombre}-frente.jpg`), fichaUrl);
      if (v.perfil) await bajar(v.perfil, path.join(outDir, `${nombre}-perfil.jpg`), fichaUrl);

      resumen.push(v);
      console.log(
        `  ✓ ${(v.codigo || nombre).padEnd(20)} SKU ${(v.sku || '?').padEnd(8)} ` +
          `${v.frente ? 'frente' : 'SIN FRENTE'} · ${v.perfil ? 'perfil' : 'SIN PERFIL'}`,
      );
    } catch (error) {
      console.warn(`  ✗ ${relativa}: ${error instanceof Error ? error.message : String(error)}`);
    }
    // El sitio es chico: no conviene martillarlo.
    await new Promise((r) => setTimeout(r, 600));
  }

  await fs.writeFile(path.join(outDir, 'variantes.json'), JSON.stringify(resumen, null, 2));
  console.log(`\n${resumen.length} variantes en ${outDir}`);
  console.log('Detalle en variantes.json (código, SKU y URL de ficha de cada una).');
}

main().catch((e) => {
  console.error(`\n✗ ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
});
