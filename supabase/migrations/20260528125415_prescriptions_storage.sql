-- ============================================================================
-- Migración 00004 — Prescriptions Storage Bucket + RLS policies
-- Fecha: 2026-05-28
-- ============================================================================
-- Crea bucket privado `prescriptions` para imágenes/PDFs de recetas
-- oftalmológicas (datos sensibles de salud).
--
-- Path pattern: <user_id>/<prescription_id>/<filename>
-- RLS de Storage usa (storage.foldername(name))[1] = auth.uid()::text para
-- validar ownership por el primer segmento del path.
--
-- Acceso:
--   - Browser autenticado: directo vía RLS (cada user solo sus archivos).
--   - Mostrar al user: server actions generan signed URLs (service_role,
--     TTL corto). El bucket NO es público.
-- ============================================================================

BEGIN;

-- =====================================================================
-- 1. Crear bucket (idempotente)
-- =====================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'prescriptions',
  'prescriptions',
  false,                         -- privado
  10 * 1024 * 1024,              -- 10 MB max por archivo
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 2. RLS policies sobre storage.objects (RLS ya está habilitada por Supabase)
-- =====================================================================
-- Cada policy filtra por bucket_id Y por el primer segmento del path = user_id.
-- Eso garantiza que un user solo opera sobre su propio "namespace".

CREATE POLICY "prescriptions: users read own files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'prescriptions'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "prescriptions: users upload own files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'prescriptions'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "prescriptions: users update own files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'prescriptions'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'prescriptions'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "prescriptions: users delete own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'prescriptions'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

COMMIT;
