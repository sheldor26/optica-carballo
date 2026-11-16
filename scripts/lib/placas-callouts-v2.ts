/**
 * Placa de callouts "v2": ESTILO POR DEFECTO desde 2026-11-16 (decisión del
 * founder, tras compararla con la clásica en The Phone).
 *
 * Por qué: a 375 px de ancho (la galería de ML en el celular) los subtítulos de
 * la placa clásica miden 4-5 px y no se leen, las flechas largas cruzaban el
 * lente y los cuatro carteles pesaban igual.
 *
 *   - Un solo texto corto y GRANDE por cartel.
 *   - El 2º cartel (arriba a la derecha) es el PROTAGONISTA: más grande y en el
 *     celeste de acento. Ahí va el beneficio principal (`--c2`).
 *   - Líneas rectas cortas con un punto en la punta, en vez de flechas curvas.
 *   - Degradé muy suave de fondo y sombra bajo el producto; el producto se
 *     compone con `multiply` para que el blanco de la foto desaparezca.
 *
 * Orden de los 4 carteles: arriba-izq, arriba-der (protagonista), abajo-izq,
 * abajo-der. `fx,fy` es dónde apunta cada uno, en fracción del armazón.
 */
import sharp from 'sharp';

import { encajar, type Recorte } from './placas-frame';
import { anchoTexto, AZUL, BLANCO, escaparXml } from './placas-svg';

const W = 1500;
const ACENTO_HERO = '#2A7DE1';
const MARGEN = 70;

export type ItemCalloutV2 = { texto: string; fx: number; fy: number };

type Pill = { x: number; y: number; w: number; h: number; px: number; hero: boolean };

function medirPill(texto: string, hero: boolean, maxAncho: number): { w: number; h: number; px: number } {
  let px = hero ? 76 : 56;
  const pad = hero ? 56 : 46;
  while (px > 30 && anchoTexto(texto, px, 'archivo', 1) + pad * 2 > maxAncho) px -= 2;
  return { w: Math.round(anchoTexto(texto, px, 'archivo', 1) * 0.92 + pad * 2), h: hero ? 150 : 122, px };
}

/**
 * Texto de un cartel a partir del par título/subtítulo de la placa clásica:
 * el título solo; si el subtítulo es corto (≤ 12 caracteres) se suma con " · ".
 * Los subtítulos largos se descartan porque no se leen en el celular.
 */
export function textoCalloutV2(titulo: string, subtitulo?: string): string {
  const t = titulo.trim().toUpperCase();
  const s = (subtitulo ?? '').trim().toUpperCase();
  return s && s.length <= 12 ? `${t} · ${s}` : t;
}

export async function placaCalloutsV2(
  recorte: Recorte,
  items: ItemCalloutV2[],
  destino: string,
): Promise<void> {
  if (items.length !== 4) throw new Error('La placa de callouts v2 necesita exactamente 4 ítems.');

  // Zona del producto: entre la fila de carteles de arriba y la de abajo.
  const zonaTop = 270;
  const zonaAlto = 880;
  const fit = await encajar(recorte, { width: W - 2 * 60, height: zonaAlto }, 1);
  const left = fit.left + 60;
  const top = fit.top + zonaTop;

  const maxAncho = W / 2 - MARGEN - 20;
  const medidas = items.map((it, i) => medirPill(it.texto, i === 1, maxAncho));
  const yArriba = 100;
  const yAbajo = 1170;
  const pills: Pill[] = [
    { x: MARGEN, y: yArriba + (150 - medidas[0]!.h) / 2, ...medidas[0]!, hero: false },
    { x: W - MARGEN - medidas[1]!.w, y: yArriba, ...medidas[1]!, hero: true },
    { x: MARGEN, y: yAbajo, ...medidas[2]!, hero: false },
    { x: W - MARGEN - medidas[3]!.w, y: yAbajo, ...medidas[3]!, hero: false },
  ];

  const objetivo = (it: ItemCalloutV2) => ({ x: left + fit.width * it.fx, y: top + fit.height * it.fy });

  const sombraY = top + fit.height * 0.97;
  const fondo = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#F8FAFD"/><stop offset="1" stop-color="#E2E9F3"/>
        </linearGradient>
        <filter id="b" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="24"/></filter>
      </defs>
      <rect width="${W}" height="${W}" fill="url(#g)"/>
      <ellipse cx="${left + fit.width / 2}" cy="${sombraY}" rx="${fit.width * 0.40}" ry="26" fill="${AZUL}" opacity="0.20" filter="url(#b)"/>
    </svg>`;

  const partes: string[] = [];
  pills.forEach((p, i) => {
    const t = objetivo(items[i]!);
    const desdeX = p.x + p.w / 2;
    const desdeY = i < 2 ? p.y + p.h : p.y;
    partes.push(
      `<line x1="${desdeX}" y1="${desdeY}" x2="${t.x}" y2="${t.y}" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round"/>`,
      `<line x1="${desdeX}" y1="${desdeY}" x2="${t.x}" y2="${t.y}" stroke="${AZUL}" stroke-width="5" stroke-linecap="round"/>`,
      `<circle cx="${t.x}" cy="${t.y}" r="17" fill="#FFFFFF" stroke="${AZUL}" stroke-width="5"/>`,
      `<circle cx="${t.x}" cy="${t.y}" r="6" fill="${p.hero ? ACENTO_HERO : AZUL}"/>`,
    );
  });
  pills.forEach((p, i) => {
    partes.push(
      `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="${p.h / 2}" fill="${p.hero ? ACENTO_HERO : AZUL}"/>`,
      `<text x="${p.x + p.w / 2}" y="${p.y + p.h / 2 + p.px * 0.35}" text-anchor="middle" font-family="Archivo Black" font-size="${p.px}" letter-spacing="1" fill="${BLANCO}">${escaparXml(items[i]!.texto)}</text>`,
    );
  });
  const capaTexto = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">${partes.join('')}</svg>`;

  const nitido = await sharp(fit.buffer).sharpen({ sigma: 0.8, m1: 0.5, m2: 0.4 }).png().toBuffer();
  await sharp(Buffer.from(fondo))
    .composite([
      { input: nitido, left, top, blend: 'multiply' },
      { input: Buffer.from(capaTexto), left: 0, top: 0 },
    ])
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toFile(destino);
}
