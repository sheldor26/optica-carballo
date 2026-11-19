/**
 * Reglas que NO dependen del modelo: qué se deriva a una persona antes de
 * gastar una llamada a la IA, cómo se limpia lo que escribe el cliente y qué
 * se filtra de lo que quiere contestar el bot.
 *
 * Es la red de seguridad del bot: el modelo puede equivocarse, estas reglas no.
 * Sin `server-only`: lógica pura, se prueba con tsx (scripts/whatsapp-selftest.ts).
 */
import { HORARIOS_TEXTO } from './hours';

export const SITE_URL = 'https://opticacarballo.com.ar';

export type HandoffReason =
  | 'no_texto'
  | 'graduacion'
  | 'pidio_persona'
  | 'queja'
  | 'sintomas'
  | 'receta'
  | 'duda_compleja'
  | 'filtro_salida'
  | 'error_bot'
  | 'otro';

/** Cómo se muestra cada motivo en el mail al equipo. */
export const MOTIVO_TEXTO: Record<HandoffReason, string> = {
  no_texto: 'Mandó una foto, audio u otro archivo (el asistente solo lee texto)',
  graduacion: 'Escribió una graduación o habló de su receta',
  pidio_persona: 'Pidió hablar con una persona',
  queja: 'Consulta por un pedido o un reclamo',
  sintomas: 'Describió síntomas en los ojos (se le pidió consultar a un oftalmólogo)',
  receta: 'Consulta que depende de su receta',
  duda_compleja: 'Duda que el asistente no puede resolver',
  filtro_salida: 'El asistente quiso decir algo que no se puede afirmar por acá',
  error_bot: 'Falló el asistente (no se le contestó nada al cliente)',
  otro: 'El asistente pidió que lo atienda una persona',
};

// ── Normalización ───────────────────────────────────────────────────────────

/** Minúsculas y sin tildes, para que las reglas no dependan de cómo escribe la gente. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/**
 * Prepara lo que escribió el cliente antes de dárselo al modelo: lo acorta y
 * neutraliza `<` y `>` para que nadie pueda falsificar las etiquetas con las
 * que separamos "lo que dice el cliente" de "el catálogo".
 */
export function limpiarEntrada(texto: string, max = 1000): string {
  return texto.trim().slice(0, max).replace(/</g, '‹').replace(/>/g, '›');
}

// ── Derivación determinística (antes de llamar al modelo) ───────────────────

const RE_SINTOMAS =
  /\b(dolor (de|en) (el |los )?(ojo|ojos)|me duele (el|un) ojo|ojo rojo|golpe (en|al) (el )?ojo|destellos|perdi la vista|cortina|sangre|quemadura|me entro (algo|quimico))\b/;
const RE_GRADUACION =
  /([+-]\s?\d{1,2}[.,]\d{2}\b|\b(esfera|cilindro|adicion)\b|\bmi receta\b|\bmi graduacion\b)/;
const RE_PIDIO_PERSONA =
  /\b(humano|persona real|asesor|asesora|operador|hablar con (alguien|una persona|un humano|el dueno|la duena|la optica)|que me (atienda|conteste) (una|alguien))\b/;
const RE_DATOS_PERSONALES =
  /\b(((borr|elimin|suprim|sac|quit)\w*|(dar|den|de) de baja|de baja) (mis|todos mis|los) datos|mis datos personales|ley 25\.?326|derecho de (acceso|supresion|rectificacion))\b/;
const RE_QUEJA =
  /\b(reclamo|estafa|estafadores|denuncia|defensa del consumidor|no me llego|todavia no llego|mi pedido|devolver|arrepent|me cobraron|reembolso)\b/;

export type PolicyDecision = { reason: HandoffReason; reply: string } | null;

/**
 * Decide si el mensaje se deriva sin consultar a la IA. NO deriva por la
 * palabra "receta" sola: "¿tienen armazones para receta?" es una consulta de
 * catálogo. Deriva cuando hay graduación escrita, síntomas, un reclamo o el
 * cliente pide una persona.
 */
export function decidirDerivacion(texto: string): PolicyDecision {
  const t = normalizar(texto);

  if (RE_SINTOMAS.test(t)) return { reason: 'sintomas', reply: respuestaSintomas() };
  if (RE_GRADUACION.test(t)) return { reason: 'graduacion', reply: respuestaDerivacion() };
  if (RE_PIDIO_PERSONA.test(t)) return { reason: 'pidio_persona', reply: respuestaDerivacion() };
  // Acceso / borrado de datos personales: lo resuelve una persona (derechos de la Ley 25.326).
  if (RE_DATOS_PERSONALES.test(t)) return { reason: 'pidio_persona', reply: respuestaDerivacion() };
  if (RE_QUEJA.test(t)) return { reason: 'queja', reply: respuestaDerivacion() };
  return null;
}

// ── Respuestas fijas ────────────────────────────────────────────────────────

export function respuestaDerivacion(): string {
  return `Gracias por escribirnos. Te paso con una persona del equipo para que te ayude con esto. Nuestro horario de atención es: ${HORARIOS_TEXTO}`;
}

export function respuestaNoTexto(kind: string): string {
  const extra =
    kind === 'image' || kind === 'document'
      ? ' Si es una foto de tu receta, no la interpreta un asistente: la revisa una persona del equipo.'
      : '';
  return `Recibí tu mensaje, pero por acá solo puedo leer texto.${extra} Una persona del equipo lo va a ver. Nuestro horario de atención es: ${HORARIOS_TEXTO}`;
}

