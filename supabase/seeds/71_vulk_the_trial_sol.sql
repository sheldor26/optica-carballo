-- ============================================
-- Seed 71: Vulk The Trial SOL — AVIADOR doble puente unisex, G-Flex+Monel, 4 colores (2 pol)
-- Fecha: 2026-06-14
-- ============================================
-- Anteojos de SOL AVIADOR doble puente unisex (founder lo define aviador aunque la foto de
-- medidas muestre silueta tipo wayfarer → founder manda). Frente G-Flex; patillas Monel con
-- terminal de acetato laminado hecho a mano + bisagra integrada (a la descripción; el campo
-- frame_material toma el frente = g-flex). Lentes policarbonato 100% UV. Liviano 19,5g, large.
-- 3 MLAs separados (items simples → variation_code NULL) + 1 variante SIN MLA (pedida).
-- Precio/stock de la API ML (scripts/ml-item.ts):
--   SBLK/S10 POL    SKU 125728 MLA2824914416 $86.082,29 stock 3 (PRIMARY, negro brillo, gris, POLARIZADO)
--   MBLK 053/S15    SKU 125725 MLA1905026356 $78.751,73 stock 3 (negro mate, gris, ANTIFOG, NO pol)
--   SBLK/ORANGE     SKU 125727 MLA2823986022 $74.243,83 stock 3 (negro brillo, lente naranja, NO pol)
--   MDEMI-068/UPG15 SKU 968279 SIN MLA       stock 0 (carey, verde G15, POLARIZADO; pedido, aún no en ML)
--
-- frame_shape="aviator" (→/anteojos-de-sol/aviador). 2 polarized:true (S10, MDEMI) → /polarizados
-- (vía polarized flag por variante, patrón Raven). ANTIFOG (V2): NO va en lens_treatment (no es
-- valor del enum, igual que espejado/AR) → mencionado en descripción + callout. lens_color por
-- variante (gris/naranja/verde-g15), los códigos S10/S15/UPG15 van en model_code/SKU, no en color.
-- Default sol: lens_material policarbonato / lens_treatment ["uv400"] / lens_category 3.
-- weight_grams=19.5 (ML lo da → NO a pesos pendientes).
--
-- V4 MDEMI (sin MLA): mercadolibre_item_id NULL, stock 0, is_active true (se muestra "sin stock";
-- sincroniza al alta del item en ML). ⚠️ PRECIO PROVISIONAL = igualado al S10 POL (8608229) por ser
-- el otro polarizado del modelo; ACTUALIZAR al precio real de ML cuando entre el item (ver BACKLOG).
--
-- Medidas (de la FOTO): frente 147 / lente 50x49 / puente 15 / varilla 150 mm.
--
-- HONESTIDAD (BUSINESS_POLICIES §6/§8): solo 2/4 polarizadas → meta_title/H1 NO afirma
-- "polarizados" del modelo entero (destaca "Unisex"). Descripción genérica del modelo (sin colores).
--
-- 📸 FOTOS: CARGA ABIERTA — bucket vulk-the-trial/ VACÍO al seed (founder pasó nombres, falta subir).
-- 4 variantes × (perfil + frente) + medidas.webp = 9. Grid primary = PERFIL de SBLK/S10. ⚠️ nombres
-- del founder inconsistentes (mayús/minús, espacios; el MDEMI parece doble espacio "POL -  p.jpg")
-- → al subir hay que VERIFICAR HTTP 200 y reconciliar paths exactos (como pasó con Raven). width/
-- height 900x442 PROVISIONAL. Scale perfil 1.20 / frente 1.0 (precedente Gresent doble puente);
-- reverificar vs grid cuando suba las fotos (regla 15).
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-the-trial', 'Vulk The Trial',
  'Lentes de sol Vulk The Trial: aviador doble puente unisex, ultraliviano (19,5g). Frente G-Flex y patillas de Monel con terminal de acetato hecho a mano. Lentes de policarbonato UV400 categoría 3. 2 de 4 versiones polarizadas.',
  E'Los **Vulk The Trial** son **lentes de sol aviador de doble puente, unisex**, con una construcción cuidada: **frente de G-Flex** y **patillas de Monel con terminal de acetato laminado hecho a mano** y bisagra integrada. Son **ultralivianos (19,5 g)**, talle large, con **lentes de policarbonato y 100% protección UV (UV400, categoría 3)**.\n\nMedidas: frente 147 mm · lente 50 mm de ancho × 49 mm de alto · puente 15 mm · varilla 150 mm.\n\nDisponible en 4 versiones:\n\n• SBLK/S10 — negro brillo, lente gris **polarizada**.\n• MBLK 053/S15 — negro mate, lente gris con tratamiento **antiempañante (antifog)**.\n• SBLK/Orange — negro brillo, lente naranja.\n• MDEMI/UPG15 — carey, lente verde G15 **polarizada**.\n\nLas versiones polarizadas cortan el reflejo del agua, la nieve y el asfalto. Incluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "aviator",
    "temple_material": "monel",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "weight_grams": 19.5,
    "measurements": {"frame_width_mm": 147, "lens_width_mm": 50, "lens_height_mm": 49, "bridge_mm": 15, "temple_length_mm": 150},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Aviador doble puente ultraliviano", "body": "Diseño aviador de doble puente unisex, solo 19,5 g. Frente de G-Flex y patillas de Monel con terminal de acetato laminado hecho a mano y bisagra integrada. Lentes de policarbonato con 100% protección UV (UV400, categoría 3)."},
      {"type": "tip", "position": "middle", "title": "Polarizadas y antiempañante", "body": "Las versiones SBLK/S10 y MDEMI/UPG15 son polarizadas (cortan el reflejo del agua, la nieve y el asfalto). La MBLK 053/S15 suma tratamiento antiempañante (antifog) para que la lente no se empañe."},
      {"type": "recommendation", "position": "bottom", "title": "100% protección UV", "body": "Las 4 versiones bloquean el 100% de los rayos UV (UV400). Si dudás cuál te conviene, escribinos por WhatsApp y te asesoramos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2824914416", "MLA1905026356", "MLA2823986022"], "imported_at": "2026-06-14"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Vulk The Trial Unisex | Óptica Carballo',
  'Lentes de sol Vulk The Trial: aviador doble puente, unisex y ultralivianos (19,5g) con filtro UV400. Envíos a todo el país. Comprá con asesoramiento real.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = SBLK/S10 (primary, polarizado, MLA real). V4 MDEMI stock 0 al final (sin MLA).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial'), '125728',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10 POL","polarized":true}'::jsonb,
   8608229, 3, true, 1, 'MLA2824914416', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial'), '125725',
   '{"frame_color":"negro-mate","lens_color":"gris","model_code":"MBLK 053/S15 ANTIFOG","polarized":false}'::jsonb,
   7875173, 3, true, 2, 'MLA1905026356', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial'), '125727',
   '{"frame_color":"negro-brillo","lens_color":"naranja","model_code":"SBLK/ORANGE","polarized":false}'::jsonb,
   7424383, 3, true, 3, 'MLA2823986022', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial'), '968279',
   '{"frame_color":"carey","lens_color":"verde-g15","model_code":"MDEMI-068/UPG15 POL","polarized":true}'::jsonb,
   8608229, 0, true, 4, NULL, NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Por variante: perfil (grid) + frente. Primary = SBLK/S10 perfil. medidas última.
