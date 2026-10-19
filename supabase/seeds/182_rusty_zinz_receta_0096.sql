-- ============================================
-- Seed 182: Rusty Zinz Optics RECETA, 4ª variante 0096-SBLK OPTICAL (SKU 126802): frente azul brillo con patillas negro brillo
-- Fecha: 2026-10-19
-- ============================================
-- Item simple de ML (cada color del Zinz de receta es una publicación propia, `variation_code` NULL), tradicional (`catalog_listing:false`), categoría MLA417127, ACTIVO, publicado por el founder el 2026-10-19 y verificado por API:
--   0096-SBLK OPTICAL  SKU 126802  MLA4099872296 (MLAU5565985691)  $83.290 → 8329000c  stock 2  "0096-SBLK / Azul Brillo - Patillas Negro Brillo", Sin género
-- Mismas medidas y peso que el resto del Zinz (137 / 51x42 / 20 / 145, 25,7 g): no cambian.
-- ⚠️ La web de Rusty dice "Blue Cut" para el Zinz; el founder no lo confirmó para esta variante: NO se menciona.
-- 🧹 CORRECCIÓN DE TEXTO DEL PRODUCTO (el texto viejo del seed 78 contradecía las reglas de hoy): "G-Flex flexible" (G-Flex es el nombre del material, no autoriza a decir flexible; "flex" es la bisagra), "liviano (25,7 g)" (25,7 g es peso medio: se dice el peso), "blue light" y la promesa "7-10 días hábiles" (no se prometen plazos que no controlamos). Se reescriben short, descripción, meta_description y callouts para 4 colores; el link a Penc (frase de vuelta del seed 179) se conserva.
-- 📸 FOTOS: oficiales de Rusty (900×442) pasadas por `pnpm placas --tipo receta` y subidas con `pnpm fotos:subir --sufijo -0096`: `rusty-zinz-receta/perfil-0096.jpg` y `frente-0096.jpg` (2000×1333, scale 1.05). El `medidas.png` sigue siendo la última (sort 99).
-- ============================================

BEGIN;

UPDATE public.products SET
  short_description = 'Anteojos recetados Rusty Zinz: armazón cuadrado unisex con frente y patillas de G-Flex y bisagras metálicas con sistema flex (25,7 g). En 4 colores. Viene con lentes de demostración, sin graduación: le sumás los cristales con tu receta.',
  description = E'El **Rusty Zinz Optics** es un armazón de receta **cuadrado unisex**, con **frente y patillas de G-Flex** y **bisagras metálicas con sistema flex**: la patilla acompaña el movimiento al abrir y cerrar. Pesa 25,7 g.\n\nMedidas: frente 137 mm · lente 51 mm de ancho × 42 mm de alto · puente 20 mm · varilla 145 mm.\n\nViene con lentes de demostración, sin graduación. Sumale tus cristales con receta: monofocales, bifocales, progresivos o multifocales.\n\nDisponible en 4 colores:\n\n• 669K-SBLK, gris oscuro con patillas negro brillo.\n• MBLK, negro mate.\n• SBLK, negro brillo.\n• 0096-SBLK, frente azul brillo con patillas negro brillo.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.\n\nSi te gusta el cuadrado pero con esquinas más redondeadas, mirá los [Rusty Penc Optics](/anteojos-de-receta/rusty/rusty-penc-receta).',
  meta_description = 'Armazón de receta Rusty Zinz: cuadrado unisex de G-Flex (25,7 g), bisagras metálicas con sistema flex, 4 colores. Apto monofocal y multifocal. Envíos a toda Argentina.',
  attributes = jsonb_set(jsonb_set(attributes, '{callouts}', '[
    {"type": "info", "position": "top", "title": "Cuadrado unisex de G-Flex", "body": "Frente y patillas de G-Flex, con bisagras metálicas con sistema flex. Forma cuadrada, para hombre o mujer. Pesa 25,7 g."},
    {"type": "tip", "position": "middle", "title": "Apto para tu graduación", "body": "Acepta lentes monofocales, bifocales, progresivos y multifocales. Si tenés dudas con tu receta o querés saber si te sirve para progresivos, escribinos antes de comprar."},
    {"type": "recommendation", "position": "bottom", "title": "Cómo cotizar tu receta", "body": "Escribinos por WhatsApp con una foto de tu receta. Te pasamos el costo de los cristales según tu graduación y los tratamientos que quieras (antirreflejo, fotocromático)."}
  ]'::jsonb), '{hinge_system}', '"flex"'::jsonb),
  updated_at = now()
WHERE slug = 'rusty-zinz-receta';

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-zinz-receta'), '126802',
   '{"frame_color":"azul-brillo-patillas-negro-brillo","model_code":"0096-SBLK OPTICAL"}'::jsonb,
   8329000, 2, true, 4, 'MLA4099872296', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-zinz-receta'), (SELECT id FROM public.product_variants WHERE sku='126802'),
   'rusty-zinz-receta/perfil-0096.jpg', 'Anteojos de receta Rusty Zinz cuadrados de G-Flex, vista lateral, frente azul brillo con patillas negro brillo y lentes de demostración', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zinz-receta'), (SELECT id FROM public.product_variants WHERE sku='126802'),
   'rusty-zinz-receta/frente-0096.jpg', 'Anteojos de receta Rusty Zinz cuadrados de G-Flex, vista frontal, frente azul brillo con patillas negro brillo y lentes de demostración', 2000, 1333, 7, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
