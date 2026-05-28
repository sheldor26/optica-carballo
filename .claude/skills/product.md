# Skill: Cargar Producto Nuevo (`/product`)

## Cuándo usar esto

Cuando se va a agregar un producto al catálogo (anteojos de sol, recetados, lentes de contacto, accesorios). Es la operación más repetida del proyecto, por eso está sistematizada.

## Antes de arrancar

Leer:
- `BRANDS.md` (verificar que la marca esté registrada)
- `PRODUCTS_INVENTORY.md` (verificar progreso del catálogo)
- `SEO_STRATEGY.md` (estructura de URLs)

Invocar agentes según corresponda:
- `optical-expert` para validar atributos técnicos
- `seo-strategist` para meta tags y slug
- `content-writer-medical` para descripción larga

## Proceso

### Step 1 — Información base del producto

Recopilar del founder o desde su sistema:

```yaml
nombre: "Wayfarer Classic"
marca: "Ray-Ban"  # debe existir en BRANDS.md
modelo_code: "RB2140"  # SKU del fabricante
categoria: "anteojos_sol"  # de la enum
genero: "unisex"  # hombre/mujer/unisex/infantil
descripcion_corta: "Modelo icónico con lente G15 unisex"
precio_base: 98500  # en ARS
```

### Step 2 — Generar slug SEO

Patrón: `[modelo]-[diferenciadores]-[código]`

Ejemplos:
- `wayfarer-classic-rb2140`
- `aviator-classic-rb3025`
- `oasys-mensuales-pack-6`

Reglas:
- Minúsculas
- Guiones medios, no underscores
- Sin acentos ni ñ
- Sin stop words excepto cuando ayudan
- 3-6 palabras ideal

URL final será: `/anteojos-de-sol/ray-ban/wayfarer-classic-rb2140`

### Step 3 — Cargar variantes

Cada variante = un SKU vendible con atributos únicos.

Para monturas:
```yaml
variantes:
  - sku: "RB2140-50-901"
    attributes:
      color_frame: "negro"
      color_lens: "verde-g15"
      size: 50
    stock: 3
    primary_image_url: "..."
  - sku: "RB2140-54-902"
    attributes:
      color_frame: "carey"
      color_lens: "marron"
      size: 54
    stock: 2
```

Para lentes de contacto:
```yaml
variantes:
  - sku: "OASYS-30-M3.00-BC8.4"
    attributes:
      prescription: -3.00
      curve: 8.4
      quantity: 30
    stock: 12
```

**Para contactos**: vas a cargar muchas variantes por modelo (graduaciones). Si son demasiadas, considerar cargar las más comunes (-1.00 a -6.00 paso 0.25) y manejar el resto por pedido.

### Step 4 — Imágenes

**Especificaciones**:
- Formato: WebP (preferido) o AVIF
- Tamaño: 1200×1200 px mínimo para el original
- Peso: <300 KB por imagen
- Mínimo 3 imágenes:
  - Frontal (LCP)
  - Perfil / lateral
  - Detalle o contexto de uso

**Imagen "en la cara"** (mockup en modelo) suma mucho a la conversión si está disponible.

**Asociación**:
- Imágenes genéricas del modelo: `variant_id = NULL`
- Imágenes específicas de una variante (ej: Wayfarer Carey): `variant_id = ID_de_esa_variante`

**Alt text**: descriptivo, con keyword principal. Ejemplo: "Anteojos de sol Ray-Ban Wayfarer Classic color carey con lente marrón".

Si las imágenes vienen sin optimizar, usar skill `/image-optimization` primero.

### Step 5 — Atributos físicos

Críticos para filtros y para que el cliente sepa si le entra:

```yaml
frame_shape: "wayfarer"  # de la enum
frame_material: "acetato"
frame_color: "negro"
lens_color: "verde-g15"

# Medidas en mm (críticas)
lens_width_mm: 50
bridge_width_mm: 22
temple_length_mm: 150

# Si aplica
uv_protection: "UV400"
polarized: false
```

Para lentes de contacto:

```yaml
contact_lens_type: "mensuales"
contact_lens_material: "silicona-hidrogel"
contact_lens_brand_family: "Oasys"
# BC, DIA, cantidad en attributes JSONB de cada variante
```

### Step 6 — Recommended face shapes

Para monturas, definir qué formas de rostro le quedan bien:

```yaml
recommended_face_shapes: ["ovalada", "cuadrada", "corazon"]
```

Esto alimenta el recomendador IA. Si dudás, consultar a `optical-expert`.

### Step 7 — Categorías automáticas

El producto se asocia automáticamente a categorías cuyo `auto_filter` matchea. Por ejemplo:

- Tiene `category=anteojos_sol` → aparece en `/anteojos-de-sol`
- Tiene `brand_id=ray-ban` → aparece en `/anteojos-de-sol/ray-ban`
- Tiene `genero=hombre` → aparece en `/anteojos-de-sol/ray-ban/hombre`
- Tiene `polarized=true` → aparece en `/anteojos-de-sol/polarizados`
- Tiene `frame_shape=wayfarer` → aparece en `/anteojos-de-sol/wayfarer`

