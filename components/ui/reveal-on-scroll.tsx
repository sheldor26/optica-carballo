'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'ul' | 'li' | 'article';
  /** Si es true, se renderiza visible desde el SSR sin animación de entrada
   * ni IntersectionObserver — para contenido candidato a LCP (ej. primera
   * fila de un grid de productos), donde el fade-in normal deja el elemento
   * en `opacity-0` hasta que React hidrata y el observer dispara, retrasando
   * el paint que cuenta para LCP más allá de cuándo llegaron los bytes de
   * la imagen (nextjs-performance 2026-08-01). */
  eager?: boolean;
};

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
  eager = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    if (eager) return;
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -64px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [eager]);

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      className={cn(
        !eager &&
          'transition-[opacity,transform] duration-700 ease-out will-change-[opacity,transform]',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
