-- ============================================
-- Seed 79: Rusty Zinz SOL — CUADRADO unisex, polarizado, 2 colores
-- Fecha: 2026-06-30
-- ============================================
-- Anteojo de SOL cuadrado unisex (hermano del Zinz Optics receta, seed 78). Frente y
-- patillas G-Flex con bisagras flex customizadas. Lente policarbonato POLARIZADA 100%
-- UVA/UVB (cat 3). 25,7 g. MULTIVARIANTE (1 MLA MLA1549978087, 2 variaciones →
-- mercadolibre_variation_code = var_id, NO null). Precio/stock de la API ML; SKU del founder
-- (no figuran en ML):
--   669K-SBLK/DRT23 POL SKU 126807 var 185897876260 $78.869,25 → 7886900c stock 10 (PRIMARY +stock; gris transparente)
--   MBLK/S10 POL        SKU 126805 var 192324627407 $78.869,25 → 7886900c stock 4  (negro brillo)
-- (Precio $78.869,25 → 7886900 cents: el catálogo no maneja decimales de centavo.)
--
-- ⚠️ Discrepancia de etiquetas de color en ML vs founder: ML publica "SBLK/DRT25 - Negro
-- Brillo" (var 192324627407) y "Gris Transparente - 669k-SBLK" (var 185897876260); el founder
-- usa MBLK/S10 POL y 669K-SBLK/DRT23 POL (coinciden con fotos + SKU). Se guarda el model_code
-- del founder para trazabilidad; la reconciliación de stock va por var_id (invariante a la
-- etiqueta de ML).
--
-- frame_shape="cuadrado" (español, = al hermano receta). frame_material + temple_material
-- g-flex (bisagras flex customizadas → callout, no campo). Convención SOL: lens_material
-- policarbonato, lens_treatment ["uv400"] (SIN "polarized" en el array — /polarizados se deriva
-- del flag polarized:true de cada variante en runtime), lens_category 3. 2/2 polarized:true.
-- weight_grams 25.7. gender unisex.
--
-- HONESTIDAD: 2/2 polarizadas → SÍ se afirma "Polarizado" en title/H1 (criterio Terdey 3/3).
-- SEO (seo-strategist): primaria FORMA `lentes/anteojos de sol cuadrados` (390/170, carril
-- único del cluster Rusty-sol, como Blinded=redondo / And Now=deportivo); head `anteojos de sol
-- rusty` (880) de soporte; polarizado de soporte (el carril de modelo polarizado es de Terdey).
-- Anti-canib.: (A) vs cluster Rusty sol → Zinz dueño del CUADRADO; (B) vs Zinz receta → sol toma
-- `...de sol cuadrados`, receta toma `...cuadrados` (sin "de sol"). Cross-link sol↔receta.
--
-- Medidas (= al receta): frente 137 / lente 51x42 / puente 20 / varilla 145 mm.
--
-- 📸 FOTOS: bucket products/rusty-zinz/ (carpeta ≠ rusty-zinz-receta). 669K perfil+frente
-- 900×442; MBLK perfil+frente 1200×589 (ambas ratio 2.04:1) + medidas.png 1500×1500. Grid
-- primary = PERFIL de la 669K (+stock). Scale 1.1/1.0 (ratio 2.04:1, = receta; PROVISIONAL,
-- reverificar grid /anteojos-de-sol post-deploy, regla 15). medidas.png sort 99 (última).
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-zinz', 'Rusty Zinz',
  'Lentes de sol Rusty Zinz: cuadrados unisex, polarizados. Frente y patillas de G-Flex con bisagras flex customizadas. Lente de policarbonato con 100% protección UV (UV400, categoría 3). Livianos, 25,7 g.',
  E'Los **Rusty Zinz** son **lentes de sol cuadrados, unisex**. El **frente y las patillas son de G-Flex** —flexible y resistente— con **bisagras flex customizadas**, para un calce cómodo y durable. La **lente es de policarbonato, polarizada**, con **100% protección UV (UV400, categoría 3)** — corta el reflejo del agua, la nieve y el asfalto. Livianos: solo **25,7 g**.\n\nMedidas: frente 137 mm · lente 51 mm de ancho × 42 mm de alto · puente 20 mm · varilla 145 mm.\n\nDisponible en 2 colores:\n\n• 669K-SBLK/DRT23 — gris transparente.\n• MBLK/S10 — negro brillo.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante. ¿Lo querés con tu graduación? Mirá la versión de receta del Rusty Zinz.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "cuadrado",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "weight_grams": 25.7,
    "measurements": {"frame_width_mm": 137, "lens_width_mm": 51, "lens_height_mm": 42, "bridge_mm": 20, "temple_length_mm": 145},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado unisex polarizado", "body": "Diseño cuadrado unisex, liviano (25,7 g). Frente y patillas de G-Flex con bisagras flex customizadas. Lente de policarbonato polarizada con 100% protección UV (UV400, categoría 3)."},
      {"type": "tip", "position": "middle", "title": "Lente polarizada", "body": "La lente polarizada corta el reflejo del agua, la nieve y el asfalto — ideal para manejar y para actividades al aire libre."},
      {"type": "recommendation", "position": "bottom", "title": "¿Lo necesitás con graduación?", "body": "Este modelo también está como armazón de receta. Si dudás cuál te conviene, escribinos por WhatsApp y te asesoramos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1549978087"], "imported_at": "2026-06-30"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Rusty Zinz Cuadrados Polarizados | Carballo',
  'Anteojos de sol Rusty Zinz cuadrados unisex, lente polarizada con 100% protección UV. Livianos (25,7 g) y originales. Envíos a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = 669K (primary, +stock). Multivariante → item_id repetido + variation_code = var_id.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-zinz'), '126807',
   '{"frame_color":"gris-transparente","model_code":"669K-SBLK/DRT23 POL","polarized":true}'::jsonb,
   7886900, 10, true, 1, 'MLA1549978087', '185897876260'),
  ((SELECT id FROM public.products WHERE slug='rusty-zinz'), '126805',
   '{"frame_color":"negro-brillo","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   7886900, 4, true, 2, 'MLA1549978087', '192324627407')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = 669K perfil (+stock). Nombres REALES del bucket. medidas.png sort 99.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-zinz'), (SELECT id FROM public.product_variants WHERE sku='126807'),
   'rusty-zinz/ZINZ_669K-SBLKDRT23_POL.perfil.jpg', 'Lentes de sol Rusty Zinz cuadrados unisex vista lateral, gris transparente lente polarizada', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-zinz'), (SELECT id FROM public.product_variants WHERE sku='126807'),
   'rusty-zinz/ZINZ_669K-SBLKDRT23_POL.-frente.jpg', 'Lentes de sol Rusty Zinz cuadrados unisex vista frontal, gris transparente lente polarizada', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zinz'), (SELECT id FROM public.product_variants WHERE sku='126805'),
   'rusty-zinz/ZINZ-MBLK-S10-POL-PERFIL.jpg', 'Lentes de sol Rusty Zinz cuadrados unisex vista lateral, negro brillo lente polarizada', 1200, 589, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zinz'), (SELECT id FROM public.product_variants WHERE sku='126805'),
   'rusty-zinz/ZINZ-MBLK-S10-POL-FRENTE.jpg', 'Lentes de sol Rusty Zinz cuadrados unisex vista frontal, negro brillo lente polarizada', 1200, 589, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zinz'), NULL,
   'rusty-zinz/medidas.png', 'Esquema técnico de medidas Rusty Zinz: frente 137mm, lente 51x42mm, puente 20mm, varilla 145mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
