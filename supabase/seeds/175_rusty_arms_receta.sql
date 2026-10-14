-- ============================================
-- Seed 175: Rusty Arms Optics RECETA (FW22), rectangular en G-Flex, unisex, 4 colores
-- Fecha: 2026-10-14
-- ============================================
-- 1 PUBLICACIÓN MULTIVARIANTE TRADICIONAL de ML (`MLA2015405558`, `catalog_listing:false`, 4 vendidas, título congelado "Armazon Marco Lentes De Receta Rusty Arms Livianos Hombre"), con las 4 variaciones reales verificadas por API el 2026-10-14 ($82.745,69 todas → 8274569c):
--   MBLK            SKU 113271  var 182911235226  stock 5   negro mate
--   L.GREY          SKU 113272  var 182911235224  stock 0   gris claro transparente
--   MBLUE-MBLK      SKU 113273  var 207898354695  stock 3   frente azul / patillas negro mate
--   O.GREEN-MBLK    SKU 113274  var 207898354697  stock 2   frente verde oliva / patillas negro mate
--   Las 2 últimas las agregó el founder el 2026-10-14. Los `variation_code` son reales y obligatorios (item multivariación). Stock y precio mandan desde ML. Las gemelas de catálogo (MLA2763937644, MLA2808384300) se ignoran. ML aún dice "Hombre": el sitio va unisex (founder).
--
-- DATOS DEL FOUNDER (2026-10-14): G-Flex (frente y patillas), rectangular, bisagras metálicas con flex, unisex, 51-20-145, alto total 40, ancho total 139, "monofocales y bifocales, pero es medio chico para progresivos". Peso 23,2 g (dato de Rusty).
-- ⚠️ PROGRESIVOS: NO se mencionan en ningún lado (ni "no recomendado": el founder no quiere frases que duden del producto): `lens_compatibility` ["monofocal","bifocal"], sin callout de progresivos. El hueco real del cristal (est. 32-36 mm) está SIN MEDIR: pendiente del founder.
-- ⚠️ La descripción vigente en ML decía "progresivos", "G-Flex material flexible", alto de lente 36 y ancho total 140: se entregó una nueva (`marketing/placas-ml/SUBIR-rusty-arms/PUBLICACION.md`); pendiente que el founder la reemplace.
-- La foto de FRENTE del MBLUE-MBLK de Rusty parecía mal en la web de Rusty; el founder confirmó (2026-10-14) que "se ve bien cuando queda descargada": se sube (`frente-mblue.jpg`, sort 3).
-- ⚠️ Sin Blue Cut (no confirmado), sin "flexible" para el armazón, sin "facetado".
-- Convención de la línea de receta de Rusty: name "Rusty <Modelo> Optics", slug `rusty-<modelo>-receta`.
-- 🎯 SEO (seo-strategist): branded `rusty arms` + `anteojos recetados` una vez; "rectangular" sólo en copy (R-CY 02 lo lidera); sin carril de colores; links a Woxi, R-CY 02, Zinz y hub; frase de vuelta sólo en Woxi.
-- 🔬 optical-expert: "liviano" (no "ultraliviano"), sistema flex = bisagra de resorte, face shapes ovalado/redondo/corazón, talle mediano a chico, sin callout de progresivos.
-- 📸 FOTOS: oficiales de Rusty (900×442) pasadas por `pnpm placas --tipo receta` y subidas con `pnpm fotos:subir --sufijo`: `rusty-arms-receta/perfil|frente-mblk|lgrey|ogreen.jpg`, `perfil|frente-mblue.jpg` y `medidas.jpg` (2000×1333), scale 1.05.
-- ============================================

BEGIN;

