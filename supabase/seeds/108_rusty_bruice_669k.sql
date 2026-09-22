-- ============================================
-- Seed 108: Rusty Bruice — 5ta variante 669K/UV-N40 (gris transparente / celeste degradé)
-- Fecha: 2026-09-22
-- ============================================
-- NO es un producto nuevo: suma una variante al `rusty-bruice` que ya estaba cargado con 4.
-- SKU **968191** · armazón gris transparente · lente celeste degradé · **NO polarizada** ·
-- $84.354 · 3 unidades · MLA3981448012 (`catalog_listing: false`, item SIMPLE → var_code NULL).
--
-- 🆕 LA PUBLICACIÓN DE ML NO EXISTÍA: la creó el founder en este mismo turno, con las placas que se
-- generaron acá. Es el primer caso del proyecto en que el sitio va PRIMERO y ML después; en todas
-- las cargas anteriores ML ya existía y era la fuente. Por eso hubo que pedirle stock y precio en
-- vez de leerlos, y esperar a que publicara para poder mapear.
-- ✅ Verificado post-publicación: `catalog_listing: false` (regla del founder 2026-08-31),
-- `WITH_POLARIZED_LENS: No`, `FRAME_SHAPE: Aviador` — **ML acertó la forma esta vez**, a diferencia
-- de las 5 seguidas que erró (Zion, Ardigan, Dunsert, Bad Card, Harry). Y sus medidas declaradas
-- (5.6 / 5.4 / 1.8 cm) coinciden con las que el founder ya había medido para el modelo.
--
-- 📸 FOTOS del fabricante (`rustyoptical.com/sunglasses/ss24/bruice`). La página sólo sirve el color
-- por defecto; las otras salen del patrón de rutas del HTML
-- (`productos/ss24/bruice/669k-uv-n40-sku-968191/`). ⚠️ **El perfil existe SÓLO con la `p`
-- minúscula** (`BRUICE_669_k_-_perfil.jpg`); con mayúscula da 404. Verificadas abriéndolas.
-- ⚠️ Se subió de más una `medidas-669k.jpg` — el producto YA tenía `medidas-18mm.jpg` en sort 99.
-- Se borró del bucket antes de referenciarla: una placa de medidas es del MODELO, no de la variante.
--
-- ⚠️⚠️ EL HALLAZGO DEL TURNO, Y NO ES DE ESTA VARIANTE: **la plantilla de `pnpm placas` reinyecta el
-- claim de peso que se limpió de 10 fichas el 2026-08-31.** El set por defecto salió con
-- "ARMAZÓN LIVIANO" y "Armazón liviano y cómodo", y el Bruice pesa 23 g (puesto 31 de 65). Es peor
-- que el caso original porque el texto queda **quemado en una imagen** que se sube a ML: ninguna
-- query lo encuentra. Se reemplazaron los 4 callouts y los 5 ítems por datos verificados.
-- Además la plantilla afirmaba **"se pueden adaptar lentes graduadas"**, que la ficha del Bruice no
-- dice en ningún lado (el único del catálogo que lo afirma es el Biller): **se sacó la placa 05
-- entera** y quedó preguntado al founder. Entrada en MISTAKES.md y arreglo de fondo en BACKLOG.md.
--
-- ORDEN: los 3 NO polarizados juntos (sort 1-3) y los 2 polarizados después (sort 4-5), para que el
-- salto de precio ($84.354 → $96.251) se lea como UNA decisión. Criterio del Dunsert y el Bad Card.
-- Las dos polarizadas bajaron de sort 3-4 a 4-5, y sus fotos de sort 4-7 a 8-11.
--
-- 📝 SE ACTUALIZÓ EL COPY DEL PRODUCTO, que decía "4 colores" en TRES campos: `description`
-- (la lista de bullets y la línea "2 de los 4 colores" → "2 de los 5"), `short_description` y
-- `meta_description` (157 caracteres, dentro del rango 150-160 de PRODUCT_SCHEMA).
-- Es la lección de método del Gover: **una variante nueva no es sólo una fila**; toca la lista de
-- colores, el conteo de polarizadas y los tres campos de copy que lo mencionan.
--
-- 🏷️ `celeste-degrade` agregado a `LENS_COLOR_LABELS` en `variant-label.ts`.
-- `gris-transparente` ya existía (se había agregado para el Gover).
-- ============================================

