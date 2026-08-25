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

Última revisión: 2026-08-25.

---

## 🔴 Le Groupie — medidas, peso y SKUs · Blozon — peso

- [ ] **Medidas del Vulk Le Groupie** — ancho de frente, calibre, alto total, puente y varilla. La
  ficha está publicada sin el bloque de medidas. El fabricante publica una placa y ML declara los
  atributos, pero ninguna de las dos fuentes vale.
- [ ] **Peso del Le Groupie** (gramos).
- [ ] **Peso del Blozon** (gramos). Es lo único que le falta.
- [ ] **SKUs de fabricante del Le Groupie.** Hoy están con códigos inventados
  (`LEGROUPIE-388-CH74`, etc.). Ninguna publicación declara `SELLER_SKU`.
- [ ] **Zion — forma: ¿redondo u ovalado?** Los atributos dicen "Ovalada", tu título dice
  "Redondos" y las fotos parecen redondas. Se cargó `redondo`.

## 🟡 Pesos que faltan — 17 productos

Ninguno bloquea nada: la ficha se ve bien sin el peso. Pero es el dato que más preguntan para un
anteojo de uso diario, y conviene hacerlos todos juntos con la balanza en una sola sentada.

**Anteojos de sol**

- [ ] Rusty And Now
- [ ] Rusty Bruk
- [ ] Rusty CCCP
- [ ] Rusty Eslav
- [ ] Rusty Esvep
- [ ] Rusty Blozon
- [ ] Vulk Le Groupie
- [ ] Rusty Play
- [ ] Rusty Sotion
- [ ] Rusty Terdey
- [ ] Rusty Yau
- [ ] Vulk Arvin
- [ ] Vulk Deserve
- [ ] Vulk Disarn
- [ ] Vulk Reporter

**Armazones de receta**

- [ ] Rusty Woxi Optics
- [ ] Vulk Tour 81

---

## 🟡 Material de las patillas — 8 productos

Está cargado el material del frente pero no el de las patillas. En varios modelos son distintos
(frente de acetato con patillas de metal, por ejemplo), así que no se puede asumir.

- [ ] Rusty Bruice *(sol — el frente es G-Flex, ¿las patillas también?)*
- [ ] Rusty Feeled
- [ ] Rusty Yau
- [ ] Rusty R-CY 02 Optics
- [ ] Rusty Woxi Optics
- [ ] Vulk Day Light
- [ ] Vulk Stray
- [ ] Vulk Yamain

---

## 🔵 Decisiones tuyas (no son datos, son criterios)

- [ ] **Rusty Malice, forma**: lo cargué como `cuadrado` porque me lo dijiste, pero **"cuadrado" no
  tiene faceta de forma en el sitio** — sólo existen wayfarer, aviador, cat-eye y rectangular. Hoy
  el Malice no entra a ninguna faceta de forma. Opciones: dejarlo así, cargarlo como `rectangular`
  (que es lo que dicen dos de tus tres publicaciones), o crear la faceta `cuadrado`.
- [ ] **Rusty Malice, género en ML**: el sitio dice hombre porque me lo dijiste, tus publicaciones
  dicen `GENDER = "Sin género"`. Conviene alinearlas.
- [ ] **Rusty Bruice, forma en ML**: el sitio dice aviador, tu publicación dice
  `FRAME_SHAPE = "Anteojo Cuadrado"`. Mismo caso.
- [ ] **Vulk Bruice STEELBLUE, nombre del color**: vos lo llamaste "celeste brillo translúcido" y lo
  cargué como **azul acero translúcido**, que es lo que dicen tu publicación de ML ("Anteojo Azul
  Acero Transparente"), el nombre del fabricante (STEELBLUE) y la foto. Si preferís "celeste", lo
  cambio.
- [ ] **49 publicaciones de ML con medidas que no coinciden** con lo que está cargado en el sitio
  (74 atributos en total, mediana de diferencia 5 mm). Se listan con `pnpm ml:medidas`. Para
  corregirlas hace falta tu medición, porque en varios casos no se sabe cuál de los dos números es
  el bueno. Ya pasó una vez con el puente del Bruice: tu dato viejo decía 18 y el nuevo 16, y el
  correcto era 18.

---

## ✅ Recibido y cargado

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