Verificar que aparece donde esperás.

Si querés que aparezca en una colección especial (ej: Las Oreiro), agregar entrada en `product_collections`.

### Step 8 — SEO

Coordinar con `seo-strategist` para generar:

```yaml
meta_title: "Anteojos de Sol Ray-Ban Wayfarer Classic - Óptica Carballo"  # <60 chars
meta_description: "Ray-Ban Wayfarer Classic originales con lente G15 polarizado. Envíos a todo el país, cuotas sin interés, 30 años de experiencia."  # 150-160 chars
meta_h1: "Anteojos de Sol Ray-Ban Wayfarer Classic"
```

Verificar:
- Title <60 chars
- Description 150-160 chars
- H1 único (no se repite en otra página)
- Slug es único
- Canonical URL es la del producto

### Step 9 — Descripción larga (300-600 palabras)

Esto va en la página del producto (sección "Descripción"). Es contenido único, NO copy-paste entre productos similares.

Estructura:
1. Párrafo intro: estilo, ocasión, a quién le queda
2. Detalles de construcción (material, peso, calidad)
3. Lentes y tratamientos (si aplica)
4. Para qué uso es apto / no apto
5. Garantía y autenticidad

Coordinar con `content-writer-medical` si querés una descripción de calidad.

### Step 10 — Structured Data (JSON-LD)

Generar el `Product` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Ray-Ban Wayfarer Classic RB2140",
  "sku": "RB2140",
  "brand": {"@type": "Brand", "name": "Ray-Ban"},
  "image": ["url1", "url2", "url3"],
  "description": "...",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "ARS",
    "lowPrice": 98500,
    "highPrice": 98500,
    "offerCount": 6,
    "availability": "https://schema.org/InStock"
  },
  "hasVariant": [
    {
      "@type": "Product",
      "sku": "RB2140-50-901",
      "color": "Negro",
      "size": "50mm"
    },
    ...
  ]
}
```

### Step 11 — Activar y validar

Marcar `is_active = true`.

Verificar visualmente:
- [ ] Producto aparece en su categoría
- [ ] Variantes se seleccionan correctamente
- [ ] Imagen principal carga
- [ ] Precio y cuotas se muestran
- [ ] Stock se muestra correctamente
- [ ] Add to cart funciona
- [ ] Schema.org válido (test en https://validator.schema.org)
- [ ] Mobile: variantes, fotos, CTAs funcionan
- [ ] URL no tira 404 ni canonical incorrecto

### Step 12 — Actualizar tracking

1. **`PRODUCTS_INVENTORY.md`**: incrementar contador de la marca/categoría correspondiente.
2. **Sitemap**: regenerar automáticamente (debería ocurrir solo en próximo build).
3. **Si es producto destacado o lanzamiento importante**: considerar agregar a Home features.

## Checklist final por producto

Antes de activar (`is_active=true`):

- [ ] SKU base único
- [ ] Slug único, formato correcto
- [ ] Marca asignada (existe en BRANDS.md)
- [ ] Categoría correcta
- [ ] Al menos 1 variante con SKU vendible
- [ ] Stock real cargado
- [ ] Mínimo 3 imágenes optimizadas (WebP, <300KB c/u)
- [ ] Alt text descriptivo en cada imagen
- [ ] Precio + lógica de cuotas configurada
- [ ] Atributos físicos completos
- [ ] Para sol: UV protection + polarized
- [ ] Para receta: tipo de lente recomendado
- [ ] Para contacto: BC, DIA, duración, material
- [ ] `recommended_face_shapes` definido (si aplica)
- [ ] Meta title <60 chars
- [ ] Meta description 150-160 chars
- [ ] H1 único
- [ ] Descripción larga 300-600 palabras única
- [ ] Structured data válido
- [ ] OG image para social sharing
- [ ] URL canonical correcta
- [ ] Sin caracteres especiales en slug
- [ ] `PRODUCTS_INVENTORY.md` actualizado

## Reglas duras

1. **NUNCA activar un producto sin stock real confirmado**. Cero "consultar disponibilidad".
2. **NUNCA usar imágenes genéricas de stock**. Si no hay foto real, no se activa.
3. **NUNCA copiar descripción de otra fuente**. Cero plagio.
4. **NUNCA dejar variantes sin SKU vendible único**.
5. **NUNCA dejar productos sin atributos físicos** (medidas en mm). Críticos para fit.
6. **NUNCA activar sin haber validado mobile + desktop**.

## Operaciones bulk

Si vas a cargar muchos productos de una marca:

1. Hacer el primero con cuidado, completo.
2. Validar end-to-end.
3. Usar el primero como template para los siguientes (estructura, no contenido).
4. Cargar de a 5-10 productos por sesión, no más (calidad sobre cantidad).
5. Después de cargar 10, hacer pasada de QA: validar que cada uno aparece donde corresponde.
