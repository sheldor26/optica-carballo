-- ============================================
-- Seed 218: Vulk NETAGLIO (receta, G-Flex, rectangular, unisex), producto NUEVO con 3 variantes
-- Fecha: 2026-11-26
-- ============================================
-- ML: item MULTIVARIANTE MLA1664343869 (verificado por API el 2026-11-26, SKU por variación):
--   125571  MBLK  negro mate    variation 190038818726  $87.317,33  stock 3
--   125576  MRED  rojo mate     variation 208743224987  $87.317,33  stock 2
--   125572  CRY   transparente  variation 196504291001  $87.317,33  stock 1  (GTIN 008869986893)
--   Se ignoran las publicaciones de catálogo MLA1664331015 y MLA3226097926.
-- DATOS DEL FOUNDER (2026-11-24): frente y patillas de G-Flex, bisagras metálicas con sistema flex, rectangular (ML dice 'Cuadrada': manda el founder), unisex, apto para todo tipo de lentes (mono, bi y progresivos), lentes demo, 51-20-140, alto total 46, ancho total 144, 17,9 g. Las medidas de Vulk (55-20-145, talle Large) NO se usan.
-- 🎯 SEO (seo-strategist 2026-11-26): slug `vulk-netaglio-receta` (convención de receta; el cruce sol/receta de queries.ts depende del sufijo); title 'Vulk Netaglio Rectangular Unisex | Anteojos Recetados'; links a Dieven, Be Again, R-CY 02, hub Vulk y faceta rectangular; frase de vuelta UNA, en Dieven.
-- 🔬 Sin 'liviano' (17,9 g como dato), sin 'flexible' ('flex' sólo la bisagra), sin 'oficial', sin atribuir tratamientos a las lentes demo.
-- 📸 `pnpm fotos:subir --slug vulk-netaglio-receta --dir marketing/placas-ml/SUBIR-vulk-netaglio-<c>/web --sufijo -<c>` (medidas sólo con mblk). Scale override: sin entry (el anteojo ocupa ~92 % del ancho).
-- ============================================

BEGIN;

