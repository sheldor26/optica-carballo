'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  Loader2,
  MessageSquare,
  Sparkles,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WhatsappIcon } from '@/components/ui/whatsapp-icon';
import { getWhatsappLinkWithContext } from '@/lib/site/business';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import { formatPriceCents } from '@/lib/format/currency';
import { track, Events } from '@/lib/analytics/track';
import type { ChatMessage } from '@/lib/chat/types';

/** Card liviana de producto que devuelve /api/recently-viewed/cards. */
type ChatCard = {
  slug: string;
  name: string;
  brandName: string;
  brandSlug: string;
  categorySlug: string;
  primaryImagePath: string | null;
  primaryImageScale: number;
  minPriceCents: number | null;
};

/**
 * Extrae slugs de productos de los links que el modelo pone en la respuesta
 * (`/anteojos-de-{sol,receta}/<marca>/<slug>`). Los links de filtro (ej
 * `/anteojos-de-sol/vulk/cat-eye`) también matchean, pero el endpoint de cards
 * filtra solo los slugs que son productos reales — así que no hace ruido.
 */
function extractProductSlugs(text: string): string[] {
  const re = /\/anteojos-de-(?:sol|receta)\/[a-z0-9-]+\/([a-z0-9-]+)/g;
  const slugs = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match[1]) slugs.add(match[1]);
  }
  return [...slugs].slice(0, 4);
}

const SUGGESTED_PROMPTS = [
  '¿Qué anteojos de sol polarizados tenés?',
  '¿Qué armazón va para cara cuadrada?',
  '¿Cuánto tarda el envío al interior?',
  '¿Cómo funciona la garantía?',
];

/**
 * Arma el mensaje de WhatsApp para el handoff a una persona, llevando el
 * contexto de la conversación (la última consulta del usuario). El cliente
 * desconfiado de comprar óptica online quiere hablar con alguien — este es
 * el antídoto directo, y llega con la duda ya escrita.
 */
function buildHandoffMessage(messages: ChatMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (lastUser) {
    return `Hola! Estuve usando el asistente de la web y quiero hablar con una persona. Mi consulta: "${lastUser.content}"`;
  }
  return 'Hola! Quiero hacer una consulta con una persona del equipo.';
}

/**
 * Floating chat sidebar — botón en esquina inferior derecha que despliega
 * un panel deslizante con conversación + input.
 *
 * Diseño:
 * - Estética dark editorial consistente con HomeHero (zinc-950 bg).
 * - Streaming UI: cada chunk del SSE se appendea al mensaje en progreso.
 * - Sugested prompts al inicio (cuando no hay mensajes).
 * - Historial limitado a últimos 20 mensajes (matches server-side max).
 * - Markdown rendering simple — links se renderean clickeables.
 */
