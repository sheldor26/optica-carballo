const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321';

const BRAND_ASSETS_BUCKET = 'brand-assets';

/**
 * URL pública de un asset del bucket `brand-assets` (logos de marca, etc).
 * Bucket separado de `products` para mantener semántica clara:
 * - `products/` → fotos de productos reales (variant-specific, medidas)
 * - `brand-assets/` → logos de marca, banners, otros assets corporativos
 *
 * Como `getProductImageUrl`, asume bucket público (URL determinística sin SDK).
 */
export function getBrandAssetUrl(storagePath: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BRAND_ASSETS_BUCKET}/${storagePath}`;
}

/**
 * Devuelve si el logo necesita invertirse (CSS `filter: invert(1) brightness(0)`)
 * para verse bien en el contexto. Asume convención de naming:
 * - `*-light.*` → logo claro (blanco/light), pensado para fondos oscuros
 * - `*-dark.*` → logo oscuro (negro/dark), pensado para fondos claros
 *
 * Reglas:
 * - light logo sobre fondo claro → invertir (no se ve sino)
 * - dark logo sobre fondo oscuro → invertir (no se ve sino)
 * - logo y contexto matchean → no invertir (correcto)
 *
 * Esto SOLO funciona para logos monocromáticos. Si el logo tiene color
 * (ej: rojo de Coca-Cola), invert lo rompe. Hasta hoy nuestros logos son
 * SVG monocromáticos, así que es seguro.
 */
export function shouldInvertLogo(
  storagePath: string | null,
  context: 'dark-bg' | 'light-bg',
): boolean {
  if (!storagePath) return false;
  const isLight = /-light\./i.test(storagePath);
  const isDark = /-dark\./i.test(storagePath);
  if (context === 'dark-bg' && isDark) return true;
  if (context === 'light-bg' && isLight) return true;
  return false;
}
