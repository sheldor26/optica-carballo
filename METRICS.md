# Óptica Carballo — Métricas y KPIs

## Qué es este archivo

El "panel de instrumentos" del negocio. KPIs definidos, valores actuales, benchmarks y targets. Usado por `agent-manager`, `data-analyst` y por el founder para tomar decisiones basadas en datos.

## Cómo se actualiza

- **Mensual**: `data-analyst` consolida números desde las fuentes (GSC, GA4, Supabase, MP).
- **Snapshots históricos**: cada actualización mantiene los valores previos para comparar.
- **No se modifica manualmente sin actualizar fecha y fuente**.

## Estado actual

🔵 **Pre-launch** — sistema en construcción, sin métricas reales todavía. Los targets son hipótesis a validar.

---

# Bloques de métricas

## 1. Tráfico orgánico (SEO)

| Métrica | Fuente | Frecuencia | Valor actual | Target M3 | Target M6 | Target M12 |
|---------|--------|------------|--------------|-----------|-----------|------------|
| Impresiones totales (GSC) | GSC | Semanal | N/A | 50.000 | 200.000 | 800.000 |
| Clicks totales (GSC) | GSC | Semanal | N/A | 1.500 | 8.000 | 30.000 |
| CTR promedio | GSC | Semanal | N/A | 3% | 4% | 4.5% |
| Posición promedio | GSC | Semanal | N/A | <20 | <12 | <8 |
| Páginas indexadas | GSC | Semanal | N/A | 100+ | 300+ | 600+ |
| Páginas en top 10 | GSC | Mensual | N/A | 20 | 80 | 250 |
| Páginas en top 3 | GSC | Mensual | N/A | 5 | 30 | 100 |
| Backlinks de calidad | Ahrefs/manual | Mensual | N/A | 5 | 20 | 50 |

**Notas**:
- Targets son hipótesis basadas en SEO difficulty bajo de marcas argentinas (6-10) y autoridad del dominio existente.
- M3, M6, M12 = mes 3, 6, 12 post-launch.

## 2. Tráfico total y comportamiento

| Métrica | Fuente | Frecuencia | Valor actual | Target M3 | Target M6 |
|---------|--------|------------|--------------|-----------|-----------|
| Sessions / mes | GA4 | Semanal | N/A | 5.000 | 20.000 |
| Users únicos / mes | GA4 | Semanal | N/A | 3.500 | 14.000 |
| Engagement rate | GA4 | Semanal | N/A | 55%+ | 60%+ |
| Avg engagement time | GA4 | Semanal | N/A | 1:30 | 2:00 |
| Bounce rate | GA4 | Semanal | N/A | <40% | <35% |
| % mobile | GA4 | Semanal | N/A | 65-75% | 65-75% |

## 3. E-commerce / conversión

| Métrica | Fuente | Frecuencia | Valor actual | Target M3 | Target M6 |
|---------|--------|------------|--------------|-----------|-----------|
| Conversion rate (visitor → buyer) | GA4 + Supabase | Semanal | N/A | 1.5% | 2.5% |
| Add to cart rate | GA4 | Semanal | N/A | 8% | 12% |
| Cart abandonment | GA4 + Supabase | Semanal | N/A | <70% | <65% |
| Checkout completion | GA4 + Supabase | Semanal | N/A | >60% | >70% |
| AOV (average order value) | Supabase | Semanal | N/A | $35.000 ARS | $45.000 ARS |
| Pedidos / mes | Supabase | Semanal | N/A | 60 | 250 |
| Revenue / mes (ARS) | Supabase + MP | Semanal | N/A | $2.1M | $11.2M |
| Repeat customer rate | Supabase | Mensual | N/A | 8% | 18% |

**Notas**:
- AOV depende mucho del mix de productos (anteojos receta tienen ticket más alto).
- Revenue targets son escenarios optimistas-realistas con foco SEO sostenido.

## 4. Pagos (Mercado Pago)

| Métrica | Fuente | Frecuencia | Valor actual | Target |
|---------|--------|------------|--------------|--------|
| Approval rate | MP Dashboard | Semanal | N/A | >85% |
| % pagos con cuotas | MP Dashboard | Mensual | N/A | 60%+ |
| % pagos con tarjeta crédito | MP Dashboard | Mensual | N/A | 70% |
| % pagos con efectivo (Rapipago/PF) | MP Dashboard | Mensual | N/A | 10-15% |
| % pagos con MP/MODO | MP Dashboard | Mensual | N/A | 15% |
| Promedio de cuotas elegidas | MP Dashboard | Mensual | N/A | 4-6 |

## 5. Logística

| Métrica | Fuente | Frecuencia | Valor actual | Target |
|---------|--------|------------|--------------|--------|
| Tiempo promedio orden → envío | Supabase | Semanal | N/A | <48h hábiles |
| Tiempo promedio envío → entrega | Correo Argentino | Semanal | N/A | 4-7 días |
| Tasa de devoluciones | Supabase | Mensual | N/A | <3% |
| Tasa de incidencias logísticas | Manual | Mensual | N/A | <2% |
| Tasa de retiro en local | Supabase | Mensual | N/A | 5-10% |

