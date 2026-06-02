-- ============================================
-- Seed 39: Vulk 53&3 Marky Ramone (sol) — aviador metal EDICIÓN ESPECIAL
-- Fecha: 2026-06-02
-- ============================================
-- Edición tributo a Marky Ramone (Ramones). Aviador de metal con terminales
-- de acetato hechas a mano (una lleva la firma de Marky Ramone). Lente
-- policarbonato polarizada UV400 cat 3. Talle Large. 25g.
--
-- 1 MLA multi-variación (MLA2008030952), precio único $104.799. 5 variantes,
-- TODAS polarizadas → producto con lens_treatment incluye "polarized"
-- (aparece en /vulk/polarizados). Stock real confirmado por founder = el de ML
-- (3 de 5 en 0):
--
--   SKU 958211 — S / G15 POL    plateado + verde G15.   variation 186839716039. stock 7 (default).
--   SKU 958213 — LG / 02 POL    dorado + marrón degradé. variation 182831918370. stock 5.
--   SKU 958214 — MG / 20 POL    gris mate + roja.        variation 186840663989. stock 0.
--   SKU 958216 — S / 25 POL     plateado + gris osc deg. variation 186840352961. stock 0.
--   SKU 958212 — MBLK / 03 POL  negro + negro degradé.   variation 186840324533. stock 0.
--
-- Medidas: 145 / 57x55 / 12 / 145 mm. Peso 25g.
--
-- 🎁 ESTUCHE ESPECIAL: NO usa la imagen genérica de estuche Vulk. Se setea
-- attributes.hide_brand_includes_image = true y se agrega `estuche-ramones.jpg`
-- como imagen del modelo (caja tributo + estuche firmado).
--
-- 📸 FOTOS (bucket products/vulk-53-3/, nombres URL-safe sin '&'):
--   533-s-g15-pol-perfil.jpg / -frente.jpg
--   533-lg02-pol-perfil.jpg  / -frente.jpg
--   533-mg20-pol-perfil.jpg  / -frente.jpg
--   533-s-25-pol-perfil.jpg  / -frente.jpg
--   533-mblk03-pol-perfil.jpg/ -frente.jpg
--   estuche-ramones.jpg      (caja/estuche tributo — reemplaza la genérica Vulk)
--   medidas.jpg              (esquema técnico)
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (
  brand_id, category_id, slug, name,
  short_description, description, attributes,
  is_active, is_featured, meta_title, meta_description
)
VALUES (
  (SELECT id FROM vulk),
  (SELECT id FROM sol),
  'vulk-53-3',
  'Vulk 53&3 Marky Ramone',
  'Anteojos de sol aviador edición especial tributo a Marky Ramone. Armazón de metal con terminales de acetato (una firmada), lente polarizada policarbonato UV400 cat 3. Incluye caja tributo. 25g, talle Large.',
  E'Los Vulk 53&3 son una edición especial en homenaje a Marky Ramone, baterista de los Ramones. Un aviador de metal clásico y atemporal, pensado para quien valora el estilo auténtico y un objeto con historia.\n\nEl armazón es de metal resistente con bisagras metálicas, y las terminales de las patillas son de acetato hechas a mano para mayor confort. Como detalle de la edición tributo, una de las terminales lleva la firma de Marky Ramone.\n\nLas lentes son de policarbonato polarizado, con protección total UV400 (categoría 3): el polarizado elimina los reflejos del asfalto, el agua y los vidrios, ideal para manejar y para el aire libre. Talle Large, 25 gramos.\n\nDisponible en 5 variantes (todas polarizadas):\n\n• S / G15 POL (SKU 958211): metal plateado con lente verde G15.\n• LG / 02 POL (SKU 958213): metal dorado con lente marrón degradé.\n• MG / 20 POL (SKU 958214): metal gris mate con lente roja.\n• S / 25 POL (SKU 958216): metal plateado con lente gris oscuro degradé.\n• MBLK / 03 POL (SKU 958212): metal negro con lente negra degradé.\n\nEdición especial: incluye caja tributo, estuche original firmado, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "metal",
    "frame_shape": "aviador",
    "temple_material": "metal",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400", "polarized"],
    "gender": "unisex",
    "line": "urbana",
    "interchangeable_lenses": false,
    "prescription_adapter": false,
    "hide_brand_includes_image": true,
    "measurements": {
      "frame_width_mm": 145,
      "lens_width_mm": 57,
      "lens_height_mm": 55,
      "bridge_mm": 12,
      "temple_length_mm": 145
    },
    "weight_grams": 25,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Una edición tributo de verdad", "body": "Es una edición especial en homenaje a Marky Ramone (Ramones): una de las terminales de acetato lleva su firma, y viene con caja tributo y estuche original firmado. Un objeto de colección, no solo un anteojo de sol."},
      {"type": "recommendation", "position": "middle", "title": "Las 5 variantes son polarizadas", "body": "Todas tienen lente polarizado que elimina los reflejos del asfalto y el agua — ideal para manejar y para el exterior. Es un aviador talle Large (57mm de calibre), pensado para rostros medianos a grandes."},
      {"type": "tip", "position": "bottom", "title": "Para que duren", "body": "Guardalos siempre en el estuche cuando no los usás. Limpiá únicamente con la franela de microfibra incluida — la remera o el papel rayan el tratamiento del cristal. Si vas al mar o la pileta, enjuagalos con agua dulce antes de guardarlos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2008030952"], "imported_at": "2026-06-02"}
  }'::jsonb,
  true, false,
  'Vulk 53&3 Marky Ramone Anteojos de Sol Aviador Polarizados | Óptica Carballo',
  'Vulk 53&3: edición especial tributo a Marky Ramone. Aviador de metal, lente polarizada UV400, terminal firmada, caja tributo. Stock real y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, short_description = EXCLUDED.short_description,
  description = EXCLUDED.description, attributes = EXCLUDED.attributes,
  meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description,
  updated_at = now();

