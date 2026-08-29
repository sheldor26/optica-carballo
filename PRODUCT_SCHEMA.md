# Product Schema — contrato de datos por producto

## Qué es esto

Fuente de verdad de **qué campos debe tener un producto** para estar 100% completo. Pensado para:

- **El comparador**: si falta data, el casillero queda vacío y la tabla se ve incompleta. Inaceptable per el founder.
- **La ficha técnica y medidas**: lo mismo — si faltan, queda blanco.
- **El recomendador IA**: necesita `frame_shape` + `recommended_face_shapes` para funcionar.
- **Los filtros**: dependen de `frame_shape` y otros atributos enumerados.

## Regla operativa

Al cargar un producto via `/product` o ad-hoc, **Claude debe verificar uno por uno los campos de este schema y pedir al founder explícitamente cada campo que falte**. NO se activa un producto con campos OBLIGATORIOS vacíos.

Si el founder no tiene un dato OBLIGATORIO (ej: peso) → buscar en la web del fabricante, en ficha de Mercado Libre del mismo modelo, o medir físicamente. NO inventar.

## Niveles

- 🔴 **OBLIGATORIO** — sin esto no se activa. Casillero del comparador queda vacío.
- 🟡 **RECOMENDADO** — afecta features secundarias. Se puede activar sin esto pero degrada UX.
- ⚪ **OPCIONAL** — solo para casos específicos.

---

## Campos por nivel

### 🔴 Identidad del producto

| Campo | Tipo | Ejemplo | Notas |
|---|---|---|---|
| `name` | string | "Vulk Day Light" | Nombre comercial completo. |
| `slug` | string | `vulk-day-light` | URL-safe, único por categoría. |
| `brand.slug` | string | `vulk` | Debe existir en `BRANDS.md`. |
| `category.slug` | string | `anteojos-de-sol` \| `anteojos-de-receta` | Una categoría. |
| `short_description` | string | "Lentes urbanos, marco acetato" | 60-90 chars. Aparece en cards y header. |
| `is_active` | bool | true | Solo true cuando este schema esté 100%. |

### 🔴 Variantes (al menos 1)

| Campo | Tipo | Notas |
|---|---|---|
| `sku` | string | Único globalmente. |
| `price_cents` | int | En centavos AR (ej: 79900 = $799.00). |
| `stock_qty` | int | Stock real físico. Si es 0 el producto se sigue mostrando pero "sin stock". |
| `attributes.frame_color` | string | Color del frame ("negro", "carey"). Para que el variant list sea legible. ⚠️ El orden importa: es `frame_color`, no `color_frame`. Este doc decía la clave al revés y el código la siguió — resultado: todas las miniaturas de variante del catálogo mostraban "Variante" en vez del color. Corregido 2026-08-25. |
| `attributes.lens_color` | string \| null | Color del lente ("verde-g15", "espejado-azul"). Null si no aplica. Ídem: `lens_color`, no `color_lens`. |
| `is_active` | bool | true. |

### 🔴 Imágenes (mínimo 3)

| Campo | Notas |
|---|---|
| Imagen primary | `is_primary=true`. Frontal limpio sobre fondo blanco/claro. |
| Imagen secondary | `sort_order=2`. Perfil/lateral para hover crossfade en cards. |
| Imagen contexto | `sort_order=3+`. Modelo usando los lentes (subida de conversión). |

WebP, ≥1200×1200px, <300KB.

### 🔴 Atributos del comparador (los 13 casilleros)

Estos son los **13 campos exactos** que aparecen como filas en `/comparar`. Si falta uno, queda "—" en la tabla y se ve mal.

#### Identidad (auto-derivados, no se cargan acá)
1. Marca → `brand.name`
2. Categoría → `category.name`
3. Precio → `variants[].price_cents`

#### attributes JSONB del producto
4. `frame_shape` — enum (⚠️ **canónico ESPAÑOL** — es lo que usan los filtros/rutas reales y la mayoría de la data; verificar con `SELECT DISTINCT attributes->>'frame_shape'` antes de cargar, NO usar inglés): `wayfarer | aviador | redondo | cuadrado | rectangular | cat_eye | ovalado | envolvente | hexagonal | oversized`. ⚠️ NUNCA usar `aviator`/`round`/`square` (inglés) → genera chips de filtro duplicados y rompe la ruta `/aviador` (normalizado a español 2026-06-29, ver MISTAKES). `wayfarer`/`cat_eye`/`rectangular` quedan así (consistentes en un solo valor). `envolvente` mapea a `/deportivos`.
5. `frame_material` — enum: `acetate | metal | injected | titanium | g-flex | tr-90`
6. `lens_treatment` — array de strings, ej: `["polarized", "uv400"]`. Valores válidos: `polarized | uv400 | gradient | mirrored | photochromic`
7. `gender` — enum: `unisex | male | female`
8. `weight_grams` — number, ej: `28`. Peso real del modelo en gramos.

#### attributes.measurements (objeto anidado)
9. `frame_width_mm` — number. Ancho total del frente del anteojo.
10. `lens_height_mm` — number. Altura de la apertura del lente.
11. `bridge_mm` — number. Ancho del puente (entre lentes).
12. `lens_width_mm` — number. Calibre del aro (ancho del lente individual).
13. `temple_length_mm` — number. Largo de las patillas.

