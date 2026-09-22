-- ============================================
-- Seed 112: Rusty EYSY SOL — ovalado unisex, frente metal dorado, patillas acetato violeta
-- Fecha: 2026-09-22
-- ============================================
-- ALTA DE PRODUCTO NUEVO, primera colorway: C2 · SKU 103431.
-- MLA2116068851 · $100.823 · 3 u · tradicional (`catalog_listing:false`, item simple, 0
-- variaciones → `mercadolibre_variation_code` NULL). `user_product_id` MLAU5276497052, coincide
-- con el link que pasó el founder.
--
-- ⚠️ NO se insertó nada hasta tener esta publicación real. El fabricante genera 6 colorways
-- (C1..C6) pero el founder sólo pidió C2. A diferencia de Bruice/Vriviant/The Take (variante nueva
-- de un producto que YA tenía otra oferta viva), acá el producto entero no existía todavía: no hay
-- forma honesta de cargar `products` sin una fila de `product_variants` con precio/stock real
-- detrás (regla dura 1, nada de disponibilidad ficticia). Ver LEARNINGS.md 2026-09-22 ("El flujo
-- invertido tiene un límite").
--
-- 🔩 MATERIAL DEL FRENTE — CONFLICTO CON EL BOILERPLATE DEL FABRICANTE, RESUELTO Y CONFIRMADO DOS
-- VECES. La ficha de rustyoptical.com trae el texto genérico "Frente: Armazón de acetato" para TODO
-- el modelo EYSY. El founder describió el frente como "Dorado metálico" desde el pedido inicial, la
-- foto oficial de la colorway C2 muestra un aro fino consistente con metal, y al señalársele la
-- discrepancia con el boilerplate el founder la confirmó explícito: "El frente es metálico, las
-- patillas son de acetato" (2026-09-22). **Y la propia publicación de ML lo certifica de forma
-- independiente**: `FRAME_MATERIAL=Metal`, `TEMPLE_MATERIAL=Acetato` — tres fuentes coincidiendo
-- (founder, foto, ficha técnica de ML) contra un solo texto de marketing genérico del fabricante que
-- se descarta. `frame_material: metal`, `temple_material: acetate`.
--
-- 📏 MEDIDAS: 46-16-145, ancho total 134mm, alto total 41mm, peso 28,3g — founder, 2026-09-22.
-- Geometría: 46x2 + 16 = 108 ≤ 134 ✓. **Contraverificadas 1:1 contra la ficha técnica de ML**
-- (`BRIDGE_LENGTH=1.6cm`, `LENS_HEIGHT=4.1cm`, `LENS_WIDTH=4.6cm`, `TEMPLE_LENGTH=14.5cm`): las
-- cuatro coinciden exactas con lo que pasó el founder. `WITH_POLARIZED_LENS=No` y
-- `WITH_UV_PROTECTION=Sí` también confirman lo ya cargado. Sin conflicto en esta carga.
--
-- 🎨 FORMA `ovalado` — sin ambigüedad esta vez (a diferencia de Zion/Ardigan/Dunsert/Vriviant, que
-- ML declaraba mal): la propia ficha de ML también dice `FRAME_SHAPE=Ovalado`, coincide con lo
-- visto en la foto (aro ancho y redondeado, sin pico cat-eye) y con la medida (46x41, más ancho que
-- alto). Primera vez en varias cargas que las tres fuentes (founder, foto, ML) alinean solas.
--
-- 👤 GÉNERO `unisex` — sin señal explícita del founder esta vez. Se usó el precedente de Rusty
-- Dunsert (unisex es "estrictamente dominante" para SEO: entra a `/mujer` Y `/hombre` vía
-- `fetchCategoryByGender`/`fetchBrandPageByGender`), confirmado por `seo-strategist`, y la propia
-- publicación de ML lo certifica: `GENDER=Sin género`. La PDP no reclama género.
--
-- ⚖️ SIN POLARIZADO NI ANTIRREFLEX. El founder nunca mencionó ninguno de los dos; ML lo confirma
-- explícito (`WITH_POLARIZED_LENS=No`, y `LENS_TREATMENT="UV400 / Degrade"` sin mención de AR).
-- `lens_treatment: ["uv400"]` únicamente, sin "polarized" ni "antirreflejo". No entra a
-- `/anteojos-de-sol/polarizados` ni a `/anteojos-de-sol/rusty/polarizados`, y así corresponde.
--
-- 🎯 SEO — `seo-strategist`: slug `rusty-eysy` (sin colisión). Primaria de forma
-- `anteojos de sol ovalados` (70/36): el carril `lentes de sol ovalados` (140/13) ya lo tiene Vulk
-- Nova, único otro ovalado del catálogo (split lentes/anteojos, mismo criterio que The Take↔Yeah,
-- Dunsert↔Le Groupie). Cero colisión real con Nova: marca distinta, keyword distinta, género
-- distinto (Nova es female explícito) y honestidad de lente distinta (Nova SÍ polariza 3/3, EYSY
-- no). Title: `Anteojos de Sol Rusty EYSY Ovalados | Óptica Carballo` (53c). H1 = `name` = `Rusty
-- EYSY`, el peso SEO lo carga el `meta_title`, no el H1 (regla del repo, confirmada en Bruice/The
-- Take/Yeah). Cross-link manual sugerido con Vulk Nova (únicos dos ovalados del catálogo).
-- Pendiente en BACKLOG, no bloqueante: evaluar facetar `/anteojos-de-sol/ovalados` si se suman más.
--
-- 🖼️ PLACAS: generadas con `pnpm placas --sin-vision`, callouts a mano (sin usar los defaults). Se
-- reemplazó el ítem 3 por defecto de la placa de garantía ("Apto para adaptar lentes graduadas")
-- por uno verificado: no está confirmado para este modelo de sol, misma trampa ya documentada con
-- el Bruice de sol.
--
-- `is_featured` NO: producto recién cargado, 3 unidades de un solo color.
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-eysy', 'Rusty EYSY',
  'Anteojos de sol Rusty EYSY: armazón metálico dorado, forma ovalada, con patillas de acetato en tono violeta y bisagras metálicas con flex. Lente de policarbonato degradé gris oscuro con 100% protección UV (UV400).',
  E'Los **Rusty EYSY** son **anteojos de sol ovalados unisex**, con frente de **metal** en tono dorado y **patillas de acetato** en tono violeta. Las bisagras son **metálicas, con sistema flex**.\n\nLa lente es de **policarbonato**, con **100% de protección UV (UV400) y categoría 3**.\n\nMedidas: lente 46 mm de ancho · puente 16 mm · varilla 145 mm · ancho total del frente 134 mm · alto total 41 mm. Peso: 28,3 g.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "metal",
    "temple_material": "acetate",
    "frame_shape": "ovalado",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "weight_grams": 28.3,
    "measurements": {"frame_width_mm": 134, "lens_width_mm": 46, "lens_height_mm": 41, "bridge_mm": 16, "temple_length_mm": 145},
    "hinge_system": "flex",
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-10-22",
    "callouts": [
      {"type": "info", "position": "top", "title": "Ovalado unisex, metal y acetato", "body": "Diseño ovalado unisex, con frente de metal en tono dorado y patillas de acetato en tono violeta. Bisagras metálicas con sistema flex."},
      {"type": "tip", "position": "middle", "title": "Lente de policarbonato UV400", "body": "Lente degradé gris oscuro que bloquea el 100% de la radiación UVA y UVB, categoría 3, pensada para sol fuerte."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con el calce o el color?", "body": "Escribinos por WhatsApp y te asesoramos con un técnico óptico matriculado antes de comprar."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2116068851"], "imported_at": "2026-09-22"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Rusty EYSY Ovalados | Óptica Carballo',
  'Anteojos de sol Rusty EYSY: armazón metálico dorado, patillas de acetato violeta, lente degradé UV400. Envío a todo el país y asesoramiento de técnico óptico.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Item simple, 0 variaciones → `mercadolibre_variation_code` NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-eysy'), '103431',
   '{"frame_color":"dorado","temple_color":"violeta","lens_color":"gris-oscuro-degrade","model_code":"C2","polarized":false}'::jsonb,
   10082300, 3, true, 1, 'MLA2116068851', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 3 imágenes: perfil (primaria) + frente + medidas. Subidas con `pnpm fotos:subir`, verificadas
-- con HEAD antes de referenciarlas acá (`subir-fotos-producto.ts`).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-eysy'), (SELECT id FROM public.product_variants WHERE sku='103431'),
   'rusty-eysy/perfil-c2.jpg', 'Anteojos de sol Rusty EYSY ovalados unisex vista lateral, armazón metálico dorado con patillas de acetato violeta y lente gris oscuro degradé', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-eysy'), (SELECT id FROM public.product_variants WHERE sku='103431'),
   'rusty-eysy/frente-c2.jpg', 'Anteojos de sol Rusty EYSY ovalados unisex vista frontal, armazón metálico dorado con patillas de acetato violeta y lente gris oscuro degradé', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-eysy'), NULL,
   'rusty-eysy/medidas-c2.jpg', 'Esquema técnico de medidas Rusty EYSY: frente 134mm, lente 46mm de ancho, alto total 41mm, puente 16mm, varilla 145mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
