-- ============================================
-- Seed 178: Rusty Midwest Optics RECETA (Outdoor Expedition), rectangular en TR90, unisex, 3 colores
-- Fecha: 2026-10-14
-- ============================================
-- 3 PUBLICACIONES TRADICIONALES de ML (items simples, `variation_code` NULL, `catalog_listing:false`, categoría MLA417127), ACTIVAS, verificadas por API el 2026-10-14 (las gemelas de catálogo MLA2866702554, MLA2191940621 y MLA2191940623 se ignoran):
--   C1  SKU 958220  MLA1675773841 (MLAU3783485739)  $103.488,39 → 10348839c  stock 3  negro mate con detalles azul oscuro (ya estaba en ML)
--   C2  SKU 958221  MLA4075876622 (MLAU5489968499)  $103.488,39 → 10348839c  stock 2  negro mate con detalles rojos
--   C3  SKU 958222  MLA4075876624 (MLAU5489968501)  $103.488,39 → 10348839c  stock 3  transparente con detalles negros
--   ⚠️ En ML la publicación de la C2 tiene cargado SELLER_SKU 958222 (el de la C3): el founder tiene que corregirlo a 958221. Acá la C2 va con el SKU 958221 (el que informó el founder).
--   Stock y precio mandan desde ML. Sin GTIN cargado en el sitio.
--
-- DATOS DEL FOUNDER (2026-10-14): poliamida TR90 (Grilamid), terminaciones de patilla de goma, bisagras plásticas reforzadas SIN flex, unisex, 18,2 g, **55-16-143, ancho total 142, alto total 42** (lo escribió invertido y lo corrigió). "Se pueden adaptar todo tipo de lentes": NO se promociona así.
-- ⚠️ CRITERIO: el SITIO no menciona Blue Cut (la web de Rusty lo dice; el founder confirmó que los lentes demo son estándar, sin filtro).
-- PROGRESIVOS: el founder confirmó (2026-10-14, "acepta lentes progresivas") que el armazón los acepta: `lens_compatibility` incluye "progresivo". Alto total 42 mm, hueco real estimado ~35-38 mm SIN MEDIR (optical-expert), así que el texto es prudente: corredor corto + DIP y altura de montaje con el armazón puesto (mismo criterio que Blica).
-- 🔬 optical-expert: forma "rectangular" (no wayfarer ni cuadrado); "poliamida TR90 (Grilamid)"; "liviano" (no "ultraliviano"); bisagras "plásticas reforzadas" y nada más (ni "flex" ni "sin flex"); terminaciones de goma "para mayor agarre"; sin "flexible"/"resistente a impactos"/"antideslizante"; C3 = "transparente con detalles negros" (no "cristal"); talle mediano (sin `size_fit`: el tipo sólo admite junior/chico/infantil); face shapes ovalado/redondo/corazón.
-- 🎯 SEO (seo-strategist): slug `rusty-midwest-receta`, name `Rusty Midwest Optics`, carril = branded `rusty midwest` + `anteojos recetados` una vez; TR90 NO es carril (lo tiene Burrout: sólo dato técnico), sin carril de transparente (1 de 3 colores); links a Burrout, Arms, R-CY 02 y hub; frase de vuelta sólo en Burrout.
-- 📸 FOTOS: oficiales de Rusty (900×442) pasadas por `pnpm placas --tipo receta` y subidas con `pnpm fotos:subir --sufijo`: `rusty-midwest-receta/perfil|frente-c1|c2|c3.jpg`, `medidas-c1.jpg` (2000×1333, scale 1.05) y `estuche.jpg` (1500×1500, compartida, sin scale).
-- ============================================

BEGIN;

