-- ============================================
-- Seed 91: Vulk Ready? RECETA (armazón óptico) — unisex, G-Flex, 1 variante 100% transparente
-- Fecha: 2026-08-04
-- ============================================
-- Armazón de receta UNISEX, marco liviano (18,2g). Frente y patillas G-Flex con
-- sistema de bisagras flexo (hinge_system "flex", precedente Be Again 88 / Misty 48).
-- Lentes demo. Categoría anteojos-de-receta. Convención receta: SOLO
-- lens_compatibility (SIN lens_material/treatment/category/polarized/uv). Molde:
-- patrón single-row de 90_rusty_pro_30_receta.
--
-- ⚠️ NOMBRE con signo de pregunta: el modelo real se llama "Ready?" (así en ML y en
-- la ficha del founder). `name` = "Vulk Ready?" LITERAL (nombre comercial, sin
-- penalización SEO real por el símbolo — mismo criterio de precisión que The Sil/
-- PRO 30/Be Again sin traducir/limpiar nombres). El `slug` SÍ va sin el símbolo
-- (`vulk-ready-receta`, URL-safe) — slug técnico y nombre visible son cosas
-- distintas. La CARPETA sí lleva el "?" literal porque así se llama en el bucket
-- (columna `storage_path text`, sin
-- restricción de charset, confirmado en migración 20260528030711).
--
-- 1 SOLA VARIANTE (item simple → mercadolibre_variation_code = NULL). Precio/stock
-- de la API ML + SKU del founder. $77.690 → 7769000c, stock 3:
--   Transparente cristal  SKU 956944  MLA1947385195
--
-- ⚠️ frame_shape="cuadrado" es HIPÓTESIS no concluyente (catalog-loader + seo-strategist
-- coinciden): lente 54×42mm, ratio 1.29:1. Precedente más cercano en el catálogo Vulk =
-- Katleen (cuadrado, 53×42, ratio 1.26:1). CONFIRMAR con founder al ver la foto real
-- (mismo tratamiento que Be Again 88 / Vartis 89).
--
-- Peso 18,2g. Medidas: 145 / 54×42 / 19 / 142 mm (medidas.png).
--
-- SEO (seo-strategist): name = "Vulk Ready?" (sin sufijo "Unisex" — no coexiste con
-- versión de sol homónima). Primaria = `anteojos transparentes` (720/16) GENÉRICO SIN
-- GÉNERO — único Vulk receta 100% transparente (1/1, no 2/3 como Strewn ni 1/3 como
-- Be Again ni 1/2 como Vartis) → puede reclamar el head genérico sin matizar, a
-- diferencia de los demás que quedan por debajo del umbral de honestidad. Cierra el
-- cluster transparente del sitio: mujer (Strewn) + hombre (Rusty PRO 30) + unisex
-- genérico (Ready). Cross-link obligatorio Ready↔Strewn↔PRO 30 (transparentes) +
-- Ready↔Be Again↔Dieven Unisex (Vulk receta unisex) + /anteojos-de-receta/vulk +
-- /guias/como-leer-receta-anteojos.
--
-- CROSS-LINK sol↔receta: NO existe Vulk Ready de SOL cargado (grep vacío, con y sin
-- el símbolo). Si se carga el sol como slug `vulk-ready`, engancha solo.
--
-- 📸 FOTOS (bucket products/vulk-ready?-receta/ — ⚠️ nombre de CARPETA LITERAL con el
-- signo de pregunta, distinto del slug técnico; confirmado listando el bucket
-- completo, HTTP 200 verificado):
--   Ready-CRY-PERFIL.jpg / Ready-CRY-FRENTE.jpg (900×442, PRIMARY perfil)
--   medidas.png (sort 99)
-- Scale 1.1 perfil / 1.0 frente (baseline receta establecido, 900×442 idéntico al
-- resto del cluster; reverificar grid, regla 15).
--
-- ⚠️ BUG + FIX (2026-08-04): los NOMBRES DE ARCHIVO originales también tenían el "?"
-- literal (`Ready?-CRY-PERFIL.jpg`), lo que rompía las fotos en el sitio — el
-- navegador interpretaba el "?" como inicio de query string y cortaba la URL antes
-- de llegar al archivo. `lib/storage/product-image-url.ts` no encodeaba el
-- storage_path. Corregido en 2 lugares: (a) `getProductImageUrl` ahora encodea cada
-- segmento del path con encodeURIComponent (fix general, sirve para cualquier futuro
-- storage_path con caracteres reservados); (b) el founder renombró los ARCHIVOS
-- (no la carpeta) sacándoles el "?" — este seed y la DB ya reflejan los nombres
-- reales post-rename. Ver MISTAKES.md 2026-08-04.
-- ============================================

