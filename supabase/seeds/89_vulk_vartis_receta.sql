-- ============================================
-- Seed 89: Vulk Vartis RECETA (armazón óptico) — mujer, G-Flex + acetato
-- Fecha: 2026-08-01
-- ============================================
-- Armazón de receta MUJER. Frente G-Flex con bisagras metálicas; PATILLAS DE ACETATO
-- (founder separó explícitamente las dos frases → frame_material="g-flex" (frente),
-- temple_material="acetate" (patillas), hinge_system="metalica" sin calificador "flex",
-- a diferencia de Be Again/Strewn que sí dicen "flex" explícito). Lentes demo. Categoría
-- anteojos-de-receta. Convención receta: SOLO lens_compatibility (SIN lens_material/
-- treatment/category/polarized/uv — viene con lente demo).
--
-- ⚠️ frame_shape="redondo" es HIPÓTESIS no concluyente (catalog-loader): lente 53×51mm,
-- ratio 1.04:1 (casi 1:1). Comparado contra el catálogo: Ther receta (redondo, 49×47 =
-- 1.04:1) match casi idéntico; Kirt receta (redondo, 42×45 = 0.93:1) también cercano.
-- vs. Strewn (cuadrado, 50×45=1.11:1) y Katleen (cuadrado, 53×42=1.26:1), visiblemente
-- más rectangulares. Se usa "redondo" por ser el match más cercano. CONFIRMAR con
-- founder al verificar las fotos (mismo tratamiento que Be Again seed 88).
--
-- 2 MLAs SEPARADOS (items simples → mercadolibre_variation_code = NULL). Precio/stock de
-- la API ML + SKU pasados por el founder. Ambos $88.922 → 8892200c, stock 3 (total 6):
--   L.PINK frente rosa transparente / patillas carey  SKU 969361 MLA1939463781 (PRIMARY, primer color listado)
--   MDEMI frente carey mate / patillas negro brillo    SKU 969363 MLA1939525097
--
-- ⚠️ NO mencionar bluecut / filtro de luz azul en NINGÚN campo visible (los nombres de
-- archivo de foto dicen "B.CUT" = abreviatura de Bluecut, NO se traduce a copy/alt_text).
--
-- Peso 29,2g. Medidas: 141 / 53×51 / 17 / 140 mm (medidas.png).
-- SKUs del founder únicos (969361/969363) → sin sufijo.
--
-- ⚠️ HONESTIDAD de color (mismo criterio 2/3 de Be Again/Dieven sol): ni "transparente"
-- ni "carey" se reclaman como atributo del MODELO. L.PINK (rosa transparente) es 1/2 =
-- 50% del catálogo → por debajo del 66% de Strewn (2/3 transparente) que sí lo reclama.
-- MDEMI (carey mate full) + L.PINK (solo patillas carey) no llegan al 100% de Rusty
-- Peating (2/2 carey) → Vartis NO reclama "carey" ni "transparente" como primaria; ambos
-- colores se mencionan solo en su propia ficha de variante (alt_text/bullets).
--
-- SEO (seo-strategist): name = "Vulk Vartis Mujer" (CON "Mujer" — a diferencia de
-- Be Again/Dieven/Kirt que son unisex y no pueden reclamar género; acá SÍ hay keyword
-- primaria de género real). Primaria = `anteojos vulk mujer` (320/8) — carril libre en
-- el trío mujer Vulk receta (Katleen=forma cuadrada, Strewn=color transparente, ninguna
-- usa marca+género como primaria). Secundaria `anteojos recetados mujer` (260/7).
-- Cross-link obligatorio Vartis↔Katleen↔Strewn (trío Vulk mujer receta) +
-- /anteojos-de-receta/vulk/mujer.
--
-- CROSS-LINK sol↔receta: NO existe Vulk Vartis de SOL cargado (grep vacío). Si se carga
-- el sol como slug `vulk-vartis`, engancha solo por convención de slug.
--
-- Fotos de modelo (modelo-vartis-LPink.jpg / Modelo-vartis-mdemi.jpg) NO se usan — sin
-- precedente de foto de modelo en ningún seed real del catálogo (solo perfil+frente+
-- medidas). Anotado en BACKLOG como gap de patrón, no bloqueante.
--
-- 📸 FOTOS (bucket products/vulk-vartis-receta/, 4 + medidas, verificadas vía API — nombres
-- incluyen "B.CUT" tal cual, no se renombran):
--   VARTIS L.PINK B.CUT perfil.jpg / VARTIS L.PINK B.CUT frente.jpg (PRIMARY)
--   VARTIS MDEMI B.CUT perfil.jpg / VARTIS MDEMI B.CUT frente.jpg
--   medidas.png (sort 99)
-- Scale 1.1 perfil / 1.0 frente PROVISIONAL (baseline receta Vulk 900×442, dimensión no
-- confirmada por nombre de archivo — reverificar contra grid mujer, Katleen/Strewn, regla 15).
-- ============================================

