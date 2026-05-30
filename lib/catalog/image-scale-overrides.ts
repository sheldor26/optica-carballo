/**
 * Scale overrides per-image path. Solución pura de código al problema de fotos
 * de producto con tamaños relativos del anteojo distintos en cada JPG.
 *
 * Founder testeó iters 7-13 con scale CSS uniforme — todos fallaron porque
 * cada foto tiene el anteojo de tamaño distinto en pixels (no es uniforme
 * el padding interno entre fotos). La solución es scale per-foto.
 *
 * Convención de valores:
 * - 1.0 = renderizar tal cual la foto
 * - < 1.0 = hacer más chica (evita recortar si la foto tiene anteojo muy grande)
 * - > 1.0 = hacer más grande (para fotos donde el anteojo se ve chico)
 *
 * Estos valores son ajuste fino visual basado en feedback empírico del founder.
 *
 * TODO (cuando haya 5+ productos): migrar a campo `attributes.display_scale`
 * en `product_images` y leer desde DB en `to-product-card-data.ts`. Por ahora
 * hardcoded acá es suficiente.
 */
export const IMAGE_SCALE_OVERRIDES: Record<string, number> = {
  // Vulk Day Light — iter 14 → 14.1 → 14.2 → 14.3 ajustes finos:
  // - Var 1 (carey): 0.92 → 0.85 → 0.75 → 0.65 (iter 14.3: founder dice "var 4 igual a var 1, grandes")
  // - Var 2 (rosa): 1.05 ✓ (PERFECTA)
  // - Var 3 (matte black): 1.20 ✓ (PERFECTA)
  // - Var 4 (brown): 1.05 → 0.85 (iter 14.3: founder confirmó "más grande que 2 y 3, igual a 1")
  // Paths con extensión .jpg (confirmado vía curl al HTML de producción).
  // Founder envió URLs .png pero los seeds + DB usan .jpg.
  //
  // Iter 14.5 — primer feedback empírico REAL (iters previos no se aplicaban).
  // Founder ref: var 4 (brown) a 0.85 es la mejor → target visual.
  // Iter 14.6 — var 2 y 3 = ancla (perfectas a 0.95). Subir var 1 y 4 al target.
  'vulk-day-light-sol/01-lateral.jpg': 0.86, // iter 14.5 0.78 chica → +10%
  'vulk-day-light-sol/02-frontal.jpg': 0.86,
  'vulk-day-light-sol/04-lateral-rosa.jpg': 0.95, // ✓ PERFECTA
  'vulk-day-light-sol/05-frontal-rosa.jpg': 0.95,
  'vulk-day-light-sol/06-mblk-frontal.jpg': 0.95, // ✓ PERFECTA
  'vulk-day-light-sol/07-mblk-lateral.jpg': 0.95,
  'vulk-day-light-sol/09-brown-frontal.jpg': 0.93, // iter 14.5 0.85 chica → +9%
  'vulk-day-light-sol/10-brown-lateral.jpg': 0.93,
};

export function getImageScale(path: string | null | undefined): number {
  if (!path) return 1;
  return IMAGE_SCALE_OVERRIDES[path] ?? 1;
}
