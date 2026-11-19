import 'server-only';
import { sendWhatsAppHandoffEmail } from '@/lib/emails/send-whatsapp-handoff-email';
import { createAdminClient } from '@/lib/supabase/admin';
import { generarRespuesta, type HistoryMessage } from './answer';
import { markWhatsAppRead, sendWhatsAppText } from './client';
import type { EchoMessage, InboundMessage } from './payload';
import {
  decidirDerivacion,
  filtrarSalida,
  limpiarEntrada,
  mensajeInicial,
  MOTIVO_TEXTO,
  respuestaDerivacion,
  respuestaLimite,
  respuestaNoTexto,
  type HandoffReason,
} from './policy';

/**
 * Cerebro del bot: recibe cada mensaje ya guardado y decide qué hacer.
 *
 * Orden de las defensas (de más barata a más cara):
 *   interruptor general → ¿una persona tomó la conversación? → límites por
 *   número → ¿mensaje repetido? → esperar ráfagas → reglas fijas de derivación →
 *   IA → filtro de salida → enviar.
 *
 * Principio: ante la duda, callar o derivar. En coexistencia el equipo ve todo
 * en la app, así que un silencio nunca deja a un cliente sin respuesta humana.
 */

const HORA = 60 * 60 * 1000;
const PAUSA_TRAS_PERSONA_MS = 12 * HORA; // una persona contestó desde la app
const PAUSA_TRAS_DERIVAR_MS = 12 * HORA; // se derivó: el bot no insiste
const LIMITE_ENTRANTES_HORA = 12;
const LIMITE_ENTRANTES_DIA = 40;
const LIMITE_SALIENTES_HORA = 8; // corta loops bot contra bot
const TOPE_DIARIO_GLOBAL = Number(process.env.WHATSAPP_DAILY_CAP) || 500;
const ESPERA_RAFAGA_MS = 4000; // la gente manda 3 mensajes cortos seguidos
const VENTANA_HISTORIAL_MS = 24 * HORA;
const MAX_HISTORIAL = 6;
const MAX_MAILS_POR_HORA = 1;

type Db = ReturnType<typeof createAdminClient>;

const dormir = (ms: number) => new Promise((r) => setTimeout(r, ms));
const hace = (ms: number) => new Date(Date.now() - ms).toISOString();
const dentroDe = (ms: number) => new Date(Date.now() + ms).toISOString();

/** Interruptor general: el bot solo responde si WHATSAPP_BOT_ENABLED es exactamente "true". */
export function botActivado(): boolean {
  return process.env.WHATSAPP_BOT_ENABLED === 'true';
}

// ── Guardado (lo llama el webhook ANTES de contestar 200) ────────────────────

/**
 * Guarda el mensaje entrante. Devuelve true si es nuevo y false si ya lo
 * habíamos recibido (Meta reintenta). Si Supabase falla, tira error: el webhook
 * contesta 500 y Meta reintenta, en vez de perder el mensaje en silencio.
 */
