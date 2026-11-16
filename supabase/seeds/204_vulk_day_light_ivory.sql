-- ============================================
-- Seed 204: Vulk DAY LIGHT IVORY/BP2021 (variante nueva, NO polarizada) sobre el producto existente `vulk-day-light`
-- Fecha: 2026-11-17
-- ============================================
-- PUBLICACIÓN TRADICIONAL de ML (MLA417128), item SIMPLE (0 variaciones => `variation_code` NULL), verificada por API el 2026-11-17 (la creó el founder, APARTE de la publicación con variaciones MLA2726903920 que reúne las 4 polarizadas):
--   194188  IVORY/BP2021  MLA4205710626  $98.367  stock 3  armazón beige brillo, lente marrón degradé a rojizo, sin polarizar, sin antirreflex
-- DATOS DEL FOUNDER (2026-11-17): no polarizada (confirmado dos veces), sin antirreflex, categoría 3 (confirmada); "por los colores es más de mujer": en ML el género es Mujer, en la web el producto sigue unisex y la ficha lo aclara en la línea de la IVORY. (La ficha de Vulk dice "Polarizadas"; se sigue lo del founder, que tiene el producto en mano.)
--   Medidas del producto sin cambios (51-20-140, altura 31, ancho 140; 26,1 g).
-- 🔬 Sin "liviano" ni "flexible" en el texto nuevo (el viejo los decía: se sacaron); "polarizado" sólo en las 4 versiones polarizadas.
-- 🎯 SEO (seo-strategist + CSV): "Polarizados" se mantiene en el title (4 de 5 variantes) y la aclaración de la no polarizada va en meta/short/description; "rectangulares" (320/12) suma al title. catalog-loader: `isPolarizedVariant` lee sólo la variante → `polarized:false` basta; el `polarized` del PRODUCTO (lens_treatment) lo leen chips, ficha, subtítulo de la PDP, comparar y el filtro de /vulk/polarizados → se saca del producto (patrón The Phone: lens_treatment ["uv400"] + has_polarized_variant:true). Costo asumido: Day Light deja de salir en /anteojos-de-sol/vulk/polarizados (sigue en /anteojos-de-sol/polarizados, que filtra por variante).
-- 🧩 Se completan datos que el producto no tenía (los de la publicación de ML de las polarizadas y la regla de sol): lens_material policarbonato, lens_category 3, includes estuche+franela, warranty_months 12.
-- ⚠️ La variante usa `reference_code` (como sus hermanas) y SIN "POL" en el código.
-- 📸 `pnpm fotos:subir --slug vulk-day-light-sol --sufijo -ivory`. La primaria de las otras variantes no se toca; `is_primary` va por variante, como las hermanas.
-- ============================================

BEGIN;

