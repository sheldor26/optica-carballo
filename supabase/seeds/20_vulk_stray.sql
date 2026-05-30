-- ============================================
-- Seed 20: Vulk Stray (receta) — armazón de receta gamer/casual
-- Fecha: 2026-05-30
-- Origen: importado desde MLA1824193366 (Tienda Oficial OPTICACARBALLO 260502)
-- ============================================
-- IMPORTANTE — diferencias respecto al listing ML:
--   - ML lo lista como "Filtro Luz Azul Gamer" con lentes blue block incluidas
--   - En NUESTRA web vendemos SOLO el armazón. Los lentes blue cut / filtro
--     luz azul se venden APARTE (servicio óptico aparte). NO mencionar
--     blue block / luz azul en la description del producto.
--   - El armazón es ideal para uso como armazón de receta común — el
--     comprador lleva el armazón a su óptico (o nosotros mismos) para
--     poner las lentes graduadas según su prescripción.
--
-- 4 variantes a cargar (founder confirmó SKUs):
--   - SKU 126890 MBLK — Negro Mate — stock 10 — variation 184005783781
--   - SKU 126891 SBLK — Negro Satinado — stock 0 — variation 183326295621
--   - SKU 126898 663 — Gris Oscuro Transparente (línea 663 Optics) — stock 9 — variation 188255939019
--   - SKU 126899 MDEMI-MBLK — Demi/Negro Mate — stock 1 — variation 191375477479
--
-- PENDIENTE confirmación founder: ML tiene 5ta variation "Gris" (185252770949,
-- stock 5) sin SKU asignado. Si va, agregar en seed 20.1.
--
-- Precio: $93.000 ARS (mismo para todas las variations en ML).
--
-- Founder sube 9 fotos al bucket `products/vulk-stray-receta/` con nombres EXACTOS:
--   01-mblk-lateral.jpg, 02-mblk-frontal.jpg
--   03-sblk-lateral.jpg, 04-sblk-frontal.jpg
--   05-663-lateral.jpg, 06-663-frontal.jpg
--   07-mdemi-mblk-lateral.jpg, 08-mdemi-mblk-frontal.jpg
--   09-medidas.jpg (común a todas las variantes)
-- ============================================

BEGIN;

-- =====================================================================
-- 1. Producto base — Vulk Stray armazón de receta
-- =====================================================================
WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  receta AS (
    SELECT id FROM public.categories
    WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL
  )
