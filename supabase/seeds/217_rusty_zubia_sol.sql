-- ============================================
-- Seed 217: Rusty ZUBIA (sol, redondo, unisex, metal con terminales de acetato), 3 variantes POLARIZADAS cat 3
-- Fecha de redacción: 2026-11-25
-- ============================================
-- ✅ COMPLETO (2026-11-26): precio, stock e item_id de las 3 variantes VERIFICADOS POR API de ML (búsqueda por SKU); las 3 son items simples (variation_code NULL). Falta aplicarlo (pendiente del OK del founder). En ML la C3 tiene invertidos color de armazón ('Gris Degrade') y de lente ('Plateados'): manda el founder. Lo que sigue describe cómo se redactó.
--    Los __PLACEHOLDERS__ van SIN comillas a propósito: rompen el SQL y la transacción aborta si alguien lo aplica sin completarlos.
--    Cuando el founder publique en ML y pase el link, y vuelva Supabase (hoy 402 exceed_egress_quota):
--      1) `pnpm exec tsx --env-file=.env.local <script ml-vars> <MLA...>` y completar precio (price_cents, ej. $133.245 -> 13324500), stock (el de ML aunque sea 0), item_id y variation_code.
--      2) Verificar con SELECT que 970020/970021/970022 y el slug `rusty-zubia` no existen.
--      3) Recalcular `new_until` (fecha de aplicación + 30 días).
--      4) `pnpm fotos:subir` (comandos al final) y confirmar ancho/alto impresos.
--      5) Aplicar, verificar por SELECT (item_id + variation_code reales), PDP y grid, y recién ahí scale override (ver nota al final).
-- ML C1 (2026-11-25, leído de la PÁGINA del anuncio en el Chrome del founder, NO por API; confirmar por API): item SIMPLE `MLA4239644536` (sin variaciones => variation_code NULL), $138.912 (price_cents 13891200), stock 3, 'Anteojos Lentes De Sol Polarizados Rusty Zubia Gafas Redonda C1 - Marron C1 - Dorado'. C2 y C3: el founder publicó UN ITEM POR COLOR (no una multivariante); faltan sus links.
-- DATOS DEL FOUNDER (2026-11-25): armazón y patillas de metal con terminales de acetato, bisagras de acero inoxidable SIN flex, redondos, unisex, polarizados los 3, UV400, cat 3, medidas 50-21-145, alto total 48, ancho total 135. Fuente: https://rustyoptical.com/sunglasses/ss27/zubia (Rusty: 18,8 g, 136x48 de frente; las medidas las manda el founder).
--   C1 POL 970020 armazón dorado, lente marrón · C2 POL 970021 armazón dorado, lente verde · C3 POL 970022 armazón plateado, lente gris degradé.
-- 🔬 Sin 'liviano'/'flexible'/'flex'; sin 'para manejar'; sin claim de graduación (el founder no lo dijo: `hide_prescription_faq` true, como Society). Policarbonato = default de sol del catálogo (Rusty no lo dice). El peso (18,8 g de la ficha de Rusty) va como dato, sin adjetivo.
-- 🎯 SEO (seo-strategist 2026-11-25): title 'Lentes de Sol Rusty Zubia | Metal, 3 Colores, UV400' (sin 'redondos' ni 'polarizados', que ya reclaman Blinded/Zion/Society y Ardigan); carril libre = 'metal'; links a Zion, Decloc, Vrast, Society y el hub; UNA frase de vuelta, en Zion.
-- ⚠️ Los enums siguen a Merge/Eysy: temple_material 'metal' y hinge_material 'metal' (acero inoxidable y terminales de acetato van en el copy). `plateado` no es clave exacta de FRAME_COLOR_LABELS: cae al fallback y se ve 'Plateado' (igual que Vrast); chequear en la PDP.
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-zubia', 'Rusty Zubia',
  'Lentes de sol Rusty Zubia: redondos unisex con armazón de metal y patillas de metal con terminales de acetato. Lente de policarbonato polarizada UV400, categoría 3, en las tres versiones: dorado con lente marrón o verde, plateado con lente gris degradé.',
  E'Los **Rusty Zubia** son **lentes de sol redondos y unisex**, con **armazón de metal** y **patillas de metal con terminales de acetato**. Las **bisagras son de acero inoxidable**, sin sistema flex. Pesan 18,8 g.\n\n**Las tres versiones son polarizadas.** La lente es de policarbonato, con **protección UV400** (100% UVA y UVB a través de la lente) y **categoría 3**, pensada para sol fuerte. El polarizado reduce los reflejos del agua, el asfalto y las superficies brillantes. Tené en cuenta una cosa: como toda lente polarizada, las pantallas LCD (celular, GPS, tablero del auto, cajeros) pueden verse oscuras o con patrones de colores según el ángulo.\n\nMedidas: frente 135 mm · lente 50 mm · puente 21 mm · varilla 145 mm · alto total 48 mm.\n\nDisponible en 3 versiones:\n\n• C1 POL (SKU 970020): armazón dorado con lente marrón polarizada.\n• C2 POL (SKU 970021): armazón dorado con lente verde polarizada.\n• C3 POL (SKU 970022): armazón plateado con lente gris degradé polarizada.\n\nSi preferís un redondo con frente de grilamid y patillas de metal, mirá los [Rusty Zion](/anteojos-de-sol/rusty/rusty-zion). Si lo preferís ovalado y también polarizado, mirá los [Rusty Decloc](/anteojos-de-sol/rusty/rusty-decloc), y para unos aviadores de metal polarizados, los [Rusty Vrast](/anteojos-de-sol/rusty/rusty-vrast). Si buscás un redondo unisex de G-Flex, mirá los [Rusty Society](/anteojos-de-sol/rusty/rusty-society). Y podés ver [todos los anteojos de sol Rusty](/anteojos-de-sol/rusty).\n\nIncluye estuche, franela de microfibra y garantía de 1 año contra defectos de fabricación.',
  '{
    "frame_material": "metal",
    "temple_material": "metal",
    "frame_shape": "redondo",
    "gender": "unisex",
    "hinge_system": "estandar",
    "hinge_material": "metal",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400", "polarized"],
    "lens_category": 3,
    "measurements": {"frame_width_mm": 135, "lens_width_mm": 50, "lens_height_mm": 48, "bridge_mm": 21, "temple_length_mm": 145},
    "weight_grams": 18.8,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-12-26",
    "hide_prescription_faq": true,
    "callouts": [
      {"type": "info", "position": "top", "title": "Redondo de metal, unisex", "body": "Armazón y patillas de metal, con terminales de acetato en las patillas y bisagras de acero inoxidable. En dorado y plateado."},
      {"type": "tip", "position": "middle", "title": "Las tres versiones son polarizadas", "body": "Reducen los reflejos del agua, el asfalto y las superficies brillantes, y pueden hacer que se vean oscuras o con patrones de colores algunas pantallas (celular, GPS, tablero). Aparte, la lente bloquea el 100% de la radiación UV (UV400)."},
      {"type": "recommendation", "position": "bottom", "title": "Categoría 3 en las tres", "body": "Lente categoría 3, pensada para mucha luz. Elegí por el color de la lente: marrón o verde con armazón dorado, o gris degradé con armazón plateado."}
    ]
  }'::jsonb,
  true, false,
  'Lentes de Sol Rusty Zubia | Metal, 3 Colores, UV400',
  'Lentes de sol Rusty Zubia: redondos unisex con armazón de metal y lentes polarizadas UV400 categoría 3. En dorado y plateado. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-zubia'), '970020',
   '{"frame_color":"dorado","lens_color":"marron","model_code":"C1 POL","polarized":true}'::jsonb,
   13891200, 3, true, 1, 'MLA4239644536', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-zubia'), '970021',
   '{"frame_color":"dorado","lens_color":"verde","model_code":"C2 POL","polarized":true}'::jsonb,
   13891200, 3, true, 2, 'MLA4239644534', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-zubia'), '970022',
   '{"frame_color":"plateado","lens_color":"gris-degrade","model_code":"C3 POL","polarized":true,"lens_treatment":["gradient"]}'::jsonb,
   13891200, 3, true, 3, 'MLA4239632260', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();
