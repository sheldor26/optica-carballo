-- ============================================
-- Seed 174: Rusty Blica Optics RECETA (FW24), redondo en G-Flex, unisex, talle chico, 2 colores
-- Fecha: 2026-10-14
-- ============================================
-- 2 PUBLICACIONES TRADICIONALES de ML (items simples, `variation_code` NULL, `catalog_listing:false`, categoría MLA417127), ACTIVAS, publicadas por el founder el 2026-10-14 y verificadas por API:
--   SBLK  SKU 968605  MLA2191886987 (MLAU5489536601)  $82.490 → 8249000c  stock 3  negro brillo
--   SAND  SKU 958601  MLA4075804040 (MLAU5534491140)  $82.490 → 8249000c  stock 3  frente caramelo transparente / patillas rosa pálido
--   ML carga "Sin género" y un GTIN placeholder (= el SKU: 00968605 / 00958601): NO se carga como GTIN. Stock y precio mandan desde ML.
--
-- DATOS DEL FOUNDER (2026-10-14): G-Flex, bisagras metálicas con sistema flex, diseño redondo, 23,2 g, medidas **48-20-135, ancho total 130, alto total 50** (las que pasó él; la web de Rusty dice 51-20-145 y NO gana contra el founder), "se puede adaptar todo tipo de lentes". El SBLK es unisex y el SAND "más femenino por el color": producto unisex.
-- ⚠️ CRITERIO: el SITIO no menciona Blue Cut (la ficha web de Rusty lo dice, el founder nunca lo confirmó para el Blica: ver MISTAKES.md 2026-10-14).
-- ⚠️ "facetado" (visto en las fotos) NO se usa: no lo confirmó el founder. Forma = "redondo".
-- ⚠️ Alto 50 = ALTURA TOTAL del armazón (criterio del founder, cargada tal cual en `lens_height_mm`); el hueco real del cristal es menor (estimado 40-44 mm por optical-expert, SIN MEDIR): por eso el texto de progresivos es prudente. Pendiente: el founder mide el hueco y prueba que la patilla abra >90° con resistencia elástica (si no, sacar "con sistema flex").
--
-- RECETA: sin lens_material/lens_treatment/lens_category (lente demo); sólo `lens_compatibility`.
-- Convención de la línea de receta de Rusty: "Rusty <Modelo> Optics" (ver feedback del founder 2026-10-14, Peating corregido) y slug `rusty-<modelo>-receta`.
-- 🎯 SEO (seo-strategist): sin carril propio con volumen (redondos ocupados por Ther/Misty/Kirt/Vartis; G-Flex compartido); se ataca con el branded `rusty blica` (title, H1, slug, alt) y `anteojos recetados` una sola vez en el primer párrafo; "redondo" sólo como atributo de forma. Sin color ni género en title/H1. Links a Ther, Misty, Zinz y al hub; frase de vuelta sólo en Misty.
-- 🔬 optical-expert: "liviano" (no "ultraliviano"), sistema flex = bisagra de resorte (nunca "flexible" para el armazón), face shapes ovalado/cuadrado/corazón, talle chico, sin "holgado" ni "cualquier tipo".
-- 📸 FOTOS: oficiales de Rusty (900×442) pasadas por `pnpm placas --tipo receta` y subidas con `pnpm fotos:subir --sufijo`: `rusty-blica-receta/perfil|frente-sblk|sand.jpg` + `medidas.jpg` (2000×1333), scale 1.05.
-- ============================================

BEGIN;

