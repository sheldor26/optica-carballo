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
