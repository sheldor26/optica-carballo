-- ============================================
-- Seed 81: Vulk Strewn RECETA (armazón óptico) — cuadrado femenino, G-Flex, transparente
-- Fecha: 2026-07-07
-- ============================================
-- Armazón de receta cuadrado FEMENINO, marco liviano (17,8g), talle small. Frente
-- G-Flex + bisagras flexo; viene con lentes demo. Categoría anteojos-de-receta.
-- Convención receta: lens_compatibility + hinge_system (SIN lens_material/treatment/
-- polarized). Molde: 53_vulk_katleen_receta (gemelo cuadrado femenino) + patrón
-- 3-MLAs-separados de 73_vulk_bennie_51 (var_code NULL, reconcilia por item_id).
--
-- 3 MLAs SEPARADOS (items simples, NO multi-variación pese al catálogo MLAU4253331944).
-- Todos $80.190 → 8019000c, stock 2 (total 6):
--   MBLK  negro mate.            MLA1878507183 (PRIMARY). SKU placeholder STREWN-MBLK.
--   CRY   transparente cristal.  MLA1878518671. SKU placeholder STREWN-CRY.
--   M.ROSE rosa transparente.    MLA1878507185. SKU placeholder STREWN-MROSE.
-- ⚠️ ML no trae SKU y el founder no los pasó → placeholders descriptivos (patrón
-- Katleen KATLEEN-MDEMI). El sync de stock usa mercadolibre_item_id (var_code NULL),
-- NO el SKU → placeholders no bloquean. Al pasar los SKU reales: UPDATE por item_id
-- (NO re-insert, el ON CONFLICT(sku) crearía filas nuevas).
--
-- Medidas (medidas.png): frente 134 / lente 50×45 / puente 18 / patilla 145. Peso 17,8g.
--
-- SEO (seo-strategist): primaria = carril TRANSPARENTE `anteojos transparentes mujer`
-- (390/mes) — NO la forma (esa la defiende Katleen). Diferenciador: colores CRY cristal +
-- M.ROSE rosa transparente + small 17,8g. Cross-link obligatorio Strewn↔Katleen.
-- NO existe Strewn de SOL → sin cross-link modalidad. No hay faceta receta/cuadrado ni
-- /transparentes → linking por marca+mujer.
--
-- 📸 FOTOS (bucket products/vulk-strewn-receta/, verificadas HTTP 200; naming inconsistente
-- respetado tal cual — ojo espacios de MROSE):
--   STREWN-MBLK - PERFIL-GALERIA.jpg / STREWN-MBLK - FRENTE-GALERIA.jpg  (900×442, PRIMARY)
--   STREWN CRY perfil.jpg / STREWN CRY frente.jpg                        (⚠️ 5365×3577 — 3:2)
--   STREWN-MROSE -PERFIL-GALERIA.jpg / STREWN-MROSE - FRENTE.jpg         (900×442)
--   medidas.png (sort 99)
-- Scale: MBLK/MROSE 1.1/1.0 (900×442 baseline receta); CRY 1.2/1.05 (full-res 3:2, más
-- margen → más scale). PROVISIONAL — reverificar CRY vs 2:1 en el grid (regla 15).
--
-- ⬜ Defaults del asistente a confirmar por founder: (a) 3 SKUs reales; (b) temple_material
-- g-flex (asumido, la ficha solo aclaró la bisagra); (c) hero = MBLK; (d) recommended_face_shapes
-- omitido (como Katleen).
-- ============================================

BEGIN;

