# Óptica Carballo — Learnings Log

## Qué es este archivo

El opuesto de `MISTAKES.md`. Documenta **qué funciona bien** — patrones, approaches y decisiones que produjeron buenos resultados.

Sirve para:
- **Replicar lo que funciona** en otras áreas del proyecto.
- **Convertir patterns en reglas** permanentes del sistema cuando se prueban repetidamente.
- **Entrenar al `agent-manager`** a reconocer patrones de éxito.
- **Recordar por qué algo funciona** (no solo el qué).

## Reglas

1. **Documentar dentro de las 48 horas** del éxito. Si esperás más, se pierde el detalle.
2. **Ser específico**. "Funciona bien" no sirve; "X aumentó conversión Y% por Z razón" sí.
3. **Buscar la causa real**, no la correlación. ¿Por qué funcionó realmente?
4. **Cuando un learning se confirma 3+ veces**: candidato a ser regla permanente en CLAUDE.md o en algún agente.
5. **El `agent-manager` revisa esto en cada `/agent-review`** para identificar patrones a sistematizar.

---

# Log de learnings

## 2026-05-29 — FAQ schema por marca: específico, no genérico (regla Google)

**Categoría**: SEO / Structured data
**Confianza**: 🟢 Alta (Google guidelines explícitas)

### Qué funcionó

Al agregar `FAQPage` JSON-LD a las páginas `/anteojos-de-sol/[brand]`, NO reutilicé las FAQs genéricas de `lib/content/faqs.ts` (envíos, pagos, garantía general). Creé `lib/content/brand-faqs.ts` con 4-5 preguntas ESPECÍFICAS de cada marca (origen, público, polarizados, garantía oficial, receta). Esto evita 2 problemas:

1. **Contenido duplicado** entre páginas de marca y `/preguntas-frecuentes` (Google penaliza duplicación).
2. **Schema sin valor SEO**: Google premia FAQ schema cuando responde queries específicas que el usuario realmente busca antes de comprar esa marca puntual.

Además respeté la regla dura de Google: **el contenido del schema debe matchear contenido visible en la página**. Renderizamos `FaqAccordion` con las mismas FAQs que el JSON-LD — sin texto visible, Google considera el schema "spammy" y deja de mostrar el rich snippet.

### Por qué funcionó

FAQ schema es un rich result con altísimo CTR (preguntas expandibles bajo el resultado normal en SERP). Pero solo funciona si:
- Respuestas concisas y útiles (no marketing puro).
- Sin duplicación cross-page.
- Sin CTAs ni texto promocional dentro de las respuestas.
- Match exacto entre schema y contenido visible.

### Cuándo aplicar

- Cualquier página de marca, categoría o producto con potencial de queries informacionales asociadas.
- NO reutilizar FAQs genéricas — siempre escribir las específicas al contexto.
- Mínimo 3 FAQs por página para que valga la pena el rich result.

## 2026-05-29 — Performance audit basado en RUM, no en code review pre-tráfico

**Categoría**: Performance / Métodos de medición
**Confianza**: 🟢 Alta (industria estándar)

### Qué funcionó

Durante audit de performance, después de validar que el código tiene buena base técnica (Next/Image, fonts con swap, scripts afterInteractive, bundle razonable), corté el audit ahí en vez de empezar a optimizar a ciegas. La decisión: documentar findings + plan de acción para activar Vercel Analytics y correr PageSpeed Insights, en vez de aplicar 10 micro-optimizaciones sin data.

### Por qué funcionó

Sin tráfico real, optimizar es teatro. Lighthouse en local mide HTML/CSS/JS pero no caché real, conexiones lentas, dispositivos viejos. Las micro-optimizaciones pre-tráfico:
- A veces empeoran cosas (ej: `dynamic({ ssr: false })` que rompió build).
- Consumen tiempo que no genera mejora medible.
- Crean falsa sensación de "está optimizado" sin baseline real.

El approach correcto: validar fundamentos → documentar plan de medición → optimizar SOLO cuando hay data RUM mostrando un Core Web Vital en rojo.

### Cuándo aplicar

- Cualquier sprint de "optimización" sin métricas de producción.
- Tentación de pre-optimizar antes de tener users.
- Regla: si no hay número que mejorar, no hay nada que optimizar.

## 2026-05-29 — OAuth scoped por user — multi-cuenta del mismo founder requiere re-autorización o multi-tenancy

**Categoría**: OAuth / Multi-cuenta / Integraciones
**Confianza**: 🟢 Alta (caso aplicado en ML)

### Qué pasó

Founder tiene su producto `MLA1432137395` en una cuenta ML distinta a la que autorizó OAuth (user_id 1975674). ML correctamente niega acceso a items ajenos al token holder, aunque el founder sea dueño legal de ambas cuentas.

### Por qué

OAuth tokens son scoped al `user_id` del usuario que autorizó. Es seguridad básica:
- El token no representa al founder como persona — representa al user_id en ML.
- ML no sabe (ni debe saber) que múltiples cuentas pertenecen al mismo dueño legal.
- Token de user A no puede acceder a items de user B.

### Soluciones por nivel de complejidad

**Iter 1 (single-account)**: re-autorización. Founder log out + log in con cuenta correcta + nuevo OAuth flow. Tokens se UPSERT en DB. Trade-off: solo 1 cuenta activa a la vez.

**Iter 2 (multi-account)**: refactor DB para soportar múltiples integraciones simultáneas. Cada producto en el sitio mapea a item + user_id ML específico. UI para elegir desde qué cuenta importar/sincronizar. Effort: 1 sprint serio.

**Iter 3 (multi-marketplace)**: extender a Tiendanube/Shopify además de ML. Misma arquitectura, marketplace_integrations ya soporta `marketplace` field discriminator.

### Aplicar a futuro

Cualquier integración OAuth-based:
- Asumir SINGLE user/account iter 1. Cuesta nada y resuelve 80%+ casos.
- Documentar limitación en doc operativa.
- Multi-tenant solo si hay demanda real (founder con >2 cuentas regulares).

### Patrón meta

"Scope explícito" es fundamental en OAuth. Anti-pattern: asumir que "es mío" da acceso. ML no chequea propiedad legal — solo permission del token.

---

## 2026-05-29 — Endpoints admin deben devolver detalle del error de tercero, no solo el código genérico

**Categoría**: API design / Debugging / DX
**Confianza**: 🟡 Media (1 caso aplicado en ML import)

### Qué pasó

Founder visitó `/api/admin/ml-import-preview/MLA1432137395` y recibió:
```json
{"ok":false,"error":"unknown","retryable":false}
```

`mlFetch` ya loguea el body real del error de ML a `marketplace_sync_errors`. Pero el endpoint NO devuelve ese body al caller — solo el código genérico (`unknown`). Para diagnosticar, founder tiene que visitar OTRO endpoint (`/api/ml/debug-last-error`) y mapear las entries por timestamp.

UX subóptima: 2 round-trips para diagnosticar 1 error.

### Solución (próximo refactor)

Endpoint admin debería incluir el error_payload del último sync_errors entry en su response cuando hay error. Algo como:

```ts
if (!result.ok) {
  const lastError = await getLastSyncError({ operation: 'fetch_item_admin' });
  return NextResponse.json({
    ok: false,
    error: result.error,
    retryable: result.retryable,
    detail: lastError?.error_payload,  // ← incluir aquí
  });
}
```

### Por qué importa

- Endpoint admin = para diagnóstico interno. Debería ser self-contained.
- Founder no-técnico no debería tener que correlacionar JSONs entre 2 endpoints.
- Reduce iteraciones de debugging founder ↔ AI.

### Aplicar a futuro

Cualquier endpoint admin/debug que falla por causa de tercero:
- Devolver código genérico para casos esperados.
- Devolver detalle COMPLETO del error de tercero cuando el caller es admin/debug.
- No requerir que founder visite otro endpoint para diagnóstico.

### Patrón meta

"Self-contained debugging": cada endpoint admin debe responder con suficiente info para tomar acción, sin obligar a múltiples queries.

---

## 2026-05-29 — Verificar deploys reales via MCP es ground truth, NO el git push

**Categoría**: DevOps / Vercel / Verificación de despliegue
**Confianza**: 🟢 Alta (caso aplicado en hot-fix de webhook glitch)

### Qué pasó

Push commit `2a65e83` (endpoint admin) → asumí que Vercel triggereaba build automático. Founder reportó 404 → verifiqué via MCP `list_deployments` y NO había deploy del commit `2a65e83`. Vercel saltó ese commit.

Causa desconocida (webhook GitHub glitch, filter weird, rate limit silencioso). Lo importante: **push exitoso ≠ deploy efectuado**.

### Solución

`mcp__claude_ai_Vercel__list_deployments` muestra SHA real de cada deploy. Comparar SHA esperado vs SHA real = ground truth de qué está vivo en producción.

### Por qué importa

- "Push exitoso" da false sense of "deploy done". Webhook events son best-effort.
- Vercel UI lo muestra pero el founder no chequea — confía en mi confirmación.
- Para integraciones críticas (endpoints admin, webhooks ML, payment flows), verificación post-push debería ser default.

### Aplicar a futuro

Tras CUALQUIER push de código (no doc-only) con feature nueva crítica:
- Listar deployments via MCP.
- Verificar que el SHA del último deploy = SHA del commit recién pusheado.
- Si no matchea (caso raro) → force redeploy con commit doc o redeploy manual.

### Patrón meta

"Verificar en lugar de asumir" para cualquier paso async fuera de tu control directo. Anti-pattern: declarar "deploy en 1-2 min" sin confirmar después.

---

## 2026-05-29 — Endpoint admin temporal via OAuth guardado para one-off tasks del founder

**Categoría**: Arquitectura / Operaciones / Admin temporal
**Confianza**: 🟡 Media (1 caso aplicado en ML import)

### Qué pasó

Founder pidió import de un item ML específico. Necesitaba:
1. Fetch del item desde ML API.
2. Auth (ML cambió, ya no es público).

Opciones:
- **A**: Script local con curl — no tenemos los tokens descifrados localmente.
- **B**: Compartir tokens descifrados via prompt — leak de credenciales.
- **C**: Endpoint admin temporal en el sitio que use `mlFetch` con tokens guardados — el sitio ya tiene auth + descifrado, solo añadimos endpoint thin.

Elegí C. Endpoint `/api/admin/ml-import-preview/[itemId]` que devuelve JSON crudo.

### Por qué funciona

- **Reutiliza infraestructura existente**: `mlFetch` + tokens cifrados + auto-refresh. Cero código duplicado.
- **Sin leak de credenciales**: tokens nunca salen del server.
- **Validación input**: regex sobre `MLA\d+` para evitar SSRF.
- **Sin auth iter 1**: aceptable porque solo devuelve data pública del seller (items que él vende).
- **Marker TODO** para Sprint 3: cuando haya admin UI propia, este endpoint se elimina o se integra.

### Trade-off

- Endpoint sin auth = cualquiera puede invocarlo. Mitigación parcial: solo devuelve data que el seller ya expone públicamente en su tienda ML.
- Adds 1 endpoint público con costo de leer del DB cada call. Negligible para uso one-off.

### Aplicar a futuro

Cualquier one-off task que el founder pide y requiere acceso a tokens/secrets guardados:
- Endpoint admin temporal `/api/admin/X/[param]` thin wrapper sobre helper existente.
- Sin auth iter 1 si data no es sensible.
- TODO explícito para eliminar/integrar en admin UI definitiva.
- Validación rigurosa de input para evitar SSRF/injection.

### Patrón meta

"Endpoint thin wrapper sobre helper existente" — reutilizar infraestructura, no duplicar. Anti-pattern: script local que pide credenciales por prompt.

---

## 2026-05-29 — Verificación de propiedad de Google es agnóstica al método — meta tag NO obligatorio si verificó por otro

**Categoría**: Google tooling / Verificación de propiedad
**Confianza**: 🟢 Alta (validado en GSC del proyecto)

### Qué pasó

Le pasé al founder walkthrough con método "Etiqueta HTML" para verificar propiedad en GSC. Él reportó "verificada y sitemap aprobado". Verifiqué el HTML con `curl` y el meta tag `<meta name="google-site-verification">` NO aparecía.

Causa: founder usó método distinto (probable DNS record o file drop-in). GSC ofrece 5 métodos de verificación + acepta cualquiera. Una vez verificada la propiedad, no requiere mantener el método activo (es prueba inicial, no chequeo continuo).

### Por qué importa

- Eviter sobre-engineering por inferencia. "GSC verificada" ≠ "meta tag presente".
- Otros métodos pueden ser más simples para el founder según contexto:
  - DNS: 1 record TXT en el panel del registrar.
  - File: 1 archivo HTML drop-in.
  - GTM: instant si ya tenés Google Tag Manager.
  - Analytics: instant si ya tenés GA en la misma cuenta.
- El env var `NEXT_PUBLIC_GSC_VERIFICATION_TOKEN` queda como reserve — no requerido si verificó por otro.

### Aplicar a futuro

Cuando walkthrough con tercero ofrezca múltiples métodos de verificación:
- Listar los métodos breves.
- Recomendar uno (el más rápido para el contexto).
- Mencionar que cualquiera funciona — no hay penalty por usar otro.
- NO obligar al user a hacer setup técnico (env var + redeploy) si tiene atajo más fácil.

### Trade-off de no usar meta tag

- Si el método alternativo se invalida (ej: cambia DNS, borra el file), GSC desverifica.
- Meta tag en HTML es más persistente porque está en el código.
- Para sites con cambios frecuentes de DNS/hosting: meta tag es safer.
- Para sites estables: cualquier método funciona.

### Patrón meta

"Múltiples paths a resultado" — el resultado importa más que el path. Anti-pattern: insistir en el method que vos propusiste cuando el founder eligió otro válido.

---

## 2026-05-29 — Aplicación inmediata de mistake aprendido: walkthrough GSC empieza con env var ANTES del redeploy

**Categoría**: Proceso / Aprendizaje aplicado
**Confianza**: 🟢 Alta (caso validado en mismo día del mistake)

### Qué pasó

En el setup de GA4 cometí un mistake (documentado): no dejé claro que la env var debe configurarse ANTES del redeploy. Founder agregó la env var después del último deploy → GA4 no funcionó → debugging extra.

En el siguiente walkthrough (GSC), apliqué la lección **inmediatamente**:
1. Paso 1 explícito: "Copiar token de GSC".
2. Paso 2 explícito: "Configurar env var en Vercel (PRIMERO, antes del redeploy)".
3. Paso 3 explícito: "Trigger redeploy" — yo hago commit doc trivial sin pedirle al founder.
4. Paso 4 explícito: "Verificar meta tag con curl".

Eliminé la ambigüedad del orden y removí el costo cognitivo del founder de pensar "¿qué hago primero?".

### Por qué funciona

- **Mistake → learning → aplicación en próximo caso similar** en menos de 1 día.
- El walkthrough actual tiene markers explícitos ("PRIMERO", "antes del redeploy") imposibles de mal-interpretar.
- Yo hago el commit doc — founder no tiene que pensar en eso.

### Aplicar a futuro

Todo walkthrough con setup de tercero + env var:
- Step "agregar env var" PRIMERO con marker explícito "antes del redeploy".
- Step "trigger redeploy" SEGUNDO — idealmente lo hago yo via commit.
- Step "verificar" TERCERO con comando concreto (curl, cmd browser, etc).

### Patrón meta

Aprender ≠ aplicar. La validación real del learning es que aparezca en el próximo caso similar. Cuando lo hace, queda confirmado como regla operativa.

---

## 2026-05-29 — Vercel env vars NO se aplican retroactivamente — siempre redeploy tras agregarlas

**Categoría**: Vercel / Deployment / Operaciones
**Confianza**: 🟢 Alta (limitación confirmada del platform + caso validado end-to-end)

### Qué pasó

Founder configuró GA4 cuenta + Measurement ID correcto + lo agregó como env var `NEXT_PUBLIC_GA_ID` en Vercel. Pero GA4 NO mostraba data — el script ni siquiera aparecía en Network tab del browser.

Diagnóstico: la env var se agregó DESPUÉS del último deploy (commit `70f4e0f`). Vercel carga env vars EN BUILD time — un build viejo no las tiene. Tras nuevo deploy (commit doc trivial), el código pickup la env var y GA4 empezó a funcionar.

### Por qué es confuso

- Vercel UI muestra la env var como "Production" y verde. Visualmente parece activa.
- Pero el deploy actual fue construido SIN esa env var → para él, no existe.
- Diferencia entre "env var configurada en panel" y "env var aplicada al deploy actual".

### Aplicar a futuro

Cualquier vez que se agrega/cambia una env var en Vercel:
1. Configurar en Settings → Environment Variables.
2. **OBLIGATORIO** después: trigger redeploy (manual desde UI o push trivial).
3. Verificar que el deploy nuevo tiene timestamp posterior a cuando se agregó la env var.

Hint útil al founder cuando algo "no funciona después de agregar env var":
- Preguntar: "¿agregaste la env var antes o después del último deploy?"
- Si después → "necesitás redeploy".

### Patrón meta

"Configuración panel ≠ configuración activa" — válido para cualquier hosting con build-time env vars (Vercel, Netlify, Cloudflare Pages). Anti-pattern: asumir que agregar config en panel basta.

---

## 2026-05-29 — Diagnóstico client-side con 3 checks (Vercel env / Network DevTools / localStorage) para scripts no cargando

**Categoría**: Debugging / Frontend / Browser tooling
**Confianza**: 🟡 Media (1 caso aplicado en GA4 troubleshooting)

### Qué pasó

Founder reportó "GA4 no muestra nada". El componente GoogleAnalytics tiene 3 conditions de no carga:
1. `NEXT_PUBLIC_GA_ID` env var ausente o vacía.
2. Consent `oc_cookies_consent` no es `'all'`.
3. Race condition (consent llegó después del primer pageview).

Cada uno requiere look distinto: Vercel UI / Network DevTools / localStorage. Sin saber cuál fallaba, debugging era hipótesis ciega.

### Solución

3 checks específicos en paralelo, founder reporta cuál falla:
1. **Vercel UI**: env var aparece + Production check.
2. **Network DevTools (F12)**: filter `google` → buscar `googletagmanager.com/gtag/js?id=...`. Si aparece → carga OK. Si no → consent o env var.
3. **localStorage**: `oc_cookies_consent` choice.

Permite al founder no-técnico diagnosticar sin tirar todo el contexto al chat.

### Por qué funciona

- **Checks independientes**: cada uno cubre 1 hipótesis. Founder puede hacerlos en cualquier orden.
- **Resultados binarios**: cada check es "aparece" o "no aparece". Sin ambigüedad.
- **DevTools = ground truth**: lo que el browser realmente está cargando, no lo que asumo del código.

### Aplicar a futuro

Cualquier troubleshooting de "script externo no carga / no funciona" (analytics, chat widgets, ad pixels, A/B tests):
- Check 1: env vars en hosting (¿la key existe?).
- Check 2: Network tab (¿el browser está request-eando el script?).
- Check 3: localStorage / cookies (¿alguna condition pre-load lo bloquea?).

3 checks paralelos > 1 check secuencial cuando hay múltiples causas posibles independientes.

---

## 2026-05-29 — Docs operativas necesitan 2 niveles: resumen + walkthrough granular

**Categoría**: Documentación / Comunicación al founder
**Confianza**: 🟡 Media (caso aplicado en GA4 setup)

### Qué pasó

Escribí `ANALYTICS_SETUP.md` con resumen de pasos para configurar GA4 ("crear cuenta GA4 → propiedad → flujo web → copiar Measurement ID → env var en Vercel"). Founder lo leyó pero pidió walkthrough detallado — necesitaba saber qué hacer click por click.

Cuando lo escribí pensé "está obvio cada paso porque la UI te guía". Pero founder NO había usado GA4 antes, así que cada pantalla nueva requiere decisión (qué nombre, qué zona, qué sector). Sin walkthrough, fricción alta.

### Solución

Docs operativas para el founder (no-técnico) necesitan **2 niveles**:

**Nivel 1 — Resumen** (`ANALYTICS_SETUP.md` en repo):
- Para referencia futura.
- Qué está integrado + qué env vars necesita + dónde mirar métricas.
- Asume familiaridad con el tooling externo.

**Nivel 2 — Walkthrough** (mensaje chat cuando el founder lo necesita):
- Para PRIMERA vez usando el tooling.
- 10 pasos numerados, cada campo a llenar, screenshot textual de cada pantalla.
- Asume CERO familiaridad.

### Por qué funciona

- Resumen es referencia rápida cuando ya conocés el flow.
- Walkthrough reduce decisión fatigue + miedo al "qué pongo acá".

### Aplicar a futuro

Cualquier integración nueva con dashboard tercero (MP, Tusfacturas, Resend, GSC, etc):
- Doc Markdown en repo con resumen.
- Al pedirle al founder ejecutar por primera vez, mandar walkthrough en chat con cada click.

### Patrón meta

Docs técnicas (resumen) ≠ docs operativas (walkthrough). El proyecto necesita ambas. Anti-pattern: asumir que un resumen sirve para alguien que nunca usó el tooling.

---

## 2026-05-29 — Helper `track()` no-op silencioso desacopla código de negocio de GA4 disponibilidad

**Categoría**: Analytics / Privacy / Arquitectura
**Confianza**: 🟢 Alta (caso aplicado en 6 features)

### Qué pasó

Integré GA4 con compliance ley 25.326: gtag solo carga si user acepta cookies. `window.gtag` puede o no existir según consent. Si cada componente defensive-checkea, código se llena de boilerplate y dev puede olvidar el check → crash.

### Solución

Helper `track(eventName, params)` centralizado en `lib/analytics/track.ts`:

```ts
export function track(eventName, params?) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', eventName, cleanParams);
  } catch (err) { /* no-op */ }
}
```

Componentes solo escriben `track(Events.WISHLIST_TOGGLE, {...})` — sin defensive code, sin worry sobre consent.

### Por qué funciona

- **Una capa de abstracción** business code ↔ analytics provider.
- **No-op por default**: caso seguro es no hacer nada.
- **Enum `Events`** evita typos.
- **Cambio de provider trivial**: si migramos a Plausible/Posthog, edito solo el helper.

### Aplicar a futuro

Cualquier integración condicional opcional (Sentry, Posthog, Datadog):
- Wrap en helper centralizado.
- No-op si no disponible.
- Componentes nunca chequean directo.

### Patrón meta

"Defensive checks centralizados en helper" — componentes confían en el helper. Reduce cognitive load + risk de typos.

---

## 2026-05-29 — Sprint 2a ML OAuth CERRADO: debugging incremental con DB logging desbloqueó root cause en 2 iteraciones

**Categoría**: Project management / Debugging incremental / Validación de integración
**Confianza**: 🟢 Alta (validado end-to-end con OAuth funcionando)

### Qué pasó

Sprint 2a ML OAuth pasó por varios fallos: redirect URI sospechoso (descartado), migration parcial (verificada), logging incompleto (corregido), y finalmente root cause encontrado (Zod schema esperaba `'bearer'` lowercase, ML devuelve `"Bearer"` con B mayúscula).

Total iteraciones: ~5 ciclos de "founder reintenta → reviso → fix → push". Tiempo total: ~1 sesión completa. Sin DB logging, hubiera tomado mucho más por dependencia de Vercel logs flaky.

### Por qué el debugging funcionó

**Two-tier logging** (DB + console) fue crítico:
- Vercel logs via MCP timeouteaban consistentemente.
- DB endpoint `/api/ml/debug-last-error` accesible directo, devolvió el JSON exacto.
- Sanitización de tokens en el segundo paso evitó leak permanente.

**Endpoint debug temporal** permitió que el founder me pasara info estructurada sin necesidad de Supabase Dashboard SQL.

**Incremental fix** vs "big bang":
- Sprint 2a NO incluyó procesamiento webhook real — solo OAuth flow.
- Cada fallo OAuth se aisla del resto del sistema.
- Si hubiera incluido todo el sync en Sprint 2, debugging era 10x más complejo.

### Trade-off realizado

- 5 iteraciones de "spinning wheel" con el founder. Costó tiempo + paciencia.
- Pero cada iteración nos dio info concreta. Sin debugging incremental, hubiera sido "no funciona, no sé por qué".

### Aplicar a futuro

Cualquier integración con tercero (Resend, Tusfacturas, Tiendanube, Shopify):
1. **Sprint inicial sólo OAuth/auth**. NO sumar procesamiento real hasta validar auth.
2. **Two-tier logging desde día 1**: console + DB.
3. **Endpoint debug temporal** que el founder pueda consultar sin SQL.
4. **Sanitización ya implementada**: nunca loguear credenciales crudas.

### Métrica del éxito

Sprint 2a tomó 5 iteraciones de debugging pero **cerró sin necesidad de revertir nada**. Cada commit fue aditivo. Sin DB logging, hubiera necesitado al menos 2x el tiempo.

---

## 2026-05-29 — Sanitización de payloads sensibles ANTES de loguear, no después

**Categoría**: Seguridad / Logging / Datos sensibles
**Confianza**: 🟢 Alta (caso real con tokens leakeados a DB)

### Qué pasó

Para diagnosticar Zod fail en OAuth ML, logueé `received_json: json` crudo a DB. El bug se reprodujo, log SÍ ayudó a encontrar la causa ('Bearer' vs 'bearer'), pero TAMBIÉN persistió `access_token` y `refresh_token` reales en la tabla.

DB tiene RLS service_role, pero los tokens quedaron en lugar "menos protegido" que el cifrado AES-256 que usamos en `marketplace_integrations.access_token`.

### Solución

Función `sanitizeReceivedJson()` reemplaza valores de keys sensibles con `[REDACTED]` ANTES de persistir:

```ts
const SENSITIVE_KEYS = new Set([
  'access_token', 'refresh_token', 'id_token',
  'client_secret', 'code',
]);

function sanitizeReceivedJson(json) {
  const keys = Object.keys(json);
  const redacted = {};
  for (const k of keys) {
    redacted[k] = SENSITIVE_KEYS.has(k) ? '[REDACTED]' : json[k];
  }
  return { keys, redacted };
}
```

Log guarda `received_keys` + `received_redacted`. Diagnóstico preservado, seguridad protegida.

### Aplicar a futuro

Cualquier log de payload externo (OAuth callback, webhook body, API response):
- Identificar keys sensibles del provider/protocol.
- Sanitizar ANTES de loguear.
- Mantener shape (keys + valores no sensibles) para debugging.

### Anti-pattern descubierto

Loguear payload crudo "por si necesitamos debuguear" → credenciales leakean a logs persistentes. Pattern positivo: sanitizar al INPUT del logger, no después.

---

## 2026-05-29 — Logging a DB debe cubrir TODOS los branches de error, no solo el "obvio"

**Categoría**: Observabilidad / Cobertura
**Confianza**: 🟢 Alta (caso real validó el patrón)

### Qué pasó

En Sprint 1 ML agregué `logMLSyncError` solo al branch `response.status === 400`. Confié en `console.error` para los otros (Zod fail, parse fail, upsert fail). Tras varios fallos OAuth con `count: 0` en la tabla, descubrí que el error caía en el branch **Zod fail** que NO logueaba → debugging ciego.

### Solución

Cobertura uniforme: log a DB en TODOS los branches que devuelven error:
- Status non-2xx: ✅ (estaba).
- JSON parse fail: agregado.
- Zod schema fail: agregado (con `received_json` raw).
- DB upsert fail: agregado.

### Por qué funciona

Si TODO branch loguea, la tabla siempre tiene evidencia. Independiente de la causa, el debug endpoint te devuelve detalle preciso. Cero "ceguera selectiva".

### Aplicar a futuro

Cualquier función crítica que devuelve `Result<T, E>` con múltiples paths de error:
- Audit explícito: ¿cuántos branches devuelven error? ¿Todos logueean?
- DB log con `stage` específico para identificar cuál branch falló.
- NO confiar en `console.error` solo para diagnóstico post-mortem.

### Anti-pattern

Logging selectivo (solo el branch "obvio") → debug-blind cuando falla un branch alternativo.

### Refinamiento del "Two-tier logging"

Entry previo: "DB como backup cuando runtime logs son flaky". Este caso refina: NO basta tener el patrón, hay que aplicarlo a **TODOS** los branches de error, no solo el principal.

---

## 2026-05-29 — IF NOT EXISTS check explícito > EXCEPTION catch para idempotencia de UNIQUE constraints

**Categoría**: Postgres / Migrations / Idempotencia (refinamiento)
**Confianza**: 🟢 Alta (caso real validó el patrón)

### Qué pasó

Refinamiento del entry anterior. Mi primer fix wrappeaba `ADD CONSTRAINT` en `DO block + EXCEPTION WHEN duplicate_object`. Founder reintentó y falló con MISMO error:
```
ERROR: 42P07: relation "..." already exists
```

`42P07` es `duplicate_table` (porque UNIQUE constraint crea índice subyacente con mismo nombre como relation), NO `42710 duplicate_object`. Mi catch no aplicaba.

### Solución refinada

En lugar de capturar exception por SQLSTATE específico (frágil — depende de cuál SQLSTATE tire Postgres), usar `IF NOT EXISTS` check explícito sobre `information_schema`:

```sql
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'product_variants_mercadolibre_item_id_unique'
      AND table_schema = 'public'
      AND table_name = 'product_variants'
  ) THEN
    ALTER TABLE public.product_variants
      ADD CONSTRAINT product_variants_mercadolibre_item_id_unique
      UNIQUE (mercadolibre_item_id) DEFERRABLE INITIALLY DEFERRED;
  END IF;
END $$;
```

### Por qué es mejor

- **Funciona independiente del SQLSTATE** que tire Postgres. UNIQUE constraints pueden tirar `42P07` o `42710` según contexto. IF NOT EXISTS check ignora eso.
- **Más legible**: "si no existe, créalo" es declarativo. El EXCEPTION catch requiere conocer SQLSTATEs.
- **Estándar SQL**: information_schema es portable.

### Aplicar a futuro

Para idempotencia de cualquier objeto DB que NO soporte `IF NOT EXISTS` nativo:
- **UNIQUE constraints**: check sobre `information_schema.table_constraints`.
- **CHECK constraints**: idem.
- **FOREIGN KEY constraints**: idem.
- **Triggers**: check sobre `information_schema.triggers` o `pg_trigger`.
- **Policies (RLS)**: `DROP POLICY IF EXISTS` primero + `CREATE POLICY`.

### Patrón meta refinado

Anti-pattern: confiar en `EXCEPTION WHEN duplicate_X` cuando el objeto puede tirar múltiples SQLSTATEs según contexto. Pattern positivo: query directa a `information_schema` para condicional explícito.

### Supersedes entry anterior

Este entry refina/supersedes el del DO block con EXCEPTION. La versión con IF NOT EXISTS es la robusta.

---

## 2026-05-29 — `DO $$ ... EXCEPTION WHEN duplicate_object` para idempotencia en `ADD CONSTRAINT`

**Categoría**: Postgres / Migrations / Idempotencia
**Confianza**: 🟢 Alta (limitación SQL standard conocida + caso aplicado)

### Qué pasó

Founder intentó re-aplicar `20260529000000_marketplace_integrations.sql` y recibió:
```
ERROR: 42P07: relation "product_variants_mercadolibre_item_id_unique" already exists
```

SQL standard NO soporta `IF NOT EXISTS` en `ADD CONSTRAINT`. Si la migration corrió parcialmente antes (CREATE TABLE IF NOT EXISTS funcionó, ADD CONSTRAINT también) y se re-ejecuta → falla por constraint duplicada.

### Solución

Wrappear `ADD CONSTRAINT` en `DO $$ ... EXCEPTION` block:

```sql
DO $$
BEGIN
  ALTER TABLE public.product_variants
    ADD CONSTRAINT product_variants_mercadolibre_item_id_unique
    UNIQUE (mercadolibre_item_id) DEFERRABLE INITIALLY DEFERRED;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;  -- Constraint ya existe, ignorar
END $$;
```

### Por qué funciona

- `DO` block ejecuta procedural SQL en línea.
- `EXCEPTION WHEN duplicate_object` captura específicamente el error 42P07.
- `NULL` ignora silenciosamente.
- Migration ahora safe re-applicable sin error.

### Aplicar a futuro

Cualquier `ALTER TABLE ... ADD CONSTRAINT` en migrations debe ir en `DO block` con manejo de `duplicate_object`. NO confiar en `CREATE TABLE IF NOT EXISTS` para evitar este caso — la constraint es separate.

Otras excepciones útiles para idempotencia:
- `WHEN duplicate_table THEN NULL` (tabla ya existe).
- `WHEN duplicate_column THEN NULL` (columna ya existe).
- `WHEN duplicate_function THEN NULL` (función ya existe).
- `WHEN duplicate_schema THEN NULL`.

### Patrón meta

**Migrations deben ser safe re-applicable** — si el founder corre 2 veces por accidente, debe ser no-op, no error fatal. `CREATE TABLE IF NOT EXISTS` no es suficiente — toda DDL que no soporte IF NOT EXISTS necesita wrapping.

---

## 2026-05-29 — Endpoint debug con count=0 es DATA — descarta una causa, indica próxima

**Categoría**: Debugging / Diagnóstico / Patrones de evidencia
**Confianza**: 🟡 Media (1 caso aplicado, principio sólido)

### Qué pasó

Founder visitó `/api/ml/debug-last-error` y recibió `{count: 0, errors: []}`. Mi reacción inicial: "no hay info, no se puede diagnosticar".

Reframe: `count=0` ES información. Significa:
- Logging code corrió pero NO encontró errores → causa NO está en lo que loguea (exchange code → tokens).
- O: logging code NUNCA corrió por errores ANTES (tabla no existe, crash en config, etc).

Aplicado al caso: founder había aplicado migrations PRE-Sprint 2a. La migration `20260529000000_marketplace_integrations.sql` (que crea las tablas ML) es del MISMO día pero POSTERIOR a la sesión de "aplique migraciones". Probable: nunca se aplicó la migration ML específica.

### Por qué funciona

- "Sin data" NO es "sin diagnóstico". Es **evidencia negativa** que excluye hipótesis.
- Hipótesis previa: "ML está rechazando el code". Pero si fuera eso, el código logueaba el error → count > 0.
- count=0 + intento fallido → algo más fundamental está pasando: tablas no existen, env vars rotas, deploy stale.

### Aplicar a futuro

Endpoints debug que devuelven empty NO son fallas — son data útil:
- Si esperabas X items y hay 0 → la causa NO está en lo que esos items rastrean.
- Forzar nueva línea de hipótesis (qué pasa upstream).

### Patrón meta

**Falta de error es información**. Anti-pattern: descartar empty responses como "no me sirve para nada".

---

## 2026-05-29 — Mega-menu hover-intent: 120ms open / 220ms close evita flickering

**Categoría**: UX / Hover patterns
**Confianza**: 🟡 Media (caso aplicado, timings industria estándar)

### Qué pasó

Mega-menu desktop sin hover-intent (delay 0) flickerea al mover el mouse rápido entre nav links. Con delay alto se siente lento.

Aplicé timings estándar industria:
- **120ms open**: cursor < 120ms = transit, no abre. ≥120ms = intencional, abre.
- **220ms close**: tras mouseleave, espera antes de cerrar. Permite cruzar gap entre nav y panel.

### Por qué funciona

- 120ms < threshold "intencional vs accidental" (~150ms).
- 220ms close > 120ms open: asimetría para forgiveness — empezar a salir y volver no cierra.
- Cancel timers en cada interacción: si abrís A → mouseenter B → cancel open de A + schedule open B.

