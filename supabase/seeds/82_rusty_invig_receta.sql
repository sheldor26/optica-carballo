-- ============================================
-- Seed 82: Rusty Invig Optics RECETA (armazón óptico) — rectangular hombre, metal
-- Fecha: 2026-07-07
-- ============================================
-- Armazón de receta RECTANGULAR HOMBRE de METAL, ultra liviano (14,7g). Frente metal;
-- patillas metal con terminales de acetato + bisagra de acero inoxidable (al callout).
-- Lentes demo. Categoría anteojos-de-receta. Convención receta: SOLO lens_compatibility
-- (SIN lens_material/treatment/category/polarized/uv — viene con lente demo).
--
-- 3 MLAs SEPARADOS (items simples → mercadolibre_variation_code = NULL; reconcilia por
-- mercadolibre_item_id). Precio/stock de la API ML + SKU pasados por el founder. Todos
-- $72.999 → 7299900c, stock 2 (total 6):
--   C2 negro mate    SKU 840071 MLA1878532277 (PRIMARY — color universal)
--   C1 marrón mate   SKU 840070 MLA1878532279
--   C3 gris oscuro mate SKU 840072 MLA1878519921
--
-- ⚠️ NO mencionar bluecut / filtro de luz azul en NINGÚN campo visible (founder explícito:
-- los cristales se venden aparte según receta; mismo criterio que Xold seed 31 / Zinz 78).
--
-- ⚠️ DISCREPANCIA de color: los nombres de foto del founder dicen C1 "BLUE" y C3 "PLATEADO",
-- pero ML nombra C1 "Marrón Mate" / C3 "Gris Oscuro Mate". Interpretación: "BLUE" = reflejo
-- del lente bluecut (no color de armazón). frame_color mapeado por ML, por C1/C2/C3 (coincide
-- con los SKUs del founder). PENDIENTE CONFIRMAR colores C1/C3 con el founder.
--
-- Peso 14,7g (founder — muy liviano). Medidas: 144 / 54×41 / 19 / 140 mm (de medidas.png).
-- frame_material + temple_material metal. Bisagra acero inox + terminales acetato → callout.
-- SKUs del founder únicos (840070/71/72) → sin sufijo.
--
-- SEO (seo-strategist): primaria de MARCA+GÉNERO `anteojos rusty hombre` (390/dif 9) — carril
-- ÚNICO (único rectangular masculino Rusty receta). NO usa `rectangulares` (es de R-CY 02) ni
-- `de metal` (es de Ther) como primaria — solo copy. Cross-link Invig↔Ther (redondo vs
-- rectangular metal) + Invig↔R-CY 02/Woxi. NO existe Invig de SOL → sin cross-link modalidad.
--
-- 📸 FOTOS: ⚠️ CARGA ABIERTA — bucket products/rusty-invig-receta/ VACÍO al escribir el seed
-- (founder sube después). Nombres crudos de la captura (C3 truncado → confirmar al subir):
--   INVIG_C2-perfil.jpg / INVIG_C2-frente.jpg              (PRIMARY, negro mate)
--   INVIG_C1-perfil.jpg / INVIG_C1_BLUE-_frente.jpg        (marrón mate; "BLUE"=reflejo lente)
--   INVIG_C3-PLATEADO-perfil.jpg / INVIG_C3-PLATEADO-frente.jpg  (gris oscuro; nombre a confirmar)
--   medidas.png (sort 99)
-- ~2:1 (900×442..461) → scale 1.1 perfil / 1.0 frente PROVISIONAL (como Zinz/Strewn). El bloque
-- de imágenes NO se aplica hasta que el founder suba las 7 fotos y se confirmen nombres + HTTP 200.
-- ============================================

BEGIN;

