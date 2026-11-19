import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Valida que un webhook venga de Meta y no de cualquiera que conozca la URL.
 *
 * Meta firma el CUERPO CRUDO con HMAC-SHA256 usando el secreto de la app y lo
 * manda en el header `X-Hub-Signature-256` como `sha256=<hex>`. Hay que firmar
 * exactamente los bytes que llegaron: si se parsea el JSON y se vuelve a
 * serializar, la firma no coincide.
 *
 * Sin `server-only` a propósito: es una función pura y así se puede probar con
 * tsx fuera de Next (scripts/whatsapp-selftest.ts).
 */
export function verifyWhatsAppSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string,
): boolean {
  if (!signatureHeader || !appSecret) return false;

  const prefix = 'sha256=';
  if (!signatureHeader.startsWith(prefix)) return false;

  const received = signatureHeader.slice(prefix.length);
  // Un hex de SHA-256 tiene 64 caracteres; cualquier otra cosa es basura.
  if (!/^[0-9a-f]{64}$/i.test(received)) return false;

  const expected = createHmac('sha256', appSecret).update(rawBody, 'utf8').digest();
  const receivedBuf = Buffer.from(received, 'hex');

  // Mismo largo garantizado por el regex; timingSafeEqual evita filtrar la
  // firma correcta midiendo cuánto tarda la comparación.
  return receivedBuf.length === expected.length && timingSafeEqual(receivedBuf, expected);
}
