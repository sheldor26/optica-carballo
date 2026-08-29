-- ============================================
-- Seed 99: Vulk Cinema SOL — redondo unisex, G-Flex con bisagras flexo, 3 colorways (todas pol)
-- Fecha: 2026-08-26
-- ============================================
-- Quinto producto del cruce `pnpm ml:faltantes`, y el de más demanda probada de la lista:
-- **46 ventas** en su publicación principal.
--
-- ⚠️ EL CRUCE DECÍA 6 COLORES Y 24 UNIDADES. SON 3 Y 12. Mismo patrón de duplicación que el Zion
-- (seed 98): el producto está publicado una vez como item multi-variación (MLA1695892216, 3
-- variaciones) y otra vez como 3 items simples sueltos. Acá se pudo probar de forma directa, porque
-- los `user_product_id` coinciden UNO A UNO entre las variaciones y los simples:
--   MLAU332802952 → var 181995151359 (stock 8) = MLA1820759871
--   MLAU332804420 → var 181995151361 (stock 3) = MLA1820759867
--   MLAU332804422 → var 181995151363 (stock 1) = MLA3427757366
-- Comparten el pozo de stock: es el mismo inventario contado dos veces. `pnpm ml:faltantes` no lo
-- detecta porque el item multi-variación NO expone `user_product_id` a nivel padre, sólo dentro de
-- cada variación. Anotado como mejora pendiente del script (segunda vez que aparece).
--
-- Se mapea el item MULTI-VARIACIÓN, que es además la publicación viva (46 ventas contra 0 de las
-- simples) y ahorra 2 de cada 3 llamadas del cron de reconciliación.
--
-- 📏 MEDIDAS: 140 / 48 x 50 / 22 / 135 mm — pasadas por el founder (regla dura 7 de CLAUDE.md).
-- Geometría: 48x2 + 22 = 118 ≤ 140. ✓
-- Confirmadas después de forma independiente por el catálogo oficial de Vulk, que declara
-- SIZE 48-22-135 para las cinco colorways del modelo. Las de ML eran inservibles: MLA1820759867
-- declara varilla de 342,9 cm y MLA1820759871 dice 54-19-145.
--
-- ⚖️ PESO: no lo da ninguna fuente. Va a PESOS_A_MEDIR.md, sin la clave `weight_grams`.
--
-- 🎨 LAS 3 COLORWAYS. El catálogo del fabricante tiene 5 (MBLK/GREY POL 956950, CRY/G.GREY POL
-- 956951, BROWN/DRT04 956952, L.PINK/G.GREY POL 956953, BURDEOS/GB27 956954); el founder vende 3.
--   · MBLK/GREY POL      SKU 956950  stock 8  negro mate, lente gris oscuro
--   · L.PINK/G.GREY POL  SKU 956953  stock 1  rosa claro translúcido, lente gris DEGRADÉ
--   · Terracota          SIN SKU     stock 3  marrón terracota translúcido, lente verde musgo
-- ⚠️ La terracota **no tiene SKU de fábrica**: el founder confirmó que es una variante que llegó
-- con el color equivocado y se la quedaron. No figura en el catálogo de Vulk. Se le asignó el SKU
-- de casa `CINEMA-TERRACOTA`, siguiendo la convención ya usada en KATLEEN-MDEMI y SPELL-LGREY.
-- Las fotos son del producto real, así que el comprador ve exactamente lo que recibe.
--
-- ⚠️ `G.GREY` es *gradient grey*, no gris oscuro. El atributo LENS_COLOR de ML dice "Negro" para la
-- rosa, y es falso: en la foto se ve el degradé violáceo. Se cargó `gris-degrade`.
-- Los armazones rosa y terracota son TRANSLÚCIDOS, no opacos.
--
-- 📸 FOTOS de las galerías de ML (el modelo NO está en vulkeyewear.com — es de temporada vieja),
-- bajadas por `GET /pictures/{id}` a resolución real y pasadas por `pnpm placas --solo 1,2`.
-- ⚠️ En la terracota el perfil y el frente venían INVERTIDOS respecto de los otros dos colores.
-- Hay que abrir siempre las fotos antes de asignarlas.
--
-- 🔩 BISAGRAS FLEXO: dato del catálogo oficial que ML no declara. Es una afirmación del fabricante
-- sobre el SISTEMA DE BISAGRAS, no sobre el material. NO se dice que el G-Flex sea flexible: ésa es
-- una regla del founder (ver BACKLOG.md, el barrido de ese claim en 51 productos).
--
-- HONESTIDAD: las 3 colorways son polarizadas, así que se afirma "polarizados" para el modelo
-- entero en title/H1 (criterio Zion/Terdey 4/4 y 3/3, no el de Le Groupie 1/4). Por eso
-- `lens_treatment` incluye "polarized", lo que además lo mete a /anteojos-de-sol/vulk/polarizados,
-- donde el Bennie 51 (1/3) no entra.
--
-- SEO: carril branded (`anteojos de sol vulk cinema`, dif 4) + atributo polarizado. Los dos carriles
-- de forma están tomados por Rusty: Blinded → `lentes de sol redondos` (320), Zion → `anteojos de
-- sol redondos` (210). El corte contra el Bennie 51, que es el otro redondo Vulk, se hace por
-- variante léxica: Bennie arranca con "Lentes de Sol", el Cinema con "Anteojos de Sol", más el
-- claim de polarizado que sólo el Cinema puede hacer (3/3 contra 1/3).
-- ⚠️ `redondo` NO tiene faceta de forma en el sitio: el Cinema se suma a los 15 productos redondos
-- que quedan sin página. Decisión abierta del founder en DATOS_PENDIENTES.md.
-- ⚠️ DOS COSAS QUE ESPERAN RESPUESTA DEL FOUNDER (no bloquean el alta, son de una línea):
--   1. **Color del lente de la terracota.** El atributo de ML dice "Verde musgo", pero midiendo el
--      píxel del lente en la foto da RGB (79,78,80): gris neutro, con el verde POR DEBAJO del rojo y
--      del azul, y en degradé (66 arriba → 95 abajo). Se cargó `verde-oscuro`, que es compatible con
--      las dos lecturas (un verde muy oscuro lee casi neutro) y no promete el oliva que sugiere
--      "musgo". Que el founder lo mire sobre el armazón físico.
--   2. **Estuche o funda.** Se cargó `includes: ["estuche","franela"]`, que es el default de los
--      otros 20 productos Vulk y entra en "estuche rígido O SEMIRRÍGIDO" de BUSINESS_POLICIES §1
--      (la foto muestra funda de cuerina con broche). Es la única decisión que se tomó sin su
--      respuesta; si dice que es funda, cambia una línea. Abierto en DATOS_PENDIENTES.md.
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-cinema', 'Vulk Cinema',
  'Anteojos de sol Vulk Cinema: redondos unisex de G-Flex, con sistema de bisagras flexo. Lente de policarbonato polarizada, con 100% protección UV (UV400, categoría 3). Los tres colores polarizan.',
  E'Los **Vulk Cinema** son **anteojos de sol redondos, unisex**, con frente y patillas de **G-Flex** y **sistema de bisagras flexo**.\n\n**Los tres colores son polarizados.** La lente es de policarbonato, con **100% protección UV (UV400) y categoría 3**, y el filtro polarizado corta los reflejos del asfalto, del agua y de la nieve.\n\nMedidas: frente 140 mm · lente 48 mm de ancho · alto total 50 mm · puente 22 mm · varilla 135 mm.\n\nDisponible en 3 colores:\n\n• **Negro mate, lente gris oscuro.**\n• **Marrón terracota translúcido, lente verde oscuro.**\n• **Rosa claro translúcido, lente gris degradé.**\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "redondo",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400", "polarized"],
    "lens_category": 3,
    "gender": "unisex",
    "measurements": {"frame_width_mm": 140, "lens_width_mm": 48, "lens_height_mm": 50, "bridge_mm": 22, "temple_length_mm": 135},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-09-25",
    "callouts": [
      {"type": "info", "position": "top", "title": "Redondo unisex con bisagras flexo", "body": "Frente y patillas de G-Flex, el polímero que usa Vulk. El fabricante declara sistema de bisagras flexo."},
      {"type": "tip", "position": "middle", "title": "Los tres colores son polarizados", "body": "A diferencia de otros modelos donde el filtro polarizado está sólo en algunas variantes, acá lo llevan los tres. Corta los reflejos del asfalto, del agua y de la nieve. Aparte, la lente bloquea el 100% de la radiación UV."},
      {"type": "recommendation", "position": "bottom", "title": "Policarbonato UV400 categoría 3", "body": "Lente de policarbonato con 100% de protección UVA y UVB, categoría 3, pensada para sol fuerte. Categoría 3 no sirve para manejar de noche. Si dudás cuál te conviene, escribinos por WhatsApp y te asesoramos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1695892216"], "imported_at": "2026-08-26"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Vulk Cinema Redondos Polarizados | Carballo',
  'Anteojos de sol Vulk Cinema: redondos unisex de G-Flex, lente de policarbonato polarizada UV400 categoría 3. Los tres colores polarizan. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Item MULTI-VARIACIÓN: las tres llevan `variation_code` real. SKUs del catálogo de Vulk salvo la
-- terracota, que no tiene código de fábrica (ver cabecera) y va con SKU de casa.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-cinema'), '956950',
   '{"frame_color":"negro-mate","temple_color":"negro","lens_color":"gris-oscuro","model_code":"MBLK/GREY POL","polarized":true}'::jsonb,
   9620500, 8, true, 1, 'MLA1695892216', '181995151359'),
  ((SELECT id FROM public.products WHERE slug='vulk-cinema'), 'CINEMA-TERRACOTA',
   '{"frame_color":"marron-transparente","temple_color":"marron","lens_color":"verde-oscuro","model_code":"Terracota","polarized":true}'::jsonb,
   9620500, 3, true, 2, 'MLA1695892216', '181995151361'),
  ((SELECT id FROM public.products WHERE slug='vulk-cinema'), '956953',
   '{"frame_color":"rosa-transparente","temple_color":"rosa","lens_color":"gris-degrade","model_code":"L.PINK/G.GREY POL","polarized":true}'::jsonb,
   9620500, 1, true, 3, 'MLA1695892216', '181995151363')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Primaria = perfil de la MBLK, que es la de más stock (8 de 12). La placa de medidas va con
