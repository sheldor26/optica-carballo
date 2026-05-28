# Skill: Weekly Review (`/review`)

## Cuándo usar esto

Una vez por semana (o post-sprint significativo). Análisis ligero del sistema mismo: documentación, decisiones, MISTAKES, LEARNINGS. **Distinto de `/agent-review`**, que es la auditoría profunda del agent-manager.

`/review` = checkup rápido (15-30 min)
`/agent-review` = análisis profundo con propuestas estructuradas (cada 2 semanas)

## Antes de arrancar

Leer:
- `MISTAKES.md` (últimas entradas)
- `LEARNINGS.md` (últimas entradas)
- `CURRENT_STATE.md`
- `CLAUDE.md`
- `DECISIONS.md` (últimos ADRs si hay nuevos)

## Proceso

### Step 1 — Leer todo

Lectura completa de los 5 archivos arriba. Tiempo estimado: 5-10 min.

### Step 2 — Analizar MISTAKES.md

Preguntas guía:
- ¿Hay errores repetidos del mismo tipo?
- ¿Hay causa raíz común entre múltiples mistakes?
- ¿Falta una regla en `CLAUDE.md` que habría prevenido esto?
- ¿Falta una validación en un agente?

### Step 3 — Analizar LEARNINGS.md

Preguntas guía:
- ¿Hay approaches que funcionaron repetidamente? (candidatos a regla permanente)
- ¿Hay un skill que se podría crear capturando un patrón que se repite?
- ¿Algún learning debería subir a regla en `CLAUDE.md`?

### Step 4 — Analizar workflow

Preguntas guía:
- ¿Se está saltando algún skill que debería usarse?
- ¿`CURRENT_STATE.md` se está actualizando correctamente al cerrar sesión?
- ¿Hay tareas que toman demasiado tiempo y se podrían sistematizar?
- ¿Hay solapamiento entre agentes? (¿dudaste cuál invocar?)
- ¿Hay tareas que NO encajan en ningún agente? (¿gap?)

### Step 5 — Producir reporte

Formato estándar:

```markdown
# Weekly Review — [Fecha]

## Patrones observados
[Lista de patrones detectados, 3-5 puntos máximo]

## Cambios propuestos

### Para CLAUDE.md
- [Texto exacto a agregar/modificar]

### Para algún agente
- [Cuál agente, qué sección, qué cambio]

### Skill nuevo a crear (si aplica)
- [Nombre + propósito]

### Decisión a registrar como ADR (si aplica)
- [Contexto + decisión + en qué archivo]

## Lo que está funcionando bien
[2-4 cosas positivas a reforzar]

## Estado del sistema
🟢 Saludable / 🟡 Requiere atención / 🔴 Problemas

## Pendientes para el próximo review
[Cosas a monitorear hasta la próxima semana]
```

### Step 6 — Pedir aprobación

**NO modificar archivos sin que el founder apruebe**. Cada cambio propuesto necesita visto bueno explícito.

### Step 7 — Aplicar cambios aprobados

Después de aprobación:
1. Aplicar cambios en archivos correspondientes.
2. Si afectó a un agente, considerar incrementar versión en `AGENT_PERFORMANCE.md`.
3. Si nació un ADR, agregarlo a `DECISIONS.md`.
4. Confirmar al founder qué se cambió.

## Diferencia con `/agent-review`

| Aspecto | `/review` | `/agent-review` |
|---------|-----------|-----------------|
| Frecuencia | Semanal | Quincenal o post-evento |
| Profundidad | Ligero (15-30 min) | Profundo (1-2 hs) |
| Quién ejecuta | El sistema con el founder | Agent Manager |
| Output | Reporte breve con propuestas | Reporte estructurado con ADRs propuestos |
| Foco | Workflow + docs | Sistema entero (agentes, métricas, gaps) |

`/review` es la versión rápida y constante.
`/agent-review` es la versión profunda y periódica.

## Reglas duras

1. **NO modificar archivos sin aprobación del founder**.
2. **NO inventar mistakes o learnings** que no estén documentados.
3. **NO proponer cambios sin evidencia** (datos, mistakes concretos, learnings concretos).
4. **NO sobre-ingenierías el sistema** con más agentes/reglas si no aportan valor real.
5. **SÍ decir "todo está bien, no hay cambios necesarios"** cuando es honestamente el caso.

## Cuando NO hace falta correr `/review`

- Semanas en las que no se trabajó en el proyecto
- Inmediatamente después de un `/agent-review` (sería redundante)
- Cuando hay un problema urgente en curso (foco en resolverlo, no en reviewar)
