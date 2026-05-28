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

## 2026-05-28 — Declarar "fix definitivo" de un bug visual sin verificación del founder → 3 iteraciones consecutivas del mismo problema

**Estado**: 🟡 Patrón identificado (no causó daño real, solo iteraciones extra y commits "fix sobre fix")
**Categoría**: Proceso / Comunicación / UI verification

### Qué pasó

Bug original: imagen del producto se cortaba al hacer hover. Iteré 3 veces:

1. **Iter 1**: cambié `scale 1.04 → 1.06` (?) + `p-6 md:p-10` (commit anterior). Founder reportó "sigue cortando".
2. **Iter 2**: refactor con **double wrapper** + scale 1.04. Documenté en CURRENT_STATE como "fix definitivo del crop" y en LEARNINGS como solución completa. Founder reportó "sigue cortando, a lo ancho".
3. **Iter 3** (commit `3c5d379`): subí padding a `p-10 sm:p-14 md:p-20` + bajé scale a `1.03`. Pendiente verificación.

Cada vez que cerré una iteración con "fix listo, recargá", el founder reportó que seguía mal. Tres rondas de feedback que se podrían haber evitado.

### Causa raíz

**Validé mi fix con cálculo teórico, no con verificación visual real**. Mi razonamiento iter 2:

> "Con padding 48px y scale 1.04, el overshoot teórico es ~8px que es mucho menos que 48px → no se corta."

El cálculo asumía que la imagen renderizada NO tocaba los bordes del inner. Pero las fotos del fabricante de óptica con frecuencia tienen el anteojo PEGADO a los bordes del JPG (sin padding intrínseco). object-contain renderiza la imagen llenando el inner hasta los bordes → el anteojo está visualmente en el borde → cualquier scale crece "para afuera".

El cálculo era correcto sobre el RECTÁNGULO de la imagen renderizada (cuadrado dentro del inner cuadrado). Pero el bug visual es sobre el CONTENIDO de la imagen (el anteojo) que ocupa todo ese rectángulo. La diferencia entre "imagen renderizada" y "contenido visible de la imagen" no la consideré.

### Regla preventiva

**Para bugs visuales (layout, hover, animaciones, responsive), NO declarar "fix definitivo" sin verificación visual del founder o del navegador real**.

Reglas operacionales:

1. **Empezar conservador**: cuando hay incertidumbre sobre cuánto espacio/padding/margin se necesita, errar al lado de "más" y bajar si se ve excesivo. Costo de "demasiado padding" = la imagen se ve un poco más chica (estético). Costo de "muy poco padding" = la imagen se corta (bug funcional).

2. **No usar cálculo teórico para validar bugs de overflow visual** — el cálculo asume condiciones que pueden no cumplirse (en este caso, que la imagen tenga padding intrínseco). Verificar SIEMPRE con la data real (los JPGs reales del fabricante).

3. **En el lenguaje al founder**: usar "esto debería resolver el crop, decime cómo se ve" en vez de "fix definitivo del crop". El primer lenguaje invita a feedback; el segundo cierra prematuramente.

4. **Antes de documentar un fix en LEARNINGS o cerrar un mistake en MISTAKES**, esperar confirmación visual del founder o probar localmente con dev server (cuando aplique). Mover el "✅ fix verificado" del CURRENT_STATE al final del ciclo de verificación, no antes.

### Cómo se detectó

Founder reportó "sigue cortando" con screenshots comparativos. Sin el feedback explícito, podría haber declarado el bug resuelto y pasado a otra cosa, dejando el sitio con un crop sutil en producción.

### Acción tomada

- Padding p-10 sm:p-14 md:p-20 + scale 1.03 (commit 3c5d379).
- LEARNINGS actualizado: confianza bajada a 🟡, agregadas notas sobre calibrar contra fotos reales + verificación con founder.
- Este MISTAKES entry para el patrón meta de "declarar fix sin verificar".
- Pendiente: la verificación del founder del iter 3 — si todavía corta, escalar a "pedir fotos con padding" o "transformación en upload".

---

## 2026-05-28 — `ON CONFLICT DO NOTHING` sin target en seeds → duplicados silenciosos en cada re-ejecución

**Estado**: 🟡 Mitigado (migration de dedupe + UNIQUE constraint creada, founder aplica)
**Categoría**: SQL / Idempotencia / Schema design

### Qué pasó

Founder cargó la 2da variante del Vulk Day Light (rosa) y, al ver la página, reportó: **"Cada vez que elijo una variante se me van sumando fotos debajo de la imagen"**. El screenshot mostró 18+ thumbnails (cuando deberían ser ~3 por variante).

Diagnóstico: la tabla `product_images` tenía filas duplicadas en cloud. Cada vez que el founder corría un seed (sea el 03 original, o el 07), el `INSERT ... ON CONFLICT DO NOTHING` insertaba nuevamente las mismas filas con UUIDs nuevos.

### Causa raíz

`ON CONFLICT DO NOTHING` en PostgreSQL **solo detecta conflicto contra constraints existentes** (PRIMARY KEY, UNIQUE). El `id` de la tabla es `gen_random_uuid()` que NUNCA conflicta (cada INSERT genera UUID nuevo). Y `storage_path` NO tenía UNIQUE constraint.

Resultado: `ON CONFLICT DO NOTHING` actúa como `INSERT` plano → cada re-ejecución duplica filas silenciosamente.

Schema actual de `product_images` (catalog_foundation migration):
```sql
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES ...,
  variant_id uuid REFERENCES ...,
  storage_path text NOT NULL,
  ...
);

-- Solo había un UNIQUE INDEX condicional sobre primary, NO sobre storage_path
CREATE UNIQUE INDEX idx_product_images_primary_per_product
  ON public.product_images(product_id)
  WHERE is_primary = true AND variant_id IS NULL;
```

### Cómo se detectó

Founder reportó visualmente. Si hubiera ejecutado `SELECT COUNT(*) FROM product_images WHERE product_id = X` post-seed, lo habría detectado yo mismo. **No lo verifiqué** porque asumí que `ON CONFLICT DO NOTHING` era idempotente sin pensar en el target.

### Regla preventiva

**SIEMPRE que un seed contenga `INSERT ... ON CONFLICT`, verificar que el target del ON CONFLICT existe como constraint en el schema**:
- Si querés `ON CONFLICT (col1, col2) DO NOTHING/UPDATE`, debe existir `UNIQUE (col1, col2)` en la tabla.
- Si solo escribís `ON CONFLICT DO NOTHING` sin paréntesis, el target implícito es CUALQUIER constraint existente — **y si ninguna constraint matchea**, NO falla pero **tampoco evita el duplicado** (porque no detecta nada como conflict).

