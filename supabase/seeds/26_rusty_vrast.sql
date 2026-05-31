-- ============================================
-- Seed 26: Rusty Vrast (sol) — aviadores metal polarizados
-- Fecha: 2026-05-31
-- Origen: importado desde MLA2415985768 (Tienda Oficial OPTICACARBALLO 260502)
-- ============================================
-- Modelo Rusty Vrast: anteojos de sol aviadores unisex, armazón completo
-- en metal (frame + patillas + bisagras), lente policarbonato polarizado
-- UV400 categoría 3, 20g de peso, APTO para colocar lentes graduados.
--
-- 3 variantes en ML (el founder tiene fotos preparadas para C2 pero esa
-- variante NO está cargada en ML — sin SKU/precio/stock no se inserta;
-- cuando vuelva el stock + datos, seed adicional):
--
--   SKU 968450 — C1 Plateado con Lentes Verdes
--     ML variation 191413023401, stock 0
--   SKU 968452 — C3 Plateado con Lentes Gris Oscuro
--     ML variation 191413023405, stock 0
--   SKU 968453 — C4 Dorado con Lentes Marrones
--     ML variation 191413023403, stock 1 (única con stock real, default)
--
-- Datos extraídos del JSON ML (fetch via /api/admin/ml-import-preview):
--   price 85914.96 ARS → 8591496 centavos (aplica a las 3 variantes)
--   initial_quantity 42, available_quantity 1, sold 41
--
-- Medidas (imagen técnica del founder):
--   frame_width_mm: 145
--   lens_width_mm:  61
--   lens_height_mm: 51
--   bridge_mm:      16
--   temple_length_mm: 140
--
-- ============================================
-- 📸 FOTOS pendientes (founder sube al bucket `products/rusty-vrast/`):
--   VRAST C1 P-perfil.jpg   (variante C1 — lateral/perfil, primary)
--   VRAST C1 P-frente.jpg   (variante C1 — frontal)
--   VRAST C3 P-perfil.jpg   (variante C3 — lateral/perfil)
--   VRAST C3 P-frente.jpg   (variante C3 — frontal)
--   VRAST C4 P-perfil.jpg   (variante C4 — lateral/perfil)
--   VRAST C4 P-frente.jpg   (variante C4 — frontal)
--   medidas.jpg             (esquema técnico común, variant_id=NULL)
--
-- Foto primary del MODELO: VRAST C4 P-perfil.jpg (la única variante con
-- stock real → la default que aparece en grid de catálogo).
-- ============================================

BEGIN;

-- =====================================================================
-- Producto base — características COMUNES a las variantes
-- =====================================================================
WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (
    SELECT id FROM public.categories
    WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL
  )
