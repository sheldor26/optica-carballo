-- ============================================
-- Seed 111: Rusty The Take — 2 colores nuevos y corrección del honesty check (1/1 → 1/3 polarizado)
-- Fecha: 2026-09-22
-- ============================================
-- Suma 2 colorways al `rusty-the-take` cargado en el seed 77 (sólo MBLK/S10 POL).
--   129237 L.GREY-SBLK/L.BROWN · armazón gris transp. / patillas NEGRO BRILLO / lente marrón degradé
--          · NO polarizada · $84.346 · 3 u · MLA2116075161
--   129236 L.GREY-MBLK/G.GREEN · armazón gris transp. / patillas NEGRO MATE / lente verde degradé
--          · NO polarizada · $84.346 · 3 u · MLA2116100953
-- Ninguna de las dos tiene antirreflex (dato del founder, confirmado dos veces).
--
-- ⚠️ EL FOUNDER PUBLICÓ **DOS ÍTEMS SIMPLES SEPARADOS**, no la multivariante que había anunciado.
-- Verificado leyendo el item: `MLA2116100953` (verde) devuelve `variations: []`. Se buscó la del
-- marrón entre las publicaciones del vendedor y apareció como otro item simple, `MLA2116075161`.
-- Las dos `catalog_listing: false`, tradicionales. `mercadolibre_variation_code` NULL en las dos.
--
-- ⚠️⚠️ FOTOS DEL FABRICANTE FÍSICAMENTE CRUZADAS ENTRE CARPETAS — el founder avisó de entrada y
-- se confirmó abriendo las 4: la carpeta que rustyoptical.com marcaba "129237" tenía la lente
-- VERDE, y la "129236" la MARRÓN. Se usó el mapeo del founder, no el del sitio del fabricante.
--
-- ⚠️⚠️ PATILLAS: DOS CORRECCIONES DEL FOUNDER SOBRE EL MISMO DATO, Y ERA EVITABLE.
-- Primero aclaró "negro mate" (no estaba puesto), después corrigió que la del MARRÓN es en
-- realidad **negro BRILLO**. El dato ya estaba en el propio model code del fabricante:
-- **SBLK = Shiny Black, MBLK = Matte Black**, la misma convención que usan Bad Card, Dunsert,
-- Bruice y Harry en este catálogo. `L.GREY-SBLK/L.BROWN` (129237) → negro BRILLO;
-- `L.GREY-MBLK/G.GREEN` (129236) → negro MATE. Y la propia publicación del founder lo confirma en
-- el título: "...Patillas N. Brillo..." (129237) / "...Patillas Negro Mate..." (129236).
-- Entrada en MISTAKES.md con la regla: decodificar SIEMPRE SBLK/MBLK del model code.
-- `temple_color` se carga en el jsonb por completitud (precedente Ardigan seed 101), pero
-- **no se renderiza en ningún lado del frontend** (grep sin resultados) — el único canal real de
-- este dato es la prosa de la descripción, y ahí sí está.
--
-- 🔺 FORMA: sin re-verificar. Es el mismo modelo/molde ya resuelto en el seed 77 (`aviador`
-- doble puente); sólo cambia color de armazón/patilla/lente entre colorways.
--
-- ⚠️⚠️⚠️ HONESTY CHECK: EL PRODUCTO PASA DE 1/1 A 1/3 POLARIZADO, Y HABÍA UNA DEUDA VIEJA
-- ESCRITA EN `SEO_STRATEGY.md` DESDE JUNIO QUE SE VOLVIÓ FALSA CON ESTA CARGA.
-- El bloque de The Take en `SEO_STRATEGY.md:337` decía textual **"1/1 polarizado → SÍ se afirma
-- 'Polarizado' en title/H1"**, y el bloque del Rusty Yeah (`:357`) lo citaba como comparación
-- ("The Take... 1/1 pol afirmado"). Los DOS quedaron corregidos en este mismo commit: ahora dice
-- 1/3, y el criterio pasa a ser el mismo que Rew (1/2), Dunsert (1/3) y Bad Card (2/6) —
-- **"Polarizado" NO se afirma para el modelo**.
-- ✅ Buena noticia: el campo REAL (`meta_title`, `lens_treatment` de producto) nunca llegó a decir
-- "Polarizado" — sólo el documento aspiracional de SEO_STRATEGY lo prometía. La `description` y
-- la `short_description` sí lo afirmaban en prosa ("polarizados", "Versión: MBLK/S10 — ... lente
-- gris polarizada") y se reescribieron completas, listando los 3 colores con el callout de
-- honestidad ya usado en Bruice/Vriviant/Bad Card: "el polarizado lo tiene sólo uno de los tres".
-- `lens_treatment` de producto queda `["uv400"]` (ya estaba así, no cambia); el flag `polarized`
-- sigue únicamente en la variante MBLK/S10 POL.
-- Consecuencia de faceta: sigue entrando a `/anteojos-de-sol/polarizados` (por variante, la POL
-- mantiene stock) y NO a `/anteojos-de-sol/rusty/polarizados` (por producto, ya no calificaría).
--
-- 📸 FOTOS: perfil + frente por color, ya reorganizadas con el mapeo correcto. Sin placa de
-- medidas nueva: el producto ya tenía `medidas.png` (sort 99) del seed 77, y las medidas son del
-- MOLDE, no del color — se subieron 2 placas de medidas de más por error y se borraron del bucket
-- antes de referenciarlas (mismo patrón del Vriviant/Bruice: la placa de medidas es del modelo).
--
-- `is_featured`: sin cambios (ya era false).
-- ============================================

BEGIN;

UPDATE public.products SET
  description = E'Los **Rusty The Take** son **lentes de sol aviador de doble puente, unisex**. El **frente es de G-Flex** con bisagras flex customizadas y las **patillas de acetato**.\n\nLa lente es de **policarbonato**, con **100% protección UV (UV400, categoría 3)**. Pesan **18 g**.\n\nMedidas: frente 136 mm · lente 51 mm de ancho × 46 mm de alto · puente 16 mm · varilla 145 mm.\n\nDisponible en 3 colores:\n\n• **Negro mate, lente gris** — **polarizada**.\n• **Gris transparente con patillas negro brillo, lente marrón degradé** — no polarizada.\n• **Gris transparente con patillas negro mate, lente verde degradé** — no polarizada.\n\n**Ojo con el filtro polarizado: lo tiene sólo uno de los tres colores.** El polarizado corta el reflejo del asfalto, del agua y de la nieve — es el que resuelve el encandilamiento manejando de día o cerca del agua. Los tres filtran el 100% de la radiación UV, pero sólo el negro mate suma ese filtro extra. Ninguna de las tres tiene antirreflex.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante. ¿Lo querés con tu graduación? Mirá la versión de receta del Rusty The Take.',
  short_description = 'Lentes de sol Rusty The Take: aviador de doble puente unisex, con frente de G-Flex y patillas de acetato. Policarbonato UV400 categoría 3, 18 g. Disponible en 3 colores, uno de ellos con lente polarizada.',
  attributes = jsonb_set(
    jsonb_set(attributes, '{lens_treatment}', '["uv400"]'::jsonb),
    '{callouts}',
    '[
      {"type": "info", "position": "top", "title": "Aviador doble puente, ultraliviano (18 g)", "body": "Frente de G-Flex con bisagras flex customizadas y patillas de acetato. El acabado de las patillas cambia según el color: negro brillo en la de lente marrón, negro mate en la de lente verde."},
      {"type": "warning", "position": "middle", "title": "El polarizado lo tiene sólo uno de los tres colores", "body": "El negro mate con lente gris es polarizado y corta el reflejo del asfalto, del agua y de la nieve. Los otros dos colores no lo traen. Los tres filtran el 100% de la radiación UV: la diferencia es sólo ese filtro extra. Ninguno tiene antirreflex."},
      {"type": "recommendation", "position": "bottom", "title": "¿Lo necesitás con graduación?", "body": "Este modelo también está como armazón de receta. Si dudás cuál te conviene, escribinos por WhatsApp y te asesoramos."}
    ]'::jsonb
  ),
  meta_description = 'Lentes de sol Rusty The Take: aviador de doble puente de G-Flex, 18 g. Uno de los tres colores es polarizado. Envío a todo el país y garantía.',
  updated_at = now()
