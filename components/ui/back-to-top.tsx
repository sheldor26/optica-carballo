'use client';

import { useEffect, useState } from 'react';
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

  // Entrada con tailwindcss-animate (antes framer-motion + AnimatePresence;
  // la animación de salida se omitió — desaparición instantánea, imperceptible
  // en un botón flotante). Perf 2026-06-11: framer fuera del bundle global.
  if (!visible) return null;

  return (
    <button
      key="back-to-top"
      type="button"
      onClick={onClick}
      aria-label="Volver arriba"
      className={cn(
        'animate-in fade-in zoom-in-75 slide-in-from-bottom-3 fixed z-30 flex size-11 items-center justify-center rounded-full shadow-md transition-all duration-200',
        'bg-foreground/85 text-background hover:bg-foreground hover:scale-110',
        // Mobile: al lado del WhatsApp (left), desktop: encima del WhatsApp.
        'bottom-4 right-[5.25rem] sm:bottom-[5.5rem] sm:right-6',
      )}
    >
      <ArrowUp className="size-5" strokeWidth={2} />
    </button>
  );
}
