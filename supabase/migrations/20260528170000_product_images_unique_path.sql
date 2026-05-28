-- ============================================
-- Migration: product_images dedupe + UNIQUE(product_id, storage_path)
-- Fecha: 2026-05-28
-- ============================================
-- Bug detectado: los seeds 03 y 07 usaban `ON CONFLICT DO NOTHING` sin
-- target en INSERT a product_images. PostgreSQL solo detecta conflicto
-- contra constraints existentes (PRIMARY KEY, UNIQUE). Como
-- product_images NO tenía UNIQUE en storage_path, cada re-ejecución del
-- seed insertaba filas DUPLICADAS con nuevos UUIDs (PK auto-generado).
--
-- El founder reportó "Cada vez que elijo una variante se me van sumando
-- fotos debajo de la imagen" — eran las filas duplicadas en DB.
--
-- Fix:
-- 1. DELETE duplicados manteniendo la fila más antigua por
--    (product_id, storage_path).
-- 2. ADD CONSTRAINT UNIQUE(product_id, storage_path) para que futuros
--    ON CONFLICT (product_id, storage_path) DO NOTHING/UPDATE funcionen.
-- ============================================

BEGIN;

-- 1. Dedupe: conservar la fila más antigua por (product_id, storage_path).
--    `created_at ASC, id ASC` garantiza determinismo si hay timestamps
--    idénticos (poco probable pero posible).
DELETE FROM public.product_images
WHERE id IN (
  SELECT id FROM (
    SELECT
      id,
      ROW_NUMBER() OVER (
        PARTITION BY product_id, storage_path
        ORDER BY created_at ASC, id ASC
      ) AS rn
    FROM public.product_images
  ) ranked
  WHERE rn > 1
);

-- 2. Constraint para idempotencia futura.
--    Decisión: UNIQUE por (product_id, storage_path) en vez de solo
--    storage_path porque conceptualmente el storage_path es relativo
--    al producto (en la práctica empieza con su slug), pero técnicamente
--    podría colisionar entre productos distintos. Per-product es lo
--    semánticamente correcto.
ALTER TABLE public.product_images
  ADD CONSTRAINT product_images_unique_storage_path
  UNIQUE (product_id, storage_path);

COMMIT;
