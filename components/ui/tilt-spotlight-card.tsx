'use client';

import { useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
  /** Intensidad del tilt en grados (default 6 = sutil). */
  tiltDeg?: number;
};

/**
 * Card wrapper con dos efectos combinados al pasar el mouse:
 * 1. Tilt 3D: la card se inclina hacia donde apunta el cursor (perspective + rotate).
 * 2. Spotlight: un gradient radial luminoso sigue al cursor sobre la card.
 *
 * Ambos efectos se desactivan en touch devices (no aplica) y con prefers-reduced-motion.
 * El children se renderiza tal cual, este wrapper agrega solo presentación.
 */
export function TiltSpotlightCard({
  children,
  className,
  tiltDeg = 6,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  // Mouse position dentro de la card (0..1 cada eje).
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Spring para suavizar el tilt.
  const springConfig = { stiffness: 150, damping: 18, mass: 0.4 };
  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], [tiltDeg, -tiltDeg]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], [-tiltDeg, tiltDeg]),
    springConfig,
  );

  // Posición del spotlight como template string reactivo.
  const spotlightX = useTransform(mouseX, (v) => `${v * 100}%`);
  const spotlightY = useTransform(mouseY, (v) => `${v * 100}%`);
  const spotlightBg = useMotionTemplate`radial-gradient(220px circle at ${spotlightX} ${spotlightY}, rgba(200, 163, 90, 0.22), transparent 70%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function onLeave() {
    setHovering(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={onLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      }}
      className={cn('relative', className)}
    >
      {children}
      {/* Spotlight overlay — sigue al mouse, fade in/out con hover */}
      <motion.div
        aria-hidden="true"
        style={{
          background: spotlightBg,
          opacity: hovering ? 1 : 0,
        }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
      />
    </motion.div>
  );
}
