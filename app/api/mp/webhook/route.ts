import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { releaseOrderStock } from '@/lib/checkout/orders';
import {
  fetchPaymentById,
  mpStatusToOrderStatus,
  validateMpSignature,
} from '@/lib/mp/webhook';
import {
  sendOrderConfirmationToCustomer,
  sendOrderNotificationToAdmin,
} from '@/lib/emails/send-order-emails';
import type {
  CustomerEmailData,
} from '@/lib/emails/templates/order-confirmation-customer';
import type {
  AdminEmailData,
} from '@/lib/emails/templates/order-notification-admin';

export const dynamic = 'force-dynamic';

/**
 * Webhook receiver para notificaciones de Mercado Pago.
 *
 * MP postea JSON con shape mínimo: { type, action, data: { id } }.
 * Para `type=payment` (lo que nos importa), `data.id` es el payment_id.
 *
 * Flow:
 *   1. Validar signature (opcional si MP_WEBHOOK_SECRET no está).
 *   2. Filtrar solo eventos de tipo `payment`.
 *   3. Fetch del payment completo vía MP API (el webhook no trae el status).
 *   4. Lookup order por `external_reference` (= order_number).
 *   5. Idempotencia: si la order ya tiene mp_payment_id matching → skip.
 *   6. Map MP status → order status.
 *   7. UPDATE orders + mp_payment_id + paid_at.
 *   8. Si paso a `paid`, mandar emails (cliente + admin) — best-effort.
 *   9. Siempre responder 200 a MP (sino reintenta indefinidamente).
 *
 * Nota: en dev local MP no puede POSTear a localhost. Para testing local,
 * usar ngrok / tunnel o invocar manualmente con `curl -X POST` (skip
 * signature setting MP_WEBHOOK_SECRET vacío).
 */
