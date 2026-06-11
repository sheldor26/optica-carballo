# Óptica Carballo — CLAUDE.md

## Qué es este proyecto

**Óptica Carballo** es un e-commerce de óptica con venta a todo Argentina. La idea es construir algo moderno, diferenciado y con foco fuerte en IA como herramienta real (no gimmick), atacando un nicho donde la competencia local es débil en SEO, UX y tecnología.

Objetivo: ser **la óptica online más confiable y técnicamente avanzada de Argentina**.

## Quién soy yo (el founder)

**Juan Carballo** — Técnico Superior en Óptica y Contactología. Hijo del dueño. Manejo la parte digital de la empresa familiar (30+ años de historia). Mi mamá, **María Carlota Carballo**, es la óptica regente matriculada.

**Importante**:
- Soy **no-técnico** en programación. Tomo decisiones de producto y dirección.
- Vos ejecutás. Cuando hay un tradeoff técnico, lo explicás simple y preguntás antes de proceder.
- Tengo otros proyectos en paralelo (NeuralRouting.io, productosvirales.com.ar). Conozco mi tendencia a pivotear cuando algo se estanca — no dejes que abandone Óptica Carballo sin justificación válida.
- Trabajo en español argentino. Toda la comunicación es en español argentino.

## Reglas core (siempre se aplican)

1. **Leé `CURRENT_STATE.md` al inicio de cada sesión** antes de hacer cualquier cosa.
2. **Leé `MISTAKES.md`** para no repetir errores conocidos.
3. **Antes de escribir código**: explicá la tarea, listá archivos afectados, marcá riesgos.
4. **Antes de tomar una decisión técnica importante**: consultá `DECISIONS.md`. Si ya está decidido, no lo cuestiones — aplicá. Si no está, proponé y pedí aprobación.
5. **Preferí simple sobre clever**. Siempre.
6. **No introducir librerías nuevas sin preguntar primero**.
7. **No tocar configs de seguridad / pagos / RLS sin verificar dos veces**.
8. **Mobile-first en todo**. Diseñar para mobile, después adaptar a desktop.
9. **Español argentino consistente** en todo el sitio. Sin "tú", sin "ordenador", sin "móvil" — usar "vos", "computadora", "celular".
10. **Hreflang es-AR** siempre. Nunca `es` solo.
11. **Cierre de docs: prohibido "⏭️ Pendiente" / "⏭️ Sin entry"**. Si no hay novedad documentable en LEARNINGS/MISTAKES, escribir explícito "Revisado — sin novedad: [razón breve]". Estado en curso/esperando validación ES estado documentable. Regla escalada desde MISTAKES.md tras 6 violaciones en sesión 2026-05-30.
12. **Cierre de docs: distinguir ✅ vs ⚪**. ✅ = archivo modificado en commit de este turno (verificable en git diff). ⚪ = archivo revisado pero no modificado (decisión consciente, sin novedad). NO usar ✅ para archivos que no fueron tocados — es deshonesto y rompe la confianza del stop hook. Cuando dudás, `git diff --name-only HEAD~1` para confirmar.
13. **Mental check obligatorio antes de declarar ⚪ en cualquier doc**: preguntarme "¿el estado del bloque cambió en este turno?". Cosas que cuentan como cambio: implementación nueva, pivot, decisión técnica, pregunta abierta esperando founder, respuesta del founder con material documentable, recomendación, mockup, opciones A/B/C ofrecidas. Si SÍ → actualizar el doc ANTES de redactar el cierre. Si NO → justificación explícita con referencia ("estado igual a commit X"). Si el stop hook reporta inconsistencia 2+ turnos seguidos → CORREGIR antes de continuar, no defender la inconsistencia. Regla escalada desde MISTAKES.md tras 7 recurrencias del Pattern B en sesión 2026-05-30.
14. **Audit obligatorio antes de estimar**. Cualquier estimación de "Nh para mejorar/rehacer/agregar X" sin audit previo del componente actual viola la regla. Audit mínimo = `ls components/<area>/` + `wc -l <archivo>` + lectura de 1-2 archivos clave (~2 min). El codebase tiene historia >1 mes — features que parecen "from-scratch" suelen estar 70-90% construidas. Sin audit, mis estimaciones sobre-estiman 3-6x sistemáticamente, sesgan decisiones de scope del founder y erosionan trust. Regla escalada desde MISTAKES.md tras 7 recurrencias en sesión 2026-05-30 (Opciones 1, 2, 3, E, F, G + recomendador IA).
15. **Cualquier cambio de tamaño/scale/render de imagen de producto aplica AUTOMÁTICAMENTE en TODAS las categorías** — `/anteojos-de-sol`, `/anteojos-de-sol/hombre`, `/anteojos-de-sol/mujer`, `/anteojos-de-sol/{shape}`, `/anteojos-de-receta` + subs, `/marcas/<slug>` + variantes, `/favoritos`, related products en PDP, recently viewed. Single source of truth = `lib/catalog/image-scale-overrides.ts`. Pipeline enforced via TypeScript (campo `primaryImageScale` required en `FilteredCatalogCard` + `WishlistProductCard` + `RelatedProductCard`). PROHIBIDO construir `ProductCardData` manualmente en una page sin pasar por la pipeline central — si necesito hacer un grid nuevo, primero verificar que el query asociado popula `primaryImageScale` o agregarlo al tipo. Si descubro una superficie de UI nueva que renderiza fotos de producto, auditar que use el scale del override central. Regla escalada por founder 2026-05-31: "esto es obligatorio".
    - **Sub-regla obligatoria post-carga de producto**: cada vez que se agrega un modelo nuevo al catálogo, al cierre del flow de carga proponer scale override inicial COMPARANDO contra los productos existentes del mismo grid (target visual: anteojo ocupa ~80-90% del card). Si el producto nuevo se ve obviamente más chico/grande que el promedio del grid, agregar entries a `image-scale-overrides.ts` ANTES de declarar el turno cerrado. Founder reportó 2 veces (Yau 1.8/1.4 → 1.4/1.15, Vrast 1.0 → 1.4/1.15) que los scales iniciales sin comparación visual con el resto del catálogo quedaron desproporcionados. Regla escalada 2026-05-31: "recordas hacer esto siempre que se agrega un modelo nuevo, el hecho de comparar las demás imágenes y que queden bien".

