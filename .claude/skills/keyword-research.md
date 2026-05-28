# Skill: Keyword Research (`/keyword-research`)

## Cuándo usar esto

- Pensando un cluster nuevo de contenido
- Validando si vale la pena atacar una categoría
- Antes de cargar una marca / colección nueva
- Antes de escribir un pillar page

## Antes de arrancar

Leer:
- `SEO_STRATEGY.md` sección "Keyword Research" (datos ya cargados)
- `CONTENT_PLAN.md` (qué clusters ya estamos atacando)

Invocar agente: `seo-strategist` coordina el proceso.

## Proceso

### Step 1 — Definir el tema

Reformular el tema en términos de búsqueda real:
- ¿Qué query principal me imagino que la gente busca?
- ¿En qué intención está? (informational, commercial, transactional, navigational)
- ¿Esta keyword es estacional o evergreen?

Ejemplo:
- Tema: "anteojos para el verano"
- Query principal: "anteojos de sol mujer"
- Intención: commercial (próximo paso compra)
- Estacionalidad: peak octubre-marzo en Argentina

### Step 2 — Recolectar fuentes de datos

Fuentes a usar:

| Fuente | Para qué | Costo |
|--------|----------|-------|
| **Ubersuggest** | Volumen + difficulty + intent | Free / paid |
| **GSC del sitio** | Queries reales donde aparecemos | Free |
| **Google Trends** | Estacionalidad + tendencia | Free |
| **Google autocomplete** | Variaciones que la gente escribe | Free |
| **Google "People Also Ask"** | Preguntas asociadas → FAQ | Free |
| **Google "Related Searches"** | Keywords relacionadas | Free |
| **Ahrefs** (si hay) | Backlinks de competidores + KD | Paid |
| **Answer the Public** | Preguntas estructuradas | Free / paid |
| **AlsoAsked** | Tree de "People Also Ask" | Free / paid |

### Step 3 — Búsqueda inicial

Empezar con la keyword "seed" (raíz) y extraer:

1. **Volumen mensual** en Argentina específicamente
2. **SEO Difficulty** (0-100)
3. **CPC** (indicador de intención comercial)
4. **Intención** (informational / commercial / transactional / navigational)

### Step 4 — Expandir con variaciones

Aplicar modificadores estándar:

**Por género**:
- + "hombre"
- + "mujer"
- + "niños"
- + "unisex"

**Por intención de compra**:
- + "precio"
- + "barato" / "económico"
- + "en oferta"
- + "comprar"
- + "online"
- + "envío"

**Por característica**:
- + "originales"
- + "polarizados"
- + "con aumento" (cruce sol + receta)
- + "deportivos"

**Por estilo / forma**:
- + "redondos" / "cuadrados" / "aviador" / "wayfarer"

**Por marca**:
- + "[marca argentina]"
- + "[marca internacional]"

**Por uso**:
- + "para computadora"
- + "para manejar"
- + "para correr"

**Por demografía**:
- + "para [edad]"
- + "infantiles"

**Por ubicación**:
- + "argentina"
- + "[ciudad]" (CABA, Córdoba, Rosario...)
- + "cerca de mí"

**Long-tail** (más específicas):
- "anteojos para cara redonda mujer"
- "anteojos de sol para manejar de noche"
- "lentes de contacto que se sienten secos"

### Step 5 — Filtrar por valor

Score: `Score = Volumen / (Difficulty + 1)`

Cuanto más alto, más oportunidad. Pero también considerar:

- **Intent commercial vale más que informational**: una keyword con vol 500 transaccional vale más que una vol 2000 informational en algunos casos.
- **Long-tail vs head**: el long-tail tiene menos volumen individual pero convierte mucho mejor.
- **Estacionalidad**: una keyword de "anteojos de sol" en abril tiene poco valor si peakea en noviembre.
- **Competencia actual**: si ya está el sitio en posición 5 para X, no necesita más esfuerzo allí; ir donde estamos en posición 15.

### Step 6 — Validar con SERPs reales

Para las top 5-10 keywords identificadas, buscar en Google (modo incógnito desde Argentina):

- ¿Qué tipo de resultados aparecen? (ecommerce, blog, marketplace, video)
- ¿Está dominado por marketplaces? (ML, Amazon) → más difícil pero no imposible
- ¿Hay featured snippet? → oportunidad si nuestro contenido lo puede ganar
- ¿Hay "People Also Ask" box? → recursos para FAQ
- ¿Hay imágenes / videos? → indicio de qué buscan
- ¿Hay anuncios? → indicio de intención comercial alta

### Step 7 — Definir cluster y estructura