WITH
  rusty  AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-midwest-receta', 'Rusty Midwest Optics',
  'Armazón de receta Rusty Midwest Optics en poliamida TR90 (Grilamid), rectangular y liviano (18,2 g), con terminaciones de goma en las patillas para mayor agarre. En negro mate con detalles azules o rojos, o transparente con detalles negros.',
  E'Los **Rusty Midwest** son **anteojos recetados** de armazón **rectangular de líneas rectas**, con la parte inferior en diagonal hacia las patillas. Son unisex, de la línea Outdoor Expedition de Rusty, hechos en **poliamida TR90 (Grilamid)** y livianos: 18,2 g. Las patillas terminan en **goma, para mayor agarre**, y las **bisagras son plásticas reforzadas**.\n\n**Viene con lentes de demostración**, sin graduación, para que pruebes el armazón. Sumale tus cristales con receta: monofocales, bifocales o progresivos. Para progresivos, el hueco del cristal es moderado: trabajamos con diseños de corredor corto y tomamos tu distancia pupilar y la altura de montaje con el armazón puesto.\n\nMedidas: frente 142 mm · lente 55 mm de ancho · puente 16 mm · varilla 143 mm · alto total 42 mm. Es un talle mediano.\n\nDisponible en 3 colores:\n\n• **C1, negro mate con detalles azul oscuro.**\n• **C2, negro mate con detalles rojos.**\n• **C3, transparente con detalles negros.**\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi buscás otro rectangular liviano, mirá los [Rusty Burrout Optics](/anteojos-de-receta/rusty/rusty-burrout-receta), de la misma línea; si preferís uno en G-Flex con bisagras flex, los [Rusty Arms Optics](/anteojos-de-receta/rusty/rusty-arms-receta); y si te gusta la línea de Rusty, los [Rusty R-CY 02 Optics](/anteojos-de-receta/rusty/rusty-r-cy-02-receta). También podés ver [todos los anteojos de receta Rusty](/anteojos-de-receta/rusty).',
  '{
    "frame_material": "tr-90",
    "temple_material": "tr-90",
    "frame_shape": "rectangular",
    "hinge_system": "plastica reforzada",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo"],
    "recommended_face_shapes": ["ovalado", "redondo", "corazon"],
    "gender": "unisex",
    "weight_grams": 18.2,
    "measurements": {"frame_width_mm": 142, "lens_width_mm": 55, "lens_height_mm": 42, "bridge_mm": 16, "temple_length_mm": 143},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-14",
    "callouts": [
      {"type": "info", "position": "top", "title": "Rectangular, liviano y unisex", "body": "Poliamida TR90 (Grilamid), 18,2 g, con terminaciones de goma en las patillas para mayor agarre y bisagras plásticas reforzadas. En negro mate con detalles azules o rojos, o transparente con detalles negros."},
      {"type": "tip", "position": "middle", "title": "Monofocales, bifocales y progresivos", "body": "Acepta cristales monofocales, bifocales y progresivos. Para progresivos usamos un diseño de corredor corto y tomamos tu distancia pupilar y la altura de montaje con el armazón puesto."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con una foto de tu receta. Te pasamos el costo de los cristales según tu graduación y los tratamientos que quieras (antirreflejo, fotocromático)."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1675773841", "MLA4075876622", "MLA4075876624"], "imported_at": "2026-10-14"}
  }'::jsonb,
  true, false,
  'Rusty Midwest Optics Patillas de Goma | Anteojos de Receta',
  'Anteojos de receta Rusty Midwest Optics: rectangulares, livianos (18,2 g), con patillas de goma y 3 colores. Envíos a todo el país y garantía de 1 año.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 3 variantes: items simples de ML (variation_code NULL). Primaria = C1 (la que ya estaba en ML).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-midwest-receta'), '958220',
   '{"frame_color":"negro-mate-detalles-azul-oscuro","model_code":"C1"}'::jsonb,
   10348839, 3, true, 1, 'MLA1675773841', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-midwest-receta'), '958221',
   '{"frame_color":"negro-mate-detalles-rojos","model_code":"C2"}'::jsonb,
   10348839, 2, true, 2, 'MLA4075876622', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-midwest-receta'), '958222',
   '{"frame_color":"transparente-detalles-negros","model_code":"C3"}'::jsonb,
   10348839, 3, true, 3, 'MLA4075876624', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Primaria = perfil de la C1. estuche.jpg (sort 98) y medidas-c1.jpg (sort 99, siempre última) con variant_id NULL.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-midwest-receta'), (SELECT id FROM public.product_variants WHERE sku='958220'),
   'rusty-midwest-receta/perfil-c1.jpg', 'Anteojos de receta Rusty Midwest rectangulares de TR90, vista lateral, negro mate con detalles azul oscuro y lentes de demostración', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-midwest-receta'), (SELECT id FROM public.product_variants WHERE sku='958220'),
   'rusty-midwest-receta/frente-c1.jpg', 'Anteojos de receta Rusty Midwest rectangulares de TR90, vista frontal, negro mate con detalles azul oscuro y lentes de demostración', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-midwest-receta'), (SELECT id FROM public.product_variants WHERE sku='958221'),
   'rusty-midwest-receta/perfil-c2.jpg', 'Anteojos de receta Rusty Midwest rectangulares de TR90, vista lateral, negro mate con detalles rojos y lentes de demostración', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-midwest-receta'), (SELECT id FROM public.product_variants WHERE sku='958221'),
   'rusty-midwest-receta/frente-c2.jpg', 'Anteojos de receta Rusty Midwest rectangulares de TR90, vista frontal, negro mate con detalles rojos y lentes de demostración', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-midwest-receta'), (SELECT id FROM public.product_variants WHERE sku='958222'),
   'rusty-midwest-receta/perfil-c3.jpg', 'Anteojos de receta Rusty Midwest rectangulares de TR90, vista lateral, transparente con detalles negros y lentes de demostración', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-midwest-receta'), (SELECT id FROM public.product_variants WHERE sku='958222'),
   'rusty-midwest-receta/frente-c3.jpg', 'Anteojos de receta Rusty Midwest rectangulares de TR90, vista frontal, transparente con detalles negros y lentes de demostración', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-midwest-receta'), NULL,
   'rusty-midwest-receta/estuche.jpg', 'Estuche, franela y garantía que vienen con los anteojos de receta Rusty Midwest', 1500, 1500, 98, false),
  ((SELECT id FROM public.products WHERE slug='rusty-midwest-receta'), NULL,
   'rusty-midwest-receta/medidas-c1.jpg', 'Esquema técnico de medidas Rusty Midwest: frente 142mm, lente 55mm, alto total 42mm, puente 16mm, varilla 143mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: sólo en Burrout receta (el hermano directo, de la misma línea).
UPDATE public.products
SET description = description || E'\n\nSi buscás un rectangular de líneas rectas, también en TR90 y con patillas de goma, mirá los [Rusty Midwest Optics](/anteojos-de-receta/rusty/rusty-midwest-receta).', updated_at = now()
WHERE slug = 'rusty-burrout-receta' AND description NOT LIKE '%rusty-midwest-receta%';

COMMIT;
