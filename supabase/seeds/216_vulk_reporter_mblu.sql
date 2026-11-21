-- ============================================
-- Seed 216: Vulk REPORTER MBLU/DRT25 POL (4ª variante del producto existente `vulk-reporter`, POLARIZADA cat 3)
-- Fecha: 2026-11-21
-- ============================================
-- VARIACIÓN NUEVA del item MULTIVARIANTE de ML MLA1866713114 (la agregó el founder el 2026-11-21; verificada por API):
--   194162  MBLU/DRT25 POL  MLA1866713114 / variation 208655229341  $95.097  stock 2  armazón azul marino mate, lente gris degradé, POLARIZADA, cat 3
--   user_product_id MLAU5946791343. Las otras variaciones del item: 183985833841 (194164), 191901138681 (129260, stock 0) y 183985833839 (verde degradé, sin SKU acá).
-- DATOS DEL FOUNDER (2026-11-21): armazón azul oscuro, lente gris degradé, cat 3, polarizado. Medidas del producto (55-11-138, alto 48, ancho 142) ya cargadas. Vulk publica el SKU 129261; se carga el del founder, 194162.
-- 📸 Vulk tiene fotos de esta variante, pero el marco salía azul eléctrico y la lente clara: marco azul marino y lente oscura retocados (Gemini + código), con el sello 'Vulk P' original, y la patilla del fondo lisa (sin grabados). `pnpm fotos:subir --slug vulk-reporter --sufijo -mblu --solo perfil,frente`.
-- 🔬 Limpieza del copy viejo (seed 43 / import de ML): 'livianos y flexibles', 'muy liviano y flexible', 'apto para lentes recetados' (se reescribe como 'admite lentes con graduación': el founder confirmó 2026-11-21 que se puede graduar; `prescription_adapter` queda true), 'eliminan reflejos', 'para manejar', 'garantía oficial', 'estuche original'. Se reescriben descripción, short, meta y los callouts 0 y 1.
-- 🎯 SEO (seo-strategist 2026-11-21): meta_title 'Lentes de Sol Vulk Reporter | 4 Colores, UV400' (sin 'cuadrados' ni 'polarizados' ni 'negro', que son de The Sil y The Guardian); 'azul' sólo en alt y copy de la variante (1 de 4); 3 links de salida (Deserve, The Sil, The Guardian) más el hub; frase de vuelta UNA, en The Sil.
-- ⚠️ Producto MIXTO (3 polarizadas de 4: la MBLK/G.GREEN no polariza): `lens_treatment` de producto sigue ['uv400']; `lens_category` 3 a nivel producto (el despiece lo lee de ahí) y en la variante nueva. `frame_color` = `azul-oscuro-mate` y `lens_color` = `gris-degrade` (los dos labels ya existen).
-- ⚠️ No se carga `weight_grams`: Vulk publica 24,7 g pero el peso lo pasa el founder con balanza (DATOS_PENDIENTES).
-- ============================================

BEGIN;

