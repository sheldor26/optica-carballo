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

- [ ] **Razón social y domicilio fiscal.** El **CUIT ya lo pasaste** el 2026-08-26
  (20-16852182-1, cargado y validado por dígito verificador), pero los términos y condiciones
  siguen con `[A CONFIRMAR]` en estos dos.

  ⚠️ **Dato para confirmar**: el CUIT arranca en **20**, o sea que es de una **persona física
  masculina**, no de una sociedad. Si la óptica factura a nombre de una persona, la "razón social"
  es el nombre y apellido de esa persona — confirmame cuál es. Y el domicilio fiscal puede no ser el
  del local.

  **Qué bloquea**: el art. 8 de la Ley 24.240 exige identificar al vendedor en las ventas por
  catálogo publicadas por cualquier medio, y el sitio ya publica precios.


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

## 🔄 Mormaii Vesubio RX (receta aviador) — alta en ML + página, seed 155 escrito pero NO aplicado (2026-10-02)

**Estado**: seed 155 APLICADO el 2026-10-02. Quedan sólo los datos que no bloquean la carga (peso, altura
útil del aro, plaquetas, níquel, criterio de progresivos con la regente).

- [x] **Link de ML**: pasado y cargado (Col.01 MLA4021586886, Col.03 MLA4021560698, 3 y 3 unidades).
- [x] **Precio**: $118.843 (confirmado por el founder 2026-10-02).
- [x] **Género**: unisex (confirmado por el founder 2026-10-02).
- [x] **Lente demo**: trae lente demo de plástico, sin graduar (confirmado 2026-10-02).
- [ ] **Peso del armazón** (balanza). No bloquea la carga. Sin peso no se puede decir "liviano" con
  respaldo (sólo "poliamida") ni se carga el casillero.
- [ ] **Altura útil real del aro** (sin la barra superior del doble puente), para saber si se puede
  recomendar progresivos sin reparos. Hoy el sitio los menciona como recomendación (te asesoramos), no
  como "cualquier lente".
- [ ] **Confirmar con María Carlota (regente)** el criterio de armado de progresivos con bisagra
  integrada y doble puente.
- [ ] **Plaquetas del puente nasal** (ajustables o fijas) y **si las patillas de metal son libres de
  níquel**. No se afirma nada de eso hasta tener el dato.

## 🔄 Rusty K13 (receta infantil) — en carga, seed 130 pendiente

Segundo producto infantil, casi gemelo del K12. Medidas confirmadas por grabado físico: calibre
45mm, puente 14mm, varilla 132mm, alto 32mm, ancho total 119mm, peso 15,7g. 2 colores: C2 azul
oscuro (SKU 969521), C3 rosa translúcido (SKU 969522).

- [ ] **El grabado que confirma las medidas (45-14-132) se leyó en la unidad C3.** Se está asumiendo
  que C2 comparte exactamente la misma geometría por ser el mismo molde con otro color (razonable,
  `optical-expert` lo valida como asunción de manufactura normal) — pero si tenés la unidad C2 a
  mano en algún momento, no estaría de más confirmar el grabado ahí también. No bloquea la carga.

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

## ✅ Vulk The Trial — CERRADO el 2026-08-31

Se había anotado porque los seeds decían "Medidas (de la FOTO)" y el Trial es el único armazón de
receta del catálogo con **varilla de 150 mm**, así que la recomendación dependía de ese número.
**El founder confirmó que verificó personalmente todos los modelos del sitio**, así que el 150 vale
y no hay nada que medir. La ficha se puede recomendar por la varilla sin asterisco.

## ✅ Vulk Anima (sol) — CERRADO el 2026-09-28 (medidas)

5 colorways con stock real, repartidas en 3 publicaciones de ML (`MLA1423816283`, `MLA1872525930`,
`MLA1423919123`), $95.108 uniforme, cuadrado grande G-Flex, mujer, ninguna polarizada, cat 3 UV100%
confirmado. Slug `vulk-anima`.

