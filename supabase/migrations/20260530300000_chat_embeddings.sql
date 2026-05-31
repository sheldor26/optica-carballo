-- ════════════════════════════════════════════════════════════════════════
-- Migración: chat_embeddings
-- Propósito: infraestructura RAG para el asistente conversacional (K).
--
-- Componentes:
-- 1. Habilitar extension `vector` (pgvector) — embeddings de OpenAI
--    text-embedding-3-small son 1536 dims.
-- 2. Tabla `product_embeddings`: 1 row por producto activo con embedding
--    del texto "name + brand + description + attributes".
-- 3. Función `match_products`: similarity search via cosine distance.
--    Devuelve top-N productos más similares a un query embedding.
-- 4. RLS: tabla solo accesible vía service_role (script de embed corre con
--    service_role, endpoint /api/chat también con service_role).
-- ════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS vector;

-- ──────────────────────────────────────────────────────────────────────
-- Tabla de embeddings por producto.
-- ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_embeddings (
  product_id uuid PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
  -- 1536 dims = text-embedding-3-small (más barato + suficiente para
  -- catálogo de óptica con <500 productos esperados).
  embedding vector(1536) NOT NULL,
  -- Texto exacto que se embeded — para regenerar si el modelo cambia o
  -- si queremos invalidar selectivamente.
  source_text text NOT NULL,
  -- Modelo usado para generar. Si cambiamos modelo, podemos re-embed
  -- solo los rows con modelo distinto.
  embedding_model text NOT NULL DEFAULT 'text-embedding-3-small',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_embeddings_vector
  ON public.product_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- ──────────────────────────────────────────────────────────────────────
-- Función match_products: similarity search top-N.
--
-- Devuelve solo productos ACTIVOS con stock real (in stock + active).
-- Threshold sirve para filtrar matches débiles (cosine similarity > 0.3
-- es decente para queries en español argentino sobre óptica).
-- ──────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.match_products(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.3,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  product_id uuid,
  product_slug text,
  product_name text,
  brand_slug text,
  brand_name text,
  category_slug text,
  short_description text,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS product_id,
    p.slug AS product_slug,
    p.name AS product_name,
    b.slug AS brand_slug,
    b.name AS brand_name,
    p.category_slug,
    p.short_description,
    1 - (pe.embedding <=> query_embedding) AS similarity
  FROM public.product_embeddings pe
  JOIN public.products p ON p.id = pe.product_id
  JOIN public.brands b ON b.id = p.brand_id
  WHERE p.is_active = true
    AND EXISTS (
      SELECT 1 FROM public.product_variants pv
      WHERE pv.product_id = p.id
        AND pv.is_active = true
        AND pv.stock_qty > 0
    )
    AND (1 - (pe.embedding <=> query_embedding)) > match_threshold
  ORDER BY pe.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ──────────────────────────────────────────────────────────────────────
-- RLS: solo service_role accede. Endpoint /api/chat corre server-side
-- con service_role key. Script de embeddings también.
-- Los usuarios públicos NO acceden directo (eso sería costoso + filtrable
-- desde el frontend); el endpoint /api/chat hace la query autenticada.
-- ──────────────────────────────────────────────────────────────────────
ALTER TABLE public.product_embeddings ENABLE ROW LEVEL SECURITY;

-- No creamos policies → tabla queda inaccesible para anon/authenticated.
-- service_role bypassa RLS por default.

COMMENT ON TABLE public.product_embeddings IS
  'Embeddings vectoriales de productos para RAG en asistente conversacional. Generados con OpenAI text-embedding-3-small (1536 dims). Solo accesible vía service_role.';

COMMENT ON FUNCTION public.match_products IS
  'Búsqueda semántica de productos por similitud coseno. Filtra solo activos con stock. Threshold default 0.3 (cosine similarity).';
