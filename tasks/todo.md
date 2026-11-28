
## Reclamos y devoluciones de Mercado Libre (ADR-029) — 2026-11-26
- [x] Migración `20261126120000_marketplace_claims.sql` (escrita, NO aplicada ni ejecutada en ninguna base)
- [x] `lib/integrations/mercadolibre/claims.ts` + `claims-mapping.ts`, cron `/api/cron/ml-reclamos`, `vercel.json`
- [x] Selftest sin red 26/26, `tsc` y `eslint` limpios
- [x] Founder: permiso activado, app reautorizada y consulta de prueba corrida (búsqueda 200)
- [x] Ajuste con datos reales: `status` siempre, sin depender de `related_entities`, reclamos sobre el envío
- [ ] Aplicar la migración (con OK del founder) y verificar RLS
- [ ] Commit, push y deploy (sólo con "subí")
- [ ] Primera carga `?dias=90` hasta `incompleto: false`; revisar `errores` y 3 reclamos contra el panel de ML

**Revisión:** de la API sólo se probó la búsqueda; nada contra una base. Puntos sin confirmar en ADR-029.

## Piloto "Despiece al scrollear" — Vulk Arvin (2026-11-07)
- [x] Auditar la PDP: no hay despiece, ni three.js/model-viewer; sí framer-motion; `useVariantSelection` da la variante elegida
- [ ] Dirección de diseño (`ui-motion-designer`) y ubicación/CRO (`conversion-optimizer`) — consultados, esperando respuesta
- [ ] Componente cliente `components/product/product-exploded-view.tsx` (SVG + framer-motion `useScroll`/`useTransform`, sin librerías nuevas)
- [ ] Datos desde `attributes` (frame/temple/hinge material, lens material/cat, medidas) + colores de la variante elegida
- [ ] Insertar sólo en el piloto (lista de slugs en código: `vulk-arvin`), con fallback `prefers-reduced-motion` (versión abierta estática)
- [ ] Verificar en el preview: mobile 375 y desktop, consola sin errores, CLS, variantes (negro-mate / azul-mate)
- [ ] Mostrar al founder (capturas) ANTES de commitear; commit/push sólo con "subí"
- [ ] `nextjs-performance` antes de cerrar (toca la PDP)

## Bot de WhatsApp (ADR-028) — 2026-11-19
- [x] Audit: WhatsApp era solo `wa.me`; chat web RAG reutilizable; MCP de Meta y app "Óptica Carballo Bot" creados en portfolio aparte
- [x] Revisión de diseño (`ai-features-engineer`) y adopción de sus recomendaciones (insert antes del 200, ignorar `history`, límites salientes, ráfagas, filtro de salida, derivación por herramienta, interruptor)
- [x] Migración `20261119120000_whatsapp_bot.sql` (escrita, NO aplicada a Supabase cloud)
- [x] `lib/whatsapp/` (firma, payload, horarios, política, prompt, respuesta, handler, cliente) + webhook `app/api/whatsapp/webhook/route.ts` + mail de derivación
- [x] `pnpm whatsapp:selftest` 59/59, `tsc` y `eslint` limpios, webhook local probado (GET 200/403, POST 401/401/200/400), `pnpm whatsapp:smoke` 21/21
- [x] OK del founder ("Sí, las dos cosas"): migración aplicada al cloud y `embed-products` corrido (158 filas); se arregló el script y se quitó el índice ivfflat (búsqueda exacta)
- [x] `pnpm whatsapp:smoke` con el catálogo cargado: 21/21; leyendo las respuestas se vio que inventaba "liviano"/"adaptar lentes graduadas" → regla de prompt + filtro con respaldo del catálogo (selftest 63/63)
- [x] Deploy a Vercel (commit `fe6fb0e`, deployment READY, bot apagado por defecto; solo lo del bot, build verificado en copia limpia)
- [x] Variables `WHATSAPP_*` cargadas en Vercel por el founder (el MCP de Vercel no tiene permiso: 403) y verificadas en producción (POST sin firma → 401, GET con token → 200)
- [x] Webhook configurado en la app de Meta (verify token pegado por el founder) y probado con el evento de prueba `messages` del dashboard; formato del eco confirmado con el ejemplo oficial
- [x] Política de privacidad completa (titular, CUIT, WhatsApp/IA, transferencia, derechos, eliminación) y "sin chatbot" de Sobre nosotros corregido — en la carpeta, SIN subir (espera OK del founder)
- [x] Retención: función SQL + cron diario + `pnpm whatsapp:borrar` — escritos, la migración `20261119140000` NO está aplicada al cloud todavía
- [ ] Aplicar la migración `20261119140000_whatsapp_retencion_y_aviso.sql` al cloud, commitear y subir (con OK del founder)
- [ ] Founder: inscribir la base en el Registro Nacional de Bases de Datos (AAIP, vía TAD) y revisar la política con un abogado
- [ ] Número real en coexistencia (QR desde el celular de la óptica) al final

