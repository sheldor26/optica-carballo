/**
 * Primitivas de dibujo para las placas: tipografía, burbujas de callout,
 * flechas curvas y el diagrama de medidas.
 *
 * Todo se resuelve con SVG que después `sharp` rasteriza. No hay medición
 * real de texto (librsvg no la expone), así que el ancho se estima con un
 * factor por familia tipográfica — calibrado a ojo contra el render.
 */

export const AMARILLO = '#FFD400';
export const NEGRO = '#111111';
/** Azul de Óptica Carballo: el color de la marca, el mismo del isotipo. */
export const AZUL = '#12294B';
export const BLANCO = '#FFFFFF';

/**
 * Color de acento del set de placas. La óptica es azul y blanco, así que
 * las burbujas, las bandas y los fondos de color usan el azul de marca.
 * Cambiar estas dos constantes repinta el set entero.
 */
export const ACENTO = AZUL;
export const ACENTO_TEXTO = BLANCO;
// Verde oscurecido: sobre blanco pasa de 3.3:1 a 5.1:1 de contraste.
export const VERDE = '#157F38';

/** Ancho aproximado de un texto en px. Sobreestima un poco a propósito. */
export function anchoTexto(
  texto: string,
  fontSize: number,
  familia: 'archivo' | 'anton' | 'manrope',
  tracking = 0,
): number {
  const factor = familia === 'archivo' ? 0.72 : familia === 'anton' ? 0.45 : 0.6;
  return texto.length * (fontSize * factor + tracking);
}

/**
 * Tamaño de fuente más grande que hace entrar `texto` en `anchoDisponible`,
 * con tope en `maxPx`. Evita que un callout largo se salga de la placa.
 */
export function fontQueEntra(
  texto: string,
  anchoDisponible: number,
  familia: 'archivo' | 'anton' | 'manrope',
  trackingRatio: number,
  maxPx: number,
): number {
  if (texto.length === 0) return maxPx;
  const factor = familia === 'archivo' ? 0.72 : familia === 'anton' ? 0.45 : 0.6;
  const px = anchoDisponible / (texto.length * (factor + trackingRatio));
  return Math.floor(Math.min(maxPx, px));
}

export function escaparXml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export type Burbuja = {
  titulo: string;
  subtitulo?: string;
  /** Esquina donde se ancla la burbuja. */
  esquina: 'tl' | 'tr' | 'bl' | 'br';
  /** Punto (x, y absolutos del canvas) al que apunta la flecha. */
  target: { x: number; y: number };
};

type CajaBurbuja = { x: number; y: number; w: number; h: number };

/**
 * Calcula la caja de la burbuja según su esquina, y devuelve el SVG de la
 * burbuja + la flecha curva que la conecta con el target.
 */
export function burbujaConFlecha(
  b: Burbuja,
  canvas: number,
  opciones: { margen?: number; tituloPx?: number; subPx?: number } = {},
): string {
  const margen = opciones.margen ?? Math.round(canvas * 0.055);
  // Dos burbujas por fila: cada una no puede pasar de la mitad del ancho
  // libre, así siempre queda un canal de aire entre las de la misma fila.
  // Si el texto es largo baja el cuerpo tipográfico en vez de desbordarse.
  // El tope se aplica al TEXTO, así que hay que descontarle el padding
  // horizontal de la burbuja o el recuadro termina invadiendo al vecino.
  const anchoMax = (canvas - margen * 3) / 2 - canvas * 0.055;
  const tituloPx = Math.min(
    opciones.tituloPx ?? Math.round(canvas * 0.036),
    fontQueEntra(b.titulo, anchoMax, 'archivo', 0.08, canvas),
  );
  const subPx = Math.min(
    opciones.subPx ?? Math.round(canvas * 0.024),
    b.subtitulo ? fontQueEntra(b.subtitulo, anchoMax, 'archivo', 0.08, canvas) : canvas,
  );
  // Tracking chico: a estos cuerpos, separar las letras sólo resta legibilidad.
  const trackingTitulo = tituloPx * 0.08;
  const trackingSub = subPx * 0.08;

  const padX = Math.round(tituloPx * 0.75);
  const padY = Math.round(tituloPx * 0.45);
  const anchoTitulo = anchoTexto(b.titulo, tituloPx, 'archivo', trackingTitulo);
  const anchoSub = b.subtitulo ? anchoTexto(b.subtitulo, subPx, 'archivo', trackingSub) : 0;
  const w = Math.round(Math.max(anchoTitulo, anchoSub) + padX * 2);
  // El alto reserva siempre la ranura del subtítulo, tenga o no: así las dos
  // burbujas de una fila miden lo mismo y el set se lee como un sistema.
  const h = Math.round(tituloPx * 1.12 + subPx * 1.7 + padY * 2);

  const izq = b.esquina === 'tl' || b.esquina === 'bl';
  const arriba = b.esquina === 'tl' || b.esquina === 'tr';

  const caja: CajaBurbuja = {
    x: izq ? margen : canvas - margen - w,
    y: arriba ? margen + Math.round(canvas * 0.05) : canvas - margen - h - Math.round(canvas * 0.03),
    w,
    h,
  };

  const cx = caja.x + caja.w / 2;
  const baseTitulo = b.subtitulo
    ? caja.y + padY + tituloPx * 0.86
    : caja.y + caja.h / 2 + tituloPx * 0.36;
  const baseSub = baseTitulo + subPx * 1.55;

  const texto = `
    <text x="${cx}" y="${baseTitulo}" font-family="Archivo Black" font-size="${tituloPx}"
      letter-spacing="${trackingTitulo}" fill="${ACENTO_TEXTO}" text-anchor="middle">${escaparXml(b.titulo.toUpperCase())}</text>
    ${
      b.subtitulo
        ? `<text x="${cx}" y="${baseSub}" font-family="Archivo Black" font-size="${subPx}"
      letter-spacing="${trackingSub}" fill="${ACENTO_TEXTO}" text-anchor="middle">${escaparXml(b.subtitulo.toUpperCase())}</text>`
        : ''
    }`;

  return `
  <g>
    <rect x="${caja.x}" y="${caja.y}" width="${caja.w}" height="${caja.h}" rx="${Math.round(h * 0.42)}" fill="${ACENTO}"/>
    ${texto}
    ${flechaCurva(caja, b.target, arriba, izq, canvas)}
  </g>`;
}

