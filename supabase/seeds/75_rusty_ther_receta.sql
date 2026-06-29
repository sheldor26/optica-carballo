-- ============================================
-- Seed 75: Rusty Ther Optics RECETA — REDONDO de METAL unisex, 3 colores mate
-- Fecha: 2026-06-15
-- ============================================
-- Armazón de RECETA redondo unisex de METAL. Frente metal; patillas de metal con terminales de
-- acetato y bisagra de acero inoxidable con sistema flex. Lentes DEMO. Liviano 14,5g. Adapta
-- monofocal/bifocal/multifocal. 3 MLAs SEPARADOS (items simples → variation_code NULL). El link
-- del founder era CATÁLOGO ML (MLAU4174267154, 404 en /items) → MLA reales del seller por API
-- (/users/81654493/items/search?q=ther). Precio/stock/SKU verificados:
--   M020 Cobre Mate    SKU 128172 MLA1858781819 $74.990 stock 122 (PRIMARY, hero neutro + más stock)
--   M036 Violeta Mate  SKU 128171 MLA1858781821 $74.990 stock 2
--   M033 Bordó Mate    SKU 128173 MLA1858820529 $74.990 stock 2
--
-- CONVENCIÓN RECETA (seed 72): SOLO lens_compatibility (["monofocal","bifocal","progresivo",
-- "multifocal"] — founder dijo mono/bi/multifocal; progresivo=multifocal comercial); SIN
-- lens_material/treatment/category/polarized; name "Optics"; model_code " OPTICAL".
-- frame_material "metal" + temple_material "metal" (terminal de acetato + bisagra acero inox flex
-- → al copy/callout, no a atributo). frame_shape "round". gender unisex. weight_grams 14.5 (lo da).
--
-- Medidas (de la FOTO): frente 135 / lente 49x47 / puente 23 / varilla 145 mm.
--
-- SEO por seo-strategist: primaria `anteojos redondos` (880/12) + carril propio `anteojos/lentes
-- de metal` (210/260). **Anti-canibalización vs Rusty Misty receta (también redondo unisex)**:
-- Misty = ACETATO + talle chico; Ther = METAL + liviano → cada ficha pelea atributo distinto.
-- Cross-link Misty↔Ther recomendado. `anteojos recetados` solo en copy (lo lideran Woxi/Patien).
--
-- 📸 FOTOS: ya en bucket rusty-ther/ (900×442 panorámicas). 3 var × (perfil+frente) + medidas.png
-- = 7. Grid primary = PERFIL de M020 (THER-M020-P.jpg). Scale 1.0 (panorámica 900×442 = más ancha
-- que el card → llena por ancho, como Raven/Bennie). medidas.png en 1.0 (no grid).
-- ============================================

BEGIN;