export function respuestaSintomas(): string {
  return 'Lo que me contás puede ser urgente. Consultá cuanto antes con un oftalmólogo o andá a una guardia: por acá no podemos evaluar síntomas. Aviso al equipo para que te escriba.';
}

export function respuestaLimite(): string {
  return `Llegaste al límite de mensajes por hoy con el asistente. Una persona del equipo te atiende en nuestro horario: ${HORARIOS_TEXTO}`;
}

/**
 * Aviso de la primera vez (y la ÚNICA respuesta a ese primer mensaje). El texto
 * del cliente todavía NO se procesó con IA: recién el mensaje siguiente, después
 * de que vio este aviso, viaja a los proveedores de IA (EE.UU.). Seguir la
 * conversación es la aceptación (revisión legal 2026-11-19: EE.UU. no tiene nivel
 * de protección adecuado, art. 12 Ley 25.326 → informar + consentimiento).
 */
export function mensajeInicial(): string {
  return `Hola, soy el asistente virtual de Óptica Carballo (una inteligencia artificial: puede equivocarse). Te ayudo con el catálogo, envíos y horarios, y si necesitás a una persona del equipo, pedila cuando quieras.

Para responderte, el texto de tus mensajes se procesa con proveedores de IA ubicados en Estados Unidos, y lo guardamos hasta 90 días. Si seguís la conversación, aceptás eso. No nos mandes datos de salud por acá. Más info y cómo borrar tus datos: ${SITE_URL}/politica-de-privacidad

Contame tu consulta.`;
}

// ── Filtro de salida ────────────────────────────────────────────────────────

/** Frases que el bot nunca debe decir (el modelo puede inventarlas aunque el prompt lo prohíba). */
const FRASES_PROHIBIDAS = [
  'garantia de optica carballo',
  'garantizamos',
  'te llega en',
  'llega en ',
  'estamos abiertos',
  'estamos cerrados',
  'abierto ahora',
  'cerrado ahora',
  'abrimos hoy',
  'cerramos hoy',
  'respondemos en',
  'te contestamos en',
];

const MAX_SALIDA = 1200;

/**
 * Cualidades que el modelo tiende a inventar al describir un producto. Solo se
 * pueden decir si figuran en el catálogo que recibió en ese turno. (Regla del
 * founder: el nombre de un material no autoriza a decir que es "flexible" o
 * "liviano"; y los anteojos de sol no se "adaptan" con graduación por chat.)
 */
const AFIRMACIONES_CON_RESPALDO = [
  'liviano',
  'ligero',
  'flexible',
  'resistente',
  'irrompible',
  'antirrayas',
  'antireflejo',
  'comodo',
  'graduad',
  'adaptar lentes',
];

export type FiltroSalida = { ok: true; text: string } | { ok: false; motivo: string };

/**
 * Revisa lo que el modelo quiere mandar. Corrige lo inofensivo (markdown que
 * WhatsApp no muestra) y rechaza lo que no se puede arreglar sin cambiar el
 * sentido (links de otros sitios, teléfonos o mails, frases prohibidas).
 * Si rechaza, el que llama manda una respuesta fija y deriva a una persona.
 */
export function filtrarSalida(texto: string, contextoCatalogo = ''): FiltroSalida {
  let out = texto.trim();
  if (!out) return { ok: false, motivo: 'vacío' };

  // Links markdown [texto](url) → "texto: url" (WhatsApp no los renderiza).
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '$1: $2');
  // Negrita de markdown ** → * (WhatsApp usa un solo asterisco). Sin títulos #.
  out = out.replace(/\*\*(.+?)\*\*/g, '*$1*').replace(/^#{1,6}\s+/gm, '');

  // Solo links a nuestro sitio.
  const urls = out.match(/https?:\/\/[^\s)]+/gi) ?? [];
  for (const url of urls) {
    let host = '';
    try {
      host = new URL(url).hostname.toLowerCase();
    } catch {
      return { ok: false, motivo: `url inválida: ${url.slice(0, 60)}` };
    }
    if (host !== 'opticacarballo.com.ar' && host !== 'www.opticacarballo.com.ar') {
      return { ok: false, motivo: `link a otro sitio: ${host}` };
    }
  }

  // Sin URLs de por medio, no debe haber mails ni teléfonos (no hay ninguno
  // que el bot esté autorizado a dar).
  const sinUrls = out.replace(/https?:\/\/[^\s)]+/gi, ' ');
  if (/[^\s@]+@[^\s@]+\.[a-z]{2,}/i.test(sinUrls)) return { ok: false, motivo: 'mail' };
  if (/(\d[\s.-]?){8,}/.test(sinUrls)) return { ok: false, motivo: 'número largo / teléfono' };

  const n = normalizar(out);
  for (const frase of FRASES_PROHIBIDAS) {
    if (n.includes(frase)) return { ok: false, motivo: `frase prohibida: "${frase.trim()}"` };
  }

  // Cualidades de producto: solo si están en el catálogo de este turno.
  const respaldo = normalizar(contextoCatalogo);
  for (const palabra of AFIRMACIONES_CON_RESPALDO) {
    if (n.includes(palabra) && !respaldo.includes(palabra)) {
      return { ok: false, motivo: `afirma "${palabra}" sin respaldo en el catálogo` };
    }
  }

  if (out.length > MAX_SALIDA) return { ok: false, motivo: 'demasiado largo' };
  return { ok: true, text: out };
}
