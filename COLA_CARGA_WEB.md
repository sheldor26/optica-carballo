# Cola de carga a la web (modelos y variantes esperando Supabase)

**Por qué existe:** desde 2026-11-24 el Supabase del proyecto (`tuddpfspnbnmafsqdvat`) está restringido por `exceed_egress_quota` (HTTP 402): los scripts, `pnpm fotos:subir` y la lectura del token de ML no funcionan. Decisión del founder (2026-11-25): **se sigue preparando todo lo que no necesita Supabase (placas de ML, copy, fotos) y la carga a la web se hace junta cuando vuelva.**

**Cómo se usa:** cada modelo o variante nueva se agrega acá con sus datos y su estado. Al volver Supabase se procesa la cola en orden y cada entrada se marca ✅ con el seed y la fecha.

## Pasos de arranque cuando vuelva Supabase (una sola vez)
1. Verificar que ya no hay 402: `curl -s -o /dev/null -w "%{http_code}" "https://tuddpfspnbnmafsqdvat.supabase.co/rest/v1/products?select=id&limit=1" -H "apikey: <anon key>"` debe dar 200.
2. **Rastrear en ML lo que falta por SKU** (Zubia C2 970021 y C3 970022; confirmar C1 `MLA4239644536`; y los SKU 125571/125572/125576 del Netaglio). Por cada entrada: `pnpm exec tsx --env-file=.env.local <script ml-vars> <item_id>` para confirmar SKU, stock, precio y `variation_code` por API (no por la página).
3. SELECT en la base para confirmar que el modelo no existe o ver qué ya tiene.
4. `seo-strategist` + `catalog-loader` (+ `optical-expert` si hay claim óptico) antes de escribir el seed.
5. Seed (siguiente número libre), aplicar a Cloud, `pnpm fotos:subir` por color, scale override si la proporción no da, verificar PDP y grid, y actualizar `supabase/CLOUD_APPLIED.md`, `SEO_STRATEGY.md`, `PRODUCTS_INVENTORY.md`, `CURRENT_STATE.md`.
6. Commit/push sólo cuando el founder diga "subí".
Próximo número de seed libre: **217** (reservado para el Rusty Zubia; el Netaglio pasa al 218; el 217 es un borrador, no aplicar; el Decloc va al 219; el Xold Sienna al 220).

---


---

## 2026-11-26: SUPABASE VOLVIÓ (HTTP 200) y se rastreó todo por API de ML
| Modelo | SKU | item / variation | Precio | Stock |
|---|---|---|---|---|
| Zubia C1 | 970020 | `MLA4239644536` | $138.912 | 3 |
| Zubia C2 | 970021 | `MLA4239644534` | $138.912 | 3 |
| Zubia C3 | 970022 | `MLA4239632260` (en ML: color de armazón y de lente invertidos) | $138.912 | 3 |
| Decloc C1 | 970030 | `MLA2322131483` | $138.912 | 1 |
| Decloc C2 | 970031 | `MLA4241233772` | $138.912 | 3 |
| Decloc C3 | 970032 | `MLA4241258758` | $138.912 | 3 |
| Netaglio MBLK | 125571 | `MLA1664343869` / `190038818726` | $87.317,33 | 3 |
| Netaglio CRY | 125572 | `MLA1664343869` / `196504291001` | $87.317,33 | 1 |
| Netaglio MRED | 125576 | `MLA1664343869` / `208743224987` | $87.317,33 | 2 |
| Xold Sienna | 126420 | **no figura en ML** | - | - |

Publicaciones de catálogo ignoradas: `MLA1664331015`, `MLA3226097926`. Seeds 217 y 219 COMPLETOS (sin aplicar); 218 (Netaglio) por escribir; 220 espera la publicación del Xold Sienna. **Falta el OK del founder para aplicar en la web.**


**Estado 2026-11-26:** cargados Zubia (seed 217), Netaglio (218, slug `vulk-netaglio-receta`) y Decloc (219). En cola queda sólo el Xold Sienna (220): falta que se publique en ML.

## En cola