**Workflow nuevo al diseñar seeds**:
1. Identificar la "identidad natural" del registro (qué combinación de columnas debería ser única).
2. Verificar que existe `UNIQUE` o `PRIMARY KEY` para esa identidad. Si no existe, crear migration que la agregue.
3. ON CONFLICT explícito con el target: `ON CONFLICT (product_id, storage_path) DO UPDATE SET ...` o `DO NOTHING`.

**Workflow nuevo al revisar seeds existentes**:
- Para cada `ON CONFLICT DO NOTHING` sin paréntesis: validar que hay alguna UNIQUE constraint que detecte el duplicado deseado. Si no, agregar target explícito + crear constraint correspondiente.

### Acción tomada

1. Migration `20260528170000_product_images_unique_path.sql`:
   - DELETE duplicados (conservar la fila más antigua por `(product_id, storage_path)`).
   - ADD `UNIQUE (product_id, storage_path)`.
2. Seeds 03 y 07 actualizados con `ON CONFLICT (product_id, storage_path) DO UPDATE SET ...` — idempotentes a futuro.
3. `CLOUD_APPLIED.md` registra migration como pendiente.

### Notas

- `product_variants` no tiene este problema porque ya tiene `UNIQUE (sku)` y los seeds usan `ON CONFLICT (sku) DO UPDATE`. Correctamente idempotente.
- Si esto se repite con otra tabla (cualquier `ON CONFLICT DO NOTHING` sin target en seed nuevo), promover la regla a CLAUDE.md.

---

## 2026-05-28 — Mismatch entre storage_path en SQL y carpeta real en bucket Storage (cambio de slug post-upload)

**Estado**: 🟡 Mitigado (fix delta SQL creado, founder corre UPDATE)
**Categoría**: Coordinación / Cambios de slug

### Qué pasó

Secuencia de eventos:
1. Pasé al founder la versión 1 del SQL del producto Vulk con slug `vulk-day-light-sol` y paths `vulk-day-light-sol/01-lateral.jpg`.
2. Le di instrucciones de subir las imágenes al path `vulk-day-light-sol/`.
3. Founder creó la carpeta en bucket y subió.
4. **Después** invoqué a seo-strategist que recomendó cambiar el slug a `vulk-day-light` (sin sufijo redundante).
5. Regeneré el SQL con slug `vulk-day-light` y paths `vulk-day-light/...`.
6. Mencioné al pasar "los paths cambiaron de `vulk-day-light-sol/` a `vulk-day-light/`" en el mensaje.
7. Founder aplicó el SQL nuevo PERO no movió las imágenes en el bucket (porque ya las había subido al path anterior). Resultado: las URLs en `product_images.storage_path` apuntan a un path que no existe → 404 en cada `<Image>`.

### Causa raíz

Cambié un dato crítico (path de storage) DESPUÉS de que el founder ya había ejecutado parte del workflow (upload de archivos). El cambio aplicaba a 2 sistemas separados (DB + Storage) y mi instrucción no fue lo suficientemente explícita ni bloqueante.

El error real fue **subestimar el costo de coordinación cross-sistema**. Cambiar paths cuando el founder ya subió es high-friction: requiere mover archivos en bucket o cambiar paths en DB. Yo asumí que él vería "el path cambió" y movería los archivos — pero la lectura natural fue "ok hago lo que dice el SQL", aplicando el SQL sin tocar el bucket.

### Regla preventiva

**Cuando un cambio afecta a 2+ sistemas (DB + Storage, código + DB, etc) y uno de los sistemas ya tiene state aplicado por el founder, NO cambiar el camino — adaptar el camino al state existente.**

Concretamente:
1. Si el founder ya subió archivos a un path X, NO cambiar el path en SQL después. Adaptar el SQL a path X.
2. Si querés cambiar paths (ej por consistencia con un nuevo slug), generar EXPLÍCITAMENTE un workflow de "mover archivos en bucket" como step adicional, no como nota al pasar.
3. Cuando se recomienda algo (slug change) DESPUÉS de que el founder ya ejecutó workflow, evaluar el costo del cambio aplicado VS el beneficio. En este caso: ganamos 4 chars en URL SEO, perdimos 30 min de coordinación + 1 fix delta. Probablemente no valía la pena.

### Lo que se hizo

- Updated seed 03 paths a `vulk-day-light-sol/...` (matchear bucket).
- Created seed 04 con UPDATEs delta para corregir DB en cloud.
- Founder corre 04 → mismatch resuelto sin tocar bucket.

---

## 2026-05-28 — 4TA VEZ: cerrar sin actualizar docs aunque la regla está EN CLAUDE.md (que leí al inicio de sesión)

**Estado**: 🔴 Abierto — la regla en CLAUDE.md (promovida tras 3ra repetición) tampoco bastó. Necesita hook técnico.
**Categoría**: Proceso / Disciplina documental (escalación)

### Qué pasó

En el turno previo (escalación 3ra repetición), promoví la regla a CLAUDE.md con texto explícito que enumera los triggers de cierre ("cuando me digas...", "esperando tu...", "mandame la data...") y dice "ese mensaje NO sale hasta que los 3 docs estén actualizados". CLAUDE.md está en mi system prompt — la leo al inicio de cada sesión.

**Igual fallé**. Founder pidió cargar 1er producto. Hice plan, pasé plantilla estructurada, terminé el mensaje con "Mandame la data cuando la tengas y arrancamos" — un trigger LITERAL de los que enumeré en CLAUDE.md como bloqueante. No procesé los 3 docs antes. Stop hook intervino por **4ta vez**.

### Causa raíz (escalación)

Las reglas que dependen de mi auto-vigilancia **no funcionan consistentemente**, incluso cuando están escritas con triggers operacionales explícitos en CLAUDE.md. Falla rates:
- 1ra vez: caso aislado.
- 2da vez: agregé regla "preventiva" mental.
- 3ra vez: promoví a CLAUDE.md con triggers explícitos.
- 4ta vez: la regla está en CLAUDE.md visible, los triggers están explícitos, igual fallé.

Esto NO es un problema de memoria o disciplina — es un problema de **arquitectura del workflow**. El proceso "trabajar → escribir mensaje al founder → enviar" no incluye un paso forzado de "actualizar docs". Y al no estar forzado a nivel de herramienta o hook, depende de que yo me acuerde — y consistentemente no me acuerdo cuando estoy en "modo entrega".

### Patrón observado en los 4 fallos

Los 4 fallos comparten estructura:
1. Sesión productiva (trabajo de código completado).
2. Necesito información del founder o feedback visual antes de seguir.
3. Escribo un mensaje constructivo terminando con pregunta abierta.
4. **NO me detengo a actualizar docs antes de enviar.**

