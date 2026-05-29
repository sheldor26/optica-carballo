# Óptica Carballo — Decisions Log (ADR)

## Qué es este archivo

Architecture Decision Records (ADRs) del proyecto. Toda decisión técnica o estratégica importante se registra acá.

**Reglas**:
- Una decisión registrada acá es **ley hasta que se actualice formalmente**.
- Si una decisión se revierte, no se borra: se marca `Estado: Revertida` y se agrega una nueva entrada explicando por qué.
- El `agent-manager` puede proponer revisar una decisión si nueva evidencia la contradice, pero la decisión se mantiene hasta que el founder apruebe el cambio.
- Cada decisión tiene un ID secuencial (ADR-001, ADR-002, etc.) para referenciarla desde otros archivos.

## Estados posibles

- 🟢 **Vigente**: aplica actualmente.
- 🟡 **En revisión**: bajo evaluación, todavía aplica pero puede cambiar.
- 🔴 **Revertida**: ya no aplica, mantenida por historia.
- ⚪ **Superseded**: reemplazada por una decisión posterior (referencia al ADR que la reemplaza).

## Template para nuevas decisiones

```markdown
## ADR-XXX — [Título corto]

**Fecha**: YYYY-MM-DD
**Estado**: 🟢 Vigente
**Categoría**: Arquitectura | SEO | Producto | Pagos | Logística | IA | Contenido | Operación

### Contexto
Qué situación llevó a esta decisión.

### Decisión
Qué se decidió.

### Alternativas consideradas
Qué otras opciones había y por qué no se eligieron.

### Consecuencias
- Positivas: qué se gana.
- Negativas: qué se sacrifica.
- Riesgos: qué puede salir mal.

### Cómo se valida
Métricas o checkpoints para confirmar que la decisión fue correcta.
```

---

# Decisiones tomadas hasta ahora

## ADR-001 — Stack tecnológico V1

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: Arquitectura

### Contexto
Necesitamos decidir el stack para Óptica Carballo V1. El founder ya tiene experiencia con un stack específico en su otro proyecto (productosvirales.com.ar).

### Decisión
- **Framework**: Next.js 15 (App Router) + TypeScript
- **DB / Auth / Storage**: Supabase
- **Hosting**: Vercel
- **Styling**: Tailwind CSS + shadcn/ui
- **Pagos**: Mercado Pago (Checkout Pro V1)
- **Email**: Resend
- **IA**: API LLM (Sonnet 4 default, Haiku para simple, Opus para complejo)
- **Embeddings**: OpenAI text-embedding-3-small + pgvector

### Alternativas consideradas
- Astro / Remix → menos curva de aprendizaje pero menor capitalización del know-how existente.
- Firebase → reemplazado por Supabase por consistencia con productosvirales.
- Stripe → no opera bien en Argentina; MP es el estándar local.

### Consecuencias
- ✅ Reutilizamos curva de aprendizaje del founder.
- ✅ Stack maduro, bien documentado, gran ecosistema.
- ⚠️ Vendor lock-in moderado con Vercel/Supabase (aceptable en V1).

### Cómo se valida
- Velocidad de implementación de features.
- Estabilidad en producción.
- Costo operativo mensual <$100 en V1.

---

## ADR-002 — Web PWA en V1, no app nativa

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: Arquitectura

### Contexto
Las opciones eran: web responsive (PWA) o app nativa (React Native/Expo) desde V1.

### Decisión
**Web responsive PWA**. App nativa queda para V3+ cuando haya tracción demostrada.

### Alternativas consideradas
- React Native desde día 1 → duplica trabajo sin justificación.
- Web no-PWA → pierde feature de instalación en celular.

### Consecuencias
- ✅ Una sola base de código.
- ✅ Instalable como app desde el celular.
- ⚠️ Algunas features nativas (cámara permisiva, push notifications avanzadas) son más limitadas en PWA.

### Cómo se valida
- % de uso mobile vs desktop.
- Si >70% mobile y usuarios piden app nativa → reevaluar.

---

## ADR-003 — Monorepo único

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: Arquitectura

### Contexto
¿Separar admin y storefront en repos distintos o unificar?