### 1. Vulk Netaglio (receta, G-Flex, rectangular, unisex): 3 variantes, producto NUEVO `vulk-netaglio`
**✅ CARGADO EN LA WEB (2026-11-26).** Lo de abajo es el historial de la preparación.
**Estado:** placas de ML listas; falta la carga web. Detalle de copy y atributos: `marketing/placas-ml/PUBLICACION-vulk-netaglio.md`.
**Datos del founder (2026-11-24):** armazón de G-Flex, bisagras metálicas con sistema flex, rectangular, unisex, apto para todo tipo de lentes (mono, bi y progresivos), lentes demo, **51-20-140, alto total 46, ancho total 144, 17,9 g**. Las medidas de Vulk (55-20-145, talle Large) NO se usan.
**ML:** item `MLA1664343869` (título "Armazon Anteojos De Receta Vulk Netaglio Lentes Gafas Comodo", congelado por ventas; 3 vendidos), $87.317 en las 3. Leído de la página el 2026-11-25 (no por API):

| Variante | SKU (dicho por el founder) | Color | `variation_code` (página) | Stock (página) | Kit |
|---|---|---|---|---|---|
| MBLK | 125571 | Negro mate | `190038818726` | 3 | `marketing/placas-ml/SUBIR-vulk-netaglio-mblk` |
| MRED | 125576 | Rojo mate | `208743224987` | 2 | `marketing/placas-ml/SUBIR-vulk-netaglio-mred` |
| CRY | 125572 | Transparente | `196504291001` | sin confirmar (probable 0) | `marketing/placas-ml/SUBIR-vulk-netaglio-cry` |

**Falta confirmar por API:** SKU de cada variación, stock de CRY y los `variation_code` (vienen de la página).
**Para la carga:** `pnpm fotos:subir --slug vulk-netaglio --dir marketing/placas-ml/SUBIR-vulk-netaglio-<c>/web --sufijo -<c>` por color (perfil y frente; medidas una sola vez); primaria del producto = perfil de la primera variante (sort 0); comparar el scale contra el grid de `/anteojos-de-receta`. Labels de color (`lib/catalog/variant-label.ts`, revisado 2026-11-25): `negro-mate` ya existe; `rojo-mate` y `transparente` NO aparecen como clave exacta en FRAME_COLOR_LABELS: antes del seed grepear de nuevo (puede haber `rojo` o `cristal`) y agregar lo que falte. Stock = el de ML, aunque sea 0 (se sincroniza solo).
**Pendientes del founder:** GTIN de cada variante; decidir si pega en ML la descripción nuestra (la actual tiene "liviano" y tuteo) y si corrige la forma ("Cuadrada" en ML, rectangular según él); grabado tenue de la patilla en la roja y la transparente (¿liso?).
**Foto de web lista:** `marketing/placas-ml/SUBIR-vulk-netaglio-<c>/web/{perfil,frente,medidas}.jpg`.

### 2. Rusty Zubia (sol, redondo, unisex, metal): 3 variantes, producto NUEVO `rusty-zubia`
**✅ CARGADO EN LA WEB (2026-11-26).** Lo de abajo es el historial de la preparación.
**Estado (2026-11-25):** kits de ML listos (`marketing/placas-ml/SUBIR-rusty-zubia-c1|c2|c3`: 01 perfil, 02 frente, 03 callouts, 04 medidas, 06 garantía; sin 05 de lentes porque no dijiste que se puedan graduar; web: perfil, frente, medidas). **Seed 217 escrito como BORRADOR** (`supabase/seeds/217_rusty_zubia_sol.sql`, con `seo-strategist` + `catalog-loader` ya consultados): tiene placeholders `__PRECIO_C#_CENTS__`, `__STOCK_C#__`, `__MLA_ITEM_C#__`, `__VARIATION_C#__` SIN comillas que rompen el SQL a propósito; hay que completarlos con la API de ML y recalcular `new_until`. Copy de ML en `marketing/placas-ml/PUBLICACION-rusty-zubia.md`. Falta: publicación en ML (item, variation_code, precio, stock).
**Datos del founder:** armazón y patillas de **metal con terminales de acetato**, bisagras de **acero inoxidable SIN flex**, redondos, unisex, **polarizadas las 3, UV400, cat 3**, **50-21-145, alto total 48, ancho total 135**. Rusty publica 18,8 g (a confirmar si se carga) y 136×48 de frente (se usa lo del founder: 135).
**Fuente:** https://rustyoptical.com/sunglasses/ss27/zubia (SS27). Fotos oficiales 1024×1024 en `marketing/fotos/rusty-zubia-c#/originales/`.

