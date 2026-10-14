-- ============================================
-- Seed 177: Rusty Burrout Optics RECETA (Outdoor Expedition), rectangular en TR90, unisex, 2 colores
-- Fecha: 2026-10-14
-- ============================================
-- 2 PUBLICACIONES TRADICIONALES de ML (items simples, `variation_code` NULL, `catalog_listing:false`, categoría MLA417127), ACTIVAS, verificadas por API el 2026-10-14 (las gemelas de catálogo se ignoran, p. ej. MLA1675683411):
--   C2  SKU 958241  MLA1675670339 (MLAU3793087756)  $98.290 → 9829000c  stock 4  negro mate con detalles rojos (la C2 ya estaba en ML; el founder actualizó la descripción)
--   C4  SKU 958242  MLA4075825140 (MLAU5489849741)  $98.220 → 9822000c  stock 3  azul mate con detalles negros (publicada por el founder el 2026-10-14)
--   Stock y precio mandan desde ML. Sin GTIN cargado en el sitio.
--
-- DATOS DEL FOUNDER (2026-10-14): poliamida TR90 (Grilamid), patillas con terminaciones de goma, bisagras plásticas reforzadas SIN flex, rectangular "no muy grande", 16,8 g, **55-16-143, alto total 39, ancho total 142**. Unisex (confirmado). Lentes demo estándar: NO Blue Cut (la web de Rusty lo dice, el founder lo desmintió).
-- ⚠️ CRITERIO: el SITIO no menciona Blue Cut. NO se promociona para progresivos: alto total 39 mm, hueco real estimado 31-35 mm SIN MEDIR (optical-expert) => `lens_compatibility` sólo monofocal y bifocal, sin callout de progresivos ni "todo tipo de lentes".
-- 🔬 optical-expert: "poliamida TR90" ok, "liviano" (no "ultraliviano"), nunca "flexible" ni "resistente a impactos"/"alta durabilidad"; bisagras "plásticas reforzadas" y nada más; terminales de goma "para mayor agarre"; talle mediano (sin `size_fit`: el tipo sólo admite junior/chico/infantil); face shapes ovalado/redondo/corazón.
-- 🎯 SEO (seo-strategist): slug `rusty-burrout-receta`, name `Rusty Burrout Optics`, carril = TR90 (`tr90 anteojos`, `anteojos tr90`, `lentes tr90`; ningún otro Rusty receta es TR90) + branded `rusty burrout`; sin "deportivos" como keyword (sólo "Outdoor Expedition" una vez en el cuerpo); links a Arms, PRO 30, R-CY 02 y hub; frase de vuelta sólo en Arms.
-- 📸 FOTOS: oficiales de Rusty (900×442) pasadas por `pnpm placas --tipo receta` y subidas con `pnpm fotos:subir --sufijo`: `rusty-burrout-receta/perfil|frente-c2|c4.jpg`, `medidas-c2.jpg` (2000×1333, scale 1.05) y `estuche.jpg` (1500×1500, estuche + franela + garantía, compartida, sin scale).
-- ============================================

BEGIN;

