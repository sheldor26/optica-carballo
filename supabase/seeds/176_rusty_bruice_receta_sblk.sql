-- ============================================
-- Seed 176: Rusty Bruice RECETA, 3ª variante SBLK Optics (SKU 957002, negro brillo)
-- Fecha: 2026-10-14
-- ============================================
-- El founder agregó la variación a la publicación multivariante `MLA1476793113` (19 vendidas, título congelado), verificada por API el 2026-10-14:
--   SBLK Optics  SKU 957002  var `207900290695`  $84.932 → 8493200c  stock 2  negro brillo
-- Las otras dos (MBLK 957000 var 187532074917, CRY 957001 var 186939241003) no cambian. Propiedades iguales a las del resto del modelo (146/56x54/18/140, 23 g).
-- Fotos oficiales de Rusty pasadas por `pnpm placas --tipo receta` (perfil y frente, 2000×1333) subidas con `--sufijo -sblk`; scale 1.05 como las demás del Bruice.
-- TEXTO: "Disponible en 2 colores" pasa a 3 y se suma "Negro brillo". El resto del texto del producto NO se toca.
-- ============================================

BEGIN;

UPDATE public.products SET
  description = replace(replace(description,
    E'Disponible en 2 colores:', E'Disponible en 3 colores:'),
    E'• **Transparente cristal.**', E'• **Transparente cristal.**\n• **Negro brillo.**'),
  updated_at = now()
WHERE slug = 'rusty-bruice-receta' AND description NOT LIKE '%Negro brillo%';

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-bruice-receta'), '957002',
   '{"frame_color":"negro-brillo","model_code":"SBLK"}'::jsonb,
   8493200, 2, true, 3, 'MLA1476793113', '207900290695')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-bruice-receta'), (SELECT id FROM public.product_variants WHERE sku='957002'),
   'rusty-bruice-receta/perfil-sblk.jpg', 'Armazón de receta Rusty Bruice aviador doble puente unisex vista lateral, negro brillo con lentes de demostración', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bruice-receta'), (SELECT id FROM public.product_variants WHERE sku='957002'),
   'rusty-bruice-receta/frente-sblk.jpg', 'Armazón de receta Rusty Bruice aviador doble puente unisex vista frontal, negro brillo con lentes de demostración', 2000, 1333, 5, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