## Reglas duras del negocio (ley)

1. **No vendemos lo que no tenemos en stock real físico**. Cero "pre-order", cero "consultar disponibilidad".
2. **No vendemos anteojos recetados ni lentes de contacto sin receta válida**. Es legal y ético.
3. **No prometemos lo que no podemos cumplir** (tiempos de entrega, beneficios técnicos de productos).
4. **Honestidad sobre limitaciones de productos**. Si los blue light no tienen evidencia clínica robusta, lo decimos.
5. **Toda factura es electrónica**. Cumple AFIP.
6. **Botón de arrepentimiento + política de devolución visibles**. Defensa del Consumidor.
7. **Trust signals reales, no inventados**. Sin reviews falsas, sin sellos genéricos, sin urgencia artificial.

## Stack tecnológico (no se cuestiona, ver ADR-001)

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **DB / Auth / Storage**: Supabase
- **Hosting**: Vercel
- **Styling**: Tailwind + shadcn/ui
- **Pagos**: Mercado Pago (Checkout Pro V1)
- **Facturación**: Tusfacturas.app
- **Email**: Resend
- **IA**: API de modelos LLM (Sonnet 4 default)
- **Embeddings**: OpenAI text-embedding-3-small + pgvector
- **Logística**: Correo Argentino (MiCorreo) — único operador, domicilio + sucursal (ADR-026, revierte ADR-017)
- **Analytics**: Google Search Console + GA4 + Vercel Analytics

## Sistema de agentes (cuándo invocarlos)

Hay 11 agentes especialistas en `.claude/agents/`. Invocá según la tarea:

| Tarea | Agente |
|-------|--------|
| Algo técnico óptico (recetas, materiales, marcas) | `optical-expert` |
| URLs, meta tags, structured data, keywords | `seo-strategist` |
| Artículos, guías, descripciones largas | `content-writer-medical` |
| Pagos, envíos, AFIP, defensa del consumidor | `argentine-ecom` |
| Features con IA (Vision, RAG, chat) | `ai-features-engineer` |
| UX de venta, CTA, conversión | `conversion-optimizer` |
| Análisis de datos (post-launch) | `data-analyst` |
| Performance Next.js (ISR/cache, bundle, imágenes, TTFB) | `nextjs-performance` |
| Carga de productos al catálogo (playbook ML→seed→verificación) | `catalog-loader` |
| Diseño de vanguardia, animaciones, micro-interacciones | `ui-motion-designer` |
| Mejorar el sistema mismo | `agent-manager` (vía `/agent-review`) |