export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [buyBarVisible, setBuyBarVisible] = useState(false);
  const [messageCards, setMessageCards] = useState<Record<number, ChatCard[]>>(
    {},
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // La barra de compra sticky (PDP mobile) ocupa el fondo — corremos el botón
  // del chat hacia arriba para no solaparnos.
  useEffect(() => {
    const onBuyBar = (e: Event) =>
      setBuyBarVisible(Boolean((e as CustomEvent).detail?.visible));
    window.addEventListener('oc:buybar', onBuyBar);
    return () => window.removeEventListener('oc:buybar', onBuyBar);
  }, []);

  // Auto-scroll al final cuando llega nuevo mensaje o streaming chunk.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Cleanup del stream activo si se cierra el panel.
  useEffect(() => {
    if (!isOpen && abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, [isOpen]);

  const sendMessage = async (userMessage: string) => {
    if (isStreaming || !userMessage.trim()) return;

    const trimmed = userMessage.trim();
    const newUserMessage: ChatMessage = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsStreaming(true);
    setStreamingContent('');

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          userMessage: trimmed,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok || !res.body) {
        let errMsg = 'No pudimos procesar tu consulta. Probá de nuevo.';
        try {
          const data = (await res.json()) as { error?: string };
          if (data.error) errMsg = data.error;
        } catch {
          // ignore
        }
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `⚠️ ${errMsg}` },
        ]);
        setIsStreaming(false);
        return;
      }

      // Parse SSE stream.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (!payload) continue;
          if (payload === '[DONE]') continue;

          try {
            const event = JSON.parse(payload) as { text?: string; error?: string };
            if (event.text) {
              accumulated += event.text;
              setStreamingContent(accumulated);
            } else if (event.error) {
              accumulated += `\n\n⚠️ ${event.error}`;
              setStreamingContent(accumulated);
            }
          } catch {
            // Ignore lines mal formadas.
          }
        }
      }

      // Stream completo: convertir streamingContent en mensaje final.
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: accumulated || 'Sin respuesta.' },
      ]);

      // Si la respuesta linkeó productos, traer sus cards y mostrarlas debajo
      // del mensaje (en mobile una card con foto+precio convierte mucho más
      // que un link de texto). El índice del mensaje del asistente recién
      // agregado es `updatedMessages.length` (user ya estaba al final).
      const productSlugs = extractProductSlugs(accumulated);
      if (productSlugs.length > 0) {
        const assistantIndex = updatedMessages.length;
        fetch(
          `/api/recently-viewed/cards?slugs=${encodeURIComponent(productSlugs.join(','))}`,
        )
          .then((r) => (r.ok ? r.json() : null))
          .then((data: { cards?: ChatCard[] } | null) => {
            if (data?.cards && data.cards.length > 0) {
              setMessageCards((prev) => ({
                ...prev,
                [assistantIndex]: data.cards!,
              }));
            }
          })
          .catch(() => {
            // silencioso — las cards son un extra, el texto ya tiene los links
          });
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        // Usuario cerró el panel — silencio normal.
      } else {
        console.error('[FloatingChat] Send failed:', err);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: '⚠️ Hubo un problema. Probá de nuevo o escribinos por WhatsApp.',
          },
        ]);
      }
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
      abortControllerRef.current = null;
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handoffHref = getWhatsappLinkWithContext(buildHandoffMessage(messages));

  return (
    <>
      {/* Floating button — esquina inferior derecha. Solo se muestra cuando
          el panel está CERRADO. Cuando isOpen=true, el usuario cierra con
          el X del header del panel (sin botón duplicado + sin overlap
          z-index que rompía el click del X header en mobile). */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn(
            // En mobile va ARRIBA del botón de WhatsApp (que vive en la esquina
            // bottom-4/sm:bottom-6) para no superponerse. En desktop tiene su
            // propia columna (md:right-24 md:bottom-8).
            'bg-foreground text-background hover:bg-foreground/90 animate-in fade-in zoom-in-90 fixed right-4 z-40 flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 sm:right-6 md:right-24 md:bottom-8',
            buyBarVisible ? 'bottom-28' : 'bottom-20',
          )}
          aria-label="Abrir asistente"
        >
          <Sparkles className="size-6" strokeWidth={1.5} />
        </button>
      )}

      {/* Panel deslizante — sidebar editorial dark, fixed right. Entrada con
          tailwindcss-animate (antes framer-motion; cierre instantáneo).
          Perf 2026-06-11: framer fuera del bundle global. */}
      {isOpen && (
          <div
            className="animate-in slide-in-from-right fade-in fixed bottom-0 right-0 top-0 z-50 flex w-full flex-col bg-zinc-950 text-white shadow-2xl duration-300 md:w-[440px]"
          >
            {/* Header */}
            <div className="border-white/10 flex items-center justify-between border-b px-6 py-5">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-white/60">
                  <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
                  Asistente
                </p>
                <p className="text-white mt-1 font-serif text-xl font-medium tracking-tight">
                  ¿En qué te ayudo?
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar"
                className="text-white/60 hover:bg-white/10 hover:text-white flex size-9 items-center justify-center rounded-full transition-colors"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
              {messages.length === 0 && !isStreaming && (
                <SuggestedPrompts onSelect={sendMessage} />
              )}
              {messages.map((msg, idx) => (
                <div key={idx}>
                  <MessageBubble message={msg} />
                  {msg.role === 'assistant' &&
                    messageCards[idx] &&
                    messageCards[idx].length > 0 && (
                      <div className="mt-2 space-y-2">
                        {messageCards[idx].map((card) => (
                          <ChatProductCardLink key={card.slug} card={card} />
                        ))}
                      </div>
                    )}
                </div>
              ))}
              {isStreaming && streamingContent && (
                <MessageBubble
                  message={{ role: 'assistant', content: streamingContent }}
                  streaming
                />
              )}
              {isStreaming && !streamingContent && (
                <div className="text-white/50 flex items-center gap-2 text-sm">
                  <Loader2 className="size-4 animate-spin" />
                  Pensando…
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Handoff a una persona — siempre visible. El cliente desconfiado
                quiere hablar con alguien; abre WhatsApp con su consulta ya
                escrita. */}
            {handoffHref && (
              <a
                href={handoffHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track(Events.WHATSAPP_CLICK, { source: 'chat' })}
                className="border-white/10 flex items-center justify-center gap-2 border-t bg-white/[0.04] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/[0.08]"
              >
                <WhatsappIcon className="size-4" />
                Hablar con una persona
              </a>
            )}

            {/* Input */}
            <form
              onSubmit={onSubmit}
              className="border-white/10 border-t bg-zinc-950 px-6 py-5"
            >
              <div className="border-white/15 focus-within:border-white/40 relative flex items-end gap-2 rounded-2xl border bg-white/5 px-4 py-3 transition-colors">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onSubmit(e);
                    }
                  }}
                  placeholder="Escribí tu consulta…"
                  rows={1}
                  disabled={isStreaming}
                  className="placeholder:text-white/40 max-h-32 flex-1 resize-none bg-transparent text-sm text-white outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isStreaming || !input.trim()}
                  aria-label="Enviar"
                  className="bg-white text-zinc-900 hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 flex size-9 shrink-0 items-center justify-center rounded-full transition-colors"
                >
                  <ArrowUp className="size-4" strokeWidth={2} />
                </button>
              </div>
              <p className="text-white/40 mt-2.5 text-xs">
                Asistente con IA. Las recomendaciones son orientativas — para
                consultas técnicas, escribinos por WhatsApp.
              </p>
            </form>
          </div>
      )}
    </>
  );
}

