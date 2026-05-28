-- ============================================
-- Seed 06: Callouts Vulk Day Light (validados optical-expert) — V2
-- Fecha: 2026-05-28
-- ============================================
-- Iteración 2 tras feedback founder:
--   * Callouts más cortos (~250 chars cada uno, tweet length).
--   * Campo `position` agregado: top / middle / bottom — se renderizan
--     distribuidos en la descripción (uno arriba, uno en el medio,
--     uno al final) en vez de apilados al final.
--   * Tip enfocado en "para que no se rayen las lentes" como pidió
--     founder (más práctico que el cuidado genérico del material).
-- ============================================

BEGIN;

UPDATE public.products
SET
  attributes = attributes || '{
    "callouts": [
      {
        "type": "info",
        "position": "top",
        "title": "Sabías que…",
        "body": "Las lentes polarizadas tienen un filtro que funciona como una rejilla microscópica. Bloquea la luz horizontal de reflejos en agua, asfalto mojado y vidrios, dejando pasar el resto. Por eso ves los colores con más contraste. Es física pura, no marketing."
      },
      {
        "type": "recommendation",
        "position": "middle",
        "title": "Recomendación",
        "body": "Ideales para manejar de día, playa, montaña, pesca o cualquier exterior con reflejos. Vas a notar menos fatiga visual al sol. No los uses para manejar de noche: al filtrar luz polarizada, ves menos en ambientes oscuros."
      },
      {
        "type": "tip",
        "position": "bottom",
        "title": "Para que no se rayen las lentes",
        "body": "Usá siempre la franela de microfibra que viene con tus anteojos (la remera o un papel rayan el cristal). Lavalos con agua tibia y jabón neutro. Y nunca los dejes en la guantera del auto al sol: el calor deforma el G-Flex con el tiempo."
      }
    ]
  }'::jsonb,
  updated_at = now()
WHERE slug = 'vulk-day-light';

COMMIT;