- [x] **Medidas físicas.** Pasadas por vos el 2026-09-28: calibre 53 / puente 10 / varilla 145 /
  alto 60 / ancho total 150mm. Cargadas (seed 117) + placa de medidas generada y subida.
- [ ] **Talle.** El fabricante no lo declara para este modelo (otros "cuadrado grande" G-Flex como
  Deserve sí dicen "large") — no se cargó dato de talle, no bloquea.

Segundo producto Mormaii. 6 colorways identificadas contra `MLA1538614840`, $116.024,04, todas
polarizadas UV400 cat 3, envolvente deportivo, hombre. Calibre 57 / puente 16 / ancho 135 / varilla
124 y lente base 8 **confirmados por vos**, con la salvedad de que me dijiste que la fuente es la
ficha del fabricante (no tu propia medición) y que para Mormaii la considerás más confiable que
Vulk/Rusty — excepción a la regla dura 7 que tomaste vos explícitamente, no algo que yo asumí.

- [ ] **Alto total del frente.** Ni el fabricante ni tu mensaje lo tienen — no está en ningún lado
  todavía. El bloque de medidas se carga con las otras 4 claves nomás, sin este dato.
- [ ] **SKUs reales de fábrica, si los tenés.** Ninguna de las 6 variantes trae `seller_sku` en ML,
  así que se cargaron con SKU de casa (`STORM-NBR-GRIS`, `STORM-C05-AZUL`, etc. — patrón ya usado en
  Rusty Rew). No bloquea la carga, pero si tenés los códigos reales del fabricante, pasámelos antes
  de que haya ventas — después hay que hacer un `UPDATE` con cuidado porque el SKU es la llave de
  idempotencia del seed.

## ✅ Mormaii Moorea Rx (armazón) — CERRADO el 2026-09-22

**Primer producto de la marca Mormaii en el catálogo.** 7 colorways, publicación de ML
multivariación ya viva (MLA1550157394): 01 negro brillo (stock 2), 02 negro mate/gris (0), 06
negro-azul/turquesa (0), 05 transparente/negro jaspeado (0), 08 negro mate/celeste (1), 04
gris degradé turquesa (0), 09 gris mate/naranja (1). Precio uniforme $111.030.

- [x] **Medidas — RECIBIDAS el 2026-09-22: 55-17-131, ancho total 139mm, alto total 43mm.**
  Confirma otra vez el patrón ya visto en Bad Card/Blozon/Zion: el grabado de la varilla y el
  diagrama del distribuidor acertaban calibre/puente/varilla (55-17-131) pero erraban los dos
  números que hay que medir de verdad — el diagrama decía ancho 135 (real 139) y no declaraba alto
  (real 43). Geometría: 55×2 + 17 = 127 ≤ 139 ✓.
- [x] **Material — CORREGIDO: "Inyección" (`frame_material: injected`), no grilamid.** Juan lo
  llamó explícito "Inyección" — coincide con el atributo `MATERIAL` de ML, pero **contradice** lo
  que se había inferido de una placa de callouts vieja del founder que decía "ARMAZÓN DE
  GRILAMIDA". Se descarta esa placa vieja como fuente y se usa la palabra que dio Juan ahora,
  que además coincide con un valor de enum real (`injected` → "Inyectado") nunca antes usado en el
  catálogo.
- [x] **Bisagras — CONFIRMADO: metálicas con flex, sistema "Visyfit"** (nombre de marca del
  mecanismo, dato nuevo que no tenía ninguna fuente previa).
- [x] **Género — CORREGIDO: hombre, no unisex.** Juan lo describió como "diseño semi envolvente
  deportivo masculino" — contradice `GENDER=Sin género` / `FILTRABLE_GENDER=Mujer,Hombre` de ML.
  Gana la palabra de Juan (mismo criterio que el Harry, donde ML también se ignoró a favor del
  founder).