WITH
  rusty  AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-blica-receta', 'Rusty Blica Optics',
  'Armazón de receta Rusty Blica Optics en G-Flex, redondo y liviano (23,2 g), con bisagras metálicas con sistema flex. En negro brillo o en caramelo transparente con patillas rosa pálido.',
  E'Los **Rusty Blica** son **anteojos recetados** de armazón **redondo**, unisex y de talle chico, en **G-Flex** y livianos: 23,2 g. Las **bisagras son metálicas, con sistema flex**: la patilla acompaña el movimiento al abrir y cerrar, para un calce más cómodo.\n\n**Viene con lentes de demostración**, sin graduación, para que pruebes el armazón. Sumale tus cristales con receta: monofocales, bifocales, progresivos o multifocales. Para progresivos, el calibre es chico (48 mm): trabajamos con diseños de corredor corto y tomamos tu distancia pupilar y la altura de montaje con el armazón puesto.\n\nMedidas: frente 130 mm · lente 48 mm de ancho · puente 20 mm · varilla 135 mm · alto total 50 mm. Es un talle chico.\n\nDisponible en 2 colores:\n\n• **SBLK, negro brillo.**\n• **SAND-0292, frente caramelo transparente con patillas rosa pálido.**\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi buscás otro redondo, mirá los [Rusty Ther Optics](/anteojos-de-receta/rusty/rusty-ther-receta), de metal, o los [Rusty Misty Optics](/anteojos-de-receta/rusty/rusty-misty-receta), también de talle chico; si preferís un cuadrado en G-Flex, los [Rusty Zinz Optics](/anteojos-de-receta/rusty/rusty-zinz-receta). También podés ver [todos los anteojos de receta Rusty](/anteojos-de-receta/rusty).',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "redondo",
    "hinge_system": "flex",
    "size_fit": "chico",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "recommended_face_shapes": ["ovalado", "cuadrado", "corazon"],
    "gender": "unisex",
    "weight_grams": 23.2,
    "measurements": {"frame_width_mm": 130, "lens_width_mm": 48, "lens_height_mm": 50, "bridge_mm": 20, "temple_length_mm": 135},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-14",
    "callouts": [
      {"type": "info", "position": "top", "title": "Redondo, liviano y de talle chico", "body": "Frente y patillas de G-Flex, 23,2 g, con bisagras metálicas con sistema flex. Unisex, en negro brillo o en caramelo transparente con patillas rosa pálido."},
      {"type": "tip", "position": "middle", "title": "Progresivos: consultanos antes", "body": "El calibre es chico (48 mm), así que para progresivos usamos un diseño de corredor corto y tomamos tu distancia pupilar y la altura de montaje con el armazón puesto. Acepta también monofocal, bifocal y multifocal."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con una foto de tu receta. Te pasamos el costo de los cristales según tu graduación y los tratamientos que quieras (antirreflejo, fotocromático)."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2191886987", "MLA4075804040"], "imported_at": "2026-10-14"}
  }'::jsonb,
  true, false,
  'Rusty Blica Optics Redondo G-Flex | Anteojos de Receta',
  'Anteojos de receta Rusty Blica Optics: armazón redondo de G-Flex, liviano (23,2 g), con bisagras metálicas. Envíos a todo el país y garantía de 1 año.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 2 variantes: items simples de ML (variation_code NULL), ambas con stock 3: primaria = SBLK.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-blica-receta'), '968605',
   '{"frame_color":"negro-brillo","model_code":"SBLK OPTICAL"}'::jsonb,
   8249000, 3, true, 1, 'MLA2191886987', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-blica-receta'), '958601',
   '{"frame_color":"caramelo-transparente-patillas-rosa-palido","model_code":"SAND-0292 OPTICAL"}'::jsonb,
   8249000, 3, true, 2, 'MLA4075804040', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Primaria = perfil del SBLK. medidas.jpg SIEMPRE última (sort 99) y con variant_id NULL.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-blica-receta'), (SELECT id FROM public.product_variants WHERE sku='968605'),
   'rusty-blica-receta/perfil-sblk.jpg', 'Anteojos de receta Rusty Blica redondos de G-Flex, vista lateral, negro brillo con lentes de demostración', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-blica-receta'), (SELECT id FROM public.product_variants WHERE sku='968605'),
   'rusty-blica-receta/frente-sblk.jpg', 'Anteojos de receta Rusty Blica redondos de G-Flex, vista frontal, negro brillo con lentes de demostración', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-blica-receta'), (SELECT id FROM public.product_variants WHERE sku='958601'),
   'rusty-blica-receta/perfil-sand.jpg', 'Anteojos de receta Rusty Blica redondos de G-Flex, vista lateral, frente caramelo transparente con patillas rosa pálido y lentes de demostración', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-blica-receta'), (SELECT id FROM public.product_variants WHERE sku='958601'),
   'rusty-blica-receta/frente-sand.jpg', 'Anteojos de receta Rusty Blica redondos de G-Flex, vista frontal, frente caramelo transparente con patillas rosa pálido y lentes de demostración', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-blica-receta'), NULL,
   'rusty-blica-receta/medidas.jpg', 'Esquema técnico de medidas Rusty Blica: frente 130mm, lente 48mm, alto total 50mm, puente 20mm, varilla 135mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: sólo en Misty receta (el redondo más cercano).
UPDATE public.products
SET description = description || E'\n\nSi te gusta el redondo en G-Flex y de talle chico, mirá los [Rusty Blica Optics](/anteojos-de-receta/rusty/rusty-blica-receta).', updated_at = now()
WHERE slug = 'rusty-misty-receta' AND description NOT LIKE '%rusty-blica-receta%';

COMMIT;
