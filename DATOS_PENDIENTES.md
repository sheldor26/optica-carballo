# Datos que faltan — para pasar a Claude

Lista viva de lo que Juan tiene que medir, pesar o confirmar para poder cerrar cargas del catálogo.

**Cómo se usa**: Juan pregunta "¿qué me falta pasarte?" y sale de acá. Cuando pasa un dato, se
marca `[x]`, se carga a la base y se anota la fecha. Nada se borra: la lista de hechos sirve para
ver qué se cerró.

**Cómo se llena**: cada vez que una carga queda incompleta porque falta un dato del founder, se
agrega acá **en el mismo turno**, con qué bloquea. Si un dato no bloquea nada, va igual pero en la
sección amarilla.

⚠️ **Las medidas SIEMPRE entran acá si no las pasó él.** No se copian de Mercado Libre, del
fabricante ni de sus placas viejas — regla dura 7 de CLAUDE.md. Material, peso, color, precio y
stock sí se pueden tomar de esas fuentes.

Última revisión: 2026-08-26 (Cinema, Rew, Ardigan, Guardian).

---

## 🔴 Bloqueando ahora

- [ ] **CUIT, razón social y domicilio fiscal de la óptica.** Descubierto el 2026-08-26 investigando
  el catálogo de Instagram, pero **no tiene nada que ver con Meta**: es una obligación legal del
  sitio tal como está hoy. En `app/(storefront)/terminos-y-condiciones/page.tsx` el dato figura
  literalmente como `**CUIT**: [A CONFIRMAR]`.

  **Qué bloquea**: el art. 8 de la Ley 24.240 exige identificar al vendedor con su CUIT en las
  ventas por catálogo publicadas por cualquier medio, y el sitio ya publica precios. No bloquea una
  carga de producto: bloquea estar en regla.

  Con el dato se completan los términos y condiciones y se evalúa si además va en el pie del sitio.


- [ ] **Vulk The Trial — medir el armazón.** Descubierto el 2026-08-26 preparando el alta en ML de
  la colorway carey. Las medidas que hoy muestra el sitio (lente 50 · puente 15 · varilla 150 ·
  frente 147) **no las mediste vos**: salieron de una foto, según dice la cabecera del seed 71. Y
  las tres fuentes disponibles se contradicen entre sí:

  | Fuente | Lente | Puente | Varilla | Frente |
  |---|---|---|---|---|
  | Ficha del fabricante (calibre) | 47 | 20 | 145 | — |
  | Widget de medidas del MISMO fabricante | — | — | — | 144 |
  | Lo que muestra el sitio hoy ("de la foto") | 50 | 15 | 150 | 147 |

  Son 5 mm de diferencia en el puente. Mismo patrón que el Malice (decía 59, era 54) y el Bruice
  (decía 16, era 18). **Qué bloquea**: la publicación nueva de ML salió sin bloque de medidas. Con
  tu medición se corrigen de una las tres superficies — el sitio, las dos publicaciones hermanas de
  ML y la publicación nueva.

- [ ] **Vulk The Trial MDEMI (carey) — unidades reales y precio.** Ver la sección de decisiones.


- [ ] **Rusty Rew — los 2 SKUs (si los tenés).** Ninguna de las 4 publicaciones los declara y no los
  tenías a mano, así que el producto salió con SKUs de casa `REW-MBLK-S10` y `REW-MBLK-300CE`. Si
  aparecen los reales en el catálogo de Rusty, pasámelos: los cambio con un UPDATE. Conviene hacerlo
  ahora que no hay ventas en el sitio, porque el SKU es la llave de idempotencia del seed.

- [ ] **Rusty Rew — ¿las patillas son de G-Flex también?** ML declara el material del frente pero no
  el de las patillas. No lo cargo adivinando (precedente Bruice: mejor vacío que inventado).

