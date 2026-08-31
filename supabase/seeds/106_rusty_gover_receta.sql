-- ============================================
-- Seed 106: Rusty Gover Optics (RECETA) — cuadrado unisex, G-Flex, bisagras flexo, 5 colores
-- Fecha: 2026-08-31
-- ============================================
-- Undécimo producto del cruce `pnpm ml:faltantes`.
--
-- 5 COLORWAYS, 17 UNIDADES, PRECIO UNIFORME $82.745,69, 6 ventas. Todo cuelga de UNA publicación
-- tradicional del founder, **MLA1388506289** (`catalog_listing: false`, health 0,90), MULTI-variación.
--   CRY    cristal transp. / patillas negras  5 u  var 183829439783  UP MLAU415613430  SKU 113104
--   MBLU   azul marino mate                   4 u  var 183829439785  UP MLAU415613432  SKU 113109
--   MBLK   negro mate                         4 u  var 179922407963  UP MLAU162369272  SKU 113106
--   L.GREY gris translúcido                   4 u  var 180348482155  UP MLAU162369298  SKU 113107
--   SBLK   negro brillo                       0 u  var 179922407965  UP MLAU161404381  SKU GOVER-SBLK
--
-- ⚠️ EL CRUCE DECÍA 8 COLORES / 30 UNIDADES. Existen 3 publicaciones de **CATÁLOGO**
-- (MLA1820631085, MLA1820631089, MLA3427756626) que cuelgan de los MISMOS `user_product_id` que las
-- variaciones MBLK, CRY y L.GREY: comparten el pozo, no aportan una sola unidad. **No se mapean.**
-- El founder fijó la regla el 2026-08-31: *"evita estas publicaciones catalog_listing: true - siempre
-- basate en las que yo cree"*. Este caso destapó además que `ml-faltantes.ts` dedupeaba por
-- `user_product_id` a nivel ITEM (null en un multi) y no de VARIACIÓN — arreglado el mismo día, y de
-- paso se remapearon 15 variantes de 12 productos que apuntaban a publicaciones de catálogo.
--
-- ⚠️⚠️ `mercadolibre_variation_code` VA CON EL ID NUMÉRICO (item multi-variación, patrón Ardigan/Bad
-- Card). Un NULL **no da error**: `sync-stock.ts:296-298` hace SKIP SILENCIOSO sin escribir en
-- `marketplace_sync_errors`, y la variante queda congelada en stock y precio para siempre.
--
-- 🚫 SIN BLOQUE DE MEDIDAS. El fabricante declara 53-18-143 y un revendedor 50-22-145 —se
-- contradicen— pero da igual: **la regla dura 7 dice que las medidas sólo las pasa el founder**, y
-- todavía no las pasó. La ficha va sin `measurements` y sin `medidas.jpg`. En DATOS_PENDIENTES.md.
--
-- 🏷️ SKU, PESO, MATERIAL Y BISAGRAS DEL FABRICANTE (`rustyoptical.com/optical/fw22/gover`), que la
-- regla dura 7 sí habilita (veta medidas, permite material/peso/color/precio/stock).
-- ⚠️ **El SBLK no figura en esa ficha**, así que lleva SKU de casa `GOVER-SBLK` (precedente Rew).
-- Una búsqueda sugirió 113105, pero venía de un agregador y **no se verificó** — no se inventa. Si
-- el founder confirma el real, se cambia con un UPDATE explícito, NUNCA re-corriendo el seed:
-- `ON CONFLICT (sku)` es la llave de idempotencia y un SKU distinto crearía fila nueva.
--
-- ⚖️ PESO 23 g, SIN NINGÚN ADJETIVO. Se escribe "Pesa 23 g" y punto.
-- ⚠️ **El Bruice receta pesa exactamente lo mismo y su ficha dice "de los más livianos del catálogo".
-- Es FALSO**: 23 g es el puesto 31 de 65, percentil 47 — mitad de tabla. No se copia esa frase.
-- La auditoría completa de superlativos de peso quedó en BACKLOG.md: **10 productos vivos** afirman
-- "ultraliviano" o "de los más livianos" estando en la mitad pesada, y el peor es el Rusty Dileri,
-- que a 31,8 g (puesto 59 de 65) lo dice **en el meta_title**.
--
-- 🚫 BLUE CUT: NO SE MENCIONA COMO ATRIBUTO. La ficha del fabricante dice "Lentes: Blue Cut" y el
-- campo tiene volumen real (`lentes con filtro azul` 320/11, `anteojos luz azul` 210/10), pero:
--   1. **El founder ya desmintió exactamente este claim** en el Bruice receta (seed 94:13-16): los
--      cristales que trae son de DEMOSTRACIÓN, sin graduación y sin filtro. Fabricante < founder.
--   2. Aunque el demo lo trajera, se descarta al montar la graduación → bait-and-switch, el mismo
--      patrón trampa del Dunsert y del Bruice.
-- Callout `warning` copiado del Bruice, que lo niega activamente en vez de omitirlo.
-- El filtro azul SÍ se ofrece como **tratamiento pago sobre el cristal graduado** en el callout de
-- cotización — que es lo que ya hacen 12 fichas de receta del catálogo. Son cosas distintas.
--
-- 🔩 EL FLEX ES DE LA BISAGRA, NUNCA DEL ARMAZÓN. El fabricante declara "sistema de bisagras flexo"
-- → `hinge_system: "flexo"`, mismo valor que el Yamain y el Guardian. **G-Flex es el nombre del
-- material y no autoriza a decir que el armazón sea flexible** (regla del founder, MISTAKES.md:1207
-- y :1014 — *"G-Flex es un nombre, no una propiedad"*).
-- ⚠️ `hinge_system` **NO se renderiza en ningún lado** (grep sin resultados en components/lib/app):
-- es dato muerto, así que **el único canal del claim es la prosa** — que es justo donde vive el
-- riesgo. Por eso la descripción dice "bisagras con sistema flexo" y nada más: **no** se promete que
-- "no se afloje" ni ningún beneficio de durabilidad, porque el fabricante no lo declara.
--
-- 🔺 FORMA `cuadrado`, resuelta con el método del Bad Card: se bajaron las primarias de productos ya
-- clasificados del propio catálogo y se compararon al lado. Contra el **Peating** (`cuadrado`,
-- esquinas filosas), el **Woxi** (`rectangular`, netamente más ancho que alto) y el **Patien**
-- (`wayfarer`, trapecio con el ángulo superior externo abierto), el Gover es un **cuadrado de
-- esquinas redondeadas**, proporción equilibrada, puente tipo llave y remaches metálicos. El título
-- de la publicación propia del founder también dice "Cuadrado". ⬜ Falta su confirmación final.
--
-- 📸 FOTOS — **2 de 5 colorways venían con perfil y frente INVERTIDOS** (MBLK y SBLK). Se detectó
-- abriendo las 10 y comparándolas entre sí, **antes** de generar las placas; en el Dunsert la misma
-- inversión se detectó recién después de subirlas. Corregido en origen.
-- ⚠️ **EL SBLK VA SIN FOTOS PROPIAS.** Sus dos imágenes se ven **mate, iguales a las del MBLK**,
-- cuando el SBLK es negro **brillo**. Se intentó leer el grabado de la varilla ampliándolo con sharp
-- y **no se lee a esa resolución — no se afirma nada sobre lo que dice**. Como además tiene 0
-- unidades, la variante se carga igual (el stock sincroniza solo) pero sin imágenes que no se pueden
-- verificar. Anotado para el founder.
--
-- SEO — BRANDED, SIN CARRIL DE FORMA NI DE COLOR.
-- Los cuatro carriles cuadrados de receta tienen dueño: `lentes cuadrados` (880/10) y `anteojos
-- cuadrados` (480/10) son del **Zinz**, `anteojos cuadrados hombre` (210/14) del **Spell**,
-- `anteojos/lentes cuadrados mujer` (320/18) de la **Katleen**. `lentes cuadrados hombre` (320/18)
-- está libre pero el Gover es unisex y no puede pelear género. Mismo desenlace que el Bruice.
-- ⚠️ El title **NO dice "Cuadrado"**: chocaría palabra por palabra con el del Zinz
-- (`Armazón de Receta Rusty Zinz Cuadrado | Óptica Carballo`), que es la clase de colisión ya
-- abierta en BACKLOG (Blinded↔Zion, The Sil↔Zinz). No sumamos una tercera.
-- Carril de color también cerrado: **2 de 5 son transparentes** (el CRY con patillas negras y el
-- L.GREY, que es transparente entero — verificado abriendo las fotos, no asumido). 40% no alcanza
-- según la escala del proyecto: la Vartis con 50% también fue rechazada, y los tres carriles
-- transparentes ya tienen dueño (Ready? head, Strewn mujer, PRO 30 hombre).
-- `anteojos recetados` (720/9) sí se usa en meta y primer párrafo: es el head de intención
-- compartido que el proyecto ya declaró como no-canibalización.
--
-- 💡 EL VALOR REAL DE ESTA CARGA NO ES LA PDP: **`/anteojos-de-receta/cuadrado` NO EXISTE**, y con el
-- Gover el grupo pasa a **10 productos** (y `/anteojos-de-receta/rusty/cuadrado` a 5). Verificado en
-- `lib/catalog/brand-filters.ts`: hay facetas de receta para wayfarer (¡con 2 productos!), cat-eye,
-- rectangular, aviador, acetato y metal, y ninguna para cuadrado (9, el grupo más grande) ni redondo
-- (6). BACKLOG.md:41-44 lo cuantifica en **2.530 búsquedas/mes** sin página que las consolide.
--
-- ⚠️ Dos links que los seeds vienen prescribiendo y son 404, verificado en el repo:
-- **`/marcas/rusty`** (`app/(storefront)/marcas/` sólo tiene `page.tsx`, no hay `[slug]`) y
-- **`/guias/anteojos-segun-forma-de-cara`** (`content/guias/` tiene sólo astigmatismo, miopía,
-- presbicia y como-leer-receta-anteojos). La única guía real para linkear acá es la última.
--
-- `is_featured` NO: la ficha está incompleta hasta que lleguen las medidas, no tiene keyword propia
-- que rankear, y hoy hay 1 destacado sobre 84 productos activos.
-- ============================================