UPDATE public.products SET
  short_description = 'Anteojos de sol Vulk Day Light, rectangular pequeño unisex en G-Flex. Cuatro colores con lente polarizado y uno beige brillo con lente marrón degradé a rojizo, sin polarizar.',
  description = E'Los lentes de sol **Vulk Day Light** son un **rectangular pequeño** pensado para quien busca un anteojo discreto, prolijo y con buen agarre al rostro. Diseño unisex, líneas limpias y un peso de 26,1 gramos.\n\nEl armazón está hecho en **G-Flex**, el termoplástico de Vulk, resistente a torsiones y a los apretones del bolsillo, con **bisagras plásticas reforzadas** que aguantan el uso diario. Funciona tanto para manejar como para caminar la ciudad o moverte al aire libre.\n\nLas lentes son de **policarbonato**, con protección **UV400** (bloquean los rayos UVA y UVB) y **categoría 3**.\n\nDisponible en 5 versiones:\n\n• SDEMI/DRWG15C3 (SKU 194185): carey brillo con lente verde, **polarizada**.\n• L.PINK/DRT-25 (SKU 194180): rosa pálido con caramelo y lente gris oscuro degradé, **polarizada**.\n• MBLK/DRT04 (SKU 194182): negro mate con lente verde degradé, **polarizada**.\n• L.BROWN/DRLB14 (SKU 194187): marrón con lente marrón, **polarizada**.\n• IVORY/BP2021 (SKU 194188): beige brillo con lente marrón degradé a rojizo, **no polarizada**, categoría 3. Por sus colores, es la versión más pensada para mujer.\n\n**Cuatro de las cinco versiones son polarizadas.** Las lentes polarizadas cortan los reflejos del asfalto, el agua y los vidrios. Tené en cuenta una cosa: como toda lente polarizada, las pantallas LCD del tablero del auto, GPS o cajeros pueden verse oscurecidas o con efecto arcoíris según el ángulo. Es propio del polarizado, no un defecto. La IVORY/BP2021 no es polarizada: tiene protección UV400 y lente degradé.\n\nIncluye estuche original de Vulk y franela, y garantía de 1 año contra defectos de fabricación. Stock real en Óptica Carballo, con asesoramiento técnico matriculado.',
  meta_title = 'Lentes de Sol Vulk Day Light | Polarizados y Rectangulares',
  meta_description = 'Lentes de sol Vulk Day Light rectangulares en G-Flex: 4 colores con lente polarizado y 1 beige con degradé marrón sin polarizar. Envíos a todo el país.',
  attributes = attributes || jsonb_build_object(
    'lens_treatment', '["uv400"]'::jsonb,
    'has_polarized_variant', true,
    'lens_material', 'policarbonato',
    'lens_category', 3,
    'includes', '["estuche","franela"]'::jsonb,
    'warranty_months', 12,
    'callouts', '[
      {"type": "info", "position": "top", "title": "Sabías que…", "body": "Cuatro de las cinco versiones tienen lente polarizada: un filtro que funciona como una rejilla microscópica. Bloquea la luz horizontal de los reflejos en agua, asfalto mojado y vidrios, dejando pasar el resto. Por eso ves los colores con más contraste. Es física pura, no marketing."},
      {"type": "recommendation", "position": "middle", "title": "Recomendación", "body": "Las polarizadas son ideales para manejar de día, playa, montaña, pesca o cualquier exterior con reflejos. No las uses para manejar de noche: al filtrar luz polarizada, ves menos en ambientes oscuros. La IVORY/BP2021 no es polarizada: tiene UV400 y lente degradé, para el uso de todos los días."},
      {"type": "tip", "position": "bottom", "title": "Para que no se rayen las lentes", "body": "Usá siempre la franela de microfibra que viene con tus anteojos (la remera o un papel rayan el cristal). Lavalos con agua tibia y jabón neutro. Y nunca los dejes en la guantera del auto al sol: el calor deforma el G-Flex con el tiempo."}
    ]'::jsonb
  ),
  updated_at = now()
WHERE slug = 'vulk-day-light';

-- Variante nueva, item simple de ML (variation_code NULL). Precio y stock de ML (2026-11-17).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-day-light'), '194188',
   '{"frame_color":"beige-brillo","lens_color":"marron-rojizo-degrade","reference_code":"IVORY/BP2021","polarized":false,"lens_treatment":["gradient"]}'::jsonb,
   9836700, 3, true,
   (SELECT COALESCE(MAX(sort_order),0)+1 FROM public.product_variants WHERE product_id=(SELECT id FROM public.products WHERE slug='vulk-day-light')),
   'MLA4205710626', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Fotos: perfil (primaria de su variante, como las hermanas) + frente. La foto de medidas existente se conserva.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-day-light'), (SELECT id FROM public.product_variants WHERE sku='194188'),
   'vulk-day-light-sol/perfil-ivory.jpg', 'Lentes de sol Vulk Day Light rectangulares, vista lateral, armazón beige brillo con lente marrón degradé a rojizo', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-day-light'), (SELECT id FROM public.product_variants WHERE sku='194188'),
   'vulk-day-light-sol/frente-ivory.jpg', 'Lentes de sol Vulk Day Light rectangulares, vista frontal, armazón beige brillo con lente marrón degradé a rojizo', 2000, 1333, 1, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
