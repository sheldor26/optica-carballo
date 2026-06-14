-- ============================================
-- Seed 69: Rusty And Now SOL — ENVOLVENTE/deportivo unisex, G-Flex, 3 colores (2 pol)
-- Fecha: 2026-06-13
-- ============================================
-- Anteojos de SOL ENVOLVENTES/deportivos (wraparound) unisex. Frente y patillas G-Flex,
-- bisagras plásticas. Lentes policarbonato 100% UV. 3 MLAs SEPARADOS (items simples →
-- variation_code NULL). Precio/stock de la API ML (scripts/ml-item.ts):
--   SBLK/S10 POL    SKU 16118 MLA1382577721 $93.631,97 stock 8 (PRIMARY, negro brillo, gris, POLARIZADO)
--   MBLK/S10 POL    SKU 16122 MLA1382580349 $93.631,97 stock 6 (negro mate, gris, POLARIZADO)
--   MBLK/REVO BLUE  SKU 1110  MLA1543226618 $89.630,04 stock 5 (negro mate, espejada azul, NO pol, antirreflejo interior)
-- (SKUs cortos — son los del founder, tal cual.)
--
-- frame_shape="envolvente" + line="deportiva" (como Esvep seed 58; mapea a /anteojos-de-sol/
-- deportivos vía brand-filters; NO está en el enum inglés del doc pero es la convención real).
-- 2 polarized:true → /polarizados. Revo: polarized:false + lens_color "espejado-azul" (el
-- espejado va en lens_color; NO meto "antirreflejo-interno" en lens_treatment — no es valor
-- del enum; el AR interno de la revo se menciona en la descripción, es de 1 sola variante).
-- Default sol: lens_material policarbonato / lens_treatment ["uv400"] / lens_category 3.
-- weight_grams OMITIDO (ML no da → lista de pesos pendientes en BACKLOG).
--
-- Medidas: 140 / 64x39 / 18 / 108 mm (de la foto). ⚠️ varilla 108mm es corta (wraparound;
-- Esvep tiene 130) — cargada según la foto, founder puede reconfirmar.
--
-- 📸 FOTOS: ⚠️ SOLO PERFIL (no hay frente; founder lo aclaró — "and-now-mblk-s10-pol-frente.jpg"
-- ES perfil pese al nombre). 1 img por variante (perfil) + medidas.webp. Bucket rusty-and-now/
-- (4 archivos, 667×442 — chicas). Cada variante 1 sola foto → el grid pierde el crossfade en
-- hover (cosmético). Scale perfil 1.1 (anteojo grande ~90% del frame; NO el 1.5 de Esvep que
-- tenía foto chica). medidas.webp en 1.0 (no grid).
-- ============================================

BEGIN;

WITH
  rusty   AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol     AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-and-now', 'Rusty And Now',
  'Anteojos de sol deportivos Rusty And Now: diseño envolvente (wraparound) unisex que abraza el rostro para más cobertura y agarre en actividad. Armazón G-Flex liviano con lentes de policarbonato UV400 categoría 3. 2 de 3 versiones polarizadas.',
  E'Los **Rusty And Now** son anteojos de sol **envolventes (wraparound) unisex**, de impronta deportiva: el armazón abraza el rostro para dar más cobertura y agarre en movimiento. Frente y patillas de **G-Flex** con bisagras plásticas, y **lentes de policarbonato con protección UV400 (categoría 3)**.\n\nMedidas: frente 140 mm · lente 64 mm de ancho × 39 mm de alto · puente 18 mm · varilla 108 mm.\n\nDisponible en 3 versiones:\n\n• SBLK/S10 POL — negro brillo, lente gris **polarizada**.\n• MBLK/S10 POL — negro mate, lente gris **polarizada**.\n• MBLK/Revo Blue — negro mate, lente espejada azul (con antirreflejo en la cara interna).\n\nLas versiones polarizadas reducen el reflejo del agua, la nieve y el asfalto. Incluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "envolvente",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "line": "deportiva",
    "measurements": {"frame_width_mm": 140, "lens_width_mm": 64, "lens_height_mm": 39, "bridge_mm": 18, "temple_length_mm": 108},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Envolvente deportivo unisex", "body": "Diseño wraparound que abraza el rostro para mayor cobertura y agarre en actividad. Frente y patillas de G-Flex con bisagras plásticas, lentes de policarbonato UV400 categoría 3."},
      {"type": "tip", "position": "middle", "title": "Versiones polarizadas", "body": "Las variantes S10 POL tienen lente polarizada: cortan el reflejo del agua, la nieve y el asfalto, ideal para deporte al aire libre. La Revo Blue es espejada azul con antirreflejo en la cara interna."},
      {"type": "recommendation", "position": "bottom", "title": "100% protección UV", "body": "Todas las versiones bloquean el 100% de los rayos UV (UV400). Si dudás cuál te conviene, escribinos por WhatsApp y te asesoramos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1382577721", "MLA1382580349", "MLA1543226618"], "imported_at": "2026-06-13"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Deportivos Rusty And Now | Óptica Carballo',
  'Anteojos de sol deportivos Rusty And Now, envolventes y unisex con UV400. 2 de 3 modelos polarizados. Originales con envío a toda Argentina. Comprá online.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = SBLK/S10 (primary, +stock). 3 MLAs simples → variation_code NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-and-now'), '16118',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10 POL","polarized":true}'::jsonb,
   9363197, 8, true, 1, 'MLA1382577721', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-and-now'), '16122',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   9363197, 6, true, 2, 'MLA1382580349', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-and-now'), '1110',
   '{"frame_color":"negro-mate","lens_color":"espejado-azul","model_code":"MBLK/REVO BLUE","polarized":false}'::jsonb,
   8963004, 5, true, 3, 'MLA1543226618', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. SOLO PERFIL (no hay frente). Primary = SBLK/S10 perfil. medidas última.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-and-now'), (SELECT id FROM public.product_variants WHERE sku='16118'),
   'rusty-and-now/and-now-sblk-s10.jpg', 'Anteojos de sol Rusty And Now envolventes deportivos unisex vista lateral, negro brillo lente polarizada gris', 667, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-and-now'), (SELECT id FROM public.product_variants WHERE sku='16122'),
   'rusty-and-now/and-now-mblk-s10-pol-frente.jpg', 'Anteojos de sol Rusty And Now envolventes deportivos unisex vista lateral, negro mate lente polarizada gris', 667, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-and-now'), (SELECT id FROM public.product_variants WHERE sku='1110'),
   'rusty-and-now/and-now-revo-blue-perfil.jpg', 'Anteojos de sol Rusty And Now envolventes deportivos unisex vista lateral, negro mate lente espejada azul revo', 667, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-and-now'), NULL,
   'rusty-and-now/medidas.webp', 'Esquema técnico de medidas Rusty And Now: frente 140mm, lente 64x39mm, puente 18mm, varilla 108mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
