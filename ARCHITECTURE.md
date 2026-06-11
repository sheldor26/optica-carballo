# Óptica Carballo — Architecture

## Resumen ejecutivo

Stack moderno, single repo, infraestructura cloud, focado en velocidad de desarrollo y bajo overhead operacional. Aprovecha la curva de aprendizaje del founder con stack ya conocido (Next.js + Supabase + Vercel).

Ver `DECISIONS.md` para el contexto completo de cada decisión.

## Stack tecnológico

### Frontend
- **Next.js 15** (App Router)
- **TypeScript** estricto
- **Tailwind CSS** + **shadcn/ui**
- **Vercel** (hosting + edge functions)
- **PWA** (instalable como app, no nativa en V1)

### Backend / Datos
- **Supabase**:
  - PostgreSQL 15+
  - Auth (email/password + OAuth Google)
  - Storage (imágenes de productos + recetas)
  - Realtime (V2, para notificaciones de orden)
  - pgvector (para RAG del asistente IA)
- **Server Actions** de Next.js para operaciones del lado servidor.
- **Edge Functions** de Vercel para webhooks y procesamiento ligero.

### Pagos y facturación
- **Mercado Pago**: Checkout Pro (V1)
- **Tusfacturas.app**: facturación electrónica AFIP

### IA
- **API de modelos LLM** (estado real en código, audit 2026-06-11):
  - `claude-opus-4-8` — lector de receta (extracción; visión high-res + adaptive thinking — upgrade 2026-06-11)
  - `claude-sonnet-4-6` — verificador adversarial del lector, face-shape, medidor DNP, generador de copy
  - `claude-haiku-4-5` — chat del asistente (alto volumen / bajo costo)
  - ⚠️ Al tocar cualquier endpoint de IA, verificar deprecaciones contra la referencia actual de la API (ver MISTAKES 2026-06-11: `budget_tokens` deprecado en prescription)
- **OpenAI**: text-embedding-3-small (para embeddings RAG)
- **Vercel AI SDK**: para streaming en chat
- **Futuro**: NeuralRouting como gateway (cuando esté estable)

### Comunicación
- **Resend**: emails transaccionales (orden confirmada, envío, facturación)
- **WhatsApp Business API**: deep links con contexto pre-cargado (V1) → API oficial (V2)

### Logística
- **Correo Argentino (MiCorreo)**: operador único (domicilio + sucursal). API `/rates` integrada en `lib/correo/`. (Andreani descartado — ADR-026.)
- Tabla fija de costos por zona como **fallback** (API caída / estimadores client-side)

### Analytics y monitoring
- **Google Search Console**
- **Google Analytics 4**
- **Vercel Analytics** (Web Vitals reales)
- **Sentry** (V2, errores en producción)

## Por qué este stack

- **Next.js + Supabase + Vercel**: stack que el founder ya usa en productosvirales.com.ar. Reutilizamos curva de aprendizaje.
- **Mercado Pago**: estándar argentino. Stripe no funciona bien acá.
- **shadcn/ui sobre Material o Chakra**: control total del diseño + bajo bundle.
- **Server Actions sobre tRPC o REST**: menos boilerplate.
- **PWA sobre app nativa**: una sola codebase, instalable, suficiente para V1.

## Estructura del repositorio