UPDATE public.products SET
  short_description = 'Lentes de sol Vulk Reporter unisex: cuadrados de G-Flex con lente de policarbonato UV400 categoría 3, que también admiten lentes con graduación. Cuatro colores: tres con lente polarizado y uno sin polarizar.',
  description = E'Los Vulk Reporter son anteojos de sol de formato **cuadrado amplio**, modernos y unisex, pensados para el uso diario. El armazón y las patillas son de **G-Flex** inyectado, con bisagras plásticas integradas. El armazón admite lentes con graduación.\n\nLas lentes son de policarbonato con protección **UV400 categoría 3** (100% UVA/UVB). Tres versiones son **polarizadas** (MBLK/S10, LGREY/DRT03 y MBLU/DRT25): reducen los reflejos del agua, el asfalto y las superficies brillantes. Como toda lente polarizada, las pantallas LCD (celular, GPS, tablero) pueden verse oscuras o con patrones de colores según el ángulo. La MBLK/G.GREEN, con lente verde degradé, no es polarizada.\n\nMedidas: frente 142 mm · lente 55 mm · puente 11 mm · varilla 138 mm · alto total 48 mm.\n\nDisponible en 4 variantes:\n\n• MBLK/G.GREEN (SKU 194165): negro mate con lente verde degradé.\n• MBLK/S10 POL (SKU 194164): negro mate con lente gris oscuro POLARIZADA.\n• LGREY/DRT03 POL (SKU 129260): gris claro con lente degradé POLARIZADA.\n• MBLU/DRT25 POL (SKU 194162): armazón azul marino mate con lente gris degradé POLARIZADA, categoría 3.\n\nSi buscás un cuadrado de Vulk con más cuerpo, mirá los [Vulk Deserve](/anteojos-de-sol/vulk/vulk-deserve), de talle large. Para otro cuadrado unisex con lente polarizado, los [Vulk The Sil](/anteojos-de-sol/vulk/vulk-the-sil), y si preferís uno todo negro de G-Flex, los [Vulk The Guardian](/anteojos-de-sol/vulk/vulk-the-guardian). Y podés ver [todos los lentes de sol Vulk](/anteojos-de-sol/vulk).\n\nIncluye estuche, franela de microfibra y garantía de 1 año contra defectos de fabricación.',
  meta_title = 'Lentes de Sol Vulk Reporter | 4 Colores, UV400',
  meta_description = 'Lentes de sol Vulk Reporter: cuadrados unisex de G-Flex en 4 colores, 3 polarizados y 1 sin polarizar, UV400 categoría 3. Envío a todo el país.',
  attributes = jsonb_set(jsonb_set(jsonb_set(
    attributes || '{"lens_category": 3}'::jsonb,
    '{callouts,0,title}', '"Cuadrado amplio de G-Flex"'::jsonb),
    '{callouts,0,body}', '"Montura cuadrada de buen tamaño, con armazón y patillas de G-Flex inyectado. Se usa de sol todos los días y admite lentes con graduación."'::jsonb),
    '{callouts,1,body}', '"Para mucha luz y reflejos, las polarizadas son la MBLK/S10 (negro mate), la LGREY/DRT03 (gris claro) y la MBLU/DRT25 (azul marino mate). La MBLK/G.GREEN, con lente verde degradé, no es polarizada: es la elección de estilo."'::jsonb),
  updated_at = now()
WHERE slug = 'vulk-reporter';

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-reporter'), '194162',
   '{"frame_color":"azul-oscuro-mate","lens_color":"gris-degrade","model_code":"MBLU/DRT25 POL","polarized":true,"lens_category":3}'::jsonb,
   9509700, 2, true, 4, 'MLA1866713114', '208655229341')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-reporter'), (SELECT id FROM public.product_variants WHERE sku='194162'),
   'vulk-reporter/perfil-mblu.jpg', 'Lentes de sol Vulk Reporter cuadrados, vista lateral, armazón azul marino mate con lente gris degradé polarizada', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='vulk-reporter'), (SELECT id FROM public.product_variants WHERE sku='194162'),
   'vulk-reporter/frente-mblu.jpg', 'Lentes de sol Vulk Reporter cuadrados, vista frontal, armazón azul marino mate con lente gris degradé polarizada', 2000, 1333, 8, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- La imagen de medidas (sin variante) pasa al final.
UPDATE public.product_images SET sort_order = 99, updated_at = now()
WHERE product_id = (SELECT id FROM public.products WHERE slug='vulk-reporter') AND storage_path = 'vulk-reporter/medidas.webp';

-- La LGREY/DRT03 (129260): el founder confirmó 2026-11-21 que la lente es gris degradé (antes 'degrade', sin label).
UPDATE public.product_variants SET
  attributes = jsonb_set(attributes, '{lens_color}', '"gris-degrade"'::jsonb), updated_at = now()
WHERE sku = '129260';

-- Frase de vuelta: UNA sola, en The Sil (el cuadrado unisex fuerte de Vulk).
UPDATE public.products
SET description = description || E'\n\nSi buscás un cuadrado de G-Flex en negro, gris o azul marino mate, con tres versiones polarizadas, mirá los [Vulk Reporter](/anteojos-de-sol/vulk/vulk-reporter).', updated_at = now()
WHERE slug = 'vulk-the-sil' AND description NOT LIKE '%vulk-reporter%';

COMMIT;