-- Las 3 son items simples: item_id distinto por variante y variation_code NULL (confirmado para C1; C2 y C3 a confirmar con sus links).

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-zubia'), (SELECT id FROM public.product_variants WHERE sku='970020'),
   'rusty-zubia/perfil-c1.jpg', 'Lentes de sol Rusty Zubia redondos de metal, vista lateral, armazón dorado con lente marrón polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-zubia'), (SELECT id FROM public.product_variants WHERE sku='970020'),
   'rusty-zubia/frente-c1.jpg', 'Lentes de sol Rusty Zubia redondos de metal, vista frontal, armazón dorado con lente marrón polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zubia'), (SELECT id FROM public.product_variants WHERE sku='970021'),
   'rusty-zubia/perfil-c2.jpg', 'Lentes de sol Rusty Zubia redondos de metal, vista lateral, armazón dorado con lente verde polarizada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zubia'), (SELECT id FROM public.product_variants WHERE sku='970021'),
   'rusty-zubia/frente-c2.jpg', 'Lentes de sol Rusty Zubia redondos de metal, vista frontal, armazón dorado con lente verde polarizada', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zubia'), (SELECT id FROM public.product_variants WHERE sku='970022'),
   'rusty-zubia/perfil-c3.jpg', 'Lentes de sol Rusty Zubia redondos de metal, vista lateral, armazón plateado con lente gris degradé polarizada', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zubia'), (SELECT id FROM public.product_variants WHERE sku='970022'),
   'rusty-zubia/frente-c3.jpg', 'Lentes de sol Rusty Zubia redondos de metal, vista frontal, armazón plateado con lente gris degradé polarizada', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zubia'), NULL,
   'rusty-zubia/medidas-c1.jpg', 'Esquema técnico de medidas Rusty Zubia: lente 50mm, puente 21mm, varilla 145mm, alto total 48mm, ancho total 135mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: UNA sola, en Zion (el redondo polarizado de Rusty, vecino directo).
