-- ============================================
-- Seed 19: Cambiar frame_shape de Vulk Yamain de oval → cat_eye
-- Fecha: 2026-05-30
-- ============================================
-- Founder decisión: en mi web Yamain es Cat Eye (no ovalado como ML).
-- Aplica a TODAS las variantes (es propiedad product-level, no variant).
--
-- Cambio SOLO en DB local — NO sincronizar a ML (mantener compat con
-- listing ML que sigue catalogado como "Ovalado").
--
-- Impacto:
--   - Filtros del catálogo: aparece bajo cat-eye en lugar de oval
--   - Comparador / ficha técnica: muestra "Cat eye"
--   - Recomendador IA: matchea cat-eye en lugar de oval
-- ============================================

UPDATE public.products
SET
  attributes = jsonb_set(attributes, '{frame_shape}', '"cat_eye"'::jsonb),
  updated_at = now()
WHERE slug = 'vulk-yamain';

-- Verificación:
-- SELECT slug, attributes->>'frame_shape' FROM products WHERE slug='vulk-yamain';
-- Esperado: cat_eye
