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
**Estado**: 🔴 Revertido por ADR-026 (2026-06-08) — nunca se integró Andreani
**Categoría**: Logística

### Decisión (original, ya NO vigente)
- **Andreani**: operador principal (sucursales y domicilio).
- **Correo Argentino**: fallback para CPs donde Andreani no cubre.
- **Retiro en local Virasoro**: tercer opción (gratis).

### V1 simplificación
Tabla fija de costos por zona, no cotización en tiempo real. Integrar API después.

> **Revertido**: en la práctica se integró SOLO Correo Argentino (MiCorreo, API `/rates` + `/agencies`) y nunca Andreani. El founder ratificó Correo Argentino como único operador. Ver **ADR-026**.

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
**Estado**: 🟢 Vigente — Sprints 1-3 implementados y en producción (corregido 2026-09-29, este
documento decía "Sprint 2/3 pendientes" desde mayo pese a que ya estaban hechos). Verificado contra
Cloud: `marketplace_integrations` tiene una fila `mercadolibre` con `status=active` y token
refrescándose solo; cron `ml-reconcile-stock` + `ml-ventas` corren cada hora (`vercel.json`). Único
punto de los Sprints 1-3 que sigue sin hacer: la admin UI `/mi-cuenta/marketplace` (el mapping
`mercadolibre_item_id` se sigue haciendo a mano por SQL en cada seed, no hay pantalla dedicada).
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

**Sprint 2 (OAuth + webhook)** — ✅ completo (verificado 2026-09-29).
- ✅ OAuth flow (initiation + callback + token storage) — `app/api/ml/oauth/`.
- ✅ Refresh token automático — token en Cloud se renueva solo, confirmado por `token_expires_at`.
- ✅ Webhook receiver `/api/ml/webhook`.

**Sprint 3 (sync activo)** — ✅ completo salvo la admin UI (verificado 2026-09-29).
- ✅ Sync de stock — `lib/integrations/mercadolibre/sync-stock.ts`.
- ✅ Procesamiento del webhook ML → update Supabase.
- ⬜ Admin UI `/mi-cuenta/marketplace` — **sigue sin existir**, el mapping se hace a mano por SQL.
- ✅ Cron de reconciliación — `ml-reconcile-stock`, cada hora (no diaria como decía el plan original).
- ✅ Órdenes de ML — `ml-ventas`, cada hora (no estaba en el plan original de este ADR, se sumó
  después — `lib/integrations/mercadolibre/orders.ts`).
- Tabla `marketplace_sync_errors` para logs: no confirmado en esta revisión, pendiente de verificar.

---

## ADR-025 — HyperFrames para videos de producto (HTML→MP4)

**Fecha**: 2026-06-06
**Estado**: 🟢 Vigente
**Categoría**: Contenido | Operación

### Contexto
Necesitamos videos de producto para redes (Instagram) y para embeber en la web, sin grabar nada y aprovechando que ya tenemos datos de producto + fotos + identidad de marca. El founder propuso HyperFrames (`npx hyperframes`, open-source de HeyGen): se define el video como HTML/CSS/JS y la CLI lo renderiza a MP4 determinístico (Chrome headless + FFmpeg, frame a frame seekeando un timeline GSAP en pausa).

### Decisión
Adoptar HyperFrames como herramienta de generación de videos de producto. Vive en `marketing/product-video/` (proyecto aislado, **no** es dependencia del app de Next). Template data-driven (`data.js`) reutilizable por modelo. Primer formato: 1:1 (1080×1080). FFmpeg/FFprobe vía `ffmpeg-static`/`ffprobe-static` (sin instalar nada global). Fuentes: nombres mapeados por HyperFrames (Inter + Playfair Display), sin Google Fonts, para render determinístico offline.

### Alternativas consideradas
- **Editor de video manual (Canva/CapCut/Premiere)**: no versionable, no data-driven, no escala a N productos. HyperFrames templatiza y reusa.
- **Remotion (React→video)**: más potente pero suma React + más peso; HyperFrames es HTML plano y más simple (regla "simple sobre clever"). Reevaluable si necesitamos lógica compleja.
- **Instalar FFmpeg vía Homebrew**: cambio global del sistema; preferimos binarios aislados por proyecto.