WITH
  rusty  AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-arms-receta', 'Rusty Arms Optics',
  'Armazón de receta Rusty Arms Optics en G-Flex, rectangular y liviano (23,2 g), con bisagras metálicas con sistema flex. En 4 colores: negro mate, gris claro transparente, y frente azul o verde oliva con patillas negro mate.',
  E'Los **Rusty Arms** son **anteojos recetados** de armazón **rectangular**, unisex, en **G-Flex** (frente y patillas) y livianos: 23,2 g. Las **bisagras son metálicas, con sistema flex**: la patilla acompaña el movimiento al abrir y cerrar, para un calce más cómodo.\n\n**Viene con lentes de demostración**, sin graduación, para que pruebes el armazón. Sumale tus cristales con receta: monofocales o bifocales.\n\nMedidas: frente 139 mm · lente 51 mm de ancho · puente 20 mm · varilla 145 mm · alto total 40 mm. Es un talle mediano a chico.\n\nDisponible en 4 colores:\n\n• **MBLK, negro mate.**\n• **L.GREY, gris claro transparente.**\n• **MBLUE-MBLK, frente azul con patillas negro mate.**\n• **O.GREEN-MBLK, frente verde oliva con patillas negro mate.**\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi buscás otro rectangular en G-Flex, mirá los [Rusty Woxi Optics](/anteojos-de-receta/rusty/rusty-woxi-receta), de talle más chico, o los [Rusty R-CY 02 Optics](/anteojos-de-receta/rusty/rusty-r-cy-02-receta), más finos y livianos; si preferís un cuadrado en G-Flex, los [Rusty Zinz Optics](/anteojos-de-receta/rusty/rusty-zinz-receta). También podés ver [todos los anteojos de receta Rusty](/anteojos-de-receta/rusty).',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "rectangular",
    "hinge_system": "flex",
    "lens_compatibility": ["monofocal", "bifocal"],
    "recommended_face_shapes": ["ovalado", "redondo", "corazon"],
    "gender": "unisex",
    "weight_grams": 23.2,
    "measurements": {"frame_width_mm": 139, "lens_width_mm": 51, "lens_height_mm": 40, "bridge_mm": 20, "temple_length_mm": 145},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-14",
    "callouts": [
      {"type": "info", "position": "top", "title": "Rectangular, liviano y unisex", "body": "Frente y patillas de G-Flex, 23,2 g, con bisagras metálicas con sistema flex. En negro mate, gris claro transparente, azul o verde oliva con patillas negro mate."},
      {"type": "tip", "position": "middle", "title": "Pensado para monofocales y bifocales", "body": "Acepta cristales monofocales y bifocales. Si tenés dudas con tu receta, escribinos antes de comprar."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con una foto de tu receta. Te pasamos el costo de los cristales según tu graduación y los tratamientos que quieras (antirreflejo, fotocromático)."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2015405558"], "imported_at": "2026-10-14"}
  }'::jsonb,
  true, false,
  'Rusty Arms Optics Liviano en G-Flex | Anteojos de Receta',
  'Anteojos de receta Rusty Arms Optics: armazón rectangular de G-Flex, liviano (23,2 g), en 4 colores. Envíos a todo el país y garantía de 1 año.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 4 variantes de UN item multivariación de ML con variation_code real. Orden por stock: MBLK (5), MBLUE (3), O.GREEN (2), L.GREY (0).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-arms-receta'), '113271',
   '{"frame_color":"negro-mate","model_code":"MBLK"}'::jsonb,
   8274569, 5, true, 1, 'MLA2015405558', '182911235226'),
  ((SELECT id FROM public.products WHERE slug='rusty-arms-receta'), '113273',
   '{"frame_color":"azul-patillas-negro-mate","model_code":"MBLUE-MBLK"}'::jsonb,
   8274569, 3, true, 2, 'MLA2015405558', '207898354695'),
  ((SELECT id FROM public.products WHERE slug='rusty-arms-receta'), '113274',
   '{"frame_color":"verde-oliva-patillas-negro-mate","model_code":"O.GREEN-MBLK"}'::jsonb,
   8274569, 2, true, 3, 'MLA2015405558', '207898354697'),
  ((SELECT id FROM public.products WHERE slug='rusty-arms-receta'), '113272',
   '{"frame_color":"gris-claro-transparente","model_code":"L.GREY"}'::jsonb,
   8274569, 0, true, 4, 'MLA2015405558', '182911235224')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Primaria = perfil del MBLK. medidas.jpg SIEMPRE última (sort 99) y con variant_id NULL. El MBLUE va sólo con perfil (el frente de Rusty parece mal).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-arms-receta'), (SELECT id FROM public.product_variants WHERE sku='113271'),
   'rusty-arms-receta/perfil-mblk.jpg', 'Anteojos de receta Rusty Arms rectangulares de G-Flex, vista lateral, negro mate con lentes de demostración', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-arms-receta'), (SELECT id FROM public.product_variants WHERE sku='113271'),
   'rusty-arms-receta/frente-mblk.jpg', 'Anteojos de receta Rusty Arms rectangulares de G-Flex, vista frontal, negro mate con lentes de demostración', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-arms-receta'), (SELECT id FROM public.product_variants WHERE sku='113273'),
   'rusty-arms-receta/perfil-mblue.jpg', 'Anteojos de receta Rusty Arms rectangulares de G-Flex, vista lateral, frente azul con patillas negro mate y lentes de demostración', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-arms-receta'), (SELECT id FROM public.product_variants WHERE sku='113273'),
   'rusty-arms-receta/frente-mblue.jpg', 'Anteojos de receta Rusty Arms rectangulares de G-Flex, vista frontal, frente azul con patillas negro mate y lentes de demostración', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-arms-receta'), (SELECT id FROM public.product_variants WHERE sku='113274'),
   'rusty-arms-receta/perfil-ogreen.jpg', 'Anteojos de receta Rusty Arms rectangulares de G-Flex, vista lateral, frente verde oliva con patillas negro mate y lentes de demostración', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-arms-receta'), (SELECT id FROM public.product_variants WHERE sku='113274'),
   'rusty-arms-receta/frente-ogreen.jpg', 'Anteojos de receta Rusty Arms rectangulares de G-Flex, vista frontal, frente verde oliva con patillas negro mate y lentes de demostración', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-arms-receta'), (SELECT id FROM public.product_variants WHERE sku='113272'),
   'rusty-arms-receta/perfil-lgrey.jpg', 'Anteojos de receta Rusty Arms rectangulares de G-Flex, vista lateral, gris claro transparente con lentes de demostración', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-arms-receta'), (SELECT id FROM public.product_variants WHERE sku='113272'),
   'rusty-arms-receta/frente-lgrey.jpg', 'Anteojos de receta Rusty Arms rectangulares de G-Flex, vista frontal, gris claro transparente con lentes de demostración', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='rusty-arms-receta'), NULL,
   'rusty-arms-receta/medidas.jpg', 'Esquema técnico de medidas Rusty Arms: frente 139mm, lente 51mm, alto total 40mm, puente 20mm, varilla 145mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: sólo en Woxi receta (el rectangular G-Flex más cercano).
UPDATE public.products
SET description = description || E'\n\nSi buscás un rectangular en G-Flex de talle un poco más grande, con monofocales o bifocales, mirá los [Rusty Arms Optics](/anteojos-de-receta/rusty/rusty-arms-receta).', updated_at = now()
WHERE slug = 'rusty-woxi-receta' AND description NOT LIKE '%rusty-arms-receta%';

COMMIT;
