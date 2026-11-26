-- ============================================
-- Seed 220: Rusty XOLD SIENNA/902 LTD (6ª variante del producto existente `rusty-xold`, NO polarizada, cat 3)
-- Fecha de redacción: 2026-11-25
-- ============================================
-- ⛔ BORRADOR, NO APLICAR TAL CUAL. Faltan precio, stock, item_id y variation_code reales de ML (hoy Supabase 402 exceed_egress_quota).
--    Los __PLACEHOLDERS__ van SIN comillas a propósito: rompen el SQL y la transacción aborta si alguien lo aplica sin completarlos.
--    Cuando vuelva Supabase:
--      1) Rastrear por SKU 126420 con la API (ml-sku/ml-vars) y completar price_cents, stock (el de ML aunque sea 0), item_id y variation_code (NULL si es item simple, como las otras 5 del Xold).
--      2) SELECT sku, sort_order, attributes FROM product_variants WHERE product_id=(SELECT id FROM products WHERE slug='rusty-xold') ORDER BY sort_order  (confirmar sort_order libre y copiar el formato de attributes de la 0292/902, SKU 125762).
--         SELECT storage_path, variant_id, sort_order, is_primary FROM product_images WHERE product_id=(SELECT id FROM products WHERE slug='rusty-xold') ORDER BY sort_order  (hoy: 11 imágenes, sort 0-10, medidas en 10).
--         SELECT description, short_description, attributes->'callouts', attributes->'prescription_adapter' FROM products WHERE slug='rusty-xold'  (ver qué decía el copy viejo y si hay un callout extra tipo size_fit que haya que re-incluir).
--         Verificar que el SKU 126420 no existe y que el slug 'rusty-xold-receta' y la URL de receta del link existen.
--      3) `pnpm fotos:subir` (comando al final) y confirmar ancho/alto impresos.
--      4) Aplicar, verificar por SELECT (item_id + variation_code reales), PDP y grid, y recién ahí scale override (regla 15).
-- DATOS DEL FOUNDER (2026-11-25): SKU 126420, model_code SIENNA/902 LTD, armazón marrón brillo transparente, lente marrón degradé "como el Vulk Yamain Sienna". NO polarizada (el código no dice POL y no dijo que lo sea: CONFIRMAR con el founder), UV400 cat 3 (default de sol). Medidas del producto ya cargadas por el founder (50-20-145, alto 48, ancho 138, 21,5 g).
-- 📸 FOTOS (FINAL 2026-11-26): fotos de fábrica con ajuste de color uniforme (HSL sobre los naranjas: tono -5°, sat x0,76, brillo x0,89) al marrón caramelo translúcido de las fotos reales del founder; sin pegar ni redibujar (logos y textos intactos). Elegida por el founder ('ya hagas las placas y todo' sobre la opción B recomendada).
-- 🎯 SEO (seo-strategist 2026-11-25): title 'Anteojos de Sol Rusty Xold | 6 Colores, UV400' (sin redondos/polarizados/unisex/G-Flex/marrón); links a Zion, Society, Xold Receta y hub; frase de vuelta UNA, en Blinded (con guard). No se escribe 'edición limitada' por el LTD.
-- 🔬 Sin 'liviano'/'flexible' para el material; 'bisagras metálicas con sistema flex' como Society. Aviso LCD sólo atado a las 4 polarizadas. DECISIÓN: no se afirma 'admite lentes con graduación' en este seed (el founder no lo dijo y no pude ver el copy actual); si el producto ya lo decía, restituirlo tras el SELECT de arriba.
-- ⚠️ `frame_color` = `marron-brillo` (existe; precedente Deserve Sienna 'marrón brillo translúcido'); `lens_color` = `marron-degrade` (existe) y `lens_treatment ['gradient']` a nivel variante; `lens_treatment` de producto sigue ['uv400'] y `lens_category` 3 (producto mixto: 4 polarizadas y 2 sin polarizar).
-- ⚠️ Blinded (seed 68) conserva copy viejo ('ultralivianos'/'livianos'): ya se lo toca con la frase de vuelta; anotado en BACKLOG para limpiarlo aparte.
-- ============================================

