-- ============================================
-- Seed 188: Mormaii High 4 (receta) — 3ª variante APE (frente negro brillo, patillas azul oscuro translúcido)
-- Fecha: 2026-10-26
-- ============================================
-- ML: el founder creó la variación en MLA2518277684 (verificada por API 2026-10-26): var_id 208132069829, stock 2, $148.800,
--   color ML "M6111 APE 54 - Frente Negro Brillo - Patillas Azul Oscuro Transparentes" (sin SELLER_SKU en ML; SKU de la casa HIGH4-APE).
-- Mismas medidas que el resto del modelo (54-18-135, alto 42, ancho 140): no se tocan.
-- FOTOS: oficiales de Mormaii (Interoptica Andina, Dropbox) con las patillas recoloreadas a azul oscuro translúcido (producto real
--   según el founder) por agy; subidas con `pnpm fotos:subir --sufijo -ape`. El texto grabado de la patilla se dejó (pedido del founder).
-- Las medidas pasan a sort 99 para quedar siempre al final de la galería.
-- ============================================

BEGIN;

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='mormaii-high-4-receta'), 'HIGH4-APE',
   '{"frame_color":"negro-brillo-patillas-azul-oscuro-translucido","model_code":"M6111 APE 54"}'::jsonb,
   14880000, 2, true, 3, 'MLA2518277684', '208132069829')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='mormaii-high-4-receta'), (SELECT id FROM public.product_variants WHERE sku='HIGH4-APE'),
   'mormaii-high-4-receta/perfil-ape.jpg', 'Armazón de receta Mormaii High 4 rectangular vista lateral, frente negro brillo con patillas azul oscuro translúcido', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-high-4-receta'), (SELECT id FROM public.product_variants WHERE sku='HIGH4-APE'),
   'mormaii-high-4-receta/frente-ape.jpg', 'Armazón de receta Mormaii High 4 rectangular vista frontal, frente negro brillo con patillas azul oscuro translúcido', 2000, 1333, 5, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

UPDATE public.product_images SET sort_order = 99, updated_at = now()
WHERE product_id = (SELECT id FROM public.products WHERE slug='mormaii-high-4-receta') AND storage_path = 'mormaii-high-4-receta/medidas-negro.jpg';

UPDATE public.products
SET description = replace(description, 'Disponible en 2 variantes: Negro y Transparente.', 'Disponible en 3 variantes: Negro, Transparente y Negro brillo con patillas azul oscuro translúcido.'),
    meta_description = replace(meta_description, '2 colores', '3 colores'),
    updated_at = now()
WHERE slug = 'mormaii-high-4-receta';

COMMIT;
