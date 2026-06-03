-- ============================================
-- Seed 46: Rusty Eslav (sol) — deportivo envolvente, G-Flex, polarizado
-- Fecha: 2026-06-02
-- ============================================
-- Anteojo de sol DEPORTIVO envolvente (ciclistas, runners). Armazón G-Flex,
-- bisagras plásticas, base 8. Lentes de policarbonato POLARIZADAS UV400 cat3.
-- Incluye 1 par de lentes AMARILLAS intercambiables + adaptador interno
-- extraíble para lentes graduadas (interchangeable_lenses + prescription_adapter).
--
-- 2 variantes en 2 MLAs (publicaciones simples). AMBAS polarizadas → producto
-- lens_treatment ["uv400","polarized"] (sí aparece en /polarizados). Stock=ML:
--   SKU 126060 — MBLK/S10 POL          negro mate + gris oscuro (+ amarilla). MLA1423923051. $98.350,02, stock 14 (activa, mayor → primary).
--   SKU 126062 — MBLUE/R.GREEN POL     azul mate + verde espejado (+ amarilla). MLA1856270534. $103.902, stock 0 (pausada).
--
-- Medidas: 138 / 75x51 / 12 / 120 mm. Base 8.
--
-- 📸 FOTOS (bucket products/rusty-eslav/, nombres del screenshot del founder):
--   MBLK-S10-YELLOW---PERFIL.jpg / MBLK-S10-YELLOW---FRENTE.jpg  (MBLK/S10 — perfil primary del modelo)
--   MBLUE-R-GREEN-POL-YELLOW-PERFIL.jpg / MBLUE-R-GREEN-POL-YELLOW-FRENTE.jpg
--   medidas.jpg
--   ⚠️ OJO: NO confundir con `rusty-sotion/` — Sotion (producto existente) tiene
--      fotos de nombre casi idéntico (MBLUE-R-GREEN-POL-YELLOW, MBLK-S10-POL-YELLOW).
--      Las de Eslav DEBEN ir en `rusty-eslav/`. Verificar HTTP 200 antes de aplicar.
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-eslav', 'Rusty Eslav',
  'Anteojos de sol deportivos Rusty Eslav: diseño envolvente, armazón G-Flex, lentes de policarbonato polarizadas UV400 categoría 3. Incluyen un par de lentes amarillas intercambiables y adaptador para lentes recetados.',
  E'Los Rusty Eslav son anteojos de sol deportivos de diseño envolvente, ideales para ciclismo, running y deportes al aire libre. El armazón es de G-Flex —liviano, flexible y resistente— con bisagras plásticas y base 8 para una cobertura envolvente que protege del sol y el viento.\n\nLas lentes son de policarbonato POLARIZADAS, con protección UV400 (100% UVA/UVB), categoría 3: eliminan los reflejos del asfalto y el agua para una visión más nítida y segura en movimiento.\n\nIncluyen un **par de lentes amarillas intercambiables** (ideales para días nublados o poca luz) y un **adaptador interno extraíble** para colocar lentes recetados si lo necesitás.\n\nDisponible en 2 variantes:\n\n• MBLK/S10 POL (SKU 126060): negro mate con lente gris oscuro polarizada.\n• MBLUE/R.GREEN POL (SKU 126062): azul mate con lente verde espejada polarizada.\n\nIncluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "envolvente",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400", "polarized"],
    "gender": "unisex",
    "line": "deportiva",
    "interchangeable_lenses": true,
    "prescription_adapter": true,
    "measurements": {"frame_width_mm": 138, "lens_width_mm": 75, "lens_height_mm": 51, "bridge_mm": 12, "temple_length_mm": 120},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Deportivo polarizado, 2 lentes en 1", "body": "Diseño envolvente base 8 para ciclismo y running. Vienen con lentes polarizadas (eliminan reflejos) MÁS un par de lentes amarillas intercambiables para días nublados o poca luz."},
      {"type": "recommendation", "position": "middle", "title": "¿También con tu graduación?", "body": "Traen un adaptador interno extraíble: si usás lentes recetados, se pueden colocar. Consultanos para coordinar la graduación."},
      {"type": "tip", "position": "bottom", "title": "Para que duren", "body": "Guardalos en el estuche y limpiá solo con la franela de microfibra. Después de entrenar cerca del mar o con transpiración, enjuagalos con agua dulce."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1423923051", "MLA1856270534"], "imported_at": "2026-06-02"}
  }'::jsonb,
  true, false,
  'Rusty Eslav Anteojos de Sol Deportivos Polarizados Envolvente | Óptica Carballo',
  'Anteojos Rusty Eslav deportivos envolventes: G-Flex, policarbonato polarizado UV400, lentes amarillas intercambiables + adaptador para receta. Stock real y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-eslav'), '126060',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   9835002, 14, true, 1, 'MLA1423923051', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-eslav'), '126062',
   '{"frame_color":"azul-mate","lens_color":"verde-espejado","model_code":"MBLUE/R.GREEN POL","polarized":true}'::jsonb,
   10390200, 0, true, 2, 'MLA1856270534', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: MBLK/S10 perfil (mayor stock). Perfil = primaria de cada variante.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-eslav'), (SELECT id FROM public.product_variants WHERE sku='126060'),
   'rusty-eslav/MBLK-S10-YELLOW---PERFIL.jpg', 'Anteojo de sol deportivo Rusty Eslav envolvente vista lateral, negro mate con lente gris oscuro polarizada', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-eslav'), (SELECT id FROM public.product_variants WHERE sku='126060'),
   'rusty-eslav/MBLK-S10-YELLOW---FRENTE.jpg', 'Anteojo de sol deportivo Rusty Eslav envolvente vista frontal, negro mate con lente gris oscuro polarizada', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-eslav'), (SELECT id FROM public.product_variants WHERE sku='126062'),
   'rusty-eslav/MBLUE-R-GREEN-POL-YELLOW-PERFIL.jpg', 'Anteojo de sol deportivo Rusty Eslav envolvente vista lateral, azul mate con lente verde espejada polarizada', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-eslav'), (SELECT id FROM public.product_variants WHERE sku='126062'),
   'rusty-eslav/MBLUE-R-GREEN-POL-YELLOW-FRENTE.jpg', 'Anteojo de sol deportivo Rusty Eslav envolvente vista frontal, azul mate con lente verde espejada polarizada', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-eslav'), NULL,
   'rusty-eslav/medidas.jpg', 'Esquema técnico de medidas Rusty Eslav: frente 138mm, lente 75x51mm, puente 12mm, varilla 120mm', 1500, 1500, 4, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
