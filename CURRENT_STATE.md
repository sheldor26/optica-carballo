# Óptica Carballo — Current State

## Status

🟢 **Migración 00001 aplicada y validada en local — commit `62d2e85`**

Repo Next.js 15 funcionando + schema base del catálogo aplicado y testeado en Supabase local (Docker). 5 tablas (`brands`, `categories`, `products`, `product_variants`, `product_images`) con RLS, índices, triggers, FKs CASCADE/RESTRICT. Tipos TS regenerados y typecheck limpio. **Schema cloud todavía vacío** — `supabase db push` queda para cuando el founder decida.

## Última actualización

**Fecha**: 2026-05-28
**Por**: Skill `/migration` ejecutado de punta a punta (Steps 1-10). Background job de `supabase start` que quedó corriendo en el cierre anterior terminó OK, retomé al recibir la notificación, apliqué la migración y validé.

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

### Migración 00001 — catalog_foundation (✅ aplicada en local — 2026-05-28, commit `62d2e85`)
- **Archivo creado**: `supabase/migrations/20260528030711_catalog_foundation.sql` (~250 líneas).
- **Tablas definidas** (5): `brands`, `categories` (jerárquica), `products`, `product_variants`, `product_images`.
- **Función helper**: `handle_updated_at()` reusable por toda tabla con `updated_at`.
- **Extensión**: `pgcrypto` habilitada (para `gen_random_uuid()`).
- **RLS**: habilitado en las 5 tablas. Políticas: lectura pública solo si `is_active = true`. Escritura solo service_role.
- **Decisiones técnicas del SQL** (ninguna requiere ADR nuevo, todas dentro de ADR-004/005/013):
  - `price_cents bigint` en centavos (no `numeric`, no floats).
  - `stock_qty CHECK (>= 0)` — regla dura #1 del proyecto.
  - `UNIQUE NULLS NOT DISTINCT (parent_id, slug)` en categories — permite "polarizados" bajo varios padres.
  - `search_vector tsvector GENERATED ALWAYS AS ... STORED` en products con pesos (A=name, B=short_desc, C=desc), language spanish.
  - `product_images.variant_id` nullable: NULL = imagen del producto base (compartida).
  - Índice único parcial `is_primary` por producto (`WHERE is_primary = true AND variant_id IS NULL`).
  - Índice parcial `in_stock` (`WHERE is_active = true AND stock_qty > 0`).
  - `ON DELETE RESTRICT` en `brand_id` (no se borra marca con productos).
  - `ON DELETE CASCADE` en `product_id` para variants/images.
- **Scope cerrado intencionalmente**:
  - ❌ profiles, addresses, prescriptions, orders, articles, ai_*, wishlists, etc. → migraciones futuras.
  - ❌ `compare_at_price_cents` (precio tachado) → ALTER TABLE cuando se necesite.
  - ❌ `weight_grams` → cuando integremos Andreani API (ADR-017 V2).
  - ❌ Bucket "products" de Storage → se crea aparte, no es schema relacional.
- **Validación con `supabase db reset` (Step 7)** — todo verde:
  - 5 tablas creadas, RLS habilitada en las 5, 5 policies, 21 índices `idx_*`, 5 triggers `on_*_updated`.
  - Smoke test con role `anon`: ✅ ve solo registros activos; ✅ INSERT bloqueado por RLS.
  - `updated_at` trigger: ✅ se actualiza en UPDATE.
  - `search_vector` (tsvector spanish): ✅ matchea "polarizados" con rank > 0.
  - CASCADE: ✅ borrar product borra sus variants e images.
  - CHECK constraint: ✅ `stock_qty = -1` rechazado.
- **Tipos TS regenerados** (`pnpm db:types`): `types/supabase.ts` ahora refleja las 5 tablas con `Row`/`Insert`/`Update`/`Relationships`. `pnpm typecheck` clean, `pnpm lint` clean.
- **NO se aplicó a cloud todavía**: `supabase db push` o aplicar manualmente via SQL Editor queda para cuando el founder decida. Schema local y cloud están **desincronizados** intencionalmente hasta entonces.
- **Stack Supabase local sigue corriendo**: 10 contenedores Docker (`supabase_db_optica-carballo`, `supabase_studio_*`, etc.). Studio accesible en `http://127.0.0.1:54323`. Para parar: `supabase stop`.

