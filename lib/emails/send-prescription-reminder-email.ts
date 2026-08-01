import 'server-only';
import { getFromAddress, getResendClient } from './client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://opticacarballo.com.ar';

type PrescriptionReminderEmailInput = {
  toEmail: string;
  /** Fecha de emisión de la receta (`prescriptions.expires_at`, mal nombrado
   * en el schema — en realidad guarda la fecha de emisión, no de vencimiento). */
  issuedAt: string;
  unsubscribeToken: string;
};

/**
 * Recordatorio ANUAL de revisión de receta óptica — best-effort, no throw.
 *
 * Copy validado por `optical-expert` (2026-08-01): "vencimiento" es una
 * inferencia nuestra (emisión + PRESCRIPTION_VALIDITY_DAYS, ver
 * `lib/prescription/types.ts`), NO un dato médico certero — el copy NUNCA
 * afirma "tu receta venció", solo recomienda un control (regla dura del
 * negocio: no prometer/afirmar lo que no podemos garantizar). Un solo envío
 * (no serie), sin countdown, sin urgencia artificial.
 */
export async function sendPrescriptionReminderEmail(
  input: PrescriptionReminderEmailInput,
): Promise<void> {
  const subject = '¿Sigue actualizada tu receta de anteojos?';

  const issuedDate = new Date(input.issuedAt);
  const issuedLabel = new Intl.DateTimeFormat('es-AR', {
    month: 'long',
    year: 'numeric',
  }).format(issuedDate);

  const catalogUrl = `${SITE_URL}/anteojos-de-receta`;
  const unsubscribeUrl = `${SITE_URL}/api/prescription-reminders/unsubscribe?token=${input.unsubscribeToken}`;

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
              <h1 style="margin:0;font-size:22px;line-height:1.3;color:#111;font-weight:600;">
                ¿Sigue actualizada tu receta?
              </h1>
              <p style="margin:16px 0 0 0;font-size:15px;line-height:1.6;color:#444;">
                En ${issuedLabel} armamos tus anteojos con la receta que nos trajiste.
                Como recomendación general, las recetas ópticas suelen revisarse
                una vez al año, porque la graduación puede cambiar con el
                tiempo — más aún en chicos, en personas présbitas, o si hay
                alguna condición ocular en seguimiento.
              </p>
              <p style="margin:16px 0 0 0;font-size:15px;line-height:1.6;color:#444;">
                No tenemos forma de saber si tu vista cambió: eso solo lo
                puede confirmar tu oftalmólogo u optometrista. Si hace tiempo
                no hacés un control, es un buen momento para sacar turno.
              </p>
              <p style="margin:16px 0 0 0;font-size:15px;line-height:1.6;color:#444;">
                Si necesitás una receta actualizada para tu próxima compra, la
                vas a poder cargar acá:
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px;">
                <tr>
                  <td style="background:#111;border-radius:9999px;">
                    <a href="${catalogUrl}" style="display:inline-block;padding:12px 24px;color:#fff;text-decoration:none;font-size:14px;font-weight:500;">
                      Ver anteojos de receta →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0 0;font-size:12px;color:#999;line-height:1.5;">
                Este mensaje es informativo y no reemplaza la consulta con un
                profesional matriculado. Te escribimos porque compraste
                anteojos recetados con nosotros — si no querés recibir este
                recordatorio,
                <a href="${unsubscribeUrl}" style="color:#666;text-decoration:underline;">dejá de recibirlo acá</a>.
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
    console.error('[sendPrescriptionReminderEmail] error:', err);
  }
}
