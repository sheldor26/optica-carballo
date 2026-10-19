-- ============================================
-- Seed 180: Rusty Tuniti Optics RECETA (FW25), cat-eye (ojo de gato) en acetato, femenino, 3 colores
-- Fecha: 2026-10-15
-- ============================================
-- 1 PUBLICACIÓN MULTIVARIANTE de ML, tradicional (`catalog_listing:false`, categoría MLA417127), ACTIVA, verificada por API el 2026-10-15: `MLA2819287108` (2 vendidas, título congelado "Anteojos Armazon Rusty Tuniti Descanso Lentes Blueblock Moda"), $133.803 → 13380300c las 3 variaciones (las hermanas MLA2819157748 y MLA3246644122, de catálogo/pausada, se ignoran):
--   C1  SKU 960690  var `189984144046`  stock 1  violeta con detalles turquesa
--   C2  SKU 960691  var `207916151091`  stock 2  azul con tonos rosa y salmón (agregada por el founder el 2026-10-15)
--   C3  SKU 960692  var `196436555669`  stock 0  transparente con detalles rojos y verdes
--   (En ML las variaciones no tienen SELLER_SKU cargado: acá van con los SKU que informó el founder.) Stock y precio mandan desde ML (C3 queda en 0 y se sincroniza sola). Sin GTIN.
--
-- DATOS DEL FOUNDER (2026-10-15): armazón femenino "en punta" (cat-eye), acetato (Rusty: "acetato laminado hecho a mano", atribuido al fabricante), bisagras de acero inoxidable SIN flex, 24,4 g, **53-16-145, ancho total 137, alto total 49**, "se pueden adaptar todo tipo de lentes" (NO se promociona así), lentes demo CON filtro Blue Cut (confirmado por el founder; el SITIO no lo menciona: criterio vigente, los lentes demo se reemplazan por el cristal con receta).
-- ⚠️ PROGRESIVOS: sí, con texto prudente (hueco estimado 40-44 mm SIN MEDIR; el cat-eye pierde altura útil abajo, el alto total 49 la sobreestima): `lens_compatibility` incluye "progresivo"; misma redacción que Blica/Midwest/Penc.
-- 🔬 optical-expert: NO "liviano" (24,4 g es peso medio, igual que el Clevel: se dice el peso), NO "ideal para alta graduación"/"disimula el espesor", NO "sin flex" ni "hipoalergénico", "hecho a mano" sólo atribuido; `frame_shape` "cat_eye" (valor de lib/catalog/brand-filters.ts), `gender` "female", `hinge_system` "metalica", sin `size_fit` (sólo admite junior/chico/infantil), face shapes ovalado/corazón/cuadrado.
-- 🎯 SEO (seo-strategist): primer Rusty de receta cat-eye (carril libre): slug `rusty-tuniti-receta`, name `Rusty Tuniti Optics`, primaria `anteojos cat eye` (320/10), "ojo de gato" una vez, acetato sólo como material (el "lentes de acetato" es del Clevel); links a Opposit, Clevel, Blica, hub y la faceta /anteojos-de-receta/cat-eye; frase de vuelta sólo en Opposit.
-- 📸 FOTOS: oficiales de Rusty (900×442) pasadas por `pnpm placas --tipo receta` y subidas con `pnpm fotos:subir --sufijo`: `rusty-tuniti-receta/perfil|frente-c1|c2|c3.jpg` y `medidas-c1.jpg` (2000×1333, scale 1.05).
-- ============================================

BEGIN;

