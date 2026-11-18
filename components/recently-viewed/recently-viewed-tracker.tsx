'use client';

import { useEffect } from 'react';
import { trackRecentAction } from '@/lib/recently-viewed/actions';
import type { RecentEntry } from '@/lib/recently-viewed/cookie';

/**
 * Tracker invisible: se monta en la página de producto y dispara la
 * server action que escribe el slug al cookie de "vistos recientes".
 * No renderiza nada visible — solo side-effect al mount.
 */
export function RecentlyViewedTracker({ entry }: { entry: RecentEntry }) {
  const { slug, category, brand } = entry;

  // IMPORTANTE: depender de los valores PRIMITIVOS, no del objeto `entry`.
  // La server action escribe una cookie, y eso hace que Next vuelva a renderizar
  // la página; en cada render llega un `entry` NUEVO (mismo contenido, otra
  // identidad). Con `[entry]` como dependencia el efecto se volvía a disparar,
  // la action volvía a escribir la cookie y se armaba un bucle infinito (~3
  // POST por segundo por pestaña abierta; disparó las alertas de "function
  // invocations spike" de Vercel el 2026-11-16).
  useEffect(() => {
    // Fire-and-forget. Si falla, no es crítico, no mostramos error.
    void trackRecentAction({ slug, category, brand }).catch(() => {});
  }, [slug, category, brand]);

  return null;
}
