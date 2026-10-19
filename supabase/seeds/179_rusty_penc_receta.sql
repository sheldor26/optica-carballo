-- ============================================
-- Seed 179: Rusty Penc Optics RECETA (FW23), cuadrado de esquinas redondeadas en G-Flex, unisex, 3 colores
-- Fecha: 2026-10-15
-- ============================================
-- 1 PUBLICACIÓN MULTIVARIANTE de ML, tradicional (`catalog_listing:false`, categoría MLA417127), ACTIVA, verificada por API el 2026-10-15: `MLA1388505877` (2 vendidas, título congelado "Armazones Anteojos Receta Rusty Penc Ovalados Mujer Hombre"), $84.592,27 → 8459227c las 3 variaciones:
--   MBLK   SKU 957010  var `207916449947`  stock 2  negro mate (agregada por el founder el 2026-10-15)
--   MBLUE  SKU 957011  var `178752827970`  stock 3  azul mate
--   SBLK   SKU 957012  var `178752827972`  stock 3  negro brillo
--   (En ML las variaciones no tienen SELLER_SKU cargado: acá van con los SKU que informó el founder.) Stock y precio mandan desde ML. Sin GTIN.
--
-- DATOS DEL FOUNDER (2026-10-15): G-Flex (frente y patillas), bisagras metálicas con sistema flex, 20,8 g, "cuadrado redondeado", **47-17-134, ancho total 140, alto total 47** (Rusty y el ML viejo dicen 48-23-135: NO gana contra el founder), "se puede adaptar todo tipo de lentes" (NO se promociona así), lentes demo estándar SIN filtro (la web de Rusty dice Blue Cut: no se afirma), unisex. Rusty también lista OLIVE 957013: el founder no la trajo, no se carga.
-- ⚠️ CRITERIO: el SITIO no menciona Blue Cut. PROGRESIVOS: sí, con texto prudente (corredor corto + DIP y altura de montaje con el armazón puesto): el hueco real del cristal es ~38-42 mm estimado, SIN MEDIR (optical-expert; mínimo ~30-32 mm). Mismo criterio que Blica y Midwest.
-- 🔬 optical-expert: forma "cuadrado de esquinas redondeadas" (`frame_shape` "cuadrado"; no "ovalado" ni "cuadrado redondeado" suelto), "G-Flex" sólo como nombre del material (nunca "flexible"), "bisagras metálicas con sistema flex" (el founder verifica patilla >90° con resistencia elástica), "liviano" (no "ultraliviano"), calibre chico con frente de ancho medio: sin `size_fit` (sólo admite junior/chico/infantil), face shapes ovalado/redondo/corazón (sin cuadrado).
-- 🎯 SEO (seo-strategist): slug `rusty-penc-receta`, name `Rusty Penc Optics`, carril = branded `rusty penc` + `anteojos recetados` una vez ("cuadrados" es de Zinz, "ovalados" de Vulk Clems, G-Flex sólo dato); links a Zinz, Blica, Arms y hub; frase de vuelta sólo en Zinz.
-- 📸 FOTOS: oficiales de Rusty (900×442) pasadas por `pnpm placas --tipo receta` y subidas con `pnpm fotos:subir --sufijo`: `rusty-penc-receta/perfil|frente-mblk`, `perfil|frente-mblue`, `frente-sblk` y `medidas-mblk` (2000×1333, scale 1.05). La SBLK va SIN perfil (no existe en la web de Rusty; pendiente del founder, ver DATOS_PENDIENTES.md).
-- ============================================

BEGIN;