WITH
  rusty  AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-tuniti-receta', 'Rusty Tuniti Optics',
  'Armazón de receta Rusty Tuniti Optics, cat eye de acetato para mujer, con bisagras de acero inoxidable (24,4 g). En violeta con detalles turquesa, azul con tonos rosa y salmón, o transparente con detalles rojos y verdes.',
  E'Los **Rusty Tuniti** son **anteojos recetados** de armazón **cat eye (ojo de gato)**, con forma en punta y pensados para mujer. Están hechos en **acetato** (según el fabricante, laminado hecho a mano), con una banda de color que recorre la parte superior del frente y se repite en las patillas. Las **bisagras son de acero inoxidable** y el armazón solo pesa 24,4 g.\n\n**Viene con lentes de demostración**, sin graduación, para que pruebes el armazón. Sumale tus cristales con receta: monofocales, bifocales o progresivos. Para progresivos, por la forma en punta del armazón, tomamos tu distancia pupilar y la altura de montaje con el armazón puesto.\n\nMedidas: frente 137 mm · lente 53 mm de ancho · puente 16 mm · varilla 145 mm · alto total 49 mm. Es un talle mediano.\n\nDisponible en 3 colores:\n\n• **C1, violeta con detalles turquesa.**\n• **C2, azul con tonos rosa y salmón.**\n• **C3, transparente con detalles rojos y verdes.**\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi buscás otro femenino de la línea, mirá los [Rusty Opposit Optics](/anteojos-de-receta/rusty/rusty-opposit-receta), wayfarer; si preferís otro de acetato, los [Rusty Clevel Optics](/anteojos-de-receta/rusty/rusty-clevel-receta); o un redondo de talle chico, los [Rusty Blica Optics](/anteojos-de-receta/rusty/rusty-blica-receta). También podés ver [todos los anteojos de receta Rusty](/anteojos-de-receta/rusty) y [más anteojos de receta cat eye](/anteojos-de-receta/cat-eye).',
  '{
    "frame_material": "acetate",
    "temple_material": "acetate",
    "frame_shape": "cat_eye",
    "hinge_system": "metalica",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo"],
    "recommended_face_shapes": ["ovalado", "corazon", "cuadrado"],
    "gender": "female",
    "weight_grams": 24.4,
    "measurements": {"frame_width_mm": 137, "lens_width_mm": 53, "lens_height_mm": 49, "bridge_mm": 16, "temple_length_mm": 145},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-15",
    "callouts": [
      {"type": "info", "position": "top", "title": "Cat eye de acetato, para mujer", "body": "Forma en punta (ojo de gato), con bisagras de acero inoxidable. El armazón solo pesa 24,4 g. En violeta con detalles turquesa, azul con tonos rosa y salmón, o transparente con detalles rojos y verdes."},
      {"type": "tip", "position": "middle", "title": "Monofocales, bifocales y progresivos", "body": "Acepta cristales monofocales, bifocales y progresivos. Para progresivos, por la forma en punta del armazón, tomamos tu distancia pupilar y la altura de montaje con el armazón puesto. Si tenés dudas con tu graduación, escribinos antes de comprar."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con una foto de tu receta. Te pasamos el costo de los cristales según tu graduación y los tratamientos que quieras (antirreflejo, fotocromático)."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2819287108"], "imported_at": "2026-10-15"}
  }'::jsonb,
  true, false,
  'Rusty Tuniti Optics Cat Eye | Anteojos de Receta',
  'Anteojos de receta Rusty Tuniti Optics: armazón cat eye de acetato para mujer, 24,4 g, en 3 colores. Envíos a todo el país y garantía de 1 año.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 3 variantes de la multivariante MLA2819287108. Primaria = C1 (perfil).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-tuniti-receta'), '960690',
   '{"frame_color":"violeta-detalles-turquesa","model_code":"C1"}'::jsonb,
   13380300, 1, true, 1, 'MLA2819287108', '189984144046'),
  ((SELECT id FROM public.products WHERE slug='rusty-tuniti-receta'), '960691',
   '{"frame_color":"azul-tonos-rosa-y-salmon","model_code":"C2"}'::jsonb,
   13380300, 2, true, 2, 'MLA2819287108', '207916151091'),
  ((SELECT id FROM public.products WHERE slug='rusty-tuniti-receta'), '960692',
   '{"frame_color":"transparente-detalles-rojos-y-verdes","model_code":"C3"}'::jsonb,
   13380300, 0, true, 3, 'MLA2819287108', '196436555669')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Primaria = perfil de la C1. medidas-c1.jpg SIEMPRE última (sort 99) y con variant_id NULL.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-tuniti-receta'), (SELECT id FROM public.product_variants WHERE sku='960690'),
   'rusty-tuniti-receta/perfil-c1.jpg', 'Anteojos de receta Rusty Tuniti cat eye de acetato, vista lateral, violeta con detalles turquesa y lentes de demostración', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-tuniti-receta'), (SELECT id FROM public.product_variants WHERE sku='960690'),
   'rusty-tuniti-receta/frente-c1.jpg', 'Anteojos de receta Rusty Tuniti cat eye de acetato, vista frontal, violeta con detalles turquesa y lentes de demostración', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-tuniti-receta'), (SELECT id FROM public.product_variants WHERE sku='960691'),
   'rusty-tuniti-receta/perfil-c2.jpg', 'Anteojos de receta Rusty Tuniti cat eye de acetato, vista lateral, azul con tonos rosa y salmón y lentes de demostración', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-tuniti-receta'), (SELECT id FROM public.product_variants WHERE sku='960691'),
   'rusty-tuniti-receta/frente-c2.jpg', 'Anteojos de receta Rusty Tuniti cat eye de acetato, vista frontal, azul con tonos rosa y salmón y lentes de demostración', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-tuniti-receta'), (SELECT id FROM public.product_variants WHERE sku='960692'),
   'rusty-tuniti-receta/perfil-c3.jpg', 'Anteojos de receta Rusty Tuniti cat eye de acetato, vista lateral, transparente con detalles rojos y verdes y lentes de demostración', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-tuniti-receta'), (SELECT id FROM public.product_variants WHERE sku='960692'),
   'rusty-tuniti-receta/frente-c3.jpg', 'Anteojos de receta Rusty Tuniti cat eye de acetato, vista frontal, transparente con detalles rojos y verdes y lentes de demostración', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-tuniti-receta'), NULL,
   'rusty-tuniti-receta/medidas-c1.jpg', 'Esquema técnico de medidas Rusty Tuniti: frente 137mm, lente 53mm, alto total 49mm, puente 16mm, varilla 145mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: sólo en Opposit receta (el otro femenino de la línea).
UPDATE public.products
SET description = description || E'\n\nSi buscás una forma más audaz, mirá los [Rusty Tuniti Optics](/anteojos-de-receta/rusty/rusty-tuniti-receta), cat eye de acetato.', updated_at = now()
WHERE slug = 'rusty-opposit-receta' AND description NOT LIKE '%rusty-tuniti-receta%';

COMMIT;
