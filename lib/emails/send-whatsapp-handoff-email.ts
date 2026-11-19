import 'server-only';
import { getAdminEmail, getFromAddress, getResendClient } from './client';

export type WhatsAppHandoffInput = {
  /** Número del cliente (formato internacional, sin "+"). */
  waId: string;
  /** Nombre del perfil de WhatsApp del cliente, si lo hay. */
  profileName: string | null;
  /** Por qué se derivó, en una línea (receta, queja, pidió hablar con una persona...). */
  motivo: string;
  /** Últimos mensajes de la conversación, del más viejo al más nuevo. */
  ultimosMensajes: Array<{ quien: 'cliente' | 'bot' | 'equipo'; texto: string }>;
};

/** A dónde llegan los avisos: WHATSAPP_ALERT_EMAIL, y si no está, el mail del founder. */
function destinatario(): string | null {
  const dedicado = process.env.WHATSAPP_ALERT_EMAIL?.trim();
  return dedicado && dedicado.length > 0 ? dedicado : getAdminEmail();
}

/**
 * Avisa al equipo que un cliente necesita a una persona en WhatsApp.
 *
 * Best-effort: si el mail falla se loguea y listo; el bot nunca se cae por no
 * poder avisar. Devuelve true si se mandó, para que el que llama lo registre.
 */
export async function sendWhatsAppHandoffEmail(input: WhatsAppHandoffInput): Promise<boolean> {
  const to = destinatario();
  if (!to) {
    console.warn('[whatsapp-handoff] sin WHATSAPP_ALERT_EMAIL ni BUSINESS_ADMIN_EMAIL, no aviso');
    return false;
  }

  const nombre = input.profileName?.trim() || 'Cliente sin nombre en WhatsApp';
  const chat = `https://wa.me/${encodeURIComponent(input.waId)}`;

  const lineas = input.ultimosMensajes.map(
    (m) => `${m.quien === 'cliente' ? 'Cliente' : m.quien === 'bot' ? 'Asistente' : 'Equipo'}: ${m.texto}`,
  );

  const html = `<!doctype html>
<html lang="es-AR"><body style="margin:0;padding:24px;background:#f4f0e9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0e1d33">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px">
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#7e5f26">Óptica Carballo · WhatsApp</p>
    <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3">${escaparHtml(nombre)} necesita que le contestes</h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#3d4658"><strong>Motivo:</strong> ${escaparHtml(input.motivo)}</p>
    <div style="background:#f4f0e9;border-radius:8px;padding:16px;margin:0 0 24px;font-size:14px;line-height:1.6">
      ${lineas.map((l) => `<p style="margin:0 0 8px">${escaparHtml(l)}</p>`).join('')}
    </div>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#3d4658">El asistente dejó de contestar esta conversación. Respondé desde la app WhatsApp Business de la óptica.</p>
    <a href="${chat}" style="display:inline-block;background:#0e1d33;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px">Abrir el chat</a>
  </div>
</body></html>`;

  try {
    // El SDK de Resend NO tira error cuando la API rechaza el envío: devuelve
    // `{ data, error }`. Hay que mirar `error`, si no un mail fallido se
    // reportaría como enviado.
    const { error } = await getResendClient().emails.send({
      from: getFromAddress(),
      to,
      // Sin datos del cliente en el asunto: el asunto se ve en notificaciones y listas.
      subject: '[WhatsApp] Un cliente necesita que lo atienda una persona',
      html,
      text: `${nombre} necesita que le contestes.\n\nMotivo: ${input.motivo}\n\n${lineas.join('\n')}\n\nAbrir el chat: ${chat}`,
    });
    if (error) {
      console.error('[whatsapp-handoff] Resend rechazó el aviso:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[whatsapp-handoff] no pude mandar el aviso:', err);
    return false;
  }
}

function escaparHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
