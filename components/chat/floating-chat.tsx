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
import type { ChatMessage } from '@/lib/chat/types';

const SUGGESTED_PROMPTS = [
  '¿Qué anteojos de sol polarizados tenés?',
  '¿Qué armazón va para cara cuadrada?',
  '¿Cuánto tarda el envío al interior?',
  '¿Cómo funciona la garantía?',
];

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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
          className="bg-foreground text-background hover:bg-foreground/90 animate-in fade-in zoom-in-90 fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 md:bottom-8 md:right-24"
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
                <MessageBubble key={idx} message={msg} />
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
