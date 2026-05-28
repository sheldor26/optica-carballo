import 'server-only';
import { Resend } from 'resend';

/**
 * Singleton del cliente Resend. Lazy init para que el módulo se pueda
 * importar en tests / type-check sin requerir la env var.
 */
let cachedResend: Resend | null = null;

export function getResendClient(): Resend {
  if (cachedResend) return cachedResend;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      'RESEND_API_KEY no está configurada. Agregar a .env.local (resend.com → API Keys).',
    );
  }

  cachedResend = new Resend(apiKey);
  return cachedResend;
}

/**
 * Devuelve el "From" configurado en env. Formato esperado:
 *   "Nombre del remitente <email@dominio.com>"
 * o solo email plano.
 *
 * **IMPORTANTE**: el dominio del email debe estar verificado en Resend
 * (DNS records). Sin verificación, Resend rebota el envío con error
 * "domain not verified". Mientras se verifica el dominio real, usar
 * `onboarding@resend.dev` (always verified, default de Resend).
 */
export function getFromAddress(): string {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) return 'onboarding@resend.dev';
  return from.trim();
}

/**
 * Email opcional del founder para recibir notificaciones administrativas
 * (nuevo pedido pagado, etc). Si no está configurado, no se envían
 * notifications al admin — sólo al cliente.
 */
export function getAdminEmail(): string | null {
  const email = process.env.BUSINESS_ADMIN_EMAIL?.trim();
  return email && email.length > 0 ? email : null;
}