### Consecuencias
- Positivas: videos reproducibles, versionados, baratos de generar para cualquier producto; cero dependencia nueva en el app de producción.
- Negativas: la CLI baja Chrome headless + FFmpeg (varios cientos de MB la primera vez); render ~5-17s por video en esta máquina.
- Riesgos: tool joven (v0.6.x), API puede cambiar (pin de versión `@0.6.76` en los scripts). Claims de negocio en los videos deben respetar BUSINESS_POLICIES (no inventar cuotas/promos).

### Cómo se valida
El founder aprueba el primer video (Rusty Esvep). Si sirve, se reusa el template para más modelos y se evalúa una variante vertical 9:16 para reels.

---

## ADR-026 — Correo Argentino (MiCorreo) como único operador de envíos

**Fecha**: 2026-06-08
**Estado**: 🟢 Vigente (revierte ADR-017)
**Categoría**: Logística

### Contexto
El ADR-017 (2026-05-27) definía Andreani como operador principal y Correo Argentino como fallback, con tabla fija de costos. En la práctica, la única integración construida fue **MiCorreo (Correo Argentino)**: API `/rates` (cotización domicilio + sucursal) + `/agencies` (sucursales), en `lib/correo/` + `lib/shipping-server.ts`. Nunca se integró Andreani. El founder ratificó (2026-06-08) que los envíos son **solo por Correo Argentino**.

### Decisión
- **Correo Argentino (MiCorreo) es el único operador de envíos.** Modos: domicilio (D) y sucursal del Correo (S), más retiro gratis en el local de Virasoro (pickup).
- **Andreani queda descartado** (no se menciona en UI, emails, copy ni docs).
- La **tabla por zonas** (`lib/shipping.ts`) queda como **fallback** (API caída / sin configurar) y para los estimadores client-side (carrito + PDP), donde no se puede llamar a la API secreta server-only.

### Consecuencias
- Positivas: una sola integración que mantener; cotización real a domicilio/sucursal; sucursal ~$3k más barata que domicilio para el cliente.
- Negativas/pendientes: el alta automática del envío + tracking (Fase 3, `/shipping/import`) NO está hecha → el tracking hoy es manual. Cobertura de Correo: algunos CPs no cotizables caen al fallback de tabla (ver CURRENT_STATE).
- Limpieza aplicada: se quitó "Andreani" de UI pública, email de venta, chatbot, FAQ, trust signals, seed SEO (Rusty, en DB) y docs (CLAUDE.md, ARCHITECTURE, BUSINESS_POLICIES, README, METRICS).

### Cómo se valida
Cotización validada contra producción (login + `/rates` + `/agencies`, read-only). El checkout e2e ya creó órdenes con envío a domicilio/sucursal/pickup correctamente.

---

## ADR-027 — Publicación en Instagram con la API oficial de Meta, no con un servicio de terceros

**Fecha**: 2026-08-25
**Estado**: 🟢 Vigente
**Categoría**: Marketing / Integraciones

### Contexto
Toda publicación en @optica.carballo se hacía a mano: armar la placa en la compu, pasarla al
celular, subirla. Con el catálogo creciendo y las placas ya generadas por código, el cuello de
botella pasó a ser el subir, no el producir.

Dos caminos: un servicio de terceros de programación de posts (Buffer, Later, Metricool,
Ayrshare) o la API de publicación de contenido de Meta directo.

La cuenta ya es Business y está vinculada a una página de Facebook, que es el requisito duro de
Meta. Y como solo publicamos en nuestra propia cuenta, **no hace falta App Review** — eso es lo
que suele hacer inviable el camino directo, y acá no aplica.

### Decisión
- **API oficial de Meta (Instagram Content Publishing), sin intermediarios.** Todo el código
  aislado en `lib/integrations/instagram/`.
- **El programador es nuestro**: la API de Instagram no tiene publicación programada. La cola
  vive en `social_posts` y un cron de Vercel la despacha.
- **El token vive cifrado en `marketplace_integrations`** (misma tabla y mismo AES-256-GCM que
  Mercado Libre), no en una env var. Se renueva solo con 7 días de anticipación.
- **Las publicaciones generadas automáticamente (producto, baja de precio) se encolan como
  `draft` y las aprueba el founder**, no salen solas.

