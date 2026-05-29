import { z } from 'zod';

/**
 * Schema del response del modelo Vision al leer una receta argentina.
 * Source of truth técnica: optical-expert (estructura típica de receta AR +
 * rangos plausibles + umbrales presencial).
 *
 * Convenciones argentinas hardcoded:
 * - Cilindro SIEMPRE negativo (si modelo devuelve positivo, validation
 *   server-side falla → backend hace transposición o flagea).
 * - Esfera con signo explícito (+/-).
 * - Eje en grados enteros 1-180 (no 0).
 * - DNP en mm, paso 0.5 o entero.
 * - ADD positiva.
 */

export const EyeMeasurementSchema = z.object({
  /** Esfera. -25.00 a +25.00. Paso 0.25. null = ojo no detectado o "plano". */
  esf: z.number().min(-25).max(25).nullable(),
  /** Cilindro. -8.00 a 0.00. SIEMPRE negativo en AR. null = sin astigmatismo. */
  cil: z.number().min(-8).max(0).nullable(),
  /** Eje en grados. 1-180. null si no hay cilindro. */
  eje: z.number().int().min(1).max(180).nullable(),
  /** Adición. +0.75 a +3.50. null = sin adición (monofocal). */
  add: z.number().min(0.75).max(3.5).nullable(),
  /** Confidence por campo: high (>0.85), medium (0.6-0.85), low (<0.6). */
  confidence: z.enum(['high', 'medium', 'low']),
});
export type EyeMeasurement = z.infer<typeof EyeMeasurementSchema>;

export const WARNING_FLAGS = [
  'expired_date',
  'low_resolution',
  'handwritten_unclear',
  'partial_data',
  'no_signature',
  'no_matricula',
  'multiple_pages_ignored',
  'suspicious_content',
] as const;
export type WarningFlag = (typeof WARNING_FLAGS)[number];

export const PRESCRIPTION_TYPES = [
  'monofocal',
  'bifocal',
  'multifocal',
  'contact_lens',
  'unknown',
] as const;
export type PrescriptionType = (typeof PRESCRIPTION_TYPES)[number];

export const PrescriptionAnalysisSchema = z.object({
  /** Primer gate: si el modelo detectó que es una receta oftalmológica válida. */
  isPrescription: z.boolean(),
  /** Tipo detectado. Define routing presencial vs online. */
  prescriptionType: z.enum(PRESCRIPTION_TYPES),
  od: EyeMeasurementSchema,
  oi: EyeMeasurementSchema,
  /** DNP total en mm. 48-76. Por ojo: 24-38. null = no presente. */
  dnp: z.number().min(40).max(80).nullable(),
  /** Fecha de emisión ISO 8601 si el modelo la lee. null si no. */
  expirationDate: z.string().nullable(),
  /** Excerpt de texto crudo de la receta — debug + handoff a WhatsApp. */
  rawTextExcerpt: z.string().max(500).default(''),
  warningFlags: z.array(z.enum(WARNING_FLAGS)),
});
export type PrescriptionAnalysis = z.infer<typeof PrescriptionAnalysisSchema>;

/**
 * Umbrales operativos que disparan handoff a WhatsApp (atención presencial).
 * Fuente: optical-expert.
 */
export const IN_PERSON_THRESHOLDS = {
  /** |ESF| > 6.00 en cualquier ojo. */
  MAX_ABS_ESF: 6.0,
  /** |CIL| > 2.00 en cualquier ojo. */
  MAX_ABS_CIL: 2.0,
  /** |ESF| + |CIL| > 7.00 en cualquier ojo. */
  MAX_ABS_SUM: 7.0,
  /** Anisometropía: |ESF OD - ESF OI| ≥ 2.00. */
  MAX_ANISOMETROPIA: 2.0,
} as const;

/** Vigencia de receta en días. 365 = 1 año (anteojos). 180 para contactología. */
export const PRESCRIPTION_VALIDITY_DAYS = 365;

export type InPersonReason =
  | 'high_esf'
  | 'high_cil'
  | 'high_sum'
  | 'anisometropia'
  | 'has_add'
  | 'contact_lens';

/**
 * Evalúa si la receta requiere atención presencial.
 * Lógica pura — no depende de DB ni APIs.
 */
export function evaluateInPerson(
  data: PrescriptionAnalysis,
): InPersonReason[] {
  const reasons: InPersonReason[] = [];

  if (data.prescriptionType === 'contact_lens') {
    reasons.push('contact_lens');
    return reasons;
  }

  if (data.od.add !== null || data.oi.add !== null) {
    reasons.push('has_add');
  }

  const odEsf = data.od.esf ?? 0;
  const oiEsf = data.oi.esf ?? 0;
  const odCil = data.od.cil ?? 0;
  const oiCil = data.oi.cil ?? 0;

  if (
    Math.abs(odEsf) > IN_PERSON_THRESHOLDS.MAX_ABS_ESF ||
    Math.abs(oiEsf) > IN_PERSON_THRESHOLDS.MAX_ABS_ESF
  ) {
    reasons.push('high_esf');
  }

  if (
    Math.abs(odCil) > IN_PERSON_THRESHOLDS.MAX_ABS_CIL ||
    Math.abs(oiCil) > IN_PERSON_THRESHOLDS.MAX_ABS_CIL
  ) {
    reasons.push('high_cil');
  }

  if (
    Math.abs(odEsf) + Math.abs(odCil) > IN_PERSON_THRESHOLDS.MAX_ABS_SUM ||
    Math.abs(oiEsf) + Math.abs(oiCil) > IN_PERSON_THRESHOLDS.MAX_ABS_SUM
  ) {
    reasons.push('high_sum');
  }

  if (
    Math.abs(odEsf - oiEsf) >= IN_PERSON_THRESHOLDS.MAX_ANISOMETROPIA
  ) {
    reasons.push('anisometropia');
  }

  return reasons;
}

/** Evalúa si la receta está vencida según fecha de emisión. */
export function isExpired(expirationDate: string | null): boolean {
  if (!expirationDate) return false;
  const issued = new Date(expirationDate);
  if (Number.isNaN(issued.getTime())) return false;
  const daysSince = (Date.now() - issued.getTime()) / (1000 * 60 * 60 * 24);
  return daysSince > PRESCRIPTION_VALIDITY_DAYS;
}
