# Skill: Auditar SEO de una Página (`/seo-audit`)

## Cuándo usar esto

- Página que rankea pero no clickean (CTR <2%)
- Página que aparece en GSC pero en posición >10
- Página nueva antes de publicar (validación)
- Página antigua que está bajando posiciones
- Página que el founder sospecha está mal optimizada

## Antes de arrancar

Leer:
- `SEO_STRATEGY.md` (reglas duras de SEO del proyecto)
- `BRANDS.md` (si la página es de marca)
- `CONTENT_PLAN.md` (si es una guía)

Invocar agente: `seo-strategist` toma el control del proceso.

## Proceso

### Step 1 — Datos previos

Antes de auditar, recolectar:

```yaml
url: "https://opticacarballo.com.ar/anteojos-de-sol/rusty/hombre"
keyword_target: "anteojos de sol rusty hombre"
gsc_data:
  impresiones: 1840
  clicks: 23
  ctr: 1.25%
  posicion_promedio: 14.2
fecha_publicacion: "2026-..."
ultima_actualizacion: "2026-..."
```

Si no hay datos de GSC todavía (página nueva), saltar y enfocarse en validación pre-publicación.

### Step 2 — Auditoría on-page

Checklist completo (cada item es ✅/❌/⚠️):

#### URL
- [ ] Sigue patrón de `SEO_STRATEGY.md`
- [ ] En español argentino completo
- [ ] Sin acentos ni ñ
- [ ] Sin parámetros indexables
- [ ] Sin trailing slash
- [ ] HTTPS
- [ ] Sin www

#### Meta tags
- [ ] Title <60 caracteres
- [ ] Title contiene keyword principal natural
- [ ] Title termina con "- Óptica Carballo" si entra
- [ ] Meta description 150-160 caracteres
- [ ] Meta description incluye keyword + propuesta de valor + CTA
- [ ] Sin duplicación de title/description en otras páginas

#### Encabezados
- [ ] Un único H1 por página
- [ ] H1 contiene keyword principal natural
- [ ] H2/H3 jerárquicos correctos (no saltar de H1 a H3)
- [ ] H2s incluyen keywords secundarias donde corresponde

#### Contenido
- [ ] Mínimo de palabras adecuado al tipo (300+ para producto, 1200+ para satélite, 3000+ para pillar)
- [ ] Keyword density natural (no stuffing)
- [ ] Sin AI-isms ni clichés
- [ ] Español argentino consistente
- [ ] Contenido único (no copy-paste de otras páginas)
- [ ] FAQ section con preguntas reales (si aplica)

#### Imágenes
- [ ] Todas tienen alt text descriptivo
- [ ] Alt text incluye keyword cuando corresponde (sin spam)
- [ ] WebP o AVIF
- [ ] Dimensiones explícitas (width/height en HTML)
- [ ] Lazy loading excepto LCP
- [ ] Imagen principal optimizada (<300KB)
- [ ] OG image específica para social sharing

