# Óptica Carballo — Mistakes Log

## Qué es este archivo

Registro de errores cometidos durante el proyecto. Cada vez que algo sale mal —un bug, una decisión equivocada, una hora perdida, una integración mal hecha— se documenta acá.

El sistema lee este archivo al inicio de cada sesión para **no repetir errores conocidos**.

## Reglas

1. **Cada mistake se documenta dentro de las primeras 24 horas** de detectarlo. Si no se documenta rápido, se pierde.
2. **Se busca la causa raíz, no el síntoma**. "El deploy falló" no es la causa, es el síntoma.
3. **Cada mistake propone una regla preventiva**. Si se repite, la regla no fue clara.
4. **El `agent-manager` revisa este archivo en cada `/agent-review`** para detectar patrones (3+ del mismo tipo = patrón sistémico, no incidente aislado).
5. **No se borran entradas**. Si un mistake ya no aplica, marcar como "Mitigado" pero mantener histórico.

## Estados

- 🔴 **Abierto**: pasó, sin solución preventiva todavía.
- 🟡 **Mitigado**: regla preventiva aplicada, pero podría repetirse.
- ✅ **Cerrado**: imposible que se repita por cambio estructural.

---

# Log de mistakes

## 2026-05-27 — Nombre inventado de la regente

**Estado**: 🟡 Mitigado
**Categoría**: Sistema / IA

### Qué pasó
Durante el setup inicial del sistema, el asistente completó el nombre de la óptica regente (madre del founder) como "Mariela Carballo" sin que el founder lo hubiera mencionado. El nombre real es **María Carlota Carballo**. El error se propagó a 9 archivos antes de detectarse.

### Causa raíz
El asistente tomó un dato que NO conocía (nombre propio) y, en lugar de preguntar o marcar como `[NOMBRE]` placeholder, generó un nombre plausible. Esto es alucinación clásica: completar info faltante con plausibilidad en lugar de honestidad.

### Impacto
- Bajo en este caso (detectado antes del launch).
- Si hubiera llegado a producción: nombre incorrecto en bylines de artículos, structured data, página "Sobre nosotros", embalajes, mails transaccionales. Daño de credibilidad serio.

### Cómo se detectó
Founder leyó el documento y notó el dato falso.

### Cómo se evita en el futuro
**Regla aplicable a TODOS los agentes** y al sistema principal:

> Cuando se necesite un dato específico que no fue provisto explícitamente por el founder (nombres propios, números de matrícula, fechas concretas, direcciones, teléfonos, valores fiscales, etc.), **NUNCA inventar**. Usar siempre un placeholder explícito tipo `[NOMBRE_REGENTE]`, `[MATRÍCULA]`, `[DIRECCIÓN]` y preguntar al founder en el mismo turno.

Esto vale especialmente para:
- Nombres propios de personas
- Matrículas profesionales
- Direcciones físicas exactas
- Teléfonos / emails
- CUIT, DNI, datos fiscales
- Fechas históricas específicas (año exacto de fundación, etc.)
- Cualquier dato verificable con "fuente única de verdad" externa

### Cambios derivados
- [x] Reemplazo en los 9 archivos afectados.
- [x] Registro en MISTAKES.md (este archivo).
- [ ] Considerar agregar regla explícita a CLAUDE.md en próximo `/agent-review`.
- [ ] Considerar agregar al prompt de cada agente: "Nunca inventes datos específicos del negocio que no fueron provistos."

---

## 2026-05-27 — Pre-requisitos del entorno verificados después de aprobar el plan, no antes

**Estado**: 🟡 Mitigado
**Categoría**: Operación

### Qué pasó
El plan del setup inicial del repo Next.js (Step 2 del skill `/feature`) listó los pre-requisitos del entorno (Node, pnpm, Docker, Supabase CLI) como una tabla informativa dentro del plan, pero **no los verificó en disco antes de pedir aprobación**. El founder aprobó con "avanza", y cuando arranqué el Step 3, la primera verificación detectó que faltaban pnpm, Docker Desktop y Supabase CLI. Hubo que pausar el setup justo después de aprobar.

