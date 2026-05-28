import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { Payment } from 'mercadopago';
import { getMpClient } from './client';

/**
 * Validación de la firma del webhook de Mercado Pago.
 *
 * MP envía 2 headers cuando notifica:
 *   - `x-signature`: formato `ts=<timestamp>,v1=<hmac>`
 *   - `x-request-id`: id único del request
 *
 * El template HMAC es:
 *   `id:<data.id>;request-id:<request_id>;ts:<ts>;`
 *
 * Se firma con `MP_WEBHOOK_SECRET` (configurado en Panel MP → Webhooks).
 * El resultado se compara con `v1` del header `x-signature`.
 *
 * Si `MP_WEBHOOK_SECRET` no está en env, devolvemos `{ok:true, verified:false}`
 * — significa que el webhook funciona pero sin validación de origen.
 * Aceptable en dev / pre-launch; obligatorio configurar antes de prod.
 */
export type SignatureValidation =
  | { ok: true; verified: boolean }
  | { ok: false; error: string };

export function validateMpSignature(args: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string;
}): SignatureValidation {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    return { ok: true, verified: false };
  }

  if (!args.xSignature || !args.xRequestId) {
    return { ok: false, error: 'Faltan headers x-signature / x-request-id.' };
  }

  // Parse "ts=...,v1=..." (orden no garantizado, splitting tolerante).
  const parts = args.xSignature.split(',').reduce<Record<string, string>>(
    (acc, kv) => {
      const [k, v] = kv.split('=');
      if (k && v) acc[k.trim()] = v.trim();
      return acc;
    },
    {},
  );

  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) {
    return { ok: false, error: 'x-signature mal formado.' };
  }

  const template = `id:${args.dataId};request-id:${args.xRequestId};ts:${ts};`;
  const expected = createHmac('sha256', secret)
    .update(template)
    .digest('hex');

  let match = false;
  try {
    match =
      expected.length === v1.length &&
      timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  } catch {
    match = false;
  }

  if (!match) {
    return { ok: false, error: 'Firma del webhook inválida.' };
  }
  return { ok: true, verified: true };
}

/**
 * Lee el payment completo desde la API de MP usando el SDK. Necesario
 * porque el webhook solo nos da el `data.id` — para decidir si la order
 * se marca como `paid` o `cancelled` hace falta el `status` real del
 * payment, que no viene en el webhook.
 */
export type FetchedPayment = {
  id: number;
  status: string;
  status_detail: string | null;
  external_reference: string | null;
  transaction_amount: number | null;
  payment_method_id: string | null;
  payer_email: string | null;
};

export async function fetchPaymentById(
  paymentId: string,
): Promise<FetchedPayment | null> {
  try {
    const client = getMpClient();
    const payment = new Payment(client);
    const result = await payment.get({ id: paymentId });

    if (!result || typeof result.id !== 'number') return null;

    return {
      id: result.id,
      status: result.status ?? 'unknown',
      status_detail: result.status_detail ?? null,
      external_reference: result.external_reference ?? null,
      transaction_amount: result.transaction_amount ?? null,
      payment_method_id: result.payment_method_id ?? null,
      payer_email: result.payer?.email ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Mapeo de status de MP a nuestro orders.status (CHECK constraint del
 * schema 00002).
 *
 * MP statuses: approved, pending, in_process, rejected, refunded, cancelled,
 *              charged_back, in_mediation, authorized
 * Nuestros statuses: pending, paid, preparing, shipped, delivered,
 *                    cancelled, refunded
 */
export function mpStatusToOrderStatus(
  mpStatus: string,
): 'paid' | 'pending' | 'cancelled' | 'refunded' | null {
  switch (mpStatus) {
    case 'approved':
    case 'authorized':
      return 'paid';
    case 'in_process':
    case 'pending':
      return 'pending';
    case 'rejected':
    case 'cancelled':
      return 'cancelled';
    case 'refunded':
    case 'charged_back':
      return 'refunded';
    case 'in_mediation':
      return null; // mantener status actual
    default:
      return null;
  }
}