INSERT INTO public.products (
  brand_id, category_id, slug, name,
  short_description, description, attributes,
  is_active, is_featured, meta_title, meta_description
)
VALUES (
  (SELECT id FROM vulk),
  (SELECT id FROM receta),
  'vulk-stray',
  'Vulk Stray',
  'Armazón de receta unisex con líneas modernas y armazón liviano. Pensado para uso diario con lentes graduadas según tu prescripción.',
  E'El Vulk Stray es un armazón de receta unisex de líneas modernas, pensado para uso diario con lentes graduadas. Ideal para quienes buscan un armazón cómodo y versátil sin sacrificar estilo.\n\nEl armazón es liviano y resistente. La construcción está pensada para soportar uso intensivo del día a día sin perder forma — útil si lo llevás en bolso, mochila o cartera.\n\nEl frente es rectangular con líneas suaves que favorecen rostros de tamaño mediano. Funciona bien para ambos géneros y se adapta a uso casual u oficina.\n\nIMPORTANTE: el producto incluye SOLO el armazón. Las lentes graduadas se colocan aparte según tu receta oftalmológica. Te asesoramos sobre el tipo de lente más conveniente (monofocal, bifocal, multifocal, con filtro luz azul, etc.) según tu uso. Consultanos por WhatsApp tras la compra del armazón para coordinar el trabajo con tu prescripción.\n\nDisponible en 4 colores: Negro Mate (MBLK), Negro Satinado (SBLK), Gris Oscuro Transparente (663 Optics) y Demi/Negro Mate combinado (MDEMI-MBLK).\n\nIncluye estuche original Vulk, franela de microfibra y garantía oficial 1 año del fabricante contra defectos de armazón.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "rectangular",
    "lens_material": null,
    "lens_treatment": [],
    "gender": "unisex",
    "line": "receta",
    "is_prescription_frame": true,
    "includes_lenses": false,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "imported_from": {
      "marketplace": "mercadolibre",
      "item_id": "MLA1824193366",
      "imported_at": "2026-05-30",
      "note": "ML lo lista como filtro luz azul/gamer. En la web solo vendemos el armazón — lentes se cargan aparte."
    }
  }'::jsonb,
  true,
  false,
  'Vulk Stray Armazón de Receta Unisex | Óptica Carballo',
  'Armazón de receta Vulk Stray unisex rectangular. Liviano y resistente. Solo armazón — las lentes graduadas se cargan aparte. Asesoramiento óptico matriculado.'
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
-- 2a. Variante 126890 — MBLK (Negro Mate)
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'vulk-stray'),
  '126890',
  '{
    "frame_color": "negro-mate",
    "model_code": "MBLK"
  }'::jsonb,
  9300000,
  10,
  true,
  1,
  'MLA1824193366',
  '184005783781'
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
-- 2b. Variante 126891 — SBLK (Negro Satinado, sin stock)
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'vulk-stray'),
  '126891',
  '{
    "frame_color": "negro-satinado",
    "model_code": "SBLK"
  }'::jsonb,
  9300000,
  0,
  true,
  2,
  'MLA1824193366',
  '183326295621'
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
-- 2c. Variante 126898 — 663 (Gris Oscuro Transparente / 663 Optics)
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'vulk-stray'),
  '126898',
  '{
    "frame_color": "gris-oscuro-transparente",
    "model_code": "663"
  }'::jsonb,
  9300000,
  9,
  true,
  3,
  'MLA1824193366',
  '188255939019'
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
-- 2d. Variante 126899 — MDEMI-MBLK (Demi / Negro Mate combinado)
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'vulk-stray'),
  '126899',
  '{
    "frame_color": "demi-negro-mate",
    "model_code": "MDEMI-MBLK"
  }'::jsonb,
  9300000,
  1,
  true,
  4,
  'MLA1824193366',
  '191375477479'
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
-- 3. Imágenes — 9 archivos JPG en bucket "products"
-- Path canónico: vulk-stray-receta/<filename>
-- 2 fotos por variante (lateral + frontal) + 1 esquema de medidas global
-- =====================================================================
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text,
  width, height, sort_order, is_primary
)
VALUES
  -- MBLK 126890
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-stray'),
    (SELECT id FROM public.product_variants WHERE sku = '126890'),
    'vulk-stray-receta/01-mblk-lateral.jpg',
    'Vulk Stray armazón de receta vista lateral, color negro mate MBLK',
    1500, 1000, 0, true
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-stray'),
    (SELECT id FROM public.product_variants WHERE sku = '126890'),
    'vulk-stray-receta/02-mblk-frontal.jpg',
    'Vulk Stray vista frontal, armazón rectangular negro mate',
    1500, 1000, 1, false
  ),
  -- SBLK 126891
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-stray'),
    (SELECT id FROM public.product_variants WHERE sku = '126891'),
    'vulk-stray-receta/03-sblk-lateral.jpg',
    'Vulk Stray armazón de receta vista lateral, color negro satinado SBLK',
    1500, 1000, 0, true
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-stray'),
    (SELECT id FROM public.product_variants WHERE sku = '126891'),
    'vulk-stray-receta/04-sblk-frontal.jpg',
    'Vulk Stray vista frontal, armazón negro satinado',
    1500, 1000, 1, false
  ),
  -- 663 126898
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-stray'),
    (SELECT id FROM public.product_variants WHERE sku = '126898'),
    'vulk-stray-receta/05-663-lateral.jpg',
    'Vulk Stray armazón de receta vista lateral, color gris oscuro transparente línea 663',
    1500, 1000, 0, true
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-stray'),
    (SELECT id FROM public.product_variants WHERE sku = '126898'),
    'vulk-stray-receta/06-663-frontal.jpg',
    'Vulk Stray vista frontal, armazón gris oscuro transparente línea 663',
    1500, 1000, 1, false
  ),
  -- MDEMI-MBLK 126899
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-stray'),
    (SELECT id FROM public.product_variants WHERE sku = '126899'),
    'vulk-stray-receta/07-mdemi-mblk-lateral.jpg',
    'Vulk Stray armazón de receta vista lateral, combinación demi y negro mate MDEMI-MBLK',
    1500, 1000, 0, true
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-stray'),
    (SELECT id FROM public.product_variants WHERE sku = '126899'),
    'vulk-stray-receta/08-mdemi-mblk-frontal.jpg',
    'Vulk Stray vista frontal, armazón combinación demi y negro mate',
    1500, 1000, 1, false
  ),
  -- Medidas (común a todas, variant_id NULL)
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-stray'),
    NULL,
    'vulk-stray-receta/09-medidas.jpg',
    'Esquema técnico de medidas Vulk Stray',
    1500, 1500, 2, false
  )
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id  = EXCLUDED.variant_id,
  alt_text    = EXCLUDED.alt_text,
  sort_order  = EXCLUDED.sort_order,
  is_primary  = EXCLUDED.is_primary,
  updated_at  = now();

COMMIT;
