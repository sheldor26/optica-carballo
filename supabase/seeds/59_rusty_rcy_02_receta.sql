-- ============================================
-- Seed 59: Rusty R-CY 02 RECETA (armazón óptico) — rectangular, ECOLÓGICO/reciclado, ultra liviano
-- Fecha: 2026-06-11
-- ============================================
-- Armazón de receta RECTANGULAR, ecológico (materiales reciclados), ULTRA liviano
-- (11,3g). Bisagras metálicas. Unisex. Categoría anteojos-de-receta. Convención
-- receta: lens_compatibility + hinge_system (sin lens_material/treatment/polarized).
-- frame_material OMITIDO a propósito: el ML dice "reciclado" pero no especifica el
-- polímero base; lo ecológico va en descripción + callout (no inventamos material).
--
-- 5 variantes en 1 MLA multi-variante (MLA1388464699). Todas $84.592,27. Stock + var
-- traídos de la API ML (scripts/ml-item.ts):
--   MBLK Negro Mate    var 188766461829  stock 2  (PRIMARY, default)
--   SBLK Negro Brillo  var 188766461831  stock 2  (REUSA fotos de MBLK — copia en bucket)
--   STEEL BLUE         var 178752745788  stock 1
--   SBLUE              var 178752745790  stock 0
--   LGREY              var 178752745792  stock 0
--
-- ⚠️ SKU: el founder pasó 960186 (MBLK+SBLK+STEEL BLUE), 960187 (SBLUE), 960188 (LGREY).
--   960186 se repite en 3 colores, pero product_variants.sku es UNIQUE → derivamos SKU
--   únicos con sufijo de color para los compartidos. El sync usa mercadolibre_variation_code
--   (único), no el sku. Confirmar con founder si quiere otros SKU.
--
-- Medidas: 140 / 54x38 / 18 / 135 mm. Peso 11,3g.
--
-- 📸 FOTOS (bucket products/rusty-r-cy-02/, ⚠️ PENDIENTE: subir + verificar HTTP 200 antes
-- de aplicar; SBLK reusa las de MBLK → copiar los archivos de MBLK con nombre SBLK en el
-- bucket, patrón CCCP por el constraint UNIQUE(product_id,storage_path)). Primaria = perfil (P):
--   R-CY 02 MBLK P GALERIA.jpg / R-CY 02 MBLK F GALERIA.jpg   (primary del modelo)
--   R-CY 02 SBLK P GALERIA.jpg / R-CY 02 SBLK F GALERIA.jpg   (copias de MBLK)
--   R-CY 02 STEEL BLUE P GALERIA.jpg / ... F ...
--   R-CY 02 SBLUE P GALERIA.jpg / ... F ...
--   R-CY 02 L GREY P GALERIA.jpg / ... F ...
--   medidas.jpg
-- ============================================

BEGIN;

