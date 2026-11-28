import 'server-only';
import { getFromAddress, getResendClient } from './client';
import type { Correo } from '@/lib/integrations/mercadolibre/claims-avisos';

/**
 * Los avisos de reclamos de Mercado Libre. Van a ML_AVISOS_EMAIL (una o varias
 * direcciones separadas por coma). Sin esa variable no se manda nada: a
 * propósito no cae en BUSINESS_ADMIN_EMAIL.
 */

/** 'incierto' = no se sabe si salió: se reintenta más tarde con la misma clave. */
export type ResultadoDeEnvio = 'enviado' | 'fallo' | 'incierto';

const ESPERA_MAX_MS = 8_000;

export function destinoDeAvisosML(): string[] | null {
  const lista = (process.env.ML_AVISOS_EMAIL ?? '')
    .split(',')
    .map((d) => d.trim())
    .filter(Boolean);
  return lista.length > 0 ? lista : null;
}

export async function enviarAvisoML(
  correo: Correo,
  to: string[],
  claveDeIdempotencia: string,
): Promise<ResultadoDeEnvio> {
  let reloj: ReturnType<typeof setTimeout> | undefined;
  try {
    const respuesta = await Promise.race([
      getResendClient().emails.send(
        { from: getFromAddress(), to, ...correo },
        { idempotencyKey: claveDeIdempotencia },
      ),
      new Promise<'tarde'>((listo) => {
        reloj = setTimeout(() => listo('tarde'), ESPERA_MAX_MS);
      }),
    ]);
    if (respuesta === 'tarde') return 'incierto';
    // El SDK de Resend devuelve el error, no lo tira.
    const { error } = respuesta;
    if (!error) return 'enviado';
    // Ya salió un correo con esta clave (el contenido cambió entre intentos).
    if (error.name === 'invalid_idempotent_request') return 'enviado';
    console.error('[ml-avisos] Resend rechazó el aviso:', error.message);
    return 'fallo';
  } catch (err) {
    console.error('[ml-avisos] no pude mandar el aviso:', err);
    return 'fallo';
  } finally {
    clearTimeout(reloj);
  }
}
