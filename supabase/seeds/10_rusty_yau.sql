-- ============================================
-- Seed 10: Rusty Yau (sol) — anteojos deportivos con lentes 2 en 1
-- Fecha: 2026-05-29
-- Origen: importado desde MLA1432137395 (Tienda Oficial OPTICACARBALLO 260502)
-- ============================================
-- Característica clave del modelo Yau: viene con DOS lentes intercambiables
-- (1 par polarizado + 1 par amarilla no polarizada). El armazón es común
-- para todas las variantes; lo que cambia entre variantes es el color del
-- armazón y el color del par polarizado principal.
--
-- Nomenclatura modelo MBLK/S10 POL YELLOW:
--   MBLK = armazón Negro Mate
--   S10/POL = lentes Gris Oscuro polarizadas
--   YELLOW = incluye par adicional de lentes Amarillas
--
-- Variantes futuras: misma estructura, cambia el código del armazón y el
-- color del par polarizado. Todas comparten lentes amarillas como segundo par.
--
-- Datos completados por founder (2026-05-29):
--   SKU 126080, medidas 135/66/45/16/120mm, 3 fotos JPG
-- GAP único pendiente: weight_grams (founder mide con balanza, UPDATE simple)
-- ============================================

BEGIN;

-- =====================================================================
-- Producto base — características COMUNES a todas las variantes Yau
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
  'rusty-yau',
  'Rusty Yau',
  'Anteojos de sol deportivos 2 en 1: incluyen lentes polarizadas y un par adicional de lentes amarillas intercambiables. Pensados para ciclismo, running y outdoor.',
  E'Los Rusty Yau son anteojos deportivos pensados para uso al aire libre intenso — ciclismo, running, trail, kayak, pesca, deportes al sol. El diferencial: vienen con DOS pares de lentes intercambiables, así adaptás el anteojo a las condiciones del día sin cambiar de modelo.\n\nEl primer par —polarizado— es el que viene montado en el armazón. Las lentes polarizadas eliminan los reflejos del agua, asfalto y vidrio que generan fatiga visual durante el deporte. Sumado a la protección UV400 (filtro 100% UVA y UVB), tu vista queda protegida en condiciones de luz solar intensa.\n\nEl segundo par —amarillas— amplía el rango de uso. Las lentes amarillas aumentan el contraste y la percepción de profundidad en días nublados, niebla matinal o atardeceres. Son ideales para ciclismo en horas pico de tráfico o running antes del amanecer. No son polarizadas (la polarización es contraproducente con poca luz), pero mantienen el filtro UV.\n\nEl armazón es envolvente: cubre los ojos en toda su periferia, bloqueando el ingreso de luz lateral, polvo y viento durante la actividad. El material G-Flex (termoplástico flexible patentado por Rusty) aguanta torsiones, golpes y caídas mejor que un acetato tradicional. Las patillas no se rompen al doblarlas y la bisagra reforzada soporta uso intensivo.\n\nIncluye estuche original Rusty, franela de microfibra y el segundo par de lentes amarillas. Garantía oficial 1 año del fabricante contra defectos.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "envolvente",
    "lens_material": "policarbonato",
    "lens_treatment": ["polarized", "uv400"],
    "gender": "unisex",
    "line": "deportiva",
    "interchangeable_lenses": true,
    "lenses_included": [
      {
        "type": "polarized",
        "treatment": ["polarized", "uv400"],
        "default_mounted": true,
        "use_case": "sol intenso, agua, asfalto, conducción de día"
      },
      {
        "type": "yellow",
        "treatment": ["uv400"],
        "default_mounted": false,
        "use_case": "días nublados, niebla, atardecer, mayor contraste"
      }
    ],
    "measurements": {
      "frame_width_mm": 135,
      "lens_width_mm": 66,
      "lens_height_mm": 45,
      "bridge_mm": 16,
      "temple_length_mm": 120
    },
    "includes": ["estuche", "franela", "par-lentes-amarillas-adicionales"],
    "warranty_months": 12,
    "callouts": [
      {
        "type": "info",
        "position": "top",
        "title": "Sabías que…",
        "body": "Las lentes amarillas NO son polarizadas, y eso es a propósito. El polarizado funciona genial con sol intenso pero reduce visibilidad cuando hay poca luz (atardecer, niebla, días nublados). Las amarillas ahí amplifican el contraste y te dejan ver detalles que el ojo se pierde."
      },
      {
        "type": "recommendation",
        "position": "middle",
        "title": "Cuándo usar cada par",
        "body": "Polarizadas: ciclismo de día, running al sol, playa, pesca, manejar con sol. Amarillas: ciclismo urbano en hora pico, running antes del amanecer o al atardecer, días nublados, conducción nocturna en autopista. Cambiarlas toma 10 segundos."
      },
      {
        "type": "tip",
        "position": "bottom",
        "title": "Para que duren más",
        "body": "Guardá el par que no estás usando en el estuche original (incluido), no sueltos en la mochila. Limpiá siempre con la franela de microfibra (la remera raya el cristal). Si las usás para natación o piscina, enjuagá con agua dulce antes de guardarlas: el cloro y la sal degradan el tratamiento polarizado con el tiempo."
      }
    ],
    "imported_from": {
      "marketplace": "mercadolibre",
      "item_id": "MLA1432137395",
      "imported_at": "2026-05-29"
    }
  }'::jsonb,
  true,
  false,
  'Rusty Yau Anteojos Deportivos 2 en 1 | Óptica Carballo',
  'Anteojos Rusty Yau deportivos con lentes intercambiables: polarizadas + amarillas. Armazón envolvente G-Flex. Stock real, asesoramiento óptico matriculado y envíos a toda Argentina.'
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
-- Variante 126080 — Negro Mate / Lentes Gris Oscuro polarizadas
-- Modelo Rusty: MBLK/S10 POL YELLOW
--   MBLK = armazón Negro Mate
--   S10/POL = lentes Gris Oscuro polarizadas (par principal montado)
--   YELLOW = incluye par adicional amarillas (común a todas las variantes)
-- precio: $98.350,02 → 9835002 centavos
-- stock: 4 unidades
-- mercadolibre_item_id: MLA1432137395
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'rusty-yau'),
  '126080',
  '{
    "frame_color": "negro-mate",
    "lens_color": "gris-oscuro",
    "model_code": "MBLK/S10 POL YELLOW",
    "polarized": true
  }'::jsonb,
  9835002,
  4,
  true,
  1,
  'MLA1432137395'
)
ON CONFLICT (sku) DO UPDATE SET
  product_id           = EXCLUDED.product_id,
  attributes           = EXCLUDED.attributes,
  price_cents          = EXCLUDED.price_cents,
  stock_qty            = EXCLUDED.stock_qty,
  mercadolibre_item_id = EXCLUDED.mercadolibre_item_id,
  updated_at           = now();