function SuggestedPrompts({
  onSelect,
}: {
  onSelect: (prompt: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <MessageSquare className="text-white/40 size-7" strokeWidth={1.5} />
        <p className="text-white font-serif text-2xl font-medium leading-tight tracking-tight">
          Buscás algo específico?
        </p>
        <p className="text-white/60 text-sm leading-relaxed">
          Te ayudo a encontrar productos del catálogo o resolver dudas sobre
          envíos, recetas, garantía. Probá uno de estos o escribí lo tuyo:
        </p>
      </div>

      <div className="space-y-2 pt-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSelect(prompt)}
            className="border-white/15 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06] w-full rounded-lg border px-4 py-3 text-left text-sm text-white/80 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  streaming = false,
}: {
  message: ChatMessage;
  streaming?: boolean;
}) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-white text-zinc-900'
            : 'bg-white/[0.06] text-white',
        )}
      >
        <SimpleMarkdown content={message.content} />
        {streaming && (
          <span className="bg-white/60 ml-0.5 inline-block h-3 w-0.5 animate-pulse align-middle" />
        )}
      </div>
    </div>
  );
}

/**
 * Card de producto dentro del chat: foto + marca + nombre + precio, linkeable
 * a la PDP. En mobile (70% del tráfico) convierte mucho más que un link de
 * texto perdido en el párrafo.
 */
