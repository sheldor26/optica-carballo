# Assets del generador de placas

Fuentes usadas por `scripts/ml-placas.ts` para las placas de Mercado Libre.

| Archivo | Familia | Uso |
|---------|---------|-----|
| `fonts/ArchivoBlack-Regular.ttf` | Archivo Black | Callouts amarillos y banda de la placa de lentes |
| `fonts/DMSans-Variable.ttf` | DM Sans | Números de la plantilla de medidas del founder |
| `fonts/Anton-Regular.ttf` | Anton | Alternativa condensada (disponible, hoy sin uso fijo) |

Los textos de la placa de garantía usan **Manrope**, la tipografía del sitio.

## Por qué DM Sans para las medidas

La plantilla `marketing/medidas.png` viene dibujada con la palabra "mm" ya puesta y el número
vacío, y su tipografía es la de Canva (propietaria, no distribuible). Se compararon 17 familias
contra un recorte del "mm" de la plantilla, normalizando por altura de x y midiendo error de
píxeles más penalización por proporción: DM Sans 400 fue la más cercana. A tamaño real el número
y el "mm" de la plantilla se leen como una sola tipografía.

## Licencia

Ambas fuentes son SIL Open Font License 1.1:

- Anton — Copyright 2020 The Anton Project Authors (https://github.com/googlefonts/AntonFont)
- Archivo Black — Copyright 2017 The Archivo Black Project Authors (https://github.com/Omnibus-Type/ArchivoBlack)
- DM Sans — Copyright 2014-2024 The DM Sans Project Authors (https://github.com/googlefonts/dm-fonts)

## Por qué están acá y no sólo instaladas

En macOS, librsvg (el motor que usa sharp para rasterizar el SVG de las placas)
resuelve las familias tipográficas por CoreText, no por fontconfig: apuntar
`FONTCONFIG_FILE` a esta carpeta **no** alcanza, la fuente tiene que estar
registrada en el sistema. El script copia lo que falte a `~/Library/Fonts` la
primera vez que corre, así el repo sigue siendo la fuente de verdad.
