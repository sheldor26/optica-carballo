/**
 * Constantes de buckets de Storage. Tienen que coincidir con sus
 * migraciones correspondientes.
 */

// ============================================================================
// Bucket `prescriptions` (privado, datos sensibles de salud)
// Migración: 20260528125415_prescriptions_storage.sql
// ============================================================================
export const PRESCRIPTIONS_BUCKET = 'prescriptions';

export const PRESCRIPTIONS_MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export const PRESCRIPTIONS_ALLOWED_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
] as const;

export type PrescriptionMime = (typeof PRESCRIPTIONS_ALLOWED_MIME)[number];

export const PRESCRIPTIONS_SIGNED_URL_TTL_SECONDS = 60 * 5; // 5 minutos

/** Mapa de mime a extensión canónica (sin punto). */
export const PRESCRIPTIONS_MIME_TO_EXT: Record<PrescriptionMime, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

// ============================================================================
// Bucket `products` (público, imágenes del catálogo)
// Migración: 20260528142242_products_storage.sql
// ============================================================================
export const PRODUCTS_BUCKET = 'products';

export const PRODUCTS_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export const PRODUCTS_ALLOWED_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
] as const;

export type ProductImageMime = (typeof PRODUCTS_ALLOWED_MIME)[number];

export const PRODUCTS_MIME_TO_EXT: Record<ProductImageMime, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};
