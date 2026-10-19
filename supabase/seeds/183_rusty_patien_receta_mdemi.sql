-- ============================================
-- Seed 183: Rusty Patien Optics RECETA, 4ª variante MDEMI-MBLK (SKU 126097): frente carey mate con patillas negro mate
-- Fecha: 2026-10-19
-- ============================================
-- Variación nueva de la multivariante de ML `MLA1388467447` (tradicional, categoría MLA417127, $83.078 → 8307800c), agregada por el founder el 2026-10-19 y verificada por API:
--   MDEMI-MBLK OPTICAL  SKU 126097  var `208013521815`  stock 3  "MDEMI-MBLK / Frente Carey Mate - Patillas Negro Mate"
--   (las otras 3 siguen igual: 669K-SBLK 126096 var 179922233291, MBLK 126090 var 179922233289, SBLK 126098 var 204692788223; las variaciones no tienen SELLER_SKU en ML.) Stock y precio mandan desde ML. El item estaba "under_review" en ML tras la edición.
-- Mismas medidas y peso que el resto del Patien (140 / 49x40 / 21 / 145, 23,6 g): no cambian.
-- 🔬 optical-expert (2026-10-19): NO "liviano" (23,6 g está en la mitad del catálogo: se dice "Pesa 23,6 g"; criterio BACKLOG 2026-08-31); alto de lente 40 mm: NO se prometen progresivos/multifocales (hueco estimado 32-36 mm SIN MEDIR) => `lens_compatibility` baja a monofocal y bifocal (como Arms) y el sitio dice "para progresivos o multifocales, consultanos antes"; "carey" sólo como color (es G-Flex); no "para todos los rostros". Si el founder confirma que acepta progresivos (como el Midwest) se vuelve a sumar.
-- 🧹 CORRECCIÓN DE TEXTO DEL PRODUCTO (el texto viejo del seed 66 contradecía las reglas de hoy): "G-Flex flexible / —flexible y resistente—", "liviano (23,6 g)", "blue light", "Armazón + cristales en 7-10 días hábiles", "talle medium", "le cargamos los cristales". Se reescriben short, descripción, meta_description y callouts para 4 colores.
-- ⚠️ Blue Cut: la web de Rusty lo dice para el Patien; el founder no lo confirmó: NO se menciona.
-- 📸 FOTOS: oficiales de Rusty (900×442) pasadas por `pnpm placas --tipo receta` y subidas con `pnpm fotos:subir --sufijo -mdemi`: `rusty-patien-receta/perfil-mdemi.jpg` y `frente-mdemi.jpg` (2000×1333, scale 1.05). El `medidas.webp` sigue siendo la última (sort 99).
-- ============================================

BEGIN;

UPDATE public.products SET
  short_description = 'Anteojos recetados Rusty Patien: armazón wayfarer unisex con frente y patillas de G-Flex y bisagras metálicas con sistema flex (23,6 g). En 4 colores. Viene con lentes de demostración, sin graduación: le sumás los cristales con tu receta.',
  description = E'El **Rusty Patien Optics** es un armazón de receta **wayfarer unisex**, con **frente y patillas de G-Flex** y **bisagras metálicas con sistema flex**: la patilla acompaña el movimiento al abrir y cerrar. Pesa 23,6 g. Es la versión de receta del modelo Patien, que también tenemos [en versión de sol](/anteojos-de-sol/rusty/rusty-patien).\n\nMedidas: frente 140 mm · lente 49 mm de ancho × 40 mm de alto · puente 21 mm · varilla 145 mm. Es un talle mediano.\n\nViene con lentes de demostración, sin graduación. Sumale tus cristales con receta: monofocales o bifocales. Para progresivos o multifocales, consultanos antes: depende del diseño del lente y de la altura de montaje que se pueda lograr con este armazón.\n\nDisponible en 4 colores:\n\n• 669K-SBLK, translúcido con patillas negras.\n• MBLK, negro mate.\n• SBLK, negro brillo.\n• MDEMI-MBLK, frente carey mate con patillas negro mate.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.\n\nTambién podés ver [todos los anteojos de receta Rusty](/anteojos-de-receta/rusty).',
  meta_description = 'Armazón Rusty Patien wayfarer unisex para anteojos recetados. G-Flex, 23,6 g, 4 colores, originales. Envíos a toda la Argentina. Asesoramiento de técnico óptico.',
  attributes = jsonb_set(jsonb_set(jsonb_set(attributes, '{callouts}', '[
    {"type": "info", "position": "top", "title": "Wayfarer unisex de G-Flex", "body": "Frente y patillas de G-Flex, con bisagras metálicas con sistema flex. Forma wayfarer clásica, de talle mediano, para hombre o mujer. Pesa 23,6 g."},
    {"type": "tip", "position": "middle", "title": "Monofocales y bifocales", "body": "Acepta cristales monofocales y bifocales. Para progresivos o multifocales, consultanos antes: depende del diseño del lente y de la altura de montaje. Si tenés dudas con tu receta, escribinos antes de comprar."},
    {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con una foto de tu receta. Te pasamos el costo de los cristales según tu graduación y los tratamientos que quieras (antirreflejo, fotocromático)."}
  ]'::jsonb), '{lens_compatibility}', '["monofocal", "bifocal"]'::jsonb), '{hinge_system}', '"flex"'::jsonb),
  updated_at = now()
WHERE slug = 'rusty-patien-receta';

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-patien-receta'), '126097',
   '{"frame_color":"carey-mate-patillas-negro-mate","model_code":"MDEMI-MBLK OPTICAL"}'::jsonb,
   8307800, 3, true, 4, 'MLA1388467447', '208013521815')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-patien-receta'), (SELECT id FROM public.product_variants WHERE sku='126097'),
   'rusty-patien-receta/perfil-mdemi.jpg', 'Anteojos de receta Rusty Patien wayfarer de G-Flex, vista lateral, frente carey mate con patillas negro mate y lentes de demostración', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-patien-receta'), (SELECT id FROM public.product_variants WHERE sku='126097'),
   'rusty-patien-receta/frente-mdemi.jpg', 'Anteojos de receta Rusty Patien wayfarer de G-Flex, vista frontal, frente carey mate con patillas negro mate y lentes de demostración', 2000, 1333, 7, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
