-- ============================================
-- Seed 196: Rusty Patien Optics 669K-SBLK — logo RUSTY NÍTIDO en la patilla (2026-10-30)
-- ============================================
-- El founder dijo que el logo del seed 195 (recorte de 20 px de la foto real) "sale mal". Se le pidió a AGY grabar el logo sobre la chapa lisa tomando la chapa real como referencia:
-- AGY recompuso la chapa (otra perspectiva) pero el grabado salió nítido y fiel (RUSTY + onda); se tomó SÓLO ese grabado como máscara de oscuridad y se mezcló sobre la chapa del perfil
-- con la geometría original. Nuevo nombre por la cache de 31 días: `perfil-669k3.jpg`.
-- ============================================
BEGIN;
UPDATE public.product_images
SET storage_path = 'rusty-patien-receta/perfil-669k3.jpg', updated_at = now()
WHERE product_id = (SELECT id FROM public.products WHERE slug = 'rusty-patien-receta')
  AND storage_path = 'rusty-patien-receta/perfil-669k2.jpg';
COMMIT;
