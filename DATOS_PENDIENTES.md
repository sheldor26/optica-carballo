# Datos que faltan — para pasar a Claude

Lista viva de lo que Juan tiene que medir, pesar o confirmar para poder cerrar cargas del catálogo.

**Cómo se usa**: Juan pregunta "¿qué me falta pasarte?" y sale de acá. Cuando pasa un dato, se
marca `[x]`, se carga a la base y se anota la fecha. Nada se borra: la lista de hechos sirve para
ver qué se cerró.

**Cómo se llena**: cada vez que una carga queda incompleta porque falta un dato del founder, se
agrega acá **en el mismo turno**, con qué bloquea. Si un dato no bloquea nada, va igual pero en la
sección amarilla.

Última revisión: 2026-08-25.

---

## 🔴 Bloqueando ahora — Rusty Malice

El producto ya está publicado y vendible, pero **sin el bloque de medidas** en la ficha. Un
comprador usa esas medidas para saber si el anteojo le entra.

- [ ] **Ancho total del frente** (mm). No está declarado en ninguna de tus publicaciones de ML.
- [ ] **Peso** (gramos).
- [ ] **Alto del lente: ¿41 o 59 mm?** Dos de tus publicaciones dicen 4.1 cm y una dice 5.9 cm.
  El 5.9 parece copiado del ancho del lente, que también es 5.9 — pero decidilo vos mirando el
  armazón.
- [ ] **SKUs de fabricante de las 3 colorways** (opcional). Ninguna publicación declara
  `SELLER_SKU`, así que hoy están cargadas con códigos inventados
  (`MALICE-MBLK-S10-POL`, `MALICE-SBLK-S10-POL`, `MALICE-MBLK-REVO-BLUE`). Funcionan, pero si
  tenés los reales conviene usarlos.

Ya tengo, de tus propios atributos de ML: calibre **59**, puente **16**, varilla **155**.

Con eso cierro: cargo `measurements`, genero la placa de medidas y la subo.

---

## 🟡 Pesos que faltan — 16 productos

Ninguno bloquea nada: la ficha se ve bien sin el peso. Pero es el dato que más preguntan para un
anteojo de uso diario, y conviene hacerlos todos juntos con la balanza en una sola sentada.

**Anteojos de sol**

- [ ] Rusty And Now
- [ ] Rusty Bruk
- [ ] Rusty CCCP
- [ ] Rusty Eslav
- [ ] Rusty Esvep
- [ ] Rusty Malice *(también en la lista roja de arriba)*
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
