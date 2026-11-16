-- ============================================
-- Seed 195: Rusty Patien Optics 669K-SBLK — foto de perfil CON el logo RUSTY en la patilla (2026-10-30)
-- ============================================
-- La foto del seed 194 (recolor a gris humo con AGY) había perdido el logo de la chapa de la patilla (AGY lo regeneraba ilegible; se dejó lisa). El founder pidió que el logo aparezca ("indispensable"):
-- se repuso con el texto RUSTY y la onda REALES tomados de la foto lateral real (referencia-real/7.png), mezclados por oscuridad sobre la chapa limpia. Nuevo nombre de archivo
-- (`perfil-669k2.jpg`) por la cache de 31 días de la imagen optimizada.
-- ============================================
BEGIN;
UPDATE public.product_images
SET storage_path = 'rusty-patien-receta/perfil-669k2.jpg', updated_at = now()
WHERE product_id = (SELECT id FROM public.products WHERE slug = 'rusty-patien-receta')
  AND storage_path = 'rusty-patien-receta/perfil-669k.jpg';
COMMIT;