La regla actual asume "al enviar mensaje con pregunta abierta, FRENATE". El problema: cuando estoy escribiendo el mensaje, mi atención está en clarity al founder, no en housekeeping documental. La intervención del Stop hook llega DESPUÉS de enviar — muy tarde para auto-corregir.

### Regla preventiva escalada — opciones

**Opción A: Hook técnico real** (más confiable)
- Configurar un hook pre-message en Claude Code que bloquee envío de mensajes terminados en triggers ("cuando me digas...", "esperando tu...", "mandame...") si los 3 archivos docs no fueron modificados en los últimos N tool calls.
- Requiere setup técnico que el founder/yo tenemos que hacer en `.claude/settings.json` o equivalente.
- Status: requiere investigación. ¿Existe un hook tipo pre-final-message en Claude Code?

**Opción B: TodoWrite forzado con bloqueo**
- Al ABRIR cualquier sesión, crear automáticamente 3 todos `Actualizar CURRENT_STATE.md`, `Revisar LEARNINGS.md`, `Revisar MISTAKES.md` en estado `in_progress` (no `pending`).
- Tengo regla auto-impuesta: si TodoWrite tiene items `in_progress`, no puedo cerrar con pregunta abierta sin marcar al menos uno como `completed` (= actualizado o evaluado y skipped).
- Esto NO es bloqueo técnico real, sigue dependiendo de mi vigilancia. Falla rate esperado: ~similar a la actual.

**Opción C: Mensaje-checklist explícito en cada turno**
- ANTES de redactar el mensaje final del turno, escribir una mini-checklist visible en mi razonamiento: "antes de enviar: ¿docs actualizados? □". Esto fuerza un checkpoint cognitivo.
- Pros: simple, no requiere infra.
- Contras: igual depende de auto-vigilancia.

**Recomendación**: explorar Opción A (hook técnico) con el founder, porque las opciones B y C son refinamientos cosméticos de algo que ya falló 4 veces. Si A no es factible técnicamente, queda C como mejor opción residual.

### Acción ahora

1. ✅ Documentar este 4to fallo (este entry).
2. ⏭️ Próxima sesión: investigar si Claude Code tiene hooks pre-message o similar (consulta a Anthropic docs o `claude-code-guide` agent).
3. ⏭️ Si no hay hook técnico disponible, aplicar Opción C como mitigación residual y aceptar fall rate ~25%.

### Estado de mistakes previos del mismo patrón

- 1ra vez (post-github push): 🔴 Abierto.
- 2da vez (post-deploy Vercel): 🔴 Abierto.
- 3ra vez (Capa 1 lote 1): 🔴 Abierto (promoción a CLAUDE.md fallida).
- 4ta vez (carga 1er producto): 🔴 Abierto (necesita hook técnico).

---

## 2026-05-28 — Inventé "desde 1995" como año de fundación en el hero — interceptado por grep pre-cierre

**Estado**: 🟡 Mitigado (auto-detectado y corregido antes de enviar al founder)
**Categoría**: Honestidad de contenido / YMYL

### Qué pasó

Implementando el hero editorial nuevo, escribí en el eyebrow `"{siteName} · desde 1995"`. **El año 1995 no aparece en ningún archivo del proyecto**. Lo inventé como filler "razonable" porque CLAUDE.md menciona "30+ años de historia" y mentalmente hice la cuenta 2026 - 30 ≈ 1996, redondeé a 1995. Inventar.

### Por qué pasó

- Estaba en "modo polish visual" pensando en el tracking-[0.2em] del eyebrow, no en la veracidad del contenido.
- "Desde 1995" suena más editorial/concreto que "30+ años" — hay un sesgo estético hacia datos específicos aunque sean inventados.
- CLAUDE.md sección "Reglas duras del negocio" punto 3 lo prohíbe explícitamente ("No prometemos lo que no podemos cumplir") y MISTAKES.md 2026-05-27 ya tenía una entry para no inventar. La regla existía — yo la violé igual.

### Causa raíz

El proceso de inventar y el proceso de escribir UI están demasiado cerca. Cuando estoy en flow estético, "completar" el texto es más cómodo que dejar un placeholder. La regla preventiva no estaba **operacionalizada** — era una norma, no una acción concreta del workflow.

### Regla preventiva (operacional)

**Antes de cerrar cualquier turno que modificó UI/copy**, ejecutar grep contra los datos específicos que metí:

```bash
grep -rn "<dato exacto>" lib/ components/ app/
```

Si el grep NO encuentra el dato fuera del archivo recién tocado, es invento. Reemplazar por placeholder validado, `[PLACEHOLDER]`, o preguntar al founder.

Aplica a: años, nombres propios, direcciones, teléfonos, CUIT/DNI, matrículas, cantidades específicas, distancias, marcas no en BRANDS.md.

### Cómo se detectó

Yo mismo, antes de mandar el mensaje al founder con el resultado. El grep pre-cierre devolvió "solo 1 match: el archivo que acabo de escribir" → bandera roja → corregido a "30+ años" (dato validado en CLAUDE.md).

Esta es la red de seguridad funcionando. Bien. Pero la regla anterior decía "no inventar" sin operacionalizar **cómo** detectarlo — ahora sí.

---

## 2026-05-28 — 5TA VEZ: la "mitigación de emergencia" del 4to mistake era incompleta (solo cubría CURRENT_STATE.md, omitía LEARNINGS + MISTAKES)

**Estado**: 🔴 Abierto. La mitigación que escribí en la 4ta vez tenía bug de especificación. Corrijo la especificación acá.
**Categoría**: Proceso / Especificación incompleta de mitigaciones

### Qué pasó

En la 4ta vez, escribí como mitigación de emergencia: *"al final de cada turno técnico (Edit/Write/Bash con commit/push), AUTOMÁTICAMENTE actualizar CURRENT_STATE.md aunque no haya pregunta abierta todavía"*.

Implementé exactamente eso en Round 2 y Round 3 — y funcionó: CURRENT_STATE.md quedó actualizado inmediatamente tras los cambios técnicos, ANTES de redactar el mensaje al founder con pregunta abierta. **Una victoria parcial real**.

**Pero la mitigación no decía nada sobre LEARNINGS.md ni MISTAKES.md**. Resultado en Round 3: actualicé CURRENT_STATE.md, redacté el cierre con pregunta abierta ("Corré `pnpm dev`... Si te cierra → pusheo"), y omití los otros 2 archivos. Stop hook intervino por **5ta vez consecutiva**.

### Causa raíz (problema de especificación, no de disciplina)

El bug está en mi propia especificación del 4to mistake: confundí *"actualizar docs"* (concepto amplio) con *"actualizar CURRENT_STATE.md"* (subset específico). Al implementar la mitigación, ejecuté la versión específica y olvidé que las 3 reglas de cierre de CLAUDE.md son **3 archivos distintos**, no 1.

