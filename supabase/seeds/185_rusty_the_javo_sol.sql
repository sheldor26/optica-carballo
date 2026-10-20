-- ============================================
-- Seed 185: Rusty The Javo SOL (envolvente unisex, marrón brillo), G-Flex, 1 variante, NO polarizado
-- Fecha: 2026-10-20
-- ============================================
-- PUBLICADO EN ML por el founder el 2026-10-20 y verificado por API: MLA2217343809 (tradicional, `catalog_listing:false`, MLA417128, gold_pro), ACTIVA, $90.890, stock 3, item SIMPLE (0 variaciones => `variation_code` NULL), SELLER_SKU 10025.
--    ML armó el título: "Anteojos Lentes De Sol Rusty The Javo Envolvente Marron Moda Sbh/ch74 - Marron Brillo Con Lentes Marrones" (el "SBH/CH74" entró porque el atributo COLOR DE LA LENTE se cargó con ese texto). Precio y stock salen de ML (se sincronizan solos).
-- CONFIRMADO por el founder (2026-10-20): antirreflex SOLO en la cara interna; el 55 es la medida oficial de Rusty; lente marrón pleno (sin degradé); color comercial = "marrón brillo" (el código SBH del fabricante no le dice nada al comprador).
--
-- DATOS DEL FOUNDER (2026-10-20): variante `SBH/CH74`, SKU `10025`. Envolvente, armazón marrón brillo (traslúcido), lentes marrones con antirreflex en la CARA INTERNA, NO polarizado; bisagras de
--   plástico reforzadas; G-Flex; categoría 3; UV400 (UVB y UVA); unisex; lente de policarbonato base 8; medidas 55-12-140, alto total 45, ancho total 138; "por la curvatura del armazón es difícil adaptar
--   lentes graduadas, por lo tanto no hacer referencia" => NINGUNA mención a graduación (ni callout, ni "no admite"): distinto del Exile, que sí lo aclara.
-- 🔬 optical-expert (2026-10-20): UV400 = "100% UVA y UVB a través de la lente"; cat 3 = sol fuerte, sirve de día y no de noche; marrón = tono cálido con buen contraste con cielo/agua/vegetación (sin "colores reales/naturales/nítido");
--    antirreflex = "reduce los reflejos que rebotan desde atrás hacia tus ojos" y dejar explícito que NO es polarizado; base 8 sólo en ficha/callout; G-Flex NO es "flexible"/"irrompible"; sin "liviano" (no hay peso).
-- 🎯 SEO (seo-strategist, 2026-10-20): name `Rusty The Javo`, slug `rusty-the-javo`, title A (55) con la keyword libre `lentes de sol marrones` (110 / diff 11; el Javo es el único Rusty envolvente marrón), meta (152);
--    NO "polarizados" en title/H1/meta, NO "deportivos" en title/H1 (es de And Now); links a Exile/Esvep/And Now + hub; frase de vuelta sólo en Exile (UPDATE abajo); alt text por foto.
-- 📸 FOTOS: modelo descatalogado, sin fotos de la marca: RECREADAS con agy a partir de 5 fotos del founder (frente v2 + perfil v4, logo de la patilla con los píxeles reales de su foto) y pasadas por `pnpm placas --tipo sol`
--    (`marketing/placas-ml/rusty-the-javo/web/`), subidas con `pnpm fotos:subir`. Es una recreación, no una foto del producto: el founder las compara contra el armazón real.
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-the-javo', 'Rusty The Javo',
  'Lentes de sol Rusty The Javo: envolventes unisex, armazón marrón brillo de G-Flex con bisagras de plástico reforzadas. Lente marrón de policarbonato UV400, categoría 3, con antirreflex en la cara interna (no polarizado).',
  E'Los **Rusty The Javo** son **lentes de sol marrones, envolventes y unisex**, con armazón **marrón brillo** de **G-Flex** y **bisagras de plástico reforzadas**. El diseño envolvente curva hacia las sienes y cubre más del costado que un armazón plano.\n\nLas lentes son de **policarbonato marrón pleno (sin degradé)**, con curva envolvente (base 8), **100% de protección UVA y UVB a través de la lente (UV400)** y **categoría 3**, pensada para días de mucha luz: sirven para manejar de día, no de noche. El marrón es un tono cálido que suele dar buen contraste con el cielo, el agua y la vegetación, y tiñe levemente los colores hacia lo cálido. **No son polarizadas**: tienen **antirreflex en la cara interna**, que reduce los reflejos que rebotan desde atrás hacia tus ojos.\n\nPensados para ciclismo, running, pesca, playa o ruta.\n\nMedidas: frente 138 mm · lente 55 mm · puente 12 mm · varilla 140 mm · alto total 45 mm.\n\nDisponible en **marrón brillo**.\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi te gusta el estilo envolvente, mirá también los [Rusty Exile](/anteojos-de-sol/rusty/rusty-exile), los [Rusty Esvep](/anteojos-de-sol/rusty/rusty-esvep) y los [Rusty And Now](/anteojos-de-sol/rusty/rusty-and-now). También podés ver [todos los anteojos de sol Rusty](/anteojos-de-sol/rusty) y [los deportivos](/anteojos-de-sol/deportivos).',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "envolvente",
    "hinge_system": "plastica",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "measurements": {"frame_width_mm": 138, "lens_width_mm": 55, "lens_height_mm": 45, "bridge_mm": 12, "temple_length_mm": 140},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "hide_prescription_faq": true,
    "new_until": "2026-11-20",
    "callouts": [
      {"type": "info", "position": "top", "title": "Envolvente unisex, en marrón brillo", "body": "Armazón de G-Flex con bisagras de plástico reforzadas. Diseño envolvente que cubre más del costado que un armazón plano. Lente marrón pleno de policarbonato con curva envolvente (base 8)."},
      {"type": "tip", "position": "middle", "title": "UV400, categoría 3 y antirreflex", "body": "100% de protección UVA y UVB a través de la lente, categoría 3 para sol fuerte (sirve para manejar de día, no de noche). No son polarizadas: el antirreflex de la cara interna reduce los reflejos que rebotan desde atrás hacia tus ojos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2217343809"], "imported_at": "2026-10-20"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Marrones Rusty The Javo | Óptica Carballo',
  'Lentes de sol Rusty The Javo marrones: envolventes unisex de G-Flex, lente marrón con antirreflex, UV400 y categoría 3. Envío a todo el país y garantía.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 1 variante, item simple de ML (variation_code NULL). Precio y stock de ML (2026-10-20).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-the-javo'), '10025',
   '{"frame_color":"marron-brillo","lens_color":"marron","model_code":"SBH/CH74","polarized":false}'::jsonb,
   9089000, 3, true, 1, 'MLA2217343809', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Fotos: perfil primaria, frente, medidas SIEMPRE última (sort 99, variant_id NULL).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-the-javo'), (SELECT id FROM public.product_variants WHERE sku='10025'),
   'rusty-the-javo/perfil.jpg', 'Anteojos de sol Rusty The Javo envolventes, vista lateral, armazón marrón brillo traslúcido con lente marrón', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-the-javo'), (SELECT id FROM public.product_variants WHERE sku='10025'),
   'rusty-the-javo/frente.jpg', 'Anteojos de sol Rusty The Javo envolventes, vista frontal, armazón marrón brillo con lente marrón', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-the-javo'), NULL,
   'rusty-the-javo/medidas.jpg', 'Esquema técnico de medidas Rusty The Javo: frente 138mm, lente 55mm, puente 12mm, varilla 140mm, alto total 45mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: sólo en Exile (el gemelo más cercano y recién cargado).
UPDATE public.products
SET description = description || E'\n\nSi te gusta el estilo envolvente pero en marrón, mirá los [Rusty The Javo](/anteojos-de-sol/rusty/rusty-the-javo).', updated_at = now()
WHERE slug = 'rusty-exile' AND description NOT LIKE '%rusty-the-javo%';

COMMIT;
