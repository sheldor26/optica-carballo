-- ============================================
-- Seed 101: Rusty Ardigan SOL — redondo unisex, G-Flex, 4 colorways (las 4 polarizadas)
-- Fecha: 2026-08-26
-- ============================================
-- Séptimo producto del cruce `pnpm ml:faltantes`. **22 ventas**.
--
-- ⚠️ EL CRUCE DECÍA 5 COLORES Y 24 UNIDADES. SON 4 Y 20. **Tercera vez** que pasa (Zion seed 98,
-- Cinema seed 99, y ahora éste): ya no es anécdota, es un bug con reproducción confiable del script.
-- Patrón: un item multi-variación más publicaciones simples que comparten el pozo, y el multi NO
-- expone `user_product_id` a nivel padre, sólo dentro de cada variación.
-- Acá la gemela es MLA3869008036 (marrón transparente, UP MLAU429563778, mismo pozo que la variación
-- 183973872291). No se mapea: 22 ventas contra 0, health 0,9 contra ninguna, 16 fotos contra 3. Y el
-- desempate importa porque `syncStockFromMLItem` sincroniza `price_cents` además de `stock_qty`: la
-- publicación mapeada le dicta el precio al sitio.
--
-- Se mapea el multi-variación MLA1866498736 con los 4 `variation_code` numéricos.
--
-- 📏 MEDIDAS: 145 / 52 x 51 / 19 / 140 mm — pasadas por el founder (regla dura 7).
-- Geometría: 52x2 + 19 = 123 ≤ 145. ✓
-- ML no declara NINGUNA medida para este modelo, así que no había ni con qué comparar. Sus placas
-- viejas decían varilla 133 y numag.com.ar publicaba 140: se contradecían justo ahí, y el founder
-- confirmó **140**. Otra vez la placa vieja erraba, cuarta de cuatro (Malice, Bruice, Cinema, Ardigan).
-- Su "alto total" es del FRENTE, no del lente (ver seed 100): la descripción dice "alto total 51 mm".
--
-- ⚖️ PESO: **17,3 g, y SÍ se carga.** La regla dura 7 es una lista negra de MEDIDAS; dice literal
-- *"Material, peso, color, precio y stock sí se pueden tomar de esas fuentes"*. Sale de las placas
-- viejas del founder. Precedentes en el propio catálogo: seed 70 (Raven, 26 g de ML), seed 80 (Nova,
-- 35,8) y seed 77 (The Take, 18). Los seeds 93-100 fueron a PESOS_A_MEDIR.md porque NINGUNA fuente
-- daba el dato, no porque la fuente estuviera vetada. **El Ardigan es el primero de la tanda 93-101
-- que NO entra a esa lista.**
-- ✅ Peso **confirmado por el founder el 2026-08-26**.
-- ⚠️ Y menos mal que se verificó contra la base antes de escribir nada: **NO es el más liviano del
-- catálogo**. El ranking real de sol es Spell 12,6 · Biller 13 · Dearly 17,3 · **Ardigan 17,3**. La
-- sugerencia original comparaba sólo contra el Le Groupie (20 g) y habría publicado un superlativo
-- falso. Lo que SÍ es verdad y quedó en el callout: **es el más liviano de los redondos de Rusty**
-- (Ardigan 17,3 · Misty 18 · Xold 21,5 · Blinded 22,7 · Zion 26,9 · Dapper 31 · Etiquet 32,8).
--
-- 🔵 FORMA `redondo` — **confirmado por el founder el 2026-08-26**, aunque ML declare "Anteojos
-- Ovalados". Ya había tres razones antes de preguntarle:
--   1. Precedente ya cerrado por el founder: el Zion tenía el mismo conflicto (ML decía "Ovalada") y
--      él confirmó redondo el 2026-08-25. Su criterio registrado: "el sitio es el que manda".
--   2. La silueta es panto con puente tipo llave, la misma del Vulk Cinema (seed 99, `redondo`).
--   3. **Argumento de código**: `FRAME_SHAPE_LABELS` de `product-attributes.tsx` no tenía la clave
--      `ovalado`, así que cargarlo así hacía desaparecer la fila "Forma" EN SILENCIO. Se descubrió
--      revisando esto y se arregló en el mismo turno — el bug ya afectaba a `vulk-nova` y
--      `vulk-clems-receta` (ovalado) y a `vulk-biller` (hexagonal), cargados hace meses.
-- El título de ML no desempataba: dice "Lentes Anteojos De Sol Rusty Ardigan Polarizadas Gafas Moda",
-- sin mencionar la forma. Lo cerró el founder.
--
-- 🏷️ SKUs Y CÓDIGOS REALES — pasados por el founder el 2026-08-26 desde el catálogo de Rusty:
--   194290  SBLK/DRT25 POL          negro brillo
--   194291  SDEMI-SBLK/DRT02 POL    carey
--   194292  D.BROWN-MBLK/DRT04 POL  marrón transparente
--   194293  LPINK-MBLK/DRT03 POL    rosa transparente
-- Ninguna publicación de ML los declaraba. El producto se cargó primero con SKUs de casa
-- (ARDIGAN-SDEMI etc.) y se reemplazaron con un UPDATE explícito el mismo día, ANTES de que hubiera
-- ventas — re-correr el seed con el SKU cambiado NO actualiza, crea filas nuevas, porque
-- `ON CONFLICT (sku)` es la llave de idempotencia.
--
-- ⚠️ `model_code` se carga SIN el sufijo " POL" que trae el código de fábrica. Dos razones: el badge
-- POLARIZADO ya está al lado diciendo lo mismo, y el largo importa — el Rusty Yau rompió el layout de
-- la lista de variantes a 3 líneas con un code de 21 caracteres más el badge (MISTAKES.md
-- 2026-05-31). Sin " POL" el más largo acá queda en 18 (`D.BROWN-MBLK/DRT04`). El código completo con
-- POL está en esta cabecera para trazabilidad.
--
-- ⚠️ TRAMPA DEL POLARIZADO, agravada respecto del Rew: `isPolarizedVariant` matchea `\bPOL\b` sobre
-- `model_code`, y acá NO hay model_code en ninguna. Sin flags explícitos el producto desaparece de
-- las dos facetas. Como son **4 de 4**, van LOS DOS y es honesto:
--   · `"polarized": true` en cada variante → habilita `/anteojos-de-sol/polarizados` (por VARIANTE)
--   · `"polarized"` dentro de `lens_treatment` → habilita `/anteojos-de-sol/rusty/polarizados`
--     (por PRODUCTO). El Rew no entra a ésta porque era 1 de 2; el Ardigan sí.
--
-- 📸 FOTOS de la galería de ML (el Ardigan NO está en rustyoptical.com — probé ficha y buscador),
-- bajadas por `GET /pictures/{id}` a 1200 px y normalizadas con `pnpm placas --solo 1,2`.
-- Las 8 abiertas y verificadas una por una antes de asignarlas (perfil/frente venían invertidos en
-- el Blozon y el Cinema). Las placas viejas del founder (`-03/-07/-11/-15` callouts y
-- `-04/-08/-12/-16` medidas) NO se usan.
--
-- SEO — EL ARDIGAN NO TIENE CARRIL DE FORMA, y es un dato, no un fracaso. Los tres carriles de
-- redondo están cerrados: `lentes de sol redondos` (320) es del Blinded, `anteojos de sol redondos`
-- (210) es del Zion, y redondo+polarizado también es del Zion, cuyo title literal es "Anteojos de Sol
-- Rusty Zion Redondos Polarizados". El Ardigan es atributo por atributo el gemelo del Zion (Rusty,
-- sol, redondo, unisex, policarbonato, 4/4 polarizadas): decir "Redondos Polarizados" sería la misma
-- cadena cambiando una palabra. Por eso **"Redondos" sale del title y del H1** y baja a copy y alt.
-- Carril que toma: **`lentes de sol polarizados` (260/mes, dif 12), libre entre los Rusty**, más el
-- branded `anteojos de sol rusty ardigan` (dif 4, existe en autocompletado). NO toma
-- `anteojos de sol polarizados` (170/10) porque esa ya es de la FACETA `/anteojos-de-sol/polarizados`
-- y sería competir contra nosotros mismos.
-- Descartados con datos: carey (40/dif 34, y es 1 de 4 colorways), unisex (20/dif 36), transparentes
-- (110/dif 21 pero 2 de 4 = 50%, cae por el precedente del Vartis), degradé (no existe el carril).
--
-- 🔩 BISAGRAS METÁLICAS CON FLEX — **confirmado por el founder el 2026-08-26** con el armazón en la
-- mano, así que se afirma. La platina metálica se ve además en las fotos `-01`, `-05`, `-09` y `-13`.
-- ⚠️ El flex se atribuye SIEMPRE al SISTEMA DE BISAGRAS, nunca al material: "G-Flex" no autoriza a
-- decir que el armazón sea flexible (regla del founder, barrido pendiente sobre 51 productos en
-- BACKLOG.md). La redacción de este seed lo respeta: el sujeto de la frase es la bisagra.
-- Queda pendiente lo mismo para el **Rew** (seed 100), cuya placa dice igual pero no fue confirmado.
--
-- ⚠️ DOS HALLAZGOS QUE NO SON DE ESTA CARGA PERO SALIERON ACÁ:
--   1. **Colisión viva entre Blinded y Zion.** SEO_STRATEGY le asigna al Blinded el carril
--      `lentes de sol redondos`, pero su meta_title real (seed 68) es "Anteojos de Sol Rusty Blinded
--      Redondos", o sea que ataca la keyword del Zion. Dos fichas de la misma marca peleando la misma
--      cadena, hoy, en producción. Fix de una línea. Anotado en BACKLOG.
--   2. **La faceta `redondo` no existe** y con el Ardigan Rusty tiene 3 redondos de sol. Son 16
--      productos redondos huérfanos y 530 búsquedas/mes que ninguna página consolida. Decisión del
--      founder en DATOS_PENDIENTES.
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-ardigan', 'Rusty Ardigan',
  'Anteojos de sol Rusty Ardigan: redondos unisex de G-Flex, con puente tipo llave y bisagras metálicas con sistema flex. Pesan 17,3 g. Lente de policarbonato polarizada, con 100% protección UV (UV400, categoría 3). Los cuatro colores polarizan.',
  E'Los **Rusty Ardigan** son **anteojos de sol redondos, unisex**, con frente y patillas de **G-Flex**, puente tipo llave y **bisagras metálicas con sistema flex**. Pesan **17,3 g**.\n\n**Los cuatro colores son polarizados.** La lente es de policarbonato, con **100% protección UV (UV400) y categoría 3**, y el filtro polarizado corta los reflejos del asfalto, del agua y de la nieve. En los cuatro la lente es degradé: más oscura arriba y más clara abajo.\n\nMedidas: frente 145 mm · lente 52 mm de ancho · alto total 51 mm · puente 19 mm · varilla 140 mm.\n\nDisponible en 4 colores:\n\n• **Carey, lente sepia degradé.**\n• **Negro brillo, lente gris oscuro degradé.**\n• **Marrón transparente, lente verde degradé.**\n• **Rosa transparente, lente gris oscuro degradé.**\n\nEn los redondos de Rusty, el Ardigan es el liviano de G-Flex: el **Zion** es el de patillas de metal con terminales de acetato, y el **Blinded** el otro redondo de la marca.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "redondo",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400", "polarized"],
    "lens_category": 3,
    "gender": "unisex",
    "weight_grams": 17.3,
    "hinge_system": "flex",
    "measurements": {"frame_width_mm": 145, "lens_width_mm": 52, "lens_height_mm": 51, "bridge_mm": 19, "temple_length_mm": 140},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-09-25",
    "callouts": [
      {"type": "info", "position": "top", "title": "Redondo unisex de G-Flex, 17,3 g", "body": "Frente y patillas de G-Flex, con puente tipo llave. Las bisagras son metálicas y llevan sistema flex. Es el más liviano de los redondos de Rusty: el Zion pesa 26,9 g."},
      {"type": "tip", "position": "middle", "title": "Los cuatro colores son polarizados", "body": "A diferencia de otros modelos donde el filtro polarizado está sólo en algunas variantes, acá lo llevan los cuatro. Corta los reflejos del asfalto, del agua y de la nieve. Aparte, la lente bloquea el 100% de la radiación UV."},
      {"type": "recommendation", "position": "bottom", "title": "Policarbonato UV400 categoría 3", "body": "Lente de policarbonato con 100% de protección UVA y UVB, categoría 3, pensada para sol fuerte. Categoría 3 no sirve para manejar de noche. Si dudás cuál te conviene, escribinos por WhatsApp y te asesoramos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1866498736", "MLA3869008036"], "imported_at": "2026-08-26"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Rusty Ardigan Polarizados | Óptica Carballo',
  'Anteojos de sol Rusty Ardigan: redondos unisex de G-Flex, 17,3 g. Lente de policarbonato polarizada UV400 categoría 3. Los 4 colores polarizan. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Item MULTI-VARIACIÓN: las 4 con `variation_code` numérico real. Precio uniforme, así que el
-- JSON-LD emite `Offer` simple (no el `AggregateOffer` del Rew).
-- `sort_order 1` = carey, la de más stock (8 de 20): define la foto primaria del grid, el `sku` del
-- JSON-LD y la card en /polarizados.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-ardigan'), '194291',
   '{"frame_color":"carey","temple_color":"negro","lens_color":"sepia-degrade","model_code":"SDEMI-SBLK/DRT02","polarized":true}'::jsonb,
   9163000, 8, true, 1, 'MLA1866498736', '183973872289'),
  ((SELECT id FROM public.products WHERE slug='rusty-ardigan'), '194290',
   '{"frame_color":"negro-brillo","temple_color":"negro","lens_color":"gris-oscuro-degrade","model_code":"SBLK/DRT25","polarized":true}'::jsonb,
   9163000, 4, true, 2, 'MLA1866498736', '183973872287'),
  ((SELECT id FROM public.products WHERE slug='rusty-ardigan'), '194292',
   '{"frame_color":"marron-transparente","temple_color":"negro","lens_color":"verde-degrade","model_code":"D.BROWN-MBLK/DRT04","polarized":true}'::jsonb,
   9163000, 4, true, 3, 'MLA1866498736', '183973872291'),
  ((SELECT id FROM public.products WHERE slug='rusty-ardigan'), '194293',
   '{"frame_color":"rosa-transparente","temple_color":"negro","lens_color":"gris-oscuro-degrade","model_code":"LPINK-MBLK/DRT03","polarized":true}'::jsonb,
   9163000, 4, true, 4, 'MLA1866498736', '183973872293')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 9 imágenes, con `medidas.jpg` (variant_id NULL, sort 99). "polarizada" va en las 8: son 4 de 4.
