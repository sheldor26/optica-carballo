/**
 * Script: auditar-encuadre
 *
 * Mide cuánto ocupa el anteojo en la card de las grillas de categoría, para
 * todas las fotos primarias del catálogo, y marca las que se salen del rango.
 *
 * Por qué hace falta: el tamaño con el que se ve un anteojo en el grid depende
 * de tres cosas, no de una. (1) Cuánto ocupa el producto dentro de su propio
 * JPG, que cambia foto por foto. (2) El aspecto de la foto contra el 3:2 de la
 * card: con `object-contain`, una foto más apaisada que 3:2 deja franjas arriba
 * y abajo y el producto se ve más chico. (3) El scale de
 * `lib/catalog/image-scale-overrides.ts`. Mirar sólo el scale no alcanza para
 * saber cómo se ve, y comparar a ojo 80 fotos no escala.
 *
 * El script calcula el ancho final del anteojo como fracción del ancho de la
 * card, que es lo que el ojo compara cuando ve la grilla.
 *
 * Uso:
 *   pnpm auditar:encuadre
 *   pnpm auditar:encuadre --target 0.86 --tolerancia 0.06
 *
 * Sólo lee: no modifica imágenes, ni la base, ni los overrides.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

import { IMAGE_SCALE_OVERRIDES } from '../lib/catalog/image-scale-overrides';

/** Las cards de categoría son 3:2. */
const CARD_RATIO = 1.5;

function flag(nombre: string): string | undefined {
  const i = process.argv.indexOf(`--${nombre}`);
  if (i === -1) return undefined;
  const v = process.argv[i + 1];
  return v && !v.startsWith('--') ? v : undefined;
}

type Fila = {
  slug: string;
  marca: string;
  storage_path: string;
  width: number | null;
  height: number | null;
  stock: number | null;
};

type Medicion = Fila & {
  scale: number;
  ocupacionEnFoto: number;
  ocupacionEnCard: number;
  ocupacionAltoEnCard: number;
  seCorta: boolean;
};

async function main(): Promise<void> {
  const target = Number(flag('target') ?? 0.86);
  const tolerancia = Number(flag('tolerancia') ?? 0.07);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Faltan env de Supabase. Corré con --env-file=.env.local');

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('product_images')
    .select('storage_path, width, height, products!inner(slug, brands!inner(name))')
    .eq('is_primary', true);

  if (error) throw new Error(`No pude leer product_images: ${error.message}`);

  const filas: Fila[] = (data ?? [])
    .map((r: any) => ({
      slug: r.products.slug,
      marca: r.products.brands.name,
      storage_path: r.storage_path,
      width: r.width,
      height: r.height,
      stock: null,
    }))
    .filter((f) => !/medidas/i.test(f.storage_path));

  console.log(`Midiendo ${filas.length} fotos primarias...\n`);

  const mediciones: Medicion[] = [];
  for (const fila of filas) {
    const publica = `${url}/storage/v1/object/public/products/${encodeURI(fila.storage_path)}`;
    try {
      const r = await fetch(publica);
      if (!r.ok) {
        console.warn(`  ⚠️ ${fila.storage_path} → HTTP ${r.status}`);
        continue;
      }
      const buf = Buffer.from(await r.arrayBuffer());
      const meta = await sharp(buf).metadata();
      const w = meta.width ?? fila.width ?? 0;
      const h = meta.height ?? fila.height ?? 0;
      if (!w || !h) continue;

      // Bbox del producto: `trim` recorta el fondo uniforme del perímetro.
      const { info } = await sharp(buf).trim({ threshold: 12 }).toBuffer({ resolveWithObject: true });
      const ocupacionEnFoto = info.width / w;

      const ratio = w / h;
      const scale = IMAGE_SCALE_OVERRIDES[fila.storage_path] ?? 1;
      // Con object-contain, una foto más apaisada que la card llena el ancho;
      // una menos apaisada llena el alto y deja aire a los costados.
      const factorContain = ratio >= CARD_RATIO ? 1 : ratio / CARD_RATIO;
      const ocupacionEnCard = ocupacionEnFoto * factorContain * scale;

      // El alto también importa: la card recorta lo que se pasa (overflow
      // oculto), así que un scale alto puede cortarle las patillas al producto.
      const ocupacionAltoEnFoto = info.height / h;
      const factorContainAlto = ratio >= CARD_RATIO ? CARD_RATIO / ratio : 1;
      const ocupacionAltoEnCard = ocupacionAltoEnFoto * factorContainAlto * scale;
      const seCorta = ocupacionEnCard > 1 || ocupacionAltoEnCard > 1;

      mediciones.push({ ...fila, scale, ocupacionEnFoto, ocupacionEnCard, ocupacionAltoEnCard, seCorta });
    } catch (e) {
      console.warn(`  ⚠️ ${fila.storage_path}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  mediciones.sort((a, b) => a.ocupacionEnCard - b.ocupacionEnCard);

  const fuera = mediciones.filter((m) => Math.abs(m.ocupacionEnCard - target) > tolerancia);
  const chicas = fuera.filter((m) => m.ocupacionEnCard < target);
  const grandes = fuera.filter((m) => m.ocupacionEnCard > target);

  const pct = (n: number) => `${(n * 100).toFixed(0)}%`;

  console.log(`Objetivo: el anteojo ocupa ${pct(target)} del ancho de la card (±${pct(tolerancia)})\n`);
  console.log('OCUPACIÓN  SCALE  MARCA   PRODUCTO');
  console.log('-'.repeat(78));
  for (const m of mediciones) {
    const marca = Math.abs(m.ocupacionEnCard - target) > tolerancia ? (m.ocupacionEnCard < target ? '▼' : '▲') : ' ';
    console.log(
      `${marca} ${pct(m.ocupacionEnCard).padStart(5)}   ${m.scale.toFixed(2)}  ${m.marca.padEnd(6)}  ${m.slug}`,
    );
  }

  const cortados = mediciones.filter((m) => m.seCorta);
  console.log('\n' + '='.repeat(78));
  if (cortados.length > 0) {
    console.log(`\n  ⚠️ ${cortados.length} se SALEN de la card (el borde les come parte del producto):`);
    for (const c of cortados) {
      console.log(`     ${c.slug} — ancho ${pct(c.ocupacionEnCard)}, alto ${pct(c.ocupacionAltoEnCard)} (scale ${c.scale})`);
    }
    console.log('');
  }
  console.log(`${mediciones.length - fuera.length}/${mediciones.length} dentro del rango.`);
  console.log(`${chicas.length} se ven CHICAS (▼), ${grandes.length} se ven GRANDES (▲).`);

  if (fuera.length > 0) {
    console.log('\nScale que las dejaría en el objetivo (sugerencia, NO aplicada):');
    for (const m of fuera) {
      const sugerido = (m.scale * target) / m.ocupacionEnCard;
      console.log(`  '${m.storage_path}': ${sugerido.toFixed(2)},   // hoy ${m.scale.toFixed(2)} → ocupa ${pct(m.ocupacionEnCard)}`);
    }
  }

  const salida = path.join(process.cwd(), 'marketing/auditorias/encuadre-grillas.json');
  await fs.mkdir(path.dirname(salida), { recursive: true });
  await fs.writeFile(salida, JSON.stringify({ target, tolerancia, mediciones }, null, 2));
  console.log(`\nDetalle completo: ${salida}`);
}

main().catch((e) => {
  console.error(`\n✗ ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
});
