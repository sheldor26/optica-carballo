-- ============================================
-- Seed 40: Rusty Bruk (sol) — cuadrado G-Flex
-- Fecha: 2026-06-02
-- ============================================
-- Anteojo de sol cuadrado Rusty Bruk, armazón G-Flex, bisagras de plástico
-- reforzado CON TORNILLOS (dato honesto — no son bisagras ocultas). Lente
-- policarbonato categoría 3. 3 MLAs separados. 2 de 3 polarizadas → producto
-- queda con lens_treatment ["uv400"] (convención: "polarized" a nivel producto
-- solo si TODAS las variantes lo son; acá la Revo Green no es polarizada).
--
-- Stock = el de ML (regla founder: siempre cargar todas, aunque estén en 0;
-- se sincroniza solo cuando repone en ML):
--
--   SKU 119568 — MBLK / S10 POL    negro mate + gris oscuro pol.  MLA1382448015. $96.447,66, stock 2 (default).
--   SKU 119564 — MBLK / REVO GREEN negro mate + verde espejado.   MLA1940506240. $91.232,61, stock 1. NO POLARIZADA (revo).
--   SKU 119561 — SBLK / S10 POL    negro brillo + gris oscuro pol. MLA1382548169. $96.835, stock 0 (pausado en ML).
--
-- Medidas: 141 / 50x48 / 18 / 145 mm. Peso: desconocido (no vino en ML).
--
-- 📸 FOTOS: SOLO PERFIL (1 por variante, sin frente → sin hover swap). Nombres
-- reales del founder (con espacios, sin '&'), bucket products/rusty-bruk/:
--   BRUK MBLK-S10-perfil.jpg        (MBLK/S10 — primary del modelo)
--   bruk-perfil-revo green.jpg      (Revo Green)
--   BRUK SBLK-POL-S10-perfil.jpg    (SBLK/S10)
--   medidas.jpg                     (esquema técnico)
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (
  brand_id, category_id, slug, name,
  short_description, description, attributes,
  is_active, is_featured, meta_title, meta_description
)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol),
  'rusty-bruk', 'Rusty Bruk',
  'Anteojos de sol cuadrados Rusty Bruk con armazón G-Flex y lente de policarbonato categoría 3. 2 de 3 variantes polarizadas. Diseño moderno y versátil.',
  E'Los Rusty Bruk son anteojos de sol cuadrados de armazón G-Flex, un termoplástico flexible patentado por Rusty que resiste torsiones y golpes mejor que un acetato tradicional. Diseño moderno y versátil para uso urbano diario.\n\nLas bisagras son de plástico reforzado con tornillos (no ocultas), pensadas para aguantar el uso cotidiano. Las lentes son de policarbonato, un material liviano y resistente a impactos, con filtro categoría 3 y protección UV400 (100% UVA y UVB).\n\nDisponible en 3 variantes:\n\n• MBLK / S10 POL (SKU 119568): negro mate con lente gris oscuro polarizada. Las lentes polarizadas eliminan los reflejos del asfalto y el agua — ideal para manejar de día.\n\n• MBLK / REVO GREEN (SKU 119564): negro mate con lente verde espejada (revo). La opción más llamativa; es espejada con antirreflex, no polarizada — elección de estilo.\n\n• SBLK / S10 POL (SKU 119561): negro brillo con lente gris oscuro polarizada. La versión más sobria, también polarizada.\n\nIncluye estuche y franela de microfibra. Garantía oficial 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "cuadrado",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "gender": "unisex",
    "line": "urbana",
    "interchangeable_lenses": false,
    "prescription_adapter": false,
    "measurements": {
      "frame_width_mm": 141,
      "lens_width_mm": 50,
      "lens_height_mm": 48,
      "bridge_mm": 18,
      "temple_length_mm": 145
    },
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "recommendation", "position": "middle", "title": "¿Polarizado o espejado?", "body": "Si lo querés para manejar o la playa, elegí una variante polarizada (MBLK/S10 o SBLK/S10): eliminan el reflejo del asfalto y el agua. Si buscás impacto visual, la MBLK/Revo Green espejada es la más llamativa (es espejada con antirreflex, no polarizada)."},
      {"type": "tip", "position": "bottom", "title": "Para que duren", "body": "Guardalos en el estuche cuando no los usás y limpiá solo con la franela de microfibra. Si vas al mar o la pileta, enjuagalos con agua dulce antes de guardarlos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1382448015", "MLA1940506240", "MLA1382548169"], "imported_at": "2026-06-02"}
  }'::jsonb,
  true, false,
  'Rusty Bruk Anteojos de Sol Cuadrados G-Flex Polarizados | Óptica Carballo',
  'Anteojos Rusty Bruk cuadrados: armazón G-Flex, lente policarbonato categoría 3, UV400. 2 de 3 variantes polarizadas. Stock real y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-bruk'), '119568',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK / S10 POL","polarized":true}'::jsonb,
   9644766, 2, true, 1, 'MLA1382448015', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-bruk'), '119564',
   '{"frame_color":"negro-mate","lens_color":"verde-espejado","model_code":"MBLK / REVO GREEN","polarized":false}'::jsonb,
   9123261, 1, true, 2, 'MLA1940506240', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-bruk'), '119561',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK / S10 POL","polarized":true}'::jsonb,
   9683500, 0, true, 3, 'MLA1382548169', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes: solo perfil (1 por variante) + medidas. Primary: MBLK/S10 perfil.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-bruk'), (SELECT id FROM public.product_variants WHERE sku='119568'),
   'rusty-bruk/BRUK MBLK-S10-perfil.jpg', 'Rusty Bruk cuadrado vista lateral 3/4, armazón negro mate G-Flex con lente gris oscuro polarizada', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-bruk'), (SELECT id FROM public.product_variants WHERE sku='119564'),
   'rusty-bruk/bruk-perfil-revo green.jpg', 'Rusty Bruk cuadrado vista lateral 3/4, armazón negro mate con lente verde espejada revo', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bruk'), (SELECT id FROM public.product_variants WHERE sku='119561'),
   'rusty-bruk/BRUK SBLK-POL-S10-perfil.jpg', 'Rusty Bruk cuadrado vista lateral 3/4, armazón negro brillo G-Flex con lente gris oscuro polarizada', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bruk'), NULL,
   'rusty-bruk/medidas.jpg', 'Esquema técnico de medidas Rusty Bruk: frente 141mm, lente 50x48mm, puente 18mm, varilla 145mm', 1500, 1500, 3, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
