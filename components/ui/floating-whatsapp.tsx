'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { readCompareClientSide } from '@/lib/compare/client';
import { track, Events } from '@/lib/analytics/track';

type Props = {
  whatsappLink: string;
  defaultMessage?: string;
  /** Si querés ocultar en alguna ruta puntual, pasá true como prop. */
  hidden?: boolean;
};

/**
 * Botón flotante de WhatsApp siempre visible. Aparece tras un pequeño
 * delay para no competir con LCP. Mobile-first (más prominente en mobile,
 * más discreto en desktop).
 *
 * Se OCULTA cuando hay productos en la CompareBar (la barra inferior
 * ya tiene CTA propio — evita stack de overlays).
 */
export function FloatingWhatsapp({
  whatsappLink,
  defaultMessage,
  hidden,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [compareCount, setCompareCount] = useState(0);

  useEffect(() => {
    // Delay para no competir con LCP/CLS.
    const t = window.setTimeout(() => setMounted(true), 800);

    const tick = () => setCompareCount(readCompareClientSide().length);
    tick();
    const interval = window.setInterval(tick, 1500);
    window.addEventListener('focus', tick);

    return () => {
      window.clearTimeout(t);
      window.clearInterval(interval);
      window.removeEventListener('focus', tick);
    };
  }, []);

  const shouldHide = hidden || compareCount > 0;

  const href = defaultMessage
    ? `${whatsappLink}${whatsappLink.includes('?') ? '&' : '?'}text=${encodeURIComponent(defaultMessage)}`
    : whatsappLink;

  return (
    <AnimatePresence>
      {mounted && !shouldHide && (
        <motion.a
          key="floating-wa"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribinos por WhatsApp"
          onClick={() => track(Events.WHATSAPP_CLICK, { source: 'floating' })}
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ type: 'spring', stiffness: 360, damping: 24 }}
          className={cn(
            'fixed bottom-4 right-4 z-30 flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-200',
            'bg-[#25D366] text-white hover:scale-110 hover:bg-[#1ebe5d]',
            'sm:bottom-6 sm:right-6 sm:size-12',
          )}
        >
          <MessageCircle className="size-7 sm:size-6" strokeWidth={2} />
          <span className="bg-[#25D366] absolute inset-0 -z-10 animate-ping rounded-full opacity-30" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
