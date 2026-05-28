# Skill: Migración desde Mercado Libre (`/migration-from-ml`)

## Cuándo usar esto

**Una sola vez al inicio del proyecto**, para capitalizar los 2000+ ventas históricas de Óptica Carballo en Mercado Libre. Después de esto, no se vuelve a correr.

## Por qué importa

- **2000+ ventas históricas** = data real de qué productos giran
- **Reviews / Q&A** = prueba social inicial migrable
- **Fotos cargadas en ML** = base visual ya hecha
- **Descripciones cargadas** = punto de partida (necesitan reescribirse, no copiar)
- **Stats de visitas** = qué publicaciones convirtieron mejor

## Antes de arrancar

Necesario:
- Acceso al panel de Mercado Libre de Óptica Carballo
- Capacidad de exportar reportes (algunos están en formato CSV o Excel)
- Tiempo: probablemente 2-3 sesiones completas para procesar todo

Invocar agentes:
- `argentine-ecom` (entiende cómo funciona ML)
- `seo-strategist` (decide cómo migrar reviews al sitio)
- `optical-expert` (valida atributos técnicos al cargar productos)

## Proceso

### Step 1 — Exportar datos del panel de ML

Acceder a:
- **Mis ventas** → exportar últimos 24 meses
- **Mis publicaciones** → exportar listado completo (activas, finalizadas, pausadas)
- **Reportes** → reporte de visitas / conversión por publicación
- **Preguntas** → exportar Q&A si es posible
- **Reputación** → screenshots de las métricas (no son exportables fácil)

Si algo no se puede exportar directo, screenshot + transcripción.

### Step 2 — Análisis del histórico de ventas

Procesar el CSV de ventas para identificar:

```yaml
top_productos_por_volumen:
  - producto: "[nombre]"
    ventas_totales: X
    revenue_estimado: $X
    estado_actual: "activo" / "discontinuado"

top_categorias:
  - categoria: "anteojos de sol"
    porcentaje_ventas: X%
  - categoria: "lentes de contacto"
    porcentaje_ventas: X%

estacionalidad:
  - mes_pico: "[mes]"
  - mes_valle: "[mes]"

ticket_promedio: $X
clientes_recurrentes: X%
```

Esto va a `METRICS.md` como baseline real del negocio.

### Step 3 — Identificar productos a migrar prioritariamente

De las publicaciones de ML, priorizar:

#### Top 50 (carga rápida)
- Productos con más ventas históricas
- Que están en stock real ahora
- Que pertenecen a marcas que vendemos (verificar `BRANDS.md`)

#### Productos con reviews destacadas
- Aunque tengan pocas ventas, si tienen reseñas de calidad valen para autoridad

#### Productos descontinuados pero icónicos
- Mantener URL con redirect a producto reemplazo
- O página de producto con `noindex` + "discontinuado, reemplaza por X"

### Step 4 — Migrar producto por producto

Para cada producto, usar el skill `/product` con datos pre-cargados desde ML:

1. **SKU**: el de fabricante (no el de ML, que es propio)
2. **Nombre**: limpiar de promoción ("¡OFERTA!", "12 cuotas sin interés", "ENVÍO GRATIS")
3. **Marca**: validar que esté en `BRANDS.md`
4. **Descripción**: **NO copiar literal** — reescribir según skill `/product`
5. **Fotos**: bajar de ML, optimizar a WebP, subir a Supabase Storage
6. **Precio**: el actual real del local, no el de ML (pueden estar desfasados)
7. **Stock**: el actual real del local, no el de ML
8. **Categoría**: re-mappear de la categoría ML a la nuestra (puede ser distinta)
9. **Atributos**: re-extraer (color, talle, marca) — los de ML están en su formato

### Step 5 — Migrar reviews / testimonios

Esto es delicado por privacidad y por reglas de ML.

**Lo que SE puede hacer**:
- Pedir a clientes recientes que dejen review en el sitio nuevo
- Mostrar **calificación promedio de ML** ("4.8 / 5 en Mercado Libre - 2.000+ ventas") como prueba social agregada
- Linkear al perfil público de ML como demostración

**Lo que NO se debe hacer**:
- Copiar reviews textualmente y publicarlas sin permiso del usuario
- Inventar nombres / fotos de clientes
- Mover datos personales de clientes de ML al sitio sin consentimiento

