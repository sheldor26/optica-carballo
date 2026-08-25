/**
 * Relleno de la plantilla de medidas del founder (`marketing/medidas.png`).
 *
 * La plantilla es el dibujo terminado del armazón y la patilla con las
 * flechas de cota ya trazadas y la palabra "mm" en su lugar, pero SIN los
 * números. Este módulo detecta dónde va cada número y lo escribe.
 *
 * Las posiciones NO están hardcodeadas: se detectan buscando los cinco
 * "mm" de la plantilla por análisis de componentes conectadas. Así, si el
 * founder mueve un texto o cambia el tamaño en Canva, el relleno sigue
 * cayendo en el lugar correcto sin tocar código.
 */

import sharp from 'sharp';

import type { Medidas } from './placas-medidas';

/** Tipografía con la que se escriben los números. Ver README de assets. */
const FUENTE = 'DM Sans';
const PESO = 400;
/** x-height / font-size de DM Sans, medido sobre el render real. */
const X_HEIGHT_RATIO = 0.515;
/** Separación entre el número y la "mm" de la plantilla, en ems. */
const GAP_EM = 0.06;

type Cota = {
  /** Borde izquierdo de la "mm": el número termina acá. */
  x: number;
  /** Línea de base del texto. */
  baseline: number;
  /** Altura de la x en px, de la que se deriva el cuerpo tipográfico. */
  xHeight: number;
};

export type Cotas = {
  anchoTotal: Cota;
  calibre: Cota;
  puente: Cota;
  alto: Cota;
  patilla: Cota;
};

type Caja = { x0: number; y0: number; x1: number; y1: number };

/**
 * Encuentra los cinco "mm" de la plantilla.
 *
 * Cada "m" es una componente conectada de tinta; las dos "m" de un "mm" se
 * agrupan por cercanía horizontal y línea de base compartida. Todo lo demás
 * (la silueta del armazón, la patilla, las líneas de cota) queda descartado
 * por tamaño o proporción.
 */
