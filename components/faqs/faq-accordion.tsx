'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FaqEntry } from '@/lib/content/faqs';

type Props = {
  items: FaqEntry[];
  /** ID inicialmente abierto (deep-link `?faq=slug` o `#slug`). */
  defaultOpenId?: string;
};

export function FaqAccordion({ items, defaultOpenId }: Props) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <ul className="divide-border/60 border-border/60 divide-y rounded-xl border">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <li key={item.id} id={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${item.id}`}
              className={cn(
                'group flex w-full items-start justify-between gap-4 px-5 py-5 text-left transition-colors sm:px-6',
                'hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none',
              )}
            >
              <span className="text-foreground text-base font-medium leading-relaxed sm:text-lg">
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  'text-muted-foreground mt-1 size-5 shrink-0 transition-transform duration-300',
                  isOpen && 'rotate-180',
                )}
                aria-hidden="true"
              />
            </button>
            {/* Colapso con CSS grid-rows 0fr→1fr (antes framer-motion animaba
                height — perf 2026-06-11). Bonus SEO: la respuesta queda SIEMPRE
                en el HTML (antes solo montada al abrir). */}
            <div
              id={`faq-answer-${item.id}`}
              role="region"
              aria-labelledby={item.id}
              aria-hidden={!isOpen}
              className={cn(
                'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <div className="text-muted-foreground px-5 pb-5 text-sm leading-relaxed sm:px-6 sm:text-base">
                  <FaqAnswerText text={item.answer} />
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Render del texto de respuesta con soporte para bullets simples (`\n- item`).
 * Mantiene legibilidad pero permite estructurar listas cuando hace falta.
 */
function FaqAnswerText({ text }: { text: string }) {
  // Si tiene líneas que arrancan con "- ", las render como ul.
  if (text.includes('\n- ')) {
    const [intro, ...rest] = text.split('\n- ');
    const items = rest.map((line) => line.trim());
    return (
      <>
        {intro && <p className="whitespace-pre-line">{intro}</p>}
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </>
    );
  }
  return <p className="whitespace-pre-line">{text}</p>;
}
