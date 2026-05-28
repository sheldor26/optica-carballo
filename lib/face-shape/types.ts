import { z } from 'zod';

/**
 * 7 face shapes estándar reconocidos por la óptica (input optical-expert).
 * Slugs en español argentino, minúsculas.
 */
export const FACE_SHAPES = [
  'ovalado',
  'redondo',
  'cuadrado',
  'corazon',
  'oblongo',
  'diamante',
  'triangular',
] as const;

export type FaceShape = (typeof FACE_SHAPES)[number];

/**
 * Frame shapes canónicos. Match a `attributes.frame_shape` en productos.
 * snake_case en español.
 */
export const FRAME_SHAPES = [
  'rectangular',
  'cuadrado',
  'redondo',
  'ovalado',
  'aviador',
  'cat_eye',
  'mariposa',
  'geometrico',
  'wayfarer',
  'clubmaster',
  'sin_marco',
] as const;

export type FrameShape = (typeof FRAME_SHAPES)[number];

/**
 * Warning flags posibles. Array siempre — `[]` si no hay flags.
 */
export const WARNING_FLAGS = [
  'no_face_detected',
  'multiple_faces',
  'wearing_glasses',
  'wearing_sunglasses',
  'poor_lighting',
  'profile_view',
  'face_too_small',
  'face_obscured',
  'suspicious_content',
] as const;

export type WarningFlag = (typeof WARNING_FLAGS)[number];

/**
 * Schema del response del modelo. Validado con Zod tanto en backend
 * (output del modelo) como en frontend (response del API). Confidence
 * 0-1 numérico en backend; el frontend mapea a high/medium/low.
 */
export const FaceShapeAnalysisSchema = z.object({
  faceShape: z.enum(FACE_SHAPES).nullable(),
  confidence: z.number().min(0).max(1),
  recommendedFrameShapes: z.array(z.enum(FRAME_SHAPES)).max(3),
  avoidFrameShapes: z.array(z.enum(FRAME_SHAPES)).max(3),
  rationale: z.string().min(1).max(400),
  warningFlags: z.array(z.enum(WARNING_FLAGS)),
});

export type FaceShapeAnalysis = z.infer<typeof FaceShapeAnalysisSchema>;

/**
 * Confidence thresholds. <0.6 = baja (mostramos disclaimer prominente
 * + handoff a WhatsApp). 0.6-0.8 = media. >0.8 = alta.
 */
export const CONFIDENCE_THRESHOLDS = {
  LOW: 0.6,
  HIGH: 0.8,
} as const;

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export function confidenceLevel(value: number): ConfidenceLevel {
  if (value < CONFIDENCE_THRESHOLDS.LOW) return 'low';
  if (value < CONFIDENCE_THRESHOLDS.HIGH) return 'medium';
  return 'high';
}
