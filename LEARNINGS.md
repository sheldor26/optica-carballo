# Óptica Carballo — Learnings Log

## Qué es este archivo

El opuesto de `MISTAKES.md`. Documenta **qué funciona bien** — patrones, approaches y decisiones que produjeron buenos resultados.

Sirve para:
- **Replicar lo que funciona** en otras áreas del proyecto.
- **Convertir patterns en reglas** permanentes del sistema cuando se prueban repetidamente.
- **Entrenar al `agent-manager`** a reconocer patrones de éxito.
- **Recordar por qué algo funciona** (no solo el qué).

## Reglas

1. **Documentar dentro de las 48 horas** del éxito. Si esperás más, se pierde el detalle.
2. **Ser específico**. "Funciona bien" no sirve; "X aumentó conversión Y% por Z razón" sí.
3. **Buscar la causa real**, no la correlación. ¿Por qué funcionó realmente?
4. **Cuando un learning se confirma 3+ veces**: candidato a ser regla permanente en CLAUDE.md o en algún agente.
5. **El `agent-manager` revisa esto en cada `/agent-review`** para identificar patrones a sistematizar.

---

# Log de learnings

## 2026-06-11 — Cuando el founder dice "no surte efecto", curlear el HTML de producción y buscar el valor exacto ANTES de tocar nada

**Contexto**: el founder reportó que los cambios de scale de My Crew/Clems "no surten efecto" ni en incógnito + cache vaciado. En vez de asumir bug de build/cache (y empezar a tocar a ciegas), `curl`eé la página exacta (`/anteojos-de-receta/vulk`) y grepié `scale\([0-9.]+\)` + el `x-vercel-cache`/`age`. Resultado: el HTML de producción YA tenía `scale(1.29)`, `scale(1.145)`, etc. (`x-vercel-cache: HIT`, build fresco) → los cambios SÍ estaban aplicados. Eso reencuadró el problema de "está roto" a "el delta es sub-perceptible + se tocó la variante equivocada" (ver MISTAKES), que es la causa real.

**Aprendizaje**: el HTML SSR de producción es la fuente de verdad para "¿se aplicó el cambio o no?". Un `curl` + grep del valor concreto (transform, meta, precio, lo que sea) distingue en 10s entre 3 hipótesis que de otro modo se confunden: (a) no rebuildeó, (b) rebuildeó pero el override no matchea el path → valor default, (c) el valor está pero el efecto visual es nulo/imperceptible. Sin esa verificación, (c) se confunde con (a)/(b) y se pierden iteraciones tocando lo que no es.

**Regla**: ante "no se ve el cambio" en una prop derivada de data/config (scale, meta, precio, flags), PRIMERO `curl` a la URL de prod + grep del valor esperado + revisar `x-vercel-cache`/`age`. Solo si el valor NO está en el HTML, investigar build/cache/match de path. Si está, el problema es percepción o el elemento equivocado.

## 2026-06-11 — Setear el scale de un producto BAJANDO las fotos y comparándolas contra una referencia ya verificada, en vez de adivinar

**Contexto**: al cargar Vulk My Crew tenía que elegir el `primaryImageScale`. La regla 15 sub-regla exige comparar contra el grid (target: anteojo ~85% del card), y MISTAKES tiene 2 reincidencias (Yau, Vrast) de scales iniciales desproporcionados por NO comparar. En vez de copiar el baseline receta 1.15/1.0 a ciegas, **bajé las fotos reales del bucket con `curl`** (`storage/v1/object/public/...`) + **una foto de referencia de un producto que el founder YA aprobó** (Opposit perfil @1.15) y las abrí con Read. Comparación visual directa: las fotos de My Crew son 2:1 con el anteojo ~15% más chico que Opposit → setié 1.3/1.15 en la primera, sin iteración. (El founder después pidió solo +0.02 de ajuste fino, no una corrección de "se ve chico".)

**Aprendizaje**: cuando las fotos YA están en el bucket, el scale no se adivina ni se copia del baseline — se **mide visualmente** bajando la imagen nueva + una de referencia aprobada y comparando el % que ocupa el anteojo. Es ~30s de `curl` + Read y elimina la ronda de iteración "se ve chico/grande" que el founder reportó 2 veces. Corolario inverso (Tour 81): si las fotos NO están subidas aún, NO se puede medir → el scale queda PROVISIONAL anclado al precedente del mismo formato de foto (GALERIA → 1.3), explícitamente marcado para confirmar, y la carga queda ABIERTA hasta la verificación visual.

**Regla**: para `primaryImageScale` de un producto con fotos ya en el bucket, bajar la foto nueva + una de referencia aprobada y comparar visualmente ANTES de fijar el valor. Si las fotos no están, scale provisional + carga marcada ABIERTA (no declarar cerrado). Candidato a sumar a la sub-regla 15 de CLAUDE.md si se confirma 1-2 veces más.

## 2026-06-11 — La data de keywords (CSV) tiró abajo un supuesto: "armazón de receta" no se busca; sí "anteojos rusty/recetados/mujer"

**Contexto**: veníamos poniendo "Armazón de Receta" en los meta de los productos de receta (intuición + nombre de categoría). Los CSV de Ubersuggest (carpeta `KEYWORDS OPTICA/`, [[keywords-optica-csv-folder]]) mostraron data dura: "armazones con receta" = **0 vol**; en cambio "anteojos rusty" **3.600** (dif 8), "anteojos recetados" **720** (dif 9), "anteojos/armazones mujer" 480-880, "lentes wayfarer" 590.

**Aprendizaje**: la intuición sobre qué término poner en el meta puede estar 180° equivocada — la gente busca por **marca + tipo + género** ("anteojos rusty", "anteojos recetados", "anteojos mujer"), NO por el nombre técnico interno de la categoría ("armazón de receta"). Sin data, sesgás hacia el vocabulario del negocio, no del comprador.

**Regla**: para el meta de un producto, priorizar términos con volumen REAL verificado (Ubersuggest / CSV de `KEYWORDS OPTICA/`) por sobre el nombre interno de la categoría. Cuando el MCP de Ubersuggest no responda, leer los CSV con `head`/`grep`.

## 2026-06-11 — Delegar el SEO de una página de producto al `seo-strategist` devuelve assets listos + honestidad data-dura vs inferencia

**Contexto**: al cargar Rusty Opposit (página de producto nueva) invoqué `seo-strategist` (trigger CLAUDE.md "página/ruta nueva → seo-strategist ANTES" + pedido del founder). Devolvió **listo para pegar**: slug confirmado, meta_title (59 chars, marca+forma+género), meta_description, short_description (con el disclaimer "sin cristales graduados"), array de 7 keywords + recomendaciones de internal linking y structured data (AggregateOffer con hasVariant; NO AggregateRating sin reviews). Lo más valioso: **marcó explícitamente** que los long-tails eran INFERENCIA (no hay volumen medido en SEO_STRATEGY.md para el cluster armazón-receta-wayfarer) y los ancló a volúmenes que SÍ existen (Rusty 6.000, wayfarer 1.400, mujer 3.200); además detectó un gap (no existe cluster Rusty pese a 7 productos receta cargados).

**Aprendizaje**: para una página/producto nuevo, delegar al `seo-strategist` es alto-leverage — devuelve meta paste-ready, distingue lo medido de lo inferido (no presenta adivinanzas como data) y surface gaps de estrategia. Mejor que craftear meta ad-hoc en el main loop; respeta las reglas duras (sin reviews falsas, "sin cristales graduados", español argentino).

**Regla**: al cargar un producto/página nueva, invocar `seo-strategist` para los assets SEO ANTES de escribir el seed/meta, pasándole TODO el contexto del producto. Si flaggea inferencia sin data dura, avisarle al founder y cerrar con keyword research real cuando se pueda.

## 2026-06-11 — Parallax "espectacular" con costo CERO de JS: scroll-driven CSS + fallback estático invisible

**Contexto**: el founder pidió "parallax que vuele cabezas". El reflejo de la industria es GSAP/Lenis (+30-60kB y scroll-jacking). Se implementó con CSS scroll-driven animations (`animation-timeline: view()`): el "lens reveal" (la sección dark entra clipeada a un círculo que crece — la metáfora de mirar por una lente) + "ventanas con vida" (imágenes derivando dentro de marcos fijos). 0 bytes de JS, home sigue ISR a 174kB.

**Aprendizaje técnico (patrones reusables)**:
1. **`@media (prefers-reduced-motion: no-preference) { @supports (animation-timeline: view()) { ... } }`** como doble gate: Firefox y reduced-motion ven la página estática SIN saber que se pierden algo (el fallback invisible es el mejor fallback). Soporte ~80-85% del tráfico (Chrome/Edge/Samsung 115+, Safari 26+).
2. **El aro de la lente** = segunda capa clipeada a un círculo apenas mayor (+1.2%) DETRÁS del contenido, con opacity→0 al final del range (si no, queda como overlay al terminar). No se puede hacer con border/box-shadow sobre clip-path.
3. **Animaciones scroll-linked: solo clip-path/transform/opacity**. Se DESCARTÓ el detalle de animar `letter-spacing` (el título que "enfoca") porque dispara layout en cada frame de scroll — lindo en el spec del diseñador, veto de performance en la implementación.
4. **Overscan separado del hover**: la imagen con parallax vive en un wrapper `-inset-y-[7%]` con el translateY; el hover-scale queda en el `<Image>` — dos elementos, dos transforms, cero conflicto (condición del CRO).
5. **`animation-range`**: para secciones más altas que el viewport, `entry 0% entry 100%` tarda demasiado — usar `cover 0% cover N%` calibrado (acá 30%) para que el efecto complete en ~una pantalla de scroll.

**Regla**: ante cualquier pedido de motion/parallax, agotar scroll-driven CSS antes de considerar JS — y si una propiedad animada no es compositor-friendly (layout/paint), se rediseña el efecto, no se acepta el jank.

## 2026-06-11 — Invocación automática de subagentes: el campo `description` es el router — escribirlo como trigger, no como currículum

**Contexto**: el founder preguntó si los agentes podían invocarse solos. Resultó que Claude Code YA auto-delega — decide invocar un subagente cuando la tarea matchea su campo `description` del frontmatter. Nuestros 11 agentes tenían descripciones tipo currículum ("Especialista en X. Se invoca para Y...") que casi nunca matcheaban proactivamente: 6 de 8 tenían CERO invocaciones en 2 semanas.

**Aprendizaje**: la auto-invocación se activa con DOS capas complementarias: (1) **la `description` escrita como disparador** — "USAR PROACTIVAMENTE (sin que el founder lo pida) cuando [evento concreto]" — porque ese campo es literalmente lo que el asistente principal lee para decidir delegar; cuanto más concreto el evento ("apenas pasa un link de ML", "antes de publicar texto legal"), más se dispara; (2) **triggers obligatorios en CLAUDE.md** como refuerzo de proceso — la description es sugerencia fuerte, la regla en CLAUDE.md es mandato que se lee en cada sesión. Tercera capa para lo periódico (reviews quincenales): tareas programadas (cron) — las dos primeras no cubren "cada 2 semanas" porque dependen de que haya una sesión activa con el tema sobre la mesa.

**Regla**: al crear un agente, la `description` se escribe como trigger (evento → agente), no como bio. Si un agente lleva semanas sin invocaciones, lo primero a revisar es su description (¿describe QUÉ SABE en vez de CUÁNDO ENTRA?). Dejar pasivos a propósito los que no tienen disparador natural todavía (data-analyst hasta post-launch).

## 2026-06-11 — Texto legal: verificar el marco vigente con agente + web ANTES de redactar — corrigió 3 supuestos en una sola página

**Contexto**: el founder pasó los datos para la política de devolución (plazo, condiciones, "el envío lo paga el comprador", recetados solo garantía). En vez de redactar directo con esos datos + mi memoria del marco legal, invoqué `argentine-ecom` con web search para verificar cada punto contra la norma vigente 2026.

**Aprendizaje**: la verificación corrigió TRES supuestos que hubieran quedado publicados mal: (1) el founder quería que el comprador pague el envío del arrepentimiento — es ilegal e irrenunciable (art. 34 LDC + art. 1115 CCyC; cláusula nula art. 37) — solo es legal en cambios voluntarios; (2) mi dato de "garantía legal 6 meses" estaba desactualizado — es 1 AÑO para nuevos desde la Ley 27.701, y una página del sitio (`/defensa-del-consumidor`) ya lo tenía mal; (3) el botón de arrepentimiento ya NO es obligatorio (Res. 139/2025 derogó la 424/2020 en mayo 2025 — posterior a cualquier memoria entrenada). Bonus: el instinto del founder con recetados a medida tenía respaldo exacto (CCyC art. 1116 inc. a), citado en la página = más defendible.

**Regla**: contenido legal/regulatorio (devoluciones, garantías, datos personales, facturación) NUNCA se redacta de memoria ni solo con los datos del founder: (a) verificar el marco vigente vía `argentine-ecom` + web search, (b) si lo que pide el founder contradice una norma de orden público, explicárselo y aplicar la versión legal (las reglas duras del negocio incluyen cumplir la ley), (c) citar artículo y ley en la página — protege y es trust signal. El derecho de consumo argentino cambió 3 veces en 2022-2025 (Ley 27.701, DNU 70/2023, Res. 139/2025): la memoria del modelo siempre corre riesgo de estar vieja acá.

## 2026-06-11 — Cambio de modelo/params de IA: smoke test PERMANENTE contra la API real, no verificación descartable

**Contexto**: migrar el lector de receta a Opus 4.8 + adaptive thinking tenía un riesgo concreto: la combinación de parámetros (modelo nuevo + thinking + tools + tool_choice auto + historia few-shot con bloques tool_use/tool_result) podía dar 400 en producción aunque el typecheck pasara — el typecheck valida TypeScript, no el contrato de la API. Y el endpoint no se puede probar a mano fácil (necesita multipart + imagen + API key).

**Aprendizaje**: en vez de verificar una vez y tirar, el chequeo quedó como script permanente (`scripts/prescription-smoke.ts`, comando `pnpm rx:smoke`, patrón ya probado de `mp:smoke`/`correo:smoke`): importa los MISMOS módulos de prompt/tool-schema/few-shot que usa el route (cero drift entre test y código real) y manda una imagen 1×1 a la API — valida el contrato completo en 10 segundos sin levantar el server. El resultado además confirmó un comportamiento valioso: adaptive thinking se autorregula (25 tokens de razonamiento para una imagen trivial — no paga costo fijo como el budget viejo). Verificación en capas: smoke (contrato de API) → deploy → POST real al endpoint de prod (plumbing) → founder con receta real (calidad de OCR) — cada capa atrapa una clase distinta de falla.

**Regla**: todo endpoint que llama una API externa con combinación no trivial de parámetros merece su `*-smoke.ts` con comando en package.json, importando los módulos reales del endpoint. Correrlo ANTES de cada deploy que toque modelo/params. Costo: centavos y 2 minutos; alternativa: descubrir el 400 en producción con un usuario real.

## 2026-06-11 — Audit de gaps con evidencia (greps + curls + referencia de API actual) en vez de lista genérica de mejoras

**Contexto**: founder pidió "auditá y decime qué mejorar / qué agregar". La tentación era responder con una lista genérica de features de e-commerce. En cambio: (a) grep de modelos/parámetros en los endpoints de IA, (b) curl a producción (schema de PDP, sitemap, canonical), (c) agente Explore sobre el repo (TODOs, features a medias, BACKLOG/DECISIONS para no re-proponer lo decidido), (d) carga de la referencia ACTUAL de la API de Claude antes de opinar sobre modelos.

**Aprendizaje**: cada pata de evidencia encontró algo que una lista genérica jamás hubiera visto: el grep encontró `budget_tokens` deprecado en el lector de recetas; el curl confirmó que el schema de PDP está bien (evitó recomendar algo ya hecho); el Explore encontró el `[PENDIENTE]` legal en /politica-de-devolucion (riesgo Defensa del Consumidor) y que la búsqueda no tiene ranking; la referencia de API corrigió el supuesto del doc ("Sonnet 4") y dio pricing real para la recomendación de upgrade. Bonus: revisar DECISIONS.md (ADR-017 revertido) evitó re-proponer Andreani.

**Regla**: "¿qué puedo mejorar?" se responde con un audit barato primero (30-40 min: grep dirigido + 3-4 curls + 1 agente Explore + docs de decisiones), después la lista — cada recomendación con archivo:línea o medición que la respalde. Y cualquier recomendación sobre modelos/APIs externas arranca cargando la referencia vigente, no desde memoria.

## 2026-06-11 — Sacar una librería de animaciones del camino crítico: convertir los componentes COMPARTIDOS, no toda la app

**Contexto**: framer-motion (~34kB gz) viajaba en el JS inicial de todas las páginas. La opción "global" (LazyMotion + convertir 21 archivos a `m.`) arriesgaba flashes en el hero (contenido invisible hasta que carga el chunk de features). La opción elegida: convertir SOLO los 12 componentes que cargan en todas las páginas (layout/header/footer/PDP) a CSS, dejando framer en componentes de rutas puntuales (home hero, tools, descubrir) donde el code-splitting de Next ya lo aísla.

**Aprendizaje**: el costo de una librería no es "está instalada" sino "qué rutas la cargan". El grep clave es `grep -rln "from 'libreria'"` cruzado con "¿quién importa a ese componente?" — footer y header son los multiplicadores (NewsletterForm en el footer metía framer en TODAS las páginas). Conversiones que cubrieron todo: `tailwindcss-animate` (entradas), keyframe custom (`pop`), `grid-rows 0fr→1fr` (collapse de accordion, height-auto sin JS), rAF + transform directo (scroll progress), mousemove + cubic-bezier con overshoot (efecto magnético ≈ spring). Animaciones de SALIDA (AnimatePresence exit): omitirlas es aceptable en flotantes/banners — nadie nota la desaparición instantánea. Resultado: −40 kB (−21%) de First Load JS en categorías/PDPs/guías, cero pérdida funcional. Bonus inesperado: el accordion CSS deja las respuestas de FAQ siempre en el HTML (SEO).

## 2026-06-11 — Reconectar un MCP a mitad de sesión NO refresca mi lista de tools — necesita sesión nueva

**Contexto**: el MCP de Supabase se desconectó a mitad de la carga del producto R-CY 02. El founder lo reconectó **3 veces** y cada vez las tools seguían sin aparecerme (lo verifiqué con ToolSearch). Recién aparecieron cuando reinició/reconectó de una forma que sí inyectó las tools en una "sesión nueva" (llegó el system-reminder "tools nuevas disponibles"). Mientras tanto perdí varios turnos diciéndole "reintentá".

**Aprendizaje**: cuando un MCP se cae a mitad de sesión, las tools se remueven de mi registro y **reconectar el server NO las re-inyecta en la sesión en curso** — hace falta que el cliente recargue/reinicie para que lleguen como deferred-tools nuevas (lo confirma el system-reminder de "tools disponibles de nuevo"). No basta con que el founder "lo conecte".

**Regla**: si un MCP no aparece tras reconectar, NO mandar al founder a reintentar en loop. Decirle directo: "reconectar a mitad de sesión no alcanza, hace falta reiniciar el cliente" + ofrecer el camino alternativo (para Supabase: storage/REST con la service-role key sí funciona sin MCP; para SQL crudo, el SQL Editor del dashboard). Verificar con ToolSearch una vez; si no está, cambiar de estrategia en vez de repetir.

## 2026-06-11 — Un solo `cookies()` en el árbol compartido mata el ISR de TODO el sitio (y cómo des-dinamizar sin perder features)

**Contexto**: founder reportó sitio lento ("mejorá las imágenes y la respuesta general"). Medición en prod: TTFB 0,6-2,1s y `no-store` en TODAS las páginas públicas, con `revalidate = 300` declarado. El ISR estaba 100% anulado.

**Aprendizaje 1 — la dinamización es viral y silenciosa**: UN componente server que llama `cookies()` (o una query que usa el cliente Supabase con cookies) vuelve dinámica la ruta entera; si está en el LAYOUT, vuelve dinámico TODO el sitio. Acá había 4 fuentes apiladas: CompareBarWrapper (layout), queries/metadata con cliente cookie, RecentlyViewed, y getCurrentUser() en la PDP para un solo botón. Next no avisa — solo se ve midiendo headers en prod.

**Aprendizaje 2 — patrón para des-dinamizar personalización liviana**: todo lo personalizado-por-cookie (comparador, vistos recientes, estado de alerta) se movió a client-side: leer el cookie en el browser (son `httpOnly: false`) + pedir data pública a una API route cacheable (`s-maxage=300`). Para "¿está logueado?" alcanza con chequear la EXISTENCIA del cookie `sb-*-auth-token` desde `document.cookie` — sin importar supabase-js al bundle (+64kB evitados; el server valida igual).

**Aprendizaje 3 — `searchParams` de filtros también dinamiza**: las categorías filtrables se resolvieron con page ISR que sirve el catálogo completo + filtrado client-side leyendo la URL (`useSearchParams` detrás de un Suspense cuyo fallback ES el grid completo → el HTML estático conserva todo para SEO). Bonus UX: chips de filtro instantáneos.

**Aprendizaje 4 — imágenes**: los archivos eran livianos (5-7KB AVIF); lo lento era la RE-OPTIMIZACIÓN constante de Vercel porque Supabase Storage sirve `max-age=3600`. `images.minimumCacheTTL = 31 días` lo arregla con una línea. Contrapartida: una foto reemplazada en el MISMO path tarda hasta 31 días en refrescar → reemplazos van con nombre de archivo nuevo.

**Regla**: en páginas públicas, data de catálogo SIEMPRE con `createStaticClient`; `cookies()`/`headers()`/`searchParams` jamás en layout ni en componentes compartidos por páginas ISR. Verificar con `curl -sI` el `cache-control` real en prod, no confiar en la tabla del build (ver MISTAKES 2026-06-11).

## 2026-06-11 — Leer+desencriptar el token OAuth de la DB en un script self-contained desbloquea la API de ML (sin MCP ni sesión admin)

**Contexto**: necesitaba datos de una publicación de ML (precio/stock/variaciones) pero la API pública da 403 sin token, el endpoint admin de import-preview pide sesión de admin, y `lib/integrations/mercadolibre/*` es `server-only` (no se importa en tsx). El token OAuth válido vivía encriptado (AES-256-GCM) en `marketplace_integrations`.

**Aprendizaje**: se accede a la integración SIN la app, con un script self-contained (patrón mp-smoke/email-smoke): (a) lee la fila activa de `marketplace_integrations` con la **service-role key** (independiente del MCP — el cliente JS de Supabase usa las keys de `.env.local`), (b) **desencripta** el `access_token` replicando el AES-GCM (`iv:authTag:encrypted`, key derivada de `APP_ENCRYPTION_KEY`), (c) llama a `api.mercadolibre.com/items/{id}` con el Bearer. Quedó como `scripts/ml-item.ts` (reusable para cualquier MLA).

**Regla**: para usar una integración OAuth desde fuera de la app (script/CLI) no hace falta el endpoint admin ni el MCP — leer el token de su tabla con la service-role key + desencriptar con la misma lógica del módulo. En la carga de productos elimina el paso "founder pasa precio/stock". Conecta con el MISTAKE 2026-06-11 (pedir datos que la integración trae sola).

## 2026-06-09 — Reintegro de stock casi gratis por reusar piezas existentes + claim atómico para idempotencia

**Contexto**: el founder pidió reintegrar stock al cancelar un pedido (DB + ML). En vez de escribir un camino nuevo, ya existía `revertStock`/`increment_variant_stock` + `syncStockOutboundForVariants` (usados como compensación cuando falla `createOrderFromCart`). El reintegro al cancelar (`releaseOrderStock`) salió reusando exactamente eso. El auto-cancelar de abandonados reusó `releaseOrderStock`. Tres features, un solo camino de reintegro.

**Aprendizaje 1 — auditar antes de construir paga (regla 14 en acción)**: el reintegro "parecía" una feature nueva; era 90% reuso. Un `grep` de `increment_variant_stock`/`revert` reveló las piezas. Antes de estimar/construir cualquier cosa de stock o pagos, buscar el camino de compensación que ya existe.

**Aprendizaje 2 — idempotencia con claim atómico, no con flag leído-luego-escrito**: `increment_variant_stock` suma cada vez que se la llama (no es idempotente). La protección correcta NO es "leer `stock_released_at`, si null reintegrar" (race). Es un UPDATE condicional que setea la marca SOLO si está null y devuelve la fila: `UPDATE ... SET stock_released_at=now() WHERE id=$1 AND stock_released_at IS NULL RETURNING id`. Si volvés la fila, ganaste el claim → reintegrás. Patrón reusable para cualquier "hacer X una sola vez" sobre una orden.

## 2026-06-08 — Una analogía concreta cierra una duda conceptual que los datos no

**Contexto**: tras 2 respuestas con datos sobre por qué el tracking de Correo no es automático, el founder seguía preguntando lo mismo. La 3ª respuesta —analogía del "rastreo de paquete" (el endpoint usa el número, no lo entrega) + señalar el propio ejemplo del manual (`shippingId` enviado == `trackingNumber` devuelto)— fue la que comunicó. La evidencia ya estaba completa; faltaba traducirla.

**Aprendizaje**: para un founder no-técnico, una duda conceptual se cierra con una **analogía de su mundo** + la **evidencia señalada dentro de su propio material**, no con más pruebas técnicas. Cuando una explicación no "prende" dos veces, el problema es el registro, no la falta de datos.

**Regla**: cuando una explicación técnica no convence, traducirla a una analogía cotidiana ANTES de aportar más datos. Conecta con el MISTAKE "responder pregunta repetida con más datos".

## 2026-06-09 — `aria-hidden` en la imagen permite alt descriptivo solo-para-SEO sin tocar la a11y

**Contexto**: los cards de producto tenían `alt=""` y el bloque de imagen con `aria-hidden="true"` + el nombre en el `aria-label` del link (patrón a11y correcto: el lector anuncia el link por su nombre y se saltea la imagen, sin redundancia). Para Google Imágenes eso es pobre (sin contexto). Insight: **`aria-hidden` saca el subtree del árbol de accesibilidad, pero NO afecta a los crawlers** → se puede poner un `alt` descriptivo en la imagen y (a) Google lo lee para indexar, (b) el lector de pantalla lo sigue ignorando (por el `aria-hidden` del contenedor). Cero conflicto a11y/SEO. Apliqué un helper `buildProductImageAlt` (marca + nombre + categoría) en grid + relacionados + galería.

**Aprendizaje**: `alt=""` "porque el nombre está al lado" es un trade-off innecesario cuando el contenedor ya está `aria-hidden` con el nombre en un `aria-label`. En ese caso el `alt` es territorio EXCLUSIVO de SEO — ponelo descriptivo. La regla "alt vacío para decorativas" aplica a imágenes realmente decorativas, no a fotos de producto que Google quiere indexar.

**Regla**: antes de dejar `alt=""` en una foto de producto, ver si el contenedor está `aria-hidden` / el nombre va en un `aria-label`. Si sí → poner `alt` descriptivo (gana SEO, no toca a11y). Si la imagen NO está aislada del árbol a11y, balancear redundancia vs SEO (descriptivo suele ganar igual para producto).

## 2026-06-09 — Extraer el "core por-ítem" para que la acción single y la de lote/variante compartan la misma lógica tested

**Contexto**: dos features de esta sesión necesitaban una VARIANTE de una acción que ya funcionaba. (a) "Retomar pago" tenía que crear una preferencia MP desde una orden (no desde el cart) → extraje `createPreferenceFromItems` (core) y dejé `createCheckoutPreference` (cart) + `createCheckoutPreferenceFromOrder` (orden) llamándolo; la firma del checkout quedó INTACTA. (b) "Envíos en lote" tenía que generar N envíos → extraje `generateShipmentForOrder` (core sin `requireAdmin`/`revalidate`, idempotente vía claim sobre `shipment_imported_at`) y dejé `generateShipmentAction` (single) + `generateShipmentsBulkAction` (lote) llamándolo.

**Aprendizaje**: cuando hace falta una versión bulk/variante de una acción que ya anda, NO duplicar la lógica NI refactorizar la firma pública existente (riesgo de regresión en un camino tested, peor si es pago/inventario). Extraer el "core por-ítem" puro (sin auth/revalidate, idempotente) y que tanto la entrada vieja como la nueva lo llamen. Resultado: lógica de una sola fuente, camino original sin tocar (cero regresión), y la versión bulk procesa SECUENCIAL para no saturar APIs externas (Correo).

**Regla**: para sumar bulk/variante a una acción existente → core por-ítem idempotente + entradas finas (auth/revalidate en las entradas, no en el core). Conecta con "preferí simple sobre clever".

## 2026-06-09 — El webhook MP se validó sin simular: MP notifica la notification_url de PROD, que comparte la DB cloud

**Contexto**: en el test local di por hecho que el webhook MP habría que simularlo (MP no llega a localhost). Pero `OC-2026-00009` quedó `paid` con `mp_payment_id` real → el webhook corrió DE VERDAD. Por qué: la preference le manda a MP la `notification_url` = la de PRODUCCIÓN (`opticacarballo.com.ar/api/mp/webhook`), no localhost. MP (sandbox) notificó esa URL de prod; el deploy de Vercel procesó el webhook y actualizó la orden en la DB cloud — la misma que usa el localhost. La página `/checkout/exito` es solo informativa (no marca paid).

**Aprendizaje**: cuando una integración con webhook usa una `notification_url` fija de prod, un test "local" en realidad ejercita el webhook de PROD si comparten DB. Es bueno (validó el camino real end-to-end), pero ojo: (a) el deploy de prod ya tiene el webhook vivo aunque el checkout esté OFF (el route no chequea el flag); (b) los efectos del webhook (emails, etc.) corren con la config de PROD — si `BUSINESS_ADMIN_EMAIL` no está en Vercel, el aviso al admin se saltea aunque local lo tenga seteado. Matiza el learning previo "MP no llega a localhost → simular".

**Regla**: al testear una integración con webhook, mirar a qué `notification_url` se apunta — define quién procesa la notificación y con qué env. Si es prod, el efecto cae en prod (DB + emails con env de prod).

## 2026-06-09 — Un campo de formulario "requerido" que el API downstream no necesitaba: auditar el contrato destrabó la simplificación

**Contexto**: el carrito obligaba a elegir provincia ANTES de cotizar el envío (el botón "Calcular" quedaba deshabilitado sin provincia, aunque el CP estuviera cargado). El founder pidió cotizar con solo el CP. Al auditar el contrato de la API de Correo (`/rates`), vi que solo consume `postalCodeDestination` — la provincia NI se le manda; estaba únicamente para el fallback por zonas. O sea: el form exigía un dato que el servicio real no usa. La simplificación (sacar el `<select>`, CP como único campo) salió de leer qué consume el API, no de inventar un mapeo CP→provincia.

**Aprendizaje**: antes de mantener (o agregar) un campo REQUERIDO en un formulario, chequear qué necesita REALMENTE el endpoint/servicio downstream. Los formularios suelen exigir campos por asunción ("para cotizar hace falta la provincia"), no por necesidad técnica. Leer el contrato del API revela campos redundantes que se pueden quitar → menos fricción, sin perder nada.

**Regla**: cuando un campo de UI genera fricción (acá: bloqueaba el CTA), antes de "mejorarlo" preguntarse si es necesario — rastrear el dato hasta el API que lo consume. Si el API no lo usa, el campo se quita. Conecta con la regla 14 (audit antes de actuar) y "preferí simple sobre clever".

## 2026-06-09 — Validar una integración en capas: infra (smoke self-contained) → superficie (curl al app) → wiring (runtime real)

**Contexto**: el founder quiso "habilitar MP". En vez de prender el flag a ciegas, validé en capas, todo con credenciales TEST: (1) infra de MP con `mp:smoke` (¿crea preferencia? live_mode prueba), (2) infra de email con `email:smoke` self-contained (¿Resend entrega a la casilla del founder con el dominio verificado? — la falla previa, cubierta a nivel infra), (3) superficie con curl al app corriendo (`/checkout` pasó de 404 a 307 = flag vivo, `/carrito` con CTA de compra), (4) el wiring completo (templates + orden→paid) queda para el runtime real porque `server-only` no corre en scripts. Además: **MP no puede pegarle a localhost** → el webhook se SIMULA para cerrar el e2e local.

**Aprendizaje**: una integración transaccional no se prueba con un solo test "anda/no anda". Se descompone en capas, y cada capa se valida con la herramienta más barata que la AÍSLA: credencial/infra → script self-contained; flag/superficie → curl al server; wiring de código server-only → runtime real (route o webhook simulado). Aislar capas hace que cuando algo falla sepas EXACTAMENTE qué falló (credencial vs dominio vs flag vs template), en vez de un "el checkout no anda" opaco.

**Regla**: antes de habilitar un flujo transaccional en prod, validar en local por capas y dejar registrado qué capa cubre cada test. Los webhooks de terceros (MP, etc.) no llegan a localhost → simularlos con firma válida contra el server corriendo. Conecta con MISTAKES "activar checkout sin verificar TODAS las env vars" y "server-only no importable en scripts".

## 2026-06-09 — La mejora de UX más barata fue USAR componentes que ya existían, validados contra archivos hermanos

**Contexto**: el founder pidió un rediseño de las guías (romper muro de texto, CTA del lector destacado, listas visuales, + ideas avanzadas: scrollytelling, audio TTS, bento). El audit (regla 14) mostró que `mdx-components.tsx` YA tenía `ToolCta`, `KeyTakeaway`, `MedicalDisclaimer`, `CategoryCta`, `RevealOnScroll`. La guía `como-leer-receta-anteojos.mdx` simplemente no los usaba (markdown plano). Antes de tocar nada, grepié las guías hermanas (`astigmatismo.mdx`/`miopia.mdx`) y confirmé que YA usaban esos componentes sin import → el patrón estaba probado, la de receta era la outlier. La re-maquetación fue: insertar componentes existentes + UN componente nuevo chico (`<Steps>`). Cero librerías. El 80% de los "fundamentos" pedidos salió de reutilizar.

**Aprendizaje**: ante un pedido de "rediseño/mejora visual", el primer paso no es diseñar infra nueva — es (a) inventariar qué componentes ya existen y (b) mirar archivos HERMANOS del mismo tipo para ver el patrón de uso correcto. Muchas veces el gap no es de sistema sino de "este archivo no aplicó el patrón que el resto sí". Validar contra hermanos elimina el riesgo de inventar una convención que ya estaba resuelta.

**Regla**: antes de re-maquetar/rediseñar un archivo de un conjunto (guías, páginas de categoría, emails), grepear 1-2 hermanos por uso de componentes/patrones y replicar esa convención, en vez de introducir una nueva. Conecta con la regla 14 (audit antes de estimar) y con "preferí simple sobre clever".

## 2026-06-08 — Separar "capturar el número" (no/manual) de "actualizar el estado" (sí/automático) destraba la pregunta recurrente del tracking

**Contexto**: el founder repreguntó (4ª vez) si `/shipping/tracking` sirve para tracking automático, pegando de nuevo el ejemplo del manual. La respuesta NO era más evidencia ni repetir "no es automático" — era partir la pregunta en dos: (a) ¿el número de seguimiento aparece solo? → **No**: el alta devuelve solo `{createdAt}` y este endpoint CONSUME el número (en el propio ejemplo, `shippingId` enviado == `trackingNumber` devuelto; la 3ª respuesta del manual `"No existe el cliente o pedido"` es lo que nos dio con NUESTROS ids). El número se copia 1 vez del panel. (b) ¿el estado del envío se actualiza solo? → **Sí**, y para eso SÍ sirve este endpoint: con el número ya cargado, un job lo consulta periódicamente y actualiza el tracker del cliente sin intervención.

**Aprendizaje**: "¿es automático?" sobre una integración casi nunca es binario. La respuesta honesta y útil parte el flujo en sub-pasos y dice cuáles se automatizan y cuáles no. Responder "no es automático" a secas era técnicamente correcto pero ocultaba que el 80% del trabajo repetitivo (actualizar estados) SÍ se puede automatizar — y eso era justo lo que el founder quería.

**Regla**: ante "¿esto es automático?", descomponer el flujo en pasos y marcar cada uno (auto / manual una-vez / manual recurrente) en vez de dar un sí/no global. Validación pendiente y chica: pegarle a `/shipping/tracking` un número REAL del panel (nunca probado — solo con nuestros ids, que dan "No existe") para confirmar que devuelve eventos. Conecta con el MISTAKE "presentar el manual como hecho cerrado".

## 2026-06-08 — Validar la conclusión en el ambiente que importa (prod), no solo en el cómodo (sandbox)

**Contexto**: la conclusión "el tracking de Correo no se obtiene por API" se había probado SOLO en sandbox (apitest). La insistencia repetida del founder llevó a probarla en **PRODUCCIÓN** con un envío real: mismo resultado inmediato, pero recién ahí la conclusión es sólida, y además apareció el caveat real (un envío en preimposición puede tardar horas en entrar al seguimiento) y el dato que falta (el nº que asigna Correo, visible en el panel).

**Aprendizaje**: el sandbox responde "¿el código corre / el request es válido?"; **producción** responde "¿esto es realmente así para el negocio?". Son preguntas distintas. Una integración puede comportarse distinto en cada ambiente (el sandbox puede no alimentar subsistemas como el tracking). Cuando la respuesta define una feature (acá: tracking automático vs manual), el sandbox no alcanza.

**Regla**: para integraciones cuyo resultado define una decisión de producto, incluir una prueba en **producción acotada** (1 caso, reversible, con OK del founder) antes de cerrar la conclusión. Conecta con el MISTAKE "exhaustividad en sandbox = falsa certeza".

## 2026-06-08 — La insistencia del founder = señal de re-verificar exhaustivamente, no de defender la conclusión

**Contexto**: concluí que el tracking de Correo no se obtiene por API (lo había probado con nuestros ids). El founder insistió ("¿esto no servirá para obtenerlo automático?"). En vez de repetir la conclusión, re-verifiqué las **hipótesis que aún no había probado**: (a) el número en los HEADERS del response del alta (no solo el body); (b) timing (el envío podría tardar en estar disponible); (c) más variantes de identificador. Resultado: 12 intentos (3 tiempos × 4 ids) + headers → todos negativos. La conclusión quedó cerrada **con datos duros**, no con una afirmación.

**Aprendizaje**: cuando el founder cuestiona una conclusión técnica, casi siempre hay una hipótesis que no probé. Su insistencia es información: señala "verificá mejor", no "defendé tu respuesta". Re-verificar exhaustivamente o (a) destapa que tenía razón, o (b) cierra el tema con evidencia que ya nadie discute. Ambos resultados son mejores que defender.

**Regla**: ante una duda repetida del founder sobre algo técnico, enumerar las hipótesis NO probadas y testearlas todas antes de responder. Conecta con el MISTAKE "presentar el manual como hecho cerrado" — la diferencia entre suponer y saber es una prueba.

## 2026-06-08 — Audit antes de estimar: el "dashboard de admin" que pidió el founder ya existía al 80%

**Contexto**: el founder pidió "un dashboard de admin para ver pedidos, datos de clientes, editar y comentar". En vez de estimar o construir de cero, audité `app/admin/` primero (regla 14). Ya existía `/admin/pedidos`: listado (cliente/estado/total/fecha) + detalle con PII del cliente, productos, totales, ID de pago MP, envío (domicilio/sucursal/pickup), cambio de estado y notas que el cliente ve en su tracker. Lo único que faltaba era puntual: cargar tracking, comentarios internos, filtros.

**Aprendizaje**: la regla "audit antes de estimar" pagó de nuevo. Sin el audit habría propuesto construir desde cero algo casi completo → sobre-estimación + trabajo redundante. Y el founder no sabía que el panel ya existía: mostrarle lo que YA tiene (con la URL) fue más valioso que construir.

**Regla**: ante un pedido de "feature X", SIEMPRE `ls` + leer lo existente antes de estimar/construir. El codebase tiene >1 mes; muchas features están 70-90% hechas. Refuerza la regla 14 de CLAUDE.md.

**Confirmado 2× el mismo día (2026-06-08)**: pasó igual con el pedido de "cotizar el envío con el CP en el checkout / considerar la dirección del usuario". El audit reveló que el **checkout YA** usaba las direcciones registradas del user y **cotizaba con el CP real** (`resolveShippingQuotes` por dirección) — solo faltaba traer ese cálculo al **carrito** (que estimaba por provincia/tabla). Dos pedidos "construí X" que estaban hechos/casi hechos, en una sola sesión → el audit-antes-de-construir no es solo regla nominal: hay que hacerlo como reflejo. Patrón a internalizar.

## 2026-06-08 — Limpiar datos de prueba de checkout: el stock se descuenta al CREAR la orden y ML es la fuente de verdad

**Contexto**: probar el checkout e2e dejó 6 órdenes de prueba que descontaron stock REAL. El descuento ocurre en `reserve_stock` al **crear** la orden (status `pending`), NO al pagar — así que hasta las órdenes pendientes/abandonadas bajaron stock. Cada descuento además hace push outbound a ML. Al limpiar, reintegrar solo en la DB **no alcanza**: un cron (`ml-reconcile-stock`) corre cada 6h y trae stock **de ML → DB**, así que si ML quedó con el valor descontado, pisa el reintegro en ≤6h.

**Aprendizaje**: en este sistema ML es la fuente de verdad del stock en runtime. Cualquier corrección de stock debe terminar reflejada en ML (idealmente ML y DB iguales, para que el reconcile sea no-op). El push outbound (DB→ML) solo se dispara desde el checkout o desde un entorno con `ML_CLIENT_ID/SECRET/REDIRECT_URI` (Vercel) — no se puede correr desde el `.env.local` local (no las tiene). Gap detectado: las órdenes `pending` abandonadas no liberan su reserva de stock (no hay job de expiración) → stock fantasma. Ver BACKLOG.

**Regla**: antes de testear checkout en producción, asumir que **cada intento descuenta stock real y lo replica a ML** (no es inocuo). Planificar la limpieza: cancelar las órdenes + reintegrar en ML (no solo en la DB) + verificar con el inbound (`/api/admin/ml-force-sync/<MLA>`). Conecta con la entrada de la primera venta e2e (verificar estado en la fuente real, no en la pantalla).

## 2026-06-08 — Deliverability de email: autenticación completa ≠ bandeja de entrada (reputación de dominio nuevo)

**Contexto**: tras configurar Resend con dominio propio, los mails transaccionales (confirmación al cliente + aviso de venta al founder) **llegaban pero a spam**. Diagnóstico con `dig`: SPF ✓ (return-path `send.dominio`→amazonses), DKIM ✓ (`resend._domainkey`), pero **faltaba DMARC** (`_dmarc` vacío). Tras publicar `v=DMARC1; p=none; rua=...` en Vercel DNS, la autenticación quedó completa (SPF+DKIM+DMARC) — y aun así los primeros mails seguían cayendo a spam.

**Aprendizaje**: la autenticación (SPF/DKIM/DMARC) es **condición necesaria pero no suficiente** para llegar a inbox. Un dominio que nunca mandó mails tiene reputación neutra; los filtros (Gmail, y Yahoo más estricto) mandan a spam los primeros envíos hasta construir reputación ("warm-up"). Lo que más acelera a corto plazo es **acción del destinatario**: marcar "No es spam" + agregar el remitente a contactos. Verificar la auth real abriendo el mail → "Mostrar original" (debe decir SPF/DKIM/DMARC = PASS). Desde feb-2024 Gmail/Yahoo exigen DMARC para no penalizar — sin él, spam casi seguro.

**Regla**: al montar email transaccional con dominio propio, configurar las **3** (SPF + DKIM + DMARC) desde el día 1, y avisar al cliente que los primeros días puede haber spam por warm-up (no es un bug). No prometer "no caer en spam" como si fuera un switch técnico. Conecta con MISTAKES (verificar env vars del flujo) — `BUSINESS_ADMIN_EMAIL` faltaba y el aviso de venta se salteaba en silencio.

## 2026-06-08 — Pago e2e validado: verificar el estado en la BASE, no confiar en la página de éxito

**Contexto**: el pago de prueba de MP aprobó (orden OC-2026-00005, página "¡Gracias por tu compra!" con `status=approved` en la URL). En vez de declarar "anda" con la captura, consulté la base vía MCP: `orders.status='paid'`, `payment_status='approved'`, `paid_at` seteado, y el timeline (`order_status_events`) mostró `pending` → `paid` 57s después. **Eso es lo que realmente prueba la integración**: la página de éxito es solo el `back_url` (el redirect del browser), que MP arma con los query params del retorno — un atacante o un error podría mostrarla sin que el pago se haya procesado. El que la orden pase a `paid` en la DB confirma que el **webhook** recibió la notificación server-to-server, **validó la firma HMAC** y ejecutó la lógica de negocio.

**Aprendizaje**: la verdad de un pago vive en el webhook + el estado persistido, no en el redirect de éxito. Al validar checkout, mirar siempre: (1) `status`/`payment_status`/`paid_at` en `orders`; (2) el evento `paid` en el timeline (prueba que el trigger AFTER corrió); (3) idealmente, el `mp_payment_id` coincide con el de la pantalla. El MCP de Supabase hace esta verificación trivial.

**Regla**: nunca declarar un flujo de pago "funcionando" por la pantalla de éxito sola — confirmar el estado server-side (webhook + DB). Conecta con la entrada de abajo (la prueba e2e real destapa bugs) y con la regla del proyecto de no declarar ✅ sin verificación.

## 2026-06-08 — Testing de Checkout Pro (MP): el `payer.email` no puede ser una cuenta real de MP

**Contexto**: al probar un pago, MP rechazaba con el mensaje genérico "una de las partes con la que intentás hacer el pago es de prueba". La pista real **no** estaba en ese texto sino en la pantalla "Revisá tu pago", que mostraba el **email del pagador** = el email real del founder (`jua...@hotmail`), que es su cuenta real de MP. El sitio manda `payer.email` = email del usuario logueado, y el founder se había logueado en el sitio con su email real. Vendedor de prueba + comprador real = mismatch.

**Aprendizaje**: para testear Checkout Pro con credenciales de prueba, **todas las partes deben ser de prueba**, incluido el comprador. El `payer.email` tiene que ser de un test user comprador o de un email **no registrado en MP**. Como el email sale del usuario logueado en el sitio, hay que loguearse en el sitio con un email de prueba (lo que choca con la confirmación de email del signup → o usar un email propio no-MP, o desactivar la confirmación temporalmente).

**Regla**: al testear pagos, verificar **qué identidad/email** se usa como comprador (no solo la tarjeta de prueba) — el error suele ser genérico, pero la pantalla de revisión del proveedor muestra al pagador real. Y recordar: esto es limitación de *testing*; en producción (cliente real + credenciales de producción) funciona normal — no tocar el código por esto.

## 2026-06-08 — La prueba e2e REAL destapa bugs latentes que typecheck/lint/build no ven (y un error específico = diagnóstico directo)

**Contexto**: el trigger `BEFORE INSERT` roto (insertaba en `order_status_events` con FK a una orden que aún no existía) **pasó typecheck, lint, build y estuvo una semana sin detectarse**. Lo destapó la **primera compra de prueba real (e2e)** en el sitio. Por qué se escondió: (a) las herramientas estáticas no ejecutan lógica de DB/runtime; (b) el camino que fallaba (INSERT de orden vía checkout) nunca se había ejecutado (checkout OFF); (c) los UPDATE manuales de status (regente) sí funcionaban → falsa confianza de "el tracking anda".

**Segundo acierto — diagnóstico inmediato por error específico**: el mensaje de Postgres nombró tabla + constraint exactos (`violates foreign key constraint order_status_events_order_id_fkey`) → fui directo a la migración del trigger, confirmé el estado real en el cloud (verificar antes de tocar prod) y armé el fix en minutos. Un error genérico ("no se pudo crear la orden") habría costado mucho más.

**Regla**: antes de activar un flujo crítico (pagos, alta de datos, facturación), correr el **camino completo con datos reales** al menos una vez — `typecheck`/`lint`/`build` verdes NO significan "el flujo anda". Y preservar/propagar errores específicos (nombres de constraint, IDs) hasta los logs, porque colapsan el tiempo de diagnóstico. Conecta con la entrada de MISTAKES del mismo día (BEFORE vs AFTER en triggers).

## 2026-06-08 — Un smoke de credenciales debe imprimir METADATA (no el secreto): caza valores stale/equivocados

**Contexto**: `mp-smoke.ts` imprime el **prefijo** del token (`TEST-` / `APP_USR-`), su **longitud** y el **`live_mode`** — nunca el secreto. Cuando un `MP_ACCESS_TOKEN` viejo (`TEST-...`, de otro proyecto) quedó sin reemplazar en `.env.local`, el smoke mostró prefijo `"TEST-"` cuando yo esperaba `"APP_USR-"` → detecté al instante que estaba usando la credencial **equivocada** (no ausente: válida pero de otro lado).

**Por qué funciona**: un secreto no se puede mostrar (seguridad), pero su **metadata identificable** (prefijo, longitud, flags como `live_mode`, últimos dígitos) sí, y alcanza para confirmar que es el valor correcto sin exponerlo. Un smoke que solo dice "OK / falla" NO habría detectado un token **válido-pero-equivocado** (el TEST- viejo creaba preferencias bien).

**Regla**: todo smoke / health-check de una credencial imprime metadata identificable (prefijo, longitud, modo test/prod, sufijo) **sin** exponer el secreto. Distingue "la credencial es válida" de "es LA credencial correcta". Conecta con la entrada de MISTAKES del mismo día (upsert vs append-if-missing).

## 2026-06-08 — Config de webhook: la Notification URL NO va en "Redirect URIs" (y Checkout Pro no usa scopes de ML)

**Contexto**: guiando al founder (no-técnico) en el panel de aplicaciones de Mercado Libre/MP. Dos cosas que conviene saber/anticipar:

1. **Redirect URI ≠ Notification/callback URL**. El webhook (a dónde el proveedor postea los eventos de pago) va en **"Notificaciones callbacks URL"**, no en "Redirect URIs" (que es el return de un login OAuth y no se usa en Checkout Pro). El founder los confundió; si quedaba mal, los pagos nunca se confirmaban.
2. **El panel "Configuración y scopes" es el avanzado de Mercado Libre** (OAuth, unidades de negocio, scopes de publicaciones/órdenes, tópicos). Para **Checkout Pro** (cobrar en cuenta propia) NO hace falta NADA de eso — son de la API de ML (marketplace), que en este proyecto es la integración futura de sync de stock (ADR-024), no los pagos.

**Regla**: al entregar una URL de webhook para configurar, decir SIEMPRE el nombre exacto del campo destino y diferenciarlo del redirect/return URL (se confunden seguido, sobre todo un no-técnico). Y para Checkout Pro, dejar OAuth/scopes/tópicos vacíos. Conecta con la entrada de MISTAKES del mismo día.

## 2026-06-08 — Verificar las afirmaciones de un subagente sobre el código antes de propagarlas

**Contexto**: invoqué `argentine-ecom` para el trámite de credenciales de Mercado Pago. El procedimiento (su fortaleza real, vía web) fue excelente y útil. Pero cuando intentó "auditar el código" su shell se reinició a mitad y **alucinó**: reportó rutas inexistentes (`lib/mercadopago/`, `app/api/checkout/route.ts`) y afirmó que el webhook era "un stub con `void payload` que no confirma pagos". Yo había leído y editado ese webhook minutos antes — SÍ procesa pagos (marca `paid`, manda emails). Verifiqué con `ls`/`grep` antes de pasarle nada al founder; era falso.

**Por qué importa**: pasar ese "heads-up" sin verificar le habría dado al founder información **alarmante y falsa** ("tu webhook no confirma pagos") justo cuando va a activar los pagos — erosiona confianza y manda a debuggear algo que funciona.

**Regla**: el output de un subagente es un **insumo, no verdad**. Si una afirmación sobre el código (a) contradice lo que vi directamente o (b) es barata de checkear con `ls`/`grep`, verificar antes de actuar o propagar. Los agentes con web son fuertes en dominio/trámites y **erráticos en filesystem tras fallos de entorno** (reboot) — usar su conocimiento de dominio, no su lectura de archivos. Registrado también en AGENT_PERFORMANCE.

## 2026-06-08 — Al agregar un estado/método nuevo, auditar TODAS las superficies que lo muestran (UI cliente + admin + emails)

**Contexto**: agregué un 3er método de envío (`branch` = sucursal del Correo). Al "cerrar" el display, en vez de tocar solo el detalle de pedido del cliente (lo que se pidió), grepié `shipping_method` en todo el repo y cubrí cada superficie que muestra el método: detalle cliente, detalle admin, email de confirmación al cliente, email de notificación al admin.

**Resultado**: cacé un **bug latente** — los dos templates de email manejaban solo `delivery`/`pickup`, así que un envío a sucursal habría mostrado al cliente "te enviamos a <tu dirección de casa>" (engañoso) en vez de la sucursal. Lo arreglé en el mismo cambio (agregué el caso `branch` + `branchName` a ambos templates + al armado en el webhook).

**Por qué funciona**: un dato nuevo de dominio (método de envío, estado de pago, tipo de producto) se renderiza en N superficies; tratar solo la que te piden deja las otras inconsistentes y se convierte en bug cuando se activa el flujo. Es el mismo principio que la regla 15 del proyecto (image scale en TODAS las superficies de catálogo).

**Candidato a regla**: al introducir un valor/estado nuevo en un dominio (envío, pago, status de orden), `grep` el campo en todo el repo y cubrir cada superficie en el mismo cambio — web cliente, web admin, emails, y futuras (factura/PDF). No esperar a que el bug aparezca en producción.

## 2026-06-08 — Integrar API externa (MiCorreo): smoke test self-contained ANTES de wirear + no confiar en campos de response no garantizados

**Contexto**: integración de la API MiCorreo (Correo Argentino) para cotizar envíos. Tres patrones que funcionaron:

1. **Smoke test self-contained que NO importa el código de la app**: `scripts/correo-smoke.ts` re-implementa el mínimo (login + /rates con `fetch` plano) en vez de importar `lib/correo/*`. Beneficios: (a) **aísla el diagnóstico** — si el smoke pasa pero la web falla, es nuestro wiring; si ambos fallan, es la credencial/endpoint; (b) **evita el problema de `server-only`** — los módulos `lib/correo/*` tienen `import 'server-only'` que tira error fuera del contexto react-server (un script `tsx` plano resuelve la condition `default`→`index.js` que throwea), así que importarlos desde un script no anda. El smoke independiente esquiva eso. Validó las credenciales contra PROD en el primer intento.

2. **No confiar en campos de response no garantizados**: el manual mostraba `{ token, expires }`, pero en la práctica `expires` vino **vacío**. Como el `auth.ts` ya leía el vencimiento del claim `exp` del propio JWT (`Buffer.from(token.split('.')[1],'base64')` → `.exp*1000`) con fallback a TTL fijo, el token cache funcionó igual. Lección: cuando un proveedor te da un JWT, el `exp` del token es **fuente de verdad inequívoca** (epoch UTC) — mejor que un campo `expires` string sin timezone que además puede no venir.

3. **Wrapper con fallback que nunca rompe el flujo crítico**: `resolveDeliveryQuote()` envuelve la llamada a la API en try/catch y cae a la tabla por zonas (`calculateShipping`, pura) ante cualquier error. El checkout cotiza siempre, con o sin API. Patrón replicable para toda integración externa en un path crítico (pago, envío, factura).

4. **Verificación multi-zona reutilizable con lista curada de "cabeceras"**: el smoke evolucionó a `pnpm correo:smoke zonas`, que cotiza una lista fija de CPs **cabecera de cobertura garantizada** (capitales / ciudades grandes) y reporta "N/N OK". Clave para una API de logística: NO verificar con CPs cualquiera (algunos son área rural sin cobertura y devuelven `rates:[]`, un falso negativo) sino con cabeceras conocidas. Así, un resultado "22/22" es señal inequívoca de salud de la integración, repetible post-deploy / post-cambio de credenciales.

**Por qué funciona**: separar "¿anda el proveedor?" de "¿anda mi código?" colapsa el espacio de debugging. Y diseñar el degradado ANTES de necesitarlo evita que una caída de un tercero tire una venta. La lista curada elimina el ruido de datos de prueba malos.

**Candidato a regla** (si se repite en otra integración): "toda API externa nueva arranca con un smoke self-contained + un wrapper con fallback al comportamiento previo".

## 2026-06-06 — HyperFrames (HTML→MP4): leer la doc/scaffold ANTES de improvisar, fuentes deterministas, y binarios aislados sin tocar el sistema

**Contexto**: founder pidió "hacer algo con hyperframe". Era una CLI desconocida (`npx hyperframes render`, HeyGen). Armé un template de video de producto 1:1 en `marketing/product-video/`. Lo que funcionó:

1. **Identificar qué es ANTES de actuar**: `grep` en el codebase (no existía) → `AskUserQuestion` ("¿qué es hyperframe?") → respondió "npx hyperframes render" → web search. Evitó construir sobre una suposición errónea (pensé que podía ser marca/librería/efecto).
2. **Usar el scaffold oficial como fuente de verdad del formato**: `hyperframes init` generó un `CLAUDE.md` con las reglas exactas (clips necesitan `class="clip"` + `data-start/duration/track-index`; timeline GSAP en pausa en `window.__timelines`; **determinismo: sin `Date.now`/`Math.random`/`fetch`**). Leer eso > adivinar el formato.
3. **Fuentes deterministas**: el compilador NO resuelve `var(--serif)` ni Google Fonts (warning explícito + fallback a fuente genérica). HyperFrames trae un set mapeado (Inter, Playfair Display, etc.). Usar nombres literales mapeados → tipografía correcta SIN depender de la red en el render. Bajé Fraunces → Playfair Display (sustituto elegante mapeado).
4. **Binarios pesados sin tocar el sistema**: faltaba FFmpeg+FFprobe y no había brew. En vez de instalar Homebrew (cambio global), usé `ffmpeg-static`/`ffprobe-static` (npm, aislados) + symlinks `bin/` + `postinstall` que los recrea. `npm run render` quedó self-contained y portable.
5. **Validar con frames extraídos**: `ffmpeg -ss <t> -frames:v 1` por escena + leer los JPG con el harness → review visual real antes de declarar "listo".

**Por qué funciona**: tool nueva + no-técnico esperando un resultado → el riesgo es construir sobre un malentendido o dejar algo no-determinístico que rompa en otra máquina. Anclar en el scaffold oficial y aislar las dependencias da un entregable reproducible y versionable.

**Aplicable a**: cualquier tool/CLI nueva (identificar→scaffold→doc local→aislar deps→validar output). Candidato a regla si se repite.

## 2026-06-05 — Diagnóstico de "el cambio no surte efecto": separar "no se aplica" de "se aplica pero el valor es chico", y verificar POR SUPERFICIE

**Contexto**: el founder reportó que subir el scale del Esvep (1.15→1.6→2.0) "no surtía efecto, se veía igual que al principio". Tentación: seguir subiendo el número a ciegas. En vez de eso, el diagnóstico que funcionó:

1. **Confirmar que el override se aplica** antes de cambiar el valor: `grep -o 'scale([0-9.]*)'` en el HTML renderizado del grid → apareció `scale(1.6)` → el override SÍ funcionaba ahí. Esto descartó "el valor es chico" como única causa.
2. **Verificar el path exacto** DB vs override key (con nombres de archivo ruidosos —guiones múltiples— es fácil un mismatch silencioso). Matcheaban → no era eso.
3. **Verificar SUPERFICIE POR SUPERFICIE**, no una sola: corrí el mismo `grep -oc 'scale(2)'` en todos-sol, deportivos, polarizados, rusty, hombre Y la PDP. La PDP daba 0 → ahí estaba el agujero (la galería no consultaba `getImageScale`).
4. **Preguntar/inferir qué pantalla mira el founder**: estaba en la PDP, justo la superficie sin override.

**Cómo aplicar**: cuando un cambio "no se ve", NO subir el valor a ciegas. Primero `grep` el HTML para confirmar si la transformación está presente; si está en algunas superficies y en otras no, el bug es de cobertura (falta cablearla en un componente), no de valor. Verificar SIEMPRE el set completo de superficies de la regla 15, incluida la PDP. Ver MISTAKES 2026-06-05 (el fix concreto). Relacionado con [[stock-siempre-ml]] (verificar en runtime, no asumir).

## 2026-06-05 — "Sigue chica" no siempre es scale mal: verificar que el `scale()` se aplica ANTES de subirlo; las fotos 2:1 necesitan más scale que el default del tipo

**Contexto**: subí el Esvep envolvente a 1.6/1.3 (el valor que funcionó en Sotion/Eslav) y el founder dijo "sigue viéndose chica". Antes de seguir tirando números al azar, diagnostiqué.

**Diagnóstico que funcionó** (2 pasos, ~2 min):
1. **¿El path matchea?** Comparé el `storage_path` real de la primaria en la DB contra la clave del override carácter por carácter (clave: nombres con guiones múltiples como `ESVEP-MBLK--S10-POL---perfil.jpg` se prestan a typos). Matcheaba.
2. **¿El scale se aplica?** `curl` al grid + `grep -o 'scale([0-9.]*)'`: confirmé que `scale(1.6)` estaba en el HTML. O sea el override andaba; NO era bug.

**La causa real**: la foto del Esvep es **muy ancha (1000×491, relación 2:1)**. En una card aspect 3/2 con `object-contain`, una foto 2:1 entra por ancho y deja barras arriba/abajo → el anteojo ocupa ~73% de la altura ANTES del scale, y si además está chico dentro del cuadro, el default del tipo ("envolvente" = 1.6) no alcanza. Subió a 2.0/1.6.

**Regla**: cuando el founder dice "se ve chica" tras un scale, (1) NO asumir que el número está mal — primero verificá que el `scale()` aparece en el HTML renderizado y que el path matchea la clave del override; (2) mirá el aspect ratio de la foto: las 2:1 (anchas) necesitan más scale que las 3:2 para el mismo tamaño visual de anteojo. El "default por tipo de armazón" es punto de partida, no garantía. Ver [[el-sizes-de-next-image-debe-coincidir-con-las-columnas-reales-del-grid]].

## 2026-06-05 — Carga parcial + completar incremental cuando una variante tiene input sucio (Rusty Esvep)

**Contexto**: el Esvep tenía 3 variantes pero una (SBLK no-pol) vino con SKU duplicado (112881, igual que la SBLK POL) → habría roto el `UNIQUE(sku)`. Las otras 2 estaban limpias.

**Qué funcionó**: NO bloquear todo el producto por una variante con dato sucio. Cargué las 2 variantes limpias (producto live, vendible) y dejé la 3ª pendiente, flagueada explícita en CURRENT_STATE/CLOUD_APPLIED. Cuando el founder pasó el SKU real (112880), la completé **incremental** con un solo MCP: `UPDATE products` (descripción 2→3 variantes) + `INSERT variant` + `INSERT images`, sin reaplicar todo el seed. Después sincronicé el seed en disco para reproducibilidad.

**Cómo aplicar**: si N-1 variantes están limpias y 1 tiene input ambiguo (SKU dup, foto sin mapear, medida faltante), cargá las limpias YA y dejá la dudosa como TODO flagueado. Completá con UPDATE/INSERT incremental cuando llegue el dato. Da valor inmediato y evita que un dato sucio frene todo el producto. Ver [[stock-siempre-ml]].

**Sub-nota (límite de imágenes del harness)**: cuando la conversación ya tiene MUCHAS imágenes, el harness no deja abrir imágenes nuevas (error "many-image requests", aunque la imagen sea <2000px). Si necesitás ver una foto para resolver una ambigüedad y no podés, asigná por mejor-criterio y **flagueá explícito** que fue a ojo para que el founder confirme — no inventes silenciosamente (counter del mistake de fotos del CCCP).

## 2026-06-05 — Cómo cambiar la variante predeterminada (y la imagen del grid) de un producto ya cargado

**Contexto**: founder pidió que el Vulk Clems abriera con la variante MBLK (no la CRY que estaba primera) y que la card del grid mostrara la foto del MBLK.

**Qué funciona**: la "variante por default" sale de `toProductCardData` → `defaultVariant = sortedInStock[0]` (la primera CON stock ordenada por `sort_order`). Y la imagen del grid = la primaria de esa variante. Entonces, para cambiar el default de un producto ya cargado, alcanza con **2 UPDATEs**:
1. `product_variants.sort_order = 1` en la variante deseada (y reacomodar las demás 2,3…). Esto la vuelve el `defaultVariant`.
2. `product_images.is_primary = true` en su foto de perfil (y `false` en la de la vieja default), para que cualquier path que use el flag `is_primary` también la elija.

No hace falta tocar código — es 100% data. Verificable: `curl /<categoria>` y grepear el nombre de archivo de la foto en la card.

**Bonus (scale por variante divergente)**: el override de scale es **por-path**, así que variantes del MISMO producto pueden tener scales distintos cuando sus fotos vienen de orígenes/tamaños distintos (Clems: MBLK en .webp a 1.15 vs CRY/SBLK en .jpg a 1.25, porque el anteojo se veía más chico en esas 2). No asumir scale uniforme por producto si las fotos no son homogéneas. Ver [[stock-siempre-ml]].

## 2026-06-04 — Revisado, SIN NOVEDAD (seed Rusty Dileri, no aplicado)

Constancia de cierre (regla 11): sin learning nuevo. Carga estándar de 2 MLAs simples (cuadrado femenino), bloqueada esperando fotos (carpeta vacía + CDN 400) → seed listo, no aplicado. El patrón "hold hasta CDN 200" ya está documentado (caso Deserve). Nada nuevo.

## 2026-06-04 — Fotos compartidas entre variantes + constraint de path único (carga Rusty CCCP)

**Contexto**: el CCCP tiene 4 variantes (2 pol + 2 antirreflex) pero el founder subió solo 2 pares de fotos ("el modelo es el mismo, solo varía pol/no-pol"). El único eje visual real es el color del frente (MBLK negro mate vs SBLK negro brillo).

**Problema técnico**: `product_images` tiene `ON CONFLICT (product_id, storage_path)` → **un mismo storage_path NO puede atarse a dos variant_id distintos** dentro del mismo producto. No se puede "reusar" una foto para 2 variantes.

**Solución correcta (la que pidió el founder)**: cada variante debe mostrar la foto de SU color de frente — el MBLK-AR usa las fotos del MBLK, el SBLK-AR las del SBLK. Como el constraint impide reusar un path, se **COPIAN los archivos en el bucket** con un sufijo (ej. "AR") vía la storage API `POST /storage/v1/object/copy` (auth con `SUPABASE_SERVICE_ROLE_KEY` de `.env.local`), y se ata cada copia a su variante. Resultado `vars_sin_foto=0`, cada variante con su color.

**Por qué COPIA y no fallback por código**: la resolución de imagen por `variant_id` vive en 4 puntos (buildCardVariants + toProductCardData.buildVariantImages en `to-product-card-data.ts`; buildGalleryImages + findPrimaryImagePathForVariant en `product-page.tsx`). Un fallback "por frame_color" tendría que tocar los 4 de forma consistente (riesgo transversal, como el bug de precio OOS en 4 superficies). La copia en storage es local al producto, cero código, y funciona en las 4 superficies porque cada variante tiene filas de imagen reales.

**Cómo aplicar**: cuando el founder diga "subo solo N fotos, el modelo es el mismo" PERO quiera que cada variante muestre su color: (1) identificar el eje visual (color de frente); (2) copiar en el bucket los pares que faltan con sufijo distintivo (`/object/copy`); (3) atar cada copia a su variante en `product_images`; (4) agregar scale overrides para los paths nuevos; (5) documentar la copia en el seed (es reproducible pero los archivos son copias — si el founder reemplaza una foto, hay que reemplazar también la copia). Ver [[stock-siempre-ml]].

## 2026-06-04 — Revisado, SIN NOVEDAD (carga Vulk Katleen Receta)

Constancia de cierre (regla 11): sin learning nuevo. Carga estándar de la versión receta del Katleen sol (reusó la convención receta documentada en Misty/Xold: `lens_compatibility` + `hinge_system`, sin lens/polarized) + multi-variante (variation_code, ya documentado). El naming con DOBLE espacio (`KATLEEN M0292  perfil.jpg`) se cazó con el curl al CDN antes de aplicar (patrón ya documentado). Nada nuevo que sistematizar.

## 2026-06-04 — Revisado, SIN NOVEDAD (carga Vulk Katleen)

Constancia de cierre (regla 11): sin learning nuevo. Carga estándar de 4 MLAs simples (cuadrado femenino). El patrón "CDN manda sobre storage.objects" se **reconfirmó por 3ª vez** (storage tenía solo `.emptyFolderPlaceholder` por lag, CDN dio 200 → fotos sí estaban, apliqué directo). Ya está documentado abajo y candidato a regla permanente (regla 4 de este archivo). Nada nuevo que sistematizar.

## 2026-06-04 — `storage.objects` vacío + CDN 400 = fotos genuinamente NO subidas → armar el seed pero NO aplicarlo

**Categoría**: Carga de productos / Integridad del grid en vivo
**Confianza**: 🟢 Alta (caso complementario, aplicado este turno con Vulk Deserve)

**Qué funcionó**: Al cargar el Vulk Deserve, `storage.objects ILIKE 'vulk-deserve/%'` dio vacío. El learning previo ([[el del 2026-06-02 sobre CDN 200 manda cuando storage.objects tiene lag]]) dice "no asumir que está ausente solo porque la tabla está vacía — cruzar con CDN". Lo hice: el CDN dio **400** para los 7 paths (y 200 para una foto de control de Way Back, confirmando que la URL base estaba bien). Vacío en la tabla **+ 400 en el CDN** = las fotos realmente no están subidas, no es lag. Decisión: escribir el seed completo + scale override + docs (queda listo para aplicar en 1 paso) pero **NO aplicarlo vía MCP**, porque el producto es `is_active=true` y saldría en el grid en vivo con imágenes rotas (404). Próximo paso explícito al founder: subir fotos → re-verifico CDN 200 → aplico.

**Por qué funciona / principio reutilizable**: el CDN es la fuente de verdad bidireccional, no solo para confirmar presencia (200) sino también ausencia (400 + tabla vacía). Y la regla de integridad: **un seed de producto activo no se aplica hasta que TODAS sus fotos dan 200** — mejor un producto "pendiente" en docs que un producto roto en el grid público. El trabajo no-bloqueado por fotos (datos ML, atributos, copy, scale baseline, docs) se hace igual para que la aplicación final sea atómica.

**Para la próxima**: orden de carga = `storage.objects` (nombres) → CDN curl (200=aplicar / 400+tabla vacía=hold) → aplicar MCP solo con todo en 200. Si las fotos no están, dejar seed+overrides+docs listos y devolver al founder el próximo paso exacto (nombres de archivo + carpeta), no aplicar a medias.

## 2026-06-02 — Revisado, SIN NOVEDAD (carga Vulk Way Back + confirmación shape wayfarer)

Constancia de cierre (regla 11): sin learning nuevo. Carga estándar de 4 MLAs simples con nombres de foto MUY inconsistentes (dots/dashes/"galeria"/sin-espacio) — resueltos consultando storage.objects + verificando CDN 200 (patrón ya documentado en learnings previos de filenames + storage-vs-CDN). Nada nuevo que sistematizar.

## 2026-06-02 — `hidden sm:block` evita que next/image descargue una imagen en mobile (no solo la oculta)

**Categoría**: Performance / next/image
**Confianza**: 🟢 Alta (técnica conocida, aplicada este turno)

**Qué funcionó**: La card cargaba 2 fotos por producto (primary + secondary para la swap de hover). La swap es solo desktop, pero en mobile la 2ª igual se descargaba (lazy load al entrar al viewport) = bytes al pedo. Solución: `hidden sm:block` en el `<Image>` secundario. `hidden` = `display:none` en mobile → el elemento no tiene caja → el lazy-load (IntersectionObserver) nunca dispara → **el browser no baja la imagen** hasta el breakpoint `sm` donde pasa a `block`. Resultado: ~mitad de requests de imágenes en celular. Acompañé con `sizes` que reflejan que es desktop-only.

**Por qué funciona / principio reutilizable**: `display:none` no es solo visual — corta la descarga de imágenes lazy. Sirve para cualquier imagen "solo desktop" (hover, decorativos): `hidden sm:block` ahorra ancho de banda real en mobile, no solo la esconde. (Ojo: NO usar para imágenes above-the-fold que sí se ven en mobile.)

**Para la próxima**: imagen que solo aplica en desktop → `hidden sm:block` + `sizes` desktop-only. Para esconder visualmente PERO precargando, sería opacity/visibility; para ahorrar descarga, `display:none`.

## 2026-06-02 — La convención de naming `-dark`/`-light` en logos paga: extender el nav a logos fue trivial

**Categoría**: Componentes / Reuso
**Confianza**: 🟡 Media (1 reuso esta sesión)

**Qué funcionó**: Para probar logos de marca en el mega-nav, la extensión fue mínima y limpia: campo opcional `brandLogo` en `MegaItem` + `BRAND_LOGOS` map, y el render reusó `getBrandAssetUrl` + `shouldInvertLogo` (ya existentes para la PDP). Reef (logo claro) se auto-invierte sobre el fondo claro del menú sin lógica nueva, gracias a la convención de naming `-light`/`-dark`. Un campo opcional en el tipo de datos + un helper compartido = feature reversible sin tocar la estructura.

**Por qué funciona / principio reutilizable**: cuando una decisión transversal (acá: convención de naming de logos para inversión) está encapsulada en un helper, agregar una superficie nueva que la necesite es enchufar el helper, no reimplementar. Pagó el haber centralizado `shouldInvertLogo` en su momento.

**Para la próxima**: features visuales "a probar" → campo opcional en el tipo + helper compartido → fácil de prender/apagar/revertir según el veredicto del founder.

## 2026-06-02 — Revisado, SIN NOVEDAD adicional (cierre sesión perf/scale/logos)

Constancia de cierre (regla 11): el learning útil de la sesión ya está arriba ("sizes de next/image debe coincidir con las columnas del grid", commit 885e537). El ajuste de scale del Gresent y la consulta de diseño de logos en el nav no aportan learning nuevo (uno es cosmético, el otro es una recomendación de diseño registrada en CURRENT_STATE).

## 2026-06-02 — El `sizes` de next/image debe coincidir con las columnas REALES del grid (si no, sirve imágenes 2× más grandes)

**Categoría**: Performance / next/image
**Confianza**: 🟢 Alta (bug encontrado + corregido)

**Qué funcionó**: Ante "¿se pueden agilizar las imágenes?", audité y encontré que la `ProductCard` declaraba `sizes="(max-width: 640px) 100vw, ..."` pero TODOS los grids del catálogo son `grid-cols-2` en mobile (cada card ocupa ~50vw, no 100vw). Con `100vw`, Next elige del srcset un candidato ~2× más ancho del que se muestra → en celular se descargaba el doble de pixeles al pedo. Corregido a `(max-width: 768px) 50vw, 33vw` (2-col mobile / 3-col desktop). Gratis, sin tocar imágenes.

**Por qué funciona / principio reutilizable**: `sizes` le dice a Next qué ancho de imagen servir del srcset. Si miente (dice más de lo real), sirve de más. Debe reflejar el ancho REAL del slot en cada breakpoint = las columnas del grid. Un `sizes` desincronizado del CSS es un costo invisible (no rompe nada, solo pesa de más).

**Para la próxima**: cada vez que se cambian las columnas de un grid (grid-cols-*), revisar el `sizes` del `<Image>` que vive adentro. Hoy: catálogo 2-col mobile / 3-col md → `(max-width: 768px) 50vw, 33vw`.

## 2026-06-02 — Revisado, SIN NOVEDAD (carga Rusty Gresent)

Constancia de cierre (regla 11): sin learning nuevo. Carga estándar de un multi-variante (reusó el patrón de variation_code documentado en Vulk Biller) + descripción con `**negrita**` ya soportada (learning del fix render). Las fotos se verificaron por CDN 200 (ya documentado). Nada nuevo que sistematizar.

## 2026-06-02 — Revisado, SIN NOVEDAD (ajuste copy Misty)

Constancia de cierre (regla 11): sin learning nuevo. Ajuste de copy (sacar párrafo duplicado del callout). Aplica el mismo principio ya conocido de no repetir el mismo mensaje en callout y descripción; nada nuevo que sistematizar.

## 2026-06-02 — Para "¿la foto está disponible?" el CDN (HTTP 200) manda; `storage.objects` puede tener lag

**Categoría**: Storage / Verificación
**Confianza**: 🟢 Alta (observado este turno)

**Qué funcionó**: Refinamiento del learning previo ("consultar storage.objects para nombres exactos"). Resultó que `storage.objects` puede ir **detrás** del CDN para uploads muy recientes: dio vacío para el Misty Receta cuando las fotos YA estaban servidas (CDN 200). El flujo robusto: (1) `storage.objects` para descubrir nombres, pero (2) **el HTTP 200 del CDN es la verificación de disponibilidad definitiva** — el seed se aplica solo cuando las URLs públicas dan 200. Probar el CDN "por las dudas" cuando storage.objects daba vacío evitó pedirle al founder que re-subiera fotos que ya estaban.

**Por qué funciona / principio reutilizable**: hay dos sistemas (tabla de metadata vs object store/CDN) que pueden desincronizarse momentáneamente. Para una decisión de "¿puedo enlazar esta foto?", la verdad operativa es servir el byte (CDN 200), no el registro en la tabla. Ver [[el mistake del mismo día sobre storage.objects lag]].

**Para la próxima**: mantener el orden — storage.objects (nombres) → CDN curl 200 (disponibilidad, decisión de aplicar). Si discrepan, gana el CDN.

## 2026-06-02 — Revisado, SIN NOVEDAD (preparación seed Rusty Misty Receta)

Constancia de cierre (regla 11): no hubo learning nuevo. La carga del Misty Receta reusó convenciones ya documentadas: multi-variante con `variation_code` (ver learning Vulk Biller), convención de receta `lens_compatibility` + `hinge_system` (heredada de Spell/Xold receta), y `size_fit` estructurado + callout (learning del Misty sol, mismo turno). Nada nuevo que sistematizar.

## 2026-06-02 — Talle como dato estructurado (`size_fit`) + callout warning, no solo texto, cuando hay reclamos de talle

**Categoría**: Carga de productos / UX / Anti-devolución
**Confianza**: 🟡 Media (aplicado a Rusty Misty; validar con datos de devoluciones)

**Qué funcionó**: El founder reportó reclamos de talle en el Rusty Misty (armazón chico) y pidió "énfasis fuerte". En vez de solo escribirlo en la descripción, lo resolví en 3 capas: (1) dato estructurado `size_fit: "chico"` → badge "Talle chico" visible en card Y PDP (pipeline central, regla 15); (2) callout `type: "warning"` arriba de todo con el mensaje explícito "armazón pequeño, para rostros chicos, revisá las medidas"; (3) mención en short_description + meta. Agregué el token "chico" a `size-fit.ts` en vez de reusar "junior" (que se lee como infantil y confundiría).

**Por qué funciona / principio reutilizable**: un atributo que genera devoluciones (talle) debe ser un dato estructurado con badge, no una línea perdida en la descripción — aparece en el grid ANTES del click y en la decisión de compra. El `warning` callout es legítimo (info real anti-devolución, no urgencia falsa). Y si el vocabulario existente no encaja (junior≠chico), agregar el token correcto es mejor que forzar uno que confunde.

**Para la próxima**: cualquier producto con particularidad de talle/calce que pueda generar reclamos → `size_fit` + callout warning, no solo prosa. Tokens de talle viven en `lib/catalog/size-fit.ts` (hoy: junior, chico).

## 2026-06-02 — Centralizar la detección de "polarizado" en una función robusta destapó variantes que el criterio viejo perdía

**Categoría**: Catálogo / Datos / Refactor que reveló un gap
**Confianza**: 🟡 Media-alta (validado este turno)

**Qué funcionó**: Al rehacer `/polarizados` ("entra el producto con ≥1 variante polarizada"), extraje la detección a `isPolarizedVariant()` en `lib/catalog/polarized.ts` (fuente única, antes duplicada en variant-list) que chequea 4 fuentes: `polarized`, `is_polarized`, `lens_treatment[]`, y `model_code` con "POL". Al usarla, **Vulk Yamain apareció en /polarizados** — su variante polarizada usa el flag `is_polarized` (no `polarized`), así que el criterio anterior (product-level `lens_treatment @> ["polarized"]`) la perdía por completo. O sea: la inconsistencia de flags entre seeds (`polarized` vs `is_polarized` vs `model_code POL`) hacía que el filtro viejo tuviera falsos negativos silenciosos.

**Por qué funciona / principio reutilizable**: cuando un mismo concepto ("¿es polarizado?") se decide en varios lugares con lógicas distintas, hay drift y gaps. Centralizar en una función tolerante a las variantes de datos (a) elimina duplicación y (b) hace que TODOS los consumidores (badge de card, variant-list, filtro /polarizados) coincidan. Bonus: exponer el detector reveló datos mal-flageados sin tener que auditarlos a mano.

**Para la próxima**: cuando un atributo se guardó con flags inconsistentes entre seeds (pasa seguido acá), el fix correcto no es normalizar 30 seeds a mano sino un detector único tolerante + usarlo en todos lados. Y a futuro, fijar UN flag canónico (`polarized`) en `PRODUCT_SCHEMA` y migrar gradualmente.

## 2026-06-02 — Render vs strip de markdown inline: dos funciones, una para HTML visible y otra para datos estructurados

**Categoría**: Contenido / Render / SEO
**Confianza**: 🟡 Media-alta (resolvió el bug de negritas limpio, sin librería)

**Qué funcionó**: Para arreglar las `**negritas**` que salían literales, en vez de meter una librería de markdown (regla 6) escribí dos helpers chicos en `lib/format/inline-bold.tsx`:
- `renderInlineBold(text)` → parte por `/\*\*(.+?)\*\*/g` y envuelve los tramos en `<strong>`. Para la descripción VISIBLE.
- `stripInlineBold(text)` → reemplaza `**...**` por el contenido pelado. Para JSON-LD / meta / og (texto plano).

El mismo string fuente alimenta dos destinos con necesidades opuestas (HTML con formato vs texto limpio), y cada uno tiene su función. Cero dependencias nuevas, y el formato del catálogo es tan acotado (solo negrita) que un split por regex alcanza.

**Por qué funciona / principio reutilizable**: cuando un texto con marcado va a más de un destino, separar "render" (a nodos/HTML) de "strip" (a texto plano) evita que el marcado se filtre donde no corresponde (ej. asteriscos en un rich snippet de Google). Para marcado mínimo, no hace falta una lib de markdown — un par de regex es más simple y auditable.

**Para la próxima**: si aparece otra necesidad de formato en descripciones (italic, listas), evaluar si conviene una lib real (`react-markdown`) en vez de seguir sumando regex. Hoy con solo negrita, los helpers bastan.

## 2026-06-02 — Verificar de QUÉ producto son las fotos antes de usarlas (colisión de nombres entre carpetas)

**Categoría**: Carga de productos / Storage / Error prevenido
**Confianza**: 🟢 Alta (prevenó usar fotos ajenas este turno)

**Qué funcionó**: Al cargar Rusty Eslav, busqué sus fotos en storage y encontré archivos de nombre casi idéntico (`MBLUE-R-GREEN-POL-YELLOW-*`, `MBLK-S10-POL-YELLOW-*`) pero en la carpeta `rusty-sotion/`. En vez de asumir que servían para Eslav, crucé contra `product_images` del Sotion existente y confirmé que **son de Sotion** (Sotion es otro deportivo envolvente polarizado con lentes amarillas, líneas casi gemelas). Conclusión: las fotos de Eslav NO estaban subidas → frené la aplicación del seed y pedí subirlas a `rusty-eslav/`. Evité linkear fotos de otro producto.

**Por qué funciona / principio reutilizable**: en catálogos con líneas gemelas (Eslav/Sotion, mismas variantes de color), los nombres de archivo colisionan. La carpeta (`<slug>/`) es lo único que separa. Antes de usar una foto cuyo nombre matchea lo que espero, verificar (a) que esté en la carpeta del producto correcto y (b) que no esté ya referenciada por otro `product_images`. Reafirma el learning de `storage.objects` (consultar el bucket, no la captura).

**Para la próxima**: si las fotos esperadas aparecen en una carpeta de OTRO producto, NO usarlas — confirmar con el founder que las suba a `<slug>/` propio. Y si dos modelos se parecen sospechosamente (mismas variantes + fotos), preguntar si no es duplicación antes de crear el producto.

## 2026-06-02 — Dónde filtrar el catálogo: query (columnas/FK) vs post-fetch en JS (valores derivados)

**Categoría**: Catálogo / Arquitectura de queries / Performance
**Confianza**: 🟡 Media-alta (decisión aplicada con buen resultado este turno)

**Qué funcionó**: Al sumar filtros de marca + precio a la vista filtrada, separé el criterio según el tipo de dato:
- **Marca → en la query** (`.in('brand.slug', ...)` sobre el join inner): es una FK/columna directa, el filtro es exacto y barato en SQL.
- **Precio → post-fetch en JS** (`filterByPriceBucket`): `minPriceCents` es un **valor derivado** (mínimo de las variantes con stock), no una columna — filtrarlo en SQL exigiría un agregado/subquery complejo. Con el catálogo actual (~21 productos/categoría) traer y filtrar en memoria es trivial y mucho más simple. Mismo criterio que ya usaba `sortCatalog`.

Además, factoricé los buckets/parsers en `lib/catalog/filters.ts` **server-safe** (sin `'use client'`) — repitiendo la lección del bug de `normalizeSort`: constantes/helpers compartidos por page (server) y barra de filtros (client) van en `lib/`, nunca en el componente client. Y verifiqué cada combo de filtro con curl (200 + conteos reales) antes de cerrar.

**Por qué funciona / principio reutilizable**: filtrar en SQL solo paga cuando el campo es indexable/directo y el dataset grande; para valores derivados o catálogos chicos, post-fetch en JS es más simple y correcto. Reevaluar SOLO si el catálogo crece a cientos de productos por categoría (ahí conviene materializar `min_price_cents` en la tabla y filtrar en SQL).

**Para la próxima**: nuevos filtros de catálogo → preguntar "¿es columna/FK o valor derivado?" antes de decidir query vs JS. Constantes/parsers compartidos → `lib/`. Validar combos con curl.

## 2026-06-02 — Auditoría CRO con 3 subagentes en paralelo (PDP / grid / home) antes de tocar código

**Categoría**: Proceso / CRO / Uso de subagentes
**Confianza**: 🟡 Media-alta (1 aplicación exitosa este turno)

**Qué funcionó**: Ante un pedido amplio ("mejoremos el sitio" → eje conversión), en vez de improvisar lancé 3 subagentes en paralelo, uno por superficie (PDP, grid/card, home), cada uno con criterios CRO explícitos para óptica AR y la instrucción de devolver TOP-5 fricciones con `archivo:línea` + quick-wins, sin escribir código. Volvieron en ~1-1.5 min con hallazgos accionables y grounded (incluidos 2 de compliance que yo no tenía presentes: claim "cuotas sin interés" y "consultá disponibilidad"). Eso convirtió un pedido vago en un plan de 3 batches priorizados que el founder pudo aprobar de una.

**Por qué funciona / principio reutilizable**: las superficies de conversión son independientes → se auditan en paralelo sin contención. Pedir `archivo:línea` obliga al agente a leer código real (no opinar en abstracto) y me deja verificar antes de aplicar. Separar AUDIT (read-only) de EJECUCIÓN evita que un agente "arregle" algo sin mi criterio.

**Para la próxima**: para cualquier mejora transversal de UX/CRO/SEO, auditar en paralelo por superficie primero (read-only, con `archivo:línea`), sintetizar en batches priorizados, pedir go, y recién ahí ejecutar yo. Marcar siempre los hallazgos de compliance como "van sí o sí".

## 2026-06-02 — Consultar `storage.objects` para los nombres EXACTOS de fotos antes de armar el seed

**Categoría**: Carga de productos / Storage / Error prevenido
**Confianza**: 🟢 Alta (prevenó error real este turno)

**Qué funcionó**: Al cargar Rusty Beason, la lista de fotos que pasó el founder (captura) venía **cortada abajo** y con prefijos inconsistentes (`AGALERIA-WEB-...` con A inicial, vs `GALERIA-WEB-...`). En vez de transcribir la captura (riesgo de typo + omisión), corrí `SELECT name FROM storage.objects WHERE bucket_id='products' AND name ILIKE 'rusty-beason/%'`. Eso reveló: (a) los nombres reales exactos con sus prefijos raros, (b) que **S.PINK/G.BROWN no tenía fotos** subidas (4 variantes pero solo 3 con imágenes). Cargué los paths exactos y flageé la variante sin foto.

**Por qué funciona / principio reutilizable**: `storage.objects` es la fuente de verdad de qué hay en el bucket. Una captura de pantalla puede estar cortada, tener typos de OCR, o no mostrar todo. Refuerza la regla previa "no asumir que la lista del founder es exhaustiva" (MISTAKES medidas.jpg) — pero la mejora: en vez de *preguntar* si falta algo, **consultar el bucket directo**.

**Para la próxima carga**: SIEMPRE `SELECT name FROM storage.objects WHERE bucket_id='products' AND name ILIKE '<slug>/%'` antes de escribir las filas de `product_images`. Cruzar contra las variantes para detectar las que quedan sin foto.

## 2026-06-02 — El endpoint `ml-import-preview` solo funciona en PRODUCCIÓN, no en local

**Categoría**: Carga de productos / Workflow / Tooling
**Confianza**: 🟢 Alta (verificado este turno)

**Qué funcionó**: Al cargar Rusty Dapper, el endpoint local `http://localhost:3000/api/admin/ml-import-preview/<MLA>` devolvió **500** (`ML_CLIENT_ID y ML_CLIENT_SECRET son requeridas`). Esas credenciales OAuth de Mercado Libre **solo están en Vercel**, no en `.env.local` (que solo tiene Mercado Pago). El token guardado vive en la tabla `marketplace_integrations` pero `mlFetch` falla antes de usarlo si faltan client id/secret. **Solución**: pegarle al mismo endpoint pero en producción → `https://opticacarballo.com.ar/api/admin/ml-import-preview/<MLA>` (HTTP 200, devuelve el JSON crudo del item con price/available_quantity/variations).

**Por qué funciona / principio reutilizable**: el endpoint es `force-dynamic` y no tiene auth (iter 1), así que corre igual en prod con las env vars correctas. Para futuras cargas: NO perder tiempo levantando `pnpm dev` para fetchear ML — ir directo a producción. (El dev server solo hace falta si necesito probar render local.)

**Para la próxima carga**: `curl -s "https://opticacarballo.com.ar/api/admin/ml-import-preview/MLA<id>"` para price/stock/variations. Mismo patrón para verificar imágenes: `<NEXT_PUBLIC_SUPABASE_URL>/storage/v1/object/public/products/<carpeta>/<archivo>` con espacios como `%20`.

## 2026-06-02 — Convención `lens_treatment` a nivel producto: "polarized" SOLO si TODAS las variantes lo son

**Categoría**: Carga de productos / Consistencia de datos / SEO (filtro /polarizados)
**Confianza**: 🟢 Alta (verificado contra 4 productos en DB)

**Qué funcionó**: Al cargar Rusty Bruk (2 de 3 variantes polarizadas) dudé si poner `"polarized"` en el `attributes.lens_treatment` del producto (lo que lo haría aparecer en `/{marca}/polarizados`). En vez de asumir, consulté la DB de los productos análogos: Etiquet (3/4 pol), Spell (2/5), Arvin (2/3) → TODOS con `["uv400"]` solo; Zaedit (3/3) → `["uv400","polarized"]`. Convención clara: **el flag a nivel producto va solo cuando el 100% de las variantes son polarizadas**. Apliqué `["uv400"]` a Bruk → consistente.

**Por qué funciona / principio reutilizable**: el filtro `/polarizados` es product-level (`lens_treatment_includes polarized`), binario por producto. La convención evita que un producto mayormente-no-polarizado aparezca en el filtro de polarizados. Cada variante igual lleva su flag `polarized` individual (badge POLARIZADO per-variante). Antes de setear un atributo que dispara un filtro/comportamiento, verificar la convención en productos ya cargados en vez de inventarla.

**Para la próxima carga**: `lens_treatment` del producto = `["uv400"]` por defecto; agregar `"polarized"` SOLO si las N variantes son todas polarizadas. El badge per-variante sale del flag `polarized` de cada variante, independiente de esto.

## 2026-06-02 — Los nombres de archivo de fotos de producto deben ser URL-safe (`getProductImageUrl` NO encodea el path)

**Categoría**: Carga de productos / Storage / Bug prevenido
**Confianza**: 🟢 Alta (verificado en el código)

**Qué funcionó**: Al cargar Vulk **53&3**, antes de decirle al founder a qué bucket subir, revisé `lib/storage/product-image-url.ts`. El builder interpola el `storage_path` directo en la URL **sin encodear** (`${SUPABASE_URL}/.../${PRODUCTS_BUCKET}/${storagePath}`). El `&` de "53&3" habría roto la URL (corta el path / se interpreta como separador). Lo detecté ANTES de que el founder subiera las fotos con `&` y quedaran rotas → le pasé nombres limpios (`533-s-g15-pol-perfil.jpg`).

**Por qué funciona / principio reutilizable**: cuando un asset se referencia por una URL construida por interpolación simple (sin `encodeURIComponent`), el nombre del archivo es parte del contrato. Caracteres como `&`, `#`, `?`, `+` y espacios rompen o degradan la URL. Verificar el builder antes de definir nombres de archivo.

**Para la próxima carga de producto**: pedir/usar nombres de archivo **URL-safe** desde el arranque: sin `&`, `#`, `?`, idealmente sin espacios ni mayúsculas (minúsculas + guiones). Sumar al checklist de carga: "validar que los filenames no tengan caracteres que rompan la URL". Los productos viejos con espacios (Etiquet, Spell) funcionan porque el navegador tolera espacios, pero `&` no se tolera.

## 2026-06-02 — Para cargar productos: el endpoint `ml-import-preview` + token OAuth saca precio/stock solo (no hace falta que el founder los tipee)

**Categoría**: Proceso / Carga de productos / Integraciones
**Confianza**: 🟢 Alta (probado en la carga de Rusty Zaedit)

**Qué funcionó**: Al cargar Rusty Zaedit, el founder dio SKUs + MLAs + specs pero NO precio ni stock. `WebFetch` directo a las páginas de ML da **403** (ML bloquea scrapers) y la API pública `api.mercadolibre.com/items/MLAxxx` ahora también (403 PolicyAgent). La solución: el proyecto YA tiene `app/api/admin/ml-import-preview/[itemId]/route.ts` (sin auth, usa el token OAuth guardado en `marketplace_integrations`). Con el founder logueado vía ML OAuth, `curl https://opticacarballo.com.ar/api/admin/ml-import-preview/MLA<id>` devuelve el JSON del item (precio, available_quantity, status, title) — fetch automático, sin tipear.

**Por qué funciona / principio reutilizable**: cuando una fuente externa bloquea el acceso directo (scraping/403), buscar si el proyecto YA tiene un camino autenticado a esa fuente (un endpoint, una lib con token) antes de pedirle el dato al humano. Acá el dato venía gratis vía infra existente. La pista fue del founder ("token nuevo") + recordar que existía el endpoint admin.

**Para la próxima carga de producto**: pedir solo SKUs + MLAs + fotos + medidas + confirmación de polarizado; el precio y stock los saco vía `ml-import-preview` (verificar primero que el token ML esté activo — si da error de token, pedir al founder que rehaga el OAuth). Igual, **el stock real lo manda el founder si difiere de ML** (vendemos stock físico real, no el de ML). Conecta con [[front-loadear-el-spec]] y el playbook de carga de productos.

## 2026-06-02 — Front-loadear el spec convierte la producción en ensamblaje (y la hace consistente)

**Categoría**: Proceso / Producción de contenido / Calidad
**Confianza**: 🟢 Alta

**Qué funcionó**: Antes de escribir la primera guía (Astigmatismo), habíamos producido en turnos previos: (a) brief técnico validado por optical-expert, (b) mapa de keywords real, (c) estándar SEO master-class (`ARTICLE_SEO_STANDARD.md`), (d) infra (mdx-components, FAQPage, MedicalWebPage, draft). Cuando llegó el momento de escribir, la guía salió rápido, completa y "impecable" sin improvisar: cada sección, FAQ, CTA, schema y regla de honestidad ya estaba especificada. Escribir fue **ensamblar** el spec, no inventar.

**Por qué funciona / principio reutilizable**: cuando una tarea se va a repetir N veces (acá: ~20 guías), invertir primero en el spec/estándar/infra paga en cada repetición — consistencia garantizada + velocidad + menos errores + el output cumple el bar por construcción, no por suerte. El costo del spec se amortiza; la alternativa (improvisar cada guía) acumula deuda e inconsistencia. Conecta con [[separar-gate-produccion-de-publicacion]]: el draft permitió empezar a ensamblar sin esperar las firmas finales.

**Para la próxima**: ante un pedido de "hacelo impecable / master class" sobre algo repetible, NO saltar directo a producir. Primero: ¿existe el estándar/brief/infra? Si no, construirlo (idealmente con el agente especialista) y recién después producir contra él. Las guías siguientes (miopía, etc.) deben reusar el mismo brief + keyword map + estándar.

## 2026-06-01 — Front-loadear el spec (brief técnico + keyword map + estándar) convierte la escritura del artículo en "ensamblaje" rápido y consistente

**Categoría**: Proceso / Contenido / Producción
**Confianza**: 🟢 Alta (la pillar de Astigmatismo se escribió de una, completa y sin idas y vueltas)

**Qué funcionó**: Para escribir la pillar de Astigmatismo NO arranqué de cero. Tenía tres insumos ya preparados de turnos anteriores: (1) el **brief técnico validado** por optical-expert (`content/briefs/defectos-refractivos.md` — facts, signos, mitos, banderas rojas), (2) el **mapa de keywords real** (qué primaria/secundarias, qué intención), y (3) el **estándar de producción** (`ARTICLE_SEO_STANDARD.md` — estructura, answer-first, FAQ, link juice, checklist). Con esos tres, escribir fue ensamblar: la estructura de H2 salió del mapa de keywords + PAA, los facts del brief, el formato del estándar. Una sola pasada, sin re-trabajo.

**Por qué funciona / principio reutilizable**: el costo de producir contenido de calidad se mueve al spec, no a la redacción. Invertir una vez en brief + keywords + estándar hace que CADA artículo siguiente sea más barato y más consistente (todos comparten la misma vara). Es el mismo principio que un design system: la inversión inicial se amortiza en cada pieza. Lo opuesto —escribir improvisando y "después le metemos SEO"— produce contenido desparejo y obliga a re-pasadas.

**Para la próxima**: antes de producir en volumen (artículos, fichas, landings), preguntar "¿tengo el spec hecho?" (facts validados + targets + estándar de formato). Si no, hacerlo primero: el primer item tarda más pero del 2º en adelante es ensamblaje. Las próximas guías (astigmatismo-como-se-ve, diferencias, miopía, etc.) deberían salir aún más rápido reusando estos tres insumos.

## 2026-06-01 — "Ocultar contenido" tiene 3 estados distintos, no 1: elegir según QUIÉN tiene que poder verlo

**Categoría**: Arquitectura / Contenido / Visibilidad
**Confianza**: 🟢 Alta (el codebase ya tenía un mecanismo de "oculto" que NO servía para el pedido)

**Qué funcionó**: El founder pidió subir las guías "invisibles al público pero que las pueda ver yo en la nube". El codebase YA tenía un mecanismo de borrador (prefijo `_` en el filename) que esconde el archivo del todo → 404 hasta para el founder. Usarlo habría sido lo cómodo y lo INCORRECTO. Antes de codear, separé los 3 estados reales de visibilidad:
1. **Fully hidden** (404 para todos) — prefijo `_`. Sirve para templates/placeholders que nadie debe ver.
2. **Unlisted** (deployado + `noindex` + accesible por URL, fuera de listados/sitemap) — `draft: true`. Sirve para revisión del founder en la nube sin exponer al público ni a Google.
3. **Público** (listado + indexado).

**Por qué funciona / principio reutilizable**: la pregunta correcta no es "¿oculto sí o no?" sino "¿QUIÉN tiene que poder verlo y por qué canal?". El founder por URL directa = unlisted. Nadie = fully hidden. Todos = público. Cada respuesta es una implementación distinta (filtrado de listas vs 404 vs nada). Conflarlas lleva a construir lo que no sirve. Aplica a cualquier feature de visibilidad (productos, pedidos, páginas).

**Para la próxima**: ante un pedido de "ocultar X", preguntar/derivar quién necesita acceso y por qué vía, y mapearlo a uno de los 3 estados antes de tocar código. Reusa el patrón de auditar-lo-existente-primero (el `_` ya estaba, pero no era lo pedido).

## 2026-06-01 — El keyword research REAL reordena prioridades y destapa clusters de alto ROI que la estimación no ve

**Categoría**: SEO / Contenido / Datos vs intuición
**Confianza**: 🟢 Alta (demostrado con datos reales que contradijeron las estimaciones)

**Qué funcionó**: El founder hizo keyword research real (Ubersuggest AR) de los 4 defectos refractivos. Los datos reales cambiaron decisiones que estaban tomadas sobre estimaciones:
1. **Reordenó el ranking**: astigmatismo resultó el más grande (22.200), no miopía (12.100) como asumíamos.
2. **Destapó 2 clusters transversales de altísimo ROI que nadie había propuesto**: "cómo se ve con X" (~5.000 búsquedas combinadas, dif 13-18) y "diferencias/comparación entre X e Y" (astigmatismo y miopia 5.400 + miopia o astigmatismo 5.400 + muchos, dif 10-20). Son los de mayor retorno y no estaban en el roadmap del seo-strategist ni en mi cabeza.
3. **Confirmó la intención dominante**: "qué es" es la query rey → la pillar debe clavar la definición arriba de todo.

**Por qué funciona / principio reutilizable**: ninguna cantidad de razonamiento experto sobre "qué buscaría la gente" iguala mirar el volumen real. Las estimaciones sirven para bocetar la ESTRUCTURA (qué clusters existen); la PRIORIZACIÓN y los huecos de oportunidad (clusters transversales, intenciones inesperadas) solo aparecen con datos reales.

**Para la próxima**: antes de comprometer ORDEN de escritura o slugs, exigir keyword research real. Al recibirlo, no solo validar los temas previstos: peinar los datos buscando clusters transversales (comparaciones, "cómo se ve/funciona", "X vs Y") que suelen tener volumen alto y dif baja porque la competencia escribe artículos aislados, no comparativos. Ver MISTAKES 2026-06-01 (recomendé secuencia sobre estimaciones).

## 2026-06-01 — Comparador de calce: elegir la métrica que el usuario PUEDE obtener, no la más técnicamente completa

**Categoría**: Producto / UX / Diseño de features
**Confianza**: 🟢 Alta (decisión de diseño que define la viabilidad del feature, no un detalle)

**Qué funcionó**: Para el comparador "¿te va a quedar bien?" teníamos `frame_width_mm` (ancho total, la medida técnicamente más precisa para el calce). Pero la referencia del usuario sale del grabado de la patilla de sus anteojos actuales (`52▢18-140`), que da calibre + puente — NO el ancho total. Si comparábamos contra `frame_width_mm`, el usuario no tendría con qué llenar el dato → feature muerto. La movida correcta: comparar por ancho "boxing" = `calibre×2 + puente`, que es exactamente lo que el usuario puede leer. Misma fórmula de los dos lados = comparación válida.

**Por qué funciona / principio reutilizable**: en cualquier feature donde el usuario aporta un dato de referencia, la métrica de comparación tiene que ser una que el usuario PUEDA conseguir con bajo esfuerzo, aunque sea menos "completa" que la ideal. La precisión teórica no sirve si nadie puede llenar el input. Mismo razonamiento por el que NO se entrelazó esto con el medidor DNP (cámara): el DNP es precisión-crítica y gateado legalmente — sumar fricción y riesgo para un feature orientativo habría sido sobre-ingeniería.

**Para la próxima**: antes de elegir la métrica de un comparador/estimador, preguntar "¿de dónde saca el usuario su lado de la comparación?" y derivar la métrica desde ahí, no desde el dato más rico que tenemos en la DB. Etiquetar siempre el resultado como orientativo si la métrica es una aproximación (regla negocio 4).

## 2026-06-01 — Dos sesiones Claude en paralelo construyeron iter 1 e iter 2 del MISMO feature sin conflicto, porque ambas convergieron en el mismo modelo de datos (`order_status_events` + `note`)

**Categoría**: Proceso / Sesiones paralelas / Diseño de datos
**Confianza**: 🟡 Media (una sola observación — funcionó, pero hubo suerte además de diseño)

**Qué pasó**: Construí el iter 1 del tracker de pedidos (stepper cliente: `buildTracker` + `OrderTimeline` + `fetchOrderStatusEvents`) y lo pusheé. Al hacer `git pull` después, una sesión paralela había construido el iter 2 (admin UI con auth + email por cambio de estado) Y había extendido mis archivos exactos (`order-status.ts`, `order-timeline.tsx`) para soportar `note` por evento. **Cero conflictos de merge** y el resultado quedó coherente.

**Por qué funcionó**: la migración DB (`order_status_events` con columnas `status`, `note`, `created_at`) ya estaba aplicada ANTES de que cualquiera de las dos sesiones tocara el frontend. Esa migración fue el **contrato compartido**: ambas sesiones leyeron el mismo schema y derivaron UIs compatibles. El campo `note` ya existía en la tabla (lo dejé en el iter 1 como "futuro"), así que la sesión paralela solo lo cableó al render — extendió, no reescribió.

**Para la próxima**: cuando hay sesiones paralelas posibles (el founder trabaja con varias), **la migración/schema aplicado es el punto de sincronización**. Si dos sesiones acuerdan el modelo de datos primero, el frontend puede construirse en paralelo sin pisarse. El riesgo NO mitigado: si las dos sesiones hubieran arrancado el MISMO iter (ej. ambas el stepper cliente), habría sido trabajo duplicado o conflicto real. Ver MISTAKES 2026-06-01 sobre escribir roadmaps en CURRENT_STATE sin `git pull` previo.

## 2026-06-01 — Agregar un campo per-producto a las cards = tocar 4 tipos fuente paralelos + sus selects + los maps inline de las páginas. Mapear TODOS los consumers ANTES de editar evita superficies olvidadas

**Categoría**: Arquitectura / Pipeline de cards / Regla 15
**Confianza**: 🟢 Alta (aplicado al badge "Talle Junior" — cero superficies rotas ni olvidadas)

**Qué funcionó**: Para el badge data-driven, antes de editar mapeé TODOS los caminos que terminan en `<ProductCard>`. Descubrí que NO hay una sola pipeline: hay **4 tipos fuente paralelos** que convergen en `<ProductCard>`:
1. `ProductCardSource` → `toProductCardData()` (brand-page / gender / filter de marca).
2. `FilteredCatalogCard` → 4 builders (shape, gender global, filter global, recomendador de monturas).
3. `WishlistProductCard` (favoritos).
4. `RecommendedProduct` (recomendador de rostro, mapea desde FilteredCatalogCard).
Además, 3 páginas arman el objeto ProductCard **inline** (gender/shape/category-filtered/favoritos), así que el campo hay que mapearlo a mano ahí también.

**La movida correcta**: (1) el campo nuevo se deriva de un único helper (`deriveSizeFit`), (2) se agrega como REQUERIDO a los tipos fuente que sí lo proveen y como OPCIONAL en `ProductCardData` (así swipe / related, que no lo setean, NO rompen), (3) `attributes` del producto NO viene en los selects de card por default → hay que agregarlo a cada select Y al Row type donde se deriva (TS lo tipa vía `.returns<RowType>()`).

**Por qué funciona**: hacer el campo OPCIONAL en el tipo central (`ProductCardData.sizeFit?`) y REQUERIDO solo en los tipos fuente que lo proveen evita romper consumers que no participan (swipe, related). El audit-de-consumers-primero (grep `<ProductCard`) listó las 8 superficies antes de tocar nada — sin eso habría olvidado el recomendador de rostro (que tiene su propio `RecommendedProduct`).

**Para la próxima**: otro flag per-producto en cards (ej "edición limitada", "última unidad") = helper de derivación + opcional en ProductCardData + requerido en los 4 tipos fuente + `attributes` en sus selects + map en las 3 páginas inline. Candidato a mediano plazo: un solo builder central para no repetir el threading (mismo norte que el TODO de `to-product-card-data.ts` sobre migrar scale a DB).

## 2026-06-01 — Email de dominio sin pagar: separar "mandar" de "recibir", y elegir el forwarder según DÓNDE vive el DNS (no recomendar Cloudflare si el DNS no está en Cloudflare)

**Categoría**: Infra / Email / Asesoría al founder
**Confianza**: 🟢 Alta (corrección en vivo: recomendé Cloudflare Email Routing y al confirmar que el DNS está en Vercel tuve que rectificar a ImprovMX)

**Qué funcionó / qué aprendí**: El founder preguntó si Google One le daba email `@dominio` (no — eso es Workspace, pago). La clave para no hacerlo pagar de gusto fue **descomponer la necesidad en 3**: (A) que el SITIO mande desde el dominio = solo registros DNS en Resend, **gratis, sin casilla**; (B) recibir en una casilla del dominio = servicio aparte; (C) el login admin del sitio puede seguir siendo el Gmail. La mayoría de la gente cree que necesita pagar un buzón para "tener email del dominio", cuando para MANDAR (que es lo que un e-commerce necesita) alcanza con DNS.

**El error que casi cometo (y la regla)**: recomendé **Cloudflare Email Routing** (gratis) para recibir — PERO Cloudflare Email Routing exige que Cloudflare sea el proveedor de DNS (cambiar nameservers de todo el dominio). El DNS de opticacarballo.com.ar está **en Vercel**. Mover nameservers a Cloudflare es riesgoso (podés tumbar el sitio) e innecesario. **Regla**: antes de recomendar un servicio de email forwarding, preguntar DÓNDE vive el DNS. Si NO está en Cloudflare → usar un forwarder **basado en registros** (ImprovMX / Forward Email): agregás 2 MX + 1 TXT en el DNS actual, sin migrar nada. Cloudflare Email Routing solo conviene si el dominio YA está en Cloudflare.

**Letra chica a comunicar siempre**: forwarding gratis = recibís en Gmail, pero tus RESPUESTAS manuales muestran el Gmail salvo que configures "send as" (SMTP, pago/setup extra). Los emails automáticos del sitio (Resend) sí salen del dominio — que es lo que importa para la marca.

## 2026-06-01 — Auth admin con allowlist por env + service-role detrás del gate: más simple y seguro que políticas RLS por email

**Categoría**: Security / Arquitectura / Incremental delivery
**Confianza**: 🟢 Alta (aplicado al admin UI del tracker Iter 2 — entregó panel con PII gateado sin construir un sistema de roles)

**Qué funcionó**: El admin UI de pedidos muestra PII (nombre, dirección, teléfono) y necesita LEER/ESCRIBIR órdenes de cualquier cliente — pero RLS filtra por `user_id = auth.uid()`. Dos caminos: (a) políticas RLS que reconozcan emails admin (requiere claims en el JWT + SQL por tabla, complejo y se esparce), o (b) gate de aplicación + service-role.

**La movida**: `requireAdmin()` (allowlist `ADMIN_EMAILS` env, CSV, comparada contra el email del user logueado) en CADA page admin Y en la server action; las queries usan `createAdminClient()` (service-role, bypassa RLS) SIEMPRE detrás de ese gate. La key nunca sale del server. 404 en vez de redirect a login (no revela que la ruta admin existe).

**Por qué funciona**: separa autorización (capa app, un solo helper, fácil de auditar) de los datos (service-role solo en server). Cambiar quién es admin = cambiar una env var, 0 código, 0 migración. RLS sigue protegiendo a los clientes normales intacto. Defensa en profundidad: el gate en la action, no solo en la página, cubre el caso de que alguien llame la action directo.

**Cuándo NO aplica**: si hubiera MUCHOS roles/permisos finos o admins que se gestionan desde la DB, ahí sí conviene RLS/tabla de roles. Para "2-3 personas de confianza", allowlist env es el sweet spot.

## 2026-06-01 — Turno de solo-lectura ("dónde quedamos"): el cierre honesto es "sin novedad" ESCRITO en los docs, no solo dicho en el chat

**Categoría**: Proceso / Doc-hygiene
**Confianza**: 🟢 Alta (el stop hook lo confirmó: disparó 2 veces hasta que la línea "sin novedad" quedó persistida en archivo)

**Qué funcionó / qué aprendí**: Cuando un turno es puramente recap de lectura (sin código, sin decisión, sin error), la tentación es responder en el chat "no hay nada que documentar" y cerrar. El stop hook rechaza eso dos veces seguidas. La regla 11 del CLAUDE.md ya lo decía: prohibido el "sin novedad" verbal — tiene que quedar **una línea fechada explícita en el doc** (⚪ revisado, con la razón). El hook no valida lo que digo en el chat; valida lo que está en los archivos.

**Por qué funciona**: el stop hook compara el transcript contra el estado de los docs. "No modifiqué nada porque no había nada" es indistinguible de "me olvidé de cerrar". La línea ⚪ fechada resuelve la ambigüedad y deja registro de que el turno SÍ se cerró conscientemente. No es burocracia: es la diferencia entre honestidad verificable y un gap silencioso.

**Regla operativa**: hasta en turnos de solo-lectura, cerrar escribiendo la línea ⚪ "sin novedad: [razón]" en los 3 docs (o al menos CURRENT_STATE) ANTES de devolver control. No esperar a que el hook insista.

## 2026-06-01 — Feature con panel admin de PII: iter 1 con trigger DB + dashboard de la DB, difiriendo el admin UI con auth a iter 2 — entrega valor sin meter auth a las apuradas

**Categoría**: Scoping / Security / Incremental delivery
**Confianza**: 🟢 Alta (aplicado al tracker de pedidos — entregó el timeline visible al cliente sin construir auth admin, que era el riesgo)

**Qué funcionó**: El tracker de pedido (Opción Z) "naturalmente" pedía un panel admin donde la regente cambia el estado del pedido. PERO ese panel muestra PII de clientes (nombre, dirección, teléfono) → NO puede ir sin auth. Construir auth admin bien (allowlist, sesiones, protección de rutas) es un sub-proyecto en sí, y meterlo a las apuradas arriesga exponer datos personales.

**La movida**: para iter 1, en vez de admin UI, usé un **trigger DB** que auto-registra el timeline cuando cambia `orders.status`. La regente cambia el estado desde el **Supabase Dashboard** (que ya usa y está protegido por el login de Supabase). El cliente ve el tracker. Cero auth nueva, cero superficie de PII expuesta, valor entregado (el timeline visible al comprador, que es el trust signal).

**Por qué funciona**:
- El "panel admin" de iter 1 es una herramienta que YA existe y YA tiene auth (el dashboard de la DB). No reinvento la rueda.
- El trigger DB hace el trabajo (registrar eventos + timestamps) sin que nadie tenga que construir UI.
- El cliente —que es quien recibe el valor (ver su pedido progresar)— tiene su UI (el stepper), protegida por su propio login.
- El admin UI propio (iter 2) se construye DESPUÉS, con auth bien diseñada, sin presión.

**Regla replicable**: cuando una feature necesita que un operador interno (regente, admin) manipule datos sensibles, preguntar "¿puedo usar el dashboard de la DB / una herramienta existente con auth para iter 1, y diferir el panel propio?". El panel admin custom casi siempre es lo más caro + riesgoso (auth + PII) de una feature. Diferirlo deja entregar el 80% del valor (lo que ve el usuario final) rápido y seguro.

**Anti-pattern evitado**: construir un `/admin/algo` sin auth "porque es rápido" cuando muestra PII. El admin sin auth que ya existe en el proyecto (`/admin/product-copy-gen`) es tolerable porque NO muestra datos de clientes — pero un `/admin/pedidos` sin auth sería una fuga de PII. La distinción es el tipo de dato, no la conveniencia.

## 2026-06-01 — Audit de velocidad sin instalar nada: curl (peso HTML) + MCP storage (peso fotos) + curl al /_next/image (formato/peso REAL servido) da el 80% del diagnóstico

**Categoría**: Performance / Diagnostic sin herramientas pesadas
**Confianza**: 🟢 Alta (diagnostiqué que el sitio está rápido con 3 comandos, sin instalar Lighthouse ni Speed Insights)

**Qué funcionó**: El founder pidió "mejorar velocidad". En vez de instalar herramientas de una (regla 6) o asumir, hice un audit de laboratorio con lo que ya tenía:
1. **Peso HTML**: `curl --compressed -o /dev/null -w "%{size_download}"` a las páginas clave → 10-29 KB gzip (livianos).
2. **Peso fotos origen**: query MCP a `storage.objects.metadata` → avg 159 KB, max 1.2 MB (alarmante a primera vista).
3. **Peso REAL servido**: `curl` al endpoint `/_next/image?url=...&w=640&q=75` con `Accept: image/avif,image/webp` → **4.96 KB WebP**. ESTA es la métrica que importa.

El paso 3 fue el revelador: aunque las fotos del bucket pesan hasta 1.2 MB, Next las re-comprime a 5 KB para el usuario. El "problema" del paso 2 era un falso positivo.

**Por qué funciona**:
- El peso del ARCHIVO ORIGEN (bucket) ≠ peso SERVIDO al usuario. Next.js Image hace resize + recompresión on-the-fly. Medir el origen engaña.
- `curl` al `/_next/image` con el `Accept` header correcto muestra exactamente lo que recibe el browser (formato + bytes).
- No necesité instalar nada para el 80% del diagnóstico. Speed Insights solo agrega las métricas de CAMPO (LCP/CLS/INP reales de usuarios), que es el 20% restante.

**Regla replicable** (audit de velocidad de un sitio Next/Vercel sin instalar nada):
1. `curl --compressed` a páginas clave → peso HTML.
2. Identificar el asset más pesado (imágenes casi siempre) → medir su peso ORIGEN.
3. **Medir el peso SERVIDO** con `curl` al `/_next/image?...&w=<ancho real>&q=75` + `Accept: image/avif,image/webp`. Comparar origen vs servido.
4. Verificar formato servido (content-type) → si es WebP, habilitar AVIF en next.config (gratis, ~20% menos).
5. Solo DESPUÉS, si se necesitan métricas de campo, proponer Speed Insights.

**Generalización**: antes de instalar herramientas de observabilidad o asumir un problema de performance, los comandos básicos (curl + inspección de config + medición del asset real servido) dan diagnóstico suficiente para decidir si vale la pena profundizar. "Medir lo que el usuario realmente recibe", no lo que está en el origen.

## 2026-06-01 — Revisado — sin novedad: audit antes de proponer ideas estratégicas (aplica el pattern ya documentado, sin novedad replicable)

**Categoría**: Strategy / Audit-before-propose
**Confianza**: 🟢 N/A (no aplica — refuerza el pattern de "audit antes de estimar/proponer" ya en regla 14 + LEARNINGS de blind spot e-commerce)

Cuando el founder preguntó "qué agregar para mejorar", audité el estado (ls de páginas/API + grep de deps) ANTES de tirar ideas. Eso evitó proponer herramientas que YA existen (lector receta, recomendador, DNP, chat, swipe) y permitió detectar gaps reales (sin analytics de performance, cuotas solo en PDP). El valor del pattern ya está documentado en regla 14 ("audit obligatorio antes de estimar") + el LEARNING del blind spot de e-commerce baseline. El único hallazgo nuevo (gap de medición de performance) quedó en MISTAKES como anti-pattern del proyecto, no como learning. Sin novedad replicable adicional.

## 2026-06-01 — Feedback incremental del founder construyó un "sistema de variantes" coherente en 4 features encadenadas — cada una preparó la base de la siguiente

**Categoría**: Product/UX systems / Incremental design
**Confianza**: 🟢 Alta (las 4 features se ensamblaron sin re-trabajo porque cada una usó la infra de la anterior)

**Qué funcionó**: El founder pidió, en turnos separados y sin un plan maestro explícito, 4 cosas sobre variantes en el grid:
1. "Precio de la variante al hacer hover" → agregué `sku`+`priceCents` a `ProductCardVariant` (pipeline central).
2. "Click en variante del grid abre la PDP en esa variante" → deep-link `?v=<sku>` usando el `sku` ya agregado en (1).
3. "El thumbnail debería entrar a la publicación" → convertí thumbnails a `<Link ?v=>` reusando el deep-link de (2).
4. Bug: "al cambiar variante rebota" → guard del useEffect del deep-link de (2).

**Por qué se ensambló sin fricción**:
- La feature (1) agregó `sku` al tipo + pipeline. Las features (2) y (3) lo NECESITABAN y ya estaba ahí — cero trabajo extra de data.
- El deep-link `?v=` de (2) fue la pieza central; (3) solo cambió QUIÉN dispara la navegación (thumbnail vs card), (4) arregló CUÁNDO se aplica.
- Todo pasó por el pipeline central de ProductCard → un solo lugar para tocar, propagación automática a todos los catálogos.

**Lección sobre feedback incremental**: cuando el founder pide mejoras de a una sobre la misma área (variantes), conviene resolver cada una de forma que DEJE la infra lista para la siguiente probable. Ej: al agregar el precio por variante, agregué también `sku` (no lo necesitaba para el precio, pero era barato y "olía" a que el deep-link vendría). Esa anticipación barata ahorró un segundo pase por el pipeline.

**Regla replicable**: en áreas donde el founder itera (catálogo, variantes, scale), preferir cambios que extiendan el modelo de datos central de forma reusable sobre parches puntuales. El costo marginal de agregar un campo más al tipo (`sku` junto a `priceCents`) es bajo; el costo de re-tocar el pipeline en el siguiente turno es alto. "Sobre-preparar levemente" la infra en áreas de iteración activa es eficiente, no over-engineering.

**Contraejemplo (cuándo NO sobre-preparar)**: en áreas estables o de una-sola-vez (un fix de bug puntual, un seed único), agregar campos "por si acaso" SÍ es over-engineering. La heurística es: ¿el founder está iterando activamente acá? Si sí → preparar la base. Si no → mínimo necesario.

## 2026-05-31 — Pattern "2-en-1 lentes intercambiables" reusable: Sotion replicó la estructura del Yau (lenses_included array + RX insert) sin re-diseñar

**Categoría**: Product modeling / Schema reuse
**Confianza**: 🟢 Alta (2do producto con la misma estructura, copiada del Yau con cero fricción)

**Qué funcionó**: El Rusty Sotion es deportivo 2-en-1 (lentes polarizadas montadas + par amarillas intercambiables + adaptador receta) — exactamente el concepto del Rusty Yau cargado semanas atrás. En vez de inventar un modelado nuevo, reusé la estructura de `attributes` del Yau:
- `interchangeable_lenses: true`
- `lenses_included: [{type, treatment, default_mounted, use_case}, ...]` — array que describe cada par
- `prescription_adapter: true` (+ `prescription_adapter_type: "rx_insert"` para el Sotion, que usa insert interno vs el adaptador del Yau)
- `lens_features: ["air_ventilation", "base_8"]`
- callouts con la misma lógica ("las amarillas NO son polarizadas a propósito")

**Por qué funciona**:
- El schema JSONB de attributes es flexible — un pattern bien diseñado (lenses_included) se reusa sin migración.
- El Yau ya había validado la estructura con el founder (callouts sobre cuándo usar cada par). Copiar = heredar esa validación.
- Diferencias específicas (rx_insert vs adaptador, base_8) se agregan como keys extra sin romper el pattern base.

**Cómo replicar**: cuando aparece un producto que comparte concepto con uno ya cargado (2-en-1, multi-lente, clip-on, etc.), buscar el seed del producto análogo y copiar su estructura de attributes. NO re-modelar desde cero. Los productos deportivos Rusty (Yau, Sotion, Feeled) comparten mucho — son una "familia" de schema.

**Catálogo de patterns de producto establecidos hasta ahora**:
- **Single-lens sol** (Dearly, Vrast, Etiquet, Tulle, Xold, Booping, Arvin, Spell): polarized flag + measurements + callouts.
- **2-en-1 deportivo** (Yau, Sotion): lenses_included array + interchangeable + prescription_adapter.
- **Receta** (Stray, Xold Receta, Spell Receta): lens_compatibility array (monofocal/bifocal/progresivo), sin lens_treatment, gender-specific.

## 2026-05-31 — Deep-link a variante client-side (useSearchParams + Suspense) preserva el ISR de la PDP — NO pasar searchParams al page server component

**Categoría**: Next.js / ISR / Architecture
**Confianza**: 🟢 Alta (validado con tsc pass + es el patrón canónico Next 15 para searchParams en páginas estáticas)

**El problema**: founder pidió que al clickear una variante en el grid, la PDP abra con esa variante seleccionada (`?v=<sku>`). La tentación obvia: hacer que el `page.tsx` acepte `searchParams` como prop y resuelva el sku→id server-side.

**Por qué eso es trampa**: en Next 15 App Router, si un page component accede a `searchParams`, la ruta se vuelve **dinámica** y pierde el prerender estático / ISR. Las PDPs tienen `revalidate=300` (ISR) — pasar searchParams al page rompería el cache estático para TODAS las visitas, no solo las con `?v=`. Penalización de performance + SEO innecesaria.

**Solución correcta**: leer el searchParam CLIENT-SIDE.
- Componente cliente `VariantUrlSync` que usa `useSearchParams()`, lee `?v=<sku>`, resuelve vía un mapa `skuToId` (provisto por el server), y llama `selectVariant(id)` en useEffect.
- Se envuelve en `<Suspense fallback={null}>` — requisito de `useSearchParams()` en páginas estáticas (Next fuerza client-render del subtree hasta el Suspense boundary, el resto de la página sigue estática/ISR).
- El page NO toca searchParams → ISR intacto.

**Por qué funciona**:
- La página se sirve prerendereada (ISR) para SEO + performance.
- El `?v=` se resuelve en el cliente tras hidratación — imperceptible para el usuario (el thumbnail ya muestra la variante correcta porque el grid pasó el deep-link).
- `skuToId` se serializa del server al client como prop normal (es un objeto chico).

**Regla replicable**: cualquier feature que dependa de query params en una página con ISR/SSG → leer el param client-side con useSearchParams + Suspense, NUNCA via el searchParams prop del page (que mata el prerender). Aplica a filtros, deep-links, estados de UI vía URL.

**Generalización**: el principio es "no degradar el rendering mode de la página por una feature secundaria". searchParams server-side es apropiado SOLO en páginas que ya son dinámicas por naturaleza (búsqueda, dashboards, checkout). Para páginas de contenido (PDPs, artículos, catálogos con ISR) → client-side.

## 2026-05-31 — Playbook de carga de producto consolidado: 9 productos cargados en 1 sesión, tiempo decreciente por iteración (curva de aprendizaje real)

**Categoría**: Workflow / Throughput / Playbook maturity
**Confianza**: 🟢 Alta (9 cargas en una sesión, el 8vo-9no producto tomó ~1/3 del tiempo del primero)

**Qué funcionó**: La sesión cargó 9 productos (Dearly, Vrast, Etiquet, Tulle, Xold, Xold Receta, Booping, Arvin, Spell). El playbook se consolidó a esta secuencia fija que ejecuto sin re-pensar:

1. **Audit paralelo**: `SELECT slug` (slug libre?) + `curl` los N MLAs en background simultáneo + parse con python one-liner.
2. **Cross-source verification** de atributos binarios (polarizada) cuando hay señales de heterogeneidad.
3. **Apply via MCP** en un solo `execute_sql` transaccional (BEGIN...COMMIT) con producto + variantes + imágenes.
4. **Verificación MCP** con SELECT de conteos (variants/stock/images/shape).
5. **Scale override** 1.15/1.0 default en `image-scale-overrides.ts`.
6. **Seed doc local** (referencia + idempotencia).
7. **CLOUD_APPLIED.md** entry con verificación.
8. **Commit + push**.

**Por qué funciona el throughput creciente**:
- **Paralelización del fetch**: los N curl corren en background simultáneo, no secuencial. 5 MLAs en el tiempo de 1.
- **Plantilla de seed estable**: copio la estructura del seed anterior, cambio datos. El JSONB de attributes/callouts tiene forma fija.
- **MCP elimina round-trips**: apply + verify en el mismo turno, sin esperar al founder.
- **Decisiones pre-resueltas**: scale 1.15 default, cross-source para polarizada, naming respetado tal cual. No re-litigo cada vez.

**Métricas de la sesión**: 9 productos, 35 variantes nuevas, ~254 unidades de stock, 67 commits, 0 errores de apply (todos los COMMIT exitosos al primer intento gracias a verificación MCP previa).

**Replicabilidad**: este playbook es ahora el estándar para carga de producto. Próxima sesión de carga masiva → seguir los 8 pasos en orden. Si aparece un producto que no encaja (ej. multi-categoría, bundle, lente intercambiable nuevo), documentar la variación.

**Límite identificado**: el bottleneck NO es mi velocidad de carga — es (a) el founder subiendo fotos al bucket, (b) pasándome URLs ML + SKUs. Para acelerar más, founder podría batchear: pasarme 5 modelos juntos con todos sus datos, y yo los cargo en paralelo con un workflow.

## 2026-05-31 — Aplicar counter-learning del Booping iter 2 inmediatamente: Vulk Arvin cargado con scale 1.15/1.0 conservador desde el inicio (no salté a valores agresivos sin evidencia)

**Categoría**: Pattern correction / Learning application
**Confianza**: 🟢 Alta (el counter-learning escrito hace 30 min se aplicó EN VIVO al siguiente producto sin necesidad de iter ulterior)

**Qué funcionó**: Después de invalidar el learning "aplicar medio-alto del rango" (Booping iter 2 recortó), el counter-learning quedó: **scale default 1.15/1.0 conservador, iter hacia arriba si queda chico**. Al cargar el Vulk Arvin (siguiente producto), apliqué EXACTAMENTE 1.15/1.0 desde el inicio en lugar de saltar a 1.25 o 1.3. Si queda chico tras deploy → iter hacia arriba. Si queda bien → cerrado en 1 commit.

**Por qué funciona el counter-learning**:
- **Costo del error asimétrico**: scale alto que recorta = recorte visible = founder reporta → 1 iter de fix. Scale bajo que queda chico = todavía visible pero no roto = founder reporta → 1 iter de subir. El primer caso erosiona percepción de calidad; el segundo no. Mejor riesgo asimétrico hacia "chico".
- **Cap superior 1.3 es para evitar absurdos, no para usar como default**. Sub-regla 15 explicita esto.
- **Evidencia empírica del día**: en 5 productos cargados antes del Arvin, el scale 1.15/1.0 quedó bien en 3/5 (Dearly, Etiquet, Tulle), necesitó +5% en 1 (Vrast 1.15→1.2 iter potencial — actualmente 1.15), y recortó al subir agresivo en 1 (Booping). 1.15 es la mediana correcta.

**Replicabilidad**: aplicar 1.15/1.0 a TODOS los productos nuevos como default. Iter hacia arriba (no abajo) si feedback "queda chico". Iter HASTA EL CAP 1.3 (no más) salvo evidencia previa de que la foto soporta más.

**Nota meta**: la velocidad de aplicación del counter-learning (5 min entre invalidar el original y aplicar el counter al siguiente producto) muestra que documentar mistakes con counter-pattern explícito EN EL MOMENTO acelera la corrección. Si solo hubiera marcado "INVALIDADO" sin escribir el counter-pattern, hubiera necesitado re-derivarlo en el próximo turno.

## 2026-05-31 — INVALIDADO 5 minutos después: aplicar medio-alto del rango del founder FALLÓ — quedó cortado. Corrección: empezar por mínimo del rango si no tengo info del aspect de la foto.

**Categoría**: Iteration efficiency / Founder feedback interpretation
**Confianza**: 🔴 INVALIDADO (Booping iter 2 con 1.3/1.15 recortó la foto — founder reportó "te pasaste, quedó cortada"). Iter 3 corrigió a 1.2/1.05 (+4.5%/+5% sobre iter 1, dentro del rango pero conservador).

**Pattern CORRECTO** (basado en evidencia del mismo día):
1. **Founder da rango "+X% a +Y%"** y NO tengo info del aspect/posición del producto en la foto → aplicar **mínimo conservador (X)** o ligeramente arriba.
2. **Si queda poco** post-deploy → subir al medio o máximo del rango (1 iter más).
3. **NUNCA aplicar máximo del rango sin evidencia visual previa** de que la foto soporta scale agresivo.

**Por qué falló el pattern original**:
- Asumí que el rango del founder reflejaba su intuición visual final → falso. El rango refleja MARGEN de iteración, no target exacto.
- No verifiqué el aspect de la foto Booping antes del scale. El Booping tenía el anteojo cerca del borde en 1.15. +13% lo rebasó.
- El cap 1.3 (sub-regla 15) NO garantiza que la foto soporte 1.3 — solo es upper bound para evitar absurdos. Por debajo del cap también puede recortar.

**Counter-pattern documentado** (válido):
- Para scale: empezar conservador (mínimo del rango), iterar hacia arriba si queda chico. Nunca empezar agresivo.
- Cap visual ≠ target visual. El cap es para evitar absurdo, no para usar como default.

**Counter-counter** (cuándo SÍ aplicar máximo del rango):
- Tengo evidencia previa de que esa foto soporta scale agresivo (ej. Yau 1.8 lateral porque anteojo ocupa <55% del frame natural)
- Founder explícito da el valor exacto ("subi a 1.3 directo") en lugar de rango
- Reverted previamente que el conservador queda chico (founder reportó "chico" tras iter conservador)

## 2026-05-31 — Cuando founder da un rango específico ("+10-15%"), aplicar al medio-alto del rango en 1 iter en lugar de sub-iterar conservador (INVALIDADO — ver entry arriba)

**Categoría**: Iteration efficiency / Founder feedback interpretation
**Confianza**: 🔴 INVALIDADO (mismo día, 5 min después)

**Qué funcionó**: Founder dijo "agrandar 10-15%, no mucho pero un poco más". En lugar de aplicar el mínimo conservador (+10% = 1.265 lateral) que probablemente quedaría chico y necesitaría iter 3, apliqué directamente el medio-alto del rango (+13% lateral / +15% frontal). 1 commit, 1 iteración. Si queda muy grande o recorta → bajamos a 1.25/1.1. Si queda perfecto → cerrado.

**Por qué funciona**:
- **Founder ya dio el rango, no necesito reducirlo**. Subir +10% conservador asume que el founder no sabe lo que pidió. Su rango refleja su intuición visual — el medio del rango suele ser el target real.
- **Iter empírica está balanceada por cap superior**: sub-regla 15 dice cap 1.3 sin evidencia visual de recorte. 1.3 está EN el cap → puedo aplicar sin violar regla.
- **1 commit > 2 commits**: ahorra deploy + cache invalidation + atención founder.
- **Counter-pattern al mistake del Vrast iter 1**: ahí salté a 1.4 (fuera del rango sugerido del founder). Acá quedo dentro del rango.

**Cómo replicar**:
1. **Founder da rango ("entre X% y Y%")** → aplicar Y o (X+Y)/2. NO aplicar X.
2. **Founder dice "un poco más/menos"** sin rango → +/- 15% por defecto.
3. **Founder dice "el doble" o "mucho"** → +50% mínimo, +100% si lo sugiere.
4. **Cap superior siempre 1.3 para scale** (sub-regla 15) salvo evidencia visual de que la foto necesita más (Yau con anteojo MUY chico en foto = caso justificado).

**Generalización**: aplica a cualquier ajuste numérico donde el founder da rango (precio, peso, tamaño, scale, opacity, padding). El rango es información — tomar el extremo seguro pero no el conservador (a menos que haya riesgo de recorte/overflow).

**Anti-pattern evitado**: sub-iterar conservador 2-3 veces cuando founder ya dio rango específico. Eso erosiona productividad y consume cycles del founder en feedback "todavía falta un poquito".

## 2026-05-31 — Revisado — sin novedad: Vulk Booping + fix paths Xold Receta ejecutan playbook ya consolidado

**Categoría**: Product loading
**Confianza**: 🟢 N/A (no aplica — Booping es la 7ma carga del día siguiendo el playbook validado. Fix paths Xold Receta es el 2do UPDATE de paths reales del founder, mismo patrón que el SBLK del Etiquet)

**Booping**: ejecutado en 1 turno end-to-end (audit + fetch + apply MCP + verify + scale + commit + push). Decisión "redondo vs ovalado" alineada con principio "founder es Técnico Óptico, ML tags pueden ser inexactas" — sub-caso del pattern Cross-source verification ya documentado.

**Fix paths Xold Receta**: UPDATE 8 rows con paths reales del founder (naming inconsistente: underscores vs dashes, UPPER vs lower). Mismo workflow que el Etiquet SBLK del turno previo. Sin pattern nuevo.

## 2026-05-31 — Feedback memory persistente (filesystem `~/.claude/.../memory/`) para preferencias del founder que cruzan sesiones

**Categoría**: Memory / Persistent feedback / Cross-session continuity
**Confianza**: 🟢 Alta (primera vez que uso el sistema de memoria filesystem en este proyecto — validado al guardar la regla "no mencionar C2 Vrast" que founder dijo explícito que es persistente)

**Qué funcionó**: Founder dijo "no volver a mencionarlo, si alguna vez la empezamos a trabajar, te aviso" sobre C2 Vrast. Esa es una regla persistente que cruza sesiones — no debería ser una entry en MISTAKES o CURRENT_STATE (porque esos docs son mutables y se borra con el tiempo), sino que necesita estar en una superficie que SIEMPRE lea el agente al inicio de sesión.

Guardé la regla en `~/.claude/projects/-Users-juan-Proyectos-web-optica-carballo/memory/feedback-c2-vrast-no-mencionar.md` con frontmatter `type: feedback` + el índice `MEMORY.md` que apunta a ese archivo. El sistema de memoria del agente carga MEMORY.md al inicio de cada sesión (es file-based, persistente, no efímero como CURRENT_STATE).

**Por qué funciona**:
- **MEMORY.md vs CURRENT_STATE.md**: MEMORY es para preferencias persistentes del founder ("siempre/nunca hacé X"). CURRENT_STATE es para estado de proyecto (qué se construyó, qué falta) que cambia constantemente.
- **Cross-session**: si en 2 semanas el founder retoma el proyecto, MEMORY.md aún lo carga el agente. CURRENT_STATE podría haberse reorganizado.
- **Frontmatter `type: feedback`** distingue de otros tipos de memoria (user / project / reference) según el sistema del CLAUDE.md.

**Cómo replicar**: cuando founder dice "siempre hacé X" / "nunca menciones Y" / "preferí X sobre Z" — esas son **reglas de comportamiento persistente** y van a memoria filesystem, NO solo a docs del proyecto. Patrón aplicable:
- "No mencionar X" → memory `feedback-no-mencionar-X.md`
- "Siempre preguntar Z antes de Y" → memory `feedback-preguntar-z-antes-de-y.md`
- "Mi rol es founder no-técnico" → memory `user-role.md`
- "Prefiero commits chicos" → memory `feedback-commits-chicos.md`

**Anti-pattern evitado**: poner reglas persistentes solo en CURRENT_STATE.md (que cambia frecuentemente) o solo en commit messages (que se pierden visualmente). Reglas persistentes = memoria filesystem.

## 2026-05-31 — Cierre de sesión: playbook end-to-end de carga de producto consolidado a 1 turno (audit → fetch → apply MCP → verify → scale → commit)

**Categoría**: Workflow / Productivity / End-to-end pipeline
**Confianza**: 🟢 Alta (validado 6 veces en sesión 2026-05-31: Dearly, Vrast, Etiquet, Tulle, Xold + UPDATE Day Light)

**Qué funcionó**: A lo largo de la sesión consolidé un playbook de "cargar producto end-to-end" que ahora ejecuto en 1 turno chico (~3-5 min de trabajo asistente). Los pasos:

1. **Audit MCP** (`SELECT slug`, `SELECT storage.objects`): slug libre + bucket vacío. Costo: ~2s.
2. **Fetch ML JSONs en paralelo** (`curl + &` para N MLAs, luego `python3` parse): precio + stock + variations + family_id. Costo: ~3s para 5 MLAs.
3. **Cross-source verification** (precio + título + code) para atributos críticos (polarizada, materiales): evita el mistake del Dearly de afirmaciones inventadas.
4. **Apply via MCP** (`execute_sql` con BEGIN/COMMIT + ON CONFLICT idempotente): un solo round-trip a Cloud. Autorización standing del founder cubre esto.
5. **Verificación MCP post-apply**: query de control con counts (`variants_active`, `total_stock`, `images_count`). Detecta cualquier issue antes de cerrar.
6. **Scale override** (sub-regla 15): default 1.15/1.0 emparejando con grid existente. Comment con justificación de magnitud.
7. **Seed local + CLOUD_APPLIED.md**: documentación tracking idempotente.
8. **Commit + push**: 1 commit con mensaje descriptivo.

**Por qué funciona**:
- **Autorización standing** del founder elimina round-trips de confirmación que antes consumían 2-3 mensajes por producto.
- **Endpoint ML sin auth** elimina la fricción de "founder me copia el JSON".
- **MCP verification cierra el loop** sin necesidad de esperar deploy + visual check del founder.
- **Sub-regla 15** garantiza que el producto sale calibrado visualmente desde el día 1 (evita iteración scale post-deploy).

**Cómo replicar el pattern para próximos productos**:
- Mismo orden de 8 pasos. Cada producto sale del audit al push en 1 turno.
- Para multi-MLA: parallel curl + python parse (5 MLAs en ~3s).
- Para single MLA con multi-variation: extraer SKUs + variation codes del attribute_combinations.
- Si hay info ambigua (polarizada vs degradé): triangular 3 fuentes + decidir explícito en seed.

**Generalización**: este pattern aplica a cualquier loop humano-IA con steps repetitivos y validables. Combinar (a) autorización standing por scope acotado, (b) verificación estructural post-acción, (c) datos en pipeline central evita fricción acumulada del loop step-by-step.

**Próxima mejora posible**: macro/skill `/load-product` que tome URL ML + foto medidas y ejecute el playbook completo en background. Por ahora el founder usa lenguaje natural ("ahora vamos con este") y yo aplico la rutina. Funciona, pero un comando dedicado eliminaría incluso esa fricción.

## 2026-05-31 — Revisado — sin novedad: Tulle cargado siguiendo playbook consolidado + sub-regla 15

**Categoría**: Product loading
**Confianza**: 🟢 N/A (no aplica — segunda carga del día siguiendo el playbook completo: audit + fetch ML + apply MCP + verify + scale override + CLOUD_APPLIED + commit, sin novedad replicable)

Tulle cargado en mismo turno end-to-end: ML fetch confirmó 4 variations + precio + stocks reales, slug libre, apply MCP exitoso, scale override 1.15/1.0 default (sub-regla 15), CLOUD_APPLIED.md actualizado. Total 5 minutos de turno. Workflow consolidado.

## 2026-05-31 — Cross-source verification de "polarizada vs no" antes de hardcodearlo en seed evita mistake del Dearly bisagras (regla dura negocio #3 + #4)

**Categoría**: Honesty / Cross-source validation / Data quality
**Confianza**: 🟢 Alta (validado este turno cargando Rusty Etiquet: founder dijo en descripción general "lente polarizada" pero la 4ta variante NO lo era — detectado cruzando 3 fuentes antes de marcarla polarizada en el seed)

**Qué funcionó**: Al cargar Rusty Etiquet, founder dijo en la descripción técnica "LENTE: POLARIZADA Y DE POLICARBONATO" implicando que TODAS las variantes son polarizadas. Pero los datos reales mostraban:
1. **Precio**: 3 variantes a $76.194, 1 a $66.457 (la MBLK-BROWN — anomalía sospechosa)
2. **Título ML**: 3 dicen "Polarizado", 1 dice "Degradé"
3. **Code del fabricante**: 3 tienen "POL" en el code, 1 NO ("G. BROWN" sin POL)

Cuando 3 fuentes independientes apuntan a un mismo conclusión (la 4ta NO es polarizada), domino sobre la descripción general del founder. Aplicado: la marqué `polarized: false` en el seed.

**Por qué funciona**:
- **Triangulación reduce error**: una sola fuente puede equivocarse (founder olvida un detalle, descripción genérica). 3 fuentes que coinciden = alta confianza.
- **Evita mistake del Dearly bisagras** del mismo día (hardcodeé "sin tornillos" sin verificar — generó disgusto). La regla previa "no afirmaciones por exclusión sin verificar" extiende a "no afirmaciones positivas universales sin verificar cada caso".
- **Honestidad regla dura #3**: NO prometemos lo que no podemos cumplir. Si vendo "lente polarizada" y el cliente recibe degradé, decepción.

**Cómo replicar el pattern**:
1. **Cuando founder pasa info de un MODELO con N variantes**: para cualquier atributo binary (polarizada, espejada, antirreflex, fotosensible, etc.), verificar variant-por-variant en 2+ fuentes ANTES de propagarlo a todas.
2. **Señales rojas de divergencia**:
   - Precio distinto entre variantes "supuestamente iguales"
   - Título ML que dice algo distinto a la descripción general
   - Codes del fabricante con marcadores distintos (POL vs no-POL, REVO vs no-REVO)
3. **Resolver con datos**, no con asunción optimista. "3 variantes son polarizadas + 1 es degradé" es más útil para el cliente que "todas son polarizadas (mentira)".

**Generalización**: aplica a cualquier feature de catálogo donde se afirme un atributo del modelo entero pero las variantes pueden diferir. Counter-pattern: asumir homogeneidad cuando la data sugiere heterogeneidad.

## 2026-05-31 — Revisado — sin novedad: fix layout VariantList sin pattern nuevo (UX iteration normal post-feature)

**Categoría**: UX iteration
**Confianza**: 🟢 N/A (no aplica — reorganización visual de un componente tras observación empírica con data real es loop normal)

Cuando agregué `model_code` al label en turno previo, no anticipé que algunos codes (Yau "MBLK/S10 POL YELLOW") + badge POLARIZADO + SKU producirían 3 líneas en flex-wrap. Reorganización a 2 líneas (label+badge en línea 1, code+SKU en línea 2) limpia el problema. Sin pattern replicable nuevo más allá del ya documentado "Pre-merge de feature visible: abrir PDP con data real y verificar render" (mistake counterpart de hoy sobre badge Polarizado bug).

## 2026-05-31 — Revisado — sin novedad: indicador stock thumbnails aplicó pipeline central (regla 15) sin pattern nuevo

**Categoría**: UX detail
**Confianza**: 🟢 N/A (no aplica — extender `ProductCardVariant` con `stockState` + render dot en VariantThumbnails es uso normal del pipeline central. La adopción cross-catálogo es automática gracias a la regla 15 ya enforced.)

Cambio aprovecha el pipeline central: agregué un campo required al tipo → TypeScript fuerza a `buildCardVariants` y `toProductCardData` a populá → 7 superficies de UI (gender, shape, category-filtered, favoritos, marcas, related, recently-viewed) ven el nuevo indicador automático. Sin pattern replicable nuevo más allá de lo documentado en LEARNINGS sobre "Single point of normalization".

## 2026-05-31 — Revisado — sin novedad: UPDATE polarized=true Vulk Day Light aplica autorización standing MCP + pattern ya documentado

**Categoría**: Data patch
**Confianza**: 🟢 N/A (no aplica — UPDATE puntual idempotente via `||` operator, autorización standing del founder, sin pattern nuevo)

Cambio aprovecha el playbook ya consolidado: founder confirma dato → UPDATE via MCP con autorización standing → verificación SELECT → seed idempotente para tracking → CLOUD_APPLIED.md updated. Sin novedad replicable.

## 2026-05-31 — MCP query de coverage real ANTES de escribir lógica que depende de campos JSONB salva de silent failures

**Categoría**: MCP / Pre-implementation audit / Code-data drift prevention
**Confianza**: 🟢 Alta (validado este turno: si hubiera corrido `SELECT slug, sku, attributes->>'polarized', attributes->>'is_polarized', model_code FROM product_variants` ANTES de escribir `isPolarized()` original, hubiera detectado el drift inmediato y hubiera escrito la función robusta desde el día 1)

**Qué funcionó**: Antes de modificar `isPolarized()` este turno, corrí una query MCP listando TODAS las variantes activas con sus campos `polarized`, `is_polarized`, `model_code`. Resultado en 1 segundo: visualicé 4 patterns distintos de cómo se marcaban variantes polarizadas en el catálogo (`polarized` true, `is_polarized` true, "POL" en code, ninguno). Escribí la función con 4 fallbacks que matchearon todos los casos. **Catch del silent failure ANTES de escribir código**.

**Por qué funciona**:
- JSONB attributes en Postgres NO tienen schema enforced. Cualquier seed puede usar cualquier convención. Sin auditar la data real, mi lógica de detección puede ser plausible pero incorrecta.
- MCP permite cross-table queries de coverage en segundos. Cero costo, alto valor.
- "Plausible" ≠ "correcto". `is_polarized === true` suena plausible pero si los seeds usan `polarized`, falla en silencio.

**Cómo replicar el pattern**:
1. **Antes de escribir una función que depende de JSONB**: correr query MCP listando los campos relevantes + sus tipos + nullability cross-tabla. Costo: 1 SQL + 1 segundo.
2. **Si veo inconsistencias en la data** (mismo concepto representado con N nombres distintos): DECIDIR primero la convención normalizada. Opciones: normalizar seeds via UPDATE (limpieza) o escribir función robusta con N fallbacks (defensa).
3. **Documentar fallbacks en orden** con comment del por qué cada uno existe (cuál seed lo introdujo). Eso evita que un futuro yo lo "limpie" pensando que son redundantes.

**Generalización**: aplica a cualquier dato semi-estructurado (JSONB, NoSQL, frontmatter MDX, etc.) donde el schema no está enforced. La regla "verificar la data real antes de escribir lógica" reduce silent failures dramáticamente. En ambientes con schema fuerte (Postgres column tipada, TypeScript required field), esto es menos crítico.

**Anti-pattern evitado**: escribir lógica basándome en "cómo el code se ve" o "cómo el seed debería estar" en lugar de "cómo la data realmente está". Ambos pueden divergir silenciosamente.

## 2026-05-31 — Revisado — sin novedad: ajuste scale Vrast iter 1 (1.0 → 1.4/1.15) replica patrón Yau iter 3

**Categoría**: Product imagery
**Confianza**: 🟢 N/A (no aplica — magnitud exacta replicada del Yau post-iter 3, sin pattern nuevo)

Cambio empírico para emparejar Vrast con target visual común (Feeled/Dearly en 1.15). La novedad real del turno (sub-regla obligatoria post-carga de producto) está escalada a CLAUDE.md regla 15 — no en LEARNINGS porque ya es REGLA del sistema, no pattern.

## 2026-05-31 — Autorización standing del founder para apply via MCP reduce a CERO la fricción del loop de carga de productos

**Categoría**: Workflow / MCP / Founder trust
**Confianza**: 🟢 Alta (validado este turno con Rusty Vrast — apply ejecutado en mismo turno que write seed, sin round-trip de aprobación)

**Qué funcionó**: Founder dijo "A - siempre hacelo vos" sobre apply via MCP. Eso transformó el flow de carga de producto de:
- ANTES: write seed → mostrar SQL → esperar OK founder → apply → verificar → docs (3+ round-trips)
- AHORA: audit + fetch ML + write seed + apply via MCP + verificar + docs (1 turno end-to-end)

Aplicado al seed 26 Vrast: apply + verify + CLOUD_APPLIED.md update todo en mismo turno.

**Por qué funciona**:
- Carga de producto es operación REPETITIVA con plantilla estable (seed pattern consolidado). El riesgo de error es bajo si el playbook se respeta.
- Founder ya valida los DATOS (info del producto, fotos, decisiones de scope) ANTES de que yo escriba el seed. La aprobación del SQL en sí es burocracia redundante.
- Verificación MCP post-apply es defensa estructural: si algo salió mal, lo detecto antes de cerrar turno (no después en producción).

**Distinción importante** (para no romper la seguridad):
- ✅ Autorización standing aplica a: seeds DML (INSERT/UPDATE productos, variantes, imágenes), seeds idempotentes con ON CONFLICT, fetch JSONs ML/análogos sin auth.
- ❌ Autorización standing NO aplica a: migrations DDL (CREATE/ALTER/DROP TABLE), cambios de RLS policies, UPDATEs sin WHERE potencial, dropping de datos. Para esos SIGO pidiendo OK por turno y mostrando SQL antes.

**Cómo replicar el pattern**:
1. Cuando el founder dice "siempre hacelo vos" sobre una operación específica, registrar como autorización standing en CURRENT_STATE + CLAUDE.md si es persistent.
2. Definir el SCOPE de la autorización con precisión (cuáles operaciones SÍ entran, cuáles NO).
3. Mantener defensa estructural via verificación post-acción — si algo rompe, el founder se entera por mí (proactive) no por producción rota (reactive).

**Generalización**: este pattern aplica a cualquier loop humano-IA donde el humano confía la EJECUCIÓN pero quiere mantener control sobre la DECISIÓN. La aprobación granular por step erosiona la confianza si el step es repetitivo y bien definido. Pasar a aprobación de scope ≫ aprobación por step.

## 2026-05-31 — Revisado — sin novedad: seed 26 Rusty Vrast aplica el playbook ya consolidado + learning de ML fetch ya documentado

**Categoría**: Product loading
**Confianza**: 🟢 N/A (no aplica — la carga del seed 26 (Vrast) ejecuta exactamente el flow validado en seed 24 (Dearly): MCP slug check + ML JSON fetch + escribir seed con datos reales + presentar para autorización founder. El learning del ML fetch ya está documentado en LEARNINGS de hoy)

**Aplicación exitosa del playbook**:
- Audit previo: slug check via MCP + bucket check (ambos vacíos confirmados) + fetch ML JSON con 1 curl
- 3 variantes con datos reales extraídos en cero round-trips con founder
- Decisión de C2 (no cargar como variante sin SKU) — alineada con regla dura negocio #1 (no vendemos lo que no tenemos)
- Descripción honesta sin inventar afirmaciones por exclusión (regla preventiva del Dearly mistake)

Sin novedad replicable más allá del playbook ya consolidado.

## 2026-05-31 — Revisado — sin novedad: reubicación share button es ajuste UX iterativo sin pattern replicable nuevo

**Categoría**: UX iteration
**Confianza**: 🟢 N/A (no aplica — cambio de posicionamiento UX founder-driven, sin learning replicable más allá del pattern "founder es product instinct" ya documentado)

Reubicación de `<ShareButtons />` de "debajo del precio" a "row top junto a wishlist + compare" es ajuste UX visual basado en feedback empírico del founder. Implementación añade prop `triggerLabel` para flexibilidad cross-superficie. Sin pattern nuevo replicable.

## 2026-05-31 — Revisado — sin novedad: variant thumbnails fix sistémico aplica el mismo pattern "Single point of normalization" ya documentado

**Categoría**: Pattern application
**Confianza**: 🟢 N/A (no aplica — extracción de helper `buildCardVariants` + populate en 5 queries + pasar en 4 componentes es la 2da iteración del mismo refactor que hicimos hoy con `primaryImageScale`)

Implementación re-usa el pattern documentado en LEARNINGS de hoy "Single point of normalization: cuando un dato se transforma en múltiples lugares paralelos, mover la normalización a la query layer". Helper `buildCardVariants` ahora es export público de `to-product-card-data.ts` reutilizable por queries; tipos `FilteredCatalogCard` y `WishlistProductCard` con `variants` required que TypeScript enforza. Sin pattern replicable nuevo — es 2da aplicación del mismo refactor.

## 2026-05-31 — Revisado — sin novedad: share buttons implementados sin pattern nuevo

**Categoría**: Feature implementation
**Confianza**: 🟢 N/A (no aplica — la implementación siguió el scope alineado con founder en el turno previo, sin pattern replicable nuevo)

Implementación de `<ShareButtons />` ejecutó el scope acordado (5 botones: WhatsApp + Facebook + Email + Copiar + Native; sin emojis; PDP + artículos; tracking GA4) usando primitivas estándar: client component + `navigator.clipboard` + `navigator.share` + `wa.me` + Facebook share dialog + `mailto:`. Decisión técnica de NO instalar Sonner (regla 6) reemplazada con toast inline 10-líneas — alineado con "preferí simple sobre clever". og:image agregado a `buildProductMetadata` vía 2nd query es pattern estándar de Next.js Metadata API. Sin novedad replicable más allá de lo ya documentado en LEARNINGS sobre Single point of normalization + blind spots de e-commerce baseline.

## 2026-05-31 — Founder cubre el blind spot de "e-commerce standards" que yo (feature engineer) no veo — share buttons como ejemplo concreto

**Categoría**: Roles complementarios / Product instinct / Blind spots
**Confianza**: 🟢 Alta (gap detectado por founder fue obvio en retrospectiva — share buttons en e-commerce es 101)

**Qué funcionó**: Founder dijo "me parece raro que no hayas dicho nada" sobre share buttons. Tenía razón. Cero share components en el sitio después de semanas de trabajo. El gap es totalmente standard de e-commerce y yo nunca lo propuse en N sesiones.

**Por qué pasa**:
- Yo (Claude main) trabajo orientado a las features que el founder pide o que el código sugiere. NO tengo radar activo para "qué falta vs un e-commerce estándar".
- Mi pipeline mental es: leer roadmap → implementar → optimizar. NO incluye "comparar contra checklist mental de e-commerce baseline".
- El founder, con su experiencia comercial (técnico óptico + dueño hijo de óptica 30+ años), tiene radar permanente activo en "qué necesita un cliente comercialmente" que yo no replico.

**Cómo capitalizar el pattern**:
1. **Reconocer el rol complementario**. Founder es product instinct + commercial radar. Yo soy execution + technical depth. Las decisiones sobre "qué features faltan para el e-commerce típico" son zona del founder, no mía.
2. **No intentar suplantar el radar del founder con un checklist**. Aunque puedo armar uno (share, reviews, FAQ, política de devolución, comparador, calculadora de cuotas, búsqueda, etc.), el value real es que él los detecta NATURALMENTE cuando recorre el sitio como cliente.
3. **Cuando founder señala un gap obvio, validar rápido y aceptarlo**. NO defender ("es que no me pediste"). El default es que TIENE razón si dice "esto es standard".
4. **Documentar gaps detectados** en BACKLOG.md para acumular el "qué pidió founder vs ya implementado".

**Generalización**: este patrón aplica a cualquier proyecto donde la IA hace execution y el humano hace product. La IA optimiza local (calidad del código, completitud técnica). El humano optimiza global (estrategia de producto, market fit, commerce baseline). El loop funciona BIEN si la IA respeta esta división y no pretende dominar product también.

**Anti-pattern evitado**: yo podría haber dicho "es que estábamos enfocados en X". Excusa pobre — si en 2 meses no propuse share buttons en un e-commerce, eso es BLIND SPOT, no priorización. Reconocer ≫ excusar.

## 2026-05-31 — Revisado — sin novedad: ajuste scale Rusty Yau iter 3 (1.4/1.15) + regla 15 escalada

**Categoría**: Product imagery
**Confianza**: 🟢 N/A (no aplica — el pattern principal ya está documentado en LEARNINGS de este día sobre "Single point of normalization" + la regla 15 en CLAUDE.md formaliza explícitamente lo que ya estaba enforced por TypeScript)

Ajuste de scale Yau es continuación de iteración empírica visual (founder ve grid → reporta → ajusto un valor). El pattern de iteración está cubierto por LEARNINGS previo. La novedad real del turno (regla 15 obligatoria del founder) refuerza pero no contradice el pattern documentado — el sistema YA estaba enforced, lo único nuevo es que ahora está escrito explícitamente en CLAUDE.md para protección contra mí mismo en futuras sesiones donde olvide la arquitectura.

## 2026-05-31 — Single point of normalization: cuando un dato se transforma en múltiples lugares paralelos, mover la normalización a la query layer evita drift visual

**Categoría**: Architecture / Data normalization / Pipelines paralelas
**Confianza**: 🟢 Alta (validado este turno con fix de `primaryImageScale` que afectaba 7 superficies de UI)

**Qué funcionó**: El bug "el mismo producto se ve más chico en `/anteojos-de-sol/mujer` que en `/marcas/rusty`" venía de **dos pipelines paralelas** que transformaban el mismo dato:
- Path A (`/marcas/*`): query → `toProductCardData()` → ProductCard. `toProductCardData` aplicaba `getImageScale()`.
- Path B (`/anteojos-de-sol/*`, `/favoritos`, related, recently-viewed): query → ProductCard directamente. Sin pasar por la normalización del Path A → sin scale aplicado.

El síntoma fue visual (tamaños inconsistentes) pero la causa era arquitectónica: la normalización vivía en el "transform layer" (`toProductCardData`) pero solo un subset de catálogos pasaba por ese layer.

**Solución correcta**: Mover el normalizador a la query layer. Cada query que devuelve un shape para card (`FilteredCatalogCard`, `WishlistProductCard`, `RelatedProductCard`) ahora popula `primaryImageScale` + `secondaryImageScale` directamente en su `.map()`. Los componentes solo pasan el valor al ProductCard. Ya NO depende de qué pipeline use cada catálogo.

**Por qué funciona**:
- **Single source of truth**: `getImageScale()` se llama desde 1 lugar (queries.ts), no desde 2 (queries + toProductCardData).
- **Imposible olvidarlo**: el field es required en el tipo → TypeScript falla si una query nueva no lo provee.
- **Zero overhead**: `getImageScale()` es un Record lookup (O(1)), agregarlo a 5 queries no cambia performance.
- **Independiente de path**: cualquier consumer del query result tiene scale. Si mañana agrego `/coleccion/<curated>`, automáticamente tiene scale uniforme.

**Cómo replicar el pattern**:
1. **Identificar normalización presente en transform layer**: cualquier función `toXData` que enriquece raw data (formatos de fecha, slugs, scales, defaults).
2. **Si hay 2+ pipelines hacia el mismo componente UI**: candidate alto para mover al query layer.
3. **Forzar via tipo required**: agregar el field al tipo público → TypeScript actúa como linter contra olvidos.
4. **Documentar en el tipo**: comment en el field explicando dónde se aplica y por qué (evitar que alguien lo borre "por orden").

**Generalización**: este pattern aplica a TODO derived/computed data que vive cerca del raw query result. Casos típicos:
- Scales / sizes (este caso)
- Slugs derivados (href, breadcrumb path)
- Display formats (precio formateado, fecha relativa)
- Aggregates ya calculados (inStockCount, minPriceCents)

Si el dato derivado se necesita en N lugares de UI, calcularlo 1 vez en query layer es siempre mejor que N veces en cada call site. Si necesita re-cálculo client-side (interactive UI), usar memoization, no recalcular.

**Anti-pattern evitado**: "fix puntual" donde se pasa el scale desde fuera a cada call site. Estaba tentado a hacerlo (4 componentes × 2 fields) pero hubiera dejado el path B sin protección de TypeScript — el próximo catálogo nuevo (ej. `/coleccion-verano`) habría re-introducido el bug por construir ProductCardData manualmente.

## 2026-05-31 — MCP Supabase como source of truth para sincronizar `CLOUD_APPLIED.md` con realidad del cluster (vs depender de memoria del founder)

**Categoría**: DevOps / MCP / Trazabilidad infra
**Confianza**: 🟢 Alta (validado este turno: detecté 10 seeds faltantes en CLOUD_APPLIED.md cruzando `products` table + `storage.objects` + `pg_policies` vía MCP)

**Qué funcionó**: Cuando el MCP de Supabase quedó autenticado con acceso al proyecto correcto, una sola pasada de `execute_sql` reveló el estado real de cloud (productos, imágenes en bucket, tablas + RLS) y me permitió detectar que CLOUD_APPLIED.md tenía 10 entries faltantes (seeds 16-25 + migración swipe_matches) que no se habían registrado durante semanas. El founder había aplicado los SQL pero nunca había dicho "ya está aplicado, anótalo" — el registro había quedado desincronizado.

**Por qué funciona**:
- Cloud es la fuente de verdad real (no la memoria del founder ni mi summary)
- Cruzar tablas + storage + policies en queries puntuales me da inventario completo en segundos
- Detecta tanto faltantes (seeds aplicados pero no registrados) como sobras (migraciones pendientes que ya están aplicadas)
- Idempotente: re-correrlo no rompe nada, solo confirma

**Cómo replicar**:
1. **Al inicio de cualquier sesión nueva o tras compactor**: correr `SELECT slug, is_active, updated_at FROM products ORDER BY updated_at DESC LIMIT 10` + cruzar contra CLOUD_APPLIED.md → detectar drift
2. **Antes de afirmar "X está aplicado en cloud"**: verificar con SELECT puntual, no asumir
3. **Después de cualquier `apply_migration` / `execute_sql`**: SIEMPRE update CLOUD_APPLIED.md en el mismo turno (no diferir)

**Lección sobre workflow MCP en general**:
- Tools de read-only contra prod (SELECT) tienen costo cero y altísimo valor de verificación
- Default = verificar ANTES de afirmar estado infra, no después
- Para writes (UPDATE/INSERT/DELETE): siempre mostrar SQL + esperar OK del founder por turno

**Anti-pattern evitado**: confiar en "founder dijo que aplicó X la semana pasada" como source of truth. Si el dato no está en cloud, no está aplicado. Si está en cloud pero no en CLOUD_APPLIED.md, el doc está desactualizado, no el cloud.

## 2026-05-31 — Founder como QA final de descripciones de producto: capta afirmaciones falsas que yo no puedo verificar sin tener el producto en mano

**Categoría**: Content QA / Honesty / Regla dura negocio #3
**Confianza**: 🟢 Alta (2do caso en mismo día con mismo founder catch: chat inventando garantía + esta descripción inventando "sin tornillos")

**Qué funcionó**: El founder leyó la descripción del Rusty Dearly que yo escribí en el seed 24 y detectó al instante una afirmación falsa: "sin tornillos diminutos que se aflojan con el tiempo". Las bisagras del Dearly SÍ tienen tornillos. Riesgo concreto: comprador abre caja, ve tornillos, percibe engaño → review negativa, devolución.

**Por qué funciona el patrón**: El founder es **Técnico Superior en Óptica**, conoce los productos físicamente, conoce a las regentes que arman, y conoce el feedback histórico de clientes. Yo (la IA) escribo en base a:
- Texto descriptivo de ML (a menudo marketing)
- Convenciones del rubro
- Inferencias de marketing tone que pueden ser falsas

Sin el founder como QA, una afirmación inventada por elegancia retórica ("sin tornillos diminutos" suena bien escrito) se filtra a producción.

**Cómo capitalizar el patrón**:
1. **Marcar afirmaciones por exclusión como riesgo elevado**. Frases que dicen "sin X", "no tiene Y", "evita Z" son trampa potencial si X/Y/Z de hecho existe en el producto. Las afirmaciones por presencia ("tiene Y para Z", "está hecho de W") son más seguras.
2. **Evitar inventar features**. Si no tengo confirmación explícita de una característica (datasheet ML o founder), no agregarla a la descripción aunque "suene bien" o sea convención del rubro.
3. **Reglas duras del negocio #3 y #4 son la verdadera ancla**: "No prometer lo que no podemos cumplir" + "Honestidad sobre limitaciones de productos". Cada vez que escriba una descripción, releer esas 2 reglas antes del commit.
4. **Tono preferido del founder**: positivo pero verificable. "De plástico reforzado, resistente para uso diario" > "sin tornillos que se aflojan" (el primero es presencia + use case, el segundo es exclusión + claim que no puedo verificar).

**Generalización a otros productos**: la próxima vez que cargue un producto que no tengo en mano físicamente, hacer una pasada final por la descripción buscando frases "sin X" / "no tiene Y" / "evita Z" y pedir confirmación explícita al founder antes de commitear el seed. Reduce iteraciones de fix-after-prod.

## 2026-05-31 — Revisado — sin novedad: scale override Rusty Dearly (1.15 uniforme) replica patrón Feeled exactamente

**Categoría**: Product imagery / Grid display
**Confianza**: 🟢 N/A (no aplica — replica del patrón ya consolidado en `lib/catalog/image-scale-overrides.ts`)

Founder reportó en `/marcas/rusty` que el Dearly se veía más chico que Yau/Feeled. Aplicación directa del patrón existente: 6 entries con scale 1.15 en `IMAGE_SCALE_OVERRIDES`, exactamente la magnitud sugerida por founder y consistente con el override del Feeled (1.15/1.05). Sin pattern replicable nuevo — el playbook ya está documentado en LEARNINGS de 2026-05-30 sobre "scale overrides per-image como solución pura de código a fotos con tamaños distintos". Estado: replicable, no documentable como entry nueva.

## 2026-05-31 — Endpoint `/api/admin/ml-import-preview/<MLA>` sin auth permite autocompletar seeds de producto en un solo turno (cero round-trips con founder)

**Categoría**: Workflow / Product loading / Friction reduction
**Confianza**: 🟢 Alta (validado este turno con seed 24 Rusty Dearly — founder pasó solo URLs y datos cualitativos, yo extraje precios/stocks/variation_codes directamente)

**Qué funcionó**: Cuando founder pasa URLs de ítems ML para cargar un producto, en lugar de pedirle que copie/pegue el JSON o que ajuste TODOs manualmente, puedo hacer `curl -sS "https://opticacarballo.com.ar/api/admin/ml-import-preview/<MLA_ID>"` directamente. El endpoint está en [app/api/admin/ml-import-preview/[itemId]/route.ts](app/api/admin/ml-import-preview/%5BitemId%5D/route.ts), es público (admin sin auth iter 1, documentado en el comment del file), devuelve el JSON crudo de ML con price, available_quantity, family_id, variations[].id y attribute_combinations.

**Por qué funciona**:
- El endpoint usa el OAuth token almacenado server-side en `marketplace_integrations` → yo no necesito ningún credential
- Parseo con Python inline (`python3 -c "import json,sys; d=json.load(sys.stdin); ..."`) extrae todo lo que el seed necesita: precio centavos (`price * 100`), stock por variation, ml_variation_code
- Reemplazo 9 TODOs en el seed en un solo bloque de Edits → seed quedó completo y aplicable sin intervención founder más que subir fotos

**Cómo replicar en cargas futuras**:
1. Apenas el founder pase URLs de ML para un producto nuevo, anticipar el fetch yo mismo en el primer turno (no diseñar seed con placeholders TODO esperando que founder los complete después).
2. Mismo seed quedó listo con datos reales en menos tiempo que el round-trip "founder ajusta TODOs".
3. Si el endpoint devuelve `token_expired`, pedir al founder re-autorizar en `/api/ml/oauth/initiate` antes de continuar.

**Costos a vigilar**: el endpoint hace 1 llamada por GET. Para productos con N ítems ML (caso Dearly: 2 ítems → 2 GETs) el costo es trivial. Más relevante: si carga masiva (10+ productos), considerar batching o el endpoint `ml-force-sync` que ya existe.

**Diferencia con el playbook anterior**: seed 23 (Feeled) tuvo founder pasando JSON copy/paste a mano. Seed 24 (Dearly) tuvo founder pasando solo URLs + descripción cualitativa → yo fetché. Resultado: 1 round-trip menos, datos reales en el seed desde el commit inicial.

## 2026-05-31 — Revisado — sin novedad: carga producto Rusty Dearly (seed 24) replica patrón seed 23 / 10 (Rusty Feeled / Yau)

**Categoría**: Product loading
**Confianza**: 🟢 N/A (no aplica — el playbook estructural ya está sólido; lo nuevo de este día está en la entry de arriba sobre el endpoint admin)

Seed 24 (Rusty Dearly) sigue exactamente el patrón consolidado por seed 23 (Rusty Feeled) y seed 10 (Rusty Yau): producto base con `attributes` JSONB completo, variantes con SKU + ML mapping, fotos con path canónico `<slug>/<filename>` y esquema técnico común con `variant_id=NULL`. Diferencia estructural cubierta: 3 variantes (vs single de Feeled) repartidas en 2 ítems ML distintos (uno multi-variation + uno separado para la versión polarizada) — patrón ya cubierto por seed 10 Yau con variantes futuras. Decisión `frame_shape: "cuadrado"` confirmada contra `FRAME_SHAPES` canónicos. Sin nuevo pattern estructural — el playbook de seed sigue intacto.

## 2026-05-31 — Distinción privacy en system prompts: nombres propios SÍ en artículos/JSON-LD (E-E-A-T), NO en chat conversacional reactive

**Categoría**: Privacy / AI prompt design / Where to expose identity
**Confianza**: 🟢 Alta (validado tras feedback founder sobre nombre regente en chat — counter-pattern del mistake del mismo turno)

### Qué funcionó

Founder pidió quitar nombre propio de la regente del chat. La solución fue diferenciar **contextos donde la identidad debe exponerse vs donde NO**:

| Contexto | Exposure nombre propio | Razón |
|---|---|---|
| **Artículo /guias firmado** | ✅ SÍ | E-E-A-T (Google) — autor con matrícula refuerza autoridad médica YMYL |
| **`/sobre-nosotros` bios** | ✅ SÍ | Building trust con cliente — la página entera es "quiénes somos" |
| **JSON-LD schema (Person/Author)** | ✅ SÍ | Google reads structured data para autorship |
| **`<ArticleFooter>` bio | ✅ SÍ | Conexión obvia con autor del artículo arriba |
| **Chat conversacional reactive** | ❌ NO | Cliente puede preguntar 10 veces y el nombre se repite — exposure desproporcionada al beneficio |
| **System prompt de chat** | ❌ NO | El modelo puede usar el nombre en cualquier contexto, no controlable |

### Por qué funciona

Cada superficie del sitio tiene un **trade-off distinto entre trust signal y privacy**:
- Artículo: 1 firma visible, el lector espera ver autor — trust >> privacy concern.
- Chat: la respuesta es 1:1, dinámica, repetible — privacy concern >> trust.

Founder es no-técnico y delega decisiones de UX al developer. **Mi rol**: aplicar privacy default conservador. Si necesito credibilidad profesional en una respuesta, usar formulación neutra ("nuestra óptica regente matriculada") en vez de nombre propio.

### Cómo replicar

Para cualquier feature nuevo que use identidad de personas del negocio:

1. **Default**: NO exponer nombre propio salvo confirme founder.
2. **Si la feature es estática/permanente** (artículo, página, schema): nombres OK porque founder/regente puede revisar UNA VEZ antes de publicar.
3. **Si la feature es dinámica/reactive** (chat, recomendador, generador de copy): formulación neutra. Si emerge necesidad real de nombre, agregar opt-in explícito (ej variable env `EXPOSE_REGENTE_NAME_IN_CHAT=true`).
4. **Distinguir "founder digital" vs "personas del negocio físico"**: Juan (founder) eligió exponer su identidad. María Carlota (regente, parte del negocio físico) NO necesariamente. Privacy defaults distintos.

### Trigger

Cualquier feature dinámica/reactive (chat, AI assistant, generador conversacional, copy IA) que vaya a referenciar personas del negocio → audit privacy ANTES de incluir nombres.

### Aplicaciones futuras

- Si implementamos Opción U (probador virtual try-on): si el chat asociado menciona personas → formulación neutra.
- Si implementamos Opción Z (tracker pedidos): emails que mencionan armado/control podrían decir "controlado por nuestra regente matriculada", no nombre.
- Generador de descripciones de productos con IA (futuro): NO firmar como persona, solo como "Óptica Carballo".

### Cross-link

- Counter-pattern positivo del mistake [[hardcode-nombre-regente-en-system-prompt]] (mismo turno).
- Refuerza CLAUDE.md "Quién soy yo": founder Juan delega decisiones de UX y privacy — defaults conservadores.

---

## 2026-05-31 — Revisado — sin novedad: persistencia matches en mi-cuenta (sync localStorage → DB al loguearse)

**Categoría**: Implementation / Auth-aware feature
**Confianza**: ⚪ N/A

**Justificación regla 11**: turno de implementación con pattern conocido (auth-aware feature con persistencia híbrida + sync de localStorage a DB al loguearse). El pattern es estándar de e-commerce; no es learning nuevo replicable. La decisión técnica de "persistencia híbrida" está documentada en commit message `b03143f` + CURRENT_STATE.

Cuando se mida engagement real (% usuarios que llegan a /mi-cuenta/matches, % matches que se convierten en compras), ahí podrá surgir learning sobre conversion attribution.

---

## 2026-05-31 — Revisado — sin novedad: implementación Opción Y (Tinder de monturas) — straightforward, sin pattern replicable nuevo

**Categoría**: Implementation / UX
**Confianza**: ⚪ N/A

**Justificación regla 11**: turno de implementación directa de UX swipe con libs ya configuradas (framer-motion). Decisiones técnicas (localStorage vs Supabase, single-file component por cohesión, persistencia versionada v1) están documentadas en commit message `8080fd4` y CURRENT_STATE. No hay pattern replicable nuevo distinto a learnings ya documentados.

Si después surgen issues de UX (founder reporta drag torpe, threshold mal calibrado, etc.) y se aplican iteraciones, ahí pueden surgir learnings genuinos.

---

## 2026-05-31 — Agrupar ideas/opciones por OBJETIVO (acquisition / engagement / retention / differentiation) en vez de listar planas — ayuda al founder a evaluar trade-offs

**Categoría**: Founder communication / Proposal structuring
**Confianza**: 🟡 Media (validado tácitamente — founder respondió pidiendo más ideas, no descartando ninguna)

### Qué funcionó

Cuando founder pidió "ideas de otros sectores aplicables a óptica", ofrecí 9 opciones (DD-OO) **agrupadas por objetivo**:
- 💸 ACQUISITION (atraer clientes nuevos)
- 🔥 ENGAGEMENT (retener atención / volver)
- 💝 RETENTION + REVENUE (clientes existentes)
- ❤️ BRAND DIFFERENTIATION (posicionamiento)

vs alternativa anterior (turnos U/V/W/X) donde las listé planas sin categoría.

### Por qué funciona

El founder evalúa propuestas según **prioridad estratégica del momento**:
- Si necesita TRÁFICO → mira sección Acquisition.
- Si tiene tráfico pero baja conversión → mira Retention.
- Si quiere posicionamiento → mira Differentiation.

Agrupar por objetivo le permite **descartar grupos enteros** (ej "no me importa retention todavía") y enfocarse en los que aplican. Más eficiente que evaluar 9 opciones individualmente.

### Cómo replicar

Cuando ofrezcas 4+ opciones al founder:
1. Identificar 3-5 OBJETIVOS posibles (acquisition / engagement / retention / brand / SEO / etc).
2. Agrupar opciones por objetivo.
3. Incluir 1-2 opciones por grupo (no más para no abrumar).
4. Top-3 ranking transversal al final.
5. Esperar decisión del founder.

### Trigger

Cuando vayas a ofrecer 4+ opciones de features al founder.

### Cross-link

Complementa [[niveles-tecnicos-explicitos-en-propuestas-IA]] (commit `8850284`): ambos son sobre **mejorar comunicación de opciones al founder no-técnico**. Uno por costo, otro por objetivo.

---

## 2026-05-31 — Cuando propongo feature de IA al founder, listar NIVELES técnicos (gratis browser-native / API existente / API paga) explícitos para evitar asunción "muy complicado / muy caro"

**Categoría**: Founder communication / AI feature proposal / Avoid scope confusion
**Confianza**: 🟢 Alta (validado tras feedback "necesito API de pago" sobre Opción U probador virtual)

### Qué funcionó

Propuse el probador virtual con IA (Opción U) sin desglosar los niveles técnicos. Founder asumió razonablemente que **TODA implementación de "try-on virtual con IA" requiere API paga** (Banuba / FittingBox / etc) y dijo "es algo complicada, necesito API de pago".

En realidad había 3 niveles posibles:
- **Nivel 1 gratis**: MediaPipe Face Mesh (browser JS, MIT license, $0).
- **Nivel 2 con stack actual**: Claude Vision API + sharp (~$0.001/uso, ya configurada).
- **Nivel 3 premium**: API paga ($200-2000/mes).

Aclaré los 3 niveles en respuesta → founder ahora puede decidir con info completa.

### Por qué funciona

Founder no-técnico (CLAUDE.md "Quién soy yo") evalúa propuestas con heurística de **costo percibido**:
- "AI + cualquier feature interactivo" → asume "complicado + caro".
- "Try-on / probador virtual" → asume "necesita SDK pago tipo Banuba".

Si no le doy desglose de niveles, descarta el feature por la asunción más cara. Pierde oportunidad de evaluar el camino gratis/barato.

Solución: **en CADA propuesta de feature con IA**, presentar tabla de 2-3 niveles técnicos con (a) stack, (b) costo operativo, (c) tiempo de implementación, (d) trade-offs. Founder ve menú completo y decide informado.

### Cómo replicar

Para próximas propuestas de features que SUENAN caros pero pueden tener alternativas gratis:

1. **Listar niveles técnicos** antes de la decisión:
   - Browser-native / open-source (MediaPipe, TensorFlow.js, transformers.js).
   - APIs que YA tenés en stack (Anthropic, OpenAI, Supabase).
   - APIs especializadas pagas.
2. **Tabla comparativa** con costo + tiempo + trade-offs.
3. **Mi recomendación clara** apuntando al nivel óptimo según contexto del proyecto.
4. **Aclaración explícita** si stack actual cubre la necesidad: "no requiere libs nuevas, usamos lo que ya tenemos".

### Aplicaciones futuras

- **OCR de facturas** (futuro): nivel 1 Tesseract.js gratis vs nivel 2 Claude Vision vs nivel 3 Textract paga.
- **Búsqueda semántica avanzada**: ya hecha con pgvector + OpenAI embeddings (nivel 2 elegido).
- **Voz a texto** (eventual asistente conversacional con voz): Web Speech API gratis vs Whisper API.
- **Generación de imágenes producto**: Stable Diffusion local vs DALL-E API.

### Trigger

Cualquier propuesta de feature que el founder no-técnico podría asumir como "necesita SDK costoso" antes de evaluar alternativas.

### Cross-link

- Aplicación de [[claude-vision-como-cv-robusto-en-pipelines-ts]] (commit `67901a3`): el principio era "Vision API en vez de OpenCV/PIL". Este learning extiende a "nivel óptimo según stack actual".
- Refuerza CLAUDE.md regla 6 (no introducir libs nuevas sin preguntar): cuando hay alternativa browser-native, preferirla sobre lib nueva.

---

## 2026-05-31 — Revisado — sin novedad: turno de ideación growth/viralidad (opciones U/V/W/X)

**Categoría**: Discovery / Ideation
**Confianza**: ⚪ N/A (no hay learning replicable, solo propuestas)

**Justificación regla 11**: turno fue ideación pura de features de marketing/viralidad (probador virtual try-on, quiz, galería clientes, mini-serie video). Ofrecí 4 opciones con recomendación, esperando decisión founder.

NO hay pattern replicable validado este turno — las opciones son hipótesis, no resultados confirmados. Cuando se implemente alguna y se mida impacto real, ahí sí entra learning sobre "viralidad e-commerce óptica AR".

Cross-link: documentado en CURRENT_STATE commit `1290099` para próximo paso.

---

## 2026-05-31 — Usar Claude Vision como "computer vision robusto sin librerías especializadas" para tareas de detección en pipelines TypeScript

**Categoría**: AI tooling / Image processing / Stack unification
**Confianza**: 🟢 Alta (validado en pipeline normalización fotos, Opción P)

### Qué funcionó

Para implementar pipeline de normalización de fotos de productos, el approach original (saga 2026-05-30) era **Python + PIL** con detección de bbox via algoritmos clásicos (color thresholds, edge detection). Eso requería:
- Instalar Python + PIL en Mac founder.
- Mantener 2 stacks (TS para web + Python para herramientas).
- Algoritmos frágiles con backgrounds variados (sombras, brillos, fotos contextuales).

Approach actual (Opción P): **Claude Haiku 4.5 Vision con tool use** para bbox detection + sharp (TS) para image processing. Ventajas:
- 100% TS, mantiene stack del proyecto.
- Vision API maneja edge cases que un algoritmo clásico no (background variado, sombras, reflejos).
- Cost ~$0.001 USD/foto vs setup overhead de Python.
- Tool use con schema fuerza output estructurado (x/y/width/height ints) → cero parsing.

### Por qué funciona

Antes (~2-3 años atrás), tareas como "detectar bbox de objeto en imagen" requerían librerías especializadas (OpenCV, TensorFlow object detection, custom CNNs) + datasets + training. Llevaba semanas implementar bien.

Hoy con Vision LLMs:
- Mismo problema, prompt + tool schema, ~50 líneas de código.
- Robusto out-of-the-box (no necesita training específico).
- Costo predecible ($0.001/req).
- Trade-off: dependencia de API externa (vs algoritmo local determinístico).

### Cómo replicar

Cuando enfrentes tarea de "computer vision tradicional" (detección, clasificación, OCR, extracción de features) en un pipeline TypeScript:

1. **Pregunta primero**: ¿Claude/GPT Vision puede hacer esto vía prompt + tool use?
2. Si sí → preferir over librería especializada por:
   - Stack unificado.
   - Robustez out-of-the-box.
   - Cost-efficient para volúmenes bajos-medios (<10K imgs/mes).
3. Si no (alto volumen, latencia ultra-baja requerida, offline obligatorio) → librería especializada.

### Aplicaciones futuras

- **OCR de comprobantes** (futuro feature de facturación): Vision en vez de Tesseract.
- **Categorización de productos por foto** (auto-tag forma armazón / color / género): Vision.
- **Detección de calidad de foto** (foto borrosa? oscura? con anteojos puestos?): ya usado en `/api/face-shape` para warning flags.
- **Análisis de selfies** (recomendador de monturas, ya implementado): mismo pattern.

### Trigger

Cualquier nueva tarea de procesamiento de imágenes en el proyecto. NO instalar OpenCV/TF/Python sin antes evaluar Vision API.

### Cross-link

- Complementa pattern de [[delegar-research-tecnico-a-ai-features-engineer]]: Vision API también es "delegar a especialista" — pero en runtime, no en design.
- Aplicación de regla 6 CLAUDE.md (no introducir librerías sin preguntar): preferir Vision API ANTES de pedir aprobación para OpenCV/PIL/etc.

---

## 2026-05-31 — Al fixar un anti-pattern visual en un componente, GREP todo el archivo para encontrar OTRAS ocurrencias del mismo anti-pattern antes de cerrar el fix

**Categoría**: Code fix discipline / Pattern propagation / Avoid partial fixes
**Confianza**: 🟢 Alta (validado en iter 3→4 fix de bgs grises en ProductCard)

### Qué funcionó (al revés — es lo que NO funcionó en iter 3 y SÍ debería hacer siempre)

Después de fixar el `bg-zinc-50` en el container imagen del ProductCard (iter 3), founder tuvo que reportar iter 4 con los thumbs porque también tenían `bg-muted/40` (mismo anti-pattern, otro lugar del archivo). Un `grep -n "bg-muted\|bg-zinc"` antes de cerrar iter 3 habría detectado los 3 lugares + fix unificado en 1 round.

### Por qué funciona

Un anti-pattern visual (bg gris donde debería ser blanco para matchear assets) rara vez está en 1 solo lugar. Componentes con 100+ líneas (ProductCard tiene 295) suelen tener el mismo pattern aplicado en multiple spots por copy-paste histórico:
- Container principal
- Sub-elements (thumbs, placeholders)
- Skeleton states
- Empty states

Founder reporta el spot MÁS visible primero. Si arregla solo eso, los menos visibles aparecen en próximo round.

→ Solución: 30 segundos de `grep` antes de cerrar el fix.

### Cómo replicar

Al recibir reporte de issue visual ("el bg de X se ve mal", "el spacing de Y es raro"):

1. **Identificar el anti-pattern**: ej `bg-muted/40` aplicado a container que aloja asset blanco.
2. **Grep el archivo entero**: `grep -n "<anti-pattern>" <file>`.
3. **Para cada ocurrencia**: verificar si aplica la misma lógica del fix.
4. **Aplicar fix unificado** en el commit inicial.
5. **Commit message**: mencionar "checked all occurrences, fixed N spots".

### Trigger

Cualquier fix de styling/color/spacing en componente con >100 líneas, especialmente si el componente tiene sub-elements claros (cards con header/body/footer, grids con thumbs, etc).

### Aplicaciones futuras

- Fix de typography inconsistente en un componente → grep todo el archivo por el font/size erróneo.
- Fix de border-radius / shadow / spacing inconsistente → mismo approach.
- Refactor de design tokens → grep TODO el codebase, no solo el archivo reportado.

### Cross-link

- Aplicación de regla 14 ([[audit-antes-de-estimar]]) a fixes: audit del archivo entero antes de fix.
- Counter del MISTAKES del mismo turno [[fix-parcial-bg-muted-iter3]] — la causa raíz era no aplicar este learning.

---

## 2026-05-31 — Container bg debe matchear bg dominante de los assets que aloja (foto blanca → container white, foto transparente → container neutral)

**Categoría**: UI design / Container styling / Asset-aware decisions
**Confianza**: 🟢 Alta (validado en rollback iter 3 catalog grid)

### Qué funcionó

Cuando founder reportó "fondo gris visible alrededor de la foto blanca del Feeled", el fix fue inmediato: cambiar `bg-zinc-50` → `bg-background` (white) en el container del ProductCard. La foto y el container ahora se fusionan visualmente sin borde aparente.

Es el counter del MISTAKES previo (commit f0d7dd2 + este turno): aquel mistake fue "asumir sin verificar", este learning es la regla preventiva positiva.

### Por qué funciona

UI containers que alojan assets (fotos, logos, videos) tienen 2 estados visuales:
- **Asset llena 100% el container**: el bg del container es invisible.
- **Asset NO llena 100%** (object-contain, scale <1, aspect mismatch): el bg del container queda visible alrededor del asset.

Si el bg del container es DISTINTO al bg dominante del asset, la zona visible se nota como un borde/halo de color distinto. El usuario lo lee como "bug visual".

→ Regla simple: el bg del container debe matchear el bg dominante de los assets que aloja. Si todos los assets tienen fondo blanco isolated, container = white. Si todos son transparentes, container = cualquier color que no interfiera (zinc-50 puede aplicar). Si los assets son variados, normalizar primero.

### Cómo replicar

Cuando diseñes/refines un container que aloja assets externos:

1. **Audit visual de 2-3 assets del bucket** (1-2 min).
2. **Identificar bg dominante**: ¿blanco isolated? ¿transparente? ¿foto contextual con bg variado?
3. **Decidir bg container**:
   - Asset blanco isolated → container white (default).
   - Asset transparente PNG → container con color del brand (ej zinc-50 sí aplica).
   - Asset contextual con bg variado → considerar agregar overlay/gradient en el asset para uniformidad.
4. **Cualquier decisión "premium feel" del bg** requiere normalizar assets primero.

### Trigger

Cualquier cambio de styling en containers de catálogo (grids, PDPs, galerías, hero) ANTES de aplicar estética nueva → verificar bg de assets.

### Aplicaciones futuras

- Próximo refactor de PDP gallery / catálogo grid.
- Si decidimos hero con fotos editoriales (no transparentes): container hero debe matchear, no asumir.
- Cualquier sección nueva con `bg-zinc-50` / `bg-zinc-100` / `bg-foreground` que aloje assets: verificar bg de los assets.

### Cross-link

- Counter-pattern positivo del [[mistake-bg-zinc-50-asumiendo-fotos]] (este mismo turno).
- Refuerza regla 14 CLAUDE.md: audit antes de actuar también en UI.

---

## 2026-05-31 — Card grid debe mostrar thumb de variante incluso con 1 sola variante (consistencia visual)

**Categoría**: UI / Catalog grid / Founder feedback / Visual consistency
**Confianza**: 🟡 Media (validado en feedback puntual founder, no aplicable a TODOS los e-commerce)

### Qué funcionó

Founder reportó inconsistencia entre cards: Yau mostraba 3 thumbs de variantes, Feeled mostraba 0 (porque tenía 1 sola variante y la lógica era `variants.length > 1`).

Founder explícitamente pidió: "en la parte inferior debería aparecer al menos una Thumb foto de la variante que hay" → cambié a `>= 1` con guard de `primaryImagePath != null`.

Resultado esperado tras deploy: TODOS los cards del grid muestran SOME thumb visible abajo, dando uniformidad visual al grid. No es funcional (no se puede cambiar a otra variante si hay 1 sola), es **estético** — el card se ve "completo" con thumb.

### Por qué funciona

Founder priorizó CONSISTENCIA VISUAL sobre PUREZA FUNCIONAL. La lógica original `> 1` era pura ("solo mostrar thumbs si sirve para cambiar variante"), pero generaba grids visualmente inconsistentes cuando había productos con 1 variante junto a productos con N variantes.

Decisión de producto: **uniformidad > pureza funcional** en este caso. Cards uniformes generan mejor sensación de marca premium que cards "minimal cuando no aplica" + "rich cuando aplica".

### Cómo replicar

Cuando una UI muestra elementos opcionales solo "si aplica":
1. Considerar si hay impacto visual de **inconsistencia entre items del mismo nivel** (en este caso, cards del mismo grid).
2. Si sí → evaluar mostrar elemento opcional siempre que sea SEMÁNTICAMENTE válido (con guards para que no aparezca placeholder vacío).
3. Si la decisión es de producto/branding más que de funcionalidad → priorizar consistencia.

### Trigger

Cuando founder reporta "todos los X se ven distintos en el grid" o "falta Y en algunos cards" → revisar condiciones de render condicional en componentes.

### Cross-link

Refuerza [[refinamientos-quirurgicos-vs-rehacer]]: un cambio chico (>1 a >=1) tuvo impacto visible grande. No requirió rehacer ProductCard ni VariantThumbnails.

---

## 2026-05-31 — Al cargar producto nuevo de marca/línea existente, COPIAR scale overrides del producto similar (no empezar desde scale 1.0)

**Categoría**: Product upload / Image scale / Visual consistency / Brand uniformity
**Confianza**: 🟢 Alta (validado en carga Rusty Feeled — inconsistencia detectada en grid, fix con copy de overrides Yau)

### Qué funcionó

Al cargar Rusty Feeled como producto nuevo, el seed default no tenía `image-scale-overrides` → fotos renderizadas a scale 1.0 (default). En el grid de `/anteojos-de-sol/rusty`, el Feeled se veía **visualmente más chico** que el Rusty Yau, que sí tenía overrides 1.8/1.4 desde saga 2026-05-30 (iter 14).

Founder detectó inconsistencia vía screenshot. Audit reveló causa raíz: faltaba override.

Fix aplicado: copié estructura del Yau (lateral más alto que frontal por perspectiva 3/4 con patilla extendida) y ajusté magnitud por foto específica del Feeled (1.5/1.4 vs 1.8/1.4 del Yau).

### Por qué funciona

Cuando una marca/fabricante distribuye fotos profesionales, todas las fotos de la misma línea de productos siguen una **convención visual consistente**:
- Aspect ratio de las imágenes
- Bbox del anteojo en pixels (% del frame ocupado)
- Ángulo de perspectiva (3/4 lateral, frontal directo, etc.)
- Padding interno

→ Si producto A y producto B son de la misma marca/línea, las fotos tienen ESTRUCTURA SIMILAR. Si el producto A tiene scales `{lateral: 1.8, frontal: 1.4}` que se ven bien, el producto B típicamente necesita scales similares (no idénticos — pero del mismo orden).

**Empezar desde scale 1.0 ignora 14 iters de aprendizaje empírico** (saga Vulk Day Light 2026-05-30 + Rusty Yau iter 14). Es más eficiente copiar la baseline conocida y ajustar.

### Cómo replicar

Cuando cargues un producto nuevo:

1. **Verificar si la marca tiene productos cargados antes**: `grep -n "<brand-slug>/" lib/catalog/image-scale-overrides.ts`.
2. **Si sí**: copiar las scales del producto más similar (misma línea/perspectiva) como baseline.
3. **Si no**: empezar con scale 1.0 → ajustar empíricamente tras deploy.
4. **Documentar la decisión** en comment del override: "copiado de `<producto-similar>` porque fotos del fabricante usan misma convención".
5. **Anticipar el ajuste post-deploy**: founder probably va a pedir ajuste empírico (más grande/chico). Tener variantes pre-ajustadas en mente (ej. 1.5 → 1.6 → 1.8).

### Trigger

Cualquier carga de producto nuevo donde la marca ya tiene 1+ productos en el catálogo con scales activas.

### Aplicaciones futuras

- **Cargas pendientes de Rusty**: si vienen más modelos (Wayfarer Classic, Aviator Pilot — eliminados antes pero pueden volver), copiar scales de Yau/Feeled.
- **Vulk**: ya tiene productos cargados (Day Light, Yamain, Stray) con scales activas. Próximos Vulk → copiar el más similar.
- **Reef / Mormaii / Paula Cahen**: primera carga será baseline 1.0, después serán "copiar del similar".

### Cross-link

- Complementa [[trampas-del-experto-en-few-shot]] y [[jerarquia-fuentes-specs-tecnicos]] (commit `87a99e5`): los 3 patterns son sobre **aprovechar conocimiento previo del proyecto antes de hacer trabajo from-scratch**.
- Aplicación práctica de [[refinamientos-quirurgicos-vs-rehacer]]: scales son refinamiento empírico que se ACUMULA en el codebase. No reiniciar desde cero por cada producto.

---

## 2026-05-31 — Jerarquía de fuentes para specs técnicos de productos: sitio oficial fabricante > ML listing > inferencia

**Categoría**: Product data / Source of truth / Discrepancias entre fuentes
**Confianza**: 🟢 Alta (validado en carga Rusty Feeled — discrepancia 50mm vs 63mm resuelta correctamente)

### Qué funcionó

Durante carga del producto Rusty Feeled, detecté **discrepancia técnica entre 2 fuentes oficiales**:
- ML attribute `LENS_WIDTH`: 6.3 cm (63 mm)
- Sitio oficial Rusty (validado por founder): 50 mm

Tomé decisión técnica: **ML como source of truth para precio/stock/atributos comerciales, pero sitio oficial del fabricante como source of truth para specs técnicos físicos del producto** (medidas, peso, materiales).

Justificación documentada en seed 23:
> "ML no es 100% confiable para medidas (otros sellers podrían cargar mal). Founder confirmó 50mm según SITIO OFICIAL Rusty. Vamos con 50mm."

### Por qué funciona

Cada fuente tiene fortalezas y debilidades distintas:

| Fuente | Fortaleza | Debilidad |
|---|---|---|
| **Sitio oficial fabricante** | Specs técnicos verificados por el fabricante (medidas, peso, materiales reales) | No tiene precio ni stock del seller |
| **ML listing (incluso official store)** | Precio real, stock real, identificadores comerciales (item_id, family, store) | Specs cargados manualmente por el seller — pueden tener errores de transcripción (ej. 63mm en vez de 50mm) |
| **Foto del producto** | Verificación visual de color/forma | No tiene medidas precisas |
| **Inferencia desde título / categoría ML** | Útil para defaults | Última prioridad — adivinanza |

Jerarquía operativa: **sitio oficial fabricante > ML listing > inferencia**.

### Cómo replicar

Cuando carguemos productos futuros con datos de múltiples fuentes:

1. **Precio, stock, item_id**: ML listing del founder/seller es source of truth.
2. **Specs físicos** (medidas mm, peso gramos, materiales): sitio oficial del fabricante (Rusty / Vulk / Mormaii / Paula Cahen). Pedir al founder confirmación si está disponible.
3. **Color/temple/lens treatments**: cruzar ML attributes + sitio oficial + foto. Si discrepan, founder decide cuál refleja el producto físico real que tiene en mano.
4. **Si hay duda**: documentar la discrepancia en el seed (comment con ambas fuentes) y elegir la conservadora.

### Trigger

Cualquier carga de producto donde ML attributes contradigan datos del sitio oficial o del founder (cualquier diferencia técnica detectable cruzando fuentes).

### Aplicaciones futuras

- Cargas pendientes: Vulk completo (Brillante, Stray, otras), Reef, Mormaii, Paula Cahen D'Anvers, Rusty (resto de modelos).
- Validación de catálogos completos: si script de import descubre discrepancias entre ML y sitio oficial, flagear para revisión manual.
- UPDATE de productos existentes: si encontramos un producto cargado con specs erróneos (vs sitio oficial), priorizar fix del attributes.measurements.

### Cross-link

- Complementa [[foto-producto-real-vs-diagrama-schematic]] (commit `bdf73c5`): ese es sobre **assets visuales**, este es sobre **datos numéricos/técnicos**. Ambos comparten el principio "cruzar fuentes antes de confiar ciegamente en una sola".
- Aplicación de [[auditar-antes-de-crear]] (regla 14 CLAUDE.md): el audit del JSON ML reveló la discrepancia, sin audit hubiéramos cargado 63mm sin notar.

---

## 2026-05-31 — Cuando founder pasa "foto/imagen del producto", verificar si es foto REAL del producto o un diagrama schematic genérico

**Categoría**: Product upload / Asset audit / Founder collaboration
**Confianza**: 🟢 Alta (detectado en carga Rusty Feeled — founder pasó diagrama de medidas creyendo que servía como foto)

### Qué funcionó

Founder pasó imagen junto con specs del producto y dijo "esta es la imagen de medidas del producto, no tengo otra foto". La imagen mostraba una **silueta wayfarer genérica** con cotas (140mm / 50mm / 18mm / 45mm / 145mm) — claramente un **diagrama schematic de sizing**, NO el producto real.

Pero el producto Rusty Feeled es **envolvente deportivo de tenis** — silueta totalmente distinta a un wayfarer. La imagen no servía como foto de galería del producto.

Detecté la discrepancia + aclaré al founder antes de proceder a crear el seed con esa imagen como `01-frontal.jpg`. Resultado: evité agregar imagen incorrecta al bucket + activar producto con foto que no representa el producto.

### Por qué funciona

Founder no-técnico (CLAUDE.md "Quién soy yo") pasa assets visuales con criterio variable. Los proveedores de la marca (Rusty, Vulk, etc) suelen distribuir:
- **Fotos reales del producto** (frontal sobre fondo blanco, contexto, lateral) → SÍ sirven para galería.
- **Diagramas schematic de medidas** (silueta genérica con cotas marcadas) → NO sirven para galería, sirven para `attributes.measurements`.
- **Mockups o renders 3D** → caso intermedio, depende.

El founder ve "imagen del producto" y asume que sirve para galería. Mi rol: verificar visualmente Y EN CONTEXTO (la imagen matchea la forma del producto?) antes de proceder.

Indicadores de "es diagrama, no foto real":
- Silueta NO matchea la forma del producto declarada (frame_shape).
- Cotas en mm marcadas con flechas.
- Líneas vectorizadas planas sin textura.
- Color de fondo uniforme y poco profesional.
- Falta de detalles del producto real (color real, transparencias, ventilación, etc).

### Cómo replicar

Cuando founder pase imagen junto con un pedido de carga de producto:

1. **Verificar visualmente**: ¿matchea la forma del producto declarada en el seed (`frame_shape`)?
2. **Verificar contexto**: ¿tiene cotas / flechas / silueta genérica de marca? → es diagrama, no foto.
3. **Si es diagrama**: extraer las medidas para `attributes.measurements` Y aclarar al founder que **NO se usará como foto de galería**.
4. **Si es foto real**: confirmar nombre exacto del archivo (`01-frontal.jpg`, etc.) + bucket destino.

### Trigger

Cualquier pedido del founder con "esta es la imagen/foto del producto" — verificar antes de proceder.

### Cross-link

- Relacionado con [[trampas-del-experto-en-few-shot]]: el founder es el experto del dominio óptico (sabe medidas, sabe el modelo) pero las decisiones de **assets para web** son del developer. División clara.
- Aplicación inmediata: próximas cargas de producto (Vulk + Reef + Mormaii + Paula Cahen pendientes en backlog).

---

## 2026-05-30 — Mis estimaciones de "rehacer X" sobre-estiman 3-6x cuando el codebase tiene >1 mes de historia

**Categoría**: Estimation / Self-calibration / Meta-pattern
**Confianza**: 🟢 Muy alta (5 recurrencias consecutivas validadas en sesión 2026-05-30)
**Status**: 🔴 **Candidato a escalación a regla CLAUDE.md** — pattern validado 5 veces seguidas.

### Qué funcionó (en realidad: qué se confirmó como pattern)

5 sub-opciones consecutivas donde mi estimación original fue **muy mayor** que el trabajo real tras audit:

| Opción | Mi estimación original | Real tras audit | Factor |
|---|---|---|---|
| 1 (homepage post-hero) | 3-4h | ~1.5h | 2.5x |
| 2 (PDP editorial) | 4-5h | ~45min | 5-6x |
| 3 (catalog grid premium) | 2-3h | ~30min | 4-6x |
| E (sobre-nosotros) | 3-4h | ~1h | 3-4x |
| F (recomendador IA) | 1-2 días | <3h (sin implementar aún) | 3-5x |

**Pattern claro**: cuando founder pide "feature X" o "mejorar/rehacer Y", mi instinto es estimar **como si fuera from-scratch**. La realidad de un codebase con >1 mes de historia es que **buena parte ya está construida** — solo falta refinar o agregar pedazos puntuales.

### Por qué pasa

1. **Sin audit**, leo el pedido del founder como descripción de scope ("rehacer PDP") y estimo el scope literal (rehacer = from-scratch).
2. **Con audit** (leer page.tsx + componentes existentes), descubro que el feature ya tiene 70-90% construido — el "rehacer" se vuelve "refinar".
3. **El delta de tiempo** entre "from-scratch" y "refinar" es 3-6x.

El audit toma 1-2 minutos. La diferencia de estimación es 1-5+ horas.

### Cómo replicar (versión escalada)

**ANTES de dar una estimación de tiempo para cualquier pedido de feature/mejora/rediseño en este codebase**:

1. **Audit obligatorio** (1-2 min): `ls components/<area>/`, `wc -l app/<route>/page.tsx`, leer 1-2 archivos clave.
2. **Diagnóstico explícito** al founder ANTES de dar la estimación:
   - "Audité — ya existe `<componente>` con `<funcionalidad>`. Hay gaps de `<X, Y, Z>`."
   - "El trabajo real es: refinar A + crear B (sin tocar C que ya funciona)."
3. **Re-estimar con factor de corrección**: si mi instinto dice "Nh", probar "N/3 a N/5h" como rango más realista cuando el componente ya existe.

### Aplicaciones inmediatas

- Próximas opciones del backlog (G página 404, H cargar productos, próximo artículo del Lote 1): audit ANTES de estimar.
- Cuando founder vuelva con "quiero feature Z": audit como primer paso siempre.

### Escalación recomendada

Si esto recurre 1-2 veces más (6-7ma vez): **agregar a CLAUDE.md** como regla 14:

> 14. **Audit obligatorio antes de estimar**. Cualquier estimación de "Nh para rehacer/mejorar X" sin audit previo del componente actual viola la regla. Audit = `ls` + lectura de 1-2 archivos clave (~2 min). Sin audit, mis estimaciones sobre-estiman 3-6x.

### Cross-link

- Complementa [[auditar-componentes-existentes-antes-de-crear]] y [[refinamientos-quirurgicos-vs-rehacer]] — son las dos partes (detección + acción) cuyo meta-resultado es este pattern de estimación calibrada.

---

## 2026-05-30 — Workflow "agent draft → agent validate → human apply" para contenido YMYL multi-agente

**Categoría**: Multi-agent / Content production / YMYL / E-E-A-T
**Confianza**: 🟢 Alta (validado en publicación del primer artículo pillar /guias/como-leer-receta-anteojos)

### Qué funcionó

Para producir el primer artículo pillar (~4.000 palabras, YMYL salud visual) ejecuté un workflow de 3 pasos secuencial con 2 agentes especializados:

1. **`content-writer-medical`** redactó el draft completo siguiendo specs detalladas (slug, keyword target, cluster, estructura H2/H3, tono argentino, 8 internal links, frontmatter YAML completo, ~3.500-4.500 palabras).
2. **`optical-expert`** validó precisión técnica claim por claim (15 claims específicos a verificar). Devolvió:
   - 3 correcciones obligatorias (errores reales: rango esfera, pasos decimales, convención TABO)
   - 5 mejoras recomendadas (precisión adicional)
   - 3 disclaimers nuevos sugeridos (pediátrico, diabéticos, post-LASIK)
   - Validación explícita de claims correctos
3. **Yo** apliqué TODAS las correcciones con `Edit` tool + actualicé CONTENT_PLAN.md + commit.

Resultado: artículo publicado con calidad **superior a draft single-agent**, en ~30 minutos de tiempo elapsed.

### Por qué funciona

Single-agent (un solo content writer) produce contenido bien escrito pero **puede tener inexactitudes técnicas no detectadas** (ej. "rango esfera ±25 dpt" — técnicamente posible pero no clínicamente habitual). Para YMYL eso es **un riesgo real**: una afirmación imprecisa daña credibilidad + puede confundir al lector.

El pattern multi-agent **separa responsabilidades**:
- **content-writer-medical**: estructura SEO, tono, claridad, internal links, frontmatter.
- **optical-expert**: precisión técnica claim por claim (Source of Truth técnica del proyecto).
- **Humano (yo)**: aplica correcciones + decide qué adoptar vs no.

Ventajas:
1. Mejor accuracy técnica (optical-expert detecta lo que content-writer no podría).
2. Más rápido que single-agent + multiple revision rounds.
3. Trazabilidad clara: el reporte del optical-expert queda commiteado como evidencia de validación profesional.
4. E-E-A-T reforzado: el artículo va firmado por autor matriculado + reviewer matriculado + el contenido fue validado independientemente por un agent técnico.

### Cómo replicar

Para cada uno de los próximos 14 artículos del `CONTENT_PLAN.md`:

1. **Prompt content-writer-medical** con specs detalladas (frontmatter target + estructura H2 + internal links target + tono + word count).
2. **Prompt optical-expert** con lista específica de claims técnicos a validar (10-15 items). Pedir reporte con: ✅/⚠️/🔴 + correcciones obligatorias con "antes → después" exacto.
3. **Aplicar correcciones** con `Edit` tool. NUNCA aceptar el draft inicial sin pasar por el reviewer técnico.
4. **Commit** con mención explícita del workflow (audita trazabilidad).
5. **Update CONTENT_PLAN.md** marcando como ✅ Publicado.

### Aplicaciones futuras

- Próximos 14 artículos del Lote 1 + Lote 2 (CONTENT_PLAN.md).
- Páginas de marca extensas (sobre-la-marca para Vulk, Rusty, etc.).
- Sección `/sobre-nosotros` editorial cuando founder la priorice.
- Cualquier copy YMYL de la óptica (BUSINESS_POLICIES, glosarios, etc.).

### Cross-link

- Complementa [[trampas-del-experto-en-few-shot]]: ambos patterns aprovechan **expertise especializado en pipeline multi-stage**. Uno valida few-shot con experto humano (founder), otro valida contenido con agente experto técnico.
- Conecta con [[delegar-research-tecnico-a-ai-features-engineer]]: pattern general "delegar a especialista antes de avanzar".

---

## 2026-05-30 — Refinamientos quirúrgicos vs rehacer: 3-5x mejor ROI cuando componente ya es funcional

**Categoría**: Refactor strategy / Estimation / Anti-rewrite
**Confianza**: 🟢 Alta (validado en 3 turnos consecutivos: hero/home → PDP → catalog)

### Qué funcionó

Plan original ofreció a founder 4 opciones con estimaciones:
- Opción 1 — Bloques editoriales post-hero: ~3-4h
- Opción 2 — PDP editorial: ~4-5h
- Opción 3 — Catalog grid premium: ~2-3h

**Real ejecutado** (refinamientos quirúrgicos tras audit):
- Opción 1: ~1.5h (refactor ValueProps + crear solo HowWeWork que faltaba)
- Opción 2: ~45 min (4 cambios CSS/tipografía en product-page.tsx)
- Opción 3: ~30 min (2 archivos: ProductCard typography/hover + FrameShapeFilters)

**Total real**: ~3h vs ~9-12h del plan original = **3-4x mejor ROI**.

### Por qué funciona

Cuando el codebase tiene 1-3 meses de historia (varios commits diarios), los componentes "feos" suelen ser **funcionalmente completos pero estéticamente desactualizados** porque crecieron iterativamente. El gap no es "falta de feature" sino "falta de consistencia visual con la última iteración del design system".

Cuando founder pide "rehacer X bloque", el instinto del developer es **rehacer literal** (crear nuevo, deprecar viejo). Pero el 80-90% del tiempo el componente viejo:
1. Ya tiene toda la lógica de negocio (variant swap, edge cases, JSON-LD, accessibility)
2. Solo tiene tipografía/spacing/colores inconsistentes con la última iteración del site

**Refinar > rehacer** porque:
- Conservás todas las decisiones técnicas correctas previas (incluyendo edge cases que no recordás).
- Reducís riesgo de regresión funcional (no tocás la lógica).
- Implementás 3-5x más rápido (solo CSS/tipografía).
- Es reversible fácil (git diff acotado).

### Cómo replicar

ANTES de implementar cualquier pedido de "mejorar/rehacer/rediseñar X bloque":

1. **Audit funcional**: leer el componente actual + listar qué hace (lógica de negocio, edge cases, integrations).
2. **Audit estético**: comparar tipografía/spacing/colores con la última iteración aprobada del site (hero, home, etc.).
3. **Diagnóstico**: ¿el problema es funcional (falta feature) o estético (inconsistencia visual)?
   - **Funcional** → crear/agregar lo que falta.
   - **Estético** → refinar quirúrgicamente sin tocar lógica.
   - **Ambos** → refinar primero, sumar funcional después si sigue faltando.
4. **Re-estimar**: si el diagnóstico es "estético principalmente", la estimación cae 3-5x.

### Trigger

Cualquier pedido founder de "mejorar X bloque" en codebase con >1 mes de historia → audit funcional + estético antes de estimar/implementar.

### Cross-link

- Complementa [[auditar-antes-de-crear]]: ese learning es sobre DETECCIÓN (qué hay), este es sobre ACCIÓN (qué hacer con lo que hay).
- Aplicación inmediata: si founder elige Opción 4 (sobre-nosotros) → audit primero, después decidir si refactor o crear.

### Aplicaciones futuras

- Cualquier feature "rediseño Y" del backlog (footer, header, página de marca, página individual de producto, etc.).
- Cualquier "modernizar Z" — casi siempre es CSS/tipografía/spacing, no nueva funcionalidad.
- Refactors técnicos también: "limpiar el módulo X" típicamente es 70% rename + 30% reorganize, no rewrite.

---

## 2026-05-30 — Auditar componentes existentes ANTES de crear nuevos cuando hay solapamiento funcional

**Categoría**: Component reuse / Anti-duplication / Codebase awareness
**Confianza**: 🟢 Alta (validado en Opción 1 bloques editoriales home)

### Qué funcionó

Founder pidió "3 bloques nuevos post-hero" (trust signals + cómo trabajamos + marcas). ANTES de implementar, leí `app/(storefront)/page.tsx` + listé `components/home/` → descubrí que **ya existían**:
- `ValueProps` con los 4 trust signals correctos (regente / 30+ años / envíos / WhatsApp)
- `BrandsSection` con grid de marcas

Solo faltaba **`HowWeWork`** (4 pasos). Y el problema visual era de **POSICIÓN** + **estética plana**, no de ausencia.

Si hubiera implementado el plan literal (3 bloques nuevos), habría:
1. Duplicado los 4 trust signals (1 versión nueva + 1 vieja en `ValueProps` al final → conflict)
2. Duplicado la grilla de marcas (1 versión nueva + `BrandsSection` original)
3. Creado deuda técnica: 2 componentes haciendo lo mismo, founder confundido sobre cuál editar

En cambio:
- Refactoricé `ValueProps` con estética editorial nueva + lo moví de posición (post-newsletter → post-TrustMarquee)
- Creé solo `HowWeWork` (lo que sí faltaba)
- `BrandsSection` quedó intocado donde ya estaba bien

### Por qué funciona

En codebases que crecieron iterativamente (varios meses con commits diarios), **siempre hay solapamiento funcional latente**. El founder/user describe necesidades en lenguaje de producto ("bloques de trust signals"), no en lenguaje de codebase ("refactorizar ValueProps + moverlo + crear HowWeWork"). Es trabajo del developer mapear uno al otro.

El check de 30 segundos (`ls components/home/` + leer `page.tsx`) detecta:
- Componentes que ya hacen lo que se pide → refactor candidates
- Componentes mal posicionados → reorder candidates
- Genuine gaps → create candidates

### Cómo replicar

ANTES de crear cualquier componente nuevo en respuesta a un pedido de feature:

1. **`ls` el directorio relevante** (`components/X/`, `app/Y/`).
2. **Leer el archivo orquestador** (`page.tsx`, `layout.tsx`).
3. **Identificar candidatos refactor vs nuevos** basándose en nombres + descripciones de componentes.
4. **Si hay duda**, leer 1-2 componentes existentes que parecen relevantes.

Si después del audit identificás que el feature pedido **se puede resolver refactorizando lo existente + creando solo lo que genuinamente falta**, esa siempre es la mejor opción.

### Trigger

Cualquier pedido de "agregar / crear / sumar X bloque/sección/feature" en codebase con >1 mes de historia → audit existente antes de crear.

### Aplicaciones futuras

- Opción 2 (PDP editorial): antes de "crear nuevo PDP", auditar `app/(storefront)/anteojos-de-sol/[slug]/page.tsx` + `components/product/` → refactor candidates vs new.
- Opción 4 (sobre-nosotros): auditar `app/(storefront)/sobre-nosotros/page.tsx` existente antes de proponer "página nueva".
- Recomendador IA: auditar `/recomendador-de-monturas` actual antes de proponer "feature nueva".

### Cross-link

Relacionado con [[trampas-del-experto-en-few-shot]]: ambos patrones son sobre **leer el contexto antes de actuar**. Uno es leer el dominio (óptica). El otro es leer el codebase. Mismo principio.

---

## 2026-05-30 — Para few-shot de IA en dominio especializado, el "ground truth + trampas" del founder-experto vale más que la imagen sola

**Categoría**: AI Features / Few-shot prompting / Domain expertise
**Confianza**: 🟢 Alta (validado en recolección receta #1 lector oftalmológico)

### Qué funcionó

Al recolectar la primera receta para el few-shot del lector, founder (técnico óptico matriculado) me dio:
1. La imagen recortada (sección Rx, sin datos personales)
2. Los valores correctos (esf, cil, eje, add por ojo)
3. **5 "trampas" específicas que un modelo Vision genérico se confunde**:
   - "Astigmatismo puro" → ESF implícitamente 0.00, pero la receta NO lo escribe
   - Sin etiquetas OD/OI → convención AR = primera fila siempre OD
   - Eje 4° atípico → válido pero modelo podría redondear o asumir 0 (inválido)
   - Notación "-225" = -2.25 → punto decimal omitido (manuscrito AR)
   - DNP ausente → null + warningFlag `partial_data`

Las trampas son **conocimiento tácito del óptico** que ningún training general capturó. Una receta sin esa anotación = imagen ambigua para el modelo. Una receta CON esa anotación = lección concreta replicable.

### Por qué funciona

Few-shot examples enseñan al modelo qué hacer **en casos atípicos**. El insight clave: lo atípico para un experto en óptica argentina ≠ lo atípico para Claude Vision (que vio millones de imágenes pero ninguna específica de la convención AR de astigmatismo puro). Solo el founder-experto puede identificar:
- Convenciones implícitas no escritas (ESF 0.00 cuando no aparece)
- Variaciones regionales (notación compacta sin decimal)
- Cuándo un valor "raro" es válido (eje 4°) vs cuándo no (eje 0°)
- Cómo flagear missing data según el contexto clínico

Sin esa anotación, el modelo aprendería solo el formato visual de la receta, no las **decisiones de extracción** que un óptico real toma al verla.

### Cómo replicar

Cuando construyas few-shot para IA en dominio especializado (medicina, derecho, finanzas, ingeniería, óptica):

1. **No pidas solo "ground truth"** (los valores correctos). Eso es el output.
2. **Pedí "trampas"** explícitamente: "¿qué puede confundir a alguien que NO es experto al ver esta imagen/texto/dato?".
3. **Embeber las trampas en el system prompt como reglas explícitas**, NO en el ejemplo. El ejemplo muestra QUÉ extraer; las reglas explican CÓMO decidir.
4. **Validar con el experto** que el JSON ground truth final refleja sus decisiones reales — no asumir interpretaciones tuyas.

### Aplicaciones futuras del proyecto

- Recomendador de monturas IA (founder = experto en formas de cara + qué montura va con cada una).
- Asistente conversacional RAG sobre catálogo (founder = experto en cuándo recomendar PDP vs handoff WhatsApp).
- Generador de descripciones de producto (founder = experto en qué decir vs qué evitar legalmente).

Pattern: cualquier feature IA con dominio óptico/médico → flow de recolección de ground truth INCLUYE "trampas" anotadas por founder.

---

## 2026-05-30 — Delegar research técnico crítico a `ai-features-engineer` ANTES de implementar API integraciones complejas

**Categoría**: AI Features / API integration / Pre-implementation research
**Confianza**: 🟢 Alta (validado en upgrade lector receta Tier 1)

### Qué funcionó

Antes de implementar tool use + extended thinking + few-shot en el endpoint del lector de receta, delegué research específico al `ai-features-engineer`: "¿son compatibles tool use forzado + thinking? ¿shape exacto del request body? ¿cómo embeber few-shot en Vision?". El agente devolvió en ~40s un hallazgo crítico: **`tool_choice: { type: "tool", name: ... }` (forzado) NO es compatible con extended thinking activo**. Restricción no obvia, fácil de pifiar si vas directo al código.

Si hubiera implementado sin research:
- Habría usado `tool_choice` forzado (la opción "más limpia" intuitivamente).
- El endpoint habría tirado 400 en producción al recibir la primera receta.
- Founder habría reportado "el lector no funciona" → 1-2 iteraciones de debug.

Con research previo: ajusté a `tool_choice: "auto"` + system prompt que fuerza el comportamiento via texto. Implementación funcionó al primer build.

### Por qué funciona

Las APIs de modelos LLM tienen restricciones de compatibilidad entre features (tool use, thinking, system prompt caching, vision, etc.) que NO son obvias leyendo la doc por separado de cada feature. La doc cubre cada feature aisladamente, pero las interacciones entre features están enterradas en notes o changelogs.

El `ai-features-engineer` tiene `web_fetch` + conocimiento específico de patterns de Anthropic. Cuando le preguntás "¿compatibles X + Y + Z?" en lugar de "¿cómo uso X?", devuelve el hallazgo crítico que un read directo de doc te haría leer 4 páginas distintas para descubrir.

### Cómo replicar

ANTES de implementar cualquier integración con LLM API que combine 2+ features (ej: tool use + thinking, RAG + caching, streaming + tools), invocar `ai-features-engineer` con prompt específico:
- Listá las features que querés combinar.
- Pedile el shape exacto del request body que funciona.
- Pedile parser TS de la response.
- Pedile que marque con ⚠️ los items que no puede confirmar 100%.

Tiempo invertido: ~1 min en escribir prompt + ~40s espera de respuesta. ROI: evitás 1-2 iter de debug en producción.

### Aplicaciones futuras

- Recomendador de monturas IA (tool use + vision + structured output).
- Asistente conversacional RAG (streaming + tool use + caching).
- Generador de descripciones de producto (caching + thinking + structured output).

---

## 2026-05-30 — Para decisiones estéticas, PEDIR referencias visuales del founder antes de proponer opciones

**Categoría**: Founder collaboration / Design discovery
**Confianza**: 🟢 Alta (validado iter pivot hero editorial dark)

### Qué funcionó

Cuando founder pasó 7 imágenes de referencia (Vulk Ember/DANV series), el target visual quedó CRISTALINO: editorial dark fashion magazine. Inmediatamente pude proponer 3 conceptos ALINEADOS con esa estética (todos con fondo dark, todos con mood premium, todos con tipografía display).

Comparado con turnos previos donde propuse 3 opciones (A/B/C) sin referencias → 2 iteraciones desperdiciadas (carrusel + mix-blend) porque mis opciones estaban en mundo visual distinto.

### Por qué funciona

Palabras como "moderno", "lindo", "copado", "premium" son ambiguas — cada cabeza visualiza algo distinto. Ejemplo "moderno":
- Stripe/Linear: minimal claro
- Acne Studios: editorial dark
- Glossier: pastel femenino soft
- IKEA: clean nórdico
- Off-White: maximalist street

Todos son "modernos" pero opuestos. Pedir referencias = ver con los ojos del founder.

### Cómo aplicar

Cuando founder dice "modernizar X" o pide opciones estéticas:
1. ANTES de proponer: "¿tenés 2-3 sites/marcas que te gusten estéticamente? pasame referencias".
2. Si dice "no tengo" o "no sé": ofrecer 3-4 ejemplos opuestos (minimal / editorial / playful / brutalist) y pedir "cuál te suena más" — eso ya calibra.
3. Recién después proponer opciones DENTRO del mismo mundo visual.

### Costo si se ignora

Iteraciones desperdiciadas construyendo en dirección equivocada (carrusel iter previo = 30+ min de trabajo + commit + deploy + founder testeo + rechazo).

### Cross-link

Mismo nucleo que [[founder-no-tecnico-pedi-verificacion-empirica]]: cuando hay ambigüedad, calibrar con evidencia. Ahí eran mediciones (% pixels oscuros), acá son referencias visuales.

---

## 2026-05-30 — Para upgrade incremental UI (C2 tipográfico → C1 split con foto): implementar el código ANTES de tener el asset

**Categoría**: Workflow / Founder collaboration / Decoupling
**Confianza**: 🟢 Alta (validado iter hero C2→C1)

### Qué funcionó

Founder dijo "tengo fotos" + las subió + pusheó. Yo verifiqué que la foto no estaba accesible (HTTP 400 en path canónico). En vez de bloquearme esperando que founder resuelva el upload, implementé el código del upgrade C1 (split layout) APUNTANDO al path canónico esperado.

Cuando founder confirme el path real, cambio 1 constante (`HERO_EDITORIAL_PATH`) y queda. No tengo que armar layout + esperar respuesta + después implementar.

### Por qué funciona

Hay 2 trabajos independientes:
1. **Asset disponible en bucket** (founder)
2. **Código que consume ese asset** (yo)

Acoplarlos serialmente ("primero confirma la URL, después implemento") agrega round-trip de 1-2 mensajes. Desacoplarlos ("yo implemento con path canónico, vos confirmás cuál es") elimina el round-trip si el path coincide. Si difiere, 1 línea de cambio.

Pre-condición: definir convención de path canónico ANTES (en este caso `brands-shared/hero-editorial.jpg`, mismo bucket que kit Vulk + category-sol).

### Cómo aplicar

Para upgrades UI que dependen de assets nuevos:
1. Definir convención de path canónico (bucket + nombre).
2. Avisar al founder la convención exacta.
3. Implementar código con ese path canónico.
4. Si founder usó otro path: ajustar 1 constante.

NO bloquear el código por "esperar a que founder confirme upload". Avanzar en paralelo.

### Costo si se ignora

Round-trip extra de 1-2 mensajes founder ↔ yo. Si la sesión va a cerrar antes del round-trip, el feature queda incompleto.

### Cross-link

Aplicación del pattern [[separation-of-concerns]] (turno previo `e1e8b0c`): display label vs sync key son responsabilidades distintas. Acá: código vs asset son trabajos distintos. Misma idea — desacoplar lo desacoplable.

---

## 2026-05-30 — `mix-blend-multiply` como workaround para fotos JPG con fondo blanco sobre fondos no-blancos

**Categoría**: CSS / Visual / Workaround
**Confianza**: 🟡 Media (validado iter hero carrusel — pendiente confirmar founder)

### Qué funcionó

Founder reportó que las fotos del catálogo (JPG con fondo blanco) se ven como "cuadrados pegados" cuando aparecen sobre un fondo decorativo (gradient + glow del hero). Solución definitiva: PNG transparente. Workaround quick: `mix-blend-mode: multiply` en CSS.

```tsx
<Image className="object-contain mix-blend-multiply" />
```

El blanco puro (255,255,255) multiplicado con cualquier color = el color original. Resultado: el blanco "desaparece" sobre el fondo. Funciona sin tocar las fotos.

### Por qué funciona

CSS blend mode `multiply`: para cada píxel, multiplica los valores RGB de la capa con los del fondo subyacente.
- White (1.0, 1.0, 1.0) × cualquier color = ese color → blanco se vuelve transparente.
- Negro (0,0,0) × cualquier color = negro → se preserva.
- Colores intermedios se "tintan" levemente con el fondo.

### Cómo aplicar

Para fotos JPG con fondo blanco que necesitan integrarse sobre fondos decorativos:
1. Confirmar que el contenido del producto NO tiene blancos puros significativos (sino se vuelven transparentes también).
2. Confirmar que el fondo subyacente NO es blanco puro (sobre blanco, multiply no hace nada).
3. Aplicar `mix-blend-multiply` a la `<Image>`.
4. Considerar remover drop-shadow (multiplica con el fondo y se ve distinto).

### Tradeoffs

- ✅ 1 línea de CSS, no toca fotos
- ✅ Funciona on-the-fly con fotos legacy
- ⚠️ Colores muy claros del producto se tintan con el fondo (sutilmente)
- ⚠️ No funciona sobre fondos blancos puros (el blanco no se va)
- ⚠️ Drop-shadow se ve degradado

### Costo si se ignora

Tener que esperar a tener todas las fotos en PNG transparente para empezar a usar fondos decorativos. Workaround permite avanzar.

### Cross-link

Solución definitiva: PNG transparente (founder edita fotos). Cuando estén, remover `mix-blend-multiply` — restablece colores 100% fieles.

---

## 2026-05-30 — Display labels (frame_color) separados del sync key (mercadolibre_variation_code): rename UI sin afectar integración externa

**Categoría**: Architecture / Separation of concerns
**Confianza**: 🟢 Alta (validado iter Vulk Stray rename variantes)

### Qué funcionó

Founder pidió renombrar 2 variantes Vulk Stray (display label) preguntando si afecta sync ML. Respuesta: NO, porque la arquitectura separa 2 conceptos en campos distintos:

- **Display label**: `attributes.frame_color` (string como "negro-brillo"). UI lo lee + lo mapea a label legible.
- **External integration key**: `mercadolibre_variation_code` (variation ID literal de ML, ej. "184005783781"). Sync matchea con esto via `getAllVariationCodes()`.

Cambiar `frame_color` solo afecta UI. `mercadolibre_variation_code` queda intacto → sync ML sigue funcionando idéntico.

### Por qué funciona

Separation of concerns: lo que el cliente VE (display) vs lo que el sistema EXTERNO entiende (sync key) son responsabilidades distintas. Acoplarlos en un solo campo crea problemas:
- Renombrar para UX rompe sync externo.
- Cambiar nombre por marketing requiere migration.
- Conventions diferentes entre sistemas chocan (ML usa IDs numéricos, UI usa strings legibles).

### Cómo aplicar

Para cualquier campo que cruce 2+ sistemas/audiences:
1. Identificar qué consume cada audience (UI, sync external, search, comparator).
2. Si las conventions difieren, USAR CAMPOS SEPARADOS aunque parezca redundante.
3. Mapper en runtime traduce entre campos cuando se necesita unificación visual.

### Costo si se ignora

Acoplar display + sync key obliga a (a) display feo (mostrar variation_id al usuario) → mala UX, o (b) sync roto cada vez que se renombra para UI → bugs silenciosos.

### Cross-link

Aplicación práctica del pattern [[parser-cross-system-multiples-formatos]]: separar display variable del key sync estable es prerequisito para que el match sync funcione bien.

---

## 2026-05-30 — Cargar producto en 2 fases (seed base + seed complete) cuando founder pasa info en chunks

**Categoría**: Workflow / Founder collaboration
**Confianza**: 🟢 Alta (validado iter Vulk Stray)

### Qué funcionó

Founder pasó info parcial inicial (4 SKUs + link ML). Generé seed 20 con esa data + auto-extracción ML. Después founder pasó info adicional (5ta variante CRY + measurements + materials + bisagras flex). Generé seed 21 "complete" con UPDATE producto + INSERT 5ta variante + 2 imágenes nuevas.

Pattern: seed base + seed complementario en lugar de esperar info completa antes de empezar. Founder no bloqueado por preguntas, dev no bloqueado esperando data, sistema avanza incremental.

### Por qué funciona

Founders no-técnicos rara vez tienen TODA la info perfecta de un producto en la primera pasada. Si esperás "completitud" antes de cargar, frenás iteraciones. Si cargás iterativo (lo que hay → ajustes posteriores), avanzás más rápido.

Costo: 2 seeds en vez de 1. Beneficio: founder feedback más temprano + corrección antes de aplicar al cloud.

### Cómo aplicar

Cuando founder pasa info de producto nuevo:
1. **Seed base**: cargar lo que tenés (auto-extract ML + SKUs explícitos del founder).
2. Mensaje al founder: lista clara de pendientes (data faltante, decisiones pendientes, fotos).
3. **Seed complete** (cuando founder responde): UPDATE producto con nueva info + INSERT variantes nuevas + fotos.
4. Aplicar al cloud en orden (base → complete).
5. Documentar en `CLOUD_APPLIED.md` la dependencia.

### Trade-off

Más seeds = más archivos = más overhead organizacional. Pero el alternativo (esperar info completa) suele tomar días en flow founder no-técnico. Compromise: 2 seeds vale la pena.

### Cross-link

Aplicación de [[founder-iteracion-vs-perfeccion]] — pattern relacionado con grids de scale empíricos (iter 14): mejor iterar rápido que perfeccionar antes.

---

## 2026-05-30 — Producto en ML con feature opcional que NO se vende: omitir en description, no mencionar feature ausente

**Categoría**: Content / Conversion / Product positioning
**Confianza**: 🟢 Alta (validado iter Vulk Stray armazón receta)

### Qué funcionó

Vulk Stray viene en ML con filtro luz azul incluido ("Filtro Luz Azul Gamer" en el title). Founder explícito: en NUESTRA web vendemos solo el armazón — las lentes son aparte. Pero queremos vender el armazón a quien quiera lentes graduadas comunes O lentes azules O lo que sea.

Decisión: NO mencionar "blue block" / "luz azul" en la description. Hablar del armazón en general. Cliente decide qué lente quiere en consulta post-compra.

### Por qué funciona

Si en la description decís "incluye filtro luz azul" y NO lo incluimos → engaño. Mal.
Si decís "viene SIN filtro luz azul" → posicionás el producto como inferior al de ML → menos conversión.
Si NO mencionás → cliente que busca azul te consulta y le ofrecés el agregado. Cliente que busca lentes comunes lo compra sin objeción.

**Regla de copy**: no mencionar features ausentes opcionales. Solo mencionar lo que sí incluye + lo que requiere acción explícita del cliente ("las lentes se cargan aparte").

### Cómo aplicar

Cuando un producto en ML tiene features opcionales que NO incluimos en la web:
1. En description: NO mencionar el feature ausente.
2. Mencionar SOLO lo que SÍ incluimos.
3. Si requiere acción del cliente (ej. cargar lentes aparte): hacerlo explícito en una línea dedicada ("IMPORTANTE: ..."), pero NEUTRAL — no usar lenguaje negativo.
4. Asesoramiento post-compra como upsell natural ("consultanos sobre el tipo de lente").

### Costo si se ignora

Mencionar "no incluye X" daña conversión (~5-15% según estudios e-commerce). Mejor omitir + ofrecer asesoramiento que liste opciones (incluye X premium si querés).

### Cross-link

Aplicación de [[description-vs-variant-selector-single-source]] — single source of truth: el armazón se vende como armazón. Lentes son producto/servicio separado.

---

## 2026-05-30 — Reusar bucket existente (brands-shared) para assets transversales en vez de crear bucket por dominio

**Categoría**: Architecture / Storage organization
**Confianza**: 🟢 Media-Alta (aplicado iter categoría imagen — para 2 assets no vale bucket nuevo)

### Qué funcionó

Founder pidió imagen para card de categoría "Anteojos de sol" en home. Default arquitectónico sería crear bucket `categories-shared` separado. En cambio, reusé el bucket `brands-shared` que ya existe (creado iter previo para kit Vulk) y subí `category-sol.jpg` ahí.

### Por qué funciona

Cuando tenés un asset NUEVO de un dominio NUEVO (categorías, brands, hero pages, etc.) con pocos archivos (1-3), el costo de crear bucket separado supera al beneficio organizacional:
- 1 migration para crear bucket
- 1 policy de read pública
- 1 docs update
- Más cosas que verificar al deployar

Vs reusar bucket existente: 0 cosas adicionales. Solo subir el archivo.

Cuando el dominio crece (5+ assets), refactorizar a bucket dedicado vale (separación de concerns, policies distintas, lifecycle distinto).

### Cómo aplicar

Para asset transversal/compartido (no de producto/variante):
1. Si el dominio tiene 1-3 assets: bucket compartido existente (`brands-shared` o equivalente). Convención de naming claro: `category-sol.jpg`, `hero-homepage.jpg`, `team-photo.jpg`.
2. Si el dominio crece a 5+ assets: refactorizar a bucket dedicado.
3. Migrar es trivial: `UPDATE table SET path = REPLACE(path, 'old-bucket/', 'new-bucket/')`.

### Trade-off

Naming convention compartida puede colisionar (ej. `category-sol.jpg` vs `vulk-estuche-franela.jpg` en el mismo bucket — coexisten OK). Si va a haber 20+ assets de tipos distintos, la organización se vuelve confusa → refactor a buckets dedicados.

### Cross-link

Aplicación de [[costo-recurrente-vs-upfront]] — bucket dedicado tiene costo upfront alto + bajo recurrente, bucket compartido al revés. Para N=2-3 assets, compartido gana.

---

## 2026-05-30 — Para listas de "incluye/contiene" en comparador: garantizar base universal con `Set` hardcoded antes de mergear con DB

**Categoría**: Code / Data integrity / UX
**Confianza**: 🟢 Alta (validado iter Incluye comparador)

### Qué funcionó

Founder pidió que el comparador muestre "lo que viene en la caja" por modelo. Universal: estuche + franela + garantía. Específicos por modelo: par lentes amarillas (Rusty Yau), adaptador receta (Rusty Yau).

Implementación: usar `Set<string>` inicializado con la base universal (`['estuche', 'franela']`) y AGREGAR los items específicos del seed. Set garantiza:
1. Estuche + franela SIEMPRE aparecen (aunque el seed los omita por error).
2. Orden estable (base universal primero, después específicos).
3. Sin duplicados (si seed también incluye "estuche", no se duplica).

```ts
const items = new Set<string>(['estuche', 'franela']);
for (const item of fromSeed) {
  if (typeof item === 'string') items.add(item);
}
```

### Por qué funciona

Algunas cosas son "obligación de marca" — siempre van con el producto. Otras son específicas del modelo. Si dependés 100% del seed para la lista completa, un seed mal cargado puede mostrar "Incluye: nada" — visualmente confuso + asusta al cliente.

`Set` con base hardcoded es un "default sane" que protege contra errores de carga.

### Cómo aplicar

Para cualquier lista en UI que tenga (a) items garantizados por convención de negocio y (b) items específicos cargados por seed:
1. Inicializar `Set` con los items garantizados (orden importa = primeros en el Set).
2. For-loop sobre items del seed → `items.add()`.
3. Convertir a array preservando orden: `[...items]`.

NO usar `[...defaults, ...fromSeed].filter(unique)` porque pierde orden estable y es más complejo de leer.

### Costo si se ignora

Caso de error: seed cargado sin `attributes.includes` → UI muestra "Incluye: (vacío)" o "—" → cliente piensa que no viene con nada → reclamo / no compra. Diferencia entre clean code y caos.

### Cross-link

Aplicación de "defensive defaults" — pattern relacionado con [[priceToCents-tolerante-undefined]] (función defensive ante input null/missing).

---

## 2026-05-30 — Cuando founder reporta "no funciona" tras un fix: verificar HTML servidor con curl ANTES de seguir debuggeando

**Categoría**: Debugging / Validation
**Confianza**: 🟢 Alta (validado iter sync precio Yamain)

### Qué funcionó

Tras commit de fix sync precio + founder reportar "sigue sin tirar precio correcto", mi primer instinto era debuggear más el sync. En vez de eso, hice `curl HTML producción | grep precio`. Resultado: HTML servidor YA decía $79.800 (precio nuevo). El sync funcionó completo. El founder veía $79.832 por browser cache.

Sin esa verificación de 30 segundos, habría perdido turno(s) buscando bugs inexistentes.

### Por qué funciona

"Founder reporta X" tiene 3 capas posibles:
1. **Servidor**: state real (DB + HTML rendered)
2. **CDN edge**: cache intermedio (Vercel, Cloudflare)
3. **Browser**: cache local del navegador del founder

El bug puede estar en cualquiera de las 3 — o en ninguna (sería cache desactualizado). `curl HTML producción` salta directo a chequear capa 1 sin browser cache. Si servidor está bien, el problema es cache (no bug).

### Cómo aplicar

Cuando founder reporta "no funciona" tras un fix recién deployado:
1. **Antes de debuggear**: `curl <url> | grep <expected-value>`.
2. Si servidor tiene el valor correcto → es cache. Pedir hard refresh / incógnito.
3. Si servidor NO tiene el valor → es bug. Debugear.

Costo: 30 segundos. Beneficio: descarta el 30-50% de "reportes de bug" que en realidad son cache.

### Cross-link

Aplicación del pattern [[verificacion-post-deploy-curl]] — mismo nucleo: trust servidor > browser. Útil después de CUALQUIER cambio deployado.

---

## 2026-05-30 — Parser cross-system: devolver TODOS los formatos posibles, no 1 priorizado

**Categoría**: Code / Defensive parsing / Refactor pattern
**Confianza**: 🟢 Alta (validado tras fix fallido del bug Yamain → refactor)

### Qué funcionó

Refactor de `getVariationCode(v): string` (devuelve 1 formato priorizado) a `getAllVariationCodes(v): string[]` + `variationMatches(v, dbCode): boolean`.

Antes: el parser devolvía 1 código → cascada de formatos con orden de prioridad. Problema: cuando un formato superior devolvía un valor VÁLIDO PERO NO DISCRIMINADOR (ej. DESIGN="Ovalado" para todas las variations), cortocircuitaba el fallback al formato más confiable (ID literal).

Después: el parser devuelve TODOS los códigos posibles. El match es OR lógico (¿dbCode coincide con cualquiera?). Sin orden de prioridad.

### Por qué funciona

Cuando un sistema externo no garantiza qué formato del código vas a recibir (depende de cómo el seller cargó el item, qué API endpoint, etc.), la priorización es contraproducente:
- Formato A satisface pero no discrimina → match falla (false negative)
- Formato B (ID literal) garantiza discriminación pero nunca se prueba

Devolver TODOS los formatos + match OR garantiza que UNO funcione, sin asumir qué formato es "el preferido".

### Cómo aplicar

Para parser que devuelve ID/código de algo cross-system (ML, MP, AFIP, etc.):
1. Listar TODOS los lugares donde el sistema externo guarda el ID/código.
2. Si más de 1 puede aplicar simultáneamente: devolver `string[]` con todos, no `string` priorizado.
3. Match con DB: helper `matches(record, dbCode): boolean` que prueba TODOS los formatos.
4. Type signature explícito: la función promete devolver "los posibles formatos", no "el formato".

### Costo si se ignora

Bug silencioso tipo "el código que devuelve la función es válido pero no es el que está en DB". El parser parece funcionar pero match falla en cases reales.

### Cross-link

Refinamiento de [[parser-fallback-final]] (learning previo iter Yamain). Aquel learning agregó variation.id como fallback. Este lo MEJORA: fallback no basta cuando un formato anterior cortocircuita.

---

## 2026-05-30 — Dentro del mismo producto, las fotos lateral/frontal pueden necesitar scales DISTINTOS

**Categoría**: Visual tuning / Photo composition
**Confianza**: 🟢 Alta (validado iter Rusty Yau — refina learning previo Yamain)

### Qué funcionó

Iter Yamain: "6 fotos uniformes → 1 sola scale uniforme". Iter Rusty Yau: la realidad es más matizada — las 6 fotos están en mismo tamaño/aspect (848×537) PERO el anteojo ocupa distinto % del frame según TIPO de foto:
- Laterales (3): anteojo a 52% W (vista 3/4 con patillas extendidas en perspectiva)
- Frontales (3): anteojo a 70% W (vista directa, frame más ancho)

Aplicar 1 scale uniforme → o las laterales quedan chicas, o las frontales quedan recortadas. **Solución**: 2 scales — `1.5` para laterales, `1.2` para frontales.

### Por qué funciona

La perspectiva del producto cambia su footprint visual. Un anteojo en vista 3/4:
- Patillas extendidas hacia atrás (no aportan visualmente al "tamaño percibido" del frente del anteojo)
- Frente comprimido por perspectiva diagonal

Vs vista frontal:
- Frente completo ocupa todo el ancho horizontal
- Patillas no son visibles (escondidas detrás)

Resultado: misma altura de anteojo, distinto width visible. Los scales tienen que compensar.

### Cómo aplicar

Cuando midas fotos de un producto nuevo:
1. Agrupar por TIPO de foto (lateral / frontal / modelo / medidas).
2. Calcular bbox por grupo, NO promediar todas.
3. Si los grupos difieren > 10%: scales distintos por grupo.
4. Si difieren < 10%: scale uniforme.

### Refinamiento del learning previo

El learning "medir uniformidad antes de aplicar scales per-foto" (iter Yamain) sigue válido. PERO la "uniformidad" debe medirse POR GRUPO de fotos similares (lateral / frontal / etc.), no por todo el set del producto.

### Cross-link

Refinamiento de [[medir-uniformidad-antes-de-scales-yamain]].

---

## 2026-05-30 — Funciones que parsean IDs externos: agregar `variation.id` (o equivalente) como fallback final

**Categoría**: Code / Defensive parsing
**Confianza**: 🟢 Alta (validado iter Yamain bug sync)

### Qué funcionó

`getVariationCode(v)` originalmente parseaba 2 formatos posibles del código de variation ML (seller_custom_field o DESIGN value_name). Si ambos eran null, retornaba null → matched = undefined → sync silenciosamente skip.

Fix: agregar `String(v.id)` como **fallback final**. La función ahora siempre devuelve algo. El seed puede cargar el formato que tenga disponible (string seller, DESIGN parse, o el ID literal numérico) y la función lo va a matchear con lo que ML mande.

### Por qué funciona

Cuando una función parsea IDs externos que pueden venir en N formatos distintos (porque el sistema downstream tiene conventions distintas), el approach defensivo es:
1. Intentar formato A (más específico).
2. Intentar formato B.
3. Caer al ID interno garantizado del sistema externo (el variation.id en este caso, que SIEMPRE existe).

Esto permite cargar data desde múltiples fuentes (sellers con convention, sellers sin convention) sin romper el sync.

### Cómo aplicar

Cuando escribís parser de IDs cross-system:
1. Listar los formatos posibles.
2. Identificar el ID/key garantizado del sistema (el que SIEMPRE viene).
3. Implementar fallback en cascada: formato preferido → alternativos → ID garantizado.
4. Type signature: devolver `string` (no `string | null`) si el ID garantizado existe.
5. Documentar la convención al cargar data: "podés usar A, B o C — la función va a matchear cualquiera".

### Costo si se ignora

Bug silencioso: la función devuelve null, el caller no lo loggeaa explícitamente, el sync no procesa ese item. Bug invisible hasta que un usuario reporta "el precio/stock no sincroniza".

### Cross-link

Aplicación del pattern "always provide fallback" — relacionado con [[priceToCents-tolerante-undefined]] (priceToCents devuelve null pero el caller lo verifica explícito).

---

## 2026-05-30 — Para N fotos del mismo producto/modelo: medir uniformidad ANTES de calcular scales per-foto

**Categoría**: Workflow / Measurement-first
**Confianza**: 🟢 Alta (validado iter Yamain — 6 fotos uniformes → 1 scale, no 6)

### Qué funcionó

Founder eligió "agregar overrides Yamain". En vez de asumir per-foto, primero medí las 6 fotos con script Python:
- Todas 900×442 (aspect 2.04:1)
- Anteojo bbox: ~82% W × 75% H — consistentes entre sí

Conclusión: una sola scale (1.15) funciona para las 6. Sin medición previa, habría calculado 6 scales individuales y agregado 6 entries con valores muy similares = noise.

### Por qué funciona

Cuando un proveedor (fabricante / fuente) tiene una convención interna de fotos, sus N fotos tienden a ser uniformes entre sí. Distintas a las de OTRO proveedor, pero internamente consistentes.

Si confirmás uniformidad con medición empírica (5 min de script Python), evitás:
- 6 entries en `image-scale-overrides.ts` con valores cuasi-idénticos.
- Iteraciones futuras tipo "ajustar foto X +0.02" cuando todas se ven igual.
- Falsa percepción de que el problema requiere fine-tuning quirúrgico.

### Cómo aplicar

Antes de aplicar scale overrides per-foto a un producto nuevo:
1. `curl` + bajar las N fotos del bucket.
2. Script Python (mismo template de iter Yamain): print dimensiones + bbox anteojo de cada foto.
3. Si W/H/aspect/bbox son uniformes (diferencias <5%): 1 scale para todas.
4. Si son inconsistentes: scale per-foto.

Trade-off: la medición empírica toma 5 min. Si saltás el paso, podrías agregar 6 entries idénticas innecesariamente (no es bug, pero es noise).

### Cross-link

Aplicación del pattern de "medición empírica antes que teoría" — mismo nucleo que [[founder-no-tecnico-no-tiene-sentido]] (iter 11 medición de fotos refutó diagnóstico padding).

---

## 2026-05-30 — Cuando agregás feature visual a un dominio (ej. scale CSS de imágenes), grep TODOS los lugares que renderizan ese dominio

**Categoría**: Code consistency / Feature surface area
**Confianza**: 🟢 Alta (2+ casos esta sesión donde se olvidó alguna arista)

### Qué funcionó

Tras founder reportar "imágenes inconsistentes en comparador", encontré que `getImageScale` (image-scale-overrides) NO se estaba aplicando en `compare-table.tsx`, `compare-bar.tsx`, ni `compare-bar-search.tsx`. Solo lo tenía ProductCard + ProductGallery. Fix: `grep -rn "getProductImageUrl" components/` para encontrar TODOS los lugares que renderizan imágenes de producto. Agregar `getImageScale` a cada uno.

### Por qué funciona

Cuando una decisión arquitectónica afecta UN DOMINIO (ej. "todas las imágenes de producto deben tener scale custom per-foto"), hay N componentes que renderizan ese dominio:
- Cards de catálogo
- Galería PDP
- Thumbnails (variantes, comparador, recently viewed, wishlist, search)
- Quick view modal
- Comparador (tabla + bar + search dropdown)
- Recomendador IA (grid de productos)

Si solo aplicás el feature al primer caso visible, los demás quedan desincronizados. Founder eventualmente los encuentra → fix incremental → 5 turnos perdidos.

### Cómo aplicar

Cuando agregás un feature que afecta cómo se RENDERIZA un dominio:
1. `grep -rn "getProductImageUrl\|productImagePath\|product\.images" components/ app/` para mapear surface area.
2. Hacer una pasada por TODOS los results aplicando el feature.
3. Si hay 10+ lugares, considerar wrappear en componente `<ProductImage>` que centraliza la lógica.

### Trigger fuerte

Si agregás algo a ProductCard/ProductGallery, preguntate: ¿esto debería aplicar también a thumbs de comparador/wishlist/recientes/search/recomendador? Lista completa de lugares: `compare-{bar,table,bar-search}`, `wishlist-{badge,page}`, `recently-viewed`, `recommended-products-grid`, `variant-list`.

### Costo si se ignora

Acumulación de bugs visuales reportados uno por uno por el founder. Cada uno toma 5-10 min mío para fixear, pero la suma desgasta.

### Cross-link

Pattern recurrente con [[extender-funcion-sin-aristas-iter-debug-endpoint]] (sync price extended sin tocar admin debug endpoint). Mismo nucleo: "extender feature en un lugar sin propagar a las aristas que dependen del feature".

---

## 2026-05-30 — Endpoint admin con pre/post state + diagnosis_hints destraba debug remoto cuando sync falla

**Categoría**: Debugging / Admin tooling
**Confianza**: 🟢 Alta (validado iter sync precio debug)

### Qué funcionó

Founder reportó: "cambié precio en ML, web no actualizó". Sin acceso directo a la DB, normalmente sería 5+ rondas de Q&A. El endpoint `/api/admin/ml-force-sync/[mlItemId]` ya tenía 3 cosas que ahorraron tiempo:
1. **Estado pre-sync**: SELECT de DB antes del sync.
2. **Trigger del sync**: ejecuta `syncStockFromMLItem` y captura el resultado.
3. **Estado post-sync**: SELECT de DB después del sync.
4. **`recent_webhooks`**: últimos 5 webhooks recibidos para ese MLA.
5. **`diagnosis_hints`**: texto humano que interpreta los resultados ("Sí, llegaron N webhooks. Mirá status si están ignored o failed").

Con 1 sola curl al endpoint, el founder me pasa el JSON y veo:
- Si el webhook llegó (descarta problema de configuración ML)
- Si el sync detectó cambio (descarta problema de matching)
- Cuál era el estado pre y post (identifica si update funcionó)

### Por qué funciona

Para integraciones con servicios externos (ML, MP, Resend, etc.), el debugging tradicional requiere acceso a DB + logs + servicio externo. Si el founder no puede dar acceso o el dev no tiene ambiente local, el ciclo de debug es ~10x más lento.

Un endpoint admin que **expone estado relevante en pre/post + interpreta el resultado** convierte el debug en "1 curl → 1 JSON → diagnosticar". El `diagnosis_hints` campo es clave: el founder NO necesita entender el JSON crudo, solo leer la interpretación.

### Cómo aplicar

Para cualquier integración externa con sync (stock, price, status, etc.):
1. Crear endpoint admin `/api/admin/<feature>-debug/[id]` o `/api/admin/<feature>-force-sync/[id]`.
2. Incluir SIEMPRE: estado pre / acción / estado post / logs recientes / diagnosis_hints humano.
3. SELECT debe incluir TODOS los campos que la integración pueda actualizar (no solo stock — también price, status, attributes que el sync toque).
4. Cuando agregás un nuevo campo al sync, agregalo al SELECT del endpoint debug también.

### Costo si se ignora

Sin endpoint debug: cada bug reportado requiere acceso DB founder → Q&A → hipótesis → más Q&A → fix. 5-10 turnos.
Con endpoint debug: founder ejecuta 1 curl, me pasa JSON, 1-2 turnos.

### Cross-link

Pattern relacionado con [[verificacion-post-deploy-curl]] — ambos hacen DEBUGGING accesible vía herramienta simple (curl).

---

## 2026-05-30 — Extender función de sync existente vs crear nueva: pesa más si los callers ya están establecidos

**Categoría**: Architecture / Code reuse
**Confianza**: 🟢 Alta (validado iter sync precio ML)

### Qué funcionó

Founder pidió sync de precio ML→sitio. Dos approaches:
- **A**: Crear `syncPriceFromMLItem()` separado, llamar a ambos desde webhook + cron + force-sync.
- **B**: Extender `syncStockFromMLItem()` para que también sincronice precio (mantener nombre por compat, ampliar comportamiento documentado en comment).

Elegí B. Resultado: 1 archivo modificado (sync-stock.ts), 0 callers tocados. Webhook + cron + force-sync admin automáticamente ganan sync de precio sin saber que el feature cambió.

### Por qué funciona

Cuando una función YA tiene N callers integrados (webhook, cron, endpoint admin), el costo de "ampliar comportamiento" es 0 para los callers. El costo de "función separada paralela" es N × wiring + posibilidad de que algún caller olvide invocar la nueva (gap en feature coverage).

La función fetcheaba el item ML una vez para stock — ese mismo fetch ya trae el price gratis. Extender es 0 fetches adicionales.

Trade-off: el nombre de la función (`syncStockFromMLItem`) ahora es engañoso (también syncs price). Mitigación: comment explícito al inicio. Si en el futuro se vuelve confuso, rename con backward-compat alias.

### Cómo aplicar

Para extender un feature en código que YA tiene callers:
1. Listar callers (`grep`).
2. Si los callers son TODOS lugares donde el feature nuevo también aplica → **extender la función existente**.
3. Si algunos callers NO deben tener el feature nuevo → **crear función separada** o agregar parámetro opt-in.
4. SIEMPRE actualizar el comment de la función para reflejar el nuevo comportamiento.

### Costo si se ignora

Crear funciones paralelas innecesarias = wiring redundante + risk de feature drift (un caller usa una versión, otro usa otra).

---

## 2026-05-30 — `overflow-x-auto` también recorta vertical (limitación CSS). Para badges/X que sobresalen: padding interno al container

**Categoría**: CSS / Layout
**Confianza**: 🟢 Alta (validado iter CompareBar)

### Qué funcionó

Botón X de remove en CompareBar tenía `absolute -right-1.5 -top-1.5` (sobresale del `<li>` thumb). Pero el `<ul>` padre tenía `overflow-x-auto` para permitir scroll horizontal. Resultado: la X se cortaba arriba (overflow recorta también vertical).

Fix: agregar `px-1.5 py-2` al `<ul>`. El padding interno expande el área visible dentro del overflow, dejando espacio para que los botones con offsets negativos (-top-1.5 = -6px) caigan dentro del área renderizada.

### Por qué funciona

Limitación CSS conocida: `overflow-x: auto` + `overflow-y: visible` NO es soportado. El browser auto-convierte a `overflow: auto` (ambos). Si necesitás scroll horizontal pero contenido que sobresale vertical, las opciones son:
1. **Padding interno**: agregar padding al container = espacio visible que NO se corta. Funciona para offsets pequeños (-1.5 = -6px, padding y-2 = 8px ✓).
2. **Wrapper externo**: poner el scroll en un wrapper externo, contenido sobresalido en hijo. Más complejo.
3. **Reposicionar la X**: ponerla DENTRO del thumb sin offset negativo. Cambia el design.

Opción 1 (padding interno) preserva el design existente con cambio mínimo.

### Cómo aplicar

Cuando un overflow container recorta badges/X/decoraciones que tienen offsets negativos:
1. Calcular cuánto sobresale el elemento (en px o rem).
2. Agregar padding equivalente al container (`px-N py-N`).
3. Verificar que el scroll horizontal sigue funcionando.

### Costo si se ignora

Founder ve elementos visualmente cortados sin entender por qué. Reportes recurrentes de "ese botón se ve mal".

---

## 2026-05-30 — Para modals/overlays full-screen: createPortal hacia document.body para escapar stacking context

**Categoría**: React / CSS / Modals
**Confianza**: 🟢 Alta (validado tras 2 fixes fallidos del lightbox)

### Qué funcionó

Lightbox del PDP "transparente" al abrirse: se veían thumbnails y otros elementos del PDP detrás. Probé 2 fixes que NO funcionaron: (1) cambiar `bg-foreground/95` → `bg-black/98` + `backdrop-blur-xl`, (2) `bg-black/98` (más opaco). El issue persistía aunque visualmente la opacidad era 98%+.

Fix definitivo: **`createPortal(overlay, document.body)`**. Renderizar el overlay como child directo del `<body>` escapa cualquier stacking context creado por ancestors del PDP (Image fill, sticky positioning, transforms, etc.). Combinado con `bg-black` puro (100% opaque) y `z-[100]`.

### Por qué funciona

`z-index` es relativo al stacking context más cercano que lo crea. Si un ancestor tiene `position: relative` + `z-index: anything`, o `transform: anything`, o `filter: anything`, o `isolation: isolate` → crea nuevo stacking context. Tu `z-50` queda relativo a ese ancestor, NO al body. Elementos hermanos de ese ancestor (con z-index propio) pueden quedar arriba aunque el lightbox tenga z-50.

`createPortal(overlay, document.body)` mueve el DOM node del overlay a ser child directo del body. Su stacking context pasa a ser el root. `z-[100]` ahí sí garantiza estar arriba de TODO.

### Cómo aplicar

Para CUALQUIER overlay/modal full-screen (lightbox, dialog, toast, drawer):
1. Renderizar via `createPortal(jsx, document.body)`.
2. Wrappear con `useState + useEffect` para esperar `document.body` disponible (evita SSR mismatch).
3. Background: opaque puro (`bg-black`, `bg-white`), NO alpha con valores como `/95` o `/98`.
4. `z-[100]` o equivalente alto (overlay es siempre top).

### Trigger fuerte

Si un overlay con `z-50 fixed inset-0` "no cubre" elementos visualmente, NO bajarle más la opacidad. Sospechar stacking context → portal al body.

### Costo si se ignora

Iterar opacidad infinitamente sin resolver. Founder reporta el mismo bug múltiples veces.

### Cross-link

Pattern relacionado con [[shadcn-dialog]] que usa Portal internamente. Para overlays custom, replicar el mismo pattern.

---

## 2026-05-30 — Verificación post-deploy con curl + HTTP status detecta gap entre "founder dice aplicado" y "está funcionando"

**Categoría**: Verification / Trust but verify
**Confianza**: 🟢 Alta (validado múltiples veces en sesión: paths .png/.jpg, scale CSS, brand image)

### Qué funcionó

Founder confirmó "todo subido y aplicado" al final del día. En vez de tomarlo como certeza y cerrar, corrí 3 verificaciones con curl:
1. `curl https://opticacarballo.com.ar/anteojos-de-sol/vulk | grep vulk-yamain` → ✓ Vulk Yamain renderiza
2. `curl https://opticacarballo.com.ar/anteojos-de-sol/rusty/rusty-yau | grep rusty-yau/` → ✓ fotos MBLUE presentes
3. `curl -I https://tuddpfspnbnmafsqdvat.supabase.co/storage/.../brands-shared/vulk-estuche-franela.jpg` → ❌ HTTP 400

Detecté que la imagen brand-wide del kit Vulk NO está accesible en el path esperado, aunque founder dijo que la había subido. SIN esa verificación, el bug habría sido detectado solo cuando un cliente abriera la PDP y se preguntara por qué no aparece la imagen del kit.

### Por qué funciona

"Aplicado" puede significar 3 cosas distintas:
1. Founder hizo la acción (subir, aplicar SQL).
2. La acción se completó técnicamente sin error.
3. El resultado final es el esperado por el sistema downstream.

"Aplicado" del founder = 1 + 2 (lo que él controla). Verificación post-deploy = 3 (lo que el sistema espera). El gap entre 2 y 3 es donde viven los bugs sutiles: la imagen se subió OK pero a otro path; el SQL corrió OK pero apunta a un path que no existe; el código deployó OK pero el path no matchea (caso iter 14.4 png vs jpg).

### Cómo aplicar

Después de "founder aplicó cambios", verificar al menos:
1. **HTTP status de URLs críticas** (`curl -I` o `-o /dev/null -w "%{http_code}"`)
2. **Render del HTML producción** (`curl | grep <expected-string>`) para confirmar que el cambio llegó al rendered output
3. **Si el cambio es visual**: además del HTTP/HTML, hacer hard refresh en browser real o mirar screenshot

Costo: 30 segundos. Beneficio: detección inmediata de gaps que de otro modo aparecerían en producción para usuarios.

### Cross-link

Mismo pattern que [[validation-gap-iter-14.4]] (paths png/jpg) + [[validation-gap-iter-13.1]] (grid Python vs browser real). Estos 3 mistakes acumulados condensan a 1 regla: **NUNCA confiar en "aplicado/funciona" sin verificar el output final que el sistema espera**.

---

## 2026-05-30 — Mappers explícitos enum DB → label español para todo enum que toque UI

**Categoría**: i18n / Localization / DB-to-UI
**Confianza**: 🟢 Alta (validado iter post-Vulk Yamain — fix 2 del founder)

### Qué funcionó

Founder reportó "Anteojos de sol female" en el subtitle del PDP — el enum `attributes.gender` ('female'/'male'/'unisex') se renderizaba directo. Fix: helpers `genderToSpanish()` y `frameShapeToSpanish()` que mapean explícito enum → label legible. Resultado: "Anteojos de sol ovalados para mujer" (descriptivo + en español).

### Por qué funciona

Los enums en DB siguen convenciones en inglés (interoperabilidad con ML, código). Pero el sitio es español argentino (regla 9 de CLAUDE.md). Cuando un enum llega directo a UI sin mapeo, se filtra el inglés. Mappers centralizados:
1. Single source of truth: 1 lugar donde convierto cada valor.
2. Si cambia el label español, 1 lugar para tocar (no N templates).
3. Cubre casos: enum nuevo sin mapping → devuelve null o fallback, no crashea.

### Cómo aplicar

Para CUALQUIER enum (gender, frame_shape, frame_material, lens_treatment, status, etc.) que se renderice en UI:

1. Crear helper `<enum>ToSpanish(value: string | null): string | null` cerca del componente que lo consume (o en `lib/i18n/labels.ts` si se reutiliza).
2. Switch o Record<string, string> con los valores válidos del enum.
3. Default: return null o un fallback claro (NO devolver el enum en inglés).
4. UI consume: `const label = enumToSpanish(value) ?? 'Sin dato'` — explícito el caso vacío.

### Trigger fuerte

Si copy de UI muestra una palabra en inglés (`female`, `polarized`, `aviator`, `oval`, `xs`, `out_of_stock`), ALMOST seguro es un enum directo sin mapper. Buscar el helper o crearlo.

### Costo si se ignora

UI con palabras en inglés intercaladas en español argentino → poco profesional, daña confianza. Caso específico: "Anteojos de sol female" para mujer suena raro y founder lo cazó al instante.

### Cross-link

Mismo principio que `extractColorLabel()` ya existente en `to-product-card-data.ts` (mapea `attributes.color_frame` → label legible). Falta extender a todos los enums.

---

## 2026-05-30 — Para assets compartidos entre N entidades (productos de una marca, etc.), evaluar approach por costo recurrente, no solo upfront

**Categoría**: Architecture / Decision-making
**Confianza**: 🟡 Media (validado 1 vez en decision-point Vulk includes image)

### Qué funcionó

Founder preguntó cómo evitar duplicar la imagen del kit Vulk (estuche+franela+stickers) en cada producto. Le propuse 3 opciones (A: DB column brand-level / B: frontend hardcoded / C: INSERT per-seed) presentando claramente para cada una: **costo upfront** y **costo recurrente**. La tabla comparativa hizo que el tradeoff fuera obvio: B es el más rápido upfront pero el peor en recurrencia (cambio de imagen = deploy). A es el más caro upfront pero cero costo recurrente.

### Por qué funciona

Founders no-técnicos tienden a optar por la solución "más rápida ahora" si no se les muestra el costo recurrente. Una tabla con 2 columnas (upfront vs recurrente) hace explícito el tradeoff temporal: "5 min ahora + 30 min cada vez que agregás marca" vs "30 min ahora + 0 después".

### Cómo aplicar

Cuando hay decision-point arquitectónico con N opciones que difieren en cuánto trabajo automatizan:
1. NO presentar solo el costo de implementación (upfront).
2. Calcular costo recurrente: por cada producto nuevo / cambio futuro / migración futura, cuánto trabajo adicional.
3. Multiplicar por N esperado (¿cuántos productos Vulk va a haber? ¿20-50?).
4. Tabla 2 columnas: upfront / recurrente × N esperado.
5. Recomendar la que tenga menor costo TOTAL (upfront + recurrente × N).

### Costo si se ignora

Founder elige B (más rápida ahora). A los 10 productos cargados, cada cambio de imagen del kit es un PR + deploy. A los 6 meses se acumula deuda técnica que cuesta más refactorizar que la opción A inicial.

### Cross-link

Aplicación de [[no-acoplar-codigo-a-data-especifica]] (mistake recurrente: hardcoding genera deuda).

---

## 2026-05-30 — Description del producto = generalidades; variant selector = colores. Single source of truth

**Categoría**: Content / Information architecture
**Confianza**: 🟢 Alta (validado iter Vulk Yamain — founder corrigió directo)

### Qué funcionó

Al generar el seed 16 (Vulk Yamain) inicialmente puse en la `description` larga un párrafo enumerando los colores específicos de las 3 variantes (CRY, MBLK, SBLK). Founder corrigió: "hablar generalidades del producto sin hablar de colores y recordar que solo 1 variante es polarizada". Re-escribí description sin códigos. Los colores específicos se ven en el variant selector (chips + thumbnails de la card y PDP).

### Por qué funciona

Cada pieza de info debe tener **un solo lugar** donde se muestra:
- **Colores específicos** → variant selector (chips, thumbs, dropdown). Cambia visualmente al seleccionar.
- **Generalidades del producto** (estilo, material, uso, beneficios) → description larga.
- **Diferenciador entre variantes** (ej. "una versión es polarizada") → MENCIONAR genérico en description, NO listar SKUs.

Duplicar colores en description + variant selector causa:
1. Cuando se agregue/elimine una variante, hay que actualizar 2 lugares (riesgo de quedar desactualizado).
2. El copy queda repetitivo si el usuario ya está mirando los chips.
3. Si la description menciona "CRY transparente" pero el variant selector la llama "Cristal", el usuario se confunde.

### Cómo aplicar

Al redactar copy de producto:
1. Description larga: hablar del PRODUCTO (lo común entre variantes) — material, función, beneficios, recomendación de uso.
2. NO enumerar variantes por código. Si hay un diferenciador estructural (polarizada vs no), mencionarlo SIN nombrar código.
3. Variant selector: solo nombre legible del color (`Cristal`, `Negro mate`) + thumbnail.
4. Si tenés que listar variantes, hacelo en una sección dedicada (tabla comparativa) y en la PDP, NO en description.

### Costo si se ignora

Cuando se agreguen las 2 variantes marrones del Yamain (cuando el fabricante resuelva el problema de color), la description tendría que actualizarse SI mencionaba colores. Si no los menciona, no hay nada que tocar — solo agregar las variantes a la DB.

---

## 2026-05-30 — Usar `/api/admin/ml-import-preview/<itemId>` para auto-extraer datos al cargar variantes nuevas

**Categoría**: Workflow / Operational efficiency
**Confianza**: 🟢 Alta (validado iter cargar Rusty Yau variante MBLUE)

### Qué funcionó

Founder pidió cargar nueva variante del Rusty Yau pasando solo el link de ML (`MLAU3697527724?pdp_filters=item_id:MLA2707007110`). En vez de pedirle precio, stock, atributos, llamé al endpoint admin `/api/admin/ml-import-preview/MLA2707007110` con curl simple y obtuve TODO en JSON:
- price 103902 ARS → 10390200 centavos
- available_quantity: 3 (stock)
- Item ID, FRAME_COLOR, LENS_COLOR, LENS_TREATMENT, measurements, etc.

Genere el seed con datos confirmados sin ronda de Q&A con founder.

### Por qué funciona

El endpoint ya existe en el código (`app/api/admin/ml-import-preview/[itemId]/route.ts`) y devuelve el JSON crudo del item ML del seller autenticado. Para variantes que ya están en ML, eso elimina 3-5 preguntas al founder.

### Cómo aplicar

Cuando el founder pase un link de ML para cargar producto/variante nueva:
1. Extraer el `item_id` del link (formato `MLA\d+` en el query string o path).
2. `curl -sS "https://opticacarballo.com.ar/api/admin/ml-import-preview/<itemId>"`.
3. Parsear JSON: price (en pesos, no centavos — multiplicar por 100), available_quantity, attributes.
4. Generar seed sin pedir esos datos al founder.
5. Solo pedirle al founder lo que NO está en ML: fotos custom, callouts especiales, descripción larga adicional.

### Costo si se ignora

Por cada variante: 1-2 rondas extra de preguntas al founder (precio actual, stock, item ID exacto). Para catálogo de 30+ productos = 30+ interacciones evitables.

### Cross-link

Refuerza pattern [[ml-import-preview-endpoint]] documentado en seed 13 — usar el endpoint como standard al cargar productos/variantes desde ML.

---

## 2026-05-30 — Cuando founder dice "X es la mejor" de N opciones, anclar a X y ajustar las demás (iter 14.5)

**Categoría**: Visual tuning / Reference anchoring
**Confianza**: 🟢 Alta (validado en iter 14.5)

### Qué funcionó

Iter 14.5 el founder evaluó 4 variantes con feedback diferenciado: "1 más chica, 2 apenas grande, 3 muy grande, 4 es la mejor". Usé var 4 como **ancla de referencia** y calculé deltas para llevar las otras 3 a su tamaño visual percibido. Resultado: cambios direccionados, no random — var 1 sube, var 2 baja sutilmente, var 3 baja agresivo.

### Por qué funciona

Cuando hay N elementos a uniformar y el founder identifica UNO como "el bueno", ese se vuelve specification ground truth. Los ajustes a los otros tienen target claro (igualar a X visualmente), no abstracto ("hacerlos uniformes"). El delta de cada uno se deriva de cuán lejos están de la referencia.

Sin ancla → ajustes paralelos arbitrarios donde no se sabe a qué punto converger.

### Cómo aplicar

Cuando hay N elementos a uniformar:
1. Preguntar al founder: "¿cuál de las N es la que te gusta más?" (o esperar feedback diferenciado donde lo marque)
2. Tomar esa como ancla — NO ajustar.
3. Para cada una de las demás, ajustar en la dirección que la acerque visualmente al ancla.
4. Magnitud del ajuste depende de cuán "lejos" estén ("apenas grande" = ajuste pequeño; "muy grande" = ajuste fuerte).
5. Comunicar al founder los deltas esperados explícitamente: "var 3 va a bajar -21%".

### Costo si se ignora

Sin ancla: ajustes ciegos, founder y dev no convergen al mismo target. Cada iteración es 50/50 ("¿esto es lo que querías?"). Con ancla: dirección clara, convergencia rápida.

---

## 2026-05-30 — Para cambios de scale CSS visibles al ojo humano, el delta debe ser ≥10-15% (iter 14.2)

**Categoría**: Visual tuning / Perception thresholds
**Confianza**: 🟢 Alta (validado empíricamente — 7.6% invisible, 18.5% visible)

### Qué funcionó

En iter 14.1 bajé scale de 0.92 a 0.85 (~7.6% reducción) buscando ajuste "conservador" para no pasarme. Founder testeó: "es como que no afectó el cambio". Confirmó que el delta era invisible al ojo. En iter 14.2 bajé de 0.85 a 0.75 (~12% adicional, 18.5% acumulado vs iter 14 inicial). Ese delta sí se percibe visualmente.

### Por qué funciona

El ojo humano tiene umbral mínimo de percepción para cambios de tamaño. Para imágenes de producto a 200-300 px de ancho en una card, un cambio de 7-8% en scale CSS es del orden de 15-20 px — apenas perceptible salvo comparación directa pixel-perfect. Cambios ≥15% son del orden de 30-40 px, claramente visibles.

### Cómo aplicar

Cuando ajustás scale CSS por feedback de "se ve más grande/chica":
- **NO** intentar ajustes < 10% — el founder no va a notar diferencia y vas a perder 1 iteración
- **Default 15-20%** para primer ajuste si la dirección está clara
- **Iterar más finamente** (5-10%) SOLO cuando ya estás cerca del target y el founder dice "casi"
- Comunicar el delta esperado: "voy a bajar 18% — esto va a notarse claramente"

### Costo si se ignora

Cada iteración "muy sutil" cuesta: commit + push + deploy Vercel (~2 min) + founder testea (~2 min) + feedback (~1 min) = ~5 min perdidos por no haber sido más agresivo de entrada.

### Cross-link

Aplicación específica del pattern [[founder-no-tecnico-intuye]] — el founder valida con su ojo, no con números. Pensar en términos de percepción visual, no de scale matemático.

---

## 2026-05-30 — Founder no-técnico puede intuir la solución arquitectónica correcta antes que el dev (iter 14)

**Categoría**: Communication / Founder collaboration
**Confianza**: 🟢 Alta (validado en iter 14 tras 5+ iters fallidos)

### Qué funcionó

Iter 14 founder dijo: "podés modificar bien los tamaños sin necesidad de cambiar las fotos... el tema es la configuración de cómo se muestran, es como que tienen escalas diferentes cada una". Esa frase contiene la solución arquitectónica completa:
1. NO modificar fotos (rechazo confirmado)
2. SÍ modificar configuración de visualización (scope)
3. Scale DISTINTO por foto (no uniforme)

Yo había llegado a esa solución como "opción C" en iter 13.1 pero no la había implementado porque pensé que era "más compleja". El founder la pidió directo. Implementé en 30 min lo que debía haber hecho 6 iters antes.

### Por qué funciona

El founder no-técnico tiene un modelo mental basado en lo que VE (no en lo que el código hace). Cuando ve "cada foto se ve distinto", su intuición salta a "necesitamos config distinta para cada una". Ese razonamiento NO requiere conocer CSS, scale, transforms — es lógica directa.

Mientras tanto, yo (dev) estaba clavado en el universo de "soluciones uniformes son más limpias arquitectónicamente, busquemos el scale uniforme correcto". Se me ocurrieron muchas opciones excepto la obvia.

### Cómo aplicar

Triggers para confiar en la intuición del founder no-técnico:
- Usa frases observacionales ("cada una se ve distinto", "esto es chico", "esto no entra").
- Yo estoy proponiendo soluciones "uniformes" / "globales" / "limpias" y no funcionan.
- Founder pide algo que suena "menos elegante" pero más directo.

Pasos:
1. Antes de descartar una solución "menos elegante" como mal smell, evaluarla por SI FUNCIONA primero.
2. Si la solución elegante no funciona tras 2-3 iters, probar la menos elegante.
3. Si el founder repite la intuición ("cada una distinto"), tomarla como specification, no opinión.

### Costo si se ignora

6+ iters perdidos en esta sesión (9-13) buscando scale uniforme "elegante" cuando la solución per-foto era directa. Founder frustrado ("estás siendo vaga"). Erosión de credibilidad acumulada.

### Cross-link

Relacionado con [[empujé-modificar-fotos-iters-9-13]] del MISTAKES.md — ambos mistakes comparten "no escuché las pistas tempranas del founder".

---

## 2026-05-30 — Founder puede cambiar su rechazo inicial al ver el resultado intermedio del approach rechazado

**Categoría**: Communication / Founder collaboration
**Confianza**: 🟡 Media (1 vez observado en iter 13.2, falta validar pattern)

### Qué pasó

En iter 12.1 founder dijo claramente "no las voy a cambiar a las fotos porque no es eso", rechazando approach V2 (fotos normalizadas). En iter 13.1, tras varios iters de soluciones CSS fallidas, el founder mismo observó en mi comparison Python V2 que las 4 fotos "se ven parecidas, falta un poco más grandes". Eso fue una **validación implícita del approach previamente rechazado**.

### Por qué funciona

El founder rechazó el approach inicial porque (a) requería trabajo manual de reprocesar fotos en Photopea, o (b) intuitivamente creía que había solución de código pura. Cuando vio el resultado intermedio (comparison V2) sin tener que hacer nada manual, su evaluación cambió: el resultado le gustó.

La diferencia: en iter 12.1 le pedí que él reprocesara fotos. En iter 12+ las reprocesé yo automáticamente. El rechazo inicial era al TRABAJO, no al approach. Cuando demostré que yo automatizaba el trabajo, el rechazo se levantó.

### Cómo aplicar

Cuando el founder rechaza un approach con "no es eso":
1. Primer reflejo correcto: revisar el supuesto base ([[supuesto-base-revisar]] aplica acá).
2. Si tras explorar otras opciones la solución sigue apuntando al approach rechazado, generar el RESULTADO de ese approach automáticamente (sin pedir trabajo al founder) y mostrárselo.
3. Si el resultado le gusta visualmente, el rechazo se levanta solo.
4. Si insiste en rechazar, ahora sí buscar OTRA vía.

**Trigger**: si la solución técnicamente correcta requiere el approach rechazado, NO empujar verbalmente. Demostrar visualmente con un POC sin trabajo del founder.

### Cross-link

Complementa [[empujé-modificar-fotos-iters-9-13]] del MISTAKES.md — yo perdí 4 iters empujando verbalmente. Cuando demostré el POC visualmente (comparison V2 generada por mí, sin trabajo del founder), el founder mismo cerró el loop.

---

## 2026-05-30 — Cuando 2 extremos son malos (parámetro X demasiado bajo + demasiado alto), generar grid visual del rango y dejar al founder elegir el punto

**Categoría**: Empirical tuning / Founder collaboration
**Confianza**: 🟢 Alta (validado en iter 13 catálogo Vulk)

### Qué funcionó

Tras 6+ iteraciones de teorizar sobre scale-CSS óptimo (1.0 vs 1.15 vs 1.4) sin resolverlo, generé un **grid visual** que muestra simultáneamente CÓMO se ven las 4 variantes a 5-6 valores distintos de scale. El founder puede inspeccionar visualmente y elegir el punto donde se ven uniformes — sin necesidad de rondas de "deploy → testear → reportar → ajustar".

Script Python con PIL:
1. Cargar las N fotos relevantes.
2. Para cada valor del parámetro (scale, padding, threshold, lo que sea), simular el rendering final.
3. Generar imagen-grid grande (M columnas × N filas) con todas las simulaciones.
4. Guardarla en Desktop del founder o hacerle screenshot.

### Por qué funciona

Cuando los 2 extremos del parámetro son malos (uno corta, el otro deja chico), existe matemáticamente un punto intermedio que minimiza el problema. Pero saber CUÁL es ese punto a priori requiere modelar el sistema, lo cual:
- Es costoso para problemas visuales (involucra percepción, no solo matemática)
- A menudo no funciona porque la métrica que el código mide ≠ lo que el ojo ve

El grid visual elimina ese gap: el founder mira el resultado real a cada valor y elige. Es más rápido que iterar deploy.

### Cómo aplicar

Triggers para usar este pattern:
- Parámetro continuo (scale, opacity, blur, padding, threshold) con efecto visual.
- 2+ iteraciones fallidas intentando teorizar el valor correcto.
- Founder no puede expresar el target en términos cuantitativos pero sí visualmente ("se ve mal", "muy grande", "muy chico").
- El parámetro es global (afecta TODAS las instancias) → grid muestra todas a la vez.

Pasos:
1. Generar 5-7 valores espaciados uniformemente entre los extremos malos.
2. Renderizar M × N grid con simulaciones (Python+PIL o canvas client-side).
3. Guardar en ubicación accesible al founder (~/Desktop/, link, etc.).
4. Pedir al founder elegir el valor que mejor se ve.
5. Si hay duda entre 2 valores, generar zoom fino entre ellos.

### Costo si se ignora

Iterar a ciegas: deploy → founder testea → reporta "muy chico" → deploy → "muy grande" → loop infinito. Cada iteración ~10 min entre deploy y feedback. Con grid visual, 1 minuto de generación + 30s de elección del founder.

---

## 2026-05-30 — Crop → resize → center funciona; scale-up de foto entera NO

**Categoría**: Image processing / Pattern correcto
**Confianza**: 🟢 Alta (validado en iter 12.1 después de fallo de iter 12)

### Qué funcionó

Para normalizar fotos donde un sujeto (anteojo) debe ocupar el mismo % del frame final:

**Pattern correcto** (3 pasos):
1. **Detectar bbox del sujeto** con threshold tolerante (PIL: `arr.min(axis=2) < 235` captura silueta completa incluyendo sombras y partes claras).
2. **Recortar al bbox** (`img.crop(bbox)`) — descarta padding original variable.
3. **Resize+pegar centrado** en canvas nuevo del tamaño final con padding controlado.

**Pattern INCORRECTO** (lo que probé primero):
1. Calcular factor scale basado en área del sujeto.
2. `img.resize(W*factor, H*factor)` — escalar la foto ENTERA.
3. `canvas.paste(resized, ...)` — pegar al frame original.

El segundo pattern **corta los bordes del sujeto** cuando factor > 1 — porque la foto escalada excede el canvas y se recorta.

### Por qué funciona el primero

Trabajar a nivel de **bbox del sujeto** garantiza que el sujeto entero (con sus extensiones) queda dentro del crop. El resize se hace sobre el contenido relevante, no sobre el frame completo (que incluye padding irrelevante). El paste final centrado en canvas nuevo controla el padding output uniformemente.

### Cómo aplicar

Triggers para usar este pattern:
- Necesidad de uniformar el tamaño visual de un sujeto entre múltiples fotos.
- Las fotos originales tienen padding/framing variable.
- El sujeto puede extenderse cerca de los bordes del archivo original.

Pasos:
1. PIL + numpy: detectar bbox con threshold apropiado (235 para fondo blanco, ajustar según fondo).
2. `crop(bbox)` para aislar el sujeto.
3. Calcular new_W = TARGET_W * fill_ratio (ej. 0.85 = 85% del frame para padding visual).
4. `crop.resize((new_W, new_H), Image.LANCZOS)`.
5. Canvas nuevo con `Image.new('RGB', (W, H), bg_color)`.
6. `canvas.paste(resized, ((W-new_W)//2, (H-new_H)//2))`.

---

## 2026-05-30 — "Es eso nomás" = iterar la métrica hasta dar con la que matchea lo que el founder ve

**Categoría**: Debugging / Métrica correcta
**Confianza**: 🟢 Alta (validado en iter 12, cierre del problema fotos Vulk)

### Qué funcionó

En iter 11 medí bounding box width: dio 99% en las 4 fotos → "no hay diferencia". Pero el founder INSISTIÓ "la img 1 es más pequeña que la img 2, es eso nomás". Cambié de métrica a **área total de pixels oscuros** (peso visual real del anteojo): dio 64%, 45%, 100%, 102%. Las diferencias visibles que el founder reportaba eran ESTRUCTURALMENTE REALES — mi métrica anterior simplemente no las capturaba.

Una vez identificada la métrica correcta, la solución se construyó sola: scale por foto = sqrt(ref/foto_area). 4 fotos normalizadas en 5 minutos de Python.

### Por qué funciona

Cuando el founder ve una diferencia y tu métrica no la captura, **la métrica está mal — no su percepción**. El bounding box width capturaba las patillas finas extendidas hasta el borde (un detalle no significativo); el peso visual (área de pixels oscuros totales) captura lo que el cerebro humano percibe como "tamaño del anteojo".

El instinto incorrecto: defender la métrica que ya tenés. El correcto: iterar la métrica (probar varias dimensiones de medición: width, height, área, densidad, masa, contraste) hasta que los datos den el mismo patrón que el founder describe.

### Cómo aplicar

Triggers para iterar la métrica:
- Founder insiste "es así" después de que tu medición dijo "no hay diferencia".
- Tu medición dice "todo OK" pero el founder ve algo claramente.
- Hay múltiples dimensiones medibles del fenómeno (no solo width, también height, área, densidad, contraste, etc.).

Pasos:
1. Listar 3-5 métricas distintas que se podrían medir del fenómeno.
2. Aplicar cada métrica y ver cuál da el patrón que el founder describe.
3. La métrica correcta es la que coincide con la percepción real del usuario.
4. Solución de código se construye sobre la métrica correcta — no antes.

### Costo si se ignora

Insistís con la métrica original → founder pierde confianza → defaulteo a "no se puede sin re-fotografiar/re-procesar manualmente" (anti-pattern grave: pasar trabajo al founder cuando había solución por código).

### Relación con learnings anteriores

Refuerza [[medir-antes-de-teorizar]] (2026-05-30) — medir es solo el primer paso. Si la medición no coincide con la percepción del usuario, **iterar la métrica** es el segundo paso. Sin el segundo paso, la medición es tan ciega como la teoría.

---

## 2026-05-30 — Medir antes de teorizar: 5 minutos de Python + PIL refutaron 3 diagnósticos teóricos en cadena

**Categoría**: Debugging / Empirical verification
**Confianza**: 🟢 Alta (validado en iter 11 — cierre de cadena de 3 mistakes)

### Qué funcionó

Tras 3 iteraciones (iters 7, 9, 10) diagnosticando teóricamente "el problema es el padding interno de las fotos JPG" y proponiendo soluciones cada vez más elaboradas (scale CSS, reproceso fotos, workflow Photopea), el founder pasó las 4 URLs del bucket. En 5 minutos:

1. `curl` las 4 fotos
2. Python + PIL: `ImageChops.difference` + `numpy` con threshold variable (240, 200, 150, 100) → bounding box del contenido no-blanco
3. Tabla con datos reales

**Resultado**: las 4 fotos eran 99% width del anteojo. Diferencia max 1.1%. Mi diagnóstico de "padding distinto" era FALSO. El problema real (perspectiva del anteojo + translucencia del color) era invisible para la teoría — solo visible al renderizar las 4 a tamaño uniforme.

### Por qué funciona

Los modelos mentales sobre fotos/CSS son convincentes pero pueden estar completamente equivocados. La realidad del archivo binario es objetiva. Medir convierte la conversación de "creo que es X / creo que es Y" en "los datos dicen X" — y a veces dicen algo que ninguna teoría predecía (perspectiva + translucencia, en este caso).

5 min de scripting en Python (PIL + numpy) reemplazan días de teorías. **Especialmente** cuando el founder no-técnico ya hizo trabajo manual siguiendo instrucciones teóricas y el problema persiste.

### Cómo aplicar

Triggers para medir antes de seguir teorizando:
- 2+ iteraciones diagnosticando el mismo problema con teorías distintas.
- Founder ejecutó tu workflow propuesto al pie de la letra y el problema persiste.
- El problema involucra archivos binarios (fotos, audios, PDFs) cuyas características son inspeccionables programáticamente.
- Estás por proponer otra teoría sin haber medido.

Pasos:
1. Pedir URLs / paths / acceso a los archivos reales.
2. Descargar y abrir con la lib correcta (PIL para imágenes, ffprobe para video/audio, pdfinfo para PDFs, etc.).
3. Medir con 2-3 métricas distintas (no solo una — diferentes thresholds revelan distintas anomalías).
4. Generar artefactos visuales (comparación side-by-side, gráficos) que el founder pueda verificar con sus ojos.
5. SOLO entonces proponer solución, basada en datos concretos.

### Costo si se ignora

- Cadena de mistakes: diagnostiqué mal 3 veces seguidas (iter 7, 9, 10) porque cada teoría refutada llevaba a otra teoría sin medir.
- Trabajo founder desperdiciado: reprocesó las fotos al menos una vez siguiendo workflow que era irrelevante al problema real.
- Pérdida de confianza: a cada "esta vez sí entiendo" sin medir, la credibilidad baja.

### Relación con learnings anteriores

Extensión natural del learning "Patrones ASIMÉTRICOS de bug = problema en datos, no en código" (2026-05-30, iter 7). Ese learning identificó **dónde** está el problema (en los datos). Este learning agrega: **medí los datos en vez de teorizar sobre ellos**.

---

## 2026-05-30 — Cuando founder no-técnico dice "no tiene sentido", parar de explicar y pedir verificación empírica

**Categoría**: Communication / Founder-technical translation
**Confianza**: 🟡 Media (validado 1 vez en iter 10 — falta confirmar resultado)

### Qué funcionó

En iter 10, founder reprocesó las fotos siguiendo mi instrucción (mal calibrada) y reportó "siguen diferentes, no tiene sentido". Mi primer instinto fue explicar la teoría de nuevo (canvas size vs padding interno). Cambié de estrategia y propuse:
1. **Analogía visual concreta** (4 hojas A4 idénticas con anteojos de distinto tamaño dibujados adentro) → traduce concepto técnico a algo tangible.
2. **Verificación empírica directa** (pedirle las 4 URLs de las fotos para medir yo el % real del anteojo y mostrarle tabla con números).

Esto cambia la conversación de "Claude explica teoría / founder cree o no cree" → "Claude mide datos / founder ve evidencia objetiva".

### Por qué funciona

El founder es no-técnico pero **muy lógico**. Cuando una explicación técnica "no tiene sentido" para él, generalmente es porque la abstracción no le suena verosímil — no porque le falte capacidad de entender. Bajar a **analogía concreta** + **datos medibles** elimina la fricción.

Además: si efectivamente las fotos NO son iguales como él cree, los números lo van a mostrar sin que yo tenga que insistir. Si SON iguales y la teoría está mal, los números también lo van a mostrar y yo aprendo.

### Cómo aplicar

Triggers para cambiar a este modo:
- Founder dice "no tiene sentido", "no entiendo por qué", "es raro porque".
- Más de 2 turnos explicando lo mismo con palabras distintas.
- Founder ejecutó tu instrucción al pie de la letra y el resultado no es el que prometiste.

Pasos:
1. **Analogía**: traducir el concepto técnico a un objeto cotidiano (hojas, marcos, etc.). Mejor cuanto más visual.
2. **Verificación empírica**: pedir el dato real (URL, screenshot con DevTools, número exacto). Vos hacés la medición — no es trabajo del founder.
3. **Tabla con números reales** que confirma o refuta la hipótesis.

### Costo si se ignora

Sigues explicando teoría → founder pierde confianza en tu diagnóstico → conversaciones largas sin resolución → posible decisión incorrecta (founder podría reprocesar fotos de nuevo siguiendo la misma instrucción mala, o abandonar la feature).

### Relación con learnings anteriores

Aplicación específica del patrón "cuando un mismo error se repite, cambiar el modelo mental antes de iterar". El error que se repite acá es "founder reprocesa fotos siguiendo mi instrucción → resultado no es el esperado". Cambiar modelo = medir datos en lugar de teorizar.

---

## 2026-05-30 — Uniformidad de fotos tiene 2 dimensiones distintas: framing relativo vs padding interno absoluto

**Categoría**: Asset specs / Domain knowledge
**Confianza**: 🟢 Alta (validado tras 3 iteraciones iter 6 → 7 → 8 → 9)

### Qué funcionó

Tras iter 9, identifiqué que el problema de fotos NO uniformes tiene **2 dimensiones independientes** que confundí entre sí:

1. **Framing relativo entre variantes del mismo modelo**: ¿el anteojo está en la misma posición/orientación en cada foto? Esto el founder lo reprocesó después de iter 7 (las 4 variantes del Vulk quedaron alineadas entre sí).

2. **Padding interno absoluto de cada foto JPG**: ¿qué porcentaje del frame ocupa el anteojo? Esto NO se resuelve uniformando framing relativo. Una foto puede tener anteojo al 50% del frame; otra al 85%. Ambas con framing alineado pero radicalmente distintas en cuánto blanco hay alrededor.

El `scale CSS` agresivo es sensible a la dimensión #2, no a la #1. La uniformidad relativa entre variantes (#1) NO garantiza que un scale uniforme funcione.

### Por qué funciona

Un `scale-[1.4]` aplica zoom 40% uniforme. Si el sujeto ocupa 85% del frame, 85% × 1.4 = 119% → corta. Si ocupa 50%, 50% × 1.4 = 70% → drama visual sin recorte. La fórmula es matemática y depende SOLO del % del frame ocupado por el sujeto, no del framing relativo entre fotos hermanas.

### Cómo aplicar

Standard de fotos del catálogo a documentar en `PRODUCT_SCHEMA.md`:
- 1500×1000 px (aspect 3:2)
- JPG calidad 90+
- Fondo blanco puro #FFFFFF
- **Anteojo ocupando 60-65% del ancho del frame** (dimensión #2: padding interno)
- Centrado vertical y horizontal
- Mismo padding entre variantes del mismo modelo + entre modelos diferentes (dimensión #1: framing relativo)

Con AMBAS dimensiones cumplidas, scale CSS agresivo (1.3-1.4) funciona uniforme. Con solo una, falla.

### Costo si se ignora

Mismo costo que la iteración 6→7→8→9: 3-4 commits resolviendo síntomas en lugar de establecer pre-condiciones claras de los assets. La distinción entre las 2 dimensiones es fácil de ver una vez explicada pero invisible si se piensa "fotos uniformes" como una sola cosa.

### Relación con learning anterior

Refuerza el learning previo del mismo día ("Patrones ASIMÉTRICOS = problema en datos"). El detalle nuevo es que "datos uniformes" puede significar cosas distintas — establecer cuáles dimensiones importan para tu CSS antes de pedir uniformidad.

---

## 2026-05-30 — Patrones ASIMÉTRICOS de bug = problema en datos, no en código

**Categoría**: Debugging / Diagnóstico
**Confianza**: 🟢 Alta (validado en iter 7 catálogo Vulk)

### Qué funcionó

Founder reportó bug donde **algunas variantes** se cortaban en thumb pero OK en grande, **otras variantes** al revés. El patrón ASIMÉTRICO fue la pista clave: si el bug fuera del código CSS uniforme (scale-1.4), TODAS las fotos estarían igual de afectadas. La asimetría confirmó que el problema raíz son las **fotos**: cada una tiene framing distinto (anteojo grande vs chico vs descentrado).

### Por qué funciona

Un código uniforme (scale CSS, validación, mapper) produce resultados uniformes. Si el resultado NO es uniforme, el código está respondiendo correctamente a **inputs no-uniformes**. La inconsistencia es la firma de un problema en los datos, no en la lógica.

### Cómo aplicar

Cuando un bug se manifiesta de forma asimétrica (algunas instancias sí, otras no, mismo código path):
1. Antes de tocar el código, listar las diferencias en los DATOS de las instancias afectadas vs OK.
2. Si las diferencias son sistémicas (framing de fotos, atributos faltantes, longitud de texto), el fix es en los datos o en uniformar el procesamiento de inputs, NO en el código uniforme.
3. Fix CSS-only puede ser compromise temporal, pero la solución definitiva es uniformar inputs.

### Costo si se ignora

Iterar el código uniforme para "arreglar" un problema de datos no-uniformes lleva a hacks cada vez más complejos (condicionales por foto, scale por variante, branches). El sistema se vuelve frágil.

---

## 2026-05-30 — Paralelización real: 1 agente background + 1 agente foreground + 1 task local

**Categoría**: Workflow / Multi-agent orchestration
**Confianza**: 🟢 Alta (validado en sesión multi-camino A+B+C)

### Qué funcionó

Founder pidió "ejecutar 3 caminos" (audit features + filtros catálogo + plan editorial). Total scope estimado: 6-9 sesiones si secuencial. Pero tenían distinta naturaleza:
- **Camino C (audit)**: lectura + análisis. Delegable al agente `Explore`.
- **Camino B (plan editorial)**: investigación + redacción. Delegable a `content-writer-medical` en background.
- **Camino A (filtros)**: código local que solo yo puedo escribir.

Patron de paralelización aplicado:
1. **Sincrónico inicial**: invoqué `Explore` (foreground) → recibí audit en 1 turno → fixeé los 3 críticos.
2. **Async background**: lancé `content-writer-medical` con `run_in_background: true` para el plan editorial.
3. **Foreground en paralelo**: yo codeé Camino A (filtros catálogo) mientras el agente B trabajaba.
4. **Convergencia**: cuando llegó `<task-notification>` del content-writer, integré su output en `CONTENT_PLAN.md`.

Resultado: 3 caminos completados en 1 sesión vs ~6 sesiones secuenciales.

### Por qué funcionó

Los agentes especializados con tools propios (web_search, web_fetch) **no consumen mi context window** cuando corren en background. Mi context queda libre para el código local. Cuando terminan, llegan con el output ya estructurado y solo lo proceso/integro.

La clave es identificar **qué tareas son delegables vs cuáles requieren mi context activo**:
- Delegable: audit, research, redacción, validación con expert.
- No delegable: ediciones precisas de código en archivos que necesito tener en context.

### Regla preventiva

Cuando recibas pedido multi-camino o "ejecutar todas las opciones":
1. **Identificar cuáles caminos son delegables** a agentes especializados (audit, research, redacción).
2. **Lanzar el más largo en background primero** (típicamente research/redacción) con `run_in_background: true`.
3. **El más rápido (audit) en foreground primero**: 1 turno, da info que puede afectar al resto.
4. **El de código local en el medio**: mientras el background corre.
5. **Convergencia**: cuando llega la `<task-notification>`, integrar el output.

### Cuándo aplicar

- Pedidos multi-feature ("hacé todo esto").
- Mejoras de quality assurance + research + código nuevo.
- Cuando hay claramente trabajo paralelo (research / redacción / código).

### Cuándo NO aplicar

- Tareas pequeñas (overhead de delegación > beneficio).
- Cuando todo el trabajo es del mismo dominio (no hay paralelización útil).
- Cuando el output del agente background bloquea decisiones de código foreground.

### Bonus

Este pattern es la versión práctica del "Workflow" pero usando Agent tool directo. Para casos más complejos (5+ agentes, fan-out, judge panels), conviene Workflow. Para casos chicos (2-3 agentes), Agent con background flag es más simple y suficiente.

## 2026-05-30 — Para flows complejos con múltiples casos, derivar entre componentes en vez de duplicar lógica

**Categoría**: Architecture / DRY
**Confianza**: 🟢 Alta (validado en IA-5.2 form manual de receta)

### Qué funcionó

Al construir el form manual de receta (alternativa al lector IA), tenía 2 opciones:
- **Opción A**: duplicar toda la lógica del lector (evaluateInPerson, bifocal options, in-person handoff, save to cookie, etc.) en el form manual.
- **Opción B**: el form manual solo maneja el caso "monofocal sin patología". Casos complejos (bifocal, alta graduación) **derivan al lector IA** o WhatsApp.

Elegí B. El form manual termina con 3 outcomes:
1. Si tiene ADD → "Tu receta tiene componente bifocal. Usá el lector IA que tiene opciones lejos/cerca." → link a `/lector-de-receta`.
2. Si tiene alta graduación → "Necesitás atención presencial." → WhatsApp.
3. Si es simple → guardar cookie + redirect.

Resultado: ~400 líneas de código nuevo en vez de ~700-800 si hubiera duplicado todo el flow del lector. Y 1 source of truth para los flows complejos.

### Por qué funcionó

Cuando 2 componentes manejan **el mismo dominio con caminos overlap**, duplicar lógica = bugs en N lugares cuando cambia el dominio. Mantener 1 source of truth y derivar entre ellos (con links/redirects) preserva consistencia.

Trade-off honesto: el usuario que cargó manual su receta con ADD termina en el lector IA con un mensaje de explicación. NO completa el flow en el form manual. Pero esto es **mejor** que un form manual con 4 casos que pueden divergir del lector con el tiempo.

### Regla preventiva

Cuando construyas un componente alternativo a uno existente (form manual vs lector IA, opción rápida vs avanzada, etc.):
1. **Identificá qué casos manejan AMBOS** y qué casos solo uno.
2. **El componente más simple debe DERIVAR al complejo** cuando entra a un caso que no maneja.
3. **NO duplicar la lógica del caso complejo** en el simple.
4. **Documenta el flow de derivación** para que un futuro reader entienda por qué el componente simple "no termina" en algunos casos.

### Cuándo aplicar

- Forms alternativos (manual vs scan, simple vs avanzado, beta vs full).
- Páginas paralelas con caminos overlap (carrito vs checkout, ver vs editar).
- Cuando hay tentación de "copio el bloque de allá".

### Cuándo NO aplicar

- Cuando los componentes son completamente distintos (no hay overlap real).
- Cuando duplicar es más simple Y los cambios son raros (lógica congelada).

### Bonus

Esta decisión generó otro patrón positivo: el form manual quedó SIMPLE de leer (1 archivo, 400 líneas, casos claros). Si hubiera duplicado, sería 1 archivo de 800+ líneas con bifurcaciones complejas. Trade-off correcto.

## 2026-05-30 — La opinión del experto + la realidad del mercado pueden divergir — reconciliá ambas en vez de elegir una

**Categoría**: Decision-making / Theory vs practice
**Confianza**: 🟡 Media (situación de IA-5.1, validar con uso real)

### Qué funcionó

Sprint IA-5 inicial: consulté al `optical-expert` y me dijo "tarjeta en pómulos (geometría sin paralaje)". Codé con eso. Founder testeó en prod y trajo referencia de **LensCrafters** mostrando "tarjeta en frente con 2 dedos". Conflicto: experto vs realidad de producción.

Análisis:
- **Experto** tenía razón en lo geométrico puro (sí, frente tiene paralaje 2-3%).
- **LensCrafters** tiene razón en lo práctico (tarjeta en frente es MUCHO más fácil, paralaje compensable, escalable a millones de clientes).
- **Ambos son válidos para casos distintos**: monofocal básico tolera ±2mm → frente OK. Receta media-alta requiere ±0.5mm → pómulos mejor.

En vez de elegir uno y descartar el otro, ofrecí AMBOS modos en la UI:
- `simple`: frente, fácil, advertencia "precisión ±1.5mm orientativa".
- `precise`: pómulos, más exacto, default para casos donde importa.

Resultado: usuario elige según su caso. No pierdo la "facilidad de LensCrafters" ni la "precisión del experto".

### Por qué funcionó

Los expertos resuelven el **ideal técnico** (qué da el mejor resultado geométrico). El mercado resuelve el **ideal práctico** (qué funciona a escala con clientes reales que no son técnicos). Ambos son válidos pero optimizan distinto:
- Experto = precisión máxima asumiendo usuario coopera al 100%.
- Mercado = balance precisión/facilidad asumiendo usuario humano normal.

Cuando hay conflicto entre ambos, "elegir uno" es subóptimo. "Ofrecer ambos con copy claro de trade-offs" es óptimo: usuario decide según su caso.

### Regla preventiva

Cuando una recomendación del agente experto contradiga al "approach en producción de empresas grandes del sector":
1. **NO descartar al agente** — geométricamente sigue teniendo razón.
2. **NO descartar al mercado** — empíricamente funciona.
3. **Buscar el modelo dual**: ofrecer ambos como modos, con copy explícito de trade-offs.
4. Si UI no permite "ambos modos", elegir según frecuencia esperada de cada caso de uso.

### Cuándo aplicar

- Features que afectan UX vs precisión técnica (medidas, mediciones, validación).
- Features donde la "regla pura" choca con la "facilidad para el usuario".
- Decisiones donde un experto técnico difiere del approach de un competidor exitoso.

### Cuándo NO aplicar

- Cuando hay un consenso fuerte expert + mercado (mismo approach).
- Cuando la "facilidad" es excusa para algo técnicamente inseguro (no aplica al medidor DNP — el modo simple es menos preciso pero NO peligroso).
- Cuando ofrecer ambos modos confunde más que ayuda (UI sobrecargada).

### Bonus

Esta es la 3ra learning de la sesión sobre validación de approaches. Pattern emergente: **validación con experto + verificación con realidad de mercado + decision sintética**. No basta ninguno solo.

## 2026-05-30 — Para features con lógica de dominio (óptico/médico/legal), validar approach con agente experto ANTES de codear

**Categoría**: Domain validation / Agent usage
**Confianza**: 🟢 Alta (validado en sprint IA-5 medidor DNP)

### Qué funcionó

Antes de codear el medidor DNP (IA-5), invoqué al agente `optical-expert` con 9 preguntas técnicas específicas:
- Tarjeta apoyada en la frente vs frente a la cara
- DNP monocular vs binocular
- DNP de lejos vs cerca
- Rangos plausibles + límite de edad
- Precisión necesaria por tipo de lente
- Warning flags relevantes
- Casos donde NO sirve (prismas, progresivos, estrabismo)
- Disclaimer legal
- Mejoras al approach

El agente me corrigió 3 errores críticos antes de codear:
1. **Tarjeta en frente = mal técnicamente** (error paralaje 3-5%) → debe ir apoyada en pómulos al plano de pupilas.
2. **Solo DNP total = insuficiente** → 20-25% de pacientes tienen asimetría >1mm; necesitamos también DNP monocular OD/OI con nasal_bridge como referencia.
3. **Permitir todos los lentes = peligroso** → progresivos requieren altura pupilar adicional, prismas requieren descentrado manual; restringir a monofocales únicamente con esta DNP.

Si hubiera codeado mi versión inicial:
- 3-5% de error sistemático sin saberlo.
- Anteojos descentrados para el 20% con asimetría.
- Clientes con progresivos enojados porque la DNP "auto-medida" no sirve.

Total: 1 turno de consulta evitó **3 categorías de bugs en producción** que afectarían directamente la satisfacción del cliente y la reputación de la regente matriculada.

### Por qué funcionó

El conocimiento técnico óptico no es "lookupeable" en docs públicas — es práctica profesional acumulada. Mi modelo mental de "DNP = distancia entre pupilas, fácil" omitía nuances que sólo un técnico óptico conoce. El agente especialista tiene system prompt enfocado en ese conocimiento + accesibilidad para hacer pregunta-respuesta estructurada.

Para features con lógica de dominio (óptico, legal, médico, financiero), los detalles de "qué casos no contemplé" son donde se rompe el producto en producción. Validar antes evita estos rompimientos.

### Regla preventiva

Para CUALQUIER feature que encarne lógica de dominio profesional, consultar al agente especialista ANTES de codear:
- `optical-expert`: medidas anatómicas, recetas, materiales ópticos.
- `argentine-ecom`: AFIP, defensa del consumidor, MP, logística AR.
- `seo-strategist`: URLs, structured data, contenido SEO.
- `content-writer-medical`: copy YMYL para salud.

Costo: 1 turno de mensaje, 1-2 minutos de espera del agente.
Beneficio: catch de 1-5 errores de dominio antes de codear.

Pattern recomendado de prompt:
1. Describir el flow técnico propuesto.
2. Listar preguntas específicas (no abiertas).
3. Pedir formato estructurado (markdown).
4. Pedir NO escribir código, solo validación.
5. Pedir "recomendaciones accionables".

### Cuándo aplicar

- Features que afecten data del cliente con consecuencias reales (medidas anatómicas, fiscal, legal).
- Decisiones que requieran conocimiento técnico no obvio.
- Implementaciones de regulación específica (LPDP, AFIP, defensa consumidor).

### Cuándo NO aplicar

- UI puramente cosmética.
- Refactor de código sin cambio de comportamiento.
- Features que ya consultaste al agente para esta área hace <1 semana.

### Bonus

Esta es 2da iteración del meta-learning "delegar research/validación a agentes especialistas antes de codear". Combinada con la del research VTO (Jeeliz), están confirmando un patrón. Si en el próximo sprint vuelve a darse, candidato a regla permanente en CLAUDE.md sección "Reglas core".

## 2026-05-30 — Delegar research técnico de arquitectura a `ai-features-engineer` ANTES de proponer plan

**Categoría**: Decision-making / Agent usage
**Confianza**: 🟢 Alta (research VTO de hoy descubrió Jeeliz que cambió la decisión completa)

### Qué funcionó

Founder preguntó "¿se puede hacer un probador virtual con las fotos del catálogo?". Mi primera reacción fue armar 4 opciones desde lo que ya conocía (overlay 2D, SaaS, 3D, IA generativa). Founder eligió híbrido A+D. Antes de codear, decidí delegar research profundo al agente `ai-features-engineer` con prompt estructurado: viabilidad, stack, costos, privacidad LPDP, calidad esperada.

El informe trajo un descubrimiento que mi research inicial no tenía: **Jeeliz VTO Widget** (open-source MIT, overlay 2D + tracking real-time, gratis, 100% client-side). Captura 70% del valor con 20% del esfuerzo. Cambió completamente la recomendación arquitectónica — de "híbrido A+D solo" a "Jeeliz + A+D combinados" donde Jeeliz cubre exploración y A+D cubre resultado fotorrealista para compartir.

Sin el research delegado, hubiera armado un plan A+D directo de 6-9 sesiones cuando había un atajo de 2 sesiones que da 70% del valor.

### Por qué funcionó

Agentes especialistas tienen 2 ventajas concretas sobre mi research:
1. **Web search + fetch dedicado**: el agente puede buscar más a fondo sin gastar mi context window.
2. **Conocimiento de dominio actualizado**: el agente `ai-features-engineer` tiene system prompt enfocado en patrones de IA / VTO / RAG / streaming, conoce providers actuales (fal.ai, Replicate, Modal) y casos de uso.

La diferencia entre "research basado en lo que sé" vs "research delegado a especialista que busca activamente" es crítica para arquitectura de features grandes. El primero está sesgado por mis blind spots; el segundo busca lo que NO sé que existe.

### Regla preventiva

Para decisiones arquitectónicas grandes (features con >5 sesiones de scope, integraciones third-party, stack nuevo, decisiones de costo recurrente), delegar research a agente especialista ANTES de proponer plan. Costo: 1 turno de mensaje. Beneficio: descubrir alternativas que no tenía en mi modelo mental.

Agentes a usar según dominio:
- **`ai-features-engineer`**: VTO, RAG, vision, function calling, costos de IA.
- **`argentine-ecom`**: pagos, AFIP, logística, fricción legal AR.
- **`seo-strategist`**: arquitectura URLs, schema, contenido.
- **`optical-expert`**: decisiones técnicas ópticas.

### Cuándo aplicar

- Features que requieren stack o provider third-party nuevo.
- Decisiones con costo recurrente >$20/mes.
- Features con scope >5 sesiones.
- Cuando la pregunta del founder es abierta ("¿se puede hacer X?") y mi respuesta inicial es "sí, hay N opciones".

### Cuándo NO aplicar

- Iteraciones sobre código existente.
- Features con stack ya conocido del proyecto.
- Decisiones reversibles de bajo costo (CSS, copy, organización de archivos).
- Cuando el founder dice "no investigues, decidí" — confía en mi criterio.

### Bonus

Esto cierra un patrón de blind-spots: cuando armé las 4 opciones iniciales, mi "opción C - 3D real-time" la descarté como "imposible sin modelos 3D scaneados de cada producto". Pero Jeeliz es C-lite: overlay 2D + tracking, sin necesidad de 3D real. Mi categorización binaria (2D estático vs 3D escaneado) ocultó el middle ground. El agente trajo ese punto medio porque buscó activamente "VTO open-source eyewear" en lugar de razonar desde categorías mentales.

## 2026-05-30 — Tercera carpeta `supabase/cleanup/` para data scripts one-shot (ni schema ni seeds)

**Categoría**: Data lifecycle / Convenciones Supabase
**Confianza**: 🟡 Media (creada hoy, validar con uso futuro)

### Qué funcionó

Founder pidió borrar 4 productos placeholder de Rusty. Al pensar dónde poner el SQL, identifiqué que no encaja bien en ninguna de las 2 carpetas existentes:

- **`supabase/migrations/`**: schema (CREATE TABLE, ALTER, etc.). Inmutables. Se aplican una vez por entorno.
- **`supabase/seeds/`**: data semilla que se aplica al hacer `db reset`. Idempotente (ON CONFLICT DO NOTHING). Representa estado deseado del catálogo inicial.

Un DELETE de productos productivos NO es schema ni seed:
- No es schema (no cambia estructura).
- No es seed (no es estado deseado — es borrar data legacy).

Solución: crear `supabase/cleanup/` con timestamp prefix. Scripts one-shot que:
- Se aplican UNA vez en producción.
- Después quedan archivados como histórico (no se ejecutan al `db reset`).
- Tienen DO block con NOTICE para verificar el efecto post-aplicación.

```
supabase/
├── migrations/        # schema (inmutable, ordenadas)
├── seeds/             # data semilla (idempotente, re-ejecutable)
└── cleanup/           # data one-shot (archivado tras aplicar) ← NUEVO
```

### Por qué funcionó

Cada carpeta tiene un contrato semántico distinto:
- Migration que borra data productiva = wrong (migrations describen schema, mezclar data las hace impredecibles si se re-ejecutan).
- Seed que borra productos = wrong (seeds son aditivos por convención; un seed con DELETE confunde al lector).
- Cleanup = una clase aparte que comunica intención: "esto se aplica una vez, ojo".

Documentar la convención en CURRENT_STATE.md + en este learning para que sesiones futuras la respeten.

### Regla preventiva

Cuando necesites modificar data productiva (DELETE, UPDATE masivo, RENAME de slugs), preguntate:
1. **¿Cambia el schema?** → migration.
2. **¿Es estado deseado al hacer db reset?** → seed.
3. **¿Es un cambio puntual one-shot en producción?** → cleanup.

Si dudás entre seed y cleanup: ¿querés que se re-ejecute al hacer `db reset` localmente? Si NO → cleanup.

Naming: `supabase/cleanup/YYYYMMDD_descripcion_breve.sql`. Incluir DO block con NOTICE para verificar resultado.

### Cuándo aplicar

- DELETE de data legacy / placeholders / test data.
- UPDATE masivo de columnas existentes (ej. normalizar valores con `frame_shape ES→EN` lo hicimos como migration, pero podría haber sido cleanup también — caso ambiguo).
- Rename de slugs productivos (si los slugs ya están en URLs indexadas, rename es delicado).

### Cuándo NO aplicar

- Si el cambio puede generalizarse en una función / RPC reusable → mejor migration.
- Si el cambio se debe replicar en local automáticamente → seed.

### Bonus

La distinción "migrations vs seeds vs cleanups" es del mundo Rails / Django adaptada al stack Supabase. Supabase CLI no tiene `supabase cleanup` nativo — es una convención del repo. Si el equipo crece, esta convención debe documentarse en README del proyecto (futuro TODO).

## 2026-05-30 — Template pre-cargado switcheable en forms internos reduce fricción de tiempo cero

**Categoría**: UX herramientas internas / Forms
**Confianza**: 🟡 Media (validado en diseño de IA-3, falta confirmar con uso real del founder)

### Qué funcionó

En el form `/admin/product-copy-gen` (IA-3), el textarea de `attributes` JSON empieza pre-cargado con un template específico de la categoría seleccionada:
- Categoría `anteojos-de-sol` → template incluye `lens_treatment + lens_color`.
- Categoría `anteojos-de-receta` → template omite esos campos (lentes a medida).

Detección "edición vs default": si al cambiar la categoría el textarea sigue siendo idéntico a algún template default, se intercambia automáticamente. Si fue editado por el founder, NO se toca (no perdés trabajo).

```ts
const onCategoryChange = (next: CategorySlug) => {
  setCategorySlug(next);
  if (
    attributesJson === ATTRIBUTES_TEMPLATE_SOL ||
    attributesJson === ATTRIBUTES_TEMPLATE_RX
  ) {
    setAttributesJson(next === 'anteojos-de-sol' ? TEMPLATE_SOL : TEMPLATE_RX);
  }
};
```

Founder no tiene que escribir el JSON desde cero. Empieza con un esqueleto válido y modifica. Tiempo zero-to-output baja de ~5 minutos (escribir JSON desde cero + validar comas + recordar campos) a ~30 seg (editar values).

### Por qué funcionó

Forms vacíos generan "blank page paralysis" — el usuario tiene que recordar qué llenar. Forms pre-cargados con default sensible:
1. Sirven de documentación implícita (estás viendo qué campos esperás).
2. Reducen errores (sintaxis JSON ya viene válida).
3. Aceleran el flow (editás los 4-5 values que cambian, no los 12 que se repiten).

La detección "fue editado vs default" evita el bug clásico de "cambié la categoría y se borró todo lo que escribí".

### Regla preventiva

Para herramientas internas con inputs estructurados (JSON, YAML, config strings):
1. **Pre-cargar el textarea con un template default**.
2. **Si hay variantes del template** (ej. por categoría / por modo / por tipo), implementar swap automático SI el textarea sigue idéntico a un default.
3. **NO swapear si el usuario editó**. Detectá con comparison strict de strings.
4. **Comentar en el template** qué campos son obligatorios vs opcionales si la herramienta no tiene validación inline.

### Cuándo aplicar

- Herramientas admin internas (no front consumer).
- Forms con inputs estructurados largos (JSON, env vars, queries).
- Wizards multi-step donde un step depende de selección anterior.

### Cuándo NO aplicar

- Forms públicos para usuario final (donde el "default" sesga el output).
- Forms con un solo modo (sin variantes — no hace falta swap).
- Cuando los templates son tan distintos que el swap es confuso.

### Bonus

Conecta con regla general "los forms internos son su propia experiencia UX, no aplicas las mismas reglas que para front consumer". El usuario interno conoce el dominio, valora velocidad sobre simplicidad. Trade-offs distintos al public.

## 2026-05-30 — Cuando bloqueás un flow por "no podemos hacerlo", igual mostrá el OUTPUT al usuario — es valor educativo gratis

**Categoría**: UX / Product design
**Confianza**: 🟢 Alta (feedback explícito del founder en IA-2.5)

### Qué funcionó

Founder testeó IA-2 con receta bifocal (lejos+cerca). El flow original mostraba SOLO un mensaje "Tu receta es para multifocales/bifocales — escribinos por WhatsApp", sin tabla, sin valores parseados. Founder feedback:

> "Ademas en el caso de que no podamos hacerselo, no estaria de mas explicarle la receta al paciente (ya que la escaneo) podriamos aprovechar."

Insight: el usuario hizo el esfuerzo de escanear y esperar el análisis. Bloquearlo SIN mostrarle el output desperdicia ese trabajo. Aunque no podamos vender, podemos:
1. Mostrarle qué dice su receta (educativo).
2. Posicionarnos como experto que sí entiende su problema.
3. Aumentar trust antes del handoff WhatsApp.

Fix iter: tabla `PrescriptionForm` siempre visible + 3 opciones (incluyendo handoff) en vez de solo handoff.

### Por qué funcionó

Cuando una herramienta gratis produce valor (lectura de receta), el output del trabajo es independiente del próximo paso comercial. Bloquear la lectura para "empujar" hacia WhatsApp es percibido como hostil. Mostrarla siempre + sugerir caminos es percibido como honesto.

Sub-insight: hay 3 tipos de "no podemos vender ahora":
- **Bloqueador absoluto** (alta graduación, contact lens): handoff puro.
- **Bloqueador parcial** (bifocal puede partirse en 2 monofocales): ofrecer alternativas online + handoff.
- **No bloqueador** (monofocal simple): flow normal.

El código original trataba **bloqueador parcial = bloqueador absoluto**. Cuesta UX y conversión.

### Regla preventiva

Cuando diseñes un flow tipo "analyze → result → CTA":
1. **El resultado del análisis SIEMPRE se muestra**. Aunque la siguiente acción esté bloqueada.
2. **Diferenciá "bloqueador absoluto" de "bloqueador parcial"**. Si hay un camino online aunque sea acotado, ofrecerlo.
3. **El handoff a humano es UNA opción más, no LA única**.
4. **Validación con el founder/expert antes de hardcodear cuál es bloqueador absoluto**. La lógica óptica/médica/legal puede tener nuances que no se ven desde el código.

### Cuándo aplicar

- Lector de receta, analizador de cara, calculadora de envío, recomendador de productos.
- Cualquier feature donde el usuario invierta tiempo (subir foto, llenar form, esperar análisis).
- Decisiones de "podemos atender online vs presencial".

### Cuándo NO aplicar

- Casos donde mostrar el output ES el bloqueador (datos sensibles que no se pueden mostrar por compliance).
- Resultados ambiguos del análisis (warning_flags presentes) — mejor pedir reintento que mostrar data dudosa.

### Bonus

Conecta con el mistake gemelo de hoy ("traté has_add como bloqueador absoluto sin validar"). El mistake fue treating-it-as-binary. El learning es el patrón "siempre mostrar output, diferenciar tipos de bloqueador".

## 2026-05-30 — Para datos per-user en páginas con ISR cache: client component + server action (no server SSR)

**Categoría**: Next.js caching / Client-server boundaries
**Confianza**: 🟢 Alta (bug evitado antes de commitear; patrón documentado)

### Qué funcionó

Diseñando el `PrescriptionBanner` (Sprint IA-2), el draft inicial era un server component que llamaba `cookies()` directo:
```tsx
// MAL
export async function PrescriptionBanner() {
  const cookie = await readPrescriptionCookie();
  if (!cookie) return null;
  return <aside>...{cookie.od.esf}...</aside>;
}
```

Antes de escribirlo, me pregunté: "esta page tiene `revalidate = 300` (ISR). Si el server component lee la cookie en SSR, el HTML se cachea con la receta del primer visitante → todos los visitantes siguientes ven esa receta hasta que se invalide el cache. Bug de seguridad serio + LPDP."

Solución correcta: convertir a client component con `useEffect` + server action.
```tsx
'use client';
export function PrescriptionBanner() {
  const [data, setData] = useState(null);
  useEffect(() => { getPrescriptionFromCookie().then(setData); }, []);
  // ...
}
```

Trade-off: flash de hydration (banner aparece tras client render). En la práctica imperceptible para usuario que viene del lector (cookie warm). Pero cero risk de leak cross-user.

### Por qué funcionó

Next.js SSR + ISR cachea el HTML. Si el HTML depende de cookies (datos per-user), el cache es incorrecto. La forma de poner UI dependiente de cookie en una página con ISR es:
- **Client component**: lee data en runtime, independiente del HTML cacheado.
- **Server Component dynamic-only**: forzar `dynamic = 'force-dynamic'` (pierde ISR).
- **Suspense + PPR**: stream solo la parte dinámica (requiere `experimental.ppr`).

Para iter 1, client component es la opción más simple y safe.

### Regla preventiva

Antes de usar `cookies()`, `headers()`, `auth()` o cualquier source per-user en un Server Component:
1. **¿La page que lo monta tiene `revalidate = N` o `force-static`?**
2. **¿La page se monta en rutas que se pre-renderean con `generateStaticParams`?**
3. Si SÍ a cualquiera → no leer en server, hacerlo client.
4. Si la page ya es `dynamic = 'force-dynamic'` o `revalidate = 0` → OK leer en server.

### Cuándo aplicar

- Banners "tu carrito tiene X", "tu receta cargada", "tu wishlist".
- Header de usuario logueado encima de páginas cacheadas.
- Cualquier `useUserData` que se monta en sectional layouts.

### Cuándo NO aplicar

- En API routes / route handlers (siempre dynamic).
- En pages dynamic explícitas (force-dynamic).
- En components que se montan solo en rutas autenticadas (donde ya el middleware fuerza dynamic).

### Bonus

Conecta con el mistake gemelo de hoy ("casi shipeé un bug de leak ISR + cookies"). El learning es el patrón; el mistake es la near-miss. Documentar ambos hace que un futuro yo dude antes de escribir `cookies()` en un server component sectional.

## 2026-05-30 — Auditar mismatch de nombres ES/EN ANTES de crear cruces entre dominios

**Categoría**: Schema consistency / Cross-domain wiring
**Confianza**: 🟢 Alta (encontrado bug latente del CTA antes de duplicarlo)

### Qué funcionó

Antes de codear el grid del recomendador, hice 2 chequeos:
1. Inspeccionar el output de la IA (`lib/face-shape/types.ts` enum `FRAME_SHAPES`).
2. Inspeccionar los valores reales en seeds + `lib/catalog/brand-filters.ts`.

Resultado: descubrí que el IA devuelve español (`aviador`, `redondo`) y la DB tenía inglés (`aviator`, `round`). El CTA actual `/anteojos-de-sol?forma=aviador` ya estaba roto silenciosamente (devolvía 0 productos sin error). Si hubiera codeado el grid directo, hubiera duplicado el bug: grid vacío permanente para 3 de 6 shapes.

Fix con migration normalize_frame_shapes_spanish.sql + update brand-filters.ts en 4 líneas. Sprint avanzó sin deuda escondida.

### Por qué funcionó

Cuando una feature **conecta 2 dominios** (output de un sistema A + filtro de un sistema B), el riesgo es que cada lado evolucionó con convenciones distintas (idioma, casing, plurales). Si no se audita el contrato antes, los bugs son silenciosos: filter devuelve vacío, el usuario ve "sin productos" en vez de un error.

### Regla preventiva

Antes de crear un nuevo cruce entre 2 sistemas (IA output ↔ DB filter, API externa ↔ schema interno, form input ↔ enum DB):
1. **Listar los valores que produce el dominio A** (enum, schema, ejemplos reales).
2. **Listar los valores que acepta el dominio B** (constraints, filters, seeds reales).
3. **Diff visible** — tabla con "matchea / no matchea". Si hay mismatches, decidir UNA fuente de verdad antes de codear el cruce.

Aplicable cuando:
- Features nuevas que dependen de cross-domain matching.
- Migración de un sistema legado a uno nuevo.
- Integraciones con APIs externas (MP, ML, AFIP).
- Cuando hay convención mixta (algún archivo en inglés, otro en español).

### Cuándo NO aplicar

- Cuando el cruce es 1:1 obvio (FK con misma columna en ambos lados).
- Cuando ya hay tests E2E que validan el cruce.

### Bonus

Conecta con la regla "grep before propose" — descubrir features existentes es paso 1, auditar su shape es paso 2. Sin paso 2, el código nuevo amplifica los bugs latentes en vez de exponerlos.

## 2026-05-30 — `grep` rápido de integraciones existentes ANTES de listar features candidatas

**Categoría**: Discovery / Planning
**Confianza**: 🟢 Alta (founder cortó propuesta inútil con "ya está en el sitio")

### Qué funcionó

Founder me corrigió antes de empezar a codificar features IA que YA existían. En vez de ofenderme/defenderme, hice 2 greps de 5 segundos y descubrí que `/lector-de-receta` y `/recomendador-de-monturas` ya estaban en prod con stack completo (Claude Sonnet + Haiku, rate limit, Zod schemas, magic-byte detection). Reformulé el plan: 4 sprints de **mejoras a lo existente** + **1 feature nueva** (RAG) + **1 herramienta interna** (generación descripciones). Plan resultante mucho más útil y respetuoso del trabajo ya hecho.

### Por qué funcionó

El grep cuesta 5 segundos y devuelve verdad ground-truth del estado del repo, no la versión "lo que recuerdo del CURRENT_STATE" que está sesgada hacia cambios recientes. Es el equivalente a "leer el código antes de escribir el código".

### Regla preventiva

Cuando el founder pregunta "qué falta hacer" o "sigamos con otra cosa" y la respuesta posible es una feature nueva, ejecutar **descubrimiento rápido** ANTES de proponer:

```bash
# 1. Buscar integraciones por keyword del dominio
grep -rln "<keyword>" lib/ app/ components/ --include="*.ts" --include="*.tsx" | grep -v node_modules | head -20

# 2. Buscar rutas existentes
ls app/\(storefront\)/ app/api/

# 3. Buscar tablas/migraciones del dominio
ls supabase/migrations/ | grep -i <keyword>
```

3 comandos, ~15 segundos, evita 10-30 min de plan inútil.

### Cuándo aplicar

- **Siempre** que la pregunta del founder sea abierta ("qué sigue", "qué hacemos", "tenemos X?").
- Cuando una sesión empieza post-compaction (modelo mental incompleto).
- Antes de cualquier `AskUserQuestion` listando "features candidatas".
- NO aplicar si el founder describe scope explícito ("agregá X al Y").

### Bonus

Combina con el MISTAKE gemelo de hoy. Mistake: "asumí ausencia por ausencia de mención". Learning: "verificá presencia con grep antes de proponer". Mismo insight, framing positivo + negativo. Ambos confirman que **CURRENT_STATE.md es log de cambios, NO inventario de features**. El inventario hay que generarlo a demanda con grep.

## 2026-05-30 — Discriminated union (Zod) para schemas con paths divergentes según el tipo

**Categoría**: Validation / Schema design
**Confianza**: 🟢 Alta (validado con pickup vs delivery en checkout)

### Qué funcionó

Checkout iter 1 tenía un schema simple `z.object({ address_id: uuid })` que falla si pickup no manda address. Tenía un TODO largo describiendo "cuando agregues pickup, tenés que cambiar esto, esto y aquello".

Iter 2: refactor a `z.discriminatedUnion('shipping_method', [...])` con 2 branches:
- delivery: requiere address_id (UUID válido).
- pickup: address_id opcional.

Resultado: TypeScript sabe automáticamente qué campos están disponibles en cada branch. El narrowing es type-safe. Menos errores de "olvidaste validar X".

### Por qué funcionó

Discriminated unions son la forma idiomática de modelar "el shape cambia según un flag". Alternativas son peores:
- Schema "soft" con todos los campos opcionales + validation manual → fácil olvidar casos.
- 2 endpoints distintos → duplicación de auth/auth/etc.
- Schema dinámico con `.refine()` → menos legible, peor DX.

### Regla preventiva

Cuando un endpoint o action tiene N "modos" donde los campos cambian:
1. **Identificar el discriminador** (flag obvio: `type`, `method`, `mode`, `kind`).
2. **Usar `z.discriminatedUnion` (Zod 3+) o equivalente** (yup, valibot).
3. TypeScript narrowing hace el resto: `if (parsed.data.shipping_method === 'pickup') { ... }` ya sabe que `address_id` puede no existir.

### Cuándo aplicar

- Forms con tipos divergentes (delivery/pickup, paid/refunded, normal/admin).
- Polymorphic data en APIs (events de webhooks).
- Schemas que iterativamente acumulan branches.
- NO aplicar si los modos comparten 90%+ de los campos — el overhead de la unión supera el beneficio.

## 2026-05-30 — Para sprints grandes con múltiples sub-sprints, separar trabajo founder vs trabajo asistente y paralelizar

**Categoría**: Planning / Eficiencia
**Confianza**: 🟢 Alta (validado al plan flow compra)

### Qué funcionó

Founder eligió "TODOS" sobre 4 sub-sprints. Reacción natural: hacerlos secuenciales 1-2-3-4. Pero el Sprint 1 (activar checkout en prod) NO requiere código mío — requiere acciones de configuración del founder (env vars Vercel, app MP). Mientras founder hace eso, yo puedo avanzar Sprint 2 (quick wins UX) que es 100% código.

Planificación paralela:
- Founder: Sprint 1 setup (1-2h reales del founder)
- Asistente: Sprint 2 código (2h trabajo paralelo)

### Por qué funcionó

Sprints "completos" suelen tener 3 tipos de tareas: código (asistente), configuración (founder), validación (ambos). Tratarlos como un bloque secuencial deja tiempo muerto en uno mientras el otro trabaja.

### Regla preventiva

Para sprints con N sub-sprints:
1. **Clasificar cada uno**: ¿requiere acción founder? ¿requiere código? ¿requiere ambos secuenciales?
2. **Paralelizar**: founder hace los suyos mientras yo avanzo con los míos.
3. **Sync points explícitos**: definir cuándo necesito que founder confirme algo para seguir avanzando.

### Cuándo aplicar

- Sprints multi-feature donde algunos requieren config externa.
- Activación de servicios externos (MP, Resend, Andreani) que requieren API keys del founder.
- NO aplicar si los sub-sprints tienen dependencias hard entre ellos.

## 2026-05-30 — Sorting con criterio compuesto puede invertir intent del usuario — preferir un solo orden DB explícito

**Categoría**: Algorithm design / Sorting
**Confianza**: 🟢 Alta (validado tras bug sort_order MBLK)

### Qué funcionó

`sortImages` tenía 3 niveles (primary, variant_id matching, sort_order). El paso 2 fue agregado para evitar que imágenes shared (variant_id=NULL) con sort_order bajo se "colaran" entre las específicas de variante. Razón legítima en el momento.

PERO: ese mismo paso 2 hizo que cuando founder explicitamente puso sort_order=3 a la modelo MBLK, el cambio no se reflejara visualmente porque el paso 2 ganaba antes de evaluar sort_order. El intent del founder ("modelo en posición 4") quedaba oculto por la lógica intermedia.

Refactor: simplificar a SOLO `primary + sort_order`. La data manda. Si querés un orden específico, lo escribís en la columna sort_order de DB. Compensación necesaria: normalizar sort_order de fotos que tenían valores raros (Rosa con sort=3 y 4) para que sigan teniendo el orden correcto sin necesidad del paso 2.

### Por qué funcionó

Sorting con N criterios = N veces más difícil de predecir. El usuario que escribe data en DB no sabe que su sort_order va a ser reordenado por otro criterio invisible. Cuando el founder pone "3" espera ver la imagen en posición 3 (después de las que tienen 0, 1, 2). Cualquier otra lógica viola la regla de "menor sorpresa".

### Regla preventiva

Para sortings de UI:
1. **Preferir UN solo orden explícito** (sort_order column en DB). Más predecible, más controlable por el usuario que escribe la data.
2. **Si necesitás criterios secundarios** (primary, fecha), usarlos como tiebreaker SOLO cuando el primario no decide.
3. **Cualquier "lógica de relleno" en el sort que no sea pure data** debe ser documentada en código + visible en la UI o documentación. Sino el usuario rompe el orden sin saber por qué.

## 2026-05-30 — Distinguir "bug del código" vs "data inconsistente" cuando founder reporta inconsistencia visual

**Categoría**: Diagnóstico / Comunicación
**Confianza**: 🟢 Alta (validado tras issue tamaño thumbnails Vulk)

### Qué funcionó

Founder reportó: "las imágenes de las primeras 2 variantes se ven más grandes que las últimas 2". Reacción natural: "es bug del componente". Pero el componente Gallery es el MISMO para todas las variantes — mismo grid, mismo padding, mismo object-contain.

La diferencia tenía que estar en la DATA: las fotos del founder tienen distinta composición (Carey/Rosa cropeadas cerca del producto ~80% canvas, MBLK/BROWN con más aire blanco ~50-60% canvas). Con `object-contain`, las que tienen más aire en su foto original se ven proporcionalmente más chicas en el thumbnail.

Comuniqué la causa real (composición de fotos) en lugar de inventar un fix técnico. Le di al founder 3 opciones con tradeoffs explícitos.

### Por qué funcionó

Tentación natural cuando founder reporta UI bug: cambiar el código. Pero el código procesa data — si la data es inconsistente, no hay UI cambio que cubra el problema sin sacrificios.

Diagnóstico correcto: "is el componente identical para todos los casos? sí → la inconsistencia está en la data".

### Regla preventiva

Cuando founder reporta inconsistencia visual entre items que deberían ser equivalentes:
1. **Verificar primero que el componente procesa los items IGUAL** (mismo path de código, misma config).
2. **Si sí**: el problema es de data. Causa probable: items distintos en algún campo (dimensiones, composición, attributes).
3. **Comunicar la causa al founder** con honestidad — "el código no puede arreglar esto sin sacrificios (cortar, escalar artificialmente)". Founder decide si arregla data o acepta tradeoff.

### Cuándo aplicar

- UI con N items que el founder espera "equivalentes" visualmente.
- Especialmente UGC (user-uploaded content) donde la consistencia depende del que sube.
- NO aplicar si el componente tiene paths condicionales que diferencian items — ahí puede ser bug.

## 2026-05-30 — Overlay con `position: absolute` mantiene constraint visual sin afectar el flow

**Categoría**: UI / Layout / Flow vs overlay
**Confianza**: 🟢 Alta (validado tras iter del gallery)

### Qué funcionó

Iter previo del gallery: botón flecha al costado del grid como hermano en flex row. Funcionalmente correcto pero achicaba los 3 thumbs porque compartían el ancho del row con el botón. Founder lo notó.

Iter actual: botón con `position: absolute` superpuesto al borde derecho del grid. El grid mantiene 100% del ancho (3 cols iguales) y el botón "flota" encima. Resultado: thumbs tienen el MISMO tamaño que cuando hay solo 3 fotos. La flecha es información adicional, no compite por espacio.

### Por qué funcionó

Distinción crítica: **flow vs out-of-flow**.
- Elementos in-flow (default) participan del cálculo de tamaño de hermanos. Si agregás uno, todos los demás se achican proporcionalmente.
- Elementos out-of-flow (absolute, fixed) NO afectan el tamaño de hermanos. Coexisten visualmente pero CSS los ignora al hacer layout del flow.

Para "agregar control overflow a un grid sin afectar tamaño de items", absolute es la solución correcta.

### Regla preventiva

Cuando necesites agregar un elemento UI a un container que ya tiene items dimensionados (galería, lista, toolbar):
1. **Pregunta**: ¿el nuevo elemento debe afectar el tamaño de los hermanos?
   - Sí → in-flow (flexbox row/col, grid col extra).
   - No → out-of-flow (absolute, fixed, sticky con z-index).
2. Botones de control (siguiente, cerrar, expand) casi siempre son out-of-flow.
3. Items semánticamente equivalentes (thumb + thumb + thumb) son in-flow.

### Cuándo aplicar

- Toolbars que aparecen sobre contenido.
- Controles de navegación (prev/next) en carousels, galerías, sliders.
- Badges, indicadores de status sobre cards.
- Cualquier UI con jerarquía "contenido principal + controles secundarios".

## 2026-05-30 — Tamaño fijo + overflow control > dinamizar tamaño según N items

**Categoría**: UI / Founder feedback / Cantidades variables
**Confianza**: 🟢 Alta (validado con feedback explícito + iter 4 del bug gallery)

### Qué funcionó

ProductGallery tenía `gridTemplateColumns: repeat(Math.min(sorted.length, 6), 1fr)` — el tamaño de los thumbs se ajustaba dinámicamente según cuántas imágenes había. Estética OK cuando son 2-3 thumbs (se ven balanceadas). Mala cuando son 4+ (todas se achican y la principal pierde protagonismo visual).

Founder lo notó iter 4: "no me gusta que se achiquen las 4 imágenes de 4". Refactor: tamaño fijo (3 cols) + control de overflow con flecha al costado (botón mismo tamaño que un thumb). Esto:
- Garantiza que los thumbs siempre se vean igual de grandes (predictabilidad visual).
- No esconde data — la flecha hace visible que "hay más".
- Funciona para 1, 2, 3, 4, ..., N imágenes sin re-tunear cada caso.

### Por qué pasaron 4 iteraciones sin verlo

Iter 1-3 ajusté padding del CONTENEDOR principal de gallery, asumí que el problema era ahí. Recién iter 4 founder señaló los THUMBS (no el contenedor). Refresh mental: el problema visual estaba abajo, no arriba.

### Regla preventiva

Para UI con cantidad variable de items (N entre 1 y K):
1. **Default a tamaño fijo de cada item** + control de overflow (paginación, scroll, flecha, "+X más").
2. **NO escalar tamaño según N** salvo casos donde N es siempre 1-3 y "ajustarse al ancho" se ve bien.
3. **Cuando N puede ser cualquiera**, el item debe tener tamaño que se ve bien aislado, y el contenedor maneja overflow.

### Cuándo aplicar

- Galerías de fotos (productos con 1-10+ imágenes).
- Listas de tags, badges, links rápidos.
- Avatares de stakeholders.
- Cualquier UI donde count(items) es feature.

## 2026-05-30 — Fix post-apply: UPDATE puro > re-INSERT con ON CONFLICT cuando solo cambian flags/sort

**Categoría**: SQL operations / Minimizar fricción del founder
**Confianza**: 🟢 Alta (validado con fix de is_primary en Vulk Day Light)

### Qué funcionó

Founder reportó que las fotos primary de las 2 variantes nuevas (MBLK/BROWN) estaban mal seteadas (frontal en vez de lateral). 2 opciones para resolver:

A) **Re-aplicar seed 12 entero con valores corregidos** (UPSERT via ON CONFLICT). 160+ líneas SQL para 4 cambios reales. Riesgo de side effects si algún otro campo cambió entre el primer apply y este (founder editó algo manualmente).

B) **UPDATE puro de los 4 campos** (`is_primary`, `sort_order`) sin tocar nada más. 50 líneas SQL, idempotente, cero riesgo de pisar cambios manuales.

Elegí B. Pasos para founder: 1 acción (apply bootstrap), 0 acciones extras (no renombrar archivos en bucket porque el nombre del archivo es solo descriptivo, no determina orden).

### Por qué funcionó

Re-INSERT con ON CONFLICT DO UPDATE es el patrón default para "data correction" pero overkill cuando el cambio es chico. UPDATE puro:
- Más legible (el SQL dice exactamente qué cambia).
- Menos surface area de bugs (no tocás campos no involucrados).
- Más barato de aplicar (menos rows scanned, menos writes).

### Regla preventiva

Para fixes post-apply de data ya aplicada:
1. **Si cambian 1-3 campos de N filas conocidas** → UPDATE directo.
2. **Si cambian todos los campos o re-importás data externa** → UPSERT con ON CONFLICT.
3. **Si la estructura del data cambió** (renombre de columna, nueva FK, etc) → migration + seed conjunto.

### Cuándo aplicar

- Cualquier fix de data tras feedback del founder ("este campo está mal").
- Especialmente cuando founder ya validó otros campos del mismo registro — no querés tocar nada que no haya pedido.

## 2026-05-30 — Reusar JSON de debug anterior para extraer data de variantes futuras (1 vez es debug, N veces es source de truth temporal)

**Categoría**: Eficiencia / Debug data reuse
**Confianza**: 🟢 Alta (validado al sumar 2 variantes Vulk sin re-llamar ML API)

### Qué funcionó

Ayer durante el debug del sync stock fallido, capturé el JSON completo de `/items/MLA2726903920` para entender qué reportaba ML. Hoy cuando founder pidió sumar las 2 variantes que faltaban (MBLK + BROWN), no necesité hacer NUEVO round-trip a ML — el JSON de ayer ya tenía toda la data necesaria:

- variation_id de ML
- value_name con el código real ("MBLK/DRT04 - ...", "BROWN/DRLB14 - ...")
- available_quantity actual

Generé el seed directamente con esos datos. Cero latencia, cero confusión sobre "qué código usar exactamente". Si hubiera tirado el JSON anterior, hubiera tenido que volver a llamar ML + arriesgar pasar datos asumidos en lugar de medidos.

### Por qué funcionó

Datos crudos capturados durante debug son **source of truth temporal** (válido por días/semanas). Tirarlos tras "resolver el problema" desperdicia info que sigue siendo correcta.

### Regla preventiva

Cuando hagas debug que capture JSON crudo de servicio externo:
1. **No descartar el JSON tras resolver el problema inmediato**. Anotar (o citar en chat) las claves más relevantes.
2. **Antes de re-llamar el servicio externo para nueva tarea relacionada**, preguntar: "¿la respuesta de debug previa ya tiene lo que necesito?".
3. La regla vence cuando: (a) la data puede haber cambiado, (b) el endpoint cambió shape, (c) es producción y necesitás real-time.

### Cuándo aplicar

- Setups iniciales de integración (cuando muchas tareas se hacen sobre el mismo recurso del servicio externo).
- Debugging de un cluster de bugs relacionados (el JSON capturado para el bug 1 sirve para el 2 y 3).
- NO aplicar para data volátil (precios live, stock con alta rotación, sessions).

## 2026-05-29 — Marketplaces guardan identificadores en N campos posibles, fallback es obligatorio

**Categoría**: Integraciones / Marketplaces
**Confianza**: 🟢 Alta (validado con bug Vulk Day Light)

### Qué funcionó

Tras debug, descubrí que ML guarda el código del seller en 2 lugares posibles según cómo cargó el seller:
1. `seller_custom_field` (campo dedicado).
2. `attribute_combinations[DESIGN].value_name` con prefijo "CODIGO - Descripción".

Lo que el seller carga depende de cómo accedió al panel ML, qué wizard usó, qué versión del API. Asumir un solo campo es frágil.

Solución: helper `getVariationCode(v)` que devuelve seller_custom_field si existe, fallback a parsear value_name. Single point of truth para "qué string representa la variation a nivel seller".

### Por qué pasó originalmente

Doc de ML menciona ambos campos pero el ejemplo más común usa `seller_custom_field`. Implementación basada en "el ejemplo principal de la doc" sin verificar contra el item real del founder.

### Regla preventiva

Para matchin de identifiers en integraciones:
1. **Helper único `getXFromY(v)`** con N fallbacks en orden de preferencia. Nunca acceder directo al campo en código de business.
2. **Fallback final que devuelva null**, no crashee. Si todos los fallbacks fallan, el caller decide (skip, error, alerta).
3. **Logear cuál fallback se usó** (al menos en debug). Si todo el tráfico usa el fallback 2 y no el 1, eso es señal de que el campo "principal" no aplica a la realidad.

### Cuándo aplicar

- Cualquier integración con servicio externo donde el seller / merchant puede haber configurado el listing de N maneras (ML, Shopify, Amazon).
- Especialmente para campos que el servicio "permite vacíos" — si permitir vacío es opción, probablemente muchos sellers lo dejan vacío.

### Bonus: el bug fue silencioso por matchin fallido

El sync devolvía `ok: true` con `skipped > 0`. Status del webhook era `processed`. Todos los signals indicaban "todo bien". Lo único que mostraba el problema era comparar stock_qty pre/post manualmente. Patrón: matching fallido es MÁS peligroso que error explícito porque pasa desapercibido en logs y métricas.

## 2026-05-29 — Pedir solo el subset relevante del JSON, no el JSON entero gigante

**Categoría**: Comunicación con founder / Diagnóstico
**Confianza**: 🟢 Alta (validado en debug Vulk ML)

### Qué funcionó

Para verificar el `variations[]` de ML para MLA2726903920, sabía que el endpoint `ml-find-item` devuelve un JSON gigante (5+ KB con item completo: title, pictures, sale_terms, attributes, etc). En lugar de pedirle al founder el JSON entero, le pedí UNA SECCIÓN específica:

> Buscá específicamente la sección **`response.body[0].body.variations`** (es un array). Cada entry tiene: `id`, `seller_custom_field`, `available_quantity`. Pasame **solo esa parte**.

Sin esa precisión, founder pegaría 5KB en chat con 95% de ruido + 5% de info relevante. Yo tendría que parsear mentalmente para encontrar el subset que importa. Con la precisión, founder pega 200 bytes y la data está enfocada.

### Por qué funcionó

JSON de APIs maduras (ML, Stripe, Google) tiene MUCHA info por endpoint. La mayoría es contextual (descripción producto, fotos, etc) y NO ayuda al debug específico. Pedir solo el path relevante hace 3 cosas:

- **Founder entiende mejor**: solo ve lo que importa, sin scroll por 5KB.
- **Yo proceso más rápido**: el LLM no tiene que filtrar ruido del relevante.
- **Mensaje queda buscable**: si volvemos a este debug en otra sesión, las variations específicas están claramente identificadas.

### Cuándo aplicar

- Cualquier debug donde la respuesta del servicio tiene > 10 campos.
- Cuando hay sub-paths específicos relevantes al bug (variations[], errors[], headers).
- Idealmente, pre-decirle al founder qué shape esperás: `[{id, seller_custom_field, available_quantity}, ...]`. Eso le da template visual.

### Anti-pattern al evitar

"Pasame el JSON completo" → founder pega 5KB → yo proceso 200 bytes relevantes → resto es ruido. Costo de chat alto, baja claridad.

## 2026-05-29 — "El cambio no impactó" tiene 3 capas: data, cache servidor, cache browser

**Categoría**: Debugging UX / Comunicación con founder
**Confianza**: 🟢 Alta (validado en debug del sync stock Vulk)

### Qué funcionó

Founder reportó "Bajé stock pero no impactó". 3 capas posibles donde "no impactó" puede manifestarse:

1. **Data layer**: ¿la DB se actualizó? — verificable con SQL.
2. **Server cache**: ¿el cache ISR de Next se invalidó? — verificable con revalidatePath logs / mismo request server-side.
3. **Browser cache**: ¿el browser está mostrando una versión cached? — verificable con incógnito o hard refresh.

El endpoint admin reportó: data layer OK, server processed webhook. Inmediatamente la siguiente hipótesis a chequear es #3 (browser cache) porque es la más común para feedback "no veo el cambio" cuando todo lo demás está bien.

### Por qué funcionó

Lo natural sería culpar al servidor primero porque "es donde está el bug". Pero browser cache es responsable de ~40% de los falsos negativos de "no impactó" en mi experiencia. Verificar incógnito primero (1 click) descarta esa capa antes de invertir en debug profundo del servidor.

### Cuándo aplicar

- Cualquier reporte de usuario "no veo el cambio" / "no impactó" / "sigue igual".
- Especialmente en sitios con ISR / SSG / CDN caching agresivo.
- Patrón: pedir incógnito ANTES de invertir en logging exhaustivo del servidor.

### Bonus: pedirle al founder el valor esperado vs visto

"¿De qué número a qué número bajaste?" + "¿qué número ves ahora?" — esos 2 datos resuelven 90% de los "no impactó" en 1 turno. Sin ellos, el debug es ciego.

## 2026-05-29 — Endpoint diagnóstico con pre/post + recent events + hints discriminatorios

**Categoría**: Observabilidad / Debug endpoints
**Confianza**: 🟢 Alta (validado para diagnosticar drift de stock)

### Qué funcionó

Founder reportó "bajé stock en ML pero no impactó en sitio". 3 causas posibles, todas con síntomas idénticos al ojo del founder. Endpoint diagnóstico `/api/admin/ml-force-sync/[mlItemId]` que en un solo JSON devuelve:

1. **State pre** del sistema (variantes con stock_qty antes de force sync).
2. **Acción** ejecutada (force sync bypass webhook).
3. **State post** (variantes con stock_qty después).
4. **Eventos relacionados** (últimos 5 webhooks recibidos para ese MLA).
5. **Diagnosis hints** human-readable: "Si X entonces problema en Y, mirá Z".

Esto permite al founder no-técnico mandarme un solo JSON y yo identifico la causa exacta sin necesidad de ping-pong de "y ahora mirá esto otro".

### Por qué funcionó

3 causas con MISMO síntoma para el usuario:
- Webhook no configurado → ningún evento llega.
- Webhook configurado pero procesamiento falla → eventos con status=failed.
- ML reporta el mismo stock (cambio no se guardó) → events OK pero sync.skipped > 0.

Un endpoint que mide cada una en respuesta única elimina la necesidad de check separados por SQL/logs/etc. Diagnosis hints en respuesta convierte raw data en acción concreta para el founder.

### Cuándo aplicar

- Bugs reportados por usuario donde hay 3+ causas posibles con síntoma idéntico.
- Sistemas con múltiples capas (webhook + DB + cache + UI) — el bug puede estar en cualquiera.
- NO aplicar para bugs con causa única obvia — overkill.

### Patrón replicable

Shape de endpoint debug:
```
{
  pre: <estado antes>,
  action_result: <qué intentó hacer>,
  post: <estado después>,
  recent_related_events: <últimos N eventos relacionados>,
  diagnosis_hints: { case_A: "...", case_B: "...", case_C: "..." }
}
```

Aplicar a futuros debugs (MP webhook drift, Andreani tracking, etc).

## 2026-05-29 — Sync real-time end-to-end requiere revalidatePath, no solo UPDATE de DB

**Categoría**: Sync / Cache invalidation / Next.js ISR
**Confianza**: 🟢 Alta (validado tras feedback "stock debe ser real-time")

### Qué funcionó

Sprint 2b iter 1 sincronizaba ML → DB en segundos vía webhook. Founder pidió "casi tiempo real" y noté el bloqueador: ISR cache de Next.js (`revalidate=300` en páginas de producto) mantenía la página estática con stock viejo hasta 5 min después de la actualización en DB.

Solución: `revalidatePath` automático en `syncStockFromMLItem` post-UPDATE. Invalida cache de:
- Página producto: `/{cat}/{brand}/{slug}`
- Página marca: `/{cat}/{brand}` (muestra in_stock_count)
- Página categoría: `/{cat}` (AggregateOffer + sub-categorías)

Resultado: lag end-to-end del usuario final pasa de 5 min (DB actualizada + cache viejo) a <5 segundos (webhook + revalidate inmediato).

### Por qué funcionó

"Real-time" tiene 2 capas que se confunden:
1. **Datos actualizados** (DB).
2. **UI mostrando los datos actualizados** (frontend).

Optimizar solo #1 da falso sentido de seguridad — métricas internas muestran "stock actualizado en 3 segundos" mientras el usuario ve número viejo durante 5 minutos. ISR cache es invisible en métricas de DB pero visible para el usuario.

revalidatePath cierra el loop entre las 2 capas.

### Cuándo aplicar

- Cualquier dato que cambia en DB Y se muestra en página cacheada (ISR, SSG con revalidate, edge cache).
- Especialmente para datos sensibles a precisión: stock, precio, status de pedido, disponibilidad.
- NO aplicar para data verdaderamente eventual-consistent (newsletter subscribers count, page views, vistos hoy).

### Trade-off documentado

revalidatePath cada vez que cambia stock genera más rebuilds de página. Para volúmenes bajos-medios (decenas de updates/hora), es despreciable. Para alto volumen (cientos/hora) considerar:
- Throttle: solo invalidar si pasó >N segundos desde la última invalidación de ese path.
- Batch: agrupar invalidaciones por minuto.

## 2026-05-29 — Defense in depth para sync stock: webhook + cron + idempotencia + best-effort outbound

**Categoría**: Integraciones / Resiliencia
**Confianza**: 🟢 Alta (patrón estándar de la industria)

### Qué funcionó

Sprint 2b ML sync NO confía en un solo mecanismo. 4 capas:

1. **Webhook real-time** (inbound): bajo lag, pero ML puede fallar al mandarlo.
2. **CRON cada 6h** (backup inbound): pesca drift si webhook falla. Lag aceptable.
3. **Idempotencia explícita** (tabla `marketplace_webhook_events` con id PK): webhook duplicado por retry de ML no procesa 2 veces.
4. **Outbound best-effort** post-checkout: si ML rechaza el PUT por timeout/rate-limit, el cron de la siguiente hora reconcilia. Sin bloquear el checkout.

Sin defense in depth, fallos serían:
- Solo webhook → ML no manda + perdés ventas con stock divergent.
- Solo cron → lag de 6h en updates de stock → oversell durante esa ventana.
- Sin idempotencia → ML retry → procesar la misma venta 2 veces → stock_qty negativo.
- Outbound bloqueante → ML down → checkout falla → pierden clientes que pagaron OK en Mercado Pago.

### Por qué funcionó

Cada capa cubre un modo de falla del resto. La combinación tiene "soft failure": si UNA capa falla, las otras compensan; si TODAS fallan simultáneamente, hay alertas (logs en `marketplace_sync_errors`) para diagnóstico manual.

### Cuándo aplicar

- Cualquier sync bidireccional con servicio externo (ML, Stripe, Shopify, contabilidad).
- Donde el costo de drift es alto (oversell, doble cobro, contadores inflados).
- NO aplicar para data read-only que se refresca de un solo lado (ej: catálogo importado donde el sitio es fuente de verdad).

### Patrón replicable

Webhook + CRON + idempotencia + outbound es el cuádruple defense in depth estándar. Para futuras integraciones (MP webhook real, Andreani tracking, etc), reusar este shape.

## 2026-05-29 — Cierre formal del ciclo apply: registrar en CLOUD_APPLIED.md + borrar bootstrap derivado tras "todo aplicado"

**Categoría**: Workflow / Schema management operativo
**Confianza**: 🟢 Alta (validado en 4+ ciclos apply hoy)

### Qué funcionó

El ciclo end-to-end de cada SQL apply tiene 3 fases ortogonales:

1. **Generación**: asistente crea migration/seed + concatena en `supabase/cloud-bootstrap.sql` (gitignored).
2. **Apply**: founder copia bootstrap → SQL Editor → Run → confirma "aplicado".
3. **Cierre**: asistente registra en `supabase/CLOUD_APPLIED.md` la fila correspondiente + borra `cloud-bootstrap.sql` (es derivado, regenerable).

Saltarse la fase 3 produce drift entre lo que está aplicado en cloud y lo que el repo dice. Si tras 5 sprints el founder olvida qué aplicó, el archivo CLOUD_APPLIED.md se vuelve inconfiable.

Hoy mantuve el ciclo riguroso: cada "aplicado" del founder → entry inmediato en CLOUD_APPLIED.md con fecha + descripción + notas relevantes (env vars seteadas, GAPS pendientes, dependencias). Resultado: el archivo es source of truth confiable.

### Por qué funcionó

CLOUD_APPLIED.md no es solo log histórico — es **input crítico para asistente en sesiones futuras**. Sin él, al inicio de cada sesión tengo que preguntar al founder "¿está la migration X aplicada?" — costo de fricción. Con él, leo el archivo y sé el estado.

### Cuándo aplicar

- Cualquier proyecto con DB managed remoto donde el flujo apply NO es automático (cloud SQL Editor, ServerlessSQL apply, etc).
- Especialmente cuando hay múltiples apply en una sola sesión (el riesgo de olvidar registrar uno crece linealmente).
- NO aplicar para DB con CI/CD automático (Supabase CLI / GitHub Actions) — ahí el commit del migration ES el registro.

### Bonus: borrar bootstrap derivado tras apply

`cloud-bootstrap.sql` queda gitignored porque es regenerable. Tras apply, borrarlo evita que: (a) en la próxima sesión se confunda con un apply pendiente, (b) el founder lo aplique 2 veces por error.

## 2026-05-29 — UNIQUE composite (item_id, variation_code) para multi-variation en marketplaces

**Categoría**: Schema design / Integraciones de marketplaces
**Confianza**: 🟢 Alta (validado con Vulk Day Light 2 variantes / 1 MLA)

### Qué funcionó

ML soporta **listings con variations** (un MLA con N color/talle/etc, cada uno con stock y seller_sku propio). El schema original del sprint 2a asumía 1 variante DB = 1 MLA distinto (UNIQUE en `mercadolibre_item_id`). Cuando founder pidió vincular 2 variantes Vulk al mismo MLA, la constraint las rechazaba.

Fix: DROP UNIQUE individual + ADD column `mercadolibre_variation_code` + UNIQUE composite `(item_id, variation_code)`. Esto:
- Permite 2 variantes con el mismo MLA (caso multi-variation).
- Sigue garantizando unicidad: un (MLA, variation_code) → 1 variante DB.
- NULLs DISTINCT (default Postgres): variantes sin mapping ML (`NULL, NULL`) no chocan entre sí.

### Por qué pasó el sprint 2a con asunción equivocada

Sprint 2a iter 1 mapeaba items single-variation (modelo simple). Founder me dio un caso single-variation primero (rusty-yau MLA1432137395), validamos el patrón. Recién con el 2do producto (Vulk Day Light) emergió el caso multi-variation. La asunción "1:1" sobrevivió porque no había caso adversarial al principio.

### Regla preventiva

Para integraciones con marketplaces que soportan multi-variation:
1. **Investigar el modelo de variations del marketplace** ANTES del primer mapping. ML, MercadoShops, Tiendanube, Shopify — todos soportan variations pero con APIs distintas.
2. **Modelar el schema con composite key desde el inicio** si el marketplace lo soporta, aunque iter 1 solo use single-variation. Refactorear después tiene costo de migration + posible pérdida de data si no manejas el rename con cuidado.
3. **`mercadolibre_variation_code`** debe ser el campo que el seller controla en ML (seller_custom_field o seller_sku), no el variation_id numérico generado por ML — el primero es estable y editable, el segundo cambia si el seller borra y recrea variations.

### Cuándo aplicar

- Cualquier integración con marketplace que tenga variation_id concept.
- Cuando el sync va a ser bidireccional (marketplace ↔ DB local con stock real).
- NO aplicar para listings 100% catalog (donde tu DB es la fuente y marketplace es solo display) — ahí el variation_id local alcanza.

## 2026-05-29 — RAISE NOTICE pre-DELETE en cleanups SQL para verificación visual

**Categoría**: SQL operations / Cleanup safety
**Confianza**: 🟢 Alta

### Qué funcionó

Para el cleanup del producto residual `rusty-yau-polarizado`, en lugar de un `DELETE` directo, agregué un bloque `DO $$` previo con `RAISE NOTICE 'Productos a borrar: %', v_count;`. Antes de que la transacción ejecute el DELETE, el founder ve en logs del SQL Editor cuántas filas va a borrar.

Bonus: si el cleanup ya se aplicó previamente (idempotencia), el NOTICE dice "Ya está limpio" en lugar de un silent 0-row delete que daría sensación de error.

### Por qué funcionó

`DELETE FROM ... WHERE slug = '...'` no devuelve info útil al founder (no-técnico) cuando lo ejecuta en SQL Editor. Sin verificación, no sabe:
- ¿Borró algo? ¿Ya estaba limpio? ¿El WHERE estaba mal?

RAISE NOTICE convierte la operación silenciosa en feedback visible. Cero costo de performance (es un SELECT COUNT antes del DELETE), gran mejora de confianza.

### Cuándo aplicar

- Cualquier DELETE / UPDATE de cleanup ejecutado manualmente por non-tech (founder, ops).
- Especialmente para operaciones idempotentes (si las corrés 2 veces, no debería pasar nada — RAISE NOTICE confirma).
- NO aplicar para DELETEs de alta frecuencia desde código (overhead innecesario, plus no hay log a leer).

## 2026-05-29 — Aspect ratio del contenedor debe matchear el aspect ratio de la data, no la convención

**Categoría**: UI / Aspect ratio / Iteración con feedback de data real
**Confianza**: 🟢 Alta (validado tras iter 4 del product page)

### Qué funcionó

Tras 3 iteraciones intentando agrandar la foto (reducir padding p-20 → p-8 → p-4 → p-2), founder seguía viendo la foto chica. Recién en iter 4 vi: el contenedor era `aspect-square` (1:1) pero las fotos del founder eran 1500x1000 (3:2 horizontal). Con `object-contain`, la foto se centra dentro del cuadrado y deja barras vacías arriba/abajo del 33% del alto cada una. No importa cuánto reduzcas el padding, la barra vacía sigue ahí.

Fix: `aspect-[3/2]` matchea la foto real → 100% del contenedor ocupado por la foto.

### Por qué pasaron 3 iteraciones sin verlo

Asumí "aspect-square es estándar para producto" (Amazon, ML, etc usan cuadrado). Pero esas tiendas tienen fotos cuadradas o cuadran las fotos antes de subirlas. Las fotos del founder vienen 3:2 porque son fotos profesionales con composición horizontal.

Bias de "default web estándar". El default web no es universal — depende de qué data real tenés.

### Regla preventiva

Cuando elijas aspect ratio para contenedor de imagen/video:
1. **Calcular el ratio promedio de las fuentes de data reales**. Si tenés 10 productos con fotos, qué ratios tienen.
2. **No copiar "lo que hace Amazon"** sin verificar que tus fotos tengan el mismo ratio.
3. Si los ratios son inconsistentes, considerar: (a) normalizar uploads (pedir al uploader cropear a un ratio fijo), (b) usar `object-cover` que llena el contenedor cortando lo que no entra, (c) aceptar barras vacías como costo.

### Cuándo aplicar

- Cualquier UI con contenedor de imagen donde la foto NO la genera el sitio (UGC, importada, fotos del fabricante).
- Especialmente cuando el feedback recurrente es "se ve chica" pese a reducciones de padding/spacing — pista clara de mismatch de aspect ratio.

## 2026-05-29 — Refactor estructural > sucesivos parches cuando el problema es del layout, no del componente

**Categoría**: UI / Layout structure / Iteración
**Confianza**: 🟢 Alta (validado tras 3 iteraciones del producto page)

### Qué funcionó

Founder reportó bloque blanco en col derecha. Iter 1: agregué cross-sell sidebar en la col derecha para llenar el espacio. Iter 2: founder dijo "sigue mal", compacté el sidebar (2 items, padding chico). Iter 3: founder dijo "sigue mal, ahora a un costado". Recién en iter 3 entendí que el problema NO era el contenido del sidebar — era la asimetría estructural del grid. La col izquierda tenía gallery + "Lo que incluye"; la col derecha tenía info + ficha + medidas. SIEMPRE una iba a ser más alta que la otra.

Solución estructural en iter 3: mover "Lo que incluye" de col izquierda a col derecha. Col izquierda queda solo con gallery (siempre la misma altura sin importar contenido); col derecha junta toda la info en orden lineal de venta. NO más sidebar. NO más asimetría.

### Por qué pasé 2 iteraciones sin verlo

Sesgo "ya implementé X, ajustemos X". Cada iter optimicé el sidebar como si fuera la solución. Cuando founder dijo "sigue mal" la 2da vez, todavía pensaba en achicarlo más. Recién al tercer feedback abstraje: "el problema no es el sidebar, es que existe una col más alta que la otra estructuralmente".

### Regla preventiva

Cuando un feedback se repite tras un fix:
1. **Si el 1er fix no resolvió, el 2do fix del MISMO componente probablemente tampoco lo haga.** Hay que cuestionar la premisa del approach.
2. **Volver al problema original** (no al fix iterado). "El bloque blanco está mal" — ¿el bloque blanco existe por X solución o por estructura del layout?
3. **Refactor estructural** (cambiar layout, mover componentes) suele ser más barato que N parches del mismo componente.
4. Patrón: si vas por la 3ra iteración del mismo file/componente y el problema sigue, hay 90% de probabilidad que la solución está en otro lado.

### Cuándo aplicar

- UI iterativa con feedback del founder.
- Especialmente layouts donde el "vacío" o "exceso" es síntoma de mismatch entre dos columnas/secciones.
- NO aplicar para bug fixes específicos (un fix de prop name o un null check es local — refactor estructural sería overkill).

## 2026-05-29 — Padding por defecto pensado para data hipotética: revisarlo cuando llegue data real

**Categoría**: UI / Decisiones de defaults
**Confianza**: 🟢 Alta (validado por iteración con foto real del founder)

### Qué funcionó (tras corrección)

ProductGallery tenía `p-10 sm:p-14 md:p-20` (40/56/80px de padding interno) con un comentario justificando: "Padding generoso porque las fotos originales del fabricante vienen muchas veces sin aire propio — el anteojo toca los bordes del JPG. El padding del wrapper compensa eso."

Decisión defensible en abstracto, pero cuando el founder subió fotos reales (Rusty Yau con anteojo centrado y margen propio), el padding del contenedor + el margen de la foto = **double padding**: anteojo ocupaba solo ~60% del cuadrado visible. Founder feedback inmediato: "Fotos se ven muy pequeñas, hay que agrandarlas".

Reduje a `p-4 sm:p-6 md:p-8` (16/24/32px). Para fotos con aire propio (mayoría hoy), el anteojo ocupa ~80%. Para fotos sin aire (caso hipotético del comentario original), el padding moderado sigue dando algo de respiro.

### Por qué pasó originalmente

Sesgo de "hace falta cubrir el peor caso". Diseñé defensivo para fotos sin margen, sin tener data real. Cuando llegó la data real, el default era 2x más conservador de lo necesario.

### Regla preventiva

Para defaults que afectan presentación visual (padding, font-size, gap, max-width):
1. **Empezar conservador del lado opuesto** (menos padding/spacing) y agregar si la data real lo pide.
2. **Recibir feedback de data real** ANTES de fijar el default. Si todavía no hay productos cargados, dejarlo como TODO en lugar de elegir un valor "razonable" en abstracto.
3. **Cuando elegís default defensivo "por las dudas"**, marcar comentario explícito tipo `// TODO: revisar cuando haya 5+ productos reales` para no olvidarlo.

### Cuándo aplicar

- Cualquier componente UI que muestra contenido user-generated o de fuente externa (productos, imágenes, copy).
- Especialmente componentes con espaciado generoso "por estética" — la estética sin contenido real es opinión, no validación.

## 2026-05-29 — Producto vs variante: el `name`/`slug` del producto NO incluye atributos de variante

**Categoría**: Schema de catálogo / Identidad de producto
**Confianza**: 🟢 Alta (validado tras corrección del founder en Rusty Yau)

### Qué funcionó (tras corrección)

Founder corrigió: el nombre del producto era "Rusty Yau Polarizado" (mi versión inicial) cuando debería ser solo "Rusty Yau" (el modelo). Polarizado es atributo del PAR DE LENTES que viene incluido en la variante específica (variante actual: gris oscuro polarizado + amarilla; variantes futuras pueden tener: negro espejado + amarilla, plata espejado + amarilla, etc.).

Refactor:
- `name`: "Rusty Yau" (modelo)
- `slug`: `rusty-yau` (URL canónica del modelo)
- Atributos como polarización/color de lente → en variant attributes o en `attributes.lenses_included` del producto base si son comunes.

### Por qué pasó originalmente

ML guarda título como "Anteojos De Sol Lente Rusty Yau Mblk/s10 Polarizado Ciclismo Gris Oscuro - Amarilla Negro Mate" — toda la info del producto + variante en un solo string. Cuando mapeé al schema del proyecto, copié el espíritu del título de ML sin separar:
- **Identity del modelo** ("Rusty Yau") → al producto
- **Atributos de variante** (polarizado, gris oscuro, negro mate) → a la variante

Resultado: incluí "Polarizado" en el nombre del producto cuando debía estar solo en la variante.

### Regla preventiva

Al generar producto base + variantes:
1. **`products.name/slug` = MODELO** (nombre comercial del producto independiente de variante: "Rusty Yau", "Vulk Day Light", "Ray-Ban Aviator").
2. **`product_variants.attributes` = ATRIBUTOS QUE VARÍAN** entre variantes del mismo modelo (color frame, color lens, tratamiento de lente si es específico de la variante).
3. **`products.attributes` = COMÚN A TODAS LAS VARIANTES** (forma del armazón, material del frame si no cambia, género target, medidas).
4. Si dudás: imaginá la 2da variante hipotética. Si cambiar un campo entre las dos rompe la analogía → ese campo NO va en `products`.

### Cuándo aplicar

- Cualquier import / carga manual de producto con potencial de N variantes.
- Especialmente productos con lentes intercambiables, colores múltiples, tamaños — donde la tentación de "describir lo que veo ahora" mete atributos de variante en producto.
- NO aplicar para productos verdaderamente single-SKU sin posibilidad de variantes (raro en óptica).

## 2026-05-29 — Founder llena GAPS asincrónicamente con foto + datos en 1 mensaje (complemento al import ML)

**Categoría**: UX founder no-técnico / Import workflow
**Confianza**: 🟢 Alta (validado completo con Rusty Yau)

### Qué funcionó

Tras generar seed con GAPS marcados explícitamente (peso, medidas, SKU, imágenes), el founder envió en UN SOLO mensaje:
- Las 3 fotos directo en el chat
- El SKU como texto plano: "SKU 126080"
- La aclaración: "la foto 3 son las medidas"

Procesé las medidas leyendo la imagen (135mm ancho, 66x45mm lente, 16mm puente, 120mm varilla) sin requerir que el founder las transcribiera. Edit del seed + bootstrap regenerado + commit en ~2 minutos.

Esto cerró 4 de 5 GAPS (peso queda pendiente) sin necesidad de back-and-forth con preguntas estructuradas.

### Por qué funcionó

El founder, al mandar la foto del esquema técnico, transmitió las 5 medidas con CERO esfuerzo de transcripción. Si hubiera usado AskUserQuestion pidiendo cada medida individualmente, hubieran sido 5 preguntas + 5 respuestas tipiadas + riesgo de error de tipeo.

La capacidad del modelo de leer datos estructurados de imágenes (medidas, etiquetas, fichas técnicas) hace que el patrón "mandame foto" sea más eficiente que "transcribime los datos" cuando los datos están en formato visual.

### Cuándo aplicar

- GAPS de data que existen en formato visual (esquemas técnicos, etiquetas de producto, fichas del fabricante, recibos).
- NO aplicar cuando los datos no están en formato visual (precios de costo del distribuidor, decisiones de marketing, copy).
- Combinar con "marcar GAPS explícitos en seed" del patrón complementario — sin marcar gaps, founder no sabe qué traer; sin patrón visual, transcribir es fricción.

### Validación del patrón completo (2 entries combinadas)

`patrón import ML` (entry previa) + `gaps via foto/mensaje` (esta entry) = **workflow completo**:
1. Genero seed con GAPS marcados como comentarios.
2. Founder responde con foto/datos para cerrar gaps.
3. Edit seed in-place, regenero bootstrap, commit.
4. Founder aplica + sube assets.

Tiempo total desde JSON ML hasta producto listo para cloud apply: ~30 min de mi lado, ~10 min del founder.

## 2026-05-29 — Import producto desde ML: parsear JSON → schema + marcar GAPS explícitos en SQL

**Categoría**: Integraciones ML / Import de catálogo
**Confianza**: 🟡 Media (1 producto importado — confirmar con N=3 antes de promoverlo a regla)

### Qué funcionó

Para importar Rusty Yau (MLA1432137395), seguí este flujo:

1. **Fetch JSON crudo** via endpoint admin (`/api/admin/ml-find-item/{id}`).
2. **Mapear JSON → schema del proyecto** (PRODUCT_SCHEMA.md): qué campos hay match directo, qué falta, qué necesita enum nuevo.
3. **Identificar GAPS antes de presentar al founder**: peso real (ML reporta el del paquete, no el anteojo), 2 medidas (frame_width + lens_height) que ML no incluye, SKU interno (ML solo tiene su MLA).
4. **AskUserQuestion con preview**: 3 preguntas (frame_shape mapping, gaps handling, imágenes) — founder decidió en 1 turno.
5. **Generar seed SQL con GAPS marcados en comentarios explícitos** (no inventar valores ni dejar `null` silencioso).
6. **Bootstrap derivado** para founder aplicar al cloud.

### Por qué funcionó

JSON ML tiene info abundante pero NO matchea 100% el schema del proyecto. La tentación es:
- (a) Inventar lo que falta → contamina catálogo con data falsa.
- (b) Dejar campos NULL silencioso → casilleros vacíos en comparador, peor UX.

Marcar GAPS en comentarios del seed (`-- ⚠️ founder mide peso real y hace UPDATE`) hace 2 cosas:
- Founder ve qué falta cuando aplica el SQL.
- Documenta la deuda técnica del registro (alguien que lea el seed en 6 meses entiende qué pasó).

### Cuándo aplicar

- Cualquier import bulk desde fuente externa (ML, distribuidor, scrap de web fabricante).
- NO aplicar para registros manuales del founder (ahí cada campo lo confirma, no hay gaps).
- Para promoverlo a regla operativa estable, necesito ver el patrón funcionar con 2-3 imports más (otras marcas, otros catálogos).

### Decisión clave de schema

`frame_shape: 'wraparound'` (nuevo valor) agregado solo a `FRAME_SHAPE_LABELS` en TypeScript — NO migration SQL porque DB usa JSONB free-form. Cualquier valor string es válido en DB; los labels en TS son el "enum de UI". Esto es más rápido pero requiere mantenerlos sincronizados (futuro: extraer a `lib/catalog/enums.ts` compartido).

## 2026-05-29 — Verificar comportamiento real de query params antes de basar lógica en asunción

**Categoría**: API integration / Debugging
**Confianza**: 🟢 Alta (validado en bug ml-find-item v1→v2)

### Qué funcionó (tras error inicial)

Implementé endpoint admin que usaba `/users/{seller_id}/items/search?ids=MLA1432137395` asumiendo que `?ids=` filtraba a un item específico. Cuando founder lo abrió, devolvió los **primeros 50 items del seller** (paging.total=895), sin filtrar — el `?ids=` query param fue silently ignored.

Refactor v2: cambio al endpoint correcto para lookup `/items?ids=MLA...` (multi-get). Este SÍ acepta `?ids=` como filtro y devuelve array `[{code, body}]` por cada ID solicitado.

### Por qué pasó

Asumí que `?ids=` filtraba en cualquier endpoint que lo aceptara como query param. Pero ML tiene dos endpoints distintos:
- **`/users/{seller_id}/items/search`**: pensado para LISTAR items del seller con filtros (status, category, etc). `?ids=` no es un filtro válido — se ignora.
- **`/items?ids=...`** (plural): pensado para LOOKUP de items específicos por IDs (multi-get). Acá `?ids=` SÍ es el filtro principal.

Sin docs claras de ML, la única forma de saber era probarlo o leer docs específicas de cada endpoint.

### Regla preventiva

Cuando uses un query param que no es estándar HTTP (ej `?ids=` que no es como `?filter=` u `?offset=`):
1. **Probar con un query trivial primero** (`curl` o browser) antes de basar lógica en su comportamiento.
2. Si el response no tiene el shape esperado (ej trae más items de los pedidos), sospechar que el param fue ignorado.
3. Revisar docs específicas del endpoint, no asumir comportamiento por familia (ej "todos los endpoints de items aceptan ?ids=").

### Cuándo aplicar

- Integraciones con APIs externas con docs parciales (ML, AFIP, etc).
- Especialmente para endpoints "search" / "list" / "lookup" que pueden tener semánticas distintas.
- Patrón general: si la respuesta no matchea el query, el query probablemente fue ignorado — no asumir bug del servidor.

## 2026-05-29 — ML usa endpoints distintos según status del item — usar el correcto para diagnóstico

**Categoría**: Mercado Libre / API design quirks
**Confianza**: 🟢 Alta (validado en debug MLA1432137395)

### Qué funcionó

`/items/{id}` de ML devuelve **404** para items que NO están en status `active` (paused, closed, finalized). Si esperabas un "item con status=paused" en la respuesta, te quedás sin info: el 404 no diferencia entre "no existe" y "no está active".

Para diagnóstico (saber si el item ES tuyo y en qué status está), usar `/users/{seller_id}/items/search?ids=MLA...`:
- Devuelve el item con su status real (active/paused/closed/under_review).
- `results` vacío = item no es de esa cuenta.
- `results` con el ID = item es tuyo + status disponible.

### Por qué funcionó

Endpoint `/items/{id}` está pensado para CONSUMERS (compradores viendo un producto activo) — 404 si no se puede comprar es UX correcta para ellos. Endpoint `/users/{seller_id}/items/search` está pensado para SELLERS gestionando su catálogo — devuelve TODO sin filtrar.

Usar el endpoint correcto según contexto (consumer vs seller) evita falsos negativos.

### Cuándo aplicar

- Cualquier integración con API que tenga endpoints "vista pública" vs "vista admin/seller".
- Diagnóstico de "item desapareció": probar el endpoint de seller antes de asumir que fue borrado.
- Patrón general: si un GET devuelve 404 para algo que el usuario CONFIRMA que existe, probablemente hay un endpoint alternativo con visibilidad más amplia.

## 2026-05-29 — Enforce single-account model en el WRITE path, no solo en el read

**Categoría**: Diseño de schema / Integraciones multi-cuenta
**Confianza**: 🟢 Alta (validado tras bug ML "no_integration" con 2 rows activas)

### Qué funcionó

Tras descubrir que `getActiveMLIntegration` returnaba null silencioso porque había 2 rows activas, no me limité a fixear el read path. Modifiqué TAMBIÉN el write path (`upsertMLIntegration`) para que ANTES del upsert revoque cualquier otra integración activa del mismo marketplace con distinto user_id. Esto enforça el single-account model en el momento del cambio, no solo cuando se lee.

### Por qué funcionó

Single-account es una **invariante del dominio** ("solo 1 seller autorizado por marketplace a la vez"). Hay 3 lugares donde enforce:

1. **Schema (DB)**: UNIQUE partial index `WHERE status='active'`. Defensa más fuerte (Postgres rechaza el INSERT).
2. **Write path (app)**: el upsert revoke otras activas antes de crear. Defensa secundaria, funciona sin schema constraint.
3. **Read path (app)**: defensive query con `.order().limit(1)`. Solo soft defense, no enforça nada.

Tener SOLO #3 (mi código original) es lo peor de los 3 mundos — el sistema parece funcionar mientras la invariante se rompe silenciosamente.

### Cuándo aplicar

- Cualquier modelo single-tenant / single-active / "el último gana".
- Idealmente: #1 + #2 (defense in depth). El read path no debería ser el único que mantenga la invariante.
- Si #1 no es posible (RLS, migrations costosas), #2 es el mínimo aceptable.

## 2026-05-29 — Endpoints admin de diagnóstico hacen fetch raw + DB summary (bypass abstracciones productivas)

**Categoría**: Observabilidad / Debugging de integraciones
**Confianza**: 🟢 Alta (validado en debug ml-me v2)

### Qué funcionó

`mlFetch` (cliente HTTP productivo) mapea 404 → `'not_found'` sin más contexto: descarta body, status text, headers. Decisión correcta para consumers normales (no quieren acoplarse a detalles de ML), pero **inútil para debug** cuando el 404 es inesperado y necesitás ver el body raw.

Solución: endpoint admin `ml-me` v2 hace fetch RAW directo a ML (bypass `mlFetch`) + concatena `integration_summary` con state del DB (externalUserId guardado, status, tokenExpiresAt, lastErrorMessage, token_preview). Output tiene 3 capas de info:
1. **Request**: URL, método.
2. **Response real de ML**: status, statusText, body parsed/raw.
3. **DB state**: lo que tenemos guardado (vs lo que ML dice). Detecta drift.

### Por qué funcionó

Endpoints admin de debug NO comparten objetivos con los productivos:
- Productivos: **abstraer** detalles del proveedor, devolver shape estable, no acoplar consumers.
- Debug: **exponer** detalles del proveedor, mostrar drift entre estado local y remoto.

Forzarlos a usar la misma capa de cliente (mlFetch) pierde info crítica. La separación clara permite que cada uno cumpla su rol.

### Cuándo aplicar

- Cualquier integración con servicio externo (ML, Stripe, AFIP, Resend, etc) donde tengas: (a) cliente productivo abstracto, (b) state local en DB que debe matchear el remoto.
- Endpoint admin debe incluir AMBAS perspectivas (raw remoto + DB state) — solo uno no detecta drift.
- NO aplicar para endpoints productivos — mantener la abstracción ahí es lo correcto.

## 2026-05-29 — Verificar nickname público de user_id ML antes de re-autorizar a ciegas

**Categoría**: OAuth diagnóstico / Mercado Libre
**Confianza**: 🟢 Alta

### Qué funcionó

Tras el OAuth flow, founder pasó `user_id=81654493`. Pero el endpoint admin devolvió 404 para el item que el founder afirmaba era de su Tienda Oficial OPTICACARBALLO. Antes de pedir re-autorización (acción costosa: founder tiene que loguear/deslogear cuentas múltiples), propuse verificación rápida con endpoint público de ML: `https://api.mercadolibre.com/users/{user_id}` devuelve nickname público.

Si nickname = OPTICACARBALLO → autorización correcta, 404 es por otra razón (item cerrado, etc).
Si nickname ≠ OPTICACARBALLO → confirmar cuenta equivocada → re-autorizar con logout previo.

### Por qué funcionó

Endpoints `/users/{id}` de ML son públicos (no requieren auth) — diseñados para mostrar perfil del seller a compradores. Devuelven nickname, registration_date, reputación, etc. Para diagnóstico de "¿qué cuenta autorizó OAuth?", esto es 1 click vs alternativas costosas:
- Agregar endpoint admin `/api/admin/ml-me` que use el token (requiere deploy).
- Pedir al founder loguearse/deslogearse a ciegas (frustrante si después era otra cosa).

### Cuándo aplicar

- Cualquier OAuth donde el proveedor expone endpoint público de identidad por user_id (ML, GitHub `/users/{id}`, etc).
- Especialmente útil en flows multi-cuenta donde la identidad autorizada es ambigua.
- NO aplicar para OAuth donde la identidad NO es pública (Google, Auth0 con datos sensibles) — ahí necesitás endpoint que use el access_token.

### Bonus: distinguir IDs de Mercado Libre

URLs de ML tienen 2 tipos de IDs:
- **`MLA<digits>`** (ej `MLA1432137395`): item específico de un seller. Es el ID que acepta el endpoint `/items/{id}` para fetch.
- **`MLAU<digits>`** (ej `MLAU384055931`): catalog product (Catalogación) que agrupa múltiples sellers de un mismo modelo.
- En URLs de catálogo, el `wid=MLA...` query param es el item ID del seller específico que la página muestra.

Cuando founder pasa una URL, parsear con cuidado para extraer el ID correcto.

## 2026-05-29 — OAuth multi-cuenta: validar identidad de cuenta autorizada antes de operar

**Categoría**: OAuth / Integraciones multi-tenant
**Confianza**: 🟢 Alta (validado en re-auth ML para import MLA1432137395)

### Qué funcionó

Para el sprint de import MLA1432137395 (producto en cuenta ML distinta a la previamente autorizada), tras el OAuth flow el founder pasó `?ml_oauth=success&user_id=81654493`. Antes de avanzar al endpoint de import, **validé que el `user_id` retornado fuera distinto al anterior** (`1975674`). Si hubiera sido el mismo (cookie de sesión ML re-autorizando la cuenta vieja sin que el founder lo note), todo el flow posterior fallaría con 403 igual que el intento anterior.

Si los IDs hubieran matcheado, mi respuesta hubiera sido: "ML te re-autorizó con la cuenta vieja por cookie de sesión — cerrá sesión en ML primero y volvé a probar". Diagnóstico anticipado en lugar de errores reactivos.

### Por qué funcionó

OAuth no garantiza identidad. La cuenta autorizada depende de qué cuenta tenía sesión activa en el proveedor (ML, Google, etc) al momento de aprobar. En multi-cuenta del mismo usuario, esto produce silent bugs: el flow técnico es OK (tokens válidos, callback exitoso) pero la cuenta semánticamente incorrecta. Validar el identificador retornado (sub, user_id, sub-account ID) es la única protección.

### Cuándo aplicar

- Cualquier OAuth con proveedor donde el usuario puede tener múltiples cuentas (Google personal/work, ML personal/empresa, GitHub personal/org).
- Si el caso de uso requiere una cuenta específica, mostrar el ID autorizado al usuario para confirmación visual ANTES de operaciones.
- Para multi-tenancy genuino: guardar el `account_id` retornado junto al token y usarlo como discriminator en queries.

## 2026-05-29 — Hipótesis "factor externo" solo DESPUÉS de verificar el código local

**Categoría**: Debugging / Bias de diagnóstico
**Confianza**: 🟢 Alta (validado por error propio en incident password reset)

### Qué pasó

Founder reportó "El link de reset password me da error apenas lo uso". Hipótesis instintiva mía: Microsoft Safe Links (Hotmail prefetchea URLs y consume el code). Pregunté al founder qué cliente de email usa → confirmó Hotmail → mi hipótesis se reforzó falsamente. Estaba a punto de proponer soluciones complejas (página intermedia con confirmación manual, OTP flow, etc).

Auditoría del código reveló que el flow estaba **estructuralmente roto** independiente del cliente de email: `passwordResetForEmail.redirectTo` apuntaba directo a la página final sin pasar por `/auth/callback`, así que nunca se ejecutaba `exchangeCodeForSession`. El error pasaba con cualquier cliente de email — Gmail, Hotmail, lo que fuera.

### Por qué pasó

Bias de confirmación: el síntoma encajaba con un problema conocido (Safe Links). El founder confirmó la variable que reforzaba mi hipótesis. Salté a "solución" antes de descartar causas más simples.

### Regla preventiva

Orden de hipótesis al debuggear bugs de auth/network/email:

1. **Primero**: el código local está bien implementado? (refactor pequeño puede resolver)
2. **Segundo**: configuración (env vars, dashboard externo) está correcta?
3. **Tercero**: comportamiento del servicio externo (Supabase rate limit, RLS, etc).
4. **Cuarto** y último: factor "externo al sistema" (cliente de email, browser, red corporativa, antivirus, proxies).

Las 1-3 son verificables con herramientas del developer. La 4 requiere coordinación con usuario y suele ser difícil de fixear. Saltar a 4 primero es eficiente cuando el síntoma es muy específico (ej: "solo me pasa en Safari iOS"), pero pernicioso cuando es genérico ("no funciona") — ahí casi siempre es 1-3.

### Cuándo aplicar

- Cualquier bug reportado por usuario donde un "factor externo" parece plausible.
- Especialmente sistemas que tocan: emails, OAuth, webhooks, callbacks, redirects, cookies cross-domain.
- NO aplicar si el síntoma es altísimo-específico de un cliente (ej: solo Safari, solo Firefox iOS) — ahí probablemente sí es 4.

## 2026-05-29 — Auditar primero, NUNCA "arreglar a ciegas" un bug de configuración

**Categoría**: Debugging / Diagnóstico
**Confianza**: 🟢 Alta (validado en incident auth URLs)

### Qué funcionó

Founder reportó "los emails llegan con localhost". Tentación inmediata: cambiar el código a `https://opticacarballo.com.ar` hardcodeado. En lugar de eso, despleé `Explore` subagent con prompt específico (audit auth code para URLs de redirect — 7 puntos concretos). Resultado: el código YA estaba correcto. El bug era de configuración (env var faltante en Vercel).

Sin la auditoría, hubiera:
- Hardcodeado el dominio → roto el dev local.
- O cambiado el código sin necesidad → commit ruidoso que no solucionaba nada.
- O culpado al Supabase Dashboard → founder cambiaba config inútilmente.

### Por qué funcionó

Bugs reportados por usuarios suelen tener síntomas claros y causas confusas. El reflejo de "veo el síntoma, lo cambio" produce 3 tipos de errores:

1. **Fix superficial**: arreglás el síntoma sin entender la causa → vuelve a aparecer en otro contexto.
2. **Fix dañino**: cambiás algo que estaba bien → introducís un bug nuevo.
3. **Fix tardío**: el usuario sigue bloqueado porque tu hipótesis era incorrecta.

Una auditoría previa (5-10 minutos con un Explore agent) elimina las 3 fuentes de error y produce un diagnóstico que el founder puede actuar directamente (en este caso: "es config de Vercel + Supabase Dashboard, no código").

### Cuándo aplicar

- Cualquier bug reportado por usuario con síntoma claro pero causa no obvia.
- Especialmente: emails, redirects, callbacks, webhooks, autenticación — sistemas donde el síntoma puede venir de config, código local, código remoto o servicio externo.
- NO aplicar si la causa es trivialmente obvia (error message claro apunta a línea exacta) — auditar ahí es overhead.

## 2026-05-29 — Sprint completo con cuenta (no MVP) cuando la feature lo justifica

**Categoría**: Scope de sprint / Decisiones de producto
**Confianza**: 🟢 Alta (validado en sprint alertas — founder eligió scope completo conscientemente)

### Qué funcionó

Cuando founder pidió "Alertas de precio o de disponibilidad de stock", en vez de tirar código del scope que YO pensaba correcto, presenté `AskUserQuestion` con 3 opciones de scope (MVP 1h / Intermedio 3h / Completo con cuenta 1d+) con previews ASCII de cada flujo + tradeoffs explícitos (conversión vs UX vs costo de mantenimiento).

Founder eligió "Completo con cuenta" — lo opuesto a lo que un instinto MVP recomendaría. Razón implícita: ya hay base de auth + mi-cuenta funcional, sumar feature ahí escala mejor que tener emails anónimos que no se pueden gestionar.

### Por qué funcionó

Dos lecciones combinadas:
1. **Tradeoff explícito > recomendación dogmática**. El instinto "siempre arrancá con MVP" no aplica cuando la infraestructura ya soporta lo correcto. El MVP hubiera sido deuda técnica desde el día 1 (tabla anónima que después hay que migrar).
2. **El founder no-técnico decide mejor con tradeoffs claros**. Sin las 3 opciones lado a lado, hubiera dicho "lo que vos creas" — y yo hubiera ido al MVP por sesgo. Las opciones le dieron lenguaje para decir "completo" sin tener que justificarlo en tech.

### Cuándo aplicar

- Features con scope grande (>1 hora) donde hay decisiones de producto.
- Sistemas que tocan auth, DB persistente, emails, webhooks — son irreversibles, conviene decidirlo bien.
- NO aplicar para features chicas (<1h) o tweaks UI — preguntar overkilla.
- NO aplicar si la opción "completa" es obviamente over-engineering — solo presentar opciones realistas para el momento del proyecto.

## 2026-05-29 — Baseline snapshot al crear alerta para detectar cambios

**Categoría**: Diseño de schema / Anti-spam en notificaciones
**Confianza**: 🟢 Alta

### Qué funcionó

Al crear una alerta, capturé `baseline_price_cents` + `baseline_in_stock` del estado actual del producto. El CRON compara state ACTUAL vs BASELINE para decidir si disparar email. Tras notificar, actualizo el baseline al nuevo state.

Sin baseline, hubiera necesitado:
- Comparar contra un histórico (tabla `price_history` separada → más complejo).
- O usar solo `last_notified_at` como anti-spam (peor: dispara cualquier baja pequeña repetidamente cuando el cooldown pasa).

### Por qué funcionó

El baseline es un anti-spam estructural, no temporal. Si una alerta sin target tiene baseline $100 y price baja a $90, dispara. Tras notificar, baseline pasa a $90. Para volver a disparar, tiene que bajar de $90 (no rebote a $95 y vuelva a $90 mismo). 

Combinado con cooldown 24h temporal, el usuario solo recibe emails cuando hay cambio REAL relevante. Cero spam.

### Cuándo aplicar

- Cualquier sistema de notificación basado en cambio de state.
- Cualquier feature donde "te avisamos cuando X cambie a Y" — el baseline es lo que define qué es "cambio".
- NO aplicar si el state cambia muy rápido (intraday trading, métricas live) — ahí necesitás threshold % o tiempo.

## 2026-05-29 — Builder contextual de related links — un componente, N comportamientos

**Categoría**: Arquitectura de componentes / DRY pragmático
**Confianza**: 🟡 Media (validado en este caso, ver si escala)

### Qué funcionó

Para el bloque "También podría interesarte" en sub-categorías, en lugar de:
- Opción A: 3 componentes distintos (`RelatedFromShape`, `RelatedFromGender`, `RelatedFromBrand`) con templates similares pero diferente lógica de selección.
- Opción B: 1 componente con prop `links: RelatedLink[]` + 1 función builder `buildRelatedLinks(ctx)` que computa los links según el contexto.

Elegí B. La función pura `buildRelatedLinks` toma un discriminated union (`{type: 'shape' | 'gender' | 'brand', ...}`) y devuelve `RelatedLink[]`. El componente solo renderiza. Separación clara: lógica de selección (data) vs lógica de presentación (UI).

### Por qué funcionó

Ventajas concretas:
- **Una sola UI a mantener** — cambio de estilo se hace en 1 file, no 3.
- **Lógica de selección testeable** sin renderizar — función pura, fácil de validar combinaciones.
- **Extensible**: agregar un nuevo `type: 'product'` (para related products en página detalle) es agregar un branch al switch, sin tocar UI.
- **Sin abstracciones prematuras** — el "ctx" tiene los campos específicos que cada tipo necesita, no un objeto genérico vago.

### Cuándo aplicar

- UI compartida con lógica de población contextual (related links, recommendations, breadcrumbs custom).
- NO aplicar si los renders divergen significativamente — entonces son componentes distintos, no variantes de uno.
- La función builder debe ser pura (sin side effects, sin fetch) — la data viene precomputada del Server Component padre.

## 2026-05-29 — Sub-categoría por género incluye `unisex` (no es excluyente)

**Categoría**: Decisión de producto / Modelado de datos
**Confianza**: 🟢 Alta (estándar de la industria óptica)

### Qué funcionó

Al crear `/anteojos-de-sol/hombre` y `/mujer`, la query `fetchCategoryByGender` filtra `gender IN ('male' | 'female', 'unisex')` en lugar de solo `gender = 'male' | 'female'`. Un anteojo unisex aparece en AMBAS páginas (hombre + mujer), no se excluye de ninguna.

### Por qué funcionó

En óptica (especialmente con marcas como Vulk, Rusty, Mormaii), una porción significativa de modelos son neutros — pensados para ser usados por cualquier género. Excluirlos de las páginas de género produce dos problemas:

1. **Falsos negativos**: usuario entra a "anteojos hombre" y no ve modelos neutros que le servirían perfecto. Catálogo se siente vacío.
2. **Producto desperdiciado**: si solo aparece en `/unisex` (que no existe como ruta SEO porque vol cero), el modelo nunca se descubre vía navegación por género.

Incluir unisex en ambos preserva la intención del filtro (descubrimiento de productos relevantes para el target) sin sacrificar coverage.

### Cuándo aplicar

- Cualquier filtro categórico donde exista una categoría "neutra" o "universal" (unisex, todos los tamaños, todas las edades).
- NO aplicar si el filtro es realmente excluyente por naturaleza (color, talla específica).
- Documentar la decisión en el código (comentario en la query) para que un mantenedor futuro no "corrija" la query a igualdad estricta pensando que es un bug.

## 2026-05-29 — Rutas estáticas para sub-categorías (no querystring) — SEO indexable

**Categoría**: SEO / Arquitectura de rutas
**Confianza**: 🟢 Alta (consenso en SEO técnico)

### Qué funcionó

Las sub-categorías por forma estaban accesibles vía `/anteojos-de-sol?forma=wayfarer` (searchParam), no via path estático. Google ESO no indexa bien — los searchParams se consideran filtros de la misma URL canónica, no páginas distintas. Las queries "anteojos wayfarer" iban a la página de catálogo general, no a una página específica con title/H1/contenido optimizados.

Refactor: creé 13 rutas estáticas `/anteojos-de-{sol,receta}/{shape}` con title, meta description, canonical, breadcrumb, H1, JSON-LD CollectionPage propios. Cada una es una página SEO independiente que puede rankear para su keyword target.

### Por qué funcionó

Reglas de SEO técnico vigentes:
- **Cada cluster de keywords merece su URL canónica única**. "Anteojos wayfarer" ≠ "anteojos de sol" en intent search.
- **Path estático > querystring** para canonicalidad y crawl budget. Google trata `?forma=X` con desconfianza (¿es filtro? ¿paginación? ¿variante?).
- **Mismo backend, distinta presentación**: la query `fetchCategoryByFilter` es la misma, pero las URLs cambian semántica + ranking opportunity.

Adicionalmente, mega-menu actualizado para apuntar a las rutas nuevas — internal linking refuerza la canonicidad y distribuye PageRank a las páginas optimizables.

### Cuándo aplicar

- Cualquier filtro que represente una **categoría comercial real** (forma, material, género, color) → ruta propia.
- Cualquier filtro **utilitario o personal** (orden, precio rango, paginación) → searchParam OK.
- Regla heurística: si querés rankear para esa combinación específica → ruta. Si es solo UX → searchParam.

### Restricción técnica relacionada

Static segments y dynamic segments hermanos: Next 15 prioriza static sobre dynamic. `/anteojos-de-sol/aviador/page.tsx` (static) gana a `/anteojos-de-sol/[brand]/page.tsx` (dynamic) para path `/anteojos-de-sol/aviador`. Esto significa que **ningún brand slug puede coincidir con un shape slug** (aviador, wayfarer, etc.) — restricción registrada implícitamente en `BRAND_FILTERS`.

## 2026-05-29 — AskUserQuestion con preview ASCII para decisiones de UI

**Categoría**: Comunicación con founder no-técnico / UX de decisión
**Confianza**: 🟢 Alta (validado con el sprint mega-menu v2)

### Qué funcionó

Cuando el founder mandó la captura del mega-menu de LensCrafters pidiendo "algo por el estilo y mejor", en vez de implementar a ciegas, usé `AskUserQuestion` con 2 opciones que tenían **preview ASCII del layout** propuesto. Founder eligió en segundos sin tener que leer descripciones largas — vio los rectángulos ASCII y supo cuál quería.

### Por qué funcionó

Founder es no-técnico de programación. Describir layouts con palabras ("3 columnas con panel a la derecha") es ambiguo y la interpretación del modelo puede no coincidir con la mental del founder. ASCII art elimina esa ambigüedad: lo que ve es lo que se va a construir (en estructura, no en estética).

Ventajas concretas:
- Decisión en 1 turno en vez de 3-4 idas y vueltas iterando.
- Founder mantiene control de producto sin necesidad de hablar tech.
- Reduce el riesgo de re-trabajo (founder no rechaza después de implementado).

### Cuándo aplicar

- Cualquier decisión de **layout, jerarquía visual, o estructura de información** donde haya 2-3 opciones distintas.
- NO aplicar para decisiones de estilo fino (colores, tipografía, spacing) — eso necesita verlo real, no ASCII.
- NO aplicar para decisiones tech sin impacto visual (qué librería usar, etc).
- El ASCII debe mostrar **proporciones reales** (columnas, jerarquía de cajas), no detalles de UI.

## 2026-05-29 — Validar URLs linkeables antes de armar nav/mega-menu

**Categoría**: Calidad de código / SEO interno
**Confianza**: 🟢 Alta

### Qué funcionó

Al refactorear el mega-menu, antes de mandar el commit revisé que TODAS las URLs propuestas estén implementadas hoy. Reemplacé `/anteojos-de-sol?genero=mujer` (que no existe — el filtro por género solo aplica con marca) por `/anteojos-de-sol/rusty/mujer` (que sí existe, además con mayor vol SEO según `SEO_STRATEGY.md`).

### Por qué funcionó

Linkear a páginas placeholder o futuras desde el nav:
- **Frustra usuarios**: click → 404 = bounce inmediato.
- **Daña SEO interno**: Google penaliza navegaciones rotas + dilución de PageRank en URLs muertas.
- **Inflate sitemap**: si las URLs no existen, no deberían estar referenciadas.

Aprovechar URLs hijas existentes con mayor vol SEO duplica el beneficio: navegación funcional + PageRank flow hacia páginas que ya estamos intentando rankear.

### Cuándo aplicar

- Cualquier nav, mega-menu, breadcrumb, footer link, sitemap entry.
- Antes de commit: grep o ls de cada URL propuesta contra `app/(storefront)/` y consultar `SEO_STRATEGY.md` para confirmar prioridad SEO.
- Si una URL "ideal" no existe, evaluar: ¿la creo en este sprint, o uso un proxy existente?

## 2026-05-29 — Separar texto SEO largo del catálogo: catálogo = catálogo

**Categoría**: UX / CRO / SEO / Arquitectura de información
**Confianza**: 🟢 Alta (validado por founder post-implementación)

### Qué funcionó

Inicialmente puse el texto SEO largo (intro 300 palabras + outro 100) directo en `/anteojos-de-sol/[brand]`. Founder lo vio en producción y rechazó: "el catálogo debe ser catálogo, no texto largo que la gente saltea". Movido a sub-página dedicada `/[brand]/sobre-la-marca` con link discreto desde el catálogo.

### Por qué funcionó

Trade-off clásico SEO vs UX/CRO:
- **Argumento SEO**: texto largo en página principal concentra PageRank, mejora ranking de keyword principal.
- **Argumento UX/CRO**: comprador entra a catálogo para comprar — texto largo arriba lo distrae, baja conversión.

La separación resuelve ambos:
- Catálogo limpio → mejor UX → mejor conversión.
- Sub-página `/sobre-la-marca` indexada en sitemap captura queries informacionales ("historia rusty", "vulk argentina") sin ensuciar el catálogo.
- Link discreto desde catálogo → internal linking + PageRank flow a la sub-página.
- FAQs específicas siguen en catálogo porque tienen valor utilitario (responden dudas pre-compra), no informacional puro.

### Cuándo aplicar

- Cualquier página transaccional (catálogo, producto, checkout) — NO meter contenido largo "para SEO".
- Si necesitás contenido largo, sub-página dedicada con link discreto.
- Regla mental: ¿el usuario que viene a comprar lo va a leer? Si no → no va en la página de compra.
- Excepción: FAQs cortas + específicas pueden ir al pie del catálogo porque ayudan a comprar.

### Anti-pattern relacionado

Falacia común: "más palabras = más SEO". Google ya no premia eso desde hace años — premia contenido **profundo y útil** que coincide con la intención de búsqueda. Texto largo en página de compra = mala UX = bounce rate alto = peor SEO, no mejor.

## 2026-05-29 — Texto SEO largo en columnas DB, no hardcoded en componente

**Categoría**: SEO / Arquitectura de contenido
**Confianza**: 🟢 Alta

### Qué funcionó

Para los textos SEO largos por marca (150-300 palabras), usé columnas en `brands` table (`seo_intro`, `seo_outro` TEXT nullable) en vez de hardcodearlos en TypeScript/Markdown del repo. Razones:

- **Editable sin redeploy**: founder o yo puedo updatear texto via SQL Editor sin commit/push/build/deploy.
- **No infla el bundle**: el texto vive en DB, se trae con la query que ya hace la página de marca, no aumenta el JS shipped al cliente.
- **Idiomático con el resto del catálogo**: brands ya tiene `description`, `meta_title`, `meta_description` — agregar 2 columnas TEXT extiende el patrón existente, no introduce uno nuevo.
- **Nullable**: si la marca no tiene texto cargado, la sección no se renderiza (mejor que mostrar placeholder).

### Por qué funcionó

Alternativa rechazada: tener `lib/content/brand-seo-text.ts` con un objeto `{ rusty: { intro, outro }, vulk: {...} }`. Eso:
- Requiere redeploy para editar 1 párrafo.
- Acopla "data dinámica" (texto que cambia) con "código" (que rara vez cambia).
- Hace que un copy editor no técnico no pueda updatearlo solo.

### Cuándo aplicar

- Cualquier contenido editorial que pueda variar por entidad (marca, categoría, producto, autor).
- Cuando esperás que el founder o un editor no técnico quiera updatearlo sin tocar código.
- NO aplicar para texto verdaderamente fijo de UI (labels, etc) — eso sí va hardcoded.

## 2026-05-29 — FAQ schema por marca: específico, no genérico (regla Google)

**Categoría**: SEO / Structured data
**Confianza**: 🟢 Alta (Google guidelines explícitas)

### Qué funcionó

Al agregar `FAQPage` JSON-LD a las páginas `/anteojos-de-sol/[brand]`, NO reutilicé las FAQs genéricas de `lib/content/faqs.ts` (envíos, pagos, garantía general). Creé `lib/content/brand-faqs.ts` con 4-5 preguntas ESPECÍFICAS de cada marca (origen, público, polarizados, garantía oficial, receta). Esto evita 2 problemas:

1. **Contenido duplicado** entre páginas de marca y `/preguntas-frecuentes` (Google penaliza duplicación).
2. **Schema sin valor SEO**: Google premia FAQ schema cuando responde queries específicas que el usuario realmente busca antes de comprar esa marca puntual.

Además respeté la regla dura de Google: **el contenido del schema debe matchear contenido visible en la página**. Renderizamos `FaqAccordion` con las mismas FAQs que el JSON-LD — sin texto visible, Google considera el schema "spammy" y deja de mostrar el rich snippet.

### Por qué funcionó

FAQ schema es un rich result con altísimo CTR (preguntas expandibles bajo el resultado normal en SERP). Pero solo funciona si:
- Respuestas concisas y útiles (no marketing puro).
- Sin duplicación cross-page.
- Sin CTAs ni texto promocional dentro de las respuestas.
- Match exacto entre schema y contenido visible.

### Cuándo aplicar

- Cualquier página de marca, categoría o producto con potencial de queries informacionales asociadas.
- NO reutilizar FAQs genéricas — siempre escribir las específicas al contexto.
- Mínimo 3 FAQs por página para que valga la pena el rich result.

## 2026-05-29 — Performance audit basado en RUM, no en code review pre-tráfico

**Categoría**: Performance / Métodos de medición
**Confianza**: 🟢 Alta (industria estándar)

### Qué funcionó

Durante audit de performance, después de validar que el código tiene buena base técnica (Next/Image, fonts con swap, scripts afterInteractive, bundle razonable), corté el audit ahí en vez de empezar a optimizar a ciegas. La decisión: documentar findings + plan de acción para activar Vercel Analytics y correr PageSpeed Insights, en vez de aplicar 10 micro-optimizaciones sin data.

### Por qué funcionó

Sin tráfico real, optimizar es teatro. Lighthouse en local mide HTML/CSS/JS pero no caché real, conexiones lentas, dispositivos viejos. Las micro-optimizaciones pre-tráfico:
- A veces empeoran cosas (ej: `dynamic({ ssr: false })` que rompió build).
- Consumen tiempo que no genera mejora medible.
- Crean falsa sensación de "está optimizado" sin baseline real.

El approach correcto: validar fundamentos → documentar plan de medición → optimizar SOLO cuando hay data RUM mostrando un Core Web Vital en rojo.

### Cuándo aplicar

- Cualquier sprint de "optimización" sin métricas de producción.
- Tentación de pre-optimizar antes de tener users.
- Regla: si no hay número que mejorar, no hay nada que optimizar.

## 2026-05-29 — OAuth scoped por user — multi-cuenta del mismo founder requiere re-autorización o multi-tenancy

**Categoría**: OAuth / Multi-cuenta / Integraciones
**Confianza**: 🟢 Alta (caso aplicado en ML)

### Qué pasó

Founder tiene su producto `MLA1432137395` en una cuenta ML distinta a la que autorizó OAuth (user_id 1975674). ML correctamente niega acceso a items ajenos al token holder, aunque el founder sea dueño legal de ambas cuentas.

### Por qué

OAuth tokens son scoped al `user_id` del usuario que autorizó. Es seguridad básica:
- El token no representa al founder como persona — representa al user_id en ML.
- ML no sabe (ni debe saber) que múltiples cuentas pertenecen al mismo dueño legal.
- Token de user A no puede acceder a items de user B.

### Soluciones por nivel de complejidad

**Iter 1 (single-account)**: re-autorización. Founder log out + log in con cuenta correcta + nuevo OAuth flow. Tokens se UPSERT en DB. Trade-off: solo 1 cuenta activa a la vez.

**Iter 2 (multi-account)**: refactor DB para soportar múltiples integraciones simultáneas. Cada producto en el sitio mapea a item + user_id ML específico. UI para elegir desde qué cuenta importar/sincronizar. Effort: 1 sprint serio.

**Iter 3 (multi-marketplace)**: extender a Tiendanube/Shopify además de ML. Misma arquitectura, marketplace_integrations ya soporta `marketplace` field discriminator.

### Aplicar a futuro

Cualquier integración OAuth-based:
- Asumir SINGLE user/account iter 1. Cuesta nada y resuelve 80%+ casos.
- Documentar limitación en doc operativa.
- Multi-tenant solo si hay demanda real (founder con >2 cuentas regulares).

### Patrón meta

"Scope explícito" es fundamental en OAuth. Anti-pattern: asumir que "es mío" da acceso. ML no chequea propiedad legal — solo permission del token.

---

## 2026-05-29 — Endpoints admin deben devolver detalle del error de tercero, no solo el código genérico

**Categoría**: API design / Debugging / DX
**Confianza**: 🟡 Media (1 caso aplicado en ML import)

### Qué pasó

Founder visitó `/api/admin/ml-import-preview/MLA1432137395` y recibió:
```json
{"ok":false,"error":"unknown","retryable":false}
```

`mlFetch` ya loguea el body real del error de ML a `marketplace_sync_errors`. Pero el endpoint NO devuelve ese body al caller — solo el código genérico (`unknown`). Para diagnosticar, founder tiene que visitar OTRO endpoint (`/api/ml/debug-last-error`) y mapear las entries por timestamp.

UX subóptima: 2 round-trips para diagnosticar 1 error.

### Solución (próximo refactor)

Endpoint admin debería incluir el error_payload del último sync_errors entry en su response cuando hay error. Algo como:

```ts
if (!result.ok) {
  const lastError = await getLastSyncError({ operation: 'fetch_item_admin' });
  return NextResponse.json({
    ok: false,
    error: result.error,
    retryable: result.retryable,
    detail: lastError?.error_payload,  // ← incluir aquí
  });
}
```

### Por qué importa

- Endpoint admin = para diagnóstico interno. Debería ser self-contained.
- Founder no-técnico no debería tener que correlacionar JSONs entre 2 endpoints.
- Reduce iteraciones de debugging founder ↔ AI.

### Aplicar a futuro

Cualquier endpoint admin/debug que falla por causa de tercero:
- Devolver código genérico para casos esperados.
- Devolver detalle COMPLETO del error de tercero cuando el caller es admin/debug.
- No requerir que founder visite otro endpoint para diagnóstico.

### Patrón meta

"Self-contained debugging": cada endpoint admin debe responder con suficiente info para tomar acción, sin obligar a múltiples queries.

---

## 2026-05-29 — Verificar deploys reales via MCP es ground truth, NO el git push

**Categoría**: DevOps / Vercel / Verificación de despliegue
**Confianza**: 🟢 Alta (caso aplicado en hot-fix de webhook glitch)

### Qué pasó

Push commit `2a65e83` (endpoint admin) → asumí que Vercel triggereaba build automático. Founder reportó 404 → verifiqué via MCP `list_deployments` y NO había deploy del commit `2a65e83`. Vercel saltó ese commit.

Causa desconocida (webhook GitHub glitch, filter weird, rate limit silencioso). Lo importante: **push exitoso ≠ deploy efectuado**.

### Solución

`mcp__claude_ai_Vercel__list_deployments` muestra SHA real de cada deploy. Comparar SHA esperado vs SHA real = ground truth de qué está vivo en producción.

### Por qué importa

- "Push exitoso" da false sense of "deploy done". Webhook events son best-effort.
- Vercel UI lo muestra pero el founder no chequea — confía en mi confirmación.
- Para integraciones críticas (endpoints admin, webhooks ML, payment flows), verificación post-push debería ser default.

### Aplicar a futuro

Tras CUALQUIER push de código (no doc-only) con feature nueva crítica:
- Listar deployments via MCP.
- Verificar que el SHA del último deploy = SHA del commit recién pusheado.
- Si no matchea (caso raro) → force redeploy con commit doc o redeploy manual.

### Patrón meta

"Verificar en lugar de asumir" para cualquier paso async fuera de tu control directo. Anti-pattern: declarar "deploy en 1-2 min" sin confirmar después.

---

## 2026-05-29 — Endpoint admin temporal via OAuth guardado para one-off tasks del founder

**Categoría**: Arquitectura / Operaciones / Admin temporal
**Confianza**: 🟡 Media (1 caso aplicado en ML import)

### Qué pasó

Founder pidió import de un item ML específico. Necesitaba:
1. Fetch del item desde ML API.
2. Auth (ML cambió, ya no es público).

Opciones:
- **A**: Script local con curl — no tenemos los tokens descifrados localmente.
- **B**: Compartir tokens descifrados via prompt — leak de credenciales.
- **C**: Endpoint admin temporal en el sitio que use `mlFetch` con tokens guardados — el sitio ya tiene auth + descifrado, solo añadimos endpoint thin.

Elegí C. Endpoint `/api/admin/ml-import-preview/[itemId]` que devuelve JSON crudo.

### Por qué funciona

- **Reutiliza infraestructura existente**: `mlFetch` + tokens cifrados + auto-refresh. Cero código duplicado.
- **Sin leak de credenciales**: tokens nunca salen del server.
- **Validación input**: regex sobre `MLA\d+` para evitar SSRF.
- **Sin auth iter 1**: aceptable porque solo devuelve data pública del seller (items que él vende).
- **Marker TODO** para Sprint 3: cuando haya admin UI propia, este endpoint se elimina o se integra.

### Trade-off

- Endpoint sin auth = cualquiera puede invocarlo. Mitigación parcial: solo devuelve data que el seller ya expone públicamente en su tienda ML.
- Adds 1 endpoint público con costo de leer del DB cada call. Negligible para uso one-off.

### Aplicar a futuro

Cualquier one-off task que el founder pide y requiere acceso a tokens/secrets guardados:
- Endpoint admin temporal `/api/admin/X/[param]` thin wrapper sobre helper existente.
- Sin auth iter 1 si data no es sensible.
- TODO explícito para eliminar/integrar en admin UI definitiva.
- Validación rigurosa de input para evitar SSRF/injection.

### Patrón meta

"Endpoint thin wrapper sobre helper existente" — reutilizar infraestructura, no duplicar. Anti-pattern: script local que pide credenciales por prompt.

---

## 2026-05-29 — Verificación de propiedad de Google es agnóstica al método — meta tag NO obligatorio si verificó por otro

**Categoría**: Google tooling / Verificación de propiedad
**Confianza**: 🟢 Alta (validado en GSC del proyecto)

### Qué pasó

Le pasé al founder walkthrough con método "Etiqueta HTML" para verificar propiedad en GSC. Él reportó "verificada y sitemap aprobado". Verifiqué el HTML con `curl` y el meta tag `<meta name="google-site-verification">` NO aparecía.

Causa: founder usó método distinto (probable DNS record o file drop-in). GSC ofrece 5 métodos de verificación + acepta cualquiera. Una vez verificada la propiedad, no requiere mantener el método activo (es prueba inicial, no chequeo continuo).

### Por qué importa

- Eviter sobre-engineering por inferencia. "GSC verificada" ≠ "meta tag presente".
- Otros métodos pueden ser más simples para el founder según contexto:
  - DNS: 1 record TXT en el panel del registrar.
  - File: 1 archivo HTML drop-in.
  - GTM: instant si ya tenés Google Tag Manager.
  - Analytics: instant si ya tenés GA en la misma cuenta.
- El env var `NEXT_PUBLIC_GSC_VERIFICATION_TOKEN` queda como reserve — no requerido si verificó por otro.

### Aplicar a futuro

Cuando walkthrough con tercero ofrezca múltiples métodos de verificación:
- Listar los métodos breves.
- Recomendar uno (el más rápido para el contexto).
- Mencionar que cualquiera funciona — no hay penalty por usar otro.
- NO obligar al user a hacer setup técnico (env var + redeploy) si tiene atajo más fácil.

### Trade-off de no usar meta tag

- Si el método alternativo se invalida (ej: cambia DNS, borra el file), GSC desverifica.
- Meta tag en HTML es más persistente porque está en el código.
- Para sites con cambios frecuentes de DNS/hosting: meta tag es safer.
- Para sites estables: cualquier método funciona.

### Patrón meta

"Múltiples paths a resultado" — el resultado importa más que el path. Anti-pattern: insistir en el method que vos propusiste cuando el founder eligió otro válido.

---

## 2026-05-29 — Aplicación inmediata de mistake aprendido: walkthrough GSC empieza con env var ANTES del redeploy

**Categoría**: Proceso / Aprendizaje aplicado
**Confianza**: 🟢 Alta (caso validado en mismo día del mistake)

### Qué pasó

En el setup de GA4 cometí un mistake (documentado): no dejé claro que la env var debe configurarse ANTES del redeploy. Founder agregó la env var después del último deploy → GA4 no funcionó → debugging extra.

En el siguiente walkthrough (GSC), apliqué la lección **inmediatamente**:
1. Paso 1 explícito: "Copiar token de GSC".
2. Paso 2 explícito: "Configurar env var en Vercel (PRIMERO, antes del redeploy)".
3. Paso 3 explícito: "Trigger redeploy" — yo hago commit doc trivial sin pedirle al founder.
4. Paso 4 explícito: "Verificar meta tag con curl".

Eliminé la ambigüedad del orden y removí el costo cognitivo del founder de pensar "¿qué hago primero?".

### Por qué funciona

- **Mistake → learning → aplicación en próximo caso similar** en menos de 1 día.
- El walkthrough actual tiene markers explícitos ("PRIMERO", "antes del redeploy") imposibles de mal-interpretar.
- Yo hago el commit doc — founder no tiene que pensar en eso.

### Aplicar a futuro

Todo walkthrough con setup de tercero + env var:
- Step "agregar env var" PRIMERO con marker explícito "antes del redeploy".
- Step "trigger redeploy" SEGUNDO — idealmente lo hago yo via commit.
- Step "verificar" TERCERO con comando concreto (curl, cmd browser, etc).

### Patrón meta

Aprender ≠ aplicar. La validación real del learning es que aparezca en el próximo caso similar. Cuando lo hace, queda confirmado como regla operativa.

---

## 2026-05-29 — Vercel env vars NO se aplican retroactivamente — siempre redeploy tras agregarlas

**Categoría**: Vercel / Deployment / Operaciones
**Confianza**: 🟢 Alta (limitación confirmada del platform + caso validado end-to-end)

### Qué pasó

Founder configuró GA4 cuenta + Measurement ID correcto + lo agregó como env var `NEXT_PUBLIC_GA_ID` en Vercel. Pero GA4 NO mostraba data — el script ni siquiera aparecía en Network tab del browser.

Diagnóstico: la env var se agregó DESPUÉS del último deploy (commit `70f4e0f`). Vercel carga env vars EN BUILD time — un build viejo no las tiene. Tras nuevo deploy (commit doc trivial), el código pickup la env var y GA4 empezó a funcionar.

### Por qué es confuso

- Vercel UI muestra la env var como "Production" y verde. Visualmente parece activa.
- Pero el deploy actual fue construido SIN esa env var → para él, no existe.
- Diferencia entre "env var configurada en panel" y "env var aplicada al deploy actual".

### Aplicar a futuro

Cualquier vez que se agrega/cambia una env var en Vercel:
1. Configurar en Settings → Environment Variables.
2. **OBLIGATORIO** después: trigger redeploy (manual desde UI o push trivial).
3. Verificar que el deploy nuevo tiene timestamp posterior a cuando se agregó la env var.

Hint útil al founder cuando algo "no funciona después de agregar env var":
- Preguntar: "¿agregaste la env var antes o después del último deploy?"
- Si después → "necesitás redeploy".

### Patrón meta

"Configuración panel ≠ configuración activa" — válido para cualquier hosting con build-time env vars (Vercel, Netlify, Cloudflare Pages). Anti-pattern: asumir que agregar config en panel basta.

---

## 2026-05-29 — Diagnóstico client-side con 3 checks (Vercel env / Network DevTools / localStorage) para scripts no cargando

**Categoría**: Debugging / Frontend / Browser tooling
**Confianza**: 🟡 Media (1 caso aplicado en GA4 troubleshooting)

### Qué pasó

Founder reportó "GA4 no muestra nada". El componente GoogleAnalytics tiene 3 conditions de no carga:
1. `NEXT_PUBLIC_GA_ID` env var ausente o vacía.
2. Consent `oc_cookies_consent` no es `'all'`.
3. Race condition (consent llegó después del primer pageview).

Cada uno requiere look distinto: Vercel UI / Network DevTools / localStorage. Sin saber cuál fallaba, debugging era hipótesis ciega.

### Solución

3 checks específicos en paralelo, founder reporta cuál falla:
1. **Vercel UI**: env var aparece + Production check.
2. **Network DevTools (F12)**: filter `google` → buscar `googletagmanager.com/gtag/js?id=...`. Si aparece → carga OK. Si no → consent o env var.
3. **localStorage**: `oc_cookies_consent` choice.

Permite al founder no-técnico diagnosticar sin tirar todo el contexto al chat.

### Por qué funciona

- **Checks independientes**: cada uno cubre 1 hipótesis. Founder puede hacerlos en cualquier orden.
- **Resultados binarios**: cada check es "aparece" o "no aparece". Sin ambigüedad.
- **DevTools = ground truth**: lo que el browser realmente está cargando, no lo que asumo del código.

### Aplicar a futuro

Cualquier troubleshooting de "script externo no carga / no funciona" (analytics, chat widgets, ad pixels, A/B tests):
- Check 1: env vars en hosting (¿la key existe?).
- Check 2: Network tab (¿el browser está request-eando el script?).
- Check 3: localStorage / cookies (¿alguna condition pre-load lo bloquea?).

3 checks paralelos > 1 check secuencial cuando hay múltiples causas posibles independientes.

---

## 2026-05-29 — Docs operativas necesitan 2 niveles: resumen + walkthrough granular

**Categoría**: Documentación / Comunicación al founder
**Confianza**: 🟡 Media (caso aplicado en GA4 setup)

### Qué pasó

Escribí `ANALYTICS_SETUP.md` con resumen de pasos para configurar GA4 ("crear cuenta GA4 → propiedad → flujo web → copiar Measurement ID → env var en Vercel"). Founder lo leyó pero pidió walkthrough detallado — necesitaba saber qué hacer click por click.

Cuando lo escribí pensé "está obvio cada paso porque la UI te guía". Pero founder NO había usado GA4 antes, así que cada pantalla nueva requiere decisión (qué nombre, qué zona, qué sector). Sin walkthrough, fricción alta.

### Solución

Docs operativas para el founder (no-técnico) necesitan **2 niveles**:

**Nivel 1 — Resumen** (`ANALYTICS_SETUP.md` en repo):
- Para referencia futura.
- Qué está integrado + qué env vars necesita + dónde mirar métricas.
- Asume familiaridad con el tooling externo.

**Nivel 2 — Walkthrough** (mensaje chat cuando el founder lo necesita):
- Para PRIMERA vez usando el tooling.
- 10 pasos numerados, cada campo a llenar, screenshot textual de cada pantalla.
- Asume CERO familiaridad.

### Por qué funciona

- Resumen es referencia rápida cuando ya conocés el flow.
- Walkthrough reduce decisión fatigue + miedo al "qué pongo acá".

### Aplicar a futuro

Cualquier integración nueva con dashboard tercero (MP, Tusfacturas, Resend, GSC, etc):
- Doc Markdown en repo con resumen.
- Al pedirle al founder ejecutar por primera vez, mandar walkthrough en chat con cada click.

### Patrón meta

Docs técnicas (resumen) ≠ docs operativas (walkthrough). El proyecto necesita ambas. Anti-pattern: asumir que un resumen sirve para alguien que nunca usó el tooling.

---

## 2026-05-29 — Helper `track()` no-op silencioso desacopla código de negocio de GA4 disponibilidad

**Categoría**: Analytics / Privacy / Arquitectura
**Confianza**: 🟢 Alta (caso aplicado en 6 features)

### Qué pasó

Integré GA4 con compliance ley 25.326: gtag solo carga si user acepta cookies. `window.gtag` puede o no existir según consent. Si cada componente defensive-checkea, código se llena de boilerplate y dev puede olvidar el check → crash.

### Solución

Helper `track(eventName, params)` centralizado en `lib/analytics/track.ts`:

```ts
export function track(eventName, params?) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', eventName, cleanParams);
  } catch (err) { /* no-op */ }
}
```

Componentes solo escriben `track(Events.WISHLIST_TOGGLE, {...})` — sin defensive code, sin worry sobre consent.

### Por qué funciona

- **Una capa de abstracción** business code ↔ analytics provider.
- **No-op por default**: caso seguro es no hacer nada.
- **Enum `Events`** evita typos.
- **Cambio de provider trivial**: si migramos a Plausible/Posthog, edito solo el helper.

### Aplicar a futuro

Cualquier integración condicional opcional (Sentry, Posthog, Datadog):
- Wrap en helper centralizado.
- No-op si no disponible.
- Componentes nunca chequean directo.

### Patrón meta

"Defensive checks centralizados en helper" — componentes confían en el helper. Reduce cognitive load + risk de typos.

---

## 2026-05-29 — Sprint 2a ML OAuth CERRADO: debugging incremental con DB logging desbloqueó root cause en 2 iteraciones

**Categoría**: Project management / Debugging incremental / Validación de integración
**Confianza**: 🟢 Alta (validado end-to-end con OAuth funcionando)

### Qué pasó

Sprint 2a ML OAuth pasó por varios fallos: redirect URI sospechoso (descartado), migration parcial (verificada), logging incompleto (corregido), y finalmente root cause encontrado (Zod schema esperaba `'bearer'` lowercase, ML devuelve `"Bearer"` con B mayúscula).

Total iteraciones: ~5 ciclos de "founder reintenta → reviso → fix → push". Tiempo total: ~1 sesión completa. Sin DB logging, hubiera tomado mucho más por dependencia de Vercel logs flaky.

### Por qué el debugging funcionó

**Two-tier logging** (DB + console) fue crítico:
- Vercel logs via MCP timeouteaban consistentemente.
- DB endpoint `/api/ml/debug-last-error` accesible directo, devolvió el JSON exacto.
- Sanitización de tokens en el segundo paso evitó leak permanente.

**Endpoint debug temporal** permitió que el founder me pasara info estructurada sin necesidad de Supabase Dashboard SQL.

**Incremental fix** vs "big bang":
- Sprint 2a NO incluyó procesamiento webhook real — solo OAuth flow.
- Cada fallo OAuth se aisla del resto del sistema.
- Si hubiera incluido todo el sync en Sprint 2, debugging era 10x más complejo.

### Trade-off realizado

- 5 iteraciones de "spinning wheel" con el founder. Costó tiempo + paciencia.
- Pero cada iteración nos dio info concreta. Sin debugging incremental, hubiera sido "no funciona, no sé por qué".

### Aplicar a futuro

Cualquier integración con tercero (Resend, Tusfacturas, Tiendanube, Shopify):
1. **Sprint inicial sólo OAuth/auth**. NO sumar procesamiento real hasta validar auth.
2. **Two-tier logging desde día 1**: console + DB.
3. **Endpoint debug temporal** que el founder pueda consultar sin SQL.
4. **Sanitización ya implementada**: nunca loguear credenciales crudas.

### Métrica del éxito

Sprint 2a tomó 5 iteraciones de debugging pero **cerró sin necesidad de revertir nada**. Cada commit fue aditivo. Sin DB logging, hubiera necesitado al menos 2x el tiempo.

---

## 2026-05-29 — Sanitización de payloads sensibles ANTES de loguear, no después

**Categoría**: Seguridad / Logging / Datos sensibles
**Confianza**: 🟢 Alta (caso real con tokens leakeados a DB)

### Qué pasó

Para diagnosticar Zod fail en OAuth ML, logueé `received_json: json` crudo a DB. El bug se reprodujo, log SÍ ayudó a encontrar la causa ('Bearer' vs 'bearer'), pero TAMBIÉN persistió `access_token` y `refresh_token` reales en la tabla.

DB tiene RLS service_role, pero los tokens quedaron en lugar "menos protegido" que el cifrado AES-256 que usamos en `marketplace_integrations.access_token`.

### Solución

Función `sanitizeReceivedJson()` reemplaza valores de keys sensibles con `[REDACTED]` ANTES de persistir:

```ts
const SENSITIVE_KEYS = new Set([
  'access_token', 'refresh_token', 'id_token',
  'client_secret', 'code',
]);

function sanitizeReceivedJson(json) {
  const keys = Object.keys(json);
  const redacted = {};
  for (const k of keys) {
    redacted[k] = SENSITIVE_KEYS.has(k) ? '[REDACTED]' : json[k];
  }
  return { keys, redacted };
}
```

Log guarda `received_keys` + `received_redacted`. Diagnóstico preservado, seguridad protegida.

### Aplicar a futuro

Cualquier log de payload externo (OAuth callback, webhook body, API response):
- Identificar keys sensibles del provider/protocol.
- Sanitizar ANTES de loguear.
- Mantener shape (keys + valores no sensibles) para debugging.

### Anti-pattern descubierto

Loguear payload crudo "por si necesitamos debuguear" → credenciales leakean a logs persistentes. Pattern positivo: sanitizar al INPUT del logger, no después.

---

## 2026-05-29 — Logging a DB debe cubrir TODOS los branches de error, no solo el "obvio"

**Categoría**: Observabilidad / Cobertura
**Confianza**: 🟢 Alta (caso real validó el patrón)

### Qué pasó

En Sprint 1 ML agregué `logMLSyncError` solo al branch `response.status === 400`. Confié en `console.error` para los otros (Zod fail, parse fail, upsert fail). Tras varios fallos OAuth con `count: 0` en la tabla, descubrí que el error caía en el branch **Zod fail** que NO logueaba → debugging ciego.

### Solución

Cobertura uniforme: log a DB en TODOS los branches que devuelven error:
- Status non-2xx: ✅ (estaba).
- JSON parse fail: agregado.
- Zod schema fail: agregado (con `received_json` raw).
- DB upsert fail: agregado.

### Por qué funciona

Si TODO branch loguea, la tabla siempre tiene evidencia. Independiente de la causa, el debug endpoint te devuelve detalle preciso. Cero "ceguera selectiva".

### Aplicar a futuro

Cualquier función crítica que devuelve `Result<T, E>` con múltiples paths de error:
- Audit explícito: ¿cuántos branches devuelven error? ¿Todos logueean?
- DB log con `stage` específico para identificar cuál branch falló.
- NO confiar en `console.error` solo para diagnóstico post-mortem.

### Anti-pattern

Logging selectivo (solo el branch "obvio") → debug-blind cuando falla un branch alternativo.

### Refinamiento del "Two-tier logging"

Entry previo: "DB como backup cuando runtime logs son flaky". Este caso refina: NO basta tener el patrón, hay que aplicarlo a **TODOS** los branches de error, no solo el principal.

---

## 2026-05-29 — IF NOT EXISTS check explícito > EXCEPTION catch para idempotencia de UNIQUE constraints

**Categoría**: Postgres / Migrations / Idempotencia (refinamiento)
**Confianza**: 🟢 Alta (caso real validó el patrón)

### Qué pasó

Refinamiento del entry anterior. Mi primer fix wrappeaba `ADD CONSTRAINT` en `DO block + EXCEPTION WHEN duplicate_object`. Founder reintentó y falló con MISMO error:
```
ERROR: 42P07: relation "..." already exists
```

`42P07` es `duplicate_table` (porque UNIQUE constraint crea índice subyacente con mismo nombre como relation), NO `42710 duplicate_object`. Mi catch no aplicaba.

### Solución refinada

En lugar de capturar exception por SQLSTATE específico (frágil — depende de cuál SQLSTATE tire Postgres), usar `IF NOT EXISTS` check explícito sobre `information_schema`:

```sql
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'product_variants_mercadolibre_item_id_unique'
      AND table_schema = 'public'
      AND table_name = 'product_variants'
  ) THEN
    ALTER TABLE public.product_variants
      ADD CONSTRAINT product_variants_mercadolibre_item_id_unique
      UNIQUE (mercadolibre_item_id) DEFERRABLE INITIALLY DEFERRED;
  END IF;
END $$;
```

### Por qué es mejor

- **Funciona independiente del SQLSTATE** que tire Postgres. UNIQUE constraints pueden tirar `42P07` o `42710` según contexto. IF NOT EXISTS check ignora eso.
- **Más legible**: "si no existe, créalo" es declarativo. El EXCEPTION catch requiere conocer SQLSTATEs.
- **Estándar SQL**: information_schema es portable.

### Aplicar a futuro

Para idempotencia de cualquier objeto DB que NO soporte `IF NOT EXISTS` nativo:
- **UNIQUE constraints**: check sobre `information_schema.table_constraints`.
- **CHECK constraints**: idem.
- **FOREIGN KEY constraints**: idem.
- **Triggers**: check sobre `information_schema.triggers` o `pg_trigger`.
- **Policies (RLS)**: `DROP POLICY IF EXISTS` primero + `CREATE POLICY`.

### Patrón meta refinado

Anti-pattern: confiar en `EXCEPTION WHEN duplicate_X` cuando el objeto puede tirar múltiples SQLSTATEs según contexto. Pattern positivo: query directa a `information_schema` para condicional explícito.

### Supersedes entry anterior

Este entry refina/supersedes el del DO block con EXCEPTION. La versión con IF NOT EXISTS es la robusta.

---

## 2026-05-29 — `DO $$ ... EXCEPTION WHEN duplicate_object` para idempotencia en `ADD CONSTRAINT`

**Categoría**: Postgres / Migrations / Idempotencia
**Confianza**: 🟢 Alta (limitación SQL standard conocida + caso aplicado)

### Qué pasó

Founder intentó re-aplicar `20260529000000_marketplace_integrations.sql` y recibió:
```
ERROR: 42P07: relation "product_variants_mercadolibre_item_id_unique" already exists
```

SQL standard NO soporta `IF NOT EXISTS` en `ADD CONSTRAINT`. Si la migration corrió parcialmente antes (CREATE TABLE IF NOT EXISTS funcionó, ADD CONSTRAINT también) y se re-ejecuta → falla por constraint duplicada.

### Solución

Wrappear `ADD CONSTRAINT` en `DO $$ ... EXCEPTION` block:

```sql
DO $$
BEGIN
  ALTER TABLE public.product_variants
    ADD CONSTRAINT product_variants_mercadolibre_item_id_unique
    UNIQUE (mercadolibre_item_id) DEFERRABLE INITIALLY DEFERRED;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;  -- Constraint ya existe, ignorar
END $$;
```

### Por qué funciona

- `DO` block ejecuta procedural SQL en línea.
- `EXCEPTION WHEN duplicate_object` captura específicamente el error 42P07.
- `NULL` ignora silenciosamente.
- Migration ahora safe re-applicable sin error.

### Aplicar a futuro

Cualquier `ALTER TABLE ... ADD CONSTRAINT` en migrations debe ir en `DO block` con manejo de `duplicate_object`. NO confiar en `CREATE TABLE IF NOT EXISTS` para evitar este caso — la constraint es separate.

Otras excepciones útiles para idempotencia:
- `WHEN duplicate_table THEN NULL` (tabla ya existe).
- `WHEN duplicate_column THEN NULL` (columna ya existe).
- `WHEN duplicate_function THEN NULL` (función ya existe).
- `WHEN duplicate_schema THEN NULL`.

### Patrón meta

**Migrations deben ser safe re-applicable** — si el founder corre 2 veces por accidente, debe ser no-op, no error fatal. `CREATE TABLE IF NOT EXISTS` no es suficiente — toda DDL que no soporte IF NOT EXISTS necesita wrapping.

---

## 2026-05-29 — Endpoint debug con count=0 es DATA — descarta una causa, indica próxima

**Categoría**: Debugging / Diagnóstico / Patrones de evidencia
**Confianza**: 🟡 Media (1 caso aplicado, principio sólido)

### Qué pasó

Founder visitó `/api/ml/debug-last-error` y recibió `{count: 0, errors: []}`. Mi reacción inicial: "no hay info, no se puede diagnosticar".

Reframe: `count=0` ES información. Significa:
- Logging code corrió pero NO encontró errores → causa NO está en lo que loguea (exchange code → tokens).
- O: logging code NUNCA corrió por errores ANTES (tabla no existe, crash en config, etc).

Aplicado al caso: founder había aplicado migrations PRE-Sprint 2a. La migration `20260529000000_marketplace_integrations.sql` (que crea las tablas ML) es del MISMO día pero POSTERIOR a la sesión de "aplique migraciones". Probable: nunca se aplicó la migration ML específica.

### Por qué funciona

- "Sin data" NO es "sin diagnóstico". Es **evidencia negativa** que excluye hipótesis.
- Hipótesis previa: "ML está rechazando el code". Pero si fuera eso, el código logueaba el error → count > 0.
- count=0 + intento fallido → algo más fundamental está pasando: tablas no existen, env vars rotas, deploy stale.

### Aplicar a futuro

Endpoints debug que devuelven empty NO son fallas — son data útil:
- Si esperabas X items y hay 0 → la causa NO está en lo que esos items rastrean.
- Forzar nueva línea de hipótesis (qué pasa upstream).

### Patrón meta

**Falta de error es información**. Anti-pattern: descartar empty responses como "no me sirve para nada".

---

## 2026-05-29 — Mega-menu hover-intent: 120ms open / 220ms close evita flickering

**Categoría**: UX / Hover patterns
**Confianza**: 🟡 Media (caso aplicado, timings industria estándar)

### Qué pasó

Mega-menu desktop sin hover-intent (delay 0) flickerea al mover el mouse rápido entre nav links. Con delay alto se siente lento.

Aplicé timings estándar industria:
- **120ms open**: cursor < 120ms = transit, no abre. ≥120ms = intencional, abre.
- **220ms close**: tras mouseleave, espera antes de cerrar. Permite cruzar gap entre nav y panel.

### Por qué funciona

- 120ms < threshold "intencional vs accidental" (~150ms).
- 220ms close > 120ms open: asimetría para forgiveness — empezar a salir y volver no cierra.
- Cancel timers en cada interacción: si abrís A → mouseenter B → cancel open de A + schedule open B.

### Aplicar a futuro

Cualquier hover overlay (dropdowns, tooltips ricos, mega-menus):
- Open delay 80-150ms.
- Close delay 200-300ms.
- Cancel timers en cada hover event para evitar leaks.

### Anti-pattern

Sin hover-intent = flickering. Mucha gente lo hace mal en sus primeros mega-menus.

---

## 2026-05-29 — Position fixed para overlays full-viewport dentro de container con padding

**Categoría**: CSS / Layout / Overlays
**Confianza**: 🟢 Alta (limitación CSS conocida + caso aplicado)

### Qué pasó

Mega-menu inicialmente `absolute inset-x-0 top-full` dentro de `<nav>` dentro de `<div className="container">`. Resultado: panel limitado al padding del container, NO full viewport.

`inset-x-0` se resuelve respecto al ancestor positioned. Container con padding limita el ancho real.

Solución: `position: fixed inset-x-0 top-14 md:top-16`. Fixed va al viewport, no al ancestor.

### Por qué funciona

- `fixed inset-x-0` → viewport completo.
- `top-{header-h}` → debajo del header sticky.
- z-index calibrado: 30 (sobre contenido, debajo de cursor follower).

### Trade-off

- Si el header cambia altura, hay que actualizar `top-X`. Mitigación futura: CSS var `--header-h`.

### Anti-pattern

Usar `absolute inset-x-0` dentro de container con padding esperando full width. NO funciona.

---

## 2026-05-29 — Two-tier logging: DB como backup cuando runtime logs son flaky

**Categoría**: Observability / Debugging / Resiliencia
**Confianza**: 🟡 Media (caso aplicado, principio establecido)

### Qué pasó

OAuth callback ML falló con `validation_error`. Necesitaba ver el body de ML al rechazar el code. Tenía `console.error` en el código — debería aparecer en Vercel logs.

Pero: MCP `get_runtime_logs` con query "oauth" daba timeout. Sin query, no aparecía el log específico — solo el 307 del redirect. `console.error` desde route handlers no aparece consistente.

Solución: `await logMLSyncError(...)` que persiste el error en `marketplace_sync_errors` (Supabase). DB queryable por SQL, persistente, estructurado, independiente del runtime.

### Por qué funciona

- **Resiliencia**: si Vercel tiene outage o MCP timeout, DB sigue accesible.
- **Permanencia**: logs de Vercel rotan (24h-30 días). DB queda para forensics.
- **Análisis SQL**: `SELECT, count, group by operation`.
- **Endpoint debug temporal**: `/api/ml/debug-last-error` lee últimos 5 sin auth.

### Trade-off

- Tabla crece sin pruning. Mitigación: cron periódico que purga errores resueltos > 90 días.
- Duplicación (console.error + DB). Acepto — costo bajo, beneficio alto.

### Aplicar a futuro

Cualquier integración crítica con tercero (ML, MP, Resend, Tusfacturas):
- Logs de runtime SIEMPRE (rapidez).
- DB logging adicional para errores que requieren forensics.
- Endpoint debug temporal hasta tener admin UI propia.

### Patrón meta

"Two-tier logging": logs efímeros para visibilidad realtime + DB para análisis histórico. **Anti-pattern**: confiar SOLO en runtime logs cuando son flaky.

---

## 2026-05-29 — Git push trivial como trigger de redeploy Vercel cuando cambian env vars

**Categoría**: DevOps / Vercel / Workflow
**Confianza**: 🟡 Media (caso aplicado, patrón conocido)

### Qué pasó

Founder agregó 4 env vars a Vercel DESPUÉS del último deploy. Vercel carga env vars en build time — las nuevas no están disponibles hasta rebuildear. 2 opciones:

**A. Vercel UI**: Deployments → último → 3 dots → Redeploy. Acción manual del founder.
**B. Git push trivial** (commit a doc/similar): trigger automático build + deploy.

Elegí B con commit a `CURRENT_STATE.md` documentando que las env vars estaban confirmadas. Beneficio doble: documento el estado + trigger redeploy en una sola acción.

### Por qué funciona

- Vercel re-evalúa env vars cada build (no cached entre builds).
- Push trivial no requiere acción del founder.
- Doc commit es útil per se → cero waste.

### Trade-off

- Commit "trigger" suma ruido en git history. Mitigación: contenido real, no `[chore] trigger redeploy`.
- Nunca `git commit --allow-empty` — es señal de que se podría documentar algo del mismo turn.

### Patrón meta confirmado (3era confirmación)

"AI prepara + founder ejecuta lo que requiere su acceso/identidad":
1. Encryption key: yo escribo el comando, founder lo ejecuta solo (debe quedar privado).
2. DB migrations: yo escribo el SQL, founder lo ejecuta en Supabase (no tengo cluster admin).
3. Redeploy via push: yo armo el commit doc + push, Vercel hace el resto.

Patrón estable: separar lo que requiere identidad del founder (claves, accesos) de lo que el AI puede hacer (código, docs, triggers).

---

## 2026-05-29 — Next.js route files NO permiten arbitrary exports: constants compartidas van en lib/

**Categoría**: Next.js / Routing / Convenciones del framework
**Confianza**: 🟢 Alta (limitación oficial del framework + caso aplicado)

### Qué pasó

En el OAuth flow ML necesitaba compartir `STATE_COOKIE` entre `initiate/route.ts` y `callback/route.ts`. Inicial: exporté desde initiate con `export { STATE_COOKIE }`. Build falló:
`Route "..." does not match the required types of a Next.js Route`.

### Causa

Route files (`app/**/route.ts`) solo permiten exportar:
- Handlers HTTP: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `HEAD`, `OPTIONS`.
- Config specifics: `dynamic`, `revalidate`, `runtime`, `fetchCache`, `preferredRegion`, `maxDuration`, `metadata`, `generateMetadata`, `generateStaticParams`.

Cualquier otro export rompe el contract.

### Solución aplicada

Módulo separado en `lib/integrations/mercadolibre/oauth-state.ts`:

```ts
export const ML_OAUTH_STATE_COOKIE = 'oc_ml_oauth_state';
export const ML_OAUTH_STATE_TTL_SECONDS = 600;
```

Ambos routes importan desde ahí.

### Aplicar a futuro

Cualquier route file que necesite compartir constantes / schemas / helpers / types con otro route file → módulo separado en `lib/`.

### Patrón meta confirmado (3era confirmación)

3 casos donde separamos constants/utilities de route files a lib/:
1. `lib/mp/webhook.ts` (MP webhook + carrito).
2. `lib/integrations/mercadolibre/schemas.ts` (webhook + endpoints futuros).
3. `lib/integrations/mercadolibre/oauth-state.ts` (este caso).

**Regla confirmada**: route files son contractuales (solo handlers + configs), todo lo demás vive en lib/.

---

## 2026-05-29 — Endpoint stub para integraciones con upfront-validation desbloquea al founder sin esperar al sprint completo

**Categoría**: Arquitectura / Patrones de integración / Project management
**Confianza**: 🟢 Alta (patrón estándar industria + caso aplicado en ML webhook)

### Qué pasó

Mercado Libre, al guardar una app, hace ping de validación a la URL del webhook configurada. Si el endpoint no responde 200, ML rechaza la URL y no permite guardar la app. Problema: el endpoint **real** se construye en Sprint 2 (con procesamiento de payload, update de DB, validación de origen). Pero el founder necesita guardar la app **ahora** para pasarme las credenciales.

Solución: **endpoint stub** que:
1. Existe en la ruta final (`/api/ml/webhook`).
2. Responde 200 OK al instante.
3. Valida shape del payload con Zod (sin procesar).
4. Log mínimo para visibilidad.
5. Acepta POST + GET + HEAD (algunas plataformas validan con cualquiera).

Sprint 2 reemplaza el handler POST con la lógica real. La interfaz (URL + status code + shape) se mantiene.

### Por qué funciona

- **Desbloquea trabajo del founder**: sin endpoint, founder no puede completar el registro de la app → no me pasa credenciales → Sprint 2 bloqueado. Con stub, todo lo del founder se completa hoy.
- **Costo bajo**: ~50 líneas de código. La validación Zod ya estaba lista de Sprint 1.
- **Interfaz contractual estable**: la URL final se registra desde hoy. Cuando Sprint 2 implementa el procesamiento real, el founder no toca nada en ML.
- **Observabilidad inicial**: el log del stub me sirve para ver qué payloads llegan ANTES de implementar la lógica — útil para diseñar el procesador.

### Otros casos donde aplica

- **OAuth callbacks**: muchos providers validan la redirect URI al guardarla. Stub que devuelve 200.
- **Webhooks de cualquier integration** (Stripe, Shopify, Tiendanube, etc): mismo patrón.
- **Verification webhooks** (Slack apps, Discord bots): incluyen challenge string que hay que retornar. Stub que solo maneja ese caso, sin lógica de negocio.
- **CDN preview validation**: algunos CDNs pingean para verificar headers.

### Trade-offs

- Si el founder accidentalmente activa la integración antes de Sprint 2, ML va a enviar webhooks reales al stub → se loggean y se ignoran. Stock NO se sincroniza. Riesgo: oversell si confía que el sync ya funciona. **Mitigación**: log explícito de "stub" + comunicación clara al founder de que Sprint 2 está pendiente.

### Aplicar a futuro

Cualquier integration que requiere validación upfront del endpoint:
1. Identificar qué request hace el provider para validar (típicamente GET / POST con payload challenge).
2. Implementar stub que devuelve 200 OK + responde el shape esperado.
3. Documentar como STUB en el código (header comment).
4. Listar en `CURRENT_STATE.md` como "stub deployado, lógica real pendiente sprint X".
5. Sprint posterior: reemplazar handler manteniendo URL + response shape estables.

### Patrón meta

Este es el **3er caso** de "feature mínima viable para desbloquear stakeholder externo":
1. Welcome email no-bloqueante en newsletter (si Resend no configurado, suscripción funciona).
2. Foundations ML sin credenciales (Sprint 1).
3. Stub endpoint para validation upfront (este caso).

3 casos → patrón consolidado: **separar lo que requiere setup externo de lo que no**, y entregar valor incremental sin esperar el setup completo.

---

## 2026-05-29 — Scope mínimo en OAuth permissions: pedir solo lo crítico ahora reduce riesgo si tokens se comprometen

**Categoría**: Seguridad / OAuth / Integraciones
**Confianza**: 🟢 Alta (principio de seguridad establecido)

### Qué pasó

Al configurar permisos de la app ML para integración de stock, ML mostraba 8 categorías de permisos posibles. Tenía 2 caminos:

**A. "Lectura y escritura" en todos**: máxima flexibilidad para el futuro, una sola configuración.
**B. Scope mínimo**: solo lo que necesitamos AHORA para sync de stock — 1 permiso con escritura (Publicación), 2 con lectura (Usuarios + Venta), resto sin acceso.

Elegí B. Razones:
- Si los tokens OAuth se comprometen (leak en logs, bug en el cifrado, etc), el blast radius es chico.
- Atacante en peor caso modifica stock — pero no factura, no maneja pagos, no cambia cuenta, no envía mensajes a clientes.
- Si en el futuro necesitamos otro permiso (ej: leer métricas para dashboard), pedimos al founder que re-autorice con scope ampliado. Fricción baja vs riesgo permanente.

### Por qué funciona

- **Principle of Least Privilege** aplicado: tokens solo pueden hacer lo necesario.
- **Re-authorization cost is low**: ML permite ampliar scopes pidiendo nueva autorización al user. No es "blocker permanente".
- **Auditable**: si veo en logs que la app hizo algo fuera de scope (ej: intentó crear factura), sé que es bug nuestro, no permiso configurado mal.

### Trade-off

- Cada feature nueva que necesite scope adicional requiere re-autorización del founder (1 click cada N meses cuando se sume feature). Costo bajo, founder lo entiende.

### Aplicar a futuro

Cualquier integración OAuth con terceros (Tiendanube, Shopify, Stripe Connect, etc):
- Listar permisos disponibles.
- Marcar solo los que se usan en el sprint actual.
- Documentar en ADR cuáles se eligieron + razón.
- Cuando se sume feature que necesite más, ampliar scope explícito.

### Caso límite

Si la integración es ÚNICAMENTE consumo (read-only, sin acciones del usuario), pedir solo `read` aunque parezca obvio. Refuerza el patrón.

---

## 2026-05-29 — Sprints separados por dependencia de credenciales externas: Sprint 1 sin creds, 2-3 con

**Categoría**: Project management / Dependencies / Sprint planning
**Confianza**: 🟡 Media (1 caso aplicado en ML integration)

### Qué pasó

Founder pidió integración Mercado Libre. Es trabajo grande (2-3 sprints). 2 caminos:

**A. Bloquear hasta tener credenciales**: pedir al founder que registre app ML primero, esperar 1-2 días, después arrancar.
**B. Dividir en Sprint 1 sin credenciales + Sprints 2-3 con credenciales**: Sprint 1 son foundations puras (migrations, types, schemas, ADR) que NO requieren auth. Mientras el founder hace su trámite, tenemos toda la estructura lista.

Elegí B. Razones:
- Founder tiene su tiempo para registrar la app sin presión.
- El sitio queda con foundations claras (migrations + types) que NO afectan nada actual.
- Cuando el founder vuelva con credenciales, arrancamos Sprint 2 con todo armado.
- Sprint 1 también incluye ADR formal, que es decisión arquitectónica que NO depende de credenciales.

### Por qué funciona

- **Reduce idle time**: el desarrollo no se bloquea esperando al founder.
- **Reduce pressure al founder**: él no tiene que apurarse "porque te estoy esperando".
- **Sprint 1 es self-contained**: si nunca arrancamos Sprint 2, las foundations no rompen nada (migration es additive, tipos no se importan en otro lugar todavía).
- **ADR primero**: la decisión arquitectónica queda escrita ANTES de implementar — referenciable durante Sprints 2-3.

### Trade-off

- Sprint 1 puede sentirse "trabajo invisible" porque no hay UI nueva ni feature usable. Pero es la base.
- Si el founder cambia de idea entre Sprint 1 y 2, el Sprint 1 queda como código sin usar (low cost — pocas líneas de types/schemas).

### Aplicar a futuro

Cualquier feature que requiere:
- Credenciales de terceros (APIs externas).
- Setup operativo del founder (cuenta nueva, verificación de identidad).
- Hardware / assets fuera del código.

→ Dividir en "Sprint 0/1: foundations que NO requieren X" + "Sprints siguientes: con X".

Casos análogos en este proyecto:
- Resend email: ya hicimos lo de "Resend OPCIONAL, suscripción no bloquea" — mismo principio.
- Fotos categorías: tenemos placeholder genérico que funciona sin fotos, se reemplaza cuando llegan.

---

## 2026-05-29 — Config declarativa paga sus costos en el SEGUNDO uso: sumar filter material = 4 archivos thin + 1 entry + 1 if

**Categoría**: Arquitectura / Validación de inversión inicial
**Confianza**: 🟢 Alta (caso confirma el patrón armado en sprint anterior)

### Qué pasó

En el sprint del 29 hice config declarativa `BRAND_FILTERS` + helper + componente shared para los 9 archivos de filtros (polarizados + 4 formas). Costó ~590 líneas iniciales pero argumenté que el costo se amortiza en futuros usos.

Hoy sumé 2 nuevos filtros (acetato + metal). Costo real:
- 1 entry en `BRAND_FILTERS` (5 líneas c/u).
- 1 if en el switch del filter query (3 líneas).
- 1 alternativa en el type union (2 líneas).
- 4 archivos route thin (~50 líneas c/u, mismo template).

**Total: ~210 líneas para 20 URLs SSG nuevas**.

Sin la config declarativa, hubiera sido: 4 archivos completos con su propio fetchByMaterial, su propio buildMaterialMetadata, su propio componente catalog. Estimado ~500+ líneas y mayor riesgo de divergencia entre versiones.

### Por qué funciona

- **Costo de cambio = costo de agregar entry al config**. Mínimo, predecible.
- **0 cambios en el componente shared** (`BrandFilterCatalogPage`). Renders correcto sin tocar.
- **0 cambios en el helper resolver**. Funciona para cualquier nuevo filter automático.
- **0 cambios en el sitemap**. Itera `BRAND_FILTERS.flatMap()` — las nuevas URLs aparecen solas.

### El criterio de inversión confirmado

Cuando el patrón se aplica:
1. **Primer uso**: invertir en config + helper + shared component es costoso vs solución directa.
2. **Segundo uso**: la inversión empieza a pagar.
3. **Tercer uso en adelante**: cada nuevo caso cuesta ~10-20% del esfuerzo de un caso "from scratch".

Regla práctica: **si vas a tener 3+ casos del mismo patrón, vale armarlo declarativo desde el inicio**. Para 1-2 casos, hacerlo directo es OK.

### Aplicar a futuro

Próximos filters que valdrían la pena agregar al config cuando haya producto cargado:
- `lens_treatment_includes: 'mirrored'` → /espejados
- `lens_treatment_includes: 'photochromic'` → /fotocromaticos
- `attributes->>'gender': 'unisex'` → /unisex (capaz combinado con género existente)
- `frame_material: 'titanium'` → /titanio (nicho)

Cada uno cuesta lo mismo que acetato y metal hoy: 1 entry + 1 archivo route (o el if del switch si es un nuevo tipo de filter).

---

## 2026-05-29 — 404 page como "última estación útil" en vez de dead-end → 3+ atajos + WhatsApp

**Categoría**: UX / Retención / Error states
**Confianza**: 🟡 Media (1 caso aplicado, patrón industria conocido)

### Qué pasó

La 404 anterior era 1 h1 + 1 link. Si el usuario llegaba ahí (link roto, URL mal escrita, producto movido), tenía 1 opción: volver al inicio. Muchos abandonan.

Rediseñé como "última estación útil":
- 2 CTAs primarios (Inicio + Marcas).
- 3 atajos rápidos a destinos top (Sol, Receta, FAQs) con descripción.
- CTA WhatsApp con mensaje pre-cargado.

### Por qué funciona

- **Multi-camino**: en vez de "te equivocaste, volvé", ofrezco 5-6 caminos distintos para retomar.
- **Mensaje pre-cargado en WhatsApp**: ya pinta el contexto ("Hola, llegué a una página que no existe…"), bajando fricción al chat humano.
- **Coherencia visual**: usa el mismo lenguaje que /sobre-nosotros y /checkout/error (icon-circle + h1 italic + cards). El usuario reconoce el patrón como "página del sitio", no como "error feo".

### Patrón a confirmar (3era confirmación)

Mismo template visual en:
1. `/sobre-nosotros` (hero + sections).
2. `/checkout/exito` / `/pendiente` / `/error` (icon + h1 italic + cards).
3. `/not-found` (icon + h1 italic + cards).

3 casos → patrón estable. Próxima página informativa o de estado debería seguir este template (icon-circle / h1 serif italic / cards).

### Aplicar a futuro

Cualquier estado "error" o "dead-end" (sin resultados, sin stock global, sin acceso, mantenimiento) debe ofrecer:
- 2-3 caminos alternativos.
- WhatsApp con context.
- Tono amigable (no técnico).
- Diseño coherente con el resto del sitio (NO una página "error" genérica).

---

## 2026-05-29 — Recent searches en localStorage: persiste solo si la query tuvo results

**Categoría**: UX / localStorage / Patrones de persistencia
**Confianza**: 🟡 Media (1 caso aplicado)

### Qué pasó

Al sumar recent searches al SearchDialog, decisión: ¿persistir TODAS las queries que tipeó el usuario, o solo las que tuvieron results?

Elegí "solo con results". Razones:
- Si tipeo "asdfasdf" (error de tipeo), persistirla es ruido.
- Si tipeo "Ray-Ban" pero no tenemos esa marca, persistirla genera el dilema de "es una recent que NO va a funcionar".
- Solo persistir queries útiles (con results) → la lista recent es siempre confiable: si reclickeás, vas a ver algo.

### Trade-off

- Si el catalog crece y mañana SÍ tenemos esa marca, la query pasada no aparece como recent. Aceptable: el usuario probablemente la busca de nuevo.

### Combinado con dedup case-insensitive

`Vulk` y `vulk` cuentan como mismo item. La que persiste es la última versión tipeada (mantiene capitalization del usuario).

```ts
const without = current.filter(
  (q) => q.toLowerCase() !== trimmed.toLowerCase(),
);
const next = [trimmed, ...without].slice(0, RECENT_MAX);
```

### Aplicar a futuro

Cualquier "history" client-side (recent searches, recent products viewed, recent filters):
- Persistir solo "completions exitosas".
- Dedup case-insensitive.
- Cap razonable (5-10 items).
- Botón "limpiar" siempre visible.

---

## 2026-05-29 — Hub `/marcas` linkea a las brand pages (que ya tienen story editorial) = SEO + UX gratis

**Categoría**: Arquitectura de información / Reuso
**Confianza**: 🟡 Media (1 caso aplicado)

### Qué pasó

Necesitaba una página índice de marcas. Tenía 2 opciones:

**A. Página standalone con su propio contenido**: hero + descripción + reuse parcial de info.
**B. Página índice "thin" que linkea a las brand pages ya existentes** (donde está toda la story editorial gracias al sprint anterior de brand-story-section).

Elegí B. Razones:
- Las brand pages YA tienen story + tagline + meta strip + differentials (5 marcas cubiertas).
- `/marcas` solo necesita: nombre + logo + tagline corto + count + link.
- Sin duplicar copy. Si el founder edita `lib/brands/copy.ts`, ambas páginas se actualizan.

### Por qué funciona

- **Single source of truth**: `lib/brands/copy.ts` provee tagline para `/marcas` y story completa para `/[brand]`.
- **Funnel claro**: `/marcas` (browse) → `/anteojos-de-sol/[brand]` (story + catálogo) → `/anteojos-de-sol/[brand]/wayfarer` (filtrado SEO) → `/[brand]/[product]` (PDP).
- **SEO**: cada step tiene su propio keyword target sin duplicate content.
- **Mobile**: el grid se colapsa a 1 col, las cards son tappeables fácil.

### Trade-off

- Si el founder ajusta tagline en `lib/brands/copy.ts`, debe revisar visualmente que el texto entre bien en la card de `/marcas` (~150 chars max razonables). Sin guardrails técnicos para esto iter 1.

### Aplicar a futuro

Cualquier "hub" page que existe sobre entidades ya con páginas propias (categorías, marcas, autores, colecciones):
- NO duplicar contenido. Solo: identidad mínima + descriptor corto + link.
- Reusar el dict/source-of-truth existente.
- El usuario que quiere detalle entra a la página específica.

---

## 2026-05-29 — ⌘K + `/` como atajos de search es lo que el usuario power-user espera

**Categoría**: UX / Keyboard shortcuts / DX
**Confianza**: 🟡 Media (1 caso aplicado pero patrón industria establecido)

### Qué pasó

Al agregar el search global, sumé 2 atajos de teclado:
- `⌘K` / `Ctrl+K`: toggle del dialog. Estándar en apps modernas (GitHub, Linear, Notion, Slack, Vercel).
- `/`: abre el dialog. Estilo GitHub. Más rápido para mouse-less users.

Pero el `/` tiene un edge case: si el usuario está escribiendo en un input/textarea/contenteditable, NO debe interceptar — sino, no podés tipear `/` en ningún form. Check explícito en el handler.

### Por qué funciona

- **⌘K es muscle memory** para usuarios técnicos. Lo van a probar sin que lo digas.
- **`/` es discoverable** porque GitHub lo popularizó. Power users lo asocian con "search".
- **Edge case bien manejado**: el check `target.tagName.toLowerCase() in ['input', 'textarea']` + `isContentEditable` cubre 99% de los casos donde no querés interceptar.

### Snippet clave

```ts
const target = e.target as HTMLElement | null;
const tag = target?.tagName.toLowerCase();
const isEditable =
  tag === 'input' ||
  tag === 'textarea' ||
  target?.isContentEditable === true;
if (!isEditable) {
  e.preventDefault();
  setOpen(true);
}
```

### Aplicar a futuro

Cualquier global keyboard shortcut que comparta tecla con input común (`/`, `\`, letras solas):
- Check si el target es editable antes de interceptar.
- Si no, prevent default + actuar.

Para shortcuts con modificador (⌘K, Ctrl+P): no necesitan el check porque modificador + tecla raramente es input legítimo.

### Otros atajos que valen la pena

- **`?`**: shortcuts help dialog.
- **`g h`**: ir a home (gh git-style).
- **`Esc`**: cerrar modal/cancelar (Radix Dialog ya lo maneja).

---

## 2026-05-29 — In-memory filter cliente para N pequeños (28 items) gana vs server-side filter con URL params

**Categoría**: UX / Performance / Trade-offs
**Confianza**: 🟡 Media (1 caso aplicado en FAQ search)

### Qué pasó

Para `/preguntas-frecuentes` con 28 FAQs, agregué buscador y chips por categoría. 2 caminos:

**A. Server-side con URL params** (`?q=cuotas&cat=pagos`): SSR siempre, mantiene shareability del link específico, sin JS extra para el filter. Pero requiere round-trip al server por cada keystroke (o debounce + URL replace), y la página pasa de static → dynamic.

**B. Client-side in-memory filter**: filtrá los 28 items en memoria con `useMemo`. Sin server roundtrip, sin URL syncing. Trade-off: la página pasa a tener client component (subió 1.5kB) y los filtros activos no se shareablean por URL.

Elegí B. Razones:
- 28 items, filtro es O(28) — imperceptible.
- La página se mantiene `revalidate: 3600` (FAQs cambian poco), client component liviano.
- Shareability de filtros: prioridad baja. Si necesario en el futuro, suma `useSearchParams` para sincronizar.
- UX: instantáneo, sin "loading" cada vez que tipea el usuario.

### Por qué funciona

- Para sets < 100 items, in-memory filter siempre gana en perceived performance.
- Sin debounce necesario porque el work es trivial (O(N) string includes).
- JSON-LD FaqPage schema se renderiza server-side con TODAS las FAQs — Google ve el set completo sin importar lo que el usuario filtre.

### Cuándo migrar a server

- Si el set crece a > 500 items.
- Si shareability de filtros es requirement explícito.
- Si querés tracking de queries (search → analytics).
- Si la lógica de filter es compleja (fuzzy matching, sinónimos, ranking).

### Aplicar a futuro

Cualquier filter/search sobre N pequeño y data ya renderizada en la página:
- Catálogo de productos en una marca específica (típicamente < 30 productos por marca).
- FAQs por categoría.
- Brands list filtrado por país/segmento.

In-memory wins. Server con URL params solo cuando hay un razón concreta (shareability, SSR para SEO de página filtrada, tracking).

---

## 2026-05-29 — Config declarativa (BRAND_FILTERS) + helper resolver = 9 archivos route casi vacíos sin perder claridad

**Categoría**: Arquitectura / Code reuse / Routing
**Confianza**: 🟢 Alta (1 caso aplicado pero el patrón es estándar)

### Qué pasó

Para 9 rutas hijas SEO (polarizados + 4 formas × 2 categorías) había 2 caminos:

**A. 9 archivos completos**: cada uno con su own `generateStaticParams`, `generateMetadata`, `Page` función. ~80 líneas c/u = 720 líneas.

**B. Config + helper + 9 archivos finos**:
- Config declarativa: `lib/catalog/brand-filters.ts` con `BRAND_FILTERS: BrandFilter[]`.
- Helper resolver: `lib/catalog/brand-filter-page-helper.ts` con `resolveBrandFilterPage()` + `resolveBrandFilterMetadata()`.
- 9 archivos route ~50 líneas c/u (cambia solo CATEGORY + FILTER_URL_SLUG).
- Total: ~450 líneas + config 80 + helper 60 = 590 líneas.

Elegí B. ~130 líneas menos pero el real win es:

### Por qué funciona

- **Cambios cross-cutting (1 lugar)**: si quiero ajustar cómo se construye la query o el meta tag, edito 1 archivo (helper), no 9.
- **Agregar nuevo filtro = 1 archivo**: si decido agregar `/[brand]/redondo`, agrego 1 entry en BRAND_FILTERS + 1 archivo route fino + 0 cambios en helper/component.
- **Sitemap auto-gen**: el sitemap itera `BRAND_FILTERS.flatMap(...)` — sin necesidad de actualizar manualmente cuando se agregan filtros.
- **Type-safety**: si me equivoco con el filter type en algún route, TS me avisa al compilar.

### Trade-off

- Indirección: para entender qué hace `/anteojos-de-sol/vulk/polarizados`, hay que leer el route → helper → query → config. 4 saltos.
- Mitigación: comentarios JSDoc en cada archivo apuntan al patrón. Y los 9 archivos route son tan finos que el dev los puede skipear directo al helper.

### Aplicar a futuro

Cualquier set de N rutas que siguen el mismo patrón con datos parametrizables (filtros, categorías secundarias, vistas alternativas):
- N <= 3: archivos completos OK.
- N > 3: config + helper + thin routes.

### Patrón meta confirmado

Este es el **segundo caso** de "config declarativa + helper para N rutas casi-iguales" (1ro fue gender pages — aunque ahí no tenía helper formal, había 4 archivos casi idénticos). Promover a regla informal: cuando aparezca un 3er caso (probablemente material/lente_color filters), formalizar en CLAUDE.md.

---

## 2026-05-29 — Quick view modal con lazy fetch (server action al primer click) = cero N+1 en catálogo

**Categoría**: Performance / Server actions / UX
**Confianza**: 🟡 Media (1 caso aplicado, patrón conocido)

### Qué pasó

Para el quick view del producto en card, tuve 2 opciones:

**A. Pre-fetch en server component**: incluir TODA la data del modal en la card prop. Sin delay al click, pero N queries adicionales × N cards visibles (potencialmente decenas).

**B. Lazy fetch en server action al primer click**: card lleva solo data básica (slug + href). Click → server action → modal con detalles.

Elegí B. Razones:
- N cards visibles × 5+ campos extra (variants, brand details) = bandwidth significativo.
- 99% de usuarios NO van a hacer click en quick view. Pre-fetch = waste.
- 1% que sí lo hace tolera 200-400ms de latency (es un modal, expectativa de carga existe).

### Por qué funciona

- **Catálogo principal NO se ralentiza**. Card data sigue mismo size que antes.
- **Lazy es per-click**: si el usuario abre 3 quick views, son 3 fetches (no 30).
- **Cache local por card**: si abrís → cerrás → reabrís el mismo quick view, hit cache local (state) sin refetch.

### Trade-off

- Primera abertura del modal tiene loading skeleton breve. Si fuera crítico (e.g. modal con add-to-cart immediate), pre-fetch.
- Server action vs API route: server action es más simple, NO hay JSON serialización manual, type-safe end-to-end.

### Aplicar a futuro

Cualquier modal/popover/dropdown con data del backend:
- Data probablemente no visitada por el usuario → lazy fetch.
- Data crítica primera-vista → pre-fetch en server component.

---

## 2026-05-28 — Coordinación de overlays fijos via cookie polling (CompareBar + FloatingWhatsapp) — patrón confirmado

**Categoría**: UX / Componentes globales / Estado compartido
**Confianza**: 🟢 Alta (3era aplicación del patrón cookie polling: WishlistBadge + CompareBar + FloatingWhatsapp)

### Qué pasó

Al sumar FloatingWhatsapp surgió un problema visual: si hay items en CompareBar (barra inferior sticky con CTA), y FloatingWhatsapp también está fixed bottom, se PISAN. UX rota.

Solución: FloatingWhatsapp lee la cookie `oc_compare` con el mismo helper que CompareBar (`readCompareClientSide`) cada 1.5s. Si hay items, FloatingWhatsapp se OCULTA via AnimatePresence.

### Por qué funciona

- **Cero estado global**. Sin Context, sin Zustand, sin Redux.
- **Cada overlay decide solo**. No hay master coordinator.
- **El estado fuente es la cookie**, que ya tiene su propio mecanismo de sync (server actions + revalidatePath).
- Polling 1.5s es suficientemente rápido para UX (no percibís lag) y suficientemente bajo para no impactar performance.

### Trade-off

- Mini-polling en cada componente que necesita reaccionar. Si tuviéramos 5 componentes haciendo polling, sumaría. Por ahora: WishlistBadge (1.5s), CompareBar (1.5s), FloatingWhatsapp (1.5s) = 3. Aceptable.
- Si crece, considerar custom event que se dispare en `toggleCompareAction` para que todos los componentes lo escuchen. Pero KISS por ahora.

### Aplicar a futuro

Cualquier componente que necesita reaccionar al estado de wishlist/compare/recently-viewed:
- Lee la cookie en useEffect.
- setInterval cada 1.5s + focus listener.
- Sin context.

Cuando promover a custom event:
- Si llegamos a 5+ componentes con polling.
- O si el founder reporta lag perceptible.

### Patrón meta confirmado

Este es el **tercer caso** del "cookie como source-of-truth para estado client UI" en este proyecto. Ya es regla efectiva. Cuando aparezca un 4to caso, considerar agregar a CLAUDE.md / ARCHITECTURE.md como pattern oficial.

---

## 2026-05-28 — Carpetas estáticas en Next 15 ganan a [dynamic] para evitar conflict con sibling routes

**Categoría**: Next.js routing / Arquitectura SEO
**Confianza**: 🟢 Alta (patrón estándar Next.js + caso aplicado)

### Qué pasó

Quería crear `/anteojos-de-sol/[brand]/hombre` y `/mujer` (páginas hijas SEO). Pero la ruta `[brand]/[X]` ya estaba ocupada por `[brand]/[product]/page.tsx` (PDP). Tenía 2 opciones:

**A. Usar `[gender]/page.tsx` dynamic**: conflict directo con `[product]/page.tsx` — Next 15 NO permite 2 dynamic segments en el mismo nivel con nombres diferentes.

**B. Carpetas estáticas `hombre/` y `mujer/`**: el router de Next 15 **prioriza static sobre dynamic** en el mismo nivel. Cuando hay `[brand]/hombre/page.tsx` y `[brand]/[product]/page.tsx`, la URL `/vulk/hombre` matchea PRIMERO el static, y `/vulk/vulk-day-light` cae al dynamic. Sin conflict.

Elegí B.

### Por qué funciona

- Next 15 documenta este precedence rule explícito: static > dynamic en el mismo nivel.
- Cero ambigüedad runtime — el matching es determinístico.
- SEO control fino: cada static folder es su propia ruta con metadata propia.

### Trade-off

- 4 archivos `page.tsx` casi idénticos (hombre/mujer × sol/receta) vs 1 archivo `[gender]/page.tsx` con validation.
- ~150 líneas duplicadas total (50 c/u, casi idéntico salvo 2 constantes).

Acepto porque:
- Cambios de comportamiento se hacen en el componente compartido `<BrandGenderCatalogPage>`, no en los wrappers.
- Cualquier dev (o yo en 6 meses) entiende el routing al ver el filesystem.
- Es el patrón canónico de Next.js para este caso.

### Aplicar a futuro

- Páginas hijas SEO de filtros (ej `/anteojos-de-sol/vulk/polarizados`, `/aviador`) → mismo patrón static folder.
- **Restricción**: ningún producto puede tener slug igual a un static segment hermano. Documentado implícito en routing.
- Para 2+ static segments con la misma estructura (caso de esta sesión), el archivo wrapper se replica. Es OK hasta 10 archivos. Si crece más, considerar generador de código o config-driven routes.

### Mistake a evitar

Si llego a usar `[X]` dynamic en un nivel donde ya hay otro `[Y]` dynamic en sibling, Next 15 tira error de compilación. Mensaje cripta — vale identificarlo rápido.

---

## 2026-05-28 — Copy editorial en TS (no DB) gana en velocidad de iteración para 5-10 entidades

**Categoría**: Arquitectura / Velocidad de iteración / Data
**Confianza**: 🟡 Media (1 caso aplicado en brands)

### Qué pasó

Para las páginas de marca necesitaba copy editorial (story, tagline, differentials) por marca. 2 opciones:

**A. DB**: agregar columnas a tabla `brands` (`tagline`, `story_md`, `founded_year`, `differentials jsonb`). Founder edita via SQL o admin UI. Bueno para multilenguaje futuro, admin sin redeploy.

**B. TS dict**: `lib/brands/copy.ts` con `Record<slug, BrandCopy>`. Code edits + redeploy.

Elegí B. Razones:
- 5 marcas activas (no 50). El dict es manejable a ojo.
- Founder no tiene admin UI. Editar SQL es más fricción que editar TS para él.
- Sin necesidad de multilenguaje (proyecto es es-AR puro).
- Cambios en copy son raros (no diarios) → redeploy no es costo real.
- Type-safe: si me equivoco con un slug, TS me avisa al compilar.

### Por qué funciona

Para N entidades chico (3-10) con copy estático, **TS dict gana** sobre DB. Si N > 20 o el copy cambia con frecuencia, considerar DB.

Costo evitado: migración + admin UI + texto deserializado de markdown.

### Trade-offs explícitos

- Cambiar copy requiere PR + deploy. OK porque cambios son raros.
- No hay versionado de copy (DB con `updated_at` daría history). OK por ahora.
- Si el founder quiere editar en producción sin pedirme, se complica. OK por ahora.

### Cuándo migrar a DB

- Si llegamos a 15+ marcas activas con copy.
- Si necesitamos multilenguaje (en-US, pt-BR).
- Si el founder quiere un admin UI propio para editar copy.
- Si el copy cambia muy frecuente (varias veces al mes).

Hasta entonces, default a TS dict.

### Patrón a confirmar

Mismo patrón aplicable a:
- Copy de skill IA (prompts editoriales). YA ESTÁ EN TS.
- Copy de páginas info (sobre nosotros, envíos). Si crece, evaluar DB.
- Copy de categorías (sol vs receta). YA ESTÁ EN TS (`lib/catalog/categories.ts`).

3 casos del patrón → ya es regla efectiva. No promover formal a CLAUDE.md hasta que sea contraintuitivo (cuando alguien proponga DB para algo chico).

---

## 2026-05-28 — Welcome email NO bloquea suscripción → captura siempre, email es nice-to-have

**Categoría**: Resiliencia / Email / UX
**Confianza**: 🟡 Media (1 caso aplicado)

### Qué pasó

Al integrar newsletter con Resend para welcome email, tuve 2 caminos:

**A. Bloqueante**: si Resend falla (key missing, dominio no verificado, etc), la suscripción tira error y el usuario ve "algo salió mal".
**B. No bloqueante**: la suscripción se guarda en DB siempre. El welcome es fire-and-forget. Si Resend falla, log warn y seguir.

Elegí B. Razones:
- **Captura del lead es lo crítico**. El email de welcome es accesorio.
- Si el founder no configuró Resend todavía, el sistema sigue funcionando.
- Si Resend tiene rate limit / outage, el lead no se pierde.
- Si el dominio aún no está verificado (DNS pendiente), seguimos capturando.

### Implementación

```ts
if (!alreadyExisted) {
  sendWelcomeEmail(email).catch((err) => {
    console.warn('[newsletter] welcome email failed (non-blocking)', err);
  });
}
return { ok: true, alreadyExisted };
```

El `.catch()` es esencial — sin él, una promise rejected sin await tira UnhandledPromiseRejection en Node.

### Aplicar a futuro

Cualquier "side effect" en un flow crítico (analytics, notifications, sync a 3rd party) debe ser no-bloqueante por default. Solo bloquear cuando la integridad de la operación lo requiere (ej: capturar el pago SÍ bloquea la confirmación del pedido).

Reglas mentales:
- ¿Si esto falla, perdemos data crítica? → bloquear.
- ¿Si esto falla, perdemos comodidad? → fire-and-forget con log.

### Patrón a confirmar

Este es el 2do caso (1ro fue recently-viewed tracker: si falla no bloquea navegación). Si aparece un 3er caso → promover a regla en CLAUDE.md / ARCHITECTURE.md como "side effects no-bloqueantes por default".

---

## 2026-05-28 — `<details>/<summary>` nativo para acordeones de FAQ — KISS gana vs framer-motion AnimatePresence

**Categoría**: Componentes / Performance / Accesibilidad
**Confianza**: 🟡 Media (1 caso aplicado en ProductFaqs)

### Qué pasó

Para los mini-FAQs contextuales del PDP necesitaba 4 ítems acordeón. Tenía 2 opciones:

**A. Framer-motion AnimatePresence**: control fino de animaciones (height auto, opacity, easing custom), pero requiere client component + JS runtime + manejo de estado.
**B. `<details>/<summary>` nativos + CSS transition**: accesible por default, sin JS, sin hydration, sin client component, animation de chevron con `group-open:rotate-180`.

Elegí B. Razones:
- Para 4 ítems con animación simple, A es overkill.
- B es 100% server component → 0 JS extra.
- A11y default: aria-expanded gestionado por browser.
- El control de styling cubre 95% de los casos (chevron rotation, bg-on-open, padding cambia).

### Por qué funciona

Lo único que se "pierde" con `<details>` es la animación de **height** al expandir (jump visual). Para 4 FAQs de 1-3 líneas cada una, el jump es imperceptible. Para FAQs largas (10+ líneas), sí se notaría — ahí habría que ir con framer.

### Aplicar a futuro

Default a `<details>` para cualquier acordeón con contenido corto. Solo escalar a framer cuando:
- Hay 6+ items con contenido medio/largo.
- Necesitamos animación de height.
- Hay nested state (sub-acordeones).

Skip framer cuando: 1-5 items, contenido <5 líneas, no hay nested.

---

## 2026-05-28 — Feedback de founder sobre nueva feature = oportunidad para sistematizar requisitos cross-cutting (PRODUCT_SCHEMA)

**Categoría**: Proceso / Sistematización / Calidad de datos
**Confianza**: 🟡 Media (1 caso, primera aplicación del patrón "feedback → schema")

### Qué pasó

Founder probó el comparador y reportó 2 problemas:
1. UX mobile no era amigable (problema visual concreto, fácil de fijar).
2. **"Todos los casilleros deben coincidir, debe estar prolijo"** → problema estructural: si los productos no tienen TODOS los campos llenos, la tabla queda con "—" y se ve mal.

El segundo es el interesante. Podía resolverlo "tactico" (filtrar productos sin data en el comparador), pero la causa raíz es: **no había un contrato explícito de qué campos debe tener un producto para ser "completo"**.

Creé `PRODUCT_SCHEMA.md` que:
- Lista los 13 campos exactos del comparador (lo que el founder ve cuando dice "casilleros").
- Marca cada campo con nivel 🔴/🟡/⚪.
- Tiene una **checklist operativa para pegar al founder** y pedir uno por uno.
- Actualicé skill `/product` con regla bloqueante explícita + apuntador a este schema.

### Por qué funciona

- **Convierte un feedback puntual en regla permanente**. El founder no va a tener que recordarme "che, cargá todo" cada vez. Está escrito.
- **Cierra el loop**: schema → skill `/product` → CLAUDE.md (referencia). Tres lugares apuntan al mismo contrato.
- **Es accionable inmediatamente**: la checklist se puede copiar y mandar al founder. No es un schema teórico, es operativo.

### Patrón a replicar

Cada vez que el founder de feedback tipo "esto tiene que estar siempre X" o "no quiero ver Y" sobre una feature ya implementada, evaluar:
- ¿Es solo este caso, o es una regla cross-cutting?
- Si es cross-cutting → buscar el lugar correcto (schema, contrato, regla en CLAUDE.md, skill) y escribirlo ahí.
- Linkear desde 2+ lugares para que sea descubrible.

Próximas oportunidades del patrón:
- "Las imágenes deben ser X" → IMAGE_SCHEMA.md o sección en PRODUCT_SCHEMA.md.
- "Las descripciones deben tener Y" → ya cubierto por skill `/article` y `content-writer-medical`.
- "Los meta-tags deben Z" → ya cubierto por `seo-strategist`.

### Costo

~30min escribir PRODUCT_SCHEMA.md vs ~5min "filtro tactico". Pero el schema se amortiza desde el siguiente producto cargado.

---

## 2026-05-28 — Detección de overflow + sticky shadow = patrón mobile-friendly para tablas comparativas

**Categoría**: UX / Mobile / Component patterns
**Confianza**: 🟡 Media (1 caso aplicado, pero el patrón es industria estándar)

### Qué pasó

Refactor del comparador mobile. La tabla con sticky first col por sí sola no comunica visualmente que hay contenido scrolleable. UX rompe.

Aplicación: 3 visual cues complementarios:
1. **Hint textual**: "Deslizá para ver más →" arriba de la tabla, **solo visible si hay overflow real** (`scrollWidth > clientWidth`). Detectado con ResizeObserver + recalculado en resize.
2. **Sticky shadow dinámica**: la first col tiene `box-shadow` lateral derecha que **solo aparece cuando `scrollLeft > 4`**. Comunica "esa col está fija, hay contenido scrolleado a la izquierda".
3. **Min-width por columna**: 168px mobile, 200px sm+ → garantiza que cada producto tenga espacio legible aunque no entre todo en pantalla.

### Por qué funciona

Los 3 cues no se pisan. Hint + shadow + min-width son ortogonales:
- Hint: orienta antes de tocar.
- Shadow: feedback DURANTE el scroll.
- Min-width: garantiza legibilidad de cada celda.

Sin uno solo de los tres, la UX se degrada (testeable mentalmente: sin hint, ¿cómo sabe que hay más? Sin shadow, ¿cómo sabe que la col fija es intencional? Sin min-width, ¿cómo se ve algo con 4 cols de 50px?).

### Aplicar a futuro

Cualquier tabla con scroll horizontal en mobile (pricing comparisons, specs side-by-side, dashboards) debe incluir los 3 cues.

---

## 2026-05-28 — 3era app del patrón cookie-first: comparador valida que es pattern, NO incidente. Candidato a regla de CLAUDE.md.

**Categoría**: Arquitectura / Persistencia / Patrones consolidados
**Confianza**: 🟢 Alta (3 casos: wishlist + recientes + comparador)

### Qué pasó

Founder pidió comparador. Lo planeé y ejecuté en 30min sin agente porque ya tenía mapa mental del patrón:
- Cookie con array de entries serializados.
- Server helpers (`'use server'`): read + toggle/track + remove + clear.
- Client helper para leer cookie sin server round-trip.
- Server actions con `revalidatePath` de la página personal.
- Server wrapper que pre-fetchea data por slugs → pasa a client component.
- Polling 1.5s + focus listener para captar cambios cross-tab.
- Página personal `/X` con `force-dynamic` + `robots: noindex` + empty state con `<RecentlyViewed>` fallback.

### Por qué funciona

Los 3 casos (wishlist, vistos recientemente, comparador) tienen estructura idéntica: lista de slugs con metadata mínima, persistencia sin auth, una página personal para verlos juntos. El patrón es **el approach correcto para todo feature de persistencia client-side ligera en este proyecto**.

### Promoción a regla

Después de 3 confirmaciones, esto es candidato fuerte a:
- Agregar a `CLAUDE.md` (ARCHITECTURE.md tal vez mejor) bajo "Patrones consolidados" como "Persistencia cookie-first" con los 5 puntos de arquitectura listados.
- Cuando aparezca un 4to caso (probablemente "items en checkout anon" o "preferencias UI"), aplicar el patrón directamente sin replantear.

Riesgo a vigilar: si los entries crecen mucho (>200 bytes/entry × 50 items en wishlist = 10KB cookie), empezar a sentir el costo. El comparador con cap 4 está fuera de ese riesgo.

### Costos del patrón vs alternativas

vs DB-first: cero fricción (no requiere login). Sync a DB en login es trivial cuando se active.
vs localStorage: cookie permite SSR (server lee → render server). localStorage requiere client-only render → hydration delays / flashes.

---

## 2026-05-28 — Visibilidad de features = nueva variant explícita, no override por className

**Categoría**: Component API / UX
**Confianza**: 🟡 Media (1 caso aplicado)

### Qué pasó

Founder reportó que el botón de wishlist en página de producto era poco visible (estaba como variant `inline` debajo del CTA WhatsApp, ya scrolleado). Pidió moverlo arriba al lado del título, patrón ML. Tuve 2 caminos:

**A. Override por className**: usar `variant="inline"` con `className="..."` para mover layout, ocultar texto, etc.
**B. Nueva variant `'title'`**: declarar explícito como tercer modo (`'card' | 'inline' | 'title'`), con su propio estilo y esqueleto SSR.

Elegí B. El icon-only con tamaño grande, sin borde y posicionamiento al lado del h1 no es un "tweak del inline", es un layout distinto.

### Por qué funciona

- **Discoverabilidad**: cualquier dev (o yo en futuro) lee la prop `variant` y entiende los 3 modos sin tener que parsear className overrides.
- **Esqueleto SSR específico**: cada variant tiene su tamaño de placeholder durante hydration. Override por className hubiese roto el esqueleto del 'inline' o forzado a condicionar el className del esqueleto.
- **Animación y a11y consistentes**: el mismo `motion.span` + Heart + aria-pressed se repite en los 3 branches, pero el contenedor (border, padding, hover) cambia. Variant explícita modela bien ese eje.

### Costo: 30 líneas duplicadas

El branch de `variant === 'title'` tiene su propio `<button>` y esqueleto. Hay ~30% código repetido vs un único componente parametrizable. Acepto porque la lectura es 5x más simple y la prop type es self-documenting.

### Aplicar a futuro

- Comparador de productos (próximo backlog): si tiene 2 ubicaciones (card flotante + barra inferior), declarar variants explícitas en vez de className override.
- Cualquier botón que tenga >2 ubicaciones con layout distintos → variants enum, no className.

---

## 2026-05-28 — Cookies funcionan para 2 features de persistencia ligera (wishlist + vistos recientemente) — patrón confirmado

Aplicación 2da del approach "cookie-first para persistencia sin auth". Ahora con tracker automático (vistos recientemente) en lugar de toggle manual (wishlist). Confirma:
- LRU (al ver de nuevo un producto, sube al tope) se implementa trivial: `[entry, ...existing.filter(s => s !== entry.slug)].slice(0, MAX)`.
- Tracker auto se hace con client component invisible que llama server action al mount. Fire-and-forget.
- Mismo helper `fetchProductsBySlugs` sirve para wishlist Y vistos recientemente. Buena reutilización.

Próximas aplicaciones del patrón ya identificadas:
- Comparador de productos (array de slugs, max 4).
- Preferencias UI (dark mode, idioma).
- Carrito anónimo (ya existe en el proyecto).

---

## 2026-05-28 — Wishlist con cookies (no DB) baja la fricción a CERO: funciona sin login + es trivial sumar sync a DB después

**Categoría**: Arquitectura / E-commerce / Decisiones de persistencia
**Confianza**: 🟡 Media (1 caso aplicado, pendiente confirmar uso real)

### Qué pasó

Al implementar wishlist tuve 2 opciones:

**A. DB-first**: tabla Supabase `wishlist` con RLS, requiere login. Pros: persistencia entre devices, datos para remarketing. Contras: cliente NO logueado no puede usar (alta fricción), implementación con cookie fallback duplica trabajo.

**B. Cookie-first**: array de slugs en cookie, sin login required. Pros: cero fricción (cualquier visitante puede usar), implementación más simple, no toca DB. Contras: no sync entre devices, no datos para remarketing en iter 1.

Elegí B. Razones específicas:
- Iter 1 de wishlist en sitio sin tráfico real: validar primero si la feature se USA antes de complejizar.
- La auth está implementada pero NADIE se va a registrar solo para guardar favoritos. Forzar login = matar el feature.
- Sync a DB en iter 2 es trivial: en `auth/callback` chequear si cookie tiene items → INSERT en tabla wishlist con user_id + clear cookie.
- Los slugs son data PÚBLICA, no hay riesgo de exponerlos en cookie no httpOnly.

### Por qué funciona

- **Cero fricción** = máxima adopción. El cliente toca corazón → guardado. No hay paso intermedio.
- **Cookie ~2KB** con 50 entries es seguro (límite browser ~4KB).
- **Server actions + revalidatePath** permiten que `/favoritos` siempre muestre lo actual.
- **Client-side read** del cookie (no httpOnly) permite badge en header sin server round-trip.

### Cómo aplicar este pattern

Para CUALQUIER feature de persistencia ligera que NO requiere auth crítica:

1. **Empezar con cookies/localStorage** si:
   - Data es pública (slugs, IDs públicos, preferencias UI).
   - Volumen es bajo (<5KB).
   - No requiere sync entre devices en iter 1.
2. **Pasar a DB** cuando:
   - Necesitás sync entre devices.
   - Querés remarketing/analytics sobre la data.
   - Volumen excede cookie limits.
3. **Migración cookie → DB** se hace en el momento de login del user (callback de auth) — simple, sin sync continuo.

### Anti-patrón a evitar

- Forzar login para features de baja sensibilidad (wishlist, último visto, carrito anónimo). Mata adopción.
- Sobre-ingeniería en iter 1: implementar DB + cookie + sync sin saber si la feature se usa.
- Confundir "feature requiere persistencia" con "feature requiere DB". A veces cookie basta.

### Aplicaciones futuras

- "Productos vistos recientemente": cookie con array de slugs, max 10.
- Preferencias UI (dark mode toggle, idioma): cookie.
- "Tu lista de comparación" (cuando se implemente): cookie array de slugs hasta 4.
- "Tu carrito" anónimo (ya implementado con cookie en el proyecto).

---

## 2026-05-28 — Crear página + API ≠ feature live. Sin navegación visible para el cliente, la feature no existe en producción.

**Categoría**: Discoverability / UX / Cierre de loop de implementación
**Confianza**: 🟢 Alta (caso obvio en retrospectiva, founder lo señaló inmediatamente)

### Qué pasó

Implementé 2 herramientas IA (recomendador de monturas + lector de receta) con páginas funcionales en `/recomendador-de-monturas` y `/lector-de-receta`, las pusheé, build verde, y declaré "feature lista". Founder reportó: **"No veo el lector de receta ni el probador de monturas"**.

Causa: las páginas existían pero NO había **ningún link visible** desde el sitio público a ellas. Solo eran accesibles por URL directa o vía sitemap (que Google ve pero el cliente humano no).

### Causa raíz

**Confundí "página existe + indexable" con "feature descubrible"**. Para un developer son lo mismo (las herramientas funcionan, sitemap las lista, Google las indexa). Para un cliente, una página sin link desde el resto del sitio **no existe**.

Patrón meta: **el ciclo de implementación de una feature web no termina en "página funciona", termina en "cliente puede llegar a la página sin saber la URL"**. Es trivial cuando se piensa, pero fácil de olvidar en el sprint de implementación.

### Cómo aplicar

Al implementar CUALQUIER nueva página/feature, antes de declarar "lista":

1. **¿Tiene link desde el header?** Si es navegación principal.
2. **¿Tiene link desde el footer?** Si es informativa/secundaria.
3. **¿Tiene sección destacada en home?** Si es diferenciadora.
4. **¿Tiene link desde páginas relacionadas?** Si es contextual (ej: link al recomendador desde brand pages de sol).
5. **¿Está en el sitemap?** Para indexación SEO.

Al menos UNO de 1-4 debe estar para que la feature exista para el cliente. Sitemap solo no basta.

### Anti-patrón a evitar

- Declarar feature live tras "build verde + push" sin verificar navegación.
- Asumir que el cliente "ya sabe" o "buscará" la URL.
- Pensar "sitemap = descubrible".
- Dejar la navegación para "iter 2" indefinidamente.

### Próxima vez aplicar a

- Cualquier feature/página nueva (legal, herramienta, blog post, etc.).
- Especialmente para iter 1 de features experimentales — la descubribilidad es CRÍTICA para validar si se usa.
- Cuando se agregue una feature dependiente de otra (ej: comparador → desde brand pages).

---

## 2026-05-28 — Patrón "2 agentes especialistas en paralelo" SIGUE funcionando para feature de IA (2do caso confirmado: lector de receta)

**Categoría**: Sistema de agentes / Workflow / Validación de pattern
**Confianza**: 🟢 Alta (2 casos exitosos: recomendador de monturas + lector de receta)

### Confirma

Para implementar el lector de receta, invoqué EXACTAMENTE el mismo patrón que con el recomendador: `optical-expert` (estructura técnica de receta argentina + rangos plausibles + umbrales presencial) + `ai-features-engineer` (modelo, PDF nativo, schema, anti-injection, privacy). Ambos respondieron en ~45-60s con outputs accionables. Implementación completa en 1 sprint sin re-trabajo.

### Outputs específicos de máximo valor

**optical-expert**:
- Umbrales operativos exactos para "graduación elevada" (|ESF|>6, |CIL|>2, |ESF|+|CIL|>7, anisometropía≥2). Sin esto, hubiera dejado el umbral vago.
- Convención clave: **cilindro siempre negativo en Argentina** (vs internacional). Sin esto, validation del backend rechazaría recetas válidas.
- Disclaimer ley 25.326 (datos sensibles de salud).

**ai-features-engineer**:
- **PDF nativo soportado** en Anthropic API (no hacía falta convertir a JPG en cliente). Ahorró ~150 líneas de código.
- Schema con `confidence` POR campo (no global) → permite resaltar campos low-confidence individualmente en el form.
- Anti-injection EXPLÍCITO en prompt (las recetas digitales pueden tener texto que el modelo malinterprete como instrucciones).

### Filtro crítico aplicado (regla del 7mo mistake)

Antes de implementar, rechacé 2 recomendaciones del ai-features-engineer:
- **Upstash en iter 1**: rate limit in-memory simple por IP basta. Si vemos abuse, escalamos.
- **HEIC conversion con heic2any**: librería nueva ~200KB. Si hay demanda real, agregamos en iter 2.

Sin este filtro, hubiera agregado complejidad sin justificación.

### Promoción a CLAUDE.md

2 casos exitosos = candidato a promoción. Si el próximo feature de IA (3er caso) confirma el pattern, agregar a CLAUDE.md como guideline:

> "Antes de implementar feature con IA Vision/RAG/etc, invocar `optical-expert` + `ai-features-engineer` en paralelo con prompts específicos pidiendo entregables accionables (NO código)."

---

## 2026-05-28 — Verificación visual del founder de un rediseño grande (rediseño catálogo minimal "quedó perfecto") valida el approach v4 sobre el aire/spacing como parte del diseño

Confirmación del learning previo sobre "minimal premium = más relaciones espaciales bien calibradas". El founder no sugirió ajustes tras ver en producción → el calibrado (spacing, columnas, tipografía) estuvo bien al primer intento. Convalida el approach holístico (no solo quitar el border).

---

## 2026-05-28 — "Sin Card wrapper" estilo Acne/Cartier requiere `<article>` semántico + grid con más spacing, no solo quitar el border

**Categoría**: UI/UX / Diseño minimal / Adaptación de patrones premium
**Confianza**: 🟡 Media (1 caso aplicado, pendiente confirmar)

### Qué pasó

Implementé el rediseño minimal del catálogo siguiendo la referencia del founder (Acne Studios / Cartier-style). El cambio NO fue solo "sacar el border y la sombra" — eso hubiera dejado un layout claustrofóbico con productos pegados unos a otros.

Cambios necesarios para que el efecto "premium minimal" funcione realmente:

1. **Reemplazar `<Card>` con `<article>`**: semánticamente correcto y sin sobreescribir estilos heredados de shadcn.
2. **Eliminar CardHeader/Content/Footer**: estos imponen padding interno que no encaja con el approach minimal.
3. **Más spacing en el grid**: pasar de `gap-4` a `gap-y-12 md:gap-y-20`. El "aire" entre productos ES parte del estilo minimal.
4. **Reducir columnas**: de 4 columnas máximo a 3. Las fotos son más grandes, hay mejor jerarquía visual.
5. **Tipografía uppercase tracking-wide**: el nombre del producto se vuelve "label" más que "título". Combinado con el centrado debajo de la foto, da onda "etiqueta de boutique".
6. **Eliminar arrows, badges, descripciones**: cualquier elemento que compita por la atención con la foto.

### Por qué no es "solo quitar el wrapper"

Un Card típico (border + shadow + padding) **compensa** la falta de spacing entre cards. Cuando lo sacás, la falta de spacing queda expuesta. Por eso minimal sin más spacing se ve "apretado", no "premium".

Patrón meta: **estilos premium minimalistas no son "menos elementos", son "más relaciones espaciales bien calibradas"**. El aire es parte del diseño, no su ausencia.

### Cómo replicar

Para CUALQUIER componente que se quiera transformar de "card tradicional" a "minimal editorial":

1. **Remover el contenedor visual** (border/shadow/bg).
2. **Aumentar spacing del grid** parent por 2-3x (de `gap-4` a `gap-y-12 md:gap-y-20`).
3. **Reducir densidad de columnas** (de 4 a 3, de 6 a 4).
4. **Limpiar elementos secundarios** (description, badges, arrows, footer separator).
5. **Convertir título a label**: uppercase + tracking-wider + font-normal (no bold).
6. **Centrar contenido**: alinear texto debajo de la imagen al centro horizontal.
7. **Asegurar contexto fuera del card**: si se quita descripción/marca, asegurarse que el contexto está en el header de la página o URL.

### Anti-patrón a evitar

- Quitar Card sin aumentar spacing → claustrofóbico.
- Quitar Card pero mantener 4 columnas → fotos diminutas, peor que antes.
- Mantener título en font-bold text-base → grita más que la foto, rompe la jerarquía.
- Eliminar TODA la info (precio, stock) → user no sabe si puede comprar.

### Próxima vez aplicar a

- Galerías de fotos del local físico (cuando se agreguen).
- Listado de marcas si se decide rediseñar también (`/anteojos-de-sol`).
- Bento grid de productos featured en home (si se implementa a futuro).
- Cards de blog/artículos si se agrega contenido editorial.

---

## 2026-05-28 — Cuando founder pasa referencia visual con "qué te parece?", responder con opinión + tradeoff + preguntas que clarifican ANTES de implementar

**Categoría**: Comunicación / Decisiones exploratorias / Prevención de re-trabajo
**Confianza**: 🟡 Media (1 caso aplicado, pendiente confirmar)

### Qué pasó

Founder mostró screenshot de catálogo de la competencia con caption "que te parece de hacer asi los catalogos? mas limpios minimalistas?". Era pregunta exploratoria, NO instrucción de implementación.

Apliqué la regla de Claude Code para exploratory questions:
> "respond in 2-3 sentences with a recommendation and the main tradeoff. Present it as something the user can redirect, not a decided plan. Don't implement until the user agrees."

Mi respuesta tuvo:
1. **Opinión + razón**: "me gusta, va con la onda premium-editorial del resto del sitio".
2. **Tradeoff principal**: "perdemos descripción corta + indicador de stock, ganamos premium feel".
3. **Cambios concretos** que haría (lista de bullets).
4. **Pregunta abierta clarificadora**: "¿incluir marca en el nombre o no? podríamos dejar solo el modelo".
5. **Pedido explícito de confirmación**: "¿avanzo?".

### Por qué importa

- **Previene re-trabajo**: si el founder no quería exactamente lo que yo entendí, ajustamos en 1 mensaje, no en 3 commits.
- **Captura preguntas chicas no obvias**: founder puede no haber pensado "incluir marca o no", pero como lo señalé puede decidir.
- **Mantiene la sensación de "decisión compartida"**: founder es el dueño del producto, yo el implementador.

### Cómo aplicar

Cuando founder pasa:
- Screenshot con "qué te parece" / "podríamos hacer así" / "te tira esta idea".
- Idea conceptual sin specs concretas ("podemos agregar más onda").
- Comparación con sitios de la competencia.

NO implementar de una. Responder en 2-3 sentences con:
1. **Opinión sintética** (gústame/no me gusta + 1 razón).
2. **Tradeoff principal** (qué perdemos vs qué ganamos).
3. **Cambios concretos** que vería (no como decisión final, como propuesta).
4. **1-3 preguntas clarificadoras** sobre detalles que tendrían múltiples interpretaciones razonables.
5. **Pedido explícito de confirmación** ("¿avanzo?").

### Anti-patrón a evitar

- Implementar de una sin clarificar. Si me equivoco en una decisión chica (ej "incluir marca o no"), 2 commits para corregir.
- Responder con sí/no plano sin tradeoff. Founder no aprende qué considerar la próxima vez.
- Hacer una decisión por mí mismo (en la implementación) en lugar de preguntarla.
- Hacer 10 preguntas. Limitar a las MÁS impactantes (1-3).

### Próxima vez aplicar a

- Cuando founder pase referencias visuales para hero / page redesign.
- Cuando proponga features sin specs ("podemos agregar comparador").
- Cuando comparta links de sitios "queridos" como inspiración.
- Cuando diga "se podría mejorar X" sin definir el qué.

---

## 2026-05-28 — Crossfade entre 2 imágenes superpuestas como hover-state: NO combinar con scale (los efectos compiten visualmente)

**Categoría**: UI/UX / Transiciones de hover / Combinación de efectos
**Confianza**: 🟡 Media (1 caso aplicado, pendiente confirmar en producción)

### Qué pasó

Implementé el patrón "hover sobre card de producto → muestra 2da imagen" (clásico de e-commerce de óptica/moda). El componente anterior tenía `group-hover:scale-[1.04]` como feedback. La nueva implementación tiene 2 imágenes superpuestas con `opacity` controlado por hover.

Combinarlas dio un efecto raro: durante el crossfade, ambas imágenes se escalaban simultáneamente. El resultado es confuso visualmente — el ojo no sabe si la imagen está cambiando o moviéndose.

**Solución**: lógica condicional en el className:
- Si hay secondary image → solo crossfade (opacity), sin scale.
- Si NO hay secondary image → mantener scale como antes (sino la card no tendría feedback visual al hover).

```tsx
className={cn(
  'object-contain transition-all duration-500 ease-out',
  secondaryUrl
    ? 'group-hover/card:opacity-0'
    : 'group-hover/card:scale-[1.04]',
)}
```

### Por qué funciona

- **Un efecto a la vez**: el ojo procesa "cambió la imagen" sin que compita con "se hizo más grande".
- **Fallback inteligente**: productos con 1 sola foto mantienen feedback de hover (scale). Productos con 2+ fotos tienen el efecto "premium" del crossfade.
- **Sin breaking changes**: el cambio no rompe cards de productos antiguos sin segunda imagen.

### Cómo replicar

Para CUALQUIER feature que combine 2+ efectos de hover sobre el mismo elemento:

1. **Probar combinaciones**: si los efectos compiten (transformación geométrica + cambio de contenido, ej scale + crossfade), elegir UNO.
2. **Default fallback**: el efecto "menos rico" debe ser el fallback cuando el dato necesario para el efecto rico no existe.
3. **Lógica condicional en className**: `cn()` + ternario en base a presencia del dato. Sin breaking changes para casos legacy.

### Anti-patrón a evitar

- Apilar todos los efectos posibles "porque están disponibles". Genera ruido visual.
- Asumir que más feedback = mejor UX. A veces es lo opuesto.
- Romper el caso "1 imagen" cuando se introduce el caso "2+ imágenes".

### Próxima vez aplicar a

- Hover sobre cards de blog/artículos cuando se agreguen.
- Cards de "destacados" en home (bento grid si se hace).
- Cualquier elemento con múltiples affordances de hover (cambio de color + scale + cursor change).

---

## 2026-05-28 — Cursor "ambiental" (no reemplaza SO + sin reacción a interactivos) supera cursor "funcional" cuando se busca premium pero sutil

**Categoría**: UI/UX / Cursor design / Decisiones de invasión visual
**Confianza**: 🟡 Media (1 caso aplicado, pendiente confirmar en producción)

### Qué pasó

Cursor follower original tenía 2 elementos (dot + ring) + `mix-blend-difference` + detección de target clickeable (ring escalaba 1.5x sobre links/buttons). Founder lo reportó como "un poco invasivo".

Le ofrecí 4 alternativas y eligió **glow/halo radial sutil**. La diferencia clave NO es "menos color" o "más blur", sino el cambio conceptual:

- **Cursor funcional (anterior)**: reemplaza el cursor del SO, RESPONDE a elementos interactivos. El usuario procesa "el cursor cambió, este elemento es importante".
- **Cursor ambiental (nuevo)**: NO reemplaza el cursor del SO, NO responde a nada. Solo decoración persistente. El usuario procesa "hay luz, el sitio se siente premium".

### Por qué el ambiental gana cuando se busca "premium pero sutil"

- **Cero overhead cognitivo**: el ambiental no requiere atención. Funciona en periférico visual.
- **No compite con micro-interacciones específicas** (spotlight en cards, magnetic buttons, tilt). Antes el cursor "anunciaba" hover; ahora cada elemento maneja su propio feedback.
- **Cursor del SO siempre visible**: el usuario nunca pierde el feedback estándar de "qué tipo de elemento es" (text cursor, pointer, grab, etc.).
- **Más fácil de calibrar**: 1 parámetro de "intensidad" (size, opacity, blur). Cursor funcional tiene N parámetros (dot size, ring size, spring stiffness, scale on hover, blend mode).

### Cuándo usar cada uno

- **Ambiental** (glow/halo, trail, sutil): sitio comercial / brand-driven donde se busca "premium pero limpio".
- **Funcional** (reemplazo + reacción): sitio editorial / portfolio donde el cursor ES parte de la firma visual (ej Awwwards). Costo: requiere ser consistente y diseñado con cuidado.

### Cómo aplicar

Default a **ambiental** salvo que haya razón explícita para funcional. Si se elige funcional:
- Validar en mobile (touch devices NO deben verlo).
- Validar `prefers-reduced-motion` (usuarios con sensibilidad NO deben verlo).
- Documentar la decisión y los parámetros de calibración.

### Anti-patrón a evitar

- Asumir que más efectos = más premium. A veces "menos es más" (especialmente para sitios comerciales).
- Combinar cursor funcional con otras micro-interacciones de hover (spotlight, magnetic). Saturan.
- No proveer opt-out — touch + reduced-motion deben siempre poder desactivarlo.

### Próxima vez aplicar a

- Cuando se evalúe cursor / efecto similar en próximas iteraciones de polish visual.
- Cuando se diseñen efectos de hover en cards / botones / links — preguntarse si compiten con un cursor "funcional" ya existente.
- Cualquier feature visual que tape o reemplace una affordance del SO (cursor, scroll, selección de texto).

---

## 2026-05-28 — Marcas `[A CONFIRMAR: ...]` inline en código de contenido permiten despliegue + edición posterior sin bloquear

**Categoría**: Generación de contenido / Workflow founder no-técnico
**Confianza**: 🟡 Media (1 caso aplicado, pendiente validar utilidad real cuando founder edite)

### Qué pasó

Al implementar las FAQs, tenía 5 puntos de datos sin confirmar (plazos exactos, dirección/horario, cantidad de cuotas, política de devolución, umbral graduación elevada). Dos caminos posibles:

**Camino A**: NO implementar hasta que founder confirme los 5 datos. Costo: feature queda bloqueada, infraestructura técnica no se valida.

**Camino B**: Implementar TODO con drafts + marcas literales `[A CONFIRMAR: ...]` en el contenido. Costo: el sitio muestra texto con esa marca temporal hasta que founder la reemplace.

Elegí B. Las marcas son:
- **Visibles en producción** (no escondidas en comentarios HTML), así el founder las ve y se acuerda.
- **Self-documenting**: indican exactamente qué falta confirmar.
- **Fácil de buscar**: `grep "A CONFIRMAR" lib/content/faqs.ts` lista todo lo pendiente.
- **No bloqueante**: el sitio funciona, schema SEO funciona, accordion funciona — solo el dato exacto está pendiente.

### Por qué funciona

- **Desacopla deploy de contenido completo**. Implementación técnica + estructura + UI/UX no esperan datos finales.
- **Compromiso visible**: founder ve el `[A CONFIRMAR]` cada vez que abre la página → presión social suave para completarlo.
- **Tracking gratuito**: grep o búsqueda en código revela todos los pendientes sin necesidad de tracker externo.
- **Rollback fácil**: si el founder no completa nunca, las marcas siguen siendo info parcial mejor que nada.

### Cómo replicar

Para CUALQUIER contenido del sitio donde:
- La infraestructura técnica está clara.
- Algunos datos puntuales requieren info del founder.
- El founder puede tardar días/semanas en consolidar la info.

1. **Implementar con drafts + marcas** `[A CONFIRMAR: contexto específico]`.
2. **Centralizar contenido** en un archivo único (`lib/content/X.ts`) para que el founder edite UN solo lugar.
3. **Documentar en CURRENT_STATE.md** qué marcas hay pendientes para que no se pierdan.
4. **Pasarle al founder la lista exacta** UNA vez (en el mensaje de cierre de iter 1). NO repetirla en cada turno (regla de "no saturar con pendientes").

### Anti-patrón a evitar

- Esconder pendientes en comentarios `// TODO` que el founder no ve.
- Usar lorem ipsum como placeholder (sugiere "nada pensado", no comunica qué falta).
- Implementar con datos inventados sin marca (riesgo: founder no se entera que están mal hasta que un cliente los usa).
- Bloquear deploy esperando datos completos cuando la infra técnica vale la pena tener live.

### Próxima vez aplicar a

- Páginas legales (cuando se completen política de privacidad / términos).
- Copy del checkout (mensajes de confirmación con datos del negocio).
- Email templates de confirmación de orden.
- Descripciones de marcas en brand pages.
- Datos de contacto en footer (si en algún momento se agregan datos parciales).

---

## 2026-05-28 — Confirmación visual del founder cierra el ciclo de validación — su "quedaron bien" es el gate

**Categoría**: Workflow / Validación / Cierre de ciclo
**Confianza**: 🟢 Alta (patrón consistente: typecheck/build verde no implica fix correcto; founder visual sí)

### Qué pasó

Implementé fix de simetría de brand cards (propagación de `h-full` por toda la cadena de wrappers). Build verde, typecheck verde. Pero hasta que el founder no confirma "quedaron bien simetricamente" tras verlo en producción, el fix queda en estado 🟡 pendiente.

Esto se repite consistentemente en el proyecto:
- Crop visual del producto (3 iteraciones documentadas en MISTAKES).
- Logos de marcas (5 iteraciones de tamaño hasta llegar a la versión que funcionó).
- Hero del founder ("muy estático" → ajustar animación; "se pierde la J de anteojos" → bug del LetterReveal).
- Cards de marca asimétricas.

### Por qué esto es estructural, no anomalía

Build/typecheck validan **corrección sintáctica y de tipos**. NO validan:
- Resultado visual (alturas, alineación, tamaños).
- Resultado UX (¿se entiende?, ¿es claro?, ¿no satura?).
- Resultado con datos reales (descripciones de distinto largo, SVGs de proporción distinta).

El único loop de validación efectivo para fixes visuales/UX es founder visual en producción. Por eso el patrón "implementar → typecheck verde → push → esperar feedback" es correcto para este tipo de cambios.

### Cómo aplicar

Para cualquier cambio visual/UX:
1. Implementar.
2. Typecheck + build (gate técnico mínimo).
3. Push.
4. **NO declarar "fix definitivo" hasta que founder confirme visualmente**.
5. Lenguaje hipotético en el mensaje de cierre ("debería resolver", "si todavía corta…"), nunca declarativo.

Para cambios de lógica pura (queries, validaciones, calculations):
- Tests automáticos pueden cerrar el ciclo sin founder visual.
- Confirmation no se necesita para cada cambio.

### Próxima vez aplicar a

- Tunings visuales del checkout cuando se active.
- Iter 2 del recomendador (links a catálogo filtrado, share por WhatsApp).
- Cualquier feature de UI que se agregue al sitio.
- Diseño de páginas legales / FAQs cuando se implementen.

---

## 2026-05-28 — `h-full` debe propagarse por TODA la cadena de wrappers (grid → wrapper anim → Link → Card), no solo en el elemento final

**Categoría**: CSS / Flexbox/Grid / Componentes con wrappers anidados
**Confianza**: 🟢 Alta (caso concreto detectado y resuelto)

### Qué pasó

Las brand cards de Rusty y Vulk en `/anteojos-de-sol` se veían con alturas distintas según el largo de su `description` (Rusty 4 líneas → card más alta; Vulk 2 líneas → card más baja). El `<Card>` interno tenía `h-full flex flex-col` y el `CardContent` tenía `flex-1` — el setup correcto para alto uniforme.

**Pero la cadena de wrappers era**:
```
grid (items-stretch default)
  └ RevealOnScroll (sin h-full)
      └ Link (block, sin h-full)
          └ Card (h-full ✅)
```

`h-full` necesita que el parent tenga altura definida. Si algún parent intermedio no propaga la altura, el `h-full` del descendiente no funciona.

### Causa raíz

CSS `height: 100%` (= Tailwind `h-full`) requiere que el padre tenga altura calculable. En una cadena de wrappers, **cada nivel intermedio que sea `display: block` por default trunca la propagación**. El alto del grid row no llega hasta el `<Card>` porque `<Link>` y `<RevealOnScroll>` no son `h-full`.

### Fix

Agregar `h-full` a TODA la cadena, no solo al elemento final:
```tsx
<RevealOnScroll className="h-full">
  <Link href={...} className="block h-full">
    <Card className="flex h-full flex-col">
      ...
    </Card>
  </Link>
</RevealOnScroll>
```

Ahora la altura del grid row se propaga: grid → RevealOnScroll → Link → Card. Todas las cards se igualan al alto de la más alta. `flex-1` en CardContent absorbe el espacio sobrante (las descripciones más cortas dejan más aire interno, no rompen simetría del exterior).

### Cómo replicar

Cuando armes una grilla de cards con altura uniforme deseada:

1. **El grid container** ya tiene `items-stretch` por default → no hace falta agregar nada.
2. **CADA wrapper intermedio** entre el grid y la card final debe tener `h-full`. Incluyendo:
   - Componentes de animación (RevealOnScroll, motion.div, etc.).
   - Links (`<Link>` o `<a>`).
   - Decoradores (TiltSpotlightCard, MagneticButton, etc.).
3. **La card final** debe ser `flex flex-col h-full` para que `flex-1` en un child absorba espacio sobrante.

### Anti-patrón a evitar

- Poner `h-full` solo en el elemento más profundo asumiendo que CSS "lo entiende".
- Olvidar que componentes wrapper custom (RevealOnScroll, TiltSpotlightCard, etc.) son `<div>` por default → necesitan `h-full` explícito.
- Validar simetría con datos demo de igual largo (las descripciones lorem ipsum de la misma longitud no revelan el bug).

### Próxima vez aplicar a

- Cualquier grid de cards (productos, marcas, categorías, blog posts).
- Featured products en home (cuando se agreguen).
- Bento grid (si lo implementamos a futuro).
- Cards de comparación de productos.

---

## 2026-05-28 — Cuando founder pide "guíame con X", entregar template pre-rellenado con drafts + marcas `[CONFIRMAR]` — no preguntas abiertas

**Categoría**: Comunicación / Reducción de fricción / Generación de contenido
**Confianza**: 🟡 Media (1 caso aplicado, pendiente confirmar utilidad real cuando founder devuelva feedback)

### Qué pasó

Founder pidió "guiame con el tema de los FAQs, que podemos agregar". Tenía 2 caminos posibles:

**Camino A**: hacerle preguntas abiertas — "qué temas querés cubrir?", "cuántas FAQs?", "qué tono?". Fricción alta: founder tiene que pensar la estructura desde cero.

**Camino B**: armar yo la estructura completa con drafts pre-rellenados desde lo que ya sé del negocio (BUSINESS_POLICIES.md, CLAUDE.md), organizada por temas, y dejarle solo el trabajo de **revisar/ajustar/completar datos puntuales**. Fricción baja: founder lee, marca lo que está bien, ajusta lo que no, completa datos `[CONFIRMAR]`.

Elegí B. Le entregué 18 FAQs en 6 temas con drafts + marcas explícitas de qué datos necesito que él confirme (plazos, dirección, cuotas, política exacta de envío de devolución).

### Por qué funciona

- **Founder hace VALIDACIÓN, no GENERACIÓN**. Validar texto pre-armado es 5x más rápido que generar texto desde cero.
- **Drafts revelan mi modelo mental** del negocio. Si me equivoco en alguno, founder lo corrige en 30 segundos. Si lo dejara abierto, podríamos estar 5 mensajes ida y vuelta resolviendo el mismo punto.
- **Marcas `[CONFIRMAR]` explícitas** dicen al founder exactamente qué datos faltan. No queda dudando "¿qué más necesita Claude?".
- **Estructura por temas + numeración** permite respuestas selectivas ("FAQ 1.2 cambiá X, el resto está bien").
- **Aplicable a contenido en general**, no solo FAQs.

### Cómo replicar

Cuando founder pida "guíame con X", "armemos X", "qué podemos agregar a X":

1. **NO** hacer preguntas abiertas inicialmente.
2. **SÍ** armar yo una propuesta concreta:
   - Estructura clara (categorías, secciones, items numerados).
   - Drafts pre-rellenados desde fuentes de verdad disponibles (BUSINESS_POLICIES, CLAUDE.md, código, conversación previa).
   - Marcas `[CONFIRMAR]` explícitas donde necesito dato real del founder.
   - Camino claro para responder ("marcá lo que está bien, ajustá lo que no, completá datos").
3. Si me equivoco en estructura → founder me lo dice en 1 turno, ajusto.
4. Si me equivoco en algunos drafts → founder los corrige y aplico al resto.

### Casos típicos

- **Contenido del sitio**: FAQs, descripciones de páginas legales, copy de CTAs, micro-copy de error states.
- **Definiciones de política**: hacer draft de la política, founder ajusta/aprueba.
- **Email templates**: armar draft, founder ajusta tono / data.
- **Comunicación con proveedores**: redactar primer mail, founder ajusta.
- **Planning de roadmap**: armar propuesta de prioridades, founder reordena.

### Anti-patrón a evitar

- Responder "qué temas querés cubrir?" cuando puedo proponer 6 temas relevantes desde lo que ya sé.
- Dar instrucciones de "tomate tiempo y pensá X" — el founder no es content creator, no tiene framework para generar desde cero.
- Hacer la propuesta DEMASIADO larga sin ser claro qué espero del founder. Cerrar con "tu tarea ahora..." explícito.

### Próxima vez aplicar a

- Definir política de devoluciones / cambios detallada (cuando se active checkout).
- Armar copy de páginas de marca cuando se agregue 2da marca con productos.
- Definir guía de cómo medir DNP / probarse anteojos (si se agrega contenido educativo).
- Estructurar webinar / blog editorial si el negocio crece a esa dirección.

---

## 2026-05-28 — Cuando founder responde "qué tengo que hacer?" tras instrucciones técnicas, la solución es REDUCIR pasos, no explicar más

**Categoría**: Comunicación / Reducción de fricción para founder no-técnico
**Confianza**: 🟢 Alta (caso claro, solución obvia en retrospectiva)

### Qué pasó

Le entregué instrucciones al founder para fixear el SVG de Paula:
1. Abrí el archivo `paula-cahen-danvers-logo-dark.svg` en un editor de texto.
2. Reemplazá la primera línea por esto: `<svg... viewBox="80 280 625 210" ...>`.
3. Guardá → subí al bucket reemplazando.

Founder respondió: **"que tengo que hacer?"**.

Mi reacción correcta: NO repetir las instrucciones con más detalle. La respuesta del founder revelaba que el flujo "editar archivo local" era demasiado fricción (requiere editor de texto + encontrar la línea + cambiarla sin romper nada + guardar con encoding correcto).

**Cambié de approach**: en lugar de pedirle que editara, **le entregué el SVG completo con el fix ya aplicado** y los pasos quedaron en 3: copiar → crear archivo nuevo (pegando) → subir reemplazando. Eliminé el paso "editar archivo existente" que era el cuello de botella.

### Por qué funciona

Cuando el founder dice "qué tengo que hacer?" tras instrucciones, está señalizando que **el costo cognitivo de las instrucciones supera su threshold**. Las causas típicas:

- **Pasos involucran herramientas que no usa diariamente** (editor de texto plano para SVG).
- **Riesgo percibido de "romper algo"** (¿qué pasa si edito mal la línea?).
- **Pasos requieren conocimiento implícito** (¿qué editor uso? ¿qué encoding? ¿cómo guardo?).

La solución NO es "explicar mejor cada paso". La solución es **eliminar pasos**.

### Cómo replicar

Cuando le pase al founder instrucciones técnicas, antes de enviar mensaje preguntarme:

1. ¿Las instrucciones requieren que el founder ABRA / EDITE / TRANSFORME un archivo?
2. ¿Podría YO hacer esa edición y entregarle el resultado final?
3. Si sí → entregar resultado final, no instrucciones para producirlo.

Específicamente:
- **Edición de SVG**: pasarle el SVG completo modificado, no instrucciones de qué línea cambiar.
- **Edición de SQL**: pasarle el statement completo listo para correr, no instrucciones de qué WHERE agregar.
- **Edición de config files**: pasarle el archivo completo o el diff exacto en formato copy-paste.
- **Edición de texto largo**: pasarle el texto final, no diffs textuales.

Si el founder ya tiene un workflow para X (ej "subir archivo al bucket"), apoyarse en ESE flujo, no inventar uno nuevo (ej "editar archivo local").

### Anti-patrón a evitar

- Tras "qué tengo que hacer?" → repetir las mismas instrucciones más detalladas. Empeora.
- Asumir que "editor de texto" es una herramienta universal trivial. Para el founder no-técnico es fricción real.
- Pedirle al founder que haga un paso intermedio cuando YO podría producir el resultado final.

### Próxima vez aplicar a

- Edición de cualquier archivo de configuración / asset / SQL.
- Cualquier flujo donde el founder tiene que "tocar" algo entre que yo le doy info y que sube el resultado.
- Cuando proponga "fix manual" como solución → evaluar si lo puedo entregar como "fix automático" (archivo completo, statement completo, config completa).

---

## 2026-05-28 — Recortar `viewBox` al bounding box del contenido es el fix correcto para SVGs con mucho aire interno

**Categoría**: SVG / Optimización de assets / Edición directa de archivos
**Confianza**: 🟢 Alta (técnica estándar SVG, predecible, no requiere cambios de código)

### Qué pasó

SVG de Paula Cahen D'Anvers venía con `width="768" height="768"` y sin `viewBox` explícito (implícito = `0 0 768 768`). El contenido visual real ocupaba solo ~26% del cuadrado.

Diagnosticé el bounding box analizando los `transform="translate(x,y)"` de cada `<path>` + las coordenadas internas:
- **Símbolo (corona)**: paths con `translate(371, 326)`, `translate(383, 367)`, `translate(377, 292)`. Coords internas iban de -50 a +80 aprox. Resultado: símbolo ocupa `(319, 292)` a `(448, 397)`.
- **Texto**: paths con `translate(x, 452-453)` donde `x` iba de 92 (primer carácter) a 671.9 (último). Cada path tiene ancho ~24 unidades. Resultado: texto ocupa `(92, 452)` a `(696, 477)`.
- **Bounding box total**: `(80, 280)` a `(705, 490)` = **625×210** (con padding 10-15 unidades).

Fix aplicado: cambiar la primera línea del SVG agregando `viewBox="80 280 625 210"` + ajustar `width="625"` y `height="210"`. **Sin tocar ningún `<path>` interno**.

### Por qué funciona

- `viewBox` define qué porción del "espacio infinito" del SVG es visible. Al recortar al bounding box del contenido, todo el "aire" alrededor se elimina del render.
- Las coordenadas internas de los paths NO cambian (siguen siendo las mismas absolute coords). Solo cambia lo que el navegador renderiza dentro del `<img>`.
- `width/height` del root SVG ahora matchean el aspect ratio real del contenido → `object-contain` escala todo el contenido al ancho/alto del contenedor.
- Resultado: cuando el container es `h-20` (80px), todo el contenido visual ocupa esos 80px, no el 26%.

### Cómo replicar

Para CUALQUIER SVG (logo, ícono, ilustración) que se ve "chico dentro de su contenedor":

1. **Diagnóstico**: ¿el contenedor está bien dimensionado y el contenido visual se ve achicado? → problema es del SVG.
2. **Calcular bounding box**:
   - Mirar todos los `transform="translate(x,y)"` de cada `<path>` / `<g>`.
   - Para cada uno, analizar las coordenadas internas y calcular `min_x`, `min_y`, `max_x`, `max_y` absolutos.
   - El bounding box es `(min_x, min_y, max_x - min_x, max_y - min_y)`.
3. **Setear `viewBox`** con el bounding box + 5-15 unidades de padding a cada lado para que no quede pegado.
4. **Ajustar `width/height`** del root SVG para que el aspect ratio matchee el viewBox.
5. **Reemplazar archivo en bucket** (mismo path → no cambia DB).
6. Hard refresh para invalidar cache si no se ve actualizado.

### Anti-patrón a evitar

- Intentar ajustar el SVG con CSS (transform: scale) — más complejo, frágil, mantiene el aire.
- Re-exportar el SVG desde Illustrator / Figma "con padding 0" sin entender qué hace — capaz no resuelve.
- Pedirle al founder "buscar otro asset" cuando el fix en el actual es 30 segundos.

### Próxima vez aplicar a

- Cualquier asset SVG futuro que se vea chico en su contenedor.
- Íconos custom de medios de pago, badges, sellos de certificación.
- Banners promocionales si vienen con padding interno.
- Ilustraciones de cómo medir DNP o probarte un armazón (si en algún momento se agregan).

---

## 2026-05-28 — Cuando UN asset individual no se ve bien, arreglar el asset — NO ajustar el render global que afecta a todos los demás

**Categoría**: Diseño / Decisión técnica / Defaults vs excepciones
**Confianza**: 🟢 Alta (caso claro identificado y decisión documentada con razonamiento explícito)

### Qué pasó

Tras 2 fixes de tamaño en `brands-section.tsx` (h-10 → h-12/h-14 → h-16/h-20), el founder reportó que Paula Cahen D'Anvers seguía chico. Me pidió: "podés aumentarlo más de tamaño o busco otra imagen?".

**Resistí la tentación de aumentar tamaño en código una 3ra vez**. Razonamiento explícito:

- Los otros 4 logos (Rusty, Vulk, Mormaii — wordmarks horizontales; Reef — cuadrado) YA están en buen tamaño visual.
- Paula es un outlier: su SVG tiene viewBox con mucho aire interno (contenido ocupa ~30% del cuadrado).
- Aumentar tamaño global empeora 4 logos para arreglar 1.

**Solución correcta**: arreglar el SVG de Paula (recortar viewBox al bounding box del contenido visible) o conseguir otra versión optimizada.

### Por qué este patrón es importante

Es la versión específica del principio "**fix at the source, not downstream**". Cuando un asset individual está mal, el costo de "arreglarlo en el renderer" es:
- Empeorar la UX de todos los assets bien hechos.
- Esconder el problema real del asset.
- Acumular hacks específicos (Paula = h-24, resto = h-20).
- Si en el futuro Paula se reemplaza, los hacks quedan dañando los nuevos assets.

El costo de "arreglarlo en el asset" es:
- 2 minutos editando el SVG (ajustar `viewBox`).
- Un asset bien optimizado funciona para CUALQUIER tamaño de render futuro.

### Cómo aplicar el principio

Antes de hacer un ajuste en el código que afecta múltiples assets para resolver un problema de UNO:

1. **Pregunta**: ¿el problema es del asset (mal exportado, viewBox aireado, formato incorrecto) o del código?
2. **Si es del asset** → arreglar el asset. Costo predecible, beneficio duradero.
3. **Si es del código** → ajustar el código. Verificar que el ajuste mejora la UX de todos los assets, no solo el problemático.

### Anti-patrón a evitar

- "Subir el tamaño otro escalón a ver si Paula se ve bien" → vas a ver que se ve "mejor" pero los otros se ven "demasiado grandes" sin que lo notes hasta que el founder lo señale. Pérdida progresiva de calidad visual.
- Hardcodear excepciones por slug ("si brand.slug === 'paula' → h-24"). Acopla el código a datos específicos, difícil de mantener.
- Considerar "arreglar el SVG" como tarea "de diseño" fuera del alcance del developer. Editar un `viewBox` en un SVG es 30 segundos con un editor de texto, está dentro del alcance.

### Próxima vez aplicar a

- Cualquier feature de assets visuales (logos, fotos producto, banners, íconos).
- Cuando un producto puntual no se vea bien en el grid pero los demás sí.
- Cuando un email render se vea raro para UN destinatario pero bien para todos.
- Cuando UN dato en DB rompe una query agregada pero el resto funciona — fix the data, not the query.

---

## 2026-05-28 — SVGs de logos tienen aspect ratios y composiciones internas muy heterogéneas — el render con altura fija necesita margen para el peor caso

**Categoría**: Diseño / Rendering / Assets variables
**Confianza**: 🟡 Media (1 caso, 5 logos, varios edge cases observados)

### Qué pasó

Al integrar logos de 5 marcas (Vulk, Rusty, Mormaii, Reef, Paula Cahen D'Anvers), elegí altura inicial `h-10` (40px) en el render como tamaño "razonable" para un logo de marca. En producción, las 5 marcas mostraron variabilidad enorme:

- **Rusty**: wordmark horizontal compacto → ocupa toda la altura → se ve bien.
- **Vulk**: wordmark horizontal con paths que llenan el viewBox → se ve bien.
- **Mormaii**: wordmark con símbolo a la izquierda → ocupa altura completa → se ve bien (cuando carga).
- **Paula Cahen D'Anvers**: SÍMBOLO PEQUEÑO ARRIBA + texto en mayúsculas DEBAJO. El símbolo + texto juntos suman altura pero el contenido visual relevante ocupa solo el ~30% del viewBox. Con `h-10` el contenido visible queda en ~12px, ilegible.
- **Reef**: aparte de su problema de naming, su SVG es cuadrado, ocupa todo el viewBox.

El "tamaño razonable" que elegí (`h-10`) funcionó para 4 de 5 logos pero falló para Paula porque ASUMÍ que todos los logos tienen composición horizontal balanceada (wordmark + opcional símbolo a la izquierda). No es así.

### Por qué funciona el fix

Cambié a `h-12 md:h-14` (48-56px) + `max-w-[140px]`. Esto:
- Da espacio suficiente para que el contenido visual real de Paula sea legible.
- No achata logos de wordmark horizontal (siguen quedando bien porque object-contain los ajusta proporcional).
- Limita el ancho para que un logo muy panorámico no rompa el grid.

### Cómo replicar

Para CUALQUIER feature que renderice assets de tamaño/aspect ratio variable (logos, fotos de productos, banners de marca, íconos de pago):

1. **Default a tamaños generosos** (más altura, más ancho-max). Es mejor desperdiciar ~10px de espacio cuando el asset es chico que truncar/achicar el contenido cuando es grande/centrado.
2. **Usar `object-contain` + `max-w`** en lugar de altura fija sin max ancho. El navegador ajusta proporcional sin distorsionar.
3. **Verificar con el peor caso** (símbolo centrado en viewBox grande, wordmark muy panorámico, texto vertical) antes de declarar el tamaño "OK".
4. **Documentar la justificación del tamaño en el código** (por qué h-12 y no h-10) para que la próxima vez se entienda el razonamiento.

### Anti-patrón a evitar

- Elegir tamaño basado en "lo que se ve bien con el primer asset" sin probar con assets de diferentes proporciones.
- Asumir que todos los SVGs de un dominio (logos de marca) van a tener composición similar — no es así.
- Hardcodear tamaño solo en altura sin max-width — un asset panorámico puede romper el grid.

### Próxima vez aplicar a

- Cuando se agreguen banners de promo / hero rotators (variabilidad de aspect ratios alta).
- Cuando se agreguen fotos de producto con diferentes orientaciones (algunos productos son cuadrados, otros panorámicos).
- Cuando se agreguen íconos de medios de pago (algunos son lockups completos, otros solo símbolos).
- Si en el futuro se agrega "galería de fotos del local" en `/sobre-nosotros` con fotos horizontales y verticales mezcladas.

---

## 2026-05-28 — Diagnóstico "doble paralelo" para problemas de carga de assets desde Supabase Storage: URL directa + SELECT del path

**Categoría**: Debugging / Supabase Storage / Comunicación con founder no-técnico
**Confianza**: 🟡 Media (1 caso, pendiente confirmar resolución)

### Qué pasó

Founder pusheó los UPDATEs SQL para activar los logos de Vulk y Rusty. En producción los logos aparecieron como **placeholders rotos con alt text visible al lado** (clásica señal de `<Image>` que falla al cargar la URL).

En lugar de pedirle al founder múltiples idas y vueltas para diagnosticar ("revisá el bucket", "fijate el path", "abrime los logs", "verificá CORS"), le di **2 acciones paralelas que cubren ambas causas probables a la vez**:

1. **URL directa en el navegador** (`https://[project].supabase.co/storage/v1/object/public/brand-assets/...`):
   - Si ve la imagen → bucket OK, problema es el path en DB.
   - Si ve 403/404 → bucket privado o path mal.

2. **SELECT del path en DB** para confirmar que matchea exactamente con el archivo del bucket (case-sensitive).

Cada acción discrimina entre 2 causas posibles. Las 2 juntas cubren las 4 combinaciones (bucket público + path OK, bucket público + path mal, bucket privado + path OK, bucket privado + path mal).

### Por qué funciona

- **Diagnóstico paralelo** vs **diagnóstico secuencial**: en secuencial el founder hace una acción, me reporta, yo pienso, le pido otra. En paralelo me ahorra 2-3 turnos de comunicación.
- **Las 2 acciones son cheap para el founder no-técnico**: una URL para pegar en el browser + un SELECT para correr. No requiere navegación compleja en el Dashboard ni configuración previa.
- **Cubre las dos dimensiones del problema**: infrastructure (bucket público / privado) Y data (path correcto en DB).
- **El output de cada acción es discriminatorio**: ver/no ver imagen → respuesta binaria. Comparar paths visualmente → trivial.

### Cómo replicar

Para CUALQUIER problema de "asset no carga desde Storage" en producción:

1. **Acción 1 — URL directa**: construir la URL pública completa y pedirle al founder que la pegue en el navegador. Discrimina entre "infrastructure issue" (bucket privado, CORS, dominio bloqueado) y "data issue" (path mal).
2. **Acción 2 — SELECT del path**: query simple que muestra el path tal como está en DB. Discrimina entre "path correcto + setting mal" y "path mal + setting OK".
3. **Si están claro 1 y 2 → diagnóstico inmediato sin más ida y vuelta**.

### Anti-patrón a evitar

- **Pedir un solo paso de diagnóstico cuando hay 2+ causas probables**: el founder hace lo que pediste, vuelve, yo proceso, pido otro. 4 turnos en lugar de 1.
- **Pedir al founder que "revise los logs de Vercel"** o cosas internas técnicas: si hay forma de diagnosticar desde afuera (URL pública, SELECT), preferir eso.
- **Asumir una sola causa "obvia"** sin cubrir las alternativas: si me equivoco, perdí 1 turno y la confianza del founder.

### Próxima vez aplicar a

- Cualquier feature de carga de assets/imágenes que pueda fallar en producción.
- Cualquier feature que dependa de configuración manual del founder en un panel externo (Supabase, Vercel, MP, Tusfacturas) — anticipar las 2-3 causas posibles y dar 2 acciones de diagnóstico paralelas.
- Verificación de env vars en Vercel (test endpoint que confirma que la var existe sin exponerla).

---

## 2026-05-28 — Founder no-técnico prefiere separación visual de buckets en Dashboard sobre reuso técnico con prefijos

**Categoría**: Supabase Storage / UX del founder / Arquitectura adaptada al usuario
**Confianza**: 🟢 Alta (decisión explícita del founder + lógica clara que aplica a Dashboard UI)

### Qué pasó

Propuse reusar bucket `products` con prefijo `_brand-logos/` para los logos de marca (ver entry refutado arriba). Founder eligió OPUESTO: creó bucket nuevo `brand-assets` con carpeta `brand-logos/` adentro. Subió `vulk-logo-light.svg` y `rusty-logo-dark.svg` ahí.

Mi lógica: "menos overhead operacional, helper existente funciona". Pero founder priorizó otra dimensión que yo NO consideré:

**Cuando el founder no-técnico gestiona el bucket por el Dashboard UI de Supabase, ver buckets separados por TIPO de asset es más entendible que ver un solo bucket con subcarpetas mezcladas.**

En el Dashboard:
- Mi propuesta: `products/` ← acá conviven fotos de productos reales (vulk-day-light/...) Y assets internos (_brand-logos/...). El founder tiene que navegar y entender el prefijo `_`.
- Decisión founder: `products/` para fotos reales + `brand-assets/` para logos. Cada bucket tiene un único propósito claro.

### Por qué la decisión del founder es mejor que la mía

- **Cognitive overhead bajo**: el founder ve "products" y sabe "fotos de productos". Ve "brand-assets" y sabe "logos y assets de marca". No tiene que recordar convención de prefijo.
- **Permite políticas RLS distintas a futuro**: brand-assets podría tener policies diferentes (ej caching más agresivo, retention diferente) sin afectar productos.
- **Búsqueda más fácil**: search in bucket queda scoped al tipo de asset.
- **Setup operacional bajo**: crear bucket en Dashboard es 30 segundos UI clicks. El "overhead" que yo prioricé era marginal.
- **Mi helper paralelo no es problema**: `getBrandAssetUrl()` es 5 líneas, copy-paste de `getProductImageUrl()`. Cero burden.

### Causa raíz de mi error

Optimicé por dimensión equivocada: **"overhead técnico" (creación de bucket + helper)** en vez de **"overhead cognitivo del founder en Dashboard UI"**. El primero lo pago una sola vez yo (30 minutos). El segundo lo paga el founder CADA VEZ que abre el Dashboard a gestionar assets.

Patrón meta: **cuando hay 2 dimensiones de costo (técnica vs UX/cognitiva), priorizar la UX/cognitiva del founder no-técnico si:**
- La operación es recurrente para él (gestión de assets, productos, órdenes).
- El costo técnico que se ahorra es chico (helper extra, bucket setup, etc.).
- No hay constraints de performance reales (compute, latencia).

### Cómo replicar

Para CUALQUIER decisión de arquitectura que afecte cómo el founder interactúa con sistemas externos (Supabase Dashboard, panel Mercado Pago, panel Tusfacturas, Resend, Vercel):

1. **Pensar primero**: ¿esto va a aparecer en una UI que el founder use recurrente?
2. **Si sí**: ¿la decisión técnica le agrega overhead cognitivo? (convenciones para recordar, navegación extra, búsqueda compleja).
3. **Si sí + el costo técnico es marginal**: priorizar la opción que sea más obvia visualmente en la UI externa.
4. **Documentar la convención** en este archivo para que la próxima decisión similar sea correcta sin re-derivarla.

### Aplicaciones concretas

- **Buckets Supabase Storage**: 1 bucket por tipo semántico de asset (`products`, `brand-assets`, `prescriptions`, `banners-promo`). NO mezclar con prefijos.
- **Tablas Supabase**: ya está bien separado por entidad (products, brands, orders, etc.) — mantener.
- **Env vars Vercel**: agrupar por servicio con prefijo claro (`MP_*`, `RESEND_*`, `TUSFACTURAS_*`).
- **Folders dentro de cada bucket**: usar slugs claros (`vulk-day-light/`, `brand-logos/`). NO prefijos cripticos como `_internal/`.

### Anti-patrón a evitar

- Optimizar por "menos overhead técnico de mi parte" cuando ese overhead lo pago yo una sola vez y el founder paga overhead cognitivo recurrente.
- Inventar convenciones (prefijo `_`) que requieren documentación adicional para el founder.
- Asumir que "limpieza arquitectural teórica" pesa más que "cómo se ve en la UI externa".

### Próxima vez aplicar a

- Cuando se agreguen banners de promo / hero rotators: bucket `banners-promo/` separado en vez de mezclar en `products`.
- Cuando se agreguen fotos del local físico para `/sobre-nosotros`: bucket `store-photos/` separado.
- Cuando se agreguen íconos custom de medios de pago: bucket `payment-icons/` separado.
- Si en el futuro hay videos de productos: bucket `product-videos/` separado por billing diferente.

---

## 2026-05-28 — Reusar bucket Supabase existente con prefijo `_` para assets internos reduce overhead operacional vs crear bucket dedicado

**Categoría**: Supabase Storage / Arquitectura / Operacional
**Confianza**: 🔴 **REFUTADO en 2026-05-28** — founder eligió bucket separado `brand-assets` por simpleza visual del Dashboard de Supabase Storage. Ver entry siguiente "Founder no-técnico prefiere separación visual de buckets" para la versión corregida del learning.

### Qué pasó

Al integrar logos de marcas (Vulk + 4 más a futuro), tenía 2 opciones:

**Opción A**: crear bucket nuevo `brand-assets` dedicado. Pros: semánticamente limpio (assets no son productos). Contras: founder no-técnico tiene que crear bucket en Dashboard, configurar RLS pública, y yo tengo que crear helper `getBrandAssetUrl()` paralelo a `getProductImageUrl()`.

**Opción B**: reusar bucket `products` existente con prefijo `_brand-logos/`. Pros: cero setup operacional para el founder, helper existente funciona, RLS ya configurado. Contras: semánticamente mezclamos assets con productos.

Elegí **opción B** con criterio: el costo semántico es bajo (prefijo `_` distingue), y el ahorro operacional es alto (founder no tiene que aprender otro bucket). Si en el futuro hay overhead real (ej: tamaño del bucket products crece y queremos separar billing), migrar es trivial: copiar archivos + UPDATE de paths en DB.

### Por qué funcionó

- **Prioricé el costo cognitivo del founder no-técnico** sobre la "limpieza arquitectural" teórica. Founder sabe usar el bucket `products`, ya subió las fotos de Vulk Day Light ahí.
- **Prefijo `_` como convención visual**: distingue assets internos (logos, banners genéricos) de assets de producto. Convención simple y obvia.
- **Migración futura es trivial**: copiar archivos + UPDATE de paths. No hay coupling con DB schema (`logo_url` guarda path relativo, no URL completa).
- **Helper único `getProductImageUrl()`** sirve para todos los assets del bucket. Menos código, menos lugares de mantener.

### Cómo replicar

Cuando se necesite agregar un nuevo tipo de asset (banners, ícones de pago, badges de envío, fotos del local, etc.) y haya bucket Supabase ya configurado:

1. **Default**: reusar bucket existente con prefijo de carpeta (`_banners/`, `_payment-icons/`, `_store-photos/`).
2. **Excepción**: crear bucket dedicado solo si:
   - El asset tiene **RLS diferente** (público vs autenticado, ej: prescripciones de clientes).
   - El asset tiene **billing crítico separado** (ej: video assets pesados que justifican lifecycle policy distinto).
   - El asset requiere **CDN/cache diferente** (raro en Supabase Storage default).
3. **Convención de prefijo**: usar `_` al inicio para distinguir de carpetas de productos reales (que típicamente usan slug, ej `vulk-day-light/`).

### Anti-patrón a evitar

- Crear un bucket nuevo por cada tipo de asset por "limpieza" arquitectural. El founder paga el costo operacional cada vez sin beneficio real.
- Mezclar assets sin prefijo (ej: subir logos a la raíz del bucket `products`). Se vuelve imposible distinguir productos de assets internos al hacer listing.
- Inventar helper paralelo cuando el existente funciona (`getBrandAssetUrl()` vs `getProductImageUrl()` para el mismo bucket).

### Próxima vez aplicar a

- Banners para hero rotators o promos.
- Íconos de medios de pago (Visa, Master, MP, etc.) si decidimos custom en vez de lucide.
- Badges de envío / certificaciones para mostrar en footer.
- Fotos del local físico para `/sobre-nosotros`.

---

## 2026-05-28 — Cuando el founder pregunta "cómo necesitás que sea X?" — responder con spec en tabla + alternativas + dónde se usa + plan de "arrancá por 1"

**Categoría**: Comunicación / Onboarding de assets / Specs de input
**Confianza**: 🟡 Media (1 caso, pendiente confirmar resultado cuando suba logos de Vulk)

### Qué pasó

Founder estaba consiguiendo logos de las 5 marcas con las que trabaja la óptica (Vulk, Rusty, Mormaii, Reef, Paula Cahen D'Anvers). Preguntó: "Como necesitas que sean los logos? Tamanos, Con fondo? Sin?".

Respondí con una estructura que cubrió:
1. **Tabla concreta** de specs por atributo (formato, fondo, versiones, tamaño, tipo de logo, padding, SVG texto): cada fila con **"Lo ideal" + "Alternativa aceptable"** para que el founder no quede bloqueado si no consigue el ideal.
2. **Dónde se usa cada versión** (brand section home dark, brand pages claras, trust marquee dark, product cards mini): justifica por qué pido 2 versiones.
3. **"Si solo conseguís 1 versión"**: fallback honesto (dark + filter CSS invert) con tradeoff explícito.
4. **Convención de naming + paths Supabase Storage**: `brand-assets/{slug}-logo-dark.svg`. Founder sabe dónde subirlo sin tener que preguntarme después.
5. **"Arrancá por 1 caso"** (Vulk primero — el único con producto cargado): permite ver el resultado antes de invertir tiempo en los otros 4.

### Por qué funcionó

- **Tabla > texto narrativo** cuando son specs técnicos: el founder no-técnico puede scanear y decidir rápido. Texto narrativo requiere leer todo para encontrar el atributo que importa.
- **"Lo ideal + alternativa aceptable" por fila**: evita que el founder se bloquee buscando el formato perfecto. Le da margen de maniobra y conoce el costo de cada alternativa.
- **"Arrancá por 1"** reduce riesgo de inversión sin feedback. Es el equivalente al "plan por rounds verificables" pero para inputs del founder en lugar de mi código.
- **Paths exactos de storage** anticipan la próxima pregunta ("¿dónde lo subo?"). Reducen idas y vueltas.

### Cómo replicar

Para CUALQUIER pregunta del founder del tipo "cómo necesitás que sea X?" / "qué formato te paso?" / "cuántos / cuánto / dónde?":

1. **Tabla de specs por atributo** con "Lo ideal" + "Alternativa aceptable" en cada fila.
2. **Sección "Dónde se va a usar"**: justifica las decisiones técnicas con el caso de uso real.
3. **Fallback honesto** si solo consigue uno de los ideales — con tradeoff explícito.
4. **Convención de naming + paths exactos** si va a subir a Supabase Storage o algún bucket.
5. **"Arrancá por 1 caso"** para validar antes de invertir tiempo en el resto.

### Anti-patrón a evitar

- Responder solo "subilos en SVG con fondo transparente" → demasiado breve, el founder vuelve con más preguntas (tamaño, padding, naming).
- Sobre-explicar: 6 párrafos sobre por qué SVG es mejor que PNG. Founder no-técnico le importa el outcome, no la teoría.
- Pedir todos los assets juntos sin verificación intermedia. Si me equivoco con la spec, el founder pierde tiempo en 5 marcas en lugar de 1.
- Inventar paths/convenciones que no son las usadas en el resto del proyecto (chequear cómo se usa el bucket `products` y mantener consistencia).

### Próxima vez aplicar a

- Fotos de productos nuevos (cómo recortar, qué tamaño, qué padding, dónde subir).
- Recetas para validar el lector de receta IA (formato JPG/PDF, fotos vs scans, anonimización).
- Selfies de prueba para el recomendador de monturas (qué condiciones, qué casos edge).
- CSVs / bulk uploads (template prearmado, encoding, separador, columnas requeridas).
- Datos de contacto para WhatsApp / email (formato, validaciones, ejemplos).

---

## 2026-05-28 — Los agentes pueden ser overly conservative; la decisión del founder pesa más que la recomendación del agente cuando hay tradeoff de UX/coherencia

**Categoría**: Sistema de agentes / Toma de decisión / Calibración
**Confianza**: 🟢 Alta — caso concreto en el que el founder corrigió correctamente una recomendación del optical-expert.

### Qué pasó

`optical-expert` recomendó incluir matrícula de María Carlota Carballo en el disclaimer del recomendador de monturas, citando Ley 17.132 y "protección legal". Implementé tal cual con placeholder hasta que el founder me pasara el número. Founder cuestionó: "para qué necesitás saber la matrícula? no tiene sentido".

Pensándolo de nuevo con el contexto del proyecto entero:
- La matrícula NO agrega protección legal real en este contexto. La protección viene del lenguaje "orientativo / no reemplaza consulta profesional", no del número.
- Mostrarla al lado del output de IA da impresión de que la matriculada AVALA esa recomendación específica — cuando NO la revisa en tiempo real.
- En el resto del sitio no mostramos matrícula. Solo acá sería inconsistente.

Decisión: sacarla. El disclaimer queda genérico, protege igual, no introduce contrasentido.

### Por qué pasó

El agente optical-expert tiene contexto técnico-óptico y legal pero NO tiene visibilidad de:
- **Coherencia visual del sitio**: ¿esta protección extra rompe el tono del resto?
- **UX completa**: ¿el usuario ve la matrícula como "garantía" o como "burocracia que da desconfianza"?
- **Modelo mental del cliente**: ¿asocia la matrícula con esta herramienta específica de IA?

El founder SÍ ve el sitio entero, el modelo mental, y la coherencia. Por eso su veto fue correcto.

Adicionalmente: los agentes especialistas tienden a optimizar para SU dominio (legal-regulatorio, en este caso). En tradeoffs cross-dominio (UX vs legal, coherencia vs cobertura defensiva), el founder es el árbitro natural — yo no debería implementar la recomendación del agente sin pensar críticamente si tiene sentido en el sitio entero.

### Cómo replicar

- Cuando un agente recomienda algo que IMPLICA acción del founder (pedirle matrícula, pedirle datos extras, agregar texto que cambia el tono), **antes de implementar, preguntarme**: ¿esta acción tiene sentido en el contexto del sitio entero?
- Si la respuesta no es obviamente sí, **flagear al founder antes de pedir/implementar**: "el agente recomienda X, mi lectura es que en el contexto del sitio Y podría ser overkill. ¿procedo o lo simplifico?"
- Especialmente cuidadoso con agentes que tienden al conservadurismo defensivo (optical-expert para legal, ai-features-engineer para safety, argentine-ecom para AFIP).

### Anti-patrón a evitar

- Tratar la recomendación del agente como instrucción a ejecutar sin filtro. Los agentes son consultores, no commanders.
- Pedirle al founder data extra (matrícula, número de habilitación, datos personales) sin haber validado que la necesidad es real en el contexto.
- Optimizar protección legal "por si acaso" cuando el costo es UX o coherencia que sí impactan conversión.

### Próxima vez aplicar a

- Cualquier recomendación de `optical-expert` que implique agregar texto regulatorio extenso o pedir datos del negocio que el founder tendría que confirmar manualmente.
- Cualquier recomendación de `argentine-ecom` que sugiera agregar checkboxes legales, micro-copy AFIP, etc. — validar primero si SÍ es obligatorio o si es defensivo over-the-top.
- Cualquier recomendación de `ai-features-engineer` que sugiera rate limiting, auth, captchas como "mejor práctica" — validar contra el contexto real de uso esperado.

---

## 2026-05-28 — Patrón "2 agentes especialistas en paralelo" para feature compleja desbloqueó el approach en 1 sprint

**Categoría**: Workflow / Sistema de agentes
**Confianza**: 🟢 Alta (1 caso de éxito, pero el resultado fue notablemente mejor que arrancar yo solo)

### Qué pasó

Founder pidió construir "Recomendador de monturas por rostro" (IA Vision + lógica óptica + UX). Antes de codear, invoqué **2 agentes especialistas en paralelo en el mismo mensaje**:

1. `optical-expert`: face shapes a reconocer (7 estándares argentinas), mapping óptico face shape → frame shape, slugs canónicos para `attributes.frame_shape`, disclaimer regulatorio obligatorio (Ley 17.132), qué NO hacer (género/edad, recomendar cristal), tono de los mensajes al cliente.
2. `ai-features-engineer`: modelo a usar (claude-haiku-4-5 con justificación de costo y task fit), API Route vs Server Action, schema del response con confidence numérico vs string, safeguards anti prompt-injection en el system prompt, privacy en Vercel (no /tmp, no console.log del body), rate limiting (Upstash recomendado pero okay sin para iter 1), UX flow técnico.

Ambos respondieron en ~40-60s. Sin sobrelap (cada uno aportó conocimiento de su dominio). El resultado fue que pude implementar el feature completo (lib helpers + API route + UI + sitemap) en 1 sprint sin re-trabajo por decisiones técnicas malas.

### Por qué funcionó

- **Decisiones óptico-regulatorias + decisiones técnicas son ortogonales**: el mapping face shape → frame shape NO depende de qué modelo usar. El disclaimer regulatorio NO depende de la arquitectura del endpoint. Por eso podían correr en paralelo sin coordinación.
- **Cada agente tiene contexto del proyecto** (CLAUDE.md, BUSINESS_POLICIES.md, etc.) — no tuve que pasarle background, solo el delta del feature.
- **Prompts a los agentes fueron muy específicos** sobre qué entregable necesito (no "escribí código", sino "decisiones técnicas/ópticas como bullet points"). Esto evitó que respondieran con código que después yo iba a tirar.
- **Respeté la regla CLAUDE.md "no invocar 3+ agentes en un solo turno sin coordinación clara"**: 2 está bien, son ortogonales, sin coordinación entre ellos necesaria.

### Cómo replicar

Para CUALQUIER feature que toque 2+ dominios independientes, invocar 2 agentes en paralelo en el mismo mensaje con prompts específicos:

**Buenos candidatos para este patrón**:
- Feature de checkout: `argentine-ecom` (Mercado Pago, AFIP) + `optical-expert` (requisitos para vender lentes de contacto).
- Feature de filtros de catálogo: `seo-strategist` (URLs + meta) + `optical-expert` (qué atributos son técnicamente relevantes).
- Lector de receta IA: `optical-expert` (datos de receta argentinas, validaciones) + `ai-features-engineer` (Vision + structured output).
- Asistente conversacional con RAG: `optical-expert` (qué SÍ/NO puede recomendar legalmente) + `ai-features-engineer` (RAG arquitectura).

**Malos candidatos** (mejor secuencial o agente único):
- Cuando el output del agente A condiciona el prompt del agente B. Si el optical-expert dice "no podemos usar Vision por X razón regulatoria", el prompt al ai-features-engineer cambia → mejor secuencial.

### Anti-patrón a evitar

- Invocar 3+ agentes en paralelo sin tener claro cómo se compone el resultado (mejor 2, y si hace falta un tercero, esperar al output de los primeros 2).
- Pedirles que "diseñen el feature" → muy abstracto. Mejor: pedirles entregables específicos como inputs accionables para que YO construya.
- Olvidar pasarles el contexto del proyecto en el prompt cuando es necesario (aunque los agentes tienen acceso al CLAUDE.md, a veces necesitan detalles del feature concreto que no están documentados).

### Próxima vez aplicar a

- Lector de receta IA (cuando el founder lo priorice): `optical-expert` (datos OD/OI/CIL/eje/DNP, formato receta argentina, regulación) + `ai-features-engineer` (Vision para PDF/foto, structured extraction, validaciones).
- Checkout completo: `argentine-ecom` + `optical-expert`.
- FAQs con FAQPage schema: `seo-strategist` (schema + rich snippets) + `content-writer-medical` (redacción + E-E-A-T).

---

## 2026-05-28 — Letter-by-letter reveal: agrupar letras por palabra con `whitespace:nowrap` evita que el browser rompa palabras a mitad

**Categoría**: framer-motion / animations / typography / CSS layout
**Confianza**: 🟢 Alta (bug detectado en producción por founder vía screenshot, fix verificado en build)

### Qué pasó

LetterReveal v1 (commit `9392c19`): cada letra del H1 era `motion.span style="display:inline-block; whiteSpace:pre"`. En desktop con ancho viewport ~1200px y text-balance, el browser rompía las palabras a mitad:

> "Anteojos origina **|** les con asesoram **|** iento óptico real"

Founder reportó "no me gusta como queda la J de anteojos" + screenshot. Ese "J" era realmente la J de "originaJes" cortada como "origina les".

### Causa raíz

**El browser puede hacer line break entre 2 inline-block consecutivos SIN necesidad de whitespace entre ellos**. Lógica del rendering: cada inline-block es un "atomic inline item" en el line flow. Cuando el ancho de línea se agota, el browser inserta el break en el último item que pudo, sin importar si hay un espacio o no.

`whitespace:pre` mantiene el espacio renderizado pero NO previene el wrap entre los items inline-block. Resultado: las letras se rompen a mitad de palabra cuando el balance las distribuye.

### Fix: agrupar letras por palabra en wrapper inline-block + nowrap

```tsx
const words = text.split(' ');
let letterCounter = 0;
return (
  <Tag>
    {words.map((word, wi) => (
      <Fragment key={wi}>
        {/* Wrapper de palabra: atomic, NO se rompe internamente */}
        <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {Array.from(word).map((char) => {
            const idx = letterCounter++;
            return (
              <motion.span
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: baseDelay + idx * 0.025, ... }}
                style={{ display: 'inline-block' }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
        {/* Espacio entre palabras: texto normal — SÍ permite wrap */}
        {wi < words.length - 1 && ' '}
      </Fragment>
    ))}
  </Tag>
);
```

**Claves del fix**:
1. **Palabra wrapper inline-block** + `whitespace:nowrap` → la palabra es un atomic item que el browser nunca rompe.
2. **Espacios entre palabras como texto normal** (no inline-block) → permite que el browser wrap en estos puntos como en cualquier texto.
3. **Delay individual por letra** (no `staggerChildren` del container) → cascada continúa atravesando palabras, no se resetea con cada wrapper.

### Cómo replicar

Cualquier vez que animes texto letra por letra (LetterReveal, scramble effect, char-by-char fade-in), agrupar las letras por palabra. Patrón:

```
container > word-wrapper(inline-block, nowrap) > letter(inline-block)
                                              ↑
                                  span entre word-wrappers como texto normal
```

### Anti-patrón a evitar

```tsx
// ❌ Mal — wrap a mitad de palabra
{Array.from(text).map(char => (
  <motion.span style={{ display: 'inline-block', whiteSpace: 'pre' }}>
    {char}
  </motion.span>
))}

// ✅ Bien — wrap solo entre palabras
{words.map(word => (
  <>
    <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
      {[...word].map(char => <motion.span style={{ display: 'inline-block' }}>{char}</motion.span>)}
    </span>
    {' '}
  </>
))}
```

### Próxima vez aplicar a

- Cualquier animación de texto que use `inline-block` por letra (scramble, fade-in cascade, jitter, hover-per-letter).
- Si en algún futuro escribimos un `TextScramble` o `WordShuffle` component, NO repetir el bug.

---

## 2026-05-28 — `useMotionTemplate` para que valores reactivos (gradient, color, transform string) actualicen en tiempo real

**Categoría**: framer-motion / animations / React
**Confianza**: 🟢 Alta (detectado como bug en sesión, fix aplicado, animación funciona)

### Qué pasó

Al construir el `TiltSpotlightCard` necesitaba que el background `radial-gradient(...)` siguiera al mouse en tiempo real. Primera implementación:

```tsx
const spotlightX = useTransform(mouseX, (v) => `${v * 100}%`);
const spotlightY = useTransform(mouseY, (v) => `${v * 100}%`);

<motion.div style={{
  background: `radial-gradient(220px circle at ${spotlightX.get()} ${spotlightY.get()}, ...)`,
}} />
```

**No funcionaba**: el gradient se quedaba fijo en el primer valor. Framer-motion no podía suscribirse a un string literal — `.get()` se evaluaba una vez en cada render, no en cada frame de animación.

### Causa raíz

`motionValue.get()` retorna el valor actual como **string normal**, perdiendo la reactividad. Style props con motion values funcionan **solo si pasás el motion value directamente** (`{ x: motionValueX }`) — no si construís un string con `.get()` adentro.

Para CSS properties complejas que requieren string templating (gradient, transform combinado, filter), framer-motion provee `useMotionTemplate`:

```tsx
const spotlightBg = useMotionTemplate`radial-gradient(220px circle at ${spotlightX} ${spotlightY}, ...)`;

<motion.div style={{ background: spotlightBg }} />
```

`useMotionTemplate` es un **tagged template literal** que retorna un motion value de string. Suscribe automáticamente a los motion values interpolados (`spotlightX`, `spotlightY`) y reemite el string completo cuando cambia cualquiera.

### Cómo replicar

- **Una sola propiedad CSS, valor numérico**: pasar motionValue directo. `style={{ x: motionX, opacity: motionOpacity }}`. Lo más común.
- **Una propiedad CSS con string templating** (gradient, clip-path, filter, transform combinado): usar `useMotionTemplate`. Ejemplo:
  ```tsx
  const clip = useMotionTemplate`inset(${top}% ${right}% ${bottom}% ${left}%)`;
  ```
- **NUNCA usar `.get()` dentro de un template string en style** — eso pierde la suscripción.

### Anti-patrón a evitar

```tsx
// ❌ Mal — string evaluado una sola vez
style={{ background: `linear-gradient(${angle.get()}deg, red, blue)` }}

// ✅ Bien — template reactivo
const gradient = useMotionTemplate`linear-gradient(${angle}deg, red, blue)`;
style={{ background: gradient }}
```

### Próxima vez aplicar a

- Cualquier feature que necesite CSS dinámico complejo controlado por mouse/scroll (spotlight, mask reveal animado, clip-path responsive a cursor, color shift en hover con stops específicos).
- Si en Round 4+ aparece bug similar "la animación se queda fija aunque el valor cambia", primer chequeo: ¿hay un `.get()` dentro del style?

---

## 2026-05-28 — Usar `createStaticClient()` en lugar de `createClient()` para data pública en home mantiene ISR

**Categoría**: Next.js / Supabase / SEO performance
**Confianza**: 🟢 Alta (verificado en build output: home pasa de `ƒ /` dynamic a `○ /` static + ISR 5min)

### Qué pasó

Al implementar `fetchHomeShowcaseProduct()` para mostrar el producto destacado en el hero, usé `createClient()` (server client con auth cookies) por inercia — es el patrón default en `lib/catalog/queries.ts` para queries en páginas dinámicas. **Resultado**: la home pasó de `○ /` (static + ISR 5min) a `ƒ /` (dynamic SSR en cada request).

### Causa raíz

`createClient()` lee `cookies()` en `lib/supabase/server.ts` para resolver auth del usuario. Next.js detecta el acceso a cookies durante el render del Server Component → marca la página como `dynamic`, deshabilita ISR. Pérdida en performance (cada request hace SSR + 4 queries Supabase) y SEO (CDN no puede cachear el HTML).

### Fix

Usar `createStaticClient()` cuando la query es de **info pública** que no depende del usuario logueado:
- `fetchAllActiveBrands` — ya lo usaba (público)
- `fetchHomeShowcaseProduct` — cambiado a este patrón

```ts
// ❌ Mal — rompe ISR
const supabase = await createClient();

// ✅ Bien — mantiene ISR
const supabase = createStaticClient();
```

Resultado: home volvió a `○ /` static + ISR 5min en el build, sin cambios funcionales.

### Cómo replicar

- **Default**: si la query es info pública (catálogo, marcas, productos activos), `createStaticClient()`.
- **Excepción**: si la query depende del usuario (su carrito, sus pedidos, su address), `createClient()` con cookies — y aceptar que la página será dynamic.
- **Verificar en build output**: si una página debería ser ISR pero aparece como `ƒ` (dynamic), buscar `createClient()` en sus queries y reemplazar por `createStaticClient()` donde sea seguro.

### Anti-patrón a evitar

- Copiar el patrón `await createClient()` de otra query sin pensar si la nueva query necesita auth.
- Mover queries de público a auth-aware sin validar el impacto en ISR — el costo SEO de perder static rendering es invisible pero real.

### Próxima vez aplicar a

- Cualquier nueva función en `lib/catalog/queries.ts` que se llame desde Server Components de páginas públicas (home, category index, brand page, product page).
- Antes de pushear, mirar el build output y confirmar que las páginas que deberían ser ISR siguen apareciendo como `○`.

---

## 2026-05-28 — Glosario de efectos modernos + plan por "rounds verificables" desbloqueó dirección de modernización

**Categoría**: Comunicación founder ↔ asistente / dirección de producto
**Confianza**: 🟢 Alta (founder eligió las 4 opciones propuestas + agradeció el vocabulario explícitamente)

### Qué pasó

Founder pidió "hacerlo más moderno" — pregunta abierta que históricamente generaba propuestas vagas. En vez de tirar una lista de 10 ideas o arrancar a programar a ciegas, hice 2 cosas:

1. **Glosario rápido de efectos modernos por categoría** (cursor follower, parallax, sticky scroll, tilt 3D, spotlight, bento grid, glass morphism, marquee, view transitions, shimmer, etc.) con nombre técnico + descripción corta + ejemplo de dónde se usa.
2. **AskUserQuestion con 4 ejes concretos** (tipografía editorial / showcase hero / accent + dark / micro-interacciones) cada uno con preview ASCII mostrando ACTUAL vs PROPUESTO + costo + impacto.

Founder respondió eligiendo las 4 opciones + comentario: **"Hay muchas cosas que veo en paginas modernas, el tema es que no se como ponerles nombres a ese tipo de interacciones/ efectos..."**.

### Por qué funcionó

- **El glosario destrabó comunicación futura**: ahora el founder puede pedir "agregá un spotlight a los cards" o "quiero parallax en el hero" sin tener que describir el efecto cada vez. Es vocabulary tooling, no docs decorativos.
- **AskUserQuestion con previews ASCII** convirtió un brief abstracto en 4 opciones concretas y comparables. El founder no técnico evaluó las 4 mirando previews, no leyendo párrafos.
- **Plan por rounds verificables** (4 etapas, cada una autocontenida, build/typecheck verde antes de pushear) le da control granular al founder: puede aprobar/rechazar/iterar cada round sin comprometerse a las siguientes.

### Cómo replicar

- **Cuando founder pide algo abstracto** ("más moderno", "que se vea premium", "ponele onda"), antes de proponer features: confirmar si tiene vocabulario. Si no, preguntar con previews ASCII de opciones concretas en vez de descripciones textuales.
- **Crear glosario one-shot** cuando hay un dominio nuevo (efectos web, marketing, óptica). El glosario es overhead de 1 mensaje que paga dividendos en todas las conversaciones siguientes.
- **Romper trabajo grande en rounds verificables** cuando hay alta incertidumbre estética. Cada round = 1 commit, 1 verificación visual, build/typecheck verde. Si el round 1 falla, no se contamina el round 2.

### Anti-patrón a evitar

- Tirar 10 ideas en una lista sin priorizar — el founder no puede elegir, queda paralizado.
- Empezar a codear "lo más moderno" sin checkpoint de dirección — terminás con 4 cambios paralelos y el founder no sabe cuál le gustó.
- Asumir que founder sabe el vocabulario técnico — el comentario "no sé cómo llamarlos" lo confirmó.

### Próxima vez aplicar a

- Cuando founder pida ideas para landing pages de marcas nuevas (Vulk, Rusty, etc.) — usar mismo patrón: glosario de "layouts editoriales" + opciones con preview.
- Cuando se discutan promociones / banners / hero rotators — glosario de "patterns de promo" + opciones.

---

## 2026-05-28 — `Image fill` ignora `padding` del wrapper — usar double wrapper para que el padding absorba el zoom

**Categoría**: Next.js / next/image / CSS positioning
**Confianza**: 🟢 Alta — verificado en producción 2026-05-28. El fix iter 3 (`p-10 sm:p-14 md:p-20` + `scale-[1.03]` + double wrapper) resolvió definitivamente. Founder confirmó visualmente. El patrón es replicable mientras se calibre el padding contra fotos reales del fabricante.

### Qué pasó

Tenía un `<Image fill>` con `object-contain` dentro de un wrapper con `aspect-square overflow-hidden p-8 md:p-12` y `className="group-hover:scale-[1.04]"`. **Esperaba** que el padding del wrapper diera "aire" para que el zoom hover no llegara a los bordes. **No funcionó** — la imagen se cortaba en el zoom.

### Causa raíz

`next/image` con `fill` aplica `position: absolute; inset: 0` al elemento img. Eso significa que el img ocupa **TODO el contenedor relative más cercano**, ignorando `padding` (porque `inset: 0` se calcula contra los bordes del contenedor, no contra el content box).

Resultado: el padding del wrapper era irrelevante para el posicionamiento de la imagen. La imagen ocupaba el 100% del wrapper (incluido el área del padding) y al hacer `scale 1.04` se extendía 4% más allá del wrapper → cortada por `overflow-hidden`.

### Fix: double wrapper

```tsx
{/* Outer: aspect-square + padding + overflow-hidden + el background visual */}
<div className="relative aspect-square w-full overflow-hidden rounded-lg p-8 md:p-12">
  {/* Inner: relative h-full w-full — es lo que `fill` respeta */}
  <div className="relative h-full w-full">
    <Image
      src={...}
      fill
      className="object-contain group-hover:scale-[1.04]"
    />
  </div>
</div>
```

Lo que cambia:
- El outer define el **área visual** (con padding y bordes).
- El inner es el **área de positioning** para `fill`. Su tamaño es `100% - padding del outer`.
- Al hacer scale en la imagen, el zoom se expande dentro del inner. El padding del outer absorbe el overshoot — la imagen NO toca los bordes del outer, así que `overflow-hidden` no la corta.

### Por qué funciona

- `fill` busca el ancestor `position: relative` más cercano para hacer `inset: 0`. El inner es ese ancestor (no el outer).
- El inner tiene `h-full w-full` que en CSS significa "100% del parent **content area**" — el parent es el outer, su content area excluye el padding.
- El zoom 1.04 sobre la imagen dentro del inner queda dentro del área de padding del outer, no llega al borde exterior.

### Cómo replicar

Cuando combines `next/image fill` con cualquier transform (scale, rotate, translate) en hover Y querés que el efecto no toque los bordes:

```tsx
<div className="aspect-X overflow-hidden p-Y">    {/* visual area + padding */}
  <div className="relative h-full w-full">         {/* positioning area for fill */}
    <Image fill className="object-contain ..." />
  </div>
</div>
```

### Cuándo NO necesitás esto

- Si no aplicás transform al image (sin scale/zoom hover): el padding del wrapper igual no funciona, pero no se nota porque no hay overshoot.
- Si usás `Image` con `width/height` explícito en lugar de `fill`: el padding del wrapper se respeta naturalmente porque el img es `position: static`.

### Notas

- También aplica si tenés `Image fill` con `padding` directo en su className. El padding del propio img sí funciona (porque modifica el `inset: 0` efectivo), pero combina mal con `object-contain` porque object-contain no respeta el padding del img.
- Mismo patrón aplica a `<video>` o cualquier elemento con `position: absolute; inset: 0`.
- **Calibrar padding contra las fotos reales, no contra el cálculo teórico**: en e-commerce las fotos del fabricante con frecuencia NO tienen padding propio en el JPG — el objeto toca los bordes del cuadrado. Aunque el double wrapper aísle el área de positioning, si la imagen llena el inner hasta el borde, cualquier scale crece "afuera" del inner. Calibración inicial p-12 (48px) parecía generosa pero no compensaba el cero-padding intrínseco de las fotos. Real-world: empezar con padding generoso (p-16/p-20 = 64-80px en desktop) Y scale chico (1.02-1.03), después afinar bajando si se ve excesivo.
- **Verificar visualmente con el founder antes de declarar "fix definitivo"**. El cálculo teórico ("8px overshoot, 48px padding → no se corta") asumía que la imagen NO tocaba los bordes del inner. Cuando la imagen sí los toca (por la naturaleza de los JPGs source), el cálculo falla. La verificación con screenshots reales del founder es el feedback loop crítico.

---

## 2026-05-28 — Sort criterio "específico-antes-que-compartido" cuando filtrás N items + items globales en una vista por contexto

**Categoría**: UI / sort algorithms / multi-variant rendering
**Confianza**: 🟢 Alta (implementado, founder confirmó bug visual reproducible, fix verificado)

### Qué funcionó

Patrón general: cuando en una UI mostrás items **filtrados por un contexto** (variante, talle, idioma, lo que sea) MEZCLADOS con items que son **compartidos a todos los contextos**, el sort default `(prioridad ASC, sort_order ASC)` puede intercalar los compartidos en el medio de los específicos si los `sort_order` no fueron pensados con esto en mente.

**Caso real**: producto con 2 variantes (Carey, Rosa) y 1 esquema técnico de medidas compartido (variant_id=NULL). Los `sort_order` originales:
- Carey: 0 (lateral), 1 (frontal)
- Medidas compartida: 2
- Rosa: 3 (lateral), 4 (frontal)

Sort `(is_primary, sort_order)` cuando seleccionás Rosa:
- 04 lateral rosa (primary=true, sort=3) → pos 1
- **03 medidas compartida (primary=false, sort=2) → pos 2** ← BUG: se cuela
- 05 frontal rosa (primary=false, sort=4) → pos 3

El usuario espera: lateral rosa → frontal rosa → medidas técnicas. Pero ve: lateral rosa → medidas → frontal rosa.

### Solución: agregar criterio "es específico del contexto seleccionado" antes del sort_order

```ts
sort((a, b) => {
  // 1. Primary primero (si aplica)
  if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;

  // 2. Específicos del contexto seleccionado antes que compartidos
  if (selectedContextId) {
    const aSpecific = a.context_id === selectedContextId;
    const bSpecific = b.context_id === selectedContextId;
    if (aSpecific !== bSpecific) return aSpecific ? -1 : 1;
  }

  // 3. Sort_order como tiebreaker
  return a.sort_order - b.sort_order;
});
```

Con esto, no importa qué `sort_order` tengan las compartidas: siempre van DESPUÉS de las específicas del contexto seleccionado.

### Por qué funciona

- **Independiente del sort_order**: no requiere reorganizar la data ni renumerar. Funciona aunque los `sort_order` se hayan asignado sin pensar en este caso.
- **Generalizable**: el criterio "específico-antes-que-compartido" es válido en cualquier UI multi-contexto. Aplica a:
  - Galerías de producto con imágenes por variante + imágenes del modelo.
  - Tabs de "para este país" + "global" en docs i18n.
  - Atributos por talle vs atributos del producto.
- **Defensive default**: si `selectedContextId` es `null`, el criterio se salta y se mantiene el sort básico — no rompe vistas que no tienen contexto seleccionado.

### Alternativa peor (no usar)

"Resolver" reasignando sort_order altos a las compartidas (ej 99). Funciona pero:
- Requiere mantener convención manual al cargar data nueva ("recordá poner 99 a las compartidas").
- Rompe si alguna variante futura tiene >99 imágenes (impróbable pero teórico).
- No escala a múltiples niveles (qué pasa si querés "específicos del contexto > shared a la categoría > shared al producto > shared global").

Mejor el criterio en el sort: la convención vive en código, no en data.

### Cuándo aplicarlo

- Cualquier filter+sort UI donde hay items con un FK opcional al "contexto" y los items con FK NULL son globales/compartidos.
- Schemas tipo: `attribute_id NULL = aplica a todo el padre` (common pattern en e-commerce).

### Notas

- Si el contexto puede tener jerarquía multinivel (variant_id NULL puede ser "compartida a esta talla" pero NO "compartida globalmente"), agregar más criterios al sort por nivel de specificity.
- Si la lista es muy grande (>1000 items), considerar precomputar la specificity como una columna virtual en la query (SQL `CASE WHEN ...`).

---

## 2026-05-28 — Variant selection con Context: gallery filtering + click-to-select sin perder server components

**Categoría**: React patterns / Client+Server hybrid / E-commerce UX
**Confianza**: 🟢 Alta (implementado, typecheck verde, comportamiento natural en variants con stock)

### Qué funcionó

Problema: cuando un producto tiene múltiples variantes con fotos propias (ej Vulk Day Light: variante carey con 2 fotos + variante rosa con 2 fotos + 1 esquema técnico compartido), la gallery default mostraba **TODAS las imágenes mezcladas** → 5 thumbs confusas. Y la VariantList tenía variantes sin mecanismo de "selección" más allá del CTA de compra.

**Solución idiomática React 19**:

1. **Context Provider client-side** en `lib/product/variant-selection.tsx`:
```tsx
'use client';
const VariantSelectionContext = createContext<Ctx>({...});
export function VariantSelectionProvider({ children, defaultVariantId }) {
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariantId);
  // useMemo + useCallback para stable references
  return <VariantSelectionContext.Provider value={...}>{children}</...>;
}
export function useVariantSelection() {
  return useContext(VariantSelectionContext);
}
```

2. **Server component wraps con Provider** en `ProductDetailPage`:
```tsx
const defaultVariantId = inStockVariants[0]?.id ?? activeVariants[0]?.id ?? null;
return (
  <VariantSelectionProvider defaultVariantId={defaultVariantId}>
    <main>...</main>
  </VariantSelectionProvider>
);
```

3. **Client consumers** (`ProductGallery`, `VariantList`) usan el hook:
```tsx
const { selectedVariantId, selectVariant } = useVariantSelection();
const visibleImages = useMemo(() =>
  images.filter(img => img.variant_id === selectedVariantId || img.variant_id === null),
[images, selectedVariantId]);
```

4. **VariantList: row clickeable + radio visual**:
- Cada `<li>` con `role="button" tabIndex={0}` + `onClick={() => selectVariant(v.id)}`.
- Radio circle visual a la izquierda (border + dot interno cuando seleccionada).
- El botón CTA interno usa `onClick={(e) => e.stopPropagation()}` para que clickear el botón NO seleccione la variante.
- Keyboard accessibility: Enter/Space trigger select.

### Por qué funciona

- **Server component genera defaults** desde DB (primera variante en stock) sin necesidad de fetch client-side. SSR-friendly, sin flash.
- **Provider boundary chico** envuelve solo `<main>` del product-page, no toda la app. Performance OK.
- **Filter en `useMemo`** con dependency `[images, selectedVariantId]` — solo recompute cuando cambia la selección.
- **Reset de `activeIdx` cuando cambia variante** evita apuntar a una imagen del set anterior:
```tsx
useEffect(() => { setActiveIdx(0); }, [selectedVariantId]);
```

### Schema design choice: imágenes compartidas vs por variante

El schema `product_images` permite `variant_id: NULL` = imagen "del modelo" (compartida entre variantes). Útil para:
- Esquemas técnicos de medidas
- Comparación lado a lado
- Hero images neutrales

Reglas que aplicamos en data:
- Foto de **una variante específica** (ej "Carey Brillo de frente") → `variant_id = variant.id`.
- Foto **compartida del modelo** (ej "esquema técnico de medidas") → `variant_id = NULL`.

Filter logic en gallery: muestra `variant_id === selectedVariantId OR variant_id === null`. Ambas categorías son visibles cuando la variante está seleccionada.

### Cómo replicar

Para cualquier producto con variantes que tengan datos visuales propios (imágenes, swatches, descripciones):

1. Crear Context client-side con state + setter.
2. Provider wraps el área del producto en server component, default desde server data.
3. Componentes que necesitan reaccionar consumen via hook.
4. Filtros en consumers via `useMemo`.
5. Reset state local cuando cambia la selección.

Aplica a:
- Variantes de color con fotos propias (este caso).
- Talles con tabla de medidas distinta.
- "Modos" del producto (ej receta vs sol del mismo armazón).

### Notas

- React 19 Context Provider sigue siendo el patrón estándar; no usamos `use()` para esto porque el state es mutable client-side.
- Si en el futuro queremos sincronizar la variante con la URL (deep linking ej `?variant=rosa`), agregar `useSearchParams` + `router.replace` cuando cambia la selección. Trivial extensión del Provider.
- Considerar `useTransition` si el cambio de variante dispara fetches (no es el caso ahora, todo client-side).

---

## 2026-05-28 — CSS Grid con row-span + col-start asimétrico = stack vertical en mobile + layout balanceado en desktop sin duplicar markup

**Categoría**: CSS / Layout responsivo
**Confianza**: 🟢 Alta (implementado, typecheck verde, comportamiento verificado en código)

### Qué funcionó

Problema clásico de e-commerce: en la página de detalle de producto, la columna izquierda (galería de imágenes) es más corta que la columna derecha (que tiene H1, atributos, medidas, variantes, etc) → en desktop queda un **espacio blanco grande** debajo de las imágenes.

Soluciones típicas:
1. Mover algo de la columna derecha a la izquierda → en mobile (1 col) ese elemento queda en el medio del flow, donde no debería estar.
2. Duplicar el componente con `hidden md:block` + `md:hidden` → markup duplicado, riesgo de drift.
3. Conformarse con el espacio blanco.

**Solución CSS Grid pura, sin duplicar markup**:

```tsx
<div className="grid gap-8 md:grid-cols-2 md:grid-rows-[auto_1fr] md:gap-y-6">
  {/* Row 1 Col 1: Gallery (default position) */}
  <ProductGallery />

  {/* Right column ocupa ambas rows en col 2 */}
  <div className="md:col-start-2 md:row-span-2 md:row-start-1">
    {/* H1, atributos, medidas, etc */}
  </div>

  {/* ProductIncludes en col 1 row 2 (debajo del gallery en desktop) */}
  <div className="md:col-start-1 md:row-start-2">
    <ProductIncludes />
  </div>
</div>
```

**Comportamiento**:
- **Desktop** (md+): Gallery arriba-izq, Right column ocupa toda la columna derecha (row-span 2), ProductIncludes abajo-izq llenando el espacio.
- **Mobile** (default, sin md): no aplica grid-cols-2, los items se apilan en orden natural de DOM: Gallery → Right column → ProductIncludes.

### Por qué funciona

- **CSS Grid es 2D**: a diferencia de flexbox, podés controlar tanto rows como cols explícitamente.
- **`md:row-span-2`** dice "este elemento ocupa 2 rows" → cuando hay un elemento en `md:row-start-2` en la otra columna, no chocan, porque cada uno está en su columna.
- **El orden del DOM determina el orden mobile**: el ProductIncludes está físicamente después del right column en el JSX → en mobile va al final naturalmente.
- **`grid-rows-[auto_1fr]`** asegura que la primera row se ajusta al contenido (gallery) y la segunda toma el espacio restante (where it makes sense).

### Cómo replicar

Patrón general "columna corta + columna larga + elemento que llena el espacio":

```
grid-cols-2 grid-rows-[auto_1fr] (md+)

[col 1 row 1]  [col 2 row 1]
[col 1 row 2]  [col 2 row 2]
                              ← lo que está en col-start-2 + row-span-2
                                ocupa ambas rows
```

Aplicable a:
- Página de producto (gallery + sidebar + extras debajo del gallery).
- Páginas de blog (sidebar + content + bloque "newsletter" debajo del sidebar).
- Dashboards (chart + KPIs + descripción debajo del chart).

### Cuándo NO usar este patrón

- Si la columna corta es MÁS larga que la columna larga: rompe el balance, mejor flex.
- Si necesitás cambiar el orden visual entre mobile y desktop drásticamente: combinar con `order-` utility.
- En IE11 (irrelevante hoy, pero por si acaso): grid-template-rows con `1fr` tiene gotchas.

### Notas

- Tailwind 3.4 soporta `grid-rows-[auto_1fr]` con sintaxis arbitraria.
- Si el contenido del row-spanned column es muy largo, puede empujar la altura total — el espacio blanco no desaparece 100%, solo se compacta. Para el caso típico (gallery + 5-7 secciones a la derecha + 1 sección extra a la izquierda), funciona bien.
- En mobile, si querés controlar el orden distinto al DOM, usar `order-` en cada item.

---

## 2026-05-28 — Schema extensible via JSONB attributes + validación cross-agent: callouts sin migración + sin invenciones

**Categoría**: Schema design / Workflow agentes / UX
**Confianza**: 🟢 Alta (implementado end-to-end, typecheck verde, 3 callouts Vulk validados por optical-expert ya en código)

### Qué funcionó

Founder pidió "bloques visuales tipo Sabías que / Recomendación" en página de producto (para profundidad + diferenciación + E-E-A-T). 3 sub-problemas convergentes que resolvimos con un mismo patrón:

1. **Cómo agregar contenido estructurado nuevo SIN migrar DB cada vez**.
2. **Cómo evitar que el copywriter (content-writer-medical) invente data técnica** (ej: "las lentes polarizadas funcionan así…").
3. **Cómo dar UI consistente para algo que va a crecer** (4 tipos de callout hoy, mañana quizás más).

**Solución triple-capa**:

### Capa 1 — Schema JSONB en `attributes`, sin migración

En vez de agregar columna `callouts` a la tabla `products` (migración + sincronización local↔cloud), uso `products.attributes` JSONB existente con sub-key `callouts`:

```json
{
  "frame_material": "g-flex",
  "callouts": [
    { "type": "info", "title": "Sabías que…", "body": "..." },
    { "type": "recommendation", "title": "Recomendación", "body": "..." }
  ]
}
```

**Pros**:
- Cero migración. Funciona en cloud sin tocar schema.
- Productos sin callouts simplemente no tienen la key — el parser devuelve `[]` y el componente no renderiza.
- Si mañana querés agregar otra dimensión (ej "faq", "testimonials") es la misma técnica: nueva key dentro de `attributes`.

**Contras** (aceptados):
- No hay constraint a nivel DB del shape del JSONB. El **parser defensivo** en TS valida en runtime (type narrowing por field, filtra items malformados).
- Querying por "productos con callouts del tipo X" requiere `attributes->'callouts' @> '[{"type":"X"}]'` JSONB ops — no hay index automático. Para volumen actual (decenas de productos), aceptable.

### Capa 2 — Validación cross-agent: content-writer propone, optical-expert valida

Cualquier callout sobre óptica/física/materiales DEBE ser técnicamente correcto (la regla "no inventar" de CLAUDE.md aplica fuerte acá: si decimos "las lentes polarizadas funcionan X" y X está mal, perdemos autoridad YMYL).

Flujo nuevo:
1. **`content-writer-medical`** (cuando escribe descripción de producto) propone 2-3 callouts JSONB candidatos.
2. **`optical-expert`** valida técnicamente cada callout (o lo reescribe si tiene errores).
3. Lo validado va al seed.

Operacionalizado en `.claude/agents/content-writer-medical.md` — instrucción literal de validar con optical-expert para callouts técnicos. **Sin esto, el agente inventa con confianza ("rejilla magnética", "filtro biofotónico", etc).**

### Capa 3 — UI pattern parametrizable con 4 variantes

`ProductCallouts` component con `CALLOUT_STYLE` map por tipo. Cada tipo tiene `{container, icon, iconWrap, title}` con clases Tailwind. Para agregar un 5to tipo (ej "story", "testimonial"), basta agregarlo al map + a la unión de types — sin tocar render logic.

Cada variante usa colores Tailwind directos (`blue-500`, `amber-500`, `emerald-500`, `red-500`) con saturación baja (`bg-X-50/60`) y dark mode (`dark:bg-X-950/30`) para no romper la estética minimalista del sitio.

### Por qué la combinación funciona

- **Schema flexible + parser defensivo** = puedo extender el modelo de contenido sin tocar DB. Productos viejos no se rompen, productos nuevos opt-in.
- **Validación cross-agent** = cada agente respeta su scope (writer escribe con tono, expert valida con rigor). Resultado: copy bueno + correcto.
- **UI parametrizable** = agregar tipos es trivial. UI cambia en 1 archivo.
- **Documentado en BUSINESS_POLICIES.md** = la próxima vez que alguien (yo en otra sesión, otro agente, el founder revisando) pregunte "¿cómo agregar callouts?", la respuesta está ahí.

### Cómo replicar este patrón para contenido futuro

Si mañana queremos agregar otra dimensión de contenido a productos (FAQ, testimonials de cliente, "compará con otro producto", "guía de talles"):

```
1. Definir sub-key en attributes.<nombre> con shape JSONB simple.
2. Crear parser defensivo TS con type narrowing por field.
3. Componente React que recibe attributes y renderiza si hay data,
   no-op si falta.
4. Documentar en BUSINESS_POLICIES.md (cuándo usar, schema, reglas).
5. Update agente que escribe ese contenido para que sepa el patrón
   y proponga automáticamente.
6. Si toca dominio técnico (óptica), workflow de validación con
   optical-expert antes de seedear.
```

### Notas

- Si en el futuro un campo del JSONB se vuelve "first-class" (querying frecuente, índices, constraints), promover a columna real con migración. Por ahora `attributes.callouts` es perfectly fine.
- El componente actual respeta `prefers-reduced-motion` via `RevealOnScroll` (que ya tiene esa lógica).
- Los 3 callouts Vulk Day Light que escribió optical-expert son verificables: la explicación del filtro polarizador es física básica (rejilla orientada en un eje bloquea ondas en el eje perpendicular).

---

## 2026-05-28 — Knowledge base canónica para que agentes "sepan" sin inventar — patrón cluster por marca + políticas operativas

**Categoría**: Sistema de agentes / Knowledge management
**Confianza**: 🟢 Alta (implementado, agentes referencian archivos, próxima invocación los va a usar)

### Qué funcionó

Founder pasó keywords de Ubersuggest + política universal del negocio (estuche+franela+garantía) y pidió que "queden de forma permanente para que los agentes siempre sepan". El problema clásico de sistemas de agentes: cuando la data viene en un turno y se necesita en otro, se pierde o se inventa.

**Solución implementada en 4 capas**:

1. **Archivos canónicos en root**:
   - `SEO_STRATEGY.md` (existente) extendido con sección "Keywords por marca/producto cargados" con sub-clusters por marca (ej "Cluster: VULK"). Cada cluster lista keywords primarias/secundarias/long-tails con vol/difficulty/intent.
   - `BUSINESS_POLICIES.md` (nuevo) con políticas universales operativas (qué viene en cada compra, envíos, devoluciones, etc).
2. **Plantilla en SEO_STRATEGY.md** para que la próxima marca cargada respete la misma estructura — autoreplicable.
3. **Agentes con sección "Fuentes de verdad que tenés que leer ANTES"** — instrucción literal de leer los archivos canónicos antes de auditar/escribir. Si la marca no tiene cluster, el agente DEBE pedir keyword research al founder en vez de inventar.
4. **CLAUDE.md tabla de archivos** referencia los 2 archivos.

### Por qué funciona

- **Source of truth única**: si un dato cambia (ej política de garantía), se cambia en 1 archivo y todos los agentes lo usan en su próxima invocación.
- **Agentes no inventan** porque su prompt los obliga a leer el archivo. Si el dato no está, no asumen — preguntan.
- **Escalable**: la plantilla de "Cluster: <MARCA>" permite agregar marcas nuevas sin tocar prompts ni código.
- **Separation of concerns**: SEO_STRATEGY.md = qué posicionar; BUSINESS_POLICIES.md = qué cumple el negocio. Cada uno tiene su scope.

### Cómo replicar

Para cualquier proyecto con agentes que necesitan data específica del dominio:

```
1. Crear archivos canónicos en root con secciones bien delimitadas:
   - <Domain>_STRATEGY.md (decisiones estratégicas)
   - <Domain>_POLICIES.md (reglas operativas)
2. Definir UNA plantilla replicable para data nueva (ej "Cluster: X").
3. En los .md de cada agente, agregar sección "Fuentes de verdad que tenés que
   leer ANTES de actuar" con paths exactos + qué buscar en cada uno.
4. Cuando el agente no encuentre data → debe PEDIR al founder, no inventar.
5. Referenciar los archivos en CLAUDE.md / system prompt principal para que
   el orquestador también los conozca.
```

### Cuándo aplicarlo

- Cualquier proyecto donde los agentes necesitan data específica (keywords, atributos, políticas, brand voice).
- Especialmente cuando los datos vienen del founder en turnos sueltos y se reusarán en muchos turnos futuros.
- Cuando hay riesgo de inventar (sectores YMYL, contenido legal, datos verificables).

### Notas

- En este turno se "promovió" la política universal de inclusiones (estuche/franela/garantía) que el founder había mencionado al pasar — sin esto, se perdía en próximas invocaciones.
- El agente content-writer-medical en este mismo turno inventó "desde Córdoba" en una meta_description (la óptica está en Virasoro, Corrientes). Detectado por grep pre-cierre — el mismo patrón de defensa-en-profundidad que ya está documentado en LEARNINGS 2026-05-28 "Detección pre-cierre de fact inventado".
- Combinado con la regla "grep pre-cierre", el sistema tiene 2 capas de defensa: (a) prevención (agente lee fuente de verdad) + (b) detección (grep antes de enviar).

---

## 2026-05-28 — Productos relacionados con algoritmo cascada > query simple — robusto contra catálogo chico

**Categoría**: SEO / UX / Catálogo
**Confianza**: 🟢 Alta (validado por seo-strategist + implementado en `lib/catalog/queries.ts:fetchRelatedProducts`)

### Qué funcionó

Cuando hay que mostrar "productos similares" en página de producto, la opción naive es `SELECT * FROM products WHERE brand = current_brand AND category = current_category LIMIT 6`. Problema: cuando una marca tiene 1 solo producto (caso real del proyecto: Vulk con sólo Vulk Day Light cargado), esa query devuelve 0 → la sección queda vacía → rompe confianza ("¿este sitio tiene un solo producto?").

Solución: **algoritmo cascada con fallbacks priorizados**. 4 pasos secuenciales que rellenan el bucket de 6 productos:

1. **Misma categoría + misma marca** (excluyendo el actual) → si encuentra ≥6, stop.
2. **Si faltan: misma categoría + similar precio (±30%)** — cualquier marca.
3. **Si faltan: misma categoría + misma forma de armazón** (rectangular, wayfarer, aviator, etc).
4. **Si faltan: cualquier producto de la misma categoría** — fallback final.

Cada paso agrega solo lo que falta para llegar a 6. Productos sin stock se filtran. El producto actual se excluye.

### Por qué funciona

- **NUNCA muestra 0 productos** — siempre hay fallback. La página nunca queda vacía visualmente.
- **Prioridad declarativa**: el orden de los pasos refleja qué define "similar" desde más fuerte (mismo SKU mental) a más débil (cualquiera de la misma cat).
- **Mantiene UX coherente**: cuando la marca tiene 6+ productos, todos son de la misma marca → el usuario ve un "más Vulk". Cuando solo hay 1, mezcla marcas pero mantiene la categoría (sigue siendo sol, no le aparece receta).
- **SEO bonus**: el anchor de cada card es el nombre del producto (no "Ver producto" genérico) → Google ve internal links con anchors descriptivos naturalmente.

### Cómo replicar

```ts
async function fetchRelatedProducts({
  excludeSlug, categorySlug, brandSlug, priceCents, frameShape,
}): Promise<RelatedProductCard[]> {
  const collected = new Map<string, RelatedProductCard>();
  const LIMIT = 6;

  const addRows = (rows) => {
    for (const row of rows ?? []) {
      if (collected.size >= LIMIT) return;
      if (row.slug === excludeSlug) continue;
      const card = toCard(row);
      if (card.inStockCount === 0) continue;
      if (collected.has(card.slug)) continue;
      collected.set(card.slug, card);
    }
  };

  // Paso 1: misma cat + misma marca
  addRows((await query.eq('category.slug', categorySlug).eq('brand.slug', brandSlug)).data);
  if (collected.size >= LIMIT) return Array.from(collected.values());

  // Paso 2: similar precio
  if (priceCents !== null) {
    addRows((await query.gte('price', priceCents * 0.7).lte('price', priceCents * 1.3)).data);
    if (collected.size >= LIMIT) return Array.from(collected.values());
  }

  // Paso 3: misma forma de armazón
  if (frameShape) {
    addRows((await query.eq('attributes->>frame_shape', frameShape)).data);
    if (collected.size >= LIMIT) return Array.from(collected.values());
  }

  // Paso 4: fallback total
  addRows((await query).data);
  return Array.from(collected.values());
}
```

### Cuándo aplicarlo

- E-commerce con catálogo chico-medio (<200 productos) donde cada categoría puede tener solo 1-2 productos por marca.
- Sitios donde la marca propia importa (óptica, moda, vino) — paso 1 prioriza marca.
- Cualquier "related items" donde haya múltiples atributos de similitud y no quieras hardcodear uno solo.

### Cuándo NO aplicarlo

- Catálogos muy grandes (10k+ productos): mejor un servicio de recomendaciones real (Algolia Recommend, Vespa) que devuelve cosas más relevantes por behavior + content.
- Cuando "similar" tiene una definición rígida (ej: "el mismo modelo en otra talla") — usar query directa.

### Notas

- Cada query es independiente — son 4 round-trips a Supabase en el peor caso. Aceptable para volumen actual; cachear con `revalidate: 3600` si crece.
- El `attributes->>frame_shape` usa el operador JSONB de PostgreSQL — funciona porque ya tenemos índice GIN en `attributes`.
- El anchor SEO está en el `<Link>` que envuelve el card → el nombre del producto como child es el anchor text natural.

---

## 2026-05-28 — Supabase Storage público: URL construible deterministically sin SDK + sin server-only

**Categoría**: Frontend / Performance / Supabase
**Confianza**: 🟢 Alta (implementado en `lib/storage/product-image-url.ts`, typecheck verde, listo para client components)

### Qué funcionó

Para mostrar imágenes de un bucket público de Supabase Storage en client components / nuestros `<Image>` de Next, había 3 caminos:

1. **Llamar al SDK** `supabase.storage.from(bucket).getPublicUrl(path)` — funciona pero requiere instanciar el client y la respuesta queda en `data.publicUrl`. El existente `lib/storage/products.ts` lo hace pero está marcado `'server-only'` porque usa `createAdminClient` (service_role).
2. **Pre-calcular las URLs en el server y pasarlas al client** — funciona pero acopla server↔client innecesariamente y duplica datos en props.
3. **Construir la URL directamente** desde `NEXT_PUBLIC_SUPABASE_URL` + path canónico del bucket público — pure JS, sin SDK, funciona en cualquier context.

Elegí opción 3. La URL pública de un bucket público de Supabase Storage tiene formato 100% determinístico:

```ts
`${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
```

Helper `lib/storage/product-image-url.ts` (sin `'server-only'`):

```ts
export function getProductImageUrl(storagePath: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${PRODUCTS_BUCKET}/${storagePath}`;
}
```

### Por qué funciona

- **Bucket público = no hace falta firmar URLs**. Las firmadas son para buckets privados. Si el bucket es público, cualquiera con la URL puede leer — y la URL es construible sin secretos.
- **`NEXT_PUBLIC_SUPABASE_URL` está disponible en client** (es `NEXT_PUBLIC_*`). No hay leak de secrets.
- **Pure JS function** → puede usarse en RSC, client component, edge runtime, scripts. Sin restricciones.
- **Cero overhead**: no necesita instanciar SDK, no hace network call, no async.

### Cuándo NO usar este patrón

- **Bucket privado**: para esos hay que generar signed URLs vía SDK (server-side) con expiración. Construir manual NO va a funcionar.
- **Necesitás transformaciones** (resize, format conversion via Supabase Image Transformation): la URL tiene parámetros adicionales — mejor usar SDK.
- **El path no es controlado por vos** (ej user-uploaded sin sanitización): primero validá el path.

### Cómo replicar

Para cualquier bucket público de Supabase:

```ts
// lib/storage/<resource>-url.ts (sin 'server-only')
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321';

export function get<Resource>Url(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/<bucket>/${path}`;
}
```

Y configurar en `next.config.mjs`:
```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '*.supabase.co' },
  ],
}
```

(Esto ya estaba configurado en nuestro proyecto.)

### Notas

- En dev local Supabase corre en `http://localhost:54321`. El fallback `?? 'http://localhost:54321'` cubre eso. En prod, `NEXT_PUBLIC_SUPABASE_URL` está seteado en Vercel.
- El bucket `products` está marcado `public=true` en `storage.buckets` + tiene policy `anyone reads`. Si después se hace privado, este helper deja de funcionar y hay que migrar a signed URLs.

---

## 2026-05-28 — Plantilla estructurada de inputs > pingpong de preguntas, especialmente con founders no-técnicos

**Categoría**: Comunicación / Workflow con founder
**Confianza**: 🟢 Alta (usada al pedir data del 1er producto Rusty real — patrón claro y replicable)

### Qué funcionó

Cuando founder pidió "cargar 1 producto para ver cómo se ve la página de producto", la opción obvia era arrancar con AskUserQuestion("¿qué marca?") → respuesta → AskUserQuestion("¿qué categoría?") → respuesta → AskUserQuestion("¿qué nombre exacto?") → etc. Hubiera tomado 8-12 turnos para juntar la data completa de 1 producto.

En lugar de eso, le pasé una **plantilla markdown estructurada** que él puede rellenar en su tiempo y devolverme en 1 sola respuesta:

```
MARCA: ...
CATEGORÍA: sol / receta
MODELO EXACTO: ...
NOMBRE COMPLETO: ...
DESCRIPCIÓN CORTA: ...
DESCRIPCIÓN LARGA: ...
ATRIBUTOS:
  - Material del marco: ...
  - Forma del marco: ...
  - ...
VARIANTE 1:
  - Color del armazón: ...
  - Precio: ...
  - Stock: ...
VARIANTE 2: ...
```

Esto convierte un proceso de 8-12 turnos (yo pregunto → él responde → yo pregunto → él responde) en **1 turno asíncrono** (yo paso plantilla → él la llena cuando puede → yo proceso todo).

### Por qué funciona

- **Founder no-técnico ve TODA la data requerida al mismo tiempo** → entiende el alcance, no se sorprende por preguntas inesperadas a mitad de carga.
- **Puede llenar la plantilla offline / en su tiempo** (consultar facturas, fotos, stock real) sin presión de turnos.
- **Yo proceso TODA la data junta** → menos contexto perdido entre turnos, menos riesgo de olvidar atributos.
- **La plantilla actúa como spec implícita** del data model — founder ve "ah, necesitás esto, esto y esto" y aprende qué datos vamos a estructurar.

### Cuándo aplicarlo

- Carga de productos / data de catálogo.
- Onboarding de marca nueva (slug, descripción, líneas, segmento).
- Configuración inicial (env vars, contactos, datos legales).
- Cualquier proceso que requiera >3 datos discretos del founder.

### Cuándo NO aplicarlo

- Decisiones binarias o de 2-3 opciones → AskUserQuestion es mejor (más fast).
- Cuando la siguiente pregunta depende de la respuesta a la anterior (ej "¿elegís A o B?" → si A pregunto X, si B pregunto Y) → plantilla no sirve porque no se puede pre-escribir.
- Cuando el founder ya está activo y en flow (ej "dale", "continuá") — plantilla sería burocrática.

### Cómo replicar

Template structure:

1. **Encabezado**: estado actual del sistema relevante a la pregunta (qué hay cargado, qué falta).
2. **Estrategia recomendada**: qué voy a hacer con los datos que pida (transparencia → builds trust).
3. **La plantilla**: agrupada por secciones, con ejemplos entre paréntesis donde sea ambiguo.
4. **Notas auxiliares**: cualquier pendiente paralelo que el founder pueda adelantar mientras consigue la data.

### Notas

- Si la plantilla queda larga (>30 líneas), considerar partirla en fases (ej "fase 1: producto base; fase 2: variantes; fase 3: imágenes") y procesarlas secuencialmente, no en paralelo.
- Esta es la inversa del "leak by 1000 cuts": en vez de descubrir requirements de a poco, los ponemos arriba de la mesa de entrada.

---

## 2026-05-28 — Cursor magnético seguro: 3 protecciones defensivas en montaje + framer-motion useSpring

**Categoría**: Frontend / Accesibilidad / Microinteractions
**Confianza**: 🟢 Alta (implementado, typecheck verde, protecciones explícitas verificadas)

### Qué funcionó

El cursor magnético es un efecto que se rompe feo en mobile/touch (no hay cursor) y rompe accesibilidad si el user opted out de motion. La implementación correcta en `components/ui/magnetic-button.tsx`:

```tsx
const [enabled, setEnabled] = useState(false);

useEffect(() => {
  if (typeof window === 'undefined') return;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setEnabled(hasFinePointer && !reduced);
}, []);

if (!enabled) {
  return <div className={className}>{children}</div>;  // pasthrough sin lib
}
// ... aplicar efecto magnético solo si enabled
```

**3 protecciones**:
1. **`(hover: hover) and (pointer: fine)`** filtra dispositivos touch (mobile, tablets, hybrid). Sin esto, el evento `onMouseMove` se dispara en touch devices y rompe gestos.
2. **`prefers-reduced-motion: reduce`** filtra users con vestibular disorders o que simplemente prefieren menos movimiento. Sin esto, el efecto los molesta o causa motion sickness.
3. **`enabled=false` default** + `useEffect` para activar → renderiza sin lib en SSR (no hydration mismatch).

**Spring config** que funciona bien para cursor magnético:
```ts
const SPRING = { stiffness: 220, damping: 18, mass: 0.4 };
```
- `stiffness: 220` — respuesta rápida (no laggy).
- `damping: 18` — overshoot mínimo (no bouncy).
- `mass: 0.4` — peso bajo, sensación "tirado con elástico fino".
- `strength: 0.28` (28% del delta) — efecto perceptible pero no agresivo.

### Por qué funciona

- **`useSpring` de framer-motion** envuelve un `useMotionValue` con interpolación spring-físico — la suavidad es nativa, no hay que escribir el RAF loop.
- **`matchMedia('(hover: hover) and (pointer: fine)')`** es la query estándar para "este device tiene cursor preciso" — filtra correctamente Apple Pencil, mouse, trackpad, pero NO touch o stylus genérico.
- **El pasthrough en !enabled** es un `<div>` sin listeners → cero overhead en mobile. El bundle de framer-motion se carga igual, pero NO se ejecuta nada motion en esos devices.

### Cómo replicar

Para CUALQUIER microinteracción que dependa del cursor (magnetic, custom cursor follower, hover lights, etc):

```tsx
'use client';
import { useEffect, useState } from 'react';

function useHoverCapability() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const hasFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setOk(hasFine && !reduced);
  }, []);
  return ok;
}
```

Si `!useHoverCapability()` → renderizar versión estática sin efecto.

### Notas

- framer-motion 12.x cambió algunas APIs (`motion()` factory). Para cursor magnético usé el wrapper `motion.div` clásico que sigue funcionando.
- Si querés evitar el costo del bundle de framer-motion para devices que NO van a usarlo, se puede `dynamic(() => import('./magnetic-button'), { ssr: false })` — pero agrega complejidad. Para una sola feature, no vale la pena.
- El cursor magnético sobre el button shadcn pasa por: `<MagneticButton>` (wrapper con listeners) → `<motion.div style={{x, y}}>` (aplica transform) → `<Button asChild>` (slot pattern, no rompe el ref del Link).

---

## 2026-05-28 — Detección pre-cierre de fact inventado: grep antes de mandar a producción me salvó

**Categoría**: Proceso / Honestidad de contenido
**Confianza**: 🟢 Alta (detectado y corregido por mí en runtime, antes de enviar al founder)

### Qué funcionó

Implementando el hero editorial nuevo, escribí en el eyebrow `"{siteName} · desde 1995"`. **Inventé el año 1995**. Antes de cerrar el turno, hice un `grep -rn "1995\|1996\|founded\|fundada\|desde 19"` en `lib/` y `components/` para verificar si el año tenía respaldo en algún archivo del proyecto. **Resultado: solo apareció en mi archivo nuevo** — confirmado que lo inventé.

Corregí en runtime a `"óptica matriculada · 30+ años"` que SÍ está validado en CLAUDE.md y BRANDS.md ("Óptica familiar con 30+ años de historia").

### Por qué funciona

- **Cualquier dato concreto (año, dirección, matrícula, nombre, CUIT) DEBE tener respaldo en un archivo del proyecto**. Si no lo tiene, lo estoy inventando.
- **El grep pre-cierre es barato y devuelve evidencia binaria** (aparece / no aparece). No deja lugar a confusión "creo que era 1995".
- **Funciona como "última red de seguridad"** entre yo y el código que va a producción.

### Cómo replicar

Antes de marcar como completo cualquier UI/copy que incluya un dato concreto:

```bash
grep -rn "<dato exacto>" lib/ components/ app/
```

Si el grep NO encuentra el dato fuera del archivo que acabo de tocar, es candidato a inventado. Reemplazar por:
- Lenguaje placeholder validado (ej "30+ años" en vez de un año específico).
- `[NOMBRE]` / `[AÑO]` / `[CUIT]` si todavía no se sabe.
- O preguntarle al founder.

### Cuándo aplicarlo

- Año de fundación.
- Nombre exacto del/la regente o matriculado (NO inventar, usar `[NOMBRE]` o el dato de `business.regenteName`).
- Direcciones, teléfonos, CUITs.
- Cualquier número específico (cantidad de productos, marcas, sucursales).

### Conexión con MISTAKES

Esta es la regla "NUNCA inventar" reforzada — está en CLAUDE.md sección "Reglas duras del negocio" punto 3 ("no prometemos lo que no podemos cumplir") y en varias entries previas de MISTAKES.md. La regla existe; la red de seguridad operacional (grep pre-cierre) es la práctica que la materializa.

---

## 2026-05-28 — View Transitions API en Next 15 funciona con CSS puro `@view-transition { navigation: auto }` (sin tocar next.config)

**Categoría**: Frontend / Performance / Next.js
**Confianza**: 🟢 Alta (implementado, typecheck verde, fallback elegante verificado)

### Qué funcionó

Para agregar page transitions cinematográficas entre rutas en Next 15, Next ofrece feature experimental `experimental.viewTransition: true` en `next.config.js`. **No la necesitamos**. View Transitions API tiene una variante CSS-only para navegaciones MPA tradicionales (browser-level) que se activa con una sola regla CSS:

```css
@view-transition {
  navigation: auto;
}

::view-transition-old(root) { animation: vt-fade-out 0.35s cubic-bezier(0.4,0,0.2,1); }
::view-transition-new(root) { animation: vt-fade-in 0.35s cubic-bezier(0.4,0,0.2,1); }

@keyframes vt-fade-out { to { opacity: 0; transform: translateY(-8px); } }
@keyframes vt-fade-in  { from { opacity: 0; transform: translateY(8px); } }
```

Esto funciona automáticamente en Chrome 126+, Edge, Safari 18+ (los browsers que soportan view-transitions a nivel de navegación). En browsers viejos, simplemente no anima — el fallback es la navegación normal de Next. **Cero JavaScript agregado, cero configuración**.

### Por qué funciona

- **`@view-transition { navigation: auto }`** le dice al browser: "anda animando todas las navegaciones same-origin con la View Transitions API". El browser captura un screenshot del estado actual (`::view-transition-old(root)`), navega, captura el nuevo estado (`::view-transition-new(root)`), y aplica las animaciones CSS que definamos.
- **Funciona con SPA-style routing de Next?** Sí — Next 15 hace soft navigation que igual dispara la API si está habilitada vía CSS. El RSC streaming es compatible.
- **`experimental.viewTransition` de Next es para casos más avanzados** (per-element transitions con `view-transition-name`, scoped transitions con `unstable_ViewTransition`). Para fade-in/fade-out de page-level, el CSS puro alcanza.

### Cómo replicar

```css
/* En app/globals.css */
@view-transition { navigation: auto; }
::view-transition-old(root) { animation-name: tu-out; animation-duration: 0.35s; }
::view-transition-new(root) { animation-name: tu-in;  animation-duration: 0.35s; }

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) { animation: none !important; }
}
```

### Cuándo escalar a la API experimental de Next

- Transiciones específicas a un elemento (ej: imagen de producto que crece al ir al detalle).
- Estados intermedios complejos con `unstable_ViewTransition` y `view-transition-name` dinámicos.

Mientras tanto, el CSS puro cubre 90% de los casos.

### Notas

- Si una nav es muy rápida (~50ms) el browser puede skippear la animación por optimización. Es feature, no bug.
- View Transitions captura el `<html>` por default. Si querés excluir elementos del snapshot (ej: video que sigue reproduciéndose), usar `view-transition-name: none` en CSS de ese elemento.

---

## 2026-05-28 — Capa 1 de "modernización" cubrible 100% con Tailwind + CSS nativo (sin libs nuevas) — 0 KB extra

**Categoría**: Frontend / Performance / UX
**Confianza**: 🟢 Alta (lote 1 implementado, typecheck verde, 0 dependencias agregadas)

### Qué funcionó

Founder pidió que el sitio se vea "más moderno" pasando 5 refs heterogéneas (Cartier luxury, Cleo fintech, aircenter agency, aimee illustrated, sidewave experimental). Tentación inicial: instalar `framer-motion` (~50KB) + `lenis` (~15KB) para tener spring physics + smooth scroll de calidad agencia. Decisión: **probar primero solo con lo que ya tenemos** (Tailwind 3.4 + `tailwindcss-animate` + CSS nativo + View Transitions API de Next 15).

Resultado lote 1 implementado:
- **Smooth scroll global**: 1 línea CSS (`html { scroll-behavior: smooth }`) + media query `prefers-reduced-motion` que cancela TODO (animations + transitions + scroll smooth).
- **Hover premium en cards**: `transition-all duration-300 ease-out` + `hover:-translate-y-0.5/-translate-y-1` + `hover:shadow-lg/xl` + image-zoom `scale-[1.03]` con duration-500. Se ve como Cleo, performance nativa.
- **Marquee infinito**: keyframe CSS `translateX(0)` → `translateX(-50%)` + items duplicados en JSX. Loop perfecto sin reset visible, pausa-on-hover via `group:hover` selector. ~10 líneas CSS total.

0 KB JavaScript agregado, 0 cambios en bundle, 0 dependencias nuevas, 0 cambios en Core Web Vitals esperados.

### Por qué funciona

- **Tailwind 3.4+ tiene `group/<name>` (named groups)** — permite hover-effects anidados sin colisión con groups parent. Antes había que ser cuidadoso con `group-hover:`; ahora `group/card` + `group-hover/card:` es perfectamente aislable.
- **CSS transitions modernas con `cubic-bezier` defaults (`ease-out`)** son visualmente equivalentes a spring physics de framer-motion para movimientos cortos. La diferencia solo se nota en gestos largos / drag / bouncy specific — que NO es el caso en e-commerce.
- **`prefers-reduced-motion` con `!important` en *::before, *::after** cubre todo el sitio sin tener que pensar caso por caso. Una vez seteado, cualquier nueva animación que se agregue automáticamente respeta el opt-out.
- **Marquee con duplicación + translate-50%** es matemáticamente correcto para loop infinito: cuando el primer set de items terminó de pasar, el segundo set está exactamente donde estaba el primero al inicio → loop sin reset visible.

### Cómo replicar

Para cualquier "modernización" futura:

```
1. Primero probar SOLO con:
   - Tailwind transitions (transition-all, duration-X, ease-X)
   - Tailwind transforms (scale, translate, rotate)
   - tailwindcss-animate (fade, slide, accordion)
   - CSS keyframes inline en globals.css
   - View Transitions API (nativo Next 15)
   - IntersectionObserver (nativo browser)
2. Solo agregar framer-motion / GSAP / Lenis SI después de probar lo anterior
   hay algo específico que no se logra (spring physics complejas, scroll-linked
   animations, stagger con delays variables).
3. NUNCA agregar lib "por si acaso" — cada KB cuenta para Core Web Vitals.
```

### Cuándo aplicarlo

- Capa 2 (diferenciación: hero video editorial, cursor magnético, showcase scroll-driven en producto) — empezar por View Transitions API + IntersectionObserver custom hooks antes de pensar en libs.
- Capa 3 (3D monturas, animación upload IA): acá sí libs (react-three-fiber, framer-motion) son necesarias — pero solo en las páginas específicas, code-splitted.

### Notas

- `group/<name>` requiere Tailwind 3.2+. Tenemos 3.4.14, ok.
- View Transitions API: soporte Chrome/Edge nativo, Safari 18+; fallback elegante (sin transition, layout normal).

---

## 2026-05-28 — `generateStaticParams` + Supabase = env vars NEXT_PUBLIC_* obligatorias en BUILD-time, no solo runtime

**Categoría**: Operación / Deploy Vercel
**Confianza**: 🟢 Alta (build falló sin las vars, pasó con ellas)

### Qué funcionó

Primer deploy a Vercel del repo falló con error críptico durante "Collecting page data": `Error: supabaseUrl is required.` en `app/(storefront)/anteojos-de-receta/[brand]/[product]/page.js` (de `generateStaticParams`). Diagnóstico inmediato: `generateStaticParams` corre **en build-time** para pre-renderizar páginas estáticas, así que ejecuta queries Supabase EN EL BUILD. Si las env vars `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` no están en Vercel ANTES del build, el cliente Supabase tira "supabaseUrl is required" y el build se cae.

Fix: agregar 6 env vars en Vercel Settings → Environment Variables marcadas para los 3 environments (Production / Preview / Development): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `CART_COOKIE_SECRET`, `NEXT_PUBLIC_CHECKOUT_ENABLED=false`. Redeploy sin cache → build pasó.

### Por qué funciona

- **`generateStaticParams` corre en build-time** porque Next 15 quiere pre-generar las rutas dinámicas para SSG. Como esas rutas vienen de DB (listado de productos), necesita conectarse a Supabase durante el build de Vercel.
- **Las env vars NEXT_PUBLIC_* en Vercel se inyectan en build-time Y runtime**. Pero las que no son NEXT_PUBLIC_ (como `SUPABASE_SERVICE_ROLE_KEY`) también deben estar en build-time si las usa cualquier código que se ejecuta durante el build (RSC, generateStaticParams, generateMetadata, sitemap).
- **El sitemap también falla por la misma razón**: el stack trace mostró `.next/server/app/sitemap.xml/route.js` arriba del error porque sitemap también consulta productos en build.

### Cómo replicar

Para cualquier proyecto Next.js + Supabase que vaya a Vercel:

```
# Pre-flight check antes del primer deploy
1. Listar las env vars del .env.local
2. Marcar cuáles se usan en código que corre en build-time:
   - generateStaticParams (rutas dinámicas pre-renderizadas)
   - generateMetadata (SEO en build)
   - sitemap.ts / robots.ts
   - cualquier `force-static` route
3. Esas 100% deben estar en Vercel ANTES del primer deploy.
4. Las runtime-only (webhooks, server actions) pueden agregarse después.
```

### Cuándo aplicarlo

- Cualquier primer deploy a Vercel de un Next.js que toca DB en RSC/SSG.
- Cuando se agregue una nueva env var: revisar si se usa en build-time y, si sí, agregarla a Vercel antes del próximo deploy.

### Notas

- Error message "supabaseUrl is required" es del SDK `@supabase/supabase-js` cuando recibe `undefined` como URL. Engañoso porque suena a "no le pasaste el parámetro" cuando en realidad es "process.env.NEXT_PUBLIC_SUPABASE_URL es undefined en este contexto".
- En dev local nunca pasa porque `.env.local` se carga automáticamente. Es un error solo-prod.

---

## 2026-05-28 — `gh repo create --private --source=. --push` cierra el flow "subir a GitHub" en un solo comando

**Categoría**: Operación / DevOps
**Confianza**: 🟢 Alta (1 ejecución exitosa, pero el comando es estándar y documentado)

### Qué funcionó

Founder pidió subir el proyecto a GitHub para luego importarlo a Vercel. En vez de la secuencia clásica de 4 pasos (crear repo en web UI → `git remote add origin` → `git branch -M main` → `git push -u origin main`), `gh repo create optica-carballo --private --source=. --description "..." --push` hizo TODO en un solo comando: creó el repo en GitHub, configuró el remote, pusheó la branch actual con tracking, en ~2 segundos. Antes del push hice verificación crítica en paralelo: `cat .gitignore` confirmó que `.env*.local` está excluido, y `git ls-files | grep .env` confirmó que solo `.env.example` (template sin secrets) está trackeado. Sin ese check, podríamos haber filtrado API keys reales a un repo aunque privado.

### Por qué funciona

- **`gh repo create` con `--source=.` y `--push`** infiere todo del directorio actual (nombre default = nombre del dir, branch actual = branch a pushear, remote origin = nombre estándar). Elimina pasos manuales propensos a typo (mal-escribir el remote URL, olvidar `-u`, etc.).
- **`--private` por default para proyectos comerciales** es el patrón seguro. Si después se quiere público, cambiar la visibility en GitHub Settings es 1 click. Al revés (público → privado retroactivo) la historia ya fue indexada por scrapers/forks.
- **Pre-flight check de `.gitignore` + `git ls-files | grep .env`** detecta el caso peligroso donde `.env.local` fue commiteado accidentalmente antes de existir el gitignore. Si el grep devuelve archivos, hay que `git rm --cached` + commit ANTES de pushear — una vez pusheado, el secret está en la historia para siempre (aunque se borre después).

### Cómo replicar

Para cualquier proyecto nuevo que necesite subirse a GitHub para luego deployar (Vercel, Netlify, Render):

```bash
# 1. Verificar que no hay secrets trackeados
cat .gitignore | grep -E "env|secret|key"
git ls-files | grep -E "\.env|secrets|credentials"

# 2. Si el segundo grep devuelve algo distinto a templates (.env.example):
#    git rm --cached <archivo> && git commit -m "remove secrets from tracking"

# 3. Crear y pushear en 1 comando
gh repo create <nombre> --private --source=. --description "..." --push
```

### Cuándo aplicarlo

- Cualquier proyecto nuevo que el founder pida subir a GitHub.
- Antes de cualquier push a un repo público con código nuevo, re-correr el grep de pre-flight.

### Notas

- Requiere `gh` CLI autenticado (`gh auth status`).
- El check `git ls-files | grep .env` es ortogonal al `.gitignore`: gitignore protege archivos NUEVOS, pero si un `.env.local` fue agregado al index antes de entrar al gitignore, sigue trackeado. Por eso hay que verificar AMBOS.

---

## 2026-05-28 — MP Checkout Pro V1 rechaza `auto_return: 'approved'` con back_urls localhost

**Categoría**: Operación / Integración MP
**Confianza**: 🟢 Alta (reproducido con error claro y workaround validado)

### Qué funcionó

Al hacer el primer E2E de creación de preference contra sandbox MP usando back_urls de `http://localhost:3000/checkout/...` con `auto_return: 'approved'`, MP devolvió error críptico: `auto_return invalid. back_url.success must be defined`. Las back_urls SÍ estaban definidas. Hipótesis: MP no acepta URLs `localhost` o `127.0.0.1` cuando `auto_return` está presente — requiere URLs públicas accesibles desde el browser del cliente.

Workaround: en `lib/mp/preferences.ts` detectar si `SITE_URL` contiene "localhost" / "127.0.0.1" y omitir `auto_return` en ese caso. En dev → user clickea "Volver al sitio" manual en la UI de MP. En prod con dominio real (`https://opticacarballo.com.ar`) → `auto_return` funciona normal y MP redirige automático.

Re-test con el workaround: preference creada exitosamente, `init_point` y `sandbox_init_point` válidos devueltos.

### Por qué funciona

- **`auto_return` requiere que MP pueda validar las back_urls** como URLs reachables. Localhost no es alcanzable desde el browser del cliente cuando MP redirige post-pago — el dominio no resuelve a la máquina del cliente.
- Sin `auto_return`, MP igual respeta las back_urls (las muestra como botón "Volver al sitio") sin validarlas activamente. Por eso funciona en dev sin `auto_return`.
- **El mensaje de error de MP es engañoso** ("back_url.success must be defined" cuando sí está). El campo que falla en realidad es `auto_return` por las URLs inválidas — pero MP lo reporta como problema con back_urls. Anti-pattern del API que conviene recordar.

### Cómo aplicar

- **Regla**: cuando integremos con servicios externos que requieren callbacks/webhooks/back_urls (MP, Stripe, OAuth providers), siempre testear E2E en dev ANTES de asumir que funciona. Las URLs públicas vs localhost son una clase de bug frecuente.
- **Para MP específicamente**: usar el patrón `isLocalhost ? omit auto_return : include auto_return`. En testing real con webhooks, usar ngrok / tunnel.dev / Vercel preview deploys.
- **Sub-feature 3 (webhook MP)**: el `notification_url` también va a fallar en localhost — MP no puede POSTear a `http://localhost:3000`. Vamos a necesitar ngrok o testear directo en Vercel preview cuando llegue ese momento.

### Relacionado

- [[supabase-js-rompe-inferencia]] — otro caso de error críptico de un SDK externo.
- Sub-feature 3 (webhook MP) — futura, ya advierte sobre el problema.

---

## 2026-05-28 — Pedir AMBOS PDFs al founder antes de decidir entre opciones del mismo proveedor

**Categoría**: Estrategia / Decisión técnica
**Confianza**: 🟢 Alta (caso clarísimo donde la decisión correcta cambió al ver ambos PDFs)

### Qué funcionó

Founder pasó primero el PDF de PAQ.AR v2.0 y preguntó "¿sirve?". Yo arranqué a planear sub-feature LOGISTICA asumiendo PAQ.AR. Después mencionó "API MiCorreo REST.... quizás esta me sirva mejor en mi caso". Le pedí explícitamente el PDF de Mi Correo. Cuando lo pasó, el análisis comparativo reveló que **Mi Correo es estrictamente superior para nuestro caso**: tiene `/rates` (cotización), acepta DNI (sin trámite corporativo), JWT moderno, autoservicio. Los endpoints que PAQ.AR tiene de más (rótulo, tracking, cancelar) son tareas operativas que vienen igual con el portal web — no aportan valor extra para volumen bajo.

**Si hubiera aceptado el primer PDF (PAQ.AR) y arrancado a codear**, hubiera invertido tiempo en una integración inferior + el founder hubiera iniciado un trámite corporativo de 3-6 semanas que no necesitaba.

### Por qué funciona

- **Proveedores grandes ofrecen MÚLTIPLES productos** con APIs distintas (PAQ.AR = corporativo, Mi Correo = PyME / self-service). El founder a veces conoce los nombres pero no qué API encaja con su caso.
- **Comparar features explícitamente** revela trade-offs que no son obvios desde un solo PDF (ej: la falta de `/rates` en PAQ.AR es invisible hasta que ves que Mi Correo lo tiene).
- **Costo de pedir 2do PDF = 30 segundos del founder**; costo de codear la integración equivocada = sesiones perdidas.

### Cómo aplicar

- **Regla**: cuando el founder mencione "tengo el PDF de la API X" para un proveedor que ofrece múltiples productos, preguntar explícitamente: "¿hay otros productos del mismo proveedor que estés evaluando? Pasá los PDFs también, comparo antes de planear código."
- Aplica especialmente a: Correo Argentino (PAQ.AR vs Mi Correo vs eCommerceCorreo), Andreani (B2B Web Services vs PyME), Mercado Pago (Checkout Pro vs Bricks vs Payment Brick).
- **Output del análisis**: tabla comparativa con criterios que importan para nuestro caso (no genéricos). Recomendación clara con justificación.

### Relacionado

- [[la-info-del-agente-no-es-ground-truth]] — el LEARNING anterior sobre validar info de agentes.
- [[acepta-literal-pivot-tecnico-founder-sin-verificar]] (MISTAKES) — el caso PAQ.AR original donde estuve a 1 turno de pedir trámite corporativo innecesario.

---

## 2026-05-28 — La info del agente NO es ground truth; el manual oficial del proveedor sí

**Categoría**: Operación / Verificación de agentes
**Confianza**: 🟡 Media (1 caso confirmado, pero principio general bien establecido)

### Qué funcionó

El agente `argentine-ecom` afirmó que la documentación de PAQ.AR estaba "bajo NDA" y que la API era "notoriamente débil con sandbox poco confiable". Founder me pasó el manual oficial PDF v2.0 (abril 2023) que CONTRADICE parcialmente esto: la documentación SÍ es accesible (founder la consiguió), URLs reales son `apitest.correoargentino.com.ar/paqar/v1` y `api.correoargentino.com.ar/paqar/v1`, endpoints REST estándar con auth por `Apikey` + `agreement` header, y soporta lo básico (alta orden, cancelar, rótulo PDF, tracking, sucursales). Lo del NDA y DX débil quedó relativizado.

Lo que SÍ confirmó el manual del agente: requiere acuerdo comercial con Correo Argentino para obtener `agreement` (id numérico) + `API-Key`. No es API pública abierta para cualquiera.

### Por qué funciona

- **Los agentes especialistas trabajan con conocimiento general, no con la doc específica del proveedor**. Si el founder tiene acceso al material oficial (PDF, login portal, etc.), siempre vale más que la opinión del agente.
- **La info del agente sirve para `desconocidos conocidos`** (qué preguntar, qué proveedores existen, qué patrones típicos). NO para reemplazar la consulta de fuentes primarias cuando están disponibles.
- **Patrón inverso al MISTAKE de PAQ.AR** (aceptar pivot técnico del founder sin verificar): acá el founder verificó el conocimiento del agente con doc oficial. Esto es lo correcto: triangular agentes + docs + experiencia.

### Cómo aplicar

- **Regla**: cuando el agente argentine-ecom (o cualquier agente de dominio) afirma algo sobre un proveedor específico ("la API no es pública", "el DX es malo", "el trámite tarda X"), **tratarlo como hipótesis a validar**, no como hecho.
- Cuando el founder tiene material oficial del proveedor (PDF, portal, contacto comercial), priorizar SIEMPRE eso sobre lo que dijo el agente.
- Si hay contradicción entre agente y material oficial: actualizar el plan según el material oficial, registrar el hallazgo en LEARNINGS (no en MISTAKES — no es error, es info actualizada).
- Para feedback al agente: el [[agent-manager]] puede registrar esto en su próximo review para ajustar la confiabilidad del `argentine-ecom` en temas específicos.

### Relacionado

- [[invocar-argentine-ecom-antes-de-planificar-integracion-logistica]] — el LEARNING original sobre invocar al agente.
- [[acepta-literal-pivot-tecnico-founder-sin-verificar]] (MISTAKES) — el caso anterior donde la verificación llegó tarde.

---

## 2026-05-28 — Invocar `argentine-ecom` ANTES de planificar integración logística salvó iniciar trámite innecesario

**Categoría**: Estrategia / Uso de agentes
**Confianza**: 🟢 Alta (validado con info concreta del agente que cambió decisión)

### Qué funcionó

Founder decidió "shipping con PAQ.AR de Correo Argentino" sin que yo cuestionara la viabilidad técnica. En vez de empezar a codear (o peor, pedirle que inicie trámite corporativo), invoqué al agente `argentine-ecom` para investigar el estado real de la API. El agente reveló: (1) PAQ.AR no tiene API pública — requiere cuenta corporativa + NDA (3-6 semanas); (2) DX de la API es débil incluso cuando la tenés; (3) Andreani sigue siendo mejor opción técnica (ADR-017 vigente); (4) Para volumen inicial (5-20/mes), NO se justifica integrar API — tabla fija + despacho manual es más eficiente. Resultado: founder NO inicia trámite Correo corporativo (ahorro 3-6 semanas + DX hostil), plan pivota a tabla por zonas con migración a Andreani PyME cuando crezca volumen.

### Por qué funciona

- **El founder pide cosas con vocabulario técnico** ("PAQ.AR API") sin necesariamente conocer la realidad operativa actual. Aceptar literal lleva a iniciar trámites largos por nada.
- **Los agentes especialistas tienen conocimiento de dominio** que yo no tengo (logística AR es nicho). Invocarlos como segundo cerebro antes de codear o pedir acciones al founder evita rabbit holes.
- **El costo de invocar un agente es bajo** (~40 segundos en background) vs el costo de iniciar trámites/escribir código en base a supuestos.

### Cómo aplicar

- **Regla**: cuando founder mencione integración técnica con un proveedor argentino (AFIP, MP, Andreani, Correo, banco, etc.) y yo NO tenga conocimiento directo y reciente del estado de su API, invocar `argentine-ecom` ANTES de planear código o pedir credenciales/trámites.
- Aplica también a pivots de scope que dependen de una pieza externa cuya viabilidad no conozco.
- No aplica a decisiones puras de producto/UX (esas las decide el founder, no requieren verificación técnica externa).

### Relacionado

- ADR-017 (Andreani principal + Correo Argentino fallback) — confirmado vigente por el agente.
- Decisión de shipping V1 ajustada en CURRENT_STATE.md ("Próximo paso EXACTO").

---

## 2026-05-28 — `supabase-js` rompe inferencia con `.select('*').maybeSingle().returns<T>()`, hay que enumerar columnas

**Categoría**: Operación / Tipos
**Confianza**: 🟢 Alta (verificado con error explícito de TS)

### Qué funcionó

En `lib/addresses/queries.ts` empecé con `supabase.from('addresses').select('*').maybeSingle().returns<Address>()`. TS marcó error:

```
Type mismatch: Cannot cast array result to a single object.
Use .overrideTypes<Array<YourType>> or .returns<Array<YourType>> for array results
or .single() to convert the result to a single object
```

La fix es **enumerar las columnas explícitamente**:
```ts
.select('id, user_id, label, recipient_name, street, number, apartment, city, province, postal_code, country, phone, is_default, created_at, updated_at')
```

### Por qué funciona

- Con `select('*')`, supabase-js no sabe la cardinalidad inferida y por default tipa como array. `.returns<T>()` luego intenta cast a un singular y rompe.
- Con select explícito + `.maybeSingle()`, supabase-js infiere correctamente que es 1 row o null, y `.returns<T>()` funciona.
- Patrón ya usado en `lib/catalog/queries.ts` (todas las queries enumeran columnas) — esta sesión confirmó la regla.

### Cómo aplicar

- **Regla nueva**: para queries que terminan en `.single()` o `.maybeSingle()` + `.returns<T>()`, NUNCA usar `select('*')`. Enumerar columnas siempre.
- Para queries que devuelven arrays, `select('*')` está OK (ej: `fetchUserAddresses()`).
- Si la lista de columnas crece y enumerar es tedioso, considerar usar los Database types auto-generados (`pnpm db:types`) en vez de un tipo manual, y dejar que TS infiera todo.

### Relacionado

- [[supabase-fk-embeds-tipan-como-arrays]] (LEARNING anterior 2026-05-28).
- Sub-feature 2a addresses (esta sesión).

---

## 2026-05-28 — Zod 4 `z.uuid()` es estricto (RFC 4122 v1-8 + nil + max), no acepta cualquier 36 chars

**Categoría**: Operación / Validación
**Confianza**: 🟢 Alta (verificado contra el regex que Zod 4 imprime en error)

### Qué funcionó

El cart sub-feature 1 usa `z.uuid()` para validar `variantId`. Al smoke-testear con un UUID sintético `00000000-0000-0000-0000-000000000001`, el cart se rendereaba vacío silenciosamente. Debug: Zod rechazaba el UUID porque el regex es:
```
/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/
```

El tercer grupo exige `[1-8]` como primer char (versión RFC 4122), y el cuarto exige `[89abAB]` (variant bits). El UUID sintético tenía `0000` en ambos → rechazado. Las únicas excepciones son nil UUID (todo ceros) y max UUID (todo F).

### Por qué es bueno

- Esta estrictitud es una **defensa-en-profundidad gratis**: cualquier intento de inyectar un variant_id no-UUID en la cookie tampered hace fallar el schema y el cart vuelve vacío silenciosamente.
- Supabase genera UUIDs v4 (cumplen el regex), entonces no hay falsos negativos en producción.
- Antes de Zod 4, `z.string().uuid()` era más permisivo. La migración a `z.uuid()` ya está hecha en este proyecto desde el setup.

### Cómo aplicar

- Para smoke testing manual con UUID sintéticos: usar `00000000-0000-0000-0000-000000000000` (nil) o un UUID v4 generado con `crypto.randomUUID()`.
- Para tests automatizados que necesiten UUIDs determinísticos: prefijar siempre con un version+variant válidos, ej: `00000000-0000-4000-8000-000000000001`.
- Si en algún futuro `z.uuid()` rechaza UUIDs legítimos de algún sistema externo no-RFC-4122 (raro), usar `z.string().regex(/^[0-9a-f-]{36}$/i)` como fallback más permisivo.

### Relacionado

- Cart sub-feature 1 (esta sesión).
- Anti-patrón histórico de "todo en la cookie es confiable" — la combinación HMAC + Zod estricto es la pinza correcta.

---

## 2026-05-28 — La regla "no marcar ✅ sin SELECT" salvó silent gap en 00004

**Categoría**: Operación / Verificación cloud
**Confianza**: 🟡 Media (1 aplicación exitosa de regla nueva — primera vez post-instauración)

### Qué funcionó

En el deploy de migración 00004 al cloud, el founder reportó "Success. No rows returned" y, en sesiones previas, ese reporte verbal hubiera sido suficiente para marcar la fila como ✅. Aplicando la regla nueva instaurada después del cloud-drift de 00002, pedí los 2 SELECTs de verificación antes de tocar `CLOUD_APPLIED.md`. El founder pegó el SELECT de policies (4 filas correctas) pero NO el SELECT del bucket. En vez de asumir "si las policies están, el bucket también", insistí en el bucket por separado.

### Por qué funciona

- **`bucket_id='prescriptions'` en las policies es un string literal, no una FK**. Las policies se crean aunque el bucket falle al insertar. Asumir correlación "si las policies existen, el bucket también" es un anti-patrón silencioso.
- **El costo de pedir el SELECT extra es mínimo** (10 segundos del founder); el costo de un silent gap es perderlo semanas hasta que un upload falle con error críptico de Storage.
- **La regla force-mismatch entre "lo que el founder cree" y "lo que la DB realmente tiene"**, que es justo el patrón que causó el cloud-drift de 00002.

### Cómo aplicar

- En cada deploy futuro de migración a cloud: NO marcar ✅ con menos de N SELECTs de verificación, donde N depende de las "moving parts" de la migración (tablas, funciones, triggers, policies, buckets, sequences). Para una migración pequeña, 2 SELECTs alcanza; para una grande, 4-5.
- Si el founder pega solo PARTE de los SELECTs, pedir explícito los faltantes antes de cualquier acción de cierre. Nunca extrapolar de unos a otros.
- Esta regla aplica también a seeds, no solo a schema.

### Relacionado

- MISTAKES.md 2026-05-28 "Cloud drift de migración 00002" (origen de la regla).
- `supabase/CLOUD_APPLIED.md` (tabla viva que la regla protege).

---

## 2026-05-28 — Extraer al SEGUNDO caso, no al tercero, cuando son archivos completos

**Categoría**: Operación / Código
**Confianza**: 🟢 Alta (validado contra el principio general "tres similares OK")

### Qué funcionó
Cuando iba a duplicar la página de marca y la página de producto para cubrir el lado rx (después de tenerlas funcionando en sol), evalué dos approaches: (a) copy-paste literal, (b) extraer helpers compartidos. Elegí extraer ANTES de duplicar.

Resultado: 4 archivos thin (~30 líneas cada uno) reusando `lib/catalog/{categories,queries,metadata}.ts` y `components/catalog/{brand-page,product-page}.tsx`. La duplicación que evité era ~500 líneas de código casi idéntico. La inversión fue ~300 líneas en helpers + componentes, neto a favor.

### Por qué funcionó (causa real)
El principio universal **"no abstraer prematuramente — tres líneas similares está bien"** asume **líneas**, no archivos completos. Cuando el patrón es de archivos enteros (cada uno con su propia lógica de routing, fetch, render, metadata), aplicar "tres similares OK" significa esperar al tercer archivo = ~1500 líneas duplicadas. Eso es scope creep en vez de simplicidad.

La heurística refinada que aplico: **abstraer al primer "obviamente repetible" si el unit es archivo, función completa o componente. Mantener tres-líneas-OK solo para snippets dentro de un archivo.**

Otra señal de "extraer ahora": cuando el segundo caso va a tener divergencia eventual (sol y rx tendrán copy distinto, schemas distintos, etc.) pero la estructura es estable, encapsular la estructura permite que la divergencia se exprese como datos (config), no como código.

### Evidencia
1 caso esta sesión:
- Si hubiera copy-paste: 500 líneas duplicadas en sol/rx. Cada bug-fix futuro requiere actualizar ambos.
- Con helpers: 30 líneas por archivo, la lógica está en un único lugar.

Y un sub-resultado: el typecheck pasó verde de una vez post-refactor; sol intacto sin tocar el dev manualmente, rx funcionó desde la primera curl. La cohesión del refactor se validó automáticamente.

### Cuándo aplicar esto de nuevo
- **Cuando el unit de duplicación es archivo completo o función larga** (no snippets).
- **Cuando hay configuración que naturalmente describe los casos** (acá: `CATEGORIES.sol` y `CATEGORIES.rx`).
- **Cuando esperás que el patrón se replique más de 2 veces** (en este proyecto: lentes de contacto vendría como tercer categoría con misma estructura).

### Cuándo NO aplica
- Cuando el "segundo caso" parece similar pero tiene fundamentos distintos (es una coincidencia, no un patrón). Forzar abstracción ahí crea acoplamiento falso.
- Cuando todavía no entendés bien la forma del patrón (preferir copy-paste y refactorizar al tercer caso).

### Acción derivada
- [x] Aplicado en `lib/catalog/` con helpers + componentes compartidos.
- [ ] Si llega un tercer caso (ej: `/lentes-de-contacto/[brand]/[product]`), validar que los helpers escalan o si necesitan generalizarse más.
- [ ] Si el patrón se replica 4+ veces sin problemas, considerar agregar a CLAUDE.md como regla: "extraer al segundo caso cuando el unit es archivo/función".

---

## 2026-05-28 — Supabase JS tipa embeds FK 1:1 como arrays — usar `.returns<>()` con tipos manuales

**Categoría**: Código
**Confianza**: 🟢 Alta (problema explícito, fix verificado, patrón replicable)

### Qué funcionó
Cuando se hace una query con embeds tipo `select('..., brand:brands!inner(...), category:categories!inner(...)')`, supabase-js tipa los embeds como **arrays** aunque la FK sea 1:1 (un producto tiene una marca, no muchas). En runtime, PostgREST devuelve objetos, pero TS strict no lo sabe. Síntoma: 10+ errores tipo `Property 'slug' does not exist on type '{ slug: any; }[]'`.

Solución: definir un tipo manual del shape esperado y pasarlo a `.returns<MyType>()`:

```ts
type ProductRow = {
  brand: { slug: string; name: string; ... };
  category: { slug: string; is_active: boolean };
  // ...
};

const { data } = await supabase
  .from('products')
  .select('...')
  .maybeSingle()
  .returns<ProductRow>();
```

### Por qué funcionó (causa real)
PostgREST puede devolver tanto array como objeto según la cardinalidad detectada, y supabase-js no infiere correctamente desde el SQL string del select. El generador `supabase gen types` produce tipos correctos para tablas (`Tables<'products'>['Row']`) pero la inferencia para queries con embeds custom es imperfecta. `.returns<>()` es el escape hatch oficial — no es un hack, es la API documentada.

### Evidencia
1 caso resuelto en esta sesión. Aplicado en 3 lugares: `fetchProduct()`, `generateStaticParams()` (`StaticParamRow`), `sitemap.ts` (`ProductSitemapRow`). Cada uno con su tipo específico, validado por typecheck clean.

### Cuándo aplicar esto de nuevo
- **Siempre que hagas `.select()` con embeds y joins en supabase-js**.
- **Siempre que pretendas usar TS strict (que es el default del proyecto)**.
- Si la query es trivial sin embeds (`select('*')` de una sola tabla), los tipos generados bastan, no hace falta `.returns<>()`.

### Cuándo NO aplica
- Queries sin embeds (`select('id, name').from('brands')`).
- Cuando no necesitás type safety estricta (RSC con `unknown` cast inline — pero eso es peor patrón).

### Acción derivada
- [x] Aplicado en `page.tsx` y `sitemap.ts` de la feature de producto.
- [ ] Replicar en futuras queries con embeds: receta, carrito, órdenes, etc.
- [ ] Considerar crear un helper `lib/supabase/queries/` con queries reusables tipadas — cuando se repita el mismo embed shape 3+ veces.

---

## 2026-05-28 — Verificar estado real del cloud post-aplicación, nunca confiar solo en el reporte verbal

**Categoría**: Operación / Seguridad
**Confianza**: 🟢 Alta (validado por el incidente del cloud drift de la misma sesión)

### Qué funcionó (después del incidente)
Cuando aparece un error como `relation "X" does not exist` al aplicar una migración que depende de otra previa, hay que asumir que la "otra previa" no se aplicó realmente, aunque el tracker la marque como ✅. La verificación correcta es **observar el estado real**, no fiarse del reporte.

Mecanismos de verificación, en orden de preferencia:

1. **MCP de Supabase** (`list_tables`, `execute_sql`) — si el proyecto está bajo la cuenta que tiene la integración MCP activa. Permite SELECT directo sin involucrar al founder.
2. **Pedir al founder un SELECT diagnóstico** y reportar el output literal. SQL sugerido:
   ```sql
   SELECT current_database() AS db,
          count(*) FILTER (WHERE schemaname='public') AS public_tables,
          array_agg(tablename ORDER BY tablename) FILTER (WHERE schemaname='public') AS tables
   FROM pg_tables;
   ```
3. **Verificar la URL del Dashboard** donde se aplicó el SQL (`/project/<id>/sql/...`) coincide con el `id` esperado del proyecto target.

### Por qué importa (causa real)
- El founder puede tener múltiples cuentas de Supabase y aplicar SQL en proyecto incorrecto sin notarlo.
- Una transacción SQL del SQL Editor puede fallar silenciosamente en algunos casos (errores parciales reportados pero asumidos como warnings).
- Marcar ✅ "cloud aplicado" en el tracker por dicho del founder **es una mentira documentada**: hace que el sistema asuma estado que no existe, y todo el trabajo subsecuente se construye sobre arena.
- El blast radius es alto: features futuras que asumen schema, migraciones encadenadas, código de producción que falla en runtime.

### Cuándo aplicar
- **SIEMPRE** después de cada aplicación de migración o seed al cloud, antes de marcar ✅.
- Cada vez que el founder reporta "ya está hecho" sobre algo que afecta cloud.
- Antes de aplicar migración N que depende de la N-1, asumir nada sobre el estado de la N-1.

### Cuándo NO aplica
- Cambios puramente locales (que no afectan cloud).
- Cambios de configuración del Dashboard que no se reflejan en `pg_tables` (ej: customización de email templates) — esos requieren otra forma de verificación.

### Acción derivada
- [x] `CLOUD_APPLIED.md` ahora tiene estado `⚠️ A verificar` para entries no confirmadas (no solo ✅/⏳).
- [x] MISTAKES.md registra el incidente con regla preventiva.
- [ ] Considerar agregar a CLAUDE.md una regla dura: "Toda fila ✅ en CLOUD_APPLIED.md requiere evidencia verificable (output de SELECT, tabla creada, etc.) — no solo dicho."
- [ ] Considerar agregar al skill `/migration` un paso Step 10 obligatorio: "Verificar post-aplicación con SELECT y solo entonces marcar ✅."

---

## 2026-05-28 — `BACKLOG.md` + `CLOUD_APPLIED.md` evitan que pendientes triviales se pierdan en CURRENT_STATE

**Categoría**: Operación / Documentación
**Confianza**: 🟡 Media (1 caso de adopción, validar con uso real en próximas sesiones)

### Qué funcionó
Cuando se acumularon múltiples pendientes chicos (OG image, isotipo transparente, env vars vacías, productos `[PH]`, plazos `[PENDIENTE]` en legales, mejoras de SEO menores), separé en dos archivos dedicados en vez de seguir extendiendo CURRENT_STATE:

- **`BACKLOG.md`** (raíz): pendientes acumulados por categoría (assets, data real, mejoras técnicas, features menores). Cada item tiene contexto + cuándo se agregó. Sección "Hecho" con commit hash/fecha + "Descartado" para histórico.
- **`supabase/CLOUD_APPLIED.md`**: tabla viva de migraciones/seeds aplicados al cloud vs lo que está en `supabase/migrations/`. Resuelve la confusión recurrente de "¿esto ya está en cloud o no?".

### Por qué funcionó (causa real)
CURRENT_STATE creció a >300 líneas porque mezclaba 3 cosas:
1. Estado actual del proyecto (lo que es).
2. Logros recientes (lo que se hizo).
3. Pendientes acumulados (lo que falta).

Las primeras 2 son históricas y específicas de cada sesión. La 3ra es transversal y persistente. Mezclarlas convertía CURRENT_STATE en un dump difícil de escanear.

Separar pendientes a `BACKLOG.md`:
- CURRENT_STATE se mantiene legible (~estado + logros + próximo paso).
- BACKLOG es escaneable por categoría/prioridad y tiene historial de "hecho/descartado".
- Items chicos no se pierden entre features grandes.

`CLOUD_APPLIED.md` resuelve un problema específico (cloud drift) con un tracker mínimo. Más simple que migración tooling (no necesitamos `supabase link` + `db diff` para 2 migraciones).

### Cuándo aplicar
- Cuando aparezca un pendiente "para hacer después" que no es feature completa → `BACKLOG.md`.
- Cuando se aplique cualquier cambio a cloud (migración o seed) → fila nueva en `CLOUD_APPLIED.md`.
- Cuando un item de BACKLOG se haga → mover a "Hecho" con commit hash + fecha.

### Cuándo NO aplica
- Features con planificación propia (skill `/feature` o `/migration`) → siguen en su flujo normal.
- Decisiones de arquitectura → siguen en `DECISIONS.md` con ADRs.
- Bugs activos → siguen en `MISTAKES.md` con causa raíz.

### Acción derivada
- [x] `BACKLOG.md` con secciones por categoría (assets, data real, mejoras técnicas, features menores).
- [x] `supabase/CLOUD_APPLIED.md` con tabla + flujo documentado para próximas migraciones.
- [x] `CLAUDE.md` referencia los dos archivos en "Otros archivos importantes".
- [ ] Validar en 2-3 sesiones más que BACKLOG se mantiene útil y no se vuelve cementerio de items olvidados.

---

## 2026-05-28 — Next 15 usa `apple-icon.png` (no `apple-touch-icon.png`) en `app/`

**Categoría**: Convención del framework
**Confianza**: 🟢 Alta (validado con HTTP 200 vs 404)

### Qué funcionó
La convención de archivos de iconos en Next 15 App Router para `app/` es:
- `app/favicon.ico` → `<link rel="icon">` para favicon clásico.
- `app/icon.{ico,jpg,jpeg,png,svg}` → `<link rel="icon">` general (típicamente 512×512 PWA).
- `app/apple-icon.{jpg,jpeg,png}` → `<link rel="apple-touch-icon">` (típicamente 180×180 iOS).

Lo que NO funciona: `app/apple-touch-icon.png` (nombre histórico HTML, pero no es el reconocido por Next). Sirve HTTP 404.

### Por qué importa
- Tradicionalmente en HTML el meta tag es `<link rel="apple-touch-icon">` y muchos generadores de assets (RealFaviconGenerator, etc.) producen archivos con ese nombre exacto.
- Next 15 abstrae: vos pones el archivo como `apple-icon.png`, y Next genera el meta tag `rel="apple-touch-icon"` automáticamente con `sizes="180x180"` (detectado del archivo) + URL con hash para cache busting.
- Si nombrás el archivo como `apple-touch-icon.png`, Next no lo reconoce y va al 404 handler.

### Evidencia
1 caso resuelto en esta sesión. Síntoma: `/apple-touch-icon.png` → HTTP 404 con 17 KB (página 404 default). Fix: `git mv app/apple-touch-icon.png app/apple-icon.png` + `rm -rf .next` + verificación: HTTP 200 con meta tag `<link rel="apple-touch-icon" href="/apple-icon.png?<hash>" type="image/png" sizes="180x180">`.

### Cuándo aplicar
- Cualquier vez que el founder o un generador externo pase archivos de icon con nombres clásicos HTML.
- Cuando aparezcan 404 al testear `/apple-touch-icon.png` u otras variantes.

### Cuándo NO aplica
- Si los archivos están en `public/` (convención clásica) en vez de `app/`, los nombres originales sí funcionan (Next no los procesa, solo los sirve). Pero perdés la auto-generación de meta tags + cache busting.

### Acción derivada
- [x] Rename aplicado.
- [ ] Cuando founder pase próximos assets, validar nombres contra convención Next.

---

## 2026-05-28 — Estructura `public/` con subdirectorios + README, no carpeta `assets/` en raíz

**Categoría**: Convención del proyecto
**Confianza**: 🟢 Alta (convención estándar de Next.js)

### Qué funcionó
Cuando el founder propuso "crear una carpeta en la raíz del proyecto" para assets (logos, favicon, fotos), redirigí a la convención de Next: **todo va en `public/`**. Cualquier otra carpeta (`assets/`, `static/`) NO es servida por Next sin webpack import.

Estructura adoptada:
- `public/brand/` — logos, isotipo, variantes.
- `public/og/` — imágenes Open Graph 1200×630.
- `public/products/<brand-slug>/<product-slug>/` — fotos de productos.
- `public/favicon.ico` o `app/favicon.ico` — Next 15 soporta ambos, la segunda con auto-meta.
- `public/README.md` — documenta la estructura + reglas de naming, formatos sugeridos, tamaños.

### Por qué importa
- **`public/foo.png` se sirve desde `/foo.png` sin import**. Performance directo (no pasa por webpack).
- **Cualquier otra carpeta requiere `import logo from '@/assets/logo.png'`** — overhead innecesario para imágenes estáticas que solo se referencian por path.
- **Naming organizado** evita el típico `public/logo.png`, `public/logo-old.png`, `public/logo2.png` después de 6 meses.

### Cuándo aplicar
- Cualquier asset estático (imagen, font, PDF, robots.txt, sitemap).
- Cuando el founder o yo proponemos guardar archivos en raíz.

### Cuándo NO aplica
- Imágenes pesadas (>1 MB) o que crecen con el catálogo → Supabase Storage con CDN.
- Assets que requieren transformación (resize, compresión adaptativa) → `next/image` con remote pattern + Storage.
- Imágenes que el usuario sube → siempre Storage, NUNCA `public/`.

### Acción derivada
- [x] `public/README.md` documenta la convención y el uso de `next/image`.
- [ ] Cuando catálogo crezca >50 productos, migrar `public/products/` a Supabase Storage.

---

## 2026-05-28 — Para secrets sensibles (admin keys, service role keys), pedir env var local en vez de pegar en chat

**Categoría**: Operación / Seguridad
**Confianza**: 🟢 Alta (mejor práctica universal de seguridad)

### Qué funcionó
Cuando el founder pidió ejecutar un endpoint que requería `ANTHROPIC_ADMIN_API_KEY` (key administrativo de la organización Anthropic — distinto del key normal de Claude, da control sobre workspaces/miembros/costos), en lugar de pedirle que pegue el valor en el chat, sugerí que lo exporte como env var en su terminal antes de que yo corra el comando: `export ANTHROPIC_ADMIN_API_KEY="..."`. Yo después uso `$ANTHROPIC_ADMIN_API_KEY` en el curl sin que el valor pase por el transcript.

### Por qué importa
El transcript de la conversación se guarda. Cualquier secret pegado ahí queda persistido:
- Visible en historial local de Claude.
- Potencialmente sincronizado si hay backups del transcript.
- Recuperable por terceros que accedan al equipo.

Para keys con blast radius alto (admin, service_role, deploy tokens), la regla es: **el secret nunca pasa por el chat, vive solo en el shell/env local**.

### Cuándo aplicar
- Cualquier admin API key (Anthropic, OpenAI org admin, GitHub PAT, Vercel API).
- Service role keys de Supabase (NUNCA pegar en chat — `.env.local` está gitignored, y para uso ad-hoc, env var del shell).
- DB passwords directas (Supabase cloud, Postgres remotas).
- Deploy tokens / CI secrets.

### Cuándo NO aplica (puede ir en chat)
- Anon keys públicas (las que ya están en `.env.local` y se exponen al cliente browser — `NEXT_PUBLIC_*`).
- IDs (no secrets — el `api_key_id` es solo un identificador, no autoriza nada por sí solo).

### Acción derivada
- [ ] Considerar agregar a CLAUDE.md una regla explícita: "Para secrets con privilegio administrativo, pedir env var local antes que pegar en chat".

---

## 2026-05-28 — Limpiar `.next/` después de mover archivos en `app/`

**Categoría**: Operación
**Confianza**: 🟢 Alta (problema explícito + fix verificado)

### Qué funcionó
Después de mover `app/page.tsx` → `app/(storefront)/page.tsx` para que la home herede el layout del storefront, `pnpm typecheck` falló con `Cannot find module '../../app/page.js'` en `.next/types/validator.ts`. Causa: Next.js genera `.next/types/` con referencias TS al árbol de rutas anterior, y como el archivo cambió de path, las referencias quedaron stale.

Fix de 1 línea: `rm -rf .next && pnpm typecheck`.

### Por qué funcionó (causa real)
Next 15 mantiene un cache de tipos generados (`.next/types/`) que valida rutas estáticamente. Cuando se mueve un archivo de página (especialmente entre layout groups), el path del módulo cambia, pero el cache referencia el path viejo. El typechecker se queja porque el módulo no existe ahí. Limpiar `.next/` fuerza la regeneración con el árbol actual.

### Cuándo aplicar esto de nuevo
- **Después de mover archivos `page.tsx`, `layout.tsx`, `not-found.tsx`, etc.** entre carpetas en `app/`.
- **Después de cambios estructurales en route groups `(name)`** (mover páginas dentro/fuera de un group).
- **Después de renombrar route segments** dinámicos (`[id]` → `[slug]`).
- **Después de borrar páginas**: el cache puede mantener referencias a la ruta vieja.

Si `pnpm typecheck` falla con errores raros de "Cannot find module" después de tocar `app/`, probar primero limpiar `.next/`.

### Cuándo NO aplica
- Cambios solo dentro del contenido de un archivo (no se mueve, no se renombra). Cache se invalida correctamente.
- Cambios en `components/`, `lib/`, `public/`, configs. No afectan el árbol de rutas.

### Acción derivada
- [ ] Considerar agregar a `package.json` un script `clean` (`rm -rf .next`) para que sea más fácil de invocar.
- [ ] Documentar en el skill `/feature` (Step 7 — Testing manual): "Si moviste páginas o cambiaste rutas, `rm -rf .next` antes de validar tipos."

---

## 2026-05-28 — `generateStaticParams` (build time) NO puede usar el cliente Supabase cookie-aware

**Categoría**: Código
**Confianza**: 🟢 Alta (validado con error explícito + fix verificado)

### Qué funcionó (después del bug)
Separar el cliente Supabase en dos: `lib/supabase/server.ts` (cookie-aware, para Server Components que SÍ tienen request scope: Page, generateMetadata, server actions) y `lib/supabase/static.ts` (sin cookies, para contextos sin request: `generateStaticParams`, `sitemap.ts`, `robots.ts`, scripts standalone).

### Por qué funcionó (causa real)
En Next.js 15 App Router:
- **Page Component** y **`generateMetadata`** corren dentro de un request scope cuando se invocan en runtime → tienen acceso a `cookies()`.
- **`generateStaticParams`**, `sitemap.ts`, `robots.ts` corren en **build time o cuando ISR revalida**, no hay request scope → llamar a `cookies()` lanza `Error: cookies was called outside a request scope`.

`@supabase/ssr` `createServerClient` requiere callbacks de cookies. Si el contexto no tiene cookies disponibles, no puede instanciarse. Solución: usar `@supabase/supabase-js` `createClient` directo (sin SSR helpers) en contextos sin request scope. Solo lee con el rol `anon` desde env vars públicas.

### Evidencia
1 caso resuelto en esta sesión. Síntoma: HTTP 500 en `/anteojos-de-sol/rusty`. Stack trace apuntaba a `generateStaticParams` → `createClient` → `cookies()`. Fix immediato y página empieza a responder HTTP 200.

### Cuándo aplicar esto de nuevo
- **Toda función que genere data estática en build**: `generateStaticParams`, `app/sitemap.ts`, `app/robots.ts`, `opengraph-image.tsx`, `icon.tsx` dinámica.
- **Scripts standalone** (seed via TS, migrations programáticas, jobs cron en Edge Functions externos).
- **Cualquier código que corra fuera del servidor Next durante un request HTTP**.

### Cuándo NO aplica
- Page Components, layouts, loading/error/not-found, route handlers (api/) — esos corren en request scope, usar el cliente cookie-aware.
- `generateMetadata` cuando se invoca por una request real (Next docs lo permiten — pero conviene usar el static client si solo se accede a data pública, para evitar overhead innecesario de cookies).

### Acción derivada
- [x] `lib/supabase/static.ts` creado y documentado con JSDoc.
- [x] Usado en `app/(storefront)/anteojos-de-sol/[brand]/page.tsx` (generateStaticParams), `app/sitemap.ts`.
- [ ] Cuando se agregue otra página con generateStaticParams, usar el mismo patrón.
- [ ] Agregar nota en `ARCHITECTURE.md` (sección Supabase) cuando se documente el data layer.

---

## 2026-05-28 — El Step 2 del `/feature` (presentar plan antes de codear) atrapó un mistake de catálogo

**Categoría**: Operación
**Confianza**: 🟢 Alta (validó el valor del workflow, segundo caso de "el plan atrapó algo")

### Qué funcionó
En el Step 2 del skill `/feature` para cargar marcas, presenté un plan basado en las marcas con mejor SEO score (Rusty, Reef, Vulk, Prune, Infinit). El founder leyó el plan y **corrigió antes de tocar código**: las marcas reales son Rusty, Vulk, Reef, Mormaii y Paula Cahen D'Anvers. Si hubiera saltado directo a código, habría escrito un seed con Prune e Infinit (no en stock) y omitido Mormaii (no estaba siquiera en BRANDS.md). Cero código fue desperdiciado porque el ciclo "presentar plan → recibir corrección → ajustar plan" capturó el error en segundos.

### Por qué funcionó (causa real)
El Step 2 del `/feature` obliga a hacer explícitos los **supuestos del implementador** (qué marcas, qué scope, qué decisiones). Cuando son explícitos, el founder puede aceptar o corregir. Cuando quedan implícitos (saltarse directo a código), las decisiones se imponen al founder vía commits que ya existen y hay que rollback.

Es la misma lógica que el `[Lo que este step NO incluye]` registrado el 2026-05-27: **hacer explícitos los supuestos en planes escritos previene re-trabajo más caro después.**

### Evidencia
2 casos ahora:
1. 2026-05-27 (setup Next.js): la lista explícita "NO incluye" mantuvo el scope.
2. 2026-05-28 (catálogo marcas): el plan con marcas listadas dejó al founder corregir antes de codear.

Ambos siguen el patrón: hacer explícito en el plan permite al founder dar feedback temprano y barato.

### Cuándo aplicar esto de nuevo
- **Cualquier feature que toque catálogo, precios, copy, contenido editorial o datos del negocio**: presentar la data candidata explícita en el plan (no solo decir "voy a cargar marcas argentinas top").
- **Cualquier feature donde el asistente está infiriendo decisiones del negocio**: listar las inferencias para que el founder las vea.

### Cuándo NO aplica
- Features puramente técnicas (refactoring, fix de bug, ajuste de tsconfig) donde no hay decisiones de negocio.
- Cuando el dato candidato es obvio o ya está documentado de manera autoritativa (no inferido).

### Acción derivada
- [x] Confirmar este learning con un 2do caso → ahora con 2 casos. Subido a 🟢 Alta confianza.
- [ ] Promoverlo a regla explícita en el skill `/feature` Step 2: "Si la feature toca datos del negocio, listar los datos candidatos explícitamente en el plan, no solo describir 'voy a cargar X'."
- [ ] Replicar en `/article` (datos candidatos: ¿qué artículo, qué keyword, qué hipótesis?), `/product` (productos exactos), `/migration` (tablas y columnas exactas).

---

## 2026-05-28 — `docker exec` como fallback cuando `psql` no está instalado localmente

**Categoría**: Operación
**Confianza**: 🟢 Alta (patrón estándar, funciona out-of-the-box)

### Qué funcionó
Cuando había que ejecutar SQL ad-hoc para verificar el schema aplicado (consultas a `pg_tables`, `pg_policies`, `pg_indexes`, smoke tests con `SET ROLE anon`), descubrí que `psql` no estaba instalado en el sistema del founder. En vez de pedirle que lo instale, usé `docker exec supabase_db_optica-carballo psql -U postgres -d postgres -c "..."` — el contenedor de Supabase ya trae psql incluido, y el founder solo necesitaba Docker corriendo (que ya tenía).

### Por qué funcionó (causa real)
El contenedor Postgres oficial trae el cliente `psql` además del server. Cuando Supabase local está corriendo, ya tenés psql disponible vía `docker exec` sin instalar nada adicional. Esto es **invisible para muchos workflows** porque la gente asume que necesita instalar psql en el host, pero la mayoría de los casos pueden resolverse usando el cliente del contenedor.

### Evidencia
1 caso resuelto en esta sesión. 7 consultas SQL ejecutadas sin haber instalado psql.

### Cuándo aplicar esto de nuevo
- Smoke tests post-migración, queries de inspección de schema, role tests.
- Cualquier momento que necesite SQL ad-hoc y haya un contenedor Postgres corriendo.
- Reemplaza a instalar `postgresql-client` con brew/apt solo para esto.

### Cuándo NO aplica
- Si necesitás psql sin que haya un contenedor corriendo (ej: conectarte a una DB remota desde scripts de CI).
- Si necesitás features de psql que requieren archivos locales (`\i archivo.sql` desde el host) — `docker cp` ayuda pero suma fricción.

### Acción derivada
- [ ] En el skill `/migration` Step 9 (Verificar post-deploy), mencionar `docker exec <container> psql` como alternativa cuando psql no está instalado.

---

## 2026-05-28 — Trabajo largo en background + presentación de decisiones al founder en paralelo

**Categoría**: Operación
**Confianza**: 🔵 Hipótesis (1 caso, validar más)

### Qué funcionó
Cuando había que arrancar `supabase start` (que la primera vez descarga ~1 GB de imágenes Docker y tarda 5-10 minutos), en vez de bloquear esperando, lancé el comando con `run_in_background` y en el **mismo turno** seguí trabajando: generé el archivo de migración con `supabase migration new`, escribí el SQL completo (250 líneas), y presenté al founder un resumen estructurado de las decisiones del schema en formato tabla (qué decisión + por qué). Cuando Docker terminó (vía notificación), el plan ya estaba 80% adelantado.

### Por qué funcionó (causa real)
Las operaciones lentas no son CPU-bound del asistente — son network/IO externos. Bloquear el turno esperando es desperdicio. El patrón es **mover trabajo del founder al espacio mientras espera la máquina**: en lugar de "Docker está descargando, esperá", al founder le llega "Docker descargando + acá las 12 decisiones del schema para que revises mientras tanto". Productividad paralela.

### Evidencia
1 caso confirmado (esta sesión). Founder no quedó esperando — pudo revisar el SQL mientras la infraestructura se preparaba.

### Cuándo aplicar esto de nuevo
- **Cualquier comando que tome >30 segundos**: `supabase start`, `pnpm install` grande, builds largos, `gh repo create` con remote setup, descarga de modelos, etc.
- **Cuando el output del comando no se necesita para el siguiente paso inmediato**: lanzar en background y avanzar.

### Cuándo NO aplica
- Cuando el siguiente paso depende del resultado (no se puede paralelizar).
- Cuando el comando puede fallar de forma silenciosa: ahí conviene esperar y validar el exit code.
- Cuando un fallo en el background invalida el trabajo paralelo (ej: si Docker no arranca, escribir el SQL no fue inútil pero no se puede aplicar).

### Acción derivada
- [ ] Confirmar con 2+ casos más antes de promover a 🟢 Alta confianza.
- [ ] Si se confirma: documentar como patrón explícito en el skill `/feature` (Step 3) y `/migration` (Step 7).

---

## 2026-05-27 — `setAll` callbacks de @supabase/ssr necesitan tipado explícito con TS strict

**Categoría**: Código
**Confianza**: 🟢 Alta (afecta cualquier proyecto Next + Supabase + TS strict)

### Qué funcionó
Cuando el typecheck falló con 10 errores `implicitly has an 'any' type` en los callbacks `setAll` de `lib/supabase/server.ts` y `lib/supabase/middleware.ts`, la fix fue: importar `CookieOptions` de `@supabase/ssr`, definir un type alias local `type CookieToSet = { name: string; value: string; options: CookieOptions }` y tipar el parámetro del callback explícitamente.

### Por qué funcionó (causa real)
Las firmas de tipo en `@supabase/ssr` para las opciones de cookies usan generics flexibles que TypeScript no puede inferir desde el contexto del object literal en `cookies: { setAll(...) }`. En modo `strict: true` con `noImplicitAny`, el callback queda con parámetro `any` y el compiler lo flaggea. Es expected behavior, no un bug — `strict` es más estricto que la inferencia default.

### Evidencia
1 caso resuelto en esta sesión. Patrón repetido en server.ts y middleware.ts, idéntica solución.

### Cuándo aplicar esto de nuevo
- **Siempre que se cree un cliente Supabase server/middleware en Next.js con TS strict** (que es nuestro default).
- **Cualquier callback de librería externa** que TS no infiere con strict: usar import de tipos públicos + type alias local antes que `as any` o `// @ts-ignore`.

### Cuándo NO aplica
- Si se baja la estrictez del tsconfig (NO recomendado en este proyecto — ya fijado en ADR-001 + setup).
- Si la librería actualiza sus tipos en el futuro para mejor inferencia (`@supabase/ssr` 0.5.x todavía requiere esto).

### Acción derivada
- [x] Aplicado en `lib/supabase/server.ts` y `lib/supabase/middleware.ts`.
- [ ] Cuando se agreguen más helpers Supabase, usar el mismo patrón.

---

## 2026-05-27 — Tarball CLI = directorio dedicado + symlink, no archivos sueltos en PATH

**Categoría**: Operación
**Confianza**: 🟢 Alta (validado por el propio mensaje de error del CLI)

### Qué funcionó (después del mistake)
Cuando un CLI se distribuye como tarball con múltiples archivos (shim + binario real, o ejecutable + archivos de soporte), el patrón correcto es:
1. Extraer el tarball en `~/.local/share/<tool>/` (un dir dedicado).
2. Symlink el ejecutable principal: `ln -sf ~/.local/share/<tool>/<tool> ~/.local/bin/<tool>`.
3. NUNCA extraer en `/tmp` y mover archivos sueltos a `~/.local/bin/`.

### Por qué funcionó (causa real)
Muchos CLIs modernos (Supabase, gh CLI multi-binario, herramientas con assets, etc.) **necesitan que sus archivos cohabiten en el mismo directorio** para funcionar. Si los separás, el ejecutable pierde sus dependencias laterales.

### Evidencia
- Supabase CLI: el shim `supabase` busca `supabase-go` en el mismo directorio. Sin el segundo, falla con mensaje explícito.
- gh CLI: usa `bin/gh` + `share/gh/extensions/` — separarlos rompe extensions.
- k9s, mc, otras herramientas con configs/templates: idem.

### Cuándo aplicar esto de nuevo
- Cada vez que instalo un CLI desde tarball/zip en `~/.local/`.
- En scripts de bootstrap de máquinas nuevas.

### Cuándo NO aplica
- Binarios verdaderamente autocontenidos (Go binaries con `go install`, Rust binaries con `cargo install`).
- Cuando hay un instalador oficial (brew, apt, etc.).

### Acción derivada
- [x] Supabase CLI instalada con este patrón.
- [ ] Si vienen más CLIs (deno, gh, sb, etc.): aplicar el mismo patrón.

---

## 2026-05-27 — Founder ejecuta cosas en paralelo durante sesiones largas (segundo caso)

**Categoría**: Operación
**Confianza**: 🟡 Media (2 confirmaciones — patrón emergente)

### Qué funcionó (observación)
Mientras yo instalaba Supabase CLI y creaba el scaffold, el founder en paralelo creó `.env.local` con las credenciales reales del proyecto Supabase cloud (mtime 23:48, post-inicio de sesión). Lo detecté en el `ls` después de `pnpm build` cuando Next mencionó "Environments: .env.local".

### Por qué importa
Ya pasó dos veces:
1. Sesión 1 (validación inicial): los 15 skills ya estaban en disco aunque CURRENT_STATE.md decía que no.
2. Sesión actual: `.env.local` apareció a mitad del setup con credenciales reales.

El founder trabaja en paralelo a las acciones del asistente. **No es un problema en sí**, pero significa que el estado del disco puede cambiar entre comandos del asistente. Lección: **chequear timestamps y re-listar directorios clave cuando el resultado de un comando no coincide con la suposición previa.**

### Cuándo aplicar esto
- Antes de generar archivos importantes (ej: `.env.local`), `ls -la` primero para ver si ya existe.
- Antes de validar criterios de éxito, re-listar el dir.
- Cuando un comando da output inesperado ("Environments: .env.local" cuando no creé `.env.local`), investigar antes de seguir.

### Acción derivada
- [ ] Si se confirma 1 vez más (3 casos): incorporar al skill `/feature` como sub-tarea de Step 3: "Antes de generar archivos nuevos, re-listar el dir target para detectar cambios paralelos del founder."

---

## 2026-05-27 — Verificar pre-requisitos del entorno ANTES de aprobar el plan, no después

**Categoría**: Operación
**Confianza**: 🔵 Hipótesis (1 caso, validar más)

### Qué funcionó (parcialmente)
En el Step 2 del skill `/feature` listé los pre-requisitos del entorno (Node, pnpm, Docker, Supabase CLI) como una tabla dentro del plan. Eso fue **necesario pero no suficiente**: cuando el founder dijo "avanza" y arranqué el Step 3, la primera verificación detectó que faltaban 3 de 4 herramientas. Tuve que pausar inmediatamente, que es lo correcto, pero el founder había aprobado un plan sin saber que su entorno no estaba listo.

### Qué hubiera funcionado mejor
**Verificar los pre-requisitos en disco durante el Step 1 (Entender)**, antes de presentar el plan. Si faltan, el primer turno del flujo `/feature` debería ser: "Para esta feature necesitás X, Y, Z. Verifiqué y faltan X y Y. Antes de planear el resto, instalalos. Acá van los comandos."

### Por qué importa
Listar pre-requisitos en el plan es documentación; verificarlos antes es **fail-fast**. La diferencia es de minutos pero también de UX: el founder aprueba un plan creyendo que está listo para ejecutar, después se entera que no. Eso erosiona confianza en el sistema de planning.

### Acción derivada
- [ ] Agregar al skill `/feature` (Step 1 — Entender): "Si la feature toca herramientas del entorno (CLIs, runtimes, servicios locales), verificar su presencia en disco ANTES de pasar al Step 2."
- [ ] Considerar extender a otros skills con dependencias de entorno: `/migration` (requiere supabase CLI), `/deploy` (requiere vercel CLI o gh CLI).

### Cuándo NO aplica
- Features de solo edición de archivos existentes que no requieren tooling nuevo (texto, copy, ajustes de meta tags).

---

## 2026-05-27 — Sección explícita "Lo que este step NO incluye" en el plan previene scope creep

**Categoría**: Operación
**Confianza**: 🔵 Hipótesis (1 caso, validar más)

### Qué funcionó
En el Step 2 del skill `/feature` para el setup inicial del repo Next.js, además de listar archivos a crear/modificar, dependencias y riesgos, agregué una sección final **"Lo que este step NO incluye (explícito, para evitar scope creep)"** con 7 ítems concretos (auth flow, schema DB, integraciones MP/Resend/IA, componentes UI reales, PWA, sitemap, CI/CD). Esto fija el perímetro del trabajo y le da al founder una herramienta clara para validar si el plan está bien alcanzado o si está pidiéndome más de lo que dije.

### Por qué funcionó (causa real)
Los planes técnicos tienden a crecer durante la ejecución porque "ya que estamos" es seductor. Listar explícitamente lo que NO se hace convierte el silencio (omisiones tácitas) en compromiso (omisiones explícitas) — y le da permiso al asistente de parar cuando algo cae fuera del scope, en lugar de "aprovechar" para agregarlo. Es el mismo principio que las preconditions en contratos: "este step asume X, no resuelve Y".

### Evidencia
1 caso confirmado (esta sesión, 2026-05-27). Producto: plan del setup quedó claramente acotado a andamiaje, sin contaminarse con features que serán steps posteriores.

### Cuándo aplicar esto de nuevo
- **Siempre** en el Step 2 del skill `/feature`, sin importar el tamaño de la feature.
- En el skill `/migration` cuando se diseñe schema (qué tablas SÍ vs qué tablas NO).
- En el skill `/product` cuando se cargue producto (qué campos SÍ vs qué campos quedan para después).
- En cualquier plan que abarque múltiples sesiones.

### Cuándo NO aplica
- Features triviales de una sola sesión donde el scope es obvio (ej: cambiar un texto, ajustar un meta tag).
- Skills correctivos (`/debug`, `/onpage-optimization`) donde el scope ya viene definido por el problema.

### Acción derivada
- [ ] Confirmar este learning con 2+ casos más antes de promoverlo a 🟢 Alta confianza.
- [ ] Si se confirma 3+ veces: agregar al template del Step 2 del skill `/feature` (sección obligatoria "Lo que NO incluye").
- [ ] Considerar replicar en plantillas de otros skills mencionados.

---

## 2026-05-27 — Sesión de validación al inicio destapa desincronización de docs

**Categoría**: Operación
**Confianza**: 🔵 Hipótesis (1 caso, validar más)

### Qué funcionó
Iniciar la sesión con una **tarea de validación explícita** —listar agentes en disco, listar skills en disco, leer CLAUDE.md y CURRENT_STATE.md, y resumir— en lugar de arrancar directo a codear. El cruce entre "lo que dice la doc" y "lo que hay en disco" expuso que CURRENT_STATE.md declaraba Entrega 4 pendiente cuando ya estaba completa.

### Por qué funcionó (causa real)
La validación obliga a **comparar dos fuentes de verdad** (doc vs disco). Sin ese cruce, el asistente habría confiado en la doc y propuesto "empezar Entrega 4" — duplicando trabajo o generando confusión. Es el mismo principio que la regla "antes de recomendar desde memoria, verificá": las descripciones envejecen, el estado actual no miente.

### Evidencia
1 caso confirmado en esta sesión (2026-05-27). El founder específicamente pidió este patrón ("validá que tenés acceso a todos los archivos del sistema").

### Cuándo aplicar esto de nuevo
- Al inicio de **cualquier sesión** después de un gap de tiempo (>1 día sin tocar el proyecto).
- Cuando la sesión anterior haya generado muchos archivos nuevos.
- Antes de tomar decisiones que dependen del estado declarado en `CURRENT_STATE.md`.

### Cuándo NO aplica
- Sesiones consecutivas sin cierre (continuación inmediata): el estado en memoria de contexto basta.
- Tareas triviales aisladas que no dependen del estado del sistema.

### Acción derivada
- [ ] Considerar agregar a CLAUDE.md como regla 11: "Al iniciar sesión, además de leer CURRENT_STATE.md y MISTAKES.md, cruzar contra `ls .claude/agents/` y `ls .claude/skills/` para detectar desincronizaciones."
- [ ] Confirmar este learning con 2+ casos más antes de promoverlo a 🟢 Alta confianza.

---

# Template para agregar learnings

```markdown
## YYYY-MM-DD — [Descripción corta]

**Categoría**: Código | Producto | SEO | Conversión | IA | Contenido | Operación
**Confianza**: 🟢 Alta (3+ confirmaciones) | 🟡 Media (1-2 confirmaciones) | 🔵 Hipótesis (1 caso, validar más)

### Qué funcionó
[Descripción del approach/decisión/táctica]

### Por qué funcionó (causa real)
[Mecanismo subyacente, no solo "porque sí"]

### Evidencia
[Datos, métricas, casos concretos que validan el learning]

### Cuándo aplicar esto de nuevo
[En qué contextos/situaciones reaplicar — y cuándo NO aplica]

### Cuándo NO aplica
[Límites del learning — para no sobre-generalizar]

### Acción derivada
- [ ] Documentado en CLAUDE.md como regla permanente
- [ ] Incorporado en agente: [nombre]
- [ ] Convertido en skill: [nombre]
- [ ] Aplicado en otras áreas del proyecto
```

---

# Categorías de learnings a buscar activamente

### Código
- Patrones de componentes React que se reusan bien.
- Queries Supabase que escalan.
- Estructuras que evitan bugs típicos.

### Producto
- Combinaciones de productos que cross-sellean.
- Diseños de página que convierten.
- Flujos de checkout que funcionan.

### SEO
- Estructuras de artículo que rankean rápido.
- Tipos de internal linking que distribuyen autoridad.
- Meta tags con CTR alto.
- Patterns de schema.org que generan rich results.

### Conversión
- CTAs que convierten más.
- Posicionamientos de precio/cuotas que reducen abandono.
- Trust signals que funcionan en óptica argentina específicamente.

### IA
- Prompts robustos a injection.
- Patrones de RAG que reducen alucinaciones.
- Casos donde Haiku basta vs cuando se necesita Sonnet.

### Contenido
- Tipos de hook que mantienen atención.
- Estructuras de FAQ que generan featured snippets.
- Tonos que conectan con la audiencia argentina.

### Operación
- Procesos del sistema que reducen errores.
- Coordinaciones entre agentes que producen mejores outputs.
- Cuándo el `agent-manager` agregó más valor.

---

# Hipótesis a validar con learnings

Lista de cosas que SUPONEMOS van a funcionar (basado en mejores prácticas) pero **necesitan validación con datos reales**:

1. **Páginas de marca argentina rankearán fácil** (diff <10 según research).
2. **El lector de receta IA aumentará conversión >20%** en compras con receta.
3. **WhatsApp prominente en productos complejos** mejora conversión total.
4. **Pillar + clusters dan más autoridad** que artículos aislados.
5. **Cuotas sin interés visibles en card** aumentan add-to-cart.
6. **Reviews con foto** convierten 2x más que reviews texto solo.
7. **Asistente IA con productos del catálogo embebidos** convierte más que solo texto.
8. **E-E-A-T explícito** en artículos de salud (byline + revisor) mejora ranking.

Cada hipótesis confirmada → entrada en este archivo.
Cada hipótesis refutada → entrada en MISTAKES.md con la razón.

---

# Convertir learnings en sistema

Cuando un learning alcanza 🟢 Alta confianza (3+ confirmaciones independientes):

1. Evaluar si merece estar en CLAUDE.md como regla permanente.
2. Si afecta a un agente específico, incorporar en su prompt.
3. Si es un patrón repetible, crear un skill.
4. Aplicar proactivamente en otras áreas similares del proyecto.

---

# Reconocimientos al sistema

Cuando algo no-obvio del sistema agregó valor explícito (no las cosas básicas), se registra acá. Sirve para no romper lo que funciona.

(Vacío al inicio)

---

## 2026-05-30 — Decodificar identidad de producto desde el título de ML cuando la API no está disponible

**Categoría**: Import de productos / Resiliencia
**Confianza**: 🟢 Alta (resolvió el caso Revo Blue sin API)

### Qué funcionó

Founder pasó link ML de una variante nueva. La API de ML estaba caída para mí (403 público + token OAuth vencido + scraping interstitial). En vez de bloquearme esperando re-auth del founder, decodifiqué la identidad completa del producto desde el título del listing: "Rusty Yau MBLK Revo Blue Polarizado Yellow" → armazón negro mate (mismo que la variante existente), par principal azul espejado polarizado, par amarillas común. Usando el seed de la variante previa (10_rusty_yau) como mapa, identifiqué que el 90% de los datos (descripción, atributos, callouts, medidas) son compartidos a nivel producto y YA existían. Reduje lo que necesito del founder a 5 datos puntuales (SKU, precio, stock, fotos, model_code).

### Por qué funcionó

El título de un listing ML está estructurado con el código de modelo del fabricante (MBLK = negro mate, etc.) — es data parseable, no marketing. Y para variantes de un producto ya cargado, la mayoría del contenido es compartido. Combinando ambas cosas, la API de ML es un nice-to-have (autocompleta precio/stock) pero NO un bloqueante para avanzar.

### Regla preventiva

Al importar una variante de un producto YA existente:
1. **Leer primero el seed de la variante previa** — identificar qué es compartido (producto) vs específico (variante).
2. **Decodificar la identidad desde el título de ML** usando la nomenclatura ya documentada en el seed previo.
3. **Si la API de ML no responde**, NO bloquear — pedir al founder solo el delta puntual (SKU, precio, stock, fotos). No esperar re-auth de OAuth para algo que no lo necesita.

### Cuándo aplicar

- Import de variante N+1 de un modelo ya cargado.
- NO aplica a producto totalmente nuevo (ahí sí falta todo el contenido base y la API ahorra más).

## 2026-05-30 — Pegar endpoints admin a PRODUCCIÓN cuando localhost apunta a otra DB

**Categoría**: Integración ML / Debugging de entornos
**Confianza**: 🟢 Alta (desbloqueó el fetch de MLA1432121317)

### Qué funcionó

Tras renovar el token OAuth de ML (founder re-autorizó en prod), mi dev server local seguía devolviendo `no_integration` al pegarle a `/api/admin/ml-me` y `/api/admin/ml-import-preview`. Causa: el `.env.local` apunta a una DB/encryption-key distinta de producción, así que el token que guardó el callback de prod NO está en la DB que lee mi localhost.

Solución: como los endpoints `/api/admin/ml-*` son temporales y NO tienen auth ("Sin auth iter 1"), los pegué **directo a producción**: `curl https://opticacarballo.com.ar/api/admin/ml-import-preview/MLA1432121317`. Eso lee la DB de prod con su token recién renovado y devolvió el JSON crudo del item (precio 103902, available_quantity 0, pictures, etc.) sin tocar el entorno local.

### Por qué funcionó

El token vive en la DB de producción (Supabase cloud del sitio live), no en mi entorno local. El endpoint corre server-side en Vercel, donde las env vars SÍ matchean esa DB. Pegarle al endpoint de prod = ejecutar el fetch desde el contexto correcto.

### Regla preventiva

Cuando un endpoint admin sin-auth devuelve `no_integration` / `not_found` en localhost pero el founder acaba de autorizar/configurar algo en producción:
1. **No asumir que el token está roto** — primero descartar mismatch de entorno (`.env.local` ≠ env de Vercel).
2. **Pegarle al endpoint de PRODUCCIÓN** directamente. Si funciona ahí, el problema era de entorno, no de datos.
3. Aplica SOLO a endpoints sin auth (los `/api/admin/ml-*` temporales). Cuando tengan auth (Sprint 3), repensar.

### Cuándo aplicar

- Debugging de integraciones cuya credencial/estado vive en la DB de prod.
- NO usar para operaciones de ESCRITURA contra prod sin confirmar con founder — esto fue solo lectura.

## 2026-06-05 — Bracketing de scale en vez de iterar un valor por vez

**Categoría**: UX de catálogo / proceso de ajuste de imágenes
**Confianza**: 🟡 Media (observación de proceso, no validada con segundo caso aún)

### Qué pasó

El scale del Esvep tomó 4 iteraciones de ida y vuelta con el founder: 1.6 ("chica") → 2.0 ("muy grande") → 1.8 ("un poco más chico") → 1.7. Cada ronda fue un solo valor, mirar el grid, ajustar. Lento de converger y cada ronda dispara un turno completo.

### Qué hubiera funcionado mejor

Cuando un scale "rebota" (chica → grande), en vez de proponer un único valor intermedio y esperar, **ofrecer un bracket visual**: "te dejo 1.65 / 1.75 / 1.85, ¿cuál?". El founder elige una vez y converge en 1 ronda en lugar de 3. Especialmente para fotos de aspect ratio raro (Esvep 1000×491 2:1) donde el scale "correcto" no es predecible desde el tipo de producto.

### Regla preventiva

A la 2ª iteración de scale del mismo producto (cuando ya rebotó entre chico y grande), cambiar de "propongo un valor" a "propongo un bracket de 3 y elegís". No seguir iterando de a uno.

### Cuándo aplicar

- Ajuste de `image-scale-overrides.ts` que ya tuvo ≥2 rondas sin converger.
- NO aplica a la primera propuesta de scale (ahí va el valor único comparado contra el grid, regla 15 sub-regla).

## Notas finales

- Este archivo se actualiza automáticamente al cerrar sesión cuando hay learnings significativos (vía hook en `settings.json`).
- También se actualiza manualmente cuando el founder o el sistema detectan algo digno de documentar.
- Si el log crece mucho y se vuelve difícil de navegar, el `agent-manager` propondrá consolidación en `/agent-review`.
