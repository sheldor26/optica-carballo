-- ============================================
-- Seed 55: Rusty Dileri (sol) — cuadrado femenino liviano, G-Flex, 1 de 2 pol
-- Fecha: 2026-06-04
-- ============================================
-- Anteojo de sol cuadrado femenino, liviano. Frente de G-Flex, patillas Flex
-- Temple. Lentes de policarbonato UV400 cat 3 (100% UV). 1 de 2 variantes
-- polarizada (SBLK/S10 POL) → producto lens_treatment ["uv400"] (entra a /polarizados).
--
-- 2 variantes en 2 MLAs (publicaciones simples). Stock=ML:
--   SKU 127042 — SBLK/S10 POL     negro brillo + gris oscuro POLARIZADA. MLA1575782743. $78.869,25 stock 3 (primary).
--   SKU 127043 — SIENNA/G.GREEN   marrón sienna + verde degradé.         MLA1480729607. $73.661,17 stock 3.
--
-- Medidas: 140 / 52x53 / 15 / 135 mm. Peso 31,8g. gender=female. cat 3.
--
-- 📸 FOTOS (bucket products/rusty-dileri/, ⚠️ PENDIENTE verificar HTTP 200 en CDN
-- antes de aplicar; al armar el seed la carpeta estaba vacía. Nombres del founder,
-- casing inconsistente — la perfil SBLK es "POl" minúscula, la frente "POL"):
--   DILERI_SBLK_S10_POl_p.jpg / DILERI_SBLK_S10_POL_f.jpg       (primary del modelo)
--   DILERI_SIENNA_G._GREEN-perfil.jpg / DILERI_SIENNA_G._GREEN-frente.jpg
--   medidas.webp
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-dileri', 'Rusty Dileri',
  'Anteojos de sol Rusty Dileri: cuadrados femeninos, frente de G-Flex, patillas Flex Temple y lentes de policarbonato UV400 categoría 3. Una variante con lente polarizada.',
  E'Los Rusty Dileri son anteojos de sol **cuadrados femeninos**, modernos y versátiles para uso diario. El frente es de **G-Flex** —flexible y resistente— y las patillas son **Flex Temple**, que ceden sin marcar para un calce cómodo todo el día.\n\nLas lentes son de policarbonato con protección **UV400 categoría 3** (100% UVA/UVB). El modelo **SBLK/S10 (POL) es polarizado**, lo que elimina los reflejos del asfalto, el agua y la nieve para una visión más nítida y descansada.\n\nDisponible en 2 variantes:\n\n• SBLK/S10 POL (SKU 127042): negro brillo con lente gris oscuro POLARIZADA.\n• SIENNA/G.GREEN (SKU 127043): marrón sienna con lente verde degradé.\n\nIncluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "cuadrado",
    "temple_material": "flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "gender": "female",
    "line": "urbana",
    "interchangeable_lenses": false,
    "prescription_adapter": false,
    "weight_grams": 31.8,
    "measurements": {"frame_width_mm": 140, "lens_width_mm": 52, "lens_height_mm": 53, "bridge_mm": 15, "temple_length_mm": 135},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado femenino liviano", "body": "Montura cuadrada femenina con frente de G-Flex y patillas Flex Temple, livianas y cómodas para usar todo el día."},
      {"type": "recommendation", "position": "middle", "title": "¿Cuál elegir?", "body": "Para manejar o la playa, la SBLK/S10 es POLARIZADA (elimina reflejos). La SIENNA/G.GREEN (marrón con lente verde degradé) es la opción de estilo, más cálida y combinable."},
      {"type": "tip", "position": "bottom", "title": "Para que duren", "body": "Guardalos en el estuche y limpiá solo con la franela de microfibra. Si vas al mar o la pileta, enjuagalos con agua dulce antes de guardarlos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1575782743", "MLA1480729607"], "imported_at": "2026-06-04"}
  }'::jsonb,
  true, false,
  'Rusty Dileri Anteojos de Sol Cuadrados Mujer | Carballo',
  'Anteojos Rusty Dileri cuadrados femeninos: G-Flex, patillas Flex Temple y policarbonato UV400. 2 variantes, una polarizada. Envíos a toda la Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-dileri'), '127042',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10 POL","polarized":true}'::jsonb,
   7886925, 3, true, 1, 'MLA1575782743', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-dileri'), '127043',
   '{"frame_color":"marron-sienna","lens_color":"verde-degrade","model_code":"SIENNA/G.GREEN","polarized":false}'::jsonb,
   7366117, 3, true, 2, 'MLA1480729607', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: SBLK/S10 POL perfil. Perfil = primaria de cada variante.
-- medidas SIEMPRE última (sort alto) para que en la galería quede al final.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-dileri'), (SELECT id FROM public.product_variants WHERE sku='127042'),
   'rusty-dileri/DILERI_SBLK_S10_POl_p.jpg', 'Anteojo de sol Rusty Dileri cuadrado femenino vista lateral, negro brillo con lente gris oscuro polarizada', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-dileri'), (SELECT id FROM public.product_variants WHERE sku='127042'),
   'rusty-dileri/DILERI_SBLK_S10_POL_f.jpg', 'Anteojo de sol Rusty Dileri cuadrado femenino vista frontal, negro brillo con lente gris oscuro polarizada', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-dileri'), (SELECT id FROM public.product_variants WHERE sku='127043'),
   'rusty-dileri/DILERI_SIENNA_G._GREEN-perfil.jpg', 'Anteojo de sol Rusty Dileri cuadrado femenino vista lateral, marrón sienna con lente verde degradé', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-dileri'), (SELECT id FROM public.product_variants WHERE sku='127043'),
   'rusty-dileri/DILERI_SIENNA_G._GREEN-frente.jpg', 'Anteojo de sol Rusty Dileri cuadrado femenino vista frontal, marrón sienna con lente verde degradé', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-dileri'), NULL,
   'rusty-dileri/medidas.webp', 'Esquema técnico de medidas Rusty Dileri: frente 140mm, lente 52x53mm, puente 15mm, varilla 135mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
