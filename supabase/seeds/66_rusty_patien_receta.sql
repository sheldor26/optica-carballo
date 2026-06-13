-- ============================================
-- Seed 66: Rusty Patien Optics RECETA (armazón óptico) — wayfarer unisex, G-Flex
-- Fecha: 2026-06-13
-- ============================================
-- Versión de RECETA del mismo frame que el Rusty Patien de sol (seed 65). Armazón
-- wayfarer UNISEX, frente y patillas G-Flex, bisagras flexo metálicas (al callout),
-- lentes demo, liviano 23,6g, talle medium. Categoría anteojos-de-receta. Convención
-- receta: SOLO lens_compatibility (SIN lens_material/treatment/category/polarized/uv —
-- el founder lo aclaró explícito: el de receta no tiene UV ni cat 3).
--
-- 2 variantes en 1 MLA MULTIVARIANTE (MLA1388467447) → mercadolibre_variation_code =
-- var_id (NO null, a diferencia de los Patien sol que eran items simples). Precio/
-- stock/var_id de la API ML (scripts/ml-item.ts):
--   669K-SBLK OPTICAL SKU 126096 var 179922233291 stock 1 (PRIMARY, +stock; translúcido c/ patillas negras)
--   MBLK OPTICAL      SKU 126090 var 179922233289 stock 0 (negro mate)
-- precio $83.078 ambas (8307800 cents).
--
-- Peso 23,6 g (founder lo pasó — aplicado TAMBIÉN al Patien de sol, seed 65, mismo frame).
-- Medidas: 140 / 49x40 / 21 / 145 mm (de la FOTO medidas.webp; mismas que el sol).
-- frame_material + temple_material g-flex. hinge OMITIDO como campo (flexo metálico al callout).
--
-- 📸 FOTOS (bucket products/rusty-patien-receta/ — carpeta SEPARADA del sol; 5 archivos,
-- 900×442; naming con underscores). Primaria = perfil 669K-SBLK. Cada variante con
-- perfil+frente propio → NO CCCP. Scale perfil 1.1 / frente 1.0 (900×442 con anteojo
-- ~90% del frame, como Play/Terdey; comparado visual). medidas.webp en 1.0 (no grid).
-- ============================================

BEGIN;

WITH
  rusty   AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-patien-receta', 'Rusty Patien Optics',
  'Anteojos recetados Rusty Patien: armazón wayfarer unisex, liviano (23,6 g) con varillas G-Flex flexibles. Comprás el armazón (viene con lentes demo, sin aumento) y le cargamos los cristales según tu receta; el precio publicado es del armazón, los cristales se cotizan aparte.',
  E'El **Rusty Patien Optics** es un armazón de receta **wayfarer unisex**, liviano (23,6 g), con **frente y patillas de G-Flex** —flexible y resistente— y **bisagras flexo metálicas** para un calce cómodo. Es la versión de receta del modelo Patien.\n\nMedidas: frente 140 mm · lente 49 mm de ancho × 40 mm de alto · puente 21 mm · varilla 145 mm. Talle medium.\n\nViene con lentes demo (sin graduación). Acepta tu receta: monofocales, bifocales y progresivos.\n\nDisponible en 2 colores:\n\n• 669K-SBLK — translúcido con patillas negras.\n• MBLK — negro mate.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "wayfarer",
    "temple_material": "g-flex",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "unisex",
    "line": "urbana",
    "measurements": {"frame_width_mm": 140, "lens_width_mm": 49, "lens_height_mm": 40, "bridge_mm": 21, "temple_length_mm": 145},
    "weight_grams": 23.6,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Wayfarer unisex liviano (23,6 g)", "body": "Frente y patillas de G-Flex flexible con bisagras flexo metálicas. Forma wayfarer clásica, talle medium, para hombre o mujer."},
      {"type": "tip", "position": "middle", "title": "Apto para tu graduación", "body": "Acepta lentes monofocales, bifocales y progresivos. Si tenés dudas con tu receta o querés saber si te sirve para progresivos, escribinos antes de comprar."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con foto de tu receta. Te pasamos el costo del laboratorio según tu graduación + tratamientos (antirreflex, blue light, fotocromático). Armazón + cristales en 7-10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1388467447"], "imported_at": "2026-06-13"}
  }'::jsonb,
  true, false,
  'Anteojos Rusty Patien Wayfarer de Receta - Óptica Carballo',
  'Armazón Rusty Patien wayfarer unisex para anteojos recetados. Liviano, 23,6 g, originales. Envíos a toda la Argentina. Asesoramiento de técnico óptico.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = 669K-SBLK (primary, +stock). Multivariante → variation_code = var_id.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-patien-receta'), '126096',
   '{"frame_color":"gris-transparente-negro","model_code":"669K-SBLK OPTICAL"}'::jsonb,
   8307800, 1, true, 1, 'MLA1388467447', '179922233291'),
  ((SELECT id FROM public.products WHERE slug='rusty-patien-receta'), '126090',
   '{"frame_color":"negro-mate","model_code":"MBLK OPTICAL"}'::jsonb,
   8307800, 0, true, 2, 'MLA1388467447', '179922233289')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = 669K-SBLK perfil. medidas SIEMPRE última.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-patien-receta'), (SELECT id FROM public.product_variants WHERE sku='126096'),
   'rusty-patien-receta/PATIEN_669K-SBLK_P_GALERIA.jpg', 'Anteojos de receta Rusty Patien wayfarer unisex vista lateral, translúcido con patillas negras', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-patien-receta'), (SELECT id FROM public.product_variants WHERE sku='126096'),
   'rusty-patien-receta/PATIEN_669K-SBLK_F_GALERIA.jpg', 'Anteojos de receta Rusty Patien wayfarer unisex vista frontal, translúcido con patillas negras', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-patien-receta'), (SELECT id FROM public.product_variants WHERE sku='126090'),
   'rusty-patien-receta/PATIEN_MBLK_perfil.jpg', 'Anteojos de receta Rusty Patien wayfarer unisex vista lateral, negro mate', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-patien-receta'), (SELECT id FROM public.product_variants WHERE sku='126090'),
   'rusty-patien-receta/PATIEN_MBLK_OPTICAL_frente.jpg', 'Anteojos de receta Rusty Patien wayfarer unisex vista frontal, negro mate', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-patien-receta'), NULL,
   'rusty-patien-receta/medidas.webp', 'Esquema técnico de medidas Rusty Patien: frente 140mm, lente 49x40mm, puente 21mm, varilla 145mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
