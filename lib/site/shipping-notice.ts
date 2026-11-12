/**
 * Plazo de entrega que se publica en el sitio — single source of truth.
 *
 * Es una ESTIMACIÓN, no una promesa: se informa como tal (Ley 24.240 art. 4 y
 * 10 inc. e: información clara y plazos de entrega; art. 10 bis: si se
 * incumple lo ofrecido el consumidor puede exigir cumplimiento o rescindir).
 * Por eso el rango tiene que ser uno que de verdad se cumpla: si los envíos
 * reales lo superan seguido, se cambia ACÁ y se actualizan ficha, carrito y
 * checkout juntos. Pedido del founder 2026-11-12: "entre 7 y 10 días".
 *
 * Pendiente de confirmar con el founder: si son días hábiles o corridos, y que
 * el rango coincida con las entregas reales (las fechas de `delivered_at` en
 * la base son las de marcado manual en el panel, no sirven para medirlo).
 */
export const SHIPPING_ESTIMATE_DAYS = { min: 7, max: 10 } as const;

export const SHIPPING_ORIGIN_LABEL = 'Gobernador Virasoro, Corrientes';