**Triggers AUTOMÁTICOS (invocar sin que el founder lo pida)**:
- Founder pasa link de ML / pide cargar producto → `catalog-loader`.
- Cambio toca layout, query compartida, metadata builder o imágenes → `nextjs-performance` ANTES de declarar cerrado.
- Texto legal/transaccional (devoluciones, garantías, términos) → `argentine-ecom` ANTES de publicar (verifica norma vigente con web).
- Afirmación técnica óptica para publicar → `optical-expert` ANTES.
- Página/ruta/contenido nuevo → `seo-strategist` ANTES (slug, meta, schema).
- Superficie visual nueva o rediseño → `ui-motion-designer` ANTES de codear; si es superficie de venta, también `conversion-optimizer` (que tiene prioridad).
- Cambio de modelo/params/prompts de IA → `ai-features-engineer` + smoke test.

**Reglas de invocación**:
- No invocar 3+ agentes en un solo turno sin coordinación clara (los triggers de arriba no rompen esta regla: se invocan secuencialmente según toque).
- Si dudás cuál usar, mostrá la lista al usuario.
- Después de invocar un agente, registrá brevemente en `AGENT_PERFORMANCE.md` si funcionó bien.

## Skills (slash commands)

| Comando | Para qué |
|---------|----------|
| `/feature` | Construir una feature nueva paso a paso |
| `/debug` | Resolver un bug sistemáticamente |
| `/deploy` | Checklist antes de deployar |
| `/review` | Review semanal del sistema |
| `/agent-review` | Auditoría profunda con agent-manager |
| `/product` | Cargar un producto nuevo correctamente |
| `/article` | Escribir guía con E-E-A-T completo |
| `/seo-audit` | Auditar SEO de una página |
| `/migration` | Generar migración de Supabase con verificaciones |
| `/keyword-research` | Investigar keywords para un cluster |
| `/competitor-analysis` | Analizar competencia |
| `/onpage-optimization` | Optimizar página existente |
| `/migration-from-ml` | Importar datos del histórico de Mercado Libre |
| `/whatsapp-handoff` | Diseñar/refinar handoff a WhatsApp |
| `/image-optimization` | Procesar y optimizar imágenes de producto |

## Al final de CADA sesión

Actualizá automáticamente:
- **`CURRENT_STATE.md`**: qué se construyó, qué se decidió, problemas encontrados, próximo paso exacto.
- **`LEARNINGS.md`**: si algo funcionó particularmente bien, agregalo con el template.
- **`MISTAKES.md`**: si algo falló, registralo con causa raíz para no repetirlo.

**Definición operacional de "fin de sesión"**: NO es "el último mensaje". Es "antes del mensaje que devuelve control al founder con pregunta, decisión pendiente o pausa para feedback". Si estás por escribir un mensaje que termina con `"¿querés que…?"`, `"cuando me digas…"`, `"esperando tu…"`, `"listo, mirá…"` o similar — ese mensaje NO sale hasta que los 3 docs estén actualizados (o justifiques explícitamente por qué no hay nada nuevo). El mensaje al founder debe incluir la sección `"✅ Archivos actualizados"`. Promovida tras fallar 3 veces — ver MISTAKES.md 2026-05-28 "3RA VEZ".

Si tomaste una decisión importante: agregala a `DECISIONS.md` con formato ADR.

## Otros archivos importantes

| Archivo | Para qué |
|---------|----------|
| `ARCHITECTURE.md` | Stack y decisiones técnicas detalladas |
| `SEO_STRATEGY.md` | Estructura SEO + **keywords primarias por marca/producto** (fuente de verdad para agentes) |
| `BUSINESS_POLICIES.md` | Políticas universales del negocio (incluye estuche+franela+garantía, envíos, devoluciones, receta) |
| `CONTENT_PLAN.md` | Plan editorial: qué artículos escribir y cuándo |
| `BRANDS.md` | Marcas con stock real, líneas, segmento |
| `PRODUCT_SCHEMA.md` | **Contrato de datos por producto** — campos OBLIGATORIOS / RECOMENDADOS para el comparador y ficha técnica. Leer al cargar productos. |
| `AI_PROMPTS.md` | Biblioteca versionada de prompts de producción |
| `PRODUCTS_INVENTORY.md` | Tracker de qué productos están cargados |
| `DECISIONS.md` | ADRs — decisiones tomadas, vigentes y revertidas |
| `METRICS.md` | KPIs del negocio con targets |
| `EXPERIMENTS.md` | Log de experimentos y A/B tests |
| `AGENT_PERFORMANCE.md` | Tracker de performance de cada agente |
| `BACKLOG.md` | Pendientes acumulados (assets, data real, mejoras técnicas, features menores) |
| `supabase/CLOUD_APPLIED.md` | Registro de qué migraciones y seeds están aplicados al Supabase cloud |

## Regla de oro de este archivo

**CLAUDE.md debe mantenerse corto (menos de 200 líneas).**

Si crece demasiado, dividir en otros archivos. La información específica va en los archivos especializados, no acá.
