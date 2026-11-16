-- ============================================
-- Seed 197: Rusty Patien Optics 669K-SBLK — grabado REAL de la patilla (RUSTY + logo) tomado de las fotos del founder (2026-10-30)
-- ============================================
-- El founder rechazó el logo anterior ("no es fiel al original") y mandó 5 fotos del grabado real (IMG_0585-0589). El logo de Rusty no es una onda: es una "R" caligráfica con aleta, brazo dentado y punto.
-- Se extrajo la tinta de los PÍXELES de la foto real (RUSTY + logo), se enderezó sobre la chapa del perfil (ángulo −25,4°) y se mezcló sobre la base sin logo; tamaño aprobado por el founder (candidato 3).
-- Nuevo nombre de archivo (`perfil-669k4.jpg`) por la cache de 31 días de la imagen optimizada.
-- ============================================
BEGIN;
UPDATE public.product_images
SET storage_path = 'rusty-patien-receta/perfil-669k4.jpg', updated_at = now()
WHERE product_id = (SELECT id FROM public.products WHERE slug = 'rusty-patien-receta')
  AND storage_path = 'rusty-patien-receta/perfil-669k3.jpg';
COMMIT;
