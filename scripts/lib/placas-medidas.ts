/**
 * Diagrama de medidas del armazón (placa técnica).
 *
 * Dibuja una silueta genérica de armazón + patilla con las cotas reales
 * del modelo. La silueta NO pretende ser el modelo exacto: es un esquema,
 * igual que las placas de medidas estándar del rubro.
 *
 * El dibujo se arma en un espacio "milimétrico" (1 unidad = 1 mm del
 * armazón real) y después se escala al canvas, así las proporciones entre
 * calibre / puente / ancho total son fieles a las medidas cargadas.
 */

import { NEGRO } from './placas-svg';

export type Medidas = {
  /** Calibre: ancho horizontal del lente (mm). */
  calibre: number;
  /** Puente: separación entre lentes (mm). */
  puente: number;
  /** Ancho total del frente, bisagra a bisagra (mm). */
  anchoTotal: number;
  /** Alto total del frente (mm). */
  alto: number;
  /** Largo de la patilla (mm). */
  patilla: number;
};

const BLANCO = '#FFFFFF';

/** Rectángulo con radio propio por esquina (sup-izq, sup-der, inf-der, inf-izq). */
function rectRadios(
  x: number,
  y: number,
  w: number,
  h: number,
  [rtl, rtr, rbr, rbl]: [number, number, number, number],
): string {
  return `M ${x + rtl} ${y}
    L ${x + w - rtr} ${y} Q ${x + w} ${y} ${x + w} ${y + rtr}
    L ${x + w} ${y + h - rbr} Q ${x + w} ${y + h} ${x + w - rbr} ${y + h}
    L ${x + rbl} ${y + h} Q ${x} ${y + h} ${x} ${y + h - rbl}
    L ${x} ${y + rtl} Q ${x} ${y} ${x + rtl} ${y} Z`;
}

function cotaHorizontal(
  x1: number,
  x2: number,
  y: number,
  etiqueta: string,
  px: number,
  grosor: number,
): string {
  const p = px * 0.5;
  return `
    <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${NEGRO}" stroke-width="${grosor}"/>
    <path d="M ${x1 + p} ${y - p * 0.55} L ${x1} ${y} L ${x1 + p} ${y + p * 0.55}" fill="none" stroke="${NEGRO}" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M ${x2 - p} ${y - p * 0.55} L ${x2} ${y} L ${x2 - p} ${y + p * 0.55}" fill="none" stroke="${NEGRO}" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="${(x1 + x2) / 2}" y="${y - px * 0.5}" font-family="Manrope" font-weight="700" font-size="${px}" letter-spacing="${px * 0.1}" fill="${NEGRO}" text-anchor="middle">${etiqueta}</text>`;
}

function cotaVertical(
  y1: number,
  y2: number,
  x: number,
  etiqueta: string,
  px: number,
  grosor: number,
): string {
  const p = px * 0.5;
  return `
    <line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${NEGRO}" stroke-width="${grosor}"/>
    <path d="M ${x - p * 0.55} ${y1 + p} L ${x} ${y1} L ${x + p * 0.55} ${y1 + p}" fill="none" stroke="${NEGRO}" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M ${x - p * 0.55} ${y2 - p} L ${x} ${y2} L ${x + p * 0.55} ${y2 - p}" fill="none" stroke="${NEGRO}" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="${x + px * 0.5}" y="${(y1 + y2) / 2 + px * 0.35}" font-family="Manrope" font-weight="700" font-size="${px}" letter-spacing="${px * 0.1}" fill="${NEGRO}" text-anchor="start">${etiqueta}</text>`;
}

/**
 * SVG completo del diagrama, dimensionado para el canvas destino
 * (soporta 1:1 para Mercado Libre y 3:2 para la ficha del sitio).
 */
