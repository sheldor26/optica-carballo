# Óptica Carballo — Brands

## Qué es este archivo

Catálogo vivo de todas las marcas que vendemos (o consideramos vender). Para cada marca:
- Slug oficial (para URLs)
- Categoría / segmento
- País de origen
- Líneas / colecciones disponibles
- Estado de stock
- Página propia en el sitio

Usado por:
- `optical-expert` para no inventar marcas o líneas
- `seo-strategist` para priorizar páginas de marca según volumen
- `content-writer-medical` para escribir páginas de marca con precisión
- Founder al cargar productos nuevos

## Estados

- 🟢 **Activa**: vendemos, con stock real.
- 🟡 **Parcial**: stock limitado, evaluar si vale la pena tener página.
- ⚪ **Considerada**: en evaluación para sumar.
- 🔴 **Discontinuada**: vendíamos pero ya no.

---

# Marcas con stock real confirmado (2026-05-28)

Las 5 marcas que **Óptica Carballo trabaja efectivamente HOY**, confirmadas por el founder:
**Rusty, Vulk, Reef, Mormaii, Paula Cahen D'Anvers** — todas en sol Y receta.

> ⚠️ El flag `is_argentine` en DB se aplica a las 5 (incluso Mormaii que es brasilera de origen). Pasa a significar "marca con presencia argentina / pensada como local" más que "origen argentino estricto". Ver ADR-023.

---

# Marcas Argentinas (PRIORIDAD #1 según keyword research)

## Rusty

- **Slug**: `rusty`
- **URL**: `/anteojos-de-sol/rusty`
- **País**: Argentina (Australia origen, fabricación local)
- **Segmento**: Medio. Joven. Surf/skate lifestyle.
- **Categorías**: Anteojos de sol (principal), receta (algunas líneas)
- **Líneas conocidas**: Xold, Terdey, otras
- **Volumen SEO**: 6.000/mes (top oportunidad, diff 9)
- **Páginas hijas a tener**:
  - `/anteojos-de-sol/rusty/hombre` (3.200 vol)
  - `/anteojos-de-sol/rusty/mujer` (2.600 vol)
- **Estado**: 🟢 Activa — stock confirmado 2026-05-28. Sol Y receta.

## Reef

- **Slug**: `reef`
- **URL**: `/anteojos-de-sol/reef`
- **País**: USA, distribución argentina
- **Segmento**: Medio. Joven. Beach lifestyle.
- **Categorías**: Anteojos de sol
- **Volumen SEO**: 3.400/mes (diff 7-9)
- **Páginas hijas**: `/hombre`, `/mujer`
- **Estado**: 🟢 Activa — stock confirmado 2026-05-28. Sol Y receta.

## Vulk

- **Slug**: `vulk`
- **URL**: `/anteojos-de-sol/vulk` y `/anteojos-de-receta/vulk`
- **País**: Argentina
- **Segmento**: Medio. Buena relación precio/calidad.
- **Categorías**: Anteojos de sol + receta
- **Volumen SEO**: 2.500/mes (diff 8)
- **Páginas hijas**: `/hombre`, `/mujer`
- **Estado**: 🟢 Activa — stock confirmado 2026-05-28. Sol Y receta.

## Mormaii

- **Slug**: `mormaii`
- **URL**: `/anteojos-de-sol/mormaii` y `/anteojos-de-receta/mormaii`
- **País**: Brasil (origen), tratada como local en este catálogo por presencia argentina (ver ADR-023).
- **Segmento**: Medio. Surf / outdoor lifestyle.
- **Categorías**: Sol + receta
- **Estado**: 🟢 Activa — stock confirmado 2026-05-28. Sol Y receta.

## Paula Cahen D'Anvers

- **Slug**: `paula-cahen-danvers`
- **URL**: `/anteojos-de-sol/paula-cahen-danvers` y `/anteojos-de-receta/paula-cahen-danvers`
- **País**: Argentina. Colaboración / colección de Paula Cahen D'Anvers.
- **Segmento**: Medio. Target principal: mujer.
- **Categorías**: Sol + receta
- **Volumen SEO**: 1.100/mes (diff 9, según keyword research previo).
- **Estado**: 🟢 Activa — stock confirmado 2026-05-28. Cierra parcialmente ADR-009 (PEND-002) para esta colección.
- **Nota**: en BRANDS.md original aparecía también en sección "Colaboraciones de celebridades" como pendiente. Mantenemos esa entrada por histórico, pero el estado real ahora es activa.

## Infinit

- **Slug**: `infinit`
- **URL**: `/anteojos-de-sol/infinit` y `/anteojos-de-receta/infinit`
- **País**: Argentina
- **Segmento**: Medio-alto. Colaboraciones con celebrities.
- **Categorías**: Sol + receta
- **Volumen SEO**: 2.100/mes (diff 19)
- **Colaboraciones conocidas**:
  - Infinit by Pampita (500 vol)
