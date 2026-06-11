-- ============================================
-- Seed 60: Rusty Opposit RECETA (armazón óptico) — wayfarer femenino, G-Flex + patillas de metal/acetato
-- Fecha: 2026-06-11
-- ============================================
-- Armazón de receta WAYFARER femenino, liviano (24,3g). Frente de G-Flex; patillas
-- de metal con terminales de acetato hechas a mano. Lentes demo. Categoría
-- anteojos-de-receta. Convención receta: lens_compatibility + (sin lens_material/
-- treatment/polarized). SEO por seo-strategist (slug/meta/keywords/linking).
--
-- 3 variantes en 1 MLA multi-variante (MLA1388517347). Todas $82.745,69. Precio/
-- stock/var_id traídos de la API ML (scripts/ml-item.ts):
--   MDEMI-068 OPTICAL  SKU 125229  carey mate, patillas doradas mate.  var 178752765210  stock 2 (PRIMARY)
--   SBLK-068 OPTICAL   SKU 125221  negro brillo, patillas doradas mate. var 178752765206  stock 2
--   385-202 OPTICAL    SKU 125228  frente violeta transp., patillas violeta mate. var 178752765208  stock 0
--
-- Medidas: 147 / 53x47 / 17 / 140 mm (de la FOTO de medidas; el texto de ML decía
-- varilla 141 → se usa 140 de la foto por pedido del founder). Peso 24,3g.
-- frame_material g-flex (frente); temple_material metal. hinge_system OMITIDO (no
-- especificado, no inventamos).
--
-- 📸 FOTOS (bucket products/rusty-opposit/, las 6 verificadas HTTP 200; naming MUY
-- inconsistente entre variantes; medidas en .jpeg). Primaria = perfil (P/PERFIL):
--   OPPOSIT_MDEMI-068_P.jpg / OPPOSIT_MDEMI-068_F.jpg            (primary del modelo)
--   OPPOSIT_SBLK-068_-_PERFIL.jpg / OPPOSIT_SBLK-068_-_FRENTE.jpg
--   OPPOSIT 385-202 - PERFIL.jpg / OPPOSIT 385-202 - FRENTE.jpg
--   medidas.jpeg
-- ============================================

BEGIN;

WITH
  rusty   AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-opposit-receta', 'Rusty Opposit Receta',
  'Armazón de receta Rusty Opposit: wayfarer femenino liviano (24,3 g) con frente de G-Flex y patillas de metal con terminales de acetato hechas a mano. Apto para lentes monofocales, bifocales y progresivos. Se vende sin cristales graduados: los cotizamos según tu receta.',
  E'El Rusty Opposit es un armazón de receta **wayfarer femenino**, liviano (24,3 g) y con una terminación cuidada. El **frente es de G-Flex** —flexible y resistente— y las **patillas son de metal con terminales de acetato hechas a mano**, un detalle artesanal que le da carácter y un calce cómodo.\n\nMedidas: frente 147 mm · lente 53 mm de ancho × 47 mm de alto · puente 17 mm · varilla 140 mm. El alto de 47 mm es holgado, cómodo para lentes progresivos.\n\nViene con lentes demo (sin graduación). Acepta tu receta: monofocales, bifocales y progresivos.\n\nDisponible en 3 colores:\n\n• MDEMI-068 — carey mate con patillas doradas mate.\n• SBLK-068 — negro brillo con patillas doradas mate.\n• 385-202 — frente violeta transparente con patillas violeta mate.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "wayfarer",
    "temple_material": "metal",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "female",
    "line": "urbana",
    "measurements": {"frame_width_mm": 147, "lens_width_mm": 53, "lens_height_mm": 47, "bridge_mm": 17, "temple_length_mm": 140},
    "weight_grams": 24.3,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Wayfarer femenino liviano (24,3 g)", "body": "Frente de G-Flex flexible y patillas de metal con terminales de acetato hechas a mano. Forma wayfarer, para un look clásico con impronta femenina. Talle medium."},
      {"type": "tip", "position": "middle", "title": "Cómodo para progresivos", "body": "El alto de lente es 47 mm, holgado para lentes progresivos. Acepta monofocales, bifocales y progresivos. Escribinos si tenés dudas con tu graduación."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con foto de tu receta. Te pasamos el costo del laboratorio según tu graduación + tratamientos (antirreflex, blue light, fotocromático). Armazón + cristales en 7-10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1388517347"], "imported_at": "2026-06-11"}
  }'::jsonb,
  true, false,
  'Rusty Opposit Armazón de Receta Wayfarer Mujer | Óptica Carballo',
  'Armazón de receta Rusty Opposit: wayfarer femenino en G-Flex, 24,3g, apto monofocal, bifocal y progresivo. 3 colores. Envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = MDEMI-068 (default/primary). SKU distintos (sin colisión).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-opposit-receta'), '125229',
   '{"frame_color":"carey-mate","model_code":"MDEMI-068 OPTICAL"}'::jsonb,
   8274569, 2, true, 1, 'MLA1388517347', '178752765210'),
  ((SELECT id FROM public.products WHERE slug='rusty-opposit-receta'), '125221',
   '{"frame_color":"negro-brillo","model_code":"SBLK-068 OPTICAL"}'::jsonb,
   8274569, 2, true, 2, 'MLA1388517347', '178752765206'),
  ((SELECT id FROM public.products WHERE slug='rusty-opposit-receta'), '125228',
   '{"frame_color":"violeta-transparente","model_code":"385-202 OPTICAL"}'::jsonb,
   8274569, 0, true, 3, 'MLA1388517347', '178752765208')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: MDEMI-068 perfil (P). medidas SIEMPRE última.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-opposit-receta'), (SELECT id FROM public.product_variants WHERE sku='125229'),
   'rusty-opposit/OPPOSIT_MDEMI-068_P.jpg', 'Armazón de receta Rusty Opposit wayfarer mujer vista lateral, carey mate con patillas doradas', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-opposit-receta'), (SELECT id FROM public.product_variants WHERE sku='125229'),
   'rusty-opposit/OPPOSIT_MDEMI-068_F.jpg', 'Armazón de receta Rusty Opposit wayfarer mujer vista frontal, carey mate con patillas doradas', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-opposit-receta'), (SELECT id FROM public.product_variants WHERE sku='125221'),
   'rusty-opposit/OPPOSIT_SBLK-068_-_PERFIL.jpg', 'Armazón de receta Rusty Opposit wayfarer mujer vista lateral, negro brillo con patillas doradas', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-opposit-receta'), (SELECT id FROM public.product_variants WHERE sku='125221'),
   'rusty-opposit/OPPOSIT_SBLK-068_-_FRENTE.jpg', 'Armazón de receta Rusty Opposit wayfarer mujer vista frontal, negro brillo con patillas doradas', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-opposit-receta'), (SELECT id FROM public.product_variants WHERE sku='125228'),
   'rusty-opposit/OPPOSIT 385-202 - PERFIL.jpg', 'Armazón de receta Rusty Opposit wayfarer mujer vista lateral, frente violeta transparente', 1500, 1000, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-opposit-receta'), (SELECT id FROM public.product_variants WHERE sku='125228'),
   'rusty-opposit/OPPOSIT 385-202 - FRENTE.jpg', 'Armazón de receta Rusty Opposit wayfarer mujer vista frontal, frente violeta transparente', 1500, 1000, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-opposit-receta'), NULL,
   'rusty-opposit/medidas.jpeg', 'Esquema técnico de medidas Rusty Opposit: frente 147mm, lente 53x47mm, puente 17mm, varilla 140mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
