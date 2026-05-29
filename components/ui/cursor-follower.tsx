'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Cursor follower estilo "glow / halo radial sutil".
 *
 * Decisión 2026-05-28 (founder): el cursor anterior (dot + ring +
 * mix-blend-difference) era invasivo. Cambiado por un glow ámbar muy
 * difuso que NO reemplaza el cursor del sistema operativo — solo
 * acompaña al mouse con spring para dar sensación premium sin
 * tapar / interferir.
 *
 * - Se monta solo en desktop fino (`pointer: fine`).
 * - Respeta `prefers-reduced-motion`: si activo, NO se renderiza.
 * - Sin reacción al hover de interactivos — el efecto es ambiental, no
 *   "respondes a algo". Eso lo manejan otros componentes (spotlight,
 *   magnetic buttons, tilt cards).
 */
export function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 180, damping: 28, mass: 0.6 };
  const glowX = useSpring(x, springConfig);
  const glowY = useSpring(y, springConfig);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (!fine || reduced) return;
    setEnabled(true);

    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
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
    <motion.div
      aria-hidden="true"
      style={{
        x: glowX,
        y: glowY,
        opacity: visible ? 1 : 0,
      }}
      className="bg-brand/20 pointer-events-none fixed left-0 top-0 z-[100] -ml-[140px] -mt-[140px] size-[280px] rounded-full blur-3xl transition-opacity duration-500"
    />
  );
}
