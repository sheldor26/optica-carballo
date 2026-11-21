-- ============================================
-- Seed 214: Vulk BOOPING MDEMI/DRT04 POL (5ª variante del producto existente `vulk-booping`, POLARIZADA cat 3)
-- Fecha: 2026-11-21
-- ============================================
-- VARIACIÓN NUEVA del item MULTIVARIANTE de ML (MLA417128) MLA1440036743 (la agregó el founder el 2026-11-21; verificada por API):
--   960802  MDEMI/DRT04 POL  MLA1440036743 / variation 208676703351  $93.955  stock 3  armazón y patillas carey mate, lente verde degradé, POLARIZADA, cat 3
--   (las otras 4 variantes ya están en el mismo item con sus variation_code: 958006, 958004, 958005, 958007)
-- DATOS DEL FOUNDER (2026-11-20/21): variante nueva del Booping, carey mate con lente verde degradé, cat 3, polarizado. Medidas del producto (52-21-143, alto 52) ya cargadas.
-- 📸 Vulk no tiene fotos de esta variante: perfil y frente RECREADOS en Gemini a partir de la foto oficial del Booping negro (mismo ángulo) y las fotos reales del founder; lentes oscurecidas "un poquito" a pedido suyo. `pnpm fotos:subir --slug vulk-booping --sufijo -mdemi --solo perfil,frente`.
-- 🔬 Limpieza del copy viejo (seed 32 / import de ML): 'ultra liviano', 'flexible y liviano', 'elimina los reflejos', 'excelente para conducción', 'la cat 4 NO se puede usar manejando', 'garantía oficial'; sin adjetivos de peso (18,9 g como dato). Se reescriben descripción, short, meta y los 3 callouts.
-- 🎯 SEO (seo-strategist 2026-11-21): meta_title `Lentes de Sol Vulk Booping Polarizados | 5 Colores, UV400` (el viejo tenía ~75 caracteres y 'Redondos', que reclaman Cinema y Bennie 51); "redondo" sólo en copy/meta; 4 links de salida (Cinema, Yester, Bennie 51 y hub); frase de vuelta UNA, en Cinema (que hoy no linkea a nadie); en Cinema también 'garantía oficial' pasa a 'garantía de 1 año contra defectos de fabricación'.
-- ⚠️ `lens_color` = `verde-degrade` (label existente 'Verde degradé') en vez del `verde-oliva-degrade` sugerido por SEO, para no sumar código; `frame_color` = `carey-mate` (existe). `lens_treatment` de producto ya es ['polarized','uv400'] (las 5 polarizan) y `lens_category` 3 ya está a nivel producto.
-- ============================================

BEGIN;

