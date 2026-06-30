-- ============================================
-- Seed 62: Vulk Tour 81 RECETA (armazón óptico) — CUADRADO unisex, G-Flex
-- Fecha: 2026-06-11
-- ============================================
-- Armazón de receta CUADRADO unisex, G-Flex (frente y patillas), bisagras
-- metálicas con sistema flex (va en callout, NO es campo del schema). Lentes demo,
-- talle medium. Categoría anteojos-de-receta. Convención receta: lens_compatibility
-- + (sin lens_material/treatment/polarized). SEO por seo-strategist (cluster Vulk;
-- head "anteojos vulk" 4.400 al hub, producto targetea modelo+forma cuadrada+unisex).
--
-- frame_shape = 'square' (enum del schema; ML dice "cuadrado").
-- weight_grams OMITIDO: ML no especifica peso → no inventamos (el casillero "Peso"
--   del comparador queda vacío; founder puede pesar la unidad física 315 → BACKLOG).
--
-- 3 variantes en 1 MLA multi-variante (MLA1476831627). Todas $83.443,00. Precio/
-- stock/var_id traídos de la API ML (scripts/ml-item.ts):
--   MBLK OPTICAL  SKU 125890  negro mate.           var 196436282219  stock 0 (PRIMARY)
--   CRY OPTICAL   SKU 125892  transparente.         var 186939314783  stock 0
--   315 OPTICAL   SKU 125894  naranja transparente. var 186939314781  stock 1
--
-- Medidas: 140 / 50x47 / 21 / 138 mm (de la FOTO de medidas; el texto de ML decía
-- 139 total / 40 alto → se usan los de la foto por pedido del founder). frame_material
-- + temple_material g-flex. hinge_system OMITIDO (no es campo del schema; flex al callout).
--
-- 📸 FOTOS (bucket products/vulk-tour-81/ — ⚠️ AÚN NO SUBIDAS al cargar este seed;
-- naming inconsistente del founder). Primaria = perfil (PERFIL):
--   TOUR 81-MBLK PERFIL GALERIA.jpg / TOUR 81-MBLK FRENTE GALERIA.jpg   (primary)
--   TOUR 81 CRY PERFIL GALERIA.jpg / TOUR 81 CRY FRENTE GALERIA.jpg
--   TOUR 81- 315 OPTICS PERFIL GALERIA.jpg / TOUR 81- 315 OPTICS FRENTE GALERIA.jpg
--   medidas.jpeg
-- Scale: perfil 1.3 / frente 1.15 PROVISIONAL (precedente GALERIA = MBLK de My Crew
-- verificado a 1.3; cuadrado llena distinto que redondo → CONFIRMAR visual al subir
-- fotos. dims 900×442 estimadas = formato GALERIA, confirmar reales). medidas en 1.0.
-- ============================================

BEGIN;

