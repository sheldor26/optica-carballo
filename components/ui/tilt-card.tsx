'use client';

import { useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Wrapper de tilt 3D + brillo para cards, CSS puro (sin framer-motion).
 *
 * Por qué CSS y no `TiltSpotlightCard` (que sí usa framer-motion): las grillas
 * de catálogo renderizan muchas cards y la regla de performance del proyecto
 * prohíbe framer-motion en esas rutas. Acá movemos el transform por DOM directo
 * (sin re-render de React) y con rAF, así no pesa.
 *
 * Solo se activa en dispositivos con hover + puntero fino (desktop) y respeta
 * `prefers-reduced-motion`. En touch (70% del tráfico) no hace nada — la
 * experiencia mobile queda intacta.
 */
export function TiltCard({
  children,
  className,
  maxDeg = 6,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  /** Inclinación máxima en grados (default 6 = sutil). */
  maxDeg?: number;
  /** Brillo radial que sigue al cursor. */
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const enabled = useRef(false);
  const frame = useRef<number | null>(null);

  function canTilt(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function handleEnter() {
    enabled.current = canTilt();
  }

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!enabled.current) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rx = (0.5 - py) * maxDeg;
      const ry = (px - 0.5) * maxDeg;
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.02)`;
      if (glareRef.current) {
        glareRef.current.style.opacity = '1';
        glareRef.current.style.background = `radial-gradient(240px circle at ${(px * 100).toFixed(0)}% ${(py * 100).toFixed(0)}%, rgba(200, 163, 90, 0.16), transparent 70%)`;
      }
    });
  }

  function handleLeave() {
    const el = ref.current;
    if (el) el.style.transform = '';
    if (glareRef.current) glareRef.current.style.opacity = '0';
  }

  return (
    <div
      ref={ref}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn(
        'relative transition-transform duration-150 ease-out [transform-style:preserve-3d] hover:z-10',
        className,
      )}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
        />
      )}
    </div>
  );
}
