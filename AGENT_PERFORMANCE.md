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

- **Versión**: 1.1
- **Estado**: ⚪ Definido, sin invocaciones aún
- **Creado**: 2026-05-27
- **Última revisión**: 2026-06-11
- **Invocaciones estimadas (último período)**: 0
- **Casos de éxito**: -
- **Casos donde requirió corrección**: -
- **Notas**: Conocimiento técnico profundo cargado. Validar precisión cuando empiece a usarse en contenido real.

## seo-strategist

- **Versión**: 1.1
- **Estado**: ⚪ Definido, sin invocaciones aún
- **Creado**: 2026-05-27
- **Última revisión**: 2026-06-11
- **Invocaciones estimadas (último período)**: 0
- **Casos de éxito**: -
- **Casos donde requirió corrección**: -
- **Notas**: Keyword research del proyecto cargado en el prompt. Validar que datos sigan vigentes (Ubersuggest puede actualizar volúmenes).

## content-writer-medical

- **Versión**: 1.1
- **Estado**: ⚪ Definido, sin invocaciones aún
- **Creado**: 2026-05-27
- **Última revisión**: 2026-06-11
- **Invocaciones estimadas (último período)**: 0
- **Casos de éxito**: -
- **Casos donde requirió corrección**: -
- **Notas**: Coordinación con optical-expert para validar precisión técnica. Validar tono argentino.

## optical-expert

- **Versión**: 1.1
- **Estado**: 🟢 Invocado con buen resultado
- **Última revisión**: 2026-06-11
- **Invocaciones estimadas (último período)**: 1+
- **Casos de éxito**: 2026-06-01 — brief técnico de los 4 defectos refractivos (miopía/hipermetropía/astigmatismo/presbicia) para validar antes de redactar. Output excelente: mecanismo óptico correcto, signos de graduación, latente vs manifiesta, regular vs irregular, mitos a desmentir, terminología AR ("vista cansada" para SEO), banderas rojas YMYL, y la sección pedida "lo más importante para ratificar" (12 puntos, 7 marcados 🩺 para firma de regente). Honestidad sobre limitaciones (multifocales, láser). Flag honesto: marcó "−6.00 / 40-45 años" como rangos de consenso a confirmar, no cifras rígidas.
- **Casos donde requirió corrección**: -
- **Notas**: Encaja perfecto en el workflow YMYL: optical-expert valida → founder ratifica → regente firma lo clínico. Brief guardado en `content/briefs/defectos-refractivos.md` como fuente de verdad para content-writer-medical.

## seo-strategist

- **Versión**: 1.1
- **Estado**: 🟢 Invocado con buen resultado
- **Última revisión**: 2026-06-11
- **Invocaciones estimadas (último período)**: 1+
- **Casos de éxito**: 2026-06-01 — diseño de roadmap de 4 clusters técnicos de lente (diseño/materiales/tratamientos/sol). Output excelente: arquitectura pillar+satélites con slugs y títulos AR, 7 puentes cross-cluster anti-canibalización, secuencia priorizada justificada (D primero por volumen+catálogo+keyword validada), y un hallazgo técnico valioso no pedido explícito: el prerequisito de agregar los clusters al `type ArticleCluster` antes de escribir (si no, breadcrumb/schema rotos). Marcó explícito qué volúmenes son estimación vs research real, y respetó regla 14 (no estimó horas sin audit).
- **Casos donde requirió corrección**: -
- **Notas**: ⚠️ Tuvo un bloqueo de I/O de herramientas en su sesión (no pudo releer SEO_STRATEGY.md) → trabajó sobre el contexto que le pasé (que era exacto y auditado). El output fue sólido igual. Para próximas invocaciones, pasarle el contexto auditado en el prompt mitiga el riesgo si el I/O falla.
- **⚠️ Caso con confabulación (2026-06-01, 2da invocación — estándar SEO master-class)**: el output ESTRATÉGICO fue excelente (estándar SEO completo, accionable). PERO con I/O fallando confabuló estado del código: dijo que `ArticleJsonLd` hace `return null` (FALSO — renderiza Article completo), citó `lib/guides`/`getGuideBySlug`/`guide.seoTitle`/`guide.excerpt` (NO existen — es `lib/content/`, `getArticle`, `title`/`description`), e inventó componentes `GuideTableOfContents`/`GuideAuthorBox`. Tuve que corregir TODO el grounding contra mi audit real antes de persistir. **Patrón confirmado (2/2 invocaciones)**: seo-strategist tiene I/O no confiable en este entorno y, cuando falla, CONFABULA contenido de archivos con seguridad. Regla: NUNCA persistir las afirmaciones del agente sobre código sin verificarlas yo contra los archivos reales. El valor del agente es la estrategia, no el estado del repo.

## argentine-ecom

