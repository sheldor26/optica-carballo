# Óptica Carballo — Products Inventory

## Qué es este archivo

Tracker en tiempo real de **qué productos están cargados en el sitio, qué falta cargar, y el progreso por marca y categoría**. Permite a cualquier sesión de trabajo saber el estado del catálogo sin necesidad de querir la DB.

## Estructura

Por cada marca/categoría, trackeamos:
- Cantidad de productos cargados
- Cantidad con stock activo
- Cantidad con imágenes completas
- Cantidad con SEO completo (meta tags + structured data)
- Estado general

## Estados

- ✅ **Completo**: cargado con imágenes + SEO + stock confirmado
- 🟡 **Parcial**: cargado pero falta info (imágenes / SEO / stock)
- 🔴 **No cargado**: marca planificada pero sin productos
- ⏸️ **En pausa**: postergado hasta nueva decisión

---

# Resumen general

**Estado**: 🔴 Catálogo vacío — pre-launch.

**Totales actuales**:
- Marcas activas: 0
- Productos cargados: 0
- Productos con stock: 0
- Imágenes subidas: 0

**Targets pre-launch**:
- 8 marcas argentinas con al menos 5 productos cada una (40 productos mínimo)
- 4-6 marcas internacionales con productos top (20-30 productos)
- 4 marcas de lentes de contacto con líneas principales (16-20 SKUs base, expandido por receta)
- Total target: 80-100 productos visibles al lanzamiento

---

# Por categoría

## Anteojos de Sol

### Marcas Argentinas

