import 'server-only';

/**
 * Cliente mínimo de la WhatsApp Cloud API (Graph API de Meta). `fetch` directo,
 * sin librerías (regla 6 de CLAUDE.md), igual que el cliente de Instagram.
 *
 * Variables de entorno (valores SOLO en .env.local y Vercel, nunca en el repo):
 *   WHATSAPP_ACCESS_TOKEN     token de usuario del sistema (el temporal de 24 h
 *                             del dashboard sirve para probar, no para producción)
 *   WHATSAPP_PHONE_NUMBER_ID  id del número en la API (NO es el teléfono)
 *   WHATSAPP_GRAPH_VERSION    opcional, default v25.0
 */

function config(): { token: string; phoneNumberId: string; version: string } {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    throw new Error('WhatsApp: faltan WHATSAPP_ACCESS_TOKEN o WHATSAPP_PHONE_NUMBER_ID');
  }
  return { token, phoneNumberId, version: process.env.WHATSAPP_GRAPH_VERSION || 'v25.0' };
}

async function graphPost(body: Record<string, unknown>): Promise<unknown> {
  const { token, phoneNumberId, version } = config();
  const res = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messaging_product: 'whatsapp', ...body }),
  });

  if (!res.ok) {
    // El mensaje de error de Meta no incluye el token; igual lo recortamos.
    const detail = await res.text().catch(() => '');
    throw new Error(`WhatsApp API ${res.status}: ${detail.slice(0, 300)}`);
  }
  return res.json();
}

/**
 * Manda un mensaje de texto. Devuelve el wamid del mensaje saliente, que se
 * guarda para que el eco de ese mismo mensaje no se confunda con una persona.
 */
export async function sendWhatsAppText(to: string, body: string): Promise<string | null> {
  const data = (await graphPost({
    to,
    type: 'text',
    // preview_url: WhatsApp arma la tarjeta del link a la ficha del producto.
    text: { preview_url: true, body },
  })) as { messages?: Array<{ id?: string }> };
  return data.messages?.[0]?.id ?? null;
}

/** Marca el mensaje del cliente como leído (tildes azules). Best-effort. */
export async function markWhatsAppRead(wamid: string): Promise<void> {
  try {
    await graphPost({ status: 'read', message_id: wamid });
  } catch (err) {
    console.warn('[whatsapp] no pude marcar como leído:', String(err));
  }
}
