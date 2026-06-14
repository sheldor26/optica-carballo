-- ============================================
-- Seed 70: Vulk Raven SOL — WAYFARER unisex, G-Flex, 3 colores (2 pol + 1 revo espejada)
-- Fecha: 2026-06-14
-- ============================================
-- Anteojos de SOL wayfarer unisex (impronta "moda", NO deportivo → sin line). Frente y
-- patillas G-Flex con bisagras plásticas reforzadas. Lentes policarbonato con revo coating,
-- 100% UV. 3 MLAs SEPARADOS (items simples → variation_code NULL). Precio/stock de la API ML
-- (scripts/ml-item.ts):
--   SBLK/S10 POL    SKU 109142 MLA1543147968 $98.948,61 stock 5 (PRIMARY, negro brillo, gris, POLARIZADO)
--   MBLK/S10 POL    SKU 109148 MLA1543083906 $98.948,61 stock 2 (negro mate, gris, POLARIZADO)
--   MBLK/REVO BLUE  SKU 109149 MLA1543122552 $94.751,47 stock 1 (negro mate, espejada azul revo, NO pol, AR cara interna)
--
-- frame_shape="wayfarer" (foto de medidas = silueta wayfarer; valor canónico, mapea a
-- /anteojos-de-sol/wayfarer). 2 polarized:true → /polarizados. La REVO: polarized:false +
-- lens_color "espejado-azul" (el espejado va en lens_color, NUNCA en lens_treatment — no es
-- valor del enum real que leen los filtros; el AR interno se menciona en descripción/callout).
-- Default sol: lens_material policarbonato / lens_treatment ["uv400"] / lens_category 3.
-- weight_grams=26 (ML lo da → NO va a la lista de pesos pendientes).
--
-- Medidas (de la FOTO, no de la descripción ML): frente 140 / lente 55x46 / puente 15 / varilla 142 mm.
--
-- HONESTIDAD (BUSINESS_POLICIES §6/§8): solo 2 de 3 son polarizadas → el meta_title/H1 NO
-- afirma "polarizados" del modelo entero (destaca "unisex", 100% verdadero). Mismo criterio
-- que Rusty Play/Patien (2/4).
--
-- 📸 FOTOS: CARGA ABIERTA — el bucket vulk-raven/ está VACÍO al momento del seed (founder pasó
-- los nombres, falta subirlas). Cada variante: perfil + frente (2 c/u) + medidas.webp = 7.
-- Grid primary = PERFIL de SBLK/S10 (regla de grid). ⚠️ nombres con espacios/typo del founder
-- copiados EXACTO: "RAVEN-MBLK-R blue PERFIL GALERIA.jpg" y "RAVEN-MBLK-R blue FRENTE GALERIA .jpg"
-- (espacio antes de .jpg). width/height 900x442 PROVISIONAL (no se pudieron medir, fotos no subidas).
-- Scale override inicial perfil 1.15 / frente 1.0 (baseline Vulk wayfarer); reverificar vs grid
-- cuando el founder suba las fotos (regla 15).
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-raven', 'Vulk Raven',
  'Lentes de sol Vulk Raven: wayfarer unisex de armazón G-Flex liviano con lentes de policarbonato UV400 categoría 3. 2 de 3 versiones polarizadas. Diseño clásico con revo coating.',
  E'Los **Vulk Raven** son **lentes de sol wayfarer unisex**: el clásico de siempre con la impronta moderna de Vulk. Frente y patillas de **G-Flex** liviano con bisagras plásticas reforzadas, y **lentes de policarbonato con protección 100% UV (UV400, categoría 3)** y revo coating.\n\nMedidas: frente 140 mm · lente 55 mm de ancho × 46 mm de alto · puente 15 mm · varilla 142 mm. Peso 26 g, talle medium.\n\nDisponible en 3 versiones:\n\n• SBLK/S10 POL — negro brillo, lente gris **polarizada**.\n• MBLK/S10 POL — negro mate, lente gris **polarizada**.\n• MBLK/Revo Blue — negro mate, lente espejada azul con antirreflejo (AR) en la cara interna (no polarizada).\n\nLas versiones polarizadas cortan el reflejo del agua, la nieve y el asfalto. Incluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "wayfarer",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "weight_grams": 26,
    "measurements": {"frame_width_mm": 140, "lens_width_mm": 55, "lens_height_mm": 46, "bridge_mm": 15, "temple_length_mm": 142},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Wayfarer unisex liviano", "body": "El clásico wayfarer en G-Flex liviano con bisagras plásticas reforzadas. Lentes de policarbonato con 100% protección UV (UV400, categoría 3) y revo coating."},
      {"type": "tip", "position": "middle", "title": "Versiones polarizadas", "body": "Las variantes S10 POL tienen lente polarizada: cortan el reflejo del agua, la nieve y el asfalto. La Revo Blue es espejada azul con antirreflejo en la cara interna (no polarizada)."},
      {"type": "recommendation", "position": "bottom", "title": "100% protección UV", "body": "Las 3 versiones bloquean el 100% de los rayos UV (UV400). Si dudás cuál te conviene, escribinos por WhatsApp y te asesoramos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1543147968", "MLA1543083906", "MLA1543122552"], "imported_at": "2026-06-14"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Vulk Raven Unisex | Óptica Carballo',
  'Lentes de sol Vulk Raven unisex, modelo wayfarer con filtro UV400. Envíos a todo el país y 30 años de experiencia en óptica. Comprá con asesoramiento real.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = SBLK/S10 (primary, +stock 5). 3 MLAs simples → variation_code NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-raven'), '109142',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10 POL","polarized":true}'::jsonb,
   9894861, 5, true, 1, 'MLA1543147968', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-raven'), '109148',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   9894861, 2, true, 2, 'MLA1543083906', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-raven'), '109149',
   '{"frame_color":"negro-mate","lens_color":"espejado-azul","model_code":"MBLK/REVO BLUE","polarized":false}'::jsonb,
   9475147, 1, true, 3, 'MLA1543122552', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Por variante: perfil (grid) + frente. Primary = SBLK/S10 perfil. medidas última.
