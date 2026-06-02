-- ============================================
-- Seed 44: Rusty Beason (sol) — cat eye femenino, G-Flex
-- Fecha: 2026-06-02
-- ============================================
-- Anteojo de sol femenino formato cat eye (ojo de gato). Armazón G-Flex,
-- bisagras plásticas reforzadas. Lentes de policarbonato UV400 categoría 3.
-- Ninguna variante polarizada → producto lens_treatment ["uv400"].
--
-- 4 variantes en 4 MLAs (todas publicaciones simples). Stock=ML:
--   SKU 128791 — L.PINK/G.GREY   caramelo + gris oscuro degradé. MLA1507005400. $66.457,11, stock 13 (mayor stock → primary).
--   SKU 128790 — SBLK/G15        negro brillo + verde G15.        MLA1506967192. $66.457,11, stock 5.
--   SKU 128792 — S.PINK/G.BROWN  rosa + marrón degradé.           MLA1563836742. $66.457,11, stock 1.  ⚠️ SIN FOTOS en bucket (cae al primary).
--   SKU 128794 — SBLK/GS9B       negro brillo + marrón degradé.   MLA1866311556. $66.724, stock 0 (paused).
--
-- Medidas: 141 / 54x50 / 16 / 145 mm.
-- frame_shape "cat_eye" (founder: cat eye / ML GS9B dice "ojo de gato"; ML
--   marca formas inconsistentes Ovalada/Rectangular/En Puntas por publicación).
--
-- 📸 FOTOS (bucket products/rusty-beason/, nombres reales verificados HTTP 200,
-- casing/prefijos AGALERIA respetados):
--   BEASON GALERIA-WEB-LPINK-GGREY PERFIL.jpg / BEASON AGALERIA-WEB-LPINK-GGREY FRENTE.jpg  (L.PINK — perfil primary del modelo)
--   BEASON GALERIA-WEB-SBLK-G15 perfil.jpg / BEASON AGALERIA-WEB-SBLK-G15 frente.jpg / BEASON GALERIA-WEB-SBLK-G15.jpg
--   BEASON SBLKGS9B-perfil.jpg / BEASON SBLKGS9B-frente.jpg
--   medidas.jpg
--   ⚠️ S.PINK/G.BROWN (128792) NO tiene fotos en el bucket — pendiente subir.
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-beason', 'Rusty Beason',
  'Anteojos de sol femeninos Rusty Beason: formato cat eye (ojo de gato), armazón G-Flex liviano con bisagras plásticas reforzadas y lentes de policarbonato UV400 categoría 3.',
  E'Los Rusty Beason son anteojos de sol femeninos con formato cat eye (ojo de gato), un diseño clásico y favorecedor que estiliza la mirada. El armazón es de G-Flex —un material liviano y flexible que no marca ni lastima— con bisagras plásticas reforzadas para mayor durabilidad.\n\nLas lentes son de policarbonato con protección UV400 categoría 3 (100% contra rayos UVA y UVB), ideales para días de sol fuerte.\n\nDisponible en 4 variantes:\n\n• L.PINK/G.GREY (SKU 128791): armazón caramelo con lente gris oscuro degradé.\n• SBLK/G15 (SKU 128790): negro brillo con lente verde G15.\n• S.PINK/G.BROWN (SKU 128792): rosa con lente marrón degradé.\n• SBLK/GS9B (SKU 128794): negro brillo con lente marrón degradé.\n\nIncluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "cat_eye",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "gender": "female",
    "line": "urbana",
    "interchangeable_lenses": false,
    "prescription_adapter": false,
    "measurements": {"frame_width_mm": 141, "lens_width_mm": 54, "lens_height_mm": 50, "bridge_mm": 16, "temple_length_mm": 145},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Cat eye femenino y liviano", "body": "El formato ojo de gato estiliza la mirada y favorece a la mayoría de los rostros. El armazón de G-Flex es liviano y flexible, con bisagras plásticas reforzadas."},
      {"type": "recommendation", "position": "middle", "title": "¿Cuál elegir?", "body": "La L.PINK/G.GREY (caramelo) y la S.PINK/G.BROWN (rosa) son las más delicadas; las negras (SBLK/G15 verde, SBLK/GS9B marrón) son más versátiles para el día a día."},
      {"type": "tip", "position": "bottom", "title": "Para que duren", "body": "Guardalos en el estuche y limpiá solo con la franela de microfibra. Si vas al mar o la pileta, enjuagalos con agua dulce antes de guardarlos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1507005400", "MLA1506967192", "MLA1563836742", "MLA1866311556"], "imported_at": "2026-06-02"}
  }'::jsonb,
  true, false,
  'Rusty Beason Anteojos de Sol Cat Eye Mujer G-Flex | Óptica Carballo',
  'Anteojos Rusty Beason femeninos cat eye (ojo de gato): armazón G-Flex liviano, policarbonato UV400. 4 variantes. Stock real y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-beason'), '128791',
   '{"frame_color":"caramelo","lens_color":"gris-oscuro-degrade","model_code":"L.PINK/G.GREY","polarized":false}'::jsonb,
   6645711, 13, true, 1, 'MLA1507005400', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-beason'), '128790',
   '{"frame_color":"negro-brillo","lens_color":"verde","model_code":"SBLK/G15","polarized":false}'::jsonb,
   6645711, 5, true, 2, 'MLA1506967192', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-beason'), '128792',
   '{"frame_color":"rosa","lens_color":"marron-degrade","model_code":"S.PINK/G.BROWN","polarized":false}'::jsonb,
   6645711, 1, true, 3, 'MLA1563836742', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-beason'), '128794',
   '{"frame_color":"negro-brillo","lens_color":"marron-degrade","model_code":"SBLK/GS9B","polarized":false}'::jsonb,
   6672400, 0, true, 4, 'MLA1866311556', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: L.PINK/G.GREY perfil (mayor stock). Perfil = primaria de cada variante.
