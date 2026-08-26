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

## ✅ No queda nada bloqueando

Los 78 productos activos del catálogo tienen **medidas y material de patillas completos**. No hay
ninguna ficha incompleta.

Lo único que falta son **16 pesos**, y están en una lista aparte para hacerlos con la balanza:
👉 **[PESOS_A_MEDIR.md](PESOS_A_MEDIR.md)**

---

## 🔵 Decisiones tuyas (no son datos, son criterios)

- [ ] **Rusty Malice, forma**: lo cargaste como `cuadrado`, pero **"cuadrado" no tiene faceta de
  forma en el sitio** — sólo existen wayfarer, aviador, cat-eye y rectangular. Hoy el Malice no
  entra a ninguna faceta de forma. Opciones: dejarlo así, pasarlo a `rectangular`, o crear la
  faceta `cuadrado`. Lo mismo aplicaría al Blozon, que también es cuadrado.
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
