'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { WhatsappIcon } from '@/components/ui/whatsapp-icon';
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
  const [buyBarVisible, setBuyBarVisible] = useState(false);

  useEffect(() => {
    // Delay para no competir con LCP/CLS.
    const t = window.setTimeout(() => setMounted(true), 800);

    const tick = () => setCompareCount(readCompareClientSide().length);
    tick();
    const interval = window.setInterval(tick, 1500);
    window.addEventListener('focus', tick);

    // La barra de compra sticky (PDP mobile) ocupa la esquina inferior — nos
    // ocultamos mientras esté visible para no solaparnos.
    const onBuyBar = (e: Event) =>
      setBuyBarVisible(Boolean((e as CustomEvent).detail?.visible));
    window.addEventListener('oc:buybar', onBuyBar);

    return () => {
      window.clearTimeout(t);
      window.clearInterval(interval);
      window.removeEventListener('focus', tick);
      window.removeEventListener('oc:buybar', onBuyBar);
    };
  }, []);

  const shouldHide = hidden || compareCount > 0 || buyBarVisible;

  const href = defaultMessage
    ? `${whatsappLink}${whatsappLink.includes('?') ? '&' : '?'}text=${encodeURIComponent(defaultMessage)}`
    : whatsappLink;

  // Entrada con tailwindcss-animate (antes framer-motion; sin animación de
  // salida — desaparición instantánea, imperceptible). Perf 2026-06-11.
  if (!mounted || shouldHide) return null;

  return (
    <a
      key="floating-wa"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      onClick={() => track(Events.WHATSAPP_CLICK, { source: 'floating' })}
      className={cn(
        'animate-in fade-in zoom-in-75 slide-in-from-bottom-3 fixed bottom-4 right-4 z-30 flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-200',
        'bg-[#25D366] text-white hover:scale-110 hover:bg-[#1ebe5d]',
        'sm:bottom-6 sm:right-6 sm:size-12',
      )}
    >
      <WhatsappIcon className="size-7 sm:size-6" />
      <span className="bg-[#25D366] absolute inset-0 -z-10 animate-ping rounded-full opacity-30" />
    </a>
  );
}
