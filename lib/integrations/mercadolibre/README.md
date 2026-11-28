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

## Reclamos, devoluciones y avisos (ADR-029, sin aplicar ni publicar al 2026-11-28)

Sólo GET a ML. Tablas (migración `20261126120000_marketplace_claims.sql`):
`marketplace_claims`, `marketplace_reputation`, `marketplace_sync_state`.

- `claims.ts`: recorridos (`reconciliar`, `rapido`, `historico`) y el aviso de un
  reclamo. `claims-mapping.ts`: lectura de respuestas. `claims-avisos.ts`: qué se
  avisa y cómo se escribe. `claims-deps.ts`: ML, base y correo reales.
  `reputation.ts`, `postventa.ts` (botón y resumen), `claims-webhook.ts`.
- Cron `/api/cron/ml-reclamos` (minuto 20, `CRON_SECRET`, `?dias=N`).
  Historial: `?historico=1`, repetir hasta `historico.terminado: true`.
- Cron `/api/cron/ml-reclamos-resumen` (11:30 UTC = 8:30 de Argentina).
- `POST /api/optisys/ml/postventa/refrescar` (`OPTISYS_TOKEN`): recorrido rápido;
  omite si hubo uno completo hace menos de 4 minutos o hay uno en curso.
  Responde `{ ok, actualizado_en, omitido }` (y `error` si falló).
- Webhook: tema `post_purchase` (contesta y procesa con `after()`). Hay que
  activarlo en la app de ML.
- Correos a `ML_AVISOS_EMAIL`; sin esa variable no se manda nada. `notified` evita
  repetir.
- La búsqueda exige `status`; `players.role` no filtra (las compras propias se
  descartan mirando `players`). Hay reclamos sobre la orden y sobre el envío.
- Lectura real de prueba (sólo GET): `scripts/ml-reclamos-lectura.ts`.
- Prueba sin red: `pnpm exec tsx --conditions=react-server scripts/ml-reclamos-selftest.ts`

`ml-ventas` además refresca (hasta 20 por corrida) estado de venta y de envío de
las ventas de 7 a 90 días con el envío sin terminar.

## Env vars necesarias (Sprint 2)

```
ML_CLIENT_ID=...                  # App ID público
ML_CLIENT_SECRET=...              # Secret Key (NUNCA committear)
ML_REDIRECT_URI=https://opticacarballo.com.ar/api/ml/oauth/callback
APP_ENCRYPTION_KEY=...            # 32+ chars random para cifrar tokens (AES-256)
```

## URLs confirmadas (founder 2026-05-29)

- **Dominio del sitio**: `opticacarballo.com.ar`.
- **Callback URL para webhooks ML**: `https://opticacarballo.com.ar/api/ml/webhook`.
- **Redirect URI OAuth**: `https://opticacarballo.com.ar/api/ml/oauth/callback` (Sprint 2).
- **Endpoint stub deployado**: `/api/ml/webhook` responde 200 OK + log (sin procesar). Permite al founder guardar la app en ML sin esperar Sprint 2.

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

**Historial:** `/api/cron/ml-reclamos-historico` carga los reclamos cerrados viejos de a tandas
y deja de hacer pedidos cuando termina (`marketplace_sync_state`, clave `historico`). Una vez
terminado se puede sacar de `vercel.json`.