- [x] **Forma — CORREGIDA: envolvente (semi), no rectangular puro.** Juan dijo "semi envolvente
  deportivo" — contradice `SHAPE=Rectangular` de ML y la lectura visual inicial (que había leído
  el lente como rectangular clásico sin curva). Es el primer armazón de RECETA envolvente del
  catálogo (hasta ahora esa forma sólo existía en sol — ver comentario en `brand-filters.ts`).
- [ ] **Peso — no lo pasó.** No bloqueó la carga (mismo criterio que Vriviant, cargado "sin peso"
  esta misma sesión): `weight_grams` queda ausente del jsonb hasta que lo pese. Sin comparativos de
  peso en la ficha hasta entonces.
- [x] **Compatibilidad de receta — CONFIRMADA: monofocal, bifocal y progresivo.** Con la advertencia
  aparte de que en graduaciones positivas altas o con astigmatismo relevante la curvatura del
  armazón puede generar molestias — va como callout de advertencia, redactado con `optical-expert`
  antes de publicar (trigger automático del CLAUDE.md, afirmación técnica óptica).
- [x] **Regla de marca para TODO Mormaii, no sólo este producto**: incluye estuche **semi rígido**
  (no el genérico), franela **de Mormaii** (con logo/marca, no franela genérica), y 1 año de
  garantía del fabricante. Guardado en `BRANDS.md` para que no haya que repetirlo en la próxima
  carga Mormaii.

## 🔵 Rusty Gover (armazón) — en carga, faltan 2 datos tuyos (2026-08-31)

**5 colores, 17 unidades** (el cruce decía 8/30: tres publicaciones sueltas comparten pozo de stock
con variaciones de la multi). Cry 5 · MBLU 4 · MBLK 4 · L.GREY 4 · SBLK 0. Precio uniforme $82.745.

✅ **Ya resuelto sin vos, de `rustyoptical.com/optical/fw22/gover`**: SKU CRY-SBLK 113104, MBLK
113106, LGREY 113107, MBLU 113109 · **peso 23 g** · frente y patillas **G-Flex** · **bisagras con
sistema flexo**. ML no declara absolutamente nada de este modelo.

- [x] **Medidas — RECIBIDAS el 2026-08-26**: **50-22-145**, alto total **47 mm**, frente **143 mm**.
  Cargadas en la base y en el seed 106. Resolvieron la contradicción que había: tu medición coincide
  con el revendedor en calibre/puente/varilla y con el fabricante en el frente, o sea que cada
  fuente tenía razón en una parte y ninguna estaba completa. Geometría consistente: 50×2 + 22 = 122
  ≤ 143. La placa de medidas ya se genera.
- [ ] **La forma.** Comparado contra el Peating (cuadrado), el Woxi (rectangular) y el Patien
  (wayfarer) del propio catálogo, es un **cuadrado de esquinas redondeadas**; tu título de ML también
  dice "Cuadrado". Confirmalo con el armazón en la mano.
- [ ] **Las fotos del SBLK negro brillo.** Las dos que trae tu publicación se ven **mate, iguales a
  las del MBLK**, y el SBLK debería ser brillo. Como está en 0 unidades, lo voy a cargar **sin fotos
  propias** salvo que me digas otra cosa. Si tenés fotos del brillo de verdad, pasámelas.

⚠️ **Aviso**: la ficha del fabricante dice **"Lentes: Blue Cut"**. Son lentes demo y **no se va a
vender como beneficio** — el filtro azul no tiene evidencia clínica robusta y la regla dura 4 obliga
a decirlo. Si querés que la ficha lo mencione, se menciona como dato del armazón, no como ventaja.

## ✅ Rusty Bruice 669K/UV-N40 — CARGADA el 2026-09-22

