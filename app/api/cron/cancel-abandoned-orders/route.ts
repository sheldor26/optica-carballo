import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { releaseOrderStock } from '@/lib/checkout/orders';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * CRON — cancela pedidos abandonados sin pago y reintegra su stock.
 *
 * Problema que resuelve: el stock se descuenta al CREAR la orden (`reserve_stock`),
 * antes de pagar. Si el cliente nunca paga, la orden queda `pending` para siempre
 * y ese stock queda "reservado" sin venta real → stock fantasma.
 *
 * Algoritmo:
 *   1. Buscar orders `pending` creadas hace más de ABANDON_HOURS.
 *      (status='paid' lo setea el webhook MP al aprobar → `pending` = sin pagar.)
 *   2. Por cada una: status='cancelled' (el trigger registra el evento) +
 *      `releaseOrderStock` (devuelve stock a la base y a ML, idempotente).
 *
 * Schedule: cada hora (ver vercel.json) → precisión de ~1h sobre el corte de 24h.
 * Autorizado vía CRON_SECRET (mismo patrón que los otros crons).
 */
const ABANDON_HOURS = 24;

export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const cutoff = new Date(Date.now() - ABANDON_HOURS * 60 * 60 * 1000).toISOString();

  const { data: abandoned, error } = await supabase
    .from('orders')
    .select('id, order_number')
    .eq('status', 'pending')
    .lt('created_at', cutoff);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const orders = abandoned ?? [];
  let cancelled = 0;
  let stockReleased = 0;
  let failed = 0;
  const errors: Array<{ order_number: string; reason: string }> = [];

  for (const order of orders) {
    try {
      const { error: updErr } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', order.id)
        .eq('status', 'pending'); // guard: no pisar si cambió entre el SELECT y ahora

      if (updErr) {
        failed++;
        errors.push({ order_number: order.order_number, reason: updErr.message });
        continue;
      }

      cancelled++;

      // Nota en el evento que creó el trigger (para que se vea el motivo).
      const { data: lastEvent } = await supabase
        .from('order_status_events')
        .select('id')
        .eq('order_id', order.id)
        .eq('status', 'cancelled')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (lastEvent) {
        await supabase
          .from('order_status_events')
          .update({ note: `Cancelado automáticamente por falta de pago (${ABANDON_HOURS}h).` })
          .eq('id', lastEvent.id);
      }

      const result = await releaseOrderStock(order.id);
      if (result.released) stockReleased++;
    } catch (err) {
      failed++;
      errors.push({
        order_number: order.order_number,
        reason: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return NextResponse.json({
    ok: true,
    abandon_hours: ABANDON_HOURS,
    found: orders.length,
    cancelled,
    stock_released: stockReleased,
    failed,
    errors: errors.slice(0, 10),
  });
}
