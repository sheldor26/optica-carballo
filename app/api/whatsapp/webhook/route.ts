import { timingSafeEqual } from 'node:crypto';
import { after, NextResponse } from 'next/server';
import { botActivado, procesarEco, procesarMensaje, registrarEntrante } from '@/lib/whatsapp/handler';
import { parseWebhook, type InboundMessage } from '@/lib/whatsapp/payload';
import { verifyWhatsAppSignature } from '@/lib/whatsapp/signature';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// El bot espera unos segundos (ráfagas de mensajes) y llama a dos APIs de IA.
export const maxDuration = 60;

/**
 * Webhook de la WhatsApp Cloud API (ADR-028).
 *
 * GET  → verificación que hace Meta al configurar el webhook (devuelve el
 *        `hub.challenge` si el token coincide con WHATSAPP_VERIFY_TOKEN).
 * POST → eventos. Pasos, en este orden a propósito:
 *   1. Validar la firma del cuerpo crudo (si no, 401: lo mandó cualquiera).
 *   2. Guardar cada mensaje nuevo ANTES de contestar 200. Si Supabase falla se
 *      contesta 500 y Meta reintenta; si contestáramos 200 y falláramos
 *      después, el mensaje se perdería sin que nadie se entere.
 *   3. Contestar 200 enseguida y procesar con `after()` (puede tardar más de
 *      lo que Meta espera; si tarda, Meta reintenta y duplicaría la respuesta).
 *
 * El bot solo contesta si WHATSAPP_BOT_ENABLED=true (interruptor general). Con
 * el interruptor apagado el webhook igual valida y guarda, pero no responde.
 */

function tokensIguales(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const esperado = process.env.WHATSAPP_VERIFY_TOKEN;
  const token = params.get('hub.verify_token');
  const challenge = params.get('hub.challenge');

  if (
    esperado &&
    params.get('hub.mode') === 'subscribe' &&
    token &&
    challenge &&
    tokensIguales(token, esperado)
  ) {
    return new Response(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } });
  }
  return new Response('Forbidden', { status: 403 });
}

export async function POST(request: Request) {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) {
    console.error('[whatsapp] falta WHATSAPP_APP_SECRET: no se puede validar la firma');
    return NextResponse.json({ error: 'No configurado' }, { status: 503 });
  }

  // Firma sobre los bytes crudos: hay que leer el texto ANTES de parsear.
  const raw = await request.text();
  if (!verifyWhatsAppSignature(raw, request.headers.get('x-hub-signature-256'), appSecret)) {
    console.warn('[whatsapp] firma inválida, evento descartado');
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const { inbound, echoes } = parseWebhook(payload);

  // Solo eventos de NUESTRO número (por si la app tuviera otros).
  const miNumero = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const esMio = (id: string | null) => !miNumero || id === miNumero;
  const mensajes = inbound.filter((m) => esMio(m.phoneNumberId));
  const ecos = echoes.filter((e) => esMio(e.phoneNumberId));

  // Con el bot apagado no se guarda nada: así no se acumulan datos personales sin usarse.
  if (!botActivado()) return NextResponse.json({ ok: true, bot: 'apagado' });

  const nuevos: InboundMessage[] = [];
  for (const m of mensajes) {
    try {
      if (await registrarEntrante(m)) nuevos.push(m);
    } catch (err) {
      console.error('[whatsapp] no pude guardar el mensaje; pido reintento a Meta:', err);
      return NextResponse.json({ error: 'Error al guardar' }, { status: 500 });
    }
  }

  if (nuevos.length > 0 || ecos.length > 0) {
    after(async () => {
      await Promise.allSettled([
        ...nuevos.map((m) => procesarMensaje(m)),
        ...ecos.map((e) => procesarEco(e)),
      ]);
    });
  }

  return NextResponse.json({ ok: true });
}
