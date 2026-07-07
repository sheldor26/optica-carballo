-- ============================================
-- Seed 83: Vulk Kirt Optics RECETA (armazón óptico) — redondo unisex, metal
-- Fecha: 2026-07-07
-- ============================================
-- Armazón de receta REDONDO UNISEX de METAL, liviano (17,5g), talle medium. Frente
-- metal; patilla Monel con terminal de acetato + bisagras integradas (al callout).
-- Lentes demo. Categoría anteojos-de-receta. Convención receta: SOLO lens_compatibility
-- (SIN lens_material/treatment/category/polarized/uv — viene con lente demo).
-- Molde: 75_rusty_ther_receta (gemelo redondo metal receta) + patrón 2-MLAs-separados
-- de 78_rusty_zinz (var_code NULL, reconcilia por item_id).
--
-- 2 MLAs SEPARADOS (items simples → mercadolibre_variation_code = NULL). Precio/stock de
-- la API ML + SKU pasados por el founder. Ambos $74.990 → 7499000c, stock 2 (total 4):
--   LG  dorado SKU 128870 MLA3572693800 (PRIMARY)
--   MDB cobre  SKU 128871 MLA3572693798
--
-- ⚠️ NO mencionar bluecut / filtro de luz azul en NINGÚN campo visible (founder explícito:
-- los cristales se venden aparte; mismo criterio que Xold/Zinz/Invig).
--
-- "Monel" (aleación) NO es valor de enum temple_material → va al copy/callout, campo = "metal"
-- (precedente Biller). Bisagras integradas → hinge_system "integrada" (precedente Clems 57).
-- Peso 17,5g. Medidas: 138 / 42×45 / 22 / 140 mm (medidas.png; lente 42 ancho × 45 ALTO).
-- SKUs del founder únicos (128870/128871) → sin sufijo.
--
-- SEO (seo-strategist): primaria MATERIAL `anteojos de metal` (210) / `lentes de metal` (260)
-- — diferencia de My Crew (Vulk redondo G-Flex). Forma `anteojos redondos` (880) SECUNDARIA
-- (la lidera Ther cross-brand → leads invertidos: Ther=forma, Kirt=material). Cross-link
-- obligatorio Kirt↔Ther. Único Vulk redondo de metal.
--
-- CROSS-LINK sol↔receta: NO existe Kirt de SOL cargado (el sol MLA2027787798 está PAUSADO,
-- sin seed). El mecanismo (queries.ts:548) busca el par quitando "-receta" del slug → si más
-- adelante se carga el sol con slug `vulk-kirt`, engancha solo. Hoy no muestra par.
--
-- 📸 FOTOS (bucket products/vulk-kirt-receta/, 5, verificadas 900×442 = 2:1, nombres limpios):
--   KIRT-LG-PERFIL.jpg / KIRT-LG-FRENTE.jpg (dorado, PRIMARY)
--   KIRT-MDB-PERFIL.jpg / KIRT-MDB-FRENTE.jpg (cobre)
--   medidas.png (sort 99)
-- Scale 1.1 perfil / 1.0 frente (900×442 idéntico a Ther; reverificar grid, regla 15).
-- ============================================

BEGIN;

WITH
  vulk    AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM receta), 'vulk-kirt-receta', 'Vulk Kirt Optics',
  'Anteojos recetados Vulk Kirt: armazón redondo de metal, unisex y liviano (17,5 g), talle medium. Frente de metal con patillas Monel y bisagras integradas. Comprás el armazón (viene con lentes demo, sin aumento) y le sumás los cristales según tu receta; el precio publicado es del armazón, los cristales se cotizan aparte.',
  E'El **Vulk Kirt Optics** es un armazón de receta **redondo de metal**, **unisex** y liviano (17,5 g), talle medium. Frente de **metal** con **patillas de Monel** y terminales de acetato, y **bisagras integradas** para un calce cómodo y durable.\n\nMedidas: frente 138 mm · lente 42 mm de ancho × 45 mm de alto · puente 22 mm · varilla 140 mm.\n\nViene con lentes demo (sin graduación). Sumale tus cristales con receta: monofocales, bifocales, progresivos o multifocales.\n\nDisponible en 2 colores:\n\n• LG — dorado.\n• MDB — cobre.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "metal",
    "frame_shape": "redondo",
    "temple_material": "metal",
    "hinge_system": "integrada",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "unisex",
    "line": "urbana",
    "measurements": {"frame_width_mm": 138, "lens_width_mm": 42, "lens_height_mm": 45, "bridge_mm": 22, "temple_length_mm": 140},
    "weight_grams": 17.5,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Redondo de metal, unisex y liviano (17,5 g)", "body": "Frente de metal con patillas de Monel, terminales de acetato y bisagras integradas. Forma redonda, para hombre o mujer, talle medium."},
      {"type": "tip", "position": "middle", "title": "Apto para tu graduación", "body": "Acepta lentes monofocales, bifocales, progresivos y multifocales. Si tenés dudas con tu receta o querés saber si te sirve para progresivos, escribinos antes de comprar."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con foto de tu receta. Te pasamos el costo del laboratorio según tu graduación + tratamientos (antirreflex, blue light, fotocromático). Armazón + cristales en 7-10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA3572693800", "MLA3572693798"], "imported_at": "2026-07-07"}
  }'::jsonb,
  true, false,
  'Armazón de Receta Vulk Kirt Redondo Metal | Óptica Carballo',
  'Armazón de receta Vulk Kirt: redondo de metal, unisex y liviano (17,5g), talle medium. Apto monofocal y multifocal. 2 colores. Envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = LG dorado (primary). Items simples → variation_code = NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-kirt-receta'), '128870',
   '{"frame_color":"dorado","model_code":"LG OPTICAL"}'::jsonb,
   7499000, 2, true, 1, 'MLA3572693800', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-kirt-receta'), '128871',
   '{"frame_color":"cobre","model_code":"MDB OPTICAL"}'::jsonb,
   7499000, 2, true, 2, 'MLA3572693798', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = LG perfil. medidas SIEMPRE última (sort 99).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-kirt-receta'), (SELECT id FROM public.product_variants WHERE sku='128870'),
   'vulk-kirt-receta/KIRT-LG-PERFIL.jpg', 'Armazón de receta Vulk Kirt redondo de metal unisex vista lateral, dorado', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-kirt-receta'), (SELECT id FROM public.product_variants WHERE sku='128870'),
   'vulk-kirt-receta/KIRT-LG-FRENTE.jpg', 'Armazón de receta Vulk Kirt redondo de metal unisex vista frontal, dorado', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-kirt-receta'), (SELECT id FROM public.product_variants WHERE sku='128871'),
   'vulk-kirt-receta/KIRT-MDB-PERFIL.jpg', 'Armazón de receta Vulk Kirt redondo de metal unisex vista lateral, cobre', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-kirt-receta'), (SELECT id FROM public.product_variants WHERE sku='128871'),
   'vulk-kirt-receta/KIRT-MDB-FRENTE.jpg', 'Armazón de receta Vulk Kirt redondo de metal unisex vista frontal, cobre', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-kirt-receta'), NULL,
   'vulk-kirt-receta/medidas.png', 'Esquema técnico de medidas Vulk Kirt: frente 138mm, lente 42x45mm, puente 22mm, varilla 140mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
