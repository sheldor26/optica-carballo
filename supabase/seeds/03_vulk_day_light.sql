-- ============================================
-- Seed 03: 1er producto REAL de Óptica Carballo — Vulk Day Light (sol)
-- Fecha: 2026-05-28
-- ============================================
-- Datos confirmados por founder. Copy generado por content-writer-medical,
-- meta_title + meta_description optimizados por seo-strategist
-- (60 chars title con keyword frase, description con trust signal de
-- técnico óptico matriculado en vez de "G-Flex" sin volumen).
-- Slug definitivo: vulk-day-light (sin sufijo -sol redundante con
-- la categoría parent).
-- ============================================

BEGIN;

-- =====================================================================
-- Producto base
-- =====================================================================
WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (
    SELECT id FROM public.categories
    WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL
  )
INSERT INTO public.products (
  brand_id, category_id, slug, name,
  short_description, description, attributes,
  is_active, is_featured, meta_title, meta_description
)
VALUES (
  (SELECT id FROM vulk),
  (SELECT id FROM sol),
  'vulk-day-light',
  'Vulk Day Light',
  'Anteojos de sol Vulk Day Light polarizados, armazón rectangular pequeño en G-Flex. Liviano, unisex, ideal para uso urbano.',
  E'Los lentes de sol Vulk Day Light son un rectangular pequeño pensado para quien busca un anteojo discreto, prolijo y con buen agarre al rostro. Diseño unisex, líneas limpias y un peso de 26,1 gramos que casi no se siente durante el día.\n\nEl armazón está hecho en G-Flex, el termoplástico patentado por Vulk: flexible, resistente a torsiones y a los apretones del bolsillo. Las patillas acompañan el movimiento sin perder firmeza, y las bisagras reforzadas aguantan el uso diario. Funciona tanto para manejar como para caminar la ciudad o moverte al aire libre.\n\nLas lentes polarizadas cortan los reflejos del asfalto, el agua y los vidrios, y suman protección UV total. Tené en cuenta una cosa: como toda lente polarizada, las pantallas LCD del tablero del auto, GPS o cajeros pueden verse oscurecidas o con efecto arcoíris según el ángulo. Es propio del polarizado, no un defecto.\n\nSe entrega con su estuche original de Vulk. Stock real en Óptica Carballo, con asesoramiento técnico matriculado.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "rectangular",
    "lens_treatment": ["polarized", "uv400"],
    "gender": "unisex",
    "weight_grams": 26.1,
    "hinge_material": "reinforced-plastic",
    "measurements": {
      "frame_width_mm": 140,
      "lens_width_mm": 51,
      "lens_height_mm": 31,
      "bridge_mm": 20,
      "temple_length_mm": 140
    },
    "callouts": [
      {
        "type": "info",
        "position": "top",
        "title": "Sabías que…",
        "body": "Las lentes polarizadas tienen un filtro que funciona como una rejilla microscópica. Bloquea la luz horizontal de reflejos en agua, asfalto mojado y vidrios, dejando pasar el resto. Por eso ves los colores con más contraste. Es física pura, no marketing."
      },
      {
        "type": "recommendation",
        "position": "middle",
        "title": "Recomendación",
        "body": "Ideales para manejar de día, playa, montaña, pesca o cualquier exterior con reflejos. Vas a notar menos fatiga visual al sol. No los uses para manejar de noche: al filtrar luz polarizada, ves menos en ambientes oscuros."
      },
      {
        "type": "tip",
        "position": "bottom",
        "title": "Para que no se rayen las lentes",
        "body": "Usá siempre la franela de microfibra que viene con tus anteojos (la remera o un papel rayan el cristal). Lavalos con agua tibia y jabón neutro. Y nunca los dejes en la guantera del auto al sol: el calor deforma el G-Flex con el tiempo."
      }
    ]
  }'::jsonb,
  true,
  true,
  'Lentes de Sol Vulk Day Light Polarizados | Óptica Carballo',
  'Anteojos de sol Vulk Day Light polarizados, armazón G-Flex carey brillo. Stock real, asesoramiento óptico matriculado y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  short_description = EXCLUDED.short_description,
  description       = EXCLUDED.description,
  attributes        = EXCLUDED.attributes,
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  is_featured       = EXCLUDED.is_featured,
  updated_at        = now();

-- =====================================================================
-- Variante única (Carey Brillo / Verde) — datos REALES del founder
-- precio: $88.037 → 8803700 centavos
-- stock: 3 unidades
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order
)
VALUES
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
    '194185',
    '{
      "frame_color": "carey-brillo",
      "lens_color": "verde",
      "reference_code": "SDEMI-DRWG 15C3 POL."
    }'::jsonb,
    8803700,
    3,
    true,
    1
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
    '194180',
    '{
      "frame_color": "rosa-palido-caramelo",
      "lens_color": "gris-oscuro-degrade",
      "reference_code": "L.PINK/DRT-25 POL."
    }'::jsonb,
    8803700,
    3,
    true,
    2
  )
ON CONFLICT (sku) DO UPDATE SET
  attributes  = EXCLUDED.attributes,
  price_cents = EXCLUDED.price_cents,
  stock_qty   = EXCLUDED.stock_qty,
  updated_at  = now();

-- =====================================================================
-- Imágenes (3 archivos en el bucket "products")
-- Path canónico: vulk-day-light/<filename>
-- ⚠️ Founder sube los 3 archivos vía Supabase Dashboard antes de
--    aplicar este seed (sino los Image components devuelven 404).
-- =====================================================================
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text,
  width, height, sort_order, is_primary
)
VALUES
  -- Variante Carey (SKU 194185)
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
    (SELECT id FROM public.product_variants WHERE sku = '194185'),
    'vulk-day-light-sol/01-lateral.jpg',
    'Vulk Day Light anteojos de sol vista lateral 3/4, armazón carey brillo con patilla negra',
    1500, 1500, 0, true
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
    (SELECT id FROM public.product_variants WHERE sku = '194185'),
    'vulk-day-light-sol/02-frontal.jpg',
    'Vulk Day Light anteojos de sol vista frontal, armazón rectangular pequeño carey brillo',
    1500, 1500, 1, false
  ),
  -- Esquema de medidas (aplica a todas las variantes del modelo)
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
    NULL,
    'vulk-day-light-sol/03-medidas.jpg',
    'Esquema técnico de medidas Vulk Day Light: frente 140mm, lente 51x31mm, puente 20mm, varilla 140mm',
    1500, 1500, 2, false
  ),
  -- Variante Rosa Pálido (SKU 194180)
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
    (SELECT id FROM public.product_variants WHERE sku = '194180'),
    'vulk-day-light-sol/04-lateral-rosa.jpg',
    'Vulk Day Light vista lateral 3/4, armazón rosa pálido y caramelo con lentes gris oscuro degradé',
    1500, 1500, 3, true
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
    (SELECT id FROM public.product_variants WHERE sku = '194180'),
    'vulk-day-light-sol/05-frontal-rosa.jpg',
    'Vulk Day Light vista frontal, armazón rosa pálido transparente con lentes gris oscuro degradé',
    1500, 1500, 4, false
  )
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id = EXCLUDED.variant_id,
  alt_text   = EXCLUDED.alt_text,
  sort_order = EXCLUDED.sort_order,
  is_primary = EXCLUDED.is_primary,
  updated_at = now();

COMMIT;
