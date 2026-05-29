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
-- Datos completados por founder (2026-05-29):
-- - SKU real: 126080 (código Rusty/distribuidor)
-- - measurements: frame_width 135mm, lens_height 45mm (medidos)
-- - 3 imágenes JPG provistas (frontal, lateral 3/4, esquema de medidas)
--
-- ⚠️ GAP restante: weight_grams (ML reporta 100g del PAQUETE, no del anteojo).
-- Founder mide anteojo solo en balanza después y hace UPDATE.
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
      "frame_width_mm": 135,
      "lens_width_mm": 66,
      "lens_height_mm": 45,
      "bridge_mm": 16,
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
-- SKU real: 126080 (confirmado por founder)
-- mercadolibre_item_id: MLA1432137395 (para sync futuro Sprint 2b)
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'rusty-yau-polarizado'),
  '126080',
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
-- Imágenes — 3 archivos JPG en bucket "products"
-- Path canónico: rusty-yau-polarizado/<filename>
-- ⚠️ Founder sube los 3 archivos vía Supabase Dashboard ANTES de aplicar
--    este seed (sino productos sin foto en grid → bounce inmediato).
-- =====================================================================
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text,
  width, height, sort_order, is_primary
)
VALUES
  -- Foto principal: vista lateral 3/4 (la del founder con armazón negro mate)
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-yau-polarizado'),
    (SELECT id FROM public.product_variants WHERE sku = '126080'),
    'rusty-yau-polarizado/01-lateral.jpg',
    'Rusty Yau anteojos deportivos polarizados vista lateral 3/4, armazón envolvente negro mate G-Flex',
    1500, 1000, 0, true
  ),
  -- Vista frontal — para hover crossfade en cards
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-yau-polarizado'),
    (SELECT id FROM public.product_variants WHERE sku = '126080'),
    'rusty-yau-polarizado/02-frontal.jpg',
    'Rusty Yau anteojos deportivos polarizados vista frontal, armazón envolvente negro mate',
    1500, 1000, 1, false
  ),
  -- Esquema técnico de medidas (aplica a todo el modelo, no a variante específica)
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-yau-polarizado'),
    NULL,
    'rusty-yau-polarizado/03-medidas.jpg',
    'Esquema técnico de medidas Rusty Yau: frente 135mm, lente 66x45mm, puente 16mm, varilla 120mm',
    1500, 1500, 2, false
  )
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id  = EXCLUDED.variant_id,
  alt_text    = EXCLUDED.alt_text,
  sort_order  = EXCLUDED.sort_order,
  is_primary  = EXCLUDED.is_primary,
  updated_at  = now();

COMMIT;
