/**
 * Helpers compartidos para templates de email. Inline-friendly (algunos
 * clientes de email ignoran el <head>).
 */

import { formatPriceCents } from '@/lib/format/currency';

/**
 * Escape básico de HTML para inserciones seguras en templates.
 * NO usar para URLs completas (usar encodeURI/encodeURIComponent en su lugar).
 */
export function escapeHtml(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function fmtPrice(cents: number): string {
  return formatPriceCents(cents);
}

/**
 * Wrapper HTML5 con estilos inline mínimos. Compatible con Gmail / Outlook /
 * Apple Mail / clientes mobile sin parser CSS sofisticado.
 */
export function emailLayout(args: {
  title: string;
  previewText: string;
  body: string;
  footerText?: string;
}): string {
  return `<!doctype html>
<html lang="es-AR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(args.title)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">
  ${escapeHtml(args.previewText)}
</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f4f4f5;padding:24px 0;">
  <tr>
    <td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="padding:24px 28px;border-bottom:1px solid #e4e4e7;">
            <strong style="font-size:16px;color:#18181b;">Óptica Carballo</strong>
          </td>
        </tr>
        <tr>
          <td style="padding:28px;">
            ${args.body}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 28px;border-top:1px solid #e4e4e7;color:#71717a;font-size:12px;line-height:1.5;">
            ${args.footerText ?? 'Recibiste este email porque hiciste una compra en Óptica Carballo. Si no fuiste vos, respondé y avisanos.'}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
