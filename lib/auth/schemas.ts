import { z } from 'zod';

const email = z
  .string({ message: 'Email requerido' })
  .trim()
  .toLowerCase()
  .email({ message: 'Email inválido' });

const password = z
  .string({ message: 'Contraseña requerida' })
  .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  .max(72, { message: 'La contraseña no puede tener más de 72 caracteres' });

export const signInSchema = z.object({
  email,
  password: z.string({ message: 'Contraseña requerida' }).min(1, {
    message: 'Contraseña requerida',
  }),
  next: z.string().optional(),
});

export const signUpSchema = z
  .object({
    email,
    password,
    confirm_password: z.string({ message: 'Confirmá la contraseña' }),
    display_name: z
      .string()
      .trim()
      .min(2, { message: 'Nombre debe tener al menos 2 caracteres' })
      .max(60)
      .optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Las contraseñas no coinciden',
  });

export const passwordResetRequestSchema = z.object({
  email,
});

export const passwordResetSchema = z
  .object({
    password,
    confirm_password: z.string({ message: 'Confirmá la contraseña' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Las contraseñas no coinciden',
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;

/**
 * Whitelist anti open-redirect para el query param `?next=`.
 * Sólo permite paths internos absolutos (empiezan con `/` pero no `//`).
 */
export function safeNextPath(input: string | null | undefined): string {
  if (!input) return '/mi-cuenta';
  if (typeof input !== 'string') return '/mi-cuenta';
  if (!input.startsWith('/')) return '/mi-cuenta';
  if (input.startsWith('//')) return '/mi-cuenta';
  return input;
}
