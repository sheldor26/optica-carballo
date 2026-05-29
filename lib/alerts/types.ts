export type AlertType = 'price_drop' | 'stock_back' | 'both';

export type ProductAlert = {
  id: string;
  user_id: string;
  product_id: string;
  variant_id: string | null;
  alert_type: AlertType;
  target_price_cents: number | null;
  is_active: boolean;
  last_notified_at: string | null;
  baseline_price_cents: number | null;
  baseline_in_stock: boolean | null;
  unsubscribe_token: string;
  created_at: string;
  updated_at: string;
};

export type AlertWithProduct = ProductAlert & {
  product: {
    slug: string;
    name: string;
    brand: { slug: string; name: string };
    category: { slug: string };
  };
  variant: {
    sku: string;
    price_cents: number;
    stock_qty: number;
    attributes: Record<string, unknown>;
  } | null;
};

export const ALERT_TYPE_LABEL: Record<AlertType, string> = {
  price_drop: 'Cuando baje el precio',
  stock_back: 'Cuando vuelva el stock',
  both: 'Cuando baje el precio o vuelva el stock',
};
