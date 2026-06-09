# Óptica Carballo

E-commerce de óptica con venta a todo Argentina. Catálogo completo (anteojos de sol, recetados, lentes de contacto) + features con IA (lector de receta, asistente conversacional, recomendador) + contenido editorial SEO-optimizado.

## ¿Qué es este repo?

Repo del proyecto Óptica Carballo. Incluye:
- **Código** (Next.js + Supabase + Vercel) — a partir de Entrega 4 en adelante.
- **Sistema de agentes y skills** (`.claude/`) que convierte el asistente en un equipo experto especializado.
- **Documentación viva** del proyecto (decisiones, métricas, estrategia, plan editorial, etc.).

## Cómo está organizado

```
optica-carballo/
├── .claude/                   ← sistema de agentes y skills
│   ├── agents/                ← 8 expertos especialistas
│   ├── skills/                ← 14 procedimientos paso a paso
│   └── settings.json          ← hook auto-update
│
├── CLAUDE.md                  ← lo primero que lee el sistema cada sesión
├── ARCHITECTURE.md            ← stack y arquitectura técnica
├── SEO_STRATEGY.md            ← estrategia SEO completa con keyword research
├── CONTENT_PLAN.md            ← plan editorial de artículos
├── BRANDS.md                  ← catálogo vivo de marcas
├── AI_PROMPTS.md              ← biblioteca versionada de prompts de producción
├── PRODUCTS_INVENTORY.md      ← tracker de carga de catálogo
│
├── CURRENT_STATE.md           ← estado de la sesión actual (auto-actualiza)
├── DECISIONS.md               ← ADRs — decisiones tomadas
├── METRICS.md                 ← KPIs del negocio
├── EXPERIMENTS.md             ← log de experimentos
├── MISTAKES.md                ← errores a no repetir
├── LEARNINGS.md               ← patrones que funcionan (auto-actualiza)
├── AGENT_PERFORMANCE.md       ← tracker de performance de agentes
│
└── [código Next.js a partir de Entrega 4]
```

## Cómo usar el sistema

### Día a día

1. **Abrí el sistema** en la carpeta del proyecto.
2. El sistema automáticamente lee `CLAUDE.md` y `CURRENT_STATE.md`.
3. Pedile lo que necesites. El sistema decide qué agente invocar según la tarea.
4. **Al cerrar sesión**: el sistema actualiza `CURRENT_STATE.md` y `LEARNINGS.md` automáticamente (vía hook).

### Cuándo invocar manualmente un agente

Si querés forzar un experto específico:

```
"Consultá con seo-strategist sobre la URL de esta página"
"Pedile a optical-expert que valide este texto técnico"
"Coordiná con argentine-ecom para definir el flow de checkout"
```

Ver `CLAUDE.md` sección "Sistema de agentes" para la lista completa.

### Slash commands disponibles

```
/feature                  → construir una feature nueva paso a paso
/debug                    → resolver un bug sistemáticamente
/deploy                   → checklist completo antes de deployar
/review                   → review semanal del sistema
/agent-review             → auditoría profunda con agent-manager
/product                  → cargar un producto nuevo correctamente
/article                  → escribir guía con E-E-A-T completo
/seo-audit                → auditar SEO de una página
/migration                → generar migración de Supabase con verificaciones
/keyword-research         → investigar keywords para un cluster
/competitor-analysis      → analizar competencia
/onpage-optimization      → optimizar página existente
/migration-from-ml        → importar datos del histórico de Mercado Libre
/whatsapp-handoff         → diseñar/refinar handoff a WhatsApp
/image-optimization       → procesar y optimizar imágenes de producto
```

### Rutina recomendada

| Frecuencia | Acción |
|------------|--------|
| Cada sesión | El sistema actualiza `CURRENT_STATE.md` y `LEARNINGS.md` automáticamente al cerrar |
| Cuando algo falla | Agregar a `MISTAKES.md` con causa raíz |
| Cuando se toma decisión importante | Agregar ADR en `DECISIONS.md` |
| Cada 2 semanas | `/agent-review` para que el agent-manager audite el sistema |
| Cada mes | Reporte de métricas (data-analyst cuando haya datos) |
| Cada trimestre | Revisión de experimentos cerrados, consolidación de patterns |

