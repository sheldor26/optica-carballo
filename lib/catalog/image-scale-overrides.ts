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
  'vulk-53-3/53-3 LG02 POL- PERFIL.jpg': 1.12,
  'vulk-53-3/53-3 LG02 POL- FRENTE.jpg': 1.0,
  'vulk-53-3/53-3 MG20 POL - PERFIL.jpg': 1.10,
  'vulk-53-3/53-3 MG20 POL - FRENTE.jpg': 1.0,
  'vulk-53-3/53-3 S-25POL- PERFIL.jpg': 1.15,
  'vulk-53-3/53-3 S-25POL- FRENTE.jpg': 1.0,
  'vulk-53-3/53-3 MBLK 03 POL - PERFIL.jpg': 1.12,
  'vulk-53-3/53-3 MBLK 03 POL - FRENTE.jpg': 1.0,

  // Rusty Bruk — solo fotos de perfil (1 por variante, son las primarias del
  // grid). Scale 1.15 (cuadrado G-Flex, como Etiquet/Zaedit). Sin verificación
  // visual — founder chequea grid. Nombres reales con espacios.
  'rusty-bruk/BRUK MBLK-S10-perfil.jpg': 1.15,
  // Revo Green venía un poco más grande que el resto (founder 2026-06-02) → 1.0.
  'rusty-bruk/bruk-perfil-revo green.jpg': 1.0,
  'rusty-bruk/BRUK SBLK-POL-S10-perfil.jpg': 1.15,

  // Vulk Biller — hexagonal. Perfil 1.15 / frente-lateral 1.0. Nombres reales
  // del founder (casing/espacios inconsistentes, AQ31 en webp). Sin verificación
  // visual — founder chequea grid.
  'vulk-biller/BILLER AQ31 PERFIL.webp': 1.15,
  'vulk-biller/BILLER AQ31 FRENTE.webp': 1.0,
  'vulk-biller/Biller MBLK 046 S10 perfil.jpg': 1.15,
  'vulk-biller/Biller MBLK 046  S10 Frontal.jpg': 1.0,
  'vulk-biller/BILLER 669k 068 PERFIL.jpg': 1.15,
  'vulk-biller/BILLER 669k 068 FRONTAL.jpg': 1.0,
  'vulk-biller/Biller SBLK 206 118 perfil.jpg': 1.15,
  'vulk-biller/Biller SBLK 206 118  Lateral.jpg': 1.0,
  'vulk-biller/Biller SBLK 068 902 perfil.jpg': 1.15,

  // Rusty Dapper — sub-regla 15 post-carga: perfil 1.15 / frente 1.0 (mismo
  // estilo de foto studio que Zaedit/Bruk, misma marca). Pendiente verificación
  // visual del founder en el grid.
  'rusty-dapper/DAPPER_SBH_6208_p.jpg': 1.15,
  'rusty-dapper/DAPPER_SBH_6208_f.jpg': 1.0,
  'rusty-dapper/DAPPER_SBLK_S10POL_p.jpg': 1.15,
  'rusty-dapper/DAPPER_SBLK_S10POL_f.jpg': 1.0,
  'rusty-dapper/DAPPER_GREY_UVS17_p.jpg': 1.15,
  'rusty-dapper/DAPPER_GREY_UVS17_f.jpg': 1.0,
  'rusty-dapper/DAPPER_ORANGE_118_p.jpg': 1.15,
  'rusty-dapper/DAPPER_ORANGE_118_f.jpg': 1.0,

  // Vulk Reporter — sub-regla 15 post-carga: perfil 1.15 / frente 1.0 (foto
  // studio estilo Zaedit/Dapper). Pendiente verificación visual del founder.
  'vulk-reporter/REPORTER MBLK G GREEN PERFIL.jpg': 1.15,
  'vulk-reporter/REPORTER MBLK G GREEN FRONTAL.jpg': 1.0,
  'vulk-reporter/Reporter MBLK S10 Pol Perfil.jpg': 1.15,
  'vulk-reporter/Reporter MBLK S10 Pol frente.jpg': 1.0,
  'vulk-reporter/REPORTER L GREY DRT03 POL PERFIL.jpg': 1.15,
  'vulk-reporter/REPORTER L GREY DRT03 POL FRONTAL.jpg': 1.0,

  // Rusty Beason — cat eye femenino. Perfil 1.15 / frente 1.0 (default studio).
  // Las fotos son "GALERIA-WEB" → pendiente verificación visual del founder.
  'rusty-beason/BEASON GALERIA-WEB-LPINK-GGREY PERFIL.jpg': 1.15,
  'rusty-beason/BEASON AGALERIA-WEB-LPINK-GGREY FRENTE.jpg': 1.0,
  'rusty-beason/BEASON GALERIA-WEB-SBLK-G15 perfil.jpg': 1.15,
  'rusty-beason/BEASON AGALERIA-WEB-SBLK-G15 frente.jpg': 1.0,
  'rusty-beason/BEASON GALERIA-WEB-SBLK-G15.jpg': 1.0,
  'rusty-beason/BEASON SBLKGS9B-perfil.jpg': 1.15,
  'rusty-beason/BEASON SBLKGS9B-frente.jpg': 1.0,
  'rusty-beason/BEASON GALERIA-WEB-SPINK-GBROWN PERFIL.jpg': 1.15,
  'rusty-beason/BEASON AGALERIA-WEB-SPINK-GBROWN FRENTE.jpg': 1.0,

  // Rusty Vorez — cuadrado femenino. Perfil 1.15 / frente 1.0 (foto GALERIA-WEB
  // estilo Beason). Pendiente verificación visual del founder.
  'rusty-vorez/VOREZ GALERIA-WEB-MROSE-HGB1 Perfil.jpg': 1.15,
  'rusty-vorez/VOREZ AGALERIA-WEB-MROSE-HGB1 frente.jpg': 1.0,
  'rusty-vorez/VOREZ GALERIA-WEB-SBLK-S10-POL perfil.jpg': 1.15,
  'rusty-vorez/VOREZ AGALERIA-WEB-SBLK-S10-POL frente.jpg': 1.0,

  // Rusty Eslav — deportivo envolvente. Founder 2026-06-02: perfil 1.65 (quedó
  // perfecto); frente bajado -0.2 → 1.3 (estaba muy grande). Ambas variantes.
  'rusty-eslav/MBLK-S10-YELLOW---PERFIL.jpg': 1.65,
  'rusty-eslav/MBLK-S10-YELLOW---FRENTE.jpg': 1.3,
  'rusty-eslav/MBLUE-R-GREEN-POL-YELLOW-PERFIL.jpg': 1.65,
  'rusty-eslav/MBLUE-R-GREEN-POL-YELLOW-FRENTE.jpg': 1.3,

  // Rusty Misty — redondo talle chico. Perfil 1.15 / frente 1.0 (default studio).
  // Pendiente verificación visual del founder (armazón pequeño).
  'rusty-misty/MISTY_L.ROSEGS9B-pefil.jpg': 1.15,
  'rusty-misty/MISTY_L.ROSEGS9B-frente.jpg': 1.0,
  'rusty-misty/MISTY_BROWN_UB18_POL-p.jpg': 1.15,
  'rusty-misty/MISTY_BROWN_UB18_POL_f.jpg': 1.0,
  'rusty-misty/MISTY_MBLK_S10_Pol_P.jpg': 1.15,
  'rusty-misty/MISTY_MBLK_S10_Pol_f.jpg': 1.0,

  // Rusty Misty Receta — armazón óptico redondo talle chico. Perfil 1.15 /
  // frente 1.0 (default). Pendiente verificación visual del founder.
  'rusty-misty-receta/MISTY_MBLK_perfil.jpg': 1.15,
  'rusty-misty-receta/MISTY_MBLK_frente.jpg': 1.0,
  'rusty-misty-receta/MISTY_373_perfil.jpg': 1.15,
  'rusty-misty-receta/MISTY_373_frente.jpg': 1.0,
  'rusty-misty-receta/MISTY_0292_perfil.jpg': 1.15,
  'rusty-misty-receta/MISTY_0292_frente.jpg': 1.0,

  // Rusty R-CY 02 receta (rectangular eco). Baseline receta 1.15/1.0; pendiente
  // verificación visual del founder. SBLK reusa fotos de MBLK (copia en bucket).
  'rusty-r-cy-02/R-CY 02 MBLK P GALERIA.jpg': 1.15,
  'rusty-r-cy-02/R-CY 02 MBLK F GALERIA.jpg': 1.0,
  'rusty-r-cy-02/R-CY 02 SBLK P GALERIA.jpg': 1.15,
  'rusty-r-cy-02/R-CY 02 SBLK F GALERIA.jpg': 1.0,
  'rusty-r-cy-02/R-CY 02 STEEL BLUE P GALERIA.jpg': 1.15,
  'rusty-r-cy-02/R-CY 02 STEEL BLUE F GALERIA.jpg': 1.0,
  'rusty-r-cy-02/R-CY 02 SBLUE P GALERIA.jpg': 1.15,
  'rusty-r-cy-02/R-CY 02 SBLUE F GALERIA.jpg': 1.0,
  'rusty-r-cy-02/R-CY 02 L GREY  P GALERIA.jpg': 1.15,
  'rusty-r-cy-02/R-CY 02 L GREY  F GALERIA.jpg': 1.0,

  // Rusty Opposit receta (wayfarer femenino). 1.17/1.02 — founder pidió +0.02 sobre
  // el baseline receta 1.15/1.0 (R-CY 02 quedó bien en 1.15/1.0).
  'rusty-opposit/OPPOSIT_MDEMI-068_P.jpg': 1.17,
  'rusty-opposit/OPPOSIT_MDEMI-068_F.jpg': 1.02,
  'rusty-opposit/OPPOSIT_SBLK-068_-_PERFIL.jpg': 1.17,
  'rusty-opposit/OPPOSIT_SBLK-068_-_FRENTE.jpg': 1.02,
  'rusty-opposit/OPPOSIT 385-202 - PERFIL.jpg': 1.17,
  'rusty-opposit/OPPOSIT 385-202 - FRENTE.jpg': 1.02,

  // Rusty Gresent — aviador doble puente. Founder 2026-06-02: perfil (lateral)
  // 1.20 (iteración: 1.35 mucho → 1.25 todavía grande → -0.05 → 1.20); frente 1.0.
  'rusty-gresent/GRESENT_SDEMI_GG47_-_p.jpg': 1.2,
  'rusty-gresent/GRESENT_SDEMI_GG47_-_F.jpg': 1.0,
  'rusty-gresent/GRESENT_sbh_gs9_-_p.jpg': 1.2,
  'rusty-gresent/GRESENT_sbh_gs9_-_f.jpg': 1.0,
  'rusty-gresent/GRESENT_MBLK_GS16_-_p.jpg': 1.2,
  'rusty-gresent/GRESENT_MBLK_GS16_-_F.jpg': 1.0,
  'rusty-gresent/GRESENT_SBLK_3237_-_P.jpg': 1.2,
  'rusty-gresent/GRESENT_SBLK_3237_-_F.jpg': 1.0,

  // Vulk Way Back — wayfarer. Perfil 1.15 / frente 1.0 (default). Nombres con
  // formatos inconsistentes (SBLK sin "galeria"). Pendiente verificación founder.
  'vulk-way-back/WAY BACK-SBLK-S10-PERFIL.jpg': 1.15,
  'vulk-way-back/WAYBACK-SBLK-S10 F.jpg': 1.0,
  'vulk-way-back/WAY BACK MDBLU-REVO BLUE p galeria.jpg': 1.15,
  'vulk-way-back/WAY BACK MDBLU-REVO BLUE f galeria.jpg': 1.0,
  'vulk-way-back/Way back- green pearl g.grey p galeria.jpg': 1.15,
  'vulk-way-back/Way back- green pearl g.grey f galeria.jpg': 1.0,
  'vulk-way-back/WAY BACK MBLK S10 POL P galeria.jpg': 1.15,
  'vulk-way-back/WAY BACK MBLK S10 POL. F galeria.jpg': 1.0,

  // Vulk Deserve — cuadrado grande G-Flex. Perfil 1.15 / frente 1.0 (default,
  // mismo patrón que Reporter/Vorez). ⚠️ baseline SIN verificación visual: las
  // fotos no estaban en el bucket al cargar (sub-regla 15: comparar contra el
  // grid cuando el founder las suba; si queda chico → 1.2, si recorta → 1.05/1.0).
  'vulk-deserve/DESERVE-MBLK S10 POL- P.jpg': 1.15,
  'vulk-deserve/DESERVE-MBLK S10 POL- f.jpg': 1.0,
  'vulk-deserve/DESERVE-SBLK-GDARK-GREY p.jpg': 1.15,
  'vulk-deserve/DESERVE-SBLK-GDARK-GREY f.jpg': 1.0,
  'vulk-deserve/DESERVE-MBLK-G3262-EMERALD p.jpg': 1.15,
  'vulk-deserve/DESERVE-MBLK-G3262-EMERALD f.jpg': 1.0,

  // Vulk Katleen — cuadrado femenino G-Flex ultra liviano. Perfil 1.15 / frente
  // 1.0 (default, mismo patrón que Beason/Vorez femeninos). Pendiente chequeo
  // visual del founder. Naming inconsistente del founder respetado.
  'vulk-katleen/KATLEEN SDEMI-SBLK GB27 -Perfil.jpg': 1.15,
  'vulk-katleen/KATLEEN SDEMI-SBLK GB27 - F.jpg': 1.0,
  'vulk-katleen/katleen mblk s10 pol p.jpg': 1.15,
  'vulk-katleen/katleen mblk s10 pol f.jpg': 1.0,
  'vulk-katleen/KATLEEN MBLK C8B15_perfil.jpg': 1.15,
  'vulk-katleen/KATLEEN MBLK C8B15_frente.jpg': 1.0,
  'vulk-katleen/KATLEEN MSIENNA HGG1 p.jpg': 1.15,
  'vulk-katleen/KATLEEN MSIENNA HGG1 f.jpg': 1.0,

  // Vulk Katleen Receta — armazón óptico cuadrado femenino. Perfil 1.15 / frente
  // 1.0 (default, mismo patrón que Misty/Xold receta). Pendiente chequeo visual.
  // Naming inconsistente respetado (M0292 con DOBLE espacio antes de "perfil").
  'vulk-katleen-receta/KATLEEN-MBLK perfil.jpg': 1.15,
  'vulk-katleen-receta/KATLEEN-MBLK frente.jpg': 1.0,
  'vulk-katleen-receta/KATLEEN M0292  perfil.jpg': 1.15,
  'vulk-katleen-receta/KATLEEN M0292 - Frente.jpg': 1.0,
  'vulk-katleen-receta/KATLEEN-0292 perfil.jpg': 1.15,
  'vulk-katleen-receta/KATLEEN-0292 FRENTE.jpg': 1.0,

  // Rusty CCCP — envolvente deportivo (wraparound), como Eslav/Sotion. Las fotos
  // de envolvente suelen dejar el anteojo chico en el frame → arranco en 1.15/1.0
  // CONSERVADOR (no salto a 1.6 sin evidencia, counter-learning Sotion/Booping).
  // Pendiente chequeo visual del founder: si queda chico vs grid, subir escalonado.
  'rusty-cccp/CCCP SBLK-S10 POL perfil.jpg': 1.15,
  'rusty-cccp/CCCP SBLK-S10 POL frente.jpg': 1.0,
  'rusty-cccp/CCCP MBLK S10 perfil.jpg': 1.15,
  'rusty-cccp/CCCP MBLK S10 frente.jpg': 1.0,
  // Copias AR (mismo armazón, founder pidió reusar la foto del color de frente).
  'rusty-cccp/CCCP MBLK S10 AR perfil.jpg': 1.15,
  'rusty-cccp/CCCP MBLK S10 AR frente.jpg': 1.0,
  'rusty-cccp/CCCP SBLK-S10 AR perfil.jpg': 1.15,
  'rusty-cccp/CCCP SBLK-S10 AR frente.jpg': 1.0,

  // Rusty Dileri — cuadrado femenino liviano. Founder 2026-06-04: iter 1 perfil
  // 1.15→1.20 / frente 1.0→1.05; iter 2 "+0.05 más" → perfil 1.25 / frente 1.10.
  // Founder 2026-06-05: "-0.1 en todos los grids" → iter 3 perfil 1.15 / frente 1.0.
  // Ambas variantes.
  'rusty-dileri/DILERI_SBLK_S10_POl_p.jpg': 1.15,
  'rusty-dileri/DILERI_SBLK_S10_POL_f.jpg': 1.0,
  'rusty-dileri/DILERI_SIENNA_G._GREEN-perfil.jpg': 1.15,
  'rusty-dileri/DILERI_SIENNA_G._GREEN-frente.jpg': 1.0,

  // Vulk Lady Piny — redondo femenino G-Flex + acetato. Perfil 1.15 / frente 1.0
  // (default femenino como Beason/Vorez/Katleen). Pendiente chequeo visual.
  // Casing del founder: 285 usa "Frente" mayúscula, el resto "frente".
  'vulk-lady-piny/285-UFC0096 GB10S perfil.jpg': 1.15,
  'vulk-lady-piny/285-UFC0096 GB10S Frente.jpg': 1.0,
  'vulk-lady-piny/292-UFQ0028 GS9B perfil.jpg': 1.15,
  'vulk-lady-piny/292-UFQ0028 GS9B frente.jpg': 1.0,
  'vulk-lady-piny/SBLK-UFQ0003 SG16 perfil.jpg': 1.15,
  'vulk-lady-piny/SBLK-UFQ0003 SG16 frente.jpg': 1.0,
  'vulk-lady-piny/SBLK-UQ0178 BG26 pol perfil.jpg': 1.15,
  'vulk-lady-piny/SBLK-UQ0178 BG26 pol frente.jpg': 1.0,

  // Vulk Clems Receta — armazón ovalado ultra liviano. MBLK queda 1.15/1.0; founder
  // 2026-06-05 reportó que CRY y SBLK se veían más chicas (sus fotos tienen el
  // anteojo más chico en el frame) → CRY/SBLK perfil 1.25 / frente 1.10 para emparejar.
  // Casing: CRY/SBLK en .jpg, MBLK en .webp.
  // founder 2026-06-11: -0.005 milimétrico → luego -0.05 (paso visible) a las 6.
  // Nota: la foto PRIMARIA del card del Clems es la MBLK (no CRY/SBLK) → para que
  // cambie lo que se ve en la grilla hay que mover la MBLK también.
  'vulk-clems/CLEMS CRY P.jpg': 1.195,
  'vulk-clems/CLEMS CRY F.jpg': 1.045,
  'vulk-clems/CLEMS MBLK P.webp': 1.095,
  'vulk-clems/CLEMS MBLK F.webp': 0.945,
  'vulk-clems/CLEMS SBLK P.jpg': 1.195,
  'vulk-clems/CLEMS SBLK F.jpg': 1.045,

  // Rusty Esvep — envolvente deportivo. Foto MUY ancha (1000×491, 2:1) con el anteojo
  // chico en el frame → necesita más scale que Sotion/Eslav (1.6) aunque sea el mismo
  // tipo. Founder 2026-06-05: iter 1 (1.6/1.3) "sigue viéndose chica" → iter 2 perfil
  // 2.0 / frente 1.6 "quedó muy grande" → iter 3 (punto medio) 1.8/1.45 "un poco más
  // chico" → iter 4 1.7/1.4 → iter 5 1.6/1.35 → iter 6 "-0.1 más" perfil 1.5 / frente 1.25.
  'rusty-esvep/ESVEP-MBLK--S10-POL---perfil.jpg': 1.5,
  'rusty-esvep/ESVEP-MBLK--S10-POL---frente.jpg': 1.25,
  'rusty-esvep/ESVEP-SBLK--S10-POL---perfil.jpg': 1.5,
  'rusty-esvep/ESVEP-SBLK--S10-POL---frente.jpg': 1.25,
  'rusty-esvep/ESVEP-SBLK--S10--perfil.jpg': 1.5,
  'rusty-esvep/ESVEP-SBLK--S10---perfil.jpg': 1.25,

  // Vulk My Crew Receta — redondo/ovalado unisex G-Flex. Fotos 2:1 (1200×589 y
  // 900×442) con el anteojo más chico en el frame que el baseline receta → comparado
  // visualmente contra Opposit@1.15 (que llena el card), My Crew se ve ~15% más chico
  // → perfil 1.19 / frente 1.05. Naming inconsistente: SBLK frente = MYCREW-SBLK.jpg,
  // MBLK = GALERIA. medidas.webp queda en 1.0 (no grid).
  // (iteraciones founder: 1.3/1.15 → +0.02 → 1.32 → varios -0.01 → 1.29 → -0.10 (paso
  //  VISIBLE para calibrar; los -0.01 eran sub-perceptibles) → 1.19/1.05, 2026-06-11.)
  'vulk-my-crew/MY CREW SBLK PERFIL IMAGEN PRINCIPAL1200X589.jpg': 1.19,
  'vulk-my-crew/MYCREW-SBLK.jpg': 1.05,
  'vulk-my-crew/MY CREW 669K OPTICS PERFIL IMAGEN PRINCIPAL1200X589.jpg': 1.19,
  'vulk-my-crew/MY CREW 669K OPTICS FRENTE IMAGEN PRINCIPAL1200X589.jpg': 1.05,
  'vulk-my-crew/MY CREW MBLK P GALERIA.jpg': 1.19,
  'vulk-my-crew/MY CREW MBLK F GALERIA.jpg': 1.05,
  'vulk-my-crew/MY CREW 388 PERFIL IMAGEN PRINCIPAL1200X589.jpg': 1.19,
  'vulk-my-crew/MY CREW 388 FRENTE IMAGEN PRINCIPAL1200X589.jpg': 1.05,

  // Vulk Tour 81 Receta — cuadrado unisex G-Flex. Fotos GALERIA. Inicial 1.3/1.15
  // (precedente My Crew); founder confirmó visual GRANDE → -0.05 → 1.25/1.10 → otro
  // -0.05 "un poco más" → perfil 1.20 / frente 1.05 (2026-06-13). medidas.jpeg en 1.0.
  'vulk-tour-81/TOUR 81-MBLK PERFIL GALERIA.jpg': 1.2,
  'vulk-tour-81/TOUR 81-MBLK FRENTE GALERIA.jpg': 1.05,
  'vulk-tour-81/TOUR 81 CRY PERFIL GALERIA.jpg': 1.2,
  'vulk-tour-81/TOUR 81 CRY FRENTE GALERIA.jpg': 1.05,
  'vulk-tour-81/TOUR 81- 315 OPTICS PERFIL GALERIA.jpg': 1.2,
  'vulk-tour-81/TOUR 81- 315 OPTICS FRENTE GALERIA.jpg': 1.05,

  // Rusty Play SOL — wayfarer hombre. Fotos 900×442 con el anteojo GRANDE (ocupa ~95%
  // del frame, más lleno que My Crew/Opposit) → perfil 1.1 / frente 1.0 (scale bajo,
  // comparación visual). Naming inconsistente (.webp/.jpg). C1 perfil = copia CCCP de
  // PLAY-MBLK-S10-PERFIL.jpg. medidas.png en 1.0 (no grid).
  'rusty-play/PLAY-MBLK-S10-C1-PERFIL.jpg': 1.1,
  'rusty-play/PLAY MBLK C1 Frente.webp': 1.0,
  'rusty-play/PLAY-SBLK-S10-POL-perfil.jpg': 1.1,
  'rusty-play/rusty play sblk s10 frente.webp': 1.0,
  'rusty-play/PLAY-SBLK-PERFIL.jpg': 1.1,
  'rusty-play/PLAY-MBLK-REVO-BLUE---PERFIL.jpg': 1.1,
  'rusty-play/PLAY MBLK REVO BLUE FRENTE.jpg': 1.0,
  'rusty-play/PLAY-MBLK-S10-PERFIL.jpg': 1.1,
  'rusty-play/MBLK S10 Frente.webp': 1.0,

  // Rusty Terdey SOL — wayfarer unisex, todas polarizadas. Fotos GALERIA-WEB 900×442
  // (GALERIA=perfil, AGALERIA=frente). Encuadre estándar GALERIA-WEB → perfil 1.15 /
  // frente 1.0. Revo Red usa -p/-f. medidas.png en 1.0 (no grid). (MBLUE/Revo Blue del
  // bucket NO se carga: sin SKU/MLA.)
  'rusty-terdey/TERDEY GALERIA-WEB-SBLK-S10-POL.jpg': 1.15,
  'rusty-terdey/TERDEY AGALERIA-WEB-SBLK-S10-POL.jpg': 1.0,
  'rusty-terdey/TERDEY GALERIA-WEB-MBLK-S10-POL.jpg': 1.15,
  'rusty-terdey/TERDEY AGALERIA-WEB-MBLK-S10-POL.jpg': 1.0,
  'rusty-terdey/TERDEY MBLKREVO RED POL.-p.jpg': 1.15,
  'rusty-terdey/TERDEY MBLKREVO RED POL.-f.jpg': 1.0,
  // 4ª variante MBLUE/Revo Blue (desactivada hasta confirmar stock). GALERIA=perfil.
  'rusty-terdey/TERDEY GALERIA-WEB-MBLUE-REVOBLUE.jpg': 1.15,
  'rusty-terdey/TERDEY AGALERIA-WEB-MBLUE-REVOBLUE.jpg': 1.0,

  // Rusty Patien SOL — wayfarer unisex, bisagras metálicas flex. Fotos 1200×589.
  // founder 2026-06-13: +0.05 a todas (1.2/1.05 → 1.25/1.10) MENOS MBLK/S10 POL que
  // quedó bien en 1.2/1.05 (esa variante tiene la foto con el anteojo un toque más grande).
  'rusty-patien/PATIEN-SBLK---S15-perfil.jpg': 1.25,
  'rusty-patien/PATIEN-SBLK---S15-frente.jpg': 1.1,
  'rusty-patien/PATIEN-MBLK---R-BLUE-perfil.jpg': 1.25,
  'rusty-patien/PATIEN-MBLK---R-BLUE-frente.jpg': 1.1,
  'rusty-patien/PATIEN MBLK S10 POL.-p.jpg': 1.2,
  'rusty-patien/PATIEN MBLK S10 POL.-f.jpg': 1.05,
  'rusty-patien/PATIEN-669K-SBLK---G91-POL-perfil.jpg': 1.25,
  'rusty-patien/PATIEN-669K-SBLK---G91-POL-frente.jpg': 1.1,

  // Rusty Patien Optics RECETA — wayfarer unisex (versión receta del Patien de sol).
  // Fotos 900×442 con el anteojo ~90% del frame (lleno, como Play/Terdey) → perfil 1.1
  // / frente 1.0 (NO 1.2 como el sol que era 1200×589). medidas.webp en 1.0 (no grid).
  'rusty-patien-receta/PATIEN_669K-SBLK_P_GALERIA.jpg': 1.1,
  'rusty-patien-receta/PATIEN_669K-SBLK_F_GALERIA.jpg': 1.0,
  'rusty-patien-receta/PATIEN_MBLK_perfil.jpg': 1.1,
  'rusty-patien-receta/PATIEN_MBLK_OPTICAL_frente.jpg': 1.0,

  // Vulk The Sil SOL — cuadrado unisex Grilamid (TR-90), todas polarizadas. Fotos
  // 900×442 ("THESIL-...-"=perfil, "THE SIL-..."=frente). perfil 1.15 / frente 1.0
  // (encuadre como Terdey/Play). OJO: perfil G15 sin guion final; S10 con "-POL-".
  'vulk-the-sil/THESIL-SBLK-S10-POL-.jpg': 1.15,
  'vulk-the-sil/THE SIL-SBLK-S10-POL.jpg': 1.0,
  'vulk-the-sil/THESIL-MBLK-S10-POL-.jpg': 1.15,
  'vulk-the-sil/THE SIL-MBLK-S10-POL.jpg': 1.0,
  'vulk-the-sil/THE SIL-MBLK-G15-POL P.jpg': 1.15,
  'vulk-the-sil/THESIL-MBLK-G15-POL.jpg': 1.0,

  // Rusty Blinded SOL — redondo unisex, lente chico (48mm). perfil 1.15 / frente 1.0
  // PROVISIONAL — ⚠️ fotos NO subidas al cargar; el redondo chico puede necesitar más
  // scale → CONFIRMAR visual cuando el founder suba a rusty-blinded/. medidas.webp 1.0.
  'rusty-blinded/BLINDED_MBLK-S10_P_GALERIA.jpg': 1.15,
  'rusty-blinded/BLINDED_MBLK-S10_F_GALERIA.jpg': 1.0,
  'rusty-blinded/BLINDED_MDEMI-MBLK_BROWN_-_P.jpg': 1.15,
  'rusty-blinded/BLINDED_MDEMI-MBLK_BROWN_-_F.jpg': 1.0,

  // Rusty And Now SOL — envolvente deportivo. Fotos 667×442 (1.5:1) con el anteojo GRANDE
  // (~90% del frame) → perfil 1.1 (NO el 1.5 de Esvep, cuya foto tenía el anteojo chico).
  // Solo perfiles (no hay frente). medidas.webp en 1.0 (no grid).
  'rusty-and-now/and-now-sblk-s10.jpg': 1.1,
  'rusty-and-now/and-now-mblk-s10-pol-frente.jpg': 1.1,
  'rusty-and-now/and-now-revo-blue-perfil.jpg': 1.1,

  // Vulk Raven SOL — wayfarer/cuadrado unisex. CONFIRMADO visual (fotos subidas, vistas
  // 2026-06-14): las 6 son 900×442 (2.04:1) = MÁS ANCHAS que el card 3:2 → object-contain
  // ajusta por ancho y el anteojo ya llena ~90-95% → scale 1.0 en TODAS (subir cropearía las
  // patillas, ≠ The Sil que venía con más margen y usaba 1.15). ⚠️ paths con espacios/typo del founder.
  'vulk-raven/RAVEN-SBLK-PERFIL.jpg': 1.0,
  'vulk-raven/RAVEN-SBLK-FRENTE.jpg': 1.0,
  'vulk-raven/RAVEN-MBLK-PERFIL.jpg': 1.0,
  'vulk-raven/RAVEN-MBLK-F-PRINCIPAL-WEB.jpg': 1.0,
  'vulk-raven/RAVEN-MBLK-R blue PERFIL GALERIA.jpg': 1.0,
  'vulk-raven/RAVEN-MBLK-R blue FRENTE GALERIA .jpg': 1.0,
};

export function getImageScale(path: string | null | undefined): number {
  if (!path) return 1;
  return IMAGE_SCALE_OVERRIDES[path] ?? 1;
}
