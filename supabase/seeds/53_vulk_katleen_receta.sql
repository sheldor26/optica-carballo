-- ============================================
-- Seed 53: Vulk Katleen RECETA (armazón óptico) — cuadrado femenino, G-Flex
-- Fecha: 2026-06-04
-- ============================================
-- Versión óptica (de receta) del Vulk Katleen sol. Cuadrado femenino, G-Flex
-- (armazón + patillas), bisagras plásticas, ultra liviano (26,3g). Talle medium.
-- Categoría anteojos-de-receta. Convención receta: lens_compatibility +
-- hinge_system (sin lens_material/treatment/polarized). Viene con lentes demo.
--
-- 3 variantes. Stock=ML. Todas $86.541,45:
--   SKU 125901 — MBLK    negro mate.          MLA2013975658 (simple). stock 3 (primary).
--   SKU 125906 — M0292   caramelo (marrón) mate. MLA2014157548 var 182897030252. stock 2.
--   SKU 125902 — 0292    caramelo brillo transparente. MLA2014157548 var 185448544564. stock 2.
--
-- Peso y medidas = mismos que el Katleen sol: 26,3g, 129/53×42/18/145. Talle medium.
--
-- 📸 FOTOS (bucket products/vulk-katleen-receta/, verificadas HTTP 200; naming
-- inconsistente respetado: MBLK con dash, M0292 con espacio + DOBLE espacio antes
-- de "perfil", 0292 con dash + FRENTE mayúscula):
--   KATLEEN-MBLK perfil.jpg / KATLEEN-MBLK frente.jpg          (primary del modelo)
--   KATLEEN M0292  perfil.jpg / KATLEEN M0292 - Frente.jpg     (¡doble espacio en perfil!)
--   KATLEEN-0292 perfil.jpg / KATLEEN-0292 FRENTE.jpg
--   medidas.webp
-- ============================================

BEGIN;

