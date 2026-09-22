-- ============================================
-- Seed 109: Rusty Vriviant SOL — cuadrado femenino, G-Flex, bisagras metálicas flex
-- Fecha: 2026-09-22
-- ============================================
-- ALTA DE PRODUCTO con **1 de sus 2 colorways**. El founder pidió cargar el SBLK mientras publica
-- el otro en ML.
--   ✅ SBLK/S10 POL · SKU 112844 · negro brillo / lente negro pleno · **POLARIZADA** · $78.869,25 ·
--      2 u · **MLA1388018629** (tradicional, `catalog_listing:false`, item simple → var_code NULL).
--   ⬜ MBLK/G. BROWN · SKU 112845 · negro mate / marrón degradé · NO polarizada · **sin publicar**.
--      Placas de ML y descripción entregadas al founder en este turno; falta que publique.
--
-- ⚠️ EL FOUNDER PASÓ EL LINK DE LA PUBLICACIÓN DE **CATÁLOGO** (MLA1388016281, 9 ventas). Se mapea
-- la **tradicional** MLA1388018629, que cuelga del MISMO `user_product_id` (MLAU181022989) y por lo
-- tanto del mismo pozo de 2 unidades. Es la regla que él fijó el 2026-08-31, y la reconoció en el
-- chat apenas se le señaló. **La regla hay que aplicarla aunque el link lo mande él**: desde la UI
-- de ML las dos publicaciones se ven iguales y no hay forma de distinguirlas sin mirar la API.
--
-- 🔺 FORMA `cuadrado` CONTRA ML — **SEXTA VEZ SEGUIDA QUE LA DECLARA MAL**. ML dice "Redondo" en
-- `FRAME_SHAPE` y en `DESIGN`. Resuelto con el método de siempre, bajando primarias del catálogo:
--   • **Zion** (`redondo`): círculo puro, ni un lado recto.
--   • **Biller** (`hexagonal`): seis lados rectos bien marcados.
--   • **Katleen** (`cuadrado`): cuadrado de esquinas redondeadas.
-- El Vriviant tiene lado superior plano, laterales angulados y base redondeada → familia Katleen.
-- ✅ **Y las medidas del founder lo confirman por una vía independiente: calibre 50 con alto 50, casi
-- 1:1.** Un redondo tiene esa proporción pero sin lados rectos; un ovalado es netamente más ancho.
-- Racha de ML: Zion/Ardigan/Dunsert "Ovalada", Bad Card "Rectangular", Harry "Cuadrado", Vriviant
-- "Redondo" — **las seis fueron formas geométricas suaves o de doble puente**.
--
-- 📏 MEDIDAS: 138 / 50 x 50 / 17 / 145 mm — founder, 2026-09-22 (regla dura 7).
-- Geometría: 50x2 + 17 = 117 ≤ 138 ✓. **138 mm de frente es de los más angostos del catálogo**, y
-- eso sí se dice en la ficha: es información de calce, no un superlativo de marketing.
-- ⚠️ ML declaraba `LENS_WIDTH 14 cm` = 140 mm: **es el ancho del FRENTE cargado en el campo del
-- calibre**. Sus otros dos (alto 5 cm, puente 1.7 cm) coinciden con lo medido. Confirma el matiz del
-- Harry: ML yerra la FORMA y a veces el CAMPO, pero los números suelen venir del grabado.
--
-- 👤 GÉNERO `female` — lo define el founder ("Diseño Femenino/mujer"). ML declara "Sin género" pero
-- su propio título dice "Mujer". Caso inverso al Harry, donde ML decía "Hombre" y se respetó: la
-- fuente que manda es el founder, no el campo de ML.
--
-- 🔩 BISAGRAS METÁLICAS CON FLEX — dato del founder. El flex se atribuye SIEMPRE a la BISAGRA:
-- **G-Flex es el nombre del material y no autoriza a decir que el armazón sea flexible**.
--
-- ⚖️ SIN PESO. Ni ML ni el fabricante lo declaran. `weight_grams` AUSENTE del jsonb, y **ningún
-- comparativo de peso** — se corrigieron 10 fichas por eso el 2026-08-31.
--
-- ⚠️ POLARIZADO 1 DE 2 (cuando entre el MBLK): hoy la única variante cargada ES la polarizada, así
-- que `lens_treatment` lleva `["uv400","polarized"]` y el title lo afirma legítimamente.
-- 🔻 **CUANDO SE CARGUE EL MBLK HAY QUE REVISAR ESTO**: pasa a ser 1 de 2 y, por el criterio del
-- proyecto (Rew 1/2, Dunsert 1/3), **"Polarizados" tiene que salir del title y del `lens_treatment`
-- del producto**, quedando sólo como flag de la variante. Es el mismo movimiento que hizo falta en
-- el Bruice al pasar de 4 a 5 colores. Queda anotado para no olvidarlo.
--
-- 🎯 SEO — BRANDED, Y EL MOTIVO ES UNA COLISIÓN DE CUATRO QUE YA EXISTE.
-- El Vriviant es un sol CUADRADO FEMENINO, y ese carril está roto de antes: hay **4 productos** en
-- esa combinación y **3 dicen literalmente "Cuadrados Mujer" en el meta_title**:
--   `rusty-dearly`  → "Rusty Dearly Anteojos de Sol Cuadrados Femeninos | Óptica Carballo"
--   `rusty-dileri`  → "Rusty Dileri Anteojos de Sol Cuadrados Mujer | Carballo"
--   `rusty-vorez`   → "Rusty Vorez Anteojos de Sol Cuadrados Mujer G-Flex | Óptica Carballo"
--   `vulk-katleen`  → "Vulk Katleen Anteojos de Sol Cuadrados Mujer | Carballo"
-- Es **peor que las dos colisiones ya anotadas en BACKLOG** (Blinded↔Zion, The Sil↔Zinz), que son de
-- a dos. Sumar el Vriviant sería el quinto. Va **branded**, con "Polarizados" como diferenciador
-- real (ninguno de los otros cuatro lo lleva en el title). La colisión de los 4 queda en BACKLOG.
-- Title: `Lentes de Sol Rusty Vriviant Polarizados Mujer | Carballo` (57). Arranca con "Lentes" y
-- no "Anteojos": los cuatro colisionados arrancan con "Anteojos" o con la marca.
--
-- 📸 FOTOS del fabricante (`rustyoptical.com/sunglasses/ss22/vriviant`). La página sirve sólo el
-- color por defecto; las rutas salen del HTML. ⚠️ **Los nombres del SBLK llevan un punto de más**
-- (`VRIVIANT_SBLK_S10_POL.-frente.jpg`); sin ese punto da 404. Sumado al Bruice —donde el perfil
-- existía sólo con la `p` minúscula— el patrón es que **los nombres del fabricante son
-- inconsistentes y hay que probar variantes antes de dar una foto por inexistente**.
--
-- `is_featured` NO: 2 unidades de un solo color.
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-vriviant', 'Rusty Vriviant',
  'Lentes de sol Rusty Vriviant: diseño femenino cuadrado de esquinas redondeadas, con frente y patillas de G-Flex, bisagras metálicas con sistema flex y lente polarizada de policarbonato UV400.',
  E'Los **Rusty Vriviant** son **lentes de sol de diseño femenino**, con un frente **cuadrado de esquinas redondeadas**, frente y patillas de **G-Flex** y **bisagras metálicas con sistema flex**.\n\nLa lente es de **policarbonato**, con **100% de protección UV (UV400) y categoría 3**.\n\nMedidas: frente 138 mm · lente 50 mm de ancho · alto total 50 mm · puente 17 mm · varilla 145 mm.\n\nCon 138 mm de frente es un anteojo **de medida contenida**, de los más angostos del catálogo. Si usás un anteojo grande y te queda flojo en las sienes, éste va para el otro lado.\n\nPor ahora disponible en **negro brillo con lente negro pleno, polarizada**.\n\nEl filtro **polarizado** corta el reflejo del asfalto, del agua y de la nieve: es el que resuelve el encandilamiento cuando manejás de día o estás cerca del agua. No es lo mismo que la protección UV, que la tienen todos los anteojos de sol del catálogo.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "cuadrado",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400", "polarized"],
    "lens_category": 3,
    "gender": "female",
    "measurements": {"frame_width_mm": 138, "lens_width_mm": 50, "lens_height_mm": 50, "bridge_mm": 17, "temple_length_mm": 145},
    "hinge_system": "flex",
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-10-22",
    "callouts": [
      {"type": "info", "position": "top", "title": "Diseño femenino de G-Flex, frente de 138 mm", "body": "Frente y patillas de G-Flex, con bisagras metálicas de sistema flex. El frente cuadrado tiene las esquinas redondeadas y mide 138 mm, de los más angostos del catálogo: es un anteojo de medida contenida."},
      {"type": "tip", "position": "middle", "title": "Qué hace el polarizado y qué no", "body": "El filtro polarizado corta el reflejo del asfalto, del agua y de la nieve, que es lo que te encandila manejando de día o cerca del agua. La protección UV es otra cosa y la tienen todos los anteojos de sol del catálogo: el polarizado es un filtro extra."},
      {"type": "recommendation", "position": "bottom", "title": "Policarbonato UV400 categoría 3", "body": "Lente de policarbonato con 100% de protección UVA y UVB, categoría 3, pensada para sol fuerte. Categoría 3 no sirve para manejar de noche. Si dudás con el talle, escribinos por WhatsApp: con 138 mm de frente es un anteojo angosto."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1388018629"], "imported_at": "2026-09-22"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Rusty Vriviant Polarizados Mujer | Carballo',
  'Lentes de sol Rusty Vriviant: diseño femenino de G-Flex, bisagras metálicas flex y policarbonato UV400 categoría 3 con lente polarizada. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Item SIMPLE → `mercadolibre_variation_code` NULL. `"polarized": true` explícito: el `model_code`
-- "SBLK/S10" NO contiene "POL", así que el regex `\bPOL\b` de `isPolarizedVariant` no lo salvaría.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-vriviant'), '112844',
   '{"frame_color":"negro-brillo","lens_color":"negro","model_code":"SBLK/S10","polarized":true}'::jsonb,
   7886925, 2, true, 1, 'MLA1388018629', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-vriviant'), (SELECT id FROM public.product_variants WHERE sku='112844'),
   'rusty-vriviant/perfil-sblk.jpg', 'Lentes de sol Rusty Vriviant femeninos cuadrados vista lateral, armazón negro brillo con lente negro pleno polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-vriviant'), (SELECT id FROM public.product_variants WHERE sku='112844'),
   'rusty-vriviant/frente-sblk.jpg', 'Lentes de sol Rusty Vriviant femeninos cuadrados vista frontal, armazón negro brillo con lente negro pleno polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-vriviant'), NULL,
   'rusty-vriviant/medidas-sblk.jpg', 'Esquema técnico de medidas Rusty Vriviant: frente 138mm, lente 50mm de ancho, alto total 50mm, puente 17mm, varilla 145mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
