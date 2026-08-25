/**
 * Script: ml-placas
 *
 * Genera el set de placas de una publicación de Mercado Libre a partir de
 * 2 fotos del modelo (perfil + frente) y sus medidas, y de paso deja las
 * 3 placas limpias que sirven para la ficha del sitio.
 *
 * Uso mínimo:
 *   pnpm placas --perfil foto-perfil.jpg --frente foto-frente.jpg \
 *     --nombre "Vulk Vrast" --calibre 48 --puente 22 --ancho 140 \
 *     --alto 46 --patilla 145
 *
 * Flags:
 *   --perfil <file>     Foto 3/4 o lateral del armazón (obligatoria).
 *   --frente <file>     Foto frontal del armazón (obligatoria).
 *   --nombre <texto>    Nombre del modelo — sólo para el nombre de carpeta.
 *   --calibre/--puente/--ancho/--alto/--patilla   Medidas en mm.
 *   --tipo receta|sol   Ajusta los textos por defecto (default: receta).
 *   --c1..--c4 "TITULO|subtítulo"   Textos de los 4 callouts.
 *   --a1..--a4 "0.3,0.5"            Fuerza a dónde apunta cada flecha
 *                                   (fracción del armazón: 0,0 arriba-izq).
 *                                   Sin esto, la parte se detecta en la foto.
 *   --sin-vision        No detectar partes; usar las posiciones por defecto.
 *   --plantilla <file>  Plantilla de medidas a rellenar (default marketing/medidas.png).
 *   --lifestyle <file>  Foto de persona para la placa de lentes (opcional).
 *   --lentes <texto>    Tipos de lente adaptables (default mono/bi/progresivos).
 *   --aclaracion <txt>  Tercera línea chica en la banda de la placa de lentes.
 *   --garantia <texto>  Plazo de garantía ("por 1 año" default, "por 6 meses"...).
 *   --item <texto>      Repetible: reemplaza los 5 ítems de la placa de garantía.
 *   --titulo6 <texto>   Título de la placa de garantía.
 *   --out <dir>         Carpeta de salida (default ~/Desktop/placas/<slug>).
 *   --web-ancho <px>    Ancho de las salidas del sitio (default 2000).
 *   --web-alto <px>     Alto de las salidas del sitio (default 1333).
 *   --vision            Usa Claude Vision para recortar en vez de `trim`.
 *   --solo <lista>      Genera sólo algunas placas: "1,4" o "web".
 *
 * Salidas (`<out>/`):
 *   ml/01-perfil.jpg .. ml/06-garantia.jpg    1500×1500, para Mercado Libre
 *   web/perfil.jpg | frente.jpg | medidas.jpg 2000×1333, para el sitio
 *
 * Las placas 01 y 02 salen sin texto, sin logo y sin marca de agua: sólo
 * el armazón centrado sobre blanco puro.
 */

import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

import { recortarAnteojo, encajar, type Recorte } from './lib/placas-frame';
import {
  ACENTO,
  ACENTO_TEXTO,
  AZUL,
  NEGRO,
  VERDE,
  burbujaConFlecha,
  escaparXml,
  fontQueEntra,
  type Burbuja,
} from './lib/placas-svg';
import { svgMedidas, type Medidas } from './lib/placas-medidas';
import { detectarCotas, plantillaA32, rellenarPlantilla } from './lib/placas-plantilla';
import {
  detectarPartes,
  parteSegunTexto,
  resolverAncla,
  type Partes,
} from './lib/placas-partes';

// ---------------------------------------------------------------------
// Constantes de formato
// ---------------------------------------------------------------------

/** Placas de Mercado Libre: cuadradas 1500×1500 (recomendación de ML). */
const ML = 1500;
/** Placas del sitio: 3:2, igual que `normalize-product-photos.ts`. */
const WEB_W = 2000;
const WEB_H = 1333;
/**
 * Cuánto del canvas ocupa el armazón. En la galería de ML el producto tiene
 * que llenar el cuadro: contra competidores que lo hacen, una foto con aire
 * de más se lee como producto más chico y más barato.
 */
const FILL_ML = 0.92;
const FILL_WEB = 0.92;
const FILL_CALLOUTS = 0.73;
/** El de la placa de lentes va apenas menor porque comparte cuadro con la banda. */
const FILL_LENTES = 0.88;

const FUENTES_DIR = path.join(process.cwd(), 'assets/placas/fonts');
/** Plantilla dibujada por el founder. Si está, manda sobre el diagrama generado. */
const PLANTILLA_MEDIDAS = path.join(process.cwd(), 'marketing/medidas.png');

// ---------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------

