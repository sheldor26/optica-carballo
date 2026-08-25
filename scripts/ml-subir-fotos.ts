/**
 * Reemplaza la galería de fotos de una publicación de Mercado Libre.
 *
 * El PUT de `pictures` **reemplaza el array completo**: lo que no se remanda,
 * se pierde. Por eso el script guarda antes un snapshot de la galería actual y
 * puede restaurarla con `--restaurar`. Una publicación con ventas no es lugar
 * para probar.
 *
 * Uso:
 *   pnpm ml:fotos --item MLA1904009956 --dir <carpeta con 01..06> --dry
 *   pnpm ml:fotos --item MLA1904009956 --dir <carpeta con 01..06>
 *   pnpm ml:fotos --item MLA1904009956 --restaurar <snapshot.json>
 *
 * El orden de la galería es el orden alfabético de los archivos, y el primero
 * queda de portada. Por eso las placas se llaman 01-perfil, 02-frente, etc.
 *
 * Antes de correr esto, validar las imágenes con `pnpm ml:diag`: la portada se
 * modera más estricto que las secundarias (ver ml-diagnostico-imagenes.ts).
 */

import fs from 'node:fs';
import path from 'node:path';
import { obtenerIntegracionML } from './lib/ml-auth';

const API = 'https://api.mercadolibre.com';

function flag(nombre: string): string | undefined {
  const i = process.argv.indexOf(`--${nombre}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

type Item = {
  id: string;
  status: string;
  sold_quantity: number;
  thumbnail_id: string;
  pictures: Array<{ id: string; size: string; max_size: string; secure_url: string }>;
};

async function traerItem(id: string, token: string): Promise<Item> {
  const res = await fetch(`${API}/items/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`GET /items/${id} → HTTP ${res.status}. ${await res.text()}`);
  return (await res.json()) as Item;
}

/** Manda el array de ids tal cual: el orden es el de la galería y [0] es la portada. */
async function asociar(id: string, ids: string[], token: string): Promise<void> {
  const res = await fetch(`${API}/items/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    // Nunca `{source: url}`: en MLA la carga por URL deja el item en
    // `picture_download_pending` y al terminar lo pasa a `active` solo — un
    // item pausado a propósito puede quedar publicado sin que nadie lo pida.
    body: JSON.stringify({ pictures: ids.map((pid) => ({ id: pid })) }),
  });
  if (!res.ok) throw new Error(`PUT /items/${id} → HTTP ${res.status}. ${await res.text()}`);
}

async function subir(archivo: string, token: string): Promise<string> {
  // Sólo multipart: este endpoint no acepta la imagen por URL ni en base64.
  const form = new FormData();
  form.append('file', new Blob([fs.readFileSync(archivo)]), path.basename(archivo));

  const res = await fetch(`${API}/pictures/items/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) throw new Error(`upload ${path.basename(archivo)} → HTTP ${res.status}. ${await res.text()}`);

  const json = (await res.json()) as { id: string };
  return json.id;
}

async function main(): Promise<void> {
  const item = flag('item');
  const dir = flag('dir');
  const restaurar = flag('restaurar');
  const dry = process.argv.includes('--dry');

  if (!item || (!dir && !restaurar)) {
    console.error(
      'Faltan datos. Uso:\n' +
        '  pnpm ml:fotos --item MLA... --dir <carpeta> [--dry]\n' +
        '  pnpm ml:fotos --item MLA... --restaurar <snapshot.json>',
    );
    process.exit(1);
  }

  const { token } = await obtenerIntegracionML();
  const antes = await traerItem(item, token);

  console.log(`\n${antes.id} · ${antes.status} · ${antes.sold_quantity} vendidos · ${antes.pictures.length} fotos`);
  if (antes.status === 'active' && antes.sold_quantity > 0) {
    console.log(`⚠️ Publicación ACTIVA con ventas. El snapshot permite volver atrás.`);
  }

  if (restaurar) {
    const snap = JSON.parse(fs.readFileSync(restaurar, 'utf8')) as { pictures: Array<{ id: string }> };
    const ids = snap.pictures.map((p) => p.id);
    console.log(`\nRestaurando ${ids.length} fotos del snapshot...`);
    if (dry) {
      ids.forEach((id, i) => console.log(`  ${i + 1}. ${id}`));
      return;
    }
    await asociar(item, ids, token);
    const despues = await traerItem(item, token);
    console.log(`✓ quedaron ${despues.pictures.length} fotos · status ${despues.status}`);
    return;
  }

  const archivos = fs
    .readdirSync(dir!)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort();

  if (archivos.length === 0) throw new Error(`No hay imágenes en ${dir}.`);

  console.log(`\nGalería nueva (${archivos.length}), en este orden:`);
  archivos.forEach((f, i) => console.log(`  ${i + 1}. ${f}${i === 0 ? '   ← portada' : ''}`));

  if (dry) {
    console.log('\n--dry: no se subió ni se cambió nada.');
    return;
  }

  // El snapshot se escribe ANTES de tocar nada, al lado de las imágenes.
  const snapshot = path.join(dir!, `ml-snapshot-${item}.json`);
  fs.writeFileSync(
    snapshot,
    JSON.stringify(
      { item: antes.id, status: antes.status, thumbnail_id: antes.thumbnail_id, pictures: antes.pictures },
      null,
      2,
    ),
  );
  console.log(`\nSnapshot de la galería vieja: ${snapshot}`);

  const ids: string[] = [];
  for (const archivo of archivos) {
    const id = await subir(path.join(dir!, archivo), token);
    ids.push(id);
    console.log(`  ↑ ${archivo} → ${id}`);
  }

  await asociar(item, ids, token);

  const despues = await traerItem(item, token);
  const portadaOk = despues.thumbnail_id === ids[0] || despues.pictures[0]?.id === ids[0];

  console.log(`\n✓ ${despues.pictures.length} fotos · status ${despues.status}`);
  console.log(`  portada: ${despues.thumbnail_id} ${portadaOk ? '✓ es la nueva' : '⚠️ NO coincide con la primera que subí'}`);
  if (despues.status !== antes.status) {
    console.log(`  ⚠️ el status cambió de "${antes.status}" a "${despues.status}"`);
    console.log(`  Para volver atrás: pnpm ml:fotos --item ${item} --restaurar ${snapshot}`);
  }
}

main().catch((error: unknown) => {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
