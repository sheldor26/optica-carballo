-- ============================================
-- Seed 78: Rusty Zinz Optics RECETA (armazón óptico) — cuadrado unisex, G-Flex
-- Fecha: 2026-06-30
-- ============================================
-- Armazón de receta CUADRADO UNISEX, frente y patillas G-Flex, bisagras metálicas
-- flex (al callout), lentes demo, 25,7 g. Categoría anteojos-de-receta. Convención
-- receta: SOLO lens_compatibility (SIN lens_material/treatment/category/polarized/uv
-- — el armazón viene con lentes demo, el cliente carga su graduación).
--
-- 3 variantes en ITEMS SIMPLES (cada color es un MLA propio → mercadolibre_variation_code
-- = NULL; el reconciliador de stock usa mercadolibre_item_id). Precio/stock/SKU de la
-- API ML (scripts/ml-item.ts) + SKU pasados por el founder:
--   669K-SBLK OPTICAL SKU 126803 MLA2053711666 $82.745,69 → 8274500 cents stock 1 (gris oscuro / patillas negro brillo)
--   MBLK      OPTICAL SKU 126800 MLA2016918974 $82.745,69 → 8274500 cents stock 1 (negro mate)
--   SBLK      OPTICAL SKU 126801 MLA1866189073 $79.790    → 7979000 cents stock 2 (negro brillo, PRIMARY +stock)
-- (Precio $82.745,69 → 8274500 cents: el catálogo no maneja decimales de centavo.)
-- ⚠️ ML tiene duplicados de algunas variantes (MBLK MLA2017035964; SBLK MLA1866313867) —
-- se usa 1 MLA de cada color (el de mayor stock / el listado activo).
--
-- Peso 25,7 g (founder). Medidas: 137 / 51x42 / 20 / 145 mm (de la foto medidas.png).
-- frame_material + temple_material g-flex. Bisagras metálicas flex → callout, no campo.
--
-- 📸 FOTOS (bucket products/rusty-zinz-receta/ — 7 archivos; 1200×589 las de producto
-- ratio 2.04:1 panorámico; naming con guiones). Primaria = perfil SBLK (negro brillo,
-- +stock). Cada variante con perfil+frente propio → NO CCCP. Scale perfil 1.1 / frente
-- 1.0 (1200×589 con anteojo ~90% del frame, mismo encuadre que Patien/The Take receta;
-- reverificar grid post-deploy, sub-regla 15). medidas.png en 1.0 (no entra al grid).
-- ============================================

BEGIN;

WITH
  rusty   AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-zinz-receta', 'Rusty Zinz Optics',
  'Anteojos recetados Rusty Zinz: armazón cuadrado unisex, liviano (25,7 g) con frente y patillas de G-Flex flexibles y bisagras metálicas flex. Comprás el armazón (viene con lentes demo, sin aumento) y le sumás los cristales según tu receta; el precio publicado es del armazón, los cristales se cotizan aparte.',
  E'El **Rusty Zinz Optics** es un armazón de receta **cuadrado unisex**, liviano (25,7 g), con **frente y patillas de G-Flex** —flexible y resistente— y **bisagras metálicas flex** para un calce cómodo y durable.\n\nMedidas: frente 137 mm · lente 51 mm de ancho × 42 mm de alto · puente 20 mm · varilla 145 mm.\n\nViene con lentes demo (sin graduación). Sumale tus cristales con receta: monofocales, bifocales, progresivos o multifocales.\n\nDisponible en 3 colores:\n\n• 669K-SBLK — gris oscuro con patillas negro brillo.\n• MBLK — negro mate.\n• SBLK — negro brillo.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "cuadrado",
    "temple_material": "g-flex",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "unisex",
    "line": "urbana",
    "measurements": {"frame_width_mm": 137, "lens_width_mm": 51, "lens_height_mm": 42, "bridge_mm": 20, "temple_length_mm": 145},
    "weight_grams": 25.7,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado unisex liviano (25,7 g)", "body": "Frente y patillas de G-Flex flexible con bisagras metálicas flex. Forma cuadrada, para hombre o mujer."},
      {"type": "tip", "position": "middle", "title": "Apto para tu graduación", "body": "Acepta lentes monofocales, bifocales, progresivos y multifocales. Si tenés dudas con tu receta o querés saber si te sirve para progresivos, escribinos antes de comprar."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con foto de tu receta. Te pasamos el costo del laboratorio según tu graduación + tratamientos (antirreflex, blue light, fotocromático). Armazón + cristales en 7-10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2053711666", "MLA2016918974", "MLA1866189073"], "imported_at": "2026-06-30"}
  }'::jsonb,
  true, false,
  'Armazón de Receta Rusty Zinz Cuadrado | Óptica Carballo',
  'Armazón de receta Rusty Zinz: cuadrado unisex, G-Flex liviano (25,7g), bisagras metálicas flex, 3 colores. Apto monofocal y multifocal. Envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = SBLK (primary, +stock). Items simples → variation_code = NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-zinz-receta'), '126801',
   '{"frame_color":"negro-brillo","model_code":"SBLK OPTICAL"}'::jsonb,
   7979000, 2, true, 1, 'MLA1866189073', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-zinz-receta'), '126803',
   '{"frame_color":"gris-oscuro-negro","model_code":"669K-SBLK OPTICAL"}'::jsonb,
   8274500, 1, true, 2, 'MLA2053711666', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-zinz-receta'), '126800',
   '{"frame_color":"negro-mate","model_code":"MBLK OPTICAL"}'::jsonb,
   8274500, 1, true, 3, 'MLA2016918974', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = SBLK perfil. medidas SIEMPRE última (sort 99).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-zinz-receta'), (SELECT id FROM public.product_variants WHERE sku='126801'),
   'rusty-zinz-receta/ZINZ-SBLK-PERFIL.jpg', 'Anteojos de receta Rusty Zinz cuadrado unisex vista lateral, negro brillo', 1200, 589, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-zinz-receta'), (SELECT id FROM public.product_variants WHERE sku='126801'),
   'rusty-zinz-receta/ZINZ-SBLK-FRENTE.jpg', 'Anteojos de receta Rusty Zinz cuadrado unisex vista frontal, negro brillo', 1200, 589, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zinz-receta'), (SELECT id FROM public.product_variants WHERE sku='126803'),
   'rusty-zinz-receta/ZINZ-669K-SBLK-PERFIL.jpg', 'Anteojos de receta Rusty Zinz cuadrado unisex vista lateral, gris oscuro con patillas negro brillo', 1200, 589, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zinz-receta'), (SELECT id FROM public.product_variants WHERE sku='126803'),
   'rusty-zinz-receta/ZINZ-669K-SBLK-FRENTE.jpg', 'Anteojos de receta Rusty Zinz cuadrado unisex vista frontal, gris oscuro con patillas negro brillo', 1200, 589, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zinz-receta'), (SELECT id FROM public.product_variants WHERE sku='126800'),
   'rusty-zinz-receta/ZINZ-MBLK-PERFIL.jpg', 'Anteojos de receta Rusty Zinz cuadrado unisex vista lateral, negro mate', 1200, 589, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zinz-receta'), (SELECT id FROM public.product_variants WHERE sku='126800'),
   'rusty-zinz-receta/ZINZ-MBLK-FRENTE.jpg', 'Anteojos de receta Rusty Zinz cuadrado unisex vista frontal, negro mate', 1200, 589, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zinz-receta'), NULL,
   'rusty-zinz-receta/medidas.png', 'Esquema técnico de medidas Rusty Zinz: frente 137mm, lente 51x42mm, puente 20mm, varilla 145mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
