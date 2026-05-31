-- ============================================
-- Seed 23: Rusty Feeled MBLK TENNIS (sol) — anteojos deportivos de tenis
-- Fecha: 2026-05-31
-- Origen: importado desde MLA1897099326 (Tienda Oficial OPTICACARBALLO 260502)
-- ============================================
-- Producto distinto al Rusty Yau:
-- - Yau: lentes intercambiables (polarizadas + amarillas) + adaptador receta.
-- - Feeled: lente FIJA envolvente (no intercambiable, NO se cambian las lentes,
--   NO acepta adaptador para receta), pensado específicamente para tenis.
--
-- Single variant — el ML no tiene variations (variations: []).
-- SKU 960161 — MBLK TENNIS (Negro Mate frame + detalles verde en patillas).
--
-- Datos extraídos via /api/admin/ml-import-preview/MLA1897099326 (founder pasó JSON
-- 2026-05-31):
--   price 75010.75 ARS → 7501075 centavos
--   available_quantity 12 (sold 51 sobre 63 iniciales — bestseller)
--   family_id 4265700332752771, official store 260502
--   DETAILED_MODEL: "Rusty Feeled Mblk/Tennis"
--   FRAME_COLOR: "Anteojo Negro Mate"
--   TEMPLE_COLOR: "Anteojo Negro mate con Detalles en Verde"
--   LENS_COLOR: "Lentes Azules"
--   FRAME_MATERIAL + TEMPLE_MATERIAL: G-Flex
--   LENS_MATERIAL: Policarbonato
--   WITH_POLARIZED_LENS: false
--   WITH_UV_PROTECTION: true (UV400 confirmado founder)
--   BRIDGE_LENGTH: 18mm (cm en ML, convertido)
--
-- Medidas — DISCREPANCIA RESUELTA:
--   ML decía LENS_WIDTH 63mm. Founder confirmó 50mm según SITIO OFICIAL Rusty.
--   Vamos con 50mm (founder + sitio oficial Rusty = source of truth).
--   ML no es 100% confiable para medidas (otros sellers podrían cargar mal).
--
-- Construcción confirmada por founder:
--   - Lente fija envolvente (NO se cambian las lentes).
--   - NO tiene adaptador para lentes graduadas (a diferencia del Yau).
--   - Bisagras plásticas.
--   - Use case específico: tenis.
--
-- Founder sube 3 fotos al bucket `products/rusty-feeled/`:
--   01-lateral.jpg  (foto principal, vista lateral 3/4)
--   02-frontal.jpg  (vista frontal, para hover crossfade)
--   03-medidas.jpg  (esquema técnico de medidas, común al modelo)
-- Aplicar el seed DESPUÉS de subir las fotos para que is_active=true tenga
-- imágenes reales servibles.
-- ============================================

BEGIN;

-- =====================================================================
-- Producto base
-- =====================================================================
WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol  AS (
    SELECT id FROM public.categories
    WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL
  )
