-- ============================================
-- Seed 50: Vulk Way Back (sol) — wayfarer deportivo, G-Flex, 3 de 4 polarizadas
-- Fecha: 2026-06-02
-- ============================================
-- Anteojo de sol estilo wayfarer/cuadrado deportivo, unisex. Armazón G-Flex con
-- bisagras metálicas Flex. Lentes de policarbonato UV400 cat3. 3 de 4 variantes
-- polarizadas → producto lens_treatment ["uv400"] (entra a /polarizados por las 3).
--
-- 4 variantes en 4 MLAs (publicaciones simples). Stock=ML:
--   SKU 128857 — SBLK/S10 POL        negro brillo + gris oscuro. MLA1568125119. $85.883,09, stock 3 (primary). POL.
--   SKU 128853 — MDBLU/REVO BLUE POL azul mate + azul espejada.  MLA1470866679. $91.809,29, stock 3. POL.
--   SKU 128854 — GREEN PEARL/G.GREY  verde perlado + gris degradé. MLA1511152053. $79.832,39, stock 3. NO pol.
--   SKU 128855 — MBLK/S10 POL        negro mate + gris oscuro.   MLA1695939562. $86.228, stock 0 (paused). POL.
--
-- Medidas: 146 / 56x43 / 19 / 145 mm.
-- ⚠️ frame_shape "wayfarer" tentativo (nombre "Way Back" + silueta del diagrama;
--    ML mezcla "rectangular" y "cuadrado") — pendiente confirmación founder.
--
-- 📸 FOTOS (bucket products/vulk-way-back/, nombres reales con formatos MUY
-- inconsistentes verificados HTTP 200; SBLK usa otro patrón sin "galeria"):
--   WAY BACK-SBLK-S10-PERFIL.jpg / WAYBACK-SBLK-S10 F.jpg  (SBLK — perfil primary del modelo)
--   WAY BACK MDBLU-REVO BLUE p galeria.jpg / f galeria.jpg
--   Way back- green pearl g.grey p galeria.jpg / f galeria.jpg
--   WAY BACK MBLK S10 POL P galeria.jpg / WAY BACK MBLK S10 POL. F galeria.jpg
--   medidas.webp
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-way-back', 'Vulk Way Back',
  'Anteojos de sol Vulk Way Back: estilo wayfarer deportivo unisex, armazón G-Flex con bisagras metálicas Flex y lentes de policarbonato UV400 categoría 3. La mayoría con lente polarizada.',
  E'Los Vulk Way Back son anteojos de sol de estilo wayfarer, modernos y versátiles, para uso diario. El armazón es de G-Flex —flexible y liviano— con **bisagras metálicas Flex** para una apertura firme y durable.\n\nLas lentes son de policarbonato con protección UV400 categoría 3 (100% UVA/UVB). **3 de las 4 variantes son polarizadas**, lo que elimina los reflejos del asfalto, el agua y la nieve para una visión más nítida y descansada.\n\nDisponible en 4 variantes:\n\n• SBLK/S10 POL (SKU 128857): negro brillo con lente gris oscuro POLARIZADA.\n• MDBLU/REVO BLUE POL (SKU 128853): azul mate con lente azul espejada (revo) POLARIZADA.\n• GREEN PEARL/G.GREY (SKU 128854): verde perlado con lente gris degradé.\n• MBLK/S10 POL (SKU 128855): negro mate con lente gris oscuro POLARIZADA.\n\nIncluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "wayfarer",
    "temple_material": "metal",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "gender": "unisex",
    "line": "urbana",
    "interchangeable_lenses": false,
    "prescription_adapter": false,
    "weight_grams": 26,
    "measurements": {"frame_width_mm": 146, "lens_width_mm": 56, "lens_height_mm": 43, "bridge_mm": 19, "temple_length_mm": 145},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Wayfarer con bisagras metálicas Flex", "body": "Estilo wayfarer clásico en G-Flex flexible, con bisagras metálicas Flex que aguantan el uso diario. La mayoría de las variantes vienen polarizadas."},
      {"type": "recommendation", "position": "middle", "title": "¿Cuál elegir?", "body": "Para manejar o la playa, la SBLK, MDBLU y MBLK son POLARIZADAS (eliminan reflejos). La MDBLU/REVO BLUE espejada azul es la más llamativa; la GREEN PEARL verde perlado es elección de estilo (no polarizada)."},
      {"type": "tip", "position": "bottom", "title": "Para que duren", "body": "Guardalos en el estuche y limpiá solo con la franela de microfibra. Si vas al mar o la pileta, enjuagalos con agua dulce antes de guardarlos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1568125119", "MLA1470866679", "MLA1511152053", "MLA1695939562"], "imported_at": "2026-06-02"}
  }'::jsonb,
  true, false,
  'Vulk Way Back Anteojos de Sol Wayfarer Polarizados Unisex | Óptica Carballo',
  'Anteojos Vulk Way Back wayfarer unisex: G-Flex, bisagras metálicas Flex, policarbonato UV400. 4 variantes (3 polarizadas). Stock real y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-way-back'), '128857',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10 POL","polarized":true}'::jsonb,
   8588309, 3, true, 1, 'MLA1568125119', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-way-back'), '128853',
   '{"frame_color":"azul-mate","lens_color":"azul-espejada","model_code":"MDBLU/REVO BLUE POL","polarized":true}'::jsonb,
   9180929, 3, true, 2, 'MLA1470866679', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-way-back'), '128854',
   '{"frame_color":"verde-perlado","lens_color":"gris-degrade","model_code":"GREEN PEARL/G.GREY","polarized":false}'::jsonb,
   7983239, 3, true, 3, 'MLA1511152053', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-way-back'), '128855',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   8622800, 0, true, 4, 'MLA1695939562', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: SBLK perfil. Perfil = primaria de cada variante.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-way-back'), (SELECT id FROM public.product_variants WHERE sku='128857'),
   'vulk-way-back/WAY BACK-SBLK-S10-PERFIL.jpg', 'Anteojo de sol Vulk Way Back wayfarer vista lateral, negro brillo con lente gris oscuro polarizada', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-way-back'), (SELECT id FROM public.product_variants WHERE sku='128857'),
   'vulk-way-back/WAYBACK-SBLK-S10 F.jpg', 'Anteojo de sol Vulk Way Back wayfarer vista frontal, negro brillo con lente gris oscuro polarizada', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-way-back'), (SELECT id FROM public.product_variants WHERE sku='128853'),
   'vulk-way-back/WAY BACK MDBLU-REVO BLUE p galeria.jpg', 'Anteojo de sol Vulk Way Back wayfarer vista lateral, azul mate con lente azul espejada polarizada', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-way-back'), (SELECT id FROM public.product_variants WHERE sku='128853'),
   'vulk-way-back/WAY BACK MDBLU-REVO BLUE f galeria.jpg', 'Anteojo de sol Vulk Way Back wayfarer vista frontal, azul mate con lente azul espejada polarizada', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-way-back'), (SELECT id FROM public.product_variants WHERE sku='128854'),
   'vulk-way-back/Way back- green pearl g.grey p galeria.jpg', 'Anteojo de sol Vulk Way Back wayfarer vista lateral, verde perlado con lente gris degradé', 1500, 1000, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-way-back'), (SELECT id FROM public.product_variants WHERE sku='128854'),
   'vulk-way-back/Way back- green pearl g.grey f galeria.jpg', 'Anteojo de sol Vulk Way Back wayfarer vista frontal, verde perlado con lente gris degradé', 1500, 1000, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-way-back'), (SELECT id FROM public.product_variants WHERE sku='128855'),
   'vulk-way-back/WAY BACK MBLK S10 POL P galeria.jpg', 'Anteojo de sol Vulk Way Back wayfarer vista lateral, negro mate con lente gris oscuro polarizada', 1500, 1000, 6, false),
  ((SELECT id FROM public.products WHERE slug='vulk-way-back'), (SELECT id FROM public.product_variants WHERE sku='128855'),
   'vulk-way-back/WAY BACK MBLK S10 POL. F galeria.jpg', 'Anteojo de sol Vulk Way Back wayfarer vista frontal, negro mate con lente gris oscuro polarizada', 1500, 1000, 7, false),
  ((SELECT id FROM public.products WHERE slug='vulk-way-back'), NULL,
   'vulk-way-back/medidas.webp', 'Esquema técnico de medidas Vulk Way Back: frente 146mm, lente 56x43mm, puente 19mm, varilla 145mm', 1500, 1500, 8, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
