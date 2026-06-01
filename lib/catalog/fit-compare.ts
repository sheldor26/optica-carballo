/**
 * Comparador de calce — "¿te va a quedar bien?".
 *
 * Compara el ancho frontal de este armazón contra el de unos anteojos que el
 * usuario YA usa y le calzan bien (referencia leída del grabado de la patilla,
 * ej. 52▢18-140 → calibre 52, puente 18).
 *
 * Métrica: ancho "boxing" = calibre×2 + puente (mm). Es la dimensión
 * comparable entre armazones distintos y la que el usuario puede leer del
 * grabado. NO se usa `frame_width_mm` para comparar porque rara vez está
 * grabado en los anteojos del usuario — sería comparar peras con manzanas.
 *
 * ORIENTATIVO (regla de negocio 4 — honestidad): el calce real también
 * depende de la curvatura del frente, el puente y el largo de patilla. Esto
 * estima el ancho frontal, que es el factor dominante pero no el único.
 */

export type FitReference = {
  /** Calibre del aro (ancho de cada lente), mm. */
  lensWidthMm: number;
  /** Ancho del puente, mm. */
  bridgeMm: number;
};

export type FitVerdict =
  | 'similar'
  | 'slightly_wider'
  | 'wider'
  | 'slightly_narrower'
  | 'narrower';

export type FitComparison = {
  /** Ancho boxing de la referencia del usuario, mm. */
  referenceWidthMm: number;
  /** Ancho boxing de este modelo, mm. */
  productWidthMm: number;
  /** product − reference (positivo = este modelo es más ancho). */
  diffMm: number;
  verdict: FitVerdict;
};

/** Diferencia (mm) hasta la cual consideramos el calce "muy parecido". */
const SIMILAR_THRESHOLD_MM = 3;
/** Diferencia (mm) hasta la cual es "un poco" más/menos; arriba = "notablemente". */
const SLIGHT_THRESHOLD_MM = 8;

/** Rangos plausibles para validar el input del usuario (mm). */
export const LENS_WIDTH_RANGE = { min: 40, max: 62 } as const;
export const BRIDGE_RANGE = { min: 12, max: 26 } as const;

function boxingWidth(lensWidthMm: number, bridgeMm: number): number {
  return lensWidthMm * 2 + bridgeMm;
}

/**
 * Extrae calibre + puente del JSONB `attributes.measurements`. Devuelve null
 * si falta alguno (este modelo no participa del comparador, sin romper).
 */
export function productFitReference(
  attributes: Record<string, unknown> | null | undefined,
): FitReference | null {
  const raw = attributes?.measurements;
  if (raw === null || typeof raw !== 'object') return null;
  const m = raw as Record<string, unknown>;
  const lens = m.lens_width_mm;
  const bridge = m.bridge_mm;
  if (typeof lens !== 'number' || !Number.isFinite(lens)) return null;
  if (typeof bridge !== 'number' || !Number.isFinite(bridge)) return null;
  return { lensWidthMm: lens, bridgeMm: bridge };
}

export function compareFit(
  reference: FitReference,
  product: FitReference,
): FitComparison {
  const referenceWidthMm = boxingWidth(reference.lensWidthMm, reference.bridgeMm);
  const productWidthMm = boxingWidth(product.lensWidthMm, product.bridgeMm);
  const diffMm = Math.round((productWidthMm - referenceWidthMm) * 10) / 10;
  const abs = Math.abs(diffMm);

  let verdict: FitVerdict;
  if (abs <= SIMILAR_THRESHOLD_MM) {
    verdict = 'similar';
  } else if (diffMm > 0) {
    verdict = abs <= SLIGHT_THRESHOLD_MM ? 'slightly_wider' : 'wider';
  } else {
    verdict = abs <= SLIGHT_THRESHOLD_MM ? 'slightly_narrower' : 'narrower';
  }

  return { referenceWidthMm, productWidthMm, diffMm, verdict };
}

export const FIT_VERDICT_LABELS: Record<FitVerdict, string> = {
  similar: 'Calce muy parecido a tus anteojos',
  slightly_wider: 'Un poco más holgado',
  wider: 'Notablemente más holgado',
  slightly_narrower: 'Un poco más ajustado',
  narrower: 'Notablemente más ajustado',
};

export type FitTone = 'good' | 'mild' | 'warn';

export const FIT_VERDICT_TONE: Record<FitVerdict, FitTone> = {
  similar: 'good',
  slightly_wider: 'mild',
  slightly_narrower: 'mild',
  wider: 'warn',
  narrower: 'warn',
};
