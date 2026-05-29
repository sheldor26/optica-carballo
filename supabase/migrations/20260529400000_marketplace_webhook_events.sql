-- ============================================
-- Migration: tabla marketplace_webhook_events para idempotencia
-- ============================================
-- Sprint 2b ML — webhook real con procesamiento. ML reintenta webhooks si
-- nuestro endpoint no devuelve 2xx en ~5s. Sin tracking de IDs procesados,
-- la 2da llegada del mismo evento procesa todo de nuevo (oversell, stock
-- divergent).
--
-- Schema:
-- - id text PRIMARY KEY: el `_id` que manda ML en cada webhook (UUID).
-- - marketplace text: 'mercadolibre' por ahora, futuro extensible.
-- - topic text: items, orders_v2, etc.
-- - resource text: el path del recurso (/items/MLA..., /orders/...).
-- - external_user_id text: seller_id del que vino el evento.
-- - status text: 'processed' | 'failed' | 'ignored'.
-- - payload jsonb: copia del payload original para debug.
-- - processed_at timestamptz.
-- - error_message text nullable.
-- ============================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.marketplace_webhook_events (
  id text PRIMARY KEY,
  marketplace text NOT NULL CHECK (marketplace IN ('mercadolibre')),
  topic text NOT NULL,
  resource text NOT NULL,
  external_user_id text,
  status text NOT NULL CHECK (status IN ('processed', 'failed', 'ignored')),
  payload jsonb NOT NULL,
  error_message text,
  processed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS marketplace_webhook_events_topic_idx
  ON public.marketplace_webhook_events (topic, processed_at DESC);

CREATE INDEX IF NOT EXISTS marketplace_webhook_events_status_idx
  ON public.marketplace_webhook_events (status, processed_at DESC)
  WHERE status = 'failed';

-- RLS strict: solo service_role accede (webhook + admin tools).
ALTER TABLE public.marketplace_webhook_events ENABLE ROW LEVEL SECURITY;

-- Sin policies para anon/authenticated → solo service_role accede.

COMMENT ON TABLE public.marketplace_webhook_events IS
  'Log de webhooks procesados de marketplaces (ML hoy). Sirve idempotencia (id PK) + audit + debug.';

COMMIT;
