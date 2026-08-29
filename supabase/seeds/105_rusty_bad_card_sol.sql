-- ============================================
-- Seed 105: Rusty Bad Card SOL — aviador doble puente unisex, G-Flex, 6 colorways (2 pol / 4 antirreflex)
-- Fecha: 2026-08-29
-- ============================================
-- Décimo producto del cruce `pnpm ml:faltantes` y **el tope de su lista de "stock parado que además
-- ya vendió"**: 33 unidades, el inventario más profundo de las últimas cargas (Dunsert 17,
-- Guardian 15, Rew 10).
--
-- 6 COLORWAYS, 33 UNIDADES, 2 PRECIOS, 6 VENTAS — Y EL 33 ES REAL. Se verificaron los seis
-- `user_product_id` uno por uno y son todos distintos, así que acá NO hay el doble conteo de
-- `ml:faltantes` que apareció en el Zion, el Cinema, el Ardigan y el Dunsert. Están partidos en
-- **dos publicaciones MULTI-VARIACIÓN que se comportan casi como dos productos**, porque la línea
-- que las separa es a la vez de tratamiento y de precio:
--
--   MLA1470709119 · $104.885 · 5 ventas · health 0,90 · WITH_POLARIZED_LENS=Sí
--     C3 rosa oscuro / marrón        POL  6 u  var 182731106070  UP MLAU2939882359
--     C5 negro mate / gris oscuro    POL  5 u  var 189766967733  UP MLAU3364622606
--   MLA2498615612 · $90.836 · 1 venta · health null · LENS_TREATMENT=ANTIREFLEX/PROTECCION UV400
--     C2 marrón transp. / gris deg.  AR  11 u  var 192307652495  UP MLAU3523301504
--     C1 azul metálico / gris deg.   AR   5 u  var 192307652497  UP MLAU3523295682
--     C4 carey / gris degradé        AR   3 u  var 192307652499  UP MLAU3523299372
--     C6 negro brillo / gris deg.    AR   3 u  var 192307652501  UP MLAU3523299376
--
-- ⚠️⚠️ LA TRAMPA TÉCNICA DE ESTA CARGA: `mercadolibre_variation_code` VA CON EL ID NUMÉRICO.
-- Son items MULTI-variación (patrón Ardigan seed 101), NO simples (patrón Le Groupie/Rew/Guardian/
-- Dunsert, donde va NULL). Y el modo de falla es silencioso: `sync-stock.ts:296-298` hace
-- `if (!variant.mercadolibre_variation_code) { skipped++; continue; }` — **no llama a
-- `logMLSyncError`, no escribe en `marketplace_sync_errors`, sólo incrementa un contador**. Un NULL
-- por inercia dejaría las 6 congeladas en stock **y precio** para siempre sin que se note mirando la
-- PDP. Como ML no declara `SELLER_SKU` en ninguna de las 6, `seller_custom_field` es null y el ID
-- numérico es el único formato que matchea (`getAllVariationCodes`, líneas 49-64).
-- ✅ El cruce de precios que preocupaba NO puede pasar: `sync-stock.ts:256-260` filtra
-- `.eq('mercadolibre_item_id', mlItemId)`, así que un webhook de una publicación sólo toca SUS
-- variantes. El radio de impacto es el MLA, no el producto. Lo que sí hay que aceptar es que
-- **el precio de ML gana siempre** (líneas 313-315, sin umbral ni log): las dos publicaciones se
-- repricean juntas o la ficha queda con un salto que nadie decidió.
--
-- 🔺 FORMA: `aviador`, CONTRA ML — Y CONTRA UNO DE LOS DOS AGENTES.
-- ML declara "Anteojo Rectangular Doble puente" / "Lentes Rectangulares doble puente".
-- `seo-strategist` le creyó y dijo `rectangular`; `catalog-loader` dijo `aviador`. **Se desempató
-- verificando, no eligiendo**: se bajaron las primarias del **Rusty Bruice** (que el catálogo ya
-- clasifica `aviador`) y del **Rusty Rew** (`rectangular`) y se compararon con las del Bad Card.
-- El Bruice tiene puente doble, barra recta arriba y lente trapezoidal que se afina — **idéntica
-- familia**. El Rew tiene lente plana, puente simple y sin barra. **El founder lo confirmó con el
-- armazón en la mano el 2026-08-29: "Es estilo aviador doble puente".**
-- Cuarta forma mal declarada por ML seguida (Zion, Ardigan y Dunsert erraban hacia "Ovalada", ésta
-- hacia "Rectangular"). Entrada en LEARNINGS.md sobre el método de desempate.
-- ⚠️ El informe de SEO **se contradecía solo**: justificaba "no hay colisión con el Bruice" con
-- *"las formas son distintas: Bruice=aviador, Bad Card=rectangular"*, que es justo la premisa mala,
-- y toda su valuación colgaba de ahí (vendía que `/anteojos-de-sol/rusty/rectangular` pasaba de 1 a
-- 2 productos). Eso NO ocurre.
--
-- 📏 MEDIDAS: 143 / 54 x 53 / 19 / 145 mm — pasadas por el founder el 2026-08-29 (regla dura 7).
-- Geometría: 54x2 + 19 = 127 ≤ 143. ✓ Su "alto total" es del FRENTE, no del lente (criterio del
-- seed 100): la descripción dice "alto total 53 mm".
-- ⚠️ HALLAZGO SOBRE LAS PLACAS VIEJAS, y es el más útil de esta carga. Entre las fotos de ML había
-- una **placa de medidas** (`c2-marron/04` y `c4-carey/04` son la misma imagen) que declaraba
-- **138 / 54 x 48 / 19 / 145**. No se usó, por la regla dura 7. Contrastada contra lo que midió el
-- founder, el patrón es nítido: **acertó calibre, puente y varilla (54-19-145) — los tres números
-- que vienen IMPRESOS en la varilla del armazón — y erró las DOS que hay que medir de verdad**
-- (alto 48 vs 53, ancho 138 vs 143). Esa es la explicación mecánica de por qué esas placas vienen
-- errando desde el Malice: se copian del grabado y el resto se completa a ojo.
-- 🔻 CORRECCIÓN A UN ARGUMENTO QUE SE USÓ MAL AL DETECTARLA: se dijo que la placa era sospechosa
-- porque **"está dibujada sobre un wayfarer con remaches"**. Eso NO es evidencia de nada: al generar
-- la placa propia de este producto con `pnpm placas --solo 4` se vio que **la plantilla del proyecto
-- (`marketing/medidas.png`) usa exactamente la misma silueta wayfarer genérica**, para los 100+
-- productos del catálogo. Es un esquema, no un retrato. Lo único que descalificaba a la placa vieja
-- eran los NÚMEROS, y eso se comprobó recién cuando el founder midió.
--
-- 🔩 BISAGRAS PLÁSTICAS SIN SISTEMA FLEX — dato del founder. Se dice tal cual y es la única mención
-- de bisagra. **Ningún claim de flex disponible en este modelo**, y de paso: G-Flex es el nombre del
-- material y NO autoriza a decir que el armazón sea flexible (regla del founder, corregida 2 veces;
-- barrido pendiente sobre 51 productos en BACKLOG.md).
--
-- 🏷️ SKU Y PESO DEL FABRICANTE, no hubo que pedírselos. A diferencia del Dunsert, **este modelo SÍ
-- está en rustyoptical.com** (`/collections/sunglasses/ss24/item/786-bad-card`):
-- C1 1035570 · C2 1035571 · C3 POL 1035572 · C4 1035573 · C5 POLARIZED 1035574 · C6 1035575,
-- **peso 25 g**, frente y patillas G-Flex. Evita inventar SKU de casa como en el Rew.
-- La ficha marca POL en **exactamente C3 y C5**, que coincide 1:1 con `WITH_POLARIZED_LENS=Sí` de la
-- publicación A → **dos fuentes independientes**. Regla dura 7: veta MEDIDAS, permite expresamente
-- peso/material/color/precio/stock de esa fuente (precedente Bruice 957005/957004).
-- ⚠️ La MISMA ficha dice en su blurb genérico *"LENTE: POLARIZADAS Y POLICARBONATO"* para todo el
-- modelo, contradiciendo su propia lista de colorways. **Es boilerplate y se descarta** — idéntica
-- trampa a la del Bruice, que el founder desmintió con el producto en la mano.
-- ⚖️ 25 g **no es notable**: empata con el Vulk 53&3 y el Guardian. Ranking de sol: Spell 12,6 ·
-- Biller 13 · Dearly 17,3 · Ardigan 17,3 · The Trial 19,5 · Le Groupie 20 · **53&3 25 = Guardian 25
-- = Bad Card 25** · Raven 26 · Day Light 26,1 · The Sil 28. **Ningún comparativo sin query** — es la
-- lección del Ardigan, donde estuvo a punto de publicarse "el más liviano" y era falso.
-- El Bad Card **NO** va a PESOS_A_MEDIR.md.
--
-- ⚠️ HONESTIDAD DOBLE, Y ES EL EJE DE LA FICHA: 2 de 6 POLARIZADAS y 4 de 6 CON ANTIRREFLEX.
-- Ninguna de las dos palabras va en title, H1, `name` ni `short_description` como atributo del
-- modelo. 2/6 = 33% (criterio Rew 1/2, Dunsert 1/3, Yeah 2/3, Bruice/Guardian 2/4); 4/6 ≈ 2/3, que
-- es el ratio con el que Yeah, Dieven y Bruk tampoco afirmaron. Las dos van CON NÚMERO a
-- meta_description, callout `warning`, descripción y alt.
-- **Lo que hace especial a esta ficha**: el corte antirreflex ↔ polarizado coincide EXACTO con el
-- corte de precio ($90.836 vs $104.885). Es el único producto del catálogo donde el comprador elige
-- entre dos tratamientos a dos precios, y podemos explicarle qué está pagando de más. Ninguno de los
-- 6 revendedores de la SERP lo cuenta: todos titulan "Polarizado" o "Gafas Antirreflejo" a secas, y
-- dos de ellos (masvision, originalseyes) publican **una URL por colorway**.
-- ⚠️ **NO se escribe "en la cara interna"**, a diferencia del Dunsert. Allá lo confirmó el founder;
-- acá el dato viene de `LENS_TREATMENT="ANTIREFLEX/PROTECCION UV400"`, un atributo de texto libre de
-- la publicación que **no dice dónde está la capa**. Se dice "antirreflex" y se explica qué hace un
-- AR en una lente de sol, sin afirmar la posición. Por eso el valor de variante es `["antirreflejo"]`
-- (precedente Katleen seed 52) y NO `["antirreflejo-interno"]` (Deserve 51 / CCCP 54 / Dunsert 103).
-- Se mantiene todo lo vetado en el Dunsert: nada de "elimina los reflejos" (reduce), "protege más de
-- los UV", **"reduce el reflejo del asfalto" aplicado al AR** (eso es el polarizado, y conflacionarlos
-- haría creer que las 4 no-pol hacen lo que hacen las 2 pol), "mejora la nitidez", "menos fatiga
-- visual", "antirrayas".
--
-- ⚠️ TRAMPA `\bPOL\b` — ESTA ES LA CARGA MÁS EXPUESTA HASTA AHORA. `isPolarizedVariant`
-- (`lib/catalog/polarized.ts:24`) matchea `\bPOL\b` sobre `model_code`, y acá los codes son **C1…C6,
-- sin "POL"**. O sea que **el flag explícito es el ÚNICO mecanismo**: sin `"polarized": true` en C3 y
-- C5 el producto desaparece EN SILENCIO de `/anteojos-de-sol/polarizados`. Va explícito en las 6.
-- Consecuencia verificada en código: entra a `/anteojos-de-sol/polarizados` (criterio por VARIANTE;
-- C3 y C5 tienen stock → la card sale CON stock y a $104.885, no a $90.836) y **NO** a
-- `/anteojos-de-sol/rusty/polarizados` (criterio por PRODUCTO contra `lens_treatment`, que queda en
-- `["uv400"]`). Por eso la ficha NO linkea a esa segunda faceta.
--
-- 🎨 DOS ERRORES DE COLOR EN LAS PUBLICACIONES DEL FOUNDER, detectados abriendo las 12 fotos y
-- comparándolas entre sí (el chequeo que salió del MISTAKES del Dunsert):
--   • **C6**: ML declara `LENS_COLOR = "Degradé Marrón"`. La lente es un **gris degradé que vira a
--     celeste abajo**, sin nada de marrón. Se carga `gris-degrade`. Misma clase que el terracota del
--     Cinema, donde ML decía "verde musgo" y medía gris neutro.
--   • **C1**: ML lo llama "Azul Metálico" y es un **azul humo translúcido**, no un metalizado. Se
--     mantiene `azul-metalico` porque la etiqueta ya existe y es la que él usa en ML, pero la
--     descripción dice "azul humo translúcido", que es lo que se ve.
-- Anotados en DATOS_PENDIENTES.md para que los corrija en ML. No se tocan sus publicaciones desde acá.
--
-- 📸 FOTOS: las galerías de ML tenían basura mezclada y hubo que hacer triage —
-- **una placa de medidas** (arriba) y **placas amarillas viejas con burbujas de texto**
-- ("LENTES CON ANTIRREFLEX", "UV400", "ARMAZÓN AZUL METÁLICO"). El amarillo es heredado, no es la
-- marca (azul marino + blanco). Ninguna va a la galería, pero la del C1 sirvió como **segunda fuente
-- independiente** que confirma el antirreflex. Se usaron `01` (perfil 3/4) y `02` (frente) de cada
-- colorway, normalizadas con `pnpm placas --solo 1,2` a 2000×1333 con el anteojo al 92%.
-- ✅ **Se abrieron las 12 y se compararon ENTRE SÍ**: la convención 01=perfil / 02=frente se cumple
-- en los 6, sin la inversión que hubo en el Dunsert (y antes en Blozon y Cinema).
--
-- SEO — BRANDED, SIN CARRIL DE FORMA. Es el **7º aviador Rusty de sol** (Vrast, Tulle, Gresent,
-- The Take, Yeah, Bruice — verificado en la base, NO 4 como estimó el agente) y los dos carriles
-- están tomados: `lentes de sol aviador` (170/12) es de The Take y `anteojos de sol aviador`
-- (110/10) del Yeah. El Bruice ya tuvo que caer a branded exactamente por esto.
-- Primaria `anteojos de sol rusty bad card` (0 medido, dif 4) — existe en los DOS CSV de Rusty de
-- `KEYWORDS OPTICA/` (suggestions 126, related 239); la variante "lentes" no existe en ninguno, y
-- eso decide que el title arranque con "Anteojos".
-- **"Doble puente" NO tiene volumen — medido, no supuesto**: barrido de los 6 CSV, sólo aparecen
-- `lentes de sol sin puente` (0/4) y `armazones con puente anatomico` (0/4). Es descriptor físico,
-- no carril, y por eso **no hay colisión real con el Bruice** aunque los dos lo lleven en el title:
-- ninguno lo targetea y no existe query que devuelva a los dos. Los separa el branded.
-- Descartados con número: `lentes de sol rectangulares` (320/12, del Rew) y `anteojos de sol
-- rectangulares` (140/12, de la faceta) — además ahora ni siquiera aplican, no es rectangular;
-- `lentes de sol antireflex` (70/35) y `anteojos de sol antireflex` (40/36), mismo perfil descartado
-- que `lentes de sol naranjas` (50/36), y el volumen real de antirreflex vive en receta
-- (`anteojos antireflex` 720/10) = mismatch de intención; `lentes de sol polarizados y antireflejo`
-- (90/12) es TRAMPA y acá más que en el Dunsert porque **el split es inverso y ninguna de las 6
-- cumple las dos cosas**; color (ninguno llega a mayoría en 6 colorways); `anteojos de sol negros`
-- (110/14) es del Guardian y acá negro es 2/6.
-- **Género `unisex`**: ML declara "Sin género" en la publicación propia del founder, y el C3 rosa es
-- 1 de 6 (17%), muy por debajo de cualquier umbral. Verificado en `lib/catalog/queries.ts` que
-- unisex es estrictamente dominante: entra a las 4 facetas de género.
--
-- ✍️ La meta_description salió en **165 caracteres** en el primer intento y se recortó a **157**
-- sacando ", G-Flex" (el material ya está en el title del bloque de atributos y en la descripción).
-- Lo detectó la query de control post-carga, no una revisión a ojo: `length(meta_description)` va
-- en el control de todas las cargas justamente porque pasarse de 160 no rompe nada y no se ve.
--
-- `is_featured` NO: 33 unidades suenan bien pero **C4 y C6 tienen 3 cada una**; si el hero le mete
-- tráfico, esas dos se van a cero en días y muestra un producto con un tercio de las opciones sin
-- stock. Y el flag **no vence solo** como `new_until`. El hero lo levanta igual por `updated_at desc`.
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-bad-card', 'Rusty Bad Card',
  'Anteojos de sol Rusty Bad Card: aviador de doble puente unisex, con frente y patillas de G-Flex y bisagras plásticas. Pesan 25 g. De los 6 colores, 2 polarizan y los otros 4 llevan antirreflex.',
  E'Los **Rusty Bad Card** son **anteojos de sol estilo aviador de doble puente**, unisex, con frente y patillas de **G-Flex**. Las bisagras son de plástico, sin sistema flex. Pesan **25 g**.\n\nLa lente es de **policarbonato**, con **100% de protección UV (UV400) y categoría 3** en los seis colores.\n\nMedidas: frente 143 mm · lente 54 mm de ancho · alto total 53 mm · puente 19 mm · varilla 145 mm.\n\n**Este modelo se divide en dos, y la diferencia de precio es exactamente esa.**\n\n**Cuatro colores con antirreflex**, los más económicos:\n\n• **Marrón transparente**, lente gris degradé.\n• **Azul humo translúcido**, lente gris degradé.\n• **Carey**, lente gris degradé.\n• **Negro brillo**, lente gris degradé.\n\n**Dos colores polarizados**, los más caros:\n\n• **Rosa oscuro**, lente marrón.\n• **Negro mate**, lente gris oscuro.\n\n**No hay ninguno que traiga las dos cosas**, así que conviene saber qué hace cada una. El **polarizado** trabaja sobre la luz que tenés adelante: corta el reflejo del asfalto, el agua y la nieve. El **antirreflex** trabaja sobre la que te llega desde atrás o de costado y rebota en el cristal de vuelta hacia el ojo; lo reduce, no lo elimina, y se nota sobre todo con el sol bajo a tus espaldas.\n\nSi manejás mucho de día o vas seguido a la playa, el polarizado es el que resuelve tu problema. Si no, los cuatro con antirreflex te dan el mismo armazón, la misma protección UV y más para elegir de color, por unos $14.000 menos.\n\nLos seis filtran el 100% de la radiación UV: eso no cambia entre versiones.\n\nEl doble puente es la barra extra que cruza por arriba, entre las dos lentes. Es el rasgo que le da el aire de aviador clásico, y en el catálogo lo comparte con el Rusty Bruice, el Yeah y el The Take.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "aviador",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "weight_grams": 25,
    "measurements": {"frame_width_mm": 143, "lens_width_mm": 54, "lens_height_mm": 53, "bridge_mm": 19, "temple_length_mm": 145},
    "hinge_system": "plastica",
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-09-28",
    "callouts": [
      {"type": "info", "position": "top", "title": "Aviador de doble puente unisex, 25 g", "body": "Frente y patillas de G-Flex, con bisagras plásticas sin sistema flex. El doble puente es la barra que cruza por arriba entre las dos lentes: es lo que le da el aire de aviador clásico."},
      {"type": "warning", "position": "middle", "title": "O polarizado o antirreflex: ninguno trae los dos", "body": "Los dos colores polarizados (rosa oscuro y negro mate) no llevan antirreflex, y los cuatro con antirreflex no polarizan. Cortan cosas distintas: el polarizado, el reflejo del asfalto y del agua que tenés adelante; el antirreflex, el que te vuelve al ojo desde atrás. Ahí está la diferencia de precio. Los seis filtran el 100% de la radiación UV."},
      {"type": "recommendation", "position": "bottom", "title": "Policarbonato UV400 categoría 3", "body": "Lente de policarbonato con 100% de protección UVA y UVB, categoría 3, pensada para sol fuerte. Categoría 3 no sirve para manejar de noche. Si dudás entre el polarizado y el antirreflex, escribinos por WhatsApp y te asesoramos según en qué lo vayas a usar."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1470709119", "MLA2498615612"], "imported_at": "2026-08-29"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Rusty Bad Card Doble Puente | Carballo',
  'Anteojos de sol Rusty Bad Card: aviador de doble puente, 25 g. Dos de los seis colores polarizan y los otros cuatro llevan antirreflex. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- ⚠️ `mercadolibre_variation_code` CON EL ID NUMÉRICO en las 6 (items multi-variación).
-- Un NULL acá es un SKIP SILENCIOSO que congela stock y precio — ver la cabecera.
-- Orden: las 4 del mismo precio primero y juntas, después las 2 polarizadas, para que el salto de
-- precio se lea como UNA decisión y no como cuatro saltos al azar (criterio del Dunsert seed 103).
-- sort 1 = C2, que tiene 11 de las 33 unidades (criterio de stock del Ardigan) y deja el header en
-- "Desde $90.836", coherente con el `lowPrice` del AggregateOffer.
-- `"polarized"` EXPLÍCITO en las 6: los `model_code` son C1..C6 sin "POL", así que el regex
-- `\bPOL\b` de `isPolarizedVariant` no puede salvar un flag faltante.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), '1035571',
   '{"frame_color":"marron-transparente","lens_color":"gris-degrade","model_code":"C2","polarized":false,"lens_treatment":["antirreflejo"]}'::jsonb,
   9083600, 11, true, 1, 'MLA2498615612', '192307652495'),
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), '1035570',
   '{"frame_color":"azul-metalico","lens_color":"gris-degrade","model_code":"C1","polarized":false,"lens_treatment":["antirreflejo"]}'::jsonb,
   9083600, 5, true, 2, 'MLA2498615612', '192307652497'),
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), '1035573',
   '{"frame_color":"carey","lens_color":"gris-degrade","model_code":"C4","polarized":false,"lens_treatment":["antirreflejo"]}'::jsonb,
   9083600, 3, true, 3, 'MLA2498615612', '192307652499'),
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), '1035575',
   '{"frame_color":"negro-brillo","lens_color":"gris-degrade","model_code":"C6","polarized":false,"lens_treatment":["antirreflejo"]}'::jsonb,
   9083600, 3, true, 4, 'MLA2498615612', '192307652501'),
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), '1035572',
   '{"frame_color":"rosa-oscuro","lens_color":"marron","model_code":"C3","polarized":true}'::jsonb,
   10488500, 6, true, 5, 'MLA1470709119', '182731106070'),
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), '1035574',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"C5","polarized":true}'::jsonb,
   10488500, 5, true, 6, 'MLA1470709119', '189766967733')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 13 imágenes: perfil + frente de cada colorway, más `medidas.jpg` (variant_id NULL, sort 99).
