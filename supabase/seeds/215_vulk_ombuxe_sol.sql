-- ============================================
-- Seed 215: Vulk OMBUXE (sol, unisex, aviador cuadrado con doble puente, acetato grande), 2 variantes NO polarizadas cat 3
-- Fecha: 2026-11-21
-- ============================================
-- VARIACIONES del item MULTIVARIANTE de ML (MLA417128) MLA2190885294 (publicación de 2025 que el founder reutilizó el 2026-11-21; verificadas por API). Ya tenía 3 variaciones viejas con stock 0 (C16 negro brillo/gris oscuro degradé, C24 carey/celeste degradé, C21 marrón claro/brown gradient: SIN SKU ni fotos acá; NO se cargan hasta que el founder las pase) y se sumaron:
--   958346  C17  MLA2190885294 / variation 208686634807  $136.819  stock 2  frente y patillas negro mate, lente marrón caramelo
--   957127  C28  MLA2190885294 / variation 208686634809  $136.819  stock 2  frente y patillas rosa claro transparente, lente gris degradé (el founder la llamó "C29" por error; la ficha de Vulk `ombuxe-c28` trae el SKU 957127)
-- DATOS DEL FOUNDER (2026-11-18/21): acetato, bisagras de acero inoxidable (sin flex), armazón grande, doble puente, unisex, aviador cuadrado, UV400, cat 3 en las dos, lente CR39, NO polarizadas, FRENTE biodegradable (Vulk lo declara en la ficha de la C28; las patillas "acetato"), calibre 56-18-145, alto total 54, ancho total 149, 35,2 g. Vulk publica para la C28 55-18-140 / 147 y "talle Large": manda el founder, no se usa "talle large".
-- 🔬 Sin "liviano"/"flexible"/"ultra" (35,2 g sólo el número); "biodegradable" acotado al frente, sin "ecológico". ML muestra Hexagonal y Policarbonato en sus atributos: la web sigue lo que dice el founder (aviador, CR39).
-- 🎯 SEO (seo-strategist 2026-11-21): slug `vulk-ombuxe`; title `Lentes de Sol Vulk Ombuxe Grandes | Doble Puente` ("grandes" 90/19 es el único carril con volumen y ningún title Vulk lo reclama), SIN "aviador"/"hombre"/"polarizados"; forma `aviador` (misma geometría que Harry; entra a /aviador y /vulk/aviador); `frame_material` `acetate` (en inglés: el filtro /acetato lo lee así); UNA frase de vuelta, en Harry; links a Harry, The Trial, Crimson, Deserve, Rusty Yeah y el hub.
-- ⚠️ `polarized:false` en las dos y SIN "POL" ni 'polarized' en lens_treatment (sigue ['uv400']): no entran a /polarizados. `lens_category` 3 a nivel producto (igual en las dos). `lens_material` 'cr39' (excepción a la regla de sol; el despiece no tiene label de CR39 y omite la línea sin romper).
-- 📸 `pnpm fotos:subir --slug vulk-ombuxe --sufijo -c17/-c28`. C17: fotos oficiales con la lente recoloreada por código al caramelo real; C28: fotos oficiales corregidas del exceso de brillo en Gemini y fondo limpiado a blanco. Medidas una sola (medidas-c17).
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-ombuxe', 'Vulk Ombuxe',
  'Lentes de sol unisex de acetato con doble puente y armazón grande (149 mm de ancho total), de formato aviador cuadrado. Frente de acetato declarado biodegradable por el fabricante. Lente CR39 categoría 3 con filtro UV400. Bisagras de acero inoxidable. Incluye estuche y franela.',
  E'Los **lentes de sol Vulk Ombuxe** son **unisex**, de **formato aviador cuadrado**, con **armazón grande y doble puente**. El **frente es de acetato**, declarado biodegradable por el fabricante (las lentes y las partes metálicas no lo son), y las **patillas de acetato**, con **bisagras de acero inoxidable**, fijas (sin sistema flex). Pesan 35,2 gramos.\n\nLa lente es **CR39** categoría 3, con **filtro UV400**: filtra la radiación UV hasta 400 nm (UVA y UVB). La categoría 3 es la indicada para luz solar intensa. No son polarizados. ¿Sirven para manejar? De día, sí: la categoría 3 es apta para manejar con luz solar. De noche, en túneles o con poca luz no recomendamos usar anteojos de sol para manejar.\n\nMedidas: frente 149 mm · lente 56 mm · puente 18 mm · varilla 145 mm · alto total 54 mm.\n\nDisponible en 2 versiones:\n\n• C17 (SKU 958346): frente y patillas negro mate, lente marrón caramelo.\n• C28 (SKU 957127): frente y patillas rosa claro transparente, lente degradé de gris oscuro arriba a beige rosado abajo.\n\nSi buscás otro doble puente, mirá los [Vulk Harry](/anteojos-de-sol/vulk/vulk-harry), los [Vulk The Trial](/anteojos-de-sol/vulk/vulk-the-trial) o los [Vulk Crimson](/anteojos-de-sol/vulk/vulk-crimson). Para otro armazón grande de la marca, los [Vulk Deserve](/anteojos-de-sol/vulk/vulk-deserve). Y si preferís un aviador de acetato de otra marca, los [Rusty Yeah](/anteojos-de-sol/rusty/rusty-yeah). Podés ver [todos los lentes de sol Vulk](/anteojos-de-sol/vulk).\n\nIncluye estuche, franela de microfibra y garantía de 1 año contra defectos de fabricación.',
  '{
    "frame_material": "acetate",
    "temple_material": "acetate",
    "frame_shape": "aviador",
    "gender": "unisex",
    "line": "urbana",
    "hinge_system": "estandar",
    "hinge_material": "metal",
    "lens_material": "cr39",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "measurements": {"frame_width_mm": 149, "lens_width_mm": 56, "lens_height_mm": 54, "bridge_mm": 18, "temple_length_mm": 145},
    "weight_grams": 35.2,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-12-21",
    "callouts": [
      {"type": "info", "position": "top", "title": "Aviador cuadrado con doble puente", "body": "Armazón grande con doble puente. El frente es de acetato, declarado biodegradable por el fabricante; las patillas son de acetato, con bisagras de acero inoxidable fijas (sin flex)."},
      {"type": "tip", "position": "middle", "title": "Lente CR39 con filtro UV400", "body": "Lente CR39 con filtro UV400: filtra la radiación UV hasta 400 nm (UVA y UVB). No son polarizados. De día, sí: la categoría 3 es apta para manejar con luz solar; de noche, en túneles o con poca luz no recomendamos usar anteojos de sol para manejar."},
      {"type": "recommendation", "position": "bottom", "title": "Categoría 3 y armazón grande", "body": "Las dos versiones son categoría 3, la indicada para luz solar intensa. Son de armazón grande: compará las medidas con un anteojo tuyo que te quede cómodo."}
    ]
  }'::jsonb,
  true, false,
  'Lentes de Sol Vulk Ombuxe Grandes | Doble Puente',
  'Lentes de sol Vulk Ombuxe: armazón grande de acetato con doble puente, lente UV400 categoría 3, 2 colores. Envío a todo el país, estuche y garantía.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-ombuxe'), '958346',
   '{"frame_color":"negro-mate","lens_color":"marron-caramelo","model_code":"C17","polarized":false}'::jsonb,
   13681900, 2, true, 1, 'MLA2190885294', '208686634807'),
  ((SELECT id FROM public.products WHERE slug='vulk-ombuxe'), '957127',
   '{"frame_color":"rosa-claro-transparente","lens_color":"gris-degrade","model_code":"C28","polarized":false,"lens_treatment":["gradient"]}'::jsonb,
   13681900, 2, true, 2, 'MLA2190885294', '208686634809')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-ombuxe'), (SELECT id FROM public.product_variants WHERE sku='958346'),
   'vulk-ombuxe/perfil-c17.jpg', 'Lentes de sol Vulk Ombuxe grandes con doble puente, vista lateral, armazón de acetato negro mate con lente marrón caramelo', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-ombuxe'), (SELECT id FROM public.product_variants WHERE sku='958346'),
   'vulk-ombuxe/frente-c17.jpg', 'Lentes de sol Vulk Ombuxe con doble puente, vista frontal, armazón de acetato negro mate con lente marrón caramelo', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-ombuxe'), (SELECT id FROM public.product_variants WHERE sku='957127'),
   'vulk-ombuxe/perfil-c28.jpg', 'Lentes de sol Vulk Ombuxe grandes con doble puente, vista lateral, armazón de acetato rosa claro transparente con lente gris degradé', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-ombuxe'), (SELECT id FROM public.product_variants WHERE sku='957127'),
   'vulk-ombuxe/frente-c28.jpg', 'Lentes de sol Vulk Ombuxe con doble puente, vista frontal, armazón de acetato rosa claro transparente con lente gris degradé', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-ombuxe'), NULL,
   'vulk-ombuxe/medidas-c17.jpg', 'Medidas de los lentes de sol Vulk Ombuxe: lente 56mm, puente 18mm, varilla 145mm, alto total 54mm, ancho total 149mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: UNA sola, en Harry (gemelo de silueta, tamaño y doble puente).
UPDATE public.products
SET description = description || E'\n\nSi preferís el doble puente en acetato y en versión unisex, mirá los [Vulk Ombuxe](/anteojos-de-sol/vulk/vulk-ombuxe).', updated_at = now()
WHERE slug = 'vulk-harry' AND description NOT LIKE '%vulk-ombuxe%';

COMMIT;
