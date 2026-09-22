-- ============================================
-- Seed 115: Mormaii Storm SOL — envolvente deportivo, hombre, 100% polarizado, 6 colorways
-- Fecha: 2026-09-22
-- ============================================
-- SEGUNDO producto de la marca Mormaii (el primero fue Moorea RX, receta, seed 113). Publicación de
-- ML ya viva: MLA1538614840, `catalog_listing:false` (tradicional, correcto mapearla). $116.024,04
-- uniforme, `WITH_POLARIZED_LENS:Sí` a nivel ítem (las 6 colorways polarizan), `FRAME_SHAPE:Envolvente`
-- (ML acertó esta vez), `FILTRABLE_GENDER:Hombre` (dato real de ML, no default).
--
-- 🕵️ ESTA VEZ EL FOUNDER PIDIÓ EXPLÍCITO QUE DETERMINÁRAMOS NOSOTROS QUÉ FOTO ES QUÉ VARIANTE, sin
-- pasar el mapeo hecho (a diferencia de Moorea, cuyos SKUs ya traían el número de color). Sólo 2 de
-- las 6 variantes de ML declaran el número de colorway en su propio `value_name` (`C05`, `C12`). Las
-- otras 4 se resolvieron cruzando color/lente contra las 12 fotos reales del distribuidor (Dropbox
-- de Interoptica Andina, ZIP bajado con `dl=1`, sin que el founder mueva nada) — **2 de las 4 se
-- confirmaron leyendo el grabado físico "Storm SN col.XX" en la propia foto de perfil**, no sólo por
-- coincidencia de color (método nuevo, documentado en LEARNINGS.md 2026-09-22). Las otras 2
-- (azul translúcido, verde G15 liso) no tenían otro candidato posible entre los 12 colores del
-- distribuidor. Los 6 colores restantes del distribuidor (col01,03,06,08,09,11) no están en esta
-- publicación de ML — no se cargan.
--
-- ⚠️ MEDIDAS — EXCEPCIÓN EXPLÍCITA A LA REGLA DURA 7, DECISIÓN DEL FOUNDER, NO DEL ASISTENTE. El
-- founder mandó el mismo tipo de diagrama que ya se había visto en interoptica.com.ar (57/16/135/124,
-- Base 8). Se le preguntó directo si era su propia medición o la ficha del fabricante — precisamente
-- porque con el Moorea ese mismo tipo de diagrama había acertado calibre/puente/varilla pero errado
-- el ancho (135 vs real 139) y ni declaraba el alto. El founder confirmó que es la ficha del
-- fabricante, no su medición física, y autorizó cargarla igual: "es de la página del fabricante...
-- suele ser más preciso que Vulk/Rusty". Es una excepción consciente del dueño de la regla, no una
-- decisión unilateral. Sigue faltando `lens_height_mm` (alto total): no está ni en la ficha del
-- fabricante ni en ningún otro lado — el objeto `measurements` va con 4 de 5 claves, sin inventar la
-- quinta (sin precedente en el catálogo de measurements parciales; catalog-loader confirmó que el
-- jsonb lo admite sin problema técnico). Lente base curve 8 y categoría 3 confirmados sin reserva
-- (son specs, no medidas físicas).
--
-- 🎯 SEO — `seo-strategist`: slug `mormaii-storm` (sol nunca lleva sufijo, a diferencia de receta).
-- Primaria `lentes de sol mormaii` (90/8) — cabecera de marca ESPECÍFICA DE SOL, libre y de baja
-- dificultad, distinta de la keyword mixta "mormaii lentes" (390/7) que es hub-only. Se descartó
-- "deportivos/envolvente" como primaria pese a ser 100% honesto: 5 Rusty envolventes ya cargados
-- (Esvep, CCCP, Eslav, Sotion, And Now) — 3 de ellos YA usan esa frase en su propio meta_title
-- (deuda preexistente del cluster Rusty, no de esta carga) — así que sería el sexto reclamo del
-- mismo string. Con las 6 colorways 100% polarizadas SÍ se afirma "Polarizados" en title/H1 sin
-- acotar por variante (a diferencia de Rew, que era parcial). Title (57c):
-- `Lentes de Sol Mormaii Storm Polarizados | Óptica Carballo`. H1 = `name` = `Mormaii Storm`.
-- Cero canibalización con Moorea (categorías distintas, modelos distintos, no son "hermanos"
-- sol↔receta del mismo armazón). Storm entra solo a la faceta compartida `/anteojos-de-sol/deportivos`
-- (`frame_shape:envolvente`), profundizándola de 5 a 6 sin competir por título.
--
-- 🏷️ SIN `seller_sku` DE ML EN NINGUNA DE LAS 6 — mismo caso que Rusty Rew (seed 100): SKU de casa
-- con convención `STORM-<COLOR>`, documentado acá y en DATOS_PENDIENTES.md para reemplazar con un
-- UPDATE si el founder pasa los reales. Como es idempotencia por `sku` (`ON CONFLICT`), hacerlo
-- ANTES de que haya ventas si aparecen los códigos reales.
--
-- 🔒 TRAMPA `\bPOL\b` evitada a propósito: los `model_code` de 4 de las 6 variantes no tienen la
-- palabra "POL" (sólo tienen el número de color o nada) — `"polarized":true` EXPLÍCITO en las 6,
-- no se confía en el regex de `isPolarizedVariant` (mismo criterio que Bad Card/Eslav).
--
-- 🔩 SIN `hinge_system`: a diferencia del Moorea (que tuvo el dato "Visyfit" confirmado), acá no hay
-- ninguna fuente que declare el tipo de bisagra de este modelo — no se asume, no se inventa.
--
-- `is_featured` NO: segundo producto de una marca que recién arranca.
-- ============================================

