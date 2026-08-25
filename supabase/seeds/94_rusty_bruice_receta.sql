-- ============================================
-- Seed 94: Rusty Bruice RECETA — aviador doble puente unisex, G-Flex, 2 colorways
-- Fecha: 2026-08-25
-- ============================================
-- Versión de RECETA del mismo armazón que el seed 93 (Rusty Bruice sol). Aviador de doble puente
-- unisex, G-Flex frente y patillas, bisagras metálicas, 23 g.
--
-- ⚠️ EL SLUG TIENE QUE SER `rusty-bruice-receta`, EXACTO. `fetchCompanionModality()` en
-- lib/catalog/queries.ts:582 arma el cross-link sol↔receta por convención de nombre: desde receta
-- hace `slug.replace(/-receta$/, '')` y desde sol le agrega `-receta`. Cualquier otro slug rompe el
-- link en las dos direcciones, en silencio. Verificado en producción: las dos fichas se linkean.
--
-- ⚠️ LA PUBLICACIÓN DE ML DICE "BLUECUT" Y ES FALSO. El founder lo desmintió: los cristales que
-- trae son de DEMOSTRACIÓN, sin graduación y sin filtro. En la ficha del sitio se dice explícito,
-- en un callout `warning` arriba de todo. No es sólo cumplir la regla de honestidad: es el dato que
-- más consultas evita después de la venta.
--
-- ⚠️ UN ARMAZÓN DE RECETA NO LLEVA UV400, NI CATEGORÍA DE FILTRO, NI POLARIZADO. Esos atributos son
-- de los anteojos de sol. Por eso este seed NO carga `lens_material`, `lens_treatment` ni
-- `lens_category`, y sí carga `lens_compatibility` — que es lo que corresponde en receta. Ver el
-- seed 84 (rusty-peating-receta) que fija la convención.
--
-- VARIANTES (item MULTI-VARIACIÓN en ML, activo, 18 ventas):
--   SKU 957000  MLA1476793113  var 187532074917  $84.932 → 8493200c  stock 4  negro mate (MBLK)
--   SKU 957001  MLA1476793113  var 186939241003  $84.932 → 8493200c  stock 0  transparente cristal (CRY)
--   Los `variation_code` son reales y obligatorios: con un item multi-variación,
--   `syncStockFromMLItem` los usa para saber a qué variante aplicarle cada stock. Si quedaran en
--   NULL agarraría una sola y el stock terminaría en la variante equivocada, sin tirar error.
--   El fabricante tiene 5 colorways de receta (957000 MBLK, 957001 CRY, 957002 SBLK,
--   957003 STEEL BLUE, 957130 STEELBLUE-CRY); el founder confirmó que su publicación tiene estas 2.
--
-- MEDIDAS: 146 / 56 x 54 / 18 / 140 mm. La placa MEDIDAS.jpg del fabricante para la línea de receta
-- (fw23) dice 56-18-140, o sea que coincide con la de sol y **corrobora de forma independiente que
-- el puente es 18 y no 16** — que fue la corrección del seed 93.
--
-- SEO: primaria BRANDED (`armazón rusty bruice` / `anteojos de receta rusty bruice`). NO toma
-- `anteojos aviador` (590) porque ese carril ya es de **Rusty The Take receta**, que hasta hoy era
-- el único aviador del cluster Rusty de receta (SEO_STRATEGY.md). Bruice es el segundo, misma
-- situación que en sol, donde también quedó branded por ser el tercer aviador. Tampoco puede pelear
-- `anteojos aviador hombre` (260): es unisex (`GENDER = "Sin género"` en su propia publicación).
-- Title: `Armazón de Receta Rusty Bruice Optics | Óptica Carballo` (55). No dice "aviador" para no
-- chocar con el de The Take; el propio nombre del modelo ya lo distingue.
--
-- ⚠️ EL NOMBRE LLEVA EL SUFIJO "Optics". Es la convención de la línea de receta de Rusty: 12 de los
-- 14 productos de `/anteojos-de-receta/rusty` se llaman "Rusty <Modelo> Optics" (la excepción es
-- Peating, que usa un calificador de color). Se cargó primero sin el sufijo y lo detectó el founder
-- mirando la grilla. Al cargar un receta de Rusty, copiar la convención de los hermanos.
-- Cross-link obligatorio Bruice receta ↔ The Take receta ("otros aviadores de receta") y
-- Bruice receta ↔ Bruice sol (automático por slug).
--
-- 📸 FOTOS: bucket products/rusty-bruice-receta/ — 5 archivos 2000×1333, generados con `pnpm placas`
-- (`--tipo receta`, que no imprime claims de UV ni polarizado) y subidos con `pnpm fotos:subir`.
-- Primaria = perfil de la MBLK. medidas.jpg con variant_id NULL y sort 99. Se generó una placa de
-- medidas propia en vez de reusar la del sol: son el mismo número pero cada producto con su archivo,
-- para que el bucket siga siendo legible.
-- `pnpm auditar:encuadre --todas`: las 4 fotos de producto en 92% con scale 1.00, sin overrides.
-- ============================================