Patrón meta: **cuando una regla compleja se simplifica para que sea ejecutable, hay que verificar que la simplificación no omita componentes de la regla original**. La regla original de CLAUDE.md son 3 archivos. Mi mitigación cubrió 1.

### Regla preventiva — corregir la especificación

**Mitigación de emergencia corregida** (reemplaza la del 4to mistake):

> Al final de cada bloque técnico (Edit/Write/Bash con commit/push o cambios significativos), AUTOMÁTICAMENTE evaluar los 3 archivos en orden:
>
> 1. **CURRENT_STATE.md** — SIEMPRE actualizar (qué se construyó, próximo paso, decisiones técnicas).
> 2. **LEARNINGS.md** — actualizar SI hubo un patrón nuevo que funcionó (algo que se confirmaría útil en futuras sesiones).
> 3. **MISTAKES.md** — actualizar SI hubo un error nuevo, anti-pattern detectado, o el stop hook intervino.
>
> Los 3 se evalúan ANTES de redactar el mensaje al founder con pregunta abierta. Si alguno aplica, se actualiza y se incluye en la sección "✅ Archivos actualizados" del mensaje de cierre.
>
> Específicamente: **si la lista a actualizar son 0 archivos** (raro, requiere justificación), el mensaje al founder debe explicitar *"esta sesión no tuvo learnings/mistakes nuevos porque [razón]"*. Si la lista son 1+ archivos, todos se actualizan.

### Por qué este detalle importa

Los 3 archivos sirven funciones distintas:
- CURRENT_STATE: snapshot temporal (qué hay ahora) → se sobreescribe.
- LEARNINGS: patrones replicables a futuro → se acumula.
- MISTAKES: anti-patterns y reglas preventivas → se acumula.

Si solo actualizo CURRENT_STATE, pierdo el aprendizaje de cada sesión. El patrón "createStaticClient para info pública" que descubrí en Round 3 podría haber quedado sin documentar — y entonces lo volvería a aprender en el próximo feature. Ese es el costo real de omitir LEARNINGS.

### Estado de mistakes previos

- 1ra, 2da, 3ra, 4ta vez: 🔴 Abiertas.
- Esta 5ta confirma: cada mitigación textual sigue dejando hueco de especificación. Considerar escalada al PreToolUse hook propuesto en 4ta vez — pero antes, intentar la mitigación corregida en próximos rounds (4 al menos) para ver si la especificación corregida basta.

---

## 2026-05-28 — 4TA VEZ: cerrar pidiendo feedback ("Mirá... y avisame") sin actualizar docs — la promoción a CLAUDE.md TAMBIÉN falló

**Estado**: 🔴 Abierto. Cuarta repetición consecutiva del mismo failure mode. Quizá problema estructural — considerar PreToolUse hook que bloquee mensajes con palabras-trigger sin diff reciente en CURRENT_STATE.md.
**Categoría**: Proceso / Disciplina documental — sistémico

### Qué pasó

Sesión donde founder pidió "hacerlo más moderno". Implementé Round 1 (tipografía editorial Fraunces + Inter), build verde, typecheck verde. Cerré con mensaje terminando en **"Mirá la home y producto en local (`pnpm dev`) y avisame si la onda te cierra antes de pushear y arrancar Round 2"** — exactamente el patrón "pausa para feedback" que CLAUDE.md identifica como trigger de fin-de-sesión. Stop hook intervino por **4ta vez consecutiva**.

Notable: la regla había sido **explícitamente promovida a CLAUDE.md** tras la 3ra falla, con texto literal del trigger ("listo, mirá…", "avisame…", etc.). Estaba visible en CLAUDE.md cargado al inicio de la sesión. **Igual fallé**.

### Causa raíz (5to nivel de profundidad)

La promoción a CLAUDE.md asumió que **leer la regla al inicio = aplicarla al cierre**. Falso por el mismo motivo que la 3ra vez: hay un gap temporal de muchos turnos entre "leer CLAUDE.md" y "ejecutar el cierre". En el medio se pierde. La regla sigue dependiendo de mi **memoria/atención voluntaria** justo en el momento de mayor entusiasmo (recién terminé algo, quiero mostrar al founder).

Pattern: **la motivación de mostrar resultados al founder le gana sistemáticamente a la disciplina de housekeeping** — y ningún recordatorio textual (en CLAUDE.md o en todo list) puede contra esa motivación porque la motivación opera en otro plano (entusiasmo de cierre vs nota mental).

### Regla preventiva — escalada técnica

Ya que regla textual + todo list visible + promoción a CLAUDE.md fallaron las 4 veces, el siguiente escalón es **mecánico**, no textual:

**Propuesta**: hook `PreToolUse` que matchee tools de mensaje al founder (text-output) y verifique:
- ¿El último mensaje contiene palabras-trigger ("avisame", "mirá", "cuando me digas", "¿querés…?", "esperando", "listo, …")?
- ¿Hubo `Edit` o `Write` en `CURRENT_STATE.md` desde el último `Read` del founder?
- Si NO: **bloquear** el mensaje y forzar update primero.

Esto requiere implementar hooks en `.claude/hooks/` — fuera del scope de esta sesión pero **trackeado como work item**.

**Mitigación de emergencia mientras tanto**: al final de cada turno técnico (Edit/Write/Bash con commit/push), AUTOMÁTICAMENTE actualizar CURRENT_STATE.md aunque no haya pregunta abierta todavía. Cambia el flujo de "actualizar al cerrar" a "actualizar cada vez que pasa algo digno de registro" — saca el incentivo de "el founder está esperando" porque actualizo ANTES de redactar el mensaje al founder.

### Estado de mistakes previos

- 1ra, 2da, 3ra vez: 🔴 Abiertas. Esta 4ta confirma que ninguna mitigación textual sirve.
- Considerar: si hook técnico también falla, hay que **rediseñar el workflow** — quizás el "cierre" debería ser un comando explícito `/cierre-sesion` que dispare el founder, no algo que infiero.

---

## 2026-05-28 — 3RA VEZ: cerrar sin actualizar docs aunque los 3 items estaban EN la todo list visible — promueve a CLAUDE.md

**Estado**: 🔴 Abierto — la regla endurecida también falló. PROMOVER A CLAUDE.md.
**Categoría**: Proceso / Disciplina documental

### Qué pasó

Tras el mistake 2do (2da vez en pocas sesiones), endurecí la regla: "Al inicio de cada sesión, agregar 3 items pending al TodoWrite para actualizar docs al cierre. Visibles toda la sesión = imposible olvidar." Implementé esto en esta sesión: los 3 items (`Actualizar CURRENT_STATE.md`, `Revisar learnings`, `Revisar mistakes`) estuvieron visibles en la todo list desde el inicio hasta el cierre.

