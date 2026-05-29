'use server';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'oc_recent';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 días
const MAX_ITEMS = 10;

export type RecentEntry = {
  slug: string;
  category: string;
  brand: string;
};

/**
 * "Productos vistos recientemente" — tracker automático.
 * Mismo patrón que wishlist: cookie con array. Diferencias clave:
 * - Auto-tracker (no requiere click del usuario).
 * - Max 10 items, LRU (al ver de nuevo un producto sube al tope).
 * - 30 días de duración (vs 90 del wishlist — info más volátil).
 */
export async function readRecentCookie(): Promise<RecentEntry[]> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
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

/**
 * Agrega un producto al tope de "vistos recientes". Si ya estaba, lo
 * promueve al tope (LRU). Si la lista excede MAX_ITEMS, descarta los
 * más viejos.
 */
export async function addToRecent(entry: RecentEntry): Promise<void> {
  const store = await cookies();
  const current = await readRecentCookie();
  // Quitar si ya estaba (para promoverlo)
  const without = current.filter((item) => item.slug !== entry.slug);
  const next = [entry, ...without].slice(0, MAX_ITEMS);
  store.set({
    name: COOKIE_NAME,
    value: JSON.stringify(next),
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
  });
}
