-- Marketplace integrations: tokens OAuth + estado de sync con marketplaces externos
-- Iter 1 cubre Mercado Libre. La tabla es genérica para sumar otros marketplaces
-- en el futuro (Tiendanube, Shopify Marketplace Sync, etc).
--
-- Decisión ver: DECISIONS.md ADR-024.

-- ============================================================================
-- 1. Tabla principal de integraciones
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.marketplace_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  /** Identificador del marketplace: 'mercadolibre' por ahora. Si sumamos otros (tiendanube, etc) van acá. */
  marketplace text NOT NULL,

  /** ID del usuario en el marketplace (en ML es el user_id retornado por OAuth). */
  external_user_id text NOT NULL,

  /** Tokens OAuth — se cifran a nivel aplicación antes de insertar. NUNCA committearlos plain. */
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  token_expires_at timestamptz NOT NULL,

  /** Estado de la integración. */
  status text NOT NULL DEFAULT 'active',

  /** Última vez que recibimos un webhook o llamada exitosa del marketplace. */
  last_sync_at timestamptz,

  /** Última vez que hubo un error de sync. Para alertar al founder. */
  last_error_at timestamptz,
  last_error_message text,

  /** Metadata libre para guardar info por marketplace (scopes, app_id, etc). */
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  /** Un usuario externo + marketplace = una sola integración activa. */
  CONSTRAINT marketplace_integrations_marketplace_user_unique
    UNIQUE (marketplace, external_user_id),

  /** Validación del status. */
  CONSTRAINT marketplace_integrations_status_check
    CHECK (status IN ('active', 'expired', 'revoked', 'error'))
);

CREATE INDEX IF NOT EXISTS marketplace_integrations_marketplace_idx
  ON public.marketplace_integrations (marketplace);

CREATE INDEX IF NOT EXISTS marketplace_integrations_status_idx
  ON public.marketplace_integrations (status);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.set_marketplace_integrations_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS marketplace_integrations_set_updated_at
  ON public.marketplace_integrations;
CREATE TRIGGER marketplace_integrations_set_updated_at
  BEFORE UPDATE ON public.marketplace_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_marketplace_integrations_updated_at();

-- RLS estricto: solo service_role.
ALTER TABLE public.marketplace_integrations ENABLE ROW LEVEL SECURITY;
-- Sin policies → anon/authenticated denied. service_role bypasses RLS.

COMMENT ON TABLE public.marketplace_integrations IS
  'Tokens OAuth y estado de sync con marketplaces externos (ML, etc). Solo accesible por service_role.';

-- ============================================================================
-- 2. Mapping de variantes a items de marketplace
-- ============================================================================

-- Campo en product_variants para mapear cada variante a un item de ML.
-- Una variante = un SKU vendible = un item en ML (que también puede tener variations,
-- pero para el alcance iter 1 mapeamos 1:1 variante ↔ item ML completo).
ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS mercadolibre_item_id text;

COMMENT ON COLUMN public.product_variants.mercadolibre_item_id IS
  'ID del item de Mercado Libre (formato MLA1234567890) si esta variante también se vende ahí. NULL = no se vende en ML.';

-- Index parcial para queries frecuentes (solo variantes con mapping activo).
CREATE INDEX IF NOT EXISTS product_variants_mercadolibre_item_id_idx
  ON public.product_variants (mercadolibre_item_id)
  WHERE mercadolibre_item_id IS NOT NULL;

-- UNIQUE constraint: un item ML no puede mapear a 2 variantes distintas.
-- Constraint deferrable para permitir UPDATEs masivos en migrations futuras.
ALTER TABLE public.product_variants
  ADD CONSTRAINT product_variants_mercadolibre_item_id_unique
  UNIQUE (mercadolibre_item_id) DEFERRABLE INITIALLY DEFERRED;

-- ============================================================================
-- 3. Tabla de logs de errores de sync (para observabilidad)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.marketplace_sync_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  marketplace text NOT NULL,

  /** Tipo de operación que falló: 'oauth' | 'webhook' | 'push_stock' | 'reconcile' */
  operation text NOT NULL,

  /** Variante afectada si aplica. */
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,

  /** ID del item ML afectado si aplica. */
  external_item_id text,

  /** Payload del error: status code, body, stack, etc. */
  error_payload jsonb NOT NULL DEFAULT '{}'::jsonb,

  /** Si se reintentó cuántas veces. */
  retry_count int NOT NULL DEFAULT 0,

  /** Si se resolvió eventualmente. */
  resolved_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS marketplace_sync_errors_created_at_idx
  ON public.marketplace_sync_errors (created_at DESC);

CREATE INDEX IF NOT EXISTS marketplace_sync_errors_unresolved_idx
  ON public.marketplace_sync_errors (created_at DESC)
  WHERE resolved_at IS NULL;

ALTER TABLE public.marketplace_sync_errors ENABLE ROW LEVEL SECURITY;
-- Sin policies → solo service_role.

COMMENT ON TABLE public.marketplace_sync_errors IS
  'Logs de errores de sincronización con marketplaces. Para observabilidad + alertas.';
