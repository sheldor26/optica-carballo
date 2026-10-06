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

*Vulk The Sil (sol, cuadrado, UNISEX, 3/3 variantes polarizadas, Grilamid/TR-90, policarbonato UV400 cat 3, talle large) — slug `vulk-the-sil` en `/anteojos-de-sol/vulk/vulk-the-sil`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| lentes de sol vulk | 1.300 | 8 | head de sol de la marca (variante "lentes", la más alta) |
| anteojos de sol vulk | 880 | 10 | head de sol de la marca (variante "anteojos") |
| lentes de sol cuadrados | 390 | 11 | forma del modelo (variante "lentes") |
| anteojos de sol cuadrados | 170 | 14 | forma (variante "anteojos") → H1 |
| anteojos de sol polarizados vulk the sil | 0 medido | ~4 | branded exacto (existe en CSV) → title + H1 + slug |

Atributo de respaldo (copy/alt, NO primaria por dificultad): `polarizado lentes de sol` (260/36). Branded long-tails (CSV): `lentes de sol vulk the sil` (203), `anteojos de sol vulk the sil` (71), `anteojos de sol polarizados vulk the sil` (62), `...lentes polarizados blue` (131) → alt de variantes. **Honestidad**: 3/3 polarizadas → SÍ se afirma "polarizados" para todo el modelo. **Anti-canibalización (sol Vulk)**: The Sil = cuadrado + polarizado de modelo + branded; Day Light = rectangular/carey; My Crew = receta. Sin keyword primaria compartida. Unisex → NO pelea `lentes/anteojos de sol vulk hombre`. Title: `Lentes de Sol Vulk The Sil Polarizados | Óptica Carballo`.

*Vulk Raven (sol, WAYFARER, UNISEX, 2/3 variantes polarizadas + 1 revo espejada, G-Flex, policarbonato UV400 cat 3, talle medium 26g) — slug `vulk-raven` en `/anteojos-de-sol/vulk/vulk-raven`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| lentes de sol vulk | 1.300 | 8 | head de sol de la marca (variante "lentes", la más alta) → meta_title + 1er párrafo |
| anteojos de sol vulk | 880 | 10 | head de sol de la marca (variante "anteojos") → copy/H1 alt |
| lentes wayfarer | 590 | 14 | forma del modelo → H1, copy |
| anteojos wayfarer | 260 | 9 | forma (variante "anteojos") → copy, alt text |
| anteojos/lentes de sol vulk raven | 0 medido | ~4 | branded exacto → title + H1 + slug + alt |

Atributo de respaldo (copy/alt, NO primaria por dificultad): `anteojos de sol polarizados` (170/10), `lentes de sol polarizados` (260/12), `anteojos de sol unisex`. **Honestidad**: solo **2/3 polarizadas** → NO se afirma "polarizados" del modelo entero en title/H1 (mismo criterio Rusty Play/Patien 2/4); el title destaca **Unisex** (100% verdadero). **Anti-canibalización (sol Vulk)**: Raven = wayfarer + unisex + branded (carril de forma libre — ningún Vulk-sol pelea "wayfarer"); The Sil = cuadrado; Day Light = rectangular/carey; My Crew = receta. Unisex → NO pelea `lentes/anteojos de sol vulk hombre`. Title: `Lentes de Sol Vulk Raven Unisex | Óptica Carballo`.

*Vulk The Trial (sol, AVIADOR doble puente, UNISEX, 2/4 variantes polarizadas + 1 antifog + 1 naranja, G-Flex + patillas Monel/acetato hecho a mano, policarbonato UV400 cat 3, ultraliviano 19,5g, large) — slug `vulk-the-trial` en `/anteojos-de-sol/vulk/vulk-the-trial`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| lentes de sol vulk | 1.300 | 8 | head de sol de la marca (variante "lentes") → meta_title + 1er párrafo |
| anteojos de sol vulk | 880 | 10 | head de sol de la marca (variante "anteojos") → H1, copy |
| lentes de sol aviador | 170 | — | forma del modelo, **carril LIBRE** en el cluster → H1/H2, copy, alt |
| lentes/anteojos de sol tipo/estilo aviador | 30-40 | — | variantes de forma → copy |
| anteojos/lentes de sol vulk the trial | 0 medido | ~4 | branded exacto → H1, slug, alt |

Atributo de respaldo (copy/alt, NO primaria): `lentes de sol polarizados` (260), `anteojos de sol polarizados` (170) — SOLO referidos a las 2 variantes que sí lo son. **Honestidad**: solo **2/4 polarizadas** → NO se afirma "polarizados" del modelo entero en title/H1 (criterio Raven/Play/Patien); title destaca **Unisex**. NO targetear `aviador hombre` (90) — el producto es unisex. **Anti-canibalización (sol Vulk)**: The Trial = **aviador doble puente** + unisex + branded → carril de forma LIBRE (ningún Vulk-sol pelea "aviador"; The Sil = cuadrado, Raven = wayfarer, Day Light = rectangular/carey, My Crew = receta). Title: `Lentes de Sol Vulk The Trial Unisex | Óptica Carballo`. H1: `Lentes de Sol Vulk The Trial Aviador Unisex`.

*Vulk Bennie 51 (sol, REDONDO, UNISEX, 1/3 polarizada + 1 gris degradé + 1 verde AR interno, G-Flex + patillas metal flex, policarbonato UV400 cat 3, small 18,9g) — slug `vulk-bennie-51` en `/anteojos-de-sol/vulk/vulk-bennie-51`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| lentes de sol vulk | 1.300 | 8 | **primaria de MARCA** (Bennie lidera por marca, no por forma) → meta_title, 1er párrafo |
| anteojos de sol vulk | 880 | 10 | head de marca variante "anteojos" → copy/H2 |
| lentes de sol redondos | 320 | 14 | forma, secundaria (NO primaria — la lidera Blinded) → H1, copy |
| anteojos de sol redondos | 210 | 18 | forma variante "anteojos" → copy, alt |
| lentes/anteojos de sol vulk bennie 51 | 0 medido | ~4 | branded exacto → title, H1, slug, alt |

**Honestidad**: solo **1/3 polarizada** → NO afirmar "polarizados" del modelo en title/H1 (el claim pol va SOLO en la variante S10). NO targetear género (unisex). **ANTI-CANIBALIZACIÓN vs Rusty Blinded (también redondo sol)**: clave — NO comparten primaria. **Blinded = forma-first** (su marca-head Rusty-sol está saturada → la forma redonda es su único diferenciador). **Bennie = marca-first** (`lentes de sol vulk` 1.300, y es el ÚNICO redondo del cluster Vulk-sol). El query genérico `lentes de sol redondos` lo consolida la CATEGORÍA `/anteojos-de-sol/redondos`, no los productos. **Cross-link obligatorio Bennie↔Blinded** ("otros anteojos de sol redondos") + ambos → `/anteojos-de-sol/redondos`. Title: `Lentes de Sol Vulk Bennie 51 Redondos | Óptica Carballo`. H1: `Lentes de Sol Vulk Bennie 51 — Redondos Unisex`.

*Vulk Anima (SOL, CUADRADO grande, MUJER explícita, G-Flex frente y patillas, bisagras metálicas
con sistema flex, policarbonato antirreflex 100% UV cat 3, 32 g, 5 colorways — MBLK/S10 negro
mate/gris oscuro, SBLK/G.BROWN negro brillo/marrón degradé, SBLK/G.GREEN negro brillo/verde oscuro
degradé, SIENNA/G.GREEN sienna transparente/verde degradé, CRY/RED cristal transparente/rojo
degradé, NINGUNA polarizada) — slug `vulk-anima` en `/anteojos-de-sol/vulk/vulk-anima`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| lentes de sol vulk mujer | 260 | 8 | **primaria** — marca+género, variante "lentes" (mayor volumen) → meta_title, H1, 1er párrafo |
| anteojos de sol vulk mujer | 210 | 8 | primaria alt, variante "anteojos" (intención navigational) → copy, alt text |
| lentes de sol vulk | 1.300 | 8 | head de marca (soporte, NO primaria — saturada en el cluster) → H2/copy |
| anteojos de sol vulk | 880 | 10 | head de marca variante "anteojos" (soporte) → copy |
| anteojos de sol mujer | 5.400 | 10 | head de categoría amplia, demasiado competitiva para PDP → soporte, apunta a `/anteojos-de-sol/mujer` |
| vulk anima (branded) | 0 medido | ~4 | long-tail exacto → title/H1/slug/alt |

**El carril elegido es marca+género, no forma.** Anima comparte forma real ("cuadrado grande" G-Flex)
con **Deserve** y comparte marca+línea con **The Sil**, que ya tiene tomado el genérico
`anteojos/lentes de sol cuadrados` (cuadrado forma-first, unisex, 3/3 polarizadas). Reclamar
"cuadrado" ahí sería pisarlo dos veces: adentro del cluster Vulk (vs The Sil) y afuera (vs el cuarteto
que ya ocupa `anteojos de sol cuadrados mujer` 110/14 — Rusty Dileri, Vorez, Dearly + Vulk Katleen,
documentado en la entrada de Vriviant más arriba). Anima no necesita competir ahí: es el único
Vulk-sol explícitamente MUJER del catálogo (The Sil, Raven, The Trial, Bennie 51 y Deserve son
unisex y por regla no pueden reclamar género), así que `lentes/anteojos de sol vulk mujer` queda
libre — mismo criterio que usó Bennie 51 para tomar el head de marca por ser "el único redondo".

**Anti-canibalización**: (A) vs **Vulk Deserve** (mismo armazón real, cuadrado grande G-Flex,
unisex, 1/3 pol, sin entry propia todavía en este archivo): Deserve es unisex y no puede pelear
género; si más adelante se le da keyword primaria, no puede ser `vulk mujer` — queda abierto para
forma o branded. Cross-link obligatorio Anima↔Deserve ("mismo armazón, otro género/colores").
(B) vs **Vulk The Sil** (mismo brand+línea, cuadrado forma-first, unisex, 3/3 pol): The Sil se queda
con el genérico `anteojos/lentes de sol cuadrados`; Anima no lo reclama en ningún nivel (title, H1,
meta ni alt). Diferenciador real: The Sil es Grilamid/TR-90 y 100% polarizado; Anima es G-Flex y
0% polarizado — cero solapamiento de claims. (C) vs el cuarteto cuadrado-femenino cross-brand
(Rusty Dileri/Vorez/Dearly + Vulk Katleen, todos con `anteojos de sol cuadrados mujer` 110/14):
Anima ni compite ahí — es otra marca (Vulk vs Rusty en 3/4 casos) y ni siquiera intenta la forma como
keyword, así que el carril queda intacto para ellos. (D) vs **Vulk Vartis** (receta, `anteojos vulk
mujer` 320/8): strings distintas (con "de sol" vs sin calificador) + intención distinta (sol vs
receta) + categorías separadas — mismo criterio de split usado en el resto del cluster (Woxi↔R-CY 02,
Kirt↔Ther). Sin receta hermana de Anima hoy → sin cross-link sol↔receta.

**Honestidad**: 0 de 5 variantes polarizada → "polarizado" NO aparece en title, H1, `name` ni
`short_description`; si se agrega un warning explícito en la ficha (patrón Bruice/Dunsert), aclarar
que ninguna colorway polariza. `lens_treatment` de producto queda `["uv400", "antirreflejo"]`
(antirreflex confirmado para las 5 variantes, no es un atributo parcial como en Dunsert). **G-Flex es
el nombre del material y NO autoriza a decir que el armazón es flexible** (regla del proyecto) — el
flex vive en la bisagra metálica.

**Facetas esperadas**: `gender: "female"` → entra a `/anteojos-de-sol/mujer` y
`/anteojos-de-sol/vulk/mujer` (si esa subcategoría se activa; hoy Anima sería su único producto,
por debajo del umbral de 4 para promoverla activamente en SEO — regla usada en Rusty). NO entra a
`/anteojos-de-sol/polarizados` (0 variantes califican). NO entra a `/anteojos-de-sol/vulk/polarizados`
(0 variantes a nivel producto).

Title: `Lentes de Sol Vulk Anima Mujer | Óptica Carballo` (48). Alternativa: `Anteojos de Sol Vulk
Anima Mujer | Óptica Carballo` (50, intención navigational, mismo volumen relativo) — se recomienda
la primera por mayor volumen (260 vs 210) y porque respeta la convención del cluster (head crítica:
"lentes de sol" gana en Vulk). H1 = name = `Vulk Anima Mujer` (con "Mujer" explícito — mismo
criterio que Vartis, ya que acá SÍ hay keyword primaria de género real, a diferencia de los unisex
del cluster). Meta: `Lentes de sol Vulk Anima para mujer: cuadrado grande en 5 colores, UV400 cat. 3
y antirreflex. Envío a todo el país, 30+ años de experiencia en óptica.` (151). Linking:
`/anteojos-de-sol/vulk` + `/marcas/vulk` + `/anteojos-de-sol/mujer` + related (deserve, the-sil,
otros Vulk sol) + cross-link Anima↔Deserve.

*Vulk The Trial Optics — RECETA (armazón, aviador doble puente, UNISEX, lentes demo, G-Flex + patillas Monel/acetato hecho a mano, 19,5g, large) — slug `vulk-the-trial-receta` en `/anteojos-de-receta/vulk/vulk-the-trial-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos recetados | 720 | 9 | **primaria** — head de intención receta (el head de marca `anteojos vulk` 4.400 / `lentes vulk` 6.600 va al hub /marcas/vulk, NO al producto) → H1, 1er párrafo |
| lentes recetados | 390 | 9 | variante "lentes" → copy |
| anteojos aviador | 590 | 20 | forma (carril diferenciador del cluster receta) → H1, copy, alt |
| lentes/anteojos estilo/tipo aviador | 50-110 | 20-41 | variantes de forma → copy |
| armazones vulk | 110 | 8 | único "armazón" con volumen usable → body 1 vez |
| anteojos vulk the trial receta | 0 medido | ~4 | branded → title, H1, slug, alt |

Respaldo (copy/alt): `anteojos vulk mujer` (320/8) + `anteojos vulk hombre` (260/8) — el unisex cubre ambos, copy NO primaria. **NO usar** "armazón de receta" como target (0 vol) — se usa solo como cabecera del title para señalizar intención. **Honestidad** (BUSINESS_POLICIES §5): precio = armazón sin cristales; "sumale tus cristales con receta". **Anti-canibalización**: sol (`lentes/anteojos de sol vulk`) vs receta (`anteojos recetados`) = intención distinta; vs My Crew receta = aviador vs redondo. **Cross-link obligatorio sol↔receta** (como Patien). Title: `Armazón de Receta Vulk The Trial Aviador | Óptica Carballo`. H1: `Anteojos de Receta Vulk The Trial Aviador Unisex`.

*Vulk Kirt Optics (receta, REDONDO de METAL, UNISEX, liviano 17,5g, medium, frente metal + patilla Monel/acetato + bisagras integradas, lentes demo, 2 colores — LG dorado / MDB cobre) — slug `vulk-kirt-receta` en `/anteojos-de-receta/vulk/vulk-kirt-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos de metal | 210 | 12 | **primaria material** — diferencia de My Crew (G-Flex) → title/H1/1er párrafo |
| lentes de metal | 260 | 10 | primaria material variante "lentes" → copy |
| anteojos redondos | 880 | 12 | forma, **secundaria** (la lidera Ther cross-brand) → H1, copy |
| lentes redondos | 1.000 | 18 | forma variante "lentes" → body/alt |
| anteojos recetados | 720 | 9 | head receta → copy (lo lideran Woxi/Patien) |
| armazones vulk | 110 | 8 | único "armazón" con volumen → body 1 vez |
| vulk kirt (branded) | 0 medido | ~4 | title/H1/slug/alt |

> Respaldo (copy/alt, NO primaria): `anteojos vulk mujer` (320/8) + `anteojos vulk hombre` (260/8) — el unisex los cubre. **NO usar**: `anteojos vulk` (4.400 → hub), "armazón de receta" (0 vol). **ANTI-CANIBALIZACIÓN**: (A) vs **My Crew** (Vulk redondo G-Flex) → se separan por MATERIAL: Kirt lidera metal, My Crew la forma; Kirt NO usa `anteojos redondos` como primaria. (B) vs **Rusty Ther** (redondo metal unisex) → leads invertidos: Ther=FORMA (`anteojos redondos`) en Rusty, Kirt=MATERIAL (`anteojos de metal`) en Vulk; se resuelve por marca + branded + categoría `/anteojos-de-receta/metal` + **cross-link obligatorio Kirt↔Ther**. Único Vulk redondo de metal. Title: `Armazón de Receta Vulk Kirt Redondo Metal | Óptica Carballo`. H1: `Vulk Kirt Optics`. Linking: `/anteojos-de-receta/vulk` + `/anteojos-de-receta/metal` + `/anteojos-de-receta/vulk/metal` + related redondos receta (My Crew, Ther, Misty, Xold). Cross-link sol↔receta NO (Kirt sol no cargado).

*Vulk Be Again (receta, forma cuadrado ⚠️HIPÓTESIS no concluyente, UNISEX, G-Flex, bisagras metálicas flex, 21,5g, apto mono/bi/progresivo/multifocal, 3 colores — MBLK negro mate / CRY transparente cristal / M447-MBLK marrón claro-negro) — slug `vulk-be-again-receta` en `/anteojos-de-receta/vulk/vulk-be-again-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos recetados | 720 | 9 | **primaria** — head de intención receta compartido (no canibaliza, mismo criterio Dieven/Kirt/Trial/Woxi/Peating/Zinz) → H1 alt, 1er párrafo, meta_description |
| anteojos vulk / lentes vulk | 4.400/6.600 | 11/10 | head de marca → hub-only (`/marcas/vulk`), NO producto |
| anteojos vulk mujer / hombre | 320/260 | 8/8 | atributo, unisex los cubre → copy/alt |
| armazones vulk | 110 | 8 | único "armazón" con volumen → body 1 vez |
| anteojos multifocales | 1.000 | 8 | soporte — compatibilidad real de armazón (NO venta de lente) → 1 mención copy |
| vulk be again (branded) | 0 medido | ~4 | title/H1/slug/alt |

> **name = "Vulk Be Again"** (SIN "Unisex" — a diferencia de Dieven que lo necesitó por coexistir con su versión de sol homónima; Be Again no tiene sol cargado, entra en el presupuesto de title limpio). **Anti-canibalización vs Vulk Strewn** (transparente/mujer, primaria `anteojos transparentes mujer` 390/15): Be Again tiene 1/3 colores transparente (CRY) vs 2/3 de Strewn — mismo criterio de honestidad que Dieven sol (regla "2/3 confirmadas"). Be Again NO reclama "anteojos transparentes" como keyword en ningún nivel; el color CRY se menciona solo en alt text de esa variante puntual. Cero solapamiento con Strewn. Diferenciador real: bisagras metálicas flex + compatibilidad explícita mono/bi/progresivo/multifocal + unisex + 21,5g — carril que ningún otro Vulk receta reclama con esa claridad. Cross-link obligatorio Be Again↔My Crew↔Kirt↔Dieven Unisex↔The Trial Optics (Vulk receta unisex) + `/anteojos-de-receta/vulk` + `/guias/como-leer-receta-anteojos`. Cross-link sol↔receta NO (Be Again sol no existe en el catálogo). Title (auto): `Vulk Be Again | Anteojos de Receta - Óptica Carballo` (54). H1/name: `Vulk Be Again`. ⚠️ **frame_shape="cuadrado" es hipótesis no confirmada** (lente 48×46mm ≈1:1, ambiguo entre cuadrado/redondo en este catálogo) — si se define otra forma al revisar las fotos, re-auditar posible overlap de keyword con Kirt (redondo).

*Vulk Vartis Mujer (receta, forma redondo ⚠️HIPÓTESIS no concluyente, MUJER, frente G-Flex con bisagras metálicas, patillas de ACETATO, 29,2g, apto mono/bi/progresivo, 2 colores — L.PINK rosa transparente/patillas carey / MDEMI carey mate/patillas negro brillo) — slug `vulk-vartis-receta` en `/anteojos-de-receta/vulk/vulk-vartis-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos vulk mujer | 320 | 8 | **primaria** — marca+género, carril libre en el trío mujer Vulk (Katleen=forma, Strewn=color, ninguna la usa primaria) → name/title/H1 alt/1er párrafo |
| anteojos recetados mujer | 260 | 7 | secundaria — head receta femenino → copy, meta_description |
| anteojos mujer / anteojos para mujer | 880/480 | 12/7 | soporte amplio → H2/copy |
| anteojos carey mujer | 110 | 15 | **NO primaria** — solo 1/2 colorways full-carey (MDEMI), bajo el umbral de honestidad → alt/copy de esa variante únicamente |
| lentes de acetato | 110 | 11 | soporte spec (patillas) → copy |
| anteojos multifocales | 1.000 | 8 | compatibilidad real del armazón → 1 mención copy |
| anteojos vulk / lentes vulk | 4.400/6.600 | 11/10 | head de marca → hub-only (`/marcas/vulk`), NO producto |

> **name = "Vulk Vartis Mujer"** (CON "Mujer" — a diferencia de Be Again/Dieven/Kirt unisex que no pueden reclamar género, acá SÍ hay keyword primaria de género real). **NO usar**: "anteojos de acetato" (0 medido, no aparece en CSV real). "anteojos transparentes mujer" (390/15, Strewn 66% confirmado la lidera; Vartis solo 50% en L.PINK — no alcanza el umbral de honestidad usado en Be Again vs Strewn). **ANTI-CANIBALIZACIÓN trío Vulk mujer receta (Katleen/Strewn/Vartis)**: Katleen = carril forma (`cuadrados mujer`), Strewn = carril color transparente (`transparentes mujer`, 66% confirmado), Vartis = carril marca+género explícito (`vulk mujer`, sin reclamar forma ni color por falta de mayoría de variantes). Cross-link obligatorio Vartis↔Katleen↔Strewn. Cross-link sol↔receta NO (Vartis sol no existe en el catálogo). Title (auto): `Vulk Vartis Mujer | Anteojos de Receta - Óptica Carballo` (56). H1/name: `Vulk Vartis Mujer`. ⚠️ **frame_shape="redondo" es hipótesis no confirmada** (lente 53×51mm ≈1:1) — si resulta cuadrado, colisiona con Katleen y obliga a reforzar el carril marca+género como único diferenciador; si es redondo, abre carril nuevo sin conflicto (ningún Vulk-receta-mujer es redondo hoy).

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

*Rusty Woxi Optics (receta, RECTANGULAR pequeño, UNISEX, G-Flex, SOLO monofocal, lentes demo) — slug `rusty-woxi-receta` en `/anteojos-de-receta/rusty/rusty-woxi-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos recetados | 720 | 9 | **primaria** — head receta (NO "rectangulares": esa la lidera R-CY 02; anti-canibalización) |
| lentes recetados | 390 | 9 | variante receta |
| anteojos rectangulares | 480 | 15 | forma, **secundaria** (no primaria, para no pisar R-CY 02) |
| lentes rectangulares | 880 | 10 | forma (variante "lentes"), secundaria |
| rusty woxi (branded) | 0 medido | ~4 | long-tail exacto → title/H1/slug |

**Diferenciador en copy (NO en keyword de forma)**: pequeño + liviano + **solo monofocal** (lectura/descanso). **Honestidad**: "lectura/descanso" SOLO como uso en el body — NUNCA como reclamo de anteojo de lectura pre-armado (es armazón para monofocal graduado). Anti-canibalización vs R-CY 02 (también rectangular receta): Woxi lidera por intención receta + branded + tamaño; R-CY 02 mantiene la forma "rectangular" amplia. Title: `Armazón de Receta Rusty Woxi Rectangular | Óptica Carballo`. H1: `Armazón de Receta Rusty Woxi — Rectangular Liviano para Monofocales`.

*Rusty The Take Optics (receta, AVIADOR, UNISEX, G-Flex, lentes demo mono/bi/progresivo, 18g) — slug `rusty-the-take-receta` en `/anteojos-de-receta/rusty/rusty-the-take-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos recetados | 720 | 9 | **primaria** — head receta → H1/1er párrafo |
| lentes recetados | 390 | 9 | variante receta |
| anteojos aviador | 590 | 20 | forma — carril diferenciador → title/H1/copy/alt |
| anteojos rusty originales | 210 | 10 | body 1 vez |
| rusty the take (branded) | 0 medido | ~4 | long-tail exacto → title/H1/slug |

**Anti-canibalización**: hay DOS aviadores de receta, **ambos doble puente** — The Take (Rusty) y Vulk The Trial. Comparten primaria `anteojos recetados` + forma `anteojos aviador` pero NO canibalizan: **marcas distintas + branded distinto** (`rusty the take` vs `vulk the trial`) → titles/H1/slug separados; las SERP de marca-head las resuelven los hubs respectivos. **Cross-link** "otros aviadores de receta" entre ambas. The Take es el ÚNICO aviador de receta dentro del cluster Rusty (Opposit/Patien=wayfarer, R-CY 02/Woxi=rectangular, Ther=redondo). Title: `Armazón de Receta Rusty The Take Aviador | Óptica Carballo`. H1: `Armazón de receta Rusty The Take — aviador unisex`. Hermano de sol: `rusty-the-take` (cross-link sol↔receta).

*Rusty The Take (SOL, AVIADOR doble puente, UNISEX, 1/3 polarizado, G-Flex + patillas acetato,
policarbonato UV400 cat3, 18g, 3 colores — MBLK/S10 POL negro mate/gris POLARIZADA (SKU 129234),
L.GREY-SBLK/L.BROWN gris transp./patillas negro brillo/lente marrón degradé NO pol (SKU 129237),
L.GREY-MBLK/G.GREEN gris transp./patillas negro mate/lente verde degradé NO pol (SKU 129236)) —
slug `rusty-the-take` en `/anteojos-de-sol/rusty/rusty-the-take`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| lentes de sol aviador | 170 | — | **primaria forma** — the take usa esta variante; Yeah (2026-08-04) usa `anteojos de sol aviador` (110) para no pisarla |
| lentes de sol rusty | 1.300 | 9 | head de marca, soporte (1er párrafo/H2, no primaria — saturada) |
| anteojos de sol rusty | 880 | 10 | variante "anteojos" → copy |
| lentes/anteojos de sol polarizados | 260/170 | 12/10 | atributo, **1/3 → NO afirmable** para el modelo; sólo linkea `/anteojos-de-sol/polarizados` (criterio "≥1 variante") |
| rusty the take (branded) | 0 medido | ~4 | title/H1/slug |

**⚠️ CAMBIO 2026-09-22: pasó de 1/1 a 1/3 polarizado al sumar 2 colores nuevos, y la honestidad se
invierte.** Ya NO se afirma "Polarizado" en title/H1/`name`/`short_description`/`lens_treatment` de
producto (criterio Rew 1/2, Dunsert 1/3, Bad Card 2/6). Va con número en `meta_description`, callout
`warning` y descripción, igual que el resto del catálogo con esta proporción. `lens_treatment` de
producto queda `["uv400"]`; el flag `polarized` sólo en la variante MBLK/S10 POL. **NO linkear a
`/anteojos-de-sol/rusty/polarizados`** (filtra por producto, ya no calificaría). SÍ sigue entrando a
`/anteojos-de-sol/polarizados` (por variante, la POL sigue ahí). Unisex → NO targetear
`aviador hombre`. **Anti-canibalización**: (A) vs Vulk The Trial sol (también aviador doble puente):
marca distinta + The Trial 2/4 pol vs The Take ahora 1/3 pol, los dos acotan + cross-link "otros
aviadores de sol" + ambos → `/anteojos-de-sol/aviador`. (B) vs The Take receta: intención sol vs
receta + cross-link sol↔receta. (C) vs **Rusty Yeah** (también aviador doble puente Rusty-sol): The
Take sigue con `lentes de sol aviador` (170/12, ahora 1/3 pol acotado, ya no afirmado); Yeah toma
`anteojos de sol aviador` (110/10, 2/3 pol acotado) — diferenciador real acetato full+32,9g (Yeah)
vs G-Flex+acetato 18g (The Take) + 3 colores cada uno, ya no "3 vs 1" + cross-link obligatorio.
Title: `Lentes de Sol Rusty The Take Aviador | Óptica Carballo` (54, sin cambios: nunca dijo
"Polarizado" en el campo real, sólo en esta doc). H1 = name = `Rusty The Take` (corrige el H1
aspiracional viejo, que nunca coincidió con el código: H1 siempre es `product.name`).

*Rusty Yeah (SOL, AVIADOR doble puente, UNISEX, acetato bio-based, policarbonato UV400 cat3, 32,9g, 3 colores — C1 negro mate/gris oscuro POL, C2 negro brillo/verde degradé POL, C3 carey/marrón degradé NO pol) — slug `rusty-yeah` en `/anteojos-de-sol/rusty/rusty-yeah`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos de sol aviador | 110 | 10 | **primaria forma** — variante "anteojos" del carril aviador, distinta de `lentes de sol aviador` que usa The Take |
| lentes de sol rusty | 1.300 | 9 | head de marca (soporte, NO primaria) |
| anteojos de sol rusty | 880 | 10 | head de marca (soporte, NO primaria) |
| lentes/anteojos de sol polarizados | 260/170 | 12/10 | atributo, 2/3 variantes → se acota, NO se afirma modelo completo |
| rusty yeah (branded) | 0 medido | ~4 | long-tail exacto → title/H1/slug |