### Aplicar a futuro

Cualquier hover overlay (dropdowns, tooltips ricos, mega-menus):
- Open delay 80-150ms.
- Close delay 200-300ms.
- Cancel timers en cada hover event para evitar leaks.

### Anti-pattern

Sin hover-intent = flickering. Mucha gente lo hace mal en sus primeros mega-menus.

---

## 2026-05-29 — Position fixed para overlays full-viewport dentro de container con padding

**Categoría**: CSS / Layout / Overlays
**Confianza**: 🟢 Alta (limitación CSS conocida + caso aplicado)

### Qué pasó

Mega-menu inicialmente `absolute inset-x-0 top-full` dentro de `<nav>` dentro de `<div className="container">`. Resultado: panel limitado al padding del container, NO full viewport.

`inset-x-0` se resuelve respecto al ancestor positioned. Container con padding limita el ancho real.

Solución: `position: fixed inset-x-0 top-14 md:top-16`. Fixed va al viewport, no al ancestor.

### Por qué funciona

- `fixed inset-x-0` → viewport completo.
- `top-{header-h}` → debajo del header sticky.
- z-index calibrado: 30 (sobre contenido, debajo de cursor follower).

### Trade-off

- Si el header cambia altura, hay que actualizar `top-X`. Mitigación futura: CSS var `--header-h`.

### Anti-pattern

Usar `absolute inset-x-0` dentro de container con padding esperando full width. NO funciona.

---

## 2026-05-29 — Two-tier logging: DB como backup cuando runtime logs son flaky

**Categoría**: Observability / Debugging / Resiliencia
**Confianza**: 🟡 Media (caso aplicado, principio establecido)

### Qué pasó

OAuth callback ML falló con `validation_error`. Necesitaba ver el body de ML al rechazar el code. Tenía `console.error` en el código — debería aparecer en Vercel logs.

Pero: MCP `get_runtime_logs` con query "oauth" daba timeout. Sin query, no aparecía el log específico — solo el 307 del redirect. `console.error` desde route handlers no aparece consistente.

Solución: `await logMLSyncError(...)` que persiste el error en `marketplace_sync_errors` (Supabase). DB queryable por SQL, persistente, estructurado, independiente del runtime.

### Por qué funciona

- **Resiliencia**: si Vercel tiene outage o MCP timeout, DB sigue accesible.
- **Permanencia**: logs de Vercel rotan (24h-30 días). DB queda para forensics.
- **Análisis SQL**: `SELECT, count, group by operation`.
- **Endpoint debug temporal**: `/api/ml/debug-last-error` lee últimos 5 sin auth.

### Trade-off

- Tabla crece sin pruning. Mitigación: cron periódico que purga errores resueltos > 90 días.
- Duplicación (console.error + DB). Acepto — costo bajo, beneficio alto.

### Aplicar a futuro

Cualquier integración crítica con tercero (ML, MP, Resend, Tusfacturas):
- Logs de runtime SIEMPRE (rapidez).
- DB logging adicional para errores que requieren forensics.
- Endpoint debug temporal hasta tener admin UI propia.

### Patrón meta

"Two-tier logging": logs efímeros para visibilidad realtime + DB para análisis histórico. **Anti-pattern**: confiar SOLO en runtime logs cuando son flaky.

---

## 2026-05-29 — Git push trivial como trigger de redeploy Vercel cuando cambian env vars

**Categoría**: DevOps / Vercel / Workflow
**Confianza**: 🟡 Media (caso aplicado, patrón conocido)

### Qué pasó

Founder agregó 4 env vars a Vercel DESPUÉS del último deploy. Vercel carga env vars en build time — las nuevas no están disponibles hasta rebuildear. 2 opciones:

**A. Vercel UI**: Deployments → último → 3 dots → Redeploy. Acción manual del founder.
**B. Git push trivial** (commit a doc/similar): trigger automático build + deploy.

Elegí B con commit a `CURRENT_STATE.md` documentando que las env vars estaban confirmadas. Beneficio doble: documento el estado + trigger redeploy en una sola acción.

### Por qué funciona

- Vercel re-evalúa env vars cada build (no cached entre builds).
- Push trivial no requiere acción del founder.
- Doc commit es útil per se → cero waste.

### Trade-off

- Commit "trigger" suma ruido en git history. Mitigación: contenido real, no `[chore] trigger redeploy`.
- Nunca `git commit --allow-empty` — es señal de que se podría documentar algo del mismo turn.

### Patrón meta confirmado (3era confirmación)

"AI prepara + founder ejecuta lo que requiere su acceso/identidad":
1. Encryption key: yo escribo el comando, founder lo ejecuta solo (debe quedar privado).
2. DB migrations: yo escribo el SQL, founder lo ejecuta en Supabase (no tengo cluster admin).
3. Redeploy via push: yo armo el commit doc + push, Vercel hace el resto.

Patrón estable: separar lo que requiere identidad del founder (claves, accesos) de lo que el AI puede hacer (código, docs, triggers).

---

## 2026-05-29 — Next.js route files NO permiten arbitrary exports: constants compartidas van en lib/

**Categoría**: Next.js / Routing / Convenciones del framework
**Confianza**: 🟢 Alta (limitación oficial del framework + caso aplicado)

### Qué pasó

En el OAuth flow ML necesitaba compartir `STATE_COOKIE` entre `initiate/route.ts` y `callback/route.ts`. Inicial: exporté desde initiate con `export { STATE_COOKIE }`. Build falló:
`Route "..." does not match the required types of a Next.js Route`.

### Causa

Route files (`app/**/route.ts`) solo permiten exportar:
- Handlers HTTP: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `HEAD`, `OPTIONS`.
- Config specifics: `dynamic`, `revalidate`, `runtime`, `fetchCache`, `preferredRegion`, `maxDuration`, `metadata`, `generateMetadata`, `generateStaticParams`.

Cualquier otro export rompe el contract.

### Solución aplicada

Módulo separado en `lib/integrations/mercadolibre/oauth-state.ts`:

```ts
export const ML_OAUTH_STATE_COOKIE = 'oc_ml_oauth_state';
export const ML_OAUTH_STATE_TTL_SECONDS = 600;
```

Ambos routes importan desde ahí.

### Aplicar a futuro

Cualquier route file que necesite compartir constantes / schemas / helpers / types con otro route file → módulo separado en `lib/`.

### Patrón meta confirmado (3era confirmación)

3 casos donde separamos constants/utilities de route files a lib/:
1. `lib/mp/webhook.ts` (MP webhook + carrito).
2. `lib/integrations/mercadolibre/schemas.ts` (webhook + endpoints futuros).
3. `lib/integrations/mercadolibre/oauth-state.ts` (este caso).

**Regla confirmada**: route files son contractuales (solo handlers + configs), todo lo demás vive en lib/.

---

## 2026-05-29 — Endpoint stub para integraciones con upfront-validation desbloquea al founder sin esperar al sprint completo

**Categoría**: Arquitectura / Patrones de integración / Project management
**Confianza**: 🟢 Alta (patrón estándar industria + caso aplicado en ML webhook)

### Qué pasó

Mercado Libre, al guardar una app, hace ping de validación a la URL del webhook configurada. Si el endpoint no responde 200, ML rechaza la URL y no permite guardar la app. Problema: el endpoint **real** se construye en Sprint 2 (con procesamiento de payload, update de DB, validación de origen). Pero el founder necesita guardar la app **ahora** para pasarme las credenciales.

Solución: **endpoint stub** que:
1. Existe en la ruta final (`/api/ml/webhook`).
2. Responde 200 OK al instante.
3. Valida shape del payload con Zod (sin procesar).
4. Log mínimo para visibilidad.
5. Acepta POST + GET + HEAD (algunas plataformas validan con cualquiera).

Sprint 2 reemplaza el handler POST con la lógica real. La interfaz (URL + status code + shape) se mantiene.

### Por qué funciona

- **Desbloquea trabajo del founder**: sin endpoint, founder no puede completar el registro de la app → no me pasa credenciales → Sprint 2 bloqueado. Con stub, todo lo del founder se completa hoy.
- **Costo bajo**: ~50 líneas de código. La validación Zod ya estaba lista de Sprint 1.
- **Interfaz contractual estable**: la URL final se registra desde hoy. Cuando Sprint 2 implementa el procesamiento real, el founder no toca nada en ML.
- **Observabilidad inicial**: el log del stub me sirve para ver qué payloads llegan ANTES de implementar la lógica — útil para diseñar el procesador.

### Otros casos donde aplica

- **OAuth callbacks**: muchos providers validan la redirect URI al guardarla. Stub que devuelve 200.
- **Webhooks de cualquier integration** (Stripe, Shopify, Tiendanube, etc): mismo patrón.
- **Verification webhooks** (Slack apps, Discord bots): incluyen challenge string que hay que retornar. Stub que solo maneja ese caso, sin lógica de negocio.
- **CDN preview validation**: algunos CDNs pingean para verificar headers.

### Trade-offs

- Si el founder accidentalmente activa la integración antes de Sprint 2, ML va a enviar webhooks reales al stub → se loggean y se ignoran. Stock NO se sincroniza. Riesgo: oversell si confía que el sync ya funciona. **Mitigación**: log explícito de "stub" + comunicación clara al founder de que Sprint 2 está pendiente.

### Aplicar a futuro

Cualquier integration que requiere validación upfront del endpoint:
1. Identificar qué request hace el provider para validar (típicamente GET / POST con payload challenge).
2. Implementar stub que devuelve 200 OK + responde el shape esperado.
3. Documentar como STUB en el código (header comment).
4. Listar en `CURRENT_STATE.md` como "stub deployado, lógica real pendiente sprint X".
5. Sprint posterior: reemplazar handler manteniendo URL + response shape estables.

### Patrón meta

Este es el **3er caso** de "feature mínima viable para desbloquear stakeholder externo":
1. Welcome email no-bloqueante en newsletter (si Resend no configurado, suscripción funciona).
2. Foundations ML sin credenciales (Sprint 1).
3. Stub endpoint para validation upfront (este caso).

3 casos → patrón consolidado: **separar lo que requiere setup externo de lo que no**, y entregar valor incremental sin esperar el setup completo.

---

## 2026-05-29 — Scope mínimo en OAuth permissions: pedir solo lo crítico ahora reduce riesgo si tokens se comprometen

**Categoría**: Seguridad / OAuth / Integraciones
**Confianza**: 🟢 Alta (principio de seguridad establecido)

### Qué pasó

Al configurar permisos de la app ML para integración de stock, ML mostraba 8 categorías de permisos posibles. Tenía 2 caminos:

**A. "Lectura y escritura" en todos**: máxima flexibilidad para el futuro, una sola configuración.
**B. Scope mínimo**: solo lo que necesitamos AHORA para sync de stock — 1 permiso con escritura (Publicación), 2 con lectura (Usuarios + Venta), resto sin acceso.

Elegí B. Razones:
- Si los tokens OAuth se comprometen (leak en logs, bug en el cifrado, etc), el blast radius es chico.
- Atacante en peor caso modifica stock — pero no factura, no maneja pagos, no cambia cuenta, no envía mensajes a clientes.
- Si en el futuro necesitamos otro permiso (ej: leer métricas para dashboard), pedimos al founder que re-autorice con scope ampliado. Fricción baja vs riesgo permanente.

### Por qué funciona

- **Principle of Least Privilege** aplicado: tokens solo pueden hacer lo necesario.
- **Re-authorization cost is low**: ML permite ampliar scopes pidiendo nueva autorización al user. No es "blocker permanente".
- **Auditable**: si veo en logs que la app hizo algo fuera de scope (ej: intentó crear factura), sé que es bug nuestro, no permiso configurado mal.

### Trade-off

- Cada feature nueva que necesite scope adicional requiere re-autorización del founder (1 click cada N meses cuando se sume feature). Costo bajo, founder lo entiende.

### Aplicar a futuro

Cualquier integración OAuth con terceros (Tiendanube, Shopify, Stripe Connect, etc):
- Listar permisos disponibles.
- Marcar solo los que se usan en el sprint actual.
- Documentar en ADR cuáles se eligieron + razón.
- Cuando se sume feature que necesite más, ampliar scope explícito.

### Caso límite

Si la integración es ÚNICAMENTE consumo (read-only, sin acciones del usuario), pedir solo `read` aunque parezca obvio. Refuerza el patrón.

---

## 2026-05-29 — Sprints separados por dependencia de credenciales externas: Sprint 1 sin creds, 2-3 con

**Categoría**: Project management / Dependencies / Sprint planning
**Confianza**: 🟡 Media (1 caso aplicado en ML integration)

### Qué pasó

Founder pidió integración Mercado Libre. Es trabajo grande (2-3 sprints). 2 caminos:

**A. Bloquear hasta tener credenciales**: pedir al founder que registre app ML primero, esperar 1-2 días, después arrancar.
**B. Dividir en Sprint 1 sin credenciales + Sprints 2-3 con credenciales**: Sprint 1 son foundations puras (migrations, types, schemas, ADR) que NO requieren auth. Mientras el founder hace su trámite, tenemos toda la estructura lista.

Elegí B. Razones:
- Founder tiene su tiempo para registrar la app sin presión.
- El sitio queda con foundations claras (migrations + types) que NO afectan nada actual.
- Cuando el founder vuelva con credenciales, arrancamos Sprint 2 con todo armado.
- Sprint 1 también incluye ADR formal, que es decisión arquitectónica que NO depende de credenciales.

### Por qué funciona

- **Reduce idle time**: el desarrollo no se bloquea esperando al founder.
- **Reduce pressure al founder**: él no tiene que apurarse "porque te estoy esperando".
- **Sprint 1 es self-contained**: si nunca arrancamos Sprint 2, las foundations no rompen nada (migration es additive, tipos no se importan en otro lugar todavía).
- **ADR primero**: la decisión arquitectónica queda escrita ANTES de implementar — referenciable durante Sprints 2-3.

### Trade-off

- Sprint 1 puede sentirse "trabajo invisible" porque no hay UI nueva ni feature usable. Pero es la base.
- Si el founder cambia de idea entre Sprint 1 y 2, el Sprint 1 queda como código sin usar (low cost — pocas líneas de types/schemas).

### Aplicar a futuro

Cualquier feature que requiere:
- Credenciales de terceros (APIs externas).
- Setup operativo del founder (cuenta nueva, verificación de identidad).
- Hardware / assets fuera del código.

→ Dividir en "Sprint 0/1: foundations que NO requieren X" + "Sprints siguientes: con X".

Casos análogos en este proyecto:
- Resend email: ya hicimos lo de "Resend OPCIONAL, suscripción no bloquea" — mismo principio.
- Fotos categorías: tenemos placeholder genérico que funciona sin fotos, se reemplaza cuando llegan.

---

## 2026-05-29 — Config declarativa paga sus costos en el SEGUNDO uso: sumar filter material = 4 archivos thin + 1 entry + 1 if

**Categoría**: Arquitectura / Validación de inversión inicial
**Confianza**: 🟢 Alta (caso confirma el patrón armado en sprint anterior)

### Qué pasó

En el sprint del 29 hice config declarativa `BRAND_FILTERS` + helper + componente shared para los 9 archivos de filtros (polarizados + 4 formas). Costó ~590 líneas iniciales pero argumenté que el costo se amortiza en futuros usos.

Hoy sumé 2 nuevos filtros (acetato + metal). Costo real:
- 1 entry en `BRAND_FILTERS` (5 líneas c/u).
- 1 if en el switch del filter query (3 líneas).
- 1 alternativa en el type union (2 líneas).
- 4 archivos route thin (~50 líneas c/u, mismo template).

**Total: ~210 líneas para 20 URLs SSG nuevas**.

Sin la config declarativa, hubiera sido: 4 archivos completos con su propio fetchByMaterial, su propio buildMaterialMetadata, su propio componente catalog. Estimado ~500+ líneas y mayor riesgo de divergencia entre versiones.

### Por qué funciona

- **Costo de cambio = costo de agregar entry al config**. Mínimo, predecible.
- **0 cambios en el componente shared** (`BrandFilterCatalogPage`). Renders correcto sin tocar.
- **0 cambios en el helper resolver**. Funciona para cualquier nuevo filter automático.
- **0 cambios en el sitemap**. Itera `BRAND_FILTERS.flatMap()` — las nuevas URLs aparecen solas.

### El criterio de inversión confirmado

Cuando el patrón se aplica:
1. **Primer uso**: invertir en config + helper + shared component es costoso vs solución directa.
2. **Segundo uso**: la inversión empieza a pagar.
3. **Tercer uso en adelante**: cada nuevo caso cuesta ~10-20% del esfuerzo de un caso "from scratch".

Regla práctica: **si vas a tener 3+ casos del mismo patrón, vale armarlo declarativo desde el inicio**. Para 1-2 casos, hacerlo directo es OK.

### Aplicar a futuro

Próximos filters que valdrían la pena agregar al config cuando haya producto cargado:
- `lens_treatment_includes: 'mirrored'` → /espejados
- `lens_treatment_includes: 'photochromic'` → /fotocromaticos
- `attributes->>'gender': 'unisex'` → /unisex (capaz combinado con género existente)
- `frame_material: 'titanium'` → /titanio (nicho)

Cada uno cuesta lo mismo que acetato y metal hoy: 1 entry + 1 archivo route (o el if del switch si es un nuevo tipo de filter).

---

## 2026-05-29 — 404 page como "última estación útil" en vez de dead-end → 3+ atajos + WhatsApp

**Categoría**: UX / Retención / Error states
**Confianza**: 🟡 Media (1 caso aplicado, patrón industria conocido)

### Qué pasó

La 404 anterior era 1 h1 + 1 link. Si el usuario llegaba ahí (link roto, URL mal escrita, producto movido), tenía 1 opción: volver al inicio. Muchos abandonan.

Rediseñé como "última estación útil":
- 2 CTAs primarios (Inicio + Marcas).
- 3 atajos rápidos a destinos top (Sol, Receta, FAQs) con descripción.
- CTA WhatsApp con mensaje pre-cargado.

### Por qué funciona

- **Multi-camino**: en vez de "te equivocaste, volvé", ofrezco 5-6 caminos distintos para retomar.
- **Mensaje pre-cargado en WhatsApp**: ya pinta el contexto ("Hola, llegué a una página que no existe…"), bajando fricción al chat humano.
- **Coherencia visual**: usa el mismo lenguaje que /sobre-nosotros y /checkout/error (icon-circle + h1 italic + cards). El usuario reconoce el patrón como "página del sitio", no como "error feo".

### Patrón a confirmar (3era confirmación)

Mismo template visual en:
1. `/sobre-nosotros` (hero + sections).
2. `/checkout/exito` / `/pendiente` / `/error` (icon + h1 italic + cards).
3. `/not-found` (icon + h1 italic + cards).

3 casos → patrón estable. Próxima página informativa o de estado debería seguir este template (icon-circle / h1 serif italic / cards).

### Aplicar a futuro

Cualquier estado "error" o "dead-end" (sin resultados, sin stock global, sin acceso, mantenimiento) debe ofrecer:
- 2-3 caminos alternativos.
- WhatsApp con context.
- Tono amigable (no técnico).
- Diseño coherente con el resto del sitio (NO una página "error" genérica).

---

## 2026-05-29 — Recent searches en localStorage: persiste solo si la query tuvo results

**Categoría**: UX / localStorage / Patrones de persistencia
**Confianza**: 🟡 Media (1 caso aplicado)

### Qué pasó

Al sumar recent searches al SearchDialog, decisión: ¿persistir TODAS las queries que tipeó el usuario, o solo las que tuvieron results?

Elegí "solo con results". Razones:
- Si tipeo "asdfasdf" (error de tipeo), persistirla es ruido.
- Si tipeo "Ray-Ban" pero no tenemos esa marca, persistirla genera el dilema de "es una recent que NO va a funcionar".
- Solo persistir queries útiles (con results) → la lista recent es siempre confiable: si reclickeás, vas a ver algo.

### Trade-off

- Si el catalog crece y mañana SÍ tenemos esa marca, la query pasada no aparece como recent. Aceptable: el usuario probablemente la busca de nuevo.

### Combinado con dedup case-insensitive

`Vulk` y `vulk` cuentan como mismo item. La que persiste es la última versión tipeada (mantiene capitalization del usuario).

```ts
const without = current.filter(
  (q) => q.toLowerCase() !== trimmed.toLowerCase(),
);
const next = [trimmed, ...without].slice(0, RECENT_MAX);
```

### Aplicar a futuro

Cualquier "history" client-side (recent searches, recent products viewed, recent filters):
- Persistir solo "completions exitosas".
- Dedup case-insensitive.
- Cap razonable (5-10 items).
- Botón "limpiar" siempre visible.

---

## 2026-05-29 — Hub `/marcas` linkea a las brand pages (que ya tienen story editorial) = SEO + UX gratis

**Categoría**: Arquitectura de información / Reuso
**Confianza**: 🟡 Media (1 caso aplicado)

### Qué pasó

Necesitaba una página índice de marcas. Tenía 2 opciones:

**A. Página standalone con su propio contenido**: hero + descripción + reuse parcial de info.
**B. Página índice "thin" que linkea a las brand pages ya existentes** (donde está toda la story editorial gracias al sprint anterior de brand-story-section).

Elegí B. Razones:
- Las brand pages YA tienen story + tagline + meta strip + differentials (5 marcas cubiertas).
- `/marcas` solo necesita: nombre + logo + tagline corto + count + link.
- Sin duplicar copy. Si el founder edita `lib/brands/copy.ts`, ambas páginas se actualizan.

### Por qué funciona

- **Single source of truth**: `lib/brands/copy.ts` provee tagline para `/marcas` y story completa para `/[brand]`.
- **Funnel claro**: `/marcas` (browse) → `/anteojos-de-sol/[brand]` (story + catálogo) → `/anteojos-de-sol/[brand]/wayfarer` (filtrado SEO) → `/[brand]/[product]` (PDP).
- **SEO**: cada step tiene su propio keyword target sin duplicate content.
- **Mobile**: el grid se colapsa a 1 col, las cards son tappeables fácil.

### Trade-off

- Si el founder ajusta tagline en `lib/brands/copy.ts`, debe revisar visualmente que el texto entre bien en la card de `/marcas` (~150 chars max razonables). Sin guardrails técnicos para esto iter 1.

### Aplicar a futuro

Cualquier "hub" page que existe sobre entidades ya con páginas propias (categorías, marcas, autores, colecciones):
- NO duplicar contenido. Solo: identidad mínima + descriptor corto + link.
- Reusar el dict/source-of-truth existente.
- El usuario que quiere detalle entra a la página específica.

---

## 2026-05-29 — ⌘K + `/` como atajos de search es lo que el usuario power-user espera

**Categoría**: UX / Keyboard shortcuts / DX
**Confianza**: 🟡 Media (1 caso aplicado pero patrón industria establecido)

### Qué pasó

Al agregar el search global, sumé 2 atajos de teclado:
- `⌘K` / `Ctrl+K`: toggle del dialog. Estándar en apps modernas (GitHub, Linear, Notion, Slack, Vercel).
- `/`: abre el dialog. Estilo GitHub. Más rápido para mouse-less users.

Pero el `/` tiene un edge case: si el usuario está escribiendo en un input/textarea/contenteditable, NO debe interceptar — sino, no podés tipear `/` en ningún form. Check explícito en el handler.

### Por qué funciona

- **⌘K es muscle memory** para usuarios técnicos. Lo van a probar sin que lo digas.
- **`/` es discoverable** porque GitHub lo popularizó. Power users lo asocian con "search".
- **Edge case bien manejado**: el check `target.tagName.toLowerCase() in ['input', 'textarea']` + `isContentEditable` cubre 99% de los casos donde no querés interceptar.

### Snippet clave

```ts
const target = e.target as HTMLElement | null;
const tag = target?.tagName.toLowerCase();
const isEditable =
  tag === 'input' ||
  tag === 'textarea' ||
  target?.isContentEditable === true;
if (!isEditable) {
  e.preventDefault();
  setOpen(true);
}
```

### Aplicar a futuro

