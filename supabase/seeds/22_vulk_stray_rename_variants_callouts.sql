-- ============================================
-- Seed 22: Vulk Stray — rename variantes + agregar callouts
-- Fecha: 2026-05-30
-- ============================================
-- 2 cambios solicitados por founder:
--
-- 1. Renombrar variantes (SOLO en mi web — no afecta sync ML porque el
--    sync usa `mercadolibre_variation_code` literal, no el frame_color):
--    - SBLK 126891: "Negro Satinado" → "Negro Brillo"
--      (frame_color: 'negro-satinado' → 'negro-brillo')
--    - MDEMI-MBLK 126899: "Demi Negro Mate" → "Frente Carey Mate con
--      Patillas Negro Mate" (frame_color: 'demi-negro-mate' → 'carey-mate-y-negro-mate')
--
-- 2. Agregar 3 callouts al producto (founder pidió variar tema:
--    curiosidades, cosas a tener en cuenta, tips). Distintos a los de
--    Vulk Day Light/Yamain — no repetir.
--
-- Frontend: `components/product/variant-list.tsx` ya tiene los labels
-- nuevos en FRAME_COLOR_LABELS (commit anterior).
-- ============================================

BEGIN;

-- =====================================================================
-- 1a. Rename SBLK 126891: Negro Satinado → Negro Brillo
-- =====================================================================
UPDATE public.product_variants
SET
  attributes = jsonb_set(attributes, '{frame_color}', '"negro-brillo"'::jsonb),
  updated_at = now()
WHERE sku = '126891';

-- =====================================================================
-- 1b. Rename MDEMI-MBLK 126899: Demi Negro Mate → Frente Carey Mate con
--     Patillas Negro Mate
-- =====================================================================
UPDATE public.product_variants
SET
  attributes = jsonb_set(
    attributes,
    '{frame_color}',
    '"carey-mate-y-negro-mate"'::jsonb
  ),
  updated_at = now()
WHERE sku = '126899';

-- =====================================================================
-- 2. UPDATE producto: agregar 3 callouts variados al Vulk Stray
-- =====================================================================
UPDATE public.products
SET
  attributes = jsonb_set(
    attributes,
    '{callouts}',
    jsonb_build_array(
      jsonb_build_object(
        'type', 'info',
        'position', 'top',
        'title', 'El G-Flex nació en el deporte extremo',
        'body', 'Vulk desarrolló originalmente el material G-Flex para anteojos de surf y snowboard, donde el armazón se golpea, dobla y moja constantemente. Después lo adaptaron al uso urbano. Por eso resiste torsiones que harían crujir un acetato tradicional — es termoplástico flexible, no rígido.'
      ),
      jsonb_build_object(
        'type', 'recommendation',
        'position', 'middle',
        'title', '¿Cuál color elegir según tu estilo?',
        'body', 'Transparente (cristal): minimalista, casi invisible — favorece looks profesionales y se adapta a cualquier paleta de outfit. Negro mate o brillo: clásico universal, alto contraste con la cara, sin variar según la ropa. Carey mate con patillas negras: agrega calidez sin sobrecargar — ideal si tu tono de piel es cálido o si querés algo más sofisticado que el negro puro. Línea 663 (gris oscuro transparente): el más sutil — color sin parecer color.'
      ),
      jsonb_build_object(
        'type', 'tip',
        'position', 'bottom',
        'title', 'Para que tus lentes graduadas duren más',
        'body', 'Limpiá los cristales SIEMPRE con la franela de microfibra incluida — no con la remera ni con servilletas (rayan el tratamiento antirreflejo). Si las patillas se aflojan con el tiempo, traelas a la óptica: el ajuste con calor controlado es gratis y devuelve el armazón a su forma original. Guardalas en el estuche cuando no las uses — el bolso o cartera sin protección es la causa #1 de cristales rayados.'
      )
    )
  ),
  updated_at = now()
WHERE slug = 'vulk-stray';

COMMIT;

-- Verificación:
-- SELECT sku, attributes->>'frame_color' FROM product_variants
-- WHERE sku IN ('126891', '126899');
-- Esperado: '126891' = negro-brillo, '126899' = carey-mate-y-negro-mate
--
-- SELECT slug, jsonb_array_length(attributes->'callouts') FROM products
-- WHERE slug = 'vulk-stray';
-- Esperado: 3