WITH
  rusty   AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-r-cy-02-receta', 'Rusty R-CY 02 Receta',
  'Armazón de receta Rusty R-CY 02: rectangular, ecológico (materiales reciclados) y ultra liviano (11,3g), con bisagras metálicas. Diseño unisex. Apto monofocal, bifocal y progresivo.',
  E'El Rusty R-CY 02 es un armazón de receta **rectangular**, sobrio y unisex, con una impronta consciente: está hecho con **materiales reciclados**. Es **ultra liviano** (solo 11,3 g), así que te olvidás de que lo tenés puesto, y suma **bisagras metálicas** que le dan durabilidad y aguante en el uso diario.\n\nViene con lentes demo (sin graduación). Acepta tu receta: monofocales, bifocales y progresivos.\n\nDisponible en 5 colores:\n\n• MBLK — negro mate.\n• SBLK — negro brillo.\n• STEEL BLUE — azul acero.\n• SBLUE — azul.\n• L GREY — gris claro.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_shape": "rectangular",
    "hinge_system": "metalica",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "unisex",
    "line": "urbana",
    "eco_friendly": true,
    "measurements": {"frame_width_mm": 140, "lens_width_mm": 54, "lens_height_mm": 38, "bridge_mm": 18, "temple_length_mm": 135},
    "weight_grams": 11.3,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Ecológico y ultra liviano (11,3 g)", "body": "Hecho con materiales reciclados, una elección más consciente. De los armazones más livianos del catálogo, con bisagras metálicas para mayor durabilidad. Forma rectangular, unisex."},
      {"type": "tip", "position": "middle", "title": "Compatible con tu receta", "body": "Acepta monofocales, bifocales y progresivos. Para progresivos tené en cuenta que el alto del lente es 38 mm — escribinos si tenés dudas con tu graduación."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con foto de tu receta. Te pasamos el costo del laboratorio según tu graduación + tratamientos (antirreflex, blue light, fotocromático). Armazón + cristales en 7-10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1388464699"], "imported_at": "2026-06-11"}
  }'::jsonb,
  true, false,
  'Rusty R-CY 02 Armazón de Receta Rectangular Ecológico Ultra Liviano | Óptica Carballo',
  'Armazón de receta Rusty R-CY 02: rectangular, ecológico (reciclado) y ultra liviano (11,3g), bisagras metálicas, unisex. Apto monofocal/bifocal/progresivo. 5 colores. Envíos a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = MBLK (default). SKU únicos derivados (ver nota de cabecera).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-r-cy-02-receta'), '960186-MBLK',
   '{"frame_color":"negro-mate","model_code":"MBLK OPTICS"}'::jsonb,
   8459227, 2, true, 1, 'MLA1388464699', '188766461829'),
  ((SELECT id FROM public.products WHERE slug='rusty-r-cy-02-receta'), '960186-SBLK',
   '{"frame_color":"negro-brillo","model_code":"SBLK OPTICS"}'::jsonb,
   8459227, 2, true, 2, 'MLA1388464699', '188766461831'),
  ((SELECT id FROM public.products WHERE slug='rusty-r-cy-02-receta'), '960186-STEELBLUE',
   '{"frame_color":"azul-acero","model_code":"STEEL BLUE OPTICS"}'::jsonb,
   8459227, 1, true, 3, 'MLA1388464699', '178752745788'),
  ((SELECT id FROM public.products WHERE slug='rusty-r-cy-02-receta'), '960187',
   '{"frame_color":"azul","model_code":"SBLUE OPTICS"}'::jsonb,
   8459227, 0, true, 4, 'MLA1388464699', '178752745790'),
  ((SELECT id FROM public.products WHERE slug='rusty-r-cy-02-receta'), '960188',
   '{"frame_color":"gris-claro","model_code":"L GREY OPTICS"}'::jsonb,
   8459227, 0, true, 5, 'MLA1388464699', '178752745792')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: MBLK perfil (P). SBLK reusa las fotos de MBLK (copias en
-- bucket con nombre SBLK). medidas SIEMPRE última.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-r-cy-02-receta'), (SELECT id FROM public.product_variants WHERE sku='960186-MBLK'),
   'rusty-r-cy-02/R-CY 02 MBLK P GALERIA.jpg', 'Armazón de receta Rusty R-CY 02 rectangular vista lateral, negro mate', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-r-cy-02-receta'), (SELECT id FROM public.product_variants WHERE sku='960186-MBLK'),
   'rusty-r-cy-02/R-CY 02 MBLK F GALERIA.jpg', 'Armazón de receta Rusty R-CY 02 rectangular vista frontal, negro mate', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-r-cy-02-receta'), (SELECT id FROM public.product_variants WHERE sku='960186-SBLK'),
   'rusty-r-cy-02/R-CY 02 SBLK P GALERIA.jpg', 'Armazón de receta Rusty R-CY 02 rectangular vista lateral, negro brillo', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-r-cy-02-receta'), (SELECT id FROM public.product_variants WHERE sku='960186-SBLK'),
   'rusty-r-cy-02/R-CY 02 SBLK F GALERIA.jpg', 'Armazón de receta Rusty R-CY 02 rectangular vista frontal, negro brillo', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-r-cy-02-receta'), (SELECT id FROM public.product_variants WHERE sku='960186-STEELBLUE'),
   'rusty-r-cy-02/R-CY 02 STEEL BLUE P GALERIA.jpg', 'Armazón de receta Rusty R-CY 02 rectangular vista lateral, azul acero', 1500, 1000, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-r-cy-02-receta'), (SELECT id FROM public.product_variants WHERE sku='960186-STEELBLUE'),
   'rusty-r-cy-02/R-CY 02 STEEL BLUE F GALERIA.jpg', 'Armazón de receta Rusty R-CY 02 rectangular vista frontal, azul acero', 1500, 1000, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-r-cy-02-receta'), (SELECT id FROM public.product_variants WHERE sku='960187'),
   'rusty-r-cy-02/R-CY 02 SBLUE P GALERIA.jpg', 'Armazón de receta Rusty R-CY 02 rectangular vista lateral, azul', 1500, 1000, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-r-cy-02-receta'), (SELECT id FROM public.product_variants WHERE sku='960187'),
   'rusty-r-cy-02/R-CY 02 SBLUE F GALERIA.jpg', 'Armazón de receta Rusty R-CY 02 rectangular vista frontal, azul', 1500, 1000, 7, false),
  ((SELECT id FROM public.products WHERE slug='rusty-r-cy-02-receta'), (SELECT id FROM public.product_variants WHERE sku='960188'),
   'rusty-r-cy-02/R-CY 02 L GREY  P GALERIA.jpg', 'Armazón de receta Rusty R-CY 02 rectangular vista lateral, gris claro', 1500, 1000, 8, false),
  ((SELECT id FROM public.products WHERE slug='rusty-r-cy-02-receta'), (SELECT id FROM public.product_variants WHERE sku='960188'),
   'rusty-r-cy-02/R-CY 02 L GREY  F GALERIA.jpg', 'Armazón de receta Rusty R-CY 02 rectangular vista frontal, gris claro', 1500, 1000, 9, false),
  ((SELECT id FROM public.products WHERE slug='rusty-r-cy-02-receta'), NULL,
   'rusty-r-cy-02/medidas.webp', 'Esquema técnico de medidas Rusty R-CY 02: frente 140mm, lente 54x38mm, puente 18mm, varilla 135mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
