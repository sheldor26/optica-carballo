-- ============================================
-- Seed 48: Rusty Misty Receta (armazón de receta) — redondo unisex, TALLE CHICO
-- Fecha: 2026-06-02
-- ============================================
-- Versión ÓPTICA (armazón de receta, lentes demo) del Rusty Misty. Mismo frame
-- que el Misty de sol: redondo, talle chico, 17,8g, medidas 132/44x42/22/145.
-- Frente y patillas de G-Flex con bisagras metálicas Flex. Apto monofocal,
-- bifocal y progresivo (lens_compatibility). Categoría receta.
--
-- MLA1388546107 MULTI-VARIANTE (3 variaciones). Stock=ML:
--   SKU 125734 — MBLK   negro mate. var 183827659731. $82.745,69, stock 7 (mayor → primary).
--   SKU 125731 — 373K   marrón.     var 183827659729. $82.745,69, stock 4.
--   SKU 125730 — 0292   caramelo.   var 179932980765. $82.745,69, stock 3.
--
-- ⚠️ frame_shape "redondo" (mismo frame que Misty sol, que es redondo). El
--    título ML dice "ovalados" — pendiente confirmación founder.
-- ⚠️ FOTOS: NO subidas aún a `rusty-misty-receta/`. Completar el INSERT de
--    product_images + aplicar cuando el founder suba las fotos y pase los nombres.
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  rx    AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM rx), 'rusty-misty-receta', 'Rusty Misty (receta)',
  'Armazón de receta Rusty Misty: redondo unisex de TALLE CHICO (para rostros pequeños). G-Flex con bisagras metálicas Flex, muy liviano (17,8 g). Apto para lentes monofocales, bifocales y progresivos.',
  E'⚠️ IMPORTANTE: el Rusty Misty es de **talle chico** — un armazón pequeño, pensado para **rostros chicos o angostos**. Si tenés un rostro mediano o grande, probablemente te quede chico. Mirá bien las medidas antes de comprar (frente 132 mm).\n\nEs un armazón de receta REDONDO unisex. Frente y patillas de G-Flex con **bisagras metálicas Flex**, y con solo 17,8 gramos es de los más livianos del catálogo — ideal para usar todo el día sin que marque.\n\nViene con lentes demo (sin graduación). Acepta tu receta: monofocales, bifocales y progresivos.\n\nDisponible en 3 colores:\n\n• MBLK (SKU 125734): negro mate.\n• 373K (SKU 125731): marrón.\n• 0292 (SKU 125730): caramelo.\n\nIncluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "redondo",
    "temple_material": "g-flex",
    "hinge_system": "flex",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "unisex",
    "line": "urbana",
    "size_fit": "chico",
    "measurements": {"frame_width_mm": 132, "lens_width_mm": 44, "lens_height_mm": 42, "bridge_mm": 22, "temple_length_mm": 145},
    "weight_grams": 17.8,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "warning", "position": "top", "title": "Talle chico — para rostros chicos", "body": "Es un armazón PEQUEÑO (frente 132 mm). Ideal para rostros chicos o angostos. Si tu rostro es mediano o grande, probablemente te quede chico — revisá las medidas antes de comprar."},
      {"type": "tip", "position": "middle", "title": "Compatible con tu receta", "body": "Acepta monofocales, bifocales y progresivos. Para progresivos tené en cuenta que el alto del lente es 42 mm — escribinos si tenés dudas con tu graduación."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con foto de tu receta. Te pasamos el costo del laboratorio según tu graduación + tratamientos (antirreflex, blue light, fotocromático). Armazón + cristales en 7-10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1388546107"], "imported_at": "2026-06-02"}
  }'::jsonb,
  true, false,
  'Rusty Misty Armazón de Receta Redondo Unisex Talle Chico | Óptica Carballo',
  'Armazón de receta Rusty Misty: redondo unisex talle chico (rostros pequeños), G-Flex, 17,8g, apto monofocal/bifocal/progresivo. 3 colores. Envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-misty-receta'), '125734',
   '{"frame_color":"negro-mate","model_code":"MBLK OPTICAL","polarized":false}'::jsonb,
   8274569, 7, true, 1, 'MLA1388546107', '183827659731'),
  ((SELECT id FROM public.products WHERE slug='rusty-misty-receta'), '125731',
   '{"frame_color":"marron","model_code":"373K OPTICAL","polarized":false}'::jsonb,
   8274569, 4, true, 2, 'MLA1388546107', '183827659729'),
  ((SELECT id FROM public.products WHERE slug='rusty-misty-receta'), '125730',
   '{"frame_color":"caramelo","model_code":"0292 OPTICAL","polarized":false}'::jsonb,
   8274569, 3, true, 3, 'MLA1388546107', '179932980765')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: MBLK perfil (mayor stock). Perfil = primaria de
-- cada variante. ⚠️ Nombres del screenshot del founder — VERIFICAR HTTP 200
-- antes de aplicar (al 2026-06-02 NO estaban subidas a rusty-misty-receta/).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-misty-receta'), (SELECT id FROM public.product_variants WHERE sku='125734'),
   'rusty-misty-receta/MISTY_MBLK_perfil.jpg', 'Armazón de receta Rusty Misty redondo talle chico vista lateral, negro mate', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-misty-receta'), (SELECT id FROM public.product_variants WHERE sku='125734'),
   'rusty-misty-receta/MISTY_MBLK_frente.jpg', 'Armazón de receta Rusty Misty redondo talle chico vista frontal, negro mate', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-misty-receta'), (SELECT id FROM public.product_variants WHERE sku='125731'),
   'rusty-misty-receta/MISTY_373_perfil.jpg', 'Armazón de receta Rusty Misty redondo talle chico vista lateral, marrón', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-misty-receta'), (SELECT id FROM public.product_variants WHERE sku='125731'),
   'rusty-misty-receta/MISTY_373_frente.jpg', 'Armazón de receta Rusty Misty redondo talle chico vista frontal, marrón', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-misty-receta'), (SELECT id FROM public.product_variants WHERE sku='125730'),
   'rusty-misty-receta/MISTY_0292_perfil.jpg', 'Armazón de receta Rusty Misty redondo talle chico vista lateral, caramelo', 1500, 1000, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-misty-receta'), (SELECT id FROM public.product_variants WHERE sku='125730'),
   'rusty-misty-receta/MISTY_0292_frente.jpg', 'Armazón de receta Rusty Misty redondo talle chico vista frontal, caramelo', 1500, 1000, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-misty-receta'), NULL,
   'rusty-misty-receta/medidas.jpg', 'Esquema técnico de medidas Rusty Misty: frente 132mm, lente 44x42mm, puente 22mm, varilla 145mm', 1500, 1500, 6, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
