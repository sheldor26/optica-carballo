-- ============================================
-- Seed 01: Categorías top-level + marcas reales
-- Fecha: 2026-05-28
-- ADRs: 004 (URLs), 023 (semántica is_argentine), 009 (Paula Cahen confirmada)
-- Idempotente: usa ON CONFLICT DO NOTHING.
-- ============================================

BEGIN;

-- =====================================================================
-- Categorías top-level (parent_id NULL)
-- Los slugs coinciden con los segmentos de URL definidos en ADR-004.
-- =====================================================================
INSERT INTO public.categories (slug, name, description, meta_title, meta_description, is_active, sort_order)
VALUES
  (
    'anteojos-de-sol',
    'Anteojos de sol',
    'Anteojos de sol de marcas argentinas e internacionales con protección UV.',
    'Anteojos de sol — Óptica Carballo',
    'Anteojos de sol de Rusty, Vulk, Reef, Mormaii y Paula Cahen D''Anvers. Envíos a todo el país.',
    true,
    1
  ),
  (
    'anteojos-de-receta',
    'Anteojos de receta',
    'Armazones para anteojos con cristales graduados según tu receta oftalmológica.',
    'Anteojos de receta — Óptica Carballo',
    'Armazones de anteojos de receta de Rusty, Vulk, Reef, Mormaii y Paula Cahen D''Anvers. Asesoramiento óptico profesional.',
    true,
    2
  )
ON CONFLICT (parent_id, slug) DO NOTHING;

-- =====================================================================
-- Marcas reales con stock confirmado al 2026-05-28
-- is_argentine = true para las 5 según ADR-023 (semántica = presencia AR,
-- no origen estricto). Mormaii es brasilera de origen pero pensada como local.
-- =====================================================================
INSERT INTO public.brands (slug, name, description, is_argentine, is_active, sort_order, meta_title, meta_description)
VALUES
  (
    'rusty',
    'Rusty',
    'Marca de surf/skate lifestyle con anteojos de sol y armazones de receta. Estética joven y diseños icónicos.',
    true,
    true,
    1,
    'Rusty — Anteojos de sol y receta',
    'Anteojos Rusty oficiales en Óptica Carballo. Sol y receta, envíos a todo Argentina.'
  ),
  (
    'vulk',
    'Vulk',
    'Marca argentina con buena relación precio/calidad. Líneas completas de anteojos de sol y de receta.',
    true,
    true,
    2,
    'Vulk — Anteojos de sol y receta',
    'Anteojos Vulk oficiales en Óptica Carballo. Modelos para todos los estilos, sol y receta.'
  ),
  (
    'reef',
    'Reef',
    'Beach lifestyle. Anteojos de sol y receta con onda californiana, distribución argentina.',
    true,
    true,
    3,
    'Reef — Anteojos de sol y receta',
    'Anteojos Reef en Óptica Carballo. Estética beach lifestyle, sol y receta con envíos a todo el país.'
  ),
  (
    'mormaii',
    'Mormaii',
    'Marca con fuerte presencia argentina. Estilo surf/outdoor, anteojos de sol y receta.',
    true,
    true,
    4,
    'Mormaii — Anteojos de sol y receta',
    'Anteojos Mormaii en Óptica Carballo. Sol y receta, calidad y diseño outdoor.'
  ),
  (
    'paula-cahen-danvers',
    'Paula Cahen D''Anvers',
    'Colección argentina diseñada por Paula Cahen D''Anvers. Anteojos de sol y receta con estilo femenino y elegante.',
    true,
    true,
    5,
    'Paula Cahen D''Anvers — Anteojos de sol y receta',
    'Anteojos Paula Cahen D''Anvers en Óptica Carballo. Colección oficial, sol y receta.'
  )
ON CONFLICT (slug) DO NOTHING;

COMMIT;
