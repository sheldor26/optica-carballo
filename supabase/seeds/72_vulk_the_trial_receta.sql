-- ============================================
-- Seed 72: Vulk The Trial Optics RECETA — AVIADOR doble puente unisex, G-Flex+Monel, 2 colores
-- Fecha: 2026-06-14
-- ============================================
-- Armazón de RECETA (hermano del sol The Trial, seed 71). Aviador doble puente unisex, frente
-- G-Flex + patillas Monel con terminal de acetato laminado hecho a mano + bisagra integrada.
-- Viene con lentes DEMO (sin graduación). Ultraliviano 19,5g, talle large. Mismo frame que el sol
-- (mismas medidas). 2 MLAs SEPARADOS (items simples → variation_code NULL), ambos PAUSED stock 0:
--   670-056   SKU 125721 MLA2014806190 $83.745 stock 0 (PRIMARY, frente celeste/gris translúcido, patillas metal)
--   MBLK-046  SKU 125722 MLA1491306851 $83.736 stock 0 (negro mate)
-- ⚠️ COLOR 670-056: founder dice "celeste transparente"; el título ML dice "gris oscuro/doradas"
-- pero la FOTO muestra translúcido gris-celeste con patillas plateadas → se usa lo del founder.
--
-- CONVENCIÓN RECETA (igual a seed 61 my-crew / 60 opposit): SOLO lens_compatibility; SIN
-- lens_material / lens_treatment / lens_category / polarized (es armazón con lente demo, no
-- producto óptico terminado). name con "Optics"; model_code con sufijo " OPTICAL". El "Demo Lens"
-- se menciona en la descripción, no como atributo.
-- frame_material g-flex (frente) + temple_material monel (patillas, como el sol). frame_shape
-- "aviator" (→/anteojos-de-receta/aviador). weight_grams 19.5 (ML lo da). gender unisex.
--
-- Medidas (de la FOTO, = al sol): frente 147 / lente 50x49 / puente 15 / varilla 150 mm.
--
-- SEO por seo-strategist: primaria intención receta `anteojos recetados` (720/9) + carril forma
-- `anteojos aviador` (590/20); head de marca `anteojos vulk`/`lentes vulk` = hub /marcas/vulk, NO
-- el producto. meta_title "Armazón de Receta ..." (convención My Crew). NO mencionar cuotas.
-- Anti-canibalización: sol (lentes/anteojos de sol vulk) vs receta (anteojos recetados) = intención
-- distinta; vs My Crew receta = redondo vs aviador. Cross-link sol↔receta.
--
-- 📸 FOTOS: ya subidas a vulk-the-trial-receta/ (900×442). 2 var × (perfil+frente) + medidas = 5.
-- Grid primary = PERFIL de 670-056. Scale 1.0 en las 4 (mismo caso que el sol The Trial y Raven:
-- 900×442 más ancho que el card 3:2 → object-contain llena por ancho; NO el 1.15 receta que cropea).
-- ============================================

BEGIN;

WITH
  vulk   AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  receta AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM receta), 'vulk-the-trial-receta', 'Vulk The Trial Optics',
  'Armazón de receta Vulk The Trial: aviador doble puente unisex, ultraliviano (19,5g). Frente G-Flex y patillas de Monel con terminal de acetato hecho a mano. Viene con lentes demo: sumale tus cristales con receta. Compatible con monofocal, bifocal y progresivo.',
  E'El **Vulk The Trial Optics** es un **armazón de receta aviador de doble puente, unisex**, con una construcción cuidada: **frente de G-Flex** y **patillas de Monel con terminal de acetato laminado hecho a mano** y bisagra integrada. Es **ultraliviano (19,5 g)** y de talle large.\n\nViene con **lentes demo (sin graduación)**: el armazón lo comprás sin receta, y cuando le ponés tus cristales graduados nos pasás la receta para armarlo. Es compatible con cristales **monofocales, bifocales y progresivos/multifocales**.\n\nMedidas: frente 147 mm · lente 50 mm de ancho × 49 mm de alto · puente 15 mm · varilla 150 mm.\n\nDisponible en 2 versiones:\n\n• 670-056 — frente celeste translúcido, patillas de metal.\n• MBLK-046 — negro mate.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante. El precio es del armazón; los cristales graduados se cotizan según tu receta.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "aviador",
    "temple_material": "monel",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "unisex",
    "weight_grams": 19.5,
    "measurements": {"frame_width_mm": 147, "lens_width_mm": 50, "lens_height_mm": 49, "bridge_mm": 15, "temple_length_mm": 150},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Aviador doble puente ultraliviano", "body": "Armazón aviador de doble puente unisex, solo 19,5 g. Frente de G-Flex y patillas de Monel con terminal de acetato laminado hecho a mano y bisagra integrada."},
      {"type": "tip", "position": "middle", "title": "Viene con lentes demo", "body": "El armazón se compra sin receta (trae lentes demo, sin graduación). Cuando le ponés tus cristales graduados, nos pasás la receta para armarlo. Compatible con monofocal, bifocal y progresivo/multifocal."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con la graduación?", "body": "Si no sabés qué cristal te conviene o querés cotizar tus lentes graduados, escribinos por WhatsApp y te asesoramos. El precio mostrado es del armazón."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2014806190", "MLA1491306851"], "imported_at": "2026-06-14"}
  }'::jsonb,
  true, false,
  'Armazón de Receta Vulk The Trial Aviador | Óptica Carballo',
  'Armazón de receta Vulk The Trial: aviador doble puente, ultraliviano 19,5g, unisex. Hecho a mano. Sumale tus cristales con receta y envíos a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = 670-056 (primary). 2 MLAs simples → variation_code NULL. stock 0 (paused ML).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial-receta'), '125721',
   '{"frame_color":"celeste-transparente","model_code":"670-056 OPTICAL"}'::jsonb,
   8374500, 0, true, 1, 'MLA2014806190', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial-receta'), '125722',
   '{"frame_color":"negro-mate","model_code":"MBLK-046 OPTICAL"}'::jsonb,
   8373600, 0, true, 2, 'MLA1491306851', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Por variante: perfil (grid) + frente. Primary = 670-056 perfil. medidas última.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial-receta'), (SELECT id FROM public.product_variants WHERE sku='125721'),
   'vulk-the-trial-receta/THE TRIAL 670-056 PERFIL.jpg', 'Armazón de receta Vulk The Trial aviador doble puente unisex vista lateral, frente celeste translúcido patillas de metal', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial-receta'), (SELECT id FROM public.product_variants WHERE sku='125721'),
   'vulk-the-trial-receta/THE TRIAL 670-056 FRENTE.jpg', 'Armazón de receta Vulk The Trial aviador doble puente unisex vista frontal, frente celeste translúcido patillas de metal', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial-receta'), (SELECT id FROM public.product_variants WHERE sku='125722'),
   'vulk-the-trial-receta/THE TRIAL MBLK-046 PERFIL.jpg', 'Armazón de receta Vulk The Trial aviador doble puente unisex vista lateral, negro mate', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial-receta'), (SELECT id FROM public.product_variants WHERE sku='125722'),
   'vulk-the-trial-receta/THE TRIAL MBLK-046 FRENTE.jpg', 'Armazón de receta Vulk The Trial aviador doble puente unisex vista frontal, negro mate', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial-receta'), NULL,
   'vulk-the-trial-receta/medidas.webp', 'Esquema técnico de medidas Vulk The Trial: frente 147mm, lente 50x49mm, puente 15mm, varilla 150mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
