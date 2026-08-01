import 'server-only';
import { timingSafeEqual } from 'node:crypto';

/**
 * Compara dos strings en tiempo constante (protege contra timing attacks
 * al comparar secretos: `CRON_SECRET`, tokens, etc). `a !== b` normal
 * corta apenas encuentra la primera diferencia — un atacante puede medir
 * esa diferencia de latencia para inferir el secreto byte a byte.
 *
 * Uso: `secretsMatch(received, expected)`.
 */
export function secretsMatch(a: string, b: string): boolean {
  try {
    return a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}
