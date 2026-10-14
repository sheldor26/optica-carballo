-- ============================================
-- Seed 171: Rusty Yeah SOL, 4ª variante: C6 POL (carey brillo, lente gris degradé, POLARIZADA). SKU 1194375
-- Fecha: 2026-10-14
-- ============================================
-- El founder agregó la variación C06 a la publicación multivariante MLA2819011214 (verificado por API el 2026-10-14):
--   var `207871654213` = "C06 - Gris Degrade / Carey Brillo", precio $133.965, stock 1, 6 fotos. Stock y precio mandan desde ML.
-- SKU 1194375 confirmado por el founder (rustyoptical.com: `c6-pol-sku-1194375`). Marca: frente carey con lente gris degradé polarizado (el color del lente se leyó de la foto y ML lo titula "Gris Degrade").
-- Mismas medidas y ficha que el resto del modelo (56-15-145, ancho 148, alto 49, 32,9 g). Sin GTIN (ML no lo da por variación).
-- 📷 FOTOS: las oficiales de Rusty (perfil + frente, 900×442) subidas con `pnpm fotos:subir --sufijo -c6-pol`, scale 1.12/1.0 como la C1. Placas de ML en `marketing/placas-ml/SUBIR-rusty-yeah-c6/`.
-- TEXTO: pasa de "2 de 3 colores polarizados" a "3 de 4" (short, meta, descripción, callout). Sigue sin "polarizado" en el title/H1.
-- ============================================

BEGIN;

UPDATE public.products SET
  short_description = 'Anteojos de sol Rusty Yeah: aviador de doble puente unisex, acetato bio-based. Lente de policarbonato con 100% protección UV (UV400, categoría 3). 3 de 4 colores con lente polarizada. 32,9 g.',
  meta_description = 'Anteojos de sol Rusty Yeah, aviador doble puente unisex. 3 de 4 colores polarizados, cat. 3 y 100% UV. Envío a todo el país y asesoramiento de técnico óptico.',
  description = replace(replace(description,
    E'Disponible en 3 colores:', E'Disponible en 4 colores:'),
    E'• Carey / lente marrón degradé — no polarizada.',
    E'• Carey / lente marrón degradé — no polarizada.\n• Carey brillo / lente gris degradé — **polarizada**.'),
  attributes = jsonb_set(attributes, '{callouts,2}',
    '{"body": "Negro mate, negro brillo y carey brillo tienen lente polarizada, ideal para manejar y actividades al aire libre. El carey con lente marrón degradé es estándar, sin polarizar.", "type": "recommendation", "title": "3 de 4 colores con lente polarizada", "position": "bottom"}'::jsonb),
  updated_at = now()
WHERE slug = 'rusty-yeah';

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-yeah'), '1194375',
   '{"frame_color":"carey","lens_color":"gris-degrade","polarized":true,"model_code":"C6"}'::jsonb,
   13396500, 1, true, 4, 'MLA2819011214', '207871654213')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-yeah'), (SELECT id FROM public.product_variants WHERE sku='1194375'),
   'rusty-yeah/perfil-c6-pol.jpg', 'Anteojos de sol Rusty Yeah aviador doble puente unisex vista lateral, carey brillo lente polarizada gris degradé', 900, 442, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-yeah'), (SELECT id FROM public.product_variants WHERE sku='1194375'),
   'rusty-yeah/frente-c6-pol.jpg', 'Anteojos de sol Rusty Yeah aviador doble puente unisex vista frontal, carey brillo lente polarizada gris degradé', 900, 442, 7, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
