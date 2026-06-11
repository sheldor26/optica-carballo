'use client';

import { useEffect, useRef } from 'react';

/**
 * Barra de progreso de scroll (línea de 2px arriba de todo). Vanilla:
 * rAF + transform directo en el DOM (sin re-renders de React) + transition
 * corta que suaviza como el spring. Era framer-motion (useScroll+useSpring) —
 * se reescribió porque está en el layout de TODAS las páginas (perf 2026-06-11).
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      el.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ transform: 'scaleX(0)', transformOrigin: '0% 50%' }}
      className="bg-brand fixed left-0 right-0 top-0 z-[60] h-[2px] transition-transform duration-150 ease-out"
    />
  );
}
