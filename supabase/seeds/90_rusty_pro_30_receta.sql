-- ============================================
-- Seed 90: Rusty PRO 30 Optics RECETA (armazón óptico) — cuadrado hombre, G-Flex, 1 variante
-- Fecha: 2026-08-01
-- ============================================
-- Armazón de receta CUADRADO HOMBRE, marco liviano (22,9g). Frente G-Flex; patillas
-- G-Flex con alma de metal interior + terminales de goma ajustables y antideslizantes
-- (detalle constructivo → callout, sin campo de enum propio; no hay precedente de
-- "goma"/"alma de metal" en el schema). Lentes demo. Categoría anteojos-de-receta.
-- Convención receta: SOLO lens_compatibility (SIN lens_material/treatment/category/
-- polarized/uv — viene con lente demo). Molde: patrón single-row de 89_vulk_vartis
-- (reducido a 1 variante) + convención de nombre/keywords de 82_rusty_invig_receta.
--
-- 1 SOLA VARIANTE (item simple → mercadolibre_variation_code = NULL). Precio/stock de
-- la API ML + SKU del founder. $95.399 → 9539900c, stock 3:
--   LIGHT GREY  SKU 126411  MLA1939580597  (frente gris transparente, terminales azules)
--
-- ⚠️ Hay una publicación DUPLICADA en ML (MLA3709808184, mismo precio/stock, título
-- "Blue Block Cut") — NO se usa; se usa la que matchea el título exacto del link que
-- pasó el founder (MLA1939580597).
--
-- ⚠️ NO mencionar bluecut / filtro de luz azul en NINGÚN campo visible (el título de ML
-- dice "Filtro Luz Azul"/"Blue Block Cut" — criterio general del proyecto). Distinción
-- aplicada: "gris transparente" (frente) y "terminales azules" son COLOR FÍSICO del
-- armazón (mencionables), no el tratamiento óptico "filtro de luz azul" del lente (NO
-- mencionable) — mismo criterio que Vartis seed 89 con "B.CUT" en nombres de archivo.
--
-- Peso 22,9g. Medidas: 149 / 56×48 / 19 / 140 mm (imagen de medidas). Garantía 1 año
-- (founder "one year warranty" = warranty_months 12, default del proyecto).
--
-- SEO (seo-strategist): name = "Rusty PRO 30 Optics" (convención Rusty receta: Ther/The
-- Take/Zinz/Woxi/Patien/Invig todos usan "Optics"). Colisiona en forma+género con Rusty
-- Spell (cuadrado, primaria `anteojos cuadrados hombre` 210/14) y Rusty Invig
-- (rectangular hombre, primaria `anteojos rusty hombre` 390/9) — PRO 30 NO pelea
-- ninguna de las dos. Su única variante (LIGHT GREY, frente gris transparente) le da un
-- carril propio: primaria `anteojos transparentes hombre` (260/22), libre en todo el
-- sitio (la femenina la tiene Vulk Strewn). NO reclama "anteojos de metal" (el frame es
-- G-Flex, no metal — sería engañoso, esa keyword es de Kirt/Ther). Cross-link
-- obligatorio PRO 30↔Spell↔Zinz↔Peating (Rusty cuadrados) + /anteojos-de-receta/rusty +
-- /anteojos-de-receta/rusty/hombre.
--
-- CROSS-LINK sol↔receta: NO existe Rusty PRO 30 de SOL cargado (grep vacío). Si se carga
-- el sol como slug `rusty-pro-30`, engancha solo por convención de slug.
--
-- 📸 FOTOS (bucket products/Rusty-PRO30-receta/ — ⚠️ nombre de carpeta con mayúsculas,
-- NO estándar, distinto del slug técnico `rusty-pro-30-receta`; 3, verificadas HTTP 200):
--   PRO_30_LIGHT_GREY-perfil.jpg / PRO_30_LIGHT_GREY-frente.jpg (900×442, PRIMARY perfil)
--   PRO30-4.png (1500×1500, medidas, sort 99)
-- Scale 1.1 perfil / 1.0 frente (baseline receta establecido, 900×442 idéntico al resto
-- del cluster; reverificar grid, regla 15).
-- ============================================

BEGIN;

WITH
  rusty   AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-pro-30-receta', 'Rusty PRO 30 Optics',
  'Rusty PRO 30: armazón de receta cuadrado para hombre, gris transparente con terminales azules, ultraliviano (22,9g). Apto monofocal, bifocal y progresivo.',
  E'El **Rusty PRO 30** es un armazón de receta **cuadrado para hombre**, en gris transparente con terminales azules, de 22,9 g. **Frente de G-Flex** con **patillas de G-Flex con alma de metal interior** y **terminales de goma ajustables y antideslizantes**, para un calce cómodo y firme.\n\nMedidas: frente 149 mm · lente 56 mm de ancho × 48 mm de alto · puente 19 mm · varilla 140 mm.\n\nViene con lentes demo (sin graduación). Sumale tus cristales con receta: monofocales, bifocales, progresivos o multifocales.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "cuadrado",
    "temple_material": "g-flex",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "male",
    "line": "urbana",
    "measurements": {"frame_width_mm": 149, "lens_width_mm": 56, "lens_height_mm": 48, "bridge_mm": 19, "temple_length_mm": 140},
    "weight_grams": 22.9,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado transparente para hombre", "body": "Frente de G-Flex, gris transparente con terminales azules. Patillas con alma de metal interior y terminales de goma ajustables y antideslizantes. Ultraliviano: 22,9 g."},
      {"type": "tip", "position": "middle", "title": "Apto para tu graduación", "body": "Acepta lentes monofocales, bifocales, progresivos y multifocales. Si tenés dudas con tu receta, escribinos antes de comprar."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con foto de tu receta. Te pasamos el costo del laboratorio según tu graduación + tratamientos (antirreflex, fotocromático). Armazón + cristales en 7-10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1939580597"], "imported_at": "2026-08-01"}
  }'::jsonb,
  true, false,
  'Armazón de Receta Rusty PRO 30 | Óptica Carballo',
  'Anteojos transparentes hombre Rusty PRO 30, cuadrados, con patillas de alma metálica y terminales antideslizantes. Envío a todo el país. Garantía 1 año.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variante única. sort 1, primary. Item simple → variation_code = NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-pro-30-receta'), '126411',
   '{"frame_color":"gris-transparente-terminales-azules","model_code":"LIGHT GREY OPTICAL"}'::jsonb,
   9539900, 3, true, 1, 'MLA1939580597', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = perfil. medidas (PRO30-4.png) SIEMPRE última (sort 99).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-pro-30-receta'), (SELECT id FROM public.product_variants WHERE sku='126411'),
   'Rusty-PRO30-receta/PRO_30_LIGHT_GREY-perfil.jpg', 'Armazón de receta Rusty PRO 30 cuadrado para hombre vista lateral, gris transparente terminales azules', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-pro-30-receta'), (SELECT id FROM public.product_variants WHERE sku='126411'),
   'Rusty-PRO30-receta/PRO_30_LIGHT_GREY-frente.jpg', 'Armazón de receta Rusty PRO 30 cuadrado para hombre vista frontal, gris transparente terminales azules', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-pro-30-receta'), NULL,
   'Rusty-PRO30-receta/PRO30-4.png', 'Esquema técnico de medidas Rusty PRO 30: frente 149mm, lente 56x48mm, puente 19mm, varilla 140mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