### Decisión
**Monorepo único**. Admin como ruta protegida `/admin` dentro del mismo Next.js.

### Consecuencias
- ✅ Menos overhead de mantenimiento.
- ✅ Compartir tipos, componentes, lógica.
- ⚠️ Hay que asegurar separación clara de bundles (admin no debe entrar al bundle público).

---

## ADR-004 — Estructura de URLs SEO

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: SEO

### Contexto
La arquitectura de URLs determina el techo SEO del proyecto. Decisiones:
- ¿`marcas/` como conector intermedio?
- ¿Features bajo categoría o nivel raíz?
- ¿`/guias/` o `/blog/`?
- ¿URLs de artículos planas o jerárquicas?
- ¿Páginas de "uso" (anteojos para computadora, etc.)?

### Decisión
- **Sin `marcas/` como conector**: `/anteojos-de-sol/rusty` (la marca es la keyword).
- **Features bajo categoría**: `/anteojos-de-sol/polarizados`.
- **`/guias/` (no `/blog/`)** — autoridad sobre entretenimiento.
- **URLs de artículos planas**: `/guias/[slug]`.
- **Sí páginas de uso**: `/anteojos-para-computadora`, `/anteojos-para-manejar`.
- **Categorías como entidades de primera clase**, no filtros.
- **Sin www, sin trailing slash, HTTPS obligatorio, hreflang es-AR**.

### Consecuencias
- ✅ URLs concentradas en keywords reales (validadas por keyword research).
- ✅ Estructura clara para crawlers.
- ✅ Páginas de marca pueden capturar volumen sustancial.

### Cómo se valida
- Crecimiento orgánico de páginas de marca en GSC.
- CTR mejor que benchmark de e-commerce (>3% en posiciones 1-10).

---

## ADR-005 — Patrón de variantes de producto

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: Producto

### Contexto
Un mismo modelo de anteojos tiene múltiples variantes (color, tamaño, color de lente). ¿Una publicación por variante o una publicación con variantes?

### Decisión
**Una publicación con variantes**. Modelo base + variants table con SKU vendible por combinación. URL canonical única, variantes via query param (no genera URLs nuevas indexables).

### Alternativas consideradas
- Publicación por variante (estilo ML/Amazon Seller) → canibalización SEO, reviews dispersas.

### Consecuencias
- ✅ Toda la autoridad SEO concentrada.
- ✅ Reviews unificadas por modelo.
- ✅ Menor mantenimiento.
- ⚠️ UI más compleja: el selector de variantes debe ser claro.

### Cómo se valida
- Conversión de página de producto.
- Ranking de keywords transaccionales del modelo.

---

## ADR-006 — Receta como entidad reusable

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: Producto

### Contexto
La receta oftalmológica del usuario puede usarse para múltiples compras a lo largo del tiempo.

### Decisión
Receta es entidad separada en DB (tabla `prescriptions`), vinculada al usuario, reusable. Se puede asociar a una orden específica o quedar guardada en perfil.

### Consecuencias
- ✅ Habilita reorders rápidos de lentes de contacto.
- ✅ Habilita "renová tu receta" cuando se acerca el vencimiento.
- ⚠️ Manejo de privacidad: la receta tiene datos sensibles (salud).

---

## ADR-007 — Snapshots en órdenes

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: Producto

### Contexto
Cuando se crea una orden, ¿guardamos sólo FKs a productos/direcciones o snapshot completo?

### Decisión
**Snapshot completo** de producto, precio, dirección al momento de la compra. FKs se mantienen para reportes pero los datos visibles vienen del snapshot.

### Consecuencias
- ✅ Las órdenes históricas son inmutables y precisas aunque el producto cambie de precio o nombre.
- ✅ Cumple con buenas prácticas contables y de defensa del consumidor.
- ⚠️ Más datos en DB pero el costo es marginal.

---

## ADR-008 — WhatsApp como canal complementario

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: Producto

### Contexto
WhatsApp es canal natural en Argentina. Pero ¿lo mantenemos como canal principal (todo termina ahí) o lo subordinamos al checkout directo?

### Decisión
**Checkout directo es el primario; WhatsApp es complementario** para casos que requieren asesoramiento (recetas complejas, productos donde el usuario duda). Handoff siempre con contexto pre-cargado (producto, receta, datos del cliente).