UPDATE public.products
SET description = description || E'\n\nSi te gusta el redondo polarizado pero con armazón completo de metal, mirá los [Rusty Zubia](/anteojos-de-sol/rusty/rusty-zubia).', updated_at = now()
WHERE slug = 'rusty-zion' AND description NOT LIKE '%rusty-zubia%';

COMMIT;

-- ============================================
-- FOTOS (confirmar nombres con --dry y ancho/alto con la salida real):
--   pnpm fotos:subir --slug rusty-zubia --dir marketing/placas-ml/SUBIR-rusty-zubia-c1/web --sufijo -c1
--   pnpm fotos:subir --slug rusty-zubia --dir marketing/placas-ml/SUBIR-rusty-zubia-c2/web --sufijo -c2 --solo perfil,frente
--   pnpm fotos:subir --slug rusty-zubia --dir marketing/placas-ml/SUBIR-rusty-zubia-c3/web --sufijo -c3 --solo perfil,frente
-- SCALE OVERRIDE (regla 15): partir SIN entry (1.0; el anteojo ocupa ~92% del ancho, igual que Society/Eysy/Merge/Ombuxe). Si en el grid
--   de /anteojos-de-sol, /anteojos-de-sol/rusty y la forma redondo se ve más chico (aro fino), 1.05 en las 6 paths perfil/frente (tope ~1.08),
--   nunca en medidas-c1.jpg. Correr `pnpm auditar:encuadre`.
-- Después: CLOUD_APPLIED.md, SEO_STRATEGY.md (ficha del Zubia con la regla anti-canibalización), PRODUCTS_INVENTORY.md, COLA_CARGA_WEB.md.
-- ============================================
