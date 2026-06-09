# Óptica Carballo — Políticas operacionales del negocio

## Qué es este archivo

Las **políticas universales** del negocio que se aplican por defecto a TODO producto o flujo, salvo excepción explícita del founder. Es la fuente de verdad para:

- `content-writer-medical` al escribir descripciones de producto (debe mencionar lo que viene incluido).
- Componentes React que renderizan "Lo que incluye" en página de producto.
- `argentine-ecom` al diseñar flujos de checkout, envíos, devoluciones.
- `optical-expert` al validar promesas técnicas que pueda hacer el sitio.

**Si el founder cambia una política, se actualiza ACÁ primero**, y desde acá se cascadea al código y al copy.

---

## 1. Lo que incluye TODA compra (política universal)

Salvo aviso explícito del founder para un producto puntual, **todo anteojo vendido por Óptica Carballo incluye**:

| Ítem | Descripción | Notas |
|---|---|---|
| **Estuche original** | Estuche rígido o semirrígido de la marca del producto (Vulk, Rusty, Reef, Mormaii, Paula Cahen D'Anvers según corresponda). | Diseño y material varía por marca pero siempre es el oficial del fabricante. |
| **Franela** | Paño de microfibra para limpieza segura del cristal. | Genérica de la óptica o de la marca. |
| **Garantía de fabricación 1 año** | Garantía del fabricante contra defectos de fabricación (no cubre uso indebido, golpes, ralladuras de uso). | Operativizada por la óptica como punto de entrega del producto al fabricante para resolución. Plazo del fabricante. |

### Cómo se renderiza esto en el sitio

- **Página de producto**: sección "Lo que incluye" con 3 ítems (estuche, franela, garantía) renderizados con iconos. Componente: `components/product/product-includes.tsx`.
- **Mecanismo de override**: cada producto tiene un campo opcional `attributes.includes_override` (jsonb). Si está presente, reemplaza la lista default. Si no está, se usa la default.
- **Constante TS**: `lib/business/product-includes.ts` con la lista canónica.

### Restricciones de copy

- NO escribir "garantía total" o "garantía contra todo" — es solo contra DEFECTOS DE FABRICACIÓN.
- NO escribir "garantía de por vida" salvo que la marca lo confirme para ese producto específico.
- NO escribir "estuche premium" o adjetivos calificativos del estuche — solo "estuche original de la marca".
- NO inventar accesorios que no vienen (cordón, kit limpieza, segundas lentes, etc).

---

## 2. Stock y disponibilidad

- **Solo se vende lo que está en stock físico real**. No "pre-order", no "consultar disponibilidad".
- Stock en DB = stock real. Si `stock_qty = 0`, la variante NO es comprable (página la muestra como "Sin stock").
- Founder es responsable de mantener `stock_qty` actualizado tras cada venta.

---

## 3. Envíos

- **Operador único**: Correo Argentino (MiCorreo), con seguimiento. A domicilio o a sucursal del Correo. (Andreani descartado — ver ADR-026.)
- **Retiro gratis** en local físico de la óptica.
- **No prometer tiempos de entrega específicos** en copy de producto. Mostrar rangos solo en `/envios`.

---

## 4. Devoluciones y cambios

- Cumple con Defensa del Consumidor argentina (botón de arrepentimiento + política visible).
- Plazo: **10 días corridos** desde recepción para arrepentirse (ley 24.240).
- Cambios por talle/color: hasta **30 días** del producto sin uso, conservando estuche y etiquetas.
- Detalles operativos en `/cambios-y-devoluciones` (página legal).

---

## 5. Receta y prescripción

- **NO se venden anteojos recetados ni lentes de contacto sin receta válida**. La receta se valida manualmente al despachar.
- La descripción de armazones de receta SIEMPRE debe aclarar que el precio es del armazón sin cristales graduados (los cristales se cotizan según receta).

---

## 6. Honestidad sobre limitaciones de productos

- Si una feature tiene limitación conocida (ej polarizado en pantallas LCD), MENCIONARLA explícitamente en la descripción.
- Si un material no es lo que parece (ej "G-Flex" no es titanio aunque sea premium), describir su naturaleza real.
- Sin claims de "los mejores", "los más vendidos", "increíbles".

---

## 7. Facturación

- Toda venta genera factura electrónica AFIP.
- Cliente puede pedir factura A si tiene CUIT (formulario adicional en checkout).

---

## 8b. Badge "Nuevo ingreso" por fecha (`attributes.new_until`)

Cada producto puede tener un campo `attributes.new_until` (string ISO 8601, ej `"2026-06-28"`). Si la fecha es **futura** al momento de renderizar la página, aparece un badge verde **"Nuevo ingreso"** con icono. Cuando la fecha pasa, el badge desaparece automáticamente (evaluación server-side).

**Convención**: al cargar un producto nuevo, setear `new_until` a **1 mes** desde la fecha de carga. Founder puede extender editando el JSONB.

**No usar para**: ofertas, promociones temporales o estados "destacado". Esos tienen otros mecanismos (`is_featured`, badge de oferta separado a futuro).

**Decisión técnica**: badge eliminado "Marca local" (basado en `brand.is_argentine`) porque era poco accionable. La columna `is_argentine` se mantiene en DB por si se necesita en filtros SEO futuros, pero ya no se renderiza en UI.

---

## 8. Descripción del producto: genérica del MODELO, no de variantes

La descripción larga y la short_description deben describir el **modelo en general**, NO una variante específica.

**❌ Mal** (mezcla modelo + variante):
> "Esta versión viene en carey brillo, una variante clásica que combina con casi todo."
> "Las lentes polarizadas verdes cortan los reflejos…"

**✅ Bien** (describe el modelo):
> "Las lentes polarizadas cortan los reflejos…"

### Por qué importa

- Un modelo puede tener N variantes (colores, tamaños). Si la descripción menciona la variante específica X, queda incorrecta cuando se carga la variante Y.
- Cambiar la descripción "dinámicamente" según variante seleccionada requiere data por variante + lógica client-side. **No vale la pena para SEO** (Google indexa una sola descripción) ni para UX (el usuario lee la descripción una vez).

### Cómo nombrar las variantes en lugar

- Los colores y referencias específicas viven en `product_variants.attributes` (frame_color, lens_color, reference_code).
- La página de producto **muestra automáticamente** estos atributos en el bloque "Variantes disponibles".
- Las imágenes específicas de la variante (lateral, frontal del color real) se renderizan en la gallery cuando el usuario selecciona esa variante.

### Excepciones

- **Modelo con UNA SOLA variante posible** (extremadamente raro en óptica): se puede mencionar el color sin riesgo. Si se piensa agregar variantes después, mejor genérico desde el inicio.
- **Material o feature único de una variante** (ej "esta variante incluye lentes fotocromáticas y las demás no"): NO debería estar en la descripción larga del modelo. Si es relevante, separar como **callout** con `position: middle` y reference a la variante. O agregar como `product` separado si el feature cambia mucho.

---

## 9. Callouts en página de producto (bloques visuales destacados)

Cada producto puede tener bloques destacados llamados **callouts**: cuadros con border-left de color, fondo sutil, icono, y texto corto (4-6 líneas). Aparecen debajo de la descripción larga.

**Objetivo**: agregar profundidad técnica, opinión honesta, y atención visual sin alargar la descripción narrativa.

### Tipos disponibles

| Tipo | Color | Cuándo usarlo | Ejemplos de titles |
|---|---|---|---|
| `info` | Azul | Curiosidad técnica, dato físico verificable, explicación de un atributo | "Sabías que…", "Cómo funciona…" |
| `tip` | Ámbar | Consejo de cuidado, mantenimiento, mejor uso | "Para que duren", "Tip de la óptica" |
| `recommendation` | Verde | Opinión honesta sobre uso ideal / cuándo NO es la mejor opción | "Recomendación", "Para qué sirve mejor" |
| `warning` | Rojo | Limitación conocida del producto, contraindicación | "Importante", "Antes de comprar" |

### Schema (JSONB en attributes)

```json
{
  "callouts": [
    {
      "type": "info",
      "position": "top",
      "title": "Sabías que…",
      "body": "Texto corto, máximo ~250 caracteres (tweet length)."
    },
    {
      "type": "recommendation",
      "position": "middle",
      "title": "Recomendación",
      "body": "..."
    },
    {
      "type": "tip",
      "position": "bottom",
      "title": "Para que duren",
      "body": "..."
    }
  ]
}
```

### Posiciones (position)

Los callouts se intercalan con los párrafos de la descripción según su posición:

| Position | Dónde aparece | Cuándo usar |
|---|---|---|
| `top` | Al principio de la sección descripción, antes del primer párrafo | Curiosidad técnica que engancha (típico "Sabías que…") |
| `middle` | En el medio de los párrafos | Opinión / recomendación de uso |
| `bottom` | Al final, después del último párrafo | Tip de cuidado / mantenimiento |

Si una position no tiene callout, simplemente no aparece. Si hay 2 callouts con la misma position, se toma el primero (las posiciones son únicas).

### Reglas de redacción

- **NUNCA inventar**: cada callout debe ser técnicamente correcto y verificable. Si no se puede verificar, no se escribe.
- **Validar con `optical-expert`** cualquier callout que toque óptica/física/materiales. El agente sabe distinguir lo verificable de lo marketinero.
- **Máximo 3 callouts por producto** (uno por posición). Más satura.
- **~250 chars máximo por callout** (tweet length). Si necesita más espacio, va en la descripción larga, no en callout.
- **Sin emojis ni markdown bold inline** (el componente maneja la jerarquía visual).
- **Tono coloquial argentino** ("tenés", "fijate") sin perder rigor.
- **NO repetir lo que ya está en la descripción larga** — el callout agrega valor, no resume.
- **Title concreto y útil**: "Para que no se rayen las lentes" > "Cuidados generales". El title es el gancho.

### Cuándo proponer callouts en productos nuevos

`content-writer-medical` debe sugerir 2-3 callouts cuando escriba la descripción de un producto. Para productos con features ópticas/técnicas (polarizado, fotocromático, materiales especiales, formas específicas), los callouts son ESPECIALMENTE valiosos para E-E-A-T.

Si el founder no quiere callouts para un producto puntual, los omite del JSONB y la sección no se renderiza.

---

## Historial de cambios

| Fecha | Cambio | Por |
|---|---|---|
| 2026-05-28 | Versión inicial. Política universal de inclusión (estuche + franela + garantía 1 año), confirmada por founder al cargar 1er producto Vulk Day Light. | founder |
| 2026-05-28 | Agregada política #9: callouts en página de producto (4 tipos: info/tip/recommendation/warning). Patrón propuesto por founder con ejemplos visuales de otros proyectos. Validación técnica obligatoria via `optical-expert` para callouts sobre óptica/materiales. | founder |
| 2026-05-28 | Agregada política #8: descripción genérica del MODELO, no de variantes. Detectado al cargar 2da variante (Rosa Pálido) del Vulk Day Light — la descripción original mencionaba "carey brillo con lentes verdes" lo cual queda mal cuando hay otras variantes. Solución sistemática: descripción nunca menciona colores específicos de variantes. | founder |