Quinta variante del Bruice (ya hay 4 cargadas). SKU **968191**, armazón **gris transparente**, lente
**celeste degradé**, **no polarizado**. Fotos del fabricante bajadas y verificadas; set completo de
placas generado para **ML (1500×1500)** y para el **sitio (2000×1333)** en
`marketing/placas-producto/rusty-bruice-669k/`.

- [x] **Stock y precio** — resueltos: publicaste MLA3981448012 y de ahí salieron **3 unidades** y
  **$84.354**.

- [ ] **¿El Bruice de sol acepta lentes graduadas?** La plantilla de placas lo afirmaba por defecto
  y **lo saqué**: la ficha del Bruice no lo dice en ningún lado y el único producto del catálogo que
  lo afirma es el Vulk Biller. Es promesa de compra y depende de la curva base. Si me confirmás que
  sí, regenero la placa 05 que quedó fuera del set.
- [x] **Publicación mapeada** — MLA3981448012, sincroniza stock y precio normalmente.

**Dato aparte**: la página del fabricante lista una **sexta variante** que tampoco está cargada —
`STEELBLUE/CRY-GS16`, SKU **957007**. No tiene fotos publicadas (404). Si la tenés en la óptica,
avisá.

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

## Reef 128 Yin (sol, seed 156, 2026-10-03)

- [x] **2026-10-03 — Medidas confirmadas por el founder: calibre 66, puente 17, patilla 110** (más ancho total 138 y alto total 46). Reemplazan las 67/114 de la marca.
- [x] **2026-10-03 — Forma: envolvente deportivo. UV400 en todos los anteojos de sol Reef. Bisagras con sistema flex. Lente gris oscuro en 017 y 018.**
- [ ] **Categoría del filtro del lente** (grabado de la varilla): sin dato, `lens_category` queda vacío. Bloquea: mostrar "categoría 3" y cualquier claim de categoría.
- [ ] **Peso** (balanza). Bloquea: `weight_grams` y cualquier claim de liviano.
- [ ] GTIN de la 011: sin unidad física, sólo figura en ML.
- [ ] En ML (lado del founder): re-subir las placas 03, 04 y 06 de los 8 colores; ficha "policarbonato"→TAC y "armazón de aluminio"→patillas de aluminio; ancho total 140→138; fotos propias de frentes (hoy sólo laterales de la marca).
- [ ] Confirmar de quién es la garantía de 1 año (fabricante u óptica) para el copy.

## Reef 129 Yang (sol, seed 157, 2026-10-03)

- [x] **2026-10-03 — Confirmado por el founder:** envolvente, UV400, categoría 3, bisagras metálicas con sistema flex, género hombre, medidas 66-16-110, alto de lente 43, ancho total 140.
- [ ] **GTIN de las cajas 011 a 016** (no hay en ningún doc; no derivarlos del 128). Bloquea: `gtin` por variante y schema.org.
- [ ] **Confirmar los nombres de color** (deducidos de las fotos de la marca): sobre todo si 013 y 014 son realmente distintas (ML dice 014 = frente gris oscuro mate) y si 012 es "plateado mate".
- [ ] **Peso** (balanza). Bloquea: `weight_grams` y cualquier claim de liviano.
- [ ] En ML (lado del founder): re-subir las placas de las 6 variaciones (`marketing/placas-ml/RESUBIR-reef-129/`); revisar que la ficha diga TAC y no "policarbonato"; fotos propias de frentes.

## Reef 177 Aerial (sol, 2026-10-05)

