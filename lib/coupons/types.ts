export type CouponType = 'percentage' | 'fixed_amount' | 'free_shipping';

export type Coupon = {
  id: string;
  code: string;
  description: string | null;
  type: CouponType;
  value: number;
  maxDiscountCents: number | null;
  minSubtotalCents: number | null;
  usageLimit: number | null;
  usageCount: number;
  perUserLimit: number;
  validFrom: Date | null;
  validUntil: Date | null;
  isActive: boolean;
};

export type CouponValidationResult =
  | {
      ok: true;
      coupon: Coupon;
      discountCents: number;
      /** Solo si type === 'free_shipping'. Caller debe poner shipping=0. */
      removeShipping: boolean;
    }
  | {
      ok: false;
      reason:
        | 'not_found'
        | 'inactive'
        | 'expired'
        | 'not_yet_valid'
        | 'min_subtotal'
        | 'usage_limit_reached'
        | 'per_user_limit_reached'
        | 'requires_login';
      /** Texto user-friendly del motivo. */
      message: string;
    };