Con las keywords agrupadas:

1. **Identificar la pillar keyword**: la más amplia y de mayor volumen
2. **Identificar las satellite keywords**: subtopic específicos
3. **Mapear cada keyword a una URL** posible
4. **Validar que no canibaliza** URLs existentes

Ejemplo de output:

```yaml
cluster: "Lentes de Contacto Diarias"
pillar:
  keyword: "lentes de contacto diarias"
  volumen: 2200
  difficulty: 18
  url: "/lentes-de-contacto/diarias"
  tipo: category_page
satellites:
  - keyword: "diarias vs mensuales"
    volumen: 720
    difficulty: 12
    url: "/guias/diarias-vs-mensuales-cual-elegir"
  - keyword: "lentes de contacto diarias acuvue moist"
    volumen: 540
    difficulty: 9
    url: "/lentes-de-contacto/acuvue/moist"
  - keyword: "lentes de contacto diarias precio"
    volumen: 480
    difficulty: 14
    url: "/lentes-de-contacto/diarias/ofertas"
```

### Step 8 — Producir reporte

```markdown
# Keyword Research: [tema]

**Fecha**: YYYY-MM-DD
**Cluster propuesto**: [nombre]

## Resumen
- Volumen total del cluster: X
- Difficulty promedio: X
- Intención dominante: [tipo]
- Estacionalidad: [evergreen / pico en mes X]
- Score de oportunidad: [alto / medio / bajo]

## Mapa de keywords

| Keyword | Vol | Diff | Intent | URL propuesta | Tipo |
|---------|-----|------|--------|---------------|------|
| ... | ... | ... | ... | ... | ... |

## Análisis competitivo (top 3 en SERP)
| Posición | Dominio | Tipo de página | Notas |
|----------|---------|----------------|-------|
| 1 | ... | ... | ... |
| 2 | ... | ... | ... |
| 3 | ... | ... | ... |

## Featured snippets / PAA / Rich results
- [Lista de oportunidades de rich results]

## Estacionalidad (si aplica)
[Gráfico mental de Google Trends, picos identificados]

## Acciones propuestas
1. Crear pillar en [URL] con [longitud] palabras
2. Crear satélites en [URLs]
3. Optimizar [URLs existentes] que ya rankean
4. Embedir productos [tipos] en las páginas transaccionales

## Estimación
- Páginas nuevas a crear: X
- Tiempo estimado: X sesiones
- Impacto SEO esperado: [crecimiento de X impresiones / clicks]
```

### Step 9 — Integrar al CONTENT_PLAN.md

Si el cluster pasa la validación:
1. Agregar nuevo cluster a `SEO_STRATEGY.md` (o expandir uno existente)
2. Agregar artículos al backlog en `CONTENT_PLAN.md`
3. Priorizar según score vs lo que ya hay en el backlog

## Casos especiales

### Keywords con cero volumen reportado pero intuición alta

Algunas keywords muy específicas no tienen volumen reportado pero capturan tráfico. Ejemplo: "Rusty Xold 655 polarizado" — vol 0 en Ubersuggest pero gente que sabe lo que quiere lo busca.

Estas long-tails se atacan creando la página de producto bien hecha (no requieren cluster propio).

### Keywords con volumen pero difficulty extrema

Si volumen 10k pero difficulty 80, es probable que sitios consolidados (MercadoLibre, Amazon) dominen. En ese caso:
- Atacar long-tails relacionadas con difficulty bajo
- Construir autoridad en el cluster gradualmente
- Eventualmente la pillar puede subir cuando los satélites linkean al pillar

### Keywords estacionales

"Anteojos para verano" tiene pico en oct-mar. Estrategia:
- Publicar el contenido ~6 semanas antes del peak (agosto-septiembre)
- Le da tiempo a Google de indexar y rankear
- Después del peak, mantener pero no esperar tráfico mes a mes

## Reglas duras

1. **NUNCA atacar keywords sin haber visto los SERPs reales**. El SERP te dice qué espera Google.
2. **NUNCA confiar en un solo dato source**. Ubersuggest puede estar desfasado.
3. **NUNCA priorizar por volumen sin considerar difficulty**.
4. **NUNCA crear contenido para keyword sin intención clara**.
5. **NUNCA olvidar mapear keywords a URLs específicas** — sin URL clara, no se materializa.

## Frecuencia

Hacer keyword research:
- Antes de empezar un cluster nuevo (siempre)
- Trimestralmente para refrescar (volúmenes y difficulty cambian)
- Cuando aparece una keyword inesperada en GSC (validar si vale expandir)