### Por qué no un servicio de terceros
- Costo mensual recurrente en dólares por algo que son dos llamadas HTTP.
- Habría que subirles las placas a su storage, con nuestro catálogo y precios adentro.
- Las placas se generan desde el repo (`build.py`, `scripts/lib/placas-*.ts`): meter un servicio
  externo en el medio parte el flujo en dos y agrega un paso manual, que es justo lo que se
  quería sacar.
- Un intermediario más que puede romperse, y que igual depende de la misma API de Meta.

### Por qué aprobación manual en lo generado
La regla dura del negocio dice que no prometemos lo que no podemos cumplir. Una placa
autogenerada con un precio desactualizado o un stock que ya se vendió es exactamente eso, y en
el feed no se puede deshacer: se borra, pero ya la vieron. El costo de aprobar con un click es
mucho más bajo que el de publicar mal.

### Consecuencias
- Positivas: cero costo recurrente; las placas van del repo a Instagram sin escalas; el mismo
  historial (`social_posts`) sirva lo que salió a mano o programado.
- Negativas / límites que son de Meta y no del código:
  - Las historias por API van **sin stickers**: ni link, ni encuestas, ni preguntas, ni música.
    Una historia que necesite el sticker de link va a mano.
  - Solo JPEG; el feed solo acepta entre 4:5 y 1.91:1 (una placa de historia no sirve para feed).
  - 100 publicaciones por cuenta cada 24 h.
  - Carruseles y reels quedan fuera del alcance inicial.
- El token vence a los 60 días y **no hay refresh token**: si se deja vencer hay que generar uno
  a mano. Por eso la renovación anticipada y el aviso por mail si falla.

### Addendum 2026-08-25 (fase 3) — dónde se genera la placa y de dónde sale el disparador

Dos cosas se resolvieron distinto de lo planeado, por evidencia que apareció al construir:

**1. La placa de producto se genera en la máquina del founder, no en Vercel.** Se dibuja con
SVG + `sharp` y necesita las tipografías de `assets/placas/fonts/` (Anton, DM Sans), que
`asegurarFuentes()` instala en el sistema. El runtime de Vercel no garantiza fuentes, y la
alternativa (bundlear fontconfig) no se puede verificar sin deployar. Como la aprobación manual
ya era la decisión, generar local no saca nada: el founder igual tenía que mirar la placa antes
de que salga.

**2. El disparador NO se colgó de `check-alerts`.** El plan decía engancharlo ahí, pero al
mirar la base hay **0 alertas de clientes activas** — y aunque hubiera, esa tabla solo cubre los
productos que alguien siguió, justo al revés de lo que se necesita. Se agregó
`social_price_watch`: una foto del precio y el stock de cada variante, que un cron diario compara
para detectar bajas (piso del 3%) y stock que vuelve. Avisa por mail con el comando exacto; no
encola ni publica.

### Cómo se valida
`pnpm ig:token` muestra estado y cupo. `pnpm ig:post --dry-run` sube la imagen y crea el
container sin publicar. La prueba real se hace con una **historia**, que se borra sola en 24 h.

## ADR-028 — Chatbot de WhatsApp: API oficial de Meta en modo coexistencia, V1 "responder y derivar"

**Fecha:** 2026-11-19 · **Estado:** propuesta aprobada por el founder (alcance y número); sin construir.

