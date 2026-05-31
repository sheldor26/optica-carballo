-- ============================================
-- Seed 25: Rusty Dearly — fix descripción (honestidad bisagras + formato bullets)
-- Fecha: 2026-05-31
-- ============================================
-- 2 cambios sobre la descripción del producto `rusty-dearly`:
--
-- 1. HONESTIDAD bisagras (regla dura negocio #3 — no prometer lo que no se cumple):
--    ANTES: "Las bisagras son plásticas reforzadas, simples y resistentes
--    — sin tornillos diminutos que se aflojan con el tiempo."
--    DESPUÉS: "Las bisagras son de plástico reforzado, simples y resistentes
--    para uso diario."
--    Razón: el Dearly SÍ tiene tornillos en la bisagra. La frase original
--    podía generar disgusto en un comprador que abre la caja y ve tornillos.
--
-- 2. FORMATO bullets de variantes: separar título de descripción con salto
--    de línea + arrancar con mayúscula (mejor legibilidad).
--    ANTES: "• Rosa caramelo ... (0292): la opción más femenina..."
--    DESPUÉS:
--      "• Rosa caramelo ... (0292):
--       La opción más femenina..."
-- ============================================

BEGIN;

UPDATE public.products
SET
  description = E'Los Rusty Dearly son anteojos de sol cuadrados de línea femenina, pensados para uso urbano diario: paseo, manejo de día, salidas al aire libre. El diseño cuadrado de esquinas suavizadas es uno de los más versátiles para rostros redondos y ovalados — agrega estructura sin endurecer los rasgos.\n\nEl frente y las patillas están construidos en G-Flex, un termoplástico flexible patentado por Rusty que resiste torsiones, golpes y caídas mejor que un acetato tradicional. El peso total es de 17,3 gramos: prácticamente no los sentís durante el día, incluso usándolos varias horas seguidas.\n\nLa lente es de policarbonato, un material liviano y resistente a impactos que protege los ojos en caso de golpe sin astillarse (a diferencia del cristal templado, que se puede romper en pedazos). La protección es UV400 categoría 3: filtra el 100% de los rayos UVA y UVB y bloquea entre el 82% y el 92% de la luz visible, el rango adecuado para sol intenso de exterior sin llegar al extremo de las categorías 4 (que NO se pueden usar manejando).\n\nLas bisagras son de plástico reforzado, simples y resistentes para uso diario.\n\nDisponible en 3 variantes con identidades muy distintas:\n\n• Rosa caramelo con lentes grises degrade (0292 / G. ORANGE):\nLa opción más femenina y luminosa, ideal para outfits primaverales y verano. El degradé en gris suaviza la transición visual entre el lente y la cara.\n\n• Marrón brillo con lentes marrón degrade (BROWN / GB10):\nTono cálido y sofisticado, combina con casi cualquier tono de piel y outfit. El lente marrón degrade es excelente para días de sol fuerte porque mantiene la calidez de los colores reales (a diferencia del gris, que tiende a apagarlos).\n\n• Negro brillo con lentes gris oscuro degrade POLARIZADAS (SBLK / SG91 POL):\nLa opción premium para quien busca máxima eliminación de reflejos. Las lentes polarizadas neutralizan los reflejos del asfalto, agua, capots y vidrios — claves para manejo de día y actividades al aire libre cerca del agua. Esta variante es la única polarizada del modelo.\n\nIncluye estuche original Rusty y franela de microfibra. Garantía oficial 1 año del fabricante contra defectos.',
  updated_at = now()
WHERE slug = 'rusty-dearly';

COMMIT;