-- "patillas negras" sólo donde hay contraste real con el frente (carey, marrón y rosa); en el negro
-- brillo es redundante.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-ardigan'), (SELECT id FROM public.product_variants WHERE sku='194291'),
   'rusty-ardigan/perfil-carey.jpg', 'Anteojos de sol Rusty Ardigan redondos unisex vista lateral, armazón carey patillas negras lente sepia degradé polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-ardigan'), (SELECT id FROM public.product_variants WHERE sku='194291'),
   'rusty-ardigan/frente-carey.jpg', 'Anteojos de sol Rusty Ardigan redondos unisex vista frontal, armazón carey patillas negras lente sepia degradé polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-ardigan'), (SELECT id FROM public.product_variants WHERE sku='194290'),
   'rusty-ardigan/perfil-negro.jpg', 'Anteojos de sol Rusty Ardigan redondos unisex vista lateral, armazón negro brillo lente gris oscuro degradé polarizada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-ardigan'), (SELECT id FROM public.product_variants WHERE sku='194290'),
   'rusty-ardigan/frente-negro.jpg', 'Anteojos de sol Rusty Ardigan redondos unisex vista frontal, armazón negro brillo lente gris oscuro degradé polarizada', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-ardigan'), (SELECT id FROM public.product_variants WHERE sku='194292'),
   'rusty-ardigan/perfil-marron.jpg', 'Anteojos de sol Rusty Ardigan redondos unisex vista lateral, armazón marrón transparente patillas negras lente verde degradé polarizada', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-ardigan'), (SELECT id FROM public.product_variants WHERE sku='194292'),
   'rusty-ardigan/frente-marron.jpg', 'Anteojos de sol Rusty Ardigan redondos unisex vista frontal, armazón marrón transparente patillas negras lente verde degradé polarizada', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-ardigan'), (SELECT id FROM public.product_variants WHERE sku='194293'),
   'rusty-ardigan/perfil-rosa.jpg', 'Anteojos de sol Rusty Ardigan redondos unisex vista lateral, armazón rosa transparente patillas negras lente gris oscuro degradé polarizada', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-ardigan'), (SELECT id FROM public.product_variants WHERE sku='194293'),
   'rusty-ardigan/frente-rosa.jpg', 'Anteojos de sol Rusty Ardigan redondos unisex vista frontal, armazón rosa transparente patillas negras lente gris oscuro degradé polarizada', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='rusty-ardigan'), NULL,
   'rusty-ardigan/medidas.jpg', 'Esquema técnico de medidas Rusty Ardigan: frente 145mm, lente 52mm de ancho, alto total 51mm, puente 19mm, varilla 140mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
