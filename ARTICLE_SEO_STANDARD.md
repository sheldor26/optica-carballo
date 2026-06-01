# Estándar de producción SEO para guías — Óptica Carballo

> La "biblia" SEO que `content-writer-medical` aplica en CADA guía bajo `/guias/[slug]`.
> Diseñado por `seo-strategist` (2026-06-01), **corregido contra el código real**
> (el agente tuvo fallas de I/O y confabuló parte del estado actual — ver "Estado
> real del código" abajo). Vertical YMYL salud visual, mercado AR, español rioplatense.
>
> **Regla madre**: una guía no sale de `draft: true` hasta pasar el checklist (§8) tilde por tilde.

## Estado real del código (verificado, NO lo que dijo el agente)
- Artículos: `lib/content/articles.ts` + `article-types.ts` (NO existe `lib/guides`). Funciones: `getArticle`, `listArticles`. Frontmatter: `title, slug, description, keywords, cluster, type, author, reviewer, publishedAt, updatedAt, readingMinutes, heroImage, heroImageAlt, relatedSlugs, draft` — **NO hay `seoTitle` ni `excerpt`** (es `title` + `description`).
- Page: `app/(storefront)/guias/[slug]/page.tsx`. `generateMetadata` arma `<title>` = `${title} — Óptica Carballo`, description = `description`.
- `components/seo/article-jsonld.tsx`: **SÍ renderiza** `<script>` JSON-LD `Article` con author Person + `reviewedBy` + matrícula + publisher (el agente dijo `return null` — FALSO). Lo que falta es subir a `MedicalWebPage` + `lastReviewed` + `about`.
- Componentes reales: `article-header.tsx` (byline), `article-footer.tsx` (WhatsApp CTA), `related-articles.tsx`, `article-card.tsx`. **NO existe** TOC ni author-box dedicado (el agente los inventó).
- Schema components: `article-jsonld`, `breadcrumb-jsonld`, `faq-jsonld` (existe, NO usado en guías), `product-jsonld`, `organization-jsonld`, `website-jsonld`.

---

## 0. Modelo mental
La guía no es un blog post. Es **linkable asset** + **nodo de topic cluster** + **puerta de entrada comercial honesta**. Hace 3 trabajos: (1) responder "qué es X" mejor que el top-3 actual (sitios médicos genéricos sin E-E-A-T local AR ni producto), (2) probar E-E-A-T real (matrícula de la regente = ventaja desleal), (3) derivar a páginas comerciales sin romper confianza ni honestidad YMYL.

| | Pillar (`/guias/astigmatismo`) | Satélite (`/guias/astigmatismo-como-se-ve`) |
|---|---|---|
| Intención | amplia "qué es X" | long-tail específica |
| Longitud | 1.800–2.800 palabras | 900–1.500 |
| Links internos | todos sus satélites + 2-4 comerciales + 1-2 tools | a la pillar (oblig.) + 1-2 hermanos + 1 comercial |

## 1. On-page / técnico
- **`<title>`** (hoy = `title` frontmatter): 50–60 chars, keyword al inicio, "| Óptica Carballo" al final. NUNCA empezar con la marca. → **mejora sugerida**: agregar campo `seoTitle` separado del `title` editorial (hoy son el mismo).
- **Meta description** (`description`): 150–160 chars, keyword en primeros 120, + diferenciador (30+ años / óptica matriculada / asesoramiento) + CTA suave.
- **Slug**: español AR, sin acentos/ñ, guiones, keyword exacta. Pillar = raíz; satélite = raíz + modificador.
- **Headings**: un solo H1 (lo pone la page; el MDX arranca en H2, sin `#` duplicado). H2 = sub-intenciones/PAA, idealmente preguntas reales. H3 = desglose. Meter variantes/LSI AR ("vista cansada"≈presbicia, "graduación", "tóricas", "dioptrías").
- **Answer-first**: primer párrafo bajo el primer H2 = definición autocontenida de **40-55 palabras** (lo que Google levanta como featured snippet). Patrón: `[Término] es [definición]. [matiz práctico].`
- **TOC con jump links**: NO existe componente → **construir** (`<ArticleToc>`), obligatorio en pillars, anchors slugificados desde H2 (cada H2 con `id`). Habilita sitelinks "saltar a sección".
- **Imágenes**: alt descriptivo + keyword natural; `width`/`height` (CLS<0.1); `next/image`; hero no-lazy (LCP), resto lazy. Fotos de producto → pipeline central de scale (regla 15).
- **Canonical** self absoluto (ya lo hace). **hreflang `es-AR`** (regla dura, heredado del layout — verificar).
- **Anti-stuffing**: keyword en H1, primer párrafo, 1-2 H2, conclusión + natural en cuerpo. Campo semántico, no exact-match repetido. Si suena raro leído en voz alta, reescribir.

## 2. Structured data / rich snippets
| Schema | Cuándo | Rich result |
|---|---|---|
| `MedicalWebPage` (salud) / `Article` (no-salud) | siempre | article con autor+fecha |
| `BreadcrumbList` | siempre | migas |
| `Person` author + reviewer + matrícula | siempre | señal E-E-A-T |
| `FAQPage` | si 3-6 PAA reales | acordeón FAQ (CTR alto) |
| `HowTo` | solo procedimientos | pasos en SERP |
| `ImageObject` (hero) | siempre | imagen |

- **MedicalWebPage para guías de salud**: extender `ArticleJsonLd` para emitir `MedicalWebPage` + `about: {MedicalCondition, name}` + `lastReviewed` + `reviewedBy` (matrícula). Article normal para no-salud (forma de cara, tendencias). Hoy emite solo `Article`.
- **FAQPage**: 3-6 preguntas de PAA/research real; las del JSON-LD **idénticas** a las visibles en la página (si no, Google penaliza). Respuestas 40-60 palabras. **GAP**: `faq-jsonld` existe pero no se usa en guías → cablear cuando el frontmatter traiga `faqs[]`.
- **HowTo** solo donde es paso-a-paso real: `como-leer-receta-anteojos` (esfera→cilindro→eje→DNP), `como-elegir-anteojos-por-forma-de-cara`. NO en "qué es la miopía".
- **Breadcrumb**: `Inicio > Guías > [Título]`; en satélites considerar `Inicio > Guías > [Pillar] > [Satélite]` (requiere campo `pillarSlug`).
- Validar siempre en **Rich Results Test** antes de publicar.

## 3. E-E-A-T (nuestro moat)
- **Byline autor** (Juan, Técnico Óptico + matrícula) linkeado a bio + **reviewer** (María Carlota, Regente Matriculada + matrícula) con sello visual. (Hoy en `article-header.tsx` — verificar que muestre matrícula + link a bio.)
- **Fechas visibles** publicado/actualizada, reales (`dateModified` se actualiza de verdad al editar).
- **Fuentes externas** para toda afirmación clínica/estadística/de eficacia: Consejo Argentino de Oftalmología (máxima autoridad AR), Sociedad Arg. de Oftalmología, OMS, AAO, PubMed. Links salientes a autoridades SIN nofollow (asociarse a entidades fuertes es bueno), `target="_blank" rel="noopener"`. Nunca linkear a competencia.
  - Definiciones de consenso NO necesitan fuente; prevalencia, eficacia de tratamiento y claims de producto (blue light, gotas presbicia) SÍ.
- **`<MedicalDisclaimer>`** al final de toda guía de salud ("informativo, revisado por óptica matriculada, no reemplaza al oftalmólogo"). En guías de recetados/contactos reforzar regla dura: no vendemos sin receta válida.
- Link a `/sobre-nosotros` (30 años, matrículas, local físico).

## 4. Link juice interno (PRIORIDAD #1 del founder)
- **Cantidad**: pillar 8-15 links internos; satélite 4-8. ~1 cada 100-120 palabras. Satélite → link a la pillar en los primeros 2 párrafos.
- **Anchor text**: descriptivo y variado. A internos informacionales: exacto/parcial OK. A comerciales: anchor de producto ("ver armazones para lentes con astigmatismo"), NUNCA "click acá"/"leer más". Variar anchors entre artículos al mismo destino.
- **Cuándo derivar a comercial**: el artículo responde primero; el CTA aparece donde es útil. (1) **Inline contextual** en la sección "cómo se corrige/soluciones" (máxima intención). (2) **Bloque al final** (productos + tool) antes del disclaimer. NO empapelar.
- **Anti-canibalización**: el artículo rankea "qué es/cómo/síntomas" (informacional), NO "comprar X" (eso es la categoría). Mantener intención informacional en title/H1.

**Mapeo artículo → comercial (4 pillars):**
| Pillar | Comercial primario | Secundario | Tool |
|---|---|---|---|
| Astigmatismo | lentes tóricas / `/anteojos-de-receta` | armazón por forma de cara | `/lector-de-receta`, `/medidor-de-dnp` |
| Miopía | `/anteojos-de-receta` (+ blue-light si pantallas) | alto índice (miopía alta) | `/lector-de-receta` |
| Hipermetropía | `/anteojos-de-receta` | contactos | `/lector-de-receta` |
| Presbicia | `/anteojos-de-receta` (multifocales) | ocupacionales / `/anteojos-para-computadora` | `/medidor-de-dnp`, `/lector-de-receta` |

- **Links entrantes**: cada categoría comercial debe linkear a la pillar de su cluster ("¿Tenés astigmatismo? Leé la guía"). Tarea del dev/páginas de categoría — el redactor lo deja anotado.

## 5. Ofrecer productos DENTRO del artículo (componentes MDX — A CONSTRUIR)
**GAP raíz: no existe `mdx-components.tsx`** → hoy el MDX no puede embeber React. Construir (server components salvo el acordeón FAQ):
| Componente | Propósito |
|---|---|
| `<KeyTakeaway>` | callout "lo importante" |
| `<MedicalDisclaimer>` | E-E-A-T/legal |
| `<FaqBlock faqs>` | FAQ visible (alimenta FAQPage, mismo contenido) |
| `<ProductCta product>` | ofrece UN producto inline (foto+precio+CTA) |
| `<RelatedProductCard>` xN | grid de productos al final |
| `<CategoryCta>` / `<ToolCta>` | deriva a categoría / herramienta |
| override `<table>` / `<a>` | tablas para snippets / citas con rel correcto |

- **CRÍTICO**: `<ProductCta>`/`<RelatedProductCard>` consumen la **pipeline central de scale** (`lib/catalog/image-scale-overrides.ts`, regla 15 de CLAUDE.md). Prohibido armar `ProductCardData` a mano en el MDX.
- **Qué producto ofrecer**: la solución real del tema (presbicia→multifocales, NO sol; astigmatismo→armazones receta+tóricas). En stock real (regla dura — verificar `PRODUCTS_INVENTORY.md`). Honestidad: opción "con receta válida", nunca cura/urgencia/beneficio no probado. Máx 1 inline + 1 bloque final.

## 6. SEO externo / off-page (honestidad sobre qué controla el artículo)
**Controlable desde el artículo**: ser linkable asset (calidad = backlinks pasivos), citas salientes a autoridades, activos originales (infografía "cómo se ve cada defecto", tablas/fotos propias) que atraen links, Open Graph propio + Twitter `summary_large_image`.
**NO controlable (esfuerzo aparte, continuo)**: link building activo (outreach/guest posts), Google Business Profile + reviews, directorios/NAP, reputación. El artículo planta semillas; el off-page real es un programa sostenido aparte. No vender humo.

## 7. Featured snippet / posición 0 / PAA
1. Definición answer-first 40-55 palabras (§1) → snippet de párrafo.
2. Listas reales (`<ul>/<ol>`, ítems cortos autocontenidos) para "síntomas/tipos/pasos" → snippet de lista.
3. **Tablas** para comparaciones (miopía vs astigmatismo, monofocal vs multifocal) → snippet de tabla. Los clusters de comparación (alto ROI del research) ganan tabla fácil — priorizar.
4. H2 redactados como la pregunta que se busca ("¿El astigmatismo se cura?") + respuesta corta inmediata → captura PAA.

## 8. Checklist final pre-publicación (tilde por tilde antes de quitar `draft`)
**On-page**: título 50-60 + keyword al inicio + marca al final · description 150-160 + keyword temprana + CTA · slug AR sin acentos · un H1 (MDX desde H2) · H2 = sub-intenciones/PAA + LSI · answer-first 40-55 palabras · TOC con jump links (pillar) · imágenes alt+dimensiones+next/image · canonical + hreflang es-AR.
**Schema**: MedicalWebPage/Article + author+reviewer+matrícula + datePublished/dateModified + lastReviewed + about · BreadcrumbList · FAQPage (=visibles) si hay PAA · HowTo si procede · ImageObject · validado en Rich Results Test.
**E-E-A-T**: byline autor+matrícula linkeado · reviewer regente+sello · fechas reales · afirmaciones clínicas con fuente autoritativa · claims honestos (blue light/gotas) **validados por optical-expert** · `<MedicalDisclaimer>` · link a /sobre-nosotros.
**Link juice**: pillar→todos sus satélites / satélite→pillar en primeros 2 párrafos · N en rango · anchors descriptivos variados (cero "click acá") · destino comercial del mapeo §4.4 · CTA inline en "soluciones" + bloque final · no canibaliza transaccional.
**Productos**: solución real del tema · stock real verificado · fotos vía pipeline central (regla 15) · copy del CTA coherente con la honestidad del cuerpo.
**Off-page/social**: OG propio + Twitter card · ≥1 activo original citable (pillar).
**Infra/publicación**: artículo en `sitemap.ts` · dateModified actualizado · revisión humana hecha · claims validados optical-expert + guía firmada por regente antes de sacar `draft`.

## Infraestructura a construir (priorizada)
**P0 (bloquea la master class)** — requiere aprobación founder (regla 3) + audit previo (regla 14):
1. `mdx-components.tsx` con los componentes de §5 (ProductCta/RelatedProductCard vía pipeline scale regla 15).
2. Cablear `FaqPageJsonLd` + `<FaqBlock>` en la page cuando el frontmatter traiga `faqs[]`.
3. Extender `ArticleJsonLd` → `MedicalWebPage` + `lastReviewed` + `about: MedicalCondition` para guías de salud (hoy solo Article).
**P1**: 4. Artículos en `sitemap.ts` (derivar de `listArticles()`, ya excluye drafts) — ya en BACKLOG. 5. Campos frontmatter nuevos: `faqs[]`, `pillarSlug`, `medicalCondition`, `howToSteps?`, `seoTitle?`. 6. Componente TOC (`<ArticleToc>`) — NO existe, construir.
**P2 (upside)**: 7. OG image dedicada por guía. 8. `speakable`. 9. Página de autor/bio (`author.url`).

## Validación externa (no negociable)
- **optical-expert**: todo claim clínico/eficacia/producto (blue light, gotas presbicia, control miópico, tóricas/multifocales).
- **María Carlota Carballo (regente)**: revisión final de cada guía de salud antes de quitar `draft` (lo que firma como `reviewedBy` debe ser real — fake destruye el E-E-A-T que es el moat).
- **Founder**: aprobar la infra P0 (decisión técnica) + confirmar matrículas reales en schemas/bylines.

## Integridad (no negociable)
Cero contenido sin revisión humana, cero keyword stuffing, cero claims sin evidencia, cero reviews falsas, cero urgencia artificial, honestidad sobre limitaciones de productos, `reviewedBy` real con matrícula real. La master class de SEO se gana **siendo el contenido más honesto y mejor respaldado del nicho AR**, no con trucos. Esa honestidad ES el moat de E-E-A-T.
