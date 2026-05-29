'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Botón "Volver arriba". Aparece tras scrollear más de 600px.
 * Posicionado a la izquierda del FloatingWhatsapp en mobile (no se pisan)
 * y arriba del WhatsApp en desktop.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          type="button"
          onClick={onClick}
          aria-label="Volver arriba"
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ type: 'spring', stiffness: 360, damping: 24 }}
          className={cn(
            'fixed z-30 flex size-11 items-center justify-center rounded-full shadow-md transition-all duration-200',
            'bg-foreground/85 text-background hover:bg-foreground hover:scale-110',
            // Mobile: al lado del WhatsApp (left), desktop: encima del WhatsApp.
            'bottom-4 right-[5.25rem] sm:bottom-[5.5rem] sm:right-6',
          )}
        >
          <ArrowUp className="size-5" strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
