-- ============================================
-- Seed 107: Vulk Harry SOL — aviador doble puente para hombre, G-Flex, 1 colorway
-- Fecha: 2026-08-31
-- ============================================
-- Duodécimo producto del cruce `pnpm ml:faltantes`, y **el tope de la lista de "stock parado que
-- además ya vendió"**: 19 unidades y 20 ventas sobre un solo color.
--
-- 1 COLORWAY, 19 UNIDADES, $89.427. Una sola publicación, tradicional del founder:
-- **MLA1897028632** (`catalog_listing: false`, health 0,81, 20 ventas, 6 fotos), item **SIMPLE**
-- (0 variaciones) → UP MLAU723920207 · SKU **125324** · MBLK/S10 negro mate / lente gris oscuro.
-- ⚠️ `mercadolibre_variation_code` va **NULL** acá (patrón Le Groupie/Rew/Guardian/Dunsert), NO el ID
-- numérico del Ardigan/Bad Card/Gover. Es item simple: `getAllVariationCodes` matchea por item.
--
-- 🔺 FORMA `aviador`, CONTRA ML — QUINTA VEZ SEGUIDA QUE LA DECLARA MAL.
-- ML dice `FRAME_SHAPE = "Anteojo Cuadrado"` y `DESIGN = "Anteojo Cuadrado"`, y el título repite
-- "Anteojo Cuadrado". Resuelto con el método del Bad Card: se bajaron las primarias de dos productos
-- ya clasificados y se compararon al lado.
--   • **Rusty Malice** (`cuadrado`): puente SIMPLE, sin barra superior, lente rectangular de lados
--     rectos. Es lo que ML dice que sería el Harry, y no se parece.
--   • **Rusty Bad Card** (`aviador`): barra recta arriba, puente DOBLE calado, lente que se afina
--     hacia abajo. **Idéntica familia al Harry.**
-- El Harry tiene barra superior recta, puente doble con ranuras de ventilación y lente angular
-- hexagonal que se afina: es un navigator/aviador, no un cuadrado. Racha de ML: Zion, Ardigan y
-- Dunsert hacia "Ovalada", Bad Card y Harry hacia "Rectangular"/"Cuadrado" — **los cinco eran de
-- doble puente o de esquina redondeada**, que es justo donde su taxonomía se rompe.
--
-- 📏 MEDIDAS: 142 / 57 x 54 / 14 / 140 mm — pasadas por el founder el 2026-08-31 (regla dura 7).
-- Geometría: 57x2 + 14 = 128 ≤ 142. ✓ El calibre de **57 mm es de los más grandes del catálogo**.
-- ⭐ DATO NUEVO Y VALE ANOTARLO: **ML declaraba `LENS_WIDTH 5.7 cm`, `LENS_HEIGHT 5.4 cm` y
-- `BRIDGE_LENGTH 1.4 cm`, y coinciden EXACTO con lo que midió el founder.** Es la primera vez en
-- toda la tanda que una fuente externa acierta las medidas. No cambia la regla dura 7 —las medidas
-- las sigue pasando él— pero desmiente que ML siempre yerre: **yerra la FORMA, no necesariamente los
-- NÚMEROS.** Encaja con el hallazgo del Bad Card: calibre/puente/varilla salen del grabado de la
-- varilla y suelen estar bien; lo que se completa a ojo es el alto y el ancho totales (que acá ML
-- directamente no declaraba).
--
-- 🔩 BISAGRAS METÁLICAS CON SISTEMA FLEX — confirmado por el founder el 2026-08-31, y además su
-- propia placa vieja (foto `03` de la publicación) lo dice: "BISAGRA METÁLICA CON FLEX".
-- **Dos fuentes independientes.** `hinge_system: "flex"` (precedente Ardigan seed 101).
-- ⚠️ El flex se atribuye SIEMPRE a la BISAGRA: **G-Flex es el nombre del material y no autoriza a
-- decir que el armazón sea flexible** (regla del founder, MISTAKES.md:1014 y :1207).
--
-- 🔎 ANTIRREFLEX: 1 DE 1, ASÍ QUE ACÁ SÍ SE PUEDE AFIRMAR DEL MODELO.
-- La placa vieja del founder dice "LENTES CON ANTIRREFLEX". A diferencia del Dunsert (2 de 3) y del
-- Bad Card (4 de 6), **este modelo tiene un solo color**, así que no hay ratio que hedgear: el
-- antirreflex es del producto entero y puede ir en la meta_description sin "X de Y".
-- ⚠️ Se mantiene todo lo vetado en esas dos fichas: nada de "elimina los reflejos" (reduce),
-- "protege más de los UV", **"reduce el reflejo del asfalto" — eso es el polarizado**, "mejora la
-- nitidez", "menos fatiga visual". Y **no se dice "en la cara interna"**: igual que en el Bad Card,
-- el dato viene de una placa que no aclara dónde está la capa (en el Dunsert sí lo confirmó el
-- founder). Valor de variante `["antirreflejo"]` sin sufijo, precedente Katleen seed 52 y Bad Card.
-- ⚠️ NO ES POLARIZADO (`WITH_POLARIZED_LENS = No`): `"polarized": false` explícito, porque el
-- `model_code` "MBLK/S10" **contiene "S10" pero no "POL"** y el regex `\bPOL\b` de
-- `isPolarizedVariant` no lo salvaría si faltara el flag. Es exactamente la trampa del Rew.
--
-- ⚖️ SIN PESO. Ni ML ni la placa lo declaran. Va a `PESOS_A_MEDIR.md`. `weight_grams` AUSENTE del
-- jsonb, no en 0. **Ningún comparativo de peso** — se acaban de corregir 10 fichas por eso mismo.
--
-- 🎯 SEO — EL CARRIL YA ESTABA RESERVADO PARA ESTE PRODUCTO, POR ESCRITO.
-- `SEO_STRATEGY.md:385` dice textual, en el bloque del Bruice: *"Tampoco puede pelear género: es
-- unisex, así que `lentes de sol aviador hombre` (90/16) **sigue libre para un modelo masculino
-- futuro**"*. El Harry es ese modelo: ML lo declara `GENDER = Hombre` y es aviador doble puente.
-- **Toma `lentes de sol aviador hombre` (90 búsquedas/mes, dificultad 16)** — medido en
-- `KEYWORDS OPTICA/`, aparece en dos CSV con el mismo número.
-- Es el **primer producto del catálogo que reclama un carril de aviador + género**, y no pisa a
-- nadie: `lentes de sol aviador` (170/12) sigue siendo de The Take, `anteojos de sol aviador`
-- (110/10) de Yeah, y los dos cuadrados masculinos (Malice y Blozon) están en otra forma.
-- Descartada `anteojos de sol aviador hombre` (70, dif **36**): mismo perfil que
-- `lentes de sol naranjas` (50/36), ya rechazado en el Bruice.
-- Es el **10º aviador de sol** del catálogo y el **3º de Vulk** (con The Trial y 53&3).
--
-- ⚠️ EXISTE UN VULK HARRY DE RECETA SIN CARGAR: 3 publicaciones, 3 colores, 11 unidades
-- (MLA2014105118 L.GREY/DEMIBLUE, MLA2014066026 negro mate, MLA2058441522 verde translúcido/marrón).
-- Cuando se cargue, `fetchCompanionModality` los va a cross-linkear solo por convención de slug
-- (`vulk-harry` ↔ `vulk-harry-receta`). Anotado en BACKLOG.
--
-- 📸 FOTOS: 6 en la galería de ML. `01` perfil 3/4 y `02` frente, verificadas abriéndolas (la
-- convención se cumple, sin la inversión del Dunsert ni la del Gover). **La `03` es una placa
-- amarilla vieja con burbujas de texto y NO va a la galería** — pero fue la fuente que confirmó la
-- bisagra flex y el antirreflex, igual que la del C1 en el Bad Card. El amarillo es heredado, no es
-- la marca (azul marino + blanco).
--
-- `is_featured` NO: 1 solo color. Si el hero le mete tráfico y se agota, no hay alternativa que
-- ofrecer dentro de la misma ficha. El hero igual lo levanta por `updated_at desc`.
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-harry', 'Vulk Harry',
  'Lentes de sol Vulk Harry: aviador de doble puente para hombre, con frente y patillas de G-Flex, bisagras metálicas flex y lente de policarbonato UV400 con antirreflex.',
  E'Los **Vulk Harry** son **lentes de sol estilo aviador de doble puente, para hombre**, con frente y patillas de **G-Flex** y **bisagras metálicas con sistema flex**.\n\nLa lente es de **policarbonato**, con **100% de protección UV (UV400) y categoría 3**, y trae **antirreflex**.\n\nMedidas: frente 142 mm · lente 57 mm de ancho · alto total 54 mm · puente 14 mm · varilla 140 mm.\n\n**El calibre de 57 mm es de los más grandes del catálogo**, así que cubre bien y se apoya ancho sobre la cara. Si usás un anteojo chico y te queda holgado en las sienes, este va para el otro lado.\n\nViene en un solo color: **negro mate con lente gris oscuro**.\n\nSobre el antirreflex: en un anteojo de sol el tinte filtra la luz que atraviesa el cristal, pero no la que te llega desde atrás o de costado, rebota en la cara de adentro y te vuelve al ojo. Ese reflejo es el que corta el antirreflex. Lo reduce, no lo elimina, y se nota sobre todo con el sol bajo a tus espaldas.\n\n**No es polarizado.** El polarizado corta el reflejo del asfalto y del agua que tenés adelante, que es otra cosa: si lo que buscás es manejar de día o ir a la playa, fijate en los modelos con el badge POLARIZADO.\n\nEl doble puente es la barra que cruza por arriba entre las dos lentes, acá con ranuras de ventilación. Es el rasgo que le da el aire de aviador clásico.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "aviador",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "male",
    "measurements": {"frame_width_mm": 142, "lens_width_mm": 57, "lens_height_mm": 54, "bridge_mm": 14, "temple_length_mm": 140},
    "hinge_system": "flex",
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-09-30",
    "callouts": [
      {"type": "info", "position": "top", "title": "Aviador de doble puente para hombre, calibre 57", "body": "Frente y patillas de G-Flex, con bisagras metálicas de sistema flex. El calibre de 57 mm es de los más grandes del catálogo: cubre bien y se apoya ancho sobre la cara. El doble puente lleva ranuras de ventilación."},
      {"type": "warning", "position": "middle", "title": "Trae antirreflex, pero no es polarizado", "body": "El antirreflex corta el reflejo que te vuelve al ojo cuando la luz te pega desde atrás o de costado. Lo reduce, no lo elimina. El polarizado es otra cosa: corta el reflejo del asfalto y del agua que tenés adelante, y este modelo no lo trae. Si lo querés para manejar de día o para la playa, mirá los que tienen el badge POLARIZADO."},
      {"type": "recommendation", "position": "bottom", "title": "Policarbonato UV400 categoría 3", "body": "Lente de policarbonato con 100% de protección UVA y UVB, categoría 3, pensada para sol fuerte. Categoría 3 no sirve para manejar de noche. Si dudás con el talle, escribinos por WhatsApp: con 57 mm de calibre y 142 mm de frente es un anteojo grande."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1897028632"], "imported_at": "2026-08-31"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Vulk Harry Aviador Hombre | Óptica Carballo',
  'Lentes de sol Vulk Harry: aviador de doble puente para hombre, de G-Flex, con lente de policarbonato UV400 categoría 3 y antirreflex. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Item SIMPLE → `mercadolibre_variation_code` NULL. Un ID numérico acá NO matchearía.
-- `"polarized": false` EXPLÍCITO: el code "MBLK/S10" no contiene "POL", así que el regex de
-- `isPolarizedVariant` no puede suplir un flag faltante (trampa verificada en el Rew, seed 100).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-harry'), '125324',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10","polarized":false,"lens_treatment":["antirreflejo"]}'::jsonb,
   8942700, 19, true, 1, 'MLA1897028632', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 3 imágenes: perfil (primaria del grid), frente y medidas. La `03` de ML es una placa vieja y no entra.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-harry'), (SELECT id FROM public.product_variants WHERE sku='125324'),
   'vulk-harry/perfil.jpg', 'Lentes de sol Vulk Harry aviador de doble puente para hombre vista lateral, armazón negro mate con lente gris oscuro y antirreflex', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-harry'), (SELECT id FROM public.product_variants WHERE sku='125324'),
   'vulk-harry/frente.jpg', 'Lentes de sol Vulk Harry aviador de doble puente para hombre vista frontal, armazón negro mate con lente gris oscuro y antirreflex', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-harry'), NULL,
   'vulk-harry/medidas.jpg', 'Esquema técnico de medidas Vulk Harry: frente 142mm, lente 57mm de ancho, alto total 54mm, puente 14mm, varilla 140mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
