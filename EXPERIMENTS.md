# Óptica Carballo — Experiments Log

## Qué es este archivo

Registro de todos los **experimentos significativos** del proyecto: cambios mayores, tests A/B, lanzamientos de features, modificaciones de copy importantes, ajustes de pricing, etc.

Sirve para:
- **No olvidar qué probamos**: en 6 meses, ¿probamos cambiar el CTA del checkout? Sí o no.
- **Construir intuición**: con qué hipótesis acertamos seguido y con cuáles erramos.
- **Evitar repetir experimentos**: si algo no funcionó, registrar por qué para no rehacer.
- **Entrenar al sistema**: el `agent-manager` aprende de patrones de éxito/fracaso.

## Reglas de uso

- **Un experimento se registra ANTES de empezar** (hipótesis, métrica de éxito).
- **No se modifica retroactivamente la hipótesis** para que "encaje" con los resultados.
- **Se cierra explícitamente** con conclusión: ✅ Hipótesis confirmada / ❌ Refutada / 🟡 Inconcluso.
- **Toda decisión derivada se referencia a un ADR** en DECISIONS.md.

## Estados

- 🟢 **Planificado**: definido pero no comenzado.
- 🔵 **En curso**: corriendo, midiendo.
- 🟣 **Análisis**: terminado, evaluando resultados.
- ✅ **Cerrado - Confirmado**: hipótesis validada.
- ❌ **Cerrado - Refutado**: hipótesis rechazada.
- 🟡 **Cerrado - Inconcluso**: datos insuficientes para concluir.
- ⛔ **Cancelado**: se abandonó sin terminar (registrar por qué).

---

# Template para experimentos

```markdown
## EXP-XXX — [Nombre corto del experimento]

**Fecha inicio**: YYYY-MM-DD
**Fecha cierre**: YYYY-MM-DD
**Estado**: 🟢/🔵/🟣/✅/❌/🟡/⛔
**Categoría**: SEO | Conversion | Pricing | Product | IA | Logistics | Brand

### Hipótesis
Si hacemos X, esperamos que Y mejore en Z%.

### Métricas de éxito
Métrica principal: [cuál y cuánto debe moverse]
Métricas secundarias: [otras a monitorear]
Métricas guardrail: [qué no debería empeorar]

### Diseño
- Qué cambia exactamente
- En qué páginas/usuarios
- Tamaño de muestra estimado para significancia
- Duración estimada

### Resultados
[se completa al cerrar]
- Métrica principal: valor base vs valor experimento
- Significancia estadística (p-value si aplica)
- Métricas secundarias
- Guardrails: ¿se mantuvieron en rango?

### Conclusión
- ✅ Confirmado / ❌ Refutado / 🟡 Inconcluso
- Por qué (interpretación)

### Decisión derivada
- Qué se hace ahora (rollback / rollout / iterar / archivar)
- ADR generado (si aplica): ADR-XXX

### Aprendizaje para el sistema
- Qué patrón validamos o invalidamos
- Si aplica, qué LEARNING o MISTAKE se agrega
```

---

# Backlog de experimentos a hacer

(Ordenado por impacto estimado / esfuerzo)

## Pre-launch (sin datos reales todavía)

Nada todavía — primero hay que construir y lanzar.

## Post-launch — primeras semanas

### Backlog inicial sugerido

1. **EXP-001 (futuro)** — Validar el lector de receta IA contra muestra real
   - Hipótesis: el parsing tiene >85% de precisión en recetas argentinas reales.
   - Diseño: 50 recetas reales pasadas por el sistema, validadas manualmente.
   - Pre-launch experiment técnico, no de producto.

2. **EXP-002 (futuro)** — A/B de CTA en producto: "Comprar ahora" vs "Agregar al carrito"
   - Hipótesis: "Comprar ahora" convierte más para sol simples (decisión rápida).
   - Métrica: add-to-cart rate.
   - Requiere infraestructura A/B (probable V2).

3. **EXP-003 (futuro)** — Posición del precio en página de producto
   - Hipótesis: precio + cuotas destacados arriba del título mejoran conversión vs debajo.
   - Métrica: conversion rate.

4. **EXP-004 (futuro)** — Asistente IA: invitación proactiva vs solo botón
   - Hipótesis: aparecer proactivamente tras 30s en página de producto aumenta conversaciones pero no asusta.
   - Métrica: conversaciones iniciadas / abandonos.

5. **EXP-005 (futuro)** — WhatsApp handoff: prominencia variable según categoría
   - Hipótesis: para recetados complejos, WhatsApp prominente aumenta conversión total (incluyendo handoff). Para sol simples, lo opuesto.

---

# Experimentos cerrados

(Vacío hasta tener experimentos cerrados)

---

# Patrones de aprendizaje acumulados

A medida que cerramos experimentos, el `agent-manager` consolida acá los patrones que emergen.

(Vacío en pre-launch)

## Template

```markdown
### [Patrón observado en N experimentos]

**Patrón**: [descripción]
**Evidencia**: EXP-XXX, EXP-YYY
**Implicancia**: [qué significa para el sistema]
**Aplicado en**: [qué decisión / regla cambió como resultado]
```

---

# Anti-patrones (qué NO hacer en experimentos)

Aprendido de comunidades de growth y experiencia general:

1. **No correr múltiples experimentos en el mismo flujo simultáneamente** sin diseño factorial. No se podrá atribuir el efecto.
2. **No declarar éxito antes de significancia**. Aunque la diferencia sea grande, sin tamaño de muestra suficiente puede ser ruido.
3. **No cambiar la métrica de éxito a mitad del experimento**. Eso es p-hacking.
4. **No experimentar con features críticas (checkout, pagos) sin red de seguridad** (feature flag, rollback rápido, monitoring).
5. **No experimentar en mobile y desktop a la vez sin segmentar** si el comportamiento difiere.
6. **No abandonar experimentos sin cerrarlos formalmente**. Inconcluso es un resultado válido.
7. **No correr experimentos en períodos atípicos** (Black Friday, Hot Sale, cambios de gobierno, etc.) sin tenerlo en cuenta.

---

# Calendario de experimentos sugerido por trimestre

## Q1 post-launch
Foco: validar hipótesis de tracción inicial.
- Validación técnica de features IA.
- Tests de CTAs y copy básico.
- Tracking de funnel real.

## Q2 post-launch
Foco: optimización fina.
- Tests de pricing / cuotas.
- Tests de checkout.
- Validación de WhatsApp como canal.

## Q3 post-launch
Foco: expansión.
- Nuevos clusters de contenido (validar ROI por cluster).
- Posible test de upsells / bundles.

## Q4 post-launch
Foco: escala.
- Estacionalidad (regalos, fin de año).
- Tests más sofisticados (recomendaciones personalizadas, etc.).

---

## Notas finales

Este archivo NO es para experimentos triviales ("cambié el color del botón"). Es para cambios donde **vale la pena tener registro histórico**. Para decisiones pequeñas, el commit de git ya alcanza.