-- "polarizada" SÓLO en los alt de C3 y C5; "antirreflex" SÓLO en los de C1, C2, C4 y C6.
-- El alt de medidas respeta el formato que parsea `scripts/ml-auditar-medidas.ts`.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), (SELECT id FROM public.product_variants WHERE sku='1035571'),
   'rusty-bad-card/perfil-c2.jpg', 'Anteojos de sol Rusty Bad Card aviador de doble puente unisex vista lateral, armazón marrón transparente con lente gris degradé y antirreflex', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), (SELECT id FROM public.product_variants WHERE sku='1035571'),
   'rusty-bad-card/frente-c2.jpg', 'Anteojos de sol Rusty Bad Card aviador de doble puente unisex vista frontal, armazón marrón transparente con lente gris degradé y antirreflex', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), (SELECT id FROM public.product_variants WHERE sku='1035570'),
   'rusty-bad-card/perfil-c1.jpg', 'Anteojos de sol Rusty Bad Card aviador de doble puente unisex vista lateral, armazón azul humo translúcido con lente gris degradé y antirreflex', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), (SELECT id FROM public.product_variants WHERE sku='1035570'),
   'rusty-bad-card/frente-c1.jpg', 'Anteojos de sol Rusty Bad Card aviador de doble puente unisex vista frontal, armazón azul humo translúcido con lente gris degradé y antirreflex', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), (SELECT id FROM public.product_variants WHERE sku='1035573'),
   'rusty-bad-card/perfil-c4.jpg', 'Anteojos de sol Rusty Bad Card aviador de doble puente unisex vista lateral, armazón carey con lente gris degradé y antirreflex', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), (SELECT id FROM public.product_variants WHERE sku='1035573'),
   'rusty-bad-card/frente-c4.jpg', 'Anteojos de sol Rusty Bad Card aviador de doble puente unisex vista frontal, armazón carey con lente gris degradé y antirreflex', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), (SELECT id FROM public.product_variants WHERE sku='1035575'),
   'rusty-bad-card/perfil-c6.jpg', 'Anteojos de sol Rusty Bad Card aviador de doble puente unisex vista lateral, armazón negro brillo con lente gris degradé y antirreflex', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), (SELECT id FROM public.product_variants WHERE sku='1035575'),
   'rusty-bad-card/frente-c6.jpg', 'Anteojos de sol Rusty Bad Card aviador de doble puente unisex vista frontal, armazón negro brillo con lente gris degradé y antirreflex', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), (SELECT id FROM public.product_variants WHERE sku='1035572'),
   'rusty-bad-card/perfil-c3.jpg', 'Anteojos de sol Rusty Bad Card aviador de doble puente unisex vista lateral, armazón rosa oscuro con lente marrón polarizada', 2000, 1333, 8, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), (SELECT id FROM public.product_variants WHERE sku='1035572'),
   'rusty-bad-card/frente-c3.jpg', 'Anteojos de sol Rusty Bad Card aviador de doble puente unisex vista frontal, armazón rosa oscuro con lente marrón polarizada', 2000, 1333, 9, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), (SELECT id FROM public.product_variants WHERE sku='1035574'),
   'rusty-bad-card/perfil-c5.jpg', 'Anteojos de sol Rusty Bad Card aviador de doble puente unisex vista lateral, armazón negro mate con lente gris oscuro polarizada', 2000, 1333, 10, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), (SELECT id FROM public.product_variants WHERE sku='1035574'),
   'rusty-bad-card/frente-c5.jpg', 'Anteojos de sol Rusty Bad Card aviador de doble puente unisex vista frontal, armazón negro mate con lente gris oscuro polarizada', 2000, 1333, 11, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bad-card'), NULL,
   'rusty-bad-card/medidas.jpg', 'Esquema técnico de medidas Rusty Bad Card: frente 143mm, lente 54mm de ancho, alto total 53mm, puente 19mm, varilla 145mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
