-- ============================================
-- Migration: brands.includes_image_path + includes_image_alt
-- Fecha: 2026-05-30
-- ============================================
-- Permite a cada marca asociar UNA imagen brand-wide del kit incluido
-- (estuche, franela, stickers, etc.). Se renderiza al final de la
-- galería de PDP de TODOS los productos de esa marca, evitando subir
-- la misma imagen N veces.
--
-- Convención de path: 'brands-shared/<brand-slug>-includes.jpg' (o png/webp).
-- variant_id NULL implícito (es brand-level, no product/variant-level).
--
-- Excepción per-producto: si un producto necesita OCULTAR la imagen brand
-- (caso raro), agregar `attributes.hide_brand_includes_image: true` a
-- ese producto. UI respeta el flag.
-- ============================================

ALTER TABLE public.brands
  ADD COLUMN IF NOT EXISTS includes_image_path text,
  ADD COLUMN IF NOT EXISTS includes_image_alt  text;

COMMENT ON COLUMN public.brands.includes_image_path IS
  'Storage path (bucket products) de la imagen brand-wide del kit incluido (estuche+franela+stickers). NULL = no agregar imagen a galerías de productos de esta marca.';

COMMENT ON COLUMN public.brands.includes_image_alt IS
  'Alt text para a11y/SEO de la imagen brand includes. NULL = se autogenera con "{brand.name} kit incluido: estuche, franela y stickers".';
