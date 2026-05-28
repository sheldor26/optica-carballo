-- ============================================
-- Seed 05: Polish SEO + copy onda Vulk Day Light
-- Fecha: 2026-05-28
-- ============================================
-- Tras carga de keywords de Ubersuggest (cluster Vulk en SEO_STRATEGY.md),
-- regenero copy + meta del Vulk Day Light:
--
--   * meta_title nuevo arrancando con "Lentes de Sol Vulk" (1.300 vol/mes,
--     6× más que "anteojos de sol hombre vulk" con 210). Captura la
--     keyword head crítica del cluster Vulk.
--   * meta_description con "anteojos" + "polarizados" + trust signal
--     técnico óptico matriculado. SIN mencionar ciudad (Córdoba era
--     invento del agente — la óptica está en Virasoro, Corrientes).
--   * short_description ampliada con "lentes/anteojos" + keywords.
--   * description re-escrita por content-writer-medical (1.087 chars,
--     ~30% más extensa). Estructura: hook + G-Flex/peso/uso + polarizado
--     + variante + 1 línea sobre estuche oficial Vulk.
--   * Limpieza JSONB: NO meter "interchangeable_lenses" (founder dijo no).
--     Mantenemos lo demás.
-- ============================================

BEGIN;

UPDATE public.products
SET
  short_description = 'Anteojos de sol Vulk Day Light polarizados, armazón rectangular pequeño en G-Flex carey brillo con lentes verdes. Liviano, unisex, ideal para uso urbano.',
  description = E'Los lentes de sol Vulk Day Light son un rectangular pequeño pensado para quien busca un anteojo discreto, prolijo y con buen agarre al rostro. Diseño unisex, líneas limpias y un peso de 26,1 gramos que casi no se siente durante el día.\n\nEl armazón está hecho en G-Flex, el termoplástico patentado por Vulk: flexible, resistente a torsiones y a los apretones del bolsillo. Las patillas acompañan el movimiento sin perder firmeza, y las bisagras reforzadas aguantan el uso diario. Funciona tanto para manejar como para caminar la ciudad o moverte al aire libre.\n\nLas lentes polarizadas verdes cortan los reflejos del asfalto, el agua y los vidrios, y suman protección UV total. Tené en cuenta una cosa: como toda lente polarizada, las pantallas LCD del tablero del auto, GPS o cajeros pueden verse oscurecidas o con efecto arcoíris según el ángulo. Es propio del polarizado, no un defecto.\n\nEsta versión viene en carey brillo, una variante clásica que combina con casi todo y suaviza los rasgos. Se entrega con su estuche original de Vulk. Stock real en Óptica Carballo, con asesoramiento técnico matriculado.',
  meta_title = 'Lentes de Sol Vulk Day Light Polarizados | Óptica Carballo',
  meta_description = 'Anteojos de sol Vulk Day Light polarizados, armazón G-Flex carey brillo. Stock real, asesoramiento óptico matriculado y envíos a toda Argentina.',
  updated_at = now()
WHERE slug = 'vulk-day-light';

COMMIT;
