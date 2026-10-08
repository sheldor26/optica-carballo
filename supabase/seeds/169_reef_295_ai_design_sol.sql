-- ============================================
-- Seed 169: Reef 295 AI Design SOL, decimotercer producto de la marca Reef. Lente único tipo máscara de 130 mm sobre frente cuadrado de hombre, UV400 cat 3, bisagras plásticas. NO admite lentes graduados. 3 versiones: C01 negro brillo (lente gris, NO polarizado), C03 azul mate (espejado azul, POLARIZADO), C04 negro mate con detalles verde lima (lente verde, POLARIZADO)
-- Fecha: 2026-10-08
-- ============================================
-- 3 variantes en 3 publicaciones TRADICIONALES de ML (`catalog_listing:false`, items simples: `variation_code` NULL), ACTIVAS, verificadas por API el 2026-10-08:
--   C01 MLA1536016701 (MLAU3430283124, $148.593,24, stock 1, sin GTIN) · C03 MLA1536237551 (MLAU3430294602, $194.508,84, stock 1, GTIN 7791394263647) · C04 MLA1536354601 (MLAU3430312526, $148.593,24, stock 2, GTIN 7791394263654)
-- Stock y precio mandan desde ML. ML marca "Sin género"/"Policarbonato"/"Inyectado"/"Cuadrado"; manda el founder para género (hombre) y medidas.
--
-- DATOS CONFIRMADOS POR EL FOUNDER (2026-10-08): "AI Design" es el nombre del modelo; hombre, diseño cuadrado, bisagras plásticas, cat 3, UV400; el lente es una PLACA (un solo lente) => NO se pueden adaptar lentes graduados; placa 130 mm, patillas 115, altura total 53, ancho total 143. C03 espejada azul polarizada; C04 lente verde polarizada; C01 NO polarizada (lente gris).
-- Sin puente (`bridge_mm` ausente): es un lente único, no hay puente entre lentes. La marca (calibre 130, alto 47, patilla 115, "No Flex", Grilamid TR90) no gana contra el founder; marco neutro `injected` (NO Grilamid, NO flexible). Lente de policarbonato (LENS_MATERIAL de ML y default del repo).
-- POLARIZADO PARCIAL: `polarized` por variante (C03 y C04 true, C01 false); `lens_treatment` del producto sólo ["uv400"]; sin "polarizado" en title/H1/short/meta. AR interno NO afirmado en ninguna (ML no lo dice; confirmar).
-- 📷 FOTOS: de la marca (reefeyewear.com ids 6844=C01, 6848=C03, 6850=C04; ficha activa id_product 1631). Sin `medidas.jpg`: la plantilla del founder asume dos lentes con puente (pendiente decidir). Sin placas de ML (publicaciones ya cargadas).
-- 🎯 SEO (seo-strategist) + óptica (optical-expert): slug reef-295-ai-design, descriptor "tipo máscara / lente único" (sin volumen propio; nadie lo usa en el catálogo), sin "ciclismo", "deportivo" sólo como estilo, sin Grilamid/flexible/irrompible/ventilado/antiempañante, sin claims de distorsión; callout visible de que no se gradúa; "AI Design" es el nombre oficial del modelo (sin prosa sobre IA en el copy).
-- ============================================

BEGIN;

