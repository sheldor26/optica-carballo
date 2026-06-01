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

## optical-expert

- **Versión**: 1.0
- **Estado**: 🟢 Invocado con buen resultado
- **Última revisión**: 2026-06-01
- **Invocaciones estimadas (último período)**: 1+
- **Casos de éxito**: 2026-06-01 — brief técnico de los 4 defectos refractivos (miopía/hipermetropía/astigmatismo/presbicia) para validar antes de redactar. Output excelente: mecanismo óptico correcto, signos de graduación, latente vs manifiesta, regular vs irregular, mitos a desmentir, terminología AR ("vista cansada" para SEO), banderas rojas YMYL, y la sección pedida "lo más importante para ratificar" (12 puntos, 7 marcados 🩺 para firma de regente). Honestidad sobre limitaciones (multifocales, láser). Flag honesto: marcó "−6.00 / 40-45 años" como rangos de consenso a confirmar, no cifras rígidas.
- **Casos donde requirió corrección**: -
- **Notas**: Encaja perfecto en el workflow YMYL: optical-expert valida → founder ratifica → regente firma lo clínico. Brief guardado en `content/briefs/defectos-refractivos.md` como fuente de verdad para content-writer-medical.

## seo-strategist

- **Versión**: 1.0
- **Estado**: 🟢 Invocado con buen resultado
- **Última revisión**: 2026-06-01
- **Invocaciones estimadas (último período)**: 1+
- **Casos de éxito**: 2026-06-01 — diseño de roadmap de 4 clusters técnicos de lente (diseño/materiales/tratamientos/sol). Output excelente: arquitectura pillar+satélites con slugs y títulos AR, 7 puentes cross-cluster anti-canibalización, secuencia priorizada justificada (D primero por volumen+catálogo+keyword validada), y un hallazgo técnico valioso no pedido explícito: el prerequisito de agregar los clusters al `type ArticleCluster` antes de escribir (si no, breadcrumb/schema rotos). Marcó explícito qué volúmenes son estimación vs research real, y respetó regla 14 (no estimó horas sin audit).
- **Casos donde requirió corrección**: -
- **Notas**: ⚠️ Tuvo un bloqueo de I/O de herramientas en su sesión (no pudo releer SEO_STRATEGY.md) → trabajó sobre el contexto que le pasé (que era exacto y auditado). El output fue sólido igual. Para próximas invocaciones, pasarle el contexto auditado en el prompt mitiga el riesgo si el I/O falla.
- **⚠️ Caso con confabulación (2026-06-01, 2da invocación — estándar SEO master-class)**: el output ESTRATÉGICO fue excelente (estándar SEO completo, accionable). PERO con I/O fallando confabuló estado del código: dijo que `ArticleJsonLd` hace `return null` (FALSO — renderiza Article completo), citó `lib/guides`/`getGuideBySlug`/`guide.seoTitle`/`guide.excerpt` (NO existen — es `lib/content/`, `getArticle`, `title`/`description`), e inventó componentes `GuideTableOfContents`/`GuideAuthorBox`. Tuve que corregir TODO el grounding contra mi audit real antes de persistir. **Patrón confirmado (2/2 invocaciones)**: seo-strategist tiene I/O no confiable en este entorno y, cuando falla, CONFABULA contenido de archivos con seguridad. Regla: NUNCA persistir las afirmaciones del agente sobre código sin verificarlas yo contra los archivos reales. El valor del agente es la estrategia, no el estado del repo.

## argentine-ecom

- **Versión**: 1.0
- **Estado**: 🟢 Invocado con buen resultado
- **Creado**: 2026-05-27
- **Última revisión**: 2026-06-01
- **Invocaciones estimadas (último período)**: 1
- **Casos de éxito**: 2026-06-01 — consulta sobre extracción de cuotas de MP. Respuesta excelente: endpoint correcto (`/v1/payment_methods/installments`), distinción honesta entre lo que sabe con certeza vs lo que pidió verificar con llamada real, flagueó el riesgo legal del hardcode "3 cuotas sin interés" (Ley 24.240), y dio recomendación de arquitectura escalonada (a/b/c) ajustada a la escala real (30-40 productos → opción config, no API). Cero alucinación de endpoints.
- **Casos donde requirió corrección**: -
- **Notas**: Conocimiento de MP, AFIP, Andreani cargado. Primera invocación real validó la calidad. El patrón "decí explícito qué no sabés con certeza" funcionó muy bien para una consulta de compliance.

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
