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
  // Encodeamos por segmento (no la ruta entera) para preservar las "/" como
  // separadores. Necesario porque algunos storage_path tienen caracteres con
  // significado especial en URLs — ej. "vulk-ready?-receta/Ready?-CRY-PERFIL.jpg":
  // el "?" sin encodear se interpreta como inicio de query string y corta el path.
  const encodedPath = storagePath.split('/').map(encodeURIComponent).join('/');
  return `${SUPABASE_URL}/storage/v1/object/public/${PRODUCTS_BUCKET}/${encodedPath}`;
}
