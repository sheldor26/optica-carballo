-- ============================================
-- Seed 61: Vulk My Crew RECETA (armazón óptico) — redondo/ovalado UNISEX, G-Flex
-- Fecha: 2026-06-11
-- ============================================
-- Armazón de receta REDONDO/OVALADO unisex, liviano (16g). Frente y patillas de
-- G-Flex; bisagras metálicas con sistema flex (va en callout, NO es campo del
-- schema). Lentes demo. Categoría anteojos-de-receta. Convención receta:
-- lens_compatibility + (sin lens_material/treatment/polarized). SEO por
-- seo-strategist (cluster Vulk; head de marca "anteojos vulk" 4.400/dif11 queda
-- para el hub, el producto targetea modelo+forma+unisex para no canibalizar).
--
-- frame_shape = 'round' (el enum del schema NO tiene 'oval'; ML dice "ovalado
-- redondo" → round es el canónico, igual que Vulk Clems/Lady Piny).
--
-- 4 variantes en 1 MLA multi-variante (MLA1432179921). Todas $83.107,23. Precio/
-- stock/var_id traídos de la API ML (scripts/ml-item.ts):
--   SBLK OPTICAL  SKU 125580  negro brillo.        var 180706732884  stock 3 (PRIMARY)
--   669K OPTICAL  SKU 125583  gris transparente.   var 180706732888  stock 4
--   MBLK OPTICAL  SKU 125584  negro mate.          var 180706732886  stock 3
--   388 OPTICAL   SKU 125582  marrón transparente. var 188255888407  stock 1
--
-- Medidas: 137 / 49x40 / 21 / 140 mm (de la FOTO de medidas; el texto de ML decía
-- varilla 145 → se usa 140 de la foto por pedido del founder). Peso 16g.
-- frame_material + temple_material g-flex (frente y patillas). hinge_system OMITIDO
-- (no es campo del schema; el sistema flex metálico va en el callout).
--
-- 📸 FOTOS (bucket products/vulk-my-crew/, las 9 verificadas en storage.objects;
-- naming inconsistente entre variantes). Primaria = perfil (P/PERFIL):
--   MY CREW SBLK PERFIL ... .jpg / MYCREW-SBLK.jpg (frente)
--   MY CREW 669K OPTICS PERFIL ... .jpg / ...FRENTE... .jpg
--   MY CREW MBLK P GALERIA.jpg / MY CREW MBLK F GALERIA.jpg
--   MY CREW 388 PERFIL ... .jpg / ...FRENTE... .jpg
--   medidas.webp
-- Scale: perfil 1.3 / frente 1.15 (comparación visual vs grid receta: las fotos son
-- 2:1, el anteojo se ve más chico que Opposit@1.15 → +scale para emparejar ~85% card).
-- ============================================

BEGIN;

WITH
  vulk    AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM receta), 'vulk-my-crew-receta', 'Vulk My Crew Optics',
  'Los anteojos Vulk My Crew son un modelo unisex de forma redonda/ovalada, livianos (16 g) y con varillas flexibles de G-Flex que se adaptan a tu rostro. Talle medium, ideales como primer par o para uso diario. Elegís este armazón y nuestro técnico óptico le coloca tus cristales según tu receta. Incluye estuche, franela y garantía.',
  E'El Vulk My Crew es un armazón de receta **redondo/ovalado unisex**, liviano (16 g) y versátil, pensado tanto para hombre como para mujer. El **frente y las patillas son de G-Flex** —flexible y resistente— con **bisagras metálicas de sistema flex** que dan un calce cómodo y aguantan el uso diario.\n\nMedidas: frente 137 mm · lente 49 mm de ancho × 40 mm de alto · puente 21 mm · varilla 140 mm. Talle medium, equilibrado para la mayoría de los rostros.\n\nViene con lentes demo (sin graduación). Acepta tu receta: monofocales, bifocales y progresivos.\n\nDisponible en 4 colores:\n\n• SBLK — negro brillo.\n• 669K — gris transparente.\n• MBLK — negro mate.\n• 388 — marrón transparente.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "redondo",
    "temple_material": "g-flex",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "unisex",
    "line": "urbana",
    "measurements": {"frame_width_mm": 137, "lens_width_mm": 49, "lens_height_mm": 40, "bridge_mm": 21, "temple_length_mm": 140},
    "weight_grams": 16,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Redondo unisex liviano (16 g)", "body": "Frente y patillas de G-Flex flexible con bisagras metálicas de sistema flex. Forma redonda/ovalada que combina con casi cualquier rostro, para hombre o mujer. Talle medium."},
      {"type": "tip", "position": "middle", "title": "Apto para tu graduación", "body": "Acepta lentes monofocales, bifocales y progresivos. Si tenés dudas con tu receta o querés saber si te sirve para progresivos, escribinos antes de comprar."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con foto de tu receta. Te pasamos el costo del laboratorio según tu graduación + tratamientos (antirreflex, blue light, fotocromático). Armazón + cristales en 7-10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1432179921"], "imported_at": "2026-06-11"}
  }'::jsonb,
  true, false,
  'Anteojos Vulk My Crew Unisex | Receta - Óptica Carballo',
  'Armazón Vulk My Crew unisex, liviano y versátil para tu receta. Lo armamos con tus cristales y técnico óptico. Envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = SBLK (default/primary). SKU distintos (sin colisión).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-my-crew-receta'), '125580',
   '{"frame_color":"negro-brillo","model_code":"SBLK OPTICAL"}'::jsonb,
   8310723, 3, true, 1, 'MLA1432179921', '180706732884'),
  ((SELECT id FROM public.products WHERE slug='vulk-my-crew-receta'), '125583',
   '{"frame_color":"gris-transparente","model_code":"669K OPTICAL"}'::jsonb,
   8310723, 4, true, 2, 'MLA1432179921', '180706732888'),
  ((SELECT id FROM public.products WHERE slug='vulk-my-crew-receta'), '125584',
   '{"frame_color":"negro-mate","model_code":"MBLK OPTICAL"}'::jsonb,
   8310723, 3, true, 3, 'MLA1432179921', '180706732886'),
  ((SELECT id FROM public.products WHERE slug='vulk-my-crew-receta'), '125582',
   '{"frame_color":"marron-transparente","model_code":"388 OPTICAL"}'::jsonb,
   8310723, 1, true, 4, 'MLA1432179921', '188255888407')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: SBLK perfil. medidas SIEMPRE última.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-my-crew-receta'), (SELECT id FROM public.product_variants WHERE sku='125580'),
   'vulk-my-crew/MY CREW SBLK PERFIL IMAGEN PRINCIPAL1200X589.jpg', 'Anteojos Vulk My Crew armazón de receta redondo unisex vista lateral, negro brillo', 1200, 589, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-my-crew-receta'), (SELECT id FROM public.product_variants WHERE sku='125580'),
   'vulk-my-crew/MYCREW-SBLK.jpg', 'Anteojos Vulk My Crew armazón de receta redondo unisex vista frontal, negro brillo', 1200, 589, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-my-crew-receta'), (SELECT id FROM public.product_variants WHERE sku='125583'),
   'vulk-my-crew/MY CREW 669K OPTICS PERFIL IMAGEN PRINCIPAL1200X589.jpg', 'Anteojos Vulk My Crew armazón de receta redondo unisex vista lateral, gris transparente 669K', 1200, 589, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-my-crew-receta'), (SELECT id FROM public.product_variants WHERE sku='125583'),
   'vulk-my-crew/MY CREW 669K OPTICS FRENTE IMAGEN PRINCIPAL1200X589.jpg', 'Anteojos Vulk My Crew armazón de receta redondo unisex vista frontal, gris transparente 669K', 1200, 589, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-my-crew-receta'), (SELECT id FROM public.product_variants WHERE sku='125584'),
   'vulk-my-crew/MY CREW MBLK P GALERIA.jpg', 'Anteojos Vulk My Crew armazón de receta redondo unisex vista lateral, negro mate', 900, 442, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-my-crew-receta'), (SELECT id FROM public.product_variants WHERE sku='125584'),
   'vulk-my-crew/MY CREW MBLK F GALERIA.jpg', 'Anteojos Vulk My Crew armazón de receta redondo unisex vista frontal, negro mate', 900, 442, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-my-crew-receta'), (SELECT id FROM public.product_variants WHERE sku='125582'),
   'vulk-my-crew/MY CREW 388 PERFIL IMAGEN PRINCIPAL1200X589.jpg', 'Anteojos Vulk My Crew armazón de receta redondo unisex vista lateral, marrón transparente 388', 1200, 589, 6, false),
  ((SELECT id FROM public.products WHERE slug='vulk-my-crew-receta'), (SELECT id FROM public.product_variants WHERE sku='125582'),
   'vulk-my-crew/MY CREW 388 FRENTE IMAGEN PRINCIPAL1200X589.jpg', 'Anteojos Vulk My Crew armazón de receta redondo unisex vista frontal, marrón transparente 388', 1200, 589, 7, false),
  ((SELECT id FROM public.products WHERE slug='vulk-my-crew-receta'), NULL,
   'vulk-my-crew/medidas.webp', 'Esquema técnico de medidas Vulk My Crew: frente 137mm, lente 49x40mm, puente 21mm, varilla 140mm', 1200, 589, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
