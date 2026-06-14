'use client';

import { useEffect, useRef, useState } from 'react';
import { formatPriceCents } from '@/lib/format/currency';

const DEFAULT_DURATION_MS = 500;

/**
 * Precio que "cuenta" animado hasta su valor al cambiar (y opcionalmente al
 * aparecer). El número rueda desde el valor anterior hasta el nuevo con
 * easing, formateado en pesos cada frame.
 *
 * - `animateOnMount`: en la PDP queremos que cuente desde 0 al aparecer. En las
 *   cards del grid NO (sino 13 números bailarían al cargar la página) — ahí
 *   solo cuenta cuando cambia la variante.
 * - Respeta `prefers-reduced-motion` (muestra el número directo).
 *
 * Recibe SIEMPRE un número (centavos). El branch "Sin stock" lo decide el padre.
 */
export function AnimatedPrice({
  valueCents,
  animateOnMount = false,
  durationMs = DEFAULT_DURATION_MS,
  className,
}: {
  valueCents: number;
  animateOnMount?: boolean;
  durationMs?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(valueCents);
  const displayRef = useRef(valueCents);
  const firstRun = useRef(true);

  useEffect(() => {
    const to = valueCents;
    let from = displayRef.current;

    if (firstRun.current) {
      firstRun.current = false;
      if (!animateOnMount) {
        displayRef.current = to;
        setDisplay(to);
        return;
      }
      from = 0;
    }

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || from === to) {
      displayRef.current = to;
      setDisplay(to);
      return;
    }

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      const v = Math.round(from + (to - from) * eased);
      displayRef.current = v;
      setDisplay(v);
      if (k < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        displayRef.current = to;
        setDisplay(to);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [valueCents, animateOnMount, durationMs]);

  return <span className={className}>{formatPriceCents(display)}</span>;
}