### Step 6 — Estrategia para clientes existentes

Los clientes que ya compraron en ML son base potencial para el sitio nuevo.

#### Opción A: Email marketing (con consentimiento)
- Si el cliente dejó email al comprar en ML, considerar comunicación de lanzamiento del sitio
- Necesita opt-in explícito según LPDP
- Mejor con incentivo: "Como cliente nuestro, 10% off en tu próxima compra en el sitio nuevo"

#### Opción B: WhatsApp
- Si tenés su número del envío anterior, podés mandar mensaje 1:1 (no broadcast)
- Más informal, mejor respuesta
- Cuidar de no parecer spam

#### Opción C: Cross-promotion en el packaging
- Próximos envíos de ML incluyen flyer del sitio nuevo
- Sin presión, solo informativo

### Step 7 — SEO de URLs viejas vs nuevas

Si las URLs viejas del Mercadoshops todavía estaban indexadas:

- **Identificar las que tenían tráfico** (Wayback Machine + intentos en GSC del dominio)
- **Redirect 301** desde URL vieja a la nueva equivalente
- Si la URL vieja no tiene equivalente directo, redirect a categoría padre
- **Nunca dejar 404s de URLs antes indexadas** — perdemos autoridad

### Step 8 — Análisis de Q&A para FAQ

Las preguntas que clientes hacían en ML son **oro para FAQs**:

1. Exportar/screenshot todas las preguntas frecuentes
2. Agrupar por tipo (envío, garantía, talle, técnica)
3. Identificar las que se repiten
4. Crear FAQs:
   - Página `/preguntas-frecuentes` con las más generales
   - FAQ section en páginas de producto con específicas
   - FAQ schema en todas

### Step 9 — Métricas baseline

Documentar en `METRICS.md`:

```yaml
baseline_ml:
  ventas_totales_histórico: X
  ventas_últimos_12_meses: X
  ticket_promedio: $X
  conversion_rate_estimada_ml: X%  # si está disponible
  productos_top_5: [...]
  categorias_top_3: [...]
  estacionalidad: [...]
  
metas_sitio_propio_3_meses:
  ventas_mensuales: X  # cuánto del histórico ML capturamos
  ticket_promedio: $X  # esperamos subir vs ML
  conversion_rate: X%  # esperamos subir vs ML (sin comisión)
```

Esto baseline real reemplaza los targets estimados que estaban en `METRICS.md`.

### Step 10 — Cerrar el proceso

Una vez completada la migración:

1. **`CURRENT_STATE.md`**: marcar como completado.
2. **`PRODUCTS_INVENTORY.md`**: refleja los productos cargados.
3. **`METRICS.md`**: actualizado con baselines reales.
4. **`LEARNINGS.md`**: si algo del proceso es valioso replicar, documentar.
5. **`DECISIONS.md`**: si se tomaron decisiones (qué reviews mostrar, qué hacer con ML después), ADRs.

### Step 11 — ¿Mantener Mercado Libre activo?

Decisión a tomar:

**Pros de mantener ML activo**:
- Captura tráfico que sigue llegando a ML directo
- Diversifica canales de venta
- Reputación acumulada ya construida

**Cons de mantener ML activo**:
- Comisión 15-20% por venta (vs 0% en sitio propio)
- Atención duplicada
- Menos margen
- Cliente queda en ML, no en nuestra DB

**Decisión recomendada**: mantener ML activo en V1, evaluar dejar gradualmente cuando el sitio propio capture >60% de las ventas históricas.

## Reglas duras

1. **NUNCA copiar descripciones literales** de ML al sitio (texto mediocre + duplicado SEO).
2. **NUNCA copiar reviews sin permiso del autor**.
3. **NUNCA cargar productos sin verificar stock real actual**.
4. **NUNCA dejar URLs viejas indexadas dando 404** — redirects sí o sí.
5. **NUNCA enviar email masivo a clientes históricos sin opt-in**.

## Lo que SÍ aprovechamos al máximo

1. **Estadísticas** (qué se vende, cuándo, a qué precio).
2. **Reputación agregada** ("4.8 / 5 en MercadoLibre, 2.000+ ventas").
3. **Fotos** (con re-optimización).
4. **Histórico de Q&A** como semilla para FAQs.
5. **Conocimiento de mercado** (los productos que históricamente giran nos dicen qué priorizar).
