import { z } from 'zod';

/**
 * Schemas del medidor de DNP (Distancia Naso-Pupilar / IPD).
 *
 * Approach: IA con Vision (Claude Sonnet 4.6) detecta features (coords de
 * pupilas, centro nasal, ancho tarjeta) y devuelve TODO en pixels. El
 * backend calcula la DNP en mm con regla de tres usando el ancho ISO/IEC
 * 7810 de tarjeta de crédito (85.6mm). Separation of concerns:
 *   - IA = visión (qué hay en la imagen).
 *   - Backend = aritmética (cálculos predecibles, testeables).
 *
 * Source of truth técnica: optical-expert (consultado 2026-05-30).
 */

/** ISO/IEC 7810 ID-1: ancho exacto de tarjeta de crédito. */
export const CARD_ISO_WIDTH_MM = 85.6;

/**
 * Modos de medición:
 * - 'simple': tarjeta en la frente, sujeta con 2 dedos, distancia 40-60cm.
 *   Approach industry-standard (probado en producción a escala mundial). Más
 *   fácil para el usuario. Precisión menor (paralaje ~2-3% sin compensar)
 *   pero suficiente para monofocales orientativos. La regente ajusta al armar.
 * - 'precise': tarjeta apoyada en pómulos, alineada con base de nariz,
 *   distancia 60-80cm. Geometría óptima (mismo plano que pupilas). Mejor
 *   precisión pero más difícil de hacer correctamente.
 *
 * Founder eligió ofrecer ambos. Default UI: 'simple'.
 */
export const PD_MEASURE_MODES = ['simple', 'precise'] as const;
export type PDMeasureMode = (typeof PD_MEASURE_MODES)[number];

export const pdMeasureModeSchema = z.enum(PD_MEASURE_MODES);

/**
 * Rangos de plausibilidad de DNP (mm) validados por optical-expert.
 * - Hard reject: probable error de detección, no procesar.
 * - Soft warning: posible pero raro, mostrar advertencia.
 */
export const DNP_RANGES = {
  HARD_MIN: 50,
  HARD_MAX: 78,
  SOFT_MIN: 54,
  SOFT_MAX: 74,
} as const;

/** Edad mínima — DNP infantil cambia 1-2mm/año, no es estable para fabricar. */
export const MIN_AGE_YEARS = 16;

/** Precisión por tipo de lente (qué tipos podemos vender con esta DNP). */
export const PRESCRIPTION_TYPES_ALLOWED = ['monofocal'] as const;
export type PrescriptionTypeAllowed = (typeof PRESCRIPTION_TYPES_ALLOWED)[number];

/**
 * Coordenadas devueltas por Vision. Origen top-left, en píxeles de la
 * imagen original sin resize.
 */
export const pointSchema = z.object({
  x: z.number().nonnegative(),
  y: z.number().nonnegative(),
});

export const WARNING_FLAGS = [
  'face_not_frontal',
  'eyes_closed_or_squinted',
  'glasses_detected',
  'card_not_detected',
  'card_tilted',
  'card_not_at_eye_level',
  'poor_lighting',
  'image_too_blurry',
  'suspicious_content',
  'multiple_faces',
] as const;
export type WarningFlag = (typeof WARNING_FLAGS)[number];

/**
 * Schema del JSON que devuelve el modelo Vision. Validado tanto en
 * backend (output del modelo) como antes de calcular DNP.
 */
