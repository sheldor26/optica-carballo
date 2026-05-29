'use server';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'oc_compare';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 días — info volátil
const MAX_ITEMS = 4;

export type CompareEntry = {
  slug: string;
  category: string;
  brand: string;
};

/**
 * Comparador persistido en cookie. Patrón idéntico al wishlist (ver
 * `lib/wishlist/cookie.ts`) pero con cap más bajo (4 productos) y duración
 * más corta (30 días) — la intención de comparar es de sesión, no de
 * memoria a largo plazo.
 */
export async function readCompareCookie(): Promise<CompareEntry[]> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is CompareEntry =>
          typeof item === 'object' &&
          item !== null &&
          typeof (item as CompareEntry).slug === 'string' &&
          typeof (item as CompareEntry).category === 'string' &&
          typeof (item as CompareEntry).brand === 'string',
      )
      .slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

async function writeCompareCookie(items: CompareEntry[]): Promise<void> {
  const store = await cookies();
  store.set({
    name: COOKIE_NAME,
    value: JSON.stringify(items.slice(0, MAX_ITEMS)),
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
  });
}

/**
 * Toggle de un producto. Si ya está → lo saca. Si no está y hay espacio → lo agrega.
 * Si no hay espacio (ya hay 4) → no agrega y devuelve { added: false, full: true }.
 */
export async function toggleCompare(
  entry: CompareEntry,
): Promise<{ added: boolean; full: boolean }> {
  const current = await readCompareCookie();
  const idx = current.findIndex((item) => item.slug === entry.slug);

  if (idx >= 0) {
    const next = current.filter((_, i) => i !== idx);
    await writeCompareCookie(next);
    return { added: false, full: false };
  }

  if (current.length >= MAX_ITEMS) {
    return { added: false, full: true };
  }

  const next = [...current, entry];
  await writeCompareCookie(next);
  return { added: true, full: false };
}

export async function clearCompare(): Promise<void> {
  await writeCompareCookie([]);
}

export async function removeFromCompare(slug: string): Promise<void> {
  const current = await readCompareCookie();
  const next = current.filter((item) => item.slug !== slug);
  await writeCompareCookie(next);
}
