-- ============================================
-- Seed 102: Vulk The Guardian SOL — cuadrado unisex, G-Flex, 4 colorways (2 de 4 polarizadas)
-- Fecha: 2026-08-26
-- ============================================
-- Octavo producto del cruce `pnpm ml:faltantes`, y **el de más demanda probada de todo lo que
-- quedaba: 80 ventas** sumando las publicaciones gemelas (el cruce reportaba 26 porque cuenta una
-- sola publicación por par).
--
-- 4 COLORWAYS, 15 UNIDADES, 3 PRECIOS. Ocho publicaciones = cuatro pares; cada colorway está
-- publicado dos veces compartiendo `user_product_id`, o sea el mismo pozo de stock.
--
--   SKU 109082  SBLK/S10 POL     negro brillo / gris   POL   8 u  $110.841  → MLA1530408248 (23 ventas)
--   SKU 109089  MBLK/S10 POL     negro mate / gris     POL   2 u  $110.841  → MLA1529900560 (26 ventas)
--   SKU 109081  MBLK/S10         negro mate / gris     no    4 u  $102.121  → MLA1530369076 (10 ventas)
--   SKU 109091  MBLK/REVO BLUE   negro mate / espejada no    1 u  $106.139  → MLA1529926216 (12 ventas)
--
-- Gemelas que quedan sin vincular: MLA1530343226, MLA1391471855, MLA1530290946, MLA1391458603.
-- Criterio de mapeo (formalizado en el seed 100): ventas → health → fotos, y por encima de todo que
-- el precio de la elegida sea el que se quiere publicar, porque `syncStockFromMLItem` sincroniza
-- `price_cents` además de `stock_qty`. Las cuatro gemelas devuelven `no_mapped_variants` y el stock
-- igual baja en las dos porque comparten pozo.
--
-- 🏷️ LOS 4 SKU Y EL PESO SALIERON DEL FABRICANTE, no hubo que pedírselos al founder. A diferencia
-- del Cinema, el Rew y el Ardigan, **este modelo SÍ está en vulkeyewear.com**
-- (`/eyewear/sunglasses/g-flex/the-guardian/`), y los SKU están en los atributos `data-sku` del
-- selector de colores. El catálogo tiene 7 colorways; el founder vende 4.
-- De la misma ficha: **Frente G-Flex · Patilla G-Flex · Bisagras: Sistema flexo · Peso 25 g ·
-- Talle Medium**.
--
-- ⚖️ PESO 25 g: se carga. La regla dura 7 es lista negra de MEDIDAS y dice literal que *"material,
-- peso, color, precio y stock sí se pueden tomar de esas fuentes"*. El antecedente del Trial (donde
-- la ficha del fabricante erró) fue sobre MEDIDAS, campo distinto.
-- ⚠️ Sin superlativos: 25 g **no es notable** y empata con el Vulk 53&3. Ranking de sol:
-- Spell 12,6 · Biller 13 · Dearly 17,3 · Ardigan 17,3 · The Trial 19,5 · Le Groupie 20 ·
-- **53&3 25 = Guardian 25** · Raven 26 · Day Light 26,1 · The Sil 28. Es la lección del Ardigan,
-- donde estuvo a punto de publicarse "el más liviano" y era falso: **ningún comparativo sin query**.
--
-- 📏 MEDIDAS: 141 / 53 x 51 / 14 / 140 mm — pasadas por el founder el 2026-08-26 (regla dura 7).
-- Geometría: 53x2 + 14 = 120 ≤ 141. ✓
-- El calibre, el puente y la varilla coinciden con la ficha del fabricante (53-14-140), pero el
-- **ancho total NO**: la ficha dice 142 y el founder midió **141**. Otra vez la fuente externa erró,
-- aunque por poco. Su "alto total" es del FRENTE, no del lente (ver seed 100): la descripción dice
-- "alto total 51 mm".
--
-- ⚠️⚠️ EL PROBLEMA CENTRAL DE ESTA FICHA: DOS COLORWAYS SE VEN IDÉNTICAS.
-- La 109089 (MBLK/S10 POL, $110.841) y la 109081 (MBLK/S10, $102.121) son **el mismo armazón negro
-- mate con la misma lente gris**. En las fotos del fabricante no se distinguen. Lo único que las
-- separa es el filtro polarizado y **$8.720**. Si el comprador elige mal, es un reclamo.
-- Se resolvió en TRES capas, y el founder recortó una cuarta que sobraba:
--   1. **`model_code` CON el sufijo " POL"** — excepción deliberada a la convención del seed 101,
--      que se lo saca por largo. Acá el " POL" ES el desempate visible bajo cada fila, y el code más
--      largo (`MBLK/REVO BLUE`, 14 chars) está muy por debajo de los 21 con los que el Yau rompió el
--      layout a 3 líneas.
--   2. **Callout `warning`** que nombra el problema en el título, no lo insinúa.
--   3. **Las dos van pegadas** (sort 2 y 3), con la polarizada primero: separadas se leen como carga
--      duplicada, pegadas con distinto badge y distinto precio se leen como una elección.
--
-- ⚠️ **Se había cargado además un `variant_note`** ("polarizada" / "sin polarizar") como cuarto slot
-- de la etiqueta, con el argumento de que el badge POLARIZADO es una señal SÓLO positiva. **El
-- founder lo sacó el 2026-08-26 mirando la fila renderizada, y tenía razón**: en la UI real cada fila
-- ya muestra CUATRO diferenciadores — el badge, el `model_code` (`MBLK/S10 POL` vs `MBLK/S10`), el
-- SKU y el precio. La nota era una quinta señal redundante que alargaba la etiqueta sin agregar
-- información. El slot `variant_note` queda igual en `describeVariant()` por si algún producto futuro
-- tiene variantes que compartan TODOS esos campos, que no es el caso acá.
-- En el mismo commit se arregló además un bug preexistente que agravaba esto: el carrito tenía su
-- propia `variantLabel()` que devolvía los slugs crudos ("negro-mate / gris-oscuro") y no mostraba
-- el indicador Polarizado. Afectaba a todo el catálogo.
--
-- HONESTIDAD — 2 de 4 polarizadas: NO se afirma "polarizados" del modelo en title/H1/short_description
-- (criterio Rew 1/2, Le Groupie 1/4, Dieven 2/3; NO el Zion/Cinema/Ardigan donde eran todas).
-- `lens_treatment` del producto queda `["uv400"]`, sin `polarized`. Callout `warning`, no `tip`.
-- Consecuencia verificada en código: entra a `/anteojos-de-sol/polarizados` (criterio por VARIANTE,
-- mostrando sólo las 2 POL y recalculando la card a $110.841) y NO a `/anteojos-de-sol/vulk/polarizados`
-- (criterio por PRODUCTO). Por eso la ficha NO linkea a esa segunda faceta: sería un link a una
-- página que la excluye.
-- ⚠️ Los `model_code` de las dos POL matchean el regex `\bPOL\b` de `isPolarizedVariant`, pero el
-- flag `"polarized"` va explícito igual en las CUATRO (true y false). El regex es el ÚLTIMO check de
-- la función y depende de que el texto del code sobreviva una edición — y la convención más reciente
-- (seed 101) es justamente sacarle el " POL".
--
-- 📸 FOTOS del fabricante, `01.jpg` frente y `02.jpg` perfil por colorway, 900×442, normalizadas con
-- `pnpm placas --solo 1,2` a 2000×1333 con el anteojo al 92%. Las 8 se abrieron antes de asignarlas.
-- NO se cargó la foto de packaging del fabricante: Vulk ya tiene imagen de kit a nivel MARCA que
-- `buildGalleryImages()` inyecta sola al final de la galería de todos los productos Vulk, así que
-- serían dos fotos de packaging en el mismo carrusel — y encima la del fabricante muestra funda
-- blanda de cuerina contra el "estuche rígido o semirrígido" que promete BUSINESS_POLICIES §1.
-- Esa duda es de MARCA, no de este producto: está abierta desde el Cinema en DATOS_PENDIENTES.
--
-- SEO — SIN CARRIL DE FORMA, PERO CON UNO DE COLOR QUE ESTABA LIBRE.
-- Es el 5º cuadrado de sol de Vulk y el 25º del catálogo, y los dos carriles de forma tienen dueño:
-- `lentes de sol cuadrados` (390/11) es de The Sil y `anteojos de sol cuadrados` (170/14) del Zinz.
-- El Guardian arranca peor que el Ardigan y el Cinema: no tiene forma NI puede reclamar polarizado
-- (2/4). Pero es **4 de 4 negro**, y `anteojos de sol negros` (**110/mes, dificultad 14**) está
-- **libre en todo el catálogo**. Carril de color, patrón ya aprobado acá (Strewn lidera con
-- `anteojos transparentes mujer`, PRO 30 con `anteojos transparentes hombre`).
-- Riesgo asumido y acotado: el Rusty Peating también es 100% negro y cuadrado, pero su primaria
-- declarada es branded y conserva las cadenas COMPUESTAS (`lentes/anteojos de sol negros cuadrados`);
-- el Guardian toma la PLANA. Cross-link obligatorio entre los dos.
-- Descartados con número: `lentes de sol negros` (210, dif **36**), espejados (1 de 4, y
-- `anteojos de sol espejados` 50/36), polarizados (2/4 + ya la tomó el Ardigan), género (es unisex).
--
-- `is_featured` NO. Las 80 ventas lo justificarían, pero son **15 unidades repartidas en 4 colorways,
-- dos de ellas con 1 y 2**. Si el hero de la home le mete tráfico, esas dos se van a cero en días y
-- el hero muestra un producto con la mitad de las opciones sin stock. Y `is_featured` **no vence
-- solo** como `new_until`: queda prendido hasta que alguien se acuerde. El hero igual lo levanta por
-- `updated_at desc`, que es lo que viene pasando con las últimas 7 cargas.
--
-- 🔩 BISAGRAS: "sistema flexo" lo declara la ficha oficial. Se atribuye SIEMPRE a la BISAGRA, nunca
-- al material: G-Flex no autoriza a decir que el armazón sea flexible (regla del founder, barrido
-- pendiente sobre 51 productos en BACKLOG.md).
--
-- ⚠️ HALLAZGO PARA BACKLOG, no de esta carga: **colisión viva entre Vulk The Sil y Rusty Zinz sol**,
-- los dos reclaman `anteojos de sol cuadrados` en SEO_STRATEGY.md. Misma clase que la Blinded/Zion
-- que salió con el Ardigan.
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-the-guardian', 'Vulk The Guardian',
  'Anteojos de sol Vulk The Guardian: cuadrados unisex, todos negros, con frente y patillas de G-Flex y bisagras con sistema flexo. Pesan 25 g. De los 4 colores, 2 son polarizados.',
  E'Los **Vulk The Guardian** son **anteojos de sol cuadrados, unisex**, con frente y patillas de **G-Flex**. El fabricante declara **sistema de bisagras flexo**. Pesan **25 g**, talle medium.\n\nLa lente es de **policarbonato**, con **100% protección UV (UV400) y categoría 3** en los cuatro colores.\n\nMedidas: frente 141 mm · lente 53 mm de ancho · alto total 51 mm · puente 14 mm · varilla 140 mm.\n\nDisponible en 4 colores, todos negros:\n\n• **Negro brillo, lente gris oscuro** — **polarizada**.\n• **Negro mate, lente gris oscuro** — **polarizada**.\n• **Negro mate, lente gris oscuro** — no polarizada.\n• **Negro mate, lente espejada azul** — no polarizada.\n\n**El filtro polarizado lo tienen 2 de los 4 colores.** Los cuatro filtran el 100% de la radiación UV, pero sólo las versiones POL cortan los reflejos del asfalto y del agua.\n\nOjo con las dos del medio: son el mismo armazón negro mate con la misma lente gris. Lo único que cambia es el filtro polarizado, y ahí está toda la diferencia de precio. Al elegir, fijate en el badge POLARIZADO.\n\nDentro de la línea de sol de Vulk, el Guardian es el que viene sólo en negro: cuatro combinaciones sobre el mismo armazón, entre negro mate y negro brillo. Si buscás un anteojo de sol negro y querés elegir el lente antes que el color del marco, éste es el que te da esa opción.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "cuadrado",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "weight_grams": 25,
    "measurements": {"frame_width_mm": 141, "lens_width_mm": 53, "lens_height_mm": 51, "bridge_mm": 14, "temple_length_mm": 140},
    "hinge_system": "flexo",
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-09-25",
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado unisex de G-Flex, 25 g", "body": "Frente y patillas de G-Flex, talle medium. El fabricante declara sistema de bisagras flexo. Los cuatro colores son negros: cambia el acabado del armazón y el lente, no el color."},
      {"type": "warning", "position": "middle", "title": "Hay dos negro mate con lente gris: uno polariza y el otro no", "body": "Son el mismo armazón y la misma lente gris oscuro. La diferencia es el filtro polarizado, que lo tiene sólo la versión POL, y ahí está toda la diferencia de precio. Los dos filtran el 100% de la radiación UV; sólo el polarizado corta los reflejos del asfalto y del agua. Al elegir el color, fijate en el badge POLARIZADO."},
      {"type": "recommendation", "position": "bottom", "title": "Policarbonato UV400 categoría 3", "body": "Lente de policarbonato con 100% de protección UVA y UVB, categoría 3, pensada para sol fuerte. Categoría 3 no sirve para manejar de noche. Si dudás cuál te conviene, escribinos por WhatsApp y te asesoramos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1530408248", "MLA1530343226", "MLA1529900560", "MLA1391471855", "MLA1530369076", "MLA1530290946", "MLA1529926216", "MLA1391458603"], "imported_at": "2026-08-26"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Vulk The Guardian Negros | Óptica Carballo',
  'Anteojos de sol Vulk The Guardian: cuadrados unisex negros de G-Flex, policarbonato UV400 categoría 3. De los 4 colores, 2 polarizan. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Los 4 son items SIMPLES → `mercadolibre_variation_code` NULL en las cuatro (patrón Le Groupie/Rew).
