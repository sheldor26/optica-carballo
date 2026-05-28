# Skill: Build a New Feature (`/feature`)

## Cuándo usar esto

Cuando el founder pide construir algo nuevo: una página, un componente, un endpoint, una tabla, una integración.

## Antes de arrancar

Leer:
- `CLAUDE.md` (reglas core)
- `CURRENT_STATE.md` (qué está en curso)
- `ARCHITECTURE.md` (stack y decisiones)
- `DECISIONS.md` (decisiones cerradas para no reabrir)
- `MISTAKES.md` (errores recientes a no repetir)

## Proceso (siempre en este orden)

### Step 1 — Entender

- Reformulá la feature en UNA oración. "Vamos a construir X que permite Y para que el usuario logre Z."
- Hacé UNA pregunta clarificadora si algo es ambiguo. NO procedés sin claridad.
- Identificá a qué agente especialista corresponde consultar:
  - Feature de IA → `ai-features-engineer`
  - Feature de SEO / contenido → `seo-strategist` + `content-writer-medical`
  - Feature de pagos / envíos → `argentine-ecom`
  - Feature de conversión / UX → `conversion-optimizer`
  - Feature técnica óptica → `optical-expert`
- Si la feature toca varios dominios, coordinás los agentes en el orden correcto.

### Step 2 — Planear

Devolvés un plan estructurado:

```markdown
## Plan: [nombre de la feature]

### Objetivo
[1 oración]

### Agentes involucrados
- [agente]: [qué aporta]

### Archivos a crear
- [path]: [descripción]

### Archivos a modificar
- [path]: [qué cambia]

### Cambios en base de datos
- [tabla / migración]: [qué cambia]
- RLS policies necesarias: [...]

### Dependencias nuevas
- [librería]: [por qué] (requiere aprobación del founder)

### Riesgos identificados
- [riesgo]: [mitigación]

### Estimación
- Tiempo aproximado: [X horas / sesiones]
- Complejidad: 🟢 Simple / 🟡 Media / 🔴 Compleja

### Métricas de éxito
- ¿Cómo sabremos que funciona?
```

**Esperás aprobación del founder antes de avanzar al Step 3.**

### Step 3 — Database first (si hace falta)

Si la feature requiere cambios de schema:

1. **Generá la migración** SQL completa.
2. Validá:
   - Naming consistente con el schema existente
   - Indexes en columnas que se filtran/joinean
   - Constraints (NOT NULL, UNIQUE, FK) donde corresponda
   - RLS habilitado + políticas escritas
   - JSONB con índices GIN si se queryea
3. **Confirmá el schema con el founder** antes de aplicar.
4. Usá skill `/migration` para aplicar correctamente.
5. Actualizá la documentación de schema si tenés un archivo central de tablas.

### Step 4 — Backend logic

1. **Server actions** para mutaciones del lado servidor (preferir sobre API routes salvo webhooks).
2. **API routes** solo para webhooks o endpoints públicos.
3. **Siempre con error handling**:
   - Try/catch en operaciones de DB
   - Validación de input con Zod o equivalente
   - Logging de errores (no exponer detalles al cliente)
   - Mensajes de error en español argentino para el usuario final
4. **Nunca exponer datos sensibles** en responses:
   - Service role key, API keys
   - Datos de otros usuarios
   - Hashes de contraseñas
5. **Rate limiting** en endpoints sensibles (chat, upload, checkout).
6. **Si la feature usa IA**: consultar a `ai-features-engineer` para anti-injection, validación de output, costo estimado.

### Step 5 — Frontend

1. **Mobile-first** siempre. Diseñar para mobile primero, después desktop.
2. **Componentes de `shadcn/ui`** cuando hay disponibles. No reinventar.
3. **Componentes nuevos en `components/[dominio]/`**:
   - `components/product/` para productos
   - `components/checkout/` para checkout
   - `components/ai/` para features IA
   - `components/seo/` para structured data
4. **Server Components por default**. Client Components solo cuando hay interactividad real.
5. **Accesibilidad**: 
   - Botones con `aria-label` cuando el ícono solo no es claro
   - Forms con labels visibles
   - Contraste WCAG AA mínimo
   - Tab order lógico
6. **Performance**:
   - `next/image` para todas las imágenes con `width` y `height` explícitos
   - `next/font` para fuentes
   - Lazy loading excepto LCP
   - `Suspense` con fallbacks claros
7. **Si la feature tiene impacto en conversión**: consultar a `conversion-optimizer`.
8. **Si la feature tiene texto largo**: consultar a `content-writer-medical`.

### Step 6 — SEO (si la feature genera páginas indexables)

1. Coordinar con `seo-strategist`:
   - URL definida según patrones de SEO_STRATEGY.md
   - Meta title (<60 chars)
   - Meta description (150-160 chars)
   - H1 único
   - Structured data JSON-LD
   - Internal links a y desde la página
   - Sitemap actualizado
2. Validar canonical, robots meta, hreflang `es-AR`.

### Step 7 — Testing manual

Describí exactamente cómo probar la feature:

```markdown
## Cómo probar [nombre de la feature]

### Setup
- [Qué necesitás antes: data de prueba, cuentas, etc.]

### Caminos felices
1. [Paso 1]
2. [Paso 2]
3. [Resultado esperado]

### Casos edge
- [Caso: qué pasa si ...]
- [Caso: qué pasa si ...]

### En mobile
- [Validación específica mobile]

### En desktop
- [Validación específica desktop]
```

### Step 8 — Documentar y cerrar

1. Actualizar `CURRENT_STATE.md`:
   - Feature marcada como done
   - Decisiones técnicas tomadas durante implementación
   - Próximo paso exacto

2. Si se tomaron decisiones importantes → entrada en `DECISIONS.md` (ADR).

3. Si algo se aprendió → entrada en `LEARNINGS.md`.

4. Si algo falló → entrada en `MISTAKES.md`.

5. Si la feature requiere métricas → agregar a `METRICS.md` y al tracking de GA4.

6. Si la feature es un experimento → entrada en `EXPERIMENTS.md` con hipótesis.

## Reglas duras

1. **NUNCA introducir librería nueva sin aprobación del founder**.
2. **NUNCA escribir código sin haber pasado por Step 1 y 2 con plan aprobado**.
3. **NUNCA tocar pagos / auth / RLS / secrets sin revisar dos veces**.
4. **NUNCA dejar `console.log` o credenciales hardcoded**.
5. **NUNCA dejar TODO sin fecha o sin owner**.
6. **NUNCA cerrar la sesión sin actualizar CURRENT_STATE.md**.

## Salida esperada

Al final del Step 8, el founder debería poder:
- Ver la feature funcionando.
- Saber cómo probarla.
- Saber qué se decidió y por qué.
- Saber cuál es el próximo paso.