- **Estado**: ⚪ Pendiente confirmar stock

## Prune

- **Slug**: `prune`
- **URL**: `/anteojos-de-sol/prune` y `/anteojos-de-receta/prune`
- **País**: Argentina
- **Segmento**: Medio. Marca de cartera/lifestyle. Target principal: mujer.
- **Categorías**: Sol + receta
- **Volumen SEO**: 2.000/mes (diff 6 — el más bajo de las marcas top)
- **Estado**: ⚪ Pendiente confirmar stock

## Union Pacific

- **Slug**: `union-pacific`
- **URL**: `/anteojos-de-sol/union-pacific`
- **País**: Argentina
- **Segmento**: Medio
- **Categorías**: Sol
- **Volumen SEO**: 1.700/mes (diff 7)
- **Estado**: ⚪ Pendiente confirmar stock

## Wanama

- **Slug**: `wanama`
- **URL**: `/anteojos-de-sol/wanama`
- **País**: Argentina (marca de ropa, extiende a anteojos)
- **Segmento**: Medio. Joven. Lifestyle.
- **Categorías**: Sol
- **Volumen SEO**: 1.100/mes (diff 7)
- **Estado**: ⚪ Pendiente confirmar stock

## Orbital

- **Slug**: `orbital`
- **URL**: `/anteojos-de-sol/orbital`
- **País**: Argentina
- **Segmento**: Medio-económico
- **Categorías**: Sol
- **Volumen SEO**: 1.100/mes (diff 6)
- **Estado**: ⚪ Pendiente confirmar stock

## Cohiba

- **Slug**: `cohiba`
- **URL**: `/anteojos-de-sol/cohiba`
- **País**: Argentina (importadora)
- **Segmento**: Medio. Clásico.
- **Categorías**: Sol
- **Estado**: ⚪ Pendiente confirmar stock

---

# Colaboraciones de celebridades argentinas

Vendrían en `/anteojos-de-sol/colecciones/[slug]`.

## Las Oreiro (by Infinit)

- **Slug**: `las-oreiro`
- **URL**: `/anteojos-de-sol/colecciones/las-oreiro`
- **Marca madre**: Infinit
- **Diseñadoras**: Natalia y Julieta Oreiro
- **Volumen SEO**: 1.100/mes (diff 6)
- **Estado**: 🔴 Pendiente confirmar stock antes de armar página (ADR-009)

## Paula Cahen d'Anvers

- **Slug**: `paula-cahen-danvers`
- **URL**: `/anteojos-de-sol/colecciones/paula-cahen-danvers`
- **Volumen SEO**: 1.100/mes (diff 9)
- **Estado**: 🔴 Pendiente

## Valeria Mazza

- **Slug**: `valeria-mazza`
- **URL**: `/anteojos-de-sol/colecciones/valeria-mazza`
- **Volumen SEO**: 1.100/mes (diff 10)
- **Estado**: 🔴 Pendiente

## Teresa Calandra

- **Slug**: `teresa-calandra`
- **URL**: `/anteojos-de-sol/colecciones/teresa-calandra`
- **Volumen SEO**: 1.100/mes (diff 13)
- **Estado**: 🔴 Pendiente

## Pampita (Infinit by Pampita)

- **Slug**: `pampita`
- **URL**: `/anteojos-de-sol/colecciones/pampita`
- **Marca madre**: Infinit
- **Volumen SEO**: 500/mes (diff 36)
- **Estado**: 🔴 Pendiente

---

# Marcas Internacionales

## Ray-Ban (Luxottica)

- **Slug**: `ray-ban`
- **URL**: `/anteojos-de-sol/ray-ban` y `/anteojos-de-receta/ray-ban`
- **País**: Italia (Luxottica)
- **Segmento**: Premium. Líder global.
- **Líneas icónicas**: Wayfarer, Aviator, Clubmaster, Justin, Erika, Hexagonal, Round Metal, New Wayfarer
- **Volumen SEO**: 7.200/mes con "anteojos de sol ray ban mujer" (diff 14)
- **Páginas hijas**: `/hombre`, `/mujer`
- **Páginas de modelo recomendadas** (si stock):
  - `/anteojos-de-sol/ray-ban/wayfarer` (1.400 vol específico)
  - `/anteojos-de-sol/ray-ban/aviator`
- **Estado**: ⚪ Pendiente

## Oakley (Luxottica)

- **Slug**: `oakley`
- **URL**: `/anteojos-de-sol/oakley`
- **Segmento**: Premium deportivo
- **Volumen SEO**: 1.400/mes (diff 8)
- **Estado**: ⚪ Pendiente

## Prada (Kering / Luxottica)

- **Slug**: `prada`
- **URL**: `/anteojos-de-sol/prada` y `/anteojos-de-receta/prada`
- **Segmento**: Luxury fashion
- **Volumen SEO**: 2.600/mes (diff 8)
- **Estado**: ⚪ Pendiente

