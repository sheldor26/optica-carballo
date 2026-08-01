-- ============================================
-- Seed 88: Vulk Be Again RECETA (armazón óptico) — unisex, G-Flex
-- Fecha: 2026-07-15
-- ============================================
-- Armazón de receta UNISEX, marco liviano (21,5g). Frente y patillas de G-Flex, bisagras
-- metálicas CON FLEX (founder explícito → hinge_system "flex", precedente exacto Misty
-- receta seed 48, no "metalica" que es para Rusty sin flex). Lentes demo. Categoría
-- anteojos-de-receta. Convención receta: SOLO lens_compatibility (SIN lens_material/
-- treatment/category/polarized/uv — viene con lente demo).
--
-- ⚠️ frame_shape="cuadrado" es HIPÓTESIS no concluyente (catalog-loader): lente 48×46mm,
-- ratio ~1.04:1 (casi cuadrado). En el catálogo ese ratio aparece tanto en productos
-- "cuadrado" (Vorez, Dileri, Deserve) como "redondo" (Kirt, Misty) — sin poder ver la
-- foto no se distingue el ángulo de esquina. Se usa "cuadrado" por ser la clasificación
-- más frecuente en ese rango de ratio dentro de Vulk. CONFIRMAR con founder al verificar
-- las fotos antes de cerrar definitivamente (mismo tratamiento que precedente Way Back 50).
--
-- 3 MLAs SEPARADOS (items simples → mercadolibre_variation_code = NULL). Precio/stock de
-- la API ML + SKU pasados por el founder. Todos $92.085 → 9208500c, stock 2 (total 6):
--   MBLK negro mate      SKU 125910 MLA1939570797 (PRIMARY)
--   CRY transparente cristal SKU 125911 MLA1939519263
--   M447-MBLK frente marrón claro mate / patillas negro mate SKU 125914 MLA1939519261
--
-- ⚠️ NO mencionar bluecut / filtro de luz azul en NINGÚN campo visible (criterio general
-- de receta del proyecto).
--
-- Peso 21,5g. Medidas: 140 / 48×46 / 22 / 145 mm (medidas.png).
-- SKUs del founder únicos (125910/125911/125914) → sin sufijo.
--
-- SEO (seo-strategist): name = "Vulk Be Again" (SIN "Unisex" — a diferencia de Dieven que
-- lo necesitó por coexistir con su versión de sol homónima; Be Again no tiene sol cargado,
-- el nombre limpio entra en el presupuesto de title). Primaria = `anteojos recetados` (720,
-- head compartido, no canibaliza — mismo criterio Kirt/Dieven/Trial/Woxi/Peating/Zinz).
-- Solo 1/3 colores es transparente (CRY) → NO se reclama "transparente" como atributo del
-- modelo (criterio Dieven sol 2/3): sin overlap con Strewn (2/3 transparente, primaria
-- `anteojos transparentes mujer`). Diferenciador real: bisagras flex + compatibilidad
-- explícita mono/bi/progresivo + unisex + 21,5g. Cross-link obligatorio Be Again↔My
-- Crew↔Kirt↔Dieven Unisex↔The Trial Optics (Vulk receta unisex) + /anteojos-de-receta/vulk
-- + /guias/como-leer-receta-anteojos.
--
-- CROSS-LINK sol↔receta: NO existe Vulk Be Again de SOL cargado (grep vacío). Si se carga
-- el sol como slug `vulk-be-again`, engancha solo por convención de slug.
--
-- 📸 FOTOS: ✅ SUBIDAS + bloque aplicado (2026-07-15). Bucket products/vulk-be-again-receta/
-- (7, nombres reales, verificados HTTP 200):
--   BE AGAIN MBLK - PERFIL.jpg / BE AGAIN MBLK FRENTE GALERIA  900X442.jpg (negro mate, PRIMARY, 900×442)
--   BE AGAIN CRY OPTICS- PERFIL.jpg / BE AGAIN CRY OPTICS frente.jpg (transparente, ⚠️ 5365×3577 full-res, mismo caso que Strewn CRY)
--   BE AGAIN -M447-MBLK p.jpg / BE AGAIN -M447-MBLK f.jpg (marrón claro/negro, 900×442)
--   medidas.png (sort 99)
-- Scale: MBLK/M447-MBLK 1.1 perfil / 1.0 frente (900×442 baseline receta); CRY 1.2 perfil /
-- 1.05 frente (full-res 3:2, más margen → más scale, mismo criterio que Strewn CRY).
-- PROVISIONAL — reverificar grid /anteojos-de-receta/vulk (regla 15).
-- ============================================

