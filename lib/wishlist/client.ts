'use client';

import type { WishlistEntry } from '@/lib/wishlist/cookie';

const COOKIE_NAME = 'oc_wishlist';

/**
 * Lee el wishlist desde el cookie del browser. Usado por el badge en
 * el header para mostrar el count sin un round-trip al server.
 */
export function readWishlistClientSide(): WishlistEntry[] {
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
      (item): item is WishlistEntry =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as WishlistEntry).slug === 'string' &&
        typeof (item as WishlistEntry).category === 'string' &&
        typeof (item as WishlistEntry).brand === 'string',
    );
  } catch {
    return [];
  }
}
