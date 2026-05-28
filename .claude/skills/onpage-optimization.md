# Skill: On-Page Optimization (`/onpage-optimization`)

## Cuándo usar esto

**Diferente de `/seo-audit`**. Audit identifica problemas; este skill **ejecuta los fixes**.

Casos típicos:
- Página ranking en posición 11-15 que queremos llevar al top 10
- Página con CTR <2% que necesita meta tags nuevos
- Página vieja que se quedó atrás (refresh)
- Página recién publicada que no rankea y queremos darle un boost

## Antes de arrancar

Tener a mano:
- URL de la página
- Keyword target
- Datos actuales de GSC (impresiones, clicks, CTR, posición)
- Resultado de `/seo-audit` si está disponible

Invocar agentes:
- `seo-strategist` (líder del proceso)
- `content-writer-medical` (si requiere reescritura de prosa)
- `optical-expert` (si requiere validación técnica)

## Proceso

### Step 1 — Diagnóstico previo

Confirmar:
- ¿La página existe y está indexada? (búsqueda site: en Google)
- ¿La intención del usuario para la keyword target sigue siendo la misma?
- ¿La página está alineada con esa intención?
- ¿Hay competidores que rankean mejor — qué hacen ellos?

Si la intención cambió, primero hay que decidir: reformular página o crear página nueva.

### Step 2 — Identificar el cuello de botella

Por tipo de problema:

#### "Posición buena pero CTR bajo"
- → Problema de meta title / meta description
- Acción: rewrite agresivo del title + description
- Validar contra top 3 SERPs

#### "Posición regular (11-20)"
- → Probable falta de profundidad o relevancia
- Acción: contenido más completo, internal links, structured data

#### "Posición baja (>20)"
- → Probable problema serio: relevance o autoridad
- Acción: contenido sustantivamente mejor + backlinks + internal linking

#### "Páginas indexadas pero no rankea para nada"
- → Probable problema de calidad o canibalización
- Acción: revisar contenido, ver si compite con otra página propia

#### "Ranking inestable"
- → Probable señales mixtas (algunas buenas, otras malas)
- Acción: limpiar, consolidar, esperar 4-6 semanas

### Step 3 — Mejoras de meta tags

Si el problema es CTR:

**Title actual**: [transcribir]
**Title propuesto**: [nuevo]

Cambios típicos que suben CTR:
- Agregar año si es relevante: "2026"
- Agregar número: "8 modelos para...", "Top 5..."
- Agregar diferenciador: "Originales", "Cuotas sin interés", "Envío gratis"
- Mover keyword al inicio
- Quitar palabras "fillers" que no aportan
- Agregar emoción o curiosidad (sin clickbait)

**Description actual**: [transcribir]
**Description propuesta**: [nueva]

Cambios típicos:
- Empezar con la keyword si es natural
- Incluir USPs (envío, cuotas, garantía, 30 años)
- CTA suave al final
- Ajustar a 150-160 chars

A/B testing: rotar dos versiones por 2-4 semanas y medir CTR (esto requiere infra de A/B, V2 del proyecto).

### Step 4 — Mejoras de contenido

Si el problema es posición o profundidad:

#### Expandir contenido
- ¿Cubre todos los subtemas que el SERP demanda?
- ¿Comparado con top 3, le faltan secciones?
- Agregar 500-1500 palabras donde corresponde
- Cuidar no diluir keyword density natural

#### Mejorar estructura
- H2/H3 más claros y descriptivos
- Tablas comparativas donde el SERP las premia
- Listas cuando facilitan escaneo
- FAQ al final con preguntas reales

#### Agregar FAQ con schema
- 4-8 preguntas frecuentes
- Cada respuesta 40-80 palabras
- `FAQPage` JSON-LD
- Suele mejorar CTR y aumentar oportunidad de featured snippets

#### Actualizar fechas
- "Última actualización" visible
- Datos / estadísticas actualizados
- Productos linkeados verificados (existen, no descontinuados)

#### Mejorar imágenes
- Optimizar peso si no se hizo
- Alt text más descriptivo
- Reemplazar imágenes de stock con propias si las hay

### Step 5 — Mejoras de internal linking

- ¿Cuántos internal links entran a esta página? (de otras páginas hacia esta)
- ¿De qué páginas?
- ¿Anchor text es descriptivo o genérico?

