-- ============================================
-- Seed 84: Rusty Peating Optics RECETA (armazón óptico) — cuadrado unisex, carey, G-Flex
-- Fecha: 2026-07-14
-- ============================================
-- Armazón de receta CUADRADO UNISEX en carey, marco liviano (18,9g). Frente y patillas
-- de G-Flex, bisagras metálicas (al callout). Lentes demo. Categoría anteojos-de-receta.
-- Convención receta: SOLO lens_compatibility (SIN lens_material/treatment/category/
-- polarized/uv — viene con lente demo). Molde: 78_rusty_zinz_receta (gemelo cuadrado
-- unisex G-Flex) + hinge_system como campo (patrón 59_rusty_rcy_02_receta).
--
-- 2 MLAs SEPARADOS (items simples → mercadolibre_variation_code = NULL; reconcilia por
-- mercadolibre_item_id). Precio/stock de la API ML + SKU pasados por el founder. Ambos
-- $79.790 → 7979000c, stock 2 (total 4):
--   SDEMI carey brillo SKU 129251 MLA3604846462 (PRIMARY)
--   MDEMI carey mate   SKU 129254 MLA3604846464
--
-- ⚠️ NO mencionar bluecut / filtro de luz azul en NINGÚN campo visible (criterio general
-- de receta del founder; mismo patrón que Xold/Zinz/Invig/Peating hermanos).
--
-- Peso 18,9g. Medidas: 143 / 52×49 / 19 / 133 mm (medidas.png). Bisagras metálicas →
-- hinge_system "metalica" (campo) + reforzado en callout.
-- SKUs del founder únicos (129251/129254) → sin sufijo.
--
-- SEO (seo-strategist): primaria CAREY `anteojos carey` (390/dif 8) — carril LIBRE en el
-- cluster de cuadrados receta (Zinz=forma neutra unisex, Spell=hombre, Katleen=mujer,
-- Strewn=transparente). Peating NO usa `anteojos cuadrados` como primaria (es de Zinz) —
-- solo copy/H2. name = "Rusty Peating Carey" (no "Receta": la categoría ya renderiza
-- "Anteojos de Receta" en el title). Cross-link obligatorio Peating↔Zinz↔Spell.
--
-- CROSS-LINK sol↔receta: NO existe Peating de SOL cargado (hay varios MLAs de sol en ML,
-- polarizados, pero sin seed). Si se carga el sol como slug `rusty-peating`, engancha solo.
--
-- 📸 FOTOS (bucket products/rusty-peating-receta/, 5, verificadas 900×442 = 2:1, naming
-- inconsistente respetado tal cual — SDEMI usa "_p"/"_frente", MDEMI usa "_OPTICAL_perfil"):
--   PEATING_SDEMI_p.jpg / PEATING_SDEMI_frente.jpg (carey brillo, PRIMARY)
--   PEATING_MDEMI_OPTICAL_perfil.jpg / PEATING_MDEMI_OPTICAL_frente.jpg (carey mate)
--   medidas.png (sort 99)
-- Scale 1.1 perfil / 1.0 frente (900×442 idéntico a Zinz; reverificar grid, regla 15).
-- ============================================

BEGIN;

WITH
  rusty   AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-peating-receta', 'Rusty Peating Carey',
  'Anteojos recetados Rusty Peating: armazón cuadrado en carey, unisex y liviano (18,9 g), con frente y patillas de G-Flex y bisagras metálicas. Comprás el armazón (viene con lentes demo, sin aumento) y le sumás los cristales según tu receta; el precio publicado es del armazón, los cristales se cotizan aparte.',
  E'El **Rusty Peating Carey** es un armazón de receta **cuadrado en carey**, **unisex** y liviano (18,9 g). Frente y patillas de **G-Flex** —flexible y resistente— con **bisagras metálicas** para un calce cómodo y durable.\n\nMedidas: frente 143 mm · lente 52 mm de ancho × 49 mm de alto · puente 19 mm · varilla 133 mm.\n\nViene con lentes demo (sin graduación). Sumale tus cristales con receta: monofocales, bifocales, progresivos o multifocales.\n\nDisponible en 2 tonos de carey:\n\n• SDEMI — carey brillo.\n• MDEMI — carey mate.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "cuadrado",
    "temple_material": "g-flex",
    "hinge_system": "metalica",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "unisex",
    "line": "urbana",
    "measurements": {"frame_width_mm": 143, "lens_width_mm": 52, "lens_height_mm": 49, "bridge_mm": 19, "temple_length_mm": 133},
    "weight_grams": 18.9,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado en carey, unisex y liviano (18,9 g)", "body": "Frente y patillas de G-Flex flexible con bisagras metálicas. Forma cuadrada, para hombre o mujer, en dos tonos de carey."},
      {"type": "tip", "position": "middle", "title": "Apto para tu graduación", "body": "Acepta lentes monofocales, bifocales, progresivos y multifocales. Alto de lente de 49 mm — cómodo para progresivos. Si tenés dudas con tu receta, escribinos antes de comprar."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con foto de tu receta. Te pasamos el costo del laboratorio según tu graduación + tratamientos (antirreflex, fotocromático). Armazón + cristales en 7-10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA3604846462", "MLA3604846464"], "imported_at": "2026-07-14"}
  }'::jsonb,
  true, false,
  'Rusty Peating Carey | Anteojos de Receta - Óptica Carballo',
  'Armazón de receta Rusty Peating en carey, cuadrado y unisex. Ultraliviano (18,9 g), apto mono, bi y multifocal. Envíos a todo el país, 30 años de experiencia.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = SDEMI carey brillo (primary). Items simples → variation_code = NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-peating-receta'), '129251',
   '{"frame_color":"carey-brillo","model_code":"SDEMI OPTICAL"}'::jsonb,
   7979000, 2, true, 1, 'MLA3604846462', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-peating-receta'), '129254',
   '{"frame_color":"carey-mate","model_code":"MDEMI OPTICAL"}'::jsonb,
   7979000, 2, true, 2, 'MLA3604846464', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = SDEMI perfil. medidas SIEMPRE última (sort 99).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-peating-receta'), (SELECT id FROM public.product_variants WHERE sku='129251'),
   'rusty-peating-receta/PEATING_SDEMI_p.jpg', 'Armazón de receta Rusty Peating cuadrado unisex vista lateral, carey brillo', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-peating-receta'), (SELECT id FROM public.product_variants WHERE sku='129251'),
   'rusty-peating-receta/PEATING_SDEMI_frente.jpg', 'Armazón de receta Rusty Peating cuadrado unisex vista frontal, carey brillo', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-peating-receta'), (SELECT id FROM public.product_variants WHERE sku='129254'),
   'rusty-peating-receta/PEATING_MDEMI_OPTICAL_perfil.jpg', 'Armazón de receta Rusty Peating cuadrado unisex vista lateral, carey mate', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-peating-receta'), (SELECT id FROM public.product_variants WHERE sku='129254'),
   'rusty-peating-receta/PEATING_MDEMI_OPTICAL_frente.jpg', 'Armazón de receta Rusty Peating cuadrado unisex vista frontal, carey mate', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-peating-receta'), NULL,
   'rusty-peating-receta/medidas.png', 'Esquema técnico de medidas Rusty Peating: frente 143mm, lente 52x49mm, puente 19mm, varilla 133mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
