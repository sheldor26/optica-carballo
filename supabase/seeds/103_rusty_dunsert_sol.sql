-- ============================================
-- Seed 103: Rusty Dunsert SOL — cat eye redondeado unisex, G-Flex, 3 colorways (2 con antirreflex interno, 1 polarizada)
-- Fecha: 2026-08-29
-- ============================================
-- Noveno producto del cruce `pnpm ml:faltantes`. 57 ventas sumando las publicaciones gemelas.
--
-- 3 COLORWAYS, 17 UNIDADES, 2 PRECIOS. Seis publicaciones = tres pares; cada colorway está
-- publicado dos veces compartiendo `user_product_id`, o sea el mismo pozo de stock. Es el cuarto
-- modelo seguido con este patrón (Zion, Cinema, Ardigan, ahora el Dunsert): el cruce sobre-cuenta
-- porque el par multi-variación no expone `user_product_id` a nivel padre.
--
--   SKU 125411  LBR/GB1        marrón transp. / naranja degradé   AR   9 u  $94.306   UP MLAU178638559
--                              → MLA1562519439 (20 ventas) + MLA1469412698 (4)
--   SKU 125410  SBLK/S10       negro brillo / gris oscuro         AR   8 u  $94.306   UP MLAU181412208
--                              → MLA1382626523 (24 ventas) + MLA1382663111 (2)
--   SKU 125412  SBLK/SG91 POL  negro brillo / azul degradé        POL  0 u  $108.039  UP MLAU161771654
--                              → MLA1382496737 (pausada) + MLA1384453311 (pausada)
--
-- Criterio de mapeo (formalizado en el seed 100): ventas → health → fotos, y por encima de todo que
-- el precio de la elegida sea el que se quiere publicar, porque `syncStockFromMLItem` sincroniza
-- `price_cents` además de `stock_qty`.
--
-- 🏷️ LOS 3 SKU, LAS MEDIDAS, LAS BISAGRAS Y EL DATO DEL ANTIRREFLEX LOS PASÓ EL FOUNDER el
-- 2026-08-29. El modelo NO está en rustyoptical.com, así que no hubo ficha de fabricante que cruzar.
--
-- 📏 MEDIDAS: 140 / 55 x 54 / 19 / 145 mm — regla dura 7, medidas del founder y de nadie más.
-- Geometría: 55x2 + 19 = 129 ≤ 140. ✓
-- Su "alto total" es del FRENTE, no del lente (criterio fijado en el seed 100): la descripción dice
-- "alto total 54 mm". El puente de 19 mm es de los más anchos del catálogo de sol.
--
-- ⚖️ SIN PESO. El fabricante no lo declara y ML tampoco (los `PACKAGE_WEIGHT` de 80-120 g son del
-- paquete, no del armazón). Va a `PESOS_A_MEDIR.md` para que lo pese el founder. `weight_grams`
-- queda AUSENTE del jsonb, no en 0 ni inventado.
--
-- 🔩 BISAGRAS PLÁSTICAS SIN SISTEMA FLEX — dato del founder. Se dice tal cual, y es la única
-- mención de bisagra de la ficha. Nada de "flexible": **G-Flex es el nombre del material y NO
-- autoriza a decir que el armazón sea flexible** (regla del founder, ya corregida dos veces;
-- barrido pendiente sobre 51 productos en BACKLOG.md). Acá encima no hay NINGÚN claim de flex
-- disponible, porque las bisagras tampoco lo tienen.
--
-- ⚠️ EL DATO NUEVO DE ESTA FICHA: ANTIRREFLEX EN LA CARA INTERNA, EN 2 DE LOS 3 COLORES.
-- Validado con `optical-expert` antes de redactar nada. Lo que quedó en firme:
--   • Es real y es el estándar de la industria en anteojos de sol ("backside AR"). Cada cara
--     aire/lente refleja ~5% en policarbonato; en una lente de sol el tinte atenúa lo que ATRAVIESA
--     la lente pero NO lo que rebota en la cara de atrás, así que ese reflejo queda proporcionalmente
--     más molesto que en un cristal transparente. El AR multicapa lo baja a menos del 1%.
--   • NO hay razón técnica documentada por la que la polarizada no lo traiga: polarizado y AR
--     conviven de rutina (el PVA va laminado DENTRO, el AR se deposita SOBRE la superficie). Es una
--     decisión del fabricante y **no la inventamos**. Si algún día interesa, se le pregunta al
--     representante de Rusty.
--   • El polarizado NO compensa la falta de AR: la luz que viene de atrás rebota en la cara
--     posterior sin atravesar la película polarizante.
-- VETADO en toda la ficha: "elimina los reflejos" (reduce, no elimina) · "protege más de los UV"
-- (el AR común no agrega protección UV y no sabemos si éste lleva capa UV posterior) · "reduce el
-- reflejo del asfalto/agua" aplicado al AR (**eso es el polarizado**, y conflacionarlos haría creer
-- que las no-pol hacen lo que hace la pol) · "mejora la nitidez/la visión" · "menos fatiga visual"
-- (mismo estándar con el que se rechazó blue light) · "antirrayas"/"antiempañante".
-- Honestidad obligatoria: el beneficio es SITUACIONAL (sol bajo detrás o de costado, playa, nieve);
-- de frente al mediodía no se nota.
--
-- ⚠️ DÓNDE VA EL ANTIRREFLEX EN LOS DATOS: `lens_treatment` a nivel PRODUCTO queda `["uv400"]`.
-- Meterlo ahí afirmaría antirreflex para los TRES colores, incluida la polarizada que no lo tiene —
-- eso sí sería un claim falso publicado. Va a nivel VARIANTE como
-- `"lens_treatment":["antirreflejo-interno"]` en las dos que lo llevan, patrón ya usado por el
-- Deserve (seed 51) y el CCCP (seed 54). Tampoco existe el valor `anti_reflective` en el enum de
-- PRODUCT_SCHEMA.md: una clave desconocida se descarta en silencio en `lookup()`.
--
-- HONESTIDAD — 1 de 3 polarizada: la palabra "polarizados" NO va en title, H1 ni meta
-- (criterio Rew 1/2, Le Groupie 1/4, Guardian 2/4). Y por simetría, "antirreflex" tampoco va en
-- title ni H1: 2 de 3 no alcanza para afirmar un atributo a nivel modelo (criterio Bruk/Dieven/Yeah).
-- El antirreflex sí va a meta_description, callout, descripción y alt, que es donde rinde: es CTR y
-- conversión, no keyword.
--
-- 📦 LA POLARIZADA VA CON 0 UNIDADES Y SUS DOS PUBLICACIONES PAUSADAS. Se carga igual: la memoria
-- del proyecto dice usar siempre el stock de ML y cargar todas las variantes aunque estén en 0,
-- porque sincronizan solas. Precedente directo: el Beason ya tiene la SKU 128794 así.
-- Verificado en código qué pasa: entra a `/anteojos-de-sol/polarizados` porque `toPolarizedCatalog`
-- (`lib/catalog/polarized.ts`) resuelve por VARIANTE y **no filtra por stock** → la card se reduce a
-- la SG91 con `inStockCount:0` y `minPriceCents:null`, o sea "Sin stock" y sin precio. Es el estado
-- que ya tienen Deserve, Biller, Bruice y Lady Piny. NO entra a `/anteojos-de-sol/rusty/polarizados`,
-- que filtra por PRODUCTO (`lib/catalog/brand-filters.ts`) contra un `lens_treatment` que queda en
-- `["uv400"]`. Por eso la ficha linkea a la primera y NO a la segunda: sería un link a una página
-- que la excluye (mismo criterio que el Yeah y el Guardian).
-- ⚠️ NO se escribe "sin stock" en la descripción ni en el callout: se desactualiza solo cuando entren
-- unidades. El badge del selector ya lo comunica y se actualiza solo. Lo permanente y escrito es
-- "el filtro polarizado lo tiene sólo uno de los tres colores".
--
-- 🔺 FORMA: `cat_eye`, CONTRA ML. ML declara `FRAME_SHAPE = Ovalada` en las tres publicaciones y un
-- título dice "Ovalados", pero en las fotos de frente (MLA1382626523-02, MLA1562519439-01) el aro
-- superior SUBE hacia la sien y termina en punta por encima del punto de bisagra, mientras el
-- inferior es una curva redonda continua: arriba y abajo no se espejan. Un ovalado real es una
-- elipse simétrica de eje horizontal. Además el lente es 55 de ancho x 54 de alto, casi 1:1, y un
-- ovalado es netamente más ancho que alto. Es un **cat eye redondeado**, misma familia que el Beason.
-- Tercer caso seguido de "Ovalada" mal declarada por ML, tras el Zion y el Ardigan.
-- Valor concreto: `/anteojos-de-sol/cat-eye` pasa de 3 a 4 productos y
-- `/anteojos-de-sol/rusty/cat-eye` de 1 a 2 — deja de ser una faceta de un solo producto.
--
-- 👤 GÉNERO `unisex`, aunque un título de ML diga "Para Mujer" (el mismo título dice "Ovalados":
-- es relleno de keywords). Verificado en `lib/catalog/queries.ts`: `fetchCategoryByGender` y
-- `fetchBrandPageByGender` filtran `gender IN ('female','unisex')` para el target mujer, así que
-- cargarlo unisex es estrictamente dominante — entra igual a `/anteojos-de-sol/mujer` y
-- `/anteojos-de-sol/rusty/mujer` (las que deben rankear `anteojos de sol mujer` 5.400/10 y
-- `lentes de sol rusty mujer` 390/9) y además a las de hombre, sin poner un claim de género falso.
--
-- SEO — CARRIL DE FORMA, VARIANTE "LENTES".
-- Primaria: `lentes de sol cat eye` (50/mes, dif 36). La variante "anteojos de sol cat eye" (40) es
-- del Le Groupie y no se toca: mismo corte que The Take vs Yeah en aviador. Branded `rusty dunsert`
-- no aparece en ningún CSV, pero la SERP real son la ficha de catálogo de ML (MLA23035059) y cuatro
-- revendedores que la espejan (Óptica Saavedra, Tu Anteojos en Línea, Sunstore, Tienda de Anteojos),
-- todos titulando "Gafas Antirreflejo" sin decir cuáles la traen y sin medidas propias. Es ganable.
-- Descartadas con número: `anteojos/lentes cat eye` (320/10-13) y `ojo de gato` (110/12) viven en el
-- CSV de ARMAZONES = intención de receta, mismatch desde una ficha de sol (patrón "lentes espejados"
-- y `anteojos carey` del Bruice). `lentes de sol antireflex` (70/35) y `anteojos de sol antireflex`
-- (40/36): mismo perfil descartado que `lentes de sol naranjas` (50/36); el volumen real de
-- antirreflex está en receta (`anteojos antireflex` 720/10). `lentes de sol polarizados y
-- antireflejo` (90/12) es TRAMPA: hay demanda pero **ninguna variante cumple las dos cosas**.
-- `lentes de sol marrones` (110/11) es 1 de 3 (criterio naranja del Bruice). Negro es 2 de 3 pero
-- `anteojos de sol negros` lo tomó el Guardian hace una carga. `lentes de sol grandes` (90/19): con
-- frente de 140 mm no es honesto.
--
-- ANTI-CANIBALIZACIÓN vs **Rusty Beason**, el otro Rusty cat eye y el único choque real: el Beason
-- es `gender:female` con title "Cat Eye Mujer", 141 / 54x50 / 16 / 145, 26 g y paleta rosada; el
-- Dunsert es unisex, no reclama género, y es otro armazón (lente 54 de alto vs 50, puente 19 vs 16).
-- Cross-link obligatorio entre los dos. vs **Vulk Le Groupie**: marca y faceta de marca distintas.
-- vs **Vulk Yamain** (frame_shape cat_eye pero title "Ovalados Mujer"): sin solape.
--
-- 📸 FOTOS de las galerías de ML (`GET /pictures/{id}`), `01`/`02` por colorway, normalizadas con
-- `pnpm placas --solo 1,2` a 2000×1333 con el anteojo al 92%.
-- ⚠️ EN EL SBLK VENÍAN INVERTIDAS: el archivo `perfil` era el frente recto y el `frente` era el 3/4
-- lateral. Se detectó abriendo las 6 y comparándolas entre sí (el LBR y el SG91 sí venían bien), y
-- se corrigió ANTES del seed. Las dos ya subidas se borraron del bucket y se resubieron, porque
-- `subir-fotos-producto.ts` se niega a pisar un path a propósito (la imagen vieja queda cacheada
-- 31 días) — se pudo borrar sin costo sólo porque el producto todavía no existía y nadie las había
-- renderizado. La primaria del grid es SIEMPRE el perfil (regla del founder).
--
-- 🎨 COLORES DE LENTE VERIFICADOS ABRIENDO LAS FOTOS, no copiados de ML (lección del terracota del
-- Cinema). ML dice `LENS_COLOR = Negro` para el SBLK y es gris oscuro; dice `Naranja claro` para el
-- LBR y es un naranja degradé de verdad; dice `SG91` para la polarizada, que es un azul degradé.
-- `naranja-degrade` y `azul-degrade` se agregaron a `LENS_COLOR_LABELS` en `variant-label.ts` en el
-- mismo commit: sin entrada, el fallback title-case renderiza "Naranja Degrade" sin tilde.
--
-- `is_featured` NO: 17 unidades en 3 colorways y uno de ellos en cero. El hero igual lo levanta por
-- `updated_at desc`, que es lo que viene pasando con las últimas 8 cargas.
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-dunsert', 'Rusty Dunsert',
  'Lentes de sol Rusty Dunsert: cat eye redondeado unisex, con frente y patillas de G-Flex y bisagras plásticas. De los 3 colores, 2 traen antirreflex en la cara interna y 1 es polarizado.',
  E'Los **Rusty Dunsert** son **lentes de sol cat eye redondeado, unisex**, con frente y patillas de **G-Flex**. Las bisagras son de plástico, sin sistema flex.\n\nLa lente es de **policarbonato**, con **100% de protección UV (UV400) y categoría 3** en los tres colores.\n\nMedidas: frente 140 mm · lente 55 mm de ancho · alto total 54 mm · puente 19 mm · varilla 145 mm. El puente de 19 mm es de los más anchos del catálogo, así que apoya más abierto sobre la nariz que un cat eye clásico.\n\nDisponible en 3 colores:\n\n• **Marrón translúcido, lente naranja degradé** — con antirreflex interno.\n• **Negro brillo, lente gris oscuro** — con antirreflex interno.\n• **Negro brillo, lente azul degradé** — **polarizada**.\n\n**Dos de los tres colores llevan una capa antirreflex en la cara interna de la lente.** Sirve para esto: en un anteojo de sol el tinte filtra la luz que atraviesa el cristal, pero no la que te llega desde atrás o de costado, rebota en la cara de adentro y te vuelve al ojo. Ese reflejo es el que corta el antirreflex. Lo reduce, no lo elimina, y no cambia nada de lo que ves de frente: se nota sobre todo con el sol bajo a tus espaldas, o en la playa y la nieve con luz rebotando por detrás.\n\n**El antirreflex y el polarizado no son lo mismo y acá no vienen juntos.** El polarizado trabaja sobre lo que tenés adelante: corta el reflejo del asfalto, el agua y la nieve. El antirreflex trabaja sobre lo que te vuelve desde atrás. **El filtro polarizado lo tiene sólo uno de los tres colores**, el negro brillo con lente azul degradé, y es el único que no lleva antirreflex. Los tres filtran el 100% de la radiación UV.\n\nSobre los lentes: el naranja degradé del marrón translúcido es más oscuro arriba y más claro abajo. Los tintes cálidos tienden a dar un poco más de contraste que los grises, a cambio de teñir levemente cómo percibís los colores; si los querés lo más fieles posible, el gris oscuro es la opción neutra. El degradé cambia cuánta luz visible pasa según la zona de la lente, no la protección UV: el policarbonato bloquea el 100% de UVA y UVB en toda la superficie, también en la parte más clara, porque el bloqueo es del material y no del tinte.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "cat_eye",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "measurements": {"frame_width_mm": 140, "lens_width_mm": 55, "lens_height_mm": 54, "bridge_mm": 19, "temple_length_mm": 145},
    "hinge_system": "plastica",
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-09-28",
    "callouts": [
      {"type": "info", "position": "top", "title": "Cat eye redondeado unisex de G-Flex", "body": "Frente y patillas de G-Flex, con bisagras plásticas sin sistema flex. El puente de 19 mm es de los más anchos del catálogo: apoya más abierto sobre la nariz que un cat eye clásico."},
      {"type": "warning", "position": "middle", "title": "El antirreflex y el polarizado no vienen juntos", "body": "Los dos colores con antirreflex (la capa va en la cara interna y corta el reflejo que entra por detrás) no polarizan. El único polarizado, que sí corta el reflejo del asfalto y del agua que tenés adelante, no lleva antirreflex. Son cosas distintas: fijate cuál te sirve más antes de elegir el color."},
      {"type": "recommendation", "position": "bottom", "title": "Policarbonato UV400 categoría 3", "body": "Lente de policarbonato con 100% de protección UVA y UVB, categoría 3, pensada para sol fuerte. El bloqueo UV es del material, así que también vale en la parte más clara del degradé. Categoría 3 no sirve para manejar de noche. Si dudás cuál te conviene, escribinos por WhatsApp y te asesoramos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1562519439", "MLA1469412698", "MLA1382626523", "MLA1382663111", "MLA1382496737", "MLA1384453311"], "imported_at": "2026-08-29"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Rusty Dunsert Cat Eye | Óptica Carballo',
  'Lentes de sol Rusty Dunsert: cat eye unisex de G-Flex, policarbonato UV400 categoría 3. Dos de los tres colores traen antirreflex interno. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Los 3 son items SIMPLES → `mercadolibre_variation_code` NULL en los tres (patrón Le Groupie/Rew/Guardian).
-- sort 1 y 2 = las dos con antirreflex, PEGADAS y al mismo precio; sort 3 = la polarizada.
-- Así la fila de variantes se lee como la elección que realmente hay que hacer.
-- `model_code` SIN el sufijo " POL" (convención del seed 101): acá no hace falta como desempate
-- porque los tres codes ya son distintos, los tres lentes son de otro color y el badge POLARIZADO
-- está. El Guardian fue la excepción, y lo fue porque dos colorways eran idénticas.
-- El flag `"polarized"` va EXPLÍCITO en los tres (true y false): el regex `\bPOL\b` de
-- `isPolarizedVariant` es el último check y depende de que el texto del code sobreviva una edición.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-dunsert'), '125411',
   '{"frame_color":"marron-transparente","lens_color":"naranja-degrade","model_code":"LBR/GB1","polarized":false,"lens_treatment":["antirreflejo-interno"]}'::jsonb,
   9430600, 9, true, 1, 'MLA1562519439', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-dunsert'), '125410',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10","polarized":false,"lens_treatment":["antirreflejo-interno"]}'::jsonb,
   9430600, 8, true, 2, 'MLA1382626523', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-dunsert'), '125412',
   '{"frame_color":"negro-brillo","lens_color":"azul-degrade","model_code":"SBLK/SG91","polarized":true}'::jsonb,
   10803900, 0, true, 3, 'MLA1382496737', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 7 imágenes, con `medidas.jpg` (variant_id NULL, sort 99).
-- "y antirreflex interno" SÓLO en los alt de las dos que lo llevan; "polarizada" sólo en los de la SG91.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-dunsert'), (SELECT id FROM public.product_variants WHERE sku='125411'),
   'rusty-dunsert/perfil-lbr.jpg', 'Lentes de sol Rusty Dunsert cat eye unisex vista lateral, armazón marrón translúcido con lente naranja degradé y antirreflex interno', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-dunsert'), (SELECT id FROM public.product_variants WHERE sku='125411'),
   'rusty-dunsert/frente-lbr.jpg', 'Lentes de sol Rusty Dunsert cat eye unisex vista frontal, armazón marrón translúcido con lente naranja degradé y antirreflex interno', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-dunsert'), (SELECT id FROM public.product_variants WHERE sku='125410'),
   'rusty-dunsert/perfil-sblk.jpg', 'Lentes de sol Rusty Dunsert cat eye unisex vista lateral, armazón negro brillo con lente gris oscuro y antirreflex interno', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-dunsert'), (SELECT id FROM public.product_variants WHERE sku='125410'),
   'rusty-dunsert/frente-sblk.jpg', 'Lentes de sol Rusty Dunsert cat eye unisex vista frontal, armazón negro brillo con lente gris oscuro y antirreflex interno', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-dunsert'), (SELECT id FROM public.product_variants WHERE sku='125412'),
   'rusty-dunsert/perfil-sg91.jpg', 'Lentes de sol Rusty Dunsert cat eye unisex vista lateral, armazón negro brillo con lente azul degradé polarizada', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-dunsert'), (SELECT id FROM public.product_variants WHERE sku='125412'),
   'rusty-dunsert/frente-sg91.jpg', 'Lentes de sol Rusty Dunsert cat eye unisex vista frontal, armazón negro brillo con lente azul degradé polarizada', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-dunsert'), NULL,
   'rusty-dunsert/medidas.jpg', 'Esquema técnico de medidas Rusty Dunsert: frente 140mm, lente 55mm de ancho, alto total 54mm, puente 19mm, varilla 145mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