BEGIN;

WITH
  rusty  AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-gover-receta', 'Rusty Gover Optics',
  'Armazón de receta Rusty Gover: cuadrado unisex de G-Flex, 23 g, con bisagras de sistema flexo. Viene con lentes de demostración, listo para que le pongas tu graduación.',
  E'El **Rusty Gover Optics** es un **armazón de receta cuadrado, unisex**, con frente y patillas de **G-Flex** y **bisagras con sistema flexo**. Pesa **23 g**.\n\nEl frente es un cuadrado de esquinas redondeadas, con puente tipo llave y remaches metálicos a los costados. Es una forma sobria, de las que funcionan tanto en una oficina como fuera de ella.\n\n**Los cristales que trae son de demostración.** No tienen graduación ni ningún filtro: son lentes de muestra para que veas cómo te queda el armazón. Los cristales de verdad se arman según tu receta, y ahí sí elegís los tratamientos que quieras. Acepta monofocales, bifocales, progresivos y multifocales.\n\nDisponible en 5 colores:\n\n• **Cristal transparente** con patillas negras.\n• **Gris translúcido**, transparente también en las patillas.\n• **Negro mate.**\n• **Azul marino mate.**\n• **Negro brillo.**\n\nLos dos translúcidos se apoyan menos sobre los rasgos que un armazón opaco: se ven, pero no toman protagonismo. El negro mate y el azul marino son los más sobrios.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante. El precio es del armazón; los cristales graduados se cotizan según tu receta.',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "cuadrado",
    "hinge_system": "flexo",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "unisex",
    "line": "urbana",
    "weight_grams": 23,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-09-30",
    "callouts": [
      {"type": "warning", "position": "top", "title": "Los cristales que trae son de demostración", "body": "No tienen graduación ni filtro de luz azul, aunque la ficha del fabricante lo mencione. Tampoco protección UV ni polarizado: eso es de los anteojos de sol, un armazón de receta no lo lleva. Son lentes de muestra para probar el armazón; los cristales definitivos se arman con tu receta."},
      {"type": "tip", "position": "middle", "title": "Cuadrado unisex de G-Flex, 23 g", "body": "Frente y patillas de G-Flex, con bisagras de sistema flexo declaradas por el fabricante. El frente es cuadrado de esquinas redondeadas, con puente tipo llave. Hay dos versiones translúcidas —cristal con patillas negras y gris entero— y tres opacas."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con una foto de tu receta. Te pasamos el costo de los cristales según tu graduación y los tratamientos que quieras (antirreflejo, filtro de luz azul, fotocromático). Armazón más cristales en 7 a 10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1388506289"], "imported_at": "2026-08-31"}
  }'::jsonb,
  true, false,
  'Armazón de Receta Rusty Gover Optics | Óptica Carballo',
  'Armazón de receta Rusty Gover: cuadrado unisex de G-Flex, 23 g y bisagras flexo. En negro mate, azul marino, gris translúcido y cristal. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Orden por stock. sort 1 = CRY, que tiene 5 de las 17 unidades y es el más distintivo del grid
-- (cristal con patillas negras). Sin `lens_color`: son lentes demo, no un color de producto.
-- `mercadolibre_variation_code` CON el ID numérico en las 5 — ver la cabecera.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-gover-receta'), '113104',
   '{"frame_color":"transparente-patillas-negras","model_code":"CRY-SBLK"}'::jsonb,
   8274569, 5, true, 1, 'MLA1388506289', '183829439783'),
  ((SELECT id FROM public.products WHERE slug='rusty-gover-receta'), '113109',
   '{"frame_color":"azul-mate","model_code":"MBLU"}'::jsonb,
   8274569, 4, true, 2, 'MLA1388506289', '183829439785'),
  ((SELECT id FROM public.products WHERE slug='rusty-gover-receta'), '113106',
   '{"frame_color":"negro-mate","model_code":"MBLK"}'::jsonb,
   8274569, 4, true, 3, 'MLA1388506289', '179922407963'),
  ((SELECT id FROM public.products WHERE slug='rusty-gover-receta'), '113107',
   '{"frame_color":"gris-transparente","model_code":"L.GREY"}'::jsonb,
   8274569, 4, true, 4, 'MLA1388506289', '180348482155'),
  ((SELECT id FROM public.products WHERE slug='rusty-gover-receta'), 'GOVER-SBLK',
   '{"frame_color":"negro-brillo","model_code":"SBLK"}'::jsonb,
   8274569, 0, true, 5, 'MLA1388506289', '179922407965')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 8 imágenes: perfil + frente de 4 colorways. **El SBLK no lleva imágenes** (ver cabecera).
