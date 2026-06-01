import { emailLayout, escapeHtml } from './shared';
import type { OrderStatus } from '@/lib/orders/types';

export type StatusUpdateEmailData = {
  orderNumber: string;
  customerName: string;
  /** Status nuevo. Solo se construye email para los notificables. */
  status: Extract<
    OrderStatus,
    'preparing' | 'reviewed' | 'shipped' | 'delivered'
  >;
  /** Nº de seguimiento (solo relevante en `shipped`). */
  trackingNumber?: string | null;
  /** Nota opcional cargada por la óptica al cambiar el estado. */
  note?: string | null;
  /** URL al detalle del pedido en la cuenta del cliente. */
  orderUrl?: string | null;
};

type Copy = { subject: string; heading: string; intro: string };

/**
 * Copy por estado. Tono cálido, español argentino, honesto (sin prometer
 * tiempos que no controlamos). El paso "Revisado por óptica" comunica el
 * diferencial real: María Carlota es la regente matriculada.
 */
function copyFor(
  status: StatusUpdateEmailData['status'],
  orderNumber: string,
): Copy {
  switch (status) {
    case 'preparing':
      return {
        subject: `Estamos preparando tu pedido ${orderNumber} — Óptica Carballo`,
        heading: 'Empezamos a preparar tu pedido',
        intro:
          'Ya estamos armando tu pedido con tus productos. Te avisamos en cada paso.',
      };
    case 'reviewed':
      return {
        subject: `Tu pedido ${orderNumber} fue revisado por óptica matriculada`,
        heading: 'Tu pedido fue revisado por óptica matriculada',
        intro:
          'Una óptica matriculada controló y aprobó el armado de tu pedido antes de despacharlo. Es un control que hacemos en cada compra.',
      };
    case 'shipped':
      return {
        subject: `Tu pedido ${orderNumber} va en camino — Óptica Carballo`,
        heading: 'Tu pedido va en camino',
        intro: 'Despachamos tu pedido. Ya está viajando a destino.',
      };
    case 'delivered':
      return {
        subject: `Tu pedido ${orderNumber} fue entregado — Óptica Carballo`,
        heading: '¡Tu pedido llegó!',
        intro:
          'Tu pedido fue marcado como entregado. ¡Que lo disfrutes! Si algo no salió como esperabas, respondé este email y lo resolvemos.',
      };
  }
}

export function buildStatusUpdateEmail(data: StatusUpdateEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const { subject, heading, intro } = copyFor(data.status, data.orderNumber);

  const trackingBlock =
    data.status === 'shipped' && data.trackingNumber
      ? `
    <table role="presentation" width="100%" style="margin:0 0 20px;background:#f9fafb;border-radius:6px;">
      <tr>
        <td style="padding:12px 16px;color:#52525b;font-size:13px;">Número de seguimiento</td>
        <td style="padding:12px 16px;text-align:right;font-family:'SF Mono',Menlo,Consolas,monospace;color:#18181b;font-weight:700;">${escapeHtml(data.trackingNumber)}</td>
      </tr>
    </table>`
      : '';

  const noteBlock = data.note
    ? `
    <p style="margin:0 0 20px;padding:12px 16px;background:#f9fafb;border-radius:6px;color:#52525b;font-size:14px;line-height:1.6;">
      ${escapeHtml(data.note)}
    </p>`
    : '';

  const orderLinkBlock = data.orderUrl
    ? `
    <p style="margin:24px 0 0;">
      <a href="${escapeHtml(data.orderUrl)}" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 20px;border-radius:6px;">Ver mi pedido</a>
    </p>`
    : '';

  const body = `
    <h1 style="margin:0 0 12px;font-size:22px;color:#18181b;">${escapeHtml(heading)}</h1>
    <p style="margin:0 0 20px;color:#52525b;font-size:14px;line-height:1.5;">
      Hola ${escapeHtml(data.customerName)}, ${intro}
    </p>

    <table role="presentation" width="100%" style="margin:0 0 20px;background:#f9fafb;border-radius:6px;">
      <tr>
        <td style="padding:12px 16px;color:#52525b;font-size:13px;">Número de orden</td>
        <td style="padding:12px 16px;text-align:right;font-family:'SF Mono',Menlo,Consolas,monospace;color:#18181b;font-weight:700;">${escapeHtml(data.orderNumber)}</td>
      </tr>
    </table>

    ${trackingBlock}
    ${noteBlock}
    ${orderLinkBlock}

    <p style="margin:24px 0 0;color:#52525b;font-size:13px;line-height:1.5;">
      Si tenés alguna duda, respondé este email y te respondemos a la brevedad.
    </p>
  `;

  const textLines = [
    heading,
    '',
    `Hola ${data.customerName}, ${intro}`,
    '',
    `Número de orden: ${data.orderNumber}`,
    data.status === 'shipped' && data.trackingNumber
      ? `Número de seguimiento: ${data.trackingNumber}`
      : '',
    data.note ? `\n${data.note}` : '',
    data.orderUrl ? `\nVer tu pedido: ${data.orderUrl}` : '',
    '',
    'Cualquier duda, respondé este email.',
  ].filter(Boolean);

  return {
    subject,
    html: emailLayout({
      title: subject,
      previewText: intro,
      body,
    }),
    text: textLines.join('\n'),
  };
}
