import 'server-only';
import { getFromAddress, getResendClient } from './client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://opticacarballo.com.ar';

type AlertEmailInput = {
  toEmail: string;
  productName: string;
  productUrl: string;
  reason: 'price_drop' | 'stock_back';
  currentPriceCents: number;
  previousPriceCents?: number | null;
  unsubscribeToken: string;
};

/**
 * Email best-effort cuando una alerta se activa. No throw — si falla, el CRON
 * sigue. Logs en console para debugging.
 *
 * Diseñado mobile-first (single column, max-width 560px). HTML inline porque
 * Gmail/Outlook stripe `<style>` y `<link>`.
 */
export async function sendAlertEmail(input: AlertEmailInput): Promise<void> {
  const subject =
    input.reason === 'price_drop'
      ? `${input.productName}: bajó el precio`
      : `${input.productName}: volvió el stock`;

  const headline =
    input.reason === 'price_drop'
      ? '¡Bajó el precio que estabas esperando!'
      : '¡Volvió el stock que estabas esperando!';

  const priceArs = (cents: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);

  const priceSection =
    input.reason === 'price_drop' && input.previousPriceCents
      ? `
        <p style="margin:0 0 8px 0;font-size:14px;color:#666;">
          Antes: <span style="text-decoration:line-through;">${priceArs(input.previousPriceCents)}</span>
        </p>
        <p style="margin:0;font-size:28px;font-weight:600;color:#111;">
          Ahora: ${priceArs(input.currentPriceCents)}
        </p>`
      : `
        <p style="margin:0;font-size:28px;font-weight:600;color:#111;">
          ${priceArs(input.currentPriceCents)}
        </p>`;

  const unsubscribeUrl = `${SITE_URL}/api/alerts/unsubscribe?token=${input.unsubscribeToken}`;

  const html = `<!doctype html>
<html lang="es-AR">
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f5f4;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:32px 24px 24px 24px;">
              <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#999;">
                Óptica Carballo
              </p>
              <h1 style="margin:0;font-size:24px;line-height:1.2;color:#111;font-weight:600;">
                ${headline}
              </h1>
              <p style="margin:16px 0 24px 0;font-size:16px;line-height:1.5;color:#444;">
                <strong>${input.productName}</strong>
              </p>
              ${priceSection}
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px;">
                <tr>
                  <td style="background:#111;border-radius:9999px;">
                    <a href="${input.productUrl}" style="display:inline-block;padding:12px 24px;color:#fff;text-decoration:none;font-size:14px;font-weight:500;">
                      Ver producto →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0 0;font-size:12px;color:#999;line-height:1.5;">
                Recibís este email porque creaste una alerta en Óptica Carballo.
                Si no querés recibir más avisos de este producto,
                <a href="${unsubscribeUrl}" style="color:#666;text-decoration:underline;">cancelá la suscripción</a>.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0 0;font-size:11px;color:#999;text-align:center;">
          Óptica Carballo · 30+ años en óptica
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: getFromAddress(),
      to: input.toEmail,
      subject,
      html,
    });
  } catch (err) {
    console.error('[sendAlertEmail] error:', err);
  }
}
