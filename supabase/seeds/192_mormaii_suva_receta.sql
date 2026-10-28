-- ============================================
-- Seed 192: Mormaii SUVA (receta) — rectangular semi envolvente base 6, hombre, poliamida inyectada, bisagras metálicas flex Visyfit, 4 colores
-- Fecha: 2026-10-28
-- ============================================
-- UNA publicación multivariante de ML: `MLA1550213828` (legacy, 11 vendidas, catalog_listing:false, MLA417127, $105.790). NO se la toca por API (lección Fiji): el founder la actualiza en el panel.
-- var_ids de ML verificados por API el 2026-10-28 (RE-VERIFICAR antes de aplicar si el founder la sigue editando):
--   C01 Negro brillo                                  179105099308  SKU 110105701  stock 3
--   C02 Negro mate (detalle gris en patillas)         184936324425  SKU 110105702  stock 2
--   C03 Azul / Negro (negro mate con azul)            184936622763  SKU 110105703  stock 2
--   C07 "Negro mate con azul y turquesa" (azul mate)  179105099310  SKU 110105707  stock 3 (el founder lo actualizó)
--   (la variación "Cristal 05" `181991774229`, stock 0, NO está en la lista del founder: no se carga)
-- DATOS DEL FOUNDER (2026-10-28): medidas 57-17-137 (grabado `57□17-137` en la foto), alto total 40, ancho total 138, hombre, "es de poliamida", bisagras metálicas con flex "Visyfit", admite cualquier tipo de lente pero positivas/astigmatismo pueden dar inconvenientes (semi envolvente); "distribuidor oficial": sí se puede decir.
-- 🔬 optical-expert: sin "liviano"/"italiana"/"apto para todas las graduaciones"; limitación de graduación sin números; demo sin graduar. 🎯 SEO: `Mormaii Suva`, slug `mormaii-suva-receta`, rectangular, cierre "Semi Envolvente", cross-link Moorea (vuelta sólo ahí), Ancara 2, Hover.
-- 📸 Fotos oficiales de Mormaii (Interoptica), `pnpm placas --tipo receta` + `pnpm fotos:subir --sufijo -c01/-c02/-c03/-c07`. Primaria = perfil de C01.
-- ============================================

BEGIN;

