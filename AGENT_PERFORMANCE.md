# Óptica Carballo — Agent Performance

## Qué es este archivo

Tracker de uso, performance y evolución de cada agente del sistema. Usado por `agent-manager` para identificar:
- Agentes subutilizados (mal definidos)
- Agentes sobreutilizados (alcance demasiado amplio)
- Solapamientos
- Necesidad de versiones nuevas

## Cómo se actualiza

- **El founder o el sistema principal** apunta cuándo invoca a un agente y para qué (informal).
- **El agent-manager** consolida en este archivo en cada `/agent-review`.
- **Versiones**: cada vez que se modifica el prompt de un agente, su versión sube (1.0 → 1.1).

## Estados del agente

- 🟢 Activo y bien definido
- 🟡 Activo pero requiere revisión
- 🔴 Problemas detectados, atención inmediata
- ⚪ Definido pero no invocado todavía (early stage normal)

---

# Estado actual de cada agente

## optical-expert

- **Versión**: 1.0
- **Estado**: ⚪ Definido, sin invocaciones aún
- **Creado**: 2026-05-27
- **Última revisión**: 2026-05-27
- **Invocaciones estimadas (último período)**: 0
- **Casos de éxito**: -
- **Casos donde requirió corrección**: -
- **Notas**: Conocimiento técnico profundo cargado. Validar precisión cuando empiece a usarse en contenido real.

## seo-strategist

- **Versión**: 1.0
- **Estado**: ⚪ Definido, sin invocaciones aún
- **Creado**: 2026-05-27
- **Última revisión**: 2026-05-27
- **Invocaciones estimadas (último período)**: 0
- **Casos de éxito**: -
- **Casos donde requirió corrección**: -
- **Notas**: Keyword research del proyecto cargado en el prompt. Validar que datos sigan vigentes (Ubersuggest puede actualizar volúmenes).

## content-writer-medical

- **Versión**: 1.0
- **Estado**: ⚪ Definido, sin invocaciones aún
- **Creado**: 2026-05-27
- **Última revisión**: 2026-05-27
- **Invocaciones estimadas (último período)**: 0
- **Casos de éxito**: -
- **Casos donde requirió corrección**: -
- **Notas**: Coordinación con optical-expert para validar precisión técnica. Validar tono argentino.

## argentine-ecom

- **Versión**: 1.0
- **Estado**: ⚪ Definido, sin invocaciones aún
- **Creado**: 2026-05-27
- **Última revisión**: 2026-05-27
- **Invocaciones estimadas (último período)**: 0
- **Casos de éxito**: -
- **Casos donde requirió corrección**: -
- **Notas**: Conocimiento de MP, AFIP, Andreani cargado. Validar cuando se implemente cada integración.

## ai-features-engineer

- **Versión**: 1.0
- **Estado**: ⚪ Definido, sin invocaciones aún
- **Creado**: 2026-05-27
- **Última revisión**: 2026-05-27
- **Invocaciones estimadas (último período)**: 0
- **Casos de éxito**: -
- **Casos donde requirió corrección**: -
- **Notas**: Stack de modelos IA definido. Validar costos reales vs estimados.

## conversion-optimizer

- **Versión**: 1.0
- **Estado**: ⚪ Definido, sin invocaciones aún
- **Creado**: 2026-05-27
- **Última revisión**: 2026-05-27
- **Invocaciones estimadas (último período)**: 0
- **Casos de éxito**: -
- **Casos donde requirió corrección**: -
- **Notas**: Sin datos reales de conversión todavía. Útil desde diseño inicial de páginas críticas.

## data-analyst

- **Versión**: 1.0
- **Estado**: ⚪ Definido, sin invocaciones aún (esperado en pre-launch)
- **Creado**: 2026-05-27
- **Última revisión**: 2026-05-27
- **Invocaciones estimadas (último período)**: 0
- **Casos de éxito**: -
- **Casos donde requirió corrección**: -
- **Notas**: Empieza a ser útil cuando haya 4-8 semanas de tráfico real post-launch. Antes, sólo para definir tracking de eventos.

## agent-manager

- **Versión**: 1.0 (Versión A — Auditor Sistemático)
- **Estado**: ⚪ Definido, sin invocaciones aún
- **Creado**: 2026-05-27
- **Última revisión**: 2026-05-27
- **Invocaciones estimadas (último período)**: 0
- **Casos de éxito**: -
- **Casos donde requirió corrección**: -
- **Notas**: Reminder en memoria para evaluar migración a Versión B en septiembre 2026.

---

# Cobertura del sistema (gaps potenciales)

Revisión periódica: ¿hay tareas que se hacen seguido pero no encajan claramente en ningún agente?

## Tareas cubiertas con claridad

- Decisiones técnicas ópticas → `optical-expert`
- SEO estructural y on-page → `seo-strategist`
- Redacción larga (artículos, descripciones, categorías) → `content-writer-medical`
- Pagos, envíos, facturación → `argentine-ecom`
- Features de IA → `ai-features-engineer`
- Optimización de conversión → `conversion-optimizer`
- Análisis de datos → `data-analyst`
- Mejora del sistema → `agent-manager`

## Tareas posiblemente sin cubrir (a monitorear)

- **Branding visual / identidad gráfica**: no hay agente específico. Por ahora cae en frontend-design (skill global) y en decisiones del founder. Si se vuelve recurrente, considerar agente `brand-designer`.
- **Operaciones logísticas día a día** (impresiones de etiquetas, manejo de devoluciones): no es tarea de IA, es tarea operativa. No requiere agente.
- **Atención al cliente real (no IA)**: el WhatsApp lo maneja el equipo humano. Si se quiere asistir con IA al equipo, considerar agente `support-assistant` en V2+.
- **Compliance legal** (términos y condiciones, política de privacidad, defensa del consumidor): cae parcialmente en argentine-ecom. Si crece la complejidad, considerar agente `legal-compliance`.

---

# Métricas a empezar a trackear

Una vez que el sistema esté operando:

| Métrica | Cómo se mide | Frecuencia |
|---------|--------------|------------|
| Invocaciones por agente | Conteo manual en sesiones / log del sistema | Mensual |
| Tasa de corrección | % de outputs que el founder tuvo que rehacer | Mensual |
| Tiempo de respuesta promedio | Latencia + revisión humana | Mensual |
| Solapamientos detectados | Sesiones donde se duda qué agente invocar | Mensual |
| Versiones por agente | Cuántas iteraciones tuvo cada uno | Trimestral |

---

# Historial de cambios al sistema de agentes

| Fecha | Cambio | ADR / Justificación |
|-------|--------|---------------------|
| 2026-05-27 | Creación de 7 agentes core + agent-manager | Setup inicial del proyecto |

(Cada futuro cambio aprobado por el founder se loguea acá con referencia al ADR correspondiente)
