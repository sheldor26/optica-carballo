import { z } from 'zod';

/**
 * Subset de la receta que vive en la cookie firmada. NO se guardan datos
 * que no necesitemos para mostrar al usuario o asociar a la orden:
 * - `confidence` por campo se descarta (el user ya editó/aceptó los valores).
 * - `rawTextExcerpt` se descarta (debug, no útil para comprar).
 * - `warningFlags` se descarta (ya se mostró en el resultado IA).
 * - `isPrescription` implícito (si está en cookie, ya pasó el gate).
 *
 * Sólo guardamos recetas que pueden comprarse online directo (monofocal sin
 * patología). Bifocales, multifocales y altas graduaciones van a WhatsApp y
 * NO se guardan en cookie.
 */
export const eyeMeasurementCookieSchema = z.object({
  esf: z.number().min(-25).max(25).nullable(),
  cil: z.number().min(-8).max(0).nullable(),
  eje: z.number().int().min(1).max(180).nullable(),
  add: z.number().min(0.75).max(3.5).nullable(),
});

export type EyeMeasurementCookie = z.infer<typeof eyeMeasurementCookieSchema>;

export const prescriptionCookieSchema = z.object({
  type: z.enum(['monofocal']),
  od: eyeMeasurementCookieSchema,
  oi: eyeMeasurementCookieSchema,
  dnp: z.number().min(40).max(80).nullable(),
  /** ISO 8601 fecha de emisión de la receta. Para validar vencimiento. */
  expirationDate: z.string().nullable(),
  /** Epoch ms cuando se guardó la receta en la cookie. Para audit logging. */
  savedAt: z.number().int().positive(),
});

export type PrescriptionCookie = z.infer<typeof prescriptionCookieSchema>;
