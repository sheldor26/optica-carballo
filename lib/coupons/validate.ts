import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Coupon, CouponValidationResult } from './types';

type CouponRow = {
  id: string;
  code: string;
  description: string | null;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  max_discount_cents: number | null;
  min_subtotal_cents: number | null;
  usage_limit: number | null;
  usage_count: number;
  per_user_limit: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
};

function rowToCoupon(row: CouponRow): Coupon {
  return {
    id: row.id,
    code: row.code,
    description: row.description,
    type: row.type,
    value: row.value,
    maxDiscountCents: row.max_discount_cents,
    minSubtotalCents: row.min_subtotal_cents,
    usageLimit: row.usage_limit,
    usageCount: row.usage_count,
    perUserLimit: row.per_user_limit,
    validFrom: row.valid_from ? new Date(row.valid_from) : null,
    validUntil: row.valid_until ? new Date(row.valid_until) : null,
    isActive: row.is_active,
  };
}

/**
 * Calcula el descuento en centavos que un cupón aplica al subtotal.
 *
 * - percentage: subtotal * value / 100, capeado por maxDiscountCents si seteado.
 * - fixed_amount: value (centavos directos). No puede ser mayor al subtotal.
 * - free_shipping: 0 (el descuento es en el shipping, no en el subtotal).
 */
export function calculateDiscount(
  coupon: Coupon,
  subtotalCents: number,
): number {
  if (coupon.type === 'percentage') {
    const raw = Math.floor((subtotalCents * coupon.value) / 100);
    return coupon.maxDiscountCents !== null
      ? Math.min(raw, coupon.maxDiscountCents)
      : raw;
  }
  if (coupon.type === 'fixed_amount') {
    return Math.min(coupon.value, subtotalCents);
  }
  // free_shipping: descuento en subtotal = 0
  return 0;
}

/**
 * Valida un código de cupón para un usuario + subtotal.
 *
 * Reglas:
 * 1. Cupón existe y es is_active.
 * 2. Fecha válida (valid_from <= now <= valid_until).
 * 3. Subtotal cumple min_subtotal_cents.
 * 4. usage_count < usage_limit (si seteado).
 * 5. Redemptions del user para este cupón < per_user_limit.
 *
 * Devuelve discountCents calculado si OK, o reason específico si falla.
 */
export async function validateCoupon(args: {
  code: string;
  userId: string | null;
  subtotalCents: number;
}): Promise<CouponValidationResult> {
  const code = args.code.trim().toUpperCase();
  if (code.length === 0) {
    return { ok: false, reason: 'not_found', message: 'Ingresá un código.' };
  }

  if (!args.userId) {
    return {
      ok: false,
      reason: 'requires_login',
      message: 'Iniciá sesión para usar un cupón.',
    };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .ilike('code', code)
    .maybeSingle<CouponRow>();

  if (error || !data) {
    return {
      ok: false,
      reason: 'not_found',
      message: 'El código no existe o no es válido.',
    };
  }

  const coupon = rowToCoupon(data);

  if (!coupon.isActive) {
    return {
      ok: false,
      reason: 'inactive',
      message: 'Este cupón no está disponible.',
    };
  }

  const now = new Date();
  if (coupon.validFrom && coupon.validFrom > now) {
    return {
      ok: false,
      reason: 'not_yet_valid',
      message: 'Este cupón todavía no es válido.',
    };
  }
  if (coupon.validUntil && coupon.validUntil < now) {
    return {
      ok: false,
      reason: 'expired',
      message: 'Este cupón expiró.',
    };
  }

  if (
    coupon.minSubtotalCents !== null &&
    args.subtotalCents < coupon.minSubtotalCents
  ) {
    const fmt = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    });
    return {
      ok: false,
      reason: 'min_subtotal',
      message: `Este cupón requiere una compra mínima de ${fmt.format(coupon.minSubtotalCents / 100)}.`,
    };
  }

  if (
    coupon.usageLimit !== null &&
    coupon.usageCount >= coupon.usageLimit
  ) {
    return {
      ok: false,
      reason: 'usage_limit_reached',
      message: 'Este cupón se agotó.',
    };
  }

  // Per-user limit: contar redemptions del user para este cupón.
  const { count: userRedemptions } = await supabase
    .from('coupon_redemptions')
    .select('id', { count: 'exact', head: true })
    .eq('coupon_id', coupon.id)
    .eq('user_id', args.userId);

  if (userRedemptions !== null && userRedemptions >= coupon.perUserLimit) {
    return {
      ok: false,
      reason: 'per_user_limit_reached',
      message: 'Ya usaste este cupón.',
    };
  }

  const discountCents = calculateDiscount(coupon, args.subtotalCents);

  return {
    ok: true,
    coupon,
    discountCents,
    removeShipping: coupon.type === 'free_shipping',
  };
}
