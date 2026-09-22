-- ============================================
-- Seed 110: Rusty Vriviant — 2da variante MBLK/G. BROWN y corrección del honesty check
-- Fecha: 2026-09-22
-- ============================================
-- Completa el `rusty-vriviant` cargado en el seed 109 (sólo el SBLK/S10 POL) con la segunda
-- colorway que el founder publicó en ML durante el mismo turno.
--   MBLK/G. BROWN · SKU 112845 · negro mate / lente marrón degradé · NO polarizada · $67.497 · 2 u ·
--   **MLA3981541946** (tradicional, `catalog_listing:false`, item simple → var_code NULL).
--
-- ⚠️ EL FOUNDER PASÓ EL LINK DE UN `/up/` (MLAU5238054855), no de un item directo. Se resolvió
-- buscando entre las publicaciones del vendedor cuál tenía ese `user_product_id`: aparecieron DOS,
-- una de catálogo (MLA3981477230, 0 ventas) y la tradicional (MLA3981541946). Se mapea la segunda,
-- misma regla que en el SBLK.
--
-- 🔺 ML VOLVIÓ A ERRAR LA FORMA: acá dice **"Rectangular Redondeado"** (ni siquiera "Redondo" como
-- en la SBLK). **Séptima vez seguida** que la declara mal. Se mantiene `cuadrado`, ya resuelto en
-- el seed 109 contra el catálogo y las medidas del founder.
--
-- 📉 POR QUÉ ESTE SEED EXISTE APARTE DEL 109: el producto se cargó primero con 1 sola variante
-- (100% de las variantes cargadas eran polarizadas), así que el title, la meta y el
-- `lens_treatment` de producto afirmaban "Polarizados" con razón EN ESE MOMENTO. Al sumar el MBLK
-- (no polarizada), pasa a ser 1 de 2 y el criterio del proyecto (Rew 1/2, Dunsert 1/3, Bad Card
-- 2/6) obliga a sacar la palabra del title, del H1/name/short_description y del `lens_treatment` de
-- producto. Es la MISMA corrección que hizo falta en el Bruice al pasar de 4 a 5 colores (seed 108)
-- y estaba anotada como deuda explícita en el comentario del seed 109 para no olvidarla.
--
-- Cambios aplicados sobre el producto:
--   • `meta_title`: "…Vriviant Polarizados Mujer…" → **"…Vriviant Cuadrados Mujer…"** (55 chars).
--   • `meta_description`: reescrita, 158 chars, ahora dice "Uno de los dos colores polariza".
--   • `lens_treatment` de producto: `["uv400","polarized"]` → **`["uv400"]`**. El flag `polarized`
--     sigue en `true` SOLO en la variante SBLK.
--   • `description` y `short_description`: reescritas listando los 2 colores y el callout de
--     honestidad, en vez de afirmar polarizado para todo el modelo.
--   • Callout `warning` reescrito: "El polarizado lo tiene sólo uno de los dos colores".
--
-- 🎯 SEO — VALIDADO POR seo-strategist + VERIFICACIÓN ADVERSARIAL (workflow, 2 agentes).
-- La verificación confirmó el núcleo (title 55, meta 158, `female`, `["uv400"]` a nivel producto,
-- secundaria `lentes de sol cuadrados para mujer` 70/18) y corrigió 4 errores del informe antes de
-- que llegaran al seed: (1) el conteo de "cuadrados sin faceta" era 26, no 27 — se había salteado
-- el Gover; (2) "1 de 2 colorways es negra" es FALSO, los DOS armazones son negros (brillo/mate),
-- sólo cambia la lente; (3) el "criterio naranja del Bruice" citado para el Guardian estaba mal
-- traído (ese precedente es de difficulty 36, y `anteojos de sol negros` mide dif 14 — el motivo
-- real es que el Guardian ya tiene el string); (4) el bloque de SEO_STRATEGY.md no puede decir la
-- palabra prohibida del proyecto ("Cluster"), aunque cite un heading real que la contiene.
--
-- **El hallazgo grande de la verificación, no del informe original**: el problema del cuadrado
-- femenino no son 4 fichas, son 7 en la práctica. `Zinz` y `The Sil` son `unisex`, no "sin género"
-- como decía el borrador, y por `fetchBrandPageByGender`/`fetchCategoryByGender`
-- (`lib/catalog/queries.ts:225-226`) el `unisex` SÍ entra a `/anteojos-de-sol/rusty/mujer`. Sumando
-- Peating y Bruk (también `cuadrado unisex`), esa faceta de mujer ya reúne **6 cuadrados Rusty**
-- antes del Vriviant. Bloque completo con el detalle en SEO_STRATEGY.md.
--
-- Colisión de 4 titles ("anteojos de sol cuadrados mujer") entre Dileri/Vorez/Dearly/Katleen queda
-- documentada en BACKLOG.md — no se toca en este seed, requiere mirar las 4 fichas juntas.
--
-- 🏷️ Etiquetas usadas: todas ya existían en `variant-label.ts` (`negro-mate`, `marron-degrade`).
-- No hizo falta agregar ninguna.
-- ============================================