WITH
  vulk    AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM receta), 'vulk-katleen-receta', 'Vulk Katleen Receta',
  'Armazón de receta Vulk Katleen: cuadrado femenino de G-Flex, 26,3 g, talle medium. Apto monofocal, bifocal y progresivo. Viene con lentes demo.',
  E'Es un armazón de receta **cuadrado femenino**, moderno y versátil. El frente y las patillas son de **G-Flex** (26,3 g) con bisagras plásticas.\n\nViene con lentes demo (sin graduación). Acepta tu receta: monofocales, bifocales y progresivos.\n\nDisponible en 4 colores:\n\n• MBLK (SKU 125901): negro mate.\n• M0292 (SKU 125906): caramelo mate.\n• 0292 (SKU 125902): caramelo brillo transparente.\n• MDEMI: carey mate.\n\nIncluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "cuadrado",
    "temple_material": "g-flex",
    "hinge_system": "plastica",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "female",
    "line": "urbana",
    "measurements": {"frame_width_mm": 129, "lens_width_mm": 53, "lens_height_mm": 42, "bridge_mm": 18, "temple_length_mm": 145},
    "weight_grams": 26.3,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado femenino ultra liviano", "body": "Armazón cuadrado femenino en G-Flex flexible, de solo 26,3 g: de los más livianos del catálogo. Bisagras plásticas, talle medium."},
      {"type": "tip", "position": "middle", "title": "Compatible con tu receta", "body": "Acepta monofocales, bifocales y progresivos. Para progresivos tené en cuenta que el alto del lente es 42 mm — escribinos si tenés dudas con tu graduación."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con foto de tu receta. Te pasamos el costo del laboratorio según tu graduación + tratamientos (antirreflex, blue light, fotocromático). Armazón + cristales en 7-10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2013975658", "MLA2014157548"], "imported_at": "2026-06-04"}
  }'::jsonb,
  true, false,
  'Armazón de Receta Vulk Katleen Cuadrado Mujer | Carballo',
  'Armazón de receta Vulk Katleen: cuadrado femenino de G-Flex, 26,3 g, talle medium, apto monofocal/bifocal/progresivo. 3 colores. Envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-katleen-receta'), '125901',
   '{"frame_color":"negro-mate","model_code":"MBLK"}'::jsonb,
   8654145, 3, true, 1, 'MLA2013975658', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen-receta'), '125906',
   '{"frame_color":"caramelo-mate","model_code":"M0292"}'::jsonb,
   8654145, 2, true, 2, 'MLA2014157548', '182897030252'),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen-receta'), '125902',
   '{"frame_color":"caramelo-brillo","model_code":"0292"}'::jsonb,
   8654145, 2, true, 3, 'MLA2014157548', '185448544564'),
  -- +MDEMI carey mate (2026-06-15, founder la agregó en ML; misma multi-variante).
  -- ML sin SKU → placeholder descriptivo (sync usa varcode).
  ((SELECT id FROM public.products WHERE slug='vulk-katleen-receta'), 'KATLEEN-MDEMI',
   '{"frame_color":"carey-mate","model_code":"MDEMI"}'::jsonb,
   8654145, 3, true, 4, 'MLA2014157548', '204547293605')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: MBLK perfil. Perfil = primaria de cada variante.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-katleen-receta'), (SELECT id FROM public.product_variants WHERE sku='125901'),
   'vulk-katleen-receta/KATLEEN-MBLK perfil.jpg', 'Armazón de receta Vulk Katleen cuadrado femenino vista lateral, negro mate', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen-receta'), (SELECT id FROM public.product_variants WHERE sku='125901'),
   'vulk-katleen-receta/KATLEEN-MBLK frente.jpg', 'Armazón de receta Vulk Katleen cuadrado femenino vista frontal, negro mate', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen-receta'), (SELECT id FROM public.product_variants WHERE sku='125906'),
   'vulk-katleen-receta/KATLEEN M0292  perfil.jpg', 'Armazón de receta Vulk Katleen cuadrado femenino vista lateral, caramelo mate', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen-receta'), (SELECT id FROM public.product_variants WHERE sku='125906'),
   'vulk-katleen-receta/KATLEEN M0292 - Frente.jpg', 'Armazón de receta Vulk Katleen cuadrado femenino vista frontal, caramelo mate', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen-receta'), (SELECT id FROM public.product_variants WHERE sku='125902'),
   'vulk-katleen-receta/KATLEEN-0292 perfil.jpg', 'Armazón de receta Vulk Katleen cuadrado femenino vista lateral, caramelo brillo transparente', 1500, 1000, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen-receta'), (SELECT id FROM public.product_variants WHERE sku='125902'),
   'vulk-katleen-receta/KATLEEN-0292 FRENTE.jpg', 'Armazón de receta Vulk Katleen cuadrado femenino vista frontal, caramelo brillo transparente', 1500, 1000, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen-receta'), NULL,
   'vulk-katleen-receta/medidas.webp', 'Esquema técnico de medidas Vulk Katleen: frente 129mm, lente 53x42mm, puente 18mm, varilla 145mm', 1500, 1500, 99, false),  -- sort 99 = siempre última (antes 6: con variantes nuevas en sort >6 quedaba ANTES de sus fotos)
  -- +MDEMI carey mate (2026-06-15)
  ((SELECT id FROM public.products WHERE slug='vulk-katleen-receta'), (SELECT id FROM public.product_variants WHERE sku='KATLEEN-MDEMI'),
   'vulk-katleen-receta/katleen-mdemi-P.jpg', 'Armazón de receta Vulk Katleen cuadrado vista lateral, carey mate', 900, 442, 10, false),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen-receta'), (SELECT id FROM public.product_variants WHERE sku='KATLEEN-MDEMI'),
   'vulk-katleen-receta/katleen-mdemi-F.jpg', 'Armazón de receta Vulk Katleen cuadrado vista frontal, carey mate', 900, 442, 11, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