BEGIN;

UPDATE public.products SET
  short_description = 'Anteojos de sol Rusty Xold unisex: redondos de G-Flex con lente de policarbonato UV400 categoría 3. Seis colores: cuatro con lente polarizada y dos sin polarizar.',
  description = E'Los **Rusty Xold** son **anteojos de sol redondos y unisex**, con **frente y patillas de G-Flex** y **bisagras metálicas con sistema flex**. Pesan 21,5 g.\n\nLas seis versiones llevan lente de policarbonato con **protección UV400** (100% UVA y UVB a través de la lente) y **categoría 3**, pensada para sol fuerte. **Cuatro son polarizadas** (SBLK/S10, MBLK/S10, MBLK/BG26 y MBLK/PINK): reducen los reflejos del agua, el asfalto y las superficies brillantes. Tené en cuenta una cosa: como toda lente polarizada, las pantallas LCD (celular, GPS, tablero del auto, cajeros) pueden verse oscuras o con patrones de colores según el ángulo. Las dos con lente degradé, la **0292/902** y la **SIENNA/902 LTD**, **no son polarizadas**.\n\nMedidas: frente 138 mm · lente 50 mm · puente 20 mm · varilla 145 mm · alto total 48 mm.\n\nDisponible en 6 variantes:\n\n• SBLK/S10 POL (SKU 125761): negro brillo con lente gris oscuro POLARIZADA.\n• MBLK/S10 POL (SKU 125769): negro mate con lente gris oscuro POLARIZADA.\n• MBLK/BG26 POL (SKU 125768): negro mate con lente marrón degradé POLARIZADA.\n• MBLK/PINK POL (SKU 125767): negro mate con lente rosa espejada POLARIZADA.\n• 0292/902 (SKU 125762): armazón caramelo con lente rosa degradé, sin polarizar.\n• SIENNA/902 LTD (SKU 126420): armazón marrón brillo transparente con lente marrón degradé, sin polarizar.\n\nSi querés un redondo de Rusty con las cuatro versiones polarizadas y patillas de metal, mirá los [Rusty Zion](/anteojos-de-sol/rusty/rusty-zion). Para otro redondo unisex de G-Flex, con puente en forma de llave, los [Rusty Society](/anteojos-de-sol/rusty/rusty-society). Si lo querés para uso diario con tu receta, el mismo modelo existe como armazón: [Rusty Xold Receta](/anteojos-de-receta/rusty/rusty-xold-receta). Y podés ver [todos los anteojos de sol Rusty](/anteojos-de-sol/rusty).\n\nIncluye estuche, franela de microfibra y garantía de 1 año contra defectos de fabricación.',
  meta_title = 'Anteojos de Sol Rusty Xold | 6 Colores, UV400',
  meta_description = 'Anteojos de sol Rusty Xold: redondos unisex de G-Flex en 6 colores, 4 polarizados y 2 sin polarizar, UV400 categoría 3. Envíos a todo el país.',
  attributes = attributes || '{
    "lens_category": 3,
    "callouts": [
      {"type": "info", "position": "top", "title": "Redondo unisex de G-Flex", "body": "Frente y patillas de G-Flex, con bisagras metálicas con sistema flex. Se usa de sol todos los días."},
      {"type": "tip", "position": "middle", "title": "Cuatro polarizadas y dos sin polarizar", "body": "Para mucha luz y reflejos, las polarizadas son la SBLK/S10, la MBLK/S10, la MBLK/BG26 y la MBLK/PINK, y pueden hacer que se vean oscuras o con patrones de colores algunas pantallas (celular, GPS, tablero). La 0292/902 (caramelo con lente rosa degradé) y la SIENNA/902 LTD (marrón transparente con lente marrón degradé) no son polarizadas: son la elección de estilo."},
      {"type": "recommendation", "position": "bottom", "title": "UV400 y categoría 3 en las seis", "body": "Las seis lentes son de policarbonato, con 100% de protección UVA y UVB y categoría 3, pensada para mucha luz. Elegí por el color de la lente y por si la querés polarizada o no."}
    ]
  }'::jsonb,
  updated_at = now()
