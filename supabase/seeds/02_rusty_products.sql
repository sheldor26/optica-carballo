-- ============================================
-- Seed 02: Productos placeholder de Rusty (4 productos: 2 sol + 2 receta)
-- Fecha: 2026-05-28
-- ============================================
-- ⚠️ NOMBRES Y PRECIOS SON PLACEHOLDERS. Reemplazar con modelos reales
-- y precios reales cuando el founder los confirme. Marcados con [PH].
-- Las variantes tienen stock > 0 para que aparezcan en la página de marca.
-- ============================================

BEGIN;

-- =====================================================================
-- Productos Rusty — categoría "anteojos-de-sol"
-- =====================================================================
WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL),
  rx    AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES
  (
    (SELECT id FROM rusty),
    (SELECT id FROM sol),
    'rusty-wayfarer-classic-sol',
    'Rusty Wayfarer Classic — Sol [PH]',
    'Anteojo de sol estilo wayfarer con lentes polarizados.',
    'Modelo clásico wayfarer de Rusty. Marco de acetato negro mate con lentes polarizados que reducen reflejos. Protección UV400. [PLACEHOLDER — confirmar especificaciones reales con founder]',
    '{"frame_material": "acetate", "frame_shape": "wayfarer", "lens_treatment": ["polarized", "uv400"], "gender": "unisex"}'::jsonb,
    true,
    true,
    'Rusty Wayfarer Classic — Anteojos de sol polarizados',
    'Rusty Wayfarer Classic en Óptica Carballo. Lentes polarizados UV400. Envíos a todo Argentina.'
  ),
  (
    (SELECT id FROM rusty),
    (SELECT id FROM sol),
    'rusty-aviator-pilot-sol',
    'Rusty Aviator Pilot — Sol [PH]',
    'Aviador metálico con lentes degradé.',
    'Aviador clásico de Rusty con marco metálico dorado y lentes degradé marrón. Protección UV400. [PLACEHOLDER]',
    '{"frame_material": "metal", "frame_shape": "aviador", "lens_treatment": ["gradient", "uv400"], "gender": "unisex"}'::jsonb,
    true,
    false,
    'Rusty Aviator Pilot — Anteojos de sol aviador',
    'Rusty Aviator Pilot en Óptica Carballo. Aviador metálico con lentes degradé UV400.'
  ),
  (
    (SELECT id FROM rusty),
    (SELECT id FROM rx),
    'rusty-redondo-vintage-rx',
    'Rusty Redondo Vintage — Receta [PH]',
    'Armazón redondo vintage para anteojos de receta.',
    'Armazón redondo de Rusty con estética vintage. Acetato carey, ideal para receta. Cristales graduados se adaptan según tu prescripción. [PLACEHOLDER]',
    '{"frame_material": "acetate", "frame_shape": "redondo", "gender": "unisex"}'::jsonb,
    true,
    false,
    'Rusty Redondo Vintage — Armazón de receta',
    'Rusty Redondo Vintage en Óptica Carballo. Armazón vintage para receta, cristales personalizados.'
  ),
  (
    (SELECT id FROM rusty),
    (SELECT id FROM rx),
    'rusty-square-modern-rx',
    'Rusty Square Modern — Receta [PH]',
    'Armazón cuadrado moderno para anteojos de receta.',
    'Armazón cuadrado de Rusty con líneas modernas y minimalistas. Acetato negro, livianos y resistentes. [PLACEHOLDER]',
    '{"frame_material": "acetate", "frame_shape": "cuadrado", "gender": "unisex"}'::jsonb,
    true,
    false,
    'Rusty Square Modern — Armazón de receta',
    'Rusty Square Modern en Óptica Carballo. Armazón moderno para receta, diseño minimalista.'
  )
ON CONFLICT (slug) DO NOTHING;

-- =====================================================================
-- Variantes (SKUs vendibles)
-- Precios placeholder en centavos de ARS.
-- =====================================================================
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order)
VALUES
  -- rusty-wayfarer-classic-sol: 2 variantes
  ((SELECT id FROM public.products WHERE slug = 'rusty-wayfarer-classic-sol'),
   'RUSTY-WAY-CLA-NEG', '{"frame_color": "negro", "lens_color": "gris"}'::jsonb,
   5500000, 5, true, 1),
  ((SELECT id FROM public.products WHERE slug = 'rusty-wayfarer-classic-sol'),
   'RUSTY-WAY-CLA-CAR', '{"frame_color": "carey", "lens_color": "marron"}'::jsonb,
   5500000, 3, true, 2),

  -- rusty-aviator-pilot-sol: 1 variante
  ((SELECT id FROM public.products WHERE slug = 'rusty-aviator-pilot-sol'),
   'RUSTY-AVI-PIL-ORO', '{"frame_color": "dorado", "lens_color": "marron-degrade"}'::jsonb,
   6200000, 4, true, 1),

  -- rusty-redondo-vintage-rx: 1 variante
  ((SELECT id FROM public.products WHERE slug = 'rusty-redondo-vintage-rx'),
   'RUSTY-RED-VIN-CAR', '{"frame_color": "carey"}'::jsonb,
   7800000, 2, true, 1),

  -- rusty-square-modern-rx: 2 variantes
  ((SELECT id FROM public.products WHERE slug = 'rusty-square-modern-rx'),
   'RUSTY-SQU-MOD-NEG', '{"frame_color": "negro"}'::jsonb,
   7200000, 6, true, 1),
  ((SELECT id FROM public.products WHERE slug = 'rusty-square-modern-rx'),
   'RUSTY-SQU-MOD-AZU', '{"frame_color": "azul"}'::jsonb,
   7200000, 2, true, 2)
ON CONFLICT (sku) DO NOTHING;

COMMIT;
