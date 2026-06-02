# Óptica Carballo — Products Inventory

## Qué es este archivo

Tracker en tiempo real de **qué productos están cargados en el sitio, qué falta cargar, y el progreso por marca y categoría**. Permite a cualquier sesión de trabajo saber el estado del catálogo sin necesidad de querir la DB.

## Estructura

Por cada marca/categoría, trackeamos:
- Cantidad de productos cargados
- Cantidad con stock activo
- Cantidad con imágenes completas
- Cantidad con SEO completo (meta tags + structured data)
- Estado general

## Estados

- ✅ **Completo**: cargado con imágenes + SEO + stock confirmado
- 🟡 **Parcial**: cargado pero falta info (imágenes / SEO / stock)
- 🔴 **No cargado**: marca planificada pero sin productos
- ⏸️ **En pausa**: postergado hasta nueva decisión

---

# Resumen general

**Estado**: 🔴 Catálogo vacío — pre-launch.

**Totales actuales**:
- Marcas activas: 0
- Productos cargados: 0
- Productos con stock: 0
- Imágenes subidas: 0

**Targets pre-launch**:
- 8 marcas argentinas con al menos 5 productos cada una (40 productos mínimo)
- 4-6 marcas internacionales con productos top (20-30 productos)
- 4 marcas de lentes de contacto con líneas principales (16-20 SKUs base, expandido por receta)
- Total target: 80-100 productos visibles al lanzamiento

---

# Por categoría

## Anteojos de Sol

### Marcas Argentinas

| Marca | Productos cargados | Con stock | Con imágenes | Con SEO | Estado |
|-------|-------------------|-----------|--------------|---------|--------|
| Rusty | 3 | 3 | 1 | 3 | 🟡 |
| Rusty: Yau (deportivo 2-en-1) | 1 | 1 | 1 | 1 | ✅ Live (seed 10/13/15) |
| Rusty: Feeled MBLK TENNIS | 1 | 1 | pendiente founder | 1 | 🟡 Seed 23 listo, esperando fotos en bucket |
| Rusty: Dearly (cuadrado femenino, 3 variantes) | 1 | 3 variantes | pendiente founder | 1 | 🟡 Seed 24 listo, esperando 9 TODOs (precio/stock/var_code) + 7 fotos en bucket |
| Rusty: Zaedit (wayfarer unisex, 3 variantes) | 1 | 3 (stock 14) | 6 (verificar bucket) | 1 | ✅ Aplicado MCP (seed 38). 2 pol + REVO no-pol. Precio/stock vía ml-import-preview. Founder: chequear grid/scale. |
| _Nota: tabla desactualizada (faltan Vrast/Etiquet/Tulle/Xold/Spell/Sotion/etc.). Fuente de verdad de seeds aplicados = `supabase/CLOUD_APPLIED.md`._ | | | | | |
| Reef | 0 | 0 | 0 | 0 | 🔴 |
| Vulk | 0 | 0 | 0 | 0 | 🔴 |
| Infinit | 0 | 0 | 0 | 0 | 🔴 |
| Prune | 0 | 0 | 0 | 0 | 🔴 |
| Union Pacific | 0 | 0 | 0 | 0 | 🔴 |
| Wanama | 0 | 0 | 0 | 0 | 🔴 |
| Orbital | 0 | 0 | 0 | 0 | 🔴 |
| Cohiba | 0 | 0 | 0 | 0 | 🔴 |

### Colecciones de Famosos

| Colección | Estado | Notas |
|-----------|--------|-------|
| Las Oreiro | ⏸️ | Pendiente confirmar stock |
| Paula Cahen d'Anvers | ⏸️ | Pendiente |
| Valeria Mazza | ⏸️ | Pendiente |
| Teresa Calandra | ⏸️ | Pendiente |
| Infinit by Pampita | ⏸️ | Pendiente |

### Marcas Internacionales

| Marca | Productos | Estado |
|-------|-----------|--------|
| Ray-Ban | 0 | 🔴 |
| Oakley | 0 | 🔴 |
| Prada | 0 | 🔴 |
| Miu Miu | 0 | 🔴 |
| Versace | 0 | 🔴 |
| Tiffany | 0 | 🔴 |
| Persol | 0 | 🔴 |
| Carrera | 0 | 🔴 |
| Police | 0 | 🔴 |

## Anteojos de Receta

### Marcas

| Marca | Productos | Estado |
|-------|-----------|--------|
| Vulk | 0 | 🔴 |
| Infinit | 0 | 🔴 |
| Prune | 0 | 🔴 |
| Ray-Ban (línea óptica) | 0 | 🔴 |
| Prada (línea óptica) | 0 | 🔴 |
| (otras a definir) | - | - |

## Lentes de Contacto

### Marcas

| Marca | Líneas cargadas | Estado |
|-------|-----------------|--------|
| Acuvue | 0 | 🔴 |
| - Moist | 0 | 🔴 |
| - TruEye | 0 | 🔴 |
| - Oasys | 0 | 🔴 |
| - Vita | 0 | 🔴 |
| - Define | 0 | 🔴 |
| Bausch + Lomb | 0 | 🔴 |
| - Biotrue | 0 | 🔴 |
| - Ultra | 0 | 🔴 |
| - SofLens | 0 | 🔴 |
| Alcon | 0 | 🔴 |
| - Dailies Total 1 | 0 | 🔴 |
| - Dailies AquaComfort | 0 | 🔴 |
| - Air Optix | 0 | 🔴 |
| CooperVision | 0 | 🔴 |
| - Biofinity | 0 | 🔴 |
| - MyDay | 0 | 🔴 |

