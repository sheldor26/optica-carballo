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

  // Vulk Yamain — fotos en formato distinto al Day Light:
  //   Yamain: 900x442 (aspect 2.04:1) — anteojo bbox ~82% W × 75% H del frame
  //   Day Light: 2000x1333 (aspect 3:2) — anteojo bbox ~99% W × 57% H
  // En cards aspect-[3/2], las fotos Yamain (más anchas) dejan barras
  // verticales arriba/abajo via object-contain → anteojo se ve más chico
  // visualmente que las del Day Light. Scale 1.15 uniforme compensa.
  // Las 6 fotos son consistentes entre sí (todas 900x442, ratio similar)
  // → una sola scale funciona para las 6 (3 variantes × 2 fotos c/u).
  'vulk-yamain-sol/01-cry-lateral.jpg': 1.15,
  'vulk-yamain-sol/02-cry-frontal.jpg': 1.15,
  'vulk-yamain-sol/03-mblk-lateral.jpg': 1.15,
  'vulk-yamain-sol/04-mblk-frontal.jpg': 1.15,
  'vulk-yamain-sol/05-sblk-lateral.jpg': 1.15,
  'vulk-yamain-sol/06-sblk-frontal.jpg': 1.15,

  // Rusty Yau — fotos 848x537 (aspect 1.58:1, cerca de 3:2). El anteojo
  // ocupa poco del frame natural (laterales 52% W, frontales 70% W).
  // Historia de iters:
  //   Iter 1: 1.5/1.2 → founder dijo "chico vs Vulk".
  //   Iter 2: 1.8/1.4 → founder dijo en cross-catálogo (2026-05-31)
  //     "muy desproporcionada vs Vulk Day Light y Rusty Feeled" — Yau
  //     gigante en comparación.
  //   Iter 3 (actual): 1.4/1.15 → emparejar con Rusty Feeled (1.15/1.05)
  //     y Rusty Dearly (1.15 uniforme) — target visual común para grids
  //     mezclados (/anteojos-de-sol/hombre, /anteojos-de-sol/mujer, etc).
  // Aplica a las 3 variantes del Rusty Yau (S10/POL, Revo Blue, Revo Green).
  'rusty-yau/01-lateral.jpg': 1.4,
  'rusty-yau/02-frontal.jpg': 1.15,
  'rusty-yau/04-revo-blue-lateral.jpg': 1.4,
  'rusty-yau/05-revo-blue-frontal.jpg': 1.15,
  'rusty-yau/06-revo-green-lateral.jpg': 1.4,
  'rusty-yau/07-revo-green-frontal.jpg': 1.15,

  // Rusty Feeled — founder reportó inconsistencia visual en grid 2026-05-31:
  // anteojo se ve chico vs Rusty Yau (que tiene overrides 1.8 / 1.4). Aplico
  // scales empíricos.
  // Iter 1: 1.5/1.4 → founder reportó "mal cortado" (la foto del Feeled
  // ocupa más del frame natural que el Yau, scale agresivo recorta cabeza
  // del anteojo). Bajado a 1.15/1.05 — la foto del Feeled tiene anteojo
  // grande de origen, no necesita tanto scale.
  //   - 01-lateral.jpg: 1.15 (vista 3/4)
  //   - 02-frontal.jpg: 1.05 (vista frontal, ya casi llena el frame)
  'rusty-feeled/01-lateral.jpg': 1.15,
  'rusty-feeled/02-frontal.jpg': 1.05,

  // Rusty Dearly — founder reportó en grid de marca rusty (2026-05-31):
  // "Agrandar un poco mas la imagen del dearly para que quede parecida al
  // YAU y Feeled - es un poco mas... sera un 15% o algo asi". El Dearly se
  // veía visiblemente más chico que sus hermanos Rusty. Aplico 1.15 uniforme
  // a las 6 fotos de variante (3 variantes × 2 vistas). El esquema técnico
  // medidas.jpg queda en 1.0 (no aparece en grid).
  'rusty-dearly/01-0292-lateral.jpg': 1.15,
  'rusty-dearly/01-0292-frontal.jpg': 1.15,
  'rusty-dearly/02-brown-lateral.jpg': 1.15,
  'rusty-dearly/02-brown-frontal.jpg': 1.15,
  'rusty-dearly/03-sblk-lateral.jpg': 1.15,
  'rusty-dearly/03-sblk-frontal.jpg': 1.15,

  // Rusty Vrast — founder reportó 2026-05-31 al ver /marcas/rusty con los
  // 4 modelos Rusty: "agrandar la imagen del vrast que quedo mas chica".
  // Target visual: emparejar con Feeled (1.15/1.05) + Dearly (1.15). El
  // aviador grande del Vrast tiene patillas extendidas en P-perfil (lateral
  // 3/4) → el bbox del lente queda visualmente más chico que en un wrap-
  // around o un cuadrado. Necesita más scale en lateral que en frontal.
  // Iter 1: 1.4 lateral / 1.15 frontal (similar Rusty Yau post-iter 3).
  // Path con espacios y mayúsculas tal como founder los subió al bucket.
  'rusty-vrast/VRAST C1 P-perfil.jpg': 1.4,
  'rusty-vrast/VRAST C1 P-frente.jpg': 1.15,
  'rusty-vrast/VRAST C3 P-perfil.jpg': 1.4,
  'rusty-vrast/VRAST C3 P-frente.jpg': 1.15,
  'rusty-vrast/VRAST C4 P-perfil.jpg': 1.4,
  'rusty-vrast/VRAST C4 P-frente.jpg': 1.15,
};

export function getImageScale(path: string | null | undefined): number {
  if (!path) return 1;
  return IMAGE_SCALE_OVERRIDES[path] ?? 1;
}
