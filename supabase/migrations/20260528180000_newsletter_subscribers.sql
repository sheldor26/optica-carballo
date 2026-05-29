-- Newsletter subscribers
-- Captura de leads con fricción mínima (single opt-in iter 1).
-- Iter 2 puede sumar double opt-in vía Resend confirmación.
--
-- RLS: estricto. Solo service_role accede. Insert/Select/Update pasan
-- por server actions que usan createAdminClient(). El cliente público
-- jamás toca esta tabla directo.

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT newsletter_subscribers_email_lowercase
    CHECK (email = lower(email)),
  CONSTRAINT newsletter_subscribers_email_format
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- UNIQUE en email para idempotencia (mismo email no duplica).
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_key
  ON public.newsletter_subscribers (email);

-- Index por created_at para reportes / dashboard.
CREATE INDEX IF NOT EXISTS newsletter_subscribers_created_at_idx
  ON public.newsletter_subscribers (created_at DESC);

-- Trigger para mantener updated_at.
CREATE OR REPLACE FUNCTION public.set_newsletter_subscribers_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS newsletter_subscribers_set_updated_at
  ON public.newsletter_subscribers;
CREATE TRIGGER newsletter_subscribers_set_updated_at
  BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.set_newsletter_subscribers_updated_at();

-- RLS estricto: nadie excepto service_role.
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Sin policies para anon/authenticated → SELECT/INSERT/UPDATE/DELETE
-- por anon/authenticated son denegados por default. service_role
-- bypassa RLS automáticamente (lo usa createAdminClient).

COMMENT ON TABLE public.newsletter_subscribers IS
  'Suscriptores al newsletter. Solo accesible por service_role.';
COMMENT ON COLUMN public.newsletter_subscribers.source IS
  'Origen de la suscripción: home_hero | footer | checkout | popup | other';
COMMENT ON COLUMN public.newsletter_subscribers.confirmed_at IS
  'Iter 2: timestamp de confirmación double-opt-in vía email. NULL = pendiente.';
COMMENT ON COLUMN public.newsletter_subscribers.unsubscribed_at IS
  'Timestamp de unsubscribe. NULL = activo.';