BEGIN;

WITH
  vulk    AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM receta), 'vulk-vartis-receta', 'Vulk Vartis Mujer',
  'Anteojos Vulk Vartis para mujer: armazón de receta con frente G-Flex y bisagras metálicas, patillas de acetato. Apto monofocal, bifocal y progresivo.',
  E'El **Vulk Vartis** es un armazón de receta **para mujer**, de 29,2 g. **Frente de G-Flex** con **bisagras metálicas**, y **patillas de acetato** para un calce cómodo y durable.\n\nMedidas: frente 141 mm · lente 53 mm de ancho × 51 mm de alto · puente 17 mm · varilla 140 mm.\n\nViene con lentes demo (sin graduación). Sumale tus cristales con receta: monofocales, bifocales, progresivos o multifocales.\n\nDisponible en 2 colores:\n\n• L.PINK — frente rosa transparente, patillas carey.\n• MDEMI — frente carey mate, patillas negro brillo.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "redondo",
    "temple_material": "acetate",
    "hinge_system": "metalica",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "female",
    "line": "urbana",
    "measurements": {"frame_width_mm": 141, "lens_width_mm": 53, "lens_height_mm": 51, "bridge_mm": 17, "temple_length_mm": 140},
    "weight_grams": 29.2,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Diseño femenino con acetato", "body": "Frente de G-Flex con bisagras metálicas y patillas de acetato. Para mujer, en 2 colores."},
      {"type": "tip", "position": "middle", "title": "Apto para tu graduación", "body": "Acepta lentes monofocales, bifocales, progresivos y multifocales. Si tenés dudas con tu receta, escribinos antes de comprar."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con foto de tu receta. Te pasamos el costo del laboratorio según tu graduación + tratamientos (antirreflex, fotocromático). Armazón + cristales en 7-10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1939463781", "MLA1939525097"], "imported_at": "2026-08-01"}
  }'::jsonb,
  true, false,
  'Armazón de Receta Vulk Vartis Mujer | Óptica Carballo',
  'Anteojos Vulk Vartis para mujer, armazón de receta con bisagras metálicas y patillas de acetato. Apto monofocal, bifocal y progresivo. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = L.PINK (primary, primer color listado). Items simples → variation_code = NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-vartis-receta'), '969361',
   '{"frame_color":"rosa-transparente-carey","model_code":"L.PINK OPTICAL"}'::jsonb,
   8892200, 3, true, 1, 'MLA1939463781', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-vartis-receta'), '969363',
   '{"frame_color":"carey-mate-negro-brillo","model_code":"MDEMI OPTICAL"}'::jsonb,
   8892200, 3, true, 2, 'MLA1939525097', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = L.PINK perfil. medidas SIEMPRE última (sort 99).
-- ⚠️ nombres EXACTOS del bucket, incluyen "B.CUT" (NO mencionar bluecut en alt_text).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-vartis-receta'), (SELECT id FROM public.product_variants WHERE sku='969361'),
   'vulk-vartis-receta/VARTIS L.PINK B.CUT perfil.jpg', 'Armazón de receta Vulk Vartis para mujer vista lateral, frente rosa transparente patillas carey', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-vartis-receta'), (SELECT id FROM public.product_variants WHERE sku='969361'),
   'vulk-vartis-receta/VARTIS L.PINK B.CUT frente.jpg', 'Armazón de receta Vulk Vartis para mujer vista frontal, frente rosa transparente patillas carey', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-vartis-receta'), (SELECT id FROM public.product_variants WHERE sku='969363'),
   'vulk-vartis-receta/VARTIS MDEMI B.CUT perfil.jpg', 'Armazón de receta Vulk Vartis para mujer vista lateral, frente carey mate patillas negro brillo', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-vartis-receta'), (SELECT id FROM public.product_variants WHERE sku='969363'),
   'vulk-vartis-receta/VARTIS MDEMI B.CUT frente.jpg', 'Armazón de receta Vulk Vartis para mujer vista frontal, frente carey mate patillas negro brillo', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-vartis-receta'), NULL,
   'vulk-vartis-receta/medidas.png', 'Esquema técnico de medidas Vulk Vartis: frente 141mm, lente 53x51mm, puente 17mm, varilla 140mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
