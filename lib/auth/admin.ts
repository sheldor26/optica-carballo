import 'server-only';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from './server';
import { isAdminPinEnabled, hasValidAdminPinCookie } from './admin-pin';

/**
 * Allowlist de emails admin desde la env `ADMIN_EMAILS` (separada por comas).
 * Se compara contra el email de la cuenta con la que el usuario inició sesión
 * en el sitio — NO es un email que "creamos", es el login del usuario.
 *
 * Ejemplo .env.local:
 *   ADMIN_EMAILS=juan@opticacarballo.com.ar,carlota@opticacarballo.com.ar
 */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

/**
 * Gate para route handlers de API (`app/api/admin/*`). A diferencia de
 * `requireAdmin`/`requireAdminEmail` (que hacen `notFound()`/`redirect()`, pensados
 * para páginas RSC), acá devolvemos el user o `null` para que el handler responda
 * un 401 JSON. Chequea el email logueado contra la allowlist `ADMIN_EMAILS`.
 *
 * Uso:
 *   if (!(await getAdminUserOrNull())) {
 *     return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
 *   }
 */
export async function getAdminUserOrNull() {
  const user = await getCurrentUser();
  return isAdminEmail(user?.email) ? user : null;
}

/**
 * Gate de SOLO email (primer factor). Si no hay sesión o el email NO está en la
 * allowlist → `notFound()` (404).
 *
 * Usamos 404 en vez de redirect a login a propósito: no revelamos que la ruta
 * admin existe a usuarios no autorizados (defensa contra enumeración).
 *
 * Lo usa la pantalla de desbloqueo del PIN (`/admin/desbloquear`), que todavía
 * no tiene la cookie del segundo factor. El resto del admin usa `requireAdmin`.
 */
export async function requireAdminEmail() {
  const user = await getCurrentUser();
  if (!isAdminEmail(user?.email)) {
    notFound();
  }
  return user!;
}

/**
 * Gate completo del panel admin: email (primer factor) + PIN (segundo factor).
 *
 * El panel muestra PII de clientes (nombre, dirección, teléfono) — esta
 * verificación es la barrera, así que se llama en CADA page admin Y en CADA
 * action que lee/escribe datos (defensa en profundidad, no confiar solo en el
 * gate de la página).
 *
 * Si el email es válido pero el navegador no ingresó el PIN → redirige a
 * `/admin/desbloquear`. Si `ADMIN_PIN` no está configurado, el segundo factor
 * se omite (queda solo el gate de email).
 */
export async function requireAdmin() {
  const user = await requireAdminEmail();
  if (isAdminPinEnabled() && !(await hasValidAdminPinCookie())) {
    redirect('/admin/desbloquear');
  }
  return user;
}