- [x] **2026-10-05 — Confirmado por el founder:** medidas 64-17-124, alto de lente 47, ancho total 143; envolvente deportivo, categoría 3, hombre, UV400; GTIN de las 4 variantes (C15 7790394208818, C09 7790394182163, C07 7790394164299, C11 7790394191141); C15/C07/C11 polarizados con AR interno; C09 espejada azul con AR interno.
- [~] **Fotos del 177:** el founder indicó usar las de Óptica Paesani (sólo perfil; la C07 comparte foto con la C11). Pendiente su visto bueno a las placas. Siguen sin existir fotos de frente ni fotos propias de las unidades.
- [x] **2026-10-05 — Bisagras: metálicas, sin flex** (confirmado por el founder).
- [ ] **Confirmar que la C09 NO es polarizada** (ML dice que no). Bloquea: `polarized` de esa variante y si el producto puede decir "polarizado" en título/H1.
- [ ] Peso (balanza). Bloquea: `weight_grams` y claims de liviano.
- [x] **2026-10-05 — Ancho total 143 confirmado por el founder** (la geometría plana 2×64+17=145 no aplica a un envolvente).
- [x] **2026-10-05 — C09 NO es polarizada** (confirmado por el founder).

## Reef 188 Octopus (sol, 2026-10-05)

- [x] **2026-10-05 — Confirmado por el founder:** envolvente, bisagras plásticas reforzadas, cat 3, UV400; C08 negro brillo polarizada con AR; C09 marrón brillo polarizada con AR; C14 negro mate sin polarizado ni AR; medidas 66-14-134, alto de lente 47, ancho total 141.
- [x] **2026-10-05 — C09 publicada en ML:** MLA2154432869, $154.370, stock 1, GTIN 7790394181722 (la gemela de catálogo MLA4031298022 se ignora).
- [x] **2026-10-05 — Género: hombre.**
- [x] **2026-10-05 — C14: lente gris oscuro, NO espejado.** El founder decidió usar la foto de la marca igual y no decir revo/espejado/azul para el lente. Pendiente opcional: foto propia de la unidad si algún día la quiere.
- [ ] Peso (balanza). Bloquea: `weight_grams` y claims de liviano (ML dice "liviano" en un título: no copiar).
- [x] GTIN de las 3: C08 7790394181715, C09 7790394181722, C14 7790394233278 (de ML).

## Reef 196 Reunión (sol, 2026-10-05) · CARGADO (seed 160)

- [x] **2026-10-05 — Confirmado por el founder:** cuadrado tipo wayfarer, unisex, bisagras plásticas reforzadas, UV400 y cat 3; medidas 56-19-137, altura total 49, ancho total 144; C10 negro brillo polarizado con AR; C11 negro mate polarizado con AR; C02 negro mate sin polarizar con AR interno (usa fotos de la C11).
- [x] **C02 en ML (2026-10-05):** subida como item aparte MLA4031305848 ($132.690, stock 2, GTIN 7790394181371, lente gris oscuro).
- [ ] GTIN de la C10 y la C11 (ML no los devuelve en las variaciones; el de la C02 ya está). Bloquea: nada, se carga sin `gtin`.
- [x] Lente de la C02: gris oscuro (ML, 2026-10-05).
- [ ] Peso. Bloquea: `weight_grams` y claims de liviano.

## Reef 193 Tortuga (sol, 2026-10-05)

- [x] **Confirmado por el founder:** cuadrado, hombre, UV400, cat 3, bisagras metálicas sin flex; 59-17-131, ancho total 144, altura de lente 52; AR interno en las 3; C11 negro mate polarizado, C2 negro mate espejado azul NO polarizado, C12 marrón polarizado.
- [x] **Foto del C11 (negro MATE):** la marca sólo tiene el 0007 (negro BRILLO); el founder ya la usa en ML, se usa igual en el sitio (2026-10-05). Si consigue la de mate, reemplazar.
- [x] **Publicado en ML (2026-10-05):** C11 MLA2155221487, C12 MLA2155221489, C2 MLA4032299650, con GTIN de las 3.
- [ ] Color del lente del C11 (se asume gris oscuro; el de ML dice solo "C11 - Negro Mate").
- [ ] Peso. Bloquea: `weight_grams` y claims de liviano.