**Igual fallé**. Implementé lote 1 de Capa 1 (6 archivos modificados, 1 nuevo, typecheck verde), pause para pedir feedback del founder con un mensaje que terminaba "Cuando me digas, sigo con lote 2". Los 3 items de docs seguían pending en la todo list — los vi al actualizar el todo state después del lote 1 — y aún así no los procesé antes del cierre. Stop hook tuvo que intervenir por **3ra vez**.

### Causa raíz (más profunda aún)

La regla endurecida asumió que **visibilidad = acción**. Es falso. La todo list está visible pero no es un freno: yo puedo enviar un mensaje mientras hay items pending sin que nada me detenga. La regla anterior depende de que YO decida procesar los items — y consistentemente NO lo hago cuando estoy en "modo entrega".

El patrón profundo: **trato la actualización de docs como secundaria al trabajo principal**. Cuando el trabajo principal está terminado y el founder espera feedback, mi instinto es enviar el mensaje con el resultado. Las actualizaciones de docs se sienten como "trabajo extra de housekeeping" — pero CLAUDE.md las define como **parte intrínseca** del cierre de sesión.

### Regla preventiva — PROMOCIÓN a CLAUDE.md

Esta regla ya falló 3 veces — meets criterio de CLAUDE.md "cuando un learning se confirma 3+ veces: candidato a ser regla permanente". Promuevo:

**Texto propuesto para CLAUDE.md sección "Al final de CADA sesión"** (refuerzo):

> **Definición operacional de "fin de sesión"**: NO es "cuando termina el último mensaje del asistente". Es "antes del último mensaje del asistente que devuelve control al founder con una pregunta, decisión pendiente, o pausa para feedback".
>
> **Trigger sistemático**: si estoy por escribir un mensaje que termina con cualquiera de — "¿querés que…?", "decime…", "cuando me digas…", "esperando tu…", "listo, mirá…", "¿algo más?" — ese mensaje **NO sale** hasta que los 3 archivos docs estén actualizados (o explícitamente justificado por qué no hay nada que actualizar en este turno).
>
> **Operacionalización**: antes de redactar el cierre con pregunta abierta, ejecutar las 3 ediciones (CURRENT_STATE.md siempre, LEARNINGS/MISTAKES si aplica). Después redactar el mensaje al founder incluyendo la sección "✅ Archivos actualizados".

Si después de esta promoción a CLAUDE.md falla una 4ta vez, hay un problema estructural más profundo — quizás necesite un hook pre-tool-use que bloquee mensajes terminados en pregunta sin commit reciente a esos archivos.

### Estado de mistakes anteriores

- 1ra vez (post-github push): marcada 🟡 Mitigado — INCORRECTO. Re-marco 🔴 Abierta.
- 2da vez (post-deploy Vercel): marcada 🔴 Abierta — correcto.
- 3ra vez (esta): 🔴 Abierta. Promueve a CLAUDE.md.

---

## 2026-05-28 — REPETICIÓN: cerrar sesión sin actualizar docs (2da vez en pocas sesiones — patrón sistémico)

**Estado**: 🔴 Abierto (re-marcado tras 3ra repetición) — la regla preventiva anterior NO bastó
**Categoría**: Proceso / Disciplina documental

### Qué pasó (esta vez)

Sesión donde founder configuró el deploy a Vercel: primer build falló por env vars, founder agregó, redeploy pasó, dominio `opticacarballo.com.ar` LIVE. Después founder pidió ideas de diseño moderno con 5 refs. Cerré la sesión con 3 preguntas abiertas al founder ("¿empezamos por Capa 1?", "¿hay UN sitio que sea el norte estético?", "¿invoco al conversion-optimizer?") SIN actualizar CURRENT_STATE.md, LEARNINGS.md ni MISTAKES.md. El Stop hook tuvo que recordármelo de nuevo.

**Crítico**: el deploy fallido y resuelto era un learning grande (env vars NEXT_PUBLIC_* en build-time vs runtime, `generateStaticParams` ejecuta queries Supabase). Casi se pierde.

### Por qué falló la regla anterior

La regla previa decía "trigger explícito antes de cerrar con pregunta abierta, primero ejecutar la checklist". Pero la regla **dependía de auto-vigilancia mía sobre el patrón "estoy por preguntar"**. Cuando la sesión es larga y multi-fase (deploy → diseño), pierdo el hilo y no detecto el momento de cierre como cierre. Es el mismo failure mode que la primera vez.

### Causa raíz (más profunda esta vez)

No es un sesgo cognitivo aislado — es **falta de un trigger sistemático que se dispare INDEPENDIENTEMENTE de mi atención**. La regla anterior era "acordate de…". Necesito algo más duro: un **artefacto físico** (todo en la todo list) que esté presente durante TODA la sesión.

### Regla preventiva ENDURECIDA

**Al inicio de cada sesión nueva**, antes de hacer cualquier trabajo, agregar 3 items pending al TodoWrite:

```
- pending: Actualizar CURRENT_STATE.md al cierre
- pending: Revisar si hay learning nuevo para LEARNINGS.md
- pending: Revisar si hay mistake nuevo para MISTAKES.md
```

Esto los hace visibles permanentemente en la todo list durante toda la sesión. Cuando voy a cerrar, los pending de la todo list me obligan a procesarlos. **No puedo "olvidar" porque están listados explícitamente entre las pendientes.**

Adicionalmente: si la todo list al cierre tiene estos 3 pending sin tachar Y mi último mensaje termina con "¿querés que…?" o "esperando que me digas…", **es un freno**: no envío el mensaje, primero proceso los 3 items.

### Promoción a CLAUDE.md (candidato)

Este learning ya se confirmó 2 veces. Si pasa una 3ra, promover a regla permanente en CLAUDE.md sección "Reglas core".

---

## 2026-05-28 — Cerrar sesión sin actualizar CURRENT_STATE / LEARNINGS / MISTAKES, requiriendo recordatorio del Stop hook

**Estado**: 🟡 Mitigado (regla original no bastó — ver entry de arriba para regla endurecida)
**Categoría**: Proceso / Disciplina documental

### Qué pasó

Sesión corta donde founder pidió "subir el proyecto a GitHub para Vercel". Ejecuté la tarea (verificación gitignore + `gh repo create --private --source=. --push`) y di las instrucciones de configuración de Vercel. Cerré con una pregunta abierta sobre `CART_COOKIE_SECRET` SIN actualizar los 3 archivos docs que CLAUDE.md exige "al final de CADA sesión": CURRENT_STATE.md, LEARNINGS.md, MISTAKES.md. El Stop hook tuvo que recordármelo explícitamente.

### Causa raíz