- [ ] **Rusty Rew — ¿rectangular o cuadrado?** ML dice "Rectangular" en las dos publicaciones, pero
  en las fotos parece más un wayfarer escuadrado. Mi voto es dejarlo **rectangular**, y no sólo por
  seguir a ML: es la única de las dos que tiene página en el sitio, y además el Rew sería el **primer
  rectangular de sol de Rusty**, lo que saca a `/anteojos-de-sol/rusty/rectangular` del noindex por
  falta de productos. Confirmame.

- [ ] **Rusty Rew — cómo llamar al lente espejado.** Todo lo llama "celeste" (el título de ML y tu
  placa vieja), pero midiendo el píxel del lente en tus fotos da **dorado-verdoso de frente**
  (tono 68°) y **celeste sólo de perfil** (178°). Es un espejado que cambia con el ángulo, y la foto
  principal se ve dorada. Si lo cargo como "celeste" a secas, el comprador ve otra cosa. Mi
  propuesta: **"espejada dorada con reflejos celestes"**, que es lo que muestran tus dos fotos.
  Confirmame.

- [x] **Vulk: ¿estuche o funda?** — **RESPONDIDO por el founder el 2026-08-29**, textual:
  *"Es estuche Vulk tipo de cuero (no se si es cuero)"*.
  **Es ESTUCHE**, así que la palabra que ya usan los ~21 productos Vulk queda confirmada y no hay
  que reescribir ninguna ficha. Se cae la hipótesis de la funda que venía de que ML declara
  `ACCESSORIES_INCLUDED = Funda` en el Cinema y de las fotos de packaging del fabricante.
  ⚠️ **Lo que NO se puede escribir es el material.** Él mismo aclara que no sabe si es cuero, así
  que "de cuero" viola la regla dura 3 (no prometer lo que no podemos cumplir) y "símil cuero" o
  "cuerina" afirman lo contrario con la misma falta de dato. **El estuche se nombra sin material**,
  que además es lo que ya pide `BUSINESS_POLICIES.md` línea 36 ("no adjetivos calificativos del
  estuche, sólo estuche original de la marca").
  ✅ **Verificado y cerrado el 2026-08-29** (seed 104):
  - **ML te da la razón**: `ACCESSORIES_INCLUDED` dice **"Estuche"** en 5 de 6 publicaciones
    consultadas. El **"Funda" del Cinema era el outlier** y fue lo que disparó toda esta duda — es un
    dato mal cargado en esa publicación, no la regla de la marca. **Corregilo en ML cuando quieras**
    (no se toca desde acá).
  - **La foto del kit no contradice nada**: muestra un estuche negro tipo sobre con solapa y broche,
    la franela y los stickers.
  - 🔴 **Se encontró un claim de cuero VIVO**: el alt de esa imagen decía "estuche **de cuero**" y se
    mostraba en los **33 productos Vulk** desde el seed 17 (2026-05-30). Corregido. Ver MISTAKES.md.

## ✅ Rusty Bad Card — CERRADO el 2026-08-29

El founder pasó **143 / 54×53 / 19 / 145**, **bisagras plásticas sin flex**, y confirmó la forma:
*"Es estilo aviador doble puente"*. SKU (1035570-1035575) y peso (25 g) salieron del fabricante.
Cargado y verificado en producción. Sigue abierto sólo un dato menor, que no bloquea nada:

- [ ] **¿El antirreflex va en la cara interna?** Que exista está doblemente respaldado (tu
  publicación declara `LENS_TREATMENT = ANTIREFLEX/PROTECCION UV400` y una de tus placas viejas dice
  "LENTES CON ANTIRREFLEX"). Lo que no sabemos es **dónde está la capa**, así que la ficha dice
  "antirreflex" sin afirmar la posición — a diferencia del Dunsert, donde vos confirmaste que es
  interna. Si lo confirmás, se agrega esa precisión.

**⚠️ Dos errores de color en TUS publicaciones de ML** (verificados abriendo las fotos, el sitio ya
carga lo correcto):
- **C6 negro brillo**: ML declara `LENS_COLOR = Degradé Marrón`. La lente es un **gris degradé que
  vira a celeste abajo**, no marrón.
- **C1**: ML lo llama "Azul Metálico". Es un **azul humo translúcido**, no un metalizado.

## ✅ El resto del catálogo

Los otros 77 productos activos tienen **material de patillas completo**. Sobre las medidas, ojo con
la lección del Trial: campo lleno ≠ dato válido. Lo verificado es lo que pasaste vos.

Lo único que falta además son **18 pesos** (el founder confirmó el 2026-08-26 que no tiene el del
Rew ni el del Cinema), en una lista aparte para hacerlos con la balanza:
👉 **[PESOS_A_MEDIR.md](PESOS_A_MEDIR.md)**

---

## 🔵 Decisiones tuyas (no son datos, son criterios)

- [ ] **Faltan facetas de forma para el 63% del catálogo.** Esto arrancó como "el Malice quedó
  afuera" y al medirlo contra la base resultó mucho más grande. Las facetas que existen hoy cubren
  los cuatro grupos MÁS CHICOS, y los cinco más grandes no tienen ninguna:

  | Forma | Productos | ¿Tiene faceta? |
  |---|---|---|
  | **cuadrado** | **24** | ❌ no |
  | **redondo** | **15** | ❌ no |
  | **envolvente** | **7** | ❌ no |
  | ovalado | 2 | ❌ no |
  | hexagonal | 1 | ❌ no |
  | aviador | 11 | ✅ sí |
  | wayfarer | 8 | ✅ sí |
  | rectangular | 7 | ✅ sí |
  | cat-eye | 3 | ✅ sí |

  **49 de 78 productos activos no entran a ninguna faceta de forma**, incluido el grupo más grande
  del catálogo. Cuadrado solo tiene más productos que aviador y wayfarer juntos.

  **Qué bloquea ahora**: el Vulk Cinema es redondo, así que se suma a los 15 que quedan afuera.

  Opciones: crear las facetas que faltan (empezando por cuadrado y redondo, que son 39 productos),
  crear sólo esas dos, o dejarlo como está y aceptar que esas búsquedas no tienen página. Decisión
  tuya — decime y lo armo.
- [ ] **Alinear ML con el sitio** en tres casos donde tus publicaciones declaran otra cosa: el
  Malice dice `GENDER = "Sin género"` y en el sitio es hombre; el Bruice dice
  `FRAME_SHAPE = "Anteojo Cuadrado"` y en el sitio es aviador; el Zion dice "Ovalada" y en el sitio
  es redondo. No urge — el sitio es el que manda.

### ⏸️ Congelado por decisión del founder (2026-08-25)

**Las 49 publicaciones de ML con medidas que no coinciden con el sitio.** Textual suyo: *"las
medidas que estoy subiendo en mi página son las precisas; si en ML no coincide lo dejamos para ver
después"*. O sea que **el sitio es la fuente de verdad** y las discrepancias no se tocan por ahora.
Se listan cuando se quiera con `pnpm ml:medidas`.

---

## ✅ Recibido y cargado

- [x] **2026-08-26 — Vulk The Guardian: medidas 141 / 53 × 51 / 14 / 140 mm y peso 25 g confirmado.**
  Geometría verificada: 53 × 2 + 14 = 120 ≤ 141. El calibre, el puente y la varilla coinciden con la
  ficha del fabricante, pero **el ancho total no**: ella decía 142 y vos mediste 141. Van cinco de
  cinco veces que la fuente externa erra algo (Malice, Bruice, Cinema, Ardigan, Guardian) — poco
  esta vez, pero erra.

- [x] **2026-08-26 — Vulk The Guardian: los 4 SKUs y el peso, sin pedírtelos.** Salieron de la ficha
  oficial de vulkeyewear.com, que esta vez sí tiene el modelo: **109082** SBLK/S10 POL, **109089**
  MBLK/S10 POL, **109081** MBLK/S10 y **109091** MBLK/REVO BLUE, más **peso 25 g**, bisagras con
  sistema flexo y talle medium. El catálogo tiene 7 colorways; vos vendés 4.

- [x] **2026-08-26 — Rusty Ardigan: los 4 SKUs, sus códigos y el peso confirmado.**
  `194290 SBLK/DRT25 POL` negro brillo · `194291 SDEMI-SBLK/DRT02 POL` carey ·
  `194292 D.BROWN-MBLK/DRT04 POL` marrón transparente · `194293 LPINK-MBLK/DRT03 POL` rosa
  transparente. Reemplazaron a los SKU de casa con un UPDATE, antes de que hubiera ventas.
  Peso 17,3 g confirmado. **Ojo con un superlativo que estuvo a punto de publicarse**: NO es el más
  liviano del catálogo (van Spell 12,6 · Biller 13 · Dearly 17,3 · Ardigan 17,3). Sí es el más
  liviano de los redondos de Rusty, que es lo que quedó escrito.

- [x] **2026-08-26 — Rusty Rew: la bisagra también es metálica con flex.** Confirmado. Ya está en su
  ficha, en la descripción, el callout y `hinge_system`. Se preguntó aparte del Ardigan a propósito:
  las placas viejas de los dos decían lo mismo, pero son modelos distintos y no se dio por hecho.

- [x] **2026-08-26 — Rusty Ardigan: medidas 145 / 52 × 51 / 19 / 140 mm, forma redonda y bisagra
  metálica con flex.** Geometría verificada: 52 × 2 + 19 = 123 ≤ 145.
  Dos cosas que salieron de esto: **tu placa vieja erraba otra vez** (decía varilla 133 y es 140 —
  cuarta de cuatro, después de Malice, Bruice y Cinema), y con el flex confirmado por vos ya se puede
  afirmar en la ficha, siempre atribuido a la BISAGRA y nunca al material.

- [x] **2026-08-26 — Rusty Ardigan: peso 17,3 g.** No hizo falta pedírtelo: está en tus propias placas
  viejas, y la regla dura 7 excluye las MEDIDAS pero permite expresamente el peso
  (*"Material, peso, color, precio y stock sí se pueden tomar de esas fuentes"*). Es el primer modelo
  de esta tanda que **no** va a `PESOS_A_MEDIR.md`.

- [x] **2026-08-26 — Rusty Rew: medidas 146 / 55 × 47 / 19 / 145 mm.** Geometría verificada:
  55 × 2 + 19 = 129 ≤ 146. Confirmaste el 55-19-145 en el que ya coincidían ML y tu placa vieja, y
  aportaste los dos que no daba ninguna fuente: **ancho total 146 y alto total 47**.
  Dato que salió de esto: tu "alto total" es del FRENTE, no del lente — la placa dibuja esa flecha
  abarcando todo el armazón. Se corrigió también la descripción del Cinema, que decía
  "lente 48 × 50 de alto" cuando el 50 es el alto total.

- [x] **2026-08-26 — Vulk Cinema: SKUs y catálogo oficial.** Pasaste las páginas del catálogo de
  Vulk. El modelo tiene 5 colorways y vos vendés 3:
  **MBLK/GREY POL = 956950** (negro mate, stock 8) y **L.PINK/G.GREY POL = 956953** (rosa claro,
  stock 1). La **terracota no tiene SKU**: es una variante que llegó con el color equivocado y te la
  quedaste, no figura en el catálogo. Se le puso el SKU de casa `CINEMA-TERRACOTA`, misma convención
  que `KATLEEN-MDEMI` y `SPELL-LGREY`. Las otras dos del catálogo que no tenés son CRY/G.GREY POL
  (956951) y BURDEOS/GB27 (956954, la única NO polarizada del modelo).
  Bonus del catálogo: confirma **48-22-135** de forma independiente, y aporta un dato que ML no
  tenía — **sistema de bisagras flexo**.

- [x] **2026-08-26 — Vulk Cinema: medidas 140 / 48 × 50 / 22 / 135 mm.** Calibre 48, puente 22,
  varilla 135, alto total 50, ancho total 140. La geometría cierra (2 × 48 + 22 = 118 ≤ 140). Acá tu
  placa vieja tenía bien el calibre, el puente y la varilla; se desviaba en el ancho total (decía
  139) y en el alto (decía 51). Las medidas de ML seguían siendo inservibles: una publicación
  declaraba varilla de 342,9 cm y otra 54-19-145.

- [x] **2026-08-25 — Bruice, puente 18 mm.** Se había cargado 16; al cruzarlo contra tu publicación
  y tu placa vieja apareció la diferencia y confirmaste 18 (el grabado del armazón estaba gastado y
  el 8 parecía un 6). Corregido en base, seed, placa y `alt_text`.
- [x] **2026-08-25 — Bruice MDEMI, stock 3 unidades.**
- [x] **2026-08-25 — Bruice receta, las 2 colorways de la publicación** (MBLK 957000 y CRY 957001).
- [x] **2026-08-25 — Malice, fotos de las 3 colorways.** Dejadas en `marketing/fotos/malice/`.
- [x] **2026-08-25 — Malice: G-Flex, bisagras metálicas con flex, UV400, categoría 3, cuadrado,
  hombre.**
- [x] **2026-08-25 — Malice, ancho de frente 139 mm** — salió de tu placa de medidas, que estaba
  dentro de la galería de MLA1430095941.
- [x] **2026-08-25 — Blozon completo sin pedirte nada**: fotos de las 4 colorways sacadas de tus
  propias publicaciones de ML.
- [x] **2026-08-25 — Malice: medidas 141 / 54 x 49 / 18 / 145 mm, peso 28,8 g y los 3 SKUs**
  (128902, 128900, 128901). ⚠️ Confirmaron que las que se habían leído de ML estaban mal: decían
  calibre 59 cuando es 54, y puente 16 cuando es 18.
- [x] **2026-08-25 — Blozon: medidas 147 / 53 x 48 / 19 / 140 mm y los 4 SKUs** (128810, 128811,
  128814, 128815). El calibre, el puente y la varilla coincidían con lo leído de ML; el ancho no —
  decía 142 y es 147.
- [x] **2026-08-25 — Zion: medidas 145 / 50 x 50 / 19 / 142 mm y peso 26,9 g.**
- [x] **2026-08-25 — Zion: patillas de metal con terminales de acetato hechas a mano.** Ese detalle
  no está en ninguna fuente; lo aportó el founder y se puso en la descripción y en el callout
  principal porque es un diferenciador de confort real.
- [x] **2026-08-25 — Zion: el SDEMI es DRT15 y su SKU es 128746**, el mismo que el fabricante usa
  para el UB14. Mismo aspecto, distinto lente.
- [x] **2026-08-25 — Confirmado que el SBLK/S10 del Blozon sí es polarizado**, aunque en la lista de
  SKUs venía escrito sin el "POL".
- [x] **2026-08-25 — Le Groupie: medidas 141 / 50 x 50 / 14 / 140 mm, peso 20 g y los 4 SKUs**
  (125265, 125263, 125264, 125261). Es el más liviano del catálogo.
- [x] **2026-08-25 — Los 8 materiales de patilla: todos G-Flex.** Con eso el catálogo quedó sin
  ningún producto sin ese dato.
- [x] **2026-08-25 — Zion es redondo, Malice es cuadrado y para hombre** (los dos ya estaban
  cargados así).
- [x] **2026-08-25 — El STEELBLUE del Bruice se llama "azul metálico"**, no azul acero translúcido
  ni celeste.