## Stack tecnológico (resumen)

- **Frontend**: Next.js 15 + TypeScript + Tailwind + shadcn/ui
- **Backend**: Supabase (DB + Auth + Storage + pgvector)
- **Hosting**: Vercel
- **Pagos**: Mercado Pago + Tusfacturas (AFIP)
- **IA**: API de modelos LLM + OpenAI embeddings
- **Logística**: Correo Argentino (MiCorreo)
- **Email**: Resend
- **Analytics**: GSC + GA4 + Vercel Analytics

Detalle completo en `ARCHITECTURE.md`.

## Setup local (cuando empecemos a codear)

```bash
# Clonar
git clone <repo-url> optica-carballo
cd optica-carballo

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Llenar valores reales (Supabase, MP, API IA, etc.)

# Levantar Supabase local
npx supabase start
npx supabase db reset

# Dev server
pnpm dev

# Abrir http://localhost:3000
```

## Workflow de desarrollo

### Iniciar feature nueva
1. Abrir el sistema en el proyecto.
2. `"/feature - quiero implementar X"`.
3. El sistema (vía skill `/feature`) sigue el proceso: entender → planear → DB → backend → frontend → test → actualizar CURRENT_STATE.

### Antes de deployar
1. `"/deploy"`.
2. El sistema (vía skill `/deploy`) corre el checklist completo (lint, build, tests, env vars, migrations).
3. Si todo OK, autoriza el deploy.

### Cuando algo se rompe
1. `"/debug - el chat no responde"`.
2. El sistema (vía skill `/debug`) sigue el proceso: entender → reproducir → aislar → hipotetizar → testear → fixear → documentar.

## Decisiones clave del proyecto (no cuestionar)

Ver `DECISIONS.md` completo. Resumen:

- **PWA en V1, no app nativa** (ADR-002)
- **URLs en español argentino completo, sin `/marcas/`, sin `/blog/`** (ADR-004)
- **Una publicación con variantes** (ADR-005)
- **Snapshots en orders** (ADR-007)
- **WhatsApp complementario, no rival del checkout** (ADR-008)
- **MP Checkout Pro V1** (ADR-015)
- **Correo Argentino (MiCorreo) único operador** (ADR-026, revierte ADR-017)
- **Agent Manager Versión A** hasta septiembre 2026 (ADR-014)

## Métricas objetivo

Ver `METRICS.md` completo. Highlights:

| Métrica | Target M3 | Target M6 | Target M12 |
|---------|-----------|-----------|------------|
| Impresiones GSC | 50.000 | 200.000 | 800.000 |
| Pedidos / mes | 60 | 250 | (escala) |
| Conversion rate | 1.5% | 2.5% | 3%+ |
| Páginas top 10 | 20 | 80 | 250 |

## Contribución / sesiones colaborativas

Este es un proyecto solo founder. Pero si en algún momento se suma alguien:
- Leé este README + CLAUDE.md primero.
- Familiarizate con DECISIONS.md para no reabrir discusiones cerradas.
- Toda decisión importante pasa por proceso ADR.

## Recursos

- [Documentación Next.js 15](https://nextjs.org/docs)
- [Documentación Supabase](https://supabase.com/docs)
- [Documentación Mercado Pago](https://www.mercadopago.com.ar/developers)
- [Vercel Docs](https://vercel.com/docs)

## Licencia y propiedad

Propietario: Óptica Carballo. Todos los derechos reservados.

## Contacto interno

- **Founder / Dev**: Juan Carballo
- **Óptica regente**: María Carlota Carballo
- **Domicilio**: Virasoro, Corrientes, Argentina

---

**Última actualización del README**: 2026-05-27
