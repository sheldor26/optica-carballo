-- ============================================
-- Seed 08: badge "Nuevo ingreso" para Vulk Day Light hasta 2026-06-28
-- Fecha: 2026-05-28
-- ============================================
-- Founder pidió reemplazar el badge "Marca local" (basado en
-- brand.is_argentine) por un badge "Nuevo ingreso" verde que se
-- evalúa por producto según `attributes.new_until` (ISO date).
--
-- Convención: cuando se carga un producto nuevo, setear new_until a
-- 1 mes desde la fecha de carga. Cuando esa fecha pase, el badge
-- desaparece automáticamente (evaluación server-side al renderizar).
--
-- Vulk Day Light: cargado el 2026-05-28 → new_until 2026-06-28.
-- ============================================

BEGIN;

UPDATE public.products
SET
  attributes = attributes || '{"new_until": "2026-06-28"}'::jsonb,
  updated_at = now()
WHERE slug = 'vulk-day-light';

COMMIT;