BEGIN;

WITH
  rusty  AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  receta AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-receta' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM receta), 'rusty-bruice-receta', 'Rusty Bruice Optics',
  'Armazón de receta Rusty Bruice: aviador de doble puente unisex en G-Flex, 23 g, con bisagras metálicas. Viene con lentes de demostración, listo para que le pongas tu graduación.',
  E'El **Rusty Bruice** en versión de receta es un **armazón aviador de doble puente, unisex**, de **G-Flex** con **bisagras metálicas**. Pesa **23 g**: de los más livianos del catálogo, que se nota cuando lo usás todo el día.\n\n**Los cristales que trae son de demostración.** No tienen graduación, ni filtro de luz azul, ni protección UV, ni polarizado — son lentes de muestra para que veas cómo te queda el armazón. Los cristales de verdad se arman según tu receta.\n\nMedidas: frente 146 mm · lente 56 mm de ancho × 54 mm de alto · puente 18 mm · varilla 140 mm.\n\nLos 54 mm de alto de cristal son cómodos para **progresivos**, que necesitan altura para que los tres campos entren bien.\n\nDisponible en 2 colores:\n\n• **Negro mate.**\n• **Transparente cristal.**\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "aviador",
    "hinge_system": "metalica",
    "lens_compatibility": ["monofocal", "bifocal", "progresivo", "multifocal"],
    "gender": "unisex",
    "line": "urbana",
    "weight_grams": 23,
    "measurements": {"frame_width_mm": 146, "lens_width_mm": 56, "lens_height_mm": 54, "bridge_mm": 18, "temple_length_mm": 140},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-09-25",
    "callouts": [
      {"type": "warning", "position": "top", "title": "Los cristales que trae son de demostración", "body": "No tienen graduación ni filtro de luz azul. Tampoco protección UV ni polarizado: eso es de los anteojos de sol, un armazón de receta no lo lleva. Son lentes de muestra para probar el armazón; los cristales definitivos se arman con tu receta."},
      {"type": "tip", "position": "middle", "title": "Cómodo para progresivos", "body": "El cristal mide 54 mm de alto, que es holgado para un progresivo — necesitan altura para que la visión de lejos, la intermedia y la de cerca entren bien. Acepta monofocal, bifocal, progresivo y multifocal."},
      {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con una foto de tu receta. Te pasamos el costo de los cristales según tu graduación y los tratamientos que quieras (antirreflejo, fotocromático). Armazón más cristales en 7 a 10 días hábiles."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1476793113"], "imported_at": "2026-08-25"}
  }'::jsonb,
  true, false,
  'Armazón de Receta Rusty Bruice Optics | Óptica Carballo',
  'Armazón de receta Rusty Bruice: aviador de doble puente unisex, G-Flex de 23 g y bisagras metálicas. Alto de cristal 54 mm, cómodo para progresivos. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-bruice-receta'), '957000',
   '{"frame_color":"negro-mate","model_code":"MBLK"}'::jsonb,
   8493200, 4, true, 1, 'MLA1476793113', '187532074917'),
  ((SELECT id FROM public.products WHERE slug='rusty-bruice-receta'), '957001',
   '{"frame_color":"transparente-cristal","model_code":"CRY"}'::jsonb,
   8493200, 0, true, 2, 'MLA1476793113', '186939241003')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Primaria = perfil de la MBLK. medidas.jpg SIEMPRE última (sort 99) y con variant_id NULL.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-bruice-receta'), (SELECT id FROM public.product_variants WHERE sku='957000'),
   'rusty-bruice-receta/perfil-mblk.jpg', 'Armazón de receta Rusty Bruice aviador doble puente unisex vista lateral, negro mate con lentes de demostración', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-bruice-receta'), (SELECT id FROM public.product_variants WHERE sku='957000'),
   'rusty-bruice-receta/frente-mblk.jpg', 'Armazón de receta Rusty Bruice aviador doble puente unisex vista frontal, negro mate con lentes de demostración', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bruice-receta'), (SELECT id FROM public.product_variants WHERE sku='957001'),
   'rusty-bruice-receta/perfil-cry.jpg', 'Armazón de receta Rusty Bruice aviador doble puente unisex vista lateral, transparente cristal con lentes de demostración', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bruice-receta'), (SELECT id FROM public.product_variants WHERE sku='957001'),
   'rusty-bruice-receta/frente-cry.jpg', 'Armazón de receta Rusty Bruice aviador doble puente unisex vista frontal, transparente cristal con lentes de demostración', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-bruice-receta'), NULL,
   'rusty-bruice-receta/medidas.jpg', 'Esquema técnico de medidas Rusty Bruice: frente 146mm, lente 56x54mm, puente 18mm, varilla 140mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