BEGIN;

WITH
  vulk    AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  receta  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM receta), 'vulk-be-again-receta', 'Vulk Be Again',
  'Vulk Be Again: anteojos recetados unisex, ultralivianos (21,5g), bisagras metálicas flex. Aptos para monofocal, bifocal y progresivo. Envío a todo el país.',
  E'El **Vulk Be Again** es un armazón de receta **unisex**, ultraliviano (21,5 g). Frente y patillas de **G-Flex** —flexible y resistente— con **bisagras metálicas flex** para un calce cómodo y durable.\n\nMedidas: frente 140 mm · lente 48 mm de ancho × 46 mm de alto · puente 22 mm · varilla 145 mm.\n\nViene con lentes demo (sin graduación). Sumale tus cristales con receta: monofocales, bifocales, progresivos o multifocales.\n\nDisponible en 3 colores:\n\n• MBLK — negro mate.\n• CRY — transparente cristal.\n• M447-MBLK — frente marrón claro mate, patillas negro mate.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "cuadrado",
    "temple_material": "g-flex",
    "hinge_system": "flex",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "unisex",
    "line": "urbana",
    "measurements": {"frame_width_mm": 140, "lens_width_mm": 48, "lens_height_mm": 46, "bridge_mm": 22, "temple_length_mm": 145},
    "weight_grams": 21.5,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Unisex, ultraliviano (21,5 g)", "body": "Frente y patillas de G-Flex flexible con bisagras metálicas flex. Para hombre o mujer, en 3 colores."},
      {"type": "tip", "position": "middle", "title": "Apto para tu graduación", "body": "Acepta lentes monofocales, bifocales, progresivos y multifocales. Si tenés dudas con tu receta, escribinos antes de comprar."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con foto de tu receta. Te pasamos el costo del laboratorio según tu graduación + tratamientos (antirreflex, fotocromático). Armazón + cristales en 7-10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1939570797", "MLA1939519263", "MLA1939519261"], "imported_at": "2026-07-15"}
  }'::jsonb,
  true, false,
  'Armazón de Receta Vulk Be Again Unisex | Óptica Carballo',
  'Vulk Be Again: anteojos recetados unisex, ultralivianos (21,5g), bisagras metálicas flex. Aptos para monofocal, bifocal y progresivo. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = MBLK negro mate (primary). Items simples → variation_code = NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-be-again-receta'), '125910',
   '{"frame_color":"negro-mate","model_code":"MBLK OPTICAL"}'::jsonb,
   9208500, 2, true, 1, 'MLA1939570797', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-be-again-receta'), '125911',
   '{"frame_color":"transparente-cristal","model_code":"CRY OPTICAL"}'::jsonb,
   9208500, 2, true, 2, 'MLA1939519263', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-be-again-receta'), '125914',
   '{"frame_color":"marron-claro-mate-negro-mate","model_code":"M447-MBLK OPTICAL"}'::jsonb,
   9208500, 2, true, 3, 'MLA1939519261', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes: PENDIENTE — bucket vacío al momento de aplicar. Bloque se agrega cuando el
-- founder confirme la subida + nombres exactos (ver seed 88 comentario de carga abierta).

COMMIT;