WITH
  rusty  AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-burrout-receta', 'Rusty Burrout Optics',
  'Armazón de receta Rusty Burrout Optics en poliamida TR90 (Grilamid), rectangular y liviano (16,8 g), con terminales de goma para mayor agarre. En negro mate con detalles rojos o azul mate con detalles negros.',
  E'Los **Rusty Burrout** son **anteojos recetados** de armazón **rectangular**, unisex, de la línea Outdoor Expedition de Rusty. Están hechos en **poliamida TR90 (Grilamid)** y son livianos: 16,8 g. Las patillas terminan en **goma, para mayor agarre**, y las **bisagras son plásticas reforzadas**.\n\n**Viene con lentes de demostración**, sin graduación, para que pruebes el armazón. Sumale tus cristales con receta: monofocales o bifocales.\n\nMedidas: frente 142 mm · lente 55 mm de ancho · puente 16 mm · varilla 143 mm · alto total 39 mm. Es un talle mediano.\n\nDisponible en 2 colores:\n\n• **C2, negro mate con detalles rojos.**\n• **C4, azul mate con detalles negros.**\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi buscás otro rectangular, mirá los [Rusty Arms Optics](/anteojos-de-receta/rusty/rusty-arms-receta), en G-Flex; si preferís un cuadrado más grande, los [Rusty PRO 30 Optics](/anteojos-de-receta/rusty/rusty-pro-30-receta); y si te gusta la línea de Rusty, los [Rusty R-CY 02 Optics](/anteojos-de-receta/rusty/rusty-r-cy-02-receta). También podés ver [todos los anteojos de receta Rusty](/anteojos-de-receta/rusty).',
  '{
    "frame_material": "tr-90",
    "temple_material": "tr-90",
    "frame_shape": "rectangular",
    "hinge_system": "plastica reforzada",
    "lens_compatibility": ["monofocal", "bifocal"],
    "recommended_face_shapes": ["ovalado", "redondo", "corazon"],
    "gender": "unisex",
    "weight_grams": 16.8,
    "measurements": {"frame_width_mm": 142, "lens_width_mm": 55, "lens_height_mm": 39, "bridge_mm": 16, "temple_length_mm": 143},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-14",
    "callouts": [
      {"type": "info", "position": "top", "title": "Rectangular, liviano y unisex", "body": "Poliamida TR90 (Grilamid), 16,8 g, con terminales de goma para mayor agarre y bisagras plásticas reforzadas. En negro mate con detalles rojos o azul mate con detalles negros."},
      {"type": "tip", "position": "middle", "title": "Pensado para monofocales y bifocales", "body": "Acepta cristales monofocales y bifocales. Si tenés dudas con tu receta, escribinos antes de comprar."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con una foto de tu receta. Te pasamos el costo de los cristales según tu graduación y los tratamientos que quieras (antirreflejo, fotocromático)."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1675670339", "MLA4075825140"], "imported_at": "2026-10-14"}
  }'::jsonb,
  true, false,
  'Rusty Burrout Optics Liviano en TR90 | Anteojos de Receta',
  'Anteojos de receta Rusty Burrout Optics: armazón rectangular de TR90, liviano (16,8 g), con patillas de goma. Envíos a todo el país y garantía de 1 año.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 2 variantes: items simples de ML (variation_code NULL). Primaria = C2 (la que ya vendía en ML).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-burrout-receta'), '958241',
   '{"frame_color":"negro-mate-detalles-rojos","model_code":"C2"}'::jsonb,
   9829000, 4, true, 1, 'MLA1675670339', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-burrout-receta'), '958242',
   '{"frame_color":"azul-mate-detalles-negros","model_code":"C4"}'::jsonb,
   9822000, 3, true, 2, 'MLA4075825140', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Primaria = perfil de la C2. estuche.jpg (sort 98) y medidas-c2.jpg (sort 99, siempre última) con variant_id NULL.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-burrout-receta'), (SELECT id FROM public.product_variants WHERE sku='958241'),
   'rusty-burrout-receta/perfil-c2.jpg', 'Anteojos de receta Rusty Burrout rectangulares de TR90, vista lateral, negro mate con detalles rojos y lentes de demostración', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-burrout-receta'), (SELECT id FROM public.product_variants WHERE sku='958241'),
   'rusty-burrout-receta/frente-c2.jpg', 'Anteojos de receta Rusty Burrout rectangulares de TR90, vista frontal, negro mate con detalles rojos y lentes de demostración', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-burrout-receta'), (SELECT id FROM public.product_variants WHERE sku='958242'),
   'rusty-burrout-receta/perfil-c4.jpg', 'Anteojos de receta Rusty Burrout rectangulares de TR90, vista lateral, azul mate con detalles negros y lentes de demostración', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-burrout-receta'), (SELECT id FROM public.product_variants WHERE sku='958242'),
   'rusty-burrout-receta/frente-c4.jpg', 'Anteojos de receta Rusty Burrout rectangulares de TR90, vista frontal, azul mate con detalles negros y lentes de demostración', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-burrout-receta'), NULL,
   'rusty-burrout-receta/estuche.jpg', 'Estuche, franela y garantía que vienen con los anteojos de receta Rusty Burrout', 1500, 1500, 98, false),
  ((SELECT id FROM public.products WHERE slug='rusty-burrout-receta'), NULL,
   'rusty-burrout-receta/medidas-c2.jpg', 'Esquema técnico de medidas Rusty Burrout: frente 142mm, lente 55mm, alto total 39mm, puente 16mm, varilla 143mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: sólo en Arms receta (el rectangular más cercano).
UPDATE public.products
SET description = description || E'\n\nSi buscás un rectangular liviano en TR90, con patillas de goma, mirá los [Rusty Burrout Optics](/anteojos-de-receta/rusty/rusty-burrout-receta).', updated_at = now()
WHERE slug = 'rusty-arms-receta' AND description NOT LIKE '%rusty-burrout-receta%';

COMMIT;
