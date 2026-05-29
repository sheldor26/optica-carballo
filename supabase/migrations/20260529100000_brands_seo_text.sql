-- Migración: agrega columnas seo_intro y seo_outro a brands.
-- Usadas por la página /anteojos-de-{sol,receta}/[brand] para renderizar
-- texto extenso optimizado para SEO (mejora keyword density + profundidad
-- semántica → señal positiva para Google).
--
-- - seo_intro: 150-300 palabras renderizadas debajo del H1 y antes de la
--   grilla de productos. Texto descriptivo de la marca aplicado al contexto
--   de óptica (qué tipo de anteojos hace, target, líneas).
-- - seo_outro: 80-150 palabras renderizadas al final de la página, después
--   de los productos y FAQs. Texto de cierre con keywords secundarias.
--
-- Ambos campos son nullable: si la marca no tiene texto cargado, no se
-- renderiza nada (mejor que renderizar contenido vacío o placeholder).

ALTER TABLE brands
  ADD COLUMN IF NOT EXISTS seo_intro TEXT,
  ADD COLUMN IF NOT EXISTS seo_outro TEXT;

COMMENT ON COLUMN brands.seo_intro IS
  'Texto introductorio extenso (150-300 palabras) para SEO. Renderizado bajo el H1 de la página de marca.';

COMMENT ON COLUMN brands.seo_outro IS
  'Texto de cierre (80-150 palabras) para SEO. Renderizado al pie de la página de marca.';
