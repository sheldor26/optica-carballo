-- ============================================
-- Seed 173: Rusty PRO 30 RECETA, 3 variantes nuevas (CRY 126410, SBLK 968087, MDEMI 126413)
-- Fecha: 2026-10-14
-- ============================================
-- Agrega al `rusty-pro-30-receta` (seed 90, hoy LIGHT GREY SKU 126411 `MLA1939580597`) las 3 versiones "OPTICAL Blue Cut" que le llegaron al founder, con las mismas medidas (56-19-140, alto 48, ancho 149, 22,9 g).
-- 3 PUBLICACIONES TRADICIONALES de ML (items simples, `variation_code` NULL, `catalog_listing:false`, categoría MLA417127), ACTIVAS, publicadas por el founder el 2026-10-14 y verificadas por API (las gemelas de catálogo MLA4075778030, MLA2191792139 y MLA4075799928 se ignoran):
--   CRY   SKU 126410  MLA2191803551 (MLAU5489380423)  $96.633 → 9663300c  stock 2  cristal transparente / terminales negros
--   SBLK  SKU 968087  MLA2191803553 (MLAU5489382375)  $96.633 → 9663300c  stock 2  negro brillo / terminales verdes
--   MDEMI SKU 126413  MLA2191803555 (MLAU5489380421)  $96.633 → 9663300c  stock 2  carey mate / terminales verdes
--   Sin GTIN (ML no lo da). La LIGHT GREY (126411) queda como está.
-- ⚠️ Los SKU 126410/126413 del founder no figuran en rustyoptical.com, que usa 968083 (CRY OPTICAL) y 968081 (MDEMI OPTICAL) para esos colores: las fotos son del mismo color de la web de Rusty.
-- ⚠️ CRITERIO DEL PROYECTO (seed 90): el SITIO no menciona bluecut/filtro de luz azul (sí ML). `model_code` = "CRY OPTICAL" / "SBLK OPTICAL" / "MDEMI OPTICAL" (sin "Blue Cut", mismo patrón que "LIGHT GREY OPTICAL").
-- RECETA: sin lens_material/lens_treatment/lens_category. Primaria sigue siendo la LIGHT GREY.
-- 📸 FOTOS: oficiales de Rusty pasadas por `pnpm placas --tipo receta` y subidas con `pnpm fotos:subir --sufijo`: `rusty-pro-30-receta/perfil|frente-cry|sblk|mdemi.jpg` (2000×1333), scale 1.05.
-- TEXTO: el producto pasaba de 1 a 4 colores: se reescriben short, meta, descripción larga y el callout superior. Se conserva la primaria SEO "anteojos transparentes hombre" (la meta ya la usaba; ahora la respalda también el cristal transparente).
-- ============================================

BEGIN;

UPDATE public.products SET
  short_description = 'Rusty PRO 30: armazón de receta cuadrado para hombre, liviano (22,9 g), en 4 colores con terminales de goma ajustables. Apto monofocal, bifocal y progresivo.',
  description = E'El **Rusty PRO 30** es un armazón de receta **cuadrado para hombre**, de 22,9 g. **Frente de G-Flex** con **patillas de G-Flex con alma de metal interior** y **terminales de goma ajustables y antideslizantes**, para un calce cómodo y firme.\n\nMedidas: frente 149 mm · lente 56 mm de ancho × 48 mm de alto · puente 19 mm · varilla 140 mm.\n\nViene con lentes demo (sin graduación). Sumale tus cristales con receta: monofocales, bifocales, progresivos o multifocales.\n\nDisponible en 4 colores:\n\n• Gris transparente con terminales azules.\n• Cristal transparente con terminales negros.\n• Negro brillo con terminales verdes.\n• Carey mate con terminales verdes.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  attributes = jsonb_set(attributes, '{callouts,0}',
    '{"body": "Frente de G-Flex en gris transparente, cristal transparente, negro brillo o carey mate. Patillas con alma de metal interior y terminales de goma ajustables y antideslizantes. Liviano: 22,9 g.", "type": "info", "title": "Cuadrado para hombre en 4 colores", "position": "top"}'::jsonb),
  updated_at = now()
WHERE slug = 'rusty-pro-30-receta';

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-pro-30-receta'), '126410',
   '{"frame_color":"transparente-terminales-negros","model_code":"CRY OPTICAL"}'::jsonb,
   9663300, 2, true, 2, 'MLA2191803551', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-pro-30-receta'), '968087',
   '{"frame_color":"negro-brillo-terminales-verdes","model_code":"SBLK OPTICAL"}'::jsonb,
   9663300, 2, true, 3, 'MLA2191803553', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-pro-30-receta'), '126413',
   '{"frame_color":"carey-mate-terminales-verdes","model_code":"MDEMI OPTICAL"}'::jsonb,
   9663300, 2, true, 4, 'MLA2191803555', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Fotos nuevas: perfil y frente de cada color, sort 3..8 (la medidas sigue en 99, la primaria LIGHT GREY en 0).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-pro-30-receta'), (SELECT id FROM public.product_variants WHERE sku='126410'),
   'rusty-pro-30-receta/perfil-cry.jpg', 'Armazón de receta Rusty PRO 30 cuadrado para hombre vista lateral, cristal transparente con terminales negros', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-pro-30-receta'), (SELECT id FROM public.product_variants WHERE sku='126410'),
   'rusty-pro-30-receta/frente-cry.jpg', 'Armazón de receta Rusty PRO 30 cuadrado para hombre vista frontal, cristal transparente con terminales negros', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-pro-30-receta'), (SELECT id FROM public.product_variants WHERE sku='968087'),
   'rusty-pro-30-receta/perfil-sblk.jpg', 'Armazón de receta Rusty PRO 30 cuadrado para hombre vista lateral, negro brillo con terminales verdes', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-pro-30-receta'), (SELECT id FROM public.product_variants WHERE sku='968087'),
   'rusty-pro-30-receta/frente-sblk.jpg', 'Armazón de receta Rusty PRO 30 cuadrado para hombre vista frontal, negro brillo con terminales verdes', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-pro-30-receta'), (SELECT id FROM public.product_variants WHERE sku='126413'),
   'rusty-pro-30-receta/perfil-mdemi.jpg', 'Armazón de receta Rusty PRO 30 cuadrado para hombre vista lateral, carey mate con terminales verdes', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='rusty-pro-30-receta'), (SELECT id FROM public.product_variants WHERE sku='126413'),
   'rusty-pro-30-receta/frente-mdemi.jpg', 'Armazón de receta Rusty PRO 30 cuadrado para hombre vista frontal, carey mate con terminales verdes', 2000, 1333, 8, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
