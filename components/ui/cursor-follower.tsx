'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Custom cursor que reemplaza al del sistema:
 * - 1 dot (8px) + 1 ring (32px) que sigue al mouse con leve delay (spring).
 * - mix-blend-difference para invertirse sobre fondos oscuros sin perderse.
 * - Se oculta automáticamente en touch devices (no aplica).
 * - Se "expande" cuando el target es link/button/input clickeable.
 * - Respeta prefers-reduced-motion: si activo, no se renderiza (deja el del sistema).
 */
export function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 350, damping: 28, mass: 0.5 };
  const ringX = useSpring(x, springConfig);
  const ringY = useSpring(y, springConfig);

  useEffect(() => {
    // Solo desktop fino: no touch, no reduced motion.
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    setEnabled(true);

    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
      const target = e.target as HTMLElement | null;
      const clickable = target?.closest(
        'a, button, [role="button"], input, textarea, select, summary, [data-cursor="hover"]',
      );
      setHovering(Boolean(clickable));
    }

    function onLeave() {
      setVisible(false);
    }

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [x, y, visible]);

  if (!enabled) return null;

  return (
    <>
      {/* Dot — sigue al mouse 1:1 (sin spring) para sensación precisa */}
      <motion.div
        aria-hidden="true"
        style={{ x, y, opacity: visible ? 1 : 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-1 -mt-1 size-2 rounded-full bg-white mix-blend-difference transition-opacity duration-200"
      />
      {/* Ring — sigue con spring + se expande al hover */}
      <motion.div
        aria-hidden="true"
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-4 -mt-4 mix-blend-difference transition-opacity duration-200"
      >
        <div
          className={
            hovering
              ? 'size-8 rounded-full border-2 border-white scale-150 transition-transform duration-200'
              : 'size-8 rounded-full border border-white/80 transition-transform duration-200'
          }
        />
      </motion.div>
    </>
  );
}