WHERE slug = 'rusty-xold';

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-xold'), '126420',
   '{"frame_color":"marron-brillo","lens_color":"marron-degrade","model_code":"SIENNA/902 LTD","polarized":false,"lens_category":3,"lens_treatment":["gradient"]}'::jsonb,
   __PRECIO_CENTS__, __STOCK__, true, 6, __MLA_ITEM__, __VARIATION__)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();
-- Los otros 5 Xold son items simples (variation_code NULL salvo que la API diga otra cosa para el item nuevo).

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-xold'), (SELECT id FROM public.product_variants WHERE sku='126420'),
   'rusty-xold/perfil-sienna.jpg', 'Anteojos de sol Rusty Xold redondos, vista lateral, armazón marrón brillo transparente con lente marrón degradé', 2000, 1333, 11, false),
  ((SELECT id FROM public.products WHERE slug='rusty-xold'), (SELECT id FROM public.product_variants WHERE sku='126420'),
   'rusty-xold/frente-sienna.jpg', 'Anteojos de sol Rusty Xold redondos, vista frontal, armazón marrón brillo transparente con lente marrón degradé', 2000, 1333, 12, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- La imagen de medidas (sin variante) pasa al final.
UPDATE public.product_images SET sort_order = 99, updated_at = now()
WHERE product_id = (SELECT id FROM public.products WHERE slug='rusty-xold') AND variant_id IS NULL AND storage_path LIKE 'rusty-xold/medidas.%';

-- Frase de vuelta: UNA sola, en Blinded (el redondo G-Flex de Rusty con sólo 2 colores).
UPDATE public.products
SET description = description || E'\n\nSi te gusta este redondo de G-Flex pero querés más opciones de color, mirá los [Rusty Xold](/anteojos-de-sol/rusty/rusty-xold), en 6 versiones.', updated_at = now()
WHERE slug = 'rusty-blinded' AND description NOT LIKE '%anteojos-de-sol/rusty/rusty-xold%';

COMMIT;

-- ============================================
-- FOTOS (probar antes con --dry; el script necesita Supabase):
--   pnpm fotos:subir --slug rusty-xold --dir marketing/placas-ml/SUBIR-rusty-xold-sienna/web --sufijo -sienna --solo perfil,frente
--   -> rusty-xold/perfil-sienna.jpg y rusty-xold/frente-sienna.jpg (nombres nuevos: no chocan con los 'XOLD ...-perfil.jpg' viejos).
-- SCALE OVERRIDE (regla 15): las fotos nuevas son 2000x1333 con el anteojo al ~92% del ancho; los 1.15/1.0 de las fotos viejas (900x442) NO sirven (recortan).
--   Partir sin entry o con 'rusty-xold/perfil-sienna.jpg': 1.05 y 'frente-sienna.jpg': 1.0 (precedente Rusty Bruice 1.05, tope ~1.08). Correr `pnpm auditar:encuadre`
--   y mirar /anteojos-de-sol, /anteojos-de-sol/rusty y la PDP del Xold. La primaria del grid es la SBLK (no cambia); lo que cambia es la galería al elegir la variante.
-- Después: CLOUD_APPLIED.md, SEO_STRATEGY.md (ficha del Xold: carriles de title de los redondos Rusty), PRODUCTS_INVENTORY.md, BACKLOG.md (Blinded con copy viejo), COLA_CARGA_WEB.md.
-- ============================================