## Reef 183 Bolero (sol, 2026-10-05)

- [x] **Confirmado por el founder:** 60-17-139, cuadrado deportivo, hombre, cat 3, UV400, bisagra metálica sin flex; sólo stock del C11 espejado azul, AR interno, sin polarizar.
- [ ] **Ancho total 148 / altura 49:** el mensaje decía "altura total 148, ancho total 49" (cruzados). Confirmar. Bloquea: medidas del seed y de la placa.
- [x] **Publicación de ML del C11 (2026-10-06):** MLA4034472062, $160.590, stock 3. **GTIN:** el que tiene (7791394273622) es el de la C2 del 193, probablemente copiado: confirmar el correcto. Bloquea: sólo el `gtin` del seed.
- [x] **Foto del C11 (2026-10-06):** la de Paesani (1200 px), placas hechas. Si el armazón real no es el de esa foto, avisar.
- [x] **Color/foto del C11 (2026-10-06):** negro mate con la foto de su publicación de ML (corregido; la de Paesani era otro armazón).
- [ ] Peso. Bloquea: `weight_grams` y claims de liviano.
- [x] **Color del armazón del C11:** negro mate (ML, 2026-10-06).
- [x] **Foto del C11 (2026-10-06):** el C11 es negro mate liso (rediseño del que era camuflado): se mantiene la foto de su publicación de ML.
- [ ] **Antirreflejo de C07, C09, C08 y C10:** el founder no lo sabe hasta tener los anteojos en la mano (2026-10-06); hoy no se afirma. Bloquea: sólo el copy de esas variantes.
- [ ] **Stock de C07, C09, C08 y C10** cuando reingrese: se sincroniza solo desde ML; revisar el title/meta de la ficha (ver SEO_STRATEGY).
- [x] **Medidas de C07, C09, C08 y C10 (2026-10-06):** las mismas del C11, confirmado por el founder.
- [ ] **Nombres de color de las 4 variantes viejas:** C09 "negro mate con detalle naranja", C08 "marrón transparente", C10 "gris oscuro transparente" son lo que se ve en la foto; ML las llama "Negro Mate", "Marrón" y "Gris Oscuro Transparente". Confirmar. Bloquea: sólo la etiqueta del selector.
- [x] **GTIN del C11 del 183 (2026-10-06):** 7791394273622 confirmado por el founder (cargado en Cloud y en el seed 162; coincide con el de la C2 del 193).

## Reef 155 Ali (sol, 2026-10-06)

- [x] **Confirmado por el founder:** clásico cuadrado hombre, bisagras plásticas, UV400, cat 3, inyección/policarbonato; 55-18-136, altura 44, ancho 139; C25 negro mate pol + AR, C24 negro mate + AR no pol, C14 espejado azul + AR no pol, C07 frente negro brillo/patillas rojas + AR no pol; lente gris oscuro salvo el espejado.
- [x] **Links de ML (2026-10-06):** C07, C01, C14, C24, C18 y C20 pasados por el founder; las publicaciones siguen pausadas (las activa después y el stock se sincroniza). Falta el link de la **C25** (asumida MLA1388774515 por GTIN).
- [x] **Marrón (2026-10-06):** la polarizada, ML `MLA1422986079` (0020; el founder la escribió "C02").
- [ ] **C25 vs "024 polarizado" de ML:** la publicación vieja MLA1388774515 se llama 024 pero es polarizada (GTIN 7791394253501); confirmar que es la C25. Bloquea: el mapeo C25.
- [ ] Peso. Bloquea: `weight_grams` y claims de liviano.
- [ ] **Antirreflejo de C18 (negro brillo pol) y C20 (marrón pol):** sin dato; no se afirma. Bloquea: sólo el copy de esas dos.
- [ ] **Placas de ML de C01, C18 y C20** cuando las active (las de C25/C24/C14/C07 ya están en `SUBIR-reef-155/`).

