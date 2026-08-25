/**
 * Script: reemplazar-foto-producto
 *
 * Cambia la foto de un producto: sube la imagen nueva con un nombre NUEVO y
 * apunta la fila de `product_images` a ese archivo.
 *
 * Por qué con otro nombre y no pisando el archivo: `next.config.ts` tiene
 * `minimumCacheTTL` en 31 días y **el path es la cache key** de las imágenes
 * optimizadas. Si se pisa el archivo dejando el mismo path, Supabase Storage
 * queda con la foto nueva pero el sitio sigue sirviendo la vieja durante un
 * mes. Pasó de verdad el 2026-08-24 con el Vulk Katleen: el archivo estaba
 * bien y la ficha seguía mostrando la anterior.
 *
 * El archivo viejo NO se borra: queda en Storage por si hay que volver atrás,
 * y además se guarda una copia local en `marketing/backup-imagenes/`.
 *
 * Uso:
 *   pnpm foto:reemplazar --path "vulk-katleen/KATLEEN ... -Perfil.jpg" --archivo ~/nueva.jpg
 *   pnpm foto:reemplazar --path "..." --archivo ... --dry-run
 *
 * Flags:
 *   --path <storage_path>   Ruta actual dentro del bucket (la que tiene la DB).
 *   --archivo <file>        Imagen nueva, ya procesada al formato final.
 *   --bucket <nombre>       Bucket (default `products`).
 *   --sufijo <texto>        Sufijo del nombre nuevo (default: la fecha, -AAAAMMDD).
 *   --pisar                 Sube con el MISMO path. Sólo si la foto todavía no
 *                           se publicó nunca: si no, el sitio no la va a mostrar.
 *   --dry-run               Muestra qué haría, sin tocar nada.
 *
 * Requisitos env:
 *   NEXT_PUBLIC_SUPABASE_URL · SUPABASE_SERVICE_ROLE_KEY
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

import { IMAGE_SCALE_OVERRIDES } from '../lib/catalog/image-scale-overrides';

const BACKUP_DIR = path.join(process.cwd(), 'marketing/backup-imagenes');

function flag(nombre: string): string | undefined {
  const i = process.argv.indexOf(`--${nombre}`);
  if (i === -1) return undefined;
  const valor = process.argv[i + 1];
  return valor && !valor.startsWith('--') ? valor : undefined;
}

async function main(): Promise<void> {
  const storagePath = flag('path');
  const archivo = flag('archivo');
  const bucket = flag('bucket') || 'products';
  const dryRun = process.argv.includes('--dry-run');
  const pisar = process.argv.includes('--pisar');

  if (!storagePath || !archivo) {
    console.error('Uso: pnpm foto:reemplazar --path "<storage_path>" --archivo <file> [--dry-run]');
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error('Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Corré con --env-file=.env.local');
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey);

  // --- La fila tiene que existir: si no, el archivo quedaría huérfano ------
  const { data: filas, error: errorFila } = await supabase
    .from('product_images')
    .select('id, storage_path, width, height, sort_order, is_primary, alt_text')
    .eq('storage_path', storagePath);

  if (errorFila) throw new Error(`No pude leer product_images: ${errorFila.message}`);
  if (!filas || filas.length === 0) {
    throw new Error(
      `No hay ninguna fila en product_images con storage_path="${storagePath}". ` +
        'Revisá la ruta: subir un archivo que nadie referencia no cambia nada en el sitio.',
    );
  }

  const fila = filas[0] as {
    id: string;
    width: number | null;
    height: number | null;
    sort_order: number;
    is_primary: boolean;
    alt_text: string | null;
  };

  // --- La imagen nueva tiene que coincidir con lo que declara la fila ------
  const buffer = await fs.readFile(archivo);
  const meta = await sharp(buffer).metadata();
  console.log(`Imagen nueva: ${meta.width}×${meta.height} ${meta.format}, ${(buffer.length / 1024).toFixed(0)} KB`);
  console.log(`Fila en DB:   ${fila.width}×${fila.height} · sort_order ${fila.sort_order} · primaria: ${fila.is_primary}`);

  // --- Path nuevo: la cache key del sitio ---------------------------------
  const hoy = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const sufijo = flag('sufijo') || `-${hoy}`;
  const dir = path.dirname(storagePath);
  const ext = path.extname(storagePath);
  const base = path.basename(storagePath, ext);
  // Si el nombre ya trae un sufijo de fecha de un reemplazo anterior, se pisa
  // ese en vez de encadenar sufijos.
  // Se limpia también un guion final del nombre original, para no terminar
  // con "...-POL--20260825.jpg".
  const baseLimpia = base.replace(/-\d{8}$/, '').replace(/-+$/, '');
  const pathNuevo = pisar ? storagePath : `${dir}/${baseLimpia}${sufijo}${ext}`;

  // El scale del grid está indexado por path: al renombrar, el override del
  // path viejo deja de aplicar y la foto pasa a 1.0 sin ningún error visible.
  // Si la imagen nueva viene del pipeline ya está normalizada y 1.0 es lo
  // correcto; si no, hay que decidir qué scale lleva.
  const overrideViejo = IMAGE_SCALE_OVERRIDES[storagePath];
  if (overrideViejo !== undefined && overrideViejo !== 1 && !pisar) {
    console.warn(
      `\n  ⚠️ "${path.basename(storagePath)}" tenía scale ${overrideViejo} en image-scale-overrides.ts.\n` +
        '     Con el nombre nuevo ese override deja de aplicar y la foto pasa a 1.0.\n' +
        '     Si la imagen nueva sale de `pnpm placas` ya viene normalizada y 1.0 es correcto.\n' +
        '     Si no, agregá el override para el path nuevo o corré después `pnpm auditar:encuadre`.\n',
    );
  }

  if (pisar) {
    console.warn(
      '\n  ⚠️ --pisar: mismo path. El sitio va a seguir mostrando la imagen anterior hasta 31 días\n' +
        '     (minimumCacheTTL en next.config.ts, con el path como cache key). Usalo sólo si esta\n' +
        '     foto nunca se publicó.\n',
    );
  } else {
    console.log(`Path nuevo:   ${pathNuevo}`);
  }

  // --- Backup del archivo actual antes de pisarlo -------------------------
  const { data: actual, error: errorBajada } = await supabase.storage.from(bucket).download(storagePath);
  if (errorBajada) {
    console.warn(`  ⚠️ no pude bajar el archivo actual para backup: ${errorBajada.message}`);
  } else {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    const destino = path.join(BACKUP_DIR, `${path.basename(storagePath)}.anterior`);
    await fs.writeFile(destino, Buffer.from(await actual.arrayBuffer()));
    console.log(`Backup del archivo anterior: ${destino}`);
  }

  if (dryRun) {
    console.log('\n--dry-run: no toqué nada.');
    return;
  }

  // --- Subida ------------------------------------------------------------
  const contentType = meta.format === 'png' ? 'image/png' : meta.format === 'webp' ? 'image/webp' : 'image/jpeg';
  const { error: errorSubida } = await supabase.storage.from(bucket).upload(pathNuevo, buffer, {
    upsert: true,
    contentType,
    cacheControl: '31536000',
  });
  if (errorSubida) throw new Error(`Falló la subida: ${errorSubida.message}`);

  // --- Apuntar la fila al archivo nuevo -----------------------------------
  if (pathNuevo !== storagePath || fila.width !== meta.width || fila.height !== meta.height) {
    const { error: errorUpdate } = await supabase
      .from('product_images')
      .update({ storage_path: pathNuevo, width: meta.width, height: meta.height })
      .eq('id', fila.id);
    if (errorUpdate) {
      throw new Error(
        `Subí el archivo pero no pude actualizar product_images: ${errorUpdate.message}. ` +
          `La fila sigue apuntando a "${storagePath}".`,
      );
    }
  }

  // --- Verificación: la fila apunta a lo que subimos ----------------------
  const { data: filaFinal } = await supabase
    .from('product_images')
    .select('storage_path, width, height')
    .eq('id', fila.id)
    .single();

  const { data: verificar, error: errorVerificar } = await supabase.storage.from(bucket).download(pathNuevo);
  if (errorVerificar) throw new Error(`Subió pero no pude verificar: ${errorVerificar.message}`);

  const arriba = Buffer.from(await verificar.arrayBuffer());
  const metaArriba = await sharp(arriba).metadata();

  console.log(`\n✓ Foto actualizada — ${metaArriba.width}×${metaArriba.height}, ${(arriba.length / 1024).toFixed(0)} KB`);
  console.log(`  product_images ahora apunta a: ${filaFinal?.storage_path} (${filaFinal?.width}×${filaFinal?.height})`);
  console.log(`  URL: ${url}/storage/v1/object/public/${bucket}/${encodeURI(pathNuevo)}`);
  if (pathNuevo !== storagePath) {
    console.log(`  El archivo anterior quedó en Storage: ${storagePath}`);
  }
}

main().catch((e) => {
  console.error(`\n✗ ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
});
