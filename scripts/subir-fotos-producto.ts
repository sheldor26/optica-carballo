/**
 * Sube al bucket las fotos que dejó `pnpm placas` y verifica que queden servibles.
 *
 * Es el puente entre el generador de placas y el seed. Existe porque el paso
 * manual se equivocaba siempre en lo mismo: el `storage_path` del seed es texto
 * libre, la base no valida que el archivo exista, y un nombre que no coincide al
 * caracter deja la ficha con las fotos rotas sin que nada falle. Acá los nombres
 * los escribe el script, no la mano, y cada URL se prueba con un HEAD antes de
 * declarar nada.
 *
 * Uso:
 *   pnpm fotos:subir --slug rusty-bruice --dir <carpeta web/ de pnpm placas>
 *
 * Opcional:
 *   --sufijo <txt>   Se agrega al nombre del archivo. Para reemplazar una foto
 *                    ya publicada hay que cambiarle el nombre sí o sí: la imagen
 *                    optimizada de Next se cachea 31 días por path.
 *   --solo <a,b>     Sube sólo los archivos que empiezan con esos nombres.
 *                    Sirve para rehacer una sola placa sin tocar las otras.
 *   --dry            Muestra qué subiría, sin tocar el bucket.
 */

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { crearClienteAdmin } from './lib/supabase-script';

const BUCKET = 'products';
/** El orden es el de la galería: perfil primero, medidas siempre al final. */
const ESPERADOS = ['perfil', 'frente', 'medidas'];

function flag(nombre: string): string | undefined {
  const i = process.argv.indexOf(`--${nombre}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

async function main(): Promise<void> {
  const slug = flag('slug');
  const dir = flag('dir');
  const sufijo = flag('sufijo') ?? '';
  const dry = process.argv.includes('--dry');

  if (!slug || !dir) {
    console.error(
      'Faltan datos. Uso:\n  pnpm fotos:subir --slug rusty-bruice --dir <carpeta web/ de pnpm placas>',
    );
    process.exit(1);
  }

  const solo = flag('solo')
    ?.split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const archivos = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .filter((f) => !solo || solo.some((s) => f.startsWith(s)))
    .sort((a, b) => {
      const orden = (f: string) => {
        const i = ESPERADOS.findIndex((e) => f.startsWith(e));
        return i === -1 ? ESPERADOS.length : i;
      };
      return orden(a) - orden(b);
    });

  if (archivos.length === 0) {
    console.error(`No hay imágenes en ${dir}.`);
    process.exit(1);
  }

  const faltan = solo ? [] : ESPERADOS.filter((e) => !archivos.some((f) => f.startsWith(e)));
  if (faltan.length > 0) {
    console.warn(`⚠️ No están las placas de: ${faltan.join(', ')}. Sigo igual con lo que hay.\n`);
  }

  const supabase = crearClienteAdmin();
  const filas: string[] = [];

  for (const archivo of archivos) {
    const buffer = fs.readFileSync(path.join(dir, archivo));
    const meta = await sharp(buffer).metadata();
    const ext = path.extname(archivo);
    const base = path.basename(archivo, ext);
    const destino = `${slug}/${base}${sufijo}${ext}`;

    if (dry) {
      console.log(`· subiría ${destino} — ${meta.width}×${meta.height}`);
      continue;
    }

    const { error } = await supabase.storage.from(BUCKET).upload(destino, buffer, {
      contentType: `image/${ext === '.jpg' ? 'jpeg' : ext.slice(1)}`,
      upsert: false,
    });

    if (error) {
      // Pisar un path existente es justo lo que no queremos: la imagen vieja
      // sigue cacheada 31 días y la ficha muestra la anterior.
      console.error(`✗ ${destino}: ${error.message}`);
      if (/exists/i.test(error.message)) {
        console.error('   Ya hay un archivo con ese nombre. Usá --sufijo para subir uno nuevo.');
      }
      continue;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(destino);
    const res = await fetch(data.publicUrl, { method: 'HEAD' });
    console.log(`${res.ok ? '✓' : '✗'} ${destino} — ${meta.width}×${meta.height} — HTTP ${res.status}`);
    filas.push(`  '${destino}', ${meta.width}, ${meta.height}`);
  }

  if (filas.length > 0) {
    console.log('\nPara el seed (path, width, height):');
    for (const fila of filas) console.log(fila);
  }
}

main().catch((error: unknown) => {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
