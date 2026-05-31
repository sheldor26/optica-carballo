-- ════════════════════════════════════════════════════════════════════════
-- Migración: swipe_matches
-- Propósito: persistir "matches" del swipe (Opción Y Tinder de monturas)
-- por usuario logueado. Usuarios anónimos siguen usando localStorage
-- (se sincronizan a DB al loguearse, en server action).
-- ════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.swipe_matches (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_slug)
);

CREATE INDEX IF NOT EXISTS idx_swipe_matches_user
  ON public.swipe_matches(user_id, created_at DESC);

-- ──────────────────────────────────────────────────────────────────────
-- RLS: el usuario solo ve y modifica SUS propios matches.
-- ──────────────────────────────────────────────────────────────────────
ALTER TABLE public.swipe_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_can_select_own_matches"
  ON public.swipe_matches FOR SELECT
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "users_can_insert_own_matches"
  ON public.swipe_matches FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "users_can_delete_own_matches"
  ON public.swipe_matches FOR DELETE
  USING (user_id = (SELECT auth.uid()));

COMMENT ON TABLE public.swipe_matches IS
  'Productos del catálogo a los que el usuario dio swipe-derecha en /descubrir. Persistencia para usuarios logueados (anónimos: localStorage). Se sincronizan al login.';
