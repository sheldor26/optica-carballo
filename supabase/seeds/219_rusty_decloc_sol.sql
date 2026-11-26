-- ============================================
-- Seed 219: Rusty DECLOC (sol, ovalado, unisex, metal con terminales de acetato), 3 variantes POLARIZADAS cat 3
-- Fecha de redacción: 2026-11-25
-- ============================================
-- ✅ COMPLETO (2026-11-26): precio, stock e item_id de las 3 variantes VERIFICADOS POR API de ML (búsqueda por SKU; C1 stock 1 confirmado); las 3 son items simples (variation_code NULL). Falta aplicarlo (pendiente del OK del founder). Lo que sigue describe cómo se redactó.
--    Los __PLACEHOLDERS__ van SIN comillas a propósito: rompen el SQL y la transacción aborta si alguien lo aplica sin completarlos.
--    Cuando el founder publique en ML y vuelva Supabase (hoy 402 exceed_egress_quota):
--      1) Rastrear por SKU 970030, 970031 y 970032 con la API (script ml-sku/ml-vars) y completar precio (price_cents), stock (el de ML aunque sea 0), item_id y variation_code (NULL si es item simple, como el Zubia C1).
--      2) Verificar con SELECT que los SKU y el slug `rusty-decloc` no existen.
--      3) Recalcular `new_until` (fecha de aplicación + 30 días).
--      4) `pnpm fotos:subir` (comandos al final) y confirmar ancho/alto impresos.
--      5) Si el seed 217 (Zubia) YA se aplicó a Cloud antes que este, el UPDATE con guard del final (replace sobre la descripción del Zubia) cambia su link de EYSY por el de Decloc; si no, ya está editado en el 217.
--      6) Aplicar, verificar por SELECT (item_id + variation_code reales), PDP y grid, y recién ahí scale override.
-- ML C1 (2026-11-25, leído de la PÁGINA del anuncio en el Chrome del founder, NO por API; confirmar por API): item SIMPLE `MLA2322131483` (sin variaciones => variation_code NULL), $138.912 (price_cents 13891200), stock 1 (la página dice '¡Última disponible!': confirmar la cantidad exacta por API), título 'Anteojos Lentes De Sol Polarizados Rusty Decloc Gafas Unisex C1 - Marron C1 - Dorado'. Forma en ML 'Ovalada' (ok) y varilla 'Acetato' (las patillas son de metal con terminales de acetato). C2 y C3: faltan; rastrear por SKU 970031 y 970032.
-- DATOS DEL FOUNDER (2026-11-25): armazón y patillas de metal con terminales de acetato, bisagras de acero inoxidable SIN flex, OVALADOS, unisex, polarizados los 3, UV400, cat 3, medidas 53-18-145, alto total 43, ancho total 138, 20,1 g. Fuente: https://rustyoptical.com/sunglasses/ss27/decloc (Rusty publica 139x43 de frente; las medidas las manda el founder).
--   C1 POL 970030 armazón dorado, lente marrón · C2 POL 970031 dorado, lente verde · C3 POL 970032 plateado, lente GRIS OSCURO (el founder dice gris oscuro; la foto de Rusty tiene un leve degradé: se sigue al founder, sin `gradient`).
-- 🔬 Sin 'liviano'/'flexible'/'flex'; sin 'para manejar'; sin claim de graduación (`hide_prescription_faq` true, como Society y Zubia). Policarbonato = default de sol del catálogo. El peso (20,1 g, del founder) va como dato, sin adjetivo.
-- 🎯 SEO (seo-strategist 2026-11-25): title 'Anteojos de Sol Rusty Decloc Polarizados | UV400, Unisex' ("Anteojos" porque el Zubia ya toma "Lentes"; sin 'ovalados' (Nova y EYSY) ni 'metal' (Zubia)); frase de vuelta UNA, en EYSY; cross-link con el Zubia; links a Zubia, EYSY, Vulk Nova y Vulk Voices más el hub. Faceta /anteojos-de-sol/ovalados queda para BACKLOG (con Decloc ya hay 4 ovalados de sol).
-- ⚠️ `plateado` no es clave exacta de FRAME_COLOR_LABELS: cae al fallback y se ve 'Plateado' (igual que Vrast y Zubia); `gris-oscuro` ya existe. Enums como Zubia pero `frame_shape` 'ovalado'.
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-decloc', 'Rusty Decloc',
  'Anteojos de sol Rusty Decloc: forma ovalada unisex, con armazón de metal y patillas de metal con terminales de acetato. Lente de policarbonato polarizada UV400, categoría 3, en las tres versiones: dorado con lente marrón o verde, plateado con lente gris oscuro.',
  E'Los **Rusty Decloc** son **anteojos de sol de forma ovalada y unisex**, con **armazón de metal** y **patillas de metal con terminales de acetato**. Las **bisagras son de acero inoxidable**. Pesan 20,1 g.\n\n**Las tres versiones son polarizadas.** La lente es de policarbonato, con **protección UV400** (100% UVA y UVB a través de la lente) y **categoría 3**, pensada para sol fuerte. El polarizado reduce los reflejos del agua, el asfalto y las superficies brillantes. Tené en cuenta una cosa: como toda lente polarizada, las pantallas LCD (celular, GPS, tablero del auto, cajeros) pueden verse oscuras o con patrones de colores según el ángulo.\n\nMedidas: frente 138 mm · lente 53 mm · puente 18 mm · varilla 145 mm · alto total 43 mm.\n\nDisponible en 3 versiones:\n\n• C1 POL (SKU 970030): armazón dorado con lente marrón polarizada.\n• C2 POL (SKU 970031): armazón dorado con lente verde polarizada.\n• C3 POL (SKU 970032): armazón plateado con lente gris oscuro polarizada.\n\nSi preferís la misma línea de metal en forma redonda, mirá los [Rusty Zubia](/anteojos-de-sol/rusty/rusty-zubia). Para un ovalado con frente de metal dorado y patillas de acetato violeta, sin polarizar, los [Rusty EYSY](/anteojos-de-sol/rusty/rusty-eysy). Si buscás un ovalado polarizado de metal para mujer, mirá los [Vulk Nova](/anteojos-de-sol/vulk/vulk-nova), y como unisex polarizado de otra marca, los [Vulk Voices](/anteojos-de-sol/vulk/vulk-voices). También podés ver [todos los anteojos de sol Rusty](/anteojos-de-sol/rusty).\n\nIncluye estuche, franela de microfibra y garantía de 1 año contra defectos de fabricación.',
  '{
    "frame_material": "metal",
    "temple_material": "metal",
    "frame_shape": "ovalado",
    "gender": "unisex",
    "hinge_system": "estandar",
    "hinge_material": "metal",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400", "polarized"],
    "lens_category": 3,
    "measurements": {"frame_width_mm": 138, "lens_width_mm": 53, "lens_height_mm": 43, "bridge_mm": 18, "temple_length_mm": 145},
    "weight_grams": 20.1,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-12-26",
    "hide_prescription_faq": true,
    "callouts": [
      {"type": "info", "position": "top", "title": "Ovalado de metal, unisex", "body": "Armazón y patillas de metal, con terminales de acetato en las patillas y bisagras de acero inoxidable. En dorado y plateado."},
      {"type": "tip", "position": "middle", "title": "Las tres versiones son polarizadas", "body": "Reducen los reflejos del agua, el asfalto y las superficies brillantes, y pueden hacer que se vean oscuras o con patrones de colores algunas pantallas (celular, GPS, tablero). Aparte, la lente bloquea el 100% de la radiación UV (UV400)."},
      {"type": "recommendation", "position": "bottom", "title": "Categoría 3 en las tres", "body": "Lente categoría 3, pensada para mucha luz. Elegí por el color de la lente: marrón o verde con armazón dorado, o gris oscuro con armazón plateado."}
    ]
  }'::jsonb,
  true, false,
  'Anteojos de Sol Rusty Decloc Polarizados | UV400, Unisex',
  'Anteojos de sol Rusty Decloc ovalados y unisex, con armazón de metal y lentes polarizadas UV400 categoría 3. Dorado y plateado. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-decloc'), '970030',
   '{"frame_color":"dorado","lens_color":"marron","model_code":"C1 POL","polarized":true}'::jsonb,
   13891200, 1, true, 1, 'MLA2322131483', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-decloc'), '970031',
   '{"frame_color":"dorado","lens_color":"verde","model_code":"C2 POL","polarized":true}'::jsonb,
   13891200, 3, true, 2, 'MLA4241233772', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-decloc'), '970032',
   '{"frame_color":"plateado","lens_color":"gris-oscuro","model_code":"C3 POL","polarized":true}'::jsonb,
   13891200, 3, true, 3, 'MLA4241258758', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();