INSERT INTO public.products (
  brand_id, category_id, slug, name,
  short_description, description, attributes,
  is_active, is_featured, meta_title, meta_description
)
VALUES (
  (SELECT id FROM rusty),
  (SELECT id FROM sol),
  'rusty-vrast',
  'Rusty Vrast',
  'Anteojos de sol aviadores unisex con armazón metálico completo, lentes polarizadas de policarbonato y protección UV400 categoría 3. 20g de peso, aptos para colocar lentes graduados.',
  E'Los Rusty Vrast son aviadores unisex pensados para uso urbano diario: paseo, manejo de día, salidas al aire libre. El diseño aviador con lente grande cubre bien el campo visual periférico, reduciendo el ingreso de luz lateral y la fatiga ocular en condiciones de sol intenso.\n\nEl armazón es completamente metálico: frente, patillas y bisagras. El metal aporta durabilidad estructural y un acabado premium característico del estilo aviador. El peso total es de 20 gramos, liviano para el tamaño del lente — no marca el puente de la nariz ni las orejas tras varias horas de uso.\n\nLas lentes son de policarbonato polarizado. La polarización elimina los reflejos del asfalto, agua, capots y vidrios — clave para manejo de día y actividades cerca del agua. Sumado a la protección UV400 categoría 3 (filtra el 100% de los rayos UVA y UVB y bloquea entre el 82% y el 92% de la luz visible), tu vista queda protegida en condiciones de sol intenso sin llegar al extremo de las categorías 4 (que NO se pueden usar manejando).\n\nUna característica importante: el Rusty Vrast es APTO para colocar lentes graduados. Esto significa que si tenés receta (miopía, hipermetropía, astigmatismo) y querés usar aviadores recetados, el armazón acepta el calzado de cristales con tu graduación. Si te interesa esta opción, escribinos por WhatsApp y te asesoramos sobre el laboratorio + costo.\n\nDisponible en 3 variantes:\n\n• Plateado con Lentes Verdes (C1 / SKU 968450):\nClásico atemporal. El armazón plateado mate combina con cualquier tono de piel y outfit, y las lentes verdes mantienen los colores naturales del entorno con un sutil contraste cálido.\n\n• Plateado con Lentes Gris Oscuro (C3 / SKU 968452):\nLa opción más urbana. El armazón plateado con lentes gris oscuro polarizado da un look más sobrio, ideal para uso formal o profesional. Las lentes gris oscuro neutralizan los colores manteniendo fidelidad cromática.\n\n• Dorado con Lentes Marrones (C4 / SKU 968453):\nLa opción más cálida y vintage. El armazón dorado con lentes marrones polarizadas evoca el aviador clásico de los años 70. Las lentes marrones mantienen la calidez de los colores del entorno, excelentes para días de sol fuerte.\n\nIncluye estuche original Rusty y franela de microfibra. Garantía oficial 1 año del fabricante contra defectos.',
  '{
    "frame_material": "metal",
    "frame_shape": "aviador",
    "temple_material": "metal",
    "hinge_material": "metal",
    "lens_material": "policarbonato",
    "lens_treatment": ["polarized", "uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "line": "urbana",
    "interchangeable_lenses": false,
    "prescription_adapter": true,
    "measurements": {
      "frame_width_mm": 145,
      "lens_width_mm": 61,
      "lens_height_mm": 51,
      "bridge_mm": 16,
      "temple_length_mm": 140
    },
    "weight_grams": 20,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {
        "type": "info",
        "position": "top",
        "title": "¿Por qué aviador?",
        "body": "El aviador grande cubre bien el campo visual periférico, reduciendo el ingreso de luz lateral. Es uno de los pocos estilos que funciona en rostros redondos, ovalados y cuadrados — la curvatura suave del lente equilibra cualquier forma de cara."
      },
      {
        "type": "recommendation",
        "position": "middle",
        "title": "Polarizado + UV400 categoría 3: qué significa",
        "body": "Polarizado elimina los reflejos del asfalto y agua (clave para manejo y deportes al aire libre). UV400 cat 3 filtra el 100% de UVA/UVB y bloquea entre 82-92% de la luz visible — fuerte para sol intenso pero seguro para manejar (la cat 4 NO se puede usar manejando)."
      },
      {
        "type": "tip",
        "position": "bottom",
        "title": "Apto para lentes graduados",
        "body": "Si tenés receta y querés usar aviadores con tu graduación, el Vrast acepta el calzado de cristales graduados. Escribinos por WhatsApp con tu receta y te pasamos costo + tiempos del laboratorio óptico."
      }
    ],
    "imported_from": {
      "marketplace": "mercadolibre",
      "item_id": "MLA2415985768",
      "imported_at": "2026-05-31"
    }
  }'::jsonb,
  true,
  false,
  'Rusty Vrast Anteojos Aviadores Polarizados Unisex | Óptica Carballo',
  'Anteojos Rusty Vrast aviadores unisex: armazón metal completo, lentes polarizadas policarbonato UV400, 20g. Aptos para lentes graduados. Plateado o dorado. Stock real y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name              = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description       = EXCLUDED.description,
  attributes        = EXCLUDED.attributes,
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  updated_at        = now();

-- =====================================================================
-- Variante 968450 — C1 Plateado con Lentes Verdes
-- ML variation 191413023401, stock 0
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'rusty-vrast'),
  '968450',
  '{
    "frame_color": "plateado",
    "lens_color": "verde",
    "model_code": "VRAST/C1",
    "polarized": true
  }'::jsonb,
  8591496,  -- $85.914,96
  0,        -- sin stock (ML available_quantity=0)
  true,
  1,
  'MLA2415985768',
  '191413023401'
)
ON CONFLICT (sku) DO UPDATE SET
  product_id                  = EXCLUDED.product_id,
  attributes                  = EXCLUDED.attributes,
  price_cents                 = EXCLUDED.price_cents,
  stock_qty                   = EXCLUDED.stock_qty,
  mercadolibre_item_id        = EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code = EXCLUDED.mercadolibre_variation_code,
  updated_at                  = now();

