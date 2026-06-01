'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  id={`faq-answer-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.3, ease: [0.2, 0.6, 0.2, 1] },
                    opacity: { duration: 0.2 },
                  }}
                  className="overflow-hidden"
                  role="region"
                  aria-labelledby={item.id}
                >
                  <div className="text-muted-foreground px-5 pb-5 text-sm leading-relaxed sm:px-6 sm:text-base">
                    <FaqAnswerText text={item.answer} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