| Marca | Productos cargados | Con stock | Con imágenes | Con SEO | Estado |
|-------|-------------------|-----------|--------------|---------|--------|
| Rusty | 3 | 3 | 1 | 3 | 🟡 |
| Rusty: Yau (deportivo 2-en-1) | 1 | 1 | 1 | 1 | ✅ Live (seed 10/13/15) |
| Rusty: Feeled MBLK TENNIS | 1 | 1 | pendiente founder | 1 | 🟡 Seed 23 listo, esperando fotos en bucket |
| Rusty: Dearly (cuadrado femenino, 3 variantes) | 1 | 3 variantes | pendiente founder | 1 | 🟡 Seed 24 listo, esperando 9 TODOs (precio/stock/var_code) + 7 fotos en bucket |
| Rusty: Zaedit (wayfarer unisex, 3 variantes) | 1 | 3 (stock 14) | 6 (verificar bucket) | 1 | ✅ Aplicado MCP (seed 38). 2 pol + REVO no-pol. Precio/stock vía ml-import-preview. Founder: chequear grid/scale. |
| Vulk: 53&3 Marky Ramone (aviador, edición especial, 5 variantes) | 1 | 5 (stock 12; 2 con stock) | 12 (pendiente bucket) | 1 | ✅ Aplicado MCP (seed 39). Las 5 polarizadas → /vulk/polarizados. Estuche tributo custom. Founder: subir fotos + chequear grid. |
| Rusty: Beason (cat eye femenino, 4 variantes) | 1 | 4 (stock 19) | 10 (HTTP 200, todas las variantes con foto) | 1 | ✅ Aplicado MCP (seed 44). Ninguna pol → `lens_treatment ["uv400"]`. gender=female, cat_eye, 26,2g. Primary=L.PINK perfil. Completo. Founder: chequear grid. |
| Rusty: Vorez (cuadrado femenino, 2 variantes) | 1 | 2 (stock 5; 1 con stock) | 5 (HTTP 200) | 1 | ✅ Aplicado MCP (seed 45). 1 pol (SBLK) → `lens_treatment ["uv400"]`. gender=female, cuadrado, 25,5g. Primary=M.ROSE perfil. Founder: chequear grid. |
| Rusty: Gresent (aviador doble puente, unisex, 4 variantes) | 1 | 4 (stock 15) | 9 (HTTP 200) | 1 | ✅ Aplicado MCP (seed 49). Multi-variante, ninguna pol → `lens_treatment ["uv400"]`. Apto receta, aviador doble puente, 38,4g. Primary=SDEMI carey. Medidas confirmadas (imagen 138/60/14). Founder: chequear grid. |
| Vulk: Way Back (wayfarer, unisex, 4 variantes) | 1 | 4 (stock 9; 3 con stock) | 9 (HTTP 200) | 1 | ✅ Aplicado MCP (seed 50). 3 de 4 pol → entra a /polarizados. G-Flex + bisagras metálicas Flex. Primary=SBLK. Shape wayfarer (confirmado founder). Peso 26g (2026-06-04). Founder: chequear grid. |
| Rusty: Opposit RECETA (wayfarer femenino, 3 var) | 1 | 3 (stock 4; 2 con stock) | 7 (HTTP 200) | 1 | ✅ Aplicado MCP + PDP live (seed 60, 2026-06-11). **Categoría receta**. Wayfarer femenino, frente G-Flex + patillas de metal con terminales de acetato hechas a mano, 24,3g, 147/53×47/17/140 (medidas de la foto). **SEO por seo-strategist** (slug/meta/keywords; Ubersuggest quedó pendiente). 3 colores SKU distintos: MDEMI-068 carey mate (primary), SBLK-068 negro brillo, 385-202 violeta transparente. model_code OPTICAL. Precio/stock/var_id de ML. Scale 1.15/1.0 (pendiente visual). |
| Rusty: R-CY 02 RECETA (rectangular eco, 5 var) | 1 | 5 (stock 5; 3 con stock) | 11 (HTTP 200) | 1 | ✅ Aplicado MCP + PDP live (seed 59, 2026-06-11). **Categoría receta**. Rectangular, ECOLÓGICO/reciclado, ultra liviano 11,3g, bisagras metálicas, unisex. 140/54×38/18/135. Precio/stock/var_id traídos de la API ML (`scripts/ml-item.ts`). 5 colores: MBLK (primary), SBLK (reusa fotos MBLK), STEEL BLUE, SBLUE, LGREY. SKU `960186-COLOR` (el 960186 venía repetido; sku es UNIQUE). frame_material omitido (eco en descripción+callout). Scale 1.15/1.0 (pendiente chequeo visual founder). |
| Vulk: The Sil (cuadrado unisex sol, 3 var) | 1 | 3 (stock 60) | 7 (HTTP 200) | 1 | ✅ Aplicado MCP + PDP live (seed 67, 2026-06-13). **SOL**, cuadrado UNISEX talle large, **Grilamid (tr-90)**, bisagras plásticas reforzadas, 28g. **3 MLAs separados**. **LAS 3 POL** → /polarizados. SBLK/S10 128303 $81.064 stock 25 (primary); MBLK/S10 128301 stock 18; MBLK/G15 128302 stock 17 (verde G15). Medidas 144/55×51/20/145 (foto). **SEO+catalog-loader** (norma). GALERIA naming: THESIL-=perfil, THE SIL-=frente. Scale 1.15/1.0. |
| Rusty: Patien Optics RECETA (wayfarer unisex, 2 var) | 1 | 2 (stock 1; 669K con stock) | 5 (HTTP 200) | 1 | ✅ Aplicado MCP + PDP live (seed 66, 2026-06-13). **RECETA** (versión receta del Patien de sol), wayfarer UNISEX, G-Flex, bisagras flexo metálicas, **23,6g**, lentes demo. **Multivariante** (1 MLA, var_id poblado). 669K-SBLK OPTICAL 126096 stock 1 (primary, translúcido); MBLK OPTICAL 126090 stock 0. $83.078. Medidas 140/49×40/21/145 (foto). Convención receta (solo lens_compatibility). **SEO+catalog-loader** (norma). Scale 1.1/1.0 (900×442). Carpeta `rusty-patien-receta/`. |
| Vulk: Tour 81 RECETA (cuadrado unisex, 3 var) | 1 | 3 (stock 1; solo 315 con stock) | 7 (⚠️ fotos NO subidas aún) | 1 | 🟡 Seed 62 APLICADO MCP (2026-06-11) — **carga ABIERTA**: faltan las 7 fotos en `vulk-tour-81/` (founder sube) → recién ahí PDP con imágenes + verificación visual del scale. `/anteojos-de-receta/vulk/vulk-tour-81-receta`. Cuadrado UNISEX, G-Flex, bisagras flex, medium. `frame_shape='square'`. 140/50×47/21/138 (medidas de la FOTO; texto ML decía 139/40). Precio/stock/var_id de ML (`scripts/ml-item.ts`), 1 MLA (MLA1476831627), todas $83.443: MBLK 125890 stock 0 (primary), CRY 125892 stock 0, 315 125894 stock 1. model_code OPTICAL. **SEO+catalog-loader invocados** (norma). Scale 1.3/1.15 PROVISIONAL (precedente GALERIA My Crew). ⬜ Peso OMITIDO (ML no da → BACKLOG, founder pesa la 315). |
| Vulk: My Crew RECETA (redondo unisex, 4 var) | 1 | 4 (stock 11) | 9 (HTTP 200) | 1 | ✅ Aplicado MCP + PDP live (seed 61, 2026-06-11). **Categoría receta**. `/anteojos-de-receta/vulk/vulk-my-crew-receta`. Redondo/ovalado UNISEX, G-Flex frente+patillas, bisagras metálicas flex (en callout, no schema), 16g, medium. frame_shape `round` (no existe `oval` en el enum). 137/49×40/21/140 (medidas de la foto; texto ML decía varilla 145). Precio/stock/var_id de la API ML (`scripts/ml-item.ts`), 1 MLA (MLA1432179921). 4 colores SKU distintos: SBLK 125580 negro brillo (primary, stock 3), 669K 125583 gris transp. (4), MBLK 125584 negro mate (3), 388 125582 marrón transp. (1). model_code OPTICAL. **SEO+catalog-loader invocados** (norma founder). Scale perfil 1.3/frente 1.15 (comparado visual vs Opposit@1.15, fotos 2:1 → +scale). |
| Rusty: Patien (wayfarer unisex sol, 4 var) | 1 | 4 (stock 36; 669K en 0) | 9 (HTTP 200) | 1 | ✅ Aplicado MCP + PDP live (seed 65, 2026-06-13). **SOL**, wayfarer UNISEX, G-Flex, **bisagras metálicas flex**, policarbonato UV400 cat 3. **4 MLAs separados**. Precio/stock ML: SBLK/S15 126092 $73.661 stock 17 (primary, antirreflex); Revo Blue 126091 $79.373 stock 13 (espejada); MBLK/S10 POL 126099 $85.924 stock 6 (POL→/polarizados); 669K-SBLK/SG91 POL 126093 $86.011 stock 0 (POL, gris degradé, bicolor). **2/4 POL**. Medidas 140/49×40/21/145 (foto). **SEO+catalog-loader** (norma). Scale 1.2/1.05 (1200×589). ⬜ Peso omitido (BACKLOG). |
| Rusty: Terdey (wayfarer unisex sol, 4 var: 3 activas + azul desact.) | 1 | 4 (3 activas stock 38 + MBLUE desact. stock 6) | 9 (HTTP 200) | 1 | ✅ Aplicado MCP + PDP live (seed 64, 2026-06-13). **SOL**, wayfarer UNISEX, G-Flex, policarbonato UV400 cat 3. **4 MLAs separados** (items simples). 3 POL → /polarizados; **4ª MBLUE/Revo Blue 128824 DESACTIVADA** (founder confirma stock el martes; "no polarizados"). Precio/stock ML: SBLK/S10 128821 $77.375 stock 21 (primary); MBLK/S10 128820 $77.375 stock 16; Revo Red 128823 $82.380 stock 1 (espejada roja). Medidas 145/54×47/16/140 (foto). **SEO+catalog-loader** (norma). GALERIA=perfil/AGALERIA=frente. Scale 1.15/1.0. ⚠️ 2 fotos MBLUE/Revo Blue sin cargar (sin SKU). ⬜ Peso omitido (BACKLOG). |
| Rusty: Play (wayfarer hombre sol, 4 var) | 1 | 4 (stock 24) | 10 (HTTP 200) | 1 | ✅ Aplicado MCP + PDP live (seed 63, 2026-06-13). **SOL**, wayfarer hombre, G-Flex, policarbonato UV400 cat 3. **4 MLAs separados** (items simples, var_id NULL). 2 de 4 POL → /polarizados (polarized:true por variante). Precio/stock de ML: C1 100921 $81.090 stock 8 (primary, antirreflejo); SBLK/S10 POL 100933 $93.631 stock 7; Revo Blue 103473 $88.571 stock 5 (espejado); MBLK/S10 POL 103472 $93.631 stock 4. Medidas 141/61×47/12/140 (foto). **SEO+catalog-loader invocados** (norma). CCCP: perfil C1 copiado del MBLK/S10. Scale 1.1/1.0 (anteojo grande en frame). ⬜ Peso omitido (ML no da → BACKLOG). Grillas categoría tras revalidación ISR. |
| Rusty: Esvep (envolvente deportivo, 3 var) | 1 | 3 (stock 12) | 7 (HTTP 200) | 1 | ✅ Aplicado MCP (seed 58). 2 POL → /polarizados + /deportivos. G-Flex, cat 3, 140/60×46/10/130. Primary=MBLK. Scale 1.6/1.3 (founder: muy chico). Founder: confirmar perfil/frente SBLK no-pol. |
| Vulk: Clems RECETA (armazón ovalado, 3 var) | 1 | 3 (stock 11) | 7 (HTTP 200) | 1 | ✅ Aplicado MCP (seed 57). **Categoría receta**. Multi-variante (CRY/MBLK/SBLK). lens_compat mono/bi/progresivo. Ovalado, 14,3g (ultra liviano), medium, 137/49×46/20/145. G-Flex + acero inox. Primary=CRY. Verificado runtime (PDP 200, grid receta). Founder: chequear scale. |
| Vulk: Lady Piny (redondo femenino, 4 var) | 1 | 4 (stock 15; 3 con stock) | 9 (HTTP 200) | 1 | ✅ Aplicado MCP (seed 56). 1 pol (BG26) → `lens_treatment ["uv400"]`. gender=female, 30,9g, cat 3, 141/57×54/17/135. G-Flex + acetato + bisagras metálicas flex. Primary=285 rosa. Verificado runtime (PDP 200, grid mujer, /polarizados). Founder: chequear scale + confirmar shape (redondo/ovalado). |
| Rusty: Dileri (cuadrado femenino, 2 var) | 1 | 2 (stock 6) | 5 (HTTP 200) | 1 | ✅ Aplicado MCP (seed 55). 1 pol (SBLK/S10) → `lens_treatment ["uv400"]`. gender=female, 31,8g, 140/52×53/15/135. Frente G-Flex + patillas Flex Temple. Primary=SBLK/S10 POL. Verificado runtime (PDP 200, grid mujer, /polarizados). Founder: chequear scale + ¿primary SBLK o SIENNA? |
| Rusty: CCCP (deportivo envolvente, unisex, 4 var) | 1 | 4 (stock 8; 3 con stock) | 9 (HTTP 200) | 1 | ✅ Aplicado MCP (seed 54). 2 pol (POL) + 2 antirreflex interno → `lens_treatment ["uv400"]`. Envolvente deportivo, G-Flex, 139/68×45/16/108. Primary=SBLK/S10 POL. **Fotos por color de frente: AR usa copias de las fotos POL del mismo color (founder), vars_sin_foto=0.** Scale 1.15/1.0 (puede necesitar bump, como Eslav). Founder: chequear scale. |
| Vulk: Katleen RECETA (armazón cuadrado femenino, 3 var) | 1 | 3 (stock 7) | 7 (HTTP 200) | 1 | ✅ Aplicado MCP (seed 53). **Categoría receta**. MBLK simple + M0292/0292 (multi-var MLA2014157548). lens_compat mono/bi/progresivo. gender=female, 26,3g, medium, 129/53×42/18/145. Primary=MBLK perfil. Verificado runtime. Founder: chequear scale. |
| Vulk: Katleen (cuadrado femenino, 4 variantes) | 1 | 4 (stock 24; 3 con stock) | 9 (HTTP 200) | 1 | ✅ Aplicado MCP (seed 52). 1 pol (MBLK/S10) → `lens_treatment ["uv400"]`. gender=female, 26,3g (ultra liviano), talle medium, 129/53×42/18/145. Primary=SDEMI-SBLK carey. Verificado runtime (PDP 200, /polarizados, grid mujer). Founder: chequear scale. |
| Vulk: Deserve (cuadrado grande, unisex, 3 variantes) | 1 | 3 (stock 15) | 7 (HTTP 200) | 1 | ✅ Aplicado MCP (seed 51). 1 pol (MBLK/S10) → `lens_treatment ["uv400"]`. Talle large, 146/59×58/16/145. Primary=MBLK/S10 POL perfil. Verificado runtime (PDP 200, /polarizados). Founder: chequear scale en grid. |
| Rusty: Misty RECETA (armazón redondo unisex, talle chico, 3 var) | 1 | 3 (stock 14) | 7 (HTTP 200) | 1 | ✅ Aplicado MCP (seed 48). **Categoría receta**. Multi-variante (MBLK/373K/0292). lens_compatibility mono/bi/progresivo. Talle chico. Primary=MBLK perfil. Founder: chequear grid + confirmar shape (redondo vs ML "ovalados"). |
| Rusty: Misty (redondo unisex, talle chico, 3 variantes) | 1 | 3 (stock 23) | 7 (HTTP 200) | 1 | ✅ Aplicado MCP (seed 47). 2 pol (BROWN, MBLK) → entra a /polarizados. **Talle chico** (size_fit="chico", badge + callout warning). Redondo unisex, 17,8g. Primary=L.ROSE perfil. Founder: chequear grid + ¿primary rosa OK para unisex? |
| Rusty: Eslav (deportivo envolvente, 2 variantes) | 1 | 2 (stock 14; 1 con stock) | 5 (HTTP 200) | 1 | ✅ Aplicado MCP (seed 46). AMBAS pol → `lens_treatment ["uv400","polarized"]` (entra a /polarizados). Intercambiables (lentes amarillas) + apto receta. unisex, envolvente, base 8. Primary=MBLK/S10 perfil. Eslav≠Sotion. Founder: chequear grid. |
| Vulk: Reporter (cuadrado G-Flex, apto receta, 3 variantes) | 1 | 3 (stock 12) | 7 (HTTP 200) | 1 | ✅ Aplicado MCP (seed 43). 2 pol (S10+LGREY, multi-var MLA1866713114) → `lens_treatment ["uv400"]`. Apto receta. Primary=MBLK/G.GREEN perfil. Founder: ¿4ª var verde degradé stock 0? + tonalidad LGREY/DRT03 + chequear grid. |
| Rusty: Dapper (G-Flex, unisex, 4 variantes) | 1 | 4 (stock 5; 2 con stock) | 9 (HTTP 200) | 1 | ✅ Aplicado MCP (seed 42). 1 pol (SBLK) → `lens_treatment ["uv400"]`. Precio/stock vía ml-import-preview prod. Primary=SBH/6208 perfil. Forma redondo (confirmado founder). Founder: chequear grid/scale. |
| _Nota: tabla desactualizada (faltan Vrast/Etiquet/Tulle/Xold/Spell/Sotion/Zaedit/etc.). Fuente de verdad de seeds aplicados = `supabase/CLOUD_APPLIED.md`._ | | | | | |
| Reef | 0 | 0 | 0 | 0 | 🔴 |
| Vulk | 0 | 0 | 0 | 0 | 🔴 |
| Infinit | 0 | 0 | 0 | 0 | 🔴 |
| Prune | 0 | 0 | 0 | 0 | 🔴 |
| Union Pacific | 0 | 0 | 0 | 0 | 🔴 |
| Wanama | 0 | 0 | 0 | 0 | 🔴 |
| Orbital | 0 | 0 | 0 | 0 | 🔴 |
| Cohiba | 0 | 0 | 0 | 0 | 🔴 |

