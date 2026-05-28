import { z } from 'zod';
import { AR_PROVINCES } from './constants';

const trimmed = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, { error: `Mínimo ${min} caracteres.` })
    .max(max, { error: `Máximo ${max} caracteres.` });

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `Máximo ${max} caracteres.` })
    .optional()
    .or(z.literal('').transform(() => undefined));

/**
 * Acepta CPA (`B1900ABC`) o 4 dígitos clásicos (`1900`). Insensible a
 * mayúsculas — normalizamos arriba antes de guardar.
 */
const postalCodeSchema = z
  .string()
  .trim()
  .regex(/^[A-Z]?\d{4}[A-Z]{0,3}$/i, {
    error: 'Código postal inválido. Ejemplo: 1900 o B1900ABC.',
  })
  .transform((v) => v.toUpperCase());

/**
 * Teléfono AR permisivo: dígitos, espacios, guiones, paréntesis, +.
 * Sin normalización — guardamos lo que el user pone para que coincida con
 * cómo lo conoce. Una limpieza más estricta puede venir si lo necesitamos
 * para SMS/WhatsApp automation.
 */
const phoneSchema = z
  .string()
  .trim()
  .regex(/^[\d+\-\s()]{6,30}$/, { error: 'Teléfono inválido.' })
  .optional()
  .or(z.literal('').transform(() => undefined));

export const addressInputSchema = z.object({
  label: optionalTrimmed(30),
  recipient_name: trimmed(2, 100),
  street: trimmed(2, 100),
  number: trimmed(1, 20),
  apartment: optionalTrimmed(50),
  city: trimmed(2, 100),
  province: z.enum(AR_PROVINCES, {
    error: 'Elegí una provincia.',
  }),
  postal_code: postalCodeSchema,
  phone: phoneSchema,
  is_default: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressInputSchema>;

export type Address = {
  id: string;
  user_id: string;
  label: string | null;
  recipient_name: string;
  street: string;
  number: string;
  apartment: string | null;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type AddressFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof AddressInput, string>>;
  message?: string;
};
