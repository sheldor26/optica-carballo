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

## 🔴 Malice y Blozon — medidas, peso y SKUs

**Las fichas están publicadas SIN el bloque de medidas.** Se habían cargado leyéndolas de las placas
viejas que están dentro de las galerías de ML, y el founder marcó que eso no vale: no confía en esas
fuentes porque tienen errores. Se sacaron de la base, del seed y de la ficha, y la placa de medidas
se despublicó. Quedan así hasta que él las pase.

- [ ] **Medidas del Malice** — ancho de frente, calibre, alto de lente, puente y varilla.
- [ ] **Medidas del Blozon** — las mismas cinco.
- [ ] **Peso de los dos** (gramos).
- [ ] **SKUs de fabricante de los dos.** Ninguna publicación declara `SELLER_SKU`, así que están
  cargados con códigos inventados (`MALICE-MBLK-S10-POL`, `BLOZON-SBLK-S10-POL`, etc.). Funcionan,
  pero conviene usar los reales.

Cuando lleguen, se cargan en los cuatro lugares donde vive una medida: `attributes.measurements`,
el texto de la descripción, la placa de medidas (`pnpm placas --solo 4`, subida con nombre nuevo) y
el `alt_text` de esa imagen en el formato que parsea `scripts/ml-auditar-medidas.ts`.

**Para referencia, NO para cargar** — esto es lo que dicen las otras fuentes, por si te sirve
comparar cuando midas. Ojo que los dos largos de varilla no coinciden entre sí:

| | Malice | Blozon |
|---|---|---|
| Ancho de frente (placa vieja) | 139 | 142 |
| Calibre (atributos ML) | 59 | 53 |
| Alto de lente (atributos ML) | 41 | 42 |
| Puente (atributos ML) | 16 | 19 |
| Varilla — placa vieja | 145 | 137 |
| Varilla — atributos ML | 155 | 140 |

## 🟡 Pesos que faltan — 17 productos

Ninguno bloquea nada: la ficha se ve bien sin el peso. Pero es el dato que más preguntan para un
anteojo de uso diario, y conviene hacerlos todos juntos con la balanza en una sola sentada.

**Anteojos de sol**

- [ ] Rusty And Now
- [ ] Rusty Bruk
- [ ] Rusty CCCP
- [ ] Rusty Eslav
- [ ] Rusty Esvep
- [ ] Rusty Malice
- [ ] Rusty Blozon
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
  propias publicaciones de ML, y ancho de frente 142 mm de tu placa en la galería de MLA1755867522.
