# Skill: Escribir Guía / Artículo (`/article`)

## Cuándo usar esto

Cuando se va a escribir un artículo para `/guias/` (pillar o satélite). Sigue el proceso de E-E-A-T riguroso necesario para YMYL en óptica.

## Antes de arrancar

Leer:
- `CONTENT_PLAN.md` (qué artículo corresponde, qué cluster, qué keyword target)
- `SEO_STRATEGY.md` (reglas de URLs, internal linking, structured data)
- `BRANDS.md` (qué marcas mencionamos, evitar inventar)
- `PRODUCTS_INVENTORY.md` (qué productos podemos linkear)

Invocar agentes:
- `content-writer-medical` (autor principal del texto)
- `optical-expert` (validador técnico — consultar ANTES de empezar si hay temas complejos)
- `seo-strategist` (keyword target + meta tags + internal links)

## Proceso

### Step 1 — Definir parámetros del artículo

Confirmar antes de escribir:

```yaml
slug: "como-leer-receta-anteojos"
keyword_target_principal: "como leer receta de anteojos"
keywords_secundarias:
  - "como interpretar receta oftalmologica"
  - "que significa esfera cilindro eje"
  - "que es la dnp"
cluster: "Cómo leer una receta"  # de SEO_STRATEGY.md
tipo: "pillar"  # pillar (3000-5000 palabras) o satellite (1200-2000)
intencion: "informational"
productos_a_embebir: []  # vacío para educativos puros, lleno para transaccionales
internal_links_target:
  - /guias/que-es-esfera-en-receta-anteojos
  - /guias/que-es-cilindro-y-eje
  - /herramientas/lector-de-receta
fuentes_referencia:
  - "Organización Mundial de la Salud"
  - "American Academy of Ophthalmology"
  - "Sociedad Argentina de Oftalmología"
```

### Step 2 — Outline detallado

Antes de escribir prosa, generar la estructura completa:

```markdown
# H1: Cómo leer la receta de anteojos: guía completa

## Intro (200 palabras)
- Hook: la receta de anteojos parece código secreto
- Promesa: al final de este artículo vas a entender cada número
- Quién escribe (E-E-A-T)

## H2: Qué es una receta de anteojos
- Definición
- Quién la emite (oftalmólogo, no óptico)
- Vigencia típica en Argentina

## H2: Los campos principales de la receta
### H3: Esfera (Esf / Sph)
### H3: Cilindro (Cil / Cyl)
### H3: Eje (Ax)
### H3: Adición (Add)
### H3: Distancia nasopupilar (DNP)

## H2: Convenciones que ves seguido
- OD vs OI
- Plano / esférico
- C/C y S/C
- DP / NP / Inter

## H2: Cómo identificar errores o datos faltantes
[...]

## H2: ¿Necesitás una receta para comprar anteojos online?
- Cuándo sí, cuándo no
- Validación en Óptica Carballo

## H2: Lo que sigue después de tener tu receta
- CTA al lector de receta IA
- CTA a WhatsApp para asesoramiento

## FAQ
- ¿Qué pasa si mi receta venció?
- ¿Puedo usar la receta de hace 3 años?
- ¿Mi receta de anteojos sirve para contactos?
- [...]

## Conclusión + CTA

## Bibliografía / fuentes
```

**Validar el outline con el founder antes de escribir**.

### Step 3 — Escribir el artículo

Estructura por sección (siguiendo el agente `content-writer-medical`):

**Bylines (debajo del H1)**:
```markdown
Por Juan Carballo
Técnico Superior en Óptica y Contactología — Mat. [número]
Revisado por María Carlota Carballo, Óptica Regente
Publicado el [fecha] · Actualizado el [fecha]
Tiempo de lectura: [X] min
```

**Tono y estilo**:
- Español argentino (vos, anteojos, lentes de contacto)
- Divulgativo serio (ni infantil ni doctoral)
- Frases cortas y medianas
- Sin AI-isms ("imaginá", "exploremos", "es importante notar", "vital", "esencial", em dashes decorativos)
- Voz activa por default
- Párrafos de 3-5 líneas máximo

**Tablas comparativas** donde corresponda (Google las extrae como rich results).

**Listas** solo cuando hay enumeración clara. NO para fragmentar prosa.

### Step 4 — Internal linking

Reglas:
- **3-8 internal links** por artículo
- Anchor text descriptivo (no "click acá", no "leer más")
- Distribuir, no acumular al final
- Para satélite: linkear al pillar del cluster + 2-3 satélites hermanos + productos relacionados
- Para pillar: linkear a TODOS los satélites del cluster

### Step 5 — Embedir productos (si transaccional)

Componente: `<ProductCard productId="..." />` o similar.

Reglas:
- 3-6 productos por artículo (no listar 20)
- Variedad de precios cuando se puede
- Productos del catálogo REAL (verificar en `PRODUCTS_INVENTORY.md`)
- Contexto claro: por qué este producto es relevante para el tema

