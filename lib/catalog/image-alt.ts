const CATEGORY_LABELS: Record<string, string> = {
  'anteojos-de-sol': 'anteojos de sol',
  'anteojos-de-receta': 'anteojos de receta',
};

/**
 * Alt descriptivo para fotos de producto (SEO / Google Imágenes). Combina
 * marca + nombre + categoría, de-duplicando si el nombre ya incluye la marca.
 *
 * Ej: `{ name: 'Arvin', brandName: 'Vulk', categorySlug: 'anteojos-de-sol' }`
 *   → `"Vulk Arvin — anteojos de sol"`.
 *
 * Nota de a11y: en los cards el bloque de imagen suele estar `aria-hidden` con
 * el nombre en el `aria-label` del link, así que este alt es solo para Google
 * (el lector de pantalla lo ignora). No reemplaza ese patrón.
 */
export function buildProductImageAlt(opts: {
  name: string;
  brandName?: string | null;
  categorySlug?: string | null;
}): string {
  const name = opts.name.trim();
  const brand = opts.brandName?.trim();
  const full =
    brand && !name.toLowerCase().startsWith(brand.toLowerCase())
      ? `${brand} ${name}`
      : name;
  const cat = opts.categorySlug ? CATEGORY_LABELS[opts.categorySlug] : null;
  return cat ? `${full} — ${cat}` : full;
}
