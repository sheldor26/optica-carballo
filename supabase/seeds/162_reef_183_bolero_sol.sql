-- ============================================
-- Seed 162: Reef 183 Bolero SOL, séptimo producto de la marca Reef. Cuadrado de estilo deportivo, hombre, UV400 cat 3, bisagras metálicas sin flex. UNA sola versión con stock hoy: C11 lente espejado azul, NO polarizada, con antirreflejo interno
-- Fecha: 2026-10-06
-- ============================================
-- 1 variante en 1 publicación TRADICIONAL de ML (`catalog_listing:false`, item simple: `variation_code` NULL), verificada por API el 2026-10-06:
-- C11 MLA4034472062 (MLAU5414517052, $160.590, stock 3). Stock y precio mandan desde ML. Los otros colores del Bolero (007, 008, 009, 010; polarizados) están pausados con stock 0 en ML y NO se cargan.
--
-- DATOS CONFIRMADOS POR EL FOUNDER (2026-10-05/06): cuadrado deportivo, hombre, cat 3, UV400, bisagra metálica sin flex; medidas 60-17-139, ancho total 148, altura 49 (su mensaje decía "altura 148 / ancho 49": cruzados,
-- asumido ancho 148 y altura 49; Paesani publica "ancho 147, lente 60, alto 49"). C11 = espejado azul, con AR interno, sin polarizar. Altura cargada tal cual en lens_height_mm (regla del founder).
-- COLOR DEL ARMAZÓN: negro mate ("C11 - Negro Mate / Espejado Azul" en ML) => `frame_color:"negro-mate"`.
-- 📷 FOTO (corregida 2026-10-06): el founder pidió "la que subimos a ML" y yo había puesto la de Paesani (gris camuflado, otro armazón). La definitiva es la foto de su publicación de ML en tamaño completo (1200×500, `-F.jpg` de mlstatic), negro mate con placa metálica REEF: `perfil-c11-ml.jpg`.
-- GTIN 7791394273622: el founder lo CONFIRMÓ (2026-10-06) para el C11, aunque es el mismo que figura en la C2 del Reef 193; se carga tal cual (dos variantes comparten GTIN en el sitio).
-- Marco: valor neutro `injected` (la marca dice BTR600/Grilamid; no se usan).
--
-- 📷 FOTO DEFINITIVA (2026-10-06, tercera): el founder señaló que la "real" del C11 es la de Paesani `lentes-de-sol-reef-183-bolero-11-espejado-azul` (id 44197, product_zoom 1200 px): negro mate (dibujo oscuro sutil) con bandas azules en la unión de las patillas, forma Bolero. `perfil-c11-pae.jpg`.
-- Las placas se regeneraron con esa foto (`marketing/placas-ml/reef-183-c11-ml`, carpeta `SUBIR-reef-183`).
-- 🎯 SEO (seo-strategist): slug reef-183-bolero, descriptor "Espejados" (deportivo=177, cuadrado=196, hombre=193); "deportivo" y "cuadrado" sólo como adjetivos; sin "polarizado" en title/H1/short/meta.
-- 🏷️ SKU de casa REEF183-C11.
-- ============================================

BEGIN;

WITH
  reef AS (SELECT id FROM public.brands WHERE slug = 'reef'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM reef), (SELECT id FROM sol), 'reef-183-bolero', 'Reef 183 Bolero',
  'Lentes de sol espejados para hombre, con armazón cuadrado de estilo deportivo, lente de policarbonato UV400 categoría 3 y antirreflejo interno.',
  E'Los **Reef 183 Bolero** son **lentes de sol espejados para hombre, de armazón cuadrado y estilo deportivo**. El armazón es inyectado, con bisagras metálicas. Las lentes son de policarbonato, con espejado azul, **protección UV400**, que bloquea la radiación UVA y UVB hasta los 400 nm, **categoría 3** y antirreflejo en la cara interna.\n\n**Espejado, no polarizado.** El espejado es una capa reflectiva que se ve por fuera y reduce algo de luz; no es lo mismo que el polarizado. Esta lente no es polarizada: no reduce el deslumbramiento de superficies planas como el agua o el asfalto mojado. El antirreflejo en la cara interna reduce los reflejos de la luz que llega desde atrás o de costado y rebota en la lente hacia tus ojos. La protección UV la da el UV400, no el espejado.\n\n**Categoría 3.** La categoría 3 indica cuánta luz filtra la lente: es el filtro habitual para sol intenso y se puede usar para manejar de día. No es para usar de noche, al atardecer ni en túneles o lugares con poca luz.\n\nMedidas: lente 60 mm de ancho · puente 17 mm · varilla 139 mm · ancho total 148 mm · alto 49 mm.\n\nPara limpiarlos usá el paño y un líquido para lentes, nunca en seco ni con la remera.\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi preferís un envolvente para el deporte, mirá los [Reef 177 Aerial](/anteojos-de-sol/reef/reef-177-aerial). Si querés un cuadrado de frente más ancho, mirá los [Reef 193 Tortuga](/anteojos-de-sol/reef/reef-193-tortuga), y si lo buscás unisex para todos los días, los [Reef 196 Reunión](/anteojos-de-sol/reef/reef-196-reunion).',
  '{
    "frame_material": "injected",
    "frame_shape": "cuadrado",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "recommended_face_shapes": ["ovalado", "redondo", "oblongo"],
    "gender": "male",
    "hinge_system": "metalica",
    "measurements": {"frame_width_mm": 148, "lens_width_mm": 60, "bridge_mm": 17, "temple_length_mm": 139, "lens_height_mm": 49},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-06",
    "callouts": [
      {"type": "info", "position": "top", "title": "Armazón inyectado, bisagras metálicas", "body": "Armazón cuadrado inyectado con bisagras metálicas y estilo deportivo."},
      {"type": "warning", "position": "middle", "title": "Espejado, no polarizado", "body": "La lente es espejada azul y no es polarizada. Tiene antirreflejo interno, UV400 y categoría 3."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con el color?", "body": "Escribinos por WhatsApp y te asesoramos con un técnico óptico matriculado antes de comprar."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA4034472062"], "imported_at": "2026-10-06"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Espejados Reef 183 Bolero | Óptica Carballo',
  'Lentes de sol espejados Reef 183 Bolero para hombre: cuadrados, de estilo deportivo, UV400 y categoría 3. Envío a todo el país, estuche y garantía.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 1 variante: item simple de ML (variation_code NULL).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-183-bolero'), 'REEF183-C11',
   '{"frame_color":"negro-mate","lens_color":"azul-espejado","polarized":false,"lens_treatment":["antirreflejo-interno"],"model_code":"C11","gtin":"7791394273622"}'::jsonb,
   16059000, 3, true, 1, 'MLA4034472062', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 2 imágenes: el perfil + la placa de medidas compartida (sort 99).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-183-bolero'), (SELECT id FROM public.product_variants WHERE sku='REEF183-C11'),
   'reef-183-bolero/perfil-c11-pae.jpg', 'Lentes de sol espejados Reef 183 Bolero para hombre, vista de perfil: armazón negro mate cuadrado de estilo deportivo con detalles azules y lente espejado azul', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='reef-183-bolero'), NULL,
   'reef-183-bolero/medidas.jpg', 'Esquema técnico de medidas Reef 183 Bolero: ancho total 148mm, lente 60mm, alto 49mm, puente 17mm, varilla 139mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