## 6. Features de IA — uso y ROI

### Lector de receta IA

| Métrica | Frecuencia | Valor actual | Target M3 |
|---------|------------|--------------|-----------|
| Uploads / mes | Mensual | N/A | 200 |
| % completados (parseo OK + confirmado) | Mensual | N/A | 75% |
| % que terminan en compra | Mensual | N/A | 35% |
| Costo promedio por uso (USD) | Mensual | N/A | <$0.01 |
| Tiempo promedio de procesamiento | Mensual | N/A | <8s |

### Asistente conversacional

| Métrica | Frecuencia | Valor actual | Target M3 |
|---------|------------|--------------|-----------|
| Conversaciones / mes | Mensual | N/A | 500 |
| Mensajes promedio por conversación | Mensual | N/A | 5-8 |
| % conversaciones → click producto | Mensual | N/A | 25% |
| % conversaciones → compra | Mensual | N/A | 4% |
| % conversaciones → handoff WhatsApp | Mensual | N/A | 12% |
| Costo total / mes (USD) | Mensual | N/A | <$50 |
| Costo por conversación (USD) | Mensual | N/A | <$0.10 |

### Recomendador de monturas

| Métrica | Frecuencia | Valor actual | Target M3 |
|---------|------------|--------------|-----------|
| Usos / mes | Mensual | N/A | 300 |
| % que clickean al menos un producto | Mensual | N/A | 40% |
| % que compran después de usar | Mensual | N/A | 8% |

## 7. WhatsApp como canal

| Métrica | Frecuencia | Valor actual | Target |
|---------|------------|--------------|--------|
| Leads vía WhatsApp / mes | Mensual | N/A | 100 |
| Tasa de conversión WhatsApp → compra | Mensual | N/A | 30%+ |
| Tiempo promedio de primera respuesta | Mensual | N/A | <2h hábiles |
| % WhatsApp con contexto pre-cargado | Mensual | N/A | 95% |

## 8. Costos operativos

| Categoría | Mensual estimado V1 | Real |
|-----------|---------------------|------|
| Vercel | $20 | N/A |
| Supabase | $25 | N/A |
| Resend | $0-20 | N/A |
| API IA (LLM) | $40-100 | N/A |
| OpenAI embeddings | $5-15 | N/A |
| Tusfacturas | $20-40 | N/A |
| Dominio | $1/mes amortizado | N/A |
| **TOTAL fijo aprox** | **$110-220** | N/A |

Costos variables (transaccionales):
- MP fees: ~3.5-6% según método
- Cuotas sin interés asumidas: ~5-8%
- Envíos: cobrados al cliente (no costo neto, salvo subsidiados)

## 9. Salud técnica del sitio

| Métrica | Fuente | Frecuencia | Valor actual | Target |
|---------|--------|------------|--------------|--------|
| LCP (75th percentile) | Vercel Analytics | Semanal | N/A | <2.5s |
| INP (75th percentile) | Vercel Analytics | Semanal | N/A | <200ms |
| CLS (75th percentile) | Vercel Analytics | Semanal | N/A | <0.1 |
| TTFB | Vercel Analytics | Semanal | N/A | <600ms |
| Errores 4xx / semana | Vercel logs | Semanal | N/A | <1% |
| Errores 5xx / semana | Vercel logs | Semanal | N/A | <0.1% |
| Uptime | Vercel | Mensual | N/A | >99.9% |

---

# Snapshots históricos

## [Fecha del primer snapshot — se completa al lanzar]

(Template para snapshots)

```
### Snapshot YYYY-MM-DD

#### Tráfico
- Impresiones: X
- Clicks: X
- Sessions: X

#### Conversión
- Pedidos: X
- Revenue: $X
- Conversion rate: X%

#### Notable de la semana/mes
- [Evento o cambio importante que afectó las métricas]

#### Acciones derivadas
- [Decisión o cambio que se tomó]
```

---

# Alertas configuradas

(Se configuran cuando el sistema esté en producción)

- 🔴 **Critical**: revenue diario cae >50% vs promedio semana anterior
- 🟡 **Warning**: conversion rate cae >25% en 7 días
- 🔵 **Info**: costo IA mensual proyectado >$300

---

# Hipótesis a validar con datos

(Se actualiza con `agent-manager` o `data-analyst` durante reviews)

1. **Páginas de marca argentina rankean en top 10 dentro de 3 meses** con autoridad de dominio + on-page sólido.
2. **El lector de receta IA aumenta conversión >20% en compras con receta** vs flujo manual.
3. **El asistente conversacional reduce abandonos pre-checkout en >15%**.
4. **El WhatsApp handoff convierte 2x más que checkout directo** para productos complejos (recetados con valores altos, primer par de contactos).
5. **Las páginas de uso ("anteojos para computadora", etc.) atraen tráfico de keywords no previstas** (long tail).

Cada hipótesis se evalúa cuando hay datos suficientes (mínimo 100 conversiones por variante).
