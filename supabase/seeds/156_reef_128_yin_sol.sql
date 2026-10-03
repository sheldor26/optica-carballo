-- ============================================
-- Seed 156: Reef 128 Yin SOL, primer producto de la marca Reef. Hombre, polarizado, frente de metal, 8 colores
-- Fecha: 2026-10-03
-- ============================================
-- Publicación de ML: MLA1751925814, tradicional (`catalog_listing:false`), $158.590 uniforme, 8 variaciones
-- con `variation_id` reales (verificados por API el 2026-10-03). Las publicaciones de catálogo del 128 se
-- ignoran a propósito. Stock = el de ML al 2026-10-03 (011 en 0 se carga igual, se sincroniza sola).
--
-- NOMBRE: "Reef 128 Yin". La marca lo llama "128 Reef" y ML "128 Yin/Ying"; el founder pidió ponerle
-- "Yin" porque hay gente que lo busca así. Slug `reef-128-yin`.
--
-- DATOS CONFIRMADOS POR EL FOUNDER (2026-10-03): forma envolvente deportivo; UV400 en todos los anteojos de sol Reef;
-- bisagras con sistema flex; lente gris oscuro en 017 y 018; medidas 66-17-110 (calibre, puente, patilla) más
-- ancho total 138 y alto total 46. SIN `lens_category`: nadie leyó la categoría del filtro (el lente es TAC y el
-- default "cat 3 + policarbonato" no aplica, optical-expert).
--
-- 🎯 SEO (seo-strategist): primaria `lentes de sol reef` (210/7), title sin "Hombre" para entrar en 60
-- caracteres con "Yin". H1 = name. El 128 no usa envolvente/deportivo en title ni meta (saturado por Rusty y Mormaii): sólo copy.
-- 🔬 Copy validado por optical-expert: nada de liviano/flexible/policarbonato/"armazón de aluminio"/UV/colores/
-- cantidad. "Bisagras flex de metal" sólo como nombre del componente.
-- 🏷️ SKU de casa REEF128-<color> (ML no declara seller_sku). `polarized:true` explícito en las 8.
-- Orden por stock descendente; el clásico (patillas negras/frente negro) sólo desempata iguales: 019, 016, 018,
-- 014, 017, 020, 015, 011. Primaria del grid = perfil de la 019.
-- También corrige el `seo_intro` de la marca Reef, que prometía formas y materiales que no están en el catálogo.
-- ============================================

BEGIN;

UPDATE public.brands SET
  seo_intro = E'Reef es una marca de origen californiano, fundada en San Diego en 1984 por los hermanos argentinos Fernando y Santiago Aguerre, con identidad beach lifestyle y distribución oficial en Argentina. Su línea de anteojos extiende la propuesta de la marca al universo del sol.\n\nEn Óptica Carballo trabajamos Reef con stock real y respaldo oficial. El catálogo se va ampliando: hoy incluye lentes de sol para hombre con frente de metal y lentes polarizadas, recomendadas si los vas a usar en la playa o en cualquier situación con reflejos intensos sobre agua o asfalto.'
WHERE slug = 'reef';

