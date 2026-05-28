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
- **Logística**: Andreani (principal) + Correo Argentino (fallback)
- **Analytics**: Google Search Console + GA4 + Vercel Analytics

## Sistema de agentes (cuándo invocarlos)

Hay 8 agentes especialistas en `.claude/agents/`. Invocá según la tarea:

| Tarea | Agente |
|-------|--------|
| Algo técnico óptico (recetas, materiales, marcas) | `optical-expert` |
| URLs, meta tags, structured data, keywords | `seo-strategist` |
| Artículos, guías, descripciones largas | `content-writer-medical` |
| Pagos, envíos, AFIP, defensa del consumidor | `argentine-ecom` |
| Features con IA (Vision, RAG, chat) | `ai-features-engineer` |
| UX de venta, CTA, conversión | `conversion-optimizer` |
| Análisis de datos (post-launch) | `data-analyst` |
| Mejorar el sistema mismo | `agent-manager` (vía `/agent-review`) |

**Reglas de invocación**:
- No invocar 3+ agentes en un solo turno sin coordinación clara.
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

Si tomaste una decisión importante: agregala a `DECISIONS.md` con formato ADR.

## Otros archivos importantes

| Archivo | Para qué |
|---------|----------|
| `ARCHITECTURE.md` | Stack y decisiones técnicas detalladas |
| `SEO_STRATEGY.md` | Estructura completa de SEO del proyecto |
| `CONTENT_PLAN.md` | Plan editorial: qué artículos escribir y cuándo |
| `BRANDS.md` | Marcas con stock real, líneas, segmento |
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