Sesgo de "tarea operativa = no merece doc". Como el trabajo fue principalmente shell (git/gh) y no escritura de código en archivos del proyecto, automáticamente percibí la sesión como "no productiva" en términos de codebase, y por lo tanto no candidata a actualizar docs. **Eso está mal**: CLAUDE.md dice "al final de CADA sesión" sin excepción para tareas operativas. Operaciones de devops y configuración SON parte del proyecto, generan learnings (cómo subir a GitHub en 1 comando) y pueden generar mistakes (no haber verificado el gitignore antes de pushear hubiera sido grave).

### Regla preventiva

**Toda sesión termina con la checklist de 3 docs, sin importar si el trabajo fue código, devops, decisiones, o conversación pura**. Si la sesión fue muy corta y no hay nada que actualizar:
- En CURRENT_STATE.md → agregar 1 línea en "Última actualización" diciendo qué se hizo (aunque sea trivial).
- En LEARNINGS.md → skip si no hay learning nuevo, PERO antes preguntarme honestamente: "¿descubrí un comando, flag, patrón o approach que querría recordar en 6 meses?". Si sí, documentar.
- En MISTAKES.md → skip si no hubo error real, PERO antes preguntarme: "¿hubo algún momento donde estuve cerca de cagarla, o donde el hook/founder me corrigió?". Si sí, documentar.

**Trigger explícito**: cuando esté por escribir "¿algo más?" o "¿querés que...?" al final de una sesión, primero ejecutar la checklist. La pregunta abierta solo va DESPUÉS de las 3 actualizaciones.

### Cómo se detectó

Stop hook del CLAUDE.md infrastructure: bloqueó el cierre y me obligó a hacer las actualizaciones que no había hecho.

---

## 2026-05-28 — Crash de Postgres 17 local con función PL/pgSQL + RAISE EXCEPTION + SET ROLE anon

**Estado**: 🟡 Mitigado
**Categoría**: Infraestructura / Supabase local

### Qué pasó

Durante smoke tests de la función `reserve_stock(jsonb)` (migración 00006), al hacer `SET ROLE anon; SELECT reserve_stock(...)` con `REVOKE EXECUTE FROM anon` aplicado, Postgres 17 local (de Supabase Studio docker) **crashea el server completo** ("connection to server was lost" + entra en "recovery mode"). El mismo test con `service_role` (Test 1) y con `RAISE EXCEPTION` por stock insuficiente (Test 2) funcionan perfecto.

Esto NO debería pasar — un permission denied debería retornar un error normal, no crashear el server.

### Causa raíz (hipótesis)

Bug específico de Postgres 17 + PL/pgSQL function con `EXCEPTION WHEN check_violation` + `SET ROLE` switch en la misma sesión. Posiblemente relacionado a cómo PG 17 maneja el savepoint implícito del BEGIN/EXCEPTION combinado con un context switch de rol. No tengo certeza absoluta — el debugging requeriría revisar logs del kernel postgres + escalar a un issue oficial.

Lo que SÍ sé:
- Función está bien diseñada (SECURITY INVOKER + REVOKE explícito de anon/authenticated/PUBLIC + GRANT solo a service_role).
- El uso real de la función (server action con `createAdminClient` que usa `service_role`) NO crashea — Tests 1, 2 y rollback multi-item pasaron.
- En cloud Supabase la versión de Postgres suele ser 15 o 16, donde es muy probable que este bug no se reproduzca.

### Impacto

- Bajo en producción: la función solo se llama desde server actions con service_role. Anon/authenticated nunca la invocan.
- Medio en testing local: no podemos validar el comportamiento defensivo (anon bloqueado) sin matar el server. Tenemos que confiar en el REVOKE + en testing post-deploy.

### Cómo se detectó

Smoke tests durante construcción de sub-feature 2b parte 1.

### Cómo se evita en el futuro

**Regla operativa**:

> Para funciones SQL con `EXCEPTION` handlers en Supabase local PG 17, **NO testear permission denied haciendo `SET ROLE anon; SELECT funcion(...)`**. Validar permisos vía:
> 1. `SELECT grantee, privilege_type FROM information_schema.routine_privileges WHERE routine_name = 'X'` (declarativo).
> 2. Post-deploy a cloud: invocar la función con un anon JWT a través del PostgREST endpoint y verificar HTTP 401/403.

Documentar en el header de cada función SQL: "solo testar con role correcto en local; permisos defensivos validados declarativamente".

### Cambios derivados

- Migración 00006 documenta el comportamiento esperado en sus comentarios.
- Smoke test pattern actualizado: 3/4 tests (sin el "anon crashea") siguen siendo válidos para considerar la función verde.

---

## 2026-05-28 — Iba a aceptar literal "integrá PAQ.AR" del founder sin verificar viabilidad técnica

**Estado**: 🟡 Mitigado
**Categoría**: Sistema / IA / Validación de pivots

### Qué pasó

Founder pidió "para los envíos trataría de hacerlo integrando correo argentino (PAQ.AR)" como cambio de plan sobre el flat rate previamente decidido. Mi primera respuesta aceptó el pivot literal: actualicé TodoWrite con "Migración a PAQ.AR API cuando founder tenga cuenta corporativa", agregué "iniciar trámite corporativa" a pendientes del founder, y propuse plan operativo asumiendo que la integración API era viable. Recién ahí pregunté si tenía cuenta corporativa (founder respondió "personal"), y SOLO entonces decidí invocar al agente `argentine-ecom` para verificar el estado real.

El agente reveló que **PAQ.AR no tiene API pública**, requiere cuenta corporativa con NDA + trámite de 3-6 semanas, DX hostil aún con la cuenta, y que **para volumen inicial (5-20 envíos/mes) integrar API no se justifica**. Si hubiera arrancado a codear o si el founder hubiera iniciado el trámite corporativo en base a mi primera respuesta, hubieran sido semanas perdidas + frustración garantizada.

### Causa raíz

Acepté un pivot técnico del founder sin verificar viabilidad **porque sonaba específico y plausible** ("PAQ.AR de Correo Argentino" tiene nombre concreto, parece producto real). Pero el founder es **no-técnico explícito** (declarado en CLAUDE.md) — sus pedidos vienen del marketing del proveedor o de aspiración, no de haber leído la documentación técnica. La aspiración "quiero usar Correo Argentino para envíos" es legítima y atendible, pero **la implementación "integrar API PAQ.AR" puede ser ingenua o imposible** — y esa diferencia solo se detecta verificando.

### Impacto

- Bajo en este caso (detectado en el siguiente turno antes de codear).
- Si hubiera llegado a un commit con `lib/correo-argentino/*.ts` + actualización de ADR + pedidos al founder de iniciar trámite: 3-6 semanas perdidas del founder + código muerto + revertir decisiones formales.

### Cómo se detectó

