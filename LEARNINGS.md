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
