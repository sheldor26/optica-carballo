# Óptica Carballo — Current State

## Status

🟡 **Setup completo — pre-código**

Sistema de agentes (8), skills (15) y documentación raíz armados. **No se escribió ni una línea de código todavía**. Próximo gran paso: confirmar pendientes en `DECISIONS.md` y setup del repo Next.js.

## Última actualización

**Fecha**: 2026-05-27
**Por**: Sesión de pre-flight check del setup. Founder aprobó el plan ("avanza"), pero la verificación de pre-requisitos detectó que faltan **pnpm, Docker Desktop y Supabase CLI**. Sesión pausada hasta que se instalen.

## Qué se construyó hasta ahora

### Entrega 1 — Agentes core (✅ completa)
- 7 agentes especialistas en `.claude/agents/`:
  - `optical-expert.md`
  - `seo-strategist.md` (con keyword research cargado)
  - `content-writer-medical.md`
  - `argentine-ecom.md`
  - `ai-features-engineer.md`
  - `conversion-optimizer.md`
  - `data-analyst.md`

### Entrega 2 — Agent Manager + memoria estructurada (✅ completa)
- Agente meta:
  - `agent-manager.md` (Versión A — Auditor Sistemático)
- Archivos de memoria:
  - `DECISIONS.md` (22 ADRs pre-cargados + 5 pendientes)
  - `AGENT_PERFORMANCE.md`
  - `METRICS.md`
  - `EXPERIMENTS.md`

### Entrega 4 — Skills (✅ completa — corregido 2026-05-27)
- 15 skills en `.claude/skills/`:
  - `feature.md`, `debug.md`, `deploy.md`, `review.md`
  - `agent-review.md`, `product.md`, `article.md`
  - `seo-audit.md`, `migration.md`, `keyword-research.md`
  - `competitor-analysis.md`, `onpage-optimization.md`
  - `migration-from-ml.md`, `whatsapp-handoff.md`
  - `image-optimization.md`
- ⚠️ Pendiente confirmar: `settings.json` con hook de auto-actualización al cerrar sesión (verificar si existe en `.claude/`).

### Entrega 3 — Documentación raíz (✅ completa — en este punto del proyecto)
- `CLAUDE.md` (identidad + reglas)
- `ARCHITECTURE.md` (stack + decisiones técnicas)
- `SEO_STRATEGY.md` (arquitectura SEO completa)
- `CONTENT_PLAN.md` (15 primeros artículos planificados)
- `BRANDS.md` (catálogo vivo de marcas)
- `AI_PROMPTS.md` (biblioteca versionada — 6 prompts core)
- `PRODUCTS_INVENTORY.md` (tracker pre-carga)
- `CURRENT_STATE.md` (este archivo)
- `MISTAKES.md` (vacío)
- `LEARNINGS.md` (vacío)
- `README.md` (manual de uso del sistema)

## Qué falta inmediatamente

- **🔴 BLOQUEANTE — instalar herramientas locales faltantes** (acción del founder):
  - `pnpm`: `corepack enable && corepack prepare pnpm@9 --activate`
  - `Supabase CLI`: `brew install supabase/tap/supabase`
  - `Docker Desktop`: descargar de https://www.docker.com/products/docker-desktop/ y abrirlo una vez para que arranque el daemon.
- Verificar si existe `.claude/settings.json` con hook de auto-actualización al cerrar sesión. Si no, crearlo.
- Confirmar las 5 decisiones pendientes en `DECISIONS.md` (no bloquean el setup técnico).

## Próximo paso EXACTO

1. **Founder** instala pnpm, Docker Desktop (y lo abre) y Supabase CLI. Avisa "listo" en la próxima sesión.
2. Yo verifico de nuevo (`pnpm --version`, `docker ps`, `supabase --version`). Si los 3 OK, arranco el Step 3 sin más preguntas.
3. Step 3 ejecuta el plan presentado: leer `.env.example` y `.gitignore` pre-existentes para reconciliar, después `pnpm create next-app@latest`, configurar shadcn, estructura de carpetas, clientes Supabase, `supabase init`, layout `lang="es-AR"`, validación de criterios de éxito, primer commit.
4. En paralelo (no bloqueante), el founder puede ir avanzando con:
   - Dominio `opticacarballo.com.ar` (pendiente desde sesión anterior).
   - PEND-001 a PEND-005 de `DECISIONS.md`.

## Decisiones técnicas tomadas en esta sesión (planning)

Decisiones operativas del setup, no requieren ADR nuevo porque están dentro del marco de ADR-001:

- **Supabase local con CLI + Docker** para arrancar (no bloqueamos en PEND-005). Cuando se cree el proyecto cloud, solo cambiamos URLs en `.env.local`.
- **pnpm fijado como package manager** (`"packageManager": "pnpm@9"` + `engine-strict=true` en `.npmrc`) para evitar que `npm install` rompa el lockfile.
- **Tailwind v3 fijado explícitamente**, no v4. Migrar a v4 será un ADR propio cuando shadcn termine de adaptarse.
- **Solo deps mínimas en este setup**: `next`, `react`, `@supabase/supabase-js`, `@supabase/ssr`, utilidades de shadcn (`clsx`, `tailwind-merge`, `cva`, `lucide-react`, `tailwindcss-animate`). NO instalo `mercadopago`, `resend`, `@anthropic-ai/sdk`, `openai`, `zod`, `react-hook-form` hasta que la feature que los necesita exista (regla "no librerías sin necesidad real").
- **Componentes shadcn se agregan uno a uno** con `pnpm dlx shadcn@latest add <comp>` cuando se necesiten, no bulk install.
- **`tsconfig.json` con `strict: true` + `noUncheckedIndexedAccess: true`** para forzar disciplina desde el día 1.
- **Layout root con `lang="es-AR"`** desde el primer commit (regla 9 de CLAUDE.md, regla 10 de hreflang).
- **404 y error boundary en español argentino** desde el setup, no agregados después.

## Decisiones tomadas en sesiones previas

Ya están en `DECISIONS.md` (ADR-001 a ADR-022). Resumen:
- Stack: Next.js 15 + Supabase + Vercel
- PWA en V1, no app nativa
- Monorepo único
- Estructura SEO de URLs definida
- Patrón de variantes de producto definido
- Receta reusable, snapshots en orders
- WhatsApp como complementario
- Agent Manager Versión A (Versión B se evalúa en septiembre 2026)
- Mercado Pago Checkout Pro V1
- Tusfacturas para AFIP
- Andreani principal + Correo Argentino fallback
- Stack de modelos IA (Sonnet default, Haiku simple, Opus crítico)
- Defensa anti-injection obligatoria

## Decisiones pendientes que afectan el progreso

Ver sección "Pendientes" en `DECISIONS.md`.

## Problemas encontrados

- **2026-05-27 (sesión validación)**: CURRENT_STATE.md estaba desincronizado — declaraba "Entrega 4 pendiente" pero los 15 skills ya estaban en disco. Detectado y registrado en `MISTAKES.md`.
- **2026-05-27 (sesión planning)**: Ninguno. Step 1 + Step 2 del skill `/feature` se ejecutaron sin fricción.
- **2026-05-27 (sesión pre-flight)**: Faltan pnpm, Docker Desktop y Supabase CLI en la máquina del founder. NO es un error del sistema, pero el plan no chequeó pre-requisitos como precondición durante el Step 2 (los puso como tarea del Step 3) — eso causó una pausa que se pudo haber anticipado. Registrado en `LEARNINGS.md` como ajuste para futuros planes.

## Métricas

Sistema sin métricas reales todavía (pre-launch). Ver `METRICS.md` para targets cuando arranque.

## Notas para la próxima sesión

- **Primera acción**: confirmar aprobación del plan de setup. Si el founder lo aprobó tal cual o con tweaks, ejecutar Step 3 directamente.
- **Si hay tweaks importantes**: aplicarlos al plan y volver a presentarlo (no saltarse Step 2 → Step 3 con cambios mayores).
- **Mantener escopo cerrado** en el setup: NO incluir auth flow, schema DB, integraciones MP/Resend/IA, ni componentes UI reales. Todo eso son features aparte.
- **Pre-requisitos a chequear primero**: Node 20+, pnpm, Docker Desktop corriendo, Supabase CLI. Si alguno falta, parar y resolver antes de tocar código.
- Recordar: reminder activo en memoria para evaluar Agent Manager Versión B en septiembre 2026.

---

## Template para futuras actualizaciones

```markdown
## Última actualización

**Fecha**: YYYY-MM-DD
**Por**: [quién]

## Qué se construyó

[Lista de cosas concretas hechas en la sesión]

## Qué decisiones se tomaron

[Si alguna decisión importante — referencia ADR en DECISIONS.md]

## Próximo paso EXACTO

[Una sola cosa, la más importante para la próxima sesión]

## Problemas encontrados

[Si hubo problemas — referencia MISTAKES.md si aplica]
```
