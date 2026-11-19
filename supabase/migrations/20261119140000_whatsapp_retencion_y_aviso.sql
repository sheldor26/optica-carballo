-- ============================================================================
-- Bot de WhatsApp: borrado automático (retención) y registro del aviso inicial
-- ============================================================================
-- (1) Retención. La política de privacidad promete que los mensajes de WhatsApp
--     se borran a los 90 días (12 meses si la conversación se derivó a una
--     persona del equipo). Hasta esta migración nadie borraba nada. La función
--     la llama el cron diario `/api/cron/whatsapp-retencion`.
--
-- (2) Aviso inicial. Antes de que el texto de un cliente llegue a los
--     proveedores de IA (OpenAI y Anthropic, en EE.UU.) el bot le manda un
--     aviso de "asistente virtual" con el link a la política. `aviso_enviado_at`
--     registra que ya se mandó, para no depender de contar mensajes (una
--     derivación por reglas manda una respuesta fija sin ese aviso).
--
-- Cambio aditivo: una columna nullable y una función; no toca datos existentes.
-- ============================================================================

BEGIN;

ALTER TABLE public.whatsapp_conversations
  ADD COLUMN IF NOT EXISTS aviso_enviado_at timestamptz;

COMMENT ON COLUMN public.whatsapp_conversations.aviso_enviado_at IS
  'Cuándo se le mandó al cliente el aviso de asistente virtual + transferencia a proveedores en EE.UU. Hasta que sea NOT NULL, el bot no procesa sus mensajes con IA.';

CREATE OR REPLACE FUNCTION public.whatsapp_purgar_mensajes(
  p_dias_normal    int DEFAULT 90,
  p_dias_derivadas int DEFAULT 365
)
RETURNS TABLE (mensajes_borrados bigint, conversaciones_borradas bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  m bigint;
  c bigint;
BEGIN
  -- 1) Cada mensaje se borra a los 90 días de recibido (365 si la conversación
  --    se derivó a una persona del equipo).
  DELETE FROM public.whatsapp_messages msg
  USING public.whatsapp_conversations conv
  WHERE msg.wa_id = conv.wa_id
    AND msg.created_at < now() - make_interval(
      days => CASE WHEN conv.handoff_at IS NOT NULL THEN p_dias_derivadas ELSE p_dias_normal END
    );
  GET DIAGNOSTICS m = ROW_COUNT;

  -- 2) Conversaciones que quedaron sin mensajes y sin actividad reciente.
  DELETE FROM public.whatsapp_conversations conv
  WHERE NOT EXISTS (SELECT 1 FROM public.whatsapp_messages msg WHERE msg.wa_id = conv.wa_id)
    AND coalesce(conv.last_inbound_at, conv.created_at) < now() - make_interval(days => p_dias_normal);
  GET DIAGNOSTICS c = ROW_COUNT;

  RETURN QUERY SELECT m, c;
END;
$$;

-- Solo el servidor (service role) puede ejecutarla: borra datos.
REVOKE ALL ON FUNCTION public.whatsapp_purgar_mensajes(int, int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.whatsapp_purgar_mensajes(int, int) TO service_role;

COMMENT ON FUNCTION public.whatsapp_purgar_mensajes IS
  'Retención del bot de WhatsApp: borra mensajes de más de 90 días (365 si se derivó) y conversaciones vacías. La llama el cron /api/cron/whatsapp-retencion.';

COMMIT;
