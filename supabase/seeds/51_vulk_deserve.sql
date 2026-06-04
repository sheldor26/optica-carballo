-- ============================================
-- Seed 51: Vulk Deserve (sol) — cuadrado grande, G-Flex, 1 de 3 polarizada
-- Fecha: 2026-06-04
-- ============================================
-- Anteojo de sol cuadrado grande, unisex. Armazón y patillas de G-Flex. Lentes de
-- policarbonato base 4, UV400 categoría 3 (100% UVA/UVB). Talle Large.
-- 1 de 3 variantes polarizada (MBLK/S10 POL) → producto lens_treatment ["uv400"]
-- (entra a /polarizados por la variante polarizada, criterio "al menos una").
--
-- 3 variantes en 3 MLAs (publicaciones simples). Stock=ML:
--   SKU 112937 — MBLK/S10 POL         negro mate + gris oscuro POLARIZADA. MLA1453544247. $79.991,75, stock 6 (primary).
--   SKU 112935 — SBLK/G.DARK GREY     negro brillo + gris degradé.        MLA2133710836. $73.329,51, stock 5.
--   SKU 112930 — MBLK/G3262 EMERALD   negro mate + lente emerald espejada. MLA1391457505. $78.793,56, stock 4. NO pol; antirreflex interno.
--
-- Medidas: 146 / 59x58 / 16 / 145 mm (de la imagen de medidas; founder "59-16-145").
-- frame_shape "cuadrado" (ML "cuadrados grandes"). Talle Large.
--
-- 📸 FOTOS (bucket products/vulk-deserve/, nombres pasados por el founder —
-- ⚠️ PENDIENTE: verificar HTTP 200 en CDN antes de aplicar; al armar el seed
-- daban 400 = todavía no subidas):
--   DESERVE-MBLK S10 POL- P.jpg / DESERVE-MBLK S10 POL- f.jpg   (primary del modelo)
--   DESERVE-SBLK-GDARK-GREY p.jpg / DESERVE-SBLK-GDARK-GREY f.jpg
--   DESERVE-MBLK-G3262-EMERALD p.jpg / DESERVE-MBLK-G3262-EMERALD f.jpg
--   Medidas.webp
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-deserve', 'Vulk Deserve',
  'Anteojos de sol Vulk Deserve: cuadrados grandes unisex, armazón y patillas de G-Flex y lentes de policarbonato UV400 categoría 3. Talle large. Una variante con lente polarizada.',
  E'Los Vulk Deserve son anteojos de sol **cuadrados grandes**, de estilo moderno y unisex, pensados para quienes buscan una montura con presencia. El armazón y las patillas son de **G-Flex** —flexible, liviano y resistente—, ideal para el uso diario.\n\nLas lentes son de policarbonato base 4 con protección **UV400 categoría 3** (100% UVA/UVB). El modelo **MBLK/S10 (POL) es polarizado**, lo que elimina los reflejos del asfalto, el agua y la nieve para una visión más nítida y descansada. La variante **MBLK/G3262 Emerald** suma una capa antirreflejo en la cara interna de la lente para reducir los reflejos que llegan desde atrás.\n\nDisponible en 3 variantes:\n\n• MBLK/S10 POL (SKU 112937): negro mate con lente gris oscuro POLARIZADA.\n• SBLK/G.DARK GREY (SKU 112935): negro brillo con lente gris degradé oscuro.\n• MBLK/G3262 EMERALD (SKU 112930): negro mate con lente emerald (verde espejada) y antirreflejo interno.\n\nTalle large (montura grande). Incluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "cuadrado",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "gender": "unisex",
    "line": "urbana",
    "interchangeable_lenses": false,
    "prescription_adapter": false,
    "measurements": {"frame_width_mm": 146, "lens_width_mm": 59, "lens_height_mm": 58, "bridge_mm": 16, "temple_length_mm": 145},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado grande en G-Flex", "body": "Montura cuadrada grande (talle large) en G-Flex flexible y liviano, armazón y patillas. Si buscás anteojos de buen tamaño y presencia, este es el calce."},
      {"type": "recommendation", "position": "middle", "title": "¿Cuál elegir?", "body": "Para manejar o la playa, la MBLK/S10 es POLARIZADA (elimina reflejos). La MBLK/G3262 Emerald es la más llamativa (lente verde espejada) y suma antirreflejo interno. La SBLK/G.DARK GREY (gris degradé) es la opción más clásica."},
      {"type": "tip", "position": "bottom", "title": "Para que duren", "body": "Guardalos en el estuche y limpiá solo con la franela de microfibra. Si vas al mar o la pileta, enjuagalos con agua dulce antes de guardarlos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1453544247", "MLA2133710836", "MLA1391457505"], "imported_at": "2026-06-04"}
  }'::jsonb,
  true, false,
  'Vulk Deserve Anteojos de Sol Cuadrados Grandes Unisex | Óptica Carballo',
  'Anteojos Vulk Deserve cuadrados grandes unisex: G-Flex, policarbonato UV400, talle large. 3 variantes (una polarizada). Stock real y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-deserve'), '112937',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   7999175, 6, true, 1, 'MLA1453544247', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-deserve'), '112935',
   '{"frame_color":"negro-brillo","lens_color":"gris-degrade","model_code":"SBLK/G.DARK GREY","polarized":false}'::jsonb,
   7332951, 5, true, 2, 'MLA2133710836', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-deserve'), '112930',
   '{"frame_color":"negro-mate","lens_color":"verde-espejada","model_code":"MBLK/G3262 EMERALD","polarized":false,"lens_treatment":["antirreflejo-interno"]}'::jsonb,
   7879356, 4, true, 3, 'MLA1391457505', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: MBLK/S10 POL perfil. Perfil = primaria de cada variante.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-deserve'), (SELECT id FROM public.product_variants WHERE sku='112937'),
   'vulk-deserve/DESERVE-MBLK S10 POL- P.jpg', 'Anteojo de sol Vulk Deserve cuadrado grande vista lateral, negro mate con lente gris oscuro polarizada', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-deserve'), (SELECT id FROM public.product_variants WHERE sku='112937'),
   'vulk-deserve/DESERVE-MBLK S10 POL- f.jpg', 'Anteojo de sol Vulk Deserve cuadrado grande vista frontal, negro mate con lente gris oscuro polarizada', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-deserve'), (SELECT id FROM public.product_variants WHERE sku='112935'),
   'vulk-deserve/DESERVE-SBLK-GDARK-GREY p.jpg', 'Anteojo de sol Vulk Deserve cuadrado grande vista lateral, negro brillo con lente gris degradé', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-deserve'), (SELECT id FROM public.product_variants WHERE sku='112935'),
   'vulk-deserve/DESERVE-SBLK-GDARK-GREY f.jpg', 'Anteojo de sol Vulk Deserve cuadrado grande vista frontal, negro brillo con lente gris degradé', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-deserve'), (SELECT id FROM public.product_variants WHERE sku='112930'),
   'vulk-deserve/DESERVE-MBLK-G3262-EMERALD p.jpg', 'Anteojo de sol Vulk Deserve cuadrado grande vista lateral, negro mate con lente emerald verde espejada', 1500, 1000, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-deserve'), (SELECT id FROM public.product_variants WHERE sku='112930'),
   'vulk-deserve/DESERVE-MBLK-G3262-EMERALD f.jpg', 'Anteojo de sol Vulk Deserve cuadrado grande vista frontal, negro mate con lente emerald verde espejada', 1500, 1000, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-deserve'), NULL,
   'vulk-deserve/Medidas.webp', 'Esquema técnico de medidas Vulk Deserve: frente 146mm, lente 59x58mm, puente 16mm, varilla 145mm', 1500, 1500, 6, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
