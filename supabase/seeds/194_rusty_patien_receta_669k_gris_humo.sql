-- ============================================
-- Seed 194: Rusty Patien Optics 669K-SBLK (SKU 126096) — fotos con el frente en GRIS HUMO translúcido (2026-10-30)
-- ============================================
-- Las fotos oficiales de Rusty (900×442) mostraban el frente transparente cristal incoloro; el producto real es gris humo transparente (fotos reales del founder).
-- Recoloreadas con AGY (frente a gris humo, chapa de la patilla sin el texto que la IA regeneró mal), reescaladas 2× y pasadas por `pnpm placas --tipo receta`; subidas con nombre nuevo
-- (`perfil-669k.jpg` / `frente-669k.jpg`, 2000×1333) porque la imagen optimizada de Next se cachea 31 días por path. Mismo sort/primaria que las anteriores.
-- ============================================
BEGIN;

UPDATE public.product_images
SET storage_path = 'rusty-patien-receta/perfil-669k.jpg',
    alt_text = 'Anteojos de receta Rusty Patien wayfarer unisex vista lateral, frente gris humo translúcido con patillas negras',
    width = 2000, height = 1333, updated_at = now()
WHERE product_id = (SELECT id FROM public.products WHERE slug = 'rusty-patien-receta')
  AND storage_path = 'rusty-patien-receta/PATIEN_669K-SBLK_P_GALERIA.jpg';

UPDATE public.product_images
SET storage_path = 'rusty-patien-receta/frente-669k.jpg',
    alt_text = 'Anteojos de receta Rusty Patien wayfarer unisex vista frontal, frente gris humo translúcido con patillas negras',
    width = 2000, height = 1333, updated_at = now()
WHERE product_id = (SELECT id FROM public.products WHERE slug = 'rusty-patien-receta')
  AND storage_path = 'rusty-patien-receta/PATIEN_669K-SBLK_F_GALERIA.jpg';

UPDATE public.products
SET description = replace(description, '669K-SBLK, translúcido con patillas negras.', '669K-SBLK, frente gris humo translúcido con patillas negras.'),
    updated_at = now()
WHERE slug = 'rusty-patien-receta';

COMMIT;
