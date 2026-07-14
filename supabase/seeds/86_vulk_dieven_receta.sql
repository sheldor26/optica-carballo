-- ============================================
-- Seed 86: Vulk Dieven Optics RECETA (armazón óptico) — rectangular unisex, G-Flex
-- Fecha: 2026-07-14
-- ============================================
-- Armazón de receta RECTANGULAR de bordes anchos, UNISEX, marco liviano (28,5g), talle
-- medium. Frente y patillas de G-Flex, bisagras plásticas reforzadas ultra liviano. Lentes
-- demo. Categoría anteojos-de-receta. Convención receta: SOLO lens_compatibility (SIN
-- lens_material/treatment/category/polarized/uv — viene con lente demo). PRIMER
-- rectangular Vulk en receta (los otros 3 rectangulares receta son Rusty: R-CY 02, Woxi,
-- Invig). Molde: patrón general 3-MLAs-separados de Strewn 81/Kirt 83 (Vulk receta).
--
-- 3 MLAs SEPARADOS (items simples → mercadolibre_variation_code = NULL). Precio/stock de
-- la API ML + SKU pasados por el founder. Todos $75.590 → 7559000c, stock 2 (total 6):
--   MBLK negro mate   SKU 116080 MLA1895280107 (PRIMARY)
--   SBLK negro brillo SKU 116083 MLA1895280109
--   L.ROSE rosa pálido SKU 116090 MLA3604894350
--
-- ⚠️ NO mencionar bluecut / filtro de luz azul en NINGÚN campo visible (criterio general
-- de receta del proyecto).
--
-- Peso 28,5g. Medidas: 142 / 55×48 / 17 / 145 mm (medidas.png). Bisagras plásticas
-- reforzadas → hinge_system "plastica" (precedente Katleen 53).
-- SKUs del founder únicos (116080/116083/116090) → sin sufijo.
--
-- SEO (seo-strategist): name = "Vulk Dieven Unisex" (NO "Rectangular" — el title arma
-- `${name} | Anteojos de receta - Óptica Carballo`, ~20 char de presupuesto; "rectangular"
-- como forma ya es primaria de Rusty R-CY 02 sitewide, no vale gastar ahí). Primaria real
-- = "anteojos recetados" (720, head compartido con Woxi/Trial/Peating/Kirt/Zinz/Patien,
-- no es canibalización real). "anteojos rectangulares" (480) queda SECUNDARIA (soporte,
-- no primaria — mismo criterio que Invig vs R-CY 02). Diferenciador: marca Vulk + unisex
-- explícito + bisagras plásticas 28,5g (vs los 3 Rusty). Cross-link obligatorio
-- Dieven↔R-CY02↔Woxi↔Invig (rectangulares receta) + /anteojos-de-receta/vulk.
--
-- CROSS-LINK sol↔receta: NO existe Dieven de SOL cargado (hay varios MLAs de sol activos
-- en ML — gris polarizado, rosa translúcido — pero grep en supabase/seeds confirma que no
-- están en el catálogo). Si se carga el sol como slug `vulk-dieven`, engancha solo.
--
-- 📸 FOTOS (bucket products/vulk-dieven-receta/, 7, verificadas 900×442 =
-- 2:1, naming inconsistente respetado tal cual — ojo espacio vs guion bajo en L.ROSE):
--   DIEVEN MBLK-116080-perfil.jpg / DIEVEN MBLK-116080-frente.jpg (negro mate, PRIMARY)
--   DIEVEN SBLK-116083-perfil.jpg / DIEVEN SBLK-116083-frente.jpg (negro brillo)
--   DIEVEN L.ROSE perfil.jpg / DIEVEN L.ROSE_frente.jpg (rosa pálido)
--   medidas.png (sort 99)
-- Scale 1.1 perfil / 1.0 frente (900×442 idéntico a Strewn/Kirt/Invig/Peating; reverificar
-- grid /anteojos-de-receta + /anteojos-de-receta/vulk, regla 15).
-- ============================================

BEGIN;

