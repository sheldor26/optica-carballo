-- ============================================================================
-- Migración 00007 — Agregar brand_name snapshot a order_items
-- Fecha: 2026-05-28
-- ============================================================================
-- El schema 00002 (identity_and_orders) ya tiene `product_name`, `product_slug`,
-- `variant_sku`, `variant_attributes` como snapshots inmutables (ADR-007),
-- pero NO incluye `brand_name`. Resultado: los emails admin/cliente no
-- pueden mostrar la marca sin hacer un JOIN contra products → brands —
-- que puede romper si esos rows se borran o renombran en el futuro
-- (lo que justamente queremos evitar con snapshots).
--
-- Esta migración:
--   1. ALTER TABLE: agrega `brand_name text` nullable (no hay datos
--      legacy en cloud todavía — todos los placeholders son [PH] —
--      pero aceptamos nullable por seguridad operativa).
--   2. Backfill: para órdenes existentes (si las hubiera), pueblo
--      brand_name desde products → brands. Solo afecta data legacy.
-- ============================================================================

BEGIN;

ALTER TABLE public.order_items
  ADD COLUMN brand_name text;

-- Backfill: si hay order_items con product_id válido, completar brand_name
-- desde el catálogo actual. Best-effort — si el producto se borró,
-- brand_name queda null.
UPDATE public.order_items oi
SET brand_name = b.name
FROM public.products p
JOIN public.brands b ON b.id = p.brand_id
WHERE oi.product_id = p.id
  AND oi.brand_name IS NULL;

COMMIT;
