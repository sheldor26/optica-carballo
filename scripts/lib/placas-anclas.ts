/**
 * Partes marcadas a mano y su traslado entre fotos del mismo armazón.
 *
 * Se marca UNA foto del modelo con `pnpm anclas`; las demás (otros colores) se
 * resuelven solas: se alinean contra la foto marcada comparando bordes y los
 * puntos se llevan por esa transformación.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

import { alinear, aplicar } from './placas-alinear';
import { recortarAnteojo } from './placas-frame';
import { pegarAlProducto, type NombreParte, type Partes } from './placas-partes';

export type ArchivoAnclas = {
  foto: string;
  recorte: { width: number; height: number };
  partes: Partes;
};

export type Traslado = {
  partes: Partes;
  escala: number;
  corrimientoX: number;
  corrimientoY: number;
  calce: number;
  dudoso: boolean;
};

/** Lleva las partes marcadas en `referencia` a la foto `destino`. */
export async function trasladarPartes(referencia: string, destino: string): Promise<Traslado> {
  const ref = await recortarAnteojo(referencia);
  const rec = await recortarAnteojo(destino);
  if (
    ref.izquierda === undefined || ref.arriba === undefined ||
    rec.izquierda === undefined || rec.arriba === undefined
  ) {
    throw new Error('Alguna de las fotos no se recortó con trim: no se pueden trasladar las marcas.');
  }
  const previo = JSON.parse(await fs.readFile(`${referencia}.anclas.json`, 'utf8')) as ArchivoAnclas;

  // Las fotos de otros colores pueden venir encuadradas distinto (otra escala,
  // corridas unos pixeles): se estima la diferencia con los bordes del armazón.
  const t = await alinear(referencia, destino);
  const partes: Partes = {};
  for (const [nombre, p] of Object.entries(previo.partes) as Array<[NombreParte, { fx: number; fy: number }]>) {
    const { x, y } = aplicar(t, ref.izquierda + p.fx * ref.width, ref.arriba + p.fy * ref.height);
    partes[nombre] = {
      fx: Math.min(1, Math.max(0, (x - rec.izquierda) / rec.width)),
      fy: Math.min(1, Math.max(0, (y - rec.arriba) / rec.height)),
    };
  }
  // Si la foto destino está cortada o el calce erró por unos pixeles, un punto
  // puede quedar sobre el fondo: se lo trae al armazón más cercano.
  const pegadas = await pegarAlProducto(partes, rec.buffer);
  return {
    partes: { ...partes, ...pegadas },
    escala: t.escala,
    corrimientoX: t.tx,
    corrimientoY: t.ty,
    calce: t.puntaje,
    dudoso: t.puntaje < 0.35,
  };
}

/** Otra foto de la misma carpeta que ya tenga marcas hechas a mano. */
export async function buscarReferencia(foto: string): Promise<string | undefined> {
  const carpeta = path.dirname(foto);
  const propia = path.basename(foto);
  let archivos: string[];
  try {
    archivos = await fs.readdir(carpeta);
  } catch {
    return undefined;
  }
  const candidatas = archivos
    .filter((a) => a.endsWith('.anclas.json') && a !== `${propia}.anclas.json`)
    .map((a) => path.join(carpeta, a.replace(/\.anclas\.json$/, '')));

  // La más recientemente marcada gana: es la que el founder acaba de tocar.
  const conFecha = await Promise.all(
    candidatas.map(async (c) => ({ c, t: (await fs.stat(`${c}.anclas.json`)).mtimeMs })),
  );
  conFecha.sort((a, b) => b.t - a.t);
  return conFecha[0]?.c;
}
