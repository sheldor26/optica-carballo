# Skill: Optimización de Imágenes (`/image-optimization`)

## Cuándo usar esto

Cuando se reciben imágenes nuevas para subir al sitio (productos, banners, fotos del local, etc.). Sistematiza el proceso para mantener performance + SEO + UX.

## Por qué importa

- **Performance**: imágenes mal optimizadas son la causa #1 de LCP malo.
- **SEO**: alt text + nombre del archivo afectan ranking.
- **UX**: imágenes pesadas dan sensación de lentitud, especialmente en mobile (70%+ del tráfico esperado).
- **Costo**: ancho de banda en Vercel y Supabase Storage tiene costo si crece.

## Estándares del proyecto

### Formatos

| Formato | Cuándo usar | Notas |
|---------|-------------|-------|
| **AVIF** | Default ideal | Mejor compresión, soporte 95%+ navegadores 2026 |
| **WebP** | Fallback si AVIF da problemas | Universal hoy en día |
| **JPEG** | Fallback de fallback | Para máximos legacy (raro) |
| **PNG** | Solo si necesita transparencia | Más pesado que WebP |
| **SVG** | Icons, logos, ilustraciones simples | Vector, infinitamente escalable |

### Tamaños por uso

| Uso | Dimensión original | Compresión target |
|-----|--------------------|--------------------|
| Imagen LCP (hero, primer producto visible) | 1920×1080 max | <200 KB |
| Foto principal de producto | 1200×1200 | <250 KB |
| Galería de producto (secundarias) | 1200×1200 | <200 KB |
| Card de producto en listado | 600×600 | <80 KB |
| Thumbnail (carrito, wishlist) | 300×300 | <40 KB |
| Foto en artículo | 1200×800 | <200 KB |
| OG image (social sharing) | 1200×630 | <150 KB |
| Banner de categoría | 1920×800 | <300 KB |
| Foto del local / equipo | 1600×1067 | <250 KB |

### Naming conventions

```
[producto-slug]-[posicion]-[descriptor].webp

Ejemplo:
ray-ban-wayfarer-classic-1-frontal.webp
ray-ban-wayfarer-classic-2-perfil.webp
ray-ban-wayfarer-classic-3-detalle.webp
ray-ban-wayfarer-classic-4-en-modelo.webp
```

Para variantes específicas:
```
[producto-slug]-[variante]-[posicion].webp

Ejemplo:
ray-ban-wayfarer-classic-carey-1-frontal.webp
```

Reglas:
- minúsculas, guiones medios
- sin acentos ni ñ
- el nombre del archivo es parte del SEO (Google lo lee)

### Alt text

Patrón: `[Tipo de producto] [marca] [modelo] [color/variante si aplica] [ángulo o contexto]`

Ejemplo: `Anteojos de sol Ray-Ban Wayfarer Classic color carey con lente marrón vista frontal`

Reglas:
- Descriptivo, no spam
- Incluir keyword principal cuando es natural
- 80-125 caracteres aprox
- No empezar con "Imagen de" o "Foto de" (redundante)
- Si la imagen es decorativa puramente, alt vacío (`alt=""`)

## Proceso

### Step 1 — Recibir imágenes originales

Verificar qué llegó:
- ¿Cuántas imágenes?
- ¿Para qué producto / página?
- ¿Cuál es la principal (LCP)?
- ¿Resolución suficiente? (mínimo 1200px en el lado más largo)
- ¿Hay duplicados o casi-duplicados?

Si las imágenes son <1200px → pedir resolución mayor o aceptar limitación de zoom.

### Step 2 — Curar la selección

No subir 20 fotos por producto. Curar:

**Para anteojos / monturas**:
- 1× Vista frontal (LCP)
- 1× Vista lateral (perfil)
- 1× Vista 3/4
- 1× Detalle (varilla, plaqueta, logo)
- 1× En modelo / contexto (si hay)
- 1× Caja / packaging (opcional)

**Para lentes de contacto**:
- 1× Packaging frontal
- 1× Packaging lateral mostrando contenido
- 1× Detalle de la lente

**Para fotos del local / equipo**:
- 1× Frente del local (Google Business Profile)
- 1× Interior amplio
- 1× María Carlota atendiendo (con permiso)
- 1× Juan en el taller / atendiendo

### Step 3 — Editar las imágenes (si necesario)

Operaciones comunes:

**Crop / framing**:
- Cuadrado para productos (1:1)
- 16:9 o 4:3 para fotos contextuales
- 1200×630 para OG images

**Fondo**:
- Para productos, fondo blanco o neutro idealmente
- Si hay sombras inconsistentes, normalizar
- Considerar "ghost mannequin" o flat lay según estilo de la marca

**Color**:
- Balance de blancos correcto (productos negros que se ven gris, no)
- Saturación natural (no oversatura para no engañar al cliente)
- Brillo / contraste para legibilidad

**Eliminación de elementos**:
- Marcas de agua de fabricantes (si las hay, según política de uso)
- Stickers de precio viejos
- Fondos confusos

Herramientas:
- Photoshop / Affinity Photo (profesional)
- GIMP (gratis, capaz)
- Photopea (online, gratis)
- Squoosh (compresión)
- Cloudinary (transformaciones programáticas)

### Step 4 — Compresión

Por archivo:

1. **Resize** a la resolución target (no servir 4000px si nadie va a verla)
2. **Export a WebP/AVIF** con quality 80-85 (sweet spot)
3. **Verificar tamaño final**:
   - Si excede target, bajar quality a 75
   - Si todavía excede, reducir resolución (probablemente original era demasiado grande)
4. **Generar versiones responsivas** si se necesitan (Next.js Image hace esto solo):
   - 1x, 2x para retina
   - Diferentes anchos según viewport

