# Skill: Competitor Analysis (`/competitor-analysis`)

## Cuándo usar esto

- Cuando dudás cómo encarar un cluster o página
- Cuando un competidor está ranking por encima nuestro y querés entender por qué
- Para identificar gaps de mercado
- Trimestralmente como parte del proceso de planning

## Antes de arrancar

Leer:
- `SEO_STRATEGY.md` (para no duplicar lo que ya sabemos)
- `BRANDS.md` (para saber qué marcas vendemos)

Invocar agente: `seo-strategist` lleva el análisis.

## Competidores principales del rubro argentino

### Ópticas online consolidadas
- **Lutz Ferrando** (lutzferrando.com.ar) — autoridad alta, premium
- **Anteojería Argentina** (anteojeriaargentina.com.ar)
- **ÓpticaLine** (opticaline.com.ar)
- **Óptica Boulevard**
- **Óptica del Sol** (varias)
- **GIO Italia**

### Marketplaces que compiten en SERP
- **Mercado Libre** (sección anteojos)
- **Tiendamia**

### Marcas que venden directo (DTC)
- **Vulk** (vulkargentina.com)
- **Infinit** (infinitlight.com)
- **Rusty** (rustyargentina)

### Cadenas físicas con presencia digital
- **Anteojos Boulevard**
- **GMO** (más Chile pero presencia AR)

### Cluster específico: lentes de contacto
- **OpticasMaxx**
- **Lentes Online Argentina**
- **Mercado Libre dominante**

## Proceso

### Step 1 — Definir alcance

¿Qué estás analizando?

- **Análisis general del mercado**: 5-8 competidores, mirada amplia
- **Análisis específico de keyword**: top 5 de SERP para esa keyword
- **Análisis de un competidor en profundidad**: deep dive en 1
- **Análisis de gap**: qué hacen ellos que nosotros no

### Step 2 — Recolectar datos por competidor

Para cada competidor:

#### Datos básicos
- Dominio + edad del dominio
- Domain Rating (Ahrefs si hay) o autoridad estimada
- Tráfico mensual estimado (SimilarWeb, Semrush)
- Tipo de negocio (puro online, omnichannel, marketplace)
- Geografía (Argentina solo, Latam, Spain)

#### SEO técnico (de la home y top páginas)
- Estructura de URLs
- Patrón de title/meta description
- Sitemap accesible
- robots.txt permisivo o restrictivo
- Schema.org / structured data (ver código fuente)
- Core Web Vitals (PageSpeed Insights)
- Mobile UX

#### Contenido
- ¿Tienen blog/guías?
- ¿Cuántos artículos publican?
- Calidad del contenido (E-E-A-T, profundidad)
- Frecuencia de publicación
- Autoridad de autor visible

#### Catálogo
- Cuántos productos visibles
- Qué marcas
- Rango de precios
- Variantes / opciones
- Reviews / testimonios
- Imágenes (calidad, cantidad)

#### Conversión
- CTAs principales
- Pricing display (cuotas? precio en grande?)
- Trust signals (años, matrícula, etc.)
- Métodos de pago
- WhatsApp / chat disponible
- Probador virtual o try-on

#### Features
- IA / personalización
- Reservas online
- Suscripciones
- App mobile
- Programa de fidelidad

#### Marketing
- ¿Pautan Google Ads? (buscar la keyword e identificar)
- ¿Pautan Meta Ads? (buscarlos en Meta Ad Library)
- ¿SEO foco principal?
- ¿Influencers / colaboraciones?

### Step 3 — Análisis comparativo

Tabla comparativa estándar:

| Aspecto | Nosotros | Comp 1 | Comp 2 | Comp 3 | Gap |
|---------|----------|--------|--------|--------|-----|
| Edad dominio | Alta (30 años offline, web nueva) | ... | ... | ... | ... |
| Catálogo | ... | ... | ... | ... | ... |
| Blog | ... | ... | ... | ... | ... |
| IA features | ✅ Lector receta + Chat | ... | ... | ... | DIFERENCIADOR |
| Cuotas | ✅ | ✅ | ✅ | ✅ | Estándar |
| WhatsApp | ✅ | ✅ | ⚠️ Solo formulario | ✅ | ... |
| ... | ... | ... | ... | ... | ... |

### Step 4 — Identificar oportunidades

Por categoría:

#### Oportunidades de contenido
- ¿Qué temas cubren ellos que nosotros no?
- ¿Qué temas cubrimos peor?
- ¿Hay clusters sin cubrir por ningún competidor?
- ¿Hay artículos viejos que podemos superar con contenido mejor (10x content)?

#### Oportunidades de SEO técnico
- ¿Estructura de URLs mejor que ellos?
- ¿Schema más completo?
- ¿Performance mejor?
- ¿Internal linking más profundo?

