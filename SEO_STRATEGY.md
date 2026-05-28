# Óptica Carballo — SEO Strategy

## Objetivo

Convertir a Óptica Carballo en **la autoridad de óptica online en Argentina**. Tráfico orgánico como motor principal de adquisición.

## Estado de mercado argentino

- La mayoría de ópticas argentinas usan la web como catálogo + WhatsApp.
- Pocas hacen SEO en serio. Las que sí (Lutz Ferrando, Anteojería Argentina, ÓpticaLine) son caras o limitadas.
- **Ventana enorme** para una óptica con SEO técnico + contenido riguroso + autoridad real.

## Activos heredados (capitalizar)

- **Dominio existente**: `opticacarballo.com.ar` con historia previa.
- **30+ años de marca offline**: trust signal masivo.
- **2000+ ventas en Mercado Libre**: prueba social inicial.
- **Regente matriculada + técnico óptico**: E-E-A-T real para YMYL.

## Principios estratégicos (no se rompen)

1. **Topical authority**: cubrir un tema en profundidad gana sobre cubrir 100 superficialmente.
2. **Marcas primero, formas después**: el keyword research lo demostró (marcas argentinas tienen diff 6-10).
3. **Pillar pages + clusters**: cada cluster tiene un pillar y 5-8 satélites con internal linking bidireccional.
4. **E-E-A-T en cada artículo de salud**: byline con credenciales, revisor, fecha actualizada, fuentes.
5. **Español argentino estricto**: vos, anteojos (no gafas), lentes de contacto (no lentillas).
6. **Mobile-first**: 70%+ del tráfico será mobile.

---

# Arquitectura de URLs

## Reglas duras

- **Idioma**: español argentino completo. `anteojos-de-sol` (no `sol`, no `sunglasses`).
- **Separador**: guión medio (`-`). Nunca underscore.
- **Sin acentos ni ñ**: `montura` no `montura`, `anos` no `años`.
- **Sin stop words excepto cuando ayudan**: ok `de`, `para`, `con`.
- **Sin fechas en URLs** salvo si la keyword las requiere (`tendencias-2026`).
- **Sin parámetros indexables**: filtros via query params con `noindex`.
- **HTTPS obligatorio, sin www, sin trailing slash**.
- **hreflang `es-AR`** siempre.
- **Canonical explícito** en toda página.

## Estructura completa

```
/                                                       ← home

# Anteojos de Sol
/anteojos-de-sol                                        ← pillar categoría
/anteojos-de-sol/[marca]                                ← marca page
/anteojos-de-sol/[marca]/[hombre|mujer]                 ← gender split
/anteojos-de-sol/[marca]/[slug-producto]                ← producto
/anteojos-de-sol/[forma]                                ← forma (redondos, etc)
/anteojos-de-sol/[feature]                              ← feature (polarizados, etc)
/anteojos-de-sol/para-cara/[forma]                      ← uso por forma de cara
/anteojos-de-sol/colecciones/[nombre]                   ← colecciones especiales
/anteojos-de-sol/ofertas                                ← landing de ofertas

# Anteojos de Receta
/anteojos-de-receta                                     ← pillar
/anteojos-de-receta/[marca]
/anteojos-de-receta/[marca]/[slug-producto]
/anteojos-de-receta/multifocales
/anteojos-de-receta/monofocales
/anteojos-de-receta/blue-light
/anteojos-de-receta/infantiles

# Lentes de Contacto
/lentes-de-contacto                                     ← pillar
/lentes-de-contacto/[marca]
/lentes-de-contacto/diarias
/lentes-de-contacto/mensuales
/lentes-de-contacto/toricos
/lentes-de-contacto/multifocales
/lentes-de-contacto/de-color

# Accesorios
/accesorios
/accesorios/[slug-producto]

# Páginas de uso (cluster aparte)
/anteojos-para-computadora
/anteojos-para-manejar
/anteojos-para-correr
/anteojos-para-pescar

# Guías (contenido editorial)
/guias                                                  ← hub
/guias/[slug]                                           ← artículo individual (URL plana)

# Herramientas (IA)
/herramientas/lector-de-receta
/herramientas/recomendador-de-anteojos
/herramientas/asistente
/herramientas/test-fatiga-visual

# Institucionales
/nosotros
/contacto
/sucursales
/turnos                                                 ← V2
/envios-y-devoluciones
/preguntas-frecuentes
/terminos-y-condiciones
/politica-de-privacidad
/politica-de-cookies
/boton-arrepentimiento

# Cuenta de usuario (noindex)
/mi-cuenta/*
/checkout/*
/carrito
```

## Sitemaps

- `/sitemap.xml` (index)
- `/sitemap-productos.xml`
- `/sitemap-categorias.xml`
- `/sitemap-marcas.xml`
- `/sitemap-guias.xml`
- `/sitemap-paginas.xml`

