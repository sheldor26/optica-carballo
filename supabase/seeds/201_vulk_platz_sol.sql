-- ============================================
-- Seed 201: Vulk PLATZ TAN / LTWGG39 (sol, mujer, rectangular de esquinas facetadas, G-Flex), 1 variante
-- Fecha: 2026-11-10
-- ============================================
-- PUBLICACIÓN TRADICIONAL de ML (MLA417128), item SIMPLE (0 variaciones => `variation_code` NULL), verificada por API el 2026-11-10 (la creó el founder):
--   116294  TAN/LTWGG39  MLA4185096268  $96.386  stock 3  beige brillo, lente verde degradé NO polarizada
--   UP MLAU5875480892. Sin duplicado de catálogo. Garantía de fábrica 1 año.
-- DATOS DEL FOUNDER (2026-11-10): mujer; patillas anchas; bisagra plástica reforzada; UV400; categoría 2; NO polarizada, sin antirreflex; beige brillo con lente verde degradé; medidas 51-21-149; alto total 44 (se carga tal cual en lens_height_mm); ancho total 146.
--   Vulk (ficha): G-Flex en frente y patillas, policarbonato, 100% UVA y UVB, 32,3 g. Coincide en 51-21-149. No informa categoría. El peso se carga (la regla de medidas del founder no aplica al peso).
-- 🔬 Sin "flexible" ni "liviano" (G-Flex no los autoriza), sin polarizado, sin graduación (hide_prescription_faq).
-- 🎨 Color: el founder lo llama "beige brillo"; la foto oficial lo muestra caramelo/marrón claro con la cara interna de las patillas beige. Se respeta su nombre (ML quedó "TAN - Beige Brillo").
-- 🎯 SEO (seo-strategist + CSV Ubersuggest): slug `vulk-platz`; meta_title SIN "Mujer" (lo reclama Vulk Anima: "lentes de sol vulk mujer"), con "rectangulares" (320/12, nadie lo reclama en sol); "mujer" sólo en meta y copy; sin "cuadrados"; frase de vuelta sólo desde Katleen (no aplicada acá). Primaria "lentes de sol vulk" (1.300/8). `lens_treatment:[gradient]` a nivel variante (precedente seed 148).
-- ⚠️ model_code SIN "POL": `isPolarizedVariant` usa \bPOL\b y lo metería en /polarizados.
-- 📸 Fotos oficiales de Vulk (1024×1024), `pnpm placas --tipo sol --sin-vision` + `pnpm fotos:subir --slug vulk-platz`.
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-platz', 'Vulk Platz',
  'Anteojos de sol Vulk Platz para mujer: rectangulares de esquinas facetadas, con marco grueso y patillas anchas de G-Flex en beige brillo. Lente verde degradé UV400 categoría 2.',
  E'Los **lentes de sol Vulk Platz** son **anteojos de mujer rectangulares**, con las **esquinas facetadas** (cortadas en bisel), el marco grueso y las **patillas anchas**: un diseño con carácter. Frente y patillas de **G-Flex** (32,3 g), con **bisagras plásticas reforzadas**.\n\nLa lente es de policarbonato, **verde degradé**, con protección **UV400** (bloquea los rayos UVA y UVB) y **categoría 2**, pensada para el uso de todos los días. **No es polarizada**.\n\nMedidas: frente 146 mm · lente 51 mm · puente 21 mm · varilla 149 mm · alto total 44 mm.\n\nIncluye estuche, franela y garantía de 1 año contra defectos de fabricación.\n\nSi te gustan los Vulk de mujer, mirá también los [Vulk Katleen](/anteojos-de-sol/vulk/vulk-katleen). Y podés ver [todos los anteojos de sol Vulk](/anteojos-de-sol/vulk).',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "rectangular",
    "gender": "female",
    "line": "urbana",
    "hinge_system": "plastica reforzada",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 2,
    "measurements": {"frame_width_mm": 146, "lens_width_mm": 51, "lens_height_mm": 44, "bridge_mm": 21, "temple_length_mm": 149},
    "weight_grams": 32.3,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-12-10",
    "hide_prescription_faq": true,
    "callouts": [
      {"type": "info", "position": "top", "title": "Rectangular de esquinas facetadas", "body": "Marco grueso con las esquinas cortadas en bisel y patillas anchas, de G-Flex y con bisagras plásticas reforzadas."},
      {"type": "tip", "position": "middle", "title": "Lente verde degradé", "body": "La lente es de policarbonato, verde degradé, y no es polarizada. Es categoría 2, pensada para el uso de todos los días."},
      {"type": "recommendation", "position": "bottom", "title": "UV400", "body": "La lente bloquea los rayos UVA y UVB (UV400), independiente del color. Sirve para manejar de día, no de noche."}
    ]
  }'::jsonb,
  true, false,
  'Lentes de Sol Vulk Platz Rectangulares',
  'Lentes de sol Vulk Platz para mujer: rectangulares de G-Flex en beige brillo, lente verde degradé UV400 categoría 2. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variante única, item simple de ML (variation_code NULL). Precio y stock de ML (2026-11-10).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-platz'), '116294',
   '{"frame_color":"beige-brillo","lens_color":"verde-degrade","model_code":"TAN / LTWGG39","polarized":false,"lens_treatment":["gradient"]}'::jsonb,
   9638600, 3, true, 1, 'MLA4185096268', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Fotos: perfil primaria, frente, medidas SIEMPRE última (sort 99, variant_id NULL).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-platz'), (SELECT id FROM public.product_variants WHERE sku='116294'),
   'vulk-platz/perfil.jpg', 'Lentes de sol Vulk Platz para mujer, rectangulares de esquinas facetadas, vista lateral, armazón beige brillo con lente verde degradé', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-platz'), (SELECT id FROM public.product_variants WHERE sku='116294'),
   'vulk-platz/frente.jpg', 'Lentes de sol Vulk Platz para mujer, rectangulares de esquinas facetadas, vista frontal, armazón beige brillo con lente verde degradé', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-platz'), NULL,
   'vulk-platz/medidas.jpg', 'Esquema técnico de medidas Vulk Platz: lente 51mm, puente 21mm, varilla 149mm, alto total 44mm, ancho total 146mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
