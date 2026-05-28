import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  PRODUCTS_ALLOWED_MIME,
  PRODUCTS_BUCKET,
  PRODUCTS_MAX_BYTES,
  PRODUCTS_MIME_TO_EXT,
  type ProductImageMime,
} from '@/lib/storage/constants';

function isAllowedMime(mime: string): mime is ProductImageMime {
  return (PRODUCTS_ALLOWED_MIME as readonly string[]).includes(mime);
}

/**
 * Construye el path canónico de una imagen de producto.
 *   <brand_slug>/<product_slug>/<filename>
 *
 * `filename` típico: `<variant_sku>.<ext>` o `<seq>.<ext>` (1.webp, 2.webp).
 * Limpia caracteres raros en slugs por seguridad (defensa-en-profundidad
 * aunque slugs ya están normalizados al guardarse).
 */
function buildPath(args: {
  brandSlug: string;
  productSlug: string;
  filename: string;
}): string {
  const safe = (s: string) =>
    s.replace(/[^a-z0-9_\-./]/gi, '').slice(0, 80);
  return `${safe(args.brandSlug)}/${safe(args.productSlug)}/${safe(args.filename)}`;
}

export type UploadProductImageResult =
  | { ok: true; path: string; publicUrl: string }
  | { ok: false; error: string };

/**
 * Sube una imagen al bucket `products` (público). Valida mime + size antes
 * de tocar Storage. Usa service_role (bypassa RLS) — solo desde server
 * actions / scripts admin del founder.
 *
 * Reemplaza si ya existe (`upsert: true`).
 *
 * Devuelve `path` (para guardar en `product_images.url` como path relativo
 * al bucket) y `publicUrl` (URL HTTPS absoluta para mostrar en next/image).
 */
export async function uploadProductImage(args: {
  brandSlug: string;
  productSlug: string;
  filename: string;
  file: Blob;
  mime: string;
}): Promise<UploadProductImageResult> {
  if (!isAllowedMime(args.mime)) {
    return {
      ok: false,
      error: `Formato no permitido. Aceptamos: ${PRODUCTS_ALLOWED_MIME.join(', ')}.`,
    };
  }
  if (args.file.size === 0) {
    return { ok: false, error: 'El archivo está vacío.' };
  }
  if (args.file.size > PRODUCTS_MAX_BYTES) {
    const mb = (PRODUCTS_MAX_BYTES / 1024 / 1024).toFixed(0);
    return { ok: false, error: `El archivo supera el máximo de ${mb} MB.` };
  }

  const path = buildPath(args);
  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(PRODUCTS_BUCKET)
    .upload(path, args.file, {
      contentType: args.mime,
      upsert: true,
      cacheControl: '31536000, immutable', // 1 año (next/image agrega query param para bust si cambia)
    });

  if (error) return { ok: false, error: error.message };

  const { data } = supabase.storage.from(PRODUCTS_BUCKET).getPublicUrl(path);
  return { ok: true, path, publicUrl: data.publicUrl };
}

/**
 * Devuelve la URL pública HTTPS de una imagen ya subida. No requiere
 * service_role — `getPublicUrl` solo arma la URL canónica del bucket
 * público (no consulta Storage).
 */
export function getProductImagePublicUrl(path: string): string {
  const supabase = createAdminClient();
  const { data } = supabase.storage.from(PRODUCTS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Elimina una imagen del bucket. Idempotente — no falla si no existe.
 * Útil para reemplazos o limpieza al borrar productos.
 */
export async function deleteProductImage(path: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase.storage.from(PRODUCTS_BUCKET).remove([path]);
}

/**
 * Sugiere un filename canónico para una imagen de variante.
 *   <variant_sku>.<ext>  → ej "RST-WAY-NEGRO-001.webp"
 * Si no hay SKU (imagen del producto base), usa el `seq`.
 */
export function suggestFilename(args: {
  sku?: string | null;
  seq?: number;
  mime: ProductImageMime;
}): string {
  const ext = PRODUCTS_MIME_TO_EXT[args.mime];
  if (args.sku) return `${args.sku.toLowerCase()}.${ext}`;
  return `${args.seq ?? 1}.${ext}`;
}