#### Structured data (JSON-LD)
- [ ] Schema correcto según tipo de página (Product, Article, MedicalWebPage, etc.)
- [ ] Schema válido (https://validator.schema.org)
- [ ] `BreadcrumbList` presente
- [ ] `FAQPage` si hay FAQ
- [ ] Datos coinciden con lo visible en página

#### Internal linking
- [ ] 3-8 internal links relevantes
- [ ] Anchor text descriptivo (no "click acá", no "leer más")
- [ ] Links a productos relacionados (si aplica)
- [ ] Link al pillar del cluster (si es satélite)
- [ ] Breadcrumbs presentes con schema

#### Bylines y E-E-A-T (si es contenido de salud)
- [ ] Author byline visible
- [ ] Credenciales del autor (matrícula, título)
- [ ] Revisor con credenciales (si aplica)
- [ ] Fecha de publicación + última actualización
- [ ] Bibliografía / fuentes citadas
- [ ] Disclaimer médico al final
- [ ] `Person` schema con `hasCredential`

#### Performance
- [ ] LCP <2.5s (medir con Vercel Analytics)
- [ ] CLS <0.1
- [ ] INP <200ms
- [ ] TTFB <600ms
- [ ] No hay JavaScript bloqueante innecesario

#### Indexabilidad
- [ ] `noindex` no presente (salvo intencional)
- [ ] Canonical URL apunta a la página misma
- [ ] hreflang `es-AR` configurado
- [ ] En sitemap.xml
- [ ] No bloqueada por robots.txt

#### Conversión (si aplica)
- [ ] CTA primario visible above the fold en mobile
- [ ] Trust signals visibles
- [ ] Cuotas mostradas si es producto

### Step 3 — Auditoría comparativa

Para keyword target, mirar top 3 resultados de Google:

```bash
# Search en modo incógnito desde Argentina
"anteojos de sol rusty hombre"
```

Para cada uno de los 3 top:
- ¿Qué tipo de página es? (categoría, marketplace, blog)
- ¿Cuánto contenido tiene?
- ¿Qué estructura?
- ¿Qué internal links?
- ¿Qué structured data tienen? (ver código fuente)
- ¿Qué hacen mejor que nosotros?
- ¿Qué hacemos nosotros mejor que ellos?

Output: tabla comparativa con gaps.

### Step 4 — Identificar issues priorizados

Clasificar cada hallazgo:

- 🔴 **Crítico**: bloquea ranking o indexación. Acción inmediata.
- 🟡 **Importante**: oportunidad significativa de mejora.
- 🟢 **Optimización**: refinamiento útil cuando haya capacidad.

Cada issue tiene:
- Qué está pasando
- Por qué importa
- Cómo solucionarlo (acción concreta)
- Impacto estimado

### Step 5 — Producir reporte

```markdown
# SEO Audit: [URL]

**Fecha**: YYYY-MM-DD
**Keyword target**: [keyword]
**Posición actual**: [X]
**Tipo de página**: [...]

## Resumen ejecutivo
[2-3 oraciones: estado general + impacto esperado de las mejoras]

## Issues críticos (acción inmediata)
1. [Issue + acción]
2. [...]

## Issues importantes
1. [Issue + acción]
2. [...]

## Optimizaciones
1. [Issue + acción]
2. [...]

## Comparación con top 3 competidores
| Aspecto | Nosotros | Top 1 | Top 2 | Top 3 |
|---------|----------|-------|-------|-------|
| Palabras | ... | ... | ... | ... |
| Internal links | ... | ... | ... | ... |
| Schema | ... | ... | ... | ... |
| ... | ... | ... | ... | ... |

## Métricas a monitorear post-fix
- [Métrica 1]: valor actual → target esperado
- [Métrica 2]: ...

## Próxima auditoría
Recomendado en [4-6 semanas] para medir impacto de los fixes.
```

### Step 6 — Aplicar los fixes (si aprobados)

El founder revisa el reporte y aprueba fixes. Aplicar **en orden de criticidad** (críticos primero).

Cada fix se documenta:
- Qué se cambió
- Cuándo
- Métrica antes / esperada después

### Step 7 — Trackear impacto

A las 4-6 semanas post-fix:
- Revisar GSC: ¿posición mejoró? ¿CTR subió?
- Si sí → entrada en `LEARNINGS.md` con el patrón
- Si no → reauditar, posible causa profunda no atacada

## Herramientas externas que pueden usarse

- **Google Search Console**: el más importante. Datos reales de impresiones, clicks, posición.
- **PageSpeed Insights**: performance + Core Web Vitals.
- **Schema.org Validator**: validar JSON-LD.
- **Ahrefs / Ubersuggest** (si hay): backlinks, keywords adicionales.
- **Screaming Frog** (si hay): crawl técnico completo del sitio.
- **Búsqueda manual** desde modo incógnito en Argentina: ver SERPs reales.

## Reglas duras

1. **NUNCA aplicar fixes sin entender qué soluciona cada uno**.
2. **NUNCA cambiar URL de una página indexada** sin redirect 301.
3. **NUNCA cambiar más de 3 cosas a la vez** sin medir impacto.
4. **NUNCA cambiar título o meta description sin nueva propuesta probada**.
5. **NUNCA bloquear una página por error** (no agregar `noindex` sin razón clara).

## Cuándo NO hace falta auditar

- Página con <30 impresiones en GSC (muestra insuficiente)
- Página recién publicada (<2 semanas) — esperar a que indexe y rankee
- Página que el founder ya decidió descontinuar
