-- ============================================
-- Seed 77: Rusty The Take SOL — AVIADOR doble puente unisex, polarizado, 1 color
-- Fecha: 2026-06-29
-- ============================================
-- Anteojo de SOL aviador doble puente unisex (hermano del The Take receta, seed 76). Frente
-- G-Flex con bisagras flex customizadas + PATILLAS DE ACETATO (≠ receta que es g-flex). Lente
-- policarbonato POLARIZADA 100% UV. 18g. 1 item simple (variation_code NULL):
--   MBLK/S10 POL  SKU 129234 MLA2498747644 $85.917,95 stock 3 (negro mate, lente gris S10, POLARIZADA)
--
-- frame_shape="aviador" (español; título ML dice "rectangular" pero founder manda → aviador doble
-- puente). frame_material g-flex (frente; el acetato de las patillas → temple_material + descripción).
-- 1/1 polarized:true → /polarizados (vía flag de variante). lens_treatment producto ["uv400"];
-- polarized va en el flag de la variante (patrón Raven/Trial). Default sol: policarbonato / cat 3.
-- weight_grams 18 (ML). gender unisex.
--
-- Medidas (de la FOTO, = al receta): frente 136 / lente 51x46 / puente 16 / varilla 145 mm.
--
-- HONESTIDAD: 1/1 polarizada → SÍ se afirma "Polarizado" en title/H1 (criterio Terdey/The Sil 3/3).
-- SEO por seo-strategist: primaria forma `lentes de sol aviador` (170, carril único del cluster
-- Rusty-sol) + branded; head `lentes de sol rusty` (1.300) de soporte. meta_title destaca Aviador.
-- **Anti-canibalización**: (A) vs Vulk The Trial sol (también aviador doble puente): marca distinta
-- + The Trial es 2/4 pol (destaca Unisex), The Take 1/1 pol (afirma Polarizado) + cross-link.
-- (B) vs The Take RECETA: intención sol vs receta distinta + cross-link sol↔receta.
--
-- 📸 FOTOS: en bucket rusty-the-take/ (sol) — 900×442. 1 var × (perfil+frente) + medidas.png.
-- Grid primary = PERFIL. Scale 1.0 (900×442 más ancho que el card → object-contain llena por
-- ancho; como Raven/Trial/receta). medidas.png sort 99 (última).
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-the-take', 'Rusty The Take',
  'Lentes de sol Rusty The Take: aviador de doble puente unisex, polarizados. Frente G-Flex con bisagras flex customizadas y patillas de acetato. Lente de policarbonato con 100% protección UV (UV400, categoría 3). Ultraliviano, 18g.',
  E'Los **Rusty The Take** son **lentes de sol aviador de doble puente, unisex**. El **frente es de G-Flex** con bisagras flex customizadas y las **patillas de acetato**, para un calce cómodo y resistente. La **lente es de policarbonato, polarizada**, con **100% protección UV (UV400, categoría 3)** — corta el reflejo del agua, la nieve y el asfalto. Ultraliviano: solo **18 g**.\n\nMedidas: frente 136 mm · lente 51 mm de ancho × 46 mm de alto · puente 16 mm · varilla 145 mm.\n\nVersión: MBLK/S10 — negro mate con lente gris polarizada.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante. ¿Lo querés con tu graduación? Mirá la versión de receta del Rusty The Take.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "aviador",
    "temple_material": "acetate",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "weight_grams": 18,
    "measurements": {"frame_width_mm": 136, "lens_width_mm": 51, "lens_height_mm": 46, "bridge_mm": 16, "temple_length_mm": 145},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Aviador doble puente polarizado", "body": "Diseño aviador de doble puente unisex, ultraliviano (18 g). Frente de G-Flex con bisagras flex customizadas y patillas de acetato. Lente de policarbonato polarizada con 100% protección UV (UV400, categoría 3)."},
      {"type": "tip", "position": "middle", "title": "Lente polarizada", "body": "La lente polarizada corta el reflejo del agua, la nieve y el asfalto — ideal para manejar y para actividades al aire libre."},
      {"type": "recommendation", "position": "bottom", "title": "¿Lo necesitás con graduación?", "body": "Este modelo también está como armazón de receta. Si dudás cuál te conviene, escribinos por WhatsApp y te asesoramos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2498747644"], "imported_at": "2026-06-29"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Rusty The Take Aviador | Óptica Carballo',
  'Lentes de sol Rusty The Take, aviador doble puente unisex con lentes polarizadas y filtro UV400. Originales, con envío a todo el país y garantía.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 1 variante (item simple → variation_code NULL). polarized:true → /polarizados.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-the-take'), '129234',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   8591795, 3, true, 1, 'MLA2498747644', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes: perfil (grid) + frente. medidas.png sort 99 (última).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-the-take'), (SELECT id FROM public.product_variants WHERE sku='129234'),
   'rusty-the-take/THE_TAKE_L.GREY-mblk_s10_pol_-_p.jpg', 'Lentes de sol Rusty The Take aviador doble puente unisex vista lateral, negro mate lente polarizada gris', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-the-take'), (SELECT id FROM public.product_variants WHERE sku='129234'),
   'rusty-the-take/THE_TAKE_L.GREY-mblk_s10_pol_-_f.jpg', 'Lentes de sol Rusty The Take aviador doble puente unisex vista frontal, negro mate lente polarizada gris', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-the-take'), NULL,
   'rusty-the-take/medidas.png', 'Esquema técnico de medidas Rusty The Take: frente 136mm, lente 51x46mm, puente 16mm, varilla 145mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
