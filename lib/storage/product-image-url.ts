import { PRODUCTS_BUCKET } from '@/lib/storage/constants';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321';

/**
 * Devuelve la URL pública HTTPS de una imagen de producto a partir de su
 * storage_path. No requiere SDK ni server context — el bucket `products`
 * es público, así que la URL es construible de manera puramente
 * determinística.
 *
 * Soporta 2 formatos:
 * 1. Path puro (`vulk-day-light-sol/01.jpg`): asume bucket PRODUCTS_BUCKET.
 * 2. URL completa (`https://.../`): la devuelve tal cual (útil para
 *    imágenes en buckets distintos, ej. brand assets en `brands-shared`).
 */
export function getProductImageUrl(storagePath: string): string {
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath;
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${PRODUCTS_BUCKET}/${storagePath}`;
}