BEGIN;

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-bruice'), '968191',
   '{"frame_color":"gris-transparente","lens_color":"celeste-degrade","model_code":"669K/UV-N40","polarized":false}'::jsonb,
   8435400, 3, true, 3, 'MLA3981448012', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- las polarizadas corren al final
UPDATE public.product_variants v SET sort_order=4, updated_at=now()
FROM public.products p WHERE p.id=v.product_id AND p.slug='rusty-bruice' AND v.sku='957005';
UPDATE public.product_variants v SET sort_order=5, updated_at=now()
FROM public.products p WHERE p.id=v.product_id AND p.slug='rusty-bruice' AND v.sku='957004';

UPDATE public.product_images i SET sort_order=8,  updated_at=now() FROM public.products p WHERE p.id=i.product_id AND p.slug='rusty-bruice' AND i.storage_path='rusty-bruice/perfil-sg91.jpg';
UPDATE public.product_images i SET sort_order=9,  updated_at=now() FROM public.products p WHERE p.id=i.product_id AND p.slug='rusty-bruice' AND i.storage_path='rusty-bruice/frente-sg91.jpg';
UPDATE public.product_images i SET sort_order=10, updated_at=now() FROM public.products p WHERE p.id=i.product_id AND p.slug='rusty-bruice' AND i.storage_path='rusty-bruice/perfil-s10.jpg';
UPDATE public.product_images i SET sort_order=11, updated_at=now() FROM public.products p WHERE p.id=i.product_id AND p.slug='rusty-bruice' AND i.storage_path='rusty-bruice/frente-s10.jpg';

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-bruice'), (SELECT id FROM public.product_variants WHERE sku='968191'),
   'rusty-bruice/perfil-669k.jpg', 'Anteojos de sol Rusty Bruice aviador de doble puente unisex vista lateral, armazón gris transparente con lente celeste degradé', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bruice'), (SELECT id FROM public.product_variants WHERE sku='968191'),
   'rusty-bruice/frente-669k.jpg', 'Anteojos de sol Rusty Bruice aviador de doble puente unisex vista frontal, armazón gris transparente con lente celeste degradé', 2000, 1333, 5, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, updated_at=now();

-- copy: de 4 a 5 colores en los tres campos que lo mencionaban
UPDATE public.products SET
  description = replace(replace(replace(description,
    'Disponible en 4 colores:', 'Disponible en 5 colores:'),
    E'• **Carey mate con patillas negras, lente verde degradé** — no polarizada. El verde rinde más parejo en color, y el degradé va de más oscuro arriba a más claro abajo.',
    E'• **Carey mate con patillas negras, lente verde degradé** — no polarizada. El verde rinde más parejo en color, y el degradé va de más oscuro arriba a más claro abajo.\n• **Gris transparente, lente celeste degradé** — no polarizada. El armazón translúcido deja ver a través, así que se apoya menos sobre los rasgos que un negro.'),
    '**Ojo con el filtro polarizado: lo tienen 2 de los 4 colores.** Los cuatro filtran el 100% de la radiación UV',
    '**Ojo con el filtro polarizado: lo tienen 2 de los 5 colores.** Los cinco filtran el 100% de la radiación UV'),
  short_description = 'Anteojos de sol Rusty Bruice: aviador de doble puente unisex, armazón G-Flex de 23 g. Lente de policarbonato con 100% protección UV (UV400, categoría 3). Disponible en 5 colores, 2 de ellos con lente polarizada.',
  meta_description  = 'Anteojos de sol Rusty Bruice: aviador de doble puente en 5 colores, 2 polarizados. Policarbonato UV400 cat. 3 y armazón G-Flex de 23 g. Envío a todo el país.',
  updated_at = now()
WHERE slug = 'rusty-bruice';

COMMIT;
