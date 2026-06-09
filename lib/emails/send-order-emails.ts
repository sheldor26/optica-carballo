import 'server-only';
import { getResendClient, getFromAddress, getAdminEmail } from './client';
import {
  buildCustomerOrderEmail,
  type CustomerEmailData,
} from './templates/order-confirmation-customer';
import {
  buildAdminOrderEmail,
  type AdminEmailData,
} from './templates/order-notification-admin';
import {
  buildStatusUpdateEmail,
  type StatusUpdateEmailData,
} from './templates/order-status-update-customer';

export type SendResult = { ok: true; id: string } | { ok: false; error: string };

/**
 * Manda el email de confirmación de pago al cliente.
 * Best-effort: si Resend falla, log + retorna error pero NO tira excepción
 * (el webhook MP no debe retornar 500 por un fallo de email — sino MP
 * reintenta el webhook indefinidamente).
 */
export async function sendOrderConfirmationToCustomer(args: {
  to: string;
  data: CustomerEmailData;
}): Promise<SendResult> {
  const { subject, html, text } = buildCustomerOrderEmail(args.data);

  try {
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: getFromAddress(),
      to: args.to,
      subject,
      html,
      text,
    });

    if (result.error) {
      return { ok: false, error: result.error.message };
    }
    return { ok: true, id: result.data?.id ?? 'unknown' };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Manda el email al cliente cuando la óptica cambia el estado de su pedido
 * (preparing / reviewed / shipped / delivered). Disparado desde la server
 * action del panel admin — el trigger DB NO puede mandar emails.
 *
 * Best-effort: si Resend falla, retorna error pero NO tira excepción (el
 * cambio de estado ya se persistió; un email caído no debe revertirlo).
 */
export async function sendOrderStatusUpdateToCustomer(args: {
  to: string;
  data: StatusUpdateEmailData;
}): Promise<SendResult> {
  const { subject, html, text } = buildStatusUpdateEmail(args.data);

  try {
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: getFromAddress(),
      to: args.to,
      subject,
      html,
      text,
    });

    if (result.error) {
      return { ok: false, error: result.error.message };
    }
    return { ok: true, id: result.data?.id ?? 'unknown' };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Manda el email administrativo al founder con la info del pedido pagado.
 * Si `BUSINESS_ADMIN_EMAIL` no está configurado, devuelve `{ok:true, id:'skipped'}`
 * sin hacer nada (no es error — es feature).
 */
export async function sendOrderNotificationToAdmin(args: {
  data: AdminEmailData;
}): Promise<SendResult> {
  const adminEmail = getAdminEmail();
  if (!adminEmail) {
    return { ok: true, id: 'skipped (no BUSINESS_ADMIN_EMAIL)' };
  }

  const { subject, html, text } = buildAdminOrderEmail(args.data);

  try {
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: getFromAddress(),
      to: adminEmail,
      subject,
      html,
      text,
    });

    if (result.error) {
      return { ok: false, error: result.error.message };
    }
    return { ok: true, id: result.data?.id ?? 'unknown' };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Avisa al cliente que la factura de su pedido está disponible (link al PDF).
 * Disparado desde el panel admin al cargar la factura, si el admin tilda
 * "avisar por mail". Best-effort (no tira si Resend falla).
 */
export async function sendInvoiceToCustomer(args: {
  to: string;
  customerName: string;
  orderNumber: string;
  invoiceUrl: string;
  orderUrl?: string | null;
}): Promise<SendResult> {
  const subject = `Tu factura del pedido ${args.orderNumber} — Óptica Carballo`;
  const text =
    `Hola ${args.customerName},\n\n` +
    `Ya está disponible la factura de tu pedido ${args.orderNumber}.\n\n` +
    `Verla o descargarla: ${args.invoiceUrl}\n\n` +
    `Gracias por tu compra.\nÓptica Carballo`;
  const html =
    `<p>Hola ${args.customerName},</p>` +
    `<p>Ya está disponible la <strong>factura</strong> de tu pedido <strong>${args.orderNumber}</strong>.</p>` +
    `<p><a href="${args.invoiceUrl}">Ver o descargar la factura</a></p>` +
    (args.orderUrl ? `<p><a href="${args.orderUrl}">Ver el pedido en tu cuenta</a></p>` : '') +
    `<p>Gracias por tu compra.<br/>Óptica Carballo</p>`;

  try {
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: getFromAddress(),
      to: args.to,
      subject,
      html,
      text,
    });
    if (result.error) return { ok: false, error: result.error.message };
    return { ok: true, id: result.data?.id ?? 'unknown' };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
