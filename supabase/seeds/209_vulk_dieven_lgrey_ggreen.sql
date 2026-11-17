-- ============================================
-- Seed 209: Vulk DIEVEN L.GREY/G.GREEN (4ª variante del producto existente `vulk-dieven`, NO polarizada)
-- Fecha: 2026-11-17
-- ============================================
-- PUBLICACIÓN TRADICIONAL de ML (MLA417128), item SIMPLE (0 variaciones => `variation_code` NULL), verificada por API el 2026-11-17 (la creó el founder, APARTE de las otras 3 del Dieven):
--   116088  L.GREY/G.GREEN  MLA4210180636  $82.112  stock 3  marco gris claro transparente, lente verde degradé con antirreflejo en la cara interna, NO polarizada
-- DATOS DEL FOUNDER (2026-11-17): no polarizada, categoría 3, antirreflejo en la cara interna de la lente, UV400. Medidas del Dieven (55-17-145, alto 48, ancho 142; ya cargadas en el producto).
-- 📸 Fotos del fabricante RECOLOREADAS en la app de Gemini (los colores de la foto de Vulk no corresponden al producto: marco gris medio y lentes gris azulado; el real es marco gris claro translúcido y lente verde oscuro degradé, tomados del Reporter LGREY/DRT-03 y MBLK/G.GREEN como muestra de color). `pnpm fotos:subir --slug vulk-dieven --sufijo -lgrey`.
-- 🔬 El producto web decía "flexible" (G-Flex) y "ultra liviano" en un callout: se sacan (el G-Flex no autoriza "flexible"); y "3 colores"/"polarizados en algunas variantes": se pasa a 4 colores nombrando cuáles 2 son polarizadas. El antirreflejo interno es de 1 de 4 variantes: va sólo en el copy y el alt de esa variante, no en title/H1/meta.
-- 🎯 SEO (seo-strategist): meta_title 'Lentes de Sol Vulk Dieven | 4 Colores, UV400' (mismo patrón de Crimson y Glory Box), sin 'polarizados'; `polarized:false` y model_code sin POL en la variante nueva.
-- ============================================

BEGIN;

UPDATE public.products SET
  short_description = 'Lentes de sol Vulk Dieven: rectangulares unisex de G-Flex en 4 colores. 2 versiones polarizadas y 2 no polarizadas. Lente de policarbonato con 100% protección UV.',
  description = E'Los **Vulk Dieven** son **lentes de sol rectangulares, unisex**, con **frente y patillas de G-Flex** y **bisagras plásticas reforzadas**. La **lente es de policarbonato**, con **100% protección UV (UV400, categoría 3)**.\n\nMedidas: frente 142 mm · lente 55 mm de ancho × 48 mm de alto · puente 17 mm · varilla 145 mm.\n\nDisponible en 4 colores:\n\n• MBLK/S10 — negro mate, lente gris oscuro **polarizada**.\n• SBLK/SG91 — negro brillo, lente gris degradé **polarizada**.\n• ROSE/BROWN-GREEN — rosa pálido translúcido, lente marrón degradé a verde, **no polarizada**.\n• L.GREY/G.GREEN — marco gris claro translúcido, lente verde oscuro degradé con antirreflejo en la cara interna, **no polarizada**.\n\nLas versiones polarizadas (MBLK/S10 y SBLK/SG91) cortan el reflejo del agua, la nieve y el asfalto. Las otras dos no son polarizadas. Incluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante. ¿Lo necesitás con tu graduación? Mirá la versión de receta del Vulk Dieven.',
  meta_title = 'Lentes de Sol Vulk Dieven | 4 Colores, UV400',
  meta_description = 'Lentes de sol Vulk Dieven en 4 colores: negro mate, negro brillo, rosa y gris translúcido. UV400, estuche y franela. Envíos a todo el país.',
  attributes = jsonb_set(jsonb_set(jsonb_set(attributes,
    '{callouts,0,title}', '"Rectangular unisex"'),
    '{callouts,0,body}', '"Diseño rectangular de bordes anchos, unisex. Frente y patillas de G-Flex con bisagras plásticas reforzadas. Lente de policarbonato con 100% protección UV (UV400, categoría 3)."'),
    '{callouts,1,body}', '"MBLK/S10 y SBLK/SG91 son polarizadas: cortan el reflejo del agua, la nieve y el asfalto. ROSE/BROWN-GREEN y L.GREY/G.GREEN no son polarizadas; la L.GREY/G.GREEN suma antirreflejo en la cara interna de la lente."'),
  updated_at = now()
WHERE slug = 'vulk-dieven';

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-dieven'), '116088',
   '{"frame_color":"gris-claro-transparente","lens_color":"verde-oscuro-degrade","model_code":"L.GREY/G.GREEN","polarized":false,"lens_category":3,"lens_treatment":["gradient","antirreflejo-interno"]}'::jsonb,
   8211200, 3, true,
   (SELECT COALESCE(MAX(sort_order),0)+1 FROM public.product_variants WHERE product_id=(SELECT id FROM public.products WHERE slug='vulk-dieven')),
   'MLA4210180636', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-dieven'), (SELECT id FROM public.product_variants WHERE sku='116088'),
   'vulk-dieven/perfil-lgrey.jpg', 'Lentes de sol Vulk Dieven cuadrados, vista lateral, marco gris claro translúcido con lente verde oscuro degradé con antirreflejo interno', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='vulk-dieven'), (SELECT id FROM public.product_variants WHERE sku='116088'),
   'vulk-dieven/frente-lgrey.jpg', 'Lentes de sol Vulk Dieven cuadrados, vista frontal, marco gris claro translúcido con lente verde oscuro degradé con antirreflejo interno', 2000, 1333, 7, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
