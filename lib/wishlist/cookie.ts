'use server';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'oc_wishlist';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 días
const MAX_ITEMS = 50;

export type WishlistEntry = {
  /** Slug del producto. */
  slug: string;
  /** Slug de la categoría (sol / receta) — para construir la URL. */
  category: string;
  /** Slug de la marca. */
  brand: string;
};

/**
 * Wishlist persistido en cookie. Funciona sin auth — la idea es bajar la
 * fricción al máximo. Si el usuario se loguea en el futuro y queremos
 * sync con DB para remarketing, sumamos esa lógica en iter 2.
 *
 * Cookie format: JSON array de WishlistEntry. Truncado a MAX_ITEMS.
 * Server-only (este archivo es 'use server') porque cookies() requiere
 * contexto de server component / server action.
 */
export async function readWishlistCookie(): Promise<WishlistEntry[]> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is WishlistEntry =>
          typeof item === 'object' &&
          item !== null &&
          typeof (item as WishlistEntry).slug === 'string' &&
          typeof (item as WishlistEntry).category === 'string' &&
          typeof (item as WishlistEntry).brand === 'string',
      )
      .slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

async function writeWishlistCookie(items: WishlistEntry[]): Promise<void> {
  const store = await cookies();
  store.set({
    name: COOKIE_NAME,
    value: JSON.stringify(items.slice(0, MAX_ITEMS)),
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax',
    httpOnly: false, // necesitamos leerlo desde client para badge en header
    secure: process.env.NODE_ENV === 'production',
  });
}

/**
 * Toggle de un producto en el wishlist. Si está → lo saca. Si no está → lo agrega.
 * Devuelve true si quedó AGREGADO (nuevo estado), false si quedó QUITADO.
 */
export async function toggleWishlist(entry: WishlistEntry): Promise<boolean> {
  const current = await readWishlistCookie();
  const idx = current.findIndex((item) => item.slug === entry.slug);

  if (idx >= 0) {
    // Sacar
    const next = current.filter((_, i) => i !== idx);
    await writeWishlistCookie(next);
    return false;
  }

  // Agregar — al inicio para que el más reciente quede primero
  const next = [entry, ...current];
  await writeWishlistCookie(next);
  return true;
}

export async function clearWishlist(): Promise<void> {
  await writeWishlistCookie([]);
}