Cualquier global keyboard shortcut que comparta tecla con input común (`/`, `\`, letras solas):
- Check si el target es editable antes de interceptar.
- Si no, prevent default + actuar.

Para shortcuts con modificador (⌘K, Ctrl+P): no necesitan el check porque modificador + tecla raramente es input legítimo.

### Otros atajos que valen la pena

- **`?`**: shortcuts help dialog.
- **`g h`**: ir a home (gh git-style).
- **`Esc`**: cerrar modal/cancelar (Radix Dialog ya lo maneja).

---

## 2026-05-29 — In-memory filter cliente para N pequeños (28 items) gana vs server-side filter con URL params

**Categoría**: UX / Performance / Trade-offs
**Confianza**: 🟡 Media (1 caso aplicado en FAQ search)

### Qué pasó

Para `/preguntas-frecuentes` con 28 FAQs, agregué buscador y chips por categoría. 2 caminos:

**A. Server-side con URL params** (`?q=cuotas&cat=pagos`): SSR siempre, mantiene shareability del link específico, sin JS extra para el filter. Pero requiere round-trip al server por cada keystroke (o debounce + URL replace), y la página pasa de static → dynamic.

**B. Client-side in-memory filter**: filtrá los 28 items en memoria con `useMemo`. Sin server roundtrip, sin URL syncing. Trade-off: la página pasa a tener client component (subió 1.5kB) y los filtros activos no se shareablean por URL.

Elegí B. Razones:
- 28 items, filtro es O(28) — imperceptible.
- La página se mantiene `revalidate: 3600` (FAQs cambian poco), client component liviano.
- Shareability de filtros: prioridad baja. Si necesario en el futuro, suma `useSearchParams` para sincronizar.
- UX: instantáneo, sin "loading" cada vez que tipea el usuario.

### Por qué funciona

- Para sets < 100 items, in-memory filter siempre gana en perceived performance.
- Sin debounce necesario porque el work es trivial (O(N) string includes).
- JSON-LD FaqPage schema se renderiza server-side con TODAS las FAQs — Google ve el set completo sin importar lo que el usuario filtre.

### Cuándo migrar a server

- Si el set crece a > 500 items.
- Si shareability de filtros es requirement explícito.
- Si querés tracking de queries (search → analytics).
- Si la lógica de filter es compleja (fuzzy matching, sinónimos, ranking).

### Aplicar a futuro

Cualquier filter/search sobre N pequeño y data ya renderizada en la página:
- Catálogo de productos en una marca específica (típicamente < 30 productos por marca).
- FAQs por categoría.
- Brands list filtrado por país/segmento.

In-memory wins. Server con URL params solo cuando hay un razón concreta (shareability, SSR para SEO de página filtrada, tracking).

---

## 2026-05-29 — Config declarativa (BRAND_FILTERS) + helper resolver = 9 archivos route casi vacíos sin perder claridad

**Categoría**: Arquitectura / Code reuse / Routing
**Confianza**: 🟢 Alta (1 caso aplicado pero el patrón es estándar)

### Qué pasó

Para 9 rutas hijas SEO (polarizados + 4 formas × 2 categorías) había 2 caminos:

**A. 9 archivos completos**: cada uno con su own `generateStaticParams`, `generateMetadata`, `Page` función. ~80 líneas c/u = 720 líneas.

**B. Config + helper + 9 archivos finos**:
- Config declarativa: `lib/catalog/brand-filters.ts` con `BRAND_FILTERS: BrandFilter[]`.
- Helper resolver: `lib/catalog/brand-filter-page-helper.ts` con `resolveBrandFilterPage()` + `resolveBrandFilterMetadata()`.
- 9 archivos route ~50 líneas c/u (cambia solo CATEGORY + FILTER_URL_SLUG).
- Total: ~450 líneas + config 80 + helper 60 = 590 líneas.

Elegí B. ~130 líneas menos pero el real win es:

### Por qué funciona

- **Cambios cross-cutting (1 lugar)**: si quiero ajustar cómo se construye la query o el meta tag, edito 1 archivo (helper), no 9.
- **Agregar nuevo filtro = 1 archivo**: si decido agregar `/[brand]/redondo`, agrego 1 entry en BRAND_FILTERS + 1 archivo route fino + 0 cambios en helper/component.
- **Sitemap auto-gen**: el sitemap itera `BRAND_FILTERS.flatMap(...)` — sin necesidad de actualizar manualmente cuando se agregan filtros.
- **Type-safety**: si me equivoco con el filter type en algún route, TS me avisa al compilar.

### Trade-off

- Indirección: para entender qué hace `/anteojos-de-sol/vulk/polarizados`, hay que leer el route → helper → query → config. 4 saltos.
- Mitigación: comentarios JSDoc en cada archivo apuntan al patrón. Y los 9 archivos route son tan finos que el dev los puede skipear directo al helper.

### Aplicar a futuro

Cualquier set de N rutas que siguen el mismo patrón con datos parametrizables (filtros, categorías secundarias, vistas alternativas):
- N <= 3: archivos completos OK.
- N > 3: config + helper + thin routes.

### Patrón meta confirmado

Este es el **segundo caso** de "config declarativa + helper para N rutas casi-iguales" (1ro fue gender pages — aunque ahí no tenía helper formal, había 4 archivos casi idénticos). Promover a regla informal: cuando aparezca un 3er caso (probablemente material/lente_color filters), formalizar en CLAUDE.md.

---

## 2026-05-29 — Quick view modal con lazy fetch (server action al primer click) = cero N+1 en catálogo

**Categoría**: Performance / Server actions / UX
**Confianza**: 🟡 Media (1 caso aplicado, patrón conocido)

### Qué pasó

Para el quick view del producto en card, tuve 2 opciones:

**A. Pre-fetch en server component**: incluir TODA la data del modal en la card prop. Sin delay al click, pero N queries adicionales × N cards visibles (potencialmente decenas).

**B. Lazy fetch en server action al primer click**: card lleva solo data básica (slug + href). Click → server action → modal con detalles.

Elegí B. Razones:
- N cards visibles × 5+ campos extra (variants, brand details) = bandwidth significativo.
- 99% de usuarios NO van a hacer click en quick view. Pre-fetch = waste.
- 1% que sí lo hace tolera 200-400ms de latency (es un modal, expectativa de carga existe).

### Por qué funciona

- **Catálogo principal NO se ralentiza**. Card data sigue mismo size que antes.
- **Lazy es per-click**: si el usuario abre 3 quick views, son 3 fetches (no 30).
- **Cache local por card**: si abrís → cerrás → reabrís el mismo quick view, hit cache local (state) sin refetch.

### Trade-off

- Primera abertura del modal tiene loading skeleton breve. Si fuera crítico (e.g. modal con add-to-cart immediate), pre-fetch.
- Server action vs API route: server action es más simple, NO hay JSON serialización manual, type-safe end-to-end.

### Aplicar a futuro

Cualquier modal/popover/dropdown con data del backend:
- Data probablemente no visitada por el usuario → lazy fetch.
- Data crítica primera-vista → pre-fetch en server component.

---

## 2026-05-28 — Coordinación de overlays fijos via cookie polling (CompareBar + FloatingWhatsapp) — patrón confirmado

**Categoría**: UX / Componentes globales / Estado compartido
**Confianza**: 🟢 Alta (3era aplicación del patrón cookie polling: WishlistBadge + CompareBar + FloatingWhatsapp)

### Qué pasó

Al sumar FloatingWhatsapp surgió un problema visual: si hay items en CompareBar (barra inferior sticky con CTA), y FloatingWhatsapp también está fixed bottom, se PISAN. UX rota.

Solución: FloatingWhatsapp lee la cookie `oc_compare` con el mismo helper que CompareBar (`readCompareClientSide`) cada 1.5s. Si hay items, FloatingWhatsapp se OCULTA via AnimatePresence.

### Por qué funciona

- **Cero estado global**. Sin Context, sin Zustand, sin Redux.
- **Cada overlay decide solo**. No hay master coordinator.
- **El estado fuente es la cookie**, que ya tiene su propio mecanismo de sync (server actions + revalidatePath).
- Polling 1.5s es suficientemente rápido para UX (no percibís lag) y suficientemente bajo para no impactar performance.

### Trade-off

- Mini-polling en cada componente que necesita reaccionar. Si tuviéramos 5 componentes haciendo polling, sumaría. Por ahora: WishlistBadge (1.5s), CompareBar (1.5s), FloatingWhatsapp (1.5s) = 3. Aceptable.
- Si crece, considerar custom event que se dispare en `toggleCompareAction` para que todos los componentes lo escuchen. Pero KISS por ahora.

### Aplicar a futuro

Cualquier componente que necesita reaccionar al estado de wishlist/compare/recently-viewed:
- Lee la cookie en useEffect.
- setInterval cada 1.5s + focus listener.
- Sin context.

Cuando promover a custom event:
- Si llegamos a 5+ componentes con polling.
- O si el founder reporta lag perceptible.

### Patrón meta confirmado

Este es el **tercer caso** del "cookie como source-of-truth para estado client UI" en este proyecto. Ya es regla efectiva. Cuando aparezca un 4to caso, considerar agregar a CLAUDE.md / ARCHITECTURE.md como pattern oficial.

---

## 2026-05-28 — Carpetas estáticas en Next 15 ganan a [dynamic] para evitar conflict con sibling routes

**Categoría**: Next.js routing / Arquitectura SEO
**Confianza**: 🟢 Alta (patrón estándar Next.js + caso aplicado)

### Qué pasó

Quería crear `/anteojos-de-sol/[brand]/hombre` y `/mujer` (páginas hijas SEO). Pero la ruta `[brand]/[X]` ya estaba ocupada por `[brand]/[product]/page.tsx` (PDP). Tenía 2 opciones:

**A. Usar `[gender]/page.tsx` dynamic**: conflict directo con `[product]/page.tsx` — Next 15 NO permite 2 dynamic segments en el mismo nivel con nombres diferentes.

**B. Carpetas estáticas `hombre/` y `mujer/`**: el router de Next 15 **prioriza static sobre dynamic** en el mismo nivel. Cuando hay `[brand]/hombre/page.tsx` y `[brand]/[product]/page.tsx`, la URL `/vulk/hombre` matchea PRIMERO el static, y `/vulk/vulk-day-light` cae al dynamic. Sin conflict.

Elegí B.

### Por qué funciona

- Next 15 documenta este precedence rule explícito: static > dynamic en el mismo nivel.
- Cero ambigüedad runtime — el matching es determinístico.
- SEO control fino: cada static folder es su propia ruta con metadata propia.

### Trade-off

- 4 archivos `page.tsx` casi idénticos (hombre/mujer × sol/receta) vs 1 archivo `[gender]/page.tsx` con validation.
- ~150 líneas duplicadas total (50 c/u, casi idéntico salvo 2 constantes).

Acepto porque:
- Cambios de comportamiento se hacen en el componente compartido `<BrandGenderCatalogPage>`, no en los wrappers.
- Cualquier dev (o yo en 6 meses) entiende el routing al ver el filesystem.
- Es el patrón canónico de Next.js para este caso.

### Aplicar a futuro

- Páginas hijas SEO de filtros (ej `/anteojos-de-sol/vulk/polarizados`, `/aviador`) → mismo patrón static folder.
- **Restricción**: ningún producto puede tener slug igual a un static segment hermano. Documentado implícito en routing.
- Para 2+ static segments con la misma estructura (caso de esta sesión), el archivo wrapper se replica. Es OK hasta 10 archivos. Si crece más, considerar generador de código o config-driven routes.

### Mistake a evitar

Si llego a usar `[X]` dynamic en un nivel donde ya hay otro `[Y]` dynamic en sibling, Next 15 tira error de compilación. Mensaje cripta — vale identificarlo rápido.

---

## 2026-05-28 — Copy editorial en TS (no DB) gana en velocidad de iteración para 5-10 entidades

**Categoría**: Arquitectura / Velocidad de iteración / Data
**Confianza**: 🟡 Media (1 caso aplicado en brands)

### Qué pasó

Para las páginas de marca necesitaba copy editorial (story, tagline, differentials) por marca. 2 opciones:

**A. DB**: agregar columnas a tabla `brands` (`tagline`, `story_md`, `founded_year`, `differentials jsonb`). Founder edita via SQL o admin UI. Bueno para multilenguaje futuro, admin sin redeploy.

**B. TS dict**: `lib/brands/copy.ts` con `Record<slug, BrandCopy>`. Code edits + redeploy.

Elegí B. Razones:
- 5 marcas activas (no 50). El dict es manejable a ojo.
- Founder no tiene admin UI. Editar SQL es más fricción que editar TS para él.
- Sin necesidad de multilenguaje (proyecto es es-AR puro).
- Cambios en copy son raros (no diarios) → redeploy no es costo real.
- Type-safe: si me equivoco con un slug, TS me avisa al compilar.

### Por qué funciona

Para N entidades chico (3-10) con copy estático, **TS dict gana** sobre DB. Si N > 20 o el copy cambia con frecuencia, considerar DB.

Costo evitado: migración + admin UI + texto deserializado de markdown.

### Trade-offs explícitos

- Cambiar copy requiere PR + deploy. OK porque cambios son raros.
- No hay versionado de copy (DB con `updated_at` daría history). OK por ahora.
- Si el founder quiere editar en producción sin pedirme, se complica. OK por ahora.

### Cuándo migrar a DB

- Si llegamos a 15+ marcas activas con copy.
- Si necesitamos multilenguaje (en-US, pt-BR).
- Si el founder quiere un admin UI propio para editar copy.
- Si el copy cambia muy frecuente (varias veces al mes).

Hasta entonces, default a TS dict.

### Patrón a confirmar

Mismo patrón aplicable a:
- Copy de skill IA (prompts editoriales). YA ESTÁ EN TS.
- Copy de páginas info (sobre nosotros, envíos). Si crece, evaluar DB.
- Copy de categorías (sol vs receta). YA ESTÁ EN TS (`lib/catalog/categories.ts`).

3 casos del patrón → ya es regla efectiva. No promover formal a CLAUDE.md hasta que sea contraintuitivo (cuando alguien proponga DB para algo chico).

---

## 2026-05-28 — Welcome email NO bloquea suscripción → captura siempre, email es nice-to-have

**Categoría**: Resiliencia / Email / UX
**Confianza**: 🟡 Media (1 caso aplicado)

### Qué pasó

Al integrar newsletter con Resend para welcome email, tuve 2 caminos:

**A. Bloqueante**: si Resend falla (key missing, dominio no verificado, etc), la suscripción tira error y el usuario ve "algo salió mal".
**B. No bloqueante**: la suscripción se guarda en DB siempre. El welcome es fire-and-forget. Si Resend falla, log warn y seguir.

Elegí B. Razones:
- **Captura del lead es lo crítico**. El email de welcome es accesorio.
- Si el founder no configuró Resend todavía, el sistema sigue funcionando.
- Si Resend tiene rate limit / outage, el lead no se pierde.
- Si el dominio aún no está verificado (DNS pendiente), seguimos capturando.

### Implementación

```ts
if (!alreadyExisted) {
  sendWelcomeEmail(email).catch((err) => {
    console.warn('[newsletter] welcome email failed (non-blocking)', err);
  });
}
return { ok: true, alreadyExisted };
```

El `.catch()` es esencial — sin él, una promise rejected sin await tira UnhandledPromiseRejection en Node.

### Aplicar a futuro

Cualquier "side effect" en un flow crítico (analytics, notifications, sync a 3rd party) debe ser no-bloqueante por default. Solo bloquear cuando la integridad de la operación lo requiere (ej: capturar el pago SÍ bloquea la confirmación del pedido).

Reglas mentales:
- ¿Si esto falla, perdemos data crítica? → bloquear.
- ¿Si esto falla, perdemos comodidad? → fire-and-forget con log.

### Patrón a confirmar

Este es el 2do caso (1ro fue recently-viewed tracker: si falla no bloquea navegación). Si aparece un 3er caso → promover a regla en CLAUDE.md / ARCHITECTURE.md como "side effects no-bloqueantes por default".

---

## 2026-05-28 — `<details>/<summary>` nativo para acordeones de FAQ — KISS gana vs framer-motion AnimatePresence

**Categoría**: Componentes / Performance / Accesibilidad
**Confianza**: 🟡 Media (1 caso aplicado en ProductFaqs)

### Qué pasó

Para los mini-FAQs contextuales del PDP necesitaba 4 ítems acordeón. Tenía 2 opciones:

**A. Framer-motion AnimatePresence**: control fino de animaciones (height auto, opacity, easing custom), pero requiere client component + JS runtime + manejo de estado.
**B. `<details>/<summary>` nativos + CSS transition**: accesible por default, sin JS, sin hydration, sin client component, animation de chevron con `group-open:rotate-180`.

Elegí B. Razones:
- Para 4 ítems con animación simple, A es overkill.
- B es 100% server component → 0 JS extra.
- A11y default: aria-expanded gestionado por browser.
- El control de styling cubre 95% de los casos (chevron rotation, bg-on-open, padding cambia).

### Por qué funciona

Lo único que se "pierde" con `<details>` es la animación de **height** al expandir (jump visual). Para 4 FAQs de 1-3 líneas cada una, el jump es imperceptible. Para FAQs largas (10+ líneas), sí se notaría — ahí habría que ir con framer.

### Aplicar a futuro

Default a `<details>` para cualquier acordeón con contenido corto. Solo escalar a framer cuando:
- Hay 6+ items con contenido medio/largo.
- Necesitamos animación de height.
- Hay nested state (sub-acordeones).

Skip framer cuando: 1-5 items, contenido <5 líneas, no hay nested.

---

## 2026-05-28 — Feedback de founder sobre nueva feature = oportunidad para sistematizar requisitos cross-cutting (PRODUCT_SCHEMA)

**Categoría**: Proceso / Sistematización / Calidad de datos
**Confianza**: 🟡 Media (1 caso, primera aplicación del patrón "feedback → schema")

### Qué pasó

Founder probó el comparador y reportó 2 problemas:
1. UX mobile no era amigable (problema visual concreto, fácil de fijar).
2. **"Todos los casilleros deben coincidir, debe estar prolijo"** → problema estructural: si los productos no tienen TODOS los campos llenos, la tabla queda con "—" y se ve mal.

El segundo es el interesante. Podía resolverlo "tactico" (filtrar productos sin data en el comparador), pero la causa raíz es: **no había un contrato explícito de qué campos debe tener un producto para ser "completo"**.

Creé `PRODUCT_SCHEMA.md` que:
- Lista los 13 campos exactos del comparador (lo que el founder ve cuando dice "casilleros").
- Marca cada campo con nivel 🔴/🟡/⚪.
- Tiene una **checklist operativa para pegar al founder** y pedir uno por uno.
- Actualicé skill `/product` con regla bloqueante explícita + apuntador a este schema.

### Por qué funciona

- **Convierte un feedback puntual en regla permanente**. El founder no va a tener que recordarme "che, cargá todo" cada vez. Está escrito.
- **Cierra el loop**: schema → skill `/product` → CLAUDE.md (referencia). Tres lugares apuntan al mismo contrato.
- **Es accionable inmediatamente**: la checklist se puede copiar y mandar al founder. No es un schema teórico, es operativo.

### Patrón a replicar

Cada vez que el founder de feedback tipo "esto tiene que estar siempre X" o "no quiero ver Y" sobre una feature ya implementada, evaluar:
- ¿Es solo este caso, o es una regla cross-cutting?
- Si es cross-cutting → buscar el lugar correcto (schema, contrato, regla en CLAUDE.md, skill) y escribirlo ahí.
- Linkear desde 2+ lugares para que sea descubrible.

Próximas oportunidades del patrón:
- "Las imágenes deben ser X" → IMAGE_SCHEMA.md o sección en PRODUCT_SCHEMA.md.
- "Las descripciones deben tener Y" → ya cubierto por skill `/article` y `content-writer-medical`.
- "Los meta-tags deben Z" → ya cubierto por `seo-strategist`.

### Costo

~30min escribir PRODUCT_SCHEMA.md vs ~5min "filtro tactico". Pero el schema se amortiza desde el siguiente producto cargado.

---

## 2026-05-28 — Detección de overflow + sticky shadow = patrón mobile-friendly para tablas comparativas

**Categoría**: UX / Mobile / Component patterns
**Confianza**: 🟡 Media (1 caso aplicado, pero el patrón es industria estándar)

### Qué pasó

Refactor del comparador mobile. La tabla con sticky first col por sí sola no comunica visualmente que hay contenido scrolleable. UX rompe.

Aplicación: 3 visual cues complementarios:
1. **Hint textual**: "Deslizá para ver más →" arriba de la tabla, **solo visible si hay overflow real** (`scrollWidth > clientWidth`). Detectado con ResizeObserver + recalculado en resize.
2. **Sticky shadow dinámica**: la first col tiene `box-shadow` lateral derecha que **solo aparece cuando `scrollLeft > 4`**. Comunica "esa col está fija, hay contenido scrolleado a la izquierda".
3. **Min-width por columna**: 168px mobile, 200px sm+ → garantiza que cada producto tenga espacio legible aunque no entre todo en pantalla.

### Por qué funciona

Los 3 cues no se pisan. Hint + shadow + min-width son ortogonales:
- Hint: orienta antes de tocar.
- Shadow: feedback DURANTE el scroll.
- Min-width: garantiza legibilidad de cada celda.

Sin uno solo de los tres, la UX se degrada (testeable mentalmente: sin hint, ¿cómo sabe que hay más? Sin shadow, ¿cómo sabe que la col fija es intencional? Sin min-width, ¿cómo se ve algo con 4 cols de 50px?).

### Aplicar a futuro

Cualquier tabla con scroll horizontal en mobile (pricing comparisons, specs side-by-side, dashboards) debe incluir los 3 cues.

---

## 2026-05-28 — 3era app del patrón cookie-first: comparador valida que es pattern, NO incidente. Candidato a regla de CLAUDE.md.

**Categoría**: Arquitectura / Persistencia / Patrones consolidados
**Confianza**: 🟢 Alta (3 casos: wishlist + recientes + comparador)

### Qué pasó

Founder pidió comparador. Lo planeé y ejecuté en 30min sin agente porque ya tenía mapa mental del patrón:
- Cookie con array de entries serializados.
- Server helpers (`'use server'`): read + toggle/track + remove + clear.
- Client helper para leer cookie sin server round-trip.
- Server actions con `revalidatePath` de la página personal.
- Server wrapper que pre-fetchea data por slugs → pasa a client component.
- Polling 1.5s + focus listener para captar cambios cross-tab.
- Página personal `/X` con `force-dynamic` + `robots: noindex` + empty state con `<RecentlyViewed>` fallback.

### Por qué funciona

Los 3 casos (wishlist, vistos recientemente, comparador) tienen estructura idéntica: lista de slugs con metadata mínima, persistencia sin auth, una página personal para verlos juntos. El patrón es **el approach correcto para todo feature de persistencia client-side ligera en este proyecto**.

### Promoción a regla

Después de 3 confirmaciones, esto es candidato fuerte a:
- Agregar a `CLAUDE.md` (ARCHITECTURE.md tal vez mejor) bajo "Patrones consolidados" como "Persistencia cookie-first" con los 5 puntos de arquitectura listados.
- Cuando aparezca un 4to caso (probablemente "items en checkout anon" o "preferencias UI"), aplicar el patrón directamente sin replantear.

Riesgo a vigilar: si los entries crecen mucho (>200 bytes/entry × 50 items en wishlist = 10KB cookie), empezar a sentir el costo. El comparador con cap 4 está fuera de ese riesgo.

### Costos del patrón vs alternativas

vs DB-first: cero fricción (no requiere login). Sync a DB en login es trivial cuando se active.
vs localStorage: cookie permite SSR (server lee → render server). localStorage requiere client-only render → hydration delays / flashes.

---

## 2026-05-28 — Visibilidad de features = nueva variant explícita, no override por className

**Categoría**: Component API / UX
**Confianza**: 🟡 Media (1 caso aplicado)

### Qué pasó

Founder reportó que el botón de wishlist en página de producto era poco visible (estaba como variant `inline` debajo del CTA WhatsApp, ya scrolleado). Pidió moverlo arriba al lado del título, patrón ML. Tuve 2 caminos:

**A. Override por className**: usar `variant="inline"` con `className="..."` para mover layout, ocultar texto, etc.
**B. Nueva variant `'title'`**: declarar explícito como tercer modo (`'card' | 'inline' | 'title'`), con su propio estilo y esqueleto SSR.

Elegí B. El icon-only con tamaño grande, sin borde y posicionamiento al lado del h1 no es un "tweak del inline", es un layout distinto.

### Por qué funciona

- **Discoverabilidad**: cualquier dev (o yo en futuro) lee la prop `variant` y entiende los 3 modos sin tener que parsear className overrides.
- **Esqueleto SSR específico**: cada variant tiene su tamaño de placeholder durante hydration. Override por className hubiese roto el esqueleto del 'inline' o forzado a condicionar el className del esqueleto.
- **Animación y a11y consistentes**: el mismo `motion.span` + Heart + aria-pressed se repite en los 3 branches, pero el contenedor (border, padding, hover) cambia. Variant explícita modela bien ese eje.

### Costo: 30 líneas duplicadas

El branch de `variant === 'title'` tiene su propio `<button>` y esqueleto. Hay ~30% código repetido vs un único componente parametrizable. Acepto porque la lectura es 5x más simple y la prop type es self-documenting.

### Aplicar a futuro

- Comparador de productos (próximo backlog): si tiene 2 ubicaciones (card flotante + barra inferior), declarar variants explícitas en vez de className override.
- Cualquier botón que tenga >2 ubicaciones con layout distintos → variants enum, no className.

---

## 2026-05-28 — Cookies funcionan para 2 features de persistencia ligera (wishlist + vistos recientemente) — patrón confirmado

Aplicación 2da del approach "cookie-first para persistencia sin auth". Ahora con tracker automático (vistos recientemente) en lugar de toggle manual (wishlist). Confirma:
- LRU (al ver de nuevo un producto, sube al tope) se implementa trivial: `[entry, ...existing.filter(s => s !== entry.slug)].slice(0, MAX)`.
- Tracker auto se hace con client component invisible que llama server action al mount. Fire-and-forget.
- Mismo helper `fetchProductsBySlugs` sirve para wishlist Y vistos recientemente. Buena reutilización.

Próximas aplicaciones del patrón ya identificadas:
- Comparador de productos (array de slugs, max 4).
- Preferencias UI (dark mode, idioma).
- Carrito anónimo (ya existe en el proyecto).

---

## 2026-05-28 — Wishlist con cookies (no DB) baja la fricción a CERO: funciona sin login + es trivial sumar sync a DB después

**Categoría**: Arquitectura / E-commerce / Decisiones de persistencia
**Confianza**: 🟡 Media (1 caso aplicado, pendiente confirmar uso real)

### Qué pasó

Al implementar wishlist tuve 2 opciones:

**A. DB-first**: tabla Supabase `wishlist` con RLS, requiere login. Pros: persistencia entre devices, datos para remarketing. Contras: cliente NO logueado no puede usar (alta fricción), implementación con cookie fallback duplica trabajo.

**B. Cookie-first**: array de slugs en cookie, sin login required. Pros: cero fricción (cualquier visitante puede usar), implementación más simple, no toca DB. Contras: no sync entre devices, no datos para remarketing en iter 1.

Elegí B. Razones específicas:
- Iter 1 de wishlist en sitio sin tráfico real: validar primero si la feature se USA antes de complejizar.
- La auth está implementada pero NADIE se va a registrar solo para guardar favoritos. Forzar login = matar el feature.
- Sync a DB en iter 2 es trivial: en `auth/callback` chequear si cookie tiene items → INSERT en tabla wishlist con user_id + clear cookie.
- Los slugs son data PÚBLICA, no hay riesgo de exponerlos en cookie no httpOnly.

### Por qué funciona

- **Cero fricción** = máxima adopción. El cliente toca corazón → guardado. No hay paso intermedio.
- **Cookie ~2KB** con 50 entries es seguro (límite browser ~4KB).
- **Server actions + revalidatePath** permiten que `/favoritos` siempre muestre lo actual.
- **Client-side read** del cookie (no httpOnly) permite badge en header sin server round-trip.

### Cómo aplicar este pattern

Para CUALQUIER feature de persistencia ligera que NO requiere auth crítica:

1. **Empezar con cookies/localStorage** si:
   - Data es pública (slugs, IDs públicos, preferencias UI).
   - Volumen es bajo (<5KB).
   - No requiere sync entre devices en iter 1.
2. **Pasar a DB** cuando:
   - Necesitás sync entre devices.
   - Querés remarketing/analytics sobre la data.
   - Volumen excede cookie limits.
3. **Migración cookie → DB** se hace en el momento de login del user (callback de auth) — simple, sin sync continuo.

### Anti-patrón a evitar

- Forzar login para features de baja sensibilidad (wishlist, último visto, carrito anónimo). Mata adopción.
- Sobre-ingeniería en iter 1: implementar DB + cookie + sync sin saber si la feature se usa.
- Confundir "feature requiere persistencia" con "feature requiere DB". A veces cookie basta.

### Aplicaciones futuras

- "Productos vistos recientemente": cookie con array de slugs, max 10.
- Preferencias UI (dark mode toggle, idioma): cookie.
- "Tu lista de comparación" (cuando se implemente): cookie array de slugs hasta 4.
- "Tu carrito" anónimo (ya implementado con cookie en el proyecto).

---

## 2026-05-28 — Crear página + API ≠ feature live. Sin navegación visible para el cliente, la feature no existe en producción.

**Categoría**: Discoverability / UX / Cierre de loop de implementación
**Confianza**: 🟢 Alta (caso obvio en retrospectiva, founder lo señaló inmediatamente)

### Qué pasó

Implementé 2 herramientas IA (recomendador de monturas + lector de receta) con páginas funcionales en `/recomendador-de-monturas` y `/lector-de-receta`, las pusheé, build verde, y declaré "feature lista". Founder reportó: **"No veo el lector de receta ni el probador de monturas"**.

Causa: las páginas existían pero NO había **ningún link visible** desde el sitio público a ellas. Solo eran accesibles por URL directa o vía sitemap (que Google ve pero el cliente humano no).

### Causa raíz

**Confundí "página existe + indexable" con "feature descubrible"**. Para un developer son lo mismo (las herramientas funcionan, sitemap las lista, Google las indexa). Para un cliente, una página sin link desde el resto del sitio **no existe**.

Patrón meta: **el ciclo de implementación de una feature web no termina en "página funciona", termina en "cliente puede llegar a la página sin saber la URL"**. Es trivial cuando se piensa, pero fácil de olvidar en el sprint de implementación.

### Cómo aplicar

Al implementar CUALQUIER nueva página/feature, antes de declarar "lista":

1. **¿Tiene link desde el header?** Si es navegación principal.
2. **¿Tiene link desde el footer?** Si es informativa/secundaria.
3. **¿Tiene sección destacada en home?** Si es diferenciadora.
4. **¿Tiene link desde páginas relacionadas?** Si es contextual (ej: link al recomendador desde brand pages de sol).
5. **¿Está en el sitemap?** Para indexación SEO.

Al menos UNO de 1-4 debe estar para que la feature exista para el cliente. Sitemap solo no basta.

### Anti-patrón a evitar

- Declarar feature live tras "build verde + push" sin verificar navegación.
- Asumir que el cliente "ya sabe" o "buscará" la URL.
- Pensar "sitemap = descubrible".
- Dejar la navegación para "iter 2" indefinidamente.

### Próxima vez aplicar a

- Cualquier feature/página nueva (legal, herramienta, blog post, etc.).
- Especialmente para iter 1 de features experimentales — la descubribilidad es CRÍTICA para validar si se usa.
- Cuando se agregue una feature dependiente de otra (ej: comparador → desde brand pages).

---

## 2026-05-28 — Patrón "2 agentes especialistas en paralelo" SIGUE funcionando para feature de IA (2do caso confirmado: lector de receta)

**Categoría**: Sistema de agentes / Workflow / Validación de pattern
**Confianza**: 🟢 Alta (2 casos exitosos: recomendador de monturas + lector de receta)

### Confirma

Para implementar el lector de receta, invoqué EXACTAMENTE el mismo patrón que con el recomendador: `optical-expert` (estructura técnica de receta argentina + rangos plausibles + umbrales presencial) + `ai-features-engineer` (modelo, PDF nativo, schema, anti-injection, privacy). Ambos respondieron en ~45-60s con outputs accionables. Implementación completa en 1 sprint sin re-trabajo.

### Outputs específicos de máximo valor

**optical-expert**:
- Umbrales operativos exactos para "graduación elevada" (|ESF|>6, |CIL|>2, |ESF|+|CIL|>7, anisometropía≥2). Sin esto, hubiera dejado el umbral vago.
- Convención clave: **cilindro siempre negativo en Argentina** (vs internacional). Sin esto, validation del backend rechazaría recetas válidas.
- Disclaimer ley 25.326 (datos sensibles de salud).

**ai-features-engineer**:
- **PDF nativo soportado** en Anthropic API (no hacía falta convertir a JPG en cliente). Ahorró ~150 líneas de código.
- Schema con `confidence` POR campo (no global) → permite resaltar campos low-confidence individualmente en el form.
- Anti-injection EXPLÍCITO en prompt (las recetas digitales pueden tener texto que el modelo malinterprete como instrucciones).

### Filtro crítico aplicado (regla del 7mo mistake)

Antes de implementar, rechacé 2 recomendaciones del ai-features-engineer:
- **Upstash en iter 1**: rate limit in-memory simple por IP basta. Si vemos abuse, escalamos.
- **HEIC conversion con heic2any**: librería nueva ~200KB. Si hay demanda real, agregamos en iter 2.

Sin este filtro, hubiera agregado complejidad sin justificación.

### Promoción a CLAUDE.md

2 casos exitosos = candidato a promoción. Si el próximo feature de IA (3er caso) confirma el pattern, agregar a CLAUDE.md como guideline:

> "Antes de implementar feature con IA Vision/RAG/etc, invocar `optical-expert` + `ai-features-engineer` en paralelo con prompts específicos pidiendo entregables accionables (NO código)."

---

## 2026-05-28 — Verificación visual del founder de un rediseño grande (rediseño catálogo minimal "quedó perfecto") valida el approach v4 sobre el aire/spacing como parte del diseño

Confirmación del learning previo sobre "minimal premium = más relaciones espaciales bien calibradas". El founder no sugirió ajustes tras ver en producción → el calibrado (spacing, columnas, tipografía) estuvo bien al primer intento. Convalida el approach holístico (no solo quitar el border).

---

## 2026-05-28 — "Sin Card wrapper" estilo Acne/Cartier requiere `<article>` semántico + grid con más spacing, no solo quitar el border

**Categoría**: UI/UX / Diseño minimal / Adaptación de patrones premium
**Confianza**: 🟡 Media (1 caso aplicado, pendiente confirmar)

### Qué pasó

Implementé el rediseño minimal del catálogo siguiendo la referencia del founder (Acne Studios / Cartier-style). El cambio NO fue solo "sacar el border y la sombra" — eso hubiera dejado un layout claustrofóbico con productos pegados unos a otros.

Cambios necesarios para que el efecto "premium minimal" funcione realmente:

1. **Reemplazar `<Card>` con `<article>`**: semánticamente correcto y sin sobreescribir estilos heredados de shadcn.
2. **Eliminar CardHeader/Content/Footer**: estos imponen padding interno que no encaja con el approach minimal.
3. **Más spacing en el grid**: pasar de `gap-4` a `gap-y-12 md:gap-y-20`. El "aire" entre productos ES parte del estilo minimal.
4. **Reducir columnas**: de 4 columnas máximo a 3. Las fotos son más grandes, hay mejor jerarquía visual.
5. **Tipografía uppercase tracking-wide**: el nombre del producto se vuelve "label" más que "título". Combinado con el centrado debajo de la foto, da onda "etiqueta de boutique".
6. **Eliminar arrows, badges, descripciones**: cualquier elemento que compita por la atención con la foto.

### Por qué no es "solo quitar el wrapper"

Un Card típico (border + shadow + padding) **compensa** la falta de spacing entre cards. Cuando lo sacás, la falta de spacing queda expuesta. Por eso minimal sin más spacing se ve "apretado", no "premium".

Patrón meta: **estilos premium minimalistas no son "menos elementos", son "más relaciones espaciales bien calibradas"**. El aire es parte del diseño, no su ausencia.

### Cómo replicar

Para CUALQUIER componente que se quiera transformar de "card tradicional" a "minimal editorial":

1. **Remover el contenedor visual** (border/shadow/bg).
2. **Aumentar spacing del grid** parent por 2-3x (de `gap-4` a `gap-y-12 md:gap-y-20`).
3. **Reducir densidad de columnas** (de 4 a 3, de 6 a 4).
4. **Limpiar elementos secundarios** (description, badges, arrows, footer separator).
5. **Convertir título a label**: uppercase + tracking-wider + font-normal (no bold).
6. **Centrar contenido**: alinear texto debajo de la imagen al centro horizontal.
7. **Asegurar contexto fuera del card**: si se quita descripción/marca, asegurarse que el contexto está en el header de la página o URL.

### Anti-patrón a evitar

- Quitar Card sin aumentar spacing → claustrofóbico.
- Quitar Card pero mantener 4 columnas → fotos diminutas, peor que antes.
- Mantener título en font-bold text-base → grita más que la foto, rompe la jerarquía.
- Eliminar TODA la info (precio, stock) → user no sabe si puede comprar.

### Próxima vez aplicar a

- Galerías de fotos del local físico (cuando se agreguen).
- Listado de marcas si se decide rediseñar también (`/anteojos-de-sol`).
- Bento grid de productos featured en home (si se implementa a futuro).
- Cards de blog/artículos si se agrega contenido editorial.

---

## 2026-05-28 — Cuando founder pasa referencia visual con "qué te parece?", responder con opinión + tradeoff + preguntas que clarifican ANTES de implementar

**Categoría**: Comunicación / Decisiones exploratorias / Prevención de re-trabajo
**Confianza**: 🟡 Media (1 caso aplicado, pendiente confirmar)

### Qué pasó

Founder mostró screenshot de catálogo de la competencia con caption "que te parece de hacer asi los catalogos? mas limpios minimalistas?". Era pregunta exploratoria, NO instrucción de implementación.

Apliqué la regla de Claude Code para exploratory questions:
> "respond in 2-3 sentences with a recommendation and the main tradeoff. Present it as something the user can redirect, not a decided plan. Don't implement until the user agrees."

Mi respuesta tuvo:
1. **Opinión + razón**: "me gusta, va con la onda premium-editorial del resto del sitio".
2. **Tradeoff principal**: "perdemos descripción corta + indicador de stock, ganamos premium feel".
3. **Cambios concretos** que haría (lista de bullets).
4. **Pregunta abierta clarificadora**: "¿incluir marca en el nombre o no? podríamos dejar solo el modelo".
5. **Pedido explícito de confirmación**: "¿avanzo?".

### Por qué importa

- **Previene re-trabajo**: si el founder no quería exactamente lo que yo entendí, ajustamos en 1 mensaje, no en 3 commits.
- **Captura preguntas chicas no obvias**: founder puede no haber pensado "incluir marca o no", pero como lo señalé puede decidir.
- **Mantiene la sensación de "decisión compartida"**: founder es el dueño del producto, yo el implementador.

### Cómo aplicar

Cuando founder pasa:
- Screenshot con "qué te parece" / "podríamos hacer así" / "te tira esta idea".
- Idea conceptual sin specs concretas ("podemos agregar más onda").
- Comparación con sitios de la competencia.

NO implementar de una. Responder en 2-3 sentences con:
1. **Opinión sintética** (gústame/no me gusta + 1 razón).
2. **Tradeoff principal** (qué perdemos vs qué ganamos).
3. **Cambios concretos** que vería (no como decisión final, como propuesta).
4. **1-3 preguntas clarificadoras** sobre detalles que tendrían múltiples interpretaciones razonables.
5. **Pedido explícito de confirmación** ("¿avanzo?").

### Anti-patrón a evitar

- Implementar de una sin clarificar. Si me equivoco en una decisión chica (ej "incluir marca o no"), 2 commits para corregir.
- Responder con sí/no plano sin tradeoff. Founder no aprende qué considerar la próxima vez.
- Hacer una decisión por mí mismo (en la implementación) en lugar de preguntarla.
- Hacer 10 preguntas. Limitar a las MÁS impactantes (1-3).

### Próxima vez aplicar a

- Cuando founder pase referencias visuales para hero / page redesign.
- Cuando proponga features sin specs ("podemos agregar comparador").
- Cuando comparta links de sitios "queridos" como inspiración.
- Cuando diga "se podría mejorar X" sin definir el qué.

---

## 2026-05-28 — Crossfade entre 2 imágenes superpuestas como hover-state: NO combinar con scale (los efectos compiten visualmente)

**Categoría**: UI/UX / Transiciones de hover / Combinación de efectos
**Confianza**: 🟡 Media (1 caso aplicado, pendiente confirmar en producción)

### Qué pasó

Implementé el patrón "hover sobre card de producto → muestra 2da imagen" (clásico de e-commerce de óptica/moda). El componente anterior tenía `group-hover:scale-[1.04]` como feedback. La nueva implementación tiene 2 imágenes superpuestas con `opacity` controlado por hover.

Combinarlas dio un efecto raro: durante el crossfade, ambas imágenes se escalaban simultáneamente. El resultado es confuso visualmente — el ojo no sabe si la imagen está cambiando o moviéndose.

**Solución**: lógica condicional en el className:
- Si hay secondary image → solo crossfade (opacity), sin scale.
- Si NO hay secondary image → mantener scale como antes (sino la card no tendría feedback visual al hover).

```tsx
className={cn(
  'object-contain transition-all duration-500 ease-out',
  secondaryUrl
    ? 'group-hover/card:opacity-0'
    : 'group-hover/card:scale-[1.04]',
)}
```

### Por qué funciona

- **Un efecto a la vez**: el ojo procesa "cambió la imagen" sin que compita con "se hizo más grande".
- **Fallback inteligente**: productos con 1 sola foto mantienen feedback de hover (scale). Productos con 2+ fotos tienen el efecto "premium" del crossfade.
- **Sin breaking changes**: el cambio no rompe cards de productos antiguos sin segunda imagen.

### Cómo replicar

Para CUALQUIER feature que combine 2+ efectos de hover sobre el mismo elemento:

1. **Probar combinaciones**: si los efectos compiten (transformación geométrica + cambio de contenido, ej scale + crossfade), elegir UNO.
2. **Default fallback**: el efecto "menos rico" debe ser el fallback cuando el dato necesario para el efecto rico no existe.
3. **Lógica condicional en className**: `cn()` + ternario en base a presencia del dato. Sin breaking changes para casos legacy.

### Anti-patrón a evitar

- Apilar todos los efectos posibles "porque están disponibles". Genera ruido visual.
- Asumir que más feedback = mejor UX. A veces es lo opuesto.
- Romper el caso "1 imagen" cuando se introduce el caso "2+ imágenes".

### Próxima vez aplicar a

- Hover sobre cards de blog/artículos cuando se agreguen.
- Cards de "destacados" en home (bento grid si se hace).
- Cualquier elemento con múltiples affordances de hover (cambio de color + scale + cursor change).

---

## 2026-05-28 — Cursor "ambiental" (no reemplaza SO + sin reacción a interactivos) supera cursor "funcional" cuando se busca premium pero sutil

**Categoría**: UI/UX / Cursor design / Decisiones de invasión visual
**Confianza**: 🟡 Media (1 caso aplicado, pendiente confirmar en producción)

### Qué pasó

Cursor follower original tenía 2 elementos (dot + ring) + `mix-blend-difference` + detección de target clickeable (ring escalaba 1.5x sobre links/buttons). Founder lo reportó como "un poco invasivo".

Le ofrecí 4 alternativas y eligió **glow/halo radial sutil**. La diferencia clave NO es "menos color" o "más blur", sino el cambio conceptual:

- **Cursor funcional (anterior)**: reemplaza el cursor del SO, RESPONDE a elementos interactivos. El usuario procesa "el cursor cambió, este elemento es importante".
- **Cursor ambiental (nuevo)**: NO reemplaza el cursor del SO, NO responde a nada. Solo decoración persistente. El usuario procesa "hay luz, el sitio se siente premium".

### Por qué el ambiental gana cuando se busca "premium pero sutil"

- **Cero overhead cognitivo**: el ambiental no requiere atención. Funciona en periférico visual.
- **No compite con micro-interacciones específicas** (spotlight en cards, magnetic buttons, tilt). Antes el cursor "anunciaba" hover; ahora cada elemento maneja su propio feedback.
- **Cursor del SO siempre visible**: el usuario nunca pierde el feedback estándar de "qué tipo de elemento es" (text cursor, pointer, grab, etc.).
- **Más fácil de calibrar**: 1 parámetro de "intensidad" (size, opacity, blur). Cursor funcional tiene N parámetros (dot size, ring size, spring stiffness, scale on hover, blend mode).

### Cuándo usar cada uno

- **Ambiental** (glow/halo, trail, sutil): sitio comercial / brand-driven donde se busca "premium pero limpio".
- **Funcional** (reemplazo + reacción): sitio editorial / portfolio donde el cursor ES parte de la firma visual (ej Awwwards). Costo: requiere ser consistente y diseñado con cuidado.

### Cómo aplicar

Default a **ambiental** salvo que haya razón explícita para funcional. Si se elige funcional:
- Validar en mobile (touch devices NO deben verlo).
- Validar `prefers-reduced-motion` (usuarios con sensibilidad NO deben verlo).
- Documentar la decisión y los parámetros de calibración.

### Anti-patrón a evitar

- Asumir que más efectos = más premium. A veces "menos es más" (especialmente para sitios comerciales).
- Combinar cursor funcional con otras micro-interacciones de hover (spotlight, magnetic). Saturan.
- No proveer opt-out — touch + reduced-motion deben siempre poder desactivarlo.

### Próxima vez aplicar a

- Cuando se evalúe cursor / efecto similar en próximas iteraciones de polish visual.
- Cuando se diseñen efectos de hover en cards / botones / links — preguntarse si compiten con un cursor "funcional" ya existente.
- Cualquier feature visual que tape o reemplace una affordance del SO (cursor, scroll, selección de texto).

---

## 2026-05-28 — Marcas `[A CONFIRMAR: ...]` inline en código de contenido permiten despliegue + edición posterior sin bloquear

**Categoría**: Generación de contenido / Workflow founder no-técnico
**Confianza**: 🟡 Media (1 caso aplicado, pendiente validar utilidad real cuando founder edite)

### Qué pasó

Al implementar las FAQs, tenía 5 puntos de datos sin confirmar (plazos exactos, dirección/horario, cantidad de cuotas, política de devolución, umbral graduación elevada). Dos caminos posibles:

**Camino A**: NO implementar hasta que founder confirme los 5 datos. Costo: feature queda bloqueada, infraestructura técnica no se valida.

**Camino B**: Implementar TODO con drafts + marcas literales `[A CONFIRMAR: ...]` en el contenido. Costo: el sitio muestra texto con esa marca temporal hasta que founder la reemplace.

Elegí B. Las marcas son:
- **Visibles en producción** (no escondidas en comentarios HTML), así el founder las ve y se acuerda.
- **Self-documenting**: indican exactamente qué falta confirmar.
- **Fácil de buscar**: `grep "A CONFIRMAR" lib/content/faqs.ts` lista todo lo pendiente.
- **No bloqueante**: el sitio funciona, schema SEO funciona, accordion funciona — solo el dato exacto está pendiente.

### Por qué funciona

- **Desacopla deploy de contenido completo**. Implementación técnica + estructura + UI/UX no esperan datos finales.
- **Compromiso visible**: founder ve el `[A CONFIRMAR]` cada vez que abre la página → presión social suave para completarlo.
- **Tracking gratuito**: grep o búsqueda en código revela todos los pendientes sin necesidad de tracker externo.
- **Rollback fácil**: si el founder no completa nunca, las marcas siguen siendo info parcial mejor que nada.

### Cómo replicar

Para CUALQUIER contenido del sitio donde:
- La infraestructura técnica está clara.
- Algunos datos puntuales requieren info del founder.
- El founder puede tardar días/semanas en consolidar la info.

1. **Implementar con drafts + marcas** `[A CONFIRMAR: contexto específico]`.
2. **Centralizar contenido** en un archivo único (`lib/content/X.ts`) para que el founder edite UN solo lugar.
3. **Documentar en CURRENT_STATE.md** qué marcas hay pendientes para que no se pierdan.
4. **Pasarle al founder la lista exacta** UNA vez (en el mensaje de cierre de iter 1). NO repetirla en cada turno (regla de "no saturar con pendientes").

### Anti-patrón a evitar

- Esconder pendientes en comentarios `// TODO` que el founder no ve.
- Usar lorem ipsum como placeholder (sugiere "nada pensado", no comunica qué falta).
- Implementar con datos inventados sin marca (riesgo: founder no se entera que están mal hasta que un cliente los usa).
- Bloquear deploy esperando datos completos cuando la infra técnica vale la pena tener live.

### Próxima vez aplicar a

- Páginas legales (cuando se completen política de privacidad / términos).
- Copy del checkout (mensajes de confirmación con datos del negocio).
- Email templates de confirmación de orden.
- Descripciones de marcas en brand pages.
- Datos de contacto en footer (si en algún momento se agregan datos parciales).

---

## 2026-05-28 — Confirmación visual del founder cierra el ciclo de validación — su "quedaron bien" es el gate

**Categoría**: Workflow / Validación / Cierre de ciclo
**Confianza**: 🟢 Alta (patrón consistente: typecheck/build verde no implica fix correcto; founder visual sí)

### Qué pasó

Implementé fix de simetría de brand cards (propagación de `h-full` por toda la cadena de wrappers). Build verde, typecheck verde. Pero hasta que el founder no confirma "quedaron bien simetricamente" tras verlo en producción, el fix queda en estado 🟡 pendiente.

Esto se repite consistentemente en el proyecto:
- Crop visual del producto (3 iteraciones documentadas en MISTAKES).
- Logos de marcas (5 iteraciones de tamaño hasta llegar a la versión que funcionó).
- Hero del founder ("muy estático" → ajustar animación; "se pierde la J de anteojos" → bug del LetterReveal).
- Cards de marca asimétricas.

### Por qué esto es estructural, no anomalía

Build/typecheck validan **corrección sintáctica y de tipos**. NO validan:
- Resultado visual (alturas, alineación, tamaños).
- Resultado UX (¿se entiende?, ¿es claro?, ¿no satura?).
- Resultado con datos reales (descripciones de distinto largo, SVGs de proporción distinta).

El único loop de validación efectivo para fixes visuales/UX es founder visual en producción. Por eso el patrón "implementar → typecheck verde → push → esperar feedback" es correcto para este tipo de cambios.

### Cómo aplicar

Para cualquier cambio visual/UX:
1. Implementar.
2. Typecheck + build (gate técnico mínimo).
3. Push.
4. **NO declarar "fix definitivo" hasta que founder confirme visualmente**.
5. Lenguaje hipotético en el mensaje de cierre ("debería resolver", "si todavía corta…"), nunca declarativo.

Para cambios de lógica pura (queries, validaciones, calculations):
- Tests automáticos pueden cerrar el ciclo sin founder visual.
- Confirmation no se necesita para cada cambio.

### Próxima vez aplicar a

- Tunings visuales del checkout cuando se active.
- Iter 2 del recomendador (links a catálogo filtrado, share por WhatsApp).
- Cualquier feature de UI que se agregue al sitio.
- Diseño de páginas legales / FAQs cuando se implementen.

---

## 2026-05-28 — `h-full` debe propagarse por TODA la cadena de wrappers (grid → wrapper anim → Link → Card), no solo en el elemento final

**Categoría**: CSS / Flexbox/Grid / Componentes con wrappers anidados
**Confianza**: 🟢 Alta (caso concreto detectado y resuelto)

### Qué pasó

Las brand cards de Rusty y Vulk en `/anteojos-de-sol` se veían con alturas distintas según el largo de su `description` (Rusty 4 líneas → card más alta; Vulk 2 líneas → card más baja). El `<Card>` interno tenía `h-full flex flex-col` y el `CardContent` tenía `flex-1` — el setup correcto para alto uniforme.

**Pero la cadena de wrappers era**:
```
grid (items-stretch default)
  └ RevealOnScroll (sin h-full)
      └ Link (block, sin h-full)
          └ Card (h-full ✅)
```

`h-full` necesita que el parent tenga altura definida. Si algún parent intermedio no propaga la altura, el `h-full` del descendiente no funciona.

### Causa raíz

CSS `height: 100%` (= Tailwind `h-full`) requiere que el padre tenga altura calculable. En una cadena de wrappers, **cada nivel intermedio que sea `display: block` por default trunca la propagación**. El alto del grid row no llega hasta el `<Card>` porque `<Link>` y `<RevealOnScroll>` no son `h-full`.

### Fix

Agregar `h-full` a TODA la cadena, no solo al elemento final:
```tsx
<RevealOnScroll className="h-full">
  <Link href={...} className="block h-full">
    <Card className="flex h-full flex-col">
      ...
    </Card>
  </Link>
</RevealOnScroll>
```

Ahora la altura del grid row se propaga: grid → RevealOnScroll → Link → Card. Todas las cards se igualan al alto de la más alta. `flex-1` en CardContent absorbe el espacio sobrante (las descripciones más cortas dejan más aire interno, no rompen simetría del exterior).

### Cómo replicar

Cuando armes una grilla de cards con altura uniforme deseada:

1. **El grid container** ya tiene `items-stretch` por default → no hace falta agregar nada.
2. **CADA wrapper intermedio** entre el grid y la card final debe tener `h-full`. Incluyendo:
   - Componentes de animación (RevealOnScroll, motion.div, etc.).
   - Links (`<Link>` o `<a>`).
   - Decoradores (TiltSpotlightCard, MagneticButton, etc.).
3. **La card final** debe ser `flex flex-col h-full` para que `flex-1` en un child absorba espacio sobrante.

### Anti-patrón a evitar

- Poner `h-full` solo en el elemento más profundo asumiendo que CSS "lo entiende".
- Olvidar que componentes wrapper custom (RevealOnScroll, TiltSpotlightCard, etc.) son `<div>` por default → necesitan `h-full` explícito.
- Validar simetría con datos demo de igual largo (las descripciones lorem ipsum de la misma longitud no revelan el bug).

### Próxima vez aplicar a

- Cualquier grid de cards (productos, marcas, categorías, blog posts).
- Featured products en home (cuando se agreguen).
- Bento grid (si lo implementamos a futuro).
- Cards de comparación de productos.

---

## 2026-05-28 — Cuando founder pide "guíame con X", entregar template pre-rellenado con drafts + marcas `[CONFIRMAR]` — no preguntas abiertas

**Categoría**: Comunicación / Reducción de fricción / Generación de contenido
**Confianza**: 🟡 Media (1 caso aplicado, pendiente confirmar utilidad real cuando founder devuelva feedback)

### Qué pasó

Founder pidió "guiame con el tema de los FAQs, que podemos agregar". Tenía 2 caminos posibles:

**Camino A**: hacerle preguntas abiertas — "qué temas querés cubrir?", "cuántas FAQs?", "qué tono?". Fricción alta: founder tiene que pensar la estructura desde cero.

**Camino B**: armar yo la estructura completa con drafts pre-rellenados desde lo que ya sé del negocio (BUSINESS_POLICIES.md, CLAUDE.md), organizada por temas, y dejarle solo el trabajo de **revisar/ajustar/completar datos puntuales**. Fricción baja: founder lee, marca lo que está bien, ajusta lo que no, completa datos `[CONFIRMAR]`.

Elegí B. Le entregué 18 FAQs en 6 temas con drafts + marcas explícitas de qué datos necesito que él confirme (plazos, dirección, cuotas, política exacta de envío de devolución).

### Por qué funciona

- **Founder hace VALIDACIÓN, no GENERACIÓN**. Validar texto pre-armado es 5x más rápido que generar texto desde cero.
- **Drafts revelan mi modelo mental** del negocio. Si me equivoco en alguno, founder lo corrige en 30 segundos. Si lo dejara abierto, podríamos estar 5 mensajes ida y vuelta resolviendo el mismo punto.
- **Marcas `[CONFIRMAR]` explícitas** dicen al founder exactamente qué datos faltan. No queda dudando "¿qué más necesita Claude?".
- **Estructura por temas + numeración** permite respuestas selectivas ("FAQ 1.2 cambiá X, el resto está bien").
- **Aplicable a contenido en general**, no solo FAQs.

### Cómo replicar

Cuando founder pida "guíame con X", "armemos X", "qué podemos agregar a X":

1. **NO** hacer preguntas abiertas inicialmente.
2. **SÍ** armar yo una propuesta concreta:
   - Estructura clara (categorías, secciones, items numerados).
   - Drafts pre-rellenados desde fuentes de verdad disponibles (BUSINESS_POLICIES, CLAUDE.md, código, conversación previa).
   - Marcas `[CONFIRMAR]` explícitas donde necesito dato real del founder.
   - Camino claro para responder ("marcá lo que está bien, ajustá lo que no, completá datos").
3. Si me equivoco en estructura → founder me lo dice en 1 turno, ajusto.
4. Si me equivoco en algunos drafts → founder los corrige y aplico al resto.

### Casos típicos

- **Contenido del sitio**: FAQs, descripciones de páginas legales, copy de CTAs, micro-copy de error states.
- **Definiciones de política**: hacer draft de la política, founder ajusta/aprueba.
- **Email templates**: armar draft, founder ajusta tono / data.
- **Comunicación con proveedores**: redactar primer mail, founder ajusta.
- **Planning de roadmap**: armar propuesta de prioridades, founder reordena.

### Anti-patrón a evitar

- Responder "qué temas querés cubrir?" cuando puedo proponer 6 temas relevantes desde lo que ya sé.
- Dar instrucciones de "tomate tiempo y pensá X" — el founder no es content creator, no tiene framework para generar desde cero.
- Hacer la propuesta DEMASIADO larga sin ser claro qué espero del founder. Cerrar con "tu tarea ahora..." explícito.

### Próxima vez aplicar a

- Definir política de devoluciones / cambios detallada (cuando se active checkout).
- Armar copy de páginas de marca cuando se agregue 2da marca con productos.
- Definir guía de cómo medir DNP / probarse anteojos (si se agrega contenido educativo).
- Estructurar webinar / blog editorial si el negocio crece a esa dirección.

---

## 2026-05-28 — Cuando founder responde "qué tengo que hacer?" tras instrucciones técnicas, la solución es REDUCIR pasos, no explicar más

**Categoría**: Comunicación / Reducción de fricción para founder no-técnico
**Confianza**: 🟢 Alta (caso claro, solución obvia en retrospectiva)

### Qué pasó

Le entregué instrucciones al founder para fixear el SVG de Paula:
1. Abrí el archivo `paula-cahen-danvers-logo-dark.svg` en un editor de texto.
2. Reemplazá la primera línea por esto: `<svg... viewBox="80 280 625 210" ...>`.
3. Guardá → subí al bucket reemplazando.

Founder respondió: **"que tengo que hacer?"**.

Mi reacción correcta: NO repetir las instrucciones con más detalle. La respuesta del founder revelaba que el flujo "editar archivo local" era demasiado fricción (requiere editor de texto + encontrar la línea + cambiarla sin romper nada + guardar con encoding correcto).

**Cambié de approach**: en lugar de pedirle que editara, **le entregué el SVG completo con el fix ya aplicado** y los pasos quedaron en 3: copiar → crear archivo nuevo (pegando) → subir reemplazando. Eliminé el paso "editar archivo existente" que era el cuello de botella.

### Por qué funciona

Cuando el founder dice "qué tengo que hacer?" tras instrucciones, está señalizando que **el costo cognitivo de las instrucciones supera su threshold**. Las causas típicas:

- **Pasos involucran herramientas que no usa diariamente** (editor de texto plano para SVG).
- **Riesgo percibido de "romper algo"** (¿qué pasa si edito mal la línea?).
- **Pasos requieren conocimiento implícito** (¿qué editor uso? ¿qué encoding? ¿cómo guardo?).

La solución NO es "explicar mejor cada paso". La solución es **eliminar pasos**.

### Cómo replicar

Cuando le pase al founder instrucciones técnicas, antes de enviar mensaje preguntarme:

1. ¿Las instrucciones requieren que el founder ABRA / EDITE / TRANSFORME un archivo?
2. ¿Podría YO hacer esa edición y entregarle el resultado final?
3. Si sí → entregar resultado final, no instrucciones para producirlo.

Específicamente:
- **Edición de SVG**: pasarle el SVG completo modificado, no instrucciones de qué línea cambiar.
- **Edición de SQL**: pasarle el statement completo listo para correr, no instrucciones de qué WHERE agregar.
- **Edición de config files**: pasarle el archivo completo o el diff exacto en formato copy-paste.
- **Edición de texto largo**: pasarle el texto final, no diffs textuales.

Si el founder ya tiene un workflow para X (ej "subir archivo al bucket"), apoyarse en ESE flujo, no inventar uno nuevo (ej "editar archivo local").

### Anti-patrón a evitar

- Tras "qué tengo que hacer?" → repetir las mismas instrucciones más detalladas. Empeora.
- Asumir que "editor de texto" es una herramienta universal trivial. Para el founder no-técnico es fricción real.
- Pedirle al founder que haga un paso intermedio cuando YO podría producir el resultado final.

### Próxima vez aplicar a

- Edición de cualquier archivo de configuración / asset / SQL.
- Cualquier flujo donde el founder tiene que "tocar" algo entre que yo le doy info y que sube el resultado.
- Cuando proponga "fix manual" como solución → evaluar si lo puedo entregar como "fix automático" (archivo completo, statement completo, config completa).

---

## 2026-05-28 — Recortar `viewBox` al bounding box del contenido es el fix correcto para SVGs con mucho aire interno

**Categoría**: SVG / Optimización de assets / Edición directa de archivos
**Confianza**: 🟢 Alta (técnica estándar SVG, predecible, no requiere cambios de código)

### Qué pasó

SVG de Paula Cahen D'Anvers venía con `width="768" height="768"` y sin `viewBox` explícito (implícito = `0 0 768 768`). El contenido visual real ocupaba solo ~26% del cuadrado.

Diagnosticé el bounding box analizando los `transform="translate(x,y)"` de cada `<path>` + las coordenadas internas:
- **Símbolo (corona)**: paths con `translate(371, 326)`, `translate(383, 367)`, `translate(377, 292)`. Coords internas iban de -50 a +80 aprox. Resultado: símbolo ocupa `(319, 292)` a `(448, 397)`.
- **Texto**: paths con `translate(x, 452-453)` donde `x` iba de 92 (primer carácter) a 671.9 (último). Cada path tiene ancho ~24 unidades. Resultado: texto ocupa `(92, 452)` a `(696, 477)`.
- **Bounding box total**: `(80, 280)` a `(705, 490)` = **625×210** (con padding 10-15 unidades).

Fix aplicado: cambiar la primera línea del SVG agregando `viewBox="80 280 625 210"` + ajustar `width="625"` y `height="210"`. **Sin tocar ningún `<path>` interno**.

### Por qué funciona

- `viewBox` define qué porción del "espacio infinito" del SVG es visible. Al recortar al bounding box del contenido, todo el "aire" alrededor se elimina del render.
- Las coordenadas internas de los paths NO cambian (siguen siendo las mismas absolute coords). Solo cambia lo que el navegador renderiza dentro del `<img>`.
- `width/height` del root SVG ahora matchean el aspect ratio real del contenido → `object-contain` escala todo el contenido al ancho/alto del contenedor.
- Resultado: cuando el container es `h-20` (80px), todo el contenido visual ocupa esos 80px, no el 26%.

### Cómo replicar

Para CUALQUIER SVG (logo, ícono, ilustración) que se ve "chico dentro de su contenedor":

1. **Diagnóstico**: ¿el contenedor está bien dimensionado y el contenido visual se ve achicado? → problema es del SVG.
2. **Calcular bounding box**:
   - Mirar todos los `transform="translate(x,y)"` de cada `<path>` / `<g>`.
   - Para cada uno, analizar las coordenadas internas y calcular `min_x`, `min_y`, `max_x`, `max_y` absolutos.
   - El bounding box es `(min_x, min_y, max_x - min_x, max_y - min_y)`.
3. **Setear `viewBox`** con el bounding box + 5-15 unidades de padding a cada lado para que no quede pegado.
4. **Ajustar `width/height`** del root SVG para que el aspect ratio matchee el viewBox.
5. **Reemplazar archivo en bucket** (mismo path → no cambia DB).
6. Hard refresh para invalidar cache si no se ve actualizado.

### Anti-patrón a evitar

- Intentar ajustar el SVG con CSS (transform: scale) — más complejo, frágil, mantiene el aire.
- Re-exportar el SVG desde Illustrator / Figma "con padding 0" sin entender qué hace — capaz no resuelve.
- Pedirle al founder "buscar otro asset" cuando el fix en el actual es 30 segundos.

### Próxima vez aplicar a

- Cualquier asset SVG futuro que se vea chico en su contenedor.
- Íconos custom de medios de pago, badges, sellos de certificación.
- Banners promocionales si vienen con padding interno.
- Ilustraciones de cómo medir DNP o probarte un armazón (si en algún momento se agregan).

---

## 2026-05-28 — Cuando UN asset individual no se ve bien, arreglar el asset — NO ajustar el render global que afecta a todos los demás

**Categoría**: Diseño / Decisión técnica / Defaults vs excepciones
**Confianza**: 🟢 Alta (caso claro identificado y decisión documentada con razonamiento explícito)

### Qué pasó

Tras 2 fixes de tamaño en `brands-section.tsx` (h-10 → h-12/h-14 → h-16/h-20), el founder reportó que Paula Cahen D'Anvers seguía chico. Me pidió: "podés aumentarlo más de tamaño o busco otra imagen?".

**Resistí la tentación de aumentar tamaño en código una 3ra vez**. Razonamiento explícito:

- Los otros 4 logos (Rusty, Vulk, Mormaii — wordmarks horizontales; Reef — cuadrado) YA están en buen tamaño visual.
- Paula es un outlier: su SVG tiene viewBox con mucho aire interno (contenido ocupa ~30% del cuadrado).
- Aumentar tamaño global empeora 4 logos para arreglar 1.

**Solución correcta**: arreglar el SVG de Paula (recortar viewBox al bounding box del contenido visible) o conseguir otra versión optimizada.

### Por qué este patrón es importante

Es la versión específica del principio "**fix at the source, not downstream**". Cuando un asset individual está mal, el costo de "arreglarlo en el renderer" es:
- Empeorar la UX de todos los assets bien hechos.
- Esconder el problema real del asset.
- Acumular hacks específicos (Paula = h-24, resto = h-20).
- Si en el futuro Paula se reemplaza, los hacks quedan dañando los nuevos assets.

El costo de "arreglarlo en el asset" es:
- 2 minutos editando el SVG (ajustar `viewBox`).
- Un asset bien optimizado funciona para CUALQUIER tamaño de render futuro.

### Cómo aplicar el principio

Antes de hacer un ajuste en el código que afecta múltiples assets para resolver un problema de UNO:

1. **Pregunta**: ¿el problema es del asset (mal exportado, viewBox aireado, formato incorrecto) o del código?
2. **Si es del asset** → arreglar el asset. Costo predecible, beneficio duradero.
3. **Si es del código** → ajustar el código. Verificar que el ajuste mejora la UX de todos los assets, no solo el problemático.

### Anti-patrón a evitar

- "Subir el tamaño otro escalón a ver si Paula se ve bien" → vas a ver que se ve "mejor" pero los otros se ven "demasiado grandes" sin que lo notes hasta que el founder lo señale. Pérdida progresiva de calidad visual.
- Hardcodear excepciones por slug ("si brand.slug === 'paula' → h-24"). Acopla el código a datos específicos, difícil de mantener.
- Considerar "arreglar el SVG" como tarea "de diseño" fuera del alcance del developer. Editar un `viewBox` en un SVG es 30 segundos con un editor de texto, está dentro del alcance.

### Próxima vez aplicar a

- Cualquier feature de assets visuales (logos, fotos producto, banners, íconos).
- Cuando un producto puntual no se vea bien en el grid pero los demás sí.
- Cuando un email render se vea raro para UN destinatario pero bien para todos.
- Cuando UN dato en DB rompe una query agregada pero el resto funciona — fix the data, not the query.

---

## 2026-05-28 — SVGs de logos tienen aspect ratios y composiciones internas muy heterogéneas — el render con altura fija necesita margen para el peor caso

**Categoría**: Diseño / Rendering / Assets variables
**Confianza**: 🟡 Media (1 caso, 5 logos, varios edge cases observados)

### Qué pasó

Al integrar logos de 5 marcas (Vulk, Rusty, Mormaii, Reef, Paula Cahen D'Anvers), elegí altura inicial `h-10` (40px) en el render como tamaño "razonable" para un logo de marca. En producción, las 5 marcas mostraron variabilidad enorme:

- **Rusty**: wordmark horizontal compacto → ocupa toda la altura → se ve bien.
- **Vulk**: wordmark horizontal con paths que llenan el viewBox → se ve bien.
- **Mormaii**: wordmark con símbolo a la izquierda → ocupa altura completa → se ve bien (cuando carga).
- **Paula Cahen D'Anvers**: SÍMBOLO PEQUEÑO ARRIBA + texto en mayúsculas DEBAJO. El símbolo + texto juntos suman altura pero el contenido visual relevante ocupa solo el ~30% del viewBox. Con `h-10` el contenido visible queda en ~12px, ilegible.
- **Reef**: aparte de su problema de naming, su SVG es cuadrado, ocupa todo el viewBox.

El "tamaño razonable" que elegí (`h-10`) funcionó para 4 de 5 logos pero falló para Paula porque ASUMÍ que todos los logos tienen composición horizontal balanceada (wordmark + opcional símbolo a la izquierda). No es así.

### Por qué funciona el fix

Cambié a `h-12 md:h-14` (48-56px) + `max-w-[140px]`. Esto:
- Da espacio suficiente para que el contenido visual real de Paula sea legible.
- No achata logos de wordmark horizontal (siguen quedando bien porque object-contain los ajusta proporcional).
- Limita el ancho para que un logo muy panorámico no rompa el grid.

### Cómo replicar

Para CUALQUIER feature que renderice assets de tamaño/aspect ratio variable (logos, fotos de productos, banners de marca, íconos de pago):

1. **Default a tamaños generosos** (más altura, más ancho-max). Es mejor desperdiciar ~10px de espacio cuando el asset es chico que truncar/achicar el contenido cuando es grande/centrado.
2. **Usar `object-contain` + `max-w`** en lugar de altura fija sin max ancho. El navegador ajusta proporcional sin distorsionar.
3. **Verificar con el peor caso** (símbolo centrado en viewBox grande, wordmark muy panorámico, texto vertical) antes de declarar el tamaño "OK".
4. **Documentar la justificación del tamaño en el código** (por qué h-12 y no h-10) para que la próxima vez se entienda el razonamiento.

### Anti-patrón a evitar

- Elegir tamaño basado en "lo que se ve bien con el primer asset" sin probar con assets de diferentes proporciones.
- Asumir que todos los SVGs de un dominio (logos de marca) van a tener composición similar — no es así.
- Hardcodear tamaño solo en altura sin max-width — un asset panorámico puede romper el grid.

### Próxima vez aplicar a

- Cuando se agreguen banners de promo / hero rotators (variabilidad de aspect ratios alta).
- Cuando se agreguen fotos de producto con diferentes orientaciones (algunos productos son cuadrados, otros panorámicos).
- Cuando se agreguen íconos de medios de pago (algunos son lockups completos, otros solo símbolos).
- Si en el futuro se agrega "galería de fotos del local" en `/sobre-nosotros` con fotos horizontales y verticales mezcladas.

---

## 2026-05-28 — Diagnóstico "doble paralelo" para problemas de carga de assets desde Supabase Storage: URL directa + SELECT del path

**Categoría**: Debugging / Supabase Storage / Comunicación con founder no-técnico
**Confianza**: 🟡 Media (1 caso, pendiente confirmar resolución)

### Qué pasó

Founder pusheó los UPDATEs SQL para activar los logos de Vulk y Rusty. En producción los logos aparecieron como **placeholders rotos con alt text visible al lado** (clásica señal de `<Image>` que falla al cargar la URL).

En lugar de pedirle al founder múltiples idas y vueltas para diagnosticar ("revisá el bucket", "fijate el path", "abrime los logs", "verificá CORS"), le di **2 acciones paralelas que cubren ambas causas probables a la vez**:

1. **URL directa en el navegador** (`https://[project].supabase.co/storage/v1/object/public/brand-assets/...`):
   - Si ve la imagen → bucket OK, problema es el path en DB.
   - Si ve 403/404 → bucket privado o path mal.

2. **SELECT del path en DB** para confirmar que matchea exactamente con el archivo del bucket (case-sensitive).

Cada acción discrimina entre 2 causas posibles. Las 2 juntas cubren las 4 combinaciones (bucket público + path OK, bucket público + path mal, bucket privado + path OK, bucket privado + path mal).

### Por qué funciona

- **Diagnóstico paralelo** vs **diagnóstico secuencial**: en secuencial el founder hace una acción, me reporta, yo pienso, le pido otra. En paralelo me ahorra 2-3 turnos de comunicación.
- **Las 2 acciones son cheap para el founder no-técnico**: una URL para pegar en el browser + un SELECT para correr. No requiere navegación compleja en el Dashboard ni configuración previa.
- **Cubre las dos dimensiones del problema**: infrastructure (bucket público / privado) Y data (path correcto en DB).
- **El output de cada acción es discriminatorio**: ver/no ver imagen → respuesta binaria. Comparar paths visualmente → trivial.

### Cómo replicar

Para CUALQUIER problema de "asset no carga desde Storage" en producción:

1. **Acción 1 — URL directa**: construir la URL pública completa y pedirle al founder que la pegue en el navegador. Discrimina entre "infrastructure issue" (bucket privado, CORS, dominio bloqueado) y "data issue" (path mal).
2. **Acción 2 — SELECT del path**: query simple que muestra el path tal como está en DB. Discrimina entre "path correcto + setting mal" y "path mal + setting OK".
3. **Si están claro 1 y 2 → diagnóstico inmediato sin más ida y vuelta**.

### Anti-patrón a evitar

- **Pedir un solo paso de diagnóstico cuando hay 2+ causas probables**: el founder hace lo que pediste, vuelve, yo proceso, pido otro. 4 turnos en lugar de 1.
- **Pedir al founder que "revise los logs de Vercel"** o cosas internas técnicas: si hay forma de diagnosticar desde afuera (URL pública, SELECT), preferir eso.
- **Asumir una sola causa "obvia"** sin cubrir las alternativas: si me equivoco, perdí 1 turno y la confianza del founder.

### Próxima vez aplicar a

- Cualquier feature de carga de assets/imágenes que pueda fallar en producción.
- Cualquier feature que dependa de configuración manual del founder en un panel externo (Supabase, Vercel, MP, Tusfacturas) — anticipar las 2-3 causas posibles y dar 2 acciones de diagnóstico paralelas.
- Verificación de env vars en Vercel (test endpoint que confirma que la var existe sin exponerla).

---

## 2026-05-28 — Founder no-técnico prefiere separación visual de buckets en Dashboard sobre reuso técnico con prefijos

**Categoría**: Supabase Storage / UX del founder / Arquitectura adaptada al usuario
**Confianza**: 🟢 Alta (decisión explícita del founder + lógica clara que aplica a Dashboard UI)

### Qué pasó

Propuse reusar bucket `products` con prefijo `_brand-logos/` para los logos de marca (ver entry refutado arriba). Founder eligió OPUESTO: creó bucket nuevo `brand-assets` con carpeta `brand-logos/` adentro. Subió `vulk-logo-light.svg` y `rusty-logo-dark.svg` ahí.

Mi lógica: "menos overhead operacional, helper existente funciona". Pero founder priorizó otra dimensión que yo NO consideré:

**Cuando el founder no-técnico gestiona el bucket por el Dashboard UI de Supabase, ver buckets separados por TIPO de asset es más entendible que ver un solo bucket con subcarpetas mezcladas.**

En el Dashboard:
- Mi propuesta: `products/` ← acá conviven fotos de productos reales (vulk-day-light/...) Y assets internos (_brand-logos/...). El founder tiene que navegar y entender el prefijo `_`.
- Decisión founder: `products/` para fotos reales + `brand-assets/` para logos. Cada bucket tiene un único propósito claro.

### Por qué la decisión del founder es mejor que la mía

- **Cognitive overhead bajo**: el founder ve "products" y sabe "fotos de productos". Ve "brand-assets" y sabe "logos y assets de marca". No tiene que recordar convención de prefijo.
- **Permite políticas RLS distintas a futuro**: brand-assets podría tener policies diferentes (ej caching más agresivo, retention diferente) sin afectar productos.
- **Búsqueda más fácil**: search in bucket queda scoped al tipo de asset.
- **Setup operacional bajo**: crear bucket en Dashboard es 30 segundos UI clicks. El "overhead" que yo prioricé era marginal.
- **Mi helper paralelo no es problema**: `getBrandAssetUrl()` es 5 líneas, copy-paste de `getProductImageUrl()`. Cero burden.

### Causa raíz de mi error

Optimicé por dimensión equivocada: **"overhead técnico" (creación de bucket + helper)** en vez de **"overhead cognitivo del founder en Dashboard UI"**. El primero lo pago una sola vez yo (30 minutos). El segundo lo paga el founder CADA VEZ que abre el Dashboard a gestionar assets.

Patrón meta: **cuando hay 2 dimensiones de costo (técnica vs UX/cognitiva), priorizar la UX/cognitiva del founder no-técnico si:**
- La operación es recurrente para él (gestión de assets, productos, órdenes).
- El costo técnico que se ahorra es chico (helper extra, bucket setup, etc.).
- No hay constraints de performance reales (compute, latencia).

### Cómo replicar

Para CUALQUIER decisión de arquitectura que afecte cómo el founder interactúa con sistemas externos (Supabase Dashboard, panel Mercado Pago, panel Tusfacturas, Resend, Vercel):

1. **Pensar primero**: ¿esto va a aparecer en una UI que el founder use recurrente?
2. **Si sí**: ¿la decisión técnica le agrega overhead cognitivo? (convenciones para recordar, navegación extra, búsqueda compleja).
3. **Si sí + el costo técnico es marginal**: priorizar la opción que sea más obvia visualmente en la UI externa.
4. **Documentar la convención** en este archivo para que la próxima decisión similar sea correcta sin re-derivarla.

### Aplicaciones concretas

- **Buckets Supabase Storage**: 1 bucket por tipo semántico de asset (`products`, `brand-assets`, `prescriptions`, `banners-promo`). NO mezclar con prefijos.
- **Tablas Supabase**: ya está bien separado por entidad (products, brands, orders, etc.) — mantener.
- **Env vars Vercel**: agrupar por servicio con prefijo claro (`MP_*`, `RESEND_*`, `TUSFACTURAS_*`).
- **Folders dentro de cada bucket**: usar slugs claros (`vulk-day-light/`, `brand-logos/`). NO prefijos cripticos como `_internal/`.

### Anti-patrón a evitar

- Optimizar por "menos overhead técnico de mi parte" cuando ese overhead lo pago yo una sola vez y el founder paga overhead cognitivo recurrente.
- Inventar convenciones (prefijo `_`) que requieren documentación adicional para el founder.
- Asumir que "limpieza arquitectural teórica" pesa más que "cómo se ve en la UI externa".

### Próxima vez aplicar a

- Cuando se agreguen banners de promo / hero rotators: bucket `banners-promo/` separado en vez de mezclar en `products`.
- Cuando se agreguen fotos del local físico para `/sobre-nosotros`: bucket `store-photos/` separado.
- Cuando se agreguen íconos custom de medios de pago: bucket `payment-icons/` separado.
- Si en el futuro hay videos de productos: bucket `product-videos/` separado por billing diferente.

---

## 2026-05-28 — Reusar bucket Supabase existente con prefijo `_` para assets internos reduce overhead operacional vs crear bucket dedicado

**Categoría**: Supabase Storage / Arquitectura / Operacional
**Confianza**: 🔴 **REFUTADO en 2026-05-28** — founder eligió bucket separado `brand-assets` por simpleza visual del Dashboard de Supabase Storage. Ver entry siguiente "Founder no-técnico prefiere separación visual de buckets" para la versión corregida del learning.

### Qué pasó

Al integrar logos de marcas (Vulk + 4 más a futuro), tenía 2 opciones:

**Opción A**: crear bucket nuevo `brand-assets` dedicado. Pros: semánticamente limpio (assets no son productos). Contras: founder no-técnico tiene que crear bucket en Dashboard, configurar RLS pública, y yo tengo que crear helper `getBrandAssetUrl()` paralelo a `getProductImageUrl()`.

**Opción B**: reusar bucket `products` existente con prefijo `_brand-logos/`. Pros: cero setup operacional para el founder, helper existente funciona, RLS ya configurado. Contras: semánticamente mezclamos assets con productos.

Elegí **opción B** con criterio: el costo semántico es bajo (prefijo `_` distingue), y el ahorro operacional es alto (founder no tiene que aprender otro bucket). Si en el futuro hay overhead real (ej: tamaño del bucket products crece y queremos separar billing), migrar es trivial: copiar archivos + UPDATE de paths en DB.

### Por qué funcionó

- **Prioricé el costo cognitivo del founder no-técnico** sobre la "limpieza arquitectural" teórica. Founder sabe usar el bucket `products`, ya subió las fotos de Vulk Day Light ahí.
- **Prefijo `_` como convención visual**: distingue assets internos (logos, banners genéricos) de assets de producto. Convención simple y obvia.
- **Migración futura es trivial**: copiar archivos + UPDATE de paths. No hay coupling con DB schema (`logo_url` guarda path relativo, no URL completa).
- **Helper único `getProductImageUrl()`** sirve para todos los assets del bucket. Menos código, menos lugares de mantener.

### Cómo replicar

Cuando se necesite agregar un nuevo tipo de asset (banners, ícones de pago, badges de envío, fotos del local, etc.) y haya bucket Supabase ya configurado:

1. **Default**: reusar bucket existente con prefijo de carpeta (`_banners/`, `_payment-icons/`, `_store-photos/`).
2. **Excepción**: crear bucket dedicado solo si:
   - El asset tiene **RLS diferente** (público vs autenticado, ej: prescripciones de clientes).
   - El asset tiene **billing crítico separado** (ej: video assets pesados que justifican lifecycle policy distinto).
   - El asset requiere **CDN/cache diferente** (raro en Supabase Storage default).
3. **Convención de prefijo**: usar `_` al inicio para distinguir de carpetas de productos reales (que típicamente usan slug, ej `vulk-day-light/`).

### Anti-patrón a evitar

- Crear un bucket nuevo por cada tipo de asset por "limpieza" arquitectural. El founder paga el costo operacional cada vez sin beneficio real.
- Mezclar assets sin prefijo (ej: subir logos a la raíz del bucket `products`). Se vuelve imposible distinguir productos de assets internos al hacer listing.
- Inventar helper paralelo cuando el existente funciona (`getBrandAssetUrl()` vs `getProductImageUrl()` para el mismo bucket).

### Próxima vez aplicar a

- Banners para hero rotators o promos.
- Íconos de medios de pago (Visa, Master, MP, etc.) si decidimos custom en vez de lucide.
- Badges de envío / certificaciones para mostrar en footer.
- Fotos del local físico para `/sobre-nosotros`.

---

## 2026-05-28 — Cuando el founder pregunta "cómo necesitás que sea X?" — responder con spec en tabla + alternativas + dónde se usa + plan de "arrancá por 1"

**Categoría**: Comunicación / Onboarding de assets / Specs de input
**Confianza**: 🟡 Media (1 caso, pendiente confirmar resultado cuando suba logos de Vulk)

### Qué pasó

Founder estaba consiguiendo logos de las 5 marcas con las que trabaja la óptica (Vulk, Rusty, Mormaii, Reef, Paula Cahen D'Anvers). Preguntó: "Como necesitas que sean los logos? Tamanos, Con fondo? Sin?".

Respondí con una estructura que cubrió:
1. **Tabla concreta** de specs por atributo (formato, fondo, versiones, tamaño, tipo de logo, padding, SVG texto): cada fila con **"Lo ideal" + "Alternativa aceptable"** para que el founder no quede bloqueado si no consigue el ideal.
2. **Dónde se usa cada versión** (brand section home dark, brand pages claras, trust marquee dark, product cards mini): justifica por qué pido 2 versiones.
3. **"Si solo conseguís 1 versión"**: fallback honesto (dark + filter CSS invert) con tradeoff explícito.
4. **Convención de naming + paths Supabase Storage**: `brand-assets/{slug}-logo-dark.svg`. Founder sabe dónde subirlo sin tener que preguntarme después.
5. **"Arrancá por 1 caso"** (Vulk primero — el único con producto cargado): permite ver el resultado antes de invertir tiempo en los otros 4.

### Por qué funcionó

- **Tabla > texto narrativo** cuando son specs técnicos: el founder no-técnico puede scanear y decidir rápido. Texto narrativo requiere leer todo para encontrar el atributo que importa.
- **"Lo ideal + alternativa aceptable" por fila**: evita que el founder se bloquee buscando el formato perfecto. Le da margen de maniobra y conoce el costo de cada alternativa.
- **"Arrancá por 1"** reduce riesgo de inversión sin feedback. Es el equivalente al "plan por rounds verificables" pero para inputs del founder en lugar de mi código.
- **Paths exactos de storage** anticipan la próxima pregunta ("¿dónde lo subo?"). Reducen idas y vueltas.

### Cómo replicar

Para CUALQUIER pregunta del founder del tipo "cómo necesitás que sea X?" / "qué formato te paso?" / "cuántos / cuánto / dónde?":

1. **Tabla de specs por atributo** con "Lo ideal" + "Alternativa aceptable" en cada fila.
2. **Sección "Dónde se va a usar"**: justifica las decisiones técnicas con el caso de uso real.
3. **Fallback honesto** si solo consigue uno de los ideales — con tradeoff explícito.
4. **Convención de naming + paths exactos** si va a subir a Supabase Storage o algún bucket.
5. **"Arrancá por 1 caso"** para validar antes de invertir tiempo en el resto.

### Anti-patrón a evitar

- Responder solo "subilos en SVG con fondo transparente" → demasiado breve, el founder vuelve con más preguntas (tamaño, padding, naming).
- Sobre-explicar: 6 párrafos sobre por qué SVG es mejor que PNG. Founder no-técnico le importa el outcome, no la teoría.
- Pedir todos los assets juntos sin verificación intermedia. Si me equivoco con la spec, el founder pierde tiempo en 5 marcas en lugar de 1.
- Inventar paths/convenciones que no son las usadas en el resto del proyecto (chequear cómo se usa el bucket `products` y mantener consistencia).

### Próxima vez aplicar a

- Fotos de productos nuevos (cómo recortar, qué tamaño, qué padding, dónde subir).
- Recetas para validar el lector de receta IA (formato JPG/PDF, fotos vs scans, anonimización).
- Selfies de prueba para el recomendador de monturas (qué condiciones, qué casos edge).
- CSVs / bulk uploads (template prearmado, encoding, separador, columnas requeridas).
- Datos de contacto para WhatsApp / email (formato, validaciones, ejemplos).

---

## 2026-05-28 — Los agentes pueden ser overly conservative; la decisión del founder pesa más que la recomendación del agente cuando hay tradeoff de UX/coherencia

**Categoría**: Sistema de agentes / Toma de decisión / Calibración
**Confianza**: 🟢 Alta — caso concreto en el que el founder corrigió correctamente una recomendación del optical-expert.

### Qué pasó

`optical-expert` recomendó incluir matrícula de María Carlota Carballo en el disclaimer del recomendador de monturas, citando Ley 17.132 y "protección legal". Implementé tal cual con placeholder hasta que el founder me pasara el número. Founder cuestionó: "para qué necesitás saber la matrícula? no tiene sentido".

Pensándolo de nuevo con el contexto del proyecto entero:
- La matrícula NO agrega protección legal real en este contexto. La protección viene del lenguaje "orientativo / no reemplaza consulta profesional", no del número.
- Mostrarla al lado del output de IA da impresión de que la matriculada AVALA esa recomendación específica — cuando NO la revisa en tiempo real.
- En el resto del sitio no mostramos matrícula. Solo acá sería inconsistente.

Decisión: sacarla. El disclaimer queda genérico, protege igual, no introduce contrasentido.

### Por qué pasó

El agente optical-expert tiene contexto técnico-óptico y legal pero NO tiene visibilidad de:
- **Coherencia visual del sitio**: ¿esta protección extra rompe el tono del resto?
- **UX completa**: ¿el usuario ve la matrícula como "garantía" o como "burocracia que da desconfianza"?
- **Modelo mental del cliente**: ¿asocia la matrícula con esta herramienta específica de IA?

El founder SÍ ve el sitio entero, el modelo mental, y la coherencia. Por eso su veto fue correcto.

Adicionalmente: los agentes especialistas tienden a optimizar para SU dominio (legal-regulatorio, en este caso). En tradeoffs cross-dominio (UX vs legal, coherencia vs cobertura defensiva), el founder es el árbitro natural — yo no debería implementar la recomendación del agente sin pensar críticamente si tiene sentido en el sitio entero.

### Cómo replicar

- Cuando un agente recomienda algo que IMPLICA acción del founder (pedirle matrícula, pedirle datos extras, agregar texto que cambia el tono), **antes de implementar, preguntarme**: ¿esta acción tiene sentido en el contexto del sitio entero?
- Si la respuesta no es obviamente sí, **flagear al founder antes de pedir/implementar**: "el agente recomienda X, mi lectura es que en el contexto del sitio Y podría ser overkill. ¿procedo o lo simplifico?"
- Especialmente cuidadoso con agentes que tienden al conservadurismo defensivo (optical-expert para legal, ai-features-engineer para safety, argentine-ecom para AFIP).

### Anti-patrón a evitar

- Tratar la recomendación del agente como instrucción a ejecutar sin filtro. Los agentes son consultores, no commanders.
- Pedirle al founder data extra (matrícula, número de habilitación, datos personales) sin haber validado que la necesidad es real en el contexto.
- Optimizar protección legal "por si acaso" cuando el costo es UX o coherencia que sí impactan conversión.

### Próxima vez aplicar a

- Cualquier recomendación de `optical-expert` que implique agregar texto regulatorio extenso o pedir datos del negocio que el founder tendría que confirmar manualmente.
- Cualquier recomendación de `argentine-ecom` que sugiera agregar checkboxes legales, micro-copy AFIP, etc. — validar primero si SÍ es obligatorio o si es defensivo over-the-top.
- Cualquier recomendación de `ai-features-engineer` que sugiera rate limiting, auth, captchas como "mejor práctica" — validar contra el contexto real de uso esperado.

---

## 2026-05-28 — Patrón "2 agentes especialistas en paralelo" para feature compleja desbloqueó el approach en 1 sprint

**Categoría**: Workflow / Sistema de agentes
**Confianza**: 🟢 Alta (1 caso de éxito, pero el resultado fue notablemente mejor que arrancar yo solo)

### Qué pasó

Founder pidió construir "Recomendador de monturas por rostro" (IA Vision + lógica óptica + UX). Antes de codear, invoqué **2 agentes especialistas en paralelo en el mismo mensaje**:

1. `optical-expert`: face shapes a reconocer (7 estándares argentinas), mapping óptico face shape → frame shape, slugs canónicos para `attributes.frame_shape`, disclaimer regulatorio obligatorio (Ley 17.132), qué NO hacer (género/edad, recomendar cristal), tono de los mensajes al cliente.
2. `ai-features-engineer`: modelo a usar (claude-haiku-4-5 con justificación de costo y task fit), API Route vs Server Action, schema del response con confidence numérico vs string, safeguards anti prompt-injection en el system prompt, privacy en Vercel (no /tmp, no console.log del body), rate limiting (Upstash recomendado pero okay sin para iter 1), UX flow técnico.

Ambos respondieron en ~40-60s. Sin sobrelap (cada uno aportó conocimiento de su dominio). El resultado fue que pude implementar el feature completo (lib helpers + API route + UI + sitemap) en 1 sprint sin re-trabajo por decisiones técnicas malas.

### Por qué funcionó

- **Decisiones óptico-regulatorias + decisiones técnicas son ortogonales**: el mapping face shape → frame shape NO depende de qué modelo usar. El disclaimer regulatorio NO depende de la arquitectura del endpoint. Por eso podían correr en paralelo sin coordinación.
- **Cada agente tiene contexto del proyecto** (CLAUDE.md, BUSINESS_POLICIES.md, etc.) — no tuve que pasarle background, solo el delta del feature.
- **Prompts a los agentes fueron muy específicos** sobre qué entregable necesito (no "escribí código", sino "decisiones técnicas/ópticas como bullet points"). Esto evitó que respondieran con código que después yo iba a tirar.
- **Respeté la regla CLAUDE.md "no invocar 3+ agentes en un solo turno sin coordinación clara"**: 2 está bien, son ortogonales, sin coordinación entre ellos necesaria.

### Cómo replicar

Para CUALQUIER feature que toque 2+ dominios independientes, invocar 2 agentes en paralelo en el mismo mensaje con prompts específicos:

**Buenos candidatos para este patrón**:
- Feature de checkout: `argentine-ecom` (Mercado Pago, AFIP) + `optical-expert` (requisitos para vender lentes de contacto).
- Feature de filtros de catálogo: `seo-strategist` (URLs + meta) + `optical-expert` (qué atributos son técnicamente relevantes).
- Lector de receta IA: `optical-expert` (datos de receta argentinas, validaciones) + `ai-features-engineer` (Vision + structured output).
- Asistente conversacional con RAG: `optical-expert` (qué SÍ/NO puede recomendar legalmente) + `ai-features-engineer` (RAG arquitectura).

**Malos candidatos** (mejor secuencial o agente único):
- Cuando el output del agente A condiciona el prompt del agente B. Si el optical-expert dice "no podemos usar Vision por X razón regulatoria", el prompt al ai-features-engineer cambia → mejor secuencial.

### Anti-patrón a evitar

- Invocar 3+ agentes en paralelo sin tener claro cómo se compone el resultado (mejor 2, y si hace falta un tercero, esperar al output de los primeros 2).
- Pedirles que "diseñen el feature" → muy abstracto. Mejor: pedirles entregables específicos como inputs accionables para que YO construya.
- Olvidar pasarles el contexto del proyecto en el prompt cuando es necesario (aunque los agentes tienen acceso al CLAUDE.md, a veces necesitan detalles del feature concreto que no están documentados).

### Próxima vez aplicar a

- Lector de receta IA (cuando el founder lo priorice): `optical-expert` (datos OD/OI/CIL/eje/DNP, formato receta argentina, regulación) + `ai-features-engineer` (Vision para PDF/foto, structured extraction, validaciones).
- Checkout completo: `argentine-ecom` + `optical-expert`.
- FAQs con FAQPage schema: `seo-strategist` (schema + rich snippets) + `content-writer-medical` (redacción + E-E-A-T).

---

## 2026-05-28 — Letter-by-letter reveal: agrupar letras por palabra con `whitespace:nowrap` evita que el browser rompa palabras a mitad

**Categoría**: framer-motion / animations / typography / CSS layout
**Confianza**: 🟢 Alta (bug detectado en producción por founder vía screenshot, fix verificado en build)

### Qué pasó

LetterReveal v1 (commit `9392c19`): cada letra del H1 era `motion.span style="display:inline-block; whiteSpace:pre"`. En desktop con ancho viewport ~1200px y text-balance, el browser rompía las palabras a mitad:

> "Anteojos origina **|** les con asesoram **|** iento óptico real"

Founder reportó "no me gusta como queda la J de anteojos" + screenshot. Ese "J" era realmente la J de "originaJes" cortada como "origina les".

### Causa raíz

**El browser puede hacer line break entre 2 inline-block consecutivos SIN necesidad de whitespace entre ellos**. Lógica del rendering: cada inline-block es un "atomic inline item" en el line flow. Cuando el ancho de línea se agota, el browser inserta el break en el último item que pudo, sin importar si hay un espacio o no.

`whitespace:pre` mantiene el espacio renderizado pero NO previene el wrap entre los items inline-block. Resultado: las letras se rompen a mitad de palabra cuando el balance las distribuye.

### Fix: agrupar letras por palabra en wrapper inline-block + nowrap

```tsx
const words = text.split(' ');
let letterCounter = 0;
return (
  <Tag>
    {words.map((word, wi) => (
      <Fragment key={wi}>
        {/* Wrapper de palabra: atomic, NO se rompe internamente */}
        <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {Array.from(word).map((char) => {
            const idx = letterCounter++;
            return (
              <motion.span
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: baseDelay + idx * 0.025, ... }}
                style={{ display: 'inline-block' }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
        {/* Espacio entre palabras: texto normal — SÍ permite wrap */}
        {wi < words.length - 1 && ' '}
      </Fragment>
    ))}
  </Tag>
);
```

**Claves del fix**:
1. **Palabra wrapper inline-block** + `whitespace:nowrap` → la palabra es un atomic item que el browser nunca rompe.
2. **Espacios entre palabras como texto normal** (no inline-block) → permite que el browser wrap en estos puntos como en cualquier texto.
3. **Delay individual por letra** (no `staggerChildren` del container) → cascada continúa atravesando palabras, no se resetea con cada wrapper.

### Cómo replicar

Cualquier vez que animes texto letra por letra (LetterReveal, scramble effect, char-by-char fade-in), agrupar las letras por palabra. Patrón:

```
container > word-wrapper(inline-block, nowrap) > letter(inline-block)
                                              ↑
                                  span entre word-wrappers como texto normal
```

### Anti-patrón a evitar

```tsx
// ❌ Mal — wrap a mitad de palabra
{Array.from(text).map(char => (
  <motion.span style={{ display: 'inline-block', whiteSpace: 'pre' }}>
    {char}
  </motion.span>
))}

// ✅ Bien — wrap solo entre palabras
{words.map(word => (
  <>
    <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
      {[...word].map(char => <motion.span style={{ display: 'inline-block' }}>{char}</motion.span>)}
    </span>
    {' '}
  </>
))}
```

### Próxima vez aplicar a

- Cualquier animación de texto que use `inline-block` por letra (scramble, fade-in cascade, jitter, hover-per-letter).
- Si en algún futuro escribimos un `TextScramble` o `WordShuffle` component, NO repetir el bug.

---

## 2026-05-28 — `useMotionTemplate` para que valores reactivos (gradient, color, transform string) actualicen en tiempo real

**Categoría**: framer-motion / animations / React
**Confianza**: 🟢 Alta (detectado como bug en sesión, fix aplicado, animación funciona)

### Qué pasó

Al construir el `TiltSpotlightCard` necesitaba que el background `radial-gradient(...)` siguiera al mouse en tiempo real. Primera implementación:

```tsx
const spotlightX = useTransform(mouseX, (v) => `${v * 100}%`);
const spotlightY = useTransform(mouseY, (v) => `${v * 100}%`);

<motion.div style={{
  background: `radial-gradient(220px circle at ${spotlightX.get()} ${spotlightY.get()}, ...)`,
}} />
```

**No funcionaba**: el gradient se quedaba fijo en el primer valor. Framer-motion no podía suscribirse a un string literal — `.get()` se evaluaba una vez en cada render, no en cada frame de animación.

### Causa raíz

`motionValue.get()` retorna el valor actual como **string normal**, perdiendo la reactividad. Style props con motion values funcionan **solo si pasás el motion value directamente** (`{ x: motionValueX }`) — no si construís un string con `.get()` adentro.

Para CSS properties complejas que requieren string templating (gradient, transform combinado, filter), framer-motion provee `useMotionTemplate`:

```tsx
const spotlightBg = useMotionTemplate`radial-gradient(220px circle at ${spotlightX} ${spotlightY}, ...)`;

<motion.div style={{ background: spotlightBg }} />
```

`useMotionTemplate` es un **tagged template literal** que retorna un motion value de string. Suscribe automáticamente a los motion values interpolados (`spotlightX`, `spotlightY`) y reemite el string completo cuando cambia cualquiera.

### Cómo replicar

- **Una sola propiedad CSS, valor numérico**: pasar motionValue directo. `style={{ x: motionX, opacity: motionOpacity }}`. Lo más común.
- **Una propiedad CSS con string templating** (gradient, clip-path, filter, transform combinado): usar `useMotionTemplate`. Ejemplo:
  ```tsx
  const clip = useMotionTemplate`inset(${top}% ${right}% ${bottom}% ${left}%)`;
  ```
- **NUNCA usar `.get()` dentro de un template string en style** — eso pierde la suscripción.

### Anti-patrón a evitar

```tsx
// ❌ Mal — string evaluado una sola vez
style={{ background: `linear-gradient(${angle.get()}deg, red, blue)` }}

// ✅ Bien — template reactivo
const gradient = useMotionTemplate`linear-gradient(${angle}deg, red, blue)`;
style={{ background: gradient }}
```

### Próxima vez aplicar a

- Cualquier feature que necesite CSS dinámico complejo controlado por mouse/scroll (spotlight, mask reveal animado, clip-path responsive a cursor, color shift en hover con stops específicos).
- Si en Round 4+ aparece bug similar "la animación se queda fija aunque el valor cambia", primer chequeo: ¿hay un `.get()` dentro del style?

---

## 2026-05-28 — Usar `createStaticClient()` en lugar de `createClient()` para data pública en home mantiene ISR

**Categoría**: Next.js / Supabase / SEO performance
**Confianza**: 🟢 Alta (verificado en build output: home pasa de `ƒ /` dynamic a `○ /` static + ISR 5min)

### Qué pasó

Al implementar `fetchHomeShowcaseProduct()` para mostrar el producto destacado en el hero, usé `createClient()` (server client con auth cookies) por inercia — es el patrón default en `lib/catalog/queries.ts` para queries en páginas dinámicas. **Resultado**: la home pasó de `○ /` (static + ISR 5min) a `ƒ /` (dynamic SSR en cada request).

### Causa raíz

`createClient()` lee `cookies()` en `lib/supabase/server.ts` para resolver auth del usuario. Next.js detecta el acceso a cookies durante el render del Server Component → marca la página como `dynamic`, deshabilita ISR. Pérdida en performance (cada request hace SSR + 4 queries Supabase) y SEO (CDN no puede cachear el HTML).

### Fix

Usar `createStaticClient()` cuando la query es de **info pública** que no depende del usuario logueado:
- `fetchAllActiveBrands` — ya lo usaba (público)
- `fetchHomeShowcaseProduct` — cambiado a este patrón

```ts
// ❌ Mal — rompe ISR
const supabase = await createClient();

// ✅ Bien — mantiene ISR
const supabase = createStaticClient();
```

Resultado: home volvió a `○ /` static + ISR 5min en el build, sin cambios funcionales.

### Cómo replicar

- **Default**: si la query es info pública (catálogo, marcas, productos activos), `createStaticClient()`.
- **Excepción**: si la query depende del usuario (su carrito, sus pedidos, su address), `createClient()` con cookies — y aceptar que la página será dynamic.
- **Verificar en build output**: si una página debería ser ISR pero aparece como `ƒ` (dynamic), buscar `createClient()` en sus queries y reemplazar por `createStaticClient()` donde sea seguro.

### Anti-patrón a evitar

- Copiar el patrón `await createClient()` de otra query sin pensar si la nueva query necesita auth.
- Mover queries de público a auth-aware sin validar el impacto en ISR — el costo SEO de perder static rendering es invisible pero real.

### Próxima vez aplicar a

- Cualquier nueva función en `lib/catalog/queries.ts` que se llame desde Server Components de páginas públicas (home, category index, brand page, product page).
- Antes de pushear, mirar el build output y confirmar que las páginas que deberían ser ISR siguen apareciendo como `○`.

---

## 2026-05-28 — Glosario de efectos modernos + plan por "rounds verificables" desbloqueó dirección de modernización

**Categoría**: Comunicación founder ↔ asistente / dirección de producto
**Confianza**: 🟢 Alta (founder eligió las 4 opciones propuestas + agradeció el vocabulario explícitamente)

### Qué pasó

Founder pidió "hacerlo más moderno" — pregunta abierta que históricamente generaba propuestas vagas. En vez de tirar una lista de 10 ideas o arrancar a programar a ciegas, hice 2 cosas:

1. **Glosario rápido de efectos modernos por categoría** (cursor follower, parallax, sticky scroll, tilt 3D, spotlight, bento grid, glass morphism, marquee, view transitions, shimmer, etc.) con nombre técnico + descripción corta + ejemplo de dónde se usa.
2. **AskUserQuestion con 4 ejes concretos** (tipografía editorial / showcase hero / accent + dark / micro-interacciones) cada uno con preview ASCII mostrando ACTUAL vs PROPUESTO + costo + impacto.

Founder respondió eligiendo las 4 opciones + comentario: **"Hay muchas cosas que veo en paginas modernas, el tema es que no se como ponerles nombres a ese tipo de interacciones/ efectos..."**.

### Por qué funcionó

- **El glosario destrabó comunicación futura**: ahora el founder puede pedir "agregá un spotlight a los cards" o "quiero parallax en el hero" sin tener que describir el efecto cada vez. Es vocabulary tooling, no docs decorativos.
- **AskUserQuestion con previews ASCII** convirtió un brief abstracto en 4 opciones concretas y comparables. El founder no técnico evaluó las 4 mirando previews, no leyendo párrafos.
- **Plan por rounds verificables** (4 etapas, cada una autocontenida, build/typecheck verde antes de pushear) le da control granular al founder: puede aprobar/rechazar/iterar cada round sin comprometerse a las siguientes.

### Cómo replicar

- **Cuando founder pide algo abstracto** ("más moderno", "que se vea premium", "ponele onda"), antes de proponer features: confirmar si tiene vocabulario. Si no, preguntar con previews ASCII de opciones concretas en vez de descripciones textuales.
- **Crear glosario one-shot** cuando hay un dominio nuevo (efectos web, marketing, óptica). El glosario es overhead de 1 mensaje que paga dividendos en todas las conversaciones siguientes.
- **Romper trabajo grande en rounds verificables** cuando hay alta incertidumbre estética. Cada round = 1 commit, 1 verificación visual, build/typecheck verde. Si el round 1 falla, no se contamina el round 2.

### Anti-patrón a evitar

- Tirar 10 ideas en una lista sin priorizar — el founder no puede elegir, queda paralizado.
- Empezar a codear "lo más moderno" sin checkpoint de dirección — terminás con 4 cambios paralelos y el founder no sabe cuál le gustó.
- Asumir que founder sabe el vocabulario técnico — el comentario "no sé cómo llamarlos" lo confirmó.

### Próxima vez aplicar a

- Cuando founder pida ideas para landing pages de marcas nuevas (Vulk, Rusty, etc.) — usar mismo patrón: glosario de "layouts editoriales" + opciones con preview.
- Cuando se discutan promociones / banners / hero rotators — glosario de "patterns de promo" + opciones.

---

## 2026-05-28 — `Image fill` ignora `padding` del wrapper — usar double wrapper para que el padding absorba el zoom

**Categoría**: Next.js / next/image / CSS positioning
**Confianza**: 🟢 Alta — verificado en producción 2026-05-28. El fix iter 3 (`p-10 sm:p-14 md:p-20` + `scale-[1.03]` + double wrapper) resolvió definitivamente. Founder confirmó visualmente. El patrón es replicable mientras se calibre el padding contra fotos reales del fabricante.

### Qué pasó

Tenía un `<Image fill>` con `object-contain` dentro de un wrapper con `aspect-square overflow-hidden p-8 md:p-12` y `className="group-hover:scale-[1.04]"`. **Esperaba** que el padding del wrapper diera "aire" para que el zoom hover no llegara a los bordes. **No funcionó** — la imagen se cortaba en el zoom.

### Causa raíz

`next/image` con `fill` aplica `position: absolute; inset: 0` al elemento img. Eso significa que el img ocupa **TODO el contenedor relative más cercano**, ignorando `padding` (porque `inset: 0` se calcula contra los bordes del contenedor, no contra el content box).

Resultado: el padding del wrapper era irrelevante para el posicionamiento de la imagen. La imagen ocupaba el 100% del wrapper (incluido el área del padding) y al hacer `scale 1.04` se extendía 4% más allá del wrapper → cortada por `overflow-hidden`.

### Fix: double wrapper

```tsx
{/* Outer: aspect-square + padding + overflow-hidden + el background visual */}
<div className="relative aspect-square w-full overflow-hidden rounded-lg p-8 md:p-12">
  {/* Inner: relative h-full w-full — es lo que `fill` respeta */}
  <div className="relative h-full w-full">
    <Image
      src={...}
      fill
      className="object-contain group-hover:scale-[1.04]"
    />
  </div>
</div>
```

Lo que cambia:
- El outer define el **área visual** (con padding y bordes).
- El inner es el **área de positioning** para `fill`. Su tamaño es `100% - padding del outer`.
- Al hacer scale en la imagen, el zoom se expande dentro del inner. El padding del outer absorbe el overshoot — la imagen NO toca los bordes del outer, así que `overflow-hidden` no la corta.

### Por qué funciona

- `fill` busca el ancestor `position: relative` más cercano para hacer `inset: 0`. El inner es ese ancestor (no el outer).
- El inner tiene `h-full w-full` que en CSS significa "100% del parent **content area**" — el parent es el outer, su content area excluye el padding.
- El zoom 1.04 sobre la imagen dentro del inner queda dentro del área de padding del outer, no llega al borde exterior.

### Cómo replicar

Cuando combines `next/image fill` con cualquier transform (scale, rotate, translate) en hover Y querés que el efecto no toque los bordes:

```tsx
<div className="aspect-X overflow-hidden p-Y">    {/* visual area + padding */}
  <div className="relative h-full w-full">         {/* positioning area for fill */}
    <Image fill className="object-contain ..." />
  </div>
</div>
```

### Cuándo NO necesitás esto

- Si no aplicás transform al image (sin scale/zoom hover): el padding del wrapper igual no funciona, pero no se nota porque no hay overshoot.
- Si usás `Image` con `width/height` explícito en lugar de `fill`: el padding del wrapper se respeta naturalmente porque el img es `position: static`.

### Notas

- También aplica si tenés `Image fill` con `padding` directo en su className. El padding del propio img sí funciona (porque modifica el `inset: 0` efectivo), pero combina mal con `object-contain` porque object-contain no respeta el padding del img.
- Mismo patrón aplica a `<video>` o cualquier elemento con `position: absolute; inset: 0`.
- **Calibrar padding contra las fotos reales, no contra el cálculo teórico**: en e-commerce las fotos del fabricante con frecuencia NO tienen padding propio en el JPG — el objeto toca los bordes del cuadrado. Aunque el double wrapper aísle el área de positioning, si la imagen llena el inner hasta el borde, cualquier scale crece "afuera" del inner. Calibración inicial p-12 (48px) parecía generosa pero no compensaba el cero-padding intrínseco de las fotos. Real-world: empezar con padding generoso (p-16/p-20 = 64-80px en desktop) Y scale chico (1.02-1.03), después afinar bajando si se ve excesivo.
- **Verificar visualmente con el founder antes de declarar "fix definitivo"**. El cálculo teórico ("8px overshoot, 48px padding → no se corta") asumía que la imagen NO tocaba los bordes del inner. Cuando la imagen sí los toca (por la naturaleza de los JPGs source), el cálculo falla. La verificación con screenshots reales del founder es el feedback loop crítico.

---

## 2026-05-28 — Sort criterio "específico-antes-que-compartido" cuando filtrás N items + items globales en una vista por contexto

**Categoría**: UI / sort algorithms / multi-variant rendering
**Confianza**: 🟢 Alta (implementado, founder confirmó bug visual reproducible, fix verificado)

### Qué funcionó

Patrón general: cuando en una UI mostrás items **filtrados por un contexto** (variante, talle, idioma, lo que sea) MEZCLADOS con items que son **compartidos a todos los contextos**, el sort default `(prioridad ASC, sort_order ASC)` puede intercalar los compartidos en el medio de los específicos si los `sort_order` no fueron pensados con esto en mente.

**Caso real**: producto con 2 variantes (Carey, Rosa) y 1 esquema técnico de medidas compartido (variant_id=NULL). Los `sort_order` originales:
- Carey: 0 (lateral), 1 (frontal)
- Medidas compartida: 2
- Rosa: 3 (lateral), 4 (frontal)

Sort `(is_primary, sort_order)` cuando seleccionás Rosa:
- 04 lateral rosa (primary=true, sort=3) → pos 1
- **03 medidas compartida (primary=false, sort=2) → pos 2** ← BUG: se cuela
- 05 frontal rosa (primary=false, sort=4) → pos 3

El usuario espera: lateral rosa → frontal rosa → medidas técnicas. Pero ve: lateral rosa → medidas → frontal rosa.

### Solución: agregar criterio "es específico del contexto seleccionado" antes del sort_order

```ts
sort((a, b) => {
  // 1. Primary primero (si aplica)
  if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;

  // 2. Específicos del contexto seleccionado antes que compartidos
  if (selectedContextId) {
    const aSpecific = a.context_id === selectedContextId;
    const bSpecific = b.context_id === selectedContextId;
    if (aSpecific !== bSpecific) return aSpecific ? -1 : 1;
  }

  // 3. Sort_order como tiebreaker
  return a.sort_order - b.sort_order;
});
```

Con esto, no importa qué `sort_order` tengan las compartidas: siempre van DESPUÉS de las específicas del contexto seleccionado.

### Por qué funciona

- **Independiente del sort_order**: no requiere reorganizar la data ni renumerar. Funciona aunque los `sort_order` se hayan asignado sin pensar en este caso.
- **Generalizable**: el criterio "específico-antes-que-compartido" es válido en cualquier UI multi-contexto. Aplica a:
  - Galerías de producto con imágenes por variante + imágenes del modelo.
  - Tabs de "para este país" + "global" en docs i18n.
  - Atributos por talle vs atributos del producto.
- **Defensive default**: si `selectedContextId` es `null`, el criterio se salta y se mantiene el sort básico — no rompe vistas que no tienen contexto seleccionado.

### Alternativa peor (no usar)

"Resolver" reasignando sort_order altos a las compartidas (ej 99). Funciona pero:
- Requiere mantener convención manual al cargar data nueva ("recordá poner 99 a las compartidas").
- Rompe si alguna variante futura tiene >99 imágenes (impróbable pero teórico).
- No escala a múltiples niveles (qué pasa si querés "específicos del contexto > shared a la categoría > shared al producto > shared global").

Mejor el criterio en el sort: la convención vive en código, no en data.

### Cuándo aplicarlo

- Cualquier filter+sort UI donde hay items con un FK opcional al "contexto" y los items con FK NULL son globales/compartidos.
- Schemas tipo: `attribute_id NULL = aplica a todo el padre` (common pattern en e-commerce).

### Notas

- Si el contexto puede tener jerarquía multinivel (variant_id NULL puede ser "compartida a esta talla" pero NO "compartida globalmente"), agregar más criterios al sort por nivel de specificity.
- Si la lista es muy grande (>1000 items), considerar precomputar la specificity como una columna virtual en la query (SQL `CASE WHEN ...`).

---

## 2026-05-28 — Variant selection con Context: gallery filtering + click-to-select sin perder server components

**Categoría**: React patterns / Client+Server hybrid / E-commerce UX
**Confianza**: 🟢 Alta (implementado, typecheck verde, comportamiento natural en variants con stock)

### Qué funcionó

Problema: cuando un producto tiene múltiples variantes con fotos propias (ej Vulk Day Light: variante carey con 2 fotos + variante rosa con 2 fotos + 1 esquema técnico compartido), la gallery default mostraba **TODAS las imágenes mezcladas** → 5 thumbs confusas. Y la VariantList tenía variantes sin mecanismo de "selección" más allá del CTA de compra.

**Solución idiomática React 19**:

1. **Context Provider client-side** en `lib/product/variant-selection.tsx`:
```tsx
'use client';
const VariantSelectionContext = createContext<Ctx>({...});
export function VariantSelectionProvider({ children, defaultVariantId }) {
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariantId);
  // useMemo + useCallback para stable references
  return <VariantSelectionContext.Provider value={...}>{children}</...>;
}
export function useVariantSelection() {
  return useContext(VariantSelectionContext);
}
```

2. **Server component wraps con Provider** en `ProductDetailPage`:
```tsx
const defaultVariantId = inStockVariants[0]?.id ?? activeVariants[0]?.id ?? null;
return (
  <VariantSelectionProvider defaultVariantId={defaultVariantId}>
    <main>...</main>
  </VariantSelectionProvider>
);
```

3. **Client consumers** (`ProductGallery`, `VariantList`) usan el hook:
```tsx
const { selectedVariantId, selectVariant } = useVariantSelection();
const visibleImages = useMemo(() =>
  images.filter(img => img.variant_id === selectedVariantId || img.variant_id === null),
[images, selectedVariantId]);
```

4. **VariantList: row clickeable + radio visual**:
- Cada `<li>` con `role="button" tabIndex={0}` + `onClick={() => selectVariant(v.id)}`.
- Radio circle visual a la izquierda (border + dot interno cuando seleccionada).
- El botón CTA interno usa `onClick={(e) => e.stopPropagation()}` para que clickear el botón NO seleccione la variante.
- Keyboard accessibility: Enter/Space trigger select.

### Por qué funciona

- **Server component genera defaults** desde DB (primera variante en stock) sin necesidad de fetch client-side. SSR-friendly, sin flash.
- **Provider boundary chico** envuelve solo `<main>` del product-page, no toda la app. Performance OK.
- **Filter en `useMemo`** con dependency `[images, selectedVariantId]` — solo recompute cuando cambia la selección.
- **Reset de `activeIdx` cuando cambia variante** evita apuntar a una imagen del set anterior:
```tsx
useEffect(() => { setActiveIdx(0); }, [selectedVariantId]);
```

### Schema design choice: imágenes compartidas vs por variante

El schema `product_images` permite `variant_id: NULL` = imagen "del modelo" (compartida entre variantes). Útil para:
- Esquemas técnicos de medidas
- Comparación lado a lado
- Hero images neutrales

Reglas que aplicamos en data:
- Foto de **una variante específica** (ej "Carey Brillo de frente") → `variant_id = variant.id`.
- Foto **compartida del modelo** (ej "esquema técnico de medidas") → `variant_id = NULL`.

Filter logic en gallery: muestra `variant_id === selectedVariantId OR variant_id === null`. Ambas categorías son visibles cuando la variante está seleccionada.

### Cómo replicar

Para cualquier producto con variantes que tengan datos visuales propios (imágenes, swatches, descripciones):

1. Crear Context client-side con state + setter.
2. Provider wraps el área del producto en server component, default desde server data.
3. Componentes que necesitan reaccionar consumen via hook.
4. Filtros en consumers via `useMemo`.
5. Reset state local cuando cambia la selección.

Aplica a:
- Variantes de color con fotos propias (este caso).
- Talles con tabla de medidas distinta.
- "Modos" del producto (ej receta vs sol del mismo armazón).

### Notas

- React 19 Context Provider sigue siendo el patrón estándar; no usamos `use()` para esto porque el state es mutable client-side.
- Si en el futuro queremos sincronizar la variante con la URL (deep linking ej `?variant=rosa`), agregar `useSearchParams` + `router.replace` cuando cambia la selección. Trivial extensión del Provider.
- Considerar `useTransition` si el cambio de variante dispara fetches (no es el caso ahora, todo client-side).

---

## 2026-05-28 — CSS Grid con row-span + col-start asimétrico = stack vertical en mobile + layout balanceado en desktop sin duplicar markup

**Categoría**: CSS / Layout responsivo
**Confianza**: 🟢 Alta (implementado, typecheck verde, comportamiento verificado en código)

### Qué funcionó

Problema clásico de e-commerce: en la página de detalle de producto, la columna izquierda (galería de imágenes) es más corta que la columna derecha (que tiene H1, atributos, medidas, variantes, etc) → en desktop queda un **espacio blanco grande** debajo de las imágenes.

Soluciones típicas:
1. Mover algo de la columna derecha a la izquierda → en mobile (1 col) ese elemento queda en el medio del flow, donde no debería estar.
2. Duplicar el componente con `hidden md:block` + `md:hidden` → markup duplicado, riesgo de drift.
3. Conformarse con el espacio blanco.

**Solución CSS Grid pura, sin duplicar markup**:

```tsx
<div className="grid gap-8 md:grid-cols-2 md:grid-rows-[auto_1fr] md:gap-y-6">
  {/* Row 1 Col 1: Gallery (default position) */}
  <ProductGallery />

  {/* Right column ocupa ambas rows en col 2 */}
  <div className="md:col-start-2 md:row-span-2 md:row-start-1">
    {/* H1, atributos, medidas, etc */}
  </div>

  {/* ProductIncludes en col 1 row 2 (debajo del gallery en desktop) */}
  <div className="md:col-start-1 md:row-start-2">
    <ProductIncludes />
  </div>
</div>
```

**Comportamiento**:
- **Desktop** (md+): Gallery arriba-izq, Right column ocupa toda la columna derecha (row-span 2), ProductIncludes abajo-izq llenando el espacio.
- **Mobile** (default, sin md): no aplica grid-cols-2, los items se apilan en orden natural de DOM: Gallery → Right column → ProductIncludes.

### Por qué funciona

- **CSS Grid es 2D**: a diferencia de flexbox, podés controlar tanto rows como cols explícitamente.
- **`md:row-span-2`** dice "este elemento ocupa 2 rows" → cuando hay un elemento en `md:row-start-2` en la otra columna, no chocan, porque cada uno está en su columna.
- **El orden del DOM determina el orden mobile**: el ProductIncludes está físicamente después del right column en el JSX → en mobile va al final naturalmente.
- **`grid-rows-[auto_1fr]`** asegura que la primera row se ajusta al contenido (gallery) y la segunda toma el espacio restante (where it makes sense).

### Cómo replicar

Patrón general "columna corta + columna larga + elemento que llena el espacio":

```
grid-cols-2 grid-rows-[auto_1fr] (md+)

[col 1 row 1]  [col 2 row 1]
[col 1 row 2]  [col 2 row 2]
                              ← lo que está en col-start-2 + row-span-2
                                ocupa ambas rows
```

Aplicable a:
- Página de producto (gallery + sidebar + extras debajo del gallery).
- Páginas de blog (sidebar + content + bloque "newsletter" debajo del sidebar).
- Dashboards (chart + KPIs + descripción debajo del chart).

### Cuándo NO usar este patrón

- Si la columna corta es MÁS larga que la columna larga: rompe el balance, mejor flex.
- Si necesitás cambiar el orden visual entre mobile y desktop drásticamente: combinar con `order-` utility.
- En IE11 (irrelevante hoy, pero por si acaso): grid-template-rows con `1fr` tiene gotchas.

### Notas

- Tailwind 3.4 soporta `grid-rows-[auto_1fr]` con sintaxis arbitraria.
- Si el contenido del row-spanned column es muy largo, puede empujar la altura total — el espacio blanco no desaparece 100%, solo se compacta. Para el caso típico (gallery + 5-7 secciones a la derecha + 1 sección extra a la izquierda), funciona bien.
- En mobile, si querés controlar el orden distinto al DOM, usar `order-` en cada item.

---

## 2026-05-28 — Schema extensible via JSONB attributes + validación cross-agent: callouts sin migración + sin invenciones

**Categoría**: Schema design / Workflow agentes / UX
**Confianza**: 🟢 Alta (implementado end-to-end, typecheck verde, 3 callouts Vulk validados por optical-expert ya en código)

### Qué funcionó

Founder pidió "bloques visuales tipo Sabías que / Recomendación" en página de producto (para profundidad + diferenciación + E-E-A-T). 3 sub-problemas convergentes que resolvimos con un mismo patrón:

1. **Cómo agregar contenido estructurado nuevo SIN migrar DB cada vez**.
2. **Cómo evitar que el copywriter (content-writer-medical) invente data técnica** (ej: "las lentes polarizadas funcionan así…").
3. **Cómo dar UI consistente para algo que va a crecer** (4 tipos de callout hoy, mañana quizás más).

**Solución triple-capa**:

### Capa 1 — Schema JSONB en `attributes`, sin migración

En vez de agregar columna `callouts` a la tabla `products` (migración + sincronización local↔cloud), uso `products.attributes` JSONB existente con sub-key `callouts`:

```json
{
  "frame_material": "g-flex",
  "callouts": [
    { "type": "info", "title": "Sabías que…", "body": "..." },
    { "type": "recommendation", "title": "Recomendación", "body": "..." }
  ]
}
```

**Pros**:
- Cero migración. Funciona en cloud sin tocar schema.
- Productos sin callouts simplemente no tienen la key — el parser devuelve `[]` y el componente no renderiza.
- Si mañana querés agregar otra dimensión (ej "faq", "testimonials") es la misma técnica: nueva key dentro de `attributes`.

**Contras** (aceptados):
- No hay constraint a nivel DB del shape del JSONB. El **parser defensivo** en TS valida en runtime (type narrowing por field, filtra items malformados).
- Querying por "productos con callouts del tipo X" requiere `attributes->'callouts' @> '[{"type":"X"}]'` JSONB ops — no hay index automático. Para volumen actual (decenas de productos), aceptable.

### Capa 2 — Validación cross-agent: content-writer propone, optical-expert valida

Cualquier callout sobre óptica/física/materiales DEBE ser técnicamente correcto (la regla "no inventar" de CLAUDE.md aplica fuerte acá: si decimos "las lentes polarizadas funcionan X" y X está mal, perdemos autoridad YMYL).

Flujo nuevo:
1. **`content-writer-medical`** (cuando escribe descripción de producto) propone 2-3 callouts JSONB candidatos.
2. **`optical-expert`** valida técnicamente cada callout (o lo reescribe si tiene errores).
3. Lo validado va al seed.

Operacionalizado en `.claude/agents/content-writer-medical.md` — instrucción literal de validar con optical-expert para callouts técnicos. **Sin esto, el agente inventa con confianza ("rejilla magnética", "filtro biofotónico", etc).**

### Capa 3 — UI pattern parametrizable con 4 variantes

`ProductCallouts` component con `CALLOUT_STYLE` map por tipo. Cada tipo tiene `{container, icon, iconWrap, title}` con clases Tailwind. Para agregar un 5to tipo (ej "story", "testimonial"), basta agregarlo al map + a la unión de types — sin tocar render logic.

Cada variante usa colores Tailwind directos (`blue-500`, `amber-500`, `emerald-500`, `red-500`) con saturación baja (`bg-X-50/60`) y dark mode (`dark:bg-X-950/30`) para no romper la estética minimalista del sitio.

### Por qué la combinación funciona

- **Schema flexible + parser defensivo** = puedo extender el modelo de contenido sin tocar DB. Productos viejos no se rompen, productos nuevos opt-in.
- **Validación cross-agent** = cada agente respeta su scope (writer escribe con tono, expert valida con rigor). Resultado: copy bueno + correcto.
- **UI parametrizable** = agregar tipos es trivial. UI cambia en 1 archivo.
- **Documentado en BUSINESS_POLICIES.md** = la próxima vez que alguien (yo en otra sesión, otro agente, el founder revisando) pregunte "¿cómo agregar callouts?", la respuesta está ahí.

### Cómo replicar este patrón para contenido futuro

Si mañana queremos agregar otra dimensión de contenido a productos (FAQ, testimonials de cliente, "compará con otro producto", "guía de talles"):

```
1. Definir sub-key en attributes.<nombre> con shape JSONB simple.
2. Crear parser defensivo TS con type narrowing por field.
3. Componente React que recibe attributes y renderiza si hay data,
   no-op si falta.
4. Documentar en BUSINESS_POLICIES.md (cuándo usar, schema, reglas).
5. Update agente que escribe ese contenido para que sepa el patrón
   y proponga automáticamente.
6. Si toca dominio técnico (óptica), workflow de validación con
   optical-expert antes de seedear.
```

### Notas

- Si en el futuro un campo del JSONB se vuelve "first-class" (querying frecuente, índices, constraints), promover a columna real con migración. Por ahora `attributes.callouts` es perfectly fine.
- El componente actual respeta `prefers-reduced-motion` via `RevealOnScroll` (que ya tiene esa lógica).
- Los 3 callouts Vulk Day Light que escribió optical-expert son verificables: la explicación del filtro polarizador es física básica (rejilla orientada en un eje bloquea ondas en el eje perpendicular).

---

## 2026-05-28 — Knowledge base canónica para que agentes "sepan" sin inventar — patrón cluster por marca + políticas operativas

**Categoría**: Sistema de agentes / Knowledge management
**Confianza**: 🟢 Alta (implementado, agentes referencian archivos, próxima invocación los va a usar)

### Qué funcionó

Founder pasó keywords de Ubersuggest + política universal del negocio (estuche+franela+garantía) y pidió que "queden de forma permanente para que los agentes siempre sepan". El problema clásico de sistemas de agentes: cuando la data viene en un turno y se necesita en otro, se pierde o se inventa.

**Solución implementada en 4 capas**:

1. **Archivos canónicos en root**:
   - `SEO_STRATEGY.md` (existente) extendido con sección "Keywords por marca/producto cargados" con sub-clusters por marca (ej "Cluster: VULK"). Cada cluster lista keywords primarias/secundarias/long-tails con vol/difficulty/intent.
   - `BUSINESS_POLICIES.md` (nuevo) con políticas universales operativas (qué viene en cada compra, envíos, devoluciones, etc).
2. **Plantilla en SEO_STRATEGY.md** para que la próxima marca cargada respete la misma estructura — autoreplicable.
3. **Agentes con sección "Fuentes de verdad que tenés que leer ANTES"** — instrucción literal de leer los archivos canónicos antes de auditar/escribir. Si la marca no tiene cluster, el agente DEBE pedir keyword research al founder en vez de inventar.
4. **CLAUDE.md tabla de archivos** referencia los 2 archivos.

### Por qué funciona

- **Source of truth única**: si un dato cambia (ej política de garantía), se cambia en 1 archivo y todos los agentes lo usan en su próxima invocación.
- **Agentes no inventan** porque su prompt los obliga a leer el archivo. Si el dato no está, no asumen — preguntan.
- **Escalable**: la plantilla de "Cluster: <MARCA>" permite agregar marcas nuevas sin tocar prompts ni código.
- **Separation of concerns**: SEO_STRATEGY.md = qué posicionar; BUSINESS_POLICIES.md = qué cumple el negocio. Cada uno tiene su scope.

### Cómo replicar

Para cualquier proyecto con agentes que necesitan data específica del dominio:

```
1. Crear archivos canónicos en root con secciones bien delimitadas:
   - <Domain>_STRATEGY.md (decisiones estratégicas)
   - <Domain>_POLICIES.md (reglas operativas)
2. Definir UNA plantilla replicable para data nueva (ej "Cluster: X").
3. En los .md de cada agente, agregar sección "Fuentes de verdad que tenés que
   leer ANTES de actuar" con paths exactos + qué buscar en cada uno.
4. Cuando el agente no encuentre data → debe PEDIR al founder, no inventar.
5. Referenciar los archivos en CLAUDE.md / system prompt principal para que
   el orquestador también los conozca.
```

### Cuándo aplicarlo

- Cualquier proyecto donde los agentes necesitan data específica (keywords, atributos, políticas, brand voice).
- Especialmente cuando los datos vienen del founder en turnos sueltos y se reusarán en muchos turnos futuros.
- Cuando hay riesgo de inventar (sectores YMYL, contenido legal, datos verificables).

### Notas

- En este turno se "promovió" la política universal de inclusiones (estuche/franela/garantía) que el founder había mencionado al pasar — sin esto, se perdía en próximas invocaciones.
- El agente content-writer-medical en este mismo turno inventó "desde Córdoba" en una meta_description (la óptica está en Virasoro, Corrientes). Detectado por grep pre-cierre — el mismo patrón de defensa-en-profundidad que ya está documentado en LEARNINGS 2026-05-28 "Detección pre-cierre de fact inventado".
- Combinado con la regla "grep pre-cierre", el sistema tiene 2 capas de defensa: (a) prevención (agente lee fuente de verdad) + (b) detección (grep antes de enviar).

---

## 2026-05-28 — Productos relacionados con algoritmo cascada > query simple — robusto contra catálogo chico

**Categoría**: SEO / UX / Catálogo
**Confianza**: 🟢 Alta (validado por seo-strategist + implementado en `lib/catalog/queries.ts:fetchRelatedProducts`)

### Qué funcionó

Cuando hay que mostrar "productos similares" en página de producto, la opción naive es `SELECT * FROM products WHERE brand = current_brand AND category = current_category LIMIT 6`. Problema: cuando una marca tiene 1 solo producto (caso real del proyecto: Vulk con sólo Vulk Day Light cargado), esa query devuelve 0 → la sección queda vacía → rompe confianza ("¿este sitio tiene un solo producto?").

Solución: **algoritmo cascada con fallbacks priorizados**. 4 pasos secuenciales que rellenan el bucket de 6 productos:

1. **Misma categoría + misma marca** (excluyendo el actual) → si encuentra ≥6, stop.
2. **Si faltan: misma categoría + similar precio (±30%)** — cualquier marca.
3. **Si faltan: misma categoría + misma forma de armazón** (rectangular, wayfarer, aviator, etc).
4. **Si faltan: cualquier producto de la misma categoría** — fallback final.

Cada paso agrega solo lo que falta para llegar a 6. Productos sin stock se filtran. El producto actual se excluye.

### Por qué funciona

- **NUNCA muestra 0 productos** — siempre hay fallback. La página nunca queda vacía visualmente.
- **Prioridad declarativa**: el orden de los pasos refleja qué define "similar" desde más fuerte (mismo SKU mental) a más débil (cualquiera de la misma cat).
- **Mantiene UX coherente**: cuando la marca tiene 6+ productos, todos son de la misma marca → el usuario ve un "más Vulk". Cuando solo hay 1, mezcla marcas pero mantiene la categoría (sigue siendo sol, no le aparece receta).
- **SEO bonus**: el anchor de cada card es el nombre del producto (no "Ver producto" genérico) → Google ve internal links con anchors descriptivos naturalmente.

### Cómo replicar

```ts
async function fetchRelatedProducts({
  excludeSlug, categorySlug, brandSlug, priceCents, frameShape,
}): Promise<RelatedProductCard[]> {
  const collected = new Map<string, RelatedProductCard>();
  const LIMIT = 6;

  const addRows = (rows) => {
    for (const row of rows ?? []) {
      if (collected.size >= LIMIT) return;
      if (row.slug === excludeSlug) continue;
      const card = toCard(row);
      if (card.inStockCount === 0) continue;
      if (collected.has(card.slug)) continue;
      collected.set(card.slug, card);
    }
  };

  // Paso 1: misma cat + misma marca
  addRows((await query.eq('category.slug', categorySlug).eq('brand.slug', brandSlug)).data);
  if (collected.size >= LIMIT) return Array.from(collected.values());

  // Paso 2: similar precio
  if (priceCents !== null) {
    addRows((await query.gte('price', priceCents * 0.7).lte('price', priceCents * 1.3)).data);
    if (collected.size >= LIMIT) return Array.from(collected.values());
  }

  // Paso 3: misma forma de armazón
  if (frameShape) {
    addRows((await query.eq('attributes->>frame_shape', frameShape)).data);
    if (collected.size >= LIMIT) return Array.from(collected.values());
  }

  // Paso 4: fallback total
  addRows((await query).data);
  return Array.from(collected.values());
}
```

### Cuándo aplicarlo

- E-commerce con catálogo chico-medio (<200 productos) donde cada categoría puede tener solo 1-2 productos por marca.
- Sitios donde la marca propia importa (óptica, moda, vino) — paso 1 prioriza marca.
- Cualquier "related items" donde haya múltiples atributos de similitud y no quieras hardcodear uno solo.

### Cuándo NO aplicarlo

- Catálogos muy grandes (10k+ productos): mejor un servicio de recomendaciones real (Algolia Recommend, Vespa) que devuelve cosas más relevantes por behavior + content.
- Cuando "similar" tiene una definición rígida (ej: "el mismo modelo en otra talla") — usar query directa.

### Notas

- Cada query es independiente — son 4 round-trips a Supabase en el peor caso. Aceptable para volumen actual; cachear con `revalidate: 3600` si crece.
- El `attributes->>frame_shape` usa el operador JSONB de PostgreSQL — funciona porque ya tenemos índice GIN en `attributes`.
- El anchor SEO está en el `<Link>` que envuelve el card → el nombre del producto como child es el anchor text natural.

---

## 2026-05-28 — Supabase Storage público: URL construible deterministically sin SDK + sin server-only

**Categoría**: Frontend / Performance / Supabase
**Confianza**: 🟢 Alta (implementado en `lib/storage/product-image-url.ts`, typecheck verde, listo para client components)

### Qué funcionó

Para mostrar imágenes de un bucket público de Supabase Storage en client components / nuestros `<Image>` de Next, había 3 caminos:

1. **Llamar al SDK** `supabase.storage.from(bucket).getPublicUrl(path)` — funciona pero requiere instanciar el client y la respuesta queda en `data.publicUrl`. El existente `lib/storage/products.ts` lo hace pero está marcado `'server-only'` porque usa `createAdminClient` (service_role).
2. **Pre-calcular las URLs en el server y pasarlas al client** — funciona pero acopla server↔client innecesariamente y duplica datos en props.
3. **Construir la URL directamente** desde `NEXT_PUBLIC_SUPABASE_URL` + path canónico del bucket público — pure JS, sin SDK, funciona en cualquier context.

Elegí opción 3. La URL pública de un bucket público de Supabase Storage tiene formato 100% determinístico:

```ts
`${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
```

Helper `lib/storage/product-image-url.ts` (sin `'server-only'`):

```ts
export function getProductImageUrl(storagePath: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${PRODUCTS_BUCKET}/${storagePath}`;
}
```

### Por qué funciona

- **Bucket público = no hace falta firmar URLs**. Las firmadas son para buckets privados. Si el bucket es público, cualquiera con la URL puede leer — y la URL es construible sin secretos.
- **`NEXT_PUBLIC_SUPABASE_URL` está disponible en client** (es `NEXT_PUBLIC_*`). No hay leak de secrets.
- **Pure JS function** → puede usarse en RSC, client component, edge runtime, scripts. Sin restricciones.
- **Cero overhead**: no necesita instanciar SDK, no hace network call, no async.

### Cuándo NO usar este patrón

- **Bucket privado**: para esos hay que generar signed URLs vía SDK (server-side) con expiración. Construir manual NO va a funcionar.
- **Necesitás transformaciones** (resize, format conversion via Supabase Image Transformation): la URL tiene parámetros adicionales — mejor usar SDK.
- **El path no es controlado por vos** (ej user-uploaded sin sanitización): primero validá el path.

### Cómo replicar

Para cualquier bucket público de Supabase:

```ts
// lib/storage/<resource>-url.ts (sin 'server-only')
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321';

export function get<Resource>Url(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/<bucket>/${path}`;
}
```

Y configurar en `next.config.mjs`:
```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '*.supabase.co' },
  ],
}
```

(Esto ya estaba configurado en nuestro proyecto.)

### Notas

- En dev local Supabase corre en `http://localhost:54321`. El fallback `?? 'http://localhost:54321'` cubre eso. En prod, `NEXT_PUBLIC_SUPABASE_URL` está seteado en Vercel.
- El bucket `products` está marcado `public=true` en `storage.buckets` + tiene policy `anyone reads`. Si después se hace privado, este helper deja de funcionar y hay que migrar a signed URLs.

---

## 2026-05-28 — Plantilla estructurada de inputs > pingpong de preguntas, especialmente con founders no-técnicos

**Categoría**: Comunicación / Workflow con founder
**Confianza**: 🟢 Alta (usada al pedir data del 1er producto Rusty real — patrón claro y replicable)

### Qué funcionó

Cuando founder pidió "cargar 1 producto para ver cómo se ve la página de producto", la opción obvia era arrancar con AskUserQuestion("¿qué marca?") → respuesta → AskUserQuestion("¿qué categoría?") → respuesta → AskUserQuestion("¿qué nombre exacto?") → etc. Hubiera tomado 8-12 turnos para juntar la data completa de 1 producto.

En lugar de eso, le pasé una **plantilla markdown estructurada** que él puede rellenar en su tiempo y devolverme en 1 sola respuesta:

```
MARCA: ...
CATEGORÍA: sol / receta
MODELO EXACTO: ...
NOMBRE COMPLETO: ...
DESCRIPCIÓN CORTA: ...
DESCRIPCIÓN LARGA: ...
ATRIBUTOS:
  - Material del marco: ...
  - Forma del marco: ...
  - ...
VARIANTE 1:
  - Color del armazón: ...
  - Precio: ...
  - Stock: ...
VARIANTE 2: ...
```

Esto convierte un proceso de 8-12 turnos (yo pregunto → él responde → yo pregunto → él responde) en **1 turno asíncrono** (yo paso plantilla → él la llena cuando puede → yo proceso todo).

### Por qué funciona

- **Founder no-técnico ve TODA la data requerida al mismo tiempo** → entiende el alcance, no se sorprende por preguntas inesperadas a mitad de carga.
- **Puede llenar la plantilla offline / en su tiempo** (consultar facturas, fotos, stock real) sin presión de turnos.
- **Yo proceso TODA la data junta** → menos contexto perdido entre turnos, menos riesgo de olvidar atributos.
- **La plantilla actúa como spec implícita** del data model — founder ve "ah, necesitás esto, esto y esto" y aprende qué datos vamos a estructurar.

### Cuándo aplicarlo

- Carga de productos / data de catálogo.
- Onboarding de marca nueva (slug, descripción, líneas, segmento).
- Configuración inicial (env vars, contactos, datos legales).
- Cualquier proceso que requiera >3 datos discretos del founder.

### Cuándo NO aplicarlo

- Decisiones binarias o de 2-3 opciones → AskUserQuestion es mejor (más fast).
- Cuando la siguiente pregunta depende de la respuesta a la anterior (ej "¿elegís A o B?" → si A pregunto X, si B pregunto Y) → plantilla no sirve porque no se puede pre-escribir.
- Cuando el founder ya está activo y en flow (ej "dale", "continuá") — plantilla sería burocrática.

### Cómo replicar

Template structure:

1. **Encabezado**: estado actual del sistema relevante a la pregunta (qué hay cargado, qué falta).
2. **Estrategia recomendada**: qué voy a hacer con los datos que pida (transparencia → builds trust).
3. **La plantilla**: agrupada por secciones, con ejemplos entre paréntesis donde sea ambiguo.
4. **Notas auxiliares**: cualquier pendiente paralelo que el founder pueda adelantar mientras consigue la data.

### Notas

- Si la plantilla queda larga (>30 líneas), considerar partirla en fases (ej "fase 1: producto base; fase 2: variantes; fase 3: imágenes") y procesarlas secuencialmente, no en paralelo.
- Esta es la inversa del "leak by 1000 cuts": en vez de descubrir requirements de a poco, los ponemos arriba de la mesa de entrada.

---

## 2026-05-28 — Cursor magnético seguro: 3 protecciones defensivas en montaje + framer-motion useSpring

**Categoría**: Frontend / Accesibilidad / Microinteractions
**Confianza**: 🟢 Alta (implementado, typecheck verde, protecciones explícitas verificadas)

### Qué funcionó

El cursor magnético es un efecto que se rompe feo en mobile/touch (no hay cursor) y rompe accesibilidad si el user opted out de motion. La implementación correcta en `components/ui/magnetic-button.tsx`:

```tsx
const [enabled, setEnabled] = useState(false);

useEffect(() => {
  if (typeof window === 'undefined') return;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setEnabled(hasFinePointer && !reduced);
}, []);

if (!enabled) {
  return <div className={className}>{children}</div>;  // pasthrough sin lib
}
// ... aplicar efecto magnético solo si enabled
```

**3 protecciones**:
1. **`(hover: hover) and (pointer: fine)`** filtra dispositivos touch (mobile, tablets, hybrid). Sin esto, el evento `onMouseMove` se dispara en touch devices y rompe gestos.
2. **`prefers-reduced-motion: reduce`** filtra users con vestibular disorders o que simplemente prefieren menos movimiento. Sin esto, el efecto los molesta o causa motion sickness.
3. **`enabled=false` default** + `useEffect` para activar → renderiza sin lib en SSR (no hydration mismatch).

**Spring config** que funciona bien para cursor magnético:
```ts
const SPRING = { stiffness: 220, damping: 18, mass: 0.4 };
```
- `stiffness: 220` — respuesta rápida (no laggy).
- `damping: 18` — overshoot mínimo (no bouncy).
- `mass: 0.4` — peso bajo, sensación "tirado con elástico fino".
- `strength: 0.28` (28% del delta) — efecto perceptible pero no agresivo.

### Por qué funciona

- **`useSpring` de framer-motion** envuelve un `useMotionValue` con interpolación spring-físico — la suavidad es nativa, no hay que escribir el RAF loop.
- **`matchMedia('(hover: hover) and (pointer: fine)')`** es la query estándar para "este device tiene cursor preciso" — filtra correctamente Apple Pencil, mouse, trackpad, pero NO touch o stylus genérico.
- **El pasthrough en !enabled** es un `<div>` sin listeners → cero overhead en mobile. El bundle de framer-motion se carga igual, pero NO se ejecuta nada motion en esos devices.

### Cómo replicar

Para CUALQUIER microinteracción que dependa del cursor (magnetic, custom cursor follower, hover lights, etc):

```tsx
'use client';
import { useEffect, useState } from 'react';

function useHoverCapability() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const hasFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setOk(hasFine && !reduced);
  }, []);
  return ok;
}
```

Si `!useHoverCapability()` → renderizar versión estática sin efecto.

### Notas

- framer-motion 12.x cambió algunas APIs (`motion()` factory). Para cursor magnético usé el wrapper `motion.div` clásico que sigue funcionando.
- Si querés evitar el costo del bundle de framer-motion para devices que NO van a usarlo, se puede `dynamic(() => import('./magnetic-button'), { ssr: false })` — pero agrega complejidad. Para una sola feature, no vale la pena.
- El cursor magnético sobre el button shadcn pasa por: `<MagneticButton>` (wrapper con listeners) → `<motion.div style={{x, y}}>` (aplica transform) → `<Button asChild>` (slot pattern, no rompe el ref del Link).

---

## 2026-05-28 — Detección pre-cierre de fact inventado: grep antes de mandar a producción me salvó

**Categoría**: Proceso / Honestidad de contenido
**Confianza**: 🟢 Alta (detectado y corregido por mí en runtime, antes de enviar al founder)

### Qué funcionó

Implementando el hero editorial nuevo, escribí en el eyebrow `"{siteName} · desde 1995"`. **Inventé el año 1995**. Antes de cerrar el turno, hice un `grep -rn "1995\|1996\|founded\|fundada\|desde 19"` en `lib/` y `components/` para verificar si el año tenía respaldo en algún archivo del proyecto. **Resultado: solo apareció en mi archivo nuevo** — confirmado que lo inventé.

Corregí en runtime a `"óptica matriculada · 30+ años"` que SÍ está validado en CLAUDE.md y BRANDS.md ("Óptica familiar con 30+ años de historia").

### Por qué funciona

- **Cualquier dato concreto (año, dirección, matrícula, nombre, CUIT) DEBE tener respaldo en un archivo del proyecto**. Si no lo tiene, lo estoy inventando.
- **El grep pre-cierre es barato y devuelve evidencia binaria** (aparece / no aparece). No deja lugar a confusión "creo que era 1995".
- **Funciona como "última red de seguridad"** entre yo y el código que va a producción.

### Cómo replicar

Antes de marcar como completo cualquier UI/copy que incluya un dato concreto:

```bash
grep -rn "<dato exacto>" lib/ components/ app/
```

Si el grep NO encuentra el dato fuera del archivo que acabo de tocar, es candidato a inventado. Reemplazar por:
- Lenguaje placeholder validado (ej "30+ años" en vez de un año específico).
- `[NOMBRE]` / `[AÑO]` / `[CUIT]` si todavía no se sabe.
- O preguntarle al founder.

### Cuándo aplicarlo

- Año de fundación.
- Nombre exacto del/la regente o matriculado (NO inventar, usar `[NOMBRE]` o el dato de `business.regenteName`).
- Direcciones, teléfonos, CUITs.
- Cualquier número específico (cantidad de productos, marcas, sucursales).

### Conexión con MISTAKES

Esta es la regla "NUNCA inventar" reforzada — está en CLAUDE.md sección "Reglas duras del negocio" punto 3 ("no prometemos lo que no podemos cumplir") y en varias entries previas de MISTAKES.md. La regla existe; la red de seguridad operacional (grep pre-cierre) es la práctica que la materializa.

---

## 2026-05-28 — View Transitions API en Next 15 funciona con CSS puro `@view-transition { navigation: auto }` (sin tocar next.config)

**Categoría**: Frontend / Performance / Next.js
**Confianza**: 🟢 Alta (implementado, typecheck verde, fallback elegante verificado)

### Qué funcionó

Para agregar page transitions cinematográficas entre rutas en Next 15, Next ofrece feature experimental `experimental.viewTransition: true` en `next.config.js`. **No la necesitamos**. View Transitions API tiene una variante CSS-only para navegaciones MPA tradicionales (browser-level) que se activa con una sola regla CSS:

```css
@view-transition {
  navigation: auto;
}

::view-transition-old(root) { animation: vt-fade-out 0.35s cubic-bezier(0.4,0,0.2,1); }
::view-transition-new(root) { animation: vt-fade-in 0.35s cubic-bezier(0.4,0,0.2,1); }

@keyframes vt-fade-out { to { opacity: 0; transform: translateY(-8px); } }
@keyframes vt-fade-in  { from { opacity: 0; transform: translateY(8px); } }
```

Esto funciona automáticamente en Chrome 126+, Edge, Safari 18+ (los browsers que soportan view-transitions a nivel de navegación). En browsers viejos, simplemente no anima — el fallback es la navegación normal de Next. **Cero JavaScript agregado, cero configuración**.

### Por qué funciona

- **`@view-transition { navigation: auto }`** le dice al browser: "anda animando todas las navegaciones same-origin con la View Transitions API". El browser captura un screenshot del estado actual (`::view-transition-old(root)`), navega, captura el nuevo estado (`::view-transition-new(root)`), y aplica las animaciones CSS que definamos.
- **Funciona con SPA-style routing de Next?** Sí — Next 15 hace soft navigation que igual dispara la API si está habilitada vía CSS. El RSC streaming es compatible.
- **`experimental.viewTransition` de Next es para casos más avanzados** (per-element transitions con `view-transition-name`, scoped transitions con `unstable_ViewTransition`). Para fade-in/fade-out de page-level, el CSS puro alcanza.

### Cómo replicar

```css
/* En app/globals.css */
@view-transition { navigation: auto; }
::view-transition-old(root) { animation-name: tu-out; animation-duration: 0.35s; }
::view-transition-new(root) { animation-name: tu-in;  animation-duration: 0.35s; }

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) { animation: none !important; }
}
```

### Cuándo escalar a la API experimental de Next

- Transiciones específicas a un elemento (ej: imagen de producto que crece al ir al detalle).
- Estados intermedios complejos con `unstable_ViewTransition` y `view-transition-name` dinámicos.

Mientras tanto, el CSS puro cubre 90% de los casos.

### Notas

- Si una nav es muy rápida (~50ms) el browser puede skippear la animación por optimización. Es feature, no bug.
- View Transitions captura el `<html>` por default. Si querés excluir elementos del snapshot (ej: video que sigue reproduciéndose), usar `view-transition-name: none` en CSS de ese elemento.

---

## 2026-05-28 — Capa 1 de "modernización" cubrible 100% con Tailwind + CSS nativo (sin libs nuevas) — 0 KB extra

**Categoría**: Frontend / Performance / UX
**Confianza**: 🟢 Alta (lote 1 implementado, typecheck verde, 0 dependencias agregadas)

### Qué funcionó

Founder pidió que el sitio se vea "más moderno" pasando 5 refs heterogéneas (Cartier luxury, Cleo fintech, aircenter agency, aimee illustrated, sidewave experimental). Tentación inicial: instalar `framer-motion` (~50KB) + `lenis` (~15KB) para tener spring physics + smooth scroll de calidad agencia. Decisión: **probar primero solo con lo que ya tenemos** (Tailwind 3.4 + `tailwindcss-animate` + CSS nativo + View Transitions API de Next 15).

Resultado lote 1 implementado:
- **Smooth scroll global**: 1 línea CSS (`html { scroll-behavior: smooth }`) + media query `prefers-reduced-motion` que cancela TODO (animations + transitions + scroll smooth).
- **Hover premium en cards**: `transition-all duration-300 ease-out` + `hover:-translate-y-0.5/-translate-y-1` + `hover:shadow-lg/xl` + image-zoom `scale-[1.03]` con duration-500. Se ve como Cleo, performance nativa.
- **Marquee infinito**: keyframe CSS `translateX(0)` → `translateX(-50%)` + items duplicados en JSX. Loop perfecto sin reset visible, pausa-on-hover via `group:hover` selector. ~10 líneas CSS total.

0 KB JavaScript agregado, 0 cambios en bundle, 0 dependencias nuevas, 0 cambios en Core Web Vitals esperados.

### Por qué funciona

- **Tailwind 3.4+ tiene `group/<name>` (named groups)** — permite hover-effects anidados sin colisión con groups parent. Antes había que ser cuidadoso con `group-hover:`; ahora `group/card` + `group-hover/card:` es perfectamente aislable.
- **CSS transitions modernas con `cubic-bezier` defaults (`ease-out`)** son visualmente equivalentes a spring physics de framer-motion para movimientos cortos. La diferencia solo se nota en gestos largos / drag / bouncy specific — que NO es el caso en e-commerce.
- **`prefers-reduced-motion` con `!important` en *::before, *::after** cubre todo el sitio sin tener que pensar caso por caso. Una vez seteado, cualquier nueva animación que se agregue automáticamente respeta el opt-out.
- **Marquee con duplicación + translate-50%** es matemáticamente correcto para loop infinito: cuando el primer set de items terminó de pasar, el segundo set está exactamente donde estaba el primero al inicio → loop sin reset visible.

### Cómo replicar

Para cualquier "modernización" futura:

```
1. Primero probar SOLO con:
   - Tailwind transitions (transition-all, duration-X, ease-X)
   - Tailwind transforms (scale, translate, rotate)
   - tailwindcss-animate (fade, slide, accordion)
   - CSS keyframes inline en globals.css
   - View Transitions API (nativo Next 15)
   - IntersectionObserver (nativo browser)
2. Solo agregar framer-motion / GSAP / Lenis SI después de probar lo anterior
   hay algo específico que no se logra (spring physics complejas, scroll-linked
   animations, stagger con delays variables).
3. NUNCA agregar lib "por si acaso" — cada KB cuenta para Core Web Vitals.
```

### Cuándo aplicarlo

- Capa 2 (diferenciación: hero video editorial, cursor magnético, showcase scroll-driven en producto) — empezar por View Transitions API + IntersectionObserver custom hooks antes de pensar en libs.
- Capa 3 (3D monturas, animación upload IA): acá sí libs (react-three-fiber, framer-motion) son necesarias — pero solo en las páginas específicas, code-splitted.

### Notas

- `group/<name>` requiere Tailwind 3.2+. Tenemos 3.4.14, ok.
- View Transitions API: soporte Chrome/Edge nativo, Safari 18+; fallback elegante (sin transition, layout normal).

---

## 2026-05-28 — `generateStaticParams` + Supabase = env vars NEXT_PUBLIC_* obligatorias en BUILD-time, no solo runtime

**Categoría**: Operación / Deploy Vercel
**Confianza**: 🟢 Alta (build falló sin las vars, pasó con ellas)

### Qué funcionó

Primer deploy a Vercel del repo falló con error críptico durante "Collecting page data": `Error: supabaseUrl is required.` en `app/(storefront)/anteojos-de-receta/[brand]/[product]/page.js` (de `generateStaticParams`). Diagnóstico inmediato: `generateStaticParams` corre **en build-time** para pre-renderizar páginas estáticas, así que ejecuta queries Supabase EN EL BUILD. Si las env vars `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` no están en Vercel ANTES del build, el cliente Supabase tira "supabaseUrl is required" y el build se cae.

Fix: agregar 6 env vars en Vercel Settings → Environment Variables marcadas para los 3 environments (Production / Preview / Development): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `CART_COOKIE_SECRET`, `NEXT_PUBLIC_CHECKOUT_ENABLED=false`. Redeploy sin cache → build pasó.

### Por qué funciona

- **`generateStaticParams` corre en build-time** porque Next 15 quiere pre-generar las rutas dinámicas para SSG. Como esas rutas vienen de DB (listado de productos), necesita conectarse a Supabase durante el build de Vercel.
- **Las env vars NEXT_PUBLIC_* en Vercel se inyectan en build-time Y runtime**. Pero las que no son NEXT_PUBLIC_ (como `SUPABASE_SERVICE_ROLE_KEY`) también deben estar en build-time si las usa cualquier código que se ejecuta durante el build (RSC, generateStaticParams, generateMetadata, sitemap).
- **El sitemap también falla por la misma razón**: el stack trace mostró `.next/server/app/sitemap.xml/route.js` arriba del error porque sitemap también consulta productos en build.

### Cómo replicar

Para cualquier proyecto Next.js + Supabase que vaya a Vercel:

```
# Pre-flight check antes del primer deploy
1. Listar las env vars del .env.local
2. Marcar cuáles se usan en código que corre en build-time:
   - generateStaticParams (rutas dinámicas pre-renderizadas)
   - generateMetadata (SEO en build)
   - sitemap.ts / robots.ts
   - cualquier `force-static` route
3. Esas 100% deben estar en Vercel ANTES del primer deploy.
4. Las runtime-only (webhooks, server actions) pueden agregarse después.
```

### Cuándo aplicarlo

- Cualquier primer deploy a Vercel de un Next.js que toca DB en RSC/SSG.
- Cuando se agregue una nueva env var: revisar si se usa en build-time y, si sí, agregarla a Vercel antes del próximo deploy.

### Notas

- Error message "supabaseUrl is required" es del SDK `@supabase/supabase-js` cuando recibe `undefined` como URL. Engañoso porque suena a "no le pasaste el parámetro" cuando en realidad es "process.env.NEXT_PUBLIC_SUPABASE_URL es undefined en este contexto".
- En dev local nunca pasa porque `.env.local` se carga automáticamente. Es un error solo-prod.

---

## 2026-05-28 — `gh repo create --private --source=. --push` cierra el flow "subir a GitHub" en un solo comando

**Categoría**: Operación / DevOps
**Confianza**: 🟢 Alta (1 ejecución exitosa, pero el comando es estándar y documentado)

### Qué funcionó

Founder pidió subir el proyecto a GitHub para luego importarlo a Vercel. En vez de la secuencia clásica de 4 pasos (crear repo en web UI → `git remote add origin` → `git branch -M main` → `git push -u origin main`), `gh repo create optica-carballo --private --source=. --description "..." --push` hizo TODO en un solo comando: creó el repo en GitHub, configuró el remote, pusheó la branch actual con tracking, en ~2 segundos. Antes del push hice verificación crítica en paralelo: `cat .gitignore` confirmó que `.env*.local` está excluido, y `git ls-files | grep .env` confirmó que solo `.env.example` (template sin secrets) está trackeado. Sin ese check, podríamos haber filtrado API keys reales a un repo aunque privado.

### Por qué funciona

- **`gh repo create` con `--source=.` y `--push`** infiere todo del directorio actual (nombre default = nombre del dir, branch actual = branch a pushear, remote origin = nombre estándar). Elimina pasos manuales propensos a typo (mal-escribir el remote URL, olvidar `-u`, etc.).
- **`--private` por default para proyectos comerciales** es el patrón seguro. Si después se quiere público, cambiar la visibility en GitHub Settings es 1 click. Al revés (público → privado retroactivo) la historia ya fue indexada por scrapers/forks.
- **Pre-flight check de `.gitignore` + `git ls-files | grep .env`** detecta el caso peligroso donde `.env.local` fue commiteado accidentalmente antes de existir el gitignore. Si el grep devuelve archivos, hay que `git rm --cached` + commit ANTES de pushear — una vez pusheado, el secret está en la historia para siempre (aunque se borre después).

### Cómo replicar

Para cualquier proyecto nuevo que necesite subirse a GitHub para luego deployar (Vercel, Netlify, Render):

```bash
# 1. Verificar que no hay secrets trackeados
cat .gitignore | grep -E "env|secret|key"
git ls-files | grep -E "\.env|secrets|credentials"

# 2. Si el segundo grep devuelve algo distinto a templates (.env.example):
#    git rm --cached <archivo> && git commit -m "remove secrets from tracking"

# 3. Crear y pushear en 1 comando
gh repo create <nombre> --private --source=. --description "..." --push
```

### Cuándo aplicarlo

- Cualquier proyecto nuevo que el founder pida subir a GitHub.
- Antes de cualquier push a un repo público con código nuevo, re-correr el grep de pre-flight.

### Notas

- Requiere `gh` CLI autenticado (`gh auth status`).
- El check `git ls-files | grep .env` es ortogonal al `.gitignore`: gitignore protege archivos NUEVOS, pero si un `.env.local` fue agregado al index antes de entrar al gitignore, sigue trackeado. Por eso hay que verificar AMBOS.

---

## 2026-05-28 — MP Checkout Pro V1 rechaza `auto_return: 'approved'` con back_urls localhost

**Categoría**: Operación / Integración MP
**Confianza**: 🟢 Alta (reproducido con error claro y workaround validado)

### Qué funcionó

Al hacer el primer E2E de creación de preference contra sandbox MP usando back_urls de `http://localhost:3000/checkout/...` con `auto_return: 'approved'`, MP devolvió error críptico: `auto_return invalid. back_url.success must be defined`. Las back_urls SÍ estaban definidas. Hipótesis: MP no acepta URLs `localhost` o `127.0.0.1` cuando `auto_return` está presente — requiere URLs públicas accesibles desde el browser del cliente.

Workaround: en `lib/mp/preferences.ts` detectar si `SITE_URL` contiene "localhost" / "127.0.0.1" y omitir `auto_return` en ese caso. En dev → user clickea "Volver al sitio" manual en la UI de MP. En prod con dominio real (`https://opticacarballo.com.ar`) → `auto_return` funciona normal y MP redirige automático.

Re-test con el workaround: preference creada exitosamente, `init_point` y `sandbox_init_point` válidos devueltos.

### Por qué funciona

- **`auto_return` requiere que MP pueda validar las back_urls** como URLs reachables. Localhost no es alcanzable desde el browser del cliente cuando MP redirige post-pago — el dominio no resuelve a la máquina del cliente.
- Sin `auto_return`, MP igual respeta las back_urls (las muestra como botón "Volver al sitio") sin validarlas activamente. Por eso funciona en dev sin `auto_return`.
- **El mensaje de error de MP es engañoso** ("back_url.success must be defined" cuando sí está). El campo que falla en realidad es `auto_return` por las URLs inválidas — pero MP lo reporta como problema con back_urls. Anti-pattern del API que conviene recordar.

### Cómo aplicar

- **Regla**: cuando integremos con servicios externos que requieren callbacks/webhooks/back_urls (MP, Stripe, OAuth providers), siempre testear E2E en dev ANTES de asumir que funciona. Las URLs públicas vs localhost son una clase de bug frecuente.
- **Para MP específicamente**: usar el patrón `isLocalhost ? omit auto_return : include auto_return`. En testing real con webhooks, usar ngrok / tunnel.dev / Vercel preview deploys.
- **Sub-feature 3 (webhook MP)**: el `notification_url` también va a fallar en localhost — MP no puede POSTear a `http://localhost:3000`. Vamos a necesitar ngrok o testear directo en Vercel preview cuando llegue ese momento.

### Relacionado

- [[supabase-js-rompe-inferencia]] — otro caso de error críptico de un SDK externo.
- Sub-feature 3 (webhook MP) — futura, ya advierte sobre el problema.

---

## 2026-05-28 — Pedir AMBOS PDFs al founder antes de decidir entre opciones del mismo proveedor

**Categoría**: Estrategia / Decisión técnica
**Confianza**: 🟢 Alta (caso clarísimo donde la decisión correcta cambió al ver ambos PDFs)

### Qué funcionó

Founder pasó primero el PDF de PAQ.AR v2.0 y preguntó "¿sirve?". Yo arranqué a planear sub-feature LOGISTICA asumiendo PAQ.AR. Después mencionó "API MiCorreo REST.... quizás esta me sirva mejor en mi caso". Le pedí explícitamente el PDF de Mi Correo. Cuando lo pasó, el análisis comparativo reveló que **Mi Correo es estrictamente superior para nuestro caso**: tiene `/rates` (cotización), acepta DNI (sin trámite corporativo), JWT moderno, autoservicio. Los endpoints que PAQ.AR tiene de más (rótulo, tracking, cancelar) son tareas operativas que vienen igual con el portal web — no aportan valor extra para volumen bajo.

**Si hubiera aceptado el primer PDF (PAQ.AR) y arrancado a codear**, hubiera invertido tiempo en una integración inferior + el founder hubiera iniciado un trámite corporativo de 3-6 semanas que no necesitaba.

### Por qué funciona

- **Proveedores grandes ofrecen MÚLTIPLES productos** con APIs distintas (PAQ.AR = corporativo, Mi Correo = PyME / self-service). El founder a veces conoce los nombres pero no qué API encaja con su caso.
- **Comparar features explícitamente** revela trade-offs que no son obvios desde un solo PDF (ej: la falta de `/rates` en PAQ.AR es invisible hasta que ves que Mi Correo lo tiene).
- **Costo de pedir 2do PDF = 30 segundos del founder**; costo de codear la integración equivocada = sesiones perdidas.

### Cómo aplicar

- **Regla**: cuando el founder mencione "tengo el PDF de la API X" para un proveedor que ofrece múltiples productos, preguntar explícitamente: "¿hay otros productos del mismo proveedor que estés evaluando? Pasá los PDFs también, comparo antes de planear código."
- Aplica especialmente a: Correo Argentino (PAQ.AR vs Mi Correo vs eCommerceCorreo), Andreani (B2B Web Services vs PyME), Mercado Pago (Checkout Pro vs Bricks vs Payment Brick).
- **Output del análisis**: tabla comparativa con criterios que importan para nuestro caso (no genéricos). Recomendación clara con justificación.

### Relacionado

- [[la-info-del-agente-no-es-ground-truth]] — el LEARNING anterior sobre validar info de agentes.
- [[acepta-literal-pivot-tecnico-founder-sin-verificar]] (MISTAKES) — el caso PAQ.AR original donde estuve a 1 turno de pedir trámite corporativo innecesario.

---

## 2026-05-28 — La info del agente NO es ground truth; el manual oficial del proveedor sí

**Categoría**: Operación / Verificación de agentes
**Confianza**: 🟡 Media (1 caso confirmado, pero principio general bien establecido)

### Qué funcionó

El agente `argentine-ecom` afirmó que la documentación de PAQ.AR estaba "bajo NDA" y que la API era "notoriamente débil con sandbox poco confiable". Founder me pasó el manual oficial PDF v2.0 (abril 2023) que CONTRADICE parcialmente esto: la documentación SÍ es accesible (founder la consiguió), URLs reales son `apitest.correoargentino.com.ar/paqar/v1` y `api.correoargentino.com.ar/paqar/v1`, endpoints REST estándar con auth por `Apikey` + `agreement` header, y soporta lo básico (alta orden, cancelar, rótulo PDF, tracking, sucursales). Lo del NDA y DX débil quedó relativizado.

Lo que SÍ confirmó el manual del agente: requiere acuerdo comercial con Correo Argentino para obtener `agreement` (id numérico) + `API-Key`. No es API pública abierta para cualquiera.

### Por qué funciona

- **Los agentes especialistas trabajan con conocimiento general, no con la doc específica del proveedor**. Si el founder tiene acceso al material oficial (PDF, login portal, etc.), siempre vale más que la opinión del agente.
- **La info del agente sirve para `desconocidos conocidos`** (qué preguntar, qué proveedores existen, qué patrones típicos). NO para reemplazar la consulta de fuentes primarias cuando están disponibles.
- **Patrón inverso al MISTAKE de PAQ.AR** (aceptar pivot técnico del founder sin verificar): acá el founder verificó el conocimiento del agente con doc oficial. Esto es lo correcto: triangular agentes + docs + experiencia.

### Cómo aplicar

- **Regla**: cuando el agente argentine-ecom (o cualquier agente de dominio) afirma algo sobre un proveedor específico ("la API no es pública", "el DX es malo", "el trámite tarda X"), **tratarlo como hipótesis a validar**, no como hecho.
- Cuando el founder tiene material oficial del proveedor (PDF, portal, contacto comercial), priorizar SIEMPRE eso sobre lo que dijo el agente.
- Si hay contradicción entre agente y material oficial: actualizar el plan según el material oficial, registrar el hallazgo en LEARNINGS (no en MISTAKES — no es error, es info actualizada).
- Para feedback al agente: el [[agent-manager]] puede registrar esto en su próximo review para ajustar la confiabilidad del `argentine-ecom` en temas específicos.

### Relacionado

- [[invocar-argentine-ecom-antes-de-planificar-integracion-logistica]] — el LEARNING original sobre invocar al agente.
- [[acepta-literal-pivot-tecnico-founder-sin-verificar]] (MISTAKES) — el caso anterior donde la verificación llegó tarde.

---

## 2026-05-28 — Invocar `argentine-ecom` ANTES de planificar integración logística salvó iniciar trámite innecesario

**Categoría**: Estrategia / Uso de agentes
**Confianza**: 🟢 Alta (validado con info concreta del agente que cambió decisión)

### Qué funcionó

Founder decidió "shipping con PAQ.AR de Correo Argentino" sin que yo cuestionara la viabilidad técnica. En vez de empezar a codear (o peor, pedirle que inicie trámite corporativo), invoqué al agente `argentine-ecom` para investigar el estado real de la API. El agente reveló: (1) PAQ.AR no tiene API pública — requiere cuenta corporativa + NDA (3-6 semanas); (2) DX de la API es débil incluso cuando la tenés; (3) Andreani sigue siendo mejor opción técnica (ADR-017 vigente); (4) Para volumen inicial (5-20/mes), NO se justifica integrar API — tabla fija + despacho manual es más eficiente. Resultado: founder NO inicia trámite Correo corporativo (ahorro 3-6 semanas + DX hostil), plan pivota a tabla por zonas con migración a Andreani PyME cuando crezca volumen.

### Por qué funciona

- **El founder pide cosas con vocabulario técnico** ("PAQ.AR API") sin necesariamente conocer la realidad operativa actual. Aceptar literal lleva a iniciar trámites largos por nada.
- **Los agentes especialistas tienen conocimiento de dominio** que yo no tengo (logística AR es nicho). Invocarlos como segundo cerebro antes de codear o pedir acciones al founder evita rabbit holes.
- **El costo de invocar un agente es bajo** (~40 segundos en background) vs el costo de iniciar trámites/escribir código en base a supuestos.

### Cómo aplicar

- **Regla**: cuando founder mencione integración técnica con un proveedor argentino (AFIP, MP, Andreani, Correo, banco, etc.) y yo NO tenga conocimiento directo y reciente del estado de su API, invocar `argentine-ecom` ANTES de planear código o pedir credenciales/trámites.
- Aplica también a pivots de scope que dependen de una pieza externa cuya viabilidad no conozco.
- No aplica a decisiones puras de producto/UX (esas las decide el founder, no requieren verificación técnica externa).

### Relacionado

- ADR-017 (Andreani principal + Correo Argentino fallback) — confirmado vigente por el agente.
- Decisión de shipping V1 ajustada en CURRENT_STATE.md ("Próximo paso EXACTO").

---

## 2026-05-28 — `supabase-js` rompe inferencia con `.select('*').maybeSingle().returns<T>()`, hay que enumerar columnas

**Categoría**: Operación / Tipos
**Confianza**: 🟢 Alta (verificado con error explícito de TS)

### Qué funcionó

En `lib/addresses/queries.ts` empecé con `supabase.from('addresses').select('*').maybeSingle().returns<Address>()`. TS marcó error:

```
Type mismatch: Cannot cast array result to a single object.
Use .overrideTypes<Array<YourType>> or .returns<Array<YourType>> for array results
or .single() to convert the result to a single object
```

La fix es **enumerar las columnas explícitamente**:
```ts
.select('id, user_id, label, recipient_name, street, number, apartment, city, province, postal_code, country, phone, is_default, created_at, updated_at')
```

### Por qué funciona

- Con `select('*')`, supabase-js no sabe la cardinalidad inferida y por default tipa como array. `.returns<T>()` luego intenta cast a un singular y rompe.
- Con select explícito + `.maybeSingle()`, supabase-js infiere correctamente que es 1 row o null, y `.returns<T>()` funciona.
- Patrón ya usado en `lib/catalog/queries.ts` (todas las queries enumeran columnas) — esta sesión confirmó la regla.

### Cómo aplicar

- **Regla nueva**: para queries que terminan en `.single()` o `.maybeSingle()` + `.returns<T>()`, NUNCA usar `select('*')`. Enumerar columnas siempre.
- Para queries que devuelven arrays, `select('*')` está OK (ej: `fetchUserAddresses()`).
- Si la lista de columnas crece y enumerar es tedioso, considerar usar los Database types auto-generados (`pnpm db:types`) en vez de un tipo manual, y dejar que TS infiera todo.

### Relacionado

- [[supabase-fk-embeds-tipan-como-arrays]] (LEARNING anterior 2026-05-28).
- Sub-feature 2a addresses (esta sesión).

---

## 2026-05-28 — Zod 4 `z.uuid()` es estricto (RFC 4122 v1-8 + nil + max), no acepta cualquier 36 chars

**Categoría**: Operación / Validación
**Confianza**: 🟢 Alta (verificado contra el regex que Zod 4 imprime en error)

### Qué funcionó

El cart sub-feature 1 usa `z.uuid()` para validar `variantId`. Al smoke-testear con un UUID sintético `00000000-0000-0000-0000-000000000001`, el cart se rendereaba vacío silenciosamente. Debug: Zod rechazaba el UUID porque el regex es:
```
/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/
```

El tercer grupo exige `[1-8]` como primer char (versión RFC 4122), y el cuarto exige `[89abAB]` (variant bits). El UUID sintético tenía `0000` en ambos → rechazado. Las únicas excepciones son nil UUID (todo ceros) y max UUID (todo F).

### Por qué es bueno

- Esta estrictitud es una **defensa-en-profundidad gratis**: cualquier intento de inyectar un variant_id no-UUID en la cookie tampered hace fallar el schema y el cart vuelve vacío silenciosamente.
- Supabase genera UUIDs v4 (cumplen el regex), entonces no hay falsos negativos en producción.
- Antes de Zod 4, `z.string().uuid()` era más permisivo. La migración a `z.uuid()` ya está hecha en este proyecto desde el setup.

### Cómo aplicar

- Para smoke testing manual con UUID sintéticos: usar `00000000-0000-0000-0000-000000000000` (nil) o un UUID v4 generado con `crypto.randomUUID()`.
- Para tests automatizados que necesiten UUIDs determinísticos: prefijar siempre con un version+variant válidos, ej: `00000000-0000-4000-8000-000000000001`.
- Si en algún futuro `z.uuid()` rechaza UUIDs legítimos de algún sistema externo no-RFC-4122 (raro), usar `z.string().regex(/^[0-9a-f-]{36}$/i)` como fallback más permisivo.

### Relacionado

- Cart sub-feature 1 (esta sesión).
- Anti-patrón histórico de "todo en la cookie es confiable" — la combinación HMAC + Zod estricto es la pinza correcta.

---

## 2026-05-28 — La regla "no marcar ✅ sin SELECT" salvó silent gap en 00004

**Categoría**: Operación / Verificación cloud
**Confianza**: 🟡 Media (1 aplicación exitosa de regla nueva — primera vez post-instauración)

### Qué funcionó

En el deploy de migración 00004 al cloud, el founder reportó "Success. No rows returned" y, en sesiones previas, ese reporte verbal hubiera sido suficiente para marcar la fila como ✅. Aplicando la regla nueva instaurada después del cloud-drift de 00002, pedí los 2 SELECTs de verificación antes de tocar `CLOUD_APPLIED.md`. El founder pegó el SELECT de policies (4 filas correctas) pero NO el SELECT del bucket. En vez de asumir "si las policies están, el bucket también", insistí en el bucket por separado.

### Por qué funciona

- **`bucket_id='prescriptions'` en las policies es un string literal, no una FK**. Las policies se crean aunque el bucket falle al insertar. Asumir correlación "si las policies existen, el bucket también" es un anti-patrón silencioso.
- **El costo de pedir el SELECT extra es mínimo** (10 segundos del founder); el costo de un silent gap es perderlo semanas hasta que un upload falle con error críptico de Storage.
- **La regla force-mismatch entre "lo que el founder cree" y "lo que la DB realmente tiene"**, que es justo el patrón que causó el cloud-drift de 00002.

### Cómo aplicar

- En cada deploy futuro de migración a cloud: NO marcar ✅ con menos de N SELECTs de verificación, donde N depende de las "moving parts" de la migración (tablas, funciones, triggers, policies, buckets, sequences). Para una migración pequeña, 2 SELECTs alcanza; para una grande, 4-5.
- Si el founder pega solo PARTE de los SELECTs, pedir explícito los faltantes antes de cualquier acción de cierre. Nunca extrapolar de unos a otros.
- Esta regla aplica también a seeds, no solo a schema.

### Relacionado

- MISTAKES.md 2026-05-28 "Cloud drift de migración 00002" (origen de la regla).
- `supabase/CLOUD_APPLIED.md` (tabla viva que la regla protege).

---

## 2026-05-28 — Extraer al SEGUNDO caso, no al tercero, cuando son archivos completos

**Categoría**: Operación / Código
**Confianza**: 🟢 Alta (validado contra el principio general "tres similares OK")

### Qué funcionó
Cuando iba a duplicar la página de marca y la página de producto para cubrir el lado rx (después de tenerlas funcionando en sol), evalué dos approaches: (a) copy-paste literal, (b) extraer helpers compartidos. Elegí extraer ANTES de duplicar.

Resultado: 4 archivos thin (~30 líneas cada uno) reusando `lib/catalog/{categories,queries,metadata}.ts` y `components/catalog/{brand-page,product-page}.tsx`. La duplicación que evité era ~500 líneas de código casi idéntico. La inversión fue ~300 líneas en helpers + componentes, neto a favor.

### Por qué funcionó (causa real)
El principio universal **"no abstraer prematuramente — tres líneas similares está bien"** asume **líneas**, no archivos completos. Cuando el patrón es de archivos enteros (cada uno con su propia lógica de routing, fetch, render, metadata), aplicar "tres similares OK" significa esperar al tercer archivo = ~1500 líneas duplicadas. Eso es scope creep en vez de simplicidad.

La heurística refinada que aplico: **abstraer al primer "obviamente repetible" si el unit es archivo, función completa o componente. Mantener tres-líneas-OK solo para snippets dentro de un archivo.**

Otra señal de "extraer ahora": cuando el segundo caso va a tener divergencia eventual (sol y rx tendrán copy distinto, schemas distintos, etc.) pero la estructura es estable, encapsular la estructura permite que la divergencia se exprese como datos (config), no como código.

### Evidencia
1 caso esta sesión:
- Si hubiera copy-paste: 500 líneas duplicadas en sol/rx. Cada bug-fix futuro requiere actualizar ambos.
- Con helpers: 30 líneas por archivo, la lógica está en un único lugar.

Y un sub-resultado: el typecheck pasó verde de una vez post-refactor; sol intacto sin tocar el dev manualmente, rx funcionó desde la primera curl. La cohesión del refactor se validó automáticamente.

### Cuándo aplicar esto de nuevo
- **Cuando el unit de duplicación es archivo completo o función larga** (no snippets).
- **Cuando hay configuración que naturalmente describe los casos** (acá: `CATEGORIES.sol` y `CATEGORIES.rx`).
- **Cuando esperás que el patrón se replique más de 2 veces** (en este proyecto: lentes de contacto vendría como tercer categoría con misma estructura).

### Cuándo NO aplica
- Cuando el "segundo caso" parece similar pero tiene fundamentos distintos (es una coincidencia, no un patrón). Forzar abstracción ahí crea acoplamiento falso.
- Cuando todavía no entendés bien la forma del patrón (preferir copy-paste y refactorizar al tercer caso).

### Acción derivada
- [x] Aplicado en `lib/catalog/` con helpers + componentes compartidos.
- [ ] Si llega un tercer caso (ej: `/lentes-de-contacto/[brand]/[product]`), validar que los helpers escalan o si necesitan generalizarse más.
- [ ] Si el patrón se replica 4+ veces sin problemas, considerar agregar a CLAUDE.md como regla: "extraer al segundo caso cuando el unit es archivo/función".

---

## 2026-05-28 — Supabase JS tipa embeds FK 1:1 como arrays — usar `.returns<>()` con tipos manuales

**Categoría**: Código
**Confianza**: 🟢 Alta (problema explícito, fix verificado, patrón replicable)

### Qué funcionó
Cuando se hace una query con embeds tipo `select('..., brand:brands!inner(...), category:categories!inner(...)')`, supabase-js tipa los embeds como **arrays** aunque la FK sea 1:1 (un producto tiene una marca, no muchas). En runtime, PostgREST devuelve objetos, pero TS strict no lo sabe. Síntoma: 10+ errores tipo `Property 'slug' does not exist on type '{ slug: any; }[]'`.

Solución: definir un tipo manual del shape esperado y pasarlo a `.returns<MyType>()`:

```ts
type ProductRow = {
  brand: { slug: string; name: string; ... };
  category: { slug: string; is_active: boolean };
  // ...
};

const { data } = await supabase
  .from('products')
  .select('...')
  .maybeSingle()
  .returns<ProductRow>();
```

### Por qué funcionó (causa real)
PostgREST puede devolver tanto array como objeto según la cardinalidad detectada, y supabase-js no infiere correctamente desde el SQL string del select. El generador `supabase gen types` produce tipos correctos para tablas (`Tables<'products'>['Row']`) pero la inferencia para queries con embeds custom es imperfecta. `.returns<>()` es el escape hatch oficial — no es un hack, es la API documentada.

### Evidencia
1 caso resuelto en esta sesión. Aplicado en 3 lugares: `fetchProduct()`, `generateStaticParams()` (`StaticParamRow`), `sitemap.ts` (`ProductSitemapRow`). Cada uno con su tipo específico, validado por typecheck clean.

### Cuándo aplicar esto de nuevo
- **Siempre que hagas `.select()` con embeds y joins en supabase-js**.
- **Siempre que pretendas usar TS strict (que es el default del proyecto)**.
- Si la query es trivial sin embeds (`select('*')` de una sola tabla), los tipos generados bastan, no hace falta `.returns<>()`.

### Cuándo NO aplica
- Queries sin embeds (`select('id, name').from('brands')`).
- Cuando no necesitás type safety estricta (RSC con `unknown` cast inline — pero eso es peor patrón).

### Acción derivada
- [x] Aplicado en `page.tsx` y `sitemap.ts` de la feature de producto.
- [ ] Replicar en futuras queries con embeds: receta, carrito, órdenes, etc.
- [ ] Considerar crear un helper `lib/supabase/queries/` con queries reusables tipadas — cuando se repita el mismo embed shape 3+ veces.

---

## 2026-05-28 — Verificar estado real del cloud post-aplicación, nunca confiar solo en el reporte verbal

**Categoría**: Operación / Seguridad
**Confianza**: 🟢 Alta (validado por el incidente del cloud drift de la misma sesión)

### Qué funcionó (después del incidente)
Cuando aparece un error como `relation "X" does not exist` al aplicar una migración que depende de otra previa, hay que asumir que la "otra previa" no se aplicó realmente, aunque el tracker la marque como ✅. La verificación correcta es **observar el estado real**, no fiarse del reporte.

Mecanismos de verificación, en orden de preferencia:

1. **MCP de Supabase** (`list_tables`, `execute_sql`) — si el proyecto está bajo la cuenta que tiene la integración MCP activa. Permite SELECT directo sin involucrar al founder.
2. **Pedir al founder un SELECT diagnóstico** y reportar el output literal. SQL sugerido:
   ```sql
   SELECT current_database() AS db,
          count(*) FILTER (WHERE schemaname='public') AS public_tables,
          array_agg(tablename ORDER BY tablename) FILTER (WHERE schemaname='public') AS tables
   FROM pg_tables;
   ```
3. **Verificar la URL del Dashboard** donde se aplicó el SQL (`/project/<id>/sql/...`) coincide con el `id` esperado del proyecto target.

### Por qué importa (causa real)
- El founder puede tener múltiples cuentas de Supabase y aplicar SQL en proyecto incorrecto sin notarlo.
- Una transacción SQL del SQL Editor puede fallar silenciosamente en algunos casos (errores parciales reportados pero asumidos como warnings).
- Marcar ✅ "cloud aplicado" en el tracker por dicho del founder **es una mentira documentada**: hace que el sistema asuma estado que no existe, y todo el trabajo subsecuente se construye sobre arena.
- El blast radius es alto: features futuras que asumen schema, migraciones encadenadas, código de producción que falla en runtime.

### Cuándo aplicar
- **SIEMPRE** después de cada aplicación de migración o seed al cloud, antes de marcar ✅.
- Cada vez que el founder reporta "ya está hecho" sobre algo que afecta cloud.
- Antes de aplicar migración N que depende de la N-1, asumir nada sobre el estado de la N-1.

### Cuándo NO aplica
- Cambios puramente locales (que no afectan cloud).
- Cambios de configuración del Dashboard que no se reflejan en `pg_tables` (ej: customización de email templates) — esos requieren otra forma de verificación.

### Acción derivada
- [x] `CLOUD_APPLIED.md` ahora tiene estado `⚠️ A verificar` para entries no confirmadas (no solo ✅/⏳).
- [x] MISTAKES.md registra el incidente con regla preventiva.
- [ ] Considerar agregar a CLAUDE.md una regla dura: "Toda fila ✅ en CLOUD_APPLIED.md requiere evidencia verificable (output de SELECT, tabla creada, etc.) — no solo dicho."
- [ ] Considerar agregar al skill `/migration` un paso Step 10 obligatorio: "Verificar post-aplicación con SELECT y solo entonces marcar ✅."

---

## 2026-05-28 — `BACKLOG.md` + `CLOUD_APPLIED.md` evitan que pendientes triviales se pierdan en CURRENT_STATE

**Categoría**: Operación / Documentación
**Confianza**: 🟡 Media (1 caso de adopción, validar con uso real en próximas sesiones)

### Qué funcionó
Cuando se acumularon múltiples pendientes chicos (OG image, isotipo transparente, env vars vacías, productos `[PH]`, plazos `[PENDIENTE]` en legales, mejoras de SEO menores), separé en dos archivos dedicados en vez de seguir extendiendo CURRENT_STATE:

- **`BACKLOG.md`** (raíz): pendientes acumulados por categoría (assets, data real, mejoras técnicas, features menores). Cada item tiene contexto + cuándo se agregó. Sección "Hecho" con commit hash/fecha + "Descartado" para histórico.
- **`supabase/CLOUD_APPLIED.md`**: tabla viva de migraciones/seeds aplicados al cloud vs lo que está en `supabase/migrations/`. Resuelve la confusión recurrente de "¿esto ya está en cloud o no?".

### Por qué funcionó (causa real)
CURRENT_STATE creció a >300 líneas porque mezclaba 3 cosas:
1. Estado actual del proyecto (lo que es).
2. Logros recientes (lo que se hizo).
3. Pendientes acumulados (lo que falta).

Las primeras 2 son históricas y específicas de cada sesión. La 3ra es transversal y persistente. Mezclarlas convertía CURRENT_STATE en un dump difícil de escanear.

Separar pendientes a `BACKLOG.md`:
- CURRENT_STATE se mantiene legible (~estado + logros + próximo paso).
- BACKLOG es escaneable por categoría/prioridad y tiene historial de "hecho/descartado".
- Items chicos no se pierden entre features grandes.

`CLOUD_APPLIED.md` resuelve un problema específico (cloud drift) con un tracker mínimo. Más simple que migración tooling (no necesitamos `supabase link` + `db diff` para 2 migraciones).

### Cuándo aplicar
- Cuando aparezca un pendiente "para hacer después" que no es feature completa → `BACKLOG.md`.
- Cuando se aplique cualquier cambio a cloud (migración o seed) → fila nueva en `CLOUD_APPLIED.md`.
- Cuando un item de BACKLOG se haga → mover a "Hecho" con commit hash + fecha.

### Cuándo NO aplica
- Features con planificación propia (skill `/feature` o `/migration`) → siguen en su flujo normal.
- Decisiones de arquitectura → siguen en `DECISIONS.md` con ADRs.
- Bugs activos → siguen en `MISTAKES.md` con causa raíz.

### Acción derivada
- [x] `BACKLOG.md` con secciones por categoría (assets, data real, mejoras técnicas, features menores).
- [x] `supabase/CLOUD_APPLIED.md` con tabla + flujo documentado para próximas migraciones.
- [x] `CLAUDE.md` referencia los dos archivos en "Otros archivos importantes".
- [ ] Validar en 2-3 sesiones más que BACKLOG se mantiene útil y no se vuelve cementerio de items olvidados.

---

## 2026-05-28 — Next 15 usa `apple-icon.png` (no `apple-touch-icon.png`) en `app/`

**Categoría**: Convención del framework
**Confianza**: 🟢 Alta (validado con HTTP 200 vs 404)

### Qué funcionó
La convención de archivos de iconos en Next 15 App Router para `app/` es:
- `app/favicon.ico` → `<link rel="icon">` para favicon clásico.
- `app/icon.{ico,jpg,jpeg,png,svg}` → `<link rel="icon">` general (típicamente 512×512 PWA).
- `app/apple-icon.{jpg,jpeg,png}` → `<link rel="apple-touch-icon">` (típicamente 180×180 iOS).

Lo que NO funciona: `app/apple-touch-icon.png` (nombre histórico HTML, pero no es el reconocido por Next). Sirve HTTP 404.

### Por qué importa
- Tradicionalmente en HTML el meta tag es `<link rel="apple-touch-icon">` y muchos generadores de assets (RealFaviconGenerator, etc.) producen archivos con ese nombre exacto.
- Next 15 abstrae: vos pones el archivo como `apple-icon.png`, y Next genera el meta tag `rel="apple-touch-icon"` automáticamente con `sizes="180x180"` (detectado del archivo) + URL con hash para cache busting.
- Si nombrás el archivo como `apple-touch-icon.png`, Next no lo reconoce y va al 404 handler.

### Evidencia
1 caso resuelto en esta sesión. Síntoma: `/apple-touch-icon.png` → HTTP 404 con 17 KB (página 404 default). Fix: `git mv app/apple-touch-icon.png app/apple-icon.png` + `rm -rf .next` + verificación: HTTP 200 con meta tag `<link rel="apple-touch-icon" href="/apple-icon.png?<hash>" type="image/png" sizes="180x180">`.

### Cuándo aplicar
- Cualquier vez que el founder o un generador externo pase archivos de icon con nombres clásicos HTML.
- Cuando aparezcan 404 al testear `/apple-touch-icon.png` u otras variantes.

### Cuándo NO aplica
- Si los archivos están en `public/` (convención clásica) en vez de `app/`, los nombres originales sí funcionan (Next no los procesa, solo los sirve). Pero perdés la auto-generación de meta tags + cache busting.

### Acción derivada
- [x] Rename aplicado.
- [ ] Cuando founder pase próximos assets, validar nombres contra convención Next.

---

## 2026-05-28 — Estructura `public/` con subdirectorios + README, no carpeta `assets/` en raíz

**Categoría**: Convención del proyecto
**Confianza**: 🟢 Alta (convención estándar de Next.js)

### Qué funcionó
Cuando el founder propuso "crear una carpeta en la raíz del proyecto" para assets (logos, favicon, fotos), redirigí a la convención de Next: **todo va en `public/`**. Cualquier otra carpeta (`assets/`, `static/`) NO es servida por Next sin webpack import.

Estructura adoptada:
- `public/brand/` — logos, isotipo, variantes.
- `public/og/` — imágenes Open Graph 1200×630.
- `public/products/<brand-slug>/<product-slug>/` — fotos de productos.
- `public/favicon.ico` o `app/favicon.ico` — Next 15 soporta ambos, la segunda con auto-meta.
- `public/README.md` — documenta la estructura + reglas de naming, formatos sugeridos, tamaños.

### Por qué importa
- **`public/foo.png` se sirve desde `/foo.png` sin import**. Performance directo (no pasa por webpack).
- **Cualquier otra carpeta requiere `import logo from '@/assets/logo.png'`** — overhead innecesario para imágenes estáticas que solo se referencian por path.
- **Naming organizado** evita el típico `public/logo.png`, `public/logo-old.png`, `public/logo2.png` después de 6 meses.

### Cuándo aplicar
- Cualquier asset estático (imagen, font, PDF, robots.txt, sitemap).
- Cuando el founder o yo proponemos guardar archivos en raíz.

### Cuándo NO aplica
- Imágenes pesadas (>1 MB) o que crecen con el catálogo → Supabase Storage con CDN.
- Assets que requieren transformación (resize, compresión adaptativa) → `next/image` con remote pattern + Storage.
- Imágenes que el usuario sube → siempre Storage, NUNCA `public/`.

### Acción derivada
- [x] `public/README.md` documenta la convención y el uso de `next/image`.
- [ ] Cuando catálogo crezca >50 productos, migrar `public/products/` a Supabase Storage.

---

## 2026-05-28 — Para secrets sensibles (admin keys, service role keys), pedir env var local en vez de pegar en chat

**Categoría**: Operación / Seguridad
**Confianza**: 🟢 Alta (mejor práctica universal de seguridad)

### Qué funcionó
Cuando el founder pidió ejecutar un endpoint que requería `ANTHROPIC_ADMIN_API_KEY` (key administrativo de la organización Anthropic — distinto del key normal de Claude, da control sobre workspaces/miembros/costos), en lugar de pedirle que pegue el valor en el chat, sugerí que lo exporte como env var en su terminal antes de que yo corra el comando: `export ANTHROPIC_ADMIN_API_KEY="..."`. Yo después uso `$ANTHROPIC_ADMIN_API_KEY` en el curl sin que el valor pase por el transcript.

### Por qué importa
El transcript de la conversación se guarda. Cualquier secret pegado ahí queda persistido:
- Visible en historial local de Claude.
- Potencialmente sincronizado si hay backups del transcript.
- Recuperable por terceros que accedan al equipo.

Para keys con blast radius alto (admin, service_role, deploy tokens), la regla es: **el secret nunca pasa por el chat, vive solo en el shell/env local**.

### Cuándo aplicar
- Cualquier admin API key (Anthropic, OpenAI org admin, GitHub PAT, Vercel API).
- Service role keys de Supabase (NUNCA pegar en chat — `.env.local` está gitignored, y para uso ad-hoc, env var del shell).
- DB passwords directas (Supabase cloud, Postgres remotas).
- Deploy tokens / CI secrets.

### Cuándo NO aplica (puede ir en chat)
- Anon keys públicas (las que ya están en `.env.local` y se exponen al cliente browser — `NEXT_PUBLIC_*`).
- IDs (no secrets — el `api_key_id` es solo un identificador, no autoriza nada por sí solo).

### Acción derivada
- [ ] Considerar agregar a CLAUDE.md una regla explícita: "Para secrets con privilegio administrativo, pedir env var local antes que pegar en chat".

---

## 2026-05-28 — Limpiar `.next/` después de mover archivos en `app/`

**Categoría**: Operación
**Confianza**: 🟢 Alta (problema explícito + fix verificado)

### Qué funcionó
Después de mover `app/page.tsx` → `app/(storefront)/page.tsx` para que la home herede el layout del storefront, `pnpm typecheck` falló con `Cannot find module '../../app/page.js'` en `.next/types/validator.ts`. Causa: Next.js genera `.next/types/` con referencias TS al árbol de rutas anterior, y como el archivo cambió de path, las referencias quedaron stale.

Fix de 1 línea: `rm -rf .next && pnpm typecheck`.

### Por qué funcionó (causa real)
Next 15 mantiene un cache de tipos generados (`.next/types/`) que valida rutas estáticamente. Cuando se mueve un archivo de página (especialmente entre layout groups), el path del módulo cambia, pero el cache referencia el path viejo. El typechecker se queja porque el módulo no existe ahí. Limpiar `.next/` fuerza la regeneración con el árbol actual.

### Cuándo aplicar esto de nuevo
- **Después de mover archivos `page.tsx`, `layout.tsx`, `not-found.tsx`, etc.** entre carpetas en `app/`.
- **Después de cambios estructurales en route groups `(name)`** (mover páginas dentro/fuera de un group).
- **Después de renombrar route segments** dinámicos (`[id]` → `[slug]`).
- **Después de borrar páginas**: el cache puede mantener referencias a la ruta vieja.

Si `pnpm typecheck` falla con errores raros de "Cannot find module" después de tocar `app/`, probar primero limpiar `.next/`.

### Cuándo NO aplica
- Cambios solo dentro del contenido de un archivo (no se mueve, no se renombra). Cache se invalida correctamente.
- Cambios en `components/`, `lib/`, `public/`, configs. No afectan el árbol de rutas.

### Acción derivada
- [ ] Considerar agregar a `package.json` un script `clean` (`rm -rf .next`) para que sea más fácil de invocar.
- [ ] Documentar en el skill `/feature` (Step 7 — Testing manual): "Si moviste páginas o cambiaste rutas, `rm -rf .next` antes de validar tipos."

---

## 2026-05-28 — `generateStaticParams` (build time) NO puede usar el cliente Supabase cookie-aware

**Categoría**: Código
**Confianza**: 🟢 Alta (validado con error explícito + fix verificado)

### Qué funcionó (después del bug)
Separar el cliente Supabase en dos: `lib/supabase/server.ts` (cookie-aware, para Server Components que SÍ tienen request scope: Page, generateMetadata, server actions) y `lib/supabase/static.ts` (sin cookies, para contextos sin request: `generateStaticParams`, `sitemap.ts`, `robots.ts`, scripts standalone).

### Por qué funcionó (causa real)
En Next.js 15 App Router:
- **Page Component** y **`generateMetadata`** corren dentro de un request scope cuando se invocan en runtime → tienen acceso a `cookies()`.
- **`generateStaticParams`**, `sitemap.ts`, `robots.ts` corren en **build time o cuando ISR revalida**, no hay request scope → llamar a `cookies()` lanza `Error: cookies was called outside a request scope`.

`@supabase/ssr` `createServerClient` requiere callbacks de cookies. Si el contexto no tiene cookies disponibles, no puede instanciarse. Solución: usar `@supabase/supabase-js` `createClient` directo (sin SSR helpers) en contextos sin request scope. Solo lee con el rol `anon` desde env vars públicas.

### Evidencia
1 caso resuelto en esta sesión. Síntoma: HTTP 500 en `/anteojos-de-sol/rusty`. Stack trace apuntaba a `generateStaticParams` → `createClient` → `cookies()`. Fix immediato y página empieza a responder HTTP 200.

### Cuándo aplicar esto de nuevo
- **Toda función que genere data estática en build**: `generateStaticParams`, `app/sitemap.ts`, `app/robots.ts`, `opengraph-image.tsx`, `icon.tsx` dinámica.
- **Scripts standalone** (seed via TS, migrations programáticas, jobs cron en Edge Functions externos).
- **Cualquier código que corra fuera del servidor Next durante un request HTTP**.

### Cuándo NO aplica
- Page Components, layouts, loading/error/not-found, route handlers (api/) — esos corren en request scope, usar el cliente cookie-aware.
- `generateMetadata` cuando se invoca por una request real (Next docs lo permiten — pero conviene usar el static client si solo se accede a data pública, para evitar overhead innecesario de cookies).

### Acción derivada
- [x] `lib/supabase/static.ts` creado y documentado con JSDoc.
- [x] Usado en `app/(storefront)/anteojos-de-sol/[brand]/page.tsx` (generateStaticParams), `app/sitemap.ts`.
- [ ] Cuando se agregue otra página con generateStaticParams, usar el mismo patrón.
- [ ] Agregar nota en `ARCHITECTURE.md` (sección Supabase) cuando se documente el data layer.

---

## 2026-05-28 — El Step 2 del `/feature` (presentar plan antes de codear) atrapó un mistake de catálogo

**Categoría**: Operación
**Confianza**: 🟢 Alta (validó el valor del workflow, segundo caso de "el plan atrapó algo")

### Qué funcionó
En el Step 2 del skill `/feature` para cargar marcas, presenté un plan basado en las marcas con mejor SEO score (Rusty, Reef, Vulk, Prune, Infinit). El founder leyó el plan y **corrigió antes de tocar código**: las marcas reales son Rusty, Vulk, Reef, Mormaii y Paula Cahen D'Anvers. Si hubiera saltado directo a código, habría escrito un seed con Prune e Infinit (no en stock) y omitido Mormaii (no estaba siquiera en BRANDS.md). Cero código fue desperdiciado porque el ciclo "presentar plan → recibir corrección → ajustar plan" capturó el error en segundos.

### Por qué funcionó (causa real)
El Step 2 del `/feature` obliga a hacer explícitos los **supuestos del implementador** (qué marcas, qué scope, qué decisiones). Cuando son explícitos, el founder puede aceptar o corregir. Cuando quedan implícitos (saltarse directo a código), las decisiones se imponen al founder vía commits que ya existen y hay que rollback.

Es la misma lógica que el `[Lo que este step NO incluye]` registrado el 2026-05-27: **hacer explícitos los supuestos en planes escritos previene re-trabajo más caro después.**

### Evidencia
2 casos ahora:
1. 2026-05-27 (setup Next.js): la lista explícita "NO incluye" mantuvo el scope.
2. 2026-05-28 (catálogo marcas): el plan con marcas listadas dejó al founder corregir antes de codear.

Ambos siguen el patrón: hacer explícito en el plan permite al founder dar feedback temprano y barato.

### Cuándo aplicar esto de nuevo
- **Cualquier feature que toque catálogo, precios, copy, contenido editorial o datos del negocio**: presentar la data candidata explícita en el plan (no solo decir "voy a cargar marcas argentinas top").
- **Cualquier feature donde el asistente está infiriendo decisiones del negocio**: listar las inferencias para que el founder las vea.

### Cuándo NO aplica
- Features puramente técnicas (refactoring, fix de bug, ajuste de tsconfig) donde no hay decisiones de negocio.
- Cuando el dato candidato es obvio o ya está documentado de manera autoritativa (no inferido).

### Acción derivada
- [x] Confirmar este learning con un 2do caso → ahora con 2 casos. Subido a 🟢 Alta confianza.
- [ ] Promoverlo a regla explícita en el skill `/feature` Step 2: "Si la feature toca datos del negocio, listar los datos candidatos explícitamente en el plan, no solo describir 'voy a cargar X'."
- [ ] Replicar en `/article` (datos candidatos: ¿qué artículo, qué keyword, qué hipótesis?), `/product` (productos exactos), `/migration` (tablas y columnas exactas).

---

## 2026-05-28 — `docker exec` como fallback cuando `psql` no está instalado localmente

**Categoría**: Operación
**Confianza**: 🟢 Alta (patrón estándar, funciona out-of-the-box)

### Qué funcionó
Cuando había que ejecutar SQL ad-hoc para verificar el schema aplicado (consultas a `pg_tables`, `pg_policies`, `pg_indexes`, smoke tests con `SET ROLE anon`), descubrí que `psql` no estaba instalado en el sistema del founder. En vez de pedirle que lo instale, usé `docker exec supabase_db_optica-carballo psql -U postgres -d postgres -c "..."` — el contenedor de Supabase ya trae psql incluido, y el founder solo necesitaba Docker corriendo (que ya tenía).

### Por qué funcionó (causa real)
El contenedor Postgres oficial trae el cliente `psql` además del server. Cuando Supabase local está corriendo, ya tenés psql disponible vía `docker exec` sin instalar nada adicional. Esto es **invisible para muchos workflows** porque la gente asume que necesita instalar psql en el host, pero la mayoría de los casos pueden resolverse usando el cliente del contenedor.

### Evidencia
1 caso resuelto en esta sesión. 7 consultas SQL ejecutadas sin haber instalado psql.

### Cuándo aplicar esto de nuevo
- Smoke tests post-migración, queries de inspección de schema, role tests.
- Cualquier momento que necesite SQL ad-hoc y haya un contenedor Postgres corriendo.
- Reemplaza a instalar `postgresql-client` con brew/apt solo para esto.

### Cuándo NO aplica
- Si necesitás psql sin que haya un contenedor corriendo (ej: conectarte a una DB remota desde scripts de CI).
- Si necesitás features de psql que requieren archivos locales (`\i archivo.sql` desde el host) — `docker cp` ayuda pero suma fricción.

### Acción derivada
- [ ] En el skill `/migration` Step 9 (Verificar post-deploy), mencionar `docker exec <container> psql` como alternativa cuando psql no está instalado.

---

## 2026-05-28 — Trabajo largo en background + presentación de decisiones al founder en paralelo

**Categoría**: Operación
**Confianza**: 🔵 Hipótesis (1 caso, validar más)

### Qué funcionó
Cuando había que arrancar `supabase start` (que la primera vez descarga ~1 GB de imágenes Docker y tarda 5-10 minutos), en vez de bloquear esperando, lancé el comando con `run_in_background` y en el **mismo turno** seguí trabajando: generé el archivo de migración con `supabase migration new`, escribí el SQL completo (250 líneas), y presenté al founder un resumen estructurado de las decisiones del schema en formato tabla (qué decisión + por qué). Cuando Docker terminó (vía notificación), el plan ya estaba 80% adelantado.

### Por qué funcionó (causa real)
Las operaciones lentas no son CPU-bound del asistente — son network/IO externos. Bloquear el turno esperando es desperdicio. El patrón es **mover trabajo del founder al espacio mientras espera la máquina**: en lugar de "Docker está descargando, esperá", al founder le llega "Docker descargando + acá las 12 decisiones del schema para que revises mientras tanto". Productividad paralela.

### Evidencia
1 caso confirmado (esta sesión). Founder no quedó esperando — pudo revisar el SQL mientras la infraestructura se preparaba.

### Cuándo aplicar esto de nuevo
- **Cualquier comando que tome >30 segundos**: `supabase start`, `pnpm install` grande, builds largos, `gh repo create` con remote setup, descarga de modelos, etc.
- **Cuando el output del comando no se necesita para el siguiente paso inmediato**: lanzar en background y avanzar.

### Cuándo NO aplica
- Cuando el siguiente paso depende del resultado (no se puede paralelizar).
- Cuando el comando puede fallar de forma silenciosa: ahí conviene esperar y validar el exit code.
- Cuando un fallo en el background invalida el trabajo paralelo (ej: si Docker no arranca, escribir el SQL no fue inútil pero no se puede aplicar).

### Acción derivada
- [ ] Confirmar con 2+ casos más antes de promover a 🟢 Alta confianza.
- [ ] Si se confirma: documentar como patrón explícito en el skill `/feature` (Step 3) y `/migration` (Step 7).

---

## 2026-05-27 — `setAll` callbacks de @supabase/ssr necesitan tipado explícito con TS strict

**Categoría**: Código
**Confianza**: 🟢 Alta (afecta cualquier proyecto Next + Supabase + TS strict)

### Qué funcionó
Cuando el typecheck falló con 10 errores `implicitly has an 'any' type` en los callbacks `setAll` de `lib/supabase/server.ts` y `lib/supabase/middleware.ts`, la fix fue: importar `CookieOptions` de `@supabase/ssr`, definir un type alias local `type CookieToSet = { name: string; value: string; options: CookieOptions }` y tipar el parámetro del callback explícitamente.

### Por qué funcionó (causa real)
Las firmas de tipo en `@supabase/ssr` para las opciones de cookies usan generics flexibles que TypeScript no puede inferir desde el contexto del object literal en `cookies: { setAll(...) }`. En modo `strict: true` con `noImplicitAny`, el callback queda con parámetro `any` y el compiler lo flaggea. Es expected behavior, no un bug — `strict` es más estricto que la inferencia default.

### Evidencia
1 caso resuelto en esta sesión. Patrón repetido en server.ts y middleware.ts, idéntica solución.

### Cuándo aplicar esto de nuevo
- **Siempre que se cree un cliente Supabase server/middleware en Next.js con TS strict** (que es nuestro default).
- **Cualquier callback de librería externa** que TS no infiere con strict: usar import de tipos públicos + type alias local antes que `as any` o `// @ts-ignore`.

### Cuándo NO aplica
- Si se baja la estrictez del tsconfig (NO recomendado en este proyecto — ya fijado en ADR-001 + setup).
- Si la librería actualiza sus tipos en el futuro para mejor inferencia (`@supabase/ssr` 0.5.x todavía requiere esto).

### Acción derivada
- [x] Aplicado en `lib/supabase/server.ts` y `lib/supabase/middleware.ts`.
- [ ] Cuando se agreguen más helpers Supabase, usar el mismo patrón.

---

## 2026-05-27 — Tarball CLI = directorio dedicado + symlink, no archivos sueltos en PATH

**Categoría**: Operación
**Confianza**: 🟢 Alta (validado por el propio mensaje de error del CLI)

### Qué funcionó (después del mistake)
Cuando un CLI se distribuye como tarball con múltiples archivos (shim + binario real, o ejecutable + archivos de soporte), el patrón correcto es:
1. Extraer el tarball en `~/.local/share/<tool>/` (un dir dedicado).
2. Symlink el ejecutable principal: `ln -sf ~/.local/share/<tool>/<tool> ~/.local/bin/<tool>`.
3. NUNCA extraer en `/tmp` y mover archivos sueltos a `~/.local/bin/`.

### Por qué funcionó (causa real)
Muchos CLIs modernos (Supabase, gh CLI multi-binario, herramientas con assets, etc.) **necesitan que sus archivos cohabiten en el mismo directorio** para funcionar. Si los separás, el ejecutable pierde sus dependencias laterales.

### Evidencia
- Supabase CLI: el shim `supabase` busca `supabase-go` en el mismo directorio. Sin el segundo, falla con mensaje explícito.
- gh CLI: usa `bin/gh` + `share/gh/extensions/` — separarlos rompe extensions.
- k9s, mc, otras herramientas con configs/templates: idem.

### Cuándo aplicar esto de nuevo
- Cada vez que instalo un CLI desde tarball/zip en `~/.local/`.
- En scripts de bootstrap de máquinas nuevas.

### Cuándo NO aplica
- Binarios verdaderamente autocontenidos (Go binaries con `go install`, Rust binaries con `cargo install`).
- Cuando hay un instalador oficial (brew, apt, etc.).

### Acción derivada
- [x] Supabase CLI instalada con este patrón.
- [ ] Si vienen más CLIs (deno, gh, sb, etc.): aplicar el mismo patrón.

---

## 2026-05-27 — Founder ejecuta cosas en paralelo durante sesiones largas (segundo caso)

**Categoría**: Operación
**Confianza**: 🟡 Media (2 confirmaciones — patrón emergente)

### Qué funcionó (observación)
Mientras yo instalaba Supabase CLI y creaba el scaffold, el founder en paralelo creó `.env.local` con las credenciales reales del proyecto Supabase cloud (mtime 23:48, post-inicio de sesión). Lo detecté en el `ls` después de `pnpm build` cuando Next mencionó "Environments: .env.local".

### Por qué importa
Ya pasó dos veces:
1. Sesión 1 (validación inicial): los 15 skills ya estaban en disco aunque CURRENT_STATE.md decía que no.
2. Sesión actual: `.env.local` apareció a mitad del setup con credenciales reales.

El founder trabaja en paralelo a las acciones del asistente. **No es un problema en sí**, pero significa que el estado del disco puede cambiar entre comandos del asistente. Lección: **chequear timestamps y re-listar directorios clave cuando el resultado de un comando no coincide con la suposición previa.**

### Cuándo aplicar esto
- Antes de generar archivos importantes (ej: `.env.local`), `ls -la` primero para ver si ya existe.
- Antes de validar criterios de éxito, re-listar el dir.
- Cuando un comando da output inesperado ("Environments: .env.local" cuando no creé `.env.local`), investigar antes de seguir.

### Acción derivada
- [ ] Si se confirma 1 vez más (3 casos): incorporar al skill `/feature` como sub-tarea de Step 3: "Antes de generar archivos nuevos, re-listar el dir target para detectar cambios paralelos del founder."

---

## 2026-05-27 — Verificar pre-requisitos del entorno ANTES de aprobar el plan, no después

**Categoría**: Operación
**Confianza**: 🔵 Hipótesis (1 caso, validar más)

### Qué funcionó (parcialmente)
En el Step 2 del skill `/feature` listé los pre-requisitos del entorno (Node, pnpm, Docker, Supabase CLI) como una tabla dentro del plan. Eso fue **necesario pero no suficiente**: cuando el founder dijo "avanza" y arranqué el Step 3, la primera verificación detectó que faltaban 3 de 4 herramientas. Tuve que pausar inmediatamente, que es lo correcto, pero el founder había aprobado un plan sin saber que su entorno no estaba listo.

### Qué hubiera funcionado mejor
**Verificar los pre-requisitos en disco durante el Step 1 (Entender)**, antes de presentar el plan. Si faltan, el primer turno del flujo `/feature` debería ser: "Para esta feature necesitás X, Y, Z. Verifiqué y faltan X y Y. Antes de planear el resto, instalalos. Acá van los comandos."

### Por qué importa
Listar pre-requisitos en el plan es documentación; verificarlos antes es **fail-fast**. La diferencia es de minutos pero también de UX: el founder aprueba un plan creyendo que está listo para ejecutar, después se entera que no. Eso erosiona confianza en el sistema de planning.

### Acción derivada
- [ ] Agregar al skill `/feature` (Step 1 — Entender): "Si la feature toca herramientas del entorno (CLIs, runtimes, servicios locales), verificar su presencia en disco ANTES de pasar al Step 2."
- [ ] Considerar extender a otros skills con dependencias de entorno: `/migration` (requiere supabase CLI), `/deploy` (requiere vercel CLI o gh CLI).

### Cuándo NO aplica
- Features de solo edición de archivos existentes que no requieren tooling nuevo (texto, copy, ajustes de meta tags).

---

## 2026-05-27 — Sección explícita "Lo que este step NO incluye" en el plan previene scope creep

**Categoría**: Operación
**Confianza**: 🔵 Hipótesis (1 caso, validar más)

### Qué funcionó
En el Step 2 del skill `/feature` para el setup inicial del repo Next.js, además de listar archivos a crear/modificar, dependencias y riesgos, agregué una sección final **"Lo que este step NO incluye (explícito, para evitar scope creep)"** con 7 ítems concretos (auth flow, schema DB, integraciones MP/Resend/IA, componentes UI reales, PWA, sitemap, CI/CD). Esto fija el perímetro del trabajo y le da al founder una herramienta clara para validar si el plan está bien alcanzado o si está pidiéndome más de lo que dije.

### Por qué funcionó (causa real)
Los planes técnicos tienden a crecer durante la ejecución porque "ya que estamos" es seductor. Listar explícitamente lo que NO se hace convierte el silencio (omisiones tácitas) en compromiso (omisiones explícitas) — y le da permiso al asistente de parar cuando algo cae fuera del scope, en lugar de "aprovechar" para agregarlo. Es el mismo principio que las preconditions en contratos: "este step asume X, no resuelve Y".

### Evidencia
1 caso confirmado (esta sesión, 2026-05-27). Producto: plan del setup quedó claramente acotado a andamiaje, sin contaminarse con features que serán steps posteriores.

### Cuándo aplicar esto de nuevo
- **Siempre** en el Step 2 del skill `/feature`, sin importar el tamaño de la feature.
- En el skill `/migration` cuando se diseñe schema (qué tablas SÍ vs qué tablas NO).
- En el skill `/product` cuando se cargue producto (qué campos SÍ vs qué campos quedan para después).
- En cualquier plan que abarque múltiples sesiones.

### Cuándo NO aplica
- Features triviales de una sola sesión donde el scope es obvio (ej: cambiar un texto, ajustar un meta tag).
- Skills correctivos (`/debug`, `/onpage-optimization`) donde el scope ya viene definido por el problema.

### Acción derivada
- [ ] Confirmar este learning con 2+ casos más antes de promoverlo a 🟢 Alta confianza.
- [ ] Si se confirma 3+ veces: agregar al template del Step 2 del skill `/feature` (sección obligatoria "Lo que NO incluye").
- [ ] Considerar replicar en plantillas de otros skills mencionados.

---

## 2026-05-27 — Sesión de validación al inicio destapa desincronización de docs

**Categoría**: Operación
**Confianza**: 🔵 Hipótesis (1 caso, validar más)

### Qué funcionó
Iniciar la sesión con una **tarea de validación explícita** —listar agentes en disco, listar skills en disco, leer CLAUDE.md y CURRENT_STATE.md, y resumir— en lugar de arrancar directo a codear. El cruce entre "lo que dice la doc" y "lo que hay en disco" expuso que CURRENT_STATE.md declaraba Entrega 4 pendiente cuando ya estaba completa.

### Por qué funcionó (causa real)
La validación obliga a **comparar dos fuentes de verdad** (doc vs disco). Sin ese cruce, el asistente habría confiado en la doc y propuesto "empezar Entrega 4" — duplicando trabajo o generando confusión. Es el mismo principio que la regla "antes de recomendar desde memoria, verificá": las descripciones envejecen, el estado actual no miente.

### Evidencia
1 caso confirmado en esta sesión (2026-05-27). El founder específicamente pidió este patrón ("validá que tenés acceso a todos los archivos del sistema").

### Cuándo aplicar esto de nuevo
- Al inicio de **cualquier sesión** después de un gap de tiempo (>1 día sin tocar el proyecto).
- Cuando la sesión anterior haya generado muchos archivos nuevos.
- Antes de tomar decisiones que dependen del estado declarado en `CURRENT_STATE.md`.

### Cuándo NO aplica
- Sesiones consecutivas sin cierre (continuación inmediata): el estado en memoria de contexto basta.
- Tareas triviales aisladas que no dependen del estado del sistema.

### Acción derivada
- [ ] Considerar agregar a CLAUDE.md como regla 11: "Al iniciar sesión, además de leer CURRENT_STATE.md y MISTAKES.md, cruzar contra `ls .claude/agents/` y `ls .claude/skills/` para detectar desincronizaciones."
- [ ] Confirmar este learning con 2+ casos más antes de promoverlo a 🟢 Alta confianza.

---

# Template para agregar learnings

```markdown
## YYYY-MM-DD — [Descripción corta]

**Categoría**: Código | Producto | SEO | Conversión | IA | Contenido | Operación
**Confianza**: 🟢 Alta (3+ confirmaciones) | 🟡 Media (1-2 confirmaciones) | 🔵 Hipótesis (1 caso, validar más)

### Qué funcionó
[Descripción del approach/decisión/táctica]

### Por qué funcionó (causa real)
[Mecanismo subyacente, no solo "porque sí"]

### Evidencia
[Datos, métricas, casos concretos que validan el learning]

### Cuándo aplicar esto de nuevo
[En qué contextos/situaciones reaplicar — y cuándo NO aplica]

### Cuándo NO aplica
[Límites del learning — para no sobre-generalizar]

### Acción derivada
- [ ] Documentado en CLAUDE.md como regla permanente
- [ ] Incorporado en agente: [nombre]
- [ ] Convertido en skill: [nombre]
- [ ] Aplicado en otras áreas del proyecto
```

---

# Categorías de learnings a buscar activamente

### Código
- Patrones de componentes React que se reusan bien.
- Queries Supabase que escalan.
- Estructuras que evitan bugs típicos.

### Producto
- Combinaciones de productos que cross-sellean.
- Diseños de página que convierten.
- Flujos de checkout que funcionan.

### SEO
- Estructuras de artículo que rankean rápido.
- Tipos de internal linking que distribuyen autoridad.
- Meta tags con CTR alto.
- Patterns de schema.org que generan rich results.

### Conversión
- CTAs que convierten más.
- Posicionamientos de precio/cuotas que reducen abandono.
- Trust signals que funcionan en óptica argentina específicamente.

### IA
- Prompts robustos a injection.
- Patrones de RAG que reducen alucinaciones.
- Casos donde Haiku basta vs cuando se necesita Sonnet.

### Contenido
- Tipos de hook que mantienen atención.
- Estructuras de FAQ que generan featured snippets.
- Tonos que conectan con la audiencia argentina.

### Operación
- Procesos del sistema que reducen errores.
- Coordinaciones entre agentes que producen mejores outputs.
- Cuándo el `agent-manager` agregó más valor.

---

# Hipótesis a validar con learnings

Lista de cosas que SUPONEMOS van a funcionar (basado en mejores prácticas) pero **necesitan validación con datos reales**:

1. **Páginas de marca argentina rankearán fácil** (diff <10 según research).
2. **El lector de receta IA aumentará conversión >20%** en compras con receta.
3. **WhatsApp prominente en productos complejos** mejora conversión total.
4. **Pillar + clusters dan más autoridad** que artículos aislados.
5. **Cuotas sin interés visibles en card** aumentan add-to-cart.
6. **Reviews con foto** convierten 2x más que reviews texto solo.
7. **Asistente IA con productos del catálogo embebidos** convierte más que solo texto.
8. **E-E-A-T explícito** en artículos de salud (byline + revisor) mejora ranking.

Cada hipótesis confirmada → entrada en este archivo.
Cada hipótesis refutada → entrada en MISTAKES.md con la razón.

---

# Convertir learnings en sistema

Cuando un learning alcanza 🟢 Alta confianza (3+ confirmaciones independientes):

1. Evaluar si merece estar en CLAUDE.md como regla permanente.
2. Si afecta a un agente específico, incorporar en su prompt.
3. Si es un patrón repetible, crear un skill.
4. Aplicar proactivamente en otras áreas similares del proyecto.

---

# Reconocimientos al sistema

Cuando algo no-obvio del sistema agregó valor explícito (no las cosas básicas), se registra acá. Sirve para no romper lo que funciona.

(Vacío al inicio)

---

# Notas finales

- Este archivo se actualiza automáticamente al cerrar sesión cuando hay learnings significativos (vía hook en `settings.json`).
- También se actualiza manualmente cuando el founder o el sistema detectan algo digno de documentar.
- Si el log crece mucho y se vuelve difícil de navegar, el `agent-manager` propondrá consolidación en `/agent-review`.