-- ⚠️ paths con nombres inconsistentes del founder copiados tal cual (CARGA ABIERTA, sin verificar).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial'), (SELECT id FROM public.product_variants WHERE sku='125728'),
   'vulk-the-trial/THE TRIAL-SBLK S10 POL - p.jpg', 'Lentes de sol Vulk The Trial aviador doble puente unisex vista lateral, negro brillo lente polarizada gris', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial'), (SELECT id FROM public.product_variants WHERE sku='125728'),
   'vulk-the-trial/THE TRIAL-SBLK S10 POL - F.jpg', 'Lentes de sol Vulk The Trial aviador doble puente unisex vista frontal, negro brillo lente polarizada gris', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial'), (SELECT id FROM public.product_variants WHERE sku='125725'),
   'vulk-the-trial/THE TRIAL MBLK 053-S15 ANTIFOG PERFIL.jpg', 'Lentes de sol Vulk The Trial aviador doble puente unisex vista lateral, negro mate lente gris antiempañante', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial'), (SELECT id FROM public.product_variants WHERE sku='125725'),
   'vulk-the-trial/THE TRIAL MBLK 053-S15 ANTIFOG FRENTE.jpg', 'Lentes de sol Vulk The Trial aviador doble puente unisex vista frontal, negro mate lente gris antiempañante', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial'), (SELECT id FROM public.product_variants WHERE sku='125727'),
   'vulk-the-trial/THE TRIAL-SBLK_ORANGE - p.jpg', 'Lentes de sol Vulk The Trial aviador doble puente unisex vista lateral, negro brillo lente naranja', 900, 442, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial'), (SELECT id FROM public.product_variants WHERE sku='125727'),
   'vulk-the-trial/THE TRIAL-SBLK_ORANGE - f.jpg', 'Lentes de sol Vulk The Trial aviador doble puente unisex vista frontal, negro brillo lente naranja', 900, 442, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial'), (SELECT id FROM public.product_variants WHERE sku='968279'),
   'vulk-the-trial/THE TRIAL-MDEMI-068_UPG15 POL -  p.jpg', 'Lentes de sol Vulk The Trial aviador doble puente unisex vista lateral, carey lente polarizada verde G15', 900, 442, 6, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial'), (SELECT id FROM public.product_variants WHERE sku='968279'),
   'vulk-the-trial/THE TRIAL-MDEMI-068_UPG15 POL -  f.jpg', 'Lentes de sol Vulk The Trial aviador doble puente unisex vista frontal, carey lente polarizada verde G15', 900, 442, 7, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-trial'), NULL,
   'vulk-the-trial/medidas.webp', 'Esquema técnico de medidas Vulk The Trial: frente 147mm, lente 50x49mm, puente 15mm, varilla 150mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
