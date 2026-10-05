/**
 * Registro de las fuentes que usan las placas.
 *
 * `sharp` rasteriza el SVG con librsvg, que en macOS resuelve las familias por
 * CoreText: no alcanza con tener el .ttf en el repo, tiene que estar instalado
 * en el sistema. Por eso las copiamos a `~/Library/Fonts` la primera vez.
 *
 * Estaba adentro de `ml-placas.ts`. Se sacó acá cuando la segunda familia de
 * placas (las de producto para Instagram) necesitó exactamente lo mismo: es el
 * tipo de función que si se copia, un día una placa sale con la tipografía de
 * fallback y nadie entiende por qué.
 */

import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const FUENTES_DIR = path.join(process.cwd(), 'assets/placas/fonts');

const FAMILIAS: Array<[archivo: string, familia: string]> = [
  ['Anton-Regular.ttf', 'Anton'],
  ['ArchivoBlack-Regular.ttf', 'Archivo Black'],
  ['DMSans-Variable.ttf', 'DM Sans'],
];

export function asegurarFuentes(): void {
  let instaladas = '';
  try {
    instaladas = execFileSync('fc-list', { encoding: 'utf8' });
  } catch {
    console.warn('⚠️ No encontré `fc-list`; asumo que las fuentes ya están instaladas.');
    return;
  }

  const faltan = FAMILIAS.filter(([, familia]) => !instaladas.includes(familia)).map(([f]) => f);
  if (faltan.length === 0) return;

  const destino = path.join(os.homedir(), 'Library/Fonts');
  for (const f of faltan) {
    try {
      execFileSync('cp', [path.join(FUENTES_DIR, f), destino]);
      console.log(`  ✓ instalé ${f} en ~/Library/Fonts`);
    } catch (err) {
      console.warn(`  ⚠️ no pude instalar ${f}: ${err instanceof Error ? err.message : err}`);
    }
  }
  try {
    execFileSync('fc-cache', ['-f']);
  } catch {
    /* el cache se regenera solo en el próximo arranque */
  }
}
