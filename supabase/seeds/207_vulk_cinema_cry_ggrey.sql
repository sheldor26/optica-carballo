-- ============================================
-- Seed 207: Vulk CINEMA CRY/G.GREY POL (4ª variante del producto existente `vulk-cinema`, polarizada)
-- Fecha: 2026-11-17
-- ============================================
-- PUBLICACIÓN TRADICIONAL de ML (MLA417128), item SIMPLE (0 variaciones => `variation_code` NULL), verificada por API el 2026-11-17 (la creó el founder, APARTE de la multi-variación MLA1695892216 que reúne las otras 3):
--   956951  CRY/G.GREY POL  MLA4210088546  $101.012  stock 3  marco y varillas transparentes, lente gris degradé, POLARIZADA
-- DATOS: medidas del Cinema (48-22-135, alto 50, ancho 140; las del founder, confirmadas por el catálogo oficial). Producto ya descontinuado por el fabricante: las fotos son las del fabricante (MC Óptica) editadas con la app de Gemini porque la unidad del founder tiene la patilla lisa (sin coronita) y VULK grabado en el bloque metálico de la bisagra; el sello "Vulk P" de la lente va en la lente del ojo derecho (se borró de la lente cercana en el perfil) y el marco de la foto frontal se aclaró a pedido del founder.
-- 🔬 Sin "liviano"/"flexible". La frase "sistema de bisagras flexo" del producto sigue siendo la del catálogo oficial; está pendiente que el founder confirme que su unidad la tiene (DATOS_PENDIENTES.md).
-- 📸 `pnpm fotos:subir --slug vulk-cinema --sufijo -cry`.
-- ============================================

BEGIN;

UPDATE public.products SET
  short_description = 'Anteojos de sol Vulk Cinema: redondos unisex de G-Flex, con sistema de bisagras flexo. Lente de policarbonato polarizada, con 100% protección UV (UV400, categoría 3). Los cuatro colores polarizan.',
  description = replace(replace(replace(description,
    '**Los tres colores son polarizados.**', '**Los cuatro colores son polarizados.**'),
    'Disponible en 3 colores:', 'Disponible en 4 colores:'),
    E'• **Rosa claro translúcido, lente gris degradé.**', E'• **Rosa claro translúcido, lente gris degradé.**\n• **Transparente cristal, lente gris degradé.**'),
  meta_description = 'Anteojos de sol Vulk Cinema: redondos unisex de G-Flex, lente de policarbonato polarizada UV400 categoría 3. Los cuatro colores polarizan. Envío a todo el país.',
  attributes = jsonb_set(
    jsonb_set(attributes, '{callouts,1,title}', '"Los cuatro colores son polarizados"'),
    '{callouts,1,body}', '"A diferencia de otros modelos donde el filtro polarizado está sólo en algunas variantes, acá lo llevan los cuatro. Corta los reflejos del asfalto, del agua y de la nieve. Aparte, la lente bloquea el 100% de la radiación UV."'),
  updated_at = now()
WHERE slug = 'vulk-cinema';

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-cinema'), '956951',
   '{"frame_color":"transparente","temple_color":"transparente","lens_color":"gris-degrade","model_code":"CRY/G.GREY POL","polarized":true}'::jsonb,
   10101200, 3, true,
   (SELECT COALESCE(MAX(sort_order),0)+1 FROM public.product_variants WHERE product_id=(SELECT id FROM public.products WHERE slug='vulk-cinema')),
   'MLA4210088546', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-cinema'), (SELECT id FROM public.product_variants WHERE sku='956951'),
   'vulk-cinema/perfil-cry.jpg', 'Anteojos de sol Vulk Cinema redondos, vista lateral, armazón transparente con lente gris degradé polarizada', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='vulk-cinema'), (SELECT id FROM public.product_variants WHERE sku='956951'),
   'vulk-cinema/frente-cry.jpg', 'Anteojos de sol Vulk Cinema redondos, vista frontal, armazón transparente con lente gris degradé polarizada', 2000, 1333, 7, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
