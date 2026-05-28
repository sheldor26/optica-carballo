# Skill: Debug (`/debug`)

## Cuándo usar esto

Algo está roto y no sabemos por qué. Antes de tirar fixes random, este proceso lleva al fix correcto.

## Antes de arrancar

- Leer `MISTAKES.md` para ver si el bug es uno conocido.
- NO asumir la causa antes de investigar.
- NO hacer múltiples cambios simultáneos.

## Proceso (siempre en este orden)

### Step 1 — Entender el síntoma

Describir EXACTAMENTE:
- Qué está pasando (síntoma observable)
- Qué debería estar pasando (comportamiento esperado)
- Cuándo empezó (último cambio conocido)
- Quién lo reporta (founder, usuario final, monitoring)
- Es consistente o intermitente

**NO confundir síntoma con causa.** "El deploy falló" es síntoma. "Falta una variable de entorno" es causa.

### Step 2 — Reproducir

Definir los pasos exactos para gatillar el bug:
1. [Paso 1]
2. [Paso 2]
3. [Síntoma aparece]

Si no se puede reproducir:
- Logs del servidor / Vercel
- Sentry o equivalente (si hay)
- Network tab del browser
- Console de errores
- Estado de la DB en el momento del incidente

Si SIGUE sin reproducirse: el bug puede depender de:
- Tiempo (cron, timeout)
- Concurrencia (race condition)
- Estado específico de un usuario
- Combinación específica de browser / dispositivo

### Step 3 — Aislar

Reducir el problema al mínimo código que muestra el bug:
- Eliminar variables una por una
- Comentar bloques de código
- Probar en aislamiento (test unitario o REPL)
- Reproducir en local con la mínima data necesaria

**Objetivo**: tener un caso reproducible chico.

### Step 4 — Hipotetizar

Listar 2-3 posibles causas, en orden de probabilidad:

```
Hipótesis 1 (más probable): [X causa Y porque Z]
Hipótesis 2: [...]
Hipótesis 3 (más improbable): [...]
```

**NO saltar a soluciones todavía**. Solo hipótesis.

### Step 5 — Testear cada hipótesis

**UN cambio por vez**. Nunca dos cambios simultáneos: si funciona, no sabés cuál fue.

Para cada hipótesis:
1. Diseñar el test que la confirme o refute
2. Aplicar el cambio mínimo necesario
3. Ejecutar el caso reproducible del Step 3
4. ¿Sigue fallando? Hipótesis refutada. Pasar a la siguiente.
5. ¿Se resolvió? Hipótesis confirmada. Continuar al Step 6.

### Step 6 — Fixear y verificar

Aplicar el fix correctamente (no el hack):

1. **Fix real, no parche**: resuelve la causa, no oculta el síntoma.
2. **Sin regression**: verificá que no rompió otra cosa.
3. **El caso original**: el síntoma del Step 1 ya no aparece.
4. **Casos similares**: si el bug fue por X, ¿hay otros lugares con el mismo patrón?
5. **Tests si aplica**: si el bug era crítico, agregar test que lo prevenga.

### Step 7 — Documentar

**SIEMPRE** agregar entrada a `MISTAKES.md`:

```markdown
## YYYY-MM-DD — [Descripción breve del bug]

**Estado**: 🟡 Mitigado
**Categoría**: [...]

### Qué pasó
[síntoma observable]

### Causa raíz
[la causa real, no el síntoma]

### Impacto
[qué se perdió: tiempo, ventas, datos]

### Cómo se detectó
[founder, usuario, monitoring]

### Cómo se evita en el futuro
[regla preventiva concreta]

### Cambios derivados
- [archivo modificado]
- [regla agregada a CLAUDE.md o agente si aplica]
```

### Step 8 — Cerrar

- Confirmar al founder qué se fixó y cómo testearlo.
- Si el bug era visible en producción, considerar comunicación a usuarios afectados.
- Actualizar `CURRENT_STATE.md`.

## Tipos de bugs comunes en este stack

### Webhooks de Mercado Pago no procesan
- Validar firma con `MP_WEBHOOK_SECRET`
- Verificar idempotencia (el mismo evento puede llegar 2 veces)
- Logs en Vercel del endpoint `/api/mp/webhook`
- MP Dashboard → Notifications → ver el payload exacto

### Imágenes que no cargan
- Path correcto en Supabase Storage
- Bucket público vs privado (recetas son privadas, productos públicos)
- Permisos / RLS de Storage
- Signed URLs si es privado: ¿expiraron?

### IA: output inválido o costoso
- Verificar prompt en `AI_PROMPTS.md` vs lo que está en código
- Validación post-output activa
- Token usage en logs
- Si la query del usuario es la causa → posible prompt injection

### Auth / sesiones perdidas
- Cookies de Supabase en `next.config.js`
- Middleware de Next.js correcto
- RLS policies que requieren `auth.uid()`

### Build falla en Vercel
- Variable de entorno faltante
- TypeScript errors no detectados en dev
- Imports relativos vs absolutos rotos
- Dependencia no listada en `package.json`

### Rate limiting demasiado agresivo
- Verificar configuración por endpoint
- IPs de bots vs usuarios reales
- Cloudflare / Vercel headers

### Performance degradada
- Vercel Analytics: ¿qué cambió?
- Queries Supabase con missing indexes
- Bundle size con `next build` 
- Imágenes sin optimizar

## Reglas duras

1. **NUNCA aplicar un fix sin entender la causa raíz**. "Funciona pero no sé por qué" = el bug vuelve.
2. **NUNCA probar dos cambios al mismo tiempo**.
3. **NUNCA hacer cambios en producción directamente** sin pasar por dev.
4. **NUNCA cerrar un bug sin entrada en MISTAKES.md**.
5. **NUNCA culpar al "stack" sin haber leído tu código primero**.

## Salida esperada

Al final del proceso:
- Bug resuelto
- Causa raíz documentada
- Regla preventiva agregada
- Ningún cambio sin sentido en el repo