UPDATE public.products SET
  short_description = 'Lentes de sol Vulk Booping: diseño redondo unisex, con frente y patillas de G-Flex y bisagras plásticas. Lente de policarbonato polarizada, con protección UV400 y categoría 3. Las 5 versiones polarizan.',
  description = E'Los **lentes de sol Vulk Booping** son de **diseño redondo y unisex**, con frente y patillas de **G-Flex** y **bisagras plásticas**. Pesan 18,9 gramos.\n\n**Las cinco versiones son polarizadas.** La lente es de policarbonato, con **protección UV400** (bloquea los rayos UVA y UVB) y **categoría 3**, pensada para mucha luz. El polarizado reduce los reflejos del agua, el asfalto y las superficies brillantes. Tené en cuenta una cosa: como toda lente polarizada, las pantallas LCD (celular, GPS, tablero del auto, cajeros) pueden verse oscuras o con patrones de colores según el ángulo. El polarizado y el UV400 son cosas distintas. De día sí; de noche no recomendamos usar anteojos de sol para manejar.\n\nMedidas: frente 143 mm · lente 52 mm · puente 21 mm · varilla 140 mm · alto total 52 mm.\n\nDisponible en 5 versiones:\n\n• BROWN / B15 POL (SKU 958007): armazón marrón transparente con lente marrón.\n• MBLK / DRT-03 POL (SKU 958004): armazón negro mate con lente DRT-03.\n• MBLK / G15 POL (SKU 958005): armazón negro mate con lente G15 (gris verdoso).\n• L.PINK / S10 POL (SKU 958006): armazón rosa pálido con lente negra S10.\n• MDEMI / DRT04 POL (SKU 960802): armazón y patillas carey mate con lente verde degradé.\n\nSi buscás otro redondo unisex, mirá los [Vulk Cinema](/anteojos-de-sol/vulk/vulk-cinema), los [Vulk Yester](/anteojos-de-sol/vulk/vulk-yester) o los [Vulk Bennie 51](/anteojos-de-sol/vulk/vulk-bennie-51). Podés ver [todos los lentes de sol Vulk](/anteojos-de-sol/vulk).\n\nIncluye estuche, franela de microfibra y garantía de 1 año contra defectos de fabricación.',
  meta_title = 'Lentes de Sol Vulk Booping Polarizados | 5 Colores, UV400',
  meta_description = 'Lentes de sol Vulk Booping: diseño redondo unisex, G-Flex, lente polarizada UV400 categoría 3. Las 5 versiones polarizan. Envío a todo el país.',
  attributes = jsonb_set(attributes, '{callouts}', '[
    {"type": "info", "position": "top", "title": "Redondo unisex de G-Flex", "body": "Frente y patillas de G-Flex, con bisagras plásticas. Lente de 52 mm, puente de 21 mm y ancho total de 143 mm."},
    {"type": "tip", "position": "middle", "title": "Las cinco versiones son polarizadas", "body": "Reducen los reflejos del agua, el asfalto y las superficies brillantes, y pueden hacer que se vean oscuras o con patrones de colores algunas pantallas (celular, GPS, tablero). El polarizado y el UV400 son cosas distintas."},
    {"type": "recommendation", "position": "bottom", "title": "UV400 y categoría 3", "body": "La lente bloquea los rayos UVA y UVB, sea cual sea el color. Categoría 3, pensada para mucha luz. De día sí; de noche no recomendamos usar anteojos de sol para manejar."}
  ]'::jsonb),
  updated_at = now()
WHERE slug = 'vulk-booping';

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-booping'), '960802',
   '{"frame_color":"carey-mate","lens_color":"verde-degrade","model_code":"MDEMI / DRT04 POL","polarized":true,"lens_category":3}'::jsonb,
   9395500, 3, true, 5, 'MLA1440036743', '208676703351')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-booping'), (SELECT id FROM public.product_variants WHERE sku='960802'),
   'vulk-booping/perfil-mdemi.jpg', 'Lentes de sol Vulk Booping redondos unisex, vista lateral, armazón carey mate con lente verde degradé polarizada', 2000, 1333, 9, false),
  ((SELECT id FROM public.products WHERE slug='vulk-booping'), (SELECT id FROM public.product_variants WHERE sku='960802'),
   'vulk-booping/frente-mdemi.jpg', 'Lentes de sol Vulk Booping redondos unisex, vista frontal, armazón carey mate con lente verde degradé polarizada', 2000, 1333, 10, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- La imagen de medidas (sin variante) pasa al final.
UPDATE public.product_images SET sort_order = 99, updated_at = now()
WHERE product_id = (SELECT id FROM public.products WHERE slug='vulk-booping') AND storage_path = 'vulk-booping/medidas.jpg';

-- Frase de vuelta: UNA sola, en Cinema (el redondo unisex de Vulk, vecino directo). Y garantía sin 'oficial'.
UPDATE public.products
SET description = replace(description, 'garantía oficial de 1 año del fabricante', 'garantía de 1 año contra defectos de fabricación')
  || CASE WHEN description NOT LIKE '%vulk-booping%' THEN E'\n\nSi preferís lentes más grandes (52 mm contra los 48 mm del Cinema), mirá los [Vulk Booping](/anteojos-de-sol/vulk/vulk-booping).' ELSE '' END,
  updated_at = now()
WHERE slug = 'vulk-cinema';

COMMIT;
