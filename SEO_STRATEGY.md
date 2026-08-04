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

*Rusty The Take (SOL, AVIADOR doble puente, UNISEX, 1/1 polarizado, G-Flex + patillas acetato, policarbonato UV400 cat3, 18g) — slug `rusty-the-take` en `/anteojos-de-sol/rusty/rusty-the-take`*
| Keyword | Vol/mes | Difficulty | Por qué pega |
|---|---|---|---|
| lentes de sol aviador | 170 | — | **primaria forma** — carril ÚNICO del cluster Rusty-sol |
| lentes de sol rusty | 1.300 | 9 | head de marca, soporte (1er párrafo/H2, no primaria — saturada) |
| anteojos de sol rusty | 880 | 10 | variante "anteojos" → copy |
| lentes/anteojos de sol polarizados | 260/170 | 12/10 | atributo (1/1 → afirmable) → H1/copy |
| rusty the take (branded) | 0 medido | ~4 | title/H1/slug |

**Honestidad**: 1/1 polarizado → SÍ se afirma "Polarizado" en title/H1 (criterio Terdey/The Sil 3/3). Unisex → NO targetear `aviador hombre`. **Anti-canibalización**: (A) vs Vulk The Trial sol (también aviador doble puente): marca distinta + The Trial 2/4 pol (destaca "Unisex") vs The Take 1/1 pol (afirma "Polarizado") + cross-link "otros aviadores de sol" + ambos → `/anteojos-de-sol/aviador`. (B) vs The Take receta: intención sol vs receta + cross-link sol↔receta. Único aviador del cluster Rusty-sol. Title: `Lentes de Sol Rusty The Take Aviador | Óptica Carballo`. H1: `Lentes de Sol Rusty The Take — Aviador Polarizado Unisex`.

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
