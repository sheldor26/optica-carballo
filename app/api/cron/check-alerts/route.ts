import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendAlertEmail } from '@/lib/emails/send-alert-email';
import { secretsMatch } from '@/lib/security/timing-safe-equal';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://opticacarballo.com.ar';

// Anti-spam: no re-notificar la misma alerta dentro de las últimas N horas.
const NOTIFICATION_COOLDOWN_HOURS = 24;

type AlertRow = {
  id: string;
  user_id: string;
  product_id: string;
  variant_id: string | null;
  alert_type: 'price_drop' | 'stock_back' | 'both';
  target_price_cents: number | null;
  last_notified_at: string | null;
  baseline_price_cents: number | null;
  baseline_in_stock: boolean | null;
  unsubscribe_token: string;
  product: {
    slug: string;
    name: string;
    brand: { slug: string };
    category: { slug: string };
  };
  variant: { price_cents: number; stock_qty: number } | null;
};

/**
 * Vercel Cron route — corre cada hora (config en vercel.json).
 * Header `Authorization: Bearer <CRON_SECRET>` valida origen.
 *
 * Algoritmo:
 * 1. SELECT alerts activas + producto + variante actual.
 * 2. Para cada alert: comparar state actual vs baseline para detectar trigger.
 * 3. Si trigger + cooldown OK: enviar email + UPDATE last_notified_at + nuevo baseline.
 */
export async function GET(request: Request) {
  const auth = request.headers.get('authorization') ?? '';
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || !secretsMatch(auth, expected)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Buscar el precio mín activo por producto (cuando alerta es a nivel producto, no variante).
  const cooldownIso = new Date(
    Date.now() - NOTIFICATION_COOLDOWN_HOURS * 3600 * 1000,
  ).toISOString();

  const { data: alerts, error } = await supabase
    .from('product_alerts')
    .select(
      `
        id, user_id, product_id, variant_id, alert_type, target_price_cents,
        last_notified_at, baseline_price_cents, baseline_in_stock, unsubscribe_token,
        product:products!inner(
          slug, name,
          brand:brands!inner(slug),
          category:categories!inner(slug)
        ),
        variant:product_variants(price_cents, stock_qty)
      `,
    )
    .eq('is_active', true)
    .or(`last_notified_at.is.null,last_notified_at.lt.${cooldownIso}`)
    .returns<AlertRow[]>();

  if (error) {
    console.error('[cron/check-alerts] query error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  let triggered = 0;
  let skipped = 0;
  let failed = 0;

  for (const alert of alerts ?? []) {
    try {
      // Para alertas a nivel producto (variant_id NULL): usar precio mínimo y any-in-stock.
      let currentPrice: number | null = null;
      let currentInStock = false;

      if (alert.variant) {
        currentPrice = alert.variant.price_cents;
        currentInStock = alert.variant.stock_qty > 0;
      } else {
        const { data: variants } = await supabase
          .from('product_variants')
          .select('price_cents, stock_qty')
          .eq('product_id', alert.product_id)
          .eq('is_active', true);

        const inStock = (variants ?? []).filter((v) => v.stock_qty > 0);
        if (inStock.length > 0) {
          currentPrice = Math.min(...inStock.map((v) => v.price_cents));
          currentInStock = true;
        } else if (variants && variants.length > 0) {
          currentPrice = Math.min(...variants.map((v) => v.price_cents));
          currentInStock = false;
        }
      }

      if (currentPrice === null) {
        skipped++;
        continue;
      }

      // Triggers
      const wantsPriceDrop = alert.alert_type === 'price_drop' || alert.alert_type === 'both';
      const wantsStockBack = alert.alert_type === 'stock_back' || alert.alert_type === 'both';

      const priceTrigger =
        wantsPriceDrop &&
        ((alert.target_price_cents !== null && currentPrice <= alert.target_price_cents) ||
          (alert.target_price_cents === null &&
            alert.baseline_price_cents !== null &&
            currentPrice < alert.baseline_price_cents));

      const stockTrigger =
        wantsStockBack &&
        alert.baseline_in_stock === false &&
        currentInStock;

      if (!priceTrigger && !stockTrigger) {
        skipped++;
        continue;
      }

      // Email
      const userResp = await supabase.auth.admin.getUserById(alert.user_id);
      const email = userResp.data.user?.email;
      if (!email) {
        skipped++;
        continue;
      }

      const productUrl = `${SITE_URL}/${alert.product.category.slug}/${alert.product.brand.slug}/${alert.product.slug}`;
      await sendAlertEmail({
        toEmail: email,
        productName: alert.product.name,
        productUrl,
        reason: priceTrigger ? 'price_drop' : 'stock_back',
        currentPriceCents: currentPrice,
        previousPriceCents: priceTrigger ? alert.baseline_price_cents : null,
        unsubscribeToken: alert.unsubscribe_token,
      });

      // Update last_notified_at + nuevo baseline (para que la próxima trigger
      // requiera otro cambio, no se re-dispare con el mismo state).
      await supabase
        .from('product_alerts')
        .update({
          last_notified_at: new Date().toISOString(),
          baseline_price_cents: currentPrice,
          baseline_in_stock: currentInStock,
        })
        .eq('id', alert.id);

      triggered++;
    } catch (err) {
      console.error(`[cron/check-alerts] error on alert ${alert.id}:`, err);
      failed++;
    }
  }

  return NextResponse.json({
    ok: true,
    processed: alerts?.length ?? 0,
    triggered,
    skipped,
    failed,
  });
}
