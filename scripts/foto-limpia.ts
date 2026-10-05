/**
 * Script: foto-limpia
 *
 * Convierte una foto de celular de un armazón en una foto de catálogo: fondo
 * blanco puro, producto centrado y con el mismo encuadre que el resto de las
 * fichas.
 *
 * Para qué existe: `pnpm placas` asume que la foto YA viene sobre fondo
 * uniforme (usa `trim`, que recorta el color dominante del perímetro). Con una
 * foto sacada sobre el escritorio —con hoja de papel, mano, sombra y pared de
 * fondo— el `trim` no encuentra ningún borde uniforme y devuelve la foto
 * entera. Acá el recorte lo hace `rembg`, que segmenta el objeto de verdad.
 *
 * Se usa cuando un modelo no está ni en el sitio del fabricante ni en las
 * publicaciones viejas de Mercado Libre, y las únicas fotos que hay son las que
 * saca el founder en el local.
 *
 * Uso:
 *   pnpm foto:limpia --dir marketing/fotos/javo
 *   pnpm foto:limpia --dir marketing/fotos/javo --fill 0.88
 *
 * Flags:
 *   --dir <carpeta>   Carpeta con las fotos crudas (jpg/jpeg/png/heic).
 *   --out <carpeta>   Salida (default: <dir>/limpias).
 *   --fill <0..1>     Cuánto del cuadro ocupa el armazón (default 0.92, el
 *                     mismo que usan las placas del resto del catálogo).
 *   --solo <lista>    Sólo estos archivos, por nombre sin extensión.
 *   --modelo <nombre> Modelo de rembg (default `isnet-general-use`).
 *   --sin-blanquear   No limpiar el fondo que se ve A TRAVÉS del armazón.
 *   --sin-sombra      No dibujar la sombra de contacto bajo el armazón.
 *   --p50 <n>         Medio tono al que llevar el producto (default 85). Los negros
 *                     y las altas luces se anclan siempre a la referencia del
 *                     catálogo; el medio tono depende del COLOR del producto y lo
 *                     confirma quien lo tiene en la mano. 0 = no tocar la exposición.
 *
 * Por qué el default es `isnet-general-use` y no `birefnet-general`: birefnet
 * es mejor para fotos de catálogo, pero cuando el founder saca la foto en el
 * local sosteniendo una hoja de papel detrás, birefnet toma la hoja y la mano
 * como parte del objeto y las recorta junto con el anteojo. isnet segmenta sólo
 * el anteojo. Verificado sobre las 5 fotos del Rusty The Javo.
 *
 * Salidas (`<out>/`):
 *   web/<nombre>.jpg   2000×1333 — el formato de las fotos de ficha del sitio.
 *   ml/<nombre>.jpg    1500×1500 — el formato de las placas de Mercado Libre.
 *   contacto.jpg       Todas juntas en una grilla, para elegir de un vistazo.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

import { encajar, type Recorte } from './lib/placas-frame';
import { recortarConRembg, rembgDisponible } from './lib/recorte-rembg';

/** Mismo valor que `FILL_WEB`/`FILL_ML` en ml-placas.ts: el catálogo es homogéneo. */
const FILL_DEFAULT = 0.92;
const WEB = { width: 2000, height: 1333 };
const ML = { width: 1500, height: 1500 };