WITH
  vulk    AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM receta), 'vulk-dieven-receta', 'Vulk Dieven Unisex',
  'Vulk Dieven: anteojos recetados rectangulares unisex, ultra livianos (28,5g), bisagras plásticas reforzadas. Envío a todo el país y cuotas sin interés.',
  E'El **Vulk Dieven** es un armazón de receta **rectangular de bordes anchos, unisex**, ultra liviano (28,5 g), talle medium. Frente y patillas de **G-Flex** —flexible y resistente— con **bisagras plásticas reforzadas** para un calce cómodo y durable.\n\nMedidas: frente 142 mm · lente 55 mm de ancho × 48 mm de alto · puente 17 mm · varilla 145 mm.\n\nViene con lentes demo (sin graduación). Sumale tus cristales con receta: monofocales, bifocales, progresivos o multifocales.\n\nDisponible en 3 colores:\n\n• MBLK — negro mate.\n• SBLK — negro brillo.\n• L.ROSE — rosa pálido.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "rectangular",
    "temple_material": "g-flex",
    "hinge_system": "plastica",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "unisex",
    "line": "urbana",
    "measurements": {"frame_width_mm": 142, "lens_width_mm": 55, "lens_height_mm": 48, "bridge_mm": 17, "temple_length_mm": 145},
    "weight_grams": 28.5,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Rectangular unisex, ultra liviano (28,5 g)", "body": "Frente y patillas de G-Flex flexible con bisagras plásticas reforzadas. Forma rectangular de bordes anchos, para hombre o mujer, talle medium."},
      {"type": "tip", "position": "middle", "title": "Apto para tu graduación", "body": "Acepta lentes monofocales, bifocales, progresivos y multifocales. Si tenés dudas con tu receta, escribinos antes de comprar."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con foto de tu receta. Te pasamos el costo del laboratorio según tu graduación + tratamientos (antirreflex, fotocromático). Armazón + cristales en 7-10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1895280107", "MLA1895280109", "MLA3604894350"], "imported_at": "2026-07-14"}
  }'::jsonb,
  true, false,
  'Vulk Dieven Unisex | Anteojos de receta - Óptica Carballo',
  'Vulk Dieven: anteojos recetados rectangulares unisex, ultra livianos (28,5g), bisagras plásticas reforzadas. Envío a todo el país y cuotas sin interés.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = MBLK negro mate (primary). Items simples → variation_code = NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-dieven-receta'), '116080',
   '{"frame_color":"negro-mate","model_code":"MBLK OPTICAL"}'::jsonb,
   7559000, 2, true, 1, 'MLA1895280107', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-dieven-receta'), '116083',
   '{"frame_color":"negro-brillo","model_code":"SBLK OPTICAL"}'::jsonb,
   7559000, 2, true, 2, 'MLA1895280109', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-dieven-receta'), '116090',
   '{"frame_color":"rosa-palido","model_code":"L.ROSE OPTICAL"}'::jsonb,
   7559000, 2, true, 3, 'MLA3604894350', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = MBLK perfil. medidas SIEMPRE última (sort 99).
-- ⚠️ nombres EXACTOS del bucket (ojo espacio vs guion bajo en L.ROSE).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-dieven-receta'), (SELECT id FROM public.product_variants WHERE sku='116080'),
   'vulk-dieven-receta/DIEVEN MBLK-116080-perfil.jpg', 'Armazón de receta Vulk Dieven rectangular unisex vista lateral, negro mate', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-dieven-receta'), (SELECT id FROM public.product_variants WHERE sku='116080'),
   'vulk-dieven-receta/DIEVEN MBLK-116080-frente.jpg', 'Armazón de receta Vulk Dieven rectangular unisex vista frontal, negro mate', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-dieven-receta'), (SELECT id FROM public.product_variants WHERE sku='116083'),
   'vulk-dieven-receta/DIEVEN SBLK-116083-perfil.jpg', 'Armazón de receta Vulk Dieven rectangular unisex vista lateral, negro brillo', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-dieven-receta'), (SELECT id FROM public.product_variants WHERE sku='116083'),
   'vulk-dieven-receta/DIEVEN SBLK-116083-frente.jpg', 'Armazón de receta Vulk Dieven rectangular unisex vista frontal, negro brillo', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-dieven-receta'), (SELECT id FROM public.product_variants WHERE sku='116090'),
   'vulk-dieven-receta/DIEVEN L.ROSE perfil.jpg', 'Armazón de receta Vulk Dieven rectangular unisex vista lateral, rosa pálido', 900, 442, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-dieven-receta'), (SELECT id FROM public.product_variants WHERE sku='116090'),
   'vulk-dieven-receta/DIEVEN L.ROSE_frente.jpg', 'Armazón de receta Vulk Dieven rectangular unisex vista frontal, rosa pálido', 900, 442, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-dieven-receta'), NULL,
   'vulk-dieven-receta/medidas.png', 'Esquema técnico de medidas Vulk Dieven: frente 142mm, lente 55x48mm, puente 17mm, varilla 145mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