/**
 * Flecha manuscrita: sale del borde de la burbuja que mira al destino y
 * curva hasta él.
 *
 * El punto de salida no es fijo: se calcula intersecando la recta
 * burbuja→destino con el rectángulo de la burbuja. Así una flecha que va
 * hacia abajo sale por abajo, y una que cruza en diagonal sale por el
 * costado, en vez de nacer siempre del mismo borde y tener que rodear.
 */
function flechaCurva(
  caja: CajaBurbuja,
  target: { x: number; y: number },
  arriba: boolean,
  izq: boolean,
  canvas: number,
): string {
  const grosor = Math.max(6, Math.round(canvas * 0.0075));
  const inicio = salidaDeCaja(caja, target, grosor);

  const dx = target.x - inicio.x;
  const dy = target.y - inicio.y;
  const largo = Math.hypot(dx, dy);

  // Curvatura proporcional al recorrido y perpendicular a la dirección:
  // da el arco de marcador sin que la flecha se aleje del destino.
  const curva = Math.min(largo * 0.22, canvas * 0.11);
  const signo = izq ? 1 : -1;
  const nx = -(dy / (largo || 1));
  const ny = dx / (largo || 1);
  const control = {
    x: inicio.x + dx * 0.5 + nx * curva * signo,
    y: inicio.y + dy * 0.5 + ny * curva * signo,
  };

  const punta = puntaFlecha(control, target, canvas);

  return `
    <path d="M ${inicio.x.toFixed(1)} ${inicio.y.toFixed(1)} Q ${control.x.toFixed(1)} ${control.y.toFixed(1)} ${target.x.toFixed(1)} ${target.y.toFixed(1)}"
      fill="none" stroke="${ACENTO}" stroke-width="${grosor}" stroke-linecap="round"/>
    ${punta}`;
}

/** Punto donde la recta centro→destino sale del rectángulo de la burbuja. */
function salidaDeCaja(
  caja: CajaBurbuja,
  destino: { x: number; y: number },
  margen: number,
): { x: number; y: number } {
  const cx = caja.x + caja.w / 2;
  const cy = caja.y + caja.h / 2;
  const dx = destino.x - cx;
  const dy = destino.y - cy;

  if (dx === 0 && dy === 0) return { x: cx, y: caja.y + caja.h + margen };

  // Cuánto hay que avanzar sobre la recta para tocar cada borde; gana el menor.
  const hx = caja.w / 2 + margen;
  const hy = caja.h / 2 + margen;
  const tX = dx === 0 ? Infinity : hx / Math.abs(dx);
  const tY = dy === 0 ? Infinity : hy / Math.abs(dy);
  const t = Math.min(tX, tY);

  return { x: cx + dx * t, y: cy + dy * t };
}

function puntaFlecha(
  desde: { x: number; y: number },
  hasta: { x: number; y: number },
  canvas: number,
): string {
  const largo = Math.round(canvas * 0.032);
  const grosor = Math.max(6, Math.round(canvas * 0.0075));
  const ang = Math.atan2(hasta.y - desde.y, hasta.x - desde.x);
  const abertura = 0.42;

  const p1 = {
    x: hasta.x - largo * Math.cos(ang - abertura),
    y: hasta.y - largo * Math.sin(ang - abertura),
  };
  const p2 = {
    x: hasta.x - largo * Math.cos(ang + abertura),
    y: hasta.y - largo * Math.sin(ang + abertura),
  };

  return `<path d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L ${hasta.x.toFixed(1)} ${hasta.y.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}"
    fill="none" stroke="${ACENTO}" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
