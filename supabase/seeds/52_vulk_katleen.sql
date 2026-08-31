-- ============================================
-- Seed 52: Vulk Katleen (sol) — cuadrado femenino, G-Flex ultra liviano, 1 de 4 pol
-- Fecha: 2026-06-04
-- ============================================
-- Anteojo de sol cuadrado femenino, G-Flex (armazón + patillas) con bisagras
-- plásticas, ultra liviano (26,3g). Lentes de policarbonato UV400 cat 3 (100%
-- UVA/UVB). Talle medium. 1 de 4 variantes polarizada (MBLK/S10 POL) → producto
-- lens_treatment ["uv400"] (entra a /polarizados por la variante polarizada).
--
-- 4 variantes en 4 MLAs (publicaciones simples). Stock=ML:
--   SKU 968265 — SDEMI-SBLK/GB27   frente carey brillo + marrón degradé. MLA1549858831. $69.810,63 stock 14 (primary).
--   SKU 125907 — MBLK/S10 POL      negro mate + gris oscuro POLARIZADA.   MLA1423906891. $76.156,15 stock 6.
--   SKU 125905 — MBLK/C8B15        negro mate + naranja claro.            MLA1423907621. $69.810,63 stock 4.
--   SKU 125909 — MSIENNA/HGG1      marrón claro mate + G15 degradé; antirreflex. MLA1802789252. $70.091 stock 0 (paused).
--
-- Medidas: 129 / 53x42 / 18 / 145 mm. Talle medium. gender=female.
--
-- 📸 FOTOS (bucket products/vulk-katleen/, nombres reales verificados HTTP 200;
-- casing/espacios inconsistentes respetados: MBLK/S10 minúscula, SDEMI con
-- " -Perfil"/" - F", C8B15 con underscore):
--   KATLEEN SDEMI-SBLK GB27 -Perfil.jpg / KATLEEN SDEMI-SBLK GB27 - F.jpg  (primary del modelo)
--   katleen mblk s10 pol p.jpg / katleen mblk s10 pol f.jpg
--   KATLEEN MBLK C8B15_perfil.jpg / KATLEEN MBLK C8B15_frente.jpg
--   KATLEEN MSIENNA HGG1 p.jpg / KATLEEN MSIENNA HGG1 f.jpg
--   medidas.webp
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-katleen', 'Vulk Katleen',
  'Anteojos de sol Vulk Katleen: cuadrados femeninos, armazón y patillas de G-Flex y lentes de policarbonato UV400 categoría 3. Talle medium. Una variante con lente polarizada.',
  E'Los Vulk Katleen son anteojos de sol **cuadrados femeninos**, modernos y versátiles para uso diario. El armazón y las patillas son de **G-Flex** (26,3 g) con bisagras plásticas.\n\nLas lentes son de policarbonato con protección **UV400 categoría 3** (100% UVA/UVB). El modelo **MBLK/S10 (POL) es polarizado**, lo que elimina los reflejos del asfalto, el agua y la nieve para una visión más nítida y descansada. La variante **MSIENNA/HGG1** suma una capa antirreflejo para reducir los reflejos que llegan desde atrás.\n\nDisponible en 4 variantes:\n\n• SDEMI-SBLK/GB27 (SKU 968265): frente carey brillo con lente marrón degradé.\n• MBLK/S10 POL (SKU 125907): negro mate con lente gris oscuro POLARIZADA.\n• MBLK/C8B15 (SKU 125905): negro mate con lente naranja claro.\n• MSIENNA/HGG1 (SKU 125909): marrón claro mate con lente G15 degradé y antirreflejo.\n\nTalle medium. Incluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "cuadrado",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "gender": "female",
    "line": "urbana",
    "interchangeable_lenses": false,
    "prescription_adapter": false,
    "weight_grams": 26.3,
    "measurements": {"frame_width_mm": 129, "lens_width_mm": 53, "lens_height_mm": 42, "bridge_mm": 18, "temple_length_mm": 145},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado femenino ultra liviano", "body": "Montura cuadrada femenina en G-Flex flexible, de solo 26,3 g: de las más livianas del catálogo. Bisagras plásticas, talle medium."},
      {"type": "recommendation", "position": "middle", "title": "¿Cuál elegir?", "body": "Para manejar o la playa, la MBLK/S10 es POLARIZADA (elimina reflejos). La SDEMI-SBLK carey es la más clásica y combinable; la MBLK/C8B15 naranja es la más jugada; la MSIENNA marrón claro suma antirreflejo."},
      {"type": "tip", "position": "bottom", "title": "Para que duren", "body": "Guardalos en el estuche y limpiá solo con la franela de microfibra. Si vas al mar o la pileta, enjuagalos con agua dulce antes de guardarlos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1549858831", "MLA1423906891", "MLA1423907621", "MLA1802789252"], "imported_at": "2026-06-04"}
  }'::jsonb,
  true, false,
  'Vulk Katleen Anteojos de Sol Cuadrados Mujer | Carballo',
  'Anteojos Vulk Katleen cuadrados femeninos: G-Flex de 26,3 g, policarbonato UV400, talle medium. 4 variantes, una polarizada. Envíos a toda la Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-katleen'), '968265',
   '{"frame_color":"carey","lens_color":"marron-degrade","model_code":"SDEMI-SBLK/GB27","polarized":false}'::jsonb,
   6981063, 14, true, 1, 'MLA1549858831', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen'), '125907',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   7615615, 6, true, 2, 'MLA1423906891', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen'), '125905',
   '{"frame_color":"negro-mate","lens_color":"naranja-claro","model_code":"MBLK/C8B15","polarized":false}'::jsonb,
   6981063, 4, true, 3, 'MLA1423907621', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen'), '125909',
   '{"frame_color":"marron-claro-mate","lens_color":"marron-degrade","model_code":"MSIENNA/HGG1","polarized":false,"lens_treatment":["antirreflejo"]}'::jsonb,
   7009100, 0, true, 4, 'MLA1802789252', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: SDEMI-SBLK/GB27 perfil. Perfil = primaria de cada variante.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-katleen'), (SELECT id FROM public.product_variants WHERE sku='968265'),
   'vulk-katleen/KATLEEN SDEMI-SBLK GB27 -Perfil.jpg', 'Anteojo de sol Vulk Katleen cuadrado femenino vista lateral, frente carey brillo con lente marrón degradé', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen'), (SELECT id FROM public.product_variants WHERE sku='968265'),
   'vulk-katleen/KATLEEN SDEMI-SBLK GB27 - F.jpg', 'Anteojo de sol Vulk Katleen cuadrado femenino vista frontal, frente carey brillo con lente marrón degradé', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen'), (SELECT id FROM public.product_variants WHERE sku='125907'),
   'vulk-katleen/katleen mblk s10 pol p.jpg', 'Anteojo de sol Vulk Katleen cuadrado femenino vista lateral, negro mate con lente gris oscuro polarizada', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen'), (SELECT id FROM public.product_variants WHERE sku='125907'),
   'vulk-katleen/katleen mblk s10 pol f.jpg', 'Anteojo de sol Vulk Katleen cuadrado femenino vista frontal, negro mate con lente gris oscuro polarizada', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen'), (SELECT id FROM public.product_variants WHERE sku='125905'),
   'vulk-katleen/KATLEEN MBLK C8B15_perfil.jpg', 'Anteojo de sol Vulk Katleen cuadrado femenino vista lateral, negro mate con lente naranja claro', 1500, 1000, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen'), (SELECT id FROM public.product_variants WHERE sku='125905'),
   'vulk-katleen/KATLEEN MBLK C8B15_frente.jpg', 'Anteojo de sol Vulk Katleen cuadrado femenino vista frontal, negro mate con lente naranja claro', 1500, 1000, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen'), (SELECT id FROM public.product_variants WHERE sku='125909'),
   'vulk-katleen/KATLEEN MSIENNA HGG1 p.jpg', 'Anteojo de sol Vulk Katleen cuadrado femenino vista lateral, marrón claro mate con lente G15 degradé antirreflex', 1500, 1000, 6, false),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen'), (SELECT id FROM public.product_variants WHERE sku='125909'),
   'vulk-katleen/KATLEEN MSIENNA HGG1 f.jpg', 'Anteojo de sol Vulk Katleen cuadrado femenino vista frontal, marrón claro mate con lente G15 degradé antirreflex', 1500, 1000, 7, false),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen'), NULL,
   'vulk-katleen/medidas.webp', 'Esquema técnico de medidas Vulk Katleen: frente 129mm, lente 53x42mm, puente 18mm, varilla 145mm', 1500, 1500, 8, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
