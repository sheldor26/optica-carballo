-- ============================================================================
-- Bot de WhatsApp (ADR-028): conversaciones y mensajes
-- ============================================================================
-- Guarda lo mínimo para tres cosas: (1) no contestar dos veces el mismo mensaje
-- (Meta reintenta el webhook), (2) darle al bot el hilo reciente de cada
-- conversación y (3) saber cuándo una persona del equipo tomó la conversación
-- para que el bot se calle. Cambio aditivo: dos tablas nuevas, no toca nada
-- existente.
--
-- Privacidad (Ley 25.326): acá hay teléfonos y texto de clientes. Por eso las
-- dos tablas tienen RLS activo SIN policies: solo las lee el service role desde
-- el servidor, nunca el navegador. Hay que definir una retención (borrar
-- mensajes viejos) antes de lanzar; queda anotado en CURRENT_STATE.md.
-- ============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.whatsapp_conversations (
  -- Identificador de WhatsApp del cliente (su número en formato internacional,
  -- sin "+"). Es la clave: una conversación por número.
  wa_id             text PRIMARY KEY,
  -- Nombre que el cliente tiene en su perfil de WhatsApp. Opcional.
  profile_name      text,
  -- Mientras esta fecha esté en el futuro, el bot NO contesta (una persona del
  -- equipo tomó la conversación, o ya se derivó).
  bot_paused_until  timestamptz,
  -- Cuándo y por qué se derivó a una persona. NULL = nunca se derivó.
  handoff_at        timestamptz,
  handoff_reason    text,
  -- Último mensaje que mandó el cliente. Sirve para la ventana de 24 h de
  -- WhatsApp: solo se puede contestar libremente dentro de esa ventana.
  -- Se actualiza SOLO con mensajes del cliente, nunca con los de una persona.
  last_inbound_at   timestamptz,
  -- Cuándo se le avisó al equipo por mail (para no mandar más de un mail por
  -- hora por conversación) y cuándo se le avisó al cliente que llegó al límite
  -- (se le avisa una sola vez y después el bot calla).
  handoff_notified_at timestamptz,
  limit_notified_at   timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Id del mensaje en WhatsApp (wamid...). UNIQUE: es lo que evita procesar dos
  -- veces el mismo mensaje cuando Meta reintenta.
  wamid       text NOT NULL UNIQUE,
  wa_id       text NOT NULL REFERENCES public.whatsapp_conversations (wa_id) ON DELETE CASCADE,
  -- in = lo escribió el cliente; out = salió desde el número de la óptica.
  direction   text NOT NULL CHECK (direction IN ('in', 'out')),
  -- Quién lo escribió: el cliente, el bot o una persona del equipo (desde la app).
  sender      text NOT NULL CHECK (sender IN ('customer', 'bot', 'human')),
  -- text | audio | image | document | location | sticker | other
  kind        text NOT NULL DEFAULT 'text',
  -- Texto del mensaje. Para los que no son texto queda NULL (no guardamos
  -- fotos de recetas ni audios).
  body        text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT whatsapp_messages_body_len CHECK (body IS NULL OR char_length(body) <= 4000)
);

CREATE INDEX IF NOT EXISTS whatsapp_messages_wa_id_created_idx
  ON public.whatsapp_messages (wa_id, created_at DESC);

-- RLS activo y sin policies: solo el service role (servidor) accede.
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.whatsapp_conversations IS
  'Una fila por cliente que escribe al WhatsApp de la óptica. Solo service role (RLS sin policies).';
COMMENT ON TABLE public.whatsapp_messages IS
  'Mensajes del bot de WhatsApp. wamid UNIQUE = dedupe de reintentos de Meta. Solo service role (RLS sin policies).';

COMMIT;
