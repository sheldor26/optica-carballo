import { PRODUCTS_BUCKET } from '@/lib/storage/constants';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321';

/**
 * Devuelve la URL pública HTTPS de una imagen de producto a partir de su
 * storage_path. No requiere SDK ni server context — el bucket `products`
 * es público, así que la URL es construible de manera puramente
 * determinística.
 */
export function getProductImageUrl(storagePath: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${PRODUCTS_BUCKET}/${storagePath}`;
}