BEGIN;

WITH
  vulk    AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM receta), 'vulk-ready-receta', 'Vulk Ready?',
  'Vulk Ready?: anteojos transparentes unisex, bisagras flexibles, armazón de receta apto para todo tipo de lentes. Envío a todo el país y asesoramiento óptico.',
  E'El **Vulk Ready?** es un armazón de receta **transparente, unisex**, ultraliviano (18,2 g). Frente y patillas de **G-Flex** con **sistema de bisagras flexo**, para un calce cómodo y durable.\n\nMedidas: frente 145 mm · lente 54 mm de ancho × 42 mm de alto · puente 19 mm · varilla 142 mm.\n\nViene con lentes demo (sin graduación). Sumale tus cristales con receta: monofocales, bifocales, progresivos o multifocales.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "cuadrado",
    "temple_material": "g-flex",
    "hinge_system": "flex",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "unisex",
    "line": "urbana",
    "measurements": {"frame_width_mm": 145, "lens_width_mm": 54, "lens_height_mm": 42, "bridge_mm": 19, "temple_length_mm": 142},
    "weight_grams": 18.2,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Transparente, unisex y ultraliviano", "body": "Frente y patillas de G-Flex con sistema de bisagras flexo. Diseño transparente, para hombre o mujer, solo 18,2 g."},
      {"type": "tip", "position": "middle", "title": "Apto para tu graduación", "body": "Acepta lentes monofocales, bifocales, progresivos y multifocales. Si tenés dudas con tu receta, escribinos antes de comprar."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con foto de tu receta. Te pasamos el costo del laboratorio según tu graduación + tratamientos (antirreflex, fotocromático). Armazón + cristales en 7-10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1947385195"], "imported_at": "2026-08-04"}
  }'::jsonb,
  true, false,
  'Armazón de Receta Vulk Ready? | Óptica Carballo',
  'Vulk Ready?: anteojos transparentes unisex, bisagras flexibles, armazón de receta apto para todo tipo de lentes. Envío a todo el país y asesoramiento óptico.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variante única. sort 1, primary. Item simple → variation_code = NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-ready-receta'), '956944',
   '{"frame_color":"transparente-cristal","model_code":"READY OPTICAL"}'::jsonb,
   7769000, 3, true, 1, 'MLA1947385195', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = perfil. medidas SIEMPRE última (sort 99). ⚠️ storage_path con
-- el "?" literal — es el nombre real del archivo/carpeta en el bucket.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-ready-receta'), (SELECT id FROM public.product_variants WHERE sku='956944'),
   'vulk-ready?-receta/Ready-CRY-PERFIL.jpg', 'Armazón de receta Vulk Ready? unisex vista lateral, transparente cristal', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-ready-receta'), (SELECT id FROM public.product_variants WHERE sku='956944'),
   'vulk-ready?-receta/Ready-CRY-FRENTE.jpg', 'Armazón de receta Vulk Ready? unisex vista frontal, transparente cristal', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-ready-receta'), NULL,
   'vulk-ready?-receta/medidas.png', 'Esquema técnico de medidas Vulk Ready?: frente 145mm, lente 54x42mm, puente 19mm, varilla 142mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
