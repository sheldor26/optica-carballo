-- ============================================
-- Seed 74: Rusty Woxi Optics RECETA — RECTANGULAR pequeño, G-Flex, SOLO monofocal, 3 colores
-- Fecha: 2026-06-15
-- ============================================
-- Armazón de RECETA rectangular, PEQUEÑO y liviano, frente G-Flex. ⚠️ SOLO apto para lentes
-- MONOFOCALES (el founder lo aclara: el talle chico NO entra bi/progresivo). Ideal para armar
-- monofocales de lectura/descanso. Viene con lentes DEMO. 3 MLAs SEPARADOS (items simples →
-- variation_code NULL). El link que pasó el founder era un CATÁLOGO ML (MLAU…, da 404 en /items);
-- los MLA reales del seller se encontraron por API (/users/81654493/items/search?q=woxi):
--   MBLK         negro mate          SKU 111191 MLA3520951126 $87.890 stock 2 (PRIMARY)
--   SBLK         negro brillo        SKU 111190 MLA3520938342 $87.890 stock 2
--   SBLKCL-SBLK  negro brillo/cristal SKU 111194 MLA3520964380 $87.890 stock 2
--
-- CONVENCIÓN RECETA (seed 72/61): SOLO lens_compatibility — acá ["monofocal"] (NO los 4 valores
-- de My Crew/The Trial); SIN lens_material/treatment/category/polarized; name "Optics"; model_code
-- " OPTICAL". frame_material g-flex. frame_shape "rectangular" (confirmado por foto frontal: lente
-- más ancha que alta, bordes rectos). gender unisex. weight_grams OMITIDO ("livianos" sin gramaje
-- → lista de pesos pendientes en BACKLOG).
--
-- Medidas (de la FOTO): frente 138 / lente 52x37 / puente 18 / varilla 145 mm.
--
-- SEO por seo-strategist: primaria `anteojos recetados` (720/9) — NO "anteojos rectangulares"
-- para NO canibalizar el R-CY 02 (también rectangular receta); la forma va de secundaria.
-- Diferenciador en copy: pequeño + liviano + monofocal (lectura/descanso). meta_title convención
-- "Armazón de Receta Rusty …". "lectura/descanso" SOLO como uso en el body, NUNCA como reclamo de
-- lente pre-armado (honestidad: es armazón para monofocal graduado, no lupa pre-armada).
--
-- 📸 FOTOS: ya en bucket rusty-woxi/ (full-res 3696×2448, ratio 3:2). 3 var × (perfil+frente) +
-- medidas.png = 7. Grid primary = PERFIL de MBLK. ⚠️ nombres del founder inconsistentes
-- ("CLSBLK" vs "SBLKCL", espacios) — copiados TAL CUAL. Scale 1.15/1.0 baseline receta
-- (provisional; reverificar vs grid — regla 15).
-- ============================================

BEGIN;