Comando ejemplo con cwebp (CLI):
```bash
cwebp -q 82 input.jpg -o output.webp
```

Para AVIF:
```bash
avifenc --min 30 --max 50 input.jpg output.avif
```

Con `sharp` (Node, programático):
```typescript
import sharp from 'sharp'

await sharp(inputBuffer)
  .resize(1200, 1200, { fit: 'cover' })
  .webp({ quality: 82 })
  .toFile(outputPath)
```

### Step 5 — Subir a Supabase Storage

Estructura de buckets:

```
supabase/
├── product-images/        ← bucket público
│   ├── ray-ban/
│   │   ├── ray-ban-wayfarer-classic-1-frontal.webp
│   │   └── ...
│   └── rusty/
│       └── ...
├── prescription-images/   ← bucket PRIVADO (recetas de usuarios)
├── article-images/        ← bucket público
└── og-images/             ← bucket público
```

Reglas:
- `product-images`, `article-images`, `og-images`: público con CORS abierto
- `prescription-images`: PRIVADO con signed URLs, expiración 1h, RLS estricto

### Step 6 — Asociar al producto / página

Para productos:

```sql
INSERT INTO public.product_images (
  product_id,
  variant_id,  -- NULL si es genérica del modelo
  url,
  alt_text,
  position,
  image_type
) VALUES (
  '...',
  NULL,
  'https://[supabase-url]/storage/v1/object/public/product-images/ray-ban/ray-ban-wayfarer-classic-1-frontal.webp',
  'Anteojos de sol Ray-Ban Wayfarer Classic vista frontal',
  1,
  'product'
);
```

`image_type` puede ser: `product`, `lifestyle`, `360`, `on_face`, `detail`, `packaging`.

### Step 7 — Verificar en el sitio

Después de cargar:

- [ ] Imágenes cargan en el sitio
- [ ] LCP de la página se mantiene <2.5s (Vercel Analytics o PageSpeed)
- [ ] Mobile: no hay CLS por imágenes sin dimensiones declaradas
- [ ] Desktop: idem
- [ ] Alt text aparece (inspeccionar `<img alt="...">`)
- [ ] `next/image` está sirviendo versiones responsivas correctas
- [ ] La imagen sale en preview de social sharing (Twitter, Facebook) — la OG image debe estar configurada

### Step 8 — Optimizaciones de Next.js

En componentes:

```tsx
import Image from 'next/image'

<Image
  src={imageUrl}
  alt={altText}
  width={1200}
  height={1200}
  priority={isLCP}  // SOLO para LCP, no para todas
  sizes="(max-width: 768px) 100vw, 50vw"
  className="..."
/>
```

Reglas:
- **Dimensiones explícitas** (width + height) → previene CLS
- **`priority`** SOLO en la imagen LCP (1 por página)
- **`sizes`** apropiado para responsive
- **`placeholder="blur"`** con `blurDataURL` para efecto progresivo (opcional, mejora percepción)

### Step 9 — Configuración del dominio en next.config

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '[tu-proyecto].supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}
```

Sin esto, `next/image` no puede optimizar imágenes externas.

## Checklist por imagen

- [ ] Resolución apropiada al uso
- [ ] Formato WebP o AVIF
- [ ] Tamaño dentro del target
- [ ] Nombre de archivo con SEO (slug + descriptor)
- [ ] Alt text descriptivo y con keyword natural
- [ ] Sin elementos a remover (marcas de agua viejas, etc.)
- [ ] Balance de color correcto
- [ ] Subida a bucket correcto en Supabase
- [ ] Asociada al producto/página correspondiente
- [ ] `position` correcta (orden de la galería)
- [ ] `image_type` correcto
- [ ] Verificada visualmente en el sitio
- [ ] LCP no degradado

## Reglas duras

1. **NUNCA subir imagen sin alt text** (excepto decorativas puras con `alt=""`).
2. **NUNCA subir JPG/PNG cuando se puede WebP** sin razón.
3. **NUNCA dejar imágenes >300 KB en productos** salvo razón muy justificada.
4. **NUNCA usar imágenes con marca de agua de competidores** o fabricantes sin permiso.
5. **NUNCA usar stock photos genéricas para productos** — mata credibilidad en óptica.
6. **NUNCA olvidar `priority` en la imagen LCP**.
7. **NUNCA poner `priority` en TODAS las imágenes** — anula el beneficio.

## Casos especiales

### Imágenes 360° de producto

Algunos vendedores ofrecen vista 360° (girar producto con drag). Es feature de V2.

Para implementar:
- Set de 24-36 frames del producto rotando
- Componente React específico
- Pesado pero alto impacto en confianza para productos premium

### Try-on / probador virtual

Es feature compleja (V2/V3). Requiere face landmark detection.

Por ahora, alternativa simple: mostrar foto del producto "en modelo" como referencia visual.

### Fotos del local físico

Para Google Business Profile + página `/nosotros`:
- Foto exterior del local
- Foto interior (mostrador, vitrinas)
- Foto del equipo trabajando
- Foto de equipamiento técnico (autorrefractómetro, queratómetro)

Estos suben mucho la confianza. Tomarse el tiempo de tener buenas fotos.

### OG images por página

Idealmente cada página tiene OG image específica:
- Home: imagen general de marca + slogan
- Categoría: imagen representativa
- Producto: la foto principal del producto
- Artículo: imagen relacionada con el tema

Formato: 1200×630, <150 KB, JPEG o PNG (mejor compatibilidad social que WebP).

Se puede generar dinámicamente con `next/og`:

```typescript
// app/og/route.tsx
import { ImageResponse } from 'next/og'

export async function GET(request) {
  // Generar imagen dinámica según query params
}
```