### Causa raíz
El skill `/feature` define en su Step 1 "Entender" una pregunta clarificadora si hay ambigüedad, pero no incluye explícitamente "verificar pre-requisitos del entorno antes de planear". El planificador tomó la lista de herramientas como **documentación dentro del plan** en lugar de **precondición chequeable**. Resultado: fail-late en vez de fail-fast.

### Impacto
- Bajo. Pausa de minutos, no de horas. Detectado dentro del mismo turno.
- Si hubiera sido un setup más largo donde se gastaban tokens haciendo cosas antes de chequear herramientas (ej: editar archivos), el costo sería mayor.

### Cómo se detectó
La primera acción del Step 3 fue `node --version; pnpm --version; docker ps; supabase --version`. Tres de cuatro fallaron con "command not found".

### Cómo se evita en el futuro
**Regla preventiva**:

Cuando una feature/setup involucra herramientas del entorno (CLIs, runtimes, daemons locales como Docker), **el Step 1 (Entender) debe verificar la presencia de esas herramientas en disco antes de pasar al Step 2 (Planear)**. Si falta alguna, el primer output al founder es la lista de instalaciones necesarias, no un plan completo.

Esto vale específicamente para:
- Skills `/feature`, `/migration`, `/deploy` y cualquier otro que toque herramientas externas.
- Cualquier setup inicial de un proyecto/módulo.

### Cambios derivados
- [x] Registro en MISTAKES.md (este archivo).
- [x] Learning correspondiente en LEARNINGS.md con la regla operativa concreta.
- [ ] Considerar editar `.claude/skills/feature.md` para agregar al Step 1 una sub-tarea: "Si la feature toca herramientas del entorno, verificar su presencia antes de planear."
- [ ] Si se repite en otro skill (`/migration`, `/deploy`): patrón sistémico, no incidente.

---

## 2026-05-27 — CURRENT_STATE.md desincronizado con estado real del repo

**Estado**: 🟡 Mitigado
**Categoría**: Sistema

### Qué pasó
CURRENT_STATE.md declaraba "Entrega 4 — Skills + settings.json" como pendiente con 14 skills por crear. En realidad, los 15 skills ya estaban en `.claude/skills/`. La sesión anterior (que generó los skills) no actualizó el archivo de estado al cerrar.

### Causa raíz
El hook de auto-actualización al cerrar sesión (previsto en Entrega 4) probablemente no estaba configurado todavía o no se ejecutó. La actualización de `CURRENT_STATE.md` quedó como acción manual y se omitió.

### Impacto
- Bajo: detectado en validación inicial de la siguiente sesión.
- Riesgo si no se detecta: trabajo duplicado (recrear skills ya existentes), confusión sobre el verdadero próximo paso, decisiones tomadas sobre estado falso.

### Cómo se detectó
Founder pidió validación explícita de visibilidad del sistema al inicio de sesión (listar agentes, skills, leer docs). El cruce entre lo que decía el doc y lo que había en disco delató la inconsistencia.

### Cómo se evita en el futuro
**Regla preventiva**:

1. **Al cerrar CADA sesión**, antes de despedirse, actualizar `CURRENT_STATE.md` con: qué se construyó, qué se decidió, problemas, próximo paso. Sin excepciones.
2. **Al ABRIR cada sesión**, cruzar lo que dice `CURRENT_STATE.md` contra el estado real del disco (`ls .claude/agents/`, `ls .claude/skills/`, etc.). Si hay desincronización, corregir el doc antes de avanzar.
3. **Verificar que `.claude/settings.json` tenga el hook de auto-actualización al cerrar sesión**. Si no existe, crearlo como prioridad.

### Cambios derivados
- [x] CURRENT_STATE.md corregido: Entrega 4 marcada como ✅ completa, próximo paso ajustado.
- [x] Registro en MISTAKES.md (este archivo).
- [ ] Verificar / crear `.claude/settings.json` con hook de cierre de sesión (acción para próxima sesión).
- [ ] Considerar agregar a CLAUDE.md regla explícita: "Al cerrar sesión, actualizar CURRENT_STATE.md siempre, incluso si la sesión fue corta o solo de validación."

