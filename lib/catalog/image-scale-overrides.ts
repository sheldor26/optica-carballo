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
  // Vulk Day Light — feedback founder iter 13.3:
  // - Var 1 (carey): cortaba patilla sutilmente → bajar a 0.92
  // - Var 2 (rosa): tamaño correcto → 1.05 (boost moderado)
  // - Var 3 (matte black): se veía más chica → 1.20 (boost mayor)
  // - Var 4 (brown): tamaño correcto → 1.05
  'vulk-day-light-sol/01-lateral.png': 0.92,
  'vulk-day-light-sol/04-lateral-rosa.png': 1.05,
  'vulk-day-light-sol/07-mblk-lateral.png': 1.2,
  'vulk-day-light-sol/10-brown-lateral.png': 1.05,
};

export function getImageScale(path: string | null | undefined): number {
  if (!path) return 1;
  return IMAGE_SCALE_OVERRIDES[path] ?? 1;
}
