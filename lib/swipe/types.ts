/**
 * Types para "Tinder de monturas" (Opción Y) — interfaz swipe de descubrimiento
 * sobre el catálogo completo.
 */

export type SwipeProduct = {
  slug: string;
  brandSlug: string;
  brandName: string;
  categorySlug: string;
  name: string;
  shortDescription: string | null;
  minPriceCents: number | null;
  primaryImagePath: string | null;
  primaryImageScale: number;
  href: string;
};

export type SwipeDirection = 'left' | 'right';

/** localStorage key — versionada por si cambiamos schema de matches. */
export const SWIPE_MATCHES_STORAGE_KEY = 'optica-swipe-matches-v1';

export type StoredMatches = {
  /** Array de slugs de productos a los que el usuario dio "👍". */
  liked: string[];
  /** Cuándo se guardó (Date.now()), para expirar si pasa mucho tiempo. */
  savedAt: number;
};
