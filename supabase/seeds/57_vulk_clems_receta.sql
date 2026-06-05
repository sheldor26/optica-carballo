-- ============================================
-- Seed 57: Vulk Clems RECETA (armazón óptico) — ovalado, G-Flex + acero inox, ultra liviano
-- Fecha: 2026-06-05
-- ============================================
-- Armazón de receta ovalado, ULTRA liviano (14,3g). Frente de G-Flex, patillas de
-- acero inoxidable con terminal de goma ajustable y bisagra integrada. Viene con
-- lentes demo. Categoría anteojos-de-receta. Convención receta: lens_compatibility
-- + hinge_system (sin lens_material/treatment/polarized).
--
-- 3 variantes en 1 MLA multi-variante (MLA1436023889). Todas $83.410,02. Stock=ML:
--   SKU 123036 — CRY-GUN OPTICS   transparente, patillas gunmetal. var 180952431090. stock 5 (primary).
--   SKU 123030 — MBLK-BLUE OPTICS frente negro mate, patillas azul metalizadas. var 180952431086. stock 4.
--   SKU 123031 — SBLK-GUN OPTICS  negro brillo, patillas gunmetal. var 180952431088. stock 2.
--
-- Medidas: 137 / 49x46 / 20 / 145 mm. Peso 14,3g. Talle medium.
--
-- 📸 FOTOS (bucket products/vulk-clems/, ⚠️ PENDIENTE verificar HTTP 200 antes de
-- aplicar; al armar el seed la carpeta estaba vacía. Casing: CRY/SBLK en .jpg,
-- MBLK en .webp; medidas en .jpg):
--   CLEMS CRY P.jpg / CLEMS CRY F.jpg          (primary del modelo)
--   CLEMS MBLK P.webp / CLEMS MBLK F.webp
--   CLEMS SBLK P.jpg / CLEMS SBLK F.jpg
--   medidas.jpg
-- ============================================

BEGIN;

WITH
  vulk    AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM receta), 'vulk-clems-receta', 'Vulk Clems Receta',
  'Armazón de receta Vulk Clems: ovalado y ultra liviano (14,3g), frente de G-Flex con patillas de acero inoxidable y bisagra integrada. Apto monofocal, bifocal y progresivo. Viene con lentes demo.',
  E'El Vulk Clems es un armazón de receta **ovalado**, sobrio y **ultra liviano** (solo 14,3 g): de los más livianos del catálogo. El frente es de **G-Flex** —flexible y resistente— y las patillas son de **acero inoxidable** con terminal de goma ajustable y **bisagra integrada**, para un calce firme y cómodo.\n\nViene con lentes demo (sin graduación). Acepta tu receta: monofocales, bifocales y progresivos.\n\nDisponible en 3 colores:\n\n• CRY-GUN OPTICS (SKU 123036): transparente con patillas gunmetal.\n• MBLK-BLUE OPTICS (SKU 123030): frente negro mate con patillas azul metalizadas.\n• SBLK-GUN OPTICS (SKU 123031): negro brillo con patillas gunmetal.\n\nIncluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "ovalado",
    "temple_material": "acero-inoxidable",
    "hinge_system": "integrada",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "unisex",
    "line": "urbana",
    "measurements": {"frame_width_mm": 137, "lens_width_mm": 49, "lens_height_mm": 46, "bridge_mm": 20, "temple_length_mm": 145},
    "weight_grams": 14.3,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Ovalado ultra liviano (14,3 g)", "body": "De los armazones más livianos del catálogo. Frente de G-Flex flexible con patillas de acero inoxidable, terminal de goma ajustable y bisagra integrada. Talle medium."},
      {"type": "tip", "position": "middle", "title": "Compatible con tu receta", "body": "Acepta monofocales, bifocales y progresivos. Para progresivos tené en cuenta que el alto del lente es 46 mm — escribinos si tenés dudas con tu graduación."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con foto de tu receta. Te pasamos el costo del laboratorio según tu graduación + tratamientos (antirreflex, blue light, fotocromático). Armazón + cristales en 7-10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1436023889"], "imported_at": "2026-06-05"}
  }'::jsonb,
  true, false,
  'Vulk Clems Armazón de Receta Ovalado Ultra Liviano | Óptica Carballo',
  'Armazón de receta Vulk Clems: ovalado ultra liviano (14,3g), G-Flex + acero inoxidable, apto monofocal/bifocal/progresivo. 3 colores. Envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  -- MBLK = variante predeterminada (sort 1) por pedido del founder (2026-06-05).
  ((SELECT id FROM public.products WHERE slug='vulk-clems-receta'), '123030',
   '{"frame_color":"negro-mate","model_code":"MBLK-BLUE OPTICS"}'::jsonb,
   8341002, 4, true, 1, 'MLA1436023889', '180952431086'),
  ((SELECT id FROM public.products WHERE slug='vulk-clems-receta'), '123036',
   '{"frame_color":"transparente","model_code":"CRY-GUN OPTICS"}'::jsonb,
   8341002, 5, true, 2, 'MLA1436023889', '180952431090'),
  ((SELECT id FROM public.products WHERE slug='vulk-clems-receta'), '123031',
   '{"frame_color":"negro-brillo","model_code":"SBLK-GUN OPTICS"}'::jsonb,
   8341002, 2, true, 3, 'MLA1436023889', '180952431088')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: MBLK perfil (founder lo puso predeterminado 2026-06-05).
-- medidas SIEMPRE última (sort 9).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-clems-receta'), (SELECT id FROM public.product_variants WHERE sku='123036'),
   'vulk-clems/CLEMS CRY P.jpg', 'Armazón de receta Vulk Clems ovalado vista lateral, transparente con patillas gunmetal', 1500, 1000, 0, false),
  ((SELECT id FROM public.products WHERE slug='vulk-clems-receta'), (SELECT id FROM public.product_variants WHERE sku='123036'),
   'vulk-clems/CLEMS CRY F.jpg', 'Armazón de receta Vulk Clems ovalado vista frontal, transparente con patillas gunmetal', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-clems-receta'), (SELECT id FROM public.product_variants WHERE sku='123030'),
   'vulk-clems/CLEMS MBLK P.webp', 'Armazón de receta Vulk Clems ovalado vista lateral, negro mate con patillas azul metalizadas', 1500, 1000, 2, true),
  ((SELECT id FROM public.products WHERE slug='vulk-clems-receta'), (SELECT id FROM public.product_variants WHERE sku='123030'),
   'vulk-clems/CLEMS MBLK F.webp', 'Armazón de receta Vulk Clems ovalado vista frontal, negro mate con patillas azul metalizadas', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-clems-receta'), (SELECT id FROM public.product_variants WHERE sku='123031'),
   'vulk-clems/CLEMS SBLK P.jpg', 'Armazón de receta Vulk Clems ovalado vista lateral, negro brillo con patillas gunmetal', 1500, 1000, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-clems-receta'), (SELECT id FROM public.product_variants WHERE sku='123031'),
   'vulk-clems/CLEMS SBLK F.jpg', 'Armazón de receta Vulk Clems ovalado vista frontal, negro brillo con patillas gunmetal', 1500, 1000, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-clems-receta'), NULL,
   'vulk-clems/medidas.jpg', 'Esquema técnico de medidas Vulk Clems: frente 137mm, lente 49x46mm, puente 20mm, varilla 145mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
