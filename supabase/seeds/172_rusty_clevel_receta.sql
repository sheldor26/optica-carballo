-- ============================================
-- Seed 172: Rusty Clevel RECETA, rectangular de bordes gruesos en acetato, unisex, 2 colores
-- Fecha: 2026-10-14
-- ============================================
-- Armazón de RECETA nuevo de Rusty (colección FW23): frente de acetato laminado hecho a mano, patillas de acetato de 8 mm de espesor, bisagras de acero inoxidable sin flex, 24,7 g (datos de la marca, rustyoptical.com/optical/fw23/clevel; en el copy van atribuidos "según el fabricante" o no se afirman de más).
-- 2 PUBLICACIONES TRADICIONALES de ML (items simples, `variation_code` NULL, `catalog_listing:false`, categoría MLA417127), ACTIVAS, publicadas por el founder el 2026-10-14 y verificadas por API:
--   C1 negro brillo   SKU 839680  MLA2190217439 (MLAU5529725952)  $67.497 → 6749700c  stock 3, sin GTIN
--   C2 marrón claro transparente  SKU 839681  MLA2190227885 (MLAU5484861285)  $67.497 → 6749700c  stock 2, GTIN 7791709055073
--   El founder había escrito el SKU de la C2 como "8396816" (typo): ML y Rusty dicen 839681.
-- Stock y precio mandan desde ML. Género: ML las carga como "Sin género" => `unisex`.
--
-- DATOS DEL FOUNDER (2026-10-14): rectangular de bordes gruesos, acetato, bisagras de acero inoxidable (sin flex), 24,7 g, 53-18-145, altura total 46, ancho total 143, "se puede adaptar cualquier tipo de lente"; en ML "incluye lentillas demo bluecut".
-- ⚠️ ALTURA: 46 es la ALTURA TOTAL del armazón (criterio del founder, se carga tal cual en `lens_height_mm`). Con bordes gruesos el hueco real del cristal es menor (estimado 38-42 mm por optical-expert, SIN MEDIR): por eso el texto de progresivos es prudente ("alto del cristal moderado, corredor corto, lo confirmamos con tu receta"). Pendiente: el founder mide el hueco con regla; si da 40 mm o más, la frase queda; si da menos, se ajusta.
-- ⚠️ BLUE CUT: Rusty declara "Lentes: Blue Cut" en la ficha. En el seed 94 (Bruice) el founder había desmentido ese filtro. Acá se escribe SIEMPRE "según el fabricante", sin afirmar beneficio, y el cristal definitivo lleva el filtro sólo si se pide al armar. Pendiente: el founder lo verifica si puede.
--
-- RECETA: no se carga `lens_material`, `lens_treatment` ni `lens_category` (el lente es de demostración). Sí `lens_compatibility`.
-- Convención de nombre de la línea de receta de Rusty: "Rusty <Modelo> Optics" (como Bruice, R-CY 02, Zinz); slug `rusty-clevel-receta`.
-- 🎯 SEO (seo-strategist): descriptor primario "lentes de acetato" (110/11; es el único Rusty de receta en acetato; los demás son G-Flex o metal), una vez "anteojos recetados" y una vez "lentes de acetato" en el primer párrafo; sin color en el title (el C1 es negro y el C2 marrón); sin "rectangulares" como target (R-CY 02), "anteojos rusty hombre" (Invig), "transparentes" (PRO 30/Strewn), "bordes anchos" (Dieven). Links a R-CY 02 e Invig; frase de vuelta sólo en R-CY 02.
-- 🔬 optical-expert: sin "cualquier tipo", sin "holgado/cómodo para progresivos", sin "liviano/ultraliviano" (peso moderado), sin "lentillas", sin "hipoalergénico/irrompible", "se ajusta en la óptica", face shapes ovalado/redondo/corazón, "talle mediano".
-- 📸 FOTOS: oficiales de Rusty (900×442) pasadas por `pnpm placas --tipo receta`, subidas a `rusty-clevel-receta/` (perfil y frente de cada color, 2000×1333) + `medidas.jpg` compartida. Scale 1.05 como el Bruice (vecinos de la grilla en 95-97%).
-- ============================================

BEGIN;