Acciones:
- Agregar links HACIA esta página desde otras relevantes
- Especialmente desde páginas con alta autoridad propia (home, top guías, pillar pages)
- Verificar que el pillar del cluster linkea a esta página (si es satélite)
- Agregar links DESDE esta página a otras relevantes (3-8 internal links)

### Step 6 — Mejoras de structured data

Validar que tiene el schema apropiado:

- Producto → `Product` + `Offer` / `AggregateOffer` con `hasVariant`
- Categoría → `CollectionPage` + `BreadcrumbList`
- Artículo → `Article` + `MedicalWebPage` si toca salud + `Person` para autor
- FAQ → `FAQPage`
- Reviews → `Review` + `AggregateRating`

Agregar o corregir lo que falte.

Validar en https://validator.schema.org y https://search.google.com/test/rich-results

### Step 7 — Mejoras técnicas

- LCP <2.5s
- Imagen LCP optimizada (preload, dimensiones explícitas)
- Sin CLS por imágenes sin dimensiones
- INP <200ms (sin JS bloqueante pesado)
- TTFB <600ms (server-side render rápido o cache)
- Canonical correcto
- hreflang `es-AR`
- No `noindex` involuntario

### Step 8 — Bylines y E-E-A-T (si aplica)

Si es contenido de salud y no los tiene:

- Author byline visible
- Credenciales del autor (matrícula)
- Revisor con credenciales
- Fecha de publicación + actualización
- Bibliografía
- Disclaimer médico

### Step 9 — Aplicar los cambios

**Una pasada por vez** si la página tiene tráfico significativo:

1. Aplicar cambios de meta tags primero (impacto rápido).
2. Esperar 2-4 semanas, medir.
3. Si funcionó, aplicar cambios de contenido.
4. Esperar 4-6 semanas, medir.
5. Si todavía hay margen, mejorar structured data e internal linking.

**Si la página tiene poco tráfico**: aplicar todo de una.

### Step 10 — Trackear impacto

A las 4-8 semanas post-fix:

```markdown
## Resultado de optimización

**URL**: [...]
**Keyword target**: [...]

### Antes
- Impresiones: X
- Clicks: X
- CTR: X%
- Posición: X

### Después
- Impresiones: Y
- Clicks: Y
- CTR: Y%
- Posición: Y

### Conclusión
- ✅ Confirmado: cambios funcionaron
- 🟡 Parcial: mejoraron algunos pero no todos
- ❌ No funcionó: probar otra cosa
```

Registrar el resultado:
- **Funcionó** → entrada en `LEARNINGS.md` con el patrón
- **No funcionó** → entrada en `EXPERIMENTS.md` con la hipótesis refutada

## Patrones que suelen funcionar (validar caso por caso)

1. **Meta title con año** + "Guía completa" o "X modelos" suele mejorar CTR.
2. **FAQ con schema** suele dar featured snippets en queries informational.
3. **Tablas comparativas** rankean para queries "X vs Y".
4. **Internal links desde home a página objetivo** suben autoridad rápido.
5. **Update + visible "actualizado en X"** indica frescura a Google.
6. **Imagen LCP optimizada** suele mejorar posición en mobile.

## Anti-patrones

1. **Keyword stuffing** para "subir el keyword density" → penaliza.
2. **Comprar backlinks de baja calidad** → penaliza.
3. **Reescribir todo cada semana** → Google no alcanza a procesar, indecisión.
4. **Cambiar la URL pensando que ayuda SEO** → resetea autoridad.
5. **Borrar contenido para "limpiar"** → si rankea, no se toca.

## Reglas duras

1. **NUNCA aplicar todo de una en página con tráfico**. Cambios graduales para poder atribuir.
2. **NUNCA cambiar URL** sin redirect 301.
3. **NUNCA borrar páginas indexadas** sin plan: redirect 301 a equivalente o `noindex` con razón.
4. **NUNCA over-optimize**: si la página está top 3, dejala en paz salvo problema concreto.
5. **NUNCA esperar resultados en menos de 4 semanas**. Google necesita tiempo.

## Cuándo NO optimizar

- Página con <30 impresiones en GSC → muestra insuficiente
- Página recién publicada (<2 semanas) → esperar a que indexe
- Página en top 3 → riesgo de empeorar es mayor que mejorar
- Página con problemas estratégicos profundos → mejor reescribir desde cero, no parchar
