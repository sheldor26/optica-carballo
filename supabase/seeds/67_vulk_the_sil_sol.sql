-- ============================================
-- Seed 67: Vulk The Sil SOL — cuadrado unisex, Grilamid (TR-90), 3 colores (todos polarizados)
-- Fecha: 2026-06-13
-- ============================================
-- Anteojos de SOL CUADRADOS unisex, talle Large. Frente y patillas de Grilamid
-- (TR-90 — el enum del schema usa "tr-90"; "Grilamid" se nombra en copy/callout).
-- Bisagras plásticas reforzadas (al callout). Lentes POLARIZADAS, policarbonato,
-- cat 3, 100% UV. LAS 3 VARIANTES POLARIZADAS (polarized:true → /polarizados).
-- 3 MLAs SEPARADOS (items simples → variation_code NULL). Precio/stock de la API ML
-- (scripts/ml-item.ts):
--   SBLK/S10 POL  SKU 128303 MLA1391852396 $81.064,44 stock 25 (PRIMARY, +stock, negro brillo, gris)
--   MBLK/S10 POL  SKU 128301 MLA1532396744 $81.064,44 stock 18 (negro mate, gris)
--   MBLK/G15 POL  SKU 128302 MLA1398498685 $81.064,44 stock 17 (negro mate, lente verde G15)
--
-- Default global SOL (founder): cat 3 + policarbonato + 100% UV (UVA/UVB) salvo aclaración.
-- frame_shape="square" (cuadrado; sin ruta dedicada, como Tour 81). gender="unisex".
-- weight_grams 28 (founder lo dio). Medidas: 144 / 55x51 / 20 / 145 mm (de la foto).
--
-- 📸 FOTOS (bucket products/vulk-the-sil/, 7 en storage, 900×442; ⚠️ DOS sets por color:
-- "THESIL-...-" = PERFIL, "THE SIL-..." (con espacio) = FRENTE, verificado visualmente.
-- OJO G15 (founder renombró 2026-06-13, verificado visual): perfil = "THE SIL-MBLK-G15-POL P.jpg"
-- (con espacio y " P"); frente = "THESIL-MBLK-G15-POL.jpg". Los S10 sí siguen THESIL-=perfil /
-- THE SIL-=frente con "-POL-" final). Primaria = perfil SBLK. Cada variante con fotos propias
-- → NO CCCP. Scale perfil 1.15 / frente 1.0 (encuadre 900×442 como Terdey/Play).
-- medidas.png en 1.0 (no grid).
-- ============================================

BEGIN;

WITH
  vulk    AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol     AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-the-sil', 'Vulk The Sil',
  'Lentes de sol Vulk The Sil: cuadrados, polarizados y con protección UV400 en sus 3 variantes. Armazón de Grilamid resistente, lente de policarbonato categoría 3, talle large. Diseño unisex que filtra reflejos. Incluye estuche, franela y garantía oficial.',
  E'Los **Vulk The Sil** son anteojos de sol **cuadrados unisex**, talle large, con un diseño de carácter. Frente y patillas de **Grilamid (TR-90)** —resistente— con **bisagras plásticas reforzadas**. **Lentes polarizadas de policarbonato con protección UV400 (categoría 3)**: las 3 versiones son polarizadas, así que cortan el reflejo del agua, la nieve y el asfalto, y descansan la vista al manejar o al aire libre.\n\nMedidas: frente 144 mm · lente 55 mm de ancho × 51 mm de alto · puente 20 mm · varilla 145 mm. Peso 28 g.\n\nDisponible en 3 versiones:\n\n• SBLK/S10 POL — negro brillo, lente gris polarizada.\n• MBLK/S10 POL — negro mate, lente gris polarizada.\n• MBLK/G15 POL — negro mate, lente verde G15 polarizada.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "tr-90",
    "frame_shape": "cuadrado",
    "temple_material": "tr-90",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "line": "urbana",
    "measurements": {"frame_width_mm": 144, "lens_width_mm": 55, "lens_height_mm": 51, "bridge_mm": 20, "temple_length_mm": 145},
    "weight_grams": 28,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado unisex en Grilamid", "body": "Frente y patillas de Grilamid (TR-90) ultraliviano y resistente, con bisagras plásticas reforzadas. Forma cuadrada talle large, lentes de policarbonato UV400 categoría 3."},
      {"type": "tip", "position": "middle", "title": "Las 3 versiones polarizadas", "body": "Todas las variantes tienen lente polarizada: cortan el reflejo del agua, la nieve y el asfalto, y descansan la vista al manejar o al aire libre. La G15 suma lente verde clásica."},
      {"type": "recommendation", "position": "bottom", "title": "100% protección UV", "body": "Todas las versiones bloquean el 100% de los rayos UV (UV400). Si dudás cuál te conviene, escribinos por WhatsApp y te asesoramos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1391852396", "MLA1532396744", "MLA1398498685"], "imported_at": "2026-06-13"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Vulk The Sil Polarizados | Óptica Carballo',
  'Lentes de sol Vulk The Sil cuadrados y polarizados, UV400. Unisex, 100% originales. Envíos a toda Argentina. Comprá con asesoramiento técnico.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = SBLK/S10 POL (primary, +stock). 3 MLAs simples → variation_code NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-the-sil'), '128303',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10 POL","polarized":true}'::jsonb,
   8106444, 25, true, 1, 'MLA1391852396', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-the-sil'), '128301',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   8106444, 18, true, 2, 'MLA1532396744', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-the-sil'), '128302',
   '{"frame_color":"negro-mate","lens_color":"verde-g15","model_code":"MBLK/G15 POL","polarized":true}'::jsonb,
   8106444, 17, true, 3, 'MLA1398498685', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = SBLK perfil. medidas SIEMPRE última.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-the-sil'), (SELECT id FROM public.product_variants WHERE sku='128303'),
   'vulk-the-sil/THESIL-SBLK-S10-POL-.jpg', 'Anteojos de sol Vulk The Sil cuadrados unisex vista lateral, negro brillo lente polarizada gris', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-the-sil'), (SELECT id FROM public.product_variants WHERE sku='128303'),
   'vulk-the-sil/THE SIL-SBLK-S10-POL.jpg', 'Anteojos de sol Vulk The Sil cuadrados unisex vista frontal, negro brillo lente polarizada gris', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-sil'), (SELECT id FROM public.product_variants WHERE sku='128301'),
   'vulk-the-sil/THESIL-MBLK-S10-POL-.jpg', 'Anteojos de sol Vulk The Sil cuadrados unisex vista lateral, negro mate lente polarizada gris', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-sil'), (SELECT id FROM public.product_variants WHERE sku='128301'),
   'vulk-the-sil/THE SIL-MBLK-S10-POL.jpg', 'Anteojos de sol Vulk The Sil cuadrados unisex vista frontal, negro mate lente polarizada gris', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-sil'), (SELECT id FROM public.product_variants WHERE sku='128302'),
   'vulk-the-sil/THE SIL-MBLK-G15-POL P.jpg', 'Anteojos de sol Vulk The Sil cuadrados unisex vista lateral, negro mate lente polarizada verde G15', 900, 442, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-sil'), (SELECT id FROM public.product_variants WHERE sku='128302'),
   'vulk-the-sil/THESIL-MBLK-G15-POL.jpg', 'Anteojos de sol Vulk The Sil cuadrados unisex vista frontal, negro mate lente polarizada verde G15', 900, 442, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-sil'), NULL,
   'vulk-the-sil/medidas.png', 'Esquema técnico de medidas Vulk The Sil: frente 144mm, lente 55x51mm, puente 20mm, varilla 145mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