### Colecciones de Famosos

| Colección | Estado | Notas |
|-----------|--------|-------|
| Las Oreiro | ⏸️ | Pendiente confirmar stock |
| Paula Cahen d'Anvers | ⏸️ | Pendiente |
| Valeria Mazza | ⏸️ | Pendiente |
| Teresa Calandra | ⏸️ | Pendiente |
| Infinit by Pampita | ⏸️ | Pendiente |

### Marcas Internacionales

| Marca | Productos | Estado |
|-------|-----------|--------|
| Ray-Ban | 0 | 🔴 |
| Oakley | 0 | 🔴 |
| Prada | 0 | 🔴 |
| Miu Miu | 0 | 🔴 |
| Versace | 0 | 🔴 |
| Tiffany | 0 | 🔴 |
| Persol | 0 | 🔴 |
| Carrera | 0 | 🔴 |
| Police | 0 | 🔴 |

## Anteojos de Receta

### Marcas

| Marca | Productos | Estado |
|-------|-----------|--------|
| Vulk | 2 (My Crew, Tour 81) | 🟡 |
| Infinit | 0 | 🔴 |
| Prune | 0 | 🔴 |
| Ray-Ban (línea óptica) | 0 | 🔴 |
| Prada (línea óptica) | 0 | 🔴 |
| (otras a definir) | - | - |