-- Si son 3 items simples (lo probable, como el Zubia C1): item_id distinto por variante y variation_code NULL.

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-decloc'), (SELECT id FROM public.product_variants WHERE sku='970030'),
   'rusty-decloc/perfil-c1.jpg', 'Anteojos de sol Rusty Decloc ovalados de metal, vista lateral, armazón dorado con lente marrón polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-decloc'), (SELECT id FROM public.product_variants WHERE sku='970030'),
   'rusty-decloc/frente-c1.jpg', 'Anteojos de sol Rusty Decloc ovalados de metal, vista frontal, armazón dorado con lente marrón polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-decloc'), (SELECT id FROM public.product_variants WHERE sku='970031'),
   'rusty-decloc/perfil-c2.jpg', 'Anteojos de sol Rusty Decloc ovalados de metal, vista lateral, armazón dorado con lente verde polarizada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-decloc'), (SELECT id FROM public.product_variants WHERE sku='970031'),
   'rusty-decloc/frente-c2.jpg', 'Anteojos de sol Rusty Decloc ovalados de metal, vista frontal, armazón dorado con lente verde polarizada', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-decloc'), (SELECT id FROM public.product_variants WHERE sku='970032'),
   'rusty-decloc/perfil-c3.jpg', 'Anteojos de sol Rusty Decloc ovalados de metal, vista lateral, armazón plateado con lente gris oscuro polarizada', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-decloc'), (SELECT id FROM public.product_variants WHERE sku='970032'),
   'rusty-decloc/frente-c3.jpg', 'Anteojos de sol Rusty Decloc ovalados de metal, vista frontal, armazón plateado con lente gris oscuro polarizada', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-decloc'), NULL,
   'rusty-decloc/medidas-c1.jpg', 'Esquema técnico de medidas Rusty Decloc: lente 53mm, puente 18mm, varilla 145mm, alto total 43mm, ancho total 138mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: UNA sola, en EYSY (el ovalado de metal vecino, sin polarizar y sin links internos).