export async function detectarCotas(rutaPlantilla: string): Promise<Cotas> {
  const { data, info } = await sharp(rutaPlantilla)
    .flatten({ background: '#ffffff' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: W, height: H } = info;
  const esTinta = (i: number) => data[i]! < 128;
  const visto = new Uint8Array(W * H);
  const cajas: Caja[] = [];

  // Flood fill iterativo (4-vecinos) para no reventar el stack.
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const inicio = y * W + x;
      if (visto[inicio] || !esTinta(inicio)) continue;

      const pila = [inicio];
      visto[inicio] = 1;
      const caja: Caja = { x0: x, y0: y, x1: x, y1: y };

      while (pila.length > 0) {
        const p = pila.pop()!;
        const px = p % W;
        const py = (p - px) / W;
        if (px < caja.x0) caja.x0 = px;
        if (px > caja.x1) caja.x1 = px;
        if (py < caja.y0) caja.y0 = py;
        if (py > caja.y1) caja.y1 = py;

        if (px > 0 && !visto[p - 1] && esTinta(p - 1)) { visto[p - 1] = 1; pila.push(p - 1); }
        if (px < W - 1 && !visto[p + 1] && esTinta(p + 1)) { visto[p + 1] = 1; pila.push(p + 1); }
        if (py > 0 && !visto[p - W] && esTinta(p - W)) { visto[p - W] = 1; pila.push(p - W); }
        if (py < H - 1 && !visto[p + W] && esTinta(p + W)) { visto[p + W] = 1; pila.push(p + W); }
      }
      cajas.push(caja);
    }
  }

  // Una "m" suelta: alto de x-height razonable y algo más ancha que alta.
  const emes = cajas.filter((c) => {
    const w = c.x1 - c.x0 + 1;
    const h = c.y1 - c.y0 + 1;
    const ratio = w / h;
    return h >= 14 && h <= 80 && w >= 18 && w <= 110 && ratio >= 1.1 && ratio <= 2.2;
  });

  // Agrupar las "m" contiguas que comparten línea de base.
  emes.sort((a, b) => a.y1 - b.y1 || a.x0 - b.x0);
  const grupos: Caja[] = [];
  for (const m of emes) {
    const alturaM = m.y1 - m.y0 + 1;
    const previo = grupos.find(
      (g) =>
        Math.abs(g.y1 - m.y1) <= Math.max(3, alturaM * 0.12) &&
        m.x0 - g.x1 > -2 &&
        m.x0 - g.x1 < alturaM * 0.9,
    );
    if (previo) {
      previo.x1 = Math.max(previo.x1, m.x1);
      previo.y0 = Math.min(previo.y0, m.y0);
      previo.y1 = Math.max(previo.y1, m.y1);
    } else {
      grupos.push({ ...m });
    }
  }

  // Un "mm" completo es claramente más ancho que alto.
  const mms = grupos.filter((g) => {
    const w = g.x1 - g.x0 + 1;
    const h = g.y1 - g.y0 + 1;
    return w / h >= 2.4 && w / h <= 4.2;
  });

  if (mms.length !== 5) {
    throw new Error(
      `Esperaba 5 textos "mm" en ${rutaPlantilla} y encontré ${mms.length}. ` +
        `Si cambiaste la plantilla, revisá que las cinco cotas sigan diciendo "mm".`,
    );
  }

  const aCota = (c: Caja): Cota => ({ x: c.x0, baseline: c.y1, xHeight: c.y1 - c.y0 + 1 });

  // Identificación por posición: la más baja es la patilla, la más a la
  // derecha es el alto, y de las tres restantes ordenadas de arriba abajo
  // salen ancho total, calibre y puente.
  const restantes = [...mms];
  const patilla = restantes.splice(
    restantes.indexOf(restantes.reduce((a, b) => (a.y1 > b.y1 ? a : b))),
    1,
  )[0]!;
  const alto = restantes.splice(
    restantes.indexOf(restantes.reduce((a, b) => (a.x0 > b.x0 ? a : b))),
    1,
  )[0]!;
  restantes.sort((a, b) => a.y1 - b.y1);
  const [anchoTotal, calibre, puente] = restantes;

  if (!anchoTotal || !calibre || !puente) {
    throw new Error(`No pude identificar las cotas de ${rutaPlantilla}.`);
  }

  return {
    anchoTotal: aCota(anchoTotal),
    calibre: aCota(calibre),
    puente: aCota(puente),
    alto: aCota(alto),
    patilla: aCota(patilla),
  };
}

