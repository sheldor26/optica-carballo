/**
 * Recorte de fondo con `rembg` (modelo birefnet-general).
 *
 * El recorte por luminancia que había antes dejaba bordes sucios: las fotos del
 * catálogo tienen sombra suave sobre el blanco, y un umbral no distingue sombra
 * de producto. `rembg` usa una red entrenada para segmentar objetos y devuelve
 * un alfa limpio, sin halo.
 *
 * No se instala nada nuevo en este proyecto: se reusa el venv que ya existe en
 * shotpilot, donde el founder lo había probado para otro producto. Si ese venv
 * no está, el llamador cae al recorte por luminancia — la placa sale igual, un
 * poco peor de bordes, y nada revienta.
 *
 * Es lento (~2-3 s por foto, ~15 s la primera vez que carga el modelo), así que
 * el resultado se cachea por hash del contenido. Con 8 diseños × 2 formatos la
 * misma foto se recorta UNA vez.
 */

import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * Corre el intérprete pasándole la imagen por stdin y devolviendo stdout.
 *
 * Va con `spawn` y no con `execFile`: la versión asíncrona de `execFile` NO
 * acepta la opción `input` (esa es de `execFileSync`), así que el proceso
 * quedaba esperando stdin para siempre y el script se colgaba sin decir nada.
 */
function correr(
  bin: string,
  args: string[],
  entrada: Buffer,
  timeoutMs: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const proc = spawn(bin, args);
    const salida: Buffer[] = [];
    const errores: Buffer[] = [];

    const reloj = setTimeout(() => {
      proc.kill('SIGKILL');
      reject(new Error(`rembg no terminó en ${timeoutMs / 1000}s`));
    }, timeoutMs);

    proc.stdout.on('data', (d: Buffer) => salida.push(d));
    proc.stderr.on('data', (d: Buffer) => errores.push(d));
    proc.on('error', (e) => {
      clearTimeout(reloj);
      reject(e);
    });
    proc.on('close', (code) => {
      clearTimeout(reloj);
      if (code !== 0) {
        const err = Buffer.concat(errores).toString().trim().split('\n').slice(-3).join(' ');
        reject(new Error(`rembg salió con código ${code}: ${err}`));
        return;
      }
      resolve(Buffer.concat(salida));
    });

    proc.stdin.on('error', () => {
      /* si el proceso muere antes de leer, lo maneja el 'close' */
    });
    proc.stdin.end(entrada);
  });
}

/** Venv de shotpilot. Se puede apuntar a otro con REMBG_PYTHON. */
const PYTHON_DEFAULT = '/Users/juan/Proyectos web/shotpilot/rembg-test/venv/bin/python';

/**
 * birefnet-general da los bordes más limpios sobre fotos de catálogo.
 *
 * Se lee en cada llamada y no al importar el módulo: si se resolviera en el
 * scope del módulo, un script que setea `REMBG_MODELO` dentro de su `main()`
 * no tendría efecto, porque los imports se evalúan antes. Pasó exactamente eso
 * al agregar el flag `--modelo` a `foto-limpia`.
 *
 * Cuándo cambiarlo: con fotos sacadas en el local sosteniendo una hoja de papel
 * detrás, birefnet toma la hoja y la mano como parte del objeto. `isnet-general-use`
 * segmenta sólo el anteojo.
 */
function modelo(): string {
  return process.env.REMBG_MODELO ?? 'birefnet-general';
}

const CACHE_DIR = 'marketing/.cache-recortes';

function pythonPath(): string {
  return process.env.REMBG_PYTHON ?? PYTHON_DEFAULT;
}

/** `true` si el venv con rembg está disponible en esta máquina. */
export async function rembgDisponible(): Promise<boolean> {
  try {
    await fs.access(pythonPath());
    return true;
  } catch {
    return false;
  }
}

const SCRIPT = `
import sys
from rembg import remove, new_session
session = new_session(sys.argv[1])
sys.stdout.buffer.write(
    remove(sys.stdin.buffer.read(), session=session, post_process_mask=True)
)
`;

/**
 * Devuelve el PNG con alfa del producto recortado, o `null` si rembg no está
 * disponible (para que el llamador use el método de respaldo).
 */
export async function recortarConRembg(
  foto: Buffer,
  opts: { onLog?: (msg: string) => void } = {},
): Promise<Buffer | null> {
  if (!(await rembgDisponible())) return null;

  const hash = crypto.createHash('sha256').update(foto).digest('hex').slice(0, 16);
  const cache = path.join(CACHE_DIR, `${modelo()}-${hash}.png`);

  try {
    return await fs.readFile(cache);
  } catch {
    // No estaba cacheado: se recorta.
  }

  opts.onLog?.(`Recortando el fondo con rembg (${modelo()})…`);
  try {
    const png = await correr(pythonPath(), ['-c', SCRIPT, modelo()], foto, 180_000);

    if (!png || png.length < 1000) {
      opts.onLog?.('rembg devolvió una imagen vacía; uso el recorte por luminancia.');
      return null;
    }

    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(cache, png);
    return png;
  } catch (err) {
    opts.onLog?.(
      `rembg falló (${err instanceof Error ? err.message.split('\n')[0] : String(err)}); ` +
        'uso el recorte por luminancia.',
    );
    return null;
  }
}