### Step 6 — FAQ (al final)

4-8 preguntas frecuentes sobre el tema:
- Cada respuesta 40-80 palabras
- Preguntas son keywords reales (consultar Google "People Also Ask")
- Incluir `FAQPage` schema

### Step 7 — Disclaimer médico (si toca salud)

Al final, antes del CTA:

```markdown
> Este contenido tiene fines informativos y no reemplaza el diagnóstico ni el tratamiento de un médico oftalmólogo matriculado. Ante cualquier síntoma o duda sobre tu salud visual, consultá a un profesional.
```

### Step 8 — Bibliografía

Si el artículo cita datos:
- Lista al final con links a fuentes
- Preferidas: OMS, Sociedad Argentina de Oftalmología, AAO, papers PubMed, sitios de fabricantes
- Evitar: Wikipedia, sitios de marketing sin respaldo, foros

### Step 9 — Validación técnica con `optical-expert`

Antes de publicar, **pasar el artículo por `optical-expert`**:
- "Validá técnicamente este artículo. Marcá cualquier error u oversimplificación peligrosa."
- Aplicar correcciones.
- Si no hay errores, perfecto.

### Step 10 — SEO on-page final

Con `seo-strategist`:

**Frontmatter del artículo**:
```yaml
title: "Cómo leer la receta de anteojos: guía completa"
slug: "como-leer-receta-anteojos"
meta_title: "Cómo Leer la Receta de Anteojos: Guía Completa | Óptica Carballo"
meta_description: "Aprendé qué significa cada número de tu receta de anteojos: esfera, cilindro, eje, adición, DNP. Explicado por un técnico óptico matriculado."
cover_image_url: "..."
og_image: "..."
category: "salud-visual"
tags: ["recetas", "salud-visual", "educacion"]
author_name: "Juan Carballo"
author_credentials: "Técnico Superior en Óptica y Contactología - Mat. [número]"
reviewed_by: "María Carlota Carballo, Óptica Regente"
related_product_ids: []
published_at: "2026-XX-XX"
status: "published"
```

**Structured data JSON-LD** a incluir:
- `Article`
- `MedicalWebPage` (si toca salud)
- `Person` para autor y revisor (con credenciales)
- `BreadcrumbList`
- `FAQPage` (si hay FAQ)

### Step 11 — Publicar

1. Marcar `status: published`
2. Verificar `published_at` correcto
3. Sitemap se regenera automáticamente
4. Verificar visualmente:
   - URL accesible
   - Imagen de cover carga
   - Internal links funcionan
   - FAQ accordion funciona
   - Structured data válido (https://validator.schema.org)
   - Mobile + desktop OK

### Step 12 — Actualizar tracking

1. `CONTENT_PLAN.md`: marcar artículo como ✅ Publicado
2. `CURRENT_STATE.md`: agregar nota de publicación
3. Programar review post-publicación a las 4-6 semanas (medir performance en GSC)

## Checklist final por artículo

- [ ] Keyword principal aparece en H1, primer párrafo, y se distribuye natural cada 300-500 palabras
- [ ] Keywords secundarias distribuidas en H2/H3
- [ ] Bylines completos con credenciales
- [ ] Disclaimer médico si toca salud
- [ ] 3-8 internal links bien posicionados
- [ ] 0 AI-isms (revisar lista)
- [ ] Tono argentino consistente
- [ ] Fuentes citadas si hay datos
- [ ] FAQ con FAQPage schema
- [ ] CTA claro al final
- [ ] Sin promesas no cumplibles
- [ ] Validado por `optical-expert`
- [ ] Meta title <60 chars
- [ ] Meta description 150-160 chars
- [ ] H1 único
- [ ] Structured data válido
- [ ] Cover image optimizada
- [ ] URL canonical correcta
- [ ] Mobile + desktop verificados

## Reglas duras

1. **NUNCA inventar datos técnicos**. Si dudás, consultá `optical-expert`.
2. **NUNCA prometer cosas no cumplibles** ("blue light protege la retina").
3. **NUNCA copiar contenido de otra fuente**. Cero plagio.
4. **NUNCA omitir bylines o disclaimer** en artículos de salud.
5. **NUNCA publicar sin validación técnica** si toca salud visual o productos.
6. **NUNCA hacer keyword stuffing**. La keyword debe sentirse natural.
7. **NUNCA usar "tú" o "vosotros"** — siempre "vos".

## Reciclaje y refresh

Cada artículo se revisa cada 6-12 meses:
- ¿La info sigue siendo precisa?
- ¿Las fuentes siguen vigentes?
- ¿Hay nuevas keywords secundarias para incorporar?
- ¿Los productos linkeados existen aún?

Refresh contribuye al SEO (Google ama contenido fresco en YMYL).

Para hacer un refresh, correr este mismo skill pero saltando los Steps 1-2 (ya están).