#### Oportunidades de producto
- ¿Marcas que tenemos y ellos no?
- ¿Productos exclusivos?
- ¿Mejor pricing?
- ¿Mejores fotos?

#### Oportunidades de experiencia
- ¿Features que ellos no tienen? (probador virtual, recomendador IA, etc.)
- ¿UX más simple?
- ¿Checkout más rápido?

### Step 5 — Identificar amenazas

¿Qué hace mejor el competidor que deberíamos copiar o contrarrestar?

- **Si rankean más**: ¿qué hacen on-page?
- **Si tienen más backlinks**: ¿de dónde los consiguen?
- **Si tienen mejor catálogo**: ¿qué marcas adicionales venden?
- **Si tienen mejores reviews**: ¿qué provoca esos reviews?
- **Si tienen feature exclusiva**: ¿podemos replicarla o superarla?

### Step 6 — Análisis específico de SERP

Para una keyword target, mirar los top 5 con detalle:

```markdown
## SERP Analysis: "anteojos de sol rusty hombre"

| Pos | URL | Tipo | Words | Internal links | Schema | Notas |
|-----|-----|------|-------|----------------|--------|-------|
| 1 | mercadolibre.com.ar/... | listing | N/A | ... | ProductGroup | Marketplace dominante |
| 2 | rustyargentina.com.ar/... | brand site | 200 | 5 | Product | DTC oficial |
| 3 | ... | ... | ... | ... | ... | ... |

### Common patterns
- Todos tienen foto del producto arriba
- Todos muestran precio + cuotas
- Mercado Libre tiene reviews visibles

### Gaps identificados
- Ninguno tiene descripción larga + guía de uso
- Ninguno tiene "para qué forma de cara" en producto
- Ninguno tiene FAQ específico

### Estrategia para ganar este SERP
- Crear página /anteojos-de-sol/rusty/hombre con:
  - Tabla de modelos disponibles
  - "Para qué forma de cara" por modelo
  - FAQ con FAQPage schema
  - Reviews con foto
  - Más palabras + mejor estructura
- Targetear featured snippet con tabla
```

### Step 7 — Reporte final

```markdown
# Competitor Analysis: [scope]

**Fecha**: YYYY-MM-DD
**Scope**: [análisis general / keyword X / competidor Y]

## Resumen ejecutivo
[2-3 oraciones: estado competitivo + oportunidades clave]

## Mapa competitivo
[Tabla comparativa]

## Top 3 oportunidades identificadas
1. **[Oportunidad]** — [evidencia + acción propuesta]
2. ...

## Top 3 amenazas / áreas de mejora
1. **[Amenaza]** — [evidencia + contramedida]
2. ...

## Insights inesperados
[Cosas no obvias que surgieron del análisis]

## Acciones recomendadas
- [Acción 1]: [responsable, plazo]
- [Acción 2]: ...

## Próximo análisis
[Cuándo correr este skill de nuevo]
```

## Herramientas útiles

| Herramienta | Para qué | Costo |
|-------------|----------|-------|
| **Búsqueda manual** desde incógnito en Argentina | Ver SERPs reales | Free |
| **PageSpeed Insights** | Performance del competidor | Free |
| **Schema.org validator** | Ver schema de competidor | Free |
| **SimilarWeb** | Tráfico estimado | Free / paid |
| **Ahrefs** | Backlinks, KW | Paid |
| **Semrush** | KW, ads, backlinks | Paid |
| **Ubersuggest** | KW básico | Free / paid |
| **Wayback Machine** | Ver versiones antiguas del competidor | Free |
| **Meta Ad Library** | Ver ads de Meta del competidor | Free |
| **Google Ads Transparency Center** | Ads de Google | Free |
| **View source** | Ver structured data, meta tags | Free |

## Reglas duras

1. **NUNCA copiar contenido textual de un competidor**. Plagio.
2. **NUNCA inventar datos del competidor**. Si no se puede verificar, marcarlo como "estimado".
3. **NUNCA obsesionarse con un competidor**. La mejor estrategia es ser único, no copiar.
4. **NUNCA atacar todo lo que ellos hacen**. Priorizar lo de mayor impacto.
5. **NUNCA hacer este skill más de 1 vez por trimestre** salvo razón clara. El mercado no cambia tan rápido.

## Mindset

- El competidor te da pistas, no la respuesta.
- Lo que ellos NO hacen puede ser tu mayor oportunidad.
- Si copiás todo, sos el segundo mejor. Tu ventaja es ser distinto.
- Las features de IA + 30 años de marca + matrícula real = ventaja única tuya. **Capitalizá eso**.
