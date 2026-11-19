-- ============================================================================
-- product_embeddings: búsqueda exacta en vez del índice ivfflat
-- ============================================================================
-- El índice `idx_product_embeddings_vector` (ivfflat, 100 listas) se creó con la
-- tabla VACÍA, así que sus centros quedaron mal calculados. Con ~158 productos y
-- `probes = 1` cada consulta solo mira UNA lista: `match_products` devolvía 0 o
-- 16 productos aunque hubiera 154 con stock (medido el 2026-11-19 con umbral -1
-- y count 200). Para un catálogo de este tamaño la búsqueda exacta cuesta
-- milisegundos y devuelve todo lo que corresponde.
--
-- Reversible. Si el catálogo crece mucho (miles de productos), crear un índice
-- HNSW (`USING hnsw (embedding vector_cosine_ops)`), que no depende de cargar
-- datos antes, en vez de volver a ivfflat.
-- ============================================================================

DROP INDEX IF EXISTS public.idx_product_embeddings_vector;