WITH
  rusty  AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-penc-receta', 'Rusty Penc Optics',
  'Armazón de receta Rusty Penc Optics en G-Flex, cuadrado de esquinas redondeadas y liviano (20,8 g), con bisagras metálicas con sistema flex. En negro mate, azul mate o negro brillo.',
  E'Los **Rusty Penc** son **anteojos recetados** de armazón **cuadrado de esquinas redondeadas**, unisex, en **G-Flex** (frente y patillas) y livianos: 20,8 g. Las **bisagras son metálicas, con sistema flex**: la patilla acompaña el movimiento al abrir y cerrar, para un calce más cómodo.\n\n**Viene con lentes de demostración**, sin graduación, para que pruebes el armazón. Sumale tus cristales con receta: monofocales, bifocales o progresivos. Para progresivos, el calibre es chico (47 mm): trabajamos con diseños de corredor corto y tomamos tu distancia pupilar y la altura de montaje con el armazón puesto.\n\nMedidas: frente 140 mm · lente 47 mm de ancho · puente 17 mm · varilla 134 mm · alto total 47 mm. Es un talle chico a mediano.\n\nDisponible en 3 colores:\n\n• **MBLK, negro mate.**\n• **MBLUE, azul mate.**\n• **SBLK, negro brillo.**\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi buscás otro cuadrado en G-Flex, mirá los [Rusty Zinz Optics](/anteojos-de-receta/rusty/rusty-zinz-receta); si preferís un redondo de talle chico, los [Rusty Blica Optics](/anteojos-de-receta/rusty/rusty-blica-receta); y si te gusta más recto, los [Rusty Arms Optics](/anteojos-de-receta/rusty/rusty-arms-receta). También podés ver [todos los anteojos de receta Rusty](/anteojos-de-receta/rusty).',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "cuadrado",
    "hinge_system": "flex",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo"],
    "recommended_face_shapes": ["ovalado", "redondo", "corazon"],
    "gender": "unisex",
    "weight_grams": 20.8,
    "measurements": {"frame_width_mm": 140, "lens_width_mm": 47, "lens_height_mm": 47, "bridge_mm": 17, "temple_length_mm": 134},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-15",
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado de esquinas redondeadas, liviano y unisex", "body": "Frente y patillas de G-Flex, 20,8 g, con bisagras metálicas con sistema flex. En negro mate, azul mate o negro brillo."},
      {"type": "tip", "position": "middle", "title": "Monofocales, bifocales y progresivos", "body": "Acepta cristales monofocales, bifocales y progresivos. Para progresivos el calibre es chico (47 mm), así que usamos un diseño de corredor corto y tomamos tu distancia pupilar y la altura de montaje con el armazón puesto. Si tenés dudas con tu graduación, escribinos antes de comprar."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con una foto de tu receta. Te pasamos el costo de los cristales según tu graduación y los tratamientos que quieras (antirreflejo, fotocromático)."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1388505877"], "imported_at": "2026-10-15"}
  }'::jsonb,
  true, false,
  'Rusty Penc Optics Cuadrado Redondeado | Anteojos de Receta',
  'Anteojos de receta Rusty Penc Optics: armazón cuadrado redondeado de G-Flex, liviano (20,8 g), con 3 colores. Envíos a todo el país y garantía de 1 año.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 3 variantes de la multivariante MLA1388505877. Primaria = MBLK (perfil).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-penc-receta'), '957010',
   '{"frame_color":"negro-mate","model_code":"MBLK"}'::jsonb,
   8459227, 2, true, 1, 'MLA1388505877', '207916449947'),
  ((SELECT id FROM public.products WHERE slug='rusty-penc-receta'), '957011',
   '{"frame_color":"azul-mate","model_code":"MBLUE"}'::jsonb,
   8459227, 3, true, 2, 'MLA1388505877', '178752827970'),
  ((SELECT id FROM public.products WHERE slug='rusty-penc-receta'), '957012',
   '{"frame_color":"negro-brillo","model_code":"SBLK"}'::jsonb,
   8459227, 3, true, 3, 'MLA1388505877', '178752827972')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Primaria = perfil de la MBLK. medidas-mblk.jpg SIEMPRE última (sort 99) y con variant_id NULL. La SBLK va sólo con frente.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-penc-receta'), (SELECT id FROM public.product_variants WHERE sku='957010'),
   'rusty-penc-receta/perfil-mblk.jpg', 'Anteojos de receta Rusty Penc cuadrados de esquinas redondeadas en G-Flex, vista lateral, negro mate con lentes de demostración', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-penc-receta'), (SELECT id FROM public.product_variants WHERE sku='957010'),
   'rusty-penc-receta/frente-mblk.jpg', 'Anteojos de receta Rusty Penc cuadrados de esquinas redondeadas en G-Flex, vista frontal, negro mate con lentes de demostración', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-penc-receta'), (SELECT id FROM public.product_variants WHERE sku='957011'),
   'rusty-penc-receta/perfil-mblue.jpg', 'Anteojos de receta Rusty Penc cuadrados de esquinas redondeadas en G-Flex, vista lateral, azul mate con lentes de demostración', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-penc-receta'), (SELECT id FROM public.product_variants WHERE sku='957011'),
   'rusty-penc-receta/frente-mblue.jpg', 'Anteojos de receta Rusty Penc cuadrados de esquinas redondeadas en G-Flex, vista frontal, azul mate con lentes de demostración', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-penc-receta'), (SELECT id FROM public.product_variants WHERE sku='957012'),
   'rusty-penc-receta/frente-sblk.jpg', 'Anteojos de receta Rusty Penc cuadrados de esquinas redondeadas en G-Flex, vista frontal, negro brillo con lentes de demostración', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-penc-receta'), NULL,
   'rusty-penc-receta/medidas-mblk.jpg', 'Esquema técnico de medidas Rusty Penc: frente 140mm, lente 47mm, alto total 47mm, puente 17mm, varilla 134mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: sólo en Zinz receta (el cuadrado en G-Flex más cercano).
UPDATE public.products
SET description = description || E'\n\nSi te gusta el cuadrado pero con esquinas más redondeadas, mirá los [Rusty Penc Optics](/anteojos-de-receta/rusty/rusty-penc-receta).', updated_at = now()
WHERE slug = 'rusty-zinz-receta' AND description NOT LIKE '%rusty-penc-receta%';

COMMIT;