**Nota sobre lentes de contacto**: cada línea tiene múltiples SKUs por graduación. Una "línea" cargada significa la línea base, las variantes de graduación se modelan en `product_variants`.

## Accesorios

| Tipo | Productos | Estado |
|------|-----------|--------|
| Estuches | 0 | 🔴 |
| Paños de microfibra | 0 | 🔴 |
| Líquidos para contactos | 0 | 🔴 |
| Cordones / cadenas | 0 | 🔴 |
| Sprays de limpieza | 0 | 🔴 |

---

# Plan de carga (pre-launch)

## Sprint 1 — Marcas argentinas top (semana 2-3)

Objetivo: tener 30-40 productos cargados con todo el SEO completo.

Orden sugerido (por prioridad SEO):
1. **Rusty** — 6.000 vol — cargar 6-8 modelos
2. **Reef** — 3.400 vol — 5-6 modelos
3. **Vulk** — 2.500 vol — 5-6 modelos
4. **Prune** — 2.000 vol — 5-6 modelos
5. **Infinit** — 2.100 vol — 5 modelos
6. **Union Pacific** — 1.700 vol — 4 modelos
7. **Wanama** — 1.100 vol — 4 modelos
8. **Orbital** — 1.100 vol — 4 modelos

## Sprint 2 — Marcas internacionales (semana 4)

1. **Ray-Ban** — 7.200 vol con "mujer" — Wayfarer, Aviator, Justin, Erika (8-10 modelos)
2. **Prada** — 2.600 vol — 4-5 modelos
3. **Tiffany** — 1.700 vol — 3-4 modelos
4. **Oakley** — 1.400 vol — 3-4 modelos

## Sprint 3 — Lentes de contacto (semana 4-5)

Líneas principales de Acuvue + Bausch + Alcon + CooperVision.
- Por línea, cargar SKUs por graduación esperada (-6.00 a +6.00 paso 0.25 mínimo en líneas core).
- Mensuales y diarias prioridad sobre quincenales.

## Sprint 4 — Anteojos de receta + accesorios (semana 5-6)

Marcas argentinas y top internacionales con líneas ópticas.
Accesorios complementarios (estuches, paños, líquidos).

---

# Workflow de carga de un producto

(Detallado en el skill `/product` que viene en Entrega 4)

Resumen:
1. Datos del producto (nombre, marca, SKU, precio).
2. Variantes (color, talle, etc.) con SKU vendible cada una.
3. Imágenes: subir a Supabase Storage, asociar a producto y a variantes específicas si aplica.
4. SEO: meta_title, meta_description, alt text, slug.
5. Atributos para filtros: forma, material, color, género, recommended_face_shapes, etc.
6. Categorías automáticas: el producto se asocia a las categorías cuyo `auto_filter` matchea.
7. Stock real cargado por variante.
8. Activar producto.
9. Actualizar este archivo (`PRODUCTS_INVENTORY.md`).

---

# Checklist por producto

Cada producto debe tener antes de activarse:

- [ ] SKU base + slug único
- [ ] Nombre + modelo + descripción corta (50-100 palabras)
- [ ] Descripción larga (300-600 palabras únicas, no copy-paste)
- [ ] Marca asociada
- [ ] Categoría asociada (correcta)
- [ ] Al menos 1 variante con SKU vendible y stock
- [ ] Mínimo 3 imágenes (frontal, perfil, detalle/contexto)
- [ ] Imagen principal optimizada (WebP, <200KB)
- [ ] Alt text descriptivo en cada imagen
- [ ] Precio + cuotas configuradas correctamente
- [ ] Atributos físicos completos (medidas en mm, material, color)
- [ ] Para sol: UV protection + polarizado especificados
- [ ] Para receta: tipo de lente recomendado especificado
- [ ] Para contacto: BC, DIA, duración, material
- [ ] recommended_face_shapes (si aplica)
- [ ] Meta title (<60 chars con keyword)
- [ ] Meta description (150-160 chars)
- [ ] Structured data verificado (Product schema válido)
- [ ] Imagen OG para compartir en redes
- [ ] Producto agregado a sitemap

---

# Decisiones pendientes que afectan al inventario

(Referenciadas en DECISIONS.md)

- **PEND-002**: Stock real de colecciones de famosos (Las Oreiro, etc.).
- **PEND-004**: Acceso a panel ML para exportar histórico de 2000+ ventas — top productos a priorizar.
- **PEND-005**: Cuentas creadas (necesarias para que funcione todo el flow).

---

# Histórico de avance

| Fecha | Sprint | Productos agregados | Notas |
|-------|--------|---------------------|-------|
| 2026-05-27 | Setup inicial | 0 | Sistema configurado, falta cargar catálogo |

(Se llena cuando empezamos a cargar)

---

# Hibernación / discontinuación

Cuando un producto deja de tenerse:

1. Marcar `is_active=false` en DB (no borrar).
2. Sacar del sitemap automáticamente.
3. Si no hay variantes con stock por >60 días, considerar redirect 301 a la categoría padre.
4. Mantener URL accesible si tiene reviews / autoridad SEO.
5. Actualizar este archivo.