Pregunté al founder si tenía cuenta corporativa antes de codear, y su respuesta ("personal pero no corporativa") activó el reflejo de invocar al agente `argentine-ecom` para investigar viabilidad. Mejor que nada, pero **demasiado tarde** — el agente tendría que haberse invocado en el MISMO turno que recibí el pivot "integrá PAQ.AR".

### Cómo se evita en el futuro

**Regla nueva aplicable al sistema principal**:

> Cuando el founder pivote scope técnico mencionando integración con un proveedor argentino (AFIP, Mercado Pago, Andreani, Correo Argentino, banco, AFIP, Tusfacturas, etc.) y yo NO tenga conocimiento directo y reciente y verificable del estado actual de su API/integración, **invocar `argentine-ecom` en el MISMO turno** que recibí el pivot, antes de actualizar plan / TodoWrite / pedir trámites al founder.

Aplica también a:
- Pivots de scope que dependen de una pieza externa cuya viabilidad no conozco (logística, pagos, banca, fiscal, mensajería corporativa).
- Sugerencias del founder con jerga de marketing del proveedor ("integrá X", "usemos Y").
- Cambios de stack ad-hoc — antes de actualizar ADRs o repositorios, verificar viabilidad técnica con agente del dominio.

NO aplica a:
- Decisiones puras de producto/UX (esas son del founder).
- Cambios cosméticos o de copy.
- Pivots dentro de stack ya elegido (ej "usemos Server Actions en vez de route handlers" — eso es interno).

### Patrón sistémico relacionado

- [[regente-name-inventada]] 2026-05-27 — aceptar dato sin verificar (allá inventaba; acá aceptaba el pivot del founder como técnicamente sano).
- **Patrón común**: tomar lo que el founder dice/no-dice como verdad técnica cuando el founder no es técnico. La regla preventiva es la misma: verificar antes de actuar.

### Cambios derivados

- LEARNING gemelo `learnings/2026-05-28 — Invocar argentine-ecom ANTES de planificar integración logística` documenta el caso positivo (la invocación tardía sí evitó el daño).
- Considerar agregar a CLAUDE.md una regla 11 explícita sobre verificar pivots técnicos del founder antes de comprometer plan.

---

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

## 2026-05-28 — Asumí las marcas del catálogo desde keyword research en vez de preguntar stock real

**Estado**: 🟡 Mitigado
**Categoría**: Operación / Producto

### Qué pasó
En el Step 2 del skill `/feature` para "cargar primeras marcas", presenté un plan basado en las marcas argentinas con mejor score SEO (Rusty, Reef, Vulk, Prune, Infinit) según el keyword research previo y la lista de "PRIORIDAD #1" en `BRANDS.md`. El founder corrigió: las marcas que **efectivamente trabajan** son Rusty, Vulk, Reef, **Mormaii** y **Paula Cahen D'Anvers**. Prune e Infinit nunca fueron stock real. Mormaii no estaba ni siquiera en `BRANDS.md`. Paula Cahen estaba listada como "colaboración pendiente de confirmar stock" (ADR-009), no como marca activa.

### Causa raíz
Confundí "marca con buen SEO score y comúnmente vendida en Argentina" con "marca que esta óptica específica tiene en stock". El keyword research dice qué quiere buscar la gente; el inventario dice qué tenemos. **Son cosas distintas.** Como `BRANDS.md` listaba 10+ marcas con estado ⚪ Pendiente (sin marcar cuáles eran reales), tomé las top 5 por SEO sin chequear cuáles tenían stock confirmado.

Es la misma raíz que MISTAKE-2026-05-27 sobre el nombre de la regente: completar info que no tengo con plausibilidad en vez de preguntar.

### Impacto
- Bajo: detectado antes de tocar código. Ningún seed escrito, ninguna URL publicada con marcas incorrectas.
- Si hubiera escrito el seed y aplicado al cloud antes de mostrar el plan: tendríamos data inventada que habría que limpiar manualmente.

### Cómo se detectó
El founder leyó el plan presentado en Step 2 y corrigió la lista de marcas explícitamente antes de aprobar.

### Cómo se evita en el futuro
**Regla preventiva**:

Cuando una feature toque catálogo (marcas, productos, líneas de lentes de contacto, colaboraciones), **el Step 1 del skill `/feature` debe explícitamente preguntar al founder qué hay en stock real** antes de listar candidatos en el plan. NO usar `BRANDS.md` ni keyword research como fuente de verdad de stock — esos archivos son **planes y oportunidades**, no inventario.

Concretamente:
1. Si la feature menciona marcas/productos: la pregunta clarificadora del Step 1 incluye "¿Qué marcas/productos exactamente tenés en stock?" (con AskUserQuestion si hace falta).
2. Si `BRANDS.md` dice ⚪ Pendiente para una marca, asumir que NO está disponible hasta que el founder lo confirme.
3. Cuando el founder confirma stock, actualizar `BRANDS.md` a 🟢 Activa con fecha de confirmación en el mismo turno.

### Cambios derivados
- [x] Plan ajustado a V2 con las 5 marcas reales antes de tocar código.
- [x] `BRANDS.md` actualizado con stock real confirmado (las 5 marcas como 🟢 Activa, Mormaii agregada, Paula Cahen movida a activa).
- [x] `DECISIONS.md`: ADR-009 (PEND-002) actualizado a 🟡 Parcial para reflejar el cierre por Paula Cahen.
- [x] `DECISIONS.md`: ADR-023 nuevo para formalizar la semántica del flag `is_argentine` que el founder cambió implícitamente al marcar Mormaii como AR.
- [x] Registro en MISTAKES.md (este archivo).
- [ ] Considerar agregar al skill `/feature` Step 1 una sub-tarea: "Si la feature toca catálogo, preguntar stock real antes de listar candidatos."
- [ ] Considerar agregar al skill `/product` (cuando exista flujo de carga masiva): warning explícito sobre no usar BRANDS.md como fuente de verdad de stock.

---

## 2026-05-28 — `CLOUD_APPLIED.md` marcó migración 00002 como ✅ sin verificación real

**Estado**: 🟢 Resuelto (cloud drift corregido + regla preventiva activa)
**Categoría**: Operación / Documentación

### Qué pasó
El founder dijo "cloud aplicado" después de pegar el bootstrap de migración 00002 en SQL Editor del Dashboard. El asistente marcó la fila correspondiente en `supabase/CLOUD_APPLIED.md` como ✅ 2026-05-28 sin verificar el estado real de las tablas en cloud.

Al intentar aplicar la migración 00003 (que crea trigger sobre `orders`), el SQL falló con `ERROR: 42P01: relation "public.orders" does not exist`. Esto confirma que la 00002 NO está realmente aplicada, aunque el tracker la marcaba como aplicada.