-- =====================================================================
-- Imágenes — 3 archivos JPG en bucket "products"
-- Path canónico: rusty-yau/<filename>
-- Foto 1 y 2: específicas de la variante 126080 (armazón negro mate)
-- Foto 3: esquema técnico de medidas (aplica a TODAS las variantes Yau)
-- =====================================================================
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text,
  width, height, sort_order, is_primary
)
VALUES
  -- Foto primary: vista lateral 3/4 (la que provee mejor sensación de producto)
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-yau'),
    (SELECT id FROM public.product_variants WHERE sku = '126080'),
    'rusty-yau/01-lateral.jpg',
    'Rusty Yau anteojos deportivos vista lateral 3/4, armazón envolvente negro mate G-Flex',
    1500, 1000, 0, true
  ),
  -- Foto secundaria: vista frontal para hover crossfade
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-yau'),
    (SELECT id FROM public.product_variants WHERE sku = '126080'),
    'rusty-yau/02-frontal.jpg',
    'Rusty Yau anteojos deportivos vista frontal, armazón envolvente negro mate con lentes polarizadas',
    1500, 1000, 1, false
  ),
  -- Esquema técnico de medidas (común a todas las variantes Yau, variant_id=NULL)
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-yau'),
    NULL,
    'rusty-yau/03-medidas.jpg',
    'Esquema técnico de medidas Rusty Yau: frente 135mm, lente 66x45mm, puente 16mm, varilla 120mm',
    1500, 1500, 2, false
  )
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id  = EXCLUDED.variant_id,
  alt_text    = EXCLUDED.alt_text,
  sort_order  = EXCLUDED.sort_order,
  is_primary  = EXCLUDED.is_primary,
  updated_at  = now();

COMMIT;
