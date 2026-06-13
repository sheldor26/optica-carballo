# Óptica Carballo — SEO Strategy

## Objetivo

Convertir a Óptica Carballo en **la autoridad de óptica online en Argentina**. Tráfico orgánico como motor principal de adquisición.

## Estado de mercado argentino

- La mayoría de ópticas argentinas usan la web como catálogo + WhatsApp.
- Pocas hacen SEO en serio. Las que sí (Lutz Ferrando, Anteojería Argentina, ÓpticaLine) son caras o limitadas.
- **Ventana enorme** para una óptica con SEO técnico + contenido riguroso + autoridad real.

## Activos heredados (capitalizar)

- **Dominio existente**: `opticacarballo.com.ar` con historia previa.
- **30+ años de marca offline**: trust signal masivo.
- **2000+ ventas en Mercado Libre**: prueba social inicial.
- **Regente matriculada + técnico óptico**: E-E-A-T real para YMYL.

## Principios estratégicos (no se rompen)

1. **Topical authority**: cubrir un tema en profundidad gana sobre cubrir 100 superficialmente.
2. **Marcas primero, formas después**: el keyword research lo demostró (marcas argentinas tienen diff 6-10).
3. **Pillar pages + clusters**: cada cluster tiene un pillar y 5-8 satélites con internal linking bidireccional.
4. **E-E-A-T en cada artículo de salud**: byline con credenciales, revisor, fecha actualizada, fuentes.
5. **Español argentino estricto**: vos, anteojos (no gafas), lentes de contacto (no lentillas).
6. **Mobile-first**: 70%+ del tráfico será mobile.

---

# Arquitectura de URLs

## Reglas duras

- **Idioma**: español argentino completo. `anteojos-de-sol` (no `sol`, no `sunglasses`).
- **Separador**: guión medio (`-`). Nunca underscore.
- **Sin acentos ni ñ**: `montura` no `montura`, `anos` no `años`.
- **Sin stop words excepto cuando ayudan**: ok `de`, `para`, `con`.
- **Sin fechas en URLs** salvo si la keyword las requiere (`tendencias-2026`).
- **Sin parámetros indexables**: filtros via query params con `noindex`.
- **HTTPS obligatorio, sin www, sin trailing slash**.
- **hreflang `es-AR`** siempre.
- **Canonical explícito** en toda página.

## Estructura completa

```
/                                                       ← home

# Anteojos de Sol
/anteojos-de-sol                                        ← pillar categoría
/anteojos-de-sol/[marca]                                ← marca page
/anteojos-de-sol/[marca]/[hombre|mujer]                 ← gender split
/anteojos-de-sol/[marca]/[slug-producto]                ← producto
/anteojos-de-sol/[forma]                                ← forma (redondos, etc)
/anteojos-de-sol/[feature]                              ← feature (polarizados, etc)
/anteojos-de-sol/para-cara/[forma]                      ← uso por forma de cara
/anteojos-de-sol/colecciones/[nombre]                   ← colecciones especiales
/anteojos-de-sol/ofertas                                ← landing de ofertas

# Anteojos de Receta
/anteojos-de-receta                                     ← pillar
/anteojos-de-receta/[marca]
/anteojos-de-receta/[marca]/[slug-producto]
/anteojos-de-receta/multifocales
/anteojos-de-receta/monofocales
/anteojos-de-receta/blue-light
/anteojos-de-receta/infantiles

# Lentes de Contacto
/lentes-de-contacto                                     ← pillar
/lentes-de-contacto/[marca]
/lentes-de-contacto/diarias
/lentes-de-contacto/mensuales
/lentes-de-contacto/toricos
/lentes-de-contacto/multifocales
/lentes-de-contacto/de-color

# Accesorios
/accesorios
/accesorios/[slug-producto]

# Páginas de uso (cluster aparte)
/anteojos-para-computadora
/anteojos-para-manejar
/anteojos-para-correr
/anteojos-para-pescar

# Guías (contenido editorial)
/guias                                                  ← hub
/guias/[slug]                                           ← artículo individual (URL plana)

# Herramientas (IA)
/herramientas/lector-de-receta
/herramientas/recomendador-de-anteojos
/herramientas/asistente
/herramientas/test-fatiga-visual

# Institucionales
/nosotros
/contacto
/sucursales
/turnos                                                 ← V2
/envios-y-devoluciones
/preguntas-frecuentes
/terminos-y-condiciones
/politica-de-privacidad
/politica-de-cookies
/boton-arrepentimiento

# Cuenta de usuario (noindex)
/mi-cuenta/*
/checkout/*
/carrito
```

## Sitemaps

- `/sitemap.xml` (index)
- `/sitemap-productos.xml`
- `/sitemap-categorias.xml`
- `/sitemap-marcas.xml`
- `/sitemap-guias.xml`
- `/sitemap-paginas.xml`

Cada uno con `<lastmod>` dinámico. Productos sin stock se sacan automáticamente.