**Formato JSONB completo de ejemplo**:

```json
{
  "frame_shape": "wayfarer",
  "frame_material": "acetate",
  "frame_color": "negro",
  "lens_color": "verde-g15",
  "lens_treatment": ["polarized", "uv400"],
  "gender": "unisex",
  "weight_grams": 28,
  "measurements": {
    "frame_width_mm": 142,
    "lens_height_mm": 45,
    "bridge_mm": 22,
    "lens_width_mm": 52,
    "temple_length_mm": 150
  }
}
```

### 🟡 SEO + contenido largo

| Campo | Notas |
|---|---|
| `description` | 300-600 palabras únicas. Sección "Descripción" del PDP. Si falta, la sección no se muestra. |
| `meta_title` | <60 chars. Si falta, se autogenera con nombre + marca. |
| `meta_description` | 150-160 chars. Si falta, se autogenera. |
| `attributes.recommended_face_shapes` | array, ej: `["ovalada", "cuadrada"]`. Necesario para que el producto sea recomendado por el recomendador IA. |
| `attributes.includes` | array, ej: `["estuche", "franela"]`. Default proyecto: estuche+franela siempre incluidos. |
| `attributes.warranty_months` | number. Default proyecto: 12 meses. |

### ⚪ Opcionales

- `attributes.is_new_arrival` — bool, para badge "Nuevo".
- `attributes.callouts` — array de objetos para las cajas educativas en la descripción larga.
- `attributes.collaboration_with` — string, para co-brandings (ej: "Las Oreiro").

### 🟡 Integración con Mercado Libre (campo en `product_variants`, no en `products.attributes`)

- `mercadolibre_item_id` — string formato `MLA1234567890`. Si el producto también se vende en ML, mapear la variante al item correspondiente.
- **Cuándo cargar**: si vendés esta variante en ML Y querés sync automático de stock (ver ADR-024).
- **Cuándo dejar NULL**: si la variante solo se vende en el sitio o si todavía no querés sync con ML.
- `mercadolibre_variation_code` — el código de la variación DENTRO de un item multi-variación
  (el ID numérico que devuelve la API, ej. `'192307652497'`). **NULL sólo si el item ML es simple.**
- **Restricción real**: `UNIQUE (mercadolibre_item_id, mercadolibre_variation_code)`, DEFERRABLE.
  O sea que **varias variantes SÍ pueden colgar del mismo `MLA`**, siempre que tengan
  `variation_code` distinto — es el caso normal de los items multi-variación (Ardigan seed 101,
  Bad Card seed 105). La constraint vieja de un-item-una-variante la dropeó la migración
  `20260529300000_ml_variation_support.sql:21-22`.
- ⚠️ **Un `variation_code` en NULL sobre un item multi-variación NO da error: es un SKIP SILENCIOSO.**
  `sync-stock.ts:296-298` incrementa un contador y sigue, sin escribir en `marketplace_sync_errors`.
  La variante queda congelada en stock **y precio** para siempre y no se detecta mirando la PDP.
- Sin este campo cargado, la variante NO se sincroniza con ML (sigue funcionando manualmente).

---

## Checklist operativa para cargar 1 producto

Pegar este bloque al founder y pedir cada campo en orden. Marcar ✅ a medida que se reciben.

```
IDENTIDAD
[ ] name:
[ ] slug (sugerencia automática del nombre):
[ ] brand.slug (verificar en BRANDS.md):
[ ] category.slug (sol/receta):
[ ] short_description (60-90 chars):

VARIANTE 1 (mínimo)
[ ] sku:
[ ] price (ARS):
[ ] stock:
[ ] frame_color:
[ ] lens_color (o null):

IMÁGENES
[ ] URL imagen primary (frontal):
[ ] URL imagen secondary (perfil):
[ ] URL imagen contexto (modelo, opcional pero recomendado):

ATRIBUTOS COMPARADOR (los 13 que aparecen en tabla)
[ ] frame_shape:
[ ] frame_material:
[ ] lens_treatment (array):
[ ] gender:
[ ] weight_grams:
[ ] frame_width_mm (ancho total):
[ ] lens_height_mm (altura total):
[ ] bridge_mm (puente):
[ ] lens_width_mm (calibre del aro):
[ ] temple_length_mm (patillas):

EXTRA RECOMENDADO
[ ] recommended_face_shapes (array):
[ ] description (300-600 palabras):
[ ] meta_title (<60 chars):
[ ] meta_description (150-160 chars):
```

---

## Validación automática (futuro)

**TODO** — agregar a `scripts/validate-product.ts`:

- Función `validateProductSchema(productSlug)` que checkea cada campo de este doc.
- Output: lista de campos faltantes + nivel (🔴 / 🟡).
- Hook a `is_active=true`: bloquear si quedan 🔴 sin llenar.
- Reporte semanal: productos activos con 🟡 vacíos para completar.

Por ahora la validación es **manual** vía checklist arriba.

---

## Por qué este doc existe

El founder reportó (2026-05-28) que el comparador necesita que todos los casilleros estén llenos para verse prolijo, y pidió que al cargar productos le pidamos los datos faltantes. Sin un schema explícito, era fácil olvidar un campo y dejar el producto "casi completo".

Este doc cierra ese loop: el contrato está escrito, la skill `/product` lo referencia, y Claude debe seguirlo.
