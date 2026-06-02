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

  // Rusty Vrast — iter 1 (1.4/1.15) cortaba el aviador en P-perfil porque
  // las patillas extendidas + scale agresivo lo saca del frame aspect 3/2.
  // Iter 2 (2026-05-31): bajado a 1.15/1.0 — emparejar con Feeled
  // (1.15/1.05) + Dearly (1.15) sin recortar. Si queda chico subimos a
  // 1.2/1.05 escalonado.
  // Path con espacios y mayúsculas tal como founder los subió al bucket.
  'rusty-vrast/VRAST C1 P-perfil.jpg': 1.15,
  'rusty-vrast/VRAST C1 P-frente.jpg': 1.0,
  'rusty-vrast/VRAST C3 P-perfil.jpg': 1.15,
  'rusty-vrast/VRAST C3 P-frente.jpg': 1.0,
  'rusty-vrast/VRAST C4 P-perfil.jpg': 1.15,
  'rusty-vrast/VRAST C4 P-frente.jpg': 1.0,

  // Rusty Etiquet — sub-regla 15 obligatoria post-carga: scale 1.15
  // default emparejando con Feeled/Dearly/Vrast iter 2. Si tras deploy
  // queda chico vs grid → subir escalonado a 1.2. Si queda grande → 1.0.
  // 8 entries (2 por variante × 4 variantes).
  'rusty-etiquet/ETIQUET BROWN B15 POL p.jpg': 1.15,
  'rusty-etiquet/ETIQUET BROWN B15 POL f.jpg': 1.0,
  'rusty-etiquet/ETIQUET SBLK S10 POL L.jpg': 1.15,
  'rusty-etiquet/ETIQUET SBLK 10 POL F.jpg': 1.0,
  'rusty-etiquet/ETIQUET L.PINK DRT-03 POL. perfil.jpg': 1.15,
  'rusty-etiquet/ETIQUET L.PINK DRT-03 POL f.jpg': 1.0,
  'rusty-etiquet/ETIQUET MBLK-BROWN G.BROWN-P.jpg': 1.15,
  'rusty-etiquet/ETIQUET MBLK-BROWN G.BROWN-F.jpg': 1.0,

  // Rusty Zaedit — sub-regla 15 obligatoria post-carga: scale perfil 1.15 /
  // frente 1.0 emparejando con Etiquet/Vrast (mismo patrón wayfarer/cuadrado
  // G-Flex). NO verificado visualmente aún (founder debe chequear grid tras
  // deploy): si queda chico → subir a 1.2; si recorta → bajar a 1.05/1.0.
  // 6 entries (2 por variante × 3 variantes). Perfil (_p) primario.
  'rusty-zaedit/ZAEDIT_MBLK_S10POL_p.jpg': 1.15,
  'rusty-zaedit/ZAEDIT_MBLK_S10POL_f.jpg': 1.0,
  'rusty-zaedit/ZAEDIT_SBLK_DRT03_p.jpg': 1.15,
  'rusty-zaedit/ZAEDIT_SBLK_DRT03_f.jpg': 1.0,
  'rusty-zaedit/ZAEDIT_MBLK_R_BLUE_POL_p.jpg': 1.15,
  'rusty-zaedit/ZAEDIT_MBLK_R_BLUE_POL_f.jpg': 1.0,

  // Rusty Tulle — sub-regla 15 obligatoria post-carga: scale 1.15
  // default emparejando con Vrast iter 2 (mismo aviador metal). Si tras
  // deploy queda chico vs grid → subir escalonado a 1.2/1.1. Si recorta
  // → bajar a 1.05/1.0. 8 entries (2 por variante × 4 variantes).
  // Naming inconsistente del founder (P_frente vs pol._frente vs
  // pol.-perfil vs pol._perfil) respetado.
  'rusty-tulle/TULLE C1 pol.-perfil.jpg': 1.15,
  'rusty-tulle/TULLE C1 P_frente.jpg': 1.0,
  'rusty-tulle/TULLE C2 pol._perfil.jpg': 1.15,
  'rusty-tulle/TULLE C2 P_frente.jpg': 1.0,
  'rusty-tulle/TULLE C3 pol._perfil.jpg': 1.15,
  'rusty-tulle/TULLE C3 pol._frente.jpg': 1.0,
  'rusty-tulle/TULLE C4 pol._perfil.jpg': 1.15,
  'rusty-tulle/TULLE C4 pol._frente.jpg': 1.0,

  // Rusty Xold — sub-regla 15 obligatoria post-carga: scale 1.15/1.0
  // default emparejando con Dearly/Etiquet (redondos/cuadrados femeninos).
  // 10 entries (2 por variante × 5 variantes).
  'rusty-xold/XOLD SBLK-perfil.jpg': 1.15,
  'rusty-xold/XOLD SBLK-frente.jpg': 1.0,
  'rusty-xold/XOLD 0292-perfil.jpg': 1.15,
  'rusty-xold/XOLD 0292-frente.jpg': 1.0,
  'rusty-xold/XOLD MBLK BG26-perfil.jpg': 1.15,
  'rusty-xold/XOLD MBLK BG26-frente.jpg': 1.0,
  'rusty-xold/XOLD MBLK S10-perfil.jpg': 1.15,
  'rusty-xold/XOLD MBLK S10-frente.jpg': 1.0,
  'rusty-xold/XOLD MBLK PINK-perfil.jpg': 1.15,
  'rusty-xold/XOLD MBLK PINK-frente.jpg': 1.0,

  // Rusty Xold Receta — sub-regla 15 obligatoria post-carga: scale 1.15/1.0
  // default. 8 entries (2 por variante × 4 variantes). Naming inconsistente
  // entre variantes (founder los subió así): MBLK usa underscores +
  // lowercase, otros usan dash + UPPER "PERFIL" (perfil) + lower "frente".
  'rusty-xold-receta/XOLD_BROWN-PERFIL.jpg': 1.15,
  'rusty-xold-receta/XOLD_BROWN-frente.jpg': 1.0,
  'rusty-xold-receta/XOLD_MBLK_OPTICAL_perfil.jpg': 1.15,
  'rusty-xold-receta/XOLD_MBLK_OPTICAL_frente.jpg': 1.0,
  'rusty-xold-receta/XOLD_0292-PERFIL.jpg': 1.15,
  'rusty-xold-receta/XOLD_0292-frente.jpg': 1.0,
  'rusty-xold-receta/XOLD_CRY-PERFIL.jpg': 1.15,
  'rusty-xold-receta/XOLD_CRY-frente.jpg': 1.0,

  // Vulk Booping — naming founder tiene inconsistencias respetado tal cual.
  // Iter 1: 1.15/1.0 default → founder pidió +10-15%.
  // Iter 2: 1.3/1.15 → founder reportó "te pasaste, quedó cortada".
  // Iter 3 (actual): 1.2/1.05 — +4.5%/+5% sobre iter 1, dentro del cap
  // visual (no recorta). Si queda chico vs iter 1, subir a 1.22/1.08.
  'vulk-booping/BOOPING L.PINKS10 POL-perfil.jpg': 1.2,
  'vulk-booping/BOOPING L.PINKS10 POL- frente.jpg': 1.05,
  'vulk-booping/BOOPING MBLKDRT-03 POL-perfil.jpg': 1.2,
  'vulk-booping/BOOPING MBLKDRT-03 POL- frente.jpg': 1.05,
  'vulk-booping/BOOPING MBLKG15 POL-perfil.jpg': 1.2,
  'vulk-booping/BOOPING MBLKG15 POL- frente.jpg': 1.05,
  'vulk-booping/BOOPING BROWNB15 POL-perfil.jpg': 1.2,
  'vulk-booping/BOOPING BROWNB15 POL frente.jpg': 1.05,

  // Vulk Arvin — counter-learning del mistake Booping iter 2: default 1.15/1.0
  // CONSERVADOR. Si queda chico vs grid, subir escalonado a 1.2/1.05.
  // No salto a 1.3 sin evidencia visual (sub-regla 15 + mistake escalado).
  'vulk-arvin/ARVIN MBLK UV05-perfil.jpg': 1.15,
  'vulk-arvin/ARVIN MBLK UV05-frente.jpg': 1.0,
  'vulk-arvin/ARVIN MDBLU REVO-perfil.jpg': 1.15,
  'vulk-arvin/ARVIN MDBLU REVO-frente.jpg': 1.0,
  'vulk-arvin/ARVIN MBLK S10-perfil.jpg': 1.15,
  'vulk-arvin/ARVIN MBLK S10-frente.jpg': 1.0,

  // Rusty Spell — counter-learning aplicado: scale 1.15/1.0 conservador.
  // 10 entries (2 por variante × 5 variantes). Naming inconsistente del
  // founder (underscores en MBLK S10, espacios en otros, sin "perfil" en
  // MBLU 670 lateral) respetado tal cual.
  // SBLK lateral quedó más chica que el resto del grid (founder 2026-05-31) → 1.3.
  'rusty-spell/SPELL SBLK - S10 POL perfil.jpg': 1.3,
  'rusty-spell/SPELL SBLK - S10 POL frente.jpg': 1.0,
  'rusty-spell/SPELL MBLK GBU30-perfil.jpg': 1.15,
  'rusty-spell/SPELL MBLK GBU30-frente.jpg': 1.0,
  'rusty-spell/SPELL_MBLK_-_S10_POL_perfil.jpg': 1.15,
  'rusty-spell/SPELL_MBLK_-_S10_POL_frente.jpg': 1.0,
  'rusty-spell/SPELL-MBLUE 670 - R BLUE.jpg': 1.15,
  'rusty-spell/SPELL-MBLUE 670 - R BLUE frente.jpg': 1.0,
  'rusty-spell/SPELL MBLK G15-perfil.jpg': 1.15,
  'rusty-spell/SPELL MBLK G15 f-frente.jpg': 1.0,

  // Rusty Spell Receta — iter 3: 1.3 se pasó de ancho (founder), bajado a
  // 1.2/1.05. Sweet spot entre 1.15 (chico) y 1.3 (grande).
  'rusty-spell-receta/SPELL_MBLU_670_R_BLUE_perfil.jpg': 1.2,
  'rusty-spell-receta/SPELL_MBLU_670_R_BLUE_frente.jpg': 1.05,
  'rusty-spell-receta/SPELL_MBLK_p.jpg': 1.2,
  'rusty-spell-receta/SPELL_MBLK_f.jpg': 1.05,

  // Rusty Sotion — envolvente deportivo. Iter 2: 1.4/1.15 quedó chico
  // (founder "agrandar") → 1.6/1.3. Las fotos del Sotion tienen el anteojo
  // más chico en el frame que las del Yau. Si recorta, bajar a 1.5/1.25.
  'rusty-sotion/MBLUE-R-GREEN-POL-YELLOW-PERFIL.jpg': 1.6,
  'rusty-sotion/MBLUE-R-GREEN-POL-YELLOW-FRENTE.jpg': 1.3,
  'rusty-sotion/MBLK-R-BLUE-POL-YELLOW-PERFIL.jpg': 1.6,
  'rusty-sotion/MBLK-R-BLUE-POL-YELLOW-FRENTE.jpg': 1.3,
  'rusty-sotion/MBLK-S10-POL-YELLOW-PERFIL.jpg': 1.6,
  'rusty-sotion/MBLK-S10-POL-YELLOW-FRENTE.jpg': 1.3,

  // Vulk Disarn — cuadrado de calce pequeño. Counter-learning aplicado:
  // default 1.15/1.0 CONSERVADOR (sub-regla 15 + mistake Booping iter 2).
  // Si tras deploy queda chico vs grid → subir escalonado a 1.2/1.05.
  // 4 entries (2 por variante × 2 variantes). medidas.jpg queda en 1.0.
  'vulk-disarn/DISARN SBLK-MDEMI G15 POL-perfil.jpg': 1.15,
  'vulk-disarn/DISARN SBLK-MDEMI G15 POL-frente.jpg': 1.0,
  'vulk-disarn/DISARN STEELBLUE-MBLK DRT03 POL-perfil.jpg': 1.15,
  'vulk-disarn/DISARN STEELBLUE-MBLK DRT03 POL-frente.jpg': 1.0,

  // Vulk 53&3 Marky Ramone — sub-regla 15: perfil 1.15 / frente 1.0 (aviador
  // metal, como Tulle/Vrast). NO verificado visualmente — founder debe chequear
  // el grid tras subir fotos. Si queda chico → subir 1.2; si recorta → 1.05/1.0.
  // 10 entries (2 por variante × 5). medidas.jpg y estuche-ramones.jpg sin scale.
  'vulk-53-3/53-3 S-G15 POL- PERFIL.jpg': 1.15,
  'vulk-53-3/53-3 S-G15 POL- FRENTE.jpg': 1.0,
  'vulk-53-3/53-3 LG02 POL- PERFIL.jpg': 1.15,
  'vulk-53-3/53-3 LG02 POL- FRENTE.jpg': 1.0,
  'vulk-53-3/53-3 MG20 POL - PERFIL.jpg': 1.15,
  'vulk-53-3/53-3 MG20 POL - FRENTE.jpg': 1.0,
  'vulk-53-3/53-3 S-25POL- PERFIL.jpg': 1.15,
  'vulk-53-3/53-3 S-25POL- FRENTE.jpg': 1.0,
  'vulk-53-3/53-3 MBLK 03 POL - PERFIL.jpg': 1.15,
  'vulk-53-3/53-3 MBLK 03 POL - FRENTE.jpg': 1.0,

  // Rusty Bruk — solo fotos de perfil (1 por variante, son las primarias del
  // grid). Scale 1.15 (cuadrado G-Flex, como Etiquet/Zaedit). Sin verificación
  // visual — founder chequea grid. Nombres reales con espacios.
  'rusty-bruk/BRUK MBLK-S10-perfil.jpg': 1.15,
  // Revo Green venía un poco más grande que el resto (founder 2026-06-02) → 1.0.
  'rusty-bruk/bruk-perfil-revo green.jpg': 1.0,
  'rusty-bruk/BRUK SBLK-POL-S10-perfil.jpg': 1.15,
};

export function getImageScale(path: string | null | undefined): number {
  if (!path) return 1;
  return IMAGE_SCALE_OVERRIDES[path] ?? 1;
}
