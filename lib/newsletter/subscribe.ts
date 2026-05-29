import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { getResendClient, getFromAddress } from '@/lib/emails/client';
import type { NewsletterSource, SubscribeResult } from '@/lib/newsletter/types';

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const SITE_NAME = 'Óptica Carballo';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://opticacarballo.com.ar';

/**
 * Suscribe un email al newsletter.
 *
 * Flujo:
 * 1. Normaliza email (trim + lowercase) + valida formato.
 * 2. UPSERT en `newsletter_subscribers` por `email` UNIQUE. Si ya existía,
 *    actualiza `source` + `metadata` sin error (idempotente).
 * 3. Si Resend está configurado, envía welcome email fire-and-forget.
 *    Si Resend falla o no está configurado, la suscripción sigue OK
 *    (el email es nice-to-have, no bloqueante).
 *
 * NO hace double-opt-in en iter 1. Si en el futuro queremos confirmar
 * vía email, se setea `confirmed_at = NULL` y se requiere link de
 * confirmación antes de marcar como activo.
 */
export async function subscribeEmail(args: {
  email: string;
  source: NewsletterSource;
}): Promise<SubscribeResult> {
  const email = args.email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    return { ok: false, error: 'invalid_email' };
  }

  const supabase = createAdminClient();

  // UPSERT: si el email ya existe, actualizamos source para trackear cuál
  // fue el último canal de captura. Sin error duplicado.
  const { error, data } = await supabase
    .from('newsletter_subscribers')
    .upsert(
      {
        email,
        source: args.source,
        unsubscribed_at: null, // si se había dado de baja, lo reactivamos al re-suscribirse
      },
      { onConflict: 'email', ignoreDuplicates: false },
    )
    .select('id, created_at, updated_at')
    .single();

  if (error) {
    console.error('[newsletter] upsert error', error);
    return { ok: false, error: 'server_error' };
  }

  // Heurística para detectar si ya existía: si created_at !== updated_at,
  // fue un update (existía). Si son iguales, es nuevo.
  const alreadyExisted = data
    ? new Date(data.created_at).getTime() !==
      new Date(data.updated_at).getTime()
    : false;

  // Welcome email: solo si es nuevo Y Resend está disponible.
  if (!alreadyExisted) {
    sendWelcomeEmail(email).catch((err) => {
      console.warn('[newsletter] welcome email failed (non-blocking)', err);
    });
  }

  return { ok: true, alreadyExisted };
}

/**
 * Envía welcome email. Fire-and-forget desde subscribeEmail. Si Resend
 * no está configurado, lanza Error que se loggea como warning.
 */
async function sendWelcomeEmail(email: string): Promise<void> {
  // getResendClient tira si no hay RESEND_API_KEY — el catch en el caller
  // lo trata como warning, no bloquea la suscripción.
  const resend = getResendClient();

  await resend.emails.send({
    from: getFromAddress(),
    to: email,
    subject: `Bienvenido a las novedades de ${SITE_NAME}`,
    text: buildWelcomeText(),
    html: buildWelcomeHtml(),
  });
}

function buildWelcomeText(): string {
  return [
    `Hola,`,
    ``,
    `Gracias por sumarte a las novedades de ${SITE_NAME}.`,
    ``,
    `Te vamos a avisar cuando lleguen nuevos modelos, colecciones o cuando haya algo que valga la pena.`,
    ``,
    `Mientras tanto, podés ver el catálogo en ${SITE_URL}.`,
    ``,
    `Si querés dejar de recibir estos emails, escribinos respondiendo este mensaje.`,
    ``,
    `Un saludo,`,
    `Equipo ${SITE_NAME}`,
  ].join('\n');
}

function buildWelcomeHtml(): string {
  // HTML simple, inline styles (mejor compatibilidad email clients).
  return `<!doctype html>
<html lang="es-AR">
<body style="margin:0;padding:24px;background:#f7f5f1;font-family:Georgia,serif;color:#1c1c1c;line-height:1.6">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;padding:32px;border-radius:12px;border:1px solid #e8e4dc">
    <h1 style="margin:0 0 16px;font-size:24px;font-weight:500;letter-spacing:-0.01em">
      Gracias por sumarte
    </h1>
    <p style="margin:0 0 16px;font-size:16px">
      Te diste de alta en las novedades de ${SITE_NAME}.
    </p>
    <p style="margin:0 0 16px;font-size:16px">
      Te vamos a avisar cuando lleguen nuevos modelos, colecciones o cuando haya algo que valga la pena.
    </p>
    <p style="margin:24px 0">
      <a href="${SITE_URL}" style="display:inline-block;background:#1c1c1c;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:24px;font-size:14px;font-weight:500;font-family:system-ui,sans-serif">
        Ver el catálogo
      </a>
    </p>
    <p style="margin:24px 0 0;font-size:13px;color:#6b6b6b;border-top:1px solid #e8e4dc;padding-top:16px">
      Si querés dejar de recibir estos emails, respondé este mensaje con "baja".
    </p>
  </div>
</body>
</html>`;
}
