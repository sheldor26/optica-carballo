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
  // Vulk Day Light — iter 14 → 14.1 → 14.2 ajustes finos basados en feedback:
  // - Var 1 (carey): 0.92 → 0.85 → 0.75 (iter 14.2: cambio 14.1 fue muy sutil, founder no notó diff)
  // - Var 2 (rosa): 1.05 ✓ (PERFECTA según founder iter 14.1)
  // - Var 3 (matte black): 1.20 ✓ (PERFECTA según founder iter 14.1)
  // - Var 4 (brown): 1.05 (founder iter 14.2: "está rara, no igual a las 2 y 3" — pendiente dato)
  'vulk-day-light-sol/01-lateral.png': 0.75,
  'vulk-day-light-sol/04-lateral-rosa.png': 1.05,
  'vulk-day-light-sol/07-mblk-lateral.png': 1.2,
  'vulk-day-light-sol/10-brown-lateral.png': 1.05,
};

export function getImageScale(path: string | null | undefined): number {
  if (!path) return 1;
  return IMAGE_SCALE_OVERRIDES[path] ?? 1;
}
