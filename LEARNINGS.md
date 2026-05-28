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
