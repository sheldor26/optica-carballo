'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Layer = { id: number; src: string; scale: number };

/**
 * Imagen que hace un fundido (crossfade) cuando cambia el `src` — en vez del
 * corte seco del swap de variante. La capa nueva entra con fade-in por encima
 * de la vieja (que queda opaca abajo, sin huecos transparentes); cuando termina
 * la transición se descarta la vieja.
 *
 * Cada capa lleva su propio `scale` (las fotos del catálogo usan scale override
 * para normalizar tamaño): durante el fundido, la saliente conserva su scale y
 * la entrante el suyo, sin saltos.
 *
 * Respeta `prefers-reduced-motion` (swap directo). El contenedor (`className`)
 * DEBE estar posicionado (relative/absolute) — las capas van `absolute inset-0`.
 */
export function CrossfadeImage({
  src,
  scale = 1,
  alt,
  sizes,
  priority = false,
  durationMs = 350,
  className,
  imageClassName,
}: {
  src: string;
  scale?: number;
  alt: string;
  sizes?: string;
  priority?: boolean;
  durationMs?: number;
  /** El contenedor — debe estar posicionado (ej "relative h-full w-full"). */
  className?: string;
  /** Clases para el <Image> de cada capa (ej "object-contain"). */
  imageClassName?: string;
}) {
  const [layers, setLayers] = useState<Layer[]>([{ id: 0, src, scale }]);
  const [reduced, setReduced] = useState(false);
  const counter = useRef(0);
  const prevSrc = useRef(src);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (src === prevSrc.current) return;
    prevSrc.current = src;
    const id = ++counter.current;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLayers([{ id, src, scale }]);
      return;
    }

    setLayers((prev) => [...prev, { id, src, scale }]);
    const timer = window.setTimeout(() => {
      setLayers((prev) => prev.filter((l) => l.id === id));
    }, durationMs + 40);
    return () => window.clearTimeout(timer);
  }, [src, scale, durationMs]);

  return (
    <div className={className}>
      {layers.map((layer, i) => {
        const isCurrent = i === layers.length - 1;
        const animate = !reduced && layer.id !== 0;
        return (
          <div
            key={layer.id}
            className={cn('absolute inset-0', animate && 'animate-in fade-in')}
            style={{
              transform: `scale(${layer.scale})`,
              animationDuration: animate ? `${durationMs}ms` : undefined,
            }}
          >
            <Image
              src={layer.src}
              alt={isCurrent ? alt : ''}
              fill
              sizes={sizes}
              priority={priority && layer.id === 0}
              className={imageClassName}
            />
          </div>
        );
      })}
    </div>
  );
}