WITH
  reef AS (SELECT id FROM public.brands WHERE slug = 'reef'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM reef), (SELECT id FROM sol), 'reef-295-ai-design', 'Reef 295 AI Design',
  'Lentes de sol Reef 295 AI Design para hombre: lente único tipo máscara de 130 mm y armazón inyectado cuadrado. UV400 y categoría 3. Tres versiones, dos con lente polarizado.',
  E'Los **Reef 295 AI Design** son **lentes de sol para hombre** con un **lente único tipo máscara** de 130 mm de ancho y 53 mm de alto, montado en un frente cuadrado de estilo deportivo. El armazón es inyectado, con bisagras plásticas y relieve en las patillas. El lente es de policarbonato, con **protección UV400**, que bloquea la radiación UVA y UVB hasta los 400 nm, y **categoría 3**.\n\n**Un solo lente.** Tiene un único lente que cubre los dos ojos, por eso este modelo es solo de sol y no se puede graduar. Si necesitás anteojos con receta, mirá nuestros [anteojos de receta](/anteojos-de-receta).\n\n**Polarizado según la versión.** Las versiones C03 (espejado azul) y C04 (lente verde) llevan [lentes polarizados](/anteojos-de-sol/polarizados); la C01 (lente gris) no es polarizada. El filtro polarizado reduce el deslumbramiento que producen superficies planas como el agua o el asfalto mojado, y puede hacer que algunas pantallas (celular, GPS, tablero del auto) se vean más oscuras o con manchas, o que cueste leerlas, según el ángulo. El espejado de la C03 es una capa reflectiva que se ve por fuera y reduce algo de luz; no es lo mismo que el polarizado. La protección UV la da el UV400, no el polarizado ni el espejado.\n\n**Categoría 3.** La categoría 3 indica cuánta luz filtra la lente: es el filtro habitual para sol intenso y sirve para manejar de día. Como cualquier lente de sol, no es para usar de noche, al atardecer ni en túneles o lugares con poca luz.\n\nMedidas: lente (placa) 130 mm de ancho · varilla 115 mm · ancho total 143 mm · alto 53 mm. Es un frente grande, pensado para rostros medianos a anchos.\n\nPara limpiarlos usá el paño y un líquido para lentes, nunca en seco ni con la remera.\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi buscás un frente cuadrado de dos lentes con lente polarizado, mirá los [Reef 299 Pier](/anteojos-de-sol/reef/reef-299-pier); si querés un cuadrado de estilo deportivo con lente espejado azul, los [Reef 183 Bolero](/anteojos-de-sol/reef/reef-183-bolero), y si preferís un deportivo de dos lentes, los [Reef 177 Aerial](/anteojos-de-sol/reef/reef-177-aerial).',
  '{
    "frame_material": "injected",
    "frame_shape": "cuadrado",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "recommended_face_shapes": ["ovalado", "redondo", "oblongo"],
    "gender": "male",
    "hinge_system": "plastica",
    "measurements": {"frame_width_mm": 143, "lens_width_mm": 130, "temple_length_mm": 115, "lens_height_mm": 53},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-08",
    "callouts": [
      {"type": "warning", "position": "top", "title": "Lente único: no se puede graduar", "body": "Tiene un único lente que cubre los dos ojos, por eso este modelo es solo de sol y no admite lentes con receta."},
      {"type": "info", "position": "middle", "title": "Polarizado según la versión", "body": "Las versiones C03 (espejado azul) y C04 (lente verde) son polarizadas; la C01 (lente gris) no lo es. Todas tienen UV400 y categoría 3."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con el color?", "body": "Escribinos por WhatsApp y te asesoramos con un técnico óptico matriculado antes de comprar."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1536016701", "MLA1536237551", "MLA1536354601"], "imported_at": "2026-10-08"}
  }'::jsonb,
  true, false,
  'Reef 295 AI Design | Lentes de Sol Tipo Máscara',
  'Lentes de sol Reef 295 AI Design para hombre: lente único tipo máscara de 130 mm, armazón inyectado, UV400 y categoría 3. Envío a todo el país y garantía.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 3 variantes: items simples de ML (variation_code NULL). Orden por stock: C04 (2) primaria, C01 (1), C03 (1).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-295-ai-design'), 'REEF295-C04',
   '{"frame_color":"negro-mate-detalles-verde-lima","lens_color":"verde","polarized":true,"model_code":"C04","gtin":"7791394263654"}'::jsonb,
   14859324, 2, true, 1, 'MLA1536354601', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-295-ai-design'), 'REEF295-C01',
   '{"frame_color":"negro-brillo","lens_color":"gris","polarized":false,"model_code":"C01"}'::jsonb,
   14859324, 1, true, 2, 'MLA1536016701', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-295-ai-design'), 'REEF295-C03',
   '{"frame_color":"azul-mate","lens_color":"azul-espejado","polarized":true,"model_code":"C03","gtin":"7791394263647"}'::jsonb,
   19450884, 1, true, 3, 'MLA1536237551', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 3 imágenes: el perfil de cada versión (sin placa de medidas todavía).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-295-ai-design'), (SELECT id FROM public.product_variants WHERE sku='REEF295-C04'),
   'reef-295-ai-design/perfil-c04.jpg', 'Lentes de sol Reef 295 AI Design C04 de perfil, armazón negro mate con detalles verde lima y lente único verde polarizado', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='reef-295-ai-design'), (SELECT id FROM public.product_variants WHERE sku='REEF295-C01'),
   'reef-295-ai-design/perfil-c01.jpg', 'Lentes de sol Reef 295 AI Design C01 de perfil, armazón negro brillo y lente único gris', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='reef-295-ai-design'), (SELECT id FROM public.product_variants WHERE sku='REEF295-C03'),
   'reef-295-ai-design/perfil-c03.jpg', 'Lentes de sol Reef 295 AI Design C03 de perfil, armazón azul mate y lente único espejado azul polarizado', 2000, 1333, 2, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: sólo en el 299 (el vecino más cercano; todavía no tenía ninguna).
UPDATE public.products
SET description = description || E'\n\nSi querés un lente único tipo máscara de 130 mm, mirá los [Reef 295 AI Design](/anteojos-de-sol/reef/reef-295-ai-design).', updated_at = now()
WHERE slug = 'reef-299-pier' AND description NOT LIKE '%reef-295-ai-design%';

COMMIT;
