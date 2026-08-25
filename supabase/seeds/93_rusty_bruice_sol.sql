-- ============================================
-- Seed 93: Rusty Bruice SOL — aviador doble puente, G-Flex, lente naranja, NO polarizado
-- Fecha: 2026-08-25
-- ============================================
-- Anteojo de SOL aviador de doble puente, armazón G-Flex negro mate, lente naranja de
-- policarbonato. 23 g — el más liviano del cluster Rusty-sol (Yeah 32,9 g).
--
-- ⚠️ NINGUNA DE LAS DOS ES POLARIZADA, aunque el meta description de rustyoptical.com diga
-- "POLARIZADAS": ese texto es genérico del modelo. El founder lo desmintió con el producto en
-- la mano y lo confirma el propio catálogo del fabricante, que tiene colorways polarizadas
-- APARTE con su propio SKU (mblk-sg91-pol → 957005, steelblue-s10-pol → 957004). El founder
-- también tiene una publicación separada de Bruice polarizado en ML (MLA1897188728, pausada).
--   → lens_treatment SIN "polarized", polarized:false explícito, callout `warning` que lo aclara,
--     y la palabra "polarizado" NO aparece en title/H1/meta/alt.
--   De la MDEMI el founder dijo "mismo modelo, mismas medidas y propiedades", y su código
--   (HD-GG47) no lleva el sufijo POL que sí llevan las polarizadas del Bruice. Dos señales que
--   coinciden. ⚠️ El callout warning quedó en PLURAL a propósito: cuando había una sola variante
--   decía "Esta variante no es polarizada", y con dos colorways ese singular hace inferir por
--   contraste que la otra SÍ polariza. No miente literalmente y genera igual la expectativa falsa
--   que prohíbe la regla dura #3 del negocio.
--
-- ⚠️ EL BLOQUE DE "TERAPIA DEL SUEÑO" NO SE CARGA. La descripción que pasó el founder decía que
-- la lente naranja "ayuda a bloquear la luz azul, promoviendo un descanso más reparador". No es
-- sólo que el claim sea clínico: la lente es CATEGORÍA 3, o sea que transmite entre 8% y 18% de
-- la luz visible. El uso del que habla la evidencia de blue-blocking vespertino (de noche, en
-- interior, antes de dormir) requiere lente clara o categoría 0-1. El producto no es el
-- dispositivo del que habla la evidencia. El ángulo se recupera en la guía planificada
-- /guias/filtro-luz-azul-evidencia-real, no en la ficha. Ver CLAUDE.md regla 4 de negocio.
--
-- VARIANTES:
--   SKU 957006  MLA1904009956  var NULL  $84.354 → 8435400c  stock 2  negro mate / lente naranja
--   SKU 968190  sin item de ML          $84.354 → 8435400c  stock 3  carey mate con patillas
--                                        negras / lente verde degradé (MDEMI HD-GG47)
--   La MDEMI se agregó el 2026-08-25. NO tiene publicación propia en ML: los dos campos de
--   marketplace quedan en NULL. PROHIBIDO ponerle ('MLA1904009956', NULL) para "aprovechar" el
--   item de la otra: la constraint UNIQUE no lo bloquea (Postgres trata los NULL como distintos)
--   pero syncStockInbound busca la variante con variation_code NULL y agarra una sola — el stock
--   de ML terminaría aplicado a la variante equivocada, en silencio y sin error.
--   El link que pasó el founder (MLAU948680760) es de CATÁLOGO, no de item: /items/{id} da 404
--   con un MLAU. El item propio es MLA1904009956 (activo, 60 vendidos).
--   Si mañana entra otra colorway (hay 5 más en el catálogo del fabricante), va como VARIANTE de
--   esta misma URL, no como producto nuevo — por eso el slug no lleva el color.
--
-- frame_shape="aviador" (español, = Yeah/The Take/Gresent). ⚠️ La publicación de ML declara
-- FRAME_SHAPE="Anteojo Cuadrado"; se usa "aviador" porque es lo que indicó el founder y porque
-- es la misma forma que Yeah y The Take, que ya están cargados así. Si se cambia el criterio,
-- hay que cambiarlos a los tres juntos o la faceta queda inconsistente.
-- temple_material NO se carga: el founder confirmó G-Flex para el armazón, no dijo nada de las
-- patillas y ML sólo declara FRAME_MATERIAL. Mejor vacío que inventado.
--
-- ⚠️ CORRECCIÓN 2026-08-25, mismo día de la carga: el puente es 18, no 16. Se cargó 16 porque es
-- lo que dijo el founder de entrada; después apareció que su publicación de ML declaraba
-- BRIDGE_LENGTH=1.8 cm y su placa vieja decía 18. Al revisar, el founder confirmó 18: el grabado
-- del armazón estaba gastado y el 8 le pareció un 6. O sea que acá NO aplicó la regla habitual de
-- "la medición del founder gana contra la ficha del fabricante", porque los dos números venían de
-- él. Cuando dos fuentes del founder se contradicen, hay que mostrarle las dos y que desempate.
-- La placa de medidas se regeneró y se subió como `medidas-18mm.jpg` (nombre nuevo obligatorio:
-- la imagen optimizada de Next se cachea 31 días por path).
--
-- Medidas (medidas a mano por el founder sobre el armazón, no de la ficha del fabricante):
-- frente 146 / lente 56x54 / puente 18 / varilla 140 mm. Geometría: 56×2+18 = 130 ≤ 146. ✓
-- gender: unisex — sale de la propia publicación del founder (GENDER="Sin género" en ML).
-- Precio: igual al de ML al momento de la carga, que es la convención del catálogo
-- (verificado contra Yeah, PRO 30, Ready y Strewn, que coinciden exactos).
--
-- SEO (seo-strategist, contra SEO_STRATEGY.md 279-566 + CSV de KEYWORDS OPTICA/):
-- primaria `anteojos de sol rusty bruice` (branded, dif 4). NO toma `lentes de sol aviador`
-- (170/12, carril de The Take) ni `anteojos de sol aviador` (110/10, carril de Yeah): Bruice es
-- el TERCER aviador de Rusty-sol y el carril de forma ya está tomado dos veces. El carril de
-- color (`lentes de sol naranjas` 50/36) tiene difficulty prohibitiva para nuestra DA → va en
-- copy y alt, no en title. `anteojos de sol rusty bruice polarizado` aparece en Ubersuggest pero
-- es TRAMPA: hay demanda y esta variante no polariza. Perseguirla sería bait-and-switch.
-- El valor SEO real de cargar Bruice no es la ficha: es que /anteojos-de-sol/aviador pasa a 4
-- productos y /anteojos-de-sol/rusty/aviador a 3, que es lo que hace creíble esa faceta.
--
-- Internal linking: /anteojos-de-sol/rusty, /anteojos-de-sol/aviador, /anteojos-de-sol/rusty/aviador,
-- /marcas/rusty. NO /anteojos-de-sol/polarizados ni /acetato ni /metal (g-flex no es ninguno de
-- los dos) — los tres se excluyen solos por atributos, no hay que hacer nada.
-- Related esperados: rusty-the-take, rusty-yeah, rusty-terdey, rusty-zinz.
--
-- 📸 FOTOS: bucket products/rusty-bruice/ — 3 archivos generados con `pnpm placas` y subidos con
-- `pnpm fotos:subir`, los tres 2000×1333 y verificados HTTP 200 antes de escribir este seed.
-- Grid primary = PERFIL (regla del founder). medidas.jpg con variant_id NULL y sort 99.
-- El alt_text de medidas respeta el formato que parsea scripts/ml-auditar-medidas.ts
-- (frente → lente AxB → puente → varilla, enteros, "mm" pegado): si se cambia, ese modelo deja
-- de poder auditarse contra las publicaciones de ML.
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-bruice', 'Rusty Bruice',
  'Anteojos de sol Rusty Bruice: aviador de doble puente unisex, armazón G-Flex de 23 g y lente de policarbonato con 100% protección UV (UV400, categoría 3). Disponible en 2 colores, ninguno polarizado.',
  E'Los **Rusty Bruice** son **anteojos de sol aviador de doble puente, unisex**, con armazón **G-Flex** y **bisagras metálicas con sistema flex**. Pesan **23 g**, lo que los vuelve de los más livianos del catálogo.\n\nLa **lente es de policarbonato**, con **100% protección UV (UV400) y categoría 3**.\n\nMedidas: frente 146 mm · lente 56 mm de ancho × 54 mm de alto · puente 18 mm · varilla 140 mm.\n\nDisponible en 2 colores:\n\n• **Negro mate, lente naranja.** El tinte naranja levanta el contraste percibido cuando la luz está plana o hay neblina.\n• **Carey mate con patillas negras, lente verde degradé.** El verde rinde más parejo en color, y el degradé va de más oscuro arriba a más claro abajo.\n\n**Ninguno de los dos es polarizado.** Filtran el 100% de la radiación UV igual que cualquier lente nuestra, pero no cortan los reflejos del asfalto ni del agua. Si buscás polarizado, escribinos y te decimos qué modelos tenemos.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "aviador",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "weight_grams": 23,
    "measurements": {"frame_width_mm": 146, "lens_width_mm": 56, "lens_height_mm": 54, "bridge_mm": 18, "temple_length_mm": 140},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-09-25",
    "callouts": [
      {"type": "info", "position": "top", "title": "Dos tintes, dos usos", "body": "El naranja atenúa más las longitudes de onda cortas y levanta el contraste percibido con luz plana o neblina. El verde rinde más parejo en color, y el degradé va de más oscuro arriba a más claro abajo. Los dos son categoría 3."},
      {"type": "warning", "position": "middle", "title": "Ninguno de los dos colores es polarizado", "body": "Ni el negro mate con lente naranja ni el carey con lente verde degradé llevan filtro polarizado. Filtran el 100% de la radiación UV igual, pero no cortan los reflejos del asfalto ni del agua. Si buscás polarizado, escribinos."},
      {"type": "tip", "position": "bottom", "title": "Armazón G-Flex de 23 gramos", "body": "G-Flex es el material del armazón, no una promesa de que se doble: como todo anteojo, conviene sacárselo con las dos manos y guardarlo en el estuche."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1904009956"], "imported_at": "2026-08-25"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Rusty Bruice Aviador Doble Puente | Carballo',
  'Anteojos de sol Rusty Bruice: aviador de doble puente en 2 colores, lente de policarbonato UV400 cat. 3 y armazón G-Flex de 23 g. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- La MBLK/ORANGE mapea a un item SIMPLE de ML (0 variaciones) → variation_code NULL.
-- La MDEMI no tiene item propio → los dos campos de marketplace en NULL (ver cabecera).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-bruice'), '957006',
   '{"frame_color":"negro-mate","lens_color":"naranja","model_code":"MBLK/ORANGE","polarized":false}'::jsonb,
   8435400, 2, true, 1, 'MLA1904009956', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-bruice'), '968190',
   '{"frame_color":"carey-mate-y-negro-mate","lens_color":"verde-degrade","model_code":"MDEMI HD-GG47","polarized":false}'::jsonb,
   8435400, 3, true, 2, NULL, NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = perfil de la MBLK (regla del founder: la primaria del grid es el perfil).
-- Cada colorway con sus dos fotos propias: si una variante no tiene fotos, la galería cae al pool
-- global y le muestra al comprador un color que no es el que compra.
-- La placa de medidas es UNA SOLA para las dos, porque las medidas son idénticas: va con
-- variant_id NULL y sort 99 (si tuviera un sort intermedio aparecería primera en la galería de la
-- variante). Su alt_text tiene formato fijo, lo parsea scripts/ml-auditar-medidas.ts.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-bruice'), (SELECT id FROM public.product_variants WHERE sku='957006'),
   'rusty-bruice/perfil.jpg', 'Anteojos de sol Rusty Bruice aviador doble puente unisex vista lateral, armazón negro mate lente naranja', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-bruice'), (SELECT id FROM public.product_variants WHERE sku='957006'),
   'rusty-bruice/frente.jpg', 'Anteojos de sol Rusty Bruice aviador doble puente unisex vista frontal, armazón negro mate lente naranja', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bruice'), (SELECT id FROM public.product_variants WHERE sku='968190'),
   'rusty-bruice/perfil-mdemi.jpg', 'Anteojos de sol Rusty Bruice aviador doble puente unisex vista lateral, armazón carey mate con patillas negras lente verde degradé', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bruice'), (SELECT id FROM public.product_variants WHERE sku='968190'),
   'rusty-bruice/frente-mdemi.jpg', 'Anteojos de sol Rusty Bruice aviador doble puente unisex vista frontal, armazón carey mate con patillas negras lente verde degradé', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bruice'), NULL,
   'rusty-bruice/medidas-18mm.jpg', 'Esquema técnico de medidas Rusty Bruice: frente 146mm, lente 56x54mm, puente 18mm, varilla 140mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