Cada uno con `<lastmod>` dinámico. Productos sin stock se sacan automáticamente.

## Robots.txt

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /carrito
Disallow: /checkout
Disallow: /mi-cuenta
Disallow: /*?

Sitemap: https://opticacarballo.com.ar/sitemap.xml
```

---

# Keyword Research

## Datos cargados (Ubersuggest, mayo 2026)

### Volúmenes principales

| Keyword | Volumen | SEO Difficulty |
|---------|---------|----------------|
| anteojos | 14.800 | 24 |
| anteojos de sol | 12.100 | 13 |
| lentes de contacto | 14.800 | 28 |
| anteojos de receta | 90 | 43 |
| optica online | 170 | 30 |
| armazones | 320 | 10 |
| lentes de contacto de color | 2.900 | 13 |

### Marcas argentinas (PRIORIDAD #1)

| Marca | Vol total | Difficulty | Estado |
|-------|-----------|------------|--------|
| **Rusty** | 6.000 | 9 | TOP — atacar primero |
| **Reef** | 3.400 | 7-9 | TOP |
| **Vulk** | 2.500 | 8 | TOP |
| **Infinit** | 2.100 | 19 | High |
| **Prune** | 2.000 | 6 | TOP — difficulty mínima |
| **Union Pacific** | 1.700 | 7 | High |
| **Wanama** | 1.100 | 7 | High |
| **Orbital** | 1.100 | 6 | High |

### Colaboraciones de celebridades

| Keyword | Vol | Difficulty |
|---------|-----|------------|
| Las Oreiro | 1.100 | 6 |
| Paula Cahen d'Anvers | 1.100 | 9 |
| Valeria Mazza | 1.100 | 10 |
| Teresa Calandra | 1.100 | 13 |
| Infinit by Pampita | 500 | 36 |

(Pendiente confirmar stock antes de activar — ADR-009)

### Marcas internacionales

| Marca | Vol | Difficulty |
|-------|-----|------------|
| Ray-Ban (con "anteojos de sol") | 7.200 | 14 |
| Prada | 2.600 | 8 |
| Miu Miu | 1.700 | 16 |
| Tiffany | 1.700 | 7 |
| Oakley | 1.400 | 8 |
| Versace | 1.100 | 9 |

### Forma de montura

| Forma | Vol | Difficulty |
|-------|-----|------------|
| Redondos | 2.100 | 18 |
| Cuadrados | 1.700 | 14 |
| Aviador | 1.100 | 10 |
| Wayfarer | 1.400 | 14 |
| Rectangulares | 1.400 | 12 |

### Features

| Feature | Vol | Difficulty |
|---------|-----|------------|
| Polarizados | 1.700 | 10 |
| Con aumento (graduados) | 3.200 | 18 |
| Deportivos | 1.100 | 10 |
| Originales | 3.900 | 10 |
| Baratos | 1.100 | 11 |
| En oferta | 1.100 | 11 |
| Por mayor | 1.400 | 8 |

### Casos de uso

| Use case | Vol | Difficulty |
|----------|-----|------------|
| Para cara redonda | 2.100 | 12 |
| Para computadora | (investigar) | - |
| Para manejar | (investigar) | - |

### Demográfico

| Tipo | Vol | Difficulty |
|------|-----|------------|
| Para hombre / hombres | 720 + 3.200 | 10 |
| Para mujer | 480 + 3.200 | 11 |

## Score de priorización

`Score = Volumen / (Difficulty + 1)`

Cuanto más alto, más prioridad. Esto da:

**Top 10 oportunidades**:
1. Rusty hombre — 3.200/10 = 320
2. Reef hombre — 1.700/8 = 213
3. Vulk hombre — 2.100/9 = 233
4. Prada — 2.600/9 = 289
5. Prune — 1.700/7 = 243
6. Union Pacific — 1.700/8 = 213
7. Tiffany — 1.700/8 = 213
8. Para mujer — 3.200/12 = 267
9. Para hombres — 3.200/11 = 291
10. Originales mujer — 3.900/11 = 325

(Los puntajes son orientativos, el agent `seo-strategist` los recalcula en cada decisión)

---

# Topic clusters

Cada cluster tiene un pillar (3.000-5.000 palabras) y 5-8 satélites (1.200-2.000 palabras).

## Cluster 1: Astigmatismo

**Pillar**: `/guias/astigmatismo-guia-completa`

**Satélites**:
- `/guias/que-es-astigmatismo-sintomas`
- `/guias/astigmatismo-grados-leve-moderado-severo`
- `/guias/lentes-de-contacto-para-astigmatismo`
- `/guias/anteojos-para-astigmatismo`
- `/guias/como-se-corrige-astigmatismo`
- `/guias/astigmatismo-en-ninos`

## Cluster 2: Miopía

**Pillar**: `/guias/miopia-guia-completa`

**Satélites**:
- `/guias/que-es-miopia-causas-sintomas`
- `/guias/miopia-en-ninos-control-progresion`
- `/guias/lentes-para-miopia-alta`
- `/guias/cirugia-miopia-vs-anteojos`
- `/guias/lentes-de-contacto-para-miopia`
- `/guias/miopia-y-fatiga-digital`

## Cluster 3: Hipermetropía

**Pillar**: `/guias/hipermetropia-guia-completa`

**Satélites**:
- `/guias/que-es-hipermetropia-sintomas`
- `/guias/hipermetropia-en-ninos`
- `/guias/diferencia-miopia-hipermetropia`
- `/guias/correccion-de-hipermetropia`

## Cluster 4: Presbicia

**Pillar**: `/guias/presbicia-guia-completa`

**Satélites**:
- `/guias/que-es-presbicia-cuando-empieza`
- `/guias/lentes-multifocales-vs-bifocales`
- `/guias/lentes-ocupacionales`
- `/guias/lentes-de-contacto-multifocales`
- `/guias/ejercicios-vista-cansada`
- `/guias/adaptacion-a-multifocales`

## Cluster 5: Anteojos para computadora / Fatiga visual digital

**Pillar**: `/guias/anteojos-para-computadora-guia-completa`

**Satélites**:
- `/guias/sindrome-visual-informatico`
- `/guias/blue-light-evidencia-real`
- `/guias/lentes-ocupacionales-para-trabajo`
- `/guias/ergonomia-visual-pantallas`
- `/guias/fatiga-visual-sintomas-prevencion`

## Cluster 6: Lentes de contacto

**Pillar**: `/guias/lentes-de-contacto-guia-completa`

**Satélites**:
- `/guias/cuidado-lentes-de-contacto`
- `/guias/primer-uso-lentes-de-contacto`
- `/guias/diarias-vs-mensuales-cual-elegir`
- `/guias/lentes-de-contacto-toricos`
- `/guias/lentes-de-contacto-problemas-comunes`
- `/guias/lentes-de-contacto-para-ninos`
- `/guias/lentes-de-contacto-de-color`

## Cluster 7: Cómo elegir anteojos

**Pillar**: `/guias/como-elegir-anteojos-guia-completa`

**Satélites**:
- `/guias/anteojos-segun-forma-de-cara`
- `/guias/anteojos-para-cara-redonda`
- `/guias/anteojos-para-cara-cuadrada`
- `/guias/anteojos-para-cara-ovalada`
- `/guias/anteojos-para-cara-corazon`
- `/guias/materiales-de-anteojos-acetato-metal-titanio`
- `/guias/medidas-anteojos-como-elegir-talle`
- `/guias/primer-par-de-anteojos`

## Cluster 8: Cómo leer una receta

**Pillar**: `/guias/como-leer-receta-anteojos`

**Satélites**:
- `/guias/que-es-esfera-en-receta-anteojos`
- `/guias/que-es-cilindro-y-eje`
- `/guias/que-es-dnp-distancia-nasopupilar`
- `/guias/que-es-adicion-en-receta`
- `/guias/receta-vencida-puedo-usar`

## Cluster 9: Tendencias

**Pillar**: `/guias/tendencias-anteojos-2026`

**Satélites** (rotan por año):
- `/guias/anteojos-de-moda-mujer-2026`
- `/guias/anteojos-de-moda-hombre-2026`
- `/guias/colores-de-moda-monturas`
- `/guias/anteojos-famosos-argentinos`

---

# Structured Data (JSON-LD)

## Tipos por página

| Página | Schemas |
|--------|---------|
| Home | `Organization` + `LocalBusiness` |
| Producto | `Product` + `Offer` o `AggregateOffer` con `hasVariant` + `AggregateRating` |
| Categoría | `CollectionPage` + `BreadcrumbList` |
| Artículo general | `Article` + `Person` (autor) |
| Artículo médico | `MedicalWebPage` adicionalmente |
| FAQ section | `FAQPage` |
| Reviews | `Review` + `AggregateRating` |
| Herramienta | `WebApplication` |

## LocalBusiness completo (home)

```json
{
  "@context": "https://schema.org",
  "@type": "Optician",
  "name": "Óptica Carballo",
  "image": "https://opticacarballo.com.ar/og-local.jpg",
  "url": "https://opticacarballo.com.ar",
  "telephone": "+54-xxx-xxx-xxxx",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[calle y número]",
    "addressLocality": "Virasoro",
    "addressRegion": "Corrientes",
    "postalCode": "[CP]",
    "addressCountry": "AR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "...",
    "longitude": "..."
  },
  "openingHoursSpecification": [...],
  "founder": {
    "@type": "Person",
    "name": "[Nombre del fundador]"
  },
  "foundingDate": "1995",
  "employee": [
    {
      "@type": "Person",
      "name": "María Carlota Carballo",
      "jobTitle": "Óptica Regente",
      "hasCredential": {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "license",
        "name": "Matrícula Profesional de Óptica"
      }
    },
    {
      "@type": "Person",
      "name": "Juan Carballo",
      "jobTitle": "Técnico Superior en Óptica y Contactología"
    }
  ]
}
```

(Datos exactos a completar)

---

# Internal linking rules

1. **Breadcrumbs en toda página** (excepto home) con `BreadcrumbList` schema.
2. **Producto → categoría padre + marca + productos similares (4-8) + guía relacionada**.
3. **Categoría → subcategorías + top productos + pillar guide del cluster**.
4. **Artículo satélite → pillar + 2-4 otros satélites del cluster + 2-3 productos relacionados**.
5. **Pillar → todos los satélites del cluster**.
6. **Footer sitewide → top 10 categorías + top 10 guías + páginas institucionales**.
7. **Anchor text descriptivo**. Nunca "click acá", "leer más" como único anchor. Variar naturalmente.

---

# Meta tags

## Title

- Máximo 60 caracteres
- Patrón: `[Keyword principal] | [Diferenciador útil] - Óptica Carballo`
- Ejemplos:
  - `Anteojos de Sol Rusty Hombre | Originales con Envío - Óptica Carballo`
  - `Guía: Cómo Leer la Receta de Anteojos | Óptica Carballo`
  - `Lentes de Contacto Acuvue Oasys Mensuales | Óptica Carballo`

## Meta description

- 150-160 caracteres
- Keyword principal + propuesta de valor + CTA suave
- Ejemplo: `Anteojos Rusty originales para hombre. Envíos a todo el país, 30 años de experiencia, asesoramiento de técnico óptico. Cuotas sin interés.`

## H1

- Único en la página, con keyword principal natural.

---

# E-E-A-T para YMYL

Cada página de salud/óptica incluye:

1. **Byline con credenciales visibles**:
   ```
   Por Juan Carballo
   Técnico Superior en Óptica y Contactología — Mat. [número]
   ```

2. **Reviewer cuando aplica**:
   ```
   Revisado por María Carlota Carballo, Óptica Regente
   Matrícula Profesional [número]
   ```

3. **Fecha de publicación + última actualización**.

4. **Fuentes citadas** (cuando hay datos): OMS, Sociedad Argentina de Oftalmología, AAO, PubMed, Essilor/Zeiss/Hoya, Johnson & Johnson, etc.

5. **Disclaimer médico** al final:
   > Este contenido tiene fines informativos y no reemplaza el diagnóstico ni el tratamiento de un médico oftalmólogo matriculado.

6. **Schema `Person` para autor** con `jobTitle`, `worksFor`, `hasCredential`.

---

# Performance (Core Web Vitals)

Targets:
- LCP <2.5s
- INP <200ms
- CLS <0.1
- TTFB <600ms

Tácticas:
- `next/image` con dimensiones explícitas en todas las imágenes.
- `next/font` para fuentes (sin FOIT/FOUT).
- Imágenes en WebP/AVIF.
- Lazy loading excepto LCP.
- Bundle splitting agresivo.
- Edge rendering donde aplica.
- Prefetch de links críticos.

---

# Monitoring SEO

## Diario
- Errores 4xx/5xx (Vercel logs)
- Sitemap accesible

## Semanal
- GSC: impresiones, clicks, CTR, posición
- Páginas con problemas de indexación
- Páginas con CTR <2% (problema de meta tags)

## Mensual
- Crecimiento de páginas en top 10
- Comparación contra targets de `METRICS.md`
- Análisis de queries inesperadas (oportunidades nuevas)
- Auditoría con agente `seo-strategist`

## Trimestral
- Análisis de competencia (skill `/competitor-analysis`)
- Refresh del keyword research
- Re-priorización del backlog editorial

---

# Pendientes SEO

1. **Verificar dominio en GSC** una vez en producción.
2. **Configurar GA4** con eventos custom.
3. **Verificar redirects** de URLs viejas del Mercadoshops (ver PEND-003 en DECISIONS.md).
4. **Backlinks**: estrategia post-launch (mes 3+). Posibles fuentes: directorios locales, blogs de salud argentinos, prensa local de Corrientes.
5. **Google Business Profile** del local físico (para LocalBusiness signals).

---

# Notas finales

- Este archivo es **vivo**. Cada nueva oportunidad descubierta se agrega acá.
- El `seo-strategist` es el guardián. Cualquier cambio estructural pasa por él.
- En cada `/agent-review`, se evalúa si la estrategia sigue alineada con los datos reales.