WITH
  rusty   AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-invig-receta', 'Rusty Invig Optics',
  'Anteojos recetados Rusty Invig: armazón rectangular de metal para hombre, ultra liviano (14,7 g). Frente y patillas de metal con bisagra de acero inoxidable. Comprás el armazón (viene con lentes demo, sin aumento) y le sumás los cristales según tu receta; el precio publicado es del armazón, los cristales se cotizan aparte.',
  E'El **Rusty Invig Optics** es un armazón de receta **rectangular de metal para hombre**, **ultra liviano** (solo 14,7 g). Frente y patillas de **metal**, con **bisagra de acero inoxidable** y terminales de acetato para un calce cómodo y durable.\n\nMedidas: frente 144 mm · lente 54 mm de ancho × 41 mm de alto · puente 19 mm · varilla 140 mm.\n\nViene con lentes demo (sin graduación). Sumale tus cristales con receta: monofocales, bifocales, progresivos o multifocales.\n\nDisponible en 3 colores mate:\n\n• C2 — negro mate.\n• C1 — marrón mate.\n• C3 — gris oscuro mate.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "metal",
    "frame_shape": "rectangular",
    "temple_material": "metal",
    "hinge_system": "metalica",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "male",
    "line": "urbana",
    "measurements": {"frame_width_mm": 144, "lens_width_mm": 54, "lens_height_mm": 41, "bridge_mm": 19, "temple_length_mm": 140},
    "weight_grams": 14.7,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Rectangular de metal, ultra liviano (14,7 g)", "body": "Frente y patillas de metal con bisagra de acero inoxidable y terminales de acetato. Forma rectangular para hombre, de los más livianos del catálogo."},
      {"type": "tip", "position": "middle", "title": "Apto para tu graduación", "body": "Acepta lentes monofocales, bifocales, progresivos y multifocales. Si tenés dudas con tu receta o querés saber si te sirve para progresivos, escribinos antes de comprar."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con foto de tu receta. Te pasamos el costo del laboratorio según tu graduación + tratamientos (antirreflex, blue light, fotocromático). Armazón + cristales en 7-10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1878532277", "MLA1878532279", "MLA1878519921"], "imported_at": "2026-07-07"}
  }'::jsonb,
  true, false,
  'Armazón de Receta Rusty Invig Hombre Metal | Óptica Carballo',
  'Anteojos Rusty para hombre: armazón de receta rectangular de metal, ultra liviano (14,7 g), en 3 colores mate. Original, envío a todo el país. Consultanos.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = C2 negro mate (primary). Items simples → variation_code = NULL.
-- frame_color por ML (⚠️ confirmar C1/C3 con founder). SKUs del founder (únicos).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-invig-receta'), '840071',
   '{"frame_color":"negro-mate","model_code":"C2 OPTICAL"}'::jsonb,
   7299900, 2, true, 1, 'MLA1878532277', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-invig-receta'), '840070',
   '{"frame_color":"marron-mate","model_code":"C1 OPTICAL"}'::jsonb,
   7299900, 2, true, 2, 'MLA1878532279', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-invig-receta'), '840072',
   '{"frame_color":"gris-oscuro-mate","model_code":"C3 OPTICAL"}'::jsonb,
   7299900, 2, true, 3, 'MLA1878519921', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = C2 perfil. medidas SIEMPRE última (sort 99).
-- ⚠️ CARGA ABIERTA: nombres crudos, C3 a confirmar al subir. NO aplicar este bloque hasta
-- que el founder suba las 7 fotos y se verifiquen los nombres exactos + HTTP 200.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-invig-receta'), (SELECT id FROM public.product_variants WHERE sku='840071'),
   'rusty-invig-receta/INVIG_C2-perfil.jpg', 'Anteojos de receta Rusty Invig rectangular de metal para hombre vista lateral, negro mate', 901, 458, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-invig-receta'), (SELECT id FROM public.product_variants WHERE sku='840071'),
   'rusty-invig-receta/INVIG_C2-frente.jpg', 'Anteojos de receta Rusty Invig rectangular de metal para hombre vista frontal, negro mate', 900, 457, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-invig-receta'), (SELECT id FROM public.product_variants WHERE sku='840070'),
   'rusty-invig-receta/INVIG_C1-perfil.jpg', 'Anteojos de receta Rusty Invig rectangular de metal para hombre vista lateral, marrón mate', 900, 449, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-invig-receta'), (SELECT id FROM public.product_variants WHERE sku='840070'),
   'rusty-invig-receta/INVIG_C1_BLUE-_frente.jpg', 'Anteojos de receta Rusty Invig rectangular de metal para hombre vista frontal, marrón mate', 900, 461, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-invig-receta'), (SELECT id FROM public.product_variants WHERE sku='840072'),
   'rusty-invig-receta/INVIG_C3-PLATEADO-perfil.jpg', 'Anteojos de receta Rusty Invig rectangular de metal para hombre vista lateral, gris oscuro mate', 900, 442, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-invig-receta'), (SELECT id FROM public.product_variants WHERE sku='840072'),
   'rusty-invig-receta/INVIG_C3-PLATEADO-frente.jpg', 'Anteojos de receta Rusty Invig rectangular de metal para hombre vista frontal, gris oscuro mate', 900, 442, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-invig-receta'), NULL,
   'rusty-invig-receta/medidas.png', 'Esquema técnico de medidas Rusty Invig: frente 144mm, lente 54x41mm, puente 19mm, varilla 140mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
