-- ============================================
-- Seed 68: Rusty Blinded SOL — REDONDO unisex, G-Flex, 2 colores (ninguna polarizada)
-- Fecha: 2026-06-13
-- ============================================
-- Anteojos de SOL REDONDOS unisex, livianos (22,7g). Frente y patillas G-Flex,
-- bisagras metálicas con sistema flex (callout). Lentes policarbonato 100% UV.
-- AMBAS variantes NO polarizadas, con ANTIRREFLEJO en cara interna (feature del
-- modelo → va al callout/descripción; "antirreflejo-interno" NO es valor del enum
-- lens_treatment, que es polarized|uv400|gradient|mirrored|photochromic).
-- 2 MLAs SEPARADOS (items simples → variation_code NULL). Precio/stock de la API ML:
--   MBLK/S10           SKU 129103 MLA2053425698 $73.661,17 stock 8 (PRIMARY, negro mate, gris)
--   MDEMI-MBLK/BROWN   SKU 129105 MLA2706865638 $73.957,00 stock 0 paused (carey mate frente + patillas
--                      negro mate, lente marrón). ⚠️ founder escribió SKU "29105" → asumido 129105 (confirmar).
--                      stock 0 + is_active=true por regla "todas aunque 0"; ⚠️ confirmar que paused = sin stock
--                      temporal y NO discontinuada (si discontinuada → is_active=false).
--
-- frame_shape="round" (enum schema; los 5 seeds con "redondo" están en deuda — no replicar).
-- Default sol: lens_material policarbonato / lens_treatment ["uv400"] / lens_category 3.
-- weight_grams 22.7. Medidas: 130 / 48x43 / 22 / 145 mm (de la foto).
--
-- 📸 FOTOS: ⚠️ NO subidas aún al cargar (bucket rusty-blinded/ vacío). Naming esperado
-- (F=frente, P=perfil): BLINDED_MBLK-S10_F_GALERIA.jpg / _P_GALERIA.jpg ;
-- BLINDED_MDEMI-MBLK_BROWN_-_F.jpg / _-_P.jpg ; medidas.webp. Primaria = perfil MBLK/S10.
-- Scale perfil 1.15 / frente 1.0 PROVISIONAL (redondo lente 48mm chico → puede necesitar
-- más; CONFIRMAR visual cuando el founder suba las fotos). dims 900×442 estimadas.
-- ============================================

BEGIN;

WITH
  rusty   AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol     AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-blinded', 'Rusty Blinded',
  'Anteojos de sol redondos Rusty Blinded: armazón unisex en G-Flex, ultralivianos (22,7 g) con lentes de policarbonato UV400 categoría 3 y antirreflejo interior. Disponibles en carey y negro mate.',
  E'Los **Rusty Blinded** son anteojos de sol **redondos unisex**, ultralivianos (22,7 g). Frente y patillas de **G-Flex** —flexible y resistente— con **bisagras metálicas de sistema flex**. **Lentes de policarbonato con protección UV400 (categoría 3)** y **capa antirreflejo en la cara interna** en las dos versiones (reduce los reflejos molestos que entran por detrás de la lente).\n\nMedidas: frente 130 mm · lente 48 mm de ancho × 43 mm de alto · puente 22 mm · varilla 145 mm. Peso 22,7 g.\n\nDisponible en 2 versiones:\n\n• MBLK/S10 — negro mate, lente gris oscuro.\n• MDEMI-MBLK/Brown — frente carey mate con patillas negro mate, lente marrón.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "round",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "line": "urbana",
    "measurements": {"frame_width_mm": 130, "lens_width_mm": 48, "lens_height_mm": 43, "bridge_mm": 22, "temple_length_mm": 145},
    "weight_grams": 22.7,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Redondo unisex liviano (22,7 g)", "body": "Frente y patillas de G-Flex flexible con bisagras metálicas de sistema flex. Forma redonda, lentes de policarbonato UV400 categoría 3."},
      {"type": "tip", "position": "middle", "title": "Antirreflejo en cara interna", "body": "Las dos versiones traen capa antirreflejo en la cara interna de la lente: corta los reflejos que entran por detrás y molestan, sobre todo con el sol bajo o de costado."},
      {"type": "recommendation", "position": "bottom", "title": "100% protección UV", "body": "Ambas versiones bloquean el 100% de los rayos UV (UV400). Si dudás cuál te conviene, escribinos por WhatsApp y te asesoramos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2053425698", "MLA2706865638"], "imported_at": "2026-06-13"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Rusty Blinded Redondos - Óptica Carballo',
  'Anteojos de sol Rusty Blinded redondos, unisex y livianos (22,7 g). Carey o negro mate, UV400 cat. 3. Envíos a toda Argentina. Pedí asesoramiento.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = MBLK/S10 (primary, +stock). 2 MLAs simples → variation_code NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-blinded'), '129103',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10","polarized":false}'::jsonb,
   7366117, 8, true, 1, 'MLA2053425698', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-blinded'), '129105',
   '{"frame_color":"carey-negro","lens_color":"marron","model_code":"MDEMI-MBLK/BROWN","polarized":false}'::jsonb,
   7395700, 0, true, 2, 'MLA2706865638', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = MBLK/S10 perfil. medidas SIEMPRE última. (paths esperados; 404 hasta subir)
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-blinded'), (SELECT id FROM public.product_variants WHERE sku='129103'),
   'rusty-blinded/BLINDED_MBLK-S10_P_GALERIA.jpg', 'Anteojos de sol Rusty Blinded redondos unisex vista lateral, negro mate lente gris', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-blinded'), (SELECT id FROM public.product_variants WHERE sku='129103'),
   'rusty-blinded/BLINDED_MBLK-S10_F_GALERIA.jpg', 'Anteojos de sol Rusty Blinded redondos unisex vista frontal, negro mate lente gris', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-blinded'), (SELECT id FROM public.product_variants WHERE sku='129105'),
   'rusty-blinded/BLINDED_MDEMI-MBLK_BROWN_-_P.jpg', 'Anteojos de sol Rusty Blinded redondos unisex vista lateral, carey mate con patillas negro mate lente marrón', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-blinded'), (SELECT id FROM public.product_variants WHERE sku='129105'),
   'rusty-blinded/BLINDED_MDEMI-MBLK_BROWN_-_F.jpg', 'Anteojos de sol Rusty Blinded redondos unisex vista frontal, carey mate con patillas negro mate lente marrón', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-blinded'), NULL,
   'rusty-blinded/medidas.webp', 'Esquema técnico de medidas Rusty Blinded: frente 130mm, lente 48x43mm, puente 22mm, varilla 145mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