function flag(nombre: string): string | undefined {
  const i = process.argv.indexOf(`--${nombre}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function canvasBlanco(width: number, height: number) {
  return sharp({
    create: { width, height, channels: 3, background: { r: 255, g: 255, b: 255 } },
  });
}


/**
 * Neutraliza la dominante de color midiéndola sobre la hoja del fondo.
 *
 * La hoja que sostiene el founder es blanca de verdad, así que sirve de patrón
 * gris: lo que se desvíe de neutro es la luz del local. Se miden los pixeles
 * claros y poco saturados de la foto cruda y se compensa por canal.
 *
 * Se mide en vez de asumir: sobre las 5 fotos del Javo dio dominante CÁLIDA en
 * tres (hoja 194/180/167) y levemente FRÍA en la de WhatsApp (207/207/215).
 * Un factor fijo "de luz de local" habría empeorado esa última.
 */
async function balanceDeBlancos(foto: Buffer): Promise<{ foto: Buffer; papel: number }> {
  const { data, info } = await sharp(foto).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  let R = 0, G = 0, B = 0, n = 0;
  for (let i = 0; i < data.length; i += ch) {
    const r = data[i]!, g = data[i + 1]!, b = data[i + 2]!;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    // Sólo hoja: clara y casi neutra. El producto es marrón saturado y no entra.
    if (min < 150 || max >= 252) continue;
    if ((max - min) / max > 0.14) continue;
    R += r; G += g; B += b; n += 1;
  }
  if (n < 5000) return { foto, papel: 0 };

  R /= n; G /= n; B /= n;
  const ref = Math.max(R, G, B);
  const gan = [ref / R, ref / G, ref / B];
  if (Math.max(...gan) < 1.02) return { foto, papel: (R + G + B) / 3 };

  const tablas = gan.map((k) => {
    const t = new Uint8Array(256);
    for (let v = 0; v < 256; v++) t[v] = Math.min(255, Math.round(v * k));
    return t;
  });
  for (let i = 0; i < data.length; i += ch) {
    data[i] = tablas[0]![data[i]!]!;
    data[i + 1] = tablas[1]![data[i + 1]!]!;
    data[i + 2] = tablas[2]![data[i + 2]!]!;
  }
  console.log(
    `    balance: hoja ${R.toFixed(0)}/${G.toFixed(0)}/${B.toFixed(0)} → ganancias ${gan.map((k) => k.toFixed(2)).join('/')}`,
  );
  return {
    foto: await sharp(data, { raw: { width: info.width, height: info.height, channels: ch } })
      .jpeg({ quality: 95 })
      .toBuffer(),
    // Después del balance la hoja queda neutra en este nivel. Es el patrón que
    // usa `quitarFondoInterior` para reconocerla adentro del armazón.
    papel: ref,
  };
}

/**
 * Recorta el fondo con rembg y deja el armazón al ras, sin aire alrededor.
 *
 * El `trim` acá va sobre el canal alfa que devolvió rembg, no sobre el color:
 * por eso encuentra el borde exacto del producto aunque la foto original
 * tuviera la pared, la mano y la sombra.
 */
async function recortarConFondo(archivo: string, blanquear: boolean): Promise<Recorte> {
  const { foto: crudo, papel } = await balanceDeBlancos(await fs.readFile(archivo));
  const png = await recortarConRembg(crudo, { onLog: (m) => console.log(`    ${m}`) });
  if (!png) throw new Error('rembg no está disponible y sin él esta foto no se puede limpiar.');

  const soloElAnteojo = await quitarManchas(png);
  const recortado = await sharp(soloElAnteojo).trim({ threshold: 1 }).png().toBuffer();
  const limpio = blanquear ? await quitarFondoInterior(recortado, papel) : recortado;

  const { info } = await sharp(limpio).toBuffer({ resolveWithObject: true });
  return { buffer: limpio, width: info.width, height: info.height };
}

/**
 * Se queda sólo con la mancha más grande del recorte y tira el resto.
 *
 * rembg a veces deja fragmentos sueltos —un pedazo de uña, el anillo, una
 * esquina de la hoja— que arruinan la foto dos veces: se ven flotando sobre el
 * blanco, y además agrandan el bounding box, así que al encuadrar el anteojo
 * queda chico y descentrado. El anteojo siempre es la región conectada más
 * grande, así que alcanza con quedarse con ésa.
 *
 * El etiquetado se hace sobre una versión reducida de la máscara (~480 px de
 * ancho): recorrer 12 millones de pixeles en JS es lento y no hace falta, porque
 * las manchas a descartar son chicas por definición. La máscara resultante se
 * reescala con `nearest` y se usa para apagar el alfa original a resolución
 * completa, o sea que el borde fino del anteojo no se toca.
 */
async function quitarManchas(png: Buffer): Promise<Buffer> {
  const meta = await sharp(png).metadata();
  const W = meta.width ?? 0;
  const H = meta.height ?? 0;
  if (!W || !H) return png;

  const w = Math.min(480, W);
  const h = Math.max(1, Math.round((H * w) / W));
  const alfa = await sharp(png)
    .ensureAlpha()
    .extractChannel('alpha')
    .resize(w, h, { fit: 'fill' })
    .raw()
    .toBuffer();

  // Umbral duro SÓLO para decidir qué es una mancha y qué el producto. NO se
  // aplica a la imagen: el acetato es translúcido y el borde del armazón tiene
  // antialias, así que apagar todo alfa < 170 dejaba bordes serruchados y comía
  // las puntas finas de las patillas. La máscara de componentes se usa después
  // sobre el alfa SUAVE original.
  const DURO = 170;

  const etiqueta = new Int32Array(w * h);
  const cola = new Int32Array(w * h);
  const dx = [1, -1, 0, 0];
  const dy = [0, 0, 1, -1];
  let actual = 0;
  let mejor = 0;
  let mejorTam = 0;

  for (let semilla = 0; semilla < w * h; semilla++) {
    if (alfa[semilla]! < DURO || etiqueta[semilla] !== 0) continue;
    actual += 1;
    let cabeza = 0;
    let fin = 0;
    cola[fin++] = semilla;
    etiqueta[semilla] = actual;
    let tam = 0;
    while (cabeza < fin) {
      const p = cola[cabeza++]!;
      tam += 1;
      const x = p % w;
      const y = (p - x) / w;
      for (let k = 0; k < 4; k++) {
        const nx = x + dx[k]!;
        const ny = y + dy[k]!;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const q = ny * w + nx;
        if (alfa[q]! < DURO || etiqueta[q] !== 0) continue;
        etiqueta[q] = actual;
        cola[fin++] = q;
      }
    }
    if (tam > mejorTam) {
      mejorTam = tam;
      mejor = actual;
    }
  }

  if (mejor === 0 || actual === 1) return png;

  const mascara = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) mascara[i] = etiqueta[i] === mejor ? 255 : 0;
  // Ojo: `resize` sobre un raw de 1 canal DEVUELVE 3 canales (sharp lo pasa a
  // sRGB). Si se indexa como si siguiera siendo 1, se lee el pixel equivocado y
  // la máscara queda corrida — apagando parte del anteojo y dejando manchas.
  // Por eso el paso se calcula del largo real en vez de asumirlo.
  const grande = await sharp(mascara, { raw: { width: w, height: h, channels: 1 } })
    .resize(W, H, { fit: 'fill', kernel: 'nearest' })
    .raw()
    .toBuffer();
  const paso = Math.max(1, Math.round(grande.length / (W * H)));

  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    if (grande[p * paso]! >= 128) continue;
    // Se apaga el RGB además del alfa: el `trim` de sharp compara color, no
    // transparencia, así que si quedan los pixeles de la mancha borrada abajo
    // del alfa 0 no encuentra borde uniforme y devuelve la foto entera.
    data[i] = 0; data[i + 1] = 0; data[i + 2] = 0; data[i + 3] = 0;
  }
  console.log(`    descarté ${actual - 1} fragmento(s) suelto(s)`);
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();
}

/**
 * Vuelve TRANSPARENTE la hoja que se ve a través del armazón.
 *
 * Antes esto pintaba de blanco todo pixel claro y desaturado. Dos problemas
 * reales, visibles en la foto de frente entregada: quemaba los brillos
 * especulares del acetato dejando parches planos, y como la hoja tenía bloques
 * de compresión JPEG, unos entraban en el umbral y otros no — quedaba un parche
 * gris pixelado adentro de la patilla.
 *
 * Ahora el criterio es doble y mucho más específico:
 *
 * 1. **Color**: se compara contra el nivel MEDIDO de la hoja en esa foto
 *    (`balanceDeBlancos` lo devuelve), no contra un umbral genérico. Después del
 *    balance la hoja quedó neutra, así que se busca "casi gris y en ese nivel".
 * 2. **Tamaño**: se etiquetan las regiones conectadas y se descartan las chicas.
 *    Los huecos del armazón son manchas grandes; los brillos del acetato son
 *    chispas finas. Ese filtro es lo que salva los reflejos legítimos.
 *
 * Se apaga el ALFA en vez de pintar blanco: al componer sobre el lienzo el borde
 * queda antialiaseado en vez de un escalón duro. La máscara se difumina 2 px por
 * lo mismo.
 */
async function quitarFondoInterior(png: Buffer, papel: number): Promise<Buffer> {
  if (papel <= 0) return png;

  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;

  const esHoja = new Uint8Array(W * H);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    if (data[i + 3]! < 8) continue;
    const r = data[i]!, g = data[i + 1]!, b = data[i + 2]!;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lum = (r + g + b) / 3;
    if (max > 0 && (max - min) / max > 0.12) continue;
    // Tolerancia asimétrica: la hoja que se ve por los huecos suele estar en
    // sombra, o sea más OSCURA que la hoja del fondo abierto que se midió. Hacia
    // arriba se es estricto para no comerse un brillo especular del acetato.
    if (lum > papel + 38 || lum < papel - 85) continue;
    esHoja[p] = 1;
  }

  // Regiones conectadas, para descartar chispas.
  const etiqueta = new Int32Array(W * H);
  const cola = new Int32Array(W * H);
  const dx = [1, -1, 0, 0];
  const dy = [0, 0, 1, -1];
  const minimo = Math.max(400, Math.round(W * H * 0.0012));
  let id = 0;
  let borradas = 0;
  const conservar = new Set<number>();

  for (let semilla = 0; semilla < W * H; semilla++) {
    if (!esHoja[semilla] || etiqueta[semilla] !== 0) continue;
    id += 1;
    let cabeza = 0;
    let fin = 0;
    cola[fin++] = semilla;
    etiqueta[semilla] = id;
    let tam = 0;
    while (cabeza < fin) {
      const q = cola[cabeza++]!;
      tam += 1;
      const x = q % W;
      const y = (q - x) / W;
      for (let k = 0; k < 4; k++) {
        const nx = x + dx[k]!;
        const ny = y + dy[k]!;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const v = ny * W + nx;
        if (!esHoja[v] || etiqueta[v] !== 0) continue;
        etiqueta[v] = id;
        cola[fin++] = v;
      }
    }
    if (tam >= minimo) {
      conservar.add(id);
      borradas += 1;
    }
  }
  if (conservar.size === 0) return png;

  // Máscara de lo que hay que apagar, difuminada para que el borde no sea un escalón.
  const mascara = Buffer.alloc(W * H);
  for (let p = 0; p < W * H; p++) mascara[p] = conservar.has(etiqueta[p]!) ? 255 : 0;
  const suave = await sharp(mascara, { raw: { width: W, height: H, channels: 1 } })
    .blur(2)
    .raw()
    .toBuffer();
  const paso = Math.max(1, Math.round(suave.length / (W * H)));

  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const m = suave[p * paso]!;
    if (m === 0) continue;
    data[i + 3] = Math.round(data[i + 3]! * (1 - m / 255));
  }

  console.log(`    fondo interior: ${borradas} hueco(s) del armazón vueltos transparentes`);
  return sharp(data, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
}

/**
 * Calca el PERFIL TONAL de las fotos del fabricante, no sólo su brillo medio.
 *
 * Igualar el promedio no alcanza: se puede llegar a la misma media con las
 * sombras lavadas y los medios tonos hundidos, que es exactamente lo que pasaba
 * con una curva de potencia simple (el perfil quedaba con el percentil 5 en 66
 * contra 51 de la referencia, o sea negros lechosos).
 *
 * Acá se miden tres anclajes del producto —percentiles 5, 50 y 95— y se arma una
 * curva lineal por tramos que los lleva a los de la referencia. Así el negro se
 * queda negro, el medio tono sube y los brillos no se queman.
 *
 * Los objetivos por default salieron de medir `rusty-bruice/perfil.jpg`, una foto
 * real del fabricante ya cargada en el catálogo: p5 51 · p50 143 · p95 169.
 *
 * NO se usa `sharp().gamma()`: ese método corrige el gamma ALREDEDOR de un
 * resize y sin uno en el medio las dos mitades se cancelan (ver MISTAKES.md).
 */
const TONO_REFERENCIA = { p5: 51, p50: 143, p95: 169 };

/**
 * ⚠️ El p50 de la referencia NO se puede copiar entre productos de distinto color.
 *
 * Se probó y sale mal: el Bruice de la referencia es NEGRO con lente NARANJA y su
 * p50 de 143 es propiedad de esos colores, no de la luz del estudio. Al forzar el
 * Javo —marrón oscuro traslúcido— a 143, el armazón salió naranja ámbar y los
 * lentes dorados. Deja de ser el producto que recibe el cliente.
 *
 * Lo que SÍ se puede copiar entre productos es el anclaje de negros (p5) y el de
 * altas luces (p95), que dependen del estudio. El medio tono es del producto y lo
 * define quien lo tiene en la mano. Default conservador; se ajusta con `--p50`.
 */
const P50_DEFAULT = 85;

function percentiles(vals: number[]): { p5: number; p50: number; p95: number } {
  const orden = vals.slice().sort((a, b) => a - b);
  const en = (q: number) => orden[Math.min(orden.length - 1, Math.floor(orden.length * q))] ?? 0;
  return { p5: en(0.05), p50: en(0.5), p95: en(0.95) };
}

/** Valores de luminancia del producto, ignorando el blanco del lienzo. */
async function tonosDelProducto(imagen: Buffer): Promise<number[]> {
  const { data, info } = await sharp(imagen).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const vals: number[] = [];
  for (let i = 0; i < data.length; i += ch) {
    const r = data[i]!, g = data[i + 1]!, b = data[i + 2]!;
    if (Math.max(r, g, b) >= 245) continue;
    vals.push((r + g + b) / 3);
  }
  return vals;
}

async function igualarTono(imagen: Buffer, p50Objetivo: number): Promise<Buffer> {
  const vals = await tonosDelProducto(imagen);
  if (vals.length < 1000) return imagen;

  const src = percentiles(vals);
  const dst = { ...TONO_REFERENCIA, p50: p50Objetivo };
  if (!(dst.p5 < dst.p50 && dst.p50 < dst.p95)) return imagen;
  if (!(src.p5 < src.p50 && src.p50 < src.p95)) return imagen;

  // Anclajes: el 0 y el 255 se fijan para no mover el fondo blanco ni el negro
  // absoluto, y entre medio se interpola linealmente entre los tres percentiles.
  const x = [0, src.p5, src.p50, src.p95, 255];
  const y = [0, dst.p5, dst.p50, dst.p95, 255];
  const tabla = new Uint8Array(256);
  for (let v = 0; v < 256; v++) {
    let k = 0;
    while (k < x.length - 2 && v > x[k + 1]!) k += 1;
    const t = (v - x[k]!) / Math.max(1, x[k + 1]! - x[k]!);
    tabla[v] = Math.max(0, Math.min(255, Math.round(y[k]! + t * (y[k + 1]! - y[k]!))));
  }

  const { data, info } = await sharp(imagen).raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i++) data[i] = tabla[data[i]!]!;
  const salida = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toBuffer();

  // Se verifica el resultado en vez de darlo por hecho.
  const log = percentiles(await tonosDelProducto(salida));
  console.log(
    `    tono: p5 ${src.p5}→${log.p5} · p50 ${src.p50}→${log.p50} · p95 ${src.p95}→${log.p95}` +
      `  (objetivo ${dst.p5}/${dst.p50}/${dst.p95})`,
  );
  return salida;
}

/**
 * Sombra de contacto sintética, como la que tienen las fotos del fabricante.
 *
 * Sin sombra el anteojo parece un sticker pegado sobre el blanco. Las fotos de
 * Rusty y Vulk tienen una sombra muy sutil bajo los apoyos, que es lo que le da
 * peso. No cambia nada del producto —forma, color, tamaño—, es puramente cómo
 * se presenta, igual que el fondo blanco.
 *
 * Se construye del propio alfa del recorte: se toma la franja de abajo, se
 * aplasta, se difumina y se estampa DEBAJO del producto. Así la sombra sigue la
 * silueta real y no es un óvalo genérico pegado.
 */
async function sombraDeContacto(
  producto: Buffer,
  ancho: number,
  alto: number,
): Promise<{ input: Buffer; left: number; top: number } | null> {
  const franja = Math.max(4, Math.round(alto * 0.12));
  const altoSombra = Math.max(3, Math.round(alto * 0.05));
  const desenfoque = Math.max(2, Math.round(alto * 0.018));

  const alfa = await sharp(producto)
    .ensureAlpha()
    .extractChannel('alpha')
    .extract({ left: 0, top: Math.max(0, alto - franja), width: ancho, height: franja })
    .resize(Math.round(ancho * 1.02), altoSombra, { fit: 'fill' })
    .blur(desenfoque)
    .raw()
    .toBuffer();

  const w = Math.round(ancho * 1.02);
  const rgba = Buffer.alloc(w * altoSombra * 4);
  const paso = Math.max(1, Math.round(alfa.length / (w * altoSombra)));
  let hay = false;
  for (let p = 0; p < w * altoSombra; p++) {
    const a = Math.round(alfa[p * paso]! * 0.2);
    if (a > 0) hay = true;
    rgba[p * 4] = 24;
    rgba[p * 4 + 1] = 22;
    rgba[p * 4 + 2] = 20;
    rgba[p * 4 + 3] = a;
  }
  if (!hay) return null;

  return {
    input: await sharp(rgba, { raw: { width: w, height: altoSombra, channels: 4 } }).png().toBuffer(),
    left: Math.round(-ancho * 0.01),
    top: alto - Math.round(altoSombra * 0.35),
  };
}

/** Compone el recorte sobre blanco puro, igual que `placaLimpia` de ml-placas.ts. */
async function componer(
  recorte: Recorte,
  destino: string,
  caja: { width: number; height: number },
  fill: number,
  p50Objetivo: number,
  conSombra: boolean,
): Promise<void> {
  // Cuánto hay que agrandar la foto para llenar el cuadro. Importa porque una
  // foto que ya venía comprimida por WhatsApp trae bloques de JPEG, y un enfoque
  // fuerte sobre un estiramiento grande resalta esos bloques en vez del producto.
  const estiramiento = (fill * caja.width) / recorte.width;
  const fuente =
    estiramiento > 2
      ? await sharp(recorte.buffer).median(3).png().toBuffer()
      : recorte.buffer;
  const fit = await encajar({ ...recorte, buffer: fuente }, caja, fill);
  // El redimensionado ablanda los bordes y sobre blanco puro eso se nota. Con
  // mucho estiramiento el enfoque va más suave, por lo mismo de arriba.
  const enfoque =
    estiramiento > 2
      ? { sigma: 1.2, m1: 0.25, m2: 0.15 }
      : { sigma: 0.8, m1: 0.5, m2: 0.4 };
  const nitido = await sharp(fit.buffer).sharpen(enfoque).png().toBuffer();

  const capas: sharp.OverlayOptions[] = [];
  if (conSombra) {
    const sombra = await sombraDeContacto(nitido, fit.width, fit.height);
    // Va PRIMERO para que el producto quede encima de su propia sombra.
    if (sombra) {
      capas.push({
        input: sombra.input,
        left: Math.max(0, fit.left + sombra.left),
        top: Math.min(caja.height - 1, fit.top + sombra.top),
      });
    }
  }
  capas.push({ input: nitido, left: fit.left, top: fit.top });

  const compuesto = await canvasBlanco(caja.width, caja.height)
    .composite(capas)
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toBuffer();
  const final = p50Objetivo > 0 ? await igualarTono(compuesto, p50Objetivo) : compuesto;
  await fs.writeFile(destino, final);
}

/** Grilla con todas las fotos limpias, para elegir cuál es perfil y cuál frente. */
async function hojaDeContacto(archivos: string[], destino: string): Promise<void> {
  if (archivos.length === 0) return;
  const celda = 500;
  const cols = Math.min(3, archivos.length);
  const filas = Math.ceil(archivos.length / cols);
  const miniaturas = await Promise.all(
    archivos.map(async (a, i) => ({
      input: await sharp(a).resize(celda, Math.round((celda * 2) / 3), { fit: 'contain', background: '#fff' }).toBuffer(),
      left: (i % cols) * celda,
      top: Math.floor(i / cols) * Math.round((celda * 2) / 3),
    })),
  );
  await canvasBlanco(cols * celda, filas * Math.round((celda * 2) / 3))
    .composite(miniaturas)
    .jpeg({ quality: 88 })
    .toFile(destino);
}

async function main(): Promise<void> {
  const dir = flag('dir');
  if (!dir) {
    console.error('Falta --dir. Uso:\n  pnpm foto:limpia --dir marketing/fotos/<modelo>');
    process.exit(1);
  }
  if (!(await rembgDisponible())) {
    console.error(
      'rembg no está disponible en esta máquina y es lo que hace el recorte.\n' +
        'Se esperaba el venv en /Users/juan/Proyectos web/shotpilot/rembg-test/venv/bin/python\n' +
        '(se puede apuntar a otro con la variable REMBG_PYTHON).',
    );
    process.exit(1);
  }

  const out = flag('out') ?? path.join(dir, 'limpias');
  const fill = Number(flag('fill') ?? FILL_DEFAULT);
  const solo = (flag('solo') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const blanquear = !process.argv.includes('--sin-blanquear');
  const modelo = flag('modelo') ?? 'isnet-general-use';
  const p50 = Number(flag('p50') ?? P50_DEFAULT);
  const conSombra = !process.argv.includes('--sin-sombra');
  process.env.REMBG_MODELO = modelo;

  const webDir = path.join(out, 'web');
  const mlDir = path.join(out, 'ml');
  await fs.mkdir(webDir, { recursive: true });
  await fs.mkdir(mlDir, { recursive: true });

  const todas = (await fs.readdir(dir))
    .filter((f) => /\.(jpe?g|png|heic|webp)$/i.test(f))
    .sort();
  const archivos = solo.length
    ? todas.filter((f) => solo.includes(path.parse(f).name))
    : todas;

  if (archivos.length === 0) {
    console.error(`No encontré fotos en ${dir}`);
    process.exit(1);
  }

  console.log(`\n${archivos.length} foto(s) en ${dir} · modelo ${modelo} · p50 ${p50}\n`);
  const hechas: string[] = [];

  for (const archivo of archivos) {
    const nombre = path.parse(archivo).name;
    console.log(`  ${archivo}`);
    try {
      const recorte = await recortarConFondo(path.join(dir, archivo), blanquear);
      console.log(`    recorte: ${recorte.width}×${recorte.height}`);
      const web = path.join(webDir, `${nombre}.jpg`);
      await componer(recorte, web, WEB, fill, p50, conSombra);
      await componer(recorte, path.join(mlDir, `${nombre}.jpg`), ML, fill, p50, conSombra);
      hechas.push(web);
      console.log('    ✓ web 2000×1333 + ml 1500×1500');
    } catch (err) {
      console.error(`    ✗ ${(err as Error).message}`);
    }
  }

  const contacto = path.join(out, 'contacto.jpg');
  await hojaDeContacto(hechas, contacto);

  console.log(`\nListo. ${hechas.length} de ${archivos.length}.`);
  console.log(`  ${out}`);
  console.log(`  Hoja de contacto: ${contacto}`);
}

main();
