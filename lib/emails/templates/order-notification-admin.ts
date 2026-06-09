import { emailLayout, escapeHtml, fmtPrice } from './shared';

export type AdminEmailData = {
  orderNumber: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
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
  /** Solo para branch. Nombre/dirección de la sucursal del Correo a despachar. */
  branchName?: string | null;
  shippingAddress: {
    recipientName: string;
    street: string;
    number: string;
    apartment: string | null;
    city: string;
    province: string;
    postalCode: string;
    phone: string | null;
  } | null;
  pickupAddress?: string | null;
  paymentId: string | null;
};

/**
 * Email administrativo al founder cuando una orden recibe pago confirmado.
 * Incluye todos los datos necesarios para:
 *   1. Facturar manualmente con AFIP (regla actual: sin Tusfacturas en V1).
 *   2. Imprimir rótulo de envío en MiCorreo (Correo Argentino).
 *   3. Contactar al cliente si hace falta.
 */
export function buildAdminOrderEmail(data: AdminEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const itemsRows = data.items
    .map(
      (it) => `
        <tr>
          <td style="padding:6px 0;border-bottom:1px solid #f4f4f5;font-size:13px;">
            <div style="color:#18181b;font-weight:600;">${escapeHtml(it.productName)}</div>
            <div style="color:#71717a;font-size:11px;">${escapeHtml(it.brandName)} · SKU <code>${escapeHtml(it.sku)}</code></div>
          </td>
          <td style="padding:6px 0;border-bottom:1px solid #f4f4f5;text-align:center;color:#52525b;">${it.quantity}</td>
          <td style="padding:6px 0;border-bottom:1px solid #f4f4f5;text-align:right;color:#18181b;font-weight:600;">${fmtPrice(it.unitPriceCents * it.quantity)}</td>
        </tr>`,
    )
    .join('');

  const isPickup = data.shippingMethod === 'pickup';
  const isBranch = data.shippingMethod === 'branch';
  const apartmentLine = data.shippingAddress?.apartment
    ? ` · ${escapeHtml(data.shippingAddress.apartment)}`
    : '';
  const phoneLine = data.shippingAddress?.phone
    ? `<br/>Tel envío: ${escapeHtml(data.shippingAddress.phone)}`
    : '';
  const shippingBlockHtml = isPickup
    ? `
    <h2 style="margin:0 0 8px;font-size:15px;color:#18181b;">⚠️ RETIRO EN LOCAL</h2>
    <p style="margin:0 0 20px;color:#52525b;font-size:13px;line-height:1.6;">
      Cliente retira en: ${escapeHtml(data.pickupAddress ?? 'Óptica Carballo')}<br/>
      Contactar por WhatsApp para coordinar fecha/hora.
    </p>`
    : isBranch
      ? `
    <h2 style="margin:0 0 8px;font-size:15px;color:#18181b;">📦 ENVÍO A SUCURSAL DEL CORREO</h2>
    <p style="margin:0 0 20px;color:#52525b;font-size:13px;line-height:1.6;">
      Despachar a sucursal: <strong>${escapeHtml(data.branchName ?? 'Sucursal del Correo')}</strong><br/>
      Destinatario: ${escapeHtml(data.customerName)}${data.customerPhone ? ` · Tel: ${escapeHtml(data.customerPhone)}` : ''}
    </p>`
      : data.shippingAddress
      ? `
    <h2 style="margin:0 0 8px;font-size:15px;color:#18181b;">Dirección de envío</h2>
    <p style="margin:0 0 20px;color:#52525b;font-size:13px;line-height:1.6;">
      ${escapeHtml(data.shippingAddress.recipientName)}<br/>
      ${escapeHtml(data.shippingAddress.street)} ${escapeHtml(data.shippingAddress.number)}${apartmentLine}<br/>
      ${escapeHtml(data.shippingAddress.city)}, ${escapeHtml(data.shippingAddress.province)} (${escapeHtml(data.shippingAddress.postalCode)})${phoneLine}
    </p>`
      : '';

  const body = `
    <h1 style="margin:0 0 8px;font-size:20px;color:#18181b;">💰 Nuevo pago recibido</h1>
    <p style="margin:0 0 20px;color:#52525b;font-size:14px;line-height:1.5;">
      La orden <strong style="font-family:'SF Mono',Menlo,Consolas,monospace;">${escapeHtml(data.orderNumber)}</strong>
      fue pagada y está lista para preparar y despachar.
    </p>

    <table role="presentation" width="100%" style="margin-bottom:20px;background:#fefce8;border-left:3px solid #eab308;border-radius:4px;">
      <tr>
        <td style="padding:14px 16px;color:#713f12;font-size:13px;line-height:1.6;">
          <strong>Acciones a hacer manualmente</strong> (recordatorio V1):<br/>
          1. <strong>Facturar electrónicamente</strong> en AFIP (Tusfacturas pendiente).<br/>
          2. <strong>Imprimir rótulo</strong> desde MiCorreo (Correo Argentino).<br/>
          3. <strong>Empaquetar</strong> y entregar al correo.<br/>
          4. <strong>Mandar tracking</strong> al cliente cuando despachás.
        </td>
      </tr>
    </table>

    <h2 style="margin:0 0 8px;font-size:15px;color:#18181b;">Cliente</h2>
    <table role="presentation" width="100%" style="margin-bottom:20px;font-size:13px;">
      <tr><td style="padding:3px 0;color:#52525b;width:120px;">Nombre</td><td style="padding:3px 0;color:#18181b;">${escapeHtml(data.customerName)}</td></tr>
      <tr><td style="padding:3px 0;color:#52525b;">Email</td><td style="padding:3px 0;color:#18181b;"><a href="mailto:${escapeHtml(data.customerEmail)}" style="color:#2563eb;">${escapeHtml(data.customerEmail)}</a></td></tr>
      ${data.customerPhone ? `<tr><td style="padding:3px 0;color:#52525b;">Tel</td><td style="padding:3px 0;color:#18181b;">${escapeHtml(data.customerPhone)}</td></tr>` : ''}
    </table>

    ${shippingBlockHtml}

    <h2 style="margin:0 0 8px;font-size:15px;color:#18181b;">Productos ${isPickup ? 'a preparar' : 'a despachar'}</h2>
    <table role="presentation" width="100%" style="margin-bottom:20px;border-collapse:collapse;">
      <thead>
        <tr>
          <th align="left" style="padding:6px 0;border-bottom:2px solid #e4e4e7;color:#71717a;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Producto</th>
          <th align="center" style="padding:6px 0;border-bottom:2px solid #e4e4e7;color:#71717a;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Cant.</th>
          <th align="right" style="padding:6px 0;border-bottom:2px solid #e4e4e7;color:#71717a;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Importe</th>
        </tr>
      </thead>
      <tbody>${itemsRows}</tbody>
    </table>

    <table role="presentation" width="100%" style="margin-bottom:20px;">
      <tr><td style="padding:3px 0;color:#52525b;font-size:13px;">Subtotal</td><td style="padding:3px 0;text-align:right;color:#18181b;font-size:13px;">${fmtPrice(data.subtotalCents)}</td></tr>
      <tr><td style="padding:3px 0;color:#52525b;font-size:13px;">Envío</td><td style="padding:3px 0;text-align:right;color:#18181b;font-size:13px;">${data.shippingCents === 0 ? 'Gratis' : fmtPrice(data.shippingCents)}</td></tr>
      <tr><td style="padding:6px 0 3px;border-top:1px solid #e4e4e7;color:#18181b;font-weight:700;">Total</td><td style="padding:6px 0 3px;border-top:1px solid #e4e4e7;text-align:right;color:#18181b;font-weight:700;font-size:16px;">${fmtPrice(data.totalCents)}</td></tr>
    </table>

    ${
      data.paymentId
        ? `<p style="margin:20px 0 0;color:#71717a;font-size:11px;font-family:'SF Mono',Menlo,Consolas,monospace;">MP payment_id: ${escapeHtml(data.paymentId)} · order_id: ${escapeHtml(data.orderId)}</p>`
        : ''
    }
  `;

  const subject = `💰 Nuevo pago — ${data.orderNumber} (${fmtPrice(data.totalCents)})`;
  const text = [
    `Nuevo pago recibido — Óptica Carballo`,
    '',
    `Orden: ${data.orderNumber}`,
    `Total: ${fmtPrice(data.totalCents)}`,
    data.paymentId ? `MP payment_id: ${data.paymentId}` : '',
    '',
    'Cliente:',
    `  ${data.customerName} <${data.customerEmail}>`,
    data.customerPhone ? `  Tel: ${data.customerPhone}` : '',
    '',
    ...(isPickup
      ? [
          '⚠️ RETIRO EN LOCAL',
          `  Cliente retira en: ${data.pickupAddress ?? 'Óptica Carballo'}`,
          '  Contactar por WhatsApp para coordinar fecha/hora.',
        ]
      : isBranch
        ? [
            '📦 ENVÍO A SUCURSAL DEL CORREO',
            `  Despachar a sucursal: ${data.branchName ?? 'Sucursal del Correo'}`,
            `  Destinatario: ${data.customerName}${data.customerPhone ? ` · Tel: ${data.customerPhone}` : ''}`,
          ]
      : data.shippingAddress
        ? [
            'Dirección de envío:',
            `  ${data.shippingAddress.recipientName}`,
            `  ${data.shippingAddress.street} ${data.shippingAddress.number}${apartmentLine}`,
            `  ${data.shippingAddress.city}, ${data.shippingAddress.province} (${data.shippingAddress.postalCode})`,
          ]
        : []),
    '',
    'Productos:',
    ...data.items.map(
      (it) => `  - ${it.productName} (${it.brandName}) [${it.sku}] x${it.quantity} = ${fmtPrice(it.unitPriceCents * it.quantity)}`,
    ),
    '',
    `Subtotal: ${fmtPrice(data.subtotalCents)}`,
    `Envío: ${data.shippingCents === 0 ? 'Gratis' : fmtPrice(data.shippingCents)}`,
    `Total: ${fmtPrice(data.totalCents)}`,
    '',
    'Acciones manuales V1: facturar AFIP + imprimir rótulo + despachar + mandar tracking al cliente.',
  ]
    .filter(Boolean)
    .join('\n');

  return {
    subject,
    html: emailLayout({
      title: subject,
      previewText: `${data.customerName} pagó ${fmtPrice(data.totalCents)} — preparar despacho`,
      body,
      footerText: 'Email administrativo de Óptica Carballo. Generado automáticamente desde el webhook de Mercado Pago.',
    }),
    text,
  };
}
