import 'server-only';
import crypto from 'node:crypto';
import { getMLConfig } from '@/lib/integrations/mercadolibre/config';

/**
 * AES-256-GCM para cifrar/descifrar tokens OAuth antes/después de
 * persistir en `marketplace_integrations`.
 *
 * Por qué GCM (vs CBC):
 * - Authenticated encryption: GCM detecta si el ciphertext fue manipulado.
 * - No requiere padding manual.
 * - Estándar moderno para tokens.
 *
 * Formato del ciphertext persistido:
 *   `${iv_hex}:${authTag_hex}:${encrypted_hex}`
 *
 * Donde:
 * - iv: 12 bytes random por cifrado (no reusable — CRÍTICO en GCM).
 * - authTag: 16 bytes generados por GCM para detectar tampering.
 * - encrypted: payload cifrado.
 *
 * Tradeoff: tokens crecen ~3-4x al cifrarse vs plain. Para tokens
 * de ~50-200 chars es despreciable.
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // GCM recomienda 96 bits = 12 bytes
const AUTH_TAG_LENGTH = 16;

/**
 * Deriva la key de 32 bytes a partir de `APP_ENCRYPTION_KEY`. Si el
 * env var ya es 64 chars hex (output esperado de `openssl rand -hex 32`),
 * se decodifica directo. Si es otro string, se aplica SHA-256 para
 * derivar 32 bytes deterministas.
 */
function deriveKey(): Buffer {
  const { encryptionKey } = getMLConfig();

  // Caso ideal: 64 chars hex = 32 bytes
  if (/^[0-9a-f]{64}$/i.test(encryptionKey)) {
    return Buffer.from(encryptionKey, 'hex');
  }

  // Fallback: derivar con SHA-256 (NUNCA en producción ideal, pero evita
  // tirar error si la env var no está en el formato exacto).
  return crypto.createHash('sha256').update(encryptionKey).digest();
}

/**
 * Cifra un string plaintext (ej: access_token) con AES-256-GCM.
 * Devuelve el ciphertext en formato `iv:authTag:encrypted` (todos hex).
 */
export function encrypt(plaintext: string): string {
  const key = deriveKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString('hex'),
    authTag.toString('hex'),
    encrypted.toString('hex'),
  ].join(':');
}

/**
 * Descifra un string previamente cifrado con `encrypt`. Si el ciphertext
 * fue manipulado o la key cambió, GCM tira error de `Unsupported state` —
 * lo capturamos y propagamos un error más amigable.
 */
export function decrypt(ciphertext: string): string {
  const parts = ciphertext.split(':');
  if (parts.length !== 3) {
    throw new Error(
      'Ciphertext con formato inválido. Esperado: iv:authTag:encrypted',
    );
  }

  const [ivHex, authTagHex, encryptedHex] = parts as [string, string, string];

  if (
    ivHex.length !== IV_LENGTH * 2 ||
    authTagHex.length !== AUTH_TAG_LENGTH * 2
  ) {
    throw new Error('Ciphertext con tamaños inválidos.');
  }

  const key = deriveKey();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');

  try {
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  } catch (err) {
    // El error de GCM al fallar auth tag es críptico. Damos mensaje útil.
    throw new Error(
      'No se pudo descifrar el ciphertext. Causas posibles: APP_ENCRYPTION_KEY cambió, ciphertext corrupto, o tampering.',
      { cause: err instanceof Error ? err : new Error(String(err)) },
    );
  }
}
