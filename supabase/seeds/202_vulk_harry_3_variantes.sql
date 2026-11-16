-- ============================================
-- Seed 202: Vulk HARRY (sol, hombre), 3 variantes nuevas sobre el producto existente `vulk-harry` (seed 107)
-- Fecha: 2026-11-16
-- ============================================
-- 3 PUBLICACIONES TRADICIONALES de ML (MLA417128), items SIMPLES (0 variaciones => `variation_code` NULL), verificadas por API el 2026-11-16 (las creó el founder):
--   125323  MBLK/CR51          MLA2279364723  $93.897  stock 1  negro mate, lente celeste, sin antirreflex
--   125333  MDEMI-MBLK/G.GREEN MLA4185175228  $93.897  stock 2  frente carey mate + patillas negro mate, lente verde degradé, sin antirreflex
--   125334  SBLK/118           MLA4204366748  $93.897  stock 2  negro brillo, lente gris degradé, CON antirreflex en la cara interna
--   ⚠️ En ML la G.GREEN quedó con `seller_sku` "00125333" (ceros adelante); acá se usa 125333 (el de Vulk y el del founder). Hay que corregirlo en el panel de ML.
--   Ninguna es polarizada. El MBLK/S10 original (125324, MLA1897028632) no se toca. Existe además un item de catálogo duplicado (MLA2149519020, catalog_listing:true): se ignora.
-- DATOS DEL FOUNDER (2026-11-10 y 2026-11-16): ninguna tiene polarizado; la 125334 tiene antirreflex en la cara interna. Medidas del producto sin cambios (57-14-140, alto 54, ancho 142). Fotos: las del fabricante para CR51 y G.GREEN; la 125334 con el lente corregido en la app de Gemini (las del fabricante lo mostraban marrón y parejo).
-- 📌 2026-11-16 (después de aplicar): el founder aclaró que la SBLK/118 es categoría 2; se corrigió en la base (UPDATE) y acá.
-- 🔬 Sin "liviano" ni "flexible" del armazón; categoría de lente sin afirmar para las nuevas (sólo la del MBLK/S10 original, categoría 3); `model_code` sin "POL" (\bPOL\b la metería en /polarizados).
-- 🎯 catalog-loader: `carey-mate-patillas-negro-mate` y `negro-brillo`/`negro-mate`/`verde-degrade`/`gris-degrade` ya existen; `celeste` se agregó en variant-label.ts. frame_shape queda "aviador" (decisión del seed 107, no se cambia).
-- 📸 `pnpm fotos:subir --slug vulk-harry --sufijo -g-green|-cr51|-sblk118 --solo perfil,frente`; la imagen de medidas existente (vulk-harry/medidas.jpg, sort 99) se conserva.
-- ============================================

BEGIN;

-- Texto del producto: pasa de "un solo color" a 4 versiones.
UPDATE public.products SET
  short_description = 'Lentes de sol Vulk Harry: aviador de doble puente para hombre, con frente y patillas de G-Flex, bisagras metálicas flex y lente de policarbonato UV400. 4 versiones, dos con antirreflex.',
  description = E'Los **Vulk Harry** son **lentes de sol estilo aviador de doble puente, para hombre**, con frente y patillas de **G-Flex** y **bisagras metálicas con sistema flex**.\n\nLas lentes son de **policarbonato** y tienen **100% de protección UV (UV400)**: bloquean los rayos UVA y UVB. **Ninguna versión es polarizada.**\n\nMedidas: frente 142 mm · lente 57 mm de ancho · alto total 54 mm · puente 14 mm · varilla 140 mm.\n\n**El calibre de 57 mm es de los más grandes del catálogo**, así que cubre bien y se apoya ancho sobre la cara. Si usás un anteojo chico y te queda holgado en las sienes, este va para el otro lado.\n\nDisponible en 4 versiones:\n\n• MBLK/S10 (SKU 125324): negro mate con lente gris oscuro, categoría 3 y antirreflex.\n• MBLK/CR51 (SKU 125323): negro mate con lente celeste.\n• MDEMI-MBLK/G.GREEN (SKU 125333): frente carey mate, patillas negro mate y lente verde degradé.\n• SBLK/118 (SKU 125334): negro brillo con lente gris degradé, categoría 2 y antirreflex en la cara interna.\n\nSobre el antirreflex (lo traen la MBLK/S10 y la SBLK/118): en un anteojo de sol el tinte filtra la luz que atraviesa el cristal, pero no la que te llega desde atrás o de costado, rebota en la cara de adentro y te vuelve al ojo. Ese reflejo es el que corta el antirreflex. Lo reduce, no lo elimina, y se nota sobre todo con el sol bajo a tus espaldas.\n\n**No es polarizado.** El polarizado corta el reflejo del asfalto y del agua que tenés adelante, que es otra cosa: si lo que buscás es manejar de día o ir a la playa, fijate en los modelos con el badge POLARIZADO.\n\nEl doble puente es la barra que cruza por arriba entre las dos lentes, acá con ranuras de ventilación. Es el rasgo que le da el aire de aviador clásico.\n\nIncluye estuche, franela de microfibra y garantía de 1 año contra defectos de fabricación.',
  meta_description = 'Lentes de sol Vulk Harry: aviador de doble puente para hombre, de G-Flex, lente de policarbonato UV400 en 4 versiones, dos con antirreflex. Envío a todo el país.',
  attributes = attributes || jsonb_build_object(
    'new_until', '2026-12-16',
    'callouts', '[
      {"type": "info", "position": "top", "title": "Aviador de doble puente para hombre, calibre 57", "body": "Frente y patillas de G-Flex, con bisagras metálicas de sistema flex. El calibre de 57 mm es de los más grandes del catálogo: cubre bien y se apoya ancho sobre la cara. El doble puente lleva ranuras de ventilación."},
      {"type": "warning", "position": "middle", "title": "Antirreflex en dos versiones, ninguna polarizada", "body": "La MBLK/S10 y la SBLK/118 traen antirreflex: corta el reflejo que te vuelve al ojo cuando la luz te pega desde atrás o de costado (lo reduce, no lo elimina). El polarizado es otra cosa: corta el reflejo del asfalto y del agua que tenés adelante, y ninguna versión lo trae. Si lo querés para manejar de día o para la playa, mirá los que tienen el badge POLARIZADO."},
      {"type": "recommendation", "position": "bottom", "title": "Policarbonato UV400", "body": "Lente de policarbonato con 100% de protección UVA y UVB. La MBLK/S10 es categoría 3, pensada para sol fuerte, y esa categoría no sirve para manejar de noche. Si dudás con el talle, escribinos por WhatsApp: con 57 mm de calibre y 142 mm de frente es un anteojo grande."}
    ]'::jsonb
  ),
  updated_at = now()
