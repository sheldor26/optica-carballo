-- ============================================
-- Seed 100: Rusty Rew SOL — rectangular unisex, G-Flex, 2 colorways (1 de 2 polarizada)
-- Fecha: 2026-08-26
-- ============================================
-- Sexto producto del cruce `pnpm ml:faltantes`. **37 ventas** en su publicación principal: el mejor
-- ratio ventas/stock de la lista de faltantes.
--
-- 2 COLORWAYS, 10 UNIDADES, cada una publicada DOS veces con el mismo `user_product_id`:
--   · MBLK/S10     stock 8  $88.349  POLARIZADA      UP MLAU381535988   → mapea MLA2471383742
--   · MBLK/300 CE  stock 2  $82.514  espejada, NO pol UP MLAU3055588866 → mapea MLA2025455766
--
-- ⚠️ EL DESEMPATE DE LA 300 CE NO FUE POR VENTAS. Las gemelas tienen 1 y 0, que no es señal. Se
-- eligió MLA2025455766 por salud de la publicación: **health 0,88 contra ninguna, actualizada el
-- 2026-08-27 contra el 2026-07-31, y 6 fotos contra 1**. Importa porque `syncStockFromMLItem`
-- sincroniza `stock_qty` **y `price_cents`**: la publicación mapeada es la que le dicta el precio al
-- sitio. Las gemelas sin vincular no molestan (devuelven `no_mapped_variants`) y el stock igual baja
-- en las dos porque comparten pozo.
--
-- 📏 MEDIDAS: 146 / 55 x 47 / 19 / 145 mm — pasadas por el founder (regla dura 7).
-- Geometría: 55x2 + 19 = 129 ≤ 146. ✓
-- Nota: su "alto total" es del FRENTE, no del lente — la placa dibuja esa flecha abarcando todo el
-- armazón. Por eso la descripción dice "alto total 47 mm" y NO "lente 55 × 47". El campo se llama
-- `lens_height_mm` por herencia, pero la etiqueta que renderiza el sitio es "Altura total", así que
-- el dato queda coherente con lo que ve el comprador. (Se corrigió el mismo texto en el seed 99.)
-- ML y la placa vieja del founder coincidían en 55-19-145 y él lo confirmó; el ancho total (146) y el
-- alto (47) no los daba ninguna fuente.
--
-- ⚖️ PESO: ninguna fuente lo da. Sin `weight_grams` → PESOS_A_MEDIR.md.
--
-- 🏷️ SKUs: **ninguna de las 4 publicaciones de ML declara `SELLER_SKU`** y el founder no los tenía a
-- mano. Van SKUs de casa con la convención ya usada en CINEMA-TERRACOTA / KATLEEN-MDEMI /
-- SPELL-LGREY. Si aparecen los reales del catálogo de Rusty, cambiarlos con un UPDATE explícito
-- (`UPDATE product_variants SET sku='...' WHERE sku='REW-MBLK-S10'`) y actualizar este archivo:
-- re-correr el seed con el SKU cambiado NO actualiza, crea fila nueva, porque `ON CONFLICT (sku)`
-- es la llave de idempotencia. Conviene hacerlo antes de que haya ventas en el sitio.
--
-- HONESTIDAD — 1 DE 2, DOS VECES:
--   · Sólo la MBLK/S10 polariza → NO se afirma "polarizados" del modelo en title/H1/short_description
--     (criterio Le Groupie 1/4 y Blozon 3/4, NO el Zion/Cinema donde eran todas). Callout `warning`.
--   · Sólo la 300 CE es espejada → simétricamente, tampoco se afirma "espejados".
--   · `lens_treatment` del producto queda `["uv400"]`, sin `polarized`.
--
-- ⚠️ TRAMPA VERIFICADA EN CÓDIGO: `isPolarizedVariant` (lib/catalog/polarized.ts) matchea el regex
-- `\bPOL\b` sobre `model_code`, y el código de esta colorway es **MBLK/S10, sin "POL"**. O sea que
-- `"polarized": true` en los attributes de la variante es **OBLIGATORIO**: sin eso el Rew desaparece
-- en silencio de `/anteojos-de-sol/polarizados` y nadie se entera.
-- Consecuencia esperada y correcta: entra a `/anteojos-de-sol/polarizados` (criterio por VARIANTE,
-- mostrando sólo la S10) pero NO a `/anteojos-de-sol/rusty/polarizados` (criterio por PRODUCTO). No
-- se fuerza metiendo `polarized` al producto: eso haría que el subtítulo bajo el H1 diga
-- "polarizados" de un modelo que polariza a medias.
--
-- 🌈 EL ESPEJADO CAMBIA DE COLOR SEGÚN EL ÁNGULO. Medido sobre las fotos: de frente RGB (228,233,196)
-- = tono 68°, dorado-verdoso; de perfil (156,165,164) = tono 178°, celeste. Todas las fuentes lo
-- llaman "celeste" (el título de ML y la placa vieja del founder), pero la foto principal se ve
-- dorada. La placa vieja se refuta a sí misma: la burbuja dice "LENTES ESPEJADAS CELESTE" apuntando a
-- un lente oro-lima. Se cargó `espejado-dorado` (lo que ve el comprador de frente) y el viraje se
-- explica en la ficha, que además es argumento de venta: un espejado que vira es más caro que uno
-- plano. El `model_code` conserva el "CE" del fabricante para trazabilidad.
-- ⚠️ `espejado-dorado` es clave NUEVA en `lib/catalog/variant-label.ts`. Se agregó junto con
-- `espejado-rojo`, que el Blozon venía usando SIN entrada y renderizaba "Espejado Rojo" por el
-- fallback de title-case. Las dos necesitan deploy para verse.
--
-- 🔩 BISAGRAS METÁLICAS CON FLEX — las metálicas se ven en las fotos (la platina plateada en el
-- arranque de la varilla, en s10-01, 300ce-01 y s10b-02), y el **flex lo confirmó el founder el
-- 2026-08-26** con el armazón en la mano. Se afirma, siempre atribuido a la BISAGRA y nunca al
-- material: "G-Flex" no autoriza a decir que el armazón sea flexible (regla del founder, barrido
-- pendiente sobre 51 productos en BACKLOG.md).
-- `temple_material` NO se carga: ML declara el material del frente y no el de las patillas
-- (precedente Bruice, "mejor vacío que inventado"). Pendiente del founder.
--
-- 📸 FOTOS de las galerías de ML (el modelo NO está en rustyoptical.com — probé ficha y buscador),
-- bajadas por `GET /pictures/{id}` y normalizadas con `pnpm placas --solo 1,2`.
-- ⚠️ Los JPG crudos son de DOS FAMILIAS distintas: los perfiles vienen ~2.3:1 pero los frentes uno
-- 3:1 y el otro 1:1. Subirlos crudos habría dado un desajuste de escala en la grilla de ~1.0 contra
-- ~1.5 (sub-regla 15). Pasarlos por `pnpm placas` lo elimina de raíz: los 5 quedan 2000×1333 con el
-- anteojo al 92%.
--
-- SEO — EL HALLAZGO QUE HACE VALIOSA ESTA CARGA: `lentes de sol rectangulares` (**320/mes,
-- dificultad 12**) está LIBRE, ningún producto del catálogo la reclama. El Rew es el **primer
-- rectangular de sol de Rusty**: `/anteojos-de-sol/rectangular` pasa de 2 a 3 productos y deja de ser
-- mono-marca, y `/anteojos-de-sol/rusty/rectangular` pasa de 0 a 1 y SALE del `noindex` automático
-- por thin content. Situación opuesta a la del Bruice, que era el tercer aviador y tuvo que irse a
-- branded con volumen 0. El title arranca con "Lentes" y no con "Anteojos" para no competir contra
-- nuestra propia faceta, que ya tiene `anteojos de sol rectangulares` (140).
-- `rusty rew` como branded NO existe en Ubersuggest ni en autocompletado — por eso la primaria es la
-- forma y no el nombre.
--
-- ⚠️ La forma: ML dice "Rectangular" en las dos publicaciones, pero en las fotos parece un wayfarer
-- escuadrado. Se cargó `rectangular` — es la única de las dos que tiene faceta en el sitio, y es lo
-- que declara ML. A confirmar con el founder.
--
-- 💰 PRECIO NO UNIFORME ($88.349 y $82.514) → el JSON-LD emite `AggregateOffer` con lowPrice 82514 /
-- highPrice 88349 / offerCount 2, y el header de la PDP dice "Desde $82.514", que es el precio de la
-- variante con 2 unidades. Precedente ya vivo en Blozon (3 precios) y Le Groupie (2), pero ninguno lo
-- documentó. Nota para el futuro: cuando se agoten las 2 unidades de la 300 CE, el schema colapsa
-- solo a `Offer` simple con price 88349, sin tocar nada.
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-rew', 'Rusty Rew',
  'Anteojos de sol Rusty Rew: rectangulares unisex, frente de G-Flex, bisagras metálicas con sistema flex y lente de policarbonato con 100% protección UV (UV400, categoría 3). De los 2 colores, sólo el negro mate con lente gris oscuro es polarizado.',
  E'Los **Rusty Rew** son **anteojos de sol rectangulares, unisex**, con frente de **G-Flex** y **bisagras metálicas con sistema flex**.\n\nLa lente es de **policarbonato**, con **100% protección UV (UV400) y categoría 3** en los dos colores.\n\nMedidas: frente 146 mm · lente 55 mm de ancho · alto total 47 mm · puente 19 mm · varilla 145 mm.\n\nDisponible en 2 colores:\n\n• **Negro mate, lente gris oscuro** — **polarizada**.\n• **Negro mate, lente espejada** — no polarizada. El espejado cambia de tono según el ángulo: de frente se ve dorado y de costado tira a celeste.\n\n**El filtro polarizado lo tiene sólo el negro mate con lente gris oscuro.** Los dos filtran el 100% de la radiación UV, pero únicamente el polarizado corta los reflejos del asfalto y del agua.\n\nDentro de la línea de sol de Rusty, el Rew es el rectangular. Si venís buscando lentes de sol rectangulares y no te cierra un cuadrado como el Blozon ni un redondo como el Zion, éste ocupa ese lugar.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "rectangular",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "hinge_system": "flex",
    "measurements": {"frame_width_mm": 146, "lens_width_mm": 55, "lens_height_mm": 47, "bridge_mm": 19, "temple_length_mm": 145},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-09-25",
    "callouts": [
      {"type": "info", "position": "top", "title": "Rectangular unisex en G-Flex", "body": "Frente de G-Flex y forma rectangular, de líneas rectas. Las bisagras son metálicas y llevan sistema flex. Dos combinaciones sobre el mismo armazón negro mate: una con lente gris oscuro y otra con lente espejada."},
      {"type": "warning", "position": "middle", "title": "El filtro polarizado lo tiene sólo 1 de los 2 colores", "body": "Únicamente el negro mate con lente gris oscuro es polarizado. El de lente espejada filtra el 100% de la radiación UV igual, pero no corta los reflejos del asfalto ni del agua."},
      {"type": "tip", "position": "bottom", "title": "Por qué la espejada cambia de color", "body": "El espejado es una capa que refleja distinta luz según el ángulo desde el que la mires. De frente tira dorada y de costado se ve celeste. Es propio del tratamiento, no un defecto: las dos fotos de esa versión muestran los dos tonos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2471383742", "MLA1430159109", "MLA2025455766", "MLA1480773407"], "imported_at": "2026-08-26"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Rusty Rew Rectangulares | Óptica Carballo',
  'Anteojos de sol Rusty Rew: rectangulares unisex de G-Flex, lente de policarbonato UV400 categoría 3. Sólo el negro mate es polarizado. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Items SIMPLES los dos → `mercadolibre_variation_code` NULL (patrón Blozon / Le Groupie).
-- La MBLK/S10 va primera: gana por los tres criterios a la vez (8 de 10 unidades, 37 ventas, y es
-- la polarizada). El `sort_order 1` define además el `sku` del JSON-LD y la foto primaria del grid.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-rew'), 'REW-MBLK-S10',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10","polarized":true}'::jsonb,
   8834900, 8, true, 1, 'MLA2471383742', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-rew'), 'REW-MBLK-300CE',
   '{"frame_color":"negro-mate","lens_color":"espejado-dorado","model_code":"MBLK/300 CE","polarized":false}'::jsonb,
   8251400, 2, true, 2, 'MLA2025455766', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Primaria = perfil de la MBLK/S10. La placa de medidas va con variant_id NULL y sort 99.
-- ⚠️ "polarizada" SÓLO en los alt de la S10.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-rew'), (SELECT id FROM public.product_variants WHERE sku='REW-MBLK-S10'),
   'rusty-rew/perfil-s10.jpg', 'Anteojos de sol Rusty Rew rectangulares unisex vista lateral, armazón negro mate lente gris oscuro polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-rew'), (SELECT id FROM public.product_variants WHERE sku='REW-MBLK-S10'),
   'rusty-rew/frente-s10.jpg', 'Anteojos de sol Rusty Rew rectangulares unisex vista frontal, armazón negro mate lente gris oscuro polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-rew'), (SELECT id FROM public.product_variants WHERE sku='REW-MBLK-300CE'),
   'rusty-rew/perfil-300ce.jpg', 'Anteojos de sol Rusty Rew rectangulares unisex vista lateral, armazón negro mate lente espejada dorada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-rew'), (SELECT id FROM public.product_variants WHERE sku='REW-MBLK-300CE'),
   'rusty-rew/frente-300ce.jpg', 'Anteojos de sol Rusty Rew rectangulares unisex vista frontal, armazón negro mate lente espejada dorada', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-rew'), NULL,
   'rusty-rew/medidas.jpg', 'Esquema técnico de medidas Rusty Rew: frente 146mm, lente 55mm de ancho, alto total 47mm, puente 19mm, varilla 145mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
