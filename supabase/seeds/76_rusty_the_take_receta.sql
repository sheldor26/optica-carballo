-- ============================================
-- Seed 76: Rusty The Take Optics RECETA — AVIADOR unisex, G-Flex, 2 colores
-- Fecha: 2026-06-29
-- ============================================
-- Armazón de RECETA aviador unisex, frente + patillas G-Flex, sistema de bisagras flexo,
-- lentes DEMO, liviano 18g. El link era CATÁLOGO ML (MLAU…); los MLA reales del seller se
-- hallaron por API (/users/.../items/search?q=the take). 2 items simples (variation_code NULL):
--   MDEMI-MBLK OPTICAL  SKU 129230 MLA3537508372 $79.790 stock 3 (PRIMARY, carey mate + patillas negro mate)
--   L.ROSE OPTICAL      SKU 129233 MLA1866094293 $79.790 stock 3 (caramelo / rosa claro translúcido — ML "Caramelo")
-- (Hay además un The Take SOL — SKU 129234 MLA2498747644 "negro mate lentes negras" — NO es parte de esta carga receta.)
--
-- CONVENCIÓN RECETA (seed 72/75): SOLO lens_compatibility (los 4: aviador 51×46, altura sobrada
-- para progresivo); SIN lens_material/treatment/category/polarized; name "Optics"; model_code
-- " OPTICAL". frame_material g-flex + temple_material g-flex (founder). frame_shape "aviador"
-- (ESPAÑOL, canónico — URL/founder lo confirman). gender unisex. weight_grams 18 (ML).
--
-- Medidas (de la FOTO): frente 136 / lente 51x46 / puente 16 / varilla 145 mm.
--
-- SEO por seo-strategist: primaria `anteojos recetados` (720/9) + carril `anteojos aviador`
-- (590) — el head de marca va al hub /marcas/rusty. **Anti-canibalización vs Vulk The Trial
-- receta (también aviador)**: distinto modificador de forma (The Take = "aviador clásico";
-- The Trial = "aviador doble puente") + branded distinto; cross-link "otros aviadores de receta".
-- The Take es el ÚNICO aviador de receta Rusty.
--
-- 📸 FOTOS: en bucket rusty-the-take-receta/ (900×442). 2 var × (perfil+frente) + medidas.png.
-- Grid primary = PERFIL de MDEMI-MBLK. Scale 1.0 en las 4 (900×442 más ancho que el card 3:2 →
-- object-contain llena por ancho; 1.15 cropearía las patillas — mismo caso que Raven/Trial).
-- medidas.png en sort 99 (SIEMPRE última — lección Spell/Katleen: con sort medio quedaba antes de las fotos).
-- ============================================

BEGIN;

WITH
  rusty  AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-the-take-receta', 'Rusty The Take Optics',
  'Armazón de receta Rusty The Take: aviador de doble puente unisex, frente y patillas de G-Flex con bisagras flexo, ultraliviano (18g). Viene con lentes demo: sumale tus cristales con receta. Compatible con monofocal, bifocal y progresivo.',
  E'El **Rusty The Take Optics** es un **armazón de receta aviador de doble puente, unisex**. Frente y patillas de **G-Flex** —flexible y resistente— con **sistema de bisagras flexo**, y es **ultraliviano (18 g)**.\n\nViene con **lentes demo (sin graduación)**: el armazón lo comprás sin receta, y cuando le ponés tus cristales graduados nos pasás la receta para armarlo. Es compatible con cristales **monofocales, bifocales y progresivos/multifocales**.\n\nMedidas: frente 136 mm · lente 51 mm de ancho × 46 mm de alto · puente 16 mm · varilla 145 mm.\n\nDisponible en 2 versiones:\n\n• MDEMI-MBLK — carey mate con patillas negro mate.\n• L.Rose — caramelo / rosa claro translúcido.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante. El precio es del armazón; los cristales graduados se cotizan según tu receta.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "aviador",
    "temple_material": "g-flex",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "unisex",
    "weight_grams": 18,
    "measurements": {"frame_width_mm": 136, "lens_width_mm": 51, "lens_height_mm": 46, "bridge_mm": 16, "temple_length_mm": 145},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Aviador doble puente ultraliviano", "body": "Armazón de receta aviador de doble puente en G-Flex (frente y patillas) con sistema de bisagras flexo. Solo 18 g — cómodo para uso diario."},
      {"type": "tip", "position": "middle", "title": "Viene con lentes demo", "body": "El armazón se compra sin receta (trae lentes demo). Cuando le ponés tus cristales graduados, nos pasás la receta para armarlo. Compatible con monofocal, bifocal y progresivo/multifocal."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con la graduación?", "body": "Si querés cotizar tus cristales o no sabés cuál te conviene, escribinos por WhatsApp y te asesoramos. El precio mostrado es del armazón."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA3537508372", "MLA1866094293"], "imported_at": "2026-06-29"}
  }'::jsonb,
  true, false,
  'Armazón de Receta Rusty The Take Aviador | Óptica Carballo',
  'Armazón de receta Rusty The Take, aviador unisex ultraliviano (18 g). Lentes demo para colocar tu graduación. Original, con envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = MDEMI-MBLK (primary). 2 MLAs simples → variation_code NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-the-take-receta'), '129230',
   '{"frame_color":"carey-mate","temple_color":"negro-mate","model_code":"MDEMI-MBLK OPTICAL"}'::jsonb,
   7979000, 3, true, 1, 'MLA3537508372', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-the-take-receta'), '129233',
   '{"frame_color":"caramelo","model_code":"L.ROSE OPTICAL"}'::jsonb,
   7979000, 3, true, 2, 'MLA1866094293', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Por variante: perfil (grid) + frente. Primary = MDEMI perfil. medidas sort 99 (última).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-the-take-receta'), (SELECT id FROM public.product_variants WHERE sku='129230'),
   'rusty-the-take-receta/THE_TAKE_MDEMI_PERFIL.jpg', 'Armazón de receta Rusty The Take aviador unisex vista lateral, carey mate patillas negro mate', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-the-take-receta'), (SELECT id FROM public.product_variants WHERE sku='129230'),
   'rusty-the-take-receta/THE_TAKE_MDEMI_frente.jpg', 'Armazón de receta Rusty The Take aviador unisex vista frontal, carey mate patillas negro mate', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-the-take-receta'), (SELECT id FROM public.product_variants WHERE sku='129233'),
   'rusty-the-take-receta/THE_TAKE_L.ROSE_-_p.jpg', 'Armazón de receta Rusty The Take aviador unisex vista lateral, caramelo rosa claro', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-the-take-receta'), (SELECT id FROM public.product_variants WHERE sku='129233'),
   'rusty-the-take-receta/THE_TAKE_L.ROSE_-_F.jpg', 'Armazón de receta Rusty The Take aviador unisex vista frontal, caramelo rosa claro', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-the-take-receta'), NULL,
   'rusty-the-take-receta/medidas.png', 'Esquema técnico de medidas Rusty The Take: frente 136mm, lente 51x46mm, puente 16mm, varilla 145mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