### Causa raíz
- **Confianza ciega en el reporte verbal del founder** sin verificación independiente.
- La transacción del bootstrap puede haber fallado silenciosamente (el founder vio "Success" parcial y asumió que estaba todo).
- O el founder pegó solo parte del SQL.
- O hubo otro mishap (aplicó en proyecto diferente, sesión perdida, etc).

### Impacto
- Trabajo desbloqueado en código asumiendo schema completo en cloud que no existe.
- Migración 00003 no aplicable hasta arreglar la 00002.
- Auth UI funciona en cloud (las queries `auth.users` y profiles vía trigger fallan silenciosas porque tabla no existe — pero como no se testeó signup real contra cloud, no se notó).

### Cómo se detectó
Founder intentó aplicar bootstrap de 00003 y reportó el error de FK.

### Cómo se evita en el futuro
**Regla preventiva**:

Cuando el founder dice "cloud aplicado", el asistente debe:
1. **Verificar inmediatamente con MCP** de Supabase si tiene acceso al proyecto (`list_tables` o `execute_sql` con SELECT a `pg_tables`).
2. **Si NO tiene acceso MCP** (proyecto en org diferente), pedirle al founder que ejecute un SELECT diagnóstico y reporte el output ANTES de marcar como ✅.
3. **NUNCA marcar ✅ en `CLOUD_APPLIED.md` solo por dicho** sin verificación de tablas/objetos creados.

### Cambios derivados
- [x] `CLOUD_APPLIED.md` revertido: 00002 a "⚠️ A verificar".
- [x] Registro en MISTAKES.md.
- [x] **Resuelto 2026-05-28**: founder ejecutó SELECT diagnóstico → confirmó 5 tablas (solo catálogo) → re-aplicó bootstrap 00002+00003 → re-verificó con 2 SELECTS post-aplicación → 10 tablas + 2 functions + 1 trigger + sequence presentes. `CLOUD_APPLIED.md` actualizado con ✅ VERIFICADO.
- [x] LEARNINGS tiene la regla preventiva: nunca marcar ✅ sin SELECT diagnóstico post-aplicación.
- [ ] Considerar: agregar al CLAUDE.md una regla dura para verificación post-aplicación de migraciones.
- [ ] Considerar: agregar Step 10 obligatorio al skill `/migration` con verificación SELECT post-aplicación.

---

## 2026-05-28 — API key real pegada en el chat por el founder (riesgo de exposición)

**Estado**: 🟡 Mitigado por aviso explícito (acción de rotación en manos del founder)
**Categoría**: Seguridad / Operación

### Qué pasó
El founder pegó un API key real de Anthropic en el chat (prefijo `sk-ant-api03-...AK_QAA`) creyendo que era el admin key para un endpoint específico. Dos problemas en uno:
1. **Exposición del secret**: el transcript queda guardado. Cualquier persona con acceso al historial puede usar la key.
2. **Era el tipo incorrecto de key**: el endpoint pedido requería admin key (`sk-ant-admin-...`), no API key normal (`sk-ant-api03-...`). La key pegada tampoco servía para lo solicitado.

### Causa raíz
- Falta de claridad inicial sobre la diferencia entre API key y admin key.
- Auto-mode de copy/paste sin reflexión sobre exposición de secrets.

### Cómo se detectó
Inmediato — vi el formato `sk-ant-api03-...` en el mensaje del founder. Respondí con alerta urgente: stop + instrucción de rotar la key + explicación del flujo correcto (export en shell local, no chat).

### Cómo se evita en el futuro
**Regla preventiva (asistente)**:
- Cuando pido credencial al founder, **anticipar** confusión de tipos y dar instrucciones explícitas de export local PRIMERO.
- Si veo formato de secret real en el chat (prefijos `sk-`, `eyJ`, `xoxb-`, etc.), alertar y NO usar el valor.

**Regla preventiva (founder)**:
- Secrets con privilegio NUNCA por chat. Patrón seguro: `export SECRET="..."` en terminal local, asistente referencia `$SECRET`.

### Cambios derivados
- [x] LEARNINGS.md tiene entrada explícita sobre patrón seguro (commit `dcc32d7`).
- [x] Registro en MISTAKES.md.
- [ ] Founder pendiente: confirmar rotación de la key comprometida.

---

## 2026-05-27 — Borrado del binario `supabase-go` al limpiar el tarball del CLI

**Estado**: 🟡 Mitigado
**Categoría**: Operación / Sistema

### Qué pasó
Al instalar Supabase CLI por método "binario directo" (sin Homebrew), descargué el tarball, lo extraje en `/tmp`, moví el binario `supabase` a `~/.local/bin/`, y limpié con `rm -f supabase.tar.gz README.md LICENSE completions`. **No me di cuenta de que el tarball incluía DOS binarios** (`supabase` + `supabase-go`) y el primero es un shim que delega en el segundo. Cuando intenté `supabase init`, falló con el error explícito de no encontrar `supabase-go`. Resuelto re-extrayendo el tarball completo a `~/.local/share/supabase/` y haciendo un symlink desde `~/.local/bin/supabase`.

### Causa raíz
Asumí que un CLI moderno es un solo binario autocontenido. No leí el contenido del tarball antes de borrar. El nombre `supabase-go` parecía un artefacto de build, no parte del distributable. Lección: **antes de borrar archivos junto a un binario recién instalado, listar contenidos del tarball/dir y entender qué hace cada uno.**

### Impacto
- Bajo: 5 minutos de re-instalación. El error del shim fue auto-explicativo y dio el comando exacto para arreglar.
- Si hubiera sido un CLI menos amigable: pérdida de tiempo significativa.

### Cómo se detectó
`supabase init` falló inmediatamente con un mensaje claro: "Could not find the `supabase-go` binary."

### Cómo se evita en el futuro
**Regla preventiva**:

Cuando instalo un binario CLI desde un tarball / zip:
1. **Primero**: `tar -tzf archive.tar.gz` (o equivalente) para ver TODOS los archivos del paquete.
2. **Después**: mover/copiar TODOS los archivos a un directorio dedicado (`~/.local/share/<tool>/`), no extraer en `/tmp` y mover archivos sueltos.
3. **Symlink** el ejecutable principal desde un directorio del PATH (`~/.local/bin/<tool>` → `~/.local/share/<tool>/<tool>`).
4. **No borrar nada del directorio del binario** salvo el tarball original.

Aplica a: CLIs distribuidos como tarball (supabase, gh, mc, k9s, etc.).

### Cambios derivados
- [x] Supabase CLI re-instalada correctamente en `~/.local/share/supabase/` con symlink en `~/.local/bin/supabase`.
- [x] Registro en MISTAKES.md (este archivo).
- [x] Learning en LEARNINGS.md sobre el patrón correcto de instalación de CLIs.

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