WITH
  vulk    AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM receta), 'vulk-strewn-receta', 'Vulk Strewn Receta',
  'Armazón de receta Vulk Strewn: cuadrado femenino en colores transparentes, marco liviano (17,8g), talle small. Apto monofocal, bifocal y progresivo. Viene con lentes demo.',
  E'Es un armazón de receta **cuadrado femenino** en tonos **transparentes**, moderno y delicado. El frente es de **G-Flex** —flexible y **muy liviano** (17,8 g)— con **sistema de bisagras flexo**, para usarlo todo el día sin que marque. Talle small.\n\nViene con lentes demo (sin graduación). Acepta tu receta: monofocales, bifocales y progresivos.\n\nDisponible en 3 colores:\n\n• MBLK: negro mate.\n• CRY: transparente cristal.\n• M.ROSE: rosa transparente.\n\nSumale tus cristales con receta. Incluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "cuadrado",
    "temple_material": "g-flex",
    "hinge_system": "flex",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "female",
    "line": "urbana",
    "measurements": {"frame_width_mm": 134, "lens_width_mm": 50, "lens_height_mm": 45, "bridge_mm": 18, "temple_length_mm": 145},
    "weight_grams": 17.8,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado femenino transparente y liviano", "body": "Armazón cuadrado femenino en G-Flex flexible, de solo 17,8 g. Colores transparentes (cristal y rosa) más negro mate. Sistema de bisagras flexo, talle small."},
      {"type": "tip", "position": "middle", "title": "Compatible con tu receta", "body": "Acepta monofocales, bifocales y progresivos. Para progresivos tené en cuenta que el alto del lente es 45 mm — escribinos si tenés dudas con tu graduación."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con foto de tu receta. Te pasamos el costo del laboratorio según tu graduación + tratamientos (antirreflex, blue light, fotocromático). Armazón + cristales en 7-10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1878507183", "MLA1878518671", "MLA1878507185"], "imported_at": "2026-07-07"}
  }'::jsonb,
  true, false,
  'Vulk Strewn Armazón de Receta Cuadrado Transparente Mujer | Óptica Carballo',
  'Armazón de receta Vulk Strewn: anteojos cuadrados transparentes para mujer, ultra livianos (17,8g), talle small. 3 colores. Envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = MBLK (primary). 3 MLAs simples → var_code NULL. SKU placeholder.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-strewn-receta'), 'STREWN-MBLK',
   '{"frame_color":"negro-mate","model_code":"MBLK OPTICAL"}'::jsonb,
   8019000, 2, true, 1, 'MLA1878507183', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-strewn-receta'), 'STREWN-CRY',
   '{"frame_color":"transparente-cristal","model_code":"CRY OPTICAL"}'::jsonb,
   8019000, 2, true, 2, 'MLA1878518671', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-strewn-receta'), 'STREWN-MROSE',
   '{"frame_color":"rosa-transparente","model_code":"M.ROSE OPTICAL"}'::jsonb,
   8019000, 2, true, 3, 'MLA1878507185', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: MBLK perfil. Perfil = primaria de cada variante.
-- ⚠️ nombres EXACTOS del bucket (ojo espacios de MROSE). medidas.png sort 99.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-strewn-receta'), (SELECT id FROM public.product_variants WHERE sku='STREWN-MBLK'),
   'vulk-strewn-receta/STREWN-MBLK - PERFIL-GALERIA.jpg', 'Armazón de receta Vulk Strewn cuadrado femenino vista lateral, negro mate', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-strewn-receta'), (SELECT id FROM public.product_variants WHERE sku='STREWN-MBLK'),
   'vulk-strewn-receta/STREWN-MBLK - FRENTE-GALERIA.jpg', 'Armazón de receta Vulk Strewn cuadrado femenino vista frontal, negro mate', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-strewn-receta'), (SELECT id FROM public.product_variants WHERE sku='STREWN-CRY'),
   'vulk-strewn-receta/STREWN CRY perfil.jpg', 'Armazón de receta Vulk Strewn cuadrado femenino vista lateral, transparente cristal', 5365, 3577, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-strewn-receta'), (SELECT id FROM public.product_variants WHERE sku='STREWN-CRY'),
   'vulk-strewn-receta/STREWN CRY frente.jpg', 'Armazón de receta Vulk Strewn cuadrado femenino vista frontal, transparente cristal', 5365, 3577, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-strewn-receta'), (SELECT id FROM public.product_variants WHERE sku='STREWN-MROSE'),
   'vulk-strewn-receta/STREWN-MROSE -PERFIL-GALERIA.jpg', 'Armazón de receta Vulk Strewn cuadrado femenino vista lateral, rosa transparente', 900, 442, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-strewn-receta'), (SELECT id FROM public.product_variants WHERE sku='STREWN-MROSE'),
   'vulk-strewn-receta/STREWN-MROSE - FRENTE.jpg', 'Armazón de receta Vulk Strewn cuadrado femenino vista frontal, rosa transparente', 900, 442, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-strewn-receta'), NULL,
   'vulk-strewn-receta/medidas.png', 'Esquema técnico de medidas Vulk Strewn: frente 134mm, lente 50x45mm, puente 18mm, patilla 145mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