## Robots.txt

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /carrito
Disallow: /checkout
Disallow: /mi-cuenta
Disallow: /*?

Sitemap: https://opticacarballo.com.ar/sitemap.xml
```

---

# Keyword Research

## Keywords por marca/producto cargados

> **Esta sección es la fuente de verdad** para que `content-writer-medical` y `seo-strategist` sepan qué keywords priorizar al escribir o auditar.
> **Actualizar cada vez** que se cargue un producto nuevo o se haga keyword research nueva con Ubersuggest.

### Cluster: VULK (mayo 2026 — Ubersuggest)

**Keyword head crítica**: `lentes de sol vulk` — **1.300 vol/mes, difficulty 8** (TOP, atacar agresivamente).

**Insight crítico**: en Argentina, `"lentes de sol"` y `"anteojos de sol"` se usan ambos pero NO son intercambiables para SEO. Para marca Vulk, `"lentes de sol vulk"` tiene **6× más volumen** que `"anteojos de sol hombre vulk"` (210). Sin embargo `"anteojos de sol"` (head sin marca) tiene 12.100 vs no aparece "lentes de sol" como head pura. **Conclusión**: en copy de productos Vulk usar AMBOS términos naturalmente; en meta_title arrancar con `Lentes de Sol Vulk` (captura el 1.300).

**Keywords primarias (incluir en copy + meta)**:
| Keyword | Vol/mes | Difficulty | Intent | Donde usar |
|---|---|---|---|---|
| lentes de sol vulk | 1.300 | 8 | transactional+commercial | meta_title, H1 secundario, copy primer párrafo |
| anteojos de sol hombre vulk | 210 | 8 | transactional | copy + alt text |
| anteojos de sol marca vulk | 40 | 36 | navigational | copy (long-tail branded) |
| lentes de sol marca vulk | 20 | 34 | navigational | copy (long-tail branded) |

**Keywords secundarias relevantes para Day Light** (rectangular pequeño polarizado carey verde):
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos de sol polarizados | 170 | 10 | Day Light ES polarizado |
| anteojos de sol rectangulares | 140 | 12 | Es la forma del Day Light |
| anteojos de sol cuadrados | 170 | 14 | Variante cercana a "rectangulares" |
| anteojos de sol carey | 40 | 34 | Color de la variante única actual |
| anteojos de sol unisex | (no medido) | - | El producto es unisex |
| anteojos de sol uv400 | 30 | 35 | Day Light tiene UV400 |

**Long-tails branded captured (low volume but high intent)**:
- `lentes de sol vulk day light demi polarizado` — la búsqueda EXACTA del SKU (vol 0 medido pero alta conversión cuando aparece).
- `lentes de sol vulk hombre polarizados`
- `lentes de sol vulk carey`
- `anteojos lentes de sol vulk day light`

**No usar** (irrelevantes para este producto):
- `lentes de sol vulk niños`, `lentes de sol vulk redondos`, `lentes de sol vulk aviador` (otras formas/segmentos).

### Cluster: RUSTY (junio 2026 — Ubersuggest CSV real)

**Keyword head crítica**: `anteojos rusty` — **3.600 vol/mes, difficulty 8** (head de marca más fuerte del nicho; atacar agresivamente desde el hub `/marcas/rusty` y `/anteojos-de-receta/rusty` + `/anteojos-de-sol/rusty`).

**Insight crítico**: en Rusty conviven dos cabeceras casi iguales en volumen pero distinta dificultad: `anteojos rusty` (3.600/8) y `rusty anteojos` (3.600/13). Usar el orden natural `anteojos rusty` en meta/H1. ⚠️ `lentes rusty` tiene volumen alto (2.400) pero **difficulty 49** — NO usar como primaria; en cambio `rusty lentes` (2.400/10) sí es atacable. A diferencia de Vulk (donde "lentes de sol" gana), en Rusty la familia "anteojos rusty" es la dominante. "Armazón/armazones rusty" confirmado marginal (`armazones rusty` 50/49) — NO encabezar nunca con "armazón".

**Keywords primarias (marca — hub + categorías marca)**:
| Keyword | Vol/mes | Difficulty | Intent | Donde usar |
|---|---|---|---|---|
| anteojos rusty | 3.600 | 8 | commercial, navigational | meta_title hub, H1 `/marcas/rusty`, primer párrafo |
| rusty anteojos | 3.600 | 13 | commercial, navigational | copy (variante natural), alt text |
| rusty lentes | 2.400 | 10 | informational, transactional | copy (NO "lentes rusty" 2.400/49) |
| anteojos rusty hombre | 390 | 9 | commercial, navigational | `/anteojos-de-receta/rusty` (o /sol) split hombre |
| anteojos rusty mujer | 260 | 9 | commercial, navigational | split mujer + copy |
| anteojos rusty originales | 210 | 10 | transactional | copy (trust: óptica autorizada) |

**Keywords por producto cargado**:

*Rusty Opposit Optics (receta, wayfarer, mujer) — slug `rusty-opposit-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos rusty mujer | 260 | 9 | producto femenino de receta |
| lentes wayfarer | 590 | 14 | forma del modelo |
| anteojos wayfarer | 260 | 9 | forma (variante "anteojos") |
| anteojos recetados mujer | 260 | 7 | intención receta + género |
| rusty opposit (branded) | 0 medido | ~4 | long-tail exacto, alta conversión |

*Rusty R-CY 02 Optics (receta, rectangular) — slug `rusty-r-cy-02-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos rectangulares | 480 | 15 | forma del modelo |
| lentes rectangulares | 880 | 10 | forma (variante "lentes") |
| anteojos recetados | 720 | 9 | categoría receta |
| lentes recetados | 390 | 9 | variante receta |
| rusty r-cy 02 (branded) | 0 medido | ~4 | long-tail exacto |

*Rusty de sol (Esvep, Sotion, Eslav, Gresent) — slugs en `/anteojos-de-sol/rusty/[modelo]`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| lentes de sol rusty | 1.300 | 9 | head de sol (variante "lentes", la más alta) |
| anteojos de sol rusty | 880 | 10 | head de sol de la marca |
| lentes de sol hombre rusty | 480 | 9 | modelos masculinos |
| anteojos de sol rusty hombre | 390 | 9 | modelos masculinos |
| rusty lentes de sol mujer | 390 | 9 | modelos femeninos |
| anteojos de sol rusty mujer | 260 | 10 | modelos femeninos |

*Rusty Play (sol, wayfarer, hombre, polarizado en 2/4 variantes) — slug `rusty-play` en `/anteojos-de-sol/rusty/rusty-play`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| lentes de sol hombre rusty | 480 | 9 | head de sol masculino (variante "lentes") |
| anteojos de sol rusty hombre | 320 | 9 | head de sol masculino (variante "anteojos") |
| lentes wayfarer | 590 | 14 | forma del modelo |
| anteojos wayfarer | 260 | 9 | forma (variante "anteojos") |
| anteojos de sol rusty play | 10 | 9 | branded exacto → title + H1 + slug |

Atributo de respaldo (copy/alt, NO primaria por dificultad): `anteojos de sol hombre polarizados`, `anteojos de sol hombre rusty polarizados` (10/36). **Honestidad**: solo 2 de 4 variantes son polarizadas → en copy "polarizados en variantes seleccionadas", nunca afirmar el atributo para todo el modelo. Title: `Anteojos de Sol Rusty Play Polarizados | Óptica Carballo` (55). _(Corrección de consistencia pendiente: la tabla "Rusty de sol" de arriba dice `anteojos de sol rusty hombre = 390/9`, pero el CSV related mide 320/9; el 390 es `anteojos rusty hombre` sin "de sol".)_

*Rusty Terdey (sol, wayfarer, UNISEX, 3/3 variantes polarizadas, G-Flex, policarbonato UV400 cat 3) — slug `rusty-terdey` en `/anteojos-de-sol/rusty/rusty-terdey`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| lentes de sol rusty | 1.300 | 9 | head de sol de la marca (variante "lentes", la más alta) |
| anteojos de sol rusty | 880 | 10 | head de sol de la marca (variante "anteojos") |
| lentes wayfarer | 590 | 14 | forma del modelo |
| anteojos wayfarer | 260 | 9 | forma (variante "anteojos") |
| anteojos de sol polarizados rusty terdey | 0 medido | ~4 | branded exacto (existe en CSV) → title + H1 + slug |

Atributo de respaldo (copy/alt, NO primaria por dificultad): `polarizado lentes de sol` (260/36), `anteojos de sol polarizados mujer` (50/36); único polarizado atacable de la familia: `lentes de sol polarizados y antireflejo` (90/12). **Diferencia con Rusty Play**: Terdey es UNISEX y sus 3/3 variantes son polarizadas → acá SÍ se afirma "polarizados" para todo el modelo (Play 2/4 → "en variantes seleccionadas"). **Anti-canibalización**: Terdey targetea unisex + forma + branded + polarizado; NO pelea `...rusty hombre` (eso es de Play).

*Rusty Patien (sol, wayfarer/cuadrado, UNISEX, 1/4 variante polarizada — MBLK/S10 POL; resto antirreflex/espejada/sin polarizar; bisagras metálicas flex, G-Flex, policarbonato UV400 cat 3) — slug `rusty-patien` en `/anteojos-de-sol/rusty/rusty-patien`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| lentes de sol rusty | 1.300 | 9 | head de sol de la marca (variante "lentes", la más alta) |
| anteojos de sol rusty | 880 | 10 | head de sol de la marca (variante "anteojos") |
| lentes wayfarer | 590 | 14 | forma del modelo |
| anteojos wayfarer | 260 | 9 | forma (variante "anteojos") |
| anteojos de sol rusty patien | 0 medido | ~4 | branded exacto → title + H1 + slug |

**Honestidad (como Play)**: solo 1 de 4 variantes es polarizada (MBLK/S10 POL) → NUNCA afirmar "polarizados" en el H1/primera línea del modelo; el atributo se acota a la variante. **Anti-canibalización (3 wayfarer Rusty)**: Patien = unisex + branded + forma (NO afirma polarizado, NO pelea `...rusty hombre`); Terdey = unisex + polarizado de modelo (3/3, dueño de `anteojos de sol polarizados rusty`); Play = hombre (dueño de `...rusty hombre` / `lentes de sol hombre rusty` 480/9). Title: `Anteojos de Sol Rusty Patien Unisex | Óptica Carballo`.

**Long-tails branded (vol bajo / dif 4-9, alta intención)**: nombre de modelo exacto por SKU (Esvep / Sotion / Eslav / Gresent / Play / Terdey / Patien / Opposit / R-CY 02): vol 0 medido pero conversión alta. Incluir en title + H1 + slug de cada producto. También `modelos de anteojos de sol rusty` (10/8), `anteojos rusty originales` (210/10).

**No usar**:
- `lentes rusty` (2.400 pero dif 49), `armazones rusty` (50/49), `armazones rusty mujer` (20/44) — difficulty prohibitiva y/o término muerto.
- `anteojos rusty` como primaria de un PRODUCTO individual (es del hub `/marcas/rusty` y de las categorías marca; los productos targetean modelo + forma + género para no canibalizar).

**Internal linking del cluster**:
- Hub `/marcas/rusty` → `/anteojos-de-receta/rusty` + `/anteojos-de-sol/rusty` + top productos Rusty + guía de forma. Mantenerlo navegacional (no compite la SERP transaccional de las categorías).
- `/anteojos-de-sol/rusty` ↔ `/anteojos-de-receta/rusty` (cross-link sol↔receta de la misma marca).
- Cada producto Rusty → su categoría marca + `/marcas/rusty` + 4-8 Rusty similares + guía relacionada (forma: `/guias/anteojos-segun-forma-de-cara`; sol: pillar `/guias/anteojos-de-sol-guia-completa`).
- Split por género `/anteojos-de-sol/rusty/hombre` y `/mujer` cuando haya ≥4 productos por género (capturan `...rusty hombre/mujer` 260-480, dif 9-10).

### Cluster: VULK MY CREW (receta — junio 2026)

Vulk My Crew es RECETA, no canibaliza el cluster Vulk-sol de arriba (intención distinta). Head de marca para receta = `anteojos vulk` (4.400/11) y `lentes vulk` (6.600/10) → pertenecen al hub `/marcas/vulk`, NO al producto. El producto targetea modelo + forma redonda + unisex.

| Keyword | Vol/mes | Difficulty | Rol | Dónde |
|---|---|---|---|---|
| anteojos vulk | 4.400 | 11 | head de marca (receta) | H1 secundario / primer párrafo (NO primaria del producto) |
| anteojos vulk mujer | 320 | 8 | atributo (unisex cubre mujer) | copy + alt |
| anteojos vulk hombre | 260 | 8 | atributo (unisex cubre hombre) | copy + alt |
| anteojos redondos / redondos mujer | 880 / 320 | 12 / 16 | forma | copy, ficha |
| vulk my crew (branded) | 0 medido | ~4 | long-tail exacto, alta conversión | title, H1, slug |

Secundarias de respaldo: `anteojos para mujer` (480/7), `armazones vulk` (110/8 — único "armazón" con algo de volumen, usable 1 vez en cuerpo). **No usar**: "armazón de receta" como cabecera; "lentes vulk" (6.600 pero ambiguo sol/receta → va al hub). Linking: ↑ `/anteojos-de-receta` + `/anteojos-de-receta/vulk`; → `/marcas/vulk`; ↔ `vulk-clems` + redondos/unisex de otras marcas; → guías de elección y forma de cara.

### Reglas para futuros productos

Cuando se cargue un producto nuevo, ANTES de escribir copy:
1. **NORMA (founder 2026-06-11)**: invocar SIEMPRE los agentes que correspondan (mínimo `seo-strategist` + `catalog-loader`) y usar el MCP de Ubersuggest. Si Ubersuggest no funciona (solo expone auth a mitad de sesión), leer los CSV de la carpeta `KEYWORDS OPTICA/`. NO escribir meta/copy a ojo.
2. Agregar sub-sección acá con el patrón "Cluster: MARCA" + tabla de keywords primarias/secundarias/long-tails.
3. `content-writer-medical` debe leer la sección de la marca correspondiente antes de escribir.
4. `seo-strategist` debe leer la sección antes de auditar slug/meta/internal linking.

### Plantilla para nueva marca cargada

```markdown
### Cluster: <MARCA EN MAYÚSCULAS> (fecha Ubersuggest)

**Keyword head crítica**: `<keyword>` — **<vol> vol/mes, difficulty <X>**.

**Insight crítico**: <observación importante de los datos>.

**Keywords primarias**:
| Keyword | Vol/mes | Difficulty | Intent | Donde usar |
|---|---|---|---|---|
...

**Keywords secundarias**:
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
...

**Long-tails branded**:
- ...

**No usar**:
- ...
```

---

## Datos cargados (Ubersuggest, mayo 2026)

### Volúmenes principales

| Keyword | Volumen | SEO Difficulty |
|---------|---------|----------------|
| anteojos | 14.800 | 24 |
| anteojos de sol | 12.100 | 13 |
| lentes de contacto | 14.800 | 28 |
| anteojos de receta | 90 | 43 |
| optica online | 170 | 30 |
| armazones | 320 | 10 |
| lentes de contacto de color | 2.900 | 13 |

### Marcas argentinas (PRIORIDAD #1)

| Marca | Vol total | Difficulty | Estado |
|-------|-----------|------------|--------|
| **Rusty** | 6.000 | 9 | TOP — atacar primero |
| **Reef** | 3.400 | 7-9 | TOP |
| **Vulk** | 2.500 | 8 | TOP |
| **Infinit** | 2.100 | 19 | High |
| **Prune** | 2.000 | 6 | TOP — difficulty mínima |
| **Union Pacific** | 1.700 | 7 | High |
| **Wanama** | 1.100 | 7 | High |
| **Orbital** | 1.100 | 6 | High |

### Colaboraciones de celebridades

| Keyword | Vol | Difficulty |
|---------|-----|------------|
| Las Oreiro | 1.100 | 6 |
| Paula Cahen d'Anvers | 1.100 | 9 |
| Valeria Mazza | 1.100 | 10 |
| Teresa Calandra | 1.100 | 13 |
| Infinit by Pampita | 500 | 36 |

(Pendiente confirmar stock antes de activar — ADR-009)

### Marcas internacionales

| Marca | Vol | Difficulty |
|-------|-----|------------|
| Ray-Ban (con "anteojos de sol") | 7.200 | 14 |
| Prada | 2.600 | 8 |
| Miu Miu | 1.700 | 16 |
| Tiffany | 1.700 | 7 |
| Oakley | 1.400 | 8 |
| Versace | 1.100 | 9 |

### Forma de montura

| Forma | Vol | Difficulty |
|-------|-----|------------|
| Redondos | 2.100 | 18 |
| Cuadrados | 1.700 | 14 |
| Aviador | 1.100 | 10 |
| Wayfarer | 1.400 | 14 |
| Rectangulares | 1.400 | 12 |

### Features

| Feature | Vol | Difficulty |
|---------|-----|------------|
| Polarizados | 1.700 | 10 |
| Con aumento (graduados) | 3.200 | 18 |
| Deportivos | 1.100 | 10 |
| Originales | 3.900 | 10 |
| Baratos | 1.100 | 11 |
| En oferta | 1.100 | 11 |
| Por mayor | 1.400 | 8 |

### Casos de uso

| Use case | Vol | Difficulty |
|----------|-----|------------|
| Para cara redonda | 2.100 | 12 |
| Para computadora | (investigar) | - |
| Para manejar | (investigar) | - |

### Demográfico

| Tipo | Vol | Difficulty |
|------|-----|------------|
| Para hombre / hombres | 720 + 3.200 | 10 |
| Para mujer | 480 + 3.200 | 11 |

## Score de priorización

`Score = Volumen / (Difficulty + 1)`

Cuanto más alto, más prioridad. Esto da:

**Top 10 oportunidades**:
1. Rusty hombre — 3.200/10 = 320
2. Reef hombre — 1.700/8 = 213
3. Vulk hombre — 2.100/9 = 233
4. Prada — 2.600/9 = 289
5. Prune — 1.700/7 = 243
6. Union Pacific — 1.700/8 = 213
7. Tiffany — 1.700/8 = 213
8. Para mujer — 3.200/12 = 267
9. Para hombres — 3.200/11 = 291
10. Originales mujer — 3.900/11 = 325

(Los puntajes son orientativos, el agent `seo-strategist` los recalcula en cada decisión)

---

# Topic clusters

Cada cluster tiene un pillar (3.000-5.000 palabras) y 5-8 satélites (1.200-2.000 palabras).

## 🎯 MAPA DE KEYWORDS — Defectos refractivos (research real AR, Ubersuggest 2026-06-01)

> Volúmenes y dificultad REALES (no estimaciones) provistos por el founder.
> Fuente de verdad para `content-writer-medical` al escribir las 4 pillars +
> satélites. Vol = búsquedas/mes AR. Dif = SEO difficulty (0-100).
>
> **Hallazgo clave**: astigmatismo es el de mayor volumen (22.200), no miopía.
> Dos clusters transversales de alto volumen + baja dificultad que NO estaban
> en el plan original: "cómo se ve" y "diferencias/comparación". Priorizarlos.

### Pillar ASTIGMATISMO — slug `/guias/astigmatismo`
- **Primaria**: `astigmatismo` (22.200/29), `astigmatismo que es` (14.800/21), `que es el astigmatismo` (2.900/21)
- **Secundarias a incluir**: `astigmatismo definicion` (590/39), `astigmatismo que significa` (260/23), `astigmatismo causas` (110/26), `astigmatismo es hereditario` (110/10), `astigmatismo ocular` (110/34)
- **Satélites**:
  - `/guias/astigmatismo-como-se-ve` → `astigmatismo como se ve` (1.900/13) + `como se ve con astigmatismo` (1.900/18) + `como ve una persona con astigmatismo` (1.300/15) + `astigmatismo como se ve de noche` (20/7). 🥇 baja dif, alto volumen.
  - `/guias/como-se-corrige-el-astigmatismo` → `como se corrige el astigmatismo` (480/22) + `astigmatismo que es y como se corrige` (480/24) + `se opera el astigmatismo` (590/10, ⚠️ YMYL derivar) + `astigmatismo se corrige con lentes` (50/8)
  - `/guias/test-de-astigmatismo` → `test de astigmatismo` (110/10) + `astigmatismo test` (110/11) + `como saber si tengo astigmatismo` (110/10). 🥇
  - `/guias/tipos-de-astigmatismo` → `tipos de astigmatismo` (90/12) + `astigmatismo regular e irregular` (30/6) + `grados de astigmatismo` (110/13) + `astigmatismo miopico` (480/15). (Técnico — regular vs irregular, ver brief.)

### Pillar HIPERMETROPÍA — slug `/guias/hipermetropia`
- **Primaria**: `hipermetropia` (14.800/37), `hipermetropia que es` (5.400/15), `que es la hipermetropia` (1.300/16)
- **Secundarias**: `hipermetropia significado` (260/28), `hipermetropia como se ve` (170/16), `hipermetropia como ven` (50/13), `tratamiento para hipermetropia` (40/16)
- **Satélites**:
  - `/guias/hipermetropia-y-presbicia-no-son-lo-mismo` → `hipermetropia y presbicia` (210/17) + `hipermetropia presbicia` (210/23) + `hipermetropia y presbicia es lo mismo` (30/7). (Punto #3 del brief técnico.)
  - `/guias/hipermetropia-en-ninos` → YMYL (ambliopía/ojo vago); vol bajo pero importante. Firma regente.
  - `/guias/hipermetropia-latente-y-manifiesta` → técnico/autoridad (vol bajo, demuestra E-E-A-T).

### Pillar MIOPÍA — slug `/guias/miopia`
- **Primaria**: `miopia` (12.100/37-45), `miopia que es` (8.100/28), `que es miopia` (1.900/18)
- **Secundarias**: `miopia como se ve` (320/22), `miopia significado` (110/26), `miopia causas` (90/23), `la miopia es hereditaria` (140/15), `miopia ojo` (260/20)
- **Satélites**:
  - `/guias/miopia-magna-alta` → `miopia magna` (320/16) + `miopia alta` (70/20). 🔴 YMYL: riesgo retiniano, controles, banderas rojas (desprendimiento). Firma regente.
  - `/guias/grados-de-miopia` → `grados de miopia` (140/12) + `tipos de miopia` (170/14) + `miopia leve` (70/20)
  - `/guias/se-puede-operar-la-miopia` → `miopia se puede operar`/`la miopia se opera` (390/17-21). ⚠️ YMYL fuerte: decisión del oftalmólogo, honestidad sobre que no frena la elongación.
  - `/guias/miopia-en-ninos-control` → control de progresión (decisión médica), YMYL. Firma regente.

### Pillar PRESBICIA — slug `/guias/presbicia`  (research real AR 2026-06-01 — REVISADO)
> ⚠️ Corrección: presbicia es MUCHO más grande de lo estimado. Head term = **12.100/21** (empata con miopía), no 4.400.
- **Primaria**: `presbicia` (12.100/21), `presbicia que es` (4.400/15), `que presbicia` (1.600/25), `que es la presbicia` (720/23)
- **Secundarias**: `presbicia definicion` (390/30), `presbicia que es y como se corrige` (260/14), `presbicia como se ve` (140/20), `sintomas de la presbicia` (140/12), `presbicia significado` (90/31), `presbicia en mujeres` (90/20)
- **⚠️ "vista cansada"**: sigue SIN aparecer como head term en el research (señales: `por qué a la presbicia se le llama vista cansada`, `presbicia o vista cansada` 10). Hacer research puntual de `vista cansada` — es el término coloquial dominante AR y casi seguro tiene volumen alto. Igual, USAR "vista cansada" como sinónimo en la pillar (title/H2/cuerpo).
- **Satélites**:
  - 🥇 `/guias/gotas-para-la-presbicia-funcionan` → **sub-cluster grande + comercial + YMYL**: `gotas para la presbicia` (3.600/16) + `presbicia con gotas` (880/31) + `gotas para presbicia` (720/12) + `presbicia gotas` (210/15) + variantes "elea/argentina/precio" (~6.000 comb). **Tema honestidad perfecto**: las gotas (Elea/pilocarpina) — qué hacen, qué no, para quién. 🔴 YMYL: producto farmacológico, claims con cuidado, derivar a oftalmólogo. Firma regente.
  - `/guias/se-puede-operar-la-presbicia` → `presbicia se opera`/`la presbicia se opera` (880/10) + `presbicia es operable` (30-50/17-27). ⚠️ YMYL: decisión médica.
  - `/guias/lentes-para-presbicia` → `lentes para presbicia` (140/11) + `anteojos para la presbicia` (110/11) + `lentes de contacto para presbicia` (140/10). Transaccional → CRUCE con cluster A (multifocales/progresivos), no duplicar; este enfoca "qué lente para presbicia", A enfoca el diseño.
  - Cruces: `astigmatismo y presbicia` (390/9, 🥇) + `presbicia y miopia` (110/11) + `hipermetropia y presbicia` (210/17) → alimentan el satélite transversal de diferencias.

### 🥇 SATÉLITES TRANSVERSALES (cross-condición) — alto volumen, baja dificultad, PRIORIDAD
> No "pertenecen" a una sola pillar — son comparativos. Enlazar a las 3-4 pillars. Capturan volumen enorme a dif 10-20.
- `/guias/diferencia-miopia-hipermetropia-astigmatismo` → `astigmatismo y miopia` (5.400/12) + `miopia o astigmatismo` (5.400/20) + `astigmatismo miopia diferencia` (880/10) + `astigmatismo y miopia diferencia` (720/17) + `que es el astigmatismo y la miopia` (480/12) + `diferencia entre astigmatismo y miopia` (260/11) + `astigmatismo hipermetropia` (1.000/11) + `hipermetropia y astigmatismo` (880/11) + `miopia y hipermetropia` (170/11). **El artículo de mayor ROI del set.**
- `/guias/astigmatismo-y-miopia-juntos` → `astigmatismo y miopia juntos` (170/12) + `astigmatismo miopico` (480/15) + `como ve una persona con miopia y astigmatismo` (480/24) + `miopia y astigmatismo como se ve` (320/17). (Combo clínico muy común.)

### Secuencia de escritura sugerida (por ROI: volumen × baja dif × intención)
1. **Pillar Astigmatismo** (el más grande, 22.200) + satélite `astigmatismo-como-se-ve` (5.000 comb, dif 13).
2. **Satélite transversal `diferencia-miopia-hipermetropia-astigmatismo`** (volumen enorme, dif 10-12) — se puede escribir apenas existan las 3 pillars para enlazar, o como puente temprano.
3. **Pillar Miopía** + **Pillar Hipermetropía** (habilitan el transversal y los "vs presbicia").
4. **Pillar Presbicia** (+ validar "vista cansada" antes).
5. Resto de satélites por cluster.

---

## Cluster 1: Astigmatismo

**Pillar**: `/guias/astigmatismo-guia-completa`

**Satélites**:
- `/guias/que-es-astigmatismo-sintomas`
- `/guias/astigmatismo-grados-leve-moderado-severo`
- `/guias/lentes-de-contacto-para-astigmatismo`
- `/guias/anteojos-para-astigmatismo`
- `/guias/como-se-corrige-astigmatismo`
- `/guias/astigmatismo-en-ninos`

## Cluster 2: Miopía

**Pillar**: `/guias/miopia-guia-completa`

**Satélites**:
- `/guias/que-es-miopia-causas-sintomas`
- `/guias/miopia-en-ninos-control-progresion`
- `/guias/lentes-para-miopia-alta`
- `/guias/cirugia-miopia-vs-anteojos`
- `/guias/lentes-de-contacto-para-miopia`
- `/guias/miopia-y-fatiga-digital`

## Cluster 3: Hipermetropía

**Pillar**: `/guias/hipermetropia-guia-completa`

**Satélites**:
- `/guias/que-es-hipermetropia-sintomas`
- `/guias/hipermetropia-en-ninos`
- `/guias/diferencia-miopia-hipermetropia`
- `/guias/correccion-de-hipermetropia`

## Cluster 4: Presbicia

**Pillar**: `/guias/presbicia-guia-completa`

**Satélites**:
- `/guias/que-es-presbicia-cuando-empieza`
- `/guias/lentes-multifocales-vs-bifocales`
- `/guias/lentes-ocupacionales`
- `/guias/lentes-de-contacto-multifocales`
- `/guias/ejercicios-vista-cansada`
- `/guias/adaptacion-a-multifocales`

## Cluster 5: Anteojos para computadora / Fatiga visual digital

**Pillar**: `/guias/anteojos-para-computadora-guia-completa`

**Satélites**:
- `/guias/sindrome-visual-informatico`
- `/guias/blue-light-evidencia-real`
- `/guias/lentes-ocupacionales-para-trabajo`
- `/guias/ergonomia-visual-pantallas`
- `/guias/fatiga-visual-sintomas-prevencion`

## Cluster 6: Lentes de contacto

**Pillar**: `/guias/lentes-de-contacto-guia-completa`

**Satélites**:
- `/guias/cuidado-lentes-de-contacto`
- `/guias/primer-uso-lentes-de-contacto`
- `/guias/diarias-vs-mensuales-cual-elegir`
- `/guias/lentes-de-contacto-toricos`
- `/guias/lentes-de-contacto-problemas-comunes`
- `/guias/lentes-de-contacto-para-ninos`
- `/guias/lentes-de-contacto-de-color`

## Cluster 7: Cómo elegir anteojos

**Pillar**: `/guias/como-elegir-anteojos-guia-completa`

**Satélites**:
- `/guias/anteojos-segun-forma-de-cara`
- `/guias/anteojos-para-cara-redonda`
- `/guias/anteojos-para-cara-cuadrada`
- `/guias/anteojos-para-cara-ovalada`
- `/guias/anteojos-para-cara-corazon`
- `/guias/materiales-de-anteojos-acetato-metal-titanio`
- `/guias/medidas-anteojos-como-elegir-talle`
- `/guias/primer-par-de-anteojos`

## Cluster 8: Cómo leer una receta

**Pillar**: `/guias/como-leer-receta-anteojos`

**Satélites**:
- `/guias/que-es-esfera-en-receta-anteojos`
- `/guias/que-es-cilindro-y-eje`
- `/guias/que-es-dnp-distancia-nasopupilar`
- `/guias/que-es-adicion-en-receta`
- `/guias/receta-vencida-puedo-usar`

## Cluster 9: Tendencias

**Pillar**: `/guias/tendencias-anteojos-2026`

**Satélites** (rotan por año):
- `/guias/anteojos-de-moda-mujer-2026`
- `/guias/anteojos-de-moda-hombre-2026`
- `/guias/colores-de-moda-monturas`
- `/guias/anteojos-famosos-argentinos`

---

# Topic clusters TÉCNICOS DE LENTE (añadidos 2026-06-01 — diseñados por seo-strategist)

> Gap detectado: los clusters 1-9 cubren patologías, uso y elección de armazón,
> pero los temas TÉCNICOS DE LA LENTE (diseño, material, tratamiento, sol técnico)
> estaban sueltos. Son mid-funnel de ALTA intención de compra y el moat técnico
> del founder. **Volúmenes = ESTIMACIONES a validar con keyword research formal
> (Ubersuggest AR), salvo donde se indica que ya están en research.** Precisión
> técnica de cada tema → validar con `optical-expert` antes de publicar.
>
> Nomenclatura: "cristales"/"lentes" = componente óptico; "anteojos" = producto
> terminado; "armazón" = marco. No canibalizar entre sí.
>
> **Prerequisito de implementación** (obligatorio antes de escribir): agregar los
> 4 valores nuevos al `type ArticleCluster` (`lib/content/article-types.ts`) +
> `CLUSTER_LABELS` (`lib/content/article-clusters.ts`), si no el breadcrumb,
> internal linking y `BreadcrumbList` schema salen rotos. Valores sugeridos:
> `diseno-de-lente`, `materiales-de-lente`, `tratamientos-de-lente`,
> `anteojos-de-sol-tecnico`.

## Cluster A (10): Diseño de lente — monofocal / bifocal / progresivo

**Pillar**: `/guias/tipos-de-lentes-receta-guia-completa` — "Tipos de cristales: monofocales, bifocales y progresivos"

**Satélites**:
- `/guias/lentes-multifocales-progresivos-que-son` — kw "lentes progresivos"
- `/guias/progresivos-vs-bifocales`
- `/guias/lentes-monofocales-que-son`
- `/guias/lentes-ocupacionales-oficina`
- `/guias/primera-vez-progresivos-adaptacion` (retención post-compra)
- `/guias/lentes-progresivos-precio-argentina` (transaccional puro)

**Cruces**: → `/anteojos-de-receta/multifocales` + `/monofocales`; → `/guias/como-leer-receta-anteojos` (ADD/adición ya explicado ahí).

## Cluster B (11): Materiales de lente — CR-39 / policarbonato / MR-8 / alto índice / vidrio

**Pillar**: `/guias/materiales-de-lentes-cual-elegir` — "Materiales de cristales: CR-39, policarbonato, MR-8 y alto índice"
⚠️ = la guía firmada "Policarbonato/CR-39/MR-8" del Plan 2026. NO es artículo nuevo: es el ancla del cluster.

**Satélites**:
- `/guias/policarbonato-que-es-lentes`
- `/guias/cr-39-organico-que-es`
- `/guias/lentes-alto-indice-graduacion-alta` (ticket alto; puente con miopía/hipermetropía alta)
- `/guias/lentes-vidrio-vs-organico` (legacy, vidrio casi discontinuado)
- `/guias/lentes-policarbonato-vs-cr39`
- `/guias/cristales-anteojos-ninos-resistentes` → `/anteojos-de-receta/infantiles`

**Cruces**: material y diseño son decisiones paralelas → linkeo bidireccional pillar A ↔ pillar B.

## Cluster C (12): Tratamientos de lente — antirreflex / filtro azul / fotocromáticos

**Pillar**: `/guias/tratamientos-de-lentes-guia-completa` — "Tratamientos para cristales: antirreflex, filtro azul y fotocromáticos"

**Satélites**:
- `/guias/antirreflex-que-es-sirve`
- `/guias/filtro-luz-azul-evidencia-real` — bluecut, **diferenciador honesto** (evidencia real)
- `/guias/lentes-fotocromaticos-que-son`
- `/guias/fotocromatico-bluecut-combinado`
- `/guias/tratamientos-lentes-valen-la-pena` (comparativa honesta + CTA WhatsApp)

**⚠️ Riesgo de canibalización a vigilar**: `filtro-luz-azul-evidencia-real` (C) vs Cluster 5 (computadora). Deslinde: Cluster 5 = fatiga visual/hábitos/ergonomía; Cluster C = qué es el recubrimiento + evidencia. Cross-link bidireccional, NO duplicar.

## Cluster D (13): Anteojos de sol técnico — filtros 0-4 / polarizado vs tintado

**Pillar**: `/guias/anteojos-de-sol-guia-completa` — "Cómo elegir anteojos de sol: filtros, polarizados y protección UV"

**Satélites**:
- `/guias/polarizados-cuando-sirven` — kw "lentes polarizados" (1.700 vol / dif 10, **ya en research**). = guía firmada del Plan.
- `/guias/polarizado-vs-tintado-diferencia`
- `/guias/categorias-filtro-solar-0-a-4`
- `/guias/proteccion-uv-anteojos-de-sol` (YMYL, E-E-A-T reforzado byline regente)
- `/guias/lentes-espejados-degrade-tipos`
- `/guias/anteojos-de-sol-con-aumento` (3.200 vol / dif 18, **ya en research**; puente sol↔receta)

**Cruces**: → `/anteojos-de-sol/polarizados`, `/anteojos-de-sol` raíz, marcas top. Catálogo de sol YA cargado → ROI rápido.

## Secuencia de implementación recomendada (seo-strategist)

Método: completar UN cluster (pillar + 3-5 satélites) antes del siguiente, no pillars sueltas.

1. **Cluster D (sol técnico) PRIMERO** — mayor volumen transaccional del sitio (sol 12.100), catálogo cargado, keyword validada (polarizados 1.700/10), pillar+satélite ya firmados. Arranque concreto: pillar D + `polarizados-cuando-sirven`.
2. **Cluster B (materiales)** — pillar ya firmada, intención pre-compra de receta máxima, moat técnico, habilita puente alto-índice↔miopía alta (sube ticket).
3. **Cluster A (diseño)** — progresivos alta intención; va tras B porque material+diseño se venden juntos.
4. **Cluster C (tratamientos)** — último: resolver antes la canibalización bluecut↔computadora; antirreflex/fotocromático son add-ons, no driver.

---

# Structured Data (JSON-LD)

## Tipos por página

| Página | Schemas |
|--------|---------|
| Home | `Organization` + `LocalBusiness` |
| Producto | `Product` + `Offer` o `AggregateOffer` con `hasVariant` + `AggregateRating` |
| Categoría | `CollectionPage` + `BreadcrumbList` |
| Artículo general | `Article` + `Person` (autor) |
| Artículo médico | `MedicalWebPage` adicionalmente |
| FAQ section | `FAQPage` |
| Reviews | `Review` + `AggregateRating` |
| Herramienta | `WebApplication` |

## LocalBusiness completo (home)

```json
{
  "@context": "https://schema.org",
  "@type": "Optician",
  "name": "Óptica Carballo",
  "image": "https://opticacarballo.com.ar/og-local.jpg",
  "url": "https://opticacarballo.com.ar",
  "telephone": "+54-xxx-xxx-xxxx",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[calle y número]",
    "addressLocality": "Virasoro",
    "addressRegion": "Corrientes",
    "postalCode": "[CP]",
    "addressCountry": "AR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "...",
    "longitude": "..."
  },
  "openingHoursSpecification": [...],
  "founder": {
    "@type": "Person",
    "name": "[Nombre del fundador]"
  },
  "foundingDate": "1995",
  "employee": [
    {
      "@type": "Person",
      "name": "María Carlota Carballo",
      "jobTitle": "Óptica Regente",
      "hasCredential": {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "license",
        "name": "Matrícula Profesional de Óptica"
      }
    },
    {
      "@type": "Person",
      "name": "Juan Carballo",
      "jobTitle": "Técnico Superior en Óptica y Contactología"
    }
  ]
}
```

(Datos exactos a completar)

---

# Internal linking rules

1. **Breadcrumbs en toda página** (excepto home) con `BreadcrumbList` schema.
2. **Producto → categoría padre + marca + productos similares (4-8) + guía relacionada**.
3. **Categoría → subcategorías + top productos + pillar guide del cluster**.
4. **Artículo satélite → pillar + 2-4 otros satélites del cluster + 2-3 productos relacionados**.
5. **Pillar → todos los satélites del cluster**.
6. **Footer sitewide → top 10 categorías + top 10 guías + páginas institucionales**.
7. **Anchor text descriptivo**. Nunca "click acá", "leer más" como único anchor. Variar naturalmente.

---

# Meta tags

## Title

- Máximo 60 caracteres
- Patrón: `[Keyword principal] | [Diferenciador útil] - Óptica Carballo`
- Ejemplos:
  - `Anteojos de Sol Rusty Hombre | Originales con Envío - Óptica Carballo`
  - `Guía: Cómo Leer la Receta de Anteojos | Óptica Carballo`
  - `Lentes de Contacto Acuvue Oasys Mensuales | Óptica Carballo`

## Meta description

- 150-160 caracteres
- Keyword principal + propuesta de valor + CTA suave
- Ejemplo: `Anteojos Rusty originales para hombre. Envíos a todo el país, 30 años de experiencia, asesoramiento de técnico óptico. Cuotas sin interés.`

## H1

- Único en la página, con keyword principal natural.

---

# E-E-A-T para YMYL

Cada página de salud/óptica incluye:

1. **Byline con credenciales visibles**:
   ```
   Por Juan Carballo
   Técnico Superior en Óptica y Contactología — Mat. [número]
   ```

2. **Reviewer cuando aplica**:
   ```
   Revisado por María Carlota Carballo, Óptica Regente
   Matrícula Profesional [número]
   ```

3. **Fecha de publicación + última actualización**.

4. **Fuentes citadas** (cuando hay datos): OMS, Sociedad Argentina de Oftalmología, AAO, PubMed, Essilor/Zeiss/Hoya, Johnson & Johnson, etc.

5. **Disclaimer médico** al final:
   > Este contenido tiene fines informativos y no reemplaza el diagnóstico ni el tratamiento de un médico oftalmólogo matriculado.

6. **Schema `Person` para autor** con `jobTitle`, `worksFor`, `hasCredential`.

---

# Performance (Core Web Vitals)

Targets:
- LCP <2.5s
- INP <200ms
- CLS <0.1
- TTFB <600ms

Tácticas:
- `next/image` con dimensiones explícitas en todas las imágenes.
- `next/font` para fuentes (sin FOIT/FOUT).
- Imágenes en WebP/AVIF.
- Lazy loading excepto LCP.
- Bundle splitting agresivo.
- Edge rendering donde aplica.
- Prefetch de links críticos.

---

# Monitoring SEO

## Diario
- Errores 4xx/5xx (Vercel logs)
- Sitemap accesible

## Semanal
- GSC: impresiones, clicks, CTR, posición
- Páginas con problemas de indexación
- Páginas con CTR <2% (problema de meta tags)

## Mensual
- Crecimiento de páginas en top 10
- Comparación contra targets de `METRICS.md`
- Análisis de queries inesperadas (oportunidades nuevas)
- Auditoría con agente `seo-strategist`

## Trimestral
- Análisis de competencia (skill `/competitor-analysis`)
- Refresh del keyword research
- Re-priorización del backlog editorial

---

# Pendientes SEO

1. **Verificar dominio en GSC** una vez en producción.
2. **Configurar GA4** con eventos custom.
3. **Verificar redirects** de URLs viejas del Mercadoshops (ver PEND-003 en DECISIONS.md).
4. **Backlinks**: estrategia post-launch (mes 3+). Posibles fuentes: directorios locales, blogs de salud argentinos, prensa local de Corrientes.
5. **Google Business Profile** del local físico (para LocalBusiness signals).

---

# Notas finales

- Este archivo es **vivo**. Cada nueva oportunidad descubierta se agrega acá.
- El `seo-strategist` es el guardián. Cualquier cambio estructural pasa por él.
- En cada `/agent-review`, se evalúa si la estrategia sigue alineada con los datos reales.