## Miu Miu

- **Slug**: `miu-miu`
- **URL**: `/anteojos-de-sol/miu-miu`
- **Segmento**: Luxury fashion (sub-Prada)
- **Volumen SEO**: 1.700/mes (diff 16)
- **Estado**: ⚪ Pendiente

## Versace

- **Slug**: `versace`
- **URL**: `/anteojos-de-sol/versace`
- **Segmento**: Luxury fashion
- **Volumen SEO**: 1.100/mes (diff 9)
- **Estado**: ⚪ Pendiente

## Tiffany & Co

- **Slug**: `tiffany`
- **URL**: `/anteojos-de-sol/tiffany`
- **Segmento**: Luxury jewelry/fashion
- **Volumen SEO**: 1.700/mes (diff 7)
- **Estado**: ⚪ Pendiente

## Persol (Luxottica)

- **Slug**: `persol`
- **URL**: `/anteojos-de-sol/persol`
- **Segmento**: Premium italiano clásico
- **Estado**: ⚪ Pendiente

## Carrera

- **Slug**: `carrera`
- **URL**: `/anteojos-de-sol/carrera`
- **Segmento**: Medio. Deportivo/casual.
- **Estado**: ⚪ Pendiente

## Police

- **Slug**: `police`
- **URL**: `/anteojos-de-sol/police`
- **Segmento**: Medio. Casual joven.
- **Estado**: ⚪ Pendiente

---

# Marcas de Lentes de Contacto

## Acuvue (Johnson & Johnson)

- **Slug**: `acuvue`
- **URL**: `/lentes-de-contacto/acuvue`
- **Segmento**: Premium global, líder.
- **Líneas**:
  - **Moist** — diarias hidrogel
  - **TruEye** — diarias silicona-hidrogel
  - **Oasys** — quincenales/mensuales silicona-hidrogel
  - **Vita** — mensuales premium
  - **Define** — color cosmético
- **Estado**: ⚪ Pendiente confirmar líneas en stock

## Bausch + Lomb

- **Slug**: `bausch-lomb`
- **URL**: `/lentes-de-contacto/bausch-lomb`
- **Líneas**:
  - **Biotrue** — diarias hidrogel
  - **Ultra** — mensuales silicona-hidrogel
  - **SofLens** — quincenales
  - **PureVision** — mensuales
- **Estado**: ⚪ Pendiente

## Alcon (CIBA Vision)

- **Slug**: `alcon`
- **URL**: `/lentes-de-contacto/alcon`
- **Líneas**:
  - **Dailies Total 1** — diarias premium
  - **Dailies AquaComfort** — diarias hidrogel
  - **Air Optix** — mensuales silicona-hidrogel
- **Estado**: ⚪ Pendiente

## CooperVision

- **Slug**: `coopervision`
- **URL**: `/lentes-de-contacto/coopervision`
- **Líneas**:
  - **Biofinity** — mensuales silicona-hidrogel
  - **MyDay** — diarias silicona
  - **Avaira** — quincenales
  - **Proclear** — para ojo seco
- **Estado**: ⚪ Pendiente

---

# Marcas de Lentes Oftálmicos (para anteojos de receta)

(No tienen página propia en general, pero se mencionan en páginas de producto y guías)

## Essilor

- **Líneas**: Varilux (multifocales), Crizal (antireflejo), Transitions, Eyezen
- **Segmento**: Premium global

## Zeiss

- **Líneas**: Zeiss progressive, DuraVision antireflejo, PhotoFusion fotosensible
- **Segmento**: Premium

## Hoya

- **Líneas**: Hoyalux progressive, HiVision antireflejo, Sensity fotosensible
- **Segmento**: Premium

## Shamir, Indo, Rodenstock

- **Segmento**: Premium

---

# Cómo agregar una marca nueva

1. Crear entrada acá con todos los campos del template.
2. Si tiene volumen SEO relevante (>500/mes), crear página en `seo-strategist` con meta tags y contenido.
3. Cargar productos en `products` table.
4. Asociar productos a marca via `brand_id`.
5. Actualizar `PRODUCTS_INVENTORY.md` con el progreso de carga.
6. Si se quiere artículo SEO dedicado, agregar a `CONTENT_PLAN.md`.

## Template

```markdown
## [Nombre]

- **Slug**: `[slug]`
- **URL**: `/[categoria]/[slug]`
- **País**: 
- **Segmento**: 
- **Categorías**: 
- **Líneas**: 
- **Volumen SEO**: 
- **Estado**: 🟢/🟡/⚪/🔴
- **Notas**: 
```

---

# Notas finales

- Este archivo se actualiza cada vez que se agrega/quita una marca del catálogo.
- Validación de stock real: hablar con founder o regente.
- Si el `seo-strategist` propone una marca nueva, debe pasar por revisión de stock antes de crear página.
