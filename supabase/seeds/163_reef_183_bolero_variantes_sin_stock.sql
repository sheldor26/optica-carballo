-- ============================================
-- Seed 163: Reef 183 Bolero, 4 variantes POLARIZADAS hoy SIN STOCK (van a reingresar), por pedido del founder (2026-10-06): C07, C09, C08 y C10
-- Fecha: 2026-10-06
-- ============================================
-- Se suman al producto `reef-183-bolero` (seed 162, que sólo tenía la C11 espejada). Publicaciones TRADICIONALES de ML (`catalog_listing:false`, items simples, `variation_code` NULL), pausadas por falta de stock, verificadas por API el 2026-10-06 ($145.290 las 4, stock 0):
--   C07 MLA1946522130 (negro brillo, lente gris oscuro, GTIN 7790394171235) · C09 MLA1382261781 (negro mate con banda naranja, lente gris oscuro, GTIN 7790394251807)
--   C08 MLA1961776752 (marrón translúcido, lente marrón, GTIN 7790394171242) · C10 MLA1592376801 (gris oscuro translúcido con banda verde, lente gris oscuro, GTIN 7790394251814)
-- Los links que pasó el founder llevan `pdp_filters=item_id:MLA1491431981 / MLA1491550011`: son items de catálogo (403 por API, no son nuestros); se usan las tradicionales de los mismos User Products.
-- `polarized:true` en las 4; NO se afirma antirreflejo (ML no da el dato; el founder sólo lo confirmó para la C11). Stock 0 y precio de ML (se sincronizan solos cuando ingrese stock).
-- 📷 FOTOS: de la marca (reefeyewear.com ids 3797=C07, 3799=C09, 3798=C08, 3800=C10; el modelo dado de baja sigue vivo por URL de imagen, hallado con un barrido por silueta). Perfil de la marca al 92% del ancho.
-- 🎯 SEO (seo-strategist): title y meta del seed 162 se MANTIENEN mientras la C11 espejada sea la única con stock; cuando vuelva el stock de una polarizada (o se agote la C11) cambiar a `Reef 183 Bolero | Lentes de Sol UV400 y Categoría 3`.
--   La description se reescribe en el párrafo "según la versión" (sin cantidades). Sin "polarizado" en title/H1/short/meta.
-- ============================================

BEGIN;

UPDATE public.products SET
  short_description = 'Lentes de sol espejados Reef 183 Bolero: cuadrados, de estilo deportivo, para hombre. UV400, categoría 3 y bisagras metálicas.',
  description = E'Los **Reef 183 Bolero** son **lentes de sol para hombre, de armazón cuadrado y estilo deportivo**. El armazón es inyectado, con bisagras metálicas. Las lentes son de policarbonato, con **protección UV400**, que bloquea la radiación UVA y UVB hasta los 400 nm, y **categoría 3**. Según la versión, la lente es espejada azul o polarizada.\n\n**Polarizado según la versión.** El polarizado depende de la versión: la de lente espejado azul no es polarizada y las demás llevan lente polarizada; fijate en la ficha de cada una. El filtro polarizado reduce el deslumbramiento que producen superficies planas como el agua o el asfalto mojado, y puede hacer que algunas pantallas (celular, GPS, tablero del auto) se vean más oscuras o con manchas según el ángulo. El espejado es una capa reflectiva que se ve por fuera y reduce algo de luz; no es lo mismo que el polarizado. La versión espejada azul lleva antirreflejo en la cara interna, que reduce los reflejos de la luz que llega desde atrás o de costado y rebota en la lente hacia tus ojos. La protección UV la da el UV400, no el polarizado ni el espejado.\n\n**Categoría 3.** La categoría 3 indica cuánta luz filtra la lente: es el filtro habitual para sol intenso y se puede usar para manejar de día. No es para usar de noche, al atardecer ni en túneles o lugares con poca luz.\n\nMedidas: lente 60 mm de ancho · puente 17 mm · varilla 139 mm · ancho total 148 mm · alto 49 mm.\n\nPara limpiarlos usá el paño y un líquido para lentes, nunca en seco ni con la remera.\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi preferís un envolvente para el deporte, mirá los [Reef 177 Aerial](/anteojos-de-sol/reef/reef-177-aerial). Si querés un cuadrado de frente más ancho, mirá los [Reef 193 Tortuga](/anteojos-de-sol/reef/reef-193-tortuga), y si lo buscás unisex para todos los días, los [Reef 196 Reunión](/anteojos-de-sol/reef/reef-196-reunion).',
  attributes = jsonb_set(
    jsonb_set(attributes, '{callouts,1}', '{"type": "warning", "position": "middle", "title": "Polarizado según la versión", "body": "La versión de lente espejado azul no es polarizada; las demás sí. Todas tienen UV400 y categoría 3. Algunas versiones están sin stock hasta que reingresen."}'::jsonb),
    '{imported_from}', '{"marketplace": "mercadolibre", "item_ids": ["MLA4034472062", "MLA1946522130", "MLA1382261781", "MLA1961776752", "MLA1592376801"], "imported_at": "2026-10-06"}'::jsonb),
  updated_at = now()
WHERE slug = 'reef-183-bolero';

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-183-bolero'), 'REEF183-C07',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","polarized":true,"model_code":"C07","gtin":"7790394171235"}'::jsonb,
   14529000, 0, true, 2, 'MLA1946522130', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-183-bolero'), 'REEF183-C09',
   '{"frame_color":"negro-mate-detalle-naranja","lens_color":"gris-oscuro","polarized":true,"model_code":"C09","gtin":"7790394251807"}'::jsonb,
   14529000, 0, true, 3, 'MLA1382261781', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-183-bolero'), 'REEF183-C08',
   '{"frame_color":"marron-transparente","lens_color":"marron","polarized":true,"model_code":"C08","gtin":"7790394171242"}'::jsonb,
   14529000, 0, true, 4, 'MLA1961776752', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-183-bolero'), 'REEF183-C10',
   '{"frame_color":"gris-oscuro-transparente","lens_color":"gris-oscuro","polarized":true,"model_code":"C10","gtin":"7790394251814"}'::jsonb,
   14529000, 0, true, 5, 'MLA1592376801', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-183-bolero'), (SELECT id FROM public.product_variants WHERE sku='REEF183-C07'),
   'reef-183-bolero/perfil-c07-marca.jpg', 'Reef 183 Bolero C07 en negro brillo con lente polarizada, vista de perfil', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='reef-183-bolero'), (SELECT id FROM public.product_variants WHERE sku='REEF183-C09'),
   'reef-183-bolero/perfil-c09-marca.jpg', 'Reef 183 Bolero C09 en negro mate con detalle naranja y lente polarizada, vista de perfil', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='reef-183-bolero'), (SELECT id FROM public.product_variants WHERE sku='REEF183-C08'),
   'reef-183-bolero/perfil-c08-marca.jpg', 'Reef 183 Bolero C08 en marrón translúcido con lente polarizada, vista de perfil', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='reef-183-bolero'), (SELECT id FROM public.product_variants WHERE sku='REEF183-C10'),
   'reef-183-bolero/perfil-c10-marca.jpg', 'Reef 183 Bolero C10 en gris oscuro translúcido con lente polarizada, vista de perfil', 2000, 1333, 4, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
