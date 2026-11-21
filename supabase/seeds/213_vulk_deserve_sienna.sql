-- ============================================
-- Seed 213: Vulk DESERVE SIENNA/DRLB14 POL (4ª variante del producto existente `vulk-deserve`, POLARIZADA cat 3)
-- Fecha: 2026-11-20
-- ============================================
-- PUBLICACIÓN TRADICIONAL de ML (MLA417128), item SIMPLE (0 variaciones => `variation_code` NULL), verificada por API el 2026-11-20 (la creó el founder; ML generó además un duplicado de CATÁLOGO MLA4223912458 con `catalog_listing:true`, que se IGNORA):
--   112938  SIENNA/DRLB14 POL  MLA4223912450  $94.085  stock 2  armazón marrón brillo translúcido, lente marrón, POLARIZADA, cat 3
-- ⚠️ En ML el SELLER_SKU quedó cargado como "112939" (el de Vulk y el de la base es 112938) y el GTIN vacío ("Otra razón"); avisado al founder. Ojo: ML muestra `LENS_HEIGHT` 5,2 cm; el producto lleva alto total 58 mm (medida del founder, ya cargada y coincide con Vulk 146/58): no se toca.
-- DATOS DEL FOUNDER (2026-11-20): armazón marrón brillo, lentes marrones, cat 3, polarizado. Medidas del producto (59-16-145, alto 58, ancho 146) ya cargadas.
-- 🔬 Se sacan 'flexible'/'liviano' del copy viejo (el G-Flex no autoriza "flexible"; "liviano" prohibido), 'elimina los reflejos' y 'para manejar'; conteos a 4 variantes / 2 polarizadas; garantía como 'contra defectos de fabricación'.
-- 🎯 SEO (seo-strategist 2026-11-20): title '4 Colores' (sin 'cuadrados' ni 'polarizados' ni 'marrón'); links a The Sil, Anima y hub; frase de vuelta UNA, en Anima (el cross-link Anima↔Deserve figuraba como obligatorio y nunca se hizo).
-- ⚠️ Producto MIXTO (2 polarizadas de 4): `lens_treatment` de producto sigue ['uv400']; `lens_category` 3 a nivel producto (las 4 son cat 3: el despiece lo lee de ahí) y en la variante nueva.
-- 📸 `pnpm fotos:subir --slug vulk-deserve --sufijo -sienna --solo perfil,frente` (3/4 y frente oficiales de Vulk, 900 px). Orden 7 y 8; la de medidas pasa a 99. Scale override: perfil 1.15 / frente 1.0 como las otras 3 variantes.
-- ============================================

BEGIN;