### Entrega 5 — Setup inicial repo Next.js (✅ completa — 2026-05-27)
- **Toolchain instalada**: pnpm 9.15.9 (vía corepack), Supabase CLI 2.101.0 (binario en `~/.local/share/supabase/` con symlink en `~/.local/bin/`), Docker Desktop corriendo.
- **Scaffold creado** (81 archivos en el primer commit `f6b15f3`):
  - `package.json` con pnpm fijado (`packageManager`, `engine-strict=true`).
  - `tsconfig.json` estricto (`strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`).
  - `next.config.mjs` con `remotePatterns` para Supabase Storage cloud + local.
  - `tailwind.config.ts` v3.4 con preset de shadcn (CSS vars, baseColor neutral, plugin `tailwindcss-animate`).
  - `components.json` (shadcn config) — listo para agregar componentes con `pnpm dlx shadcn@latest add <name>`.
  - `app/layout.tsx` con `lang="es-AR"`, Inter font, `metadataBase` desde env.
  - `app/page.tsx` placeholder, `app/not-found.tsx`, `app/error.tsx` (todos en español argentino).
  - `lib/utils.ts` con `cn()` para shadcn.
  - `lib/supabase/{client,server,admin,middleware}.ts` con `@supabase/ssr` y cookies async de Next 15.
  - `middleware.ts` con matcher de Next App Router.
  - Estructura de carpetas según ARCHITECTURE.md (con `.gitkeep` en vacías).
  - `supabase/config.toml` (vía `supabase init`).
- **Validación todos los criterios pasaron**:
  - `pnpm typecheck` → clean (después de tipar `CookieOptions` en server/middleware Supabase).
  - `pnpm lint` → 0 errors, 0 warnings.
  - `pnpm build` → home 102 kB First Load JS (target <200 kB ✓), 4 páginas estáticas.
  - `pnpm dev` → Ready en 1066ms, HTTP 200 en `/`, `lang="es-AR"` verificado en response, título correcto.
  - `.gitignore` valida: `.env.local`, `node_modules`, `.next` NO aparecen en `git status`.
- **Primer commit**: `f6b15f3 — chore: setup inicial Next.js 15 + Tailwind + shadcn/ui + Supabase`.

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

- Verificar si existe `.claude/settings.json` con hook de auto-actualización al cerrar sesión. Si no, crearlo.
- **PEND-005 parcialmente cerrado**: el `.env.local` ya tiene credenciales del proyecto Supabase cloud (`tuddpfspnbnmafsqdvat.supabase.co`). Faltan confirmar las cuentas restantes (Vercel, Resend, MP dev, Tusfacturas, API IA, OpenAI, GSC, GA4). Actualizar `DECISIONS.md` PEND-005.
- Decidir si la próxima feature es schema inicial de DB (`/migration`) o página real (catálogo de marcas, home definitivo).

## Próximo paso EXACTO

**Próxima sesión**: elegir entre seguir con schema (más migraciones) o usar lo que ya hay (cargar primeras marcas + primera página real). 

Mi recomendación: **cargar primeras marcas argentinas** (Rusty, Reef, Vulk, Prune, Infinit — ADR-019 prioridad 1) **+ armar página `/anteojos-de-sol/rusty` como primer caso end-to-end**. Eso valida que el schema sirve para algo real antes de seguir agregando tablas. Si encontramos que falta una columna o un índice, lo descubrimos ahora con poco código existente, no con 6 tablas más arriba.

Tres caminos posibles:

1. **Cargar marcas + primera página de marca** (`/feature` — Página marca Rusty). Requiere: imágenes en Storage bucket "products", server action de seed, primer Server Component leyendo de Supabase con tipos TS. Output: una URL real funcionando contra DB local.
2. **Seguir con schema — migración 00002: profiles + addresses**. Auth flow. Necesario para checkout pero no inmediato.
3. **Seguir con schema — migración 00002: orders + order_items + prescriptions**. Tampoco inmediato sin auth previo.

Primera acción concreta de la próxima sesión, si elegís camino 1:
- `supabase status` para confirmar stack corriendo. Si está detenido (`supabase stop` fue corrido entre sesiones), `supabase start`.
- Crear el bucket "products" de Storage (vía SQL en una migración pequeña o vía Studio en `http://127.0.0.1:54323`).
- Skill `/feature` para diseñar la página de marca y el flujo de seed.

En paralelo (no bloqueante):
- **Aplicar migración a Supabase cloud** cuando el founder lo decida: dos opciones — (a) `supabase link --project-ref tuddpfspnbnmafsqdvat && supabase db push`, o (b) pegar el SQL en el SQL Editor del Dashboard. Ambas idempotentes mientras la DB esté vacía.
- Dominio `opticacarballo.com.ar` (pendiente).
- PEND-001 a PEND-004 de `DECISIONS.md`.
- PEND-005: cuentas restantes (Vercel, Resend, MP dev, etc.).

## Decisiones técnicas tomadas en esta sesión (ejecución)

Decisiones operativas del setup, dentro del marco de ADR-001:

- **Supabase CLI instalada como binario directo en `~/.local/share/supabase/`** con symlink en `~/.local/bin/supabase` (en vez de `brew install`). Razón: el founder no tenía Homebrew y instalarlo era invasivo (sudo, ~200 MB, modifica shell rc). El binario es local, reversible con un `rm`, y `~/.local/bin` ya estaba en su PATH. Funcionó perfecto, sin sudo.
- **Supabase cliente apunta al proyecto cloud existente** (el founder tenía `.env.local` configurado con credenciales reales de `tuddpfspnbnmafsqdvat.supabase.co`). El comando `supabase init` se ejecutó igual para crear `supabase/config.toml` local, pero `supabase start` con Docker NO se corrió en esta sesión. Cuando haga falta DB local aislada, se corre.
- **pnpm fijado como package manager** (`"packageManager": "pnpm@9.15.9"` + `engine-strict=true` en `.npmrc`) para evitar que `npm install` rompa el lockfile.
- **Tailwind v3.4 fijado explícitamente**, no v4. Migrar a v4 será un ADR propio cuando shadcn termine de adaptarse.
- **Solo deps mínimas en este setup**: `next`, `react`, `@supabase/supabase-js`, `@supabase/ssr`, utilidades de shadcn (`clsx`, `tailwind-merge`, `cva`, `lucide-react`, `tailwindcss-animate`). NO instalo `mercadopago`, `resend`, `@anthropic-ai/sdk`, `openai`, `zod`, `react-hook-form` hasta que la feature que los necesita exista (regla "no librerías sin necesidad real").
- **Componentes shadcn se agregan uno a uno** con `pnpm dlx shadcn@latest add <comp>` cuando se necesiten, no bulk install.
- **`tsconfig.json` con `strict: true` + `noUncheckedIndexedAccess: true` + `noImplicitOverride: true`** para forzar disciplina desde el día 1.
- **Layout root con `lang="es-AR"`** desde el primer commit (regla 9 de CLAUDE.md, regla 10 de hreflang).
- **404 y error boundary en español argentino** desde el setup, no agregados después.
- **`eslint: ^8.57.1`** (no v9), porque eslint-config-next 15 todavía es más estable con eslint 8. Migrar a v9 + flat config cuando next-lint deje de ser default (Next 16).
- **Tipado explícito de `CookieOptions` en clientes Supabase server/middleware**: TS strict no inferia los callbacks `setAll` de `@supabase/ssr`. Tipo explícito `{ name, value, options: CookieOptions }[]` resuelve sin perder safety.

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
- **2026-05-27 (sesión pre-flight)**: Faltaban pnpm, Docker Desktop y Supabase CLI. Resuelto con instalación asistida.
- **2026-05-27 (sesión ejecución)**: 
  1. Al instalar Supabase CLI la primera vez, borré el binario hermano `supabase-go` pensando que era basura. El shim `supabase` lo necesita al lado para funcionar. Resuelto re-extrayendo el tarball completo a `~/.local/share/supabase/`. Registrado en `MISTAKES.md`.
  2. TS strict marcó 10 errores de tipo en los callbacks de cookies de `@supabase/ssr`. Resuelto agregando type alias `CookieToSet` + import de `CookieOptions`. Aprendizaje: cuando se usa `noUncheckedIndexedAccess` + `strict`, los callbacks de libs externas suelen necesitar tipado explícito. No es un error del sistema, es expected behavior de TS strict. Registrado en `LEARNINGS.md`.
- **2026-05-28 (sesión migración 00001)**: 
  1. La herramienta `Write` rechazó sobreescribir el archivo de migración recién creado por `supabase migration new` porque "no fue leído primero". Resuelto con un Read trivial. No es bug — es safeguard. No merece MISTAKES.
  2. `psql` no está instalado localmente en el sistema (no era pre-requisito explícito). Resuelto usando `docker exec supabase_db_optica-carballo psql ...` que sí tiene psql incluido. Patrón útil registrado en LEARNINGS.
  3. La migración aplicó sin errores en `supabase db reset`. Todos los smoke tests verdes. No hubo problemas conceptuales.

## Métricas

Sistema sin métricas reales todavía (pre-launch). Ver `METRICS.md` para targets cuando arranque.

## Notas para la próxima sesión

- **Primera acción**: `supabase status` para confirmar que el stack local sigue corriendo. Si está parado, `supabase start` (esta vez es rápido — imágenes ya bajadas).
- **Si el `.env.local` apunta a cloud**: las queries de pnpm dev van a Supabase cloud, NO a la DB local con la migración aplicada. Si querés desarrollar contra local, hay que cambiar `NEXT_PUBLIC_SUPABASE_URL` a `http://127.0.0.1:54321` y usar las llaves locales (`sb_publishable_*` y `sb_secret_*` que imprimió `supabase start` — están en el log del background job de la sesión anterior).
- **Studio local** para inspección visual: `http://127.0.0.1:54323`.
- **NO modificar `supabase/migrations/20260528030711_catalog_foundation.sql` ya commiteado**. Cambios al schema = nueva migración con ALTER/CREATE.
- **NO instalar librerías nuevas sin preguntar** (regla 6 de CLAUDE.md).
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