export async function registrarEntrante(msg: InboundMessage): Promise<boolean> {
  const db = createAdminClient();

  const conversacion: Record<string, unknown> = {
    wa_id: msg.waId,
    last_inbound_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  if (msg.profileName) conversacion.profile_name = msg.profileName;
  const upsertConv = await db.from('whatsapp_conversations').upsert(conversacion, { onConflict: 'wa_id' });
  if (upsertConv.error) throw new Error(`conversación: ${upsertConv.error.message}`);

  const insert = await db
    .from('whatsapp_messages')
    .upsert(
      {
        wamid: msg.wamid,
        wa_id: msg.waId,
        direction: 'in',
        sender: 'customer',
        kind: msg.kind,
        // De los medios NO guardamos nada (ni recetas en foto ni audios).
        body: msg.kind === 'text' ? (msg.text ?? '').slice(0, 4000) : null,
      },
      { onConflict: 'wamid', ignoreDuplicates: true },
    )
    .select('id');
  if (insert.error) throw new Error(`mensaje: ${insert.error.message}`);

  return (insert.data?.length ?? 0) > 0;
}

// ── Mensaje de un cliente ───────────────────────────────────────────────────

export async function procesarMensaje(msg: InboundMessage): Promise<void> {
  if (!botActivado()) return;
  const db = createAdminClient();
  try {
    await procesar(db, msg);
  } catch (err) {
    console.error('[whatsapp] error procesando mensaje:', err);
    // Sin respuesta al cliente: se avisa al equipo y se pausa el bot.
    await derivar(db, msg.waId, 'error_bot').catch((e) =>
      console.error('[whatsapp] ni pude derivar tras el error:', e),
    );
  }
}

async function procesar(db: Db, msg: InboundMessage): Promise<void> {
  if (await estaPausada(db, msg.waId)) return;

  // 1) Límites por número y tope global.
  const veredicto = await revisarLimites(db, msg.waId);
  if (veredicto === 'silencio') return;
  if (veredicto === 'avisar_limite') {
    await avisarLimite(db, msg.waId);
    return;
  }

  // 2) Archivos, fotos, audios: respuesta fija y a una persona.
  if (msg.kind !== 'text') {
    await markWhatsAppRead(msg.wamid);
    await responderYDerivar(db, msg.waId, 'no_texto', respuestaNoTexto(msg.kind));
    return;
  }
  const texto = (msg.text ?? '').trim();
  if (!texto) return;

  // 3) Mismo texto que el mensaje anterior del cliente: no se contesta dos veces.
  if (await esRepetido(db, msg.waId, msg.wamid, texto)) return;

  // 4) Esperar por si el cliente está mandando una ráfaga: contesta el último.
  await dormir(ESPERA_RAFAGA_MS);
  if (!(await esElUltimo(db, msg.waId, msg.wamid))) return;
  if (await estaPausada(db, msg.waId)) return;

  await markWhatsAppRead(msg.wamid);

  // 5) Reglas fijas de derivación (graduación, síntomas, reclamos, pedir persona).
  const regla = decidirDerivacion(texto);
  if (regla) {
    await responderYDerivar(db, msg.waId, regla.reason, regla.reply);
    return;
  }

  // 6) La IA.
  const { historial, anteriorCliente } = await cargarHistorial(db, msg.waId, msg.wamid);
  const respuesta = await generarRespuesta({
    historial,
    mensajeActual: texto,
    mensajeAnteriorCliente: anteriorCliente,
  });

  if (!respuesta.text && !respuesta.handoff) {
    throw new Error('el modelo no devolvió texto ni derivación');
  }

  // 7) Filtro de salida: si no pasa, respuesta fija y a una persona.
  let aEnviar = respuesta.text;
  const motivo: HandoffReason | null = respuesta.handoff;
  if (aEnviar) {
    const filtro = filtrarSalida(aEnviar, respuesta.contexto);
    if (!filtro.ok) {
      console.warn('[whatsapp] salida rechazada por el filtro:', filtro.motivo);
      await responderYDerivar(db, msg.waId, 'filtro_salida', respuestaDerivacion());
      return;
    }
    aEnviar = filtro.text;
  } else {
    aEnviar = respuestaDerivacion();
  }

  // 8) Última verificación antes de hablar: ¿una persona tomó la conversación mientras pensábamos?
  if (await estaPausada(db, msg.waId)) return;

  await enviar(db, msg.waId, aEnviar);
  if (motivo) await derivar(db, msg.waId, motivo);
}

// ── Mensaje que mandó una persona desde la app (coexistencia) ───────────────

/**
 * Si el eco es de una persona del equipo, el bot se calla en esa conversación.
 * Los mensajes que mandó el propio bot también generan eco: se reconocen porque
 * su wamid ya está guardado (se espera unos segundos a que `enviar` lo guarde).
 */
export async function procesarEco(echo: EchoMessage): Promise<void> {
  if (!botActivado()) return;
  const db = createAdminClient();
  try {
    await dormir(3000);

    const conv = await db
      .from('whatsapp_conversations')
      .upsert(
        { wa_id: echo.toWaId, updated_at: new Date().toISOString() },
        { onConflict: 'wa_id', ignoreDuplicates: true },
      );
    if (conv.error) throw new Error(conv.error.message);

    const insert = await db
      .from('whatsapp_messages')
      .upsert(
        {
          wamid: echo.wamid,
          wa_id: echo.toWaId,
          direction: 'out',
          sender: 'human',
          kind: echo.kind,
          body: echo.kind === 'text' ? (echo.text ?? '').slice(0, 4000) : null,
        },
        { onConflict: 'wamid', ignoreDuplicates: true },
      )
      .select('id');
    if (insert.error) throw new Error(insert.error.message);

    // Ya existía: lo mandó el bot. No es una persona.
    if ((insert.data?.length ?? 0) === 0) return;

    const pausa = await db
      .from('whatsapp_conversations')
      .update({ bot_paused_until: dentroDe(PAUSA_TRAS_PERSONA_MS), updated_at: new Date().toISOString() })
      .eq('wa_id', echo.toWaId);
    if (pausa.error) throw new Error(pausa.error.message);
  } catch (err) {
    console.error('[whatsapp] error procesando eco:', err);
  }
}

// ── Piezas ──────────────────────────────────────────────────────────────────

async function estaPausada(db: Db, waId: string): Promise<boolean> {
  const { data, error } = await db
    .from('whatsapp_conversations')
    .select('bot_paused_until')
    .eq('wa_id', waId)
    .maybeSingle();
  if (error) throw new Error(`leer conversación: ${error.message}`);
  const hasta = data?.bot_paused_until ? new Date(data.bot_paused_until).getTime() : 0;
  return hasta > Date.now();
}

function consultaConteo(db: Db) {
  return db.from('whatsapp_messages').select('id', { count: 'exact', head: true });
}
type ConsultaConteo = ReturnType<typeof consultaConteo>;

async function contar(db: Db, filtros: (q: ConsultaConteo) => ConsultaConteo): Promise<number> {
  const { count, error } = await filtros(consultaConteo(db));
  if (error) throw new Error(`contar mensajes: ${error.message}`);
  return count ?? 0;
}

async function revisarLimites(
  db: Db,
  waId: string,
): Promise<'ok' | 'silencio' | 'avisar_limite'> {
  const [entrantesHora, entrantesDia, salientesHora, salientesGlobalDia] = await Promise.all([
    contar(db, (q) => q.eq('wa_id', waId).eq('sender', 'customer').gte('created_at', hace(HORA))),
    contar(db, (q) => q.eq('wa_id', waId).eq('sender', 'customer').gte('created_at', hace(24 * HORA))),
    contar(db, (q) => q.eq('wa_id', waId).eq('sender', 'bot').gte('created_at', hace(HORA))),
    contar(db, (q) => q.eq('sender', 'bot').gte('created_at', hace(24 * HORA))),
  ]);

  if (salientesGlobalDia >= TOPE_DIARIO_GLOBAL) {
    console.error(`[whatsapp] tope diario global alcanzado (${TOPE_DIARIO_GLOBAL}): el bot no contesta más hoy`);
    return 'silencio';
  }
  if (salientesHora >= LIMITE_SALIENTES_HORA) return 'silencio';
  if (entrantesHora > LIMITE_ENTRANTES_HORA || entrantesDia > LIMITE_ENTRANTES_DIA) {
    return 'avisar_limite';
  }
  return 'ok';
}

/** Avisa del límite UNA sola vez (por día); después el bot calla. */
async function avisarLimite(db: Db, waId: string): Promise<void> {
  const { data } = await db
    .from('whatsapp_conversations')
    .select('limit_notified_at')
    .eq('wa_id', waId)
    .maybeSingle();
  const ultimo = data?.limit_notified_at ? new Date(data.limit_notified_at).getTime() : 0;
  if (Date.now() - ultimo < 24 * HORA) return;

  await db
    .from('whatsapp_conversations')
    .update({ limit_notified_at: new Date().toISOString() })
    .eq('wa_id', waId);
  await enviar(db, waId, respuestaLimite());
}

async function esRepetido(db: Db, waId: string, wamid: string, texto: string): Promise<boolean> {
  const { data } = await db
    .from('whatsapp_messages')
    .select('body')
    .eq('wa_id', waId)
    .eq('sender', 'customer')
    .neq('wamid', wamid)
    .order('created_at', { ascending: false })
    .limit(1);
  const anterior = data?.[0]?.body;
  return !!anterior && anterior.trim().toLowerCase() === texto.toLowerCase();
}

async function esElUltimo(db: Db, waId: string, wamid: string): Promise<boolean> {
  const { data } = await db
    .from('whatsapp_messages')
    .select('wamid')
    .eq('wa_id', waId)
    .eq('sender', 'customer')
    .order('created_at', { ascending: false })
    .limit(1);
  return data?.[0]?.wamid === wamid;
}

/** Últimos mensajes de texto de las últimas 24 h, SIN el actual, del más viejo al más nuevo. */
async function cargarHistorial(
  db: Db,
  waId: string,
  wamidActual: string,
): Promise<{ historial: HistoryMessage[]; anteriorCliente: string | null }> {
  const { data, error } = await db
    .from('whatsapp_messages')
    .select('sender, body')
    .eq('wa_id', waId)
    .neq('wamid', wamidActual)
    .not('body', 'is', null)
    .gte('created_at', hace(VENTANA_HISTORIAL_MS))
    .order('created_at', { ascending: false })
    .limit(MAX_HISTORIAL);
  if (error) throw new Error(`leer historial: ${error.message}`);

  const filas = (data ?? []).reverse();
  const historial: HistoryMessage[] = filas.map((f) => ({
    role: f.sender === 'customer' ? 'user' : 'assistant',
    content: f.sender === 'customer' ? limpiarEntrada(f.body as string) : (f.body as string),
  }));
  const anterior = [...filas].reverse().find((f) => f.sender === 'customer')?.body ?? null;
  return { historial, anteriorCliente: anterior };
}

/** Manda un mensaje y lo guarda. En el primero de la conversación va el saludo con el aviso de asistente virtual. */
async function enviar(db: Db, waId: string, texto: string): Promise<void> {
  const previos = await contar(db, (q) => q.eq('wa_id', waId).eq('sender', 'bot'));
  const cuerpo = previos === 0 ? `${mensajeInicial()}\n\n${texto}` : texto;

  const wamid = await sendWhatsAppText(waId, cuerpo);
  if (!wamid) {
    console.error('[whatsapp] Meta no devolvió el id del mensaje enviado');
    return;
  }
  const guardar = await db.from('whatsapp_messages').upsert(
    { wamid, wa_id: waId, direction: 'out', sender: 'bot', kind: 'text', body: cuerpo.slice(0, 4000) },
    { onConflict: 'wamid', ignoreDuplicates: true },
  );
  if (guardar.error) console.error('[whatsapp] no pude guardar el mensaje enviado:', guardar.error.message);
}

async function responderYDerivar(
  db: Db,
  waId: string,
  motivo: HandoffReason,
  texto: string,
): Promise<void> {
  await enviar(db, waId, texto);
  await derivar(db, waId, motivo);
}

/** Pausa al bot en esta conversación y avisa por mail (máximo 1 por hora por conversación). */
async function derivar(db: Db, waId: string, motivo: HandoffReason): Promise<void> {
  const ahora = new Date().toISOString();
  const { data: conv } = await db
    .from('whatsapp_conversations')
    .select('profile_name, handoff_notified_at')
    .eq('wa_id', waId)
    .maybeSingle();

  await db
    .from('whatsapp_conversations')
    .update({
      bot_paused_until: dentroDe(PAUSA_TRAS_DERIVAR_MS),
      handoff_at: ahora,
      handoff_reason: motivo,
      updated_at: ahora,
    })
    .eq('wa_id', waId);

  const ultimoMail = conv?.handoff_notified_at ? new Date(conv.handoff_notified_at).getTime() : 0;
  if (Date.now() - ultimoMail < MAX_MAILS_POR_HORA * HORA) return;

  const { data: ultimos } = await db
    .from('whatsapp_messages')
    .select('sender, body')
    .eq('wa_id', waId)
    .not('body', 'is', null)
    .order('created_at', { ascending: false })
    .limit(4);

  const enviado = await sendWhatsAppHandoffEmail({
    waId,
    profileName: conv?.profile_name ?? null,
    motivo: MOTIVO_TEXTO[motivo],
    ultimosMensajes: (ultimos ?? [])
      .reverse()
      .map((m) => ({
        quien: m.sender === 'customer' ? ('cliente' as const) : m.sender === 'bot' ? ('bot' as const) : ('equipo' as const),
        texto: String(m.body).slice(0, 200),
      })),
  });
  if (enviado) {
    await db.from('whatsapp_conversations').update({ handoff_notified_at: ahora }).eq('wa_id', waId);
  }
}
