-- ============================================
-- Seed 27: Vulk Day Light — flag polarized=true en las 4 variantes
-- Fecha: 2026-05-31
-- ============================================
-- Founder confirmó 2026-05-31: "el day light es polarizado". Las 4
-- variantes activas (Carey 194185, Rosa 194180, MBLK 194182, BROWN 194187)
-- son polarizadas pero los seeds previos (3, 7, 12) NO incluían el flag
-- explícito en variant.attributes.
--
-- Sin el flag, la función isPolarized() del componente VariantList no
-- renderizaba el badge "POLARIZADO" en la PDP (la function chequea 4
-- fuentes: polarized, is_polarized, lens_treatment, "POL" en model_code
-- — ninguna matcheaba para Day Light).
--
-- Este seed es idempotente — el operador `||` agrega o sobrescribe la key
-- polarized sin tocar otras keys del JSONB.
--
-- Aplicado vía MCP execute_sql el 2026-05-31 con autorización standing
-- del founder. Verificación post-apply: las 4 variantes con
-- polarized='true' en attributes.
-- ============================================

BEGIN;

UPDATE public.product_variants
SET
  attributes = attributes || '{"polarized": true}'::jsonb,
  updated_at = now()
WHERE product_id = (SELECT id FROM public.products WHERE slug = 'vulk-day-light')
  AND is_active = true;

COMMIT;
