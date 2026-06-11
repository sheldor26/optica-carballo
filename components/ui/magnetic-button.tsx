'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  strength?: number;
};

/**
 * Efecto magnético en hover (el contenido "sigue" al cursor). Vanilla JS:
 * transform directo en mousemove + transition CSS para el follow suave y el
 * snap-back con leve rebote. Era framer-motion (useMotionValue + useSpring) —
 * se reescribió porque el header lo usa en TODAS las páginas y mantenía
 * framer (~34kB gz) en el bundle inicial (sesión perf 2026-06-11).
 */
export function MagneticButton({
  children,
  className,
  strength = 0.28,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasFinePointer = window.matchMedia(
      '(hover: hover) and (pointer: fine)',
    ).matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches;
    setEnabled(hasFinePointer && !reduced);
  }, []);

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapperRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    // Transition corta mientras sigue al cursor (suaviza como el spring).
    inner.style.transition = 'transform 150ms ease-out';
    inner.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  };

  const handleLeave = () => {
    const inner = innerRef.current;
    if (!inner) return;
    // Snap-back con overshoot (aproxima el rebote del spring original).
    inner.style.transition = 'transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)';
    inner.style.transform = 'translate(0px, 0px)';
  };

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