## Lentes de Contacto

### Marcas

| Marca | Líneas cargadas | Estado |
|-------|-----------------|--------|
| Acuvue | 0 | 🔴 |
| - Moist | 0 | 🔴 |
| - TruEye | 0 | 🔴 |
| - Oasys | 0 | 🔴 |
| - Vita | 0 | 🔴 |
| - Define | 0 | 🔴 |
| Bausch + Lomb | 0 | 🔴 |
| - Biotrue | 0 | 🔴 |
| - Ultra | 0 | 🔴 |
| - SofLens | 0 | 🔴 |
| Alcon | 0 | 🔴 |
| - Dailies Total 1 | 0 | 🔴 |
| - Dailies AquaComfort | 0 | 🔴 |
| - Air Optix | 0 | 🔴 |
| CooperVision | 0 | 🔴 |
| - Biofinity | 0 | 🔴 |
| - MyDay | 0 | 🔴 |

**Nota sobre lentes de contacto**: cada línea tiene múltiples SKUs por graduación. Una "línea" cargada significa la línea base, las variantes de graduación se modelan en `product_variants`.

## Accesorios

| Tipo | Productos | Estado |
|------|-----------|--------|
| Estuches | 0 | 🔴 |
| Paños de microfibra | 0 | 🔴 |
| Líquidos para contactos | 0 | 🔴 |
| Cordones / cadenas | 0 | 🔴 |
| Sprays de limpieza | 0 | 🔴 |

