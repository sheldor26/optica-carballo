-- ============================================
-- Seed 85: Rusty Peating SOL — cuadrado unisex, polarizado, 2 colores negros
-- Fecha: 2026-07-14
-- ============================================
-- Anteojo de SOL cuadrado unisex (hermano del Peating Carey receta, seed 84 — mismo
-- armazón físico, medidas y peso). Frente y patillas G-Flex ULTRA LIGHT, bisagras
-- metálicas (al callout, igual al receta). Lente policarbonato POLARIZADA 100% UVA/UVB
-- (cat 3). 18,9 g. **2 MLAs SEPARADOS** (items simples, 0 variaciones cada uno →
-- mercadolibre_variation_code = NULL, igual patrón que el propio seed 84 receta).
-- Precio/stock de la API ML + SKU del founder:
--   MBLK/S10 POL    SKU 960100 MLA1504687501 $82.127    → 8212700c stock 2 (PRIMARY +stock; negro mate)
--   SBLK/DRT03 POL  SKU 960103 MLA1440111809 $81.798,49 → 8179849c stock 1 (negro brillo, lente degradé gris)
--
-- frame_shape="cuadrado" (= al hermano receta, seed 84). frame_material + temple_material
-- g-flex. Convención SOL: lens_material policarbonato, lens_treatment ["uv400"] (SIN
-- "polarized" en el array — /polarizados se deriva del flag polarized:true de cada
-- variante en runtime), lens_category 3. 2/2 polarized:true. weight_grams 18.9 (EXACTO
-- del seed 84). gender unisex. Medidas = al receta: 143 / 52×49 / 19 / 133 mm.
--
-- HONESTIDAD: 2/2 polarizadas → SÍ se afirma "Polarizado" en copy/H2 (criterio Zinz/Terdey).
--
-- SEO (seo-strategist): name = "Rusty Peating" (SIN "cuadrado" — esa forma ya es primaria
-- de Rusty Zinz sol; Peating NO puede competir por la misma intención). Primaria real =
-- branded (`rusty peating`) + carril de COLOR de soporte (`negros cuadrados`, Peating es
-- 100% negro mate+brillo, a diferencia de Zinz que mezcla gris transparente + negro).
-- "Polarizado" se afirma en copy/H2, NO como primaria (carril de Terdey). Cross-link
-- obligatorio con Zinz/Terdey/Patien (cuadrados/wayfarer polarizados del cluster).
--
-- CROSS-LINK sol↔receta: automático por convención de slug (`rusty-peating` sin sufijo ↔
-- `rusty-peating-receta`), verificado en lib/catalog/queries.ts — sin código nuevo. Ambos
-- seeds (84 y 85) deben quedar is_active=true para que aparezca en las 2 PDPs.
--
-- 📸 FOTOS (bucket products/rusty-peating/ — SIN sufijo -sol, 5 archivos, verificadas
-- 900×442 = 2:1, idéntico al receta, HTTP 200):
--   PEATING_MBLKS10_POL.-P.jpg / PEATING_MBLKS10_POL.-F.jpg (negro mate, PRIMARY +stock)
--   PEATING_SBLKDRT03_POL.-p.jpg / PEATING_SBLKDRT03_POL.-f.jpg (negro brillo, degradé gris)
--   medidas.png (sort 99)
-- Scale 1.1 perfil / 1.0 frente (900×442 idéntico a Zinz sol y al propio receta; reverificar
-- grid /anteojos-de-sol post-deploy, regla 15).
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-peating', 'Rusty Peating',
  'Anteojos de sol Rusty Peating: cuadrados unisex en negro mate y negro brillo, ambos polarizados con 100% protección UV. G-Flex ultra liviano (18,9 g).',
  E'Los **Rusty Peating** son **anteojos de sol cuadrados, unisex**, en negro. El **frente y las patillas son de G-Flex ultra liviano** —flexible y resistente— con bisagras metálicas, para un calce cómodo y durable. La **lente es de policarbonato, polarizada**, con **100% protección UV (UV400, categoría 3)** — corta el reflejo del agua, la nieve y el asfalto. Livianos: solo **18,9 g**.\n\nMedidas: frente 143 mm · lente 52 mm de ancho × 49 mm de alto · puente 19 mm · varilla 133 mm.\n\nDisponible en 2 colores:\n\n• MBLK/S10 — negro mate.\n• SBLK/DRT03 — negro brillo, lente degradé gris.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante. ¿Lo querés con tu graduación? Mirá la versión de receta del Rusty Peating.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "cuadrado",
    "temple_material": "g-flex",
    "hinge_system": "metalica",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "weight_grams": 18.9,
    "measurements": {"frame_width_mm": 143, "lens_width_mm": 52, "lens_height_mm": 49, "bridge_mm": 19, "temple_length_mm": 133},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado unisex polarizado, ultra liviano", "body": "Diseño cuadrado unisex en negro, liviano (18,9 g). Frente y patillas de G-Flex con bisagras metálicas. Lente de policarbonato polarizada con 100% protección UV (UV400, categoría 3)."},
      {"type": "tip", "position": "middle", "title": "Lente polarizada", "body": "La lente polarizada corta el reflejo del agua, la nieve y el asfalto — ideal para manejar y para actividades al aire libre."},
      {"type": "recommendation", "position": "bottom", "title": "¿Lo necesitás con graduación?", "body": "Este modelo también está como armazón de receta. Si dudás cuál te conviene, escribinos por WhatsApp y te asesoramos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1504687501", "MLA1440111809"], "imported_at": "2026-07-14"}
  }'::jsonb,
  true, false,
  'Rusty Peating | Anteojos de Sol - Óptica Carballo',
  'Anteojos de sol Rusty Peating: cuadrados unisex en negro mate y brillo, ambos polarizados con 100% protección UV. G-Flex ultra liviano. Envíos a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = MBLK/S10 (primary, +stock). 2 MLAs simples → variation_code = NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-peating'), '960100',
   '{"frame_color":"negro-mate","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   8212700, 2, true, 1, 'MLA1504687501', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-peating'), '960103',
   '{"frame_color":"negro-brillo","model_code":"SBLK/DRT03 POL","polarized":true}'::jsonb,
   8179849, 1, true, 2, 'MLA1440111809', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = MBLK/S10 perfil (+stock). medidas SIEMPRE última (sort 99).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-peating'), (SELECT id FROM public.product_variants WHERE sku='960100'),
   'rusty-peating/PEATING_MBLKS10_POL.-P.jpg', 'Anteojos de sol Rusty Peating cuadrados unisex vista lateral, negro mate lente polarizada', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-peating'), (SELECT id FROM public.product_variants WHERE sku='960100'),
   'rusty-peating/PEATING_MBLKS10_POL.-F.jpg', 'Anteojos de sol Rusty Peating cuadrados unisex vista frontal, negro mate lente polarizada', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-peating'), (SELECT id FROM public.product_variants WHERE sku='960103'),
   'rusty-peating/PEATING_SBLKDRT03_POL.-p.jpg', 'Anteojos de sol Rusty Peating cuadrados unisex vista lateral, negro brillo lente degradé gris polarizada', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-peating'), (SELECT id FROM public.product_variants WHERE sku='960103'),
   'rusty-peating/PEATING_SBLKDRT03_POL.-f.jpg', 'Anteojos de sol Rusty Peating cuadrados unisex vista frontal, negro brillo lente degradé gris polarizada', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-peating'), NULL,
   'rusty-peating/medidas.png', 'Esquema técnico de medidas Rusty Peating: frente 143mm, lente 52x49mm, puente 19mm, varilla 133mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
