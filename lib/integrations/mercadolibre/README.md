# Integración Mercado Libre

Fuente de verdad: [ADR-024 en DECISIONS.md](../../../DECISIONS.md).

## Estado actual

**Sprint 1 completo (2026-05-29)** — Foundations sin necesidad de credenciales del founder.
**Sprint 2 pendiente** — OAuth + webhook receiver. Requiere App ID + Secret Key del founder.
**Sprint 3 pendiente** — Sync activo + admin UI.

## Estructura

```
lib/integrations/mercadolibre/
├── README.md         # Este archivo
├── types.ts          # Types puros (sin runtime deps)
├── schemas.ts        # Zod schemas para validación de payloads
├── config.ts         # Env vars + helpers de config (server-only)
│
├── oauth.ts          # [Sprint 2] OAuth flow (initiation + callback + token refresh)
├── api-client.ts     # [Sprint 2] Cliente HTTP autenticado a la API de ML
├── encryption.ts     # [Sprint 2] AES-256 para cifrar/descifrar tokens
│
├── webhooks.ts       # [Sprint 3] Procesamiento de webhooks ML
├── sync.ts           # [Sprint 3] pushStockToML, pullStockFromML
└── reconcile.ts      # [Sprint 3] Cron job de reconciliación diaria
```

## Env vars necesarias (Sprint 2)

```
ML_CLIENT_ID=...                  # App ID público
ML_CLIENT_SECRET=...              # Secret Key (NUNCA committear)
ML_REDIRECT_URI=https://[dominio]/api/ml/oauth/callback
APP_ENCRYPTION_KEY=...            # 32+ chars random para cifrar tokens (AES-256)
```

## Para arrancar Sprint 2

1. Founder crea app en https://developers.mercadolibre.com.ar/
2. Configura redirect URI exacta (te paso URL cuando esté Vercel domain final)
3. Solicita scopes: `read write offline_access`
4. Me pasa `App ID` + `Secret Key` para configurar en Vercel
5. Genera `APP_ENCRYPTION_KEY` con `openssl rand -hex 32`

## Mapping de productos

Antes de Sprint 3 sync activo, cada producto del sitio que también está en ML debe
tener `mercadolibre_item_id` cargado en su variante:

```sql
UPDATE product_variants
SET mercadolibre_item_id = 'MLA1234567890'
WHERE sku = '194185';  -- Vulk Day Light Carey
```

Workflow ideal a futuro: admin UI en `/mi-cuenta/marketplace` que liste variantes
sin mapping y permita asociarlas a items de ML (con autocompletado vía API).

## Diseño de seguridad

- **Tokens cifrados en DB**: AES-256-GCM con `APP_ENCRYPTION_KEY` antes de persistir.
- **RLS estricto**: tablas `marketplace_integrations` y `marketplace_sync_errors`
  solo accesibles por `service_role`. Cliente público NUNCA toca tokens.
- **Webhook signature**: ML no firma webhooks por default — usamos un secret en el
  path del endpoint para validar origen (ver `webhooks.ts` cuando se implemente).
- **Idempotency**: cada webhook tiene `_id` único, se trackea para no reprocesar.

## Decisiones técnicas tomadas

Ver ADR-024 en DECISIONS.md para el razonamiento completo.

- Source of truth: **Supabase**. ML refleja.
- Sync: **bidireccional** vía webhooks (no polling).
- Mapping: **explícito 1:1** variante ↔ item ML. Sin auto-discovery.
- Errores: **logged a `marketplace_sync_errors`** con retry exponencial.
- Reconciliación: **cron daily** detecta drifts y alerta al founder.