WITH
  mormaii AS (SELECT id FROM public.brands WHERE slug = 'mormaii'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM mormaii), (SELECT id FROM receta), 'mormaii-suva-receta', 'Mormaii Suva',
  'Armazón de receta Mormaii Suva: rectangular semi envolvente de estilo deportivo para hombre, de poliamida inyectada, con bisagras metálicas con flex Visyfit. Incluye estuche semi rígido y franela de Mormaii.',
  E'El **Mormaii Suva** es un **armazón de receta rectangular semi envolvente**, de estilo deportivo, para hombre. El frente y las patillas son de **poliamida inyectada**, con **bisagras metálicas con flex "Visyfit"** y una curva base 6 que acompaña la forma de la cara.\n\n**Los cristales que trae son de demostración**: no tienen graduación, ni protección UV, ni filtro de luz azul, ni polarizado; son lentes de muestra para que veas cómo te queda el armazón. Los cristales con tu receta se arman aparte, y admite distintos tipos (monofocales, bifocales o progresivos) siempre que el óptico lo evalúe según tu graduación. Por ser semi envolvente, algunas graduaciones, sobre todo positivas o con astigmatismo, pueden presentar inconvenientes.\n\nMedidas: lente 57 mm de ancho · puente 17 mm · varilla 137 mm · ancho total del frente 138 mm · alto total 40 mm.\n\nDisponible en 4 colores: negro brillo, negro mate, negro mate con detalle azul y azul mate con patillas turquesa.\n\nIncluye estuche semi rígido, franela de Mormaii y garantía oficial de 1 año del fabricante.\n\nSi buscás un semi envolvente con lente de 55 mm y más colores, mirá los [Mormaii Moorea](/anteojos-de-receta/mormaii/mormaii-moorea-receta). Si te interesa un armazón de receta deportivo con correa, mirá los [Mormaii Ancara 2](/anteojos-de-receta/mormaii/mormaii-ancara2-receta); y si preferís un rectangular con clip-on polarizado, los [Mormaii Hover](/anteojos-de-receta/mormaii/mormaii-hover). También podés ver [todos los armazones de receta Mormaii](/anteojos-de-receta/mormaii).',
  '{
    "frame_material": "poliamida",
    "temple_material": "poliamida",
    "frame_shape": "rectangular",
    "hinge_system": "flex",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo"],
    "gender": "male",
    "line": "deportiva",
    "measurements": {"frame_width_mm": 138, "lens_width_mm": 57, "lens_height_mm": 40, "bridge_mm": 17, "temple_length_mm": 137},
    "includes": ["estuche-semi-rigido", "franela-mormaii"],
    "warranty_months": 12,
    "new_until": "2026-11-28",
    "callouts": [
      {"type": "info", "position": "top", "title": "Semi envolvente deportivo, bisagra Visyfit", "body": "Armazón de poliamida inyectada con diseño rectangular semi envolvente de curva base 6, pensado para hombre. Las bisagras son metálicas, con sistema flex \"Visyfit\"."},
      {"type": "warning", "position": "middle", "title": "Ojo si tu receta es positiva o tiene astigmatismo", "body": "Este armazón es semi envolvente y tiene más curvatura que uno plano. En graduaciones positivas o con astigmatismo, esa curvatura puede dar inconvenientes de visión o de estética. La viabilidad según tu receta y el tipo de cristal la define el óptico antes del armado."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con una foto de tu receta y te pasamos el costo de los cristales según tu graduación y los tratamientos que quieras."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1550213828"], "imported_at": "2026-10-28"}
  }'::jsonb,
  true, false,
  'Armazón Rx Mormaii Suva Semi Envolvente | Óptica Carballo',
  'Mormaii Suva: armazón de receta semi envolvente para hombre, inyectado, con lente de 57 mm de ancho. Envío a todo el país y garantía oficial de 1 año.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 4 variantes de UNA multivariante (variation_code real). Precio y stock de ML (2026-10-28).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='mormaii-suva-receta'), '110105701',
   '{"frame_color":"negro-brillo","model_code":"C01"}'::jsonb, 10579000, 3, true, 1, 'MLA1550213828', '179105099308'),
  ((SELECT id FROM public.products WHERE slug='mormaii-suva-receta'), '110105707',
   '{"frame_color":"azul-mate-y-turquesa","model_code":"C07"}'::jsonb, 10579000, 3, true, 2, 'MLA1550213828', '179105099310'),
  ((SELECT id FROM public.products WHERE slug='mormaii-suva-receta'), '110105702',
   '{"frame_color":"negro-mate","model_code":"C02"}'::jsonb, 10579000, 2, true, 3, 'MLA1550213828', '184936324425'),
  ((SELECT id FROM public.products WHERE slug='mormaii-suva-receta'), '110105703',
   '{"frame_color":"negro-mate-con-azul","model_code":"C03"}'::jsonb, 10579000, 2, true, 4, 'MLA1550213828', '184936622763')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Fotos: cada variante con su par perfil+frente; medidas SIEMPRE última (sort 99, variant_id NULL). Primaria = perfil de C01.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='mormaii-suva-receta'), (SELECT id FROM public.product_variants WHERE sku='110105701'),
   'mormaii-suva-receta/perfil-c01.jpg', 'Armazón de receta Mormaii Suva semi envolvente para hombre, vista lateral, negro brillo', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='mormaii-suva-receta'), (SELECT id FROM public.product_variants WHERE sku='110105701'),
   'mormaii-suva-receta/frente-c01.jpg', 'Armazón de receta Mormaii Suva semi envolvente para hombre, vista frontal, negro brillo', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-suva-receta'), (SELECT id FROM public.product_variants WHERE sku='110105707'),
   'mormaii-suva-receta/perfil-c07.jpg', 'Armazón de receta Mormaii Suva semi envolvente para hombre, vista lateral, azul mate con patillas turquesa', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-suva-receta'), (SELECT id FROM public.product_variants WHERE sku='110105707'),
   'mormaii-suva-receta/frente-c07.jpg', 'Armazón de receta Mormaii Suva semi envolvente para hombre, vista frontal, azul mate con patillas turquesa', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-suva-receta'), (SELECT id FROM public.product_variants WHERE sku='110105702'),
   'mormaii-suva-receta/perfil-c02.jpg', 'Armazón de receta Mormaii Suva semi envolvente para hombre, vista lateral, negro mate', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-suva-receta'), (SELECT id FROM public.product_variants WHERE sku='110105702'),
   'mormaii-suva-receta/frente-c02.jpg', 'Armazón de receta Mormaii Suva semi envolvente para hombre, vista frontal, negro mate', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-suva-receta'), (SELECT id FROM public.product_variants WHERE sku='110105703'),
   'mormaii-suva-receta/perfil-c03.jpg', 'Armazón de receta Mormaii Suva semi envolvente para hombre, vista lateral, negro mate con azul', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-suva-receta'), (SELECT id FROM public.product_variants WHERE sku='110105703'),
   'mormaii-suva-receta/frente-c03.jpg', 'Armazón de receta Mormaii Suva semi envolvente para hombre, vista frontal, negro mate con azul', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-suva-receta'), NULL,
   'mormaii-suva-receta/medidas-c01.jpg', 'Esquema técnico de medidas Mormaii Suva: lente 57mm, puente 17mm, varilla 137mm, alto total 40mm, ancho total 138mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: UNA sola, en Moorea (único gemelo real).
UPDATE public.products
SET description = description || E'\n\nSi buscás el semi envolvente con lente de 57 mm, mirá los [Mormaii Suva](/anteojos-de-receta/mormaii/mormaii-suva-receta).', updated_at = now()
WHERE slug = 'mormaii-moorea-receta' AND description NOT LIKE '%mormaii-suva-receta%';

COMMIT;
