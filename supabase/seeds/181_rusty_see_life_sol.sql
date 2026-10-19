-- ============================================
-- Seed 181: Rusty See Life SOL (SS24), cat eye redondeado femenino, G-Flex, 4 colores TODOS polarizados
-- Fecha: 2026-10-19
-- ============================================
-- 1 PUBLICACIÓN MULTIVARIANTE de ML, tradicional (`catalog_listing:false`, categoría MLA417128), ACTIVA, verificada por API el 2026-10-19: `MLA2564403416` (0 vendidas; la vieja pausada MLA1530323018 con 118 ventas y las gemelas de catálogo se ignoran), título congelado "Anteojos Lente De Sol Polarizado Rusty See Life Mujer Gafa +", $88.349 → 8834900c las 4 variaciones:
--   SBLK/S10 POL    SKU 958200  var `187035519014`  stock 6  negro brillo / lente gris oscuro
--   BROWN/DRT04 POL SKU 958201  var `187035519010`  stock 9  marrón transparente / lente gris degradé
--   SDEMI/G15 POL   SKU 958202  var `187035519016`  stock 7  carey oscuro / lente verde G15
--   L.ROSE/DRT25 POL SKU 958203 var `187035519012`  stock 9  rosa transparente / lente gris degradé
--   (En ML las variaciones no tienen SELLER_SKU: los SKU salen de la web de Rusty por nombre de color y están por confirmar con el founder.) Stock y precio mandan desde ML. Sin GTIN. El quinto color de Rusty (SDEMI BROWN BG26 958208) no está en ML: no se carga.
--
-- DATOS DEL FOUNDER (2026-10-19): anteojo femenino "en punta / ojo de gato" (redondeado), G-Flex, bisagra metálica con sistema flex, lentes POLARIZADAS (4/4), UV400, categoría 3, **58-18-135, ancho total 141, alto total 54**. Peso Rusty 25,4 g. Policarbonato = default del proyecto para sol (no lo dijo el founder).
-- 🔬 optical-expert: SIN "liviano" (25,4 g es más que el Clevel/Tuniti, que ya quedaron afuera: se dice el peso); "polarizadas: reducen los reflejos", "100% UVA/UVB a través de la lente (UV400)", "categoría 3: sol fuerte, no sirve para manejar de noche"; SIN "protección total/máxima", "fatiga visual", "flexible" (G-Flex es sólo el nombre del material; "flex" es la bisagra), "se adaptan sin presión"; talle "mediano a grande" (sin `size_fit`); forma "cat eye redondeado" (NO "ovalada", aunque ML lo diga); graduación: en ML NO se menciona; en el sitio sólo con texto prudente (circuito de receta).
-- 🎯 SEO (seo-strategist): slug `rusty-see-life`, name `Rusty See Life` (SIN "Optics": es sol), "polarizados" en title/meta (4 de 4), cat eye NO es carril (Dunsert/Le Groupie/Beason lo tienen): carril = branded `rusty see life` + `anteojos de sol polarizados mujer` (50/36); links a Beason (cat eye femenino, obligatorio), Dunsert, Vriviant, Terdey y las facetas de sol; frase de vuelta sólo en Beason; sin cruce sol↔receta con el Tuniti.
-- 📸 FOTOS: oficiales de Rusty (900×442) pasadas por `pnpm placas --tipo sol` y subidas con `pnpm fotos:subir --sufijo`: `rusty-see-life/perfil|frente-sblk|brown|sdemi|lrose.jpg` y `medidas-sblk.jpg` (2000×1333). Scale por defecto (1.0): verificar con `pnpm auditar:encuadre` tras el deploy y comparar contra el grid de sol (regla 15).
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-see-life', 'Rusty See Life',
  'Anteojos de sol Rusty See Life polarizados: cat eye redondeado para mujer, con frente y patillas de G-Flex y bisagras metálicas con sistema flex. Lente de policarbonato UV400, categoría 3. 25,4 g.',
  E'Los **Rusty See Life** son **anteojos de sol cat eye redondeado, para mujer**, con frente y patillas de **G-Flex**. Las **bisagras son metálicas, con sistema flex**: la patilla acompaña el movimiento al abrir y cerrar.\n\nLas lentes son de **policarbonato** y **polarizadas en los cuatro colores**: reducen los reflejos del agua, el asfalto y la nieve. Tienen **100% de protección UVA y UVB a través de la lente (UV400)** y **categoría 3**, pensada para sol fuerte (no sirve para manejar de noche).\n\nMedidas: frente 141 mm · lente 58 mm de ancho · puente 18 mm · varilla 135 mm · alto total 54 mm. Es un tamaño mediano a grande. Pesa 25,4 g.\n\nDisponible en 4 colores:\n\n• **SBLK/S10, negro brillo con lente gris oscuro.**\n• **BROWN/DRT04, marrón transparente con lente gris degradé.**\n• **SDEMI/G15, carey oscuro con lente verde G15.**\n• **L.ROSE/DRT25, rosa transparente con lente gris degradé.**\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi te gusta el cat eye, mirá también los [Rusty Beason](/anteojos-de-sol/rusty/rusty-beason), otro cat eye femenino de la línea, o los [Rusty Dunsert](/anteojos-de-sol/rusty/rusty-dunsert), unisex. Para otro estilo, los [Rusty Vriviant](/anteojos-de-sol/rusty/rusty-vriviant), cuadrados y femeninos. También podés ver [todos los anteojos de sol Rusty](/anteojos-de-sol/rusty), [los de mujer](/anteojos-de-sol/mujer), [los cat eye](/anteojos-de-sol/cat-eye) y [los polarizados](/anteojos-de-sol/polarizados).',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "cat_eye",
    "hinge_system": "flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["polarized", "uv400"],
    "lens_category": 3,
    "gender": "female",
    "weight_grams": 25.4,
    "measurements": {"frame_width_mm": 141, "lens_width_mm": 58, "lens_height_mm": 54, "bridge_mm": 18, "temple_length_mm": 135},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-19",
    "callouts": [
      {"type": "info", "position": "top", "title": "Cat eye redondeado, polarizado y femenino", "body": "Frente y patillas de G-Flex, con bisagras metálicas con sistema flex. Lente de policarbonato polarizada en los 4 colores. Pesa 25,4 g."},
      {"type": "tip", "position": "middle", "title": "Polarizado, UV400 y categoría 3", "body": "Reduce los reflejos del agua, el asfalto y la nieve. 100% de protección UVA y UVB a través de la lente. Categoría 3: pensada para sol fuerte, no sirve para manejar de noche."},
      {"type": "recommendation", "position": "bottom", "title": "¿Lo querés con tu graduación?", "body": "Escribinos por WhatsApp con una foto de tu receta y lo vemos caso por caso: depende de tu graduación y de la altura de la lente."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2564403416"], "imported_at": "2026-10-19"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Rusty See Life Polarizados Mujer | Carballo',
  'Anteojos de sol Rusty See Life polarizados para mujer: cat eye de G-Flex, UV400 categoría 3, 25,4 g. En 4 colores. Envío a todo el país y garantía.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 4 variantes de la multivariante MLA2564403416, todas polarizadas. Primaria = SBLK (perfil).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-see-life'), '958200',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10 POL","polarized":true}'::jsonb,
   8834900, 6, true, 1, 'MLA2564403416', '187035519014'),
  ((SELECT id FROM public.products WHERE slug='rusty-see-life'), '958201',
   '{"frame_color":"marron-transparente","lens_color":"gris-degrade","model_code":"BROWN/DRT04 POL","polarized":true}'::jsonb,
   8834900, 9, true, 2, 'MLA2564403416', '187035519010'),
  ((SELECT id FROM public.products WHERE slug='rusty-see-life'), '958202',
   '{"frame_color":"carey-oscuro","lens_color":"verde-g15","model_code":"SDEMI/G15 POL","polarized":true}'::jsonb,
   8834900, 7, true, 3, 'MLA2564403416', '187035519016'),
  ((SELECT id FROM public.products WHERE slug='rusty-see-life'), '958203',
   '{"frame_color":"rosa-transparente","lens_color":"gris-degrade","model_code":"L.ROSE/DRT25 POL","polarized":true}'::jsonb,
   8834900, 9, true, 4, 'MLA2564403416', '187035519012')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Primaria = perfil de la SBLK. medidas-sblk.jpg SIEMPRE última (sort 99) y con variant_id NULL.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-see-life'), (SELECT id FROM public.product_variants WHERE sku='958200'),
   'rusty-see-life/perfil-sblk.jpg', 'Anteojos de sol Rusty See Life cat eye polarizados, vista lateral, negro brillo con lente gris oscuro', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-see-life'), (SELECT id FROM public.product_variants WHERE sku='958200'),
   'rusty-see-life/frente-sblk.jpg', 'Anteojos de sol Rusty See Life cat eye polarizados, vista frontal, negro brillo con lente gris oscuro', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-see-life'), (SELECT id FROM public.product_variants WHERE sku='958201'),
   'rusty-see-life/perfil-brown.jpg', 'Anteojos de sol Rusty See Life cat eye polarizados, vista lateral, marrón transparente con lente gris degradé', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-see-life'), (SELECT id FROM public.product_variants WHERE sku='958201'),
   'rusty-see-life/frente-brown.jpg', 'Anteojos de sol Rusty See Life cat eye polarizados, vista frontal, marrón transparente con lente gris degradé', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-see-life'), (SELECT id FROM public.product_variants WHERE sku='958202'),
   'rusty-see-life/perfil-sdemi.jpg', 'Anteojos de sol Rusty See Life cat eye polarizados, vista lateral, carey oscuro con lente verde G15', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-see-life'), (SELECT id FROM public.product_variants WHERE sku='958202'),
   'rusty-see-life/frente-sdemi.jpg', 'Anteojos de sol Rusty See Life cat eye polarizados, vista frontal, carey oscuro con lente verde G15', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-see-life'), (SELECT id FROM public.product_variants WHERE sku='958203'),
   'rusty-see-life/perfil-lrose.jpg', 'Anteojos de sol Rusty See Life cat eye polarizados, vista lateral, rosa transparente con lente gris degradé', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-see-life'), (SELECT id FROM public.product_variants WHERE sku='958203'),
   'rusty-see-life/frente-lrose.jpg', 'Anteojos de sol Rusty See Life cat eye polarizados, vista frontal, rosa transparente con lente gris degradé', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='rusty-see-life'), NULL,
   'rusty-see-life/medidas-sblk.jpg', 'Esquema técnico de medidas Rusty See Life: frente 141mm, lente 58mm, alto total 54mm, puente 18mm, varilla 135mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: sólo en Beason (el otro cat eye femenino de la línea).
UPDATE public.products
SET description = description || E'\n\nSi buscás un cat eye polarizado, mirá también los [Rusty See Life](/anteojos-de-sol/rusty/rusty-see-life).', updated_at = now()
WHERE slug = 'rusty-beason' AND description NOT LIKE '%rusty-see-life%';

COMMIT;
