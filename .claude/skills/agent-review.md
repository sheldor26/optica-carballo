# Skill: Agent Review (`/agent-review`)

## Cuándo usar esto

Cuando se quiere una auditoría PROFUNDA del sistema, no un checkup ligero. Frecuencia recomendada:

- **Quincenal** durante operación normal
- **Después de un MISTAKE importante** (post-mortem profundo)
- **Después de un EXPERIMENT cerrado** (analizar resultados sistémicamente)
- **Al inicio de cada nuevo período** (trimestral)
- **Cuando el founder sospecha que el sistema no está rindiendo**

## Cómo funciona

Este skill **invoca al agente `agent-manager`** y le pasa el control completo del proceso de auditoría.

El agent-manager ejecuta su proceso de 8 pasos (definido en `.claude/agents/agent-manager.md`):

1. Cargar contexto del sistema (lee todos los archivos `.md` clave)
2. Análisis cuantitativo (mistakes, learnings, métricas)
3. Análisis cualitativo (coherencia, drift de objetivo)
4. Identificar áreas de mejora (clasificadas por criticidad)
5. Producir propuestas accionables (con texto listo)
6. Producir reporte final estructurado
7. Esperar aprobación del founder
8. Aplicar cambios aprobados

## Diferencia con `/review`

| Aspecto | `/review` (Skill) | `/agent-review` (Skill que invoca al agente) |
|---------|------------------|-----------------------------------------------|
| Quién analiza | El sistema con el founder | Agent-manager (especialista) |
| Profundidad | Ligero (15-30 min) | Profundo (1-2 hs) |
| Output | Reporte breve | Reporte estructurado con propuestas formales |
| Métricas | Cualitativo principalmente | Cuantitativo + cualitativo |
| Aplicación | Manual, ad-hoc | Sistemática con templates |
| Frecuencia | Semanal | Quincenal |

## Cómo invocarlo

Cuando el founder corre `/agent-review`, el sistema:

1. Carga al agente `agent-manager` (lee su prompt completo)
2. Le pasa la instrucción: "Ejecutá tu proceso de 8 pasos. Generá el reporte completo. Esperá mi aprobación antes de aplicar cambios."
3. El agent-manager toma el control y devuelve el reporte
4. El founder revisa propuesta por propuesta
5. Aprobaciones se ejecutan automáticamente y se registran en `DECISIONS.md`

## Qué pasa después

### Si hay propuestas aprobadas:
1. Cambios se aplican a archivos correspondientes
2. Cada cambio queda registrado en `DECISIONS.md` como ADR
3. Versiones de agentes incrementan si fueron modificados (`AGENT_PERFORMANCE.md`)
4. Próximo review en 2 semanas

### Si hay propuestas rechazadas:
1. Se registran en `DECISIONS.md` como decisión explícita de NO aplicar
2. Justificación del rechazo queda documentada
3. Si vuelve a aparecer la misma propuesta en 2 reviews futuros, se eleva como discusión más profunda

### Si el sistema está saludable:
1. El reporte explícitamente dice "no hay cambios necesarios este ciclo"
2. Esto está bien y es válido. **No se inventan cambios para justificar el review**.

## Checklist pre-review

Antes de correr el skill, verificar que estos archivos están actualizados:
- [ ] `CURRENT_STATE.md` refleja el estado real
- [ ] `MISTAKES.md` tiene los errores recientes documentados
- [ ] `LEARNINGS.md` tiene los aprendizajes recientes
- [ ] `METRICS.md` tiene datos actuales (si hay)
- [ ] `EXPERIMENTS.md` tiene experimentos cerrados desde el último review

Si alguno está desactualizado, el reporte del agent-manager va a tener data parcial.

## Reglas duras

1. **El agent-manager NUNCA modifica archivos sin aprobación**. Esto es regla del agente, no negociable.
2. **El skill `/agent-review` no se corre semanalmente** — eso es lo que hace `/review`. Esto es para auditorías profundas.
3. **El founder siempre tiene la última palabra** en propuestas aprobadas/rechazadas.
4. **El agent-manager NO se auto-modifica** en Versión A. Eso es Versión B (postergada hasta septiembre 2026).