function flag(nombre: string): string | undefined {
  const i = process.argv.indexOf(`--${nombre}`);
  if (i === -1) return undefined;
  const valor = process.argv[i + 1];
  if (!valor || valor.startsWith('--')) return '';
  return valor;
}

function flagNum(nombre: string): number | undefined {
  const v = flag(nombre);
  if (v === undefined || v === '') return undefined;
  const n = Number(v);
  if (Number.isNaN(n)) throw new Error(`--${nombre} tiene que ser un número (recibí "${v}").`);
  return n;
}

function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Anton y Archivo Black tienen que estar registradas en el sistema: en
 * macOS librsvg resuelve familias por CoreText, así que no alcanza con
 * apuntar fontconfig a la carpeta del repo.
 */
function asegurarFuentes(): void {
  let instaladas = '';
  try {
    instaladas = execFileSync('fc-list', { encoding: 'utf8' });
  } catch {
    console.warn('⚠️ No encontré `fc-list`; asumo que las fuentes ya están instaladas.');
    return;
  }

  const familias: Array<[string, string]> = [
    ['Anton-Regular.ttf', 'Anton'],
    ['ArchivoBlack-Regular.ttf', 'Archivo Black'],
    ['DMSans-Variable.ttf', 'DM Sans'],
  ];
  const faltan = familias.filter(([, familia]) => !instaladas.includes(familia)).map(([f]) => f);
  if (faltan.length === 0) return;

  const destino = path.join(os.homedir(), 'Library/Fonts');
  for (const f of faltan) {
    execFileSync('cp', [path.join(FUENTES_DIR, f), destino]);
    console.log(`  ✓ instalé ${f} en ~/Library/Fonts`);
  }
  try {
    execFileSync('fc-cache', ['-f']);
  } catch {
    /* el cache se regenera solo en el próximo arranque */
  }
}

// ---------------------------------------------------------------------
// Composición
// ---------------------------------------------------------------------

function canvasBlanco(width: number, height: number) {
  return sharp({
    create: { width, height, channels: 3, background: { r: 255, g: 255, b: 255 } },
  });
}