---

# Plan de carga (pre-launch)

## Sprint 1 — Marcas argentinas top (semana 2-3)

Objetivo: tener 30-40 productos cargados con todo el SEO completo.

Orden sugerido (por prioridad SEO):
1. **Rusty** — 6.000 vol — cargar 6-8 modelos
2. **Reef** — 3.400 vol — 5-6 modelos
3. **Vulk** — 2.500 vol — 5-6 modelos
4. **Prune** — 2.000 vol — 5-6 modelos
5. **Infinit** — 2.100 vol — 5 modelos
6. **Union Pacific** — 1.700 vol — 4 modelos
7. **Wanama** — 1.100 vol — 4 modelos
8. **Orbital** — 1.100 vol — 4 modelos

## Sprint 2 — Marcas internacionales (semana 4)

1. **Ray-Ban** — 7.200 vol con "mujer" — Wayfarer, Aviator, Justin, Erika (8-10 modelos)
2. **Prada** — 2.600 vol — 4-5 modelos
3. **Tiffany** — 1.700 vol — 3-4 modelos
4. **Oakley** — 1.400 vol — 3-4 modelos

## Sprint 3 — Lentes de contacto (semana 4-5)

Líneas principales de Acuvue + Bausch + Alcon + CooperVision.
- Por línea, cargar SKUs por graduación esperada (-6.00 a +6.00 paso 0.25 mínimo en líneas core).
- Mensuales y diarias prioridad sobre quincenales.

