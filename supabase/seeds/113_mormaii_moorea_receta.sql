-- ============================================
-- Seed 113: Mormaii Moorea RX — armazón de receta semi envolvente deportivo, hombre, 7 colorways
-- Fecha: 2026-09-22
-- ============================================
-- PRIMER PRODUCTO REAL DE LA MARCA MORMAII. La marca ya existía en `brands` (seed 01, seed 09 con
-- seo_intro/seo_outro) pero nunca había recibido un producto. Publicación de ML multivariación ya
-- viva y verificada: MLA1550157394, `catalog_listing:false` (tradicional, correcto mapearla).
--
-- 7 COLORWAYS, TODAS CON `mercadolibre_variation_code` NUMÉRICO (no NULL): `seller_custom_field`
-- es null en las 7, así que el ID numérico de cada variación es el único formato que matchea
-- (mismo patrón que Bad Card/Ardigan). Precio uniforme $111.030. 4 de 7 sin stock — se cargan
-- igual, regla "stock = siempre el de ML".
--   C01 negro brillo                          SKU "MOOREA RX 01 BR NE"             stock 2
--   C08 azul oscuro mate / celeste             SKU "MOOREA RX 08 MT AZ28/AZ28 CELE"  stock 1
--   C09 gris mate / naranja                    SKU "MOOREA RX 09 MT FUME NARNJA"     stock 1
--   C02 negro mate / gris translúcido           SKU "MOOREA RX 02 MT NE/NE FUM"       stock 0
--   C06 azul mate / turquesa                    SKU "MOOREA RX 06 MT AZ TR/AZ TR CELE" stock 0
--   C05 transparente / negro-blanco jaspeado     SKU "MOOREA RX 05 BR TR CR/TR CR NE"  stock 0
--   C04 gris a turquesa degradé                  SKU "MOOREA RX 04 BR FUM DG TURQ/FUM"  stock 0
-- SKUs largos con espacios y barras (tal como los pasó el founder) — verificado que `sku` es
-- `text UNIQUE` sin restricción de formato, no rompe nada.
--
-- 📸 FOTOS: el founder pasó primero un link de interoptica.com.ar (revendedor) con sólo la foto de
-- perfil de la mayoría de las colorways; al preguntarle por las 6 fotos de frente faltantes,
-- compartió el Dropbox OFICIAL del distribuidor (Interoptica Andina) con las 14 fotos (perfil +
-- frente × 7) en 5000×3300. Confirmadas visualmente contra la descripción del founder, coinciden
-- exactas. Placas generadas con `pnpm placas --tipo receta --sin-vision --solo 1,2,3,5,6`
-- (excluida a propósito la placa 04 de medidas — ver abajo por qué) y subidas con `pnpm fotos:subir`.
--
-- ⚠️⚠️ CORRECCIÓN DOBLE TRAS EL MENSAJE DEL FOUNDER CON MEDIDAS — LEER ANTES DE REUSAR ESTE PATRÓN.
-- Antes de que el founder mandara sus datos, esta ficha se había preparado con `frame_material:
-- grilamid`, `gender: unisex` y `frame_shape: rectangular`, inferidos de: (a) una placa de callouts
-- que el propio founder ya usaba en su publicación de ML ("ARMAZÓN DE GRILAMIDA"), (b) `GENDER=Sin
-- género` / `FILTRABLE_GENDER=Mujer,Hombre` de ML, y (c) `SHAPE=Rectangular` de ML + lectura visual.
-- Las TRES quedaron mal. El founder, con el armazón en la mano, corrigió:
--   • Material: **"Inyección"** (`frame_material: injected` — coincide con el propio `MATERIAL` de
--     ML, que ya lo decía; la placa de callouts vieja del founder resultó ser la fuente equivocada).
--   • Género: **hombre**, no unisex — "diseño semi envolvente deportivo masculino". Gana la palabra
--     del founder sobre el atributo genérico de ML (mismo criterio que el Harry).
--   • Forma: **envolvente** (semi), no rectangular puro — mismo mensaje del founder. Es el PRIMER
--     armazón de RECETA envolvente del catálogo (`lib/catalog/brand-filters.ts` tenía anotado
--     "no hay envolventes de receta"; deja de ser cierto con esta carga, sin que haga falta tocar
--     código — esa faceta ('deportivos') está limitada a `categories: ['sol']` así que simplemente
--     no genera una URL de receta todavía, no rompe nada).
-- **Lección**: ML pinta un cuadro plausible (rectangular, sin género) que tres fuentes sostenían
-- (ficha de ML + placa vieja del propio founder + lectura visual mía) y las tres estaban mal frente
-- a la palabra del founder con el producto físico. Ver LEARNINGS.md.
--
-- 📏 MEDIDAS — RECIBIDAS DEL FOUNDER 2026-09-22: 55-17-131, ancho total 139mm, alto total 43mm.
-- Geometría: 55×2 + 17 = 127 ≤ 139 ✓. Antes de que las pasara, había un grabado real en la propia
-- varilla del armazón (visible en la foto de perfil del C08: "RX Moorea Col.08 55 □17-131-□96") y
-- un diagrama de interoptica.com.ar que decían LO MISMO en calibre/puente/varilla (55-17-131) — se
-- descartaron igual, sin excepción, porque regla dura 7 no distingue "evidencia fuerte" de
-- "confirmación real": ninguna de las dos fuentes es una medición del founder. Una vez que la pasó,
-- confirma otra vez el patrón ya visto en Bad Card/Blozon/Zion — acertaba calibre/puente/varilla
-- (números grabados) y erraba los dos que hay que medir de verdad: el diagrama decía ancho 135
-- (real 139) y no declaraba alto (real 43). Sin `weight_grams`: el founder no lo pasó.
--
-- 🔩 BISAGRAS METÁLICAS CON FLEX, sistema "Visyfit" (nombre de marca del mecanismo, dato nuevo del
-- founder). `hinge_system: "flex"`, no "metalica" — mismo criterio que Vriviant (seed 109, mismo
-- día): "metálicas con sistema flex" es un flex CONFIRMADO, no sólo bisagra metálica sin dato.
--
-- 👓 COMPATIBILIDAD DE RECETA: el founder confirmó monofocal, bifocal y progresivo. Con una
-- advertencia real que también dio él mismo: en graduaciones positivas altas o con astigmatismo,
-- la curvatura del semi envolvente puede generar molestias. Texto del callout redactado con
-- `optical-expert` (trigger automático CLAUDE.md, afirmación técnica óptica) — explica el POR QUÉ
-- en una frase sin jerga, nombra el grupo de riesgo sin negar categóricamente el resto, invita a
-- consultar antes de comprar (tono asesor, no alarmista). Vetado explícito del agente: "defectuoso",
-- "incompatible", "va a causar" (mantener condicional), "riesgo para tu salud visual", "garantizamos".
--
-- 🎁 REGLA DE MARCA MORMAII (founder, "dejalo como regla" — aplica a TODOS sus productos, no sólo
-- este): estuche SEMI RÍGIDO (no el genérico blando), franela DE MORMAII (con marca, no genérica),
-- garantía 1 año del fabricante. Guardada en BRANDS.md para no repetir la pregunta.
-- ⚠️ HALLAZGO DE ARQUITECTURA (no se toca en este seed, fuera de scope): `attributes.includes` que
-- viene cargándose en TODOS los seeds del catálogo (`["estuche","franela"]`) **no lo lee ningún
-- componente** — `lib/business/product-includes.ts` renderiza SIEMPRE los 3 ítems fijos
-- (`DEFAULT_PRODUCT_INCLUDES`: estuche/franela/garantía genéricos) salvo que se use
-- `attributes.includes_override` para FILTRAR esos 3 (no para reemplazar el texto). O sea que el
-- detalle "semi rígido" / "de Mormaii" no puede reflejarse vía attributes hoy — se puso en la
-- `description` en texto libre, que sí es honesto y sí llega al cliente. Si se necesita el detalle
-- también en la sección de "incluye" de la UI, hace falta tocar `product-includes.ts` para que
-- soporte override de texto por marca — no es tarea de esta carga.
--
-- 🎯 SEO — `seo-strategist`: slug `mormaii-moorea-receta` (patrón `[marca]-[modelo]-receta`, mismo
-- criterio que Bruice). Cluster Mormaii NUEVO en SEO_STRATEGY.md (no existía ninguno): keywords head
-- de marca ("anteojos/lentes mormaii", 170-390/7) son HUB-ONLY, van a `/anteojos-de-receta/mormaii`
-- (seo_intro ya cargado, seed 09) y NO a esta PDP. `anteojos/lentes rectangulares` (480/15, 880/10)
-- ya las tiene el R-CY 02 de Rusty como primaria — Moorea, como Woxi/Invig/Dieven, las usa sólo de
-- secundaria en copy, nunca en title/H1. Sin carril de forma libre ni dato con volumen medible para
-- "envolvente"/"deportivo", la primaria queda BRANDED: `mormaii moorea`. H1 = `name` = `Mormaii
-- Moorea RX` (el "RX" es parte real de la denominación del fabricante, no keyword stuffing).
-- Hallazgo del agente: `/marcas/mormaii` no existe todavía en el código (no hay ruta dinámica
-- `[slug]` bajo `app/(storefront)/marcas/`) — sólo `/anteojos-de-receta/mormaii` funciona hoy. No es
-- tarea de esta carga, queda para BACKLOG.
--
-- `is_featured` NO: primer producto de una marca nueva, conviene ver primero cómo entra antes de
-- destacarlo.
-- ============================================

