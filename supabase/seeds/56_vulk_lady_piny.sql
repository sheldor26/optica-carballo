-- ============================================
-- Seed 56: Vulk Lady Piny (sol) — redondo femenino, G-Flex + acetato, cat 4, 1 pol
-- Fecha: 2026-06-04
-- ============================================
-- Anteojo de sol femenino. Frente de G-Flex, patillas de acetato con bisagras
-- metálicas (sistema flex). Lentes de policarbonato UV400 100% UVA/UVB, cat 3
-- (estándar de sol). Peso 30,9g.
-- 1 de 4 variantes polarizada (BG26) → producto lens_treatment ["uv400"] (entra a /polarizados).
--
-- 4 variantes en 4 MLAs (publicaciones simples). Stock=ML:
--   SKU 1194183 — 285-UFC0096/GB10S   rosa oscuro transparente + lente rosa degradé, patilla carey. MLA1867589720. $90.584,21 stock 6 (primary).
--   SKU 1194182 — 292-UFQ0028/GS9B    frente rosa pálido + lente gris degradé.    MLA1549821015. $90.584,21 stock 6.
--   SKU 1194180 — SBLK-UFQ0003/SG16   negro brillo (manchas marrones) + lente verde degradé. MLA1451933779. $90.584,21 stock 3.
--   SKU 1194181 — SBLK-UQ0178/BG26 POL negro brillo (manchas rosadas/marrón) + lente marrón degradé POLARIZADA. MLA1917598562. $94.400 stock 0 (paused).
--
-- Medidas: 141 / 57x54 / 17 / 135 mm. Peso 30,9g. gender=female. cat 3.
-- frame_shape "redondo" (ML mezcla redondo/ovalado/"en puntas"; mayoría redondo) — ⚠️ confirmar founder.
--
-- 📸 FOTOS (bucket products/vulk-lady-piny/, ⚠️ PENDIENTE verificar HTTP 200 antes
-- de aplicar; al armar el seed la carpeta estaba vacía. Casing del founder: 285
-- usa "Frente" mayúscula, el resto "frente" minúscula):
--   285-UFC0096 GB10S perfil.jpg / 285-UFC0096 GB10S Frente.jpg   (primary del modelo)
--   292-UFQ0028 GS9B perfil.jpg / 292-UFQ0028 GS9B frente.jpg
--   SBLK-UFQ0003 SG16 perfil.jpg / SBLK-UFQ0003 SG16 frente.jpg
--   SBLK-UQ0178 BG26 pol perfil.jpg / SBLK-UQ0178 BG26 pol frente.jpg
--   medidas.webp
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-lady-piny', 'Vulk Lady Piny',
  'Anteojos de sol Vulk Lady Piny: femeninos, frente de G-Flex con patillas de acetato y bisagras metálicas flex. Lentes de policarbonato UV400 categoría 3. Una variante polarizada.',
  E'Los Vulk Lady Piny son anteojos de sol **femeninos**, modernos y de buen tamaño. El frente es de **G-Flex** —flexible y resistente— y las patillas son de **acetato** con **bisagras metálicas de sistema flex**, que ceden sin marcar para un calce cómodo.\n\nLas lentes son de policarbonato con protección **UV400** (100% UVA/UVB) y **categoría 3** (el nivel estándar para sol intenso, apto para el día a día). La variante **BG26 es polarizada** (elimina los reflejos del asfalto, el agua y la nieve).\n\nDisponible en 4 variantes:\n\n• 285-UFC0096/GB10S (SKU 1194183): rosa oscuro transparente con lente rosa degradé y patilla carey.\n• 292-UFQ0028/GS9B (SKU 1194182): frente rosa pálido con lente gris degradé.\n• SBLK-UFQ0003/SG16 (SKU 1194180): negro brillo con manchas marrones y lente verde degradé.\n• SBLK-UQ0178/BG26 POL (SKU 1194181): negro brillo con manchas rosadas/marrón y lente marrón degradé POLARIZADA.\n\nIncluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "redondo",
    "temple_material": "acetato",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "female",
    "line": "urbana",
    "interchangeable_lenses": false,
    "prescription_adapter": false,
    "weight_grams": 30.9,
    "measurements": {"frame_width_mm": 141, "lens_width_mm": 57, "lens_height_mm": 54, "bridge_mm": 17, "temple_length_mm": 135},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Femenino en G-Flex y acetato", "body": "Frente de G-Flex flexible con patillas de acetato y bisagras metálicas de sistema flex. Buen tamaño (frente 141 mm), femenino y cómodo."},
      {"type": "recommendation", "position": "middle", "title": "¿Cuál elegir?", "body": "La BG26 (marrón degradé) es la única POLARIZADA — ideal para manejar o la playa. Las rosadas (285 y 292) son las más suaves y femeninas; la SG16 (verde degradé sobre negro con manchas) es la más jugada."},
      {"type": "tip", "position": "bottom", "title": "Para que duren", "body": "Guardalos en el estuche y limpiá solo con la franela de microfibra. Si vas al mar o la pileta, enjuagalos con agua dulce antes de guardarlos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1867589720", "MLA1549821015", "MLA1451933779", "MLA1917598562"], "imported_at": "2026-06-04"}
  }'::jsonb,
  true, false,
  'Vulk Lady Piny Anteojos de Sol Femeninos | Óptica Carballo',
  'Anteojos Vulk Lady Piny femeninos: G-Flex + acetato, bisagras metálicas flex, policarbonato UV400 categoría 3. 4 variantes (una polarizada). Stock real y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-lady-piny'), '1194183',
   '{"frame_color":"rosa-transparente","lens_color":"rosa-degrade","model_code":"285-UFC0096/GB10S","polarized":false}'::jsonb,
   9058421, 6, true, 1, 'MLA1867589720', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-lady-piny'), '1194182',
   '{"frame_color":"rosa-palido","lens_color":"gris-degrade","model_code":"292-UFQ0028/GS9B","polarized":false}'::jsonb,
   9058421, 6, true, 2, 'MLA1549821015', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-lady-piny'), '1194180',
   '{"frame_color":"negro-brillo","lens_color":"verde-degrade","model_code":"SBLK-UFQ0003/SG16","polarized":false}'::jsonb,
   9058421, 3, true, 3, 'MLA1451933779', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-lady-piny'), '1194181',
   '{"frame_color":"negro-brillo","lens_color":"marron-degrade","model_code":"SBLK-UQ0178/BG26 POL","polarized":true}'::jsonb,
   9440000, 0, true, 4, 'MLA1917598562', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: 285-UFC0096/GB10S perfil. medidas SIEMPRE última (sort 9).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-lady-piny'), (SELECT id FROM public.product_variants WHERE sku='1194183'),
   'vulk-lady-piny/285-UFC0096 GB10S perfil.jpg', 'Anteojo de sol Vulk Lady Piny femenino vista lateral, rosa oscuro transparente con lente rosa degradé y patilla carey', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-lady-piny'), (SELECT id FROM public.product_variants WHERE sku='1194183'),
   'vulk-lady-piny/285-UFC0096 GB10S Frente.jpg', 'Anteojo de sol Vulk Lady Piny femenino vista frontal, rosa oscuro transparente con lente rosa degradé', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-lady-piny'), (SELECT id FROM public.product_variants WHERE sku='1194182'),
   'vulk-lady-piny/292-UFQ0028 GS9B perfil.jpg', 'Anteojo de sol Vulk Lady Piny femenino vista lateral, frente rosa pálido con lente gris degradé', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-lady-piny'), (SELECT id FROM public.product_variants WHERE sku='1194182'),
   'vulk-lady-piny/292-UFQ0028 GS9B frente.jpg', 'Anteojo de sol Vulk Lady Piny femenino vista frontal, frente rosa pálido con lente gris degradé', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-lady-piny'), (SELECT id FROM public.product_variants WHERE sku='1194180'),
   'vulk-lady-piny/SBLK-UFQ0003 SG16 perfil.jpg', 'Anteojo de sol Vulk Lady Piny femenino vista lateral, negro brillo con manchas marrones y lente verde degradé', 1500, 1000, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-lady-piny'), (SELECT id FROM public.product_variants WHERE sku='1194180'),
   'vulk-lady-piny/SBLK-UFQ0003 SG16 frente.jpg', 'Anteojo de sol Vulk Lady Piny femenino vista frontal, negro brillo con manchas marrones y lente verde degradé', 1500, 1000, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-lady-piny'), (SELECT id FROM public.product_variants WHERE sku='1194181'),
   'vulk-lady-piny/SBLK-UQ0178 BG26 pol perfil.jpg', 'Anteojo de sol Vulk Lady Piny femenino vista lateral, negro brillo con manchas rosadas y lente marrón degradé polarizada', 1500, 1000, 6, false),
  ((SELECT id FROM public.products WHERE slug='vulk-lady-piny'), (SELECT id FROM public.product_variants WHERE sku='1194181'),
   'vulk-lady-piny/SBLK-UQ0178 BG26 pol frente.jpg', 'Anteojo de sol Vulk Lady Piny femenino vista frontal, negro brillo con manchas rosadas y lente marrón degradé polarizada', 1500, 1000, 7, false),
  ((SELECT id FROM public.products WHERE slug='vulk-lady-piny'), NULL,
   'vulk-lady-piny/medidas.webp', 'Esquema técnico de medidas Vulk Lady Piny: frente 141mm, lente 57x54mm, puente 17mm, varilla 135mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