### Decisión
- **Canal:** WhatsApp Cloud API oficial de Meta, con el **mismo número** de la óptica en **modo coexistencia** (el bot atiende y el equipo puede seguir contestando desde la app WhatsApp Business). Hay que verificar en Meta que la cuenta sea elegible antes de construir; si no lo es, plan B = número nuevo para el bot.
- **V1 = responder y derivar:** catálogo (reutiliza el RAG de `app/api/chat` + `lib/chat/`), horarios, envíos y garantía; ante receta o duda compleja avisa al equipo y deriva a humano. NO toma pedidos (ADR-008: el checkout directo es el primario).
- **Portfolio (aprobado 2026-11-19):** la verificación va en un portfolio de Meta aparte solo para la óptica ("Óptica Carballo", id 1055140104677351), NO en "Juan Mirande 1" (donde están los proyectos personales del founder). La app de WhatsApp se crea NUEVA dentro de ese portfolio; la Página y la app de Instagram (ADR-027) no se mueven.
- **App de Meta (2026-11-19):** "Óptica Carballo Bot", id 1687718589624595, creada dentro del portfolio "Óptica Carballo" (sin verificar: Meta indicó que no hace falta por ahora).
- **Avisos de derivación (2026-11-19):** llegan por mail (Resend) a hola@opticacarballo.com.ar, variable `WHATSAPP_ALERT_EMAIL`; a confirmar con una prueba que esa casilla recibe.
- **Diseño del bot (2026-11-19, tras revisión de `ai-features-engineer`):** interruptor general `WHATSAPP_BOT_ENABLED` (solo contesta si vale exactamente `true`; apagado, el webhook valida y descarta sin guardar nada); el mensaje se guarda ANTES de contestar 200 y se procesa con `after()`; solo se atienden los campos `messages` y `smb_message_echoes` (el evento `history` se descarta); si una persona contesta desde la app el bot se calla 12 h, y tras derivar también 12 h (con vencimiento, nunca eterna); límites 12/h y 40/día entrantes por número, 8/h salientes y tope global diario (default 500); derivación por reglas fijas antes de la IA (graduación escrita, síntomas, reclamo, pide persona) y por la herramienta `derivar_a_humano`; filtro de salida determinístico (solo links a opticacarballo.com.ar, sin mails ni teléfonos, sin 'estamos abiertos', sin plazos ni garantía propia); el bot no guarda imágenes ni audios (solo el tipo) y no interpreta recetas. **Fuera de V1 (a propósito):** precios en las respuestas (hay que leer el precio vigente de la tabla de productos, no del embedding).
- **Privacidad y consentimiento (2026-11-19, tras revisión de `argentine-ecom`):** EE.UU. no tiene nivel de protección adecuado (Ley 25.326 art. 12, Disp. 60-E/2016) → se informa y se pide consentimiento: el PRIMER mensaje de cada conversación recibe solo un aviso fijo (asistente virtual con IA, el texto va a OpenAI/Anthropic en EE.UU., se guarda hasta 90 días, no mandar datos de salud, link a la política) y NO se procesa con IA; seguir la conversación = aceptar; la IA arranca con el mensaje siguiente (`aviso_enviado_at`). Antes de eso, las reglas fijas (graduación, síntomas, reclamo, pedir persona, pedir borrar/acceder a datos) derivan a una persona sin IA. **Retención:** mensajes a 90 días (12 meses si se derivó), cron diario `/api/cron/whatsapp-retencion` + función SQL `whatsapp_purgar_mensajes`. **Supresión a pedido:** `pnpm whatsapp:borrar <número> --confirmar`. Política de privacidad actualizada (titular Juan Leopoldo Mirande, CUIT, domicilio, contacto hola@, WhatsApp/IA/transferencia, plazos legales 10 días corridos y 5 días hábiles, leyenda de la AAIP, eliminación de datos). **Pendiente del founder:** inscribir la base en el Registro Nacional de Bases de Datos de la AAIP (vía TAD, el agente no encontró una excepción para una base de clientes) y revisar la política con un abogado una vez.
- Complementa ADR-008; no lo reemplaza.

### Consecuencias
- Los mensajes que manda la API tienen costo por conversación según la tarifa de Meta; los de la app son gratis.
- En coexistencia no hay llamadas de voz por la API.
- Reglas del bot: nunca prometer stock ni plazos fuera de lo publicado, nada de afirmaciones ópticas sin validar, no vender recetados sin receta.

---

## ADR-029 — Reclamos y devoluciones de Mercado Libre: tarea programada de sólo lectura

**Fecha:** 2026-11-26 · **Estado:** plan aprobado por el founder; código escrito, sin aplicar ni publicar.
**Categoría:** Arquitectura | Operación | Marketplace

### Contexto
`ml-ventas` trae lo que se vendió. No se sabía qué volvió, por qué ni cuántos días después de la entrega (hay compradores que abusan de la Compra Protegida).