- **Versión**: 1.1
- **Estado**: 🟢 Invocado con buen resultado
- **Creado**: 2026-05-27
- **Última revisión**: 2026-06-11
- **Invocaciones estimadas (último período)**: 3
- **Casos de éxito**: (3) 2026-06-08 — investigación del endpoint de alta de envío MiCorreo (`/shipping/import`) para la Fase 3. **Muy buena disciplina de confianza**: marcó explícitamente qué sabía con alta/media/baja confianza y qué había que verificar contra el manual real, en vez de inventar nombres de campos (respetó la regla "no inventar"). Recomendación de flujo (alta MANUAL desde panel, no auto al pago, por armado post-pago + cancelación incierta) acertada y bien argumentada. No tocó código (como se le pidió). El contrato exacto lo cerré yo después leyendo el PDF del manual — el agente acertó la estructura conceptual. (1) 2026-06-01 — consulta sobre extracción de cuotas de MP. Respuesta excelente: endpoint correcto (`/v1/payment_methods/installments`), distinción honesta entre lo que sabe con certeza vs lo que pidió verificar con llamada real, flagueó el riesgo legal del hardcode "3 cuotas sin interés" (Ley 24.240), recomendación de arquitectura escalonada. Cero alucinación de endpoints. (2) 2026-06-08 — paso a paso para conseguir/configurar credenciales MP Checkout Pro (crear app, TEST vs PROD, usuarios+tarjetas de prueba, webhook + signature secret, checklist de prod, gotchas argentinos cuotas/MODO/fiscal). El procedimiento de credenciales fue muy bueno y útil.
- **Casos donde requirió corrección**: 2026-06-08 — el agente intentó "auditar el código MP" pero su shell se reinició a mitad de ejecución y **alucinó el estado del codebase**: reportó rutas inexistentes (`lib/mercadopago/`, `app/api/checkout/route.ts`) y afirmó que el webhook era un "stub con `void payload` que no confirma pagos". FALSO — el código real está en `lib/mp/` y el webhook procesa pagos completos (verificado por mí con grep antes de pasarle nada al founder). Si no lo verificaba, le pasaba al founder un "heads-up" alarmante y falso. Lección: el agente NO debería afirmar estado de código tras un fallo de entorno; y el orquestador debe verificar afirmaciones de subagente sobre el código que contradicen conocimiento directo.
- **Notas**: Conocimiento de MP, AFIP, Andreani cargado. Fuerte en procedimientos/trámites de proveedores argentinos (su fortaleza real, vía web). Debilidad detectada: las herramientas de FS pueden darle output errático tras reboot → sus lecturas de archivos son menos confiables que su conocimiento de dominio. Preferir usarlo para el "cómo del trámite", y verificar localmente cualquier afirmación suya sobre el código.

## ai-features-engineer

- **Versión**: 1.1
- **Estado**: ⚪ Definido, sin invocaciones aún
- **Creado**: 2026-05-27
- **Última revisión**: 2026-06-11
- **Invocaciones estimadas (último período)**: 0
- **Casos de éxito**: -
- **Casos donde requirió corrección**: -
- **Notas**: Stack de modelos IA definido. Validar costos reales vs estimados.

## conversion-optimizer

- **Versión**: 1.1
- **Estado**: 🟢 Invocado con buen resultado
- **Creado**: 2026-05-27
- **Última revisión**: 2026-06-11
- **Invocaciones estimadas (último período)**: 1 (2026-06-11 — check de CRO del parallax en CategoriesSection, disparado por el trigger automático "superficie de venta")
- **Casos de éxito**: GO con condiciones precisas y accionables (transform puro fuera del main thread, overscan en wrapper separado del hover-scale para no pisar transforms, reduced-motion off, CLS 0) + métrica de rollback concreta (CTR home→categorías en GA4 + INP <200ms mobile). Todas las condiciones se aplicaron en la implementación.
- **Casos donde requirió corrección**: -
- **Notas**: Sin datos reales de conversión todavía. Útil desde diseño inicial de páginas críticas.

## data-analyst

- **Versión**: 1.1
- **Estado**: ⚪ Definido, sin invocaciones aún (esperado en pre-launch)
- **Creado**: 2026-05-27
- **Última revisión**: 2026-06-11
- **Invocaciones estimadas (último período)**: 0
- **Casos de éxito**: -
- **Casos donde requirió corrección**: -
- **Notas**: Empieza a ser útil cuando haya 4-8 semanas de tráfico real post-launch. Antes, sólo para definir tracking de eventos.

## agent-manager

- **Versión**: 1.1 (Versión A — Auditor Sistemático)
- **Estado**: ⚪ Definido, sin invocaciones aún
- **Creado**: 2026-05-27
- **Última revisión**: 2026-06-11
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

## nextjs-performance

- **Versión**: 1.0
- **Estado**: ⚪ Definido, sin invocaciones aún
- **Creado**: 2026-06-11
- **Última revisión**: 2026-06-11
- **Notas**: Nace del bug de los 13 días sin cache (MISTAKES 2026-06-11). Codifica los learnings de ISR/cookies, bundle y cache de imágenes. Único agente con líneas base numéricas (TTFB, First Load JS) — exigir que las defienda.

## catalog-loader