-- sort 1 = SBLK, la de más stock (8 de 15), polarizada y el único color que no se confunde.
-- sort 2 y 3 = las dos gemelas, PEGADAS y con la polarizada primero. Lo que las distingue en la fila
-- renderizada: el badge POLARIZADO, el `model_code` (MBLK/S10 POL vs MBLK/S10), el SKU y el precio.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-the-guardian'), '109082',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10 POL","polarized":true}'::jsonb,
   11084100, 8, true, 1, 'MLA1530408248', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-the-guardian'), '109089',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   11084100, 2, true, 2, 'MLA1529900560', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-the-guardian'), '109081',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10","polarized":false}'::jsonb,
   10212100, 4, true, 3, 'MLA1530369076', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-the-guardian'), '109091',
   '{"frame_color":"negro-mate","lens_color":"espejado-azul","model_code":"MBLK/REVO BLUE","polarized":false}'::jsonb,
   10613900, 1, true, 4, 'MLA1529926216', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 9 imágenes, con `medidas.jpg` (variant_id NULL, sort 99).
-- "polarizada" SÓLO en los alt de las dos POL. Los alt de las gemelas difieren en esa única palabra
-- final, que es exactamente la diferencia entre ellas.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-the-guardian'), (SELECT id FROM public.product_variants WHERE sku='109082'),
   'vulk-the-guardian/perfil-sblk.jpg', 'Anteojos de sol Vulk The Guardian cuadrados unisex vista lateral, armazón negro brillo lente gris oscuro polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-the-guardian'), (SELECT id FROM public.product_variants WHERE sku='109082'),
   'vulk-the-guardian/frente-sblk.jpg', 'Anteojos de sol Vulk The Guardian cuadrados unisex vista frontal, armazón negro brillo lente gris oscuro polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-guardian'), (SELECT id FROM public.product_variants WHERE sku='109089'),
   'vulk-the-guardian/perfil-mblk-pol.jpg', 'Anteojos de sol Vulk The Guardian cuadrados unisex vista lateral, armazón negro mate lente gris oscuro polarizada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-guardian'), (SELECT id FROM public.product_variants WHERE sku='109089'),
   'vulk-the-guardian/frente-mblk-pol.jpg', 'Anteojos de sol Vulk The Guardian cuadrados unisex vista frontal, armazón negro mate lente gris oscuro polarizada', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-guardian'), (SELECT id FROM public.product_variants WHERE sku='109081'),
   'vulk-the-guardian/perfil-mblk.jpg', 'Anteojos de sol Vulk The Guardian cuadrados unisex vista lateral, armazón negro mate lente gris oscuro', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-guardian'), (SELECT id FROM public.product_variants WHERE sku='109081'),
   'vulk-the-guardian/frente-mblk.jpg', 'Anteojos de sol Vulk The Guardian cuadrados unisex vista frontal, armazón negro mate lente gris oscuro', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-guardian'), (SELECT id FROM public.product_variants WHERE sku='109091'),
   'vulk-the-guardian/perfil-revo.jpg', 'Anteojos de sol Vulk The Guardian cuadrados unisex vista lateral, armazón negro mate lente espejada azul', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-guardian'), (SELECT id FROM public.product_variants WHERE sku='109091'),
   'vulk-the-guardian/frente-revo.jpg', 'Anteojos de sol Vulk The Guardian cuadrados unisex vista frontal, armazón negro mate lente espejada azul', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-guardian'), NULL,
   'vulk-the-guardian/medidas.jpg', 'Esquema técnico de medidas Vulk The Guardian: frente 141mm, lente 53mm de ancho, alto total 51mm, puente 14mm, varilla 140mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
