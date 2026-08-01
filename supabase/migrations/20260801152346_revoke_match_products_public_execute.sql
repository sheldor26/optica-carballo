-- ============================================================================
-- Migración — REVOKE EXECUTE de match_products para anon/authenticated
-- ============================================================================
-- Hallazgo #12, audit 2026-08-01: a diferencia de `reserve_stock` e
-- `increment_variant_stock` (migración 00006), `match_products` (RPC del
-- chat RAG, migración `20260530300000_chat_embeddings.sql`) nunca revocó el
-- `EXECUTE` que Postgres otorga a `PUBLIC` por default en funciones nuevas.
-- Cualquiera puede llamar `supabase.rpc('match_products', {...})` directo
-- desde el browser con la anon key, bypasseando el rate-limit de
-- `/api/chat`. No filtra datos sensibles (solo catálogo público activo),
-- pero rompe el control de costos que el comentario original de la función
-- dice buscar ("solo accesible vía service_role").
-- ============================================================================

REVOKE ALL ON FUNCTION public.match_products(vector, float, int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.match_products(vector, float, int) TO service_role;

-- ============================================================================
-- Rollback plan
-- ============================================================================
-- GRANT EXECUTE ON FUNCTION public.match_products(vector, float, int) TO PUBLIC;
-- (No debería hacer falta — el único caller legítimo es /api/chat con
-- service_role, que ya sigue funcionando igual con este REVOKE.)
