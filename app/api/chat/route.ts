import { NextResponse } from 'next/server';
import { ChatRequestSchema } from '@/lib/chat/types';
import { CHAT_SYSTEM_PROMPT } from '@/lib/chat/system-prompt';
import { embedText } from '@/lib/chat/embed';
import {
  formatMatchesAsContext,
  matchProducts,
} from '@/lib/chat/match-products';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const MODEL_ID = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 800;

/**
 * Endpoint /api/chat — asistente conversacional RAG sobre catálogo.
 *
 * Flow:
 * 1. Valida request (Zod): messages history + userMessage nuevo.
 * 2. Rate limit por IP (in-memory, 20 msgs/hora — similar al lector
 *    receta).
 * 3. Embedea el userMessage con OpenAI.
 * 4. Busca top-5 productos similares en product_embeddings via Supabase
 *    RPC match_products (filtra solo activos con stock).
 * 5. Construye prompt: SYSTEM_PROMPT + contexto RAG + history + userMessage.
 * 6. Llama a Claude Haiku 4.5 CON STREAMING (Server-Sent Events).
 * 7. Re-streamea al cliente. El cliente parsea los eventos SSE.
 *
 * Modelo Haiku 4.5: barato (~$0.001/respuesta), latencia baja (~1-2s
 * TTFT), suficiente para consultas de catálogo. Si después vemos
 * que la calidad falla en queries complejas, escalamos a Sonnet.
 */

// Rate limit in-memory (mismo patrón que /api/prescription).
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hora
const RATE_LIMIT_MAX_PER_IP = 20;
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const bucket = rateLimitMap.get(ip);

  if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: RATE_LIMIT_MAX_PER_IP - 1 };
  }

  if (bucket.count >= RATE_LIMIT_MAX_PER_IP) {
    return { allowed: false, remaining: 0 };
  }

  bucket.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX_PER_IP - bucket.count };
}

export async function POST(request: Request) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!anthropicKey || !openaiKey) {
    return NextResponse.json(
      { error: 'Servicio no configurado.' },
      { status: 503 },
    );
  }

  // Rate limit.
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error:
          'Llegaste al límite de consultas por hora. Probá de nuevo más tarde o escribinos por WhatsApp.',
      },
      { status: 429 },
    );
  }

  // Validar body.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Request body inválido' },
      { status: 400 },
    );
  }
  const { messages, userMessage } = parsed.data;

  // Embed user message → match products RAG.
  let contextText = '';
  try {
    const queryEmbedding = await embedText(userMessage, openaiKey);
    const matches = await matchProducts(queryEmbedding, {
      threshold: 0.25,
      count: 5,
    });
    contextText = formatMatchesAsContext(matches);
  } catch (err) {
    console.error('[chat] RAG failed (continuing without context):', String(err));
    // Si falla el RAG, seguimos sin contexto — el bot puede igual responder
    // dudas generales sobre el negocio (envíos, garantía, etc).
    contextText =
      'No pude consultar el catálogo en este momento. Respondé con info general del negocio o sugerí escribir por WhatsApp.';
  }

  // Construir mensajes para Anthropic: historial + user msg con contexto.
  // El contexto va en el ÚLTIMO user message (no como system) — así Claude
  // ve "esto es el query del usuario + acá tenés productos relevantes".
  const userMessageWithContext = `${userMessage}\n\n---\n\n[Contexto RAG — productos relevantes del catálogo]\n${contextText}`;

  const anthropicMessages = [
    ...messages,
    { role: 'user' as const, content: userMessageWithContext },
  ];

  // Anthropic streaming call.
  const anthropicResponse = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL_ID,
      max_tokens: MAX_TOKENS,
      system: CHAT_SYSTEM_PROMPT,
      messages: anthropicMessages,
      stream: true,
    }),
  });

  if (!anthropicResponse.ok || !anthropicResponse.body) {
    const errBody = await anthropicResponse.text().catch(() => '');
    console.error(
      `[chat] Anthropic error ${anthropicResponse.status}: ${errBody.slice(0, 200)}`,
    );
    return NextResponse.json(
      { error: 'No pudimos procesar tu consulta. Probá de nuevo.' },
      { status: 502 },
    );
  }

  // Re-stream a cliente como text/event-stream simplificado.
  // Anthropic SSE events: message_start, content_block_delta (text chunks),
  // message_stop. Filtramos solo content_block_delta de tipo text_delta.
  const stream = new ReadableStream({
    async start(controller) {
      const reader = anthropicResponse.body!.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const payload = line.slice(6).trim();
            if (!payload || payload === '[DONE]') continue;

            try {
              const event = JSON.parse(payload);
              if (
                event.type === 'content_block_delta' &&
                event.delta?.type === 'text_delta' &&
                typeof event.delta.text === 'string'
              ) {
                // Emitimos solo el texto, en formato SSE simplificado.
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`),
                );
              } else if (event.type === 'message_stop') {
                controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
              }
            } catch {
              // Ignoramos líneas malformadas (no rompemos el stream).
            }
          }
        }
      } catch (err) {
        console.error('[chat] Stream error:', String(err));
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: 'Stream interrumpido' })}\n\n`,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-store, no-cache, private',
      Connection: 'keep-alive',
      'X-RateLimit-Remaining': String(rl.remaining),
    },
  });
}