BEGIN;

WITH
  mormaii AS (SELECT id FROM public.brands WHERE slug = 'mormaii'),
  sol     AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM mormaii), (SELECT id FROM sol), 'mormaii-storm', 'Mormaii Storm',
  'Lentes de sol Mormaii Storm: diseño envolvente deportivo para hombre, inyectado. Las 6 colorways son polarizadas, con lente de policarbonato UV400 categoría 3.',
  E'Los **Mormaii Storm** son **lentes de sol envolventes de diseño deportivo, para hombre**. El armazón es inyectado, frente y patillas en una sola pieza.\n\n**Las 6 colorways son polarizadas.** La lente es de policarbonato, con **100% de protección UV (UV400) y categoría 3**, base curve 8 — el polarizado corta el reflejo del agua y del asfalto, ideal para manejar o para uso náutico/outdoor.\n\nMedidas: lente 57 mm de ancho · puente 16 mm · varilla 124 mm · ancho total del frente 135 mm.\n\nDisponible en 6 colores, del clásico negro brillo a combinaciones espejadas en azul, naranja y marrón.\n\nIncluye estuche semi rígido, franela de Mormaii y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "injected",
    "temple_material": "injected",
    "frame_shape": "envolvente",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400", "polarized"],
    "lens_category": 3,
    "gender": "male",
    "line": "deportiva",
    "measurements": {"frame_width_mm": 135, "lens_width_mm": 57, "bridge_mm": 16, "temple_length_mm": 124},
    "includes": ["estuche-semi-rigido", "franela-mormaii"],
    "warranty_months": 12,
    "new_until": "2026-10-22",
    "callouts": [
      {"type": "info", "position": "top", "title": "Envolvente deportivo, base 8", "body": "Armazón inyectado de diseño envolvente, pensado para hombre y uso deportivo. Lente con base curve 8."},
      {"type": "tip", "position": "middle", "title": "Las 6 colorways son polarizadas", "body": "Lente de policarbonato con 100% de protección UVA y UVB (UV400), categoría 3. El polarizado corta el reflejo del asfalto y del agua, ideal para manejar o para actividades náuticas."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con el color?", "body": "Escribinos por WhatsApp y te asesoramos con un técnico óptico matriculado antes de comprar."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1538614840"], "imported_at": "2026-09-22"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Mormaii Storm Polarizados | Óptica Carballo',
  'Lentes de sol Mormaii Storm: diseño envolvente deportivo, 100% polarizadas, policarbonato UV400 categoría 3. 6 colores, envío a todo el país, garantía oficial.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- SKUs de casa (ML no declara seller_sku en ninguna) — reemplazar con UPDATE si aparecen los reales,
-- antes de que haya ventas (sku es la llave de ON CONFLICT). mercadolibre_variation_code numérico en
-- las 6 (seller_custom_field null → el ID numérico es el único que matchea, patrón Bad Card/Ardigan).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='mormaii-storm'), 'STORM-NBR-GRIS',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","polarized":true}'::jsonb,
   11602404, 4, true, 1, 'MLA1538614840', '180284092875'),
  ((SELECT id FROM public.products WHERE slug='mormaii-storm'), 'STORM-NMT-G15',
   '{"frame_color":"negro-mate","lens_color":"verde-g15","polarized":true}'::jsonb,
   11602404, 3, true, 2, 'MLA1538614840', '180284092879'),
  ((SELECT id FROM public.products WHERE slug='mormaii-storm'), 'STORM-NMT-NARANJA',
   '{"frame_color":"negro-mate","lens_color":"espejado-naranja","polarized":true}'::jsonb,
   11602404, 2, true, 3, 'MLA1538614840', '180284092873'),
  ((SELECT id FROM public.products WHERE slug='mormaii-storm'), 'STORM-C12-MARRON',
   '{"frame_color":"negro-mate-detalles-marron","lens_color":"marron","model_code":"C12","polarized":true}'::jsonb,
   11602404, 2, true, 4, 'MLA1538614840', '193730306601'),
  ((SELECT id FROM public.products WHERE slug='mormaii-storm'), 'STORM-C05-AZUL',
   '{"frame_color":"negro-mate","lens_color":"espejado-azul","model_code":"C05","polarized":true}'::jsonb,
   11602404, 1, true, 5, 'MLA1538614840', '192343088155'),
  ((SELECT id FROM public.products WHERE slug='mormaii-storm'), 'STORM-AZT-GRIS',
   '{"frame_color":"azul-translucido","lens_color":"gris-oscuro","polarized":true}'::jsonb,
   11602404, 0, true, 6, 'MLA1538614840', '180284092877')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 12 imágenes (perfil+frente × 6). Primaria = perfil de STORM-NBR-GRIS (mayor stock).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='mormaii-storm'), (SELECT id FROM public.product_variants WHERE sku='STORM-NBR-GRIS'),
   'mormaii-storm/perfil-c02.jpg', 'Lentes de sol Mormaii Storm envolventes para hombre vista lateral, negro brillo con lente gris oscuro polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='mormaii-storm'), (SELECT id FROM public.product_variants WHERE sku='STORM-NBR-GRIS'),
   'mormaii-storm/frente-c02.jpg', 'Lentes de sol Mormaii Storm envolventes para hombre vista frontal, negro brillo con lente gris oscuro polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-storm'), (SELECT id FROM public.product_variants WHERE sku='STORM-NMT-G15'),
   'mormaii-storm/perfil-c10.jpg', 'Lentes de sol Mormaii Storm envolventes para hombre vista lateral, negro mate con lente verde G15 polarizada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-storm'), (SELECT id FROM public.product_variants WHERE sku='STORM-NMT-G15'),
   'mormaii-storm/frente-c10.jpg', 'Lentes de sol Mormaii Storm envolventes para hombre vista frontal, negro mate con lente verde G15 polarizada', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-storm'), (SELECT id FROM public.product_variants WHERE sku='STORM-NMT-NARANJA'),
   'mormaii-storm/perfil-c07.jpg', 'Lentes de sol Mormaii Storm envolventes para hombre vista lateral, negro mate con lente espejada naranja polarizada', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-storm'), (SELECT id FROM public.product_variants WHERE sku='STORM-NMT-NARANJA'),
   'mormaii-storm/frente-c07.jpg', 'Lentes de sol Mormaii Storm envolventes para hombre vista frontal, negro mate con lente espejada naranja polarizada', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-storm'), (SELECT id FROM public.product_variants WHERE sku='STORM-C12-MARRON'),
   'mormaii-storm/perfil-c12.jpg', 'Lentes de sol Mormaii Storm envolventes para hombre vista lateral, negro mate con detalles marrón y lente marrón polarizada', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-storm'), (SELECT id FROM public.product_variants WHERE sku='STORM-C12-MARRON'),
   'mormaii-storm/frente-c12.jpg', 'Lentes de sol Mormaii Storm envolventes para hombre vista frontal, negro mate con detalles marrón y lente marrón polarizada', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-storm'), (SELECT id FROM public.product_variants WHERE sku='STORM-C05-AZUL'),
   'mormaii-storm/perfil-c05.jpg', 'Lentes de sol Mormaii Storm envolventes para hombre vista lateral, negro mate con lente espejada azul polarizada', 2000, 1333, 8, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-storm'), (SELECT id FROM public.product_variants WHERE sku='STORM-C05-AZUL'),
   'mormaii-storm/frente-c05.jpg', 'Lentes de sol Mormaii Storm envolventes para hombre vista frontal, negro mate con lente espejada azul polarizada', 2000, 1333, 9, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-storm'), (SELECT id FROM public.product_variants WHERE sku='STORM-AZT-GRIS'),
   'mormaii-storm/perfil-c04.jpg', 'Lentes de sol Mormaii Storm envolventes para hombre vista lateral, azul translúcido con lente gris oscuro polarizada', 2000, 1333, 10, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-storm'), (SELECT id FROM public.product_variants WHERE sku='STORM-AZT-GRIS'),
   'mormaii-storm/frente-c04.jpg', 'Lentes de sol Mormaii Storm envolventes para hombre vista frontal, azul translúcido con lente gris oscuro polarizada', 2000, 1333, 11, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
