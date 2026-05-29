'use client';

import type { CompareEntry } from '@/lib/compare/cookie';

const COOKIE_NAME = 'oc_compare';

/**
 * Lee el comparador desde el cookie del browser. Usado por el botón
 * en página de producto y la barra sticky para reflejar estado sin
 * server round-trip.
 */
export function readCompareClientSide(): CompareEntry[] {
  if (typeof document === 'undefined') return [];
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!cookie) return [];
  const raw = decodeURIComponent(cookie.split('=')[1] ?? '');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CompareEntry =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as CompareEntry).slug === 'string' &&
        typeof (item as CompareEntry).category === 'string' &&
        typeof (item as CompareEntry).brand === 'string',
    );
  } catch {
    return [];
  }
}
