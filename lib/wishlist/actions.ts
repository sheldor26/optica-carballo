'use server';

import { revalidatePath } from 'next/cache';
import { toggleWishlist, type WishlistEntry } from '@/lib/wishlist/cookie';

/**
 * Server action que toglea un producto en el wishlist y revalida la página
 * de favoritos para que refresque al volver. Devuelve el nuevo estado
 * (true = agregado, false = quitado) para que el cliente actualice UI.
 */
export async function toggleWishlistAction(
  entry: WishlistEntry,
): Promise<{ added: boolean }> {
  const added = await toggleWishlist(entry);
  // Revalidar página de favoritos por si el user vuelve sin recargar.
  revalidatePath('/favoritos');
  return { added };
}
