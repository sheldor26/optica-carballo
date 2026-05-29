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
  useEffect(() => {
    // Fire-and-forget. Si falla, no es crítico, no mostramos error.
    void trackRecentAction(entry).catch(() => {});
  }, [entry]);

  return null;
}
