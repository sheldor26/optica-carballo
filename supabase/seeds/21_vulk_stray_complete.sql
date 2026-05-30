-- ============================================
-- Seed 21: Complete Vulk Stray — UPDATE producto + 5ta variante CRY
-- Fecha: 2026-05-30
-- ============================================
-- Founder pasó info completa post-seed 20:
--   - 5ta variante "Gris" en ML es realmente **CRY (Transparente)**
--   - Material frente + patillas: G-Flex
--   - Bisagras: Metálicas con sistema Flex
--   - Lente: Demo (de exhibición, NO graduadas)
--   - Medidas: 144mm frente, 50-20-145, altura 46mm, peso 36.5g
--   - Talle: Large
--   - Forma: Cuadrado/Rectangular
--   - Género: Unisex
--   - Adapta: monofocales, bifocales, progresivos
--
-- Nota: founder texto original decía 52mm lens_width pero la imagen de
-- medidas dice 50mm. Founder confirmó: imagen es correcta → 50mm.
--
-- SKU 126892 para la variante CRY (confirmado por founder post-seed
-- generado — el placeholder que asumí coincidió con el real).
-- ============================================

BEGIN;

-- =====================================================================
-- 1. UPDATE producto Vulk Stray — completar attributes + description
-- =====================================================================
UPDATE public.products
SET
  description = E'El Vulk Stray es un armazón de receta unisex de líneas modernas, pensado para uso diario con lentes graduadas. Ideal para quienes buscan un armazón cómodo y versátil sin sacrificar estilo.\n\nEl armazón frente y patillas están fabricados en G-Flex (termoplástico flexible patentado por Vulk): aguanta torsiones, caídas y uso intensivo mejor que un acetato tradicional. Combinado con las bisagras metálicas Flex, las patillas absorben presión lateral sin romperse — útil si lo llevás en bolso, mochila o cartera todo el día.\n\nEl frente es cuadrado/rectangular con líneas suaves que favorecen rostros de tamaño mediano. Forma versátil unisex que funciona para uso casual, oficina o profesional.\n\nViene con lentes Demo (de exhibición, sin graduación). El armazón está preparado para colocar lentes graduadas según tu receta: admite monofocales, bifocales y progresivos. Te asesoramos sobre el tipo de lente más conveniente (con filtro luz azul, antirreflejo, fotocromático, etc.) según tu uso y prescripción — consultanos por WhatsApp tras la compra para coordinar el trabajo con tu óptico o el nuestro.\n\nDisponible en 5 colores: Negro Mate (MBLK), Negro Satinado (SBLK), Transparente (CRY), Gris Oscuro Transparente línea 663 Optics, y Demi combinado con Negro Mate (MDEMI-MBLK).\n\nMedidas: 144mm de frente x 46mm de altura, calibre del aro 50mm, puente 20mm, patillas 145mm. Peso 36.5g — liviano para uso prolongado.\n\nIncluye estuche original Vulk, franela de microfibra y garantía oficial 1 año del fabricante contra defectos del armazón.',
  attributes = attributes
    || jsonb_build_object(
      'frame_material', 'g-flex',
      'frame_shape', 'rectangular',
      'gender', 'unisex',
      'size', 'large',
      'weight_grams', 36.5,
      'hinge_system', 'flex-metal',
      'lens_type', 'demo',
      'compatible_lens_types', jsonb_build_array('monofocal', 'bifocal', 'progresivo'),
      'measurements', jsonb_build_object(
        'frame_width_mm', 144,
        'lens_width_mm', 50,
        'lens_height_mm', 46,
        'bridge_mm', 20,
        'temple_length_mm', 145
      )
    ),
  updated_at = now()
WHERE slug = 'vulk-stray';

-- =====================================================================
-- 2. INSERT 5ta variante CRY (Transparente)
-- ML variation 185252770949 (listada como "Gris" en ML, founder confirmó
-- que es CRY transparente). Stock 5 en ML.
-- SKU 126892 (confirmado founder).
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'vulk-stray'),
  '126892',
  '{
    "frame_color": "transparente",
    "model_code": "CRY"
  }'::jsonb,
  9300000,
  5,
  true,
  5,
  'MLA1824193366',
  '185252770949'
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
-- 3. INSERT 2 imágenes para variante CRY
-- Founder sube al bucket `products/vulk-stray-receta/`:
--   10-cry-lateral.jpg
--   11-cry-frontal.jpg
-- =====================================================================
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text,
  width, height, sort_order, is_primary
)
VALUES
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-stray'),
    (SELECT id FROM public.product_variants WHERE sku = '126892'),
    'vulk-stray-receta/10-cry-lateral.jpg',
    'Vulk Stray armazón de receta vista lateral, color transparente cristal CRY',
    1500, 1000, 0, true
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-stray'),
    (SELECT id FROM public.product_variants WHERE sku = '126892'),
    'vulk-stray-receta/11-cry-frontal.jpg',
    'Vulk Stray vista frontal, armazón rectangular cristal transparente',
    1500, 1000, 1, false
  )
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id  = EXCLUDED.variant_id,
  alt_text    = EXCLUDED.alt_text,
  sort_order  = EXCLUDED.sort_order,
  is_primary  = EXCLUDED.is_primary,
  updated_at  = now();

COMMIT;