export const pdVisionOutputSchema = z.object({
  /** Si false, no se procesa. Detecta caras, anteojos puestos, perfil, etc. */
  is_valid_input: z.boolean(),
  /** Calidad de iluminación. */
  lighting_quality: z.enum(['good', 'medium', 'poor']),
  /** Si tiene anteojos puestos en la foto — invalida medición. */
  glasses_detected: z.boolean(),
  /** Si la tarjeta está visible y plana en la imagen. */
  card_detected: z.boolean(),
  /** Inclinación de la tarjeta en grados (idealmente 0, max 5). */
  card_tilt_deg: z.number().min(-45).max(45),
  /** Orientación de la cara. yaw=0 = frontal, pitch=0 = cabeza recta. */
  face_yaw_deg: z.number().min(-90).max(90),
  face_pitch_deg: z.number().min(-90).max(90),
  /** Coordenadas en px. null si no se detectó. */
  pupil_left_px: pointSchema.nullable(),
  pupil_right_px: pointSchema.nullable(),
  /** Centro del puente nasal (sellión). Para calcular DNP monocular. */
  nasal_bridge_px: pointSchema.nullable(),
  /** Ancho de la tarjeta en px (lado más largo, 85.6mm en realidad). */
  card_width_px: z.number().positive().nullable(),
  /** Flags de problemas detectados. */
  warnings: z.array(z.enum(WARNING_FLAGS)),
});

export type PDVisionOutput = z.infer<typeof pdVisionOutputSchema>;

/**
 * Resultado final del cálculo de DNP (servido al cliente).
 *
 * Si ok=false, el cliente muestra el error / warnings sin valores.
 * Si ok=true, los 3 valores DNP están presentes + nivel de confianza.
 */
export const pdResultSchema = z.discriminatedUnion('ok', [
  z.object({
    ok: z.literal(true),
    /** DNP total entre las 2 pupilas, en mm. */
    dnp_total_mm: z.number().min(DNP_RANGES.HARD_MIN).max(DNP_RANGES.HARD_MAX),
    /** DNP monocular OD (centro nasal a pupila derecha). */
    dnp_od_mm: z.number().positive(),
    /** DNP monocular OI (centro nasal a pupila izquierda). */
    dnp_oi_mm: z.number().positive(),
    /** Asimetría: abs(dnp_od - dnp_oi). >2mm = warning. */
    asymmetry_mm: z.number().nonnegative(),
    /** high si todas las validations pasaron, medium si hay warnings menores, low si está cerca del límite. */
    confidence: z.enum(['high', 'medium', 'low']),
    /** Warnings no bloqueantes que el usuario debe ver. */
    soft_warnings: z.array(z.string()),
  }),
  z.object({
    ok: z.literal(false),
    /** Razón humana del fallo. */
    error: z.string(),
    /** Flags detectados que causaron el fallo. */
    warnings: z.array(z.enum(WARNING_FLAGS)),
  }),
]);

export type PDResult = z.infer<typeof pdResultSchema>;

/**
 * Input del endpoint /api/measure-pd (multipart form data).
 * Los checkboxes son obligatorios — sin acceptar las exclusiones, no
 * procesamos. La regente protege legalmente al negocio + al cliente.
 */
export const pdRequestFlagsSchema = z.object({
  /** Confirma que es mayor de 16. */
  age_confirmed: z.literal(true),
  /** Confirma NO tener estrabismo diagnosticado. */
  no_strabismus: z.literal(true),
  /** Confirma NO tener prismas en la receta. */
  no_prisms: z.literal(true),
  /** Confirma entender que para multifocales/progresivos hace falta medición presencial. */
  understands_progressive_limitation: z.literal(true),
});

export type PDRequestFlags = z.infer<typeof pdRequestFlagsSchema>;

/**
 * Copy para mostrar al usuario según el modo elegido.
 */
export const PD_MODE_LABELS: Record<
  PDMeasureMode,
  { name: string; tagline: string; precision: string }
> = {
  simple: {
    name: 'Modo simple',
    tagline: 'Tarjeta en la frente, fácil de hacer',
    precision: 'Precisión ±1.5mm — orientativa, la regente ajusta al armar',
  },
  precise: {
    name: 'Modo preciso',
    tagline: 'Tarjeta apoyada en pómulos, más exacto técnicamente',
    precision: 'Precisión ±0.5-1mm — mejor para receta media o alta',
  },
};
