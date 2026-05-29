-- ============================================
-- Migration: soporte para multi-variation dentro del mismo MLA
-- ============================================
-- Contexto: el schema original asumía 1 variante DB = 1 MLA distinto.
-- Pero ML soporta listings con variations (un MLA con N color/talle/etc).
-- Caso real (2026-05-29): Vulk Day Light tiene 2 variantes (Carey, Rosa)
-- que en ML están dentro del MISMO listing MLA2726903920, diferenciadas
-- por `seller_custom_field` (códigos LPINK/DRT25, SDEMI/DRWG15C3).
--
-- Cambios:
-- 1. DROP UNIQUE (mercadolibre_item_id) — no aplica con multi-variation.
-- 2. ADD columna `mercadolibre_variation_code` (text, nullable) — código
--    interno del seller dentro del listing ML. NULL si el MLA es single-variation.
-- 3. UNIQUE composite (mercadolibre_item_id, mercadolibre_variation_code)
--    — un listing+variation ML puede mapear a solo 1 variante DB.
-- ============================================

BEGIN;

-- 1. DROP old UNIQUE constraint
ALTER TABLE public.product_variants
  DROP CONSTRAINT IF EXISTS product_variants_mercadolibre_item_id_unique;

-- 2. Add variation code column
ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS mercadolibre_variation_code text;

COMMENT ON COLUMN public.product_variants.mercadolibre_variation_code IS
  'Código interno del seller dentro de un listing ML con variations (ej: LPINK/DRT25). NULL si el MLA es single-variation.';

-- 3. UNIQUE composite — un (MLA, variation) → 1 variante DB
-- NULLs DISTINCT (default Postgres) permite múltiples variantes con
-- (mercadolibre_item_id = NULL, mercadolibre_variation_code = NULL) sin chocar.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'product_variants_ml_item_variation_unique'
      AND table_schema = 'public'
      AND table_name = 'product_variants'
  ) THEN
    ALTER TABLE public.product_variants
      ADD CONSTRAINT product_variants_ml_item_variation_unique
      UNIQUE (mercadolibre_item_id, mercadolibre_variation_code)
      DEFERRABLE INITIALLY DEFERRED;
  END IF;
END $$;

COMMIT;