function ChatProductCardLink({ card }: { card: ChatCard }) {
  const href = `/${card.categorySlug}/${card.brandSlug}/${card.slug}`;
  const imageUrl = card.primaryImagePath
    ? getProductImageUrl(card.primaryImagePath)
    : null;
  return (
    <a
      href={href}
      className="border-white/10 bg-white/[0.04] hover:bg-white/[0.08] flex items-center gap-3 rounded-xl border p-2 transition-colors"
    >
      <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="size-full object-contain p-1"
            style={{ transform: `scale(${card.primaryImageScale})` }}
          />
        ) : (
          <span className="text-xs text-zinc-400">—</span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[11px] uppercase tracking-wide text-white/50">
          {card.brandName}
        </span>
        <span className="block truncate text-sm font-medium text-white">
          {card.name}
        </span>
        {card.minPriceCents != null && (
          <span className="block text-sm tabular-nums text-white/80">
            {formatPriceCents(card.minPriceCents)}
          </span>
        )}
      </span>
    </a>
  );
}

/**
 * Markdown render simple — convierte:
 * - `[text](url)` → <a> clickeable
 * - `**text**` → <strong>
 * - `- item` (líneas) → bullets
 * - `\n\n` → párrafos
 *
 * NO usa lib markdown completa por evitar deps. Cubre el 90% de los
 * casos que el modelo usa en respuestas.
 */
function SimpleMarkdown({ content }: { content: string }) {
  const paragraphs = content.split('\n\n').filter((p) => p.trim());

  return (
    <div className="space-y-2.5">
      {paragraphs.map((para, idx) => {
        // Check si es lista (líneas que empiezan con `- `).
        const lines = para.split('\n');
        const isList = lines.every((l) => l.trim().startsWith('- '));
        if (isList) {
          return (
            <ul key={idx} className="list-disc space-y-1 pl-4">
              {lines.map((line, li) => (
                <li key={li}>
                  <InlineMarkdown text={line.replace(/^-\s*/, '')} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={idx}>
            <InlineMarkdown text={para.replace(/\n/g, ' ')} />
          </p>
        );
      })}
    </div>
  );
}

function InlineMarkdown({ text }: { text: string }) {
  // Parser simple: detecta [text](url) y **bold**.
  const parts: Array<{ type: 'text' | 'link' | 'bold'; content: string; url?: string }> = [];
  let remaining = text;

  while (remaining.length > 0) {
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);

    const linkIdx = linkMatch?.index ?? Infinity;
    const boldIdx = boldMatch?.index ?? Infinity;
    const nextIdx = Math.min(linkIdx, boldIdx);

    if (nextIdx === Infinity) {
      parts.push({ type: 'text', content: remaining });
      break;
    }

    if (nextIdx > 0) {
      parts.push({ type: 'text', content: remaining.slice(0, nextIdx) });
    }

    if (linkIdx < boldIdx && linkMatch) {
      parts.push({
        type: 'link',
        content: linkMatch[1]!,
        url: linkMatch[2]!,
      });
      remaining = remaining.slice(nextIdx + linkMatch[0].length);
    } else if (boldMatch) {
      parts.push({ type: 'bold', content: boldMatch[1]! });
      remaining = remaining.slice(nextIdx + boldMatch[0].length);
    }
  }

  return (
    <>
      {parts.map((part, idx) => {
        if (part.type === 'link') {
          return (
            <a
              key={idx}
              href={part.url}
              className="underline underline-offset-2 hover:opacity-80"
            >
              {part.content}
            </a>
          );
        }
        if (part.type === 'bold') {
          return <strong key={idx}>{part.content}</strong>;
        }
        return <span key={idx}>{part.content}</span>;
      })}
    </>
  );
}
