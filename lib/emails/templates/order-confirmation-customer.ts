import { emailLayout, escapeHtml, fmtPrice } from './shared';

export type CustomerEmailData = {
  orderNumber: string;
  customerName: string;
  totalCents: number;
  subtotalCents: number;
  shippingCents: number;
  items: Array<{
    productName: string;
    brandName: string;
    sku: string;
    quantity: number;
    unitPriceCents: number;
  }>;
  shippingMethod?: 'delivery' | 'branch' | 'pickup';
  /** Solo para branch. Nombre/dirección de la sucursal del Correo elegida. */
  branchName?: string | null;
  /** null cuando shippingMethod === 'pickup' (retiro en local). */
  shippingAddress: {
    recipientName: string;
    street: string;
    number: string;
    apartment: string | null;
    city: string;
    province: string;
    postalCode: string;
  } | null;
  /** Solo para pickup. Dirección del local. */
  pickupAddress?: string | null;
  paymentId: string | null;
};

export function buildCustomerOrderEmail(data: CustomerEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const itemsRows = data.items
    .map(
      (it) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f4f4f5;">
            <div style="color:#18181b;font-weight:600;">${escapeHtml(it.productName)}</div>
            <div style="color:#71717a;font-size:12px;">${escapeHtml(it.brandName)} · SKU ${escapeHtml(it.sku)}</div>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #f4f4f5;text-align:center;color:#52525b;">${it.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f4f4f5;text-align:right;color:#18181b;font-weight:600;">${fmtPrice(it.unitPriceCents * it.quantity)}</td>
        </tr>`,
    )
    .join('');

  const isPickup = data.shippingMethod === 'pickup';
  const isBranch = data.shippingMethod === 'branch';
  const apartmentLine = data.shippingAddress?.apartment
    ? ` · ${escapeHtml(data.shippingAddress.apartment)}`
    : '';
  const deliveryBlock = data.shippingAddress
    ? `
    <h2 style="margin:0 0 8px;font-size:16px;color:#18181b;">Enviamos a</h2>
    <p style="margin:0 0 20px;color:#52525b;font-size:14px;line-height:1.6;">
      ${escapeHtml(data.shippingAddress.recipientName)}<br/>
      ${escapeHtml(data.shippingAddress.street)} ${escapeHtml(data.shippingAddress.number)}${apartmentLine}<br/>
      ${escapeHtml(data.shippingAddress.city)}, ${escapeHtml(data.shippingAddress.province)} (${escapeHtml(data.shippingAddress.postalCode)})
    </p>`
    : '';
  const pickupBlock = isPickup
    ? `
    <h2 style="margin:0 0 8px;font-size:16px;color:#18181b;">Retirás en nuestro local</h2>
    <p style="margin:0 0 8px;color:#52525b;font-size:14px;line-height:1.6;">
      ${data.pickupAddress ? escapeHtml(data.pickupAddress) : 'Óptica Carballo'}
    </p>
    <p style="margin:0 0 20px;color:#71717a;font-size:13px;line-height:1.5;">
      Te avisamos por WhatsApp cuando tu pedido esté listo para retirar.
    </p>`
    : '';
  const branchBlock = isBranch
    ? `
    <h2 style="margin:0 0 8px;font-size:16px;color:#18181b;">Retirás en sucursal del Correo</h2>
    <p style="margin:0 0 8px;color:#52525b;font-size:14px;line-height:1.6;">
      ${data.branchName ? escapeHtml(data.branchName) : 'Sucursal del Correo Argentino'}
    </p>
    <p style="margin:0 0 20px;color:#71717a;font-size:13px;line-height:1.5;">
      Te avisamos por WhatsApp cuando tu pedido esté en la sucursal para retirar.
    </p>`
    : '';

  const body = `
    <h1 style="margin:0 0 12px;font-size:22px;color:#18181b;">¡Gracias por tu compra, ${escapeHtml(data.customerName)}!</h1>
    <p style="margin:0 0 20px;color:#52525b;font-size:14px;line-height:1.5;">
      Recibimos tu pago y ya estamos preparando tu pedido. Te mantenemos al tanto cuando lo despachemos.
    </p>

    <table role="presentation" width="100%" style="margin-bottom:20px;background:#f9fafb;border-radius:6px;">
      <tr>
        <td style="padding:12px 16px;color:#52525b;font-size:13px;">Número de orden</td>
        <td style="padding:12px 16px;text-align:right;font-family:'SF Mono',Menlo,Consolas,monospace;color:#18181b;font-weight:700;">${escapeHtml(data.orderNumber)}</td>
      </tr>
      ${
        data.paymentId
          ? `<tr>
        <td style="padding:0 16px 12px;color:#52525b;font-size:13px;">ID de pago Mercado Pago</td>
        <td style="padding:0 16px 12px;text-align:right;font-family:'SF Mono',Menlo,Consolas,monospace;color:#71717a;font-size:12px;">${escapeHtml(data.paymentId)}</td>
      </tr>`
          : ''
      }
    </table>

    <h2 style="margin:0 0 8px;font-size:16px;color:#18181b;">Productos</h2>
    <table role="presentation" width="100%" style="margin-bottom:20px;border-collapse:collapse;">
      <thead>
        <tr>
          <th align="left" style="padding:8px 0;border-bottom:2px solid #e4e4e7;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Producto</th>
          <th align="center" style="padding:8px 0;border-bottom:2px solid #e4e4e7;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Cant.</th>
          <th align="right" style="padding:8px 0;border-bottom:2px solid #e4e4e7;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Importe</th>
        </tr>
      </thead>
      <tbody>${itemsRows}</tbody>
    </table>

    <table role="presentation" width="100%" style="margin-bottom:20px;">
      <tr>
        <td style="padding:4px 0;color:#52525b;font-size:14px;">Subtotal</td>
        <td style="padding:4px 0;text-align:right;color:#18181b;">${fmtPrice(data.subtotalCents)}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#52525b;font-size:14px;">Envío</td>
        <td style="padding:4px 0;text-align:right;color:#18181b;">${data.shippingCents === 0 ? '<span style="color:#16a34a;">Gratis</span>' : fmtPrice(data.shippingCents)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0 4px;border-top:1px solid #e4e4e7;color:#18181b;font-weight:700;">Total pagado</td>
        <td style="padding:8px 0 4px;border-top:1px solid #e4e4e7;text-align:right;color:#18181b;font-weight:700;font-size:18px;">${fmtPrice(data.totalCents)}</td>
      </tr>
    </table>

    ${isPickup ? pickupBlock : isBranch ? branchBlock : deliveryBlock}

    <p style="margin:24px 0 0;color:#52525b;font-size:13px;line-height:1.5;">
      Si tenés alguna duda, respondé este email y te respondemos a la brevedad.
    </p>
  `;

  const subject = `Confirmamos tu pedido ${data.orderNumber} — Óptica Carballo`;
  const text = [
    `¡Gracias por tu compra, ${data.customerName}!`,
    '',
    `Número de orden: ${data.orderNumber}`,
    data.paymentId ? `ID de pago: ${data.paymentId}` : '',
    `Total pagado: ${fmtPrice(data.totalCents)}`,
    '',
    'Productos:',
    ...data.items.map(
      (it) =>
        `  - ${it.productName} (${it.brandName}) x${it.quantity} = ${fmtPrice(it.unitPriceCents * it.quantity)}`,
    ),
    '',
    `Subtotal: ${fmtPrice(data.subtotalCents)}`,
    `Envío: ${data.shippingCents === 0 ? 'Gratis' : fmtPrice(data.shippingCents)}`,
    `Total: ${fmtPrice(data.totalCents)}`,
    '',
    ...(isPickup
      ? [
          'Retirás en nuestro local:',
          `  ${data.pickupAddress ?? 'Óptica Carballo'}`,
          '  Te avisamos por WhatsApp cuando esté listo.',
        ]
      : isBranch
        ? [
            'Retirás en sucursal del Correo:',
            `  ${data.branchName ?? 'Sucursal del Correo Argentino'}`,
            '  Te avisamos por WhatsApp cuando esté en la sucursal.',
          ]
      : data.shippingAddress
        ? [
            'Enviamos a:',
            `  ${data.shippingAddress.recipientName}`,
            `  ${data.shippingAddress.street} ${data.shippingAddress.number}${apartmentLine}`,
            `  ${data.shippingAddress.city}, ${data.shippingAddress.province} (${data.shippingAddress.postalCode})`,
          ]
        : []),
    '',
    'Cualquier duda, respondé este email.',
  ]
    .filter(Boolean)
    .join('\n');

  return {
    subject,
    html: emailLayout({
      title: subject,
      previewText: `Recibimos tu pago. Tu orden ${data.orderNumber} está en preparación.`,
      body,
    }),
    text,
  };
}
