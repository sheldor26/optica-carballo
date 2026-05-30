-- ============================================
-- Migration: normalizar attributes.frame_shape a español
-- ============================================
-- Contexto: el sistema tiene un mismatch entre los valores de frame_shape
-- guardados en DB (inglés: aviator, round, square) y los que devuelve el
-- modelo de IA del recomendador (español: aviador, redondo, cuadrado).
--
-- El enum FRAME_SHAPES de lib/face-shape/types.ts es la fuente de verdad
-- desde acá en adelante: TODOS los frame_shape en products.attributes
-- deben estar en español, snake_case, minúsculas.
--
-- Mapeo aplicado:
--   aviator    → aviador
--   round      → redondo
--   square     → cuadrado
--   (wayfarer, rectangular, cat_eye ya están consistentes, NO se tocan)
--   (wraparound NO se mapea — no está en el enum aún, queda como gap
--    documentado para una iteración futura que sume "envolvente" al enum)
-- ============================================

BEGIN;

-- aviator → aviador
UPDATE public.products
SET attributes = jsonb_set(attributes, '{frame_shape}', '"aviador"'::jsonb, false),
    updated_at = now()
WHERE attributes->>'frame_shape' = 'aviator';

-- round → redondo
UPDATE public.products
SET attributes = jsonb_set(attributes, '{frame_shape}', '"redondo"'::jsonb, false),
    updated_at = now()
WHERE attributes->>'frame_shape' = 'round';

-- square → cuadrado
UPDATE public.products
SET attributes = jsonb_set(attributes, '{frame_shape}', '"cuadrado"'::jsonb, false),
    updated_at = now()
WHERE attributes->>'frame_shape' = 'square';

-- Verificación post-migration: log de cuántos productos quedaron con
-- valores fuera del enum esperado. NO falla la migration — solo informa.
DO $$
DECLARE
  off_enum_count integer;
BEGIN
  SELECT count(*) INTO off_enum_count
  FROM public.products
  WHERE attributes ? 'frame_shape'
    AND attributes->>'frame_shape' NOT IN (
      'rectangular','cuadrado','redondo','ovalado','aviador',
      'cat_eye','mariposa','geometrico','wayfarer','clubmaster','sin_marco'
    );

  IF off_enum_count > 0 THEN
    RAISE NOTICE 'Quedan % productos con frame_shape fuera del enum (ej. wraparound).', off_enum_count;
  END IF;
END $$;

COMMIT;