BEGIN;

WITH
  mormaii AS (SELECT id FROM public.brands WHERE slug = 'mormaii'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM mormaii), (SELECT id FROM receta), 'mormaii-moorea-receta', 'Mormaii Moorea RX',
  'Armazón de receta Mormaii Moorea: diseño semi envolvente deportivo para hombre, inyectado, con bisagras metálicas flex Visyfit. Incluye estuche semi rígido y franela de Mormaii.',
  E'El **Mormaii Moorea RX** es un **armazón de receta semi envolvente, de diseño deportivo para hombre**. Está inyectado en una sola pieza, con **bisagras metálicas de sistema flex "Visyfit"**.\n\n**Los cristales que trae son de demostración.** No tienen graduación, ni filtro de luz azul, ni protección UV, ni polarizado — son lentes de muestra para que veas cómo te queda el armazón. Los cristales de verdad se arman según tu receta: acepta monofocal, bifocal y progresivo.\n\nMedidas: lente 55 mm de ancho · puente 17 mm · varilla 131 mm · ancho total del frente 139 mm · alto total 43 mm.\n\nDisponible en 7 colores, del negro brillo más clásico a combinaciones con turquesa, celeste y naranja en las patillas.\n\nIncluye estuche semi rígido, franela de Mormaii y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "injected",
    "temple_material": "injected",
    "frame_shape": "envolvente",
    "hinge_system": "flex",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo"],
    "gender": "male",
    "line": "deportiva",
    "measurements": {"frame_width_mm": 139, "lens_width_mm": 55, "lens_height_mm": 43, "bridge_mm": 17, "temple_length_mm": 131},
    "includes": ["estuche-semi-rigido", "franela-mormaii"],
    "warranty_months": 12,
    "new_until": "2026-10-22",
    "callouts": [
      {"type": "info", "position": "top", "title": "Semi envolvente deportivo, bisagra Visyfit", "body": "Armazón inyectado de diseño semi envolvente pensado para hombre y uso deportivo. Las bisagras son metálicas, con sistema flex \"Visyfit\"."},
      {"type": "warning", "position": "middle", "title": "Ojo si tu receta es positiva o tiene astigmatismo", "body": "Este armazón tiene un diseño semi envolvente, con más curvatura que uno plano tradicional. En graduaciones positivas altas o con astigmatismo, esa curvatura extra puede generar algo de distorsión periférica o molestia al adaptarte, por el desajuste entre la curva del armazón y la curva ideal del cristal para tu receta. Antes de comprarlo, pasanos tu receta y lo revisamos juntos para confirmar que te va a quedar cómodo."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con una foto de tu receta. Te pasamos el costo de los cristales según tu graduación y los tratamientos que quieras (antirreflejo, fotocromático). Armazón más cristales en 7 a 10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1550157394"], "imported_at": "2026-09-22"}
  }'::jsonb,
  true, false,
  'Armazón de Receta Mormaii Moorea RX | Óptica Carballo',
  'Armazón de receta Mormaii Moorea: semi envolvente deportivo para hombre, inyectado, bisagras metálicas flex Visyfit. Envío a todo el país, garantía oficial 1 año.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Las 7 cuelgan del mismo MLA1550157394 (multi-variación); `mercadolibre_variation_code` con el ID
-- NUMÉRICO de cada una (seller_custom_field null en las 7 → el numérico es el único que matchea).
-- Orden: mayor stock primero (C01=2), después las 2 con 1 unidad, después las 4 en cero.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), 'MOOREA RX 01 BR NE',
   '{"frame_color":"negro-brillo","model_code":"C01"}'::jsonb,
   11103000, 2, true, 1, 'MLA1550157394', '179104005802'),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), 'MOOREA RX 08 MT AZ28/AZ28 CELE',
   '{"frame_color":"azul-oscuro-mate-y-celeste","model_code":"C08"}'::jsonb,
   11103000, 1, true, 2, 'MLA1550157394', '184935285745'),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), 'MOOREA RX 09 MT FUME NARNJA',
   '{"frame_color":"gris-mate-y-naranja","model_code":"C09"}'::jsonb,
   11103000, 1, true, 3, 'MLA1550157394', '199938599307'),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), 'MOOREA RX 02 MT NE/NE FUM',
   '{"frame_color":"negro-mate-y-gris-translucido","model_code":"C02"}'::jsonb,
   11103000, 0, true, 4, 'MLA1550157394', '184935285743'),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), 'MOOREA RX 06 MT AZ TR/AZ TR CELE',
   '{"frame_color":"azul-mate-y-turquesa","model_code":"C06"}'::jsonb,
   11103000, 0, true, 5, 'MLA1550157394', '179104005798'),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), 'MOOREA RX 05 BR TR CR/TR CR NE',
   '{"frame_color":"transparente-y-negro-blanco","model_code":"C05"}'::jsonb,
   11103000, 0, true, 6, 'MLA1550157394', '179104005800'),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), 'MOOREA RX 04 BR FUM DG TURQ/FUM',
   '{"frame_color":"gris-turquesa-degrade","model_code":"C04"}'::jsonb,
   11103000, 0, true, 7, 'MLA1550157394', '188146972677')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 14 imágenes (perfil+frente × 7). Primaria = perfil del C01 (mayor stock). SIN placa de medidas:
