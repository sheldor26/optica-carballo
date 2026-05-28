-- ============================================
-- Seed 06: Callouts Vulk Day Light (validados por optical-expert)
-- Fecha: 2026-05-28
-- ============================================
-- Sistema nuevo de "callouts" / bloques visuales destacados en página
-- de producto. Schema: attributes.callouts = JSONB array de objetos
-- {type, title?, body}. Tipos válidos: info | tip | recommendation
-- | warning. Renderizado por components/product/product-callouts.tsx
-- después de la descripción larga.
--
-- Estos 3 callouts del Vulk Day Light fueron validados técnicamente
-- por el agente optical-expert (lentes polarizadas funcionan
-- físicamente con rejilla microscópica vertical; recomendación de
-- uso real; cuidado del G-Flex como termoplástico).
-- ============================================

BEGIN;

UPDATE public.products
SET
  attributes = attributes || '{
    "callouts": [
      {
        "type": "info",
        "title": "Sabías que…",
        "body": "Las lentes polarizadas tienen un filtro interno que funciona como una rejilla microscópica orientada verticalmente. Cuando la luz rebota sobre superficies planas (agua, asfalto mojado, capó del auto, vidrio), las ondas se polarizan horizontalmente y generan ese encandilamiento típico. La rejilla bloquea esa luz horizontal y deja pasar el resto, por eso ves los reflejos atenuados y los colores con más contraste. No es marketing: es óptica básica."
      },
      {
        "type": "recommendation",
        "title": "Recomendación",
        "body": "Son ideales para manejar de día, playa, montaña, pesca, nieve y cualquier exterior con reflejos. Vas a notar menos fatiga visual en jornadas largas al sol. No los uses para manejar de noche ni en condiciones de poca luz: al filtrar luz polarizada y reducir la transmitancia general, ves menos en ambientes oscuros. Como ya mencionamos arriba, algunas pantallas del auto pueden verse raras o desaparecer según el ángulo."
      },
      {
        "type": "tip",
        "title": "Para que duren",
        "body": "El G-Flex es un termoplástico flexible que tolera bien la torsión sin partirse, lo que ayuda en el uso diario y en caídas leves. Para limpiarlos, usá agua tibia con una gota de jabón neutro y secá con un paño de microfibra (el de los lentes, no remera ni papel). Evitá dejarlos en la guantera del auto al sol: el calor extremo deforma cualquier termoplástico con el tiempo. Cuando no los uses, guardalos en su estuche rígido."
      }
    ]
  }'::jsonb,
  updated_at = now()
WHERE slug = 'vulk-day-light';

COMMIT;
