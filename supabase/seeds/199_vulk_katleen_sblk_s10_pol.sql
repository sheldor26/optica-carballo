-- ============================================
-- Seed 199: Vulk KATLEEN SBLK / S10 POL (nueva variante: negro brillo + lente gris oscuro polarizada)
-- Fecha: 2026-11-10
-- ============================================
-- Publicación tradicional de ML, item SIMPLE (0 variaciones => `variation_code` NULL), creada por el founder y verificada por API el 2026-11-10:
--   125900  SBLK / S10 POL  MLA2278463795  $89.574  stock 3  (mismo `family_name` base que el MBLK/S10 POL para que ML las muestre juntas)
-- DATOS: SKU 125900 (confirmado por el founder; coincide con la ficha de Vulk). Medidas del producto (las del founder, 53-18-145): no se tocan.
-- PRECIO: el founder dijo que el MBLK/S10 POL y el SBLK/S10 POL cuestan $89.574; el MBLK sigue en $85.309 en ML y en la web hasta que se actualice en ML (el sync no debe revertirlo) => NO se toca acá.
-- TEXTO: al agregar la variante se corrigió el copy del producto: sin "flexible" (G-Flex no lo autoriza), sin "ultra liviano / de las más livianas" (26,3 g no se midió como liviano) y "elimina reflejos" => "reduce reflejos".
-- 📸 Fotos oficiales de Vulk (900×442) pasadas por `pnpm placas --tipo sol --sin-vision`; `pnpm fotos:subir --sufijo -sblk`. La foto de medidas ya existía (se deja siempre última: sort 99).
-- ============================================

BEGIN;

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES (
  (SELECT id FROM public.products WHERE slug='vulk-katleen'), '125900',
  '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK / S10 POL","polarized":true}'::jsonb,
  8957400, 3, true,
  (SELECT coalesce(max(sort_order),0)+1 FROM public.product_variants WHERE product_id=(SELECT id FROM public.products WHERE slug='vulk-katleen')),
  'MLA2278463795', NULL
)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Medidas siempre última (sort 99); fotos nuevas antes.
UPDATE public.product_images SET sort_order = 99, updated_at = now()
WHERE product_id = (SELECT id FROM public.products WHERE slug='vulk-katleen') AND storage_path = 'vulk-katleen/medidas.webp';

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-katleen'), (SELECT id FROM public.product_variants WHERE sku='125900'),
   'vulk-katleen/perfil-sblk.jpg', 'Anteojos de sol Vulk Katleen cuadrados para mujer, vista lateral, armazón negro brillo con lente gris oscuro polarizada', 2000, 1333, 8, false),
  ((SELECT id FROM public.products WHERE slug='vulk-katleen'), (SELECT id FROM public.product_variants WHERE sku='125900'),
   'vulk-katleen/frente-sblk.jpg', 'Anteojos de sol Vulk Katleen cuadrados para mujer, vista frontal, armazón negro brillo con lente gris oscuro polarizada', 2000, 1333, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

UPDATE public.products SET
  description = E'Los Vulk Katleen son anteojos de sol **cuadrados femeninos**, modernos y versátiles para uso diario. El armazón y las patillas son de **G-Flex** (26,3 g) con bisagras plásticas.\n\nLas lentes son de policarbonato con protección **UV400 categoría 3** (100% UVA/UVB). Los modelos **MBLK/S10 POL y SBLK/S10 POL son polarizados**, lo que reduce los reflejos del asfalto, el agua y la nieve para una visión más nítida y descansada. La variante **MSIENNA/HGG1** suma una capa antirreflejo para reducir los reflejos que llegan desde atrás.\n\nDisponible en 5 variantes:\n\n• SDEMI-SBLK/GB27 (SKU 968265): frente carey brillo con lente marrón degradé.\n• MBLK/S10 POL (SKU 125907): negro mate con lente gris oscuro POLARIZADA.\n• SBLK/S10 POL (SKU 125900): negro brillo con lente gris oscuro POLARIZADA.\n• MBLK/C8B15 (SKU 125905): negro mate con lente naranja claro.\n• MSIENNA/HGG1 (SKU 125909): marrón claro mate con lente G15 degradé y antirreflejo.\n\nTalle medium. Incluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
  short_description = 'Anteojos de sol Vulk Katleen: cuadrados femeninos, armazón y patillas de G-Flex y lentes de policarbonato UV400 categoría 3. Talle medium. Dos variantes con lente polarizada.',
  meta_description = 'Anteojos Vulk Katleen cuadrados femeninos: G-Flex de 26,3 g, policarbonato UV400, talle medium. 5 variantes, dos polarizadas. Envíos a toda la Argentina.',
  attributes = jsonb_set(attributes, '{callouts}', '[
    {"body":"Montura cuadrada femenina en G-Flex, de 26,3 g, con bisagras plásticas. Talle medium.","type":"info","title":"Cuadrado femenino","position":"top"},
    {"body":"Para manejar o la playa, las MBLK/S10 y SBLK/S10 son POLARIZADAS (reducen los reflejos): una en negro mate y otra en negro brillo. La SDEMI-SBLK carey es la más clásica y combinable; la MBLK/C8B15 naranja es la más jugada; la MSIENNA marrón claro suma antirreflejo.","type":"recommendation","title":"¿Cuál elegir?","position":"middle"},
    {"body":"Guardalos en el estuche y limpiá solo con la franela de microfibra. Si vas al mar o la pileta, enjuagalos con agua dulce antes de guardarlos.","type":"tip","title":"Para que duren","position":"bottom"}
  ]'::jsonb),
  updated_at = now()
WHERE slug = 'vulk-katleen';

COMMIT;
