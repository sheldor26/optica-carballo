/**
 * Física del Simulador de Visión — óptica geométrica de primer orden.
 *
 * Modelo validado por optical-expert (2026-06-11):
 * - Receta esfero-cilíndrica (cilindro NEGATIVO, notación argentina, eje TABO).
 *   Meridianos principales: P1 = S (en el meridiano del eje), P2 = S + C
 *   (perpendicular). El smear retiniano de cada componente es A LO LARGO del
 *   meridiano que tiene el error → σ paralela al eje ∝ |E1|, perpendicular ∝ |E2|.
 * - Acomodación unificada: el ojo acomoda para llevar el círculo de menor
 *   confusión a retina → A* = clamp(SE + D, 0, U), con SE = S + C/2 y
 *   D = demanda de la escena (lejos 0.00, cerca 40cm = +2.50).
 * - Zona muerta por profundidad de foco: ±0.25 D no produce blur percibido.
 * - Binocular: la experiencia subjetiva la domina el MEJOR ojo (sumación
 *   binocular) — nunca el peor ni el promedio.
 *
 * Todo corre client-side: la receta no sale del navegador.
 */

export type AgeBand = 'unknown' | 'lt40' | '40to49' | '50to59' | '60plus';

export type EyeRx = {
  /** Esfera en dioptrías (negativa = miopía, positiva = hipermetropía). */
  sphere: number;
  /** Cilindro en dioptrías, notación negativa (0 = sin astigmatismo). */
  cylinder: number;
  /** Eje TABO en grados, 0–180. */
  axis: number;
};

export type EyeBlur = {
  /** Error residual EFECTIVO (D) en el meridiano del eje (ya sin zona muerta). */
  e1: number;
  /** Error residual efectivo (D) en el meridiano perpendicular al eje. */
  e2: number;
  /** Acomodación aplicada A* (D). */
  accommodated: number;
  /** Magnitud global de blur: B = √(e1² + e2²). */
  total: number;
};

/** Profundidad de foco tolerada sin blur percibido (D). */
const DEPTH_OF_FOCUS_D = 0.25;

/** Demanda acomodativa de visión de cerca a ~40 cm (D). */
export const NEAR_DEMAND_D = 2.5;

/**
 * Acomodación sostenible por banda etaria SIN dato de ADD.
 * Hofstetter promedio (18.5 − 0.3·edad), mitad sostenible, edad media de banda.
 */
const AGE_ACCOMMODATION: Record<AgeBand, number> = {
  unknown: 2.5,
  lt40: 2.5,
  '40to49': 2.0,
  '50to59': 1.0,
  '60plus': 0.25,
};

/**
 * Acomodación utilizable U. Prioridad: si hay ADD en la receta, la ADD codifica
 * lo que le falta al ojo para la demanda de cerca (U = 2.50 − ADD). Sin ADD,
 * estimamos por edad. Sin edad, asumimos no présbita.
 */
export function usableAccommodation(add: number, ageBand: AgeBand): number {
  if (add > 0) return Math.max(0, NEAR_DEMAND_D - add);
  return AGE_ACCOMMODATION[ageBand];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function effectiveError(raw: number): number {
  return Math.max(0, Math.abs(raw) - DEPTH_OF_FOCUS_D);
}

/**
 * Blur residual de un ojo SIN corrección frente a una escena con demanda D.
 */
export function computeEyeBlur(rx: EyeRx, demand: number, usable: number): EyeBlur {
  const sphericalEquivalent = rx.sphere + rx.cylinder / 2;
  const accommodated = clamp(sphericalEquivalent + demand, 0, usable);
  const e1 = effectiveError(rx.sphere + demand - accommodated);
  const e2 = effectiveError(rx.sphere + rx.cylinder + demand - accommodated);
  return { e1, e2, accommodated, total: Math.hypot(e1, e2) };
}

/**
 * Vista binocular: el mejor ojo domina. Devuelve cuál y su blur.
 */
export function binocularView(
  od: EyeBlur,
  oi: EyeBlur,
): { eye: 'OD' | 'OI'; blur: EyeBlur } {
  return od.total <= oi.total ? { eye: 'OD', blur: od } : { eye: 'OI', blur: oi };
}

/**
 * El hipermétrope joven compensa acomodando en visión de LEJOS: ve nítido pero
 * con esfuerzo sostenido (fatiga, dolor de cabeza). Detectarlo para mostrar la
 * nota honesta en vez de atenuar en silencio.
 */
export function isCompensatingHyperope(
  rx: EyeRx,
  blur: EyeBlur,
  demand: number,
): boolean {
  return demand === 0 && rx.sphere > 0 && blur.accommodated > 0.25 && blur.total < 0.01;
}

export function formatDiopters(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${Math.abs(value).toFixed(2)}`;
}