WHERE slug = 'vulk-harry';

-- 3 variantes, items simples de ML (variation_code NULL). Precio y stock de ML (2026-11-16).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-harry'), '125323',
   '{"frame_color":"negro-mate","lens_color":"celeste","model_code":"MBLK/CR51","polarized":false}'::jsonb,
   9389700, 1, true,
   (SELECT COALESCE(MAX(sort_order),0)+1 FROM public.product_variants WHERE product_id=(SELECT id FROM public.products WHERE slug='vulk-harry')),
   'MLA2279364723', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-harry'), '125333',
   '{"frame_color":"carey-mate-patillas-negro-mate","lens_color":"verde-degrade","model_code":"MDEMI-MBLK/G.GREEN","polarized":false,"lens_treatment":["gradient"]}'::jsonb,
   9389700, 2, true,
   (SELECT COALESCE(MAX(sort_order),0)+2 FROM public.product_variants WHERE product_id=(SELECT id FROM public.products WHERE slug='vulk-harry')),
   'MLA4185175228', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-harry'), '125334',
   '{"frame_color":"negro-brillo","lens_color":"gris-degrade","model_code":"SBLK/118","polarized":false,"lens_category":2,"lens_treatment":["gradient","antirreflejo"]}'::jsonb,
   9389700, 2, true,
   (SELECT COALESCE(MAX(sort_order),0)+3 FROM public.product_variants WHERE product_id=(SELECT id FROM public.products WHERE slug='vulk-harry')),
   'MLA4204366748', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Fotos: cada variante con su par perfil+frente (la primaria sigue siendo el perfil del MBLK/S10); medidas sigue última (sort 99).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-harry'), (SELECT id FROM public.product_variants WHERE sku='125323'),
   'vulk-harry/perfil-cr51.jpg', 'Lentes de sol Vulk Harry aviador de doble puente, vista lateral, armazón negro mate con lente celeste', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-harry'), (SELECT id FROM public.product_variants WHERE sku='125323'),
   'vulk-harry/frente-cr51.jpg', 'Lentes de sol Vulk Harry aviador de doble puente, vista frontal, armazón negro mate con lente celeste', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-harry'), (SELECT id FROM public.product_variants WHERE sku='125333'),
   'vulk-harry/perfil-g-green.jpg', 'Lentes de sol Vulk Harry aviador de doble puente, vista lateral, frente carey mate con patillas negro mate y lente verde degradé', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-harry'), (SELECT id FROM public.product_variants WHERE sku='125333'),
   'vulk-harry/frente-g-green.jpg', 'Lentes de sol Vulk Harry aviador de doble puente, vista frontal, frente carey mate con patillas negro mate y lente verde degradé', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-harry'), (SELECT id FROM public.product_variants WHERE sku='125334'),
   'vulk-harry/perfil-sblk118.jpg', 'Lentes de sol Vulk Harry aviador de doble puente, vista lateral, armazón negro brillo con lente gris degradé', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='vulk-harry'), (SELECT id FROM public.product_variants WHERE sku='125334'),
   'vulk-harry/frente-sblk118.jpg', 'Lentes de sol Vulk Harry aviador de doble puente, vista frontal, armazón negro brillo con lente gris degradé', 2000, 1333, 7, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
