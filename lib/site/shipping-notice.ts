import { ETA_BUCKETS } from '@/lib/site/shipping-eta';

/**
 * Plazo GENERAL de entrega que se publica cuando todavía no se sabe el destino:
 * el rango total de la tabla por zona (`lib/site/shipping-eta.ts`), en DÍAS HÁBILES
 * desde que se acredita el pago. Es una ESTIMACIÓN, no una promesa: se informa como
 * tal (Ley 24.240 art. 4 y 10 inc. e: información clara y plazos de entrega; art. 10
 * bis: si se incumple lo ofrecido el consumidor puede exigir cumplimiento o rescindir).
 * Por eso los rangos tienen que ser unos que de verdad se cumplan: si los envíos reales
 * los superan seguido, se cambian en `shipping-eta.ts` y se actualiza todo junto.
 * (Antes era una constante "7 a 10 días" a pedido del founder 2026-11-12; el 2026-11-18
 * pidió calcularlo por código postal y usar siempre el servicio estándar.)
 */
const etaValues = Object.values(ETA_BUCKETS);
export const SHIPPING_ESTIMATE_DAYS = {
  min: Math.min(...etaValues.map((b) => b.min)),
  max: Math.max(...etaValues.map((b) => b.max)),
} as const;

export const SHIPPING_ORIGIN_LABEL = 'Gobernador Virasoro, Corrientes';
