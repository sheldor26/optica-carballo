# Óptica Carballo — Backlog

Lista de pendientes acumulados que NO están bloqueando la próxima feature.
Son cosas chicas/medianas, mejoras visuales, optimizaciones, deuda técnica
liviana, o cosas que esperan input externo (assets, decisiones del founder).

## Cómo usar este archivo

- Cada vez que aparezca algo "para hacer después" — entra acá.
- Las features grandes con planificación propia NO entran acá — van como
  decisiones en `DECISIONS.md` y se ejecutan con el skill `/feature`.
- Cuando algo se completa, mover a `## Hecho` con commit hash + fecha.
- Si algo lleva 3+ meses sin tocarse, considerar moverlo a `## Descartado`.

---

## 🟡 Pendiente — assets visuales (esperan al founder)

- [ ] **OG image 1200×630** → `app/opengraph-image.png` (Next 15 auto-detecta
  + meta `og:image`). Mejora preview en WhatsApp, redes, links compartidos.
  Founder dijo "lo voy a hacer luego" (2026-05-28).
- [ ] **Versión transparente del isotipo** (PNG con alpha o SVG) para usar
  en el header sobre fondo blanco sin el cuadrado azul como marco. La
  actual funciona como badge pero no es ideal a nivel diseño.
- [ ] **Fotos reales de productos**. Reemplazar el placeholder gris "Foto
  pendiente" en `product-card.tsx` y `product-gallery.tsx`. Requiere
  fotos físicas de los productos + decidir bucket (Supabase Storage cuando
  haya más de 50 productos; `public/products/` mientras tanto).

## 🔴 Pendiente bloqueante para cart en producción (acción del founder)

- [ ] **Generar `CART_COOKIE_SECRET` para Vercel** (production env):
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  Agregar en Vercel Environment Variables como `CART_COOKIE_SECRET` (Production + Preview). **Debe ser DIFERENTE al de `.env.local`** — buena práctica de aislamiento. Sin esto, el cart tira error en runtime en prod.

## 🔴 Pendiente bloqueante para Auth UI en producción (acción del founder)

- [ ] **Configurar Redirect URLs en Supabase Auth** (Dashboard → Authentication → URL Configuration):
  - **Site URL**: `https://opticacarballo.com.ar`
  - **Redirect URLs** (Additional Redirect URLs):
    - `https://opticacarballo.com.ar/auth/callback`
    - `https://opticacarballo.com.ar/recuperar-clave/restablecer`
    - `http://localhost:3000/auth/callback`
    - `http://localhost:3000/recuperar-clave/restablecer`
  - Sin esto, los emails de confirmación de signup y de reset de contraseña tendrán links que no funcionan (Supabase los bloquea por seguridad).
- [ ] **Customizar templates de email** en Supabase Dashboard → Authentication → Email Templates:
  - Confirmar email (signup) → asunto + body en español, mencionar "Óptica Carballo".
  - Magic link → no usar (no implementado).
  - Reset password → asunto + body en español.
  - Change email → asunto + body en español.
  - Por default vienen en inglés y genéricos — se ven poco profesionales.

## 🟡 Pendiente — data real (acción del founder)

- [ ] **Reemplazar productos `[PH]`** en `supabase/seeds/02_rusty_products.sql`
  con nombres, descripciones, precios reales. Reaplicar al cloud.
- [ ] **Cargar productos de las otras 4 marcas** (Vulk, Reef, Mormaii,
  Paula Cahen D'Anvers) — actualmente solo Rusty tiene productos cargados.
- [ ] **Reemplazar `[PENDIENTE]` en páginas legales**: plazos de
  devolución, garantía, días de reintegro. Editar `politica-de-devolucion`
  y `boton-de-arrepentimiento`.
- [ ] **Completar env vars del negocio**:
  - `NEXT_PUBLIC_REGENTE_MATRICULA`
  - `NEXT_PUBLIC_TECNICO_MATRICULA`
  - `NEXT_PUBLIC_BUSINESS_PHONE`
  - `NEXT_PUBLIC_BUSINESS_ADDRESS_STREET`
  - `NEXT_PUBLIC_BUSINESS_ADDRESS_POSTAL`
  - `NEXT_PUBLIC_WHATSAPP_NUMBER`
  - + email oficial (sin var todavía, agregar cuando se defina).
- [ ] **Confirmar política de devolución exacta** con la regente (plazos,
  qué se acepta, qué no).
- [ ] **CUIT del negocio** para facturación AFIP futura.

## 🟢 Mejoras técnicas (sin urgencia)

- [ ] **Crear `clean` script** en `package.json` (`rm -rf .next`). Cuando
  movemos rutas, el cache stale rompe el typecheck (LEARNING ya registrado
  2026-05-28). Un script lo hace más visible.
- [ ] **Migrar `pnpm lint`** a la CLI nueva de ESLint (Next 15 deprecó
  `next lint`, en Next 16 se elimina). Comando: `npx @next/codemod@canary
  next-lint-to-eslint-cli .`. No urgente — sigue funcionando bien.
- [ ] **Texto SEO 150-300 palabras por marca** en `/anteojos-de-sol/[brand]`.
  Requiere ALTER TABLE para agregar `brands.seo_intro` y `brands.seo_outro`.
  Sub-feature de mejora de SEO (seo-strategist lo sugirió en ese momento).
- [ ] **FAQ schema** en páginas de marca (3-5 preguntas frecuentes con
  `FAQPage` JSON-LD). Bajo esfuerzo, alto CTR potencial.
- [ ] **AggregateOffer a nivel categoría** (`/anteojos-de-sol`) con
  `priceRange` min/max. Rich result.
- [ ] **`engines.npm` en package.json** para que falle si alguien usa
  npm en vez de pnpm. Ya hay `packageManager` field, pero engines.npm con
  versión inexistente sería más explícito.

## 🟢 Features menores futuras

- [ ] **Página `/sucursales`** o sección con mapa cuando se confirme la
  dirección exacta (Virasoro, Corrientes).
- [ ] **Páginas individuales de las otras marcas** activadas cuando tengan
  productos.
- [ ] **Estado "destacados" en home** cuando haya productos con
  `is_featured = true` reales (no `[PH]`).
- [ ] **Sub-categorías** por forma (Aviador, Wayfarer, Redondo) y por uso
  (Polarizados, Deportivos, Con aumento — este último ADR-010).
  Implementación con `categories.parent_id`.
- [ ] **Filtros** dentro de página de marca (color, forma, precio rango).

---

## ✅ Hecho

- 2026-05-28: API key comprometida rotada por el founder. Nueva key en
  `.env.local`.
- 2026-05-28: Migración 00001 (catálogo) aplicada al cloud (verificada).
- 2026-05-28: Migración 00002 (identity + orders) aplicada al cloud
  (post cloud drift detectado y resuelto — ver MISTAKES.md 2026-05-28
  "CLOUD_APPLIED marcó ✅ sin verificación real"). Verificada con SELECT.
- 2026-05-28: Migración 00003 (order_number generator) aplicada al cloud
  junto con 00002. Verificada con SELECT.

## ❌ Descartado

(vacío)