WITH
  vulk    AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM receta), 'vulk-tour-81-receta', 'Vulk Tour 81 Optics',
  'Anteojos cuadrados Vulk Tour 81: armazón unisex con tecnología G-Flex y bisagras metálicas flexibles, talle medium. Vienen con lentes demo para que cargues tu receta. Incluye estuche, franela y garantía de 1 año.',
  E'El Vulk Tour 81 es un armazón de receta **cuadrado unisex**, pensado para quien busca un diseño con carácter sin resignar comodidad. El **frente y las patillas son de G-Flex** —ultraliviano y flexible— con **bisagras metálicas de sistema flex** que dan un calce cómodo y aguantan el uso diario.\n\nMedidas: frente 140 mm · lente 50 mm de ancho × 47 mm de alto · puente 21 mm · varilla 138 mm. Talle medium, equilibrado para la mayoría de los rostros.\n\nViene con lentes demo (sin graduación). Acepta tu receta: monofocales, bifocales y progresivos.\n\nDisponible en 3 colores:\n\n• MBLK — negro mate.\n• CRY — transparente.\n• 315 — naranja transparente.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "cuadrado",
    "temple_material": "g-flex",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "unisex",
    "line": "urbana",
    "measurements": {"frame_width_mm": 140, "lens_width_mm": 50, "lens_height_mm": 47, "bridge_mm": 21, "temple_length_mm": 138},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado unisex en G-Flex", "body": "Frente y patillas de G-Flex ultraliviano y flexible con bisagras metálicas de sistema flex. Forma cuadrada con impronta moderna, para hombre o mujer. Talle medium."},
      {"type": "tip", "position": "middle", "title": "Apto para tu graduación", "body": "Acepta lentes monofocales, bifocales y progresivos. Si tenés dudas con tu receta o querés saber si te sirve para progresivos, escribinos antes de comprar."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con foto de tu receta. Te pasamos el costo del laboratorio según tu graduación + tratamientos (antirreflex, blue light, fotocromático). Armazón + cristales en 7-10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1476831627"], "imported_at": "2026-06-11"}
  }'::jsonb,
  true, false,
  'Anteojos Vulk Tour 81 Receta Cuadrados | Óptica Carballo',
  'Armazón de receta Vulk Tour 81 cuadrado, unisex, con bisagras flex y garantía. Incluye estuche y franela. Envíos a toda Argentina. Pedí asesoramiento.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = MBLK (default/primary). SKU distintos (sin colisión).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-tour-81-receta'), '125890',
   '{"frame_color":"negro-mate","model_code":"MBLK OPTICAL"}'::jsonb,
   8344300, 0, true, 1, 'MLA1476831627', '196436282219'),
  ((SELECT id FROM public.products WHERE slug='vulk-tour-81-receta'), '125892',
   '{"frame_color":"transparente","model_code":"CRY OPTICAL"}'::jsonb,
   8344300, 0, true, 2, 'MLA1476831627', '186939314783'),
  ((SELECT id FROM public.products WHERE slug='vulk-tour-81-receta'), '125894',
   '{"frame_color":"naranja-transparente","model_code":"315 OPTICAL"}'::jsonb,
   8344300, 1, true, 3, 'MLA1476831627', '186939314781')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: MBLK perfil. medidas SIEMPRE última.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-tour-81-receta'), (SELECT id FROM public.product_variants WHERE sku='125890'),
   'vulk-tour-81/TOUR 81-MBLK PERFIL GALERIA.jpg', 'Anteojos Vulk Tour 81 armazón de receta cuadrado unisex vista lateral, negro mate', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-tour-81-receta'), (SELECT id FROM public.product_variants WHERE sku='125890'),
   'vulk-tour-81/TOUR 81-MBLK FRENTE GALERIA.jpg', 'Anteojos Vulk Tour 81 armazón de receta cuadrado unisex vista frontal, negro mate', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-tour-81-receta'), (SELECT id FROM public.product_variants WHERE sku='125892'),
   'vulk-tour-81/TOUR 81 CRY PERFIL GALERIA.jpg', 'Anteojos Vulk Tour 81 armazón de receta cuadrado unisex vista lateral, transparente', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-tour-81-receta'), (SELECT id FROM public.product_variants WHERE sku='125892'),
   'vulk-tour-81/TOUR 81 CRY FRENTE GALERIA.jpg', 'Anteojos Vulk Tour 81 armazón de receta cuadrado unisex vista frontal, transparente', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-tour-81-receta'), (SELECT id FROM public.product_variants WHERE sku='125894'),
   'vulk-tour-81/TOUR 81- 315 OPTICS PERFIL GALERIA.jpg', 'Anteojos Vulk Tour 81 armazón de receta cuadrado unisex vista lateral, naranja transparente', 900, 442, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-tour-81-receta'), (SELECT id FROM public.product_variants WHERE sku='125894'),
   'vulk-tour-81/TOUR 81- 315 OPTICS FRENTE GALERIA.jpg', 'Anteojos Vulk Tour 81 armazón de receta cuadrado unisex vista frontal, naranja transparente', 900, 442, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-tour-81-receta'), NULL,
   'vulk-tour-81/medidas.jpeg', 'Esquema técnico de medidas Vulk Tour 81: frente 140mm, lente 50x47mm, puente 21mm, varilla 138mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