WITH
  rusty  AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-clevel-receta', 'Rusty Clevel Optics',
  'Anteojos de receta Rusty Clevel Optics: armazón rectangular de bordes gruesos en acetato, con bisagras de acero inoxidable. 53-18-145, 24,7 g. Trae lentes de demostración.',
  E'Los **Rusty Clevel** son **anteojos recetados** de armazón rectangular de bordes gruesos, unisex, hechos en **acetato**: si buscás **lentes de acetato** con presencia, es uno de los más marcados de la línea. Según el fabricante, el frente es de acetato laminado hecho a mano y las patillas son de acetato de 8 mm de espesor. Las bisagras son de **acero inoxidable**, fijas, sin sistema flex. El armazón solo pesa 24,7 g; con los cristales sube según tu graduación y el índice del lente. El acetato se puede ajustar en la óptica con calor para que apoye bien en la nariz y las orejas.\n\n**Los lentes que trae son de demostración.** No tienen graduación. El fabricante los indica con filtro Blue Cut; sirven para probar el armazón. Los cristales definitivos se arman con tu receta, y el filtro de luz azul en ese cristal es opcional: lo pedís al armar.\n\nSe arma con cristales monofocales, bifocales, progresivos y multifocales según tu receta. Para progresivos, el alto del cristal es moderado: recomendamos diseños de corredor corto, y lo confirmamos con tu receta antes de armar.\n\nMedidas: frente 143 mm · lente 53 mm de ancho · puente 18 mm · varilla 145 mm · alto total 46 mm. Es un talle mediano.\n\nDisponible en 2 colores:\n\n• **C1, negro brillo.**\n• **C2, marrón claro transparente.**\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi preferís un rectangular más fino y ultra liviano, mirá los [Rusty R-CY 02 Optics](/anteojos-de-receta/rusty/rusty-r-cy-02-receta); si querés un rectangular de metal, los [Rusty Invig Optics](/anteojos-de-receta/rusty/rusty-invig-receta). También podés ver [todos los anteojos de receta Rusty](/anteojos-de-receta/rusty).',
  '{
    "frame_material": "acetate",
    "temple_material": "acetate",
    "frame_shape": "rectangular",
    "hinge_system": "metalica",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "recommended_face_shapes": ["ovalado", "redondo", "corazon"],
    "gender": "unisex",
    "weight_grams": 24.7,
    "measurements": {"frame_width_mm": 143, "lens_width_mm": 53, "lens_height_mm": 46, "bridge_mm": 18, "temple_length_mm": 145},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-14",
    "callouts": [
      {"type": "warning", "position": "top", "title": "Los lentes que trae son de demostración", "body": "No tienen graduación. El fabricante los indica con filtro Blue Cut; sirven para probar el armazón. Los cristales definitivos se arman con tu receta, y el filtro de luz azul en ese cristal es opcional: lo pedís al armar."},
      {"type": "tip", "position": "middle", "title": "Progresivos: consultanos antes", "body": "El alto del cristal es moderado. Funciona bien con progresivos de corredor corto; lo confirmamos con tu receta antes de armar. Acepta también monofocal, bifocal y multifocal."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con una foto de tu receta. Te pasamos el costo de los cristales según tu graduación y los tratamientos que quieras (antirreflejo, fotocromático)."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2190217439", "MLA2190227885"], "imported_at": "2026-10-14"}
  }'::jsonb,
  true, false,
  'Rusty Clevel Optics en Acetato | Anteojos de Receta',
  'Anteojos de receta Rusty Clevel Optics de acetato, rectangular de bordes gruesos. 24,7 g, 2 colores. Monofocales, bifocales o progresivos. Envíos a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 2 variantes: items simples de ML (variation_code NULL). Primaria = C1 (mayor stock).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-clevel-receta'), '839680',
   '{"frame_color":"negro-brillo","model_code":"C1"}'::jsonb,
   6749700, 3, true, 1, 'MLA2190217439', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-clevel-receta'), '839681',
   '{"frame_color":"marron-claro-transparente","model_code":"C2","gtin":"7791709055073"}'::jsonb,
   6749700, 2, true, 2, 'MLA2190227885', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Primaria = perfil de la C1. medidas.jpg SIEMPRE última (sort 99) y con variant_id NULL.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-clevel-receta'), (SELECT id FROM public.product_variants WHERE sku='839680'),
   'rusty-clevel-receta/perfil-c1.jpg', 'Anteojos de receta Rusty Clevel rectangulares de acetato, vista lateral, negro brillo con lentes de demostración', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-clevel-receta'), (SELECT id FROM public.product_variants WHERE sku='839680'),
   'rusty-clevel-receta/frente-c1.jpg', 'Anteojos de receta Rusty Clevel rectangulares de acetato, vista frontal, negro brillo con lentes de demostración', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-clevel-receta'), (SELECT id FROM public.product_variants WHERE sku='839681'),
   'rusty-clevel-receta/perfil-c2.jpg', 'Anteojos de receta Rusty Clevel rectangulares de acetato, vista lateral, marrón claro transparente con lentes de demostración', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-clevel-receta'), (SELECT id FROM public.product_variants WHERE sku='839681'),
   'rusty-clevel-receta/frente-c2.jpg', 'Anteojos de receta Rusty Clevel rectangulares de acetato, vista frontal, marrón claro transparente con lentes de demostración', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-clevel-receta'), NULL,
   'rusty-clevel-receta/medidas.jpg', 'Esquema técnico de medidas Rusty Clevel: frente 143mm, lente 53mm, alto total 46mm, puente 18mm, varilla 145mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: sólo en R-CY 02 (lidera la forma rectangular).
UPDATE public.products
SET description = description || E'\n\nSi preferís acetato, mirá los [Rusty Clevel Optics](/anteojos-de-receta/rusty/rusty-clevel-receta).', updated_at = now()
WHERE slug = 'rusty-r-cy-02-receta' AND description NOT LIKE '%rusty-clevel-receta%';

COMMIT;