INSERT INTO public.products (
  brand_id, category_id, slug, name,
  short_description, description, attributes,
  is_active, is_featured, meta_title, meta_description
)
VALUES (
  (SELECT id FROM rusty),
  (SELECT id FROM sol),
  'rusty-feeled',
  'Rusty Feeled',
  'Anteojos de sol deportivos envolventes pensados para tenis: lente azul de policarbonato con ventilación lateral, armazón G-Flex liviano (25g) y patillas con detalles en verde.',
  E'Los Rusty Feeled son anteojos de sol deportivos diseñados específicamente para tenis. El armazón envolvente cubre los ojos en toda su periferia, bloqueando el ingreso de luz lateral, polvo y viento durante el juego — clave cuando girás la cabeza siguiendo la pelota en el saque, en la red o al recibir un revés cruzado.\n\nLa lente es de policarbonato, un material liviano y resistente a impactos: si una pelota te pega de frente, el lente absorbe el impacto sin astillarse (a diferencia del cristal templado, que se puede romper en pedazos). El tinte azul reduce el reflejo de la luz solar intensa sobre la cancha de polvo de ladrillo, cemento o sintético, manteniendo el contraste necesario para distinguir bien la pelota amarilla.\n\nLa protección UV400 (100% de filtrado de rayos UVA y UVB) protege tus ojos durante partidos largos al aire libre, donde la exposición acumulada puede generar fatiga visual y daño a largo plazo en la retina y el cristalino.\n\nUna característica funcional clave es la ventilación lateral del lente (air ventilation): pequeñas aberturas en el frame reducen el empañamiento cuando jugás bajo el sol y transpirás. Sin esa ventilación, el aire caliente queda atrapado entre la lente y la cara y los anteojos se empañan en pocos juegos — con air ventilation, el flujo de aire mantiene la visión clara durante todo el partido.\n\nEl material G-Flex (termoplástico flexible patentado por Rusty) aplica tanto al frente como a las patillas. Resiste torsiones, golpes y caídas mejor que un acetato tradicional. Las patillas no se rompen al doblarlas, y el peso total de 25 gramos es de los más livianos en su categoría: prácticamente no los sentís durante el juego.\n\nLos detalles en verde sobre las patillas negras son característicos del modelo (variante MBLK TENNIS). Las bisagras son de plástico reforzado, simples y resistentes — sin tornillos diminutos que se pierden ni mecanismos que pueden trabarse con el sudor.\n\nIMPORTANTE para usuarios con receta: el Rusty Feeled NO acepta adaptador interno para lentes graduadas. La lente envolvente es fija y no se puede reemplazar por una graduada. Si necesitás receta para hacer deporte, mirá el modelo Rusty Yau, que sí tiene adaptador, o consultanos por WhatsApp.\n\nIncluye estuche original Rusty y franela de microfibra. Garantía oficial 1 año del fabricante contra defectos.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "envolvente",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_features": ["air_ventilation"],
    "gender": "unisex",
    "line": "deportiva",
    "use_case": ["tenis", "deporte-outdoor"],
    "interchangeable_lenses": false,
    "prescription_adapter": false,
    "hinge_material": "plastico",
    "measurements": {
      "frame_width_mm": 140,
      "lens_width_mm": 50,
      "lens_height_mm": 45,
      "bridge_mm": 18,
      "temple_length_mm": 145
    },
    "weight_grams": 25,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {
        "type": "info",
        "position": "top",
        "title": "¿Por qué envolvente para tenis?",
        "body": "El envolvente cubre la periferia del campo visual lateral. En tenis, girás la cabeza siguiendo la pelota — un wayfarer clásico te deja ver luz fuerte por los costados en ese movimiento y te fatiga la vista. El envolvente bloquea esa luz periférica y el viento contra los ojos."
      },
      {
        "type": "recommendation",
        "position": "middle",
        "title": "Air ventilation: por qué importa",
        "body": "Cuando transpirás bajo el sol, el aire caliente queda atrapado entre el lente y la cara y los anteojos se empañan rápido. La ventilación lateral del Feeled deja circular aire, manteniendo la visión clara durante todo el partido. Es la diferencia entre tener que sacarse los anteojos cada game o jugar continuo."
      },
      {
        "type": "warning",
        "position": "bottom",
        "title": "Si necesitás receta",
        "body": "El Rusty Feeled NO acepta adaptador para lentes graduadas — la lente es fija envolvente y no se puede reemplazar. Si tenés miopía, astigmatismo o presbicia y querés un anteojo deportivo recetado, mirá el Rusty Yau (que sí incluye adaptador interno extraíble) o escribinos por WhatsApp y te asesoramos."
      }
    ],
    "imported_from": {
      "marketplace": "mercadolibre",
      "item_id": "MLA1897099326",
      "imported_at": "2026-05-31"
    }
  }'::jsonb,
  true,
  false,
  'Rusty Feeled Anteojos de Sol Deportivos para Tenis | Óptica Carballo',
  'Anteojos Rusty Feeled deportivos para tenis: lente azul policarbonato, armazón envolvente G-Flex, ventilación lateral, UV400. 25g, livianos. Stock real y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name              = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description       = EXCLUDED.description,
  attributes        = EXCLUDED.attributes,
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  updated_at        = now();

-- =====================================================================
-- Variante SINGLE 960161 — MBLK TENNIS (Negro Mate + Detalles Verde)
-- ML single variant (variations: []) → mercadolibre_variation_code = NULL.
-- precio: $75.010,75 → 7501075 centavos
-- stock: 12 unidades (sold 51 sobre 63 iniciales)
-- mercadolibre_item_id: MLA1897099326
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'rusty-feeled'),
  '960161',
  '{
    "frame_color": "negro-mate",
    "lens_color": "azul",
    "temple_color": "negro-mate-con-detalles-verde",
    "model_code": "MBLK TENNIS"
  }'::jsonb,
  7501075,
  12,
  true,
  1,
  'MLA1897099326',
  NULL
)
ON CONFLICT (sku) DO UPDATE SET
  product_id                  = EXCLUDED.product_id,
  attributes                  = EXCLUDED.attributes,
  price_cents                 = EXCLUDED.price_cents,
  stock_qty                   = EXCLUDED.stock_qty,
  mercadolibre_item_id        = EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code = EXCLUDED.mercadolibre_variation_code,
  updated_at                  = now();

-- =====================================================================
-- Imágenes — 3 archivos JPG en bucket "products"
-- Path canónico: rusty-feeled/<filename>
-- Foto 1 y 2: específicas de la variante (vista lateral + frontal)
-- Foto 3: esquema técnico de medidas (aplica al modelo, variant_id=NULL)
-- =====================================================================
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text,
  width, height, sort_order, is_primary
)
VALUES
  -- Foto primary: vista lateral 3/4 (best perceived product feel)
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-feeled'),
    (SELECT id FROM public.product_variants WHERE sku = '960161'),
    'rusty-feeled/01-lateral.jpg',
    'Rusty Feeled anteojos deportivos para tenis vista lateral 3/4, armazón envolvente negro mate con detalles verde en patillas, lente azul policarbonato',
    1500, 1000, 0, true
  ),
  -- Foto secundaria: vista frontal (hover crossfade)
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-feeled'),
    (SELECT id FROM public.product_variants WHERE sku = '960161'),
    'rusty-feeled/02-frontal.jpg',
    'Rusty Feeled anteojos deportivos para tenis vista frontal, lente azul envolvente con ventilación lateral, armazón G-Flex liviano',
    1500, 1000, 1, false
  ),
  -- Esquema técnico de medidas (común al modelo, variant_id=NULL)
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-feeled'),
    NULL,
    'rusty-feeled/03-medidas.jpg',
    'Esquema técnico de medidas Rusty Feeled: frente 140mm, lente 50x45mm, puente 18mm, varilla 145mm',
    1500, 1500, 2, false
  )
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id  = EXCLUDED.variant_id,
  alt_text    = EXCLUDED.alt_text,
  sort_order  = EXCLUDED.sort_order,
  is_primary  = EXCLUDED.is_primary,
  updated_at  = now();

COMMIT;