WITH
  vulk   AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  receta AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM receta), 'vulk-netaglio-receta', 'Vulk Netaglio',
  'Armazón de receta Vulk Netaglio, rectangular y unisex, con frente y patillas de G-Flex y bisagras metálicas con sistema flex. En negro mate, transparente o rojo mate.',
  E'Los **Vulk Netaglio** son **anteojos recetados** de armazón **rectangular y unisex**, para hombre y mujer. El **frente y las patillas son de G-Flex** y las **bisagras son metálicas con sistema flex**. Pesan 17,9 g.\n\n**Vienen con lentes de demostración**, sin graduación. El armazón es apto para todo tipo de lentes: monofocales, bifocales y progresivos.\n\nMedidas: lente 51 mm de ancho · puente 20 mm · varilla 140 mm · alto total 46 mm · ancho total 144 mm.\n\nDisponible en 3 colores:\n\n• **MBLK, negro mate** (SKU 125571).\n• **MRED, rojo mate** (SKU 125576).\n• **CRY, transparente** (SKU 125572).\n\nIncluye estuche, franela de microfibra y garantía de 1 año contra defectos de fabricación.\n\nSi preferís otro rectangular unisex, mirá los [Vulk Dieven Unisex](/anteojos-de-receta/vulk/vulk-dieven-receta); si buscás otro Vulk unisex con bisagras metálicas flex, los [Vulk Be Again](/anteojos-de-receta/vulk/vulk-be-again-receta); o un rectangular de otra marca, los [Rusty R-CY 02 Optics](/anteojos-de-receta/rusty/rusty-r-cy-02-receta). También podés ver [todos los anteojos de receta Vulk](/anteojos-de-receta/vulk) y [más anteojos de receta rectangulares](/anteojos-de-receta/rectangular).',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "rectangular",
    "gender": "unisex",
    "line": "urbana",
    "hinge_system": "flex",
    "hinge_material": "metal",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo"],
    "measurements": {"frame_width_mm": 144, "lens_width_mm": 51, "lens_height_mm": 46, "bridge_mm": 20, "temple_length_mm": 140},
    "weight_grams": 17.9,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-12-26",
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1664343869"], "imported_at": "2026-11-26"},
    "callouts": [
      {"type": "info", "position": "top", "title": "Rectangular unisex de G-Flex", "body": "Frente y patillas de G-Flex, con bisagras metálicas con sistema flex. Pesa 17,9 g. En negro mate, rojo mate y transparente."},
      {"type": "tip", "position": "middle", "title": "Monofocales, bifocales y progresivos", "body": "Apto para todo tipo de lentes: monofocales, bifocales y progresivos. Viene con lentes de demostración, sin graduación. Si tenés dudas con tu graduación, escribinos antes de comprar."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con una foto de tu receta y te pasamos el costo de los cristales según tu graduación."}
    ]
  }'::jsonb,
  true, false,
  'Vulk Netaglio Rectangular Unisex | Anteojos Recetados',
  'Anteojos recetados Vulk Netaglio: rectangulares, unisex, de G-Flex, en 3 colores. Para monofocales, bifocales y progresivos. Envíos a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-netaglio-receta'), '125571',
   '{"frame_color":"negro-mate","model_code":"MBLK OPTICAL"}'::jsonb,
   8731733, 3, true, 1, 'MLA1664343869', '190038818726'),
  ((SELECT id FROM public.products WHERE slug='vulk-netaglio-receta'), '125576',
   '{"frame_color":"rojo-mate","model_code":"MRED OPTICAL"}'::jsonb,
   8731733, 2, true, 2, 'MLA1664343869', '208743224987'),
  ((SELECT id FROM public.products WHERE slug='vulk-netaglio-receta'), '125572',
   '{"frame_color":"transparente","model_code":"CRY OPTICAL","gtin":"008869986893"}'::jsonb,
   8731733, 1, true, 3, 'MLA1664343869', '196504291001')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-netaglio-receta'), (SELECT id FROM public.product_variants WHERE sku='125571'),
   'vulk-netaglio-receta/perfil-mblk.jpg', 'Anteojos recetados Vulk Netaglio rectangulares, vista lateral, negro mate con lentes de demostración', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-netaglio-receta'), (SELECT id FROM public.product_variants WHERE sku='125571'),
   'vulk-netaglio-receta/frente-mblk.jpg', 'Anteojos recetados Vulk Netaglio rectangulares, vista frontal, negro mate con lentes de demostración', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-netaglio-receta'), (SELECT id FROM public.product_variants WHERE sku='125576'),
   'vulk-netaglio-receta/perfil-mred.jpg', 'Armazón de receta Vulk Netaglio rectangular, vista lateral, rojo mate con lentes de demostración', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-netaglio-receta'), (SELECT id FROM public.product_variants WHERE sku='125576'),
   'vulk-netaglio-receta/frente-mred.jpg', 'Armazón de receta Vulk Netaglio rectangular, vista frontal, rojo mate con lentes de demostración', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-netaglio-receta'), (SELECT id FROM public.product_variants WHERE sku='125572'),
   'vulk-netaglio-receta/perfil-cry.jpg', 'Anteojos de receta Vulk Netaglio unisex, vista lateral, transparente con lentes de demostración', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-netaglio-receta'), (SELECT id FROM public.product_variants WHERE sku='125572'),
   'vulk-netaglio-receta/frente-cry.jpg', 'Anteojos de receta Vulk Netaglio unisex, vista frontal, transparente con lentes de demostración', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-netaglio-receta'), NULL,
   'vulk-netaglio-receta/medidas-mblk.jpg', 'Esquema de medidas Vulk Netaglio: lente 51mm, puente 20mm, varilla 140mm, alto total 46mm, ancho total 144mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: UNA sola, en Dieven receta (rectangular unisex de Vulk, vecino directo).
UPDATE public.products
SET description = description || E'\n\nSi querés un rectangular unisex de Vulk con bisagras metálicas con sistema flex, mirá también los [Vulk Netaglio](/anteojos-de-receta/vulk/vulk-netaglio-receta).', updated_at = now()
WHERE slug = 'vulk-dieven-receta' AND description NOT LIKE '%vulk-netaglio%';

COMMIT;