| Variante | SKU | Armazón | Lente | Kit |
|---|---|---|---|---|
| C1 POL | 970020 | Dorado | Marrón | `SUBIR-rusty-zubia-c1` |
| C2 POL | 970021 | Dorado | Verde | `SUBIR-rusty-zubia-c2` |
| C3 POL | 970022 | Plateado | Gris degradé | `SUBIR-rusty-zubia-c3` |

**ML (2026-11-25, leído de la página, no por API):** el founder publicó **un item simple por color** (no una multivariante). **C1: `MLA4239644536`, $138.912, stock 3, `variation_code` NULL**; "Material de la varilla: Acetato" en ML (la web dice metal con terminales de acetato). **C2 y C3: el founder pidió que se rastreen por SKU (970021 y 970022) con la API cuando Supabase vuelva** (`users/{id}/items/search?seller_sku=`, como el script `ml-sku.ts`); no hace falta pasar sus links. Confirmar todo por API cuando vuelva Supabase; seed 217 ya lleva C1 completado y C2/C3 con placeholders.
**Decisiones ya tomadas:** peso 18,8 g de la ficha de Rusty se carga como dato (regla 7 de CLAUDE.md: el peso sí puede venir del fabricante), sin adjetivo; `hide_prescription_faq: true` (no dijo que se pueda graduar); `plateado` como `frame_color` (cae al fallback y se ve "Plateado", igual que Vrast); scale override: arrancar sin entry y mirar el grid; frase de vuelta en Zion; enums `metal`/`estandar`/`metal` como Merge. **Fotos (dry-run OK):** `pnpm fotos:subir --slug rusty-zubia --dir marketing/placas-ml/SUBIR-rusty-zubia-c1/web --sufijo -c1` (con medidas) y c2/c3 con `--solo perfil,frente`.
**Pendientes del founder:** publicar en ML (UNA publicación, 3 variaciones) y pasar link, precio y stock; GTIN por variante; confirmar que está bien cargar el peso 18,8 g de Rusty.

### 3. Rusty Decloc (sol, ovalado, unisex, metal): 3 variantes, producto NUEVO `rusty-decloc`
**✅ CARGADO EN LA WEB (2026-11-26).** Lo de abajo es el historial de la preparación.
**Estado (2026-11-25):** kits de ML listos (`marketing/placas-ml/SUBIR-rusty-decloc-c1|c2|c3`: 01 perfil, 02 frente, 03 callouts, 04 medidas, 06 garantía; web: perfil, frente, medidas; sin placa 05 porque no dijo que se puedan graduar). **Seed 219 escrito como BORRADOR NO APLICABLE** (`supabase/seeds/219_rusty_decloc_sol.sql`; con `seo-strategist`; placeholders `__PRECIO_C#_CENTS__`, `__STOCK_C#__`, `__MLA_ITEM_C#__`, `__VARIATION_C#__` sin comillas; recalcular `new_until`). Copy de ML en `marketing/placas-ml/PUBLICACION-rusty-decloc.md`. Title web `Anteojos de Sol Rusty Decloc Polarizados | UV400, Unisex`; frase de vuelta en EYSY; cross-link con el Zubia (ya editado en el borrador 217; el 219 lleva un UPDATE con guard por si el 217 se aplicó antes). Faceta `/anteojos-de-sol/ovalados` anotada en BACKLOG.
**Datos del founder (2026-11-25):** armazón y patillas de **metal con terminales de acetato**, bisagras de **acero inoxidable SIN flex**, **ovalados, unisex**, **polarizadas las 3, UV400, cat 3**, **53-18-145, alto total 43, ancho total 138, 20,1 g**. Rusty publica 139×43 de frente (se usa lo del founder: 138).
**Fuente:** https://rustyoptical.com/sunglasses/ss27/decloc (SS27). Fotos oficiales 1024×1024 en `marketing/fotos/rusty-decloc-c#/originales/`.

