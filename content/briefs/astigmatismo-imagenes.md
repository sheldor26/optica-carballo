# Prompts de imágenes — Guía Astigmatismo (`/guias/astigmatismo`)

> Prompts para generar con IA las imágenes de la pillar de Astigmatismo. Cada
> una con su ubicación en el artículo + alt text SEO. Generar SIN texto adentro
> (la IA escribe mal); los rótulos se agregan en diseño después. Las imágenes
> van al bucket `article-images` (subcarpeta `guias/`) y se cablean al MDX.
> Activos originales = E-E-A-T + linkables (ARTICLE_SEO_STANDARD §6).

## Estilo base (usar en TODAS para consistencia)

**Estilo A — Diagramas/ilustración** (imágenes 1, 2, 4, 5):
> Ilustración editorial médica limpia y moderna, estilo vectorial plano con
> sombras muy suaves, fondo off-white/beige claro uniforme, paleta sobria y
> cálida con UN solo color de acento, mucho espacio negativo, trazo fino y
> prolijo, look premium de marca de salud, alta nitidez. SIN texto, SIN números,
> SIN logos, SIN marcas de agua.

**Estilo B — Simulación fotográfica** (imagen 3):
> Fotografía realista, nítida, iluminación natural, sin texto ni marcas.

⚠️ **Riesgo IA**: las #2 y #5 son diagramas de óptica (rayos de luz) — la IA
suele equivocar dónde enfoca la luz. Revisar contra la realidad o iterar.

---

## 1. Hero del artículo (cabecera)
**Ubicación**: `heroImage` del frontmatter. **Aspect**: 1200×630 (16:9).
**alt**: "Ilustración de un ojo con astigmatismo y un par de anteojos"
**Prompt**:
> [Estilo A]. Composición limpia y premium: un ojo humano estilizado de perfil
> tres cuartos junto a un par de anteojos modernos de armazón fino, sugiriendo
> corrección visual. Centrado, mucho aire alrededor, fondo beige claro liso.
> Elegante, calmo, profesional. Sin texto.

## 2. Cómo enfoca el ojo: normal vs astigmatismo  ⚠️ (óptica)
**Ubicación**: dentro de "## Qué es el astigmatismo". **Aspect**: 4:3 o 16:9.
**alt**: "Comparación entre una córnea redondeada normal y una córnea ovalada con astigmatismo"
**Prompt**:
> [Estilo A]. Diagrama comparativo lado a lado de dos ojos en corte transversal.
> IZQUIERDA (ojo normal): córnea perfectamente redondeada, como una esfera; los
> rayos de luz entran y convergen en UN único punto nítido justo sobre la retina.
> DERECHA (ojo con astigmatismo): córnea con forma más ovalada/alargada (como una
> pelota de rugby en vez de una de fútbol); los rayos de luz se enfocan en DOS
> puntos distintos, no en uno solo, dando una imagen borrosa. Limpio, didáctico,
> simétrico. Sin texto ni etiquetas.

## 3. Cómo se ve con astigmatismo (simulación de noche)
**Ubicación**: dentro de "## Cómo se ve con astigmatismo". **Aspect**: 16:9 wide.
**alt**: "Calle de noche vista con visión normal y vista con astigmatismo, con halos en las luces"
**Prompt**:
> [Estilo B]. Misma escena nocturna de una calle de ciudad con luces de autos,
> semáforos y carteles, mostrada como díptico lado a lado. IZQUIERDA: vista
> nítida y normal. DERECHA: la misma escena tal como la ve alguien con
> astigmatismo, con las luces "estiradas" en rayas/destellos y halos saliendo de
> cada punto de luz, leve distorsión general, bordes poco definidos. Realista,
> mismo encuadre en ambos lados. Sin texto.

## 4. Test del abanico astigmático
**Ubicación**: dentro de "## Síntomas" o "## Cómo se ve". **Aspect**: 1:1 cuadrada.
**alt**: "Test del abanico astigmático: líneas radiales que salen de un centro"
**Prompt**:
> [Estilo A], fondo blanco puro. Patrón de test óptico clásico: líneas rectas
> negras finas dispuestas en forma de abanico/reloj radial, saliendo desde un
> punto central hacia afuera en todas las direcciones (como los rayos de una
> rueda), distribuidas de forma pareja en círculo. Minimalista, alto contraste,
> centrado. Sin números ni texto.

## 5. Miopía vs hipermetropía vs astigmatismo  ⚠️ (óptica)
**Ubicación**: dentro de "## Astigmatismo, miopía e hipermetropía: cómo se combinan". **Aspect**: 16:9.
**alt**: "Comparación de cómo enfoca la luz en miopía, hipermetropía y astigmatismo"
**Prompt**:
> [Estilo A]. Tres ojos en corte transversal en fila, comparativos. PRIMERO
> (miopía): ojo alargado, los rayos de luz convergen en un punto POR DELANTE de
> la retina. SEGUNDO (hipermetropía): ojo corto, los rayos convergen en un punto
> POR DETRÁS de la retina. TERCERO (astigmatismo): córnea ovalada, los rayos se
> enfocan en varios puntos. Mismo estilo y tamaño los tres, didáctico, prolijo.
> Sin texto ni etiquetas (los rótulos se agregan después).

## 6. (Opcional) Lente cilíndrica corrigiendo  ⚠️ (óptica)
**Ubicación**: dentro de "### Anteojos". **Aspect**: 4:3.
**alt**: "Lente cilíndrica que corrige el astigmatismo enfocando la luz en un punto"
**Prompt**:
> [Estilo A]. Diagrama de un ojo con astigmatismo (córnea ovalada) con una lente
> de anteojo cilíndrica delante; los rayos de luz que antes se dispersaban ahora,
> al pasar por la lente, convergen en un único punto nítido sobre la retina.
> Muestra la corrección. Limpio, didáctico. Sin texto.

---

## Notas de implementación
- Subir al bucket `article-images/guias/` con nombres claros (ej. `astigmatismo-hero.jpg`, `astigmatismo-cornea.jpg`, etc.).
- Cablear: `heroImage` en frontmatter (#1) + las inline en el MDX donde corresponda (componente de imagen o `![alt](path)` — definir al wirear).
- Si una #2/#5/#6 sale con óptica incorrecta, no publicarla así (es contenido YMYL): iterar o derivar a diseño.
