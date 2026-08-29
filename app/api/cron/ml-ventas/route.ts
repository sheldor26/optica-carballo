import { NextResponse } from 'next/server';
import { traerVentas } from '@/lib/integrations/mercadolibre/orders';
import { secretsMatch } from '@/lib/security/timing-safe-equal';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * CRON: traer las ventas de Mercado Libre.
 *
 * Hermana de ml-reconcile-stock. Aquella mantiene el stock al día; ésta trae la
 * venta en sí —quién compró, qué y a cuánto— que es lo que la óptica necesita
 * para dar de alta al cliente, cobrar y descontar del mostrador.
 *
 * Va por acá y no por el webhook de `orders_v2` a propósito: ese webhook está
 * ignorado desde el sprint 2b con un argumento que sigue siendo válido para el
 * stock, anda, y no hay motivo para meterle mano. Una tarea aparte no puede
 * romper lo que ya funciona, y además resuelve el historial: los webhooks
 * viejos ya no vuelven —ML reintenta un rato y deja— pero una consulta por
 * fechas sí trae lo de antes.
 *
 * `?dias=N` amplía el rango, para la primera corrida o para recuperar algo que
 * se haya perdido. Por omisión mira los últimos 7 días.
 */
export async function GET(request: Request) {
  const auth = request.headers.get('authorization') ?? '';
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || !secretsMatch(auth, expected)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const pedido = Number(new URL(request.url).searchParams.get('dias'));
  const dias = Number.isFinite(pedido) && pedido > 0 ? Math.min(pedido, 365) : undefined;

  const r = await traerVentas(dias);
  if (!r.ok) {
    return NextResponse.json({ ok: false, error: r.error, retryable: r.retryable }, { status: 502 });
  }
  return NextResponse.json({ ok: true, ...r.data });
}
