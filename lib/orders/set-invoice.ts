import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendInvoiceToCustomer } from '@/lib/emails/send-order-emails';

export type SetInvoiceResult =
  | { ok: true; emailed: boolean; emailError?: string; cleared?: boolean }
  | { ok: false; error: string };

/**
 * Carga (o quita) el link de la factura de un pedido y, opcionalmente, le avisa
 * al cliente por mail. El link queda en `orders.invoice_url` → el cliente lo ve
 * como "Ver factura" en su cuenta.
 *
 * Lógica pura, SIN chequeo de auth — lo decide cada caller según de dónde venga
 * el pedido:
 *   - `setOrderInvoiceAction` (panel admin, humano): gatea con `requireAdmin()`.
 *   - `POST /api/internal/orders/[id]/invoice` (Facturador Óptica, máquina):
 *     gatea con `FACTURADOR_API_SECRET`.
 * Los dos terminan acá para que el mail que recibe el cliente sea siempre el
 * mismo, sin duplicar la lógica en dos lugares.
 */
export async function applyOrderInvoice(input: {
  orderId: string;
  invoiceUrl: string;
  notify: boolean;
}): Promise<SetInvoiceResult> {
  const url = input.invoiceUrl.trim();
  if (url && !/^https?:\/\/.+/i.test(url)) {
    return { ok: false, error: 'La URL debe empezar con http:// o https://' };
  }

  const supabase = createAdminClient();

  const { data: current, error: readErr } = await supabase
    .from('orders')
    .select('order_number, customer_name, customer_email')
    .eq('id', input.orderId)
    .maybeSingle();

  if (readErr || !current) {
    return { ok: false, error: 'No se encontró el pedido.' };
  }

  const { error: updErr } = await supabase
    .from('orders')
    .update({ invoice_url: url || null })
    .eq('id', input.orderId);

  if (updErr) {
    return { ok: false, error: `No se pudo guardar: ${updErr.message}` };
  }

  let emailed = false;
  let emailError: string | undefined;
  if (input.notify && url && current.customer_email) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? '';
    const res = await sendInvoiceToCustomer({
      to: current.customer_email,
      customerName: current.customer_name,
      orderNumber: current.order_number,
      invoiceUrl: url,
      orderUrl: siteUrl ? `${siteUrl}/mi-cuenta/pedidos/${input.orderId}` : null,
    });
    emailed = res.ok;
    if (!res.ok) emailError = res.error;
  }

  return { ok: true, emailed, emailError, cleared: !url };
}