-- Sin `medidas.jpg`: no hay medidas del founder todavía.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-gover-receta'), (SELECT id FROM public.product_variants WHERE sku='113104'),
   'rusty-gover/perfil-cry.jpg', 'Armazón de receta Rusty Gover cuadrado unisex vista lateral, cristal transparente con patillas negras y lentes de demostración', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-gover-receta'), (SELECT id FROM public.product_variants WHERE sku='113104'),
   'rusty-gover/frente-cry.jpg', 'Armazón de receta Rusty Gover cuadrado unisex vista frontal, cristal transparente con patillas negras y lentes de demostración', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-gover-receta'), (SELECT id FROM public.product_variants WHERE sku='113109'),
   'rusty-gover/perfil-mblu.jpg', 'Armazón de receta Rusty Gover cuadrado unisex vista lateral, azul marino mate con lentes de demostración', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-gover-receta'), (SELECT id FROM public.product_variants WHERE sku='113109'),
   'rusty-gover/frente-mblu.jpg', 'Armazón de receta Rusty Gover cuadrado unisex vista frontal, azul marino mate con lentes de demostración', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-gover-receta'), (SELECT id FROM public.product_variants WHERE sku='113106'),
   'rusty-gover/perfil-mblk.jpg', 'Armazón de receta Rusty Gover cuadrado unisex vista lateral, negro mate con lentes de demostración', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-gover-receta'), (SELECT id FROM public.product_variants WHERE sku='113106'),
   'rusty-gover/frente-mblk.jpg', 'Armazón de receta Rusty Gover cuadrado unisex vista frontal, negro mate con lentes de demostración', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-gover-receta'), (SELECT id FROM public.product_variants WHERE sku='113107'),
   'rusty-gover/perfil-lgrey.jpg', 'Armazón de receta Rusty Gover cuadrado unisex vista lateral, gris translúcido con lentes de demostración', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-gover-receta'), (SELECT id FROM public.product_variants WHERE sku='113107'),
   'rusty-gover/frente-lgrey.jpg', 'Armazón de receta Rusty Gover cuadrado unisex vista frontal, gris translúcido con lentes de demostración', 2000, 1333, 7, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