WITH
  rusty  AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-woxi-receta', 'Rusty Woxi Optics',
  'Armazón de receta Rusty Woxi: rectangular, pequeño y liviano, en G-Flex. Pensado para lentes monofocales (ideal para lectura y descanso). Viene con lentes demo: sumale tus cristales con receta.',
  E'El **Rusty Woxi Optics** es un **armazón de receta rectangular**, de talle **pequeño y liviano**, en **G-Flex**. Por su tamaño está pensado **exclusivamente para lentes monofocales** — ideal para armar tus anteojos de **lectura o descanso** con tu graduación.\n\nViene con **lentes demo (sin graduación)**: el armazón lo comprás sin receta, y cuando le ponés tus cristales monofocales nos pasás la receta para armarlo. *Por su talle no admite cristales bifocales ni multifocales/progresivos.*\n\nMedidas: frente 138 mm · lente 52 mm de ancho × 37 mm de alto · puente 18 mm · varilla 145 mm.\n\nDisponible en 3 versiones:\n\n• MBLK — negro mate.\n• SBLK — negro brillo.\n• SBLKCL-SBLK — negro brillo con detalle cristal.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante. El precio es del armazón; los cristales graduados se cotizan según tu receta.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "rectangular",
    "lens_compatibility": ["monofocal"],
    "gender": "unisex",
    "measurements": {"frame_width_mm": 138, "lens_width_mm": 52, "lens_height_mm": 37, "bridge_mm": 18, "temple_length_mm": 145},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Rectangular pequeño y liviano", "body": "Armazón de receta rectangular en G-Flex, de talle pequeño y liviano. Cómodo para uso diario, lectura o trabajo de cerca."},
      {"type": "tip", "position": "middle", "title": "Solo para lentes monofocales", "body": "Por su talle pequeño, este armazón se arma únicamente con cristales monofocales (no admite bifocales ni progresivos/multifocales). Ideal para armar tus monofocales de lectura o descanso."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con la graduación?", "body": "Si querés cotizar tus cristales monofocales o no sabés si te sirve, escribinos por WhatsApp y te asesoramos. El precio mostrado es del armazón."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA3520951126", "MLA3520938342", "MLA3520964380"], "imported_at": "2026-06-15"}
  }'::jsonb,
  true, false,
  'Armazón de Receta Rusty Woxi Rectangular | Óptica Carballo',
  'Armazón Rusty Woxi rectangular y liviano para lentes monofocales, ideal para lectura y descanso. Original, con envío a todo el país. Pedí asesoramiento.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = MBLK (primary). 3 MLAs simples → variation_code NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-woxi-receta'), '111191',
   '{"frame_color":"negro-mate","model_code":"MBLK OPTICAL"}'::jsonb,
   8789000, 2, true, 1, 'MLA3520951126', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-woxi-receta'), '111190',
   '{"frame_color":"negro-brillo","model_code":"SBLK OPTICAL"}'::jsonb,
   8789000, 2, true, 2, 'MLA3520938342', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-woxi-receta'), '111194',
   '{"frame_color":"negro-brillo-cristal","model_code":"SBLKCL-SBLK OPTICAL"}'::jsonb,
   8789000, 2, true, 3, 'MLA3520964380', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Por variante: perfil (grid) + frente. Primary = MBLK perfil. medidas última.
-- ⚠️ nombres del founder copiados tal cual (inconsistentes: "CLSBLK" vs "SBLKCL", espacios).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-woxi-receta'), (SELECT id FROM public.product_variants WHERE sku='111191'),
   'rusty-woxi/WOXI-MBLK-MBLK-PERFIL.jpg', 'Armazón de receta Rusty Woxi rectangular pequeño vista lateral, negro mate', 3696, 2448, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-woxi-receta'), (SELECT id FROM public.product_variants WHERE sku='111191'),
   'rusty-woxi/WOXI MBLK - FRENTE.jpg', 'Armazón de receta Rusty Woxi rectangular pequeño vista frontal, negro mate', 3696, 2448, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-woxi-receta'), (SELECT id FROM public.product_variants WHERE sku='111190'),
   'rusty-woxi/WOXI SBLK-PERFIL.jpg', 'Armazón de receta Rusty Woxi rectangular pequeño vista lateral, negro brillo', 3696, 2448, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-woxi-receta'), (SELECT id FROM public.product_variants WHERE sku='111190'),
   'rusty-woxi/WOXI SBLK - FRENTE.jpg', 'Armazón de receta Rusty Woxi rectangular pequeño vista frontal, negro brillo', 3696, 2448, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-woxi-receta'), (SELECT id FROM public.product_variants WHERE sku='111194'),
   'rusty-woxi/WOXI SBLKCL SBLK-PERFIL.jpg', 'Armazón de receta Rusty Woxi rectangular pequeño vista lateral, negro brillo con detalle cristal', 3696, 2448, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-woxi-receta'), (SELECT id FROM public.product_variants WHERE sku='111194'),
   'rusty-woxi/WOXI SBLK-CLSBLK - FRENTE.jpg', 'Armazón de receta Rusty Woxi rectangular pequeño vista frontal, negro brillo con detalle cristal', 3696, 2448, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-woxi-receta'), NULL,
   'rusty-woxi/medidas.png', 'Esquema técnico de medidas Rusty Woxi: frente 138mm, lente 52x37mm, puente 18mm, varilla 145mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