WITH
  rusty  AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-ther-receta', 'Rusty Ther Optics',
  'Armazón de receta Rusty Ther: redondo unisex de metal, liviano (14,5g). Patillas de metal con terminales de acetato y bisagra de acero inoxidable con sistema flex. Viene con lentes demo: apto para monofocal, bifocal y multifocal.',
  E'El **Rusty Ther Optics** es un **armazón de receta redondo unisex de metal**, **liviano (14,5 g)**. Frente de metal y **patillas de metal con terminales de acetato** y **bisagra de acero inoxidable con sistema flex** para mejor ajuste.\n\nViene con **lentes demo (sin graduación)**: el armazón lo comprás sin receta, y cuando le ponés tus cristales graduados nos pasás la receta para armarlo. Es **apto para cristales monofocales, bifocales y multifocales/progresivos**.\n\nMedidas: frente 135 mm · lente 49 mm de ancho × 47 mm de alto · puente 23 mm · varilla 145 mm.\n\nDisponible en 3 versiones:\n\n• M020 — cobre mate.\n• M036 — violeta mate.\n• M033 — bordó mate.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante. El precio es del armazón; los cristales graduados se cotizan según tu receta.',
  '{
    "frame_material": "metal",
    "frame_shape": "round",
    "temple_material": "metal",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "unisex",
    "weight_grams": 14.5,
    "measurements": {"frame_width_mm": 135, "lens_width_mm": 49, "lens_height_mm": 47, "bridge_mm": 23, "temple_length_mm": 145},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Redondo de metal ultraliviano", "body": "Armazón de receta redondo unisex de metal, solo 14,5 g. Patillas de metal con terminales de acetato y bisagra de acero inoxidable con sistema flex para mejor ajuste."},
      {"type": "tip", "position": "middle", "title": "Viene con lentes demo", "body": "El armazón se compra sin receta (trae lentes demo, sin graduación). Cuando le ponés tus cristales graduados, nos pasás la receta para armarlo. Apto para monofocal, bifocal y multifocal/progresivo."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con la graduación?", "body": "Si querés cotizar tus cristales o no sabés si te sirve, escribinos por WhatsApp y te asesoramos. El precio mostrado es del armazón."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1858781819", "MLA1858781821", "MLA1858820529"], "imported_at": "2026-06-15"}
  }'::jsonb,
  true, false,
  'Armazón de Receta Rusty Ther Redondo Metal | Óptica Carballo',
  'Armazón de receta Rusty Ther: redondo unisex de metal, liviano (14,5 g), en violeta, cobre y bordó. Apto monofocal, bifocal y multifocal. Envíos a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = M020 Cobre (primary). 3 MLAs simples → variation_code NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-ther-receta'), '128172',
   '{"frame_color":"cobre-mate","model_code":"M020 OPTICAL"}'::jsonb,
   7499000, 122, true, 1, 'MLA1858781819', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-ther-receta'), '128171',
   '{"frame_color":"violeta-mate","model_code":"M036 OPTICAL"}'::jsonb,
   7499000, 2, true, 2, 'MLA1858781821', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-ther-receta'), '128173',
   '{"frame_color":"bordo-mate","model_code":"M033 OPTICAL"}'::jsonb,
   7499000, 2, true, 3, 'MLA1858820529', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Por variante: perfil (grid) + frente. Primary = M020 perfil. medidas última.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-ther-receta'), (SELECT id FROM public.product_variants WHERE sku='128172'),
   'rusty-ther/THER-M020-P.jpg', 'Armazón de receta Rusty Ther redondo de metal unisex vista lateral, cobre mate', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-ther-receta'), (SELECT id FROM public.product_variants WHERE sku='128172'),
   'rusty-ther/THER-M020-F_GALERIA.jpg', 'Armazón de receta Rusty Ther redondo de metal unisex vista frontal, cobre mate', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-ther-receta'), (SELECT id FROM public.product_variants WHERE sku='128171'),
   'rusty-ther/THER-M036-P.jpg', 'Armazón de receta Rusty Ther redondo de metal unisex vista lateral, violeta mate', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-ther-receta'), (SELECT id FROM public.product_variants WHERE sku='128171'),
   'rusty-ther/THER-M036-F_GALERIA.jpg', 'Armazón de receta Rusty Ther redondo de metal unisex vista frontal, violeta mate', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-ther-receta'), (SELECT id FROM public.product_variants WHERE sku='128173'),
   'rusty-ther/THER-M033-P.jpg', 'Armazón de receta Rusty Ther redondo de metal unisex vista lateral, bordó mate', 900, 442, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-ther-receta'), (SELECT id FROM public.product_variants WHERE sku='128173'),
   'rusty-ther/THER-M033-F_GALERIA.jpg', 'Armazón de receta Rusty Ther redondo de metal unisex vista frontal, bordó mate', 900, 442, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-ther-receta'), NULL,
   'rusty-ther/medidas.png', 'Esquema técnico de medidas Rusty Ther: frente 135mm, lente 49x47mm, puente 23mm, varilla 145mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
