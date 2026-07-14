-- ============================================
-- Seed 87: Vulk Dieven SOL — rectangular unisex, G-Flex, 2/3 polarizadas
-- Fecha: 2026-07-14
-- ============================================
-- Anteojo de SOL rectangular de bordes anchos, unisex (hermano del Vulk Dieven Unisex
-- receta, seed 86 — mismo armazón físico: medidas y peso idénticos). Frente y patillas
-- G-Flex, bisagras plásticas reforzadas ultra liviano. Lente policarbonato 100% UVA/UVB.
--
-- ⚠️ frame_shape: el título de las 3 publicaciones ML dice "Cuadrado" (ej. "...Polarizado
-- Cuadrado Uv Cuadrado Gris..."), pero el founder escribió explícito "Rectangular unisex"
-- y las medidas coinciden EXACTO con el receta (armazón rectangular de bordes anchos,
-- seed 86). Se prioriza el dato del founder + consistencia físico con el receta sobre el
-- título de ML (relleno de keywords, patrón visto en otras publicaciones) → frame_shape
-- = "rectangular" (= al receta, como todos los demás pares sol↔receta del catálogo).
--
-- **2 MLAs SEPARADOS** (items simples, 0 variaciones cada uno → mercadolibre_variation_code
-- = NULL). Precio/stock de la API ML + SKU del founder:
--   MBLK/S10 GREY POL  SKU 116085 MLA1423844459 $76.156,15 → 7615615c stock 2 (negro mate/gris oscuro, POLARIZADA)
--   SBLK/SG91 POL      SKU 116089 MLA1440173663 $76.156,15 → 7615615c stock 7 (negro brillo/gris degradé, POLARIZADA)
--   ROSE/BROWN-GREEN   SKU 116087 MLA2493430690 $69.810,63 → 6981063c stock 8 (rosa pálido translúcido/marrón degradé a verde)
--
-- ⚠️ HONESTIDAD (2/3 confirmadas polarizadas, criterio Bruk 2/3 — seed 40): el título ML
-- de ROSE/BROWN-GREEN NO dice "polarizado" (a diferencia de las otras 2 que sí lo dicen
-- explícito) → NO se afirma "polarizado" para el modelo completo. `lens_treatment` a nivel
-- PRODUCTO queda SOLO ["uv400"] (sin "polarized" — no todas las variantes lo son).
-- `polarized:true` en las 2 confirmadas; `polarized:false` en ROSE/BROWN-GREEN (no se
-- afirma que SEA polarizada; funcionalmente no muestra el badge en el PDP).
--
-- frame_material + temple_material g-flex. Bisagras plásticas reforzadas → callout (mismo
-- criterio que el receta, hinge_system NO es campo de sol). lens_material policarbonato,
-- lens_category 3. weight_grams = 28.5 (= al receta, "mismo que el de receta" — founder).
-- gender unisex. Medidas = al receta: 142/55×48/17/145 mm.
--
-- SEO (seo-strategist): name = "Vulk Dieven" (SIN "Unisex" — ese sufijo del receta es
-- inconsistente con el resto del catálogo sol; Sil/Raven/Bennie/Zinz usan Marca+Modelo
-- limpio). Primaria = branded exacto (`anteojos/lentes de sol vulk dieven`, en CSV) + head
-- de marca de soporte (`lentes/anteojos de sol vulk`). NO usa "cuadrados"/"polarizados"
-- como primaria — esos carriles son de Vulk The Sil (3/3 pol, forma cuadrada exclusiva).
-- Diferenciador real: paleta de color (rosa translúcido + degradé marrón-verde, que The
-- Sil no tiene). Cross-link obligatorio Dieven↔The Sil.
--
-- ⚠️ Bug preexistente detectado por seo-strategist (no de este producto): el filtro
-- /polarizados lee lens_treatment a nivel PRODUCTO (containment), no deriva de variantes
-- en runtime pese a lo que decía el comentario del seed 79 Zinz. Con lens_treatment SOLO
-- ["uv400"], Dieven NO calificará para /polarizados — correcto y esperado (2/3, no todas).
-- NO linkear a esa faceta desde la PDP.
--
-- CROSS-LINK sol↔receta: automático por convención de slug (`vulk-dieven` ↔
-- `vulk-dieven-receta`, seed 86), vía fetchCompanionModality — sin código nuevo.
--
-- 📸 FOTOS (bucket products/vulk-dieven/ — founder renombró la carpeta: vulk-dieven/ es
-- ahora el SOL, vulk-dieven-receta/ es el receta. 7, verificadas 900×442 = 2:1, HTTP 200):
--   DIEVEN-MBLK-S10-GREY-POL-perfil.jpg / DIEVEN-MBLK-S10-GREY-POL-frente.jpg (PRIMARY +stock relativo, pero SBLK tiene más stock — ver nota sort)
--   DIEVEN-SBLK-SG91-POL-perfil.jpg / DIEVEN-SBLK-SG91-POL-frente.jpg
--   DIEVEN-ROSE-BROWN-GREEN-PERFIL.jpg / DIEVEN-ROSE-BROWN-GREEN-FRENTE.jpg
--   medidas.png (sort 99)
-- Primary = MBLK/S10 GREY POL perfil (color base del modelo, consistente con el receta
-- donde MBLK también es primary). Scale 1.1 perfil / 1.0 frente (900×442 idéntico al
-- receta y al resto del catálogo; reverificar grid /anteojos-de-sol, regla 15).
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-dieven', 'Vulk Dieven',
  'Lentes de sol Vulk Dieven: rectangulares unisex, G-Flex ultra liviano. 2 versiones polarizadas y una translúcida. Lente de policarbonato con 100% protección UV.',
  E'Los **Vulk Dieven** son **lentes de sol rectangulares, unisex**. El **frente y las patillas son de G-Flex** —flexible y resistente— con **bisagras plásticas reforzadas**, ultra liviano. La **lente es de policarbonato**, con **100% protección UV (UV400, categoría 3)**.\n\nMedidas: frente 142 mm · lente 55 mm de ancho × 48 mm de alto · puente 17 mm · varilla 145 mm.\n\nDisponible en 3 colores:\n\n• MBLK/S10 — negro mate, lente gris oscuro **polarizada**.\n• SBLK/SG91 — negro brillo, lente gris degradé **polarizada**.\n• ROSE/BROWN-GREEN — rosa pálido translúcido, lente marrón degradé a verde.\n\nLa versión polarizada corta el reflejo del agua, la nieve y el asfalto. Incluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante. ¿Lo necesitás con tu graduación? Mirá la versión de receta del Vulk Dieven.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "rectangular",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "weight_grams": 28.5,
    "measurements": {"frame_width_mm": 142, "lens_width_mm": 55, "lens_height_mm": 48, "bridge_mm": 17, "temple_length_mm": 145},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Rectangular unisex, ultra liviano", "body": "Diseño rectangular de bordes anchos, unisex. Frente y patillas de G-Flex con bisagras plásticas reforzadas. Lente de policarbonato con 100% protección UV (UV400, categoría 3)."},
      {"type": "tip", "position": "middle", "title": "Dos versiones polarizadas", "body": "MBLK/S10 y SBLK/SG91 son polarizadas: cortan el reflejo del agua, la nieve y el asfalto. ROSE/BROWN-GREEN suma un color translúcido con lente degradé."},
      {"type": "recommendation", "position": "bottom", "title": "¿Lo necesitás con graduación?", "body": "Este modelo también está como armazón de receta. Si dudás cuál te conviene, escribinos por WhatsApp y te asesoramos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1423844459", "MLA1440173663", "MLA2493430690"], "imported_at": "2026-07-14"}
  }'::jsonb,
  true, false,
  'Vulk Dieven | Anteojos de Sol - Óptica Carballo',
  'Lentes de sol Vulk Dieven: cuadrados unisex en 3 colores, polarizados en algunas variantes. Envíos a todo el país, cuotas sin interés, asesoramiento técnico.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = MBLK/S10 GREY POL (primary, color base = al receta). 3 MLAs simples