UPDATE public.products
SET description = description || E'\n\nSi te gusta el ovalado de metal pero lo querés polarizado, mirá los [Rusty Decloc](/anteojos-de-sol/rusty/rusty-decloc).', updated_at = now()
WHERE slug = 'rusty-eysy' AND description NOT LIKE '%rusty-decloc%';

-- Cross-link con el Zubia SÓLO si el seed 217 ya estaba aplicado (si no, el 217 ya trae el link a Decloc):
UPDATE public.products
SET description = replace(description,
  'Para un frente de metal dorado en forma ovalada, los [Rusty EYSY](/anteojos-de-sol/rusty/rusty-eysy), y para unos',
  'Si lo preferís ovalado y también polarizado, mirá los [Rusty Decloc](/anteojos-de-sol/rusty/rusty-decloc), y para unos'),
  updated_at = now()
WHERE slug = 'rusty-zubia' AND description NOT LIKE '%rusty-decloc%';

COMMIT;

-- ============================================
-- FOTOS (confirmar nombres con --dry y ancho/alto con la salida real):
--   pnpm fotos:subir --slug rusty-decloc --dir marketing/placas-ml/SUBIR-rusty-decloc-c1/web --sufijo -c1
--   pnpm fotos:subir --slug rusty-decloc --dir marketing/placas-ml/SUBIR-rusty-decloc-c2/web --sufijo -c2 --solo perfil,frente
--   pnpm fotos:subir --slug rusty-decloc --dir marketing/placas-ml/SUBIR-rusty-decloc-c3/web --sufijo -c3 --solo perfil,frente
-- SCALE OVERRIDE (regla 15): partir SIN entry (1.0). Si en el grid de /anteojos-de-sol/rusty se ve más chico (aro fino), 1.05 en las 6 paths perfil/frente (tope ~1.08), nunca en medidas-c1.jpg. Correr `pnpm auditar:encuadre`.
-- Después: CLOUD_APPLIED.md, SEO_STRATEGY.md (ficha del Decloc: shape plana, title 'Polarizados Unisex', frase de vuelta en EYSY), BACKLOG.md (faceta /anteojos-de-sol/ovalados), PRODUCTS_INVENTORY.md, COLA_CARGA_WEB.md.
-- ============================================