**Honestidad**: 2 de 3 variantes polarizadas (C1, C2 — C3 carey NO polariza) → NUNCA afirmar "polarizado" para el modelo entero en title/H1; se acota "en 2 de 3 colores" (criterio Play/Patien 2/4, NO el de Terdey/Zinz 100%). **Anti-canibalización vs Rusty The Take** (también aviador doble puente Rusty-sol): NO comparten keyword primaria — The Take usa `lentes de sol aviador` (170/12, 1/3 pol acotado desde el 2026-09-22, antes 1/1 afirmado), Yeah usa `anteojos de sol aviador` (110/10, 2/3 pol acotado). Diferenciador físico real: acetato bio-based + 32,9g (Yeah) vs G-Flex+acetato 18g (The Take) + 3 colores vs 1. Cross-link obligatorio Yeah↔The Take ("otro aviador de sol Rusty"). Sin versión de receta cargada — sin cross-link sol↔receta por ahora. **NO linkear a `/anteojos-de-sol/rusty/polarizados`** mientras esa faceta siga con el criterio viejo "todas las variantes" (BACKLOG.md), Yeah no calificaría honestamente ahí; SÍ linkear a `/anteojos-de-sol/polarizados` (criterio correcto "≥1 variante"). Title: `Anteojos de Sol Rusty Yeah Aviador | Óptica Carballo`. H1 = name = `Rusty Yeah`.

*Rusty Bruice (SOL, AVIADOR doble puente, UNISEX, G-Flex, policarbonato UV400 cat3, 23g, 2 colores cargados — MBLK/ORANGE negro mate/naranja y MDEMI HD-GG47 carey mate con patillas negras/verde degradé, NINGUNO polarizado) — slug `rusty-bruice` en `/anteojos-de-sol/rusty/rusty-bruice`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos de sol rusty bruice | 0 medido | 4 | **primaria branded** — aparece en autocompletado real de Ubersuggest, o sea que alguien la tipea, sólo que por debajo de 10/mes. Se gana sin esfuerzo |
| lentes de sol rusty | 1.300 | 9 | head de marca (soporte, NO primaria) |
| anteojos de sol rusty | 880 | 10 | head de marca (soporte, NO primaria) |
| lentes de sol naranjas | 50 | 36 | carril de color — copy y alt, NO title ni H1: difficulty prohibitiva para nuestra DA |
| anteojos naranjas | 110 | 11 | buena difficulty pero **intención de armazón**, no de lente de sol → mismatch, no targetear |

**Lectura honesta: esta ficha no va a traer tráfico orgánico propio.** Sirve para convertir a quien
ya llegó y para darle profundidad a la faceta aviador. El valor SEO real de cargar Bruice no es la
PDP: es que `/anteojos-de-sol/aviador` pasa a **4 productos** (The Take, Yeah, Vulk The Trial,
Bruice) y `/anteojos-de-sol/rusty/aviador` a **3**. Una faceta con 3-4 productos es un ranker mucho
más creíble para `lentes de sol aviador` (170/12) que cualquier PDP individual. Ahí va el esfuerzo,
no acá.

**Honestidad**: esta variante NO polariza → la palabra "polarizado" no aparece en title, H1, meta ni
alt, y hay un callout `warning` que lo aclara en la ficha. ⚠️ `anteojos de sol rusty bruice
polarizado` existe en Ubersuggest y es **trampa**: hay demanda pero este producto no la satisface.
Perseguirla sería bait-and-switch. Si mañana entra la colorway polarizada (existe: SKU 957005 /
957004 en el catálogo del fabricante), entra como **variante de esta misma URL** — por eso el slug
NO lleva el color. **Anti-canibalización**: Bruice es el TERCER aviador doble puente de Rusty-sol y
los dos carriles de forma ya están tomados — `lentes de sol aviador` es de The Take,
`anteojos de sol aviador` es de Yeah. Bruice no puede tomar ninguno de los dos, por eso va branded.
Tampoco puede pelear género: es unisex (`GENDER="Sin género"` en la propia publicación de ML), así
que `lentes de sol aviador hombre` (90/16) sigue libre para un modelo masculino futuro. Cross-link
obligatorio Bruice ↔ The Take ↔ Yeah. Sin versión de receta cargada. Title: `Anteojos de Sol Rusty Bruice Aviador Doble Puente | Carballo` (60 chars).
Arrancó como `... Aviador Naranja | Carballo` para no chocar con el de Yeah
(`Anteojos de Sol Rusty Yeah Aviador | Óptica Carballo`); al entrar la segunda colorway el color
dejó de ser representativo del modelo, así que "Naranja" salió y entró "doble puente", que es el
diferenciador físico real y vale para las dos. H1 = name = `Rusty Bruice`.

**Carril carey — evaluado y descartado para esta ficha.** `anteojos de sol carey` es 40/dif 34,
el mismo perfil que `lentes de sol naranjas` (50/36) que ya se había descartado. `anteojos carey`
(390/dif 8) tiene volumen y buena dificultad pero vive en el CSV de armazones: es intención de
receta, mismatch desde una PDP de sol. Los dos van a copy y alt, no a title ni H1. Aparte, y sin
mezclarlo con esta ficha: `anteojos carey` (390/8), `lentes carey` (260/10) y `anteojos negros de
carey` (320/16) son buenos carriles para una faceta `/anteojos-de-receta/carey` que hoy no existe,
con cinco recetas carey mate ya cargadas. Anotado en BACKLOG, no es de este producto.

*Rusty Dunsert (SOL, CAT EYE redondeado, UNISEX, G-Flex frente y patillas,
bisagras plásticas SIN flex, policarbonato UV400 cat 3, 140 / 55x54 / 19 / 145 mm,
sin peso declarado, 3 colorways: LBR/GB1 marrón translúcido + naranja degradé AR,
SBLK/S10 negro brillo + gris oscuro AR, SBLK/SG91 POL negro brillo + azul degradé
polarizada sin AR y con 0 u.) — slug `rusty-dunsert` en
`/anteojos-de-sol/rusty/rusty-dunsert`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| lentes de sol cat eye | 50 | 36 | **primaria de forma**, variante "lentes" (la de "anteojos" es de Le Groupie) → title, H2, copy |
| rusty dunsert (branded) | sin medir | ~4 | **primaria real de conversión** → name, H1, slug, alt |
| lentes de sol rusty | 1.300 | 9 | head de marca (soporte, NO primaria) |
| anteojos de sol rusty | 880 | 10 | head de marca (soporte, NO primaria) |
| lentes de sol cat eye mujer | 30 | 35 | copy/alt, sin reclamar género en title |

**Forma resuelta contra ML**: ML declara `FRAME_SHAPE = Ovalada` en las tres publicaciones y un
título dice "Ovalados", pero las fotos de frente (MLA1382626523-02, MLA1562519439-01) muestran el
aro superior subiendo en punta sobre la sien mientras el inferior es curva continua: arriba y abajo
no se espejan. Lente 55x54 (casi 1:1), y un ovalado es netamente más ancho que alto.
`frame_shape="cat_eye"`. Tercer caso seguido de "Ovalada" mal declarada por ML, tras Zion y Ardigan.

**Género**: `unisex`. Uno de los títulos de ML dice "Para Mujer" pero es relleno de keywords (el
mismo título dice "Ovalados"). Cargarlo unisex es estrictamente dominante: verificado en
`lib/catalog/queries.ts`, `fetchCategoryByGender` y `fetchBrandPageByGender` filtran
`gender IN ('female','unisex')` para el target mujer, así que entra igual a `/anteojos-de-sol/mujer`
y `/anteojos-de-sol/rusty/mujer` (los que deben rankear `anteojos de sol mujer` 5.400/10 y
`lentes de sol rusty mujer` 390/9) y además a las de hombre. La PDP no reclama género.

**Antirreflex: diferenciador de conversión, NO carril de keyword.** `lentes de sol antireflex`
70/35 y `anteojos de sol antireflex` 40/36: mismo perfil descartado que `lentes de sol naranjas`
(50/36) en Bruice. El volumen real vive en receta (`anteojos antireflex` 720/10, `lentes antireflex`
590/10, CSV de armazones): intención de tratamiento sobre cristales graduados, mismatch desde una
PDP de sol (patrón "lentes espejados"). `lentes de sol polarizados y antireflejo` (90/12) es TRAMPA:
hay demanda pero **ninguna variante cumple las dos cosas**, perseguirla es bait-and-switch. Y 2/3 no
alcanza para claim de modelo (criterio Bruk/Dieven/Yeah) → "antirreflex" NO va en title ni H1. Va a
meta_description, callout `warning`, descripción y alt.

**Honestidad polarizado**: 1 de 3 polarizada y encima en 0 unidades → la palabra "polarizados" NO
aparece en title, H1 ni meta. `lens_treatment` de producto queda `["uv400"]`; el antirreflejo va a
nivel VARIANTE como `lens_treatment:["antirreflejo-interno"]` (no es valor del enum de producto,
precedente Deserve seed 51 y CCCP seed 54).

**Facetas de polarizados (verificado en código)**: SÍ entra a `/anteojos-de-sol/polarizados`
(`toPolarizedCatalog` en `lib/catalog/polarized.ts` resuelve por variante y no filtra stock → card
con la SG91, `inStockCount:0`, `minPriceCents:null`, o sea "Sin stock" y sin precio; estado ya
aceptado con Deserve, Biller, Bruice y Lady Piny). NO entra a `/anteojos-de-sol/rusty/polarizados`
(`lib/catalog/brand-filters.ts` usa `lens_treatment_includes:'polarized'` a nivel producto). La
ficha linkea sólo a la primera.