UPDATE public.products SET
  short_description = 'Lentes de sol Vulk Deserve unisex: cuadrados grandes de G-Flex, talle large, con lente de policarbonato UV400 categoría 3. Cuatro colores: dos con lente polarizado y dos sin polarizar.',
  description = E'Los Vulk Deserve son anteojos de sol **cuadrados grandes**, de estilo moderno y unisex, pensados para quienes buscan una montura con presencia. El armazón y las patillas son de **G-Flex**, pensado para el uso diario.\n\nLas lentes son de policarbonato base 4 con protección **UV400 categoría 3** (100% UVA/UVB). Dos versiones son **polarizadas** (MBLK/S10 y SIENNA/DRLB14): reducen los reflejos del agua, el asfalto y las superficies brillantes. Como toda lente polarizada, las pantallas LCD (celular, GPS, tablero) pueden verse oscuras o con patrones de colores según el ángulo. La variante **MBLK/G3262 Emerald** suma una capa antirreflejo en la cara interna de la lente para reducir los reflejos que llegan desde atrás.\n\nMedidas: frente 146 mm · lente 59 mm · puente 16 mm · varilla 145 mm · alto total 58 mm.\n\nDisponible en 4 variantes:\n\n• MBLK/S10 POL (SKU 112937): negro mate con lente gris oscuro POLARIZADA.\n• SBLK/G.DARK GREY (SKU 112935): negro brillo con lente gris degradé oscuro.\n• MBLK/G3262 EMERALD (SKU 112930): negro mate con lente emerald (verde espejada) y antirreflejo interno.\n• SIENNA/DRLB14 POL (SKU 112938): marrón brillo translúcido con lente marrón POLARIZADA, categoría 3.\n\nTalle large (montura grande). Si te gustan los cuadrados de Vulk, mirá también los [Vulk The Sil](/anteojos-de-sol/vulk/vulk-the-sil). Para un cuadrado grande pensado para mujer, los [Vulk Anima](/anteojos-de-sol/vulk/vulk-anima). Y podés ver [todos los lentes de sol Vulk](/anteojos-de-sol/vulk).\n\nIncluye estuche original, franela de microfibra y garantía de 1 año contra defectos de fabricación.',
  meta_title = 'Lentes de Sol Vulk Deserve | 4 Colores, UV400',
  meta_description = 'Lentes de sol Vulk Deserve: cuadrados grandes unisex de G-Flex, en 4 colores, 2 polarizados y 2 sin polarizar, UV400, talle large. Envío a todo el país.',
  attributes = jsonb_set(jsonb_set(jsonb_set(
    jsonb_set(attributes || '{"lens_category": 3}'::jsonb,
      '{imported_from,item_ids}',
      (SELECT jsonb_agg(DISTINCT x) FROM jsonb_array_elements_text((attributes->'imported_from'->'item_ids') || '["MLA4223912450"]'::jsonb) x)),
    '{callouts,0,body}', '"Montura cuadrada grande (talle large), armazón y patillas de G-Flex. Si buscás anteojos de buen tamaño y presencia, este es el calce."'::jsonb),
    '{callouts,1,body}', '"Para mucha luz y reflejos, las polarizadas son la MBLK/S10 (negro mate) y la SIENNA/DRLB14 (marrón brillo translúcido con lente marrón). La MBLK/G3262 Emerald es la más llamativa, con lente verde espejada y antirreflejo interno. La SBLK/G.DARK GREY (gris degradé) es la opción más clásica."'::jsonb),
    '{callouts,1,title}', '"¿Cuál elegir?"'::jsonb),
  updated_at = now()
WHERE slug = 'vulk-deserve';

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-deserve'), '112938',
   '{"frame_color":"marron-brillo","lens_color":"marron","model_code":"SIENNA/DRLB14 POL","polarized":true,"lens_category":3}'::jsonb,
   9408500, 2, true, 4, 'MLA4223912450', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-deserve'), (SELECT id FROM public.product_variants WHERE sku='112938'),
   'vulk-deserve/perfil-sienna.jpg', 'Lentes de sol Vulk Deserve cuadrados grandes, vista lateral, armazón marrón brillo translúcido con lente marrón polarizada', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='vulk-deserve'), (SELECT id FROM public.product_variants WHERE sku='112938'),
   'vulk-deserve/frente-sienna.jpg', 'Lentes de sol Vulk Deserve cuadrados grandes, vista frontal, armazón marrón brillo translúcido con lente marrón polarizada', 2000, 1333, 8, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- La imagen de medidas (sin variante) pasa al final.
UPDATE public.product_images SET sort_order = 99, updated_at = now()
WHERE product_id = (SELECT id FROM public.products WHERE slug='vulk-deserve') AND storage_path = 'vulk-deserve/medidas.webp';

-- Frase de vuelta: UNA sola, en Anima (el cuadrado grande de Vulk para mujer, vecino directo).
UPDATE public.products
SET description = description || E'\n\nSi preferís un cuadrado grande unisex, con dos versiones polarizadas, mirá los [Vulk Deserve](/anteojos-de-sol/vulk/vulk-deserve).', updated_at = now()
WHERE slug = 'vulk-anima' AND description NOT LIKE '%vulk-deserve%';

COMMIT;