## Sprint 4 — Anteojos de receta + accesorios (semana 5-6)

Marcas argentinas y top internacionales con líneas ópticas.
Accesorios complementarios (estuches, paños, líquidos).

---

# Workflow de carga de un producto

(Detallado en el skill `/product` que viene en Entrega 4)

Resumen:
1. Datos del producto (nombre, marca, SKU, precio).
2. Variantes (color, talle, etc.) con SKU vendible cada una.
3. Imágenes: subir a Supabase Storage, asociar a producto y a variantes específicas si aplica.
4. SEO: meta_title, meta_description, alt text, slug.
5. Atributos para filtros: forma, material, color, género, recommended_face_shapes, etc.
6. Categorías automáticas: el producto se asocia a las categorías cuyo `auto_filter` matchea.
7. Stock real cargado por variante.
8. Activar producto.
9. Actualizar este archivo (`PRODUCTS_INVENTORY.md`).

---

# Checklist por producto

Cada producto debe tener antes de activarse:

- [ ] SKU base + slug único
- [ ] Nombre + modelo + descripción corta (50-100 palabras)
- [ ] Descripción larga (300-600 palabras únicas, no copy-paste)
- [ ] Marca asociada
- [ ] Categoría asociada (correcta)
- [ ] Al menos 1 variante con SKU vendible y stock
- [ ] Mínimo 3 imágenes (frontal, perfil, detalle/contexto)
- [ ] Imagen principal optimizada (WebP, <200KB)
- [ ] Alt text descriptivo en cada imagen
- [ ] Precio + cuotas configuradas correctamente
- [ ] Atributos físicos completos (medidas en mm, material, color)
- [ ] Para sol: UV protection + polarizado especificados
- [ ] Para receta: tipo de lente recomendado especificado
- [ ] Para contacto: BC, DIA, duración, material
- [ ] recommended_face_shapes (si aplica)
- [ ] Meta title (<60 chars con keyword)
- [ ] Meta description (150-160 chars)
- [ ] Structured data verificado (Product schema válido)
- [ ] Imagen OG para compartir en redes
- [ ] Producto agregado a sitemap

---

# Decisiones pendientes que afectan al inventario

(Referenciadas en DECISIONS.md)

- **PEND-002**: Stock real de colecciones de famosos (Las Oreiro, etc.).
- **PEND-004**: Acceso a panel ML para exportar histórico de 2000+ ventas — top productos a priorizar.
- **PEND-005**: Cuentas creadas (necesarias para que funcione todo el flow).

---

# Histórico de avance

| Fecha | Sprint | Productos agregados | Notas |
|-------|--------|---------------------|-------|
| 2026-05-27 | Setup inicial | 0 | Sistema configurado, falta cargar catálogo |

(Se llena cuando empezamos a cargar)

---

# Hibernación / discontinuación

Cuando un producto deja de tenerse:

1. Marcar `is_active=false` en DB (no borrar).
2. Sacar del sitemap automáticamente.
3. Si no hay variantes con stock por >60 días, considerar redirect 301 a la categoría padre.
4. Mantener URL accesible si tiene reviews / autoridad SEO.
5. Actualizar este archivo.
