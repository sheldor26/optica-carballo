'use client';

import { Fragment, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

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

  const Tag = as;
  // Split por palabras: cada palabra es un wrapper inline-block
  // whitespace-nowrap (evita que el browser rompa la palabra a mitad
  // — bug detectado en producción 2026-05-28). Entre palabras dejamos
  // un espacio de texto normal, que SÍ permite el wrap de línea.
  // Cada letra dentro de la palabra usa delay individual (no `stagger`
  // del container) para que el efecto cascada atraviese las palabras
  // sin que el grouping las "resetee".
  const words = text.split(' ');
  let letterCounter = 0;

  return (
    <Tag
      className={className}
      style={italic ? { fontStyle: 'italic' } : undefined}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <Fragment key={`w-${wi}`}>
          <span
            style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
            aria-hidden="true"
          >
            {Array.from(word).map((char) => {
              const idx = letterCounter++;
              return (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: delay + idx * 0.025,
                    duration: 0.45,
                    ease: [0.2, 0.6, 0.2, 1],
                  }}
                  // SIN display: inline-block ni transform. Solo opacity fade.
                  // Fix bug 2026-05-30: inline-block + transform Y residual
                  // causaban subpixel/baseline shift en letras con descender
                  // (j, g, p, y) — se veían "movidas" tras la animación.
                  // Opacity-only no afecta layout ni baseline.
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
          {wi < words.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  );
}