-- variant_id NULL y sort 99, como en todos los productos.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-cinema'), (SELECT id FROM public.product_variants WHERE sku='956950'),
   'vulk-cinema/perfil-mblk-grey.jpg', 'Anteojos de sol Vulk Cinema redondos unisex vista lateral, armazón negro mate lente gris oscuro polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-cinema'), (SELECT id FROM public.product_variants WHERE sku='956950'),
   'vulk-cinema/frente-mblk-grey.jpg', 'Anteojos de sol Vulk Cinema redondos unisex vista frontal, armazón negro mate lente gris oscuro polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-cinema'), (SELECT id FROM public.product_variants WHERE sku='CINEMA-TERRACOTA'),
   'vulk-cinema/perfil-terracota.jpg', 'Anteojos de sol Vulk Cinema redondos unisex vista lateral, armazón marrón terracota translúcido lente verde oscuro polarizada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-cinema'), (SELECT id FROM public.product_variants WHERE sku='CINEMA-TERRACOTA'),
   'vulk-cinema/frente-terracota.jpg', 'Anteojos de sol Vulk Cinema redondos unisex vista frontal, armazón marrón terracota translúcido lente verde oscuro polarizada', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-cinema'), (SELECT id FROM public.product_variants WHERE sku='956953'),
   'vulk-cinema/perfil-lpink-ggrey.jpg', 'Anteojos de sol Vulk Cinema redondos unisex vista lateral, armazón rosa claro translúcido lente gris degradé polarizada', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-cinema'), (SELECT id FROM public.product_variants WHERE sku='956953'),
   'vulk-cinema/frente-lpink-ggrey.jpg', 'Anteojos de sol Vulk Cinema redondos unisex vista frontal, armazón rosa claro translúcido lente gris degradé polarizada', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-cinema'), NULL,
   'vulk-cinema/medidas.jpg', 'Esquema técnico de medidas Vulk Cinema: frente 140mm, lente 48mm de ancho, alto total 50mm, puente 22mm, varilla 135mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
