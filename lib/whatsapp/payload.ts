/**
 * Lectura defensiva del payload que manda Meta al webhook.
 *
 * Meta cambia y agrega campos seguido, así que NO validamos el JSON entero:
 * recorremos lo que nos interesa y descartamos el resto. Si algo no tiene la
 * forma esperada, se ignora ese evento (nunca se cae el webhook por eso).
 *
 * Sin `server-only` a propósito: es lógica pura y se prueba con tsx
 * (scripts/whatsapp-selftest.ts).
 */

export type MessageKind =
  | 'text'
  | 'audio'
  | 'image'
  | 'document'
  | 'location'
  | 'sticker'
  | 'other';

/** Mensaje que escribió un cliente al número de la óptica. */
export type InboundMessage = {
  /** Id del número de la óptica en la API que recibió el mensaje (metadata.phone_number_id). */
  phoneNumberId: string | null;
  wamid: string;
  /** Número del cliente (formato internacional, sin "+"). */
  waId: string;
  profileName: string | null;
  kind: MessageKind;
  /** Solo si kind === 'text'. */
  text: string | null;
  /** Segundos desde epoch, tal cual lo manda Meta. */
  timestamp: number;
};

/**
 * Mensaje que salió del número de la óptica pero NO lo mandó este bot: una
 * persona lo escribió desde la app WhatsApp Business (modo coexistencia).
 */
export type EchoMessage = {
  phoneNumberId: string | null;
  wamid: string;
  /** A quién se lo mandó la persona del equipo (el cliente). */
  toWaId: string;
  kind: MessageKind;
  text: string | null;
  timestamp: number;
};

export type ParsedWebhook = {
  inbound: InboundMessage[];
  echoes: EchoMessage[];
};

type Obj = Record<string, unknown>;

function isObj(v: unknown): v is Obj {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function arr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}
function str(v: unknown): string | null {
  return typeof v === 'string' && v.length > 0 ? v : null;
}
function num(v: unknown): number {
  const n = typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : NaN;
  return Number.isFinite(n) ? n : 0;
}

function toKind(type: string | null): MessageKind {
  switch (type) {
    case 'text':
    case 'audio':
    case 'image':
    case 'document':
    case 'location':
    case 'sticker':
      return type;
    default:
      return 'other';
  }
}

/** Tipos que NO merecen respuesta (reacciones con emoji, etc.). */
const IGNORED_TYPES = new Set(['reaction']);

export function parseWebhook(payload: unknown): ParsedWebhook {
  const out: ParsedWebhook = { inbound: [], echoes: [] };
  if (!isObj(payload) || payload.object !== 'whatsapp_business_account') return out;

  for (const entry of arr(payload.entry)) {
    if (!isObj(entry)) continue;

    for (const change of arr(entry.changes)) {
      if (!isObj(change) || !isObj(change.value)) continue;
      const value = change.value;
      const phoneNumberId = isObj(value.metadata) ? str(value.metadata.phone_number_id) : null;

      // Mensajes de clientes (campo "messages"). Cualquier otro campo (por
      // ejemplo "history", que trae chats viejos al conectar la coexistencia)
      // se descarta a propósito: el bot nunca debe contestar mensajes viejos.
      if (change.field === 'messages') {
        const names = new Map<string, string>();
        for (const c of arr(value.contacts)) {
          if (!isObj(c)) continue;
          const waId = str(c.wa_id);
          const name = isObj(c.profile) ? str(c.profile.name) : null;
          if (waId && name) names.set(waId, name);
        }

        for (const m of arr(value.messages)) {
          if (!isObj(m)) continue;
          const wamid = str(m.id);
          const from = str(m.from);
          const type = str(m.type);
          if (!wamid || !from || (type && IGNORED_TYPES.has(type))) continue;

          const kind = toKind(type);
          out.inbound.push({
            phoneNumberId,
            wamid,
            waId: from,
            profileName: names.get(from) ?? null,
            kind,
            text: kind === 'text' && isObj(m.text) ? str(m.text.body) : null,
            timestamp: num(m.timestamp),
          });
        }
      }

      // Mensajes que una persona mandó desde la app WhatsApp Business
      // (coexistencia). Campo "smb_message_echoes". Estructura según la
      // documentación de coexistencia de Meta; hay que confirmarla con un
      // evento real cuando el número esté conectado.
      if (change.field === 'smb_message_echoes') {
        for (const m of arr(value.message_echoes)) {
          if (!isObj(m)) continue;
          const wamid = str(m.id);
          const to = str(m.to);
          const type = str(m.type);
          if (!wamid || !to || (type && IGNORED_TYPES.has(type))) continue;

          const kind = toKind(type);
          out.echoes.push({
            phoneNumberId,
            wamid,
            toWaId: to,
            kind,
            text: kind === 'text' && isObj(m.text) ? str(m.text.body) : null,
            timestamp: num(m.timestamp),
          });
        }
      }
    }
  }

  return out;
}