-- Variantes (sort por stock desc: in-stock primero)
INSERT INTO public.product_variants (
  product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES
  ((SELECT id FROM public.products WHERE slug = 'vulk-53-3'), '958211',
   '{"frame_color":"plateado","lens_color":"verde","model_code":"S / G15 POL","polarized":true}'::jsonb,
   10479900, 7, true, 1, 'MLA2008030952', '186839716039'),
  ((SELECT id FROM public.products WHERE slug = 'vulk-53-3'), '958213',
   '{"frame_color":"dorado","lens_color":"marron-degrade","model_code":"LG / 02 POL","polarized":true}'::jsonb,
   10479900, 5, true, 2, 'MLA2008030952', '182831918370'),
  ((SELECT id FROM public.products WHERE slug = 'vulk-53-3'), '958214',
   '{"frame_color":"gris-mate","lens_color":"roja","model_code":"MG / 20 POL","polarized":true}'::jsonb,
   10479900, 0, true, 3, 'MLA2008030952', '186840663989'),
  ((SELECT id FROM public.products WHERE slug = 'vulk-53-3'), '958216',
   '{"frame_color":"plateado","lens_color":"gris-oscuro-degrade","model_code":"S / 25 POL","polarized":true}'::jsonb,
   10479900, 0, true, 4, 'MLA2008030952', '186840352961'),
  ((SELECT id FROM public.products WHERE slug = 'vulk-53-3'), '958212',
   '{"frame_color":"negro","lens_color":"negro-degrade","model_code":"MBLK / 03 POL","polarized":true}'::jsonb,
   10479900, 0, true, 5, 'MLA2008030952', '186840324533')
ON CONFLICT (sku) DO UPDATE SET
  product_id = EXCLUDED.product_id, attributes = EXCLUDED.attributes,
  price_cents = EXCLUDED.price_cents, stock_qty = EXCLUDED.stock_qty,
  mercadolibre_item_id = EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code = EXCLUDED.mercadolibre_variation_code, updated_at = now();

-- Imágenes: 2 por variante + medidas + estuche-ramones. Primary: S/G15 perfil.
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary
)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-53-3'), (SELECT id FROM public.product_variants WHERE sku='958211'),
   'vulk-53-3/533-s-g15-pol-perfil.jpg', 'Vulk 53&3 Marky Ramone aviador vista lateral 3/4, armazón metal plateado con lente verde G15 polarizada', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-53-3'), (SELECT id FROM public.product_variants WHERE sku='958211'),
   'vulk-53-3/533-s-g15-pol-frente.jpg', 'Vulk 53&3 Marky Ramone aviador vista frontal, armazón metal plateado con lente verde G15 polarizada', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-53-3'), (SELECT id FROM public.product_variants WHERE sku='958213'),
   'vulk-53-3/533-lg02-pol-perfil.jpg', 'Vulk 53&3 Marky Ramone aviador vista lateral 3/4, armazón metal dorado con lente marrón degradé polarizada', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-53-3'), (SELECT id FROM public.product_variants WHERE sku='958213'),
   'vulk-53-3/533-lg02-pol-frente.jpg', 'Vulk 53&3 Marky Ramone aviador vista frontal, armazón metal dorado con lente marrón degradé polarizada', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-53-3'), (SELECT id FROM public.product_variants WHERE sku='958214'),
   'vulk-53-3/533-mg20-pol-perfil.jpg', 'Vulk 53&3 Marky Ramone aviador vista lateral 3/4, armazón metal gris mate con lente roja polarizada', 1500, 1000, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-53-3'), (SELECT id FROM public.product_variants WHERE sku='958214'),
   'vulk-53-3/533-mg20-pol-frente.jpg', 'Vulk 53&3 Marky Ramone aviador vista frontal, armazón metal gris mate con lente roja polarizada', 1500, 1000, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-53-3'), (SELECT id FROM public.product_variants WHERE sku='958216'),
   'vulk-53-3/533-s-25-pol-perfil.jpg', 'Vulk 53&3 Marky Ramone aviador vista lateral 3/4, armazón metal plateado con lente gris oscuro degradé polarizada', 1500, 1000, 6, false),
  ((SELECT id FROM public.products WHERE slug='vulk-53-3'), (SELECT id FROM public.product_variants WHERE sku='958216'),
   'vulk-53-3/533-s-25-pol-frente.jpg', 'Vulk 53&3 Marky Ramone aviador vista frontal, armazón metal plateado con lente gris oscuro degradé polarizada', 1500, 1000, 7, false),
  ((SELECT id FROM public.products WHERE slug='vulk-53-3'), (SELECT id FROM public.product_variants WHERE sku='958212'),
   'vulk-53-3/533-mblk03-pol-perfil.jpg', 'Vulk 53&3 Marky Ramone aviador vista lateral 3/4, armazón metal negro con lente negra degradé polarizada', 1500, 1000, 8, false),
  ((SELECT id FROM public.products WHERE slug='vulk-53-3'), (SELECT id FROM public.product_variants WHERE sku='958212'),
   'vulk-53-3/533-mblk03-pol-frente.jpg', 'Vulk 53&3 Marky Ramone aviador vista frontal, armazón metal negro con lente negra degradé polarizada', 1500, 1000, 9, false),
  -- Esquema de medidas (modelo)
  ((SELECT id FROM public.products WHERE slug='vulk-53-3'), NULL,
   'vulk-53-3/medidas.jpg', 'Esquema técnico de medidas Vulk 53&3: frente 145mm, lente 57x55mm, puente 12mm, varilla 145mm', 1500, 1500, 10, false),
  -- Estuche/caja tributo (modelo) — reemplaza la imagen genérica de estuche Vulk
  ((SELECT id FROM public.products WHERE slug='vulk-53-3'), NULL,
   'vulk-53-3/estuche-ramones.jpg', 'Caja tributo y estuche original firmado de la edición especial Vulk 53&3 Marky Ramone', 1500, 1000, 11, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id = EXCLUDED.variant_id, alt_text = EXCLUDED.alt_text,
  sort_order = EXCLUDED.sort_order, is_primary = EXCLUDED.is_primary, updated_at = now();

COMMIT;