**Anti-canibalización**: (A) vs **Rusty Beason**, el otro Rusty cat eye: Beason es femenino
explícito (`gender:female`, title "Cat Eye Mujer", 141/54x50/16/145, 26 g, paleta rosada); Dunsert
es unisex, no reclama género, y es otro armazón (lente 54 de alto vs 50, puente 19 vs 16).
Cross-link obligatorio. (B) vs **Vulk Le Groupie**: marca y faceta de marca distintas; Le Groupie se
queda con `anteojos de sol cat eye` (40), Dunsert toma `lentes de sol cat eye` (50). Mismo corte que
The Take vs Yeah en aviador. (C) vs **Vulk Yamain** (frame_shape cat_eye pero title "Ovalados
Mujer"): sin solape mientras ese title no cambie. (D) vs las últimas cargas: Rew = `lentes de sol
rectangulares`, Ardigan = `lentes de sol polarizados`, Guardian = `anteojos de sol negros`, Cinema =
branded. Dunsert no toca ninguno.

**Evaluado y descartado**: `lentes de sol marrones` (110/11) y `... mujer` (90/18), sólo 1/3
colorways (criterio naranja del Bruice). `lentes de sol grandes` (90/19), no es honesto con frente
de 140 mm. `anteojos/lentes cat eye` (320/10-13) y `ojo de gato` (110/12), CSV de armazones =
intención de receta.

**Valor SEO real**: como el Bruice, esta ficha no va a traer tráfico orgánico propio. El valor es
doble: (1) `/anteojos-de-sol/cat-eye` pasa de 3 a 4 productos y `/anteojos-de-sol/rusty/cat-eye` de
1 a 2, o sea deja de ser faceta de un solo producto (verificado en DB post-carga: Beason, Dunsert,
Le Groupie, Yamain); (2) la SERP de `rusty dunsert` hoy son la ficha de catálogo de ML
(MLA23035059) y cuatro revendedores que la espejan (Óptica Saavedra, Tu Anteojos en Línea, Sunstore,
Tienda de Anteojos), todos titulando "Gafas Antirreflejo" sin explicar cuáles la traen y sin medidas
propias. Es ganable con una PDP de verdad.

*Rusty Vriviant (SOL, CUADRADO de esquinas redondeadas, FEMENINO, G-Flex frente y patillas,
bisagras metálicas con flex, policarbonato UV400 cat 3, 138 / 50x50 / 17 / 145 mm, sin peso
declarado, 2 colorways: SBLK/S10 POL negro brillo + lente negro pleno POLARIZADA (SKU 112844,
MLA1388018629), MBLK/G. BROWN negro mate + marrón degradé NO polarizada (SKU 112845,
MLA3981541946)) — slug `rusty-vriviant` en `/anteojos-de-sol/rusty/rusty-vriviant`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos/lentes de sol rusty vriviant | sin medir | ~4 | **primaria branded** — name, H1, slug, alt |
| lentes de sol cuadrados para mujer | 70 | 18 | **secundaria, único string libre de la intención** → title, H2, copy |
| lentes de sol rusty | 1.300 | 9 | head de marca (soporte, NO primaria) |
| anteojos de sol rusty | 880 | 10 | head de marca (soporte, NO primaria) |
| anteojos de sol cuadrados mujer | 110 | 14 | **PROHIBIDA** — ya la pelean Dileri, Vorez, Dearly y Katleen |

`vriviant` NO aparece en el autocompletado de Ubersuggest (barrido completo de los CSV de
`KEYWORDS OPTICA/`, cero matches), a diferencia del Bruice y el Bad Card. Esta ficha no va a traer
tráfico orgánico propio: sirve para convertir a quien ya llegó desde ML o redes, y para darle
profundidad a `/anteojos-de-sol/rusty/mujer`.

**El hallazgo grande de esta carga: el carril cuadrado-femenino está OCUPADO CUATRO VECES.**
`anteojos de sol cuadrados mujer` (110/14) la atacan Dileri (seed 55), Vorez (seed 45), Dearly
(seed 24) y Vulk Katleen (seed 52) — tres Rusty entre ellos. Es la tercera colisión de esta clase
después de Blinded↔Zion y The Sil↔Zinz, y la más grande. **Vriviant no se suma**: toma
`lentes de sol cuadrados para mujer` (70/18), el string adyacente sin dueño, con el mismo corte
"lentes vs anteojos" que ya separa a The Take↔Yeah, Dunsert↔Le Groupie y Malice↔Blozon. El arreglo
real de las otras cuatro NO es de este producto: es la faceta `/anteojos-de-sol/cuadrado`, decisión
abierta del founder en DATOS_PENDIENTES.md — con el Vriviant son **27 productos cuadrados sin
página** (24 hasta el Cinema + Guardian + Gover + Vriviant), ~990 búsquedas/mes de intención sol
sin consolidar. Y el problema es más grave de lo que muestran los 4 titles: como `unisex` también
califica para la faceta de mujer, `/anteojos-de-sol/rusty/mujer` ya reúne 6 cuadrados Rusty
(Dileri, Vorez, Dearly, Zinz, Peating, Bruk), 7 con Vriviant.

**Anti-canibalización**: (A) vs **Dileri**, el gemelo (cuadrado femenino Rusty, 140/52x53/15/135,
1 de 2 pol): string split + bisagra metálica con flex vs patillas Flex Temple. (B) vs **Vorez**
(141/51x52/17/145): bisagras metálicas vs plásticas. (C) vs **Dearly**: su `meta_title` reclama el
mismo string en disputa (17,3 g es diferenciador de copy, no de keyword). (D) vs **Katleen sol**
(Vulk): otra marca y otro armazón (53x42 ancho-bajo vs 50x50 casi 1:1). (E) vs **Zinz/The Sil**
(`unisex`, no "sin género"): son el cuadrado neutro y compiten en la faceta de mujer por el
`unisex`, no por keyword propia. (F) vs **Blozon/Malice**: cuadrados HOMBRE, y Vriviant es
`female`. (G) vs **Guardian** (`anteojos de sol negros`): el string ya lo tiene el Guardian, y
además acá los dos armazones son negros (brillo y mate) — lo que cambia es la lente, no alcanza a
diferenciar. (H) vs **Ardigan** (`lentes de sol polarizados`): 1 de 2, no se reclama.

**Honestidad — 1 de 2 polarizadas**: "polarizado" NO va en title, H1 ni `name`/`short_description`
(criterio Rew 1/2, Dunsert 1/3, Bad Card 2/6; precedente directo el Rew, único 1-de-2 real del
catálogo, que sí lo pone en meta_description). Va con número a `meta_description`, callout
`warning`, descripción y alt de esa variante. `lens_treatment` de producto queda `["uv400"]`; el
flag `polarized` va a nivel variante, sólo en la SBLK. **G-Flex es el nombre del material y NO
autoriza a decir que el armazón sea flexible** — el flex es de la BISAGRA. **Sin comparativo de
peso**: no hay peso declarado, va a la lista de pesos pendientes.

**Facetas (verificado en código)**: SÍ entra a `/anteojos-de-sol/polarizados` (`toPolarizedCatalog`
en `lib/catalog/polarized.ts` resuelve por variante). NO entra a `/anteojos-de-sol/rusty/polarizados`
(`lib/catalog/brand-filters.ts` filtra a nivel producto). `gender: "female"` → entra a
`/anteojos-de-sol/mujer` y `/anteojos-de-sol/rusty/mujer`, y queda fuera de las de hombre
(`fetchCategoryByGender` / `fetchBrandPageByGender` en `lib/catalog/queries.ts`).

Title: `Lentes de Sol Rusty Vriviant Cuadrados Mujer | Carballo` (55).
Meta: `Lentes de sol Rusty Vriviant: cuadrados femeninos de G-Flex y lente UV400, con bisagras
metálicas flex. Uno de los dos colores polariza. Envío a todo el país.` (158).
H1 = name = `Rusty Vriviant`.
Linking: `/anteojos-de-sol/rusty` + `/anteojos-de-sol/mujer` + `/anteojos-de-sol/rusty/mujer` +
`/anteojos-de-sol/polarizados` + related (dileri, vorez, dearly, katleen, zinz, beason).
NO `/marcas/rusty` (404), NO `/guias/anteojos-segun-forma-de-cara` (404), NO
`/anteojos-de-sol/rusty/polarizados`, NO `/acetato`, NO `/metal`. Sin link a guía: ninguna de las
guías publicadas es de intención sol. Sin cross-link sol↔receta (no hay Vriviant de receta).


Title: `Lentes de Sol Rusty Dunsert Cat Eye | Óptica Carballo` (53).
Meta: `Lentes de sol Rusty Dunsert: cat eye unisex de G-Flex, policarbonato UV400 categoría 3. Dos
de los tres colores traen antirreflex interno. Envío a todo el país.` (160).
H1 = name = `Rusty Dunsert`.
Linking: `/anteojos-de-sol/rusty` + `/anteojos-de-sol/cat-eye` + `/anteojos-de-sol/rusty/cat-eye` +
`/anteojos-de-sol/mujer` + `/anteojos-de-sol/rusty/mujer` + `/anteojos-de-sol/hombre` +
`/anteojos-de-sol/rusty/hombre` + `/anteojos-de-sol/polarizados` + `/marcas/rusty` + related
(beason, le-groupie, yamain, etiquet, dileri) + `/guias/anteojos-segun-forma-de-cara`.
NO `/anteojos-de-sol/rusty/polarizados`, NO `/acetato`, NO `/metal`. Sin cross-link sol↔receta.

⚠️ **Nota de deuda**: al escribir este bloque, el Le Groupie tiene que quedar acotado a
`anteojos de sol cat eye` (40) y soltar `lentes de sol cat eye` (50), que pasa a ser del Dunsert.
Y este archivo sigue **8 cargas atrás** (Cinema, Rew, Ardigan, Guardian y anteriores no tienen
bloque) — sigue en BACKLOG.md.

*Rusty Ther Optics (receta, REDONDO de METAL, UNISEX, liviano 14,5g, lentes demo mono/bi/multifocal) — slug `rusty-ther-receta` en `/anteojos-de-receta/rusty/rusty-ther-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos redondos | 880 | 12 | **primaria** — forma (mejor dif que "lentes redondos" 18) |
| lentes redondos | 1.000 | 18 | forma variante "lentes" → body/alt |
| anteojos de metal | 210 | 12 | **carril propio** (material) → distingue del Misty (acetato) |
| lentes de metal | 260 | 10 | material variante "lentes" |
| anteojos recetados | 720 | 9 | head receta → copy (NO primaria, la lideran Woxi/Patien) |
| rusty ther (branded) | 0 medido | ~4 | title/H1/slug |

**ANTI-CANIBALIZACIÓN vs Rusty Misty receta (también redondo unisex)**: clave — Misty = **acetato + talle chico**; Ther = **METAL + liviano 14,5g**. Cada ficha pelea atributo distinto: Misty su talle, Ther el material (`anteojos/lentes de metal`). Ambos soportan `anteojos redondos` pero el diferenciador real es el material. **Cross-link obligatorio Misty↔Ther** ("¿lo querés en acetato? → Misty" / "¿en metal? → Ther"). NO targetear género (unisex). NO usar "armazón de metal" (dif 36-44). Title: `Armazón de Receta Rusty Ther Redondo Metal | Óptica Carballo`. H1: `Armazón de Receta Rusty Ther — Redondo de Metal, Liviano y Unisex`.

*Rusty Patien Optics (receta, wayfarer, UNISEX, G-Flex, lentes demo, 23,6 g — versión de receta del Patien de sol) — slug `rusty-patien-receta` en `/anteojos-de-receta/rusty/rusty-patien-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos recetados | 720 | 9 | categoría receta (head de la intención) |
| lentes wayfarer | 590 | 14 | forma del modelo (variante "lentes") |
| anteojos wayfarer | 260 | 9 | forma (variante "anteojos") → H1 |
| lentes recetados | 390 | 9 | variante receta |
| rusty patien receta (branded) | 0 medido | ~4 | long-tail exacto → title + H1 + slug |

> **Anti-canibalización Patien sol vs receta**: mismo frame, dos URLs, dos intenciones. El Patien de SOL (`/anteojos-de-sol/rusty/rusty-patien`) targetea `lentes/anteojos de sol rusty` (1.300/880); el de RECETA targetea `anteojos recetados` (720) + wayfarer. Sin keyword primaria compartida. Cross-link obligatorio entre ambas fichas ("versión de sol/receta del Patien").

*Rusty Zinz Optics (receta, CUADRADO, UNISEX, G-Flex, bisagras metálicas flex, lentes demo mono/bi/progresivo/multifocal, 25,7 g) — slug `rusty-zinz-receta` en `/anteojos-de-receta/rusty/rusty-zinz-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| lentes cuadrados | 880 | 10 | forma del modelo (variante "lentes", la más alta) → 1er párrafo, H2 |
| anteojos cuadrados | 480 | 10 | forma (variante "anteojos") → primaria + H1 |
| anteojos recetados | 720 | 9 | head de intención receta → copy |
| lentes recetados | 390 | 9 | variante receta → copy |
| rusty zinz receta (branded) | 0 medido | ~4 | long-tail exacto → title + H1 + slug + alt |

De respaldo (copy/alt, NO primaria): `anteojos cuadrados hombre` (210/14) + `anteojos/lentes cuadrados mujer` (320/18) — el unisex los cubre en copy, sin pelear género. Title: `Armazón de Receta Rusty Zinz Cuadrado | Óptica Carballo` (54). H1: `Anteojos de Receta Rusty Zinz — Cuadrados Unisex`. **Cross-link sol↔receta obligatorio**: existe la versión de SOL (`/anteojos-de-sol/rusty/rusty-zinz`, polarizada) — el receta toma `anteojos/lentes cuadrados` (sin "de sol"), el sol toma `...de sol cuadrados`; sin primaria compartida.

> **Anti-canibalización 3 cuadrados de receta (Spell / Katleen / Zinz)**: misma forma, se diferencian por **género + marca + carril**, no por la forma sola (la forma genérica la consolida la futura categoría por forma, no los productos):
> - **Rusty Spell** receta (Rusty, **masculino**) → forma + branded, ángulo **hombre** (`anteojos cuadrados hombre` 210/14).
> - **Vulk Katleen** receta (Vulk, **femenino**) → forma + branded, ángulo **mujer** (`anteojos/lentes cuadrados mujer` 320/18) + "ultra liviano".
> - **Rusty Zinz** receta (Rusty, **unisex**) → **forma neutra** (`anteojos cuadrados` 480 / `lentes cuadrados` 880), el único que NO escora a género.
> - Reglas duras: Zinz NO usa `...cuadrados hombre/mujer` como primaria (son de Spell/Katleen). Spell vs Zinz (ambos Rusty cuadrados receta): Spell escora masculino en title/H1/copy, Zinz dice "unisex" explícito → misma marca, dos URLs, sin primaria compartida. Cross-link obligatorio entre los 3 + cada uno → `/anteojos-de-receta/rusty` (Spell, Zinz) / `/anteojos-de-receta/vulk` (Katleen) + guía `/guias/anteojos-segun-forma-de-cara`.

*Rusty Spell Optics (receta, CUADRADO, MASCULINO, lentes demo) — slug `rusty-spell-receta` en `/anteojos-de-receta/rusty/rusty-spell-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos cuadrados hombre | 210 | 14 | forma + género (su carril único en los 3 cuadrados) → H1 |
| anteojos cuadrados | 480 | 10 | forma (soporte; primaria es de Zinz) |
| anteojos recetados | 720 | 9 | head de intención receta → copy |
| rusty spell receta (branded) | 0 medido | ~4 | long-tail exacto → title + H1 + slug |

*Rusty Peating Carey (receta, CUADRADO, UNISEX, G-Flex, bisagras metálicas, liviano 18,9g, lentes demo mono/bi/progresivo, 2 colores carey — SDEMI carey brillo / MDEMI carey mate) — slug `rusty-peating-receta` en `/anteojos-de-receta/rusty/rusty-peating-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos carey | 390 | 8 | **PRIMARIA** — carril color/material, LIBRE en el cluster (2/2 variantes carey) → name/H1/1er párrafo |
| lentes carey | 260 | 10 | variante "lentes" de la primaria → copy |
| anteojos de carey | 260 | 14 | soporte del carril carey → copy/alt |
| anteojos recetados | 720 | 9 | head receta → copy (lo lideran Woxi/Patien, NO primaria) |
| anteojos cuadrados | 480 | 10 | forma, **SOPORTE — NO primaria** (es de Zinz) → H2/copy |
| lentes cuadrados | 880 | 10 | forma variante "lentes", soporte → copy |
| rusty peating (branded) | 0 medido | ~4 | name/H1/slug/alt |

> **Anti-canibalización 4 cuadrados de receta (Zinz/Spell/Katleen/Strewn) + Peating**: la forma cuadrada NO es la primaria de Peating — la lidera Zinz (`anteojos cuadrados` unisex 480/10). Peating toma el carril CAREY (`anteojos carey` 390/8), color que ningún otro ataca (Strewn=transparente, Zinz=forma neutra, Spell=hombre, Katleen=mujer). Peating dice "cuadrado/unisex" en copy pero su primaria es el color → cero solapamiento con Zinz. `anteojos de sol carey` (Blinded, 40/34) es otra intención (sol). NO usar: `anteojos carey mujer` (110, unisex lo cubre), `armazones carey` (20/49), `anteojos cuadrados unisex` (0 medido). **Cross-link obligatorio** Peating↔Zinz↔Spell (Rusty cuadrados) + `/anteojos-de-receta/rusty` + `/marcas/rusty` + `/guias/como-leer-receta-anteojos`. Cross-link sol↔receta NO (Peating sol no cargado). Title (auto): `Rusty Peating Carey | Anteojos de Receta - Óptica Carballo` (58). H1/name: `Rusty Peating Carey`.

*Rusty Invig Optics (receta, RECTANGULAR de METAL, HOMBRE, ultra liviano 14,7g, frente metal + patillas metal/acetato + bisagra acero inox, lentes demo, 3 colores mate — negro/marrón/gris oscuro) — slug `rusty-invig-receta` en `/anteojos-de-receta/rusty/rusty-invig-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos rusty hombre | 390 | 9 | **primaria** — branded + género, carril ÚNICO (único rectangular masculino Rusty receta) → title/H1/1er párrafo |
| anteojos hombre | 1.000 | 7 | head amplio → H2/copy (no primaria: la consolida la faceta) |
| anteojos recetados | 720 | 9 | head receta → copy (lo lideran Woxi/Patien) |
| anteojos rectangulares | 480 | 15 | forma, **secundaria** (primaria es R-CY 02) |
| anteojos de metal | 210 | 12 | material → copy (lo lidera Ther) — diferenciador rectangular+hombre |
| rusty invig (branded) | 0 medido | ~4 | long-tail exacto → title/H1/slug/alt |

> **Anti-canibalización 3 rectangulares Rusty receta + metal**: R-CY 02 lidera la FORMA (`anteojos/lentes rectangulares`), Woxi el HEAD receta (`anteojos recetados`), Invig el GÉNERO+branded (`anteojos rusty hombre`, único rectangular masculino). Invig NO usa rectangulares ni metal como primaria (son de R-CY 02 y Ther) — solo copy. Diferencia vs Ther (redondo metal unisex): Invig = rectangular + hombre. Cross-link obligatorio Invig↔Ther + Invig↔R-CY 02/Woxi. NO existe Invig de SOL todavía. Title (col): `Armazón de Receta Rusty Invig Hombre Metal | Óptica Carballo`.

*Rusty PRO 30 Optics (receta, CUADRADO, HOMBRE, frente G-Flex + patillas G-Flex con alma de metal + terminales de goma antideslizantes, 22,9g, garantía 1 año, 1 SOLA variante — LIGHT GREY: frente gris transparente / terminales azules) — slug `rusty-pro-30-receta` en `/anteojos-de-receta/rusty/rusty-pro-30-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos transparentes hombre | 260 | 22 | **primaria** — carril color+género, LIBRE en el cluster (único Rusty transparente-hombre) → title/H1/1er párrafo |
| anteojos transparentes | 720 | 16 | soporte del carril (compartido con Vulk Strewn femenino, sin colisión) → copy |
| anteojos recetados | 720 | 9 | head de intención receta → copy |
| rusty pro 30 receta (branded) | 0 medido | ~4 | long-tail exacto → title/H1/slug/alt |

> **Anti-canibalización vs Spell (cuadrado masculino) e Invig (rectangular/hombre branded)**: PRO 30 es el 3er Rusty cuadrado-hombre del cluster pero NO pelea `anteojos cuadrados hombre` (210/14, primaria de Spell) ni `anteojos rusty hombre` (390/9, primaria de Invig) — su única variante (LIGHT GREY, frente gris transparente + terminales azules) le da un carril propio: `anteojos transparentes hombre` (260/22), libre en todo el sitio (la femenina la tiene Vulk Strewn). Diferenciador físico de copy (sin volumen medido): patillas con alma de metal + terminales de goma antideslizantes. NO usar "anteojos de metal" como keyword (frame es G-Flex, no metal — sería engañoso; esa keyword es de Kirt/Ther). Cross-link obligatorio PRO 30↔Spell↔Zinz↔Peating (Rusty cuadrados) + `/anteojos-de-receta/rusty` + `/anteojos-de-receta/rusty/hombre`. Sin versión de sol cargada — sin cross-link sol↔receta por ahora. Title (auto): `Rusty PRO 30 Optics | Anteojos de Receta - Óptica Carballo`.

*Vulk Dieven Unisex (receta, RECTANGULAR de bordes anchos, UNISEX, G-Flex, bisagras plásticas reforzadas ultra liviano, 28,5g, medium, 3 colores — MBLK negro mate / SBLK negro brillo / L.ROSE rosa pálido) — slug `vulk-dieven-receta` en `/anteojos-de-receta/vulk/vulk-dieven-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos recetados | 720 | 9 | **primaria** — head de intención receta (compartido con Woxi/Trial/Peating/Kirt/Zinz/Patien, no es canibalización) → H1 alt, 1er párrafo, meta_description |
| anteojos rectangulares | 480 | 15 | forma, **secundaria** (primaria es Rusty R-CY 02, sitewide) → H2/copy/alt |
| lentes rectangulares | 880 | 10 | forma variante "lentes", secundaria → copy |
| anteojos vulk / lentes vulk | 4.400/6.600 | 11/10 | head de marca → **hub-only** (`/marcas/vulk`, `/anteojos-de-receta/vulk`), NO producto |
| vulk dieven (branded) | 0 medido | ~4 | title/H1/slug/alt |

> Respaldo (copy/alt, NO primaria): `anteojos vulk mujer` (320/8) + `anteojos vulk hombre` (260/8) — el unisex los cubre. **NO usar** "bordes anchos"/"oversized" como keyword (0 vol medido). **PRIMER rectangular Vulk en receta** — comparte `anteojos recetados` (uso estándar, no canibalización) pero NO toma `anteojos rectangulares` como primaria (esa la lidera R-CY 02 sitewide, mismo criterio que Invig). Diferenciador: marca Vulk + unisex explícito + bisagras plásticas 28,5g vs los 3 rectangulares Rusty (R-CY02=forma neutra, Woxi=chico/monofocal, Invig=hombre/metal). Cross-link obligatorio Dieven↔R-CY02↔Woxi↔Invig + `/anteojos-de-receta/vulk`. Cross-link sol↔receta AUTOMÁTICO por convención de slug (`vulk-dieven` ↔ `vulk-dieven-receta`) — ver entry del sol abajo. Title (auto): `Vulk Dieven Unisex | Anteojos de receta - Óptica Carballo` (57). H1/name: `Vulk Dieven Unisex`.

*Vulk Dieven (SOL, RECTANGULAR de bordes anchos, UNISEX, G-Flex, 3 colores — MBLK/S10 grey pol / SBLK/SG91 pol / ROSE-BROWN-GREEN sin confirmar polarización) — slug `vulk-dieven` en `/anteojos-de-sol/vulk/vulk-dieven`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| lentes de sol vulk | 1.300 | 8 | head de marca, soporte → 1er párrafo |
| anteojos de sol vulk | 880 | 10 | head de marca, soporte → copy |
| lentes de sol cuadrados | 390 | 11 | forma, **NO primaria** (primaria es The Sil) → copy, si aplica visualmente |
| anteojos/lentes de sol vulk dieven (branded) | 0 medido | ~4 | long-tail exacto (existe en CSV) → name/slug/alt |
| anteojos de sol polarizados vulk dieven | 0 medido | ~4 | branded + atributo, acotado a las 2 var. confirmadas |

> **name = "Vulk Dieven"** (SIN "Unisex" — ese sufijo del receta es específico de su restricción de caracteres de title; no se repite en el sol, sigue el patrón limpio Marca+Modelo de Sil/Raven/Bennie/Zinz). **Honestidad**: 2/3 variantes confirmadas polarizadas (MBLK/S10, SBLK/SG91 — título ML lo dice explícito); la 3ª (ROSE/BROWN-GREEN) NO lo confirma → NUNCA afirmar "polarizados" como atributo del modelo completo (criterio Bruk 2/3). `lens_treatment` de producto queda `["uv400"]` (sin "polarized") — correcto y esperado que NO califique para `/polarizados` (ver bug de la faceta en BACKLOG). **Anti-canibalización vs Vulk The Sil** (también cuadrado/rectangular sol Vulk, 3/3 polarizado): The Sil es dueño de la forma + "polarizados" como claim de modelo — Dieven no pelea ninguna. Diferenciador real: paleta de color (rosa translúcido + degradé marrón-verde, ausente en The Sil). Cross-link obligatorio Dieven↔The Sil. **Discrepancia de forma resuelta**: el título de ML dice "Cuadrado" pero se usó `frame_shape="rectangular"` — coincide con el founder (mensaje explícito "Rectangular unisex") y con las medidas idénticas al hermano receta (mismo armazón físico); el "Cuadrado" del título ML se trata como relleno de keywords, no como dato de forma real. Title (auto): `Vulk Dieven | Anteojos de sol - Óptica Carballo` (48). H1/name: `Vulk Dieven`.

*Rusty Blinded (sol, REDONDO, UNISEX, 2 variantes — carey/marrón + negro mate; NINGUNA polarizada; antirreflejo interior, G-Flex, policarbonato UV400 cat 3, 22,7 g) — slug `rusty-blinded` en `/anteojos-de-sol/rusty/rusty-blinded`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos de sol redondos | 210 | 18 | forma del modelo (su carril único en el cluster) → H1 |
| lentes de sol redondos | 320 | 14 | forma (variante "lentes", la más alta) |
| anteojos de sol carey | 40 | 34 | variante carey → copy/alt text |
| anteojos de sol rusty blinded | 0 medido | ~4 | branded exacto → title + H1 + slug |
| anteojos de sol rusty | 880 | 10 | head de marca (soporte, NO primaria) |

> **Anti-canibalización Blinded vs resto del cluster Rusty sol**: TODOS los demás Rusty de sol (Play, Terdey, Patien, Esvep, Sotion, Eslav, Gresent) son wayfarer/cuadrados y pelean `lentes/anteojos de sol rusty` + `wayfarer`. Blinded es el ÚNICO REDONDO → su primaria es la FORMA (`anteojos/lentes de sol redondos`, 210-320), no la marca-head. Sin keyword primaria compartida. NUNCA "polarizado" (ninguna variante lo es).

*Rusty And Now (sol, ENVOLVENTE/deportivo wraparound, UNISEX, 3 variantes — 2 polarizadas SBLK/S10 + MBLK/S10; 1 espejada azul revo NO polarizada con antirreflejo; G-Flex, policarbonato UV400 cat 3) — slug `rusty-and-now` en `/anteojos-de-sol/rusty/rusty-and-now`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos de sol deportivos | 110 | 10 | uso/forma del modelo (su carril único) → H1 |
| lentes de sol deportivos | 210 | 17 | variante "lentes" de la primaria |
| lentes de sol polarizados | 260 | 12 | soporte SOLO para las 2 variantes pol. (no atributo del producto entero) |
| anteojos de sol rusty | 320-880 | 9-10 | head de marca (soporte, NO primaria) |
| anteojos de sol rusty and now | 0 medido | ~4 | branded exacto → title + H1 + slug |

> **Anti-canibalización And Now vs resto del cluster**: And Now es ENVOLVENTE/deportivo → primaria = USO (`anteojos/lentes de sol deportivos`, 110-210), carril que ningún otro Rusty ataca. Se diferencia de **Esvep** (también envolvente, pero pelea el head `lentes de sol rusty`): And Now toma el ángulo DEPORTIVO en title/H1, Esvep el head de marca. Distinto de wayfarer (Play/Terdey/Patien) y redondo (Blinded). "Polarizado" solo en el copy de las 2 variantes que lo son. Cross-link Esvep↔And Now.

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

*Rusty Patien (sol, wayfarer/cuadrado, UNISEX, 2/4 variantes polarizadas — MBLK/S10 POL + 669K-SBLK/SG91 POL; resto antirreflex/espejada; bisagras metálicas flex, G-Flex, policarbonato UV400 cat 3) — slug `rusty-patien` en `/anteojos-de-sol/rusty/rusty-patien`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| lentes de sol rusty | 1.300 | 9 | head de sol de la marca (variante "lentes", la más alta) |
| anteojos de sol rusty | 880 | 10 | head de sol de la marca (variante "anteojos") |
| lentes wayfarer | 590 | 14 | forma del modelo |
| anteojos wayfarer | 260 | 9 | forma (variante "anteojos") |
| anteojos de sol rusty patien | 0 medido | ~4 | branded exacto → title + H1 + slug |

**Honestidad (como Play)**: 2 de 4 variantes son polarizadas (MBLK/S10 POL + 669K-SBLK/SG91 POL) → NO afirmar "polarizados" como atributo de TODO el modelo en el H1; el atributo se acota a la variante. **Anti-canibalización (3 wayfarer Rusty)**: Patien = unisex + branded + forma (NO afirma polarizado, NO pelea `...rusty hombre`); Terdey = unisex + polarizado de modelo (3/3, dueño de `anteojos de sol polarizados rusty`); Play = hombre (dueño de `...rusty hombre` / `lentes de sol hombre rusty` 480/9). Title: `Anteojos de Sol Rusty Patien Unisex | Óptica Carballo`.

*Rusty Zinz (sol, CUADRADO, UNISEX, 2/2 variantes polarizadas — MBLK/S10 POL negro brillo + 669K-SBLK/DRT23 POL gris transparente; G-Flex, bisagras flex customizadas, policarbonato UV400 cat 3, 25,7 g — versión de sol del Zinz Optics de receta) — slug `rusty-zinz` en `/anteojos-de-sol/rusty/rusty-zinz`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| lentes de sol cuadrados | 390 | 11 | forma del modelo (variante "lentes", la más alta) → 1er párrafo, H2 |
| anteojos de sol cuadrados | 170 | 14 | forma (variante "anteojos") → primaria + H1 |
| anteojos de sol rusty | 880 | 10 | head de marca (soporte, NO primaria) |
| lentes de sol polarizados | 260 | 12 | soporte (2/2 → se afirma para todo el modelo, ver abajo) |
| anteojos de sol rusty zinz | 0 medido | ~4 | branded exacto → title + H1 + slug + alt |

De respaldo (copy/alt, NO primaria): `anteojos de sol cuadrados mujer` (110/14), `anteojos/lentes de sol cuadrados hombre` (70/35, 90/18) — el unisex los cubre en copy, sin pelear género. **Polarizado**: 2 de 2 variantes son polarizadas → SÍ se afirma "polarizado" para todo el modelo en H1/title (como Terdey 3/3, NO como Play/Patien 2/4 que lo acotan a variante). Pero la primaria es la FORMA, no el polarizado (ese carril de modelo es de Terdey; el branded `...rusty polarizados` mide dif 36). Title: `Anteojos de Sol Rusty Zinz Cuadrados Polarizados | Carballo` (58). H1: `Anteojos de Sol Rusty Zinz — Cuadrados Polarizados Unisex`.

> **Anti-canibalización Zinz sol vs cluster Rusty sol**: cada Rusty de sol toma una FORMA/uso distinto, no el head genérico repetido. Zinz es el ÚNICO CUADRADO → su primaria es la forma (`lentes/anteojos de sol cuadrados`, 390/170), carril que ningún otro Rusty de sol ataca. Mapa de carriles: Blinded = redondo · And Now = deportivo/envolvente · Play = wayfarer hombre · Terdey = wayfarer unisex + polarizado de modelo · Patien = wayfarer unisex branded · Zinz = **cuadrado** · Esvep/Sotion/Eslav/Gresent = head genérico de marca. Zinz NO pelea `...rusty hombre/mujer` (unisex explícito) ni el "polarizado de modelo" como primaria (es de Terdey). Cross-link obligatorio Zinz↔Terdey↔Patien (los polarizados) + Zinz → `/anteojos-de-sol/rusty` + guía `/guias/anteojos-segun-forma-de-cara`.

> **Anti-canibalización Zinz sol vs Zinz receta**: mismo frame, dos URLs, dos intenciones. El Zinz de SOL targetea `lentes/anteojos de sol cuadrados` (390/170, con "de sol"); el de RECETA (`/anteojos-de-receta/rusty/rusty-zinz-receta`) targetea `anteojos/lentes cuadrados` (480/880, SIN "de sol"). Sin keyword primaria compartida. Cross-link sol↔receta OBLIGATORIO en ambas fichas ("versión de receta/sol del Zinz").

*Rusty Peating (sol, CUADRADO, UNISEX, G-Flex ultra liviano, 2/2 variantes polarizadas — MBLK/S10 negro mate + SBLK/DRT03 negro brillo lente degradé gris, policarbonato UV400 cat 3, 100% UVA/UVB — versión de sol del Peating Carey de receta) — slug `rusty-peating` en `/anteojos-de-sol/rusty/rusty-peating`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| lentes de sol negros cuadrados | 20 | 35 | carril COLOR+forma, libre en el cluster (Zinz mezcla colores, Peating es 100% negro) → soporte/copy |
| anteojos de sol negros cuadrados | 10 | 29 | ídem, variante "anteojos" |
| anteojos de sol rusty polarizados | 50 | 36 | atributo, 2/2 pol. se afirma en H2/copy, dif. alta = NO primaria |
| lentes de sol rusty / anteojos de sol rusty | 1.300 / 880 | 9 / 10 | head de marca, soporte compartido con todo el cluster |
| rusty peating (branded) | 0 medido | ~4 | long-tail exacto → name/H1/slug/alt |

> **Anti-canibalización Peating sol vs Zinz sol** (ambos cuadrados unisex G-Flex polarizados): Zinz es dueño exclusivo de la FORMA (`anteojos/lentes de sol cuadrados`, 170-390/14-11). Peating NO usa "cuadrados" como primaria — su carril es COLOR: 100% negro (mate + brillo) vs los colores mixtos de Zinz. Primaria real: branded (`rusty peating`) + color-forma de soporte (`negros cuadrados`). Ambas variantes polarizadas (2/2) → se afirma "polarizado" en copy/H2, NO como primaria (dif. 36, carril de Terdey). Mismo patrón que Peating RECETA vs Zinz RECETA (carey vs forma neutra). **Cross-link sol↔receta**: automático por convención de slug (`rusty-peating` ↔ `rusty-peating-receta`), sin acción manual. Cross-link obligatorio con Zinz/Terdey/Patien + `/anteojos-de-sol/rusty` + `/marcas/rusty`. Title (auto): `Rusty Peating | Anteojos de sol - Óptica Carballo` (51). H1 = name = `Rusty Peating`.
> **Gap de infraestructura**: no existe faceta `/anteojos-de-sol/cuadrados` ni `/anteojos-de-sol/[brand]/cuadrados` (confirmado por glob) — a pesar de que Zinz sol ya la targetea como primaria. Anotado en BACKLOG.md.

**Long-tails branded (vol bajo / dif 4-9, alta intención)**: nombre de modelo exacto por SKU (Esvep / Sotion / Eslav / Gresent / Play / Terdey / Patien / Opposit / R-CY 02): vol 0 medido pero conversión alta. Incluir en title + H1 + slug de cada producto. También `modelos de anteojos de sol rusty` (10/8), `anteojos rusty originales` (210/10).

**No usar**:
- `lentes rusty` (2.400 pero dif 49), `armazones rusty` (50/49), `armazones rusty mujer` (20/44) — difficulty prohibitiva y/o término muerto.
- `anteojos rusty` como primaria de un PRODUCTO individual (es del hub `/marcas/rusty` y de las categorías marca; los productos targetean modelo + forma + género para no canibalizar).

*Rusty K12 (receta, INFANTIL — primer producto realmente para niños/as del catálogo, badge nuevo
`size_fit: "infantil"` en vez de reusar "junior" — Grilamid TR-90, patillas de goma con alma de
metal ajustable, bisagra goma flex, lente demo con filtro Bluecut, 2 colores: C1 celeste/azul
translúcido y C3 rosa/frambuesa translúcido) — slug `rusty-k12-receta` en
`/anteojos-de-receta/rusty/rusty-k12-receta`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| rusty k12 (branded) | 0 medido | ~4 | long-tail exacto, conversión alta cuando el comprador ya conoce el modelo → **primaria**, title/H1/slug/alt |
| anteojos recetados | 720 | 9 | head de intención genérico ya usado por el resto del cluster receta Rusty → soporte, copy |
| anteojos infantiles | 70 | 48 | única keyword de audiencia infantil con volumen real en TODO el catálogo, pero difficulty demasiado alta para title/H1 con cero autoridad en el segmento → copy/H2 únicamente, nunca primaria |
| anteojos de sol niñas / anteojos de sol infantiles / armazones infantiles | 50/30/10 | 36/36/49 | genéricas o de SOL (no receta) → sin uso directo, referencia de campo léxico |

**Hallazgo del research**: barrido completo de los 35 CSV de `KEYWORDS OPTICA/` (incluyendo variantes
con "niños"/"para niños") confirma **volumen 0 medido** para el cruce receta+infantil en Argentina,
sin una sola excepción — ninguna combinación específica de "armazón/anteojos receta niños/infantil"
tiene tracción medible todavía. Cuando hay algo de tracción es con la palabra "infantil", nunca con
"para niños" (esta forma dio 0 en absolutamente todas sus variantes, incluso en long-tails de salud
tipo "miopía en niños"). Por eso el copy usa siempre "infantil", nunca "para niños" como string de
búsqueda (aunque el badge de UI sí diga "Para niños/as" — es texto de interfaz, no keyword).

**Facet `/anteojos-de-receta/ninos` — NO se abre todavía**: sin volumen que lo justifique. Con K13 ya
son **2 productos infantiles** (por debajo del umbral interno de 3-4 que el sitio usa para promover
una faceta activamente, mismo criterio que Vulk Anima/mujer). Founder mencionó como idea a futuro
("quizás hacemos una categoría especial para niños") — anotado en `BACKLOG.md` para revisar cuando
haya 3-4 productos infantiles más.

---

*Rusty K13 (receta, INFANTIL — segundo producto del catálogo para chicos/as, mismo badge
`size_fit: "infantil"` que K12 — Grilamid TR-90, calibre más chico que K12 (45mm vs 46mm, alto
32mm vs 35mm, ancho total 119mm vs 123mm, puente 14mm vs 15mm) → modelo más compacto, 2 colores:
C2 azul oscuro y C3 rosa translúcido) — slug `rusty-k13-receta` en
`/anteojos-de-receta/rusty/rusty-k13-receta`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| rusty k13 (branded) | 0 medido | ~4 | long-tail exacto, misma lógica que K12 → **primaria**, title/H1/slug/alt |
| anteojos recetados | 720 | 9 | head genérico del cluster receta Rusty → soporte, copy |
| anteojos infantiles | 70 | 48 | soporte léxico, copy/H2, nunca primaria (mismo criterio que K12) |

**Research heredado de K12, sin cambios**: mismo barrido de los 35 CSV de `KEYWORDS OPTICA/`
(líneas 854-860), volumen 0 medido para receta+infantil en Argentina. No se repite el research
completo — aplica el hallazgo ya documentado para el K12.

**Anti-canibalización K12 vs K13**: mismo brand/categoría/talle → sin riesgo de SERP (ambos branded
vol 0). El riesgo real es contenido casi-duplicado: se resuelve con número de modelo en
title/H1/slug, medidas objetivas distintas como diferenciador (K13 = el más compacto de los dos,
usado en el copy: "el más compacto de los dos armazones infantiles Rusty"), y copy de color 100%
propio por producto (el C3 "rosa translúcido" de K13 es textualmente parecido al C3 "rosa/frambuesa
translúcido" de K12 — no se reciclaron oraciones, cada ficha tiene su propio texto). Cross-link
obligatorio K12 ↔ K13 en relacionados + ambos → `/marcas/rusty` + `/anteojos-de-receta/rusty`.

**Title** (auto): `Armazón de Receta Rusty K13 Infantil | Óptica Carballo` (54). **H1** = name =
`Rusty K13 Infantil`. **Meta**: `Armazón de receta infantil Rusty K13, en azul oscuro y rosa
translúcido, Grilamid TR-90 liviano y resistente. Envío a todo el país, 30+ años en óptica
familiar.` (160)

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

*Vulk Katleen Optics (receta, CUADRADO, FEMENINO, ultra liviano, lentes demo) — slug `vulk-katleen-receta` en `/anteojos-de-receta/vulk/vulk-katleen-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos cuadrados mujer | 320 | 18 | forma + género (su carril único en los 3 cuadrados de receta) → H1 |
| lentes cuadrados mujer | 320 | 18 | forma + género (variante "lentes") |
| anteojos cuadrados | 480 | 10 | forma (soporte; primaria neutra es de Zinz) |
| anteojos recetados mujer / anteojos para mujer | 480 | 7 | intención receta femenina → copy |
| vulk katleen receta (branded) | 0 medido | ~4 | long-tail exacto → title + H1 + slug |

> Ver **anti-canibalización 3 cuadrados de receta (Spell / Katleen / Zinz)** en el cluster RUSTY: Katleen es el carril **femenino** (`...cuadrados mujer`), distinto del masculino (Spell) y el neutro unisex (Zinz). Cross-link obligatorio entre los 3.

*Vulk Strewn Receta (receta, CUADRADO, FEMENINO, small, marco liviano 17,8g, colores transparentes/cristal, lentes demo) — slug `vulk-strewn-receta` en `/anteojos-de-receta/vulk/vulk-strewn-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos transparentes mujer | 390 | 15 | **primaria** — carril transparente (2/3 colores: CRY cristal, M.ROSE rosa) → 1er párrafo, alt |
| anteojos transparentes | 720 | 16 | soporte del carril → copy 1 vez |
| anteojos mujer / anteojos para mujer | 880 / 480 | 12 / 7 | cabecera género → copy |
| anteojos vulk mujer | 320 | 8 | atributo marca+género → copy, alt |
| lentes transparentes mujer / anteojos marco transparente | 260 / 170 | 21 / 18 | variantes long-tail → copy, callout |
| vulk strewn receta (branded) | 0 medido | ~4 | branded exacto → name, slug, alt |

> **ANTI-CANIBALIZACIÓN vs Vulk Katleen (también cuadrado femenino receta)**: NO comparten primaria. Katleen = carril **forma** (`anteojos/lentes cuadrados mujer` 320/18). Strewn = carril **transparente** (`anteojos transparentes mujer` 390/15), diferenciado por colores cristal/rosa transparente + small 17,8g (aún más liviano que Katleen 26,3g). Strewn nombra "cuadrado" en copy pero NO lo targetea como primaria. **Cross-link obligatorio Strewn↔Katleen**. No usar `anteojos vulk` (4.400 → hub) ni "armazón de receta" (0 vol) como target. Title (auto): `Vulk Strewn Receta | Anteojos de Receta - Óptica Carballo`.

*Vulk Ready? (receta, forma cuadrado ⚠️HIPÓTESIS no concluyente, UNISEX, G-Flex con sistema de bisagras flexo, 18,2g, apto mono/bi/progresivo/multifocal, 1 SOLA variante — transparente cristal 100%) — slug `vulk-ready-receta` en `/anteojos-de-receta/vulk/vulk-ready-receta`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| anteojos transparentes | 720 | 16 | **primaria** — carril transparente GENÉRICO sin género, libre (Strewn=mujer, Rusty PRO 30=hombre, ninguno lo usa primaria) → title/H1/1er párrafo/meta_description |
| anteojos recetados | 720 | 9 | head de intención receta compartido → copy |
| armazones vulk | 110 | 8 | único "armazón" con volumen → body 1 vez |
| anteojos multifocales | 1.000 | 8 | soporte — compatibilidad real (mono/bi/progresivo/multifocal) → 1 mención copy |
| anteojos vulk mujer / hombre | 320/260 | 8/8 | respaldo, unisex los cubre → copy/alt |
| vulk ready (branded) | 0 medido | ~4 | title/H1/slug/alt |

> **name = "Vulk Ready?"** (con el signo de pregunta literal — nombre real del modelo, sin agregar "Unisex" porque no coexiste con versión de sol homónima, mismo criterio Be Again). **ANTI-CANIBALIZACIÓN cluster transparente**: Ready es el PRIMER Vulk receta 100% transparente (1/1 variante, no 2/3 como Strewn ni 1/3 como Be Again ni 1/2 como Vartis) y UNISEX → única ficha que puede reclamar el head genérico `anteojos transparentes` sin matizarlo (no aplica el criterio de "mayoría de variantes"). Cierra el cluster: mujer (Strewn) + hombre (Rusty PRO 30) + unisex genérico (Ready). Cross-link obligatorio Ready↔Strewn↔PRO 30 ("elegí tu transparente: mujer/hombre/unisex") + Ready↔Be Again↔Dieven Unisex (Vulk receta unisex) + `/anteojos-de-receta/vulk` + `/guias/como-leer-receta-anteojos`. Cross-link sol↔receta NO (Ready sol no existe en el catálogo). ⚠️ **frame_shape="cuadrado" es hipótesis no confirmada** (lente 54×42mm ratio 1.29:1, precedente más cercano Katleen 1.26:1) — confirmar con founder al ver la foto real. Title (auto): `Vulk Ready? | Anteojos de Receta - Óptica Carballo` (50). H1/name: `Vulk Ready?`.

### Cluster: MORMAII (septiembre 2026 — CSV `KEYWORDS OPTICA/`)

**Productos cargados, en orden de seed** (lista convertida a formato compacto 2026-09-30 — la prosa
"Primer/Segundo/Tercero..." se volvió inmanejable a partir del producto #10):
1. Mormaii Moorea RX (receta), seed 113
2. Mormaii Storm (sol), seed 115
3. Mormaii Daito (sol), seed 118
4. Mormaii Curazao (sol), seed 122
5. Mormaii Borneo (sol), seed 123
6. Mormaii Ancara 2 RX (receta), seed 125
7. Mormaii San Juan (sol), seed 128
8. Mormaii Joaca 4 (sol), seed 131
9. Mormaii Hover (receta, clip-on), seed 132
10. Mormaii Traful (receta), seed 133
11. Mormaii Leñas (receta), seed 135
12. Mormaii Maceio (receta), seed 136
13. Mormaii Monterrey 2 (sol), seed 137
14. Mormaii Madri (sol), seed 138
15. Mormaii Kona MAG (receta), seed 139
16. Mormaii Leñas 2 MAG (receta), seed 140
17. Mormaii Fortaleza (sol), seed 141
18. Mormaii Barcelona (receta), seed 142
19. Mormaii Doha (sol), seed 143
20. Mormaii Macau (sol), seed 144
21. Mormaii Swap NG2 MAG (receta, clip-on 2-en-1 magnético), seed 145
22. Mormaii Tokio (sol), seed 146
23. Mormaii Leñas 3 MAG (receta, con imán sólo-colgar), seed 147
24. Mormaii Miami (sol), seed 148
25. Mormaii Frey (receta, ovalado), seed 149
26. Mormaii 178 (sol, acetato, no polarizado), seed 150
27. Mormaii High 4 (receta, rectangular tipo wayfarer), seed 151
28. Mormaii Sevilha (receta, redondo tipo panto), seed 152
29. Mormaii Recife (receta, cuadrado grande, hombre), seed 153
30. Mormaii Vesubio (receta, aviador doble puente), seed 155
31. Reef 128 Yin (sol, envolvente deportivo), seed 156
32. Reef 129 Yang (sol, envolvente), seed 157
33. Reef 177 Aerial (sol, envolvente deportivo), seed 158
34. Reef 188 Octopus (sol, envolvente), seed 159
35. Reef 196 Reunión (sol, cuadrado tipo wayfarer, unisex), seed 160
36. Reef 193 Tortuga (sol, cuadrado ancho, hombre), seed 161
37. Reef 183 Bolero (sol, cuadrado deportivo, hombre, espejado), seed 162
38. Reef 155 Ali (sol, rectangular clásico, hombre), seed 164

Marca brasilera, segmento medio, posicionamiento surf/outdoor (ver `BRANDS.md`).

**Keyword head crítica**: `lentes de sol mormaii` — **90 vol/mes, difficulty 8**. Es específica de
sol y queda libre para Storm por ser el primer y único producto de sol de la marca. La receta no
tiene un head propio con volumen medible: Moorea quedó branded puro.

**Insight crítico**: las cabeceras de marca genéricas (`mormaii lentes` 390/7, `lentes mormaii`
170/7, `anteojos mormaii` 170/7) son **mixtas sol+receta** y van al hub (`/anteojos-de-receta/mormaii`,
`/anteojos-de-sol/mormaii`, futuro `/marcas/mormaii`), nunca a una PDP puntual — mismo criterio que
Vulk/Rusty. La única cabecera que SÍ es específica de una categoría es `lentes de sol mormaii`
(90/8), que Storm capturó como primaria.

**Keywords primarias**:
| Keyword | Vol/mes | Difficulty | Intent | Dónde usar |
|---|---|---|---|---|
| lentes de sol mormaii | 90 | 8 | commercial | title/H1 de Storm (único sol Mormaii hoy) |
| mormaii moorea / mormaii storm (branded) | 0 medido | ~7 | navigational | slug, alt, name de cada producto |

**Keywords secundarias**:
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii lentes | 390 | 7 | hub-only, mención 1 vez en `seo_intro` de marca, NO en PDP |
| lentes mormaii / anteojos mormaii | 170 | 7 | hub-only, igual que arriba |
| anteojos recetados | 720 | 9 | head de intención receta compartido → copy de Moorea |
| anteojos/lentes rectangulares | 480/15, 880/10 | ya tomadas por Rusty R-CY 02 como primaria → Moorea las usa sólo en copy/H2, nunca title/H1 |
| anteojos/lentes de sol deportivos | 110-210 | 10-17 | ya reclamadas por 3-5 Rusty envolventes → Storm NO pelea esta primaria, sólo entra a la faceta compartida |

**Long-tails branded**:
- mormaii moorea rx (armazón de receta) → slug `mormaii-moorea-receta`
- mormaii storm polarizados (sol) → slug `mormaii-storm`

**No usar**:
- "armazón de receta" como cabecera de Moorea (0 vol, mismo vicio ya descartado en otros clusters).
- "deportivos"/"envolvente" como primaria de Storm — sexto reclamo del mismo string que ya usan 3-5
  Rusty, cero ROI incremental. Va en copy/alt/`frame_shape`, no en title/H1.

**Regla de marca (no es SEO, pero aplica a todo copy Mormaii)**: TODOS los productos incluyen estuche
semi rígido + franela de Mormaii + 1 año de garantía — usar esa frase exacta en descripción, no el
"estuche y franela" genérico del resto del catálogo (founder, 2026-09-22, ver `BRANDS.md`).

*Mormaii Daito (sol, CUADRADO, UNISEX, armazón/frente/patilla de poliamida, bisagra plástica
reforzada, lente de policarbonato POLARIZADA en las 4 variantes, UV400 confirmado, base curve 4,
4 colores — negro mate/verde G15, negro mate/marrón C03, negro mate/endtip azul-celeste espejado,
negro brillo/gris oscuro) — slug `mormaii-daito` en `/anteojos-de-sol/mormaii/mormaii-daito`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii daito (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** título+H1+slug+alt |
| lentes/anteojos de sol unisex | 20/20 | 36/36 | libre, nadie la reclama en el catálogo, 100% honesto, diferenciador real vs Storm (HOMBRE explícito) → **primaria secundaria**, title, H1, copy |
| lentes de sol mormaii | 90 | 8 | head de sol de marca — **NO primaria** (ya la tiene Storm) → soporte, H2/copy, cross-link a Storm y a `/anteojos-de-sol/mormaii` |
| lentes/anteojos de sol cuadrados | 390/170 | 11/14 | forma real del modelo — **NO primaria** (ya la reclaman Vulk The Sil y Rusty Zinz, cada uno como primaria en su propio cluster; un tercer reclamo cross-brand triplicaría la auto-canibalización del mismo string dentro del propio sitio) → mención honesta en copy/1er párrafo/alt/`frame_shape`, nunca en meta_title ni H1 |
| polarizado lentes de sol | 260 | 36 | atributo genérico, dif. alta = soporte, no primaria; 4/4 variantes son polarizadas → se afirma "polarizadas" para todo el modelo en copy/H2 (mismo criterio Terdey/Zinz) |
| mormaii lentes / lentes mormaii / anteojos mormaii | 390/170/170 | 7/7/7 | hub-only (`/anteojos-de-sol/mormaii`, futuro `/marcas/mormaii`), NUNCA en esta PDP — mismo criterio ya fijado para Moorea/Storm |

**Anti-canibalización (Daito vs Storm, mismo brand)**: Storm es el único dueño de `lentes de sol
mormaii` (90/8, el único head específico-de-sol de la marca) — Daito NO lo reclama como primaria en
ningún nivel (title, H1, slug). El carril real de Daito es forma + género: CUADRADO (vs el
ENVOLVENTE de Storm) y UNISEX (vs el HOMBRE explícito de Storm) — cero solapamiento de intención de
búsqueda. Cross-link obligatorio Daito↔Storm ("otros lentes de sol Mormaii") + ambos →
`/anteojos-de-sol/mormaii`.

**Anti-canibalización (Daito vs "cuadrados" cross-brand — Vulk The Sil / Rusty Zinz)**: ambos ya
reclaman `anteojos/lentes de sol cuadrados` (170/390) como PRIMARIA cada uno dentro de su propio
cluster — gap de infraestructura ya señalado (falta la faceta `/anteojos-de-sol/cuadrados`, nota
bajo Rusty Peating). Sumar un tercer reclamo cross-brand del mismo string en meta_title/H1 pondría a
3 páginas del propio sitio compitiendo por la misma SERP, violando la regla de no-canibalización.
Decisión: Daito usa "cuadrado" solo como atributo descriptivo (copy, `frame_shape`, alt text), nunca
como keyword objetivo en title/H1. Este gap ahora tiene 3 marcas reclamando el mismo string sin
facet — escalar prioridad de crear `/anteojos-de-sol/cuadrados` en `BACKLOG.md`.

**Anti-canibalización (Daito vs color — Rusty Peating)**: Peating (Rusty, sol, cuadrado 100% negro)
ya ocupa el carril color-forma `negros cuadrados` (10-20/29-35). Los 4 colores de Daito también son
variaciones sobre negro (mate/verde G15, mate/marrón, mate/endtip azul-celeste, brillo/gris oscuro)
— mismo carril, volumen mínimo, sin ROI en disputarlo. Los colores van en copy/alt, sin intención de
rankear por "negros cuadrados".

**Long-tails branded**: `mormaii daito` (slug, title, H1, alt de cada variante) — vol 0 medido, alta
intención cuando el comprador ya conoce el nombre del modelo (viene de ML, boca en boca o redes).

**No usar**: "cuadrados" / "lentes de sol cuadrados" / "anteojos de sol cuadrados" como
meta_title/H1 (cross-canibalización 3-way, ver arriba). "Lentes de sol mormaii" como meta_title/H1
(ya es de Storm). "Polarizados" como diferenciador único en title — Storm ya lo usa idéntico para su
propio modelo (ambos 100% polarizados, no diferencia nada entre los dos); usar "Unisex" en su lugar,
que además es 100% verdadero y sí diferencia de Storm (HOMBRE).

**Title** (auto): `Lentes de Sol Mormaii Daito Unisex | Óptica Carballo` (52). **H1**: `Mormaii
Daito — Unisex, 100% Polarizados`. **Meta**: `Lentes de sol Mormaii Daito: armazón de poliamida
liviana, unisex, 100% polarizadas y UV400 cat. 3. 4 colores, envío a todo el país y garantía
oficial de 1 año.` (160).

*Mormaii Curazao (sol, CUADRADO, HOMBRE explícito, armazón/frente/patilla de poliamida, bisagra
plástica reforzada, lente de policarbonato POLARIZADA en las 3 variantes, UV400 y categoría 3
confirmados por grabado físico en la varilla ("Curazao Col.XX Cat.03 UV400"), base curve 4, 3
colores — negro brillo/gris oscuro (Col.01, stock), negro mate translúcido/verde espejado (Col.05,
stock), verde oliva/gris oscuro (Col.07, sin stock)) — slug `mormaii-curazao` en
`/anteojos-de-sol/mormaii/mormaii-curazao`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii curazao (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** título+H1+slug+alt |
| lentes de sol cuadrados hombre | 90 | 18 | forma+género en SOL, libre en todo el catálogo (Zinz/The Sil son unisex y no usan "hombre"; Rusty Spell usa "anteojos cuadrados hombre" pero en RECETA, otra categoría) → **primaria secundaria**, copy/H2/alt/1er párrafo (NO title/H1) |
| lentes de sol mormaii | 90 | 8 | head de sol de marca — **NO primaria** (ya la tiene Storm) → soporte, H2/copy, cross-link a Storm y a `/anteojos-de-sol/mormaii` |
| lentes/anteojos de sol cuadrados | 390/170 | 11/14 | forma genérica — **NO primaria** (ya la reclaman Vulk The Sil y Rusty Zinz; sumar a Curazao la volvería la tercera reclamación del mismo string) → mención honesta en copy/1er párrafo/alt/`frame_shape`, nunca title/H1 |
| polarizado lentes de sol | 260 | 36 | atributo genérico, dif. alta = soporte; 3/3 variantes son polarizadas → se afirma "polarizadas" para todo el modelo en copy/H2 (mismo criterio Daito/Terdey/Zinz) |
| mormaii lentes / lentes mormaii / anteojos mormaii | 390/170/170 | 7/7/7 | hub-only (`/anteojos-de-sol/mormaii`, futuro `/marcas/mormaii`), NUNCA en esta PDP |

**Anti-canibalización (Curazao vs Daito, mismo armazón/forma/precio, mismo brand)**: la diferencia de
género (HOMBRE explícito vs UNISEX de Daito) no evita la canibalización por sí sola como *etiqueta* —
la evita porque se traduce en un STRING de keyword secundaria distinto y sin superposición: Daito usa
`lentes/anteojos de sol unisex` (20/36) y Curazao usa `lentes de sol cuadrados hombre` (90/18) — cero
términos compartidos entre ambas cadenas de búsqueda. Si Curazao hubiese intentado reclamar "cuadrado"
a secas (la forma, no el género), sí colisionaría directo con Daito (mismo string, mismo cluster) — por
eso el género tiene que ir SOLDADO al string de la keyword secundaria (`cuadrados hombre`, no
`cuadrado` suelto), no alcanza con mencionarlo aparte en el copy. El nombre branded (`mormaii curazao`
vs `mormaii daito`) tampoco solapa: cero riesgo ahí. Cross-link obligatorio Curazao↔Daito ("el mismo
armazón cuadrado, en versión hombre / unisex") + ambos → `/anteojos-de-sol/mormaii`.

**Anti-canibalización (Curazao vs Storm, mismo brand, ambos HOMBRE)**: comparten género pero no forma
(Curazao CUADRADO vs Storm ENVOLVENTE) — mismo mecanismo que ya separa a Daito de Storm. Storm no
reclama "hombre" como keyword en ningún nivel (su único primaria es `lentes de sol mormaii` 90/8), así
que no hay string en disputa. Cross-link obligatorio Curazao↔Storm ("otros lentes de sol Mormaii para
hombre") + ambos → `/anteojos-de-sol/mormaii`.

**Anti-canibalización (Curazao vs "cuadrados" cross-brand — Vulk The Sil / Rusty Zinz)**: mismo gap ya
señalado en Daito — The Sil y Zinz ya reclaman `lentes/anteojos de sol cuadrados` (390/170) como
primaria cada uno en su propio cluster. Curazao suma su tercer producto "cuadrado" al catálogo sin
facet propia (`/anteojos-de-sol/cuadrados` sigue sin existir) pero, igual que Daito, NO pelea esa
primaria: usa "cuadrado" solo como atributo descriptivo (copy, `frame_shape`, alt), nunca como keyword
objetivo en title/H1. Gap ahora con 4 productos (Zinz, The Sil, Daito, Curazao) reclamando el mismo
string sin facet — reforzar prioridad de `/anteojos-de-sol/cuadrados` en `BACKLOG.md`.

**Anti-canibalización (Curazao vs Rusty Spell, "cuadrados hombre" cross-categoría)**: Spell reclama
`anteojos cuadrados hombre` (210/14) pero en RECETA (`/anteojos-de-receta/rusty/rusty-spell-receta`),
sin "de sol". Curazao reclama `lentes de sol cuadrados hombre` (90/18), con "de sol". Categorías e
intención de compra distintas (receta vs sol) — mismo criterio ya usado para separar Zinz sol de Zinz
receta. Sin solapamiento real.

**Anti-canibalización (Curazao vs color — Rusty Peating)**: igual que Daito, ninguno de los 3 colores
de Curazao es 100% negro puro (negro brillo/gris oscuro, negro mate/verde espejado, verde oliva/gris
oscuro) — el carril `negros cuadrados` (20/35) sigue siendo de Peating. Colores van en copy/alt, sin
intención de rankear ahí.

**Long-tails branded**: `mormaii curazao` (slug, title, H1, alt de cada variante) — vol 0 medido, alta
intención cuando el comprador ya conoce el nombre del modelo (viene de ML, boca en boca o redes).

**No usar**: "cuadrado"/"cuadrados" a secas como meta_title/H1 (mismo riesgo 3-way, ahora 4-way, ver
arriba) — usar "Hombre" como palabra de título/H1, no "Cuadrado". "Lentes de sol mormaii" como
meta_title/H1 (ya es de Storm). "Unisex" obviamente no aplica (Daito la tiene, además sería falso).

**Title** (auto): `Lentes de Sol Mormaii Curazao Hombre | Óptica Carballo` (54). **H1**: `Mormaii
Curazao — Hombre, 100% Polarizados`. **Meta**: `Lentes de sol Mormaii Curazao: poliamida liviana,
diseño para hombre, 100% polarizadas y UV400 cat. 3. 3 colores, envío a todo el país y garantía de 1
año.` (155).

*Mormaii Borneo (sol, ENVOLVENTE deportivo base 8 — mismo tipo de armazón que Storm, HOMBRE
explícito, armazón/frente/patilla de poliamida confirmada sin ambigüedad por atributo ML (a
diferencia del "inyectado" genérico con el que quedó cargado Storm), bisagra plástica reforzada,
lente de policarbonato POLARIZADA en las 2 variantes, UV400 y categoría 3 confirmados por grabado
físico en la varilla ("Borneo SN Col.XX Cat.3 UV400"), 2 colores — negro brillo/gris oscuro (Col.01,
sin stock), negro mate/verde (Col.02, stock 1)) — slug `mormaii-borneo` en
`/anteojos-de-sol/mormaii/mormaii-borneo`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii borneo (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** título+H1+slug+alt |
| lentes de sol mormaii | 90 | 8 | head de sol de marca — **NO primaria** (ya la tiene Storm) → soporte, H2/copy, cross-link a Storm y a `/anteojos-de-sol/mormaii` |
| lentes de sol envolventes hombre | 70 | 36 | forma+género REAL del modelo (idéntico a Storm) — dif. altísima + sería el 6°-7° reclamo de "envolvente/deportivo" ya usado por 5 Rusty → soporte honesto en copy/1er párrafo/alt/`frame_shape`, nunca title/H1 |
| anteojos de sol envolventes hombre | 50 | 36 | idem arriba |
| polarizado lentes de sol | 260 | 36 | atributo genérico, dif. alta = soporte; 2/2 variantes son polarizadas → se afirma "polarizadas" en copy/H2 (mismo criterio Daito/Curazao/Storm) — **no** diferenciador de título, Storm ya lo usa idéntico y no distingue nada entre ambos |
| lentes de sol hombre / anteojos de sol hombre | 5.400/3.600 | 14/11 | heads genéricos multi-marca de altísimo volumen — pertenecen a un futuro hub de género (`/anteojos-de-sol/hombre`), no a la PDP de una marca chica → mención honesta en copy/alt, jamás title/H1 |
| mormaii lentes / lentes mormaii / anteojos mormaii | 390/170/170 | 7/7/7 | hub-only (`/anteojos-de-sol/mormaii`, futuro `/marcas/mormaii`), NUNCA en esta PDP |

**Anti-canibalización (Borneo vs Storm, MISMA forma ENVOLVENTE + MISMO género HOMBRE + misma marca —
el caso más ajustado del cluster hasta hoy)**: a diferencia de Daito/Curazao (que se separan de Storm
por forma o por género), Borneo comparte con Storm las dos variables a la vez, así que el mecanismo de
Daito/Curazao (soldar forma+género en un string libre) no aplica acá — no existe un string
"envolvente hombre" libre de riesgo cross-brand para reclamar como primaria (difficulty 36, y sería el
6°-7° reclamo de "envolvente/deportivo" en todo el catálogo, ver nota original de Storm sobre los 5
Rusty envolventes). La separación real se apoya en cuatro capas, ninguna disponible en los casos
anteriores:
1. **Branded, cero riesgo**: `mormaii borneo` vs `mormaii storm` — strings totalmente distintos, sin
   overlap posible.
2. **La cabecera de sol de marca (`lentes de sol mormaii`, 90/8) sigue siendo 100% de Storm** por ser
   el primer producto de sol de la marca — Borneo no la reclama en ningún nivel, solo la menciona en
   copy/H2 con cross-link a Storm.
3. **"Hombre" como string de título queda abierto por diseño**: Storm deliberadamente no reclamó
   "hombre" en ningún nivel (usó "Polarizados" como palabra de cierre del title, que no diferencia
   nada porque ambos modelos son 100% polarizados) — ese hueco es justo el que cierra Borneo, primer
   Mormaii en usar "Hombre" explícito en title/H1 (mismo mecanismo que ya usa Curazao frente a Daito,
   aplicado acá contra Storm). Es honesto (el fabricante declara "Género: Masculino") y no compite con
   ningún string ya tomado.
4. **Diferenciador técnico real de copy (no SEO, pero refuerza E-E-A-T)**: el material de Borneo está
   confirmado sin ambigüedad como Poliamida por el propio atributo de ML; el de Storm quedó cargado
   como "inyectado" genérico (ML no lo declaró con la misma precisión en su momento) — se puede
   nombrar la diferencia real de material en el copy sin inventar nada.

Cross-link obligatorio Borneo↔Storm ("otros lentes de sol Mormaii para hombre") + ambos →
`/anteojos-de-sol/mormaii`.

**Anti-canibalización (Borneo vs Daito, forma y género opuestos)**: Daito es CUADRADO + UNISEX,
Borneo es ENVOLVENTE + HOMBRE — cero solapamiento de forma y de género, el caso más simple del
cluster. El secundario de Daito (`lentes/anteojos de sol unisex`, 20/36) y el diferenciador de
Borneo ("Hombre") son términos opuestos, sin riesgo. Cross-link Borneo↔Daito ("otros lentes de sol
Mormaii") + ambos → `/anteojos-de-sol/mormaii`.

**Anti-canibalización (Borneo vs Curazao, mismo género HOMBRE, forma distinta)**: Curazao es CUADRADO
+ HOMBRE, con secundaria soldada `lentes de sol cuadrados hombre` (90/18). Borneo es ENVOLVENTE +
HOMBRE, con "Hombre" como palabra suelta de título (no soldada a una forma, porque su forma real ya
está saturada como string, ver arriba). Las dos cadenas de búsqueda completas no coinciden
(`cuadrados hombre` ≠ título con "Hombre" solo) y la combinación específica "mormaii + hombre" no
tiene volumen medido en Ubersuggest (0 en `KEYWORDS OPTICA/`), así que no hay una keyword real en
disputa — el riesgo es solo estructural (dos títulos del mismo brand con la palabra "Hombre"),
aceptable porque el target real de cada página sigue siendo el nombre branded único. A vigilar: si el
catálogo suma un 3er-4to Mormaii hombre, revisar si conviene diferenciar el modificador de título (ya
son 2: Curazao y Borneo). Cross-link Borneo↔Curazao ("otros lentes de sol Mormaii para hombre") +
ambos → `/anteojos-de-sol/mormaii`.

**Anti-canibalización (Borneo vs "borneo anteojos"/"borneo lentes" — HALLAZGO CRÍTICO, marca
homónima)**: `borneo anteojos` (390/26) y `borneo lentes` (140/10) aparecen con volumen real en el
CSV, pero **NO son de Mormaii Borneo**. Búsqueda de verificación confirmó que existe una marca
argentina independiente, **Borneo Readers** (`borneo.com.ar`), especializada en anteojos de lectura,
sol y pantalla, con presencia fuerte en Mercado Libre y redes — casi con certeza esos dos volúmenes
están dominados por su intención de búsqueda, no por el modelo de Mormaii. Reclamarlos sería captar
tráfico con intención ajena (mal CTR, bounce alto, cero relevancia real) y viola el principio de
honestidad del framework. **NO USAR en ningún nivel** (ni title/H1 ni soporte/copy) — el único string
"Borneo" que se reclama es el compuesto `mormaii borneo`, nunca "borneo" suelto.

**Long-tails branded**: `mormaii borneo` (slug, title, H1, alt de cada variante) — vol 0 medido, alta
intención cuando el comprador ya conoce el nombre del modelo (viene de ML, boca en boca o redes).

**No usar**: "borneo" suelto (ver hallazgo crítico arriba — pertenece a Borneo Readers, marca
distinta). "Envolvente"/"deportivo" como meta_title/H1 (6°-7° reclamo del mismo string, ya usado por
5 Rusty + implícito en Storm). "Polarizados" como diferenciador de título — Storm ya lo usa idéntico
y ambos modelos son 100% polarizados, no diferencia nada. "Cuadrado"/"cuadrados" — no aplica, Borneo
es envolvente. "Unisex" — no aplica y sería falso (Borneo es HOMBRE explícito, ya lo tiene Daito).

**Title** (auto): `Lentes de Sol Mormaii Borneo Hombre | Óptica Carballo` (53). **H1**: `Mormaii
Borneo — Hombre, 100% Polarizados`. **Meta**: `Lentes de sol Mormaii Borneo: armazón envolvente de
poliamida para hombre, 100% polarizadas y UV400 cat. 3. 2 colores, envío a todo el país y garantía de
1 año.` (160)

---

*Mormaii Ancara 2 RX (receta, CUADRADO — confirmado sin ambigüedad por `SHAPE=Anteojos de Receta
Cuadrados` de ML, a diferencia del envolvente semi de Moorea —, HOMBRE explícito, armazón/frente/
patilla de poliamida, bisagras PLÁSTICAS reforzadas (vs las metálicas flex "Visyfit" de Moorea),
incluye correa elástica desmontable Mormaii — diferenciador único en todo el catálogo de receta —,
4 colores con stock real: Col 01 Negro Mate, Col 03 Azul Oscuro, Col 05 Azul Mate Translúcido, Col 06
Negro Mate con Gris) — slug `mormaii-ancara2-receta` en
`/anteojos-de-receta/mormaii/mormaii-ancara2-receta`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii ancara 2 (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** slug/title/H1/alt |
| anteojos deportivos con aumento | 260 | 20 | LIBRE en todo el catálogo (0 menciones previas) — intención exacta del producto, desambigua 100% contra sol → **primaria secundaria**, meta_description, H2, copy |
| anteojos deportivos hombre | 140 | 8 | difficulty bajísima, LIBRE en receta (Moorea nunca la reclamó, quedó branded puro) → soporte fuerte, H1/copy |
| correa para anteojos / correa para lentes | 140/110 | 21/16 | diferenciador ÚNICO y verificable (única correa desmontable incluida del catálogo) → copy, alt de la foto de correa, H2 dedicado |
| lentes deportivos con aumento / anteojos para deportes con aumento | 320/110 | 18/18 | variantes de respaldo de la primaria secundaria → copy, FAQ si se arma |
| anteojos deportivos | 590 | 9 | genérico sin género/receta, alto volumen pero compartido con toda la categoría → mención honesta en copy, no primaria |
| anteojos con aumento | 480 | 18 | head genérico de toda la categoría receta → hub-only (`/anteojos-de-receta`), 1 mención copy, nunca title/H1 |
| anteojos cuadrados hombre | 210 | 14 | **BLOQUEADA — ya es primaria de Rusty Spell** (`/anteojos-de-receta/rusty/rusty-spell-receta`) → NO usar en ningún nivel |
| lentes/anteojos cuadrados | 320/480 | 18/10 | forma bare, riesgo cross-brand (Spell/Katleen/Daito/Curazao ya la comparten) → solo copy/alt/`frame_shape`, nunca title/H1 |
| mormaii lentes / lentes mormaii / anteojos mormaii | 390/170/170 | 7/7/7 | hub-only (`/anteojos-de-receta/mormaii`), NUNCA en esta PDP |

**Anti-canibalización (Ancara 2 vs Moorea, mismo brand + misma categoría + mismo género — el caso más
ajustado del sub-cluster de receta)**: ambos son RX + deportivo + hombre + Mormaii, pero se separan por
cuatro capas simultáneas:
1. **Forma real, confirmada sin ambigüedad por ML**: Ancara 2 es CUADRADO (`SHAPE=Anteojos de Receta
   Cuadrados`), Moorea es ENVOLVENTE semi (corregido por el founder en seed 113) — mismo mecanismo
   forma-real que ya separa Daito de Storm.
2. **Moorea es branded puro por diseño de origen**: al cargarse no había volumen medible para
   "deportivo"/"envolvente", así que su primaria quedó 100% `mormaii moorea` y nunca reclamó ningún
   string de "deportivo" en title/H1/meta. Ancara 2 es el PRIMER RX Mormaii en reclamar
   `anteojos deportivos con aumento` (260/20) como keyword real — cero string compartido.
3. **Bisagra distinta y honesta**: plásticas reforzadas (Ancara 2) vs metálicas flex "Visyfit"
   (Moorea) — diferenciador de copy/E-E-A-T, no de keyword, pero evita que ambas fichas suenen
   calcadas.
4. **Correa elástica desmontable incluida — exclusiva de Ancara 2 en todo el catálogo de receta**,
   verificable en las fotos del fabricante. Habilita `correa para anteojos`/`correa para lentes`
   (140/110, diff 21/16) sin ningún riesgo de canibalización, ni con Moorea ni con ningún otro
   producto.

No se soldó "cuadrado" a "hombre" como ruta de diferenciación (a diferencia de Daito/Curazao en sol)
porque `anteojos cuadrados hombre` (210/14) ya es la primaria de Rusty Spell en RECETA — usar esa
combinación exacta hubiera colisionado de lleno. La ruta elegida (deportivo + aumento + correa) es un
campo léxico totalmente distinto, sin overlap con Spell ni con Moorea.

Cross-link obligatorio Ancara 2↔Moorea ("otro armazón de receta deportivo Mormaii para hombre, en
versión cuadrada") + ambos → `/anteojos-de-receta/mormaii`. Cross-link secundario hacia
`/anteojos-de-sol/mormaii` ("también tenemos lentes de sol Mormaii para hombre") por ser la misma
marca, distinta categoría.

**Anti-canibalización (Ancara 2 vs Rusty Spell, "cuadrados hombre" cross-brand mismo categoría)**:
Spell reclama `anteojos cuadrados hombre` (210/14) como primaria en receta — Ancara 2 NO reclama ese
string en ningún nivel (title/H1/meta), lo usa solo como atributo descriptivo (`frame_shape: cuadrado`,
copy, alt). Mismo criterio que ya aplica el cluster completo para "cuadrado" cross-brand.

**Anti-canibalización (Ancara 2 vs Rusty And Now, sol, deportivo unisex)**: And Now reclama
`anteojos/lentes de sol deportivos` (110-210) con "de sol" explícito en el string — Ancara 2 nunca usa
"de sol" en ningún nivel. Categorías y cadenas de búsqueda completas no coinciden, sin riesgo.

**A vigilar**: si el catálogo suma un tercer RX Mormaii deportivo, revisar si "deportivo" necesita
soldarse a un segundo atributo (mismo tipo de vigilancia ya dejado por Borneo/Curazao con "hombre").

**Long-tails branded**: `mormaii ancara 2` (slug, title, H1, alt de cada variante) — vol 0 medido, alta
intención cuando el comprador ya conoce el modelo (viene de ML, boca en boca o redes).

**No usar**: "cuadrado"/"cuadrados hombre" como meta_title/H1 (colisión directa con Rusty Spell, ver
arriba). "Anteojos con aumento" a secas como primaria (head genérico de toda la categoría receta,
hub-only). "Envolvente" (no aplica, Ancara 2 es cuadrado, ese es el de Moorea).

**Title** (auto): `Armazón Rx Mormaii Ancara 2 Deportivo | Óptica Carballo` (55). **H1**: `Mormaii
Ancara 2 RX — Deportivo para Hombre, con Correa Incluida`. **Meta**: `Mormaii Ancara 2: anteojos
deportivos con aumento para hombre, incluye correa elástica Mormaii. Poliamida liviana, envío a todo
el país y garantía de 1 año.` (156)

---

*Mormaii Hover (receta, RECTANGULAR, HOMBRE según ficha técnica de interoptica.com.ar — el founder
no lo aclaró espontáneamente esta vez —, armazón/frente/patilla de poliamida confirmada por el
founder, bisagra plástica reforzada, apto monofocales/bifocales/progresivos, **PRIMER producto
clip-on del catálogo**: viene con un clip-on abatible que se engancha por la zona nasal, polarizado/
UV400/cat.3, 5 colores de armazón con clip a tono — sólo Negro-Azul (clip espejado celeste) con stock
real) — slug `mormaii-hover` en `/anteojos-de-receta/mormaii/mormaii-hover`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii hover (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** slug/title/H1/alt |
| clip on para anteojos recetados | 260 | 6 | difficulty bajísima, intención EXACTA del producto (receta + clip-on), LIBRE en todo el catálogo → **primaria secundaria**, title, H1, meta_description, H2, copy |
| lentes clip on | 1.000 | 5 | cabecera del campo léxico (mixta sol/receta, alto volumen) — NO primaria (demasiado genérica, no distingue que es armazón de receta) → soporte, H2, copy |
| anteojos clip on hombre / anteojos clip on mujer | 390/590 | 4/6 | género+producto — Hover es masculino explícito (ficha del distribuidor) → soporte, copy, no title (ya "hombre" no suma mucho sobre el branded + "clip on") |
| anteojos con clipon / clip on anteojos / clipones anteojos | 260/140/110 | 7/8/6 | variantes ortográficas de respaldo de la primaria secundaria → 1 mención de "clipon" (una palabra) en el body, cubre la variante sin espacio/guion |
| anteojos con aumento | 480 | 18 | head genérico de toda la categoría receta → hub-only (`/anteojos-de-receta`), 1 mención copy, nunca title/H1 |
| mormaii lentes / lentes mormaii / anteojos mormaii | 390/170/170 | 7/7/7 | hub-only (`/anteojos-de-receta/mormaii`), NUNCA en esta PDP |

**Anti-canibalización (Hover vs Moorea/Ancara 2, mismo brand + misma categoría RECETA + mismo
género HOMBRE)**: sin riesgo real — ninguno de los dos usa "clip-on"/"clip on" en ningún nivel
(confirmado releyendo sus 2 entries completas en este documento). El campo léxico de Hover
("clip on para anteojos recetados", "lentes clip on") es 100% propio, cero overlap con
"anteojos deportivos con aumento" (Ancara 2) ni con el posicionamiento branded puro de Moorea. No
hace falta ningún mecanismo de separación forma/género — el clip-on ya es la separación.

Cross-link obligatorio Hover↔Ancara2↔Moorea ("otros armazones de receta Mormaii para hombre") +
los 3 → `/anteojos-de-receta/mormaii`.

**No usar**: "anteojos deportivos con aumento" (ya es de Ancara 2, y Hover no es explícitamente
deportivo). "Cuadrado"/"cuadrados" (Hover es rectangular, no cuadrado — distinción visual real, no
forzar la keyword saturada de Spell/Katleen/Daito/Curazao). "Clip magnético" (sin volumen medido en
el CSV, descartado por `seo-strategist`). No mencionar "5 colores" en meta/title mientras sólo 1
tenga stock real (regla de negocio).

**Title** (auto): `Anteojos de Receta Mormaii Hover Clip-On | Óptica Carballo` (58). **H1**: `Mormaii
Hover` (plano — mismo criterio que Joaca 4, ver hallazgo del H1 no implementado en `BACKLOG.md`).
**Meta**: `Mormaii Hover: armazón de receta con clip-on polarizado, UV400 y cat.3 incluido. Apto
mono, bifocal y progresivo. Envío a todo el país, garantía 1 año.` (150)

---

*Mormaii San Juan (sol, CUADRADO, HOMBRE explícito — GENDER de ML da "Sin género" en las 3
publicaciones, override por criterio explícito del founder, mismo precedente ya usado en
Curazao/Borneo/Ancara2 —, armazón/frente/patilla de poliamida, bisagra plástica reforzada, lente de
policarbonato POLARIZADA en las 3 variantes, UV400 y categoría 3, 3 colores con stock real — Col 01
negro mate/lente gris oscuro clásica (1/3, no espejada), Col 02 negro mate con detalle amarillo/lente
semi-espejada gris (1/3), Col 04 azul mate/lente espejada azul (1/3)) — slug `mormaii-san-juan` en
`/anteojos-de-sol/mormaii/mormaii-san-juan`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii san juan (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** título+H1+slug+alt |
| anteojos de sol cuadrados hombre | 70 | 35 | forma+género en SOL, LIBRE (distinto de `lentes de sol cuadrados hombre` 90/18 de Curazao por el corte lentes/anteojos, mismo mecanismo ya usado en The Take↔Yeah, Dunsert↔Le Groupie, Malice↔Blozon) → **primaria secundaria**, title (cabecera "Anteojos de Sol"), H1, copy/H2 |
| lentes de sol mormaii | 90 | 8 | head de sol de marca — NO primaria (ya la tiene Storm) → soporte, cross-link a Storm y a `/anteojos-de-sol/mormaii` |
| lentes de sol espejados | 90 | 16 | real pero fraccional (2/3 variantes: Col02 semi-espejada, Col04 espejada) — NO se afirma del modelo completo en title/H1 → copy/H2/alt, acotado a esas 2 variantes puntuales |
| lentes de sol azules | 90 | 15 | real pero fraccional (1/3, solo Col04) — mismo criterio, copy/alt acotado a esa variante |
| lentes/anteojos de sol cuadrados | 390/170 | 11/14 | 5° reclamo cross-brand del mismo string (Zinz, The Sil, Daito, Curazao, San Juan) sin facet propia → copy/alt/`frame_shape` únicamente, nunca title/H1 |
| optica san juan | 1.600 | 20 | **NO USAR EN NINGÚN NIVEL** — intención 100% geográfica (óptica física en la provincia de San Juan), mismo vicio que "borneo" suelto (Borneo Readers). "San Juan" nunca va sin "Mormaii" pegado |
| mormaii lentes / lentes mormaii / anteojos mormaii | 390/170/170 | 7/7/7 | hub-only (`/anteojos-de-sol/mormaii`), NUNCA en esta PDP |

**Anti-canibalización (San Juan vs Curazao, mismo brand + misma forma CUADRADO + mismo género
HOMBRE — el caso más difícil del cluster, sin diferencia de forma ni de género disponible)**: el
mecanismo forma+género soldado que separó Curazao de Daito y Borneo de Curazao no aplica acá (ambas
variables son idénticas). La separación se apoya en dos capas:
1. **Split léxico "lentes vs anteojos" en la keyword secundaria soldada**: Curazao reclama
   `lentes de sol cuadrados hombre` (90/18), San Juan reclama `anteojos de sol cuadrados hombre`
   (70/35) — strings distintos, cero overlap de query, mismo mecanismo ya validado 3 veces en el
   catálogo (The Take↔Yeah, Dunsert↔Le Groupie, Malice↔Blozon). El corte se traduce directo al title
   tag: Curazao abre con "Lentes de Sol", San Juan abre con "Anteojos de Sol".
2. **Colorway real y verificable**: San Juan tiene 2/3 variantes con lente espejada/semi-espejada
   (Col02 gris semi-espejada, Col04 azul espejada); Curazao tiene 1/3 (verde espejado). Diferenciador
   honesto de copy/E-E-A-T, acotado a las variantes puntuales, nunca afirmado del modelo completo en
   title/H1 (mismo criterio 2/3 ya aplicado en Vulk Raven / Rusty Yeah / Rusty Play-Patien).

Cross-link obligatorio San Juan↔Curazao ("el mismo armazón cuadrado Mormaii para hombre, otra
paleta de color") + ambos → `/anteojos-de-sol/mormaii`.

**Anti-canibalización (San Juan vs Daito, mismo forma CUADRADO, género distinto)**: Daito es
CUADRADO+UNISEX, San Juan es CUADRADO+HOMBRE — mismo mecanismo que ya separa Curazao de Daito
(género soldado al string). Cross-link San Juan↔Daito ("otros lentes de sol Mormaii cuadrados") +
ambos → `/anteojos-de-sol/mormaii`.

**Anti-canibalización (San Juan vs Storm/Borneo, mismo género HOMBRE, forma ENVOLVENTE distinta)**:
mismo mecanismo que ya separa Curazao de Storm y de Borneo — forma distinta, cero string compartido
(San Juan no reclama "hombre" suelto, va soldado a "cuadrados"). Cross-link San Juan↔Storm↔Borneo
("otros lentes de sol Mormaii para hombre") + todos → `/anteojos-de-sol/mormaii`.

**Anti-canibalización (San Juan vs "cuadrados" cross-brand — Vulk The Sil / Rusty Zinz)**: mismo gap
ya señalado en Daito/Curazao — The Sil y Zinz reclaman `lentes/anteojos de sol cuadrados` (390/170)
como primaria en sus propios clusters. San Juan es ahora el **5° producto** (Zinz, The Sil, Daito,
Curazao, San Juan) que usa "cuadrado" solo como atributo descriptivo (copy/`frame_shape`/alt), nunca
como keyword objetivo en title/H1 — escalar aún más la prioridad de `/anteojos-de-sol/cuadrados` en
`BACKLOG.md`.

**Anti-canibalización (San Juan vs "optica san juan" — HALLAZGO CRÍTICO, colisión geográfica)**:
`optica san juan` (1.600/20) y variantes (`optica en san juan` 880/19, `optica barbieri/boschetti san
juan`) tienen intención 100% geográfica — óptica física en la provincia de San Juan, Argentina. Mismo
vicio que el hallazgo "Borneo Readers" ya documentado en este cluster. **NO USAR "San Juan" suelto en
ningún nivel** (ni copy ni alt) — el único string que se reclama es el compuesto `mormaii san juan`.

**Anti-canibalización (San Juan vs color — Rusty Peating)**: ningún colorway de San Juan es negro
puro (Col01 tiene lente gris oscuro, no negro; Col02/04 no son negros) — el carril `negros cuadrados`
sigue siendo de Peating, sin intención de disputarlo.

**Long-tails branded**: `mormaii san juan` (slug, title, H1, alt de cada variante) — vol 0 medido.

**No usar**: "san juan" suelto (hallazgo crítico geográfico, ver arriba). "Cuadrado"/"cuadrados" a
secas en title/H1 (5° reclamo cross-brand). "Lentes de sol cuadrados hombre" (ya es de Curazao — usar
"anteojos de sol cuadrados hombre"). "Espejados"/"azules" como claim del modelo completo en title/H1
(fraccional, 1/3-2/3, va solo en copy/alt acotado). "Lentes de sol mormaii" en title/H1 (ya es de
Storm).

**Title** (auto): `Anteojos de Sol Mormaii San Juan Hombre | Óptica Carballo` (57). **H1**: `Mormaii
San Juan — Hombre, 100% Polarizados`. **Meta**: `Anteojos de sol Mormaii San Juan: poliamida liviana,
hombre, 100% polarizadas y UV400 cat. 3. Con lente espejada azul, envío a todo el país y garantía 1
año.` (157)

---

*Mormaii Joaca 4 (sol, ENVOLVENTE deportivo base 8 — mismo tipo de armazón que Storm/Borneo, HOMBRE
según ficha técnica del distribuidor (interoptica.com.ar; a diferencia de otras entries de este
cluster, el founder no lo aclaró espontáneamente esta vez — se usó el dato del fabricante), armazón/
frente/patilla de poliamida confirmada por el founder (interoptica sólo da "Inyección" como proceso),
bisagra plástica reforzada, lente de policarbonato POLARIZADA en las 6 variantes, UV400 y categoría 3
confirmados por grabado físico en 2/6 colores ("JOACA 4 Col.0X Cat.3 UV400"), 6 colores — BR Negro
(Col.01, único con stock real: 1), MT Negro (Col.02), Negro-Rojo (Col.03), Negro-Azul (Col.04), Humo
(Col.06), Gris (Col.08), todos en stock 0 salvo BR Negro) — slug `mormaii-joaca-4` en
`/anteojos-de-sol/mormaii/mormaii-joaca-4`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii joaca 4 (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** título+H1+slug+alt |
| lentes de sol mormaii | 90 | 8 | head de sol de marca — NO primaria (ya la tiene Storm) → soporte, cross-link a Storm/Borneo y a `/anteojos-de-sol/mormaii` |
| lentes de sol envolventes hombre / anteojos de sol envolventes hombre | 70/50 | 36/36 | forma+género real del modelo, pero sería el 8°-9° reclamo de "envolvente/deportivo" cross-catálogo (5 Rusty + Storm + Borneo) con difficulty alta → soporte honesto en copy/alt/`frame_shape`, nunca title/H1 |
| polarizado lentes de sol | 260 | 36 | atributo genérico, dif. alta; 6/6 variantes son polarizadas → se afirma en copy/H2 (mismo criterio del resto del cluster), no diferenciador de título (Storm/Borneo ya lo usan idéntico) |
| mormaii lentes / lentes mormaii / anteojos mormaii | 390/170/170 | 7/7/7 | hub-only (`/anteojos-de-sol/mormaii`), NUNCA en esta PDP |

**Anti-canibalización (Joaca 4 vs Storm y Borneo, MISMA forma ENVOLVENTE + MISMO género HOMBRE +
misma marca — 3er producto de esta combinación exacta, cruza el umbral de "a vigilar" que había
quedado anotado en la entry de Borneo)**: no existe un string "envolvente hombre" libre de riesgo
cross-brand para reclamar como primaria (mismo problema que ya tenía Borneo frente a Storm, ahora con
un tercer competidor interno). La separación se apoya en:
1. **Branded, cero riesgo**: `mormaii joaca 4` vs `mormaii storm` vs `mormaii borneo` — strings
   totalmente distintos.
2. **Split léxico ya validado**: el meta_title de Joaca 4 abre con "Anteojos de Sol" (no "Lentes de
   Sol", que usan Storm y Borneo) — mismo mecanismo de San Juan↔Curazao, Dunsert↔Le Groupie, The
   Take↔Yeah, aplicado acá sin buscarlo a propósito (ya estaba en el borrador).
3. **Diferenciador real y verificable, honesto (no forzado)**: Joaca 4 es el modelo con MÁS colores
   de toda la línea de sol Mormaii — 6, contra 3 de Curazao/San Juan y 2 de Borneo. Se usa en
   meta_description y en una frase de la descripción del producto ("Dentro de la línea de sol de
   Mormaii, el Joaca 4 es el que más colores tiene"), no en title/H1 (no hay presupuesto de
   caracteres y el patrón de H1 con sufijo tipo "— Hombre, 6 Colores" documentado en las entries
   anteriores de este cluster **nunca se implementó realmente** — ver hallazgo abajo).

**Hallazgo (no introducido por Joaca 4, preexistente en todo el cluster)**: las entries de
Storm/Daito/Curazao/Borneo/San Juan en este documento describen un "H1" con formato `Marca Modelo —
Diferenciador` (ej. `Mormaii Borneo — Hombre, 100% Polarizados`), pero el campo real `products.name`
de esos 5 productos en los seeds aplicados es el nombre plano ("Mormaii Borneo", sin sufijo) — y
`product.name` es el único campo que alimenta `<h1>` en `components/catalog/product-page.tsx` (no
hay campo H1 separado), así que ese H1 documentado nunca estuvo live en ninguno de los 5. Por
consistencia con el estado REAL del resto del cluster, Joaca 4 también queda con `name` plano
("Mormaii Joaca 4"). Entry en `BACKLOG.md` para que el founder decida si vale la pena implementar el
sufijo de verdad (tocaría `name` en 6 productos, que también aparece en breadcrumbs/carrito/JSON-LD,
no sólo en el H1) o si se corrige la documentación de este archivo para dejar de describir un H1 que
no existe.

Cross-link obligatorio Joaca 4↔Storm↔Borneo ("otros lentes de sol Mormaii envolventes para hombre")
+ los 3 → `/anteojos-de-sol/mormaii`.

**Long-tails branded**: `mormaii joaca 4` (slug, title, H1, alt de cada variante) — vol 0 medido.

**No usar**: "Envolvente"/"deportivo" como meta_title/H1 (8°-9° reclamo del mismo string en el
catálogo). "Polarizados" como diferenciador de título (Storm/Borneo ya lo usan idéntico, no
diferencia nada). "Cuadrado" — no aplica, Joaca 4 es envolvente.

**Title** (auto): `Anteojos de Sol Mormaii Joaca 4 Hombre | Óptica Carballo` (56). **H1**: `Mormaii
Joaca 4` (plano — ver hallazgo del H1 no implementado arriba). **Meta**: `Anteojos de sol Mormaii
Joaca 4: envolvente deportivo, poliamida, hombre, 100% polarizadas y UV400 cat. 3. 6 colores, envío a
todo el país y garantía 1 año.` (156)

---

*Mormaii Traful (receta, REDONDO tipo panto, UNISEX, frente inyectado delgado de Grilamid — primer
precedente de este material en el catálogo, distinto de la "poliamida" genérica del resto de Mormaii,
bisagra metálica flex "Visyfit" italiana, apto monofocal/bifocal/progresivo sin restricción, 5
colores — Negro Brillo/Negro Mate/Azules/Azul Mate Turquesa/Transparente Cristal) — slug
`mormaii-traful-receta` en `/anteojos-de-receta/mormaii/mormaii-traful-receta`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii traful (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** título+H1+slug+alt |
| anteojos redondos | 880 | 12 | forma real del modelo — **NO primaria** (ya es de Rusty Ther Optics) → Traful sería la 6ta ficha redonda del catálogo (3 marcas), forma como soporte de copy/alt, nunca primaria |
| panto | — | — | término de industria, no de consumidor → sólo en descripción larga, nunca en title/meta |
| anteojos recetados | 720 | 9 | head compartido de receta → copy, no exclusivo |

**Diferenciador real**: primera ficha REDONDA de Mormaii RX (las otras 3 RX de la marca de ese momento
eran envolvente/cuadrado/rectangular, cero solapamiento intra-marca) — se usa como diferenciador
honesto de forma sin pelear "anteojos redondos" como keyword.

Cross-link obligatorio Traful↔Moorea↔Ancara2↔Hover (familia receta Mormaii) + Traful↔Ther↔Kirt↔Misty
(redondos cross-brand, sólo mención en copy, nunca keyword compartida).

**No usar**: "anteojos redondos" en title/H1 (ya es de Rusty Ther). "Panto" en ningún nivel de cara al
cliente (jerga de industria).

**Title**: `Armazón de Receta Mormaii Traful Redondo | Óptica Carballo` (58). **H1**: `Mormaii Traful`
(plano). **Meta**: `Armazón de receta Mormaii Traful: redondo unisex, Grilamid liviano con bisagra
flex Visyfit. Apto monofocal, bifocal y progresivo. Envío a toda Argentina.`

---

*Mormaii Leñas (receta, CUADRADO, UNISEX, Grilamid — segundo precedente del catálogo tras Traful,
bisagra metálica flex "Visyfit", apto monofocal/bifocal/progresivo sin restricción, 4 colores — Negro
Brillo/Negro Mate/Gris Translúcido con Turquesa/Azul Brillo) — slug `mormaii-lenas-receta` en
`/anteojos-de-receta/mormaii/mormaii-lenas-receta`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii leñas (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** título+H1+slug+alt |
| anteojos/lentes cuadrados | 480/15, 880/10 | ya tomadas por Rusty Zinz Optics (dueño) y Rusty Peating Carey (soporte) dentro del mismo carril forma+género → Leñas NO reclama "cuadrado" en ningún nivel de título/H1 |

**Diferenciador real de meta_title**: "Grilamid" (2do precedente del catálogo, sin competencia) en vez
de "Cuadrado" — mismo criterio que Mormaii Ancara2 (mismo brand, misma categoría) ya aplicó antes:
sacó "cuadrado" de su title/H1 por el mismo motivo. "Cuadrado" SÍ permitido en meta_description,
description y `frame_shape` (la regla de exclusión es sólo meta_title/H1).

Cross-links obligatorios: familia receta Mormaii (Traful, Moorea, Ancara2, Hover) + par específico
Leñas↔Traful (única pareja Grilamid del catálogo en ese momento) + Leñas↔Ancara2 (ambos cuadrados
Mormaii RX, género distinto) + similares cross-brand (Rusty Zinz Optics, Rusty Peating Carey) como
"te puede interesar", sin anchor de keyword compartida.

**Gap de infraestructura (no bloqueante, escalado a BACKLOG.md)**: no existe faceta
`/anteojos-de-receta/cuadrados` — con Leñas ya son 4 productos de receta que usan "cuadrado" sólo como
atributo sin URL propia donde consolidar ese tráfico.

**No usar**: "cuadrado"/"cuadrados" en meta_title/H1 (ya tomado cross-brand). "Leñas" con acento
distinto o sin "Mormaii" pegado.

**Title**: `Armazón de Receta Mormaii Leñas Grilamid | Óptica Carballo` (58). **H1**: `Mormaii Leñas`
(plano). **Meta**: `Armazón de receta Mormaii Leñas: cuadrado unisex, Grilamid liviano con bisagra
flex Visyfit. Apto monofocal, bifocal y progresivo. Envío a toda Argentina.`

---

*Mormaii Maceio (receta, RECTANGULAR, UNISEX, talle CHICO — alto de lente 31mm, Grilamid — 3er
precedente del material, bisagra flex Visyfit, SOLO monofocal por decisión explícita del founder ante
consulta de `optical-expert` (alto reducido, no entra bien con progresivo/bifocal), 5 colores) — slug
`mormaii-maceio-receta` en `/anteojos-de-receta/mormaii/mormaii-maceio-receta`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii maceio (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** título+H1+slug+alt |
| lentes monofocales | 170 | 11 | carril libre real con volumen, sin dueño en el catálogo → **primaria secundaria** en meta_title, refleja la restricción real de compra |
| anteojos/lentes rectangulares | 480/15, 880/10 | ya tomadas por Rusty R-CY 02 (primaria) y Rusty Woxi (secundaria) → Maceio NO pelea "rectangular" en título/H1 |

**Diferenciador de honestidad**: "monofocal" gana sobre "chico"/"rectangular" porque es una
RESTRICCIÓN de compra, no un extra — el comprador tiene que saberlo antes de entrar al funnel, mismo
criterio ya validado en Rusty Woxi (seed 74, precedente directo del mismo patrón: armazón chico,
monofocal-only).

Cross-links obligatorios: familia receta Mormaii (Traful, Leñas, Ancara2, Hover, Moorea) + par
específico Maceio↔Rusty Woxi (cross-brand, mismo uso real: armazón chico, sólo monofocal).

**No usar**: "rectangular" en title/H1 (ya tomado por Rusty R-CY 02/Woxi). "Apto para todo tipo de
lente" ni ninguna frase que sugiera bi/progresivo (falso — ver restricción de compatibilidad).

**Title**: `Armazón Rx Mormaii Maceio Monofocal | Óptica Carballo` (58, "Rx" en vez de "de Receta" para
que entre el diferenciador). **H1**: `Mormaii Maceio` (plano). **Meta**: `Armazón de receta Mormaii
Maceio, talle chico en Grilamid, ideal para lentes monofocales de lectura. Envío a todo el país,
estuche y garantía oficial de 1 año.`

---

*Mormaii Monterrey 2 (sol, CUADRADO — confirmado sin ambigüedad por `FRAME_SHAPE` de ML, HOMBRE
(founder explícito, ML traía "Sin género" genérico), poliamida, bisagra plástica reforzada, lente
polarizada UV400 cat.3 en las 3 variantes, 3 colores) — slug `mormaii-monterrey-2` en
`/anteojos-de-sol/mormaii/mormaii-monterrey-2`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii monterrey 2 (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** título+H1+slug+alt |
| lentes/anteojos de sol cuadrados hombre | 90/70 | 18/35 | 3er Mormaii "cuadrado+hombre" en sol (Curazao, San Juan, Monterrey 2) → **NO primaria**, el nombre branded alcanza solo sin forzar diferenciador |

**Anti-canibalización**: con Monterrey 2 son 3 Mormaii "cuadrado+hombre" de sol — las 2 strings de
forma+género con volumen real ya las tienen Curazao y San Juan. Monterrey 2 va 100% branded en
title/H1/meta, cero mención de forma como keyword objetivo (sí en copy/alt/`frame_shape`).

Cross-link obligatorio Monterrey 2↔Curazao↔San Juan↔Borneo↔Joaca4↔Storm ("otros lentes de sol Mormaii
para hombre") + todos → `/anteojos-de-sol/mormaii`.

**No usar**: "cuadrado"/"cuadrados hombre" en title/H1 (3er reclamo, ya saturado).

**Title**: `Lentes de Sol Mormaii Monterrey 2 Hombre | Óptica Carballo` (58). **H1**: `Mormaii
Monterrey 2` (plano). **Meta**: `Anteojos de sol Mormaii Monterrey 2: armazón robusto de poliamida
para hombre. Polarizados, UV400 cat. 3. Envío a todo el país, garantía de 1 año.`

---

*Mormaii Madri (sol, CUADRADO, HOMBRE (founder + ML `FILTRABLE_GENDER=Hombre` coinciden sin
ambigüedad), poliamida, bisagra plástica reforzada, lente polarizada UV400 cat.3 en las 3 variantes,
3 colores) — slug `mormaii-madri` en `/anteojos-de-sol/mormaii/mormaii-madri`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii madri (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** título+H1+slug+alt |
| lentes/anteojos de sol cuadrados hombre | 90/70 | 18/35 | 4to Mormaii "cuadrado+hombre" en sol → **NO primaria**, mismo criterio que Monterrey 2 |

**Anti-canibalización**: 4to Mormaii "cuadrado+hombre" de sol (Curazao, San Juan, Monterrey 2, Madri)
— el carril de forma+género ya está totalmente saturado dentro del propio cluster, Madri va 100%
branded sin excepción. Contaminación geográfica de "Madri" vs "Madrid" (con D) confirmada BAJA — sin
coincidencia exacta de grafía, más baja que el caso San Juan — igual, "Madri" nunca suelto sin
"Mormaii" por consistencia de cluster.

Cross-link obligatorio Madri↔Curazao↔San Juan↔Monterrey 2↔Borneo↔Joaca4↔Storm ("otros lentes de sol
Mormaii para hombre") + todos → `/anteojos-de-sol/mormaii`.

**No usar**: "cuadrado"/"cuadrados hombre" en title/H1 (4to reclamo, saturado). "Madri" suelto sin
"Mormaii" (riesgo geográfico + fonético con "Madrid").

**Title**: `Anteojos de Sol Mormaii Madri Hombre | Óptica Carballo` (54). **H1**: `Mormaii Madri`
(plano). **Meta**: `Anteojos de sol Mormaii Madri: poliamida resistente y liviana para hombre, 100%
polarizados y UV400 cat. 3. 3 colores, envío a todo el país y garantía 1 año.`

---

*Mormaii Kona MAG (receta, CUADRADO, UNISEX, poliamida, bisagra metálica inyectada reforzada (NO
Visyfit flex), **PRIMER modelo de la línea MAG/magnética del catálogo** — imanes en la mitad de la
patilla para colgar de la ropa o adherir a superficie metálica, apto monofocal/bifocal/progresivo sin
restricción, 3 colores, cada uno publicación ML separada) — slug `mormaii-kona-mag-receta` en
`/anteojos-de-receta/mormaii/mormaii-kona-mag-receta`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii kona mag (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** título+H1+slug+alt |
| anteojos/lentes con imán / imantados | 170-260 | 18-49 | volumen real PERO el SERP actual es de OTRO producto (lectura de kiosco plegable, clip-on 2-en-1 con imán en el PUENTE, no en la patilla) → **NO primaria**, atraería tráfico de intención equivocada |
| anteojos/lentes cuadrados | 480/15, 880/10 | ya tomado por Zinz/Peating Carey/Ancara2/Leñas → Kona MAG NO pelea "cuadrado" en título/H1 |

**Criterio sentado para los PRÓXIMOS modelos MAG** (Traful Magnetic, Swap NG 2 Magnetic, Leñas 3
Magnetic, Asana Magnetic — no re-auditar desde cero cada vez):
1. "Magnético"/"imán"/"imantado" NUNCA como keyword primaria de title/H1 — SERP capturado por
   productos de otra categoría (lectura de kiosco, clip-on 2-en-1).
2. Chequear forma+género contra el resto del catálogo RX Mormaii antes de asumir que "magnético"
   alcanza como diferenciador único — puede no alcanzar si dos MAG comparten forma+género.
3. Siempre aclarar en H2/body qué hace el imán y que NO es sistema de cambio de lentes (regla de
   negocio, no prometer de más).
4. Distinguir siempre de sistemas de clip-on ya existentes (Hover) en el copy.
5. Seguir la sigla/nombre real de ML + grabado físico para `name`/slug de cada modelo MAG.
6. Ni bien haya 2+ productos MAG cargados, armar cross-link "línea magnética Mormaii" entre ellos.

Cross-links obligatorios: familia receta Mormaii completa + Kona MAG↔Leñas (mismo cuadrado unisex,
con/sin imán) + Kona MAG↔Hover (imán vs clip-on, para no confundir mecanismos).

**No usar**: "magnético"/"imán" como keyword de title/H1 (intención equivocada de SERP). "Cuadrado" en
title/H1 (ya saturado).

**Title**: `Armazón de Receta Mormaii Kona Magnético | Óptica Carballo` (58). **H1**: `Mormaii Kona
MAG` (plano, sigla real). **Meta**: `Mormaii Kona MAG: armazón de receta cuadrado en poliamida, con
imanes en la patilla para colgar. Apto mono, bifocal y progresivo. Envío a todo el país.`

---

*Mormaii Leñas 2 MAG (receta, RECTANGULAR, talle CHICO, UNISEX, poliamida, bisagra metálica flex
"Visyfit" (distinta de Kona MAG, que es sin flex), **segundo modelo MAG del catálogo**, SOLO
monofocal por talle chico (alto de lente ~35mm), 3 colores, cada uno publicación ML separada) — slug
`mormaii-lenas-2-mag-receta` en `/anteojos-de-receta/mormaii/mormaii-lenas-2-mag-receta`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii leñas 2 mag (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** título+H1+slug+alt |
| lentes monofocales | 170 | 11 | carril libre real, sin dueño → **primaria secundaria**, misma lógica de honestidad que Maceio |
| anteojos/lentes con imán | 170-260 | 18-49 | mismo criterio ya sentado en Kona MAG → NO primaria, SERP de intención equivocada |

**Hallazgo clave (no canibalización de keyword, sí de claridad de copy)**: Leñas 2 MAG es casi un
gemelo de Maceio dentro del catálogo (mismo segmento: RX Mormaii chico, rectangular, unisex,
monofocal-only) — medidas casi calcadas. La diferencia real es material (poliamida vs Grilamid de
Maceio) + el imán; los cross-links entre ambos deben nombrar esa diferencia explícita, no sólo
linkear como "otro chico monofocal". Diferenciador de meta_title: "monofocal" gana sobre "magnético"
(misma lógica de honestidad que Maceio: es una restricción de compra, no un extra). "MAG" sí queda
literal en el título (a diferencia de Kona MAG que lo tradujo a "Magnético" por falta de espacio).

**Desambiguación obligatoria de los 3 "Leñas"**: nunca escribir "Leñas" a secas en copy/anchors —
`Mormaii Leñas` (original, cuadrado, sin imán) / `Mormaii Leñas 2 MAG` (éste, rectangular chico, con
imán, sólo monofocal) / `Mormaii Leñas 3 Magnetic` (futuro, reservar el nombre completo también).

Cross-links obligatorios: familia receta Mormaii completa + Leñas 2 MAG↔Kona MAG (ambos con imán,
distinta forma) + Leñas 2 MAG↔Leñas original (aclarar forma siempre) + Leñas 2 MAG↔Maceio (mismo
segmento chico monofocal, aclarar material+imán) + cross-brand Leñas 2 MAG↔Rusty Woxi.

**No usar**: "magnético"/"imán" en title/H1. "Leñas" sin el "2 MAG" (ambigüedad con el original).

**Title**: `Armazón Rx Mormaii Leñas 2 MAG Monofocal | Óptica Carballo` (58). **H1**: `Mormaii Leñas 2
MAG` (plano). **Meta**: `Mormaii Leñas 2 MAG: armazón de receta rectangular chico, poliamida, con
imán en la patilla. Sólo monofocal, ideal para lectura. Envío a todo el país.`

---

*Mormaii Fortaleza (sol, AVIADOR con doble puente — PRIMER Mormaii con esta forma (no el primero del
catálogo: ya hay 11 de Rusty/Vulk), UNISEX, poliamida, bisagra flex Visyfit, lente polarizada UV400 en
las 4 variantes — 3 son categoría 3, la variante Negro Mate/Rosa es categoría 1 (dato del founder
post-carga), 4 colores) — slug `mormaii-fortaleza` en `/anteojos-de-sol/mormaii/mormaii-fortaleza`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii fortaleza (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** título+H1+slug+alt |
| lentes/anteojos de sol aviador | 170/110 | 12/10 | volumen real (Ray-Ban Aviator = ícono) pero YA TOMADO — `lentes de sol aviador` (170/12) es de Rusty The Take, `anteojos de sol aviador` (110/10) es de Rusty Yeah → mismo caso ya resuelto por Rusty Bruice (3er aviador de Rusty, también va branded) |

**Corrección importante de premisa** (verificada antes de escribir el seed): Fortaleza NO es el
primer aviador de TODO el catálogo — ya hay 11 productos aviador de Rusty y Vulk (The Take, Yeah,
Bruice, Vrast, Gresent, Tulle, Bad Card, The Trial, 53-3, Harry). Es el primer aviador **MORMAII**,
dato distinto y el único afirmable en copy (honestidad E-E-A-T). Fortaleza va 100% branded en
meta_title/H1, sin pelear "aviador" como keyword objetivo — valor SEO real: suma credibilidad a la
faceta `/anteojos-de-sol/aviador` y activa por primera vez `/anteojos-de-sol/mormaii/aviador` (ruta
ya soportada, sin desarrollo nuevo). Contaminación geográfica de "Fortaleza" (ciudad brasileña)
confirmada BAJA.

**Nota de categoría por variante** (primer caso del catálogo): la variante Negro Mate/Rosa es
categoría 1, no cat.3 como las otras 3 — el copy (description/short_description/meta_description +
callouts) debe especificar cuál variante es cuál categoría, nunca afirmar "las 4 son cat.3" (dato de
honestidad de negocio). Modelado como override en `product_variants.attributes.lens_category` de esa
variante puntual, sin tocar el `lens_category:3` del producto. Ver `LEARNINGS.md` para el patrón
general de campos técnicos que varían por variante.

Cross-links obligatorios: familia sol Mormaii completa + productos similares con aviadores de otras
marcas (Rusty The Take, Rusty Yeah, Vulk The Trial) ya que es el único aviador Mormaii, sin par
interno de marca.

**No usar**: "aviador" en title/H1 (ya tomado por Rusty The Take/Yeah). "Las 4 variantes son cat.3"
(dato falso, una es cat.1).

**Title**: `Anteojos de Sol Mormaii Fortaleza Aviador | Óptica Carballo` (59, "aviador" acá sí entra
porque no compite con nadie DENTRO de Mormaii — el riesgo es cross-brand, no cross-título; se
mantiene igual porque el string branded completo ya lo desambigua). **H1**: `Mormaii Fortaleza`
(plano). **Meta**: `Anteojos de sol Mormaii Fortaleza: aviador doble puente unisex, poliamida.
Polarizados UV400 — cat. 3 en 3 colores, cat. 1 en Rosa. Envío a todo el país.`

---

*Mormaii Barcelona (receta, RECTANGULAR, UNISEX, talle NORMAL (alto de lente 41mm, casi el doble que
Maceio/Leñas 2 MAG), **primer acetato de la línea receta** (`frame_material: "acetate"`, en inglés —
el filtro de la ruta `/acetato` matchea ese string literal), bisagra metálica SIN flex + patillas con
alma metálica, apto monofocal/bifocal/progresivo SIN restricción, 2 colores) — slug
`mormaii-barcelona-receta` en `/anteojos-de-receta/mormaii/mormaii-barcelona-receta`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii barcelona (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** título+H1+slug+alt |
| lentes de acetato | 110 | 11 | volumen real, baja dificultad, PERO no alcanza el estándar del cluster para primaria (comparado con "monofocal" 170/11 en Maceio) → soporte en meta_description/copy, no title/H1 |
| armazones de acetato | 30 | 39 | difficulty alta para la DA del sitio → soporte, no primaria |
| anteojos/lentes rectangulares | 480/15, 880/10 | ya tomadas por Rusty R-CY 02/Woxi → Barcelona NO pelea "rectangular" en título/H1 |

**Carril real libre**: la combinación "talle normal + sin restricción de lente + acetato" — ningún
otro Mormaii RX rectangular la reclama (Hover=hombre+clip-on, Maceio/Leñas 2 MAG=chico+monofocal-
only). "Acetato" tiene valor de conversión/E-E-A-T (primer acetato RX del catálogo + bisagra metálica
sin flex + alma metálica), no de SEO puro — va en meta_description y primer párrafo, no como cabecera
de title.

**Riesgo geográfico/de marca**: "Barcelona" suelto colisiona con intención 100% geográfica (óptica
física en Barcelona, España) Y con la marca española real "Etnia Barcelona" — regla dura, mismo
mecanismo que San Juan (geo) y Borneo (marca homónima): "Barcelona" NUNCA suelto en ningún nivel,
sólo el compuesto `mormaii barcelona` (0 riesgo medido).

Cross-links obligatorios: familia receta Mormaii completa + par específico Barcelona↔Hover (mismo
rectangular Mormaii, sin clip-on, en acetato) + trío Barcelona↔Maceio↔Leñas 2 MAG (mismo estilo
rectangular en talle chico, para desambiguar tamaño+compatibilidad de lente).

**No usar**: "rectangular" en title/H1 (ya tomado cross-brand). "Barcelona" suelto (geo + marca
española). "Acetato" como keyword de título (volumen insuficiente para la dificultad).

**Title**: `Armazón Rx Mormaii Barcelona Acetato | Óptica Carballo` (54). **H1**: `Mormaii Barcelona`
(plano). **Meta**: `Mormaii Barcelona: armazón de receta rectangular en acetato con bisagra metálica.
Apto mono, bifocal y progresivo. Envío a todo el país, garantía 1 año.`

---

*Mormaii Doha (sol, CUADRADO, HOMBRE explícito, poliamida, bisagra plástica reforzada, lente
polarizada UV400 cat.3, 1 solo color en venta real — Col 03 Negro/Habano Mate con lente marrón) —
slug `mormaii-doha` en `/anteojos-de-sol/mormaii/mormaii-doha`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii doha (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** título+H1+slug+alt |
| lentes/anteojos de sol cuadrados hombre | 90/70 | 18/35 | 5to Mormaii "cuadrado+hombre" en sol (Curazao, San Juan, Monterrey 2, Madri, Doha) → **NO primaria**, el nombre branded alcanza solo sin forzar diferenciador |
| lentes de sol mormaii | 90 | 8 | head de sol de marca — ya es de Storm → soporte, cross-link |
| doha (suelto) | — | — | **NO USAR** — Doha es la capital de Qatar, intención de búsqueda 100% geográfica/turística. Mismo vicio ya documentado con "Borneo" (Borneo Readers) y "San Juan" (óptica geográfica) — nunca "Doha" sin "Mormaii" pegado |

**Anti-canibalización**: con Doha son 5 Mormaii "cuadrado+hombre" de sol — el carril de forma+género
con volumen real (saturado en Curazao y San Juan) está tomado. Doha va 100% branded en
title/H1/meta, cero mención de forma como keyword objetivo (sí en copy/alt/`frame_shape`).

**Diferenciador evaluado y descartado como keyword**: color único en venta real (Negro/Habano Mate,
lente marrón) — sin volumen medido para "habano"/"carey" en el CSV consultado en todo este cluster;
se usa en copy/alt como dato honesto de transparencia (1 solo color disponible, no prometer variedad
que no existe), nunca como keyword de title.

**Nombre**: grabado físico "Doha SN · Col 03 · Cat.03 UV400" — "SN" es código interno de línea (lo
graban en TODOS los Mormaii de sol, confirmado con grep de los 9 seeds previos), no entra al nombre
comercial. `product.name` = "Mormaii Doha".

Cross-link obligatorio Doha↔Curazao↔San Juan↔Monterrey 2↔Madri↔Borneo↔Joaca4↔Storm ("otros lentes de
sol Mormaii para hombre") + todos → `/anteojos-de-sol/mormaii`.

**No usar**: "cuadrado"/"cuadrados hombre" en title/H1 (5to reclamo, saturado). "Doha" suelto sin
"Mormaii" (riesgo geográfico, capital de Qatar). "Varios colores"/plural de colores en
meta_description (sólo 1 color con venta real).

**Title**: `Lentes de Sol Mormaii Doha Hombre | Óptica Carballo` (51). **H1**: `Mormaii Doha` (plano,
mismo criterio del resto del cluster). **Meta**: `Lentes de sol Mormaii Doha: poliamida liviana para
hombre, negro/habano con lente marrón. Polarizados, UV400 cat. 3. Envío a todo el país, garantía de 1
año.` (157)

---

*Mormaii Macau (sol, RECTANGULAR grande estilo urbano — primer Mormaii de sol con esta forma
explícita, y primer "rectangular + hombre" de sol en todo el catálogo (cross-brand incluido: único
rectangular de sol previo es Vulk Dieven, unisex, sin reclamar forma), poliamida, bisagra plástica
reforzada, lente de policarbonato POLARIZADA UV400 cat.3, 2 colores cargados — Col.01 Negro Brillo
(stock 0, no vigente para venta) y Col.05 Frente Negro Mate/Patillas Carey con lente marrón (stock 1,
único color con venta real)) — slug `mormaii-macau` en `/anteojos-de-sol/mormaii/mormaii-macau`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii macau (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo, confirmado en SERP de competencia (Paesani, Frávega, MC Óptica) → **primaria** título+H1+slug+alt |
| lentes de sol rectangulares hombre | 70 (+50/40 variantes) | 35-36 | forma real del modelo, **libre sitewide** en sol (nadie la reclamó antes, ni intra-Mormaii ni cross-brand) → secundaria honesta, copy/H2/alt/`frame_shape`, no en title por presupuesto de caracteres |
| lentes/anteojos de sol rectangulares | 320/140 | 12/12 | genérico de forma, también libre en sol → soporte en copy, alimenta la faceta `/anteojos-de-sol/rectangulares` vía `frame_shape` |
| lentes de sol mormaii | 90 | 8 | head de sol de marca — ya es de Storm → soporte, cross-link |
| anteojos/lentes de sol deportivos | 110-210 | 10-17 | **NO USAR** — saturada por Rusty And Now como primaria, y además imprecisa: "deportivo" en el catálogo describe construcción envolvente (Storm/Borneo/Joaca4), Macau es rectangular plano. ML lo usa como relleno de título, no como dato técnico |
| macau (suelto) | — | — | **NO USAR** sin "Mormaii" pegado — riesgo geográfico (Macau/Macao, región de China), atenuado vs. Doha porque el exónimo español dominante es "Macao" (con O), pero no nulo |

**Anti-canibalización**: Macau NO es el 6to reclamo de "cuadrado+hombre" (ese carril sigue en 5:
Curazao, San Juan, Monterrey 2, Madri, Doha, saturado). Es el primer Mormaii de sol con forma
RECTANGULAR — carril propio, sin pelear con nadie del cluster. La primaria sigue siendo 100% branded
en title/H1 (mismo criterio de todo el cluster), pero a diferencia de Doha/Madri/Monterrey 2, acá SÍ
conviene declarar la forma en copy/H2/alt porque es territorio libre y honesto, no un reclamo débil.

**Diferenciador evaluado y descartado como keyword**: color único en venta real (Negro Mate/Carey,
lente marrón) — sin volumen medido para "carey" en el CSV de este cluster; se usa en copy/alt como
dato honesto (Col.01 Negro Brillo está cargado con stock 0 pero NO se promociona como disponible).

Cross-link obligatorio Macau↔Curazao↔San Juan↔Monterrey 2↔Madri↔Doha↔Borneo↔Joaca4↔Storm ("otros
lentes de sol Mormaii para hombre") + todos → `/anteojos-de-sol/mormaii`. Opcional (mismo criterio
que usó Fortaleza con los aviadores cross-brand): Macau↔Vulk Dieven ("otro armazón rectangular de
sol"), único otro rectangular de sol del catálogo aunque de otra marca y unisex.

**No usar**: "cuadrado" en ningún nivel (forma real es rectangular, confirmado por SERP de
competencia y dimensiones 146mm/59mm). "Deportivo" (saturado por Rusty, impreciso para esta
construcción). "Macau" suelto sin "Mormaii" (riesgo geográfico). "Varios colores"/plural en
meta_description (1 solo color con venta real).

**Nota**: si en algún momento se carga un segundo Mormaii de sol rectangular para hombre, reevaluar
si "rectangular hombre" pasa a primaria en título — con uno solo no vale la pena forzar el
presupuesto de 60 caracteres.

**Title**: `Lentes de Sol Mormaii Macau Hombre | Óptica Carballo` (52). **H1**: `Mormaii Macau`
(plano, mismo criterio reciente del cluster — Monterrey 2/Madri/Joaca 4/Doha). **Meta**: `Lentes de
sol Mormaii Macau: poliamida para hombre, negro mate/carey con lente marrón. Polarizados, UV400 cat.
3. Envío a todo el país, garantía de 1 año.` (154)

---

*Mormaii Swap NG2 MAG (receta, CUADRADO, HOMBRE, poliamida, bisagra "inyectada reforzada" sin flex
(misma que Kona MAG), **TERCER modelo de la línea MAG y PRIMER clip-on 2-en-1 magnético real del
catálogo** — imanes en las patillas + 2 clips solares intercambiables (uno oscuro polarizado cat.3
UV400 color variable por variante, uno amarillo UV400 sin polarización confirmada), apto monofocal/
bifocal/progresivo sin restricción, 3 colores: Col.01 Negro Mate/Detalles Gris, Col.02 Gris Mate/
Detalles Rojos, Col.04 Negro Mate/Detalles Celestes, cada uno publicación ML separada) — slug
`mormaii-swap-ng2-mag-receta` en `/anteojos-de-receta/mormaii/mormaii-swap-ng2-mag-receta`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii swap ng2 mag (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** slug/title/H1/alt |
| lentes de aumento y sol con imán | 90 | 21 | intención EXACTA (receta+sol+imán = 2-en-1 magnético real), LIBRE, validada con SERP real (Faleiao/Vola/Giorlent "3 en 1" con clips magnéticos dominan esta variante específica, verificado 2026-09-30) → **primaria secundaria**, meta_description, H2, copy |
| lentes con iman para sol | 90 | 12 | mismo campo semántico, difficulty aún más baja, transactional → secundaria de apoyo, H2/copy |
| clip on para anteojos recetados | 260 | 6 | YA es primaria secundaria de HOVER (mismo brand+receta+clip-on) → NO se reutiliza como target de título/H1 acá (cannibalización directa); libre para mención genérica de body/breadcrumb |
| lentes/clip on lentes (genérico) | 1.000/880 | 5 | cabecera mixta sol+receta, ya clasificada soporte-no-primaria en Hover → mismo trato, soporte/H2, no título |
| anteojos/lentes con imán (genérico, SIN "sol") | 170-260 | 18-44 | criterio Kona MAG/Leñas 2 MAG SIGUE VIGENTE para esta forma genérica — SERP real (verificado 2026-09-30) sigue dominado por lectura de kiosco plegable/imán-para-colgar (Dandy, Carezza) → NO primaria, intención equivocada |
| anteojos/lentes 2 en 1 / 3 en 1 | 20-50 | 32-36 | volumen bajo, difficulty alta para el estándar del catálogo, sin intent comercial claro en Ubersuggest → no se persigue como keyword; "2 clips intercambiables" queda como lenguaje humano en copy, no SEO target |

**Hallazgo clave (excepción real al criterio de Kona MAG, no lo invalida)**: el criterio "magnético/
imán nunca primaria" sentado en Kona MAG sigue aplicando al 100% para el término GENÉRICO
("anteojos con imán", "lentes con imán") — confirmado con búsqueda real, ese SERP sigue siendo de
lectura de kiosco/colgar, no de este producto. La excepción es el COMPUESTO específico
"[receta]+sol+imán" ("lentes de aumento y sol con imán"), que sí tiene volumen medido (90/21) y SERP
real de la misma categoría de producto (Rx + clip solar magnético removible) — verificado con
búsqueda 2026-09-30 (Faleiao, Vola, Giorlent). Es la única keyword de la familia imán que se activa
como primaria secundaria en todo el catálogo, y queda exclusiva de Swap NG2 MAG mientras no haya otro
Rx+clip-solar+imán cargado. Amendment al punto 1 del "Criterio sentado" de Kona MAG: agregar "— salvo
el compuesto receta+sol+imán, cuando el producto es un clip-on removible real (no accesorio para
colgar): ver Swap NG2 MAG" — aplica también a futuros Traful Magnetic/Leñas 3 Magnetic/Asana Magnetic
SI y solo si tienen función de clip solar real (chequear caso por caso, no asumir).

**Anti-canibalización vs Hover** (mismo brand+receta+HOMBRE+mecanismo "clip-on", pero forma distinta:
CUADRADO vs RECTANGULAR de Hover): Swap NG2 MAG NO pelea "clip on para anteojos recetados" (queda
100% de Hover). Diferenciador real y de copy: magnetismo + 2 clips intercambiables (oscuro polarizado
+ amarillo) vs el clip único abatible (no magnético, se engancha en la zona nasal) de Hover. Aclarar
siempre en H2/body cuál mecanismo es cuál — no dejar que el lector asuma que son lo mismo.

**Anti-canibalización vs Kona MAG / Leñas 2 MAG** (línea magnética, mismo mecanismo base de imán): la
función es distinta — en Kona MAG/Leñas 2 MAG el imán es SOLO para colgar de la ropa o adherir a
superficie metálica (no hay clip, no hay función solar); en Swap NG2 MAG el imán ES el sistema de
sujeción de los 2 clips solares intercambiables. Por eso el término genérico "con imán" sigue sin ser
primaria en ningún producto MAG, pero el compuesto "receta+sol+imán" solo se activa acá. Shape
overlap con Kona MAG (ambos CUADRADO, Kona MAG unisex / Swap NG2 MAG hombre): no hay colisión de
keyword real porque ninguno pelea "cuadrado" en título/H1.

Cross-links obligatorios: familia receta Mormaii completa (hub `/anteojos-de-receta/mormaii`) + trío
línea magnética Mormaii (Kona MAG ↔ Leñas 2 MAG ↔ Swap NG2 MAG, "otros armazones Mormaii con sistema
magnético") + Swap NG2 MAG ↔ Hover ("otros sistemas de clip-on de Mormaii", aclarando magnético-
removible-2-clips vs abatible-1-clip).

**No usar**: "clip on para anteojos recetados" en title/H1 (es de Hover). "Cuadrado" en title/H1
(saturado). "Magnético"/"imán" genérico como keyword primaria de title/H1. "3 en 1"/"2 en 1" como
keyword SEO. No prometer "cambio de sistema de lentes de receta" — los 2 clips son SOLARES
intercambiables, no lentes de aumento intercambiables. No afirmar polarización en el clip amarillo.

**Title**: `Armazón Rx Mormaii Swap NG2 Mag Clip Solar | Óptica Carballo` (60). **H1**: `Mormaii Swap
NG2 MAG` (plano, sigla real). **Meta**: `Mormaii Swap NG2 MAG: armazón de receta cuadrado en
poliamida, con clip solar magnético polarizado y clip amarillo UV400 intercambiables. Envío a todo
el país.` (159)

---

*Mormaii Tokio (sol, CUADRADO, HOMBRE explícito, poliamida, bisagra plástica reforzada, lente de
policarbonato POLARIZADA UV400 cat.3, 3 colores cargados — Col.01 Negro Brillo/Lente Gris Oscuro
(stock 0), Col.03 Negro Mate/Lente Espejada Celeste (stock 2, único color con venta real), Col.05
Azul Mate/Lente Gris Oscuro Degradé (stock 0)) — slug `mormaii-tokio` en
`/anteojos-de-sol/mormaii/mormaii-tokio`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii tokio (branded) | 0 medido en CSV, demanda real confirmada por SERP (5+ ópticas argentinas venden un modelo "Tokio" con esa grafía exacta, verificado 2026-09-30) | ~4 | branded exacto, libre, sin riesgo → **primaria** título+H1+slug+alt |
| lentes/anteojos de sol cuadrados hombre | 90/70 | 18/35 | 6to Mormaii "cuadrado+hombre" en sol (Curazao, San Juan, Monterrey 2, Madri, Doha, Tokio) → **NO primaria**, el nombre branded alcanza solo |
| lentes de sol mormaii | 90 | 8 | head de sol de marca — ya es de Storm → soporte, cross-link |
| tokio / tokyo (sueltos) | — | — | **NO USAR EN NINGÚN NIVEL** — riesgo geográfico MAYOR que Doha/Macau (ciudad global de altísimo reconocimiento). Hallazgo nuevo: colisión de RUBRO (no sólo geografía) con la óptica real "Tokio Visión" (La Plata) — `optica tokio la plata` mide 110 vol/30 diff — mismo tier que Borneo Readers/óptica San Juan. Nunca suelto sin "Mormaii" |

**Evaluación del riesgo geográfico**: confirmado mayor en términos absolutos que Doha o Macau — Tokio
es una ciudad mucho más buscada globalmente. Mitigado con el mismo mecanismo de todo el cluster
(nunca reclamar el string solo, siempre compuesto con "Mormaii") — el compuesto "mormaii tokio"
desambigua 100%, nadie que lo busca quiere vuelos a Japón. El hallazgo nuevo respecto a Doha/Macau es
la colisión con **Tokio Visión** (óptica real en La Plata, mismo rubro) — documentado como riesgo de
tier superior, pero tampoco compromete la página.

**Nombre — ventaja SEO real de "Tokio" vs "Tokyo"**: el founder confirmó que el grabado físico dice
"TOKIO" (interoptica.com.ar y el marketing del fabricante usan "Tokyo"). 3 ventajas reales de usar
"Tokio": (1) coherencia producto-listing — evita reclamos de "pedí Tokyo y llegó Tokio"; (2)
convención ya asentada: TODOS los competidores argentinos indexados para este modelo (Paesani,
Amuchastegui, Magic Accesorios, Punto Devoto, Sandin) usan "Tokio", nunca "Tokyo"; (3) honestidad
E-E-A-T — no reclamar una grafía que el producto físico no tiene (mismo principio ya aplicado con
Curazao/Borneo/Joaca4).

**Anti-canibalización**: con Tokio son 6 Mormaii "cuadrado+hombre" de sol — el carril de forma+género
sigue saturado desde Curazao/San Juan. Tokio va 100% branded, cero mención de forma como keyword
objetivo. Refuerza la prioridad ya escalada en BACKLOG.md de crear `/anteojos-de-sol/cuadrados`.

**Diferenciador evaluado y descartado como keyword**: color con venta real (Negro Mate/Espejada
Celeste) — sin volumen medido; sólo dato honesto en copy/alt (2 de 3 colores en stock 0, no se
promocionan como disponibles).

Cross-link obligatorio Tokio↔Curazao↔San Juan↔Monterrey 2↔Madri↔Doha↔Macau↔Borneo↔Joaca4↔Storm
("otros lentes de sol Mormaii para hombre") + todos → `/anteojos-de-sol/mormaii`.

**No usar**: "tokio"/"tokyo" sueltos sin "Mormaii" (riesgo geográfico + colisión de rubro con Tokio
Visión/La Plata). "Cuadrado"/"cuadrados hombre" en title/H1 (6to reclamo, saturado). "Varios
colores"/plural en meta_description (sólo 1 de 3 con venta real).

**Title**: `Lentes de Sol Mormaii Tokio Hombre | Óptica Carballo` (52). **H1**: `Mormaii Tokio`
(plano). **Meta**: `Lentes de sol Mormaii Tokio: poliamida para hombre, negro mate/lente espejada
celeste. Polarizados, UV400 cat. 3, envío a todo el país y garantía de 1 año.` (155)

---

*Mormaii Leñas 3 MAG (receta, CUADRADO, HOMBRE explícito, poliamida, bisagra metálica flex "Visyfit"
(misma que Leñas original/Leñas 2 MAG, distinta de Kona MAG/Swap NG2 MAG que son sin flex), **cuarto
modelo de la línea MAG del catálogo, línea sólo-colgar** (mismo mecanismo que Kona MAG/Leñas 2 MAG,
sin clip-on ni componente solar), apto monofocal/bifocal/progresivo sin restricción, 3 colores en
venta real, todos con stock — Col.01 Negro Mate, Col.02 Azul Mate con Turquesa, Col.04 Transparente
con Azul) — slug `mormaii-lenas-3-mag-receta` en `/anteojos-de-receta/mormaii/mormaii-lenas-3-mag-receta`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii leñas 3 mag (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** título+H1+slug+alt. "MAG" queda literal (no se traduce a "Magnético"), mismo criterio que Leñas 2 MAG |
| anteojos/lentes con imán / imantados (genérico) | 170-260 | 18-49 | criterio Kona MAG SIGUE VIGENTE sin excepción — no hay clip-on ni función solar acá, la excepción de Swap NG2 MAG NO aplica → **NO primaria**, SERP de intención equivocada (kiosco/colgar) |
| anteojos/lentes cuadrados | 480/15, 880/10 | ya tomado por Rusty Zinz Optics/Peating Carey y saturado dentro del propio catálogo Mormaii (Leñas original, Kona MAG, Swap NG2 MAG) → Leñas 3 MAG tampoco pelea "cuadrado" en título/H1 |

**Confirmación explícita de criterio**: el amendment "salvo el compuesto receta+sol+imán" sentado en
Swap NG2 MAG NO se activa en Leñas 3 MAG porque no hay clip solar removible — es el mismo patrón
sólo-colgar de Kona MAG/Leñas 2 MAG.

**Desambiguación obligatoria de los 3 "Leñas"** (actualiza la nota de Leñas 2 MAG, que reservaba el
nombre placeholder "Leñas 3 Magnetic"): nunca escribir "Leñas" a secas en copy/anchors — `Mormaii
Leñas` (original, seed 135, cuadrado UNISEX, Grilamid, sin imán) / `Mormaii Leñas 2 MAG` (seed 140,
rectangular chico, UNISEX, poliamida, con imán sólo-colgar, monofocal-only) / `Mormaii Leñas 3 MAG`
(seed 147, cuadrado HOMBRE explícito, poliamida, con imán sólo-colgar, SIN restricción de lente —
nombre real confirmado en ML/grabado físico: "Leñas 3 MAG", no "Leñas 3 Magnetic" como se había
reservado).

**Anti-canibalización vs Kona MAG** (mismo mecanismo sólo-colgar, mismo CUADRADO): diferenciador real
es género (Kona MAG unisex / Leñas 3 MAG hombre) + bisagra (Kona MAG rígida "inyectada reforzada" /
Leñas 3 MAG flex Visyfit). Ninguno pelea "cuadrado" en título/H1 — sin colisión de keyword, pero el
cross-link debe nombrar la diferencia de género+bisagra.

**Anti-canibalización vs Leñas 2 MAG**: forma (cuadrado vs rectangular chico), talle (estándar vs
chico ~35mm alto), género (hombre vs unisex) y restricción de lente (sin restricción vs monofocal-
only) distinguen — reforzar siempre el "3 MAG" completo en anchors para no generar ambigüedad con
"2 MAG".

**Anti-canibalización vs Leñas original**: material (poliamida vs Grilamid), género (hombre explícito
vs unisex) e imán (sí vs no) distinguen. Ninguno pelea "cuadrado" en título/H1.

**Anti-canibalización vs Swap NG2 MAG** (la más relevante — mismo CUADRADO + mismo HOMBRE, único otro
MAG que comparte forma y género): diferencia funcional no negociable en copy — Swap NG2 MAG tiene
clip-on solar magnético removible real (2 clips intercambiables, capta "lentes de aumento y sol con
imán" 90/21 en exclusiva); Leñas 3 MAG NO tiene clip ni función solar, el imán es sólo para colgar.
Prohibido usar "clip"/"clip solar"/"2 en 1" en copy de Leñas 3 MAG — sería promesa falsa.

Cross-links obligatorios: familia receta Mormaii completa (hub `/anteojos-de-receta/mormaii`) +
cuarteto línea magnética Mormaii (Kona MAG ↔ Leñas 2 MAG ↔ Swap NG2 MAG ↔ Leñas 3 MAG, aclarando
sólo-colgar vs clip-solar) + Leñas 3 MAG ↔ Leñas original (género+material+imán) + Leñas 3 MAG ↔
Leñas 2 MAG (forma+talle+restricción).

**No usar**: "magnético"/"imán" como keyword de title/H1. "Cuadrado" en title/H1 (saturado). "Leñas"
sin el "3 MAG" completo. "Clip"/"clip solar"/"2 en 1"/función solar en ningún lado del copy.

**Title**: `Armazón Rx Mormaii Leñas 3 MAG Hombre | Óptica Carballo` (55). **H1**: `Mormaii Leñas 3
MAG` (plano, sigla real). **Meta**: `Mormaii Leñas 3 MAG: armazón de receta cuadrado hombre en
poliamida, con imán en la patilla para colgar. Apto mono, bifocal y progresivo. Envío a todo el
país.` (159)

---

*Mormaii Miami (sol, CUADRADO, HOMBRE explícito, poliamida, bisagra plástica reforzada, lente de
policarbonato POLARIZADA UV400 cat.3, 3 colores cargados, **los 3 con stock real (2/2/2) — primer
Mormaii "cuadrado+hombre" de sol del cluster con disponibilidad completa en las 3 variantes**, a
diferencia de Doha/Macau/Tokio que sólo tuvieron 1 color vigente — Col.01 Negro Brillo/Lente Gris
Oscuro, Col.03 Carey/Lente Marrón, Col.05 Azul Mate/Lente Gris Degradé) — slug `mormaii-miami` en
`/anteojos-de-sol/mormaii/mormaii-miami`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii miami (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo de rubro → **primaria** título+H1+slug+alt |
| lentes/anteojos de sol cuadrados hombre | 90/70 | 18/35 | 7mo Mormaii "cuadrado+hombre" en sol (Curazao, San Juan, Monterrey 2, Madri, Doha, Tokio, Miami) → **NO primaria**, el nombre branded alcanza solo |
| lentes de sol mormaii | 90 | 8 | head de sol de marca — ya es de Storm → soporte, cross-link |
| miami (suelto) | — | — | **NO USAR EN NINGÚN NIVEL** — el término geográfico de MAYOR riesgo reservado hasta ahora en el cluster |

**Evaluación del riesgo geográfico**: confirmado alto, en la misma liga que Tokio pero por un
mecanismo distinto. No hay "Óptica Miami" real operando en Argentina (a diferencia de Tokio Visión)
pero el campo semántico "gafas de sol/comprar en Miami" está dominado en SERP por contenido de
shopping-en-Miami (outlets, guías de compra) — intención 100% ajena al producto, con volumen de
intención mayor por la relación particular Argentina↔Miami como destino de compras. Mitigación
idéntica al resto del cluster: nunca "Miami" suelto, siempre "Mormaii Miami" compuesto. Con Miami son
ya 4 nombres geográficos reservados del mismo modo (Doha, Macau, Tokio, Miami).

**Anti-canibalización**: 7mo "cuadrado+hombre" de sol Mormaii — el carril satura desde Curazao/San
Juan, Miami no lo reclama en ningún nivel (title/H1/meta), sólo como atributo en copy/alt/
`frame_shape`. Refuerza la prioridad ya escalada en BACKLOG.md de crear `/anteojos-de-sol/cuadrados`.

**Diferenciador real a explotar en copy (no keyword)**: primer Mormaii "cuadrado+hombre" reciente con
los 3 colores efectivamente en stock — afirmable en meta_description/H2 ("3 colores disponibles"), a
diferencia de Doha/Macau/Tokio que debían matizar con "único color vigente".

Cross-link obligatorio Miami↔Curazao↔San Juan↔Monterrey 2↔Madri↔Doha↔Macau↔Tokio↔Borneo↔Joaca4↔Storm
("otros lentes de sol Mormaii para hombre") + todos → `/anteojos-de-sol/mormaii`.

**No usar**: "miami" suelto sin "Mormaii" (riesgo geográfico más alto del cluster). "Cuadrado"/
"cuadrados hombre" en title/H1 (7mo reclamo, saturado). "Único color"/"1 solo color" en
meta_description (sería falso, los 3 están disponibles).

**Title**: `Lentes de Sol Mormaii Miami Hombre | Óptica Carballo` (52). **H1**: `Mormaii Miami`
(plano). **Meta**: `Lentes de sol Mormaii Miami: poliamida liviana para hombre, 3 colores
disponibles. Polarizados, UV400 cat. 3. Envío a todo el país y garantía de 1 año.` (151)

---

*Mormaii Frey (receta, OVALADO — primer Mormaii ovalado del catálogo, 12 RX previos son envolvente/
cuadrado/redondo/rectangular —, UNISEX, poliamida, bisagra metálica flex Visyfit, apto monofocal/
bifocal/progresivo sin restricción, 5 colores: Col.01 Negro Mate, Col.02 Azul Transparente, Col.04
Transparente, Col.05 Marrón Carey, Col.06 Rojo Translúcido) — slug `mormaii-frey-receta` en
`/anteojos-de-receta/mormaii/mormaii-frey-receta`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii frey (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo → **primaria** título+H1+slug+alt |
| lentes/anteojos ovalados | 390/260 | 11/10 | forma real y volumen real, PERO ya reclamada de facto por Vulk Clems Receta (seed 57, meta_title vivo) → **NO primaria de Frey**, ver anti-canibalización |
| anteojos recetados | 720 | 9 | head de intención receta compartido (mismo criterio Moorea/Traful) → copy/1er párrafo, no exclusivo |

**Hallazgo clave**: "ovalado" NO es territorio 100% libre dentro del catálogo — Vulk Clems Receta
(cargado antes de la norma de `seo-strategist` obligatorio) ya tiene `frame_shape:"ovalado"` y su
meta_title vivo dice "...Armazón de Receta Ovalado Ultra Liviano". Mismo carril RX+ovalado+unisex,
sin atributo natural que los separe (ambos unisex, ningún material con keyword propia). Resolución:
**Clems queda como dueño de facto** de la frase comercial "lentes/anteojos ovalados"; **Frey usa
"Ovalado" como adjetivo PLANO en title/H1** (no como frase-objetivo), mismo mecanismo que Traful con
"Redondo". Pendiente (fuera de esta carga): formalizar ficha retroactiva de Clems en este documento.

**Anti-canibalización vs resto de Mormaii RX ("unisex")**: no hay carril que reclamar — 6 de los 11
RX previos ya son unisex (Traful, Leñas, Kona MAG, Leñas 2 MAG, Barcelona, Maceio). "Unisex" NO se
usa como palabra de título (sería el 7mo reclamo del mismo atributo, cero ROI incremental).

Cross-link obligatorio Frey↔Vulk Clems Receta ("otro armazón ovalado, distinta marca y material") +
familia receta Mormaii completa (Traful, Leñas, Maceio, Barcelona, Kona MAG, Leñas 2/3 MAG — "otros
armazones de receta Mormaii") + `/anteojos-de-receta/mormaii` + `/marcas/mormaii`.

**Gap en observación** (no bloqueante, anotado en BACKLOG.md): con Clems + Frey, el carril
ovalado+receta tiene 2 productos — bajo el umbral de 4 que usa el proyecto para promover una faceta
activa (`/anteojos-de-receta/ovalados`), mismo criterio que el gap ya escalado de
`/anteojos-de-sol/cuadrados`.

**No usar**: "lentes ovalados"/"anteojos ovalados" como frase exacta en meta_title o H1 (ya la tiene
Clems viva en producción — crearía dos páginas del propio sitio compitiendo por el mismo SERP).
"Unisex" como palabra de título (saturado, 6/11 RX Mormaii ya lo son).

**Title**: `Armazón de Receta Mormaii Frey Ovalado | Óptica Carballo` (57). **H1**: `Mormaii Frey`
(plano). **Meta**: `Mormaii Frey: armazón de receta ovalado y unisex, en poliamida con bisagra
metálica flex Visyfit. 5 colores, envío a todo el país y garantía oficial de 1 año.` (158)

---

*Mormaii 178 (sol, CUADRADO/trapezoidal oversized statement, UNISEX — primer acetato de SOL de la
marca (Barcelona fue el primer acetato RX, nunca antes en sol), bisagra metálica sin flex, lente de
policarbonato UV400 cat.3, NO POLARIZADO en ninguna variante (primer Mormaii de sol del catálogo que
confirma explícitamente esto — los otros 11 sí polarizan), 3 colores en venta real — Negro Brillo
(stock 2), Carey (stock 2), Azul (stock 3)) — slug `mormaii-178` en
`/anteojos-de-sol/mormaii/mormaii-178`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii 178 (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo de rubro → **primaria** título+H1+slug+alt |
| lentes de sol grandes | 90 | 19 | libre en todo el catálogo, pero el ancho real (143mm) queda por debajo del umbral honesto (~145mm, mismo estándar que descartó a Rusty Dunsert) → **no usada**, título conservador |
| lentes/acetato (atributo) | 110/11, 30/39 | genérico mixto receta/sol, mismo tratamiento que Barcelona (RX) → soporte en meta_description/copy, nunca cabecera |
| lentes/anteojos de sol cuadrados | 390/170 | 11/14 | 9no reclamo del string en el cluster (7 Mormaii hombre + Daito unisex) → **NO primaria**, sólo atributo en copy/alt/`frame_shape` |
| lentes/anteojos de sol unisex | 20/20 | 36/36 | **BLOQUEADA — ya es primaria secundaria de Daito**, mismo brand/carril → mención descriptiva en copy sin intención de ranking |
| anteojos/lentes de sol sin polarizar | 0 medido | — | CERO volumen — disclosure de honestidad de negocio, nunca en title/H1/name |

**Anti-canibalización (MO178 vs Daito — el caso realmente ajustado, no el grupo "cuadrado+hombre")**:
MO178 no compite con los 7 Mormaii "cuadrado+hombre" de sol (todos HOMBRE explícito, cero overlap). El
caso ajustado es contra **Daito**: mismo brand/sol/cuadrado/unisex — las variables que separan al
resto del cluster (forma+género) acá no alcanzan. Separación real en 3 capas: (1) material — MO178
acetato+bisagra metálica sin flex vs Daito poliamida+bisagra plástica reforzada; (2) polarización
invertida — Daito 100% polarizado y dueño del claim, MO178 0%; (3) "unisex" como keyword secundaria
queda 100% de Daito, MO178 no la persigue en título/H1.

Cross-link obligatorio MO178↔Daito ("el otro cuadrado unisex de Mormaii, en acetato vs poliamida") +
MO178↔Barcelona ("primer acetato de su categoría en Mormaii": Barcelona=RX, MO178=sol, opcional) +
todos → `/anteojos-de-sol/mormaii`.

**Hallazgo — colisión cross-brand de "178"**: existe un modelo "Reef 178" vendido en ML Argentina
(Reef es marca top-priority del research, 3.400 vol, aún sin cargar). No es riesgo geográfico sino de
código de modelo cross-brand dentro del mismo nicho. Sin riesgo de URL (slug prefijado por marca) pero
sí de SERP débil/atención al cliente — "178" nunca suelto sin "Mormaii". Acción pendiente en
BACKLOG.md: al cargar Reef, verificar si tiene un "178" propio.

**Nota de honestidad — no polarizado**: 0/3 variantes polarizan, rompiendo un patrón de 11 Mormaii de
sol previos que sí lo hacen. Mención explícita en short_description/callout ("No es polarizado"), no
sólo omisión silenciosa — obligación de negocio, no jugada SEO (0 vol medido). Nunca "polarizado" en
title/H1/name/`lens_treatment`. Queda fuera de `/anteojos-de-sol/polarizados` y
`/anteojos-de-sol/mormaii/polarizados`.

**No usar**: "178" suelto sin "Mormaii" (colisión cross-brand con Reef). "Cuadrado"/"cuadrados" en
title/H1 (9no reclamo, saturadísimo). "Unisex" como keyword objetivo en título (ya es de Daito).
"Polarizado" en cualquier campo. "Clásico femenino" como descriptor (contradice la decisión unisex,
sin respaldo visual ni de volumen) — usar "moderno"/"statement". "Oversized" en inglés (sin volumen
medido) — usar "grandes" sólo si se confirma honestamente la medida (acá no califica).

**Title**: `Lentes de Sol Mormaii 178 Acetato | Óptica Carballo` (51). **H1**: `Mormaii 178` (plano).
**Meta**: `Lentes de sol Mormaii 178: acetato, cuadrado oversized y unisex. UV400 cat. 3, no
polarizados. 3 colores disponibles, envío a todo el país y garantía 1 año.` (156)

*Mormaii High 4 (receta, RECTANGULAR tipo wayfarer — ancho total 140mm, calibre 54, puente 18,
varilla 135, alto de lente 42mm, grabado físico confirma "High 4" sin sufijos de línea, UNISEX por
decisión de posicionamiento del founder (el atributo estructurado de ML dice "hombre", no se
cuestiona), acetato, bisagras metálicas SIN flex, apto monofocal/bifocal/progresivo sin restricción,
2 colores — A14 Negro, DC0 Transparente/cristal con patillas negras) — slug `mormaii-high-4-receta`
en `/anteojos-de-receta/mormaii/mormaii-high-4-receta`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii high 4 (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo de rubro (confirmado: cero colisión con "high" en los CSV en español de `KEYWORDS OPTICA/`) → **primaria** título+H1+slug+alt |
| lentes wayfarer | 590 | 14 | forma real (wayfarer), mayor volumen de todo el cluster Mormaii receta — ya usada por Rusty Opposit Optics (cross-brand, receta, mujer) → **NO primaria**, sólo palabra plana de cierre de título soldada al branded |
| anteojos wayfarer | 260 | 9 | idem arriba, variante "anteojos" |
| anteojos/lentes rectangulares | 480/15, 880/10 | ya tomadas por Rusty R-CY 02 (primaria cross-brand) y saturadas dentro de Mormaii (Hover, Barcelona, Leñas 2 MAG) → **NO primaria**, nunca título/H1, sólo `frame_shape`/copy/alt |
| anteojos recetados | 720 | 9 | head de intención receta compartido (mismo criterio de todo el cluster) → copy/1er párrafo |
| lentes/anteojos transparentes | 1.000/16, 720/16 | **TRAMPA, no usar** — sólo 1 de 2 colores (DC0) es transparente (50%, no alcanza el umbral de honestidad del proyecto, mismo criterio que descartó a Vulk Vartis frente a Strewn); además el genérico sin género ya es primaria de Vulk Ready? |
| lentes/armazones de acetato | 110/11, 30/39 | atributo real, ya usado por Barcelona como soporte → soporte en copy, no diferenciador de título (evitar título gemelo a Barcelona) |
| anteojos/lentes grandes | 210/13, 210/16 | **TRAMPA, no usar** — 140mm de ancho total no alcanza el umbral honesto de ~145mm que el proyecto aplicó dos veces (descartó a Rusty Dunsert sol 140mm y Mormaii 178 sol 143mm) |
| mormaii lentes / lentes mormaii / anteojos mormaii | 390/170/170 | 7/7/7 | hub-only (`/anteojos-de-receta/mormaii`, `/marcas/mormaii`), NUNCA en esta PDP |

**Hallazgo — riesgo de nombre "High"**: barrido completo de los CSV de `KEYWORDS OPTICA/` (incluido
el de blue light, único lugar donde aparece "high" en inglés, sin relación con este producto) no
devuelve ninguna colisión en español con "high" como moda ("high waist"), maquillaje
("highlighter") ni ningún otro campo semántico ajeno a la óptica. Riesgo de keyword CONFIRMADO BAJO
con datos reales — a diferencia de los riesgos geográficos de Doha/Macau/Tokio/Miami, que sí
competían con volumen real. Se aplica igual la misma mitigación barata y ya estandarizada en el
cluster: "High" NUNCA suelto en ningún nivel (title, H1, alt, anchors, redes) — siempre el compuesto
"Mormaii High 4" completo, con el "4" pegado (el grabado físico no tiene sufijos de línea, el "4" es
parte del nombre, no una talla ni una versión). Motivo adicional, no de SEO sino de marca: "high" es
jerga real de moda argentina — no compite por tráfico, pero puede generar ruido de marca en redes si
se usa suelto.

**Anti-canibalización (High 4 vs Mormaii Barcelona — el caso más ajustado del cluster receta)**:
ambos son RECTANGULAR + UNISEX + ACETATO + bisagra metálica SIN flex, de receta Mormaii — la
combinación de atributos más parecida de todo el catálogo Mormaii hasta ahora (más cerrada incluso
que San Juan vs Curazao, que al menos diferían en 1 variable visual). No hay forma+género que soldar
(mismo mecanismo que separó Curazao/Daito) porque ambas variables son idénticas acá. La separación
real se apoya en tres capas:
1. **Branded, cero riesgo**: `mormaii barcelona` vs `mormaii high 4` — sin overlap posible.
2. **Tamaño/estilo real y medible**: Barcelona es "talle NORMAL" (alto de lente 41mm) de corte
   rectangular clásico; High 4 es un wayfarer bold de 140mm de ancho total y 42mm de alto de lente —
   mismo orden de magnitud en el papel, pero el estilo wayfarer (aro superior más grueso, forma
   trapezoidal) lo hace leer visualmente más grande y más statement que el rectangular plano de
   Barcelona. Diferenciador de copy/conversión, NO de keyword (ver trampa "grandes" arriba).
3. **Palabra de cierre de título distinta**: Barcelona cierra con "Acetato" (su primer acetato RX);
   High 4 cierra con "Wayfarer" (su estilo real, que Barcelona no reclama) — evita que dos títulos
   Mormaii terminen en la misma palabra.

Cross-link obligatorio High4↔Barcelona ("el otro rectangular de receta en acetato, distinto estilo")
+ High4↔Hover↔Leñas 2 MAG (cuarteto rectangular Mormaii receta completo, aclarando mecanismo/talle/
género en cada cruce) + familia receta Mormaii completa → `/anteojos-de-receta/mormaii`.

**Anti-canibalización cross-brand (High 4 vs Rusty R-CY 02 / Rusty Woxi, "rectangular" genérico)**:
mismo gap ya señalado en Barcelona — R-CY 02 es dueño de facto de `anteojos/lentes rectangulares`
cross-brand. High 4 no lo pelea en ningún nivel. Con High 4 son ya 4 Mormaii + 2 Rusty = 6 productos
"rectangular" de receta sin facet propia (`/anteojos-de-receta/rectangulares` no existe) — reforzar
la prioridad ya escalada en BACKLOG.md (mismo patrón que `/anteojos-de-sol/cuadrados`).

**Anti-canibalización cross-brand (High 4 vs Rusty Opposit Optics, "wayfarer")**: Opposit (receta,
wayfarer, mujer) es el único otro armazón de receta del catálogo con esta forma. Es un entry de
etapa temprana del cluster Rusty (anterior a la disciplina actual de anti-canibalización), su tabla
no marca "wayfarer" como primaria explícita pero sí es el string de forma que usa en copy. High 4 no
reclama la frase exacta "lentes wayfarer"/"anteojos wayfarer" como meta_title ni H1 — la usa sólo
como palabra plana de cierre del title (mismo mecanismo que "Ovalado" en Frey), soldada siempre al
branded "Mormaii High 4". Diferenciador real: Opposit es MUJER explícita, High 4 es UNISEX — géneros
opuestos, sin overlap de intención real de búsqueda con calificador de género. Cross-link opcional
High4↔Opposit ("otro armazón wayfarer de receta, distinta marca y género").

**Honestidad — "transparente" descartado como keyword**: 1 de 2 colores (DC0) es transparente/
cristal — 50%, no alcanza el umbral de mayoría que el proyecto exige para afirmar un atributo de
color en title/H1/meta (mismo criterio que descartó "transparentes" en Vulk Vartis 50% frente a
Strewn 66%). Se menciona como dato honesto SOLO en el alt text y la descripción de esa variante
puntual (DC0), nunca como keyword de la ficha completa. Además el genérico sin género `anteojos
transparentes` (720/16) ya es primaria de Vulk Ready? — doble motivo para no perseguirlo.

**Honestidad — "grandes" descartado como keyword**: ancho total 140mm no alcanza el umbral de
~145mm que el proyecto usa para afirmar "grande"/"oversized" (mismo estándar que descartó a Rusty
Dunsert sol 140mm y Mormaii 178 sol 143mm). El tamaño real se comunica en copy como "wayfarer bold"/
"statement", nunca con la palabra "grande" como target SEO.

**Gender override**: `gender:"unisex"` por decisión de posicionamiento del founder — el atributo
estructurado de ML dice "hombre" pero el producto se vende y se presenta como unisex (no se
cuestiona). Con High 4 son 8 de 13 RX Mormaii unisex (saturadísimo) → "Unisex" NO va como palabra de
título/H1 (mismo criterio Frey), sí puede ir en meta_description/copy como dato honesto.

**No usar**: "rectangular"/"rectangulares" como keyword de título/H1 (saturado cross-brand y dentro
de Mormaii). "Lentes/anteojos wayfarer" como frase exacta de meta_title o H1 (riesgo cross-brand con
Opposit) — sólo "Wayfarer" como palabra plana pegada al branded. "Transparente"/"cristal" como
keyword en ningún nivel (50%, no alcanza honestidad + ya tomado por Ready?). "Grande"/"oversized"
como keyword (140mm no alcanza el umbral de 145mm). "Unisex" como palabra de título (8vo reclamo,
saturado). "High" suelto sin "Mormaii" pegado (riesgo de marca, no de SEO).

**Title**: `Armazón Rx Mormaii High 4 Wayfarer | Óptica Carballo` (52). **H1**: `Mormaii High 4`
(plano, mismo criterio del resto del cluster desde Doha). **Meta**: `Mormaii High 4: armazón de
receta rectangular tipo wayfarer, en acetato con bisagras metálicas. Unisex, 2 colores, envío a todo
el país y garantía de 1 año.` (157)

*Mormaii Sevilha (receta, REDONDO tipo panto — resuelto sobre "ovalado" que escribió el founder: 3
fuentes independientes dicen redondo/redondeado (ML título "Lentes Redondos", ML atributo
estructurado `SHAPE=Redondos`, interoptica.com.ar "frente redondeado") contra 1 sola palabra sin
corroboración externa; 3.48x más volumen de búsqueda (3.480 vs 1.000 vol/mes); y cruza el umbral de 4
productos que habilita `/anteojos-de-receta/redondos` como faceta activa — flaggeado explícitamente
al founder antes de aplicar, confirmado. Calibre 52, puente 21, varilla 137, ancho total 140mm, alto
de lente 45mm, UNISEX (sin conflicto, ML+founder coinciden), acetato, bisagras metálicas SIN flex,
apto monofocal/bifocal/progresivo sin restricción, 3 colores — A14 Negro Mate, BB4 Rosa Transparente
con Carey, DC0 Transparente con Negro Brillo) — slug `mormaii-sevilha-receta` en
`/anteojos-de-receta/mormaii/mormaii-sevilha-receta`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii sevilha (branded) | 0 medido | ~4 | branded exacto, libre, sin riesgo de rubro (único hit en CSV "optica online sevilla" con 0 vol) → **primaria** título+H1+slug+alt |
| anteojos redondos | 880 | 12 | forma real — ya es de Rusty Ther Optics cross-brand → **NO primaria**, Sevilha es la 4ta-5ta ficha redonda del catálogo (Ther Optics, Kirt Optics, Traful, Sevilha) — **cruza el umbral de 4** que habilita `/anteojos-de-receta/redondos` como faceta activa (ver BACKLOG.md) |
| lentes redondos | 1.000 | 18 | variante "lentes" del ítem anterior → body/alt |
| anteojos recetados | 720 | 9 | head de intención receta compartido (mismo criterio de todo el cluster) → copy/1er párrafo, no exclusivo |
| anteojos/lentes para cara redonda | 1.000/15 | **TRAMPA, no usar** — descartada por motivo ÓPTICO, no de SEO: la teoría de contraste de forma recomienda armazones ANGULARES para cara redonda, no armazones redondos; usarla sería una recomendación técnicamente incorrecta (YMYL), pendiente de validar con `optical-expert` antes de tocar el recomendador de forma de cara (anotado en BACKLOG.md) |

**Resolución de forma (override del founder)**: el founder escribió "Unisex Ovalado" en su mensaje de
carga, pero el seed quedó con `frame_shape:"redondo"`. Mecanismo: patrón INVERSO a High4 (donde el
founder tenía respaldo independiente de interoptica) — acá las 3 fuentes externas (ML título, ML
atributo estructurado, interoptica descripción) coinciden entre sí y contra el founder, sin ninguna
corroborando "ovalado". Precedente de taxonomía interna: el único otro Mormaii panto ya cargado
(Traful, seed 133) está clasificado "redondo" pese a no ser un círculo geométrico perfecto, mismo
tipo de forma que Sevilha. `seo-strategist` sumó el desempate objetivo: 3.48x más volumen de cluster
("redondo" 3.480 vs "ovalado" 1.000 vol/mes) y el umbral de 4 productos para faceta activa (redondo
lo cruza, ovalado se queda en 3). Flaggeado explícitamente al founder en el mensaje de cierre antes de
aplicar — confirmó con "publica el seed".

**Anti-canibalización (Sevilha vs Mormaii Traful — mismo mecanismo que High4 vs Barcelona)**: mismo
brand/receta/forma panto/unisex, la combinación más parecida del cluster tras High4↔Barcelona. Se
separa por:
1. **Branded, cero riesgo**: `mormaii traful` vs `mormaii sevilha`.
2. **Material y bisagra real, no cosmética**: Traful = Grilamid inyectado + bisagra metálica flex
   Visyfit italiana; Sevilha = acetato + bisagra metálica SIN flex.
3. **Primer acetato panto de Mormaii**: Barcelona y High4 son los otros acetatos RX de la marca pero
   ambos rectangulares/wayfarer — Sevilha es el primer acetato de Mormaii con forma redonda, hook de
   posicionamiento propio sin pelear keyword.

Cross-link obligatorio Sevilha↔Traful ("otro armazón panto de Mormaii, Grilamid vs acetato") +
Sevilha↔Barcelona↔High4 ("los otros acetatos de receta de Mormaii, distinta forma") + familia receta
Mormaii completa → `/anteojos-de-receta/mormaii` + `/marcas/mormaii`. Mención en copy sin keyword
compartida: Rusty Ther Optics + Vulk Kirt Optics ("otro armazón redondo de receta, distinta marca").

**Riesgo de nombre "Sevilha"**: bajo-moderado, mitigado por ortografía (mismo mecanismo que atenuó
Macau vs el exónimo "Macao") — la grafía portuguesa "Sevilha" (con H) es distinta de "Sevilla" (con
doble L) que usaría un argentino buscando la ciudad española. CSV de `KEYWORDS OPTICA/` sin colisión
de rubro real en Argentina (a diferencia de "Tokio Visión"). Mitigación estándar: nunca
"Sevilha"/"Sevilla" suelto sin "Mormaii" pegado.

**No usar**: "anteojos/lentes redondos" como frase exacta en title/H1 (ya es de Rusty Ther Optics).
"Anteojos/lentes para cara redonda" (1.000 vol) — descartada por motivo óptico, no de SEO (ver arriba).
"Panto" en ningún nivel de cara al cliente (jerga de industria). "Sevilha"/"Sevilla" sueltos sin
"Mormaii". "Unisex" como palabra de título (saturado, 9+/14 RX Mormaii ya lo son). "Acetato" como
palabra de cierre del title (reservada de facto por Barcelona). "Flexible" para la bisagra (es
bisagra metálica SIN flex).

**Title**: `Armazón de Receta Mormaii Sevilha Redondo | Óptica Carballo` (59). **H1**: `Mormaii
Sevilha` (plano). **Meta**: `Mormaii Sevilha: armazón de receta redondo y unisex, en acetato con
bisagras metálicas. Apto para todo tipo de lentes, envío a todo el país y garantía de 1 año.` (160)

*Mormaii Recife (receta, CUADRADO — resuelto sobre "Cuadrado / Rectangular": relación calibre/alto
57/48 = 1,19, igual a los cuadrados Mormaii ya cargados (1,20-1,23) y lejos de los rectangulares
(≥1,29); ML `SHAPE=Cuadrado` —, HOMBRE por decisión del founder (ML dice "Sin género"), poliamida
inyectada, bisagra metálica flex Visyfit, apto monofocal/bifocal/progresivo, talle GRANDE: calibre 57,
puente 19, varilla 136, ancho total 147mm, alto 48mm (override del founder; el distribuidor trae
141/40). 3 colores con stock real, ninguno negro: C02 Azul Mate-Celeste (3), C04 Transparente con
Terminales Azules (3), C05 Azul Brillo (2). El "RX" grabado nunca entra al nombre) — slug
`mormaii-recife-receta` en `/anteojos-de-receta/mormaii/mormaii-recife-receta`*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii recife (branded) | 0 medido | ~4 | branded exacto, libre → **primaria** título+H1+slug+alt |
| anteojos grandes / lentes grandes | 210/13, 210/16 | **secundaria honesta**: 147mm + calibre 57 cumplen el umbral de ~145mm y nadie la reclama en el catálogo. Palabra plana de cierre del title ("Grande"), H2 y copy; nunca frase-objetivo exacta. Techo bajo (demanda femenina), el valor real es diferenciar de Leñas 3 MAG |
| anteojos recetados hombre / lentes recetados hombre | 210/8, 140/11 | carril del hub `/anteojos-de-receta/hombre` → 1 mención natural en el 1er párrafo |
| anteojos recetados | 720/9 | head de intención receta compartido → copy |
| anteojos azules / lentes azules | 110/15, 210/10 | 2/3 variantes con frente azul (66%) pasa el umbral; intención mixta (luz azul) → NO title/H1, sólo meta/copy/alt |
| anteojos/lentes cuadrados | 480/10, 880/10 | 14 RX cuadrados con Recife (Rusty Zinz dueño de facto) → NO primaria, sólo `frame_shape`/copy/alt |
| anteojos cuadrados hombre | 210/14 | **BLOQUEADA** — primaria de Rusty Spell receta |

**Honestidad — "grande"**: primer producto del catálogo que cumple el umbral de ~145mm (147mm).
Precedentes descartados: Rusty Dunsert 140, Mormaii 178 143, High 4 140. El claim se apoya en la medida
del founder (147/48), no en la del distribuidor (141/40, que no pasaría). Si esa medida se revisa a
la baja de 145, "Grande" se cae del title y entra el fallback `...Recife Azul`.

**Honestidad — "azul"**: 2/3 variantes con frente azul. "Transparente" NO se reclama (1/3, y es
primaria de Rusty PRO 30 y Vulk Ready?). Nunca mezclar con "luz azul": el producto no la ofrece.

**Riesgo de nombre "Recife"**: bajo-moderado (ciudad de Pernambuco, Brasil / "arrecife"), cero hits en
los CSV, por debajo de Miami/Tokio y comparable a Sevilha. Mitigación estándar: nunca "Recife" suelto.

**Anti-canibalización (Recife vs Leñas 3 MAG — el caso más ajustado)**: mismo brand/receta/cuadrado/
hombre/poliamida/flex Visyfit. Se separa por: (1) branded; (2) palabra de cierre distinta ("Grande"
vs "Hombre"; Recife NO cierra con "Hombre"); (3) talle (+3mm calibre, +4mm alto, "el cuadrado más
grande de Mormaii" sin exagerar); (4) sin imán y sin color negro (diferenciador de copy, no de
keyword). Con Ancara 2 (deportivo con correa, bisagra plástica reforzada) y Frey (mismo calce 57x48,
forma ovalada) la separación es por uso y forma. Cross-brand: Rusty Spell y PRO 30, sin pelear.

Cross-link obligatorio Recife↔Leñas 3 MAG ("más compacto, con imán para colgar") + Recife↔Ancara 2 +
Recife↔Frey ("mismo calce, forma ovalada") + `/anteojos-de-receta/mormaii` + `/marcas/mormaii` +
`/anteojos-de-receta/hombre`.

**No usar**: "cuadrado"/"rectangular" en title/H1; "anteojos cuadrados hombre" (de Spell);
"transparente" como claim; "Recife"/"arrecife" sueltos; "oversized"; "grandes mujer"; "Grilamid" en
title/H1; "flexible" para el armazón (la flex es sólo la bisagra); "imán"/"magnético"/"clip"; "luz
azul"/"filtro azul"; "unisex"; "Azul" en title/H1; "mormaii lentes/anteojos" (hub-only).

**Title**: `Armazón de Receta Mormaii Recife Grande | Óptica Carballo` (57). **H1**: `Mormaii Recife`
(plano). **Meta**: `Mormaii Recife: armazón de receta cuadrado grande para hombre, en poliamida con
bisagra metálica flex. Apto todo tipo de lente. Envío a todo el país y garantía de 1 año.`

*Mormaii Vesubio (receta, AVIADOR con DOBLE PUENTE — primer aviador de receta de Mormaii del catálogo,
UNISEX provisorio (interoptica unisex, otra óptica lo marca masculino; el founder no aclaró, ver
DATOS_PENDIENTES), frente inyectado de poliamida, patillas de METAL con terminales de goma, bisagra
"integrada" (palabra del founder; el distribuidor dice inyectada reforzada; NO flex, NO metálica).
Calibre 54, puente 16, varilla 136, ancho total 142mm, alto 52mm (medidas del founder; los
distribuidores publican 136-140 de ancho total, no ganan). Dos colores con stock, 3 unidades cada uno:
Col.01 Negro Mate con patillas Gun (primaria por color clásico en el empate 3-3) y Col.03 frente
transparente cristal brillante con patillas plateadas; la publicación de ML es multi-variación para
sumar más colores. El "RX" grabado nunca entra al nombre. Sin `weight_grams`) — slug
`mormaii-vesubio-receta` en `/anteojos-de-receta/mormaii/mormaii-vesubio-receta`. Seed 155 aplicado
2026-10-02; las 2 publicaciones de ML son tradicionales (Col.01 MLA4021586886, Col.03 MLA4021560698)*

| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| mormaii vesubio (branded) | 0 medido | ~4 (convención; en la SERP compiten 4-5 ópticas con ficha del mismo modelo) | branded exacto → **primaria** title+H1+slug+alt. Siempre con "Mormaii" y "receta" cerca |
| anteojos aviador / lentes aviador | 590/20, 1.300/21 | — | forma real, pero YA es primaria de The Take receta y The Trial receta y la intención es mayormente sol → **NO primaria**. "Aviador" sólo como palabra plana de cierre del title (criterio Fortaleza/Sevilha) |
| anteojos recetados / lentes recetados | 720/9, 390/9 | — | head de intención receta compartido → copy, 1er párrafo, no exclusivo |
| doble puente | 0 medido | — | ningún string con "puente" en los CSV; en ML hay páginas de listado propias → meta, callout, alt y título de ML. No va en el title del sitio (largo) |
| anteojos aviador hombre / mujer | 260/14, 140/13 | — | **NO**: género sin confirmar, SERP dominada por sol |
| armazones de lentes / de anteojos / armazones / anteojos marcos / anteojos de vista | 390/8, 320/8, 320/8, 720/9, 210/13 | — | sin dueño en el catálogo, son cabeceras de categoría → hub `/anteojos-de-receta`, no esta PDP |
| anteojos/lentes de metal | 210/12, 260/10 | — | **NO**: primaria de Vulk Kirt; el frente es poliamida, sólo las patillas son metal |
| mormaii lentes / lentes mormaii / anteojos mormaii | 390/170/170 | 7/7/7 | hub-only, nunca en esta PDP |

**Honestidad — "grande"**: NO. 142mm no alcanza el umbral de ~145mm (precedentes descartados: High 4
140, 178 143, Dunsert 140; sólo Recife 147 lo cumple). Se dan los números tal cual: lente 54x52mm. El alto
de 52mm es el más alto de los RX Mormaii cargados al 2026-10-02 (Recife/Frey 48): se dice como número,
nunca como superlativo. **"Liviano"/"ultrafino"**: NO (lo dice el distribuidor, sin gramaje medido; se
habilita "liviano" si el founder pesa el armazón). "Terminales de goma" como dato, no como promesa
antideslizante.

**Compatibilidad de lentes** (`optical-expert`): NO escribir "se adapta a todo tipo de lentes" literal.
El alto TOTAL de 52mm no es la altura útil del aro y el doble puente recorta la zona de cerca para
progresivos. Se redacta como recomendación ("para progresivos, consultanos...", mismo criterio que
Leñas 2 MAG) hasta confirmar con la regente (María Carlota) y medir la altura útil del aro.

**Riesgo de nombre "Vesubio"**: bajo-moderado en Google, moderado en Mercado Libre (volcán Vesuvio,
pizzerías Vesubio, calefactores/estufas y colchones en ML). Además existe un Mormaii Vesubio de SOL que
venden otras ópticas y nosotros no cargamos: por eso el slug lleva `-receta` y el title arranca con
"Armazón de Receta". Nunca "Vesubio" suelto ni "volcán"/"Pompeya".

**Anti-canibalización**: vs Fortaleza (sol, aviador doble puente): intención distinta (sol vs receta),
bisagra y patillas distintas; NO se presenta como "la versión de receta de Fortaleza". Cross-link
manual Vesubio↔Fortaleza (`fetchCompanionModality` no los une por slug). Vs RX aviadores de otras
marcas (Rusty The Take, Vulk The Trial, Rusty Bruice): marca + branded + material; Bruice es más grande
(56x54, frente 146) → "más compacto" sólo con números. "Aviador" genérico lo debe liderar la faceta
`/anteojos-de-receta/aviador` (con Vesubio suma su 4to producto), no una PDP; se activa
`/anteojos-de-receta/mormaii/aviador` con 1 solo producto.

**Cross-links obligatorios**: `/anteojos-de-receta/mormaii`, `/marcas/mormaii`,
`/anteojos-de-receta/aviador`, `/anteojos-de-receta/mormaii/aviador`, Fortaleza (y reverso), Rusty The
Take receta, Vulk The Trial receta, Rusty Bruice receta.

**No usar**: "grande"/"oversized"/"XL"; "liviano"/"ultraliviano"/"ultrafino"; "flexible"/"flex";
"metálico"/"de metal" para el armazón (sólo patillas); "Grilamid"; "transparente"/"cristal" como claim
(1 de 2 hoy = 50%, no alcanza el umbral; sólo alt de la variante); "unisex"/"hombre"/"mujer" en title/H1 hasta que el
founder confirme; "anteojos aviador" como frase-objetivo; "anteojos de sol aviador"; "para grandes";
"sol"/"polarizado"/"UV"; "Vesubio" suelto; "mormaii lentes/anteojos".

**Title**: `Armazón de Receta Mormaii Vesubio Aviador | Óptica Carballo` (59). **H1**: `Mormaii Vesubio`
(plano). **Meta**: `Mormaii Vesubio: armazón de receta aviador con doble puente, frente de poliamida y
patillas metálicas. Unisex. Envío a todo el país y garantía de 1 año.` (si el founder decide "hombre",
sacar "Unisex" de la meta).

**Mercado Libre** (la publicación se crea aparte): categoría MLA417127. Título (60):
`Armazón Anteojos Receta Mormaii Vesubio Aviador Doble Puente` (opciones B: `Anteojos Armazón Marcos
Receta Mormaii Vesubio Aviador`, 54; C: `Armazón Anteojos Recetados Mormaii Vesubio Aviador`, 50). Sin género ni
color porque es multi-variación. La forma de ML (SHAPE) no tiene "Aviador": sólo Cuadrada / Ovalada /
Rectangular / Redonda.

### REEF (octubre 2026, CSV `KEYWORDS OPTICA/`; volúmenes verificados por el agente, no por mí)
Productos cargados, en orden de seed: 1. Reef 128 Yin (sol), seed 156. Marca de origen californiano con fundadores argentinos (no decir "marca argentina" en fichas). El hub de la marca es `/anteojos-de-sol/reef` (no existe `/marcas/[slug]`).
Keyword head: `lentes de sol reef` (210/7) y `anteojos de sol reef` (170/9) son del HUB `/anteojos-de-sol/reef` desde que hay dos soles Reef (antes eran de la ficha del 128); cada ficha se separa por modelo y familia léxica (128 = "lentes de sol", 129 = "anteojos de sol"). Cabeceras mixtas sol y receta (`anteojos reef` 590/11, `reef anteojos` 590/7, `lentes reef` 390/10) van al hub, no a la PDP. El "Reef 3.400" de marca no se reproduce en los CSV.

*Reef 128 Yin (sol, HOMBRE, ENVOLVENTE DEPORTIVO, frente de metal con puente doble, patillas de aluminio, bisagras con sistema flex, lente TAC POLARIZADA UV400 en las 8 variantes) · slug `reef-128-yin` en `/anteojos-de-sol/reef/reef-128-yin`. Seed 156 aplicado 2026-10-03; publicación tradicional MLA1751925814*
| Keyword | Vol/mes | Dif | Uso |
|---|---|---|---|
| lentes de sol reef | 210 | 7 | primaria (title) |
| anteojos de sol hombre reef / lentes de sol hombre reef | 170/170 | 7/11 | copy |
| anteojos de sol reef / reef anteojos de sol | 170/170 | 9/8 | copy (el "Anteojos de Sol Reef" del title es del hub) |
| anteojos reef / reef anteojos / lentes reef | 590/590/390 | 11/7/10 | hub, nunca PDP |
| lentes de sol polarizados | 260 | 12 | copy |
| lentes de sol envolventes / deportivos | 70 / 210 | 36 / 17 | sólo copy y alt (saturado por Rusty y Mormaii) |
Sin dato: "reef 128", "reef 128 yin/ying" (el founder pidió "Yin" en el nombre porque hay gente que lo busca así; sin volumen medido). Hay un hermano 129 Yang: cruzar 128↔129 cuando exista.
Title: `Lentes de Sol Reef 128 Yin Polarizados | Óptica Carballo` (56). H1 = `Reef 128 Yin`. Meta (149): `Lentes de sol Reef 128 Yin para hombre: polarizados UV400, frente de metal y patillas de aluminio. Envío a todo el país, estuche, franela y garantía.`
No usar: "128" suelto, "178", liviano, flexible (la flexibilidad se dice sólo como "bisagras con sistema flex"), policarbonato, "armazón de aluminio" (sólo patillas), colores o cantidad, "marca argentina", "resistente a rayones".

*Reef 129 Yang (sol, ENVOLVENTE, HOMBRE, frente de metal, patillas de aluminio, bisagras metálicas con sistema flex, lente TAC POLARIZADA UV400 cat 3, 66-16-110, ancho 140, alto de lente 43, 6 colores) · slug `reef-129-yang` en `/anteojos-de-sol/reef/reef-129-yang`. Seed 157 aplicado 2026-10-03; publicación tradicional MLA1423304199*
| Keyword | Vol/mes | Dif | Uso |
|---|---|---|---|
| reef 129 yang | sin medir | - | primaria (modelo, title, H1) |
| anteojos de sol reef 129 yang polarizado | 0 | 4 | frase natural en copy y alt |
| anteojos de sol reef | 170 | 9 | copy (la lidera el hub) |
| anteojos de sol polarizados | 170 | 10 | copy |
| anteojos de sol hombre reef | 170 | 7 | copy (género hombre confirmado) |
| lentes de sol reef | 210 | 7 | NO en esta PDP (hub + 128) |
Sin dato en los CSV: "reef 129", "reef yang", "reef yin yang". Title: `Anteojos de Sol Reef 129 Yang Polarizados | Óptica Carballo` (59). H1 = `Reef 129 Yang`. Meta (154): `Anteojos de sol Reef 129 Yang polarizados UV400, con frente de metal y patillas de aluminio. Lente de 66 x 43 mm. Envío a todo el país y garantía oficial.`
Anti-canibalización vs 128: familia léxica distinta, token de modelo distinto, meta distinta; cross-link 128↔129 (related automático + una frase en el copy del 129; falta la del 128). Cabeceras genéricas al hub.
No usar en el 129: liviano, flexible (sólo "bisagras metálicas con sistema flex"), "armazón de aluminio" (sólo patillas), policarbonato (es TAC), deportivo, grande/oversized, colores o cantidad, "marca argentina", "resistente a rayones", "128"/"129" sueltos, género o "envolvente" en title/H1/meta.

*Reef 177 Aerial (sol, ENVOLVENTE DEPORTIVO, HOMBRE, armazón inyectado de Grilamid, lente de policarbonato UV400 cat 3, antirreflejo interno, bisagras metálicas, 64-17-124, ancho 143, alto de lente 47; 3 versiones con lente polarizada y 1 con lente espejada NO polarizada) · slug `reef-177-aerial` en `/anteojos-de-sol/reef/reef-177-aerial`. Seed 158 aplicado 2026-10-05; publicaciones tradicionales MLA1544239398, MLA1543879398 y MLA1961794090*
| Keyword | Vol/mes | Dif | Uso |
|---|---|---|---|
| reef 177 aerial | sin medir | - | primaria de modelo (title, H1) |
| lentes de sol deportivos | 210 | 17 | descriptor del title y primer párrafo |
| lentes deportivos de sol | 210 | 15 | variante en copy |
| anteojos de sol hombre deportivos | 110 | 10 | copy y alt |
| lentes de sol hombre deportivos | 90 | 19 | copy |
| lentes de sol espejados | 90 | 16 | una mención, sin color |
| lentes de sol reef / anteojos de sol reef | 210 / 170 | 7 / 9 | NO en esta PDP (hub y 128) |
Sin dato en los CSV: "reef 177", "reef aerial", "reef 177 aerial". Title: `Lentes de Sol Deportivos Reef 177 Aerial | Óptica Carballo` (58). H1 = `Reef 177 Aerial`. Meta (150): `Lentes de sol deportivos Reef 177 Aerial para hombre, envolventes, UV400 y categoría 3. Lente de 64 x 47 mm. Envío a todo el país, estuche y garantía.`
Anti-canibalización: familia léxica "lentes de sol deportivos" (And Now toma "anteojos de sol deportivos", 128 "lentes de sol", 129 "anteojos de sol"); token de modelo y meta distintos; cabeceras genéricas de Reef al hub. Polarizado: NUNCA en title, H1 ni meta; en copy "tres versiones polarizadas y la espejada azul no"; `polarized` por variante; alt de la C09 sin "polarizado".
Cross-link: el 177 apunta al 128 y al 129 con una frase; **falta la frase de vuelta en el 128 y el 129** ("Para el deporte, mirá también el Reef 177 Aerial"; actualizar sus seeds, UPSERT).
No usar: liviano, flexible, "armazón de metal o aluminio", BTR600, "para deportes" a secas ni promesas de protección deportiva, colores o cantidad de versiones, "azul" para la espejada fuera del alt, "177" suelto, "marca argentina", resistente a rayones.

*Reef 188 Octopus (sol, ENVOLVENTE, HOMBRE, armazón inyectado con bisagras plásticas reforzadas, lente de policarbonato UV400 cat 3, 66-14-134, ancho 141, alto de lente 47; 3 versiones: 2 con lente polarizada y antirreflejo interno, 1 con lente gris oscuro NO polarizada y sin antirreflejo) · slug `reef-188-octopus` en `/anteojos-de-sol/reef/reef-188-octopus`. Seed 159 aplicado 2026-10-05; publicaciones tradicionales MLA1504917413, MLA1382267525 y MLA2154432869*
| Keyword | Vol/mes | Dif | Uso |
|---|---|---|---|
| reef 188 octopus | sin medir | - | primaria de modelo (title, H1) |
| lentes de sol envolventes | 70 | 36 | descriptor del title y primer párrafo |
| lentes de sol envolventes hombre | 70 | 36 | copy y alt |
| lentes envolventes | 90 | 16 | copy |
| anteojos de sol envolventes hombre | 50 | 36 | una mención en copy |
| lentes de sol categoria 3 | 30 | 36 | copy |
| lentes de sol polarizados y antireflejo | 90 | 12 | sólo el párrafo "según la versión", nunca title/H1/meta |
| lentes de sol reef / anteojos de sol reef | 210 / 170 | 7 / 9 | NO en esta PDP (hub y 128) |
Sin dato en los CSV: "reef 188", "reef octopus", "reef 188 octopus". Title (60): `Lentes de Sol Envolventes Reef 188 Octopus | Óptica Carballo`. H1 = `Reef 188 Octopus`. Meta (152): `Lentes de sol envolventes Reef 188 Octopus para hombre: armazón inyectado, lente de policarbonato, UV400 y categoría 3. Envío a todo el país y garantía.`
Anti-canibalización: descriptor único "envolventes" (128 polarizados, 129 anteojos polarizados, 177 deportivos); token de modelo y meta distintos. Polarizado: NUNCA en title, H1, meta ni short_description; `lens_treatment` del producto sólo ["uv400"]; `polarized` y `lens_treatment:["antirreflejo-interno"]` por variante.
Cross-link: el 188 apunta con links a 128, 129 y 177; **frase de vuelta en 128, 129 y 177: APLICADA 2026-10-05 junto con las del 196** (UPSERT de seeds 156-158, un solo turno: "Si buscás un envolvente de armazón inyectado, mirá los [Reef 188 Octopus](...)").
No usar: liviano, flexible ("No Flex" de la marca no es argumento), deportivo (sólo dijo envolvente; sin `line`), Grilamid, BTR600, revo, espejado, azul para el lente, colores o cantidad de versiones en el copy, "marca argentina", resistente a rayones, "188" suelto.

*Reef 196 Reunión (sol, CUADRADO tipo wayfarer, UNISEX, armazón inyectado con bisagras plásticas reforzadas, lente de policarbonato UV400 cat 3, 56-19-137, ancho 144, alto 49; 3 versiones con lente gris oscuro: C10 negro brillo y C11 negro mate polarizadas, C02 negro mate NO polarizada; las 3 con antirreflejo interno) · slug `reef-196-reunion` en `/anteojos-de-sol/reef/reef-196-reunion`. Seed 160 (borrador 2026-10-05); publicaciones tradicionales MLA2107860210 (C10/C11) y MLA4031305848 (C02)*
| Keyword | Vol/mes | Dif | Uso |
|---|---|---|---|
| reef 196 reunión / reef 196 | sin dato | - | primaria de modelo (title, H1) |
| lentes de sol cuadrados | 390 | 11 | descriptor del title y primer párrafo |
| anteojos wayfarer | 260 | 9 | una mención en el copy ("estilo/estética tipo wayfarer") |
| lentes de sol wayfarer | 140 | 36 | una mención, sin insistir |
Title (58): `Lentes de Sol Cuadrados Reef 196 Reunión | Óptica Carballo`. H1 = `Reef 196 Reunión`. Meta (146): `Lentes de sol cuadrados Reef 196 Reunión, unisex: armazón inyectado, lente de policarbonato, UV400 y categoría 3. Envío a todo el país y garantía.`
Anti-canibalización: descriptor único "cuadrados" (128/129 envolventes, 177 deportivo, 188 envolvente); NO atacar `lentes de sol reef`/`anteojos de sol reef` (hub de marca), `lentes cuadrados`, `wayfarer lentes`, `lentes wayfarer` (hubs de forma), ni variantes hombre/mujer (el 196 es unisex). "Wayfarer" una sola vez y en minúscula, nunca como nombre; sin "Ray-Ban". Polarizado: NUNCA en title, H1, meta ni short_description (C10/C11 sí, C02 no; `polarized` por variante). `frame_shape: "cuadrado"` (no `wayfarer`: ese valor mapea al filtro `/wayfarer`; cambiarlo si el founder quiere aparecer ahí).
Cross-link: el 196 apunta a 128, 129, 177 y 188. **Frases de vuelta APLICADAS 2026-10-05** (UPDATE de `description` en Cloud + seeds 156-159 sincronizados; 129 además convirtió su mención de texto plano al 128 en link, y 128/129/177 suman el link al 188): 128 "Si preferís una forma cuadrada y unisex en lugar de envolvente, mirá los [Reef 196 Reunión](/anteojos-de-sol/reef/reef-196-reunion)."; 129 "Para un estilo cuadrado de línea wayfarer, mirá los [anteojos de sol Reef 196 Reunión](...)."; 177 "Si lo vas a usar todos los días y querés un frente cuadrado, mirá el [Reef 196 Reunión](...)."; 188 "Si te gusta el armazón inyectado pero en forma cuadrada, mirá el [Reef 196 Reunión](...)."
No usar: liviano, flexible, "bisagras con sistema flex", Grilamid, BTR600, colores o cantidad de versiones, "marca argentina", "resistente a rayones", "196" suelto. `recommended_face_shapes: ["ovalado","redondo","triangular"]` (optical-expert, criterio estético).

*Reef 193 Tortuga (sol, CUADRADO ANCHO, HOMBRE, armazón inyectado con bisagras metálicas sin flex, lente de policarbonato UV400 cat 3 con AR interno, 59-17-131, ancho 144, alto de lente 52; 3 versiones: C11 negro mate y C12 marrón con lente polarizada, C2 negro mate con espejado azul NO polarizada) · slug `reef-193-tortuga` en `/anteojos-de-sol/reef/reef-193-tortuga`. Seed 161 aplicado 2026-10-05; publicaciones tradicionales MLA2155221487, MLA2155221489 y MLA4032299650*
Title (57): `Anteojos de Sol Hombre Reef 193 Tortuga | Óptica Carballo`. H1 = `Reef 193 Tortuga`. Meta (~146): `Anteojos de sol Reef 193 Tortuga para hombre: armazón cuadrado ancho, lente de policarbonato, UV400 y categoría 3. Envío a todo el país y garantía.`
Keywords (CSV): `anteojos de sol hombre` 3.600/11 (sólo prefijo del title; es del hub de género), `anteojos de sol para hombres` 320/10, `anteojos de sol hombre reef` 170/7 (compartida con 128/129), `lentes de sol cuadrados hombre` 90/18, `anteojos de sol cuadrados hombre` 70/35 (una mención cada una en el copy); `reef 193 tortuga`/`reef 193` sin dato.
Anti-canibalización con el 196: el 196 es dueño de `lentes de sol cuadrados` (390/11) y de "wayfarer"; el 193 usa "anteojos de sol" + "hombre", "cuadrado" sólo como adjetivo, sin wayfarer ni envolvente, y el 196 NO suma "hombre" ni "frente ancho". Evitar: `lentes cuadrados`/`anteojos cuadrados` (hubs de forma), `lentes de sol reef`/`anteojos de sol reef`/`anteojos reef` (hub y 128), "polarizado" en title/H1/meta/short (la C2 no lo es), liviano, flexible, Grilamid, BTR600.
Cross-link: el 193 apunta a 128, 129, 188, 177 y 196; el 196 apunta de vuelta al 193 ("Si buscás un cuadrado para hombre con lente más ancho…", aplicado 2026-10-05, seed 160 sincronizado). 177 y 188 NO suman link al 193 (ya mandan al 196 por "cuadrado"; un segundo link diluye).

*Reef 183 Bolero (sol, CUADRADO DEPORTIVO, HOMBRE, armazón inyectado con bisagras metálicas sin flex, lente de policarbonato ESPEJADO AZUL NO polarizado, UV400 cat 3, AR interno, 60-17-139, ancho 148, alto 49; 1 versión: C11) · slug `reef-183-bolero` en `/anteojos-de-sol/reef/reef-183-bolero`. Seed 162 aplicado 2026-10-06; publicación tradicional MLA4034472062*
Title (56): `Lentes de Sol Espejados Reef 183 Bolero | Óptica Carballo`. H1 = `Reef 183 Bolero`. Meta (147): `Lentes de sol espejados Reef 183 Bolero para hombre: cuadrados, de estilo deportivo, UV400 y categoría 3. Envío a todo el país, estuche y garantía.`
Descriptor único "espejados" (deportivo = 177 `lentes de sol deportivos` 210/17, cuadrado = 196 `lentes de sol cuadrados` 390/11, hombre = 193, envolventes = 188). Keywords (CSV): `lentes de sol espejados` 90/16 (primaria), `lentes espejados` 170/11, `anteojos espejados` 140/14, `lentes de sol espejados hombre` 50/36 (una mención cada una en el copy); `reef 183`/`reef bolero` sin dato. Evitar: `lentes de sol deportivos` (177), `lentes de sol cuadrados`/`lentes cuadrados` (196 y hubs), `lentes de sol reef`/`anteojos reef` (hub y 128), `anteojos de sol hombre` (hub/193), polarizado, liviano, flexible, Grilamid, BTR600. "Espejados" pasa a ser del 183: 177 (C09) y 193 (C2) lo mencionan una vez en el copy, sin title ni meta.
Cross-link: el 183 apunta a 177, 193 y 196; frases de vuelta APLICADAS 2026-10-06 sólo en el 193 y el 177 (196, 128, 129 y 188 NO: otro intento, diluye). No agregar más links al 177 (ya manda al 196).
**Seed 163 (2026-10-06): +4 variantes polarizadas sin stock (C07, C09, C08, C10).** Title y meta del 183 se MANTIENEN mientras la C11 espejada sea la única con stock; cuando vuelva el stock de una polarizada (o se agote la C11) cambiar a title `Reef 183 Bolero | Lentes de Sol UV400 y Categoría 3` (50) y meta `Lentes de sol Reef 183 Bolero para hombre: cuadrados, de estilo deportivo, UV400 y categoría 3. Envío a todo el país, estuche y garantía.`; si se agota todo, sacar del sitemap/noindex temporal. Short: `Lentes de sol espejados Reef 183 Bolero: cuadrados, de estilo deportivo, para hombre. UV400, categoría 3 y bisagras metálicas.` Sin "polarizado" en title/H1/short/meta; sin afirmar AR en las 4 nuevas; wording de "según la versión" distinto del 177 y sin cantidades. El 183 entra a `/anteojos-de-sol/polarizados` por tener variantes `polarized:true` (aunque en 0) y NO a `/reef/polarizados`, igual que el 177/188.

*Reef 155 Ali (sol, RECTANGULAR CLÁSICO, HOMBRE, armazón inyectado con bisagras plásticas, lente de policarbonato UV400 cat 3, 55-18-136, ancho 139, alto 44; 7 versiones: C25/C18/C20 polarizadas; C24/C14 (espejado azul)/C07 (patillas rojas)/C01 no polarizadas) · slug `reef-155-ali` en `/anteojos-de-sol/reef/reef-155-ali`. Seed 164 aplicado 2026-10-06; 7 publicaciones tradicionales (todas pausadas; sólo la C25 con stock 1)*
Title (58): `Lentes de Sol Rectangulares Reef 155 Ali | Óptica Carballo`. H1 = `Reef 155 Ali`. Meta (~150): `Lentes de sol rectangulares Reef 155 Ali para hombre: armazón inyectado, lente de policarbonato, UV400 y categoría 3. Envío a todo el país y garantía.`
Descriptor único "rectangulares" (`lentes de sol rectangulares` 320/12; `anteojos de sol rectangulares` 140/12; `lentes de sol rectangulares hombre` 70/35): 196 = cuadrados, 193 = hombre, 183 = espejados, 177 = deportivos, 188 = envolventes. `frame_shape:"rectangular"` (no "cuadrado": ese filtro es de 196/193). Evitar `lentes rectangulares` (hub de forma), `lentes de sol reef`, `anteojos de sol hombre`, `lentes de sol cuadrados`, `lentes de sol espejados`, "ray ban"/"wayfarer", color y cantidad de versiones en el copy, "polarizado" en title/H1/short/meta, y afirmar AR en C18/C20 (sin dato).
Cross-link: el 155 apunta a 196 y 193; frase de vuelta APLICADA sólo en el 193 ("Si querés un frente rectangular más clásico y angosto…"). Sin links nuevos en 196/183/177/188/128/129. Mientras casi todas estén sin stock: sitemap/noindex temporal según la política (revisar cuando se reactiven).


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