export async function POST(request: NextRequest) {
  let body: { type?: string; action?: string; data?: { id?: string | number } };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  // Filtramos solo eventos de pago. MP también manda merchant_order, etc.
  if (body.type !== 'payment' || !body.data?.id) {
    return NextResponse.json({ ok: true, skipped: 'not a payment event' });
  }

  const paymentId = String(body.data.id);

  const xSignature = request.headers.get('x-signature');
  const xRequestId = request.headers.get('x-request-id');
  const sigCheck = validateMpSignature({
    xSignature,
    xRequestId,
    dataId: paymentId,
  });
  if (!sigCheck.ok) {
    console.warn('[mp-webhook] signature invalid:', sigCheck.error);
    return NextResponse.json(
      { ok: false, error: sigCheck.error },
      { status: 401 },
    );
  }

  // Obtener el payment completo de MP (el webhook no trae status).
  const payment = await fetchPaymentById(paymentId);
  if (!payment) {
    console.error('[mp-webhook] payment not found:', paymentId);
    return NextResponse.json(
      { ok: true, error: 'payment not found in MP api' },
    );
  }

  if (!payment.external_reference) {
    console.error('[mp-webhook] no external_reference:', payment.id);
    return NextResponse.json({ ok: true, error: 'no external_reference' });
  }

  const orderNumber = payment.external_reference;
  const newOrderStatus = mpStatusToOrderStatus(payment.status);
  if (!newOrderStatus) {
    return NextResponse.json({
      ok: true,
      skipped: `MP status ${payment.status} → no order update`,
    });
  }

  const supabase = createAdminClient();

  // Lookup order completa para los emails + idempotencia.
  const { data: orderRow, error: orderErr } = await supabase
    .from('orders')
    .select(
      'id, order_number, status, customer_name, customer_email, customer_phone, total_cents, subtotal_cents, shipping_cents, mp_payment_id, paid_at, shipping_recipient_name, shipping_street, shipping_number, shipping_apartment, shipping_city, shipping_province, shipping_postal_code, shipping_phone, shipping_method, shipping_delivery_type, shipping_agency_name',
    )
    .eq('order_number', orderNumber)
    .maybeSingle();

  if (orderErr || !orderRow) {
    console.error('[mp-webhook] order not found:', orderNumber, orderErr?.message);
    // 200 igual — MP no debe reintentar por una order que no existe.
    return NextResponse.json({ ok: true, error: 'order not found' });
  }

  // Idempotencia: si ya está marcada paid con este payment_id, skip.
  if (
    orderRow.mp_payment_id === String(payment.id) &&
    orderRow.status === newOrderStatus
  ) {
    return NextResponse.json({
      ok: true,
      skipped: 'already processed (idempotent)',
    });
  }

  const wasUnpaid = orderRow.status !== 'paid';
  const isNowPaid = newOrderStatus === 'paid';

  // Anti-subpago: no marcar `paid` si el monto aprobado es menor al total de la
  // orden (bug de precio, preferencia manipulada, etc.). Dejamos rastro del pago
  // pero la orden queda sin pagar para revisión manual en el panel.
  if (isNowPaid && payment.transaction_amount != null) {
    const paidCents = Math.round(payment.transaction_amount * 100);
    const TOLERANCE_CENTS = 100; // 1 peso de margen por redondeos
    if (paidCents < orderRow.total_cents - TOLERANCE_CENTS) {
      console.error(
        `[mp-webhook] SUBPAGO order ${orderNumber}: pagó ${paidCents}c, total ${orderRow.total_cents}c — NO se marca paid`,
      );
      await supabase
        .from('orders')
        .update({
          mp_payment_id: String(payment.id),
          payment_status: `underpaid:${payment.status}`,
        })
        .eq('id', orderRow.id);
      return NextResponse.json({
        ok: true,
        flagged: 'amount_mismatch',
        order_number: orderNumber,
        paid_cents: paidCents,
        total_cents: orderRow.total_cents,
      });
    }
  }

  const update: Record<string, unknown> = {
    status: newOrderStatus,
    mp_payment_id: String(payment.id),
    payment_status: payment.status,
  };
  if (isNowPaid && !orderRow.paid_at) {
    update.paid_at = new Date().toISOString();
  }

  const { error: updateErr } = await supabase
    .from('orders')
    .update(update)
    .eq('id', orderRow.id);

  if (updateErr) {
    console.error('[mp-webhook] update failed:', updateErr.message);
    return NextResponse.json(
      { ok: false, error: updateErr.message },
      { status: 500 },
    );
  }

  // Si el pago se rechazó/canceló/reembolsó → devolver el stock (base + ML).
  // Idempotente (claim sobre stock_released_at); cubre la 3ra puerta de
  // cancelación además del panel admin y el cron de abandonados.
  if (newOrderStatus === 'cancelled' || newOrderStatus === 'refunded') {
    await releaseOrderStock(orderRow.id);
  }

  // Emails — solo en la transición a `paid` (no en re-procesamientos).
  if (isNowPaid && wasUnpaid) {
    const { data: items } = await supabase
      .from('order_items')
      .select(
        'product_name, brand_name, variant_sku, quantity, unit_price_cents, variant_attributes',
      )
      .eq('order_id', orderRow.id);

    const itemsForEmail = (items ?? []).map((it) => ({
      productName: it.product_name,
      brandName: it.brand_name ?? '',
      sku: it.variant_sku,
      quantity: it.quantity,
      unitPriceCents: it.unit_price_cents,
    }));

    const method: 'delivery' | 'branch' | 'pickup' =
      orderRow.shipping_method === 'pickup'
        ? 'pickup'
        : orderRow.shipping_method === 'branch'
          ? 'branch'
          : 'delivery';
    const isPickup = method === 'pickup';
    const isDelivery = method === 'delivery';
    const businessAddress = (() => {
      const parts = [
        process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_STREET,
        process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_LOCALITY,
        process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_REGION,
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(', ') : null;
    })();

    const customerData: CustomerEmailData = {
      orderNumber: orderRow.order_number,
      customerName: orderRow.customer_name,
      totalCents: orderRow.total_cents,
      subtotalCents: orderRow.subtotal_cents,
      shippingCents: orderRow.shipping_cents,
      items: itemsForEmail,
      shippingMethod: method,
      branchName: orderRow.shipping_agency_name,
      shippingAddress: isDelivery
        ? {
            recipientName: orderRow.shipping_recipient_name ?? orderRow.customer_name,
            street: orderRow.shipping_street ?? '',
            number: orderRow.shipping_number ?? '',
            apartment: orderRow.shipping_apartment,
            city: orderRow.shipping_city ?? '',
            province: orderRow.shipping_province ?? '',
            postalCode: orderRow.shipping_postal_code ?? '',
          }
        : null,
      pickupAddress: isPickup ? businessAddress : null,
      paymentId: String(payment.id),
    };

    const customerSend = await sendOrderConfirmationToCustomer({
      to: orderRow.customer_email,
      data: customerData,
    });
    if (!customerSend.ok) {
      console.error('[mp-webhook] customer email failed:', customerSend.error);
    }

    const adminData: AdminEmailData = {
      ...customerData,
      orderId: orderRow.id,
      customerEmail: orderRow.customer_email,
      customerPhone: orderRow.customer_phone,
      shippingAddress: customerData.shippingAddress
        ? {
            ...customerData.shippingAddress,
            phone: orderRow.shipping_phone,
          }
        : null,
    };

    const adminSend = await sendOrderNotificationToAdmin({ data: adminData });
    if (!adminSend.ok) {
      console.error('[mp-webhook] admin email failed:', adminSend.error);
    }
  }

  return NextResponse.json({
    ok: true,
    verified: sigCheck.verified,
    order_id: orderRow.id,
    order_number: orderRow.order_number,
    status: newOrderStatus,
  });
}

/**
 * GET para health-check del endpoint (útil para validar la URL desde el
 * panel de MP antes de configurar el webhook).
 */
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'mp-webhook' });
}