-- S.PINK/G.BROWN sin fotos (pendiente bucket).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-beason'), (SELECT id FROM public.product_variants WHERE sku='128791'),
   'rusty-beason/BEASON GALERIA-WEB-LPINK-GGREY PERFIL.jpg', 'Anteojo de sol Rusty Beason cat eye vista lateral, armazón caramelo con lente gris oscuro degradé', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-beason'), (SELECT id FROM public.product_variants WHERE sku='128791'),
   'rusty-beason/BEASON AGALERIA-WEB-LPINK-GGREY FRENTE.jpg', 'Anteojo de sol Rusty Beason cat eye vista frontal, armazón caramelo con lente gris oscuro degradé', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-beason'), (SELECT id FROM public.product_variants WHERE sku='128790'),
   'rusty-beason/BEASON GALERIA-WEB-SBLK-G15 perfil.jpg', 'Anteojo de sol Rusty Beason cat eye vista lateral, armazón negro brillo con lente verde G15', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-beason'), (SELECT id FROM public.product_variants WHERE sku='128790'),
   'rusty-beason/BEASON AGALERIA-WEB-SBLK-G15 frente.jpg', 'Anteojo de sol Rusty Beason cat eye vista frontal, armazón negro brillo con lente verde G15', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-beason'), (SELECT id FROM public.product_variants WHERE sku='128790'),
   'rusty-beason/BEASON GALERIA-WEB-SBLK-G15.jpg', 'Anteojo de sol Rusty Beason cat eye negro brillo con lente verde G15', 1500, 1000, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-beason'), (SELECT id FROM public.product_variants WHERE sku='128794'),
   'rusty-beason/BEASON SBLKGS9B-perfil.jpg', 'Anteojo de sol Rusty Beason cat eye vista lateral, armazón negro brillo con lente marrón degradé', 1500, 1000, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-beason'), (SELECT id FROM public.product_variants WHERE sku='128794'),
   'rusty-beason/BEASON SBLKGS9B-frente.jpg', 'Anteojo de sol Rusty Beason cat eye vista frontal, armazón negro brillo con lente marrón degradé', 1500, 1000, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-beason'), NULL,
   'rusty-beason/medidas.jpg', 'Esquema técnico de medidas Rusty Beason: frente 141mm, lente 54x50mm, puente 16mm, varilla 145mm', 1500, 1500, 7, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