BEGIN;

UPDATE public.products SET
  description = E'Los **Rusty Vriviant** son **lentes de sol de diseño femenino**, con un frente **cuadrado de esquinas redondeadas**, frente y patillas de **G-Flex** y **bisagras metálicas con sistema flex**.\n\nLa lente es de **policarbonato**, con **100% de protección UV (UV400) y categoría 3**.\n\nMedidas: frente 138 mm · lente 50 mm de ancho · alto total 50 mm · puente 17 mm · varilla 145 mm.\n\nCon 138 mm de frente es un anteojo **de medida contenida**, de los más angostos del catálogo. Si usás un anteojo grande y te queda flojo en las sienes, éste va para el otro lado.\n\nDisponible en 2 colores:\n\n• **Negro brillo, lente negro pleno** — **polarizada**.\n• **Negro mate, lente marrón degradé** — no polarizada.\n\n**Ojo con el filtro polarizado: lo tiene sólo uno de los dos colores.** El polarizado corta el reflejo del asfalto, del agua y de la nieve: es el que resuelve el encandilamiento cuando manejás de día o estás cerca del agua. Los dos colores filtran el 100% de la radiación UV, pero sólo el negro brillo suma ese filtro extra. Fijate cuál elegís, y si tenés dudas escribinos.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  short_description = 'Lentes de sol Rusty Vriviant: diseño femenino cuadrado de esquinas redondeadas, con frente y patillas de G-Flex y bisagras metálicas con sistema flex. Policarbonato UV400 categoría 3. Disponible en 2 colores, uno de ellos con lente polarizada.',
  attributes = jsonb_set(
    jsonb_set(attributes, '{lens_treatment}', '["uv400"]'::jsonb),
    '{callouts}',
    '[
      {"type": "info", "position": "top", "title": "Diseño femenino de G-Flex, frente de 138 mm", "body": "Frente y patillas de G-Flex, con bisagras metálicas de sistema flex. El frente cuadrado tiene las esquinas redondeadas y mide 138 mm, de los más angostos del catálogo: es un anteojo de medida contenida."},
      {"type": "warning", "position": "middle", "title": "El polarizado lo tiene sólo uno de los dos colores", "body": "El negro brillo con lente negro pleno es polarizado y corta el reflejo del asfalto, del agua y de la nieve. El negro mate con lente marrón degradé no lo trae. Los dos filtran el 100% de la radiación UV: la diferencia es sólo ese filtro extra."},
      {"type": "recommendation", "position": "bottom", "title": "Policarbonato UV400 categoría 3", "body": "Lente de policarbonato con 100% de protección UVA y UVB, categoría 3, pensada para sol fuerte. Categoría 3 no sirve para manejar de noche. Si dudás con el talle, escribinos por WhatsApp: con 138 mm de frente es un anteojo angosto."}
    ]'::jsonb
  ),
  meta_title = 'Lentes de Sol Rusty Vriviant Cuadrados Mujer | Carballo',
  meta_description = 'Lentes de sol Rusty Vriviant: cuadrados femeninos de G-Flex y lente UV400, con bisagras metálicas flex. Uno de los dos colores polariza. Envío a todo el país.',
  updated_at = now()
WHERE slug = 'rusty-vriviant';

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-vriviant'), '112845',
   '{"frame_color":"negro-mate","lens_color":"marron-degrade","model_code":"MBLK/G. BROWN","polarized":false}'::jsonb,
   6749700, 2, true, 2, 'MLA3981541946', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-vriviant'), (SELECT id FROM public.product_variants WHERE sku='112845'),
   'rusty-vriviant/perfil-mblk.jpg', 'Lentes de sol Rusty Vriviant cuadrados femeninos vista lateral, armazón negro mate con lente marrón degradé y bisagras metálicas flex', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-vriviant'), (SELECT id FROM public.product_variants WHERE sku='112845'),
   'rusty-vriviant/frente-mblk.jpg', 'Lentes de sol Rusty Vriviant cuadrados femeninos vista frontal, armazón negro mate con lente marrón degradé', 2000, 1333, 3, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, updated_at=now();

COMMIT;
