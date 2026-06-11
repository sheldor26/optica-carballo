'use client';

import type { RecentEntry } from '@/lib/recently-viewed/cookie';

const COOKIE_NAME = 'oc_recent';
const MAX_ITEMS = 10;

/**
 * Lee "vistos recientemente" desde el cookie del browser (es `httpOnly:
 * false`). Mismo patrón que `lib/compare/client.ts`. Existe porque leer el
 * cookie server-side (`cookies()`) volvía DINÁMICAS la home y las PDP que
 * renderizan la sección — anulaba el ISR (audit perf 2026-06-11).
 */
export function readRecentClientSide(): RecentEntry[] {
  if (typeof document === 'undefined') return [];
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!cookie) return [];
  const raw = decodeURIComponent(cookie.split('=')[1] ?? '');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is RecentEntry =>
          typeof item === 'object' &&
          item !== null &&
          typeof (item as RecentEntry).slug === 'string' &&
          typeof (item as RecentEntry).category === 'string' &&
          typeof (item as RecentEntry).brand === 'string',
      )
      .slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}
