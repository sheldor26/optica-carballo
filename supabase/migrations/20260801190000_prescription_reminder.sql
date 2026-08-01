-- Recordatorio de vencimiento de receta (loop de mejora 2026-08-01, ítem 6).
-- Mismo patrón que product_alerts.unsubscribe_token — token propio para no
-- mezclar preferencias de baja con las alertas de stock/precio (argentine-ecom).
ALTER TABLE public.prescriptions
  ADD COLUMN IF NOT EXISTS reminder_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS reminder_unsubscribe_token text
    NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex');

CREATE INDEX IF NOT EXISTS prescriptions_reminder_unsubscribe_token_idx
  ON public.prescriptions(reminder_unsubscribe_token);