---

# Template para agregar mistakes

```markdown
## YYYY-MM-DD — [Descripción corta de 1 línea]

**Estado**: 🔴/🟡/✅
**Categoría**: Código | Producto | SEO | Pagos | Logística | IA | Operación | Sistema

### Qué pasó
[Descripción detallada del error y sus consecuencias]

### Causa raíz
[Por qué pasó realmente — no el síntoma]

### Impacto
[Qué se perdió: tiempo, plata, datos, oportunidad, etc.]

### Cómo se detectó
[Qué nos hizo darnos cuenta]

### Cómo se evita en el futuro
[Regla preventiva concreta, accionable]

### Cambios derivados
- [Si afectó CLAUDE.md, DECISIONS.md, algún agente, etc., listar acá]
- [Referencia a ADR si generó decisión nueva]
```

---

# Categorías de mistakes a vigilar

Lista de tipos de error que el `agent-manager` revisa específicamente:

### Código
- Bugs por no validar input.
- Race conditions en webhooks.
- Memory leaks.
- Build failures evitables.

### Producto
- Productos publicados sin stock real.
- Productos publicados sin imágenes.
- Slugs duplicados o mal formados.
- Categorización incorrecta.

### SEO
- Title/meta description mal generados.
- Canonical mal configurado.
- 404 en URLs viejas (perdimos autoridad).
- Sitemap roto.
- Páginas sin H1 o con múltiples H1.

### Pagos
- Webhook de MP no llegó / no se procesó.
- Orden marcada como pagada sin pago real.
- Factura electrónica con datos incorrectos.
- Costo de cuotas mal calculado.

### Logística
- Envío sin tracking number cargado.
- Tiempo prometido != tiempo real.
- Producto enviado al CP equivocado.

### IA
- Output del lector de receta con error sin validación.
- Chat dando información incorrecta.
- Costo IA superior al estimado.
- Prompt injection no detectada.

### Operación
- Backup no hecho cuando correspondía.
- Variable de entorno faltante en producción.
- Decisión tomada sin consultar DECISIONS.md.
- Agente invocado para tarea que no le correspondía.

### Sistema
- CURRENT_STATE.md no se actualizó al cerrar sesión.
- Documentación desincronizada con código.
- Cambio aplicado sin pasar por agent-manager cuando correspondía.
- Skill modificado sin documentar versión nueva.

---

# Anti-patterns conocidos en e-commerce de óptica (recordatorio)

Estos NO se han cometido en este proyecto pero son típicos del rubro y vale tenerlos presente:

1. **Vender lo que no se tiene** ("consultá disponibilidad"). Mata trust.
2. **Mostrar precio en USD** o sin moneda explícita en Argentina. Confunde y genera abandono.
3. **No mostrar cuotas prominentemente**. Las cuotas son DECISIÓN en Argentina.
4. **Reviews falsas** o demasiado uniformemente positivas. Google y usuarios lo detectan.
5. **Imágenes genéricas de stock** en productos. Mata credibilidad en óptica donde el cliente compra estética.
6. **Política de devolución oculta** o complicada.
7. **No tener botón de arrepentimiento** (incumple Defensa del Consumidor).
8. **Promesas médicas sin evidencia** ("blue light protege la retina").
9. **Vender lentes recetados sin receta válida**.
10. **Auto-completar formularios** con datos del usuario sin que se entere claramente.

---

# Métricas de calidad del sistema

(Se calculan en `/agent-review`)

- **Mistakes / sesión** (tendencia debería bajar con tiempo)
- **% mistakes con regla preventiva aplicada**
- **Tiempo promedio de detección de mistake**
- **Mistakes repetidos (patrón sistémico)**

---

# Notas finales

- Este archivo NO es para criticarse. Es para no repetir errores.
- Mistakes pequeños también cuentan. Lo importante es el patrón, no el incidente.
- El acto de documentar un mistake es parte de la solución.