WHERE slug = 'rusty-the-take';

-- Items simples → `mercadolibre_variation_code` NULL en las dos.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-the-take'), '129237',
   '{"frame_color":"gris-transparente","temple_color":"negro-brillo","lens_color":"marron-degrade","model_code":"L.GREY-SBLK/L.BROWN","polarized":false}'::jsonb,
   8434600, 3, true, 2, 'MLA2116075161', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-the-take'), '129236',
   '{"frame_color":"gris-transparente","temple_color":"negro-mate","lens_color":"verde-degrade","model_code":"L.GREY-MBLK/G.GREEN","polarized":false}'::jsonb,
   8434600, 3, true, 3, 'MLA2116100953', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-the-take'), (SELECT id FROM public.product_variants WHERE sku='129237'),
   'rusty-the-take/perfil-129237.jpg', 'Lentes de sol Rusty The Take aviador de doble puente unisex vista lateral, armazón gris transparente con patillas negro brillo y lente marrón degradé', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-the-take'), (SELECT id FROM public.product_variants WHERE sku='129237'),
   'rusty-the-take/frente-129237.jpg', 'Lentes de sol Rusty The Take aviador de doble puente unisex vista frontal, armazón gris transparente con patillas negro brillo y lente marrón degradé', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-the-take'), (SELECT id FROM public.product_variants WHERE sku='129236'),
   'rusty-the-take/perfil-129236.jpg', 'Lentes de sol Rusty The Take aviador de doble puente unisex vista lateral, armazón gris transparente con patillas negro mate y lente verde degradé', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-the-take'), (SELECT id FROM public.product_variants WHERE sku='129236'),
   'rusty-the-take/frente-129236.jpg', 'Lentes de sol Rusty The Take aviador de doble puente unisex vista frontal, armazón gris transparente con patillas negro mate y lente verde degradé', 2000, 1333, 5, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, updated_at=now();

COMMIT;
