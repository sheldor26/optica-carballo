/**
 * Alineación entre dos fotos del mismo armazón (variantes de color).
 *
 * Las marcas de las partes se hacen sobre UNA foto y se llevan a las demás.
 * Copiarlas tal cual falla cuando la foto de otro color está encuadrada un
 * poco distinto (pasó con Reef 016: corrida y con otra escala). Acá se estima
 * esa diferencia comparando los BORDES de las dos fotos —el contorno del
 * armazón no cambia con el color del lente— y se busca la escala y el
 * desplazamiento que mejor los superponen.
 *
 * Es determinista, no usa modelos ni llamadas externas, y tarda ~1 s.
 */

import sharp from 'sharp';

export type Transformacion = {
  /** Escala de la foto destino respecto de la de referencia. */
  escala: number;
  /** Desplazamiento en pixeles de la foto ORIGINAL (destino = escala·ref + t). */
  tx: number;
  ty: number;
  /** Correlación de bordes, 0 a 1. Cerca de 1 = calzan; menos de ~0.3 = dudoso. */
  puntaje: number;
};

type Bordes = { data: Float32Array; w: number; h: number };

/** Mapa de bordes (magnitud del gradiente) de la foto a 1/`reduccion` de tamaño. */
async function bordesDe(ruta: string, reduccion: number): Promise<Bordes> {
  const meta = await sharp(ruta).rotate().metadata();
  const w = Math.round((meta.width ?? 0) / reduccion);
  const h = Math.round((meta.height ?? 0) / reduccion);
  const { data } = await sharp(ruta)
    .rotate()
    .flatten({ background: '#ffffff' })
    .resize(w, h, { fit: 'fill' })
    .greyscale()
    .blur(1)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const salida = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const gx = data[i + 1]! - data[i - 1]!;
      const gy = data[i + w]! - data[i - w]!;
      salida[i] = Math.hypot(gx, gy);
    }
  }
  return { data: salida, w, h };
}

/** Región de la referencia que realmente tiene armazón (donde hay bordes). */
function regionConBordes(b: Bordes): { x0: number; x1: number; y0: number; y1: number } {
  let x0 = b.w, x1 = 0, y0 = b.h, y1 = 0;
  const umbral = 12;
  for (let y = 0; y < b.h; y++) {
    for (let x = 0; x < b.w; x++) {
      if (b.data[y * b.w + x]! > umbral) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return { x0, x1, y0, y1 };
}

/** Correlación normalizada entre la referencia y el destino transformado. */
function correlacion(
  ref: Bordes,
  dst: Bordes,
  reg: { x0: number; x1: number; y0: number; y1: number },
  escala: number,
  tx: number,
  ty: number,
): number {
  let sr = 0, sd = 0, srr = 0, sdd = 0, srd = 0, n = 0;
  for (let y = reg.y0; y <= reg.y1; y += 1) {
    const yd = Math.round(escala * y + ty);
    if (yd < 0 || yd >= dst.h) continue;
    for (let x = reg.x0; x <= reg.x1; x += 1) {
      const xd = Math.round(escala * x + tx);
      if (xd < 0 || xd >= dst.w) continue;
      const a = ref.data[y * ref.w + x]!;
      const b = dst.data[yd * dst.w + xd]!;
      sr += a; sd += b; srr += a * a; sdd += b * b; srd += a * b; n++;
    }
  }
  if (n < 50) return 0;
  const cov = srd - (sr * sd) / n;
  const vr = srr - (sr * sr) / n;
  const vd = sdd - (sd * sd) / n;
  return vr > 0 && vd > 0 ? cov / Math.sqrt(vr * vd) : 0;
}

/**
 * Estima cómo pasar de la foto `referencia` a la foto `destino`.
 * Busca en dos pasadas: gruesa (1/4 de tamaño) y fina (1/2) alrededor de lo
 * encontrado.
 */
export async function alinear(referencia: string, destino: string): Promise<Transformacion> {
  // Pasada gruesa.
  const R = 4;
  const refG = await bordesDe(referencia, R);
  const dstG = await bordesDe(destino, R);
  const regG = regionConBordes(refG);

  let mejor = { s: 1, tx: 0, ty: 0, p: -1 };
  for (let s = 0.9; s <= 1.101; s += 0.01) {
    for (let tx = -24; tx <= 24; tx++) {
      for (let ty = -24; ty <= 24; ty++) {
        const p = correlacion(refG, dstG, regG, s, tx, ty);
        if (p > mejor.p) mejor = { s, tx, ty, p };
      }
    }
  }

  // Pasada fina: el doble de resolución, buscando alrededor del resultado.
  const F = 2;
  const refF = await bordesDe(referencia, F);
  const dstF = await bordesDe(destino, F);
  const regF = regionConBordes(refF);
  const k = R / F;
  const base = { s: mejor.s, tx: mejor.tx * k, ty: mejor.ty * k };

  let fino = { s: base.s, tx: base.tx, ty: base.ty, p: -1 };
  for (let ds = -0.012; ds <= 0.0121; ds += 0.004) {
    for (let dx = -4; dx <= 4; dx++) {
      for (let dy = -4; dy <= 4; dy++) {
        const s = base.s + ds;
        const p = correlacion(refF, dstF, regF, s, base.tx + dx, base.ty + dy);
        if (p > fino.p) fino = { s, tx: base.tx + dx, ty: base.ty + dy, p };
      }
    }
  }

  // Se devuelve en pixeles de la foto original (la pasada fina era 1/2).
  return { escala: fino.s, tx: fino.tx * F, ty: fino.ty * F, puntaje: fino.p };
}

/** Lleva un punto (en pixeles de la foto original de referencia) a la foto destino. */
export function aplicar(t: Transformacion, x: number, y: number): { x: number; y: number } {
  return { x: t.escala * x + t.tx, y: t.escala * y + t.ty };
}
