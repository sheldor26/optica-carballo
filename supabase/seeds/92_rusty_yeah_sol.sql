-- ============================================
-- Seed 92: Rusty Yeah SOL — AVIADOR doble puente unisex, acetato bio-based, 3 colores (2/3 polarizadas)
-- Fecha: 2026-08-04
-- ============================================
-- Anteojo de SOL aviador doble puente unisex, full ACETATO BIO-BASED (frente y patillas —
-- ≠ The Take/Gresent que son G-Flex). Lente policarbonato 100% UVA/UVB cat 3. 32,9g.
--
-- ⚠️ LOS 2 LINKS DEL FOUNDER TENÍAN LAS ETIQUETAS DE COLOR CRUZADAS respecto a la realidad
-- de la API ML. Se desambiguó con `attribute_combinations` reales (no las etiquetas de los
-- links) — ver MISTAKES.md si se repite con otro producto:
--   Link "Multivariante C1 y C2 Pol" (MLA2819024290) → en realidad es item SIMPLE, 0
--   variaciones, "C3 - Carey Con Lentes Marrones", ACTIVO.
--   Link "C3" (MLA2819011214) → en realidad es MULTI-VARIACIÓN con 2 variaciones reales
--   (C1 negro mate/gris oscuro + C2 negro brillo/verde degradé), item PAUSADO en ML (no afecta
--   is_active en DB, precedente Rusty PRO 30/Vulk Ready — el pausado solo importa para sync
--   futura de stock/precio vía webhook).
--
-- ESTRUCTURA MIXTA DE VARIANTES (primer precedente del catálogo, confirmado por catalog-loader
-- contra `supabase/migrations/20260529300000_ml_variation_support.sql`: constraint
-- UNIQUE(mercadolibre_item_id, mercadolibre_variation_code) DEFERRABLE, NULLs distinct por
-- default de Postgres — sin choque):
--   C1 POL  SKU 1194370  MLA2819011214 var 196475639715  $133.965 → 13396500c  stock 3  negro mate / gris oscuro
--   C2 POL  SKU 1194371  MLA2819011214 var 196475639717  $133.965 → 13396500c  stock 3  negro brillo / verde degradé
--   C3 NO POL SKU 1194372 MLA2819024290 var NULL          $133.965 → 13396500c  stock 3  carey / marrón degradé
--
-- frame_shape="aviador" (español, = The Take/Gresent). frame_material + temple_material
-- "acetate" (full acetato, diferenciador físico real vs el resto del cluster que es G-Flex).
-- Convención SOL: lens_material policarbonato, lens_treatment ["uv400"] (SIN "polarized" en
-- el array — 2/3 no llega al 100%, honestidad), lens_category 3. polarized:true SOLO en C1/C2.
-- weight_grams 32.9. gender unisex.
--
-- Medidas (de la foto del founder): frente 148 / lente 56x49 / puente 15 / varilla 145 mm.
--
-- HONESTIDAD: 2/3 polarizadas (67%) → NO se afirma "Polarizado" en title/H1/name (criterio
-- Play/Patien 2/4, NO el de Terdey/Zinz/The Take 100%). Se acota en meta_description y callout:
-- "en 2 de 3 colores".
--
-- SEO (seo-strategist, verificado contra SEO_STRATEGY.md líneas 337-543 + CSV Ubersuggest):
-- primaria `anteojos de sol aviador` (110/10, REAL) — DISTINTA de `lentes de sol aviador`
-- (170/12) que ya es carril único de Rusty The Take (también aviador doble puente Rusty-sol,
-- 1/1 pol). Yeah es el 2º aviador Rusty-sol → NO puede pisar la keyword de The Take. Head de
-- soporte `lentes/anteojos de sol rusty` (1.300/880). "acetato bio-based" sin volumen medido en
-- el CSV (0 matches "bio-based/biobased") → diferenciador de copy, no keyword; anotado en
-- BACKLOG. Anti-canibalización con The Take: keyword distinta + honestidad distinta (2/3 vs
-- 1/1) + material distinto (acetato full vs G-Flex+acetato) + 3 colores vs 1 + cross-link
-- obligatorio Yeah↔The Take. Sin versión receta cargada (grep `rusty-yeah` + `Yeah` en todo el
-- repo → 0 resultados) → sin cross-link sol↔receta por ahora; si se carga después, seguir
-- convención `rusty-yeah-receta`.
--
-- Internal linking: /anteojos-de-sol/rusty, /anteojos-de-sol/aviador, /anteojos-de-sol/rusty/aviador,
-- /anteojos-de-sol/polarizados (criterio correcto "≥1 variante" → Yeah SÍ califica con C1/C2).
-- NO linkear a /anteojos-de-sol/rusty/polarizados (BACKLOG.md: esa faceta todavía usa el
-- criterio viejo "todas las variantes" → Yeah con 2/3 no calificaría ahí y generaría falsa
-- expectativa). Related: rusty-the-take, rusty-terdey, rusty-zinz, rusty-peating.
--
-- 📸 FOTOS: bucket products/rusty-yeah/ (7 archivos, verificados 900×442 HTTP 200 antes de
-- escribir este seed). ⚠️ Nombres LITERALES del founder, respetar el guion bajo doble de C1
-- vs simple de C2 — NO "corregir":
--   YEAH_C1_POL.__perfil.jpg / YEAH_C1_POL.__frente.jpg  (doble guion bajo)
--   YEAH_C2_POL._perfil.jpg  / YEAH_C2_POL._frente.jpg   (guion bajo simple)
--   YEAH_C3_perfil.jpg       / YEAH_C3_frente.jpg
--   medidas.webp (sort 99)
-- Grid primary = PERFIL de C1 (negro mate, polarizada — patrón dominante "primary" del cluster
-- Rusty sol). Scale 1.2 perfil / 1.0 frente (900×442, gemelo exacto de forma = rusty-the-take,
-- mismo formato) — PROVISIONAL, reverificar contra el grid /anteojos-de-sol/rusty post-deploy
-- comparando visualmente contra The Take y Gresent (regla 15).
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-yeah', 'Rusty Yeah',
  'Anteojos de sol Rusty Yeah: aviador de doble puente unisex, acetato bio-based. Lente de policarbonato con 100% protección UV (UV400, categoría 3). 2 de 3 colores con lente polarizada. 32,9 g.',
  E'Los **Rusty Yeah** son **anteojos de sol aviador de doble puente, unisex**. Frente y patillas de **acetato bio-based** —un material de origen más sustentable que el acetato tradicional— para un calce resistente y liviano (32,9 g). La **lente es de policarbonato**, con **100% protección UV (UV400, categoría 3)**.\n\nMedidas: frente 148 mm · lente 56 mm de ancho × 49 mm de alto · puente 15 mm · varilla 145 mm.\n\nDisponible en 3 colores:\n\n• Negro mate / lente gris oscuro — **polarizada**.\n• Negro brillo / lente verde degradé — **polarizada**.\n• Carey / lente marrón degradé — no polarizada.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "acetate",
    "frame_shape": "aviador",
    "temple_material": "acetate",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "weight_grams": 32.9,
    "measurements": {"frame_width_mm": 148, "lens_width_mm": 56, "lens_height_mm": 49, "bridge_mm": 15, "temple_length_mm": 145},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Aviador doble puente en acetato bio-based", "body": "Frente y patillas de acetato de origen bio-based, un material más sustentable que el acetato tradicional. Diseño aviador con doble puente, unisex."},
      {"type": "tip", "position": "middle", "title": "Lente policarbonato UV400 categoría 3", "body": "100% protección UVA/UVB, categoría 3. Liviano: 32,9 g."},
      {"type": "recommendation", "position": "bottom", "title": "2 de 3 colores con lente polarizada", "body": "Negro mate y negro brillo tienen lente polarizada, ideal para manejar y actividades al aire libre. Carey trae lente marrón degradé estándar, sin polarizar."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2819011214", "MLA2819024290"], "imported_at": "2026-08-04"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Rusty Yeah Aviador | Óptica Carballo',
  'Anteojos de sol Rusty Yeah, aviador doble puente unisex. 2 de 3 colores polarizados, cat. 3 y 100% UV. Envío a todo el país y asesoramiento de técnico óptico.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes MIXTAS: C1+C2 comparten mercadolibre_item_id (multi-variación real), C3 tiene su
-- propio item_id (item simple, variation_code NULL). polarized:true solo en C1/C2.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-yeah'), '1194370',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"C1","polarized":true}'::jsonb,
   13396500, 3, true, 1, 'MLA2819011214', '196475639715'),
  ((SELECT id FROM public.products WHERE slug='rusty-yeah'), '1194371',
   '{"frame_color":"negro-brillo","lens_color":"verde-degrade","model_code":"C2","polarized":true}'::jsonb,
   13396500, 3, true, 2, 'MLA2819011214', '196475639717'),
  ((SELECT id FROM public.products WHERE slug='rusty-yeah'), '1194372',
   '{"frame_color":"carey","lens_color":"marron-degrade","model_code":"C3","polarized":false}'::jsonb,
   13396500, 3, true, 3, 'MLA2819024290', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = perfil C1 (negro mate, polarizada). medidas.webp SIEMPRE última (sort 99).
-- ⚠️ Guion bajo doble en C1 vs simple en C2 — nombres literales del bucket, no "corregir".
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-yeah'), (SELECT id FROM public.product_variants WHERE sku='1194370'),
   'rusty-yeah/YEAH_C1_POL.__perfil.jpg', 'Anteojos de sol Rusty Yeah aviador doble puente unisex vista lateral, negro mate lente polarizada gris oscuro', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-yeah'), (SELECT id FROM public.product_variants WHERE sku='1194370'),
   'rusty-yeah/YEAH_C1_POL.__frente.jpg', 'Anteojos de sol Rusty Yeah aviador doble puente unisex vista frontal, negro mate lente polarizada gris oscuro', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-yeah'), (SELECT id FROM public.product_variants WHERE sku='1194371'),
   'rusty-yeah/YEAH_C2_POL._perfil.jpg', 'Anteojos de sol Rusty Yeah aviador doble puente unisex vista lateral, negro brillo lente polarizada verde degradé', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-yeah'), (SELECT id FROM public.product_variants WHERE sku='1194371'),
   'rusty-yeah/YEAH_C2_POL._frente.jpg', 'Anteojos de sol Rusty Yeah aviador doble puente unisex vista frontal, negro brillo lente polarizada verde degradé', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-yeah'), (SELECT id FROM public.product_variants WHERE sku='1194372'),
   'rusty-yeah/YEAH_C3_perfil.jpg', 'Anteojos de sol Rusty Yeah aviador doble puente unisex vista lateral, carey lente marrón degradé', 900, 442, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-yeah'), (SELECT id FROM public.product_variants WHERE sku='1194372'),
   'rusty-yeah/YEAH_C3_frente.jpg', 'Anteojos de sol Rusty Yeah aviador doble puente unisex vista frontal, carey lente marrón degradé', 900, 442, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-yeah'), NULL,
   'rusty-yeah/medidas.webp', 'Esquema técnico de medidas Rusty Yeah: frente 148mm, lente 56x49mm, puente 15mm, varilla 145mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