| Variante | SKU | Armazón | Lente | Kit |
|---|---|---|---|---|
| C1 POL | 970030 | Dorado | Marrón | `SUBIR-rusty-decloc-c1` |
| C2 POL | 970031 | Dorado | Verde | `SUBIR-rusty-decloc-c2` |
| C3 POL | 970032 | Plateado | Gris oscuro (el founder dice gris oscuro; la foto de Rusty se ve con leve degradé: seguir al founder, `gris-oscuro`, sin `gradient`) | `SUBIR-rusty-decloc-c3` |

**ML (2026-11-25, leído de la página, no por API):** un item simple por color. **C1: `MLA2322131483`, $138.912, stock 1 ("¡Última disponible!"), `variation_code` NULL**, título "Anteojos Lentes De Sol Polarizados Rusty Decloc Gafas Unisex C1 - Marron C1 - Dorado"; forma "Ovalada", varilla "Acetato" en ML. **C2 y C3: rastrear por SKU 970031 y 970032 con la API cuando vuelva Supabase.** Seed 219 ya lleva C1 completado y C2/C3 con placeholders.
**Para la carga:** enums como el Zubia pero `frame_shape: "ovalado"` (el de EYSY); `plateado` cae al fallback de label; `weight_grams: 20.1` (del founder); `hide_prescription_faq: true`; scale override arrancando sin entry y mirando el grid; fotos: `pnpm fotos:subir --slug rusty-decloc --dir marketing/placas-ml/SUBIR-rusty-decloc-c1/web --sufijo -c1` (con medidas) y c2/c3 con `--solo perfil,frente`.
**Pendientes del founder:** publicar en ML; GTIN por variante.

### 4. Rusty Xold SIENNA/902 LTD (sol, redondo, unisex, G-Flex, marrón degradé): 6ª variante del producto EXISTENTE `rusty-xold`
**Estado (2026-11-25):** kit de ML listo (`marketing/placas-ml/SUBIR-rusty-xold-sienna`: 01 perfil, 02 frente, 03 callouts, 04 medidas, 06 garantía; web: perfil, frente, medidas). **Seed 220 escrito como BORRADOR NO APLICABLE** (`supabase/seeds/220_rusty_xold_sienna.sql`, con `seo-strategist` + `catalog-loader`; placeholders `__PRECIO_CENTS__`, `__STOCK__`, `__MLA_ITEM__`, `__VARIATION__` sin comillas). Copy de ML en `marketing/placas-ml/PUBLICACION-rusty-xold-sienna.md`.
**Datos del founder:** SKU 126420, `SIENNA/902 LTD`, armazón marrón brillo transparente, lente marrón degradé, color y lente "como el Vulk Yamain Sienna". **NO polarizada** (el código no dice POL: confirmar). Medidas del Xold ya cargadas (50-20-145, alto 48, ancho 138, 21,5 g).
**Fotos (FINAL 2026-11-26):** fábrica con color ajustado al real (caramelo translúcido), logos intactos; kit regenerado 09:58. Falta publicar en ML (SKU 126420 no figura al 2026-11-26).
**ML:** falta el link/MLA; rastrear por SKU 126420 con la API cuando vuelva Supabase.
**Decisiones del seed:** `frame_color` `marron-brillo` (los dos agentes discreparon con `marron-transparente`; se siguió el precedente Deserve Sienna), `lens_color` `marron-degrade`, `lens_treatment ['gradient']` en la variante, producto mixto 4 polarizadas + 2 sin polarizar, meta_title `Anteojos de Sol Rusty Xold | 6 Colores, UV400`, frase de vuelta en Blinded, imágenes sort 11-12 y medidas a 99, scale override 1.05 perfil / 1.0 frente de partida. NO se afirma graduación (sin confirmación): revisar tras el SELECT del copy viejo.
**Pendientes del founder:** confirmar que no es polarizada; publicar en ML (o avisar); GTIN; ver si el color le gusta.

---

## Ya cargadas (historial)
Ver `supabase/CLOUD_APPLIED.md`. Última carga antes del bloqueo: seed 216, Vulk Reporter MBLU (commit `c56ae7f`, 2026-11-21).
