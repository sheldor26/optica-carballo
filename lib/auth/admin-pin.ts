import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Segundo factor del panel admin: un PIN de 4 dígitos que se pide DESPUÉS del
 * login con email autorizado (ver `requireAdmin` en `./admin.ts`).
 *
 * - El PIN vive en la env `ADMIN_PIN` (4 dígitos). Si no está configurado o es
 *   inválido, el segundo factor se OMITE (el gate vuelve a ser solo email) —
 *   así el panel nunca queda inaccesible por un PIN mal cargado.
 * - Tras ingresar el PIN correcto se setea una cookie de SESIÓN firmada con
 *   HMAC (sin `maxAge` → se borra al cerrar el navegador). El valor está atado
 *   al PIN actual: si cambiás `ADMIN_PIN`, las cookies viejas dejan de valer.
 * - Reutiliza `CART_COOKIE_SECRET` (ya configurada) como secreto de firma.
 */

const COOKIE_NAME = 'oc_admin_pin';

function getSecret(): string {
  const secret = process.env.CART_COOKIE_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'CART_COOKIE_SECRET no está configurada o es muy corta (>= 32 chars). Generar con `node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"`.',
    );
  }
  return secret;
}

/** El PIN admin desde env, o `null` si no hay uno válido (4 dígitos). */
export function getAdminPin(): string | null {
  const pin = (process.env.ADMIN_PIN ?? '').trim();
  return /^\d{4}$/.test(pin) ? pin : null;
}

/** `true` si hay un PIN configurado → el segundo factor está activo. */
export function isAdminPinEnabled(): boolean {
  return getAdminPin() !== null;
}

/** Compara el PIN ingresado contra `ADMIN_PIN` en tiempo constante. */
export function verifyPin(input: string): boolean {
  const pin = getAdminPin();
  if (!pin) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(pin);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Token firmado atado al PIN actual. `null` si no hay PIN configurado. */
function tokenForCurrentPin(): string | null {
  const pin = getAdminPin();
  if (!pin) return null;
  return createHmac('sha256', getSecret())
    .update(`admin-pin:v1:${pin}`)
    .digest('base64url');
}

/** Setea la cookie de sesión que marca "este navegador ingresó el PIN". */
export async function setAdminPinCookie(): Promise<void> {
  const token = tokenForCurrentPin();
  if (!token) return;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    // sin maxAge/expires → cookie de sesión: se borra al cerrar el navegador.
  });
}

/** `true` si la cookie del navegador corresponde al PIN actual. */
export async function hasValidAdminPinCookie(): Promise<boolean> {
  const expected = tokenForCurrentPin();
  if (!expected) return false;
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw || raw.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(raw), Buffer.from(expected));
  } catch {
    return false;
  }
}

/** Borra la cookie del PIN (logout del segundo factor). */
export async function clearAdminPinCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/**
 * Solo permite rutas internas del admin como destino post-desbloqueo
 * (evita open-redirect). Default = `/admin/pedidos`.
 */
export function safeAdminNext(next?: string | null): string {
  if (next && next.startsWith('/admin') && !next.startsWith('//')) return next;
  return '/admin/pedidos';
}

/**
 * Límite de intentos del PIN por IP. Best-effort en memoria: en serverless
 * (Vercel) un reinicio de la instancia resetea el contador, y distintas
 * instancias no lo comparten — ver BACKLOG para una versión persistente. Como
 * el PIN ya está detrás del login admin, el riesgo de fuerza bruta es bajo.
 */
const MAX_ATTEMPTS = 5;
const LOCK_MS = 5 * 60 * 1000; // 5 minutos
const attempts = new Map<string, { count: number; lockUntil: number }>();

/** Segundos de bloqueo restantes para esa IP (0 = no está bloqueada). */
export function lockSecondsRemaining(ip: string): number {
  const rec = attempts.get(ip);
  if (!rec) return 0;
  const remaining = rec.lockUntil - Date.now();
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}

export function recordFailedAttempt(ip: string): void {
  const rec = attempts.get(ip) ?? { count: 0, lockUntil: 0 };
  rec.count += 1;
  if (rec.count >= MAX_ATTEMPTS) {
    rec.lockUntil = Date.now() + LOCK_MS;
    rec.count = 0;
  }
  attempts.set(ip, rec);
}

export function clearAttempts(ip: string): void {
  attempts.delete(ip);
}