### Decisión
- Tarea horaria `/api/cron/ml-reclamos` (minuto 20, para no coincidir con las de :00 que comparten token y límite de pedidos). Sin webhooks. Complementa ADR-024.
- Tabla `marketplace_claims`, un renglón por reclamo, upsert por `(marketplace, claim_id)`. Cruce con `marketplace_orders` por `order_external_id` / `pack_id`, sin clave foránea.
- **Sólo GET a ML.** Nada de responder, subir evidencia, aprobar devoluciones ni mover plata. No se piden mensajes.
- **Sin `payload` crudo** (a diferencia de `marketplace_orders`) ni datos del comprador.
- RLS sin policies. Ni el Facturador ni el sistema de la óptica leen esta tabla todavía: si hace falta, va en una migración aparte.
- Un disparador conserva lo guardado cuando llega vacío. Si un reclamo se reabre quedan `closed_at` y la resolución anteriores: manda `status`.
- `refunded_at` es aproximada (`refunded_at_source`): última modificación del pago devuelto en la orden, o fecha de la resolución `payment_refunded`. El `refund_at` de la devolución NO es una fecha sino la regla de cuándo se reembolsa (`return_refund_trigger`).
- `days_from_delivery_to_claim` = días de 24 h entre la entrega del envío original y la apertura del reclamo.
- Un reclamo cerrado se deja de mirar cuando no tiene nada pendiente, o a los 90 días del cierre. Un error que no es de red se reintenta 48 h desde que se vio el reclamo.
- Reclamos sobre el envío: se cruzan por `marketplace_orders.shipment_id`; si no, por el `order_id` del envío.

### Confirmado contra la API (consulta de prueba del founder, sólo la búsqueda)
Permiso de la app; `status` obligatorio (`players.*` y `range` no cuentan como filtro); `range` por `last_updated` con `sort=last_updated:desc` y fechas con milisegundos y `+00:00`; `resource` puede ser `order` o `shipment`; no viene `related_entities`. Por eso: dos búsquedas (abiertos con `players`, cerrados con `range` sin `players`, que son las combinaciones probadas) y la devolución se pide por reclamo.

### Sin confirmar contra la API real
- Que la búsqueda traiga `players` (si no, una compra propia cerrada podría entrar) y que el paginado con `offset` > 0 funcione.
- Detalle por id, motivos y devoluciones: ruta, permiso y forma de la respuesta. Sin devolución se espera 404; si es otro error, se reintenta 48 h y se deja.
- `GET /shipments/{id}`: `order_id`, `status_history`, `tracking_number`, `tracking_method`.
- Que `date_last_modified` del pago refleje el día del reembolso.

### Consecuencias
- Positivas: motivo y plazos junto a cada venta; costo bajo por hora (lo cerrado sin cambios no se vuelve a pedir).
- Riesgos: la documentación oficial no se pudo abrir directamente (403); la primera corrida puede obligar a ajustar nombres de campos de lo que no es la búsqueda.

### Cómo se valida
Consulta de prueba en HTTP 200 (hecho) → primera carga de 90 días sin `errores` → comparar 3 reclamos contra el panel de ML (motivo, estado, fecha de entrega, seguimiento).


### Ampliación 2026-11-28 (postventa) — reemplaza lo anterior donde difiera
- Se guardan número de usuario y apodo del comprador (nunca nombre ni dirección), turno, plazos, impacto, artículos de la venta y de la devolución.
- Una lectura que falló no pisa; una respuesta válida vacía sí en turno, plazos y devolución: el conector no manda esas columnas cuando falla y el disparador no las conserva.
- Hay webhooks (`post_purchase`): contestar y procesar con `after()`. La tarea horaria sigue siendo la garantía.
- Correos sin repetir: `notified` por hecho, tomado de forma atómica en la base, con clave de idempotencia en Resend.
- Lo que llega al depósito de Mercado Libre no cuenta como devolución entregada (`return_delivered_at` queda vacío).
- La API ya confirma las formas de detalle, acciones, impacto, devolución v2, orden y reputación (lectura del 28/11).
---

## Notas finales

Este archivo NO se modifica casualmente. Cada cambio:
1. Pasa por el agent-manager o por el founder explícitamente.
2. Si una decisión cambia, NO se borra la entrada original — se marca el estado y se referencia el nuevo ADR.
3. El número de ADR es secuencial y no se reutiliza.