-- =====================================================================
-- Variante 968452 — C3 Plateado con Lentes Gris Oscuro
-- ML variation 191413023405, stock 0
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'rusty-vrast'),
  '968452',
  '{
    "frame_color": "plateado",
    "lens_color": "gris-oscuro",
    "model_code": "VRAST/C3",
    "polarized": true
  }'::jsonb,
  8591496,
  0,
  true,
  2,
  'MLA2415985768',
  '191413023405'
)
ON CONFLICT (sku) DO UPDATE SET
  product_id                  = EXCLUDED.product_id,
  attributes                  = EXCLUDED.attributes,
  price_cents                 = EXCLUDED.price_cents,
  stock_qty                   = EXCLUDED.stock_qty,
  mercadolibre_item_id        = EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code = EXCLUDED.mercadolibre_variation_code,
  updated_at                  = now();

-- =====================================================================
-- Variante 968453 — C4 Dorado con Lentes Marrones
-- ML variation 191413023403, stock 1 (ÚNICA CON STOCK — default visible)
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'rusty-vrast'),
  '968453',
  '{
    "frame_color": "dorado",
    "lens_color": "marron",
    "model_code": "VRAST/C4",
    "polarized": true
  }'::jsonb,
  8591496,
  1,        -- 1 unidad (única con stock real)
  true,
  3,
  'MLA2415985768',
  '191413023403'
)
ON CONFLICT (sku) DO UPDATE SET
  product_id                  = EXCLUDED.product_id,
  attributes                  = EXCLUDED.attributes,
  price_cents                 = EXCLUDED.price_cents,
  stock_qty                   = EXCLUDED.stock_qty,
  mercadolibre_item_id        = EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code = EXCLUDED.mercadolibre_variation_code,
  updated_at                  = now();

-- =====================================================================
-- Imágenes — 7 entries en bucket "products" path rusty-vrast/
-- 2 fotos por variante (perfil = primary lateral, frente = secondary).
-- Foto primary del MODELO: la de C4 (la única con stock).
-- Esquema técnico común (variant_id=NULL).
-- =====================================================================
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text,
  width, height, sort_order, is_primary
)
VALUES
  -- Variante C4 — Dorado (FIRST, es la default con stock)
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-vrast'),
    (SELECT id FROM public.product_variants WHERE sku = '968453'),
    'rusty-vrast/VRAST C4 P-perfil.jpg',
    'Rusty Vrast aviadores vista lateral 3/4, armazón metal dorado con lentes marrones polarizadas',
    1500, 1000, 0, true
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-vrast'),
    (SELECT id FROM public.product_variants WHERE sku = '968453'),
    'rusty-vrast/VRAST C4 P-frente.jpg',
    'Rusty Vrast aviadores vista frontal, armazón metal dorado con lentes marrones',
    1500, 1000, 1, false
  ),
  -- Variante C1 — Plateado/Verde
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-vrast'),
    (SELECT id FROM public.product_variants WHERE sku = '968450'),
    'rusty-vrast/VRAST C1 P-perfil.jpg',
    'Rusty Vrast aviadores vista lateral 3/4, armazón metal plateado con lentes verdes polarizadas',
    1500, 1000, 2, false
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-vrast'),
    (SELECT id FROM public.product_variants WHERE sku = '968450'),
    'rusty-vrast/VRAST C1 P-frente.jpg',
    'Rusty Vrast aviadores vista frontal, armazón metal plateado con lentes verdes',
    1500, 1000, 3, false
  ),
  -- Variante C3 — Plateado/Gris Oscuro
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-vrast'),
    (SELECT id FROM public.product_variants WHERE sku = '968452'),
    'rusty-vrast/VRAST C3 P-perfil.jpg',
    'Rusty Vrast aviadores vista lateral 3/4, armazón metal plateado con lentes gris oscuro polarizadas',
    1500, 1000, 4, false
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-vrast'),
    (SELECT id FROM public.product_variants WHERE sku = '968452'),
    'rusty-vrast/VRAST C3 P-frente.jpg',
    'Rusty Vrast aviadores vista frontal, armazón metal plateado con lentes gris oscuro',
    1500, 1000, 5, false
  ),
  -- Esquema técnico de medidas (común al modelo, variant_id=NULL)
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-vrast'),
    NULL,
    'rusty-vrast/medidas.jpg',
    'Esquema técnico de medidas Rusty Vrast: frente 145mm, lente 61x51mm, puente 16mm, varilla 140mm',
    1500, 1500, 6, false
  )
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id  = EXCLUDED.variant_id,
  alt_text    = EXCLUDED.alt_text,
  sort_order  = EXCLUDED.sort_order,
  is_primary  = EXCLUDED.is_primary,
  updated_at  = now();

COMMIT;