function svgWrap(contenido: string, width: number, height: number): Buffer {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${contenido}</svg>`,
  );
}

/** Placa limpia: armazón centrado sobre blanco. Sin texto ni logo. */
async function placaLimpia(
  recorte: Recorte,
  destino: string,
  width: number,
  height: number,
  fill: number,
): Promise<void> {
  const fit = await encajar(recorte, { width, height }, fill);
  // Enfoque suave: el redimensionado ablanda los bordes del armazón y sobre
  // blanco puro eso se nota. Sólo afecta al producto, no al fondo.
  const nitido = await sharp(fit.buffer).sharpen({ sigma: 0.8, m1: 0.5, m2: 0.4 }).png().toBuffer();
  await canvasBlanco(width, height)
    .composite([{ input: nitido, left: fit.left, top: fit.top }])
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toFile(destino);
}

/**
 * Dibuja los puntos detectados sobre la foto, con su nombre.
 *
 * Sirve para saber si un callout mal apuntado es culpa de la detección o de
 * cómo se eligió la parte. Sin esto se termina adivinando.
 */
async function debugPartes(recorte: Recorte, partes: Partes, destino: string): Promise<void> {
  const fit = await encajar(recorte, { width: ML, height: ML }, 0.9);
  const px = Math.round(ML * 0.016);

  const marcas = Object.entries(partes)
    .map(([nombre, punto], i) => {
      const x = fit.left + fit.width * punto.fx;
      const y = fit.top + fit.height * punto.fy;
      const color = ['#E11D48', '#0891B2', '#7C3AED', '#16A34A', '#EA580C', '#DB2777', '#0D9488', '#CA8A04', '#4F46E5'][i % 9];
      return `
        <circle cx="${x}" cy="${y}" r="${px * 0.6}" fill="${color}" stroke="#fff" stroke-width="3"/>
        <text x="${x + px}" y="${y + px * 0.4}" font-family="Manrope" font-weight="700" font-size="${px}"
          fill="${color}" stroke="#fff" stroke-width="4" paint-order="stroke">${nombre}</text>`;
    })
    .join('');

  await canvasBlanco(ML, ML)
    .composite([
      { input: fit.buffer, left: fit.left, top: fit.top },
      { input: svgWrap(marcas, ML, ML), left: 0, top: 0 },
    ])
    .jpeg({ quality: 90 })
    .toFile(destino);
}

/**
 * Deshace el cruce entre las dos flechas de un mismo lado.
 *
 * Las burbujas de arriba y de abajo de un lado tienen que apuntar a puntos
 * en ese mismo orden vertical. Si el de arriba quedó apuntando más abajo que
 * el de abajo, las flechas se trenzan y la placa se lee sucia: alcanza con
 * intercambiarles el destino.
 */
function destrenzar(
  puntos: Array<{ fx: number; fy: number }>,
  anclas: Array<{ esquina: Burbuja['esquina'] }>,
  custom: Array<{ fx: number; fy: number } | undefined>,
  fijos: boolean[],
): void {
  const pares: Array<[Burbuja['esquina'], Burbuja['esquina']]> = [
    ['tl', 'bl'],
    ['tr', 'br'],
  ];

  for (const [arriba, abajo] of pares) {
    const i = anclas.findIndex((a) => a.esquina === arriba);
    const j = anclas.findIndex((a) => a.esquina === abajo);
    if (i === -1 || j === -1) continue;
    // No se tocan los destinos puestos a mano ni los de un callout que pidió
    // una parte concreta: si el texto dice "lente", la flecha tiene que ir al
    // cristal aunque eso deje las dos flechas del lado cruzadas. Antes de
    // mover una flecha a la parte equivocada, es preferible el cruce.
    if (custom[i] || custom[j] || fijos[i] || fijos[j]) continue;

    const pi = puntos[i]!;
    const pj = puntos[j]!;
    if (pi.fy > pj.fy) {
      puntos[i] = pj;
      puntos[j] = pi;
    }
  }
}

/**
 * Evita que dos flechas terminen en el mismo lugar.
 *
 * Puede pasar cuando dos callouts hablan de lo mismo, o cuando en la foto se
 * ve una sola de las dos partes de un par. Ahí se corre el punto lo mínimo
 * necesario para que las dos puntas se distingan.
 */
function separarDeLosOtros(
  punto: { fx: number; fy: number },
  usados: Array<{ fx: number; fy: number }>,
): { fx: number; fy: number } {
  const MINIMA = 0.17;
  let resultado = punto;
  for (const otro of usados) {
    const d = Math.hypot(resultado.fx - otro.fx, resultado.fy - otro.fy);
    if (d < MINIMA) {
      const angulo = d === 0 ? 0.6 : Math.atan2(resultado.fy - otro.fy, resultado.fx - otro.fx);
      resultado = {
        fx: Math.max(0.05, Math.min(0.95, otro.fx + Math.cos(angulo) * MINIMA)),
        fy: Math.max(0.05, Math.min(0.95, otro.fy + Math.sin(angulo) * MINIMA)),
      };
    }
  }
  return resultado;
}

/** Placa de callouts: armazón centrado + 4 burbujas amarillas con flecha. */
async function placaCallouts(
  recorte: Recorte,
  callouts: Array<{ titulo: string; subtitulo?: string }>,
  destino: string,
  anclasCustom: Array<{ fx: number; fy: number } | undefined> = [],
  partes: Partes = {},
): Promise<void> {
  const fit = await encajar(recorte, { width: ML, height: ML }, FILL_CALLOUTS);

  // Posiciones de respaldo, en fracciones del rectángulo del armazón, para
  // cuando no se pudieron detectar las partes. Se pueden pisar con --a1..--a4.
  const anclas: Array<{ fx: number; fy: number; esquina: Burbuja['esquina'] }> = [
    { fx: 0.26, fy: 0.46, esquina: 'tl' },
    { fx: 0.88, fy: 0.16, esquina: 'tr' },
    { fx: 0.36, fy: 0.82, esquina: 'bl' },
    { fx: 0.82, fy: 0.74, esquina: 'br' },
  ];

  // Primero se resuelven los cuatro destinos, después se corrigen los cruces
  // y recién ahí se dibuja: si se dibujara sobre la marcha no habría forma de
  // ver que dos flechas del mismo lado se cruzan.
  const usados: Array<{ fx: number; fy: number }> = [];
  const fijos: boolean[] = [];
  const puntos = callouts.slice(0, 4).map((c, i) => {
    const base = anclas[i]!;
    const custom = anclasCustom[i];

    // Prioridad: lo que pidió el founder, después la parte detectada en la
    // foto, y recién al final la posición de respaldo.
    if (custom) {
      fijos.push(true);
      usados.push(custom);
      return custom;
    }

    const parte = parteSegunTexto(c.titulo, c.subtitulo);
    fijos.push(parte !== 'auto');
    const resuelto = resolverAncla(parte, partes, base.esquina, { fx: base.fx, fy: base.fy });
    const punto = separarDeLosOtros(resuelto, usados);
    usados.push(punto);
    return punto;
  });

  destrenzar(puntos, anclas, anclasCustom, fijos);

  const burbujas = callouts.slice(0, 4).map((c, i) => {
    const base = anclas[i]!;
    const a = { ...base, ...puntos[i]! };
    return burbujaConFlecha(
      {
        titulo: c.titulo,
        subtitulo: c.subtitulo,
        esquina: a.esquina,
        target: {
          x: fit.left + fit.width * a.fx,
          y: fit.top + fit.height * a.fy,
        },
      },
      ML,
    );
  });

  await canvasBlanco(ML, ML)
    .composite([
      { input: fit.buffer, left: fit.left, top: fit.top },
      { input: svgWrap(burbujas.join(''), ML, ML), left: 0, top: 0 },
    ])
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toFile(destino);
}

/**
 * Placa de medidas.
 *
 * Si existe la plantilla del founder (`marketing/medidas.png`), se rellenan
 * sus cotas y se usa esa: es su dibujo, con su tipografía y su encuadre. El
 * diagrama generado por código queda sólo como respaldo para cuando la
 * plantilla no está o no se puede leer.
 */
async function placaMedidas(
  medidas: Medidas,
  destino: string,
  width: number,
  height: number,
  plantilla?: Buffer,
): Promise<void> {
  if (plantilla) {
    const cuadrada = width === height;
    const salida = cuadrada
      ? await sharp(plantilla).resize(width, height, { fit: 'contain', background: '#ffffff' }).png().toBuffer()
      : await plantillaA32(plantilla, width, height);
    await sharp(salida).jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toFile(destino);
    return;
  }

  await canvasBlanco(width, height)
    .composite([{ input: svgWrap(svgMedidas(medidas, width, height), width, height), left: 0, top: 0 }])
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toFile(destino);
}

/**
 * Placa "se pueden adaptar lentes": armazón sobre foto de persona
 * (opcional) atenuada, con banda amarilla abajo.
 *
 * El armazón se compone con blend `multiply` para que el blanco de la foto
 * recortada desaparezca sobre el fondo claro, sin recorte por alpha.
 */
async function placaLentes(
  recorte: Recorte,
  destino: string,
  textos: { titulo: string; subtitulo: string; aclaracion?: string },
  lifestyle?: string,
): Promise<void> {
  const bandaAlto = Math.round(ML * 0.18);

  let base: sharp.Sharp;
  if (lifestyle) {
    const fondo = await sharp(lifestyle)
      .rotate()
      .resize({ width: ML, height: ML, fit: 'cover', position: 'top' })
      .toBuffer();
    // Velo blanco para que la persona no compita con el armazón.
    const velo = await sharp({
      create: { width: ML, height: ML, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 0.72 } },
    })
      .png()
      .toBuffer();
    base = sharp(fondo).composite([{ input: velo, left: 0, top: 0 }]);
  } else {
    base = canvasBlanco(ML, ML);
  }

  const planchada = await base.jpeg({ quality: 95 }).toBuffer();
  const fit = await encajar(recorte, { width: ML, height: ML - bandaAlto }, FILL_LENTES);

  // Jerarquía: el subtítulo se deriva del título en vez de calcularse solo,
  // así nunca terminan midiendo lo mismo y leyéndose como dos renglones iguales.
  const anchoUtil = ML * 0.86;
  const tituloPx = fontQueEntra(textos.titulo, anchoUtil, 'archivo', 0.04, Math.round(ML * 0.064));
  const subPx = Math.min(
    Math.round(tituloPx * 0.55),
    fontQueEntra(textos.subtitulo, anchoUtil, 'archivo', 0.04, Math.round(ML * 0.036)),
  );

  const aclaracionPx = Math.round(subPx * 0.62);
  // El bloque de texto va centrado en la banda, no colgado del borde de arriba.
  const altoTexto =
    tituloPx * 1.05 + subPx * 1.5 + (textos.aclaracion ? aclaracionPx * 1.7 : 0);
  const padBanda = Math.max(0, (bandaAlto - altoTexto) / 2);
  const baseTitulo = ML - bandaAlto + padBanda + tituloPx * 0.86;

  const banda = `
    <rect x="0" y="${ML - bandaAlto}" width="${ML}" height="${bandaAlto}" fill="${ACENTO}"/>
    <text x="${ML / 2}" y="${baseTitulo}" font-family="Archivo Black" font-size="${tituloPx}"
      letter-spacing="${tituloPx * 0.04}" fill="${ACENTO_TEXTO}" text-anchor="middle">${escaparXml(textos.titulo.toUpperCase())}</text>
    <text x="${ML / 2}" y="${baseTitulo + subPx * 1.5}" font-family="Archivo Black" font-size="${subPx}"
      letter-spacing="${subPx * 0.06}" fill="${ACENTO_TEXTO}" text-anchor="middle">${escaparXml(textos.subtitulo.toUpperCase())}</text>
    ${
      textos.aclaracion
        ? `<text x="${ML / 2}" y="${baseTitulo + subPx * 1.5 + aclaracionPx * 1.7}" font-family="Manrope" font-weight="700"
      font-size="${aclaracionPx}" letter-spacing="${aclaracionPx * 0.02}" fill="${ACENTO_TEXTO}" text-anchor="middle">${escaparXml(textos.aclaracion)}</text>`
        : ''
    }`;

  await sharp(planchada)
    .composite([
      { input: fit.buffer, left: fit.left, top: fit.top, blend: 'multiply' },
      { input: svgWrap(banda, ML, ML), left: 0, top: 0 },
    ])
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toFile(destino);
}

/**
 * Prepara el logo para pintarlo sobre la card blanca.
 *
 * `logo-square.png` es el isotipo blanco sobre un cuadrado azul sólido. Puesto
 * tal cual sobre la card queda como un parche recortado, así que se usa su
 * luminancia como máscara y se lo vuelve a pintar en el azul de la placa: el
 * isotipo queda flotando sobre el blanco, sin caja.
 */
async function logoComoTinta(rutaLogo: string, lado: number): Promise<Buffer> {
  const { data, info } = await sharp(rutaLogo)
    .resize({ width: lado, height: lado, fit: 'contain', background: '#00000000' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const tinta = { r: 0x12, g: 0x29, b: 0x4b };
  const salida = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 4]!;
    const g = data[i * 4 + 1]!;
    const b = data[i * 4 + 2]!;
    const a = data[i * 4 + 3]!;
    // Luminancia alta = trazo del isotipo = opaco. El azul del fondo no es
    // negro puro, así que sin umbral dejaría un halo gris con forma de caja.
    const luz = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const opacidad = Math.max(0, Math.min(1, (luz - 0.45) / 0.4));
    salida[i * 4] = tinta.r;
    salida[i * 4 + 1] = tinta.g;
    salida[i * 4 + 2] = tinta.b;
    salida[i * 4 + 3] = Math.round(opacidad * (a / 255) * 255);
  }

  return sharp(salida, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();
}

/** Placa de garantía / trust: card blanca sobre azul, con el logo arriba. */
async function placaGarantia(destino: string, items: string[], titulo: string): Promise<void> {
  // Margen más generoso: a 83px el azul se leía como un borde mal cortado.
  const margen = Math.round(ML * 0.08);
  const cardX = margen;
  const cardY = margen;
  const cardW = ML - margen * 2;
  const cardH = ML - margen * 2;

  const logoPath = path.join(process.cwd(), 'public/brand/logo-square.png');
  const logoLado = Math.round(ML * 0.115);
  let logo: Buffer | null = null;
  try {
    logo = await logoComoTinta(logoPath, logoLado);
  } catch {
    console.warn('  ⚠️ no encontré public/brand/logo-square.png — la placa 06 va sin logo.');
  }

  const tituloPx = fontQueEntra(titulo, cardW * 0.88, 'manrope', 0.02, Math.round(ML * 0.046));
  const itemPx = Math.round(ML * 0.032);
  const altoLinea = itemPx * 1.38;
  const checkX = cardX + Math.round(cardW * 0.09);
  const textoX = checkX + Math.round(ML * 0.055);

  // Reparto vertical: cada ítem ocupa según sus líneas, y el aire sobrante
  // se divide en partes iguales — así no se amontonan los de 2 líneas.
  // El título necesita más aire por debajo que el que hay entre ítems, si no
  // se lee como el encabezado del primer ítem en vez de como título del set.
  const areaY0 = cardY + Math.round(ML * 0.35);
  const areaY1 = cardY + cardH - Math.round(ML * 0.06);
  const alturas = items.map((item) => item.split('|').length * altoLinea);
  const aire = Math.max(0, areaY1 - areaY0 - alturas.reduce((a, b) => a + b, 0));
  const paso = aire / Math.max(1, items.length - 1);

  let cursorY = areaY0;
  const filas = items
    .map((item, i) => {
      const lineas = item.split('|');
      const y = cursorY + itemPx * 0.5;
      cursorY += (alturas[i] ?? altoLinea) + paso;
      const s = itemPx * 0.62;
      const check = `<path d="M ${checkX - s} ${y - s * 0.15} L ${checkX - s * 0.25} ${y + s * 0.6} L ${checkX + s * 1.15} ${y - s * 1.1}"
        fill="none" stroke="${VERDE}" stroke-width="${Math.round(itemPx * 0.22)}" stroke-linecap="round" stroke-linejoin="round"/>`;
      const texto = lineas
        .map(
          (linea, j) =>
            `<text x="${textoX}" y="${y + itemPx * 0.35 + j * altoLinea}" font-family="Manrope" font-weight="600"
              font-size="${itemPx}" letter-spacing="${itemPx * 0.01}" fill="${NEGRO}">${escaparXml(linea)}</text>`,
        )
        .join('');
      return check + texto;
    })
    .join('');

  const contenido = `
    <rect width="${ML}" height="${ML}" fill="${AZUL}"/>
    <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="${Math.round(ML * 0.035)}" fill="#FFFFFF"/>
    <text x="${ML / 2}" y="${cardY + Math.round(ML * 0.28)}" font-family="Manrope" font-weight="700" font-size="${tituloPx}"
      letter-spacing="${tituloPx * 0.02}" fill="${NEGRO}" text-anchor="middle">${escaparXml(titulo)}</text>
    ${filas}`;

  const capas: sharp.OverlayOptions[] = [{ input: svgWrap(contenido, ML, ML), left: 0, top: 0 }];
  if (logo) {
    capas.push({
      input: logo,
      left: Math.round((ML - logoLado) / 2),
      top: cardY + Math.round(ML * 0.075),
    });
  }

  await canvasBlanco(ML, ML)
    .composite(capas)
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toFile(destino);
}

// ---------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------

/**
 * Afirmaciones técnicas que hay que poder respaldar con la ficha del
 * fabricante antes de quemarlas en un JPG.
 *
 * Nació de un caso real: se generó un callout que decía "G-Flex flexible" y
 * el founder lo frenó — el material es algo maleable, no flexible, y la ficha
 * de Vulk nunca usa esa palabra. Una vez publicada, una propiedad que el
 * producto no tiene es un reclamo, y corregirla implica rehacer la placa en
 * todas las publicaciones.
 */
const CLAIMS_A_VERIFICAR: Array<[RegExp, string]> = [
  [/flexible|flexibilidad/i, 'que el fabricante declare flexibilidad, no sólo el nombre del material'],
  [/irrompible|indestructible|inastillable/i, 'que haya norma o ensayo que lo respalde'],
  [/memoria|titanio|acero quir[úu]rgico/i, 'el material exacto en la ficha'],
  [/antirray|anti-?ray|antirreflej|anti-?reflej/i, 'que el tratamiento venga de fábrica en este modelo'],
  [/polarizad/i, 'que ESTE color de lente sea polarizado, no otro de la línea'],
  [/fotocrom|transitions/i, 'que el lente sea fotocromático de fábrica'],
  [/blue ?light|luz azul|filtro azul/i, 'evidencia clínica y que el lente lo tenga'],
  [/de por vida|para siempre|eterna/i, 'una garantía así por escrito del fabricante'],
  [/100 ?%|total(mente)? (protegid|seguro)/i, 'el absoluto: sólo si la ficha lo dice así'],
];

/**
 * Chequeo de sanidad geométrica de las medidas.
 *
 * Los dos calibres más el puente tienen que entrar en el ancho total, y
 * todavía sobrar algo para el material del armazón a cada lado. Si no cierra,
 * alguna de las medidas está mal cargada.
 *
 * Detectó un dato erróneo real: la ficha del Vulk Katleen decía calibre 57 mm
 * con 129 mm de ancho total, que da 132 mm de frente — más ancho que el
 * armazón entero. El valor correcto era 53 mm.
 */
function revisarMedidas(m: Medidas): void {
  const ocupado = m.calibre * 2 + m.puente;
  const sobra = m.anchoTotal - ocupado;

  if (sobra < 0) {
    console.warn(
      `\n  ⚠️ Las medidas no cierran: 2 × ${m.calibre} de calibre + ${m.puente} de puente = ${ocupado} mm, ` +
        `más que los ${m.anchoTotal} mm de ancho total. Alguna está mal: revisá contra la placa o el armazón.\n`,
    );
  } else if (sobra < 4) {
    console.warn(
      `\n  ⚠️ Quedan sólo ${sobra} mm para el material del armazón a los dos lados ` +
        `(2 × ${m.calibre} + ${m.puente} = ${ocupado} sobre ${m.anchoTotal}). Es muy poco: verificá las medidas.\n`,
    );
  }

  if (m.alto > m.calibre * 1.4) {
    console.warn(`\n  ⚠️ El alto (${m.alto}) es mucho mayor que el calibre (${m.calibre}): ¿están invertidos?\n`);
  }
}

/** Avisa sobre afirmaciones que conviene chequear antes de publicar. */
function revisarClaims(textos: string[]): void {
  const avisos: string[] = [];
  for (const texto of textos) {
    for (const [patron, queVerificar] of CLAIMS_A_VERIFICAR) {
      const encontrado = texto.match(patron);
      if (encontrado) avisos.push(`"${encontrado[0]}" en «${texto}» → verificá ${queVerificar}`);
    }
  }
  if (avisos.length === 0) return;

  console.warn('\n  ⚠️ Afirmaciones técnicas a verificar antes de publicar:');
  for (const aviso of avisos) console.warn(`     · ${aviso}`);
  console.warn('     Si la ficha del fabricante no lo dice, sacalo: una vez impreso no se corrige.\n');
}

function parsearCallout(valor: string | undefined, porDefecto: { titulo: string; subtitulo?: string }) {
  if (!valor) return porDefecto;
  const [titulo, subtitulo] = valor.split('|');
  return { titulo: (titulo ?? '').trim(), subtitulo: subtitulo?.trim() || undefined };
}

async function main(): Promise<void> {
  const perfil = flag('perfil');
  const frente = flag('frente');
  if (!perfil || !frente) {
    console.error(
      'Faltan fotos. Uso:\n  pnpm placas --perfil <foto> --frente <foto> --nombre "Marca Modelo" \\\n    --calibre 48 --puente 22 --ancho 140 --alto 46 --patilla 145',
    );
    process.exit(1);
  }

  const nombre = flag('nombre') || 'armazon';
  const medidas: Medidas = {
    calibre: flagNum('calibre') ?? 50,
    puente: flagNum('puente') ?? 20,
    anchoTotal: flagNum('ancho') ?? 140,
    alto: flagNum('alto') ?? 45,
    patilla: flagNum('patilla') ?? 145,
  };

  // El 3:2 del sitio es configurable: al reemplazar la foto de un producto ya
  // cargado conviene generar en el mismo tamaño que declara `product_images`,
  // así se pisa el archivo sin tener que tocar la fila.
  const webW = flagNum('web-ancho') ?? WEB_W;
  const webH = flagNum('web-alto') ?? WEB_H;

  const outDir = flag('out') || path.join(os.homedir(), 'Desktop/placas', slugify(nombre));
  const mlDir = path.join(outDir, 'ml');
  const webDir = path.join(outDir, 'web');
  await fs.mkdir(mlDir, { recursive: true });
  await fs.mkdir(webDir, { recursive: true });

  const solo = (flag('solo') || '').split(',').map((s) => s.trim()).filter(Boolean);
  const hacer = (id: string) => solo.length === 0 || solo.includes(id);

  asegurarFuentes();

  const usarVision = process.argv.includes('--vision');
  console.log(`\nRecortando fotos (${usarVision ? 'Claude Vision' : 'trim'})...`);
  const recortePerfil = await recortarAnteojo(perfil, { usarVision });
  const recorteFrente = await recortarAnteojo(frente, { usarVision });
  console.log(`  perfil: ${recortePerfil.width}×${recortePerfil.height}`);
  console.log(`  frente: ${recorteFrente.width}×${recorteFrente.height}`);

  // Los defaults van en el orden de las anclas: c1 bisagra, c2 patilla,
  // c3 frente, c4 depende del tipo de producto.
  //
  // En un armazón de RECETA el lente es de demostración: no tiene filtro UV
  // ni categoría, así que ahí el cuarto callout habla de confort. En uno de
  // SOL sí corresponde hablar del lente. El texto tiene que describir la
  // parte a la que apunta la flecha.
  const esSol = (flag('tipo') || 'receta').toLowerCase() === 'sol';
  const callouts = [
    // Sin subtítulo por defecto: el tipo de bisagra cambia por modelo y una
    // afirmación equivocada acá termina impresa en la publicación.
    parsearCallout(flag('c1'), { titulo: 'Bisagras' }),
    parsearCallout(flag('c2'), { titulo: 'Armazón liviano' }),
    parsearCallout(flag('c3'), { titulo: 'Frente', subtitulo: 'color a definir' }),
    parsearCallout(
      flag('c4'),
      esSol ? { titulo: 'Lente', subtitulo: 'protección UV 400' } : { titulo: 'Cómodos' },
    ),
  ];

  revisarMedidas(medidas);
  revisarClaims([
    ...callouts.flatMap((c) => [c.titulo, c.subtitulo ?? '']),
    flag('lentes') || '',
    flag('aclaracion') || '',
  ].filter(Boolean));

  console.log('\nGenerando placas...');

  if (hacer('1')) {
    await placaLimpia(recortePerfil, path.join(mlDir, '01-perfil.jpg'), ML, ML, FILL_ML);
    await placaLimpia(recortePerfil, path.join(webDir, 'perfil.jpg'), webW, webH, FILL_WEB);
    console.log('  ✓ 01 perfil (ML + web)');
  }
  if (hacer('2')) {
    await placaLimpia(recorteFrente, path.join(mlDir, '02-frente.jpg'), ML, ML, FILL_ML);
    await placaLimpia(recorteFrente, path.join(webDir, 'frente.jpg'), webW, webH, FILL_WEB);
    console.log('  ✓ 02 frente (ML + web)');
  }
  if (hacer('3')) {
    // Dónde está cada parte en ESTA foto: sin esto las flechas apuntan a
    // fracciones fijas del cuadro y caen donde toque.
    const partes = process.argv.includes('--sin-vision')
      ? {}
      : await detectarPartes(recortePerfil.buffer);
    if (process.argv.includes('--debug-partes')) {
      await debugPartes(recortePerfil, partes, path.join(mlDir, 'debug-partes.jpg'));
      console.log('  · escribí debug-partes.jpg con los puntos detectados');
    }
    const detectadas = Object.keys(partes);
    console.log(
      detectadas.length > 0
        ? `  · partes detectadas: ${detectadas.join(', ')}`
        : '  · sin detección de partes: uso las posiciones por defecto',
    );

    const anclas = ['a1', 'a2', 'a3', 'a4'].map((nombre) => {
      const valor = flag(nombre);
      if (!valor) return undefined;
      const [fx, fy] = valor.split(',').map(Number);
      if (fx === undefined || fy === undefined || Number.isNaN(fx) || Number.isNaN(fy)) {
        throw new Error(`--${nombre} va como "x,y" en fracciones del armazón (ej: 0.3,0.5).`);
      }
      return { fx, fy };
    });
    await placaCallouts(recortePerfil, callouts, path.join(mlDir, '03-callouts.jpg'), anclas, partes);
    console.log('  ✓ 03 callouts');
  }
  if (hacer('4')) {
    let plantilla: Buffer | undefined;
    const rutaPlantilla = flag('plantilla') || PLANTILLA_MEDIDAS;
    try {
      await fs.access(rutaPlantilla);
      const cotas = await detectarCotas(rutaPlantilla);
      plantilla = await rellenarPlantilla(rutaPlantilla, medidas, cotas);
    } catch (error) {
      const motivo = error instanceof Error ? error.message : String(error);
      console.warn(`  ⚠️ no pude usar la plantilla (${motivo}) — dibujo el diagrama por código.`);
    }
    await placaMedidas(medidas, path.join(mlDir, '04-medidas.jpg'), ML, ML, plantilla);
    await placaMedidas(medidas, path.join(webDir, 'medidas.jpg'), webW, webH, plantilla);
    console.log(`  ✓ 04 medidas (ML + web)${plantilla ? ' — sobre tu plantilla' : ''}`);
  }
  if (hacer('5')) {
    const lentes = flag('lentes') || 'monofocales, bifocales y progresivos';
    if (/progresiv/i.test(lentes) && medidas.alto < 30) {
      console.warn(
        `  ⚠️ el frente mide ${medidas.alto}mm de alto: para progresivos conviene 30mm+. Revisá el texto con --lentes.`,
      );
    }
    // Va con la foto de frente: el perfil ya se usa en la 01 y en los callouts,
    // y tres miniaturas iguales hacen ver la galería más pobre de lo que es.
    await placaLentes(
      recorteFrente,
      path.join(mlDir, '05-lentes.jpg'),
      {
        titulo: 'Se pueden adaptar lentes',
        subtitulo: lentes,
        aclaracion: flag('aclaracion') || undefined,
      },
      flag('lifestyle') || undefined,
    );
    console.log('  ✓ 05 lentes');
  }
  if (hacer('6')) {
    // Los cortes de línea van con "|". El plazo de garantía se puede pisar por
    // modelo: la política universal es 1 año, pero no todas las marcas igualan.
    const garantia = flag('garantia') || 'por 1 año';
    const itemsCustom = process.argv
      .map((arg, i) => (arg === '--item' ? process.argv[i + 1] : undefined))
      .filter((v): v is string => Boolean(v) && !v!.startsWith('--'));
    const items =
      itemsCustom.length > 0
        ? itemsCustom
        : [
            'Producto 100% original',
            'Incluye estuche y franela',
            'Apto para adaptar|lentes graduadas',
            'Armazón liviano y cómodo',
            `Garantía del fabricante|${garantia}`,
          ];
    await placaGarantia(
      path.join(mlDir, '06-garantia.jpg'),
      items,
      flag('titulo6') || 'Producto de Alta Calidad',
    );
    console.log('  ✓ 06 garantía');
  }

  console.log(`\nListo. Placas en:\n  ${outDir}\n`);
}

main().catch((error) => {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
