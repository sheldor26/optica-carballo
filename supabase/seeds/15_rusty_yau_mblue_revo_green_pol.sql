-- ============================================
-- Seed 15: Variante nueva Rusty Yau — MBLUE/R. GREEN POL - YELLOW
-- + UPDATE producto con adaptador para lentes graduadas
-- Fecha: 2026-05-30
-- ============================================
-- Variante 126082 — Azul Mate / Lentes Verde Espejada Polarizada
--   MBLUE      = armazón Azul Mate
--   R. GREEN   = lentes Verde Espejada Polarizadas (Revo Green)
--   POL        = polarizado
--   YELLOW     = incluye par adicional amarillas (común a todas las variantes)
--
-- Listing ML SEPARADO: MLA2707007110 (no multi-variation con las otras).
--
-- Datos extraídos de ML (prod, 2026-05-30 vía /api/admin/ml-import-preview):
--   price 103902 ARS → 10390200 centavos
--   available_quantity 3
--   seller_id 81654493, official store 260502
--   DETAILED_MODEL: "Yau Mblu/Revo Green"
--
-- ============================================
-- ADEMÁS: UPDATE al producto Rusty Yau para reflejar el ADAPTADOR INTERNO
-- EXTRAÍBLE PARA LENTES GRADUADAS — característica común a TODAS las
-- variantes del modelo, omitida en el seed 10 original.
-- ============================================
--
-- Founder sube 2 fotos al bucket `products/rusty-yau/` con estos nombres EXACTOS:
--   06-revo-green-lateral.jpg  (foto principal, vista lateral 3/4)
--   07-revo-green-frontal.jpg  (vista frontal, para hover crossfade)
-- Cropear igual que las anteriores (anteojo centrado ~75-85% del frame) para
-- consistencia visual en galería.
-- ============================================

BEGIN;

-- =====================================================================
-- 1. UPDATE producto Rusty Yau — agregar adaptador para lentes graduadas
-- Afecta a TODAS las variantes (es característica del modelo, no de variante).
-- =====================================================================
UPDATE public.products
SET
  description = E'Los Rusty Yau son anteojos deportivos pensados para uso al aire libre intenso — ciclismo, running, trail, kayak, pesca, deportes al sol. El diferencial: vienen con DOS pares de lentes intercambiables, así adaptás el anteojo a las condiciones del día sin cambiar de modelo.\n\nEl primer par —polarizado— es el que viene montado en el armazón. Las lentes polarizadas eliminan los reflejos del agua, asfalto y vidrio que generan fatiga visual durante el deporte. Sumado a la protección UV400 (filtro 100% UVA y UVB), tu vista queda protegida en condiciones de luz solar intensa.\n\nEl segundo par —amarillas— amplía el rango de uso. Las lentes amarillas aumentan el contraste y la percepción de profundidad en días nublados, niebla matinal o atardeceres. Son ideales para ciclismo en horas pico de tráfico o running antes del amanecer. No son polarizadas (la polarización es contraproducente con poca luz), pero mantienen el filtro UV.\n\nEl armazón es envolvente: cubre los ojos en toda su periferia, bloqueando el ingreso de luz lateral, polvo y viento durante la actividad. El material G-Flex (termoplástico flexible patentado por Rusty) aguanta torsiones, golpes y caídas mejor que un acetato tradicional. Las patillas no se rompen al doblarlas y la bisagra reforzada soporta uso intensivo.\n\nIncluyen además un adaptador interno extraíble para lentes graduadas: si necesitás receta (miopía, astigmatismo, presbicia), llevás los Rusty Yau a tu óptico para colocar las lentes graduadas en el adaptador. Mantenés el anteojo deportivo completo con su protección lateral envolvente y tus lentes recetadas adentro — sin necesidad de cambiar a un anteojo deportivo recetado costoso. El adaptador se quita cuando querés volver al uso solo con polarizadas o amarillas.\n\nIncluye estuche original Rusty, franela de microfibra, el segundo par de lentes amarillas y el adaptador interno. Garantía oficial 1 año del fabricante contra defectos.',
  attributes = jsonb_set(
    jsonb_set(
      attributes,
      '{prescription_adapter}',
      'true'::jsonb
    ),
    '{includes}',
    '["estuche", "franela", "par-lentes-amarillas-adicionales", "adaptador-interno-lentes-graduadas"]'::jsonb
  )
                || jsonb_build_object(
                  'callouts', (attributes->'callouts') || jsonb_build_array(
                    jsonb_build_object(
                      'type', 'info',
                      'position', 'middle',
                      'title', '¿Usás receta?',
                      'body', 'El Rusty Yau incluye un adaptador interno extraíble pensado para lentes graduadas. Tu óptico lo retira, monta tus lentes recetadas según tu prescripción y lo vuelve a colocar adentro del armazón. Resultado: anteojo deportivo completo + tu receta, sin pagar un modelo deportivo recetado nuevo. Ideal para deportistas con miopía, astigmatismo o presbicia que no quieren resignar el armazón envolvente.'
                    )
                  )
                ),
  updated_at = now()
WHERE slug = 'rusty-yau';

-- =====================================================================
-- 2. INSERT Variante 126082 — Azul Mate / Lentes Verde Espejada Polarizada
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'rusty-yau'),
  '126082',
  '{
    "frame_color": "azul-mate",
    "lens_color": "verde-espejado",
    "model_code": "MBLUE/R. GREEN POL - YELLOW"
  }'::jsonb,
  10390200,
  3,
  true,
  3,
  'MLA2707007110',
  NULL
)
ON CONFLICT (sku) DO UPDATE SET
  product_id                  = EXCLUDED.product_id,
  attributes                  = EXCLUDED.attributes,
  price_cents                 = EXCLUDED.price_cents,
  stock_qty                   = EXCLUDED.stock_qty,
  mercadolibre_item_id        = EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code = EXCLUDED.mercadolibre_variation_code,
  updated_at                  = now();

-- =====================================================================
-- 3. Imágenes variante 126082 — 2 archivos JPG en bucket "products"
-- Path canónico: rusty-yau/<filename>
-- (La 3ra imagen — medidas — es compartida y ya existe, variant_id NULL.)
-- =====================================================================
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text,
  width, height, sort_order, is_primary
)
VALUES
  -- Foto primary: lateral 3/4
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-yau'),
    (SELECT id FROM public.product_variants WHERE sku = '126082'),
    'rusty-yau/06-revo-green-lateral.jpg',
    'Rusty Yau anteojos deportivos vista lateral 3/4, armazón azul mate con lentes verde espejada polarizada Revo Green',
    1500, 1000, 0, true
  ),
  -- Foto secundaria: frontal
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-yau'),
    (SELECT id FROM public.product_variants WHERE sku = '126082'),
    'rusty-yau/07-revo-green-frontal.jpg',
    'Rusty Yau anteojos deportivos vista frontal, lentes verde espejada polarizada Revo Green, armazón envolvente azul mate',
    1500, 1000, 1, false
  )
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id  = EXCLUDED.variant_id,
  alt_text    = EXCLUDED.alt_text,
  sort_order  = EXCLUDED.sort_order,
  is_primary  = EXCLUDED.is_primary,
  updated_at  = now();

COMMIT;
