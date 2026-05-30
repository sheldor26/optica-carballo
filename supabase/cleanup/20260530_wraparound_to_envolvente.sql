-- ============================================
-- Cleanup: normalizar 'wraparound' → 'envolvente' en attributes.frame_shape
-- Fecha: 2026-05-30
-- ============================================
-- Founder pidió usar el término argentino correcto. La migration anterior
-- (20260530100000_normalize_frame_shapes_spanish) había dejado 'wraparound'
-- como gap documentado por no estar en el enum FRAME_SHAPES.
--
-- Ahora se agregó 'envolvente' al enum + labels en UI (product-attributes,
-- frame-shape-filters, face-shape/copy), entonces se completa la normalización.
--
-- Productos afectados: rusty-yau (único con frame_shape=wraparound).
-- Idempotente: si ya está como envolvente, no hace nada.
-- ============================================

BEGIN;

UPDATE public.products
SET attributes = jsonb_set(attributes, '{frame_shape}', '"envolvente"'::jsonb, false),
    updated_at = now()
WHERE attributes->>'frame_shape' = 'wraparound';

-- Verificación: log de productos con valores fuera del enum (debería ser 0
-- después de este cleanup).
DO $$
DECLARE
  off_enum_count integer;
BEGIN
  SELECT count(*) INTO off_enum_count
  FROM public.products
  WHERE attributes ? 'frame_shape'
    AND attributes->>'frame_shape' NOT IN (
      'rectangular','cuadrado','redondo','ovalado','aviador',
      'cat_eye','mariposa','geometrico','wayfarer','clubmaster',
      'sin_marco','envolvente'
    );

  IF off_enum_count > 0 THEN
    RAISE NOTICE 'Quedan % productos con frame_shape fuera del enum.', off_enum_count;
  ELSE
    RAISE NOTICE 'Todos los frame_shape están dentro del enum.';
  END IF;
END $$;

COMMIT;
