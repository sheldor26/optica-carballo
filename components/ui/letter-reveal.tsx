'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  /** Texto a animar letra por letra. */
  text: string;
  /** Si pasa, se renderiza con italic — útil para mezclar serif italic + recto. */
  italic?: boolean;
  /** Delay base antes de empezar (segundos). */
  delay?: number;
  /** Tag HTML — default 'span'. */
  as?: 'span' | 'h1' | 'h2';
  className?: string;
};

/**
 * Anima texto letra por letra con stagger sutil + leve subida.
 * Respeta prefers-reduced-motion: si activo, renderiza estático sin animar.
 * Cada letra como inline-block con `whitespace-pre` para que espacios cuenten
 * como caracteres y la cadencia sea natural.
 */
export function LetterReveal({
  text,
  italic = false,
  delay = 0,
  as = 'span',
  className,
}: Props): ReactNode {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Tag = as;
    return (
      <Tag className={className} style={italic ? { fontStyle: 'italic' } : undefined}>
        {text}
      </Tag>
    );
  }

  const MotionTag = as === 'span' ? motion.span : as === 'h1' ? motion.h1 : motion.h2;

  return (
    <MotionTag
      className={className}
      style={italic ? { fontStyle: 'italic' } : undefined}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { delayChildren: delay, staggerChildren: 0.025 },
        },
      }}
      aria-label={text}
    >
      {Array.from(text).map((char, idx) => (
        <motion.span
          key={idx}
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.45, ease: [0.2, 0.6, 0.2, 1] },
            },
          }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {char}
        </motion.span>
      ))}
    </MotionTag>
  );
}
