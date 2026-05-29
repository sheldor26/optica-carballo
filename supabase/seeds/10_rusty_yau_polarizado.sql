-- ============================================
-- Seed 10: Rusty Yau Polarizado (sol) — primer producto importado de ML
-- Fecha: 2026-05-29
-- Origen: importado desde MLA1432137395 (Tienda Oficial OPTICACARBALLO 260502)
-- ============================================
-- Datos extraídos del JSON de ML vía /api/admin/ml-find-item:
-- - Marca: Rusty
-- - Precio ML: $98.350,02 → 9835002 centavos
-- - Stock disponible ML: 4
-- - Material armazón: G-Flex
-- - Color frame: Negro mate
-- - Color lente: Gris oscuro - Amarilla
-- - Lente: polarizada con protección UV
-- - Forma: Envolvente deportivo (wraparound)
-- - Línea: Deportiva (ciclismo)
-- - Medidas ML: bridge 16mm, lens_width 66mm, temple 120mm
--
-- ⚠️ GAPS pendientes (cargados como NULL, founder completa después):
-- - weight_grams: ML reporta 100g del PAQUETE, no del anteojo. Founder mide
--   anteojo solo en balanza y hace UPDATE.
-- - measurements.frame_width_mm: no en JSON ML, founder mide con regla.
-- - measurements.lens_height_mm: no en JSON ML, founder mide.
-- - SKU: usado SKU placeholder 'RUSTY-YAU-MBLKS10-POL' — si Rusty tiene
--   código interno, founder hace UPDATE.
-- - Imágenes: founder sube 2 fotos al bucket products/rusty-yau-polarizado/
--   antes de aplicar (sino productos sin foto en grid).
-- ============================================

BEGIN;

-- =====================================================================
-- Producto base
-- =====================================================================
WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
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
  (SELECT id FROM rusty),
  (SELECT id FROM sol),
  'rusty-yau-polarizado',
  'Rusty Yau Polarizado',
  'Lentes Rusty Yau polarizados con armazón envolvente G-Flex. Pensados para ciclismo, running y actividades al aire libre con sol intenso.',
  E'Los Rusty Yau son anteojos deportivos pensados para uso al aire libre intenso — ciclismo, running, trail, kayak, pesca. El armazón envolvente cubre los ojos en toda su periferia, bloqueando el ingreso de luz lateral y polvo durante la actividad.\n\nEl material G-Flex (termoplástico flexible patentado por Rusty) hace que el anteojo aguante torsiones, golpes y caídas mejor que un acetato tradicional. Las patillas no se rompen al doblarlas y la bisagra reforzada soporta uso intensivo.\n\nLas lentes polarizadas son la clave del modelo: eliminan los reflejos del agua, asfalto y vidrio que generan fatiga visual y reducen el contraste durante el deporte. Sumado a la protección UV400 (filtro 100% UVA y UVB), tu vista queda protegida durante toda la actividad. El color gris oscuro con amarilla genera buen contraste tanto en días soleados como nublados.\n\nIncluye estuche original Rusty y franela de microfibra. Garantía oficial 1 año del fabricante contra defectos.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "wraparound",
    "frame_color": "negro-mate",
    "lens_color": "gris-oscuro-amarilla",
    "lens_material": "policarbonato",
    "lens_treatment": ["polarized", "uv400"],
    "gender": "unisex",
    "line": "deportiva",
    "model_code": "YAU MBLK/S10 POL YELLOW",
    "measurements": {
      "bridge_mm": 16,
      "lens_width_mm": 66,
      "temple_length_mm": 120
    },
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "imported_from": {
      "marketplace": "mercadolibre",
      "item_id": "MLA1432137395",
      "imported_at": "2026-05-29"
    }
  }'::jsonb,
  true,
  false,
  'Lentes Rusty Yau Polarizados Ciclismo | Óptica Carballo',
  'Anteojos Rusty Yau polarizados, armazón envolvente G-Flex para deporte. Stock real, asesoramiento óptico matriculado y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  short_description = EXCLUDED.short_description,
  description       = EXCLUDED.description,
  attributes        = EXCLUDED.attributes,
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  updated_at        = now();

-- =====================================================================
-- Variante única — Negro Mate / Gris Oscuro - Amarilla
-- precio ML: $98.350,02 → 9835002 centavos
-- stock disponible ML al 2026-05-29: 4 unidades
-- mercadolibre_item_id: MLA1432137395 (para sync futuro Sprint 2b)
-- ⚠️ SKU placeholder — si Rusty/Vulk distribuidor tiene código real, UPDATE.
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'rusty-yau-polarizado'),
  'RUSTY-YAU-MBLKS10-POL',
  '{
    "frame_color": "negro-mate",
    "lens_color": "gris-oscuro-amarilla",
    "model_code": "YAU MBLK/S10 POL YELLOW"
  }'::jsonb,
  9835002,
  4,
  true,
  1,
  'MLA1432137395'
)
ON CONFLICT (sku) DO UPDATE SET
  attributes           = EXCLUDED.attributes,
  price_cents          = EXCLUDED.price_cents,
  stock_qty            = EXCLUDED.stock_qty,
  mercadolibre_item_id = EXCLUDED.mercadolibre_item_id,
  updated_at           = now();

-- =====================================================================
-- Imágenes — 2 archivos en bucket "products"
-- Path canónico: rusty-yau-polarizado/<filename>
-- ⚠️ Founder sube los 2 archivos vía Supabase Dashboard ANTES de aplicar
--    este seed (sino productos sin foto en grid → bounce inmediato).
-- Sugerencia: descargar de ML https://articulo.mercadolibre.com.ar/MLA-1432137395
--   o usar fotos propias del local con buena iluminación.
-- =====================================================================
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text,
  width, height, sort_order, is_primary
)
VALUES
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-yau-polarizado'),
    (SELECT id FROM public.product_variants WHERE sku = 'RUSTY-YAU-MBLKS10-POL'),
    'rusty-yau-polarizado/01-frontal.webp',
    'Rusty Yau anteojos deportivos polarizados vista frontal, armazón envolvente negro mate',
    1200, 1200, 0, true
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-yau-polarizado'),
    (SELECT id FROM public.product_variants WHERE sku = 'RUSTY-YAU-MBLKS10-POL'),
    'rusty-yau-polarizado/02-lateral.webp',
    'Rusty Yau anteojos deportivos polarizados vista lateral, patilla negra G-Flex',
    1200, 1200, 1, false
  )
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id  = EXCLUDED.variant_id,
  alt_text    = EXCLUDED.alt_text,
  sort_order  = EXCLUDED.sort_order,
  is_primary  = EXCLUDED.is_primary,
  updated_at  = now();

COMMIT;