WITH
  reef AS (SELECT id FROM public.brands WHERE slug = 'reef'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM reef), (SELECT id FROM sol), 'reef-128-yin', 'Reef 128 Yin',
  'Lentes de sol Reef 128 Yin para hombre, polarizados, con frente de metal.',
  E'Los **Reef 128 Yin** son **lentes de sol envolventes de diseño deportivo, para hombre**, con frente de metal y puente doble. Las lentes son **polarizadas, de material TAC, con protección UV400**. Las patillas y sus terminales son de aluminio, y las bisagras tienen sistema flex.\n\n**Lentes polarizadas y UV400.** La protección UV400 filtra la radiación ultravioleta. El filtro polarizado reduce el deslumbramiento que producen superficies planas como el agua o el asfalto mojado. Como cualquier lente de sol, no es para manejar de noche. Además, el polarizado puede dificultar la lectura de algunas pantallas, como las del celular o las de un tablero digital.\n\n**Metal y aluminio.** El frente es de metal y las patillas son de aluminio, con terminales del mismo material.\n\nMedidas: lente 66 mm de ancho · puente 17 mm · varilla 110 mm · ancho total 138 mm · alto total 46 mm.\n\nPara limpiarlos usá el paño y un líquido para lentes, nunca en seco ni con la remera.\n\nIncluye estuche, franela y garantía oficial de 1 año.',
  '{
    "frame_material": "metal",
    "temple_material": "aluminio",
    "frame_shape": "envolvente",
    "line": "deportiva",
    "lens_material": "tac",
    "lens_treatment": ["uv400", "polarized"],
    "gender": "male",
    "hinge_system": "flex",
    "measurements": {"frame_width_mm": 138, "lens_width_mm": 66, "bridge_mm": 17, "temple_length_mm": 110, "lens_height_mm": 46},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-03",
    "callouts": [
      {"type": "info", "position": "top", "title": "Frente de metal, patillas de aluminio", "body": "Frente de metal envolvente con puente doble. Patillas y terminales de aluminio, con bisagras con sistema flex."},
      {"type": "tip", "position": "middle", "title": "Polarizadas, TAC y UV400", "body": "Lente polarizada de material TAC, con buena calidad óptica y protección UV400. El polarizado reduce el deslumbramiento del agua y del asfalto mojado."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con el color?", "body": "Escribinos por WhatsApp y te asesoramos con un técnico óptico matriculado antes de comprar."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1751925814"], "imported_at": "2026-10-03"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Reef 128 Yin Polarizados | Óptica Carballo',
  'Lentes de sol Reef 128 Yin para hombre: polarizados UV400, frente de metal y patillas de aluminio. Envío a todo el país, estuche, franela y garantía.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 8 variantes, todas de la publicación MLA1751925814 con su variation_id real (un NULL en una multi-variación
-- es un skip silencioso del sync). Precio $158.590 = 15859000 centavos. Stock de ML al 2026-10-03.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-128-yin'), 'REEF128-019',
   '{"frame_color":"plateado-patillas-negras-logo-naranja","lens_color":"negro","polarized":true,"model_code":"Col. 019","gtin":"7790394222210"}'::jsonb,
   15859000, 4, true, 1, 'MLA1751925814', '186368365459'),
  ((SELECT id FROM public.products WHERE slug='reef-128-yin'), 'REEF128-016',
   '{"frame_color":"dorado-brillo-patillas-plateadas","lens_color":"marron","polarized":true,"model_code":"Col. 016","gtin":"7790394216400"}'::jsonb,
   15859000, 4, true, 2, 'MLA1751925814', '186368365461'),
  ((SELECT id FROM public.products WHERE slug='reef-128-yin'), 'REEF128-018',
   '{"frame_color":"peltre-patillas-negras","lens_color":"gris-oscuro","polarized":true,"model_code":"Col. 018","gtin":"7790394220742"}'::jsonb,
   15859000, 3, true, 3, 'MLA1751925814', '207683594187'),
  ((SELECT id FROM public.products WHERE slug='reef-128-yin'), 'REEF128-014',
   '{"frame_color":"peltre-patillas-plateadas","lens_color":"gris-oscuro","polarized":true,"model_code":"Col. 014","gtin":"7790394208382"}'::jsonb,
   15859000, 3, true, 4, 'MLA1751925814', '180372264010'),
  ((SELECT id FROM public.products WHERE slug='reef-128-yin'), 'REEF128-017',
   '{"frame_color":"peltre-patillas-gris-claro-mate","lens_color":"gris-oscuro","polarized":true,"model_code":"Col. 017","gtin":"7790394220735"}'::jsonb,
   15859000, 3, true, 5, 'MLA1751925814', '207683594185'),
  ((SELECT id FROM public.products WHERE slug='reef-128-yin'), 'REEF128-020',
   '{"frame_color":"negro-patillas-negro-azul","lens_color":"gris-oscuro","polarized":true,"model_code":"Col. 020","gtin":"7790394234015"}'::jsonb,
   15859000, 2, true, 6, 'MLA1751925814', '186368365463'),
  ((SELECT id FROM public.products WHERE slug='reef-128-yin'), 'REEF128-015',
   '{"frame_color":"plateado-patillas-negras","lens_color":"negro","polarized":true,"model_code":"Col. 015","gtin":"7790394208832"}'::jsonb,
   15859000, 2, true, 7, 'MLA1751925814', '207669814467'),
  ((SELECT id FROM public.products WHERE slug='reef-128-yin'), 'REEF128-011',
   '{"frame_color":"dorado-mate-patillas-plateadas","lens_color":"marron","polarized":true,"model_code":"Col. 011","gtin":"7790394208351"}'::jsonb,
   15859000, 0, true, 8, 'MLA1751925814', '180372264012')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 9 imágenes: el perfil de cada color + la placa de medidas compartida (sort 99) (la marca sólo tiene fotos laterales). Primaria = perfil de la 019.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-128-yin'), (SELECT id FROM public.product_variants WHERE sku='REEF128-019'),
   'reef-128-yin/perfil-c019.jpg', 'Lentes de sol Reef 128 Yin polarizados para hombre, vista lateral, plateado con patillas negras y logo naranja', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='reef-128-yin'), (SELECT id FROM public.product_variants WHERE sku='REEF128-016'),
   'reef-128-yin/perfil-c016.jpg', 'Lentes de sol Reef 128 Yin polarizados para hombre, vista lateral, dorado brillo con patillas plateadas', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='reef-128-yin'), (SELECT id FROM public.product_variants WHERE sku='REEF128-018'),
   'reef-128-yin/perfil-c018.jpg', 'Lentes de sol Reef 128 Yin polarizados para hombre, vista lateral, peltre con patillas negras', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='reef-128-yin'), (SELECT id FROM public.product_variants WHERE sku='REEF128-014'),
   'reef-128-yin/perfil-c014.jpg', 'Lentes de sol Reef 128 Yin polarizados para hombre, vista lateral, peltre con patillas plateadas', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='reef-128-yin'), (SELECT id FROM public.product_variants WHERE sku='REEF128-017'),
   'reef-128-yin/perfil-c017.jpg', 'Lentes de sol Reef 128 Yin polarizados para hombre, vista lateral, peltre con patillas gris claro mate', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='reef-128-yin'), (SELECT id FROM public.product_variants WHERE sku='REEF128-020'),
   'reef-128-yin/perfil-c020.jpg', 'Lentes de sol Reef 128 Yin polarizados para hombre, vista lateral, negro con patillas negro y azul', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='reef-128-yin'), (SELECT id FROM public.product_variants WHERE sku='REEF128-015'),
   'reef-128-yin/perfil-c015.jpg', 'Lentes de sol Reef 128 Yin polarizados para hombre, vista lateral, plateado con patillas negras', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='reef-128-yin'), (SELECT id FROM public.product_variants WHERE sku='REEF128-011'),
   'reef-128-yin/perfil-c011.jpg', 'Lentes de sol Reef 128 Yin polarizados para hombre, vista lateral, dorado mate con patillas plateadas', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='reef-128-yin'), NULL,
   'reef-128-yin/medidas.jpg', 'Esquema técnico de medidas Reef 128 Yin: ancho total 138mm, lente 66mm, alto 46mm, puente 17mm, varilla 110mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