export function svgMedidas(m: Medidas, ancho: number, alto: number): string {
  // --- Espacio milimétrico del frente ---------------------------------
  const W = m.anchoTotal;
  const H = m.alto;
  // Lo que sobra a los costados de (2 calibres + puente) es el material
  // del armazón + el saliente de las bisagras.
  const borde = Math.max(3, (W - m.calibre * 2 - m.puente) / 2);
  const cIzq = borde + m.calibre / 2;
  const cDer = W - cIzq;
  const medio = W / 2;
  const semiPuente = m.puente * 0.42;

  // --- Escala mm → px y reparto vertical --------------------------------
  // El bloque es: cota de ancho + frente + cota de puente + aire + cota de
  // patilla + patilla. Se calcula en vez de usar fracciones fijas para que
  // el mismo dibujo entre igual en 1:1 (Mercado Libre) y en 3:2 (sitio).
  const pxCota = Math.round(ancho * 0.031);
  const grosorCota = Math.max(2, ancho * 0.0022);
  const altoCota = pxCota * 1.9;
  const aire = alto * 0.115;

  let escala = (ancho * 0.62) / W;
  // La patilla dibujada ocupa ~77% de su caja (el codo baja, el resto no).
  const altoBloque = (e: number) => altoCota * 3 + H * e + aire + H * 0.46 * 0.77 * e;
  if (altoBloque(escala) > alto * 0.9) {
    escala *= (alto * 0.9) / altoBloque(escala);
  }

  const px = (v: number) => v * escala;
  const frenteAncho = px(W);
  const patillaAncho = px(m.patilla);
  const patillaAlto = px(H * 0.46);

  const y0 = (alto - altoBloque(escala)) / 2;
  const yCotaAncho = y0 + altoCota * 0.8;
  const offsetY = y0 + altoCota;
  const yCotaPuente = offsetY + px(H) + altoCota * 0.85;
  const yCotaPatilla = yCotaPuente + aire;
  const patillaY = yCotaPatilla + altoCota * 0.6;

  const offsetX = (ancho - frenteAncho) / 2;
  const patillaX = (ancho - patillaAncho) / 2;

  const X = (mmX: number) => offsetX + px(mmX);
  const Y = (mmY: number) => offsetY + px(mmY);

  // --- Silueta del frente ---------------------------------------------
  // Barra superior + un aro por lente + puente en arco. Los lentes se
  // pintan del color del fondo encima del negro, así el marco queda de
  // grosor uniforme.
  const marco = Math.max(2.2, H * 0.075);
  const lenteY = H * 0.125;
  const lenteAlto = H * 0.72;
  const rTop = px(Math.min(lenteAlto, m.calibre) * 0.2);
  const rBot = px(Math.min(lenteAlto, m.calibre) * 0.32);
  const rTopExt = rTop + px(marco * 0.8);
  const rBotExt = rBot + px(marco * 0.8);

  const aro = (xMm: number) =>
    `<path d="${rectRadios(
      X(xMm - marco),
      Y(lenteY - marco),
      px(m.calibre + marco * 2),
      px(lenteAlto + marco * 2),
      [rTopExt, rTopExt, rBotExt, rBotExt],
    )}" fill="${NEGRO}"/>`;

  const barraAlto = lenteY + marco * 0.15;
  const lateralAlto = H * 0.42;
  const rEsq = px(H * 0.1);

  const cuerpo = `
    <path d="${rectRadios(X(0), Y(0), frenteAncho, px(barraAlto), [rEsq, rEsq, 0, 0])}" fill="${NEGRO}"/>
    <path d="${rectRadios(X(0), Y(0), px(borde * 0.82), px(lateralAlto), [rEsq, 0, px(H * 0.1), px(H * 0.1)])}" fill="${NEGRO}"/>
    <path d="${rectRadios(X(W - borde * 0.82), Y(0), px(borde * 0.82), px(lateralAlto), [0, rEsq, px(H * 0.1), px(H * 0.1)])}" fill="${NEGRO}"/>
    ${aro(borde)}
    ${aro(borde + m.calibre + m.puente)}
    <path d="M ${X(borde + m.calibre)} ${Y(lenteY - marco)}
      L ${X(borde + m.calibre + m.puente)} ${Y(lenteY - marco)}
      L ${X(borde + m.calibre + m.puente)} ${Y(H * 0.5)}
      C ${X(medio + semiPuente * 0.5)} ${Y(H * 0.1)} ${X(medio - semiPuente * 0.5)} ${Y(H * 0.1)} ${X(borde + m.calibre)} ${Y(H * 0.5)} Z" fill="${NEGRO}"/>`;

  // --- Lentes (se pintan del color del fondo) --------------------------
  const lentes = `
    <path d="${rectRadios(X(borde), Y(lenteY), px(m.calibre), px(lenteAlto), [rTop, rTop, rBot, rBot])}" fill="${BLANCO}"/>
    <path d="${rectRadios(X(borde + m.calibre + m.puente), Y(lenteY), px(m.calibre), px(lenteAlto), [rTop, rTop, rBot, rBot])}" fill="${BLANCO}"/>`;

  const tornillos = `
    <ellipse cx="${X(borde * 0.45)}" cy="${Y(H * 0.16)}" rx="${px(H * 0.05)}" ry="${px(H * 0.026)}" fill="${BLANCO}"/>
    <ellipse cx="${X(W - borde * 0.45)}" cy="${Y(H * 0.16)}" rx="${px(H * 0.05)}" ry="${px(H * 0.026)}" fill="${BLANCO}"/>`;

  // --- Patilla: línea de grosor uniforme con el codo curvo -------------
  // Se dibuja como trazo (no como contorno) para que el codo salga suave.
  const pa = patillaAncho;
  const ph = patillaAlto;
  const grosorPatilla = ph * 0.3;
  const patilla = `
    <path d="M ${patillaX + grosorPatilla / 2} ${patillaY}
      L ${patillaX + pa * 0.6} ${patillaY}
      C ${patillaX + pa * 0.86} ${patillaY} ${patillaX + pa * 0.92} ${patillaY + ph * 0.2} ${patillaX + pa - grosorPatilla * 0.6} ${patillaY + ph * 0.62}"
      fill="none" stroke="${NEGRO}" stroke-width="${grosorPatilla}" stroke-linecap="round"/>`;

  const cotas = `
    ${cotaHorizontal(X(0), X(W), yCotaAncho, `${m.anchoTotal}mm`, pxCota, grosorCota)}
    ${cotaHorizontal(X(borde), X(borde + m.calibre), Y(H * 0.45), `${m.calibre}mm`, pxCota, grosorCota)}
    ${cotaHorizontal(X(borde + m.calibre), X(borde + m.calibre + m.puente), yCotaPuente, `${m.puente}mm`, pxCota, grosorCota)}
    ${cotaVertical(Y(0), Y(H), X(W) + ancho * 0.04, `${m.alto}mm`, pxCota, grosorCota)}
    ${cotaHorizontal(patillaX, patillaX + pa, yCotaPatilla, `${m.patilla}mm`, pxCota, grosorCota)}`;

  return `${cuerpo}${lentes}${tornillos}${patilla}${cotas}`;
}