-- ⚠️ paths con espacios/typo copiados EXACTO del bucket del founder.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-raven'), (SELECT id FROM public.product_variants WHERE sku='109142'),
   'vulk-raven/RAVEN SBLK P.jpg', 'Lentes de sol Vulk Raven wayfarer unisex vista lateral, negro brillo lente polarizada gris', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-raven'), (SELECT id FROM public.product_variants WHERE sku='109142'),
   'vulk-raven/RAVEN SBLK F.jpg', 'Lentes de sol Vulk Raven wayfarer unisex vista frontal, negro brillo lente polarizada gris', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-raven'), (SELECT id FROM public.product_variants WHERE sku='109148'),
   'vulk-raven/RAVEN MBLK P.jpg', 'Lentes de sol Vulk Raven wayfarer unisex vista lateral, negro mate lente polarizada gris', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-raven'), (SELECT id FROM public.product_variants WHERE sku='109148'),
   'vulk-raven/RAVEN MBLK F.jpg', 'Lentes de sol Vulk Raven wayfarer unisex vista frontal, negro mate lente polarizada gris', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-raven'), (SELECT id FROM public.product_variants WHERE sku='109149'),
   'vulk-raven/RAVEN-MBLK-R blue PERFIL GALERIA.jpg', 'Lentes de sol Vulk Raven wayfarer unisex vista lateral, negro mate lente espejada azul revo', 900, 442, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-raven'), (SELECT id FROM public.product_variants WHERE sku='109149'),
   'vulk-raven/RAVEN-MBLK-R blue FRENTE GALERIA .jpg', 'Lentes de sol Vulk Raven wayfarer unisex vista frontal, negro mate lente espejada azul revo', 900, 442, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-raven'), NULL,
   'vulk-raven/medidas.webp', 'Esquema técnico de medidas Vulk Raven: frente 140mm, lente 55x46mm, puente 15mm, varilla 142mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
