import { NextResponse, type NextRequest } from 'next/server';
import { mlWebhookPayloadSchema } from '@/lib/integrations/mercadolibre/schemas';

export const dynamic = 'force-dynamic';

/**
 * Webhook receiver para notificaciones de Mercado Libre.
 *
 * **Estado actual: STUB (Sprint 1 ML)**.
 *
 * Este endpoint actualmente:
 * 1. Acepta POST con payload de ML.
 * 2. Valida shape con Zod (sin procesar nada todavía).
 * 3. Log del payload para visibilidad durante setup inicial.
 * 4. Devuelve 200 OK siempre — ML reintenta si recibe non-2xx.
 *
 * **Sprint 2 va a expandir este endpoint con**:
 * - Validación de origen (HMAC signature o secret en URL).
 * - Idempotencia por `_id` del webhook.
 * - Fetch del recurso completo via API ML (el webhook solo trae path).
 * - Update de stock en Supabase según topic (items, orders_v2).
 * - Logging a `marketplace_sync_errors` cuando algo falla.
 *
 * Por ahora el endpoint existe para que ML pueda validarlo al guardar
 * la app — sin endpoint que responda 200, ML rechaza la callback URL.
 *
 * Ver ADR-024 en DECISIONS.md para el diseño completo.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar shape con Zod (no procesar todavía, solo verificar formato).
    const result = mlWebhookPayloadSchema.safeParse(body);

    if (!result.success) {
      console.warn('[ml-webhook] payload con formato inesperado', {
        errors: result.error.flatten(),
        receivedKeys: Object.keys(body ?? {}),
      });
      // Igual respondemos 200 — ML interpreta non-2xx como retry necesario,
      // y un payload mal formed no se va a arreglar reintentando.
      return NextResponse.json({ ok: true, ignored: true });
    }

    // Sprint 1: solo log. Sprint 2 procesará según `topic`.
    console.log('[ml-webhook] payload recibido (stub)', {
      topic: result.data.topic,
      resource: result.data.resource,
      user_id: result.data.user_id,
      attempts: result.data.attempts,
      sent: result.data.sent,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[ml-webhook] error procesando webhook', err);
    // Respondemos 200 igual — el error es nuestro (no de ML), reintenta
    // no ayuda. Sprint 2 va a manejar errores con retry inteligente.
    return NextResponse.json({ ok: true, error: 'processing_failed' });
  }
}

/**
 * ML a veces hace GET para validar que el endpoint existe + responde 200
 * al momento de guardar la app. Respondemos 200 OK con info mínima.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: 'mercadolibre-webhook',
    status: 'stub',
    note: 'Este endpoint acepta webhooks de ML pero todavía no procesa nada. Sprint 2 implementa el procesamiento real. Ver DECISIONS.md ADR-024.',
  });
}

/**
 * Algunos sistemas (CDN, monitoring de ML) hacen HEAD para verificar el endpoint.
 */
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
