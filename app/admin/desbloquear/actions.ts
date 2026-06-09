'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { requireAdminEmail } from '@/lib/auth/admin';
import {
  verifyPin,
  setAdminPinCookie,
  safeAdminNext,
  lockSecondsRemaining,
  recordFailedAttempt,
  clearAttempts,
} from '@/lib/auth/admin-pin';

export type UnlockState = { error: string | null };

async function getClientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return h.get('x-real-ip') ?? 'unknown';
}

/**
 * Valida el PIN del segundo factor. Requiere email admin (primer factor) ya
 * resuelto. Con PIN correcto: setea la cookie de sesión y redirige al destino.
 */
export async function unlockAdminAction(
  _prev: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  await requireAdminEmail();

  const ip = await getClientIp();
  const locked = lockSecondsRemaining(ip);
  if (locked > 0) {
    return {
      error: `Demasiados intentos. Probá de nuevo en ${Math.ceil(locked / 60)} min.`,
    };
  }

  const pin = String(formData.get('pin') ?? '').trim();
  const next = safeAdminNext(String(formData.get('next') ?? ''));

  if (!/^\d{4}$/.test(pin)) {
    return { error: 'El PIN son 4 dígitos.' };
  }

  if (!verifyPin(pin)) {
    recordFailedAttempt(ip);
    return { error: 'PIN incorrecto.' };
  }

  clearAttempts(ip);
  await setAdminPinCookie();
  redirect(next);
}
