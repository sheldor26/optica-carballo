-- ============================================
-- Seed 49: Rusty Gresent (sol) — aviador doble puente, G-Flex, apto receta
-- Fecha: 2026-06-02
-- ============================================
-- Anteojo de sol estilo AVIADOR con DOBLE PUENTE, unisex. Frente y patillas de
-- G-Flex con bisagras plásticas integradas de alta resistencia. Lentes de
-- policarbonato UV400 cat3. Liviano (38,4 g). APTO para lentes recetados
-- (prescription_adapter=true). Ninguna variante polarizada → lens_treatment ["uv400"].
--
-- MLA2247006470 MULTI-VARIANTE (4 variaciones). Stock=ML, todas $81.090,33:
--   SKU 129292 — SDEMI/GG47  carey brillo + verde degradé.   var 184747680794. stock 6 (mayor → primary).
--   SKU 129293 — SBH/GS9     marrón brillo + marrón degradé.  var 193712780493. stock 4.
--   SKU 129290 — MBLK/GS16   negro mate + verde degradé.      var 184747680792. stock 3.
--   SKU 129291 — SBLK/3237   negro brillo + verde oscuro.     var 184747680796. stock 2.
--
-- ⚠️ MEDIDAS EN CONFLICTO — cargo las de la imagen medidas.webp (138/60x53/14/145),
--    que es lo que se muestra. El texto del founder decía 128/50x53/18/145
--    (parece descripción autogenerada). PENDIENTE confirmación founder.
--
-- 📸 FOTOS (bucket products/rusty-gresent/, casing inconsistente respetado):
--   GRESENT_SDEMI_GG47_-_p.jpg / GRESENT_SDEMI_GG47_-_F.jpg  (SDEMI — perfil primary del modelo)
--   GRESENT_sbh_gs9_-_p.jpg / GRESENT_sbh_gs9_-_f.jpg
--   GRESENT_MBLK_GS16_-_p.jpg / GRESENT_MBLK_GS16_-_F.jpg
--   GRESENT_SBLK_3237_-_P.jpg / GRESENT_SBLK_3237_-_F.jpg
--   medidas.webp
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-gresent', 'Rusty Gresent',
  'Anteojos de sol estilo aviador con doble puente Rusty Gresent: armazón G-Flex flexible y liviano (38,4 g), lentes de policarbonato UV400 categoría 3. Unisex y aptos para colocar lentes recetados.',
  E'Los Rusty Gresent reinventan el clásico diseño **aviador** con un moderno **doble puente**, fusionado con la tecnología del material **G-Flex**: un armazón increíblemente flexible, liviano y resistente que se adapta a tu rostro. Con solo 38,4 gramos, te olvidás de los anteojos que pesan o aprietan.\n\nLas lentes son de policarbonato con protección total **UV400** (categoría 3), que resguarda tus ojos de los rayos del sol con una claridad visual excepcional. Su diseño canchero y unisex combina con cualquier look. Las bisagras son plásticas integradas de alta resistencia: trabajan en conjunto con el G-Flex y evitan los puntos de tensión de las bisagras metálicas en marcos flexibles.\n\n**Aptos para tu graduación**: la flexibilidad y resistencia del G-Flex los hacen totalmente compatibles para montar lentes recetados. Podés tener tu graduación en un armazón de sol que realmente te representa.\n\nDisponible en 4 variantes:\n\n• SDEMI/GG47 (SKU 129292): carey brillo con lente verde degradé.\n• SBH/GS9 (SKU 129293): marrón brillo con lente marrón degradé.\n• MBLK/GS16 (SKU 129290): negro mate con lente verde degradé.\n• SBLK/3237 (SKU 129291): negro brillo con lente verde oscuro.\n\nIncluye estuche original Rusty, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "aviador",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "gender": "unisex",
    "line": "urbana",
    "interchangeable_lenses": false,
    "prescription_adapter": true,
    "measurements": {"frame_width_mm": 138, "lens_width_mm": 60, "lens_height_mm": 53, "bridge_mm": 14, "temple_length_mm": 145},
    "weight_grams": 38,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Aviador de doble puente en G-Flex", "body": "Reinventa el aviador clásico con doble puente y material G-Flex: flexible, liviano (38,4 g) y resistente. Se dobla sin romperse y no presiona la cara."},
      {"type": "recommendation", "position": "middle", "title": "¿También con tu graduación?", "body": "El G-Flex es apto para colocar lentes recetados. Llevalos a tu óptica o escribinos para coordinar la graduación sobre este armazón."},
      {"type": "tip", "position": "bottom", "title": "Para que duren", "body": "Guardalos en el estuche y limpiá solo con la franela de microfibra. Si vas al mar o la pileta, enjuagalos con agua dulce antes de guardarlos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2247006470"], "imported_at": "2026-06-02"}
  }'::jsonb,
  true, false,
  'Rusty Gresent Anteojos de Sol Aviador Doble Puente Unisex | Óptica Carballo',
  'Anteojos Rusty Gresent aviador de doble puente unisex: G-Flex liviano (38,4g), policarbonato UV400, aptos para receta. 4 variantes. Stock real y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-gresent'), '129292',
   '{"frame_color":"carey","lens_color":"verde-degrade","model_code":"SDEMI/GG47","polarized":false}'::jsonb,
   8109033, 6, true, 1, 'MLA2247006470', '184747680794'),
  ((SELECT id FROM public.products WHERE slug='rusty-gresent'), '129293',
   '{"frame_color":"marron-brillo","lens_color":"marron-degrade","model_code":"SBH/GS9","polarized":false}'::jsonb,
   8109033, 4, true, 2, 'MLA2247006470', '193712780493'),
  ((SELECT id FROM public.products WHERE slug='rusty-gresent'), '129290',
   '{"frame_color":"negro-mate","lens_color":"verde-degrade","model_code":"MBLK/GS16","polarized":false}'::jsonb,
   8109033, 3, true, 3, 'MLA2247006470', '184747680792'),
  ((SELECT id FROM public.products WHERE slug='rusty-gresent'), '129291',
   '{"frame_color":"negro-brillo","lens_color":"verde-oscuro","model_code":"SBLK/3237","polarized":false}'::jsonb,
   8109033, 2, true, 4, 'MLA2247006470', '184747680796')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: SDEMI perfil (mayor stock; solo tiene perfil).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-gresent'), (SELECT id FROM public.product_variants WHERE sku='129292'),
   'rusty-gresent/GRESENT_SDEMI_GG47_-_p.jpg', 'Anteojo de sol Rusty Gresent aviador doble puente vista lateral, carey brillo con lente verde degradé', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-gresent'), (SELECT id FROM public.product_variants WHERE sku='129292'),
   'rusty-gresent/GRESENT_SDEMI_GG47_-_F.jpg', 'Anteojo de sol Rusty Gresent aviador doble puente vista frontal, carey brillo con lente verde degradé', 1500, 1000, 8, false),
  ((SELECT id FROM public.products WHERE slug='rusty-gresent'), (SELECT id FROM public.product_variants WHERE sku='129293'),
   'rusty-gresent/GRESENT_sbh_gs9_-_p.jpg', 'Anteojo de sol Rusty Gresent aviador doble puente vista lateral, marrón brillo con lente marrón degradé', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-gresent'), (SELECT id FROM public.product_variants WHERE sku='129293'),
   'rusty-gresent/GRESENT_sbh_gs9_-_f.jpg', 'Anteojo de sol Rusty Gresent aviador doble puente vista frontal, marrón brillo con lente marrón degradé', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-gresent'), (SELECT id FROM public.product_variants WHERE sku='129290'),
   'rusty-gresent/GRESENT_MBLK_GS16_-_p.jpg', 'Anteojo de sol Rusty Gresent aviador doble puente vista lateral, negro mate con lente verde degradé', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-gresent'), (SELECT id FROM public.product_variants WHERE sku='129290'),
   'rusty-gresent/GRESENT_MBLK_GS16_-_F.jpg', 'Anteojo de sol Rusty Gresent aviador doble puente vista frontal, negro mate con lente verde degradé', 1500, 1000, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-gresent'), (SELECT id FROM public.product_variants WHERE sku='129291'),
   'rusty-gresent/GRESENT_SBLK_3237_-_P.jpg', 'Anteojo de sol Rusty Gresent aviador doble puente vista lateral, negro brillo con lente verde oscuro', 1500, 1000, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-gresent'), (SELECT id FROM public.product_variants WHERE sku='129291'),
   'rusty-gresent/GRESENT_SBLK_3237_-_F.jpg', 'Anteojo de sol Rusty Gresent aviador doble puente vista frontal, negro brillo con lente verde oscuro', 1500, 1000, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-gresent'), NULL,
   'rusty-gresent/medidas.webp', 'Esquema técnico de medidas Rusty Gresent: frente 138mm, lente 60x53mm, puente 14mm, varilla 145mm', 1500, 1500, 7, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
