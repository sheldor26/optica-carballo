-- ============================================
-- Seed 114: Mormaii — imagen de kit incluido (estuche) brand-wide
-- Fecha: 2026-09-22
-- ============================================
-- Juan pasó `marketing/estuche-mormaii.jpg` (foto real del estuche semi rígido gris con logo
-- Mormaii, la misma pieza que ya se ve en la galería de su publicación de ML) para que se agregue
-- a la galería de sus productos de receta. Mecanismo ya existente en el repo (usado por Vulk desde
-- 2026-05-30): `brands.includes_image_path` — `buildGalleryImages()` en
-- `components/catalog/product-page.tsx` lo agrega automáticamente al final de la galería de TODOS
-- los productos de esa marca (no hace falta tocar cada producto ni repetir la imagen por variante).
-- Como Mormaii hoy sólo tiene el Moorea (receta), el efecto práctico es exactamente lo que pidió
-- Juan; si en el futuro se carga un Mormaii de sol, se va a ver ahí también — es la misma pieza de
-- marketing (estuche de marca, no de producto), no hay razón para excluir sol.
--
-- Imagen subida a `brands-shared/mormaii-includes.jpg` (720×720, HTTP 200 verificado) — bucket
-- separado del de productos, mismo patrón que `vulk-estuche-franela.jpg`.
-- `includes_image_alt` explícito porque el default de `buildGalleryImages()` menciona "estuche,
-- franela y stickers" y la foto de Juan es SÓLO el estuche — no corresponde prometer stickers que
-- no se confirmaron para esta marca.
-- ============================================

BEGIN;

UPDATE public.brands
SET
  includes_image_path = 'mormaii-includes.jpg',
  includes_image_alt = 'Estuche semi rígido Mormaii, incluido con la compra',
  updated_at = now()
WHERE slug = 'mormaii';

COMMIT;