/** Escribe los cinco números sobre la plantilla. Devuelve PNG sobre blanco. */
export async function rellenarPlantilla(
  rutaPlantilla: string,
  medidas: Medidas,
  cotas: Cotas,
): Promise<Buffer> {
  const meta = await sharp(rutaPlantilla).metadata();
  const width = meta.width;
  const height = meta.height;
  if (!width || !height) throw new Error(`No pude leer ${rutaPlantilla}`);

  const valores: Array<[Cota, number]> = [
    [cotas.anchoTotal, medidas.anchoTotal],
    [cotas.calibre, medidas.calibre],
    [cotas.puente, medidas.puente],
    [cotas.alto, medidas.alto],
    [cotas.patilla, medidas.patilla],
  ];

  const textos = valores
    .map(([cota, valor]) => {
      const fontSize = +(cota.xHeight / X_HEIGHT_RATIO).toFixed(1);
      const x = +(cota.x - fontSize * GAP_EM).toFixed(1);
      return `<text x="${x}" y="${cota.baseline}" font-family="${FUENTE}" font-weight="${PESO}"
        font-size="${fontSize}" fill="#000000" text-anchor="end">${valor}</text>`;
    })
    .join('');

  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${textos}</svg>`,
  );

  return sharp({
    create: { width, height, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .composite([
      { input: await sharp(rutaPlantilla).png().toBuffer(), left: 0, top: 0 },
      { input: svg, left: 0, top: 0 },
    ])
    .png()
    .toBuffer();
}

/**
 * Reencuadra la plantilla cuadrada en el 3:2 del catálogo del sitio.
 *
 * En vez de escalar el cuadrado entero (que dejaría el dibujo chico y con
 * mucho aire a los costados), recorta los dos bloques —frente y patilla—,
 * los agranda y los reapila con un aire uniforme.
 */
export async function plantillaA32(
  plantillaRellena: Buffer,
  width: number,
  height: number,
): Promise<Buffer> {
  const { data, info } = await sharp(plantillaRellena)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;

  // Filas con tinta → separar los dos bloques por el corte en blanco.
  const filaConTinta: boolean[] = [];
  for (let y = 0; y < H; y++) {
    let hay = false;
    for (let x = 0; x < W && !hay; x++) if (data[y * W + x]! < 128) hay = true;
    filaConTinta.push(hay);
  }

  const bandas: Array<{ y0: number; y1: number }> = [];
  let inicio = -1;
  let blancoSeguido = 0;
  for (let y = 0; y < H; y++) {
    if (filaConTinta[y]) {
      if (inicio === -1) inicio = y;
      blancoSeguido = 0;
    } else if (inicio !== -1) {
      blancoSeguido++;
      // 60 filas en blanco = separación real entre bloques, no un interlineado.
      if (blancoSeguido > 60) {
        bandas.push({ y0: inicio, y1: y - blancoSeguido });
        inicio = -1;
      }
    }
  }
  if (inicio !== -1) bandas.push({ y0: inicio, y1: H - 1 });

  if (bandas.length !== 2) {
    // Sin dos bloques claros, mejor escalar el cuadrado completo que romper.
    return sharp(plantillaRellena)
      .resize({ width, height, fit: 'contain', background: '#ffffff' })
      .png()
      .toBuffer();
  }

  const recortes = await Promise.all(
    bandas.map(async (b) => {
      let x0 = W;
      let x1 = 0;
      for (let y = b.y0; y <= b.y1; y++) {
        for (let x = 0; x < W; x++) {
          if (data[y * W + x]! < 128) {
            if (x < x0) x0 = x;
            if (x > x1) x1 = x;
          }
        }
      }
      const buffer = await sharp(plantillaRellena)
        .extract({ left: x0, top: b.y0, width: x1 - x0 + 1, height: b.y1 - b.y0 + 1 })
        .png()
        .toBuffer();
      return { buffer, width: x1 - x0 + 1, height: b.y1 - b.y0 + 1 };
    }),
  );

  const [frente, patilla] = recortes as [typeof recortes[0], typeof recortes[0]];

  // Escala común: la limita el ancho útil o la altura de los dos bloques.
  const anchoUtil = width * 0.88;
  const aire = height * 0.1;
  const escalaAncho = anchoUtil / Math.max(frente.width, patilla.width);
  const escalaAlto = (height * 0.9 - aire) / (frente.height + patilla.height);
  const escala = Math.min(escalaAncho, escalaAlto);

  const fw = Math.round(frente.width * escala);
  const fh = Math.round(frente.height * escala);
  const pw = Math.round(patilla.width * escala);
  const ph = Math.round(patilla.height * escala);

  const totalAlto = fh + aire + ph;
  const y0 = Math.round((height - totalAlto) / 2);

  return sharp({
    create: { width, height, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .composite([
      {
        input: await sharp(frente.buffer).resize(fw, fh, { fit: 'fill' }).png().toBuffer(),
        left: Math.round((width - fw) / 2),
        top: y0,
      },
      {
        input: await sharp(patilla.buffer).resize(pw, ph, { fit: 'fill' }).png().toBuffer(),
        left: Math.round((width - pw) / 2),
        top: Math.round(y0 + fh + aire),
      },
    ])
    .png()
    .toBuffer();
}