- **Versión**: 1.0
- **Estado**: ⚪ Definido, sin invocaciones aún
- **Creado**: 2026-06-11
- **Última revisión**: 2026-06-11
- **Notas**: Codifica el playbook de carga (50+ productos de historia): stock=ML, primaria=perfil, scale vs grid (regla 15), ml-item.ts, CCCP, SKU único. Cuando exista el admin UI de carga (item 3 del plan), su rol pasa a validar que el admin aplique estas reglas.

## ui-motion-designer

- **Versión**: 1.0
- **Estado**: 🟢 Invocado con buen resultado
- **Creado**: 2026-06-11
- **Última revisión**: 2026-06-11
- **Invocaciones**: 1 (2026-06-11, parallax para la home — mismo día de su creación, disparado por el trigger automático nuevo)
- **Casos de éxito**: leyó la home real con sus tools de lectura (detectó el parallax framer existente del hero), devolvió 4 direcciones con wow honesto 5-10, técnica exacta, costo en bytes y trade-offs mobile; recomendó la combinación que el founder eligió ("A través del lente" + "Ventanas con vida"). Implementación resultó 100% CSS, 0 JS, dentro del presupuesto.
- **Notas**: Pedido directo del founder ("diseños de vanguardia / animaciones / cosas espectaculares"). Presupuesto de performance grabado (CSS-first, framer solo en chunks de ruta, prefers-reduced-motion) y mapa de calor de audacia por superficie. Veto técnico de nextjs-performance; en superficies de venta manda conversion-optimizer. Su proceso "3-4 direcciones antes de codear" funcionó perfecto en el estreno.

# Historial de cambios al sistema de agentes

| Fecha | Cambio | ADR / Justificación |
|-------|--------|---------------------|
| 2026-05-27 | Creación de 7 agentes core + agent-manager | Setup inicial del proyecto |
| 2026-06-11 | **Invocación automática activada** (addendum del mismo ciclo de review — sin re-bump de versiones): (1) descripciones de 9 agentes reescritas con "USAR PROACTIVAMENTE cuando..." — es el mecanismo nativo de Claude Code para auto-delegación por matching de descripción (data-analyst queda pasivo hasta post-launch; agent-manager sigue vía /agent-review); (2) bloque "Triggers AUTOMÁTICOS" en CLAUDE.md con 7 disparadores obligatorios (link ML→catalog-loader, cambio en layout/queries→nextjs-performance antes de cerrar, texto legal→argentine-ecom antes de publicar, claim óptico→optical-expert, ruta/contenido nuevo→seo-strategist, superficie visual→ui-motion-designer+conversion-optimizer, cambio IA→ai-features-engineer+smoke). Pendiente ofrecido al founder: cron quincenal del /agent-review. | Founder 2026-06-11 ("¿hay forma de que se invoquen automáticamente?") |
| 2026-06-11 | **Creación de 3 agentes nuevos** (aprobados por el founder: "vamos con todos" + pedido propio del tercero): `nextjs-performance` (hueco con evidencia — el bug de cache de 13 días no tenía agente dueño), `catalog-loader` (playbook de carga codificado; se vuelve validador cuando exista el admin UI), `ui-motion-designer` (pedido del founder: diseños de vanguardia/animaciones — nace con presupuesto de perf innegociable y jerarquía: veto de nextjs-performance, prioridad de conversion-optimizer en superficies de venta). Total: 11 agentes. | Founder 2026-06-11 |
| 2026-06-11 | **Review completo de los 8 agentes → todos a v1.1** (pedido directo del founder). (1) **Fix sistémico de tools**: los 8 declaraban `web_search, web_fetch` (nombres inválidos) y NINGUNO podía leer archivos del repo pese a que sus instrucciones lo exigen → `Read, Grep, Glob, WebFetch, WebSearch` (solo lectura + web; sin Edit/Bash) — aprobado explícitamente por el founder. (2) **argentine-ecom**: logística Andreani→Correo único (ADR-026), marco legal de consumo verificado 2026 (garantía 1 año, Res. 424/2020 derogada, gastos devolución=vendedor, CCyC 1116.a), estado real del checkout (flag + Fase 2), regla dura de verificar normas con WebSearch. (3) **ai-features-engineer**: stack real de modelos por endpoint (Opus 4.8/Sonnet 4.6/Haiku 4.5), adaptive thinking obligatorio (budget_tokens deprecado/400), patrón fetch+tool use+Zod, features marcadas como YA implementadas, rx:smoke obligatorio. (4) **content-writer + seo-strategist + conversion-optimizer**: SIN número de matrícula (decisión founder 2026-06-09), logo logística solo Correo, flag de checkout, aclaración /marcas hub, lección ISR/cookies, ejemplos con marcas reales. (5) **optical-expert**: puntero a BRANDS.md. (6) **data-analyst**: puntero a lib/analytics/track.ts. Causa raíz del drift en MISTAKES.md 2026-06-11. |

(Cada futuro cambio aprobado por el founder se loguea acá con referencia al ADR correspondiente)