-- no había measurements confirmadas al momento de generar las placas (llegaron después) y no vale
-- la pena regenerar sólo por esa placa — se puede sumar en un seed de ajuste si el founder la pide.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), (SELECT id FROM public.product_variants WHERE sku='MOOREA RX 01 BR NE'),
   'mormaii-moorea-receta/perfil-c01.jpg', 'Armazón de receta Mormaii Moorea semi envolvente para hombre vista lateral, negro brillo', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), (SELECT id FROM public.product_variants WHERE sku='MOOREA RX 01 BR NE'),
   'mormaii-moorea-receta/frente-c01.jpg', 'Armazón de receta Mormaii Moorea semi envolvente para hombre vista frontal, negro brillo', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), (SELECT id FROM public.product_variants WHERE sku='MOOREA RX 08 MT AZ28/AZ28 CELE'),
   'mormaii-moorea-receta/perfil-c08.jpg', 'Armazón de receta Mormaii Moorea semi envolvente para hombre vista lateral, azul oscuro mate con patillas celeste', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), (SELECT id FROM public.product_variants WHERE sku='MOOREA RX 08 MT AZ28/AZ28 CELE'),
   'mormaii-moorea-receta/frente-c08.jpg', 'Armazón de receta Mormaii Moorea semi envolvente para hombre vista frontal, azul oscuro mate con patillas celeste', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), (SELECT id FROM public.product_variants WHERE sku='MOOREA RX 09 MT FUME NARNJA'),
   'mormaii-moorea-receta/perfil-c09.jpg', 'Armazón de receta Mormaii Moorea semi envolvente para hombre vista lateral, gris mate con patillas naranja', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), (SELECT id FROM public.product_variants WHERE sku='MOOREA RX 09 MT FUME NARNJA'),
   'mormaii-moorea-receta/frente-c09.jpg', 'Armazón de receta Mormaii Moorea semi envolvente para hombre vista frontal, gris mate con patillas naranja', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), (SELECT id FROM public.product_variants WHERE sku='MOOREA RX 02 MT NE/NE FUM'),
   'mormaii-moorea-receta/perfil-c02.jpg', 'Armazón de receta Mormaii Moorea semi envolvente para hombre vista lateral, negro mate con patillas gris translúcido', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), (SELECT id FROM public.product_variants WHERE sku='MOOREA RX 02 MT NE/NE FUM'),
   'mormaii-moorea-receta/frente-c02.jpg', 'Armazón de receta Mormaii Moorea semi envolvente para hombre vista frontal, negro mate con patillas gris translúcido', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), (SELECT id FROM public.product_variants WHERE sku='MOOREA RX 06 MT AZ TR/AZ TR CELE'),
   'mormaii-moorea-receta/perfil-c06.jpg', 'Armazón de receta Mormaii Moorea semi envolvente para hombre vista lateral, azul mate con patillas turquesa', 2000, 1333, 8, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), (SELECT id FROM public.product_variants WHERE sku='MOOREA RX 06 MT AZ TR/AZ TR CELE'),
   'mormaii-moorea-receta/frente-c06.jpg', 'Armazón de receta Mormaii Moorea semi envolvente para hombre vista frontal, azul mate con patillas turquesa', 2000, 1333, 9, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), (SELECT id FROM public.product_variants WHERE sku='MOOREA RX 05 BR TR CR/TR CR NE'),
   'mormaii-moorea-receta/perfil-c05.jpg', 'Armazón de receta Mormaii Moorea semi envolvente para hombre vista lateral, transparente con patillas negro y blanco jaspeado', 2000, 1333, 10, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), (SELECT id FROM public.product_variants WHERE sku='MOOREA RX 05 BR TR CR/TR CR NE'),
   'mormaii-moorea-receta/frente-c05.jpg', 'Armazón de receta Mormaii Moorea semi envolvente para hombre vista frontal, transparente con patillas negro y blanco jaspeado', 2000, 1333, 11, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), (SELECT id FROM public.product_variants WHERE sku='MOOREA RX 04 BR FUM DG TURQ/FUM'),
   'mormaii-moorea-receta/perfil-c04.jpg', 'Armazón de receta Mormaii Moorea semi envolvente para hombre vista lateral, gris a turquesa degradé', 2000, 1333, 12, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-moorea-receta'), (SELECT id FROM public.product_variants WHERE sku='MOOREA RX 04 BR FUM DG TURQ/FUM'),
   'mormaii-moorea-receta/frente-c04.jpg', 'Armazón de receta Mormaii Moorea semi envolvente para hombre vista frontal, gris a turquesa degradé', 2000, 1333, 13, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
