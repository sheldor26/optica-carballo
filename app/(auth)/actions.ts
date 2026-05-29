'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  passwordResetRequestSchema,
  passwordResetSchema,
  safeNextPath,
  signInSchema,
  signUpSchema,
} from '@/lib/auth/schemas';

// Site URL para emails de signup / reset password. En producción debe estar
// SIEMPRE seteada en Vercel — sin esto, los emails de Supabase llegan con
// links a localhost (incident 2026-05-29). Log loud + fallback útil evita
// silent bug. Se computa lazy (no en module-load) para no romper otras actions
// del módulo si solo signup/reset están afectadas.
function getSiteUrlForEmails(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (url && url.length > 0) return url;
  if (process.env.NODE_ENV === 'production') {
    console.error(
      '[auth] NEXT_PUBLIC_SITE_URL no está configurada en producción. Los emails de auth pueden llevar a localhost. Setear en Vercel → Environment Variables.',
    );
  }
  return 'http://localhost:3000';
}

export type FormState = {
  ok: boolean;
  error?: string;
  message?: string;
};

const GENERIC_ERROR = 'No pudimos completar la acción. Probá de nuevo en un momento.';

function parseFormData<T extends Record<string, FormDataEntryValue | null>>(
  formData: FormData,
  keys: Array<keyof T>,
): T {
  const result = {} as T;
  for (const key of keys) {
    const value = formData.get(key as string);
    result[key] = (value ?? undefined) as T[typeof key];
  }
  return result;
}

// ============================================================================
// SIGN IN
// ============================================================================

export async function signIn(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = parseFormData<{ email?: string; password?: string; next?: string }>(
    formData,
    ['email', 'password', 'next'],
  );

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Datos inválidos',
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      ok: false,
      error:
        error.message === 'Invalid login credentials'
          ? 'Email o contraseña incorrectos.'
          : error.message === 'Email not confirmed'
            ? 'Confirmá tu email antes de ingresar. Revisá tu casilla.'
            : GENERIC_ERROR,
    };
  }

  revalidatePath('/', 'layout');
  redirect(safeNextPath(parsed.data.next));
}

// ============================================================================
// SIGN UP
// ============================================================================

export async function signUp(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = parseFormData<{
    email?: string;
    password?: string;
    confirm_password?: string;
    display_name?: string;
  }>(formData, ['email', 'password', 'confirm_password', 'display_name']);

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Datos inválidos',
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${getSiteUrlForEmails()}/auth/callback`,
      data: parsed.data.display_name
        ? { display_name: parsed.data.display_name }
        : undefined,
    },
  });

  if (error) {
    return {
      ok: false,
      error:
        error.message === 'User already registered'
          ? 'Ya existe una cuenta con ese email. Probá ingresar.'
          : error.message,
    };
  }

  return {
    ok: true,
    message:
      'Te enviamos un email para confirmar tu cuenta. Revisá tu casilla (y la carpeta de spam).',
  };
}

// ============================================================================
// SIGN OUT
// ============================================================================

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

// ============================================================================
// PASSWORD RESET REQUEST
// ============================================================================

export async function requestPasswordReset(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = parseFormData<{ email?: string }>(formData, ['email']);

  const parsed = passwordResetRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Email inválido',
    };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${getSiteUrlForEmails()}/recuperar-clave/restablecer`,
  });

  // Mensaje neutro intencionalmente (no revelar si el email existe — anti-enumeration).
  return {
    ok: true,
    message:
      'Si existe una cuenta con ese email, te enviamos un link para restablecer la contraseña.',
  };
}

// ============================================================================
// PASSWORD RESET (post link de email)
// ============================================================================

export async function resetPassword(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = parseFormData<{ password?: string; confirm_password?: string }>(
    formData,
    ['password', 'confirm_password'],
  );

  const parsed = passwordResetSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Datos inválidos',
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      ok: false,
      error:
        error.message === 'Auth session missing!'
          ? 'El link expiró o ya fue usado. Pedí uno nuevo desde "Recuperar contraseña".'
          : GENERIC_ERROR,
    };
  }

  revalidatePath('/', 'layout');
  redirect('/mi-cuenta');
}
