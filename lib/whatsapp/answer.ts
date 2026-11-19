import 'server-only';
import { embedText } from '@/lib/chat/embed';
import { matchProducts } from '@/lib/chat/match-products';
import type { ChatMatchedProduct } from '@/lib/chat/types';
import { WHATSAPP_SYSTEM_PROMPT } from './prompt';
import { limpiarEntrada, SITE_URL, type HandoffReason } from './policy';

/**
 * Genera la respuesta del bot a un mensaje de WhatsApp. SIN streaming (WhatsApp
 * necesita el texto entero) y con el mismo RAG que el chat web.
 *
 * Mejoras respecto del chat web, a propósito:
 * - El catálogo y la consulta van entre etiquetas (<contexto_catalogo>,
 *   <consulta_cliente>) con los `<` del cliente neutralizados: nadie puede
 *   falsificar la sección del catálogo.
 * - El contexto RAG solo va en el turno actual; el historial lleva solo texto.
 * - La búsqueda embebe los últimos 2 mensajes del cliente ("¿y en negro?" solo,
 *   embebe pésimo).
 * - Para pasar a una persona el modelo usa una herramienta (`derivar_a_humano`),
 *   no una etiqueta dentro del texto que podría filtrarse al cliente.
 */

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const MODEL_ID = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 500;

export type HistoryMessage = { role: 'user' | 'assistant'; content: string };

export type BotAnswer = {
  /** Texto para el cliente (puede venir vacío si solo derivó). */
  text: string;
  /** Si el modelo pidió pasar a una persona, el motivo. */
  handoff: HandoffReason | null;
  /** El catálogo que vio el modelo en este turno (para que el filtro de salida lo use de respaldo). */
  contexto: string;
};

const MOTIVOS_MODELO = ['receta', 'duda_compleja', 'queja', 'pidio_persona', 'otro'] as const;

const TOOL_DERIVAR = {
  name: 'derivar_a_humano',
  description:
    'Pasa la conversación a una persona del equipo. Usala cuando el cliente quiere comprar anteojos con receta, pasa su graduación, tiene un reclamo o un problema con un producto, pide hablar con una persona, o cuando la consulta no se puede resolver con el catálogo y la información del negocio. Después de usarla, escribí igual un mensaje corto avisándole al cliente que lo pasás con el equipo.',
  input_schema: {
    type: 'object',
    properties: {
      motivo: { type: 'string', enum: [...MOTIVOS_MODELO] },
    },
    required: ['motivo'],
  },
} as const;

/** Catálogo en texto plano, con URL completa (WhatsApp no renderiza markdown). */
function formatearCatalogo(matches: ChatMatchedProduct[]): string {
  if (matches.length === 0) {
    return 'No hay productos del catálogo que coincidan claramente con la consulta.';
  }
  const items = matches.map((m, i) => {
    const url = `${SITE_URL}/${m.categorySlug}/${m.brandSlug}/${m.productSlug}`;
    return `${i + 1}. ${m.productName} (${m.brandName}) — ${m.shortDescription ?? 'sin descripción corta'}\n   URL: ${url}\n   similitud: ${m.similarity.toFixed(2)}`;
  });
  return `Productos más parecidos a la consulta (de mayor a menor similitud):\n${items.join('\n')}`;
}

/** La API de Anthropic quiere roles alternados y que el primero sea "user". */
function normalizarHistorial(historial: HistoryMessage[]): HistoryMessage[] {
  const out: HistoryMessage[] = [];
  for (const m of historial) {
    const prev = out[out.length - 1];
    if (prev && prev.role === m.role) {
      prev.content += `\n${m.content}`;
    } else {
      out.push({ ...m });
    }
  }
  while (out.length > 0 && out[0]?.role !== 'user') out.shift();
  return out;
}

async function llamarAnthropic(body: unknown, apiKey: string): Promise<Response> {
  let ultimoError: unknown;
  for (let intento = 0; intento < 2; intento++) {
    try {
      const res = await fetch(ANTHROPIC_API, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(25_000),
      });
      // Reintenta una vez ante 429 / 5xx; con cualquier otro error no tiene sentido.
      if (res.ok || (res.status !== 429 && res.status < 500)) return res;
      ultimoError = new Error(`Anthropic ${res.status}`);
    } catch (err) {
      ultimoError = err;
    }
    await new Promise((r) => setTimeout(r, 800));
  }
  throw ultimoError instanceof Error ? ultimoError : new Error('Anthropic: error de red');
}

export async function generarRespuesta(params: {
  /** Historial reciente SIN el mensaje actual. */
  historial: HistoryMessage[];
  /** Mensaje actual del cliente, sin limpiar. */
  mensajeActual: string;
  /** Mensaje anterior del cliente (para la búsqueda en el catálogo). */
  mensajeAnteriorCliente: string | null;
}): Promise<BotAnswer> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!anthropicKey) throw new Error('Falta ANTHROPIC_API_KEY');

  const consulta = limpiarEntrada(params.mensajeActual);

  // RAG: si falla, seguimos sin catálogo y el modelo lo sabe (no inventa productos).
  let catalogo: string;
  try {
    if (!openaiKey) throw new Error('Falta OPENAI_API_KEY');
    const paraBuscar = [params.mensajeAnteriorCliente, params.mensajeActual]
      .filter(Boolean)
      .join('. ')
      .slice(0, 800);
    const embedding = await embedText(paraBuscar, openaiKey);
    const matches = await matchProducts(embedding, { threshold: 0.25, count: 4 });
    catalogo = formatearCatalogo(matches);
  } catch (err) {
    console.error('[whatsapp] RAG falló, sigo sin catálogo:', String(err));
    catalogo =
      'No pude consultar el catálogo en este momento. No recomiendes productos; ofrecé pasarlo con una persona del equipo.';
  }

  const messages = [
    ...normalizarHistorial(params.historial),
    {
      role: 'user' as const,
      content: `<contexto_catalogo>\n${catalogo}\n</contexto_catalogo>\n\n<consulta_cliente>\n${consulta}\n</consulta_cliente>`,
    },
  ];
  // Si el historial terminaba en "user", el turno actual se fusiona con él.
  const alternados = normalizarHistorial(messages);

  const res = await llamarAnthropic(
    {
      model: MODEL_ID,
      max_tokens: MAX_TOKENS,
      system: WHATSAPP_SYSTEM_PROMPT,
      tools: [TOOL_DERIVAR],
      tool_choice: { type: 'auto' },
      messages: alternados,
    },
    anthropicKey,
  );

  if (!res.ok) {
    const detalle = await res.text().catch(() => '');
    throw new Error(`Anthropic ${res.status}: ${detalle.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    content?: Array<
      { type: 'text'; text: string } | { type: 'tool_use'; name: string; input?: { motivo?: string } }
    >;
  };

  let text = '';
  let handoff: HandoffReason | null = null;
  for (const block of data.content ?? []) {
    if (block.type === 'text') text += block.text;
    if (block.type === 'tool_use' && block.name === 'derivar_a_humano') {
      const motivo = block.input?.motivo;
      handoff = (MOTIVOS_MODELO as readonly string[]).includes(motivo ?? '')
        ? (motivo as HandoffReason)
        : 'otro';
    }
  }
  return { text: text.trim(), handoff, contexto: catalogo };
}
