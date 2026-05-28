# Óptica Carballo — Current State

## Status

🟢 **Migración 00001 aplicada y validada en local — commit `62d2e85`**

Repo Next.js 15 funcionando + schema base del catálogo aplicado y testeado en Supabase local (Docker). 5 tablas (`brands`, `categories`, `products`, `product_variants`, `product_images`) con RLS, índices, triggers, FKs CASCADE/RESTRICT. Tipos TS regenerados y typecheck limpio. **Schema cloud todavía vacío** — `supabase db push` queda para cuando el founder decida.

## Última actualización

**Fecha**: 2026-05-28
**Por**: Sub-sesión de planning del skill `/feature` para "Cargar marcas reales + página `/anteojos-de-sol/[brand]`". Steps 1-2 completados, plan ajustado (V2) presentado y a la espera de aprobación final del founder. **NO se tocó código** en esta sub-sesión, pero se actualizaron docs (`BRANDS.md`, `DECISIONS.md` con ADR-023 nuevo y ADR-009 parcial).

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

## Decisiones técnicas tomadas en esta sub-sesión (planning)

1. **Marcas reales del catálogo** (5, confirmadas por founder): Rusty, Vulk, Reef, Mormaii, Paula Cahen D'Anvers. Todas en sol Y receta. Reemplaza la lista anterior asumida (Rusty, Reef, Vulk, Prune, Infinit) que venía de keyword research, no de stock real.
2. **`is_argentine = true` para las 5**, incluso Mormaii (brasilera). El flag pasa de "origen argentino estricto" a "marca pensada como local / con presencia argentina". Formalizado en **ADR-023 nuevo**.
3. **Modelado sol vs receta = productos separados por uso**. Cada marco vendido como sol y como receta son rows distintas en `products`, slugs distintos (ej: `rusty-wayfarer-negro-sol` y `rusty-wayfarer-negro-rx`), category_id distinto. Razón: alinea con ADR-004 (URLs por categoría), SKUs típicamente distintos (sol tiene lente, receta no), trackeable independiente.
4. **Implica 2 categorías top-level mínimas en seed**: `anteojos-de-sol`, `anteojos-de-receta`. Sin sub-categorías (polarizados, aviador, etc.) en este step.
5. **ADR-009 (PEND-002)** pasa a 🟡 Parcial: Paula Cahen confirmada, las otras 4 colecciones (Las Oreiro, Valeria Mazza, Teresa Calandra, Pampita) siguen pendientes.
6. **Seeds en SQL plano, no script TS** (decisión técnica del plan V1, sin cambios). Evita instalar `tsx` + `dotenv`.
7. **Sin imágenes reales** en este step. Placeholder gris hasta que el founder pase fotos.

## Archivos actualizados en esta sub-sesión (no commiteados todavía)

- `BRANDS.md`: bloque nuevo arriba con las 5 marcas confirmadas; estado de Rusty, Reef, Vulk actualizado a 🟢 Activa; Mormaii agregada como entrada nueva; Paula Cahen D'Anvers agregada en su sección con estado 🟢.
- `DECISIONS.md`: ADR-009 actualizado con sección 2026-05-28 (parcial); ADR-023 nuevo (semántica de `is_argentine`).
- `CURRENT_STATE.md`: este archivo.

## Próximo paso EXACTO

**Esperando aprobación del founder** sobre el plan del skill `/feature` V2 (con marcas reales). Resumen del plan:

- Feature: cargar las 5 marcas reales (Rusty, Vulk, Reef, Mormaii, Paula Cahen D'Anvers) + 2 categorías top-level (sol, receta) + 4 productos Rusty placeholder (2 sol + 2 rx) + armar página dinámica `/anteojos-de-sol/[brand]` con caso end-to-end Rusty.
- Decisión bloqueante ya respondida por el founder: **aplicar migración 00001 a Supabase cloud** (vía `supabase link` + `supabase db push`) y trabajar contra cloud, no local.
- Archivos a crear: 2 SQL seeds (`supabase/seeds/01_categories_brands.sql` con 2 categorías + 5 marcas, `02_rusty_products.sql` con 4 productos placeholder), Server Component `app/(storefront)/anteojos-de-sol/[brand]/page.tsx`, `not-found.tsx`, `components/product/product-card.tsx`, `components/seo/breadcrumb-jsonld.tsx`, `lib/format/currency.ts`. Shadcn components `card` y `badge` vía CLI.
- NO se introducen libs nuevas (sigue regla 6 de CLAUDE.md).
- NO se incluyen imágenes reales en este step (placeholder gris hasta que el founder pase fotos).
- `seo-strategist` se invoca al final, antes del commit, para validar metadata + structured data.

**Próxima sesión arranca aquí**:
1. Founder confirma plan (o pide ajustes — precios placeholder, qué productos seedear, scope).
2. Step 3 del `/feature`: `supabase link --project-ref tuddpfspnbnmafsqdvat` + `supabase db push`.
3. Escribir SQL seeds.
4. Aplicar seeds en local (`docker exec ... psql -f`) y en cloud (vía Dashboard SQL Editor).
5. Agregar shadcn `card` + `badge`.
6. Crear componentes + página dinámica.
7. Invocar `seo-strategist` para validar SEO antes del commit.
8. Commit `feat(catalog): primeras marcas + página /anteojos-de-sol/[brand]`.

En paralelo (no bloqueante):
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