```
optica-carballo/
├── .claude/                    ← sistema de agentes y skills
├── app/                        ← Next.js App Router
│   ├── (storefront)/           ← grupo de rutas públicas
│   │   ├── page.tsx            ← home
│   │   ├── anteojos-de-sol/
│   │   ├── anteojos-de-receta/
│   │   ├── lentes-de-contacto/
│   │   ├── guias/
│   │   ├── herramientas/
│   │   ├── carrito/
│   │   └── checkout/
│   ├── (account)/              ← rutas autenticadas
│   │   ├── mi-cuenta/
│   │   └── mis-pedidos/
│   ├── admin/                  ← panel interno
│   ├── api/                    ← rutas API (webhooks, IA)
│   │   ├── ai/
│   │   ├── mp/                 ← webhooks de Mercado Pago
│   │   ├── checkout/
│   │   └── facturacion/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                     ← shadcn primitives
│   ├── product/                ← cards, gallery, variant selector
│   ├── checkout/
│   ├── ai/                     ← chat widget, prescription uploader
│   └── seo/                    ← structured data components
├── lib/
│   ├── supabase/               ← clients y queries
│   ├── ai/                     ← LLM API wrappers
│   ├── mp/                     ← Mercado Pago integration
│   ├── facturacion/            ← Tusfacturas integration
│   ├── seo/                    ← helpers de SEO
│   └── utils/
├── public/
├── styles/
├── docs/                       ← documentación viva del proyecto (los .md de raíz)
├── scripts/                    ← scripts de utilidad
├── supabase/
│   ├── migrations/
│   └── seed/
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Database structure (V1)

Esquema completo en `supabase/migrations/`. Tablas principales:

### Usuarios
- `auth.users` (built-in Supabase)
- `profiles` (data adicional vinculada a auth.users)
- `addresses` (múltiples por usuario)

### Catálogo
- `brands`
- `categories` (jerarquía + auto_filter JSONB)
- `collections` (colaboraciones especiales)
- `products` (modelo base con info compartida)
- `product_variants` (SKUs vendibles con attributes JSONB)
- `product_images` (vinculadas a producto o variante)
- `product_collections` (relación many-to-many)

### Recetas
- `prescriptions` (separadas de orders, reusables)

### Órdenes
- `orders` (con snapshots inmutables)
- `order_items` (con `lens_options` JSONB)

### Contenido
- `articles` (guías del blog)

### IA
- `ai_conversations`
- `ai_messages`
- `ai_response_cache` (V2)

### Engagement
- `wishlists`
- `whatsapp_leads`
- `product_views`

Detalle completo del schema en `supabase/migrations/00001_initial_schema.sql` (a generar al inicio del desarrollo).

## Hard decisions (no se cuestionan — ver DECISIONS.md)

- **No app nativa en V1** (ADR-002). PWA es suficiente.
- **Monorepo único** (ADR-003). No separar admin.
- **URLs sin `/marcas/` ni `/blog/`** (ADR-004). `/anteojos-de-sol/rusty`, `/guias/[slug]`.
- **Una publicación con variantes** (ADR-005). No publicación por variante.
- **Receta reusable** (ADR-006). No vinculada exclusivamente a una orden.
- **Snapshots en orders** (ADR-007). FKs para reportes, snapshots para mostrar.
- **WhatsApp complementario, no rival** del checkout (ADR-008).
- **No B2B en V1** (ADR-011).
- **Supabase Storage para imágenes** (ADR-013).
- **Mercado Pago Checkout Pro V1** (ADR-015).
- **Tusfacturas para AFIP** (ADR-016).
- **Correo Argentino (MiCorreo) único operador** (ADR-026, revierte ADR-017).
- **Stack IA** (ADR-021).
- **Defensa contra prompt injection obligatoria** (ADR-022).

## Variables de entorno

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Mercado Pago
MP_ACCESS_TOKEN=
MP_PUBLIC_KEY=
MP_WEBHOOK_SECRET=
MP_NOTIFICATION_URL=

# LLM Provider
ANTHROPIC_API_KEY=

# OpenAI (embeddings)
OPENAI_API_KEY=

# Tusfacturas
TUSFACTURAS_API_KEY=
TUSFACTURAS_API_TOKEN=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Site
NEXT_PUBLIC_SITE_URL=https://opticacarballo.com.ar
NEXT_PUBLIC_WHATSAPP_NUMBER=

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

Todas las variables están en `.env.example` con valores ficticios.

## Performance targets

- LCP <2.5s (75th percentile)
- INP <200ms
- CLS <0.1
- TTFB <600ms
- Bundle JS inicial <200KB gzipped

Ver `METRICS.md` para targets de negocio.

## Seguridad

### Row Level Security (RLS) en Supabase
Toda tabla con datos de usuarios tiene RLS activo. Políticas:
- `profiles`: usuario lee/edita solo el suyo.
- `addresses`, `prescriptions`, `wishlists`: idem.
- `orders`, `order_items`: usuario ve sus propias órdenes.
- `products`, `categories`, `brands`, `articles`: lectura pública, escritura solo service_role.
- `ai_conversations`, `ai_messages`: usuario propio + session_id para anónimos.

### Datos sensibles
- **Recetas oftalmológicas**: datos de salud personal. Almacenadas en tabla con RLS estricto, imágenes en bucket privado con signed URLs.
- **Datos de pago**: NUNCA almacenados en nuestra DB. Manejados por Mercado Pago.
- **DNI/CUIT para facturación**: encriptados o pseudonimizados en logs.

### Anti-abuse
- Rate limiting en endpoints sensibles (chat IA, upload de recetas, checkout).
- Validación server-side de TODO input.
- CORS estricto.
- CSP headers configurados.

### Defensa contra prompt injection
Ver agente `ai-features-engineer` para detalles. Reglas:
- User content en bloques separados (XML).
- Whitelist de tools.
- Validación post-output.
- Texto en imágenes (recetas) tratado como dato, no instrucción.

## Backups y disaster recovery

- **Supabase**: backups automáticos diarios (parte del plan pago).
- **Vercel**: deployments versionados, rollback en 1 click.
- **Git**: source code en GitHub.
- **Manual**: exportar productos + órdenes a CSV semanal a Google Drive (script).

## Roadmap técnico

### V1 (lanzamiento)
- Catálogo + variantes
- Checkout MP + facturación
- Lector de receta IA
- Asistente conversacional (versión simple, sin RAG completo)
- Blog/guías
- Admin básico

### V2 (mes 3-6 post-launch)
- Recomendador por forma de rostro
- RAG completo (asistente con embeddings)
- A/B testing infrastructure
- Email marketing (Resend audiences)
- Reservas de turno online

### V3 (mes 6+)
- Try-on AR (caro, posponer)
- App mobile nativa (si las métricas justifican)
- B2B/mayorista
- Suscripción de lentes de contacto
- Multi-tienda (si hay sucursales nuevas)

## Costos operativos estimados V1

Ver `METRICS.md` sección 8. Aproximadamente $110-220/mes en infraestructura fija.

## Cómo se ejecuta localmente

```bash
# Clonar
git clone <repo>
cd optica-carballo

# Instalar
pnpm install

# Variables
cp .env.example .env.local
# llenar valores

# DB local (Supabase CLI)
supabase start
supabase db reset

# Dev server
pnpm dev
```

Detalles completos en `README.md`.