### Consecuencias
- ✅ Escalabilidad: no dependemos de respuesta manual 1:1.
- ✅ Métricas: trackeo claro de conversión.
- ✅ WhatsApp absorbe casos donde la fricción humana suma valor.
- ⚠️ Requiere disciplina para no convertir todo el flujo en handoff a WhatsApp.

### Cómo se valida
- Conversión por checkout directo > conversión por handoff a WhatsApp.
- Tiempo de respuesta en WhatsApp <2hs en horario hábil.

---

## ADR-009 — No vender colecciones de famosos sin confirmación de stock

**Fecha**: 2026-05-27
**Estado**: 🟡 Parcial — actualizado 2026-05-28
**Categoría**: Producto

### Contexto
Keyword research mostró volumen alto para colecciones de famosos (Las Oreiro 1.1k vol, Paula Cahen d'Anvers 1.1k, Valeria Mazza 1.1k, Teresa Calandra 1.1k, Pampita 500). Oportunidad SEO clara pero requiere stock real.

### Decisión
**No cargar colecciones de famosos hasta que el founder confirme qué stock real tiene**. Mejor cero que vender lo que no hay.

### Consecuencias
- ⚠️ Perdemos volumen SEO potencial inicialmente.
- ✅ Mantenemos integridad de la promesa "stock real".

### Actualización 2026-05-28
- ✅ **Paula Cahen D'Anvers**: stock confirmado por el founder. Se carga como marca activa (registrada en `BRANDS.md`).
- ❌ **Las Oreiro, Valeria Mazza, Teresa Calandra, Pampita**: NO confirmadas. Siguen fuera del catálogo.
- Estado neto: ADR-009 sigue vigente para las 4 colecciones no confirmadas. Para Paula Cahen, ya no aplica (resuelto).

---

## ADR-010 — Sí modelar "anteojos de sol con aumento"

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: Producto + SEO

### Contexto
Keyword research mostró 3.200 vol/mes para "anteojos de sol con aumento". Difficulty media. Categoría poco atacada por competencia argentina.

### Decisión
**Sí**, se modela como categoría específica: `/anteojos-de-sol/con-aumento`. Cruce de catálogo de sol + sistema de receta. Conecta con la feature del lector de receta IA.

### Consecuencias
- ✅ Atacamos cluster grande con baja competencia.
- ⚠️ Requiere proceso definido para armado (sol + receta = más pasos).

---

## ADR-011 — B2B mayorista no en V1

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: Producto

### Contexto
"Anteojos por mayor" 1.400 vol/mes. Oportunidad B2B real.

### Decisión
**Postergado a V2+**. La operación B2B requiere catálogo distinto, condiciones de pago distintas, mínimos, y flujo de cuenta corriente. Foco V1: B2C.

### Consecuencias
- ⚠️ Perdemos volumen B2B inicialmente.
- ✅ Foco operativo en V1.

---

## ADR-012 — Repositorio: `optica-carballo`

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: Operación

### Decisión
Nombre del repo y del proyecto en Vercel: `optica-carballo` (con guión).

---

## ADR-013 — Supabase Storage para imágenes de producto

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: Arquitectura

### Contexto
Opciones: Supabase Storage vs Cloudinary vs S3.

### Decisión
**Supabase Storage**. Mismo servicio que la DB, menos overhead, suficiente performance para V1.

### Consecuencias
- ✅ Un solo servicio para gestionar.
- ⚠️ Si volumen crece >50GB o necesitamos transformaciones avanzadas, reevaluar Cloudinary.

### Cómo se valida
- Si performance de imágenes (LCP) es buena en producción.
- Si costo de Storage <$10/mes.

---

## ADR-014 — Agent Manager Versión A para empezar

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: IA / Operación

### Contexto
Opciones para el agent-manager: Versión A (auditor sistemático) vs Versión B (self-improving meta-agent).

### Decisión
**Versión A**. Versión B se evaluará a los 4 meses de operación estable (~septiembre 2026), cuando haya datos suficientes y el sistema esté maduro.

### Consecuencias
- ✅ Predecible, confiable.
- ⚠️ Limita auto-mejora del propio meta-agente.

### Pendiente
- Reminder activado en memoria para revisar Versión B en septiembre 2026.

---

## ADR-015 — Mercado Pago Checkout Pro para V1

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: Pagos

### Contexto
Opciones de MP: Checkout Pro (redirección) vs Bricks (embebido) vs API custom (PCI).

### Decisión
**Checkout Pro** en V1. MP aloja la página de pago, redirección, webhooks confirman. Bricks se evalúa en V2 cuando madure el flujo.

### Consecuencias
- ✅ Implementación rápida.
- ✅ MP maneja PCI compliance.
- ⚠️ Menos control de UX en el paso de pago.

---

## ADR-016 — Tusfacturas.app para facturación electrónica

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente — pendiente de implementación
**Categoría**: Pagos / AFIP

### Contexto
Opciones para facturación electrónica AFIP: Tusfacturas, Afipsdk, Contabilium, MP Facturación.

### Decisión
**Tusfacturas.app** por simplicidad de integración y costo. Se valida en implementación.

### Cómo se valida
- Costo mensual razonable.
- API funcional, sin errores frecuentes.
- Si presenta problemas, evaluar migración a alternativa.

---

## ADR-017 — Andreani principal + Correo Argentino fallback

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: Logística

### Decisión
- **Andreani**: operador principal (sucursales y domicilio).
- **Correo Argentino**: fallback para CPs donde Andreani no cubre.
- **Retiro en local Virasoro**: tercer opción (gratis).

### V1 simplificación
Tabla fija de costos por zona, no cotización en tiempo real. Integrar API después.

---

## ADR-018 — Conexión futura con NeuralRouting

**Fecha**: 2026-05-27
**Estado**: 🟡 En revisión (depende de NeuralRouting llegar a prod estable)
**Categoría**: IA

### Contexto
El founder desarrolla NeuralRouting.io (gateway de LLMs con cache, routing, PII filter, loop detection).

### Decisión
- **V1**: llamadas directas a la API del proveedor de IA.
- **Futuro**: cuando NeuralRouting esté estable en producción, considerar migración a NeuralRouting como gateway para Óptica Carballo (ahorro por cache, routing automático Haiku/Sonnet/Opus).

### Pendiente
- Evaluación cuando NeuralRouting tenga SLA estable.
- Comparar costo y latencia de ambas opciones.

---

# Decisiones SEO derivadas del keyword research

## ADR-019 — Prioridad de carga de catálogo

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: SEO / Producto

### Contexto
Keyword research mostró que marcas argentinas tienen volumen alto y dificultad baja (Rusty 6k/diff 9, Reef 3.4k/diff 7, Vulk 2.5k/diff 8, Prune 2k/diff 6, etc.).

### Decisión
**Orden de prioridad de carga de catálogo**:
1. Marcas argentinas top (Rusty, Reef, Vulk, Prune, Infinit, Union Pacific, Wanama, Orbital) — todas con páginas /hombre y /mujer.
2. Marcas internacionales top (Ray-Ban, Oakley, Prada, Versace, Tiffany, Miu Miu).
3. Colecciones de famosos (si stock confirmado — ver ADR-009).
4. Categorías por forma (Redondos, Cuadrados, Aviador, Wayfarer, Rectangulares).
5. Features (Polarizados, Deportivos, Con aumento, Ofertas).
6. Categorías por forma de cara.

### Consecuencias
- ✅ Maximiza ROI SEO en las primeras semanas.
- ⚠️ Requiere disciplina para no saltar al cluster que parece más interesante.

---

## ADR-020 — Pillar pages + topic clusters

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: SEO / Contenido

### Decisión
**Estrategia editorial**: pillar pages + clusters temáticos. Clusters principales:
1. Astigmatismo
2. Miopía
3. Hipermetropía
4. Presbicia
5. Anteojos para computadora / fatiga visual digital
6. Lentes de contacto
7. Cómo elegir anteojos
8. Cómo leer una receta
9. Tendencias y moda

Cada pillar 3000-5000 palabras, satélites 1200-2000 palabras, internal linking bidireccional.

---

# Decisiones de IA

## ADR-021 — Stack de modelos IA

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: IA

### Decisión
- **Default**: Sonnet 4 (model id: `claude-sonnet-4-20250514`).
- **Tareas simples / alto volumen**: Haiku 4.5.
- **Tareas críticas / alta calidad**: Opus 4.7.
- **Vision**: Sonnet con `image` content blocks.
- **Embeddings**: OpenAI `text-embedding-3-small`.
- **Vector store**: pgvector en Supabase.

### Cómo se valida
- Costo IA total <$100/mes en V1, <$300/mes con tracción.
- Calidad de outputs evaluada manualmente en muestras.

---

## ADR-023 — Semántica del flag `is_argentine` en tabla `brands`

**Fecha**: 2026-05-28
**Estado**: 🟢 Vigente
**Categoría**: Producto / Schema

### Contexto
El schema de `brands` tiene una columna `is_argentine boolean`. Inicialmente pensada como "marca de origen argentino estricto" (Rusty, Vulk, Prune, etc.). Cuando el founder confirmó las 5 marcas que efectivamente trabaja (Rusty, Vulk, Reef, Mormaii, Paula Cahen D'Anvers), decidió marcar **Mormaii como argentina** aunque sea de **origen brasilero**.

### Decisión
**El flag `is_argentine` significa: "marca que la óptica posiciona como local / pensada como marca argentina en el catálogo".**

NO significa "marca con sede / fundación en Argentina estrictamente".

### Alternativas consideradas
- Mantener `is_argentine = false` para Mormaii (estricto origen) → rechazado por el founder.
- Renombrar el campo a `is_local_presence` o `is_argentine_market` → descartado para evitar migración ahora; cambio cosmético se puede hacer después si crece la confusión.
- Agregar un segundo campo `country_of_origin text` → posible feature futura para SEO/transparencia pero no en V1.

### Consecuencias
- ✅ El founder controla qué marcas aparecen en futuros filtros tipo "marcas argentinas" / "marcas locales".
- ⚠️ Si más adelante hacemos contenido SEO sobre "marcas argentinas de anteojos" (artículo, página de categoría), tenemos que ser claros: el catálogo lista marcas "locales", no necesariamente "fundadas en AR". Para evitar engañar al usuario, en el copy podemos decir "marcas con presencia local fuerte" en vez de "marcas argentinas".
- ⚠️ La data en `is_argentine` no sirve como fuente de verdad para schema.org `Brand.foundingLocation`. Para eso necesitaríamos un campo separado en el futuro.

### Cómo se valida
- Si un usuario se queja en feedback que Mormaii no es argentina → revisar el copy de las páginas que usen ese flag para que no afirme "marca argentina" sin matiz.
- Si crece la fricción → agregar `country_of_origin` como columna nueva (`ALTER TABLE`) y refactor.

---

## ADR-022 — Defensa contra prompt injection

**Fecha**: 2026-05-27
**Estado**: 🟢 Vigente
**Categoría**: IA / Seguridad

### Decisión
Reglas duras aplicadas en todas las features de IA:
- User content nunca como instrucción.
- Separación XML clara en prompts.
- Whitelist de tools.
- System prompts no expuestos al usuario.
- Validación post-output (schema).
- Rate limiting por usuario/IP.
- Texto en imágenes tratado como contenido, no como instrucciones (crítico en lector de receta).

---

# Pendiente de decisión (no resueltas todavía)

## PEND-001 — Categoría fiscal del negocio

**Estado**: Pendiente
**Categoría**: Pagos / AFIP

¿Óptica Carballo es Responsable Inscripto o Monotributo categoría alta? Necesario para configurar facturación electrónica correctamente.

## PEND-002 — Stock de colecciones de famosos

**Estado**: Pendiente
**Categoría**: Producto

Ver ADR-009. Founder debe inventariar y confirmar.

## PEND-003 — Dominio: redirects de URLs viejas

**Estado**: Pendiente
**Categoría**: SEO

El sitio viejo era Mercadoshops. ¿Hay URLs indexadas en Wayback Machine o GSC que valga redirectar para preservar autoridad? Investigar.

## PEND-004 — Acceso a panel ML para exportar histórico

**Estado**: Pendiente
**Categoría**: Operación

Aprovechar 2000+ ventas en ML para extraer: top productos, reviews, fotos, descripciones. Esquema del skill `/migration-from-ml` listo para esto.

## PEND-005 — Cuentas creadas

**Estado**: 🟡 Parcial (actualizado 2026-05-27 en sesión de setup)
**Categoría**: Operación

Cuentas a confirmar/crear:
- [ ] Vercel
- [x] **Supabase** — proyecto cloud `tuddpfspnbnmafsqdvat` operativo, credenciales en `.env.local` (no commiteadas).
- [ ] Resend
- [ ] Mercado Pago (developer)
- [ ] Tusfacturas
- [ ] API IA (LLM provider)
- [ ] OpenAI API (para embeddings)
- [ ] Google Search Console (con dominio verificado)
- [ ] Google Analytics 4

### Notas sobre Supabase (cerrado 2026-05-27)
- Proyecto cloud creado por el founder antes/durante la sesión de setup técnico inicial.
- Anon key y service_role key configuradas en `.env.local` local del founder.
- ✅ **2026-05-28**: migración 00001 (`catalog_foundation`) + seeds (marcas + categorías + productos Rusty placeholder) aplicados al cloud vía Dashboard SQL Editor (founder pegó manualmente el archivo combinado `supabase/cloud-bootstrap.sql`). Validado end-to-end con `pnpm dev` contra cloud.
- Para futuras migraciones: o bien pasar el SQL al founder para Dashboard, o linkear con `supabase link --project-ref tuddpfspnbnmafsqdvat` + `supabase db push` (requiere DB password).

---

## ADR-024 — Integración con Mercado Libre: sync bidireccional de stock vía API + webhooks

**Fecha**: 2026-05-29
**Estado**: 🟡 En revisión (Sprint 1 implementado, Sprint 2 y 3 pendientes)
**Categoría**: Arquitectura | Operación | Marketplace

### Contexto

Founder vende activamente en Mercado Libre desde hace años, y ahora también va a vender desde el sitio propio. Surge el riesgo de **oversell**: si un anteojo se vende en un canal y el stock no baja en el otro, podemos comprometer un producto que ya no tenemos físicamente.

Founder pidió "que cuando se vende en ML baje stock en la página y viceversa".

### Decisión

**Sync bidireccional de stock entre Supabase (sitio propio) y Mercado Libre (marketplace) vía API + webhooks**.

**Source of truth: Supabase**. Mercado Libre refleja el estado de stock que figura en Supabase. Cada venta en cualquier canal sincroniza el otro.

**Componentes**:

1. **Mapping explícito por variante**: campo nuevo `mercadolibre_item_id` en `product_variants`. Cuando el founder publica un producto en ambos lados, registra el ID de ML en la variante del sitio. Sin mapping → no se sincroniza.

2. **OAuth 2.0 + token persistido**: el founder autoriza la app una vez vía OAuth (developers.mercadolibre.com.ar). Tokens (`access_token` + `refresh_token`) se guardan cifrados en tabla `marketplace_integrations`. Refresh automático antes de expirar.

3. **Webhook receiver** (`POST /api/ml/webhook`): ML notifica cambios de items u orders. Validamos firma HMAC, parseamos payload, actualizamos stock en Supabase.

4. **Push de stock desde el sitio** (sobre venta confirmada): cuando MP webhook nos confirma una venta del sitio (`mp_webhook`), llamamos `PUT /items/{ml_id}` a la API de ML para bajar stock.

5. **Reconciliación periódica**: cron daily lee stocks de ML para todos los items mapeados y compara contra Supabase. Si hay drift → log + alerta al founder.

6. **Admin UI** en `/mi-cuenta/marketplace`: estado de sincronización, errores recientes, botón de reautorizar OAuth, ver mappings.

### Alternativas consideradas

**A. Source of truth: ML** — Sitio lee stock de ML en tiempo real, no guarda nada local.
- **Rechazado**: latencia alta (200-500ms por producto en cada PDP), atado a uptime de ML, no escalable a otros marketplaces futuros (TiendaNube, Shopify, etc.).

**B. Polling periódico** — Sin webhooks, cron cada N minutos lee ML y actualiza Supabase.
- **Rechazado**: ventana de inconsistencia de N minutos = riesgo de oversell. Aceptable solo si ventas/día << 10.

**C. Sync manual** — Founder actualiza ambos a mano.
- **Rechazado**: no escala. Error humano garantizado tras 1 mes.

**D. Servicio third-party** (BoxFlow, Tray, Shopify Marketplace Sync).
- **Rechazado**: costo mensual recurrente ($30-100/mes), curva de aprendizaje propia, vendor lock-in. Custom integration es mejor para 1 marca con catálogo chico.

**E. Versión simple iter 1: solo alertas, sin sync automático** — Sitio escucha webhook de ML y nos manda email "actualizá stock".
- **Rechazado por founder en planning**: prefirió arrancar directo con sync completo.

### Consecuencias

**Positivas**:
- 0 oversell en condiciones normales (race conditions sub-segundo siguen siendo posibles pero raras).
- Founder no actualiza manualmente.
- Arquitectura extensible: el mismo patrón sirve para sumar Tiendanube, Shopify, etc.
- Logs y observabilidad propias.

**Negativas**:
- 2-3 sprints de desarrollo iniciales.
- Mantenimiento ante cambios en API de ML (esperable cada 1-2 años).
- Founder tiene que registrar app en ML + autorizar (acción manual única).
- Token OAuth puede expirar/invalidarse si no se refresca → en ese caso el sync se pausa hasta re-autorización.

**Riesgos**:
- **Race condition sub-segundo**: dos clientes compran al mismo segundo, uno en cada canal. Mitigamos con `reserve_stock` atómico (función SQL ya existente) — el último update gana, el segundo cliente ve "sin stock" si llegamos al sub-segundo, aceptable.
- **Webhook firma mal validada**: si no validamos HMAC, atacante podría enviarnos fake webhooks. Validación obligatoria.
- **ML API rate limit**: 1000 calls/hora por usuario. Suficiente para volumen actual y previsible. Si crece, podemos pedir aumento a ML.
- **Drift no detectado**: si webhook de ML se pierde y la reconciliación cron no corre, stock real puede divergir. Cron daily + alerta al founder mitigamos.

### Cómo se valida

- Después de Sprint 3: hacer venta de prueba en ML → verificar que stock baja en Supabase en < 5 segundos.
- Hacer venta de prueba en sitio → verificar que stock baja en ML en < 5 segundos.
- Métricas a trackear:
  - `marketplace_integrations.last_sync_at` → debería actualizarse cada vez que llega webhook.
  - Count de items con drift detectado por cron → idealmente 0.
  - Errores de API ML logged en tabla nueva `marketplace_sync_errors`.

### Sprints

**Sprint 1 (Foundations, 2026-05-29)** — NO requiere credenciales del founder.
- ✅ ADR (este documento).
- ✅ Migration tabla `marketplace_integrations` + columna `mercadolibre_item_id` en `product_variants`.
- ✅ Estructura `lib/integrations/mercadolibre/` con types + Zod schemas.
- ✅ Update PRODUCT_SCHEMA.md con el nuevo campo.

**Sprint 2 (OAuth + webhook)** — REQUIERE credenciales del founder (App ID + Secret Key registrada en developers.mercadolibre.com.ar).
- OAuth flow (initiation + callback + token storage).
- Refresh token automático.
- Webhook receiver `/api/ml/webhook` con validación HMAC.

**Sprint 3 (sync activo)** — REQUIERE Sprint 2 funcionando + mapping de productos.
- Server action `pushStockToML(variantId, newQty)`.
- Procesamiento del webhook ML → update Supabase.
- Admin UI `/mi-cuenta/marketplace`.
- Cron de reconciliación diaria.
- Tabla `marketplace_sync_errors` para logs.

---

## Notas finales

Este archivo NO se modifica casualmente. Cada cambio:
1. Pasa por el agent-manager o por el founder explícitamente.
2. Si una decisión cambia, NO se borra la entrada original — se marca el estado y se referencia el nuevo ADR.
3. El número de ADR es secuencial y no se reutiliza.
