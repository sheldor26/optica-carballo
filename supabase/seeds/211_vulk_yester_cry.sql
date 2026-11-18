-- ============================================
-- Seed 211: Vulk YESTER CRY LT BRN/T16 (4ª variante del producto existente `vulk-yester`, NO polarizada, cat 2)
-- Fecha: 2026-11-18
-- ============================================
-- PUBLICACIÓN TRADICIONAL de ML (MLA417128), item SIMPLE (0 variaciones => `variation_code` NULL), verificada por API el 2026-11-18 (la creó el founder, APARTE de las 3 polarizadas del seed 210):
--   969777  CRY LT BRN/T16  MLA2300374329  $90.437  stock 3  armazón marrón claro cristal translúcido, lente marrón degradé con antirreflejo en la cara interna, NO polarizada, cat 2
-- ⚠️ En ML el SELLER_SKU quedó cargado como "9697777" (un 7 de más) y el GTIN vacío ("Otra razón"): en la base el SKU es 969777 (el de Vulk). Avisado al founder.
-- 🎯 SEO (seo-strategist): meta_title '4 Colores' (sólo cambia el número); meta_description nombra qué colores polarizan; el producto pasa a "mixto": se saca `lens_category` y 'polarized' de lens_treatment del NIVEL PRODUCTO y se pone `lens_category` POR VARIANTE (3 en las 3 polarizadas, 2 en la CRY), como Dieven.
-- 📸 `pnpm fotos:subir --slug vulk-yester --sufijo -cry --solo perfil,frente`. Perfil con la corona dorada real (v10 de Gemini, patilla cercana lisa); frente recoloreado en Gemini desde la foto de Vulk con la foto real como muestra de color.
-- 🔬 Sin "liviano"/"flexible"/"ultra". Peso 20 g de la ficha de Vulk (pendiente de balanza).
-- ============================================

BEGIN;

UPDATE public.products SET
  short_description = 'Lentes de sol redondos unisex con frente de poliamida TR90 y bisagra plástica reforzada. Lente de policarbonato con protección UV400, polarizada en negro brillo, negro mate y carey mate; el marrón cristal es degradé, sin polarizar, categoría 2. Incluye estuche y franela.',
  description = E'Los **lentes de sol Vulk Yester** son **redondos**, de diseño **unisex**, con **frente y patillas de poliamida TR90** y **bisagras plásticas reforzadas**. Pesan 20 gramos.\n\n**Tres de las cuatro versiones son polarizadas** (negro brillo, negro mate y carey mate): la lente es de policarbonato, con **protección UV400** (bloquea los rayos UVA y UVB) y **categoría 3**. El polarizado reduce los reflejos del agua, el asfalto y las superficies brillantes. Tené en cuenta una cosa: como toda lente polarizada, las pantallas LCD (celular, GPS, tablero del auto, cajeros) pueden verse oscuras o con patrones de colores según el ángulo. **La cuarta, marrón claro cristal, no es polarizada**: tiene lente marrón degradé con **antirreflejo en la cara interna**, UV400 y **categoría 2**. De día sí; de noche no recomendamos usar anteojos de sol para manejar.\n\nMedidas: frente 143 mm · lente 53 mm · puente 19 mm · varilla 140 mm · alto total 52 mm.\n\nDisponible en 4 versiones:\n\n• SBLK/S10 POL (SKU 969772): frente negro brillo, lente gris oscuro, polarizada.\n• MBLK/S10 POL (SKU 969771): frente negro mate, lente gris oscuro, polarizada.\n• MDEMI/B10 POL (SKU 969773): frente carey mate, lente marrón, polarizada. El carey mate es exclusivo del Yester.\n• CRY LT BRN/T16 (SKU 969777): frente marrón claro cristal translúcido, lente marrón degradé con antirreflejo interno, categoría 2, sin polarizar.\n\nSi buscás otro redondo unisex y polarizado de [Vulk](/anteojos-de-sol/vulk), mirá los [Vulk Cinema](/anteojos-de-sol/vulk/vulk-cinema), con frente de G-Flex y lente más chica (48 mm). Para un redondo más chico de la marca, están los [Vulk Bennie 51](/anteojos-de-sol/vulk/vulk-bennie-51). Y si preferís un redondo de otra marca, los [Rusty Zion](/anteojos-de-sol/rusty/rusty-zion).\n\nIncluye estuche, franela de microfibra y garantía de 1 año contra defectos de fabricación.',
  meta_title = 'Lentes de Sol Vulk Yester | 4 Colores, UV400',
  meta_description = 'Lentes de sol Vulk Yester redondos unisex, UV400: 3 colores polarizados (cat. 3) y 1 marrón cristal sin polarizar (cat. 2). Envío a todo el país.',
  attributes = jsonb_set(jsonb_set(
    (attributes - 'lens_category') || '{"lens_treatment": ["uv400"]}'::jsonb,
    '{callouts,1}', '{"type": "tip", "position": "middle", "title": "Tres versiones polarizadas y una sin polarizar", "body": "El negro brillo, el negro mate y el carey mate son polarizados: reducen los reflejos del agua, el asfalto y las superficies brillantes, y pueden hacer que se vean oscuras o con patrones de colores algunas pantallas (celular, GPS, tablero). El marrón cristal tiene lente degradé con antirreflejo en la cara interna y no es polarizado. Todos bloquean el 100% de la radiación UV (UV400)."}'::jsonb),
    '{callouts,2}', '{"type": "recommendation", "position": "bottom", "title": "Categoría 3 en las polarizadas, categoría 2 en el marrón", "body": "Las polarizadas son categoría 3, pensadas para mucha luz; el marrón cristal es categoría 2, un filtro medio. De día sí; de noche no recomendamos usar anteojos de sol para manejar."}'::jsonb),
  updated_at = now()
WHERE slug = 'vulk-yester';

-- Las 3 polarizadas: categoría 3 pasa a nivel variante
UPDATE public.product_variants
SET attributes = attributes || '{"lens_category": 3}'::jsonb, updated_at = now()
WHERE sku IN ('969772', '969773', '969771');

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-yester'), '969777',
   '{"frame_color":"marron-claro-transparente","lens_color":"marron-degrade","model_code":"CRY LT BRN/T16","polarized":false,"lens_category":2,"lens_treatment":["gradient","antirreflejo-interno"]}'::jsonb,
   9043700, 3, true, 4, 'MLA2300374329', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-yester'), (SELECT id FROM public.product_variants WHERE sku='969777'),
   'vulk-yester/perfil-cry.jpg', 'Lentes de sol Vulk Yester redondos unisex, vista lateral, frente marrón claro cristal y lente marrón degradé con antirreflejo interno', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='vulk-yester'), (SELECT id FROM public.product_variants WHERE sku='969777'),
   'vulk-yester/frente-cry.jpg', 'Lentes de sol Vulk Yester redondos unisex, vista frontal, frente marrón claro cristal con lente marrón degradé con antirreflejo interno', 2000, 1333, 7, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