-- → variation_code = NULL. 2/3 polarizadas (honestidad: ROSE/BROWN-GREEN polarized:false,
-- sin afirmar nada en copy).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-dieven'), '116085',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 GREY POL","polarized":true}'::jsonb,
   7615615, 2, true, 1, 'MLA1423844459', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-dieven'), '116089',
   '{"frame_color":"negro-brillo","lens_color":"gris-degradado","model_code":"SBLK/SG91 POL","polarized":true}'::jsonb,
   7615615, 7, true, 2, 'MLA1440173663', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-dieven'), '116087',
   '{"frame_color":"rosa-palido-translucido","lens_color":"marron-degradado-verde","model_code":"ROSE/BROWN-GREEN","polarized":false}'::jsonb,
   6981063, 8, true, 3, 'MLA2493430690', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = MBLK/S10 GREY POL perfil. medidas SIEMPRE última (sort 99).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-dieven'), (SELECT id FROM public.product_variants WHERE sku='116085'),
   'vulk-dieven/DIEVEN-MBLK-S10-GREY-POL-perfil.jpg', 'Lentes de sol Vulk Dieven rectangulares unisex vista lateral, negro mate lente gris oscuro polarizada', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-dieven'), (SELECT id FROM public.product_variants WHERE sku='116085'),
   'vulk-dieven/DIEVEN-MBLK-S10-GREY-POL-frente.jpg', 'Lentes de sol Vulk Dieven rectangulares unisex vista frontal, negro mate lente gris oscuro polarizada', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-dieven'), (SELECT id FROM public.product_variants WHERE sku='116089'),
   'vulk-dieven/DIEVEN-SBLK-SG91-POL-perfil.jpg', 'Lentes de sol Vulk Dieven rectangulares unisex vista lateral, negro brillo lente gris degradé polarizada', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-dieven'), (SELECT id FROM public.product_variants WHERE sku='116089'),
   'vulk-dieven/DIEVEN-SBLK-SG91-POL-frente.jpg', 'Lentes de sol Vulk Dieven rectangulares unisex vista frontal, negro brillo lente gris degradé polarizada', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-dieven'), (SELECT id FROM public.product_variants WHERE sku='116087'),
   'vulk-dieven/DIEVEN-ROSE-BROWN-GREEN-PERFIL.jpg', 'Lentes de sol Vulk Dieven rectangulares unisex vista lateral, rosa pálido translúcido lente marrón degradé a verde', 900, 442, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-dieven'), (SELECT id FROM public.product_variants WHERE sku='116087'),
   'vulk-dieven/DIEVEN-ROSE-BROWN-GREEN-FRENTE.jpg', 'Lentes de sol Vulk Dieven rectangulares unisex vista frontal, rosa pálido translúcido lente marrón degradé a verde', 900, 442, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-dieven'), NULL,
   'vulk-dieven/medidas.png', 'Esquema técnico de medidas Vulk Dieven: frente 142mm, lente 55x48mm, puente 17mm, varilla 145mm', 1500, 1500, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
